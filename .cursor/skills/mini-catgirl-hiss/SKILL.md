---
name: mini-catgirl-hiss
description: >-
  Generates mini catgirl illustrations in the 炸毛四足 action lane:
  human toddler on all fours, puffed tail, fake-fierce open mouth.
  Default look is 风格Ⅰ. Use when the user 炸毛四足, 四足撑地, 装凶趴地,
  or 哈气炸毛. Never write brand names into image prompts.
---

# 迷你猫娘炸毛四足

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。角色默认 [棉花坐](../mini-catgirl-wardrobe/SKILL.md)。

只蒸馏四肢着地的警告姿态。脸、衣服、光跟风格Ⅰ / 角色定稿。小红书原图、对白气泡、水印不要进 `examples/`，也不要当 `reference_image_paths`。

## 这套是什么

人身四肢着地，装凶，其实要哭。约 20cm，趴在能走进去的成人地板上。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 镜头 | 略俯 3/4。她朝镜头扑。脸和两只撑地的手在画面前侧；屁股、尾、后腿往左侧退 | 侧面爬；并膝婴儿爬 |
| 身 | 迷你人身：头大、短身子藏在开衫里。双手是婴儿肉手撑地 | 人脸安在猫身上；细长猫躯干；前爪 |
| 后腿 | 两条短腿岔开，伸直撑地，两只粉鞋都看得见 | 并膝；长腿屈膝；只露一条后腿 |
| 尾 | 炸毛巨尾，毛炸开，体积大约整只身子那么大。出戏、好笑，就这样 | 细旗杆；一条瘦尾巴；把尾巴收成正常比例 |
| 脸 | 下巴抬起，脸转向镜头。眉心压下来装凶。张嘴哈气看你，可带一点泪 | 看地板；圆 wow；低头爬 |
| 地 | 能走进去的室内地板，有颜色的光 | 白底；满屏大字 |

头发摊在地上。不要坐在头发凳上。

## 锁图

[examples/example-hiss.png](examples/example-hiss.png)

调用名 **炸毛四足**。已点头。出这套就锁这张。不要重出那张肖像。钉的是动作，不是那张脸。巨尾是故意的，不要收。

换角色：定稿占一张锁动作，另一张给她自己的定稿。小委屈用 `idle` 或 `ch1-standlook`，拷成仓库根目录 `tmp-idle.jpg`。

最多两张。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面、水印、对白。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth open in a small shout. Eyes wet, trying to look fierce, about to cry. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail PUFFED and raised behind the head.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Torso stays human.

SCALE: she is about 20cm tall. Her whole body is about as long as ONE adult hand, wrist to fingertip. Her head is about as big as ONE adult fist. She is on an adult floor, not filling the frame like a schoolchild.

{HAIR}
{EYES}
{OUTFIT}
{LIMBS}

{SUBJECT}

{CAMERA}
```

默认棉花坐零件（可换成别的定稿）：

```
HAIR: white raw-cotton hair, long, extremely fluffy, separate soft clumps. Bangs cover down to the eyebrows. Side hair sticks to the outer eye corners; almost no side of the face visible. Two LARGE pointed cat ears poke out of the cotton. Hair pools on the floor. She is NOT sitting on a hair stool.
EYES: huge round sky-blue gradient iris, two catchlights each.
OUTFIT: oversized mint-green knit cardigan, dress-length, swallows the mini torso.
LIMBS: tiny plump human baby hands, THREE or FOUR short rounded fingers, no nails. Hands planted on the floor.
```

`{SUBJECT}`：

```
ALL-FOURS HISS. Mini HUMAN toddler. Chest low, rump slightly up. Two stubby BABY HANDS planted on the floor, not paws. Head LIFTED, chin up, face turned toward the camera. Inner brows angled down, fierce little frown. Mouth open in a shout. Huge wet sky-blue eyes look AT YOU, not at the floor.

TAIL 炸毛: an ENORMOUS bristled fluffy white cat tail, fur exploding outward, volume about as big as her whole body, a huge bottlebrush cloud rising from the rump. Not a thin stick, not a skinny flagpole.

HIND LEGS: two extremely short stubby legs SPLAYED APART like a fork, empty floor between them. Because the legs are tiny, they are STRAIGHT pegs, no knee bend. One pink sneaker kicked back to the viewer's left. The other pink sneaker planted under the torso toward the camera, spread away from the left. Both sneakers visible.
```

`{CAMERA}`：

```
CAMERA: slightly high three-quarter. She lunges toward the viewer. Face and planted hands in the front-right; rump, tail, and back-left hind leg recede to the left. Full body. A real indoor floor you can walk into, warm lamp, sofa. Vertical 9:16. One mini character only. No UI, no watermark, no text, no speech bubbles.
```

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ
- [ ] 锁 examples/example-hiss.png + 角色定稿
- [ ] 3/4 朝镜头扑；下巴抬起看你；眉压装凶；后腿岔开伸直；巨尾炸毛；人身短身子不是猫躯干
- [ ] 约 20cm，成人地板
- [ ] 不要小红书原图；不要对白
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 身子是人，只是手脚撑地
2. 镜头是略俯 3/4，她朝你扑
3. 后腿岔开、伸直，两只鞋都在
4. 下巴抬起，眼睛看你，眉心压下来
5. 尾巴是炸开的巨尾，不是细杆
6. 身子是短人身，不是猫躯干；没有字、没有 UI
