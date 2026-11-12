// @ts-check
// Teacher metrics 教师指标: pure calculations from the saved state (tested in test/check.test.mjs).

/** A card counts as "mastered" from box 3 up: answered right at least twice in a row, now reviewed every ≥ 4 days. */
export const MASTERED_BOX = 3;
export const HSK1_PASS = 120; // HSK 1 mock test: listening 100 + reading 100, pass = 120 / 200
const DAY = 864e5;

/** Which kind of item a card key is. @param {string} key */
export function cardType(key) {
  if (key.startsWith('en:')) return 'en';
  if (key.startsWith('zh:py:')) return 'py';
  if (key.startsWith('zh:st:') || key.startsWith('zh:rad:')) return 'rad';
  if (key.startsWith('zh:ch:')) return 'ch';
  return 'word';
}

export const TYPES = [
  { key: 'py', name: 'Pinyin sounds', zh: '拼音' },
  { key: 'rad', name: 'Strokes + radicals', zh: '笔画和部首' },
  { key: 'ch', name: 'Characters', zh: '汉字' },
  { key: 'word', name: 'HSK 1 words', zh: 'HSK1 生词' },
  { key: 'en', name: 'My English phrases', zh: '我的英语' },
];

/** How many items of each type the whole course teaches. @param {any[]} parts */
export function courseTotals(parts) {
  /** @type {Record<string, Set<string>>} */
  const s = { py: new Set(), rad: new Set(), ch: new Set(), word: new Set(), en: new Set() };
  for (const p of parts) {
    for (const x of p.sounds || []) s.py.add(x[2]);
    for (const x of [...(p.strokes || []), ...(p.radicals || [])]) s.rad.add(x[0]);
    for (const x of p.chars || []) s.ch.add(x[0]);
    for (const x of p.words || []) s.word.add(x[0]);
    for (const x of p.en?.phrases || []) s.en.add(x[0]);
  }
  return Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v.size]));
}

/** @param {Date} d */
function weekStart(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }

/** @param {any} S saved state @param {any[]} parts all parts in order @param {Date} [now] */
export function computeMetrics(S, parts, now = new Date()) {
  const totals = courseTotals(parts);
  const sessions = S.sessions || [];
  const cards = Object.entries(S.cards || {});

  // mastery per type: new (box 1), learning (box 2), mastered (box ≥ 3), not yet introduced
  /** @type {Record<string, {fresh:number, learning:number, mastered:number, total:number, notYet:number}>} */
  const mastery = {};
  for (const t of TYPES) {
    const cs = cards.filter(([k]) => cardType(k) === t.key).map(([, c]) => c);
    const fresh = cs.filter((c) => c.box <= 1).length, learning = cs.filter((c) => c.box === 2).length, mastered = cs.filter((c) => c.box >= MASTERED_BOX).length;
    const total = Math.max(totals[t.key] || 0, cs.length); // English also grows with corrections
    mastery[t.key] = { fresh, learning, mastered, total, notYet: Math.max(0, total - cs.length) };
  }

  // tests at the end of each foundation stage
  /** @param {string} id */
  const attempts = (id) => sessions.filter((/** @type {any} */ s) => s.partId === id && s.check).map((/** @type {any} */ s) => ({ date: s.date, ...s.check, pct: Math.round((s.check.right / s.check.total) * 100) }));
  /** @param {string} id */
  const best = (id) => attempts(id).reduce((/** @type {number|null} */ m, /** @type {any} */ a) => (m == null || a.pct > m ? a.pct : m), null);

  // attendance: sessions per week, last 8 weeks (this week last)
  const ws = weekStart(now).getTime();
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const a = ws - (7 - i) * 7 * DAY, b = a + 7 * DAY;
    const inWeek = sessions.filter((/** @type {any} */ s) => { const t = new Date(s.date).getTime(); return t >= a && t < b; });
    return { start: new Date(a).toISOString().slice(0, 10), live: inWeek.filter((/** @type {any} */ s) => s.kind !== 'async').length, async: inWeek.filter((/** @type {any} */ s) => s.kind === 'async').length };
  });

  // pace: finished parts in the last 4 weeks (or since the first session if sooner)
  const doneDates = Object.values(S.done || {}).map((d) => new Date(String(d)).getTime());
  const first = sessions.length ? Math.min(...sessions.map((/** @type {any} */ s) => new Date(s.date).getTime())) : null;
  const spanWeeks = first == null ? 0 : Math.max(1, Math.min(4, (now.getTime() - first) / (7 * DAY)));
  const recentDone = doneDates.filter((t) => t >= now.getTime() - spanWeeks * 7 * DAY).length;
  const partsPerWeek = spanWeeks ? recentDone / spanWeeks : 0;
  const remaining = parts.filter((p) => !S.done?.[p.id]).length;
  const finish = partsPerWeek > 0 ? new Date(now.getTime() + (remaining / partsPerWeek) * 7 * DAY).toISOString().slice(0, 10) : null;
  const plannedFinish = first != null ? new Date(first + (parts.length / (S.settings?.perWeek || 2)) * 7 * DAY).toISOString().slice(0, 10) : null;
  const recent4 = weeks.slice(4).reduce((a, w) => a + w.live + w.async, 0) / 4;

  // review accuracy over all graded cards (Chinese only)
  const zh = cards.filter(([k]) => !k.startsWith('en:')).map(([, c]) => c);
  const r = zh.reduce((a, c) => a + (c.r || 0), 0), w = zh.reduce((a, c) => a + (c.w || 0), 0);

  // weak spots: Chinese cards answered wrong most often and still in box 1–2
  const weak = cards.filter(([k, c]) => !k.startsWith('en:') && c.w > 0 && c.box < MASTERED_BOX)
    .sort((a, b) => b[1].w - a[1].w || a[1].box - b[1].box).slice(0, 8).map(([k, c]) => ({ key: k, ...c }));

  // homework completion
  const hw = (/** @type {string} */ key) => { const given = sessions.filter((/** @type {any} */ s) => s[key]); return { given: given.length, done: given.filter((/** @type {any} */ s) => s[key + 'Done']).length }; };

  const mocks = (S.mock || []).map((/** @type {any} */ m) => ({ ...m, total: (Number(m.listening) || 0) + (Number(m.reading) || 0) }));
  const bestMock = mocks.reduce((/** @type {number|null} */ m, /** @type {any} */ x) => (m == null || x.total > m ? x.total : m), null);
  const stageDone = (/** @type {string} */ st) => { const ps = parts.filter((p) => p.stage === st); return { done: ps.filter((p) => S.done?.[p.id]).length, total: ps.length }; };
  const pct = (/** @type {number} */ a, /** @type {number} */ b) => (b ? a / b : 0);

  // benchmarks 达标标准: what the learner should reach at the end of each stage
  const sp = stageDone('pinyin'), sh = stageDone('hanzi'), sk = stageDone('hsk');
  const benchmarks = [
    { stage: 'pinyin', items: [
      { label: 'All 6 pinyin sessions done', zh: '学完 6 次拼音课', value: sp.done, target: sp.total, unit: '' },
      { label: 'Pinyin sounds mastered', zh: '拼音卡片掌握 ≥ 80%', value: Math.round(pct(mastery.py.mastered, mastery.py.total) * 100), target: 80, unit: '%' },
      { label: 'Pinyin reading test', zh: '拼音认读测试 ≥ 80%', value: best('P6'), target: 80, unit: '%' },
    ] },
    { stage: 'hanzi', items: [
      { label: 'All 6 character sessions done', zh: '学完 6 次汉字课', value: sh.done, target: sh.total, unit: '' },
      { label: 'Characters recognised (pinyin + meaning)', zh: '独体字/汉字掌握 ≥ 80%', value: Math.round(pct(mastery.ch.mastered, mastery.ch.total) * 100), target: 80, unit: '%' },
      { label: 'Radical test', zh: '部首测试 ≥ 80%', value: best('C6'), target: 80, unit: '%' },
    ] },
    { stage: 'hsk', items: [
      { label: 'All lesson parts done', zh: '学完全部课文', value: sk.done, target: sk.total, unit: '' },
      { label: 'HSK 1 words mastered', zh: 'HSK1 生词掌握 ≥ 120 个', value: mastery.word.mastered, target: 120, unit: '' },
      { label: 'HSK 1 mock test', zh: '模拟考 ≥ 120 / 200（及格线）', value: bestMock, target: HSK1_PASS, unit: '' },
    ] },
  ];

  return {
    totals, mastery, weeks, benchmarks, weak, mocks, bestMock,
    tests: { P6: attempts('P6'), C6: attempts('C6') },
    pace: { partsPerWeek: Math.round(partsPerWeek * 10) / 10, sessionsPerWeek: Math.round(recent4 * 10) / 10, goal: S.settings?.perWeek || 2, remaining, finish, plannedFinish },
    accuracy: r + w ? Math.round((r / (r + w)) * 100) : null,
    hw: { learner: hw('hwLearner'), me: hw('hwMe') },
    englishCorrections: sessions.reduce((/** @type {number} */ a, /** @type {any} */ s) => a + (s.enNotes ? s.enNotes.split('\n').filter((/** @type {string} */ x) => x.trim()).length : 0), 0),
  };
}
