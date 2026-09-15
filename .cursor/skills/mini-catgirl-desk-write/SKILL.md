---
name: mini-catgirl-desk-write
description: >-
  Generates mini catgirl illustrations in the 台灯写字 action lane:
  she is 20cm on an adult desk, warm lamp, one pencil, homework.
  Default look is 风格Ⅰ. Use when the user 台灯写字, 伏案写字, or 戴眼镜写作业.
  Never write brand names into image prompts.
---

# 迷你猫娘台灯写字

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。角色默认 [棉花坐](../mini-catgirl-wardrobe/SKILL.md)。

两只手各握一支笔见 [双笔发懵](../mini-catgirl-two-pen/SKILL.md)。本条只有一只铅笔、一盏台灯。

只蒸馏伏案和灯。脸、衣服跟风格Ⅰ / 角色定稿。小红书原图、水印不要进 `examples/`，也不要当 `reference_image_paths`。眼镜是道具，不是人设。

## 这套是什么

她约 20cm，坐或跪在成人书桌上。本子比她身子大。铅笔在肉手里像小木棍。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 尺 | 她很小，桌是成人桌，本子比身子大 | 人桌匹配的课桌小孩 |
| 手 | 右手握一只铅笔在写，左手按页 | 两只手两支笔（那是双笔发懵） |
| 灯 | 右上暖台灯打在脸上，环境色会染 | 白底抠图；橱窗平光 |
| 镜 | 可戴圆框眼镜当道具 | 把眼镜焊进这只猫娘的身份 |
| 页 | 摊开的本，无可读字 | 能念出来的作业文字 |

头发摊在桌面上。不要坐在头发凳上。

## 锁图

[examples/example-desk-write.png](examples/example-desk-write.png)

调用名 **台灯写字**。已点头。出这套就锁这张。不要重出那张肖像。钉的是动作，不是那张脸。

换角色：定稿占一张锁动作，另一张给她自己的定稿。小委屈用 `idle` 或 `ch1-standlook`，拷成仓库根目录 `tmp-idle.jpg`。

最多两张。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。页上不要可读文字。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm desk-lamp key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth. Small focused frown. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen.

SCALE: she is about 20cm tall. She sits or kneels ON an adult wooden desk. The open notebook is bigger than her torso. The pencil is like a small log in her baby hands. Not a schoolchild at a matching desk.

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
DESK HOMEWORK. Night indoor room you can walk into. A warm desk lamp from the upper right colors her face. She is tiny on the wooden desk. Right baby hand holds ONE pencil, writing. Left baby hand rests on the page. Open notebook, blank ruled pages, no readable text. Round glasses OK as a PROP only, not her identity. Tissue box or spare pencil OK.
```

`{CAMERA}`：

```
CAMERA: slightly high, front, showing her head and the desk surface. Vertical 9:16. One mini character only. No UI, no watermark, no text.
```

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ
- [ ] 锁 examples/example-desk-write.png + 角色定稿
- [ ] 她在成人桌上；一只铅笔；暖台灯
- [ ] 页上无字；无小红书原图
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 她明显小于书桌
2. 只有一只笔在写
3. 台灯暖光染脸
4. 人身，两侧没有人耳
5. 没有 UI、没有可读字
