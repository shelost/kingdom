# Next-episode cards + name-overload report — brief for writers

Workspace: /Users/heewon/Documents/GitHub/kingdom. Book: `src/lib/data/story.json` (bilingual EN/KO character drama, Samhan in the 600s plus myth flashbacks). **Do not edit story.json or any source file.** Write only the two output files named in your task.

Read first:
- `.cursor/rules/story-script-style.mdc` — the voice rule. Sections that matter most: "Short and memorable", "Next-episode card", "Narration: the omniscient storyteller", "Suspense", "Intentional: do not flag".
- `scripts/.cache/teaser-pairs.json` — every entry `n`, `title`, the `next` title in reading order, and its current `lastBlock`.
- Read an entry: `node scripts/.cache/dump-entry.mjs "<exact title>" 0 999 4000` (block index, kind, speaker, English).
- `scripts/.cache/audit-names.json` — narration paragraphs with ≥6 distinct proper nouns (`n` = entry index, `entry`, `block`, `names`, `text`).

## Task 1 — next-episode cards

For every entry in your range that has a `next`, write the card that ends it and leads into `next`. Read the end of the current entry and the first half of the next one so the card bridges them.

- Bold manga "next time" energy. 1–3 short sentences, under 25 words in English. Ends on "…!", a question, or a cliffhanger. Template: "The story isn't over yet. The Third Emperor still controls large swaths of Samhan. The final war begins…!"
- Tease the next episode's hook; never spend its reveal (no deaths, outcomes, or mystery-box answers). Muryuk is not named before the "Muryuk" entry. Founding myths (Jumong, Onjo, Hyukgose, Dangun/Joseon) are not explained before their own episode. A flashback or myth gets a jump tease ("To understand this grudge, we have to go back…!").
- Mostly names the reader already knows. At most one new name. No years, no place-name strings, no glosses.
- Korean `ko`: plain narrator register (-다 / -는가 / …!), punchy and natural, not a calque.
- If the current last block is already a teaser-like card (e.g. Pyongyang II's "The story isn't over yet…" which sits mid-entry at block 22), write the polished version and set `"replaceBlock": <index>` so it can be moved to the end.
- Vary the shapes across the run (question, threat, a quoted line from the next episode, a one-word name, a countdown). Don't open every card with "Next time".

Output `scripts/.cache/teasers-<X>.json`:

```json
{ "<exact current title>": { "en": "…", "ko": "…", "replaceBlock": 22 } }
```

(`replaceBlock` only when relevant.)

## Task 2 — name-overload report

For every paragraph in `audit-names.json` whose `n` is in your range, plus any other narration paragraph in your range you find just as clogged (long stacked clauses, office strings, place lists, glosses), write a rewrite under the "Short and memorable" standard: sentences under ~12 words, at most two proper nouns per sentence and three per paragraph, conversational omniscient narrator, same story beat. Skip the deliberate all-caps banner joke in Huangdi block 4 unless the rest of the paragraph is clogged. Don't touch `quote` blocks or the intentional exceptions.

Output `scripts/.cache/voice-report-<X>.md`, one section per entry in reading order:

```
### <Entry title> (#n)
- **b<block>** — names: <count> (<the names>). Why it glazes: <one line>.
  - Before: "<first ~40 words>…"
  - After (EN): "<rewrite>"
  - After (KO): "<rewrite>"
```

End the file with a short list: the 5 worst paragraphs in your range, and any names that should simply never appear in the story (wiki-only).

Final message: one paragraph summary (how many cards, how many rewrites, anything you could not do).
