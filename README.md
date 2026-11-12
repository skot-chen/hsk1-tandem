# HSK1 Tandem · 中英互学

**Teach HSK 1 Chinese in 30-minute tandem sessions — and learn English back.**
用 30 分钟一次的互学课教 HSK1 中文，同时对方帮你练英语。

🌐 **Web version 网页版:** https://skot-chen.github.io/hsk1-tandem/

Made for two people in different time zones who can only meet briefly: every session is time-boxed,
previewed on Discord beforehand, and logged so you always know where you are.
为时差大、很难凑时间的两个人设计：每次课有计时、课前在 Discord 预习、课后有记录。

## Learning path 学习顺序
1. **Pinyin 拼音** (6 sessions) — tones, initials/finals, spelling rules, tone changes, tone pairs → **reading test** (80% to pass)
2. **Characters 汉字** (6 sessions) — strokes → single-component characters → stroke order → structures → radicals → sound+meaning characters → **radical test**
3. **HSK 1 lessons 课文** (27 sessions) — words, grammar and dialogues following the order and vocabulary of *HSK Standard Course 1* (lessons 1–15)

Example sentences, dialogues and tips are written for this app (not copied from the textbook).
例句、对话和教学提示都是原创的，没有照抄课本。

## A 30-minute session 一次课
🔁 warm-up review 4′ → 🀄 new Chinese 12′ → 💬 English for the teacher 11′ → 📝 log + homework 3′.
The timer beeps and moves on by itself. After saving, a recap is copied for Discord.

## Features 功能
- **Today** — next step, both clocks, best time to meet, open homework
- **Course** — three stages, later ones unlock after the test; 🔊 speech, ✍️ stroke-order animation (green = radical)
- **Review** — spaced-repetition cards for the learner's Chinese and the teacher's English corrections
- **Teacher 教师指标** — benchmarks per stage, mastery, sessions per week vs goal, expected finish date, weak spots, test and HSK mock-test scores
- **Log** — every session with notes and homework; export Markdown, backup/restore JSON

## Two ways to run it 两种用法
| | Where the log is saved 记录保存在 |
|---|---|
| **Web version** (link above) | only in your browser (localStorage) — not shared between devices; use *Log → Backup* now and then |
| **On your own PC**: install [Node.js](https://nodejs.org) 22+, then double-click `start.bat` (or `npm start`) → http://localhost:8767 | a JSON file in `../../data/hsk1-tandem/` next to the app folder, previous version kept as `.bak` |

No dependencies to install. 不需要安装任何依赖。

## Development
`npm run check` runs the tests (content complete, book characters/radicals covered, Discord texts ≤ 2000 characters,
the server never overwrites newer data, teacher metrics). Pushing to `main` deploys `public/` to GitHub Pages.

## Credits
- Stroke animation: [Hanzi Writer](https://github.com/chanind/hanzi-writer) (MIT), stroke data loaded from the
  [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) CDN.
- Course order and vocabulary follow *HSK Standard Course 1* (Beijing Language and Culture University Press); buy the book for the full texts and exercises.
