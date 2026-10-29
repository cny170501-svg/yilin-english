/* 语法用法与讲解专项（V2.1 新增）
 *
 * 内容说明：
 * - 语法主题围绕译林版四年级上册各单元句型组织，讲解、例句、错误对比、
 *   口诀与全部练习题均为本工具自编，不是教材原文；
 * - 主题与教材单元的关联为本工具根据单元句型整理，属“自编关联”，
 *   并非教材官方指定，界面中以“关联单元（待核实）”标注；
 * - 例句发音为浏览器语音合成，不是教材配套录音。
 * 题目格式与练习模块一致：kind: choice / input / order。
 */
(function (global) {
  "use strict";

  var T = []; /* 主题列表 */

  /* ---------- t1 be 动词 ---------- */
  T.push({
    id: "t1",
    title: "be 动词 am / is / are",
    emoji: "🔵",
    unitIds: ["u1", "u5"],
    scene: "介绍自己、介绍别人、描述动物和物品的样子时，都要用到 am / is / are。它们就像中文里的“是”“很”：I am a boy.（我是男孩。）They are cute.（它们很可爱。）",
    rules: [
      {
        title: "am / is / are 怎么选",
        explain: "看主语是谁：I（我）用 am；一个人或一样东西（he / she / it / this / 那个人）用 is；两个及以上或 you / we / they 用 are。",
        formula: "I → am ｜ he / she / it / 单个人物 → is ｜ we / you / they / 复数 → are",
        examples: [
          { en: "I am a boy.", zh: "我是一个男孩。", hl: "am" },
          { en: "She is my English teacher.", zh: "她是我的英语老师。", hl: "is" },
          { en: "They are cute and fat.", zh: "它们又可爱又胖。", hl: "are" }
        ],
        wrong: { bad: "I is a boy.", good: "I am a boy.", why: "I 永远搭配 am，不能用 is。" },
        tip: "口诀：我(I)用 am，他/她/它(is)单数，你们我们他们(are)复数。",
        quiz: { kind: "choice", type: "gr-choice", stem: "She ___ my English teacher.", stemZh: "选合适的 be 动词", options: ["am", "is", "are", "be"], answer: 1, explain: "She 是第三人称单数，用 is。" }
      },
      {
        title: "缩写形式：I'm / It's / They're",
        explain: "说话时经常把两个词缩成一个：I am = I'm，It is = It's，They are = They're，That is = That's。意思完全一样，写起来更短。",
        formula: "I am → I'm ｜ It is → It's ｜ They are → They're",
        examples: [
          { en: "I'm nine years old.", zh: "我九岁。", hl: "I'm" },
          { en: "It's in your bedroom.", zh: "它在你的卧室里。", hl: "It's" },
          { en: "They're thirty yuan.", zh: "它们三十元。", hl: "They're" }
        ],
        wrong: { bad: "They're is thirty yuan.", good: "They're thirty yuan.", why: "They're 已经等于 They are，后面不能再加 is。" },
        tip: "看到 's 先想“它等于 is 还是 has”，四年级最常见的是 is。",
        quiz: { kind: "choice", type: "gr-choice", stem: "It's = ______", stemZh: "缩写展开", options: ["It is", "It are", "It has", "It am"], answer: 0, explain: "It's 是 It is 的缩写。" }
      },
      {
        title: "用 be 动词提问和否定",
        explain: "把 is / are 搬到句子最前面就变成问句：Is this your bag? 回答用 Yes, it is. / No, it isn't.。说“不是”，在后面加 not：is not = isn't，are not = aren't。",
        formula: "Is this/it…? → Yes, it is. / No, it isn't. ｜ They aren't + 形容词",
        examples: [
          { en: "Is this your bag? — Yes, it is.", zh: "这是你的包吗？——是的。", hl: "Is" },
          { en: "The cats aren't fat.", zh: "这些猫不胖。", hl: "aren't" }
        ],
        wrong: { bad: "Is this your bag? — Yes, I am.", good: "Is this your bag? — Yes, it is.", why: "问句问的是“它是不是”，回答要用 it is，不能用 I am。" },
        tip: "问什么答什么：Is it…? 用 it is 回答；Are they…? 用 they are 回答。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— Is this your bedroom? — ______", stemZh: "选出正确回答", options: ["Yes, it is.", "Yes, I am.", "Yes, it does.", "Yes, I do."], answer: 0, explain: "Is it/this…? 的回答是 Yes, it is. / No, it isn't." }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "Look at the elephants. They ___ big.", options: ["am", "is", "are", "be"], answer: 2, explain: "They 是复数，用 are。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "My mum ___ (be) in the kitchen.", stemZh: "用 am/is/are 填空", answers: ["is"], explain: "My mum 是一个人，用 is。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。He are a king.", stemZh: "一句里有一个错误", answers: ["He is a king."], explain: "He 是单数，be 动词要用 is。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "改成一般疑问句：This is our new home.", stemZh: "把句子改成 Is 开头的问句", answers: ["Is this our new home?"], explain: "把 is 提到句子最前面，句末用问号。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：它们很可爱。", stemZh: "用 They're… 写出英文", answers: ["They are cute.", "They're cute."], explain: "它们 = They，很可爱 = are cute；两个答案都对。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：它是你的书包。", options: ["It's", "your", "schoolbag"], answer: "It's your schoolbag", speak: "It's your schoolbag.", explain: "It's + 你的 + 书包。" }
    ]
  });

  /* ---------- t2 名词单复数与 a/an ---------- */
  T.push({
    id: "t2",
    title: "名词单复数与 a / an",
    emoji: "🍎",
    unitIds: ["u1", "u2"],
    scene: "说一个东西用单数（a dog），说很多东西要在词尾加 s（dogs）。说“一个苹果”“一头大象”时，还要选对 a 或 an。",
    rules: [
      {
        title: "复数的变化规则",
        explain: "大多数词直接加 s；以 s、x、ch、sh 结尾的加 es（如 boxes、watches）；“辅音字母 + y”结尾的把 y 变 i 再加 es（如 stories）。",
        formula: "一般 + s ｜ s / x / ch / sh 结尾 + es ｜ 辅音 + y → ies",
        examples: [
          { en: "I like dogs and cats.", zh: "我喜欢狗和猫。", hl: "dogs" },
          { en: "How many boxes do you have?", zh: "你有多少个盒子？", hl: "boxes" }
        ],
        wrong: { bad: "two boxs", good: "two boxes", why: "box 以 x 结尾，要加 es。" },
        tip: "口诀：一般加 s，s/x/ch/sh 加 es，y 前是辅音把 y 变 ies。",
        quiz: { kind: "choice", type: "gr-choice", stem: "story 的复数是 ______", options: ["storys", "storyes", "stories", "storis"], answer: 2, explain: "辅音字母 + y 结尾，变 y 为 i 加 es。" }
      },
      {
        title: "a 还是 an",
        explain: "a 和 an 都表示“一个”。后面单词的第一个音是元音（a、e、i、o、u 开头）就用 an，否则用 a。",
        formula: "an + 元音开头单词 ｜ a + 其他",
        examples: [
          { en: "I have an apple and a banana.", zh: "我有一个苹果和一根香蕉。", hl: "an apple" },
          { en: "Look at that elephant! It's an elephant.", zh: "看那头大象！它是一头大象。", hl: "an elephant" }
        ],
        wrong: { bad: "a apple", good: "an apple", why: "apple 以元音音素开头，要用 an。" },
        tip: "记几个常用的：an apple、an elephant、an orange、an egg、an umbrella。",
        quiz: { kind: "choice", type: "gr-choice", stem: "___ orange, please.", options: ["A", "An", "Any", "Some"], answer: 1, explain: "orange 以元音开头，用 an。" }
      },
      {
        title: "like 后面用复数",
        explain: "说喜欢一类东西时，习惯用复数：I like dogs.（我喜欢狗。）表示“喜欢狗这种动物”，而不是只喜欢某一只。",
        formula: "I like + 复数名词 ｜ I like this + 单数名词",
        examples: [
          { en: "I like pandas.", zh: "我喜欢熊猫。", hl: "pandas" },
          { en: "I like this little cat.", zh: "我喜欢这只小猫。", hl: "this little cat" }
        ],
        wrong: { bad: "I like dog.", good: "I like dogs.", why: "表示喜欢一类动物要用复数 dogs。" },
        tip: "like + 一类 → 复数；like + this/that + 一个 → 单数。",
        quiz: { kind: "choice", type: "gr-choice", stem: "I like ______.", options: ["mango", "mangoes", "a mangoes", "an mango"], answer: 1, explain: "表示喜欢一类水果用复数 mangoes。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "How many ______ do you have? （sticker）", options: ["sticker", "stickers", "stickeres", "a sticker"], answer: 1, explain: "How many 后接复数，sticker 直接加 s。" },
      { kind: "choice", type: "gr-choice", level: 1, stem: "I'd like ___ hamburger and ___ glass of milk.", options: ["a; a", "an; a", "a; an", "an; an"], answer: 0, explain: "hamburger 和 glass 都不是元音开头，都用 a。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。I have a apple.", stemZh: "一处错误", answers: ["I have an apple."], explain: "apple 元音开头用 an。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：我喜欢猴子。", stemZh: "用 I like… 复数", answers: ["I like monkeys."], explain: "monkey 以辅音 + y 结尾，复数变 monkeys。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "用所给词的适当形式填空：There are many ______ (box) in the room.", stemZh: "注意词尾变化", answers: ["boxes"], explain: "box 以 x 结尾加 es。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：我有一些葡萄。", options: ["I", "have", "some", "grapes"], answer: "I have some grapes", speak: "I have some grapes.", explain: "I + have + some + 复数。" }
    ]
  });

  /* ---------- t3 Do you like...? ---------- */
  T.push({
    id: "t3",
    title: "Do you like…? 谈喜好",
    emoji: "❤️",
    unitIds: ["u1"],
    scene: "想知道别人喜不喜欢什么，就问 Do you like…? 告诉别人自己的喜好，就说 I like… 或 I don't like…。",
    rules: [
      {
        title: "问与答",
        explain: "Do you like + 复数名词？回答：Yes, I do.（喜欢）/ No, I don't.（不喜欢）。don't 是 do not 的缩写。",
        formula: "Do you like + 复数? → Yes, I do. / No, I don't.",
        examples: [
          { en: "Do you like dogs? — Yes, I do.", zh: "你喜欢狗吗？——喜欢。", hl: "Do" },
          { en: "Do you like tigers? — No, I don't.", zh: "你喜欢老虎吗？——不喜欢。", hl: "don't" }
        ],
        wrong: { bad: "Do you like dogs? — Yes, I like.", good: "Do you like dogs? — Yes, I do.", why: "回答要用 do 或 don't，不能只说 like。" },
        tip: "用 do 问，用 do 答：Yes, I do. / No, I don't.",
        quiz: { kind: "choice", type: "gr-choice", stem: "— Do you like pandas? — ______", options: ["Yes, I am.", "Yes, I do.", "Yes, it is.", "Yes, I can."], answer: 1, explain: "Do you like…? 用 do 回答。" }
      },
      {
        title: "否定：我不喜欢",
        explain: "在 like 前加 don't 就是“不喜欢”：I don't like lions.（我不喜欢狮子。）",
        formula: "I don't like + 复数名词",
        examples: [
          { en: "I don't like lions.", zh: "我不喜欢狮子。", hl: "don't like" },
          { en: "We don't like hot tea.", zh: "我们不喜欢热茶。", hl: "don't" }
        ],
        wrong: { bad: "I not like lions.", good: "I don't like lions.", why: "否定要借 don't，不能只用 not。" },
        tip: "don't 站在 like 前面：I don't like…",
        quiz: { kind: "choice", type: "gr-choice", stem: "I ______ like tigers.", options: ["not", "don't", "doesn't", "am not"], answer: 1, explain: "I 的否定用 don't。" }
      },
      {
        title: "说他/她的喜好（加 s）",
        explain: "主语换成 He / She 时，like 要加 s 变成 likes：He likes dogs. 问句用 Does：Does he like dogs? — Yes, he does.",
        formula: "He / She likes… ｜ Does he/she like…? → Yes, he does.",
        examples: [
          { en: "Helen likes pandas.", zh: "海伦喜欢熊猫。", hl: "likes" },
          { en: "Does Mike like football? — Yes, he does.", zh: "迈克喜欢足球吗？——喜欢。", hl: "Does" }
        ],
        wrong: { bad: "He like dogs.", good: "He likes dogs.", why: "He 是第三人称单数，like 要加 s。" },
        tip: "他/她/它，动词加 s（拓展内容，会认就行）。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Mike ______ basketball very much.", options: ["like", "likes", "liking", "to like"], answer: 1, explain: "Mike 是第三人称单数，like 加 s。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "— ______ you like mangoes? — Yes, I do.", options: ["Do", "Does", "Are", "Is"], answer: 0, explain: "主语 you，用 Do 提问。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。He like dogs.", stemZh: "一处错误", answers: ["He likes dogs."], explain: "He 是第三人称单数，like 加 s。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改成否定句：I like cats.", stemZh: "在 like 前加 don't", answers: ["I don't like cats."], explain: "don't + like 构成否定。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "改成一般疑问句：You like pandas.", stemZh: "Do 开头", answers: ["Do you like pandas?"], explain: "借 do 提问，you 保持不变。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：我不喜欢老虎。", stemZh: "用 don't", answers: ["I don't like tigers."], explain: "I + don't like + 复数。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：你喜欢猴子吗？", options: ["Do", "you", "like", "monkeys"], answer: "Do you like monkeys", speak: "Do you like monkeys?", explain: "Do + you + like + 复数。" }
    ]
  });

  /* ---------- t4 have / has ---------- */
  T.push({
    id: "t4",
    title: "have / has 表示“有”",
    emoji: "🎒",
    unitIds: ["u2", "u3"],
    scene: "说自己有什么东西用 have：I have a pineapple.（我有一个菠萝。）说“他/她/它有”要用 has。",
    rules: [
      {
        title: "have 和 has 的选择",
        explain: "I / you / we / they 和复数用 have；he / she / it 和一个人名（Mike、Helen）用 has。",
        formula: "I / you / we / they → have ｜ he / she / it / 人名 → has",
        examples: [
          { en: "I have a pineapple.", zh: "我有一个菠萝。", hl: "have" },
          { en: "Su Hai has two bananas.", zh: "苏海有两根香蕉。", hl: "has" }
        ],
        wrong: { bad: "Mike have three bananas.", good: "Mike has three bananas.", why: "Mike 是一个人，相当于 he，要用 has。" },
        tip: "口诀：我用 have，他/她/它用 has，你们我们他们全用 have。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Helen ______ fifteen stickers.", options: ["have", "has", "having", "is"], answer: 1, explain: "Helen 相当于 she，用 has。" }
      },
      {
        title: "Do you have…? 与 some / any",
        explain: "问别人有没有：Do you have any bananas? 说自己有：I have some grapes. some 用在肯定句，any 用在问句和否定句。",
        formula: "肯定句 some ｜ 问句 / 否定句 any",
        examples: [
          { en: "Do you have any mangoes?", zh: "你有芒果吗？", hl: "any" },
          { en: "I don't have any bananas.", zh: "我没有香蕉。", hl: "any" }
        ],
        wrong: { bad: "Do you have some bananas?", good: "Do you have any bananas?", why: "一般疑问句用 any。" },
        tip: "有的用 some，问和没有用 any。",
        quiz: { kind: "choice", type: "gr-choice", stem: "I have ______ grapes.", options: ["any", "some", "a", "an"], answer: 1, explain: "肯定句用 some。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "We ______ a new home.", options: ["has", "have", "is", "are"], answer: 1, explain: "we 用 have。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "用 have/has 填空：My sister ______ a nice doll.", stemZh: "选 have 或 has", answers: ["has"], explain: "my sister 相当于 she，用 has。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。She have sixteen stickers.", stemZh: "一处错误", answers: ["She has sixteen stickers."], explain: "She 用 has。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "改成一般疑问句：You have some bananas.", stemZh: "Do 开头，注意 some 变 any", answers: ["Do you have any bananas?"], explain: "借 do 提问，some 改 any。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：我有一个菠萝。", options: ["I", "have", "a", "pineapple"], answer: "I have a pineapple", speak: "I have a pineapple.", explain: "I + have + a + 菠萝。" }
    ]
  });

  /* ---------- t5 can ---------- */
  T.push({
    id: "t5",
    title: "can 会、能、可以",
    emoji: "💪",
    unitIds: ["u3", "u4"],
    scene: "说自己会做什么（I can swim.）、请别人做事（Can you…?）、请求允许（Can I have a look?）都用到 can。",
    rules: [
      {
        title: "can 的三种句子",
        explain: "肯定：I can play basketball. 否定：I can't skate.（can't = cannot）疑问：Can you swim? 回答 Yes, I can. / No, I can't.。can 后面永远接动词原形。",
        formula: "can + 动词原形 ｜ Can you…? → Yes, I can. / No, I can't.",
        examples: [
          { en: "I can play basketball.", zh: "我会打篮球。", hl: "can" },
          { en: "I can't skate.", zh: "我不会滑冰。", hl: "can't" },
          { en: "Can you jump? — Yes, I can.", zh: "你会跳吗？——会。", hl: "Can" }
        ],
        wrong: { bad: "She can swims.", good: "She can swim.", why: "can 后面接动词原形，不加 s。" },
        tip: "can 后面动词“裸奔”：不管主语是谁都不变。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— Can you play football? — No, ______.", options: ["I can't", "I don't", "I'm not", "I not can"], answer: 0, explain: "用 can 提问，用 can't 回答。" }
      },
      {
        title: "Can I…? 请求允许",
        explain: "想请别人同意自己做某事，说 Can I + 动词原形？回答常用 Sure! / OK! / Yes, you can.",
        formula: "Can I + 动词原形? → Sure. / Of course.",
        examples: [
          { en: "Can I have a look?", zh: "我能看一看吗？", hl: "Can I" },
          { en: "Can I play with your robot? — Sure!", zh: "我能玩你的机器人吗？——当然可以！", hl: "Sure" }
        ],
        wrong: { bad: "Can I have a look? — Yes, I can.", good: "Can I have a look? — Sure!", why: "对方在回答“你能不能做”，说 Sure / Of course 更自然。" },
        tip: "Can I…? 是礼貌的“我能……吗”。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— Can I have a look? — ______", options: ["Sure.", "I'm fine.", "Thank you.", "Yes, I do."], answer: 0, explain: "Sure. 表示“当然可以”。" }
      },
      {
        title: "well 表示“做得好”",
        explain: "在动作后面加 well，表示这件事做得好：He can swim well.（他游泳游得好。）",
        formula: "主语 + can + 动词 + well",
        examples: [
          { en: "Mike can play basketball well.", zh: "迈克篮球打得好。", hl: "well" }
        ],
        wrong: { bad: "He can well swim.", good: "He can swim well.", why: "well 放在动作后面。" },
        tip: "well 跟在动作屁股后面。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Yang Ling can skate ______.", options: ["good", "well", "nice", "fine"], answer: 1, explain: "修饰动作用 well。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "Birds can ______.", options: ["swims", "swim", "swimming", "to swim"], answer: 1, explain: "can 后接动词原形。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。My dad can skates.", stemZh: "一处错误", answers: ["My dad can skate."], explain: "can 后动词用原形 skate。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改成否定句：Liu Tao can play football.", stemZh: "在 can 后加 not 的缩写", answers: ["Liu Tao can't play football."], explain: "can 后加 not 变否定：can't。" },
      { kind: "choice", type: "gr-choice", level: 2, stem: "情境：朋友沮丧地说不会跳绳，你应该说 ______", options: ["Don't be sad. Have a try!", "You're welcome.", "How much is it?", "I'm hungry."], answer: 0, explain: "鼓励别人：别难过，试一试！" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：他会游泳，游得很好。", stemZh: "用 can … well", answers: ["He can swim well."], explain: "can + swim + well。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：你会打乒乓球吗？", options: ["Can", "you", "play", "table", "tennis"], answer: "Can you play table tennis", speak: "Can you play table tennis?", explain: "Can + you + play + table tennis。" }
    ]
  });

  /* ---------- t6 How many ---------- */
  T.push({
    id: "t6",
    title: "How many 问数量",
    emoji: "🔢",
    unitIds: ["u3"],
    scene: "想知道有多少个东西，问 How many…? 比如：How many stickers do you have?（你有多少张贴纸？）",
    rules: [
      {
        title: "How many + 复数",
        explain: "How many 后面必须接可数名词复数：How many dogs / boxes / storybooks。回答直接说数字：I have fifteen.",
        formula: "How many + 复数名词 + do you have? → I have + 数字",
        examples: [
          { en: "How many toy cars do you have?", zh: "你有多少辆玩具汽车？", hl: "How many" },
          { en: "I have fourteen.", zh: "我有十四个。", hl: "fourteen" }
        ],
        wrong: { bad: "How many sticker do you have?", good: "How many stickers do you have?", why: "How many 后接复数 stickers。" },
        tip: "How many 后面“必然复数”。",
        quiz: { kind: "choice", type: "gr-choice", stem: "How many ______ do you have?", options: ["box", "boxs", "boxes", "a box"], answer: 2, explain: "How many 后接复数，box 的复数是 boxes。" }
      },
      {
        title: "13–19 的拼写",
        explain: "13–19 大多在个位数后加 -teen：four→fourteen，six→sixteen。注意三个特殊的：thirteen、fifteen、eighteen。",
        formula: "four + teen = fourteen（注意 thirteen / fifteen / eighteen）",
        examples: [
          { en: "Thirteen and six is nineteen.", zh: "十三加六是十九。", hl: "nineteen" },
          { en: "I have fifteen stickers.", zh: "我有十五张贴纸。", hl: "fifteen" }
        ],
        wrong: { bad: "fiveteen", good: "fifteen", why: "十五是 fifteen，不是 fiveteen。" },
        tip: "fifteen 像 fifteen 的 five 变了形：五变 f，加 teen。",
        quiz: { kind: "choice", type: "gr-choice", stem: "“十八”的英文是 ______", options: ["eightteen", "eighteen", "eightteen 的 e 太多", "eighty"], answer: 1, explain: "十八是 eighteen（只保留 eight 的 t）；eighty 是八十。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "— How many pandas? — ______", options: ["It's fifteen.", "Fifteen.", "Yes, I do.", "They are cute."], answer: 1, explain: "问数量直接用数字回答。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "用数字英文填空：16 + 3 = ______", stemZh: "写出这个数字", answers: ["nineteen"], explain: "19 是 nineteen。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。How many box do you have?", stemZh: "一处错误", answers: ["How many boxes do you have?"], explain: "How many 后接复数 boxes。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：你有多少本书？", stemZh: "用 How many", answers: ["How many books do you have?"], explain: "How many + books + do you have?" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：我有十五张贴纸。", options: ["I", "have", "fifteen", "stickers"], answer: "I have fifteen stickers", speak: "I have fifteen stickers.", explain: "I + have + 数字 + 复数。" }
    ]
  });

  /* ---------- t7 Where 与方位介词 ---------- */
  T.push({
    id: "t7",
    title: "Where 问位置与方位介词",
    emoji: "🏠",
    unitIds: ["u5"],
    scene: "找东西的时候问 Where's my bag?（我的包在哪里？）回答要用 in、on、under、near 说清楚位置。",
    rules: [
      {
        title: "Where's 和 Where are",
        explain: "找一样东西用 Where's（= Where is）：Where's my bag? 回答 It's…。找多件东西用 Where are：Where are my shoes? 回答 They're…。",
        formula: "Where's + 单数? → It's … ｜ Where are + 复数? → They're …",
        examples: [
          { en: "Where's my schoolbag? — It's in your bedroom.", zh: "我的书包在哪里？——在你的卧室里。", hl: "Where's" },
          { en: "Where are my socks? — They're under the sofa.", zh: "我的袜子在哪里？——在沙发下面。", hl: "Where are" }
        ],
        wrong: { bad: "Where is my shoes?", good: "Where are my shoes?", why: "shoes 是复数，要用 are。" },
        tip: "单数问 where's 答它 it's；复数问 where are 答他们 they're。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— Where ___ my pens? — They're on the table.", options: ["is", "am", "are", "be"], answer: 2, explain: "pens 是复数，用 are。" }
      },
      {
        title: "in / on / under / near",
        explain: "in 在里面（in the box），on 在上面（on the table），under 在下面（under the sofa），near 在旁边（near the window）。",
        formula: "It's in / on / under / near + 地点",
        examples: [
          { en: "The milk is in the fridge.", zh: "牛奶在冰箱里。", hl: "in" },
          { en: "The clock is on the table.", zh: "钟在桌子上。", hl: "on" },
          { en: "The cat is under the chair.", zh: "猫在椅子下面。", hl: "under" }
        ],
        wrong: { bad: "The cat is in the chair.", good: "The cat is on the chair.", why: "猫在椅子“上面”，用 on（除非坐在椅子里也用 on）。" },
        tip: "里面 in，上面 on，下面 under，旁边 near。",
        quiz: { kind: "choice", type: "gr-choice", stem: "The apples are ______ the table. （苹果在桌子上）", options: ["under", "on", "in", "behind"], answer: 1, explain: "在桌子表面用 on。" }
      },
      {
        title: "Is it in…? 猜位置",
        explain: "猜东西在哪里：Is it in the kitchen? 回答 Yes, it is. / No, it isn't.",
        formula: "Is it + 介词短语? → Yes, it is. / No, it isn't.",
        examples: [
          { en: "Is it in the bathroom? — No, it isn't.", zh: "它在卫生间吗？——不在。", hl: "Is it" }
        ],
        wrong: { bad: "Is it in the kitchen? — Yes, it's.", good: "Is it in the kitchen? — Yes, it is.", why: "肯定回答不能缩写，要说 it is。" },
        tip: "Yes, it is. 不缩写；No, it isn't. 要缩写。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— Is the cat under the bed? — ______", options: ["Yes, it is.", "Yes, it's.", "No, it is.", "Yes, I am."], answer: 0, explain: "肯定回答 Yes, it is. 不缩写。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "The TV is in the ______.", options: ["bedroom", "living room", "fridge", "box"], answer: 1, explain: "电视通常在客厅。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "用介词填空：The cat is ______ the sofa. （在沙发下面）", stemZh: "in / on / under / near", answers: ["under"], explain: "下面用 under。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。Where is my shoes?", stemZh: "一处错误", answers: ["Where are my shoes?"], explain: "shoes 复数用 are。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：它在你的卧室里。", stemZh: "用 It's in…", answers: ["It's in your bedroom.", "It is in your bedroom."], explain: "It's + in + your bedroom。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：它们在沙发下面。", options: ["They're", "under", "the", "sofa"], answer: "They're under the sofa", speak: "They're under the sofa.", explain: "They're + under + the sofa。" }
    ]
  });

  /* ---------- t8 What would you like ---------- */
  T.push({
    id: "t8",
    title: "What would you like? 点餐",
    emoji: "🍔",
    unitIds: ["u6"],
    scene: "在小吃店点东西、在家问家人想吃什么，都用 What would you like?（你想要什么？）回答 I'd like…, please.（我想要……）",
    rules: [
      {
        title: "would like 的问与答",
        explain: "I'd like = I would like，意思是“我想要”。比 I want 更有礼貌。句尾加 please 更棒。",
        formula: "What would you like? → I'd like + 食物, please.",
        examples: [
          { en: "What would you like? — I'd like a hamburger, please.", zh: "你想要什么？——我想要一个汉堡包。", hl: "I'd like" },
          { en: "I'd like some noodles.", zh: "我想要一些面条。", hl: "some" }
        ],
        wrong: { bad: "I'd like a noodles.", good: "I'd like some noodles.", why: "noodles 习惯用复数，前面用 some，不用 a。" },
        tip: "I'd like 是“我想要”，有礼貌；句尾 please 锦上添花。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— What would you like? — ______", options: ["I like dog.", "I'd like some rice.", "Yes, I do.", "I am hungry."], answer: 1, explain: "回答用 I'd like…" }
      },
      {
        title: "a glass of / a cup of",
        explain: "玻璃杯装的（牛奶、果汁）用 a glass of；茶杯装的（茶、咖啡）用 a cup of。",
        formula: "a glass of + milk / juice ｜ a cup of + tea / coffee",
        examples: [
          { en: "I'd like a glass of milk.", zh: "我想要一杯牛奶。", hl: "a glass of" },
          { en: "A cup of tea, please.", zh: "请给我一杯茶。", hl: "a cup of" }
        ],
        wrong: { bad: "a cup of milk", good: "a glass of milk", why: "牛奶通常装在玻璃杯里，用 a glass of。" },
        tip: "玻璃 glass，茶杯 cup：牛奶奶昔玻璃杯，茶和咖啡小茶杯。",
        quiz: { kind: "choice", type: "gr-choice", stem: "I'd like ______ coffee.", options: ["a glass of", "a cup of", "a bottle", "some of"], answer: 1, explain: "咖啡用 a cup of。" }
      },
      {
        title: "点餐常用语",
        explain: "服务员问：Can I help you? / Anything else?（还要别的吗？）回答：No, thank you.（不了，谢谢。）",
        formula: "Can I help you? → I'd like… ｜ Anything else? → No, thank you.",
        examples: [
          { en: "— Anything else? — No, thank you.", zh: "——还要别的吗？——不了，谢谢。", hl: "Anything else" }
        ],
        wrong: { bad: "— Anything else? — I'm fine.", good: "— Anything else? — No, thank you.", why: "点餐时用 No, thank you. 礼貌拒绝。" },
        tip: "No, thank you. 一句话两个功能：不要了 + 谢谢。",
        quiz: { kind: "choice", type: "gr-choice", stem: "情境：服务员问 Can I help you? 你应该说 ______", options: ["I'd like a sandwich, please.", "Goodbye!", "How much is it?", "I'm fine, thank you."], answer: 0, explain: "直接说出想要的东西。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "I'd like = ______", options: ["I do like", "I would like", "I am like", "I likes"], answer: 1, explain: "I'd 是 I would 的缩写。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "用 a glass of / a cup of 填空：I'd like ______ orange juice.", stemZh: "选一个", answers: ["a glass of"], explain: "果汁用玻璃杯 a glass of。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。I'd like a milk.", stemZh: "一处错误", answers: ["I'd like a glass of milk.", "I'd like some milk."], explain: "牛奶不可数，用 a glass of 或 some。" },
      { kind: "choice", type: "gr-choice", level: 2, stem: "情境：朋友问你 Anything else? 你不想要了，应该说 ______", options: ["Yes, I do.", "No, thank you.", "I'm hungry.", "Me too."], answer: 1, explain: "No, thank you. 礼貌表示不要了。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：我想要一杯茶。", stemZh: "用 a cup of", answers: ["I'd like a cup of tea."], explain: "I'd like + a cup of + tea。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：您要点什么？", options: ["What", "would", "you", "like"], answer: "What would you like", speak: "What would you like?", explain: "What + would + you + like?" }
    ]
  });

  /* ---------- t9 How much ---------- */
  T.push({
    id: "t9",
    title: "How much 问价格",
    emoji: "💰",
    unitIds: ["u7"],
    scene: "买东西问多少钱：How much is it?（它多少钱？）How much are they?（它们多少钱？）",
    rules: [
      {
        title: "is 还是 are",
        explain: "问一件东西：How much is it / is the fan? 回答 It's five yuan.。问多件东西：How much are they / are the socks? 回答 They're ten yuan.",
        formula: "How much is + 单数? → It's … yuan. ｜ How much are + 复数? → They're … yuan.",
        examples: [
          { en: "How much is the fan? — It's fifteen yuan.", zh: "这把扇子多少钱？——十五元。", hl: "How much is" },
          { en: "How much are the shoes? — They're forty-five yuan.", zh: "这双鞋多少钱？——四十五元。", hl: "How much are" }
        ],
        wrong: { bad: "How much is the socks?", good: "How much are the socks?", why: "socks 是复数，用 are。" },
        tip: "一件 it is，多件 they are；钱说数字加 yuan。",
        quiz: { kind: "choice", type: "gr-choice", stem: "— How much ______ the umbrella? — It's twenty yuan.", options: ["is", "are", "am", "do"], answer: 0, explain: "umbrella 单数用 is。" }
      },
      {
        title: "整十数字的拼写",
        explain: "20–50：twenty、thirty、forty、fifty。特别注意 forty 中间没有 u（不是 fourty）。",
        formula: "twenty 20 ｜ thirty 30 ｜ forty 40（没有 u）｜ fifty 50",
        examples: [
          { en: "The doll is forty-five yuan.", zh: "这个娃娃四十五元。", hl: "forty-five" },
          { en: "I have fifty yuan.", zh: "我有五十元。", hl: "fifty" }
        ],
        wrong: { bad: "fourty yuan", good: "forty yuan", why: "四十是 forty，没有 u。" },
        tip: "four 去掉 u 变 forty，是拼写小陷阱。",
        quiz: { kind: "choice", type: "gr-choice", stem: "“四十”的正确拼写是 ______", options: ["fourty", "forty", "fourtey", "fortey"], answer: 1, explain: "forty 没有字母 u。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "— How much are they? — ______ thirty yuan.", options: ["It's", "They're", "I'm", "He's"], answer: 1, explain: "they 对应 They're。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "用数字英文填空：30 + 20 = ______", stemZh: "写出这个数字", answers: ["fifty"], explain: "50 是 fifty。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。How much are the fan?", stemZh: "一处错误", answers: ["How much is the fan?"], explain: "fan 单数用 is。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：它们十元。", stemZh: "用 They're", answers: ["They're ten yuan.", "They are ten yuan."], explain: "They're + ten + yuan。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：这把扇子多少钱？", options: ["How", "much", "is", "the", "fan"], answer: "How much is the fan", speak: "How much is the fan?", explain: "How much + is + 单数。" }
    ]
  });

  /* ---------- t10 his / her ---------- */
  T.push({
    id: "t10",
    title: "his / her 描述人物",
    emoji: "🧸",
    unitIds: ["u8"],
    scene: "介绍娃娃或朋友的样子时用 his / her：His nose is small.（他的鼻子小。）Her eyes are big.（她的眼睛大。）",
    rules: [
      {
        title: "his 和 her 的区别",
        explain: "his 是“他的”（男生），her 是“她的”（女生）。后面直接接身体部位或东西：his hair、her doll。",
        formula: "his / her + 名词",
        examples: [
          { en: "This is Tom. His hair is short.", zh: "这是汤姆。他的头发短。", hl: "His" },
          { en: "This is Amy. Her doll is beautiful.", zh: "这是艾米。她的娃娃很漂亮。", hl: "Her" }
        ],
        wrong: { bad: "Look at the girl. His hair is long.", good: "Look at the girl. Her hair is long.", why: "girl 是女孩，要用 her。" },
        tip: "男孩 his，女孩 her，看人下“词”。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Look at the boy. ______ nose is small.", options: ["His", "Her", "She", "He"], answer: 0, explain: "boy 是男孩，用 His。" }
      },
      {
        title: "部位配 is 还是 are",
        explain: "一个部位（鼻子、嘴巴、头发）用 is：His nose is small.。成对的部位（眼睛、耳朵、手）用 are：Her eyes are big.",
        formula: "单数部位 + is ｜ 成对部位（eyes / ears）+ are",
        examples: [
          { en: "His mouth is small.", zh: "他的嘴巴小。", hl: "is" },
          { en: "Her ears are big.", zh: "她的耳朵大。", hl: "are" }
        ],
        wrong: { bad: "His eyes is big.", good: "His eyes are big.", why: "eyes 是两只，用 are。" },
        tip: "眼睛耳朵是一双，句子动词要用 are。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Her hair ______ long.", options: ["are", "is", "am", "be"], answer: 1, explain: "hair 在这里看作整体，用 is。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "The doll is a girl. ______ eyes are big.", options: ["His", "Her", "It's", "She"], answer: 1, explain: "女孩娃娃用 Her。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "用 his / her 填空：My father is tall. ______ nose is big.", stemZh: "选 his 或 her", answers: ["His"], explain: "father 是男性，用 His。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。His eyes is big.", stemZh: "一处错误", answers: ["His eyes are big."], explain: "eyes 复数用 are。" },
      { kind: "input", type: "gr-input", level: 2, lang: "en", stem: "翻译：她的头发长。", stemZh: "用 Her…", answers: ["Her hair is long."], explain: "Her + hair + is + long。" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：他的鼻子小。", options: ["His", "nose", "is", "small"], answer: "His nose is small", speak: "His nose is small.", explain: "His + nose + is + small。" }
    ]
  });

  /* ---------- t11 祈使句与 Let's ---------- */
  T.push({
    id: "t11",
    title: "Let's… / Look at… / Don't…",
    emoji: "✨",
    unitIds: ["u1", "u2", "u4"],
    scene: "叫别人一起做事用 Let's…（让我们……），提醒别人看用 Look at…，劝别人别做某事用 Don't…。",
    rules: [
      {
        title: "Let's 一起做某事",
        explain: "Let's = Let us。Let's 后面接动词原形：Let's make a fruit salad. 回答可以说 Great! / OK! / Good idea!",
        formula: "Let's + 动词原形 → Great! / OK!",
        examples: [
          { en: "Let's make a fruit salad. — Great!", zh: "我们做水果沙拉吧。——太好了！", hl: "Let's" },
          { en: "Let's play table tennis.", zh: "我们打乒乓球吧。", hl: "Let's" }
        ],
        wrong: { bad: "Let's to make a cake.", good: "Let's make a cake.", why: "Let's 后接动词原形，不加 to。" },
        tip: "Let's 后面动词“裸奔”，和 can 一样。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Let's ______ a fruit salad.", options: ["make", "makes", "making", "to make"], answer: 0, explain: "Let's 后接动词原形。" }
      },
      {
        title: "Look at… 和 Don't…",
        explain: "Look at + 名词：提醒别人看（Look at this cat!）。Don't + 动词原形：劝别人别做（Don't be sad. 别难过。）",
        formula: "Look at + 名词 ｜ Don't + 动词原形",
        examples: [
          { en: "Look at our doll!", zh: "看我们的娃娃！", hl: "Look at" },
          { en: "Don't be sad.", zh: "别难过。", hl: "Don't" }
        ],
        wrong: { bad: "Look this cat!", good: "Look at this cat!", why: "Look 后面要先加 at 再接名词。" },
        tip: "看东西 look at，别做某事 don't。",
        quiz: { kind: "choice", type: "gr-choice", stem: "Look ______ the snowman!", options: ["at", "in", "on", "of"], answer: 0, explain: "Look at 表示“看……”。" }
      }
    ],
    practice: [
      { kind: "choice", type: "gr-choice", level: 1, stem: "— Let's play football. — ______", options: ["Great!", "I'm fine.", "Thank you.", "Yes, it is."], answer: 0, explain: "Great! 表示赞成。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "改错：写出正确的句子。Look my new kite!", stemZh: "缺一个词", answers: ["Look at my new kite!"], explain: "Look 后接 at。" },
      { kind: "input", type: "gr-input", level: 1, lang: "en", stem: "翻译：别难过。", stemZh: "用 Don't…", answers: ["Don't be sad."], explain: "Don't + be + sad。" },
      { kind: "choice", type: "gr-choice", level: 2, stem: "情境：你看到同学比赛失利在哭，应该安慰说 ______", options: ["Don't be sad. Have a try!", "Look at me!", "How much is it?", "Anything else?"], answer: 0, explain: "安慰鼓励：别难过，再试一次！" },
      { kind: "order", type: "gr-order", level: 2, stem: "连词成句：看这只猫！", options: ["Look", "at", "this", "cat"], answer: "Look at this cat", speak: "Look at this cat!", explain: "Look + at + this + cat。" }
    ]
  });

  global.GRAMMAR_CONTENT = {
    updatedAt: "2026-10-29",
    note: "语法讲解与练习围绕教材各单元句型自编；主题与单元的关联为自编整理（待核实），非教材官方指定。例句发音为语音合成。",
    topics: T
  };
})(window);
