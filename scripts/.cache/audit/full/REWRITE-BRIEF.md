# Rewrite brief (October 8, 2026)

You are one of eleven writers revising **King for All**, a 98-episode bilingual chronicle in `src/lib/data/story.json`.
Each writer owns a range of episodes and edits **only those entries**. The other writers are editing the same file at the
same time, so follow the mechanics section exactly.

## What Heewon asked for (verbatim intent)

1. **Fix the issues the audit listed.** Your fixes are in `scripts/.cache/audit/full/report-N.json` (per-episode `fixes`, plus the
   arc's `top_problems`, `dropped_threads`, `handoffs`) and the matching parts of `AUDIT.md` (priority fixes, per-arc notes,
   the continuity list). Discarded findings in `AUDIT.md` stay discarded.
2. **Every episode is its own self-contained story**: a start (a hook and a want), a development (an obstacle, a cost), a climax (a turn played out
   line by line, not summarised), and a semi-resolution or a cliffhanger. A reader who opens only this episode should get a
   whole story. If an episode has no climax, build one from material already in it, or move a beat into it from an adjacent
   episode **in your own range**.
3. **Transitions and lead-ins.** Each episode's first line picks up the previous episode's closing card. Every flashback and
   myth needs a lead-in **inside the present-day story** and a reason to be told now: a character feels the lack, asks, or
   laments, and the past answers it. The narrator can then take the jump, but a mouth or a want must open the door.
4. **First and last lines are graded** (`lines-grades.json`, the `before` grades). Raise every C, D or F in your range to an A or B. Never touch the
   locked lines below.

## Locked: never change these words

Heewon's handwritten opening lines (block 0 of their episodes), word for word:
"A Queen? Ridiculous." (#1) · "Satek. Yunbi. Jinmo. Mokli. Hae. Baek. Guk. Ahn." (#5) · "A young girl is going to do what she’s going to do." (#12) ·
"There was only one man Euija knew he could trust to deliver." (#19) · "The sad thing about betrayal… is that it never comes from your enemies." (#20) ·
"A man is measured by his self-control." (#22) · "Kim Yushin — a name that strikes fear in all of Samhan. Maybe this is why." (#27).
Also #86's closing card ("The story isn’t over yet. The Third Emperor still controls large swaths of Samhan. The final war begins…!").
Also the intentional exceptions in `.cursor/rules/story-script-style.mdc`: Bidam's rant at the Radiance tea, Kangrim's
"were you X, or Y?", and Euija's "A country is a territory governed by a single story". `nation-baekje` is an intentional chorus voice.
Historical `quote` blocks are verbatim: you may **move or cut** a quote (one per event at most), never reword it.

## House rules (read the full rule file once: `.cursor/rules/story-script-style.mdc`)

- Read the `voice` note in `src/lib/people.ts` for every speaker before writing their lines.
- Every new or rewritten `p` has `html` (EN) + `ko`; every `dialogue` has `lines[]` (Korean) and `en[]` (English) index for index, plus `person`.
  Korean must sound said aloud, with the register from the voice note.
- No AD/CE years in mortal dialogue. The narration may give a year at most once per entry. No regnal numbers, no hanja glosses in parentheses, no office strings after a name.
- Narrator: the implied Hwanin. Sly, warm, talking to "you". Most sentences under 12 words. Name budget: two proper nouns per sentence, three per paragraph.
- Close every episode with the bold next-episode card: a final `p` whose `html` and `ko` are each wrapped whole in `<b>…</b>`.
  It must be under 25 words, end on "…!" or a question, spend no reveal, and set up the next episode's first line.
- Don't open mystery boxes early (Muryuk before #43, Jumong/the Holy King before #37, Onjo before #67, Hyukgose/the Six Elders before #53, Dangun/Joseon before #88).
  #20's Muryuk dialogue uses `look: "unnamed"` (shows "Gaya Prince"); keep that on any Muryuk block before #43.
- Dialogue is a scene, not a caption (Sorkin × Nolan). Interruptions, wants, callbacks. Records (`quote`) are seasoning: aim for under 20% of an episode's words.
- Length sweet spot is 2,000–3,500 words. Stubs (under 800) should grow into scenes; bloated episodes (over 4,000) should be cut.
- Dead characters don't speak later unless inside `kind: "flashback"`. Ages come from `people.ts` `born`.

## Continuity decisions (apply them in your range)

- **Seungman (Queen Jinduk) is Sunduk's cousin**, not her sister. Fix #1 [30] and #40 [27].
- **Forty fortresses:** in the present day (#28), Yushin is fighting *back* after Baekje (Euija) took the forty-odd Silla fortresses in #26. #28 must not say Yushin took them.
- **Kangrim is not "heaven's messenger"** (#62 [1]: "Heaven did not send him"). Fix #72 [116].
- **Gyebek's duty line:** #72 must echo #4's "I gave my word", not "I will complete my duty".
- **Jinheung is Sunduk's great-grandfather** (Jinheung → Dongnyun → Jinpyeong → Sunduk). Heewon said "grandfather" in passing; say "her great-grandfather" or "the Cloud King" in the text.
- #21's opening cavern flashback duplicates #45's cavern telling. #21 keeps at most a one-paragraph allusion; #45 owns it.

## Heewon's lead-ins (these are requirements, by owner)

- **#2 → #3 Jinheung:** Sunduk is the new queen, so the court harks back to the golden reign of her great-grandfather the Cloud King. Someone at court (or the queen herself) invokes him; the jump follows.
- **#5 → #6 Gunchogo:** all Baekje longs for the golden age of the thirteenth king. **Euija** leads into the narration by lamenting that the Baekje nation needs a new story to rally around (this plants his later "a country is a territory governed by a single story" in #19 without stealing it).
- **#8 → #9 Gwanggaeto:** **Gesomun** (still Yeon) laments the appeasement policy of the king and the Summit and longs for Goguryeo's glory days.
- **#36 → #37–39 Jumong:** Goguryeo just barely survived a full invasion by the greatest emperor. Recount how it all began. #37–39 must resolve who the "Holy King" and "Jumong" are and **why Yodong gives him a bride** (the shrine bride in #32). Close that loop at the end of #39 with a short return to Yodong/Goguryeo before the card to Surabol.
- **#40–46 Bidam's rebellion — new day split:**
  - **#40 Gi** = before the rebellion, ending on **Day 1**. Move Day 1 from #42 into the end of #40. Yumjong's offhand Gaya jab at Yushin stays here, and **Bidam leads into #41 Suro**, telling the reader what Gaya even is.
  - **#41 Suro** (myth) ends by returning to the siege on **Day 2**.
  - **#42 Seung** = **Days 2–5**. It ends on Day 5 with **Bidam confronting Yushin about his heritage**. Yushin, reluctant at first, reveals who his grandfather was, and that he was the one who led the Severing. That is the door to #43.
  - **#43 Muryuk** (flashback) returns to the siege at **Day 6**.
  - **#44 Jeon** = **Days 6–8**. The father-and-grandfather ghost scene leaves Day 7 here and moves to Day 9 in #46. #44 ends on Day 8 with Yushin deciding to go down to the cavern, which opens #45.
  - **#45 Seohyun** is told just before the final reckoning with Yushin's identity. Its card sends us to Day 9 at the cavern lake.
  - **#46 Gyeol** = **Days 9–10**. Day 9: Yushin at the cavern meets his father's and grandfather's ghosts (both stories now told), then the final duel with Bidam. Fix Bidam dying twice ([14] dies, [28] speaks, [29] falls).
  - Keep `kind: "day"` headers (`{"kind":"day","label":"DAY 2","ko":"둘째 날"}`), and keep the ten-day grain clock and the 108 score consistent.
- **#41 Suro:** Yumjong mentions Yushin's Gaya heritage in passing (#40), and Bidam leads into it, giving the reader context: what Gaya was.
- **#43 Muryuk:** see #42 above. Yushin reveals it reluctantly on Day 5.
- **#51/#52 → #53 Hyukgose:** Silla has just elected its most powerful king yet. He will bring a new era, he is adopting Western (Tang) customs, and he is about to unite Samhan. Recount how Silla began. #53 must also resolve what Bidam meant when he said he is of the bloodline of the "Six Elders", and why blood and aristocracy matter so much in Silla. #52 Jahee sits between #51 and #53: end #52 by returning to the coronation year (the elders' descendants muttering at Tang robes) so the lead-in lands.
- **#66 → #67 Onjo:** Euija is going off the rails, and people are starting to doubt whether Baekje will survive. That makes it a good time to tell how it all began, and to resolve the offhand mentions that Goguryeo and Baekje are blood kin, brothers and rivals.
- Other flashbacks and myths in your range (#14, #20, #27, #33, #35, #50, #52, #57–63 Tamla tales, #71, #82, #88…) need the same: a present-day want that opens the door.

## Mechanics (do exactly this)

1. Read: this brief, your `report-N.json`, the `AUDIT.md` sections for your arc, `lines-grades.json`, `lines.txt`, your episodes' dumps in
   `ep/NN-*.txt` (regenerate with `node scripts/.cache/audit/full-dump.cjs` if stale), plus the episode on either side of your range, for the seams.
2. Write a patch script at `scripts/.cache/rewrite/<your-slug>.mjs`. Edit through the locked helper only:
   ```js
   import { editStory, lists, find } from '../story-ops.mjs';
   editStory((story) => {
   	const ep = (n) => story.flatMap((c) => c.entries)[n - 1]; // episode numbers are stable; never add, remove or reorder entries
   	const e = ep(42);
   	// find blocks by text fragment (find(e, 'fragment')), not by stale index; splice to move/insert/delete
   });
   ```
   `editStory` takes a lock, reloads the file fresh, runs your function and saves atomically. Never call `saveStory` directly or keep a
   story object across calls. Keep each `editStory` call short (no network, no long loops); several small calls are fine.
   Make the script idempotent or run it once (check for a marker before inserting).
3. Do not change entry `title`, the order of entries, `src/lib/episodeDirectory.ts`, or any code. Don't add new people to `people.ts`.
   You may add a `look` to a block if a stage exists. You may update an entry's `logline`/`subtitle` if the story changed.
4. **Images:** do not generate stills. Entries have `images[]` whose `at` is a text fragment that anchors the still. If you rewrite or
   move the anchored text, update that image's `at` to a fragment of the new text. If you delete the beat entirely, set `at` to the
   nearest surviving beat. Check with `node scripts/.cache/anchor-check.mjs` and compare against `scripts/.cache/audit/full/anchors-baseline.txt`:
   you must add **no new** unmatched anchors in your range (fixing old ones in your range is welcome).
5. Validate: `node scripts/.cache/audit/full/validate.mjs <first> <last>` must print `ok`.
6. Report: write `scripts/.cache/rewrite/<your-slug>-notes.md` with, per episode: what changed (one line each), the new first line,
   the new closing card, its word count, and any fix you deliberately skipped and why. Your final message should be that summary
   in under 300 words.

Do not commit. Do not touch other writers' episodes. If a fix needs a change outside your range, write it in your notes instead.
