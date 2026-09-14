---
name: mini-catgirl-wardrobe
description: >-
  Mini catgirl parts lane: isolated refs, random combo.
  Slots: hair, face, eyes, clothes, shoes, hood, light.
  Cotton hair is long, fluffy, in clumps, and can be sat on
  like a stool. Use when the user 衣柜, 连体衣, 兽耳兜帽, 开衫,
  棉花头发, 坐头发, 衣服另抽, 随机衣服, or 随机样式.
  Default look is 风格Ⅰ. Never write brand names into image prompts.
---

# 迷你猫娘衣柜

零件车道，不是新画风。默认画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。

参考图是这些元素每个一个独立的图片。之后生成图片的时候把这些元素随机组合，这样才会生成迷你猫娘那种随机的样式。不要把整只角色锁进来。

## 槽

| 调用名 | 槽 | 钉什么 | 零件 |
| --- | --- | --- | --- |
| **棉花坐** | 定稿 | 大尖耳、垂发盖住人耳、坐在自己的头发上、薄荷衫 | [parts/lock-cotton-cardigan.png](parts/lock-cotton-cardigan.png) |
| **棉花头** | 头发 | 棉花一样一大团，又长又蓬松，一团团的，可以当凳子坐 | [parts/hair-cotton.png](parts/hair-cotton.png) |
| **天蓝眼** | 眼睛 | 大圆蓝眼，软渐变，每只两个高光 | [parts/eyes-blue.png](parts/eyes-blue.png) |
| （无锁图） | 面部 | 饺子脸，大额头，短下巴，两团腮红，小 wow | 只写提示词。零件图容易长出侧人耳，不当锁图 |
| **云朵衣** | 衣服 | 婴儿连体衣，云朵点子，胸口两朵大云绒 | [parts/onesie-cloud.png](parts/onesie-cloud.png) |
| **薄荷衫** | 衣服 | 薄荷绿针织开衫，oversized 到裙长 | [parts/cardigan-mint.png](parts/cardigan-mint.png) |
| **白绒鞋** | 鞋 | 素白绒脚套，圆头 | [parts/shoes-cloud.png](parts/shoes-cloud.png) |
| **粉板鞋** | 鞋 | 粉运动鞋，白头白底，白短袜 | [parts/shoes-pink.png](parts/shoes-pink.png) |
| **云朵帽** | 兜帽 | 兽耳大兜帽，扣在脑袋上，偏大 | [parts/hood-cloud.png](parts/hood-cloud.png) |
| **日间光** | 光影 | 日间高调：顶光、bloom，阴影里有草绿/青 | [parts/light-daybloom.png](parts/light-daybloom.png) |

出图时每个该抽的槽各抽一件。用户点名某件就用那件。

## 定稿：棉花坐

[parts/lock-cotton-cardigan.png](parts/lock-cotton-cardigan.png)

调用名 **棉花坐**。已点头。出这套就锁这张：大尖猫耳、侧发盖住人耳、头发垂到地、坐在自己的头发上、薄荷衫、小短腿、粉板鞋。不要重出这张肖像。

抽到棉花头时：头发从脑袋垂到地上，她坐在自己的头发上。不要再扣兽耳大兜帽。不要画木头椅子。

`reference_image_paths` 最多两张。出棉花坐：定稿占一张，另一张给风格Ⅰ例图或零件。走云朵连体衣：风格Ⅰ例图 + 云朵衣，或云朵帽 + 云朵衣。不要两张都只给零件、把风格Ⅰ丢掉。不要带界面截图。路径用英文目录，中文路径会 400。

## 风格Ⅰ比例（每次出图都钉，不要只锁衣服）

对照风格Ⅰ例图，不要漂成普通小孩。

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 猫耳 | 大尖耳，从头发里明显戳出来，粉内耳 | 发卡小耳；只有两个小尖 |
| 腿 | 小短腿要看得见：腿短而肉，开衫下摆到鞋几乎没小腿 | 普通小孩长小腿；坐着只剩一双正常脚 |
| 人耳 | 两侧长毛贴住，把人耳完全盖住 | 脸颊两侧露出耳廓或耳点 |
| 眼 | 两只大圆眼占满脸中部，几乎顶到刘海 | 眼睛小小嵌在脸中间 |
| 遮脸 | 刘海压到眉毛；两侧长毛贴着眼角，几乎看不见两侧脸 | 露出大块额头、太阳穴、侧脸 |

## 棉花头（命根子）

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 质地 | 生棉花 / 棉花糖，一团团软绒 | 顺滑长直；贵宾犬卷；一条大尾巴 |
| 量 | 又长又蓬，从脑袋上倒下来，堆在地上 | 齐肩薄发；只有头顶一小撮 |
| 用法 | 她坐在自己的头发上，头发就是凳子。从脑袋到坐垫是同一坨 | 假发扣在短发上；后面另放一团垫子 |
| 耳 | 风格Ⅰ那种大尖耳从棉花里戳出来 | 发卡小耳；两侧人耳 |
| 光 | 顶上几乎曝白，底下绒团吃草绿/青 | 灰影子；夜巷冷蓝当默认 |

## 开衫套（这张立绘的其余零件）

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 衣服 | 薄荷绿针织开衫， oversized 到裙长，吞身子吞手，圆领，一排浅扣 | 合身外套；连帽衫 |
| 鞋 | 粉运动鞋，白头白底，白短袜 | 绒脚套；高筒靴 |
| 脸 | 饺子脸，大额头短下巴，两团腮红，小 wow 嘴 | 尖下巴；露齿笑；猫口鼻 |
| 眼 | 大圆眼，天蓝软渐变，每只两个高光 | 硬赛璐璐粗黑眼线 |
| 光 | 日间高调顶光，bloom，白仍有色，阴影里草绿/青 | 橱窗平光；纯白死光 |

云朵连体衣 / 白绒脚套 / 兽耳兜帽仍是另一套零件，见下。跨套可以拼：比如棉花头 + 云朵连体衣。

## 云朵套

| 钉什么 | 怎么认 | 不要学成 |
| --- | --- | --- |
| 连体衣形状 | 婴儿连体衣，裆掉下来，腿短而圆，袖子吞手 | 合身童装 |
| 鞋形状 | 素白绒脚套，圆头，没鞋带没胶底 | 球鞋；脚上再贴花 |
| 兜帽 | 白绒兽耳大兜帽，耳是帽子上的，开口里是暗腔 | 发卡小耳；再画一双真猫耳 |
| 花纹 | 软的三瓣云朵点子，绒进布里；胸口两朵大云绒 | 五瓣贴花 |
| 配色 | 卡其棕身子，乳白胸襟，白帽白鞋；点子粉 / 薄荷 / 黄油 / 天蓝 | 脏破迷彩 |

## 英文块

塞进风格Ⅰ模板。禁止写任何 App / 模型 / 官方画风商品名。按抽中的槽选用。

棉花头：

```
HAIR is the point: a huge volume of white hair like raw cotton, long, extremely fluffy, growing in soft separate clumps and tufts. It pours from the head and piles on the ground. She SITS ON her own hair as if it were a stool. Hair and seat are ONE mass. Bangs cover down to the eyebrows. Side hair is long and sticks to the outer corners of the eyes; almost no side of the face is visible; human ears fully buried. Two LARGE pointed cat ears poke out of the cotton, pink inner ears, same scale as 风格Ⅰ examples, not tiny nubs. One flyaway wisp at the crown. Not sleek hair, not poodle curls, not a tail, not a separate cloud chair.
```

开衫：

```
ONESIE slot / clothes: an oversized mint-green knit cardigan, dress-length, swallows the mini torso and hands. Round neck, one row of small pale buttons, soft sweater knit. Not fitted, not a hoodie.
```

粉鞋：

```
SHOES: small pink sneakers, white toe cap, white sole, short white socks. No logos.
```

眼睛：

```
EYES: two huge round glossy eyes, soft sky-blue gradient iris, two catchlights each, airbrushed, not hard cel lashes.
```

面部：

```
FACE: human toddler dumpling face, huge forehead, short chin, heavy two-patch blush, tiny wow mouth. Hair covers both sides of the head. NO human ears on the sides.
```

日间光：

```
LIGHT: high-key warm sun from above, bloom, light particles. Whites keep a little color. Underside shadows take green-cyan bounce, never gray.
```

云朵连体衣 / 兜帽 / 绒脚套仍用原来的那段衣服描写。

## 加新零件

新东西也按元素拆，不要丢整只立绘。

1. 只出这一件。
2. 英文路径，放进 `parts/`，文件名 `槽-名字.png`。
3. 在上表加一格。出图仍是各槽抽一件组合。

## QA

1. 出棉花坐用定稿，不要重出肖像
2. 抽到棉花头：坐在自己的头发上；没有大兜帽；没有木头椅子
3. 大尖猫耳；两侧没有人耳；刘海压眉，侧发贴眼角
4. 眼睛够大；小短腿看得见
5. 最多两张 `reference_image_paths`
6. 没有 UI
