// @ts-check
// HSK 1 course content, following the lesson order and vocabulary of
// "HSK Standard Course 1" (15 lessons). Example sentences, dialogues, tips and
// English topics are original (written for this app), not copied from the book.
//
// Each lesson is split into Part A and Part B = one 30-minute session each.
// words:     [hanzi, pinyin, English]
// sentences: [hanzi, pinyin, English]
// grammar:   [title, explanation for the learner (EN), teaching tip for the teacher (中文)]
// dialogue:  [speaker, hanzi, pinyin, English]
// hw:        homework between sessions (learner = Chinese, me = English)
// en:        the English half of the session (the teacher practises English)

/** @typedef {{id:string, stage?:'pinyin'|'hanzi'|'hsk', lesson:number, part:'A'|'B', title:string, titleEn:string, focus:string,
 *  words?:string[][], sentences?:string[][], grammar?:string[][], dialogue?:string[][],
 *  sounds?:string[][], strokes?:string[][], radicals?:string[][], chars?:string[][], notes?:string[][], drill?:string[],
 *  checkpoint?:{title:string, pass:number, items:string[][]},
 *  hw:{learner:string, me:string}, en:{topic:string, qs:string[], phrases:string[][]}}} Part */

import { PINYIN, HANZI } from './foundation.js';

export const STAGES = [
  { key: 'pinyin', name: 'Stage 1 · Pinyin', zh: '第一阶段 · 拼音', note: 'Sounds and tones first. Pass the reading test to unlock characters.' },
  { key: 'hanzi', name: 'Stage 2 · Characters', zh: '第二阶段 · 汉字（笔画 → 部首）', note: 'Strokes → simple characters → structures → radicals. Pass the radical test to unlock the lessons.' },
  { key: 'hsk', name: 'Stage 3 · HSK 1 lessons', zh: '第三阶段 · HSK1 课文', note: 'Words, grammar and dialogues of HSK Standard Course 1, lessons 1–15.' },
];

/** Short label like "Pinyin 3", "Characters 2" or "Lesson 5A". @param {Part} p */
export function partLabel(p) {
  if (p.stage === 'pinyin') return `Pinyin ${p.lesson}`;
  if (p.stage === 'hanzi') return `Characters ${p.lesson}`;
  return p.id === 'L1A' ? 'Lessons 1–2' : `Lesson ${p.lesson}${p.part}`;
}

/** @type {Part[]} */
const HSK = [
  // ───────── Lessons 1–2 你好 · 谢谢你 (sounds are taught in the pinyin stage) ─────────
  {
    id: 'L1A', lesson: 1, part: 'A', title: '你好 · 谢谢你', titleEn: 'Hello · Thank you',
    focus: 'Lessons 1–2 words: greeting, sorry, thanks, goodbye',
    words: [['你', 'nǐ', 'you'], ['好', 'hǎo', 'good, well'], ['您', 'nín', 'you (polite)'], ['你们', 'nǐmen', 'you (plural)'], ['对不起', 'duìbuqǐ', 'sorry'], ['没关系', 'méi guānxi', 'it doesn\'t matter'],
      ['谢谢', 'xièxie', 'thank you'], ['不', 'bù', 'not, no'], ['不客气', 'bú kèqi', 'you\'re welcome'], ['再见', 'zàijiàn', 'goodbye']],
    sentences: [['你好！', 'Nǐ hǎo!', 'Hello!'], ['老师，您好！', 'Lǎoshī, nín hǎo!', 'Hello, teacher!'], ['对不起！——没关系。', 'Duìbuqǐ! — Méi guānxi.', 'Sorry! — That\'s OK.'], ['谢谢你！——不客气。', 'Xièxie nǐ! — Bú kèqi.', 'Thank you! — You\'re welcome.']],
    grammar: [
      ['你 vs 您', '您 is the polite "you" for teachers, older people, customers. 你们 = you (plural).', '您 用于长辈、老师、客人；荷兰语 u/jij 的区别正好类比。'],
      ['Fixed answers', 'Learn them as pairs: 对不起 → 没关系, 谢谢 → 不客气, 再见 → 再见.', '这几组都是固定搭配，成对练。'],
    ],
    dialogue: [['A', '你好！', 'Nǐ hǎo!', 'Hello!'], ['B', '你好！', 'Nǐ hǎo!', 'Hello!'], ['A', '对不起！', 'Duìbuqǐ!', 'Sorry!'], ['B', '没关系。', 'Méi guānxi.', 'No problem.'], ['A', '谢谢你！再见！', 'Xièxie nǐ! Zàijiàn!', 'Thanks! Bye!'], ['B', '不客气。再见！', 'Bú kèqi. Zàijiàn!', 'You\'re welcome. Bye!']],
    hw: { learner: 'Voice message: the dialogue, both roles. Then use 你好 / 谢谢 / 再见 in every Discord chat this week!', me: 'Voice message (1 min): thank someone for something specific, using "I really appreciate …".' },
    en: { topic: 'Thanking and politeness', qs: ['Do Chinese people say "thank you" to family? Why (not)?', 'How do you accept a compliment in Dutch vs. Chinese culture?', 'What is a polite way to refuse an offer?'], phrases: [['I really appreciate it', '真的很感谢'], ['Don\'t mention it', '不客气'], ['That\'s very kind of you', '你太客气了']] },
  },
  // ───────── Lesson 3 你叫什么名字 ─────────
  {
    id: 'L3A', lesson: 3, part: 'A', title: '你叫什么名字', titleEn: 'What\'s your name?',
    focus: 'Asking names · 是 sentences · 什么',
    words: [['叫', 'jiào', 'to be called'], ['什么', 'shénme', 'what'], ['名字', 'míngzi', 'name'], ['我', 'wǒ', 'I, me'], ['是', 'shì', 'to be'], ['老师', 'lǎoshī', 'teacher']],
    sentences: [['你叫什么名字？', 'Nǐ jiào shénme míngzi?', 'What\'s your name?'], ['我叫王明。', 'Wǒ jiào Wáng Míng.', 'My name is Wang Ming.'], ['我是老师。', 'Wǒ shì lǎoshī.', 'I am a teacher.']],
    grammar: [
      ['什么 questions', 'Don\'t change the word order — put 什么 where the answer goes: 你叫什么名字？→ 我叫 Anna。', '疑问词放在答案的位置，不用倒装（荷兰语/英语要倒装，这对他是好消息）。'],
      ['A 是 B', '我是老师。Negative: 我不是老师。是 links nouns only.', '是 只连接名词，不能用于形容词（不能说"我是好"）。'],
    ],
    dialogue: [['A', '你好！我叫王明。你叫什么名字？', 'Nǐ hǎo! Wǒ jiào Wáng Míng. Nǐ jiào shénme míngzi?', 'Hi! I\'m Wang Ming. What\'s your name?'], ['B', '我叫安娜。', 'Wǒ jiào Ānnà.', 'I\'m Anna.'], ['A', '安娜，我是老师。', 'Ānnà, wǒ shì lǎoshī.', 'Anna, I\'m a teacher.']],
    hw: { learner: 'Pick a Chinese name with your teacher. Voice message: 我叫… / 我是… (2 sentences).', me: 'Write 5 sentences about your own name: what it means, who chose it, any nickname.' },
    en: { topic: 'Names', qs: ['What does your name mean? Who chose it?', 'Dutch names have "van", "de", "van der" — what do they mean?', 'Chinese puts the surname first. Which order feels natural to you?'], phrases: [['My surname / family name is ...', '我姓…'], ['You can call me ...', '你可以叫我…'], ['It\'s short for ...', '这是…的简称']] },
  },
  {
    id: 'L3B', lesson: 3, part: 'B', title: '你叫什么名字', titleEn: 'What\'s your name?',
    focus: 'Yes/no questions with 吗 · nationality',
    words: [['吗', 'ma', '(question particle)'], ['学生', 'xuésheng', 'student'], ['人', 'rén', 'person'], ['中国', 'Zhōngguó', 'China'], ['美国', 'Měiguó', 'USA']],
    sentences: [['你是学生吗？', 'Nǐ shì xuésheng ma?', 'Are you a student?'], ['我不是老师，我是学生。', 'Wǒ bú shì lǎoshī, wǒ shì xuésheng.', 'I\'m not a teacher, I\'m a student.'], ['你是中国人吗？', 'Nǐ shì Zhōngguó rén ma?', 'Are you Chinese?']],
    grammar: [
      ['吗 questions', 'Add 吗 to the end of a statement: 你是学生。→ 你是学生吗？Answer 是 / 不是.', '陈述句末加"吗"变疑问句，语序不变。'],
      ['Country + 人', '中国人 Chinese, 美国人 American. Extra: 荷兰 Hélán = Netherlands → 荷兰人.', '国家+人=国籍。顺便教"荷兰人"（不是 HSK1 词，但他一定想说）。'],
    ],
    dialogue: [['A', '你是学生吗？', 'Nǐ shì xuésheng ma?', 'Are you a student?'], ['B', '是，我是学生。你是老师吗？', 'Shì, wǒ shì xuésheng. Nǐ shì lǎoshī ma?', 'Yes, I am. Are you a teacher?'], ['A', '我不是老师。我是中国人。', 'Wǒ bú shì lǎoshī. Wǒ shì Zhōngguó rén.', 'I\'m not a teacher. I\'m Chinese.']],
    hw: { learner: 'Write 3 questions with 吗 in pinyin or characters, send them on Discord. Your teacher answers in Chinese.', me: 'Voice message: explain to a foreigner the difference between Mandarin and the dialect(s) you speak.' },
    en: { topic: 'Where are you from?', qs: ['Where exactly do you live? Describe it to someone who has never been there.', 'What do people abroad get wrong about your country?', 'Do you feel more "Dutch" / "Chinese" or more from your region?'], phrases: [['I\'m originally from ...', '我老家是…'], ['It\'s in the south of China', '在中国南方'], ['It\'s known for ...', '…很有名']] },
  },
  // ───────── Lesson 4 她是我的汉语老师 ─────────
  {
    id: 'L4A', lesson: 4, part: 'A', title: '她是我的汉语老师', titleEn: 'She is my Chinese teacher',
    focus: 'Who? · possession with 的',
    words: [['她', 'tā', 'she, her'], ['他', 'tā', 'he, him'], ['谁', 'shéi', 'who'], ['的', 'de', '(possessive, \'s)'], ['汉语', 'Hànyǔ', 'Chinese (language)']],
    sentences: [['她是谁？', 'Tā shì shéi?', 'Who is she?'], ['她是我的汉语老师。', 'Tā shì wǒ de Hànyǔ lǎoshī.', 'She is my Chinese teacher.'], ['他是我的老师。', 'Tā shì wǒ de lǎoshī.', 'He is my teacher.']],
    grammar: [
      ['的 = \'s', '我的老师 my teacher, 安娜的名字 Anna\'s name. With family you can drop it: 我妈妈.', '"的"表示所属；亲属、亲近关系常省略：我妈妈、我朋友。'],
      ['谁 who', 'Same trick as 什么: 她是谁？→ 她是王老师。', '和"什么"一样，疑问词放在答案的位置。'],
    ],
    dialogue: [['A', '她是谁？', 'Tā shì shéi?', 'Who is she?'], ['B', '她是我的汉语老师。', 'Tā shì wǒ de Hànyǔ lǎoshī.', 'She\'s my Chinese teacher.'], ['A', '他呢？', 'Tā ne?', 'And him?'], ['B', '他是我的学生。', 'Tā shì wǒ de xuésheng.', 'He\'s my student.']],
    hw: { learner: 'Send 2 photos (family or friends) with one Chinese sentence each: 他/她是我的…', me: 'Describe one important person in your life in 6 English sentences (appearance + personality).' },
    en: { topic: 'Describing people', qs: ['Who taught you the most in your life?', 'Describe your best friend\'s personality in 3 adjectives.', 'What makes a good teacher?'], phrases: [['She\'s very down-to-earth', '她很接地气 / 很实在'], ['He\'s easy-going', '他很随和'], ['We get along really well', '我们很合得来']] },
  },
  {
    id: 'L4B', lesson: 4, part: 'B', title: '她是我的汉语老师', titleEn: 'She is my Chinese teacher',
    focus: 'Which country? · "And you?" with 呢',
    words: [['哪', 'nǎ', 'which'], ['国', 'guó', 'country'], ['呢', 'ne', '(and ...?)'], ['同学', 'tóngxué', 'classmate'], ['朋友', 'péngyou', 'friend']],
    sentences: [['你是哪国人？', 'Nǐ shì nǎ guó rén?', 'What nationality are you?'], ['我是荷兰人，你呢？', 'Wǒ shì Hélán rén, nǐ ne?', 'I\'m Dutch, and you?'], ['他是我的朋友。', 'Tā shì wǒ de péngyou.', 'He is my friend.']],
    grammar: [
      ['哪国人', '你是哪国人？= Which country are you from?', '哪+国+人 问国籍。'],
      ['呢 = and ...?', '我是学生，你呢？Use it to bounce the question back.', '"你呢？"把问题抛回去，省掉重复。'],
    ],
    dialogue: [['A', '你是哪国人？', 'Nǐ shì nǎ guó rén?', 'Where are you from?'], ['B', '我是荷兰人。你呢？', 'Wǒ shì Hélán rén. Nǐ ne?', 'I\'m Dutch. And you?'], ['A', '我是中国人。他是我的同学。', 'Wǒ shì Zhōngguó rén. Tā shì wǒ de tóngxué.', 'I\'m Chinese. He\'s my classmate.']],
    hw: { learner: 'Voice message, 4 sentences: name, nationality, + introduce one friend (他/她是我的朋友…).', me: 'Write about how you met one good friend (past tense, 6 sentences).' },
    en: { topic: 'Friendship', qs: ['How do people make friends as adults?', 'Online friends vs. real-life friends — any difference?', 'What do you do with friends at the weekend?'], phrases: [['We hit it off', '我们一见如故'], ['A close friend / an acquaintance', '好朋友 / 认识的人'], ['We drifted apart', '我们渐渐疏远了']] },
  },
  // ───────── Lesson 5 她女儿今年二十岁 ─────────
  {
    id: 'L5A', lesson: 5, part: 'A', title: '她女儿今年二十岁', titleEn: 'Her daughter is 20 this year',
    focus: 'Numbers 1–10 · family · how many? 几',
    words: [['家', 'jiā', 'family, home'], ['有', 'yǒu', 'to have'], ['口', 'kǒu', '(measure word for family members)'], ['女儿', 'nǚ\'ér', 'daughter'], ['几', 'jǐ', 'how many (small numbers)'], ['一二三四五六七八九十', 'yī èr sān sì wǔ liù qī bā jiǔ shí', 'numbers 1–10']],
    sentences: [['你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'How many people are in your family?'], ['我家有四口人。', 'Wǒ jiā yǒu sì kǒu rén.', 'There are four people in my family.'], ['我有一个女儿。', 'Wǒ yǒu yí ge nǚ\'ér.', 'I have one daughter.']],
    grammar: [
      ['几 + measure word', '几 asks "how many" when you expect under 10: 几口人？', '几 问十以内的数，后面要加量词。'],
      ['Hand signs', 'Chinese show 1–10 with one hand (6 = 🤙, 8 = like a pistol, 10 = crossed fingers).', '教他中国手势数字，可以顺便比较你的方言里数字怎么读，很有趣。'],
    ],
    dialogue: [['A', '你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', 'How many in your family?'], ['B', '我家有三口人。你家呢？', 'Wǒ jiā yǒu sān kǒu rén. Nǐ jiā ne?', 'Three. And yours?'], ['A', '我家有五口人。', 'Wǒ jiā yǒu wǔ kǒu rén.', 'Five.']],
    hw: { learner: 'Count 1–10 in a voice message, then: 我家有…口人。', me: 'Voice message (1–2 min): describe your family and one family tradition.' },
    en: { topic: 'Family', qs: ['Big family or small family — which is better?', 'Do grandparents live with the family in your culture?', 'Which family tradition do you like most?'], phrases: [['I\'m an only child', '我是独生子女'], ['My extended family', '大家族 / 亲戚'], ['We\'re very close', '我们关系很亲']] },
  },
  {
    id: 'L5B', lesson: 5, part: 'B', title: '她女儿今年二十岁', titleEn: 'Her daughter is 20 this year',
    focus: 'Asking age · numbers 11–99 · 了 (new situation)',
    words: [['岁', 'suì', 'years (of age)'], ['了', 'le', '(change / now)'], ['今年', 'jīnnián', 'this year'], ['多', 'duō', 'how (old/much)'], ['大', 'dà', 'big; old (age)']],
    sentences: [['她女儿今年几岁了？', 'Tā nǚ\'ér jīnnián jǐ suì le?', 'How old is her daughter this year?'], ['她今年二十岁了。', 'Tā jīnnián èrshí suì le.', 'She\'s twenty this year.'], ['你今年多大了？', 'Nǐ jīnnián duō dà le?', 'How old are you?']],
    grammar: [
      ['Asking age', 'Child: 几岁了？ Adult: 多大了？', '问年龄分人：小孩用"几岁"，同辈用"多大"，长辈用"多大年纪"（超纲，提一下）。'],
      ['11–99', '十一 = 10+1, 二十 = 2×10, 二十五 = 25, 九十九 = 99.', '规律很简单，让他算自己和家人的年龄。'],
    ],
    dialogue: [['A', '你女儿今年几岁了？', 'Nǐ nǚ\'ér jīnnián jǐ suì le?', 'How old is your daughter?'], ['B', '她今年六岁了。', 'Tā jīnnián liù suì le.', 'She\'s six.'], ['A', '你今年多大了？', 'Nǐ jīnnián duō dà le?', 'And how old are you?'], ['B', '我三十五岁。', 'Wǒ sānshíwǔ suì.', 'I\'m thirty-five.']],
    hw: { learner: 'Write the ages of 3 people you know in Chinese: 我妈妈今年…岁。', me: 'Write 5 sentences about a birthday you remember.' },
    en: { topic: 'Age and birthdays', qs: ['Is it rude to ask someone\'s age?', 'How do you celebrate birthdays? (Dutch "kringverjaardag"?)', 'What is a good age to get married?'], phrases: [['She\'s in her twenties', '她二十多岁'], ['I\'m turning 30 next month', '我下个月满30岁'], ['You don\'t look your age', '你看起来不像这个年纪']] },
  },
  // ───────── Lesson 6 我会说汉语 ─────────
  {
    id: 'L6A', lesson: 6, part: 'A', title: '我会说汉语', titleEn: 'I can speak Chinese',
    focus: 'Skills with 会 · adjectives with 很',
    words: [['会', 'huì', 'can (learned skill)'], ['说', 'shuō', 'to speak, say'], ['妈妈', 'māma', 'mum'], ['菜', 'cài', 'dish, food'], ['很', 'hěn', 'very'], ['好吃', 'hǎochī', 'tasty']],
    sentences: [['你会说汉语吗？', 'Nǐ huì shuō Hànyǔ ma?', 'Can you speak Chinese?'], ['我会说汉语。', 'Wǒ huì shuō Hànyǔ.', 'I can speak Chinese.'], ['中国菜很好吃。', 'Zhōngguó cài hěn hǎochī.', 'Chinese food is delicious.']],
    grammar: [
      ['会 + verb', '会 = can (a skill you learned). 我会说汉语。Negative: 不会.', '"会"表示学会的技能，否定"不会"。'],
      ['No 是 with adjectives', '中国菜很好吃 ✓ — not 中国菜是好吃 ✗. 很 often just links.', '形容词谓语句不用"是"，常加"很"（不一定是"非常"）。他很可能会说"我是好"，要纠正。'],
    ],
    dialogue: [['A', '你会说汉语吗？', 'Nǐ huì shuō Hànyǔ ma?', 'Can you speak Chinese?'], ['B', '我会说。', 'Wǒ huì shuō.', 'Yes, I can.'], ['A', '你妈妈会说汉语吗？', 'Nǐ māma huì shuō Hànyǔ ma?', 'Can your mum speak Chinese?'], ['B', '她不会说。', 'Tā bú huì shuō.', 'No, she can\'t.']],
    hw: { learner: 'Voice message: 3 things you can do and 1 you can\'t (我会… / 我不会…).', me: 'Write a short recipe in English for one dish from your hometown (ingredients + 4 steps).' },
    en: { topic: 'Food you grew up with', qs: ['What is a typical dish from your hometown? Explain it to someone who has never tried it.', 'What Dutch food should a Chinese visitor try (or avoid)?', 'Who cooks in your family?'], phrases: [['It\'s a local specialty', '这是地方特色'], ['Beef hotpot / beef balls', '牛肉火锅 / 牛肉丸'], ['It melts in your mouth', '入口即化']] },
  },
  {
    id: 'L6B', lesson: 6, part: 'B', title: '我会说汉语', titleEn: 'I can speak Chinese',
    focus: 'How? 怎么 · first characters',
    words: [['做', 'zuò', 'to do, make'], ['写', 'xiě', 'to write'], ['汉字', 'Hànzì', 'Chinese character'], ['字', 'zì', 'character, word'], ['怎么', 'zěnme', 'how'], ['读', 'dú', 'to read (aloud)']],
    sentences: [['你会写汉字吗？', 'Nǐ huì xiě Hànzì ma?', 'Can you write Chinese characters?'], ['"好"字怎么写？', '"Hǎo" zì zěnme xiě?', 'How do you write "hǎo"?'], ['我妈妈会做中国菜。', 'Wǒ māma huì zuò Zhōngguó cài.', 'My mum can cook Chinese food.']],
    grammar: [
      ['怎么 + verb = how to', '怎么读？How do you say it? 怎么写？How do you write it? …用汉语怎么说？How do you say … in Chinese?', '教他问"…用汉语怎么说？"，以后上课他可以自己问。'],
      ['Stroke order', 'Left → right, top → bottom. Start with 人 口 大 中 好.', '从简单字开始：人口大中好。讲"好"= 女+子 的故事。'],
    ],
    dialogue: [['A', '你会写汉字吗？', 'Nǐ huì xiě Hànzì ma?', 'Can you write characters?'], ['B', '我会写"人"。', 'Wǒ huì xiě "rén".', 'I can write "person".'], ['A', '这个字怎么读？', 'Zhège zì zěnme dú?', 'How do you read this one?'], ['B', '读"好"。', 'Dú "hǎo".', 'It\'s "hǎo".']],
    hw: { learner: 'Write 人 口 大 中 好 你 我 by hand, 3 times each. Send a photo.', me: 'Write 5 tips for learning a language as an adult, in English.' },
    en: { topic: 'Learning languages', qs: ['What is the hardest part of English for you?', 'How many languages do Dutch people usually speak?', 'Mandarin or your dialect — which one do you dream in?'], phrases: [['I\'m getting the hang of it', '我渐渐上手了'], ['It\'s on the tip of my tongue', '话到嘴边说不出来'], ['I\'m a bit rusty', '我有点生疏了']] },
  },
  // ───────── Lesson 7 今天几号 ─────────
  {
    id: 'L7A', lesson: 7, part: 'A', title: '今天几号', titleEn: 'What\'s the date today?',
    focus: 'Dates · days of the week',
    words: [['请', 'qǐng', 'please'], ['问', 'wèn', 'to ask'], ['今天', 'jīntiān', 'today'], ['号', 'hào', 'day of the month'], ['月', 'yuè', 'month'], ['星期', 'xīngqī', 'week']],
    sentences: [['请问，今天几号？', 'Qǐngwèn, jīntiān jǐ hào?', 'Excuse me, what\'s the date today?'], ['今天十一月九号。', 'Jīntiān shíyī yuè jiǔ hào.', 'Today is 9 November.'], ['今天星期几？', 'Jīntiān xīngqī jǐ?', 'What day is it today?']],
    grammar: [
      ['Big → small', '2026年11月9号星期一: year → month → day → weekday. The opposite of Dutch!', '日期从大到小，和荷兰语"maandag 9 november 2026"正好相反。'],
      ['星期 + number', '星期一 Monday … 星期六 Saturday, 星期天/星期日 Sunday.', '星期一到六用数字，星期天特殊。'],
    ],
    dialogue: [['A', '请问，今天几号？', 'Qǐngwèn, jīntiān jǐ hào?', 'Excuse me, what\'s the date?'], ['B', '今天十一月十号。', 'Jīntiān shíyī yuè shí hào.', 'It\'s 10 November.'], ['A', '今天星期几？', 'Jīntiān xīngqī jǐ?', 'What day is it?'], ['B', '星期二。', 'Xīngqī\'èr.', 'Tuesday.']],
    hw: { learner: 'Voice message: today\'s date and weekday + your birthday (我的生日是…月…号).', me: 'Write a message proposing 3 possible times for our next call, mentioning both time zones.' },
    en: { topic: 'Scheduling across time zones', qs: ['What time of day is best for you to talk, and why?', 'How do you plan your week?', 'Are you always on time? Is being late OK in your culture?'], phrases: [['Does Tuesday work for you?', '周二你方便吗？'], ['Let\'s pencil it in', '先暂定这个时间'], ['I\'m 7 hours ahead of you', '我比你早7个小时']] },
  },
  {
    id: 'L7B', lesson: 7, part: 'B', title: '今天几号', titleEn: 'What\'s the date today?',
    focus: 'Yesterday / tomorrow · 去 + place + do',
    words: [['昨天', 'zuótiān', 'yesterday'], ['明天', 'míngtiān', 'tomorrow'], ['去', 'qù', 'to go'], ['学校', 'xuéxiào', 'school'], ['看', 'kàn', 'to look, read, watch'], ['书', 'shū', 'book']],
    sentences: [['明天你去学校吗？', 'Míngtiān nǐ qù xuéxiào ma?', 'Are you going to school tomorrow?'], ['我去学校看书。', 'Wǒ qù xuéxiào kàn shū.', 'I go to school to read.'], ['昨天是星期天。', 'Zuótiān shì xīngqītiān.', 'Yesterday was Sunday.']],
    grammar: [
      ['去 + place + verb', '我去学校看书 = I go to school to read.', '连动句：去+地点+做什么。'],
      ['Time before the verb', '我明天去学校 ✓ — not 我去学校明天 ✗.', '时间词不能放句末，荷兰人很容易犯这个错。'],
    ],
    dialogue: [['A', '明天你去哪儿？', 'Míngtiān nǐ qù nǎr?', 'Where are you going tomorrow?'], ['B', '我去学校看书。你呢？', 'Wǒ qù xuéxiào kàn shū. Nǐ ne?', 'To school to read. And you?'], ['A', '我明天不去学校。', 'Wǒ míngtiān bú qù xuéxiào.', 'I\'m not going to school tomorrow.']],
    hw: { learner: 'Write 3 sentences: 昨天… / 今天… / 明天我去…', me: 'Voice message: what did you do yesterday and what will you do tomorrow? (past + future)' },
    en: { topic: 'Your week', qs: ['Describe a typical weekday.', 'What is the best day of the week and why?', 'What are you doing this weekend?'], phrases: [['I\'m swamped this week', '我这周忙死了'], ['I\'ve got a lot on', '事情很多'], ['I\'m free on Friday evening', '周五晚上我有空']] },
  },
  // ───────── Lesson 8 我想喝茶 ─────────
  {
    id: 'L8A', lesson: 8, part: 'A', title: '我想喝茶', titleEn: 'I\'d like some tea',
    focus: 'Would like to 想 · food and drink',
    words: [['想', 'xiǎng', 'would like to, want'], ['喝', 'hē', 'to drink'], ['茶', 'chá', 'tea'], ['吃', 'chī', 'to eat'], ['米饭', 'mǐfàn', 'cooked rice'], ['下午', 'xiàwǔ', 'afternoon']],
    sentences: [['你想喝什么？', 'Nǐ xiǎng hē shénme?', 'What would you like to drink?'], ['我想喝茶。', 'Wǒ xiǎng hē chá.', 'I\'d like some tea.'], ['下午你想吃什么？', 'Xiàwǔ nǐ xiǎng chī shénme?', 'What do you want to eat this afternoon?']],
    grammar: [
      ['想 + verb', '想 = would like to: 我想喝茶。不想 = don\'t want to.', '想+动词 表示愿望。'],
      ['Question word order again', '你想喝什么？→ 我想喝茶。', '复习：疑问词在答案的位置。'],
    ],
    dialogue: [['A', '你想喝什么？', 'Nǐ xiǎng hē shénme?', 'What would you like to drink?'], ['B', '我想喝茶。', 'Wǒ xiǎng hē chá.', 'Tea, please.'], ['A', '你想吃米饭吗？', 'Nǐ xiǎng chī mǐfàn ma?', 'Would you like some rice?'], ['B', '我不想吃。', 'Wǒ bù xiǎng chī.', 'No, thanks.']],
    hw: { learner: 'Voice message: what you want to eat and drink today (我想吃… 我想喝…).', me: 'Explain gongfu tea (工夫茶) or another tea custom in 6 English sentences.' },
    en: { topic: 'Tea and coffee culture', qs: ['How do you make gongfu tea? Walk me through it.', 'Coffee or tea — and how many cups a day?', 'Is there a special word for drinking tea in your dialect?'], phrases: [['It\'s an acquired taste', '需要慢慢习惯的味道'], ['Strong / bitter / smooth', '浓 / 苦 / 顺滑'], ['Shall I pour you another cup?', '再给你倒一杯？']] },
  },
  {
    id: 'L8B', lesson: 8, part: 'B', title: '我想喝茶', titleEn: 'I\'d like some tea',
    focus: 'Shopping · prices · measure words 个',
    words: [['商店', 'shāngdiàn', 'shop'], ['买', 'mǎi', 'to buy'], ['个', 'gè', '(general measure word)'], ['杯子', 'bēizi', 'cup'], ['这', 'zhè', 'this'], ['那', 'nà', 'that'], ['多少', 'duōshao', 'how many / how much'], ['钱', 'qián', 'money'], ['块', 'kuài', 'yuan (spoken)']],
    sentences: [['这个杯子多少钱？', 'Zhège bēizi duōshao qián?', 'How much is this cup?'], ['二十八块。', 'Èrshíbā kuài.', '28 yuan.'], ['我想买那个。', 'Wǒ xiǎng mǎi nàge.', 'I\'d like to buy that one.']],
    grammar: [
      ['Measure words', 'Number / 这 / 那 + measure + noun: 一个杯子, 这个, 那个. 个 is the all-purpose one.', '数词、这、那后面要加量词。先只教"个"。'],
      ['多少 vs 几', '多少 for any number (prices!), 几 for small numbers.', '问价钱一定用"多少钱"。'],
    ],
    dialogue: [['A', '你好！这个杯子多少钱？', 'Nǐ hǎo! Zhège bēizi duōshao qián?', 'Hi! How much is this cup?'], ['B', '三十块。', 'Sānshí kuài.', '30 yuan.'], ['A', '那个呢？', 'Nàge ne?', 'And that one?'], ['B', '那个十八块。', 'Nàge shíbā kuài.', 'That one is 18.'], ['A', '我买那个。', 'Wǒ mǎi nàge.', 'I\'ll take that one.']],
    hw: { learner: 'Role-play on Discord in text: you are in a shop, ask the price of 3 things.', me: 'Write about the best (or worst) thing you ever bought online.' },
    en: { topic: 'Shopping and bargaining', qs: ['Do you bargain in shops? Where is it normal?', 'Online shopping or real shops?', 'What is something you would never buy cheap?'], phrases: [['Is this on sale?', '这个打折吗？'], ['That\'s a bit steep', '有点贵'], ['Can you do a better price?', '能便宜点吗？']] },
  },
  // ───────── Lesson 9 你儿子在哪儿工作 ─────────
  {
    id: 'L9A', lesson: 9, part: 'A', title: '你儿子在哪儿工作', titleEn: 'Where does your son work?',
    focus: 'Where is it? 在 · positions',
    words: [['小', 'xiǎo', 'small'], ['猫', 'māo', 'cat'], ['狗', 'gǒu', 'dog'], ['在', 'zài', 'to be at / in'], ['那儿', 'nàr', 'there'], ['哪儿', 'nǎr', 'where'], ['椅子', 'yǐzi', 'chair'], ['下面', 'xiàmian', 'under, below']],
    sentences: [['小猫在哪儿？', 'Xiǎo māo zài nǎr?', 'Where is the kitten?'], ['小猫在椅子下面。', 'Xiǎo māo zài yǐzi xiàmian.', 'The kitten is under the chair.'], ['小狗在那儿。', 'Xiǎo gǒu zài nàr.', 'The puppy is over there.']],
    grammar: [
      ['Thing + 在 + place', '猫在椅子下面 = The cat is under the chair.', '"在"表示位置：东西+在+地方。'],
      ['哪儿 vs 那儿', 'Only the tone differs: nǎr (where?) vs nàr (there).', '只差声调，练对比。'],
    ],
    dialogue: [['A', '我的猫在哪儿？', 'Wǒ de māo zài nǎr?', 'Where is my cat?'], ['B', '在椅子下面。', 'Zài yǐzi xiàmian.', 'Under the chair.'], ['A', '小狗呢？', 'Xiǎo gǒu ne?', 'And the puppy?'], ['B', '小狗在那儿。', 'Xiǎo gǒu zài nàr.', 'Over there.']],
    hw: { learner: 'Send a photo of your room with 2 sentences: …在…下面 / …在那儿.', me: 'Write a funny short story about a cat (8 sentences, past tense).' },
    en: { topic: 'Pets', qs: ['Cats or dogs? Defend your answer.', 'Tell me about a pet you have or had.', 'Are pets treated differently in China and the Netherlands?'], phrases: [['She\'s a rescue', '她是领养的'], ['He\'s very clingy', '他很黏人'], ['Calico / tabby', '三花 / 虎斑']] },
  },
  {
    id: 'L9B', lesson: 9, part: 'B', title: '你儿子在哪儿工作', titleEn: 'Where does your son work?',
    focus: 'Work and places · 在 + place + verb',
    words: [['工作', 'gōngzuò', 'to work; job'], ['儿子', 'érzi', 'son'], ['医院', 'yīyuàn', 'hospital'], ['医生', 'yīshēng', 'doctor'], ['爸爸', 'bàba', 'dad']],
    sentences: [['你儿子在哪儿工作？', 'Nǐ érzi zài nǎr gōngzuò?', 'Where does your son work?'], ['他在医院工作。', 'Tā zài yīyuàn gōngzuò.', 'He works at a hospital.'], ['我爸爸是医生。', 'Wǒ bàba shì yīshēng.', 'My dad is a doctor.']],
    grammar: [
      ['在 + place + verb', '他在医院工作 ✓ — not 他工作在医院 ✗.', '介词"在"+地点 放在动词前，不能放句末。'],
    ],
    dialogue: [['A', '你爸爸在哪儿工作？', 'Nǐ bàba zài nǎr gōngzuò?', 'Where does your dad work?'], ['B', '他在医院工作，他是医生。', 'Tā zài yīyuàn gōngzuò, tā shì yīshēng.', 'At a hospital. He\'s a doctor.'], ['A', '你儿子呢？', 'Nǐ érzi ne?', 'And your son?'], ['B', '他是学生。', 'Tā shì xuésheng.', 'He\'s a student.']],
    hw: { learner: 'Voice message: where 3 people you know work (…在…工作).', me: 'Describe your job (or dream job) in English: tasks, colleagues, what you like.' },
    en: { topic: 'Jobs and work life', qs: ['What do you do for a living? What does a normal day look like?', 'Dutch people often work 4 days a week. Would that work in China?', 'What was your first job?'], phrases: [['What do you do for a living?', '你是做什么工作的？'], ['I work remotely', '我远程办公'], ['Work-life balance', '工作与生活的平衡']] },
  },
  // ───────── Lesson 10 我能坐这儿吗 ─────────
  {
    id: 'L10A', lesson: 10, part: 'A', title: '我能坐这儿吗', titleEn: 'Can I sit here?',
    focus: 'There is … 有 · and 和',
    words: [['桌子', 'zhuōzi', 'table, desk'], ['上', 'shàng', 'on, above'], ['里', 'lǐ', 'in, inside'], ['电脑', 'diànnǎo', 'computer'], ['和', 'hé', 'and'], ['本', 'běn', '(measure word for books)']],
    sentences: [['桌子上有什么？', 'Zhuōzi shang yǒu shénme?', 'What\'s on the table?'], ['桌子上有一个电脑和一本书。', 'Zhuōzi shang yǒu yí ge diànnǎo hé yì běn shū.', 'There is a computer and a book on the table.'], ['杯子里有茶。', 'Bēizi li yǒu chá.', 'There is tea in the cup.']],
    grammar: [
      ['Place + 有 + thing', '桌子上有一本书 = There is a book on the table.', '存在句：地方+有+东西。对比上一课：东西+在+地方。'],
      ['和 joins nouns only', '我和你 ✓. Never use 和 to join two sentences.', '"和"只连接名词，不连接句子——英语/荷兰语思维常错。'],
    ],
    dialogue: [['A', '桌子上有什么？', 'Zhuōzi shang yǒu shénme?', 'What\'s on the desk?'], ['B', '有一个电脑和一本书。', 'Yǒu yí ge diànnǎo hé yì běn shū.', 'A computer and a book.'], ['A', '杯子里有什么？', 'Bēizi li yǒu shénme?', 'What\'s in the cup?'], ['B', '有茶。', 'Yǒu chá.', 'Tea.']],
    hw: { learner: 'Photo of your desk + 3 sentences: 桌子上有…', me: 'Describe your home or room so that I could draw it (8 sentences).' },
    en: { topic: 'Home', qs: ['Describe your home.', 'What does "gezellig" mean? Is there a Chinese word for it?', 'What is one thing you would change about your home?'], phrases: [['My desk is a mess', '我的桌子很乱'], ['It\'s cosy', '很温馨'], ['I share a flat with ...', '我和…合租']] },
  },
  {
    id: 'L10B', lesson: 10, part: 'B', title: '我能坐这儿吗', titleEn: 'Can I sit here?',
    focus: 'May I …? 能 · there isn\'t 没有 · front/back',
    words: [['前面', 'qiánmian', 'front'], ['后面', 'hòumian', 'back, behind'], ['这儿', 'zhèr', 'here'], ['没有', 'méiyǒu', 'not have; there is not'], ['能', 'néng', 'can, may'], ['坐', 'zuò', 'to sit; to take (transport)']],
    sentences: [['我能坐这儿吗？', 'Wǒ néng zuò zhèr ma?', 'May I sit here?'], ['这儿没有人，请坐。', 'Zhèr méiyǒu rén, qǐng zuò.', 'Nobody is sitting here, please sit.'], ['学校前面有一个商店。', 'Xuéxiào qiánmian yǒu yí ge shāngdiàn.', 'There\'s a shop in front of the school.']],
    grammar: [
      ['能 = can / may', '我能坐这儿吗？May I sit here? (permission / possibility)', '"能"表示可以/许可；和"会"（技能）对比。'],
      ['没有, never 不有', '有 → 没有.', '"有"的否定只能用"没"。'],
      ['请 + verb', 'Polite request: 请坐 please sit, 请喝茶 please have some tea.', '"请+动词"表示客气的请求。'],
    ],
    dialogue: [['A', '你好，我能坐这儿吗？', 'Nǐ hǎo, wǒ néng zuò zhèr ma?', 'Hi, may I sit here?'], ['B', '这儿没有人，请坐。', 'Zhèr méiyǒu rén, qǐng zuò.', 'It\'s free, please sit.'], ['A', '谢谢！', 'Xièxie!', 'Thanks!']],
    hw: { learner: 'Voice message: describe what is in front of / behind your house (前面有… 后面有…).', me: 'Write 5 polite requests in English for 5 different situations.' },
    en: { topic: 'Asking permission politely', qs: ['How do you ask a stranger for something in English without sounding rude?', 'Is "Can I …" or "Could I …" more polite?', 'Tell me about a time someone was very polite (or rude) to you.'], phrases: [['Do you mind if I ...?', '你介意我…吗？'], ['Is this seat taken?', '这里有人吗？'], ['Would it be OK if ...?', '…可以吗？']] },
  },
  // ───────── Lesson 11 现在几点 ─────────
  {
    id: 'L11A', lesson: 11, part: 'A', title: '现在几点', titleEn: 'What time is it now?',
    focus: 'Telling the time · when? 什么时候',
    words: [['现在', 'xiànzài', 'now'], ['点', 'diǎn', 'o\'clock'], ['分', 'fēn', 'minute (clock)'], ['中午', 'zhōngwǔ', 'noon'], ['吃饭', 'chīfàn', 'to have a meal'], ['时候', 'shíhou', 'time, moment']],
    sentences: [['现在几点？', 'Xiànzài jǐ diǎn?', 'What time is it?'], ['现在十点十分。', 'Xiànzài shí diǎn shí fēn.', 'It\'s 10:10.'], ['你什么时候吃饭？', 'Nǐ shénme shíhou chīfàn?', 'When do you eat?']],
    grammar: [
      ['Telling the time', '十点十分 = 10:10. 2:00 is 两点 (liǎng), not 二点.', '几点几分；两点用"两"。'],
      ['什么时候 = when', '你什么时候去学校？', '问时间点：什么时候。'],
    ],
    dialogue: [['A', '现在几点？', 'Xiànzài jǐ diǎn?', 'What time is it?'], ['B', '现在十一点五十分。', 'Xiànzài shíyī diǎn wǔshí fēn.', 'It\'s 11:50.'], ['A', '我们什么时候吃饭？', 'Wǒmen shénme shíhou chīfàn?', 'When do we eat?'], ['B', '中午十二点。', 'Zhōngwǔ shí\'èr diǎn.', 'At noon.']],
    hw: { learner: 'Voice message: what time it is now for you AND for your teacher in China.', me: 'Describe your daily routine hour by hour (in English, 8 sentences).' },
    en: { topic: 'Daily routine', qs: ['Are you a morning person or a night owl?', 'What time do people eat dinner in the Netherlands vs. China?', 'What is the best part of your day?'], phrases: [['I\'m a night owl', '我是夜猫子'], ['I usually grab lunch around noon', '我一般中午随便吃点'], ['I sleep in on Sundays', '我周日睡懒觉']] },
  },
  {
    id: 'L11B', lesson: 11, part: 'B', title: '现在几点', titleEn: 'What time is it now?',
    focus: 'Going back · living somewhere · time words before verbs',
    words: [['回', 'huí', 'to return'], ['我们', 'wǒmen', 'we, us'], ['电影', 'diànyǐng', 'film, movie'], ['住', 'zhù', 'to live (somewhere)'], ['前', 'qián', 'before'], ['北京', 'Běijīng', 'Beijing']],
    sentences: [['你住在哪儿？', 'Nǐ zhù zài nǎr?', 'Where do you live?'], ['我住在北京。', 'Wǒ zhù zài Běijīng.', 'I live in Beijing.'], ['我们三点前回家。', 'Wǒmen sān diǎn qián huí jiā.', 'We go home before three.']],
    grammar: [
      ['Time before the verb', '我们七点看电影 ✓ — not 我们看电影七点 ✗.', '时间状语在动词前。'],
      ['住在 + place', '我住在北京。你住在哪儿？', '"住在"问住址或城市。'],
    ],
    dialogue: [['A', '我们明天去看电影，好吗？', 'Wǒmen míngtiān qù kàn diànyǐng, hǎo ma?', 'Shall we go to a movie tomorrow?'], ['B', '好！几点？', 'Hǎo! Jǐ diǎn?', 'OK! What time?'], ['A', '下午三点。', 'Xiàwǔ sān diǎn.', '3 pm.'], ['B', '我六点前回家。', 'Wǒ liù diǎn qián huí jiā.', 'I\'ll be home before six.']],
    hw: { learner: 'Write: where you live + 3 things you do with times (我七点…).', me: 'Review a film or series you watched recently (8 sentences, no spoilers).' },
    en: { topic: 'Films and series', qs: ['What did you watch recently? Would you recommend it?', 'Subtitles or dubbing? (The Netherlands uses subtitles!)', 'Which Chinese film should a Dutch person watch first?'], phrases: [['It\'s worth watching', '值得一看'], ['No spoilers!', '别剧透！'], ['I binge-watched it', '我一口气刷完了']] },
  },
  // ───────── Lesson 12 明天天气怎么样 ─────────
  {
    id: 'L12A', lesson: 12, part: 'A', title: '明天天气怎么样', titleEn: 'What will the weather be like tomorrow?',
    focus: 'Weather · how is it? 怎么样 · 太…了',
    words: [['天气', 'tiānqì', 'weather'], ['怎么样', 'zěnmeyàng', 'how is it'], ['太', 'tài', 'too, so'], ['热', 'rè', 'hot'], ['冷', 'lěng', 'cold'], ['下雨', 'xià yǔ', 'to rain']],
    sentences: [['明天天气怎么样？', 'Míngtiān tiānqì zěnmeyàng?', 'What\'s the weather like tomorrow?'], ['太热了！', 'Tài rè le!', 'It\'s so hot!'], ['今天下雨。', 'Jīntiān xià yǔ.', 'It\'s raining today.']],
    grammar: [
      ['…怎么样？', 'How is …? 天气怎么样？ Also for suggestions: 明天去，怎么样？', '问状况或征求意见：…怎么样？'],
      ['太 + adj + 了', '太冷了！ = It\'s so cold! / too cold!', '太+形容词+了，表示感叹。'],
    ],
    dialogue: [['A', '北京今天天气怎么样？', 'Běijīng jīntiān tiānqì zěnmeyàng?', 'How\'s the weather in Beijing today?'], ['B', '太冷了！你那儿呢？', 'Tài lěng le! Nǐ nàr ne?', 'So cold! What about where you are?'], ['A', '下雨。', 'Xià yǔ.', 'Raining.']],
    hw: { learner: 'Every day this week: send one sentence about today\'s weather in Chinese.', me: 'Compare the weather in your hometown and the Netherlands (6 sentences, use comparatives).' },
    en: { topic: 'Weather small talk', qs: ['Dutch rain vs. southern Chinese heat — which is worse?', 'Why do British and Dutch people talk about the weather so much?', 'What do you do on a rainy day?'], phrases: [['It\'s pouring', '下大雨'], ['It\'s muggy', '闷热'], ['Typhoon season', '台风季']] },
  },
  {
    id: 'L12B', lesson: 12, part: 'B', title: '明天天气怎么样', titleEn: 'What will the weather be like tomorrow?',
    focus: 'Health · will 会 · love to 爱',
    words: [['小姐', 'xiǎojiě', 'Miss'], ['来', 'lái', 'to come'], ['身体', 'shēntǐ', 'body, health'], ['爱', 'ài', 'to love'], ['些', 'xiē', 'some'], ['水果', 'shuǐguǒ', 'fruit'], ['水', 'shuǐ', 'water']],
    sentences: [['明天会下雨吗？', 'Míngtiān huì xià yǔ ma?', 'Will it rain tomorrow?'], ['你身体怎么样？', 'Nǐ shēntǐ zěnmeyàng?', 'How is your health?'], ['我爱吃水果。', 'Wǒ ài chī shuǐguǒ.', 'I love eating fruit.']],
    grammar: [
      ['会 = will (probably)', '明天会下雨。会 also predicts the future.', '"会"的第二个用法：可能、将要。'],
      ['爱 + verb', '我爱吃水果 = I love eating fruit.', '爱/喜欢+动词。'],
    ],
    dialogue: [['A', '王小姐，你身体怎么样？', 'Wáng xiǎojiě, nǐ shēntǐ zěnmeyàng?', 'Miss Wang, how are you feeling?'], ['B', '很好，谢谢！你来喝些水吧。', 'Hěn hǎo, xièxie! Nǐ lái hē xiē shuǐ ba.', 'Very well, thanks! Come and have some water.'], ['A', '明天会下雨吗？', 'Míngtiān huì xià yǔ ma?', 'Will it rain tomorrow?'], ['B', '会。', 'Huì.', 'Yes, it will.']],
    hw: { learner: 'Voice message: 3 things you love (我爱…) + tomorrow\'s weather (明天会…).', me: 'Write about one healthy habit and one bad habit you have.' },
    en: { topic: 'Health and habits', qs: ['How do you stay healthy?', 'Chinese medicine vs. Western medicine — what do you think?', 'Is it normal to drink hot water in the Netherlands? 😄'], phrases: [['I\'m under the weather', '我有点不舒服'], ['I\'m trying to cut down on sugar', '我在少吃糖'], ['Stay hydrated', '多喝水']] },
  },
  // ───────── Lesson 13 他在学做中国菜呢 ─────────
  {
    id: 'L13A', lesson: 13, part: 'A', title: '他在学做中国菜呢', titleEn: 'He\'s learning to cook Chinese food',
    focus: 'Doing right now: 在…呢 · also 也 · phone calls',
    words: [['喂', 'wéi', 'hello (on the phone)'], ['也', 'yě', 'also, too'], ['学习', 'xuéxí', 'to study'], ['上午', 'shàngwǔ', 'morning'], ['睡觉', 'shuìjiào', 'to sleep']],
    sentences: [['喂，你在做什么呢？', 'Wéi, nǐ zài zuò shénme ne?', 'Hello, what are you doing?'], ['我在学习汉语呢。', 'Wǒ zài xuéxí Hànyǔ ne.', 'I\'m studying Chinese.'], ['我也在学习。', 'Wǒ yě zài xuéxí.', 'I\'m studying too.']],
    grammar: [
      ['在 + verb + 呢', '我在学习呢 = I am studying (right now).', '进行时：在…呢。'],
      ['也 before the verb', '我也是学生 ✓ — not 也我是学生 ✗.', '"也"只能放在动词前，不能放主语前。'],
      ['Phone numbers', 'Read digit by digit; 1 is often said yāo: 138 = yāo sān bā.', '电话号码逐个读，1 读 yāo。'],
    ],
    dialogue: [['A', '喂，你在做什么呢？', 'Wéi, nǐ zài zuò shénme ne?', 'Hello, what are you doing?'], ['B', '我在学习呢。你呢？', 'Wǒ zài xuéxí ne. Nǐ ne?', 'I\'m studying. You?'], ['A', '我在睡觉呢！', 'Wǒ zài shuìjiào ne!', 'I\'m sleeping!'], ['B', '对不起！', 'Duìbuqǐ!', 'Sorry!']],
    hw: { learner: 'Send 3 voice messages at different times this week: 我在…呢。', me: 'Write a dialogue for a video call where the connection is bad (use the phrases).' },
    en: { topic: 'Phone and video calls', qs: ['Do you prefer calls, voice messages or texting?', 'What is the most annoying thing on video calls?', 'How do you answer the phone in Chinese, Dutch, English?'], phrases: [['You\'re breaking up', '你那边断断续续的'], ['Can you hear me OK?', '听得清吗？'], ['You\'re on mute', '你静音了']] },
  },
  {
    id: 'L13B', lesson: 13, part: 'B', title: '他在学做中国菜呢', titleEn: 'He\'s learning to cook Chinese food',
    focus: 'Likes 喜欢 · call someone 给…打电话 · suggestions 吧',
    words: [['电视', 'diànshì', 'TV'], ['喜欢', 'xǐhuan', 'to like'], ['给', 'gěi', 'to give; for, to'], ['打电话', 'dǎ diànhuà', 'to make a phone call'], ['吧', 'ba', '(suggestion: let\'s …)']],
    sentences: [['你喜欢看电视吗？', 'Nǐ xǐhuan kàn diànshì ma?', 'Do you like watching TV?'], ['我明天给你打电话。', 'Wǒ míngtiān gěi nǐ dǎ diànhuà.', 'I\'ll call you tomorrow.'], ['我们去吃饭吧！', 'Wǒmen qù chīfàn ba!', 'Let\'s go eat!']],
    grammar: [
      ['给 + person + verb', '我给你打电话 = I call you. The person comes before the verb.', '"给某人打电话"，语序和英语相反。'],
      ['吧 = let\'s', '我们去吃饭吧！Softens a suggestion.', '句末"吧"表示建议。'],
    ],
    dialogue: [['A', '你喜欢看电视吗？', 'Nǐ xǐhuan kàn diànshì ma?', 'Do you like TV?'], ['B', '不喜欢，我喜欢看电影。', 'Bù xǐhuan, wǒ xǐhuan kàn diànyǐng.', 'No, I like films.'], ['A', '我们明天去看电影吧！', 'Wǒmen míngtiān qù kàn diànyǐng ba!', 'Let\'s go to a film tomorrow!'], ['B', '好，明天我给你打电话。', 'Hǎo, míngtiān wǒ gěi nǐ dǎ diànhuà.', 'OK, I\'ll call you tomorrow.']],
    hw: { learner: 'Write 3 things you like and 1 suggestion with 吧.', me: 'Write about a hobby you have had for a long time.' },
    en: { topic: 'Hobbies', qs: ['What do you do to relax?', 'Is there a hobby you gave up? Why?', 'What hobby would you like to try?'], phrases: [['I\'m really into ...', '我很迷…'], ['I took it up last year', '我去年开始玩的'], ['It helps me unwind', '这能让我放松']] },
  },
  // ───────── Lesson 14 她买了不少衣服 ─────────
  {
    id: 'L14A', lesson: 14, part: 'A', title: '她买了不少衣服', titleEn: 'She bought quite a few clothes',
    focus: 'Something happened: 了 · a little 一点儿',
    words: [['东西', 'dōngxi', 'thing, stuff'], ['一点儿', 'yìdiǎnr', 'a little'], ['苹果', 'píngguǒ', 'apple'], ['看见', 'kànjiàn', 'to see'], ['先生', 'xiānsheng', 'Mr., sir'], ['开', 'kāi', 'to drive; to open'], ['车', 'chē', 'car, vehicle']],
    sentences: [['你买什么东西了？', 'Nǐ mǎi shénme dōngxi le?', 'What did you buy?'], ['我买了一点儿苹果。', 'Wǒ mǎi le yìdiǎnr píngguǒ.', 'I bought some apples.'], ['你看见王先生了吗？', 'Nǐ kànjiàn Wáng xiānsheng le ma?', 'Did you see Mr. Wang?']],
    grammar: [
      ['了 = it happened', '我买了苹果。Negative: 我没买苹果 (no 了!).', '动态助词"了"表示完成；否定用"没"+动词，不加"了"。'],
      ['一点儿', '买一点儿 = buy a little; 一点儿水 = a little water.', '"一点儿"放在名词前或动词后。'],
    ],
    dialogue: [['A', '你看见王先生了吗？', 'Nǐ kànjiàn Wáng xiānsheng le ma?', 'Have you seen Mr. Wang?'], ['B', '看见了，他开车去商店了。', 'Kànjiàn le, tā kāi chē qù shāngdiàn le.', 'Yes, he drove to the shop.'], ['A', '他买什么了？', 'Tā mǎi shénme le?', 'What did he buy?'], ['B', '买了一点儿苹果。', 'Mǎi le yìdiǎnr píngguǒ.', 'Some apples.']],
    hw: { learner: 'Voice message: 3 things you did yesterday with 了 (我买了… 我看了…).', me: 'Write about how people get around in your city (cars, e-bikes, buses).' },
    en: { topic: 'Getting around', qs: ['Bikes in the Netherlands vs. e-bikes in China — which is crazier?', 'Do you drive? Do you enjoy it?', 'Describe your commute.'], phrases: [['I got stuck in traffic', '我堵车了'], ['It\'s within walking distance', '走路就能到'], ['I cycle everywhere', '我去哪儿都骑车']] },
  },
  {
    id: 'L14B', lesson: 14, part: 'B', title: '她买了不少衣服', titleEn: 'She bought quite a few clothes',
    focus: 'All 都 · in … minutes 后 · exclamations',
    words: [['回来', 'huílai', 'to come back'], ['分钟', 'fēnzhōng', 'minute (duration)'], ['后', 'hòu', 'after, later'], ['衣服', 'yīfu', 'clothes'], ['漂亮', 'piàoliang', 'pretty'], ['啊', 'a', '(exclamation)'], ['少', 'shǎo', 'few, little'], ['不少', 'bù shǎo', 'quite a lot'], ['这些', 'zhèxiē', 'these'], ['都', 'dōu', 'all, both']],
    sentences: [['她买了不少衣服。', 'Tā mǎi le bù shǎo yīfu.', 'She bought quite a few clothes.'], ['这些衣服都很漂亮啊！', 'Zhèxiē yīfu dōu hěn piàoliang a!', 'These clothes are all so pretty!'], ['我十分钟后回来。', 'Wǒ shí fēnzhōng hòu huílai.', 'I\'ll be back in ten minutes.']],
    grammar: [
      ['都 = all / both', '这些都很漂亮。都 goes before the verb or adjective.', '"都"总括前面的人或物，放在动词/形容词前。'],
      ['Time + 后', '十分钟后 = in 10 minutes; 吃饭后 = after eating.', '时间段+后。'],
    ],
    dialogue: [['A', '你买了什么？', 'Nǐ mǎi le shénme?', 'What did you buy?'], ['B', '我买了不少衣服。', 'Wǒ mǎi le bù shǎo yīfu.', 'Quite a lot of clothes.'], ['A', '这些衣服都很漂亮啊！', 'Zhèxiē yīfu dōu hěn piàoliang a!', 'They\'re all so pretty!'], ['B', '谢谢！我十分钟后回来。', 'Xièxie! Wǒ shí fēnzhōng hòu huílai.', 'Thanks! Back in ten minutes.']],
    hw: { learner: 'Photo of 2 pieces of clothing + sentences with 都 and 漂亮.', me: 'Describe your style and your favourite piece of clothing.' },
    en: { topic: 'Clothes and style', qs: ['How would you describe your style?', 'Do people dress differently in China and the Netherlands?', 'What did you wear as a teenager? 😄'], phrases: [['It suits you', '很适合你'], ['It\'s a bit too flashy', '有点太花哨'], ['Casual / smart casual', '休闲 / 商务休闲']] },
  },
  // ───────── Lesson 15 我是坐飞机来的 ─────────
  {
    id: 'L15A', lesson: 15, part: 'A', title: '我是坐飞机来的', titleEn: 'I came by plane',
    focus: 'Details of the past: 是…的 · years',
    words: [['认识', 'rènshi', 'to know (someone)'], ['年', 'nián', 'year'], ['大学', 'dàxué', 'university'], ['饭店', 'fàndiàn', 'restaurant, hotel'], ['出租车', 'chūzūchē', 'taxi'], ['一起', 'yìqǐ', 'together']],
    sentences: [['你们是什么时候认识的？', 'Nǐmen shì shénme shíhou rènshi de?', 'When did you two meet?'], ['我们是二〇二〇年认识的。', 'Wǒmen shì èr líng èr líng nián rènshi de.', 'We met in 2020.'], ['我们是在大学认识的。', 'Wǒmen shì zài dàxué rènshi de.', 'We met at university.']],
    grammar: [
      ['是…的', 'For details (when / where / how) of something that already happened: 我是2024年来的。', '"是…的"强调已发生事情的时间、地点、方式。'],
      ['Years digit by digit', '2026年 = èr líng èr liù nián.', '年份一个数字一个数字读。'],
    ],
    dialogue: [['A', '你们是什么时候认识的？', 'Nǐmen shì shénme shíhou rènshi de?', 'When did you meet?'], ['B', '我们是去年认识的。', 'Wǒmen shì qùnián rènshi de.', 'Last year.'], ['A', '是在哪儿认识的？', 'Shì zài nǎr rènshi de?', 'Where?'], ['B', '是在饭店认识的，我们一起工作。', 'Shì zài fàndiàn rènshi de, wǒmen yìqǐ gōngzuò.', 'At a restaurant — we work together.']],
    hw: { learner: 'Write 3 sentences with 是…的 about how you met your teacher (when / where / how).', me: 'Write the story of how we met, in English (past tenses, 10 sentences).' },
    en: { topic: 'How we met — storytelling', qs: ['Tell the story of how you met your best friend.', 'Which past tense feels hardest in English?', 'What is a story your family always tells?'], phrases: [['We hit it off right away', '我们一见如故'], ['Back then, ...', '那时候…'], ['Long story short, ...', '长话短说…']] },
  },
  {
    id: 'L15B', lesson: 15, part: 'B', title: '我是坐飞机来的', titleEn: 'I came by plane',
    focus: 'How did you come? · course review',
    words: [['高兴', 'gāoxìng', 'happy, glad'], ['听', 'tīng', 'to listen'], ['飞机', 'fēijī', 'aeroplane']],
    sentences: [['你是怎么来的？', 'Nǐ shì zěnme lái de?', 'How did you get here?'], ['我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'I came by plane.'], ['认识你很高兴！', 'Rènshi nǐ hěn gāoxìng!', 'Nice to meet you!']],
    grammar: [
      ['是 + how + 来的', '坐飞机 / 坐出租车 / 开车 来的.', '"是…的"问方式：你是怎么来的？'],
      ['HSK 1 review', 'You now know the ~150 HSK 1 words. Try a mock test!', '总复习：一起做一套 HSK1 模拟题（听力+阅读，约 40 分钟，可分两次）。'],
    ],
    dialogue: [['A', '你是怎么来北京的？', 'Nǐ shì zěnme lái Běijīng de?', 'How did you come to Beijing?'], ['B', '我是坐飞机来的。', 'Wǒ shì zuò fēijī lái de.', 'By plane.'], ['A', '你是怎么来饭店的？', 'Nǐ shì zěnme lái fàndiàn de?', 'And how did you get to the hotel?'], ['B', '是坐出租车来的。', 'Shì zuò chūzūchē lái de.', 'By taxi.'], ['A', '认识你很高兴！', 'Rènshi nǐ hěn gāoxìng!', 'Nice to meet you!']],
    hw: { learner: 'Do an HSK 1 mock test (listening + reading) and send your score.', me: 'Write a 150-word reflection: what you learned in English during these weeks, what to improve next.' },
    en: { topic: 'Travel and future plans', qs: ['Where would you love to travel next?', 'If we met in person one day, where should it be?', 'What should we study after HSK 1?'], phrases: [['I\'ve always wanted to visit ...', '我一直想去…'], ['A layover in ...', '在…转机'], ['Jet lag', '时差反应']] },
  },
];

/** All parts in teaching order: pinyin → characters → HSK lessons. */
export const PARTS = [...PINYIN, ...HANZI, ...HSK.map((p) => ({ ...p, stage: /** @type {'hsk'} */ ('hsk') }))];

/** The classroom English the teacher uses while teaching Chinese (practise it every session). */
export const TEACHER_ENGLISH = [
  ['Repeat after me.', '跟我读。'],
  ['Mind your tones — that was a 4th tone, not a 2nd.', '注意声调，那是四声不是二声。'],
  ['Almost! Try it once more, a bit slower.', '差不多了！再慢一点试一次。'],
  ['Can you say that in a full sentence?', '你能说成一个完整的句子吗？'],
  ['Let me show you on the screen.', '我在屏幕上给你看。'],
  ['We\'re running out of time, let\'s move on.', '时间不多了，我们继续下一部分。'],
  ['For homework, please send me a voice message.', '作业：请给我发一条语音。'],
  ['Could you correct my English, please?', '请帮我纠正英语。'],
  ['Is there a more natural way to say that?', '有更地道的说法吗？'],
];
