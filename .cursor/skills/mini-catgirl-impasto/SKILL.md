---
name: mini-catgirl-impasto
description: >-
  Generates mini catgirl illustrations in the 厚涂 lane: almost-lineless
  cinematic light, shallow depth of field, airbrushed volume. Beast parts
  are only cat ears, optional cat paws, and cat tail; the rest is human.
  Use when the user 厚涂 or asks for that painterly look. Never write
  brand names into image prompts.
---

# 迷你猫娘·厚涂

人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。

线几乎化掉，光像打灯，体积像喷枪。浅景深。

兽只留三处：**猫耳、猫爪、猫尾**。其余必须是人：脸、脖子、身子、胳膊。两侧不要人耳。不要把人脸安在猫身上。

衣服、发型、瞳色每次另抽。没说就完全人身（肉手）。表情锁例图那张小 wow。

## 例图

- [examples/example-human.png](examples/example-human.png) 完全人身，黄背带，小肉手，小 wow
- [examples/example-paws.png](examples/example-paws.png) 人身猫爪，绿卫衣坐
- [examples/example-sailor.png](examples/example-sailor.png) 人身猫爪，蓝发水手

出图 `reference_image_paths` 最多两张：人身或人身猫爪里选一张当风格锁，角色另有定稿再加一张。不要三张例图一起塞。不要带界面截图。路径用英文目录，中文路径会 400。

## 这套是什么

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 画 | 线淡、电影光、喷枪体积 | 白底瓷娃娃；糖果星星墙 |
| 兽 | 只有耳、爪、尾 | 人脸安在猫身上 |
| 脸 | 小 wow，圆嘴，湿玻璃珠眼 | 委屈撇嘴；一线笑；两侧人耳 |
| 完全人身 | 人身 + 猫耳 + 猫尾 + 肉手 | — |
| 人身猫爪 | 仍是人身，只换手脚 | 圆蹄子；人身手混一只爪 |

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。不要画手机界面或水印。

```
Painterly chibi illustration. Almost no outlines. Cinematic lighting, strong key light, cool fill, shallow depth of field, creamy airbrushed skin like soft spray-paint. Hair and clothes read as volumes, not line art. Bloom around lights, bokeh background. Not cel-shading, not thick sticker lines, not high-key candy-pop, not photoreal live-action. Do not name any app, model, or commercial art preset.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny human mouth. No cat muzzle, no whiskers.

Expression: small round wow mouth slightly open, wet glossy eyes looking at camera. Not a frown, not a line smile.

Two LARGE pointed cat ears on top of the head only. Hair covers both sides of the head. NO human ears on the sides. No extra ears, no horns.

Super-deformed chibi. Neck hidden. A SMALL short HUMAN toddler torso hidden inside oversized clothes. Stubby human arms. Beast parts are ONLY ears, optional paws, and tail. Not a cat torso, not a human head glued on a housecat, not a 3-to-4-head schoolkid, not a 7-head teen.

{HAIR}
{EYES}
{OUTFIT}
{LIMBS}

{SUBJECT}

A real space with depth and atmosphere. Character centered slightly low. Vertical 9:16. One mini character only. No UI, no watermark, no text.
```

完全人身 `{LIMBS}`（默认）：

```
Tiny plump human baby hands and feet, 3-4 short round fingers, no nails.
```

人身猫爪 `{LIMBS}`：

```
Human toddler body standing or sitting. All four limbs are matching fluffy cat paws, no shoes. Torso and upper arms stay human. Do not mix a human hand with a paw.
```

## QA

1. 线淡，光像电影
2. 兽只有耳、爪（若点了）、尾；身子是人
3. 不是人脸安在猫身上
4. 小 wow；两侧没有人耳
5. 没有 UI
