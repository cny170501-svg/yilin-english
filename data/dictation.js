/* 看图默写 · 单词句子听写 专项内容（V2.2 新增）
 *
 * 说明：
 * - 「看图」使用大号 emoji 插图作为图片提示（非教材原图），仅用于辨认词义；
 * - 词表来自已核实的四上单元单词表；句子题来自各单元句型（本工具自编复习句，非教材原文）；
 * - 易错强化清单为本工具根据常见拼写/复数/易混点自编，标注为补充练习；
 * - 听音默写使用浏览器语音合成播放（非教材录音）。
 */
(function (global) {
  "use strict";

  /* 能用 emoji 直观表达的单词 → 图（按单元组织） */
  var WORD_IMAGES = {
    u1: {
      "dog": "🐶", "cat": "🐱", "panda": "🐼", "horse": "🐴", "lion": "🦁",
      "monkey": "🐵", "tiger": "🐯", "elephant": "🐘"
    },
    u2: {
      "pineapple": "🍍", "mango": "🥭", "banana": "🍌", "grape": "🍇", "salad": "🥗"
    },
    u3: {
      "box": "📦", "table tennis": "🏓"
    },
    u4: {
      "basketball": "🏀", "football": "⚽", "swim": "🏊", "skate": "⛸️", "quack": "🦆", "tweet": "🐦"
    },
    u5: {
      "home": "🏠", "bedroom": "🛏️", "living room": "🛋️", "sofa": "🛋️", "kitchen": "🍳", "fridge": "🧊", "clock": "⏰", "bathroom": "🛁"
    },
    u6: {
      "hamburger": "🍔", "noodles": "🍜", "sandwich": "🥪", "coffee": "☕", "tea": "🍵", "juice": "🧃", "rice": "🍚", "fish": "🐟", "snack bar": "🏪"
    },
    u7: {
      "shoe": "👟", "sock": "🧦", "umbrella": "☂️", "yuan": "🧧"
    },
    u8: {
      "eye": "👁️", "ear": "👂", "nose": "👃", "mouth": "👄", "snowman": "⛄", "king": "👑"
    }
  };

  /* 专项强化：易错拼写 / 易混词 / 复数与形式变化（本工具自编补充练习） */
  var CONFUSIONS = [
    { unitId: "u3", prompt: "十三（拼写易错：和三十对比）", answers: ["thirteen"], zh: "十三", tip: "thirteen（13）/ thirty（30）：13 有个 ir。" },
    { unitId: "u3", prompt: "十五（注意拼写，不是 fivteen）", answers: ["fifteen"], zh: "十五", tip: "five → fifteen，ve 变 f。" },
    { unitId: "u3", prompt: "十八（只保留一个 t）", answers: ["eighteen"], zh: "十八", tip: "eight + een，不要写成 eightteen。" },
    { unitId: "u3", prompt: "十九", answers: ["nineteen"], zh: "十九", tip: "nine 去掉 e 加 teen。" },
    { unitId: "u7", prompt: "四十（没有 u！）", answers: ["forty"], zh: "四十", tip: "four 去掉 u 变 forty，不是 fourty。" },
    { unitId: "u7", prompt: "五十", answers: ["fifty"], zh: "五十", tip: "five → fifty，ve 变 f。" },
    { unitId: "u2", prompt: "mango 的复数", answers: ["mangoes"], zh: "芒果（复数）", tip: "以 o 结尾常加 es：mangoes。" },
    { unitId: "u2", prompt: "box 的复数", answers: ["boxes"], zh: "盒子（复数）", tip: "x 结尾加 es。" },
    { unitId: "u3", prompt: "sticker 的复数", answers: ["stickers"], zh: "贴纸（复数）", tip: "直接加 s。" },
    { unitId: "u8", prompt: "眼睛（注意复数形式拼写）", answers: ["eyes"], zh: "眼睛（两只）", tip: "Her eyes are big. 用复数。" },
    { unitId: "u8", prompt: "耳朵（两只，拼写里有 ar）", answers: ["ears"], zh: "耳朵", tip: "ear + s，别漏 a。" },
    { unitId: "u1", prompt: "elephant（默写：大象）", answers: ["elephant"], zh: "大象", tip: "e-l-e-p-h-a-n-t，注意 ph 发 f 音。" },
    { unitId: "u5", prompt: "卧室 bedroom（注意 oo）", answers: ["bedroom"], zh: "卧室", tip: "bed + room，两个 o。" },
    { unitId: "u5", prompt: "厨房 kitchen（注意 ch）", answers: ["kitchen"], zh: "厨房", tip: "k-i-t-c-h-e-n。" },
    { unitId: "u6", prompt: "汉堡包 hamburger（易漏字母）", answers: ["hamburger"], zh: "汉堡包", tip: "ham + bur + ger。" },
    { unitId: "u6", prompt: "三明治 sandwich（结尾是 ch）", answers: ["sandwich"], zh: "三明治", tip: "sand + wich，不是 which。" },
    { unitId: "u1", prompt: "animal（默写：动物）", answers: ["animal"], zh: "动物", tip: "a-n-i-m-a-l。" },
    { unitId: "u4", prompt: "篮球 basketball（两个词连写）", answers: ["basketball"], zh: "篮球", tip: "basket + ball 连写，中间没有空格。" },
    { unitId: "u4", prompt: "乒乓球（两个词，中间有空格）", answers: ["table tennis"], zh: "乒乓球", tip: "table tennis 有空格；basketball 没有。" },
    { unitId: "u5", prompt: "客厅（两个词，中间有空格）", answers: ["living room"], zh: "客厅", tip: "living + 空格 + room。" },
    { unitId: "u7", prompt: "雨伞 umbrella（双写 l 前是 um）", answers: ["umbrella"], zh: "雨伞", tip: "um-brel-la，两个 l。" },
    { unitId: "u7", prompt: "袜子 sock 的复数", answers: ["socks"], zh: "袜子（一双）", tip: "a pair of socks 用复数。" },
    { unitId: "u7", prompt: "鞋 shoe 的复数", answers: ["shoes"], zh: "鞋（一双）", tip: "The shoes are… 用复数。" },
    { unitId: "u8", prompt: "雪人 snowman（snow + man）", answers: ["snowman"], zh: "雪人", tip: "snow + man 连写；复数 snowmen。" },
    { unitId: "u8", prompt: "国王 king（默写）", answers: ["king"], zh: "国王", tip: "k-i-n-g。" },
    { unitId: "u2", prompt: "葡萄 grape（不要漏 e）", answers: ["grape"], zh: "葡萄", tip: "g-r-a-p-e；复数 grapes。" },
    { unitId: "u2", prompt: "菠萝 pineapple（pine + apple）", answers: ["pineapple"], zh: "菠萝", tip: "pine + apple 连写。" },
    { unitId: "u6", prompt: "面条 noodles（习惯用复数）", answers: ["noodles"], zh: "面条", tip: "面条习惯说 noodles。" },
    { unitId: "u6", prompt: "米饭 rice（不可数，不加 s）", answers: ["rice"], zh: "米饭", tip: "rice 不可数，没有 rices。" },
    { unitId: "u6", prompt: "一玻璃杯：____ of milk", answers: ["a glass"], zh: "一（玻璃）杯", tip: "玻璃杯 a glass of；茶杯 a cup of。" }
  ];

  global.DICTATION_CONTENT = {
    updatedAt: "2026-10-29",
    note: "看图题使用 emoji 插图（非教材原图）；词表来自已核实单元单词表；强化清单为自编补充练习；听音使用语音合成。",
    wordImages: WORD_IMAGES,
    confusions: CONFUSIONS
  };
})(window);
