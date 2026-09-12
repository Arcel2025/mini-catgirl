---
name: mini-catgirl-color
description: >-
  Generates mini catgirl illustrations in the 色彩 lane: colored light,
  walkable space, soft slight outlines. Body scale comes from
  mini-catgirl-body. Use when the user 出图, 立绘, 色彩, or does not name
  another style. Never write brand names into image prompts.
---

# 迷你猫娘·色彩

先读 [mini-catgirl-body](../mini-catgirl-body/SKILL.md)，再套本套光。

**命根子：光是有颜色的，颜色会互相染。** 暖主光对冷阴影。背景是能走进去的地方。

衣发眼表情从 [wardrobe.md](../mini-catgirl-body/wardrobe.md) 另抽。

## 英文模板

把身子锁、`{OUTFIT}` `{HAIR}` `{EYES}` `{EXPRESSION}` `{LIMBS}` `{SUBJECT}` 填进去。不要写任何 App / 模型 / 官方画风名。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

{FACE}
{BODY}
{EARS}
{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}
{SUBJECT}

A real navigable space with depth, not a pattern wallpaper. Character centered slightly low. Vertical 9:16. One mini character only. A small real cat companion is OK. No UI, no watermark, no text.
```

## 本地锁

主锁仍是 `参考图/ref_style_color_1.jpg`～`4.jpg`（从「我的」裁的）。外发只用 `参考图/_*.png`。

其他玩家你点名的色彩只有这三张：

- `_xingye_others_analysis/色彩画风/o_007_146.jpg`
- `_xingye_others_analysis/色彩画风/o_053_205.jpg`
- `_xingye_others_analysis/色彩画风/o_061_214.jpg`

不要把风格Ⅱ定稿或根目录未分类图当色彩锁。

## QA

- 光有方向，脸和衣服吃到环境色
- 背景是地方，不是色场
- 身子 QA 过

## 不要

- 漂成多巴胺色场或厚涂没线
- 锁半写实那几张的头身
- 提示词写品牌名
