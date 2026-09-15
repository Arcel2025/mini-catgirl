---
name: mini-catgirl-beans
description: >-
  Generates mini catgirl illustrations in the 出示肉垫 action lane:
  W-sit on the floor, both cat-paw pads facing the camera, wink.
  Default look is 风格Ⅰ. Use when the user 出示肉垫, 亮爪, 肉垫, or
  鸭子坐举爪. Never write brand names into image prompts.
---

# 迷你猫娘出示肉垫

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。角色默认 [棉花坐](../mini-catgirl-wardrobe/SKILL.md)。

只蒸馏鸭子坐和双爪亮豆。脸、衣服、光跟风格Ⅰ / 角色定稿。小红书原图、水印不要进 `examples/`，也不要当 `reference_image_paths`。

**命根子：肉垫朝镜头。** 本条手脚换成猫爪。不要用默认婴儿肉手，豆会没掉。

## 这套是什么

她约 20cm，鸭子坐在能走进去的成人地板上。两臂抬到胸口，爪心豆对着你。眨眼，小开口笑。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 坐 | 膝弯、脚向两侧撇，鸭子坐 | 站着亮爪；跪直 |
| 爪 | 两只毛茸茸猫爪，粉棕肉垫正对镜头，豆清楚 | 婴儿肉手；爪背朝外；圆蹄 |
| 脸 | 一眼闭一眼睁，小开口笑 | 双睁严肃 |
| 尺 | 20cm，头约一只拳头，坐在成人地板上 | 白底等身小孩 |
| 发 | 棉花长绒摊在地上 | 坐在头发凳上 |

斜挎相机不要画，除非用户点名。

## 锁图

[examples/example-beans.png](examples/example-beans.png)

调用名 **出示肉垫**。已点头。出这套就锁这张。不要重出那张肖像。钉的是动作，不是那张脸。

换角色：定稿占一张锁动作，另一张给她自己的定稿。小委屈用 `idle` 或 `ch1-standlook`，拷成仓库根目录 `tmp-idle.jpg`。提示词把手脚改成爪，不要让定稿的肉手盖掉豆。

最多两张。不要带界面截图。路径用英文目录，中文路径会 400。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth slightly open in a small smile. One eye closed wink. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail resting on the floor beside her.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms. Torso stays human. Beast parts are ears, paws, and tail.

SCALE: she is about 20cm tall. Her head is about as big as ONE adult fist. She sits on an adult floor you can walk into. Not a schoolchild on a white void.

{HAIR}
{EYES}
{OUTFIT}
{LIMBS}

{SUBJECT}

{CAMERA}
```

默认棉花坐零件（手脚除外，可换成别的定稿的头发衣服）：

```
HAIR: white raw-cotton hair, long, extremely fluffy, separate soft clumps. Bangs cover down to the eyebrows. Side hair sticks to the outer eye corners; almost no side of the face visible. Two LARGE pointed cat ears poke out of the cotton. Hair pools on the floor. She is NOT sitting on a hair stool.
EYES: huge round sky-blue gradient iris, two catchlights each.
OUTFIT: oversized mint-green knit cardigan, dress-length, swallows the mini torso. Small pink sneakers may peek under the W-sit, or bare fluffy paw-feet to match the hands. No camera bag.
LIMBS: both hands are matching fluffy cat paws. Pink-brown paw PADS face the camera. The beans are clearly visible. Not baby human fingers, not round hooves, not the back of the paw.
```

`{SUBJECT}`：

```
SHOW THE BEANS. Child W-sit on the floor: knees bent, feet out to both sides. Both arms raised at chest height toward the camera, pads first, like showing her beans. Wink, small open smile.
```

`{CAMERA}`：

```
CAMERA: slightly high, full sitting body. A real indoor floor with depth. Vertical 9:16. One mini character only. No UI, no watermark, no text.
```

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ
- [ ] 锁 examples/example-beans.png + 角色定稿；LIMBS 写成爪和肉垫
- [ ] 鸭子坐；双爪豆朝镜头；眨眼
- [ ] 20cm，能走进去的地；头发摊地上
- [ ] 不要小红书原图；不要默认婴儿手
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 能看清两只爪的肉垫
2. 鸭子坐，不是站着
3. 眨眼小笑
4. 人身，耳只长头顶
5. 没有 UI、没有白底空洞
