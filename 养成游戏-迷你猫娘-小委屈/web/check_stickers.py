"""日常贴纸画布。站姿 864×1152 是尺子。

竖着的贴纸（站、走、跑、坐、喘气、作揖）必须同一张画布。
网页按宽度铺图，画布一窄、一高，人就会被撑大。

新图先做成 864×1152 透明底，脚离底大约 12px，头宽跟 stand.png 接近。
已经裁窄的图可以：

    python check_stickers.py --normalize

检查：

    python check_stickers.py
    python -m unittest check_stickers
"""

from __future__ import annotations

import argparse
import sys
import unittest
from pathlib import Path

from PIL import Image, ImageDraw

ASSETS = Path(__file__).resolve().parent / "assets"
CANVAS = (864, 1152)
FOOT_INSET = 12
FOOT_INSET_MIN = 4
FOOT_INSET_MAX = 24
ALPHA = 12
HEAD_FRAC = 0.38
HEAD_TOL = 0.12

UPRIGHT = [
    "stand.png",
    "stand-b.png",
    "sit.png",
    "sit-b.png",
    "walk-1.png",
    "walk-3.png",
    "run-1.png",
    "run-2.png",
    "run-3.png",
    "run-4.png",
    "pant-a.png",
    "pant-b.png",
    "bow-a.png",
    "bow-b.png",
]


def load(name: str) -> Image.Image:
    return Image.open(ASSETS / name).convert("RGBA")


def opaque_bbox(im: Image.Image) -> tuple[int, int, int, int] | None:
    mask = im.getchannel("A").point(lambda v: 255 if v > ALPHA else 0)
    return mask.getbbox()


def head_width(im: Image.Image, bbox: tuple[int, int, int, int]) -> int:
    x0, y0, x1, y1 = bbox
    hy1 = y0 + max(1, int((y1 - y0) * HEAD_FRAC))
    mask = im.getchannel("A").point(lambda v: 255 if v > 20 else 0)
    head = mask.crop((x0, y0, x1, hy1)).getbbox()
    if not head:
        return 0
    return head[2] - head[0]


def measure(name: str) -> dict:
    im = load(name)
    w, h = im.size
    bbox = opaque_bbox(im)
    if not bbox:
        raise SystemExit(f"{name}: 全透明")
    x0, y0, x1, y1 = bbox
    return {
        "name": name,
        "w": w,
        "h": h,
        "bbox": bbox,
        "bw": x1 - x0,
        "bh": y1 - y0,
        "head": head_width(im, bbox),
        "foot": h - y1,
    }


def fit_to_canvas(im: Image.Image) -> Image.Image:
    cw, ch = CANVAS
    src = im.convert("RGBA")
    bw, bh = src.size
    scale = min(1.0, cw / bw, (ch - FOOT_INSET) / bh)
    if scale < 1.0:
        nw = max(1, round(bw * scale))
        nh = max(1, round(bh * scale))
        src = src.resize((nw, nh), Image.Resampling.LANCZOS)
    bbox = opaque_bbox(src)
    if not bbox:
        raise SystemExit("normalize: 全透明")
    x0, y0, x1, y1 = bbox
    dx = (cw - (x1 - x0)) // 2 - x0
    dy = (ch - FOOT_INSET) - y1
    out = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    out.alpha_composite(src, (dx, dy))
    clipped = opaque_bbox(out)
    if not clipped:
        raise SystemExit("normalize: 贴完之后空了")
    if clipped[0] <= 0 or clipped[1] <= 0 or clipped[2] >= cw or clipped[3] >= ch:
        # 贴边可以，溢出画布不行
        if clipped[0] < 0 or clipped[1] < 0 or clipped[2] > cw or clipped[3] > ch:
            raise SystemExit(f"normalize: 溢出 {clipped}")
    return out


def normalize(names: list[str]) -> list[str]:
    changed = []
    for name in names:
        im = load(name)
        if im.size == CANVAS:
            continue
        out = fit_to_canvas(im)
        dest = ASSETS / name
        out.save(dest, "PNG", optimize=True)
        changed.append(name)
    return changed


def check(names: list[str]) -> int:
    stand = measure("stand.png")
    if (stand["w"], stand["h"]) != CANVAS:
        print(f"stand.png 必须是 {CANVAS[0]}×{CANVAS[1]}，现在 {stand['w']}×{stand['h']}")
        return 1
    stand_head_ratio = stand["head"] / stand["w"]
    errors = []
    rows = []
    for name in names:
        m = measure(name)
        rows.append(m)
        if (m["w"], m["h"]) != CANVAS:
            errors.append(f"{name}: 画布 {m['w']}×{m['h']}，要 {CANVAS[0]}×{CANVAS[1]}")
            continue
        if not (FOOT_INSET_MIN <= m["foot"] <= FOOT_INSET_MAX):
            errors.append(f"{name}: 脚离底 {m['foot']}px，要 {FOOT_INSET_MIN}–{FOOT_INSET_MAX}")
        ratio = m["head"] / m["w"]
        drift = abs(ratio - stand_head_ratio) / stand_head_ratio
        if drift > HEAD_TOL:
            errors.append(
                f"{name}: 头宽占画布 {ratio:.3f}，站姿 {stand_head_ratio:.3f}，差 {drift:.0%}（上限 {HEAD_TOL:.0%}）"
            )
    print(
        f"{'file':16} {'canvas':>11} {'head':>5} {'head/W':>7} {'foot':>5} {'bbox-h':>7}"
    )
    for m in rows:
        print(
            f"{m['name']:16} {m['w']:4}×{m['h']:<4} {m['head']:5} {m['head']/m['w']:7.3f} {m['foot']:5} {m['bh']:7}"
        )
    if errors:
        print()
        for line in errors:
            print("FAIL", line)
        return 1
    print()
    print(f"OK  {len(names)} 张竖贴纸，画布 {CANVAS[0]}×{CANVAS[1]}，头跟站姿对齐。")
    return 0


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    parser = argparse.ArgumentParser(description="检查日常竖贴纸是不是同一张画布")
    parser.add_argument(
        "--normalize",
        action="store_true",
        help="把不是 864×1152 的竖贴纸垫进这张画布，脚对齐站姿",
    )
    args = parser.parse_args(argv)
    missing = [n for n in UPRIGHT if not (ASSETS / n).is_file()]
    if missing:
        print("缺文件:", ", ".join(missing))
        return 1
    if args.normalize:
        changed = normalize(UPRIGHT)
        if changed:
            print("已垫画布:", ", ".join(changed))
        else:
            print("没有要垫的图。")
    return check(UPRIGHT)


class TestStickerCanvas(unittest.TestCase):
    def test_game_assets_match_stand(self):
        self.assertEqual(check(UPRIGHT), 0)

    def test_narrow_walk_pads_to_canvas(self):
        im = Image.new("RGBA", (770, 1124), (0, 0, 0, 0))
        ImageDraw.Draw(im).ellipse((80, 40, 690, 1100), fill=(255, 240, 230, 255))
        out = fit_to_canvas(im)
        self.assertEqual(out.size, CANVAS)
        bbox = opaque_bbox(out)
        self.assertIsNotNone(bbox)
        self.assertGreaterEqual(bbox[3], CANVAS[1] - FOOT_INSET_MAX)
        self.assertLessEqual(bbox[3], CANVAS[1] - FOOT_INSET_MIN)


if __name__ == "__main__":
    sys.exit(main())
