---
name: mini-catgirl-rainbox
description: >-
  Generates mini catgirl illustrations in the 雨箱 lane: night rain,
  painterly chibi. Hands may be white-furred baby hands or cat paws.
  Examples: standing in the rain, or hiding in a wet box. Use when
  the user 雨箱, 雨里探头, 白爪箱子, or 全身雨箱. Never write brand names into
  image prompts.
---

# 迷你猫娘·雨箱

人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。

夜雨、浅浅轮廓、湿玻璃珠眼。身子仍是迷你人身，不是人头猫身。手脚可以是覆白短毛的婴儿小肉手（3～4 短圆指），也可以是猫爪。不是圆蹄子。

衣服、发型、瞳色、表情每次另抽。

## 例图

- [examples/example-stand.png](examples/example-stand.png) 全身，雨里站，空箱在后
- [examples/example-box.png](examples/example-box.png) 躲进湿纸箱，白毛小手搭沿

出图 `reference_image_paths` 最多两张：全身或箱子里选一张当风格锁，角色另有定稿再加一张。不要两张风格例图再加角色。不要带界面截图。路径用英文目录，中文路径会 400。

## 这套是什么

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 画 | 跟全身例图：夜雨、湿亮、浅浅线 | 白底瓷娃娃；糖果星星墙 |
| 爪 | 白毛婴儿肉手，或猫爪 | 圆蹄子；五指成人手 |
| 天气 | 夜雨、雨丝、水洼 | 晴天橱窗 |
| 探箱 | 箱子吃掉身子，小手搭沿 | — |
| 全身 | 整个人在雨里，空箱可放后面 | 7 头身；普通小孩 |

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Painterly night-rain chibi, same finish as the standing-in-rain example: soft slight outlines, wet airbrushed skin, rain streaks, puddles, dark plants. Wet glossy jewel eyes, heavy catchlights, pink or red iris. Soft dumpling face, heavy blush, tiny human mouth. No cat muzzle, no whiskers.

Hands and feet are either plump BABY toddler hands with THREE or FOUR short rounded fingers covered in short white fur, or matching fluffy cat paws. Fingers or toes must be separately visible. Not round hooves, not featureless mittens. No shoes. Two pointed cat ears on top of the head only.

Super-deformed mini: large head, neck hidden, tiny torso swallowed by oversized clothes, stubby limbs. Not a 3-to-4-head schoolkid, not a 7-head teen.

{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}

{SUBJECT}

Night rain. Not a sunny merch window, not candy-star wallpaper, not cel-sticker lines, not photoreal. Do not name any app, model, or commercial art preset.
Vertical 9:16. One mini catgirl only. No UI, no watermark, no text.
```

全身 `{SUBJECT}`（默认）：

```
FULL BODY standing in the rain, ear-tips to furred baby feet visible. A wet empty cardboard box may sit behind her as a prop; she is outside it.
```

探箱 `{SUBJECT}`：

```
She peeks FROM INSIDE a wet brown cardboard box. The box swallows the body; almost only the head and two hands on the rim — furred baby hands or cat paws.
```

## QA

1. 夜雨，不是白底瓷娃娃
2. 手是白毛婴儿肉手或猫爪，不是蹄子
3. 全身看得到脚；探箱则身子在箱里
4. 人脸，耳只长头顶
5. 没有 UI
