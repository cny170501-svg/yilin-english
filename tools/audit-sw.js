// 审查:sw.js ASSETS 与磁盘文件一致性
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const m = sw.match(/ASSETS\s*=\s*(\[[\s\S]*?\]);/);
if (!m) { console.log('NO ASSETS MATCH'); process.exit(1); }
const assets = eval(m[1]).map(a => a.replace(/^\.\//, ''));
const disk = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node20' || e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else disk.push(path.relative(root, p).split(path.sep).join('/'));
  }
})(root);
const missing = assets.filter(a => !fs.existsSync(path.join(root, a)));
const servable = disk.filter(f => /\.(html|js|css|png|webmanifest|svg|ico)$/.test(f) && !f.startsWith('tools/') && f !== 'sw.js' && f !== 'tw/input.css' && f !== 'tw/tailwind.config.js');
const notCached = servable.filter(f => !assets.includes(f));
const extra = assets.filter(a => !disk.includes(a));
console.log('ASSETS count:', assets.length);
console.log('servable on disk:', servable.length);
console.log('servable NOT cached:', JSON.stringify(notCached));
console.log('ASSETS missing on disk:', JSON.stringify(missing));
