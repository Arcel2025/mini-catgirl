/* 房子：场地表 + 住客表。测试只放小委屈。档里最多二十只，场上只渲染当前房间。 */
(function (global) {
  var MAX_RESIDENTS = 20;

  var BOWL_MAX = 10;

  var PLACES = {
    living: {
      id: "living",
      name: "客厅",
      bg: "assets/living.png",
      ar: "16 / 9",
      arNum: 16 / 9,
      hasBowl: true,
      bowl: { x: 43, y: 67 },
      girlW: "9%",
      girlEatW: "9%",
      girlLieW: "16%",
      map: { x: 54, y: 40 },
      spots: {
        center: { x: 54, y: 78 },
        rug: { x: 55, y: 82 },
        bowl: { x: 54, y: 72 },
        window: { x: 80, y: 64 },
        sofa: { x: 18, y: 74 },
        door: { x: 92, y: 84 },
      },
      carpet: { x0: 36, y0: 67, x1: 67, y1: 84 },
      table: { x0: 39, y0: 60, x1: 54, y1: 71 },
    },
    balcony: {
      id: "balcony",
      name: "阳台",
      bg: "assets/balcony.png?v=plan1",
      ar: "16 / 9",
      arNum: 16 / 9,
      hasBowl: false,
      girlW: "9%",
      girlEatW: "9%",
      girlLieW: "16%",
      map: { x: 52, y: 76 },
      spots: {
        center: { x: 50, y: 50 },
        pot: { x: 72, y: 58 },
        corner: { x: 32, y: 58 },
        door: { x: 50, y: 62 },
      },
      floor: { x0: 30, y0: 48, x1: 80, y1: 74 },
      gate: { x: 8, y: 78, w: 84, h: 22, to: "living", label: "回客厅" },
    },
  };

  var NAV = [
    { id: "living", name: "客厅" },
    { id: "balcony", name: "阳台" },
  ];

  function defaultResident() {
    var s = PLACES.living.spots.rug;
    return {
      id: "xiaoweiqu",
      name: "小委屈",
      place: "living",
      spot: "rug",
      sticker: "stand",
      x: s.x,
      y: s.y,
    };
  }

  function defaultBowl() {
    return { place: "living", x: 43, y: 67, food: 0 };
  }

  function clampBowl(raw, hadFood) {
    var b = defaultBowl();
    if (raw && typeof raw === "object") {
      if (PLACES[raw.place]) b.place = raw.place;
      if (raw.x != null) b.x = Math.max(8, Math.min(92, Number(raw.x)));
      if (raw.y != null) b.y = Math.max(18, Math.min(94, Number(raw.y)));
      if (raw.food != null) b.food = Math.max(0, Math.min(BOWL_MAX, Math.round(Number(raw.food))));
      else if (hadFood) b.food = BOWL_MAX;
    } else if (hadFood) {
      b.food = BOWL_MAX;
    }
    if (isNaN(b.x)) b.x = 43;
    if (isNaN(b.y)) b.y = 67;
    if (isNaN(b.food)) b.food = 0;
    return b;
  }

  function defaultHouse() {
    return {
      view: "living",
      line: "小委屈：鞋鞋……饭饭？",
      bowl: defaultBowl(),
      residents: [defaultResident()],
    };
  }

  function clampResident(raw) {
    var g = defaultResident();
    if (!raw || typeof raw !== "object") return g;
    if (raw.id) g.id = String(raw.id);
    if (raw.name) g.name = String(raw.name);
    if (PLACES[raw.place]) g.place = raw.place;
    var spots = PLACES[g.place].spots;
    if (spots[raw.spot]) g.spot = raw.spot;
    g.sticker =
      raw.sticker === "eat" || raw.sticker === "walk" || raw.sticker === "run" || raw.sticker === "pant" || raw.sticker === "bow"
        ? "stand"
        : String(raw.sticker || "stand");
    if (g.sticker !== "stand" && g.sticker !== "sit" && g.sticker !== "lie") g.sticker = "stand";
    var fallback = spots[g.spot] || spots.rug || spots.door;
    g.x = Number(raw.x != null ? raw.x : fallback.x);
    g.y = Number(raw.y != null ? raw.y : fallback.y);
    return g;
  }

  function fromSave(data) {
    var house = defaultHouse();
    if (!data) return house;
    if (data.house && typeof data.house === "object") {
      var h = data.house;
      if (PLACES[h.view]) house.view = h.view;
      if (h.line) house.line = String(h.line);
      house.bowl = clampBowl(h.bowl, h.bowlHasFood);
      var list = Array.isArray(h.residents) ? h.residents : [];
      house.residents = list.slice(0, MAX_RESIDENTS).map(clampResident);
      if (!house.residents.length) house.residents = [defaultResident()];
      return house;
    }
    var room = data.room || {};
    if (room.line) house.line = String(room.line);
    house.bowl = clampBowl(room.bowl, room.bowlHasFood);
    var g = house.residents[0];
    var spots = PLACES.living.spots;
    if (spots[room.spot]) g.spot = room.spot;
    g.sticker = "stand";
    if (room.x != null) g.x = Number(room.x);
    if (room.y != null) g.y = Number(room.y);
    return house;
  }

  function toSave(house) {
    return {
      view: house.view,
      line: house.line,
      bowl: {
        place: house.bowl.place,
        x: house.bowl.x,
        y: house.bowl.y,
        food: house.bowl.food,
      },
      bowlHasFood: house.bowl.food > 0,
      residents: house.residents.map(function (g) {
        return {
          id: g.id,
          name: g.name,
          place: g.place,
          spot: g.spot,
          sticker: g.sticker === "walk" || g.sticker === "eat" || g.sticker === "run" || g.sticker === "pant" || g.sticker === "bow" ? "stand" : g.sticker,
          x: g.x,
          y: g.y,
        };
      }),
    };
  }

  function inRect(r, x, y) {
    return !!r && x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
  }

  function onLivingCarpet(x, y) {
    var p = PLACES.living;
    if (!inRect(p.carpet, x, y)) return false;
    if (inRect(p.table, x, y)) return false;
    return true;
  }

  function randomCarpetPoint() {
    var c = PLACES.living.carpet;
    var x = PLACES.living.spots.center.x;
    var y = PLACES.living.spots.center.y;
    var i;
    for (i = 0; i < 30; i++) {
      x = c.x0 + Math.random() * (c.x1 - c.x0);
      y = c.y0 + Math.random() * (c.y1 - c.y0);
      if (onLivingCarpet(x, y)) return { x: x, y: y };
    }
    return { x: x, y: y };
  }

  function onPlaceFloor(placeId, x, y) {
    if (placeId === "living") return onLivingCarpet(x, y);
    var p = PLACES[placeId];
    if (!p || !p.floor) return false;
    return inRect(p.floor, x, y);
  }

  function randomIdlePoint(placeId) {
    if (placeId === "living") return randomCarpetPoint();
    var p = PLACES[placeId];
    var r = p && p.floor;
    if (!r) {
      var c = (p && p.spots && p.spots.center) || { x: 50, y: 60 };
      return { x: c.x, y: c.y };
    }
    var x = (r.x0 + r.x1) / 2;
    var y = (r.y0 + r.y1) / 2;
    var i;
    for (i = 0; i < 30; i++) {
      x = r.x0 + Math.random() * (r.x1 - r.x0);
      y = r.y0 + Math.random() * (r.y1 - r.y0);
      if (onPlaceFloor(placeId, x, y)) return { x: x, y: y };
    }
    return { x: x, y: y };
  }

  function otherPlace(id) {
    return id === "living" ? "balcony" : "living";
  }

  global.House = {
    MAX_RESIDENTS: MAX_RESIDENTS,
    BOWL_MAX: BOWL_MAX,
    PLACES: PLACES,
    NAV: NAV,
    defaultHouse: defaultHouse,
    fromSave: fromSave,
    toSave: toSave,
    otherPlace: otherPlace,
    onLivingCarpet: onLivingCarpet,
    randomCarpetPoint: randomCarpetPoint,
    randomIdlePoint: randomIdlePoint,
  };
})(window);
