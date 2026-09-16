/* 数字从 life/tables.py 抄来。不要在页面里另编一套。 */
(function (global) {
  var T = {
    HUNGER_IDLE: 1.0,
    HUNGER_JOB: 2.0,
    CLEAN_IDLE: 1.0,
    CLEAN_JOB: 1.5,
    MOOD_IDLE: 0.2,
    HEALTH_HUNGER0: 2.0,
    HEALTH_HUNGER_LOW: 0.4,
    HEALTH_CLEAN0: 1.0,
    HEALTH_CLEAN_LOW: 0.3,
    HEALTH_SICK: 0.8,
    HUNGER_LOW: 20.0,
    HEALTH_LOW: 20.0,
    CLEAN_LOW: 20.0,
    SICK_HUNGER: 30.0,
    SICK_CLEAN: 30.0,
    SICK_CHANCE: 0.03,
    JOB_ID: "odd_jobs",
    JOB_MINUTES: 30,
    JOB_PAY: 25,
    FEED_GOLD: 10,
    FEED_HUNGER: 40.0,
    FEED_MOOD: 8.0,
    BOWL_MAX: 10,
    WASH_GOLD: 5,
    WASH_CLEAN: 50.0,
    WASH_MOOD: 4.0,
    PLAY_MOOD: 18.0,
    PLAY_HUNGER: 4.0,
    MED_GOLD: 20,
    MED_HEALTH: 15.0,
    REVIVE_GOLD: 50,
    REVIVE_HUNGER: 60.0,
    REVIVE_CLEAN: 60.0,
    REVIVE_MOOD: 40.0,
    REVIVE_HEALTH: 50.0,
    REVIVE_STAMINA: 60.0,
    FOLLOW_STAMINA: 10.0,
    FOLLOW_HUNGER: 10.0,
    FOLLOW_CLEAN: 10.0,
    START_GOLD: 99999,
    ONLINE_GAP: 90.0,
    MAX_CATCHUP_MINUTES: 14 * 24 * 60,
    PET_MOOD: 4.0,
  };

  function clampVitals(v) {
    v.hunger = Math.max(0, Math.min(100, v.hunger));
    v.cleanliness = Math.max(0, Math.min(100, v.cleanliness));
    v.mood = Math.max(0, Math.min(100, v.mood));
    v.health = Math.max(0, Math.min(100, v.health));
    if (v.stamina == null || isNaN(v.stamina)) v.stamina = 100;
    v.stamina = Math.max(0, Math.min(100, v.stamina));
  }

  function readInventory(raw) {
    if (!Array.isArray(raw)) return [];
    var out = [];
    raw.forEach(function (it) {
      if (it == null) return;
      if (typeof it === "string") {
        var s = it.trim();
        if (!s) return;
        out.push({ id: s, name: s, count: 1 });
        return;
      }
      var name = String(it.name || it.id || "").trim();
      if (!name) return;
      out.push({
        id: String(it.id || name),
        name: name,
        count: Math.max(1, Math.round(Number(it.count || 1))),
      });
    });
    return out;
  }

  function newSave(now) {
    return {
      schema: 1,
      last_simulated_at: now,
      rng_state: 1,
      vitals: { hunger: 100, cleanliness: 100, mood: 80, health: 100, stamina: 100 },
      gold: T.START_GOLD,
      life_phase: "alive",
      ailment: null,
      active_job: null,
      job_started_at: null,
      last_care_minute: -1,
      death_cause: null,
      last_option: null,
      last_still: null,
      flags: { daily_life: 1 },
      inventory: [],
    };
  }

  function fromDict(data) {
    data = data || {};
    var raw = data.vitals || {};
    var save = {
      schema: Number(data.schema || 1),
      last_simulated_at: Number(data.last_simulated_at || 0),
      rng_state: Number(data.rng_state || 1),
      vitals: {
        hunger: Number(raw.hunger != null ? raw.hunger : 100),
        cleanliness: Number(raw.cleanliness != null ? raw.cleanliness : 100),
        mood: Number(raw.mood != null ? raw.mood : 80),
        health: Number(raw.health != null ? raw.health : 100),
        stamina: Number(raw.stamina != null ? raw.stamina : 100),
      },
      gold: Math.max(0, Number(data.gold != null ? data.gold : T.START_GOLD)),
      life_phase: data.life_phase === "dead" ? "dead" : "alive",
      ailment: data.ailment || null,
      active_job: data.active_job || null,
      job_started_at: data.job_started_at == null ? null : Number(data.job_started_at),
      last_care_minute: Number(data.last_care_minute != null ? data.last_care_minute : -1),
      death_cause: data.death_cause || null,
      last_option: data.last_option || null,
      last_still: data.last_still || null,
      flags: {},
      inventory: readInventory(data.inventory),
    };
    var flags = data.flags || {};
    Object.keys(flags).forEach(function (k) {
      save.flags[k] = Number(flags[k]);
    });
    clampVitals(save.vitals);
    return save;
  }

  function toDict(save) {
    return {
      schema: save.schema,
      last_simulated_at: save.last_simulated_at,
      rng_state: save.rng_state,
      vitals: {
        hunger: save.vitals.hunger,
        cleanliness: save.vitals.cleanliness,
        mood: save.vitals.mood,
        health: save.vitals.health,
        stamina: save.vitals.stamina,
      },
      gold: save.gold,
      life_phase: save.life_phase,
      ailment: save.ailment,
      active_job: save.active_job,
      job_started_at: save.job_started_at,
      last_care_minute: save.last_care_minute,
      death_cause: save.death_cause,
      last_option: save.last_option,
      last_still: save.last_still,
      flags: Object.assign({}, save.flags),
      inventory: (save.inventory || []).map(function (it) {
        return { id: it.id, name: it.name, count: it.count };
      }),
    };
  }

  function rngUnit(save) {
    save.rng_state = (save.rng_state * 1664525 + 1013904223) >>> 0;
    return save.rng_state / 0xffffffff;
  }

  function simMinute(ts) {
    return Math.floor(ts / 60);
  }

  function die(save, cause, events) {
    if (save.life_phase === "dead") return;
    save.life_phase = "dead";
    save.death_cause = cause;
    save.active_job = null;
    save.job_started_at = null;
    save.vitals.health = 0;
    events.push("died");
  }

  function payJob(save, minutesDone) {
    var frac = Math.max(0, Math.min(1, minutesDone / T.JOB_MINUTES));
    return Math.floor(T.JOB_PAY * frac);
  }

  function stopJob(save, events, full) {
    if (save.active_job == null || save.job_started_at == null) return;
    var elapsed = (save.last_simulated_at - save.job_started_at) / 60;
    var pay = full ? T.JOB_PAY : payJob(save, elapsed);
    save.gold += pay;
    save.active_job = null;
    save.job_started_at = null;
    events.push(full ? "job_done" : "job_stopped");
    if (pay) events.push("earned");
  }

  function oneMinute(save, events) {
    var v = save.vitals;
    var working = save.active_job != null;
    v.hunger -= working ? T.HUNGER_JOB : T.HUNGER_IDLE;
    v.cleanliness -= working ? T.CLEAN_JOB : T.CLEAN_IDLE;
    v.mood -= T.MOOD_IDLE;
    if (working && save.job_started_at != null) {
      var elapsed = (save.last_simulated_at + 60 - save.job_started_at) / 60;
      if (elapsed + 1e-9 >= T.JOB_MINUTES) {
        save.active_job = null;
        save.job_started_at = null;
        save.gold += T.JOB_PAY;
        events.push("job_done");
        events.push("earned");
      }
    }
    if (v.hunger <= 0) v.health -= T.HEALTH_HUNGER0;
    else if (v.hunger < T.HUNGER_LOW) v.health -= T.HEALTH_HUNGER_LOW;
    if (v.cleanliness <= 0) v.health -= T.HEALTH_CLEAN0;
    else if (v.cleanliness < T.CLEAN_LOW) v.health -= T.HEALTH_CLEAN_LOW;
    if (save.ailment) v.health -= T.HEALTH_SICK;
    v.mood = v.mood * 0.85 + v.health * 0.15;
    clampVitals(v);
    if (
      save.ailment == null &&
      save.life_phase === "alive" &&
      (v.hunger < T.SICK_HUNGER || v.cleanliness < T.SICK_CLEAN) &&
      rngUnit(save) < T.SICK_CHANCE
    ) {
      save.ailment = "cold";
      events.push("fell_ill");
    }
    if (v.health <= 0) die(save, save.ailment ? "illness" : "neglect", events);
  }

  function advanceTo(save, now) {
    var events = [];
    if (now < save.last_simulated_at) now = save.last_simulated_at;
    if (save.life_phase === "dead") {
      save.last_simulated_at = now;
      return events;
    }
    var gap = now - save.last_simulated_at;
    if (gap > T.ONLINE_GAP && save.active_job != null) stopJob(save, events, false);
    var startMin = simMinute(save.last_simulated_at);
    var endMin = simMinute(now);
    var steps = Math.min(Math.max(0, endMin - startMin), T.MAX_CATCHUP_MINUTES);
    for (var i = 0; i < steps; i++) {
      if (save.life_phase === "dead") break;
      oneMinute(save, events);
      save.last_simulated_at += 60;
    }
    save.last_simulated_at = now;
    return events;
  }

  function applyCommand(save, kind, now) {
    var events = [];
    if (save.life_phase === "dead") {
      if (kind !== "revive") {
        events.push("denied");
        return events;
      }
      if (save.gold < T.REVIVE_GOLD) {
        events.push("denied");
        return events;
      }
      save.gold -= T.REVIVE_GOLD;
      save.life_phase = "alive";
      save.death_cause = null;
      save.ailment = null;
      save.vitals = {
        hunger: T.REVIVE_HUNGER,
        cleanliness: T.REVIVE_CLEAN,
        mood: T.REVIVE_MOOD,
        health: T.REVIVE_HEALTH,
        stamina: T.REVIVE_STAMINA,
      };
      save.last_care_minute = simMinute(now);
      events.push("revived");
      return events;
    }

    if (kind === "start_job") {
      if (save.active_job != null) {
        events.push("busy");
        return events;
      }
      save.active_job = T.JOB_ID;
      save.job_started_at = now;
      events.push("job_started");
      return events;
    }
    if (kind === "stop_job") {
      if (save.active_job == null) {
        events.push("denied");
        return events;
      }
      stopJob(save, events, false);
      return events;
    }
    if (kind === "revive") {
      events.push("denied");
      return events;
    }

    var v = save.vitals;
    if (kind === "pour") {
      if (save.gold < T.FEED_GOLD) {
        events.push("denied");
        return events;
      }
      save.gold -= T.FEED_GOLD;
      events.push("poured");
    } else if (kind === "meal") {
      v.hunger += T.FEED_HUNGER;
      v.mood += T.FEED_MOOD;
      events.push("fed");
    } else if (kind === "feed") {
      if (save.gold < T.FEED_GOLD) {
        events.push("denied");
        return events;
      }
      save.gold -= T.FEED_GOLD;
      v.hunger += T.FEED_HUNGER;
      v.mood += T.FEED_MOOD;
      events.push("fed");
    } else if (kind === "wash") {
      if (save.gold < T.WASH_GOLD) {
        events.push("denied");
        return events;
      }
      save.gold -= T.WASH_GOLD;
      v.cleanliness += T.WASH_CLEAN;
      v.mood += T.WASH_MOOD;
      events.push("washed");
    } else if (kind === "play") {
      v.mood += T.PLAY_MOOD;
      v.hunger -= T.PLAY_HUNGER;
      events.push("played");
    } else if (kind === "medicine") {
      if (save.gold < T.MED_GOLD) {
        events.push("denied");
        return events;
      }
      save.gold -= T.MED_GOLD;
      v.health += T.MED_HEALTH;
      save.ailment = null;
      events.push("cured");
    } else if (kind === "pet") {
      v.mood += T.PET_MOOD;
      events.push("pet");
    } else if (kind === "scold") {
      v.mood -= 12;
      events.push("scolded");
    } else if (kind === "timeout") {
      v.mood -= 8;
      v.hunger -= 4;
      events.push("timeout");
    } else if (kind === "ignore") {
      v.mood -= 6;
      events.push("ignored");
    } else {
      events.push("denied");
      return events;
    }
    clampVitals(v);
    if (kind !== "pet" && kind !== "meal") save.last_care_minute = simMinute(now);
    return events;
  }

  function step(save, now, kind) {
    var events = advanceTo(save, now);
    if (kind) events = events.concat(applyCommand(save, kind, now));
    return events;
  }

  function followSwitch(save) {
    var v = save.vitals;
    v.stamina -= T.FOLLOW_STAMINA;
    v.hunger -= T.FOLLOW_HUNGER;
    v.cleanliness -= T.FOLLOW_CLEAN;
    clampVitals(v);
  }

  global.Life = {
    T: T,
    newSave: newSave,
    fromDict: fromDict,
    toDict: toDict,
    advanceTo: advanceTo,
    applyCommand: applyCommand,
    followSwitch: followSwitch,
    step: step,
  };
})(window);
