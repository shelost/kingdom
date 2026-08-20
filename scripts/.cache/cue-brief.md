# Image-cue audit brief (per-chapter subagent)

Repo: /Users/heewon/Documents/GitHub/kingdom — SvelteKit chronicle of the Three Kingdoms of Korea.
Story data: `src/lib/data/story.json` — an array of chapters; each chapter has `entries`; each entry has `images` (ImageSlot[]) and `blocks` (prose/dialogue).

**You must NOT edit any repo file.** Your only output is ONE proposal JSON file (path given in your prompt) plus your summary message. Do not spawn subagents.

## How to read your chapters

Extract your assigned chapters to a temp file and read it fully:

```bash
node -e "const s=require('/Users/heewon/Documents/GitHub/kingdom/src/lib/data/story.json'); process.stdout.write(JSON.stringify(s.filter(c=>['CHAPTER_ID'].includes(c.id)),null,1))" > /tmp/cue-XXX.json
```

Read the ENTIRE narrative of every entry (blocks in order), not just the image slots. You need the full flow to judge placement and spot missing visual moments.

## ImageSlot schema (exact — do not invent fields)

```ts
{
  id: string;        // unique slot name, kebab/snake case
  ratio: number;     // width/height, e.g. 1.5
  tone?: string;     // hex bg hint, e.g. "#7f1d1d"
  src?: string;      // final art — NEVER set on new slots
  tempImage?: string;// temp art — NEVER set on new slots
  alt?: string;      // concise concrete EN description
  prompt?: string;   // generation prompt
  refs?: string[];   // input reference images, e.g. ["/ch_gyebek.png"]
  at?: string;       // anchor: EXACT substring of the block this image sits beside
}
```

There is NO `title` field. Gallery titles derive from `at` → `alt` → id, so make `alt` distinct per slot.

## How `at` anchoring works (critical)

An image appears beside the FIRST block whose text contains the `at` fragment. Everything from that block until the next anchored block scrolls past while the image is live. Block text used for matching (from `src/lib/beats.ts`):

- `p` / `cite`: `html + ' ' + ko` (html INCLUDES tags like `<b>…</b>`, so a fragment spanning a tag must include the tag; safest: pick a fragment inside plain text)
- `dialogue`: `lines` joined + `en` joined
- `verse`: lines joined
- `hanja`: chars+glosses + after
- `flashback`: title + year
- `table`: head + rows joined

**You CANNOT anchor to `quote`, `moral`, `monologue`, `formation`, or `diagram` blocks** — they match as empty text and the image would fall back to the entry opening. Anchor to the nearest anchorable block instead.

Pick fragments that are (a) copied EXACTLY from the block text, (b) unique — not contained in any EARLIER block of the same entry (matching is first-hit), (c) reasonably short (4–10 words).

## Task 1 — alt text

For EVERY slot in your chapters, ensure `alt` is a concise, concrete, one-sentence EN description of what the image depicts (use the `prompt`, existing alt if descriptive, `at`, and surrounding scene). No "image of"/"illustration of" prefix. Existing alts that are already real descriptions (e.g. "Cheomseongdae under a full moon — Surabol's stone tower reading the sky") should be KEPT — do not churn them. Existing alts that are junk placeholders (e.g. "sunduk 01", "clans 03", "tang 05", "tamla map", "gyebek sunset" — id echoes, not descriptions) must be REPLACED. Output an `alts` entry only for slots you're adding/replacing.

## Task 2 — cue placement audit (BE CONSERVATIVE)

For each entry, check each image's `at` anchor against the narrative: does the image land at the moment the depicted event happens? Flag ONLY clear errors:
- spoilers: image reveals an event (death, betrayal, arrival) BEFORE the text reveals it
- wrong scene: image depicts scene B but is anchored in scene A
- an image with no `at` (opens the entry) that clearly depicts a mid/late-entry event and spoils it

Propose a fix as a new `at` fragment (rules above). If everything is fine — and mostly it will be — propose nothing. Every move needs one-sentence reasoning.

## Task 3 — new cue slots (no art)

Identify strong un-illustrated visual moments: battles, deaths, births, coronations, divine appearances, quiet emotional beats. Aim for roughly even coverage inside LONG entries (an entry with 40 blocks and 2 images has gaps; an entry with 6 blocks and 3 images does not). Typically 2–6 new slots per chapter; short/epilogue chapters may need 0–1. For each new slot provide the full slot object with:

- `id`: unique, kebab or snake case matching neighbors, MUST NOT equal any existing slot id in the whole book (grep story.json for it before using)
- `ratio` + `tone`: copy conventions from neighboring slots in the same entry/chapter
- `at`: anchor fragment (rules above) at the exact narrative moment
- `alt`: as task 1
- `prompt`: written in the chapter's established convention. Read the neighbors: most use "Cinematic historical illustration of …, Three Kingdoms of Samhan / Tang era (YEAR), scene: …, painterly digital art, dramatic natural light, rich period costume, no modern elements, no text, no watermark, --ar 3:2 --stylize 250". The Goguryeo massacre sequence (iron-will) uses B&W ink with red accents — match whatever the neighboring images in that entry use. Write a DETAILED scene description in the prompt body (who, action, setting, light, mood), not a generic template fill.
- `refs`: 1–4 paths from the available assets below where those characters/places appear
- NO `src`, NO `tempImage`, NO `isPlaceholder`

## Available reference assets (static/, use leading slash)

Portraits: /ch_alchun.png /ch_alyoung.png /ch_bidam.png /ch_big_star.png /ch_biryu.png /ch_black_dragon.png /ch_blue_dragon.png /ch_bojang.png /ch_buyeo_euija.png /ch_chunchu.png /ch_chunmyung.png /ch_commander_1.png /ch_commander_2.png /ch_commander_3.png /ch_commander_4.png /ch_dosuryu.png /ch_dukman.png /ch_gaozong.png /ch_gardener.png /ch_golhwa.png /ch_gotaso.png /ch_guardian.png /ch_gumil_wife.png /ch_gyebek.png /ch_haemosu.png /ch_haewonmek.png /ch_heaven_earth_king.png /ch_heo.png /ch_hwanin.png /ch_hwanung.png /ch_hyukgose.png /ch_hyullé.png /ch_ibiga.png /ch_ijinasi.png /ch_jayi.png /ch_jumong.png /ch_kangrim.png /ch_kim_bupmin.png /ch_kim_muryuk.png /ch_kim_seohyun.png /ch_kim_sunpum.png /ch_kim_yushin.png /ch_lady_ye.png /ch_little_star.png /ch_maid_1.png /ch_maid_2.png /ch_maid_3.png /ch_munhee.png /ch_narim.png /ch_onjo.png /ch_pumsuk.png /ch_red_dragon.png /ch_rightview.png /ch_samsin.png /ch_satek_elder.png /ch_seungman.png /ch_shaman.png /ch_sosuno.png /ch_suro.png /ch_taizong.png /ch_ungnyeo.png /ch_white_dragon.png /ch_wu_zetian.png /ch_xue_rengui.png /ch_yeon_gesomun.png /ch_yeon_namgun.png /ch_yeon_namsan.png /ch_yeon_namseng.png /ch_yeon_tabal.png /ch_youngryu.png /ch_yuhwa.png /ch_yumla.png /ch_yunbi_elder.png /ch_yuri.png /ch_yuri_dora.png
Places: /pl_baekdu.png /pl_bear_fortress.png /pl_cave.png /pl_daeya_fortress.png /pl_daming_palace.png /pl_deer_rock.png /pl_eastern_palace.png /pl_flower_cliff.png /pl_jumong_cave.png /pl_moon_palace.png /pl_mount_halla.png /pl_mugun_fortress.png /pl_observatory.png /pl_pyongyang_fortress.png /pl_rock_politics.png /pl_sabi_palace.png /pl_snake_river.png /pl_stone_gate.png /pl_three_princes_well.png /pl_white_river.png /pl_wirye.png /pl_yellow_mountain.png

## Output file format (write EXACTLY this shape)

```json
{
  "chapters": ["<your chapter ids>"],
  "alts": [
    { "id": "<slot id>", "alt": "<new alt>" }
  ],
  "moves": [
    { "id": "<slot id>", "chapterId": "...", "entryTitle": "...", "newAt": "<exact fragment>", "reasoning": "<one sentence>" }
  ],
  "newSlots": [
    {
      "chapterId": "...",
      "entryTitle": "<exact entry.title>",
      "afterId": "<existing slot id in that entry to insert after, or null to insert first>",
      "promptSummary": "<one line>",
      "slot": { "id": "...", "ratio": 1.5, "tone": "#...", "at": "...", "alt": "...", "prompt": "...", "refs": ["/ch_....png"] }
    }
  ]
}
```

Set `afterId` so the images array stays in narrative order (insert after the last existing slot whose anchor precedes yours).

In your final summary message report: number of alts added/replaced, each move with reasoning, and each new slot (entry · id · one-line summary). Also verify your output file parses: `node -e "JSON.parse(require('fs').readFileSync('<file>','utf8'))"`.
