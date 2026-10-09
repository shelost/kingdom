# Battle map brief

Heewon (the author of **King for All**, a bilingual chronicle of the Three Kingdoms of Korea in
`src/lib/data/story.json`) asked for: "more maps to the battle scenes based on historical records so it is
accurate and more engaging, with lines and arrows and maybe moving dots to represent troops … currently i
have no idea how each battle is panning out as i read them."

You research and draw specific battles. Each battle is one JSON file read by `src/lib/components/BattleMap.svelte`.

## The format (read these first)

- Types: `src/lib/battles.ts` (Battle, Terrain, UnitState, BattlePhase, arrows, events). Read the whole file.
- The worked example: `src/lib/data/battles/hwangsan.json` (Yellow Mountain, 660), plus its insertion plan
  `scripts/.cache/battles/plan-hwangsan.json`. Match its density, its caption voice and its honesty note.
- **The field** is a local sheet 1000 wide × 560 tall, x east, y south. North is up. Pick a `scale` (`{ km, px }`)
  that fits the real ground: a siege of one city might be 2 km per 200 px; a campaign like the Salsu may be 20 km per 200 px.
- **One dot = 1,000 men, everywhere** (`MEN_PER_DOT`). Give unit strengths in thousands (`men: 15000`), so the dots add up
  to the recorded totals. A unit under 1,000 still shows one dot; keep those rare and say so.
- **Unrecorded strength:** set `"unrecorded": true` on the unit (in `units`, not the phase) when no record gives its size.
  Its `men` then only sets how many stand-in dots it gets; they draw hollow, its label reads "size unknown", and the
  legend leaves it out of the side's total. Never write "(size unknown)" into names.
- Units keep their `id` across phases. The dots glide from one phase's position to the next, so plan positions as
  movement. A unit absent from a phase is off the map. `men` going down = casualties fading out; `men: 0` = destroyed.
  `routed: true` loosens and dims the dots. `facing` points the front (0 east, 90 south, 180 west, 270 north).
  Shapes: `block` (default), `line` (wide, shallow), `column` (marching), `wedge`, `ring` (siege; `r` radius, `arc`),
  `scatter`, `fleet` (looser block for ships' crews).
- Arrows per phase: `advance`, `charge`, `flank`, `naval`, `retreat`, `pursuit`, `feint`. Events: `clash`, `fire`,
  `death`, `gate`, `flood`, `surrender`, `ambush`. Keep labels short (2–5 words), never duplicate a name that an arrow
  label already shows, and use `labelAt` on terrain to move a name off the action.
- Terrain: `sea`, `lake`, `marsh`, `forest`, `plain`, `town` (closed point lists, smoothed); `river`, `road`, `ridge`,
  `wall` (open point lists); `hill`, `mountain`, `fort`, `city`, `camp`, `gate`, `shrine`, `label` (points). Draw the
  real geography in simplified form: the river's real course and bends, the coast, the ridge the camps stood on.
- Sides: use `kingdom` (silla, baekje, goguryeo, tang, gaya, yamato, buyeo…) for the house colours. Sides with no
  kingdom (Sui, Cao Wei, Wa, Mohe) set `color` (Sui `#7c5c3a`, Wei `#5b6b8c`, Wa `#c2185b`, Mohe `#4d7c6f`).
- 4–8 phases. Every phase has `label`/`ko` and `caption`/`captionKo`: 1–3 short sentences in the book's narrator voice
  (sly, plain, present tense, under ~45 words, no AD years in mouths, Korean that sounds natural). The caption says what
  moves and why it matters; the map shows where.
- `sources`: the primary records you used, by book and chapter (Samguk Sagi, Samguk Yusa, Book of Sui, Old/New Book of
  Tang, Zizhi Tongjian, Nihon Shoki, Gwanggaeto Stele, Records of the Three Kingdoms…). `note`/`noteKo`: what the
  records do **not** say (splits between units, exact sites, unrecorded losses) and which identification you followed.

## Accuracy

- Research with web search: primary-record translations and summaries, Korean encyclopedia entries (한국민족문화대백과사전,
  나무위키 as a pointer only, never as the authority), and modern site identifications. Totals, commanders, dates, the
  order of moves and the outcome come from the records. Where records disagree, follow the one the story follows and
  mention the other in `note`.
- Do not invent casualty numbers. Hold a strength constant until the records give a figure; when only a final figure
  exists (e.g. "36,800 surrendered"), apply it in the phase where it happened.

## Fit the story

- Read the episode(s) the battle appears in (dump: `node scripts/.cache/audit/full-dump.cjs`, then
  `scripts/.cache/audit/full/ep/NN-*.txt`, or read story.json directly). Phases must line up with the story's beats and
  use the story's names for people and places (e.g. "the Blue Dragon" is Li Shiji in this book; check `src/lib/people.ts`).
  Where the story compresses or bends the record, follow the story's beats and say so in `note`.
- Don't spoil a later episode in a caption. Mystery boxes stay shut (no Muryuk name before #43, no Jumong/Holy King
  explanation before #37).

## Insert into the story

1. Write `scripts/.cache/battles/plan-<id>.json`: `[{ "episode": N, "battle": "<id>", "phase": "<phaseId>", "after": { "kind": "p|dialogue|…", "text": "<exact English fragment of the anchor block>" } }]`.
   Place one map at the first beat where the battle begins (usually the first phase), then one per major turn: 2–5
   per battle, at the paragraph that narrates that phase. Do not put two maps back to back.
2. Run `node scripts/.cache/battles/insert.mjs scripts/.cache/battles/plan-<id>.json` (it uses the locked story writer;
   other writers are editing at the same time, so never write story.json any other way).
3. If an older `formation` block now says less than your map, leave it; the author can decide.

## Check

- `node scripts/.cache/battles/validate.mjs <id>` must print `ok`.
- `node scripts/.cache/audit/full/validate.mjs <first> <last>` for your episodes must still print `ok`.
- Do not edit `BattleMap.svelte`, `battles.ts` or other code. If the format can't express something important, say so in
  your final message.

Reply with: per battle, the phases (one line each), the recorded totals you used, the sources, and anything uncertain.
