# Full-script audit brief (reader experience)

**READ-ONLY.** Do not edit `src/lib/data/story.json` or any source file. Your only write is your report file (path in your task).

## The book

*King for All* (삼한왕검) is a bilingual (English/Korean) illustrated web serial: 98 episodes about the 7th-century wars that ended Korea's Three Kingdoms (Silla, Baekje, Goguryeo) and the Tang empire's play for the peninsula, 632–676 AD, with founding-myth and god episodes folded in as flashbacks. It reads like a TV drama or manhwa: scenes, dialogue, a sly narrator, stills between beats. Audit the **English text only**.

The author's house standard (from `.cursor/rules/story-script-style.mdc`, read it if you want the full version):
- **A character story, not a history book.** The reader follows what people want, hide and pay. King numbers, reign lengths, office strings, troop counts and glosses belong in the wiki, not on the page.
- **Talk is a scene** (Sorkin × Nolan): people interrupt, dodge and win arguments. Close people talk in shared shorthand. No caption-dialogue, no telegram stacks, no thesis speeches.
- **The narrator** is a warm, sly omniscient storyteller talking to "you", teasing the future without spending it. Sentences are short. At most two proper nouns per sentence and three per paragraph for a first-time reader.
- **Every episode opens on a hook line** and **ends on a bold next-episode card** that teases the next episode.
- **Suspense:** plant, withhold, pay off. *Deliberate* mystery boxes: the Gaya prince Muryuk is unnamed before his own episode, and the founding myths (Jumong, Onjo, Hyukgose, Dangun) are only hinted at before their own episodes. Don't flag a deliberate tease as "no context", but **do** flag it if it confuses more than it intrigues.
- **Intentional, don't flag:** Bidam's caps-lock rant at the Radiance tea; Kangrim (the psychopomp) asking every dying great man "were you X, or Y?"; King Euija saying the book's theme out loud ("a country is a territory governed by a single story").
- `quote` blocks are verbatim historical records (Samguk Sagi etc.). They're allowed, but count them against pacing when they pile up or retell what the scene just showed.

## How to read the dump

Episodes are in `scripts/.cache/audit/full/ep/NN-slug.txt`, numbered in **reading order** (01 is first). Your slice is also concatenated in `scripts/.cache/audit/full/slice-K.txt`. `scripts/.cache/audit/full/stats.txt` gives each episode's word count and its dialogue/narration/record split.

Each line is `[blockIndex] …`:
- `¶` narration
- `Name: line / line` dialogue
- `── SCENE: … ──` scene header, `══ DAY: … ══` day header
- `▼ FLASHBACK … ▲` an inline memory (nested blocks are `[i.j]`)
- `❝QUOTE (source): …❞` a historical record
- `[CARD …]` a character card (the name/age pop-up); `[CITE …]` is a speaker caption
- `[TERM …]`, `[MAP …]`, `[PLACE …]`, `[DIAGRAM …]`, `[TABLE …]`, `[HANJA …]`, `[EDICT …]`, `[POEM …]`, `[OMENS …]` are explainer/record widgets
- `**…**` bold. The final bold `¶` is the next-episode card.

`[FLASHBACK EPISODE]` in a header means the whole episode is a memory or myth placed out of chronological order on purpose. Judge whether the jump **into** it is set up by the episode before, and whether the story comes back cleanly afterwards.

## Calibrate first

Read `ep/04-prince-euija.txt` before your slice. The author rates it the best episode. It opens on a hook ("In five days, Prince Euija becomes Crown Prince Euija"), sets up its key people and their relationships fast, and works as an entertaining standalone tale with a want, an obstacle, a turn and a payoff. Treat it as **5/5** on every axis. The author suspects that only Prince Euija and the Jumong arc (#37–39 Haemosu, Buyeo, Jolbon) are good so far, maybe Bidam's rebellion (#40 Gi, #42 Seung, #44 Jeon, #46 Gyeol). Judge every episode, those included, on the text. Disagree with the author when the text supports it.

## You are a first-time reader

You have never heard of Silla, Baekje, Goguryeo, Tang or any of these people. You like character drama and good battle and romance scenes. You'll forgive one confusing beat, not five. Read your slice **in order, start to finish**, as that reader. Note where you get lost, bored, or pulled forward.

Before you claim something **"appears with no context"**, check whether earlier episodes set it up: grep `scripts/.cache/audit/full/ep/` (files numbered below yours are earlier). If a setup exists but is thin or many episodes back, say so ("planted at #12 [40] in one line, 20 episodes ago: too thin to carry this").

## The questions (score 1–5 per episode; 5 = Prince Euija, 3 = readable but flat or confusing in places, 1 = a reader is lost or quits)

1. **followable**: Can a first-time reader tell whose story this is, where and when we are, and what's at stake? Too many names, unclear speakers, unexplained jumps?
2. **context**: Do people, objects, places, relationships or events show up suddenly without setup? Do callbacks rely on things the reader never saw?
3. **pacing**: Does it move? Flag lectures, record/quote pile-ups, explainer widgets that stall a scene, repeated beats, rushed climaxes, scenes that end before they land, summary where a scene was needed.
4. **flow**: Does each beat cause the next, inside the episode and across the seam into the next episode? Flag non-sequiturs, unmotivated decisions, coincidences and time jumps with no bridge.
5. **entertainment**: Is it fun, tense or moving? Is there a question pulling the reader forward (suspense), wit, conflict, a payoff?

**Romance and battle get a deep look whenever they appear:**
- **Romance:** desire, an obstacle, escalation, chemistry in the actual dialogue (banter, subtext, what's not said), a choice that costs something, a payoff. Do we root for them? Is it told ("they fell in love") or played?
- **Battle:** stakes (what's lost if they lose), a POV character we care about, a goal and geography the reader can follow, a plan and a reversal, cost and consequence, momentum. Is it dramatized, or summarized as "X wins, Y dies"?

## Report: JSON at the path in your task

```json
{
  "slice": 1,
  "range": "#1–#9",
  "episodes": [
    {
      "n": 4,
      "title": "Prince Euija",
      "logline": "Whose story, what they want, what stands in the way, the turn, how it ends. One or two sentences.",
      "scores": { "followable": 5, "context": 5, "pacing": 5, "flow": 5, "entertainment": 5 },
      "verdict": "One plain sentence a busy author can act on.",
      "opening": "Quote the first line; does it hook?",
      "ending": "Does the last beat land, and does the card lead into the next episode?",
      "sudden": [{ "block": "12", "what": "what shows up with no setup", "setup": "none, or where the thin setup is", "fix": "concrete fix" }],
      "pacing_notes": [{ "blocks": "40–58", "issue": "…", "fix": "…" }],
      "flow_notes": [{ "blocks": "20→21", "issue": "…", "fix": "…" }],
      "romance": "null, or a frank assessment with block refs",
      "battle": "null, or a frank assessment with block refs",
      "suspense": "What question pulls the reader forward? Which plants pay off, and which never fire?",
      "best": "The best moment: short quote + block.",
      "worst": "The weakest stretch: blocks + why.",
      "fixes": ["Up to 3 concrete fixes, most important first. Name blocks; say what to cut, move, add or dramatize."]
    }
  ],
  "arc": {
    "throughline": "Does this stretch have a spine? Whose story is it? Would a reader keep going?",
    "handoffs": [{ "from": 3, "to": 4, "works": "yes | partly | no", "why": "…", "fix": "…" }],
    "dropped_threads": ["Planted but never fired, or a character who vanishes. Give where."],
    "repetition": ["The same beat or fact told twice or more across episodes. Give where."],
    "top_problems": ["The 3–5 biggest problems for a first-time reader in this slice, worst first."]
  }
}
```

- Cite blocks as `[12]` or `[10.3]`. Keep quotes under 20 words.
- `handoffs` covers every seam in your slice, **plus** the seam from the episode just before your slice (read the end of it) and the seam into the episode just after it (read the start).
- Be frank and specific. "Pacing could be tighter" is useless. "[31]–[44] are four quotes and two term cards between the threat and the fight; cut to one quote" is useful.
- Validate before finishing: `node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" <your file>`.

Your final message: the slice verdict in two sentences, your best and worst episode, and the three biggest problems.
