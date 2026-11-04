/* 单元知识点学习页（V2.8 新增）
   数据：data/unit-knowledge.js（UNIT_KNOWLEDGE）
   五分类：Sounds 语音 / Phrases 短语 / Sentences 句型 / Grammar 语法 / Try to know 拓展
   - 全部英文内容点读（音频包优先，TTS 回退）
   - 中文显隐、整组连续朗读、逐条/整组标记进度（未学习/已学习/需复习/已掌握）
   - 进度保存在 Store.data.knowledge（localStorage），与单词/错题等原有数据互不影响 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  var CATS = [
    { key: 'sounds', label: 'Sounds', zh: '语音', icon: '🔤' },
    { key: 'phrases', label: 'Phrases', zh: '重点短语', icon: '💬' },
    { key: 'sentences', label: 'Sentences', zh: '重点句型', icon: '📝' },
    { key: 'grammar', label: 'Grammar', zh: '语法', icon: '🧠' },
    { key: 'extra', label: 'Try to know', zh: '拓展知识', icon: '🌟' }
  ];

  function knData() { return global.UNIT_KNOWLEDGE || { units: {} }; }
  function getUnit(unitId) { return knData().units[unitId] || null; }

  /* 该单元所有可计进度条目（与渲染顺序一致） */
  function collectItems(u) {
    var items = [];
    (u.sounds && u.sounds.rules || []).forEach(function (r) { items.push({ cat: 'sounds', id: r.id, title: r.letter + ' ' + (r.phonetic || '') }); });
    (u.phrases || []).forEach(function (p) { items.push({ cat: 'phrases', id: p.id, title: p.en }); });
    (u.sentences || []).forEach(function (s) { items.push({ cat: 'sentences', id: s.id, title: s.en }); });
    (u.grammar || []).forEach(function (g) { items.push({ cat: 'grammar', id: g.id, title: g.title }); });
    (u.extra || []).forEach(function (e) { items.push({ cat: 'extra', id: e.id, title: e.title }); });
    return items;
  }

  function stateOf(unitId, itemId) {
    var st = Store.data.knowledge && Store.data.knowledge[unitId] && Store.data.knowledge[unitId].items;
    return (st && st[itemId]) || '';
  }

  function stats(unitId) {
    var u = getUnit(unitId);
    if (!u) return { total: 0, learned: 0, mastered: 0, review: 0, pct: 0 };
    var items = collectItems(u);
    var learned = 0, mastered = 0, review = 0;
    items.forEach(function (it) {
      var s = stateOf(unitId, it.id);
      if (s === 'mastered') { mastered++; learned++; }
      else if (s === 'learned') learned++;
      else if (s === 'review') review++;
    });
    return { total: items.length, learned: learned, mastered: mastered, review: review, pct: items.length ? Math.round(learned * 100 / items.length) : 0 };
  }

  /* 对话切分：按 "--" 分隔成角色气泡 */
  function splitDialog(text) {
    if (!text || text.indexOf('--') < 0) return null;
    var parts = text.split('--');
    var out = [];
    for (var i = 1; i < parts.length; i++) {
      var t = parts[i].trim();
      if (t) out.push(t);
    }
    return out.length > 1 ? out : null;
  }

  function markButtons(unitId, itemId, state) {
    function b(v, icon, label, cls) {
      return '<button class="k-mark ' + cls + (state === v ? ' on' : '') + '" data-action="kn:mark" data-id="' + itemId + '" data-state="' + v + '" aria-label="' + label + '">' + icon + '</button>';
    }
    return '<div class="k-marks">' +
      b('learned', '✓', '已学习', 'k-learned') +
      b('review', '↻', '需复习', 'k-review') +
      b('mastered', '★', '已掌握', 'k-mastered') +
      '</div>';
  }

  function stateBadge(state) {
    if (state === 'mastered') return '<span class="k-badge k-badge-mastered">★ 已掌握</span>';
    if (state === 'review') return '<span class="k-badge k-badge-review">↻ 需复习</span>';
    if (state === 'learned') return '<span class="k-badge k-badge-learned">✓ 已学习</span>';
    return '';
  }

  /* 英文文本 → TTS 输入清理（斜杠读作 or，去星号），展示仍用原文 */
  function ttsText(s) {
    /* 保留音标外围的 /.../，避免 /w/ 被改写成 “orw or” 导致音标误读及语音包查找失败 */
    return String(s || '').replace(/\s+\/\s+/g, ' or ').replace(/[★]/g, '').trim();
  }

  function speakBtn(text, extra) {
    return '<button class="icon-btn' + (extra ? ' ' + extra : '') + '" data-action="kn:speak" data-tts="' + esc(ttsText(text)) + '" data-text="' + esc(text) + '" aria-label="播放">' + Util.icon("volume", 17) + '</button>';
  }

  function playBtnLabel(action, label) {
    return '<button class="btn btn-mini btn-primary" data-action="' + action + '">' + Util.icon("play", 15) + ' ' + label + '</button>';
  }

  /* ---------- 各分类渲染 ---------- */

  function renderSounds(u, showZh) {
    var s = u.sounds;
    if (!s || (!s.rules || !s.rules.length) && !s.intro) {
      return '<div class="card empty-card">原文资料未提供本单元 Sounds 内容</div>';
    }
    var html = '<div class="k-req">' + esc(s.intro || '') + '</div>';
    if (s.refUnit) {
      var ref = getUnit(s.refUnit);
      html += '<div class="card empty-card">本单元 Sounds 参考上文：' +
        (ref ? '<button class="btn btn-mini" data-nav="#/knowledge/' + s.refUnit + '?cat=sounds">' + esc(ref.title) + ' 的语音规则</button>' : '') + '</div>';
    }
    (s.rules || []).forEach(function (r) {
      var st = stateOf(u.id, r.id);
      html += '<section class="card k-rule" id="item-' + r.id + '">' +
        '<div class="k-rule-head">' +
        '<span class="k-letter">' + esc(r.letter || '') + '</span>' +
        '<span class="k-phonetic">' + esc(r.phonetic || '') + '</span>' +
        stateBadge(st) + markButtons(u.id, r.id, st) +
        '</div>' +
        '<div class="k-rule-body">' + esc(r.rule || '') + '</div>' +
        ((r.examples && r.examples.length) ? '<div class="k-ex-words">' +
          r.examples.map(function (w) {
            return '<button class="k-word-chip" data-action="kn:speak" data-tts="' + esc(ttsText(w)) + '">' + esc(w) + '</button>';
          }).join('') + '</div>' : '') +
        (r.special ? '<div class="k-special">⚠️ ' + esc(r.special) + '</div>' : '') +
        (r.tip ? '<div class="k-tip">💡 记忆口诀：' + esc(r.tip) + '</div>' : '') +
        '</section>';
    });
    if (s.outro) html += '<div class="k-tip k-tip-block">💡 ' + esc(s.outro) + '</div>';
    return html;
  }

  function phraseFilter() { return App.knState && App.knState.phraseFilter || 'all'; }

  function renderPhrases(u, showZh) {
    var list = u.phrases || [];
    if (!list.length) return '<div class="card empty-card">原文资料未提供本单元 Phrases 内容</div>';
    var filter = phraseFilter();
    var visible = list.filter(function (p) {
      var st = stateOf(u.id, p.id);
      if (filter === 'write') return p.req === 'write';
      if (filter === 'read') return p.req === 'read';
      if (filter === 'unlearned') return st === '';
      if (filter === 'review') return st === 'review';
      return true;
    });
    var writeN = list.filter(function (p) { return p.req === 'write'; }).length;
    var html = '<div class="k-req">' + esc(u.phrasesReq || '') + '（原文虚线分界已按资料定位）</div>';
    html += '<div class="scope-row" style="margin-bottom:10px;flex-wrap:wrap">' +
      [['all', '全部'], ['write', '会读会默(' + writeN + ')'], ['read', '会读会翻译(' + (list.length - writeN) + ')'], ['unlearned', '未掌握'], ['review', '需复习']].map(function (f) {
        return '<button class="chip-scope' + (filter === f[0] ? ' on' : '') + '" data-action="kn:phFilter" data-f="' + f[0] + '">' + f[1] + '</button>';
      }).join('') + '</div>';
    if (!visible.length) return html + '<div class="card empty-card">当前筛选下没有短语</div>';
    html += '<div class="k-list">';
    visible.forEach(function (p) {
      var st = stateOf(u.id, p.id);
      var zh = p.zh || '';
      var checkTag = p.check ? ' <span class="k-check">⚠️ 原文如此，待核对</span>' : '';
      html += '<div class="card k-phrase' + (st === 'mastered' ? ' is-mastered' : st === 'review' ? ' is-review' : '') + '" id="item-' + p.id + '">' +
        '<div class="k-item-main">' +
        '<div class="k-item-en-row">' + speakBtn(p.en) + '<span class="k-item-en">' + esc(p.en) + '</span></div>' +
        (showZh ? '<div class="k-item-zh">' + esc(zh) + checkTag + '</div>' : '<div class="k-item-zh k-zh-hidden" data-action="kn:toggleZh">👆 点击顶部「显示中文」查看意思</div>') +
        '</div>' +
        '<div class="k-item-ops">' + stateBadge(st) + markButtons(u.id, p.id, st) + '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderSentences(u, showZh) {
    var list = u.sentences || [];
    if (!list.length) return '<div class="card empty-card">原文资料未提供本单元 Sentences 内容</div>';
    var html = '<div class="k-req">点击喇叭逐句点读；顶部「全部朗读」可整组连续播放。英文句子开头首字母要大写哦！</div>';
    html += '<div class="k-list">';
    list.forEach(function (sn) {
      var st = stateOf(u.id, sn.id);
      var dlg = splitDialog(sn.en);
      var dlgZh = splitDialog(sn.zh);
      var body;
      if (dlg) {
        body = '<div class="k-dialog">' + dlg.map(function (line, i) {
          var zhLine = dlgZh && dlgZh[i] ? dlgZh[i] : '';
          return '<div class="k-bubble k-bubble-' + (i % 2 ? 'b' : 'a') + '">' +
            '<div class="k-bubble-en">' + speakBtn(line) + '<span>' + esc(line) + '</span></div>' +
            (showZh && zhLine ? '<div class="k-bubble-zh">' + esc(zhLine) + '</div>' : '') +
            '</div>';
        }).join('') + '</div>';
      } else {
        body = '<div class="k-item-en-row">' + speakBtn(sn.en) + '<span class="k-item-en k-sent-en">' + esc(sn.en) + '</span></div>' +
          (showZh ? '<div class="k-item-zh">' + esc(sn.zh || '') + '</div>' : '<div class="k-item-zh k-zh-hidden" data-action="kn:toggleZh">👆 点击顶部「显示中文」查看意思</div>');
      }
      html += '<div class="card k-sent' + (st === 'mastered' ? ' is-mastered' : st === 'review' ? ' is-review' : '') + '" id="item-' + sn.id + '">' +
        '<div class="k-item-main">' + body + '</div>' +
        '<div class="k-item-ops">' + stateBadge(st) + markButtons(u.id, sn.id, st) + '</div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderBlocks(g, showZh, unitId, itemId) {
    return (g.blocks || []).map(function (bk, i) {
      if (bk.type === 'formula') {
        return '<div class="k-formula">' + esc(bk.text || '') + '</div>';
      }
      if (bk.type === 'tip') {
        return '<div class="k-tip">💡 ' + esc(bk.text || '') + '</div>';
      }
      if (bk.type === 'table' && bk.rows && bk.rows.length) {
        var head = bk.rows[0];
        var thead = '<tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>';
        var tbody = bk.rows.slice(1).map(function (row) {
          return '<tr>' + row.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<div class="k-table-wrap"><table class="k-table"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></div>';
      }
      if (bk.type === 'examples' && bk.items) {
        return '<div class="k-ex-list">' + bk.items.map(function (e) {
          return '<div class="k-ex">' + speakBtn(e.en) +
            '<span class="k-ex-en">' + esc(e.en) + '</span>' +
            (showZh && e.zh ? '<span class="k-ex-zh">' + esc(e.zh) + '</span>' : '') + '</div>';
        }).join('') + '</div>';
      }
      return '<div class="k-line">' + esc(bk.text || '') + '</div>';
    }).join('');
  }

  function renderGrammar(u, showZh) {
    var list = u.grammar || [];
    if (!list.length) return '<div class="card empty-card">原文资料未提供本单元 Grammar 内容</div>';
    var html = '<div class="k-req">语法规则、公式、表格与例句均来自原资料；例句可点读，中文可隐藏。</div>';
    list.forEach(function (g) {
      var st = stateOf(u.id, g.id);
      html += '<section class="card k-gram' + (st === 'mastered' ? ' is-mastered' : st === 'review' ? ' is-review' : '') + '" id="item-' + g.id + '">' +
        '<div class="k-gram-head"><span class="k-gram-title">' + esc(g.title || '') + '</span>' +
        stateBadge(st) + markButtons(u.id, g.id, st) + '</div>' +
        renderBlocks(g, showZh) +
        '</section>';
    });
    return html;
  }

  function renderExtra(u, showZh) {
    var list = u.extra || [];
    if (!list.length) return '<div class="card empty-card">原文资料未提供本单元 Try to know 内容</div>';
    var html = '';
    list.forEach(function (g) {
      var st = stateOf(u.id, g.id);
      html += '<section class="card k-gram k-extra' + (st === 'mastered' ? ' is-mastered' : st === 'review' ? ' is-review' : '') + '" id="item-' + g.id + '">' +
        '<div class="k-gram-head"><span class="k-gram-title">🌟 ' + esc(g.title || '') + '</span>' +
        stateBadge(st) + markButtons(u.id, g.id, st) + '</div>' +
        renderBlocks(g, showZh) +
        '</section>';
    });
    return html;
  }

  /* ---------- 朗读列表 ---------- */

  function collectSpeakList(u) {
    var out = [];
    (u.sounds && u.sounds.rules || []).forEach(function (r) {
      if (r.letter || r.phonetic) out.push({ cat: 'sounds', text: r.letter + ', ' + (r.phonetic || '') });
      (r.examples || []).forEach(function (w) { out.push({ cat: 'sounds', text: w }); });
    });
    (u.phrases || []).forEach(function (p) { out.push({ cat: 'phrases', text: p.en }); });
    (u.sentences || []).forEach(function (s) { out.push({ cat: 'sentences', text: s.en }); });
    (u.grammar || []).concat(u.extra || []).forEach(function (g) {
      (g.blocks || []).forEach(function (bk) {
        if (bk.type === 'formula' && bk.text) out.push({ cat: 'grammar', text: bk.text });
        if (bk.type === 'examples' && bk.items) bk.items.forEach(function (e) { out.push({ cat: 'grammar', text: e.en }); });
      });
    });
    return out.map(function (x) { return { cat: x.cat, text: ttsText(x.text) }; }).filter(function (x) { return x.text && !/[一-龥]/.test(x.text); });
  }

  /* ---------- 视图 ---------- */

  var KnowledgeView = {
    render: function () {
      var unitId = App.state.knowledgeUnitId;
      var u = getUnit(unitId);
      if (!u) return '<div class="card">未找到该单元知识点 <button class="btn btn-mini" data-nav="#/home">返回首页</button></div>';
      var unit = Content.unitById(unitId);
      var no = unit ? unit.no : '';
      var st = stats(unitId);
      var showZh = App.knState.showZh !== false;

      var tabs = CATS.map(function (c) {
        var n = 0;
        if (c.key === 'sounds') n = (u.sounds && u.sounds.rules || []).length;
        else n = (u[c.key] || []).length;
        return '<button class="k-tab" data-action="kn:jump" data-cat="' + c.key + '">' + c.icon + ' ' + c.label +
          '<span class="k-tab-n">' + n + '</span></button>';
      }).join('');

      var body = '' +
        '<section class="k-sec" id="cat-sounds"><div class="k-sec-title">🔤 Sounds <span class="k-sec-zh">语音知识</span></div>' + renderSounds(u, showZh) + '</section>' +
        '<section class="k-sec" id="cat-phrases"><div class="k-sec-title">💬 Phrases <span class="k-sec-zh">重点短语</span></div>' + renderPhrases(u, showZh) + '</section>' +
        '<section class="k-sec" id="cat-sentences"><div class="k-sec-title">📝 Sentences <span class="k-sec-zh">重点句型</span></div>' + renderSentences(u, showZh) + '</section>' +
        '<section class="k-sec" id="cat-grammar"><div class="k-sec-title">🧠 Grammar <span class="k-sec-zh">语法知识</span></div>' + renderGrammar(u, showZh) + '</section>' +
        '<section class="k-sec" id="cat-extra"><div class="k-sec-title">🌟 Try to know <span class="k-sec-zh">拓展知识</span></div>' + renderExtra(u, showZh) + '</section>';

      return '' +
        '<header class="unit-head k-head">' +
        '  <button class="btn btn-back" data-nav="#/unit/' + unitId + '">' + Util.icon("left", 15) + ' 返回单元</button>' +
        '  <div class="unit-head-info"><span class="unit-head-emoji">📘</span>' +
        '  <div><div class="unit-head-name">Unit ' + no + ' ' + esc(u.title) + '</div>' +
        '  <div class="unit-head-zh">单元知识点</div></div></div>' +
        '</header>' +
        '<section class="card k-progress-card">' +
        '  <div class="k-progress-top">' +
        '    <span class="k-progress-num">' + st.pct + '%</span>' +
        '    <div class="k-progress-meta"><b>已学习 ' + st.learned + ' / ' + st.total + ' 条</b>' +
        '    <span class="muted small">★ 已掌握 ' + st.mastered + ' · ↻ 待复习 ' + st.review + '</span></div>' +
        '  </div>' +
        '  <div class="progress-bar"><div class="progress-fill" style="width:' + st.pct + '%"></div></div>' +
        '  <div class="toolbar k-toolbar">' +
        '    <button class="btn btn-mini btn-primary" data-action="kn:playAll">' + Util.icon("play", 15) + ' 全部朗读</button>' +
        '    <button class="btn btn-mini" data-action="unit:stop">' + Util.icon("stop", 15) + ' 停止</button>' +
        '    <button class="btn btn-mini" data-action="kn:toggleZh">' + (showZh ? '🙈 隐藏中文' : '🐵 显示中文') + '</button>' +
        '  </div>' +
        '  <div class="muted small">学习状态自动保存；数据与单词掌握、错题本互不影响。</div>' +
        '</section>' +
        '<div class="k-tabs">' + tabs + '</div>' +
        '<div class="unit-body">' + body + '</div>';
    },

    after: function () {
      /* 支持 ?cat=sounds 直达某分类 */
      var m = (location.hash || '').match(/\?cat=(\w+)/);
      if (m) {
        var el = document.getElementById('cat-' + m[1]);
        if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth' }); }, 150);
      }
    },

    actions: {
      'kn:jump': function (d) {
        var el = document.getElementById('cat-' + d.cat);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      'kn:toggleZh': function () {
        App.knState.showZh = App.knState.showZh === false ? true : false;
        Store.data.settings.knowledgeShowZh = App.knState.showZh;
        Store.save();
        App.rerender();
      },
      'kn:phFilter': function (d) {
        App.knState.phraseFilter = d.f;
        App.rerender();
      },
      'kn:speak': function (d, el) {
        if (el && el.classList) el.classList.add('is-playing');
        Speaker.speak(d.tts || d.text, {
          onend: function () { if (el && el.classList) el.classList.remove('is-playing'); }
        });
      },
      'kn:playAll': function () {
        var u = getUnit(App.state.knowledgeUnitId);
        if (!u) return;
        var list = collectSpeakList(u);
        if (!list.length) return;
        var texts = list.map(function (x) { return x.text; });
        var total = texts.length;
        var idxByCat = {};
        Speaker.speakQueue(texts, {
          gap: 320,
          onItem: function (i) {
            Util.toast('朗读中 ' + (i + 1) + '/' + total, 'info');
          },
          onDone: function () {
            Util.toast('本单元知识点朗读完成');
          }
        });
      },
      'kn:mark': function (d) {
        var cur = Store.getKnState(App.state.knowledgeUnitId, d.id);
        var next = cur === d.state ? '' : d.state;
        Store.setKnState(App.state.knowledgeUnitId, d.id, next);
        App.rerender();
      }
    }
  };

  global.KnowledgeView = KnowledgeView;
})(window);
