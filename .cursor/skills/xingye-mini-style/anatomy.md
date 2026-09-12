# 八条锁（两套画风共用）

光和色看 [styles.md](styles.md)。身子、脸、耳、衣、爪、毛、表情、眼睛看这里。每次出图 SUBJECT 里把这八条点名，不要只写「Q 版可爱」。

## 1. 面部

定稿：人脸，不是兽脸。圆饺子脸，额头大、下巴短，脸颊婴儿肥。鼻子一个点或没有。嘴是小孩那种小小的人嘴。腮红两团，有时扫到鼻梁。

怎么漂：猫吻、三瓣嘴、ω 嘴、裂唇、兽鼻、胡子、口鼻前突。样本里有，是走形。

写进 prompt：

```
Human toddler face only. Round dumpling face, huge forehead, short chin, heavy two-patch blush. Tiny dot nose or no nose. Tiny human mouth. No cat muzzle, no snout, no feline nose leather, no whiskers, no ω-mouth, no split lip.
```

## 2. 头身四肢比例

定稿：大头，短身子。脖子看不见。身子是**一小截**，被大一号衣服淹住，不是肥胖球体。胳膊短，袖子里只露小手。腿是短桩，常被衣服或鞋子吃掉。坐下、蹲下、钻盒时身子再缩，画面里几乎只剩头。

本地出图可以写大约 2～2.5 头身。豆包会强制往正常小孩收，大约 80% 就停，不要反复加头身数字去拧。

怎么漂：7 头身小孩；细长四肢；**圆球小胖子**（白毛衣胀成充气球，头安在球上）。行李箱背带、举信校服才是对的：衣服大，人很小。

写进 prompt：

```
Super-deformed chibi. Neck hidden. A SMALL short torso hidden inside oversized clothes — the clothes are big, she is tiny. Not a spherical fat belly, not obese, not an inflatable ball. Stubby arms and stubby legs. Not a normal child, not skinny fashion limbs.
```

## 3. 兽耳和头的比例

耳只长在头顶，从头发里戳出来。耳尖明显高于头顶。

| 谁 | 耳朵 | 和头比 |
| --- | --- | --- |
| 猫娘 | 一对偏大的尖三角猫耳，外侧跟毛色，内侧透粉 | 单耳高度大约是头（不含耳）的 **1/3～1/2**。行李箱、雪锅、举信那几张是这个尺度 |
| 鼠娘 | 一对偏大的圆盘鼠耳，粉、半透明 | 单耳宽度可以接近脸宽的一半，像两片圆。不要尖猫耳，不要小得像发饰 |

怎么漂：耳太小像发卡；耳涂成奶牛斑；长成牛角；侧头长耳；第三只耳。秋叶那张耳特别高，是极值，默认不要再加高。

写进 prompt（猫）：

```
Two LARGE pointed cat ears on top of the head only. Each ear is about one third to one half the height of the head. Pink translucent inner ears. Ear tips well above the crown. No horns, no extra ears, no markings on the ears.
```

写进 prompt（鼠）：

```
Two LARGE round mouse ears on top of the head only, pink and translucent, each almost half as wide as the face. Not pointed cat ears, not tiny hair-bow ears.
```

## 4. 衣服和鞋子

**随机配衣服是这套的精彩处。** 用户没指定衣服时，从下面衣橱抽一套，不要张张白毛衣。领口、纽扣、背带、蝴蝶结画清楚。衣服大一号，淹的是那一小截身子，不要把人胀成球。

衣橱（每次换一套）：

| 抽到 | 鞋 |
| --- | --- |
| 白衬衫 + 黄背带短裤 | 白圆头童鞋 |
| 粉裙校服 + 蓝领结 | 白短袜 + 黑玛丽珍 |
| 连体衣 | 自带脚套或小凉鞋 |
| 和风交领 / 浅色罩袍 | 可藏进衣摆，或不露脚 |
| 圣诞绿大衣 / 动物兜帽 | 白袜或小靴 |
| 星点 oversized 卫衣 + 短裤 | 白面包鞋 |
| 水手服 | 白童鞋或玛丽珍 |
| 破一点的 oversized 裙或袍 | 爪或童鞋，跟四肢开关走 |

**鞋子**站着必须画（或明确赤脚/爪）。幼童鞋，圆头，简单，略显大。

不要画：成人运动鞋鞋带、高跟、长筒靴拉链；也不要连续两张同一套衣服。

`{OUTFIT}` 例：

```
Outfit this time only: white shirt and yellow short overalls, oversized so they swallow her small torso. Chunky round-toe white toddler shoes, slightly too big on stubby legs. No adult sneakers, no laces, no heels.
```

## 5. 肉手 / 兽爪（必须写死，不要留给模型随机）

模型会随机把四肢漂成爪。skill 要先选定，再写进 SUBJECT。

| 用户说的 | 用哪套 | 怎么画 |
| --- | --- | --- |
| 没说、肉手 | **肉手**（默认） | 婴儿肥人手，短圆 3～4 指，没指甲。脚是童鞋或小肉脚 |
| 猫爪、兽爪、肉垫 | **兽爪** | 手脚同一套：短白/奶油色毛爪，肉垫，没有人手指。坐下裙摆下可以只露一对白爪脚（锁图书馆那张） |

不要一只人手一只爪。不要又画鞋又从鞋里伸出爪子。

肉手：

```
Tiny plump human baby hands, 3-4 short round fingers, no nails, no paw pads, no fur on the hands or feet.
```

兽爪：

```
All four limbs are matching animal paws: short creamy fur, paw pads, no human fingers, no shoes. Do not mix a human hand with a paw.
```

## 6. 发量和尾巴

头发当体积画，发量非常足。短发也是一朵云，不是贴头皮的薄发。可以有一缕呆毛。

尾巴跟物种走，不要统一加毛：

| 谁 | 尾巴 |
| --- | --- |
| 猫娘 | 相对身子很长，毛量非常足，蓬、软、根部粗。坐着从身后再绕出来 |
| 鼠娘 | **细、粉、没毛的老鼠尾**。保持没毛。不要画成猫尾，不要加绒 |

怎么漂：头发稀、一缕一缕像线稿；猫尾细得像绳子；鼠尾画成毛刷。

猫：

```
Very full fluffy hair painted as big color volumes, even if the cut is short. Thick fluffy cat tail, lots of fur, longer than the torso.
```

鼠：

```
Very full fluffy hair painted as volumes. Tail is a thin bare pink rat tail with NO fur. Do not fluff the tail. Do not give her a cat tail.
```

## 7. 表情和神态

默认不是笑点。看镜头或看手里的东西，像在发呆。

| 套 | 神态 | 嘴 |
| --- | --- | --- |
| 色彩 | 愣、轻怕、小小的吃惊、怕冷 | 一小条、小 o；雪窗那种微张露一点牙可以 |
| 多巴胺猫娘 | 呆、干净、一点点甜 | 一小条或小 o，可以一线微笑 |
| 多巴胺鼠娘 | 更张嘴、更 wow，仍是小孩吃惊不是狂欢 | 小圆嘴 |

不要：大笑、眯眼笑、怒、媚、露齿大Grin。

```
Expression: blank, dazed, shy, or tiny surprise. Looking at the camera or at a prop. Not a big smile, not laughing, not sexy, not angry.
```

## 8. 眼睛

每只眼睛大约占脸宽的三分之一，又圆又大。虹膜有柔和渐变，外圈略深。瞳孔圆，不要竖瞳（除非用户点名兽化）。高光至少两颗：上大、下小，像玻璃珠。上眼睑一条深色弧，不要浓妆眼线。

色彩：虹膜可以吃环境色（雪窗暖橙、夜书蓝）。多巴胺：更亮、更干净，蓝/绿/琥珀都可以，高光可以再多一颗星。

```
Exactly two eyes, never a third eye on the forehead. Huge round glossy eyes about one third of the face each. Soft gradient iris, dark rim, round pupil (no slit pupils). Two catchlights per eye, one large upper and one small lower. Wet glass-bead look. Simple upper lash arc, no heavy eyeliner.
```

「第三颗星高光」不要写成 third eye / third catchlight on the face，模型会在额头再长一只眼。
