/* 单元页：单词点读 / 句型跟读 / 知识点 / 练习入口 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  var TABS = [
    { key: 'words', label: '单词' },
    { key: 'sentences', label: '句型' },
    { key: 'grammar', label: '知识点' },
    { key: 'practice', label: '练习' }
  ];

  var TYPE_LABEL = { en2zh: '英译中', zh2en: '中译英', listen: '听音辨词', blank: '补全句子', order: '句子排序', sent2zh: '句意选择', grammar: '语法' };

  var WORD_FILTERS = [
    { key: 'all', label: '全部' },
    { key: 'none', label: '未标记' },
    { key: 'review', label: '↻ 需复习' },
    { key: 'mastered', label: '✓ 已掌握' }
  ];

  /* 按掌握状态过滤单词（列表展示与连续播放共用） */
  function filteredWords(u) {
    var f = App.state.unitWordFilter || 'all';
    var words = u.words || [];
    if (f === 'all') return words;
    return words.filter(function (w) {
      return Store.getWordState(u.id, w.en) === f;
    });
  }

  /* 工具栏播放状态：playingMode 记录当前"连续播放/跟读"进行中，
     局部重渲染（如标记掌握）后由 toolbar() 依此还原按钮态 */
  var playingMode = null;

  function clearHighlights() {
    var els = document.querySelectorAll('.playing');
    for (var i = 0; i < els.length; i++) els[i].classList.remove('playing');
    playingMode = null;
    syncToolbar();
  }

  function syncToolbar() {
    var b = document.querySelector('[data-tb="play"]');
    if (b) {
      var on = playingMode === 'play';
      b.classList.toggle('is-playing', on);
      b.innerHTML = Util.icon('play', 16) + ' ' + (on ? '播放中…' : '连续播放');
    }
    b = document.querySelector('[data-tb="follow"]');
    if (b) {
      var on2 = playingMode === 'follow';
      b.classList.toggle('is-playing', on2);
      b.innerHTML = on2 ? '👂 跟读中…' : '👂 跟读模式';
    }
  }

  function highlightIndex(i) {
    clearHighlights();
    var el = document.querySelector('[data-idx="' + i + '"]');
    if (el) {
      el.classList.add('playing');
      try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { el.scrollIntoView(); }
    }
  }

  var UnitView = {
    render: function () {
      var unitId = App.state.unitId;
      var u = Content.unitById(unitId);
      if (!u) return '<div class="card">未找到该单元 <button class="btn btn-mini" data-nav="#/home">返回首页</button></div>';
      var tab = App.state.unitTab || 'words';

      var tabsHtml = TABS.map(function (t) {
        return '<button class="tab' + (tab === t.key ? ' active' : '') + '" data-action="unit:tab" data-tab="' + t.key + '">' + t.label + '</button>';
      }).join('');

      var body = '';
      if (tab === 'words') body = renderWords(u);
      else if (tab === 'sentences') body = renderSentences(u);
      else if (tab === 'grammar') body = renderGrammar(u);
      else body = renderPractice(u);

      return '' +
        '<header class="unit-head">' +
        '  <button class="btn btn-back" data-nav="#/home">' + Util.icon("left", 15) + ' 返回</button>' +
        '  <div class="unit-head-info"><span class="unit-head-emoji">' + u.emoji + '</span>' +
        '  <div><div class="unit-head-name">Unit ' + u.no + ' ' + esc(u.title) + '</div>' +
        '  <div class="unit-head-zh">' + esc(u.titleZh || '') + '</div></div></div>' +
        '</header>' +
        '<div class="tabs">' + tabsHtml + '</div>' +
        '<div class="unit-body">' + body + '</div>';
    },

    actions: {
      'unit:tab': function (d) {
        App.state.unitTab = d.tab;
        App.rerender();
      },

      'unit:playWord': function (d, el) {
        if (el && el.classList) el.classList.add('is-playing');
        Speaker.speak(d.text, {
          onend: function () { if (el && el.classList) el.classList.remove('is-playing'); }
        });
        if (d.unit) Store.recordPlay(d.unit);
      },

      'unit:markWord': function (d) {
        var cur = Store.getWordState(d.unit, d.word);
        var next = cur === d.state ? '' : d.state;
        Store.setWordState(d.unit, d.word, next);
        App.rerender();
      },

      'unit:playAll': function (d) {
        var u = Content.unitById(d.unit);
        if (!u) return;
        var words = filteredWords(u);
        if (!words.length) {
          Util.toast('当前筛选下没有单词，切换筛选试试', 'warn');
          return;
        }
        var texts = words.map(function (w) { return w.en; });
        var ok = Speaker.speakQueue(texts, {
          gap: 350,
          onItem: function (i) { highlightIndex(i); },
          onDone: clearHighlights
        });
        if (ok) { playingMode = 'play'; syncToolbar(); Util.toast('连续播放开始，点击「停止」可随时结束'); }
      },

      'unit:follow': function (d) {
        var u = Content.unitById(d.unit);
        if (!u) return;
        var words = filteredWords(u);
        if (!words.length) {
          Util.toast('当前筛选下没有单词，切换筛选试试', 'warn');
          return;
        }
        var texts = words.map(function (w) { return w.en; });
        var ok = Speaker.speakQueue(texts, {
          gap: 1800,
          onItem: function (i) { highlightIndex(i); },
          onDone: function () { clearHighlights(); Util.toast('跟读结束，真棒！🎉'); }
        });
        if (ok) { playingMode = 'follow'; syncToolbar(); Util.toast('跟读模式：听一个，大声跟读一个（无需麦克风，不作发音评分）'); }
      },

      'unit:playSentences': function (d) {
        var u = Content.unitById(d.unit);
        if (!u) return;
        var sents = u.sentences || [];
        var texts = sents.map(function (s) { return s.en; });
        var ok = Speaker.speakQueue(texts, {
          gap: 600,
          onItem: function (i) { highlightIndex(i); },
          onDone: clearHighlights
        });
        if (ok) { playingMode = 'play'; syncToolbar(); }
      },

      'unit:followSentences': function (d) {
        var u = Content.unitById(d.unit);
        if (!u) return;
        var sents = u.sentences || [];
        var texts = sents.map(function (s) { return s.en; });
        var ok = Speaker.speakQueue(texts, {
          gap: 2500,
          onItem: function (i) { highlightIndex(i); },
          onDone: function () { clearHighlights(); Util.toast('跟读结束，真棒！🎉'); }
        });
        if (ok) { playingMode = 'follow'; syncToolbar(); }
      },

      'unit:stop': function () {
        Speaker.stop();
        clearHighlights();
      },

      'unit:toggleZh': function () {
        App.state.showZh = !App.state.showZh;
        App.rerender();
      },

      'unit:wordFilter': function (d) {
        App.state.unitWordFilter = d.f;
        App.rerender();
      },

      'unit:startPractice': function (d) {
        App.startPractice([d.unit], d.preset, 'Unit ' + (Content.unitById(d.unit) || {}).no + ' ' + presetLabel(d.preset), d.count ? +d.count : 10);
      }
    }
  };

  function presetLabel(preset) {
    if (preset === 'words') return '单词练习';
    if (preset === 'sentences') return '句型练习';
    if (preset === 'grammar') return '语法练习';
    return '综合测试';
  }

  function toolbar(unitId, opts) {
    var playOn = playingMode === 'play';
    var followOn = playingMode === 'follow';
    return '<div class="toolbar">' +
      '<button class="btn btn-mini btn-primary' + (playOn ? ' is-playing' : '') + '" data-action="' + opts.playAction + '" data-unit="' + unitId + '" data-tb="play">' + Util.icon("play", 16) + ' ' + (playOn ? '播放中…' : '连续播放') + '</button>' +
      '<button class="btn btn-mini btn-primary' + (followOn ? ' is-playing' : '') + '" data-action="' + opts.followAction + '" data-unit="' + unitId + '" data-tb="follow">' + (followOn ? '👂 跟读中…' : '👂 跟读模式') + '</button>' +
      '<button class="btn btn-mini" data-action="unit:stop">' + Util.icon("stop", 16) + ' 停止</button>' +
      '<button class="btn btn-mini" data-action="unit:toggleZh">' + (App.state.showZh ? '🙈 隐藏中文' : '🐵 显示中文') + '</button>' +
      '</div>';
  }

  function renderWords(u) {
    var showZh = App.state.showZh;
    var filter = App.state.unitWordFilter || 'all';
    var words = filteredWords(u);
    var html = toolbar(u.id, { playAction: 'unit:playAll', followAction: 'unit:follow' });
    /* 状态筛选 */
    html += '<div class="scope-row" style="margin-bottom:10px">' + WORD_FILTERS.map(function (f) {
      var on = filter === f.key;
      return '<button class="chip-scope' + (on ? ' on' : '') + '" data-action="unit:wordFilter" data-f="' + f.key + '">' + f.label + '</button>';
    }).join('') + '<span class="muted small" style="align-self:center">' + words.length + ' 词</span></div>';
    html += '<div class="source-tip">💡 点击单词旁边的 ' + Util.icon("volume", 18) + ' 听发音；✓ 标记已掌握，↻ 标记需要复习</div>';
    if (!words.length) {
      return html + '<div class="card empty-card">当前筛选下没有单词，试试「全部」</div>';
    }
    html += '<div class="word-list">';
    words.forEach(function (w, i) {
      var state = Store.getWordState(u.id, w.en);
      html += '<div class="word-card' + (state === 'mastered' ? ' is-mastered' : state === 'review' ? ' is-review' : '') + '" data-idx="' + i + '">' +
        '<div class="word-main">' +
        '<div class="word-en-row">' +
        '<span class="word-en">' + esc(w.en) + '</span>' +
        '<button class="icon-btn" data-action="unit:playWord" data-text="' + esc(w.en) + '" data-unit="' + u.id + '" aria-label="播放发音">' + Util.icon("volume", 18) + '</button>' +
        '</div>' +
        (showZh ? '<div class="word-zh">' + esc(w.zh) + '</div>' : '') +
        (w.exEn ? '<div class="word-ex"><button class="icon-btn mini" data-action="unit:playWord" data-text="' + esc(w.exEn) + '" data-unit="' + u.id + '">' + Util.icon("volume", 18) + '</button> ' + esc(w.exEn) + (showZh ? ' <span class="ex-zh">' + esc(w.exZh || '') + '</span>' : '') + '</div>' : '') +
        '</div>' +
        '<div class="word-ops">' +
        '<button class="mark-btn mark-ok' + (state === 'mastered' ? ' on' : '') + '" data-action="unit:markWord" data-unit="' + u.id + '" data-word="' + esc(w.en) + '" data-state="mastered">' + Util.icon("check", 14) + ' 会了</button>' +
        '<button class="mark-btn mark-review' + (state === 'review' ? ' on' : '') + '" data-action="unit:markWord" data-unit="' + u.id + '" data-word="' + esc(w.en) + '" data-state="review">↻ 复习</button>' +
        '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderSentences(u) {
    var showZh = App.state.showZh;
    var html = toolbar(u.id, { playAction: 'unit:playSentences', followAction: 'unit:followSentences' });
    html += '<div class="source-tip">💡 逐句点读，先听再跟读。句型为本单元重点句式（复习参考）</div>';
    html += '<div class="sent-list">';
    (u.sentences || []).forEach(function (s, i) {
      html += '<div class="sent-card" data-idx="' + i + '">' +
        '<div class="sent-en">' + esc(s.en) +
        '<button class="icon-btn" data-action="unit:playWord" data-text="' + esc(s.en) + '" data-unit="' + u.id + '">' + Util.icon("volume", 18) + '</button>' +
        '</div>' +
        (showZh ? '<div class="sent-zh">' + esc(s.zh) + '</div>' : '<div class="sent-zh hidden-zh" data-action="unit:toggleZh">👆 点击顶部「显示中文」查看意思</div>') +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderGrammar(u) {
    var html = '<div class="source-tip">💡 用简单的话讲清楚本单元重点，点击 ' + Util.icon("volume", 18) + ' 听例句</div>';
    (u.grammar || []).forEach(function (g) {
      html += '<div class="card grammar-card">' +
        '<div class="grammar-title">📘 ' + esc(g.title) + '</div>' +
        '<ul class="grammar-points">' +
        g.explain.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') +
        '</ul>' +
        (g.examples || []).map(function (e) {
          return '<div class="grammar-ex">' +
            '<button class="icon-btn mini" data-action="unit:playWord" data-text="' + esc(e.en) + '" data-unit="' + u.id + '">' + Util.icon("volume", 18) + '</button> ' +
            '<span class="ge-en">' + esc(e.en) + '</span>' +
            (App.state.showZh ? '<span class="ge-zh">' + esc(e.zh) + '</span>' : '') +
            '</div>';
        }).join('') +
        '</div>';
    });
    if (!(u.grammar || []).length) html += '<div class="card muted-card">本单元暂无知识点内容</div>';
    return html;
  }

  function renderPractice(u) {
    var s = Store.data.units[u.id] || { sessions: 0, total: 0, correct: 0, best: -1 };
    var acc = s.total ? Math.round(s.correct * 100 / s.total) : 0;
    var statHtml = s.sessions
      ? '<div class="unit-practice-stat">已练 ' + s.sessions + ' 组 · 正确率 ' + acc + '%' + (s.best >= 0 ? ' · 最好成绩 ' + s.best + '分' : '') + '</div>'
      : '<div class="unit-practice-stat">还没有练过，来试一试吧！</div>';

    return '<div class="card">' +
      '<div class="card-title">✏️ 单元练习</div>' + statHtml +
      '<div class="practice-grid">' +
      '<button class="practice-btn" data-action="unit:startPractice" data-unit="' + u.id + '" data-preset="words" data-count="10"><span class="pb-emoji">🔤</span>单词练习<span class="pb-sub">英译中 · 中译英 · 听音辨词</span></button>' +
      '<button class="practice-btn" data-action="unit:startPractice" data-unit="' + u.id + '" data-preset="sentences" data-count="10"><span class="pb-emoji">📝</span>句型练习<span class="pb-sub">补全 · 排序 · 句意选择</span></button>' +
      '<button class="practice-btn" data-action="unit:startPractice" data-unit="' + u.id + '" data-preset="grammar" data-count="99"><span class="pb-emoji">📖</span>语法练习<span class="pb-sub">本单元知识点选择题</span></button>' +
      '<button class="practice-btn pb-mixed" data-action="unit:startPractice" data-unit="' + u.id + '" data-preset="mixed" data-count="15"><span class="pb-emoji">🏆</span>单元综合测试<span class="pb-sub">随机 15 题，全部题型</span></button>' +
      '</div></div>';
  }

  global.UnitView = UnitView;
})(window);
