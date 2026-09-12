# -*- coding: utf-8 -*-
"""养成桌宠：玩法在 life/，模样在 packs/。"""

from __future__ import annotations

import ctypes
import math
import os
import sys
import threading
import time
from ctypes import wintypes
from pathlib import Path

import numpy as np
import win32con
import win32gui
from PIL import Image, ImageDraw, ImageFont

from life.clock import WallClock
from life.session import LifeSession
from life.store import JsonFileStore
from life.types import Option
from pack import load_pack

ROOT = Path(os.path.dirname(os.path.abspath(__file__)))
LOG_PATH = ROOT / "debug.log"

WINDOW_CLASS = "RaisePackPet"
TIMER_ID = 1
WM_USER_HOME = 0x0400 + 1
MK_LBUTTON = 0x0001
IDC_ARROW = 32512
SPI_GETWORKAREA = 0x0030
ULW_ALPHA = 0x02
AC_SRC_OVER = 0x00
AC_SRC_ALPHA = 0x01
WS_EX_LAYERED = 0x00080000
WS_EX_TOPMOST = 0x00000008
WS_EX_TOOLWINDOW = 0x00000080
MARGIN = 36
BOB_SECONDS = 2.8
ID_HOME = 900
ID_QUIT = 901

user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32

try:
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
except Exception:
    user32.SetProcessDPIAware()


class POINT(ctypes.Structure):
    _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]


class SIZE(ctypes.Structure):
    _fields_ = [("cx", ctypes.c_long), ("cy", ctypes.c_long)]


class BLENDFUNCTION(ctypes.Structure):
    _fields_ = [
        ("BlendOp", ctypes.c_byte),
        ("BlendFlags", ctypes.c_byte),
        ("SourceConstantAlpha", ctypes.c_byte),
        ("AlphaFormat", ctypes.c_byte),
    ]


class BITMAPINFOHEADER(ctypes.Structure):
    _fields_ = [
        ("biSize", wintypes.DWORD),
        ("biWidth", wintypes.LONG),
        ("biHeight", wintypes.LONG),
        ("biPlanes", wintypes.WORD),
        ("biBitCount", wintypes.WORD),
        ("biCompression", wintypes.DWORD),
        ("biSizeImage", wintypes.DWORD),
        ("biXPelsPerMeter", wintypes.LONG),
        ("biYPelsPerMeter", wintypes.LONG),
        ("biClrUsed", wintypes.DWORD),
        ("biClrImportant", wintypes.DWORD),
    ]


class BITMAPINFO(ctypes.Structure):
    _fields_ = [("bmiHeader", BITMAPINFOHEADER), ("bmiColors", wintypes.DWORD * 3)]


def log(message: str) -> None:
    with open(LOG_PATH, "a", encoding="utf-8") as stream:
        stream.write(message + "\n")


def rgba_to_layered(im: Image.Image) -> bytes:
    arr = np.array(im.convert("RGBA"), dtype=np.uint8)
    a = arr[:, :, 3].astype(np.uint16)
    out = np.empty(arr.shape, dtype=np.uint8)
    out[:, :, 0] = (arr[:, :, 2].astype(np.uint16) * a // 255).astype(np.uint8)
    out[:, :, 1] = (arr[:, :, 1].astype(np.uint16) * a // 255).astype(np.uint8)
    out[:, :, 2] = (arr[:, :, 0].astype(np.uint16) * a // 255).astype(np.uint8)
    out[:, :, 3] = arr[:, :, 3]
    return np.ascontiguousarray(out).tobytes()


def load_font(size: int) -> ImageFont.ImageFont:
    for path in (
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyh.ttf",
        r"C:\Windows\Fonts\simhei.ttf",
    ):
        if os.path.isfile(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def tint_rgba(im: Image.Image, kind: str) -> Image.Image:
    if kind == "none":
        return im
    arr = np.array(im.convert("RGBA"))
    if kind == "green":
        arr[:, :, 0] = (arr[:, :, 0].astype(np.uint16) * 170 // 255).astype(np.uint8)
        arr[:, :, 2] = (arr[:, :, 2].astype(np.uint16) * 170 // 255).astype(np.uint8)
    elif kind == "gray":
        gray = (
            arr[:, :, 0].astype(np.uint16)
            + arr[:, :, 1].astype(np.uint16)
            + arr[:, :, 2].astype(np.uint16)
        ) // 3
        arr[:, :, 0] = arr[:, :, 1] = arr[:, :, 2] = gray.astype(np.uint8)
    return Image.fromarray(arr)


class Pet:
    def __init__(self) -> None:
        self.pack = load_pack(ROOT)
        self.session = LifeSession(
            JsonFileStore(self.pack.folder / "save.json"),
            WallClock(),
        )
        self.hwnd = 0
        self.hbmp = None
        self.bits = None
        self.buf_size = 0
        self.width = 1
        self.height = 1
        self.margin = MARGIN
        self.stills: dict[str, Image.Image] = {}
        self.frame_alpha = None
        self.rest_x = 0
        self.rest_y = 0
        self.dragging = False
        self.moved = False
        self.press_x = 0
        self.press_y = 0
        self.drag_dx = 0
        self.drag_dy = 0
        self.flash_bubble: str | None = None
        self.flash_until = 0.0
        self.font = load_font(18)
        self._wndproc = None
        self._menu_by_id: dict[int, Option] = {}
        self.sprite_w = 1
        self.sprite_h = 1
        self.t0 = time.perf_counter()

    def work_area(self) -> tuple[int, int, int, int]:
        rect = wintypes.RECT()
        user32.SystemParametersInfoW(SPI_GETWORKAREA, 0, ctypes.byref(rect), 0)
        return rect.left, rect.top, rect.right, rect.bottom

    def load_sprites(self) -> None:
        idle = Image.open(self.pack.idle()).convert("RGBA")
        left, top, right, bottom = self.work_area()
        work_h = max(1, bottom - top)
        target_h = min(max(int(work_h * 0.28), 280), 480)
        target_w = max(1, round(idle.width * target_h / idle.height))
        self.sprite_w, self.sprite_h = target_w, target_h
        self.stills = {
            "idle": idle.resize((target_w, target_h), Image.Resampling.LANCZOS)
        }
        self.frame_w, self.frame_h = target_w, target_h
        self.width = target_w + self.margin * 2
        self.height = target_h + self.margin * 2
        self.frame_alpha = np.array(self.stills["idle"].split()[-1])

    def sprite_for(self, key: str) -> Image.Image:
        cached = self.stills.get(key)
        if cached is not None:
            return cached
        src = Image.open(self.pack.still(key)).convert("RGBA")
        fitted = src.resize((self.sprite_w, self.sprite_h), Image.Resampling.LANCZOS)
        self.stills[key] = fitted
        return fitted

    def make_dib(self) -> None:
        bmi = BITMAPINFO()
        bmi.bmiHeader.biSize = ctypes.sizeof(BITMAPINFOHEADER)
        bmi.bmiHeader.biWidth = self.width
        bmi.bmiHeader.biHeight = -self.height
        bmi.bmiHeader.biPlanes = 1
        bmi.bmiHeader.biBitCount = 32
        bits = ctypes.c_void_p()
        screen_dc = user32.GetDC(0)
        bitmap = gdi32.CreateDIBSection(
            screen_dc, ctypes.byref(bmi), 0, ctypes.byref(bits), None, 0
        )
        user32.ReleaseDC(0, screen_dc)
        if not bitmap or not bits:
            raise RuntimeError("CreateDIBSection failed")
        self.hbmp = bitmap
        self.bits = bits
        self.buf_size = self.width * self.height * 4

    def compose(self) -> Image.Image:
        view = self.session.view()
        sprite = tint_rgba(self.sprite_for(view.still), view.tint)
        if view.performance != "dead":
            u = (time.perf_counter() - self.t0) / BOB_SECONDS
            squash = 0.018 * math.sin(u * math.pi * 2.0)
            new_h = max(1, round(sprite.height * (1.0 - squash)))
            sprite = sprite.resize((sprite.width, new_h), Image.Resampling.BILINEAR)
        canvas = Image.new("RGBA", (self.width, self.height), (0, 0, 0, 0))
        x = self.margin
        y = self.height - self.margin - sprite.height
        canvas.paste(sprite, (x, y), sprite)
        text = self.flash_bubble if time.perf_counter() < self.flash_until else view.bubble
        if text:
            draw = ImageDraw.Draw(canvas)
            draw.text((self.margin, 6), text, font=self.font, fill=(40, 40, 48, 230))
        pad = Image.new("L", (self.frame_w, self.frame_h), 0)
        pad.paste(sprite.split()[-1], (0, self.frame_h - sprite.height))
        self.frame_alpha = np.array(pad)
        return canvas

    def paint(self) -> None:
        if not self.hwnd or not self.hbmp:
            return
        data = rgba_to_layered(self.compose())
        ctypes.memmove(self.bits, data, min(len(data), self.buf_size))
        screen_dc = user32.GetDC(0)
        memory_dc = gdi32.CreateCompatibleDC(screen_dc)
        old_bitmap = gdi32.SelectObject(memory_dc, self.hbmp)
        blend = BLENDFUNCTION(AC_SRC_OVER, 0, 255, AC_SRC_ALPHA)
        left, top, _, _ = win32gui.GetWindowRect(self.hwnd)
        destination = POINT(left, top)
        size = SIZE(self.width, self.height)
        source = POINT(0, 0)
        user32.UpdateLayeredWindow(
            self.hwnd,
            screen_dc,
            ctypes.byref(destination),
            ctypes.byref(size),
            memory_dc,
            ctypes.byref(source),
            0,
            ctypes.byref(blend),
            ULW_ALPHA,
        )
        gdi32.SelectObject(memory_dc, old_bitmap)
        gdi32.DeleteDC(memory_dc)
        user32.ReleaseDC(0, screen_dc)

    def bottom_right(self) -> tuple[int, int]:
        left, top, right, bottom = self.work_area()
        gap = max(18, int((bottom - top) * 0.025))
        return right - self.width - gap, bottom - self.height - gap

    def move_home(self) -> None:
        x, y = self.bottom_right()
        self.rest_x, self.rest_y = x, y
        win32gui.SetWindowPos(
            self.hwnd,
            win32con.HWND_TOPMOST,
            x,
            y,
            self.width,
            self.height,
            win32con.SWP_SHOWWINDOW,
        )
        self.paint()

    def hit_opaque(self, screen_x: int, screen_y: int) -> bool:
        if self.frame_alpha is None:
            return False
        left, top, _, _ = win32gui.GetWindowRect(self.hwnd)
        x = screen_x - left - self.margin
        y = screen_y - top - (self.height - self.margin - self.frame_h)
        h, w = self.frame_alpha.shape
        return 0 <= x < w and 0 <= y < h and int(self.frame_alpha[y, x]) > 24

    def start_drag(self) -> None:
        cursor_x, cursor_y = win32gui.GetCursorPos()
        left, top, _, _ = win32gui.GetWindowRect(self.hwnd)
        self.dragging = True
        self.moved = False
        self.press_x, self.press_y = cursor_x, cursor_y
        self.drag_dx, self.drag_dy = cursor_x - left, cursor_y - top
        win32gui.SetCapture(self.hwnd)

    def drag_to_cursor(self) -> None:
        if not self.dragging:
            return
        cursor_x, cursor_y = win32gui.GetCursorPos()
        if not self.moved:
            self.moved = (
                abs(cursor_x - self.press_x) >= 7 or abs(cursor_y - self.press_y) >= 7
            )
        if not self.moved:
            return
        x = cursor_x - self.drag_dx
        y = cursor_y - self.drag_dy
        self.rest_x, self.rest_y = x, y
        win32gui.SetWindowPos(
            self.hwnd,
            win32con.HWND_TOPMOST,
            x,
            y,
            self.width,
            self.height,
            win32con.SWP_SHOWWINDOW,
        )

    def end_drag(self) -> None:
        if not self.dragging:
            return
        self.dragging = False
        self.moved = False
        try:
            win32gui.ReleaseCapture()
        except win32gui.error:
            pass

    def _append_options(self, menu, options: tuple[Option, ...], nid: int) -> int:
        for option in options:
            if option.children:
                sub = win32gui.CreatePopupMenu()
                nid = self._append_options(sub, option.children, nid)
                win32gui.AppendMenu(menu, win32con.MF_POPUP, sub, option.label)
                continue
            flags = win32con.MF_STRING
            if not self.session.option_enabled(option):
                flags |= win32con.MF_GRAYED
            win32gui.AppendMenu(menu, flags, nid, option.label)
            self._menu_by_id[nid] = option
            nid += 1
        return nid

    def popup(self) -> None:
        self.session.view()
        self._menu_by_id = {}
        menu = win32gui.CreatePopupMenu()
        self._append_options(menu, self.pack.options, 1)
        win32gui.AppendMenu(menu, win32con.MF_SEPARATOR, 0, "")
        win32gui.AppendMenu(menu, win32con.MF_STRING, ID_HOME, "回到右下角")
        win32gui.AppendMenu(menu, win32con.MF_STRING, ID_QUIT, "退出")
        x, y = win32gui.GetCursorPos()
        win32gui.SetForegroundWindow(self.hwnd)
        command = win32gui.TrackPopupMenu(
            menu,
            win32con.TPM_LEFTALIGN | win32con.TPM_RIGHTBUTTON | win32con.TPM_RETURNCMD,
            x,
            y,
            0,
            self.hwnd,
            None,
        )
        win32gui.DestroyMenu(menu)
        if command == ID_HOME:
            self.move_home()
            return
        if command == ID_QUIT:
            win32gui.DestroyWindow(self.hwnd)
            return
        option = self._menu_by_id.get(command)
        if option is None:
            return
        ack = self.session.act(option)
        self.flash_bubble = ack.bubble or None
        self.flash_until = time.perf_counter() + 1.6
        self.paint()

    def tick(self) -> None:
        self.paint()

    def wndproc(self, hwnd, message, wparam, lparam):
        if message == win32con.WM_NCHITTEST:
            x, y = win32gui.GetCursorPos()
            return win32con.HTCLIENT if self.hit_opaque(x, y) else win32con.HTTRANSPARENT
        if message == win32con.WM_LBUTTONDOWN:
            if wparam & MK_LBUTTON:
                self.start_drag()
            return 0
        if message == win32con.WM_MOUSEMOVE:
            if self.dragging:
                self.drag_to_cursor()
            return 0
        if message == win32con.WM_LBUTTONUP:
            self.end_drag()
            return 0
        if message in (win32con.WM_RBUTTONUP, win32con.WM_CONTEXTMENU):
            self.end_drag()
            self.popup()
            return 0
        if message == win32con.WM_TIMER and wparam == TIMER_ID:
            self.tick()
            return 0
        if message == WM_USER_HOME:
            self.move_home()
            return 0
        if message == win32con.WM_CLOSE:
            user32.KillTimer(hwnd, TIMER_ID)
            self.session.close()
            win32gui.DestroyWindow(hwnd)
            return 0
        if message == win32con.WM_DESTROY:
            win32gui.PostQuitMessage(0)
            return 0
        return win32gui.DefWindowProc(hwnd, message, wparam, lparam)

    def start_tray(self) -> None:
        try:
            import pystray
        except Exception as error:
            log("tray skipped: " + str(error))
            return
        icon_image = self.stills["idle"]
        hwnd = self.hwnd
        name = self.pack.name

        def home(icon, item):
            win32gui.PostMessage(hwnd, WM_USER_HOME, 0, 0)

        def quit_pet(icon, item):
            icon.stop()
            win32gui.PostMessage(hwnd, win32con.WM_CLOSE, 0, 0)

        icon = pystray.Icon(
            "raise-pack-pet",
            icon_image,
            name,
            pystray.Menu(
                pystray.MenuItem("回到右下角", home),
                pystray.MenuItem("退出", quit_pet),
            ),
        )
        threading.Thread(target=icon.run, daemon=True).start()

    def create(self) -> None:
        self.load_sprites()
        self.make_dib()
        x, y = self.bottom_right()
        self.rest_x, self.rest_y = x, y
        window_class = win32gui.WNDCLASS()
        self._wndproc = self.wndproc
        window_class.lpfnWndProc = self._wndproc
        window_class.lpszClassName = WINDOW_CLASS
        window_class.hInstance = win32gui.GetModuleHandle(None)
        window_class.hCursor = win32gui.LoadCursor(0, IDC_ARROW)
        try:
            win32gui.RegisterClass(window_class)
        except win32gui.error:
            pass
        self.hwnd = win32gui.CreateWindowEx(
            WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TOOLWINDOW,
            WINDOW_CLASS,
            self.pack.name,
            win32con.WS_POPUP,
            x,
            y,
            self.width,
            self.height,
            0,
            0,
            window_class.hInstance,
            None,
        )
        if not self.hwnd:
            raise RuntimeError("CreateWindowEx failed")
        win32gui.ShowWindow(self.hwnd, win32con.SW_SHOW)
        win32gui.SetWindowPos(
            self.hwnd,
            win32con.HWND_TOPMOST,
            x,
            y,
            self.width,
            self.height,
            win32con.SWP_SHOWWINDOW,
        )
        self.paint()
        user32.SetTimer(self.hwnd, TIMER_ID, 16, None)
        self.start_tray()
        log(f"hwnd={self.hwnd} pack={self.pack.pack_id}")

    def run(self) -> None:
        self.create()
        win32gui.PumpMessages()
        if self.hbmp:
            gdi32.DeleteObject(self.hbmp)


def main() -> None:
    if LOG_PATH.is_file():
        LOG_PATH.unlink()
    log("start " + sys.executable)
    try:
        pack = load_pack(ROOT)
        pack.idle()
    except FileNotFoundError:
        log("missing idle")
        ctypes.windll.user32.MessageBoxW(
            0,
            "还没有人物图。把全身 PNG 放到 packs\\example\\assets\\idle.png，或新建一个 pack，再把名字写进 packs\\active.txt。",
            "养成桌宠",
            0x40,
        )
        return
    Pet().run()
    log("exit")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        import traceback

        log(traceback.format_exc())
        raise
