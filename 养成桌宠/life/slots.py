from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from .store import JsonFileStore
from .types import Save

SLOT_COUNT = 3
LEGACY_NAME = "window-save.json"


def slot_path(folder: Path, index: int) -> Path:
    if index < 1 or index > SLOT_COUNT:
        raise ValueError(f"slot {index}")
    return folder / f"save-{index}.json"


def migrate_legacy_save(folder: Path) -> None:
    legacy = folder / LEGACY_NAME
    first = slot_path(folder, 1)
    if legacy.is_file() and not first.is_file():
        try:
            legacy.replace(first)
        except OSError:
            pass


def peek_slot(folder: Path, index: int) -> Save | None:
    return JsonFileStore(slot_path(folder, index)).load()


def slot_label(save: Save | None, index: int) -> str:
    name = f"档案 {index}"
    if save is None:
        return f"{name}　　空"
    if save.life_phase == "dead":
        return f"{name}　　已经走了"
    v = save.vitals
    return f"{name}　　饥饿 {v.hunger:.0f} · 金币 {save.gold}"


@dataclass(frozen=True)
class SlotInfo:
    index: int
    empty: bool
    label: str


def list_slots(folder: Path) -> tuple[SlotInfo, ...]:
    migrate_legacy_save(folder)
    rows = []
    for i in range(1, SLOT_COUNT + 1):
        save = peek_slot(folder, i)
        rows.append(SlotInfo(index=i, empty=save is None, label=slot_label(save, i)))
    return tuple(rows)
