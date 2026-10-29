/* 通用工具函数 */
(function (global) {
  'use strict';

  var ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  var Util = {
    /* 转义 HTML，防止内容中的特殊字符破坏页面 */
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC_MAP[c]; });
    },

    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },

    pick: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    sample: function (arr, n) {
      return Util.shuffle(arr).slice(0, n);
    },

    pad2: function (n) {
      return (n < 10 ? '0' : '') + n;
    },

    todayStr: function () {
      var d = new Date();
      return d.getFullYear() + '-' + Util.pad2(d.getMonth() + 1) + '-' + Util.pad2(d.getDate());
    },

    dateOffsetStr: function (offsetDays) {
      var d = new Date();
      d.setDate(d.getDate() + offsetDays);
      return d.getFullYear() + '-' + Util.pad2(d.getMonth() + 1) + '-' + Util.pad2(d.getDate());
    },

    fmtDate: function (ts) {
      var d = new Date(ts);
      return (d.getMonth() + 1) + '月' + d.getDate() + '日';
    },

    uid: function () {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    },

    /* 顶部浮动提示 */
    toast: function (msg, type) {
      var box = document.getElementById('toast-box');
      if (!box) {
        box = document.createElement('div');
        box.id = 'toast-box';
        document.body.appendChild(box);
      }
      var t = document.createElement('div');
      t.className = 'toast' + (type ? ' toast-' + type : '');
      t.textContent = msg;
      box.appendChild(t);
      setTimeout(function () {
        t.classList.add('toast-out');
        setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 350);
      }, 2200);
    }
  };

  /* Lucide 图标(MIT,https://lucide.dev)内联 SVG——用于操作类按钮,
     内容性图标(单元动物/任务)保留 emoji 以维持儿童亲和力 */
  var LUCIDE_PATHS = {
    volume: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.594 1.594 0 0 1 5.306 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1.306a1.594 1.594 0 0 1 1.107.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    play: '<path d="M7 4.5v15a.5.5 0 0 0 .8.4l11-7.5a.5.5 0 0 0 0-.8L7.8 4.1a.5.5 0 0 0-.8.4z"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="3"/>',
    redo: '<path d="M3 12a9 9 0 0 1 15.36-6.36L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.36 6.36L3 16"/><path d="M3 21v-5h5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'
  };
  Util.icon = function (name, size) {
    var p = LUCIDE_PATHS[name];
    if (!p) return '';
    var s = size || 20;
    return '<svg class="lucide lucide-' + name + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  };

  global.Util = Util;
})(window);
