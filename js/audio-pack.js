/* 预生成语音包（豆包同款音色）
   - audio/manifest.js 由 tools/tts-gen.ps1 生成：window.AUDIO_PACK = { version, voice, voiceLabel, count, files }
   - files: 归一化文本 -> 相对 audio/ 的文件名；未部署清单或未命中时静默降级为设备语音
   - 归一化规则与生成脚本一致：连续空白折叠为单个空格并去除首尾空白 */
(function (global) {
  'use strict';

  function normalize(text) {
    return String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
  }

  var AudioPack = {
    ready: false,
    map: null,
    count: 0,
    voice: '',
    voiceLabel: '',
    version: '',

    init: function () {
      var self = this;
      var s = document.createElement('script');
      s.src = 'audio/manifest.js';
      s.onload = function () {
        var m = global.AUDIO_PACK;
        if (m && m.files && typeof m.files === 'object') {
          self.map = m.files;
          self.count = m.count || Object.keys(m.files).length;
          self.voice = m.voice || '';
          self.voiceLabel = m.voiceLabel || m.voice || '';
          self.version = m.version || '';
          self.ready = true;
          /* 首屏可能已在清单加载完成前渲染（如设置页语音卡片），补一次重渲染 */
          if (global.App && typeof global.App.rerender === 'function') {
            try { global.App.rerender(); } catch (e) { /* 忽略 */ }
          }
        }
      };
      /* 清单不存在（未部署音频包）不算错误，保持降级 */
      s.onerror = function () { };
      document.head.appendChild(s);
    },

    /* 用户是否启用语音包（设置页可关闭，回到设备语音） */
    enabled: function () {
      if (!this.ready || !this.map) return false;
      try {
        return global.Store.data.settings.audioPack !== false;
      } catch (e) {
        return true;
      }
    },

    /* 命中返回相对 URL（含版本参数便于缓存更新），未命中返回 null */
    lookup: function (text) {
      if (!this.enabled()) return null;
      var f = this.map[normalize(text)];
      return f ? ('audio/' + f + '?v=' + encodeURIComponent(this.version)) : null;
    },

    /* 设置页展示用 */
    describe: function () {
      if (!this.ready) return null;
      return { count: this.count, voiceLabel: this.voiceLabel, version: this.version };
    }
  };

  AudioPack.normalize = normalize;
  global.AudioPack = AudioPack;
  AudioPack.init();
})(window);
