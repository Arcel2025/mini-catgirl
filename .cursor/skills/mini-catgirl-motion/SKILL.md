---
name: mini-catgirl-motion
description: >-
  Mini catgirl comic-still motion: 抖动线条, 残影, 飞出物 on a frozen pose.
  Heavy-head body fail, 20cm scale. Use when 抖动, 残影, 飞出物, 埋脸吃,
  衣堆睡, 翻不过去, 手指拎, 漫画动感, Q版动作. Default look is 风格Ⅰ.
  Never write brand names into image prompts.
---

# 迷你猫娘·动感

动作车道，不是新画风。画风跟 [迷你猫娘风格Ⅰ](../mini-catgirl-style-1/SKILL.md)。人设先读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。衣服头发可跟 [衣柜](../mini-catgirl-wardrobe/SKILL.md) 另抽。

静态立绘。动感是埋脸吃那一套：抖动线条、残影、米粒飞出去。不是让她变帅。

**命根子：约 20cm。头占身高一半。四肢短。想动的时候头先走，身子跟着栽。**

已定稿十二张动作锁，见「锁图」。钉的是这一帧的动作、尺度、动感，不是锁图上的脏衣和豆帽。带 App 界面、水印、红框的截图不进 `reference_image_paths`。路径用英文目录，中文路径会 400。这个仓库路径是英文，可以直接锁 `examples/`。最多两张：一张本条动作锁，一张角色定稿。

## 每次开跑

```
- [ ] 读本文件 + 风格Ⅰ + mini-beast-girl
- [ ] 调用名：用户点了就用；没点按「场景选调用名」
- [ ] 表情：用户点了就用；没点用该动作绑死的脸
- [ ] 动感：动作戏写满三件（抖动、残影、飞出物）；睡和摊只歪帽垂尾
- [ ] 打开 [poses.md](poses.md)、[faces.md](faces.md)，把对应英文段贴进模板
- [ ] 该调用名已定稿：锁 examples 对应文件。未定稿不要锁别的动作图
- [ ] 换角色：动作锁占一张，角色定稿占一张
- [ ] GenerateImage。提示词不含品牌名。不锁界面截图。中文路径会 400
```

完成标准：提示词里已经有该调用名的英文段，有尺度对照（手、碗、桌、箱、池之一）。动作戏的 `{MOTION}` 里抖动、残影、飞出物三件都在。睡可以没有这三件，仍要帽子歪或尾巴垂。衣堆睡必须无泪。

## 身体

2 头身。头圆、重。身子是人。耳只长头顶。两侧不要人耳。四肢短。尾巴细，动作里晚一拍。猫耳随表情动：怕和哭时贴头，怒时炸。

站、跳、推、爬，默认写成失败。跌坐、趔趄、翻不过去、后翻，是她的常态，不是事故。

画幅没说就 3:4。桌面有手入画用 16:9。

锁图钉动作。手、衣、发跟风格Ⅰ / 衣柜 / 角色定稿，不要把锁图里的肉垫爪和豆帽学成物种。

## 锁图

已点头。出该调用名就锁对应那张。不要重出这张肖像。钉的是这一帧的动作、尺度、动感，不是发色和衣褶。

`reference_image_paths` 必须是英文路径。这个仓库路径是英文，直接锁 `examples/` 里那张。最多两张：这张动作锁，外加角色定稿。

| 调用名 | 锁 | 钉什么 |
| --- | --- | --- |
| 埋脸吃 | [examples/eat-faceplant.png](examples/eat-faceplant.png) | 脸埋碗。抖动。残影。米粒飞 |
| 手指拎 | [examples/pinched.png](examples/pinched.png) | 两指和她的体积差。腿蹬残影 |
| 抱巨大食物 | [examples/hug-food.png](examples/hug-food.png) | 橘子和她一样高。汁飞。使劲咬 |
| 要吃的 | [examples/reach-food.png](examples/reach-food.png) | 人手、橘子、她三层尺度。踮着够 |
| 跌坐 | [examples/sit-fall.png](examples/sit-fall.png) | 靴和桌腿旁跌坐。尘。头重 |
| 够不到 | [examples/cant-reach.png](examples/cant-reach.png) | 桌上浅影残影。橘子够不着 |
| 坐地喷泪 | [examples/wail.png](examples/wail.png) | 泪成弧。鞋旁尺度。嚎啕 |
| 探箱 | [examples/box.png](examples/box.png) | 纸箱探头扒沿。不忿哭 |
| 护帽 | [examples/guard-hat.png](examples/guard-hat.png) | 双手扣帽。指头压进来 |
| 高处下跌 | [examples/table-fall.png](examples/table-fall.png) | 桌沿当悬崖。帽滞后。吓哭 |
| 翻不过去 | [examples/cant-roll.png](examples/cant-roll.png) | 脸贴地。腿还在踢。头钉住翻不过去 |
| 衣堆睡 | [examples/laundry-nuzzle.png](examples/laundry-nuzzle.png) | 趴着。身子不动。只用脸蹭。闭眼笑。无泪 |

表里没有的调用名：只写提示词，点头再锁。不要拿上表一张去出另一张的动作。

## 场景选调用名

用户点了调用名，用那个。否则只选一个：

| 用户在说 | 调用名 | 绑死的脸 |
| --- | --- | --- |
| 吃、饿、埋进碗 | 埋脸吃 | 满足闭眼 |
| 吃的被拿、不够着、要挟 | 泪盯碗 或 要吃的 | 委屈哭 或 星星眼 |
| 抱比自己大的食物 | 抱巨大食物 | 使劲咬 |
| 被拎、被捏衣服 | 手指拎 | 愣 |
| 护帽、不行、负责到底 | 护帽 | 不忿哭 或 怒吼 |
| 帽掉了、扑回去 | 扑帽 | 吓哭 |
| 蹦、够、头太重 | 够不到 | 难过 |
| 打滚翻不过去 | 翻不过去 | 难过 |
| 探箱、扒沿、放我出来 | 探箱 | 不忿哭 |
| 站起来又坐下 | 跌坐 | 难过 |
| 从桌、沿、手里掉 | 高处下跌 | 吓哭 |
| 走两步摔 | 走摔 | 愣 |
| 被丢进盒、碗、锅 | 摊在容器里 | 嚎啕 或 空眼摊 |
| 哭、不要走、抱腿 | 坐地喷泪 或 飞扑 | 嚎啕 |
| 衣堆、玩衣服、蹭衣服 | 衣堆睡 | 蹭脸开心 |
| 睡、窝、毯子 | 小窝睡 或 枕蜷 | 闭眼睡 |
| 洗手池、浇水、搓 | 池里滑 / 浇水 / 搓头 | 愣 或 闭眼忍 |
| 怕、关门、黑 | 缩一团 | 怕 |

调用名的英文段在 [poses.md](poses.md)。脸的英文段在 [faces.md](faces.md)。

## 动感

范例是埋脸吃：头在碗里抖，上一口还留浅影，米粒往外飞。动作戏都按这三件写，换飞出物，不换语法。

- **抖动**：贴着头、肩、爪的短密振动线。身体在颤。不是背景上的英雄集中线。
- **残影**：上一拍的浅影，错开一点点，透明度低。吃是头在饭里一埋一抬；跳是起点还站着。
- **飞出物**：这一帧甩出去的东西。吃是米粒。哭是泪。摔是尘。怕是汗。够是空爪带起的渣。

埋脸吃，三件都在，动作戏拿这条当尺子：

```
MOTION: Short dense vibration hatch buzzing around the head and shoulders from chewing. A faint afterimage of the head one bob earlier, still in the rice. Loose rice grains flying out of the bowl in all directions.
```

别的场面从下表抄 `{MOTION}`。睡和摊不写这三件，只歪帽垂尾。静帧停在最高点或刚失败的那下。

| 场面 | `{MOTION}` |
| --- | --- |
| 吃 | `Short dense vibration hatch buzzing around the head and shoulders from chewing. A faint afterimage of the head one bob earlier, still in the food. Loose rice grains, crumbs, or juice flying out of the bowl.` |
| 哭 | `Vibration hatch on the head and shoulders from sobbing. A faint afterimage of the last head-throw. Tears flying out in arcs, maybe spit.` |
| 够、跳 | `Vibration hatch at the peak of the stretch. A faint afterimage of the last hop still on the table. Sweat and a speck of dust flying off. Head already tipping sideways.` |
| 摔、跌、丢 | `Vibration hatch at impact. A faint afterimage along the fall, heavy head leading. Dust puff and maybe a kicked grain flying off the floor.` |
| 拎、飞、悬在沿上 | `Vibration hatch on the dangling body. Afterimages of stubby legs still kicking. Sweat or rice grains flying off, hat lagging.` |
| 护帽、怒 | `Vibration hatch around the clenched paws and hat. A faint afterimage of a tiny punch that did not land. Spit fleck or a loose thread flying off. No power.` |
| 怕 | `Vibration hatch from shivering. A faint afterimage of the flinch backward. Cold sweat flying off the brow. Pupils tiny, ears glued down.` |
| 扑、抱腿 | `Vibration hatch at full stretch. A faint afterimage of the takeoff. Dust and cloth scraps flying behind, tail lagging on a diagonal.` |
| 蹭、玩衣服 | `Body still, prone. Short vibration hatch on the head only. A faint afterimage of the last head-rub, offset along the cheek. A few lint specks. Hands do not lift the cloth.` |
| 睡、摊 | `Hat askew, tail limp, maybe a drip of drool. No vibration hatch, no afterimage, no flying bits.` |

## 英文模板

禁止写 App / 模型 / 官方画风商品名。不要画手机界面或水印。

光、人身、衣发从风格Ⅰ英文模板抄到本提示词前面。`{WHO}` 用那套或衣柜 / 角色定稿，不要用锁图上的脏衣豆帽。

```
Chibi still of a mini catgirl about 20cm tall. Head is half her height and heavy. Human toddler body, stubby baby hands with three or four short rounded fingers. Thin cat tail. Two cat ears on top of the head only, no human ears on the sides. She moves like the head leads and the body fails to follow. Tiny in a real human-scale place. Not a realistic kitten, not a 6-head anime girl, not a whale-tailed maid, not a posed doll sitting neatly. Copy pose, scale, and motion marks from the lock, not the lock's costume.

{WHO}

{SHOT}

{FACE}

{MOTION}

One frozen comic frame: short dense vibration hatch on the moving part, a faint afterimage of the last beat, and flying bits matching the shot (rice, tears, sweat, or dust). No readable text, no UI, no watermark, no logos.
```

`{SHOT}` `{FACE}` `{MOTION}` 从本文件的表和两份参考里抄，不要空着。

尺度：画面里必须有一样大人世界的东西。手、木桌、碗、纸箱、洗手池、鞋，选场景里那个。她和那件东西比，才是 20cm。

## 不要锁进图里的

这些是源材料里的，不是迷你猫娘：

- 鱼尾、蓝女仆定妆、饼干上的英文
- 稳坐洗手池沿享受吹风
- 叉腰站稳、自己坐直吃完一碗
- B 站框、进度条、水印

有用的是：手指和她的体积差、脸埋进饭、泪喷成线、容器里摊平、衣服堆里只露圆背、摔倒骨架、伤心六脸、恐惧五步。

## QA

1. 头大约是身高一半。四肢短
2. 有尺度对照，能看出 20cm
3. 动作戏里她在失败或刚失败，不是站稳展示
4. 动作戏三件都在：抖动线条、残影、飞出物。埋脸吃必须看得到米粒在飞
5. 帽子、耳、尾跟得上表情
6. 没有 UI、没有可读字、没有鱼尾
