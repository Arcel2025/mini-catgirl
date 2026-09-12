from __future__ import annotations

import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from pack import load_pack


class PackTests(unittest.TestCase):
    def test_example_manifest(self) -> None:
        pack = load_pack(ROOT, "example")
        self.assertEqual(pack.pack_id, "example")
        self.assertTrue((pack.folder / "pet.json").is_file())
        labels = [item.label for item in pack.options]
        self.assertIn("喂食猫粮", labels)
        self.assertIn("惩罚", labels)
        punish = next(item for item in pack.options if item.id == "punish")
        self.assertGreaterEqual(len(punish.children), 3)
        feed = next(item for item in pack.options if item.id == "feed")
        self.assertEqual(feed.still, "eat")
        self.assertEqual(len(feed.beats), 2)
        self.assertEqual(feed.beats[0].screen, "black")
        self.assertEqual(feed.beats[0].text, "开饭啦！")
        self.assertTrue(feed.beats[1].say)
        self.assertEqual(pack.character, "喵喵")
        self.assertTrue(pack.idle().is_file())
        self.assertTrue(pack.still("eat").name.endswith("eat.png"))

    def test_doudou_manifest(self) -> None:
        pack = load_pack(ROOT, "doudou")
        self.assertEqual(pack.pack_id, "doudou")
        self.assertEqual(pack.character, "兜兜")
        self.assertTrue(pack.idle().is_file())
        labels = [item.label for item in pack.options]
        self.assertIn("带回家", labels)
        self.assertIn("给一口", labels)
        take = next(item for item in pack.options if item.id == "take_home")
        self.assertEqual(take.set_flag, "home")
        self.assertEqual(take.unless_flag, "home")
        rummage = next(item for item in pack.options if item.id == "rummage")
        self.assertEqual(rummage.unless_flag, "home")
        feed = next(item for item in pack.options if item.id == "feed")
        self.assertEqual(feed.need_flag, "home")

    def test_xiaoweiqu_manifest(self) -> None:
        pack = load_pack(ROOT, "xiaoweiqu")
        self.assertEqual(pack.pack_id, "xiaoweiqu")
        self.assertEqual(pack.character, "小委屈")
        self.assertTrue(pack.idle().is_file())
        self.assertTrue(pack.cover().is_file())
        self.assertEqual(pack.cover().name, "cover.png")
        labels = [item.label for item in pack.options]
        self.assertIn("喂食猫粮", labels)
        self.assertIn("去茶几底下钻", labels)
        self.assertNotIn("带回家", labels)
        ch1 = next(item for item in pack.options if item.id == "ch1")
        self.assertTrue(ch1.intro)
        self.assertGreaterEqual(len(ch1.beats), 20)
        self.assertEqual(ch1.beats[0].still, "ch1-genkan")
        self.assertEqual(ch1.beats[-1].who, "内心")
        for key in ("ch1-genkan", "ch1-pushdoor", "ch1-box", "ch1-letter", "ch1-standlook"):
            self.assertTrue(pack.still(key).is_file(), key)


if __name__ == "__main__":
    unittest.main(verbosity=2)
