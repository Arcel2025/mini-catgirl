(function () {
  var SPOTS = {
    rug: { x: 55, y: 82 },
    bowl: { x: 54, y: 72 },
    window: { x: 80, y: 64 },
    sofa: { x: 18, y: 74 },
  };
  var BOWL_PROP = { x: 43, y: 67 };
  var SPOT_IDS = Object.keys(SPOTS);
  var KEY = function (n) {
    return "xiaoweiqu-save-" + n;
  };

  var slot = 0;
  var save = null;
  var room = null;
  var moving = false;
  var eatingUntil = 0;
  var drag = null;
  var moreOpen = false;

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
    stage: document.getElementById("stage"),
    girl: document.getElementById("girl"),
    girlImg: document.querySelector("#girl img"),
    bowl: document.getElementById("bowl"),
    line: document.getElementById("line"),
    more: document.getElementById("more"),
    file: document.getElementById("file"),
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

  function clearFlip() {
    els.girlImg.style.transform = "";
  }

  function setSticker(kind) {
    room.sticker = kind;
    if (kind === "walk") return;
    els.girlImg.src = STICKERS[kind] || STICKERS.stand;
    els.girl.classList.toggle("eating", kind === "eat");
    els.bowl.classList.toggle("away", kind === "eat");
  }

  function now() {
    return Date.now() / 1000;
  }

  function defaultRoom() {
    return {
      spot: "rug",
      sticker: "stand",
      line: "鞋鞋……饭饭？",
      x: SPOTS.rug.x,
      y: SPOTS.rug.y,
      bowlHasFood: false,
    };
  }

  function persist() {
    var data = Life.toDict(save);
    data.room = {
      spot: room.spot,
      sticker: room.sticker,
      line: room.line,
      x: room.x,
      y: room.y,
      bowlHasFood: room.bowlHasFood,
    };
    localStorage.setItem(KEY(slot), JSON.stringify(data));
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
      room = defaultRoom();
    } else {
      save = Life.fromDict(data);
      room = Object.assign(defaultRoom(), data.room || {});
      if (SPOTS[room.spot]) {
        room.x = SPOTS[room.spot].x;
        room.y = SPOTS[room.spot].y;
      }
    }
    save.flags.daily_life = 1;
    if (room.sticker === "walk" || room.sticker === "eat") room.sticker = "stand";
    els.bowl.style.left = BOWL_PROP.x + "%";
    els.bowl.style.top = BOWL_PROP.y + "%";
    setSticker(room.sticker);
    Life.advanceTo(save, now());
    persist();
    render(true);
  }

  function pct(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function placeGirl() {
    els.girl.style.left = room.x + "%";
    els.girl.style.top = room.y + "%";
  }

  function setLine(text) {
    room.line = text;
    els.line.textContent = text;
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
    els.line.textContent = room.line;
    els.bowl.classList.toggle("has-food", !!room.bowlHasFood);
    els.bowl.classList.toggle("away", room.sticker === "eat");
    els.girl.classList.toggle("dead", save.life_phase === "dead");
    els.girl.classList.toggle("eating", room.sticker === "eat");
    document.querySelectorAll("[data-slot]").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.getAttribute("data-slot")) === slot);
    });
    if (place) placeGirl();
  }

  function nearestSpot(x, y) {
    var best = "rug";
    var bestD = Infinity;
    SPOT_IDS.forEach(function (id) {
      var s = SPOTS[id];
      var d = (s.x - x) * (s.x - x) + (s.y - y) * (s.y - y);
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    });
    return best;
  }

  function walkTo(spotId, done) {
    var target = SPOTS[spotId];
    if (!target) {
      if (done) done();
      return;
    }
    var sx = room.x;
    var sy = room.y;
    var dist = Math.hypot(target.x - sx, target.y - sy);
    if (dist < 1.4) {
      room.spot = spotId;
      room.x = target.x;
      room.y = target.y;
      placeGirl();
      if (done) done();
      return;
    }
    moving = true;
    els.girl.classList.add("walking");
    els.girl.classList.remove("eating");
    room.sticker = "walk";
    els.girlImg.style.transform = target.x > sx + 0.8 ? "scaleX(-1)" : "scaleX(1)";
    els.girlImg.src = STICKERS.walkA;
    var frame = 0;
    var lastFrame = performance.now();
    var t0 = lastFrame;
    var dur = Math.max(1100, Math.min(2600, dist * 34));
    function tick(t) {
      if (t - lastFrame > 150) {
        frame ^= 1;
        els.girlImg.src = frame ? STICKERS.walkB : STICKERS.walkA;
        lastFrame = t;
      }
      var p = Math.min(1, (t - t0) / dur);
      var e = p * (2 - p);
      room.x = sx + (target.x - sx) * e;
      room.y = sy + (target.y - sy) * e;
      placeGirl();
      if (p < 1) requestAnimationFrame(tick);
      else {
        room.spot = spotId;
        room.x = target.x;
        room.y = target.y;
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

  function feed() {
    if (moving || save.life_phase === "dead") {
      if (save.life_phase === "dead") setLine("她不动了。");
      persist();
      render(false);
      return;
    }
    if (!act("feed", "啊呜啊呜。好吃好吃！喵！铃铛响了一下。", "等一等喵。")) return;
    room.bowlHasFood = true;
    els.bowl.classList.add("has-food");
    walkTo("bowl", function () {
      eatingUntil = Date.now() + 5500;
      setSticker("eat");
      persist();
      window.setTimeout(function () {
        if (room.sticker !== "eat") return;
        room.bowlHasFood = false;
        eatingUntil = 0;
        clearFlip();
        setSticker("stand");
        persist();
        render(false);
      }, 5500);
    });
  }

  function pet() {
    if (save.life_phase === "dead") {
      setLine("她不动了。");
      persist();
      render(false);
      return;
    }
    act("pet", "喵，收到摸摸啦。小铃铛轻轻晃了两下。");
  }

  function wander() {
    if (moving || drag || save.life_phase === "dead" || Date.now() < eatingUntil || room.sticker === "eat") return;
    var pick = SPOT_IDS[Math.floor(Math.random() * SPOT_IDS.length)];
    if (pick === room.spot) return;
    walkTo(pick, function () {
      clearFlip();
      setSticker("stand");
      if (pick === "sofa") setLine("茶几底下……先不钻。");
      else if (pick === "window") setLine("窗外亮亮的。");
      else setLine("软软地走。");
      persist();
    });
  }

  function onPointerDown(ev) {
    if (save.life_phase === "dead") return;
    ev.preventDefault();
    els.girl.setPointerCapture(ev.pointerId);
    var rect = els.stage.getBoundingClientRect();
    drag = {
      id: ev.pointerId,
      startX: ev.clientX,
      startY: ev.clientY,
      moved: false,
      ox: ((ev.clientX - rect.left) / rect.width) * 100 - room.x,
      oy: ((ev.clientY - rect.top) / rect.height) * 100 - room.y,
    };
    els.girl.classList.add("dragging");
  }

  function onPointerMove(ev) {
    if (!drag || ev.pointerId !== drag.id) return;
    var dx = ev.clientX - drag.startX;
    var dy = ev.clientY - drag.startY;
    if (dx * dx + dy * dy > 64) drag.moved = true;
    if (!drag.moved) return;
    var rect = els.stage.getBoundingClientRect();
    var nx = Math.max(8, Math.min(92, ((ev.clientX - rect.left) / rect.width) * 100 - drag.ox));
    var ny = Math.max(18, Math.min(94, ((ev.clientY - rect.top) / rect.height) * 100 - drag.oy));
    if (Math.abs(nx - room.x) > 0.4) {
      els.girlImg.style.transform = nx > room.x ? "scaleX(-1)" : "scaleX(1)";
    }
    if (!drag.stepping) {
      drag.stepping = true;
      els.girl.classList.add("walking");
      room.sticker = "walk";
      drag.frame = 0;
      els.girlImg.src = STICKERS.walkA;
    } else if (!drag.lastStep || ev.timeStamp - drag.lastStep > 150) {
      drag.frame ^= 1;
      els.girlImg.src = drag.frame ? STICKERS.walkB : STICKERS.walkA;
      drag.lastStep = ev.timeStamp;
    }
    room.x = nx;
    room.y = ny;
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
    var id = nearestSpot(room.x, room.y);
    walkTo(id, function () {
      clearFlip();
      setSticker("stand");
      if (id === "bowl") setLine("饭饭……？");
      else if (id === "sofa") setLine("沙发好高。");
      else if (id === "window") setLine("亮亮的。");
      else setLine("地毯软软。");
      persist();
    });
  }

  document.querySelectorAll("[data-slot]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      loadSlot(Number(btn.getAttribute("data-slot")));
    });
  });

  document.getElementById("btn-more").addEventListener("click", function () {
    moreOpen = !moreOpen;
    els.more.classList.toggle("open", moreOpen);
  });

  document.getElementById("btn-wash").addEventListener("click", function () {
    act("wash", "项圈……不摘喵。", "等一等喵。");
  });
  document.getElementById("btn-med").addEventListener("click", function () {
    act("medicine", "苦苦的……但人让吃。", "等一等喵。");
  });
  document.getElementById("btn-revive").addEventListener("click", function () {
      if (act("revive", "又睁开眼了。", "现在不用救。")) {
      room.sticker = "stand";
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
        room = Object.assign(defaultRoom(), data.room || {});
        save.flags.daily_life = 1;
        Life.advanceTo(save, now());
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
  els.girl.addEventListener("pointerdown", onPointerDown);
  els.girl.addEventListener("pointermove", onPointerMove);
  els.girl.addEventListener("pointerup", onPointerUp);
  els.girl.addEventListener("pointercancel", onPointerUp);

  window.setInterval(function () {
    Life.advanceTo(save, now());
    persist();
    render(false);
  }, 1000);
  window.setInterval(wander, 11000);

  loadSlot(0);
})();
