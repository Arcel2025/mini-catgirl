---
name: mini-catgirl-dopamine
description: >-
  Generates mini catgirl / mouse-girl illustrations in the 多巴胺 lane:
  high-key candy color, even light, decorations. Body scale comes from
  mini-catgirl-body. Use when the user 多巴胺, 糖果, 老鼠娘, or 鼠娘.
  Never write brand names into image prompts.
---

# 迷你猫娘·多巴胺

先读 [mini-catgirl-body](../mini-catgirl-body/SKILL.md)，再套本套色。

**命根子：色在发糖。** 高调平光，马卡龙固有色顶住。星星是画上去的装饰。老鼠娘默认这套。

衣发眼表情从 [wardrobe.md](../mini-catgirl-body/wardrobe.md) 另抽。鼠娘：圆耳 + 没毛粉尾。

## 英文模板

```
Bright candy-pop chibi illustration. High-key even light, macaron palette (hot pink, lemon yellow, mint, sky blue, peach, white). Colors stay local and saturated; white stays white. Drawn-on sparkles and stars are decoration, not physics. Soft airbrushed skin, clean closed silhouette, slightly crisper soft outlines. Shadows are shallow. No night rain, no neon alley, no Tyndall beams, no moody chiaroscuro. Do not name any app, model, or commercial art preset.

{FACE}
{BODY}
{EARS_AND_TAIL}
{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}
{SUBJECT}

Background is a clean color field, soft gradient, or floating candy decorations. Character centered. Vertical 9:16. One mini character only unless the user asked for a stacked pair. No UI, no watermark, no text.
```

鼠娘 `{EARS_AND_TAIL}`：

```
Two LARGE round mouse ears on top of the head only, pink and translucent, each almost half as wide as the face. Not pointed cat ears. Tail is a thin bare pink rat tail with NO fur. Do not fluff the tail.
```

## 本地锁

主锁仍是 `参考图/ref_style_dopamine_1.jpg`～`5.jpg`（「我的」，含鼠娘）。外发只用 `参考图/_*.png`。

其他玩家你点名的多巴胺只有一张：`_xingye_others_analysis/多巴胺画风/o_041_190.jpg`（和服）。婴儿床、蓝帽抱兔已进风格Ⅱ，不要再当多巴胺锁。

## QA

- 高调，白还是白
- 背景是色场或装饰，不是夜雨巷
- 鼠娘没有尖耳、没有蓬尾
- 身子 QA 过

## 不要

- 漂成夜景色彩或油画厚涂
- 提示词写品牌名
