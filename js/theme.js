/* 主题管理器（UI 3.0）：跟随系统 / 浅色 / 深色
   - 偏好存 localStorage 'yilin-ui-theme'（'auto' 缺省 / 'light' / 'dark'），与学习数据键隔离
   - 应用方式：html[data-theme="light|dark"]，css/ui2.css 按 data-theme 切换令牌
   - 跟随系统时监听 prefers-color-scheme 变化实时切换 */
(function (global) {
  'use strict';

  var KEY = 'yilin-ui-theme';
  var mql = global.matchMedia ? global.matchMedia('(prefers-color-scheme: dark)') : null;

  function pref() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === 'light' || v === 'dark') ? v : 'auto';
    } catch (e) { return 'auto'; }
  }

  function systemDark() {
    return !!(mql && mql.matches);
  }

  function apply() {
    var p = pref();
    var dark = p === 'dark' || (p === 'auto' && systemDark());
    global.document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  var Theme = {
    /* 当前偏好：auto | light | dark */
    current: function () { return pref(); },
    /* 当前实际生效主题：light | dark */
    effective: function () {
      return global.document.documentElement.getAttribute('data-theme') || 'light';
    },
    /* 设置偏好：'auto' | 'light' | 'dark' */
    set: function (p) {
      try {
        if (p === 'light' || p === 'dark') localStorage.setItem(KEY, p);
        else localStorage.removeItem(KEY);
      } catch (e) { /* 无痕模式等：仅本次生效 */ }
      apply();
    },
    init: function () {
      apply();
      if (!mql) return;
      var onChange = function () { if (pref() === 'auto') apply(); };
      if (mql.addEventListener) mql.addEventListener('change', onChange);
      else if (mql.addListener) mql.addListener(onChange);   /* 旧 Safari 兼容 */
    }
  };

  global.Theme = Theme;
  Theme.init();
})(window);
