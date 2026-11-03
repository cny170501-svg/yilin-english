/* 豆包语音包批量合成脚本（火山引擎 v3 HTTP 单向流式接口）
 *
 * 用法（需要 Node.js 18+）：
 *   1. 在网站页面控制台运行收集脚本导出 tools/tts-texts.json（见 README「语音包」章节）
 *   2. node tools/tts-batch.mjs
 *   3. 脚本读取 tools/tts-texts.json，逐条合成到 audio/（文件名=SHA256前16位），
 *      已存在且大于 1KB 的自动跳过（断点续跑），全部完成后重写 audio/manifest.js。
 *
 * 密钥说明：X-Api-Key 在火山引擎控制台「豆包语音 → API Key」创建；
 *           X-Api-Resource-Id 固定 seed-tts-2.0（豆包语音合成模型 2.0 字符版）。
 * 计费：约 5 元/万字符，新用户有免费试用额度。密钥仅本机使用，不进入仓库。
 */
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

/* ===== 配置区：按需替换 ===== */
const API_KEY = process.env.TTS_API_KEY || '在此填入你的API Key';
const VOICE = process.env.TTS_VOICE || 'zh_female_yingyujiaoxue_uranus_bigtts';
const VOICE_LABEL = process.env.TTS_VOICE_LABEL || 'Tina老师2.0';
/* =========================== */

const RESOURCE_ID = 'seed-tts-2.0';
const OUT = path.join(REPO, 'audio');
const TEXTS = path.join(REPO, 'tools', 'tts-texts.json');
const TIME_BUDGET = 90 * 1000; // 单次运行时间预算（秒），可反复运行直至全部完成

function normalize(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
function textHash(s) { return crypto.createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16); }

function synthesize(text, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      user: { uid: 'yilin-english-gen' },
      req_params: { speaker: VOICE, text, audio_params: { format: 'mp3', sample_rate: 24000 } },
    });
    const req = https.request({
      host: 'openspeech.bytedance.com',
      path: '/api/v3/tts/unidirectional',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'X-Api-Key': API_KEY,
        'X-Api-Resource-Id': RESOURCE_ID,
      },
      timeout: timeoutMs,
    }, (res) => {
      const parts = [];
      res.on('data', d => parts.push(d));
      res.on('end', () => {
        const raw = Buffer.concat(parts).toString('utf8');
        if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode + ': ' + raw.slice(0, 200))); return; }
        const b64 = [];
        for (const line of raw.split('\n')) {
          const t = line.trim(); if (!t) continue;
          let j; try { j = JSON.parse(t); } catch (e) { continue; }
          if (j.code !== 0 && j.code !== 20000000) { reject(new Error('code ' + j.code + ': ' + j.message)); return; }
          if (j.data) b64.push(j.data);
        }
        if (!b64.length) { reject(new Error('no data')); return; }
        resolve(Buffer.from(b64.join(''), 'base64'));
      });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', e => reject(e));
    req.write(body); req.end();
  });
}

const list = JSON.parse(fs.readFileSync(TEXTS, 'utf8')).texts;
fs.mkdirSync(OUT, { recursive: true });
const t0 = Date.now();
let done = 0, skipped = 0;
const failures = [];

for (const it of list) {
  const text = normalize(it.text);
  if (!text) { skipped++; continue; }
  const file = path.join(OUT, textHash(text) + '.mp3');
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) { skipped++; continue; }
  if (Date.now() - t0 > TIME_BUDGET) { console.log('时间预算用尽，再次运行本脚本可继续。'); break; }
  let ok = false, lastErr = null;
  for (let attempt = 0; attempt < 3 && !ok; attempt++) {
    try {
      const mp3 = await synthesize(text);
      if (mp3.length < 500) throw new Error('suspicious size ' + mp3.length);
      fs.writeFileSync(file, mp3);
      done++; ok = true;
    } catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 600 * (attempt + 1))); }
  }
  if (!ok) failures.push({ text, err: String(lastErr && lastErr.message).slice(0, 120) });
  process.stdout.write(`\r${done + skipped}/${list.length}`);
  await new Promise(r => setTimeout(r, 120));
}

// 生成/更新清单
const all = {};
let missing = 0;
for (const it of list) {
  const text = normalize(it.text);
  if (!text) continue;
  const f = textHash(text) + '.mp3';
  const p = path.join(OUT, f);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) all[text] = f; else missing++;
}
const version = new Date().toISOString().slice(0, 10).replace(/-/g, '') + '01';
const manifest = { version, voice: VOICE, voiceLabel: VOICE_LABEL, count: Object.keys(all).length, files: all };
const js = `/* 语音包清单：由 tools/tts-batch.mjs 生成（音色 ${VOICE_LABEL}，version ${version}）。请勿手改。 */\nwindow.AUDIO_PACK = ${JSON.stringify(manifest)};\n`;
fs.writeFileSync(path.join(OUT, 'manifest.js'), js, 'utf8');

console.log(`\n完成：本轮新合成 ${done}，跳过 ${skipped}，失败 ${failures.length}，清单 ${Object.keys(all).length} 条，缺失 ${missing}`);
console.log(`清单已写入 audio/manifest.js。提醒：重新生成后请把 sw.js 的 CACHE 版本号 +1。`);
if (failures.length) {
  fs.writeFileSync(path.join(REPO, 'tools', 'tts-failed.json'), JSON.stringify(failures, null, 1), 'utf8');
  console.log(`失败清单已记录到 tools/tts-failed.json，重跑本脚本可续生成。`);
}
