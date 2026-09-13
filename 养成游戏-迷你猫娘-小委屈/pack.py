from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from life.types import Option, option_from_dict, walk_options


@dataclass(frozen=True)
class Pack:
    pack_id: str
    name: str
    character: str
    folder: Path
    stills: dict[str, Path | None]
    options: tuple[Option, ...]

    def idle(self) -> Path:
        path = self.stills.get("idle")
        if path is None or not path.is_file():
            raise FileNotFoundError(str(self.folder / "assets" / "idle.png"))
        return path

    def cover(self) -> Path:
        path = self.stills.get("cover")
        if path is not None and path.is_file():
            return path
        return self.idle()

    def still(self, key: str) -> Path:
        path = self.stills.get(key)
        if path is not None and path.is_file():
            return path
        fallback = self.folder / "assets" / f"{key}.png"
        if fallback.is_file():
            return fallback
        return self.idle()


def active_pack_name(root: Path) -> str:
    pointer = root / "packs" / "active.txt"
    if pointer.is_file():
        name = pointer.read_text(encoding="utf-8").strip()
        if name:
            return name
    return "xiaoweiqu"


def _load_options(folder: Path, data: dict) -> tuple[Option, ...]:
    raw = data.get("options")
    extra = folder / "options.json"
    if extra.is_file():
        loaded = json.loads(extra.read_text(encoding="utf-8"))
        raw = loaded
    if not isinstance(raw, list):
        return ()
    return tuple(option_from_dict(item) for item in raw if isinstance(item, dict))


def load_pack(root: Path, pack_id: str | None = None) -> Pack:
    name = pack_id or active_pack_name(root)
    folder = root / "packs" / name
    manifest_path = folder / "pet.json"
    if not manifest_path.is_file():
        raise FileNotFoundError(str(manifest_path))
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    assets = folder / "assets"
    stills: dict[str, Path | None] = {}
    raw = data.get("stills") or {}
    keys = ["idle", "happy", "work", "sick", "dead", "cover"]
    options = _load_options(folder, data)
    for option in walk_options(options):
        if option.still and option.still not in keys:
            keys.append(option.still)
        for beat in option.beats:
            if beat.still and beat.still not in keys:
                keys.append(beat.still)
    for key in keys:
        filename = raw.get(key) or (f"{key}.png" if key == "idle" else None)
        if key != "idle" and not filename:
            path = assets / f"{key}.png"
            stills[key] = path if path.is_file() else None
            continue
        if not filename:
            stills[key] = None
            continue
        path = assets / str(filename)
        stills[key] = path if path.is_file() else None
    if stills.get("idle") is None and (assets / "idle.png").is_file():
        stills["idle"] = assets / "idle.png"
    return Pack(
        pack_id=str(data.get("id") or name),
        name=str(data.get("name") or name),
        character=str(data.get("character") or data.get("name") or name),
        folder=folder,
        stills=stills,
        options=options,
    )
