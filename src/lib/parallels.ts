/**
 * Running typology list. Add a row; the dashboard Types view reads this file.
 *
 * titles   — title-card flashbacks, chronological, and the virtue each one carries
 * rhymes   — an earlier figure in this book and the later one who repeats them
 * scripture — a figure in this book and the biblical type they rhyme with
 *
 * Escalation: the later one is larger. Contrast: the rhyme is where they split.
 * Pattern: the same job, done again.
 */

export type Move = 'escalation' | 'contrast' | 'pattern';

export type TitleType = {
	year: string;
	figure: string;
	ko: string;
	represents: string;
	note: string;
};

export type Rhyme = {
	earlier: string;
	later: string;
	move: Move;
	pattern: string;
};

export type ScriptureType = {
	figure: string;
	type: string;
	move: Move;
	pattern: string;
};

export const TITLE_TYPES: TitleType[] = [
	{
		year: '태초',
		figure: 'Heaven–Earth King',
		ko: '천지왕',
		represents: 'Stewardship, abdication, the one desk',
		note: 'Two suns, two moons, and no border. One man held all three realms, then refused the desk.'
	},
	{
		year: '태초',
		figure: 'Gardener',
		ko: '할락궁이',
		represents: 'Making, souls, the flower',
		note: 'The Life Flower has a keeper. Souls are grown, not decreed.'
	},
	{
		year: '태초',
		figure: 'Grim Reaper',
		ko: '강림',
		represents: 'The hour, the book, a law above magistrates',
		note: 'The strongest man in the living world is sent to arrest the judge of the dead. A crow loses the book of everyone’s hour.'
	},
	{
		year: '태초',
		figure: 'Three Princes',
		ko: '삼성혈',
		represents: 'The ground, the sealed chest, a people beginning',
		note: 'Tamla starts as a chest sealed with purple clay, and three brothers who have to open a country.'
	},
	{
		year: 'Long ago',
		figure: 'Dangun',
		ko: '단군왕검',
		represents: 'Mandate, staying, the first king',
		note: 'Heaven’s grandson takes the office and, at the end of it, becomes the mountain.'
	},
	{
		year: '−59–−38',
		figure: 'Haemosu',
		ko: '해모수',
		represents: 'The glance, appetite, a god who breaks his route',
		note: 'The sun has a road. He looks down anyway, and a kingdom starts from the looking.'
	},
	{
		year: '−57',
		figure: 'Park Hyukgosé',
		ko: '박혁거세',
		represents: 'Omen, acclamation, the child the elders dig up',
		note: 'A white horse, six chiefs, and a boy who is found rather than born in a bed.'
	},
	{
		year: '−37',
		figure: 'Jumong',
		ko: '주몽',
		represents: 'Exile, the one bow, a new house',
		note: 'Hunted by the house that raised him. The bow is the only thing that is his, and then the kingdom is.'
	},
	{
		year: '−36–32',
		figure: 'Hodong',
		ko: '자명고',
		represents: 'Desire, treason, the secret',
		note: 'A princess cuts the drum she was trusted with. Love opens the city, and the city dies of it.'
	},
	{
		year: '−18',
		figure: 'Onjo',
		ko: '온조왕',
		represents: 'The unspoken father, departure, a second altar',
		note: 'He leaves the father’s house and builds another so his people will not have to go back north.'
	},
	{
		year: '42',
		figure: 'Suro',
		ko: '김수로',
		represents: 'Calling, the long look, a covenant by sea',
		note: 'A ridge that is not yet a people, and a ship he is told to wait for.'
	},
	{
		year: '300',
		figure: 'Ulbul',
		ko: '을불',
		represents: 'Disguise, mercy, a king from a cave',
		note: 'A salt seller. An old man on his knees. The crown comes out of a hole in the ground.'
	},
	{
		year: '408–418',
		figure: 'Momal',
		ko: '박모말',
		represents: 'Loyalty, trickster, sacrifice',
		note: 'The hall said Jesang. The boats were Momal. He talks a king into a guest, then burns so the prince can sail.'
	},
	{
		year: '532',
		figure: 'Muryuk',
		ko: '김무력',
		represents: 'Assimilation, bravery, masculinity',
		note: 'The youngest son, promised everything the sun touches. Silla comes shopping, and he keeps the sword by giving up the kingdom.'
	},
	{
		year: '560–564',
		figure: 'Sadaham',
		ko: '김사다함',
		represents: 'Friendship, youth, vigor',
		note: 'Two boys who never miss roll call. The virtue is showing up.'
	},
	{
		year: '593',
		figure: 'Seohyun',
		ko: '김서현',
		represents: 'Chance, seed, the father not looking',
		note: 'The night before Yushin. A household made out of a surrender, by a man whose eyes are elsewhere.'
	},
	{
		year: '576–653',
		figure: 'Kim Yongsu',
		ko: '김용수',
		represents: 'The spared, strangeness, mercy',
		note: 'Nobody kills the strange boy. The line the council tried to erase keeps being found on a river bank.'
	},
	{
		year: '576–654',
		figure: 'Bihyung',
		ko: '비형랑',
		represents: 'The mask, wit, the useful madman',
		note: 'He hears the dead, laughs in the sack, and plays the fool until the court needs a ghost it can govern with.'
	}
];

export const RHYMES: Rhyme[] = [
	{
		earlier: 'Sobyul',
		later: 'Onjo',
		move: 'pattern',
		pattern:
			'The younger takes the living country. Sobyul cheats the flower wager and keeps 이승; Daebyul is left the dead. Onjo leaves the father’s house and builds the southern kingdom so his people will not go back. Jacob’s birthright, done twice: once among the gods, once among the sons.'
	},
	{
		earlier: 'Momal',
		later: 'On Gunhae and Gildal',
		move: 'pattern',
		pattern:
			'The Three Loyalists, three centuries apart, one job. Jesang puts a prince on a boat and burns. On Gunhae puts on the high cap so Chunchu can leave in a small boat. Gildal sets the knife so Yongsu can stay in the king’s good graces. Each one wears the thing. Each one says they will meet again up there.'
	},
	{
		earlier: 'Momal',
		later: 'Chunchu',
		move: 'escalation',
		pattern:
			'Both are the skilled trickster, the foreign emissary, the charming speaker who can make a surrender sound like a visit. Momal dies in the role. Chunchu survives it and, once he is king, spends On Gunhae the way Nulji spent Momal. He has been promoted into the man who asks someone else to go.'
	},
	{
		earlier: 'Jinji',
		later: 'Euija',
		move: 'escalation',
		pattern:
			'A debauched king who used to be promising. Jinji loses a war and drowns it in three years of parties, then is carried out barefoot still asking after the boy. Euija is the same arc stretched over a kingdom: the chant, the one agreed story, the feast, and a capital that cannot hear the warning.'
	},
	{
		earlier: 'Changjori and Ulbul',
		later: 'Gesomun',
		move: 'escalation',
		pattern:
			'Kill the king to save the nation. Changjori puts a branch in his cap and locks a famine-king in a side room so the salt seller can be crowned. Gesomun does both jobs in one body: he removes the king and takes the power, and he does not kneel in the mud afterward.'
	},
	{
		earlier: 'Kangrim',
		later: 'Gesomun',
		move: 'pattern',
		pattern:
			'Both fight the emissaries of hell and win. Kangrim is the clerk of the hour; a magistrate’s strongest man cannot arrest him. Gesomun does the reaper’s work with swords, and the living world still has to live with the man who won.'
	},
	{
		earlier: 'Eulji',
		later: 'Gesomun',
		move: 'contrast',
		pattern:
			'The general who turns an emperor back at the wall, and the later general who wants to be that man. Eulji fights the invasion. Gesomun has already killed his own king before the invasion arrives, so the rhyme arrives carrying blood.'
	},
	{
		earlier: 'Geunchogo',
		later: 'Euija',
		move: 'contrast',
		pattern:
			'The king who earned the chant, and the king the chant was saved for. Geunchogo rides north and the story outlives him. Euija spends that story until Daeya burns. The same sentence, said by a man who can still win and by a man who cannot.'
	},
	{
		earlier: 'Jumong',
		later: 'Gwanggaeto',
		move: 'escalation',
		pattern:
			'The founder with one bow, and the king of the widest borders. The stele is the temple the exile never built. After the stone, the kingdom is never that large again.'
	},
	{
		earlier: 'Jumong',
		later: 'Onjo',
		move: 'contrast',
		pattern:
			'The kingdom splits in the sons. Jumong founds the house. Onjo will not say the father’s name and builds a second altar in the south so the people have a reason to stay.'
	},
	{
		earlier: 'Onjo',
		later: 'Gyebek',
		move: 'contrast',
		pattern:
			'Onjo walks out of a house to found one. Gyebek is the last captain of that house, and he will not walk. The reverse grip dies on the hill the founder never had to stand on.'
	},
	{
		earlier: 'Sadaham',
		later: 'Yushin',
		move: 'escalation',
		pattern:
			'Friendship kept like a rank. Sadaham is the boy who never misses roll call. Yushin is that virtue grown into a marshal who stands in the yard and will not sit in lotus. Showing up becomes a life.'
	},
	{
		earlier: 'Sadaham',
		later: 'Gwanchang',
		move: 'contrast',
		pattern:
			'The same youth, spent in one charge. Sadaham is given the years. Gwanchang rides out at Hwangsan and is not given back. The vigor was real in both. Only one of them is allowed to grow old inside it.'
	},
	{
		earlier: 'Seohyun',
		later: 'Yushin',
		move: 'contrast',
		pattern:
			'The father who is not looking, and the son who counts everything. Seohyun makes a surrender into a household with his eyes elsewhere. Yushin inherits the household and looks at the yard until it becomes a kingdom.'
	},
	{
		earlier: 'Muryuk',
		later: 'Yushin',
		move: 'escalation',
		pattern:
			'Three Gaya Kims, grandfather to grandson. Muryuk trades a kingdom so the blood can keep a sword. Yushin makes that sword the legend of Silla and never asks for the kingdom back. The purchase is completed as duty.'
	},
	{
		earlier: 'Hyukgosé',
		later: 'Alji',
		move: 'pattern',
		pattern:
			'Found, not born in a bed. A white horse by the well, then a gold box in the forest. Silla keeps receiving its kings as omens other people dig up.'
	},
	{
		earlier: 'Bihyung',
		later: 'Bidam',
		move: 'escalation',
		pattern:
			'The useful madman. Bihyung plays the fool, hears the dead, and the court uses him. Bidam plays the sutra, the beads, the man of this soil, until the performance is good enough that the palace locks the door on him.'
	},
	{
		earlier: 'Gildal and Bihyung',
		later: 'Bidam',
		move: 'pattern',
		pattern:
			'Both lead a rebellion that is really about the king’s favorite. Gildal leads the forty under the wall; Bihyung is the prince they are hiding and the madman the city thinks is in charge of the ghosts. Bidam leads the hill at Radiance. The slogan insults the person on the throne. The fury is for the man beside the throne.'
	},
	{
		earlier: 'Yongsu',
		later: 'Yushin',
		move: 'pattern',
		pattern:
			'The king’s favorite. Jinpyung takes Yongsu in, names him Bihyung, and gives him a princess. Sunduk gives Yushin the war. The rebels can shout at the crown all day. The man they cannot stand is the one the crown keeps.'
	},
	{
		earlier: 'Gildal',
		later: 'Bidam',
		move: 'escalation',
		pattern:
			'The leader of the rebellion. Gildal has forty masks and a bridge. Bidam has a fortress, a headband, and ten days. Both die in the favorite’s arms, still talking to him.'
	},
	{
		earlier: 'Gildal in Bihyung’s arms',
		later: 'Bidam in Yushin’s arms',
		move: 'pattern',
		pattern:
			'The tearful death. Gildal comes for Duduri and dies crying in Bihyung’s arms on the south road, telling him to stay in the king’s good graces. Bidam’s last mortal words are the old yard name, “Hwarang Kim Yushin,” and he dies in those arms. The favorite is the one left holding him.'
	},
	{
		earlier: 'Duduri',
		later: 'Yumjong',
		move: 'escalation',
		pattern:
			'The loyal second. Suulbu takes Duduri and has him killed, and Gildal goes out after the body. Chunchu takes Yumjong, has the slogan beaten out of him once, and lets him go. Yumjong walks back up the hill. On the eighth night he disobeys Bidam, dies on Yushin’s sword in the outer ditch, and the hill is not the same rebellion after that. Suulbu spends the man. Chunchu spends him and still gets the use of him.'
	},
	{
		earlier: 'Suulbu',
		later: 'Chunchu',
		move: 'escalation',
		pattern:
			'The cunning mastermind. The stone-cold operator. Suulbu runs the purge, writes “Jinji’s man” beside the names he dislikes, and makes the king send the madman to fetch Gildal. Chunchu does not hold the knife. He sits in a radish cellar with one cup of tea, hears “a woman cannot rule well,” nods at the guard, and sends the second back with a sentence about a dying father. The cruelty is the courtesy afterward.'
	},
	{
		earlier: 'The Song of Bihyung, the Ghost Child',
		later: 'Bidam’s banner',
		move: 'pattern',
		pattern:
			'The winter he takes the High Councillor’s chair, the key comes with it. Supum never opened Suulbu’s chest. Bidam does, looking for a precedent, and finds a dusty book, 귀자 비형랑의 노래: a madman, forty masks, a bridge in a night, a second who is taken. He reads until the incense dies and locks it back up. The chronicle does not say the banner came out of the song.'
	},
	{
		earlier: 'Jinpyung',
		later: 'Sunduk',
		move: 'pattern',
		pattern:
			'The king who is not the target. The Ghost Children sit under Jinpyung’s city and want the Council, and Suulbu, undone. Bidam’s banner says a woman cannot govern, and the man he spends the ten days talking to is Yushin. The slogan names the throne. The war is with the favorite.'
	},
	{
		earlier: '귀자 (鬼子)',
		later: '흑자 (黑子) — working name',
		move: 'pattern',
		pattern:
			'A two-syllable slur the rebels keep. 귀자 is the court’s word for the dead king’s orphans, ghost plus child, and they wear it. 흑자 would be the court’s word for the men in Bidam’s old black hwarang headband, black plus child. Same grammar. Not yet shouted in the episode. 토자 (soil’s children) if the name should be his ideology; 화자 (flower’s children) if it should be the yard they never left.'
	},
	{
		earlier: '유주불능선리 (幼主不能善理) — working slogan',
		later: '여주불능선리 (女主不能善理)',
		move: 'pattern',
		pattern:
			'The same four-beat verdict, one noun changed. A child lord cannot govern well, said of Jinpyung, crowned at eleven while the real son is in the reeds. A woman lord cannot govern well, said of Sunduk. 女主 and 幼主. The sentence insults the person sitting down. Both times the person they came for is standing behind the chair.'
	},
	{
		earlier: 'Bihyung',
		later: 'Chunchu',
		move: 'contrast',
		pattern:
			'The son who grows up ashamed of the father and thinks him only a madman. Chunchu inherits the long game and drops the laugh. The mask worked. The boy who hated it becomes the serious version.'
	},
	{
		earlier: 'Jinji’s lost line',
		later: 'Kim Yongsu',
		move: 'pattern',
		pattern:
			'The strange boy nobody kills. The council carries Jinji out and tries to end the blood; Yongsu keeps being found on a river bank, and Gildal dies so that boy can stay inside the palace and be useful.'
	},
	{
		earlier: 'Dangun',
		later: 'Munmu',
		move: 'contrast',
		pattern:
			'The first king is given the mandate and, at the end, becomes a mountain. He walks the steam once for Munmu and is gone. Munmu, holding the conquest, asks to become a dragon of the sea. One office ends as landscape. The later king asks to remain a god.'
	},
	{
		earlier: 'Chunmyung',
		later: 'Sunduk',
		move: 'contrast',
		pattern:
			'The Sacred Bone running out of men. Chunmyung trades her claim for the son who will be king. Sunduk keeps the crown and does the arithmetic. Two ways to close a holy line: spend it on a boy, or sit it until the numbers run out.'
	},
	{
		earlier: 'Gildal’s “up there”',
		later: 'Kangrim',
		move: 'escalation',
		pattern:
			'The loyalists die promising a meeting above. Kangrim is the clerk of that room. He asks the dead their name and does not greet them as friends. The heaven they meant is an office with a book.'
	}
];

export const SCRIPTURE_TYPES: ScriptureType[] = [
	{
		figure: 'Dangun',
		type: 'Adam in office, and Melchizedek',
		move: 'pattern',
		pattern:
			'The first king of the garden, with no line the later crowns can quite claim. He takes the mandate, stays, and returns to the mountain. Like Melchizedek he is king and priest of a peace the genealogies do not own.'
	},
	{
		figure: 'Ungnyeo',
		type: 'Eve',
		move: 'pattern',
		pattern:
			'She stays in the dark and becomes the mother. The tiger walks out. The line of kings begins with the one who endured the condition.'
	},
	{
		figure: 'Hwanung',
		type: 'The descent, once',
		move: 'contrast',
		pattern:
			'The son is sent with the seals. The book does this once. Later kings cut their own seals and call that heaven. A second descent would make the history a costume.'
	},
	{
		figure: 'Heaven–Earth King',
		type: 'Noah, and Moses at the border',
		move: 'pattern',
		pattern:
			'Two suns and a world that kills, then a boat into the west. He has held every realm and refuses the desk he would have to carry into the next one. The captain sees the land and does not cross with it.'
	},
	{
		figure: 'Daebyul and Sobyul',
		type: 'Esau and Jacob',
		move: 'pattern',
		pattern:
			'The elder is the firstborn of the dead country. The younger cheats the wager and receives the living. The patriarch of the promise is the one who stole it, and the story does not give the birthright back.'
	},
	{
		figure: 'Haemosu',
		type: 'The sons of God who look down',
		move: 'contrast',
		pattern:
			'A chariot that belongs on its road, used for a glance. The line of Goguryeo begins where a god breaks his route. Elijah’s chariot goes up. This one comes down and stays long enough to start a house.'
	},
	{
		figure: 'Jumong',
		type: 'David',
		move: 'escalation',
		pattern:
			'Hunted by the king whose house raised him, one weapon only he can use, exile, then a kingdom. The kingdom splits in the next generation. Daeso is the Saul. The bow is the sling. Onjo is the split.'
	},
	{
		figure: 'Jumong’s river',
		type: 'The sea in Exodus',
		move: 'pattern',
		pattern:
			'What should drown him carries him. Turtles, fish, a crossing the pursuers cannot make. The founder’s miracle is an escape, and the kingdom is whatever is on the far bank.'
	},
	{
		figure: 'Onjo',
		type: 'Jeroboam',
		move: 'contrast',
		pattern:
			'He will not speak the father’s name. He builds a second altar so the people have a feast of their own and no reason to go north. The long mistake of the southern house starts as an act of care.'
	},
	{
		figure: 'Park Hyukgosé',
		type: 'Moses drawn out',
		move: 'pattern',
		pattern:
			'A child in the woods, a horse, six elders who did not make him and acclaim him anyway. The basket is a forest. The people find the king already there.'
	},
	{
		figure: 'Talhae',
		type: 'Joseph',
		move: 'pattern',
		pattern:
			'A chest from the sea, a foreign boy who can read the omen, and a house that ends up his. Envied, unpacked, then inside the succession.'
	},
	{
		figure: 'Suro',
		type: 'Abraham',
		move: 'pattern',
		pattern:
			'Called to a ridge that is not yet a people. He waits because he was told a ship is coming. The covenant arrives as a person, from over the water.'
	},
	{
		figure: 'Heo',
		type: 'Rebekah',
		move: 'pattern',
		pattern:
			'The foreigner whose arrival is the promise. She comes by sea the way Rebekah comes to the well, and the line continues because she said yes to a country she had not seen.'
	},
	{
		figure: 'Hodong’s princess',
		type: 'Rahab, inverted',
		move: 'contrast',
		pattern:
			'She opens the gate for love. Rahab’s treason saves her house. This one cuts the drum and the city dies with her. The same act, and the story does not spare her.'
	},
	{
		figure: 'Gwanggaeto',
		type: 'Solomon',
		move: 'escalation',
		pattern:
			'The widest borders, the law cut in stone, a greatness the sons cannot repeat. The stele is the temple. After it the kingdom shrinks, and everyone keeps pointing at the stone.'
	},
	{
		figure: 'Jinheung',
		type: 'Solomon’s yoke',
		move: 'contrast',
		pattern:
			'The expander writes bone rank, and the next generation has to live inside a holiness that runs out of men. The glory and the law that rots the glory are the same reign.'
	},
	{
		figure: 'Kangrim',
		type: 'The destroyer who keeps the book',
		move: 'pattern',
		pattern:
			'A magistrate sends his strongest man. The hour does not answer to magistrates. Pharaoh’s magicians cannot arrest the plague. The crow, the book, and the question at the death are the office.'
	},
	{
		figure: 'Momal, On Gunhae, Gildal',
		type: 'Jonathan',
		move: 'pattern',
		pattern:
			'They love the house more than the throne. Jonathan gives David the robe and dies in the war. Gunhae wears Chunchu’s cap so Chunchu can live. Momal burns. Gildal sets the knife and says they will meet again up there. The loyal one is the body that goes.'
	},
	{
		figure: 'Chunchu',
		type: 'Jacob abroad, and Joseph before Pharaoh',
		move: 'escalation',
		pattern:
			'A trickster who can talk, sent into a foreign court, charming enough to come home with the blessing. Joseph’s blessing saves the brothers from famine. Chunchu’s blessing is an alliance, and the brothers of the peninsula pay for it.'
	},
	{
		figure: 'Jinji and Euija',
		type: 'Saul',
		move: 'escalation',
		pattern:
			'Anointed, promising, then the feast and the fear. Saul ends with a medium because heaven has stopped answering. Jinji is carried out still asking after the boy. Euija keeps one story until the story is the only thing left in the hall.'
	},
	{
		figure: 'Gesomun',
		type: 'Jehu',
		move: 'escalation',
		pattern:
			'The captain who ends a rotten king to save the nation, and then becomes the house the blood was spilled for. The nation is saved into the hands of the man who did the killing. The rhyme does not wash the knife.'
	},
	{
		figure: 'Yushin',
		type: 'Joshua',
		move: 'escalation',
		pattern:
			'He does not sit the throne. He takes them into the land the founders only promised, sincere, standing, counting. The sincerity is how the conquest hardens. Joshua’s faithfulness and the political “one” arrive in the same man.'
	},
	{
		figure: 'Sadaham',
		type: 'David and Jonathan, young',
		move: 'pattern',
		pattern:
			'Two who do not miss the day. The covenant is attendance. Before either of them is a legend, the virtue is that both of them came.'
	},
	{
		figure: 'Gwanchang',
		type: 'Jonathan on Gilboa',
		move: 'contrast',
		pattern:
			'The young one rides out for the house and is not given back. Jonathan dies on the hill with the king he loved. Gwanchang dies on Hwangsan in his father’s war, and the father lives to finish it.'
	},
	{
		figure: 'Bidam',
		type: 'Absalom',
		move: 'contrast',
		pattern:
			'Loved, religious, sure the kingdom should have been his. The beads and the sutra are real. The door is locked anyway. Absalom’s beauty and Bidam’s devotion are the rebellion’s best argument, and the argument loses.'
	},
	{
		figure: 'Gyebek',
		type: 'The last judge',
		move: 'contrast',
		pattern:
			'He dies on the hill and the city is not saved. The judges win often enough that the people think the hill is a method. This one is the end of the method. Five thousand, a reverse grip, and Sabi falls after him.'
	},
	{
		figure: 'Munmu',
		type: 'The king who wants a monument',
		move: 'contrast',
		pattern:
			'After Joshua comes the king who builds. Munmu asks to become the dragon of the sea, a worship that outlasts the body. Dangun, given more, became a mountain and stopped answering. The later king asks for the office the first one laid down.'
	},
	{
		figure: 'The cavern three',
		type: 'The medium at Endor',
		move: 'contrast',
		pattern:
			'Narim, Golhwa, Hyullé still speak after the greater heaven has gone quiet. Saul goes to Endor because the Lord has stopped answering. Their last power drives Bidam out and does not make him holy. Then the steam thins, and the poles keep standing.'
	},
	{
		figure: 'Balhae',
		type: 'The remnant',
		move: 'pattern',
		pattern:
			'A shard of the old house, north, with the name and not the garden. It is the people who kept the letters, not the city everyone was promised.'
	}
];

export const MOVE_LABEL: Record<Move, string> = {
	escalation: 'Escalation',
	contrast: 'Contrast',
	pattern: 'Pattern'
};
