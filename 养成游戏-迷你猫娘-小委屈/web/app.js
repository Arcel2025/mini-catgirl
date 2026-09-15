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

  var els = {
    hunger: document.getElementById("hunger"),
    clean: document.getElementById("clean"),
    mood: document.getElementById("mood"),
    health: document.getElementById("health"),
    hungerN: document.getElementById("hungerN"),
    cleanN: document.getElementById("cleanN"),
    moodN: document.getElementById("moodN"),
    healthN: document.getElementById("healthN"),
    gold: document.getElementById("gold"),
    where: document.getElementById("where"),
    stage: document.getElementById("stage"),
    scene: document.getElementById("scene"),
    bg: document.getElementById("bg"),
    girl: document.getElementById("girl"),
    girlImg: document.querySelector("#girl img"),
    bowl: document.getElementById("bowl"),
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

  var STICKERS = {
    stand: "assets/stand.png",
    eat: "assets/eat.png",
    walkA: "assets/walk-a.png",
    walkB: "assets/walk-b.png",
  };
  Object.keys(STICKERS).forEach(function (k) {
    var img = new Image();
    img.src = STICKERS[k];
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

  function setSticker(kind) {
    var g = girl();
    g.sticker = kind;
    if (kind === "walk") return;
    els.girlImg.src = STICKERS[kind] || STICKERS.stand;
    els.girl.classList.toggle("eating", kind === "eat");
    els.bowl.classList.toggle("away", kind === "eat" && house.view === "living");
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
      els.bg.style.opacity = "1";
    }
    els.stage.dataset.place = p.id;
    els.bg.alt = p.name;
    if (p.hasBowl) {
      els.bowl.hidden = false;
      els.bowl.style.left = p.bowl.x + "%";
      els.bowl.style.top = p.bowl.y + "%";
    } else {
      els.bowl.hidden = true;
    }
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
    house.view = id;
    applyView();
    if (!here()) setLine(girl().name + "在" + placeOf(girl().place).name + "。");
    persist();
    render(true);
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
    var g = girl();
    if (g.sticker === "walk" || g.sticker === "eat") g.sticker = "stand";
    moving = false;
    eatingUntil = 0;
    applyView();
    setSticker(g.sticker);
    Life.advanceTo(save, now());
    persist();
    render(true);
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

  function whereText() {
    var g = girl();
    var p = placeOf(g.place);
    return g.name + "在" + (p ? p.name : g.place);
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

  function render(place) {
    var v = save.vitals;
    els.hunger.style.width = pct(v.hunger) + "%";
    els.clean.style.width = pct(v.cleanliness) + "%";
    els.mood.style.width = pct(v.mood) + "%";
    els.health.style.width = pct(v.health) + "%";
    els.hungerN.textContent = pct(v.hunger);
    els.cleanN.textContent = pct(v.cleanliness);
    els.moodN.textContent = pct(v.mood);
    els.healthN.textContent = pct(v.health);
    els.gold.textContent = save.gold + " 金";
    els.where.textContent = whereText();
    els.line.textContent = house.line;
    els.bowl.classList.toggle("has-food", !!house.bowlHasFood);
    els.bowl.classList.toggle("away", girl().sticker === "eat" && house.view === "living");
    els.girl.classList.toggle("dead", save.life_phase === "dead");
    els.girl.classList.toggle("eating", girl().sticker === "eat");
    els.girl.classList.toggle("away", !here());
    document.querySelectorAll("[data-slot]").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.getAttribute("data-slot")) === slot);
    });
    if (place) placeGirl();
    placePins();
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

  function walkTo(spotId, done) {
    var g = girl();
    var target = spotsOf(g.place)[spotId];
    if (!target) {
      if (done) done();
      return;
    }
    var sx = g.x;
    var sy = g.y;
    var dist = Math.hypot(target.x - sx, target.y - sy);
    if (dist < 1.4) {
      g.spot = spotId;
      g.x = target.x;
      g.y = target.y;
      if (here()) placeGirl();
      if (done) done();
      return;
    }
    moving = true;
    g.sticker = "walk";
    if (here()) {
      els.girl.classList.add("walking");
      els.girl.classList.remove("eating");
      els.girlImg.style.transform = target.x > sx + 0.8 ? "scaleX(-1)" : "scaleX(1)";
      els.girlImg.src = STICKERS.walkA;
    }
    var frame = 0;
    var lastFrame = performance.now();
    var t0 = lastFrame;
    var dur = Math.max(1100, Math.min(2600, dist * 34));
    function tick(t) {
      if (here() && t - lastFrame > 150) {
        frame ^= 1;
        els.girlImg.src = frame ? STICKERS.walkB : STICKERS.walkA;
        lastFrame = t;
      }
      var p = Math.min(1, (t - t0) / dur);
      var e = p * (2 - p);
      g.x = sx + (target.x - sx) * e;
      g.y = sy + (target.y - sy) * e;
      if (here()) placeGirl();
      if (p < 1) requestAnimationFrame(tick);
      else {
        g.spot = spotId;
        g.x = target.x;
        g.y = target.y;
        moving = false;
        els.girl.classList.remove("walking");
        persist();
        if (done) done();
        else {
          clearFlip();
          setSticker("stand");
        }
      }
    }
    requestAnimationFrame(tick);
  }

  function putInPlace(placeId, spotId) {
    var g = girl();
    var p = placeOf(placeId);
    var spot = (p && p.spots[spotId]) || p.spots.door || p.spots.rug;
    g.place = placeId;
    g.spot = spotId || "door";
    g.x = spot.x;
    g.y = spot.y;
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
      if (house.view === dest) setLine(dest === "balcony" ? "阳台风风的。" : "又回来了。");
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
      else if (kind === "feed" && save.gold < Life.T.FEED_GOLD) setLine("金币不够，买不了粮。");
      else if (kind === "wash" && save.gold < Life.T.WASH_GOLD) setLine("金币不够。");
      else if (kind === "medicine" && save.gold < Life.T.MED_GOLD) setLine("金币不够。");
      else if (kind === "revive" && save.gold < Life.T.REVIVE_GOLD) setLine("金币不够，救不回来。");
      else setLine(denyLine || "等一等喵。");
    } else {
      setLine(okLine);
    }
    persist();
    render(false);
    return !denied;
  }

  function startEat() {
    eatingUntil = Date.now() + 5500;
    setSticker("eat");
    persist();
    window.setTimeout(function () {
      if (girl().sticker !== "eat") return;
      house.bowlHasFood = false;
      eatingUntil = 0;
      clearFlip();
      setSticker("stand");
      persist();
      render(false);
    }, 5500);
  }

  function feed() {
    if (moving || save.life_phase === "dead") {
      if (save.life_phase === "dead") setLine("她不动了。");
      persist();
      render(false);
      return;
    }
    if (house.view !== "living") return;
    if (!act("feed", "啊呜啊呜。好吃好吃！喵！铃铛响了一下。", "等一等喵。")) return;
    house.bowlHasFood = true;
    els.bowl.classList.add("has-food");
    var g = girl();
    if (g.place === "living") {
      walkTo("bowl", startEat);
      return;
    }
    setLine("碗边叮了一下。阳台那边铃铛响。");
    persist();
    function arriveLiving() {
      putInPlace("living", "door");
      if (house.view === "living") {
        setLine("啊呜啊呜。好吃好吃！喵！铃铛响了一下。");
        walkTo("bowl", startEat);
      } else {
        putInPlace("living", "bowl");
        startEat();
        setLine("客厅有吃饭的声音。");
        persist();
        render(false);
      }
    }
    if (here() && spotsOf(g.place).door) walkTo("door", arriveLiving);
    else arriveLiving();
  }

  function pet() {
    if (save.life_phase === "dead") {
      setLine("她不动了。");
      persist();
      render(false);
      return;
    }
    if (!here()) return;
    var line =
      girl().place === "balcony"
        ? "喵，阳台也有摸摸。小铃铛轻轻晃了两下。"
        : "喵，收到摸摸啦。小铃铛轻轻晃了两下。";
    act("pet", line);
  }

  function wander() {
    var g = girl();
    if (moving || drag || save.life_phase === "dead" || Date.now() < eatingUntil || g.sticker === "eat") return;
    if (Math.random() < 0.28) {
      var dest = House.otherPlace(g.place);
      var watching = here();
      var leave = g.place === "living" ? "往阳台去了。" : "钻回屋里了。";
      goPlace(dest, watching ? leave : null);
      return;
    }
    var ids = Object.keys(spotsOf(g.place));
    var pick = ids[Math.floor(Math.random() * ids.length)];
    if (pick === g.spot) return;
    walkTo(pick, function () {
      clearFlip();
      setSticker("stand");
      if (!here()) {
        persist();
        return;
      }
      if (g.place === "balcony") {
        if (pick === "pot") setLine("花花盆……好大。");
        else if (pick === "corner") setLine("角落凉凉的。");
        else setLine("屋里亮亮的。");
      } else if (pick === "sofa") setLine("茶几底下……先不钻。");
      else if (pick === "window") setLine("窗外亮亮的。");
      else if (pick === "door") setLine("阳台那边……风风的。");
      else setLine("软软地走。");
      persist();
    });
  }

  function onPointerDown(ev) {
    if (save.life_phase === "dead" || !here()) return;
    ev.preventDefault();
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
    if (!drag.stepping) {
      drag.stepping = true;
      els.girl.classList.add("walking");
      g.sticker = "walk";
      drag.frame = 0;
      els.girlImg.src = STICKERS.walkA;
    } else if (!drag.lastStep || ev.timeStamp - drag.lastStep > 150) {
      drag.frame ^= 1;
      els.girlImg.src = drag.frame ? STICKERS.walkB : STICKERS.walkA;
      drag.lastStep = ev.timeStamp;
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
      pet();
      return;
    }
    var g = girl();
    var id = nearestSpot(g.x, g.y);
    walkTo(id, function () {
      clearFlip();
      setSticker("stand");
      if (!here()) {
        persist();
        return;
      }
      if (g.place === "balcony") {
        if (id === "pot") setLine("盆盆旁边。");
        else if (id === "corner") setLine("当时放箱子的地方。");
        else setLine("门口亮亮的。");
      } else if (id === "bowl") setLine("饭饭……？");
      else if (id === "sofa") setLine("沙发好高。");
      else if (id === "window") setLine("亮亮的。");
      else if (id === "door") setLine("去阳台……？");
      else setLine("地毯软软。");
      persist();
    });
  }

  document.querySelectorAll("[data-slot]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      loadSlot(Number(btn.getAttribute("data-slot")));
    });
  });

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
        Life.advanceTo(save, now());
        applyView();
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

  els.bowl.addEventListener("click", function (ev) {
    ev.stopPropagation();
    feed();
  });
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
  }, 1000);
  window.setInterval(wander, 11000);

  buildNav();
  loadSlot(0);
})();
