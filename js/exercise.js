/* 练习题生成：从教材内容自动组题（V2.0 扩展听力/读写题型与输入判分）
   选择题: en2zh / zh2en / listen / listenSent / listenDialog / blank / order / sent2zh / grammar
   输入题: listenSpell / zh2enWrite / listenZh2en / blankWrite / translate / translateZh */
(function (global) {
  'use strict';

  var SKIP_WORDS = {
    a: 1, an: 1, the: 1, is: 1, are: 1, am: 1, do: 1, i: 1, you: 1, he: 1, she: 1,
    it: 1, we: 1, they: 1, my: 1, your: 1, his: 1, her: 1, our: 1, in: 1, on: 1,
    under: 1, at: 1, to: 1, and: 1, can: 1, not: 1, please: 1, very: 1, yeah: 1,
    sure: 1, no: 1, yes: 1, now: 1, how: 1, what: 1, where: 1, let: 1, "let's": 1,
    "don't": 1, "can't": 1, "i'd": 1, "it's": 1, "they're": 1, "he's": 1, "she's": 1,
    that: 1, this: 1, look: 1, with: 1, for: 1, go: 1, come: 1,
    have: 1, has: 1, like: 1, many: 1, much: 1, some: 1, any: 1, be: 1
  };

  function cleanWord(w) {
    return w.toLowerCase().replace(/[^a-z'-]/g, '');
  }

  function isContentWord(w) {
    var c = cleanWord(w);
    return c.length >= 3 && !SKIP_WORDS[c];
  }

  function fingerprint(type, key) {
    return type + '|' + key;
  }

  /* ---------- 输入题判分 ---------- */

  function normalizeEn(s) {
    return String(s || '').toLowerCase()
      .replace(/[’]/g, "'")
      .replace(/[.,!?;:"()_]/g, ' ')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeZh(s) {
    return String(s || '')
      .replace(/[，。！？；：“”‘’、,.!?;:'"()]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  /* 多词答案的词重合相似度（0~1） */
  function tokenSim(a, b) {
    var ta = a.split(' ').filter(Boolean);
    var tb = b.split(' ').filter(Boolean);
    if (!ta.length || !tb.length) return 0;
    var pool = tb.slice();
    var common = 0;
    ta.forEach(function (w) {
      var i = pool.indexOf(w);
      if (i >= 0) { common++; pool.splice(i, 1); }
    });
    return 2 * common / (ta.length + tb.length);
  }

  var Gen = {
    /* 生成题库并抽取 count 道（unitIds: 单元 id 数组；types: 题型数组） */
    build: function (unitIds, types, count) {
      return Util.shuffle(this.buildPool(unitIds, types)).slice(0, count);
    },

    /* 生成题库 */
    buildPool: function (unitIds, types) {
      var pool = [];
      unitIds.forEach(function (uid) {
        /* 单元不存在（如切换自定义教材内容后残留的旧 unitId）时跳过 */
        var u = u_of(uid);
        if (!u) return;
        types.forEach(function (type) {
          var makers = Gen['_' + type] || {};
          Object.keys(makers).forEach(function (k) {
            makers[k](u, pool);
          });
        });
      });
      return pool;
    },

    /* 判分：返回 correct / close / wrong。
       - 单词题：规范化后必须完全一致（忽略大小写与首尾空格）
       - 句子题：完全一致判 correct；词重合度 ≥ 0.8 判 close（计为正确，提示核对）
       - 中文题：去除空格与标点后一致（或互为包含）判 correct */
    gradeInput: function (user, q) {
      var answers = q.answers && q.answers.length ? q.answers : [q.answer];
      var i, verdict = 'wrong', matched = null;
      for (i = 0; i < answers.length; i++) {
        var ref = answers[i];
        if (q.lang === 'zh') {
          var a = normalizeZh(user), b = normalizeZh(ref);
          if (!a) break;
          if (a === b || (a.length >= 2 && (b.indexOf(a) >= 0 || a.indexOf(b) >= 0))) {
            verdict = 'correct'; matched = ref; break;
          }
        } else {
          var ua = normalizeEn(user), ub = normalizeEn(ref);
          if (!ua) break;
          if (ua === ub) { verdict = 'correct'; matched = ref; break; }
          var isSentence = ref.indexOf(' ') >= 0;
          if (isSentence && tokenSim(ua, ub) >= 0.8) { verdict = 'close'; matched = ref; break; }
        }
      }
      return { verdict: verdict, matched: matched };
    },

    /* 输入题提示（首字母/词数） */
    inputHint: function (q) {
      var ans = (q.answers && q.answers[0]) || q.answer;
      if (q.lang === 'zh') return '参考答案有 ' + ans.length + ' 个字';
      if (ans.indexOf(' ') >= 0) {
        /* 句子提示：给出第一个词，其余词用 __ 代替 */
        return ans.replace(/\S+/g, function (w, i) { return i === 0 ? w : '__'; }).slice(0, 60);
      }
      return ans.charAt(0) + ' ' + '–'.repeat(Math.max(ans.length - 1, 1));
    },

    /* ---------- 各题型生成器 ---------- */

    _en2zh: {
      make: function (u, pool) {
        u.words.forEach(function (w) {
          var options = Util.shuffle([w.zh].concat(Gen._otherZhs(u, w, 3)));
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('en2zh', u.id + ':' + w.en),
            unitId: u.id, type: 'en2zh', kind: 'choice',
            stem: w.en, stemZh: '选出正确的中文意思', speak: w.en,
            options: options, answer: options.indexOf(w.zh),
            explain: w.en + ' 的意思是「' + w.zh + '」' + (w.exEn ? '，例句：' + w.exEn : '')
          });
        });
      }
    },

    _zh2en: {
      make: function (u, pool) {
        u.words.forEach(function (w) {
          var options = Util.shuffle([w.en].concat(Gen._otherEns(u, w, 3)));
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('zh2en', u.id + ':' + w.en),
            unitId: u.id, type: 'zh2en', kind: 'choice',
            stem: w.zh, stemZh: '选出正确的英文单词', speak: '',
            options: options, answer: options.indexOf(w.en),
            explain: '「' + w.zh + '」的英文是 ' + w.en
          });
        });
      }
    },

    _listen: {
      make: function (u, pool) {
        u.words.forEach(function (w) {
          var options = Util.shuffle([w.en].concat(Gen._similarEns(u, w, 3)));
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('listen', u.id + ':' + w.en),
            unitId: u.id, type: 'listen', kind: 'choice',
            stem: '🔊 听一听，选出你听到的单词', stemZh: '可以点击喇叭再听一遍', speak: w.en,
            options: options, answer: options.indexOf(w.en),
            explain: '你听到的是 ' + w.en + '（' + w.zh + '）'
          });
        });
      }
    },

    _listenSent: {
      make: function (u, pool) {
        (global.LISTENING_CONTENT ? LISTENING_CONTENT.sentences : []).forEach(function (s) {
          if (s.unitId !== u.id) return;
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('listenSent', s.id),
            unitId: u.id, type: 'listenSent', kind: 'choice',
            stem: '🎧 听句子，选出正确答案', stemZh: '听不懂可以再听一遍', speak: s.audio,
            options: s.options.slice(), answer: s.answer,
            explain: '你听到的是：' + s.audio + ' —— ' + s.explain
          });
        });
      }
    },

    _listenDialog: {
      make: function (u, pool) {
        (global.LISTENING_CONTENT ? LISTENING_CONTENT.dialogs : []).forEach(function (d, di) {
          if (d.unitId !== u.id) return;
          d.questions.forEach(function (dq, qi) {
            pool.push({
              id: Util.uid(), fingerprint: fingerprint('listenDialog', d.id + ':' + qi),
              unitId: u.id, type: 'listenDialog', kind: 'dialog',
              stem: dq.q, stemZh: '先听对话，再选择答案（可重复播放）', speak: '',
              dialog: { lines: d.lines, title: '对话 ' + (di + 1) },
              options: dq.options.slice(), answer: dq.answer,
              explain: dq.explain + '（对话要点：' + d.lines.map(function (l) { return l.en; }).join(' / ') + '）'
            });
          });
        });
      }
    },

    _listenSpell: {
      make: function (u, pool) {
        u.words.forEach(function (w) {
          if (w.en.indexOf(' ') >= 0) return; /* 词组跳过听写 */
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('listenSpell', u.id + ':' + w.en),
            unitId: u.id, type: 'listenSpell', kind: 'input', lang: 'en',
            stem: '🎧 听单词，拼写出来', stemZh: '可重复播放；注意字母顺序', speak: w.en,
            answers: [w.en],
            options: null, answer: w.en,
            explain: '正确拼写：' + w.en + '（' + w.zh + '）'
          });
        });
      }
    },

    _zh2enWrite: {
      make: function (u, pool) {
        u.words.forEach(function (w) {
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('zh2enWrite', u.id + ':' + w.en),
            unitId: u.id, type: 'zh2enWrite', kind: 'input', lang: 'en',
            stem: w.zh, stemZh: '看中文，写出对应的英文单词', speak: '',
            answers: [w.en],
            options: null, answer: w.en,
            explain: w.en + '（' + w.zh + '）' + (w.exEn ? '，例句：' + w.exEn : '')
          });
        });
      }
    },

    _listenZh2en: {
      make: function (u, pool) {
        u.words.forEach(function (w) {
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('listenZh2en', u.id + ':' + w.en),
            unitId: u.id, type: 'listenZh2en', kind: 'input', lang: 'en',
            stem: w.zh, stemZh: '根据中文提示写出英文；提交后可听标准发音核对', speak: '',
            answers: [w.en], checkSpeak: w.en,
            options: null, answer: w.en,
            explain: w.en + '（' + w.zh + '）'
          });
        });
      }
    },

    _blank: {
      make: function (u, pool) {
        (u.sentences || []).forEach(function (s) {
          var target = Gen._pickBlankWord(u, s);
          if (!target) return;
          var options = Util.shuffle([target.toLowerCase()].concat(Gen._wordDistractors(u, target, 3)));
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('blank', u.id + ':' + s.en + ':' + target),
            unitId: u.id, type: 'blank', kind: 'choice',
            stem: s.en.replace(target, '＿＿＿'), stemZh: '选择合适的词补全句子', speak: s.en,
            options: options, answer: options.indexOf(target.toLowerCase()),
            explain: '完整句子：' + s.en + '（' + s.zh + '）'
          });
        });
      }
    },

    _blankWrite: {
      make: function (u, pool) {
        (u.sentences || []).forEach(function (s) {
          var target = Gen._pickBlankWord(u, s);
          if (!target) return;
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('blankWrite', u.id + ':' + s.en + ':' + target),
            unitId: u.id, type: 'blankWrite', kind: 'input', lang: 'en',
            stem: s.en.replace(target, '＿＿＿'), stemZh: '补全句子：写出空缺的单词', speak: '',
            answers: [target.toLowerCase()],
            options: null, answer: target.toLowerCase(),
            explain: '完整句子：' + s.en + '（' + s.zh + '）'
          });
        });
      }
    },

    _order: {
      make: function (u, pool) {
        (u.sentences || []).forEach(function (s) {
          var words = s.en.replace(/[.!?]$/, '').split(/\s+/).filter(Boolean);
          if (words.length < 3 || words.length > 8) return;
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('order', u.id + ':' + s.en),
            unitId: u.id, type: 'order', kind: 'order',
            stem: s.zh, stemZh: '按正确顺序点击单词，拼出这句话', speak: s.en,
            options: Util.shuffle(words), answer: words.join(' '),
            explain: '正确句子：' + s.en
          });
        });
      }
    },

    _sent2zh: {
      make: function (u, pool) {
        var sentences = u.sentences || [];
        sentences.forEach(function (s) {
          var others = sentences.filter(function (x) { return x.zh !== s.zh; });
          var distractors = Util.sample(others, 3).map(function (x) { return x.zh; });
          if (distractors.length < 3) {
            var all = [];
            Content.data.units.forEach(function (uu) {
              if (uu.id === u.id) return;
              (uu.sentences || []).forEach(function (x) { all.push(x.zh); });
            });
            distractors = distractors.concat(Util.sample(all, 3 - distractors.length));
          }
          var options = Util.shuffle([s.zh].concat(distractors));
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('sent2zh', u.id + ':' + s.en),
            unitId: u.id, type: 'sent2zh', kind: 'choice',
            stem: s.en, stemZh: '选出句子的中文意思', speak: s.en,
            options: options, answer: options.indexOf(s.zh),
            explain: s.en + ' 的意思是「' + s.zh + '」'
          });
        });
      }
    },

    _grammar: {
      make: function (u, pool) {
        (u.grammar || []).forEach(function (g) {
          (g.quiz || []).forEach(function (q, qi) {
            pool.push({
              id: Util.uid(), fingerprint: fingerprint('grammar', u.id + ':' + g.title + ':' + qi),
              unitId: u.id, type: 'grammar', kind: 'choice',
              stem: q.q, stemZh: '知识点：' + g.title, speak: '',
              options: q.options.slice(), answer: q.answer,
              explain: q.explain || g.title
            });
          });
        });
      }
    },

    _translate: {
      make: function (u, pool) {
        (u.sentences || []).forEach(function (s) {
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('translate', u.id + ':' + s.en),
            unitId: u.id, type: 'translate', kind: 'input', lang: 'en',
            stem: s.zh, stemZh: '把中文句子翻译成英文（忽略大小写和标点）', speak: s.en,
            answers: [s.en],
            options: null, answer: s.en,
            explain: '参考答案：' + s.en
          });
        });
      }
    },

    _translateZh: {
      make: function (u, pool) {
        (u.sentences || []).forEach(function (s) {
          pool.push({
            id: Util.uid(), fingerprint: fingerprint('translateZh', u.id + ':' + s.en + ':z'),
            unitId: u.id, type: 'translateZh', kind: 'input', lang: 'zh',
            stem: s.en, stemZh: '把英文句子翻译成中文（意思对即可）', speak: s.en,
            answers: [s.zh],
            options: null, answer: s.zh,
            explain: '参考翻译：' + s.zh
          });
        });
      }
    },

    /* ---------- 工具 ---------- */

    _pickBlankWord: function (u, s) {
      var words = s.en.replace(/[,.!?]/g, '').split(/\s+/).filter(Boolean);
      var unitEns = {};
      u.words.forEach(function (w) {
        unitEns[cleanWord(w.en).split(/[\s-]/)[0]] = 1;
        cleanWord(w.en).split(/[\s-]/).forEach(function (p) { if (p) unitEns[p] = 1; });
      });
      for (var i = 0; i < words.length; i++) {
        if (unitEns[cleanWord(words[i])]) return words[i];
      }
      var cands = words.filter(isContentWord);
      return cands.length ? cands[cands.length - 1] : null;
    },

    _otherZhs: function (unit, word, n) {
      var same = unit.words.filter(function (w) { return w.zh !== word.zh; }).map(function (w) { return w.zh; });
      var picked = Util.sample(same, n);
      if (picked.length < n) {
        var all = Content.allWords().map(function (x) { return x.word.zh; })
          .filter(function (zh) { return zh !== word.zh && picked.indexOf(zh) < 0; });
        picked = picked.concat(Util.sample(all, n - picked.length));
      }
      return picked;
    },

    _otherEns: function (unit, word, n) {
      var same = unit.words.filter(function (w) { return w.en !== word.en; }).map(function (w) { return w.en; });
      var picked = Util.sample(same, n);
      if (picked.length < n) {
        var all = Content.allWords().map(function (x) { return x.word.en; })
          .filter(function (en) { return en !== word.en && picked.indexOf(en) < 0; });
        picked = picked.concat(Util.sample(all, n - picked.length));
      }
      return picked;
    },

    _similarEns: function (unit, word, n) {
      var same = unit.words.filter(function (w) { return w.en !== word.en; });
      same.sort(function (a, b) {
        return Math.abs(a.en.length - word.en.length) - Math.abs(b.en.length - word.en.length);
      });
      var near = same.slice(0, Math.max(n * 2, 6)).map(function (w) { return w.en; });
      var picked = Util.sample(near, n);
      if (picked.length < n) picked = picked.concat(Gen._otherEns(unit, word, n - picked.length));
      return picked;
    },

    _wordDistractors: function (unit, target, n) {
      var t = target.toLowerCase();
      var pool = unit.words.map(function (w) { return w.en.toLowerCase(); })
        .filter(function (en) { return en !== t && !en.includes(' '); });
      var picked = Util.sample(pool, n);
      if (picked.length < n) {
        var all = Content.allWords().map(function (x) { return x.word.en.toLowerCase(); })
          .filter(function (en) { return en !== t && !en.includes(' ') && picked.indexOf(en) < 0; });
        picked = picked.concat(Util.sample(all, n - picked.length));
      }
      return picked;
    }
  };

  function u_of(uid) {
    return Content.unitById(uid);
  }

  /* 常用练习组合 */
  Gen.PRESETS = {
    /* 听力 */
    listenWord: ['listen'],
    listenSentence: ['listenSent'],
    listenSpell: ['listenSpell'],
    listenDialog: ['listenDialog'],
    listenAll: ['listen', 'listenSent', 'listenSpell', 'listenDialog'],
    /* 读写 */
    writeZh2en: ['zh2enWrite'],
    writeListenZh: ['listenZh2en'],
    writeBlank: ['blankWrite'],
    writeTranslate: ['translate', 'translateZh'],
    writeAll: ['zh2enWrite', 'listenZh2en', 'blankWrite', 'translate', 'translateZh'],
    /* 单词 / 句型 / 语法 */
    words: ['en2zh', 'zh2en', 'listen'],
    sentences: ['blank', 'order', 'sent2zh'],
    grammar: ['grammar'],
    /* 综合 */
    mixed: ['en2zh', 'zh2en', 'listen', 'listenSent', 'listenSpell',
      'blank', 'order', 'sent2zh', 'grammar', 'zh2enWrite', 'blankWrite', 'translate'],
    exam: ['en2zh', 'zh2en', 'listen', 'listenSent', 'listenSpell',
      'blank', 'order', 'sent2zh', 'grammar', 'zh2enWrite', 'blankWrite', 'translate']
  };

  global.Gen = Gen;
})(window);
