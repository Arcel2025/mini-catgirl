# GenerateImage

出图前先看过 `SKILL.md` 的 lane。这里只写 Cursor 这一次怎么调工具。

## 工具

先 `GetDynamicTools`，`namespace=cursor`，`toolName=GenerateImage`。再 `CallDynamicTool`：

- `namespace`: `cursor`
- `toolName`: `GenerateImage`
- 不要带 `mcpDetails`（这是 Cursor 内置工具）

参数：

| 参数 | 用法 |
| --- | --- |
| `description` | 英文主描述。身份从参考图锁，文字只写这次多出来的姿势、表情、道具、背景。 |
| `filename` | ASCII，如 `idle-v1.png`。不要带目录。 |
| `aspect_ratio` | 桌宠精灵 `3:4`。色彩竖图 `9:16`。方构图 `1:1`。不要用 `16:9` 硬塞全身立绘。 |
| `reference_image_paths` | 绝对路径。至少一张身份/画风锁。 |

用户没明确说出图时不要调这个工具。调完不要把图再嵌进 Markdown，客户端会自己显示。用 Read 看生成图，再拷到 `assets/_名字-vN.png` 或 `参考图/_候选.png`。

色彩锁图在 `参考图/ref_xingye_color_1.jpg` 等。没有色彩锁图就不要出图。路径示例：

`C:\Users\JG\Desktop\迷你猫娘\参考图\ref_xingye_color_1.jpg`

## 精灵（静帧/换姿势/孵）

锁这只已点头的 `idle.png`。养成 pack 是 `养成桌宠/packs/<id>/assets/idle.png`。没有 idle 就先做出插画候选，不要假装有精灵。

`description` 里写死：

- 单独一只全身，朝向跟 idle 相同
- 干净近白或纯色底，不要场景、不要棋盘透明、不要第二只手
- 一张静帧，不要格子图、不要序号、不要 UI
- 只改 lane 需要的那部分，其余跟参考一致

抠白底：

```
python 养成桌宠/prepare_asset.py <生成图> <目标/_候选.png>
```

## 插画（迷你猫娘 / 仓鼠娘）

先读 `.cursor/skills/mini-catgirl-body/`（头身四肢耳朵钉死；衣服、发型、眼睛、表情另抽），再读用户点的风格：

| 用户说的 | skill |
| --- | --- |
| 没说、色彩 | `mini-catgirl-color` |
| 多巴胺、老鼠娘 | `mini-catgirl-dopamine` |
| 厚涂 | `mini-catgirl-impasto` |
| 勾线、贴纸 | `mini-catgirl-line` |
| 风格Ⅱ、洛丽塔、抱猫、抱玩偶 | `mini-catgirl-style-2` |

默认仍是色彩。`description` 里不要写星野、Xingye、MiniMax。本地锁按各风格 skill；外发只用脱敏复刻稿。已定稿角色（斑斑 / 兜兜 / 小委屈 / 拖鞋）头身仍跟各自锁图。

人设是奶牛猫时先分清哪只：

- **兜兜**：锁 `参考图/cowcat_doudou_cover.png`。头身、粉耳大小按 v7，不要锁斑斑坐姿。英文里写死 large pink cat ears only、head most of height、no horns、no piebald on ears、round gold bell only。
- **斑斑**：再加 `ref_cowcat_q_ok.png`，坐姿头身按 `奶牛猫出图.mdc`。
- **小委屈**：站着锁 `参考图/xiaoweiqu_stand.png`（委屈嘴）。拍封面或坐茶几锁 `参考图/xiaoweiqu_cover.png`（坐姿参考那张小嘴）。不要锁兜兜雪街、不要锁斑斑坐姿。没点头不要重出这两张。idle 仍用站姿。第一章剧情图一律 `9:16`（和 `xiaoweiqu_ch1_genkan.png` 一样，720×1280），不要换比例。推门已定稿锁 `参考图/xiaoweiqu_ch1_pushdoor.png`。开门见箱已定稿锁 `参考图/xiaoweiqu_ch1_box.png`。抽信已定稿锁 `参考图/xiaoweiqu_ch1_letter.png`。不要重出。
- **拖鞋**：锁 `参考图/foldcat_tuoxie_cover.png`。圆折耳、大头、L 铁管、泪。不要锁奶牛斑，不要再重出封面。

仓鼠娘再加 `ref_hamster_girl_seeds_ok.png`。不要拿厚涂那套 App 样张当默认锁。封面当养成 idle 时不要抠白底。

不要用 Nova / WAI / 本地 ComfyUI 出这套风。脸按那条规则：人脸加头顶猫耳（仓鼠娘则是人脸加仓鼠耳）。

点头前的文件用 `_` 前缀。已定稿的图规则里写了「不要再改」就不要重出。

## 养成 pack 静帧

锁 pack 里已点头的 `idle.png`。一次只出 `happy` 或 `dead` 一张。`work` 第一期不要出。`sick` 能变色就不要出。

`description` 仍按精灵那条：全身、同朝向、近白底、一张静帧。dead 写躺平、眼睛闭上或 XX，身体还是她。

## 一次一张

一次 `GenerateImage` 只出一张。身份漂了就改描述或换参考再出，不要一次出四张姿势去轮播。
