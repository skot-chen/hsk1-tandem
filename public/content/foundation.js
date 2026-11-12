// @ts-check
// Foundation stages, taught BEFORE the 15 lessons (the learning path of this course):
//   Stage 1 拼音 Pinyin  → must pass the reading test (P6) before Stage 2
//   Stage 2 汉字 Characters: strokes → single-component characters → structures → radicals 部首/偏旁 → test (C6)
// The pinyin points, strokes, single-component characters and radicals follow the
// "拼音 / 汉字" columns of the HSK Standard Course 1 contents table (checked 2026-11-09),
// regrouped into these stages. Explanations, tips and examples are original.
//
// sounds:  [label, example character, its pinyin, hint]          (pinyin stage)
// strokes: [stroke, name, English, example characters]          (character stage)
// radicals:[radical, name, meaning, example characters]
// chars:   [character, pinyin, meaning, how it is built]
// notes:   [title, explanation (EN), teaching tip (中文)]
// checkpoint: { title, pass (0–1), items: [prompt, answer] }

/** @typedef {import('./lessons.js').Part} Part */

/** @type {Part[]} */
export const PINYIN = [
  {
    id: 'P1', stage: 'pinyin', lesson: 1, part: 'A', title: '声调 · 单韵母', titleEn: 'Tones and simple finals',
    focus: 'The 4 tones + neutral tone · a o e i u ü · initials b p m f d t n l',
    sounds: [
      ['mā', '妈', 'mā', '1st tone: high and flat, like holding a note'], ['má', '麻', 'má', '2nd: rising, like a surprised "what?"'],
      ['mǎ', '马', 'mǎ', '3rd: low, dips down (then rises at the end)'], ['mà', '骂', 'mà', '4th: falling, short and firm like a command'],
      ['a', '啊', 'ā', 'mouth wide open'], ['o', '噢', 'ō', 'round lips'], ['e', '饿', 'è', '"uh" from the back of the throat — not Dutch e'],
      ['i', '衣', 'yī', 'smile: "ee"'], ['u', '五', 'wǔ', 'round lips: "oo"'], ['ü', '鱼', 'yú', 'say "ee" with round lips = Dutch u in "nu"'],
      ['b', '八', 'bā', 'no puff of air (like Dutch p)'], ['p', '怕', 'pà', 'strong puff of air'], ['m', '妈', 'mā', ''], ['f', '飞', 'fēi', ''],
      ['d', '大', 'dà', 'no puff (like Dutch t)'], ['t', '他', 'tā', 'strong puff'], ['n', '你', 'nǐ', ''], ['l', '来', 'lái', ''],
    ],
    notes: [
      ['A tone changes the word', 'mā 妈 mum · má 麻 hemp · mǎ 马 horse · mà 骂 scold. Draw the tone in the air with your hand while saying it.', '用手在空中画声调，让他边说边比划。每次课开头都练 mā má mǎ mà。'],
      ['Puff or no puff', 'Hold a paper in front of your mouth: p and t make it move, b and d don\'t.', '送气/不送气用纸片演示。荷兰语的 p、t 本来不送气，正好等于汉语的 b、d。'],
    ],
    drill: ['bā bá bǎ bà', 'pō pó pǒ pò', 'mī mí mǐ mì', 'dū dú dǔ dù', 'nǚ lǜ', 'tā dà · pà bà'],
    hw: { learner: 'Discord voice message: read the drill lines (bā bá bǎ bà …). Exaggerate the tones!', me: 'Voice message (1 min, English): introduce your hometown — where it is and one thing it is famous for.' },
    en: { topic: 'Greetings across cultures', qs: ['How do Dutch people greet friends vs. strangers? (Three kisses?)', 'Is "How are you?" a real question in English?', 'How do people in your hometown greet each other?'], phrases: [['Long time no see', '好久不见'], ['How\'s it going?', '最近怎么样？（口语）'], ['Nice to finally meet you', '终于见到你了']] },
  },
  {
    id: 'P2', stage: 'pinyin', lesson: 2, part: 'A', title: '声母 g k h j q x · 复韵母', titleEn: 'More initials, compound finals',
    focus: 'g k h j q x · ai ei ao ou ia ie ua uo üe iao iou uai uei · 3rd + 3rd tone',
    sounds: [
      ['g', '哥', 'gē', 'like an unaspirated k — NOT the Dutch throaty g'], ['k', '渴', 'kě', 'k with a puff'], ['h', '喝', 'hē', 'softer than Dutch g/ch'],
      ['j', '鸡', 'jī', 'tongue flat behind lower teeth, like "jee"'], ['q', '七', 'qī', 'j + puff, like "chee"'], ['x', '西', 'xī', 'like "shee" with a smile'],
      ['ai', '爱', 'ài', 'like English "eye"'], ['ei', '北', 'běi', 'like "day"'], ['ao', '好', 'hǎo', 'like "how"'], ['ou', '狗', 'gǒu', 'like "go"'],
      ['ia', '家', 'jiā', ''], ['ie', '谢', 'xiè', '"yeh"'], ['ua', '花', 'huā', ''], ['uo', '我', 'wǒ', '"waw"'], ['üe', '学', 'xué', 'ü + eh'],
      ['iao', '小', 'xiǎo', ''], ['iou → iu', '六', 'liù', 'written iu'], ['uai', '快', 'kuài', '"why"'], ['uei → ui', '对', 'duì', 'written ui'],
    ],
    notes: [
      ['3rd + 3rd tone', 'Two 3rd tones together: the first becomes 2nd. 你好 nǐ hǎo is said ní hǎo (still written nǐ hǎo).', '两个三声连读，前一个变二声。'],
      ['Loud start, soft end', 'In ai ei ao ou the first vowel is long and loud, then glide.', '复韵母前重后轻，夸张口型对比 ai/ei、ao/ou。'],
    ],
    drill: ['gē kē hē', 'jī qī xī', 'ài běi hǎo gǒu', 'jiā xiè huā wǒ xué', 'xiǎo liù kuài duì', 'nǐ hǎo (= ní hǎo)'],
    hw: { learner: 'Voice message: jī qī xī · gē kē hē · read the 4th and 5th drill lines.', me: 'Write 5 sentences: when do people say sorry in China but not in the Netherlands?' },
    en: { topic: 'Apologising and being direct', qs: ['Dutch people are famous for being direct. Is that rude or honest?', 'When do you say "sorry" in Chinese, and when not?', 'What do you say when someone bumps into you?'], phrases: [['My bad', '我的错（口语）'], ['No worries', '没事'], ['I didn\'t mean to …', '我不是故意…']] },
  },
  {
    id: 'P3', stage: 'pinyin', lesson: 3, part: 'A', title: '声母 zh ch sh r z c s · 鼻韵母', titleEn: 'Retroflex initials and nasal finals',
    focus: 'zh ch sh r · z c s · an en in ün … ang eng ing ong … · neutral tone',
    sounds: [
      ['zh', '中', 'zhōng', 'tongue tip curled up'], ['ch', '吃', 'chī', 'zh + puff'], ['sh', '是', 'shì', 'curled "sh"'], ['r', '热', 'rè', 'curled, a bit like the English r'],
      ['z', '字', 'zì', 'like "ds" in "beds"'], ['c', '菜', 'cài', 'like "ts" + puff'], ['s', '四', 'sì', 'like s'],
      ['an', '看', 'kàn', 'tongue tip up (front -n)'], ['en', '人', 'rén', ''], ['in', '您', 'nín', ''], ['ün', '云', 'yún', ''],
      ['ian', '钱', 'qián', 'sounds like "yen"'], ['uan', '晚', 'wǎn', ''], ['üan', '远', 'yuǎn', ''], ['uen → un', '问', 'wèn', 'written un after initials'],
      ['ang', '忙', 'máng', 'back of tongue (like Dutch "lang")'], ['eng', '冷', 'lěng', ''], ['ing', '星', 'xīng', ''], ['ong', '东', 'dōng', ''],
      ['iang', '想', 'xiǎng', ''], ['uang', '黄', 'huáng', ''], ['iong', '熊', 'xióng', ''],
    ],
    notes: [
      ['zh ch sh r vs z c s', 'zh/ch/sh/r: tongue tip curls up. z/c/s: tongue tip flat behind the teeth.', '翘舌音和平舌音对比：中/宗、吃/次、是/四。很多南方方言没有翘舌音，示范时注意标准。'],
      ['Neutral tone', 'Short and light, no mark: 妈妈 māma, 谢谢 xièxie, 朋友 péngyou.', '轻声短而轻。'],
      ['Writing tone marks', 'Mark goes on a > o, e > i, u (on the last one in iu/ui): hǎo, xiè, liù, duì.', '标调规则：有 a 不放过，没 a 找 o、e，i、u 并列标在后。'],
    ],
    drill: ['zhī chī shī rì', 'zì cì sì', 'zhōng / zōng · shì / sì', 'kàn máng · rén lěng', 'qián xiǎng · nín xīng', 'māma · xièxie · péngyou'],
    hw: { learner: 'Voice message: the drill lines. Then write the pinyin (with tone marks) of: 中 吃 是 字 四.', me: 'Write a short goodbye message 3 different ways (formal, friendly, very casual).' },
    en: { topic: 'Ending a conversation', qs: ['How do you end a call politely in English?', 'Is it rude to leave a party without saying goodbye?', 'What do Dutch people say instead of "goodbye"? (Doei!)'], phrases: [['I\'d better get going', '我得走了'], ['Talk to you soon', '回头聊'], ['Let\'s catch up next week', '下周再聊']] },
  },
  {
    id: 'P4', stage: 'pinyin', lesson: 4, part: 'A', title: '拼写规则 · 变调', titleEn: 'Spelling rules and tone changes',
    focus: 'y and w · ü after j q x · tone change of 不 and 一',
    sounds: [
      ['i → yi', '衣', 'yī', 'i alone is written yi'], ['ia → ya', '牙', 'yá', ''], ['u → wu', '五', 'wǔ', 'u alone is written wu'], ['uo → wo', '我', 'wǒ', ''],
      ['ü → yu', '鱼', 'yú', 'ü alone is written yu'], ['jü → ju', '去', 'qù', 'after j q x the dots drop: still ü!'], ['xüe → xue', '学', 'xué', ''],
      ['不 + 4th → bú', '不是', 'bú shì', '不 before a 4th tone becomes 2nd'], ['不 + other', '不好', 'bù hǎo', 'otherwise 4th'],
      ['一 + 4th → yí', '一个', 'yí ge', '一 before a 4th tone becomes 2nd'], ['一 + 1/2/3 → yì', '一起', 'yìqǐ', ''], ['一 counting', '一', 'yī', 'alone or counting: 1st tone'],
    ],
    notes: [
      ['y and w', 'When a syllable starts with i, u or ü, write y / w: yi, ya, wu, wo, yu.', 'y、w 只是拼写规则，不是新的声母。'],
      ['ü in disguise', 'ju qu xu yu always contain ü, never u. The Dutch "u" (nu, minuut) is a good start.', 'j q x y 后面的 u 其实是 ü。'],
    ],
    drill: ['yī wǔ yú', 'jù qù xū · lǜ nǚ', 'bú shì · bù hǎo · bù chī', 'yí ge · yìqǐ · yì tiān', 'bú kèqi · duìbuqǐ'],
    hw: { learner: 'Write the pinyin of: 不是 不好 一个 一起 去 鱼 (with tone changes). Send on Discord.', me: 'Voice message: explain the difference between Mandarin and the dialect(s) you speak.' },
    en: { topic: 'Languages you speak', qs: ['Mandarin or your dialect — which one do you dream in?', 'How many languages do Dutch people usually speak?', 'What is the hardest part of English for you?'], phrases: [['I\'m bilingual / trilingual', '我会说两种/三种语言'], ['It\'s my mother tongue', '这是我的母语'], ['I\'m a bit rusty', '我有点生疏了']] },
  },
  {
    id: 'P5', stage: 'pinyin', lesson: 5, part: 'A', title: '双音节声调搭配', titleEn: 'Tone pairs in two-syllable words',
    focus: '1st/2nd/3rd/4th tone + every tone · er and 儿化 · the apostrophe',
    sounds: [
      ['1+1', '飞机', 'fēijī', ''], ['1+2', '中国', 'Zhōngguó', ''], ['1+3', '喝水', 'hē shuǐ', ''], ['1+4', '商店', 'shāngdiàn', ''],
      ['2+1', '明天', 'míngtiān', ''], ['2+2', '学习', 'xuéxí', ''], ['2+3', '苹果', 'píngguǒ', ''], ['2+4', '学校', 'xuéxiào', ''],
      ['3+1', '老师', 'lǎoshī', 'half 3rd: stay low'], ['3+2', '女儿', 'nǚ\'ér', 'apostrophe separates nǚ and ér'], ['3+3', '你好', 'nǐ hǎo', '→ ní hǎo'], ['3+4', '米饭', 'mǐfàn', ''],
      ['4+1', '看书', 'kàn shū', ''], ['4+2', '大学', 'dàxué', ''], ['4+3', '电脑', 'diànnǎo', ''], ['4+4', '再见', 'zàijiàn', 'first 4th a bit lighter'],
      ['er', '二', 'èr', 'curl the tongue'], ['-r (儿化)', '哪儿', 'nǎr', 'add a curled r to the end'],
    ],
    notes: [
      ['Half 3rd tone', 'Before a 1st, 2nd or 4th tone, the 3rd tone only goes low and does not rise: lǎoshī, mǐfàn.', '三声在非三声前只读半三声（只低不升）。'],
      ['Practise as pairs', 'Most Chinese words have two syllables — learning the 16 tone pairs makes all later words easier.', '十六种组合每天读一遍，比单字练声调更有用。'],
    ],
    drill: ['fēijī Zhōngguó hē shuǐ shāngdiàn', 'míngtiān xuéxí píngguǒ xuéxiào', 'lǎoshī nǚ\'ér nǐ hǎo mǐfàn', 'kàn shū dàxué diànnǎo zàijiàn', 'èr · nǎr · nàr · yìdiǎnr'],
    hw: { learner: 'Voice message: all 16 tone pairs (the 4 drill lines). Your teacher marks the wrong ones.', me: 'Write 5 tips for learning a language as an adult, in English.' },
    en: { topic: 'Learning languages', qs: ['What helped you most when learning English?', 'Is pronunciation or grammar harder?', 'What do you do when you don\'t understand someone?'], phrases: [['I\'m getting the hang of it', '我渐渐上手了'], ['It\'s on the tip of my tongue', '话到嘴边说不出来'], ['Could you say that again, more slowly?', '能再慢点说一遍吗？']] },
  },
  {
    id: 'P6', stage: 'pinyin', lesson: 6, part: 'A', title: '拼音总复习 · 测试', titleEn: 'Pinyin review and reading test',
    focus: 'Three-syllable words · reading test (pass 80% to start characters)',
    sounds: [
      ['1 + …', '星期天', 'xīngqītiān', ''], ['1 + …', '出租车', 'chūzūchē', ''], ['2 + …', '没关系', 'méi guānxi', ''], ['2 + …', '十一月', 'shíyī yuè', ''],
      ['3 + …', '我们的', 'wǒmen de', ''], ['3 + …', '火车站', 'huǒchēzhàn', ''], ['4 + …', '对不起', 'duìbuqǐ', ''], ['4 + …', '不客气', 'bú kèqi', ''], ['4 + …', '打电话', 'dǎ diànhuà', '3 + 4 + 4'],
    ],
    notes: [
      ['How the test works', 'Your teacher shows pinyin; you read it aloud. Teacher clicks ✓ or ✗. 80% = pass → next we start Chinese characters.', '测试：只看拼音读出来，你点 ✓/✗。没到 80% 下次再测，先复习错的。'],
    ],
    drill: ['xīngqītiān · chūzūchē · huǒchēzhàn', 'méi guānxi · duìbuqǐ · bú kèqi', 'dǎ diànhuà · shíyī yuè'],
    checkpoint: {
      title: 'Pinyin reading test 拼音认读测试', pass: 0.8,
      items: [['bā', '八'], ['pà', '怕'], ['mǎi', '买'], ['fēi', '飞'], ['tīng', '听'], ['nǚ', '女'], ['lǜ', '绿'], ['gěi', '给'], ['kuài', '块'], ['hē', '喝'],
        ['jiā', '家'], ['qù', '去'], ['xué', '学'], ['zhè', '这'], ['chī', '吃'], ['shuō', '说'], ['rè', '热'], ['zài', '在'], ['cài', '菜'], ['sì', '四'],
        ['xiǎng', '想'], ['yuǎn', '远'], ['nǐ hǎo', '你好'], ['bú shì', '不是'], ['yìqǐ', '一起']],
    },
    hw: { learner: 'If you passed: celebrate 🎉. If not: voice message reading the ✗ items 3 times each.', me: 'Write a short review: what was easy / hard for him in pinyin? (English, 6 sentences)' },
    en: { topic: 'Feedback and encouragement', qs: ['How do you like to get feedback — direct or gentle?', 'Dutch feedback vs. Chinese feedback: any difference?', 'What is a skill you are proud of learning?'], phrases: [['You\'re making great progress', '你进步很大'], ['Spot on!', '完全正确！'], ['Nearly there', '差一点就对了']] },
  },
];

/** @type {Part[]} */
export const HANZI = [
  {
    id: 'C1', stage: 'hanzi', lesson: 1, part: 'A', title: '笔画（一）· 独体字', titleEn: 'Basic strokes, first characters',
    focus: 'Strokes 一 丨 丿 丶 ㇏ 𠃍 ㇄ 亅 · characters 一 二 三 十 八 六 口 见 山 小 不',
    strokes: [['一', '横 héng', 'horizontal, left → right', '一 二 三'], ['丨', '竖 shù', 'vertical, top → bottom', '十 中'], ['丿', '撇 piě', 'left-falling', '八 人'], ['丶', '点 diǎn', 'dot', '六 小'],
      ['㇏', '捺 nà', 'right-falling', '八 大'], ['𠃍', '横折 héngzhé', 'horizontal then down', '口'], ['㇄', '竖折 shùzhé', 'down then right', '山'], ['亅', '竖钩 shùgōu', 'vertical with hook', '小']],
    chars: [['一', 'yī', 'one', '1 stroke'], ['二', 'èr', 'two', '2 strokes'], ['三', 'sān', 'three', '3 strokes'], ['十', 'shí', 'ten', '横 + 竖 — a cross'], ['八', 'bā', 'eight', '撇 + 捺'], ['六', 'liù', 'six', ''],
      ['口', 'kǒu', 'mouth', 'picture of an open mouth'], ['见', 'jiàn', 'to see', 'an eye on legs'], ['山', 'shān', 'mountain', 'three peaks'], ['小', 'xiǎo', 'small', ''], ['不', 'bù', 'not', '']],
    notes: [
      ['Characters are built from strokes', 'Every character is written with a small set of strokes, always in the same direction and order.', '先学笔画名称，写字时让他边写边说笔画名，以后看笔顺动画会更快。'],
      ['Pictures', '口 looks like a mouth, 山 like mountains. Many simple characters started as pictures.', '讲象形字的故事，帮助记忆。'],
    ],
    hw: { learner: 'Write 一 二 三 十 八 六 口 山 小 3× each on paper (watch the stroke animations first). Send a photo.', me: 'Voice message: describe a Chinese character you like and why (English).' },
    en: { topic: 'Writing by hand', qs: ['Do you still write by hand? When?', 'Do Chinese people forget how to write characters because of phones?', 'Is your handwriting neat or messy?'], phrases: [['My handwriting is a mess', '我的字很乱'], ['Practice makes perfect', '熟能生巧'], ['Stroke order', '笔顺']] },
  },
  {
    id: 'C2', stage: 'hanzi', lesson: 2, part: 'A', title: '笔画（二）· 笔顺', titleEn: 'Hook strokes, stroke order',
    focus: 'Strokes ㇆ ㇃ 乚 ㇈ · characters 月 心 中 人 七 儿 几 九 · stroke-order rules 1–2',
    strokes: [['㇆', '横折钩 héngzhégōu', 'horizontal-turn-hook', '月'], ['㇃', '卧钩 wògōu', 'lying hook', '心'], ['乚', '竖弯钩 shùwāngōu', 'vertical-bend-hook', '七 儿'], ['㇈', '横折弯钩 héngzhéwāngōu', 'horizontal-turn-bend-hook', '几 九']],
    chars: [['月', 'yuè', 'moon, month', 'picture of the crescent moon'], ['心', 'xīn', 'heart', '卧钩 + 3 dots'], ['中', 'zhōng', 'middle', 'a line through the middle of a box'], ['人', 'rén', 'person', 'two legs walking'],
      ['七', 'qī', 'seven', ''], ['儿', 'ér', 'son, child', ''], ['几', 'jǐ', 'how many', ''], ['九', 'jiǔ', 'nine', '']],
    notes: [
      ['Stroke order rule 1', 'Horizontal before vertical (十), left-falling before right-falling (人, 八).', '笔顺规则（1）：先横后竖，先撇后捺。'],
      ['Stroke order rule 2', 'Top before bottom (三), left before right (八, 儿).', '笔顺规则（2）：从上到下，从左到右。'],
    ],
    hw: { learner: 'Write 月 心 中 人 七 九 — say each stroke name while writing. Photo on Discord.', me: 'Write 6 sentences about a habit you want to build (use "I\'ve been trying to …").' },
    en: { topic: 'Habits and routines', qs: ['What do you do every day without thinking?', 'Which habit would you like to change?', 'How do you remember new words?'], phrases: [['I\'ve been trying to …', '我最近在努力…'], ['It\'s become second nature', '已经成了习惯'], ['I keep forgetting to …', '我老是忘了…']] },
  },
  {
    id: 'C3', stage: 'hanzi', lesson: 3, part: 'A', title: '笔画（三）· 独体与合体', titleEn: 'Last strokes, simple vs compound characters',
    focus: 'Strokes ㇇ ㇛ ㇜ ㇂ ㇀ · characters 水 女 了 大 东 我 西 · stroke-order rule 3',
    strokes: [['㇇', '横撇 héngpiě', 'horizontal-left-falling', '了 水'], ['㇛', '撇点 piědiǎn', 'left-falling-dot', '女'], ['㇜', '撇折 piězhé', 'left-falling-turn', '东'], ['㇂', '斜钩 xiégōu', 'slanting hook', '我'], ['㇀', '提 tí', 'rising stroke', '我']],
    chars: [['水', 'shuǐ', 'water', 'water flowing in a stream'], ['女', 'nǚ', 'woman', 'a kneeling woman'], ['了', 'le', '(completed / change)', ''], ['大', 'dà', 'big', 'a person (人) with arms stretched wide (一)'],
      ['东', 'dōng', 'east', ''], ['我', 'wǒ', 'I, me', '7 strokes — the hardest so far!'], ['西', 'xī', 'west', '']],
    notes: [
      ['Stroke order rule 3', 'Outside before inside, but close the box last (日, 回). Middle before the sides (小, 水).', '笔顺规则（3）：先外后内再封口，先中间后两边。'],
      ['Single vs compound', 'Single-component (独体字): can\'t be split (人 大 女). Compound (合体字): made of parts (好 = 女 + 子).', '独体字/合体字：后面学部首时，合体字 = 部首 + 其他部分。'],
    ],
    hw: { learner: 'Write 水 女 大 我 — 我 five times. Find 女 inside 好 and 她.', me: 'Describe your hometown\'s geography in English: east, west, rivers, mountains.' },
    en: { topic: 'Places and directions', qs: ['Where is your hometown? Explain it to someone who has never been to China.', 'How do you give directions to a tourist?', 'Do you have a good sense of direction?'], phrases: [['It\'s on the east coast', '在东海岸'], ['Turn left at …', '在…左转'], ['I\'m hopeless with directions', '我是路痴']] },
  },
  {
    id: 'C4', stage: 'hanzi', lesson: 4, part: 'A', title: '汉字结构 · 部首（一）', titleEn: 'Character structures, first radicals',
    focus: 'Left-right · top-bottom · half-enclosure · radicals 氵 讠 钅 口 辶 门',
    radicals: [['氵', '三点水 sān diǎn shuǐ', 'water', '汉 没 漂'], ['讠', '言字旁 yán zì páng', 'speech, words', '说 请 谢 读 语'], ['钅', '金字旁 jīn zì páng', 'metal, money', '钱'],
      ['口', '口字旁 kǒu zì páng', 'mouth (eating, speaking, particles)', '吃 喝 叫 吗 呢'], ['辶', '走之旁 zǒu zhī páng', 'walking, movement', '这 还'], ['门', '门字框 mén zì kuàng', 'door', '们 问']],
    chars: [['四', 'sì', 'four', ''], ['五', 'wǔ', 'five', ''], ['书', 'shū', 'book', ''], ['少', 'shǎo', 'few', '小 + 丿'], ['个', 'gè', '(measure word)', ''], ['在', 'zài', 'at, in', ''],
      ['子', 'zǐ', 'child', ''], ['工', 'gōng', 'work', ''], ['汉', 'hàn', 'Chinese (汉语)', '氵 + 又'], ['说', 'shuō', 'to speak', '讠 + 兑'], ['吃', 'chī', 'to eat', '口 + 乞'], ['这', 'zhè', 'this', '辶 + 文'], ['问', 'wèn', 'to ask', '门 + 口 — a mouth at the door']],
    notes: [
      ['Structures', 'Left-right 你 · left-middle-right 谢 · top-bottom 字 · top-middle-bottom 意 · half-enclosure 这 · full enclosure 国.', '汉字结构：左右、左中右、上下、上中下、半包围、全包围。'],
      ['Radical = meaning hint', 'The radical (部首) tells you the topic: 讠 = speech → 说 speak, 请 please, 谢 thank.', '部首提示意思：看到讠就和说话有关。'],
    ],
    hw: { learner: 'Find 5 characters with 讠 or 口 in the words you know. Send them with their meaning.', me: 'Write about a book or app that helped you learn English.' },
    en: { topic: 'Reading and books', qs: ['What was the last book you read?', 'Paper books or e-books?', 'What did you read as a child?'], phrases: [['I couldn\'t put it down', '我一看就停不下来'], ['It\'s a page-turner', '很引人入胜'], ['I\'m more of a listener — podcasts', '我更喜欢听，比如播客']] },
  },
  {
    id: 'C5', stage: 'hanzi', lesson: 5, part: 'A', title: '部首（二）', titleEn: 'More radicals',
    focus: 'Full enclosure · radicals 囗 扌 阝 亻 女 饣 日 目 · characters 上 下 本 末 午 电 天 气 雨 日 目 习',
    radicals: [['囗', '国字框 guó zì kuàng', 'enclosure, border', '国 回 四'], ['扌', '提手旁 tí shǒu páng', 'hand', '打'], ['阝', '双耳旁 shuāng ěr páng', 'hill / town (left) · city (right)', '院 那 哪 都'],
      ['亻', '单人旁 dān rén páng', 'person', '你 他 们 做 住'], ['女', '女字旁 nǚ zì páng', 'woman', '好 她 妈 姐'], ['饣', '食字旁 shí zì páng', 'food', '饭'],
      ['日', '日字旁 rì zì páng', 'sun, day, time', '明 时 昨 晚'], ['目', '目字旁 mù zì páng', 'eye', '睡 看 眼']],
    chars: [['上', 'shàng', 'up, on', 'a mark above the line'], ['下', 'xià', 'down, under', 'a mark below the line'], ['本', 'běn', 'root; (measure for books)', '木 tree + a mark at the root'], ['末', 'mò', 'end, tip', '木 + a mark at the top'],
      ['午', 'wǔ', 'noon', ''], ['电', 'diàn', 'electricity', 'lightning'], ['天', 'tiān', 'sky, day', '大 + a line above the person'], ['气', 'qì', 'air, gas', ''], ['雨', 'yǔ', 'rain', 'drops falling from a cloud'],
      ['日', 'rì', 'sun, day', ''], ['目', 'mù', 'eye', 'an eye turned on its side'], ['习', 'xí', 'to practise', ''],
      ['你', 'nǐ', 'you', '亻 + 尔'], ['好', 'hǎo', 'good', '女 + 子 — a mother with her child'], ['明', 'míng', 'bright', '日 sun + 月 moon'], ['饭', 'fàn', 'meal, rice', '饣 + 反']],
    notes: [
      ['Pairs that explain each other', '上/下 and 本/末 are built the same way: one mark shows the position.', '指事字：上下、本末一起教。'],
      ['日 vs 目', '日 has 1 line inside, 目 has 2. Sun vs eye.', '日、目对比，容易混。'],
    ],
    hw: { learner: 'Make a "radical family" photo: 亻 → 你 他 们; 女 → 好 她 妈; 日 → 明 昨.', me: 'Describe the weather and your mood today in English (8 sentences).' },
    en: { topic: 'Family and people around you', qs: ['Who do you live with?', 'Describe someone in your family in 3 adjectives.', 'Are family ties stronger in China or the Netherlands?'], phrases: [['We\'re very close', '我们关系很亲'], ['She takes after her mum', '她像她妈妈'], ['an only child', '独生子女']] },
  },
  {
    id: 'C6', stage: 'hanzi', lesson: 6, part: 'A', title: '部首（三）· 形声字 · 测试', titleEn: 'Last radicals, sound+meaning characters, test',
    focus: 'Radicals 月 艹 宀 · characters 开 车 回 年 出 飞 · radical test (pass 80% to start the lessons)',
    radicals: [['月', '月字旁 yuè zì páng', 'moon; also body/flesh', '朋 服 脑'], ['艹', '草字头 cǎo zì tóu', 'grass, plants', '茶 菜 苹'], ['宀', '宝盖头 bǎo gài tóu', 'roof, house', '家 字 客']],
    chars: [['开', 'kāi', 'open; drive', ''], ['车', 'chē', 'car, vehicle', 'a cart seen from above'], ['回', 'huí', 'return', 'a box inside a box'], ['年', 'nián', 'year', ''], ['出', 'chū', 'go out', ''], ['飞', 'fēi', 'fly', 'wings'],
      ['妈', 'mā', 'mum', '女 meaning + 马 mǎ sound'], ['吗', 'ma', '(question)', '口 + 马 sound'], ['请', 'qǐng', 'please', '讠 + 青 qīng sound'], ['家', 'jiā', 'home', '宀 roof + 豕 pig'], ['茶', 'chá', 'tea', '艹 plant']],
    notes: [
      ['Sound + meaning (形声字)', 'Most characters = meaning radical + sound part: 妈 吗 骂 all have 马 mǎ (sound) + a different radical (meaning).', '形声字：形旁表义、声旁表音。80% 以上的汉字是形声字，学会它可以猜生字。'],
      ['How the test works', 'Teacher shows a radical; you say its meaning (in English or Chinese). 80% = pass → start Lesson 1.', '测试：说出部首的意思。'],
    ],
    checkpoint: {
      title: 'Radical test 部首测试', pass: 0.8,
      items: [['亻', 'person'], ['口', 'mouth'], ['日', 'sun / day'], ['月', 'moon / body'], ['氵', 'water'], ['女', 'woman'], ['讠', 'speech'], ['扌', 'hand'], ['艹', 'grass / plant'],
        ['宀', 'roof / house'], ['钅', 'metal / money'], ['饣', 'food'], ['辶', 'walking'], ['目', 'eye'], ['门', 'door'], ['囗', 'enclosure'], ['阝', 'hill / town'], ['心', 'heart']],
    },
    hw: { learner: 'Guess the meaning of 3 new characters from their radicals: 河 江 洗 (hint: 氵). Send your guesses.', me: 'Write a reflection: what you learned teaching pinyin and characters, and what to do differently.' },
    en: { topic: 'Learning strategies', qs: ['Do you learn better by seeing, hearing or doing?', 'What is a memory trick you use?', 'How do you stay motivated?'], phrases: [['a mnemonic', '记忆口诀'], ['It finally clicked', '终于弄懂了'], ['to cram', '临时抱佛脚']] },
  },
];
