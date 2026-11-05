# 个人智能学习平台 · 架构设计（V3.0 升级）

> 目标：在不动现有 GitHub Pages 静态站的前提下，加入「自主资料上传 → AI 解析 → 人工审核 → 生成学习内容 → 本地离线 + 云端多设备同步」体系。
> 分六阶段实施，每阶段独立交付与测试，本文件是总设计基准。

## 1. 系统架构图

```
┌─────────────────────────── 客户端（现有 GitHub Pages，无重建）───────────────────────────┐
│  现有学习站（Unit1-8 / 练习 / 阅读 / 语音包910条）  +  新增「我的资料库」模块            │
│                                              js/views/library.js（列表/上传/详情/审核） │
│  js/lib/idb.js ── IndexedDB（本地优先存储）                                             │
│  js/lib/parsers.js ── 浏览器端解析：PDF.js(pdf) / mammoth(docx) / SheetJS(xlsx) / 图片  │
└───────────────┬──────────────────────────────┬────────────────────────────────────────┘
                │ (仅匿名 key + 用户 JWT)      │ 原始文件 Blob 上传
                ▼                              ▼
┌─────────────────────────── Supabase（免费层，用户自建账号）──────────────────────────────┐
│  Auth（邮箱魔法链接登录）   PostgreSQL（表结构=本地模型的超集，行级安全 RLS 仅本人可读写）│
│  Storage（原始文件桶，私有）  Edge Functions（AI 代理：持火山引擎密钥，前端永不接触）    │
└───────────────┬────────────────────────────────────────────────────────────────────────┘
                ▼
┌─────────────────────────── AI 服务（火山引擎，复用现有账号）─────────────────────────────┐
│  视觉模型：图片/扫描页 OCR + 结构化提取（一次调用完成）                                  │
│  TTS（豆包语音合成 2.0 / Tina老师2.0）：新内容音频生成，存入 Storage，绝不回退 Web Speech │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**安全边界**（硬约束）：
- 前端只出现 Supabase 匿名 key（配合 RLS，这是官方设计用法，非机密）；service key、AI key 只存 Edge Function 环境变量，不进仓库不进前端。
- 原始文件桶私有，仅登录本人经 RLS 策略访问；不公开任何用户资料。
- AI 识别结果必须经人工审核页确认才进入正式学习内容（`extracted_items.pending=true` 直到确认）。

## 2. 数据模型（IndexedDB 现行 = PostgreSQL 未来超集）

所有表通用字段：`id(uuid)`、`version(int)`、`created_at`、`updated_at`、`deleted(bool, 墓碑)`。

| 表 | 关键字段 | 说明 |
|---|---|---|
| materials | title, type(pdf/docx/xlsx/image), category(教材/单词表/课文/对话/语法/发音/试卷/练习/错题/其他/未分类), subject, grade, unit_hint, size, sha256, status(uploaded/parsing/parsed/needs_review/imported/failed), page_count | 资料主档；sha256 做重复检测 |
| material_files | material_id, blob, name, mime | 本地存原始文件 Blob（云端对应 Storage 对象） |
| parse_jobs | material_id, kind(extract/ocr/ai_classify), status(pending/running/done/failed), progress, error, result | 解析任务流水，可断点重试 |
| extracted_items | material_id, job_id, item_type(word/sentence/dialog_line/grammar_point/question/sound_rule/other), raw(原文), page, section, confidence, pending, payload{en,zh,unit,answers...} | AI/解析产出，审核通过前 pending |
| custom_courses / custom_units | 自定义课程与单元 | 与内置教材隔离，不覆盖 Unit1-8 |
| sync_queue | op(create/update/delete), table, record_id, payload, attempts | 离线待同步队列 |
| study_records | （沿用现有 Store 学习数据结构，Phase2 映射上云） | |

追溯要求：每条 extracted_item 保留 `material_id + page + section`，可回溯到原始资料与页码。

## 3. 同步机制（本地优先）

- 读路径：IndexedDB 为主，页面永不阻塞等网络。
- 写路径：本地写 → 记 sync_queue → 联网时由同步器推云端；云端变更按 `updated_at` LWW（最后写入胜）+ 墓碑删除同步回本地。
- 冲突：同一条记录双端修改时，保留 `updated_at` 较新者，旧版本存入 `sync_records` 供人工找回（不静默丢数据）。
- 断网：上传进离线队列（文件 Blob 已在 IndexedDB），网络恢复自动续传；已缓存资料可离线学习。
- 浏览器清缓存只清 IndexedDB，云端数据不受影响，重新登录即拉回。

## 4. 解析流水线

```
上传 → 类型识别 → 内容提取(pdf.js/mammoth/SheetJS)
      → [图片或扫描页] OCR+结构化（Edge Function → 豆包视觉模型）
      → AI 分类整理（同一次视觉调用完成，输出 JSON）
      → 人工审核页（原文对照/置信度/逐条编辑/批量确认）
      → 确认导入 custom_courses → 生成学习内容 + 进入 TTS 音频队列
```

- 教材原文不允许 AI 改写；低置信度一律标 `pending` 待确认。
- 旧版 .doc 等无法浏览器解析的格式：明确提示「仅存储、无法解析」，不静默失败。

## 5. 语音集成

新内容文本 → `audio_jobs` 队列 → Edge Function 调豆包 TTS（Tina老师2.0）→ mp3 存 Supabase Storage → 前端 Speaker 按现有 manifest 机制扩展加载。生成失败可重试；未出音频前点读按钮显示「音频生成中」提示，**不回退 Web Speech**（自定义英文内容）。现有 910 条语音包不动。

## 6. 阶段划分（每阶段独立交付报告）

| 阶段 | 内容 | 外部依赖 |
|---|---|---|
| 一（本次） | 本地上传/资料管理/浏览器端解析/IndexedDB | 无 |
| 二 | Supabase 注册建项目 + Auth + 数据库 + Storage + 表结构 + RLS | **需用户注册 supabase.com（免费）** |
| 三 | Edge Function + 豆包视觉 OCR/结构化 | 火山账号（已有，余额约 ¥8.8） |
| 四 | 审核页 + 内容生成 + 与学习模块集成 + TTS 队列 | 依赖二三 |
| 五 | 双向同步器 + 冲突处理 + 离线队列 | 依赖二 |
| 六 | 安全检查 + 备份导出 + 全量回归 | — |

## 7. 成本

- Supabase 免费层：500MB 数据库 + 1GB 文件存储 + 5 万月活，个人使用免费。
- AI：视觉解析约 ¥0.003-0.01/页；TTS ¥3/万字符（复用现有余额）。
- 无服务器月费；全部密钥在用户自己账号内。
