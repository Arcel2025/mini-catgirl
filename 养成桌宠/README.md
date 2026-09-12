# 养成桌宠

玩法同一份，人物换 pack。这个仓库没有紫猫、白鼬，不要去编那两个目录。

出图走仓库里的 desk-pet skill（`.cursor/skills/desk-pet/`）。窗口雏形是 `启动.bat` → `app.py`。`pet.py` 是分层窗口桌宠，要 idle.png，还要 pywin32 / numpy。

## 你要做的

1. 准备一张全身 PNG，近白底或已抠好。
2. 拷到 `packs/example/assets/idle.png`。近白底可先跑：

```
python prepare_asset.py 你的图.png packs/example/assets/idle.png
```

3. 双击 `启动.bat` 打开窗口。左边是立绘，右边是数值和菜单。菜单来自 `packs/example/options.json`，不是写死在窗口代码里。

换角色：新建 `packs/名字/`，复制 `pet.json` 和 `options.json`，把 idle 放进它的 `assets/`，再把 `packs/active.txt` 改成这个名字。玩法不用改。

当前 `active.txt` 是 `doudou`（雪街奶牛猫兜兜）。封面当 idle，不要抠白底。人设 `兜兜.md`，剧情 `兜兜故事.md`。

客厅白 T 那只是 **小委屈**：人设在 `养成游戏-迷你猫娘-小委屈/`，pack 是 `xiaoweiqu`。要玩她就把 `active.txt` 改成 `xiaoweiqu`。要回模板就改成 `example`。

## 自己加选项

改 `options.json` 加一行即可，不用改 Python。

- `engine`：喂、洗、打工这类走生命核。没有 `engine` 就只改数值和立绘。
- `still`：对应 `assets/` 里的 png 文件名（不含路径）。没有图就继续用当前 idle。
- `beats`：窗口演出。`screen: black` 是黑屏对白，`say: true` 会带上 `pet.json` 里的 `character` 名字。点一下或等一会儿进下一拍。
- `hunger` / `cleanliness` / `mood` / `health` / `gold`：可正可负。
- `children`：子菜单。惩罚选项往「惩罚」下面加。
- `need_flag` / `set_flag`：剧情开关。先 `set_flag` 打开，后面的选项才能点。

模板里惩罚先只有训斥、罚站、不理。缺图时菜单仍能改心情。

## 演出图（可选）

模板先只用 idle。病用变色，死用变灰。以后要更像，再出静帧，点头后写进 `pet.json` 的 `stills`：

| 键 | 什么时候 | 出图 |
| --- | --- | --- |
| idle | 待机 | 你提供的全身 |
| happy | 喂、逗 | 一张对齐脸的笑 |
| work | 打工 | 先可缺，用 idle |
| sick | 生病 | 表情变可拧/变色；躺着才出一张 |
| dead | 死亡 | 一张躺平，点头才进 |

不要 `reach-1`～`reach-4` 轮播。出图走 Cursor 的 desk-pet skill。

## 测试

不弹窗口：

```
python -m unittest tests.test_life -v
```

生命核在 `life/`。窗口只问 `view` / `intend`。关软件会按墙钟补算，可以真的饿死；打工离线不续摊。

人没点头不要封装。
