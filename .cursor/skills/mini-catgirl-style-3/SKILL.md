---
name: mini-catgirl-style-3
description: >-
  Generates mini beast-girl illustrations in 迷你猫娘风格Ⅲ:
  高调糖果色的迷你兽娘. High-key candy light, macaron colors, yellow stars
  or a clean color field. Mouse-girls default here; cat-girls are OK.
  Stacked pairs and hatboxes are common. Use when the user 风格Ⅲ,
  风格3, 迷你猫娘风格Ⅲ, 多巴胺, 糖果, 老鼠娘, or 鼠娘. Never write brand
  names into image prompts.
---

# 迷你猫娘风格Ⅲ

高调糖果色的迷你兽娘。

人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。旧名「多巴胺」指向这里。

**命根子：色在发糖。** 高调平光，马卡龙固有色顶住，白还是白。星星是画上去的装饰。老鼠娘默认这套；猫娘也可以。

衣服、发型、瞳色、表情每次另抽。没说就一只。用户说叠、一对、两只再叠坐。旁边可有小白鼠当伴，不要再画第二只抢脸的兽娘（叠坐除外）。

## 这套是什么

和风格Ⅱ的差别是色：这里是马卡龙、黄星、色场，不是橱窗瓷白。和厚涂的差别是皮：这里干净浅线，不是夜景喷枪。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 光 | 高调、均匀，白还是白 | 夜雨巷；脸冷暖对切 |
| 色 | 粉、柠檬、薄荷、天蓝、桃、白 | 脏破；油画厚涂 |
| 饰 | 黄星、花瓣、泡泡是画上去的 | 当成真实光源 |
| 猫娘 | 尖耳 + 蓬尾，人身 | 人脸安在猫身上 |
| 鼠娘 | 大圆耳 + **没毛粉尾** | 尖猫耳；蓬猫尾 |
| 构图 | 色场 / 黄星底；可钻帽盒；可叠坐；可坐书桌 | 空手走夜巷当默认 |
| 神态 | 愣、小 wow（鼠娘更 wow） | 媚、怒、大笑露龈 |

兽只长头顶。两侧不要人耳。身子是人。

## 例图

- [examples/example-mouse-stand.png](examples/example-mouse-stand.png) 鼠娘站，蓝卫衣，黄星底
- [examples/example-cat-desk.png](examples/example-cat-desk.png) 猫娘，夜书桌俯视，台灯作业本
- [examples/example-mouse-desk.png](examples/example-mouse-desk.png) 鼠娘，夜书桌俯视，台灯作业本

出图 `reference_image_paths` 最多两张：一张本条例图，一张角色定稿。不要把例图清单全塞进去。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Bright candy-pop chibi illustration. High-key even light, macaron palette (hot pink, lemon yellow, mint, sky blue, peach, white). Colors stay local and saturated; white stays white. Drawn-on sparkles and stars are decoration, not physics. Soft airbrushed skin, clean closed silhouette, slightly crisper soft outlines. Shadows are shallow. No night rain, no neon alley, no cinematic oil paint, no merch-window porcelain doll, not photoreal. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny dot nose or no nose. Tiny human mouth. No cat muzzle, no whiskers.

Exactly two eyes. Huge round glossy eyes about one third of the face each. Soft gradient iris, dark rim, round pupil. Two catchlights per eye. Wet glass-bead look.

Expression: blank, dazed, or tiny surprise. Mouse-girl may have a small round wow mouth. Not a big smile, not laughing, not sexy.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen, not an inflatable fat ball.

{EARS_AND_TAIL}

Hair covers both sides of the head. NO human ears on the sides.

{HAIR}
{EYES}
{OUTFIT}
{LIMBS}

{SUBJECT}

Background is a clean color field, soft gradient, or floating candy decorations. Character centered. Vertical 9:16. One mini character only unless the user asked for a stacked pair. A small real white mouse companion is OK. No UI, no watermark, no text.
```

猫娘 `{EARS_AND_TAIL}`：

```
Two LARGE pointed cat ears on top of the head only, pink inner ears. Thick fluffy cat tail. No human ears on the sides.
```

鼠娘 `{EARS_AND_TAIL}`（默认鼠娘）：

```
Two LARGE round mouse ears on top of the head only, pink and translucent, each almost half as wide as the face. Not pointed cat ears. Tail is a thin bare pink rat tail with NO fur. Do not fluff the tail. Do not give her a cat tail. No human ears on the sides.
```

默认 `{LIMBS}`：婴儿肉手，3～4 短圆指。

叠坐 `{SUBJECT}`：

```
Two mini mouse-girls stacked, the smaller one sitting on the larger one's head or shoulders. Same candy finish. Not a third girl.
```

书桌 `{SUBJECT}`：

```
HIGH ANGLE looking down. Night. She is tiny on a wooden desk. A warm yellow desk lamp. An open homework notebook with blank ruled pages and no readable text. Background softly blurred.
```

## QA

1. 高调糖果皮，或书桌那两张的夜灯俯视
2. 鼠娘：圆耳 + 没毛粉尾
3. 人身，两侧没有人耳
4. 不是人脸安在猫身上
5. 没有 UI
