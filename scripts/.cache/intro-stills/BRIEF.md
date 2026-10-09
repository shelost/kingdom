# Character intro stills — worker brief

Repo: `/Users/heewon/Documents/GitHub/kingdom` (run every command from there).

Every character card in the chronicle (a `kind: 'card'` block in `src/lib/data/story.json`) gets a 2:1 **intro still**: one character, painted at the exact moment the card appears in the story. You own one slice of cards: `scripts/.cache/intro-stills/slice-<N>.txt` (one card key per line, e.g. `gyebek-boy--prince-euija` = person `gyebek`, look `boy`, episode “Prince Euija”).

## Do not touch

- Do NOT run `--install`, do NOT edit `src/lib/data/story.json`, `src/**`, `static/**`, `build.mjs`, `cards.mjs`, or anyone else's `scenes-*.json`. The parent installs everything at the end.
- Do NOT touch `src/lib/data/image-stars.json`.

## For each key in your slice, in order

1. **Read its context**: `awk "/^### <key> /,/^\$/" scripts/.cache/intro-stills/context.txt`
   It shows the episode, year, the place card before it, the narration and dialogue around the card (`>>> CARD` is the card; `[#hex]` lines are dialogue, the hex is the speaker's colour), and the character's FIRST LINES in that episode.
2. **Write a scene** into your own file `scripts/.cache/intro-stills/scenes-<N>.json` (a JSON object keyed by card key; create it on the first key and keep it valid JSON): `{ "<key>": { "scene": "…", "sword": true? } }`. Study the three approved examples in `scenes-pilot.json` first and match their shape and density (≈90–150 words):
   - Open with `INTRODUCING <NAME>, <who they are in one phrase, from the card caption>.`
   - **Where and when**, from the context: the actual place and moment the card appears (palace gate at dawn, a frontier hall at night, the sky above the Amnok, a riverbank, a ship deck…).
   - **Camera + pose as verbs**: a dramatic angle (low three-quarter, worm's-eye, over-the-shoulder) and what the body is doing right then (leaning forward in a chair, turning in the saddle, kneeling at a well, laughing over a cup…). Never a standing catalogue pose.
   - **Expression that carries their first line**; quote the line (short) if they have one, else the mood of the card caption.
   - **Background = the real place and moment, painted atmospherically, with colour** (sky, cloud, hall smoke, river mist, snow, firelight, lanterns as bokeh). Daylight outdoors stays daylight; open sky is bright sky. Night interiors are dark but smoky and coloured, never a flat black void.
   - **One named key light** from the place (brazier, lamp, sunrise shaft, torch, moon, the sun) raking from the side or below, and the character's hex colour (`#xxxxxx`, the colour of their dialogue chip / canon) in that light.
   - Anyone else in the moment is only an out-of-focus shape or hands at the frame edge, **in period clothing of their own court** (Korean hanbok, Tang, Yamato) — the model otherwise draws a European maid.
   - Coronation cards (the key has a royal look like `-king`, `-queen`, `-emperor`, `-empress`, `-supreme`): stage the moment of taking the crown or the throne.
   - Children stay children and wholesome. River nymphs and bathers: bare shoulders above the water at most.
   - `"sword": true` only when a ring-pommel sword is visible on or in the hands of the character (Korean generals, warriors); prefer sheathed at the hip or hilts over the shoulder. Gyebek, if a blade is drawn, holds it reverse-grip along the forearm. Tang emperors and Tang generals carry a straight Tang jian or a halberd — describe that in the scene and do NOT set `sword`.
   - Gods and myth people get the same painted webtoon treatment; their power shows in light, sky and weather, never a glow aura or halo.
   - Never write text, letters or speech bubbles into the picture (the builder already forbids them).
3. **Build**: `node scripts/.cache/intro-stills/build.mjs <key>` → prints JSON with `sheet` (reference image path, or null) and `prompt` (a text file). The builder adds the house style (painterly webtoon, brushwork, painted atmosphere), the canon look and the face sheet.
4. **Generate**: read the prompt file and call the Cursor image tool — `CallDynamicTool` with `namespace: "cursor"`, `toolName: "GenerateImage"` (check the schema once with `GetDynamicTools`), arguments:
   `{ "description": <the whole prompt file text>, "filename": "<key>.jpg", "aspect_ratio": "16:9", "reference_image_paths": [<sheet>] }` (omit `reference_image_paths` when `sheet` is null). The output lands in `~/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets/<key>.jpg`.
5. **Check the result** and retake at most twice (edit the scene, rebuild, regenerate with the same filename) when:
   - the face is clearly not the character on the sheet, or the wrong age or gender;
   - more than one main person, or the character is cloned;
   - any text, letters or speech bubble;
   - European clothing on anyone;
   - a curved sword, katana or a round hand guard (tsuba) when a sword is in frame;
   - a flat black void behind a daylight or outdoor scene, or a pale washed-out sketch with no contrast;
   - flat cel shading with no visible painted brushwork.
   If a retake fails the same way twice, keep the best take and note it.

Work through the whole slice. Keep going on errors (note them). If `GenerateImage` is unavailable to you at all, stop immediately and say so.

## Report back (final message)

- `done`: keys generated and acceptable.
- `retaken`: keys that needed retakes, and why.
- `issues`: keys still imperfect (what's wrong), or failed.
