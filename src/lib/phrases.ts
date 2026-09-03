/**
 * Household idioms of the chronicle — Trojan-horse / Achilles-heel grade.
 * Each entry is entity: 'phrase': the figurative meaning a later age would say
 * out loud, not the literal person / place / institution that coined it.
 *
 * Alias discipline: prefer multi-word forms so they do not steal bare place
 * or person links (Surabol the city, Geunchogo the king, Ansi the fortress).
 */

import type { Person } from '$lib/people';

export const PHRASES: Person[] = [
	{
		id: 'phrase-gyebeks-5000',
		name: "Gyebek's Five Thousand",
		korean: '계백의 오천',
		hanja: '階伯五千',
		entity: 'phrase',
		kingdom: 'baekje',
		title: 'Idiom — elite squad prepared for death',
		tagline: 'An elite force that marches knowing it will not return.',
		quote: 'Five thousand against fifty thousand. That is the whole argument.',
		arc: 'At Yellow Mountain in 660, Hundred-Victories Gyebek answers fifty thousand with five thousand — and kills his own family first so nothing can be used against him. Later ages stop counting the battle and start counting the type: any unit sent to die cleanly, any volunteer corps that burns the boat behind it, is called Gyebek’s Five Thousand. Kamikaze before the word; loyalty measured by the refusal to keep a way home.',
		events: [
			{ year: 660, label: 'Coined at the Yellow Mountain Fields.' },
			{ label: 'Becomes the proverb for a death-ready elite.' }
		],
		aliases: [
			"Gyebek's Five Thousand",
			"Gyebek’s Five Thousand",
			"Gyebek's 5000",
			"Gyebek’s 5000"
		]
	},
	{
		id: 'phrase-gesomun-method',
		name: 'Yeon Gesomun Method',
		korean: '연개소문식',
		entity: 'phrase',
		kingdom: 'goguryeo',
		title: 'Idiom — bulldozing through bureaucracy',
		tagline: 'Skip the committee. Break the room. Keep the country.',
		quote: 'The seals no longer wait for the Council.',
		arc: 'Yeon Gesomun does not outvote the High Summit — he ends the men who would outvote him, then rules through a puppet and a Grand Herald. The Yeon Gesomun Method is what clerks whisper when someone stops asking permission: clear the table, keep the work. Admired by men who need speed; feared by every hall that lives on procedure. Chunchu’s Royal Secretariat is the polite cousin of the same instinct.',
		events: [
			{ year: 642, label: 'Yeon’s Massacre — the method’s founding demonstration.' },
			{ label: 'Named whenever will outruns unanimity.' }
		],
		aliases: [
			'Yeon Gesomun Method',
			'Gesomun Method',
			'the Gesomun method',
			'the Yeon Gesomun Method'
		]
	},
	{
		id: 'phrase-ansi-fortress',
		name: 'Ansi Fortress',
		korean: '안시성',
		hanja: '安市城',
		entity: 'phrase',
		kingdom: 'goguryeo',
		title: 'Idiom — last holdout against an onslaught',
		tagline: 'The wall that will not open — even when the empire is outside.',
		quote: 'Stone has already outlasted more emperors than the court will admit.',
		arc: 'In 645 the unnamed Guardian holds Ansi against Taizong through a summer of siege and hands the greatest emperor of the age his first defeat. After that, any last redoubt — a shop that will not sell, a faction that will not fold, a single gate still flying old colours — is an Ansi Fortress. The place keeps the coordinates; the phrase keeps the refusal.',
		events: [
			{ year: 645, label: 'Taizong turned back at Ansi.' },
			{ label: 'Becomes the name for any last holdout.' }
		],
		aliases: ['Ansi Fortress', 'an Ansi Fortress', 'another Ansi Fortress']
	},
	{
		id: 'phrase-chives-garlic',
		name: 'Chives and Garlic',
		korean: '부추와 마늘',
		entity: 'phrase',
		kingdom: 'joseon',
		title: 'Idiom — an endurance trial meant to test someone',
		tagline: 'An arduous wait designed to see who stays — and who leaves on day twenty-one.',
		quote: 'Twenty-one days. On chives and garlic alone. …Did you stay?',
		arc: 'The bear and the tiger ask heaven for human form. They are given mugwort, garlic, and a hundred days out of the sun; the tiger leaves on the twenty-first day, the bear endures and becomes a woman. Mouths later shorten the trial to chives and garlic — any ordeal that is mostly waiting, mostly hunger, and entirely a test of whether you wanted the thing enough. Used for apprenticeships, mourning, courtships, and every quiet hazing that pretends to be piety.',
		events: [
			{ label: 'Coined from the Bear-Woman’s trial under the sandalwood tree.' },
			{ label: 'Said whenever endurance is the examination.' }
		],
		aliases: [
			'Chives and Garlic',
			'chives and garlic',
			'garlic and chives',
			'garlic and mugwort'
		]
	},
	{
		id: 'phrase-sacred-bone',
		name: 'Sacred Bone',
		korean: '성골',
		hanja: '聖骨',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — blood so high it needs no petition',
		tagline: 'The top of the top — privilege that thinks it is weather.',
		quote: 'Sacred blood is not a petition — it is a claim.',
		arc: 'In Silla’s Bone Rank, Sacred Bone is the only blood that may wear the crown. When the line runs out, the kingdom invents queens; when the queens die, the phrase outlives the caste. To call someone Sacred Bone is to name a privilege so complete it does not know it is a privilege — the room that never had to ask.',
		events: [
			{ year: 632, label: 'Only three Sacred Bone royals remain.' },
			{ year: 654, label: 'The Sacred Bone line ends with Queen Jinduk.' }
		],
		aliases: ['Sacred Bone', 'the Sacred Bone']
	},
	{
		id: 'phrase-true-bone',
		name: 'True Bone',
		korean: '진골',
		hanja: '眞骨',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — privileged elite just under the crown',
		tagline: 'High enough to rule the room — barred, for a while, from the throne.',
		quote: 'Say “True Bone” and the heavens part on their own.',
		arc: 'True Bone is the caste that does almost everything Sacred Bone does except wear the crown — until Chunchu breaks that ceiling. In later mouths it means any polished elite: capital manners, inherited office, the boy given a fortress because of his blood. Daeya falls partly because True Bone was confused with competence.',
		events: [
			{ year: 654, label: 'First True Bone king — Muyeol.' },
			{ label: 'Becomes shorthand for entitled excellence.' }
		],
		aliases: ['True Bone', 'True Bones', 'the True Bone']
	},
	{
		id: 'phrase-satek-clan',
		name: 'Satek Clan',
		korean: '사택씨',
		hanja: '沙宅氏',
		entity: 'phrase',
		kingdom: 'baekje',
		title: 'Idiom — an influential family near power',
		tagline: 'Holds the sleeve of the king — and sometimes the arm.',
		quote: 'Satek is a house that lives by holding the king’s sleeve.',
		arc: 'In Euija’s Baekje the Satek hold queen and prime minister at once — not the throne, but the grip on whoever sits it. Later ages use Satek Clan for any family that rules by proximity: marriage into the palace, cousins in the ministries, a veto that never needs a speech. The Guptas of another continent; the in-laws of every capital.',
		events: [
			{ year: 632, label: 'Queen and Prime Minister both Satek.' },
			{ year: 655, label: 'Euija breaks the clans — and the counsel with them.' }
		],
		aliases: ['Satek Clan', 'Satek clan', 'a Satek clan', 'the Satek clan']
	},
	{
		id: 'phrase-daeya-incident',
		name: 'Daeya Incident',
		korean: '대야의 변',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — a catastrophe that changes everything',
		tagline: 'The private wound that redraws the map — before and after, nothing is the same.',
		quote: 'Before Daeya. After Daeya. There is no third tense.',
		arc: 'In the eighth month of 642 Daeya Fortress falls, Gotaso dies, and Chunchu’s revenge begins — the Tang alliance, the end of Baekje, the end of Goryeo, all running back through one betrayed gate. The Daeya Incident is what people say for a single day that splits history: a 9/11 of Samhan, after which every sentence is dated. The fortress keeps the place; the phrase keeps the before-and-after.',
		events: [
			{ year: 642, label: 'Daeya falls; Gotaso dies.' },
			{ label: 'Becomes the name for a world-splitting catastrophe.' }
		],
		aliases: [
			'Daeya Incident',
			'the Daeya Incident',
			'after Daeya',
			'Before Daeya',
			'before Daeya'
		]
	},
	{
		id: 'phrase-surabol',
		name: 'Surabol',
		korean: '서라벌',
		hanja: '徐羅伐',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — the center of everything in a country',
		tagline: 'Where the roads decide they have arrived — Mecca, Rome, the capital that is also a gravity.',
		quote: 'If it matters, it has already been argued in Surabol.',
		arc: 'Surabol is Silla’s capital — and then it is more than a city. To call a place Surabol is to say the center of a people’s attention lives there: fashion, rank, gyuku handicaps, the rumour that crowns queens. Other kingdoms have seats; Surabol has gravity. The map entry keeps the coordinates under Namsan; this phrase keeps the habit of facing one direction when you say “the capital.”',
		events: [
			{ year: -57, label: 'Founded as Seorabeol, the legend says.' },
			{ label: 'Becomes the metonym for a country’s center.' }
		],
		// No bare "Surabol" alias — the place profile keeps geographic links.
		aliases: ['Surabol of Samhan', 'another Surabol', 'every Surabol']
	},
	{
		id: 'phrase-geunchogo',
		name: 'Geunchogo',
		korean: '근초고',
		hanja: '近肖古',
		entity: 'phrase',
		kingdom: 'baekje',
		title: 'Idiom — a golden age everyone is trying to go back to',
		tagline: 'The reign people chant when the present is not enough.',
		quote: 'Restore the reign of great Geunchogo.',
		arc: 'King Geunchogo (#13) kills a Goguryeo king at Pyongyang and holds the Han, the west coast, and the sea lanes — Baekje’s high-water mark. Three centuries later the courtyard still chants his name at a clever king who has already decided a country is a story. Geunchogo becomes the word for any lost peak: Make Baekje great again; every restoration slogan; the hurricane people would rather remember than weather.',
		events: [
			{ year: 371, label: 'Geunchogo’s high-water mark at Pyongyang.' },
			{ label: 'Becomes the proverb for a golden age to restore.' }
		],
		aliases: [
			'another Geunchogo',
			'back to Geunchogo',
			'Geunchogo years',
			'a Geunchogo'
		]
	},
	{
		id: 'phrase-kangrims-question',
		name: "Kangrim's Question",
		korean: '강림의 물음',
		entity: 'phrase',
		kingdom: 'underworld',
		title: 'Idiom — the life-reflection asked at the end',
		tagline: 'One question at the threshold — then the walk.',
		quote: 'Ask the question. Do not deliver the answer.',
		arc: 'Kangrim — 강림 to elites, 저승사자 to the street — fetches the dead for Yumla’s judgment under Big Star’s 저승, often beside Haewonmek. The rite first: the red notebook of names (적패지), the name said three times, the cord cut like an umbilical. A crow once scrambled that book; that is why nobody knows their hour. Then the Question, about the choice that made the life. Haewonmek’s ask is simpler: Any last words? / 남길 말 있나? Queens, rebels, marshals, a girl at Daeya who knew only the folk title — each gets an ask. Kangrim’s Question is what later mouths call any reckoning at the end: the interview you cannot rehearse, the honesty that shortens the road. You cannot bargain with the hour. You can still answer the question.',
		events: [
			{ label: 'Asked at every threshold Kangrim keeps for the court of judgment.' },
			{ label: 'Becomes the name for a final life-reflection.' }
		],
		aliases: [
			"Kangrim's Question",
			"Kangrim’s Question",
			"Kangrim's question",
			"Kangrim’s question"
		]
	},
	// ————— further canon — same household grade —————
	{
		id: 'phrase-bidams-kite',
		name: "Bidam's Kite",
		korean: '비담의 연',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — a forged sign from heaven',
		tagline: 'Claim heaven’s vote with fire on a string — and hope nobody looks up closely.',
		quote: 'Heaven left a mark. Or a man did.',
		arc: 'In 647 Bidam flies a burning kite over the Fortress of Radiance to argue that heaven has withdrawn from Queen Sunduk. The rebellion fails; the method becomes proverb. Bidam’s Kite is any omen you manufacture — a leak, a miracle, a “sign” timed for the vote. Useful once. Fatal when the marshal who trained with you knows how kites are built.',
		events: [
			{ year: 647, label: 'Burning kite over Radiance.' },
			{ label: 'Named for every forged mandate.' }
		],
		aliases: ["Bidam's Kite", "Bidam’s Kite", "Bidam's kite", "Bidam’s kite"]
	},
	{
		id: 'phrase-empty-road',
		name: 'The Empty Road',
		korean: '빈 길',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — waiting for someone who will not return',
		tagline: 'The gate where a boy learns the sister is not coming home.',
		quote: 'Some educations are cruel on purpose.',
		arc: 'After Daeya, Bupmin waits at Surabol’s gate for Gotaso; Munhee lets him see the empty road. The Empty Road becomes the phrase for any vigil that has already failed — the harbour with no sail, the letter that does not come, the forever that ended in the eighth month. Grief with a direction, and nowhere to walk.',
		events: [
			{ year: 642, label: 'Bupmin at the gate after Daeya.' },
			{ label: 'Becomes the name for a vigil already lost.' }
		],
		aliases: ['the Empty Road', 'The Empty Road', 'an empty road']
	},
	{
		id: 'phrase-gwanchangs-second-ride',
		name: "Gwanchang's Second Ride",
		korean: '관창의 재출전',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — going back when you already know you will die',
		tagline: 'Released once. Rode back. That is the whole virtue — and the whole waste.',
		quote: 'Youth is not an excuse. It is a deadline.',
		arc: 'Sixteen-year-old Gwanchang charges the Baekje line, is captured, and is sent home by Gyebek for his age. He rides straight back. The second time, only his head returns — and Silla’s hesitation breaks. Gwanchang’s Second Ride is any return to certain death after a pardon: never retreat made flesh, the Five Principles spending a teenager.',
		events: [
			{ year: 660, label: 'Second charge at Yellow Mountain.' },
			{ label: 'Named for every chosen return to death.' }
		],
		aliases: [
			"Gwanchang's Second Ride",
			"Gwanchang’s Second Ride",
			"Gwanchang's second ride"
		]
	},
	{
		id: 'phrase-yeons-banquet',
		name: "Yeon's Banquet",
		korean: '연개소문의 연회',
		entity: 'phrase',
		kingdom: 'goguryeo',
		title: 'Idiom — the coup that clears the room',
		tagline: 'Invite the court. End the court. Keep the swords.',
		quote: 'Kill me? Yeon Gesomun?',
		arc: 'In 642 Yeon answers a plot on his life by butchering king, commanders, and officials at a feast — then wears the four taken blades with the Eastern Crow Blade he brought. Yeon’s Banquet is any purge staged as hospitality: the meeting that was always a trap, the toast that ends a government. Pair with the Gesomun Method; one is the dinner, the other is the years after.',
		events: [
			{ year: 642, label: 'The massacre at Pyongyang.' },
			{ label: 'Becomes the name for a purge disguised as a feast.' }
		],
		aliases: ["Yeon's Banquet", "Yeon’s Banquet", "Yeon's banquet", "Yeon’s Massacre"]
	},
	{
		id: 'phrase-harmony-veto',
		name: 'Harmony Veto',
		korean: '화백의 거부',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — one hand that stops everything',
		tagline: 'Unanimity or nothing — a single objection freezes a kingdom.',
		quote: 'One hand down stops a queen, an heir, or a war.',
		arc: 'Silla’s Harmony Council of Councillors (대등) decides only when every sleeve agrees under the Premier (상대등). Bidam’s single withheld hand blocks Seungman in 645; the physics is why Chunchu builds the Royal Secretariat (집사부). Harmony Veto is any system where one holdout equals infinity — a filibuster with bone rank, the polite word for paralysis.',
		events: [
			{ year: 645, label: 'Bidam alone withholds his hand.' },
			{ label: 'Named for any single-voice stoppage.' }
		],
		aliases: ['Harmony Veto', 'harmony veto', 'a Harmony Veto']
	},
	{
		id: 'phrase-never-retreat',
		name: 'Never Retreat',
		korean: '임전무퇴',
		hanja: '臨戰無退',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — the order that spends lives cleanly',
		tagline: 'The Five Principles line that turns boys into deadlines.',
		quote: '임전무퇴.',
		arc: 'One of Won’gwang’s Five Principles for the Hwarang: in battle, do not fall back. It is why Gwanchang rides twice, why Gyebek’s five thousand do not bargain for a road home, why the age keeps producing beautiful deaths. Never Retreat is praised at funerals and quietly cursed by anyone who still has to fill a muster roll.',
		events: [
			{ year: 576, label: 'Formalised under the Hwarang code.' },
			{ year: 660, label: 'Paid in full at Yellow Mountain.' }
		],
		aliases: ['Never Retreat', 'never retreat', 'Imjeonmutoe', '임전무퇴']
	},
	{
		id: 'phrase-flower-cliffs',
		name: 'Flower Cliffs',
		korean: '낙화암',
		hanja: '落花巖',
		entity: 'phrase',
		kingdom: 'baekje',
		title: 'Idiom — a beautiful mass death',
		tagline: 'When the court chooses the cliff over the conqueror’s hands.',
		quote: 'Better the rock than the wrong empire.',
		arc: 'As Sabi falls, court women go over the cliffs rather than be taken — remembered as falling flowers. Flower Cliffs becomes the phrase for any collective, aesthetic refusal of survival: mass suicide dressed as loyalty, the ending a kingdom chooses when the story is already over.',
		events: [
			{ year: 660, label: 'The court women at the cliffs of Sabi.' },
			{ label: 'Named for beautiful refusals of capture.' }
		],
		aliases: ['Flower Cliffs', 'the Flower Cliffs', 'Falling Flowers']
	},
	{
		id: 'phrase-one-oh-eight',
		name: 'The One Hundred and Eight',
		korean: '백팔',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — a rivalry that will not resolve',
		tagline: 'Tied forever — and neither will let the other stay ahead.',
		quote: 'One hundred and eight apiece. Neither has ever let the other stay ahead for long.',
		arc: 'Yushin and Bidam spar from boyhood to a lifelong draw: 108–108. The count becomes a proverb for any contest that refuses a winner — brothers, houses, two capitals arguing the same road. The One Hundred and Eight means the score is the relationship.',
		events: [
			{ label: 'Yushin and Bidam’s lifelong sparring count.' },
			{ label: 'Said of any endless, intimate rivalry.' }
		],
		aliases: [
			'The One Hundred and Eight',
			'the One Hundred and Eight',
			'one hundred and eight apiece',
			'108–108'
		]
	},
	{
		id: 'phrase-white-river',
		name: 'White River',
		korean: '백강',
		hanja: '白江',
		entity: 'phrase',
		kingdom: 'baekje',
		title: 'Idiom — where four fleets burn',
		tagline: 'The naval catastrophe that ends a restoration.',
		quote: 'Four hundred ships. One afternoon. No country left to sail home to.',
		arc: 'In 663 Tang, Silla, Baekje and Yamato meet at the Baekgang — the first time all four share one battle — and the Baekje Restoration Army burns. Yung and Pung finish a succession quarrel on opposite banks. White River is any final water where alliances and fleets die together: the last throw, the harbour that becomes a grave.',
		events: [
			{ year: 663, label: 'Four fleets at the Baekgang.' },
			{ label: 'Becomes the name for a terminal naval disaster.' }
		],
		aliases: ['a White River', 'another White River', 'White River disaster']
	},
	{
		id: 'phrase-changan-coat',
		name: "Chang'an Coat",
		korean: '장안의 옷',
		entity: 'phrase',
		kingdom: 'tang',
		title: 'Idiom — becoming what the empire wants',
		tagline: 'Wear the capital’s cut — and wonder what still fits when you go home.',
		quote: 'Do not let the coat eat you.',
		arc: 'Chunchu learns speed and absolutism in Chang’an; friends say he loves the emperor, enemies say the coat ate him. Chang’an Coat is any assimilation that works too well — the diplomat who comes home speaking another court’s grammar, the reform that is really a costume. Keep the appointment. Do not let the coat eat you.',
		events: [
			{ year: 648, label: 'Chunchu seals the alliance in Chang’an.' },
			{ label: 'Named for successful, dangerous assimilation.' }
		],
		aliases: [
			"Chang'an Coat",
			'Chang’an Coat',
			"Chang'an coat",
			'Chang’an coat'
		]
	},
	{
		id: 'phrase-alchuns-counsel',
		name: "Alchun's Counsel",
		korean: '알천의 간언',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — the hard sentence spoken to both walls',
		tagline: 'Admonish the loyalist and the rebel with the same mouth — and stand in neither camp.',
		quote: 'Judge what is best for the divine nation.',
		arc: 'In 647 Alchun is summoned by Yushin and by Bidam before noon. To the Sword he says: stop being blinded by the princess you loved as a boy. To the Premier he says: raising arms against the crown is highest treason. Then he raises neither blade nor banner. Alchun’s Counsel is any rebuke that costs you both friendships — the nation named out loud when loyalty has become a private fever.',
		events: [
			{ year: 647, label: 'Spoken to both camps on Day 1 of Radiance.' },
			{ label: 'Named for admonishing opposite walls and belonging to neither.' }
		],
		aliases: [
			"Alchun's Counsel",
			"Alchun’s Counsel",
			"Alchun's counsel",
			'the Alchun counsel'
		]
	},
	{
		id: 'phrase-you-are-kim-yushin',
		name: 'You Are Kim Yushin',
		korean: '너는 김유신이다',
		entity: 'phrase',
		kingdom: 'silla',
		title: 'Idiom — the name that outranks every title',
		tagline: 'Sword of Silla. Last Prince of Gaya. And still — more than both.',
		quote: 'You are infinitely more than that…! You are my son. You are Kim Yushin.',
		arc: 'In the steam cavern before the tenth day at Radiance, Seohyeon’s ghost tells his son he need not erase Gaya to serve Silla — then names him past every sobriquet. You Are Kim Yushin becomes the phrase for any identity that refuses to be only a role: the title that fits, and the person larger than the fitting.',
		events: [
			{ year: 647, label: 'Spoken in the cavern the night before Bidam falls.' },
			{ label: 'Said whenever a name outranks its titles.' }
		],
		aliases: [
			'You Are Kim Yushin',
			'you are Kim Yushin',
			'You are Kim Yushin'
		]
	},
	{
		id: 'phrase-loved-before-known',
		name: 'Loved Before Known',
		korean: '알기 전에 사랑하다',
		entity: 'phrase',
		kingdom: 'gaya',
		title: 'Idiom — loyalty sworn for a life not yet lived',
		tagline: 'Surrender a kingdom for a grandson you have not met — and mean it.',
		quote: 'I loved you before I knew you.',
		arc: 'Muryuk’s ghost tells Yushin the surrender of Golden Gaya was never self-rescue — it was love aimed at a boy who did not yet exist. Loved Before Known is any vow made for someone future: a treaty signed for children, a sacrifice spent on a name not yet spoken.',
		events: [
			{ year: 532, label: 'Kingdom surrendered; the love is promissory.' },
			{ year: 647, label: 'Named aloud in the cavern to the grandson.' }
		],
		aliases: [
			'Loved Before Known',
			'loved before known',
			'I loved you before I knew you'
		]
	},
	{
		id: 'phrase-silence-is-power',
		name: 'Silence Is Power',
		korean: '침묵이 권력이다',
		entity: 'phrase',
		kingdom: 'tang',
		title: 'Idiom — the quiet that rules the room',
		tagline: 'Not submission — the true mark of power in an emperor’s court.',
		quote: 'Silence is the true mark of power…!',
		arc: 'Before Chunchu leaves Chang’an, Wu stops him in a corridor that is not on any schedule and sends a message to Silla’s woman king: never stand down; become a defiant woman; stay silent in strength. Then she whispers one unrecorded sentence and smiles him into terror. Silence Is Power is any authority that does not need to raise its voice — the glance, the aside, the quiet that rearranges a banquet.',
		events: [
			{ year: 649, label: 'Wu’s corridor charge to Chunchu.' },
			{ label: 'Named for power that does not announce itself.' }
		],
		aliases: [
			'Silence Is Power',
			'silence is power',
			'Silence is Power',
			'the true mark of power'
		]
	},
	{
		id: 'phrase-defiant-woman',
		name: 'Defiant Woman',
		korean: '반항하는 여자',
		entity: 'phrase',
		kingdom: 'tang',
		title: 'Idiom — equality worn as a face',
		tagline: 'Look any man in the face and see an equal — conquer worlds with a glance.',
		quote: 'A woman who can look any man in the face and see an equal.',
		arc: 'Wu’s message for Sunduk, carried by a frightened Chunchu: in the violent world of men, be the woman who does not stand down. Defiant Woman becomes the proverb for any refusal dressed as posture — not noise, not apology, the equal glance that ends the argument before it starts.',
		events: [
			{ year: 649, label: 'Charged to Silla’s woman king via Chunchu.' },
			{ label: 'Said of any equal glance that refuses to flinch.' }
		],
		aliases: [
			'Defiant Woman',
			'a defiant woman',
			'the defiant woman'
		]
	}
];
