/** Tailwind 构建配置
 *  - 关闭 preflight：项目已有完整手写样式，避免样式重置破坏现有界面
 *  - DaisyUI（4.x，与 Tailwind 3 兼容）：关闭 themes 与 base（避免主题变量/
 *    全局样式注入），并把 content 收窄到 index.html + safelist 白名单 ——
 *    只输出 card / card-body / shadow-md / prose 等明确需要的类，
 *    防止 DaisyUI 同名组件（如 .btn）与手写样式冲突
 *  - 重新构建：..\tools\node20\npm.cmd run build
 */
module.exports = {
  content: ['../index.html'],
  corePlugins: { preflight: false },
  daisyui: {
    themes: false,
    base: false,
    logs: false
  },
  theme: {
    extend: {}
  },
  safelist: [
    'prose', 'prose-slate',
    'card', 'card-body', 'shadow-md'
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ]
};
