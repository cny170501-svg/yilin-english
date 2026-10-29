/* 设置（V2.0）：教材、学习目标、语音、显示与字体、内容管理、学习数据、关于 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  function download(filename, text, type) {
    var blob = new Blob([text], { type: type || 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  function chip(action, v, on, label) {
    return '<button class="chip-scope' + (on ? ' on' : '') + '" data-action="' + action + '" data-v="' + v + '">' + label + '</button>';
  }

  var SettingsView = {
    render: function () {
      var stats = Content.stats();
      var st = Store.data.settings;
      var rate = st.rate;
      var rateLabel = rate <= 0.7 ? '慢速' : rate >= 1.05 ? '快速' : '正常';

      /* 教材（当前内置四年级上册，更多教材整理中） */
      var textbookSel = '<div class="kv-row"><span>当前教材</span><b>' + esc(Content.data.title) + '</b></div>' +
        (Content.usingCustom ? '' : '<div class="muted small">其他年级与册次正在整理中；如需自用，可按 README 中的 JSON 格式自制后从下方导入。</div>');

      /* 每日目标 */
      var goalRow = function (label, key, opts) {
        return '<div class="goal-row"><span class="muted small">' + label + '</span><span class="goal-chips">' +
          opts.map(function (o) {
            return chip('settings:goal', key + ':' + o.v, st[key] == o.v, o.l);
          }).join('') + '</span></div>';
      };
      var goals = goalRow('点读单词', 'dailyWords', [{ v: 5, l: '5 个' }, { v: 10, l: '10 个' }, { v: 15, l: '15 个' }, { v: 20, l: '20 个' }]) +
        goalRow('完成练习', 'dailySessions', [{ v: 1, l: '1 组' }, { v: 2, l: '2 组' }, { v: 3, l: '3 组' }]) +
        goalRow('课外阅读', 'dailyReading', [{ v: 0, l: '不安排' }, { v: 1, l: '1 篇' }, { v: 2, l: '2 篇' }]);

      return '' +
        '<header class="page-head"><div class="book-title">⚙️ 设置</div></header>' +

        /* ---------- 教材 ---------- */
        '<section class="card">' +
        '  <div class="card-title">📚 年级与教材</div>' + textbookSel +
        '</section>' +

        /* ---------- 每日目标 ---------- */
        '<section class="card">' +
        '  <div class="card-title">🎯 每日学习目标</div>' + goals +
        '  <div class="muted small">全部完成当天任务，连续学习天数 +1</div>' +
        '</section>' +

        /* ---------- 语音 ---------- */
        '<section class="card">' +
        '  <div class="card-title">🔊 语音点读</div>' +
        (Speaker.supported
          ? '<div class="muted small">使用设备自带英语语音：' + esc(Speaker.voiceName()) + '</div>' +
            '<div class="rate-row">' +
            '<span class="muted small">语速：</span>' +
            chip('settings:rate', 0.65, rate <= 0.7, '🐢 慢速') +
            chip('settings:rate', 0.85, rate > 0.7 && rate < 1.05, '🚶 正常') +
            chip('settings:rate', 1.1, rate >= 1.05, '🐇 快速') +
            '</div>' +
            '<div class="rate-row">' +
            '<span class="muted small">听力题自动播放：</span>' +
            chip('settings:autoplay', 1, st.listenAutoplay !== false, '开') +
            chip('settings:autoplay', 0, st.listenAutoplay === false, '关') +
            '</div>' +
            '<button class="btn btn-primary btn-block" data-speak="Hello! I like dogs. Do you like pandas?">▶ 试听发音（当前：' + rateLabel + '）</button>' +
            '<div class="muted small">提示：iPad/iPhone 如果没有声音，请检查是否开启了静音键，并在 设置→辅助功能→朗读内容 中确认语音可用。</div>'
          : '<div class="warn-box">当前浏览器不支持语音朗读（Web Speech API）。点读与听力功能需要使用 Safari（iPhone/iPad）或 Chrome/Edge（安卓/电脑）浏览器。</div>') +
        '</section>' +

        /* ---------- 显示 ---------- */
        '<section class="card">' +
        '  <div class="card-title">🔤 显示与阅读舒适度</div>' +
        '<div class="rate-row"><span class="muted small">字体大小：</span>' +
        chip('settings:font', 's', st.fontSize === 's', '小') +
        chip('settings:font', 'm', st.fontSize === 'm' || !st.fontSize, '中（默认）') +
        chip('settings:font', 'l', st.fontSize === 'l', '大') +
        '</div>' +
        '<div class="rate-row"><span class="muted small">阅读页中文默认：</span>' +
        chip('settings:zhMode', 'hide', st.zhMode === 'hide', '纯英文') +
        chip('settings:zhMode', 'show', st.zhMode === 'show', '中英全文') +
        chip('settings:zhMode', 'sentence', st.zhMode === 'sentence', '逐句对照') +
        '</div>' +
        '<div class="rate-row"><span class="muted small">单词/句型页中文：</span>' +
        chip('settings:showZh', 1, st.showZh !== false, '显示') +
        chip('settings:showZh', 0, st.showZh === false, '隐藏') +
        '</div>' +
        '</section>' +

        /* ---------- 内容管理 ---------- */
        '<section class="card">' +
        '  <div class="card-title">📚 内容管理（教材数据）</div>' +
        '  <div class="kv-row"><span>数据来源</span><b>' + (Content.usingCustom ? '✅ 自定义导入' : '内置数据') + '</b></div>' +
        '  <div class="kv-row"><span>内容规模</span><b>' + stats.units + ' 单元 · ' + stats.words + ' 单词 · ' + stats.sentences + ' 句型 · ' + stats.quizzes + ' 语法题</b></div>' +
        (global.READING_CONTENT ? '<div class="kv-row"><span>阅读内容</span><b>' + READING_CONTENT.articles.length + ' 篇文章 · ' + READING_CONTENT.videos.length + ' 个视频资源</b></div>' : '') +
        '  <div class="source-tip">' + esc(Content.data.sourceNote || '') + (global.READING_CONTENT ? ' ' + esc(READING_CONTENT.note) : '') + '</div>' +
        '  <div class="btn-row">' +
        '    <button class="btn btn-mini" data-action="settings:exportContent">📤 导出内容 JSON</button>' +
        (Content.usingCustom ? '<button class="btn btn-mini btn-danger" data-action="settings:useBuiltin">↩ 恢复内置数据</button>' : '') +
        '  </div>' +
        '  <div class="import-box">' +
        '    <div class="small" style="margin-bottom:6px"><b>导入 / 更新教材内容</b>：选择 JSON 文件，或粘贴 JSON 后点「校验并应用」（阅读与听力内容暂不支持导入，见“关于”）</div>' +
        '    <input type="file" id="import-file" accept=".json,application/json" class="file-input">' +
        '    <textarea id="import-text" class="import-textarea" placeholder=\'把修改后的内容 JSON 粘贴到这里…\'></textarea>' +
        '    <button class="btn btn-primary btn-block" data-action="settings:importApply">✅ 校验并应用</button>' +
        '    <div class="muted small">格式：与「导出内容 JSON」一致；最小要求 units[].{id,title,words[].{en,zh}}，sentences / grammar 可选。应用后立即生效，可随时恢复内置。</div>' +
        '  </div>' +
        '</section>' +

        /* ---------- 学习数据 ---------- */
        '<section class="card">' +
        '  <div class="card-title">💾 学习数据</div>' +
        (Store.available
          ? '<div class="muted small">进度、错题本、每日任务、阅读记录与生词本保存在本机浏览器（localStorage），刷新或关闭后不丢失；更换设备不会自动同步（未接入云端）。</div>'
          : '<div class="warn-box">⚠️ 当前浏览器无法使用本地存储（可能是无痕模式），学习进度刷新后会丢失。</div>') +
        '  <div class="btn-row">' +
        '    <button class="btn btn-mini" data-action="settings:exportProgress">📤 导出学习数据</button>' +
        '    <button class="btn btn-mini btn-danger" data-action="settings:resetProgress">🗑 清空学习记录</button>' +
        '  </div>' +
        '</section>' +

        /* ---------- 安装 ---------- */
        '<section class="card">' +
        '  <div class="card-title">📲 添加到主屏幕</div>' +
        '  <div class="muted small">iPhone / iPad：用 Safari 打开本页面 → 分享按钮 →「添加到主屏幕」。<br>安卓：Chrome 菜单 →「安装应用」。电脑 Chrome/Edge：地址栏右侧安装图标。</div>' +
        '</section>' +

        /* ---------- 关于 ---------- */
        '<section class="card">' +
        '  <div class="card-title">ℹ️ 关于本工具（功能完成情况）</div>' +
        '  <div class="about-lines muted small">' +
        '  · 已实现：单词点读与跟读、句型点读、知识点讲解、语法专项（11 主题讲解 + 主题练习）、听力四模式（选词/听句/听写/对话）、读写五模式（看中写英/听中写英/听写/补全/互译）、看图默写专项（看图/看中文/默句子/听音/易错强化五种模式，逐词定位判题，V2.2）、七种选择与排序题型、综合测试与分题型成绩、错题本（题型/单元/语法主题筛选、重练、去讲解/去原文）、阅读板块（双语切换/逐句点读/朗读暂停/生词收藏/阅读理解/视频资源导航）、每日任务、学习进度与家长报告、内容导入、PWA。<br>' +
        '  · 语音：使用设备自带 TTS 合成（不依赖网络音频），<b>不是教材配套原版录音</b>；句子判分为规则比对（忽略大小写/标点/少量差异），<b>不是智能语义评分</b>。<br>' +
        '  · 未实现（不以下线功能伪装）：视频字幕抓取与双语字幕、云端同步、听力真题音频。视频区提供的是真实外链与人工整理的学习重点。<br>' +
        '  · 内容声明：教材单词表依据公开资料整理；例句/句型/听力材料/阅读文章（除标注公有领域改编外）为本工具自编原创；<b>均不是教材原文</b>，请以课本为准核对。' +
        '  </div>' +
        '</section>';
    },

    actions: {
      'settings:rate': function (d) {
        Store.data.settings.rate = +d.v;
        Store.save();
        Util.toast('语速已保存，点「试听发音」试试');
        App.rerender();
      },
      'settings:autoplay': function (d) {
        Store.data.settings.listenAutoplay = d.v === '1';
        Store.save();
        Util.toast(d.v === '1' ? '听力题将自动播放' : '听力题不再自动播放，需手动点击喇叭');
        App.rerender();
      },
      'settings:font': function (d) {
        Store.data.settings.fontSize = d.v;
        Store.save();
        App.applyFontSize();
        App.rerender();
      },
      'settings:zhMode': function (d) {
        Store.data.settings.zhMode = d.v;
        Store.save();
        Util.toast('已设为阅读页默认模式');
        App.rerender();
      },
      'settings:showZh': function (d) {
        Store.data.settings.showZh = d.v === '1';
        Store.save();
        App.state.showZh = d.v === '1';
        App.rerender();
      },
      'settings:goal': function (d) {
        var kv = d.v.split(':');
        Store.data.settings[kv[0]] = +kv[1];
        Store.save();
        Store.checkDaily();
        Util.toast('每日目标已保存');
        App.rerender();
      },

      'settings:exportContent': function () {
        download('yilin-english-content-' + Util.todayStr() + '.json', JSON.stringify(Content.data, null, 2));
        Util.toast('内容 JSON 已导出');
      },

      'settings:useBuiltin': function () {
        if (window.confirm('恢复内置数据将放弃当前导入的自定义内容，确定吗？')) {
          Store.clearCustomContent();
          Content.load();
          Util.toast('已恢复内置教材数据');
          App.rerender();
        }
      },

      'settings:importApply': function () {
        var ta = document.getElementById('import-text');
        var fileInput = document.getElementById('import-file');
        var text = (ta && ta.value.trim()) || '';
        if (!text && fileInput && fileInput.files && fileInput.files.length) {
          var file = fileInput.files[0];
          var reader = new FileReader();
          reader.onload = function () { applyImport(String(reader.result)); };
          reader.onerror = function () { Util.toast('读取文件失败，请重试', 'warn'); };
          reader.readAsText(file, 'utf-8');
          return;
        }
        if (!text) {
          Util.toast('请先选择 JSON 文件或粘贴 JSON 内容', 'warn');
          return;
        }
        applyImport(text);
      },

      'settings:exportProgress': function () {
        download('yilin-english-progress-' + Util.todayStr() + '.json', JSON.stringify(Store.data, null, 2));
        Util.toast('学习数据已导出（JSON 备份文件，可作为存档）');
      },

      'settings:resetProgress': function () {
        if (window.confirm('确定清空所有学习记录吗？包括进度、错题本、阅读记录与生词本，清空后无法恢复！') &&
            window.confirm('再次确认：真的要清空全部学习数据吗？')) {
          Store.resetProgress();
          Util.toast('学习记录已清空');
          App.rerender();
        }
      }
    }
  };

  function applyImport(text) {
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      Util.toast('JSON 格式错误：' + e.message, 'warn');
      return;
    }
    var err = Content.validate(parsed);
    if (err) {
      Util.toast('内容校验未通过：' + err, 'warn');
      return;
    }
    if (!parsed.sourceNote) parsed.sourceNote = '自定义导入内容';
    Store.saveCustomContent(JSON.stringify(parsed));
    Content.load();
    Util.toast('✅ 内容已应用：' + parsed.title);
    App.rerender();
  }

  global.SettingsView = SettingsView;
})(window);
