---
name: mini-catgirl-hungry
description: >-
  Generates mini catgirl illustrations in the 馋嘴 action lane:
  high-angle front look-down, wide-open mouth, stubby finger pointing
  at her own mouth, asking to be fed. Default is a little drool at
  the lip corners, tongue inside. 馋嘴负面 hangs the tongue out.
  Default look is 风格Ⅰ. Use when the user 馋嘴, 张大嘴, 指嘴巴, 求喂,
  流口水, 喂我吃, 伸舌头馋, or 馋嘴负面. Never write brand names into
  image prompts.
---

# 迷你猫娘馋嘴

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。衣服头发可跟 [衣柜](../mini-catgirl-wardrobe/SKILL.md) 另抽，不要坐头发凳。

只蒸馏俯视求喂。脸、衣服、光跟风格Ⅰ / 角色定稿。聊天截图、别人的角色、水印不要进 `examples/`，也不要当 `reference_image_paths`。

两条。没点名走默认。用户说 **负面**、**伸舌头**、过街老鼠、形象很差，才锁负面那张。

## 这套是什么

她约 20cm，站在能走进去的石子路上。你站在她上头往下看，她仰脸。成人份薯条盒在近处当尺子。张大嘴，短手指自己的嘴洞：往这里喂。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 镜头 | 正向面对俯视。地面铺满画面。她看你。薯条盒在画面下沿，比她近、比她大 | 平视全身立绘；侧脸；只有她没有食物尺子 |
| 嘴 | 张得很大，深色椭圆。默认：舌头留在嘴里，嘴角一点口水 | 小 wow 圆嘴；没点名就伸舌头、拉丝 |
| 手 | 一只短指指着自己的嘴洞。另一只短手伸向食物 | 捂嘴；双手抱胸 |
| 尺 | 20cm。成人薯条盒大约她坐高/躯干那么大 | 她跟盒子一样高的小孩 |
| 地 | 真石子路，有颜色的光 | 聊天界面；纯色底 |

## 锁图

[examples/example-hungry.png](examples/example-hungry.png)

调用名 **馋嘴**。已点头。出这套就锁这张。不要重出那张肖像。钉的是镜头和指嘴，不是那张脸。

[examples/example-hungry-negative.png](examples/example-hungry-negative.png)

调用名 **馋嘴负面**。已点头。舌头伸出来，口水拉丝。只给形象很差、定型过街老鼠、用户点名伸舌头时用。不要当默认。

换角色：本条定稿占一张锁动作，另一张给她自己的定稿。小委屈用 `idle` 或 `ch1-standlook`，拷成仓库根目录 `tmp-idle.jpg`。不要两张都锁本条（默认+负面）。

最多两张。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm late-afternoon sun against cool colored shadows (green-cyan or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Huge hungry open mouth, a dark oval. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris. Eyes wide open, looking UP, hungry, sparkling. Not crying.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen.

SCALE: she is about 20cm tall. An adult-size red carton of french fries in the near foreground is about as big as her torso. Optional adult fingers holding the carton from below. She is tiny on the gravel. Not a child filling the path.

{HAIR}
{EYES}
{OUTFIT}
{LIMBS}

{EXPRESSION}
{SUBJECT}

{CAMERA}
```

锁图默认零件（可换成别的定稿）：

```
HAIR: fluffy honey-cream hair in soft clumps, bangs covering down to the eyebrows, side hair stuck to the outer corners of the eyes. Two LARGE pointed cat ears poke out. She is NOT sitting on a hair stool.
EYES: huge round honey-gold gradient iris, two catchlights each.
OUTFIT: oversized mint-green knit cardigan, dress-length, swallows the mini torso, round neck, pale buttons. Small pink sneakers, white toe cap, short white socks.
LIMBS: tiny plump human baby hands, THREE or FOUR short rounded fingers, no nails.
```

默认 `{EXPRESSION}` `{SUBJECT}`：

```
EXPRESSION: tongue stays INSIDE the open mouth, only barely visible in the dark oval, not sticking out past the lips. A little glossy drool only at the mouth CORNERS and lower lip. Not hanging tongue. Not saliva strings down the chin or chest. Not drool on the finger.
SUBJECT: FEED-ME POINT. She stands on a real park gravel path facing the camera. One stubby finger points at the open hole of her own mouth (put food here). The other stubby hand reaches toward the fries. Hungry, delighted, asking to be fed.
```

负面 `{EXPRESSION}` `{SUBJECT}`：

```
EXPRESSION: tongue hangs OUT of the wide-open mouth. Thick drool strings from the tongue and lips. Crude hungry. Use only for 馋嘴负面.
SUBJECT: NEGATIVE FEED-ME. Same standing gravel pose, same pointing finger, same reaching hand. Same fries in the foreground. Not the default.
```

`{CAMERA}`：

```
CAMERA: FORWARD-FACING HIGH ANGLE. You stand over her and look DOWN. She faces you and looks UP. The ground plane fills the frame. Red fry carton at the BOTTOM, closer to camera. Vertical 9:16. One mini character only. No UI, no watermark, no text.
```

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ
- [ ] 默认锁 examples/example-hungry.png + 角色定稿
- [ ] 用户说负面 / 伸舌头 / 过街老鼠馋，才锁 examples/example-hungry-negative.png
- [ ] 正向俯视；张大嘴；短指指自己的嘴；成人份薯条在近处
- [ ] 默认舌头不伸出来，只嘴角一点口水
- [ ] 不要聊天截图，不要锁别人的脸
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 镜头是正向俯视，不是平视立绘
2. 嘴张很大，一只短指指着嘴洞
3. 没点名：舌头在嘴里，只有嘴角口水
4. 点了负面：才伸舌头、拉丝
5. 她约 20cm，薯条盒是成人份
6. 人身，两侧没有人耳；没有 UI
