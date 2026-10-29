/* 内置教材数据：译林版（牛津译林）小学英语 四年级上册
 *
 * 说明：
 * - 单元标题与单词表依据公开网络资料整理（同步新版教材单元词汇表），可能存在个别出入；
 * - 例句、句型与知识点讲解为本工具自编的复习材料，不是教材原文；
 * - 所有内容均可在「设置 → 内容管理」中核对、修改或替换（导入 JSON 后覆盖内置数据）。
 */
(function (global) {
  "use strict";

  global.BUILTIN_CONTENT = {
    id: "yilin-4a",
    title: "译林版小学英语 四年级上册",
    publisher: "译林出版社（牛津译林版）",
    grade: "四年级上册",
    sourceNote: "单元标题与单词表依据公开资料整理（同步新版教材词汇表）；例句、句型讲解和练习为本工具自编复习材料，非教材原文。请家长核对后使用，可在「设置 → 内容管理」中修改。",
    updatedAt: "2026-10-29",
    units: [
      {
        id: "u1",
        no: 1,
        title: "I like dogs",
        titleZh: "我喜欢狗",
        emoji: "🐶",
        words: [
          { en: "like", zh: "喜欢", exEn: "I like dogs.", exZh: "我喜欢狗。" },
          { en: "dog", zh: "狗", exEn: "The dog is small.", exZh: "这只狗很小。" },
          { en: "animal", zh: "动物", exEn: "A cat is an animal.", exZh: "猫是一种动物。" },
          { en: "cat", zh: "猫", exEn: "Look at the cat!", exZh: "看这只猫！" },
          { en: "cute", zh: "可爱的", exEn: "The panda is cute.", exZh: "熊猫很可爱。" },
          { en: "panda", zh: "熊猫", exEn: "I like pandas.", exZh: "我喜欢熊猫。" },
          { en: "fat", zh: "胖的", exEn: "The cat is fat.", exZh: "这只猫很胖。" },
          { en: "elephant", zh: "大象", exEn: "The elephant is big.", exZh: "大象很大。" },
          { en: "horse", zh: "马", exEn: "The horse can run.", exZh: "马会跑。" },
          { en: "lion", zh: "狮子", exEn: "Is that a lion?", exZh: "那是一头狮子吗？" },
          { en: "monkey", zh: "猴子", exEn: "The monkey is cute.", exZh: "猴子很可爱。" },
          { en: "tiger", zh: "老虎", exEn: "The tiger can jump.", exZh: "老虎会跳。" },
          { en: "have", zh: "有", exEn: "I have a cat.", exZh: "我有一只猫。" }
        ],
        sentences: [
          { en: "Do you like dogs?", zh: "你喜欢狗吗？" },
          { en: "Yes, I do.", zh: "是的，我喜欢。" },
          { en: "No, I don't.", zh: "不，我不喜欢。" },
          { en: "I like cats. They're cute.", zh: "我喜欢猫。它们很可爱。" },
          { en: "Look at this cat!", zh: "看这只猫！" },
          { en: "I don't like tigers.", zh: "我不喜欢老虎。" }
        ],
        grammar: [
          {
            title: "I like … 表达喜欢",
            explain: ["like 后面接喜欢的东西。", "可数名词一般用复数：I like dogs. / I like apples.", "说单数时要加 a/an：I like this dog."],
            examples: [
              { en: "I like monkeys.", zh: "我喜欢猴子。" },
              { en: "I like this little cat.", zh: "我喜欢这只小猫。" }
            ],
            quiz: [
              { q: "我喜欢大象。下面哪句是对的？", options: ["I like elephant.", "I like elephants.", "I likes elephants.", "I like a elephants."], answer: 1, explain: "like 后接可数名词复数，I 后面动词用原形 like。" }
            ]
          },
          {
            title: "Do you like …? 一般疑问句",
            explain: ["问别人喜不喜欢，用 Do you like + 名词？", "肯定回答：Yes, I do.", "否定回答：No, I don't.（don't = do not）"],
            examples: [
              { en: "Do you like pandas?", zh: "你喜欢熊猫吗？" },
              { en: "Yes, I do. They're cute and fat.", zh: "是的，我喜欢。它们又可爱又胖。" }
            ],
            quiz: [
              { q: "— Do you like tigers? — ______", options: ["Yes, I am.", "Yes, it is.", "Yes, I do.", "Yes, I can."], answer: 2, explain: "Do you like…? 用 do 来回答：Yes, I do. / No, I don't." }
            ]
          },
          {
            title: "It's / They're 描述动物",
            explain: ["说一个东西用 It's…（It is）：It's cute.", "说多个东西用 They're…（They are）：They're fat."],
            examples: [
              { en: "Look at the elephant. It's big.", zh: "看那头大象。它很大。" },
              { en: "Look at the monkeys. They're cute.", zh: "看那些猴子。它们很可爱。" }
            ],
            quiz: [
              { q: "Look at the dolls. ______ beautiful.", options: ["It's", "They're", "I'm", "He's"], answer: 1, explain: "dolls 是复数，用 They're（They are）。" }
            ]
          }
        ]
      },
      {
        id: "u2",
        no: 2,
        title: "Let's make a fruit salad",
        titleZh: "让我们做水果沙拉吧",
        emoji: "🍓",
        words: [
          { en: "make", zh: "制作", exEn: "Let's make a cake.", exZh: "让我们做个蛋糕吧。" },
          { en: "fruit", zh: "水果", exEn: "I like fruit.", exZh: "我喜欢水果。" },
          { en: "salad", zh: "沙拉", exEn: "The fruit salad is nice.", exZh: "水果沙拉很好吃。" },
          { en: "pineapple", zh: "菠萝", exEn: "The pineapple is yellow.", exZh: "菠萝是黄色的。" },
          { en: "mango", zh: "芒果", exEn: "Do you like mangoes?", exZh: "你喜欢芒果吗？" },
          { en: "any", zh: "一些（用于疑问句、否定句）", exEn: "Do you have any bananas?", exZh: "你有香蕉吗？" },
          { en: "banana", zh: "香蕉", exEn: "I have two bananas.", exZh: "我有两根香蕉。" },
          { en: "some", zh: "一些", exEn: "I have some grapes.", exZh: "我有一些葡萄。" },
          { en: "grape", zh: "葡萄", exEn: "The grapes are sweet.", exZh: "葡萄很甜。" },
          { en: "our", zh: "我们的", exEn: "This is our classroom.", exZh: "这是我们的教室。" },
          { en: "cool", zh: "酷的；真棒", exEn: "Cool! Look at my robot.", exZh: "真酷！看我的机器人。" },
          { en: "wonderful", zh: "精彩的；了不起的", exEn: "Wonderful!", exZh: "太棒了！" }
        ],
        sentences: [
          { en: "Let's make a fruit salad.", zh: "让我们做一份水果沙拉吧。" },
          { en: "I have a pineapple.", zh: "我有一个菠萝。" },
          { en: "I have some grapes.", zh: "我有一些葡萄。" },
          { en: "Do you have any bananas?", zh: "你有香蕉吗？" },
          { en: "Yes, I do. / No, I don't.", zh: "是的，我有。/ 不，我没有。" },
          { en: "Look at our fruit salad!", zh: "看我们的水果沙拉！" }
        ],
        grammar: [
          {
            title: "Let's … 提议一起做某事",
            explain: ["Let's = Let us（让我们……）", "Let's 后面接动词原形：Let's make…", "回答可以说 Great! / OK! / Good idea!"],
            examples: [
              { en: "Let's make a fruit salad.", zh: "让我们做一份水果沙拉吧。" },
              { en: "— Let's play football. — Great!", zh: "— 我们踢足球吧。— 太好了！" }
            ],
            quiz: [
              { q: "Let's ______ a fruit salad.", options: ["make", "makes", "making", "to make"], answer: 0, explain: "Let's 后面接动词原形。" }
            ]
          },
          {
            title: "have / has 表示“有”",
            explain: ["I / You / We / They + have", "He / She / It + has"],
            examples: [
              { en: "I have a pineapple.", zh: "我有一个菠萝。" },
              { en: "She has two mangoes.", zh: "她有两个芒果。" }
            ],
            quiz: [
              { q: "Mike ______ three bananas.", options: ["have", "has", "is", "are"], answer: 1, explain: "Mike 是第三人称单数，用 has。" }
            ]
          },
          {
            title: "some 与 any",
            explain: ["some 用在肯定句：I have some grapes.", "any 用在疑问句和否定句：Do you have any bananas?"],
            examples: [
              { en: "I don't have any apples.", zh: "我没有苹果。" }
            ],
            quiz: [
              { q: "I have ______ grapes.", options: ["any", "some", "a", "an"], answer: 1, explain: "肯定句用 some；any 用于疑问句和否定句。" }
            ]
          }
        ]
      },
      {
        id: "u3",
        no: 3,
        title: "How many?",
        titleZh: "多少？",
        emoji: "🔢",
        words: [
          { en: "thirteen", zh: "十三", exEn: "I have thirteen stickers.", exZh: "我有十三张贴纸。" },
          { en: "fourteen", zh: "十四", exEn: "Fourteen and five is nineteen.", exZh: "十四加五是十九。" },
          { en: "fifteen", zh: "十五", exEn: "She has fifteen grapes.", exZh: "她有十五颗葡萄。" },
          { en: "sixteen", zh: "十六", exEn: "I can see sixteen birds.", exZh: "我能看见十六只鸟。" },
          { en: "seventeen", zh: "十七", exEn: "Sixteen and one is seventeen.", exZh: "十六加一是十七。" },
          { en: "eighteen", zh: "十八", exEn: "Fifteen and three is eighteen.", exZh: "十五加三是十八。" },
          { en: "nineteen", zh: "十九", exEn: "Twenty minus one is nineteen.", exZh: "二十减一是十九。" },
          { en: "how many", zh: "多少（提问数量）", exEn: "How many books do you have?", exZh: "你有多少本书？" },
          { en: "many", zh: "许多", exEn: "I have many stickers.", exZh: "我有许多贴纸。" },
          { en: "sticker", zh: "贴纸", exEn: "Can I have a sticker?", exZh: "我能要一张贴纸吗？" },
          { en: "can", zh: "可以；能", exEn: "I can swim.", exZh: "我会游泳。" },
          { en: "have a look", zh: "看一看", exEn: "Can I have a look?", exZh: "我能看一看吗？" },
          { en: "very", zh: "非常", exEn: "The robot is very cool.", exZh: "这个机器人非常酷。" },
          { en: "sure", zh: "当然", exEn: "— Can I have a look? — Sure!", exZh: "—我能看一看吗？—当然可以！" },
          { en: "play", zh: "玩；打（球）；踢（球）", exEn: "Let's play table tennis.", exZh: "让我们打乒乓球吧。" },
          { en: "box", zh: "盒子", exEn: "The balls are in the box.", exZh: "球在盒子里。" },
          { en: "table tennis", zh: "乒乓球", exEn: "I can play table tennis.", exZh: "我会打乒乓球。" },
          { en: "but", zh: "但是", exEn: "I like dogs, but I don't like cats.", exZh: "我喜欢狗，但我不喜欢猫。" },
          { en: "do", zh: "（助动词，构成疑问句等）", exEn: "— Do you like tigers? — Yes, I do.", exZh: "—你喜欢老虎吗？—是的，喜欢。" }
        ],
        sentences: [
          { en: "How many stickers do you have?", zh: "你有多少张贴纸？" },
          { en: "I have fifteen stickers.", zh: "我有十五张贴纸。" },
          { en: "Can I have a look?", zh: "我能看一看吗？" },
          { en: "Sure.", zh: "当然可以。" },
          { en: "How many toy cars do you have?", zh: "你有多少辆玩具汽车？" },
          { en: "I have fourteen.", zh: "我有十四个。" }
        ],
        grammar: [
          {
            title: "How many … 问数量",
            explain: ["How many + 名词复数 + do you have?", "回答用数字：I have fifteen (stickers)."],
            examples: [
              { en: "How many dogs do you have?", zh: "你有多少只狗？" },
              { en: "I have three.", zh: "我有三只。" }
            ],
            quiz: [
              { q: "— How many ______ do you have? — I have sixteen.", options: ["sticker", "stickers", "a sticker", "stickeres"], answer: 1, explain: "How many 后面接名词复数。" }
            ]
          },
          {
            title: "13–19 的数字",
            explain: ["大多在个位数后加 -teen：four→fourteen, six→sixteen", "注意特殊拼写：thirteen, fifteen, eighteen"],
            examples: [
              { en: "thirteen, fourteen, fifteen…", zh: "13、14、15……" }
            ],
            quiz: [
              { q: "十五用英语怎么说？", options: ["fivteen", "fifty", "fifteen", "fiveteen"], answer: 2, explain: "十五是 fifteen（注意拼写）；fifty 是五十。" }
            ]
          },
          {
            title: "Can I …? 请求许可",
            explain: ["请别人允许自己做某事：Can I + 动词原形?", "回答：Sure. / Yes, you can. / OK."],
            examples: [
              { en: "Can I have a look?", zh: "我能看一看吗？" },
              { en: "Can I play with your robot?", zh: "我能玩你的机器人吗？" }
            ],
            quiz: [
              { q: "— ______ I have a look? — Sure.", options: ["Do", "Am", "Can", "Is"], answer: 2, explain: "请求许可用 Can I …?" }
            ]
          }
        ]
      },
      {
        id: "u4",
        no: 4,
        title: "I can play basketball",
        titleZh: "我会打篮球",
        emoji: "🏀",
        words: [
          { en: "basketball", zh: "篮球", exEn: "I can play basketball.", exZh: "我会打篮球。" },
          { en: "football", zh: "足球", exEn: "Let's play football.", exZh: "让我们踢足球吧。" },
          { en: "jump", zh: "跳", exEn: "The frog can jump.", exZh: "青蛙会跳。" },
          { en: "skate", zh: "滑冰", exEn: "My dad can skate.", exZh: "我爸爸会滑冰。" },
          { en: "swim", zh: "游泳", exEn: "Fish can swim.", exZh: "鱼会游泳。" },
          { en: "well", zh: "好；很好地", exEn: "He can swim well.", exZh: "他游泳游得很好。" },
          { en: "have a try", zh: "试一试", exEn: "Have a try!", exZh: "试一试吧！" },
          { en: "yeah", zh: "是；对的（表示高兴）", exEn: "Yeah! I can do it!", exZh: "耶！我能做到！" },
          { en: "quack", zh: "（鸭子）嘎嘎叫", exEn: "The duck says \"Quack!\"", exZh: "鸭子“嘎嘎”叫。" },
          { en: "tweet", zh: "（小鸟）啾啾叫", exEn: "The bird says \"Tweet!\"", exZh: "小鸟“啾啾”叫。" },
          { en: "fly", zh: "飞", exEn: "Birds can fly.", exZh: "鸟会飞。" },
          { en: "ouch", zh: "哎哟", exEn: "Ouch! My leg!", exZh: "哎哟！我的腿！" },
          { en: "sad", zh: "难过的", exEn: "Don't be sad.", exZh: "别难过。" },
          { en: "either", zh: "也（不）", exEn: "I can't skate either.", exZh: "我也不会滑冰。" }
        ],
        sentences: [
          { en: "Can you play basketball?", zh: "你会打篮球吗？" },
          { en: "Yes, I can. Look!", zh: "是的，我会。看！" },
          { en: "No, I can't.", zh: "不，我不会。" },
          { en: "Have a try!", zh: "试一试吧！" },
          { en: "I can play football well.", zh: "我足球踢得很好。" },
          { en: "Don't be sad.", zh: "别难过。" },
          { en: "Can he swim? Yes, he can.", zh: "他会游泳吗？是的，他会。" }
        ],
        grammar: [
          {
            title: "can 表示“会、能”",
            explain: ["can 后面接动词原形：I can swim.", "问句：Can you …? 回答：Yes, I can. / No, I can't.", "can't = cannot，表示“不会、不能”"],
            examples: [
              { en: "Can you jump?", zh: "你会跳吗？" },
              { en: "No, I can't.", zh: "不，我不会。" }
            ],
            quiz: [
              { q: "— Can you skate? — No, ______.", options: ["I don't", "I'm not", "I can't", "I not can"], answer: 2, explain: "用 can 提问，用 can 回答：Yes, I can. / No, I can't." }
            ]
          },
          {
            title: "play + 球类",
            explain: ["play 后面接球类运动时不加 the：play basketball / play football / play table tennis"],
            examples: [
              { en: "I can play basketball well.", zh: "我篮球打得好。" }
            ],
            quiz: [
              { q: "我会打篮球：I can play ______ basketball.", options: ["a", "an", "the", "（不加冠词）"], answer: 3, explain: "球类运动前不加 a/an/the。" }
            ]
          },
          {
            title: "either 也（不）",
            explain: ["too 用在肯定句句末：I can swim, too.", "either 用在否定句句末：I can't swim either."],
            examples: [
              { en: "I can't skate either.", zh: "我也不会滑冰。" }
            ],
            quiz: [
              { q: "I can't swim. Tom can't swim ______.", options: ["too", "either", "and", "but"], answer: 1, explain: "否定句句末用 either 表示“也（不）”。" }
            ]
          }
        ]
      },
      {
        id: "u5",
        no: 5,
        title: "Our new home",
        titleZh: "我们的新家",
        emoji: "🏠",
        words: [
          { en: "home", zh: "家", exEn: "Welcome to my home.", exZh: "欢迎到我家来。" },
          { en: "bedroom", zh: "卧室", exEn: "I sleep in my bedroom.", exZh: "我在卧室睡觉。" },
          { en: "living room", zh: "客厅", exEn: "The TV is in the living room.", exZh: "电视在客厅里。" },
          { en: "sofa", zh: "沙发", exEn: "The cat is on the sofa.", exZh: "猫在沙发上。" },
          { en: "kitchen", zh: "厨房", exEn: "Mum is in the kitchen.", exZh: "妈妈在厨房里。" },
          { en: "clock", zh: "钟；时钟", exEn: "The clock is on the table.", exZh: "钟在桌子上。" },
          { en: "fridge", zh: "冰箱", exEn: "The milk is in the fridge.", exZh: "牛奶在冰箱里。" },
          { en: "table", zh: "桌子", exEn: "The apples are on the table.", exZh: "苹果在桌子上。" },
          { en: "bathroom", zh: "浴室；卫生间", exEn: "Is Dad in the bathroom?", exZh: "爸爸在卫生间吗？" },
          { en: "hungry", zh: "饿的", exEn: "I'm hungry.", exZh: "我饿了。" },
          { en: "come", zh: "来", exEn: "Come in, please.", exZh: "请进。" },
          { en: "How are you?", zh: "你好吗？", exEn: "— How are you? — I'm fine, thank you.", exZh: "—你好吗？—我很好，谢谢。" }
        ],
        sentences: [
          { en: "This is our new home.", zh: "这是我们的新家。" },
          { en: "Where's my bag?", zh: "我的包在哪里？" },
          { en: "It's in your bedroom.", zh: "它在你的卧室里。" },
          { en: "Where are my shoes?", zh: "我的鞋子在哪里？" },
          { en: "They're under the sofa.", zh: "它们在沙发下面。" },
          { en: "Is it in the kitchen? Yes, it is.", zh: "它在厨房里吗？是的。" }
        ],
        grammar: [
          {
            title: "Where's …? 问单个东西在哪",
            explain: ["Where's = Where is", "回答：It's + 方位：It's in / on / under / near …", "in 在里面，on 在上面，under 在下面，near 在旁边"],
            examples: [
              { en: "Where's the clock?", zh: "钟在哪里？" },
              { en: "It's on the table.", zh: "它在桌子上。" }
            ],
            quiz: [
              { q: "— Where's the clock? — ______", options: ["They're on the wall.", "It's on the wall.", "I'm fine.", "Yes, it is."], answer: 1, explain: "单个东西用 It's… 回答。" }
            ]
          },
          {
            title: "Where are …? 问多个东西在哪",
            explain: ["多个东西用 are：Where are my shoes?", "回答：They're + 方位"],
            examples: [
              { en: "Where are my books?", zh: "我的书在哪里？" },
              { en: "They're in the box.", zh: "它们在盒子里。" }
            ],
            quiz: [
              { q: "— Where ______ my pens? — They're on the table.", options: ["is", "am", "are", "be"], answer: 2, explain: "pens 是复数，用 are。" }
            ]
          },
          {
            title: "Is it …? 一般疑问句",
            explain: ["Is it in the kitchen? 它在厨房里吗？", "回答：Yes, it is. / No, it isn't."],
            examples: [
              { en: "Is the cat under the sofa?", zh: "猫在沙发下面吗？" }
            ],
            quiz: [
              { q: "The cat is ______ the sofa. （猫在沙发下面）", options: ["under", "in", "at", "of"], answer: 0, explain: "under 表示“在……下面”。" }
            ]
          }
        ]
      },
      {
        id: "u6",
        no: 6,
        title: "At the snack bar",
        titleZh: "在小吃店",
        emoji: "🍔",
        words: [
          { en: "at", zh: "在（某处）", exEn: "We are at the snack bar.", exZh: "我们在小吃店。" },
          { en: "snack bar", zh: "小吃店；快餐店", exEn: "Let's go to the snack bar.", exZh: "我们去小吃店吧。" },
          { en: "hamburger", zh: "汉堡包", exEn: "I'd like a hamburger.", exZh: "我想要一个汉堡包。" },
          { en: "noodles", zh: "面条", exEn: "I like noodles.", exZh: "我喜欢面条。" },
          { en: "sandwich", zh: "三明治", exEn: "The sandwich is big.", exZh: "这个三明治很大。" },
          { en: "coffee", zh: "咖啡", exEn: "Dad likes coffee.", exZh: "爸爸喜欢咖啡。" },
          { en: "tea", zh: "茶", exEn: "A cup of tea, please.", exZh: "请给我一杯茶。" },
          { en: "juice", zh: "果汁", exEn: "I'd like some juice.", exZh: "我想要一些果汁。" },
          { en: "rice", zh: "米饭；大米", exEn: "The rice is hot.", exZh: "米饭是热的。" },
          { en: "fish", zh: "鱼", exEn: "Do you like fish?", exZh: "你喜欢鱼吗？" },
          { en: "a glass of", zh: "一（玻璃）杯", exEn: "a glass of milk", exZh: "一杯牛奶" },
          { en: "a cup of", zh: "一（茶）杯", exEn: "a cup of coffee", exZh: "一杯咖啡" },
          { en: "dad", zh: "爸爸", exEn: "Dad, I'm hungry.", exZh: "爸爸，我饿了。" },
          { en: "big", zh: "大的", exEn: "The hamburger is big.", exZh: "汉堡包很大。" },
          { en: "Anything else?", zh: "还要别的吗？", exEn: "— Anything else? — No, thank you.", exZh: "—还要别的吗？—不了，谢谢。" },
          { en: "What would you like?", zh: "你想要什么？", exEn: "What would you like, Mum?", exZh: "妈妈，你想要什么？" }
        ],
        sentences: [
          { en: "What would you like?", zh: "你想要什么？" },
          { en: "I'd like a hamburger and a glass of milk, please.", zh: "我想要一个汉堡包和一杯牛奶。" },
          { en: "Anything else?", zh: "还要别的吗？" },
          { en: "A cup of tea, please.", zh: "请给我一杯茶。" },
          { en: "No, thank you.", zh: "不了，谢谢。" },
          { en: "Can I help you?", zh: "您要点什么？" }
        ],
        grammar: [
          {
            title: "What would you like? 询问想要什么",
            explain: ["I'd like … = I would like …（我想要……）", "句尾加 please 更有礼貌"],
            examples: [
              { en: "— What would you like? — I'd like some noodles.", zh: "—你想要什么？—我想要一些面条。" }
            ],
            quiz: [
              { q: "I'd like = ______", options: ["I do like", "I am like", "I would like", "I likes"], answer: 2, explain: "I'd 是 I would 的缩写。" }
            ]
          },
          {
            title: "a glass of 与 a cup of",
            explain: ["a glass of：玻璃杯，常接牛奶、果汁：a glass of milk", "a cup of：茶杯，常接茶、咖啡：a cup of tea"],
            examples: [
              { en: "I'd like a cup of coffee.", zh: "我想要一杯咖啡。" }
            ],
            quiz: [
              { q: "“一杯牛奶”怎么说？", options: ["a cup of milk", "a glass of milk", "a milk", "a bottle milks"], answer: 1, explain: "牛奶通常装在玻璃杯里，用 a glass of milk。" }
            ]
          },
          {
            title: "点餐常用语",
            explain: ["服务员问：Can I help you? / What would you like?", "追问：Anything else?", "回答后加 please / thank you 更有礼貌"],
            examples: [
              { en: "— Can I help you? — I'd like a sandwich, please.", zh: "—您要点什么？—我想要一个三明治。" }
            ],
            quiz: [
              { q: "服务员问“还要别的吗？”可以说：______", options: ["How much is it?", "Anything else?", "How are you?", "What's this?"], answer: 1, explain: "Anything else? 意思是“还要别的吗？”。" }
            ]
          }
        ]
      },
      {
        id: "u7",
        no: 7,
        title: "How much?",
        titleZh: "多少钱？",
        emoji: "💰",
        words: [
          { en: "how much", zh: "多少钱", exEn: "How much is it?", exZh: "它多少钱？" },
          { en: "shoe", zh: "鞋", exEn: "My shoes are new.", exZh: "我的鞋子是新的。" },
          { en: "sock", zh: "袜子", exEn: "I have white socks.", exZh: "我有白袜子。" },
          { en: "umbrella", zh: "雨伞", exEn: "The umbrella is nice.", exZh: "这把雨伞很好看。" },
          { en: "fan", zh: "扇子；电扇", exEn: "The fan is fifteen yuan.", exZh: "这把扇子十五元。" },
          { en: "yuan", zh: "元（人民币单位）", exEn: "The book is ten yuan.", exZh: "这本书十元。" },
          { en: "twenty", zh: "二十", exEn: "I have twenty stickers.", exZh: "我有二十张贴纸。" },
          { en: "twenty-eight", zh: "二十八", exEn: "The shoes are twenty-eight yuan.", exZh: "这双鞋二十八元。" },
          { en: "thirty", zh: "三十", exEn: "Thirty and twenty is fifty.", exZh: "三十加二十是五十。" },
          { en: "forty", zh: "四十", exEn: "The clock is forty yuan.", exZh: "这个钟四十元。" },
          { en: "forty-five", zh: "四十五", exEn: "The doll is forty-five yuan.", exZh: "这个娃娃四十五元。" },
          { en: "fifty", zh: "五十", exEn: "I have fifty yuan.", exZh: "我有五十元。" },
          { en: "only", zh: "只；仅仅", exEn: "It's only five yuan.", exZh: "它只要五元。" },
          { en: "her", zh: "她的", exEn: "Her umbrella is beautiful.", exZh: "她的雨伞很漂亮。" },
          { en: "tail", zh: "尾巴", exEn: "The cat's tail is long.", exZh: "猫的尾巴很长。" },
          { en: "long", zh: "长的", exEn: "The ruler is long.", exZh: "这把尺很长。" },
          { en: "Well done!", zh: "干得好！", exEn: "Well done, Mike!", exZh: "干得好，迈克！" }
        ],
        sentences: [
          { en: "How much is it?", zh: "它多少钱？" },
          { en: "It's nineteen yuan.", zh: "它十九元。" },
          { en: "How much are they?", zh: "它们多少钱？" },
          { en: "They're thirty yuan.", zh: "它们三十元。" },
          { en: "It's only five yuan.", zh: "它只要五元。" },
          { en: "Well done!", zh: "干得好！" }
        ],
        grammar: [
          {
            title: "How much is …? 问单个东西的价格",
            explain: ["How much is + 单个东西？", "回答：It's + 数字 + yuan."],
            examples: [
              { en: "— How much is the fan? — It's five yuan.", zh: "—这把扇子多少钱？—五元。" }
            ],
            quiz: [
              { q: "— How much is the fan? — ______ five yuan.", options: ["It's", "They're", "I'm", "Its"], answer: 0, explain: "单件东西用 It's 回答；Its（没有撇号）意思是“它的”，不是“它是”。" }
            ]
          },
          {
            title: "How much are …? 问多个东西的价格",
            explain: ["How much are + 复数东西？", "回答：They're + 数字 + yuan."],
            examples: [
              { en: "— How much are the socks? — They're ten yuan.", zh: "—这双袜子多少钱？—十元。" }
            ],
            quiz: [
              { q: "— How much ______ the shoes? — They're thirty yuan.", options: ["is", "am", "are", "do"], answer: 2, explain: "shoes 是复数，用 are。" }
            ]
          },
          {
            title: "整十数字的拼写",
            explain: ["twenty 20, thirty 30, forty 40, fifty 50", "注意：forty 中间没有 u（不是 fourty）"],
            examples: [
              { en: "twenty, thirty, forty, fifty", zh: "20、30、40、50" }
            ],
            quiz: [
              { q: "“四十”正确的拼写是：", options: ["fourty", "forty", "fourtey", "fortey"], answer: 1, explain: "forty 没有字母 u。" }
            ]
          }
        ]
      },
      {
        id: "u8",
        no: 8,
        title: "Dolls",
        titleZh: "玩具娃娃",
        emoji: "🧸",
        words: [
          { en: "hair", zh: "头发", exEn: "Her hair is long.", exZh: "她的头发长。" },
          { en: "eye", zh: "眼睛", exEn: "Her eyes are big.", exZh: "她的眼睛大。" },
          { en: "ear", zh: "耳朵", exEn: "The rabbit's ears are long.", exZh: "兔子的耳朵长。" },
          { en: "nose", zh: "鼻子", exEn: "His nose is small.", exZh: "他的鼻子小。" },
          { en: "mouth", zh: "嘴巴", exEn: "The doll's mouth is small.", exZh: "娃娃的嘴巴小。" },
          { en: "small", zh: "小的", exEn: "The cat is small.", exZh: "这只猫小。" },
          { en: "his", zh: "他的", exEn: "His hair is short.", exZh: "他的头发短。" },
          { en: "short", zh: "短的；矮的", exEn: "My ruler is short.", exZh: "我的尺子短。" },
          { en: "thin", zh: "瘦的", exEn: "The man is thin.", exZh: "那个男人很瘦。" },
          { en: "tall", zh: "高的", exEn: "My dad is tall.", exZh: "我爸爸个子高。" },
          { en: "king", zh: "国王", exEn: "The king is fat.", exZh: "国王很胖。" },
          { en: "snowman", zh: "雪人", exEn: "Look at the snowman!", exZh: "看那个雪人！" }
        ],
        sentences: [
          { en: "Look at our doll.", zh: "看我们的娃娃。" },
          { en: "She's beautiful.", zh: "她很漂亮。" },
          { en: "Her hair is long.", zh: "她的头发长。" },
          { en: "Her eyes are big.", zh: "她的眼睛大。" },
          { en: "His nose is small.", zh: "他的鼻子小。" },
          { en: "He's a king now!", zh: "现在他是国王啦！" }
        ],
        grammar: [
          {
            title: "his 与 her",
            explain: ["his 他的（男孩/男人），her 她的（女孩/女人）", "后面直接接名词：his hair, her eyes"],
            examples: [
              { en: "This is Tom. His nose is small.", zh: "这是汤姆。他的鼻子小。" },
              { en: "This is Amy. Her hair is long.", zh: "这是艾米。她的头发长。" }
            ],
            quiz: [
              { q: "Look at the girl. ______ hair is long.", options: ["His", "Her", "She", "He"], answer: 1, explain: "girl 是女孩，用 her。" }
            ]
          },
          {
            title: "is 与 are 描述部位",
            explain: ["单个部位用 is：His nose is small.", "成对的部位（两只眼、两只耳）用 are：Her eyes are big."],
            examples: [
              { en: "His ears are big.", zh: "他的耳朵大。" }
            ],
            quiz: [
              { q: "His eyes ______ big.", options: ["is", "am", "are", "be"], answer: 2, explain: "eyes 是复数，用 are。" }
            ]
          },
          {
            title: "tall / short / thin / fat 描述外形",
            explain: ["tall 高的，short 矮的或短的，thin 瘦的，fat 胖的", "He is tall. / She is thin."],
            examples: [
              { en: "The boy is tall and thin.", zh: "那个男孩又高又瘦。" }
            ],
            quiz: [
              { q: "那个男孩又高又瘦：______", options: ["The boy is tall and thin.", "The boy is short and fat.", "The boy can tall.", "The boy is long."], answer: 0, explain: "tall 高、thin 瘦；人是“高”，不是 long。" }
            ]
          }
        ]
      }
    ]
  };
})(window);
