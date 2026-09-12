from __future__ import annotations

import unittest
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from life.clock import SimClock
from life.core import new_save, step
from life.session import LifeSession
from life.store import MemoryStore
from life.tables import JOB_MINUTES, JOB_PAY, START_GOLD
from life.types import Command, Option, Save, SceneBeat, beat_speech, option_from_dict


class LifeCoreTests(unittest.TestCase):
    def test_starve_kills(self) -> None:
        clock = SimClock(0)
        save = new_save(clock.now(), rng_state=1)
        clock.advance(8 * 60)
        save, events = step(save, clock.now())
        self.assertEqual(save.life_phase, "dead")
        self.assertIn("died", events)
        self.assertEqual(save.vitals.health, 0.0)
        self.assertIn(save.death_cause, ("neglect", "illness"))

    def test_work_pays(self) -> None:
        clock = SimClock(0)
        save = new_save(clock.now(), rng_state=1)
        save, events = step(save, clock.now(), Command("start_job"))
        self.assertIn("job_started", events)
        done = []
        for _ in range(JOB_MINUTES):
            clock.advance(1)
            save, done = step(save, clock.now())
        self.assertIn("job_done", done)
        self.assertEqual(save.gold, START_GOLD + JOB_PAY)
        self.assertIsNone(save.active_job)

    def test_offline_job_does_not_keep_paying(self) -> None:
        clock = SimClock(0)
        save = new_save(clock.now(), rng_state=1)
        save, _ = step(save, clock.now(), Command("start_job"))
        for _ in range(5):
            clock.advance(1)
            save, _ = step(save, clock.now())
        self.assertEqual(save.gold, START_GOLD)
        clock.advance(8 * 60)
        save, events = step(save, clock.now())
        self.assertIn("job_stopped", events)
        self.assertLess(save.gold, START_GOLD + JOB_PAY)
        self.assertGreater(save.gold, START_GOLD)

    def test_catchup_matches_minute_loop(self) -> None:
        clock = SimClock(0)
        one = new_save(0.0, rng_state=7)
        for _ in range(180):
            clock.advance(1)
            one, _ = step(one, clock.now())
        two = new_save(0.0, rng_state=7)
        two, _ = step(two, 180 * 60.0)
        self.assertEqual(one.life_phase, two.life_phase)
        self.assertAlmostEqual(one.vitals.hunger, two.vitals.hunger, places=5)
        self.assertAlmostEqual(one.vitals.health, two.vitals.health, places=5)
        self.assertEqual(one.rng_state, two.rng_state)
        self.assertEqual(one.ailment, two.ailment)

    def test_same_seed_replays(self) -> None:
        def run() -> Save:
            save = new_save(0.0, rng_state=42)
            save, _ = step(save, 6 * 60 * 60.0)
            return save

        a, b = run(), run()
        self.assertEqual(a.to_dict(), b.to_dict())

    def test_dead_ignores_feed(self) -> None:
        clock = SimClock(0)
        save = new_save(clock.now(), rng_state=1)
        clock.advance(8 * 60)
        save, _ = step(save, clock.now())
        self.assertEqual(save.life_phase, "dead")
        save, events = step(save, clock.now(), Command("feed"))
        self.assertIn("denied", events)
        save.gold = 80
        save, events = step(save, clock.now(), Command("revive"))
        self.assertIn("revived", events)
        self.assertEqual(save.life_phase, "alive")
        self.assertGreater(save.vitals.health, 0)

    def test_session_view_throttles(self) -> None:
        clock = SimClock(0)
        session = LifeSession(MemoryStore(), clock, rng_state=3)
        first = session.view()
        second = session.view()
        self.assertEqual(first.performance, second.performance)
        clock.advance(8 * 60)
        later = session.view()
        self.assertEqual(later.performance, "dead")

    def test_feed_costs_gold(self) -> None:
        clock = SimClock(0)
        session = LifeSession(MemoryStore(), clock, rng_state=1)
        gold = session.view().gold
        ack = session.intend(Command("feed"))
        self.assertTrue(ack.ok)
        self.assertEqual(session.view().gold, gold - 10)

    def test_custom_option_changes_mood_and_still(self) -> None:
        clock = SimClock(0)
        session = LifeSession(MemoryStore(), clock, rng_state=1)
        mood = session.save.vitals.mood
        option = Option(id="scold", label="训斥", mood=-12, still="scold", bubble="……")
        ack = session.act(option)
        self.assertTrue(ack.ok)
        self.assertAlmostEqual(session.save.vitals.mood, mood - 12)
        self.assertEqual(session.view().still, "scold")
        self.assertEqual(session.save.flags, {})

    def test_need_flag_blocks_until_set(self) -> None:
        clock = SimClock(0)
        save = new_save(clock.now(), rng_state=1)
        locked = Option(id="later", label="later", need_flag="opened", mood=-1)
        save, events = step(save, clock.now(), option=locked)
        self.assertIn("denied", events)
        opener = Option(id="open", label="open", set_flag="opened")
        save, events = step(save, clock.now(), option=opener)
        self.assertIn("acted", events)
        save, events = step(save, clock.now(), option=locked)
        self.assertIn("acted", events)

    def test_unless_flag_hides_after_set(self) -> None:
        clock = SimClock(0)
        save = new_save(clock.now(), rng_state=1)
        street = Option(id="take_home", label="带回家", unless_flag="home", set_flag="home")
        save, events = step(save, clock.now(), option=street)
        self.assertIn("acted", events)
        save, events = step(save, clock.now(), option=street)
        self.assertIn("denied", events)

    def test_feed_beats_parse_and_speech(self) -> None:
        option = option_from_dict(
            {
                "id": "feed",
                "label": "喂食猫粮",
                "engine": "feed",
                "beats": [
                    {"screen": "black", "text": "开饭啦！"},
                    {"still": "eat", "say": True, "text": "好吃好吃！喵！喵！喵！"},
                ],
            }
        )
        self.assertEqual(option.beats[0], SceneBeat(screen="black", text="开饭啦！"))
        who, line = beat_speech(option.beats[1], "喵喵")
        self.assertIsNone(who)
        self.assertEqual(line, "喵喵：好吃好吃！喵！喵！喵！")
        who, line = beat_speech(option.beats[0], "喵喵")
        self.assertIsNone(who)
        self.assertEqual(line, "开饭啦！")

    def test_beat_who_does_not_use_pack_name(self) -> None:
        option = option_from_dict(
            {
                "id": "ch1",
                "intro": True,
                "beats": [
                    {"who": "迷你猫娘", "text": "不要伤害喵喵……"},
                    {"who": "内心", "text": "呵呵，真有意思。"},
                ],
            }
        )
        self.assertTrue(option.intro)
        who, line = beat_speech(option.beats[0], "小委屈")
        self.assertEqual(who, "迷你猫娘")
        self.assertEqual(line, "不要伤害喵喵……")
        who, line = beat_speech(option.beats[1], "小委屈")
        self.assertEqual(who, "内心")
        self.assertEqual(line, "呵呵，真有意思。")


if __name__ == "__main__":
    unittest.main(verbosity=2)
