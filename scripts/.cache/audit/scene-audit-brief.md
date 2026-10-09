# Scene-continuity audit brief

Repo: /Users/heewon/Documents/GitHub/kingdom. The book is `src/lib/data/story.json`: chapters → `entries` (episodes) → `blocks`. A reader complains: "there is a lot of scene confusion, the script keeps bouncing all over the place." The reader can't tell where they are or when, and some episodes don't feel like their own story.

**READ-ONLY on story.json and all source files.** Your only write is your report file (path given in your task).

## How to read

`node scripts/.cache/aug/dump.cjs "Episode Title"` prints every block with its index (`W=600` env widens the text). The block kinds:

- `p`: narration.
- `dialogue`: `speaker: line / line`.
- `scene`: a header such as `{"kind":"scene","label":"The Gate","ko":"성문"}`. This is what the reader sees as a scene break.
- `day`: a day header in siege episodes.
- `flashback`: a nested memory.
- `quote` / `cite`: a historical record and a character card.
- `map` / `diagram` / `hanja`.

Also look at `src/lib/people.ts` (`voice` fields) when a speaker is unclear.

## What to find, per episode

1. **Missing scene headers.** The place, time or cast jumps (palace → river, night → next morning, Silla → Tang court, one fight → another) and nothing tells the reader. Propose a `scene` header placed **before** a specific block. Existing labels are short and concrete: "The Rear Garden / 후원", "The White River / 백마강", "Night on the Bank / 강가의 밤", "The Moon Palace Gate / 월성 문", "Manno / 만노". Label EN in Title Case and keep it to 1–4 words. KO should be a natural Korean noun phrase. Don't add one where the scene doesn't actually change. Don't add one directly before or after an existing `scene`/`day` header, and not as block 0 or 1 (the episode opener stays first).
2. **Rough transitions.** A cut that confuses even with a header: a speaker appears with no setup, a time skip is unexplained, a jump back is not marked as a flashback. Propose ONE short bridging narration line (EN + KO). The voice is a sly third-person storyteller talking to the reader: sentences under 12 words, at most 2 proper nouns per sentence, no AD years, no textbook glosses or office titles. Korean is plain narrator register (-다). Only propose bridges where truly needed.
3. **Self-contained story.** One paragraph per episode:
   - the logline (whose story, what they want, what stands in the way, the turn, how it ends);
   - whether the episode currently works as its own story;
   - concrete fixes (what to move out to another episode, what setup is missing, a better first or last beat).
   
   The model is the rewritten **Prince Euija** episode. It opens on "In five days, Prince Euija becomes Crown Prince Euija." It sets up its key characters (Euija, King Mu, Gyebek) and their relationship, and works as an entertaining standalone tale: a peasant boy dives five days for a noble boy's incense burner, the prince saves him, steals his father's crown to summon the deer, names him Gyebek and makes him his champion. Read that episode first as the benchmark.

Episodes flagged `FLASH` / memory are deliberate flashback/myth episodes. Judge their internal flow, and whether the jump INTO them is set up by the previous episode's last line.

## Report format

Write your report file as JSON:

```json
{
  "headers": [
    { "episode": "Exact Title", "before": "first 40+ chars of the target block's English text exactly as dump prints it (tags stripped)", "label": "The Gate", "ko": "성문", "why": "palace → gate, next morning" }
  ],
  "bridges": [
    { "episode": "Exact Title", "after": "first 40+ chars of the block the bridge follows", "en": "…", "ko": "…", "why": "…" }
  ],
  "stories": [
    { "episode": "Exact Title", "logline": "…", "works": "yes | partly | no", "fixes": "…" }
  ]
}
```

For dialogue blocks, `before` / `after` = the start of the first English line (without the `speaker:` prefix). Make sure each such snippet is unique within its episode. Validate your JSON with `node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" <file>` before finishing. Your final message: one-line counts, plus the 3 worst confusion spots in your range.
