/* 首页（V2.0）：学习概览 + 每日任务 + 快捷入口 + 推荐内容 + 单元入口 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  function lastTouchedUnit() {
    var best = null, t = 0;
    Object.keys(Store.data.units).forEach(function (uid) {
      var s = Store.data.units[uid];
      var latest = Math.max(s.lastPlay || 0, 0);
      if (latest > t) { t = latest; best = uid; }
    });
    return best;
  }

  var HomeView = {
    render: function () {
      var c = Content.data;
      var stats = Content.stats();
      var tasks = Store.todayTask();
      /* 渲染时结算当日任务，全部完成则累计连续学习天数 */
      Store.checkDaily();
      tasks = Store.todayTask();
      var streak = Store.data.streak;
      var rs = Store.readState();

      var totalWords = 0, mastered = 0;
      c.units.forEach(function (u) {
        totalWords += (u.words || []).length;
        mastered += Store.masteredCount(u.id, u.words || []);
      });
      var pct = totalWords ? Math.round(mastered * 100 / totalWords) : 0;

      var taskRows = tasks.map(function (t) {
        var nav = t.id === 'words'
          ? '#/unit/' + (lastTouchedUnit() || c.units[0].id)
          : (t.id === 'exercise' ? '#/practice' : t.id === 'reading' ? '#/reading' : '#/wrong');
        var right;
        if (t.done) {
          right = '<span class="task-done-badge">✓ 完成</span>';
        } else {
          right = '<button class="btn btn-mini" data-nav="' + nav + '">去完成</button>';
        }
        var prog = t.goal > 1 && !t.done
          ? '<div class="task-progress">' + t.progress + '/' + t.goal + '</div>'
          : '';
        return '<div class="task-row">' +
          '<span class="task-icon">' + t.icon + '</span>' +
          '<div class="task-info"><div class="task-label">' + esc(t.label) + '</div>' + prog + '</div>' +
          right + '</div>';
      }).join('');

      var unitCards = c.units.map(function (u) {
        var words = u.words || [];
        var m = Store.masteredCount(u.id, words);
        var p = words.length ? Math.round(m * 100 / words.length) : 0;
        return '<button class="unit-card" data-nav="#/unit/' + u.id + '">' +
          '<div class="unit-emoji">' + u.emoji + '</div>' +
          '<div class="unit-info">' +
          '<div class="unit-name">Unit ' + u.no + ' ' + esc(u.title) + '</div>' +
          '<div class="unit-zh">' + esc(u.titleZh || '') + '</div>' +
          '<div class="unit-progress"><div class="progress-track"><div class="progress-fill" style="width:' + p + '%"></div></div>' +
          '<span class="unit-progress-text">' + m + '/' + words.length + ' 词</span></div>' +
          '</div></button>';
      }).join('');

      /* 快捷入口 */
      var quick = [
        { nav: '#/practice', icon: '🎧', label: '听力练习' },
        { nav: '#/practice', icon: '✍️', label: '读写练习', cat: 'write' },
        { nav: '#/reading', icon: '📖', label: '课外阅读' },
        { nav: '#/practice', icon: '🏆', label: '综合测试', cat: 'mix' }
      ].map(function (q) {
        return '<button class="quick-btn" data-nav="' + q.nav + '"' +
          (q.cat ? ' data-quickcat="' + q.cat + '"' : '') + '>' +
          '<span class="qb-icon">' + q.icon + '</span><span>' + q.label + '</span></button>';
      }).join('');

      /* 今日推荐：语法复习 / 未读文章 / 生词复习 / 薄弱单元 */
      var recs = [];
      if (global.GRAMMAR_CONTENT) {
        var reviewTopic = GRAMMAR_CONTENT.topics.filter(function (t) {
          var st = Store.data.grammar && Store.data.grammar.topics[t.id];
          return st && st.state === 'review';
        })[0];
        if (reviewTopic) {
          recs.push('<button class="rec-row" data-nav="#/grammar/' + reviewTopic.id + '">' +
            '<span class="rec-icon">📘</span><div class="rec-info"><div class="rec-title">复习语法：' + esc(reviewTopic.title) + '</div>' +
            '<div class="rec-sub muted small">标记过“需复习”的主题，先看讲解再练题</div></div><span class="rec-go">›</span></button>');
        }
      }
      var nextArticle = null;
      if (global.READING_CONTENT) {
        READING_CONTENT.articles.forEach(function (a) {
          var h = rs.history[a.id];
          if (!nextArticle && !(h && h.quizDone)) nextArticle = a;
        });
      }
      if (nextArticle) {
        recs.push('<button class="rec-row" data-nav="#/read/' + nextArticle.id + '">' +
          '<span class="rec-icon">📖</span><div class="rec-info"><div class="rec-title">今日一篇：' + esc(nextArticle.title) + '</div>' +
          '<div class="rec-sub muted small">' + esc(nextArticle.titleZh || '') + ' · 约 ' + nextArticle.minutes + ' 分钟</div></div><span class="rec-go">›</span></button>');
      }
      if (rs.vocab.length) {
        recs.push('<button class="rec-row" data-nav="#/reading">' +
          '<span class="rec-icon">📒</span><div class="rec-info"><div class="rec-title">复习生词本（' + rs.vocab.length + ' 词）</div>' +
          '<div class="rec-sub muted small">去「阅读 → 收藏与历史」查看收藏的生词</div></div><span class="rec-go">›</span></button>');
      }
      var weakest = null;
      c.units.forEach(function (u) {
        var s = Store.data.units[u.id];
        if (s && s.total >= 5) {
          var accv = s.correct / s.total;
          if (!weakest || accv < weakest.acc) weakest = { unit: u, acc: accv };
        }
      });
      if (weakest) {
        recs.push('<button class="rec-row" data-nav="#/unit/' + weakest.unit.id + '">' +
          '<span class="rec-icon">💪</span><div class="rec-info"><div class="rec-title">巩固 Unit ' + weakest.unit.no + ' ' + esc(weakest.unit.title) + '</div>' +
          '<div class="rec-sub muted small">正确率 ' + Math.round(weakest.acc * 100) + '%，练一练更好</div></div><span class="rec-go">›</span></button>');
      }
      if (!recs.length) {
        recs.push('<div class="muted small" style="padding:6px 2px">完成第一组练习后，这里会给出个性化推荐 ✨</div>');
      }

      return '' +
        '<header class="page-head">' +
        '  <div class="book-title">' + esc(c.title) + '</div>' +
        '  <div class="book-sub">单词 ' + stats.words + ' · 句型 ' + stats.sentences + ' · 阅读 ' + (global.READING_CONTENT ? READING_CONTENT.articles.length : 0) + ' 篇</div>' +
        '</header>' +

        '<section class="card hero-card">' +
        '  <div class="hero-stats">' +
        '    <div class="hero-stat"><div class="hero-num">' + mastered + '<small>/' + totalWords + '</small></div><div class="hero-label">已掌握单词</div></div>' +
        '    <div class="hero-stat"><div class="hero-num">' + pct + '<small>%</small></div><div class="hero-label">掌握进度</div></div>' +
        '    <div class="hero-stat"><div class="hero-num">' + (streak.days || 0) + '</div><div class="hero-label">连续学习 🔥</div></div>' +
        '  </div>' +
        '</section>' +

        /* DaisyUI card 组件：card > card-body + shadow-md */
        '<section class="card quick-entry-card shadow-md">' +
        '  <div class="card-body">' +
        '    <div class="card-title">⚡ 快捷入口</div>' +
        '    <div class="quick-row">' + quick + '</div>' +
        (global.DICTATION_CONTENT
          ? '<button class="btn btn-block dict-entry" data-nav="#/dictation">✍️ 看图默写 · 单词句子听写（看图 / 看中文 / 默句子 / 听音 / 易错强化）</button>'
          : '') +
        (global.GRAMMAR_CONTENT
          ? '<button class="btn btn-block grammar-entry" data-nav="#/grammar">📘 语法用法与讲解 · ' + GRAMMAR_CONTENT.topics.length + ' 个主题，讲一点练一点</button>'
          : '') +
        '  </div>' +
        '</section>' +

        '<section class="card">' +
        '  <div class="card-title">📋 今日任务 <span class="muted">' + Util.todayStr() + '</span></div>' +
        taskRows +
        '</section>' +

        '<section class="card">' +
        '  <div class="card-title">🌟 今日推荐</div>' +
        recs.join('') +
        '</section>' +

        '<section>' +
        '  <div class="section-title">📚 选择单元开始学习</div>' +
        '  <div class="unit-grid">' + unitCards + '</div>' +
        '</section>';
    },

    /* 快捷入口带分类跳转：先设置练习分类再导航 */
    after: function () {
      var btns = document.querySelectorAll('[data-quickcat]');
      for (var i = 0; i < btns.length; i++) {
        (function (btn) {
          btn.addEventListener('click', function () {
            var cat = btn.getAttribute('data-quickcat');
            var first = { write: 'writeAll', mix: 'mixed' }[cat];
            App.practiceCfg.cat = cat;
            if (first) App.practiceCfg.preset = first;
          });
        })(btns[i]);
      }
    },

    actions: {}
  };

  global.HomeView = HomeView;
})(window);
