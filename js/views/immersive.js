/* 沉浸式单词/句型学习页（UI 3.0 · SentencePop 式）
   #/iword/:unitId/:idx    逐词沉浸
   #/isentence/:unitId/:idx 逐句沉浸
   - 语音：点击单词/例句/整句 → Speaker → Tina MP3 通道（未命中回退设备语音），映射零改动
   - 翻页自动播放上一条/下一条（App.immAuto 标记）
   - 句型「连续」= speakQueue 全队列，onItem 同步页面位置
   - 掌握标记复用 unit:markWord（与单元页数据互通）*/
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }
  function unit() { return Content.unitById(App.state.immUnit) || null; }

  function pill(action, html, extra) {
    return '<button class="sp-pill' + (extra ? ' ' + extra : '') + '" data-action="' + action + '">' + html + '</button>';
  }

  function topBar(backHash, title, pos) {
    return '<header class="sp-top">' +
      '<button class="btn btn-back" data-nav="' + backHash + '">' + Util.icon('left', 15) + '</button>' +
      '<div class="sp-top-title">' + esc(title) + '</div>' +
      '<div class="sp-pos">' + pos + '</div>' +
      '</header>';
  }

  /* ================= 沉浸式单词 ================= */
  var ImmersiveWordView = {
    render: function () {
      var u = unit();
      if (!u) return '<div class="card">未找到单元 <button class="btn btn-mini" data-nav="#/home">返回</button></div>';
      var list = u.words || [];
      var idx = Math.min(Math.max(App.state.immIdx || 0, 0), Math.max(list.length - 1, 0));
      if (!list.length) return '<div class="card">本单元暂无单词数据</div>';
      var w = list[idx];
      var st = Store.getWordState(u.id, w.en);
      var emoji = (global.DICTATION_CONTENT && DICTATION_CONTENT.wordImages[u.id] && DICTATION_CONTENT.wordImages[u.id][w.en]) || '';
      var showZh = App.state.showZh !== false;

      return topBar(u) +
        '<div class="sp-stage">' +
        '  <div class="sp-pos-line">' + (idx + 1) + ' / ' + list.length + ' · Unit ' + u.no + '</div>' +
        (showZh ? '  <div class="sp-zh">' + esc(w.zh) + '</div>' : '  <div class="sp-zh sp-zh-hidden" data-action="iw:toggleZh">👆 点击顶部「显示中文」查看意思</div>') +
        '  <div class="sp-words"><span class="sp-word sp-word-big" data-action="iw:play">' + esc(w.en) + '</span></div>' +
        (emoji ? '  <div class="sp-emoji">' + emoji + '</div>' : '') +
        '</div>' +
        '<div class="sp-panel">' +
        '  <div class="sp-panel-head">📝 例句</div>' +
        (w.exEn ? '<div class="sp-ex-row"><button class="icon-btn" data-action="iw:playEx">' + Util.icon('volume', 16) + '</button>' +
          '<span class="sp-ex-en">' + esc(w.exEn) + '</span></div>' +
          (showZh && w.exZh ? '<div class="sp-ex-zh">' + esc(w.exZh) + '</div>' : '') : '<div class="sp-panel-body">本词暂无例句</div>') +
        '</div>' +
        '<div class="sp-actions">' +
        pill('iw:prev', '‹ 上一词') +
        pill('iw:play', '🔊 播放') +
        pill('iw:next', '下一词 ›') +
        '</div>' +
        '<div class="sp-actions">' +
        '<button class="mark-btn mark-ok' + (st === 'mastered' ? ' on' : '') + '" data-action="unit:markWord" data-unit="' + u.id + '" data-word="' + esc(w.en) + '" data-state="mastered">✓ 会了</button>' +
        '<button class="mark-btn mark-review' + (st === 'review' ? ' on' : '') + '" data-action="unit:markWord" data-unit="' + u.id + '" data-word="' + esc(w.en) + '" data-state="review">↻ 复习</button>' +
        '</div>';
    },

    after: function () {
      /* 翻页后自动播放 */
      if (App.immAuto) {
        App.immAuto = false;
        var u = unit();
        var list = u ? (u.words || []) : [];
        var w = list[App.state.immIdx];
        if (w) Speaker.speak(w.en);
      }
    },

    actions: {
      'iw:play': function (d, el) {
        var u = unit();
        var w = u && (u.words || [])[App.state.immIdx];
        if (w && el && el.classList) {
          Speaker.speak(w.en);
          el.classList.add('sp-word-playing');
          setTimeout(function () { el.classList.remove('sp-word-playing'); }, 1200);
        }
      },
      'iw:prev': function () {
        var i = App.state.immIdx || 0;
        if (i > 0) { App.immAuto = true; location.hash = '#/iword/' + App.state.immUnit + '/' + (i - 1); }
        else Util.toast('已经是第一个单词了');
      },
      'iw:next': function () {
        var u = unit();
        var n = u ? (u.words || []).length : 0;
        var i = App.state.immIdx || 0;
        if (i < n - 1) { App.immAuto = true; location.hash = '#/iword/' + App.state.immUnit + '/' + (i + 1); }
        else Util.toast('已经是最后一个单词了');
      },
      'iw:toggleZh': function () {
        App.state.showZh = App.state.showZh === false;
        App.rerender();
      }
    }
  };

  /* ================= 沉浸式句型 ================= */
  function cleanEn(s) { return String(s || '').replace(/--/g, '').trim(); }

  var ImmersiveSentenceView = {
    render: function () {
      var u = unit();
      if (!u) return '<div class="card">未找到单元 <button class="btn btn-mini" data-nav="#/home">返回</button></div>';
      var list = u.sentences || [];
      var idx = Math.min(Math.max(App.state.immIdx || 0, 0), Math.max(list.length - 1, 0));
      if (!list.length) return '<div class="card">本单元暂无句型数据</div>';
      var s = list[idx];
      var en = cleanEn(s.en);
      var tokens = en.split(' ').filter(Boolean);
      var showZh = App.state.showZh !== false;
      var playing = Speaker._audioMode && Speaker._audioEl && !Speaker._audioEl.paused;

      return topBar(u, list.length) +
        '<div class="sp-stage">' +
        '  <div class="sp-pos-line">' + (idx + 1) + ' / ' + list.length + ' · Unit ' + u.no + '</div>' +
        (showZh ? '  <div class="sp-zh">' + esc(s.zh) + '</div>' : '  <div class="sp-zh sp-zh-hidden" data-action="is:toggleZh">👆 点击顶部「显示中文」查看意思</div>') +
        '  <div class="sp-words">' +
        tokens.map(function (t) {
          var punct = /^[,.!?;:]+/.test(t);
          return '<span class="sp-word' + (punct ? ' punct' : '') + '" data-action="is:play">' + esc(t) + '</span>';
        }).join('') +
        '  </div>' +
        '</div>' +
        '<div class="sp-panel">' +
        '  <div class="sp-panel-head">🧠 学好这句</div>' +
        '  <div class="sp-panel-body">点任意单词或下方「🔊 播放」收听整句 Tina 读音；' +
        '试试隐藏中文，看英文说意思。</div>' +
        '</div>' +
        '<div class="sp-actions">' +
        pill('is:prev', '‹ 上一句') +
        pill('is:play', '🔊 播放') +
        pill('is:all', '▶ 连续') +
        pill('is:stop', '■ 停止') +
        pill('is:next', '下一句 ›') +
        '</div>';
    },

    after: function () {
      if (App.immAuto) {
        App.immAuto = false;
        var u = unit();
        var s = u && (u.sentences || [])[App.state.immIdx];
        if (s) Speaker.speak(cleanEn(s.en));
      }
    },

    actions: {
      'is:play': function () {
        var u = unit();
        var s = u && (u.sentences || [])[App.state.immIdx];
        if (s) Speaker.speak(cleanEn(s.en));
      },
      'is:prev': function () {
        var i = App.state.immIdx || 0;
        if (i > 0) { App.immAuto = true; location.hash = '#/isentence/' + App.state.immUnit + '/' + (i - 1); }
        else Util.toast('已经是第一句了');
      },
      'is:next': function () {
        var u = unit();
        var n = u ? (u.sentences || []).length : 0;
        var i = App.state.immIdx || 0;
        if (i < n - 1) { App.immAuto = true; location.hash = '#/isentence/' + App.state.immUnit + '/' + (i + 1); }
        else Util.toast('已经是最后一句了');
      },
      'is:all': function () {
        var u = unit();
        var list = (u && u.sentences || []).map(function (s) { return cleanEn(s.en); });
        if (!list.length) return;
        Speaker.speakQueue(list, {
          gap: 420,
          onItem: function (i) {
            var h = '#/isentence/' + App.state.immUnit + '/' + i;
            if (location.hash !== h) location.hash = h;   // 页面跟随队列（不影响音频）
          },
          onDone: function () { Util.toast('本单元句型连续播放完成'); }
        });
      },
      'is:toggleZh': function () {
        App.state.showZh = App.state.showZh === false;
        App.rerender();
      }
    }
  };

  function topBar(u, count) {
    var list = (u.words || u.sentences || []);
    var total = count != null ? count : list.length;
    var idx = Math.min(Math.max(App.state.immIdx || 0, 0), Math.max(total - 1, 0));
    return '<header class="sp-top">' +
      '<button class="btn btn-back" data-nav="#/unit/' + u.id + '">' + Util.icon('left', 15) + ' 返回单元</button>' +
      '<div class="sp-top-title">Unit ' + u.no + ' · ' + esc(u.title) + '</div>' +
      '<div class="sp-pos">' + (idx + 1) + '/' + total + '</div>' +
      '</header>';
  }

  /* topBar 在两个视图里使用（声明提前） */
  ImmersiveWordView.render = ImmersiveWordView.render.bind(null);
  global.ImmersiveWordView = ImmersiveWordView;
  global.ImmersiveSentenceView = ImmersiveSentenceView;
})(window);
