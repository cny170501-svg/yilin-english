// 审查:data 文件交叉引用一致性
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const vm = require('vm');
const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const f of ['data/yilin-4a.js', 'data/listening.js', 'data/reading.js', 'data/grammar.js', 'data/dictation.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox);
}
const B = sandbox.window.BUILTIN_CONTENT || sandbox.BUILTIN_CONTENT;
const RC = sandbox.window.READING_CONTENT || sandbox.READING_CONTENT;
const GC = sandbox.window.GRAMMAR_CONTENT || sandbox.GRAMMAR_CONTENT;
const DC = sandbox.window.DICTATION_CONTENT || sandbox.DICTATION_CONTENT;
const LC = sandbox.window.LISTENING_CONTENT || sandbox.LISTENING_CONTENT;
const out = {};

// 1) 教材:单元/词/句计数 + 重复 en
out.units = B.units.length;
const allWords = {};
let dupEn = [];
B.units.forEach(u => {
  u.words.forEach(w => {
    const k = w.en.toLowerCase();
    if (allWords[k]) dupEn.push(u.id + ':' + w.en);
    allWords[k] = true;
  });
});
out.totalWords = Object.keys(allWords).length;
out.dupWords = dupEn;

// 2) 默写图标映射的单词是否都在教材
const missingImg = [];
Object.keys(DC.wordImages).forEach(uid => {
  const u = B.units.filter(x => x.id === uid)[0];
  if (!u) { missingImg.push('unit ' + uid + ' 不存在'); return; }
  const set = {};
  u.words.forEach(w => set[w.en.toLowerCase()] = true);
  Object.keys(DC.wordImages[uid]).forEach(en => {
    if (!set[en.toLowerCase()]) missingImg.push(uid + ':' + en + ' 不在教材单词表');
  });
});
out.dictationImgOrphans = missingImg;

// 3) 易错词清单的单词存在性
const missingConf = [];
(DC.confusions || []).forEach(c => {
  const words = c.words || [c.en, c.answer, c.correct].filter(Boolean);
  words.forEach(w => { if (typeof w === 'string' && !allWords[w.toLowerCase()]) missingConf.push(w); });
});
out.confusionOrphans = missingConf;

// 4) 阅读:文章 id 唯一、quiz 引用、categories
const ids = RC.articles.map(a => a.id);
out.readingArticles = ids.length;
out.dupArticleIds = ids.filter((v, i) => ids.indexOf(v) !== i);
const catKeys = RC.categories.map(c => c.key);
out.badCategory = RC.articles.filter(a => catKeys.indexOf(a.category) < 0).map(a => a.id);
out.quizCount = RC.articles.reduce((n, a) => n + (a.questions ? a.questions.length : 0), 0);
const badQuiz = [];
RC.articles.forEach(a => (a.questions || []).forEach((q, i) => {
  if (!Array.isArray(q.options) || q.options.length < 2) badQuiz.push(a.id + '#q' + i + ' 选项不足');
  if (!(q.answer >= 0 && q.answer < (q.options || []).length)) badQuiz.push(a.id + '#q' + i + ' answer 越界');
  if (!q.evidence) badQuiz.push(a.id + '#q' + i + ' 缺 evidence');
}));
out.badQuiz = badQuiz;
out.noQuizArticles = RC.articles.filter(a => !a.questions || !a.questions.length).map(a => a.id);
const badUrl = RC.videos.filter(v => v.url && !/^https?:\/\//i.test(v.url)).map(v => v.id || v.title);
out.badVideoUrl = badUrl;

// 5) 语法:主题 id 唯一、规则引用单元存在
const gids = GC.topics.map(t => t.id);
out.grammarTopics = gids.length;
out.dupTopicIds = gids.filter((v, i) => gids.indexOf(v) !== i);
const unitIds = B.units.map(u => u.id);
const badUnitRef = [];
GC.topics.forEach(t => (t.units || []).forEach(uid => { if (unitIds.indexOf(uid) < 0) badUnitRef.push(t.id + '->' + uid); }));
out.grammarBadUnitRef = badUnitRef;

// 6) 听力:情境引用单词存在性(抽查)
const missListen = [];
(LC.scenes || []).forEach(s => (s.words || []).forEach(w => {
  if (typeof w === 'string' && !allWords[w.toLowerCase()]) missListen.push(s.id + ':' + w);
}));
out.listeningOrphans = missListen.slice(0, 10);

console.log(JSON.stringify(out, null, 2));
