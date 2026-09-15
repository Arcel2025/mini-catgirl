(function () {
  var KEY = function (n) {
    return "xiaoweiqu-save-" + n;
  };

  var slot = 0;
  var save = null;
  var house = null;
  var moving = false;
  var eatingUntil = 0;
  var drag = null;
  var bowlDrag = null;
  var pouring = false;
  var walkGen = 0;
  var followGen = 0;
  var lastWanderAt = 0;
  var lastPoseAt = 0;
  var WANDER_MS = 5 * 60 * 1000;
  var POSE_MS = 3 * 60 * 1000;
  var seekGen = 0;
  var pleadToken = 0;
  var pleading = false;
  var bowTimer = 0;
  var tailTimer = 0;
  var tailToken = 0;

  var els = {
    hunger: document.getElementById("hunger"),
    clean: document.getElementById("clean"),
    mood: document.getElementById("mood"),
    health: document.getElementById("health"),
    stamina: document.getElementById("stamina"),
    hungerN: document.getElementById("hungerN"),
    cleanN: document.getElementById("cleanN"),
    moodN: document.getElementById("moodN"),
    healthN: document.getElementById("healthN"),
    staminaN: document.getElementById("staminaN"),
    gold: document.getElementById("gold"),
    time: document.getElementById("save-time"),
    bag: document.getElementById("bag"),
    where: document.getElementById("where"),
    stage: document.getElementById("stage"),
    scene: document.getElementById("scene"),
    bg: document.getElementById("bg"),
    girl: document.getElementById("girl"),
    girlImg: document.querySelector("#girl img"),
    bowl: document.getElementById("bowl"),
    bowlImg: document.getElementById("bowl-img"),
    bowlN: document.getElementById("bowl-n"),
    gate: document.getElementById("gate"),
    line: document.getElementById("line"),
    file: document.getElementById("file"),
    places: document.getElementById("places"),
    minimap: document.getElementById("minimap"),
    gear: document.getElementById("gear"),
    settings: document.getElementById("settings"),
    settingsDim: document.getElementById("settings-dim"),
    settingsClose: document.getElementById("settings-close"),
    pinYouMini: document.getElementById("pin-you-mini"),
    pinHerMini: document.getElementById("pin-her-mini"),
  };

  var STEP_MS = 280;
  var RUN_STEP_MS = 120;
  var PANT_FRAME_MS = 170;
  var PANT_MS = 2800;
  var STICKERS = {
    stand: "assets/stand.png?v=head1",
    sit: "assets/sit.png?v=head1",
    eat: "assets/eat.png",
    lieClosed: "assets/lie-closed.png?v=1",
    lieGlance: "assets/lie-glance.png?v=1",
    bow: "assets/bow-a.png?v=1",
  };
  var WALK_CYCLE = [
    "assets/walk-1.png?v=step2",
    "assets/walk-3.png?v=step2",
  ];
  var RUN_CYCLE = [
    "assets/run-1.png?v=qrun1",
    "assets/run-2.png?v=qrun1",
    "assets/run-3.png?v=qrun1",
    "assets/run-4.png?v=qrun1",
  ];
  var PANT_CYCLE = ["assets/pant-a.png?v=run1", "assets/pant-b.png?v=run1"];
  var BOW_CYCLE = ["assets/bow-a.png?v=1", "assets/bow-b.png?v=1"];
  var BOW_FRAME_MS = 340;
  var STAND_CYCLE = ["assets/stand.png?v=head1", "assets/stand-b.png?v=head1"];
  var SIT_CYCLE = ["assets/sit.png?v=head1", "assets/sit-b.png?v=head1"];
  var TAIL_FRAME_MS = 1700;
  var BOWL = {
    empty: "assets/bowl-empty.png?v=bowl2",
    full: "assets/bowl-full.png?v=bowl2",
    pour: "assets/bowl-pour.png?v=bowl2",
  };
  var MEAL_HUNGER = 40;
  function preloadSrc(src) {
    var img = new Image();
    img.src = src;
  }
  Object.keys(STICKERS).forEach(function (k) {
    preloadSrc(STICKERS[k]);
  });
  WALK_CYCLE.forEach(preloadSrc);
  RUN_CYCLE.forEach(preloadSrc);
  PANT_CYCLE.forEach(preloadSrc);
  BOW_CYCLE.forEach(preloadSrc);
  STAND_CYCLE.forEach(preloadSrc);
  SIT_CYCLE.forEach(preloadSrc);
  Object.keys(BOWL).forEach(function (k) {
    preloadSrc(BOWL[k]);
  });
  Object.keys(House.PLACES).forEach(function (id) {
    var img = new Image();
    img.src = House.PLACES[id].bg;
  });
  (function () {
    var img = new Image();
    img.src = "assets/house-floorplan.png";
  })();

  function girl() {
    return house.residents[0];
  }

  function placeOf(id) {
    return House.PLACES[id];
  }

  function here() {
    return girl().place === house.view;
  }

  function spotsOf(placeId) {
    return placeOf(placeId).spots;
  }

  function clearFlip() {
    els.girlImg.style.transform = "";
  }

  var glanceOpen = false;

  function starving() {
    return save && save.life_phase === "alive" && save.vitals.hunger < Life.T.HUNGER_LOW;
  }

  function stopTail() {
    tailToken += 1;
    if (tailTimer) {
      window.clearInterval(tailTimer);
      tailTimer = 0;
    }
  }

  function startTail(kind) {
    var frames = kind === "sit" ? SIT_CYCLE : STAND_CYCLE;
    stopTail();
    var token = ++tailToken;
    var frame = 0;
    els.girlImg.src = frames[0];
    tailTimer = window.setInterval(function () {
      if (token !== tailToken) {
        window.clearInterval(tailTimer);
        tailTimer = 0;
        return;
      }
      if (moving || drag || girl().sticker !== kind) return;
      frame = (frame + 1) % frames.length;
      els.girlImg.src = frames[frame];
    }, TAIL_FRAME_MS);
  }

  function setSticker(kind) {
    var g = girl();
    g.sticker = kind;
    if (kind === "walk" || kind === "run") {
      stopTail();
      return;
    }
    els.girl.classList.remove("running");
    els.girl.classList.toggle("panting", kind === "pant");
    els.girl.classList.toggle("bowing", kind === "bow");
    els.girl.classList.toggle("sitting", kind === "sit");
    els.girl.classList.toggle("eating", kind === "eat");
    els.girl.classList.toggle("starving", kind === "lie");
    els.bowl.classList.toggle("away", kind === "eat" && house.view === house.bowl.place);
    if (kind === "lie") {
      stopTail();
      els.girlImg.src = glanceOpen ? STICKERS.lieGlance : STICKERS.lieClosed;
      return;
    }
    glanceOpen = false;
    if (kind === "stand" || kind === "sit") {
      startTail(kind);
      return;
    }
    stopTail();
    els.girlImg.src = STICKERS[kind] || STICKERS.stand;
  }

  function applyHungerPose() {
    if (!save || moving || drag || bowlDrag || Date.now() < eatingUntil) return;
    if (save.life_phase === "dead") {
      els.girl.classList.remove("starving");
      return;
    }
    var g = girl();
    if (g.sticker === "eat" || g.sticker === "walk" || g.sticker === "run" || g.sticker === "pant" || g.sticker === "bow") return;
    if (wantsMeal()) return;
    if (starving()) {
      if (g.sticker !== "lie") {
        clearFlip();
        setSticker("lie");
      }
    } else if (g.sticker === "lie") {
      clearFlip();
      setSticker("stand");
    }
  }

  function now() {
    return Date.now() / 1000;
  }

  function persist() {
    var data = Life.toDict(save);
    data.house = House.toSave(house);
    localStorage.setItem(KEY(slot), JSON.stringify(data));
  }

  function buildNav() {
    els.places.innerHTML = "";
    House.NAV.forEach(function (item) {
      if (item.locked) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.name;
      btn.setAttribute("data-nav", item.id);
      btn.addEventListener("click", function () {
        setView(item.id);
      });
      els.places.appendChild(btn);
    });
  }

  function applyView() {
    var p = placeOf(house.view);
    var g = girl();
    function layout() {
      els.scene.style.setProperty("--ar", p.ar);
      els.scene.style.setProperty("--ar-num", String(p.arNum));
      els.scene.style.setProperty("--girl-w", p.girlW);
      els.scene.style.setProperty("--girl-eat-w", p.girlEatW);
      els.scene.style.setProperty("--girl-lie-w", p.girlLieW || "16%");
      els.bg.style.opacity = "1";
    }
    els.stage.dataset.place = p.id;
    els.bg.alt = p.name;
    placeBowl();
    if (p.gate) {
      els.gate.hidden = false;
      els.gate.style.left = p.gate.x + "%";
      els.gate.style.top = p.gate.y + "%";
      els.gate.style.width = p.gate.w + "%";
      els.gate.style.height = p.gate.h + "%";
      els.gate.setAttribute("aria-label", p.gate.label);
    } else {
      els.gate.hidden = true;
    }
    els.girl.classList.toggle("away", g.place !== p.id);
    els.girl.setAttribute("aria-hidden", g.place !== p.id ? "true" : "false");
    els.girl.setAttribute("aria-label", g.name);
    document.querySelectorAll("[data-nav]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-nav") === house.view && !btn.classList.contains("locked"));
    });
    var want = p.bg;
    var current = els.bg.getAttribute("src") || "";
    if (current === want && els.bg.complete && els.bg.naturalWidth) {
      layout();
      return;
    }
    els.bg.style.opacity = "0";
    els.bg.onload = function () {
      els.bg.onload = null;
      layout();
    };
    els.bg.onerror = function () {
      els.bg.onerror = null;
      layout();
    };
    els.bg.src = want;
    if (els.bg.complete && els.bg.naturalWidth) {
      els.bg.onload = null;
      layout();
    }
  }

  function setView(id) {
    if (!placeOf(id) || house.view === id) return;
    if (drag) {
      els.girl.classList.remove("dragging");
      drag = null;
    }
    if (bowlDrag) {
      els.bowl.classList.remove("dragging");
      bowlDrag = null;
    }
    house.view = id;
    applyView();
    if (!here()) setLine(girl().name + "在" + placeOf(girl().place).name + "。");
    persist();
    render(true);
    followYou();
  }

  function loadSlot(n) {
    slot = n;
    var raw = localStorage.getItem(KEY(n));
    var data = null;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (e) {
        data = null;
      }
    }
    if (!data) {
      save = Life.newSave(now());
      house = House.defaultHouse();
    } else {
      save = Life.fromDict(data);
      house = House.fromSave(data);
    }
    save.flags.daily_life = 1;
    save.gold = Life.T.START_GOLD;
    lastWanderAt = Date.now();
    lastPoseAt = Date.now();
    var g = girl();
    if (g.sticker === "walk" || g.sticker === "eat" || g.sticker === "run" || g.sticker === "pant" || g.sticker === "bow") g.sticker = "stand";
    moving = false;
    eatingUntil = 0;
    pouring = false;
    bowlDrag = null;
    stopPlead();
    seekGen += 1;
    els.bowl.classList.remove("dragging");
    els.bowl.classList.remove("pouring");
    walkGen += 1;
    followGen += 1;
    els.girl.classList.remove("walking");
    els.girl.classList.remove("running");
    els.girl.classList.remove("panting");
    applyView();
    setSticker(g.sticker);
    Life.advanceTo(save, now());
    ensureSpeakerLine();
    persist();
    render(true);
    followYou();
    tryStartMeal();
  }

  function pct(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function placeGirl() {
    var g = girl();
    els.girl.style.left = g.x + "%";
    els.girl.style.top = g.y + "%";
  }

  function setLine(text) {
    house.line = text;
    els.line.textContent = text;
  }

  function speakerName() {
    return (girl() && girl().name) || "小委屈";
  }

  function sheSays(text) {
    var body = String(text || "");
    var prefix = speakerName() + "：";
    if (body.indexOf(prefix) === 0) setLine(body);
    else setLine(prefix + body);
  }

  function looksLikeSystemLine(text) {
    if (!text) return true;
    if (text.indexOf("：") !== -1) return false;
    var keys = [
      "她不动了",
      "金币不够",
      "档案读",
      "这份档案",
      "碗边叮了一下",
      "那边有吃饭的声音",
      "她听不见",
      "现在不用救",
      "哗——粮倒进去了",
    ];
    var i;
    for (i = 0; i < keys.length; i++) if (text.indexOf(keys[i]) === 0) return true;
    if (/^.+在.+。$/.test(text) && text.indexOf("喵") === -1) return true;
    return false;
  }

  function ensureSpeakerLine() {
    var line = house.line || "";
    if (!line || looksLikeSystemLine(line)) return;
    sheSays(line);
  }

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function formatSaveTime() {
    var ts = save && save.last_simulated_at ? save.last_simulated_at : now();
    var d = new Date(ts * 1000);
    if (isNaN(d.getTime())) d = new Date();
    return (
      d.getFullYear() +
      "年" +
      (d.getMonth() + 1) +
      "月" +
      d.getDate() +
      "日 " +
      pad2(d.getHours()) +
      ":" +
      pad2(d.getMinutes())
    );
  }

  function renderBag() {
    var items = (save && save.inventory) || [];
    els.bag.innerHTML = "";
    if (!items.length) {
      els.bag.classList.add("empty");
      var empty = document.createElement("li");
      empty.textContent = "空";
      els.bag.appendChild(empty);
      return;
    }
    els.bag.classList.remove("empty");
    items.forEach(function (it) {
      var li = document.createElement("li");
      var name = it.name || it.id || "东西";
      var n = Number(it.count || 1);
      li.textContent = n > 1 ? name + " ×" + n : name;
      els.bag.appendChild(li);
    });
  }

  function whereText() {
    var g = girl();
    var p = placeOf(g.place);
    return "位置：" + (p ? p.name : g.place);
  }

  function mapPos(placeId) {
    var p = placeOf(placeId);
    return (p && p.map) || { x: 50, y: 50 };
  }

  function setPin(el, x, y) {
    if (!el) return;
    el.style.left = x + "%";
    el.style.top = y + "%";
  }

  function placePins() {
    var her = mapPos(girl().place);
    var you = mapPos(house.view);
    var same = girl().place === house.view;
    var hx = her.x + (same ? -1.1 : 0);
    var hy = her.y + (same ? -1.1 : 0);
    var yx = you.x + (same ? 1.1 : 0);
    var yy = you.y + (same ? 1.1 : 0);
    setPin(els.pinHerMini, hx, hy);
    setPin(els.pinYouMini, yx, yy);
  }

  function toneClass(n) {
    if (n >= 80) return "tone-hi";
    if (n >= 40) return "tone-ok";
    if (n >= 10) return "tone-low";
    return "tone-empty";
  }

  function paintBar(em, numEl, value) {
    var n = pct(value);
    em.style.width = n + "%";
    numEl.textContent = n;
    em.classList.remove("tone-hi", "tone-ok", "tone-low", "tone-empty");
    em.classList.add(toneClass(n));
  }

  function render(place) {
    var v = save.vitals;
    paintBar(els.hunger, els.hungerN, v.hunger);
    paintBar(els.clean, els.cleanN, v.cleanliness);
    paintBar(els.mood, els.moodN, v.mood);
    paintBar(els.health, els.healthN, v.health);
    paintBar(els.stamina, els.staminaN, v.stamina);
    els.gold.textContent = save.gold + " 金";
    els.time.textContent = formatSaveTime();
    renderBag();
    els.where.textContent = whereText();
    els.line.textContent = house.line;
    placeBowl();
    els.girl.classList.toggle("dead", save.life_phase === "dead");
    els.girl.classList.toggle("eating", girl().sticker === "eat");
    els.girl.classList.toggle("away", !here());
    applyHungerPose();
    if (isPleading()) {
      girl().sticker = "bow";
      els.girl.classList.add("bowing");
    }
    if (place) placeGirl();
    placePins();
  }

  function bowlOnView() {
    return house.bowl.place === house.view;
  }

  function paintBowl() {
    els.bowlN.textContent = String(house.bowl.food);
    els.bowl.classList.toggle("has-food", house.bowl.food > 0);
    if (pouring) return;
    els.bowlImg.src = house.bowl.food > 0 ? BOWL.full : BOWL.empty;
  }

  function placeBowl() {
    var on = bowlOnView();
    els.bowl.hidden = !on;
    els.bowl.classList.toggle(
      "away",
      on && girl().sticker === "eat" && girl().place === house.bowl.place
    );
    els.bowl.style.left = house.bowl.x + "%";
    els.bowl.style.top = house.bowl.y + "%";
    paintBowl();
  }

  function mealTarget() {
    return {
      x: Math.max(8, Math.min(92, house.bowl.x + 7)),
      y: Math.max(18, Math.min(94, house.bowl.y + 3)),
    };
  }

  function nearestSpot(x, y) {
    var spots = spotsOf(girl().place);
    var best = null;
    var bestD = Infinity;
    Object.keys(spots).forEach(function (id) {
      var s = spots[id];
      var d = (s.x - x) * (s.x - x) + (s.y - y) * (s.y - y);
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    });
    return best;
  }

  function abortWalk() {
    walkGen += 1;
    moving = false;
  }

  function putResident(g, placeId, spotId) {
    var p = placeOf(placeId);
    var spot = (p && p.spots[spotId]) || p.spots.center || p.spots.door || p.spots.rug;
    g.place = placeId;
    g.spot = spotId || "center";
    g.x = spot.x;
    g.y = spot.y;
  }

  function walkDuration(dist) {
    return Math.max(1100, Math.min(2600, dist * 34)) * 10;
  }

  function walkTo(spotId, done, gait) {
    if (isPleading()) return;
    gait = gait || "walk";
    var frames = gait === "run" ? RUN_CYCLE : WALK_CYCLE;
    var stepMs = gait === "run" ? RUN_STEP_MS : STEP_MS;
    var g = girl();
    var target = null;
    var arrivedSpot = "rug";
    if (spotId && typeof spotId === "object") {
      target = { x: spotId.x, y: spotId.y };
      arrivedSpot = "rug";
    } else if (spotId === "bowl") {
      if (g.place === house.bowl.place) {
        target = mealTarget();
        arrivedSpot = "bowl";
      }
    } else {
      target = spotsOf(g.place)[spotId];
      arrivedSpot = spotId;
    }
    if (!target) {
      if (done) done();
      return;
    }
    var sx = g.x;
    var sy = g.y;
    var dist = Math.hypot(target.x - sx, target.y - sy);
    if (dist < 1.4) {
      g.spot = arrivedSpot;
      g.x = target.x;
      g.y = target.y;
      if (here()) placeGirl();
      if (done) done();
      return;
    }
    var gen = ++walkGen;
    moving = true;
    stopTail();
    g.sticker = gait === "run" ? "run" : "walk";
    if (here()) {
      els.girl.classList.add("walking");
      els.girl.classList.toggle("running", gait === "run");
      els.girl.classList.remove("eating");
      els.girl.classList.remove("starving");
      els.girl.classList.remove("panting");
      els.girl.classList.remove("sitting");
      els.girl.classList.remove("bowing");
      els.girlImg.style.transform = target.x > sx + 0.8 ? "scaleX(-1)" : "scaleX(1)";
      els.girlImg.src = frames[0];
    }
    var frame = 0;
    var t0 = performance.now();
    var dur = walkDuration(dist);
    var frameTimer = window.setInterval(function () {
      if (gen !== walkGen) {
        window.clearInterval(frameTimer);
        return;
      }
      if (!here()) return;
      frame = (frame + 1) % frames.length;
      els.girlImg.src = frames[frame];
    }, stepMs);
    function tick(t) {
      if (gen !== walkGen) {
        window.clearInterval(frameTimer);
        return;
      }
      if (drag) {
        window.clearInterval(frameTimer);
        moving = false;
        return;
      }
      var p = Math.min(1, (t - t0) / dur);
      var e = p * (2 - p);
      g.x = sx + (target.x - sx) * e;
      g.y = sy + (target.y - sy) * e;
      if (here()) placeGirl();
      if (p < 1) requestAnimationFrame(tick);
      else {
        window.clearInterval(frameTimer);
        if (gen !== walkGen) return;
        g.spot = arrivedSpot;
        g.x = target.x;
        g.y = target.y;
        moving = false;
        els.girl.classList.remove("walking");
        els.girl.classList.remove("running");
        persist();
        if (done) done();
        else {
          clearFlip();
          setSticker(starving() ? "lie" : "stand");
        }
      }
    }
    requestAnimationFrame(tick);
  }

  function startPant() {
    var gen = ++walkGen;
    var g = girl();
    moving = true;
    g.sticker = "pant";
    els.girl.classList.remove("walking");
    els.girl.classList.remove("running");
    els.girl.classList.add("panting");
    sheSays("呼……呼……");
    persist();
    if (!here()) {
      moving = false;
      els.girl.classList.remove("panting");
      setSticker(starving() ? "lie" : "stand");
      persist();
      return;
    }
    var frame = 0;
    els.girlImg.src = PANT_CYCLE[0];
    var t0 = performance.now();
    var frameTimer = window.setInterval(function () {
      if (gen !== walkGen) {
        window.clearInterval(frameTimer);
        return;
      }
      if (!here()) return;
      frame = (frame + 1) % PANT_CYCLE.length;
      els.girlImg.src = PANT_CYCLE[frame];
    }, PANT_FRAME_MS);
    function tick(t) {
      if (gen !== walkGen) {
        window.clearInterval(frameTimer);
        return;
      }
      if (drag) {
        window.clearInterval(frameTimer);
        moving = false;
        els.girl.classList.remove("panting");
        return;
      }
      if (t - t0 < PANT_MS) requestAnimationFrame(tick);
      else {
        window.clearInterval(frameTimer);
        if (gen !== walkGen) return;
        moving = false;
        els.girl.classList.remove("panting");
        clearFlip();
        setSticker(starving() ? "lie" : "stand");
        persist();
      }
    }
    requestAnimationFrame(tick);
  }

  function followYou() {
    var token = ++followGen;
    seekGen += 1;
    stopPlead();
    abortWalk();
    els.girl.classList.remove("walking");
    els.girl.classList.remove("running");
    els.girl.classList.remove("panting");
    if (!save || save.life_phase === "dead") return;
    var dest = house.view;
    var movers = house.residents.filter(function (g) {
      return g.place !== dest;
    });
    if (!movers.length) return;
    Life.followSwitch(save);
    lastWanderAt = Date.now();
    lastPoseAt = Date.now();
    var shown = girl();
    eatingUntil = 0;
    if (shown.sticker === "eat" || shown.sticker === "bow" || shown.sticker === "sit") setSticker("stand");
    moving = true;
    sheSays("跟着鞋鞋……");
    persist();
    render(false);
    var door = spotsOf(shown.place).door;
    var dist = door ? Math.hypot(door.x - shown.x, door.y - shown.y) : 28;
    window.setTimeout(function () {
      if (token !== followGen) return;
      if (save.life_phase === "dead") {
        moving = false;
        return;
      }
      dest = house.view;
      movers.forEach(function (g) {
        if (g.place === dest) return;
        putResident(g, dest, "door");
      });
      if (house.view !== dest) {
        followYou();
        return;
      }
      house.residents.forEach(function (g) {
        if (g === shown) return;
        if (g.place !== dest) return;
        putResident(g, dest, "center");
      });
      sheSays("跟着鞋鞋……哈……");
      persist();
      render(true);
      if (shown.place !== dest) {
        moving = false;
        return;
      }
      walkTo(
        "center",
        function () {
          if (token !== followGen) return;
          startPant();
        },
        "run"
      );
    }, walkDuration(dist));
  }

  function putInPlace(placeId, spotId) {
    putResident(girl(), placeId, spotId);
    els.girl.classList.toggle("away", !here());
    if (here()) placeGirl();
    els.where.textContent = whereText();
  }

  function goPlace(dest, leaveLine) {
    var g = girl();
    if (g.place === dest || !placeOf(dest)) return;
    var watching = here();
    function arrive() {
      putInPlace(dest, "door");
      moving = false;
      clearFlip();
      setSticker("stand");
      if (house.view === dest) sheSays(dest === "balcony" ? "阳台风风的。" : "又回来了。");
      persist();
      render(true);
    }
    if (watching && spotsOf(g.place).door) {
      if (leaveLine) setLine(leaveLine);
      walkTo("door", arrive);
    } else {
      if (leaveLine && watching) setLine(leaveLine);
      arrive();
    }
  }

  function act(kind, okLine, denyLine) {
    var events = Life.step(save, now(), kind);
    var denied = events.indexOf("denied") !== -1 || events.indexOf("busy") !== -1;
    if (denied) {
      if (save.life_phase === "dead" && kind !== "revive") setLine("她不动了。");
      else if (kind === "pour" && save.gold < Life.T.FEED_GOLD) setLine("金币不够，买不了粮。");
      else if (kind === "feed" && save.gold < Life.T.FEED_GOLD) setLine("金币不够，买不了粮。");
      else if (kind === "wash" && save.gold < Life.T.WASH_GOLD) setLine("金币不够。");
      else if (kind === "medicine" && save.gold < Life.T.MED_GOLD) setLine("金币不够。");
      else if (kind === "revive" && save.gold < Life.T.REVIVE_GOLD) setLine("金币不够，救不回来。");
      else if (kind === "revive") setLine(denyLine || "现在不用救。");
      else sheSays(denyLine || "等一等喵。");
    } else {
      if (kind === "pour") setLine(okLine);
      else sheSays(okLine);
    }
    persist();
    render(false);
    return !denied;
  }

  function startEat() {
    eatingUntil = Date.now() + 5500;
    setSticker("eat");
    placeBowl();
    persist();
    window.setTimeout(function () {
      if (girl().sticker !== "eat") return;
      eatingUntil = 0;
      clearFlip();
      setSticker("stand");
      persist();
      render(false);
    }, 5500);
  }

  function wantsMeal() {
    return (
      save &&
      save.life_phase === "alive" &&
      house.bowl.food >= 1 &&
      save.vitals.hunger <= MEAL_HUNGER
    );
  }

  function beginMeal() {
    if (!wantsMeal()) return;
    if (girl().place !== house.bowl.place) return;
    if (!act("meal", "啊呜啊呜。好吃好吃！喵！", "等一等喵。")) return;
    house.bowl.food = Math.max(0, house.bowl.food - 1);
    startEat();
  }

  function needsLeaveToEat() {
    return house.view !== house.bowl.place;
  }

  function isPleading() {
    return pleading;
  }

  function stopPlead() {
    pleading = false;
    pleadToken += 1;
    if (bowTimer) {
      window.clearInterval(bowTimer);
      bowTimer = 0;
    }
  }

  function startPleadThenSeek() {
    if (isPleading()) return;
    if (!here()) return;
    stopPlead();
    var token = ++pleadToken;
    abortWalk();
    moving = false;
    pleading = true;
    lastWanderAt = Date.now();
    lastPoseAt = Date.now();
    clearFlip();
    sheSays("人人……饿饿……");
    persist();
    setSticker("bow");
    els.girl.classList.remove("walking");
    els.girl.classList.remove("running");
    var frame = 0;
    els.girlImg.src = BOW_CYCLE[0];
    bowTimer = window.setInterval(function () {
      if (token !== pleadToken || !pleading) {
        window.clearInterval(bowTimer);
        bowTimer = 0;
        return;
      }
      if (!wantsMeal() || !needsLeaveToEat() || !here()) {
        stopPlead();
        moving = false;
        if (wantsMeal() && !needsLeaveToEat()) tryStartMeal();
        else if (girl().sticker === "bow") setSticker(starving() ? "lie" : "stand");
        persist();
        return;
      }
      frame = (frame + 1) % BOW_CYCLE.length;
      els.girlImg.src = BOW_CYCLE[frame];
    }, BOW_FRAME_MS);
  }

  function goToBowl(keepLine) {
    if (isPleading()) return;
    var g = girl();
    if (g.place === house.bowl.place) {
      walkTo("bowl", beginMeal);
      return;
    }
    if (!keepLine) setLine("碗边叮了一下。");
    persist();
    function arriveBowlRoom() {
      if (!wantsMeal()) {
        moving = false;
        clearFlip();
        setSticker(starving() ? "lie" : "stand");
        persist();
        return;
      }
      putInPlace(house.bowl.place, "door");
      if (house.view === house.bowl.place) {
        walkTo("bowl", beginMeal);
      } else {
        var t = mealTarget();
        g.place = house.bowl.place;
        g.spot = "bowl";
        g.x = t.x;
        g.y = t.y;
        beginMeal();
        if (!here()) setLine("那边有吃饭的声音。");
        persist();
        render(false);
      }
    }
    if (here() && spotsOf(g.place).door) {
      walkTo("door", arriveBowlRoom);
      return;
    }
    var token = ++seekGen;
    walkGen += 1;
    moving = true;
    var door = spotsOf(g.place).door;
    var dist = door ? Math.hypot(door.x - g.x, door.y - g.y) : 28;
    window.setTimeout(function () {
      if (token !== seekGen) return;
      arriveBowlRoom();
    }, walkDuration(dist));
  }

  function tryStartMeal() {
    if (pouring || bowlDrag || drag || moving || isPleading() || Date.now() < eatingUntil) return;
    if (!wantsMeal()) return;
    var g = girl();
    if (g.sticker === "eat" || g.sticker === "run" || g.sticker === "pant" || g.sticker === "bow" || g.sticker === "walk") return;
    if (needsLeaveToEat()) {
      if (here()) startPleadThenSeek();
      return;
    }
    if (g.place !== house.bowl.place) {
      goToBowl(false);
      return;
    }
    walkTo("bowl", beginMeal);
  }

  function playPourAnim(then) {
    pouring = true;
    els.bowl.classList.add("pouring");
    els.bowlImg.src = BOWL.pour;
    window.setTimeout(function () {
      pouring = false;
      els.bowl.classList.remove("pouring");
      paintBowl();
      persist();
      render(false);
      if (then) then();
    }, 900);
  }

  function pourBowl() {
    if (pouring || save.life_phase === "dead") {
      if (save.life_phase === "dead") setLine("她不动了。");
      persist();
      render(false);
      return;
    }
    if (!bowlOnView()) return;
    if (house.bowl.food >= House.BOWL_MAX) {
      playPourAnim(function () {
        sheSays("满满的。");
        persist();
        render(false);
        tryStartMeal();
      });
      return;
    }
    if (!act("pour", "哗——粮倒进去了。", "等一等喵。")) return;
    house.bowl.food = House.BOWL_MAX;
    els.bowlN.textContent = String(house.bowl.food);
    persist();
    playPourAnim(function () {
      if (girl().place === house.bowl.place) tryStartMeal();
      else if (wantsMeal()) tryStartMeal();
    });
  }

  function pet() {
    if (save.life_phase === "dead") {
      setLine("她不动了。");
      persist();
      render(false);
      return;
    }
    if (!here()) return;
    var line = starving()
      ? "......"
      : girl().place === "balcony"
        ? "喵，阳台也有摸摸。小铃铛轻轻晃了两下。"
        : "喵，收到摸摸啦。小铃铛轻轻晃了两下。";
    act("pet", line);
    if (isPleading()) sheSays("人人……饿饿……");
  }

  function idleBusy() {
    if (!save || moving || drag || bowlDrag || pouring || isPleading()) return true;
    if (save.life_phase === "dead" || starving() || Date.now() < eatingUntil) return true;
    var kind = girl().sticker;
    return kind === "eat" || kind === "lie" || kind === "pant" || kind === "run" || kind === "bow" || kind === "walk";
  }

  function wander() {
    var g = girl();
    if (idleBusy()) return;
    if (g.place !== house.view) return;
    if (wantsMeal()) return;
    if (Date.now() - lastWanderAt < WANDER_MS) return;
    var dest = House.randomIdlePoint(g.place);
    if (Math.hypot(dest.x - g.x, dest.y - g.y) < 5) dest = House.randomIdlePoint(g.place);
    lastWanderAt = Date.now();
    walkTo(dest, function () {
      clearFlip();
      setSticker("stand");
      g.spot = g.place === "living" ? "rug" : "center";
      if (here()) {
        if (g.place === "living") sheSays("地毯软软的。");
        else if (g.place === "balcony") sheSays("砖砖凉凉的。");
        else sheSays("软软地走。");
      }
      persist();
    });
  }

  function poseShift() {
    if (idleBusy()) return;
    if (girl().place !== house.view) return;
    if (wantsMeal()) return;
    if (Date.now() - lastPoseAt < POSE_MS) return;
    lastPoseAt = Date.now();
    clearFlip();
    setSticker(girl().sticker === "sit" ? "stand" : "sit");
    persist();
  }

  function askSit() {
    if (!save || save.life_phase === "dead") {
      setLine("她不动了。");
      persist();
      return;
    }
    if (!here()) {
      setLine("她听不见。");
      persist();
      return;
    }
    if (starving() || girl().sticker === "lie") {
      sheSays("......");
      persist();
      return;
    }
    if (isPleading() || girl().sticker === "bow") {
      sheSays("人人……饿饿……");
      persist();
      return;
    }
    if (girl().sticker === "eat" || Date.now() < eatingUntil) {
      sheSays("还在吃。");
      persist();
      return;
    }
    if (girl().sticker === "run" || girl().sticker === "pant") {
      sheSays("哈……还在喘。");
      persist();
      return;
    }
    if (girl().sticker === "sit") {
      sheSays("已经坐着了喵。");
      persist();
      return;
    }
    abortWalk();
    moving = false;
    lastPoseAt = Date.now();
    lastWanderAt = Date.now();
    clearFlip();
    setSticker("sit");
    sheSays("坐下……喵。");
    persist();
    render(false);
  }

  function askStand() {
    if (!save || save.life_phase === "dead") {
      setLine("她不动了。");
      persist();
      return;
    }
    if (!here()) {
      setLine("她听不见。");
      persist();
      return;
    }
    if (starving() || girl().sticker === "lie") {
      sheSays("......");
      persist();
      return;
    }
    if (isPleading() || girl().sticker === "bow") {
      sheSays("人人……饿饿……");
      persist();
      return;
    }
    if (girl().sticker === "eat" || Date.now() < eatingUntil) {
      sheSays("还在吃。");
      persist();
      return;
    }
    if (girl().sticker === "run" || girl().sticker === "pant") {
      sheSays("哈……还在喘。");
      persist();
      return;
    }
    if (girl().sticker === "stand") {
      sheSays("已经站着了喵。");
      persist();
      return;
    }
    abortWalk();
    moving = false;
    lastPoseAt = Date.now();
    lastWanderAt = Date.now();
    clearFlip();
    setSticker("stand");
    sheSays("起来了喵。");
    persist();
    render(false);
  }

  function onPointerDown(ev) {
    if (save.life_phase === "dead" || !here()) return;
    ev.preventDefault();
    abortWalk();
    els.girl.setPointerCapture(ev.pointerId);
    var rect = els.scene.getBoundingClientRect();
    var g = girl();
    drag = {
      id: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      moved: false,
      ox: ((ev.clientX - rect.left) / rect.width) * 100 - g.x,
      oy: ((ev.clientY - rect.top) / rect.height) * 100 - g.y,
    };
    els.girl.classList.add("dragging");
  }

  function onPointerMove(ev) {
    if (!drag || ev.pointerId !== drag.id || !here()) return;
    var dx = ev.clientX - drag.startX;
    var dy = ev.clientY - drag.startY;
    if (dx * dx + dy * dy > 64) drag.moved = true;
    if (!drag.moved) return;
    var rect = els.scene.getBoundingClientRect();
    var g = girl();
    var nx = Math.max(8, Math.min(92, ((ev.clientX - rect.left) / rect.width) * 100 - drag.ox));
    var ny = Math.max(18, Math.min(94, ((ev.clientY - rect.top) / rect.height) * 100 - drag.oy));
    if (Math.abs(nx - g.x) > 0.4) {
      els.girlImg.style.transform = nx > g.x ? "scaleX(-1)" : "scaleX(1)";
    }
    if (!starving()) {
      if (!drag.stepping) {
        drag.stepping = true;
        els.girl.classList.add("walking");
        g.sticker = "walk";
        drag.frame = 0;
        els.girlImg.src = WALK_CYCLE[0];
      } else if (!drag.lastStep || ev.timeStamp - drag.lastStep > STEP_MS) {
        drag.frame = ((drag.frame || 0) + 1) % WALK_CYCLE.length;
        els.girlImg.src = WALK_CYCLE[drag.frame];
        drag.lastStep = ev.timeStamp;
      }
    }
    g.x = nx;
    g.y = ny;
    placeGirl();
  }

  function onPointerUp(ev) {
    if (!drag || ev.pointerId !== drag.id) return;
    els.girl.classList.remove("dragging");
    var wasDrag = drag.moved;
    drag = null;
    if (!wasDrag) {
      els.girl.classList.remove("walking");
      els.girl.classList.remove("running");
      if (girl().sticker === "walk" || girl().sticker === "run" || girl().sticker === "pant") {
        els.girl.classList.remove("panting");
        setSticker(starving() ? "lie" : "stand");
      }
      pet();
      return;
    }
    var g = girl();
    g.spot = nearestSpot(g.x, g.y);
    els.girl.classList.remove("walking");
    moving = false;
    clearFlip();
    if (starving()) setSticker("lie");
    else setSticker("stand");
    persist();
    tryStartMeal();
  }

  document.getElementById("btn-sit").addEventListener("click", askSit);
  document.getElementById("btn-stand").addEventListener("click", askStand);
  document.getElementById("btn-wash").addEventListener("click", function () {
    act("wash", "项圈……不摘喵。", "等一等喵。");
  });
  document.getElementById("btn-med").addEventListener("click", function () {
    act("medicine", "苦苦的……但人让吃。", "等一等喵。");
  });
  document.getElementById("btn-revive").addEventListener("click", function () {
    if (act("revive", "又睁开眼了。", "现在不用救。")) {
      house.view = "living";
      putInPlace("living", "rug");
      applyView();
      els.girl.classList.remove("dead");
      walkTo("rug", function () {
        clearFlip();
        setSticker("stand");
      });
    }
  });

  document.getElementById("btn-export").addEventListener("click", function () {
    persist();
    var blob = new Blob([localStorage.getItem(KEY(slot)) || "{}"], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "xiaoweiqu-save-" + (slot + 1) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("btn-import").addEventListener("click", function () {
    els.file.click();
  });
  els.file.addEventListener("change", function () {
    var file = els.file.files && els.file.files[0];
    els.file.value = "";
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result || ""));
        save = Life.fromDict(data);
        house = House.fromSave(data);
        save.flags.daily_life = 1;
        save.gold = Life.T.START_GOLD;
        lastWanderAt = Date.now();
        lastPoseAt = Date.now();
        Life.advanceTo(save, now());
        applyView();
        ensureSpeakerLine();
        persist();
        render(true);
        setLine("档案读进来了。");
      } catch (e) {
        setLine("这份档案读不了。");
      }
      persist();
      render(false);
    };
    reader.readAsText(file, "utf-8");
  });

  function onBowlDown(ev) {
    if (!bowlOnView() || pouring) return;
    ev.preventDefault();
    ev.stopPropagation();
    els.bowl.setPointerCapture(ev.pointerId);
    var rect = els.scene.getBoundingClientRect();
    bowlDrag = {
      id: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      moved: false,
      ox: ((ev.clientX - rect.left) / rect.width) * 100 - house.bowl.x,
      oy: ((ev.clientY - rect.top) / rect.height) * 100 - house.bowl.y,
    };
    els.bowl.classList.add("dragging");
  }

  function onBowlMove(ev) {
    if (!bowlDrag || ev.pointerId !== bowlDrag.id) return;
    var dx = ev.clientX - bowlDrag.startX;
    var dy = ev.clientY - bowlDrag.startY;
    if (dx * dx + dy * dy > 64) bowlDrag.moved = true;
    if (!bowlDrag.moved) return;
    var rect = els.scene.getBoundingClientRect();
    house.bowl.place = house.view;
    house.bowl.x = Math.max(8, Math.min(92, ((ev.clientX - rect.left) / rect.width) * 100 - bowlDrag.ox));
    house.bowl.y = Math.max(18, Math.min(94, ((ev.clientY - rect.top) / rect.height) * 100 - bowlDrag.oy));
    placeBowl();
  }

  function onBowlUp(ev) {
    if (!bowlDrag || ev.pointerId !== bowlDrag.id) return;
    els.bowl.classList.remove("dragging");
    var wasDrag = bowlDrag.moved;
    bowlDrag = null;
    if (!wasDrag) {
      pourBowl();
      return;
    }
    persist();
    render(false);
  }

  els.bowl.addEventListener("pointerdown", onBowlDown);
  els.bowl.addEventListener("pointermove", onBowlMove);
  els.bowl.addEventListener("pointerup", onBowlUp);
  els.bowl.addEventListener("pointercancel", onBowlUp);
  els.gate.addEventListener("click", function (ev) {
    ev.stopPropagation();
    var p = placeOf(house.view);
    if (p && p.gate) setView(p.gate.to);
  });
  els.girl.addEventListener("pointerdown", onPointerDown);
  els.girl.addEventListener("pointermove", onPointerMove);
  els.girl.addEventListener("pointerup", onPointerUp);
  els.girl.addEventListener("pointercancel", onPointerUp);

  function openSettings() {
    render(false);
    els.settings.hidden = false;
  }

  function closeSettings() {
    els.settings.hidden = true;
  }

  els.gear.addEventListener("click", function () {
    openSettings();
  });
  els.settingsClose.addEventListener("click", function () {
    closeSettings();
  });
  els.settingsDim.addEventListener("click", function () {
    closeSettings();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !els.settings.hidden) closeSettings();
  });

  (function () {
    var card = document.getElementById("her-card");
    var key = "xiaoweiqu-her-open";
    if (!card) return;
    if (localStorage.getItem(key) === "0") card.open = false;
    card.addEventListener("toggle", function () {
      localStorage.setItem(key, card.open ? "1" : "0");
    });
  })();

  window.setInterval(function () {
    Life.advanceTo(save, now());
    persist();
    render(false);
    tryStartMeal();
    wander();
    poseShift();
  }, 1000);
  window.setInterval(function () {
    if (!starving() || moving || drag || girl().sticker !== "lie") return;
    glanceOpen = true;
    els.girlImg.src = STICKERS.lieGlance;
    window.setTimeout(function () {
      glanceOpen = false;
      if (girl().sticker === "lie") els.girlImg.src = STICKERS.lieClosed;
    }, 850);
  }, 6400);

  buildNav();
  loadSlot(0);
})();
