<!--
input: 一个中文落地页（HTML + CSS）
output: 通过审计的中文排版
pos: chengfeng-landingpage 的中文排版规格层。SKILL.md 的 CJK typography 一节是摘要，这里是完整依据。
-->

# 中文排版规格

**中文排版不是给英文模板换个字体。** 汉字是等宽方块字，字面几乎占满 em box，没有英文那种由 x-height、升部降部、字母间天然空隙构成的呼吸。把英文的排版参数直接套到中文上，每一条都会朝错误方向走：收紧字距变成笔画粘连，压低行高变成行叠，宽字距变成散架。

下面每一条都在 1440px 桌面与 390px 窄屏上实测过。

---

## 一、字体：必须自带，不能靠系统栈

```css
/* ✗ 这不叫定义字体，这叫用访客机器上碰巧有的字体 */
font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
```

同一个页面在 Mac 上是苹方、Windows 上是微软雅黑、Linux 上是 Noto——三副长相，而且苹方是系统 UI 字体，配任何有美术方向的画面都会显得像设置页。

**做法**：子集化 webfont 自带，系统字体只作缺字兜底。

```css
@font-face { font-family: "CJKDisplay"; src: url("assets/fonts/display.woff2") format("woff2"); font-weight: 400 900; font-display: swap; }
@font-face { font-family: "CJKBody"; src: url("assets/fonts/body-700.woff2") format("woff2"); font-weight: 700; font-display: swap; }

--font-display: "CJKDisplay", "Songti SC", "Noto Serif CJK SC", serif;
--font-sans:    "CJKBody", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif;
```

中文字库全量 3–8MB，不能整包引。但落地页 hero 实际用字只有一两百个，**按页面实际用字子集化后一页合计 160–230KB**。用 `assets/tools/build-fonts.mjs`：

```bash
node scripts/build-fonts.mjs
```

它扫描本页 `index.html` 的可见文案（含 alt/title/aria-label），加上全量拉丁与中文标点保底，输出 display 一档 + body 四档。

**改完文案必须重跑**，否则新增的字会掉回系统字体，同一句话出现两种长相。

**选哪款字体由页面的隐喻决定，不是全局定死一款** —— 见 [`cjk-type-voices.md`](./cjk-type-voices.md)。写在页面根目录的 `fonts.config.json` 里，换字体只改配置并重跑，CSS 一个字都不用动。

授权红线：macOS 自带的苹方、宋体-简（常州华文 SinoType）是随系统授权的商业字体，**不能打包进网页分发**，只能列在 font stack 末尾当缺字兜底。

---

## 二、字重：只用字体真实存在的档位

```css
/* ✗ 白设：这三个值渲染出来只有两种粗细 */
.brand { font-weight: 650; }
.nav   { font-weight: 560; }
.cta   { font-weight: 680; }
```

苹方只有 100/200/300/400/500/600 六档，普惠体子集按 400/500/600/700 打包。**中间值会被吸附到最近档位**，而 `font-synthesis: none`（应当保留）又禁止浏览器合成。结果是你以为在调三级层级，实际只渲染出两级。

| Token | 值 | 用在 |
|---|---|---|
| `--w-regular` | 400 | 正文 |
| `--w-medium` | 500 | 导航、标签、eyebrow |
| `--w-semibold` | 600 | 按钮、二级标题 |
| `--w-bold` | 700 | 主标题 |

每一档都要有对应的 woff2 文件。

---

## 三、字距：中文永不为负

| 场景 | 值 | 理由 |
|---|---|---|
| 标题 | `0` | 负字距让笔画粘连，密度高的字（矗、罐、镜）尤其明显 |
| 正文 | `0` | 同上 |
| 小字标签 | `≤ 0.02em` | 留一点透气，超过就开始散架 |
| 纯拉丁技术标签 | `.04em–.07em` | 只有这里才用宽字距，且不要 `text-transform: uppercase` 影响中文 |

英文大字号标题收紧（`-0.02em` ~ `-0.05em`）是为了消除 W/A/V 之间的视觉空隙。**汉字没有这个问题，收紧只有害处。**

---

## 四、行高：标题 ≥1.2，正文 1.75–1.8

| 场景 | 值 | 理由 |
|---|---|---|
| 主标题 | `1.22`（下限 1.2） | 低于 1.2 开始视觉挤压，低于 1.0 直接行叠 |
| 二级标题 | `1.22` | 同上 |
| 正文 | `1.8`（区间 1.75–1.85） | 汉字块面密实，需要比英文更大的行距才能追行 |
| 单行标签 | `1.5` | |

英文编辑排版常见的 `line-height: 0.9` / `1.06` 在中文里必然出事。**`line-height: 1` 用在 36px 中文标题上会直接叠字。**

写在 `font` 简写里的行高同样要检查：`font: 600 36px/1.1 var(--sans)` 是同一个错误，只是藏得深一点。

---

## 五、字号下限：正文 15px，标签 12px

| 场景 | 桌面 | 窄屏 |
|---|---|---|
| 正文 | ≥ 16px | ≥ 15px |
| 导航、按钮 | ≥ 13px | ≥ 12px |
| 标签、页脚、状态 | ≥ 12px | ≥ 12px |

**12px 是中文的硬下限。** 汉字笔画数远多于拉丁字母，11px 的「攒」「囊」在普通屏上已经糊成一团。英文规范里 11px 标签可以接受，中文不行。

`.55rem`（8.8px）、`.58rem`（9.28px）这类值是从英文模板带过来的，必须全部提到 12px。

---

## 六、行长：用 em 按字数算

中文 `1em = 1 个汉字宽`，所以 em 是精确的行长单位：

```css
--measure-display: 11em;  /* 大标题一行 ≤ 11 字 */
--measure-body: 26em;     /* 正文一行 ≤ 26 字 */
```

`max-width: 32em` 是 32 字一行，超出中文舒适阅读区（24–28 字），眼睛回扫时容易串行。

---

## 七、断行：语义断行只在宽屏锁定

```css
/* ✗ 窄屏溢出视口 */
.title-line { white-space: nowrap; }
@media (max-width: 430px) { .title-line { white-space: normal; } }
```

默认 nowrap、窄屏才解禁，意味着 **430–780px 之间标题会横向溢出**。反过来写：

```css
.title-line { display: block; }
@media (min-width: 781px) { .title-line { white-space: nowrap; } }
```

标题的换行位置必须人工按语义定（用 `<span class="title-line">` 分行），不要用 `text-wrap: balance` 让浏览器决定中文的节奏。窄屏要单独想一遍新的分行方案，并确保标点不出现在行首。

---

## 八、汉字与拉丁之间的间距

```css
body {
  line-break: strict;      /* 中文禁则：标点不能起行 */
  word-break: normal;
  overflow-wrap: normal;
  font-synthesis: none;    /* 禁止合成字重，暴露缺档问题 */
}
@supports (text-spacing-trim: normal) { body { text-spacing-trim: normal; } }
@supports (text-autospace: normal)    { body { text-autospace: normal; } }
```

`text-autospace` 让「把 AI 用进真实工作」里的汉字与拉丁自动留四分之一空，`text-spacing-trim` 挤压全角标点两侧的多余空白。两个都是渐进增强，不支持的浏览器退回正常排布，不会出错。

---

## 九、间距：4px 尺度 + 中文垂直节奏

```css
--s1: 4px;  --s2: 8px;  --s3: 12px; --s4: 16px; --s5: 24px;
--s6: 32px; --s7: 48px; --s8: 64px; --s9: 96px;

--gap-eyebrow: var(--s5); /* eyebrow → 标题 */
--gap-title: var(--s5);   /* 标题 → 正文 */
--gap-body: var(--s6);    /* 正文 → 行动区 */
--gap-action: var(--s3);  /* 按钮之间 */
```

中文块面密实，**块与块之间要给到比英文更大的留白**，层次才分得开。英文靠字母高低错落就有天然分组感，中文全靠留白。

所有间距值落在 4px 尺度上；`13px`、`22px`、`31px` 这类散值是补丁的痕迹，应收敛。

---

## 十、验收

改完必须在真实浏览器里跑一遍 `assets/tools/audit-cjk.js`，桌面（1440px）与窄屏（390px）各一次：

```js
// 在 devtools console 或 MCP javascript_tool 里执行
// 返回 {total: 0} 才算通过
```

它扫描页面上每一个含汉字的元素，报出：负字距、行高 <1.2、非法字重、字号 <12px、行长 >30 字，以及横向溢出。

**`total` 不为 0 就不算改完。** 静态检查 CSS 不够——媒体查询、末尾覆盖块、`font` 简写都可能让实际渲染值与源码里读到的不一致。

---

## 常见返工来源

1. **补丁摞补丁**：文件末尾追加一段覆盖块去压前面的值，改一处要在两个地方同时改。应该改源头，不要再加一层。
2. **同一个字体栈定义两次**（如 `--sans` 与 `--hero-sans`），且各自作用域不同，导致页面上下半部分排版不一致。
3. **宋体/黑体混用**：`h1` 声明了 display 字体又被下一行的 sans 覆盖，只剩 `h2` 还是宋体——读者读不出层级，只读出残留。产品/UI 主张统一走黑体；宋体只在编辑、文化或隐喻方向真的需要时才用，且要贯彻到底。
4. **用正则批量改超长单行 CSS**：`.72rem/1.55` 这类值容易被贪婪匹配错位改成 `1.5.55`。改完必须校验括号配平与数值合法性。
