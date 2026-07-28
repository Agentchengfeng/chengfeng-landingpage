<!--
input: 一个已经定好视觉隐喻的中文落地页
output: 该页的字体选择（display / body）
pos: chengfeng-landingpage 的字体选型层。排版参数见 cjk-typography.md，这里只管选哪款字体。
-->

# 字体声音（type voice）

**字体不是审美偏好，是隐喻的一部分。**

这个 skill 的整个逻辑是：先找到能承载产品主张的视觉隐喻，再让画面、文案、动作都说同一件事。字体是其中一环——一款中性的企业黑体配在暗色古典油画上，画面在讲手工与重量，文字在讲系统设置，两边不认识。

所以不要全局定死一款字体。**先看画面在讲什么，再选让文字和画面说同一件事的那一款。**

---

## 现有的三种声音

| voice | 字体 | 调性 | 什么隐喻该用它 |
|---|---|---|---|
| `classical` | 思源宋体 | 古典 · 文化 · 厚重 | 手工、传统、时间、重量、仪式、自然、书写、精密器物 |
| `neutral` | 阿里巴巴普惠体 3 | 中性 · 产品 · 系统 | 系统、流程、工具、数据、平台、界面。**正文的默认档** |
| `industrial` | 钉钉进步体 | 锐利 · 工业 · 速度 | 机械、动力、压力、控制、竞速、制造 |

授权与来源写在 `assets/tools/build-fonts.mjs` 的 `VOICES` 常量里，三款都可免费商用、允许网页嵌入。跑 `node scripts/build-fonts.mjs --list` 可以列出。

---

## 怎么选

看画面里的**物质**和**年代**，不要看主题词：

```
木 / 纸 / 石 / 铜 / 织物 / 手工痕迹 / 古典绘画质感 / 仪式感   → classical
钢 / 液压 / 齿轮 / 仪表 / 高速 / 压力 / 制造现场              → industrial
屏幕 / 数据 / 抽象几何 / 中性光 / 流程图 / 界面本身            → neutral
```

两条硬规则：

1. **正文优先 `neutral`。** 除非整页要的就是书卷气，否则正文用黑体，可读性稳。
2. **`industrial` 只做标题。** 钉钉进步体字形倾斜，长段落读着累。

display 与 body 分开配，写进页面根目录的 `fonts.config.json`：

```json
{
  "display": "classical",
  "body": "neutral",
  "_why": "画面是暗色古典油画里的提线木偶与巨手：手工、操控、重量。宋体的顿角接得住这份古典分量。"
}
```

`_why` 不是装饰。**下一个人（或下一次的你）要能从这句话判断这个选择还成不成立**——画面换了，字体就该跟着换。

---

## 三个案例的实际选择

| 案例 | 画面 | display | 理由 |
|---|---|---|---|
| puppet | 暗色古典油画里的巨大木手提着木偶 | `classical` | 手工、操控、重量。宋体的顿角接得住这份古典分量 |
| stowline | 暴风雨海面上的工业船闸与闸轮 | `industrial` | 机械、压力、一格一格的控制。进步体的切角与倾斜就是这个速度感 |
| asterline | 黄铜机械光圈在云海前张开 | `classical` | 精密器物、仪式、庄严。宋体的横细竖粗对应黄铜的锐利边缘 |

三页的 body 都是 `neutral`。

---

## 生成

```bash
node scripts/build-fonts.mjs          # 读 fonts.config.json
node scripts/build-fonts.mjs --list   # 列出全部声音
node scripts/build-fonts.mjs --display=classical --body=neutral
```

产出：

- `assets/fonts/display.woff2` — 标题，`font-weight: 400 900` 单文件覆盖全字重范围，任何字重声明都命中它，不会掉回正文字体
- `assets/fonts/body-{400,500,600,700}.woff2` — 正文到按钮的完整梯度，每档一个真实字形文件

按本页实际用字子集化，一页合计 160–230KB。**改文案后必须重跑**，否则新增的字会掉回系统字体。

CSS 里只认两个族名：

```css
--font-display: "CJKDisplay", <同类系统字体兜底>;
--font-sans:    "CJKBody",    <黑体系统字体兜底>;
```

换 voice 只改 `fonts.config.json` 并重跑，CSS 一个字都不用动。

---

## 字体源

脚本从 `~/.local/share/cjk-type-voices/` 读源文件（不从 `~/Library/Fonts` 读，避免依赖本机字体安装状态）。缺文件时脚本会打印下载地址。

思源宋体：

```bash
curl -L -o ~/.local/share/cjk-type-voices/NotoSerifSC-Bold.otf \
  https://github.com/notofonts/noto-cjk/raw/main/Serif/SubsetOTF/SC/NotoSerifSC-Bold.otf
```

**下载前先验证拿到的是字体不是网页**——文件头应该是 `OTTO`（CFF）或 `\x00\x01\x00\x00`（TrueType）：

```bash
xxd -l 4 -p 字体文件.otf
```

本机 `~/Library/Fonts` 里的 `NotoSerifSC-*.otf` / `NotoSansSC-*.otf` 就是踩过这个坑的——297KB 的 HTML 文档顶着 `.otf` 后缀，fontTools 报 `bad sfntVersion`。

---

## 加一种新声音

1. 字体文件放进 `~/.local/share/cjk-type-voices/`
2. 在 `build-fonts.mjs` 的 `VOICES` 里加一项，写清 `tone`、`fits`、`license`、`source`、`weights`
3. 在本文件的表格里补一行

**授权必须确认允许网页嵌入。** macOS 自带的苹方、宋体-简（常州华文 SinoType）都是随系统授权的商业字体，**不能打包进网页分发**——只能作为缺字兜底列在 font stack 末尾。
