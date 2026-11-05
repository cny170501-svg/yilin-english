/* 我的资料库 · IndexedDB 存储层（V3.0 第一阶段）
   本地优先架构：所有资料数据/原始文件/解析任务/提取条目/同步队列存 IndexedDB。
   数据模型与云端 PostgreSQL 设计一致（见 docs/ARCHITECTURE.md），Phase2 无缝映射。
   通用字段：id(uuid) / created_at / updated_at / version / deleted(墓碑) */
(function (global) {
  'use strict';

  var DB_NAME = 'yilin-library';
  var DB_VERSION = 1;
  var STORES = ['materials', 'files', 'parse_jobs', 'extracted_items', 'custom_courses', 'sync_queue'];

  var LibDB = {
    _db: null,

    open: function () {
      var self = this;
      if (this._db) return Promise.resolve(this._db);
      return new Promise(function (resolve, reject) {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
          var db = e.target.result;
          if (!db.objectStoreNames.contains('materials')) {
            var s = db.createObjectStore('materials', { keyPath: 'id' });
            s.createIndex('status', 'status');
            s.createIndex('created_at', 'created_at');
            s.createIndex('sha256', 'sha256');
            s.createIndex('category', 'category');
          }
          if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files', { keyPath: 'material_id' });
          }
          if (!db.objectStoreNames.contains('parse_jobs')) {
            var pj = db.createObjectStore('parse_jobs', { keyPath: 'id' });
            pj.createIndex('material_id', 'material_id');
            pj.createIndex('status', 'status');
          }
          if (!db.objectStoreNames.contains('extracted_items')) {
            var ei = db.createObjectStore('extracted_items', { keyPath: 'id' });
            ei.createIndex('material_id', 'material_id');
            ei.createIndex('pending', 'pending');
          }
          if (!db.objectStoreNames.contains('custom_courses')) {
            db.createObjectStore('custom_courses', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('sync_queue')) {
            var sq = db.createObjectStore('sync_queue', { keyPath: 'id' });
            sq.createIndex('table', 'table');
          }
        };
        req.onsuccess = function () {
          self._db = req.result;
          resolve(self._db);
        };
        req.onerror = function () { reject(req.error); };
      });
    },

    _tx: function (store, mode) {
      var self = this;
      return this.open().then(function (db) {
        return db.transaction(store, mode).objectStore(store);
      });
    },

    uid: function () {
      if (global.crypto && crypto.randomUUID) return crypto.randomUUID();
      return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    },

    now: function () { return new Date().toISOString(); },

    /* ---------- 通用 CRUD ---------- */
    put: function (store, obj) {
      obj.updated_at = this.now();
      return this._tx(store, 'readwrite').then(function (os) {
        return new Promise(function (resolve, reject) {
          var r = os.put(obj);
          r.onsuccess = function () { resolve(obj); };
          r.onerror = function () { reject(r.error); };
        });
      });
    },

    get: function (store, id) {
      return this._tx(store, 'readonly').then(function (os) {
        return new Promise(function (resolve, reject) {
          var r = os.get(id);
          r.onsuccess = function () { resolve(r.result || null); };
          r.onerror = function () { reject(r.error); };
        });
      });
    },

    all: function (store) {
      return this._tx(store, 'readonly').then(function (os) {
        return new Promise(function (resolve, reject) {
          var r = os.getAll();
          r.onsuccess = function () { resolve(r.result || []); };
          r.onerror = function () { reject(r.error); };
        });
      });
    },

    delete: function (store, id) {
      return this._tx(store, 'readwrite').then(function (os) {
        return new Promise(function (resolve, reject) {
          var r = os.delete(id);
          r.onsuccess = function () { resolve(); };
          r.onerror = function () { reject(r.error); };
        });
      });
    },

    /* ---------- 资料业务方法 ---------- */

    /* 新增资料（含原始文件 Blob）。重复检测：sha256 相同且未删除 → 返回已有记录 */
    addMaterial: function (meta, blob) {
      var self = this;
      return this.all('materials').then(function (list) {
        var dup = null;
        for (var i = 0; i < list.length; i++) {
          if (!list[i].deleted && list[i].sha256 === meta.sha256) { dup = list[i]; break; }
        }
        if (dup) return { duplicate: true, material: dup };
        var now = self.now();
        var m = {
          id: self.uid(),
          title: meta.title || '未命名资料',
          type: meta.type,             // pdf | docx | doc | xlsx | xls | image
          mime: meta.mime || '',
          size: meta.size || 0,
          sha256: meta.sha256 || '',
          category: meta.category || '未分类',
          subject: meta.subject || '英语',
          grade: meta.grade || '',
          unit_hint: meta.unit_hint || '',
          page_count: meta.page_count || null,
          status: 'uploaded',          // uploaded|parsing|parsed|needs_review|imported|failed
          parse_error: '',
          version: 1,
          created_at: now,
          updated_at: now,
          deleted: false
        };
        return self.put('materials', m).then(function () {
          return self.put('files', { material_id: m.id, blob: blob, name: meta.title, mime: m.mime });
        }).then(function () {
          return { duplicate: false, material: m };
        });
      });
    },

    getFile: function (materialId) {
      return this.get('files', materialId);
    },

    /* 墓碑删除：标记 deleted 并入同步队列（Phase2 推云端） */
    deleteMaterial: function (id) {
      var self = this;
      return this.get('materials', id).then(function (m) {
        if (!m) return;
        m.deleted = true;
        return self.put('materials', m).then(function () {
          return self.get('files', id);
        }).then(function (f) {
          if (f) return self.delete('files', id);
        }).then(function () {
          return self.enqueueSync('materials', id, 'delete');
        });
      });
    },

    /* ---------- 解析任务 ---------- */
    createJob: function (materialId, kind) {
      var j = {
        id: this.uid(),
        material_id: materialId,
        kind: kind,                  // extract | ocr | ai_classify
        status: 'pending',
        progress: 0,
        error: '',
        result: null,
        created_at: this.now(),
        updated_at: this.now()
      };
      return this.put('parse_jobs', j).then(function () { return j; });
    },

    jobsOf: function (materialId) {
      return this.all('parse_jobs').then(function (list) {
        return list.filter(function (j) { return j.material_id === materialId; })
          .sort(function (a, b) { return a.created_at < b.created_at ? -1 : 1; });
      });
    },

    /* ---------- 提取条目 ---------- */
    addItems: function (materialId, jobId, items) {
      var self = this;
      return this.all('extracted_items').then(function (existing) {
        var byRaw = {};
        existing.forEach(function (it) {
          if (it.material_id === materialId && !it.deleted) byRaw[it.item_type + '|' + it.raw] = 1;
        });
        var seq = existing.length;
        return Promise.all(items.map(function (it) {
          var key = it.item_type + '|' + it.raw;
          if (byRaw[key]) return null; // 同资料内去重
          byRaw[key] = 1;
          var rec = {
            id: self.uid(),
            material_id: materialId,
            job_id: jobId,
            item_type: it.item_type,   // word|sentence|dialog_line|grammar_point|question|sound_rule|other
            raw: it.raw,
            page: it.page || null,
            section: it.section || '',
            confidence: it.confidence != null ? it.confidence : 1,
            pending: true,             // 审核通过前一律 pending
            payload: it.payload || {},
            version: 1,
            created_at: self.now(),
            updated_at: self.now(),
            deleted: false
          };
          return self.put('extracted_items', rec);
        }));
      }).then(function () { return; });
    },

    itemsOf: function (materialId) {
      return this.all('extracted_items').then(function (list) {
        return list.filter(function (it) { return it.material_id === materialId && !it.deleted; });
      });
    },

    /* ---------- 同步队列（Phase2 消费） ---------- */
    enqueueSync: function (table, recordId, op) {
      return this.put('sync_queue', {
        id: this.uid(),
        table: table,
        record_id: recordId,
        op: op,
        attempts: 0,
        created_at: this.now()
      });
    },

    pendingSyncCount: function () {
      return this.all('sync_queue').then(function (l) { return l.length; });
    }
  };

  global.LibDB = LibDB;
})(window);
