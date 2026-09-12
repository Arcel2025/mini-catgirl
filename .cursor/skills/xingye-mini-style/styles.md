# 色彩 / 多巴胺：光、色、英文模板

八条身子锁见 [anatomy.md](anatomy.md)。**模板里不要出现任何 App / 模型 / 官方画风名。**

## 谁走哪套

**色彩**：有方向的光，能走进去的地方。猫娘默认。

**多巴胺**：高调糖果，色场或装饰。老鼠娘默认这套。

## 色彩 prompt

`{OUTFIT}` 从 anatomy 衣橱抽一套，不要沿用上一张。`{LIMBS}` 用肉手或兽爪。`{SUBJECT}` 是谁/姿势/地点。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny dot nose or no nose. Tiny human mouth. No cat muzzle, no snout, no whiskers, no ω-mouth.

Exactly two eyes, never a third eye on the forehead. Huge round glossy eyes about one third of the face each. Soft gradient iris, dark rim, round pupil, no slit pupils. Two catchlights per eye, one large upper and one small lower. Wet glass-bead look.

Expression: blank, dazed, shy, or tiny surprise. Looking at the camera or at a prop. Not a big smile, not laughing.

Super-deformed chibi. Neck hidden. A SMALL short torso hidden inside oversized clothes — the clothes are big, she is tiny. Not a spherical fat belly, not obese, not an inflatable ball. Stubby arms and stubby legs. Not a normal child, not skinny fashion limbs.

Two LARGE pointed cat ears on top of the head only. Each ear is about one third to one half the height of the head. Pink translucent inner ears. No horns.

Very full fluffy hair painted as big color volumes, even if the cut is short. Thick fluffy cat tail, lots of fur, longer than the torso.

{OUTFIT}

{LIMBS}

{SUBJECT}

A real navigable space with depth, not a pattern wallpaper. Character centered slightly low. Vertical 9:16. One mini character only. A small real cat companion is OK. No UI, no watermark, no text.
```

默认 `{LIMBS}`：

```
Tiny plump human baby hands, 3-4 short round fingers, no nails, no paw pads, no fur on the hands or feet.
```

兽爪 `{LIMBS}`：

```
All four limbs are matching animal paws: short creamy fur, paw pads, no human fingers, no shoes. Do not mix a human hand with a paw.
```

## 多巴胺 prompt

```
Bright candy-pop chibi illustration. High-key even light, macaron palette (hot pink, lemon yellow, mint, sky blue, peach, white). Colors stay local and saturated; white stays white. Drawn-on sparkles and stars are decoration, not physics. Soft airbrushed skin, clean closed silhouette, slightly crisper soft outlines. Shadows are shallow. No night rain, no neon alley, no Tyndall beams, no moody chiaroscuro. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny dot nose or no nose. Tiny human mouth. No cat muzzle, no snout, no whiskers.

Exactly two eyes, never a third eye on the forehead. Huge round glossy eyes about one third of the face each. Soft gradient iris, dark rim, round pupil. Two catchlights per eye, one large upper and one small lower. Wet glass-bead look.

Expression: dazed or tiny surprise. Mouse-girl may have a small round wow mouth. Not a big smile, not laughing.

Super-deformed chibi. Neck hidden. A SMALL short torso hidden inside oversized clothes — the clothes are big, she is tiny. Not a spherical fat belly, not obese. Stubby arms and stubby legs.

{EARS_AND_TAIL}

Very full fluffy head hair painted as color volumes, even if the cut is short.

{OUTFIT}

{LIMBS}

{SUBJECT}

Background is a clean color field, soft gradient, or floating candy decorations. Character centered. Vertical 9:16. One mini character only unless the user asked for a stacked pair. No UI, no watermark, no text.
```

猫娘 `{EARS_AND_TAIL}`：

```
Two LARGE pointed cat ears on top of the head only, each about one third to one half the height of the head, pink inner ears. Thick fluffy cat tail with lots of fur.
```

鼠娘 `{EARS_AND_TAIL}`：

```
Two LARGE round mouse ears on top of the head only, pink and translucent, each almost half as wide as the face. Not pointed cat ears. Tail is a thin bare pink rat tail with NO fur. Do not fluff the tail. Do not give her a cat tail.
```

## 两套不要漂到对方

| 漂法 | 怎么认 | 怎么救 |
| --- | --- | --- |
| 色彩变成多巴胺 | 背景塌成色场 | 写死地点和光源 |
| 多巴胺变成色彩 | 出了夜景大对比 | 写死 high-key、色场 |
| 鼠娘变成猫娘 | 尖耳或蓬尾 | 写死圆耳 + 没毛粉尾 |
| 小胖子 | 身子是个球 | 写死 clothes big, she is tiny |
| 鞋漂成成人鞋 | 鞋带、高跟 | 写死圆头童鞋 |
