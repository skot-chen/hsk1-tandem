// @ts-check
import { partLabel } from './content/lessons.js';
// Text for pasting into Discord (Markdown, max 2000 characters per message).

export const DISCORD_MAX = 2000;

/** @param {string} s */
export function clip(s) {
  return s.length <= DISCORD_MAX ? s : s.slice(0, DISCORD_MAX - 2) + '…';
}

/** Card to send BEFORE a session so the learner can preview (saves live time).
 * @param {import('./content/lessons.js').Part} p */
export function discordLessonCard(p) {
  if (p.stage === 'pinyin' || p.stage === 'hanzi') return foundationCard(p);
  const L = [];
  L.push(`📘 **HSK 1 · ${partLabel(p)}: ${p.title}** (${p.titleEn})`);
  L.push(`_${p.focus}_`);
  L.push('');
  L.push('**New words**');
  for (const [h, py, en] of p.words || []) L.push(`• ${h}  ${py} — ${en}`);
  L.push('');
  L.push('**Key sentences**');
  for (const [h, py, en] of p.sentences || []) L.push(`> ${h}\n> ${py} — *${en}*`);
  L.push('');
  L.push('**Grammar**');
  for (const [t, ex] of p.grammar || []) L.push(`• **${t}**: ${ex}`);
  L.push('');
  L.push('👀 Please read this before our call (5 min). Questions? Ask here!');
  return clip(L.join('\n'));
}

/** Pinyin / character stage preview. @param {import('./content/lessons.js').Part} p */
function foundationCard(p) {
  const L = [`${p.stage === 'pinyin' ? '🔤' : '✍️'} **${partLabel(p)}: ${p.title}** (${p.titleEn})`, `_${p.focus}_`, ''];
  if (p.sounds) { L.push('**Sounds** (example in brackets)'); L.push(p.sounds.map(([label, h, py]) => `${label} (${py} ${h})`).join(' · ')); L.push(''); }
  if (p.drill) { L.push('**Read aloud**'); for (const d of p.drill) L.push(`> ${d}`); L.push(''); }
  if (p.strokes) { L.push('**Strokes**'); L.push(p.strokes.map(([g, name, en]) => `${g} ${name} (${en})`).join(' · ')); L.push(''); }
  if (p.radicals) { L.push('**Radicals**'); for (const [g, name, en, ex] of p.radicals) L.push(`• ${g} ${name} — ${en} (${ex})`); L.push(''); }
  if (p.chars) { L.push('**Characters**'); L.push(p.chars.map(([h, py, en]) => `${h} ${py} ${en}`).join(' · ')); L.push(''); }
  for (const [t, ex] of p.notes || []) L.push(`• **${t}**: ${ex}`);
  if (p.checkpoint) L.push(`\n🧪 **Test day!** ${p.checkpoint.title} — pass ${p.checkpoint.pass * 100}%.`);
  L.push('\n👀 Please look at this before our call.');
  return clip(L.join('\n'));
}

/** Recap to send AFTER a session.
 * @param {any} s session record @param {import('./content/lessons.js').Part | undefined} p
 * @param {{learner:string, teacher:string}} names */
export function discordRecap(s, p, names) {
  const L = [];
  const what = p ? `${partLabel(p)} ${p.title}` : "free practice";
  L.push(`✅ **Session recap — ${s.date.slice(0, 10)}** · ${s.minutes} min · ${what}${s.kind === 'async' ? ' (async)' : ''}`);
  if (s.review && (s.review.right || s.review.wrong)) L.push(`🔁 Word review: ${s.review.right} ✓ / ${s.review.wrong} ✗`);
  if (p) { const items = p.words || p.chars || p.radicals || p.sounds?.map((x) => [x[0]]) || []; L.push(`🆕 New: ${items.map((w) => w[0]).join(' · ')}`); }
  if (s.check) L.push(`🧪 Test: ${s.check.right}/${s.check.total} ${s.check.passed ? '✅ passed!' : '— not yet, we repeat it next time'}`);
  if (s.zhNotes) L.push(`\n**🇨🇳 ${names.learner}'s Chinese — watch out for:**\n${s.zhNotes}`);
  if (s.enNotes) L.push(`\n**🇬🇧 ${names.teacher}'s English — corrections:**\n${s.enNotes}`);
  L.push('\n**📝 Homework before next time**');
  if (s.hwLearner) L.push(`• ${names.learner}: ${s.hwLearner}`);
  if (s.hwMe) L.push(`• ${names.teacher}: ${s.hwMe}`);
  return clip(L.join('\n'));
}

/** Due words for self-study on Discord. @param {string[][]} words [hanzi, pinyin, en] */
export function discordWordList(words) {
  if (!words.length) return 'No words to review today 🎉';
  return clip(['🔁 **Words to review** (cover the Chinese, say it, then check):', ...words.map(([h, py, en]) => `• ||${h} ${py}|| — ${en}`)].join('\n'));
}
