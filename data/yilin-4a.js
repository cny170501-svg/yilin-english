/* 内置教材数据：译林版（牛津译林）小学英语 四年级上册（新版教材）
 *
 * 说明：
 * - 单元主题与单词表依据 2026 版新教材词汇表照片逐条录入（含短语与句型词条）；
 * - 例句、句型与知识点讲解为本工具自编的复习材料，不是教材原文；
 * - 单元标题为按主题拟定的描述性名称（新教材官方单元标题待补充后可替换）；
 * - 所有内容均可在「设置 → 内容管理」中核对、修改或替换（导入 JSON 后覆盖内置数据）。
 */
(function (global) {
  "use strict";

  global.BUILTIN_CONTENT = {
    id: "yilin-4a",
    title: "译林版小学英语 四年级上册",
    publisher: "译林出版社（牛津译林版）",
    grade: "四年级上册",
    sourceNote: "单元主题与单词表依据新教材词汇表录入（2026-11 按教材词汇表照片更新）；例句、句型讲解和练习为本工具自编复习材料，非教材原文。请家长核对后使用，可在「设置 → 内容管理」中修改。",
    updatedAt: "2026-11-03",
    units: [
      {
        id: "u1",
        no: 1,
        title: "My Subjects",
        titleZh: "我的学科",
        emoji: "📚",
        words: [
          { en: "subject", zh: "学科", exEn: "What subjects do you like?", exZh: "你喜欢什么学科？" },
          { en: "Chinese", zh: "语文（课）；中国的", exEn: "We have Chinese every day.", exZh: "我们每天都有语文课。" },
          { en: "English", zh: "英语（课）；英语的", exEn: "I like English.", exZh: "我喜欢英语。" },
          { en: "Maths", zh: "数学（课）", exEn: "Maths is fun.", exZh: "数学很有趣。" },
          { en: "PE", zh: "体育（课）", exEn: "We can play games in PE.", exZh: "体育课上我们可以做游戏。" },
          { en: "Art", zh: "美术（课）", exEn: "I can draw in Art.", exZh: "美术课上我会画画。" },
          { en: "Science", zh: "科学（课）", exEn: "I like Science.", exZh: "我喜欢科学。" },
          { en: "IT", zh: "信息科技（课）", exEn: "We use computers in IT.", exZh: "信息科技课上我们用电脑。" },
          { en: "Music", zh: "音乐（课）", exEn: "We sing in Music.", exZh: "音乐课上我们唱歌。" },
          { en: "Labour", zh: "劳动（课）", exEn: "We make things in Labour.", exZh: "劳动课上我们做东西。" },
          { en: "best", zh: "最", exEn: "I like English best.", exZh: "我最喜欢英语。" },
          { en: "also", zh: "也，还", exEn: "We also have Music.", exZh: "我们还有音乐课。" },
          { en: "it's time for", zh: "是……的时候了", exEn: "It's time for Chinese.", exZh: "到上语文课的时间了。" },
          { en: "mouse", zh: "鼠标；老鼠", exEn: "The mouse is on the desk.", exZh: "鼠标在桌子上。" },
          { en: "welcome back to", zh: "欢迎回到……", exEn: "Welcome back to school!", exZh: "欢迎回到学校！" },
          { en: "be good at", zh: "擅长", exEn: "I'm good at Maths.", exZh: "我擅长数学。" },
          { en: "interesting", zh: "有趣的，有吸引力的", exEn: "The book is interesting.", exZh: "这本书很有趣。" },
          { en: "learn about", zh: "学习，了解", exEn: "We learn about animals.", exZh: "我们学习了解动物。" },
          { en: "culture", zh: "文化，文明", exEn: "We learn about Chinese culture.", exZh: "我们学习中国文化。" },
          { en: "read", zh: "阅读", exEn: "I like reading.", exZh: "我喜欢阅读。" },
          { en: "story", zh: "故事", exEn: "This story is fun.", exZh: "这个故事很有趣。" },
          { en: "all", zh: "全部，都", exEn: "All of us like Art.", exZh: "我们都喜欢美术。" },
          { en: "sports ground", zh: "操场，运动场", exEn: "We play on the sports ground.", exZh: "我们在操场上玩。" }
        ],
        sentences: [
          { en: "What subjects do you like?", zh: "你喜欢什么学科？" },
          { en: "I like English best.", zh: "我最喜欢英语。" },
          { en: "It's time for Chinese.", zh: "到上语文课的时间了。" },
          { en: "Welcome back to school!", zh: "欢迎回到学校！" },
          { en: "I'm good at Science.", zh: "我擅长科学。" },
          { en: "We also have Art and Music.", zh: "我们还有美术课和音乐课。" }
        ],
        grammar: [
          {
            title: "I like … 表达喜欢",
            explain: ["like 后面接喜欢的东西。", "学科名作宾语直接用原词：I like Art. / I like Maths.", "最喜欢用 best：I like English best."],
            examples: [
              { en: "I like Art and Music.", zh: "我喜欢美术和音乐。" },
              { en: "I like English best.", zh: "我最喜欢英语。" }
            ],
            quiz: [
              { q: "我喜欢数学。下面哪句是对的？", options: ["I like Maths.", "I likes Maths.", "I like a Maths.", "I am like Maths."], answer: 0, explain: "I 后面动词用原形 like，学科名直接接在 like 后面。" }
            ]
          },
          {
            title: "Do you like …? 一般疑问句",
            explain: ["问别人喜不喜欢，用 Do you like + 名词？", "肯定回答：Yes, I do.", "否定回答：No, I don't.（don't = do not）"],
            examples: [
              { en: "Do you like Science?", zh: "你喜欢科学吗？" },
              { en: "Yes, I do. It's interesting.", zh: "是的，喜欢。它很有趣。" }
            ],
            quiz: [
              { q: "— Do you like Music? — ______", options: ["Yes, I am.", "Yes, it is.", "Yes, I do.", "Yes, I can."], answer: 2, explain: "Do you like…? 用 do 来回答：Yes, I do. / No, I don't." }
            ]
          },
          {
            title: "It's time for … 是……的时候了",
            explain: ["It's time for + 名词（课程、活动等）。", "到上……课的时间了：It's time for Chinese."],
            examples: [
              { en: "It's time for Maths.", zh: "到上数学课的时间了。" },
              { en: "It's time for PE. Let's go!", zh: "到上体育课的时间了。走吧！" }
            ],
            quiz: [
              { q: "到上英语课的时间了：______", options: ["It's time for English.", "It's time to English.", "It's time for English class time.", "Time for go English."], answer: 0, explain: "It's time for + 名词：It's time for English." }
            ]
          }
        ]
      },
      {
        id: "u2",
        no: 2,
        title: "My Day",
        titleZh: "我的一天",
        emoji: "⏰",
        words: [
          { en: "day", zh: "一天，一日", exEn: "What a happy day!", exZh: "多开心的一天啊！" },
          { en: "get up", zh: "起床", exEn: "I get up at six thirty.", exZh: "我六点半起床。" },
          { en: "wash", zh: "洗", exEn: "Wash your hands, please.", exZh: "请洗手。" },
          { en: "face", zh: "脸，面孔", exEn: "Wash your face.", exZh: "洗洗脸。" },
          { en: "have lessons", zh: "上课", exEn: "We have lessons at eight.", exZh: "我们八点开始上课。" },
          { en: "have", zh: "吃；喝", exEn: "We have lunch at school.", exZh: "我们在学校吃午饭。" },
          { en: "dinner", zh: "正餐，（常指）晚餐", exEn: "I have dinner at home.", exZh: "我在家吃晚饭。" },
          { en: "breakfast", zh: "早餐，早饭", exEn: "Breakfast is good for us.", exZh: "早餐对我们有好处。" },
          { en: "lunch", zh: "午餐，午饭", exEn: "What's for lunch?", exZh: "午餐吃什么？" }
        ],
        sentences: [
          { en: "I get up at six thirty.", zh: "我六点半起床。" },
          { en: "Wash your face, please.", zh: "请洗脸。" },
          { en: "We have lessons at eight.", zh: "我们八点开始上课。" },
          { en: "What time do you have lunch?", zh: "你几点吃午饭？" },
          { en: "I have dinner with my family.", zh: "我和家人一起吃晚饭。" },
          { en: "What a happy day!", zh: "多开心的一天啊！" }
        ],
        grammar: [
          {
            title: "Let's … 提议一起做某事",
            explain: ["Let's = Let us（让我们……）", "Let's 后面接动词原形：Let's have breakfast.", "回答可以说 Great! / OK! / Good idea!"],
            examples: [
              { en: "Let's have lunch.", zh: "我们吃午饭吧。" },
              { en: "— Let's go to bed. — OK! Good night!", zh: "—我们上床睡觉吧。—好！晚安！" }
            ],
            quiz: [
              { q: "Let's ______ breakfast.", options: ["have", "has", "having", "to have"], answer: 0, explain: "Let's 后面接动词原形。" }
            ]
          },
          {
            title: "have 的两个意思：吃 与 有",
            explain: ["have 可以表示吃、喝：have breakfast / have lunch / have dinner", "也可以表示有：I have lots of books.", "第三人称单数用 has：He has a robot."],
            examples: [
              { en: "We have lunch at twelve.", zh: "我们十二点吃午饭。" },
              { en: "He has a nice schoolbag.", zh: "他有一个漂亮的书包。" }
            ],
            quiz: [
              { q: "Mike ______ three books.", options: ["have", "has", "is", "are"], answer: 1, explain: "Mike 是第三人称单数，用 has。" }
            ]
          },
          {
            title: "at + 时间点",
            explain: ["at 用在具体时间点前：at six / at seven thirty", "I get up at six. 我六点起床。"],
            examples: [
              { en: "I get up at six thirty.", zh: "我六点半起床。" },
              { en: "We have lessons at eight.", zh: "我们八点开始上课。" }
            ],
            quiz: [
              { q: "我七点吃早餐：I have breakfast ______ seven.", options: ["in", "on", "at", "of"], answer: 2, explain: "具体时间点前用 at。" }
            ]
          }
        ]
      },
      {
        id: "u3",
        no: 3,
        title: "What Time Is It?",
        titleZh: "现在几点了",
        emoji: "🕐",
        words: [
          { en: "go to bed", zh: "上床睡觉", exEn: "It's time to go to bed.", exZh: "到了上床睡觉的时间了。" },
          { en: "o'clock", zh: "（表示整点）……点钟", exEn: "It's seven o'clock.", exZh: "七点了。" },
          { en: "early", zh: "早的", exEn: "I get up early.", exZh: "我起床很早。" },
          { en: "thirty", zh: "三十", exEn: "It's six thirty.", exZh: "六点半了。" },
          { en: "first", zh: "首次，第一", exEn: "Sunday is the first day of a week.", exZh: "星期日是一周的第一天。" },
          { en: "hurry up", zh: "快点儿", exEn: "Hurry up! We're late.", exZh: "快点儿！我们迟到了。" },
          { en: "What time is it?", zh: "几点了？", exEn: "What time is it now?", exZh: "现在几点了？" },
          { en: "I'm coming!", zh: "我来了！", exEn: "Wait for me. I'm coming!", exZh: "等等我。我来了！" },
          { en: "twenty", zh: "二十", exEn: "Twenty and ten is thirty.", exZh: "二十加十是三十。" },
          { en: "Come on!", zh: "赶快！加把劲！", exEn: "Come on! Let's go!", exZh: "快！走吧！" },
          { en: "class", zh: "课；一节课", exEn: "We have an English class.", exZh: "我们有一节英语课。" },
          { en: "eleven", zh: "十一", exEn: "Eleven and one is twelve.", exZh: "十一加一是十二。" },
          { en: "sport", zh: "体育运动", exEn: "I like sport.", exZh: "我喜欢体育运动。" },
          { en: "fifteen", zh: "十五", exEn: "It's four fifteen.", exZh: "四点十五分了。" },
          { en: "it's time to", zh: "到了……的时间了", exEn: "It's time to go home.", exZh: "到了回家的时间了。" },
          { en: "bed", zh: "床", exEn: "The cat is on the bed.", exZh: "猫在床上。" },
          { en: "Good night!", zh: "晚安！", exEn: "Good night, Mum!", exZh: "妈妈，晚安！" },
          { en: "week", zh: "周，星期", exEn: "There are seven days in a week.", exZh: "一周有七天。" },
          { en: "Monday", zh: "星期一", exEn: "We have PE on Monday.", exZh: "我们星期一有体育课。" },
          { en: "Tuesday", zh: "星期二", exEn: "Today is Tuesday.", exZh: "今天是星期二。" },
          { en: "Wednesday", zh: "星期三", exEn: "Wednesday comes after Tuesday.", exZh: "星期三在星期二之后。" },
          { en: "Thursday", zh: "星期四", exEn: "What day is it? It's Thursday.", exZh: "今天星期几？星期四。" },
          { en: "Friday", zh: "星期五", exEn: "Friday is fun.", exZh: "星期五很开心。" },
          { en: "Saturday", zh: "星期六", exEn: "I don't go to school on Saturday.", exZh: "我星期六不上学。" },
          { en: "Sunday", zh: "星期日", exEn: "We fly kites on Sunday.", exZh: "我们星期日放风筝。" },
          { en: "When", zh: "什么时候", exEn: "When do you get up?", exZh: "你什么时候起床？" },
          { en: "today", zh: "今天", exEn: "What day is it today?", exZh: "今天星期几？" },
          { en: "What day is it today?", zh: "今天星期几？", exEn: "What day is it today? It's Monday.", exZh: "今天星期几？星期一。" },
          { en: "every", zh: "每一个，每个", exEn: "I read every day.", exZh: "我每天都阅读。" },
          { en: "at", zh: "在（某时间）", exEn: "We have lunch at twelve.", exZh: "我们十二点吃午饭。" }
        ],
        sentences: [
          { en: "What time is it?", zh: "几点了？" },
          { en: "It's seven o'clock.", zh: "七点了。" },
          { en: "It's time to go to bed.", zh: "该上床睡觉了。" },
          { en: "Hurry up! We're late.", zh: "快点儿！我们迟到了。" },
          { en: "What day is it today?", zh: "今天星期几？" },
          { en: "It's Wednesday.", zh: "今天是星期三。" }
        ],
        grammar: [
          {
            title: "What time is it? 问时间",
            explain: ["问几点：What time is it?", "回答：It's + 数字 (+ o'clock)：It's seven. / It's seven o'clock.", "几点半：It's six thirty.（六点半）"],
            examples: [
              { en: "— What time is it? — It's seven o'clock.", zh: "—几点了？—七点了。" },
              { en: "It's four fifteen.", zh: "四点十五分了。" }
            ],
            quiz: [
              { q: "— What time is it? — ______ seven o'clock.", options: ["It's", "Is it", "Its", "This is"], answer: 0, explain: "回答时间用 It's 开头；Its（没有撇号）是“它的”。" }
            ]
          },
          {
            title: "It's time to … 与 It's time for …",
            explain: ["It's time to + 动词原形：It's time to go to bed.", "It's time for + 名词：It's time for class."],
            examples: [
              { en: "It's time to go to bed.", zh: "该上床睡觉了。" },
              { en: "It's time for class.", zh: "该上课了。" }
            ],
            quiz: [
              { q: "该回家了：It's time ______ go home.", options: ["for", "to", "at", "of"], answer: 1, explain: "to 后面接动词原形：It's time to go home." }
            ]
          },
          {
            title: "What day is it today? 问星期",
            explain: ["问今天星期几：What day is it today?", "回答：It's + 星期：It's Monday. / It's Sunday.", "一周七天首字母要大写：Monday, Tuesday, Wednesday…"],
            examples: [
              { en: "— What day is it today? — It's Wednesday.", zh: "—今天星期几？—星期三。" },
              { en: "We have PE on Monday.", zh: "我们星期一有体育课。" }
            ],
            quiz: [
              { q: "— What day is it today? — ______ Friday.", options: ["It's", "Is", "Today is the", "This"], answer: 0, explain: "回答星期用 It's + 星期名。" }
            ]
          }
        ]
      },
      {
        id: "u4",
        no: 4,
        title: "After School",
        titleZh: "放学后",
        emoji: "⚽",
        words: [
          { en: "dancing", zh: "跳舞，舞蹈", exEn: "I like dancing.", exZh: "我喜欢跳舞。" },
          { en: "lesson", zh: "一节课，一课时", exEn: "I have a dancing lesson.", exZh: "我有一节舞蹈课。" },
          { en: "after school", zh: "放学后", exEn: "What do you do after school?", exZh: "放学后你做什么？" },
          { en: "cinema", zh: "电影院", exEn: "Let's go to the cinema.", exZh: "我们去看电影吧。" },
          { en: "dog", zh: "狗（动物）", exEn: "The dog is cute.", exZh: "这只狗很可爱。" },
          { en: "walk", zh: "走，遛", exEn: "I walk my dog after school.", exZh: "放学后我遛狗。" },
          { en: "tomorrow", zh: "明天，在明天", exEn: "See you tomorrow!", exZh: "明天见！" },
          { en: "free", zh: "空闲的", exEn: "Are you free now?", exZh: "你现在有空吗？" },
          { en: "See you tomorrow!", zh: "明天见！", exEn: "OK! See you tomorrow!", exZh: "好！明天见！" },
          { en: "play", zh: "打（球），踢（球）", exEn: "Let's play football.", exZh: "我们踢足球吧。" },
          { en: "football", zh: "足球", exEn: "I can play football.", exZh: "我会踢足球。" },
          { en: "ping-pong", zh: "乒乓球", exEn: "Ping-pong is fun.", exZh: "乒乓球很有趣。" },
          { en: "basketball", zh: "篮球", exEn: "He can play basketball well.", exZh: "他篮球打得好。" },
          { en: "great", zh: "非常的，极好的", exEn: "That's great!", exZh: "太棒了！" },
          { en: "swimming", zh: "游泳", exEn: "I go swimming on Sunday.", exZh: "我星期日去游泳。" },
          { en: "so", zh: "（表示程度）这么，那么", exEn: "The cake is so nice.", exZh: "蛋糕真好吃。" },
          { en: "well", zh: "好", exEn: "Well played!", exZh: "打得好！" },
          { en: "Have a go!", zh: "试一试！", exEn: "Have a go! You can do it.", exZh: "试一试！你能行。" },
          { en: "difficult", zh: "难的，不容易的", exEn: "It's not difficult.", exZh: "这不难。" },
          { en: "It's OK.", zh: "没关系。", exEn: "It's OK. Try again.", exZh: "没关系。再试试。" },
          { en: "Well played!", zh: "好球！", exEn: "Well played! What a goal!", exZh: "好球！进球真棒！" }
        ],
        sentences: [
          { en: "What do you do after school?", zh: "放学后你做什么？" },
          { en: "I have a dancing lesson today.", zh: "我今天有一节舞蹈课。" },
          { en: "Let's play ping-pong!", zh: "我们打乒乓球吧！" },
          { en: "Can you play basketball?", zh: "你会打篮球吗？" },
          { en: "Have a go!", zh: "试一试！" },
          { en: "Well played!", zh: "好球！" }
        ],
        grammar: [
          {
            title: "can 表示“会、能”",
            explain: ["can 后面接动词原形：I can play football.", "问句：Can you …? 回答：Yes, I can. / No, I can't.", "can't = cannot，表示“不会、不能”"],
            examples: [
              { en: "Can you play ping-pong?", zh: "你会打乒乓球吗？" },
              { en: "No, I can't. But I can dance!", zh: "不，我不会。但我会跳舞！" }
            ],
            quiz: [
              { q: "— Can you play football? — No, ______.", options: ["I don't", "I'm not", "I can't", "I not can"], answer: 2, explain: "用 can 提问，用 can 回答：Yes, I can. / No, I can't." }
            ]
          },
          {
            title: "play + 球类",
            explain: ["play 后面接球类运动时不加 the：play basketball / play football / play ping-pong"],
            examples: [
              { en: "I can play basketball well.", zh: "我篮球打得好。" }
            ],
            quiz: [
              { q: "我会打篮球：I can play ______ basketball.", options: ["a", "an", "the", "（不加冠词）"], answer: 3, explain: "球类运动前不加 a/an/the。" }
            ]
          },
          {
            title: "either 也（不）",
            explain: ["too 用在肯定句句末：I can dance, too.", "either 用在否定句句末：I can't play ping-pong either."],
            examples: [
              { en: "I can't play ping-pong either.", zh: "我也不会打乒乓球。" }
            ],
            quiz: [
              { q: "I can't dance. Tom can't dance ______.", options: ["too", "either", "and", "but"], answer: 1, explain: "否定句句末用 either 表示“也（不）”。" }
            ]
          }
        ]
      },
      {
        id: "u5",
        no: 5,
        title: "Our Toys",
        titleZh: "我们的玩具",
        emoji: "🪆",
        words: [
          { en: "different", zh: "不同的，有区别的", exEn: "These two dolls are different.", exZh: "这两个娃娃不一样。" },
          { en: "same", zh: "相同的，同一的", exEn: "We have the same bag.", exZh: "我们有一样的包。" },
          { en: "hair", zh: "头发", exEn: "Her hair is long.", exZh: "她的头发长。" },
          { en: "eye", zh: "眼睛", exEn: "His eyes are big.", exZh: "他的眼睛大。" },
          { en: "ear", zh: "耳朵", exEn: "The robot has big ears.", exZh: "这个机器人耳朵大。" },
          { en: "mouth", zh: "嘴，口", exEn: "Her mouth is small.", exZh: "她的嘴巴小。" },
          { en: "arm", zh: "手臂", exEn: "The robot's arms are long.", exZh: "机器人的手臂长。" },
          { en: "leg", zh: "腿", exEn: "The doll has short legs.", exZh: "这个娃娃腿短。" },
          { en: "robot", zh: "机器人", exEn: "Look at my robot.", exZh: "看我的机器人。" },
          { en: "his", zh: "他的", exEn: "This is his ball.", exZh: "这是他的球。" },
          { en: "tall", zh: "高的", exEn: "My brother is tall.", exZh: "我哥哥个子高。" },
          { en: "doll", zh: "玩具娃娃", exEn: "Her doll is cute.", exZh: "她的娃娃很可爱。" },
          { en: "small", zh: "小的", exEn: "The car is small.", exZh: "这辆汽车很小。" },
          { en: "her", zh: "她的", exEn: "That's her book.", exZh: "那是她的书。" },
          { en: "bring", zh: "带来", exEn: "Bring your toys to school.", exZh: "把你的玩具带来学校。" },
          { en: "lots of", zh: "大量，许多", exEn: "I have lots of books.", exZh: "我有很多书。" },
          { en: "have", zh: "组织，举办", exEn: "We have a toy show.", exZh: "我们举办玩具展览。" }
        ],
        sentences: [
          { en: "Look at this robot.", zh: "看这个机器人。" },
          { en: "He is tall.", zh: "他个子高。" },
          { en: "His hair is short.", zh: "他的头发是短的。" },
          { en: "Her eyes are big.", zh: "她的眼睛大大的。" },
          { en: "The doll has a small mouth.", zh: "这个娃娃嘴巴小小的。" },
          { en: "They look the same.", zh: "它们看起来一样。" }
        ],
        grammar: [
          {
            title: "his 与 her",
            explain: ["his 他的（男孩/男人），her 她的（女孩/女人）", "后面直接接名词：his hair, her eyes"],
            examples: [
              { en: "This is Tom. His robot is cool.", zh: "这是汤姆。他的机器人很酷。" },
              { en: "This is Amy. Her doll is cute.", zh: "这是艾米。她的娃娃很可爱。" }
            ],
            quiz: [
              { q: "Look at the girl. ______ hair is long.", options: ["His", "Her", "She", "He"], answer: 1, explain: "girl 是女孩，用 her。" }
            ]
          },
          {
            title: "is 与 are 描述部位",
            explain: ["单个部位用 is：His nose is small.", "成对的部位（两只眼、两只耳）用 are：Her eyes are big."],
            examples: [
              { en: "The robot's arms are long.", zh: "机器人的手臂长。" }
            ],
            quiz: [
              { q: "His eyes ______ big.", options: ["is", "am", "are", "be"], answer: 2, explain: "eyes 是复数，用 are。" }
            ]
          },
          {
            title: "tall / small / big 描述外形",
            explain: ["tall 高的，small 小的，big 大的，long 长的，short 短的", "He is tall. / The doll has short legs."],
            examples: [
              { en: "The robot is tall and cool.", zh: "这个机器人又高又酷。" }
            ],
            quiz: [
              { q: "这个娃娃很小：The doll is ______.", options: ["small", "tall", "same", "bring"], answer: 0, explain: "small 小的；tall 高的。" }
            ]
          }
        ]
      },
      {
        id: "u6",
        no: 6,
        title: "Weather",
        titleZh: "天气",
        emoji: "🌤️",
        words: [
          { en: "weather", zh: "天气，气象", exEn: "What's the weather like?", exZh: "天气怎么样？" },
          { en: "sunny", zh: "晴朗的", exEn: "It's sunny today.", exZh: "今天晴朗。" },
          { en: "cloudy", zh: "多云的，阴天的", exEn: "It's cloudy now.", exZh: "现在是阴天。" },
          { en: "rainy", zh: "阴雨的，多雨的", exEn: "I don't like rainy days.", exZh: "我不喜欢雨天。" },
          { en: "cool", zh: "凉爽的", exEn: "It's cool in the morning.", exZh: "早晨很凉爽。" },
          { en: "warm", zh: "温暖的，暖和的", exEn: "Spring is warm.", exZh: "春天很温暖。" },
          { en: "hot", zh: "温度高的，热的", exEn: "It's hot in summer.", exZh: "夏天很热。" },
          { en: "windy", zh: "多风的，风大的", exEn: "It's windy today.", exZh: "今天风大。" },
          { en: "save for a rainy day", zh: "未雨绸缪", exEn: "We save money for a rainy day.", exZh: "我们存钱以备不时之需。" },
          { en: "money", zh: "钱", exEn: "I have some money.", exZh: "我有一些钱。" },
          { en: "What's the weather like today?", zh: "今天天气怎么样？", exEn: "What's the weather like today? It's sunny.", exZh: "今天天气怎么样？晴天。" },
          { en: "park", zh: "公园", exEn: "We go to the park.", exZh: "我们去公园。" },
          { en: "fly a kite", zh: "放风筝", exEn: "Let's fly a kite.", exZh: "我们放风筝吧。" },
          { en: "It's raining.", zh: "下雨了。", exEn: "It's raining. Take an umbrella.", exZh: "下雨了。带上雨伞。" },
          { en: "worry", zh: "担心，忧虑", exEn: "Don't worry.", exZh: "别担心。" },
          { en: "umbrella", zh: "伞，雨伞", exEn: "This umbrella is big.", exZh: "这把伞很大。" },
          { en: "there", zh: "到那里，在那里", exEn: "Let's go there.", exZh: "我们去那里吧。" }
        ],
        sentences: [
          { en: "What's the weather like today?", zh: "今天天气怎么样？" },
          { en: "It's sunny and warm.", zh: "晴朗又温暖。" },
          { en: "It's raining.", zh: "下雨了。" },
          { en: "Let's fly a kite!", zh: "我们去放风筝吧！" },
          { en: "Take an umbrella with you.", zh: "带上雨伞。" },
          { en: "Don't worry.", zh: "别担心。" }
        ],
        grammar: [
          {
            title: "What's the weather like…? 问天气",
            explain: ["问天气：What's the weather like today?", "回答用 It's + 天气词：It's sunny. / It's rainy."],
            examples: [
              { en: "— What's the weather like today? — It's sunny.", zh: "—今天天气怎么样？—晴天。" }
            ],
            quiz: [
              { q: "— ______ the weather like today? — It's cloudy.", options: ["What's", "How's", "Where's", "Who's"], answer: 0, explain: "问天气固定说法：What's the weather like?" }
            ]
          },
          {
            title: "It's + 天气词 描述天气",
            explain: ["sunny / cloudy / rainy / windy / hot / warm / cool / cold 都可以放在 It's 后面", "It's hot in summer. 夏天很热。"],
            examples: [
              { en: "It's warm in spring. It's cold in winter.", zh: "春天温暖，冬天寒冷。" }
            ],
            quiz: [
              { q: "今天刮风：______ windy today.", options: ["It's", "It", "Its", "Is it"], answer: 0, explain: "描述天气用 It's + 天气词。" }
            ]
          },
          {
            title: "Don't worry. 安慰别人",
            explain: ["worry 担心，忧虑。", "安慰别人说：Don't worry.（别担心。）祈使句用动词原形开头，否定用 Don't。"],
            examples: [
              { en: "— It's raining! — Don't worry. We have umbrellas.", zh: "—下雨了！—别担心。我们有雨伞。" }
            ],
            quiz: [
              { q: "安慰别人“别担心”：______", options: ["Don't worry.", "No worry.", "Not worry.", "You don't worry."], answer: 0, explain: "否定祈使句用 Don't + 动词原形：Don't worry." }
            ]
          }
        ]
      },
      {
        id: "u7",
        no: 7,
        title: "Seasons",
        titleZh: "四季",
        emoji: "🍂",
        words: [
          { en: "season", zh: "季节", exEn: "Which season do you like?", exZh: "你喜欢哪个季节？" },
          { en: "spring", zh: "春天，春季", exEn: "It's warm in spring.", exZh: "春天很温暖。" },
          { en: "go boating", zh: "去划船", exEn: "We go boating in spring.", exZh: "我们春天去划船。" },
          { en: "winter", zh: "冬天，冬季", exEn: "It's cold in winter.", exZh: "冬天很冷。" },
          { en: "go skating", zh: "去滑冰，去溜冰", exEn: "We go skating in winter.", exZh: "我们冬天去滑冰。" },
          { en: "summer", zh: "夏天，夏季", exEn: "It's hot in summer.", exZh: "夏天很热。" },
          { en: "ice cream", zh: "冰激凌", exEn: "I like ice cream.", exZh: "我喜欢冰激凌。" },
          { en: "go swimming", zh: "去游泳", exEn: "We go swimming in summer.", exZh: "我们夏天去游泳。" },
          { en: "autumn", zh: "秋天", exEn: "Autumn is cool.", exZh: "秋天很凉爽。" },
          { en: "go climbing", zh: "去爬山", exEn: "Let's go climbing.", exZh: "我们去爬山吧。" },
          { en: "new", zh: "新的", exEn: "My bike is new.", exZh: "我的自行车是新的。" },
          { en: "cold", zh: "寒冷的，冷的", exEn: "It's cold today.", exZh: "今天很冷。" },
          { en: "bird", zh: "鸟", exEn: "Birds fly back in spring.", exZh: "春天鸟儿飞回来。" },
          { en: "back", zh: "回原处", exEn: "The birds come back.", exZh: "鸟儿们回来了。" },
          { en: "nose", zh: "鼻子", exEn: "The snowman has a long nose.", exZh: "雪人有个长鼻子。" },
          { en: "year", zh: "年", exEn: "Happy New Year!", exZh: "新年快乐！" },
          { en: "plant", zh: "栽种，种植", exEn: "We plant trees in spring.", exZh: "我们春天种树。" },
          { en: "pick", zh: "采，摘", exEn: "We pick apples in autumn.", exZh: "我们秋天摘苹果。" },
          { en: "snow", zh: "雪，积雪", exEn: "Look at the snow!", exZh: "看那雪！" },
          { en: "know", zh: "知道", exEn: "I know this story.", exZh: "我知道这个故事。" }
        ],
        sentences: [
          { en: "What season is it?", zh: "这是什么季节？" },
          { en: "It's warm in spring.", zh: "春天很温暖。" },
          { en: "We go swimming in summer.", zh: "夏天我们去游泳。" },
          { en: "It's cold in winter.", zh: "冬天很冷。" },
          { en: "We plant trees in spring.", zh: "我们春天种树。" },
          { en: "Birds come back in spring.", zh: "春天鸟儿飞回来了。" }
        ],
        grammar: [
          {
            title: "in + 季节",
            explain: ["季节前用 in：in spring / in summer / in autumn / in winter", "It's warm in spring. 春天很温暖。"],
            examples: [
              { en: "We go swimming in summer.", zh: "我们夏天去游泳。" },
              { en: "It's cold in winter.", zh: "冬天很冷。" }
            ],
            quiz: [
              { q: "春天我们种树：We plant trees ______ spring.", options: ["in", "on", "at", "to"], answer: 0, explain: "季节前用 in：in spring。" }
            ]
          },
          {
            title: "go + 动词-ing 去做活动",
            explain: ["go swimming 去游泳，go boating 去划船，go skating 去滑冰，go climbing 去爬山", "go 后面的动词要加 -ing"],
            examples: [
              { en: "Let's go boating.", zh: "我们去划船吧。" },
              { en: "We go skating in winter.", zh: "我们冬天去滑冰。" }
            ],
            quiz: [
              { q: "去游泳：go ______", options: ["swim", "swimming", "swims", "to swim"], answer: 1, explain: "go 后面的动词加 -ing：go swimming." }
            ]
          },
          {
            title: "What season…? 问季节",
            explain: ["问季节：What season is it?", "回答：It's spring. / It's winter."],
            examples: [
              { en: "— What season is it? — It's spring. It's warm.", zh: "—这是什么季节？—春天。很温暖。" }
            ],
            quiz: [
              { q: "— What season is it? — ______", options: ["It's winter.", "It's Monday.", "It's sunny.", "It's seven."], answer: 0, explain: "问季节用季节名回答：It's winter." }
            ]
          }
        ]
      },
      {
        id: "u8",
        no: 8,
        title: "Clothes",
        titleZh: "衣服",
        emoji: "👕",
        words: [
          { en: "wear", zh: "穿，戴", exEn: "I wear a coat today.", exZh: "我今天穿外套。" },
          { en: "cap", zh: "（常指有帽舌的）便帽", exEn: "His cap is blue.", exZh: "他的帽子是蓝色的。" },
          { en: "coat", zh: "外套，外衣", exEn: "This coat is warm.", exZh: "这件外套很暖和。" },
          { en: "skirt", zh: "半身裙", exEn: "Her skirt is nice.", exZh: "她的裙子很好看。" },
          { en: "trousers", zh: "裤子", exEn: "These trousers are long.", exZh: "这条裤子长。" },
          { en: "dress", zh: "连衣裙", exEn: "What a nice dress!", exZh: "多漂亮的连衣裙啊！" },
          { en: "shirt", zh: "（男式）衬衫", exEn: "His shirt is white.", exZh: "他的衬衫是白色的。" },
          { en: "shorts", zh: "短裤", exEn: "I wear shorts in summer.", exZh: "我夏天穿短裤。" },
          { en: "whose", zh: "谁的", exEn: "Whose ball is this?", exZh: "这是谁的球？" },
          { en: "look", zh: "看来好像，显得", exEn: "You look great!", exZh: "你看起来真棒！" },
          { en: "in", zh: "穿着；戴着", exEn: "The girl in red is my sister.", exZh: "穿红衣服的女孩是我妹妹。" },
          { en: "sunglasses", zh: "太阳镜，墨镜", exEn: "I have sunglasses.", exZh: "我有太阳镜。" },
          { en: "why", zh: "为什么", exEn: "Why do you like it?", exZh: "你为什么喜欢它？" },
          { en: "because", zh: "因为", exEn: "Because it's cool.", exZh: "因为它很酷。" },
          { en: "bright", zh: "明亮的；鲜艳的", exEn: "The dress is bright.", exZh: "这条连衣裙颜色鲜艳。" },
          { en: "clothes", zh: "衣服", exEn: "Wash your clothes.", exZh: "洗你的衣服。" }
        ],
        sentences: [
          { en: "Whose dress is this?", zh: "这是谁的连衣裙？" },
          { en: "It's my dress.", zh: "是我的连衣裙。" },
          { en: "Look at his new coat.", zh: "看他的新外套。" },
          { en: "You look great!", zh: "你看起来真棒！" },
          { en: "Why do you like it?", zh: "你为什么喜欢它？" },
          { en: "Because it's bright and nice.", zh: "因为它鲜艳又好看。" }
        ],
        grammar: [
          {
            title: "Whose…? 问归属",
            explain: ["Whose + 东西 + is this? 这是谁的……？", "回答：It's my dress. / It's his cap.（也可以说人名+'s：It's Yang Ling's.）"],
            examples: [
              { en: "— Whose cap is this? — It's my cap.", zh: "—这是谁的帽子？—是我的帽子。" }
            ],
            quiz: [
              { q: "— ______ skirt is this? — It's her skirt.", options: ["Whose", "Who's", "What", "Which"], answer: 0, explain: "问归属用 Whose（谁的）；Who's = Who is（谁是）。" }
            ]
          },
          {
            title: "Why…? Because… 问答原因",
            explain: ["Why 问为什么，Because 回答因为。", "Why do you like it? — Because it's nice."],
            examples: [
              { en: "— Why do you like the coat? — Because it's warm.", zh: "—你为什么喜欢这件外套？—因为它很暖和。" }
            ],
            quiz: [
              { q: "— ______ do you like it? — Because it's bright.", options: ["Why", "What", "Whose", "When"], answer: 0, explain: "问原因用 Why，回答用 Because。" }
            ]
          },
          {
            title: "You look + 形容词",
            explain: ["look 看起来：You look great! 你看起来真棒！", "look 后面接形容词，描述看上去的样子。"],
            examples: [
              { en: "You look great in the new coat!", zh: "你穿新外套看起来真棒！" }
            ],
            quiz: [
              { q: "你看起来真棒：You ______ great!", options: ["look", "looks", "looking", "look at"], answer: 0, explain: "You 后面动词用原形 look；look at 是“看着”，后面接东西。" }
            ]
          }
        ]
      }
    ]
  };
})(window);
