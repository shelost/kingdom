# Full script audit (October 7, 2026)

Scope: all 98 episodes of `src/lib/data/story.json`, about 130,000 words including records.
Method: nine slice readers scored every episode against `BRIEF.md` (calibrated on #4 Prince Euija = 5/5),
plus my own read of the benchmarks (#1, #4, #37–#40, #42, #46, #70, #72). Claims marked **(verified)** were
re-checked against `ep/*.txt`; the rest are reader findings with block references in `report-N.json`.

Files: `ep/NN-slug.txt` (episode dumps, reading order), `stats.txt`, `merged.json` (all scores and notes),
`report-1..9.json` (raw slice reports), `merge.cjs` (rebuilds `merged.json`), `seams.txt` (episode boundaries).

## Verdict

The author's hunch is mostly right, with additions.

- **#4 Prince Euija is the only perfect episode (25/25).** Every reader used it as the bar, and none found a rival in its slice.
- **Jumong holds up.** #37 Haemosu and #38 Buyeo score 19. #39 Jolbon has the best romance scenes in the book but runs 5,225 words for about 3,000 words of story.
- **Bidam's rebellion is solid, not top-tier (16–18).** The thriller engine works: a ten-day grain clock and the nightly tea. Two myth episodes cut into the countdown, and the duel is two sentences.
- **There are hidden standouts the author didn't name:** #11 Sadaham (24), #57 Heaven–Earth King (22), #27 Nangbi (21), #17 Dosuryu (20). Then a group at 19: #12 Gotaso, #24 Yeon's Massacre, #25 Chunchu & Yeon, #54 Talhae, #69 Heungsu, #74 Buyeo Euija†, #90 Letters, #98 Balhae.
- **Most of the book is competent but flat.** 79 of 98 episodes score 13–19 out of 25. Fourteen score below 13, and five score 20 or more. Pacing is the weakest dimension (mean 2.66 of 5), then flow (2.99).

What the good episodes share:
- one protagonist with a want;
- a clock or a count (five days, ten days, One–Four, thirteen sons);
- the turn played out line by line instead of summarised;
- a plant that pays off inside the episode;
- few records.

The data agrees. Episodes that are 40% or more records average 11.9/25, against 16.4 for those under 20% (correlation −0.39). Stubs under 500 words average 13.1, 2,000–3,500 words average 17.0, and the four episodes over 3,500 words average 14.0. Flashback and myth episodes score the same as present-day ones (15.6 vs 15.5): **the myths are fine; where they sit is the problem.**

## Answers to the five questions

**1. Is it followable for a first-time reader?** Episode by episode, mostly yes. As a whole, no.
- **The front door is the hardest page.** #1 gives lines or cards to 13 new characters and names about 20 people in 1,650 words.
  - The queen speaks at [29] before anyone introduces her. "Dukman" appears once, in a list at [30], and the page never says outright that she becomes Queen Sunduk. **(verified)**
  - The crowning is narrated ([35]), and nobody on the page acts on "A Queen? Ridiculous."
- **The three pilots never touch.** Silla #1–2, Baekje #4–5 and Goguryeo #7–8 connect only through next-episode cards. #4 never mentions Silla, even though #3's card promises Baekje's grudge against it. **(verified)**
- **The leads vanish after their pilots.** Sunduk doesn't speak in #2–#12, and Euija doesn't speak in #5–#17. **(verified)**
- 169 characters get lines or cards.

**2. Do elements appear suddenly with no context?** Yes. The worst cases:
- **Gyebek's family.** His wife and children exist only in the record of their deaths (#70 [17]). In #69 [1.6]–[1.7] he says the one person he cherishes and the one he serves "are the same person". **(verified)**
- **Gyebek's dying vow.** At #72 [120]–[122] he pays off "I will complete my duty", a line never spoken in #4. #4's refrain is "I gave my word" ([72], [74]) and "I have my word. If I break it, I have nothing." ([91]). **(verified)**
- **Gesomun.** The war's cause has one line in the whole invasion (#36 [34]), after it is over. **(verified)**
- **Old Joseon.** #53 [0] opens on "After the fall of Old Joseon", 35 episodes before Joseon's own episode (#88). **(verified)**
- **Muryuk.** #20 [16], [22] give his lines `person: "muryuk"`. The reader shows the speaker's name and nothing hides it before a reveal, so "Muryuk" appears 23 episodes before #43. **(verified)**
- **Unexplained names.** "Goryeo" goes unexplained until #25. Haesang, Bodeok and the Five Principles are planted and dropped.

**3. Is the pacing natural?** No. It fails in two opposite directions.
- **Bloat:**
  - #21 Gumil: 5,610 words, and Gumil first speaks at block [98]; about 4,000 words are the goddess cavern. **(verified)**
  - #22 Maehwa: 3,370 words, almost all one night.
  - #39 Jolbon: 5,225 words.
  - #45 Seohyun: 4,124 words.
  - #48 Huangdi: 7,932 words, and its central question is spent by the quote at [36]. **(verified)**
  - In Iron Will (#21–#30), about 8,300 of roughly 18,600 words are sex or cavern scenes.
  - #65 [14]–[26] is thirteen paragraphs of image-prompt shot lists, nearly the house rule's own banned example. **(verified)**
- **Stubs and record dumps.** Seven episodes run under 400 words: #16, #30, #33, #63, #68, #80 and #96. Ten episodes are 40% or more records, for example #35 (76%, no dialogue) and #80 (75%). **(verified)**
  - Quotes often retell the block right before them. #73 runs seven quotes in a row, [50]–[56]. **(verified)**

**4. Do events lead naturally from one plot point to the next?** Often not. Readers judged 107 handoffs, counting overlapping slice edges twice. 53 don't fully work, and 4 of those fail outright: #5→#6, #20→#21, #62→#63 and #86→#87.
- **The book rewinds at its cliffhangers.** 29 episodes are flashback or myth.
  - The Jumong trilogy (#37–#39) lands mid-siege at Ansi, and the story never returns to Goguryeo.
  - #41 Suro arrives one block after Bidam decides to rebel, and #45 sits between Day 9 and Day 10.
  - From #53 to #63, 10 of 11 episodes are myth.
  - #67 and #71 cut away at the two peaks before Yellow Mountain: right after "Summon Gyebek…!", and between the march and the battle.
- **The timeline runs backwards three times outside flashbacks:** #50 (649) after #49 (651), #52 (644) after #51 (654), and #87 (665) after #86 (668). **(verified)**
- **Relationships end off the page.** Euija and Gyebek never share a present-day scene after #29: in #56 Euija only rages after the exile. **(verified)** Bidam and Sunduk never share a scene. Maehwa vanishes after #23. **(verified)** Jahee, Jukji, Inmun, Yung, Punghun, Pung and Yuri Dora fade out.

**5. Is there enough entertainment and suspense in the romance and battle scenes?**
- **Romance works when it is played** with desire, an obstacle, escalation and a cost. Examples:
  - #39 Jolbon (the bucket, the well girls, the arrow in the well-beam);
  - #37 Haemosu (her name for his descent);
  - #14 Munhee (the sewing slow burn);
  - #45 Seohyun;
  - #61 Gardener (Jacheongbi);
  - #88 Dangun ("The garlic reached this far.");
  - #46's deathbed "Dukman." / "Yushin."
- **It fails when it is only sex** (#21, #22, #41, #65), **told rather than played** (the Bidam–Dukman triangle is one line at #42 [32]), or **a sketch** (#52 Jahee).
- **Battles work when they are staged:**
  - #36 Ansi's earthen-mountain race;
  - #44 Jeon (the burning kite and Hangyul);
  - #69 Heungsu's map in the dirt;
  - #72's four clashes and the parley;
  - #79's thirteen-sons count;
  - #83 White River;
  - #95 Maeso.
- **Most climaxes are summarised, quoted or reported by messenger:**
  - Daeya falls in about 130 words (#23).
  - The Bidam–Yushin duel is two sentences (#46 [8]–[9]).
  - Stallion Mountain is three sentences (#34).
  - Colossal River has no dialogue at all (#35).
  - Stone Gate, Pyongyang II and Final Ford come by summary or messenger, and Xue Rengui is absent from Final Ford. **(verified)**
- **Outcomes are announced in advance:** by Tang clerks at #36 [4]–[5], by a widget at #72 [33], and by the quote at #48 [36].
- **Suspense is strongest in clocks, counts and mystery boxes:** Euija's five days, Bidam's ten days, the One–Four count, Saluzi and the emperor's forbidden name.

## Priority fixes

1. **Rebuild the front door (#1).** Open on Sunduk and keep about six names. Put "A Queen? Ridiculous." and the crowning on the page. Send the bone-rank lecture and the envoy montage to the wiki. Let the "Yushin-ah" beat finish before any flashback.
2. **Stop rewinding at cliffhangers.**
   - Close Ansi before #37, or move the Jumong trilogy ahead of the invasion.
   - Move #41 Suro out of the rebellion, and run a trimmed #45 right after #43.
   - Alternate the island tales (#57–#63) with Sabi episodes, and merge #63 into #59 and #68 into #69.
   - Move #67 and #71 off the two peaks.
   - Swap #49 and #50, and mark or fix the #86→#87 rewind.
3. **Play the climaxes.** Stage these as scenes:
   - Daeya's fall from one point of view;
   - the Bidam–Yushin duel;
   - Stallion Mountain;
   - Ulchi Munduk's seven fake surrenders;
   - Ansi's retreat;
   - Chunchu's coronation (#51);
   - Final Ford with Xue present;
   - the coronation in #97.
4. **Cut the bloat.**
   - #21 [0]–[92], about 4,000 words. #45 retells the same origin anyway.
   - #22, down to about 800 words.
   - #39, about 2,000 words: the repeated tsundere loop, extra bedroom scenes and the codas after the wedding.
   - #48, about 1,500 words: the two history flashbacks, the second Wu scene and widgets. Or split it at [177].
   - #65 [14]–[26].
5. **Make payoffs match their setups.**
   - #72 [120]: echo "I gave my word" / "I kept my word".
   - Plant Gyebek's family before #70.
   - Give Euija and Gyebek one present-day scene after #66's "Summon Gyebek…!", or let Euija react to his death in #73.
   - Seungman is Sunduk's cousin: fix #1 [30] and #40 [27] ("thinned to a sister").
   - #28 [5]: Euija, not Yushin, takes the forty fortresses, per the #26 [39] record.
   - #46: Bidam dies once.
   - #72 [116] "heaven's messenger" vs #62 [1] "Heaven did not send him".
   - #1 [57] "the last time in forty-one years" vs #46's deathbed "Yushin."
   - Check #40 [48], where Bidam seems to speak the Yamato king's line about Gesomun.
6. **Hide Muryuk in #20.** Drop `person` for a `speaker` label such as "Gaya prince", or add a veiled look whose name stays anonymous until #43.
7. **Merge stubs and trim duplicate records.** Fold #16 into #15/#17, #30 into #31, #33 into #34, #63 into #59, #68 into #69 and #80 into #81. Cut quotes that repeat the block before them (#73 [50]–[56], #54, #55, #90). Stop announcing outcomes (#36 [4]–[5], #48 [36], #72 [33]).
8. **Keep the leads on stage.**
   - Give Sunduk a beat between #2 and #12, Euija one between #5 and #17, and Gesomun a scene in his own war.
   - Say the Daeya convergence out loud: Gotaso moves there in #13, and Euija picks it in #19.
   - Point at the shared "king for all" vow across #1, #4 and #8.
9. **Pay off the title (#97).**
   - Show the king for all acting on six-year-old Bupmin's sentence in #1 ("the ones with no bone. Those most").
   - Bring back the three-way race from #29.
   - Give Munmu Kangrim's question.
   - End on a character, not "The Northern and Southern States Era begins".
10. **Give the endgame scenes.** #78, #80, #89, #91 and #96 are chronicles. Each needs one point-of-view scene at the walls or on the water.

## First and last lines

A = a hook the house would print (rule-table technique, under 12 words a sentence, one surprise). B = works, could bite harder. C = plain or file-card. D = textbook, label or recap. F = breaks a rule (AD year, spoiler, opened box). Last line: the bold card must tease the next episode under 25 words, end on …! or a question, spend nothing, and be picked up by the next first line.

**Before the rewrite.** First lines: A 14 · B 40 · C 29 · D 13 · F 2 (average 2.52 of 4). Last lines: A 20 · B 67 · C 10 · D 1 · F 0 (average 3.08 of 4).
**After the rewrite.** First lines: A 52 · B 46 · C 0 · D 0 · F 0 (average 3.53 of 4). Last lines: A 39 · B 59 · C 0 · D 0 · F 0 (average 3.40 of 4).

| # | Episode | First line | Grade | Closing card | Grade |
|---|---|---|---|---|---|
| 1 | Queen Sunduk | A Queen? Ridiculous. | A → **A** | Six men who hate the word “woman” crowned one anyway. One of them carried the crown. How?… | B → **A** |
| 2 | Harmony Council | One night earlier. Six nobles, one brazier, and nobody stands up until they all agree. | C → **B** | Every man who voted that night grew up in her great-grandfather’s yard. Who was the Cloud… | C → **A** |
| 3 | Jinheung, the Cloud | Ask anyone in Surabol about the Cloud King and they'll tell you about his stones. Ask any… | A → **A** | The rain fell on Baekje’s field, and Baekje kept the grudge. In five days, it names the p… | B → **A** |
| 4 | Prince Euija | In five days, Prince Euija becomes Crown Prince Euija. He is thirty-two, which is late fo… | A → **A** | Eight houses. Eight boys on the sand. And one with a borrowed name…! | B → **B** |
| 5 | Eight Great Clans | Satek. Yunbi. Jinmo. Mokli. Hae. Baek. Guk. Ahn. | A → **A** | Why is one dead king the only thing eight houses still agree on? To find out, we go back … | C → **A** |
| 6 | Gunchogo, the 13th | Baekje’s thirteenth king marches north to Pyongyang. A Goguryeo king dies on his own wall… | B → **B** | North, then, three hundred years on, to the snow and Goguryeo’s most frightening commande… | B → **B** |
| 7 | Commander Yeon | Everyone in the north has a story about the Eternal General. None of them are bedtime sto… | C → **A** | He promised his father half. He has never said half of anything. Next stop: Pyongyang, an… | A → **A** |
| 8 | High Summit | Half, his father said. Yeon manages it until the second pot of tea. | C → **A** | Once, Silla begged Goguryeo for an army, and Goguryeo came. To meet the king who answered… | C → **B** |
| 9 | Gwanggaeto, the Great King | Silla is drowning. An army from across the sea is inside its walls, and its king has one … | B → **B** | The prince who will beg has a son. Bupmin is fifteen now, and his uncle has one question:… | B → **B** |
| 10 | Bupmin | Fifteen is old enough for the headband. It is not old enough to invent a country, though … | C → **B** | The yard has two names it still whispers. Tonight the Marshal says them out loud…! | A → **A** |
| 11 | Sadaham | Every yard has its ghosts. This one has two, and they have never missed roll call. | A → **A** | When his sister rides too fast, Bupmin always pulls up first. Gotaso never pulls up. Not … | A → **A** |
| 12 | Gotaso | A young girl is going to do what she’s going to do. | A → **A** | Four children, already named. Now the boy has to ask her father. And her father wants a v… | A → **A** |
| 13 | Pumsuk | Pumsuk asks for the girl. Chunchu asks for something else. | D → **A** | “Dear… have you already forgotten how we met?” Munhee hasn’t. It involves a dream, a skir… | A → **A** |
| 14 | Munhee | Dear… have you already forgotten how we met? | B → **B** | Same spring, in Pyongyang, another father walks his son to school. He means to pick a fig… | B → **A** |
| 15 | Academy | Yeon has three sons, and only one of them is old enough to annoy a monk. | B → **A** | Field trip. Yeon takes the boys to see a very big rock. The rock has a list on it, and a … | B → **B** |
| 16 | Stele | The Great King’s stone is taller than four men. Namseng is not impressed. | C → **B** | Some visitors knock. Some take their boots off. One old friend is about to do neither…! | B → **A** |
| 17 | Dosuryu | In thirty years Dosuryu has never knocked at this house. Tonight, for the first time, he … | B → **B** | Far to the south, Sabi has a new king. On his coronation morning, several hundred people … | B → **B** |
| 18 | King Euija | Several hundred people see the dragon. Only one of them can see the string. | C → **A** | Euija can fake a dragon. He can’t fake a fortress. For that he needs a general who does e… | B → **B** |
| 19 | Yunchung | There was only one man Euija knew he could trust to deliver. | A → **A** | “What is the Severing?” Gyebek asked. Any grandmother in Sabi could tell him. We’ll go ba… | A → **A** |
| 20 | The Severing | The sad thing about betrayal… is that it never comes from your enemies. | A → **A** | Ten thousand Baekje men march on Daeya. Its grain clerk is called Gumil. Remember that na… | A → **A** |
| 21 | Gumil | Gumil counts rice for a living. None of it has ever been his. | D → **A** | One husband counting sacks till dawn. One cold pallet. One feast still lit down the hall.… | B → **B** |
| 22 | Maehwa | A man is measured by his self-control. | A → **A** | Morning comes. So does her husband, back from the stores. He wants the whole story. Every… | A → **A** |
| 23 | Siege of Daeya | Gumil comes home at dawn with every sack in Daeya counted. He sits down to count one more… | C → **B** | In Pyongyang, Yeon has spent all summer bowing. Now he is throwing a party, and everyone … | B → **B** |
| 24 | Yeon’s Massacre | Everyone in Pyongyang agrees that a man who bows all summer has learned his place. | C → **A** | A kingdom with its doors shut, and a man with five swords on his back. Naturally, Chunchu… | A → **A** |
| 25 | Chunchu & Yeon | Every morning since Daeya, Chunchu asks the Queen for the same thing. Every morning she s… | C → **B** | One envoy left Pyongyang bleeding. Whose blade was it? Now the King of Baekje walks in on… | B → **B** |
| 26 | Euija & Yeon | King Euija hears how Goguryeo’s king died, and feels the one thing a king should never ad… | D → **B** | Why does the Eternal General flinch at one Silla name? Go back to a ditch, a white horse,… | A → **A** |
| 27 | Nangbi | Kim Yushin — a name that strikes fear in all of Samhan. Maybe this is why. | A → **A** | Thirteen years on, the banner captain has a queen, a title, and forty fortresses Baekje j… | B → **A** |
| 28 | Forty Fortresses | Baekje took forty Silla fortresses in one autumn. Silla’s answer reaches Sabi at breakfas… | D → **B** | One star over Samhan tonight. Three men are looking up at it, and every one of them wants… | A → **A** |
| 29 | The Eastern Star | There is a hill above Surabol where two boys once lay on their backs and argued about a s… | C → **B** | Gesomun wants a country. Far to the west, the man who owns half the world is trying to pr… | B → **B** |
| 30 | Emperor | Far to the west, a man who owns half the world hears a new name. He turns it over on his … | A → **A** | He has his excuse. What he doesn’t have yet is a war worth leading himself. For that he’l… | B → **B** |
| 31 | Four Dragons | In Chang’an there is one word nobody says. It is the emperor’s name. | D → **A** | Yodong has never opened its gates to the West. Not for the Sui. Not in three summers. Her… | B → **B** |
| 32 | Yodong | Every wall assumes the enemy will knock. Goguryeo has spent fourteen years building a wal… | B → **B** | On the road to Ansi, the old man tells it anyway. Once, a king won twice and went back fo… | B → **B** |
| 33 | Boiling River | The old officer starts with the part kings like to hear. Goguryeo won. Twice. | C → **B** | A hundred and fifty thousand men march toward an open plain. On a hill above it, the empe… | B → **B** |
| 34 | Stallion Mountain | Go Yeonsu liked the old man’s story. He just didn’t think it was about him. | B → **A** | Why isn’t Gesomun afraid? Go back thirty-three years, to a general who surrendered seven … | B → **A** |
| 35 | Colossal River | Ulchi Munduk surrenders seven times on the way south. Every time, the river gets closer. | F → **A** | Yodong fell. The forts fell. One wall is left, held by a madman whose name nobody wrote d… | B → **B** |
| 36 | Ansi | The Guardian of Ansi Fortress is an eccentric man. When Yeon took the country, the Guardi… | B → **B** | Who was the Holy King, and why does Goguryeo give him brides? Seven hundred years back, t… | C → **A** |
| 37 | Haemosu | Every day the sun crosses the sky on the same road. Today he looks down. | B → **A** | Dogs won't eat it. An axe won't split it. What on earth is inside Yuhwa's egg…? | A → **A** |
| 38 | Buyeo | Buyeo tries very hard to get rid of the egg. The egg declines. | C → **A** | A soaked exile, a hall full of spears, and a chieftain's daughter who won't look at him. … | A → **A** |
| 39 | Jolbon | He is still wet from the river when the pines stop being empty. Two men in Yeon leather, … | B → **B** | Back in Surabol, the queen is failing and the council must name who's next. It only takes… | D → **B** |
| 40 | Gi (起) | The Harmony Council has one rule. Nothing moves unless the circle closes. Everyone agrees… | D → **B** | A sky that looks too long at a mountain. Six eggs. A red sail. Here is how Gaya began…! | B → **B** |
| 41 | Suro | Before there is a Gaya, there is a ridge, and a sky god who looks at it too long. | B → **B** | Nine days of grain. One folded note. Will the Marshal of Silla come to tea with a traitor… | C → **A** |
| 42 | Seung (承) | Of course he comes. Yushin has never once refused Bidam a rematch. Between the camps a sm… | D → **A** | A cone helm, a king on a camp stool, and a name Yushin won’t say. Who was his grandfather… | B → **A** |
| 43 | Muryuk | His name was Muryuk. He was the youngest of three sons in a cart, and the only one who lo… | C → **A** | Five days of grain. Two cups poured. Will the grandson of the cone helm come to tea…? | B → **A** |
| 44 | Jeon (轉) | Night rain. Five days of grain behind the palace gate. Bidam’s officers want a dawn assau… | B → **B** | A warm stone, a spring under a hill, and a father who once got very lost on purpose. Who … | C → **B** |
| 45 | Seohyun | Before there is a Yushin there is a road, and a young man on it who should be looking whe… | B → **B** | Ninth morning, before light. The stone in his son’s sleeve is warm at last. Down Yushin g… | C → **A** |
| 46 | Gyeol (結) | The water under the hill has been warm for thirty years. Before light on the ninth day, s… | B → **A** | The one hand that said no is gone. Now the crown has to fit Seungman, and it was made for… | B → **B** |
| 47 | Queen Jinduk | The crown was made for her cousin and has to be padded at the temples. Seungman sits very… | A → **A** | Silla needs an army. Only one man alive can lend it, and he has never lent anything for f… | B → **A** |
| 48 | Huangdi (皇帝) | Everyone on earth wants something from the Son of Heaven. Most of them bring tribute. Chu… | B → **B** | Chunchu has watched one brush move an empire. Now he wants that brush in Silla. The Harmo… | B → **B** |
| 49 | Royal Secretariat | For three months a border petition has been circling the Harmony Council like a bird that… | B → **B** | What happened to that promise? Two years back, the room is too warm, and a dying emperor … | B → **B** |
| 50 | Jiabeng (駕崩) | Two summers earlier, the Son of Heaven is dying the way he did everything else: in front … | B → **A** | Seven years of a polite queen and a busy nephew. Sooner or later, Silla has to admit who'… | B → **B** |
| 51 | King Muyeol | For seven years the crown has sat on Queen Jinduk. The work has sat on her nephew’s table… | B → **B** | The first time she said it, he was eighteen, the quay was wet, and the brush in her hand … | C → **B** |
| 52 | Jahee | Ten years earlier, at Silla’s only western harbour, the prince is eighteen and losing an … | C → **B** | Silla’s newest king wears Tang silk. To see why the old houses mind, go back to a white h… | C → **A** |
| 53 | Hyukgose | Seven hundred years before anyone in Surabol wore Tang silk, six old men creep up on a ho… | F → **A** | A chest rides the tide in, a magpie screaming over it. Whatever is inside needs a house. … | A → **A** |
| 54 | Talhae | Late in the first king’s reign, a chest comes in on the tide at a fishing beach. A magpie… | B → **B** | “Hogong. There’s a rooster in the woods.” It is the middle of the night. Roosters don’t c… | A → **A** |
| 55 | Alji | Bidam said there was no Kim. He was right for about a hundred and twenty years. Then, one… | C → **B** | Across the border in Sabi, a funeral bell. For three years the king can’t sign a thing. T… | B → **B** |
| 56 | Exile | Queen Satek dies, and the king, her son, loses the right to say no. | D → **B** | First night on the island. A fire, two cups, and a storyteller who never asks permission.… | A → **A** |
| 57 | Heaven–Earth King | The first night, the king of Tamla pours two cups. His guest stays by the door, busy bein… | C → **A** | The next night Gyebek finds a roof to mend. Yuri Dora finds a ladder. One woman made this… | B → **B** |
| 58 | Sulmun | The next story is told to him on a roof, because he is on a roof, mending it, and Yuri Do… | B → **B** | Three princes climb out of the ground. “Not from an egg,” the island insists. Then a box … | B → **B** |
| 59 | Three Princes | Half the kingdoms on the mainland have a first king who hatched from an egg. Tamla is pro… | D → **A** | “Tomorrow’s isn’t a kind one, Turtle.” A serpent in a cave. A woman from the rock. A man … | B → **B** |
| 60 | Stone Lady | Today’s is not a kind one. | B → **B** | Heaven sends for a man to keep its flower field. He leaves his pregnant wife to wait. He … | B → **B** |
| 61 | Gardener | Told in the orange grove, in the hour after the picking, when Gyebek has finally been per… | B → **B** | The island keeps one story for last. It is about the one who comes for you, and the crow … | B → **B** |
| 62 | Kangrim | On this island, a death gets a fire on the shore and one story. | B → **A** | In spring the tribute boat comes back from Sabi with news of the king. Gyebek has one que… | B → **A** |
| 63 | Tribute | The tribute boat comes home light. The oranges stayed in Sabi. The news did not. | B → **A** | Meanwhile, in Sabi, Euija calls the Assembly. He has a smile, a speech, and a proclamatio… | B → **B** |
| 64 | Coup | He calls the assembly the way a gambler calls a final hand — smiling, sleeves perfect, al… | B → **B** | He beat eight houses in one morning. Now he can’t sleep. In his dreams, somebody keeps co… | B → **B** |
| 65 | Descent | He starts dreaming about the Rock of Politics. In the dream it is dry, and he is rubbing … | B → **B** | Foxes in the Assembly. Toads in the treetops. A river running red. Nine signs, and a king… | B → **B** |
| 66 | Nine Omens | Every one of the nine signs is real, in the sense that people saw it. That was always the… | D → **B** | Will Baekje survive? To answer that, go back to how it began: a mother, two sons, and a f… | B → **A** |
| 67 | Onjo | Every child in Baekje can tell you this story. Most of them get the beginning wrong. | B → **A** | Back to Sabi. Two armies are on the road, the boat for Gyebek still hasn’t sailed, and th… | B → **B** |
| 68 | Sungchung | The war reaches Sabi the way bad news always does: through the fish market first. | C → **A** | One man might still know what to do. Euija sent him away too. Somebody ride. Now…! | A → **A** |
| 69 | Heungsu | Heungsu has drawn the same map in the dirt every morning for three years. Today the king … | C → **B** | Across the sea, a boat is coming for the Turtle. He is on the shore before they finish ty… | B → **B** |
| 70 | Gyebek | Somewhere in the fourth year he notices he has stopped counting the days. It frightens hi… | A → **A** | Somewhere, Kangrim closes his ledger on a swept yard. Then he goes up to a meeting with o… | B → **B** |
| 71 | Three Realms | Once a year the gods hold a meeting. Kangrim is late to this one, because of a yard in Ba… | D → **B** | The minutes of that meeting never leave Heaven’s table. Down below, five thousand men are… | B → **B** |
| 72 | Yellow Mountain | Gyebek can count to fifty thousand. He has done it twice since dawn. The answer has not i… | C → **A** | The pass is open. The river is open. And in Sabi, a runner is climbing the palace steps w… | B → **B** |
| 73 | Sabi | The runner has one word. Euija makes him say it twice. | C → **A** | Across the sea, a confession is waiting for Euija. It is already written, in a lovely han… | B → **B** |
| 74 | Buyeo Euija† | An empire is not finished with a king until he has signed something. | C → **A** | Baekje is gone. Goguryeo still stands. And the man who arranged both can no longer get ou… | B → **B** |
| 75 | Kim Chunchu† | Chunchu has talked his way out of every room in Samhan. This one has no other door. | C → **A** | Silla won the war. So why does the emperor’s new edict call its king a clerk…? | B → **B** |
| 76 | Ungjin Commandery | In Chang’an, the cheapest way to conquer a country is to rename it. | B → **A** | Baekje has no king. Across the sea, an exiled prince is packing his bags…! | B → **B** |
| 77 | King Pungjang | Baekje is finished, says everyone except Baekje. | C → **A** | Baekje has its king back, and a general who already regrets it. Now the emperor turns nor… | B → **B** |
| 78 | Pyongyang I | Pyongyang has never fallen. Every child in the city will tell you so, usually twice. | C → **A** | The White Tiger has thirteen sons. Yeon Gesomun can count to thirteen…! | A → **A** |
| 79 | Snake River | The White Tiger drives his host into the Snake River. They still believe rivers are roads… | B → **B** | And on an island far to the south, someone is asking: whose side are we on now? | B → **B** |
| 80 | Tamla Surrenders | “Whose side are we on now?” On Tamla, the one who asks is usually holding a fish. | D → **A** | Baekje refuses to stay dead. And in Surabol, a great lord feels a fever coming on…! | B → **B** |
| 81 | Rebellion | Kim Jinju has a fever. Half of Surabol has watched it play gyuku. | B → **B** | Meanwhile at Juryu, the general who crowned Baekje’s king has taken to his bed. He would … | B → **B** |
| 82 | Betrayal | Boksin is sick. It is the healthiest he has looked in years. | C → **A** | Four banners. One river mouth. The West, Samhan and the East meet on a single tide…! | B → **B** |
| 83 | White River | Four banners come to one river mouth. Only the tide has been here before. | C → **B** | Two reapers failed to take Yeon Gesomun at the river. The ledger still has his name in it… | B → **B** |
| 84 | Yeon Gesomun† | The Eternal General is dying. | A → **A** | “Do not fight amongst yourselves.” He had three sons. How long do you think that lasts? | A → **A** |
| 85 | Brothers’ Coup | Nine months. That is how long it lasts. | B → **A** | Namseng knows the road in. Now he rides it home, with the whole Tang army at his back…! | B → **B** |
| 86 | Pyongyang II | Every son comes home in the end. Namseng brings the empire with him. | C → **A** | The story isn’t over yet. The Third Emperor still controls large swaths of Samhan. The fi… | A → **A** |
| 87 | Mount Gain | The night Pyongyang falls, the king of Silla goes to visit a piece of paper. | C → **A** | To find the first king of this land, we have to go back before there were kingdoms… to a … | B → **B** |
| 88 | Dangun & Old Joseon | Before there are any kingdoms, there is a son in heaven who keeps looking down. He is Hwa… | B → **B** | Eight hundred years later, the empire comes back to the same river to do the same thing. … | B → **B** |
| 89 | Anseung | Every revival needs two things: a flag and a royal. Geom Mojam has the flag. | C → **B** | The emperor hears there is a king of Goguryeo in Silla. His general reaches for a brush i… | B → **B** |
| 90 | Letters | In high summer, a Tang monk is rowed ashore under a white flag. He carries a letter from … | B → **B** | The Tang are coming south. Silla is winning. That is exactly when armies start to chase…! | B → **B** |
| 91 | Stone Gate | Winning is the most dangerous thing an army can do. | D → **A** | Wonsul came home alive. In his father’s house, that is the crime…! | B → **A** |
| 92 | Wonsul | Wonsul gets home a day before the news does. It doesn’t help. | B → **A** | Yushin is old now. The three sisters in the steam are not. They have kept his ledge warm … | B → **B** |
| 93 | Kim Yushin† | Old now, between campaigns that are mostly paperwork, Yushin still finds the cavern. The … | B → **B** | The king has buried his uncle. He still has one letter to answer, and a path nobody ever … | B → **A** |
| 94 | The Wanggeom's Guest | The day after the funeral, a letter falls out of a sleeve. | B → **A** | Kim Punghun said he could wait for a ship. The ship is here…! | B → **B** |
| 95 | Maeso | Xue Rengui comes back by sea in the ninth month. His pilot is Kim Punghun. Munmu killed h… | B → **B** | One last river mouth. One captain who has never won a fight. Three tries to end a war…! | B → **B** |
| 96 | Final Ford | In the second month, the emperor's headquarters quietly leaves Pyongyang. Then it moves f… | B → **B** | The boy who stole a sentence at six is about to be king of all Samhan. His mother would l… | B → **B** |
| 97 | The King for All | Bupmin, King Munmu now, stands where a six-year-old once stole a sentence. The war is won… | B → **B** | But we left someone in the snow. The winter Pyongyang fell, a Mohe father walked north wi… | B → **B** |
| 98 | Balhae | The winter after Pyongyang falls, the mountains of Manchuria do not care who won. Snow co… | B → **B** | THE END | C → **B** |

**Notes on the grades below C (before)**

- #2: first C, Explains the meeting before showing it. last C, Leads to Jinheung through 'sleeves', not through why the court is looking back. Needs the new-queen nostalgia.
- #5: last C, The chant is quoted, but no character feels the lack. Euija should lament that Baekje needs a new story.
- #7: first C, Plain staging, no verdict.
- #8: first C, Recap ('So Yeon rides…') and an office string. last C, Narrator-only bridge to Gwanggaeto. Gesomun should lament appeasement and long for the glory days.
- #10: first C, Date-stamp opening.
- #13: first D, File-card: ages in parentheses, a three-sentence summary of a romance it should play.
- #16: first C, Repeats the previous card word for word.
- #18: first C, Obituary opening with an age.
- #21: first D, Overwritten paragraph, an em-dash, and a cavern visit that duplicates #45.
- #23: first C, Picks up the card, but restates it.
- #24: first C, Long summary; the banquet is announced before it is felt.
- #25: first C, Backstory sentence with a stacked clause.
- #26: first D, Newswire line.
- #28: first D, 'In the meantime…' with an office string.
- #29: first C, Dialogue cold-open with no speaker context.
- #31: first D, File-card: years, murders, a list of nations.
- #33: first C, Plot summary.
- #35: first F, AD year in narration's first line, textbook register.
- #36: last C, Narrator-only bridge. The city that just survived the greatest emperor should ask who the Holy King is, and why Yodong gave him a bride.
- #38: first C, Continues mid-thought; no hook of its own.
- #39: last D, Leaves Jumong for Surabol without closing the Holy King or the Yodong bride.
- #40: first D, Travel note. No hook for the episode that opens the rebellion.
- #41: last C, Restarts the clock instead of returning to a day.
- #42: first D, Opens on a record, not a scene.
- #43: first C, Golden-age summary.
- #44: last C, Leads to Seohyun 'fifty years back' with no Day 9 cavern reason.
- #45: last C, Skips the ghosts' meeting; must hand to Day 9 at the cavern.
- #51: last C, Rewinds to Jahee and buries the Hyukgose lead-in an episode away.
- #52: first C, Logistics opening. last C, 'So did Silla's first' is thin. The reason to tell Hyukgose (a new king, Tang customs, Bidam's 'six elders', why blood rules Silla) is missing.
- #53: first F, Names Old Joseon 35 episodes before its own box, run-on.
- #55: first C, Restates the card.
- #56: first D, Obituary line.
- #57: first C, Stage direction.
- #59: first D, 'This is the story of…' label.
- #66: first D, Generic summary.
- #68: first C, Newswire.
- #69: first C, Plain.
- #71: first D, Opens on a label ('Epilogue · Part II') and mixes Korean into the English.
- #72: first C, File-card on a new general.
- #73: first C, Plain.
- #74: first C, Plain.
- #75: first C, Long setting.
- #77: first C, 'The bill comes due' with no context.
- #78: first C, Place description.
- #80: first D, Summary line.
- #82: first C, Backstory summary.
- #83: first C, Confusing callback.
- #86: first C, Recap of the beasts.
- #87: first C, Name dump; the timeline runs backwards from #86 with no seam.
- #89: first C, Recaps the previous card.
- #91: first D, Place names and a summary of the mistake.
- #98: last C, Ends on 'THE END' after an era label; the last line should land on Gulgul's son, not a stamp.

## Protect these (they work)

- **Episodes:** #4, #11, #57, #27, #17, #12, #24, #25, #37, #38, #54, #69, #74, #90, #98.
- **Moments:**
  - Jolbon's well scenes;
  - Jeon's kite and Hangyul;
  - Gyeol's deathbed;
  - Yellow Mountain's count and parley;
  - #66's forged omens ("Well made");
  - #86's bell and the bow to the purple horse;
  - #93's "I wanted in".

## Discarded findings (dump artifacts or overstatements)

- **Emoji speaker labels** (#51 "a chorus of anonymous emoji speakers", #72 [44]–[48] 🙇). Those blocks have a `person`, and the reader shows the name. Only 20 lines in the book show an emoji speaker, mostly crowds.
- **Later regnal names on early lines** ("King Munmu" in 641). The reader uses `nameOf(person, year)`, so it shows "Bupmin" and "Chunchu".
- **"#45 replays #21 word for word."** The scene is retold, but only five sentences are identical, all from the prophecy.
- **"#69's 655 flashback has Gyebek marching to Yellow Mountain."** He plans it, which reads as foresight.
- **"The nation Baekje speaks in #18."** `person: "nation-baekje"` is a recurring chorus voice for chants and omens (five lines across #6, #18, #19, #65 and #66), not a mislabel.

## Per-arc notes

- **#1–#9 The King for All.** A smart hidden skeleton: three pilots, each followed by a flashback king whose glory becomes the next grudge. The surface reads as three unrelated pilots under explainer cards. Best #4, then #7. Worst #5 (a quote plus nine term cards, and the Gyebek–Jinmo payoff is four sentences of summary) and #1.
- **#10–#20 The Five Principles.** The highest-scoring slice (mean 17.1/25). The spine is Daeya: Silla's princess moves into a border fort, and Baekje's new king picks it, but nobody says so. Best #11 Sadaham, then #17 Dosuryu and #12 Gotaso. Both romances skip the scenes that would make us root for the couple, and Pumsuk has no voice.
- **#21–#30 Iron Will.** Chunchu's year is a strong spine: Daeya takes his daughter, he spends his hand in Yeon's hall, and he comes home wanting the crown. #24–#27 approach the Euija bar. It opens on about 7,000 words of cavern and sex scenes, the siege is offstage, and Gumil is a blank. Best #27 Nangbi. Worst #21.
- **#31–#39 The Seventh Invasion.** The great motif is names: the emperor nobody may name, the Guardian nobody recorded, Yuhwa trading her name. The invasion is filed, not dramatised, and told from the invader's side. Only Ansi's earthen mountain is staged. Best #38 Buyeo and #37 Haemosu. Worst #35.
- **#40–#55 The Chunchu Era.**
  - Bidam's four acts (#40, #42, #44, #46) work as a thriller but are broken by #41 and #45.
  - #48–#51 are Chunchu's rise, with great Tang company (the Second Emperor, Li Zhi, Wu), but the biggest moments are told.
  - #52–#55 stall the present and don't lead into Baekje.
  - Best #44 and #54. Worst #41 and #53.
- **#56–#71 The Fall of Euija.** It holds the book's best thematic payoff: in #66 a better storyteller beats the king who faked miracles. Nine of 16 episodes are myth, and the Euija–Gyebek bond never gets a scene. Best #57 and #69. Worst #71 and #68; the worst passage is #65 [14]–[26].
- **#72–#77 The Fall of Baekje.**
  - #72 is the best-staged battle in the book, and #74's confession is the best Euija since #4.
  - The Euija–Gyebek payoff happens off the page.
  - #73 stalls on seven quotes, and #76 has no point of view.
  - Best #72. Worst #73.
- **#78–#98 The Final Stand and the Silla–Tang War.** A dozen great payoffs, including Shinsung's bell, the bow to the purple horse, Yumla's courtesy call and Gulgul's shard. The climaxes arrive as records and messengers. Best #90 Letters, then #87 and #98. Worst #80, with #96 the costliest weak spot.
