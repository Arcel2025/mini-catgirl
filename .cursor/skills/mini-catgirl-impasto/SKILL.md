---
name: mini-catgirl-impasto
description: >-
  Generates mini catgirl illustrations in the 厚涂 lane: almost-lineless
  cinematic light, shallow depth of field, airbrushed volume. Body scale
  still from mini-catgirl-body. Use when the user 厚涂 or asks for that
  painterly look. Never write brand names into image prompts.
---

# 迷你猫娘·厚涂

先读 [mini-catgirl-body](../mini-catgirl-body/SKILL.md)，再套本套光。

**命根子：线几乎化掉，光像打灯，体积像喷枪。** 浅景深。身子仍是迷你，不要画成 3～4 头小孩，不要画成兽身。

衣发眼表情从 [wardrobe.md](../mini-catgirl-body/wardrobe.md) 另抽。爪必须写死——这套样本里白爪很多，没说就仍用肉手。

## 英文模板

```
Painterly chibi illustration. Almost no outlines. Cinematic lighting, strong key light, cool fill, shallow depth of field, creamy airbrushed skin like soft spray-paint. Hair and clothes read as volumes, not line art. Bloom around lights, bokeh background. Not cel-shading, not thick sticker lines, not high-key candy-pop, not photoreal live-action. Do not name any app, model, or commercial art preset.

{FACE}
{BODY}
{EARS}
{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}
{SUBJECT}

A real space with depth and atmosphere. Character centered slightly low. Vertical 9:16. One mini character only. A small real cat companion is OK. Human girl body, never a cat torso with a human head. No UI, no watermark, no text.
```

## 本地锁

构图锁（渲染是厚涂，角色别抄错）：`参考图/ref_ragdoll_catgirl_box_ok.png`、`ref_siamese_bath_slap_ok.png`、`ref_maine_coon_icecream_ok.png`、`ref_lihua_stock_green_ok.png`。出新角色只借渲染，不借她们的脸和场面。

其他玩家这批里，用户没把任何一张推进「厚涂」文件夹。根目录未分类图不要当本套锁。不要锁兽身。

外发只用 `参考图/_*.png`。

## QA

- 线很淡或没有
- 光像电影，背景糊
- 仍是人站着或坐着的迷你，不是猫身子
- 身子 QA 过

## 不要

- 漂成色彩的浅色线，或多巴胺色场
- 为了厚涂把头身拉回正常小孩
- 提示词写品牌名
