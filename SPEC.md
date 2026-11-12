# SPEC — HSK1 Tandem

## Goal
Two people 7 hours apart (teacher in China, learner in the Netherlands) finish HSK 1 in ~15 weeks with 2 × 30-min
calls a week, while the teacher improves her/his English. Success after 4 weeks: 4 parts done, ~25 words in review,
every session logged with homework, nobody has to remember "where were we".

## Core loop
1. Day before: copy the lesson preview → Discord.  2. Call: run the 30-min timed session (review → Chinese → English → wrap-up).
3. Save → recap copied to Discord, words/phrases enter spaced review.  4. Between calls: homework + async log.

## Features & acceptance
- F0 Order: pinyin stage → characters (strokes → radicals) → lessons; each foundation stage ends with a test (≥80%) that unlocks the next.
- F1 Course: 39 parts with words (hanzi/pinyin/English), sentences, grammar + Chinese teaching tip, dialogue, homework, English topic. ✔ test checks completeness.
- F2 Session timer: phases sized from session length; auto-advance with a beep; pause / +1 min / jump; survives reload.
- F3 Log: each session stores date (shown in both time zones), minutes, part, review score, his Chinese notes, my English corrections, homework for both with done ticks; export Markdown; backup/restore JSON.
- F4 Review: Leitner boxes (1/2/4/8/16 days) for his Chinese words and my English phrases/corrections.
- F5 Time zones: live clocks, overlap of chat hours, "good time to talk" indicator.
- F6 Discord: preview card, recap, due-word list (spoiler tags), each ≤ 2000 chars.
- F7 Async practice entries count toward weekly goal and streak.
- F9 Teacher metrics: benchmarks per stage (targets + status), mastery by item type, sessions/week vs goal, expected finish, weak spots, tests/mock exams, homework rate.
- F8 Data safety: stale saves rejected (409); previous version kept as .bak.

## Non-goals v1
Online access for the learner, audio recording, handwriting, HSK 2.

## Milestones
- M1 (done 2026-11-09): all of the above.
- Later ideas: HSK 2 content, mock-test tracker, publish a read-only progress page for the learner.
