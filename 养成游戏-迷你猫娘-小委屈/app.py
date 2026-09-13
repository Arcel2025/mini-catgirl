# -*- coding: utf-8 -*-
"""养成窗口：立绘铺底，菜单改数值，再切下一张立绘。"""

from __future__ import annotations

import os
import time
import tkinter as tk
from tkinter import font as tkfont
from pathlib import Path

from PIL import Image, ImageTk

from life.clock import WallClock
from life.core import new_save
from life.session import LifeSession
from life.slots import list_slots, slot_path
from life.store import JsonFileStore
from life.types import Option, SceneBeat, SceneChoice, beat_speech, walk_options
from pack import load_pack

ROOT = Path(os.path.dirname(os.path.abspath(__file__)))
DEMO_HUNGER = 30.0
PANEL_W = 328
FADE_MS = 40
FADE_STEPS = 36
TITLE_HOLD_MS = 400

BG = "#161412"
PANEL = "#221f1c"
LINE = "#3a3530"
TEXT = "#f4eee6"
MUTED = "#b7aea3"
ACCENT = "#d36a4e"
BAR_BG = "#3a3530"
BAR_FILL = "#e08a55"
BTN = "#3a312c"
DIALOG_BG = "#141210"
DIALOG_LINE = "#6a5e50"


def _pick_font(size: int, weight: str = "normal") -> tkfont.Font:
    names = set(tkfont.families())
    for family in ("Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI"):
        if family in names:
            return tkfont.Font(family=family, size=size, weight=weight)
    return tkfont.Font(size=size, weight=weight)


class RaiseWindow:
    def __init__(self) -> None:
        self.pack = load_pack(ROOT)
        self.session: LifeSession | None = None
        self.root = tk.Tk()
        self.root.title(self.pack.name)
        self.root.configure(bg=BG)
        self.root.geometry("1040x900")
        self.root.minsize(920, 760)
        self.photo: ImageTk.PhotoImage | None = None
        self._shown_still: str | None = None
        self._last_size = (0, 0)
        self._playing = False
        self._mode = "title_fade"
        self._slot_action = "new"
        self._title_alpha = 0.0
        self._title_src = Image.open(self.pack.cover()).convert("RGB")
        self._scene: tuple[SceneBeat, ...] = ()
        self._scene_i = 0
        self._scene_gen = 0
        self._scene_log = ""
        self._fading = False
        self._fade_alpha = 0.0
        self._fade_gen = 0
        self._fade_src: Image.Image | None = None
        self._frame_rgb: Image.Image | None = None
        self._build()
        self.root.update_idletasks()
        self.root.after(80, self._begin_title)

    def _build(self) -> None:
        self.ui_font = _pick_font(11)
        self.title_font = _pick_font(16, "bold")
        self.card_font = _pick_font(28, "bold")
        self.stat_font = _pick_font(12)
        self.small_font = _pick_font(10)
        self.dialog_name_font = _pick_font(12, "bold")
        self.dialog_body_font = _pick_font(13)

        shell = tk.Frame(self.root, bg=BG)
        shell.pack(fill=tk.BOTH, expand=True, padx=16, pady=16)

        self.side = tk.Frame(shell, bg=PANEL, width=PANEL_W)
        self.side.pack_propagate(False)
        side = self.side

        self.stage = tk.Frame(shell, bg="#000000")
        self.stage.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        self.art = tk.Label(self.stage, bg="#000000", bd=0, cursor="arrow")
        self.art.pack(fill=tk.BOTH, expand=True)
        self.art.bind("<Configure>", self._on_resize)
        self.art.bind("<Button-1>", self._on_stage_click)
        self.stage.bind("<Button-1>", self._on_stage_click)

        self.card_label = tk.Label(
            self.stage,
            text="",
            bg="#000000",
            fg=TEXT,
            font=self.card_font,
            justify="center",
        )

        self.dialog = tk.Frame(
            self.stage,
            bg=DIALOG_BG,
            highlightbackground=DIALOG_LINE,
            highlightthickness=1,
            cursor="hand2",
        )
        inner = tk.Frame(self.dialog, bg=DIALOG_BG)
        inner.pack(fill=tk.BOTH, expand=True, padx=16, pady=12)
        inner.bind("<Button-1>", self._on_stage_click)
        self.dialog_who = tk.Label(
            inner,
            text="",
            bg=DIALOG_BG,
            fg=ACCENT,
            font=self.dialog_name_font,
            anchor="w",
        )
        self.dialog_row = tk.Frame(inner, bg=DIALOG_BG)
        self.dialog_row.pack(fill=tk.BOTH, expand=True)
        self.dialog_hint = tk.Label(
            self.dialog_row,
            text="▼",
            bg=DIALOG_BG,
            fg=MUTED,
            font=self.small_font,
            anchor="se",
        )
        self.dialog_hint.pack(side=tk.RIGHT, padx=(8, 0), pady=(12, 0))
        self.dialog_body = tk.Label(
            self.dialog_row,
            text="",
            bg=DIALOG_BG,
            fg=TEXT,
            font=self.dialog_body_font,
            wraplength=420,
            justify=tk.LEFT,
            anchor="nw",
        )
        self.dialog_body.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.dialog.bind("<Button-1>", self._on_stage_click)
        self.dialog_who.bind("<Button-1>", self._on_stage_click)
        self.dialog_body.bind("<Button-1>", self._on_stage_click)
        self.dialog_hint.bind("<Button-1>", self._on_stage_click)

        self.choice = tk.Frame(
            self.stage,
            bg=DIALOG_BG,
            highlightbackground=DIALOG_LINE,
            highlightthickness=1,
        )
        self.choice_prompt = tk.Label(
            self.choice,
            text="",
            bg=DIALOG_BG,
            fg=TEXT,
            font=self.dialog_name_font,
            justify=tk.CENTER,
        )
        self.choice_prompt.pack(fill=tk.X, padx=18, pady=(14, 8))
        self.choice_btns = tk.Frame(self.choice, bg=DIALOG_BG)
        self.choice_btns.pack(fill=tk.X, padx=18, pady=(0, 14))

        tk.Label(
            side,
            text=self.pack.name,
            bg=PANEL,
            fg=TEXT,
            font=self.title_font,
            anchor="w",
        ).pack(fill=tk.X, padx=18, pady=(18, 4))
        self.side_hint = tk.Label(
            side,
            text="点一项互动，立绘和数字会一起变。",
            bg=PANEL,
            fg=MUTED,
            font=self.small_font,
            anchor="w",
            wraplength=280,
            justify=tk.LEFT,
        )
        self.side_hint.pack(fill=tk.X, padx=18, pady=(0, 12))

        self.still_var = tk.StringVar(value="当前立绘  idle")
        tk.Label(
            side,
            textvariable=self.still_var,
            bg=PANEL,
            fg=MUTED,
            font=self.small_font,
            anchor="w",
        ).pack(fill=tk.X, padx=18, pady=(0, 10))

        self.stat_box = tk.Frame(side, bg=PANEL)
        self.stat_box.pack(fill=tk.X, padx=18)
        self.stat_rows: dict[str, tuple[tk.Label, tk.Canvas]] = {}
        for key, label in (
            ("hunger", "饥饿"),
            ("cleanliness", "清洁"),
            ("mood", "心情"),
            ("health", "健康"),
        ):
            self._add_stat_row(key, label)

        self.gold_var = tk.StringVar(value="金币 0")
        tk.Label(
            side,
            textvariable=self.gold_var,
            bg=PANEL,
            fg=TEXT,
            font=self.stat_font,
            anchor="w",
        ).pack(fill=tk.X, padx=18, pady=(8, 12))

        tk.Frame(side, bg=LINE, height=1).pack(fill=tk.X, padx=18, pady=(0, 10))
        self.interact_box = tk.Frame(side, bg=PANEL)
        self.interact_box.pack(fill=tk.X)
        tk.Label(
            self.interact_box,
            text="互动",
            bg=PANEL,
            fg=MUTED,
            font=self.small_font,
            anchor="w",
        ).pack(fill=tk.X, padx=18, pady=(0, 6))

        menu = tk.Frame(self.interact_box, bg=PANEL)
        menu.pack(fill=tk.X, padx=14)
        self.buttons: dict[str, tk.Button] = {}
        for option in self.pack.options:
            if option.intro:
                continue
            if option.children:
                box = tk.LabelFrame(
                    menu,
                    text=option.label,
                    bg=PANEL,
                    fg=MUTED,
                    font=self.small_font,
                    bd=1,
                    relief=tk.FLAT,
                    labelanchor="nw",
                )
                box.pack(fill=tk.X, pady=(0, 8), padx=4)
                for child in option.children:
                    self._add_button(box, child)
            else:
                self._add_button(menu, option)

        self.log = tk.Label(
            side,
            text="",
            bg=PANEL,
            fg=ACCENT,
            font=self.small_font,
            wraplength=280,
            justify=tk.LEFT,
            anchor="nw",
            height=4,
        )
        self.log.pack(fill=tk.BOTH, expand=True, padx=18, pady=(12, 18))

        self.title_bar = tk.Frame(
            self.stage,
            bg=DIALOG_BG,
            highlightbackground=DIALOG_LINE,
            highlightthickness=1,
        )
        self.title_hint = tk.Label(
            self.title_bar,
            text="",
            bg=DIALOG_BG,
            fg=MUTED,
            font=self.small_font,
            wraplength=420,
            justify=tk.CENTER,
        )
        self.title_hint.pack(fill=tk.X, padx=18, pady=(14, 6))
        self.title_btns = tk.Frame(self.title_bar, bg=DIALOG_BG)
        self.title_btns.pack(fill=tk.X, padx=18, pady=(0, 16))

    def _begin_title(self) -> None:
        self._mode = "title_fade"
        self._title_alpha = 0.0
        self._hide_dialog()
        self._hide_choice()
        self.title_bar.place_forget()
        self._draw_title_frame()
        self.root.after(TITLE_HOLD_MS, self._fade_title)

    def _fade_title(self) -> None:
        if self._mode != "title_fade" or not self.root.winfo_exists():
            return
        self._title_alpha = min(1.0, self._title_alpha + 1.0 / FADE_STEPS)
        self._draw_title_frame()
        if self._title_alpha >= 1.0:
            self._mode = "title_menu"
            self._show_title_menu()
            return
        self.root.after(FADE_MS, self._fade_title)

    def _draw_title_frame(self) -> None:
        box_w = max(self.art.winfo_width(), 200)
        box_h = max(self.art.winfo_height(), 200)
        source = self._title_src
        src_w, src_h = source.size
        scale = min(box_w / src_w, box_h / src_h)
        new_w = max(1, int(src_w * scale))
        new_h = max(1, int(src_h * scale))
        fitted = source.resize((new_w, new_h), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (box_w, box_h), (0, 0, 0))
        canvas.paste(fitted, ((box_w - new_w) // 2, (box_h - new_h) // 2))
        black = Image.new("RGB", (box_w, box_h), (0, 0, 0))
        if self._title_alpha <= 0:
            shown = black
        elif self._title_alpha >= 1:
            shown = canvas
        else:
            shown = Image.blend(black, canvas, self._title_alpha)
        self.photo = ImageTk.PhotoImage(shown)
        self.art.config(image=self.photo)

    def _clear_title_buttons(self) -> None:
        for child in self.title_btns.winfo_children():
            child.destroy()

    def _add_title_button(self, label: str, command, *, enabled: bool = True) -> None:
        btn = tk.Button(
            self.title_btns,
            text=label,
            font=self.ui_font,
            bg=BTN,
            fg=TEXT,
            activebackground=ACCENT,
            activeforeground=TEXT,
            disabledforeground=MUTED,
            relief=tk.FLAT,
            bd=0,
            padx=12,
            pady=7,
            cursor="hand2" if enabled else "arrow",
            state=tk.NORMAL if enabled else tk.DISABLED,
            command=command,
        )
        btn.pack(fill=tk.X, pady=4)

    def _place_title_bar(self) -> None:
        self.title_bar.place(relx=0.5, rely=0.90, relwidth=0.56, anchor="s", y=-28)
        self.title_bar.lift()

    def _show_title_menu(self) -> None:
        self._mode = "title_menu"
        self._title_alpha = 1.0
        self._draw_title_frame()
        self._clear_title_buttons()
        self.title_hint.config(text=self.pack.name)
        self._add_title_button("新游戏", self._on_new_game)
        self._add_title_button("读取档案", self._on_load_game)
        self._place_title_bar()

    def _on_new_game(self) -> None:
        self._slot_action = "new"
        self._show_slots("存到哪个档案")

    def _on_load_game(self) -> None:
        self._slot_action = "load"
        self._show_slots("读哪个档案")

    def _show_slots(self, hint: str) -> None:
        self._mode = "title_slots"
        self._clear_title_buttons()
        rows = list_slots(self.pack.folder)
        if self._slot_action == "load" and all(row.empty for row in rows):
            self.title_hint.config(text="还没有档案")
        else:
            self.title_hint.config(text=hint)
        for row in rows:
            enabled = True
            if self._slot_action == "load" and row.empty:
                enabled = False
            self._add_title_button(
                row.label,
                lambda i=row.index, empty=row.empty: self._on_slot(i, empty),
                enabled=enabled,
            )
        self._add_title_button("返回", self._show_title_menu)
        self._place_title_bar()

    def _on_slot(self, index: int, empty: bool) -> None:
        if self._slot_action == "load":
            if empty:
                return
            self._enter_slot(index, fresh=False)
            return
        if not empty:
            self._confirm_overwrite(index)
            return
        self._enter_slot(index, fresh=True)

    def _confirm_overwrite(self, index: int) -> None:
        self._clear_title_buttons()
        self.title_hint.config(text=f"档案 {index} 已有进度，覆盖？")
        self._add_title_button("覆盖", lambda: self._enter_slot(index, fresh=True))
        self._add_title_button("返回", self._on_new_game)
        self._place_title_bar()

    def _enter_slot(self, index: int, *, fresh: bool) -> None:
        path = slot_path(self.pack.folder, index)
        store = JsonFileStore(path)
        if fresh:
            save = new_save(time.time())
            save.vitals.hunger = DEMO_HUNGER
            store.dump(save)
        elif store.load() is None:
            self._show_slots("这个档案读不出来")
            return
        self.session = LifeSession(store, WallClock())
        intro = next((item for item in self.pack.options if item.intro and item.beats), None)
        if fresh and intro is not None:
            self.session.act(intro)
            self._enter_play("第一章")
            self._start_scene(intro.beats, "第一章")
            return
        flags = self.session.save.flags
        daily = int(flags.get("daily_life", 0)) > 0
        ch1_done = int(flags.get("ch1_done", 0)) > 0
        adopted = int(flags.get("adopted", 0)) > 0
        if not daily and (ch1_done or adopted):
            if not ch1_done:
                self.session.save.flags["ch1_done"] = 1
                self.session.store.dump(self.session.save)
            self._enter_play("第一章结束")
            self._start_scene(
                (SceneBeat(screen="black", card="第一章结束"),),
                "第一章结束",
            )
            return
        hunger = self.session.save.vitals.hunger
        self._enter_play(f"进来了。饥饿 {hunger:.0f}/100，点「喂食猫粮」看立绘和数字一起变。")

    def _enter_play(self, log: str) -> None:
        self._mode = "play"
        self.title_bar.place_forget()
        self.side.pack(side=tk.RIGHT, fill=tk.Y, padx=(16, 0))
        self.refresh(log=log)
        self.root.after(1000, self._tick)

    def _add_stat_row(self, key: str, label: str) -> None:
        row = tk.Frame(self.stat_box, bg=PANEL)
        row.pack(fill=tk.X, pady=4)
        tk.Label(
            row,
            text=label,
            bg=PANEL,
            fg=MUTED,
            font=self.small_font,
            width=4,
            anchor="w",
        ).pack(side=tk.LEFT)
        value = tk.Label(
            row,
            text="0 / 100",
            bg=PANEL,
            fg=TEXT,
            font=self.stat_font,
            width=9,
            anchor="e",
        )
        value.pack(side=tk.RIGHT)
        bar = tk.Canvas(row, bg=PANEL, highlightthickness=0, height=8)
        bar.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=8)
        self.stat_rows[key] = (value, bar)

    def _add_button(self, parent: tk.Misc, option: Option) -> None:
        btn = tk.Button(
            parent,
            text=option.label,
            font=self.ui_font,
            bg=BTN,
            fg=TEXT,
            activebackground=ACCENT,
            activeforeground=TEXT,
            relief=tk.FLAT,
            bd=0,
            padx=10,
            pady=4,
            cursor="hand2",
            command=lambda o=option: self.on_option(o),
        )
        btn.pack(fill=tk.X, pady=3)
        self.buttons[option.id] = btn

    def _set_bar(self, canvas: tk.Canvas, value: float) -> None:
        canvas.delete("all")
        w = max(canvas.winfo_width(), 80)
        h = 8
        canvas.create_rectangle(0, 0, w, h, fill=BAR_BG, outline="")
        fill = max(0.0, min(100.0, value)) / 100.0 * w
        canvas.create_rectangle(0, 0, fill, h, fill=BAR_FILL, outline="")

    def _snapshot_stats(self) -> dict[str, float]:
        assert self.session is not None
        v = self.session.save.vitals
        return {
            "hunger": v.hunger,
            "cleanliness": v.cleanliness,
            "mood": v.mood,
            "health": v.health,
            "gold": float(self.session.save.gold),
        }

    def on_option(self, option: Option) -> None:
        if self.session is None or self._playing:
            return
        before = self._snapshot_stats()
        ack = self.session.act(option)
        after = self._snapshot_stats()
        if not ack.ok:
            self.refresh(log=ack.bubble or "现在不行")
            return
        names = {
            "hunger": "饥饿",
            "cleanliness": "清洁",
            "mood": "心情",
            "health": "健康",
        }
        bits = []
        for key, label in names.items():
            a, b = before[key], after[key]
            if abs(a - b) >= 0.5:
                bits.append(f"{label} {a:.0f}/100 → {b:.0f}/100")
        if abs(before["gold"] - after["gold"]) >= 0.5:
            bits.append(f"金币 {before['gold']:.0f} → {after['gold']:.0f}")
        line = f"{option.label}：{'，'.join(bits)}" if bits else (ack.bubble or option.label)
        if option.beats:
            self._start_scene(option.beats, line)
            return
        self._scene = ()
        self._hide_dialog()
        self.refresh(log=line)

    def _start_scene(self, beats: tuple[SceneBeat, ...], log: str) -> None:
        self._playing = True
        self._fading = False
        self._scene = beats
        self._scene_i = 0
        self._scene_log = log
        self._scene_gen += 1
        self._set_menu_locked(True)
        self.art.config(cursor="hand2")
        self._hide_choice()
        self._hide_card()
        self._show_beat()

    def _current_beat(self) -> SceneBeat | None:
        if not self._scene or self._scene_i >= len(self._scene):
            return None
        return self._scene[self._scene_i]

    def _show_beat(self) -> None:
        if self._scene_i >= len(self._scene):
            self._end_scene()
            return
        beat = self._scene[self._scene_i]
        self._apply_beat_flag(beat)
        if beat.still and self.session is not None:
            self.session.save.last_still = beat.still
            self.session.store.dump(self.session.save)
        if beat.screen == "fade-black":
            self._hide_dialog()
            self._hide_card()
            self._start_fade_black()
            return
        if beat.card:
            self._hide_dialog()
            self._hide_choice()
            self._draw_black()
            self._show_card(beat.card)
            self._shown_still = None
            self.still_var.set("当前立绘  （黑屏）")
            self._set_menu_locked(True)
            self._playing = True
            self.art.config(cursor="hand2" if self._has_next_chapter() else "arrow")
            return
        self._hide_card()
        if beat.screen == "black":
            self._draw_black()
            self._shown_still = None
            self.still_var.set("当前立绘  （黑屏）")
        elif beat.still:
            self._draw_art(beat.still)
            self._shown_still = beat.still
            self.still_var.set(f"当前立绘  {beat.still}")
        if beat.text or beat.who:
            who, line = beat_speech(beat, self.pack.character)
            self._show_dialog(who, line)
        if beat.choices:
            self.dialog_hint.config(text="")
            self._show_choice(beat.prompt or "", beat.choices)
            return
        self._hide_choice()
        last = self._scene_i >= len(self._scene) - 1
        self.dialog_hint.config(text="" if last else "▼")
        if last:
            self.refresh(log=self._scene_log, redraw=False)
            self._set_menu_locked(False)
            self._playing = False
            self.art.config(cursor="arrow")

    def _on_stage_click(self, _event: tk.Event | None = None) -> None:
        if self._mode != "play" or not self._scene or self._fading:
            return
        beat = self._current_beat()
        if beat is None or beat.choices:
            return
        if beat.card and self._scene_i >= len(self._scene) - 1:
            self._continue_after_chapter()
            return
        if self._scene_i >= len(self._scene) - 1:
            return
        self._advance_scene()

    def _advance_scene(self) -> None:
        self._scene_gen += 1
        self._scene_i += 1
        self._show_beat()

    def _apply_beat_flag(self, beat: SceneBeat) -> None:
        if self.session is None or not beat.set_flag:
            return
        self.session.save.flags[beat.set_flag] = 1
        self.session.store.dump(self.session.save)

    def _chapter_option(self, chapter_id: str) -> Option | None:
        for option in self.pack.options:
            if option.id == chapter_id and option.beats:
                return option
        return None

    def _has_next_chapter(self) -> bool:
        return self._chapter_option("ch2") is not None

    def _continue_after_chapter(self) -> None:
        nxt = self._chapter_option("ch2")
        if nxt is None:
            return
        if self.session is not None:
            self.session.act(nxt)
        self._start_scene(nxt.beats, "第二章")

    def _start_fade_black(self) -> None:
        src = self._frame_rgb
        if src is None:
            self._fading = False
            self._advance_scene()
            return
        self._fading = True
        self._fade_alpha = 0.0
        self._fade_src = src.copy()
        self._fade_gen = self._scene_gen
        self._run_fade_black()

    def _run_fade_black(self) -> None:
        if not self.root.winfo_exists() or self._fade_gen != self._scene_gen:
            self._fading = False
            return
        assert self._fade_src is not None
        self._fade_alpha = min(1.0, self._fade_alpha + 1.0 / FADE_STEPS)
        box_w = max(self.art.winfo_width(), 200)
        box_h = max(self.art.winfo_height(), 200)
        src = self._fade_src
        if src.size != (box_w, box_h):
            src = src.resize((box_w, box_h), Image.Resampling.LANCZOS)
        black = Image.new("RGB", src.size, (0, 0, 0))
        shown = Image.blend(src, black, self._fade_alpha)
        self._show_rgb(shown)
        if self._fade_alpha >= 1.0:
            self._fading = False
            self._advance_scene()
            return
        self.root.after(FADE_MS, self._run_fade_black)

    def _show_card(self, text: str) -> None:
        self.card_label.config(text=text)
        self.card_label.place(relx=0.5, rely=0.46, anchor="center")
        self.card_label.lift()

    def _hide_card(self) -> None:
        self.card_label.place_forget()

    def _end_scene(self) -> None:
        self._playing = False
        self._fading = False
        self._scene_gen += 1
        self.art.config(cursor="arrow")
        self._hide_choice()
        self._hide_card()
        self._set_menu_locked(False)
        self.refresh(log=self._scene_log)

    def _show_choice(self, prompt: str, choices: tuple[SceneChoice, ...]) -> None:
        self.choice_prompt.config(text=prompt)
        for child in self.choice_btns.winfo_children():
            child.destroy()
        for choice in choices:
            btn = tk.Button(
                self.choice_btns,
                text=choice.label,
                font=self.ui_font,
                bg=BTN,
                fg=TEXT,
                activebackground=ACCENT,
                activeforeground=TEXT,
                relief=tk.FLAT,
                bd=0,
                padx=18,
                pady=7,
                cursor="hand2",
                command=lambda item=choice: self._pick_choice(item),
            )
            btn.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=4)
        self.choice.place(relx=0.5, rely=1.0, relwidth=0.56, anchor="s", y=-160)
        self.choice.lift()

    def _hide_choice(self) -> None:
        self.choice.place_forget()

    def _pick_choice(self, choice: SceneChoice) -> None:
        if self.session is not None and choice.set_flag:
            self.session.save.flags[choice.set_flag] = 1
            self.session.store.dump(self.session.save)
        self._hide_choice()
        self._scene_gen += 1
        self._scene = choice.beats
        self._scene_i = 0
        if not self._scene:
            self._end_scene()
            return
        self._playing = True
        self._set_menu_locked(True)
        self.art.config(cursor="hand2")
        self._show_beat()

    def _dialog_wraplength(self) -> int:
        stage_w = max(self.stage.winfo_width(), 240)
        box_w = max(int(stage_w * 0.90), 200)
        return max(160, box_w - 88)

    def _layout_dialog(self) -> None:
        wrap = self._dialog_wraplength()
        self.dialog_body.config(wraplength=wrap)
        self.dialog.place(
            relx=0.05,
            rely=1.0,
            relwidth=0.90,
            height=128,
            anchor="sw",
            y=-16,
        )
        self.dialog.update_idletasks()
        who_h = self.dialog_who.winfo_reqheight() if self.dialog_who.winfo_ismapped() else 0
        body_h = max(self.dialog_body.winfo_reqheight(), 36)
        stage_h = max(self.stage.winfo_height(), 200)
        height = min(max(128, who_h + body_h + 40), int(stage_h * 0.48))
        self.dialog.place(
            relx=0.05,
            rely=1.0,
            relwidth=0.90,
            height=height,
            anchor="sw",
            y=-16,
        )
        self.dialog.lift()

    def _show_dialog(self, who: str | None, line: str) -> None:
        if who:
            self.dialog_who.config(text=who)
            self.dialog_who.pack(fill=tk.X, before=self.dialog_row)
        else:
            self.dialog_who.config(text="")
            self.dialog_who.pack_forget()
        self.dialog_body.config(text=line)
        self._layout_dialog()

    def _hide_dialog(self) -> None:
        self.dialog.place_forget()
        self._hide_choice()

    def _set_menu_locked(self, locked: bool) -> None:
        if self.session is None:
            return
        if locked:
            for btn in self.buttons.values():
                btn.config(state=tk.DISABLED)
            return
        for option_id, btn in self.buttons.items():
            option = self._find_option(option_id)
            on = option is not None and self.session.option_enabled(option)
            btn.config(state=tk.NORMAL if on else tk.DISABLED)

    def refresh(self, log: str | None = None, redraw: bool = True) -> None:
        if self.session is None:
            return
        view = self.session.view()
        v = self.session.save.vitals
        mapping = {
            "hunger": v.hunger,
            "cleanliness": v.cleanliness,
            "mood": v.mood,
            "health": v.health,
        }
        for key, value in mapping.items():
            label, bar = self.stat_rows[key]
            label.config(text=f"{value:.0f} / 100")
            self._set_bar(bar, value)
        self.gold_var.set(f"金币 {self.session.save.gold}")
        if not self._playing:
            self.still_var.set(f"当前立绘  {view.still}")
        if log is not None:
            extra = view.bubble or ""
            text = log if not extra or extra in log else f"{log}\n{extra}"
            self.log.config(text=text)
        if not self._playing:
            self._set_menu_locked(False)
        self._sync_daily_menu()
        if redraw and not self._playing:
            self._draw_art(view.still)
            self._shown_still = view.still

    def _daily_life_open(self) -> bool:
        return (
            self.session is not None
            and int(self.session.save.flags.get("daily_life", 0)) > 0
        )

    def _sync_daily_menu(self) -> None:
        if self._daily_life_open():
            self.side_hint.config(text="点一项互动，立绘和数字会一起变。")
            if not self.interact_box.winfo_ismapped():
                self.interact_box.pack(fill=tk.X, before=self.log)
            return
        self.side_hint.config(text="剧情还在进行。过日子菜单还没开。")
        self.interact_box.pack_forget()

    def _find_option(self, option_id: str) -> Option | None:
        for option in walk_options(self.pack.options):
            if option.id == option_id:
                return option
        return None

    def _on_resize(self, event: tk.Event) -> None:
        size = (event.width, event.height)
        if size == self._last_size or size[0] < 40 or size[1] < 40:
            return
        self._last_size = size
        if self._mode != "play":
            self._draw_title_frame()
            return
        if self.session is None or self._fading:
            return
        if self._scene and self._scene_i < len(self._scene):
            beat = self._scene[self._scene_i]
            if beat.card or beat.screen == "black":
                self._draw_black()
                if beat.card:
                    self._show_card(beat.card)
            elif beat.still:
                self._draw_art(beat.still)
            if self.dialog.winfo_ismapped():
                self._layout_dialog()
            return
        view = self.session.view()
        self._draw_art(view.still)
        self._shown_still = view.still

    def _show_rgb(self, canvas: Image.Image) -> None:
        self._frame_rgb = canvas
        self.photo = ImageTk.PhotoImage(canvas)
        self.art.config(image=self.photo)

    def _draw_black(self) -> None:
        box_w = max(self.art.winfo_width(), 200)
        box_h = max(self.art.winfo_height(), 200)
        self._show_rgb(Image.new("RGB", (box_w, box_h), (0, 0, 0)))

    def _draw_art(self, key: str) -> None:
        path = self.pack.still(key)
        source = Image.open(path).convert("RGB")
        box_w = max(self.art.winfo_width(), 200)
        box_h = max(self.art.winfo_height(), 200)
        src_w, src_h = source.size
        scale = min(box_w / src_w, box_h / src_h)
        new_w = max(1, int(src_w * scale))
        new_h = max(1, int(src_h * scale))
        fitted = source.resize((new_w, new_h), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (box_w, box_h), (14, 13, 12))
        canvas.paste(fitted, ((box_w - new_w) // 2, (box_h - new_h) // 2))
        self._show_rgb(canvas)

    def _tick(self) -> None:
        if not self.root.winfo_exists() or self._mode != "play" or self.session is None:
            return
        if not self._playing:
            self.refresh(redraw=False)
        self.root.after(1000, self._tick)

    def run(self) -> None:
        self.root.protocol("WM_DELETE_WINDOW", self._close)
        self.root.mainloop()

    def _close(self) -> None:
        if self.session is not None:
            self.session.close()
        self.root.destroy()


def _dpi_aware() -> None:
    try:
        import ctypes

        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        try:
            import ctypes

            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass


def main() -> None:
    _dpi_aware()
    RaiseWindow().run()


if __name__ == "__main__":
    main()
