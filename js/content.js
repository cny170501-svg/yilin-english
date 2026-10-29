/* 教材内容加载：优先使用「内容管理」里导入的自定义数据，否则使用内置数据 */
(function (global) {
  'use strict';

  var Content = {
    data: null,
    usingCustom: false,

    load: function () {
      var raw = Store.loadCustomContentRaw();
      if (raw) {
        try {
          var parsed = JSON.parse(raw);
          var err = Content.validate(parsed);
          if (!err) {
            this.data = parsed;
            this.usingCustom = true;
            return;
          }
          console.warn('自定义内容无效：' + err);
        } catch (e) {
          console.warn('自定义内容不是合法 JSON，已使用内置内容');
        }
      }
      this.data = global.BUILTIN_CONTENT;
      this.usingCustom = false;
    },

    /* 校验导入的内容，返回 null 表示通过，否则返回错误说明 */
    validate: function (obj) {
      if (!obj || typeof obj !== 'object') return '内容必须是一个 JSON 对象';
      if (!obj.title || typeof obj.title !== 'string') return '缺少 title（教材名称）';
      if (!Array.isArray(obj.units) || !obj.units.length) return '缺少 units（单元数组）';
      for (var i = 0; i < obj.units.length; i++) {
        var u = obj.units[i];
        if (!u.id || !u.title) return '第 ' + (i + 1) + ' 个单元缺少 id 或 title';
        if (!Array.isArray(u.words) || !u.words.length) {
          return '单元「' + u.title + '」缺少 words（单词数组）';
        }
        for (var j = 0; j < u.words.length; j++) {
          var w = u.words[j];
          if (typeof w.en !== 'string' || typeof w.zh !== 'string' || !w.en.trim() || !w.zh.trim()) {
            return '单元「' + u.title + '」第 ' + (j + 1) + ' 个单词的 en / zh 必须是非空文本';
          }
        }
        if (u.sentences && !Array.isArray(u.sentences)) return '单元「' + u.title + '」的 sentences 必须是数组';
        if (u.grammar && !Array.isArray(u.grammar)) return '单元「' + u.title + '」的 grammar 必须是数组';
      }
      return null;
    },

    unitById: function (id) {
      return this.data.units.filter(function (u) { return u.id === id; })[0] || null;
    },

    allWords: function () {
      var out = [];
      this.data.units.forEach(function (u) {
        u.words.forEach(function (w) { out.push({ unit: u, word: w }); });
      });
      return out;
    },

    stats: function () {
      var s = { units: this.data.units.length, words: 0, sentences: 0, grammar: 0, quizzes: 0 };
      this.data.units.forEach(function (u) {
        s.words += (u.words || []).length;
        s.sentences += (u.sentences || []).length;
        (u.grammar || []).forEach(function (g) {
          s.grammar++;
          s.quizzes += (g.quiz || []).length;
        });
      });
      return s;
    }
  };

  global.Content = Content;
})(window);
