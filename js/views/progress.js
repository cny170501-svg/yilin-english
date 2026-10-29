/* 学习进度（V2.0）：概览、听力/读写/阅读统计、单元情况、近 7 天活动、家长报告 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  function fmtMinutes(sec) {
    if (!sec) return '0 分钟';
    var m = Math.round(sec / 60);
    if (m < 1) return '不足 1 分钟';
    if (m < 60) return m + ' 分钟';
    return Math.floor(m / 60) + ' 小时 ' + (m % 60) + ' 分';
  }

  var ProgressView = {
    render: function () {
      var units = Content.data.units;
      var streak = Store.data.streak;
      var log = Store.data.log;
      var rs = Store.readState();

      var totalWords = 0, mastered = 0, totalQ = 0, totalC = 0, totalSessions = 0;
      units.forEach(function (u) {
        totalWords += (u.words || []).length;
        mastered += Store.masteredCount(u.id, u.words || []);
        var s = Store.data.units[u.id];
        if (s) { totalQ += s.total; totalC += s.correct; totalSessions += s.sessions; }
      });

      /* 汇总日志（近 30 天） */
      var agg = { listenN: 0, listenC: 0, writeN: 0, writeC: 0, dictN: 0, dictC: 0, readSec: 0, quizN: 0, quizC: 0, reads: 0, sessions: 0, plays: 0 };
      Object.keys(log).forEach(function (k) {
        var d = log[k];
        agg.listenN += d.listenN || 0; agg.listenC += d.listenC || 0;
        agg.writeN += d.writeN || 0; agg.writeC += d.writeC || 0;
        agg.dictN += d.dictN || 0; agg.dictC += d.dictC || 0;
        agg.readSec += d.readSec || 0;
        agg.quizN += d.quizN || 0; agg.quizC += d.quizC || 0;
        agg.reads += d.reads || 0;
        agg.sessions += d.sessions || 0;
        agg.plays += d.plays || 0;
      });

      var acc = totalQ ? Math.round(totalC * 100 / totalQ) : 0;
      var pct = totalWords ? Math.round(mastered * 100 / totalWords) : 0;
      var listenAcc = agg.listenN ? Math.round(agg.listenC * 100 / agg.listenN) : 0;
      var writeAcc = agg.writeN ? Math.round(agg.writeC * 100 / agg.writeN) : 0;
      var quizAcc = agg.quizN ? Math.round(agg.quizC * 100 / agg.quizN) : 0;
      var readDone = Object.keys(rs.history).filter(function (id) { return rs.history[id].quizDone; }).length;
      var totalArticles = global.READING_CONTENT ? READING_CONTENT.articles.length : 0;
      var studyDays = Object.keys(log).filter(function (k) {
        var d = log[k];
        return d.plays > 0 || d.sessions > 0 || d.readSec > 0;
      }).length;
      var unresolved = Store.unresolvedCount();

      /* 语法专项统计（全部来自真实学习记录） */
      var gramStats = null;
      if (global.GRAMMAR_CONTENT) {
        var g = Store.grammarState();
        var gLearned = 0, gMastered = 0, gReview = 0, gSess = 0, gTotal = 0, gCorrect = 0;
        var gRows = [];
        var recentTopics = [];
        GRAMMAR_CONTENT.topics.forEach(function (t) {
          var st = g.topics[t.id] || { state: '', lastAt: 0, sessions: 0, total: 0, correct: 0 };
          if (st.lastAt) { gLearned++; recentTopics.push({ t: t, at: st.lastAt }); }
          if (st.state === 'mastered') gMastered++;
          if (st.state === 'review') gReview++;
          if (st.sessions) {
            gSess += st.sessions; gTotal += st.total; gCorrect += st.correct;
            gRows.push('<button class="progress-unit" data-nav="#/grammar/' + t.id + '">' +
              '<span class="pu-emoji">' + t.emoji + '</span>' +
              '<span class="pu-name" style="flex:3">' + esc(t.title) + '</span>' +
              '<span class="pu-mid"><span class="progress-track"><span class="progress-fill" style="width:' + Math.round(st.correct * 100 / st.total) + '%"></span></span></span>' +
              '<span class="pu-acc">' + Math.round(st.correct * 100 / st.total) + '%</span></button>');
          }
        });
        /* 高频错误主题：按错题本统计 */
        var wrongByTopic = {};
        Store.data.wrong.forEach(function (w) {
          if (!w.topicId) return;
          wrongByTopic[w.topicId] = (wrongByTopic[w.topicId] || 0) + w.wrongCount;
        });
        var topWrong = Object.keys(wrongByTopic).sort(function (a, b) { return wrongByTopic[b] - wrongByTopic[a]; })[0];
        var topWrongName = '';
        if (topWrong) {
          var tw = GRAMMAR_CONTENT.topics.filter(function (x) { return x.id === topWrong; })[0];
          topWrongName = tw ? tw.title : '';
        }
        recentTopics.sort(function (a, b) { return b.at - a.at; });
        var recentTxt = recentTopics.slice(0, 3).map(function (x) { return x.t.title; }).join('、');
        var suggest = '';
        if (topWrongName) suggest += '错题最多的语法主题是「' + esc(topWrongName) + '」，建议先看讲解再重练。';
        else if (gReview) {
          var rt = GRAMMAR_CONTENT.topics.filter(function (t) { return (g.topics[t.id] || {}).state === 'review'; })[0];
          if (rt) suggest = '「' + esc(rt.title) + '」标记了需复习，安排一次主题练习吧。';
        } else if (!gSess) suggest = '还没有语法学习记录，从「语法专项」第一个主题开始吧。';
        if (gLearned || gSess || Object.keys(wrongByTopic).length) {
          gramStats = {
            acc: gTotal ? Math.round(gCorrect * 100 / gTotal) : 0,
            summary: gSess ? '已练 ' + gSess + ' 组 · 掌握 ' + gMastered + ' / 待复习 ' + gReview : '尚未练习',
            rows: gRows.length ? '<div class="progress-unit-list">' + gRows.join('') + '</div>' : '<div class="muted small">暂无主题练习记录</div>',
            recent: recentTxt,
            suggest: suggest,
            learnedShown: gLearned,
            masteredShown: gMastered,
            sessShown: gSess
          };
        }
      }

      /* 近 7 天活动 */
      var days = [];
      for (var i = 6; i >= 0; i--) {
        var key = Util.dateOffsetStr(-i);
        var d = log[key] || { plays: 0, sessions: 0, reads: 0, readSec: 0 };
        days.push({ key: key, sessions: d.sessions, plays: d.plays, reads: d.reads, label: key.slice(5).replace('-', '/') });
      }
      var maxVal = 1;
      days.forEach(function (d) {
        maxVal = Math.max(maxVal, d.sessions * 2 + Math.min(d.plays, 40) / 10 + d.reads);
      });
      var bars = days.map(function (d) {
        var v = d.sessions * 2 + Math.min(d.plays, 40) / 10 + d.reads;
        var h = Math.max(6, Math.round(v * 100 / maxVal));
        var today = d.key === Util.todayStr();
        return '<div class="bar-col">' +
          '<div class="bar" style="height:' + h + '%"><span class="bar-tip">' + (d.sessions ? d.sessions + '组' : '') + (d.reads ? ' ' + d.reads + '篇' : '') + (d.plays ? ' ' + d.plays + '次' : '') + '</span></div>' +
          '<div class="bar-label' + (today ? ' today' : '') + '">' + d.label + '</div>' +
          '</div>';
      }).join('');

      /* 薄弱单元 */
      var weakest = null;
      units.forEach(function (u) {
        var s = Store.data.units[u.id];
        if (s && s.total >= 5) {
          var a = s.correct / s.total;
          if (!weakest || a < weakest.acc) weakest = { unit: u, acc: a, total: s.total };
        }
      });

      var unitRows = units.map(function (u) {
        var words = u.words || [];
        var m = Store.masteredCount(u.id, words);
        var s = Store.data.units[u.id];
        var a = s && s.total ? Math.round(s.correct * 100 / s.total) : null;
        var p = words.length ? Math.round(m * 100 / words.length) : 0;
        return '<button class="progress-unit" data-nav="#/unit/' + u.id + '">' +
          '<span class="pu-emoji">' + u.emoji + '</span>' +
          '<span class="pu-name">U' + u.no + ' ' + esc(u.title) + '</span>' +
          '<span class="pu-mid"><span class="progress-track"><span class="progress-fill" style="width:' + p + '%"></span></span></span>' +
          '<span class="pu-word">' + m + '/' + words.length + '词</span>' +
          '<span class="pu-acc">' + (a === null ? '未测' : a + '%') + '</span>' +
          '</button>';
      }).join('');

      function skillRow(icon, name, value, sub) {
        return '<div class="skill-row"><span class="sk-icon">' + icon + '</span>' +
          '<span class="sk-name">' + name + '</span>' +
          '<span class="sk-val">' + value + '</span>' +
          '<span class="sk-sub muted small">' + sub + '</span></div>';
      }

      var reportLines = [
        '📖 学习天数：<b>' + studyDays + '</b> 天，连续学习 <b>' + (streak.days || 0) + '</b> 天',
        '🔤 单词掌握：<b>' + mastered + ' / ' + totalWords + '</b>（' + pct + '%）',
        '✏️ 累计练习：<b>' + totalSessions + '</b> 组，共 <b>' + totalQ + '</b> 题，总正确率 <b>' + acc + '%</b>',
        '🎧 听力练习：累计 <b>' + agg.listenN + '</b> 题' + (agg.listenN ? '，正确率 <b>' + listenAcc + '%</b>' : ''),
        '✍️ 读写练习：累计 <b>' + agg.writeN + '</b> 题' + (agg.writeN ? '，正确率 <b>' + writeAcc + '%</b>' : ''),
        '🖼️ 看图默写：累计 <b>' + agg.dictN + '</b> 题' + (agg.dictN ? '，正确率 <b>' + Math.round(agg.dictC * 100 / agg.dictN) + '%</b>' : ''),
        '📖 课外阅读：完成 <b>' + readDone + '/' + totalArticles + '</b> 篇，阅读时长 <b>' + fmtMinutes(agg.readSec) + '</b>' +
        (agg.quizN ? '，理解题正确率 <b>' + quizAcc + '%</b>' : ''),
        '📕 待消灭错题：<b>' + unresolved + '</b> 题 · 生词本：<b>' + rs.vocab.length + '</b> 词'
      ].concat(gramStats ? [
        '📘 语法专项：已学 <b>' + gramStats.learnedShown + '</b> 个主题，掌握 <b>' + gramStats.masteredShown + '</b> 个' +
        (gramStats.sessShown ? '，练习 <b>' + gramStats.sessShown + '</b> 组，正确率 <b>' + gramStats.acc + '%</b>' : '')
      ] : []);

      return '' +
        '<header class="page-head"><div class="book-title">📊 学习进度</div>' +
        '<div class="book-sub">进度保存在本机浏览器中</div></header>' +

        '<section class="card hero-card">' +
        '  <div class="hero-stats">' +
        '    <div class="hero-stat"><div class="hero-num">' + pct + '<small>%</small></div><div class="hero-label">单词掌握</div></div>' +
        '    <div class="hero-stat"><div class="hero-num">' + acc + '<small>%</small></div><div class="hero-label">练习正确率</div></div>' +
        '    <div class="hero-stat"><div class="hero-num">' + readDone + '<small>/' + totalArticles + '</small></div><div class="hero-label">完成阅读</div></div>' +
        '    <div class="hero-stat"><div class="hero-num">' + (streak.days || 0) + '</div><div class="hero-label">连续天数 🔥</div></div>' +
        '  </div>' +
        '</section>' +

        '<section class="card">' +
        '  <div class="card-title">🧭 听 · 说 · 读 · 写</div>' +
        skillRow('🎧', '听力', agg.listenN ? listenAcc + '%' : '未开始', '累计 ' + agg.listenN + ' 题') +
        skillRow('✍️', '读写', agg.writeN ? writeAcc + '%' : '未开始', '累计 ' + agg.writeN + ' 题') +
        skillRow('🖼️', '默写', agg.dictN ? Math.round(agg.dictC * 100 / agg.dictN) + '%' : '未开始', '累计 ' + agg.dictN + ' 题') +
        skillRow('📖', '阅读', readDone + ' 篇', fmtMinutes(agg.readSec) + (agg.quizN ? ' · 理解' + quizAcc + '%' : '')) +
        skillRow('🔊', '点读', agg.plays + ' 次', '说：跟读随点读练习') +
        (gramStats ? skillRow('📘', '语法', gramStats.acc + '%', gramStats.summary) : '') +
        '</section>' +

        (gramStats ? '<section class="card"><div class="card-title">📘 语法专项</div>' +
        gramStats.rows +
        (gramStats.recent ? '<div class="muted small" style="margin-top:6px">🕘 最近学习：' + gramStats.recent + '</div>' : '') +
        (gramStats.suggest ? '<div class="report-suggest">' + gramStats.suggest + '</div>' : '') +
        '</section>' : '') +

        '<section class="card">' +
        '  <div class="card-title">🗓 近 7 天学习活动</div>' +
        '  <div class="chart">' + bars + '</div>' +
        '  <div class="muted small">柱子越高表示当天学习越多（练习组数 + 点读 + 阅读）</div>' +
        '</section>' +

        '<section class="card">' +
        '  <div class="card-title">📚 各单元情况</div>' +
        '  <div class="progress-unit-list">' + unitRows + '</div>' +
        '</section>' +

        '<section class="card parent-card">' +
        '  <div class="card-title">👨‍👩‍👧 家长报告</div>' +
        reportLines.map(function (l) { return '<div class="report-line">' + l + '</div>'; }).join('') +
        (weakest
          ? '<div class="report-suggest">建议：「Unit ' + weakest.unit.no + ' ' + esc(weakest.unit.title) + '」正确率 ' + Math.round(weakest.acc * 100) + '%，相对薄弱，建议优先复习。</div>' +
            '<button class="btn btn-primary" data-nav="#/unit/' + weakest.unit.id + '">去复习该单元</button>'
          : (totalSessions
            ? '<div class="report-suggest">各单元表现均衡，继续保持！</div>'
            : '<div class="report-suggest">还没有练习记录，完成第一组练习后这里会生成建议。</div>')) +
        (rs.vocab.length
          ? '<div class="report-suggest">📒 生词本里有 ' + rs.vocab.length + ' 个词，建议陪孩子在「阅读 → 收藏与历史」里复习一遍。</div>'
          : '') +
        '</section>' +

        '<div class="muted small storage-note">ℹ️ 学习数据保存在这台设备的浏览器本地（localStorage）。换设备或清除浏览器数据不会同步（未接入云端同步），如需备份请在「设置 → 学习数据」导出。</div>';
    },

    actions: {}
  };

  global.ProgressView = ProgressView;
})(window);
