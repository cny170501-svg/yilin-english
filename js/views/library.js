/* 我的资料库（V3.0 第一阶段）
   路由：#/library（列表） / #/library/upload（上传） / #/library/detail/:id（详情+解析+条目） / #/library/review/:id（审核） / #/library/settings（设置）
   本地优先：全部数据在 IndexedDB；文件预览用 Blob URL；解析用 LibParsers。
   第三阶段起：AI 分类/OCR 经 Edge Function；本阶段内建规则分类（关键词启发式）作为初分类。 */
(function (global) {
  'use strict';

  function esc(s) { return Util.esc(s); }

  var CATEGORIES = ['未分类', '教材', '单词表', '课文', '对话', '语法', '发音规则', '试卷', '练习题', '错题', '其他资料'];
  var TYPE_LABEL = { pdf: 'PDF', docx: 'Word', doc: '旧版Word', xlsx: 'Excel', xls: 'Excel', image: '图片' };
  var TYPE_ICON = { pdf: '📕', docx: '📄', doc: '📄', xlsx: '📊', xls: '📊', image: '🖼️' };
  var STATUS_LABEL = {
    uploaded: '已上传', parsing: '解析中', parsed: '已解析',
    needs_review: '待审核', imported: '已导入', failed: '解析失败'
  };

  function fmtSize(n) {
    if (n == null) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(2) + ' MB';
  }
  function fmtTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + Util.pad2(d.getHours()) + ':' + Util.pad2(d.getMinutes());
  }

  /* 关键词启发式初分类（第三阶段由 AI 替代/增强） */
  function guessCategory(text) {
    var t = (text || '').slice(0, 3000);
    var rules = [
      ['单词表', /word\s*list|单词表|词汇表|vocabulary/i],
      ['发音规则', /sounds?|发音|phonics|音标/i],
      ['语法', /grammar|语法|时态|一般现在|一般过去/i],
      ['对话', /对话|dialog|--/],
      ['试卷', /试卷|测试卷|期末|期中|exam|quiz|test/i],
      ['练习题', /练习|exercise|一、|二、|选择题/i],
      ['课文', /课文|unit\s*\d+|story time|cartoon time/i],
      ['错题', /错题|易错|订正/i]
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][1].test(t)) return rules[i][0];
    }
    return '未分类';
  }

  function state() { return App.libState || (App.libState = { filter: '', q: '', previewUrl: null, detailTab: 'parse' }); }
  function refreshLib() { LibUI.cache = {}; try { App.rerender(); } catch (e) { } }
  function setState(patch) { var s = state(); Object.keys(patch).forEach(function (k) { s[k] = patch[k]; }); }

  function clearPreview() {
    var s = state();
    if (s.previewUrl) { try { URL.revokeObjectURL(s.previewUrl); } catch (e) { } s.previewUrl = null; }
  }

  /* ---------- 上传 ---------- */

  function uploadFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return Promise.resolve();
    var results = [];
    var seq = Promise.resolve();
    files.forEach(function (f) {
      seq = seq.then(function () {
        var type = LibParsers.detect(f.name, f.type);
        if (!type) {
          results.push({ name: f.name, ok: false, reason: LibParsers.unsupportedReason(f.name) });
          return;
        }
        return f.arrayBuffer().then(function (ab) {
          return crypto.subtle ? crypto.subtle.digest('SHA-256', ab) : null;
        }).then(function (hash) {
          var sha = '';
          if (hash) {
            sha = Array.prototype.map.call(new Uint8Array(hash), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
          } else {
            sha = 'nohash-' + f.size + '-' + f.name; // 无 crypto.subtle（http 非安全源）兜底
          }
          return LibDB.addMaterial({
            title: f.name,
            type: type,
            mime: f.type,
            size: f.size,
            sha256: sha
          }, f);
        }).then(function (r) {
          if (r.duplicate) {
            results.push({ name: f.name, ok: false, reason: '与已有资料重复（内容相同），未重复保存：' + r.material.title, dup: true });
          } else {
            results.push({ name: f.name, ok: true, material: r.material });
          }
        }).catch(function (e) {
          results.push({ name: f.name, ok: false, reason: '保存失败：' + (e.message || e) });
        });
      });
    });
    return seq.then(function () {
      App.libUploadResults = results;
      refreshLib();
      /* 自动开始解析成功的 */
      results.forEach(function (r) {
        if (r.ok) parseMaterial(r.material.id, r.material.type);
      });
    });
  }

  /* ---------- 解析 ---------- */

  function parseMaterial(materialId, type) {
    var jobId = null;
    return LibDB.get('materials', materialId).then(function (m) {
      if (!m) return;
      m.status = 'parsing';
      return LibDB.put('materials', m).then(function () {
        return LibDB.createJob(materialId, 'extract');
      }).then(function (j) {
        jobId = j.id;
        refreshLib();
        return LibDB.getFile(materialId);
      }).then(function (f) {
        if (!f) throw new Error('原始文件丢失');
        return LibParsers.parse(f.blob, type, function (pct) {
          /* 进度节流更新 */
          LibDB.get('parse_jobs', jobId).then(function (job) {
            if (job && job.progress !== pct) {
              job.progress = pct;
              LibDB.put('parse_jobs', job);
            }
          });
        });
      }).then(function (res) {
        return LibDB.get('parse_jobs', jobId).then(function (job) {
          job.status = 'done';
          job.progress = 100;
          job.result = { page_count: res.page_count, needs_ocr: res.needs_ocr, note: res.note || '', table_count: res.tables ? res.tables.length : 0 };
          return LibDB.put('parse_jobs', job);
        }).then(function () {
          return LibDB.addItems(materialId, jobId, (res.items || []).map(function (it) {
            return { item_type: it.item_type || 'other', raw: it.raw, section: it.section, page: it.page, confidence: it.confidence };
          }));
        }).then(function () {
          /* 用全文做初分类（若资料还是未分类） */
          return LibDB.get('materials', materialId).then(function (m) {
            var text = (res.items || []).map(function (i) { return i.raw; }).join('\n');
            if (m && (m.category === '未分类' || !m.category)) {
              m.category = guessCategory(text);
            }
            if (m) {
              if (res.needs_ocr) m.parse_error = '该文件疑似扫描版/无文字层，文字识别需第三阶段 AI OCR。';
              m.status = res.items && res.items.length ? 'needs_review' : (res.needs_ocr ? 'needs_review' : 'parsed');
              m.page_count = res.page_count != null ? res.page_count : m.page_count;
              return LibDB.put('materials', m);
            }
          });
        });
      }).then(function () {
        refreshLib();
      }).catch(function (e) {
        return LibDB.get('parse_jobs', jobId).then(function (job) {
          if (job) {
            job.status = 'failed';
            job.error = String(e.message || e);
            return LibDB.put('parse_jobs', job);
          }
        }).then(function () {
          return LibDB.get('materials', materialId).then(function (m) {
            if (m) { m.status = 'failed'; m.parse_error = String(e.message || e); return LibDB.put('materials', m); }
          });
        }).then(function () {
          refreshLib();
        });
      });
    });
  }

  /* ---------- 渲染 ---------- */

  function toolbarTabs(active) {
    var tabs = [
      { key: '', label: '📚 资料列表' },
      { key: 'upload', label: '⬆️ 上传资料' },
      { key: 'settings', label: '⚙️ 资料设置' }
    ];
    return '<div class="tabs lib-tabs">' + tabs.map(function (t) {
      return '<button class="tab' + (active === t.key ? ' active' : '') + '" data-action="lib:tab" data-tab="' + t.key + '">' + t.label + '</button>';
    }).join('') + '</div>';
  }

  function renderList() {
    var s = state();
    return LibDB.all('materials').then(function (all) {
      var list = all.filter(function (m) { return !m.deleted; })
        .sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; });
      if (s.filter) list = list.filter(function (m) { return m.category === s.filter; });
      if (s.q) {
        var q = s.q.toLowerCase();
        list = list.filter(function (m) {
          return (m.title || '').toLowerCase().indexOf(q) >= 0 ||
            (m.category || '').indexOf(q) >= 0 ||
            (m.grade || '').toLowerCase().indexOf(q) >= 0 ||
            TYPE_LABEL[m.type] && TYPE_LABEL[m.type].toLowerCase().indexOf(q) >= 0;
        });
      }
      var pendingN = all.filter(function (m) { return !m.deleted && m.status === 'needs_review'; }).length;

      var html = toolbarTabs('') +
        '<div class="lib-stats">' +
        '<span>共 ' + list.length + ' 份资料</span>' +
        (pendingN ? '<span class="lib-warn">🖊 ' + pendingN + ' 份待审核</span>' : '') +
        '<span class="muted small" id="lib-sync-note">💾 资料保存在本机浏览器（IndexedDB）；云端同步将在第二阶段开放</span>' +
        '</div>';

      /* 搜索与筛选 */
      html += '<div class="lib-toolbar">' +
        '<input id="lib-search" class="lib-search" type="search" placeholder="搜索资料名称 / 类型 / 分类…" value="' + esc(s.q) + '" data-action="lib:searchInput">' +
        '<select id="lib-cat" class="lib-select" data-action="lib:catChange">' +
        '<option value="">全部分类</option>' +
        CATEGORIES.map(function (c) { return '<option value="' + c + '"' + (s.filter === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') +
        '</select>' +
        '<button class="btn btn-mini btn-primary" data-action="lib:tab" data-tab="upload">⬆️ 上传</button>' +
        '</div>';

      if (!list.length) {
        html += '<div class="card empty-card">还没有资料。点击右上角「⬆️ 上传」添加第一份资料（支持 PDF / Word / Excel / 图片，可批量与拖拽）。</div>';
        return html;
      }

      html += '<div class="lib-list">';
      list.forEach(function (m) {
        html += '<div class="card lib-item' + (m.status === 'failed' ? ' lib-item-err' : '') + '">' +
          '<button class="lib-item-main" data-action="lib:open" data-id="' + m.id + '">' +
          '<span class="lib-item-icon">' + (TYPE_ICON[m.type] || '📁') + '</span>' +
          '<span class="lib-item-info">' +
          '<span class="lib-item-title">' + esc(m.title) + '</span>' +
          '<span class="lib-item-meta">' + (TYPE_LABEL[m.type] || m.type) + ' · ' + fmtSize(m.size) + ' · ' + fmtTime(m.created_at) +
          ' · ' + esc(m.category) + ' · ' + (STATUS_LABEL[m.status] || m.status) + '</span>' +
          (m.parse_error ? '<span class="lib-item-err-text">' + esc(m.parse_error) + '</span>' : '') +
          '</span></button>' +
          '<span class="lib-item-ops">' +
          '<button class="icon-btn" data-action="lib:parse" data-id="' + m.id + '" title="重新解析">' + Util.icon('redo', 16) + '</button>' +
          '<button class="icon-btn" data-action="lib:del" data-id="' + m.id + '" title="删除">' + Util.icon('eraser', 16) + '</button>' +
          '</span></div>';
      });
      html += '</div>';
      return html;
    });
  }

  function renderUpload() {
    var results = App.libUploadResults || [];
    var html = toolbarTabs('upload');
    html += '<div class="card lib-drop" id="lib-drop">' +
      '<div class="lib-drop-icon">⬆️</div>' +
      '<div class="lib-drop-title">点击选择文件，或把文件拖到这里</div>' +
      '<div class="lib-drop-sub">支持批量上传 · PDF / DOCX / XLSX / XLS / JPG / PNG / WEBP' +
      '<br>旧版 .doc 仅保存不解析 · 扫描件/图片 OCR 第三阶段开放</div>' +
      '<input type="file" id="lib-file" multiple accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png,.webp" style="display:none">' +
      '</div>';
    if (results.length) {
      html += '<div class="card"><div class="card-title">本次上传结果</div>';
      results.forEach(function (r) {
        html += '<div class="lib-up-result' + (r.ok ? '' : ' lib-up-fail') + '">' +
          (r.ok ? '✅' : (r.dup ? '♻️' : '⚠️')) + ' ' + esc(r.name) +
          '<span class="muted small">' + esc(r.ok ? '已保存，开始解析' : (r.reason || '')) + '</span></div>';
      });
      html += '</div>';
    }
    html += '<div class="card muted small">说明：资料保存在本机浏览器 IndexedDB（不会上传到任何服务器）。解析在浏览器本地完成；AI 智能分类与 OCR 将在后续阶段接入（解析结果均需人工审核后才进入学习内容）。</div>';
    return html;
  }

  function renderDetail(materialId) {
    clearPreview();
    return LibDB.get('materials', materialId).then(function (m) {
      if (!m) return '<div class="card">资料不存在 <button class="btn btn-mini" data-nav="#/library">返回</button></div>';
      return Promise.all([LibDB.jobsOf(materialId), LibDB.itemsOf(materialId), LibDB.getFile(materialId)]).then(function (rs) {
        var jobs = rs[0], items = rs[1], fileRec = rs[2];
        var s = state();
        var html = '<header class="unit-head">' +
          '<button class="btn btn-back" data-nav="#/library">' + Util.icon('left', 15) + ' 资料库</button>' +
          '<div class="unit-head-info"><span class="unit-head-emoji">' + (TYPE_ICON[m.type] || '📁') + '</span>' +
          '<div><div class="unit-head-name">' + esc(m.title) + '</div>' +
          '<div class="unit-head-zh">' + (TYPE_LABEL[m.type] || m.type) + ' · ' + fmtSize(m.size) + ' · ' + esc(m.category) + ' · ' + (STATUS_LABEL[m.status] || m.status) + '</div></div></div>' +
          '</header>';

        /* 操作栏 */
        html += '<div class="card lib-detail-ops">' +
          '<button class="btn btn-mini btn-primary" data-action="lib:parse" data-id="' + m.id + '">' + Util.icon('redo', 15) + ' 重新解析</button>' +
          (fileRec ? '<button class="btn btn-mini" data-action="lib:preview" data-id="' + m.id + '">' + Util.icon('play', 15) + ' 查看原始文件</button>' : '') +
          '<button class="btn btn-mini" data-action="lib:export" data-id="' + m.id + '">📤 导出条目</button>' +
          '<button class="btn btn-mini" data-action="lib:del" data-id="' + m.id + '">🗑 删除</button>' +
          '<span class="muted small">分类：</span>' +
          '<select class="lib-select" data-action="lib:setCat" data-id="' + m.id + '">' +
          CATEGORIES.map(function (c) { return '<option' + (m.category === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') +
          '</select></div>';

        /* 元信息 */
        html += '<div class="card muted small">ID：' + m.id + ' · 版本 v' + m.version + ' · 上传于 ' + fmtTime(m.created_at) +
          (m.page_count ? ' · 共 ' + m.page_count + ' 页' : '') +
          (m.parse_error ? '<br>⚠️ ' + esc(m.parse_error) : '') + '</div>';

        /* 原始文件预览（图片/部分 PDF 可内嵌） */
        if (s.previewUrl) {
          if (m.type === 'image') {
            html += '<div class="card"><img class="lib-preview-img" src="' + s.previewUrl + '" alt="原始文件预览"></div>';
          } else if (m.type === 'pdf') {
            html += '<div class="card"><iframe class="lib-preview-frame" src="' + s.previewUrl + '"></iframe></div>';
          } else {
            html += '<div class="card muted small">该格式不支持内嵌预览，<a href="' + s.previewUrl + '" download="' + esc(m.title) + '">点此下载原始文件</a></div>';
          }
        }

        /* 解析任务 */
        html += '<div class="section-title">🧩 解析任务</div>';
        if (!jobs.length) html += '<div class="card empty-card">尚未解析</div>';
        jobs.forEach(function (j) {
          html += '<div class="card lib-job">' +
            '<span>' + (j.kind === 'extract' ? '📄 内容提取' : j.kind) + '</span>' +
            '<span class="lib-job-status ' + j.status + '">' + ({ pending: '等待', running: '进行中', done: '完成', failed: '失败' }[j.status] || j.status) + '</span>' +
            (j.status === 'running' || (j.status === 'done' && j.progress < 100) ? '<span class="lib-job-bar"><span style="width:' + j.progress + '%"></span></span>' : '') +
            (j.error ? '<span class="muted small">' + esc(j.error) + '</span>' : '') +
            (j.result && j.result.note ? '<span class="muted small">' + esc(j.result.note) + '</span>' : '') +
            (j.result && j.result.table_count ? '<span class="muted small">含表格 ' + j.result.table_count + ' 个</span>' : '') +
            '</div>';
        });

        /* 提取条目 */
        var tab = s.detailTab;
        html += '<div class="section-title">📝 提取内容（' + items.length + ' 条）' +
          '<button class="btn btn-mini" style="margin-left:8px" data-action="lib:reviewTab" data-id="' + m.id + '">🖊 审核并导入</button></div>';
        if (!items.length) {
          html += '<div class="card empty-card">暂无提取内容' + (m.status === 'parsing' ? '（解析中…）' : '') + '</div>';
        } else {
          html += '<div class="card lib-items">';
          items.slice(0, 200).forEach(function (it) {
            var icon = { heading: '🔖', word: '🔤', sentence: '💬', dialog_line: '🗣', grammar_point: '🧠', question: '❓', sound_rule: '🔤', other: '•' }[it.item_type] || '•';
            html += '<div class="lib-line"><span class="lib-line-sec">' + icon + ' ' + esc(it.section || '') + (it.page ? ' · P' + it.page : '') + '</span>' +
              '<span class="lib-line-text">' + esc(it.raw) + '</span></div>';
          });
          if (items.length > 200) html += '<div class="muted small" style="padding:8px">… 其余 ' + (items.length - 200) + ' 条在审核页查看</div>';
          html += '</div>';
        }
        return html;
      });
    });
  }

  function renderReview(materialId) {
    return Promise.all([LibDB.get('materials', materialId), LibDB.itemsOf(materialId)]).then(function (rs) {
      var m = rs[0], items = rs[1];
      if (!m) return '<div class="card">资料不存在</div>';
      var html = '<header class="unit-head">' +
        '<button class="btn btn-back" data-nav="#/library/detail/' + m.id + '">' + Util.icon('left', 15) + ' 返回</button>' +
        '<div class="unit-head-info"><span class="unit-head-emoji">🖊</span>' +
        '<div><div class="unit-head-name">审核识别结果</div>' +
        '<div class="unit-head-zh">' + esc(m.title) + '</div></div></div></header>';
      html += '<div class="card muted small">AI/解析结果必须经你确认后才会进入学习内容。可直接编辑每条文字，勾选要导入的条目；第三阶段将加入 AI 分类与置信度标记。</div>';
      if (!items.length) {
        html += '<div class="card empty-card">没有可审核的条目（可能解析失败或文件为扫描件）。</div>';
        return html;
      }
      html += '<div class="card lib-review-ops">' +
        '<button class="btn btn-mini" data-action="lib:checkAll">全选</button>' +
        '<button class="btn btn-mini" data-action="lib:uncheckAll">全不选</button>' +
        '<button class="btn btn-mini btn-primary" data-action="lib:confirmImport" data-id="' + m.id + '">✅ 确认导入所选条目</button>' +
        '<button class="btn btn-mini" data-action="lib:delChecked" data-id="' + m.id + '">🗑 删除所选</button>' +
        '</div>';
      html += '<div class="lib-review-list">';
      items.forEach(function (it) {
        html += '<div class="card lib-review-item" data-item="' + it.id + '">' +
          '<label class="lib-review-check"><input type="checkbox" class="lib-ck" checked></label>' +
          '<div class="lib-review-main">' +
          '<input class="lib-review-edit" value="' + esc(it.raw) + '" data-role="raw">' +
          '<div class="muted small">' + esc(it.section || '') + (it.page ? ' · P' + it.page : '') + ' · 类型：' + it.item_type +
          (it.pending ? ' · <b class="lib-pending">待确认</b>' : '') + '</div>' +
          '</div>' +
          '<button class="icon-btn" data-action="lib:delItem" data-id="' + it.id + '" title="删除此条">' + Util.icon('x', 15) + '</button>' +
          '</div>';
      });
      html += '</div>';
      return html;
    });
  }

  function renderSettings() {
    return LibDB.all('materials').then(function (all) {
      var live = all.filter(function (m) { return !m.deleted; });
      var totalSize = live.reduce(function (n, m) { return n + (m.size || 0); }, 0);
      return Promise.all([LibDB.pendingSyncCount(), LibDB.all('parse_jobs'), LibDB.all('extracted_items')]).then(function (rs) {
        var html = toolbarTabs('settings');
        html += '<section class="card"><div class="card-title">💾 存储概况</div>' +
          '<div class="kv-row"><span>资料份数</span><b>' + live.length + '</b></div>' +
          '<div class="kv-row"><span>占用空间（原始文件）</span><b>' + fmtSize(totalSize) + '</b></div>' +
          '<div class="kv-row"><span>解析任务数</span><b>' + rs[1].length + '</b></div>' +
          '<div class="kv-row"><span>提取条目数</span><b>' + rs[2].length + '</b></div>' +
          '<div class="kv-row"><span>待同步操作</span><b>' + rs[0] + '（云端同步第二阶段开放）</b></div>' +
          '</section>';
        html += '<section class="card"><div class="card-title">📤 备份与导出</div>' +
          '<button class="btn btn-mini" data-action="lib:exportAll">导出全部资料索引（JSON）</button>' +
          '<div class="muted small" style="margin-top:8px">导出内容包含资料列表与提取条目（不含原始文件本身）。原始文件可逐份从详情页下载。</div>' +
          '</section>';
        html += '<section class="card"><div class="card-title">☁️ 云端同步</div>' +
          '<div class="muted small">第二阶段将接入 Supabase：邮箱登录后多设备同步、云端备份、断网续传。当前阶段所有数据仅保存在本机浏览器，请勿清理浏览器站点数据。</div>' +
          '</section>';
        html += '<section class="card"><div class="card-title">🗑 数据管理</div>' +
          '<button class="btn btn-mini" data-action="lib:wipe">清空资料库（不影响教材学习进度）</button>' +
          '<div class="muted small" style="margin-top:8px">仅删除「我的资料库」数据；单词掌握、错题本、学习进度等不受影响。</div>' +
          '</section>';
        return html;
      });
    });
  }

  /* ---------- 视图对象 ----------
     与现有同步渲染契约兼容：render() 同步返回缓存 HTML（首次为加载占位），
     同时异步构建并回写缓存后触发重渲染。 */

  var LibUI = { cache: {}, building: {}, lastKey: '' };

  function buildHtml(route, id) {
    var p;
    if (route === 'libraryUpload') p = Promise.resolve(renderUpload());
    else if (route === 'libraryDetail') p = renderDetail(id);
    else if (route === 'libraryReview') p = renderReview(id);
    else if (route === 'librarySettings') p = renderSettings();
    else p = renderList();
    return p.catch(function (e) {
      return '<div class="card">资料库渲染出错：' + esc(String(e.message || e)) +
        '<br><button class="btn btn-mini" style="margin-top:8px" data-action="lib:tab" data-tab="">返回列表</button></div>';
    });
  }

  var LibraryView = {
    render: function () {
      var key = App.route + '|' + (App.state.libraryId || '');
      /* 页面切换（key 变化）时旧 key 缓存全部失效，保证列表/详情回到最新数据 */
      if (LibUI.lastKey !== key) {
        LibUI.lastKey = key;
        LibUI.cache = {};
      }
      if (!LibUI.cache[key] && !LibUI.building[key]) {
        LibUI.building[key] = true;
        buildHtml(App.route, App.state.libraryId).then(function (html) {
          LibUI.cache[key] = html;
          LibUI.building[key] = false;
          /* 构建完成后当前仍在本页则刷新展示 */
          if (LibUI.lastKey === key) {
            try { App.rerender(); } catch (e) { /* 忽略 */ }
          }
        });
      }
      return LibUI.cache[key] || '<div class="card">📚 资料库加载中…</div>';
    },

    after: function () {
      /* 上传页：文件选择 + 拖拽 */
      var drop = document.getElementById('lib-drop');
      var input = document.getElementById('lib-file');
      if (drop && input) {
        input.addEventListener('change', function () {
          if (input.files && input.files.length) uploadFiles(input.files);
          input.value = '';
        });
        drop.addEventListener('click', function () { input.click(); });
        ['dragover', 'dragenter'].forEach(function (ev) {
          drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('dragging'); });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
          drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('dragging'); });
        });
        drop.addEventListener('drop', function (e) {
          if (e.dataTransfer && e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        });
      }
      /* 列表搜索框回车 */
      var search = document.getElementById('lib-search');
      if (search) {
        search.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            setState({ q: search.value.trim() });
            refreshLib();
          }
        });
      }
    },

    actions: {
      /* 数据变更后让对应缓存失效（下次渲染重建） */
      _invalidate: function (key) {
        if (key) delete LibUI.cache[key];
        else LibUI.cache = {};
      },
      'lib:tab': function (d) {
        if (d.tab) location.hash = '#/library/' + d.tab;
        else location.hash = '#/library';
      },
      'lib:searchInput': function () { /* 回车后处理，见 after() */ },
      'lib:catChange': function (d, el) {
        setState({ filter: el.value });
        refreshLib();
      },
      'lib:open': function (d) {
        location.hash = '#/library/detail/' + d.id;
      },
      'lib:parse': function (d) {
        LibDB.get('materials', d.id).then(function (m) {
          if (m) parseMaterial(m.id, m.type);
        });
      },
      'lib:del': function (d) {
        if (!window.confirm('确定删除该资料吗？（解析条目一并删除；云端同步第二阶段开放后，删除也会同步）')) return;
        LibDB.deleteMaterial(d.id).then(function () {
          Util.toast('已删除');
          if (location.hash.indexOf(d.id) >= 0) location.hash = '#/library';
          else refreshLib();
        });
      },
      'lib:preview': function (d) {
        LibDB.getFile(d.id).then(function (f) {
          if (!f) { Util.toast('原始文件丢失', 'warn'); return; }
          clearPreview();
          state().previewUrl = URL.createObjectURL(f.blob);
          refreshLib();
        });
      },
      'lib:setCat': function (d, el) {
        LibDB.get('materials', d.id).then(function (m) {
          if (!m) return;
          m.category = el.value;
          return LibDB.put('materials', m);
        }).then(function () { LibUI.cache = {}; Util.toast('分类已更新'); });
      },
      'lib:export': function (d) {
        LibDB.itemsOf(d.id).then(function (items) {
          var blob = new Blob([JSON.stringify({ items: items }, null, 1)], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = '资料条目-' + d.id.slice(0, 8) + '.json';
          document.body.appendChild(a); a.click();
          setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
        });
      },
      'lib:reviewTab': function (d) {
        location.hash = '#/library/review/' + d.id;
      },
      'lib:checkAll': function () {
        document.querySelectorAll('.lib-ck').forEach(function (c) { c.checked = true; });
      },
      'lib:uncheckAll': function () {
        document.querySelectorAll('.lib-ck').forEach(function (c) { c.checked = false; });
      },
      'lib:delItem': function (d) {
        LibDB.delete('extracted_items', d.id).then(function () { refreshLib(); });
      },
      'lib:confirmImport': function (d) {
        var rows = Array.prototype.slice.call(document.querySelectorAll('.lib-review-item'));
        var chosen = rows.filter(function (r) { return r.querySelector('.lib-ck').checked; })
          .map(function (r) { return { id: r.getAttribute('data-item'), raw: r.querySelector('[data-role=raw]').value.trim() }; });
        if (!chosen.length) { Util.toast('请先勾选要导入的条目', 'warn'); return; }
        Promise.all(chosen.map(function (c) {
          return LibDB.get('extracted_items', c.id).then(function (it) {
            if (!it) return;
            it.raw = c.raw || it.raw;
            it.pending = false;      // 审核通过
            it.updated_at = LibDB.now();
            it.version = (it.version || 1) + 1;
            return LibDB.put('extracted_items', it);
          });
        })).then(function () {
          return LibDB.get('materials', d.id).then(function (m) {
            if (m) { m.status = 'imported'; return LibDB.put('materials', m); }
          });
        }).then(function () {
          Util.toast('已确认导入 ' + chosen.length + ' 条（内容生成与学习集成将在第四阶段开放）');
          LibUI.cache = {};
          location.hash = '#/library/detail/' + d.id;
        });
      },
      'lib:exportAll': function () {
        Promise.all([LibDB.all('materials'), LibDB.all('extracted_items')]).then(function (rs) {
          var blob = new Blob([JSON.stringify({ exported_at: LibDB.now(), materials: rs[0], items: rs[1] }, null, 1)], { type: 'application/json' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = '资料库备份-' + LibDB.now().slice(0, 10) + '.json';
          document.body.appendChild(a); a.click();
          setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
        });
      },
      'lib:wipe': function () {
        if (!window.confirm('确定清空资料库全部数据吗？此操作不可恢复（不影响教材学习进度）。')) return;
        Promise.all(['materials', 'files', 'parse_jobs', 'extracted_items', 'custom_courses', 'sync_queue'].map(function (s) {
          return LibDB.all(s).then(function (l) {
            return Promise.all(l.map(function (x) { return LibDB.delete(s, x.id || x.material_id); }));
          });
        })).then(function () {
          Util.toast('资料库已清空');
          refreshLib();
        });
      }
    }
  };

  global.LibraryView = LibraryView;
})(window);
