from __future__ import annotations

import tempfile
import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from life.core import new_save
from life.slots import list_slots, migrate_legacy_save, peek_slot, slot_path
from life.store import JsonFileStore


class SlotTests(unittest.TestCase):
    def test_three_empty_slots(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            folder = Path(raw)
            rows = list_slots(folder)
            self.assertEqual(len(rows), 3)
            self.assertTrue(all(row.empty for row in rows))
            self.assertIn("空", rows[0].label)

    def test_peek_written_slot(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            folder = Path(raw)
            save = new_save(0.0)
            save.vitals.hunger = 30
            JsonFileStore(slot_path(folder, 2)).dump(save)
            rows = list_slots(folder)
            self.assertTrue(rows[0].empty)
            self.assertFalse(rows[1].empty)
            self.assertIn("饥饿 30", rows[1].label)
            loaded = peek_slot(folder, 2)
            assert loaded is not None
            self.assertEqual(loaded.vitals.hunger, 30)

    def test_legacy_window_save_becomes_slot1(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            folder = Path(raw)
            save = new_save(1.0)
            JsonFileStore(folder / "window-save.json").dump(save)
            migrate_legacy_save(folder)
            self.assertFalse((folder / "window-save.json").is_file())
            self.assertTrue(slot_path(folder, 1).is_file())
            self.assertIsNotNone(peek_slot(folder, 1))


if __name__ == "__main__":
    unittest.main(verbosity=2)
