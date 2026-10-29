/* 浏览器语音点读（Web Speech API）
   - 首次触摸时解锁（iOS Safari 需要在用户手势内触发一次朗读）
   - 优先选择英语语音（美音优先）
   - 朗读失败或浏览器不支持时给出明确提示 */
(function (global) {
  'use strict';

  var synth = window.speechSynthesis;

  var PREFERRED_VOICES = [
    'Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Jenny',
    'Microsoft Zira', 'Google UK English Female', 'Karen', 'Daniel', 'Microsoft Guy'
  ];

  function pickVoice(voices) {
    var en = voices.filter(function (v) { return /^en[-_]/i.test(v.lang) || v.lang === 'en'; });
    if (!en.length) return null;
    for (var i = 0; i < PREFERRED_VOICES.length; i++) {
      var name = PREFERRED_VOICES[i];
      for (var j = 0; j < en.length; j++) {
        if (en[j].name.indexOf(name) >= 0) return en[j];
      }
    }
    return en.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0] ||
           en.filter(function (v) { return /^en[-_]GB/i.test(v.lang); })[0] ||
           en[0];
  }

  var Speaker = {
    supported: !!(synth && typeof window.SpeechSynthesisUtterance !== 'undefined'),
    voice: null,
    _token: 0,
    _queueStopped: true,

    init: function () {
      if (!this.supported) return;
      var self = this;
      var refresh = function () {
        var voices = synth.getVoices() || [];
        if (voices.length) self.voice = pickVoice(voices);
      };
      refresh();
      if (typeof synth.onvoiceschanged !== 'undefined') {
        synth.onvoiceschanged = refresh;
      }
      /* 部分浏览器语音列表异步加载，1 秒后再取一次 */
      setTimeout(refresh, 1000);
      this._installUnlock();
    },

    /* iOS / 部分 Android 浏览器要求第一次朗读发生在用户手势里 */
    _installUnlock: function () {
      var self = this;
      if (this._unlocked) return;
      var unlock = function () {
        self._unlocked = true;
        try {
          var u = new window.SpeechSynthesisUtterance(' ');
          u.volume = 0;
          u.rate = 2;
          synth.speak(u);
        } catch (e) { /* 忽略 */ }
        document.removeEventListener('touchend', unlock);
        document.removeEventListener('click', unlock);
      };
      document.addEventListener('touchend', unlock, false);
      document.addEventListener('click', unlock, false);
    },

    /* 朗读一段文本。返回 false 表示不可用 */
    speak: function (text, opts) {
      /* 独立朗读持有新令牌，会打断进行中的队列 */
      return this._speakWithToken(++this._token, text, opts);
    },

    /* 内部：以指定令牌朗读（队列复用同一令牌，保证链式回调不被自身作废） */
    _speakWithToken: function (token, text, opts) {
      opts = opts || {};
      if (!this.supported) {
        Util.toast('当前浏览器不支持语音朗读，建议使用 Safari 或 Chrome', 'warn');
        if (opts.onend) opts.onend();
        return false;
      }
      if (!text) {
        if (opts.onend) opts.onend();
        return true;
      }
      try { synth.cancel(); } catch (e) { /* 忽略 */ }
      var u = new window.SpeechSynthesisUtterance(text);
      if (this.voice) {
        u.voice = this.voice;
        u.lang = this.voice.lang;
      } else {
        u.lang = 'en-US';
      }
      u.rate = opts.rate || (global.Store && Store.data.settings.rate) || 0.85;
      u.pitch = opts.pitch != null ? opts.pitch : 1;

      var finished = false;
      var finish = function (err) {
        if (finished || token !== Speaker._token) return;
        finished = true;
        if (err) {
          Util.toast('朗读失败，请再点一次试试', 'warn');
          if (opts.onend) opts.onend();
        } else if (opts.onend) {
          opts.onend();
        }
      };
      u.onend = function () { finish(false); };
      u.onerror = function (e) {
        /* 主动取消不算错误 */
        var t = e && e.error;
        finish(t !== 'interrupted' && t !== 'canceled');
      };
      /* 保底：如果 12 秒内没有任何回调（个别浏览器偶发），放行 */
      setTimeout(function () { finish(false); }, 12000);
      try {
        synth.speak(u);
      } catch (e) {
        Util.toast('朗读失败：' + (e.message || e), 'warn');
        if (opts.onend) opts.onend();
        return false;
      }
      return true;
    },

    stop: function () {
      this._token++;
      this._queueStopped = true;
      if (this.supported) {
        try { synth.cancel(); } catch (e) { /* 忽略 */ }
      }
    },

    /* 暂停/继续（部分浏览器对中文语音或队列暂停支持有限，失败时返回 false） */
    pause: function () {
      if (!this.supported) return false;
      try { synth.pause(); return true; } catch (e) { return false; }
    },

    resume: function () {
      if (!this.supported) return false;
      try { synth.resume(); return true; } catch (e) { return false; }
    },

    /* 连续播放：texts 数组逐个朗读，中间停顿 gap 毫秒
       opts: { gap, onItem(index), onDone(), pitchFn(index) }
       队列持有统一令牌：外部 speak()/stop() 会打断队列，队列自身不会自我作废 */
    speakQueue: function (texts, opts) {
      opts = opts || {};
      if (!this.supported) {
        Util.toast('当前浏览器不支持语音朗读，建议使用 Safari 或 Chrome', 'warn');
        return false;
      }
      this.stop();
      var token = ++this._token;
      this._queueStopped = false;
      var self = this;
      var i = 0;

      var step = function () {
        if (self._queueStopped || token !== self._token) return;
        if (i >= texts.length) {
          self._queueStopped = true;
          if (opts.onDone) opts.onDone();
          return;
        }
        var idx = i;
        if (opts.onItem) opts.onItem(idx);
        /* 句级兜底：个别引擎偶发不回调，4 秒无响应则强制推进下一句 */
        var advanced = false;
        var advance = function () {
          if (advanced) return;
          advanced = true;
          setTimeout(function () {
            if (self._queueStopped || token !== self._token) return;
            i++;
            step();
          }, opts.gap != null ? opts.gap : 400);
        };
        self._speakWithToken(token, texts[idx], {
          pitch: opts.pitchFn ? opts.pitchFn(idx) : undefined,
          onend: advance
        });
        setTimeout(advance, 4000);
      };
      step();
      return true;
    },

    voiceName: function () {
      return this.voice ? this.voice.name : (this.supported ? '默认英语语音' : '不可用');
    }
  };

  global.Speaker = Speaker;
})(window);
