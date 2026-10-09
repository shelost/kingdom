# Flesh-out brief (October 9)

Heewon, the author of **King for All** (bilingual EN/KO chronicle in `src/lib/data/story.json`), asked:

> flesh out some of the stories. not everything should just be historical, also some character development and emotional
> attachments needed. we need to give the reader a reason to care about these characters in the first place. the euija gyebek
> bond is a good example. it reminds me of the nico robin "i want to live" moment in one piece.
> …let's add scene header titles for location / year changes primarily so the user has context. map or location images for big
> scene changes.

Each writer gets a specific assignment (in their prompt). This file is the shared part.

## What "fleshed out" means here

- Give the reader a reason to care **before** history happens to the person: a want, a fear, a private joke, a promise, a
  relationship with one other person. Then let history cost them something.
- Scenes, not summaries. People talk to each other in rooms (see `.cursor/rules/story-script-style.mdc`: Sorkin × Nolan,
  close people talk in shared context, nobody explains their own subtext). Keep the narrator's sly omniscient voice.
- Read the `voice` note in `src/lib/people.ts` for every speaker before you write their lines. Korean must sound said aloud
  (standard Korean for now; a dialect pass is being planned separately, so don't invent dialect).

## Context headers and pictures

- At every change of place or time, add a `scene` block whose label names the place, and the year or season when it changes:
  `{ "kind": "scene", "label": "Gimhae, the Golden Gaya palace", "ko": "김해, 금관가야 왕궁" }`, or with time:
  `"label": "Surabol · twenty years later"`. Keep them short. Mortal dialogue still never says AD years; a scene header may
  give a year when it helps (`"Geumgwan · 532"`), at most a few per episode.
- At big scene changes, add a picture of the place: a `place` block if the place exists in `src/lib/places.ts`
  (`{ "kind": "place", "place": "<id>", "html": "<one-line sly caption>", "ko": "…" }`) or a `map` block
  (`{ "kind": "map", "year": 532, "places": ["geumgwan", "surabol"], "caption": "…", "ko": "…" }`).
- New characters get an intro `card` the first time they matter: `{ "kind": "card", "person": "<people id>", "caption": "…", "ko": "…" }`.
  Only use people ids that exist in `src/lib/people.ts` (you may add a missing person there if the assignment needs one:
  copy the shape of a nearby entry, no avatar path you have not checked exists in `static/`).

## Mechanics

- **Episode numbers changed**: Jiabeng now comes before Royal Secretariat, and a new episode "Sima Yi" sits after Four Dragons.
  Find entries by chapter id + title, never by a hard-coded index:
  ```js
  import { editStory, lists } from '../story-ops.mjs';
  editStory((story) => {
  	const e = story.find((c) => c.id === 'chunchu-era').entries.find((x) => x.title === 'Muryuk');
  	// find blocks by text fragment; splice to insert / replace / move
  });
  ```
  `editStory` locks, reloads and saves; other writers are editing other episodes at the same time. Write your script at
  `scripts/.cache/rewrite/<slug>.mjs` and keep it idempotent (check a marker before inserting).
- Every `p` has `html` + `ko`; every `dialogue` has `lines[]` (Korean) and `en[]` index for index plus `person` (or `speaker`
  for an unnamed extra). Keep each episode's bold closing card (`<b>…</b>`, under 25 words) and its first-line hook, and keep the
  seams into the neighbouring episodes working.
- Locked: Heewon's opening lines, Kangrim's "were you X, or Y?" ritual at deaths, Bidam's Radiance-tea rant, Euija's "a country is
  a territory governed by a single story", and the exact running line "Pregnant with an unknown man’s child… what a disgrace!"
  (Korean: "누군지도 모를 사내의 아이를 배다니… 이 무슨 망신이냐!"). Historical `quote` blocks are never reworded.
- Images: `images[]` anchor stills by a text fragment (`at`). If you rewrite anchored text, update the `at`. Check with
  `node scripts/.cache/anchor-check.mjs` (no new unmatched anchors in your episodes). Don't generate images. If a new scene badly
  needs stills, list them in `scripts/.cache/rewrite/<slug>-stills.json` as `{ id, entry, at, alt, scene, people?, canon? }`.
- Validate your episodes: find their current numbers (`story.flatMap(c => c.entries).findIndex(...) + 1`) and run
  `node scripts/.cache/audit/full/validate.mjs <first> <last>`.

Reply in under 250 words: what you added per episode (one line per scene), new cards/places/maps, and any stills manifest.
