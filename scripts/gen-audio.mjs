/**
 * 用百度智能云语音合成（TTS）把全站朗读文本预生成为 MP3。
 *
 * 用法：
 *   1) 把密钥放进环境变量（或 scripts/.baidu.env）：
 *        BAIDU_API_KEY=xxxx
 *        BAIDU_SECRET_KEY=yyyy
 *        BAIDU_PER=111          # 发音人，默认 111=度小萌(精品·软萌妹子)
 *   2) 跑：  node scripts/gen-audio.mjs
 *      （不加密钥 / 设 DRY_RUN=1 则只收集文本清单，不调用百度）
 *
 * 产物：
 *   - public/audio/<md5>.mp3      每句一个音频
 *   - src/lib/audioMap.json       文本 -> /audio/<md5>.mp3 的映射，App 运行时按需播放
 *
 * 安全：密钥仅在本机使用，绝不写进仓库或前端代码。
 */
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const MAP_PATH = path.join(ROOT, 'src', 'lib', 'audioMap.json');
const STRINGS_PATH = path.join(ROOT, 'scripts', 'strings.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 读取密钥（env 优先，其次 scripts/.baidu.env）----
function loadEnv() {
  const f = path.join(ROOT, 'scripts', '.baidu.env');
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}
loadEnv();

const API_KEY = process.env.BAIDU_API_KEY || '';
const SECRET_KEY = process.env.BAIDU_SECRET_KEY || '';
const PER = process.env.BAIDU_PER || '111';
const SPD = process.env.BAIDU_SPD || '4';   // 语速（0-15，偏小更清晰）
const PIT = process.env.BAIDU_PIT || '5';   // 音调
const VOL = process.env.BAIDU_VOL || '7';   // 音量
const DRY = process.env.DRY_RUN === '1' || !API_KEY || !SECRET_KEY;

// ---- 1. 打包并运行 collect.ts 拿到文本清单 ----
const tmp = path.join(ROOT, '.tmp', 'collect.mjs');
await build({
  entryPoints: [path.join(ROOT, 'scripts', 'collect.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: tmp,
  alias: { '@': path.join(ROOT, 'src') },
  logLevel: 'silent',
});
const mod = await import(pathToFileURL(tmp).href + '?t=' + Date.now());
const strings = mod.spokenStrings;
fs.writeFileSync(STRINGS_PATH, JSON.stringify(strings, null, 0));

if (DRY) {
  console.log(`[dry-run] 收集到 ${strings.length} 条待生成文本 → scripts/strings.json`);
  console.log('（设置 BAIDU_API_KEY / BAIDU_SECRET_KEY 后重跑即可真正生成 MP3）');
  process.exit(0);
}

fs.mkdirSync(AUDIO_DIR, { recursive: true });

// ---- 2. 获取 access_token ----
async function getToken() {
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`;
  const res = await fetch(url);
  const j = await res.json();
  if (!j.access_token) throw new Error('获取 token 失败: ' + JSON.stringify(j));
  return j.access_token;
}

// ---- 3. 逐条合成 ----
async function synth(token, text) {
  const body = new URLSearchParams({
    tex: text, // URLSearchParams.toString() 会对值做一次 urlencode，符合百度要求
    tok: token,
    cuid: 'forest_study_station',
    ctp: '1',
    lan: 'zh', // 百度仅支持中英文混合模式
    aue: '3',  // mp3
    spd: SPD,
    pit: PIT,
    vol: VOL,
    per: PER,
  });
  const res = await fetch('https://tsn.baidu.com/text2audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const ct = res.headers.get('content-type') || '';
  if (ct.startsWith('audio')) {
    return Buffer.from(await res.arrayBuffer());
  }
  const err = await res.json().catch(() => ({}));
  throw new Error(`err_no=${err.err_no} err_msg=${err.err_msg}`);
}

let token = await getToken();
let ok = 0;
let fail = 0;
const map = {};

for (let i = 0; i < strings.length; i++) {
  const text = strings[i];
  const hash = crypto.createHash('md5').update(text).digest('hex');
  const file = path.join(AUDIO_DIR, `${hash}.mp3`);
  const rel = `/audio/${hash}.mp3`;
  // 已存在则跳过（支持增量更新）
  if (fs.existsSync(file) && fs.statSync(file).size > 0) {
    map[text] = rel;
    ok++;
    continue;
  }
  let buf = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      buf = await synth(token, text);
      break;
    } catch (e) {
      const msg = String(e.message || e);
      // token 失效则刷新一次
      if (/invalid/i.test(msg) && attempt === 0) {
        try { token = await getToken(); } catch {}
      }
      if (attempt < 2) { await sleep(400 * (attempt + 1)); continue; }
      console.error(`✗ [${i + 1}/${strings.length}] 失败: ${text}  ->  ${msg}`);
      fail++;
      break;
    }
  }
  if (buf) {
    fs.writeFileSync(file, buf);
    map[text] = rel;
    ok++;
  }
  if ((i + 1) % 25 === 0 || i === strings.length - 1) {
    console.log(`  进度 ${i + 1}/${strings.length}  (成功 ${ok}, 失败 ${fail})`);
  }
  await sleep(180); // 控制 QPS，避免被限流
}

fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
console.log(`\n完成：成功 ${ok} 条，失败 ${fail} 条。`);
console.log(`映射表已写入 ${path.relative(ROOT, MAP_PATH)}`);
