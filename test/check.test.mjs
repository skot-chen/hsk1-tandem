// Fast checks: course content is complete and the server never overwrites newer data.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { PARTS, TEACHER_ENGLISH, STAGES } from '../public/content/lessons.js';
import { createServer } from '../server.mjs';
import { discordLessonCard } from '../public/discord.js';

test('order: 6 pinyin → 6 characters → 27 lesson parts, all fields filled', () => {
  assert.deepEqual(PARTS.map((p) => p.stage).filter((x, i, a) => a.indexOf(x) === i), STAGES.map((s) => s.key));
  assert.equal(PARTS.filter((p) => p.stage === 'pinyin').length, 6);
  assert.equal(PARTS.filter((p) => p.stage === 'hanzi').length, 6);
  assert.equal(PARTS.filter((p) => p.stage === 'hsk').length, 27);
  // each foundation stage ends with a test
  assert.ok(PARTS.find((p) => p.id === 'P6')?.checkpoint && PARTS.find((p) => p.id === 'C6')?.checkpoint);
  const ids = new Set();
  for (const p of PARTS) {
    assert.ok(!ids.has(p.id), 'duplicate id ' + p.id); ids.add(p.id);
    assert.ok(p.hw.learner && p.hw.me && p.en.topic && p.en.qs.length >= 3 && p.en.phrases.length >= 3, p.id);
    for (const ph of p.en.phrases) assert.equal(ph.length, 2, p.id);
    if (p.stage === 'hsk') {
      assert.ok(p.words.length >= 1 && p.sentences.length >= 2 && p.grammar.length >= 1 && p.dialogue.length >= 3, p.id);
      for (const w of p.words) assert.equal(w.length, 3, p.id + ' word ' + w[0]);
      for (const x of p.sentences) assert.equal(x.length, 3, p.id);
      for (const g of p.grammar) assert.equal(g.length, 3, p.id);
      for (const d of p.dialogue) assert.equal(d.length, 4, p.id);
    } else {
      assert.ok((p.sounds || p.chars || []).length > 0, p.id);
      for (const r of [...(p.sounds || []), ...(p.strokes || []), ...(p.radicals || []), ...(p.chars || [])]) assert.equal(r.length, 4, p.id + ' ' + r[0]);
      for (const n of p.notes || []) assert.equal(n.length, 3, p.id);
    }
  }
  assert.ok(TEACHER_ENGLISH.length > 5);
});

test('book check: single-component characters and radicals from the contents table are all taught', () => {
  const taught = new Set(PARTS.flatMap((p) => [...(p.chars || []), ...(p.radicals || [])].map((c) => c[0])));
  const book = '一二三十八六口见山小不月心中人七儿几九水女了大东我西四五书少个在子工上下本末午电天气雨日目习开车回年出飞';
  for (const ch of book) assert.ok(taught.has(ch), 'missing ' + ch);
  for (const r of ['氵', '讠', '钅', '口', '辶', '门', '囗', '扌', '阝', '亻', '女', '饣', '日', '目', '月', '艹', '宀']) assert.ok(taught.has(r), 'missing radical ' + r);
});

test('about 150 HSK 1 words, no duplicates', () => {
  const words = PARTS.flatMap((p) => (p.words || []).map((w) => w[0]));
  assert.equal(new Set(words).size, words.length, 'duplicate word');
  // the "1–10" entry stands for 10 words
  assert.ok(words.length + 9 >= 140, 'only ' + words.length);
});

test('every lesson card fits in one Discord message (2000 chars)', () => {
  for (const p of PARTS) assert.ok(discordLessonCard(p).length <= 2000, p.id);
});

test('server: saves, and refuses stale saves', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'hsk1-'));
  const dataFile = path.join(dir, 'state.json');
  const srv = createServer({ dataFile }).listen(0);
  await new Promise((r) => srv.once('listening', r));
  const base = `http://127.0.0.1:${/** @type {any} */ (srv.address()).port}`;
  try {
    let r = await fetch(base + '/api/state');
    assert.deepEqual(await r.json(), { rev: 0 });
    r = await fetch(base + '/api/state', { method: 'PUT', body: JSON.stringify({ baseRev: 0, state: { sessions: [1] } }) });
    assert.equal(r.status, 200); assert.equal((await r.json()).rev, 1);
    // a tab that loaded before (rev 0) must not overwrite
    r = await fetch(base + '/api/state', { method: 'PUT', body: JSON.stringify({ baseRev: 0, state: { sessions: [] } }) });
    assert.equal(r.status, 409); assert.deepEqual((await r.json()).sessions, [1]);
    r = await fetch(base + '/');
    assert.equal(r.status, 200);
    r = await fetch(base + '/content/lessons.js');
    assert.equal(r.status, 200);
    r = await fetch(base + '/..%2fserver.mjs');
    assert.notEqual(r.status, 200);
  } finally { srv.close(); await fs.rm(dir, { recursive: true, force: true }); }
});

test('teacher metrics: mastery, benchmarks, pace, weak spots', async () => {
  const { computeMetrics } = await import('../public/metrics.js');
  const now = new Date('2026-12-01T12:00:00Z');
  const S = {
    settings: { perWeek: 2 },
    done: { P1: '2026-11-20', P2: '2026-11-24', P6: '2026-11-28' },
    cards: { 'zh:py:mā': { box: 3, r: 2, w: 0 }, 'zh:py:má': { box: 1, r: 0, w: 3 }, 'zh:你': { box: 4, r: 3, w: 1 }, 'en:Spot on!': { box: 2, r: 1, w: 0 } },
    sessions: [
      { date: '2026-11-20T10:00:00Z', kind: 'live', partId: 'P1', hwLearner: 'x', hwLearnerDone: true },
      { date: '2026-11-27T10:00:00Z', kind: 'live', partId: 'P6', check: { right: 20, total: 25, passed: true }, enNotes: 'a → b\nc → d' },
      { date: '2026-11-28T10:00:00Z', kind: 'async', partId: '' },
    ],
    mock: [{ id: 'm1', date: '2026-11-30', listening: 70, reading: 60 }],
  };
  const M = computeMetrics(S, PARTS, now);
  assert.equal(M.mastery.py.mastered, 1);
  assert.equal(M.mastery.word.mastered, 1);
  assert.ok(M.mastery.py.total > 50, 'pinyin total from content');
  assert.equal(M.benchmarks[0].items[2].value, 80); // pinyin test best %
  assert.equal(M.benchmarks[2].items[2].value, 130); // mock 70 + 60
  assert.equal(M.weak[0].key, 'zh:py:má');
  assert.equal(M.accuracy, Math.round((5 / 9) * 100));
  assert.deepEqual(M.hw.learner, { given: 1, done: 1 });
  assert.equal(M.englishCorrections, 2);
  assert.equal(M.weeks.length, 8);
  assert.equal(M.weeks.reduce((a, w) => a + w.live + w.async, 0), 3);
  assert.ok(M.pace.finish && M.pace.finish > '2026-12-01');
});
