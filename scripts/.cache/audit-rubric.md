# Story voice audit — rubric for readers

The book: `src/lib/data/story.json`, a bilingual (EN/KO) character drama about Samhan (Silla, Baekje, Goguryeo, Gaya, Tang) in the 600s, with myth flashbacks. Read entries with:

    node scripts/.cache/dump-entry.mjs "<exact title>" 0 999 4000

(block index, kind, speaker, English text). Reading order and entry titles: `node scripts/.cache/audit-setups.mjs` (top half). Speaker voice notes: the `voice:` field for each person in `src/lib/people.ts` (rg -n "id: '<id>'" then read nearby). DO NOT EDIT ANY FILE.

## What the author wants

- **Character story, not a chronicle.** The reader doesn't care about kings' numbers, era names, reign lengths, exact fortress names, administrative units, or who allied with whom in which year. Keep only what a character feels, wants, risks, or says.
- **Dialogue like Aaron Sorkin and Christopher Nolan.** Sorkin: fast, overlapping, people interrupting, winning arguments, callbacks, wit under pressure, characters talking *about something else* while the real fight happens underneath. Nolan: withheld information, people speaking in implication, threat and dread carried by what's unsaid, reveals that reframe earlier scenes.
- **Narrator = third-person omniscient, conversational, speaks to the reader** ("You'd think a man with four mountains of his own would be content. You'd be wrong."). Warm, sly, a little amused, knows how everything ends and teases it. Implied to be Hwanin (the old sky god, grandfather of Dangun) — never named, never stated, but he talks like someone who watched it all from above, has favourites, has seen this pattern before. Not monotone, not encyclopedic.
- **Suspense craft.** Chekhov's gun (plant an object/fact early, fire it later). JJ Abrams mystery box (show a question, withhold the answer, open it later). Dramatic irony. Earned reputations (enemy soldiers screaming "IT'S KIM YUSHIN!" at a white horse on a ridge; Gyebek's name growing battle by battle).
  - Example the author wants: Muryuk appears in "The Severing" only as an unnamed Gaya prince in a cone helmet watching the Baekje king die; only in the later "Muryuk" entry does the reader learn who he was.
  - Founding myths (Jumong, Onjo, Hyukgose, Dangun/Joseon) should be hinted at repeatedly (a phrase, a relic, an insult, "we're both Buyeo blood") and only explained when the myth episode is finally told.

## Your job

For every entry in your range, read the whole thing. Then report the **worst offenders**, ranked, using these tags:

- `TEXTBOOK` — narration that reads like a history book (dates, king numbers, reign lengths, territory lists, offices, place-name strings, Korean/hanja glosses in parentheses).
- `EXPO-DIALOGUE` — characters telling each other things both already know, reciting history, explaining the theme, or delivering essays.
- `PREACHY` — a speech or narration that states the moral/meaning; decoder paragraph after a beat.
- `REDUNDANT` — the same event told twice or three times (narration + dialogue + quote record).
- `FLAT-NARRATOR` — monotone, list-like narration with no attitude toward the reader.
- `SPOILED-BOX` — reveals now what should be a mystery paid off later (or explains a myth before its episode).
- `MISSED-GUN` — a place where a setup/foreshadow should be planted, or a payoff that lands without setup.
- `GOOD` — call out 1–3 passages that already work (so the rewrite keeps them).

For each offender give: entry title, block index, the offending text (≤40 words, verbatim), the tag, one sentence on why it's dead on the page, and a **concrete rewrite** in English (narration in the conversational omniscient voice, or dialogue in Sorkin/Nolan grammar that still matches the speaker's `voice` note). Rewrites must be short and actually better — show, don't summarise. Don't touch blocks of kind `quote` text (those are verbatim historical records), but you may flag that a quote block is redundant or should move to a footnote/wiki.

Finish with:
1. **Top 5 worst entries in your range** (one line each: why).
2. **Setup/payoff opportunities** in your range: what to plant here, what it pays off later (or what later payoff needs a plant here).
3. **Cut list**: entries or block runs that should become wiki material instead of story.

Keep the report under ~1800 words. Quote exactly; cite block indices.
