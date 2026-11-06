/* 主控制器（V2.0）：路由、底部导航、事件分发、初始化
   六大板块：首页 / 练习 / 错题本 / 阅读 / 进度 / 设置 */
(function (global) {
  'use strict';

  var App = {
    route: 'home',
    state: { unitId: null, knowledgeUnitId: null, unitTab: 'words', articleId: null, showZh: true, wrongShowAll: false, libraryId: null },
    knState: { showZh: true, phraseFilter: 'all' },
    libState: null,
    session: null,
    practiceCfg: { scope: 'all', cat: 'listen', preset: 'listenAll' },
    readingState: null,
    articleState: null,
    wrongState: null,
    views: {},
    actions: {},
    main: null,

    init: function () {
      this.main = document.getElementById('app');

      Store.load();
      this.state.showZh = Store.data.settings.showZh !== false;
      this.knState.showZh = Store.data.settings.knowledgeShowZh !== false;
      Content.load();
      Speaker.init();
      this.applyFontSize();

      this.views = {
        home: global.HomeView,
        unit: global.UnitView,
        knowledge: global.KnowledgeView,
        library: global.LibraryView,
        libraryUpload: global.LibraryView,
        libraryDetail: global.LibraryView,
        libraryReview: global.LibraryView,
        librarySettings: global.LibraryView,
        learn: global.LearnHubView,
        me: global.MeHubView,
        iword: global.ImmersiveWordView,
        isentence: global.ImmersiveSentenceView,
        igrammar: global.ImmersiveGrammarView,
        practice: global.PracticeView,
        wrong: global.WrongView,
        reading: global.ReadingView,
        read: global.ArticleView,
        grammar: global.GrammarView,
        gtopic: global.GrammarTopicView,
        dictation: global.DictationView,
        progress: global.ProgressView,
        settings: global.SettingsView
      };
      Object.keys(this.views).forEach(function (k) {
        var v = App.views[k];
        if (v && v.actions) Object.assign(App.actions, v.actions);
      });

      /* 顶部提示条 */
      if (!Store.available) {
        var banner = document.getElementById('banner');
        banner.innerHTML = '⚠️ 当前浏览器无法保存学习进度（可能是无痕模式），刷新后学习记录会丢失';
        banner.classList.remove('hidden');
      }

      window.addEventListener('hashchange', function () { App.rerender(); });
      document.addEventListener('click', onGlobalClick);

      /* 防抖保存兜底：页面切后台/关闭前立即落盘，避免最后 500ms 内的记录丢失 */
      window.addEventListener('pagehide', function () { Store.saveNow(); });
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') Store.saveNow();
      });

      /* 练习/默写进行中刷新或离开时提醒（成绩在完成时才落账，避免孩子误刷新丢整组） */
      window.addEventListener('beforeunload', function (e) {
        var busy = (App.session && !App.session.done) || (App.dictSession && !App.dictSession.done);
        if (busy) {
          e.preventDefault();
          e.returnValue = '';
        }
      });

      /* PWA Service Worker（file:// 打开时自动跳过） */
      if ('serviceWorker' in navigator &&
          (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
          /* 有新版本安装完成时提醒刷新，避免“改了内容还看到旧页面”的困惑 */
          reg.addEventListener('updatefound', function () {
            var nw = reg.installing;
            if (!nw) return;
            nw.addEventListener('statechange', function () {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                Util.toast('🔄 学习工具有更新，关闭后重新打开即可生效', 'warn');
              }
            });
          });
        }).catch(function (e) {
          console.warn('Service Worker 注册失败（不影响使用）', e);
        });
      }

      if (!location.hash) location.hash = '#/home';
      this.rerender();
    },

    /* 设置里的字体大小档位 */
    applyFontSize: function () {
      var fs = (Store.data.settings && Store.data.settings.fontSize) || 'm';
      document.body.classList.remove('fs-s', 'fs-m', 'fs-l');
      document.body.classList.add('fs-' + fs);
    },

    parseHash: function () {
      var h = (location.hash || '').replace(/^#\/?/, '');
      var seg = h.split('/').filter(Boolean);
      if (!seg.length) return { route: 'home' };
      if (seg[0] === 'unit' && seg[1]) {
        this.state.unitId = seg[1];
        return { route: 'unit' };
      }
      if (seg[0] === 'knowledge' && seg[1]) {
        this.state.knowledgeUnitId = seg[1];
        return { route: 'knowledge' };
      }
      if (seg[0] === 'learn') return { route: 'learn' };
      if (seg[0] === 'me') return { route: 'me' };
      if ((seg[0] === 'iword' || seg[0] === 'isentence' || seg[0] === 'igrammar') && seg[1]) {
        this.state.immUnit = seg[1];
        this.state.immIdx = Math.max(0, parseInt(seg[2] || '0', 10) || 0);
        if (seg[0] === 'igrammar') this.state.igTopic = seg[1];
        return { route: seg[0] };
      }
      /* 我的资料库（V3.0） */
      if (seg[0] === 'library') {
        if (seg[1] === 'upload') return { route: 'libraryUpload' };
        if (seg[1] === 'settings') return { route: 'librarySettings' };
        if (seg[1] === 'detail' && seg[2]) { this.state.libraryId = seg[2]; return { route: 'libraryDetail' }; }
        if (seg[1] === 'review' && seg[2]) { this.state.libraryId = seg[2]; return { route: 'libraryReview' }; }
        return { route: 'library' };
      }
      if (seg[0] === 'read' && seg[1]) {
        this.state.articleId = seg[1];
        return { route: 'read' };
      }
      if (seg[0] === 'grammar' && seg[1]) {
        this.state.topicId = seg[1];
        return { route: 'gtopic' };
      }
      return { route: seg[0] };
    },

    rerender: function () {
      var parsed = this.parseHash();
      this.route = this.views[parsed.route] ? parsed.route : 'home';
      /* 页面/文章/单元/语法主题切换时停止朗读；答题反馈等局部重渲染不打断播放 */
      var sig = this.route + '|' + this.state.unitId + '|' + this.state.unitTab + '|' + this.state.articleId + '|' + this.state.topicId + '|' + this.state.knowledgeUnitId + '|' + this.state.libraryId;
      if (sig !== this._sig) {
        Speaker.stop();
        this._sig = sig;
      }
      var view = this.views[this.route];
      if (view) {
        this.main.innerHTML = view.render();
        if (view.after) view.after();
      }
      this.updateNav();
      if (sig !== this._prevSigForScroll) {
        window.scrollTo(0, 0);
        this._prevSigForScroll = sig;
      }
    },

    updateNav: function () {
      /* UI 2.0 五导航：路由 → 导航项映射 */
      var TAB_FOR = {
        home: 'home',
        learn: 'learn', unit: 'learn', knowledge: 'learn', gtopic: 'learn',
        grammar: 'learn', reading: 'learn', read: 'learn',
        iword: 'learn', isentence: 'learn', igrammar: 'learn',
        practice: 'practice', dictation: 'practice',
        wrong: 'wrong',
        me: 'me', progress: 'me', library: 'me', libraryUpload: 'me',
        libraryDetail: 'me', libraryReview: 'me', librarySettings: 'me',
        settings: 'me'
      };
      var currentTab = TAB_FOR[this.route] || 'home';
      var btns = document.querySelectorAll('.nav-btn');
      for (var i = 0; i < btns.length; i++) {
        var target = (btns[i].getAttribute('data-nav') || '').replace('#/', '');
        var on = target === currentTab;
        btns[i].classList.toggle('active', on);
        btns[i].setAttribute('aria-current', on ? 'page' : 'false');
      }
      var badge = document.getElementById('wrong-badge');
      if (badge) {
        var n = Store.unresolvedCount();
        badge.textContent = n > 99 ? '99+' : n;
        badge.style.display = n ? '' : 'none';
      }
    },

    go: function (hash) {
      if (location.hash === hash) this.rerender();
      else location.hash = hash;
    },

    /* 语法专项会话：题目由语法视图准备并传入 */
    startGrammarSession: function (topic, questions, note) {
      if (!questions || !questions.length) {
        Util.toast('该主题暂时没有可练习的题目', 'warn');
        return;
      }
      Speaker.stop();
      this.session = {
        title: '语法：' + topic.title + (note ? '（' + note + '）' : ''),
        cfg: { grammar: topic.id },
        questions: questions,
        idx: 0,
        results: [],
        answered: false,
        orderPicks: [],
        orderUsed: [],
        done: false
      };
      if (this.route !== 'practice') location.hash = '#/practice';
      else this.rerender();
    },

    startPractice: function (unitIds, preset, title, count) {
      var types = Gen.PRESETS[preset] || Gen.PRESETS.mixed;
      var pool = Gen.buildPool(unitIds, types);
      if (!pool.length) {
        Util.toast('该范围可用题目不足，换个范围或单元试试', 'warn');
        return;
      }
      var questions = Util.shuffle(pool).slice(0, count);
      Speaker.stop();
      this.session = {
        title: title,
        cfg: { unitIds: unitIds, preset: preset, title: title, count: count },
        questions: questions,
        idx: 0,
        results: [],
        answered: false,
        orderPicks: [],
        orderUsed: [],
        done: false
      };
      if (this.route !== 'practice') location.hash = '#/practice';
      else this.rerender();
    }
  };

  function onGlobalClick(e) {
    var el = e.target.closest('[data-nav],[data-speak],[data-action]');
    if (!el) return;
    if (el.hasAttribute('data-nav')) {
      var hash = el.getAttribute('data-nav');
      if (location.hash === hash) App.rerender();
      else location.hash = hash;
      return;
    }
    if (el.hasAttribute('data-speak')) {
      Util.speakWithState(el.getAttribute('data-speak'), el);
      return;
    }
    if (el.hasAttribute('data-action')) {
      var name = el.getAttribute('data-action');
      var fn = App.actions[name];
      if (fn) {
        fn(el.dataset || {}, el, e);
      } else {
        console.warn('未注册的操作：' + name);
      }
    }
  }

  global.App = App;
  App.init();
})(window);
