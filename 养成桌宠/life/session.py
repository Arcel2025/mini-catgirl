from __future__ import annotations

from .core import new_save, option_allowed, step
from .types import Ack, Command, MenuItem, Option, PetView, Save


class Clock:
    def now(self) -> float: ...


class Store:
    def load(self) -> Save | None: ...

    def dump(self, save: Save) -> None: ...


def _performance(save: Save) -> tuple[str, str, str]:
    if save.life_phase == "dead":
        return "dead", "xx", "gray"
    if save.ailment:
        return "sick", "dizzy", "green"
    if save.active_job:
        return "work", "normal", "none"
    return "idle", "normal", "none"


def _still_key(save: Save) -> str:
    if save.life_phase == "dead":
        return "dead"
    if save.last_still:
        return save.last_still
    if save.ailment:
        return "sick"
    if save.active_job:
        return "work"
    return "idle"


def _bubble(save: Save) -> str | None:
    if save.life_phase == "dead":
        return "……"
    if save.ailment:
        return "不舒服…"
    if save.vitals.hunger < 25:
        return "好饿…"
    if save.vitals.cleanliness < 25:
        return "好脏…"
    if save.active_job:
        return "打工中…"
    return None


def _menu(save: Save) -> dict[str, MenuItem]:
    dead = save.life_phase == "dead"
    busy = save.active_job is not None
    return {
        "feed": MenuItem(not dead, "已经走了" if dead else ""),
        "wash": MenuItem(not dead),
        "play": MenuItem(not dead),
        "start_job": MenuItem(not dead and not busy, "正在打工" if busy else ""),
        "stop_job": MenuItem(not dead and busy),
        "medicine": MenuItem(not dead),
        "revive": MenuItem(dead, "" if dead else "还活着"),
    }


def build_view(save: Save) -> PetView:
    performance, face, tint = _performance(save)
    return PetView(
        performance=performance,  # type: ignore[arg-type]
        face=face,  # type: ignore[arg-type]
        tint=tint,  # type: ignore[arg-type]
        still=_still_key(save),
        bubble=_bubble(save),
        gold=save.gold,
        menu=_menu(save),
    )


def _ack_bubble(events: list[str], option: Option | None) -> tuple[bool, str]:
    denied = "denied" in events or "busy" in events
    if denied:
        return False, "现在不行"
    if option is not None and option.bubble:
        return True, option.bubble
    bubble = ""
    if "fed" in events:
        bubble = "啊呜"
    elif "washed" in events:
        bubble = "擦干净了"
    elif "played" in events:
        bubble = "嘿嘿"
    elif "job_started" in events:
        bubble = "去打工了"
    elif "job_done" in events or "job_stopped" in events:
        bubble = "收工"
    elif "revived" in events:
        bubble = "又醒来了"
    elif "cured" in events:
        bubble = "好一点了"
    elif "acted" in events:
        bubble = "……"
    return True, bubble


class LifeSession:
    def __init__(self, store: Store, clock: Clock, rng_state: int = 1) -> None:
        self.store = store
        self.clock = clock
        loaded = store.load()
        now = clock.now()
        self.save = loaded if loaded is not None else new_save(now, rng_state=rng_state)
        self._view_minute: int | None = None
        self._view: PetView | None = None
        self._dirty = loaded is None

    def _minute(self, ts: float) -> int:
        return int(ts // 60.0)

    def _sync(
        self, command: Command | None = None, option: Option | None = None
    ) -> list[str]:
        now = self.clock.now()
        prev_minute = self._view_minute
        self.save, events = step(self.save, now, command=command, option=option)
        minute = self._minute(now)
        changed = command is not None or option is not None or events or prev_minute != minute
        if changed:
            self._dirty = True
        if self._view is None or self._view_minute != minute or changed:
            self._view = build_view(self.save)
            self._view_minute = minute
        return events

    def view(self) -> PetView:
        self._sync()
        assert self._view is not None
        if self._dirty and self._view_minute is not None:
            self.store.dump(self.save)
            self._dirty = False
        return self._view

    def intend(self, command: Command) -> Ack:
        events = self._sync(command=command)
        self.store.dump(self.save)
        self._dirty = False
        ok, bubble = _ack_bubble(events, None)
        return Ack(ok=ok, bubble=bubble, events=tuple(events))

    def act(self, option: Option) -> Ack:
        events = self._sync(option=option)
        self.store.dump(self.save)
        self._dirty = False
        ok, bubble = _ack_bubble(events, option)
        return Ack(ok=ok, bubble=bubble, events=tuple(events))

    def option_enabled(self, option: Option) -> bool:
        return option_allowed(self.save, option)

    def close(self) -> None:
        self.store.dump(self.save)
        self._dirty = False
