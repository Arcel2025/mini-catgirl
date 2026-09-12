from __future__ import annotations

import json
from pathlib import Path

from .types import Save


class MemoryStore:
    def __init__(self, save: Save | None = None) -> None:
        self._save = save

    def load(self) -> Save | None:
        if self._save is None:
            return None
        return Save.from_dict(self._save.to_dict())

    def dump(self, save: Save) -> None:
        self._save = Save.from_dict(save.to_dict())


class JsonFileStore:
    def __init__(self, path: Path) -> None:
        self.path = path

    def load(self) -> Save | None:
        if not self.path.is_file():
            return None
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            corrupt = self.path.with_suffix(self.path.suffix + ".corrupt")
            try:
                self.path.replace(corrupt)
            except OSError:
                pass
            return None
        if not isinstance(data, dict):
            return None
        return Save.from_dict(data)

    def dump(self, save: Save) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = json.dumps(save.to_dict(), ensure_ascii=False, indent=2)
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(payload, encoding="utf-8")
        tmp.replace(self.path)
