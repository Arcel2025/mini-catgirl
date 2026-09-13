from __future__ import annotations

from . import tables as T
from .types import Command, Option, Save, Vitals


def new_save(now: float, rng_state: int = 1) -> Save:
    return Save(last_simulated_at=now, rng_state=rng_state, gold=T.START_GOLD)


def _rng_unit(save: Save) -> float:
    save.rng_state = (save.rng_state * 1664525 + 1013904223) & 0xFFFFFFFF
    return save.rng_state / 0xFFFFFFFF


def _sim_minute(ts: float) -> int:
    return int(ts // 60.0)


def _die(save: Save, cause: str, events: list[str]) -> None:
    if save.life_phase == "dead":
        return
    save.life_phase = "dead"
    save.death_cause = cause
    save.active_job = None
    save.job_started_at = None
    save.vitals.health = 0.0
    events.append("died")


def _pay_job(save: Save, minutes_done: float) -> int:
    frac = max(0.0, min(1.0, minutes_done / T.JOB_MINUTES))
    return int(T.JOB_PAY * frac)


def _stop_job(save: Save, events: list[str], *, full: bool) -> None:
    if save.active_job is None or save.job_started_at is None:
        return
    elapsed = (save.last_simulated_at - save.job_started_at) / 60.0
    pay = T.JOB_PAY if full else _pay_job(save, elapsed)
    save.gold += pay
    save.active_job = None
    save.job_started_at = None
    events.append("job_done" if full else "job_stopped")
    if pay:
        events.append("earned")


def _one_minute(save: Save, events: list[str]) -> None:
    v = save.vitals
    working = save.active_job is not None
    v.hunger -= T.HUNGER_JOB if working else T.HUNGER_IDLE
    v.cleanliness -= T.CLEAN_JOB if working else T.CLEAN_IDLE
    v.mood -= T.MOOD_IDLE
    if working and save.job_started_at is not None:
        elapsed = (save.last_simulated_at + 60.0 - save.job_started_at) / 60.0
        if elapsed + 1e-9 >= T.JOB_MINUTES:
            save.active_job = None
            save.job_started_at = None
            save.gold += T.JOB_PAY
            events.append("job_done")
            events.append("earned")
    if v.hunger <= 0:
        v.health -= T.HEALTH_HUNGER0
    elif v.hunger < T.HUNGER_LOW:
        v.health -= T.HEALTH_HUNGER_LOW
    if v.cleanliness <= 0:
        v.health -= T.HEALTH_CLEAN0
    elif v.cleanliness < T.CLEAN_LOW:
        v.health -= T.HEALTH_CLEAN_LOW
    if save.ailment:
        v.health -= T.HEALTH_SICK
    v.mood = v.mood * 0.85 + v.health * 0.15
    v.clamp()
    if (
        save.ailment is None
        and save.life_phase == "alive"
        and (v.hunger < T.SICK_HUNGER or v.cleanliness < T.SICK_CLEAN)
        and _rng_unit(save) < T.SICK_CHANCE
    ):
        save.ailment = "cold"
        events.append("fell_ill")
    if v.health <= 0:
        cause = "illness" if save.ailment else "neglect"
        _die(save, cause, events)


def advance_to(save: Save, now: float) -> list[str]:
    events: list[str] = []
    if now < save.last_simulated_at:
        now = save.last_simulated_at
    if save.life_phase == "dead":
        save.last_simulated_at = now
        return events
    gap = now - save.last_simulated_at
    if gap > T.ONLINE_GAP and save.active_job is not None:
        _stop_job(save, events, full=False)
    start_min = _sim_minute(save.last_simulated_at)
    end_min = _sim_minute(now)
    steps = min(max(0, end_min - start_min), T.MAX_CATCHUP_MINUTES)
    for _ in range(steps):
        if save.life_phase == "dead":
            break
        _one_minute(save, events)
        save.last_simulated_at += 60.0
    save.last_simulated_at = now
    return events


def _care_denied(save: Save, now: float) -> bool:
    return _sim_minute(now) == save.last_care_minute


def apply_command(save: Save, command: Command, now: float) -> list[str]:
    events: list[str] = []
    if save.life_phase == "dead":
        if command.kind != "revive":
            events.append("denied")
            return events
        if save.gold < T.REVIVE_GOLD:
            events.append("denied")
            return events
        save.gold -= T.REVIVE_GOLD
        save.life_phase = "alive"
        save.death_cause = None
        save.ailment = None
        save.vitals = Vitals(
            hunger=T.REVIVE_HUNGER,
            cleanliness=T.REVIVE_CLEAN,
            mood=T.REVIVE_MOOD,
            health=T.REVIVE_HEALTH,
        )
        save.last_care_minute = _sim_minute(now)
        events.append("revived")
        return events

    if command.kind == "start_job":
        if save.active_job is not None:
            events.append("busy")
            return events
        save.active_job = T.JOB_ID
        save.job_started_at = now
        events.append("job_started")
        return events

    if command.kind == "stop_job":
        if save.active_job is None:
            events.append("denied")
            return events
        _stop_job(save, events, full=False)
        return events

    if command.kind == "revive":
        events.append("denied")
        return events

    if _care_denied(save, now):
        events.append("denied")
        return events

    v = save.vitals
    if command.kind == "feed":
        if save.gold < T.FEED_GOLD:
            events.append("denied")
            return events
        save.gold -= T.FEED_GOLD
        v.hunger += T.FEED_HUNGER
        v.mood += T.FEED_MOOD
        events.append("fed")
    elif command.kind == "wash":
        if save.gold < T.WASH_GOLD:
            events.append("denied")
            return events
        save.gold -= T.WASH_GOLD
        v.cleanliness += T.WASH_CLEAN
        v.mood += T.WASH_MOOD
        events.append("washed")
    elif command.kind == "play":
        v.mood += T.PLAY_MOOD
        v.hunger -= T.PLAY_HUNGER
        events.append("played")
    elif command.kind == "medicine":
        if save.gold < T.MED_GOLD:
            events.append("denied")
            return events
        save.gold -= T.MED_GOLD
        v.health += T.MED_HEALTH
        save.ailment = None
        events.append("cured")
    else:
        events.append("denied")
        return events
    v.clamp()
    save.last_care_minute = _sim_minute(now)
    return events


def option_allowed(save: Save, option: Option) -> bool:
    if option.children:
        return True
    if option.need_flag and int(save.flags.get(option.need_flag, 0)) <= 0:
        return False
    if option.unless_flag and int(save.flags.get(option.unless_flag, 0)) > 0:
        return False
    if option.require == "alive" and save.life_phase != "alive":
        return False
    if option.require == "dead" and save.life_phase != "dead":
        return False
    if option.engine == "start_job" and save.active_job is not None:
        return False
    if option.engine == "stop_job" and save.active_job is None:
        return False
    return True


def _stamp_option(save: Save, option: Option) -> None:
    save.last_option = option.id
    save.last_still = option.still
    if option.set_flag:
        save.flags[option.set_flag] = option.flag_value


def apply_option(save: Save, option: Option, now: float) -> list[str]:
    if option.children:
        return ["denied"]
    if not option_allowed(save, option):
        return ["denied"]
    if option.engine is not None:
        events = apply_command(save, Command(option.engine), now)
        if "denied" not in events and "busy" not in events:
            _stamp_option(save, option)
        return events
    v = save.vitals
    v.hunger += option.hunger
    v.cleanliness += option.cleanliness
    v.mood += option.mood
    v.health += option.health
    save.gold = max(0, save.gold + option.gold)
    v.clamp()
    _stamp_option(save, option)
    events = ["acted"]
    if v.health <= 0:
        _die(save, "neglect", events)
    return events


def step(
    save: Save,
    now: float,
    command: Command | None = None,
    option: Option | None = None,
) -> tuple[Save, list[str]]:
    events = advance_to(save, now)
    if option is not None:
        events.extend(apply_option(save, option, now))
    elif command is not None:
        events.extend(apply_command(save, command, now))
    return save, events
