/* 听力专项内容（V2.0 新增）
 * 全部为本工具围绕教材单元词汇自编的听力材料，通过浏览器语音合成朗读，
 * 不是教材配套录音。分两类：
 * - sentences: 听句子/短文选答案（情境理解）
 * - dialogs:   听力小对话 + 理解题
 */
(function (global) {
  "use strict";

  global.LISTENING_CONTENT = {
    updatedAt: "2026-10-29",
    note: "自编情境听力材料，围绕各单元词汇与句型编写，使用浏览器语音合成播放。",
    sentences: [
      { id: "ls1", unitId: "u1", audio: "Mike likes dogs very much, but he doesn't like lions.", q: "What does Mike like?", options: ["Lions", "Dogs", "Cats", "Tigers"], answer: 1, explain: "听到 Mike likes dogs… but he doesn't like lions，所以喜欢狗。" },
      { id: "ls2", unitId: "u1", audio: "Look at that fat panda! It's so cute.", q: "How is the panda?", options: ["Thin", "Fat and cute", "Small and sad", "Tall"], answer: 1, explain: "fat（胖）and cute（可爱）。" },
      { id: "ls3", unitId: "u2", audio: "I have a pineapple and some grapes. Let's make a fruit salad.", q: "What do they want to make?", options: ["A cake", "A fruit salad", "A hamburger", "Some noodles"], answer: 1, explain: "听到 Let's make a fruit salad。" },
      { id: "ls4", unitId: "u2", audio: "Su Hai doesn't have any mangoes, but she has two bananas.", q: "What does Su Hai have?", options: ["Mangoes", "Two bananas", "Some grapes", "An apple"], answer: 1, explain: "doesn't have any mangoes 说明没有芒果；has two bananas。" },
      { id: "ls5", unitId: "u3", audio: "I have fifteen stickers. How many stickers do you have?", q: "How many stickers does the speaker have?", options: ["Five", "Fourteen", "Fifteen", "Sixteen"], answer: 2, explain: "fifteen（十五），注意和 fifty（五十）区分。" },
      { id: "ls6", unitId: "u3", audio: "Sixteen and three is nineteen.", q: "What is sixteen and three?", options: ["Thirteen", "Eighteen", "Nineteen", "Seventeen"], answer: 2, explain: "16 + 3 = 19，nineteen。" },
      { id: "ls7", unitId: "u4", audio: "Wang Bing can play basketball very well, but he can't skate.", q: "What can't Wang Bing do?", options: ["Play basketball", "Skate", "Jump", "Swim"], answer: 1, explain: "he can't skate——不会滑冰。" },
      { id: "ls8", unitId: "u4", audio: "Don't be sad. Have a try! You can jump high.", q: "What does the speaker ask you to do?", options: ["Go home", "Have a try", "Go to sleep", "Sing a song"], answer: 1, explain: "Have a try! 试一试。" },
      { id: "ls9", unitId: "u5", audio: "Mum is in the kitchen, and Dad is in the living room.", q: "Where is Mum?", options: ["In the bedroom", "In the kitchen", "In the bathroom", "On the sofa"], answer: 1, explain: "Mum is in the kitchen。" },
      { id: "ls10", unitId: "u5", audio: "My clock is on the table and my bag is under the sofa.", q: "Where is the bag?", options: ["On the table", "Under the sofa", "In the box", "On the bed"], answer: 1, explain: "the bag is under the sofa。" },
      { id: "ls11", unitId: "u6", audio: "I'd like a hamburger and a glass of milk, please.", q: "What would the man like?", options: ["Noodles and tea", "A hamburger and milk", "A sandwich and juice", "Rice and fish"], answer: 1, explain: "a hamburger and a glass of milk。" },
      { id: "ls12", unitId: "u6", audio: "A cup of coffee is eight yuan, and the tea is five yuan.", q: "How much is the coffee?", options: ["Five yuan", "Eight yuan", "Thirteen yuan", "Three yuan"], answer: 1, explain: "coffee is eight yuan。" },
      { id: "ls13", unitId: "u7", audio: "The shoes are forty-five yuan, and the socks are ten yuan.", q: "How much are the shoes?", options: ["Forty yuan", "Forty-five yuan", "Fifteen yuan", "Fifty-four yuan"], answer: 1, explain: "forty-five（45），注意和 fifty-four（54）区分。" },
      { id: "ls14", unitId: "u7", audio: "This fan is twenty yuan. That fan is thirty yuan.", q: "How much is that fan?", options: ["Twenty yuan", "Thirty yuan", "Thirteen yuan", "Three yuan"], answer: 1, explain: "That fan is thirty yuan。" },
      { id: "ls15", unitId: "u8", audio: "Look at our doll. Her hair is long and her eyes are big.", q: "How are the doll's eyes?", options: ["Small", "Big", "Long", "Short"], answer: 1, explain: "her eyes are big。" },
      { id: "ls16", unitId: "u8", audio: "The tall man is my teacher. The short boy is my brother.", q: "Who is tall?", options: ["My brother", "My teacher", "The girl", "No one"], answer: 1, explain: "The tall man is my teacher。" }
    ],
    dialogs: [
      {
        id: "ld1", unitId: "u1",
        lines: [
          { who: "A", en: "Do you like dogs, Helen?", zh: "你喜欢狗吗，海伦？" },
          { who: "B", en: "No, I don't.", zh: "不，我不喜欢。" },
          { who: "A", en: "What do you like?", zh: "你喜欢什么？" },
          { who: "B", en: "I like pandas. They're cute and fat.", zh: "我喜欢熊猫。它们又可爱又胖。" }
        ],
        questions: [
          { q: "What does Helen like?", options: ["Dogs", "Pandas", "Cats", "Lions"], answer: 1, explain: "Helen 说 I like pandas。" },
          { q: "判断：Helen likes dogs.", options: ["正确", "错误"], answer: 1, explain: "她说 No, I don't，不喜欢狗。" }
        ]
      },
      {
        id: "ld2", unitId: "u2",
        lines: [
          { who: "A", en: "Let's make a fruit salad.", zh: "我们做水果沙拉吧。" },
          { who: "B", en: "Great! Do you have any bananas?", zh: "太好了！你有香蕉吗？" },
          { who: "A", en: "No, I don't. I have some grapes.", zh: "没有。我有一些葡萄。" },
          { who: "B", en: "Wonderful!", zh: "太棒了！" }
        ],
        questions: [
          { q: "What fruit does A have?", options: ["Bananas", "Grapes", "Mangoes", "Apples"], answer: 1, explain: "A 说 I have some grapes。" }
        ]
      },
      {
        id: "ld3", unitId: "u3",
        lines: [
          { who: "A", en: "How many toy cars do you have, Mike?", zh: "你有多少辆玩具汽车，迈克？" },
          { who: "B", en: "I have fourteen.", zh: "我有十四辆。" },
          { who: "A", en: "Can I have a look?", zh: "我能看一看吗？" },
          { who: "B", en: "Sure!", zh: "当然可以！" }
        ],
        questions: [
          { q: "How many toy cars does Mike have?", options: ["Four", "Forty", "Fourteen", "Fifteen"], answer: 2, explain: "I have fourteen（十四）。注意和 forty（四十）区分。" }
        ]
      },
      {
        id: "ld4", unitId: "u4",
        lines: [
          { who: "A", en: "Can you play football, Liu Tao?", zh: "你会踢足球吗，刘涛？" },
          { who: "B", en: "No, I can't.", zh: "不，我不会。" },
          { who: "A", en: "Have a try!", zh: "试一试吧！" },
          { who: "B", en: "OK. Look! I can play it now!", zh: "好的。看！我现在会踢了！" },
          { who: "A", en: "Cool!", zh: "真酷！" }
        ],
        questions: [
          { q: "Can Liu Tao play football at last（最后）?", options: ["Yes, he can.", "No, he can't.", "He can swim.", "We don't know."], answer: 0, explain: "最后他说 I can play it now! 所以会了。" }
        ]
      },
      {
        id: "ld5", unitId: "u5",
        lines: [
          { who: "A", en: "Mum, where's my football?", zh: "妈妈，我的足球在哪里？" },
          { who: "B", en: "Is it in your bedroom?", zh: "在你的卧室里吗？" },
          { who: "A", en: "No, it isn't.", zh: "不，不在。" },
          { who: "B", en: "Look! It's under the sofa in the living room.", zh: "看！它在客厅的沙发下面。" }
        ],
        questions: [
          { q: "Where is the football?", options: ["In the bedroom", "Under the sofa", "In the box", "On the table"], answer: 1, explain: "It's under the sofa in the living room。" }
        ]
      },
      {
        id: "ld6", unitId: "u6",
        lines: [
          { who: "A", en: "Can I help you?", zh: "您要点什么？" },
          { who: "B", en: "I'd like some noodles, please.", zh: "我想要一些面条。" },
          { who: "A", en: "Anything else?", zh: "还要别的吗？" },
          { who: "B", en: "A glass of orange juice, please. How much are they?", zh: "请给我一杯橙汁。一共多少钱？" },
          { who: "A", en: "Eighteen yuan.", zh: "十八元。" }
        ],
        questions: [
          { q: "What would B like?", options: ["Noodles and juice", "A hamburger and milk", "Rice and fish", "A sandwich and tea"], answer: 0, explain: "noodles + a glass of orange juice。" },
          { q: "How much are they?", options: ["Eight yuan", "Eighteen yuan", "Eighty yuan", "Ten yuan"], answer: 1, explain: "Eighteen yuan（18 元）。" }
        ]
      },
      {
        id: "ld7", unitId: "u7",
        lines: [
          { who: "A", en: "Look at these socks! How much are they?", zh: "看这些袜子！多少钱？" },
          { who: "B", en: "They're ten yuan.", zh: "十元。" },
          { who: "A", en: "And the shoes?", zh: "那这双鞋呢？" },
          { who: "B", en: "Thirty-five yuan.", zh: "三十五元。" },
          { who: "A", en: "OK. I'd like the socks, please.", zh: "好的，我买袜子。" }
        ],
        questions: [
          { q: "What does A buy?", options: ["The shoes", "The socks", "Both", "Nothing"], answer: 1, explain: "A 最后说 I'd like the socks。" }
        ]
      },
      {
        id: "ld8", unitId: "u8",
        lines: [
          { who: "A", en: "Look at the snowman!", zh: "看那个雪人！" },
          { who: "B", en: "Wow! His nose is big and his eyes are small.", zh: "哇！他的鼻子大，眼睛小。" },
          { who: "A", en: "How funny!", zh: "真有趣！" }
        ],
        questions: [
          { q: "How is the snowman's nose?", options: ["Small", "Big", "Long", "Short"], answer: 1, explain: "His nose is big。" }
        ]
      }
    ]
  };
})(window);
