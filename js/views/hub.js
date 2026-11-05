/* 学习 / 我的 · 聚合页（UI 2.0 底部导航）
   学习 = 单元目录 + 语法专项 + 阅读学习；我的 = 学习进度 + 资料库 + 设置
   仅作真实功能入口聚合，不含业务逻辑 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  function hubCard(nav, icon, title, desc, extra) {
    return '<button class="hub-card" data-nav="' + nav + '">' +
      '<span class="hub-icon">' + icon + '</span>' +
      '<span class="hub-info"><span class="hub-title">' + esc(title) + '</span>' +
      '<span class="hub-desc">' + esc(desc) + '</span></span>' +
      (extra || '<span class="home-feature-arrow">›</span>') +
      '</button>';
  }

  function sectionHead(title, desc, count) {
    return '<div class="home-section-head"><div><div class="home-section-title">' + esc(title) + '</div>' +
      '<div class="home-section-desc">' + esc(desc) + '</div></div>' +
      (count ? '<span class="home-section-count">' + esc(count) + '</span>' : '') +
      '</div>';
  }

  var LearnHubView = {
    render: function () {
      var c = Content.data;
      var stats = Content.stats();
      var html = '<header class="page-head home-page-head"><div class="book-title">📖 学习</div>' +
        '<div class="book-sub">教材单元 · 语法专项 · 课外阅读</div></header>';

      /* 单元目录 */
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
      html += '<section class="home-section">' +
        sectionHead('📚 教材单元', '按单元学习单词、句型与知识点', c.units.length + ' 个单元') +
        '<div class="unit-grid">' + unitCards + '</div></section>';

      /* 语法 + 阅读 */
      var wrongBadge = Store.unresolvedCount();
      html += '<section class="home-section">' +
        sectionHead('🎯 专项与拓展', '语法讲解、错题复习与课外阅读') +
        '<div class="hub-grid">' +
        hubCard('#/grammar', '🧠', '语法专项', GRAMMAR_CONTENT.topics.length + ' 个主题，讲一点练一点') +
        hubCard('#/reading', '📖', '课外阅读', (global.READING_CONTENT ? READING_CONTENT.articles.length : 0) + ' 篇双语读物 · 逐句点读') +
        hubCard('#/dictation', '🖼️', '看图默写', '看图 / 看中文 / 默句子 / 听音 / 易错强化') +
        '</div></section>';

      return html;
    },
    after: function () { },
    actions: {}
  };

  var MeHubView = {
    render: function () {
      var st = Store.data.streak || {};
      var mastered = 0, totalWords = 0;
      Content.data.units.forEach(function (u) {
        totalWords += (u.words || []).length;
        mastered += Store.masteredCount(u.id, u.words || []);
      });
      var wrongN = Store.unresolvedCount();
      var pack = (typeof AudioPack !== 'undefined' && AudioPack.describe) ? AudioPack.describe() : null;
      var html = '<header class="page-head home-page-head"><div class="book-title">👤 我的</div>' +
        '<div class="book-sub">进度 · 资料 · 设置</div></header>';

      /* 我的概览卡 */
      html += '<section class="card home2-streak-card">' +
        '<div class="home2-streak"><span class="home2-streak-fire">🔥 连续学习 <b>' + (st.days || 0) + '</b> 天</span>' +
        '<span class="muted small" style="color:rgba(246,244,236,.7)">掌握 ' + mastered + '/' + totalWords + ' 词</span></div>' +
        '</section>';

      html += '<section class="home-section">' +
        sectionHead('📊 学习档案', '查看学习数据与报告') +
        '<div class="hub-grid">' +
        hubCard('#/progress', '📊', '学习进度', '四维统计 · 各单元情况 · 家长报告') +
        hubCard('#/library', '📚', '我的资料库', '上传教材试卷，整理学习内容') +
        '</div></section>';

      html += '<section class="home-section">' +
        sectionHead('⚙️ 通用', '目标、语音与数据管理') +
        '<div class="hub-grid">' +
        hubCard('#/settings', '⚙️', '设置', '每日目标 · 语速 · ' + (pack ? '语音包 ' + pack.count + ' 条' : '语音') ) +
        '</div>' +
        (wrongN ? '<button class="btn btn-block" style="margin-top:10px" data-nav="#/wrong">📕 待消灭错题 ' + wrongN + ' 题 ›</button>' : '') +
        '</section>';

      return html;
    },
    after: function () { },
    actions: {}
  };

  global.LearnHubView = LearnHubView;
  global.MeHubView = MeHubView;
})(window);
