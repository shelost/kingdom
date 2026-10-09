# Invasion rewrite notes (#31–#39)

Applied with `scripts/.cache/rewrite/invasion.mjs` (helpers in `invasion-lib.mjs`; `DRY=1` writes `/tmp/invasion-dry.json` instead of saving). Every episode goes through `editStory`, skips itself if its marker is present, and re-points any image anchor its cuts broke to the nearest surviving block. `validate.mjs 31 39` → `ok`. `anchor-check.mjs`: in-range unmatched is the baseline minus the two Colossal River anchors (now matched). Nothing new.

## Throughline added

Gesomun gets a voice in his own war, and he is the door to the myth: he refuses the Tang envoy (#31), sends Go Yeonsu and his sons (#32), hears his sons are taken (#34), remembers the Colossal River at seven (#35), meets the Guardian at the gate and finds the shrine bride at Yodong (#36), then tells her the story (#37–#39) and closes it at Yodong (#39). The old officer (#32) tells the Dongcheon story on the road (#33). That gives #33 a present-day reason, and Gesomun's memory gives #35 one.

## Per episode

**#31 Four Dragons** (1,644 words). The file-card open is gone. The emperor's taboo name is now the hook. The sickroom gets Chu Suiliang as diarist. The Western-dream rant, news roundup and dragon table are cut. A new scene, "Five Hundred Li", has Gesomun refusing the Tang envoy. The muster and dragons now come after the diplomacy, and the Longmen record pile is cut.
- First: "In Chang'an there is one word nobody says. It is the emperor's name."
- Card (kept, 17 words): "Yodong has never opened its gates to the West. Not for the Sui. Not in three summers. Here come the dragons…!"

**#32 Yodong** (1,130). The shrine bride gets a scene: Tang soldiers find her, and the emperor says "Leave her to him." The Holy King is hinted by name only ("they say Jumong, as if that settles it"). New beats: a name duel at Ansi, and the White Cliff lord opening his gate. The table and the quote are cut. In a new Pyongyang scene, Gesomun sends Go Yeonsu and his boys, and an old officer warns him off the open field.
- First (was C, "plot summary"): "Every wall assumes the enemy will knock."
- Card (20): "On the road to Ansi, the old man tells it anyway. Once, a king won twice and went back for a third…!"

**#33 Boiling River** (379). This is now the old officer's tale. It adds Dongcheon's boast, the captain who asked for scouts, and the captain riding off in the king's robe with no name. It closes back on the road ("…So did Wei."). The quotes are cut.
- First: "The old officer starts with the part kings like to hear. Goguryeo won. Twice."
- Card (19): "A hundred and fifty thousand men march toward an open plain. On a hill above it, the emperor is waiting…!"

**#34 Stallion Mountain** (1,503). Go Yeonsu ignores the old officer. The Black Dragon flanks through the valley, and the drums play on the mountain. Xue's letter home pays off the ancestors' graves, and the bridges get burned. The imperial robe goes over Sul Gedu. The cell scene is trimmed. A new Pyongyang scene has Gesomun hear that his sons are taken: "Let him come deep."
- First: "Go Yeonsu liked the old man's story. He just didn't think it was about him."
- Card (18): "Why isn't Gesomun afraid? Go back thirty-three years, to a general who surrendered seven times and won…!"

**#35 Colossal River** (620). Rebuilt as a scene with a want: Munduk wants the Sui at the river. It runs the Sui camp, then seven comic surrenders, then the poem ("He's telling you to go home, General."), then the river. It closes on Gesomun at seven, handed the Sui banner by his father. The AD-year opening, the edict, the formation and one quote are cut. Records are now under 20%.
- First: "Ulchi Munduk surrenders seven times on the way south. Every time, the river gets closer."
- Card (kept, 16): "Yodong fell. The forts fell. One wall is left, held by a madman whose name nobody wrote down…!"

**#36 Ansi** (1,025). Cut: the clerks' spoilers, the ring, the decoder paragraph and the quotes. Added:
- The Guardian's arrow at the parasol ("Find out his name").
- The cold tied to the grazed-out plain.
- The farewell bow and silk, with the name still refused.
- The marsh line: "Somebody tell me no. Anybody."
- Gesomun at the gate ("It's smaller than I thought." / "So's the emperor, up close.").
- The Yodong bride: "Nobody ever told me who he is."
- First (unchanged, B).
- Card (21): "Who was the Holy King, and why does Goguryeo give him brides? Seven hundred years back, the sun looked down…!"

**#37 Haemosu** (1,608). One repeat is cut. Added: Haemosu's leaving beat, and heaven's fine (while he is in the sky he may not set foot on earth). Three quotes are cut.
- First: "Every day the sun crosses the sky on the same road. Today he looks down."
- Card (kept, 15): "Dogs won't eat it. An axe won't split it. What on earth is inside Yuhwa's egg…?"

**#38 Buyeo** (1,937). Trims, plus:
- Oi, Mari and Hyupbo are introduced in the stables.
- The knife attack is now two beats.
- The half-sword is planted with Lady Ye ("Then she'll work it out faster.").
- The fat-horse handoff to Oi.
- Two turtle quotes are cut (the stele is kept).
- First: "Buyeo tries very hard to get rid of the egg. The egg declines."
- Card (kept, 19).

**#39 Jolbon** (3,495, down from 5,225). Lady Ye is admitted in Tabal's hall. The keepsake fight becomes a fight over the Buyeo wife and her lamp, and that motivates the walk-away. Sosuno bends the bow. Cut: the tsundere loop, the first loft scene, half of the grain room, the purring, the term box, the Pine Kingdom, Two Sons, and the codas. The ditch scene now has two cousins, and the fat horse pays off. A Yodong return closes the bride loop: Sosuno picked him, the bride takes off the crown, and Gesomun says "…Holy King. You big idiot. Look what they do in your name."
- First (unchanged, B).
- Card (kept, 21): "Back in Surabol, the queen is failing and the council must name who's next. It only takes one hand to lock the door…!"

## Skipped / out of range

- #33 (379) and #35 (620) stay short. They are told-tales inside the war, and padding them would cost the pace.
- C/D/F lines raised: #31 first (D), #32 first (C), #35 first (F), #36 last (C), #38 first (C), #39 last (D). #39's card text is kept, but the Yodong return before it now closes the Holy King and bride loop the grade asked for. The two-line #32 fix sits outside `invasion.mjs` (a one-off `editStory` prepend).
- `people.ts` Jumong arc still mentions the Pine Kingdom, which is now cut from #39.
- #40 should open on Surabol, the failing queen and the council, to pick up the card. Its D-graded "travel note" first line belongs to that writer.
- #26 has Gesomun saying "Son of Haemosu" before #37. That is a mild early hint; consider softening it.
- 116 #39 image anchors were re-pointed to surviving blocks (mostly loft, well and grain-room stills). Retire or regroup them in a stills pass.
