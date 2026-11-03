/* 单元知识点数据（V2.8 新增）
 *
 * 数据来源：五份 Word 知识点文件逐条录入（Unit 1 - Unit 5），Unit 6-8 无对应资料，不编造。
 * - 英文原文、中文解释、示例与口诀尽量完整保留；
 * - 原文疑似错字/排版错乱处保留原样并以 check: 1 标记（页面显示「待核对」）；
 * - 原文音标个别字符因格式丢失（显示为 ?），按通用读音补全（如 sure/share 的 /ʃ/）；
 * - Phrases 的学习要求来自原文虚线分界（会读会默 / 会读会翻译或知晓中文），逐条以 req 标记；
 * - 每条具有稳定 id，用于学习进度保存；数据与展示逻辑分离。
 */
(function (global) {
  "use strict";

  global.UNIT_KNOWLEDGE = {
    updatedAt: "2026-11-04",
    sourceNote: "知识点内容依据 Unit 1-5 Word 资料逐条录入；原文疑似错字处保留并标「待核对」；Unit 6-8 资料未提供，暂无内容。",
    units: {

      /* ================= Unit 1 Our school subjects ================= */
      u1: {
        title: "Our school subjects",
        sounds: {
          intro: "字母 s 的发音规则",
          rules: [
            { id: "u1-sd-1", letter: "s（词首）", phonetic: "/s/", rule: "s 在开头一般发 /s/", examples: ["subject", "school", "small"], special: "特殊：sure /ʃ/、share /ʃ/", tip: "" },
            { id: "u1-sd-2", letter: "s（两元音之间）", phonetic: "/z/", rule: "s 夹在两个元音字母间一般发 /z/", examples: ["Music", "Chinese", "these", "those", "nose"], special: "特殊：mouse /s/", tip: "s在开头 /s/ /s/ 响，夹在两元 /z/ /z/ 唱" }
          ]
        },
        phrasesReq: "原文学习要求：虚线上方会读会默；虚线下方会读会翻译。",
        phrases: [
          { id: "u1-ph-1", en: "our school subjects", zh: "我们的学校课程", req: "write" },
          { id: "u1-ph-2", en: "like Music best", zh: "最喜欢音乐", req: "write" },
          { id: "u1-ph-3", en: "also like Science", zh: "也喜欢科学", req: "write" },
          { id: "u1-ph-4", en: "welcome back to...", zh: "欢迎回到...", req: "write" },
          { id: "u1-ph-5", en: "be good at Maths", zh: "擅长数学", req: "write" },
          { id: "u1-ph-6", en: "time for Chinese", zh: "该上语文课", req: "write" },
          { id: "u1-ph-7", en: "read English stories", zh: "读英语故事", req: "write" },
          { id: "u1-ph-8", en: "want to learn", zh: "想要学习", req: "write" },
          { id: "u1-ph-9", en: "have many subjects at school", zh: "在学校有许多课程", req: "write" },
          { id: "u1-ph-10", en: "come to school", zh: "来到学校", req: "write" },
          { id: "u1-ph-11", en: "PE and Art", zh: "科学（课）和美术（课）", req: "write", check: 1 },
          { id: "u1-ph-12", en: "an English story", zh: "一个英语故事", req: "write" },
          { id: "u1-ph-13", en: "learn about", zh: "学习关于....", req: "write" },
          { id: "u1-ph-14", en: "new term", zh: "新学期", req: "write" },
          { id: "u1-ph-15", en: "new start", zh: "新开始", req: "write" },
          { id: "u1-ph-16", en: "Ethics and the Rule of Law", zh: "道德与法治", req: "read" },
          { id: "u1-ph-17", en: "like Labour", zh: "喜欢劳动课", req: "read" },
          { id: "u1-ph-18", en: "learn with me", zh: "和我一起学习", req: "read" },
          { id: "u1-ph-19", en: "go to the sports ground", zh: "去操场", req: "read" },
          { id: "u1-ph-20", en: "my favourite subject", zh: "我最喜欢的学科", req: "read" },
          { id: "u1-ph-21", en: "look for", zh: "寻找", req: "read" },
          { id: "u1-ph-22", en: "an Art teacher", zh: "一个美术老师", req: "read" },
          { id: "u1-ph-23", en: "what I love to do", zh: "我爱做的事", req: "read" },
          { id: "u1-ph-24", en: "want to learn about Chinese culture", zh: "想要学习中国文化", req: "read" },
          { id: "u1-ph-25", en: "an interesting subject", zh: "一个有趣的学科", req: "read" }
        ],
        sentences: [
          { id: "u1-sn-1", en: "--What subject do you like best? --I like Music best.", zh: "--你最喜欢什么科目？ --我最喜欢音乐。" },
          { id: "u1-sn-2", en: "--It's time for IT. / It's time to have IT. --Let's go!", zh: "--上信息技术课的时间到了。 --走吧！" },
          { id: "u1-sn-3", en: "Welcome back to school, class.", zh: "同学们，欢迎回到学校。" },
          { id: "u1-sn-4", en: "We have Chinese, Maths, English and Science.", zh: "我们有语文、数学、英语和科学课。" },
          { id: "u1-sn-5", en: "We also have Art, PE and Music.", zh: "我们也有美术、体育和音乐课。" },
          { id: "u1-sn-6", en: "I like Maths. I'm good at it.", zh: "我喜欢数学。我擅长它。" },
          { id: "u1-sn-7", en: "I like Science best. It's interesting.", zh: "我最喜欢科学。它很有趣。" },
          { id: "u1-sn-8", en: "We all like reading English stories.", zh: "我们都喜欢读英语故事。" },
          { id: "u1-sn-9", en: "Art and Science are fun to learn.", zh: "美术和科学学得很有趣。" },
          { id: "u1-sn-10", en: "I work hard at school.", zh: "我在学校努力学习。" },
          { id: "u1-sn-11", en: "All the subjects make me smart.", zh: "所有的学科使我聪明。" },
          { id: "u1-sn-12", en: "What do you learn at school?", zh: "你在学校里学什么？" }
        ],
        grammar: [
          {
            id: "u1-gr-1", title: "表达「最喜欢」的两种说法",
            blocks: [
              { type: "text", text: "① like...best　② my favourite...is..." },
              { type: "examples", items: [{ en: "I like English best.", zh: "我最喜欢英语。" }, { en: "My favourite subject is English.", zh: "我最喜欢的学科是英语。" }] },
              { type: "tip", text: "注意：「最」一般只有一个。" }
            ]
          },
          {
            id: "u1-gr-2", title: "It's time for 与 It's time to",
            blocks: [
              { type: "formula", text: "It's time for + 名词 = It's time to + 动词" },
              { type: "text", text: "译为「做某事的时间到了。」" },
              { type: "examples", items: [{ en: "It's time for PE.", zh: "到上体育课的时间了。" }, { en: "It's time to have PE.", zh: "到上体育课的时间了。" }] }
            ]
          },
          {
            id: "u1-gr-3", title: "like + 动词ing 形式",
            blocks: [
              { type: "text", text: "like 后面是动词时，要变成 like + 动词ing形式，表示喜欢做某事。" },
              { type: "examples", items: [{ en: "I like reading.", zh: "我喜欢阅读。" }] }
            ]
          },
          {
            id: "u1-gr-4", title: "also 与 too 的用法区别",
            blocks: [
              { type: "text", text: "都译为「也」，但是 also 放在 be 动词/助动词之后，实义动词之前；too 一般放在句子末尾。" },
              { type: "examples", items: [{ en: "I like PE too.", zh: "我也喜欢体育。" }, { en: "I also like PE.", zh: "我也喜欢体育。" }] }
            ]
          },
          {
            id: "u1-gr-5", title: "all 全部，都",
            blocks: [
              { type: "text", text: "1. 放 be 动词后：We are all happy." },
              { type: "text", text: "2. 实义动词后：We all like PE." }
            ]
          }
        ],
        extra: [
          {
            id: "u1-ex-1", title: "多义词",
            blocks: [
              { type: "text", text: "mouse：①「老鼠」，复数为 mice；②「鼠标」，复数为 mouses" },
              { type: "text", text: "Chinese：①「语文、语文课」如：like Chinese　②「中国的」如：Chinese culture　③「中国人」如：a Chinese" }
            ]
          }
        ]
      },

      /* ================= Unit 2 My day ================= */
      u2: {
        title: "My day",
        sounds: {
          intro: "字母 c、ck 的发音规则",
          rules: [
            { id: "u2-sd-1", letter: "c", phonetic: "/k/", rule: "c 在开头与 a、u、o 或辅音字母相连，发 /k/", examples: ["come", "carry", "cat", "car", "class", "cake"], special: "", tip: "" },
            { id: "u2-sd-2", letter: "ck", phonetic: "/k/", rule: "ck 相连一般都发 /k/", examples: ["clock", "tick-tock", "duck", "black"], special: "", tip: "" },
            { id: "u2-sd-3", letter: "ch", phonetic: "/tʃ/", rule: "ch 开头特殊记，发 /tʃ/", examples: ["chair", "Chinese"], special: "", tip: "" },
            { id: "u2-sd-4", letter: "c（遇 e, i, y）", phonetic: "/s/", rule: "c 遇 e、i、y 基本都发 /s/", examples: ["face", "Science", "pencil"], special: "", tip: "" }
          ],
          outro: "口诀：c 遇 a o u 辅都发 /k/；ck 相连都发 /k/；ch 发 /tʃ/ 特殊记"
        },
        phrasesReq: "原文学习要求：虚线上方会读会默；虚线下方会读会翻译。",
        phrases: [
          { id: "u2-ph-1", en: "my day", zh: "我的一天", req: "write" },
          { id: "u2-ph-2", en: "get up", zh: "起床", req: "write" },
          { id: "u2-ph-3", en: "wash your face first", zh: "先洗你的脸", req: "write" },
          { id: "u2-ph-4", en: "have breakfast", zh: "吃早餐", req: "write" },
          { id: "u2-ph-5", en: "go to school", zh: "去学校", req: "write" },
          { id: "u2-ph-6", en: "have lessons", zh: "上课", req: "write" },
          { id: "u2-ph-7", en: "go and have lunch", zh: "去吃午餐", req: "write" },
          { id: "u2-ph-8", en: "go to bed", zh: "去睡觉", req: "write" },
          { id: "u2-ph-9", en: "time for class/bed/school/sport", zh: "该上课/上床/上学/运动了", req: "write" },
          { id: "u2-ph-10", en: "time to go / have lunch / have dinner", zh: "该走/吃午饭/吃晚饭了", req: "write" },
          { id: "u2-ph-11", en: "be coming", zh: "在来了", req: "write" },
          { id: "u2-ph-12", en: "what time", zh: "什么时间", req: "write" },
          { id: "u2-ph-13", en: "be late", zh: "迟到", req: "write" },
          { id: "u2-ph-14", en: "Bobby's day", zh: "波比的一天", req: "write" },
          { id: "u2-ph-15", en: "seven o'clock", zh: "七点钟整", req: "write" },
          { id: "u2-ph-16", en: "six fifteen", zh: "六点十五", req: "write" },
          { id: "u2-ph-17", en: "eleven twenty", zh: "十一点二十", req: "write" },
          { id: "u2-ph-18", en: "at eight thirty", zh: "在八点半", req: "write" },
          { id: "u2-ph-19", en: "come on", zh: "赶快", req: "write" },
          { id: "u2-ph-20", en: "go to the sports ground", zh: "去操场", req: "write" },
          { id: "u2-ph-21", en: "say hi / bye", zh: "说你好/再见", req: "write" },
          { id: "u2-ph-22", en: "every day", zh: "每天", req: "read" },
          { id: "u2-ph-23", en: "hurry up", zh: "快点", req: "read" },
          { id: "u2-ph-24", en: "come back home", zh: "回到家", req: "read" },
          { id: "u2-ph-25", en: "be slow", zh: "慢的", req: "read" },
          { id: "u2-ph-26", en: "be early", zh: "早的", req: "read" },
          { id: "u2-ph-27", en: "check your bag", zh: "检查你的包", req: "read" },
          { id: "u2-ph-28", en: "a busy morning", zh: "一个忙碌的早晨", req: "read" },
          { id: "u2-ph-29", en: "carry my ball", zh: "拿上我的球", req: "read" }
        ],
        sentences: [
          { id: "u2-sn-1", en: "--What time is it now? --It's twelve o'clock.", zh: "--现在几点了？ --现在十二点了。" },
          { id: "u2-sn-2", en: "It's three thirty. Let's go to the sports ground.", zh: "三点半了。让我们去操场吧。" },
          { id: "u2-sn-3", en: "It's time for breakfast. / It's time to have breakfast.", zh: "吃早餐的时间到了。" },
          { id: "u2-sn-4", en: "It's lunchtime. Let's go and have lunch.", zh: "午餐时间到了。让我们去吃午餐。" },
          { id: "u2-sn-5", en: "It's nine o'clock. It's time for bed.", zh: "九点了。睡觉时间到了。" },
          { id: "u2-sn-6", en: "All right, Mum and Dad. Good night!", zh: "好的，爸爸妈妈。晚安！" },
          { id: "u2-sn-7", en: "Wash your face first, Bobby.", zh: "先洗你的脸，波比。" },
          { id: "u2-sn-8", en: "I carry my ball and say bye.", zh: "我拿上我的球并说再见。" },
          { id: "u2-sn-9", en: "I come back home and say hi!", zh: "我回到家说你好！" },
          { id: "u2-sn-10", en: "Don't be slow.", zh: "不要慢吞吞的。" },
          { id: "u2-sn-11", en: "That's the rule.", zh: "那是规则。" },
          { id: "u2-sn-12", en: "I'm coming.", zh: "我来了。" }
        ],
        grammar: [
          {
            id: "u2-gr-1", title: "It's time for... 与 It's time to...",
            blocks: [
              { type: "text", text: "都表示「到做某事的时间了」，不同点在于：" },
              { type: "formula", text: "It's time for + 名词" },
              { type: "examples", items: [{ en: "It's time for school.", zh: "到上学的时间了。（名词）" }] },
              { type: "formula", text: "It's time to + 动词/动词词组" },
              { type: "examples", items: [{ en: "It's time to go to school.", zh: "到上学的时间了。（动词词组）" }] }
            ]
          },
          {
            id: "u2-gr-2", title: "subject、lesson、class 的区别",
            blocks: [
              { type: "text", text: "subject 指某一学科，例如：have eight subjects this term" },
              { type: "text", text: "lesson 指具体一节课或某一篇课文，例如：a Chinese lesson" },
              { type: "text", text: "class 指上课场景或班级群体，例如：in class" }
            ]
          }
        ],
        extra: [
          {
            id: "u2-ex-1", title: "数字规律",
            blocks: [
              { type: "text", text: "20 以内：① 1-12：无统一后缀，逐个记忆　② 十几（13 及以上）：+teen（易错：thirteen、fifteen、eighteen）" },
              { type: "text", text: "20 及以上：① 几十（20, 30...）：+ty（易错：twenty、thirty、forty、fifty、eighty）　② 非整十数要用连字符「－」，例如 twenty-five, thirty-eight" }
            ]
          },
          {
            id: "u2-ex-2", title: "询问时间与回答",
            blocks: [
              { type: "text", text: "询问时间用：What time is it?" },
              { type: "text", text: "回答：① It's + 数字 + o'clock.（适用于整点）　② It's + 时 + 分.（非整点）如：It's eight twenty. 8 点 20 分了。" },
              { type: "tip", text: "注意：英语时间表达默认以「12 小时制」，所以表示「时」的数字范围是 one 到 twelve。" }
            ]
          }
        ]
      },

      /* ================= Unit 3 My week ================= */
      u3: {
        title: "My week",
        sounds: {
          intro: "字母 w 的发音规则",
          rules: [
            { id: "u3-sd-1", letter: "w（词首）", phonetic: "/w/", rule: "w 在词首（后面跟着元音字母）发 /w/", examples: ["want", "wash", "window", "welcome", "would", "with"], special: "", tip: "" },
            { id: "u3-sd-2", letter: "wh", phonetic: "/w/", rule: "wh 后接字母 a、e、i、y 时通常发 /w/", examples: ["white", "where", "what", "when", "why"], special: "特殊：who、whose 发 /h/", tip: "" },
            { id: "u3-sd-3", letter: "wr- / 个别词", phonetic: "（w 不发音）", rule: "wr- 开头只读 /r/：如 write, wrong；two, answer（w 是「沉默的字母」）", examples: ["write", "wrong", "two", "answer"], special: "", tip: "w 大多发 /w/，wh 拉手一般发 /w/；唯有 wh 后跟 o，立刻改口 /h/" }
          ]
        },
        phrasesReq: "原文学习要求：虚线上方会读会默；虚线下方知晓中文意思。",
        phrases: [
          { id: "u3-ph-1", en: "what day", zh: "星期几", req: "write" },
          { id: "u3-ph-2", en: "my week", zh: "我的一周", req: "write" },
          { id: "u3-ph-3", en: "every week", zh: "每周", req: "write" },
          { id: "u3-ph-4", en: "every day", zh: "每天", req: "write" },
          { id: "u3-ph-5", en: "every Thursday and Sunday", zh: "每个周四和周日", req: "write" },
          { id: "u3-ph-6", en: "at nine o'clock", zh: "在九点钟", req: "write" },
          { id: "u3-ph-7", en: "at six thirty", zh: "在六点半", req: "write" },
          { id: "u3-ph-8", en: "on Wednesday", zh: "在周三", req: "write" },
          { id: "u3-ph-9", en: "on Tuesday and Friday", zh: "在周二和周五", req: "write" },
          { id: "u3-ph-10", en: "on Saturday", zh: "在周六", req: "write" },
          { id: "u3-ph-11", en: "after class", zh: "下课后", req: "write" },
          { id: "u3-ph-12", en: "after school", zh: "放学后", req: "write" },
          { id: "u3-ph-13", en: "get up at five", zh: "在五点起床", req: "write" },
          { id: "u3-ph-14", en: "have two Maths lessons", zh: "上/有两节数学课", req: "write" },
          { id: "u3-ph-15", en: "can't be late for school", zh: "上学不能迟到", req: "write" },
          { id: "u3-ph-16", en: "walk my dog", zh: "遛狗", req: "write" },
          { id: "u3-ph-17", en: "be up / get up / go to school early", zh: "起床/上学早（注意：be up-强调状态；get up-强调动作）", req: "write" },
          { id: "u3-ph-18", en: "a good idea", zh: "好主意", req: "write" },
          { id: "u3-ph-19", en: "go to the cinema", zh: "去电影院", req: "write" },
          { id: "u3-ph-20", en: "want to walk", zh: "想走路/散步", req: "write" },
          { id: "u3-ph-21", en: "have a dancing lesson", zh: "上/有一节舞蹈课", req: "write" },
          { id: "u3-ph-22", en: "what about...", zh: "……怎么样", req: "write" },
          { id: "u3-ph-23", en: "be free", zh: "有空", req: "write" },
          { id: "u3-ph-24", en: "and then", zh: "然后；接着", req: "write" },
          { id: "u3-ph-25", en: "next", zh: "紧接着；接下来", req: "write" },
          { id: "u3-ph-26", en: "watch TV", zh: "看电视", req: "read" },
          { id: "u3-ph-27", en: "watch a wonderful play", zh: "看一场精彩的戏剧", req: "read" },
          { id: "u3-ph-28", en: "seven days of a week", zh: "一周七天", req: "read" },
          { id: "u3-ph-29", en: "enjoy every single day", zh: "享受每一天", req: "read" },
          { id: "u3-ph-30", en: "plan your week", zh: "规划你的一周", req: "read" },
          { id: "u3-ph-31", en: "name days of a week", zh: "说出一周的日子", req: "read" },
          { id: "u3-ph-32", en: "a good planner", zh: "一个好的规划者", req: "read" },
          { id: "u3-ph-33", en: "make a weekly schedule", zh: "制作每周日程表", req: "read" },
          { id: "u3-ph-34", en: "make a plan for the week", zh: "制定一周的计划", req: "read" }
        ],
        sentences: [
          { id: "u3-sn-1", en: "How do you plan your week?", zh: "你如何规划你的一周？" },
          { id: "u3-sn-2", en: "--What day is it today? --It's Saturday.", zh: "--今天周几？ --今天周六。" },
          { id: "u3-sn-3", en: "--When do you get up every day? --I get up at five.", zh: "--你每天几点起床？ --我每天五点起床。" },
          { id: "u3-sn-4", en: "--When do you have dancing lessons? --I have dancing lessons on Wednesday and Friday.", zh: "--你什么时候上舞蹈课？ --我在周三和周五上舞蹈课。" },
          { id: "u3-sn-5", en: "--What about you? --I walk my dog on Tuesday and Friday.", zh: "--你呢？ --我周二和周五遛狗。" },
          { id: "u3-sn-6", en: "--What about tomorrow? --OK. I'm free on Saturday.", zh: "--明天怎么样？ --好的。我周六有空。" },
          { id: "u3-sn-7", en: "--What do you want to do on Wednesday? --We want to walk and watch a wonderful play!", zh: "--你们周三想干什么？ --我们想散步并看一场精彩的戏剧！" },
          { id: "u3-sn-8", en: "I enjoy every single day.", zh: "我享受每一天。" },
          { id: "u3-sn-9", en: "I can't be late for school again!", zh: "我上学不会再迟到了！" },
          { id: "u3-sn-10", en: "--You're up early today. --Yes, I want to go to school early.", zh: "--你今天起得这么早。 --是的，我想早早去上学。" },
          { id: "u3-sn-11", en: "It's Friday today. Let's go to the cinema after school.", zh: "今天周五。让我们放学后去电影院吧。" },
          { id: "u3-sn-12", en: "I have two dancing lessons every week.", zh: "我每周有两节舞蹈课。" },
          { id: "u3-sn-13", en: "See you tomorrow.", zh: "明天见。" }
        ],
        grammar: [
          {
            id: "u3-gr-1", title: "When 和 What day 的区别",
            blocks: [
              { type: "table", rows: [
                ["疑问词", "问什么", "问答句"],
                ["When", "问「什么时候」，范围很广（所问时间可以精确到几时几分，也可以扩大到哪一天/哪几天/哪个月/哪一年）", "—When do you get up every day? —I get up at seven."],
                ["What day", "只问星期几", "—What day is it today? —It's Monday. / It's Monday today."]
              ] }
            ]
          },
          {
            id: "u3-gr-2", title: "时间介词 at、in、on、every、after 的区别",
            blocks: [
              { type: "table", rows: [
                ["词", "用法", "例词例句"],
                ["at", "精确的时间点或 night、noon 等固定搭配", "at eight, at seven o'clock, at night, at noon"],
                ["in", "较长的时间段：上午/下午/晚上、月、季、年", "in the morning, in May（在五月）, in spring（在春天）, in 2026"],
                ["on", "具体的某一天或日期（也包括「某天的上午/下午」）", "on Monday, on May 1st（在5月1号）, on Monday morning / on Sunday afternoon"],
                ["every", "表示「每……」的频率", "every day, every week, every Monday"],
                ["after", "介词，「在……之后」", "after lunch, after school, after class"]
              ] },
              { type: "tip", text: "口诀：in 年 in 月 in 季节，还要加上早下晚。" }
            ]
          },
          {
            id: "u3-gr-3", title: "want 与 want to",
            blocks: [
              { type: "text", text: "want + 名词，表示想要某物。如：I want a book. 我想要一本书。" },
              { type: "text", text: "want to + 动词原形，表示想要做某事。如：I want to go to the cinema. 我想要去电影院。" },
              { type: "text", text: "同义替换（更礼貌）：would like 想要；用法也与 want 相同。" },
              { type: "examples", items: [{ en: "I would like an apple.", zh: "我想要一个苹果。（= I want an apple.）" }, { en: "I would like to walk my dog.", zh: "我想要去遛狗。（= I want to walk a dog. 原文如此）" }] }
            ]
          }
        ],
        extra: []
      },

      /* ================= Unit 4 I like sport ================= */
      u4: {
        title: "I like sport",
        sounds: {
          intro: "字母 a 的发音规则",
          rules: [
            { id: "u4-sd-1", letter: "a（闭音节）", phonetic: "/æ/", rule: "大口 /æ/（短音/闭音节，结构：辅+a+辅）", examples: ["cat", "bag", "Maths", "Saturday", "have"], special: "区分相似音：当 any 连在一起时，a 发小口 /e/：many 许多、any 任何", tip: "辅 a 辅，a 发 /æ/" },
            { id: "u4-sd-2", letter: "a_e", phonetic: "/eɪ/", rule: "叹气音，结构：a+辅+无声 e", examples: ["cake", "face", "make"], special: "特例：have /æ/、are /ɑ:/", tip: "a 加辅加无声 e，a 就连连叹气 /eɪ/" },
            { id: "u4-sd-3", letter: "a（非重读）", phonetic: "/ə/", rule: "打嗝音，非重读时 a 发 /ə/", examples: ["panda", "banana", "about", "again"], special: "", tip: "" },
            { id: "u4-sd-4", letter: "ar", phonetic: "/ɑ:/", rule: "ar 连一起，尖叫 /ɑ:/ 平地起", examples: ["are", "park", "car", "farm"], special: "少数发 /ɔ:/：warm", tip: "" }
          ]
        },
        phrasesReq: "原文学习要求：虚线上方会读会默；虚线下方知晓中文意思。",
        phrases: [
          { id: "u4-ph-1", en: "play basketball", zh: "打篮球", req: "write" },
          { id: "u4-ph-2", en: "play football", zh: "踢足球", req: "write" },
          { id: "u4-ph-3", en: "want to play ping-pong", zh: "想打乒乓球", req: "write" },
          { id: "u4-ph-4", en: "play with us", zh: "和我们一起玩", req: "write" },
          { id: "u4-ph-5", en: "play well / can't play well", zh: "打得好/打得不好", req: "write" },
          { id: "u4-ph-6", en: "well played", zh: "干得漂亮", req: "write" },
          { id: "u4-ph-7", en: "swim so well", zh: "游得非常好", req: "write" },
          { id: "u4-ph-8", en: "try again", zh: "再试一次", req: "write" },
          { id: "u4-ph-9", en: "(don't) like swimming / playing football", zh: "（不）喜欢游泳/踢足球", req: "write" },
          { id: "u4-ph-10", en: "like sport", zh: "喜欢体育运动", req: "write" },
          { id: "u4-ph-11", en: "(don't) like basketball", zh: "（不）喜欢打篮球", req: "write" },
          { id: "u4-ph-12", en: "both like ping-pong", zh: "都喜欢打乒乓球", req: "write" },
          { id: "u4-ph-13", en: "have a go", zh: "试一试", req: "write" },
          { id: "u4-ph-14", en: "be hard for ...", zh: "对……（谁）有点难", req: "write" },
          { id: "u4-ph-15", en: "be good for ...", zh: "对……有好处", req: "write" },
          { id: "u4-ph-16", en: "be good at sth.", zh: "擅长某事", req: "write" },
          { id: "u4-ph-17", en: "be good at + v.ing sth.", zh: "擅长做某事", req: "write" },
          { id: "u4-ph-18", en: "great fun", zh: "非常有趣，玩得开心", req: "write" },
          { id: "u4-ph-19", en: "catch the ball", zh: "抓住球", req: "write" },
          { id: "u4-ph-20", en: "hit the ball", zh: "击球", req: "write" },
          { id: "u4-ph-21", en: "throw it back", zh: "把它扔回来", req: "read" },
          { id: "u4-ph-22", en: "on the mat", zh: "在垫子上", req: "read" },
          { id: "u4-ph-23", en: "with the bat", zh: "用球棒", req: "read" },
          { id: "u4-ph-24", en: "play ping-pong together", zh: "一起打乒乓球", req: "read" },
          { id: "u4-ph-25", en: "It's OK.", zh: "没关系。", req: "read" },
          { id: "u4-ph-26", en: "keep fit", zh: "保持健康", req: "read" }
        ],
        sentences: [
          { id: "u4-sn-1", en: "--What sport do you like? --I like playing football. What about you? --Me too.", zh: "--你喜欢什么运动？ --我喜欢踢足球。那你呢？ --我也是。" },
          { id: "u4-sn-2", en: "--Do you like playing basketball? --Yes, I do.", zh: "--你喜欢打篮球吗？ --是的，我喜欢。" },
          { id: "u4-sn-3", en: "--No, I don't. I don't like playing basketball.", zh: "--不，我不喜欢。我不喜欢打篮球。" },
          { id: "u4-sn-4", en: "--Ping-pong is fun, but it's hard for me. --It's OK. Try again.", zh: "--乒乓球很有趣，但是对我来说有点难。 --没关系。再试一次。" },
          { id: "u4-sn-5", en: "I like running. I like jumping. Sport is cool and fun.", zh: "我喜欢跑步。我喜欢跳跃。运动又酷又有趣。" },
          { id: "u4-sn-6", en: "I like sport. It's good for us.", zh: "我喜欢运动。它对我们有好处。" },
          { id: "u4-sn-7", en: "Let's keep fit. Run, run, run!", zh: "让我们保持健康。跑起来！" },
          { id: "u4-sn-8", en: "--Come and play basketball with us. --OK. Thank you!", zh: "--过来和我们一起打篮球。 --好的。谢谢你！" },
          { id: "u4-sn-9", en: "You can play so well! / Well played!", zh: "你能打得很好！/ 好球！" },
          { id: "u4-sn-10", en: "--I like playing ping-pong. Let's go and play. --Good idea!", zh: "--我喜欢打乒乓球。让我们去打吧。 --好主意！" },
          { id: "u4-sn-11", en: "--Can we play again tomorrow? --Sure!", zh: "--我们明天能再玩（打）吗？ --当然！" },
          { id: "u4-sn-12", en: "I'm good at swimming.", zh: "我擅长游泳。" },
          { id: "u4-sn-13", en: "I don't want to play basketball tomorrow.", zh: "我明天不想打篮球。" }
        ],
        grammar: [
          {
            id: "u4-gr-1", title: "like 的用法（like + 名词）",
            blocks: [
              { type: "text", text: "like + sth.（名词）：" },
              { type: "text", text: "① + 名称（如：科目/球类等）。如：I like Chinese. 我喜欢语文。I like football. 我喜欢足球。" },
              { type: "text", text: "② + 可数名词复数。如：I like Chinese stories. 我喜欢中国故事。" },
              { type: "text", text: "③ + 不可数名词。如：We like sport. 我们喜欢体育运动。" },
              { type: "text", text: "④ + this/that + 名词单数。如：I like this pencil. 我喜欢这只铅笔。" },
              { type: "tip", text: "注意：like 后不能单独加可数名词的单数形式。" }
            ]
          },
          {
            id: "u4-gr-2", title: "like + v.ing（动词 ing 形式）",
            blocks: [
              { type: "text", text: "like + v.ing 表示喜欢做某事：" },
              { type: "examples", items: [{ en: "I like running.", zh: "我喜欢跑步。" }, { en: "I like jumping.", zh: "我喜欢跳跃。" }, { en: "I like playing basketball.", zh: "我喜欢打篮球。" }] },
              { type: "text", text: "问句：Do you like running? / Do you like playing football?" }
            ]
          },
          {
            id: "u4-gr-3", title: "动词 ing 形式（v.ing）变化规则",
            blocks: [
              { type: "text", text: "（1）直接 + ing。如：do--doing, read--reading, play--playing" },
              { type: "text", text: "（2）以不发音的 e 结尾，去 e + ing。如：dance--dancing, make--making" },
              { type: "text", text: "（3）以「辅元辅」结尾，且重读闭音节，双写尾字母 + ing。如：swim--swimming, run--running" }
            ]
          },
          {
            id: "u4-gr-4", title: "be good at... 擅长",
            blocks: [
              { type: "text", text: "（1）be good at + sth. 如：be good at basketball 擅长篮球" },
              { type: "text", text: "（2）be good at + v.ing 如：be good at playing basketball 擅长打篮球" }
            ]
          },
          {
            id: "u4-gr-5", title: "good 与 well 的区别",
            blocks: [
              { type: "text", text: "（1）good 是形容词，修饰名词。如：a good girl（good 修饰名词 girl）" },
              { type: "text", text: "（2）well 常为副词，修饰动词。如：play well / swim well（well 修饰动词 play 和 swim）" }
            ]
          },
          {
            id: "u4-gr-6", title: "with（介词）和；用；表伴随",
            blocks: [
              { type: "text", text: "（1）with + 人（用宾格：me/us/you/him/her/them），和某人一起。如：play with us" },
              { type: "text", text: "（2）with + 物（用某物）。如：hit the ball with the bat" }
            ]
          },
          {
            id: "u4-gr-7", title: "询问某人喜欢的运动及回答",
            blocks: [
              { type: "formula", text: "--What sport do you like? --I like + 运动类的名词 / v.ing." },
              { type: "examples", items: [{ en: "--What sport do you like? --I like football / playing football.", zh: "--你喜欢什么运动？ --我喜欢足球/踢足球。" }] }
            ]
          },
          {
            id: "u4-gr-8", title: "Do you like + v.ing 的问答结构",
            blocks: [
              { type: "formula", text: "--Do you like + v.ing sth.? --Yes, I do. / No, I don't." },
              { type: "text", text: "你喜欢……吗？是的，我喜欢。/ 不，我不喜欢。" },
              { type: "examples", items: [{ en: "--Do you like playing ping-pong? --Yes, I do.", zh: "--你喜欢打乒乓球吗？ --是的，我喜欢。" }] }
            ]
          }
        ],
        extra: []
      },

      /* ================= Unit 5 Different toys, same fun ================= */
      u5: {
        title: "Different toys, same fun",
        sounds: {
          intro: "参考 U4 知识点：a 的发音规则",
          refUnit: "u4",
          rules: []
        },
        phrasesReq: "原文学习要求：虚线上方会读会默；虚线下方会读会翻译。",
        phrases: [
          { id: "u5-ph-1", en: "her short / long hair", zh: "她的短/长头发", req: "write" },
          { id: "u5-ph-2", en: "her big eyes", zh: "她的大眼睛", req: "write" },
          { id: "u5-ph-3", en: "have small/big ears", zh: "有两只小/大耳朵（注意：单数 an ear）", req: "write" },
          { id: "u5-ph-4", en: "my small nose", zh: "我的小鼻子", req: "write" },
          { id: "u5-ph-5", en: "a small / big mouth", zh: "一张小/大嘴巴", req: "write" },
          { id: "u5-ph-6", en: "same fun", zh: "相同的乐趣", req: "write" },
          { id: "u5-ph-7", en: "have short / long legs", zh: "有短短的/长长的腿", req: "write" },
          { id: "u5-ph-8", en: "so tall", zh: "如此高", req: "write" },
          { id: "u5-ph-9", en: "her short arms", zh: "她的短手臂", req: "write" },
          { id: "u5-ph-10", en: "very short", zh: "很矮", req: "write" },
          { id: "u5-ph-11", en: "like dolls", zh: "喜欢玩具娃娃", req: "write" },
          { id: "u5-ph-12", en: "our dolls", zh: "我们的娃娃", req: "write" },
          { id: "u5-ph-13", en: "lots of (a lot of) robots", zh: "许多机器人", req: "write" },
          { id: "u5-ph-14", en: "that girl doll", zh: "那个女娃娃", req: "write" },
          { id: "u5-ph-15", en: "different toys", zh: "不同的玩具", req: "read" },
          { id: "u5-ph-16", en: "this cute robot", zh: "这个可爱的机器人", req: "read" },
          { id: "u5-ph-17", en: "bring you lots of fun", zh: "给你带来许多乐趣", req: "read" },
          { id: "u5-ph-18", en: "have a show", zh: "举行表演", req: "read" },
          { id: "u5-ph-19", en: "big and bright", zh: "大而明亮", req: "read" },
          { id: "u5-ph-20", en: "like toys", zh: "喜欢玩具", req: "read" },
          { id: "u5-ph-21", en: "these cool robots", zh: "这些酷酷的机器人", req: "read" },
          { id: "u5-ph-22", en: "a cute/lovely face", zh: "一张可爱的脸", req: "read" },
          { id: "u5-ph-23", en: "can talk", zh: "会说话", req: "read" },
          { id: "u5-ph-24", en: "share with the class", zh: "和同学们分享", req: "read" },
          { id: "u5-ph-25", en: "have fun together with friends", zh: "和朋友们一起玩得开心", req: "read" },
          { id: "u5-ph-26", en: "boy or girl", zh: "男孩还是女孩", req: "read" },
          { id: "u5-ph-27", en: "Su Hai's favourite toy", zh: "苏海最喜欢的玩具", req: "read" },
          { id: "u5-ph-28", en: "like stars late at night", zh: "像夜晚的星星", req: "read" }
        ],
        sentences: [
          { id: "u5-sn-1", en: "Look at this robot. His face is cute.", zh: "看看这个机器人。他的脸很可爱。" },
          { id: "u5-sn-2", en: "--Can you dance? --Yes, I can. I can talk too.", zh: "--你会跳舞吗？ --是的，我会。我还会说话。" },
          { id: "u5-sn-3", en: "My doll is a boy. His eyes are small. His nose is small too.", zh: "我的玩具娃娃是一个男孩子。他的眼睛小小的。他的鼻子也小小的。" },
          { id: "u5-sn-4", en: "His nose is small. But his mouth is big.", zh: "他的鼻子小小的。但是他的嘴巴很大。" },
          { id: "u5-sn-5", en: "Your dolls are great. They bring you lots of fun!", zh: "你们的娃娃很棒。它们给你们带来许多乐趣。" },
          { id: "u5-sn-6", en: "You are so tall. Your legs are long.", zh: "你真高。你的腿长长的。" },
          { id: "u5-sn-7", en: "We can have fun together with our friends.", zh: "我们可以和朋友们一起玩得很开心。" },
          { id: "u5-sn-8", en: "Let's have a show!", zh: "让我们举办一场表演秀吧！" },
          { id: "u5-sn-9", en: "It's great fun!", zh: "它非常有趣。" }
        ],
        grammar: [
          {
            id: "u5-gr-1", title: "lots of、a lot of、many 的区别",
            blocks: [
              { type: "text", text: "许多：lots of = a lot of + 可数名词复数/不可数名词。如：lots of dolls、a lot of fun" },
              { type: "text", text: "many 只能加可数名词复数。" }
            ]
          },
          {
            id: "u5-gr-2", title: "人称代词和物主代词的用法",
            blocks: [
              { type: "text", text: "人称代词分为主格和宾格：主格一般用于句子开头；宾格一般用在动词或介词后面。" },
              { type: "table", rows: [
                ["人称", "第一人称", "第二人称", "第三人称", "", "", ""],
                ["单复数", "单数", "复数", "单数", "复数", "单数", "复数"],
                ["主格", "I", "we", "you", "you", "he | she | it", "they"],
                ["宾格", "me", "us", "you", "you", "him | her | it", "them"],
                ["形容词性物主代词", "my", "our", "your", "your", "his | her | its", "their"]
              ] }
            ]
          },
          {
            id: "u5-gr-3", title: "描述人物或物品外貌的句型",
            blocks: [
              { type: "formula", text: "形容词性物主代词 + 身体部位 + is/are + 形容词." },
              { type: "examples", items: [{ en: "His face is cute.", zh: "他的脸很可爱。" }] }
            ]
          },
          {
            id: "u5-gr-4", title: "bring sb. sth. 的结构",
            blocks: [
              { type: "formula", text: "bring sb.（宾格）sth = bring sth. to sb.（宾格）" },
              { type: "text", text: "给某人带来某物。" },
              { type: "examples", items: [{ en: "bring you lots of fun", zh: "给你带来许多乐趣（= bring lots of fun to you）" }, { en: "bring me many toys", zh: "给我还来许多玩具（原文如此，待核对）" }] }
            ]
          },
          {
            id: "u5-gr-5", title: "share with sb. 的结构",
            blocks: [
              { type: "text", text: "share with sb.（宾格）和某人分享某物。" },
              { type: "text", text: "如：share with me / us / them / him / her" }
            ]
          },
          {
            id: "u5-gr-6", title: "look at 的用法",
            blocks: [
              { type: "text", text: "look at + 宾格。如：look at me 看看我" },
              { type: "text", text: "look at + 名词短语。如：look at her big eyes 看她的大眼睛" }
            ]
          }
        ],
        extra: []
      }
    }
  };

  global.UNIT_KNOWLEDGE.catNames = {
    sounds: "Sounds 语音",
    phrases: "Phrases 重点短语",
    sentences: "Sentences 重点句型",
    grammar: "Grammar 语法知识",
    extra: "Try to know 拓展知识"
  };
})(window);
