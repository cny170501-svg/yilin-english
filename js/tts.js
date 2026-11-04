/* 语音点读：统一使用预生成的豆包「Tina老师2.0」音频包
   - 所有可播放语音均来自 audio/manifest.js，不回退设备 Web Speech，避免音色混杂
   - 未命中语音包或音频播放失败时明确提示，待补录后再播放
   - 首次触摸时解锁 HTMLAudioElement（iOS Safari 需要用户手势） */
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

  /* iOS 音频解锁用：约 10ms 的 8kHz 静音 WAV（data URI，无需网络请求） */
  var SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

  var Speaker = {
    supported: !!(synth && typeof window.SpeechSynthesisUtterance !== 'undefined'),
    voice: null,
    _token: 0,
    _queueStopped: true,
    _queueRetry: null,
    /* 音频包播放状态 */
    _audioEl: null,
    _audioMode: false,

    init: function () {
      /* 不再初始化设备英语音色；全站统一播放 Tina 老师 2.0 预生成音频 */
      this._installUnlock();
    },

    /* iOS / 部分 Android 浏览器要求第一次朗读发生在用户手势里 */
    _installUnlock: function () {
      var self = this;
      if (this._unlocked) return;
      var unlock = function () {
        if (self._unlocked) return;
        self._unlocked = true;
        /* 音频元素：静音播放一次即解锁后续的编程播放 */
        try {
          var a = self._ensureAudio();
          a.muted = true;
          a.src = SILENT_WAV;
          var p = a.play();
          if (p && p.then) p.then(function () { a.muted = false; a.removeAttribute('src'); }).catch(function () { a.muted = false; });
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

    _ensureAudio: function () {
      if (this._audioEl) return this._audioEl;
      var a = new Audio();
      a.preload = 'auto';
      /* 语速调节不变调（Safari 前缀属性兼容） */
      try {
        a.preservesPitch = true;
        if ('webkitPreservesPitch' in a) a.webkitPreservesPitch = true;
      } catch (e) { /* 忽略 */ }
      this._audioEl = a;
      return a;
    },

    _stopAudio: function () {
      if (!this._audioEl) return;
      try {
        this._audioEl.pause();
        this._audioEl.currentTime = 0;
      } catch (e) { /* 忽略 */ }
      this._audioMode = false;
    },

    _applyRate: function (a, opts) {
      var r = (opts && opts.rate) || (global.Store && Store.data.settings.rate) || 0.9;
      /* 预生成录音本身语速合适，映射到温和区间，避免变速过度失真 */
      a.playbackRate = Math.min(1.35, Math.max(0.65, r));
    },

    /* 朗读一段文本。返回 'audio'/'speech' 表示所用通道，false 表示不可用 */
    speak: function (text, opts) {
      /* 独立朗读持有新令牌，会打断进行中的队列 */
      return this._speakWithToken(++this._token, text, opts);
    },

    /* 内部：以指定令牌朗读（队列复用同一令牌，保证链式回调不被自身作废） */
    _speakWithToken: function (token, text, opts) {
      opts = opts || {};
      if (!text) {
        if (opts.onend) opts.onend();
        return false;
      }
      var self = this;

      /* 通道 1：预生成语音包（豆包同款音色） */
      var url = global.AudioPack ? AudioPack.lookup(text) : null;
      if (url) {
        var done = false;
        var finishAudio = function (failed) {
          if (done || token !== self._token) return;
          done = true;
          if (failed) Util.toast('Tina老师2.0语音播放失败，请刷新页面或检查网络/缓存', 'warn');
          if (opts.onend) opts.onend();
        };
        var a = this._ensureAudio();
        this._stopAudio();
        this._audioMode = true;
        a.onended = function () { finishAudio(false); };
        a.onerror = function () { finishAudio(true); };
        a.onabort = function () { /* stop() 主动中止：不算完成也不回退 */ };
        a.src = url;
        this._applyRate(a, opts);
        try {
          var p = a.play();
          if (p && p.then) {
            p.catch(function () {
              /* 播放被拒绝：若令牌仍有效则回退设备语音 */
              finishAudio(true);
            });
          }
        } catch (e) {
          finishAudio(true);
        }
        return 'audio';
      }

      /* 未命中语音包时不调用设备 TTS，避免混入其他音色 */
      Util.toast('这条内容暂时没有 Tina老师2.0 录音，请补充生成语音包', 'warn');
      if (opts.onend) opts.onend();
      return false;
    },

    _speechWithToken: function (token, text, opts) {
      opts = opts || {};
      var self = this;
      this._audioMode = false;
      if (!this.supported) {
        Util.toast('当前浏览器不支持语音朗读，建议使用 Safari 或 Chrome', 'warn');
        if (opts.onend) opts.onend();
        return false;
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
      return 'speech';
    },

    stop: function () {
      this._token++;
      this._queueStopped = true;
      this._queueRetry = null;
      this._stopAudio();
      if (this.supported) {
        try { synth.cancel(); } catch (e) { /* 忽略 */ }
      }
    },

    /* 暂停/继续（音频包通道原生支持；语音合成通道部分浏览器支持有限，失败时返回 false） */
    pause: function () {
      if (this._audioMode && this._audioEl) {
        try { this._audioEl.pause(); return true; } catch (e) { return false; }
      }
      if (!this.supported) return false;
      try { synth.pause(); return true; } catch (e) { return false; }
    },

    resume: function () {
      if (this._audioMode && this._audioEl) {
        try {
          var p = this._audioEl.play();
          if (p && p.catch) p.catch(function () { /* 拒绝时交由上层重试 */ });
          return true;
        } catch (e) { return false; }
      }
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
       队列持有统一令牌：外部 speak()/stop() 会打断队列，队列自身不会自我作废
       返回 'audio'/'speech'（按第一句所用通道） */
    speakQueue: function (texts, opts) {
      opts = opts || {};
      var self = this;
      if (!(global.AudioPack && AudioPack.enabled())) {
        Util.toast('Tina老师2.0语音包尚未加载，请刷新页面后重试', 'warn');
        return false;
      }
      this.stop();
      var token = ++this._token;
      this._queueStopped = false;
      var i = 0;
      var firstChannel = null;

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
          /* 记录当前句，供 resume() 自愈时从本句重播（仅语音合成通道需要） */
          self._queueRetry = { token: token, run: speakCurrent };
          var ch = self._speakWithToken(token, texts[idx], {
            pitch: opts.pitchFn ? opts.pitchFn(idx) : undefined,
            onend: advance
          });
          if (firstChannel === null) firstChannel = ch;
        };
        speakCurrent();
        /* 句级看门狗：只兜底“引擎不回调”的死句——连续 4 秒确认空闲（不在播、
           不在排队、未暂停）才强制推进；仍在播的长句与暂停状态永不触发。
           音频包通道事件可靠，无需看门狗 */
        var idleTicks = 0;
        var watchdog = function () {
          if (advanced) return;
          if (self._queueStopped || token !== self._token) return;
          if (self._audioMode && self._audioEl) {
            var cur = self._audioEl;
            if (cur.paused || cur.ended) { advance(); return; }
            idleTicks = 0;
            setTimeout(watchdog, 1000);
            return;
          }
          var busy = false;
          try { busy = synth.speaking || synth.pending || synth.paused; } catch (e) { /* 忽略 */ }
          if (busy) idleTicks = 0; else idleTicks++;
          if (idleTicks >= 4) { advance(); return; }
          setTimeout(watchdog, 1000);
        };
        setTimeout(watchdog, 1000);
      };
      step();
      return firstChannel === null ? 'audio' : firstChannel;
    },

    /* 设备语音名称（语音包状态由设置页单独展示，见 AudioPack.describe） */
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
