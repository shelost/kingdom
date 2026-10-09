# pilots — #1–#9 (The King for All, Part I)

Script: `scripts/.cache/rewrite/pilots.mjs` (idempotent; one `editStory` per episode). `validate.mjs 1 9` → ok. Anchors: no new unmatched in range; the baseline breaks in #1 (council-blue-table, three-crowns-symmetry) and #5 (clan-tourney-spectators) are now fixed. Only #7's two baseline breaks remain.

## #1 Queen Sunduk
- Changed: the queen is introduced on the page, answers "ridiculous", and is named early. Seungman is now her cousin. The crowning happens in the scene, with Suljong carrying the crown. Pumsuk, the market woman, Cheomseongdae, the table, Inmun, Youngryu and Jomei are cut. Yushin, Munhee, Chunchu, Gotaso and Bupmin each get a scene, and the east-star flashback moves to the hill.
- First line: "A Queen? Ridiculous." (locked)
- Card (24 words): "Six men who hate the word “woman” crowned one anyway. One of them carried the crown. How? Go back one night, to a brazier…!"

## #2 Harmony Council
- Changed: a cleaner climax. The vote runs from 3–3 to 4–2 (Murim) to 5–1 (Alchun's tiger) and ends on Suljong's last piece ("…Ridiculous."). Yushin has no seat, Chunchu waits on the bridge, and the duplicate quote and diagrams are cut. A new dawn scene lets Sunduk speak, and Alchun invokes the Cloud King, which leads into #3.
- First line: "One night earlier. Six nobles, one brazier, and nobody stands up until they all agree."
- Card (21): "Every man who voted that night grew up in her great-grandfather’s yard. Who was the Cloud King? Ask anyone in Surabol…!"

## #3 Jinheung, the Cloud
- Changed: the episode is framed on coronation night, with an old Hwarang telling Sunduk about the Cloud King. A new flashback (576) puts the monk-king at the yard fence. The betrayal stays withheld for #20. Sunduk resolves to build the star tower (an unnamed Cheomseongdae plant). The herald, the Hwarang annal quote and the name list are cut.
- First line: kept ("Ask anyone in Surabol about the Cloud King…")
- Card (22): "The rain fell on Baekje’s field, and Baekje kept the grudge. In five days, it names the prince who will inherit it…!"

## #4 Prince Euija
- Changed: only Silla, to honour #3's grudge. King Mu mentions Silla's queen, and Euija answers "It still owes us a river."
- First line and card: unchanged.

## #5 Eight Great Clans
- Changed: eight terms, the Satek stele, cites and a diagram are cut, along with the levy anecdote and the West Bridge scene. A new Last Bout puts Gyebek against the Jinmo boy. The Eraha chant is planted here. The clans agree they dislike the boy. In a new Rock at Dusk scene, Euija laments that the country needs a new story (his #19 line is not used).
- First line: locked list.
- Card (22): "Why is one dead king the only thing eight houses still agree on? To find out, we go back three hundred years…!"

## #6 Gunchogo, the 13th (stub grown)
- Changed: new Camp and Wall scenes: the father and son by the fire, the Goguryeo king refusing to leave the wall, and the stray arrow. Geunchogo turns home ("something better"). The Baekje quote and the Seven-Branched Sword quote are cut.
- First line: kept.
- Card (23): "North, then, three hundred years on, to the snow and Goguryeo’s most frightening commander. First question: do you know what happens to traitors…?"

## #7 Commander Yeon
- Changed: the interrogation plays once, in order. Two quotes and a duplicate Gulgul card are cut. The north wall now remembers #6's king. Taejo plants the uncle ("He’ll be kind to you. That’s worse.").
- First line: "Everyone in the north has a story about the Eternal General. None of them are bedtime stories."
- Card: unchanged.

## #8 High Summit
- Changed: the Summit is trimmed, and Yeon is cut off mid-speech. The Tang quote is moved after the walkout. Yeon laments the tribute and Silla's old begging, which leads into #9. The Samsin painting is planted before it moves. A bedtime story closes the episode.
- First line: "Half, his father said. Yeon manages it until the second pot of tea."
- Card (21): "Once, Silla begged Goguryeo for an army, and Goguryeo came. To meet the king who answered, we go back two centuries…!"

## #9 Gwanggaeto (stub grown)
- Changed: new scenes in the burning capital, the plea ("Servants don’t decide when the master’s horsemen go home") and the horsemen. The hostage boy and a Silla Court chorus are added.
- First line: "Silla is drowning. An army from across the sea is inside its walls, and its king has one move left."
- Card (24): "The prince who will beg has a son. Bupmin is fifteen now, and his uncle has one question: which rule will you break first…?"

## Skipped / out of range
- Length: #3 (~790), #6 (~530), #7 (~790) and #9 (~480) are still under 2,000 words. Every one now has a full arc, but they are not padded to the sweet spot.
- #7 baseline anchors (`munhee-profile-blue-light`, `chunchu-royal-intimacy`) point at text that isn't in this episode. Those images belong to #1, so they should be moved there.
- #40 [27]: Seungman is called "sister". That belongs to another writer; it should be "cousin".
- #6 [24] narration ("a clever king who has already decided that a country is a story") was kept as is. It echoes, but does not quote, Euija's #19 line.
- The Seven-Branched Sword quote was cut from #6. If #77 needs a plant, it should come from that episode.
- Entry `year` fields (#3 is still 554) are left unchanged.
- #8 KO still says 사내가 났다는 뜻이다, which was trimmed from the English as redundant. It is harmless.
