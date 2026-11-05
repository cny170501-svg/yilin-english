/* 首页（V3.0）：按学习目标分区，保留原有任务、推荐、单元进度与全部入口 */
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

  function feature(nav, icon, title, desc, cat) {
    return '<button class="home-feature-card" data-nav="' + nav + '"' +
      (cat ? ' data-quickcat="' + cat + '"' : '') + '>' +
      '<span class="home-feature-icon">' + icon + '</span>' +
      '<span class="home-feature-copy"><span class="home-feature-title">' + title + '</span>' +
      '<span class="home-feature-desc">' + desc + '</span></span>' +
      '<span class="home-feature-arrow">›</span></button>';
  }

  /* 近 7 天学习打卡（真实日志数据） */
  function weekDots() {
    var DAY = ['日', '一', '二', '三', '四', '五', '六'];
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var key = d.getFullYear() + '-' + Util.pad2(d.getMonth() + 1) + '-' + Util.pad2(d.getDate());
      var rec = Store.data.log[key];
      var active = !!(rec && (rec.sessions > 0 || rec.plays > 0 || rec.reads > 0));
      out.push('<div class="home2-day' + (active ? ' on' : '') + (i === 0 ? ' today' : '') + '">' +
        '<div class="home2-dot">' + (active ? '✓' : '') + '</div>' +
        DAY[d.getDay()] + '</div>');
    }
    return '<div class="home2-week">' + out.join('') + '</div>';
  }

  var HomeView = {
    render: function () {
      var c = Content.data;
      var stats = Content.stats();
      Store.checkDaily();
      var tasks = Store.todayTask();
      var streak = Store.data.streak || {};
      var rs = Store.readState();
      var totalWords = 0, mastered = 0;

      c.units.forEach(function (u) {
        totalWords += (u.words || []).length;
        mastered += Store.masteredCount(u.id, u.words || []);
      });
      var pct = totalWords ? Math.round(mastered * 100 / totalWords) : 0;
      var currentUnit = lastTouchedUnit() || (c.units[0] && c.units[0].id);

      var taskRows = tasks.map(function (t) {
        var nav = t.id === 'words'
          ? '#/unit/' + currentUnit
          : (t.id === 'exercise' ? '#/practice' : t.id === 'reading' ? '#/reading' : '#/wrong');
        var right = t.done
          ? '<span class="task-done-badge">✓ 完成</span>'
          : '<button class="btn btn-mini" data-nav="' + nav + '">去完成</button>';
        var prog = t.goal > 1 && !t.done
          ? '<div class="task-progress">' + t.progress + '/' + t.goal + '</div>' : '';
        return '<div class="task-row"><span class="task-icon">' + t.icon + '</span>' +
          '<div class="task-info"><div class="task-label">' + esc(t.label) + '</div>' + prog + '</div>' +
          right + '</div>';
      }).join('');

      var unitCards = c.units.map(function (u) {
        var words = u.words || [];
        var m = Store.masteredCount(u.id, words);
        var p = words.length ? Math.round(m * 100 / words.length) : 0;
        return '<button class="unit-card" data-nav="#/unit/' + u.id + '">' +
          '<div class="unit-emoji">' + u.emoji + '</div><div class="unit-info">' +
          '<div class="unit-name">Unit ' + u.no + ' ' + esc(u.title) + '</div>' +
          '<div class="unit-zh">' + esc(u.titleZh || '') + '</div>' +
          '<div class="unit-progress"><div class="progress-track"><div class="progress-fill" style="width:' + p + '%"></div></div>' +
          '<span class="unit-progress-text">' + m + '/' + words.length + ' 词</span></div>' +
          '</div></button>';
      }).join('');

      var recs = [];
      if (global.GRAMMAR_CONTENT) {
        var reviewTopic = GRAMMAR_CONTENT.topics.filter(function (t) {
          var st = Store.data.grammar && Store.data.grammar.topics[t.id];
          return st && st.state === 'review';
        })[0];
        if (reviewTopic) recs.push('<button class="rec-row" data-nav="#/grammar/' + reviewTopic.id + '">' +
          '<span class="rec-icon">📘</span><div class="rec-info"><div class="rec-title">复习语法：' + esc(reviewTopic.title) + '</div>' +
          '<div class="rec-sub muted small">先听讲解，再完成小练习</div></div><span class="rec-go">›</span></button>');
      }
      var nextArticle = null;
      if (global.READING_CONTENT) {
        READING_CONTENT.articles.forEach(function (a) {
          var h = rs.history[a.id];
          if (!nextArticle && !(h && h.quizDone)) nextArticle = a;
        });
      }
      if (nextArticle) recs.push('<button class="rec-row" data-nav="#/read/' + nextArticle.id + '">' +
        '<span class="rec-icon">📖</span><div class="rec-info"><div class="rec-title">今日一篇：' + esc(nextArticle.title) + '</div>' +
        '<div class="rec-sub muted small">' + esc(nextArticle.titleZh || '') + ' · 约 ' + nextArticle.minutes + ' 分钟</div></div><span class="rec-go">›</span></button>');
      if (rs.vocab.length) recs.push('<button class="rec-row" data-nav="#/reading">' +
        '<span class="rec-icon">📒</span><div class="rec-info"><div class="rec-title">复习生词本（' + rs.vocab.length + ' 词）</div>' +
        '<div class="rec-sub muted small">查看阅读中收藏的生词</div></div><span class="rec-go">›</span></button>');
      var weakest = null;
      c.units.forEach(function (u) {
        var s = Store.data.units[u.id];
        if (s && s.total >= 5) {
          var acc = s.correct / s.total;
          if (!weakest || acc < weakest.acc) weakest = { unit: u, acc: acc };
        }
      });
      if (weakest) recs.push('<button class="rec-row" data-nav="#/unit/' + weakest.unit.id + '">' +
        '<span class="rec-icon">💪</span><div class="rec-info"><div class="rec-title">巩固 Unit ' + weakest.unit.no + ' ' + esc(weakest.unit.title) + '</div>' +
        '<div class="rec-sub muted small">最近正确率 ' + Math.round(weakest.acc * 100) + '%</div></div><span class="rec-go">›</span></button>');
      if (!recs.length) recs.push('<div class="muted small home-empty">完成几组练习后，这里会出现适合你的复习建议。</div>');

      return '' +
        '<header class="home2-top">' +
        '  <div class="home2-avatar">🦖</div>' +
        '  <div class="home2-hello"><div class="home2-hello-title">你好呀 👋</div>' +
        '  <div class="home2-hello-sub">' + esc(c.title) + ' · 课程学习与复习巩固</div></div>' +
        '  <button class="home2-gear" data-nav="#/settings" aria-label="设置">⚙️</button>' +
        '</header>' +

        '<section class="card hero-card home-hero">' +
        '<div class="home2-eyebrow">MY LEARNING JOURNEY</div>' +
        '<div class="home-hero-title">今天也来进步一点点！</div>' +
        '<div class="home-hero-sub">连续学习 ' + (streak.days || 0) + ' 天 🔥 · 已掌握 ' + mastered + '/' + totalWords + ' 词</div>' +
        '<div class="progress-track home-hero-track" style="margin-top:10px"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="hero-stats" style="margin-top:12px">' +
        '<div class="hero-stat"><div class="hero-num">' + pct + '<small>%</small></div><div class="hero-label">掌握进度</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + stats.sentences + '</div><div class="hero-label">句型内容</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + (global.READING_CONTENT ? READING_CONTENT.articles.length : 0) + '</div><div class="hero-label">阅读文章</div></div>' +
        '</div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:12px" data-nav="#/unit/' + currentUnit + '">▶ 继续学习：Unit ' + (Content.unitById(currentUnit) || { no: 1 }).no + '</button>' +
        '</section>' +

        '<section class="home2-streak">' +
        '<span class="home2-streak-fire">🔥 <b>' + (streak.days || 0) + '</b> 天</span>' +
        weekDots() +
        '</section>' +

        '<section class="home-section">' +
        '<div class="home-section-head"><div><div class="home-section-title">📚 课程学习</div><div class="home-section-desc">按学习目标选择内容</div></div></div>' +
        '<div class="home-feature-grid">' +
        feature('#/unit/' + currentUnit, '📘', '单元同步学习', '单词、短语、句型与知识点') +
        feature('#/grammar', '🧠', '语法专项', '系统讲解、例句与专项练习') +
        feature('#/practice', '🎧', '听力训练', '听音辨词、听句理解', 'listen') +
        feature('#/practice', '✍️', '读写训练', '拼写、填空与句子应用', 'write') +
        '</div></section>' +

        '<section class="home-section">' +
        '<div class="home-section-head"><div><div class="home-section-title">🗂️ 单元目录</div><div class="home-section-desc">查看每个单元的学习进度</div></div>' +
        '<span class="home-section-count">' + c.units.length + ' 个单元</span></div>' +
        '<div class="unit-grid">' + unitCards + '</div></section>' +

        '<section class="home-section">' +
        '<div class="home-section-head"><div><div class="home-section-title">🎯 复习巩固</div><div class="home-section-desc">把学过的内容练熟、记牢</div></div></div>' +
        '<div class="home-feature-grid home-feature-grid-compact">' +
        feature('#/dictation', '🖼️', '看图默写', '单词、短语与句子听写') +
        feature('#/wrong', '📕', '错题本', '回顾错题并进行针对训练') +
        feature('#/practice', '🏆', '综合测试', '混合题型，检验学习成果', 'mix') +
        '</div></section>' +

        '<section class="home-section card home-task-card">' +
        '<div class="home-section-head"><div><div class="home-section-title">📋 今日任务</div><div class="home-section-desc">每天完成一点，养成复习习惯</div></div>' +
        '<span class="home-date">' + Util.todayStr() + '</span></div>' + taskRows +
        '</section>' +

        '<section class="home-section card home-recommend-card">' +
        '<div class="home-section-head"><div><div class="home-section-title">✨ 为你推荐</div><div class="home-section-desc">根据学习记录安排下一步</div></div></div>' +
        recs.join('') + '</section>' +

        '<section class="home-section">' +
        '<div class="home-section-head"><div><div class="home-section-title">🌱 阅读与资料</div><div class="home-section-desc">拓展阅读，管理自己的学习材料</div></div></div>' +
        '<div class="home-feature-grid home-feature-grid-compact">' +
        feature('#/reading', '📖', '双语阅读', '分级文章、逐句点读与理解练习') +
        feature('#/library', '📂', '我的资料库', '整理教材、试卷与补充资料') +
        '</div></section>';
    },

    after: function () {
      var btns = document.querySelectorAll('[data-quickcat]');
      for (var i = 0; i < btns.length; i++) {
        (function (btn) {
          btn.addEventListener('click', function () {
            var cat = btn.getAttribute('data-quickcat');
            App.practiceCfg.cat = cat;
            var first = { write: 'writeAll', mix: 'mixed' }[cat];
            if (first) App.practiceCfg.preset = first;
          });
        })(btns[i]);
      }
    },
    actions: {}
  };

  global.HomeView = HomeView;
})(window);
