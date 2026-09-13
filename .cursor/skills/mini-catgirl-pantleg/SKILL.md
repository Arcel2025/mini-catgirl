---
name: mini-catgirl-pantleg
description: >-
  Generates mini catgirl illustrations in the 抱裤脚 action/scale lane:
  first-person down-look, she hugs an adult pant leg or cuff and looks
  up. Default look is 风格Ⅰ. Use when the user 抱裤腿, 抱裤脚, 缠腿,
  裤脚, 小奶猫抱腿, or drops a real kitten-hugging-pant photo to turn
  into a mini catgirl. Never write brand names into image prompts.
---

# 迷你猫娘抱裤脚

动作/比例车道，不是新画风。默认画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。

角色每次另锁：小委屈用 `idle` 或 `ch1-standlook`；其他猫娘用她自己的定稿。不要把现实奶猫的脸、别人的 AI 脸锁进来。

验收跟例图，不要再往「真奶猫那么小」里收。

## 这套是什么

从现实小奶猫抱人裤腿/裤脚的照片只蒸馏镜头和动作；大小跟例图。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 镜头 | 第一人称俯视或略俯：成人小腿、裤脚、鞋、地面占画面很大。不一定看见成人上半身 | 平视全身立绘；第三人称站旁边拍她 |
| 比例 | 跟例图：她约 20cm，整只大约等于一只成人手长；头大约一只拳头。抱在裤腿/裤脚上，抬头够得着 | 7 头身小孩；和大人膝盖一样高 |
| 祈求 | 脸贴裤料，两臂抱住大腿/裤腿，求留下。主例 [examples/example-plead-suit.png](examples/example-plead-suit.png)：西裤、皮鞋、眼泪汪汪、客厅 | 站旁边敬礼 |
| 怕生 | [examples/example-scared.png](examples/example-scared.png)：抬头看过来，像来了外人，抱着「我」的裤脚 | 笑着玩；四足真猫 |
| 物种 | 迷你人身 + 头顶猫耳 + 猫尾；默认婴儿肉手 | 猫科写实；人脸安在猫身上 |

兽只留猫耳、猫爪、猫尾。耳只长头顶，两侧不要人耳。没说就婴儿肉手，3～4 短圆指。

## 例图

- [examples/example-plead-suit.png](examples/example-plead-suit.png) 抱腿祈求，西裤皮鞋，眼泪汪汪，客厅。已合格
- [examples/example-plead.png](examples/example-plead.png) 抱腿祈求，便装动作底
- [examples/example-scared.png](examples/example-scared.png) 怕生抱裤脚

出图 `reference_image_paths` 最多两张：一张本条例图（或用户的裤脚对照），一张角色定稿。不要两张例图再加角色。不要带界面截图。路径用英文目录，中文路径会 400。

现实奶猫照片、别人的 AI 图不要进 `examples/`，也不要提交公开库，除非用户点头。

## 锁图

1. 对照拷到仓库根目录英文名 `tmp-pantleg.jpg`（例图，或没 UI 的脚自拍）。
2. 角色定稿拷成 `tmp-idle.jpg`。
3. 带框、带箭头的标注图只给人看，不当 `reference_image_paths`。
4. 带手机状态栏、评论区的截图只给人看；先裁出没 UI 的裤脚再当对照。

第一章游戏静帧若用这条：`9:16`，720×1280。先按五句问清镜头再出图（镜头、底图、位置、对照、只改什么）。只说「她很小」不够。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。不要写星野、Xingye、MiniMax、Talkie。

画风句跟风格Ⅰ。尺度写清裤脚和鞋，不要只写 she is tiny。

```
Soft colorful chibi illustration. The point is colored light: environment color physically bounces onto skin, hair, and clothes. Warm key light against cool colored shadows (blue or violet, never gray). Glowing rim light on hair and ear edges. Translucent pink inner ears when backlit. Bloom, light particles, shallow depth of field, bokeh. Soft slight outlines in darkened local color, airbrushed gradients. Not oil impasto, not cel-shading, not thick black sticker lines, not photoreal, not high-key candy-pop. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth. No cat muzzle, no whiskers. No human face glued onto a housecat body.

Exactly two huge round glossy eyes, two catchlights each. Soft gradient iris.

Two LARGE pointed cat ears on top of the head only, pink inner ears. Hair covers both sides of the head. NO human ears on the sides. Thick fluffy cat tail.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN torso hidden inside oversized clothes. Stubby arms and stubby legs. Not a cat torso, not a quadruped kitten, not photoreal felid, not a 7-head teen.

SCALE: she is about 20cm tall. Her whole body from ear-tips to toes is about as long as ONE adult hand, wrist to fingertip. Her head is about as big as ONE adult fist. She hugs the adult pant leg or cuff and looks up; same size as the plead/scared examples. Not a teen standing beside a knee.

{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}

{SUBJECT}

CAMERA: first-person looking down or slightly down at your own leg. Visible: pant leg, shoe, floor. Adult torso and face usually out of frame. A real navigable indoor floor with depth, not a pattern wallpaper. Vertical 9:16. One mini character only. No UI, no watermark, no text.
```

默认 `{LIMBS}`：

```
Tiny plump human baby hands and feet, THREE or FOUR short rounded fingers, no nails. Both arms wrap the pant fabric.
```

默认 `{SUBJECT}`（祈求，跟 example-plead-suit）：

```
FIRST-PERSON down-look. An adult lower leg in dark dress trousers and a leather dress shoe fills much of the frame. Home living room behind: sofa, lamp, floor you can walk into. The mini catgirl hugs the thigh/calf cloth with both stubby arms. Her dumpling face is pressed into the fabric, watery teary eyes, pleading to be kept. One eye may squint against the cloth.
```

便装祈求改锁 [examples/example-plead.png](examples/example-plead.png)，裤子鞋子跟用户。

怕生 `{SUBJECT}`（跟 example-scared）：

```
FIRST-PERSON down-look at your own pant cuff and shoe. The mini catgirl holds the pant leg with both arms and looks up toward "me", wary, as if a stranger just arrived.
```

## 每次开跑

```
- [ ] 读人设 + 风格Ⅰ
- [ ] 祈求锁 example-plead-suit（眼泪汪汪西裤）或 example-plead（便装）；怕生锁 example-scared。只带一张
- [ ] 角色另锁：拷成 tmp-idle.jpg
- [ ] 用户另给裤脚对照则拷成 tmp-pantleg.jpg，替换例图那张
- [ ] reference_image_paths 只两张
- [ ] 提示词写清裤脚/鞋/手长，不写品牌名
- [ ] 第一章静帧：先对五句；9:16
```

## QA

1. 跟例图：俯视裤腿、鞋、地面；她抱着腿或裤脚抬头
2. 尺度跟例图，不要再往更小收
3. 祈求是脸贴裤料、求留下；要眼泪汪汪时跟 example-plead-suit。怕生是抬头看过来、像来了外人
4. 人身，耳只长头顶；婴儿肉手
5. 没有 UI；不是四足真猫；不是人脸安在猫身上
