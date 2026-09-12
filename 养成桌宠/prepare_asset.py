from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


def cut_white_background(source: Path, destination: Path) -> None:
    """只清除与画布边缘连通的近白背景，保住封闭轮廓内的白毛和白衣服。"""
    image = Image.open(source).convert("RGBA")
    rgb = np.asarray(image, dtype=np.uint8)[:, :, :3]
    h, w, _ = rgb.shape

    light = rgb.min(axis=2) >= 226
    neutral = (rgb.max(axis=2) - rgb.min(axis=2)) <= 24
    removable = light & neutral
    outside = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        if removable[0, x]:
            outside[0, x] = True
            queue.append((x, 0))
        if removable[h - 1, x]:
            outside[h - 1, x] = True
            queue.append((x, h - 1))
    for y in range(h):
        if removable[y, 0]:
            outside[y, 0] = True
            queue.append((0, y))
        if removable[y, w - 1]:
            outside[y, w - 1] = True
            queue.append((w - 1, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if (
                0 <= nx < w
                and 0 <= ny < h
                and removable[ny, nx]
                and not outside[ny, nx]
            ):
                outside[ny, nx] = True
                queue.append((nx, ny))

    rgba = np.asarray(image, dtype=np.uint8).copy()
    rgba[outside, 3] = 0

    alpha = rgba[:, :, 3]
    ys, xs = np.where(alpha > 8)
    if len(xs) == 0:
        raise RuntimeError("没有检测到角色前景")
    pad = 12
    left = max(0, int(xs.min()) - pad)
    top = max(0, int(ys.min()) - pad)
    right = min(w, int(xs.max()) + pad + 1)
    bottom = min(h, int(ys.max()) + pad + 1)
    result = Image.fromarray(rgba, "RGBA").crop((left, top, right, bottom))
    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination)
    print(f"saved {destination} {result.size}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("用法：python prepare_asset.py 输入图片 输出PNG")
    cut_white_background(Path(sys.argv[1]), Path(sys.argv[2]))
