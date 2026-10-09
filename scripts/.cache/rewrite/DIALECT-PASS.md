# Dialect pass brief

Heewon approved the dialect plan in `scripts/.cache/rewrite/DIALECTS.md` (read it fully first; note Gaya's English is **Welsh
English**, changed by the author). Korean mapping: Baekje 충청 (전라 for southern soldiers), Goguryeo 평안 (함경 for the far north and
Buyeo), Silla Gyeongju 경상, Gaya Gimhae 경남, Tamla 제주어, Jolbon 평북; Tang, Yamato, gods, spirits, Kangrim and the narrator stay
standard. English mapping: Baekje genteel Old South, Silla clipped British RP, Goguryeo light Lowland Scots, Gaya Welsh English,
Tamla Synge-style island Irish, Buyeo/Jolbon old Northern English, Tang formal imperial "We".

Scope (approved): **commoners, soldiers and camp talk get full dialect; leads get light dialect in private and among their own;
everyone speaks standard at court, in formal audiences and to foreign envoys** (diplomats such as Chunchu switch register by room).
Dialect lives in word choice, endings and rhythm, never phonetic spelling, never parody (no 거시기 gags, no "boyo", no "arr").

## How to work

- Edit only `dialogue` blocks (`lines[]` Korean, `en[]` English, index for index) in your episode range. Never touch narration
  (`p`), `quote` records, cards, or titles. A speaker's kingdom comes from `kingdom` on their entry in `src/lib/people.ts`
  (unnamed `speaker` extras: infer from the scene's setting).
- Change Korean and English together so they stay parallel in meaning. Keep each line's length and beat; don't add jokes.
- Locked, leave word for word: Heewon's opening lines; Bidam's Radiance-tea rant; Kangrim's "were you X, or Y?" lines; Euija's
  "a country is a territory governed by a single story"; the running line "Pregnant with an unknown man’s child… what a disgrace!"
  / "누군지도 모를 사내의 아이를 배다니… 이 무슨 망신이냐!" (the line itself stays standard, the lines around it may carry dialect).
- Known fix: Yuri Dora (Tamla storyteller, id `yuridora`) currently speaks Gyeongsang; move her to Jeju speech.
- Images anchor stills by a text fragment (`images[].at`). If you change a line that an `at` quotes, update the `at` to the new
  text. Check with `node scripts/.cache/anchor-check.mjs` (still 45 unmatched, none new).
- Edit through `editStory` from `scripts/.cache/story-ops.mjs` (other writers are doing other ranges at the same time). Find episodes
  by position in `story.flatMap(c => c.entries)` (1-based numbers below are current). Script: `scripts/.cache/rewrite/dialect-<range>.mjs`.
- Validate: `node scripts/.cache/audit/full/validate.mjs <first> <last>` prints ok.

Reply in under 150 words: lines changed per kingdom, three before/after examples (Korean and English), anything you were unsure of.
