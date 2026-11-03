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

  /* 能用 emoji 直观表达的单词 → 图（按单元组织，对齐新教材词表） */
  var WORD_IMAGES = {
    u1: {
      "subject": "📚", "Maths": "🔢", "Science": "🔬", "IT": "💻", "Music": "🎵",
      "Art": "🎨", "mouse": "🐭", "story": "📖", "read": "📖"
    },
    u2: {
      "breakfast": "🍳", "lunch": "🍱", "dinner": "🍲", "face": "🙂"
    },
    u3: {
      "bed": "🛏️", "o'clock": "🕐"
    },
    u4: {
      "football": "⚽", "basketball": "🏀", "ping-pong": "🏓", "swimming": "🏊",
      "dancing": "💃", "cinema": "🎬", "dog": "🐶", "walk": "🚶"
    },
    u5: {
      "robot": "🤖", "doll": "🪆", "eye": "👁️", "ear": "👂", "mouth": "👄",
      "arm": "💪", "leg": "🦵"
    },
    u6: {
      "sunny": "☀️", "cloudy": "⛅", "rainy": "🌧️", "windy": "🌬️", "umbrella": "☂️",
      "park": "🏞️", "fly a kite": "🪁", "money": "💰", "hot": "🔥"
    },
    u7: {
      "spring": "🌸", "summer": "🏖️", "winter": "❄️", "snow": "⛄", "bird": "🐦",
      "ice cream": "🍦", "plant": "🌱", "nose": "👃"
    },
    u8: {
      "cap": "🧢", "coat": "🧥", "dress": "👗", "shirt": "👔", "shorts": "🩳",
      "sunglasses": "🕶️"
    }
  };

  /* 专项强化：易错拼写 / 易混词 / 复数与形式变化（本工具自编补充练习，对齐新教材词表） */
  var CONFUSIONS = [
    { unitId: "u3", prompt: "星期三（拼写最难的日子）", answers: ["Wednesday"], zh: "星期三", tip: "Wed-nes-day：中间是 nes，不是 Wedsday。" },
    { unitId: "u3", prompt: "十五（注意拼写，不是 fivteen）", answers: ["fifteen"], zh: "十五", tip: "five → fifteen，ve 变 f。" },
    { unitId: "u3", prompt: "三十（和 thirteen 对比）", answers: ["thirty"], zh: "三十", tip: "thirteen（13）/ thirty（30）：13 有个 ir。" },
    { unitId: "u3", prompt: "星期二（双写 e 中间有 s）", answers: ["Tuesday"], zh: "星期二", tip: "Tu-es-day，别写成 Tuesday 以外的样子。" },
    { unitId: "u3", prompt: "星期四（里有 sir 的音）", answers: ["Thursday"], zh: "星期四", tip: "Thur-s-day，开头 Th 发咬舌音。" },
    { unitId: "u7", prompt: "秋天（美式说法，n 结尾）", answers: ["autumn"], zh: "秋天", tip: "autumn：n 不发音，但拼写要有。" },
    { unitId: "u8", prompt: "因为（开头 be-）", answers: ["because"], zh: "因为", tip: "be-cause，两个词根连写。" },
    { unitId: "u6", prompt: "天气 weather（th 在中间）", answers: ["weather"], zh: "天气", tip: "wea-ther，别拼成 whether（是否）。" },
    { unitId: "u6", prompt: "雨伞 umbrella（双写 l 前是 um）", answers: ["umbrella"], zh: "雨伞", tip: "um-brel-la，两个 l。" },
    { unitId: "u8", prompt: "太阳镜 sunglasses（两个词连写）", answers: ["sunglasses"], zh: "太阳镜", tip: "sun + glasses 连写，glass 有双写 s。" },
    { unitId: "u8", prompt: "衣服 clothes（无声的 e）", answers: ["clothes"], zh: "衣服", tip: "clo-th-es，o 后面有 th。" },
    { unitId: "u8", prompt: "短裤 shorts（shirt 的兄弟）", answers: ["shorts"], zh: "短裤", tip: "short 加 s；shirt 是衬衫。" },
    { unitId: "u1", prompt: "学科 subject（j 在中间）", answers: ["subject"], zh: "学科", tip: "sub-ject，j 后面是 ect。" },
    { unitId: "u1", prompt: "有趣的 interesting（三段式）", answers: ["interesting"], zh: "有趣的", tip: "in-ter-est-ing，别漏中间的 e。" },
    { unitId: "u4", prompt: "篮球 basketball（两个词连写）", answers: ["basketball"], zh: "篮球", tip: "basket + ball 连写，中间没有空格。" },
    { unitId: "u4", prompt: "乒乓球（新教材说法，有连字符）", answers: ["ping-pong"], zh: "乒乓球", tip: "ping-pong 有连字符；旧说法是 table tennis。" },
    { unitId: "u4", prompt: "困难的 difficult（双 f 之间是 i）", answers: ["difficult"], zh: "困难的", tip: "dif-fi-cult，两个 f。" },
    { unitId: "u5", prompt: "机器人 robot（o 开头 o 结尾）", answers: ["robot"], zh: "机器人", tip: "ro-bot，别拼成 rebort。" },
    { unitId: "u5", prompt: "不同的 different（三段式）", answers: ["different"], zh: "不同的", tip: "dif-fer-ent，中间是 fer。" },
    { unitId: "u5", prompt: "眼睛（注意复数形式拼写）", answers: ["eyes"], zh: "眼睛（两只）", tip: "Her eyes are big. 用复数。" },
    { unitId: "u5", prompt: "耳朵（两只，拼写里有 ar）", answers: ["ears"], zh: "耳朵", tip: "ear + s，别漏 a。" },
    { unitId: "u6", prompt: "多云的 cloudy（cloud 加 y）", answers: ["cloudy"], zh: "多云的", tip: "cloud + y；注意别丢 u。" },
    { unitId: "u6", prompt: "温暖的 warm（没有 o 在中间）", answers: ["warm"], zh: "温暖的", tip: "w-arm，不是 worm（虫）。" },
    { unitId: "u7", prompt: "冬天 winter（开头 wi）", answers: ["winter"], zh: "冬天", tip: "win-ter，里面是 win。" },
    { unitId: "u7", prompt: "雪 snow（知道 know 少个 k）", answers: ["snow"], zh: "雪", tip: "s-now；know 知道开头是 kn-。" },
    { unitId: "u7", prompt: "知道 know（k 不发音但要写）", answers: ["know"], zh: "知道", tip: "k 不发音：know / snow 都有 silent k？只有 know 有。" },
    { unitId: "u2", prompt: "早餐 breakfast（break + fast）", answers: ["breakfast"], zh: "早餐", tip: "break + fast 连写。" },
    { unitId: "u2", prompt: "午餐 lunch（没有 en）", answers: ["lunch"], zh: "午餐", tip: "lunch 午餐；dinner 晚餐。" },
    { unitId: "u3", prompt: "十一 eleven（三个 e）", answers: ["eleven"], zh: "十一", tip: "e-le-ven，开头结尾都是 e。" },
    { unitId: "u1", prompt: "科学 Science（结尾是 ence）", answers: ["Science"], zh: "科学", tip: "sci-ence，c 后面是 e。" },
    { unitId: "u1", prompt: "音乐 Music（大写因为学科名）", answers: ["Music"], zh: "音乐（课）", tip: "学科名首字母大写：Music, Art, Maths。" }
  ];

  global.DICTATION_CONTENT = {
    updatedAt: "2026-11-04",
    note: "看图题使用 emoji 插图（非教材原图）；词表对齐新教材词汇表；强化清单为自编补充练习；听音使用语音包/语音合成。",
    wordImages: WORD_IMAGES,
    confusions: CONFUSIONS
  };
})(window);
