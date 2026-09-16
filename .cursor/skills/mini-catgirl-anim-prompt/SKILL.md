---
name: mini-catgirl-anim-prompt
description: >-
  Writes copy-paste animation and sprite-sheet prompts for other image
  models (Gemini, 豆包, and similar) to make 迷你猫娘 daily stickers.
  给其他大模型生成动画的提示词，比如给gemini，豆包之类的.
  Use when the user Gemini, 豆包, 其他大模型, 分解帧, 贴纸动画,
  sprite sheet, or asks for animation prompts Cursor should not generate.
  Never write art-preset brand names into those prompts.
---

# 迷你猫娘贴纸动画提示词

给其他大模型生成动画的提示词，比如给 Gemini、豆包之类的。

本 skill **不**调用 Cursor `GenerateImage`。写好提示词交给用户去跑。图回来之后再拆帧、垫画布、跑检查。9:16 剧情静帧走 [风格Ⅰ](../mini-catgirl-style-1/SKILL.md)，不要混进这里。

人设 [mini-beast-girl](../mini-beast-girl/SKILL.md)。画布和进游戏手续见 [html日常.md](../../../养成游戏-迷你猫娘-小委屈/html日常.md)。

## 这套是什么

网页日常贴纸：透明底全身、同一尺度、房间里换帧。不是分镜海报，不是 Live2D。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 锁 | 角色锁 `web/assets/stand.png`。侧面循环可再锁一张 `walk-1.png` | 锁别人的脸；锁风格Ⅰ例图当全身尺度 |
| 底 | 纯绿 `#00FF00` 或纯黑。回来再抠 | 要模型直接出透明底；把客厅画进贴纸 |
| 尺 | 全身。脚靠近格底。每帧头一样大 | 特写；一帧头大一帧头小 |
| 向 | 只出朝右。朝左用 CSS 翻转 | 同一条循环出左右两套 |
| 帧 | 循环难、帧对不齐就 1 张动感静帧，网页平移。循环最多 2～4 帧 | 硬拆循环导致头发残影；8 帧骨骼；一次出十二个动作 |

进游戏前画布必须是 `864×1152`，脚离底约 12px，头宽跟 `stand.png` 接近。模型出不了这张画布。拆完用 `python web/check_stickers.py`（可 `--normalize`）。差过就打回，不要先写进 `app.js`。

## 每次开跑

一次只做一个动作。用户没点名就先问是贴纸还是风格Ⅰ例图。例图停。

```
- [ ] 一句话写清：循环、状态，还是动感静帧+平移
- [ ] 难做动画或上一张循环有残影：先交 1 张静帧，不要分解帧
- [ ] 提示词里写上：贴 stand.png（侧面再贴 walk-1.png）
- [ ] 先交关键姿势提示词。用户点头才考虑分解帧
- [ ] 提示词不含星野、官方画风商品名、UI、水印
- [ ] 图回来：静帧垫 864×1152；循环才拆帧。跑 check_stickers.py
- [ ] 用户点头再改 app.js
```

小委屈日常不要写头重摔跤、墩回去。那套留给别的迷你猫娘。第一章 `ch1-fall` 不重出。

真人猫片、幼儿走路片只给人看节奏，不当角色锁。

## 提示词

Gemini 用英文。豆包可把同一段换成中文，意思不要改。用户把锁图贴进对话。

### 角色锁（每段都带）

```
Same character as the reference. Do not change the face, short cow-print hair, pink cat ears on top of the head only, red collar with a gold bell, oversized white T-shirt, stubby human hands and feet, or the chibi proportions. No human ears on the sides. No whiskers. No cat muzzle.

Full-body chibi sprite. Camera matching the reference. Feet near the bottom. Head about as wide as in the reference. Flat solid green background #00FF00. No room, no furniture, no floor, no cinematic lighting, no extra characters, no text, no UI.

One character only. Not a portrait crop. Not a different outfit.
```

中文：

```
角色必须和参考图是同一只。脸、奶牛短发、头顶粉猫耳、红项圈金铃、过大白 T、短肉手短肉脚、Q 版比例都不要改。头两侧不要人耳。不要胡须，不要猫吻。

全身贴纸。镜头跟参考图一致。脚靠近格子底部。头宽和参考图接近。纯绿底 #00FF00。不要房间、家具、地板、电影光、第二个角色、字、界面。

只有一只。不要裁成肖像。不要换衣服。
```

### 关键姿势

角色锁后面接一句 `Pose: …`。出一张。用户点头再要分解帧。

### 分解帧

角色锁后面接：

```
SPRITE SHEET of the SAME character as the reference. {N} frames in one horizontal row, equal cell size. Same body scale and head size in every cell. Feet planted at the same height. Flat solid green background #00FF00. No room.

{ACTION}
```

中文：

```
同一只角色的分解表。横排 {N} 帧，格子一样大。每帧身体和头一样大。脚在同一高度。纯绿底 #00FF00。不要房间。

{动作}
```

对不上 `stand.png` 的脸或头就丢掉，不要凑合垫画布。

## 动作句

把 `{ACTION}` / `{动作}` 换成其中一段。没有的动作用同一句式新写，仍 2～4 帧。

**走（4 帧，补中间帧时用；现成 walk 能挪就先别重出）**

```
Walk cycle, 4 frames, side view facing RIGHT, short toddler steps, small arm swing. Frame 1 left-foot contact, frame 2 passing, frame 3 right-foot contact, frame 4 passing. Keep the head height stable. Do not turn it into a run.
```

```
走路循环，4 帧，侧面朝右，幼儿短步，小幅摆臂。1 左脚撑地 2 经过 3 右脚撑地 4 经过。头高度不要跳。不要画成跑。
```

**吃（2 帧咀嚼；已有一张坐吃可在那张上拆）**

```
Sitting, hugging the food bowl, 2 frames of chewing. The bowl stays the same size. Do not stand up.
```

```
坐着抱碗，两帧咀嚼。碗大小不变。不要站起来。
```

**被摸（点她才像摸到）**

```
Standing, being petted. Neck tucked, eyes almost closed, bell on the collar slightly swung. 2 frames, small change only.
```

```
站着被摸。缩脖子，眼几乎闭上，项圈铃铛轻轻晃。2 帧，只改一点。
```

**地毯睡（不是饿趴）**

```
Curled asleep on an invisible floor, eyes closed, peaceful. 1 or 2 frames. Not collapsed from hunger. Not a face close-up.
```

```
在看不见的地面上蜷着睡，闭眼，安稳。1 或 2 帧。不是饿到趴下。不要脸特写。
```

**箱里坐**

```
Sitting inside a small cardboard box that is her nest, whole body visible, looking up. 1 frame. Box about her sitting size.
```

```
坐在当窝的小纸箱里，整只看得见，抬头看。1 帧。箱子大约她坐着那么大。
```

**玩具（拍或抱，2 帧）**

```
On the floor with one small toy, 2-frame loop: reach and hug, or bat twice. Toy stays the same object. No extra toys.
```

```
地上一件小玩具，2 帧循环：伸手抱，或拍两下。还是那一件玩具。不要一堆。
```

**护项圈**

```
Standing, both stubby hands covering the red collar and bell, worried. 1 frame.
```

```
站着，两只短手按住红项圈和铃铛，担心。1 帧。
```

**摔趴**

```
Fallen on her stomach, head toward camera, whole tiny body visible. 1 frame. Same scale as standing. Not a 9:16 story still.
```

```
趴着摔在地上，头朝镜头，整只小身子都在。1 帧。和站姿同一尺度。不要做成 9:16 剧情图。
```

**舔嘴唇**

```
Standing, tiny tongue licking dry lips. 1 frame.
```

```
站着，小舌头舔干嘴唇。1 帧。
```

跑已经有四帧，先别重出。朝左不要出。

## 日常还缺什么

已经能用：站、坐、走、跑、喘气、作揖、吃饭、饿趴。骨架有了，一天还没圆。

小委屈先补：湿毛巾擦拭（护项圈）、拖动静帧、逗一逗享受。默认动感静帧，网页平移。不要摔趴。

物种通用以后才是：箱里坐、一件玩具、舔嘴唇。吃的两帧咀嚼、走的中间帧，有空再补。

先不要做：茶几底钻、喝水条、厕所洗澡、多房间空景、出门街景。

## 图回来

1. 按格切开，一帧一张。
2. `python check_stickers.py --normalize` 再 `python check_stickers.py`。
3. 头宽占画布和 `stand.png` 差过 12%、脚没贴底、画布不是 `864×1152`：打回。
4. 用户点头再登记 `app.js` 的循环表。

## QA

1. 提示词交给用户去跑，没有调用 Cursor 出图
2. 锁的是 `stand.png`，不是别人的脸
3. 绿底全身，没有房间
4. 只朝右。循环才 2～4 帧；难做就 1 张静帧
5. 没有官方画风商品名
6. 没点头的图没有进游戏
