/* 看图默写 · 单词句子听写（V2.2）
   五种独立模式：看图默写单词 / 看中文写英文 / 句子默写 / 听音默写 / 专项强化
   判题：忽略大小写与句末标点；逐词比对定位错误（漏词/多词/复数/拼写），不把拼写或语法错误判为正确 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  /* ---------- 判题：逐词 diff ---------- */

  function normalizeEn(s) {
    return String(s || '').toLowerCase()
      .replace(/[’]/g, "'")
      .replace(/[.,!?;:"()]/g, ' ')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function editDistance(a, b) {
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = [], cur = [];
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      cur[0] = i;
      for (var k = 1; k <= n; k++) {
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a.charAt(i - 1) === b.charAt(k - 1) ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  function classifyWord(ua, ub) {
    if (ub === ua + 's' || ub === ua + 'es') {
      return { yours: ua, ref: ub, kind: 'plural', hint: '「' + ua + '」应为复数形式 ' + ub };
    }
    if (ua === ub + 's' || ua === ub + 'es') {
      return { yours: ua, ref: ub, kind: 'form', hint: '这里应用 ' + ub + '（你写的是 ' + ua + '）' };
    }
    if (editDistance(ua, ub) <= 2 && ub.length > 3) {
      return { yours: ua, ref: ub, kind: 'spell', hint: '拼写：' + ua + ' 的正确写法是 ' + ub };
    }
    return { yours: ua, ref: ub, kind: 'word', hint: '应用 ' + ub + '（你写的是 ' + ua + '）' };
  }

  function diffAnswer(user, ref) {
    var a = normalizeEn(user).split(' ').filter(Boolean);
    var b = normalizeEn(ref).split(' ').filter(Boolean);
    if (!a.length) return { correct: false, diffs: [{ hint: '还没有输入内容' }], partial: false };
    if (a.join(' ') === b.join(' ')) return { correct: true, diffs: [], partial: false };
    var diffs = [];
    var max = Math.max(a.length, b.length);
    for (var i = 0; i < max; i++) {
      var ua = a[i], ub = b[i];
      if (ua === undefined) diffs.push({ yours: '', ref: ub, kind: 'missing', hint: '漏了单词 ' + ub });
      else if (ub === undefined) diffs.push({ yours: ua, ref: '', kind: 'extra', hint: '多了一个单词 ' + ua });
      else if (ua !== ub) diffs.push(classifyWord(ua, ub));
    }
    return { correct: false, diffs: diffs, partial: diffs.length === 1 };
  }

  /* 多参考答案：取差异最少的一个作为反馈基准 */
  function grade(user, q) {
    var answers = q.answers && q.answers.length ? q.answers : [q.answer];
    var best = null;
    for (var i = 0; i < answers.length; i++) {
      var r = diffAnswer(user, answers[i]);
      if (r.correct) return { correct: true, diffs: [], partial: false, matched: answers[i] };
      if (!best || r.diffs.length < best.diffs.length) best = r;
    }
    return best;
  }

  /* ---------- 出题 ---------- */

  var MODES = [
    { key: 'picture', icon: '🖼️', label: '看图默写单词', sub: '看 emoji 插图写单词', count: 10 },
    { key: 'zh', icon: '🇨🇳', label: '看中文写英文', sub: '中文词义 → 英文单词', count: 10 },
    { key: 'sentence', icon: '📝', label: '句子默写', sub: '中文句意 → 完整英文句子', count: 8 },
    { key: 'listen', icon: '🎧', label: '听音默写', sub: '听单词/句子后写下来', count: 10 },
    { key: 'vocab', icon: '📒', label: '生词复习', sub: '生词本词汇：听写 + 看中文写', count: 12 },
    { key: 'boost', icon: '🔁', label: '专项强化', sub: '易错拼写 · 易混词 · 复数', count: 12 }
  ];

  function unitIdsOf(scope) {
    return scope === 'all' ? Content.data.units.map(function (u) { return u.id; }) : [scope];
  }

  function baseQ(type, extra) {
    return Object.assign({
      id: Util.uid(),
      kind: 'input',
      lang: 'en',
      source: 'dictation',
      unitId: '',
      type: type,
      stem: '',
      stemZh: '',
      speak: '',
      options: null,
      answer: '',
      answers: [],
      explain: ''
    }, extra);
  }

  function buildQuestions(mode, scope) {
    var pool = [];
    var uids = unitIdsOf(scope);

    if (mode === 'picture') {
      uids.forEach(function (uid) {
        var imgs = DICTATION_CONTENT.wordImages[uid] || {};
        Object.keys(imgs).forEach(function (en) {
          var w = findWord(uid, en);
          if (!w) return;
          pool.push(baseQ('dict-word', {
            unitId: uid,
            display: 'picture',
            emoji: imgs[en],
            stem: imgs[en],
            stemZh: '看图，写出这个英文单词',
            answers: [en],
            answer: en,
            speak: en,
            zh: w.zh,
            explain: en + '（' + w.zh + '）'
          }));
        });
      });
    } else if (mode === 'zh') {
      uids.forEach(function (uid) {
        var u = Content.unitById(uid);
        if (!u) return;
        u.words.forEach(function (w) {
          pool.push(baseQ('dict-word', {
            unitId: uid,
            display: 'zh',
            stem: w.zh,
            stemZh: '看中文，写出对应的英文',
            answers: [w.en],
            answer: w.en,
            speak: w.en,
            zh: w.zh,
            explain: w.en + '（' + w.zh + '）' + (w.exEn ? '，例句：' + w.exEn : '')
          }));
        });
      });
    } else if (mode === 'sentence') {
      uids.forEach(function (uid) {
        var u = Content.unitById(uid);
        (u && u.sentences ? u.sentences : []).forEach(function (s) {
          pool.push(baseQ('dict-sent', {
            unitId: uid,
            display: 'zh',
            stem: s.zh,
            stemZh: '把中文句子默写成完整英文（忽略大小写和句末标点）',
            answers: [s.en],
            answer: s.en,
            speak: s.en,
            zh: s.zh,
            explain: '完整句子：' + s.en
          }));
        });
      });
    } else if (mode === 'listen') {
      /* 单词 + 句子混合听写 */
      uids.forEach(function (uid) {
        var u = Content.unitById(uid);
        if (!u) return;
        u.words.forEach(function (w) {
          if (w.en.indexOf(' ') >= 0) return;
          pool.push(baseQ('dict-listen', {
            unitId: uid,
            display: 'listen',
            stem: '🎧',
            stemZh: '听单词，把它拼写出来',
            answers: [w.en],
            answer: w.en,
            speak: w.en,
            zh: w.zh,
            explain: w.en + '（' + w.zh + '）'
          }));
        });
        (u.sentences || []).forEach(function (s) {
          pool.push(baseQ('dict-listen', {
            unitId: uid,
            display: 'listen-sent',
            stem: '🎧',
            stemZh: '听句子，把它写下来（忽略大小写和句末标点）',
            answers: [s.en],
            answer: s.en,
            speak: s.en,
            zh: s.zh,
            explain: '完整句子：' + s.en
          }));
        });
      });
    } else if (mode === 'vocab') {
      /* 生词复习：阅读时收藏的生词，听写与看中文各出一遍 */
      Store.readState().vocab.forEach(function (v, i) {
        if (!v.en) return;
        var zh = v.zh || '（释义待补充）';
        if (v.en.indexOf(' ') < 0) {
          pool.push(baseQ('dict-word', {
            display: 'listen',
            stem: '🎧',
            stemZh: '听生词，拼写出来（来自生词本）',
            answers: [v.en],
            answer: v.en,
            speak: v.en,
            zh: zh,
            explain: v.en + '（' + zh + '）'
          }));
        }
        pool.push(baseQ('dict-word', {
          display: 'zh',
          stem: zh,
          stemZh: '生词复习：看中文，写出英文',
          answers: [v.en],
          answer: v.en,
          speak: v.en,
          zh: zh,
          explain: v.en + '（' + zh + '）'
        }));
      });
    } else if (mode === 'boost') {
      /* 优先取本人默写错题（排前），再补易错清单 */
      var wrongQs = [], listQs = [];
      var seen = {};
      Store.data.wrong.forEach(function (w) {
        if (w.source !== 'dictation' || seen[w.fingerprint]) return;
        if (w.unitId && uids.indexOf(w.unitId) < 0) return;
        seen[w.fingerprint] = 1;
        wrongQs.push(baseQ('dict-boost', {
          unitId: w.unitId,
          fingerprint: w.fingerprint,
          display: 'zh',
          stem: w.stem,
          stemZh: '强化练习（易错题重现）',
          answers: w.answers || [w.answer],
          answer: w.answers ? w.answers[0] : w.answer,
          speak: w.speak,
          zh: w.stemZh,
          explain: w.explain
        }));
      });
      DICTATION_CONTENT.confusions.forEach(function (c) {
        if (uids.indexOf(c.unitId) < 0) return;
        var fp = 'dict|boost|' + c.prompt;
        if (seen[fp]) return;
        seen[fp] = 1;
        listQs.push(baseQ('dict-boost', {
          unitId: c.unitId,
          fingerprint: fp,
          display: 'zh',
          stem: c.prompt,
          stemZh: '强化练习（本工具自编补充）',
          answers: c.answers,
          answer: c.answers[0],
          speak: c.answers[0],
          zh: c.zh,
          explain: '💡 ' + c.tip
        }));
      });
      pool = Util.shuffle(wrongQs).concat(Util.shuffle(listQs));
    }
    return pool;
  }

  function findWord(uid, en) {
    var u = Content.unitById(uid);
    if (!u) return null;
    return u.words.filter(function (w) { return w.en === en; })[0] || null;
  }

  function qFingerprint(q) {
    if (q.fingerprint) return q.fingerprint;
    return 'dict|' + (q.type) + '|' + (q.unitId || '') + '|' + (q.answer || '');
  }

  /* ---------- 视图 ---------- */

  var DictationView = {
    render: function () {
      var st = App.dictState || (App.dictState = { mode: null, scope: 'all' });
      var s = App.dictSession;
      if (s && !s.done) return renderQuestion(s);
      if (s && s.done) return renderScore(s);
      return renderConfig(st);
    },

    after: function () {
      var s = App.dictSession;
      if (!s || s.done) return;
      var q = s.questions[s.idx];
      var input = document.getElementById('dict-input');
      if (input && !s.answered) {
        input.focus();
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); submitDict(); }
        });
      }
      /* 听写题自动播放 */
      if (q && q.display && q.display.indexOf('listen') === 0 && !q._played && Store.data.settings.listenAutoplay !== false) {
        q._played = true;
        setTimeout(function () {
          if (App.dictSession === s && !s.answered) Speaker.speak(q.speak);
        }, 300);
      }
    },

    actions: {
      'dict:mode': function (d) {
        App.dictState.mode = d.mode;
        App.rerender();
      },
      'dict:scope': function (d) {
        App.dictState.scope = d.scope;
        App.rerender();
      },
      'dict:start': function () {
        var st = App.dictState;
        var mode = MODES.filter(function (m) { return m.key === st.mode; })[0] || MODES[0];
        if (mode.key === 'vocab' && Store.readState().vocab.length < 2) {
          Util.toast('生词本里的词太少啦，去阅读文章时点击高亮生词收藏吧', 'warn');
          return;
        }
        var pool = buildQuestions(mode.key, st.scope);
        if (pool.length < 3) {
          Util.toast('该范围可用题目不足，换个范围试试', 'warn');
          return;
        }
        /* 强化模式：本人易错题排前面，清单题补足；其他模式随机 */
        var questions = mode.key === 'boost'
          ? pool.slice(0, mode.count)
          : Util.shuffle(pool).slice(0, mode.count);
        questions.forEach(function (q) { q.fingerprint = qFingerprint(q); });
        App.dictSession = {
          mode: mode.key,
          title: mode.label,
          questions: questions,
          idx: 0,
          results: [],
          attempts: 1,
          answered: false,
          viewed: false,
          done: false
        };
        App.rerender();
      },
      'dict:replay': function () {
        var s = App.dictSession;
        if (s && !s.answered) Speaker.speak(s.questions[s.idx].speak);
      },
      'dict:speakAnswer': function () {
        var s = App.dictSession;
        if (!s) return;
        var q = s.questions[s.idx];
        var text = q.answers[0] || q.answer;
        if (text) Speaker.speak(text);
      },
      'dict:submit': function () { submitDict(); },
      'dict:retry': function () {
        var s = App.dictSession;
        if (!s) return;
        s.answered = false;
        s.viewed = false;
        s.attempts++;
        App.rerender();
      },
      'dict:view': function () {
        var s = App.dictSession;
        if (!s || s.done || s.viewed) return;
        var q = s.questions[s.idx];
        s.answered = true;
        s.viewed = true;
        s.results.push({ q: q, correct: false, userAnswer: '（查看了答案）', viewed: true });
        Store.addWrong(q, '查看答案');
        App.rerender();
      },
      'dict:next': function () {
        var s = App.dictSession;
        if (!s) return;
        s.answered = false;
        s.viewed = false;
        s.attempts = 1;
        s.idx++;
        if (s.idx >= s.questions.length) {
          s.done = true;
          var correct = s.results.filter(function (r) { return r.correct; }).length;
          Store.recordDictation(s.questions.length, correct);
          Speaker.stop();
        }
        App.rerender();
      },
      'dict:quit': function () {
        if (window.confirm('退出后本组成绩不会保存，确定退出吗？')) {
          Speaker.stop();
          App.dictSession = null;
          App.rerender();
        }
      },
      'dict:again': function () {
        App.dictSession = null;
        App.rerender();
      }
    }
  };

  function submitDict() {
    var s = App.dictSession;
    if (!s || s.answered) return;
    var input = document.getElementById('dict-input');
    if (!input) return;
    var user = input.value.trim();
    if (!user) { Util.toast('先写一写再提交哦', 'warn'); input.focus(); return; }
    var q = s.questions[s.idx];
    var g = grade(user, q);
    s.answered = true;
    s.results.push({ q: q, correct: g.correct, userAnswer: user, diffs: g.diffs, partial: g.partial, retried: s.attempts > 1 });
    if (!g.correct) {
      Store.addWrong(q, user);
    } else {
      /* 重练答对：消灭旧错题 */
      Store.data.wrong.forEach(function (w) {
        if (w.fingerprint === q.fingerprint && !w.resolved) Store.resolveWrong(w.id);
      });
      setTimeout(function () {
        if (App.dictSession === s && s.answered && !s.done && App.route === 'dictation') {
          DictationView.actions['dict:next']();
        }
      }, 1100);
    }
    App.rerender();
  }

  /* ---------- 配置页 ---------- */

  function renderConfig(st) {
    var scopeChips = ['<button class="chip-scope' + (st.scope === 'all' ? ' on' : '') + '" data-action="dict:scope" data-scope="all">🌐 全册</button>']
      .concat(Content.data.units.map(function (u) {
        return '<button class="chip-scope' + (st.scope === u.id ? ' on' : '') + '" data-action="dict:scope" data-scope="' + u.id + '">' + u.emoji + ' U' + u.no + '</button>';
      })).join('');

    var modeCards = MODES.map(function (m) {
      return '<button class="mode-card' + (st.mode === m.key ? ' on' : '') + '" data-action="dict:mode" data-mode="' + m.key + '">' +
        '<span class="mode-icon">' + m.icon + '</span>' +
        '<span class="mode-label">' + m.label + '</span>' +
        '<span class="mode-sub">' + m.sub + ' · ' + m.count + ' 题</span>' +
        '</button>';
    }).join('');

    var day = Store.logDay();
    return '' +
      '<header class="page-head"><div class="book-title">✍️ 看图默写</div>' +
      '<div class="book-sub">看图 · 看中文 · 默句子 · 听音默写 · 易错强化</div></header>' +
      '<section class="card"><div class="hero-stats">' +
      '<div class="hero-stat"><div class="hero-num">' + (day.dictN ? day.dictC + '/' + day.dictN : '0') + '</div><div class="hero-label">今日默写</div></div>' +
      '<div class="hero-stat"><div class="hero-num">' + (day.dictN ? Math.round(day.dictC * 100 / day.dictN) + '%' : '—') + '</div><div class="hero-label">今日正确率</div></div>' +
      '</div></section>' +
      '<div class="card">' +
      '<div class="card-title">1️⃣ 选择范围</div>' +
      '<div class="scope-row">' + scopeChips + '</div>' +
      '<div class="card-title" style="margin-top:14px">2️⃣ 选择模式（各模式独立出题）</div>' +
      '<div class="mode-grid">' + modeCards + '</div>' +
      '<button class="btn btn-primary btn-block btn-lg" data-action="dict:start">🚀 开始默写</button>' +
      '<div class="muted small" style="margin-top:8px">🖼️ 图片为 emoji 插图（非教材原图）；🎧 听音为设备语音合成。判题忽略大小写和句末标点；拼写、复数和语法的错误会指出具体位置。答错的题自动进入错题本。</div>' +
      '</div>';
  }

  /* ---------- 答题页 ---------- */

  function renderQuestion(s) {
    var q = s.questions[s.idx];
    var progress = (s.idx + 1) + ' / ' + s.questions.length;
    var pct = Math.round(s.idx * 100 / s.questions.length);

    var head = '' +
      '<header class="quiz-head">' +
      '<button class="btn btn-mini" data-action="dict:quit">' + Util.icon("x", 14) + ' 退出</button>' +
      '<div class="quiz-title">' + esc(s.title) + '</div>' +
      '<div class="quiz-progress-text">' + progress + '</div>' +
      '</header>' +
      '<div class="quiz-progress"><div class="quiz-progress-fill" style="width:' + pct + '%"></div></div>';

    var prompt = '';
    if (q.display === 'picture') {
      prompt = '<div class="dict-emoji">' + q.emoji + '</div><div class="dict-prompt-tip">看图，写出这个英文单词</div>';
    } else if (q.display === 'listen') {
      prompt = '<div class="q-listen"><button class="listen-btn" data-action="dict:replay" aria-label="重新播放">' + Util.icon("volume", 18) + '</button>' +
        '<div class="q-stem-hint">听单词，拼写出来（可点击重播）</div></div>';
    } else if (q.display === 'listen-sent') {
      prompt = '<div class="q-listen"><button class="listen-btn" data-action="dict:replay" aria-label="重新播放">' + Util.icon("volume", 18) + '</button>' +
        '<div class="q-stem-hint">听句子，写下来（可点击重播）</div></div>';
    } else {
      var isSent = q.type === 'dict-sent';
      prompt = '<div class="dict-zh' + (isSent ? ' dict-zh-sent' : '') + '">' + esc(q.stem) + '</div>' +
        '<div class="dict-prompt-tip">' + (isSent ? '把中文句子默写成完整英文' : '看中文，写出对应的英文') + '</div>';
    }

    var body = '<section class="card dict-card">' + prompt;

    if (!s.answered) {
      body += '<div class="input-box"><input id="dict-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'placeholder="' + (q.type === 'dict-sent' || q.display === 'listen-sent' ? '写出完整句子…' : '写出单词…') + '"></div>' +
        '<div class="input-ops">' +
        '<button class="btn btn-primary" data-action="dict:submit">' + Util.icon("check", 17) + ' 提交</button>' +
        '</div>' +
        (s.attempts > 1 ? '<div class="muted small" style="margin-top:6px">第 ' + s.attempts + ' 次尝试</div>' : '');
    } else {
      var last = s.results[s.results.length - 1];
      body += renderFeedback(q, last);
    }
    body += '</section>';
    return head + body;
  }

  function renderFeedback(q, last) {
    var ref = q.answers[0] || q.answer;
    var html = '';
    if (last.viewed) {
      html += '<div class="fb-banner fb-wrong"><div class="fb-title">📖 已查看答案</div>' +
        '<div class="fb-line fb-ans">标准答案：<b>' + esc(ref) + '</b></div>' +
        (q.zh ? '<div class="fb-line">中文：' + esc(q.zh) + '</div>' : '') +
        (q.explain ? '<div class="fb-explain">' + esc(q.explain) + '</div>' : '') +
        '<button class="btn btn-primary btn-block" data-action="dict:next">下一题 ' + Util.icon("right", 16) + '</button></div>';
      return html;
    }
    if (last.correct) {
      html += '<div class="fb-banner fb-correct">🎉 默写正确！' + (last.retried ? '（重试后通过）' : '') +
        (s_nextLabel()) + '</div>';
      return html;
    }
    /* 错误：逐处定位 */
    html += '<div class="fb-banner fb-wrong">' +
      '<div class="fb-title">' + (last.partial ? '🟡 就差一点（只有 1 处不同）' : '✗ 再检查一下') + '</div>' +
      '<div class="fb-line">你的答案：' + esc(last.userAnswer) + '</div>' +
      '<div class="fb-line fb-ans">标准答案：<b>' + esc(ref) + '</b>' + (q.zh ? '（' + esc(q.zh) + '）' : '') + '</div>' +
      (last.diffs && last.diffs.length
        ? '<div class="dict-diffs">' + last.diffs.map(function (d) {
            return '<div class="dict-diff">→ ' + esc(d.hint) + '</div>';
          }).join('') + '</div>'
        : '') +
      (q.explain ? '<div class="fb-explain">' + esc(q.explain) + '</div>' : '') +
      '<div class="dict-fb-ops">' +
      '<button class="btn btn-mini" data-action="dict:retry">↻ 再试一次</button>' +
      '<button class="btn btn-mini" data-action="dict:speakAnswer">' + Util.icon("volume", 18) + ' 听答案</button>' +
      '<button class="btn btn-mini" data-action="dict:view">📖 查看答案</button>' +
      '</div>' +
      '<button class="btn btn-primary btn-block" data-action="dict:next">下一题 ' + Util.icon("right", 16) + '</button>' +
      '</div>';
    return html;
  }

  function s_nextLabel() { return ' 自动进入下一题…'; }

  /* ---------- 成绩页 ---------- */

  function renderScore(s) {
    var correct = s.results.filter(function (r) { return r.correct; }).length;
    var total = s.questions.length;
    var score = total ? Math.round(correct * 100 / total) : 0;
    var wrongs = s.results.filter(function (r) { return !r.correct; });
    var retried = s.results.filter(function (r) { return r.correct && r.retried; }).length;

    var wrongHtml = '';
    if (wrongs.length) {
      wrongHtml = '<div class="card"><div class="card-title">📕 需要复习（已加入错题本）</div>' +
        wrongs.map(function (r) {
          return '<div class="score-wrong-item">' +
            '<div class="sw-stem">' + (r.viewed ? '（查看答案）' : esc(r.q.stem)) + '</div>' +
            '<div class="sw-ans">正确答案：<b>' + esc(r.q.answers[0]) + '</b>' + (r.q.zh ? '（' + esc(r.q.zh) + '）' : '') + '</div>' +
            (r.diffs && r.diffs.length ? '<div class="sw-ex">' + r.diffs.map(function (d) { return '→ ' + esc(d.hint); }).join('；') + '</div>' : (r.q.explain ? '<div class="sw-ex">💡 ' + esc(r.q.explain) + '</div>' : '')) +
            '</div>';
        }).join('') + '</div>';
    }

    var emoji = score >= 90 ? '🌟' : score >= 70 ? '👍' : '💪';
    return '' +
      '<div class="card score-card">' +
      '<div class="score-emoji">' + emoji + '</div>' +
      '<div class="score-num">' + score + '<small> 分</small></div>' +
      '<div class="score-detail">默写正确 ' + correct + ' / ' + total + (retried ? '（其中 ' + retried + ' 题经重试通过）' : '') + '</div>' +
      (wrongs.length
        ? '<div class="score-tip">有 ' + wrongs.length + ' 题需要复习，已记入错题本；也可以用「专项强化」模式重练易错题</div>'
        : '<div class="score-tip">全对，一个错题都没有！🎉</div>') +
      '<div class="score-ops">' +
      '<button class="btn btn-primary" data-action="dict:again">🔄 再来一组</button>' +
      '</div>' +
      '</div>' + wrongHtml;
  }

  global.DictationView = DictationView;
  /* 供测试与外部使用 */
  DictationView.grade = grade;
  DictationView.buildQuestions = buildQuestions;
})(window);
