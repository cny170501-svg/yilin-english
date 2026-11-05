/* 我的资料库 · 浏览器端文件解析器（V3.0 第一阶段）
   支持：PDF(pdf.js 文本层) / DOCX(mammoth) / XLSX·XLS(SheetJS) / 图片(元信息+提示)
   - 扫描版 PDF（无文本层）和图片 OCR 属第三阶段（需云端 AI），此处标记 needs_ocr
   - 旧版 .doc 二进制格式无法浏览器解析：仅存储，明确提示
   - 不支持的格式明确报错，不静默失败 */
(function (global) {
  'use strict';

  var Parsers = {
    /* 类型识别 */
    detect: function (name, mime) {
      var ext = (name.split('.').pop() || '').toLowerCase();
      if (ext === 'pdf' || mime === 'application/pdf') return 'pdf';
      if (ext === 'docx') return 'docx';
      if (ext === 'doc') return 'doc';
      if (ext === 'xlsx' || ext === 'xls' || mime.indexOf('sheet') >= 0 || mime.indexOf('excel') >= 0) return ext;
      if (['jpg', 'jpeg'].indexOf(ext) >= 0 || mime === 'image/jpeg') return 'image';
      if (ext === 'png' || mime === 'image/png') return 'image';
      if (ext === 'webp' || mime === 'image/webp') return 'image';
      return null;
    },

    supportedMime: function () {
      return [
        'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel',
        'image/jpeg', 'image/png', 'image/webp'
      ];
    },

    unsupportedReason: function (name) {
      var ext = (name.split('.').pop() || '').toLowerCase();
      return '不支持的文件格式「.' + ext + '」。当前支持：PDF / DOCX / XLSX / XLS / JPG / PNG / WEBP' +
        '（旧版 .doc 仅保存不解析；扫描件与图片的 OCR 将在第三阶段开放）。';
    },

    /* 统一入口 → { items: [{item_type, raw, section, page, confidence}], page_count, needs_ocr, error } */
    parse: function (file, type, onProgress) {
      var self = this;
      onProgress = onProgress || function () { };
      if (type === 'pdf') return self.parsePdf(file, onProgress);
      if (type === 'docx') return self.parseDocx(file, onProgress);
      if (type === 'xlsx' || type === 'xls') return self.parseXlsx(file, onProgress);
      if (type === 'image') {
        return Promise.resolve({
          items: [], page_count: 1, needs_ocr: true,
          note: '图片已保存。文字识别（OCR）将在第三阶段开放：AI 自动识别图中文字并整理。'
        });
      }
      if (type === 'doc') {
        return Promise.resolve({
          items: [], page_count: null, needs_ocr: false,
          note: '旧版 .doc 格式仅支持保存，无法在浏览器中提取文字。建议另存为 .docx 后重新上传。'
        });
      }
      return Promise.reject(new Error(self.unsupportedReason(file.name)));
    },

    /* ---------- PDF：pdf.js 提取文本层 ---------- */
    parsePdf: function (file, onProgress) {
      if (!global.pdfjsLib) return Promise.reject(new Error('PDF 解析库未加载'));
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';
      var buf = null;
      return file.arrayBuffer().then(function (ab) {
        buf = ab;
        return pdfjsLib.getDocument({ data: buf }).promise;
      }).then(function (pdf) {
        var pageCount = pdf.numPages;
        var items = [];
        var needsOcr = false;
        var seq = 0;

        function nextPage(pno) {
          if (pno > pageCount) {
            return { items: items, page_count: pageCount, needs_ocr: needsOcr };
          }
          onProgress(Math.round(pno * 100 / pageCount));
          return pdf.getPage(pno).then(function (page) {
            return page.getTextContent();
          }).then(function (tc) {
            /* 同页拼接文本，按启发式分行 */
            var lines = [];
            var cur = '';
            var lastY = null;
            tc.items.forEach(function (it) {
              if (!it.str) return;
              var y = it.transform[5];
              if (lastY !== null && Math.abs(y - lastY) > 4) {
                if (cur.trim()) lines.push(cur.trim());
                cur = it.str;
              } else {
                cur += it.str;
              }
              lastY = y;
            });
            if (cur.trim()) lines.push(cur.trim());
            var text = lines.join('\n');
            if (!text.trim() && pno === 1) needsOcr = true;
            /* 空行过滤 + 页码记录 */
            lines.forEach(function (ln) {
              if (ln.length < 1) return;
              seq++;
              items.push({
                item_type: 'other',
                raw: ln,
                section: '第' + pno + '页',
                page: pno,
                confidence: 1
              });
            });
            return nextPage(pno + 1);
          });
        }
        return nextPage(1);
      });
    },

    /* ---------- DOCX：mammoth 转 HTML → 条目 ---------- */
    parseDocx: function (file, onProgress) {
      if (!global.mammoth) return Promise.reject(new Error('DOCX 解析库未加载'));
      onProgress(10);
      return file.arrayBuffer().then(function (ab) {
        return mammoth.convertToHtml({ arrayBuffer: ab });
      }).then(function (res) {
        onProgress(70);
        var div = document.createElement('div');
        div.innerHTML = res.value || '';
        var items = [];
        var tables = [];
        /* 表格单独保留结构 */
        Array.prototype.forEach.call(div.querySelectorAll('table'), function (tb, ti) {
          var rows = [];
          Array.prototype.forEach.call(tb.rows, function (tr) {
            var cells = Array.prototype.map.call(tr.cells, function (td) { return td.textContent.trim(); });
            rows.push(cells);
          });
          if (rows.length) tables.push(rows);
        });
        /* 去掉表格后再取段落 */
        Array.prototype.forEach.call(div.querySelectorAll('table'), function (tb) { tb.remove(); });
        Array.prototype.forEach.call(div.querySelectorAll('p,li,h1,h2,h3,h4'), function (p) {
          var t = (p.textContent || '').trim();
          if (!t) return;
          var tag = p.tagName.toLowerCase();
          var it = { item_type: 'other', raw: t, section: tag === 'li' ? '列表' : (tag.charAt(0) === 'h' ? '标题' : ''), page: null, confidence: 1 };
          if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') it.item_type = 'heading';
          items.push(it);
        });
        onProgress(100);
        return { items: items, tables: tables, page_count: null, needs_ocr: false };
      });
    },

    /* ---------- XLSX / XLS：SheetJS 逐 sheet 逐行 ---------- */
    parseXlsx: function (file, onProgress) {
      if (!global.XLSX) return Promise.reject(new Error('表格解析库未加载'));
      onProgress(20);
      return file.arrayBuffer().then(function (ab) {
        var wb = XLSX.read(ab, { type: 'array' });
        var items = [];
        var tables = [];
        wb.SheetNames.forEach(function (sn) {
          var ws = wb.Sheets[sn];
          if (!ws) return;
          var aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });
          if (!aoa.length) return;
          tables.push({ sheet: sn, rows: aoa });
          aoa.forEach(function (row, ri) {
            var line = row.map(function (c) { return String(c).trim(); }).filter(Boolean).join(' | ');
            if (!line) return;
            items.push({
              item_type: 'other',
              raw: line,
              section: '工作表「' + sn + '」第' + (ri + 1) + '行',
              page: null,
              confidence: 1
            });
          });
        });
        onProgress(100);
        return { items: items, tables: tables, page_count: null, needs_ocr: false };
      });
    }
  };

  global.LibParsers = Parsers;
})(window);
