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

  /* ================= 沉浸式语法 ================= */
  function grammarTopic() {
    var fn = global.GrammarTopicView && global.GrammarTopicView.topicById;
    return fn ? fn(App.state.igTopic) : null;
  }
  function ruleZhTexts(rule) {
    var out = [];
    function add(v) {
      if (typeof v === 'string' && /[\u4e00-\u9fff]/.test(v)) {
        var s = v.trim();
        if (s && out.indexOf(s) < 0) out.push(s);
      }
    }
    add(rule.title); add(rule.explain); add(rule.formula); add(rule.tip);
    if (rule.wrong) { add(rule.wrong.bad); add(rule.wrong.good); add(rule.wrong.why); }
    (rule.examples || []).forEach(function (e) { add(e.zh); });
    return out;
  }

  var ImmersiveGrammarView = {
    render: function () {
      var t = grammarTopic();
      if (!t) return '<div class="card">未找到语法主题 <button class="btn btn-mini" data-nav="#/grammar">返回</button></div>';
      var rules = t.rules || [];
      var idx = Math.min(Math.max(App.state.igIdx || 0, 0), Math.max(rules.length - 1, 0));
      var rule = rules[idx];
      var showZh = App.state.showZh !== false;

      var html = '<header class="sp-top">' +
        '<button class="btn btn-back" data-nav="#/grammar/' + t.id + '">' + Util.icon('left', 15) + ' 返回主题</button>' +
        '<div class="sp-top-title">' + esc(t.title) + '</div>' +
        '<div class="sp-pos">' + (idx + 1) + '/' + rules.length + '</div>' +
        '</header>' +
        '<div class="progress-track" style="height:4px;border-radius:2px;background:var(--u2-line-soft);margin:0 2px">' +
        '<div class="progress-fill" style="width:' + Math.round((idx + 1) * 100 / rules.length) + '%"></div></div>' +
        '<div class="sp-stage">' +
        '  <div class="sp-pos-line">' + esc(t.emoji || '🧠') + ' 规则 ' + (idx + 1) + ' / ' + rules.length + '</div>' +
        (idx === 0 && t.scene ? '  <div class="sp-zh">🎯 什么时候用：' + esc(t.scene) + '</div>' : '') +
        '  <div class="sp-rule-title">' + esc(rule.title) + '</div>' +
        (rule.formula ? '  <div class="sp-formula">' + esc(rule.formula) + '</div>' : '') +
        (rule.explain ? '  <div class="sp-explain">' + esc(rule.explain) + '</div>' : '') +
        '</div>';

      /* 例句（逐条：大字逐词 + 点读 + 中文）*/
      (rule.examples || []).forEach(function (e, ei) {
        var tokens = String(e.en || '').split(' ').filter(Boolean);
        html += '<div class="sp-exlist-item">' +
          '<div class="sp-words">' +
          tokens.map(function (tk) {
            var punct = /^[,.!?;:]+/.test(tk);
            return '<span class="sp-word' + (punct ? ' punct' : '') + '" data-action="ig:playEx" data-ei="' + ei + '">' + esc(tk) + '</span>';
          }).join('') +
          '</div>' +
          (showZh && e.zh ? '<div class="sp-ex-zh-center">' + esc(e.zh) + '</div>' : '') +
          '</div>';
      });

      /* 易错对比 */
      if (rule.wrong) {
        html += '<div class="sp-wrong">' +
          '<div class="sp-wrong-bad">❌ ' + esc(rule.wrong.bad) + '</div>' +
          '<div class="sp-wrong-good">✅ ' + esc(rule.wrong.good) + '</div>' +
          (rule.wrong.why ? '<div class="sp-wrong-why">' + esc(rule.wrong.why) + '</div>' : '') +
          '</div>';
      }
      if (rule.tip) html += '<div class="sp-tip">💡 ' + esc(rule.tip) + '</div>';

      /* 面板 + 操作 */
      var isLast = idx === rules.length - 1;
      html += '<div class="sp-panel">' +
        '  <div class="sp-panel-head">🗣 中文讲解</div>' +
        '  <div class="sp-panel-body">「🗣 中文讲解」用设备中文语音朗读本条规则；英文例句用 Tina 语音包播放。</div>' +
        '</div>' +
        '<div class="sp-actions">' +
        pill('ig:prev', '‹ 上一条') +
        pill('ig:playEn', '🔊 例句朗读') +
        pill('ig:readZh', '🗣 中文讲解') +
        pill('ig:stop', '■ 停止') +
        pill('ig:next', '下一条 ›') +
        '</div>' +
        (isLast ? '<div class="sp-actions"><button class="btn btn-primary btn-block" data-action="ig:practice" style="max-width:420px">✏️ 学完了，开始主题练习</button></div>' : '');

      return html;
    },

    after: function () {
      if (App.immAuto) {
        App.immAuto = false;
        var t = grammarTopic();
        var rule = t && (t.rules || [])[App.state.igIdx];
        if (rule && rule.examples && rule.examples.length) {
          var ens = rule.examples.map(function (e) { return e.en; });
          Speaker.speakQueue(ens, { gap: 420 });
        }
      }
    },

    actions: {
      'ig:playEx': function (d) {
        var t = grammarTopic();
        var rule = t && (t.rules || [])[App.state.immIdx];
        var e = rule && (rule.examples || [])[+d.ei];
        if (e) Speaker.speak(e.en);
      },
      'ig:playEn': function () {
        var t = grammarTopic();
        var rule = t && (t.rules || [])[App.state.igIdx];
        if (!rule || !rule.examples || !rule.examples.length) return;
        var ens = rule.examples.map(function (e) { return e.en; });
        Speaker.speakQueue(ens, { gap: 420 });
      },
      'ig:readZh': function () {
        var t = grammarTopic();
        var rule = t && (t.rules || [])[App.state.igIdx];
        if (!rule) return;
        var texts = ruleZhTexts(rule);
        if (!texts.length) { Util.toast('本条规则暂无可朗读的中文讲解', 'warn'); return; }
        if (!Speaker.supported) { Util.toast('当前设备或浏览器不支持中文语音合成', 'warn'); return; }
        Speaker.speakQueue(texts, { lang: 'zh-CN', rate: 0.92, gap: 450 });
      },
      'ig:stop': function () { Speaker.stop(); },
      'ig:prev': function () {
        var i = App.state.igIdx || 0;
        if (i > 0) { App.immAuto = true; location.hash = '#/igrammar/' + App.state.igTopic + '/' + (i - 1); }
        else Util.toast('已经是第一条规则了');
      },
      'ig:next': function () {
        var t = grammarTopic();
        var n = t ? (t.rules || []).length : 0;
        var i = App.state.igIdx || 0;
        if (i < n - 1) { App.immAuto = true; location.hash = '#/igrammar/' + App.state.igTopic + '/' + (i + 1); }
        else Util.toast('已是最后一条，可开始主题练习');
      },
      'ig:practice': function () {
        App.state.topicId = App.state.igTopic;
        if (App.actions['gt:practice']) App.actions['gt:practice']();
      }
    }
  };

  global.ImmersiveGrammarView = ImmersiveGrammarView;

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
