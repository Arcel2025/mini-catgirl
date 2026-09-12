# -*- coding: utf-8 -*-
"""红=idle，绿=新姿势。脸叠上会偏黄。"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def tint_overlay(idle: Image.Image, pose: Image.Image) -> Image.Image:
    a = idle.convert("RGBA")
    b = pose.convert("RGBA")
    if b.size != a.size:
        raise SystemExit(f"画布不一致：idle {a.size} pose {b.size}。先对齐再叠。")
    out = Image.new("RGBA", a.size, (0, 0, 0, 0))
    ra = np.array(a)
    rb = np.array(b)
    aa = ra[:, :, 3:4].astype(np.float32) / 255.0
    ba = rb[:, :, 3:4].astype(np.float32) / 255.0
    red = np.zeros_like(ra)
    green = np.zeros_like(rb)
    red[:, :, 0] = 220
    red[:, :, 3] = (aa[:, :, 0] * 180).astype(np.uint8)
    green[:, :, 1] = 200
    green[:, :, 3] = (ba[:, :, 0] * 180).astype(np.uint8)
    out = Image.alpha_composite(out, Image.fromarray(red))
    out = Image.alpha_composite(out, Image.fromarray(green))
    return out


def align_cat(
    pose: Image.Image, idle: Image.Image, idle_path: Path, closed_eyes: bool
) -> Image.Image:
    cat_root = idle_path.resolve().parents[1]
    sys.path.insert(0, str(cat_root))
    try:
        from pet import align_to_idle
    except ImportError as exc:
        raise SystemExit(f"读不到 {cat_root / 'pet.py'} 的 align_to_idle：{exc}") from exc
    return align_to_idle(pose.convert("RGBA"), idle.convert("RGBA"), closed_eyes=closed_eyes)


def main() -> None:
    parser = argparse.ArgumentParser(description="红绿叠图：验脸心和脚底")
    parser.add_argument("idle", type=Path)
    parser.add_argument("pose", type=Path)
    parser.add_argument("out", type=Path)
    parser.add_argument(
        "--align-cat",
        action="store_true",
        help="用紫猫 pet.align_to_idle；这个仓库没有紫猫，不要开",
    )
    parser.add_argument("--closed-eyes", action="store_true")
    args = parser.parse_args()

    if not args.idle.is_file():
        raise SystemExit(f"没有 idle：{args.idle}")
    if not args.pose.is_file():
        raise SystemExit(f"没有新图：{args.pose}")

    idle = Image.open(args.idle)
    pose = Image.open(args.pose)
    if args.align_cat:
        pose = align_cat(pose, idle, args.idle, closed_eyes=args.closed_eyes)

    overlay = tint_overlay(idle, pose)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    overlay.convert("RGB").save(args.out, quality=90)
    print(f"saved {args.out} {overlay.size}")


if __name__ == "__main__":
    main()
