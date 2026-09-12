---
name: desk-pet
description: >-
  Makes or extends the raising-window pets in this workspace (养成桌宠/)
  with Cursor GenerateImage, candidate PNGs, red-green overlay QA, and
  offscreen tests. Use when the user 做桌宠, 加互动, 出立绘, 出图, 孵桌宠, 养成桌宠,
  or asks to hatch a desk pet. Not Codex hatch-pet. This repo has no 紫猫/白鼬 folders.
---

# Desk pet

这是 Cursor 能跑的出图和养成工序。出图用 `cursor` 命名空间的 `GenerateImage`。动画是一张静帧加窗口/精灵里拧，不是 8×9 图集，也不是 Codex `$hatch-pet` / `$imagegen`。

人设、叠字、定型 vs 还能教，读 [mini-beast-girl](../mini-beast-girl/SKILL.md)。已认可画风、禁图只活在 `.cursor/rules/` 里。这里不抄数字。出图先读画风规则。

这个仓库没有 `桌宠/`（紫猫）和 `迷你白鼬娘/`。不要去编那两个目录，也不要把迷你猫娘插画当成紫猫补图。

## 每次开跑

按顺序做。哪一步的完成条件没到，就停在那一步。

```
- [ ] 哪只
- [ ] 哪条 lane
- [ ] 一句话说明；该等点头就等
- [ ] 真要出图才读 GENERATE.md
- [ ] 候选进 assets/_*.png
- [ ] 换姿势则 overlay
- [ ] 点头后才改进 pack / 窗口，一次一个互动
- [ ] 跑 养成桌宠/tests
```

## 哪只

| 用户说的 | 目录 | 测试 | 规则 |
| --- | --- | --- | --- |
| 迷你猫娘、色彩、出图 | 先出插画，不进窗口 | 无 | `迷你猫娘画风.mdc`（默认星野色彩）；斑斑/兜兜头身分见 `奶牛猫出图.mdc` |
| 兜兜 | `养成桌宠/packs/doudou/` | `养成桌宠/tests` | 封面锁 `参考图/cowcat_doudou_cover.png`；剧情 `兜兜故事.md` |
| 小委屈 | `养成桌宠/packs/xiaoweiqu/` | `养成桌宠/tests` | 人设在 `养成游戏-迷你猫娘-小委屈/`；不要和斑斑、兜兜混 |
| 拖鞋 | 封面已定；养成 pack 点头再灌 | 无 | 封面锁 `参考图/foldcat_tuoxie_cover.png`；人设 `拖鞋.md` |
| 仓鼠娘、迷你仓鼠娘 | 先出插画；养成 pack 点头再灌 | 无 | 画风规则里仓鼠娘一节；剧情 `故事.md` |
| 养成、QQ宠物、换人物 | `养成桌宠/` | `养成桌宠/tests` | 玩法在 `life/`，模样在 `packs/` |

一次只动一只。人设漂了先停，不要靠加衣服或第二只角色去救。

人没点头不要 PyInstaller、不要改 `启动.bat`。

## 哪条 lane

动手前用**一句中文**写出：哪只、哪条、出不出图。

| Lane | 什么时候 | 出图 | 代码 |
| --- | --- | --- | --- |
| 拧 | 手脚在动，人还站着 | 不出 | 窗口雏形暂时没有拧；不要为这个去出序列帧 |
| 静帧 | 表情变、轮廓差不多（眨眼、闭眼笑） | 一张，脸对齐 idle | 整张替换，不是序列 |
| 换姿势 | 整个人坐、躺、举手、趴 | 一张候选，叠到 idle 上对脸心和脚底 | 点头后再写进 `pet.json` |
| 插画 | 迷你猫娘/仓鼠娘场景图，不是桌面精灵 | `GenerateImage`，见 [GENERATE.md](GENERATE.md) | 不进 pack，除非人点头说当 idle |
| 孵 | 新角色当养成人物 | 先只出 idle 候选 | 养成走 `养成桌宠/packs/`，玩法不要复制一份 |

完成条件：这一句已经说清 lane。下面两种情况**结束本回合**等点头：

- lane 在 拧 / 静帧 / 换姿势 之间拿不准
- 下一步会改 `养成桌宠/pet.py`、`app.py` 或加大已有互动

用户这句已经是「出一张 / 出图」且 lane 是 插画、静帧或换姿势时，同一回合出图，仍要把那句 lane 放在最前。

色彩锁图在 `参考图/ref_xingye_color_*.jpg`。没有这些文件就用 `星野出图素材/不赖-图` 里不带 App 界面的竖图。不要用本地 ComfyUI + NovaAnime。新图不要默认走几乎没轮廓的厚涂。

## 出图

读 [GENERATE.md](GENERATE.md)。工具是 `GenerateImage`。不要为了「有动画」去出 `reach-1`～`reach-4`。

生成结果先落到对应 `assets/_名字-vN.png`（gitignore 已忽略 `_*.png`）。近白底用：

```
python 养成桌宠/prepare_asset.py 输入.png 输出.png
```

没点头的 PNG 不进 `pet.json`，也不改成正式文件名。

## Overlay

换姿势或静帧要对 idle 时，跑：

```
python .cursor/skills/desk-pet/scripts/overlay_pose.py <idle.png> <pose.png> <out.jpg>
```

看 overlay：脸心该黄（红 idle + 绿新图）。脚底对不上或漂成别人就丢掉，再出一张候选。不要先写动画。

这个仓库没有紫猫的 `align_to_idle`，不要加 `--align-cat`。

完成条件：preview 图已生成，并且你已经用 Read 看过。

## 养成 pack

玩法已经写在 `养成桌宠/life/`。换人物只加 pack，不要新写一套饥饿/打工。窗口雏形是 `app.py`（`启动.bat` 开这个）。`pet.py` 是分层窗口桌宠，缺 idle 或缺 pywin32 时不要硬开。

人给全身图之后：

1. 近白底用 `养成桌宠/prepare_asset.py` 抠到 `packs/<id>/assets/_idle-v1.png`。点头后改名 `idle.png`。
2. 复制 `packs/example/pet.json`，`stills.idle` 指向它。`packs/active.txt` 写成 `<id>`。
3. 其它键先留 `null`。病靠变色，死靠变灰。
4. 要更像再出静帧，一次一张，叠到 idle 上 overlay。点头后才写进 `pet.json`：

| 键 | lane | 缺了怎么办 |
| --- | --- | --- |
| idle | 人提供或点头的插画 | 不能开窗口 |
| happy | 静帧 | 用 idle |
| work | 先缺 | 用 idle |
| sick | 表情可变色；躺着才换姿势 | 用 idle+绿 |
| dead | 换姿势，一张躺平 | 用 idle+灰 |

不要为 pack 出序列帧。测试先跑 `养成桌宠/tests`，窗口有 idle 再双击 `养成桌宠/启动.bat`。

菜单和剧情在 `packs/<id>/options.json`。加任务只加一行，不要改 `app.py`。`children` 做子菜单。`need_flag` / `unless_flag` / `set_flag` 做剧情开关。惩罚具体条目由人自己填，不要替人写伤害幼态角色的选项。

兜兜封面当 idle：场景图整张用，不要 `prepare_asset` 抠白底。

仓鼠娘剧情骨架在 `故事.md`。没点头不要灌 `packs/hamster/`，不要改 `active.txt`。兜兜已经点头：封面 `参考图/cowcat_doudou_cover.png`，pack `养成桌宠/packs/doudou/`，剧情 `兜兜故事.md`。

## 测试

养成玩法：`python -m unittest discover -s 养成桌宠/tests -v`

`test_pack` 需要 `packs/example/assets/idle.png`。没有 idle 时先跑 `tests.test_life`。插画 lane 不跑这些测试。

人只看两件事：还是不是她，手感行不行。不要把点窗口当回归。
