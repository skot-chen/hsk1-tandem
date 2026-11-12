# HSK1 Tandem — notes for Claude

Purpose: a Chinese native speaker (learning English) teaches a partner (HSK 1 level)
Chinese while practising English with them. Big time difference, so sessions are short (30 min, 2×/week) and
everything is time-boxed and logged. Communication: Discord (voice + screen share).
Runs two ways: locally with `start.bat` (server saves a JSON file) or as a static site on GitHub Pages (localStorage).
Public repo — keep personal details out of code, docs and commits.

See SPEC.md (what/acceptance) and PROGRESS.md (state).

## Stack
Zero dependencies (workspace rule): Node 22 `server.mjs` (static + one JSON file), plain ES modules in `public/`.
- Teaching order (by design): pinyin stage (P1–P6, test) → characters from strokes/radicals (C1–C6, test) → lessons.
- `content/foundation.js` — P/C stages; strokes, single-component characters and radicals follow the book's contents
  table (pinyin/汉字 columns, checked on Scribd pages 16–21 on 2026-11-09).
- `content/lessons.js` — 27 lesson parts (L1–2 merged), vocab checked against the book's contents table; `PARTS` = all
  stages in order, `partLabel()`. Dialogues/examples are ORIGINAL — never copy text from the textbook (copyrighted).
- `public/vendor/hanzi-writer.min.js` — stroke animation (MIT); stroke data loads from jsdelivr (needs internet).
- `public/app.js` — whole UI (tabs: today/session runner, course, review, log, settings).
- `public/metrics.js` — pure teacher metrics (benchmarks per stage, mastery = box ≥ 3, pace, weak spots); tested.
- `public/discord.js` — Discord Markdown text, must stay ≤ 2000 chars (tested).
- Data: `HSK1_DATA` env or `../../data/hsk1-tandem/state.json`; web version (GitHub Pages, no server) uses localStorage; `.bak` = previous version.

## Data safety
Server only accepts a save whose `baseRev` equals the stored `rev` (409 otherwise) → a stale/empty tab can't wipe data.
Client queues saves (`saving` promise chain) and never saves before load.
Test ONLY with launch config `hsk1-tandem-test` (port 8768, `tmp/hsk1-test/state.json`); delete that folder after.

## Commands
`npm run check` (node:test, < 1 s) · `start.bat` / `npm start` (opens browser) · port 8767.

## Gotchas
- Flag emoji render as letters on Windows → page uses 🀄 / 💬; Discord text may use flags.
- Screenshots in the preview pane can lag one render; verify state with JS/read_page.
