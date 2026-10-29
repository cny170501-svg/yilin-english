/* 双语阅读页：英文原文 + 中文显示模式切换 + 整篇/逐句朗读 + 生词 + 阅读理解 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  var LEVELS = { 1: '⭐ 入门（三、四年级）', 2: '⭐⭐ 进阶（四、五年级）', 3: '⭐⭐⭐ 挑战' };

  function splitSentences(text) {
    var parts = text.match(/[^.!?]+[.!?]+["']?\s*|[^.!?]+$/g);
    return (parts || [text]).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function splitZh(text) {
    /* 手动按中文句读切分，兼容不支持后行断言的老浏览器 */
    var out = [], cur = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      cur += ch;
      if ('。！？；!?;'.indexOf(ch) >= 0) {
        out.push(cur.trim());
        cur = '';
      }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  /* 段落 → 句子数组（中英逐句对齐；对不齐时该句无中文） */
  function paraSentences(p) {
    var en = splitSentences(p.en);
    var zh = splitZh(p.zh || '');
    return en.map(function (s, i) {
      return { en: s, zh: zh[i] || null };
    });
  }

  function findArticle(id) {
    return READING_CONTENT.articles.filter(function (a) { return a.id === id; })[0] || null;
  }

  /* 把句子里出现的生词包上高亮标记 */
  function markVocab(sentence, vocabList) {
    var html = esc(sentence);
    vocabList.forEach(function (v) {
      var word = v.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('\\b(' + word + ')\\b', 'gi');
      html = html.replace(re, '<b class="vword" data-action="article:word" data-w="' + esc(v.en) + '" data-z="' + esc(v.zh) + '" data-p="' + esc(v.pos || '') + '">$1</b>');
    });
    return html;
  }

  function clearPlaying() {
    var els = document.querySelectorAll('.sent.playing, .para.playing');
    for (var i = 0; i < els.length; i++) els[i].classList.remove('playing');
  }

  /* 「朗读全文」按钮播放态还原 */
  function resetPlayAllBtn() {
    var b = document.querySelector('[data-action="article:playAll"]');
    if (b) {
      b.classList.remove('is-playing');
      b.innerHTML = Util.icon('play', 16) + ' 朗读全文';
    }
  }

  function stopTicker() {
    if (global.__readTicker) {
      clearInterval(global.__readTicker);
      global.__readTicker = null;
    }
  }

  var ArticleView = {
    render: function () {
      var id = App.state.articleId;
      var a = findArticle(id);
      if (!a) return '<div class="card">文章不存在 <button class="btn btn-mini" data-nav="#/reading">返回阅读</button></div>';

      var st = App.articleState || (App.articleState = {});
      if (st.id !== id) {
        st.id = id;
        st.zhMode = Store.data.settings.zhMode || 'hide';
        st.quiz = { answers: {}, done: false, correct: 0 };
        st.popover = null;
        /* 进入新文章时记录一次阅读行为 */
        Store.recordReading(id, 0);
      }
      var zhMode = st.zhMode;
      var fav = Store.isFavorite(a.id);
      var hist = Store.readState().history[a.id];

      var zhTabs = [
        { k: 'hide', label: '🙈 纯英文' },
        { k: 'show', label: '🐼 中英全文' },
        { k: 'sentence', label: '🆚 逐句对照' }
      ].map(function (t) {
        return '<button class="cat-tab' + (zhMode === t.k ? ' active' : '') + '" data-action="article:zhMode" data-m="' + t.k + '">' + t.label + '</button>';
      }).join('');

      var rate = Store.data.settings.rate;
      var rateTabs = [
        { v: 0.65, l: '🐢 慢' }, { v: 0.85, l: '🚶 中' }, { v: 1.1, l: '🐇 快' }
      ].map(function (t) {
        return '<button class="chip-scope' + (Math.abs(rate - t.v) < 0.01 ? ' on' : '') + '" data-action="article:rate" data-v="' + t.v + '">' + t.l + '</button>';
      }).join('');

      var body = '';
      a.paragraphs.forEach(function (p, pi) {
        var sents = paraSentences(p);
        var inner = '';
        sents.forEach(function (s, si) {
          var gidx = pi + '-' + si;
          inner += '<span class="sent" data-g="' + gidx + '" data-action="article:speakSent" data-text="' + esc(s.en) + '">' +
            markVocab(s.en, a.vocab) + '</span> ';
          if (zhMode === 'sentence' && s.zh) {
            inner += '<span class="sent-zh">' + esc(s.zh) + '</span> ';
          }
        });
        /* 段落用 p（供 Tailwind Typography 排版接管间距与行高），中文整段翻译排除在 prose 之外 */
        body += '<p class="para" data-para="' + pi + '">' + inner +
          (zhMode === 'show' ? '<span class="para-zh not-prose">' + esc(p.zh) + '</span>' : '') +
          '<button class="para-play icon-btn mini" data-action="article:playPara" data-pi="' + pi + '" aria-label="朗读本段">' + Util.icon("volume", 18) + '</button>' +
          '</p>';
      });

      var vocabHtml = a.vocab.map(function (v) {
        var added = Store.hasVocab(v.en);
        return '<div class="av-word">' +
          '<button class="icon-btn mini" data-action="article:speakSent" data-text="' + esc(v.en) + '">' + Util.icon("volume", 18) + '</button>' +
          '<span class="av-en">' + esc(v.en) + '</span>' +
          (v.pos ? '<span class="av-pos">' + esc(v.pos) + '</span>' : '') +
          '<span class="av-zh">' + esc(v.zh) + '</span>' +
          '<button class="mark-btn ' + (added ? 'mark-ok on' : 'mark-review') + '" data-action="article:vocab" data-en="' + esc(v.en) + '" data-z="' + esc(v.zh) + '">' + (added ? '' + Util.icon("check", 14) + ' 已收藏' : '★ 收藏') + '</button>' +
          '</div>';
      }).join('');

      var quizHtml = renderQuiz(a, st);

      var popover = st.popover
        ? '<div class="pop-mask" data-action="article:closePop"></div>' +
          '<div id="word-pop" class="word-pop">' +
          '<div class="wp-en">' + esc(st.popover.en) + '</div>' +
          '<div class="wp-zh">' + esc(st.popover.zh) + '</div>' +
          (st.popover.pos ? '<div class="wp-pos muted small">' + esc(st.popover.pos) + '</div>' : '') +
          '<div class="wp-ops">' +
          '<button class="btn btn-mini" data-action="article:speakSent" data-text="' + esc(st.popover.en) + '">' + Util.icon("volume", 18) + ' 发音</button>' +
          '<button class="btn btn-mini btn-primary" data-action="article:vocab" data-en="' + esc(st.popover.en) + '" data-z="' + esc(st.popover.zh) + '">★ 收藏生词</button>' +
          '<button class="btn btn-mini" data-action="article:closePop">关闭</button>' +
          '</div></div>'
        : '';

      return '' +
        '<header class="unit-head">' +
        '<button class="btn btn-back" data-nav="#/reading">' + Util.icon("left", 15) + ' 阅读</button>' +
        '<div class="unit-head-info"><div><div class="unit-head-name">' + esc(a.title) + '</div>' +
        '<div class="unit-head-zh">' + esc(a.titleZh || '') + '</div></div></div>' +
        '<button class="fav-btn big' + (fav ? ' on' : '') + '" data-action="article:fav">' + (fav ? '★' : '☆') + '</button>' +
        '</header>' +

        '<div class="rd-meta" style="margin:0 2px 10px">' +
        '<span class="rd-m">' + (LEVELS[a.level] || '') + '</span>' +
        '<span class="rd-m">⏱ 约 ' + a.minutes + ' 分钟</span>' +
        '<span class="rd-m">' + esc((READING_CONTENT.categories.filter(function (c) { return c.key === a.category; })[0] || {}).name || '') + '</span>' +
        '</div>' +
        '<div class="source-tip">📄 来源：' + esc(a.sourceNote) +
        (a.sourceUrl && /^https?:\/\//i.test(a.sourceUrl) ? '（<a href="' + esc(a.sourceUrl) + '" target="_blank" rel="noopener noreferrer">查看原始出处 ↗</a>）' : '') +
        '　中文翻译：本工具整理</div>' +

        '<div class="cat-tabs read-ctrl">' + zhTabs + '</div>' +
        '<div class="toolbar">' +
        '<button class="btn btn-mini btn-primary" data-action="article:playAll">' + Util.icon("play", 16) + ' 朗读全文</button>' +
        '<button class="btn btn-mini" data-action="article:pause" id="art-pause">' + Util.icon("pause", 16) + ' 暂停</button>' +
        '<button class="btn btn-mini" data-action="article:stop">' + Util.icon("stop", 16) + ' 停止</button>' +
        '<span class="rate-inline">' + rateTabs + '</span>' +
        '</div>' +
        '<div class="source-tip">💡 点击任意句子可以只读这一句；正文中<b>橙色加粗</b>的词是本篇生词，点击可看释义并收藏</div>' +

        '<article class="article-body font-read prose prose-slate">' + body + '</article>' +

        '<section class="card"><div class="card-title">🔑 本篇词汇</div>' + vocabHtml + '</section>' +
        quizHtml + popover;
    },

    after: function () {
      var id = App.state.articleId;
      var a = findArticle(id);
      if (!a) return;
      /* 每 30 秒累计阅读时长 */
      stopTicker();
      global.__readTicker = setInterval(function () {
        if (location.hash.indexOf('#/read/' + id) !== 0) {
          stopTicker();
          return;
        }
        Store.tickReading(id, 30);
      }, 30000);
    },

    actions: {
      'article:zhMode': function (d) {
        App.articleState.zhMode = d.m;
        App.rerender();
      },
      'article:rate': function (d) {
        Store.data.settings.rate = +d.v;
        Store.save();
        Util.toast('语速已调整');
        App.rerender();
      },
      'article:playAll': function (d, el) {
        var a = findArticle(App.state.articleId);
        if (!a) return;
        var texts = [];
        a.paragraphs.forEach(function (p) {
          splitSentences(p.en).forEach(function (s) { texts.push(s); });
        });
        var btn = el || document.querySelector('[data-action="article:playAll"]');
        if (btn) {
          btn.classList.add('is-playing');
          btn.innerHTML = Util.icon('play', 16) + ' 朗读中…';
        }
        Speaker.speakQueue(texts, {
          gap: 260,
          onItem: function (i) {
            clearPlaying();
            var el = document.querySelectorAll('.article-body .sent')[i];
            if (el) {
              el.classList.add('playing');
              try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { }
            }
          },
          onDone: function () { clearPlaying(); resetPlayAllBtn(); }
        });
      },
      'article:playPara': function (d, el) {
        var a = findArticle(App.state.articleId);
        if (!a) return;
        var pi = +d.pi;
        clearPlaying();
        var paraEl = document.querySelector('[data-para="' + pi + '"]');
        if (paraEl) paraEl.classList.add('playing');
        if (el) el.classList.add('is-playing');
        var texts = splitSentences(a.paragraphs[pi].en);
        Speaker.speakQueue(texts, {
          gap: 220,
          onDone: function () {
            clearPlaying();
            if (el) el.classList.remove('is-playing');
          }
        });
      },
      'article:speakSent': function (d, el) {
        clearPlaying();
        Util.speakWithState(d.text, el);
      },
      'article:pause': function () {
        if (Speaker.pause()) {
          var b = document.getElementById('art-pause');
          if (b) { b.innerHTML = Util.icon('play', 16) + ' 继续'; b.setAttribute('data-action', 'article:resume'); }
        }
      },
      'article:resume': function () {
        Speaker.resume();
        var b = document.getElementById('art-pause');
        if (b) { b.innerHTML = Util.icon('pause', 16) + ' 暂停'; b.setAttribute('data-action', 'article:pause'); }
      },
      'article:stop': function () {
        Speaker.stop();
        clearPlaying();
        /* 清理所有播放中按钮态（朗读全文/段落喇叭） */
        var playing = document.querySelectorAll('.is-playing');
        for (var i = 0; i < playing.length; i++) playing[i].classList.remove('is-playing');
        resetPlayAllBtn();
        var b = document.getElementById('art-pause');
        if (b) { b.innerHTML = Util.icon('pause', 16) + ' 暂停'; b.setAttribute('data-action', 'article:pause'); }
      },
      'article:word': function (d) {
        App.articleState.popover = { en: d.w, zh: d.z, pos: d.p || '' };
        App.rerender();
      },
      'article:closePop': function () {
        App.articleState.popover = null;
        App.rerender();
      },
      'article:vocab': function (d) {
        if (Store.hasVocab(d.en)) {
          Store.removeVocab(d.en);
          Util.toast('已从生词本移除');
        } else {
          Store.addVocab(d.en, d.z, App.state.articleId);
          Util.toast('已加入生词本 ★');
        }
        App.articleState.popover = null;
        App.rerender();
      },
      'article:fav': function () {
        var on = Store.toggleFavorite(App.state.articleId);
        Util.toast(on ? '已收藏 ★' : '已取消收藏');
        App.rerender();
      },
      'article:quizAnswer': function (d) {
        var st = App.articleState;
        var a = findArticle(App.state.articleId);
        if (!a || st.quiz.done) return;
        var qi = +d.qi, oi = +d.oi;
        st.quiz.answers[qi] = oi;
        /* 错题联动：答错进错题本（source=reading），答对则消灭旧错题 */
        var q = a.questions[qi];
        var fp = 'readcomp|' + a.id + '|' + qi;
        if (oi !== q.answer) {
          Store.addWrong({
            fingerprint: fp,
            unitId: '',
            source: 'reading',
            articleId: a.id,
            type: 'readcomp',
            kind: 'choice',
            stem: q.q,
            stemZh: '阅读理解 · ' + a.title,
            speak: '',
            options: q.options || ['正确', '错误'],
            answer: q.answer,
            explain: (q.evidence ? '原文依据：' + q.evidence + '。' : '') + q.explain
          }, oi);
        } else {
          Store.data.wrong.forEach(function (w) {
            if (w.fingerprint === fp && !w.resolved) Store.resolveWrong(w.id);
          });
        }
        if (Object.keys(st.quiz.answers).length === a.questions.length) {
          var correct = 0;
          a.questions.forEach(function (qq, i) {
            if (st.quiz.answers[i] === qq.answer) correct++;
          });
          st.quiz.done = true;
          st.quiz.correct = correct;
          Store.recordQuiz(a.id, a.questions.length, correct);
        }
        App.rerender();
      },
      'article:quizAgain': function () {
        App.articleState.quiz = { answers: {}, done: false, correct: 0 };
        App.rerender();
      }
    }
  };

  /* ---------- 阅读理解 ---------- */

  function evidenceHit(evidence) {
    if (!evidence) return;
    var sents = document.querySelectorAll('.article-body .sent');
    for (var i = 0; i < sents.length; i++) {
      var t = sents[i].textContent;
      if (t === evidence || t.indexOf(evidence) >= 0 || evidence.indexOf(t) >= 0) {
        sents[i].classList.add('evidence-hit');
        try { sents[i].scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { }
        setTimeout(function (el) {
          return function () { el.classList.remove('evidence-hit'); };
        }(sents[i]), 4000);
        return;
      }
    }
  }

  function renderQuiz(a, st) {
    var html = '<section class="card"><div class="card-title">📝 阅读理解（' + a.questions.length + ' 题）</div>';
    a.questions.forEach(function (q, qi) {
      var sel = st.quiz.answers[qi];
      var answered = sel !== undefined;
      html += '<div class="quiz-item">' +
        '<div class="qi-stem">' + (qi + 1) + '. ' + esc(q.q) + '</div>' +
        '<div class="options' + (answered ? ' answered' : '') + (q.type === 'judge' ? ' judge' : '') + '">';
      var opts = q.options || ['正确', '错误'];
      opts.forEach(function (o, oi) {
        var cls = 'opt';
        if (answered) {
          if (oi === q.answer) cls += ' correct';
          else if (oi === sel) cls += ' wrong';
        }
        html += '<button class="' + cls + '" ' + (answered ? '' : 'data-action="article:quizAnswer" data-qi="' + qi + '" data-oi="' + oi + '"') + '>' + esc(o) + '</button>';
      });
      html += '</div>';
      if (answered) {
        html += '<div class="qi-evidence">📖 原文依据：' + esc(q.evidence || '—') +
          '<button class="btn btn-mini" data-action="article:showEvidence" data-ev="' + esc(q.evidence || '') + '">定位 ↗</button></div>' +
          '<div class="qi-explain">💡 ' + esc(q.explain) + '</div>';
      }
      html += '</div>';
    });

    if (st.quiz.done) {
      var pct = Math.round(st.quiz.correct * 100 / a.questions.length);
      html += '<div class="fb-banner fb-correct quiz-result">本篇测试：' + st.quiz.correct + '/' + a.questions.length +
        '（' + pct + ' 分）' + (pct >= 80 ? '，读得很棒！🎉' : '，可以再读一遍原文哦') +
        '<button class="btn btn-mini" data-action="article:quizAgain" style="margin-top:8px">再测一次</button></div>';
    }
    html += '</section>';
    return html;
  }

  /* 注册定位动作 */
  ArticleView.actions['article:showEvidence'] = function (d) {
    evidenceHit(d.ev);
  };

  global.ArticleView = ArticleView;
})(window);
