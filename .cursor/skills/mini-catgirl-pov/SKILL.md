---
name: mini-catgirl-pov
description: >-
  Generates mini catgirl illustrations in the first-person touch lane:
  she lies on an adult pillow looking up at "you", or your adult hands
  cup her dumpling cheeks. Default look is 风格Ⅰ. Use when the user
  第一视角, 趴枕, 趴枕头, 捧脸, 捏脸, 成人手, or 人和猫娘互动.
  Never write brand names into image prompts.
---

# 迷你猫娘第一视角

动作/比例车道，不是新画风。默认画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。角色默认 [棉花坐](../mini-catgirl-wardrobe/SKILL.md)。

从别人的平涂 AI 图只蒸馏镜头和动作。脸、衣服、光跟风格Ⅰ / 角色定稿。小红书截图、水印图不要进 `examples/`，也不要当 `reference_image_paths`。

两条都已点头。出哪套就锁哪张，不要重出那张肖像。钉的是动作，不是那张脸。

尺度跟风格Ⅰ：约 20cm，整只 ≈ 一只成人手长，头 ≈ 一只拳头。兽只留猫耳、猫尾。耳只长头顶，两侧不要人耳。没说就婴儿肉手，3～4 短圆指。

## 定稿：趴枕

[examples/example-pillow.png](examples/example-pillow.png)

调用名 **趴枕**。已点头。出这套就锁这张。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 镜头 | 第一人称略俯近景，她脸朝你 | 鸟瞰整只趴在床上；全身站立 |
| 枕 | 下巴和上身压在成人枕的近侧；小肉手扒在枕面上 | 脑袋和枕头一样宽的装饰枕 |
| 身子 | 看见头、肩、两只短臂；腿藏在枕后。尾巴竖在脑袋后面 | 整条身子趴满枕面；坐在头发凳上 |
| 表情 | 睁眼看你，小嘴微笑 | 没点名不要改成眯眼或哭 |

换角色：定稿占一张锁动作，另一张给她自己的定稿。枕头、趴法、尾巴不要改。

## 定稿：捧脸

[examples/example-cheeks.png](examples/example-cheeks.png)

调用名 **捧脸**。已点头。出这套就锁这张。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 镜头 | 第一人称近景。两只成人手从画面下方进来 | 第三人称站旁边；看见成人脸或上半身 |
| 手 | 整掌从下方包住下颌和两边脸，像捧包子 | 两指戳腮；她自己的手捧自己 |
| 脸肉 | 两坨脸肉跟着手挤变形：掌心按进去，肉往上、往外鼓 | 脸还是平面，只有两团没变形的腮红 |
| 表情 | 眯眼开心，月牙眼，小弯嘴 | 睁眼看镜头（没点名别换） |
| 尺子 | 她自己的婴儿肉手可在胸口露出来；头 ≈ 一只成人拳头 | 成人手和她脑袋一样大 |

换角色：定稿占一张锁动作，另一张给她自己的定稿。衣服、头发跟那只猫娘。手、脸肉变形、眯眼不要改。

## 例图

- [examples/example-pillow.png](examples/example-pillow.png) 趴枕定稿。已点头
- [examples/example-cheeks.png](examples/example-cheeks.png) 捧脸定稿。已点头

出图 `reference_image_paths` 最多两张：本条定稿 + 角色定稿。同一只棉花坐可以定稿 + 一张风格Ⅰ例图。不要带小红书原图。不要带界面截图。路径用英文目录，中文路径会 400。

## 锁图

1. 趴枕定稿：`examples/example-pillow.png`。
2. 捧脸定稿：`examples/example-cheeks.png`。
3. 换角色时第二张拷成 `tmp-idle.jpg`。同一只棉花坐：定稿 + 风格Ⅰ例图即可。
4. 小红书原图、带水印、带箭头的标注只给人看，不当参考。

趴枕时不要再逼「坐在自己的头发上」。头发仍是棉花长绒，摊在枕和床单上。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。不要写星野、Xingye、MiniMax、Talkie。

画风句跟风格Ⅰ。尺度写清枕头或成人手，不要只写 she is tiny。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm bedroom lamp key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop, not a flat pink void. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth. No cat muzzle, no whiskers.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a 7-head teen.

SCALE: she is about 20cm tall. Her whole body is about as long as ONE adult hand, wrist to fingertip. Her head is about as big as ONE adult fist.

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
HAIR: white raw-cotton hair, long, extremely fluffy, separate soft clumps. Bangs cover down to the eyebrows. Side hair sticks to the outer eye corners; almost no side of the face visible. Two LARGE pointed cat ears poke out of the cotton.
EYES: huge round sky-blue gradient iris, two catchlights each.
OUTFIT: oversized mint-green knit cardigan, dress-length, swallows the mini torso.
LIMBS: tiny plump human baby hands, THREE or FOUR short rounded fingers, no nails.
```

### 趴枕 `{SUBJECT}`

```
PILLOW-PRONE. FIRST-PERSON: you lean over a real bed and look slightly down at her face. She is tiny on an ADULT-SIZED pillow. Her dumpling chin and upper chest rest on the NEAR part of the pillow. Two stubby baby arms lie on the pillow, hands on the front. Head, shoulders, and short arms visible; legs hidden behind the pillow. A thick fluffy cat tail hooks upward behind her head. She looks at YOU with open eyes and a small smile. Cotton hair pools on the pillow and sheets. Not a full-body bird's-eye prone. Not sitting on a hair stool.
```

### 趴枕 `{CAMERA}`

```
CAMERA: first-person, slightly high, close to the pillow. Visible: adult pillow, rumpled bed sheet, a real bedroom you can walk into (headboard, warm lamp). Square 1:1 unless the user asks otherwise. One mini character only. No adult face. No UI, no watermark, no text.
```

### 捧脸 `{SUBJECT}`

```
CHEEK-CUP. FIRST-PERSON: TWO LARGE ADULT HUMAN HANDS enter from the BOTTOM of the frame — the viewer's own hands, not hers. Full palms wrap the jaw and both cheeks from below, like holding a bun. The TWO CHEEK MEAT BLOBS physically squash and bulge: flesh deforms under the palms, pushed inward then puffed out above the fingers. Not flat blush painted on an undeformed face.

Default expression: happy SQUINTING closed crescent eyes, small curved smile. Enjoying being held.

Her head is about ONE adult fist, so the two adult hands look huge. Her own tiny baby hands may peek at her chest, smaller than one adult finger. Adult torso and face OUT of frame.

NOT her own hands on her face. NOT two fingertips poking the cheeks. NOT open eyes looking at camera unless the user asks.
```

### 捧脸 `{CAMERA}`

```
CAMERA: first-person close-up of her face and your hands. Warm real bedroom behind, shallow depth of field. Square 1:1 unless the user asks otherwise. One mini character only. No UI, no watermark, no text.
```

默认表情是眯眼开心。另抽才换：半眼看你 / 眼瞟旁边。手、尺度、脸肉变形不动。

## 每次开跑

```
- [ ] 读人设 + 风格Ⅰ + 本文件
- [ ] 趴枕：锁 example-pillow。已点头，不要重出这张
- [ ] 趴枕提示词：下巴压近侧枕，短臂扒枕，腿藏后面，尾巴竖着，睁眼看你。禁止 lying on the bed / full-body prone
- [ ] 捧脸：锁 example-cheeks。已点头，不要重出这张
- [ ] 捧脸提示词：整掌从下方包住；两坨脸肉挤变形鼓出来；眯眼开心。禁止 two fingertips poke；禁止脸不变形只贴腮红
- [ ] 一张定稿 + 一张角色定稿。默认棉花坐
- [ ] 不要两套动作叠一张
- [ ] 不要把小红书原图塞进 reference_image_paths
- [ ] 提示词写清枕头比她大 / 成人手比她头大，不写品牌名
- [ ] 1:1，除非用户要 9:16
```

## QA

1. 趴枕跟定稿：下巴压近侧枕，短臂扒枕，腿藏后面，尾巴竖着，睁眼看你。不是鸟瞰整只趴上去
2. 捧脸跟定稿：手从下方整掌包住；两坨脸肉挤变形鼓出来；眯眼开心
3. 捧脸不是她自己捧自己；不是两指戳腮；不是平面腮红
4. 她约 20cm：头 ≈ 拳头；枕头是成人枕；捧脸时成人手明显更大
5. 人身，耳只长头顶；婴儿肉手；刘海压眉，侧发盖住人耳
6. 背景是卧室这种能走进去的地方，不是纯色粉墙
7. 没有 UI、没有水印
