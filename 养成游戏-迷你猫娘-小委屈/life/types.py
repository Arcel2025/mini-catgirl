from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

CommandKind = Literal[
    "feed",
    "wash",
    "play",
    "start_job",
    "stop_job",
    "medicine",
    "revive",
]


@dataclass(frozen=True)
class Command:
    kind: CommandKind


@dataclass(frozen=True)
class SceneBeat:
    """窗口演出一拍。screen=black 为黑屏；say 则对白带角色名。"""

    screen: str | None = None
    still: str | None = None
    text: str = ""
    say: bool = False
    who: str | None = None


def beat_from_dict(data: dict) -> SceneBeat:
    screen = data.get("screen")
    if screen not in ("black",):
        screen = None
    who = data.get("who")
    return SceneBeat(
        screen=screen,
        still=data.get("still"),
        text=str(data.get("text") or ""),
        say=bool(data.get("say")),
        who=str(who) if who else None,
    )


def beat_speech(beat: SceneBeat, name: str) -> tuple[str | None, str]:
    text = beat.text.replace("{name}", name)
    if beat.who:
        return beat.who, text
    if beat.say:
        return None, f"{name}：{text}"
    return None, text


@dataclass(frozen=True)
class Option:
    """菜单一行。engine 走生命核；否则只改数值和立绘。children 是子菜单。"""

    id: str
    label: str
    engine: CommandKind | None = None
    still: str | None = None
    bubble: str | None = None
    require: Literal["alive", "dead", "any"] = "alive"
    hunger: float = 0.0
    cleanliness: float = 0.0
    mood: float = 0.0
    health: float = 0.0
    gold: int = 0
    need_flag: str | None = None
    set_flag: str | None = None
    unless_flag: str | None = None
    flag_value: int = 1
    children: tuple[Option, ...] = ()
    beats: tuple[SceneBeat, ...] = ()
    intro: bool = False


def option_from_dict(data: dict) -> Option:
    engine = data.get("engine")
    if engine not in (
        "feed",
        "wash",
        "play",
        "start_job",
        "stop_job",
        "medicine",
        "revive",
    ):
        engine = None
    require = data.get("require") or "alive"
    if require not in ("alive", "dead", "any"):
        require = "alive"
    kids = tuple(option_from_dict(child) for child in (data.get("children") or []))
    beats = tuple(
        beat_from_dict(item) for item in (data.get("beats") or []) if isinstance(item, dict)
    )
    return Option(
        id=str(data.get("id") or data.get("label") or "opt"),
        label=str(data.get("label") or data.get("id") or "选项"),
        engine=engine,
        still=data.get("still"),
        bubble=data.get("bubble"),
        require=require,
        hunger=float(data.get("hunger") or 0),
        cleanliness=float(data.get("cleanliness") or 0),
        mood=float(data.get("mood") or 0),
        health=float(data.get("health") or 0),
        gold=int(data.get("gold") or 0),
        need_flag=data.get("need_flag") or None,
        set_flag=data.get("set_flag") or None,
        unless_flag=data.get("unless_flag") or None,
        flag_value=int(data.get("flag_value") or 1),
        children=kids,
        beats=beats,
        intro=bool(data.get("intro")),
    )


def walk_options(options: tuple[Option, ...] | list[Option]):
    for option in options:
        yield option
        if option.children:
            yield from walk_options(option.children)


@dataclass
class Vitals:
    hunger: float = 100.0
    cleanliness: float = 100.0
    mood: float = 80.0
    health: float = 100.0

    def clamp(self) -> None:
        self.hunger = max(0.0, min(100.0, self.hunger))
        self.cleanliness = max(0.0, min(100.0, self.cleanliness))
        self.mood = max(0.0, min(100.0, self.mood))
        self.health = max(0.0, min(100.0, self.health))


@dataclass
class Save:
    schema: int = 1
    last_simulated_at: float = 0.0
    rng_state: int = 1
    vitals: Vitals = field(default_factory=Vitals)
    gold: int = 80
    life_phase: Literal["alive", "dead"] = "alive"
    ailment: str | None = None
    active_job: str | None = None
    job_started_at: float | None = None
    last_care_minute: int = -1
    death_cause: str | None = None
    last_option: str | None = None
    last_still: str | None = None
    flags: dict[str, int] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "schema": self.schema,
            "last_simulated_at": self.last_simulated_at,
            "rng_state": self.rng_state,
            "vitals": {
                "hunger": self.vitals.hunger,
                "cleanliness": self.vitals.cleanliness,
                "mood": self.vitals.mood,
                "health": self.vitals.health,
            },
            "gold": self.gold,
            "life_phase": self.life_phase,
            "ailment": self.ailment,
            "active_job": self.active_job,
            "job_started_at": self.job_started_at,
            "last_care_minute": self.last_care_minute,
            "death_cause": self.death_cause,
            "last_option": self.last_option,
            "last_still": self.last_still,
            "flags": dict(self.flags),
        }

    @classmethod
    def from_dict(cls, data: dict) -> Save:
        raw = data.get("vitals") or {}
        vitals = Vitals(
            hunger=float(raw.get("hunger", 100)),
            cleanliness=float(raw.get("cleanliness", 100)),
            mood=float(raw.get("mood", 80)),
            health=float(raw.get("health", 100)),
        )
        vitals.clamp()
        phase = data.get("life_phase", "alive")
        if phase not in ("alive", "dead"):
            phase = "alive"
        return cls(
            schema=int(data.get("schema", 1)),
            last_simulated_at=float(data.get("last_simulated_at", 0)),
            rng_state=int(data.get("rng_state", 1)),
            vitals=vitals,
            gold=max(0, int(data.get("gold", 80))),
            life_phase=phase,
            ailment=data.get("ailment"),
            active_job=data.get("active_job"),
            job_started_at=data.get("job_started_at"),
            last_care_minute=int(data.get("last_care_minute", -1)),
            death_cause=data.get("death_cause"),
            last_option=data.get("last_option"),
            last_still=data.get("last_still"),
            flags={str(k): int(v) for k, v in (data.get("flags") or {}).items()},
        )


@dataclass(frozen=True)
class MenuItem:
    enabled: bool
    hint: str = ""


@dataclass(frozen=True)
class PetView:
    performance: Literal["idle", "work", "sick", "dead"]
    face: Literal["normal", "happy", "dizzy", "xx"]
    tint: Literal["none", "green", "gray"]
    still: str
    bubble: str | None
    gold: int
    menu: dict[str, MenuItem]


@dataclass(frozen=True)
class Ack:
    ok: bool
    bubble: str
    events: tuple[str, ...]
