/* 房子：场地表 + 住客表。测试只放小委屈。档里最多二十只，场上只渲染当前房间。 */
(function (global) {
  var MAX_RESIDENTS = 20;

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
      girlEatW: "15%",
      hint: "点她摸摸。点碗喂。拖到地毯、碗边、窗边、沙发前。她有时会去阳台。",
      map: { x: 54, y: 40 },
      spots: {
        rug: { x: 55, y: 82 },
        bowl: { x: 54, y: 72 },
        window: { x: 80, y: 64 },
        sofa: { x: 18, y: 74 },
        door: { x: 92, y: 84 },
      },
    },
    balcony: {
      id: "balcony",
      name: "阳台",
      bg: "assets/balcony.png",
      ar: "9 / 16",
      arNum: 9 / 16,
      hasBowl: false,
      girlW: "8%",
      girlEatW: "8%",
      hint: "点她摸摸。点门口回客厅。碗在客厅。",
      map: { x: 52, y: 76 },
      spots: {
        pot: { x: 28, y: 66 },
        corner: { x: 48, y: 70 },
        door: { x: 72, y: 74 },
      },
      gate: { x: 82, y: 58, w: 22, h: 46, to: "living", label: "回客厅" },
    },
  };

  var NAV = [
    { id: "living", name: "客厅" },
    { id: "balcony", name: "阳台" },
    { id: "room", name: "房间", locked: true, reason: "房间空景还没锁，先不去。" },
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

  function defaultHouse() {
    return {
      view: "living",
      line: "鞋鞋……饭饭？",
      bowlHasFood: false,
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
    g.sticker = raw.sticker === "eat" || raw.sticker === "walk" ? "stand" : String(raw.sticker || "stand");
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
      house.bowlHasFood = !!h.bowlHasFood;
      var list = Array.isArray(h.residents) ? h.residents : [];
      house.residents = list.slice(0, MAX_RESIDENTS).map(clampResident);
      if (!house.residents.length) house.residents = [defaultResident()];
      return house;
    }
    var room = data.room || {};
    if (room.line) house.line = String(room.line);
    house.bowlHasFood = !!room.bowlHasFood;
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
      bowlHasFood: !!house.bowlHasFood,
      residents: house.residents.map(function (g) {
        return {
          id: g.id,
          name: g.name,
          place: g.place,
          spot: g.spot,
          sticker: g.sticker === "walk" || g.sticker === "eat" ? "stand" : g.sticker,
          x: g.x,
          y: g.y,
        };
      }),
    };
  }

  function otherPlace(id) {
    return id === "living" ? "balcony" : "living";
  }

  global.House = {
    MAX_RESIDENTS: MAX_RESIDENTS,
    PLACES: PLACES,
    NAV: NAV,
    defaultHouse: defaultHouse,
    fromSave: fromSave,
    toSave: toSave,
    otherPlace: otherPlace,
  };
})(window);
