#!/usr/bin/env node
/**
 * input:  同级 index.html 的可见文案 + fonts.config.json 选定的字体声音
 * output: assets/fonts/*.woff2（按本页实际用字子集化）
 * pos:    中文落地页的字体自带层。字体由页面隐喻决定，不是全局定死一款。
 *
 * 用法:
 *   node scripts/build-fonts.mjs                          读同级 fonts.config.json
 *   node scripts/build-fonts.mjs --list                   列出全部字体声音
 *   node scripts/build-fonts.mjs --display=classical --body=neutral
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { homedir, tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const fontsDir = join(root, 'assets', 'fonts');
const SRC = join(homedir(), '.local', 'share', 'cjk-type-voices');
const PY = '/usr/bin/python3';

/**
 * 字体声音（type voice）：字体不是审美偏好，是隐喻的一部分。
 * 先看画面在讲什么，再选让文字和画面说同一件事的那一款。
 */
const VOICES = {
  classical: {
    name: '思源宋体',
    tone: '古典 · 文化 · 厚重',
    fits: '手工、传统、时间、重量、仪式、自然、书写、精密器物',
    license: 'SIL OFL 1.1（免费商用，可嵌入）',
    source: 'https://github.com/notofonts/noto-cjk/raw/main/Serif/SubsetOTF/SC/',
    weights: {
      400: 'NotoSerifSC-Regular.otf',
      700: 'NotoSerifSC-Bold.otf',
      900: 'NotoSerifSC-Black.otf',
    },
  },
  neutral: {
    name: '阿里巴巴普惠体 3',
    tone: '中性 · 产品 · 系统',
    fits: '系统、流程、工具、数据、平台、界面。正文的默认档',
    license: '免费商用，允许网页嵌入',
    source: 'https://www.alibabafonts.com/',
    weights: {
      400: 'AlibabaPuHuiTi-3-55-Regular.otf',
      500: 'AlibabaPuHuiTi-3-65-Medium.otf',
      600: 'AlibabaPuHuiTi-3-75-SemiBold.otf',
      700: 'AlibabaPuHuiTi-3-85-Bold.otf',
    },
  },
  industrial: {
    name: '钉钉进步体',
    tone: '锐利 · 工业 · 速度',
    fits: '机械、动力、压力、控制、竞速、制造。笔画切角且字形倾斜，只做标题，不做正文',
    license: '免费商用',
    source: 'https://www.dingtalk.com/',
    weights: { 700: 'DingTalk JinBuTi.ttf' },
  },
};

const args = process.argv.slice(2);
const flag = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];

if (args.includes('--list')) {
  for (const [key, v] of Object.entries(VOICES)) {
    console.log(`\n${key}  ${v.name}  [${Object.keys(v.weights).join('/')}]`);
    console.log(`  调性: ${v.tone}`);
    console.log(`  适用: ${v.fits}`);
    console.log(`  授权: ${v.license}`);
  }
  process.exit(0);
}

// 配置优先级：命令行 > fonts.config.json > 默认（全中性）
let config = { display: 'neutral', body: 'neutral' };
const cfgPath = join(root, 'fonts.config.json');
if (existsSync(cfgPath)) config = { ...config, ...JSON.parse(readFileSync(cfgPath, 'utf8')) };
if (flag('display')) config.display = flag('display');
if (flag('body')) config.body = flag('body');

for (const role of ['display', 'body']) {
  if (!VOICES[config[role]]) {
    console.error(`✗ 未知的字体声音 "${config[role]}"（${role}）。用 --list 看全部。`);
    process.exit(1);
  }
}

function visibleText(html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const attrs = [...stripped.matchAll(/(?:alt|title|aria-label|placeholder|content|value)="([^"]*)"/g)]
    .map((m) => m[1])
    .join(' ');
  return stripped.replace(/<[^>]+>/g, ' ') + ' ' + attrs;
}

const text = visibleText(readFileSync(join(root, 'index.html'), 'utf8'));
const LATIN = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
// 中文全角标点全量保底：标点比汉字更容易在改文案时新增，且总共只有几十个字形。
const CJK_PUNCT = '，。、；：？！（）《》〈〉【】〔〕—…·～￥　' + '“”‘’' + '「」『』';
const chars = new Set([...text, ...LATIN, ...CJK_PUNCT].filter((c) => c.codePointAt(0) > 31));
const subset = [...chars].sort().join('');

mkdirSync(fontsDir, { recursive: true });
const listFile = join(tmpdir(), `subset-${process.pid}.txt`);
writeFileSync(listFile, subset, 'utf8');

const cjkCount = [...chars].filter((c) => c >= '一' && c <= '鿿').length;
console.log(`字符集: ${chars.size} 个（其中汉字 ${cjkCount}）`);
console.log(`display: ${config.display} — ${VOICES[config.display].name}（${VOICES[config.display].tone}）`);
console.log(`body:    ${config.body} — ${VOICES[config.body].name}（${VOICES[config.body].tone}）\n`);

// display 取该声音最重的字重（暗底大字号需要分量）；body 取 ≤700 的完整梯度。
const plan = [];
const dv = VOICES[config.display];
const heaviest = Math.max(...Object.keys(dv.weights).map(Number));
plan.push({ family: 'CJKDisplay', file: dv.weights[heaviest], out: 'display.woff2', weight: 700, src: config.display });
for (const [w, file] of Object.entries(VOICES[config.body].weights)) {
  if (+w > 700) continue;
  plan.push({ family: 'CJKBody', file, out: `body-${w}.woff2`, weight: +w, src: config.body });
}

let total = 0;
let failed = false;
for (const face of plan) {
  const src = join(SRC, face.file);
  if (!existsSync(src)) {
    console.error(`✗ 缺字体源: ${src}`);
    console.error(`  下载: ${VOICES[face.src].source}${face.file}`);
    failed = true;
    continue;
  }
  const dest = join(fontsDir, face.out);
  execFileSync(PY, [
    '-m', 'fontTools.subset', src,
    `--text-file=${listFile}`,
    '--flavor=woff2',
    `--output-file=${dest}`,
    '--layout-features=*',
    '--no-hinting',
    '--desubroutinize',
    '--drop-tables+=DSIG',
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
  const kb = statSync(dest).size / 1024;
  total += kb;
  console.log(`✓ ${face.out.padEnd(16)} ${kb.toFixed(1).padStart(6)} KB  ${face.family} ${face.weight}`);
}
console.log(`合计 ${total.toFixed(1)} KB`);
if (failed) process.exitCode = 1;
