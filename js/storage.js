/* 学习进度存储：localStorage 为主，不可用时降级为内存并提示
   V2.0：在 V1 基础上新增听力/读写/阅读/生词统计；数据 key 不变，老数据自动兼容 */
(function (global) {
  'use strict';

  var KEY = 'yilin-english-v1';
  var CONTENT_KEY = 'yilin-english-content-v1';

  function detectAvailable() {
    try {
      var t = '__yl_test__';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* 本地数据清洗：本地存储被篡改/损坏时保证页面不崩溃 */
  function sanitize(d) {
    if (!Array.isArray(d.wrong)) d.wrong = [];
    d.wrong = d.wrong.filter(function (w) {
      return w && typeof w === 'object' && w.fingerprint && w.kind && typeof w.resolved === 'boolean';
    });
    if (!d.words || typeof d.words !== 'object') d.words = {};
    if (!d.units || typeof d.units !== 'object') d.units = {};
    if (!d.log || typeof d.log !== 'object') d.log = {};
    if (!d.daily || typeof d.daily !== 'object') d.daily = { date: '', done: {} };
    if (!d.daily.done || typeof d.daily.done !== 'object') d.daily.done = {};
    if (!d.streak || typeof d.streak !== 'object') d.streak = { last: '', days: 0 };
    if (!d.settings || typeof d.settings !== 'object') d.settings = defaultSettings();
    /* 数值设置兜底 */
    var num = function (v, def, min, max) {
      v = parseFloat(v);
      if (isNaN(v) || v < min || v > max) return def;
      return v;
    };
    d.settings.rate = num(d.settings.rate, 0.85, 0.4, 1.6);
    d.settings.dailyWords = Math.round(num(d.settings.dailyWords, 10, 0, 50));
    d.settings.dailySessions = Math.round(num(d.settings.dailySessions, 1, 0, 10));
    d.settings.dailyReading = Math.round(num(d.settings.dailyReading, 1, 0, 10));
    if (typeof d.settings.showZh !== 'boolean') d.settings.showZh = true;
    if (typeof d.settings.listenAutoplay !== 'boolean') d.settings.listenAutoplay = true;
    if (['s', 'm', 'l'].indexOf(d.settings.fontSize) < 0) d.settings.fontSize = 'm';
    if (['hide', 'show', 'sentence'].indexOf(d.settings.zhMode) < 0) d.settings.zhMode = 'hide';
    if (d.reading && Array.isArray(d.reading.vocab)) {
      d.reading.vocab = d.reading.vocab.filter(function (v) {
        return v && typeof v === 'object' && typeof v.en === 'string';
      });
    }
    if (d.reading && !Array.isArray(d.reading.favorites)) d.reading.favorites = [];
    if (d.reading && (!d.reading.history || typeof d.reading.history !== 'object')) d.reading.history = {};
    if (d.grammar && !Array.isArray(d.grammar.favorites)) d.grammar.favorites = [];
    if (d.grammar && (!d.grammar.topics || typeof d.grammar.topics !== 'object')) d.grammar.topics = {};
    return d;
  }

  function defaultSettings() {
    return {
      rate: 0.85,
      showZh: true,
      fontSize: 'm',          // s | m | l
      zhMode: 'hide',         // hide | show | sentence 阅读页默认中文显示
      listenAutoplay: true,   // 听力题进入后自动播放
      dailyWords: 10,         // 每日点读目标
      dailySessions: 1,       // 每日练习组数目标
      dailyReading: 1         // 每日阅读篇数目标
    };
  }

  function defaultDay() {
    return {
      plays: 0, sessions: 0, total: 0, correct: 0,
      listenN: 0, listenC: 0,   // 听力题数/答对
      writeN: 0, writeC: 0,     // 读写(输入型)题数/答对
      dictN: 0, dictC: 0,       // 看图默写题数/答对（V2.2）
      reads: 0, readSec: 0,     // 完成阅读篇数/阅读秒数
      quizN: 0, quizC: 0        // 阅读理解题数/答对
    };
  }

  function defaults() {
    return {
      version: 2,
      createdAt: Date.now(),
      /* 单词状态: { "u1:dog": { s: 'mastered'|'review', t: 时间戳 } } */
      words: {},
      /* 单元统计: { u1: { plays, lastPlay, sessions, total, correct, best } } */
      units: {},
      /* 错题本 */
      wrong: [],
      /* 每日任务 */
      daily: { date: '', done: {} },
      /* 连续学习 */
      streak: { last: '', days: 0 },
      /* 每日活动日志: { "2026-10-29": defaultDay() } */
      log: {},
      /* 阅读记录: history {id:{count,lastAt,best,pct}}, favorites [id], vocab 生词本 */
      reading: { history: {}, favorites: [], vocab: [] },
      /* 语法专项: topics {t1:{state,lastAt,sessions,total,correct}}, favorites [id] */
      grammar: { topics: {}, favorites: [] },
      settings: defaultSettings()
    };
  }

  var Store = {
    available: detectAvailable(),
    data: defaults(),

    load: function () {
      if (!this.available) return;
      try {
        var raw = localStorage.getItem(KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          var base = defaults();
          Object.keys(base).forEach(function (k) {
            if (parsed[k] === undefined) parsed[k] = base[k];
          });
          /* 设置逐项补齐：老用户没有的新设置项使用默认值 */
          var def = defaultSettings();
          Object.keys(def).forEach(function (k) {
            if (parsed.settings[k] === undefined) parsed.settings[k] = def[k];
          });
          if (!parsed.reading) parsed.reading = base.reading;
          if (!parsed.grammar) parsed.grammar = base.grammar;
          sanitize(parsed);
          this.data = parsed;
        }
      } catch (e) {
        console.warn('进度数据损坏，已重置', e);
        this.data = defaults();
      }
    },

    save: function () {
      if (!this.available) return;
      try {
        localStorage.setItem(KEY, JSON.stringify(this.data));
      } catch (e) {
        Util.toast('保存失败：本地存储空间不足', 'warn');
      }
    },

    /* ---------- 学习记录 ---------- */

    unitStat: function (unitId) {
      if (!this.data.units[unitId]) {
        this.data.units[unitId] = { plays: 0, lastPlay: 0, sessions: 0, total: 0, correct: 0, best: -1 };
      }
      return this.data.units[unitId];
    },

    logDay: function () {
      var today = Util.todayStr();
      var day = this.data.log[today];
      if (!day) day = this.data.log[today] = defaultDay();
      else {
        /* 老数据补齐新字段 */
        var def = defaultDay();
        Object.keys(def).forEach(function (k) { if (day[k] === undefined) day[k] = def[k]; });
      }
      /* 只保留最近 60 天 */
      var keys = Object.keys(this.data.log);
      if (keys.length > 60) {
        keys.sort();
        keys.slice(0, keys.length - 60).forEach(function (k) { delete this.data.log[k]; }, this);
      }
      return day;
    },

    recordPlay: function (unitId) {
      this.unitStat(unitId).plays++;
      this.unitStat(unitId).lastPlay = Date.now();
      this.logDay().plays++;
      this.save();
    },

    /* 记录一次练习。skipLog 时由 logDaySession 统一记日志 */
    recordSession: function (unitId, total, correct, skipLog) {
      var s = this.unitStat(unitId);
      s.sessions++;
      s.total += total;
      s.correct += correct;
      var score = total ? Math.round(correct * 100 / total) : 0;
      if (score > s.best) s.best = score;
      if (!skipLog) this.logDaySession(total, correct);
      this.save();
    },

    logDaySession: function (total, correct) {
      var day = this.logDay();
      day.sessions++;
      day.total += total;
      day.correct += correct;
      this.checkDaily();
      this.save();
    },

    /* 看图默写一组完成（V2.2，独立统计，不计入练习组数） */
    recordDictation: function (total, correct) {
      var day = this.logDay();
      day.dictN += total;
      day.dictC += correct;
      this.save();
    },

    /* 练习里按题型细分统计（听力/读写） */
    recordTypeStats: function (results) {
      var day = this.logDay();
      var TYPE_GROUP = {
        listen: 'listen', listenSent: 'listen', listenDialog: 'listen', listenSpell: 'listen',
        zh2enWrite: 'write', blankWrite: 'write', translate: 'write', translateZh: 'write', listenZh2en: 'listen'
      };
      results.forEach(function (r) {
        var g = TYPE_GROUP[r.q.type];
        if (!g) return;
        if (g === 'listen') { day.listenN++; if (r.correct) day.listenC++; }
        if (g === 'write') { day.writeN++; if (r.correct) day.writeC++; }
      });
      this.save();
    },

    setWordState: function (unitId, wordEn, state) {
      var key = unitId + ':' + wordEn;
      if (state) {
        this.data.words[key] = { s: state, t: Date.now() };
      } else {
        delete this.data.words[key];
      }
      this.save();
    },

    getWordState: function (unitId, wordEn) {
      var w = this.data.words[unitId + ':' + wordEn];
      return w ? w.s : '';
    },

    masteredCount: function (unitId, words) {
      var n = 0;
      for (var i = 0; i < words.length; i++) {
        if (this.getWordState(unitId, words[i].en) === 'mastered') n++;
      }
      return n;
    },

    /* ---------- 阅读 ---------- */

    readState: function () {
      if (!this.data.reading) this.data.reading = { history: {}, favorites: [], vocab: [] };
      if (!this.data.reading.history) this.data.reading.history = {};
      if (!this.data.reading.favorites) this.data.reading.favorites = [];
      if (!this.data.reading.vocab) this.data.reading.vocab = [];
      return this.data.reading;
    },

    /* 记录阅读行为（打开/停留） */
    recordReading: function (articleId, addSec) {
      var rs = this.readState();
      var h = rs.history[articleId] || { count: 0, lastAt: 0, readSec: 0, quizDone: false, quizBest: -1 };
      h.count++;
      h.lastAt = Date.now();
      if (addSec) h.readSec += addSec;
      rs.history[articleId] = h;
      if (addSec) this.logDay().readSec += addSec;
      this.save();
    },

    /* 阅读计时（不重复计数篇数） */
    tickReading: function (articleId, addSec) {
      var rs = this.readState();
      var h = rs.history[articleId];
      if (h) h.readSec += addSec;
      this.logDay().readSec += addSec;
      this.save();
    },

    recordQuiz: function (articleId, total, correct) {
      var rs = this.readState();
      var h = rs.history[articleId] || { count: 1, lastAt: Date.now(), readSec: 0, quizDone: false, quizBest: -1 };
      var pct = total ? Math.round(correct * 100 / total) : 0;
      h.quizDone = true;
      h.lastAt = Date.now();
      if (pct > h.quizBest) h.quizBest = pct;
      rs.history[articleId] = h;
      var day = this.logDay();
      day.quizN += total;
      day.quizC += correct;
      this.markReadToday(articleId);
      this.checkDaily();
      this.save();
    },

    /* 当天首次完整阅读（含做题）计 1 篇 */
    markReadToday: function (articleId) {
      if (this.data.daily.date !== Util.todayStr()) {
        this.data.daily = { date: Util.todayStr(), done: {} };
      }
      var seen = this.data.daily.done['read:' + articleId];
      if (!seen) {
        this.data.daily.done['read:' + articleId] = true;
        this.logDay().reads++;
      }
    },

    toggleFavorite: function (articleId) {
      var rs = this.readState();
      var i = rs.favorites.indexOf(articleId);
      if (i >= 0) rs.favorites.splice(i, 1);
      else rs.favorites.push(articleId);
      this.save();
      return i < 0;
    },

    isFavorite: function (articleId) {
      return this.readState().favorites.indexOf(articleId) >= 0;
    },

    /* ---------- 生词本 ---------- */

    addVocab: function (en, zh, articleId) {
      var rs = this.readState();
      for (var i = 0; i < rs.vocab.length; i++) {
        if (rs.vocab[i].en.toLowerCase() === en.toLowerCase()) return false;
      }
      rs.vocab.push({ en: en, zh: zh || '', from: articleId || '', t: Date.now() });
      this.save();
      return true;
    },

    removeVocab: function (en) {
      var rs = this.readState();
      rs.vocab = rs.vocab.filter(function (v) { return v.en.toLowerCase() !== en.toLowerCase(); });
      this.save();
    },

    hasVocab: function (en) {
      var rs = this.readState();
      return rs.vocab.some(function (v) { return v.en.toLowerCase() === en.toLowerCase(); });
    },

    /* ---------- 每日任务与连续学习 ---------- */

    todayTask: function () {
      var today = Util.todayStr();
      if (this.data.daily.date !== today) {
        this.data.daily = { date: today, done: {} };
      }
      var day = this.logDay();
      var st = this.data.settings;
      var wordsGoal = st.dailyWords || 10;
      var sessGoal = st.dailySessions || 1;
      var readGoal = st.dailyReading == null ? 1 : st.dailyReading;
      /* 错题任务目标：今日需要消灭的错题数，最多 5 题（含今天已消灭的） */
      var resolvedToday = this.data.daily.done['wrongCount'] || 0;
      var remaining = this.data.wrong.filter(function (w) { return !w.resolved; }).length;
      var wrongTarget = Math.min(5, remaining + resolvedToday);
      var wrongDone = wrongTarget === 0 || resolvedToday >= wrongTarget;
      return [
        { id: 'words', icon: '🔊', label: '点读跟读 ' + wordsGoal + ' 个单词', done: day.plays >= wordsGoal, progress: Math.min(day.plays, wordsGoal), goal: wordsGoal },
        { id: 'exercise', icon: '✏️', label: '完成 ' + sessGoal + ' 组练习', done: day.sessions >= sessGoal, progress: Math.min(day.sessions, sessGoal), goal: sessGoal },
        { id: 'reading', icon: '📖', label: readGoal > 0 ? '阅读 ' + readGoal + ' 篇小文章' : '今日不安排阅读', done: day.reads >= readGoal, progress: Math.min(day.reads, readGoal), goal: readGoal || 1 },
        {
          id: 'wrong', icon: '📕',
          label: wrongTarget === 0 ? '今日没有错题要复习' : '复习错题（消灭 ' + wrongTarget + ' 题）',
          done: wrongDone,
          progress: Math.min(resolvedToday, wrongTarget),
          goal: wrongTarget || 1
        }
      ];
    },

    markDailyDone: function (taskId) {
      if (this.data.daily.date !== Util.todayStr()) {
        this.data.daily = { date: Util.todayStr(), done: {} };
      }
      this.data.daily.done[taskId] = true;
      this.checkDaily();
      this.save();
    },

    recordWrongResolved: function (count) {
      var today = Util.todayStr();
      if (this.data.daily.date !== today) this.data.daily = { date: today, done: {} };
      this.data.daily.done['wrongCount'] = (this.data.daily.done['wrongCount'] || 0) + count;
      if (this.data.daily.done['wrongCount'] >= 5) this.data.daily.done['wrong'] = true;
      this.checkDaily();
      this.save();
    },

    checkDaily: function () {
      var tasks = this.todayTask();
      var allDone = tasks.every(function (t) { return t.done; });
      if (!allDone) return;
      var today = Util.todayStr();
      if (this.data.streak.last === today) return;
      var yesterday = Util.dateOffsetStr(-1);
      this.data.streak.days = (this.data.streak.last === yesterday) ? this.data.streak.days + 1 : 1;
      this.data.streak.last = today;
      this.save();
    },

    /* ---------- 语法专项 ---------- */

    grammarState: function () {
      if (!this.data.grammar) this.data.grammar = { topics: {}, favorites: [] };
      if (!this.data.grammar.topics) this.data.grammar.topics = {};
      if (!this.data.grammar.favorites) this.data.grammar.favorites = [];
      return this.data.grammar;
    },

    grammarTopicStat: function (topicId) {
      var g = this.grammarState();
      if (!g.topics[topicId]) {
        g.topics[topicId] = { state: '', lastAt: 0, sessions: 0, total: 0, correct: 0 };
      }
      return g.topics[topicId];
    },

    setGrammarTopicState: function (topicId, state) {
      var t = this.grammarTopicStat(topicId);
      /* 状态由孩子/家长手动标记（再点一次取消），不由一次答题自动判定 */
      t.state = t.state === state ? '' : state;
      t.lastAt = Date.now();
      this.save();
    },

    touchGrammarTopic: function (topicId) {
      var t = this.grammarTopicStat(topicId);
      t.lastAt = Date.now();
      this.save();
    },

    recordGrammarSession: function (topicId, total, correct) {
      var t = this.grammarTopicStat(topicId);
      t.sessions++;
      t.total += total;
      t.correct += correct;
      t.lastAt = Date.now();
      this.save();
    },

    toggleGrammarFav: function (topicId) {
      var g = this.grammarState();
      var i = g.favorites.indexOf(topicId);
      if (i >= 0) g.favorites.splice(i, 1);
      else g.favorites.push(topicId);
      this.save();
      return i < 0;
    },

    isGrammarFav: function (topicId) {
      return this.grammarState().favorites.indexOf(topicId) >= 0;
    },

    /* ---------- 错题本 ---------- */

    addWrong: function (q, userAnswer) {
      /* 超长输入截断，避免本地存储被单条错题撑爆 */
      if (typeof userAnswer === 'string' && userAnswer.length > 200) {
        userAnswer = userAnswer.slice(0, 200) + '…';
      }
      for (var i = 0; i < this.data.wrong.length; i++) {
        var w = this.data.wrong[i];
        if (w.fingerprint === q.fingerprint) {
          w.wrongCount++;
          w.resolved = false;
          w.lastWrong = Date.now();
          w.userAnswer = userAnswer;
          this.save();
          return w;
        }
      }
      var entry = {
        id: Util.uid(),
        fingerprint: q.fingerprint,
        unitId: q.unitId,
        source: q.source || 'unit',
        articleId: q.articleId || '',
        topicId: q.topicId || '',
        type: q.type,
        kind: q.kind,
        lang: q.lang || '',
        stem: q.stem,
        stemZh: q.stemZh || '',
        speak: q.speak || '',
        checkSpeak: q.checkSpeak || '',
        dialog: q.dialog || null,
        options: q.options,
        answer: q.answer,
        answers: q.answers || null,
        explain: q.explain || '',
        userAnswer: userAnswer,
        wrongCount: 1,
        resolved: false,
        lastWrong: Date.now()
      };
      this.data.wrong.unshift(entry);
      if (this.data.wrong.length > 300) this.data.wrong.length = 300;
      this.save();
      return entry;
    },

    resolveWrong: function (id) {
      var n = 0;
      this.data.wrong.forEach(function (w) {
        if (w.id === id && !w.resolved) { w.resolved = true; n++; }
      });
      if (n) this.recordWrongResolved(n);
      return n;
    },

    removeWrong: function (id) {
      this.data.wrong = this.data.wrong.filter(function (w) { return w.id !== id; });
      this.save();
    },

    clearResolved: function () {
      this.data.wrong = this.data.wrong.filter(function (w) { return !w.resolved; });
      this.save();
    },

    unresolvedCount: function () {
      return this.data.wrong.filter(function (w) { return !w.resolved; }).length;
    },

    /* ---------- 内容覆盖（自定义教材数据） ---------- */

    loadCustomContentRaw: function () {
      if (!this.available) return null;
      try { return localStorage.getItem(CONTENT_KEY); } catch (e) { return null; }
    },

    saveCustomContent: function (jsonText) {
      localStorage.setItem(CONTENT_KEY, jsonText);
    },

    clearCustomContent: function () {
      localStorage.removeItem(CONTENT_KEY);
    },

    resetProgress: function () {
      this.data = defaults();
      this.save();
    }
  };

  global.Store = Store;
})(window);
