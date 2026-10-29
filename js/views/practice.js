/* 练习页（V2.0）：听力 / 读写 / 单词句型 / 语法 / 综合
   支持选择题、排序题、输入题（拼写/翻译）和听力小对话 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  var TYPE_LABEL = {
    en2zh: '英译中', zh2en: '中译英', listen: '听音选词', listenSent: '听句选答',
    listenDialog: '听对话', listenSpell: '听写单词', blank: '选词补全', blankWrite: '补全拼写',
    order: '句子排序', sent2zh: '句意选择', grammar: '语法', zh2enWrite: '看中写英',
    listenZh2en: '听中写英', translate: '中译英（写）', translateZh: '英译中（写）',
    readcomp: '阅读理解',
    'gr-choice': '语法选择', 'gr-input': '语法书写', 'gr-order': '语法连词',
    'dict-word': '默写单词', 'dict-sent': '默写句子', 'dict-listen': '听音默写', 'dict-boost': '默写强化'
  };

  var TYPE_GROUP = {
    listen: '听力', listenSent: '听力', listenDialog: '听力', listenSpell: '听力', listenZh2en: '听力',
    zh2enWrite: '读写', blankWrite: '读写', translate: '读写', translateZh: '读写',
    en2zh: '单词', zh2en: '单词', blank: '句型', order: '句型', sent2zh: '句型',
    grammar: '语法', readcomp: '阅读',
    'gr-choice': '语法', 'gr-input': '语法', 'gr-order': '语法',
    'dict-word': '默写', 'dict-sent': '默写', 'dict-listen': '默写', 'dict-boost': '默写'
  };

  var CATEGORIES = [
    {
      key: 'listen', name: '听力', icon: '🎧',
      modes: [
        { key: 'listenAll', label: '听力综合', sub: '四种听力模式混合', count: 10 },
        { key: 'listenWord', label: '听音选词', sub: '听单词，选出来', count: 10 },
        { key: 'listenSentence', label: '听句子选答案', sub: '情境句理解', count: 10 },
        { key: 'listenSpell', label: '听音写单词', sub: '听发音，拼写出来', count: 10 },
        { key: 'listenDialog', label: '听力小对话', sub: '听对话，答问题', count: 8 }
      ]
    },
    {
      key: 'write', name: '读写', icon: '✍️',
      modes: [
        { key: 'writeAll', label: '读写综合', sub: '五种读写模式混合', count: 10 },
        { key: 'writeZh2en', label: '看中文写英文', sub: '根据中文写单词', count: 10 },
        { key: 'writeListenZh', label: '听中文写英文', sub: '中文提示 + 语音核对', count: 10 },
        { key: 'writeBlank', label: '句子补全', sub: '填写句中缺词', count: 10 },
        { key: 'writeTranslate', label: '句子互译', sub: '中译英 · 英译中', count: 10 }
      ]
    },
    {
      key: 'base', name: '单词句型', icon: '🔤',
      modes: [
        { key: 'words', label: '单词闯关', sub: '英译中 / 中译英 / 听音辨词', count: 10 },
        { key: 'sentences', label: '句型挑战', sub: '补全 / 排序 / 句意选择', count: 10 }
      ]
    },
    {
      key: 'grammar', name: '语法', icon: '📖',
      modes: [{ key: 'grammar', label: '语法专项', sub: '各单元知识点选择题', count: 10 }]
    },
    {
      key: 'mix', name: '综合', icon: '🏆',
      modes: [
        { key: 'mixed', label: '随机混合', sub: '全部题型随机 15 题', count: 15 },
        { key: 'exam', label: '综合测试', sub: '模拟测试 20 题（含听力与书写）', count: 20 }
      ]
    }
  ];

  var AUTOPLAY_TYPES = { listen: 1, listenSent: 1, listenSpell: 1, listenDialog: 1, sent2zh: 0 };

  function unitName(uid) {
    var u = Content.unitById(uid);
    return u ? 'U' + u.no : uid;
  }

  function modeOf(key) {
    var found = null;
    CATEGORIES.forEach(function (c) {
      c.modes.forEach(function (m) { if (m.key === key) found = m; });
    });
    return found;
  }

  var PracticeView = {
    render: function () {
      var s = App.session;
      if (s && !s.done) return renderQuestion(s);
      if (s && s.done) return renderScore(s);
      return renderConfig();
    },

    after: function () {
      var s = App.session;
      if (!s || s.done) return;
      var q = s.questions[s.idx];
      if (!q) return;

      /* 听力题自动播放（可在设置关闭） */
      var auto = Store.data.settings.listenAutoplay !== false;
      if (auto && !q._played && (q.type === 'listen' || q.type === 'listenSent' || q.type === 'listenSpell')) {
        q._played = true;
        setTimeout(function () {
          if (App.session === s && !s.answered) Util.speakWithState(q.speak, document.querySelector('.listen-btn'));
        }, 300);
      }
      if (auto && !q._played && q.kind === 'dialog') {
        q._played = true;
        setTimeout(function () {
          if (App.session === s && !s.answered) playDialog(q, false);
        }, 300);
      }

      /* 输入题回车提交 */
      var input = document.getElementById('ans-input');
      if (input && !s.answered) {
        input.focus();
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitInput();
          }
        });
      }
    },

    actions: {
      'practice:selectCat': function (d) {
        App.practiceCfg.cat = d.cat;
        App.practiceCfg.preset = CATEGORIES.filter(function (c) { return c.key === d.cat; })[0].modes[0].key;
        App.rerender();
      },
      'practice:selectScope': function (d) {
        App.practiceCfg.scope = d.scope;
        App.rerender();
      },
      'practice:selectMode': function (d) {
        App.practiceCfg.preset = d.preset;
        App.rerender();
      },
      'practice:start': function () {
        startFromConfig();
      },
      'practice:startWrong': function () {
        startWrongRetry();
      },
      'practice:replay': function (d, el) {
        /* 答题前后都允许重听题目音频（重播无判分副作用），播放中按钮呼吸提示 */
        var s = App.session;
        if (!s || s.done) return;
        var q = s.questions[s.idx];
        if (!q) return;
        if (q.kind === 'dialog') playDialog(q, true);
        else if (q.speak) Util.speakWithState(q.speak, el);
      },
      'practice:playDialog': function () {
        var s = App.session;
        if (!s || s.done) return;
        playDialog(s.questions[s.idx], true);
      },
      'practice:answer': function (d) {
        var s = App.session;
        if (!s || s.answered) return;
        var q = s.questions[s.idx];
        var idx = +d.idx;
        var correct = idx === q.answer;
        s.answered = true;
        s.results.push({ q: q, correct: correct, userAnswer: idx });
        if (!correct) Store.addWrong(q, idx);
        else if (q.wrongId) Store.resolveWrong(q.wrongId);
        App.rerender();
        if (correct) autoAdvance(s);
      },
      'practice:orderPick': function (d) {
        var s = App.session;
        if (!s || s.answered) return;
        var i = +d.i;
        if (s.orderUsed.indexOf(i) >= 0) return;
        s.orderUsed.push(i);
        s.orderPicks.push(i);
        App.rerender();
      },
      'practice:orderRemove': function (d) {
        var s = App.session;
        if (!s || s.answered) return;
        var i = +d.i;
        var pos = s.orderPicks.indexOf(i);
        if (pos >= 0) {
          s.orderPicks.splice(pos, 1);
          s.orderUsed = s.orderUsed.filter(function (x) { return s.orderPicks.indexOf(x) >= 0; });
          App.rerender();
        }
      },
      'practice:orderClear': function () {
        var s = App.session;
        if (!s || s.answered) return;
        s.orderPicks = [];
        s.orderUsed = [];
        App.rerender();
      },
      'practice:orderSubmit': function () {
        var s = App.session;
        if (!s || s.answered) return;
        var q = s.questions[s.idx];
        var built = s.orderPicks.map(function (i) { return q.options[i]; }).join(' ');
        var correct = built === q.answer;
        s.answered = true;
        s.results.push({ q: q, correct: correct, userAnswer: built });
        if (!correct) Store.addWrong(q, built);
        else if (q.wrongId) Store.resolveWrong(q.wrongId);
        App.rerender();
        if (correct) autoAdvance(s);
      },
      'practice:inputHint': function () {
        var s = App.session;
        if (!s || s.answered) return;
        var el = document.getElementById('input-hint');
        if (el) {
          el.textContent = '💡 提示：' + Gen.inputHint(s.questions[s.idx]);
          el.classList.remove('hidden');
        }
      },
      'practice:inputClear': function () {
        var el = document.getElementById('ans-input');
        if (el) { el.value = ''; el.focus(); }
      },
      'practice:inputSubmit': function () {
        submitInput();
      },
      'practice:speakAnswer': function (d, el) {
        var s = App.session;
        if (!s) return;
        var q = s.questions[s.idx];
        var text = q.checkSpeak || q.answers && q.answers[0] || q.answer;
        Util.speakWithState(text, el);
      },
      'practice:next': function () {
        nextQuestion(App.session);
      },
      'practice:quit': function () {
        if (window.confirm('退出后本组成绩不会保存，确定退出吗？')) {
          Speaker.stop();
          App.session = null;
          App.rerender();
        }
      },
      'practice:again': function () {
        var s = App.session;
        var cfg = s ? s.cfg : null;
        App.session = null;
        if (cfg && cfg.wrongRetry) startWrongRetry();
        else if (cfg) App.startPractice(cfg.unitIds, cfg.preset, cfg.title, cfg.count);
        else App.rerender();
      },
      'practice:back': function () {
        Speaker.stop();
        App.session = null;
        App.rerender();
      }
    }
  };

  function autoAdvance(s) {
    setTimeout(function () {
      if (App.session === s && s.answered && App.route === 'practice') nextQuestion(s);
    }, 900);
  }

  function playDialog(q, manual) {
    if (!q || !q.dialog) {
      if (manual) Util.toast('没有可播放的对话内容', 'warn');
      return;
    }
    var lines = q.dialog.lines;
    var texts = lines.map(function (l) { return l.en; });
    var pitchFn = function (i) { return lines[i] && lines[i].who === 'B' ? 1.25 : 0.9; };
    var btn = document.getElementById('dialog-play-state');
    var playBtn = document.querySelector('.listen-btn-sm');
    if (playBtn) playBtn.classList.add('is-playing');
    Speaker.speakQueue(texts, {
      gap: 600,
      pitchFn: pitchFn,
      onItem: function (i) {
        if (btn) btn.innerHTML = Util.icon("volume", 18) + ' 正在播放第 ' + (i + 1) + '/' + texts.length + ' 句…';
      },
      onDone: function () {
        if (playBtn) playBtn.classList.remove('is-playing');
        if (btn) btn.textContent = '播放结束，可点击重听';
      }
    });
  }

  function submitInput() {
    var s = App.session;
    if (!s || s.answered) return;
    var input = document.getElementById('ans-input');
    if (!input) return;
    var user = input.value.trim();
    if (!user) {
      Util.toast('先写一写再提交哦', 'warn');
      input.focus();
      return;
    }
    var q = s.questions[s.idx];
    var g = Gen.gradeInput(user, q);
    var correct = g.verdict !== 'wrong'; /* close 也计为正确，提示核对 */
    s.answered = true;
    s.results.push({ q: q, correct: correct, userAnswer: user, close: g.verdict === 'close' });
    if (!correct) Store.addWrong(q, user);
    else if (q.wrongId) Store.resolveWrong(q.wrongId);
    App.rerender();
    if (correct) autoAdvance(s);
  }

  function nextQuestion(s) {
    if (!s) return;
    s.answered = false;
    s.orderPicks = [];
    s.orderUsed = [];
    s.idx++;
    if (s.idx >= s.questions.length) finishSession(s);
    App.rerender();
  }

  function finishSession(s) {
    s.done = true;
    var correct = s.results.filter(function (r) { return r.correct; }).length;
    var total = s.questions.length;
    /* 语法专项会话：记录到对应语法主题 */
    if (s.cfg && s.cfg.grammar) {
      Store.recordGrammarSession(s.cfg.grammar, total, correct);
    }
    var byUnit = {};
    s.results.forEach(function (r) {
      var uid = r.q.unitId || '-';
      if (!byUnit[uid]) byUnit[uid] = { total: 0, correct: 0 };
      byUnit[uid].total++;
      if (r.correct) byUnit[uid].correct++;
    });
    Object.keys(byUnit).forEach(function (uid) {
      if (uid === '-') return;
      Store.recordSession(uid, byUnit[uid].total, byUnit[uid].correct, true);
    });
    Store.logDaySession(total, correct);
    Store.recordTypeStats(s.results);
    Speaker.stop();
  }

  /* ---------- 配置页 ---------- */

  function renderConfig() {
    var cfg = App.practiceCfg;
    var units = Content.data.units;

    var catTabs = CATEGORIES.map(function (c) {
      return '<button class="cat-tab' + (cfg.cat === c.key ? ' active' : '') + '" data-action="practice:selectCat" data-cat="' + c.key + '">' +
        c.icon + ' ' + c.name + '</button>';
    }).join('');

    var cat = CATEGORIES.filter(function (c) { return c.key === cfg.cat; })[0] || CATEGORIES[0];
    var modeCards = cat.modes.map(function (m) {
      return '<button class="mode-card' + (cfg.preset === m.key ? ' on' : '') + '" data-action="practice:selectMode" data-preset="' + m.key + '">' +
        '<span class="mode-label">' + m.label + '</span>' +
        '<span class="mode-sub">' + m.sub + ' · ' + m.count + ' 题</span>' +
        '</button>';
    }).join('');

    var scopeChips = ['<button class="chip-scope' + (cfg.scope === 'all' ? ' on' : '') + '" data-action="practice:selectScope" data-scope="all">🌐 全册混合</button>'];
    units.forEach(function (u) {
      scopeChips.push('<button class="chip-scope' + (cfg.scope === u.id ? ' on' : '') + '" data-action="practice:selectScope" data-scope="' + u.id + '">' + u.emoji + ' U' + u.no + '</button>');
    });

    var wrongCount = Store.unresolvedCount();
    var wrongCard = wrongCount
      ? '<div class="card wrong-entry-card"><div class="card-title">📕 错题重练（' + wrongCount + ' 题待消灭）</div>' +
        '<div class="muted small">重做答对的错题会自动“消灭”，消灭错题也是每日任务之一</div>' +
        '<button class="btn btn-primary btn-block" data-action="practice:startWrong">开始错题重练</button></div>'
      : '';

      return '' +
        '<header class="page-head"><div class="book-title">✏️ 练习</div>' +
        '<div class="book-sub">听力 · 读写 · 单词句型 · 语法 · 综合</div></header>' +
        '<button class="btn btn-block dict-entry" data-nav="#/dictation">✍️ 看图默写 · 单词句子听写（独立专项）</button>' +
        wrongCard +
      '<div class="card">' +
      '<div class="cat-tabs">' + catTabs + '</div>' +
      '<div class="card-title">1️⃣ 选择范围</div>' +
      '<div class="scope-row">' + scopeChips.join('') + '</div>' +
      '<div class="card-title" style="margin-top:14px">2️⃣ 选择模式</div>' +
      '<div class="mode-grid">' + modeCards + '</div>' +
      (cfg.cat === 'grammar'
        ? '<button class="btn btn-block grammar-entry" data-nav="#/grammar">📘 先去「语法用法与讲解」边学边练（推荐）</button>'
        : '') +
      '<button class="btn btn-primary btn-block btn-lg" data-action="practice:start">🚀 开始练习</button>' +
      '<div class="muted small" style="margin-top:8px">🎧 听力题使用设备语音合成朗读（可在设置中调节语速/关闭自动播放）；✍️ 书写题会忽略大小写与标点差异判分，句子意思基本一致即算通过。</div>' +
      '</div>';
  }

  function startFromConfig() {
    var cfg = App.practiceCfg;
    var unitIds = cfg.scope === 'all' ? Content.data.units.map(function (u) { return u.id; }) : [cfg.scope];
    var mode = modeOf(cfg.preset) || { label: '练习', count: 10 };
    App.startPractice(unitIds, cfg.preset, mode.label, mode.count);
  }

  function startWrongRetry() {
    /* 阅读理解错题需要结合原文，跳过（在错题本里提供“去原文重做”） */
    var entries = Store.data.wrong.filter(function (w) { return !w.resolved && w.source !== 'reading'; });
    if (!entries.length) {
      Util.toast('太棒了！没有待消灭的错题 🎉');
      return;
    }
    var questions = Util.shuffle(entries).slice(0, 20).map(function (w) {
      return {
        id: Util.uid(),
        fingerprint: w.fingerprint,
        unitId: w.unitId,
        source: w.source,
        articleId: w.articleId,
        topicId: w.topicId,
        type: w.type,
        kind: w.kind,
        lang: w.lang,
        stem: w.stem,
        stemZh: w.stemZh,
        speak: w.speak,
        checkSpeak: w.checkSpeak,
        dialog: w.dialog,
        options: w.options,
        answer: w.answer,
        answers: w.answers,
        explain: w.explain,
        wrongId: w.id
      };
    });
    App.session = {
      title: '错题重练',
      cfg: { wrongRetry: true },
      questions: questions,
      idx: 0,
      results: [],
      answered: false,
      orderPicks: [],
      orderUsed: [],
      done: false
    };
    App.rerender();
  }

  /* ---------- 答题页 ---------- */

  function renderQuestion(s) {
    var q = s.questions[s.idx];
    /* 题目缺失（空会话/越界）时给出可退出的提示，避免渲染崩溃 */
    if (!q) {
      return '<div class="card">这组题目暂时为空。<div class="input-ops" style="margin-top:10px">' +
        '<button class="btn btn-primary" data-action="practice:back">' + Util.icon("left", 16) + ' 返回</button></div></div>';
    }
    var progress = (s.idx + 1) + ' / ' + s.questions.length;
    var pct = Math.round((s.idx) * 100 / s.questions.length);

    var head = '' +
      '<header class="quiz-head">' +
      '<button class="btn btn-mini" data-action="practice:quit">' + Util.icon("x", 14) + ' 退出</button>' +
      '<div class="quiz-title">' + esc(s.title) + '</div>' +
      '<div class="quiz-progress-text">' + progress + '</div>' +
      '</header>' +
      '<div class="quiz-progress"><div class="quiz-progress-fill" style="width:' + pct + '%"></div></div>';

    var body = '';
    if (q.kind === 'order') body = renderOrderQ(s, q);
    else if (q.kind === 'input') body = renderInputQ(s, q);
    else if (q.kind === 'dialog') body = renderDialogQ(s, q);
    else body = renderChoiceQ(s, q);

    return head + body;
  }

  function badge(q) {
    return '<div class="q-type-badge">' + (TYPE_LABEL[q.type] || q.type) + ' · ' + unitName(q.unitId) + '</div>';
  }

  function renderChoiceQ(s, q) {
    var html = '<section class="card quiz-card">' + badge(q);
    if (q.type === 'listen' || q.type === 'listenSent' || q.type === 'listenSpell') {
      html += '<div class="q-listen">' +
        '<button class="listen-btn" data-action="practice:replay" aria-label="重新播放">' + Util.icon("volume", 18) + '</button>' +
        '<div class="q-stem-hint">' + esc(q.stem) + '</div>' +
        '</div>';
    } else {
      var isEnStem = q.type === 'en2zh' || q.type === 'sent2zh' || q.type === 'blank';
      html += '<div class="q-stem-row">';
      if (isEnStem && q.speak) {
        html += '<button class="icon-btn" data-action="practice:replay" aria-label="朗读题目">' + Util.icon("volume", 18) + '</button>';
      }
      html += '<div class="q-stem">' + esc(q.stem) + '</div></div>';
    }
    if (q.stemZh) html += '<div class="q-stem-zh">' + esc(q.stemZh) + '</div>';

    html += '<div class="options' + (s.answered ? ' answered' : '') + '">';
    q.options.forEach(function (opt, i) {
      var cls = 'opt';
      if (s.answered) {
        if (i === q.answer) cls += ' correct';
        else if (i === s.results[s.results.length - 1].userAnswer) cls += ' wrong';
      }
      html += '<button class="' + cls + '" data-action="practice:answer" data-idx="' + i + '">' +
        '<span class="opt-key">' + 'ABCD'[i] + '</span>' + esc(opt) + '</button>';
    });
    html += '</div></section>';
    html += feedbackHtml(s, q);
    return html;
  }

  function renderDialogQ(s, q) {
    var html = '<section class="card quiz-card">' + badge(q);
    html += '<div class="dialog-play-box">' +
      '<button class="listen-btn listen-btn-sm" data-action="practice:playDialog">' + Util.icon("play", 20) + '</button>' +
      '<div class="dialog-play-info"><div class="q-stem">🎧 听对话，回答问题</div>' +
      '<div class="q-stem-hint" id="dialog-play-state">' +
      (Store.data.settings.listenAutoplay !== false ? '正在自动播放…' : '点击左侧按钮播放对话') +
      '</div></div></div>';
    html += '<div class="q-stem" style="font-size:19px">' + esc(q.stem) + '</div>';

    html += '<div class="options' + (s.answered ? ' answered' : '') + '">';
    q.options.forEach(function (opt, i) {
      var cls = 'opt';
      if (s.answered) {
        if (i === q.answer) cls += ' correct';
        else if (i === s.results[s.results.length - 1].userAnswer) cls += ' wrong';
      }
      html += '<button class="' + cls + '" data-action="practice:answer" data-idx="' + i + '">' +
        '<span class="opt-key">' + 'ABCD'[i] + '</span>' + esc(opt) + '</button>';
    });
    html += '</div>';

    /* 答完显示对话原文要点 */
    if (s.answered && q.dialog) {
      html += '<div class="dialog-lines"><div class="dl-title">📜 对话原文</div>';
      q.dialog.lines.forEach(function (l) {
        html += '<div class="dl-line"><span class="dl-who">' + esc(l.who) + '</span>' +
          '<span class="dl-en">' + esc(l.en) + '</span>' +
          '<span class="dl-zh">' + esc(l.zh) + '</span></div>';
      });
      html += '</div>';
    }
    html += '</section>';
    html += feedbackHtml(s, q);
    return html;
  }

  function renderInputQ(s, q) {
    var html = '<section class="card quiz-card">' + badge(q);

    if (q.type === 'listenSpell') {
      html += '<div class="q-listen">' +
        '<button class="listen-btn" data-action="practice:replay" aria-label="重新播放">' + Util.icon("volume", 18) + '</button>' +
        '<div class="q-stem-hint">听单词，在下方拼出来</div></div>';
    } else {
      var isEnStem = q.type === 'translateZh' || q.type === 'blankWrite';
      html += '<div class="q-stem-row">';
      if (isEnStem && q.speak) {
        html += '<button class="icon-btn" data-action="practice:replay" aria-label="朗读题目">' + Util.icon("volume", 18) + '</button>';
      }
      html += '<div class="q-stem ' + (q.lang === 'zh' ? '' : '') + '">' + esc(q.stem) + '</div></div>';
    }
    if (q.stemZh) html += '<div class="q-stem-zh">' + esc(q.stemZh) + '</div>';

    if (!s.answered) {
      html += '<div class="input-box">' +
        '<input id="ans-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'placeholder="' + (q.lang === 'zh' ? '在这里输入中文…' : '在这里输入英文…') + '">' +
        '</div>' +
        '<div id="input-hint" class="hint-text hidden"></div>' +
        '<div class="input-ops">' +
        '<button class="btn btn-mini" data-action="practice:inputHint">💡 提示</button>' +
        '<button class="btn btn-mini" data-action="practice:inputClear">🧹 清空</button>' +
        '<button class="btn btn-primary" data-action="practice:inputSubmit">' + Util.icon("check", 17) + ' 提交</button>' +
        '</div>';
    } else {
      var last = s.results[s.results.length - 1];
      var ref = q.answers && q.answers[0];
      html += '<div class="input-your"><span class="muted small">你的答案</span><div class="iy-text">' + esc(last.userAnswer || '') + '</div></div>' +
        '<div class="input-ref"><span class="muted small">参考答案</span><div class="ir-text">' + esc(ref || q.answer) + '</div>' +
        (ref ? '<button class="icon-btn mini" data-action="practice:speakAnswer">' + Util.icon("volume", 18) + '</button>' : '') +
        '</div>';
    }
    html += '</section>';
    html += feedbackHtml(s, q);
    return html;
  }

  function renderOrderQ(s, q) {
    var html = '<section class="card quiz-card">';
    html += badge(q);
    html += '<div class="q-stem-row">' +
      '<button class="icon-btn" data-action="practice:replay" aria-label="朗读句子">' + Util.icon("volume", 18) + '</button>' +
      '<div class="q-stem q-stem-zh-only">' + esc(q.stem) + '</div></div>' +
      '<div class="q-stem-zh">' + esc(q.stemZh) + '</div>';

    html += '<div class="order-done" id="order-done">';
    s.orderPicks.forEach(function (i) {
      html += '<button class="chip done" data-action="practice:orderRemove" data-i="' + i + '">' + esc(q.options[i]) + '</button>';
    });
    if (!s.orderPicks.length) html += '<span class="order-placeholder">按顺序点击下面的单词</span>';
    html += '</div>';

    html += '<div class="order-pool">';
    q.options.forEach(function (w, i) {
      var used = s.orderUsed.indexOf(i) >= 0;
      html += '<button class="chip' + (used ? ' used' : '') + '"' + (used ? '' : ' data-action="practice:orderPick" data-i="' + i + '"') + '>' + esc(w) + '</button>';
    });
    html += '</div>';

    html += '<div class="order-ops">';
    html += '<button class="btn btn-mini" data-action="practice:orderClear">↺ 重排</button>';
    if (!s.answered) html += '<button class="btn btn-primary" data-action="practice:orderSubmit" ' + (s.orderPicks.length ? '' : 'disabled') + '>确定</button>';
    html += '</div>';

    if (s.answered) {
      var last = s.results[s.results.length - 1];
      html += '<div class="order-answer">' +
        (last.correct ? '<span class="fb correct">' + Util.icon("check", 14) + ' 拼对了！</span>' : '<span class="fb wrong">✗ 再看看</span>') +
        '<div class="order-correct-sentence">' + esc(q.answer) + '</div></div>';
    }
    html += '</section>';
    html += feedbackHtml(s, q);
    return html;
  }

  function feedbackHtml(s, q) {
    if (!s.answered) return '';
    var last = s.results[s.results.length - 1];
    var isLast = s.idx + 1 >= s.questions.length;
    var nextLabel = isLast ? '查看成绩 ' + Util.icon("right", 16) + '' : '下一题 ' + Util.icon("right", 16) + '';
    if (last.correct) {
      var extra = last.close ? '（忽略大小写/标点后基本一致，记得对照参考答案检查拼写）' : '';
      return '<div class="fb-banner fb-correct">🎉 做对了！' + extra +
        (isLast ? '' : ' 自动进入下一题…') +
        (isLast ? '<button class="btn btn-primary btn-block" data-action="practice:next" style="margin-top:10px">' + nextLabel + '</button>' : '') +
        '</div>';
    }
    var userText = last.userAnswer;
    var correctText = q.kind === 'order' ? q.answer : (q.answers ? q.answers[0] : q.options[q.answer]);
    var html = '<div class="fb-banner fb-wrong">' +
      '<div class="fb-title">' + Util.icon("x", 15) + ' 再接再厉</div>' +
      '<div class="fb-line">你的答案：' + esc(userText != null ? userText : '') + '</div>' +
      '<div class="fb-line fb-ans">正确答案：<b>' + esc(correctText != null ? correctText : '') + '</b></div>' +
      (correctText && q.lang !== 'zh' ? '<button class="btn btn-mini" data-action="practice:speakAnswer">' + Util.icon("volume", 18) + ' 听正确答案</button>' : '') +
      (q.explain ? '<div class="fb-explain">💡 ' + esc(q.explain) + '</div>' : '') +
      '<button class="btn btn-primary btn-block" data-action="practice:next">' + nextLabel + '</button>' +
      '</div>';
    return html;
  }

  /* ---------- 成绩页 ---------- */

  function renderScore(s) {
    var correct = s.results.filter(function (r) { return r.correct; }).length;
    var total = s.questions.length;
    var score = total ? Math.round(correct * 100 / total) : 0;
    var emoji = score >= 90 ? '🌟' : score >= 70 ? '👍' : '💪';
    var msg = score >= 90 ? '太厉害了！继续保持！' : score >= 70 ? '很棒！再练一组会更熟练！' : '别灰心，看看错题解析，再来一次！';

    /* 分题型表现 */
    var byType = {};
    s.results.forEach(function (r) {
      var t = r.q.type;
      if (!byType[t]) byType[t] = { total: 0, correct: 0 };
      byType[t].total++;
      if (r.correct) byType[t].correct++;
    });
    var typeRows = Object.keys(byType).map(function (t) {
      var d = byType[t];
      var pct = Math.round(d.correct * 100 / d.total);
      var weak = pct < 60;
      return '<div class="stype-row' + (weak ? ' weak' : '') + '">' +
        '<span class="st-name">' + (TYPE_LABEL[t] || t) + '</span>' +
        '<span class="st-bar"><span class="progress-track"><span class="progress-fill" style="width:' + pct + '%"></span></span></span>' +
        '<span class="st-num">' + d.correct + '/' + d.total + '</span></div>';
    }).join('');
    var weakTypes = Object.keys(byType).filter(function (t) {
      return byType[t].correct / byType[t].total < 0.6;
    });

    var wrongs = s.results.filter(function (r) { return !r.correct; });
    var wrongHtml = '';
    if (wrongs.length) {
      wrongHtml = '<div class="card"><div class="card-title">📕 本组错题（已加入错题本）</div>';
      wrongs.forEach(function (r) {
        wrongHtml += '<div class="score-wrong-item">' +
          '<div class="sw-type">' + (TYPE_LABEL[r.q.type] || r.q.type) + '</div>' +
          '<div class="sw-stem">' + esc(r.q.stem) + '</div>' +
          '<div class="sw-ans">正确答案：<b>' + esc(r.q.kind === 'order' ? r.q.answer : (r.q.answers ? r.q.answers[0] : r.q.options[r.q.answer])) + '</b></div>' +
          (r.q.explain ? '<div class="sw-ex">💡 ' + esc(r.q.explain) + '</div>' : '') +
          '</div>';
      });
      wrongHtml += '</div>';
    }

    return '' +
      '<div class="card score-card">' +
      '<div class="score-emoji">' + emoji + '</div>' +
      '<div class="score-num">' + score + '<small> 分</small></div>' +
      '<div class="score-detail">答对 ' + correct + ' 题 / 共 ' + total + ' 题</div>' +
      '<div class="score-msg">' + msg + '</div>' +
      (typeRows ? '<div class="score-types"><div class="card-title" style="text-align:left">📊 各题型表现</div>' + typeRows +
        (weakTypes.length ? '<div class="muted small" style="text-align:left">建议：' + weakTypes.map(function (t) { return TYPE_LABEL[t] || t; }).join('、') + ' 还不熟练，可以做对应专项练习。</div>' : '') +
        '</div>' : '') +
      (wrongs.length ? '<div class="score-tip">错题已记入错题本，可以去「错题本」重练消灭它们</div>' : '<div class="score-tip">全对，没有错题！🎉</div>') +
      '<div class="score-ops">' +
      '<button class="btn btn-primary" data-action="practice:again">🔄 再来一组</button>' +
      '<button class="btn" data-action="practice:back">返回练习</button>' +
      '</div>' +
      '</div>' + wrongHtml;
  }

  global.PracticeView = PracticeView;
  /* 供错题本页调用 */
  PracticeView.startWrongRetry = startWrongRetry;
  PracticeView.TYPE_LABEL = TYPE_LABEL;
  PracticeView.TYPE_GROUP = TYPE_GROUP;
})(window);
