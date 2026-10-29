/* 语法专项（V2.1）：主题列表 + 知识点讲解页
   讲解页含：场景、规则（公式/例句点读/错误对比/口诀/即时练习）、
   中英切换、掌握标记、收藏、上一主题/下一主题、开始主题练习 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  function topicById(id) {
    return GRAMMAR_CONTENT.topics.filter(function (t) { return t.id === id; })[0] || null;
  }

  function qfp(topicId, ruleIdx) {
    return 'gr|' + topicId + '|' + ruleIdx;
  }

  /* 把数据里的题目包装成练习模块的同构题目（用于即时练习与错题入库） */
  function wrapQuiz(raw, topic, tag) {
    var q = {
      id: Util.uid(),
      fingerprint: raw.fingerprint || qfp(topic.id, tag),
      unitId: '',
      source: 'grammar',
      topicId: topic.id,
      type: raw.type,
      kind: raw.kind,
      lang: raw.lang || '',
      stem: raw.stem,
      stemZh: raw.stemZh || '',
      speak: raw.speak || '',
      options: raw.options || null,
      answer: raw.answer,
      answers: raw.answers || null,
      explain: raw.explain || '',
      level: raw.level || 1
    };
    if (q.kind === 'order') q.speak = raw.speak || raw.answer;
    return q;
  }

  /* ---------- 主题列表页 ---------- */

  var GrammarView = {
    render: function () {
      var topics = GRAMMAR_CONTENT.topics;
      var learned = 0, mastered = 0, review = 0, sessions = 0, totalQ = 0, correctQ = 0;

      var cards = topics.map(function (t, i) {
        var st = Store.data.grammar ? (Store.data.grammar.topics[t.id] || {}) : {};
        var state = st.state || '';
        if (st.lastAt) learned++;
        if (state === 'mastered') mastered++;
        if (state === 'review') review++;
        if (st.sessions) { sessions += st.sessions; totalQ += st.total; correctQ += st.correct; }
        var units = (t.unitIds || []).map(function (uid) {
          var u = Content.unitById(uid);
          return u ? 'U' + u.no : '';
        }).join(' · ');
        var acc = st.total ? Math.round(st.correct * 100 / st.total) : null;
        var fav = Store.isGrammarFav(t.id);
        return '<button class="gram-card' + (state === 'mastered' ? ' is-mastered' : state === 'review' ? ' is-review' : '') + '" data-nav="#/grammar/' + t.id + '">' +
          '<span class="gram-emoji">' + t.emoji + '</span>' +
          '<span class="gram-info">' +
          '<span class="gram-title">' + esc(t.title) + '</span>' +
          '<span class="gram-sub muted small">关联单元（待核实）：' + (units || '—') + ' · ' + t.rules.length + ' 条规则</span>' +
          '<span class="gram-prog">' +
          (acc !== null ? '<span class="rd-badge ok">练习 ' + acc + '%</span>' : '<span class="rd-badge">未练习</span>') +
          (state === 'mastered' ? '<span class="rd-badge ok">✓ 已掌握</span>' : '') +
          (state === 'review' ? '<span class="rd-badge">↻ 需复习</span>' : '') +
          '</span></span>' +
          '<span class="gram-go">›</span>' +
          (fav ? '<span class="gram-fav">★</span>' : '') +
          '</button>';
      }).join('');

      var acc = totalQ ? Math.round(correctQ * 100 / totalQ) : 0;
      return '' +
        '<header class="page-head"><div class="book-title">📘 语法专项</div>' +
        '<div class="book-sub">围绕教材单元句型讲解 · 讲一点练一点</div></header>' +

        '<section class="card hero-card"><div class="hero-stats">' +
        '<div class="hero-stat"><div class="hero-num">' + learned + '<small>/' + topics.length + '</small></div><div class="hero-label">已学习主题</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + mastered + '</div><div class="hero-label">已掌握</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + review + '</div><div class="hero-label">需复习</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + (totalQ ? acc + '<small>%</small>' : '—') + '</div><div class="hero-label">练习正确率</div></div>' +
        '</div></section>' +

        '<div class="source-tip">📘 内容说明：讲解与练习为本工具围绕教材各单元句型自编（非教材原文）；主题与单元的关联为自编整理（待核实）。例句发音为语音合成。</div>' +

        '<div class="gram-list">' + cards + '</div>';
    },

    actions: {}
  };

  /* ---------- 知识点讲解页 ---------- */

  var GrammarTopicView = {
    render: function () {
      var id = App.state.topicId;
      var t = topicById(id);
      if (!t) return '<div class="card">未找到该语法主题 <button class="btn btn-mini" data-nav="#/grammar">返回列表</button></div>';

      var st = App.grammarUI || (App.grammarUI = {});
      if (st.id !== id) {
        st.id = id;
        st.showZh = Store.data.settings.showZh !== false;
        st.quiz = {};      /* 即时练习作答 { ruleIdx: {answered, correct, user} } */
      }
      var idx = GRAMMAR_CONTENT.topics.indexOf(t);
      var stat = Store.grammarTopicStat(t.id);
      var fav = Store.isGrammarFav(t.id);
      var units = (t.unitIds || []).map(function (uid) {
        var u = Content.unitById(uid);
        return u ? '<button class="chip-scope mini-chip" data-nav="#/unit/' + u.id + '">U' + u.no + ' ' + esc(u.title) + '</button>' : '';
      }).join(' ');

      var rulesHtml = t.rules.map(function (r, ri) {
        var ex = (r.examples || []).map(function (e) {
          var enHtml = esc(e.en);
          if (e.hl && e.hl.length) {
            var hl = e.hl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            enHtml = enHtml.replace(new RegExp('(' + hl + ')', 'gi'), '<b class="hl-word">$1</b>');
          }
          return '<div class="gex">' +
            '<button class="icon-btn mini" data-action="gt:play" data-text="' + esc(e.en) + '">' + Util.icon("volume", 18) + '</button>' +
            '<span class="gex-en">' + enHtml + '</span>' +
            (st.showZh ? '<span class="gex-zh">' + esc(e.zh) + '</span>' : '') +
            '</div>';
        }).join('');

        var wrongHtml = r.wrong
          ? '<div class="wrong-compare">' +
            '<div class="wc-bad">❌ ' + esc(r.wrong.bad) + '</div>' +
            '<div class="wc-good">✅ ' + esc(r.wrong.good) + '</div>' +
            '<div class="wc-why muted small">' + esc(r.wrong.why) + '</div></div>'
          : '';

        var tipHtml = r.tip ? '<div class="g-tip">💡 ' + esc(r.tip) + '</div>' : '';

        return '<section class="card rule-card">' +
          '<div class="rule-head"><span class="rule-no">' + (ri + 1) + '</span>' + esc(r.title) + '</div>' +
          '<div class="rule-explain">' + esc(r.explain) + '</div>' +
          '<div class="formula">' + esc(r.formula) + '</div>' +
          ex + wrongHtml + tipHtml +
          renderMiniQuiz(r.quiz, t, ri, st) +
          '</section>';
      }).join('');

      var prev = GRAMMAR_CONTENT.topics[idx - 1];
      var next = GRAMMAR_CONTENT.topics[idx + 1];

      return '' +
        '<header class="unit-head">' +
        '<button class="btn btn-back" data-nav="#/grammar">' + Util.icon("left", 15) + ' 语法</button>' +
        '<div class="unit-head-info"><span class="unit-head-emoji">' + t.emoji + '</span>' +
        '<div><div class="unit-head-name">' + esc(t.title) + '</div>' +
        '<div class="unit-head-zh">关联单元（待核实）：</div></div></div>' +
        '<button class="fav-btn big' + (fav ? ' on' : '') + '" data-action="gt:fav">' + (fav ? '★' : '☆') + '</button>' +
        '</header>' +
        '<div class="unit-unit-chips">' + units + '</div>' +

        '<div class="toolbar">' +
        '<button class="btn btn-mini" data-action="gt:toggleZh">' + (st.showZh ? '🙈 隐藏中文' : '🐵 显示中文') + '</button>' +
        '<button class="mark-btn mark-ok' + (stat.state === 'mastered' ? ' on' : '') + '" data-action="gt:state" data-s="mastered">✓ 已掌握</button>' +
        '<button class="mark-btn mark-review' + (stat.state === 'review' ? ' on' : '') + '" data-action="gt:state" data-s="review">↻ 需复习</button>' +
        '</div>' +

        '<section class="card scene-card"><div class="card-title">🎯 什么时候用</div>' +
        '<div class="rule-explain">' + esc(t.scene) + '</div></section>' +

        '<div class="section-title">📖 语法规则</div>' +
        rulesHtml +

        '<div class="card">' +
        '<div class="card-title">✏️ 主题练习（' + t.practice.length + ' 题，先基础后应用）</div>' +
        '<div class="muted small">答错的题会自动进入错题本，并关联本语法主题</div>' +
        '<button class="btn btn-primary btn-block btn-lg" data-action="gt:practice">🚀 开始主题练习</button>' +
        (stat.sessions ? '<div class="muted small" style="margin-top:8px">已练 ' + stat.sessions + ' 组 · 正确率 ' + (stat.total ? Math.round(stat.correct * 100 / stat.total) : 0) + '%</div>' : '') +
        '</div>' +

        '<div class="gt-nav">' +
        (prev ? '<button class="btn" data-nav="#/grammar/' + prev.id + '">‹ ' + esc(prev.title.slice(0, 10)) + '</button>' : '<span></span>') +
        (next ? '<button class="btn" data-nav="#/grammar/' + next.id + '">' + esc(next.title.slice(0, 10)) + ' ›</button>' : '<span></span>') +
        '</div>';
    },

    after: function () {
      Store.touchGrammarTopic(App.state.topicId);
    },

    actions: {
      'gt:play': function (d) { Speaker.speak(d.text); },
      'gt:toggleZh': function () {
        App.grammarUI.showZh = !App.grammarUI.showZh;
        App.rerender();
      },
      'gt:fav': function () {
        var on = Store.toggleGrammarFav(App.state.topicId);
        Util.toast(on ? '已收藏 ★' : '已取消收藏');
        App.rerender();
      },
      'gt:state': function (d) {
        Store.setGrammarTopicState(App.state.topicId, d.s);
        Util.toast(d.s === 'mastered' ? '已标记掌握' : '已标记需复习');
        App.rerender();
      },
      'gt:practice': function () {
        var t = topicById(App.state.topicId);
        if (!t) return;
        var qs = t.practice.slice().sort(function (a, b) { return (a.level || 1) - (b.level || 1); })
          .map(function (raw, i) {
            var q = wrapQuiz(raw, t, 'p' + i);
            q.fingerprint = 'gr|' + t.id + '|p' + i;
            return q;
          });
        App.startGrammarSession(t, qs, '基础在前 · 应用在后');
      },
      /* 即时练习 */
      'gt:quizAnswer': function (d) {
        var t = topicById(App.state.topicId);
        var r = t.rules[+d.ri];
        var q = wrapQuiz(r.quiz, t, 'r' + d.ri);
        var ui = App.grammarUI;
        if (ui.quiz[d.ri]) return;
        var idx = +d.oi;
        var correct = idx === q.answer;
        ui.quiz[d.ri] = { answered: true, correct: correct, user: idx };
        if (!correct) Store.addWrong(q, idx);
        else {
          Store.data.wrong.forEach(function (w) {
            if (w.fingerprint === q.fingerprint && !w.resolved) Store.resolveWrong(w.id);
          });
        }
        App.rerender();
      },
      'gt:quizSubmit': function (d) {
        var t = topicById(App.state.topicId);
        var ri = +d.ri;
        var input = document.getElementById('gt-input-' + ri);
        if (!input) return;
        var user = input.value.trim();
        if (!user) { Util.toast('先写一写再提交哦', 'warn'); input.focus(); return; }
        var r = t.rules[ri];
        var q = wrapQuiz(r.quiz, t, 'r' + ri);
        var g = Gen.gradeInput(user, q);
        var correct = g.verdict !== 'wrong';
        App.grammarUI.quiz[ri] = { answered: true, correct: correct, user: user, close: g.verdict === 'close' };
        if (!correct) Store.addWrong(q, user);
        else {
          Store.data.wrong.forEach(function (w) {
            if (w.fingerprint === q.fingerprint && !w.resolved) Store.resolveWrong(w.id);
          });
        }
        App.rerender();
      },
      'gt:quizHint': function (d) {
        var t = topicById(App.state.topicId);
        var r = t.rules[+d.ri];
        var q = wrapQuiz(r.quiz, t, 'r' + d.ri);
        var el = document.getElementById('gt-hint-' + d.ri);
        if (el) { el.textContent = '💡 提示：' + Gen.inputHint(q); el.classList.remove('hidden'); }
      },
      'gt:quizSpeak': function (d) {
        var t = topicById(App.state.topicId);
        var r = t.rules[+d.ri];
        var q = wrapQuiz(r.quiz, t, 'r' + d.ri);
        var text = q.speak || q.answers && q.answers[0] || q.answer;
        if (text) Speaker.speak(text);
      }
    }
  };

  /* 规则卡内嵌的即时练习 */
  function renderMiniQuiz(raw, topic, ri, st) {
    if (!raw) return '';
    var q = wrapQuiz(raw, topic, 'r' + ri);
    var done = st.quiz[ri];
    var html = '<div class="mini-quiz">' +
      '<div class="mq-title">✏️ 试一试</div>' +
      '<div class="qi-stem">' + esc(q.stem) + (q.stemZh ? '<span class="muted small" style="display:block">' + esc(q.stemZh) + '</span>' : '') + '</div>';

    if (q.kind === 'choice') {
      html += '<div class="options' + (done ? ' answered' : '') + (q.options.length === 2 ? ' judge' : '') + '">';
      q.options.forEach(function (o, oi) {
        var cls = 'opt';
        if (done) {
          if (oi === q.answer) cls += ' correct';
          else if (oi === done.user) cls += ' wrong';
        }
        html += '<button class="' + cls + '" ' + (done ? '' : 'data-action="gt:quizAnswer" data-ri="' + ri + '" data-oi="' + oi + '"') +
          '><span class="opt-key">' + 'ABCD'[oi] + '</span>' + esc(o) + '</button>';
      });
      html += '</div>';
    } else if (q.kind === 'input') {
      if (!done) {
        html += '<div class="input-box"><input id="gt-input-' + ri + '" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="在这里输入英文…"></div>' +
          '<div id="gt-hint-' + ri + '" class="hint-text hidden"></div>' +
          '<div class="input-ops">' +
          '<button class="btn btn-mini" data-action="gt:quizHint" data-ri="' + ri + '">💡 提示</button>' +
          '<button class="btn btn-mini" data-action="gt:quizSpeak" data-ri="' + ri + '">' + Util.icon("volume", 18) + ' 读题</button>' +
          '<button class="btn btn-primary" data-action="gt:quizSubmit" data-ri="' + ri + '">' + Util.icon("check", 17) + ' 提交</button>' +
          '</div>';
      } else {
        var ref = q.answers ? q.answers[0] : q.answer;
        html += '<div class="input-your"><span class="muted small">你的答案</span><div class="iy-text">' + esc(done.user || '') + '</div></div>' +
          '<div class="input-ref"><span class="muted small">参考答案</span><div class="ir-text">' + esc(ref) + '</div></div>';
      }
    }

    if (done) {
      var ref2 = q.kind === 'input' ? (q.answers ? q.answers[0] : q.answer) : q.options[q.answer];
      html += '<div class="fb-banner ' + (done.correct ? 'fb-correct' : 'fb-wrong') + '">' +
        (done.correct ? '🎉 做对了！' + (done.close ? '（忽略大小写/标点后基本一致）' : '') : '✗ 再看看：正确答案 <b>' + esc(ref2) + '</b>') +
        '<div class="fb-explain">📖 ' + esc(q.explain) + '</div></div>';
    }
    html += '</div>';
    return html;
  }

  global.GrammarView = GrammarView;
  global.GrammarTopicView = GrammarTopicView;
  GrammarTopicView.topicById = topicById;
  GrammarTopicView.wrapQuiz = wrapQuiz;
})(window);
