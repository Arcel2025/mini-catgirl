---
name: mini-catgirl-style-1
description: >-
  Generates mini catgirl illustrations in 迷你猫娘风格Ⅰ:
  有颜色的光，能走进去的地方. Warm key against cool colored shadows, walkable
  space, soft slight outlines. Default lane. Use when the user 风格Ⅰ,
  风格1, 迷你猫娘风格Ⅰ, 色彩, 出图, or 立绘 and does not name another style.
  Never write brand names into image prompts.
---

# 迷你猫娘风格Ⅰ

有颜色的光，能走进去的地方。

人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。旧名「色彩」指向这里。默认出图走这套。

**命根子：光是有颜色的，颜色会互相染。** 暖主光对冷阴影。背景是能走进去的地方，不是色场。

衣服、发型、瞳色、表情每次另抽。身子是人。耳只长头顶。两侧不要人耳。

## 这套是什么

和风格Ⅱ的差别是光：这里环境色会染脸；风格Ⅱ是橱窗平光。和风格Ⅲ的差别是地：这里是能走进去的街和屋，不是马卡龙色场。和厚涂的差别是线：这里还有浅浅轮廓。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 光 | 暖主光，冷阴影，会染皮肤和衣服 | 高调平光；夜雨喷枪没线 |
| 地 | 能走进去的街、屋、店 | 纯色墙；糖果星星底 |
| 皮 | 浅浅有色轮廓，喷枪过渡 | 粗黑贴纸；油画厚涂 |
| 身 | 迷你人身，头偏大 | 7 头身；人脸安在猫身上 |

## 例图

- [examples/example-box-v1.png](examples/example-box-v1.png) 白毛衣坐纸箱
- [examples/example-box-v2.png](examples/example-box-v2.png) 白毛衣探纸箱
- [examples/example-street-v1.png](examples/example-street-v1.png) 路沿抱箱
- [examples/example-street-v2.png](examples/example-street-v2.png) 巷子黄卫衣
- [examples/example-street-v3.png](examples/example-street-v3.png) 卷帘门白 T
- [examples/example-street-v4.png](examples/example-street-v4.png) 店门口粉长发

出图 `reference_image_paths` 带这些。不要带界面截图。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen.

{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}

{SUBJECT}

A real navigable space with depth, not a pattern wallpaper. Character centered slightly low. Vertical 9:16. One mini character only. A small real cat companion is OK. No UI, no watermark, no text.
```

默认 `{LIMBS}`：婴儿肉手，3～4 短圆指。

街头流浪 `{SUBJECT}`：

```
A stray mini catgirl on a real night street or alley. She is tiny. Shop or lamp light colors her face. Full body. One character only.
```

## QA

1. 光有颜色，脸和衣服吃到环境色
2. 背景是地方，不是色场
3. 人身，两侧没有人耳
4. 没有 UI
