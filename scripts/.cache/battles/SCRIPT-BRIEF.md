# Script ↔ map brief (battles)

The author of **King for All** (`src/lib/data/story.json`, bilingual EN/KO) asked: "match the script with the troop movements
and maps, with people reacting to the movements, etc." and "there are too many subtitles and text" on the maps.

## How the maps work now

- Every in-script `{"kind":"battle","battle":"<id>","phase":"<phaseId>"}` block is a **scene**: a wide 3D map that marches from
  the previous phase into this one, with only commander portraits, event icons and a phase name. **No caption is shown.** So the
  script around the block is now the only thing that tells the reader what is moving and why.
- At the end of the last episode of each battle there is now a `{"kind":"battle","battle":"<id>","full":true}` block: the whole
  battle with play controls and the phase captions. Leave those where they are.
- Phase data: `src/lib/data/battles/<id>.json` (units, positions, arrows, events, captions). Read the phases your scenes show.

## What to do, for each in-script battle block in your episodes

1. Read the phase it shows (and the phase before it: the scene animates from that one). Note what moves: which side, which
   direction, what is surrounded, what burns, who falls.
2. Make the 1–3 blocks just before the map **set up that movement in the story's voice**, and the 1–3 just after it show
   **a person reacting to it**: a lookout calling the dust on the north road, a commander counting the gap, a soldier seeing the
   fire reach the granary, a king watching from the wall. Use the people already in the scene (read their `voice` in
   `src/lib/people.ts`). Short. Spoken. Sorkin × Nolan, per `.cursor/rules/story-script-style.mdc`.
3. Direction words must agree with the map (north is up; the map's left is west). If the text contradicts the records-based map
   (wrong side of the river, wrong road), fix the text. If the map contradicts the story on something the story deliberately
   invents (a duel, a ghost), leave both.
4. Keep it lean: typically **one** new or rewritten narration line and **one** reaction line per map, more only at a climax. Cut
   any existing sentence that now repeats what the map shows (troop counts, "the left wing moves to…"). Never paste a phase
   caption into the text.
5. If two maps in a row show nearly the same thing, delete the weaker block. If a big movement has no map, you may add one
   (`{"kind":"battle","battle":"<id>","phase":"<phaseId>"}`) after the line that narrates it. No two maps back to back.

## Rules

- Every `p` has `html` + `ko`; every `dialogue` has `lines[]` (Korean) and `en[]` index for index, plus `person`. Korean sounds said.
- No AD years in mortal dialogue. No spoilers of later episodes. Mystery boxes stay shut (no Muryuk name before #43).
- Heewon's locked lines and Kangrim's "were you X, or Y?" stay word for word. Historical `quote` blocks are never reworded.
- Edit `story.json` only through `editStory` from `scripts/.cache/story-ops.mjs` (other writers are editing at the same time):
  ```js
  import { editStory, lists } from '../story-ops.mjs';
  editStory((story) => { const e = story.flatMap((c) => c.entries)[N - 1]; /* find blocks by text, splice */ });
  ```
  Write your script at `scripts/.cache/battles/script-<slug>.mjs`.
- Images: entries have `images[]` whose `at` is a text fragment. If you rewrite an anchored sentence, update its `at`.
  Check with `node scripts/.cache/anchor-check.mjs` (no new unmatched anchors in your episodes).
- Validate: `node scripts/.cache/audit/full/validate.mjs <first> <last>` and `node scripts/.cache/battles/validate.mjs` print ok.
- Don't edit code. You may fix a phase's `caption`/`captionKo` in the battle JSON if it no longer matches the text.

Reply in under 200 words: per battle, how many maps you aligned, and one example reaction line.
