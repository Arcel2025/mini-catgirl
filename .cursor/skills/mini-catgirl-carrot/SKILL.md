---
name: mini-catgirl-carrot
description: >-
  Generates mini catgirl illustrations in the 啃胡萝卜 action lane:
  she is 20cm sitting in grass, biting an oversized carrot.
  Default look is 风格Ⅰ. Use when the user 啃胡萝卜, 吃萝卜, or 草地萝卜.
  Never write brand names into image prompts.
---

# 迷你猫娘啃胡萝卜

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。角色默认 [棉花坐](../mini-catgirl-wardrobe/SKILL.md)。

只蒸馏坐草地、过大的萝卜抵嘴。脸、衣服跟风格Ⅰ / 角色定稿。小红书截图、评论区、水印不要进 `examples/`，也不要当 `reference_image_paths`。

两条表情。没点名就眨眼那条。

## 这套是什么

她约 20cm，坐进能走进去的草地里。草叶相对大。胡萝卜比她的饺子脸还长一截。两只短手捧着咬尖。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 尺 | 20cm 坐进草里，草叶花瓣显得大 | 野餐小孩占满草坪 |
| 食 | 胡萝卜相对脸过大，双手捧，咬尖 | 正常比例小零食；第二只猫娘 |
| 眨眼 | 默认：一眼闭一眼睁，小笑 | 没点名改成闭眼 |
| 闭眼 | 用户说享受/闭眼：眯眼咬，萝卜带缨 | 两套表情叠一张 |
| 地 | 真草地，有深度，有颜色的光 | 小红书界面；纯色底 |

头发摊在草上。不要坐在头发凳上。

## 锁图

[examples/example-carrot-wink.png](examples/example-carrot-wink.png)

调用名 **啃胡萝卜**。眨眼那条已点头。出眨眼就锁这张。不要重出那张肖像。钉的是动作，不是那张脸。闭眼还没点头，未出过定稿。

换角色：定稿占一张锁动作，另一张给她自己的定稿。小委屈用 `idle` 或 `ch1-standlook`，拷成仓库根目录 `tmp-idle.jpg`。

最多两张。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm sun or garden light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth biting a carrot. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen.

SCALE: she is about 20cm tall. She sits in real grass; blades and flowers look large next to her. The carrot is large relative to her dumpling face. Not a child picnic occupying the lawn.

{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}

{SUBJECT}

{CAMERA}
```

默认棉花坐零件（可换成别的定稿）：

```
HAIR: white raw-cotton hair, long, extremely fluffy, separate soft clumps. Bangs cover down to the eyebrows. Side hair sticks to the outer eye corners; almost no side of the face visible. Two LARGE pointed cat ears poke out of the cotton. Hair pools on the grass. She is NOT sitting on a hair stool.
EYES: huge round sky-blue gradient iris, two catchlights each.
OUTFIT: oversized mint-green knit cardigan, dress-length, swallows the mini torso. Small pink sneakers, white toe cap, white sole, short white socks.
LIMBS: tiny plump human baby hands, THREE or FOUR short rounded fingers, no nails. Both hands hold the carrot.
```

眨眼 `{EXPRESSION}` `{SUBJECT}`（默认）：

```
EXPRESSION: one eye closed wink, the other eye open, small smile.
SUBJECT: CARROT-EAT WINK. Kneeling-sit or side-sit in grass. Both stubby hands hold an oversized orange carrot. Biting the tip.
```

闭眼 `{EXPRESSION}` `{SUBJECT}`：

```
EXPRESSION: both eyes closed or squinting, enjoying the bite.
SUBJECT: CARROT-EAT ENJOY. Same sit-in-grass. The carrot still has leafy greens. Short motion ticks near the head OK, no letters.
```

`{CAMERA}`：

```
CAMERA: slightly high three-quarter, full body. A real garden or forest edge you can walk into. Vertical 9:16. One mini character only. No UI, no watermark, no text.
```

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ
- [ ] 默认眨眼，锁 examples/example-carrot-wink.png + 角色定稿
- [ ] 用户说享受/闭眼才走闭眼（闭眼还没定稿）
- [ ] 20cm 坐进草里；萝卜比脸大；双手捧
- [ ] 不要小红书截图
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 她明显小于周围的草和花
2. 胡萝卜相对脸过大
3. 没点名就是眨眼，不是闭眼
4. 人身，两侧没有人耳
5. 没有 UI
