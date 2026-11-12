// @ts-check
import { PARTS, TEACHER_ENGLISH, STAGES, partLabel } from './content/lessons.js';
import { discordLessonCard, discordRecap, discordWordList } from './discord.js';
import { computeMetrics, TYPES, MASTERED_BOX, HSK1_PASS } from './metrics.js';

// ───────── state ─────────
const DEFAULT_SETTINGS = {
  teacher: 'Me', learner: 'Learner',
  tzMe: 'Asia/Shanghai', tzHim: 'Europe/Amsterdam',
  hoursMe: [9, 23], hoursHim: [8, 22],
  minutes: 30, perWeek: 2, rate: 0.8,
};
/** @type {any} */
let S = null;
let loaded = false;
let tab = 'today';
/** @type {any} */
let view = {}; // per-tab UI state (not saved)
const PHASES = [
  { key: 'review', icon: '🔁', name: 'Warm-up review', zh: '复习', share: 0.13 },
  { key: 'zh', icon: '🀄', name: 'New Chinese', zh: '中文新课', share: 0.4 },
  { key: 'en', icon: '💬', name: 'English for me', zh: '我的英语', share: 0.37 },
  { key: 'wrap', icon: '📝', name: 'Log & homework', zh: '记录+作业', share: 0.1 },
];
const BOX_DAYS = [0, 1, 2, 4, 8, 16];

const $ = (/** @type {string} */ s) => /** @type {HTMLElement} */ (document.querySelector(s));
const esc = (/** @type {any} */ s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c);
const partById = (/** @type {string} */ id) => PARTS.find((p) => p.id === id);
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (/** @type {number} */ n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

function freshState() {
  return { settings: { ...DEFAULT_SETTINGS }, done: {}, cards: {}, sessions: [], draft: null };
}

// Two ways to keep the data:
//  • on this PC (start.bat, localhost): the small server saves it to data/hsk1-tandem/state.json
//  • on the web version (GitHub Pages, no server): it is kept in this browser's localStorage
const API = 'api/state';
const LS_KEY = 'hsk1-tandem-state';
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
let browserMode = false;

async function load() {
  let data;
  if (isLocal) { // on this PC a missing server is an error — never silently switch to browser storage
    const r = await fetch(API, { cache: 'no-store' });
    if (!r.ok) throw new Error('load failed ' + r.status);
    data = await r.json();
  } else {
    browserMode = true;
    try { data = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { data = {}; }
  }
  S = { ...freshState(), ...data };
  S.settings = { ...DEFAULT_SETTINGS, ...S.settings };
  loaded = true;
}

let saveTimer = 0;
function save() {
  if (!loaded) return; // never save before the real data has been loaded
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveNow, 400);
}
let saving = Promise.resolve();
/** Saves run one after another, so each one is based on the rev the previous one returned. */
function saveNow() {
  clearTimeout(saveTimer);
  saving = saving.then(doSave);
  return saving;
}
async function doSave() {
  const { rev, savedAt, ...state } = S;
  if (browserMode) {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ ...state, savedAt: new Date().toISOString() })); }
    catch { toast('Could not save in this browser (private window?). Use Log → Backup. 浏览器无法保存，请用备份。', 6000); }
    return;
  }
  try {
    const r = await fetch(API, { method: 'PUT', body: JSON.stringify({ baseRev: rev || 0, state }) });
    if (r.status === 409) {
      S = { ...freshState(), ...(await r.json()) };
      S.settings = { ...DEFAULT_SETTINGS, ...S.settings };
      toast('Changed in another window — reloaded the newest data. 另一个窗口改过数据，已重新加载。', 5000);
      render();
    } else if (r.ok) S.rev = (await r.json()).rev;
    else toast('Save failed ' + r.status, 5000);
  } catch { toast('Save failed — is the server window still open? 服务器窗口还开着吗？', 6000); }
}

// ───────── helpers ─────────
function toast(/** @type {string} */ msg, ms = 2500) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(/** @type {any} */ (t).timer); /** @type {any} */ (t).timer = setTimeout(() => (t.hidden = true), ms);
}
async function copy(/** @type {string} */ text, what = 'Copied') {
  try { await navigator.clipboard.writeText(text); toast(`${what} — paste it in Discord (Ctrl+V). 已复制，粘贴到 Discord。`); }
  catch { // clipboard blocked: show the text so it can be copied by hand
    document.getElementById('writer')?.remove();
    const box = document.createElement('div');
    box.id = 'writer';
    box.innerHTML = `<div class="wbox wide"><div class="wh"><b>Copy this 复制这段</b><button data-act="closeWriter">✕</button></div><textarea rows="12" readonly>${esc(text)}</textarea></div>`;
    document.body.appendChild(box);
    /** @type {HTMLTextAreaElement} */ (box.querySelector('textarea')).select();
  }
}
function speak(/** @type {string} */ text, lang = 'zh-CN') {
  if (!('speechSynthesis' in window)) return toast('This browser cannot speak.');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = lang.startsWith('zh') ? S.settings.rate : 1;
  const v = speechSynthesis.getVoices().find((x) => x.lang.replace('_', '-').startsWith(lang.slice(0, 2)) && (lang !== 'zh-CN' || /CN|Hans|Mandarin/i.test(x.lang + x.name)));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function beep(times = 2) {
  try {
    const ac = new AudioContext();
    for (let i = 0; i < times; i++) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
      const t = ac.currentTime + i * 0.35;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.start(t); o.stop(t + 0.32);
    }
  } catch { /* no audio */ }
}
function timeIn(/** @type {string} */ tz, d = new Date()) {
  return d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
}
function dayIn(/** @type {string} */ tz, d = new Date()) {
  return d.toLocaleDateString('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' });
}
function hourIn(/** @type {string} */ tz, d = new Date()) {
  return Number(d.toLocaleString('en-GB', { timeZone: tz, hour: '2-digit', hourCycle: 'h23' }));
}
function inHours(/** @type {number} */ h, /** @type {number[]} */ [a, b]) { return a <= b ? h >= a && h < b : h >= a || h < b; }
const shortTz = (/** @type {string} */ tz) => tz.split('/').pop()?.replace('_', ' ') || tz;

function nextPart() { return PARTS.find((p) => !S.done[p.id]); }
function phaseMinutes() {
  const total = S.settings.minutes;
  const m = PHASES.map((p) => Math.max(1, Math.round(total * p.share)));
  m[1] += total - m.reduce((a, b) => a + b, 0);
  return m;
}
function weekStart(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }

// ───────── cards (spaced repetition, Leitner boxes) ─────────
function addCard(/** @type {string} */ key, /** @type {any} */ data) {
  if (!S.cards[key]) S.cards[key] = { ...data, box: 1, due: addDays(1), r: 0, w: 0, added: today() };
}
function dueCards(/** @type {'zh'|'en'} */ deck) {
  return Object.entries(S.cards).filter(([k, c]) => k.startsWith(deck + ':') && c.due <= today()).map(([k]) => k);
}
function grade(/** @type {string} */ key, /** @type {boolean} */ ok) {
  const c = S.cards[key];
  if (ok) { c.box = Math.min(5, c.box + 1); c.r++; c.due = addDays(BOX_DAYS[c.box]); }
  else { c.box = 1; c.w++; c.due = today(); }
}
function introducePart(/** @type {any} */ p) {
  for (const [h, py, en] of p.words || []) addCard('zh:' + h, { h, py, en, part: p.id });
  for (const [label, h, py, hint] of p.sounds || []) addCard('zh:py:' + py, { kind: 'py', h, py, en: label + (hint ? ' — ' + hint : ''), part: p.id });
  for (const [h, py, en, ex] of p.strokes || []) addCard('zh:st:' + h, { kind: 'rad', h, py, en, ex, part: p.id });
  for (const [h, py, en, ex] of p.radicals || []) addCard('zh:rad:' + h, { kind: 'rad', h, py, en, ex, part: p.id });
  for (const [h, py, en, ex] of p.chars || []) addCard('zh:ch:' + h, { kind: 'ch', h, py, en, ex, part: p.id });
  for (const [en, zh] of p.en.phrases) addCard('en:' + en, { en, zh, part: p.id });
}

/** A stage is locked until the test at the end of the previous stage is passed. */
function isLocked(/** @type {string} */ stage) {
  if (stage === 'hanzi') return !S.done.P6;
  if (stage === 'hsk') return !S.done.C6;
  return false;
}
function cpScore(/** @type {any} */ p, /** @type {any} */ d) {
  const total = p.checkpoint.items.length;
  const right = Object.values(d.check || {}).filter((v) => v === true).length;
  return { right, total, pct: Math.round((right / total) * 100), passed: right / total >= p.checkpoint.pass };
}

// ───────── rendering ─────────
function render() {
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', /** @type {HTMLElement} */ (b).dataset.tab === tab));
  const m = $('#main');
  if (!loaded) return;
  if (S.draft && tab === 'today') m.innerHTML = renderSession();
  else m.innerHTML = ({ today: renderToday, course: renderCourse, review: renderReview, teacher: renderTeacher, log: renderLog, settings: renderSettings })[tab]();
  if (S.draft && tab === 'today') tick();
}

function renderClocks() {
  const st = S?.settings || DEFAULT_SETTINGS;
  const both = inHours(hourIn(st.tzMe), st.hoursMe) && inHours(hourIn(st.tzHim), st.hoursHim);
  $('#clocks').innerHTML = `
    <div class="clock"><small>${esc(st.teacher)} · ${esc(shortTz(st.tzMe))}</small><b>${timeIn(st.tzMe)}</b><small>${dayIn(st.tzMe)}</small></div>
    <div class="clock"><small>${esc(st.learner)} · ${esc(shortTz(st.tzHim))}</small><b>${timeIn(st.tzHim)}</b><small>${dayIn(st.tzHim)}</small></div>
    <div class="dot ${both ? 'ok' : ''}" title="${both ? 'Good time to talk' : 'Outside your chat hours'}">${both ? '● good time to talk' : '○ not now'}</div>`;
}

function overlapText() {
  const st = S.settings;
  const now = new Date(); now.setMinutes(0, 0, 0);
  /** @type {{me:number, him:number}[]} */
  const good = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() + i * 36e5);
    const me = hourIn(st.tzMe, d), him = hourIn(st.tzHim, d);
    if (inHours(me, st.hoursMe) && inHours(him, st.hoursHim)) good.push({ me, him });
  }
  if (!good.length) return '<p class="warn">No overlap in your chat hours — change them in Settings, or use async practice.</p>';
  good.sort((a, b) => a.me - b.me);
  const first = good[0], last = good[good.length - 1];
  const f = (/** @type {number} */ h) => String(h).padStart(2, '0') + ':00';
  const bar = Array.from({ length: 24 }, (_, h) => {
    const g = good.find((x) => x.me === h);
    return `<i class="${g ? 'g' : ''}" title="${f(h)} you · ${g ? f(g.him) : ''}"></i>`;
  }).join('');
  return `<p>You <b>${f(first.me)}–${f((last.me + 1) % 24)}</b> = ${esc(st.learner)} <b>${f(first.him)}–${f((last.him + 1) % 24)}</b> <span class="muted">(${good.length} h overlap)</span></p>
    <div class="hours">${bar}</div><div class="hours-lbl"><span>0</span><span>6</span><span>12</span><span>18</span><span>24 (your time)</span></div>`;
}

function stats() {
  const doneN = Object.keys(S.done).length;
  const words = Object.keys(S.cards).filter((k) => k.startsWith('zh:')).length;
  const ws = weekStart().getTime();
  const thisWeek = S.sessions.filter((/** @type {any} */ s) => new Date(s.date).getTime() >= ws).length;
  const minutes = S.sessions.reduce((/** @type {number} */ a, /** @type {any} */ s) => a + (Number(s.minutes) || 0), 0);
  // weeks in a row with at least one session (this week counts if it has one)
  let streak = 0; let w = weekStart();
  if (!S.sessions.some((/** @type {any} */ s) => new Date(s.date) >= w)) w = new Date(w.getTime() - 7 * 864e5);
  for (;;) {
    const a = w.getTime(), b = a + 7 * 864e5;
    if (S.sessions.some((/** @type {any} */ s) => { const t = new Date(s.date).getTime(); return t >= a && t < b; })) { streak++; w = new Date(a - 7 * 864e5); } else break;
  }
  return { doneN, words, thisWeek, minutes, streak };
}

function statRow() {
  const s = stats();
  return `<div class="stats">
    <div><b>${s.doneN}<small>/${PARTS.length}</small></b><span>parts done 已学</span></div>
    <div><b>${s.words}</b><span>cards learned 已学卡片</span></div>
    <div><b>${s.thisWeek}<small>/${S.settings.perWeek}</small></b><span>sessions this week 本周</span></div>
    <div><b>${s.streak}</b><span>weeks in a row 连续周</span></div>
    <div><b>${Math.round(s.minutes / 6) / 10}</b><span>hours total 总时长</span></div>
  </div>
  <div class="progress"><i style="width:${(s.doneN / PARTS.length) * 100}%"></i></div>`;
}

function openHomework() {
  const last = S.sessions[S.sessions.length - 1];
  if (!last) return '';
  const item = (/** @type {string} */ who, /** @type {string} */ key, /** @type {string} */ text) => text ? `<label class="hw"><input type="checkbox" data-act="hw" data-id="${last.id}" data-key="${key}" ${last[key + 'Done'] ? 'checked' : ''}> <b>${esc(who)}:</b> ${esc(text)}</label>` : '';
  return `<section class="card"><h3>📝 Homework from last time <small>上次的作业</small></h3>
    ${item(S.settings.learner, 'hwLearner', last.hwLearner)}${item(S.settings.teacher, 'hwMe', last.hwMe)}</section>`;
}

function renderToday() {
  const p = nextPart();
  const mins = phaseMinutes();
  const dueZh = dueCards('zh').length;
  return `${statRow()}
  <div class="grid2">
    <section class="card next">
      ${p ? `<p class="kicker">Next up · 下一次 — ${esc(STAGES.find((x) => x.key === p.stage)?.zh || '')}${p.checkpoint ? ' · 🧪 test day 测试' : ''}</p>
      <h2><span class="hz">${esc(p.title)}</span> <small>${partLabel(p)}</small></h2>
      <p class="muted">${esc(p.titleEn)} — ${esc(p.focus)}</p>
      <ol class="plan">${PHASES.map((ph, i) => `<li><span>${ph.icon} ${ph.name} <small>${ph.zh}</small></span><b>${mins[i]} min</b></li>`).join('')}</ol>
      <div class="btns">
        <button class="primary" data-act="start" data-id="${p.id}">▶ Start ${S.settings.minutes}-min session</button>
        <button data-act="copyCard" data-id="${p.id}" title="Send this before the call so he can preview">📋 Preview for Discord</button>
        <button data-act="open" data-id="${p.id}">👀 Open lesson</button>
      </div>
      <p class="tip">Tip: send the preview on Discord a day before, then share this screen in the call. 提前一天发预习卡，上课时在 Discord 共享屏幕。</p>`
      : `<h2>🎉 HSK 1 finished!</h2><p>All 30 parts are done. Keep reviewing words, and start HSK 2 when ready.</p>`}
    </section>
    <div>
      <section class="card"><h3>🕒 Best time to meet <small>最佳上课时间</small></h3>${overlapText()}</section>
      ${openHomework()}
      <section class="card"><h3>🔁 Words due <small>该复习的词</small></h3>
        <p>${dueZh ? `<b>${dueZh}</b> Chinese words are due — they come up in the warm-up.` : 'Nothing due — great!'}</p>
        <div class="btns"><button data-act="async">✍️ Couldn't meet? Log async practice</button></div>
        <p class="tip">Voice messages and homework on Discord count too. 凑不出时间时，异步练习也记下来。</p>
      </section>
    </div>
  </div>`;
}

/** Pinyin / character stages. @param {any} p @param {{compact?: boolean, session?: any}} [o] */
function renderFoundation(p, o = {}) {
  const spk = (/** @type {string} */ t) => `<button class="spk" data-act="say" data-text="${esc(t)}" title="Listen">🔊</button>`;
  const wr = (/** @type {string} */ t) => `<button class="spk wr" data-act="write" data-text="${esc(t)}" title="Stroke order 笔顺">✍️</button>`;
  const cards = (/** @type {string} */ title, /** @type {string[][]} */ rows, /** @type {(r: string[]) => string} */ fn) => rows?.length ? `<h4>${title}</h4><div class="words">${rows.map(fn).join('')}</div>` : '';
  const cp = p.checkpoint;
  return `<div class="part">
    ${cards('Sounds 发音 <small>click 🔊 to hear the example</small>', p.sounds, ([label, h, py, hint]) => `<div class="word">${spk(h)}<span class="lbl">${esc(label)}</span><span class="py">${esc(py)} <span class="hz ink">${esc(h)}</span></span><span class="en">${esc(hint)}</span></div>`)}
    ${p.drill ? `<h4>Read aloud 朗读</h4><div class="drill">${p.drill.map((/** @type {string} */ x) => `<div>${esc(x)}</div>`).join('')}</div>` : ''}
    ${cards('Strokes 笔画', p.strokes, ([g, name, en, ex]) => `<div class="word"><span></span><span class="hz glyph">${esc(g)}</span><span class="py">${esc(name)}</span><span class="en">${esc(en)} · e.g. ${esc(ex)}</span></div>`)}
    ${cards('Radicals 部首/偏旁', p.radicals, ([g, name, en, ex]) => `<div class="word"><span></span><span class="hz glyph">${esc(g)}</span><span class="py">${esc(name)}</span><span class="en"><b>${esc(en)}</b> · ${esc(ex)}</span></div>`)}
    ${cards('Characters 汉字 <small>✍️ = stroke order animation</small>', p.chars, ([h, py, en, how]) => `<div class="word">${spk(h)}<span class="hz">${esc(h)}</span><span class="py">${esc(py)}</span><span class="en">${esc(en)}${how ? ' · ' + esc(how) : ''}</span>${wr(h)}</div>`)}
    ${(p.notes || []).length ? `<h4>Notes 要点</h4>${p.notes.map((/** @type {string[]} */ [t, ex, tip]) => `<div class="gram"><b>${esc(t)}</b><p>${esc(ex)}</p><p class="tipzh">👩‍🏫 ${esc(tip)}</p></div>`).join('')}` : ''}
    ${cp ? (o.session ? renderCheckpoint(p, o.session) : `<h4>🧪 ${esc(cp.title)}</h4><p class="muted">${cp.items.length} items, pass = ${cp.pass * 100}%. Run it inside a session. 在上课时做测试。</p>`) : ''}
    ${o.compact ? '' : `<h4>Homework 作业</h4><p>🀄 <b>${esc(S.settings.learner)}:</b> ${esc(p.hw.learner)}</p><p>💬 <b>${esc(S.settings.teacher)}:</b> ${esc(p.hw.me)}</p>
    <h4>English half 英语部分: ${esc(p.en.topic)}</h4>${renderEnglish(p)}`}
  </div>`;
}

function renderCheckpoint(/** @type {any} */ p, /** @type {any} */ d) {
  const cp = p.checkpoint, sc = cpScore(p, d), chk = d.check || {};
  return `<h4>🧪 ${esc(cp.title)}</h4>
    <p class="tip">${p.stage === 'pinyin' ? 'He reads each item aloud.' : 'He says what each radical means.'} You click ✓ or ✗. The small grey answer appears when you hover. Pass = ${cp.pass * 100}%.</p>
    <div class="cp">${cp.items.map((/** @type {string[]} */ [q, a], /** @type {number} */ i) => `<div class="cpi ${chk[i] === true ? 'ok' : chk[i] === false ? 'no' : ''}"><b class="${p.stage === 'pinyin' ? 'pyq' : 'hz'}">${esc(q)}</b><small class="ans">${esc(a)}</small>
      <span><button data-act="cp" data-i="${i}" data-ok="1">✓</button><button data-act="cp" data-i="${i}" data-ok="0">✗</button></span></div>`).join('')}</div>
    <p class="score ${sc.passed ? 'pass' : ''}">Score 得分: <b>${sc.right} / ${sc.total} = ${sc.pct}%</b> ${sc.passed ? '✅ passed 通过' : `(need ${Math.ceil(cp.pass * sc.total)})`}</p>`;
}

/** @param {any} p @param {{compact?: boolean, session?: any}} [o] */
function renderPart(p, o = {}) {
  if (p.stage !== 'hsk') return renderFoundation(p, o);
  const hidePy = view.hidePy, hideEn = view.hideEn;
  const spk = (/** @type {string} */ t) => `<button class="spk" data-act="say" data-text="${esc(t)}" title="Listen">🔊</button>`;
  return `<div class="part ${hidePy ? 'no-py' : ''} ${hideEn ? 'no-en' : ''}">
    <div class="toggles">
      <label><input type="checkbox" data-act="hidePy" ${hidePy ? 'checked' : ''}> hide pinyin 隐藏拼音</label>
      <label><input type="checkbox" data-act="hideEn" ${hideEn ? 'checked' : ''}> hide English 隐藏英文</label>
    </div>
    <h4>New words 生词</h4>
    <div class="words">${p.words.map((/** @type {string[]} */ [h, py, en]) => `<div class="word">${spk(h)}<span class="hz">${esc(h)}</span><span class="py">${esc(py)}</span><span class="en">${esc(en)}</span></div>`).join('')}</div>
    <h4>Key sentences 句子</h4>
    <div class="lines">${p.sentences.map((/** @type {string[]} */ [h, py, en]) => `<div class="line">${spk(h)}<div><span class="hz">${esc(h)}</span><span class="py">${esc(py)}</span><span class="en">${esc(en)}</span></div></div>`).join('')}</div>
    <h4>Grammar 语法</h4>
    ${p.grammar.map((/** @type {string[]} */ [t, ex, tip]) => `<div class="gram"><b>${esc(t)}</b><p>${esc(ex)}</p><p class="tipzh">👩‍🏫 ${esc(tip)}</p></div>`).join('')}
    <h4>Dialogue 对话 <button class="spk" data-act="say" data-text="${esc(p.dialogue.map((/** @type {string[]} */ d) => d[1]).join(' '))}">🔊 all</button></h4>
    <div class="lines dialogue">${p.dialogue.map((/** @type {string[]} */ [who, h, py, en]) => `<div class="line"><span class="who">${esc(who)}</span>${spk(h)}<div><span class="hz">${esc(h)}</span><span class="py">${esc(py)}</span><span class="en">${esc(en)}</span></div></div>`).join('')}</div>
    ${o.compact ? '' : `<h4>Homework 作业</h4><p>🀄 <b>${esc(S.settings.learner)}:</b> ${esc(p.hw.learner)}</p><p>💬 <b>${esc(S.settings.teacher)}:</b> ${esc(p.hw.me)}</p>
    <h4>English half 英语部分: ${esc(p.en.topic)}</h4>${renderEnglish(p)}`}
  </div>`;
}

function renderEnglish(/** @type {any} */ p) {
  return `<ol class="qs">${p.en.qs.map((/** @type {string} */ q) => `<li>${esc(q)}</li>`).join('')}</ol>
    <div class="phrases">${p.en.phrases.map((/** @type {string[]} */ [en, zh]) => `<div><button class="spk" data-act="say" data-lang="en-GB" data-text="${esc(en)}">🔊</button><b>${esc(en)}</b><span>${esc(zh)}</span></div>`).join('')}</div>`;
}

// ── session runner ──
function startSession(/** @type {string} */ id) {
  const mins = phaseMinutes();
  const p = partById(id);
  if (!p) return;
  const queue = dueCards('zh').slice(0, 15);
  S.draft = {
    partId: id, startedAt: new Date().toISOString(), phase: 0, mins,
    endsAt: Date.now() + mins[0] * 6e4, pausedLeft: null,
    queue, qi: 0, flipped: false, review: { right: 0, wrong: 0 },
    zhNotes: '', enNotes: '', hwLearner: p.hw.learner, hwMe: p.hw.me, finished: true,
  };
  if (!queue.length) { S.draft.endsAt = Date.now() + 2 * 6e4; S.draft.mins[0] = 2; }
  save(); tab = 'today'; render();
}

function renderSession() {
  const d = S.draft, p = partById(d.partId);
  if (!p) { S.draft = null; return renderToday(); }
  const ph = PHASES[d.phase];
  let body = '';
  if (ph.key === 'review') body = renderFlash('zh', d);
  if (ph.key === 'zh') body = renderPart(p, { compact: true, session: d }) + teacherEnglish();
  if (ph.key === 'en') body = `<h3>💬 Topic: ${esc(p.en.topic)}</h3><p class="tip">${esc(S.settings.learner)} asks, you answer in English. He corrects you — write the corrections down. 他提问，你用英语回答；他纠正的地方记下来。</p>
    ${renderEnglish(p)}
    <label class="field">My English corrections 我的英语纠错 <small>(one per line, e.g. "I very like → I really like")</small>
    <textarea data-draft="enNotes" rows="4">${esc(d.enNotes)}</textarea></label>`;
  if (ph.key === 'wrap') body = `<h3>📝 Wrap up 收尾</h3>
    <label class="field">${esc(S.settings.learner)}'s Chinese — mistakes to remember 他的中文问题
    <textarea data-draft="zhNotes" rows="3">${esc(d.zhNotes)}</textarea></label>
    <label class="field">My English corrections 我的英语纠错<textarea data-draft="enNotes" rows="3">${esc(d.enNotes)}</textarea></label>
    <div class="grid2"><label class="field">Homework for ${esc(S.settings.learner)}<textarea data-draft="hwLearner" rows="2">${esc(d.hwLearner)}</textarea></label>
    <label class="field">Homework for ${esc(S.settings.teacher)}<textarea data-draft="hwMe" rows="2">${esc(d.hwMe)}</textarea></label></div>
    ${p.checkpoint && !cpScore(p, d).passed
    ? `<p class="warn">🧪 Test not passed yet (${cpScore(p, d).pct}%, need ${p.checkpoint.pass * 100}%). Next session repeats this step — review the ✗ items first. 测试未通过，下次复习后再测。</p>`
    : `<label class="check"><input type="checkbox" data-act="finished" ${d.finished ? 'checked' : ''}> ${partLabel(p)} is finished (next time starts the next part) 本部分已学完</label>`}
    <div class="btns"><button class="primary" data-act="saveSession">💾 Save to log 保存记录</button></div>`;
  return `<section class="card session">
    <div class="sess-head">
      <div><p class="kicker">In session · 上课中 — ${partLabel(p)} ${esc(p.title)}</p>
      <div class="phases">${PHASES.map((x, i) => `<button data-act="phase" data-i="${i}" class="${i === d.phase ? 'on' : i < d.phase ? 'past' : ''}">${x.icon} ${x.name} <small>${d.mins[i]}′</small></button>`).join('')}</div></div>
      <div class="timer"><b id="timer">--:--</b><small id="total"></small>
        <div class="btns"><button data-act="pause" id="pauseBtn">${d.pausedLeft != null ? '▶ Resume' : '⏸ Pause'}</button><button data-act="plus">+1 min</button>${d.phase < 3 ? '<button data-act="next">Next ▶</button>' : ''}<button data-act="cancel" class="ghost" title="Stop without saving">✕</button></div>
      </div>
    </div>
    <div class="sess-body">${body}</div>
  </section>`;
}

function teacherEnglish() {
  return `<details class="te"><summary>🗣 Your classroom English 上课用的英语（练习说）</summary>${TEACHER_ENGLISH.map(([en, zh]) => `<div><button class="spk" data-act="say" data-lang="en-GB" data-text="${esc(en)}">🔊</button><b>${esc(en)}</b> <span class="muted">${esc(zh)}</span></div>`).join('')}</details>`;
}

/** Flashcard practice. Chinese deck: English shown → learner says the Chinese. English deck: Chinese shown → say the English. */
function renderFlash(/** @type {'zh'|'en'} */ deck, /** @type {any} */ st) {
  if (!st.queue.length) return `<div class="flash empty"><p>No words due yet. Warm up instead: greet each other and chat 1–2 minutes in Chinese.<br>还没有要复习的词：先用中文打招呼、聊 1–2 分钟。</p></div>`;
  if (st.qi >= st.queue.length) return `<div class="flash empty"><p>✅ Review done: ${st.review.right} ✓ / ${st.review.wrong} ✗</p></div>`;
  const c = S.cards[st.queue[st.qi]];
  if (!c) { st.qi++; return renderFlash(deck, st); }
  const say = (/** @type {string} */ t) => `<button class="spk" data-act="say" data-text="${esc(t)}">🔊</button>`;
  let front, back;
  if (deck === 'en') {
    front = `<span class="hz big">${esc(c.zh)}</span><small>Say it in English 用英语说</small>`;
    back = `<span class="en big">${esc(c.en)}</span><button class="spk" data-act="say" data-lang="en-GB" data-text="${esc(c.en)}">🔊</button>`;
  } else if (c.kind === 'py') { // pinyin: read it aloud
    front = `<span class="pyq big">${esc(c.py)}</span><small>Read it aloud 读出来</small>`;
    back = `<span class="hz big">${esc(c.h)}</span><span class="en">${esc(c.en)}</span>${say(c.h)}`;
  } else if (c.kind === 'rad') { // stroke or radical: name + meaning
    front = `<span class="hz big">${esc(c.h)}</span><small>Name / meaning? 叫什么、什么意思？</small>`;
    back = `<span class="py">${esc(c.py)}</span><span class="en">${esc(c.en)} · ${esc(c.ex)}</span>`;
  } else if (c.kind === 'ch') { // character: pinyin + meaning
    front = `<span class="hz big">${esc(c.h)}</span><small>Pinyin + meaning? 读音和意思？</small>`;
    back = `<span class="py">${esc(c.py)}</span><span class="en">${esc(c.en)}${c.ex ? ' · ' + esc(c.ex) : ''}</span>${say(c.h)}`;
  } else {
    front = `<span class="en big">${esc(c.en)}</span><small>How do you say it in Chinese? 用中文怎么说？</small>`;
    back = `<span class="hz big">${esc(c.h)}</span><span class="py">${esc(c.py)}</span>${say(c.h)}`;
  }
  return `<div class="flash"><small class="muted">${st.qi + 1} / ${st.queue.length} · box ${c.box}</small>
    <div class="face">${front}</div>
    ${st.flipped ? `<div class="face back">${back}</div><div class="btns center"><button class="bad" data-act="grade" data-ok="0">✗ Not yet</button><button class="good" data-act="grade" data-ok="1">✓ Got it</button></div>`
    : `<div class="btns center"><button class="primary" data-act="flip">Show answer 看答案 (space)</button></div>`}
  </div>`;
}

let tickTimer = 0;
function tick() {
  clearInterval(tickTimer);
  const update = () => {
    const d = S?.draft; const el = document.getElementById('timer');
    if (!d || !el) return clearInterval(tickTimer);
    const left = d.pausedLeft != null ? d.pausedLeft : d.endsAt - Date.now();
    const s = Math.round(Math.abs(left) / 1000);
    el.textContent = (left < 0 ? '+' : '') + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    el.classList.toggle('over', left < 0);
    el.classList.toggle('soon', left >= 0 && left < 60e3);
    const tot = document.getElementById('total');
    if (tot) tot.textContent = `${Math.round((Date.now() - new Date(d.startedAt).getTime()) / 6e4)} of ${S.settings.minutes} min used`;
    if (left <= 0 && d.pausedLeft == null && !d.rang) {
      d.rang = true; beep(d.phase < 3 ? 2 : 4);
      if (d.phase < 3) { toast(`⏰ Time for: ${PHASES[d.phase + 1].name} ${PHASES[d.phase + 1].zh}`, 4000); goPhase(d.phase + 1); }
      else toast('⏰ Time is up — save the log and say goodbye! 时间到，保存记录。', 5000);
    }
  };
  update(); tickTimer = window.setInterval(update, 500);
}
function goPhase(/** @type {number} */ i) {
  const d = S.draft;
  d.phase = i; d.rang = false; d.pausedLeft = null;
  d.endsAt = Date.now() + d.mins[i] * 6e4;
  save(); render();
}

function saveSession() {
  const d = S.draft, p = partById(d.partId);
  const minutes = Math.max(1, Math.round((Date.now() - new Date(d.startedAt).getTime()) / 6e4));
  const s = { id: 's' + Date.now(), kind: 'live', date: d.startedAt, partId: d.partId, minutes, review: d.review,
    zhNotes: d.zhNotes.trim(), enNotes: d.enNotes.trim(), hwLearner: d.hwLearner.trim(), hwMe: d.hwMe.trim(), hwLearnerDone: false, hwMeDone: false };
  const passed = !p?.checkpoint || cpScore(p, d).passed;
  if (p?.checkpoint) { const sc = cpScore(p, d); /** @type {any} */ (s).check = { right: sc.right, total: sc.total, passed: sc.passed }; }
  S.sessions.push(s);
  if (p) introducePart(p);
  if (d.finished && passed && p) S.done[p.id] = today();
  for (const line of s.enNotes.split('\n').map((x) => x.trim()).filter(Boolean)) addCard('en:' + line, { en: line, zh: '(my correction)', part: d.partId });
  S.draft = null;
  saveNow();
  view.recap = s.id; tab = 'log'; render();
  copy(discordRecap(s, p, S.settings), 'Recap copied');
}

// ── course ──
function renderCourse() {
  if (view.part) {
    const p = partById(view.part);
    if (p) return `<section class="card"><button class="ghost" data-act="back">← All lessons</button>
      <h2><span class="hz">${esc(p.title)}</span> <small>${partLabel(p)} · ${esc(p.titleEn)}</small></h2>
      <p class="muted">${esc(p.focus)} ${S.done[p.id] ? `· ✓ done ${S.done[p.id]}` : ''}</p>
      <div class="btns"><button class="primary" data-act="start" data-id="${p.id}">▶ Start session with this part</button><button data-act="copyCard" data-id="${p.id}">📋 Preview for Discord</button>
      <button data-act="toggleDone" data-id="${p.id}">${S.done[p.id] ? '↺ Mark not done' : '✓ Mark done'}</button></div>
      ${renderPart(p)}</section>`;
  }
  const next = nextPart();
  return `<p class="muted">Path: pinyin first → then characters from strokes and radicals → then the 15 lessons of <i>HSK Standard Course 1</i> (HSK标准教程1). Each box = one 30-min session.
    先学拼音，测试通过再学汉字（笔画→独体字→部首），再学课文。</p>
  ${STAGES.map((st) => {
    const ps = PARTS.filter((p) => p.stage === st.key);
    const locked = isLocked(st.key);
    const lessons = [...new Set(ps.map((p) => p.lesson))];
    return `<h2 class="stage">${locked ? '🔒 ' : ''}${esc(st.name)} <small>${esc(st.zh)} · ${ps.filter((p) => S.done[p.id]).length}/${ps.length}</small></h2>
    <p class="muted">${esc(st.note)}${locked ? ' <b>Locked until the previous test is passed (you can still look). 前一阶段测试通过后解锁。</b>' : ''}</p>
    <div class="lessons ${locked ? 'locked' : ''}">${lessons.map((n) => {
      const lp = ps.filter((p) => p.lesson === n);
      const count = (/** @type {any} */ p) => p.words ? `${p.words.length} words` : p.checkpoint ? '🧪 test' : p.chars ? `${p.chars.length} characters` : `${p.sounds.length} sounds`;
      return `<section class="card lesson"><div class="ln">${st.key === 'hsk' && n === 1 ? '1–2' : n}</div><div><h3 class="hz">${esc(lp[0].title)}</h3><p class="muted">${esc(lp[0].titleEn)}</p>
        <div class="chips">${lp.map((p) => `<button data-act="open" data-id="${p.id}" class="chip ${S.done[p.id] ? 'done' : p === next ? 'next' : ''}">${S.done[p.id] ? '✓' : p === next ? '▶' : '○'} ${st.key === 'hsk' ? 'Part ' + p.part : 'Open'} <small>${count(p)}</small></button>`).join('')}</div></div></section>`;
    }).join('')}</div>`;
  }).join('')}`;
}

// ── review ──
function renderReview() {
  const deck = view.deck || 'zh';
  const st = view.practice;
  const cards = Object.entries(S.cards).filter(([k]) => k.startsWith(deck + ':'));
  const due = dueCards(deck);
  const boxes = [1, 2, 3, 4, 5].map((b) => cards.filter(([, c]) => c.box === b).length);
  return `<div class="seg"><button data-act="deck" data-deck="zh" class="${deck === 'zh' ? 'on' : ''}">🀄 ${esc(S.settings.learner)}'s Chinese words</button><button data-act="deck" data-deck="en" class="${deck === 'en' ? 'on' : ''}">💬 My English phrases 我的英语</button></div>
  ${st ? `<section class="card">${renderFlash(deck, st)}<div class="btns center"><button class="ghost" data-act="endPractice">Done 结束</button></div></section>` : `
  <section class="card"><p>${cards.length} cards · <b>${due.length} due today</b></p>
    <div class="boxes">${boxes.map((n, i) => `<div><b>${n}</b><small>box ${i + 1}${i ? ` · every ${BOX_DAYS[i + 1]}d` : ' · daily'}</small></div>`).join('')}</div>
    <div class="btns"><button class="primary" data-act="practice" ${due.length ? '' : 'disabled'}>▶ Practise ${due.length} due</button>
    <button data-act="practiceAll" ${cards.length ? '' : 'disabled'}>Practise all</button>
    ${deck === 'zh' ? `<button data-act="copyDue">📋 Due words for Discord (self-test)</button>` : ''}</div>
    <p class="tip">${deck === 'zh' ? 'Words are added when a part is taught. ✓ moves a card to the next box (seen less often), ✗ sends it back to box 1.' : 'Phrases from the English half + every correction you write down are added here. Practise them on your own. 自己练习。'}</p>
  </section>
  <section class="card"><table class="tbl"><tr><th></th><th>${deck === 'zh' ? 'Chinese' : 'English'}</th><th>${deck === 'zh' ? 'English' : '中文'}</th><th>box</th><th>next</th></tr>
  ${cards.sort((a, b) => a[1].due.localeCompare(b[1].due)).map(([k, c]) => `<tr><td><button class="spk" data-act="say" ${deck === 'en' ? 'data-lang="en-GB"' : ''} data-text="${esc(deck === 'zh' ? c.h : c.en)}">🔊</button></td>
    <td>${deck === 'zh' ? `<span class="hz">${esc(c.h)}</span> <span class="py">${esc(c.py)}</span>` : esc(c.en)}</td><td>${esc(deck === 'zh' ? c.en : c.zh)}</td><td>${c.box}</td><td>${c.due <= today() ? '<b>today</b>' : c.due}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">No cards yet — they appear after your first session.</td></tr>'}</table></section>`}`;
}

// ── log ──
function renderLog() {
  const st = S.settings;
  const list = [...S.sessions].reverse();
  return `${statRow()}
  <div class="btns"><button data-act="async">✍️ Log async practice</button><button data-act="exportMd">⬇ Export Markdown</button><button data-act="backup">⬇ Backup (JSON)</button><label class="btn">⬆ Restore<input type="file" accept=".json" data-act="restore" hidden></label></div>
  ${browserMode ? "<p class=\"tip\">🌐 Web version: this log lives only in this browser. Back it up now and then. 网页版记录只在本浏览器，记得备份。</p>" : ""}
  ${view.asyncForm ? asyncForm() : ''}
  ${list.map((s) => {
    const p = partById(s.partId);
    const d = new Date(s.date);
    return `<section class="card logitem ${view.recap === s.id ? 'hl' : ''}">
      <div class="lh"><div><b>${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</b>
      <small class="muted"> ${timeIn(st.tzMe, d)} ${esc(shortTz(st.tzMe))} · ${timeIn(st.tzHim, d)} ${esc(shortTz(st.tzHim))}</small></div>
      <div><span class="badge ${s.kind}">${s.kind === 'async' ? 'async 异步' : 'live 上课'}</span> <span class="badge">${s.minutes} min</span></div></div>
      <p>${p ? `<b>${partLabel(p)}</b> <span class="hz">${esc(p.title)}</span>` : '<b>Free practice</b>'}${s.review && (s.review.right || s.review.wrong) ? ` · review ${s.review.right}✓ ${s.review.wrong}✗` : ''}${s.check ? ` · 🧪 test ${s.check.right}/${s.check.total} ${s.check.passed ? '✅ passed' : '❌ not yet'}` : ''}</p>
      ${s.note ? `<p>${esc(s.note)}</p>` : ''}
      ${s.zhNotes ? `<div class="note"><b>🀄 ${esc(st.learner)}'s Chinese:</b><pre>${esc(s.zhNotes)}</pre></div>` : ''}
      ${s.enNotes ? `<div class="note"><b>💬 My English:</b><pre>${esc(s.enNotes)}</pre></div>` : ''}
      ${s.hwLearner ? `<label class="hw"><input type="checkbox" data-act="hw" data-id="${s.id}" data-key="hwLearner" ${s.hwLearnerDone ? 'checked' : ''}> <b>${esc(st.learner)}:</b> ${esc(s.hwLearner)}</label>` : ''}
      ${s.hwMe ? `<label class="hw"><input type="checkbox" data-act="hw" data-id="${s.id}" data-key="hwMe" ${s.hwMeDone ? 'checked' : ''}> <b>${esc(st.teacher)}:</b> ${esc(s.hwMe)}</label>` : ''}
      <div class="btns"><button data-act="copyRecap" data-id="${s.id}">📋 Recap for Discord</button><button class="ghost" data-act="delSession" data-id="${s.id}">🗑 Delete</button></div>
    </section>`;
  }).join('') || '<section class="card"><p class="muted">No sessions yet. Start one from Today. 还没有记录，从"Today"开始第一课。</p></section>'}`;
}

function asyncForm() {
  const p = nextPart();
  return `<section class="card"><h3>✍️ Async practice 异步练习</h3><p class="tip">For weeks you can't meet: voice messages, homework, self-study. It still counts. 没见面也算进度。</p>
    <div class="grid2"><label class="field">Minutes 分钟<input type="number" id="aMin" value="15" min="1"></label>
    <label class="field">Part 课<select id="aPart"><option value="">— free practice —</option>${PARTS.map((x) => `<option value="${x.id}" ${x === p ? 'selected' : ''}>${partLabel(x)} ${x.title}</option>`).join('')}</select></label></div>
    <label class="field">What did you do? 做了什么<textarea id="aNote" rows="2" placeholder="e.g. He sent a voice message reading the dialogue; I replied with corrections."></textarea></label>
    <label class="field">His Chinese mistakes 他的中文问题<textarea id="aZh" rows="2"></textarea></label>
    <label class="field">My English corrections 我的英语纠错<textarea id="aEn" rows="2"></textarea></label>
    <div class="btns"><button class="primary" data-act="saveAsync">Save 保存</button><button class="ghost" data-act="async">Cancel</button></div></section>`;
}

function exportMd() {
  const st = S.settings;
  const L = [`# HSK1 Tandem log — ${st.teacher} & ${st.learner}`, '', `Exported ${new Date().toLocaleString('en-GB')}. Parts done: ${Object.keys(S.done).length}/${PARTS.length}.`, ''];
  for (const s of S.sessions) {
    const p = partById(s.partId);
    L.push(`## ${s.date.slice(0, 10)} · ${s.kind} · ${s.minutes} min · ${p ? `${partLabel(p)} ${p.title}` : 'free practice'}`);
    if (s.note) L.push(s.note);
    if (s.review && (s.review.right || s.review.wrong)) L.push(`- Review: ${s.review.right} right / ${s.review.wrong} wrong`);
    if (s.zhNotes) L.push(`- ${st.learner}'s Chinese:\n${s.zhNotes.split('\n').map((x) => '  - ' + x).join('\n')}`);
    if (s.enNotes) L.push(`- ${st.teacher}'s English:\n${s.enNotes.split('\n').map((x) => '  - ' + x).join('\n')}`);
    if (s.hwLearner) L.push(`- [${s.hwLearnerDone ? 'x' : ' '}] HW ${st.learner}: ${s.hwLearner}`);
    if (s.hwMe) L.push(`- [${s.hwMeDone ? 'x' : ' '}] HW ${st.teacher}: ${s.hwMe}`);
    L.push('');
  }
  download(`hsk1-tandem-log-${today()}.md`, L.join('\n'), 'text/markdown');
}
function download(/** @type {string} */ name, /** @type {string} */ text, type = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ── teacher metrics 教师指标 ──
const shortDate = (/** @type {string|null} */ d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
function renderTeacher() {
  const M = computeMetrics(S, PARTS);
  const cur = nextPart();
  const stName = (/** @type {string} */ k) => STAGES.find((x) => x.key === k);
  const status = (/** @type {any} */ v, /** @type {number} */ t) => v == null ? '<span class="st wait">○ not yet 未开始</span>' : v >= t ? '<span class="st ok">✅ reached 达标</span>' : '<span class="st wait">⏳ in progress 进行中</span>';
  const meter = (/** @type {any} */ v, /** @type {number} */ t) => `<div class="meter"><i style="width:${v == null ? 0 : Math.min(100, (v / t) * 100)}%"></i></div>`;
  const fmt = (/** @type {any} */ v, /** @type {string} */ u) => (v == null ? '—' : v + u);

  // benchmarks per stage
  const bench = M.benchmarks.map((b) => {
    const s = stName(b.stage);
    const allOk = b.items.every((x) => x.value != null && x.value >= x.target);
    const isCur = cur?.stage === b.stage;
    return `<section class="card bench ${isCur ? 'cur' : ''}"><h3>${allOk ? '✅' : isCur ? '▶' : '○'} ${esc(s?.name)} <small>${esc(s?.zh)}</small></h3>
      ${b.items.map((x) => `<div class="bi"><div class="bl"><b>${esc(x.label)}</b><small>${esc(x.zh)}</small></div>
        <div class="bv"><b>${fmt(x.value, x.unit)}</b><small> / ${x.target}${x.unit}</small></div>${meter(x.value, x.target)}${status(x.value, x.target)}</div>`).join('')}</section>`;
  }).join('');

  // mastery: one stacked bar per item type (sequential: darker = better known)
  const mast = TYPES.map((t) => {
    const m = M.mastery[t.key]; const tot = Math.max(1, m.total);
    const seg = (/** @type {number} */ n, /** @type {string} */ cls, /** @type {string} */ lbl) => n ? `<i class="${cls}" style="flex:${n}" title="${lbl}: ${n}"></i>` : '';
    return `<div class="mrow"><div class="ml"><b>${esc(t.name)}</b> <small>${esc(t.zh)}</small></div>
      <div class="mbar">${seg(m.mastered, 'm3', 'mastered 已掌握')}${seg(m.learning, 'm2', 'learning 学习中')}${seg(m.fresh, 'm1', 'new 新学')}${seg(m.notYet, 'm0', 'not taught yet 未学')}</div>
      <div class="mv"><b>${m.mastered}</b>/${m.total} <small>${Math.round((m.mastered / tot) * 100)}%</small></div></div>`;
  }).join('');

  // attendance: last 8 weeks
  const max = Math.max(M.pace.goal, ...M.weeks.map((w) => w.live + w.async), 1);
  const bars = M.weeks.map((w, i) => `<div class="wk" title="Week of ${w.start}: ${w.live} live, ${w.async} async">
      <div class="wcol"><i class="wa" style="height:${(w.async / max) * 100}%"></i><i class="wl" style="height:${(w.live / max) * 100}%"></i></div>
      <small>${i === 7 ? 'this wk' : w.start.slice(5)}</small></div>`).join('');

  const tests = (/** @type {string} */ id, /** @type {string} */ name) => `<p><b>${name}</b>: ${M.tests[/** @type {'P6'|'C6'} */ (id)].length ? M.tests[/** @type {'P6'|'C6'} */ (id)].map((a) => `${a.date.slice(0, 10)} <b>${a.pct}%</b> ${a.passed ? '✅' : '❌'}`).join(' · ') : '<span class="muted">not taken yet 还没考</span>'}</p>`;
  const hwp = (/** @type {{given:number, done:number}} */ h) => h.given ? `<b>${h.done}/${h.given}</b> (${Math.round((h.done / h.given) * 100)}%)` : '—';
  const P = M.pace;
  const paceOk = P.sessionsPerWeek >= P.goal;

  return `<p class="muted">What the teacher should check: is he on track, does he really know the material, and where is he weak. 给老师看的指标：进度、掌握程度、薄弱点。<br>
    <b>Mastered 已掌握</b> = answered right at least twice in a row in review (box ≥ ${MASTERED_BOX}). <button class="ghost" data-act="copyReport">📋 Progress report for Discord</button></p>
  <div class="stats">
    <div><b>${cur ? esc(partLabel(cur)) : '🎉'}</b><span>now at 当前进度</span></div>
    <div><b class="${paceOk ? 'okc' : 'warnc'}">${P.sessionsPerWeek}<small>/${P.goal}</small></b><span>${paceOk ? '✅' : '⚠️'} sessions / week (last 4 wks) 每周上课</span></div>
    <div><b>${shortDate(P.finish)}</b><span>expected finish 预计学完${P.plannedFinish ? ` · plan 计划 ${shortDate(P.plannedFinish)}` : ''}</span></div>
    <div><b>${M.accuracy == null ? '—' : M.accuracy + '%'}</b><span>review accuracy 复习正确率</span></div>
    <div><b>${M.weak.length}</b><span>weak items 薄弱项</span></div>
  </div>
  <h2 class="stage">🎯 Benchmarks 达标标准 <small>each stage must reach these before moving on 每个阶段的目标</small></h2>
  <div class="grid3">${bench}</div>
  <div class="grid2">
    <section class="card"><h3>📚 Mastery 掌握程度</h3>${mast}
      <div class="legend"><span><i class="m3"></i>mastered 已掌握</span><span><i class="m2"></i>learning 学习中</span><span><i class="m1"></i>new 新学</span><span><i class="m0"></i>not taught yet 未学</span></div></section>
    <section class="card"><h3>📅 Sessions per week 每周上课次数</h3>
      <div class="weeks">${bars}<div class="goal" style="bottom:calc(22px + 126px * ${P.goal / max})"><span>goal ${P.goal}/wk</span></div></div>
      <div class="legend"><span><i class="wl"></i>live 上课</span><span><i class="wa"></i>async 异步</span><span><i class="gl"></i>goal 目标</span></div>
      <p>Homework done 作业完成率 — ${esc(S.settings.learner)}: ${hwp(M.hw.learner)} · ${esc(S.settings.teacher)}: ${hwp(M.hw.me)}</p></section>
  </div>
  <div class="grid2">
    <section class="card"><h3>⚠️ Weak spots 最需要复习</h3>
      ${M.weak.length ? `<table class="tbl"><tr><th></th><th>item</th><th>meaning</th><th>✗</th></tr>${M.weak.map((c) => `<tr><td><button class="spk" data-act="say" data-text="${esc(c.h)}">🔊</button></td><td><span class="hz">${esc(c.h)}</span> <span class="py">${esc(c.py)}</span></td><td>${esc(c.en)}</td><td><b>${c.w}</b></td></tr>`).join('')}</table>
      <p class="tip">Put these in the next warm-up, or send them for self-study (Review → 📋). 下次热身先练这些。</p>` : '<p class="muted">Nothing yet — weak items appear after reviews. 复习后这里会显示答错最多的。</p>'}</section>
    <section class="card"><h3>🧪 Tests 测试成绩</h3>
      ${tests('P6', 'Pinyin reading test 拼音认读')}${tests('C6', 'Radical test 部首')}
      <h4>HSK 1 mock tests 模拟考 <small>pass 及格 = ${HSK1_PASS}/200</small></h4>
      ${M.mocks.map((m) => `<p>${esc(m.date)} · listening ${m.listening} + reading ${m.reading} = <b>${m.total}</b> ${m.total >= HSK1_PASS ? '✅ pass' : '❌'} <button class="ghost" data-act="delMock" data-id="${m.id}">🗑</button></p>`).join('') || '<p class="muted">None yet. Do one at the end of the course.</p>'}
      <div class="row mock"><input type="number" id="mL" min="0" max="100" placeholder="listening /100"><input type="number" id="mR" min="0" max="100" placeholder="reading /100"><button data-act="addMock">+ Add</button></div>
      <h4>Your English 你的英语</h4><p>${M.englishCorrections} corrections written down · ${M.mastery.en.mastered} phrases mastered.</p></section>
  </div>`;
}

function addMock() {
  const v = (/** @type {string} */ s) => Math.max(0, Math.min(100, Number(/** @type {HTMLInputElement} */ ($(s)).value) || 0));
  if (!/** @type {HTMLInputElement} */ ($('#mL')).value && !/** @type {HTMLInputElement} */ ($('#mR')).value) return toast('Enter the scores first. 先输入分数。');
  S.mock = [...(S.mock || []), { id: 'm' + Date.now(), date: today(), listening: v('#mL'), reading: v('#mR') }];
  save(); render();
}

function progressReport() {
  const M = computeMetrics(S, PARTS), cur = nextPart();
  const L = [`📊 **Progress report — ${today()}**`, `Now at: ${cur ? partLabel(cur) + ' ' + cur.title : 'finished 🎉'} · ${Object.keys(S.done).length}/${PARTS.length} parts done`,
    `Sessions/week (last 4 wks): ${M.pace.sessionsPerWeek} (goal ${M.pace.goal}) · expected finish: ${M.pace.finish || '—'}`, ''];
  for (const b of M.benchmarks) {
    L.push(`**${STAGES.find((s) => s.key === b.stage)?.name}**`);
    for (const x of b.items) L.push(`${x.value != null && x.value >= x.target ? '✅' : '⏳'} ${x.label}: ${x.value ?? '—'}${x.value != null ? x.unit : ''} / ${x.target}${x.unit}`);
  }
  if (M.weak.length) L.push('', `⚠️ Review these: ${M.weak.map((c) => `${c.h} (${c.py})`).join(', ')}`);
  return L.join('\n').slice(0, 2000);
}

// ── settings ──
function renderSettings() {
  const st = S.settings;
  const f = (/** @type {string} */ k, /** @type {string} */ label, type = 'text') => `<label class="field">${label}<input type="${type}" data-set="${k}" value="${esc(st[k])}"></label>`;
  const h = (/** @type {string} */ k, /** @type {string} */ label) => `<label class="field">${label}<span class="row"><input type="number" min="0" max="24" data-hours="${k}" data-i="0" value="${st[k][0]}"> to <input type="number" min="0" max="24" data-hours="${k}" data-i="1" value="${st[k][1]}"></span></label>`;
  return `<section class="card"><h3>People 人</h3><div class="grid2">${f('teacher', 'Your name 你的名字')}${f('learner', 'Learner\'s name 他的名字')}</div></section>
  <section class="card"><h3>Time zones & chat hours 时区和可聊天时间</h3>
    <div class="grid2">${f('tzMe', 'Your time zone')}${f('tzHim', 'His time zone')}${h('hoursMe', 'Your free hours (24h)')}${h('hoursHim', 'His free hours (24h)')}</div>
    <p class="tip">Time zone names like Asia/Shanghai, Europe/Amsterdam. Summer/winter time is handled automatically (gap 6 or 7 hours).</p></section>
  <section class="card"><h3>Sessions 上课</h3><div class="grid2">
    <label class="field">Minutes per session 每次时长<select data-set="minutes" data-num="1">${[20, 30, 45, 60].map((m) => `<option ${m === st.minutes ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
    <label class="field">Goal: sessions per week 每周目标<select data-set="perWeek" data-num="1">${[1, 2, 3, 4].map((m) => `<option ${m === st.perWeek ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
    <label class="field">Chinese voice speed 中文朗读速度<select data-set="rate" data-num="1">${[0.6, 0.7, 0.8, 0.9, 1].map((m) => `<option ${m === st.rate ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
  </div><div class="btns"><button data-act="say" data-text="你好，我是你的汉语老师。">🔊 Test Chinese voice</button></div></section>
  <section class="card">${browserMode
    ? `<p class="warn">🌐 Web version: your log is saved <b>only in this browser</b> on this device. It is not shared with your partner and is lost if you clear browser data — use <b>Log → ⬇ Backup</b> now and then (and ⬆ Restore on another device).<br>网页版：记录只保存在这个浏览器里，不会同步给对方；请定期在 Log 页面备份。</p>`
    : `<p class="muted">Data file: <code>data\\hsk1-tandem\\state.json</code> (previous version kept as <code>.bak</code>).</p>`}</section>`;
}

// ── stroke order animation (vendor/hanzi-writer.min.js; stroke data comes from the internet) ──
/** @type {Promise<any> | null} */
let writerLib = null;
function loadWriter() {
  writerLib ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'vendor/hanzi-writer.min.js';
    s.onload = () => resolve(/** @type {any} */ (window).HanziWriter);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return writerLib;
}
async function showStrokes(/** @type {string} */ ch) {
  document.getElementById('writer')?.remove();
  const box = document.createElement('div');
  box.id = 'writer';
  box.innerHTML = `<div class="wbox"><div class="wh"><b class="hz">${esc(ch)}</b><span class="muted">stroke order 笔顺</span><button data-act="closeWriter">✕</button></div>
    <div id="wtarget"></div><div class="btns center"><button data-act="say" data-text="${esc(ch)}">🔊</button><button id="wquiz">✏️ Try writing it 自己写</button><button id="wreplay">↻ Replay</button></div><p class="muted" id="wmsg"></p></div>`;
  box.addEventListener('click', (e) => { if (e.target === box) box.remove(); });
  document.body.appendChild(box);
  try {
    const HW = await loadWriter();
    const w = HW.create('wtarget', ch, { width: 240, height: 240, padding: 12, showOutline: true, strokeAnimationSpeed: 0.8, delayBetweenStrokes: 350, strokeColor: '#c0392b', radicalColor: '#2f7d63',
      onLoadCharDataError: () => { const m = document.getElementById('wmsg'); if (m) m.textContent = 'Could not load stroke data (needs internet). 需要联网才能显示笔顺。'; } });
    w.loopCharacterAnimation();
    /** @type {HTMLElement} */ ($('#wreplay')).onclick = () => w.loopCharacterAnimation();
    /** @type {HTMLElement} */ ($('#wquiz')).onclick = () => { w.cancelQuiz?.(); w.hideCharacter(); w.quiz({ onComplete: (/** @type {any} */ r) => { const m = document.getElementById('wmsg'); if (m) m.textContent = `Done! ${r.totalMistakes} mistakes. 完成！`; } }); };
    const m = document.getElementById('wmsg'); if (m) m.textContent = 'Green = radical 部首. Drag with the mouse to try writing.';
  } catch { const m = document.getElementById('wmsg'); if (m) m.textContent = 'Stroke animation could not start.'; }
}

// ───────── events ─────────
document.addEventListener('click', (e) => {
  const el = /** @type {HTMLElement} */ (/** @type {HTMLElement} */ (e.target).closest('[data-act]'));
  if (el?.dataset.act === 'say') return speak(el.dataset.text || '', el.dataset.lang || 'zh-CN');
  if (el?.dataset.act === 'write') return showStrokes(el.dataset.text || '');
  if (el?.dataset.act === 'closeWriter') return document.getElementById('writer')?.remove();
  const tb = /** @type {HTMLElement} */ (/** @type {HTMLElement} */ (e.target).closest('#tabs button'));
  if (tb) { tab = tb.dataset.tab || 'today'; view = { deck: view.deck }; return render(); }
  if (!el || el.tagName === 'INPUT') return;
  const a = el.dataset.act, id = el.dataset.id || '';
  const d = S.draft;
  switch (a) {
    case 'start':
      if (S.draft && !confirm('A session is already running. Replace it? 已有课程在进行，要替换吗？')) return;
      return startSession(id);
    case 'copyCard': { const p = partById(id); if (p) copy(discordLessonCard(p), 'Preview copied'); return; }
    case 'open': tab = 'course'; view = { part: id }; render(); return window.scrollTo(0, 0);
    case 'back': view = {}; return render();
    case 'toggleDone': if (S.done[id]) delete S.done[id]; else { S.done[id] = today(); const p = partById(id); if (p) introducePart(p); } save(); return render();
    case 'phase': return goPhase(Number(el.dataset.i));
    case 'next': return goPhase(d.phase + 1);
    case 'plus': if (d.pausedLeft != null) d.pausedLeft += 6e4; else d.endsAt = Math.max(d.endsAt, Date.now()) + 6e4; d.rang = false; d.mins[d.phase]++; save(); return render();
    case 'pause':
      if (d.pausedLeft != null) { d.endsAt = Date.now() + d.pausedLeft; d.pausedLeft = null; } else d.pausedLeft = d.endsAt - Date.now();
      save(); return render();
    case 'cancel': if (confirm('Stop this session without saving? 不保存直接结束？')) { S.draft = null; save(); render(); } return;
    case 'flip': { const st = d && tab === 'today' ? d : view.practice; st.flipped = true; return render(); }
    case 'grade': {
      const st = d && tab === 'today' ? d : view.practice;
      const ok = el.dataset.ok === '1';
      grade(st.queue[st.qi], ok); ok ? st.review.right++ : st.review.wrong++;
      st.qi++; st.flipped = false; save(); return render();
    }
    case 'saveSession': return saveSession();
    case 'cp': d.check = d.check || {}; d.check[Number(el.dataset.i)] = el.dataset.ok === '1'; save(); return render();
    case 'deck': view.deck = el.dataset.deck; view.practice = null; return render();
    case 'practice': case 'practiceAll': {
      const deck = view.deck || 'zh';
      const keys = a === 'practice' ? dueCards(deck) : Object.keys(S.cards).filter((k) => k.startsWith(deck + ':'));
      view.practice = { queue: keys.sort(() => Math.random() - 0.5), qi: 0, flipped: false, review: { right: 0, wrong: 0 } };
      return render();
    }
    case 'endPractice': view.practice = null; return render();
    case 'copyDue': return copy(discordWordList(dueCards('zh').map((k) => [S.cards[k].h, S.cards[k].py, S.cards[k].en])), 'Word list copied');
    case 'async': view.asyncForm = !view.asyncForm; if (tab !== 'log') tab = 'log'; return render();
    case 'saveAsync': {
      const v = (/** @type {string} */ s) => /** @type {HTMLInputElement} */ ($(s)).value.trim();
      const s = { id: 's' + Date.now(), kind: 'async', date: new Date().toISOString(), partId: v('#aPart'), minutes: Number(v('#aMin')) || 0, note: v('#aNote'), zhNotes: v('#aZh'), enNotes: v('#aEn'), hwLearner: '', hwMe: '' };
      S.sessions.push(s);
      for (const line of s.enNotes.split('\n').map((x) => x.trim()).filter(Boolean)) addCard('en:' + line, { en: line, zh: '(my correction)', part: s.partId });
      view.asyncForm = false; save(); toast('Saved 已保存'); return render();
    }
    case 'copyRecap': { const s = S.sessions.find((/** @type {any} */ x) => x.id === id); if (s) copy(discordRecap(s, partById(s.partId), S.settings), 'Recap copied'); return; }
    case 'delSession': if (confirm('Delete this log entry? It cannot be undone. 删除这条记录？无法恢复。')) { S.sessions = S.sessions.filter((/** @type {any} */ x) => x.id !== id); save(); render(); } return;
    case 'exportMd': return exportMd();
    case 'addMock': return addMock();
    case 'delMock': S.mock = (S.mock || []).filter((/** @type {any} */ m) => m.id !== id); save(); return render();
    case 'copyReport': return copy(progressReport(), 'Report copied');
    case 'backup': { const { rev, ...rest } = S; return download(`hsk1-tandem-backup-${today()}.json`, JSON.stringify(rest, null, 1)); }
  }
});

document.addEventListener('change', async (e) => {
  const el = /** @type {HTMLInputElement} */ (e.target);
  const a = el.dataset.act;
  if (a === 'hidePy' || a === 'hideEn') { view[a] = el.checked; return render(); }
  if (a === 'finished') { S.draft.finished = el.checked; return save(); }
  if (a === 'hw') { const s = S.sessions.find((/** @type {any} */ x) => x.id === el.dataset.id); if (s) { s[el.dataset.key + 'Done'] = el.checked; save(); } return; }
  if (a === 'restore' && el.files?.[0]) {
    try {
      const data = JSON.parse(await el.files[0].text());
      if (!Array.isArray(data.sessions)) throw new Error('not a backup');
      if (!confirm(`Replace ALL current data with this backup (${data.sessions.length} sessions)? 用备份替换全部数据？`)) return;
      S = { ...freshState(), ...data, rev: S.rev }; await saveNow(); render(); toast('Restored 已恢复');
    } catch (err) { alert('Could not read this file: ' + err); }
    return;
  }
  if (el.dataset.set) { S.settings[el.dataset.set] = el.dataset.num ? Number(el.value) : el.value.trim(); save(); renderClocks(); return; }
  if (el.dataset.hours) { const k = el.dataset.hours; S.settings[k] = [...S.settings[k]]; S.settings[k][Number(el.dataset.i)] = Math.max(0, Math.min(24, Number(el.value) || 0)); save(); renderClocks(); }
});

document.addEventListener('input', (e) => {
  const el = /** @type {HTMLTextAreaElement} */ (e.target);
  if (el.dataset.draft && S.draft) { S.draft[el.dataset.draft] = el.value; save(); }
});

document.addEventListener('keydown', (e) => {
  if (/** @type {HTMLElement} */ (e.target).matches('input, textarea, select')) return;
  const flip = document.querySelector('[data-act="flip"]'), good = document.querySelector('[data-act="grade"][data-ok="1"]'), bad = document.querySelector('[data-act="grade"][data-ok="0"]');
  if (e.key === ' ' && flip) { e.preventDefault(); /** @type {HTMLElement} */ (flip).click(); }
  else if ((e.key === 'ArrowRight' || e.key === '1') && good) /** @type {HTMLElement} */ (good).click();
  else if ((e.key === 'ArrowLeft' || e.key === '0') && bad) /** @type {HTMLElement} */ (bad).click();
});

// ───────── start ─────────
renderClocks();
setInterval(renderClocks, 30e3);
load().then(() => { renderClocks(); render(); }).catch((err) => {
  $('#main').innerHTML = `<section class="card"><h3>Cannot reach the server 连不上服务器</h3><p>Start it with <b>start.bat</b> in <code>apps\\hsk1-tandem</code>, then reload. (${esc(err.message)})</p></section>`;
});
