---
name: mini-catgirl-style-2
description: >-
  Generates mini catgirl illustrations in 迷你猫娘风格Ⅱ:
  基因更接近正常猫娘幼仔的迷你猫娘. Even merch-window light, porcelain-doll
  watercolor, often a treasure held at the chest or framed in a
  cup/box/bag. Use when the user 风格Ⅱ, 风格2, 迷你猫娘风格Ⅱ,
  洛丽塔, 抱猫, or 抱玩偶. Never write brand names into image prompts.
---

# 迷你猫娘风格Ⅱ

基因更接近正常猫娘幼仔的迷你猫娘。

先读 [mini-catgirl-body](../mini-catgirl-body/SKILL.md)，再套本套。旧名「洛丽塔」指向这里，不要再开 `mini-catgirl-lolita`。

比色彩更接近正常猫娘幼仔：头仍偏大，站着大约 **2.5～3 头身**，不是雪锅那种头占大半，也不是 7 头身。耳是幼猫耳，不是发卡，也不是雪锅巨耳。

衣发眼表情从 [wardrobe.md](../mini-catgirl-body/wardrobe.md) 另抽。没说空手时，默认胸前有一只小珍宝（白猫、布偶、或相对过大的食物）。

## 这套是什么

和色彩的差别是光和基因：这里是**橱窗平光**，白还是白；身子更接近正常幼仔。和多巴胺的差别是色：这里干净、偏瓷，不是马卡龙色场和黄星。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 基因 | 正常猫娘幼仔：2.5～3 头，短身仍在 | 色彩雪锅头占大半；7 头身大衣女 |
| 光 | 均匀、干净、像展柜 | 色彩冷暖对切；夜雨电影光 |
| 皮 | 水彩纸感、瓷、浅浅轮廓 | 3D 手办；油画厚涂；粗黑贴纸 |
| 构图 | 她是展品。常钻杯/桶/盒，或把珍宝捧在胸前 | 空手走夜巷当默认 |
| 珍宝 | 小白猫、黑猫、兔玩偶、三明治，比头小 | 第二只迷你猫娘抢脸 |
| 衣服 | 干净娃娃衣：水手、女仆、卫衣、白裙 | 破布、脏污 |
| 神态 | 愣、小 o、一线笑 | 媚、怒、哭花妆 |

## 四只定稿

锁图在 [locks/](locks/)。对外主参考是 [sheets/](sheets/) 角色设定图。没点头不要重出这四张肖像。

| 谁 | 肖像 | 设定图 | 身份 |
| --- | --- | --- | --- |
| 水手 | `locks/lock-sailor.png` | `sheets/sheet-sailor.png` | 粉波波头、薄荷眼、奶油水手服、抱白猫 |
| 女仆 | `locks/lock-maid.png` | `sheets/sheet-maid.png` | 褐短发、玫瑰眼、海军女仆、坐进白礼盒抱黑猫 |
| 卫衣 | `locks/lock-hoodie.png` | `sheets/sheet-hoodie.png` | 褐双马尾、琥珀眼含泪、白卫衣、抱蓝兔 |
| 茶杯 | `locks/lock-tea.png` | `sheets/sheet-tea.png` | 银长卷、蓝眼一线嘴、白裙、坐进玫瑰茶杯抱三明治 |

出新图：质感、头身锁这四只。衣服发型可以另抽，不要把色彩雪锅/探箱带进 `reference_image_paths`。

设定图版式只借 [sheet-format](../mini-beast-girl/sheet-format/README.md)，不借里面的大衣女、披风人。

## 英文模板

禁止写任何 App / 模型 / 官方画风商品名。

```
2D porcelain-doll watercolor chibi, not 3D, not CGI, not a vinyl figure. Even clean merch-window lighting, pale porcelain skin, faint paper grain, soft slight outlines, matte airbrush. Cream, white, blush pink, powder blue, small navy or black ribbon accents. Whites stay white. No colored-light split on the face, no candy-star wallpaper, no cinematic oil paint, no thick sticker lines, no photoreal. Do not name any app, model, or commercial art preset.

A mini catgirl cub closer to a normal kitten-girl child: about 2.5 to 3 heads tall standing, large head, short torso, neck hidden. Not an extreme head-most-of-height squash, not a 3-to-4-head schoolkid, not a 7-head teen, not an inflatable fat ball. Stubby arms and stubby legs. Clothes a bit oversized.

Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny dot nose. Tiny human mouth. No cat muzzle, no whiskers, no ω-mouth.

Exactly two eyes. Huge round glossy doll eyes. Wet glass-bead, two catchlights per eye.

Two pointed cat ears on top of the head only, each about one third the head height, pink inner ears. Ear tips above the crown. Very full fluffy hair painted as volumes. Thick fluffy cat tail.

{HAIR}
{EYES}
{EXPRESSION}
{OUTFIT}
{LIMBS}

{TREASURE}

{SUBJECT}

Centered display-window composition. Soft pale paper background, or a clean container used as a showcase. Vertical 9:16. One mini catgirl only. No UI, no watermark, no text.
```

默认 `{TREASURE}`：

```
She holds a tiny white kitten or small plush hugged to her chest under the chin, like a cherished toy, much smaller than her head. Not a second girl.
```

空手：删掉 `{TREASURE}`。

## 每次开跑

```
- [ ] 读身子锁
- [ ] 风格Ⅱ：正常猫娘幼仔，2.5～3 头；水彩瓷、橱窗平光
- [ ] 珍宝：抱猫 / 抱玩偶 / 用户说的空手
- [ ] 衣服发型瞳色表情另抽（已定稿四只不要重出肖像）
- [ ] reference 用 locks/ 或 sheets/，不带色彩雪锅
- [ ] GenerateImage 9:16；提示词不含品牌名
```

## QA

1. 仍是迷你幼仔，不是 7 头身，也不是色彩那种头占大半
2. 光是平的，脸没有冷暖对切
3. 水彩纸感，不是塑料手办
4. 人脸，耳只长头顶
5. 没有 UI

## 不要

- 提示词写品牌名
- 把星野原图、带 App UI 的图推进公开库或传外站
- 用色彩雪锅/探箱当本套质感锁
- 重出已定稿四只肖像
