/* 阅读板块首页：分类 / 搜索 / 难度筛选 / 文章列表 / 视频资源 / 收藏与历史 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  var LEVELS = { 1: '⭐ 入门', 2: '⭐⭐ 进阶', 3: '⭐⭐⭐ 挑战' };

  function catOf(key) {
    return READING_CONTENT.categories.filter(function (c) { return c.key === key; })[0] || { name: key, emoji: '📖' };
  }

  function articleCard(a) {
    var cat = catOf(a.category);
    var hist = Store.readState().history[a.id];
    var fav = Store.isFavorite(a.id);
    var readBadge = hist && hist.quizDone
      ? '<span class="rd-badge ok">已读 · 测试 ' + hist.quizBest + '分</span>'
      : (hist ? '<span class="rd-badge">读过</span>' : '');
    return '<div class="rd-card">' +
      '<button class="rd-main" data-nav="#/read/' + a.id + '">' +
      '<div class="rd-head"><span class="rd-cat">' + cat.emoji + ' ' + esc(cat.name) + '</span>' + readBadge + '</div>' +
      '<div class="rd-title">' + esc(a.title) + '</div>' +
      '<div class="rd-zh">' + esc(a.titleZh || '') + '</div>' +
      '<div class="rd-meta">' +
      '<span class="rd-m">' + (LEVELS[a.level] || '') + '</span>' +
      '<span class="rd-m">⏱ ' + a.minutes + ' 分钟</span>' +
      '<span class="rd-m">🇨🇳 双语</span>' +
      '<span class="rd-m">' + Util.icon("volume", 18) + ' 可朗读</span>' +
      (a.questions && a.questions.length ? '<span class="rd-m">📝 ' + a.questions.length + ' 题</span>' : '') +
      '</div></div>' +
      '<button class="fav-btn' + (fav ? ' on' : '') + '" data-action="reading:fav" data-id="' + a.id + '" aria-label="收藏">' + (fav ? '★' : '☆') + '</button>' +
      '</div>';
  }

  var ReadingView = {
    render: function () {
      var st = App.readingState || (App.readingState = { tab: 'articles', cat: 'all', level: 0, q: '' });
      var rc = READING_CONTENT;
      var rs = Store.readState();

      var tabs = [
        { k: 'articles', label: '📖 文章' },
        { k: 'videos', label: '🎬 视频资源' },
        { k: 'mine', label: '⭐ 收藏与历史' }
      ].map(function (t) {
        return '<button class="tab' + (st.tab === t.k ? ' active' : '') + '" data-action="reading:tab" data-tab="' + t.k + '">' + t.label + '</button>';
      }).join('');

      var body = '';
      if (st.tab === 'articles') {
        var cats = ['<button class="chip-scope' + (st.cat === 'all' ? ' on' : '') + '" data-action="reading:cat" data-cat="all">全部</button>']
          .concat(rc.categories.map(function (c) {
            return '<button class="chip-scope' + (st.cat === c.key ? ' on' : '') + '" data-action="reading:cat" data-cat="' + c.key + '">' + c.emoji + ' ' + c.name + '</button>';
          })).join('');
        var levels = '<button class="chip-scope' + (st.level === 0 ? ' on' : '') + '" data-action="reading:level" data-lv="0">全部难度</button>' +
          '<button class="chip-scope' + (st.level === 1 ? ' on' : '') + '" data-action="reading:level" data-lv="1">⭐</button>' +
          '<button class="chip-scope' + (st.level === 2 ? ' on' : '') + '" data-action="reading:level" data-lv="2">⭐⭐</button>';

        var list = rc.articles.filter(function (a) {
          if (st.cat !== 'all' && a.category !== st.cat) return false;
          if (st.level && a.level !== st.level) return false;
          if (st.q) {
            var kw = st.q.toLowerCase();
            if ((a.title + ' ' + (a.titleZh || '')).toLowerCase().indexOf(kw) < 0) return false;
          }
          return true;
        });

        body = '<div class="card">' +
          '<input id="rd-search" class="search-input" type="search" placeholder="搜索标题…" value="' + esc(st.q) + '">' +
          '<div class="scope-row" style="margin-top:10px">' + cats + '</div>' +
          '<div class="scope-row" style="margin-top:8px">' + levels + '</div>' +
          '</div>' +
          (list.length
            ? list.map(articleCard).join('')
            : '<div class="card empty-card">没有符合条件的文章，换个筛选试试</div>');
      } else if (st.tab === 'videos') {
        body = '<div class="source-tip">🎬 以下为外部平台的优质英语学习资源导航。点击「打开」会跳转到对应网站（需要相应网络环境）。本工具未抓取、也未翻译任何视频字幕；「学习重点」是人工整理的复习提示。在视频网站内可使用其自带的字幕功能。</div>';
        body += READING_CONTENT.videos.map(function (v) {
          /* 仅允许 http(s) 外链，防其他协议注入 */
          var safeUrl = /^https?:\/\//i.test(v.url || '') ? v.url : '';
          return '<div class="card video-card">' +
            '<div class="rd-head"><span class="q-type-badge">' + (LEVELS[v.level] || '') + '</span></div>' +
            '<div class="rd-title" style="font-size:17px">' + esc(v.title) + '</div>' +
            '<div class="muted small">创作者：' + esc(v.creator) + '</div>' +
            '<div class="video-reason">' + esc(v.reason) + '</div>' +
            '<div class="video-focus"><span class="muted small">学习重点：</span>' +
            v.focus.map(function (f) { return '<span class="focus-chip">' + esc(f) + '</span>'; }).join('') + '</div>' +
            (safeUrl
              ? '<a class="btn btn-mini btn-primary" href="' + esc(safeUrl) + '" target="_blank" rel="noopener noreferrer">打开资源 ↗</a>'
              : '<span class="muted small">（链接无效，已停用）</span>') +
            '</div>';
        }).join('');
      } else {
        var favs = rs.favorites.map(function (id) {
          return READING_CONTENT.articles.filter(function (a) { return a.id === id; })[0];
        }).filter(Boolean);
        var hist = Object.keys(rs.history).map(function (id) {
          var a = READING_CONTENT.articles.filter(function (x) { return x.id === id; })[0];
          return a ? { a: a, h: rs.history[id] } : null;
        }).filter(Boolean).sort(function (x, y) { return y.h.lastAt - x.h.lastAt; });

        body = '<div class="card"><div class="card-title">⭐ 我的收藏（' + favs.length + '）</div>' +
          (favs.length ? favs.map(articleCard).join('') : '<div class="muted small">还没有收藏，点击文章卡片右侧 ☆ 收藏喜欢的文章</div>') +
          '</div>' +
          '<div class="card"><div class="card-title">🕘 阅读历史</div>' +
          (hist.length
            ? hist.slice(0, 8).map(function (x) {
              return '<button class="hist-row" data-nav="#/read/' + x.a.id + '">' +
                '<span class="hr-title">' + esc(x.a.title) + '</span>' +
                '<span class="hr-info muted small">' + Util.fmtDate(x.h.lastAt) + ' · 读过 ' + x.h.count + ' 次' +
                (x.h.quizDone ? ' · 测试' + x.h.quizBest + '分' : '') + '</span></button>';
            }).join('')
            : '<div class="muted small">还没有阅读记录，去文章列表挑一篇吧</div>') +
          '</div>' +
          '<div class="card"><div class="card-title">📒 生词本（' + rs.vocab.length + ' 词）</div>' +
          (rs.vocab.length
            ? '<button class="btn btn-primary btn-block" style="margin-bottom:10px" data-action="reading:vocabPractice">🎯 生词复习（听写 + 看中文写）</button>' +
              '<div class="vocab-cloud">' + rs.vocab.map(function (v) {
              return '<span class="vocab-chip">' + esc(v.en) + '<i>' + esc(v.zh) + '</i>' +
                '<button class="vc-del" data-action="reading:delVocab" data-en="' + esc(v.en) + '">✕</button></span>';
            }).join('') + '</div>'
            : '<div class="muted small">阅读时点击文章里的高亮生词即可收藏到这里</div>') +
          '</div>';
      }

      var totalMin = 0;
      var readCount = Object.keys(rs.history).filter(function (id) { return rs.history[id].quizDone; }).length;

      return '' +
        '<header class="page-head"><div class="book-title">📖 阅读</div>' +
        '<div class="book-sub">课外阅读 · 双语对照 · 点读朗读 · 阅读理解</div></header>' +
        '<section class="card hero-card"><div class="hero-stats">' +
        '<div class="hero-stat"><div class="hero-num">' + readCount + '<small>/' + READING_CONTENT.articles.length + '</small></div><div class="hero-label">已完成阅读</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + rs.favorites.length + '</div><div class="hero-label">收藏文章</div></div>' +
        '<div class="hero-stat"><div class="hero-num">' + rs.vocab.length + '</div><div class="hero-label">生词本</div></div>' +
        '</div></section>' +
        '<div class="tabs">' + tabs + '</div>' +
        body;
    },

    after: function () {
      var input = document.getElementById('rd-search');
      if (input) {
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            App.readingState.q = input.value.trim();
            App.rerender();
          }
        });
        input.addEventListener('change', function () {
          App.readingState.q = input.value.trim();
          App.rerender();
        });
      }
    },

    actions: {
      'reading:tab': function (d) {
        App.readingState.tab = d.tab;
        App.rerender();
      },
      'reading:cat': function (d) {
        App.readingState.cat = d.cat;
        App.rerender();
      },
      'reading:level': function (d) {
        App.readingState.level = +d.lv;
        App.rerender();
      },
      'reading:fav': function (d) {
        var on = Store.toggleFavorite(d.id);
        Util.toast(on ? '已收藏 ★' : '已取消收藏');
        App.rerender();
      },
      'reading:delVocab': function (d) {
        Store.removeVocab(d.en);
        App.rerender();
      },
      'reading:vocabPractice': function () {
        /* 跳到默写专项并直接开始生词复习模式 */
        App.dictSession = null;
        App.dictState = { mode: 'vocab', scope: 'all' };
        App.go('#/dictation');
        setTimeout(function () {
          var btn = document.querySelector('[data-action="dict:start"]');
          if (btn) btn.click();
        }, 80);
      }
    }
  };

  global.ReadingView = ReadingView;
})(window);
