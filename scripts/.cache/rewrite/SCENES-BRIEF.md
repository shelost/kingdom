# Scenes pass — shared brief (Oct 9)

Repo: `/Users/heewon/Documents/GitHub/kingdom`. Run every command from the repo root.

## Rules you must read first

1. `.cursor/rules/story-script-style.mdc` — the house voice. Follow it exactly.
2. The `voice` note in `src/lib/people.ts` for everyone who speaks in your scenes.
3. `scripts/.cache/rewrite/DIALECTS.md` — a dialect pass just finished. New commoner and soldier lines carry their kingdom's dialect (Baekje 충청 / rural English, Goguryeo 평안 / Scots-Northern, Silla 경상 / its English parallel, Gaya 경남 / Welsh English, Tamla 제주어). Leads speak dialect lightly in private and standard at court. Envoys and foreign courts stay standard.

## How to edit story.json

- Other agents edit `src/lib/data/story.json` at the same time. **Never** write it with `fs.writeFileSync` directly. Write an idempotent script `scripts/.cache/rewrite/<your-name>.mjs` that uses `editStory(fn)` from `scripts/.cache/story-ops.mjs` (it locks, reloads, mutates, saves). Find blocks by their text, not by index, since indexes shift under you.
- Every `p` has `html` (EN) + `ko`. Every `dialogue` has `lines` (Korean) + `en`, index for index, plus `person` (a people.ts id) or `speaker` for unnamed extras. Every episode still ends on its bold next-episode card.
- If you rewrite a block that an image's `at` anchors to, update that image's `at` too (images live in `entry.images[]`).
- Do not touch `src/lib/episodeDirectory.ts`. Do not commit. Do not touch anyone else's episodes.
- New people: add them to `src/lib/people.ts` (id, name, korean, gender, kingdom, voice, tagline). No avatar is fine.
- Gotaso is 16: never sexualize her. Don't put song lyrics in.

## What the user asked for (applies to every episode you touch)

- **Fleshed-out scenes, not summaries.** Big moments get a real scene: a `scene` header (`{kind:'scene', label, ko}`) when the place or year changes, an establishing beat, then people in it.
- **Battles open in medias res.** Example from the user: the Muryuk episode's ford scene becomes "The Battle of Golden Gaya". It starts with a large establishing shot of a raging battle (a wide still), more battle stills, and shouted fragments from soldiers, so the reader knows at once they've been dropped into the middle of a real battle. Only after that does the camera find the main characters.
- **Natural transitions.** Scenes hand off to each other: a sound carries over, a callback, a cut on an object, a "meanwhile", someone walking from one room into the next. No abrupt jumps.
- **Variety in conversation.** The current script leans on one shape: someone asks a question and the other answers with a lecture or an iconic quote. Break that. Mix in:
  - banter and teasing that goes nowhere useful;
  - an argument somebody actually wins, or loses badly;
  - interruptions, people talking past each other, two conversations at once;
  - a question answered with an action, a silence, or a change of subject;
  - bargaining, with something given and something taken;
  - a joke that lands wrong;
  - overheard talk, crowd chatter, soldiers' gossip;
  - a child asking something and getting a non-answer;
  - a speech that gets cut off before its point.
  At most one quotable line per scene. Most lines should sound like nothing anyone would quote.
- **Crossovers (MCU-style easter eggs).** A character glimpsed unnamed in one episode and revealed in their own. Keep mystery boxes shut: before episode 43 (Seung), Muryuk is never named. Speaker id stays `muryuk` with `look: 'unnamed'`, and text says "a Silla general" or "a general with a Gaya accent".

## Stills (the character intro-card style)

The user loves the intro-card stills (`static/intro/*.jpg`). New stills use that same painted-webtoon look through `scripts/.cache/scene-stills/build.mjs`.

1. Write your stills into `scripts/.cache/scene-stills/<your-group>.json`: an array of `{ "id", "entry": "<exact entry title>", "at": "<a fragment of the EN text of the block the still sits beside>", "alt", "scene", "people": [ids or "id:look"], "with"?: ["place:<id>", "dress:<kingdom>"], "sword"?: true, "battle"?: true, "year"?: n }`.
   - `scene` is 70–140 words: shot size and angle, where and when, what bodies are doing (verbs), expressions, one named key light from the place, the speaker's hex as real light (never a glow). Battle establishing shots are wide: massed armies as painted shapes in smoke and haze, banners in kingdom colours. Canon places: hwangsan daeya ansi surabol sabi pyongyang steam_cavern wirye cheomseongdae underworld radiance pyongyang_fortress changan amnok jumong_cave. Other places: describe them in words.
   - Ids are kebab-case and start with your group name.
   - Aim for 6–15 stills: the establishing shots, the big beats, and the emotional turns of the new material.
2. `node scripts/.cache/scene-stills/build.mjs prompts <group>` builds a prompt file and a ref sheet per still. It prints `placeholder: true` when a named person has no portrait.
3. `node scripts/.cache/scene-stills/build.mjs slots <group>` adds the image slots to the entries (locked write). **Placeholders stay placeholders: do not generate them.** Their slot carries the prompt for later.
4. For every non-placeholder still (`build.mjs todo <group>` lists them), call the Cursor image tool. Check the schema once with `GetDynamicTools` (namespace `cursor`, toolName `GenerateImage`). Then call `CallDynamicTool` with `namespace: "cursor"`, `toolName: "GenerateImage"`, and arguments `{ "description": <the whole prompt file text>, "filename": "<id>.jpg", "aspect_ratio": "16:9", "reference_image_paths": [<sheet>] }`. Omit refs when `sheet` is null.
   - Check each result. Retake at most twice when: the face is wrong; someone is cloned; there's any text; anyone is in European dress; there's a katana or tsuba; or it's a flat black void or a washed-out sketch.
5. `node scripts/.cache/scene-stills/build.mjs install <group>` crops the images into `static/temp/` and sets `tempImage`.

## Before you finish

- `node scripts/.cache/audit/full/validate.mjs <lo> <hi>` for your episodes must print ok.
- `node scripts/.cache/anchor-check.mjs` must stay at or under 45 unmatched.
- Report back: what changed per episode (two or three lines each), the stills (generated / placeholder), and anything you were unsure of.
