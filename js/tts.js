/* 浏览器语音点读（Web Speech API）
   - 首次触摸时解锁（iOS Safari 需要在用户手势内触发一次朗读）
   - 优先选择英语语音（美音优先）
   - 朗读失败或浏览器不支持时给出明确提示 */
(function (global) {
  'use strict';

  var synth = window.speechSynthesis;

  var PREFERRED_VOICES = [
    /* 高清神经语音优先（Edge/Win11 的 Online (Natural) 系列，远比传统 SAPI 语音清晰） */
    'Microsoft Aria Online (Natural)', 'Microsoft Jenny Online (Natural)',
    'Microsoft Ana Online (Natural)', 'Microsoft Guy Online (Natural)',
    'Microsoft Michelle Online (Natural)', 'Microsoft Ryan Online (Natural)',
    'Google US English',
    'Samantha', 'Microsoft Aria', 'Microsoft Jenny',
    'Microsoft Zira', 'Google UK English Female', 'Karen', 'Daniel', 'Microsoft Guy'
  ];

  function pickVoice(voices) {
    var en = voices.filter(function (v) { return /^en[-_]/i.test(v.lang) || v.lang === 'en'; });
    if (!en.length) return null;
    /* 命名里带 Natural 的在线神经语音优先（覆盖未来新增命名） */
    var natural = en.filter(function (v) { return /natural/i.test(v.name); });
    if (natural.length) {
      var usNat = natural.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0];
      return usNat || natural[0];
    }
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
    _queueRetry: null,

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
        if (self._unlocked) return;
        self._unlocked = true;
        try {
          /* volume=0 的静音合成在部分 iOS 版本不解锁，用近无声的 0.01 */
          var u = new window.SpeechSynthesisUtterance(' ');
          u.volume = 0.01;
          u.rate = 1;
          u.onend = function () { self._unlockingAt = 0; };
          self._keep(u);
          self._unlockingAt = Date.now();
          synth.speak(u);
        } catch (e) { /* 忽略 */ }
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('touchend', unlock);
        document.removeEventListener('click', unlock);
      };
      /* pointerdown 在同一次点击链里最早触发，保证后续点读 click 前已完成解锁 */
      document.addEventListener('pointerdown', unlock, false);
      document.addEventListener('touchend', unlock, false);
      document.addEventListener('click', unlock, false);
    },

    /* 持有 utterance 引用，防止回调触发前被垃圾回收（iOS 常见无声原因之一） */
    _keep: function (u) {
      if (!this._alive) this._alive = [];
      this._alive.push(u);
      if (this._alive.length > 24) this._alive.splice(0, 12);
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
      /* iOS 长时间停留后合成器可能停在 paused 状态，先恢复 */
      try { if (synth.paused) synth.resume(); } catch (e) { /* 忽略 */ }
      /* 刚解锁 800ms 内不 cancel（会把 iOS 解锁音掐断、把合成器卡进静音状态），让朗读排队 */
      var justUnlocked = this._unlockingAt && (Date.now() - this._unlockingAt < 800);
      if (!justUnlocked) {
        try { synth.cancel(); } catch (e) { /* 忽略 */ }
      }
      var u = new window.SpeechSynthesisUtterance(text);
      if (this.voice) {
        u.voice = this.voice;
        u.lang = this.voice.lang;
      } else {
        u.lang = 'en-US';
      }
      u.rate = opts.rate || (global.Store && Store.data.settings.rate) || 0.9;
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
      /* 保底：长时间无任何回调（个别浏览器偶发）时放行 onend；
         若合成器仍在播/排队/暂停则顺延重查，绝不掐断正在播的长句 */
      var fallback = function () {
        if (finished || token !== Speaker._token) return;
        var busy = false;
        try { busy = synth.speaking || synth.pending || synth.paused; } catch (e) { /* 忽略 */ }
        if (busy) { setTimeout(fallback, 3000); return; }
        finish(false);
      };
      setTimeout(fallback, 12000);
      this._keep(u);
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
      this._queueRetry = null;
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
      try { synth.resume(); } catch (e) { return false; }
      /* 个别引擎（尤其 iOS Safari）resume 后仍卡在 paused：1.5 秒后仍无恢复迹象，
         则取消死态并从队列当前句重播，避免“既不暂停也不出声” */
      var self = this;
      setTimeout(function () {
        var stuck = false;
        try { stuck = synth.paused && !synth.speaking; } catch (e) { return; }
        if (!stuck) return;
        try { synth.cancel(); } catch (e) { /* 忽略 */ }
        var r = self._queueRetry;
        if (r && r.token === self._token) r.run();
      }, 1500);
      return true;
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
        if (self._queueStopped || token !== self._token) { self._queueRetry = null; return; }
        if (i >= texts.length) {
          self._queueStopped = true;
          self._queueRetry = null;
          if (opts.onDone) opts.onDone();
          return;
        }
        var idx = i;
        if (opts.onItem) opts.onItem(idx);
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
        var speakCurrent = function () {
          if (self._queueStopped || token !== self._token) return;
          /* 记录当前句，供 resume() 自愈时从本句重播 */
          self._queueRetry = { token: token, run: speakCurrent };
          self._speakWithToken(token, texts[idx], {
            pitch: opts.pitchFn ? opts.pitchFn(idx) : undefined,
            onend: advance
          });
        };
        speakCurrent();
        /* 句级看门狗：只兜底“引擎不回调”的死句——连续 4 秒确认空闲（不在播、
           不在排队、未暂停）才强制推进；仍在播的长句与暂停状态永不触发 */
        var idleTicks = 0;
        var watchdog = function () {
          if (advanced) return;
          if (self._queueStopped || token !== self._token) return;
          var busy = false;
          try { busy = synth.speaking || synth.pending || synth.paused; } catch (e) { /* 忽略 */ }
          if (busy) idleTicks = 0; else idleTicks++;
          if (idleTicks >= 4) { advance(); return; }
          setTimeout(watchdog, 1000);
        };
        setTimeout(watchdog, 1000);
      };
      step();
      return true;
    },

    voiceName: function () {
      if (!this.supported) return '不可用';
      var v = this.voice;
      if (!v) {
        try { v = pickVoice(synth.getVoices() || []); } catch (e) { /* 忽略 */ }
      }
      return v ? v.name : '未找到英语语音（将用系统默认语音朗读）';
    },

    /* 设备是否装有英语语音：无英语语音时点读/听力发音可能不标准，设置页据此提醒 */
    hasEnglishVoice: function () {
      if (!this.supported) return false;
      try { return !!pickVoice(synth.getVoices() || []); } catch (e) { return false; }
    }
  };

  global.Speaker = Speaker;
})(window);
