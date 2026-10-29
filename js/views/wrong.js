/* 错题本（V2.0）：统一管理听力/读写/单词/句型/语法/阅读理解错题
   支持按题型分组、单元筛选，单题删除、重练、清空已消灭 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  function typeLabel(t) { return (global.PracticeView && PracticeView.TYPE_LABEL[t]) || t; }
  function typeGroup(t) { return (global.PracticeView && PracticeView.TYPE_GROUP[t]) || '其他'; }

  function unitName(uid) {
    if (!uid) return '—';
    var u = Content.unitById(uid);
    return u ? 'U' + u.no + ' ' + u.title : uid;
  }

  function grammarTopicName(topicId) {
    if (!global.GRAMMAR_CONTENT || !topicId) return '';
    var t = GRAMMAR_CONTENT.topics.filter(function (x) { return x.id === topicId; })[0];
    return t ? t.emoji + ' ' + t.title : '';
  }

  var WrongView = {
    render: function () {
      var st = App.wrongState || (App.wrongState = { showAll: false, group: 'all', unit: 'all' });
      var all = Store.data.wrong;

      /* 筛选器：题型分组 + 单元 */
      var groupsInUse = {};
      all.forEach(function (w) { groupsInUse[typeGroup(w.type)] = 1; });
      var groupChips = ['<button class="chip-scope' + (st.group === 'all' ? ' on' : '') + '" data-action="wrong:group" data-v="all">全部题型</button>'];
      Object.keys(groupsInUse).forEach(function (g) {
        groupChips.push('<button class="chip-scope' + (st.group === g ? ' on' : '') + '" data-action="wrong:group" data-v="' + g + '">' + g + '</button>');
      });

      var unitsInUse = {};
      all.forEach(function (w) { if (w.unitId) unitsInUse[w.unitId] = 1; });
      var unitChips = ['<button class="chip-scope' + (st.unit === 'all' ? ' on' : '') + '" data-action="wrong:unit" data-v="all">全部单元</button>'];
      Object.keys(unitsInUse).forEach(function (uid) {
        var u = Content.unitById(uid);
        unitChips.push('<button class="chip-scope' + (st.unit === uid ? ' on' : '') + '" data-action="wrong:unit" data-v="' + uid + '">' + (u ? 'U' + u.no : uid) + '</button>');
      });

      var list = all.filter(function (w) {
        if (!st.showAll && w.resolved) return false;
        if (st.group !== 'all' && typeGroup(w.type) !== st.group) return false;
        if (st.unit !== 'all' && w.unitId !== st.unit) return false;
        return true;
      });
      var unresolved = Store.unresolvedCount();
      var retryable = Store.data.wrong.filter(function (w) { return !w.resolved && w.source !== 'reading'; }).length;

      var html = '' +
        '<header class="page-head"><div class="book-title">📕 错题本</div>' +
        '<div class="book-sub">待消灭 ' + unresolved + ' 题 · 已消灭 ' + (all.length - unresolved) + ' 题</div></header>';

      if (retryable) {
        html += '<button class="btn btn-primary btn-block btn-lg" data-action="wrong:start">🎯 开始错题重练（' + retryable + ' 题）</button>';
      }

      if (!list.length) {
        html += '<div class="card empty-card">' +
          (all.length
            ? '当前筛选下没有错题。可切换上方筛选条件，或点击下方按钮查看已消灭的错题。'
            : '还没有错题记录。去练习里挑战一下吧！') +
          '</div>';
      }

      if (all.length) {
        html += '<div class="wrong-filter">' +
          '<button class="chip-scope' + (!st.showAll ? ' on' : '') + '" data-action="wrong:filter" data-v="0">待消灭</button>' +
          '<button class="chip-scope' + (st.showAll ? ' on' : '') + '" data-action="wrong:filter" data-v="1">全部</button>' +
          (all.some(function (w) { return w.resolved; }) ? '<button class="chip-scope" data-action="wrong:clearResolved">🧹 清除已消灭</button>' : '') +
          '</div>' +
          '<div class="wrong-filter">' + groupChips.join('') + '</div>' +
          (Object.keys(unitsInUse).length > 1 ? '<div class="wrong-filter">' + unitChips.join('') + '</div>' : '');

        list.forEach(function (w) {
          var correctText = w.kind === 'order' || w.kind === 'input' ? (w.answers ? w.answers[0] : w.answer) : (w.options ? w.options[w.answer] : w.answer);
          var userText = (w.userAnswer != null && w.options && typeof w.userAnswer === 'number') ? w.options[w.userAnswer] : w.userAnswer;
          html += '<div class="card wrong-item' + (w.resolved ? ' resolved' : '') + '">' +
            '<div class="wi-head">' +
            '<span class="q-type-badge">' + typeLabel(w.type) + '</span>' +
            (w.source === 'reading'
              ? '<span class="wi-unit">📖 阅读</span>'
              : w.source === 'grammar'
                ? '<span class="wi-unit">' + esc(grammarTopicName(w.topicId) || '语法专项') + '</span>'
                : '<span class="wi-unit">' + esc(unitName(w.unitId)) + '</span>') +
            (w.resolved ? '<span class="wi-badge ok">已消灭</span>' : '<span class="wi-badge bad">错 ' + w.wrongCount + ' 次</span>') +
            '</div>' +
            '<div class="wi-stem">' +
            (w.speak ? '<button class="icon-btn mini" data-speak="' + esc(w.speak) + '">' + Util.icon("volume", 18) + '</button> ' : '') +
            esc(w.stem) + '</div>' +
            (userText != null && userText !== '' ? '<div class="wi-ans muted small">你的答案：' + esc(userText) + '</div>' : '') +
            '<div class="wi-ans">正确答案：<b>' + esc(correctText != null ? correctText : '') + '</b></div>' +
            (w.explain ? '<div class="wi-ex">💡 ' + esc(w.explain) + '</div>' : '') +
            '<div class="wi-ops">' +
            '<span class="muted small">' + Util.fmtDate(w.lastWrong) + '</span>' +
            '<span class="wi-ops-r">' +
            (w.source === 'reading'
              ? '<button class="btn btn-mini" data-nav="#/read/' + esc(w.articleId || '') + '">📖 去原文重做</button>'
              : '') +
            (w.source === 'grammar' && w.topicId
              ? '<button class="btn btn-mini" data-nav="#/grammar/' + esc(w.topicId) + '">📘 去讲解</button>'
              : '') +
            '<button class="btn btn-mini btn-danger" data-action="wrong:remove" data-id="' + w.id + '">删除</button>' +
            '</span></div>' +
            '</div>';
        });
      }

      return html;
    },

    actions: {
      'wrong:filter': function (d) {
        App.wrongState.showAll = d.v === '1';
        App.rerender();
      },
      'wrong:group': function (d) {
        App.wrongState.group = d.v;
        App.rerender();
      },
      'wrong:unit': function (d) {
        App.wrongState.unit = d.v;
        App.rerender();
      },
      'wrong:start': function () {
        App.session = null;
        App.go('#/practice');
        setTimeout(function () {
          if (global.PracticeView && PracticeView.startWrongRetry) PracticeView.startWrongRetry();
        }, 60);
      },
      'wrong:remove': function (d) {
        if (window.confirm('确定删除这道错题吗？')) {
          Store.removeWrong(d.id);
          Util.toast('已删除该错题');
          App.rerender();
        }
      },
      'wrong:clearResolved': function () {
        if (window.confirm('确定清除所有已消灭的错题吗？')) {
          Store.clearResolved();
          App.rerender();
        }
      }
    }
  };

  global.WrongView = WrongView;
})(window);
