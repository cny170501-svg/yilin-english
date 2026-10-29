// 审查:各视图空态防御快照
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
function seg(file, marker, before, after) {
  const s = fs.readFileSync(path.join(root, file), 'utf8');
  const i = s.indexOf(marker);
  if (i < 0) return 'NOT FOUND: ' + marker;
  return s.slice(Math.max(0, i - before), i + after);
}
console.log('=== practice render head ===');
console.log(seg('js/views/practice.js', 'render: function', 0, 420));
console.log('\n=== grammar topic questions guard ===');
console.log(seg('js/views/grammar.js', 'practice:', 200, 500));
console.log('\n=== dictation buildQuestions ===');
console.log(seg('js/views/dictation.js', 'function buildQuestions', 0, 800));
