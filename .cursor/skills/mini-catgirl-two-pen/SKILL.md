---
name: mini-catgirl-two-pen
description: >-
  Generates mini catgirl illustrations in the 双笔发懵 action lane:
  20cm on an adult desk, left pen and right pencil both writing, puzzled.
  Default look is 风格Ⅰ. Use when the user 双笔发懵, 双持笔, or 两只手写字.
  Never write brand names into image prompts.
---

# 迷你猫娘双笔发懵

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。角色默认 [棉花坐](../mini-catgirl-wardrobe/SKILL.md)。

一只铅笔加台灯见 [台灯写字](../mini-catgirl-desk-write/SKILL.md)。本条是双手各一支笔，一脸问号。

只蒸馏双持和发懵。脸、衣服跟风格Ⅰ / 角色定稿。小红书原图、水印不要进 `examples/`，也不要当 `reference_image_paths`。

## 这套是什么

她约 20cm，整段短身子压在成人书桌上。左手黑笔，右手铅笔，两只都在本子上。本子乱涂，无可读字。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 尺 | 她很小，桌是成人桌 | 课桌小孩；白底全身抠图当默认 |
| 手 | 左手一支、右手一支，同时挨着纸 | 只握一只笔（那是台灯写字） |
| 脸 | 看镜头，困惑 | 认真学霸；大笑 |
| 页 | 红蓝乱线、圈，念不出来 | 能看清的算式或汉字 |
| 问号 | 空气里一个小问号可以 | 满屏字；小红书水印 |

头发摊在桌上。不要坐在头发凳上。

## 锁图

[examples/example-two-pen.png](examples/example-two-pen.png)

调用名 **双笔发懵**。已点头。出这套就锁这张。不要重出那张肖像。钉的是动作，不是那张脸。

换角色：定稿占一张锁动作，另一张给她自己的定稿。小委屈用 `idle` 或 `ch1-standlook`，拷成仓库根目录 `tmp-idle.jpg`。

最多两张。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm indoor key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth. Puzzled look toward camera. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen.

SCALE: she is about 20cm tall. She leans her whole tiny torso onto an adult wooden desk. The open notebook is bigger than her torso. Not a schoolchild at a matching desk.

{HAIR}
{EYES}
{OUTFIT}
{LIMBS}

{SUBJECT}

{CAMERA}
```

默认棉花坐零件（可换成别的定稿）：

```
HAIR: white raw-cotton hair, long, extremely fluffy, separate soft clumps. Bangs cover down to the eyebrows. Side hair sticks to the outer eye corners; almost no side of the face visible. Two LARGE pointed cat ears poke out of the cotton. Hair pools on the desk. She is NOT sitting on a hair stool.
EYES: huge round sky-blue gradient iris, two catchlights each.
OUTFIT: oversized mint-green knit cardigan, dress-length, swallows the mini torso.
LIMBS: tiny plump human baby hands, THREE or FOUR short rounded fingers, no nails.
```

`{SUBJECT}`：

```
TWO-PEN CONFUSED. LEFT baby hand holds a black pen. RIGHT baby hand holds a wooden pencil. Both touch the huge notebook at once. Page is messy scribbles and circles, no readable letters. A single small question mark may float near her head. No other text. Walkable indoor room behind the desk.
```

`{CAMERA}`：

```
CAMERA: high angle looking down at the desk and her. Vertical 9:16. One mini character only. No UI, no watermark, no text except the optional question mark.
```

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ
- [ ] 锁 examples/example-two-pen.png + 角色定稿
- [ ] 左手笔、右手铅笔；她在成人桌上
- [ ] 发懵；页上无字
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 两只手两支笔都在纸上
2. 她明显小于书桌
3. 表情是困惑
4. 人身，两侧没有人耳
5. 没有 UI、没有可读字
