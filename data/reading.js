/* 课外阅读内容（V2.0 新增）
 *
 * 内容来源与版权说明：
 * - 标注 original 的文章为本工具原创编写的分级读物，可自由使用；
 * - 标注 aesop 的文章改编自《伊索寓言》（Aesop's Fables，公有领域），
 *   原文可在美国 Project Gutenberg（古登堡计划）免费查阅；
 * - 中文翻译由本工具翻译整理；
 * - 每篇文章附词汇表与阅读理解题（含原文依据），均为本工具编写；
 * - 视频资源为外部平台公开链接导航，本工具未抓取、也未翻译任何视频字幕，
 *   “学习重点”为人工整理的复习提示，不代表视频内容本身。
 */
(function (global) {
  "use strict";

  global.READING_CONTENT = {
    updatedAt: "2026-10-29",
    note: "阅读文章由本工具原创编写或改编自公有领域经典（伊索寓言），来源逐篇标注；视频为外部平台真实链接导航，未集成字幕与播放，需相应网络环境访问。",
    categories: [
      { key: "graded", name: "分级阅读", emoji: "📚" },
      { key: "story", name: "短篇故事", emoji: "🧚" },
      { key: "science", name: "自然与科学", emoji: "🔭" },
      { key: "life", name: "日常与校园", emoji: "🏫" },
      { key: "classic", name: "绘本与经典", emoji: "🏆" }
    ],
    articles: [
      {
        id: "a1",
        title: "Momo's Day",
        titleZh: "Momo 的一天",
        category: "graded",
        level: 1,
        minutes: 3,
        source: "original",
        sourceNote: "本工具原创分级读物（入门级）",
        sourceUrl: "",
        paragraphs: [
          { en: "Momo is a little panda. She is three years old.", zh: "Momo 是一只小熊猫。她三岁。" },
          { en: "Every morning, Momo gets up early. She eats bamboo for breakfast.", zh: "每天早上，Momo 早早起床。她吃竹子当早餐。" },
          { en: "After breakfast, she plays with her friend Lele. They run and jump in the forest.", zh: "早饭后，她和朋友乐乐一起玩。他们在森林里跑呀跳呀。" },
          { en: "Momo can climb trees very well. Lele cannot climb, but he can swim.", zh: "Momo 爬树爬得很好。乐乐不会爬树，但是他会游泳。" },
          { en: "In the afternoon, Momo is tired. She sits under a big tree.", zh: "下午，Momo 累了。她坐在一棵大树下。" },
          { en: "What a happy day for little Momo!", zh: "对小 Momo 来说，这是多么快乐的一天啊！" }
        ],
        vocab: [
          { en: "panda", zh: "熊猫", pos: "n." },
          { en: "bamboo", zh: "竹子", pos: "n." },
          { en: "forest", zh: "森林", pos: "n." },
          { en: "climb", zh: "爬", pos: "v." },
          { en: "tired", zh: "累的", pos: "adj." },
          { en: "afternoon", zh: "下午", pos: "n." }
        ],
        questions: [
          { type: "choice", q: "What does Momo eat for breakfast?", options: ["Rice", "Bamboo", "Fish", "Apples"], answer: 1, evidence: "She eats bamboo for breakfast.", explain: "原文说 She eats bamboo for breakfast，早餐吃竹子。" },
          { type: "choice", q: "Who can swim?", options: ["Momo", "Lele", "Both of them", "No one"], answer: 1, evidence: "Lele cannot climb, but he can swim.", explain: "乐乐不会爬树，但他会游泳。" },
          { type: "choice", q: "Where does Momo sit in the afternoon?", options: ["In the water", "Under a big tree", "On the sofa", "In the kitchen"], answer: 1, evidence: "She sits under a big tree.", explain: "下午她坐在一棵大树下。" }
        ]
      },
      {
        id: "a2",
        title: "A Day at the Snack Bar",
        titleZh: "在小吃店的一天",
        category: "life",
        level: 1,
        minutes: 3,
        source: "original",
        sourceNote: "本工具原创（呼应教材 Unit 6 At the snack bar）",
        sourceUrl: "",
        paragraphs: [
          { en: "It is Sunday. Tom and his dad go to a snack bar.", zh: "今天是星期天。汤姆和爸爸去小吃店。" },
          { en: "\"Can I help you?\" the man asks. \"A hamburger and a glass of milk, please,\" says Dad.", zh: "“您要点什么？”店员问。“请给我一个汉堡包和一杯牛奶，”爸爸说。" },
          { en: "Tom would like some noodles and a cup of orange juice.", zh: "汤姆想要一些面条和一杯橙汁。" },
          { en: "\"Anything else?\" \"No, thank you.\"", zh: "“还要别的吗？”“不用了，谢谢。”" },
          { en: "The food is nice. Tom eats all his noodles. He is full and happy.", zh: "食物很好吃。汤姆吃完了所有的面条。他又饱又开心。" },
          { en: "How much is the food? Thirty-six yuan. What a nice day!", zh: "这些食物多少钱？三十六元。多美好的一天！" }
        ],
        vocab: [
          { en: "snack bar", zh: "小吃店", pos: "n." },
          { en: "would like", zh: "想要", pos: "短语" },
          { en: "juice", zh: "果汁", pos: "n." },
          { en: "full", zh: "饱的", pos: "adj." },
          { en: "Sunday", zh: "星期天", pos: "n." },
          { en: "ask", zh: "问", pos: "v." }
        ],
        questions: [
          { type: "choice", q: "Where do Tom and his dad go?", options: ["A school", "A snack bar", "A zoo", "A park"], answer: 1, evidence: "Tom and his dad go to a snack bar.", explain: "第一句就告诉我们他们去小吃店。" },
          { type: "choice", q: "What would Tom like?", options: ["A hamburger", "Some rice", "Noodles and juice", "A cup of tea"], answer: 2, evidence: "Tom would like some noodles and a cup of orange juice.", explain: "汤姆想要面条和橙汁。" },
          { type: "judge", q: "Tom eats all his noodles.", options: ["正确", "错误"], answer: 0, evidence: "Tom eats all his noodles.", explain: "原文写明 Tom eats all his noodles。" },
          { type: "choice", q: "How much is the food?", options: ["13 yuan", "30 yuan", "36 yuan", "63 yuan"], answer: 2, evidence: "How much is the food? Thirty-six yuan.", explain: "三十六元。" }
        ]
      },
      {
        id: "a3",
        title: "My New Home",
        titleZh: "我的新家",
        category: "life",
        level: 1,
        minutes: 3,
        source: "original",
        sourceNote: "本工具原创（呼应教材 Unit 5 Our new home）",
        sourceUrl: "",
        paragraphs: [
          { en: "My name is Amy. This is my new home. It is not big, but it is nice.", zh: "我叫艾米。这是我的新家。它不大，但是很好。" },
          { en: "Look at the living room. There is a blue sofa in it. I like to read books on the sofa.", zh: "看客厅。里面有一张蓝色的沙发。我喜欢坐在沙发上看书。" },
          { en: "The kitchen is big. Mum can cook nice food in it. Mmm, I can smell the rice!", zh: "厨房很大。妈妈能在里面做好吃的饭菜。嗯，我已经闻到米饭的香味啦！" },
          { en: "This is my bedroom. It is small and clean. My clock is on the table.", zh: "这是我的卧室。它又小又干净。我的钟在桌子上。" },
          { en: "Where is the bathroom? It is next to my bedroom.", zh: "卫生间在哪里？就在我的卧室旁边。" },
          { en: "I love my new home!", zh: "我爱我的新家！" }
        ],
        vocab: [
          { en: "living room", zh: "客厅", pos: "n." },
          { en: "kitchen", zh: "厨房", pos: "n." },
          { en: "bedroom", zh: "卧室", pos: "n." },
          { en: "bathroom", zh: "卫生间", pos: "n." },
          { en: "clean", zh: "干净的", pos: "adj." },
          { en: "next to", zh: "在……旁边", pos: "短语" }
        ],
        questions: [
          { type: "choice", q: "What is in the living room?", options: ["A TV", "A blue sofa", "A bed", "A fridge"], answer: 1, evidence: "There is a blue sofa in it.", explain: "客厅里有一张蓝色沙发。" },
          { type: "choice", q: "Who cooks nice food?", options: ["Amy", "Amy's dad", "Amy's mum", "Amy's friend"], answer: 2, evidence: "Mum can cook nice food in it.", explain: "是妈妈做饭。" },
          { type: "judge", q: "Amy's new home is very big.", options: ["正确", "错误"], answer: 1, evidence: "It is not big, but it is nice.", explain: "原文说 It is not big，所以是错误。" }
        ]
      },
      {
        id: "a4",
        title: "The Little Red Kite",
        titleZh: "红红的小风筝",
        category: "story",
        level: 1,
        minutes: 3,
        source: "original",
        sourceNote: "本工具原创短篇故事",
        sourceUrl: "",
        paragraphs: [
          { en: "Lily has a little red kite. She wants to fly it in the park.", zh: "莉莉有一只红色的小风筝。她想去公园里放风筝。" },
          { en: "But there is no wind. The kite cannot fly. Lily is sad.", zh: "可是没有风。风筝飞不起来。莉莉很难过。" },
          { en: "\"Don't be sad,\" says Dad. \"Let's wait. The wind will come.\"", zh: "“别难过，”爸爸说。“我们等一等，风会来的。”" },
          { en: "They wait and wait. Now the wind comes! The kite flies up, up, up!", zh: "他们等啊等。风来了！风筝飞呀飞呀，飞上了天！" },
          { en: "\"Look at my kite! It can fly high!\" Lily is so happy.", zh: "“看我的风筝！它能飞得好高！”莉莉特别开心。" },
          { en: "A good thing always comes to those who wait.", zh: "美好的事情，总会来到愿意耐心等待的人身边。" }
        ],
        vocab: [
          { en: "kite", zh: "风筝", pos: "n." },
          { en: "fly", zh: "飞；放（风筝）", pos: "v." },
          { en: "wind", zh: "风", pos: "n." },
          { en: "wait", zh: "等待", pos: "v." },
          { en: "high", zh: "高的", pos: "adj." },
          { en: "sad", zh: "难过的", pos: "adj." }
        ],
        questions: [
          { type: "choice", q: "Why can't the kite fly at first?", options: ["It is broken", "There is no wind", "It is raining", "It is too big"], answer: 1, evidence: "But there is no wind.", explain: "一开始没有风，风筝飞不起来。" },
          { type: "choice", q: "Who says \"Don't be sad\"?", options: ["Mum", "Dad", "Lily's friend", "Lily"], answer: 1, evidence: "\"Don't be sad,\" says Dad.", explain: "是爸爸安慰莉莉。" },
          { type: "choice", q: "How does Lily feel at last?", options: ["Sad", "Angry", "Happy", "Tired"], answer: 2, evidence: "Lily is so happy.", explain: "风筝飞起来后 Lily is so happy。" }
        ]
      },
      {
        id: "a5",
        title: "The Tortoise and the Hare",
        titleZh: "龟兔赛跑",
        category: "classic",
        level: 1,
        minutes: 4,
        source: "aesop",
        sourceNote: "改编自《伊索寓言》（公有领域），原文见 Project Gutenberg",
        sourceUrl: "https://www.gutenberg.org/ebooks/21",
        paragraphs: [
          { en: "A hare can run very fast. A tortoise walks very slowly.", zh: "野兔跑得很快。乌龟走得很慢。" },
          { en: "\"You are so slow!\" laughs the hare. \"Let's have a race!\"", zh: "“你可真慢呀！”野兔笑道。“我们来比赛跑步吧！”" },
          { en: "The race starts. The hare runs far, far away. The tortoise walks on and on.", zh: "比赛开始了。野兔跑得远远的。乌龟一步一步地往前走。" },
          { en: "The hare stops under a big tree. \"I can sleep now,\" he says.", zh: "野兔在一棵大树下停了下来。“我现在可以睡一觉，”他说。" },
          { en: "The tortoise does not stop. He walks and walks. At last, he gets to the tree first!", zh: "乌龟没有停下。他走呀走呀。最后，他先到达了终点的大树！" },
          { en: "Slow but steady wins the race.", zh: "慢而稳，才能赢得比赛。" }
        ],
        vocab: [
          { en: "hare", zh: "野兔", pos: "n." },
          { en: "tortoise", zh: "乌龟", pos: "n." },
          { en: "race", zh: "赛跑；比赛", pos: "n." },
          { en: "slowly", zh: "慢慢地", pos: "adv." },
          { en: "steady", zh: "平稳的；坚定的", pos: "adj." },
          { en: "win", zh: "赢", pos: "v." }
        ],
        questions: [
          { type: "choice", q: "Who can run very fast?", options: ["The tortoise", "The hare", "Both", "No one"], answer: 1, evidence: "A hare can run very fast.", explain: "野兔跑得很快。" },
          { type: "choice", q: "What does the hare do under the tree?", options: ["He runs on", "He sleeps", "He eats", "He cries"], answer: 1, evidence: "\"I can sleep now,\" he says.", explain: "野兔在树下睡觉。" },
          { type: "choice", q: "Who gets to the tree first?", options: ["The hare", "The tortoise", "Nobody", "We don't know"], answer: 1, evidence: "At last, he gets to the tree first!", explain: "乌龟坚持不停，先到终点。" },
          { type: "judge", q: "The hare walks on and on.", options: ["正确", "错误"], answer: 1, evidence: "The tortoise walks on and on.", explain: "坚持往前走的是乌龟，不是野兔。" }
        ]
      },
      {
        id: "a6",
        title: "The North Wind and the Sun",
        titleZh: "北风与太阳",
        category: "classic",
        level: 2,
        minutes: 4,
        source: "aesop",
        sourceNote: "改编自《伊索寓言》（公有领域），原文见 Project Gutenberg",
        sourceUrl: "https://www.gutenberg.org/ebooks/21",
        paragraphs: [
          { en: "The north wind and the sun can both be strong. One day, they have an argument.", zh: "北风和太阳都很强大。有一天，他们争论了起来。" },
          { en: "\"I am stronger than you!\" says the wind. \"No, I am stronger!\" says the sun.", zh: "“我比你更强大！”风说。“不，我更强！”太阳说。" },
          { en: "A man walks by. He wears a big coat.", zh: "一个男人路过。他穿着一件大外套。" },
          { en: "\"Let's see who can take off his coat,\" says the sun.", zh: "“我们比一比，谁能让他脱下外套，”太阳说。" },
          { en: "The wind blows and blows. But the man holds his coat tight.", zh: "风使劲地吹呀吹。可是男人把外套裹得更紧了。" },
          { en: "Then the sun shines warm and bright. The man feels hot. He takes off his coat.", zh: "然后，太阳温暖地照耀着。男人觉得热了，就脱下了外套。" },
          { en: "Kindness is better than force.", zh: "温和善良比强力更有用。" }
        ],
        vocab: [
          { en: "north wind", zh: "北风", pos: "n." },
          { en: "argument", zh: "争论", pos: "n." },
          { en: "coat", zh: "外套", pos: "n." },
          { en: "take off", zh: "脱下", pos: "短语" },
          { en: "blow", zh: "吹", pos: "v." },
          { en: "shine", zh: "照耀", pos: "v." }
        ],
        questions: [
          { type: "choice", q: "What does the man wear?", options: ["A hat", "A big coat", "A scarf", "A T-shirt"], answer: 1, evidence: "He wears a big coat.", explain: "男人穿着一件大外套。" },
          { type: "choice", q: "What does the wind do?", options: ["It shines", "It blows and blows", "It sleeps", "It sings"], answer: 1, evidence: "The wind blows and blows.", explain: "北风使劲地吹。" },
          { type: "choice", q: "Why does the man take off his coat?", options: ["He feels cold", "He feels hot", "The coat is old", "He wants to run"], answer: 1, evidence: "The man feels hot.", explain: "太阳晒得热了，他就脱下外套。" },
          { type: "choice", q: "Who wins at last?", options: ["The wind", "The sun", "The man", "No one"], answer: 1, evidence: "He takes off his coat.", explain: "太阳让他脱下了外套，所以太阳赢了。" }
        ]
      },
      {
        id: "a7",
        title: "Why Do Leaves Change Color?",
        titleZh: "树叶为什么会变色？",
        category: "science",
        level: 2,
        minutes: 4,
        source: "original",
        sourceNote: "本工具原创科普短文",
        sourceUrl: "",
        paragraphs: [
          { en: "In summer, leaves are green. But in autumn, many leaves turn yellow or red. Why?", zh: "夏天，树叶是绿色的。可是到了秋天，很多树叶变成了黄色或红色。为什么呢？" },
          { en: "Leaves are little food factories for trees.", zh: "树叶是树木的小小食物工厂。" },
          { en: "They use sunlight, water and air to make food. The green colour helps them do this job.", zh: "它们用阳光、水和空气制造养分。绿色能帮助它们完成这项工作。" },
          { en: "In autumn, days get shorter. There is less sunlight.", zh: "秋天，白天变短了，阳光也变少了。" },
          { en: "Trees do not need so much food in winter. So the green colour goes away little by little.", zh: "冬天，树木不需要那么多养分。于是绿色一点点褪去了。" },
          { en: "Then we can see yellow and red leaves. Isn't nature amazing?", zh: "这时我们就能看到黄色和红色的树叶。大自然是不是很神奇？" }
        ],
        vocab: [
          { en: "leaf", zh: "树叶（复数 leaves）", pos: "n." },
          { en: "autumn", zh: "秋天", pos: "n." },
          { en: "sunlight", zh: "阳光", pos: "n." },
          { en: "factory", zh: "工厂", pos: "n." },
          { en: "colour", zh: "颜色（英式拼写）", pos: "n." },
          { en: "amazing", zh: "神奇的", pos: "adj." }
        ],
        questions: [
          { type: "choice", q: "What colour are leaves in summer?", options: ["Yellow", "Red", "Green", "Brown"], answer: 2, evidence: "In summer, leaves are green.", explain: "夏天树叶是绿色的。" },
          { type: "choice", q: "What do leaves use to make food?", options: ["Sunlight, water and air", "Rice and fish", "Wind and rain", "Soil only"], answer: 0, evidence: "They use sunlight, water and air to make food.", explain: "树叶用阳光、水和空气制造养分。" },
          { type: "choice", q: "Why does the green colour go away?", options: ["The leaves are ill", "Trees do not need so much food in winter", "People paint the leaves", "The rain washes it away"], answer: 1, evidence: "Trees do not need so much food in winter.", explain: "冬天树木需要的养分变少，绿色就褪去了。" },
          { type: "judge", q: "Leaves can make food for trees.", options: ["正确", "错误"], answer: 0, evidence: "They use sunlight, water and air to make food.", explain: "树叶就像小小的食物工厂。" }
        ]
      },
      {
        id: "a8",
        title: "Amazing Animal Ears",
        titleZh: "动物们神奇的耳朵",
        category: "science",
        level: 2,
        minutes: 4,
        source: "original",
        sourceNote: "本工具原创科普短文",
        sourceUrl: "",
        paragraphs: [
          { en: "Animals have amazing ears. Let's look at three of them!", zh: "动物们的耳朵非常神奇。我们一起来看其中三种吧！" },
          { en: "A rabbit has long ears. They can hear very small sounds. This helps the rabbit run away fast.", zh: "兔子有长长的耳朵，能听到很小的声音。这能帮助兔子快速逃跑。" },
          { en: "A bat's ears are big, too. Bats cannot see well, but their ears help them find their way with sound at night.", zh: "蝙蝠的耳朵也很大。蝙蝠看不太清楚，但耳朵能帮助它们在夜里靠声音认路。" },
          { en: "A cat can move its ears around. Its ears tell it where a sound comes from.", zh: "猫的耳朵可以转来转去。耳朵能告诉它声音是从哪里来的。" },
          { en: "What about dogs? A dog can hear much better than you and me!", zh: "那么狗呢？狗的听力比你我可要好得多！" },
          { en: "Ears are small, but they do big jobs.", zh: "耳朵虽然小，作用却很大。" }
        ],
        vocab: [
          { en: "rabbit", zh: "兔子", pos: "n." },
          { en: "bat", zh: "蝙蝠", pos: "n." },
          { en: "sound", zh: "声音", pos: "n." },
          { en: "at night", zh: "在夜里", pos: "短语" },
          { en: "move", zh: "移动；转动", pos: "v." },
          { en: "hear", zh: "听见", pos: "v." }
        ],
        questions: [
          { type: "choice", q: "Whose ears help it find the way at night?", options: ["The rabbit's", "The bat's", "The cat's", "The dog's"], answer: 1, evidence: "their ears help them find their way with sound at night", explain: "蝙蝠在夜里靠声音认路。" },
          { type: "choice", q: "Why are the rabbit's long ears helpful?", options: ["They can hear very small sounds", "They can fly", "They can eat", "They look nice"], answer: 0, evidence: "They can hear very small sounds.", explain: "长耳朵能听到很小的声音，方便及时逃跑。" },
          { type: "choice", q: "Which animal can move its ears around?", options: ["The bat", "The rabbit", "The cat", "The hare"], answer: 2, evidence: "A cat can move its ears around.", explain: "猫的耳朵可以转来转去。" },
          { type: "judge", q: "A dog can hear much better than people.", options: ["正确", "错误"], answer: 0, evidence: "A dog can hear much better than you and me!", explain: "狗的听力比人好得多。" }
        ]
      }
    ],
    videos: [
      {
        id: "v1",
        title: "Super Simple Songs（超级简单儿歌）",
        creator: "Super Simple Songs",
        url: "https://www.youtube.com/user/SuperSimpleSongs",
        level: 1,
        reason: "语速慢、吐字清晰的英文儿歌，适合低年级磨耳朵和跟唱，主题覆盖动物、食物、天气、数字等教材话题。",
        focus: ["跟唱动物、食物主题儿歌", "留意重复句型，如 I like… / Do you like…?", "听歌时试着说出歌词里的单词"]
      },
      {
        id: "v2",
        title: "Jack Hartmann Kids Music Channel",
        creator: "Jack Hartmann",
        url: "https://www.youtube.com/user/JackHartmann",
        level: 1,
        reason: "结合动作的拼读（phonics）和数学儿歌，节奏明快，适合边动边学字母发音。",
        focus: ["字母与自然拼读发音", "高频词（sight words）跟读", "数字与星期、月份表达"]
      },
      {
        id: "v3",
        title: "Alphablocks 字母积木",
        creator: "Alphablocks（官方频道）",
        url: "https://www.youtube.com/@Alphablocks",
        level: 1,
        reason: "英国 BBC 出品的自然拼读动画，字母角色拼在一起就发出单词读音，直观有趣。",
        focus: ["观察字母组合的发音规则", "跟着拼读 CVC 单词（如 c-a-t）", "注意长元音与短元音的区别"]
      },
      {
        id: "v4",
        title: "Storyline Online 名家读绘本",
        creator: "SAG-AFTRA Foundation",
        url: "https://storylineonline.net",
        level: 2,
        reason: "美国演员工会基金会出品的绘本朗读网站，演员声情并茂地朗读经典英文绘本，配有动画画面。",
        focus: ["先看画面猜意思，再听朗读", "挑一本读过的绘本做影子跟读", "记下 3 个新单词到生词本"]
      },
      {
        id: "v5",
        title: "Peppa Pig 小猪佩奇（英文版）",
        creator: "Peppa Pig Official",
        url: "https://www.youtube.com/results?search_query=peppa+pig+official+channel",
        level: 1,
        reason: "日常生活对话丰富，句式简单且不断重复，适合做听力启蒙和家庭场景表达积累。",
        focus: ["听家庭日常对话（吃饭、玩耍、睡前）", "模仿角色的一两句话", "注意 I like / Let's / Can you 句型"]
      },
      {
        id: "v6",
        title: "Nat Geo Kids 国家地理儿童",
        creator: "National Geographic Kids",
        url: "https://www.youtube.com/@NatGeoKids",
        level: 2,
        reason: "高质量动物与自然科普短片，配合本工具“自然与科学”阅读分类，做视听结合的拓展。",
        focus: ["先读同主题文章再看视频", "记下动物名称类单词", "试着用两句英文说出视频讲了什么"]
      },
      {
        id: "v7",
        title: "Oxford Owl 免费分级电子书",
        creator: "Oxford University Press",
        url: "https://www.oxfordowl.co.uk/for-home/find-a-book/library-page/",
        level: 1,
        reason: "牛津出版社官方免费电子书图书馆（家庭版需免费注册），按级别挑选，与本工具分级阅读互补。",
        focus: ["选合适级别（从低级别开始）", "先猜后读，遇到生词记入生词本", "读完做简单复述"]
      },
      {
        id: "v8",
        title: "Unite for Literacy 有声绘本",
        creator: "Unite for Literacy",
        url: "https://uniteforliteracy.com",
        level: 1,
        reason: "开放的初级有声绘本库，每页一句英文配朗读，题材贴近生活，适合起步自主阅读。",
        focus: ["每天读 1–2 本小绘本", "跟读每页句子", "积累动物、颜色、数字类词汇"]
      }
    ]
  };
})(window);
