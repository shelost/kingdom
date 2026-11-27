/**
 * Household idioms of the chronicle — Trojan-horse / Achilles-heel grade.
 * Each entry is entity: 'concept': the figurative meaning a later age would say
 * out loud, not the literal person / place / institution that coined it.
 *
 * Alias discipline: prefer multi-word forms so they do not steal bare place
 * or person links (Surabol the city, Gunchogo the king, Ansi the fortress).
 */

import type { Person } from '$lib/people';

export const PHRASES: Person[] = [
	{
		id: 'phrase-gyebeks-5000',
		name: "Gyebek's Five Thousand",
		korean: '계백의 오천',
		hanja: '階伯五千',
		entity: 'concept',
		conceptKind: 'idiom',
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
		entity: 'concept',
		conceptKind: 'idiom',
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
		id: 'phrase-chives-garlic',
		name: 'Chives and Garlic',
		korean: '부추와 마늘',
		entity: 'concept',
		conceptKind: 'idiom',
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
		id: 'phrase-daeya-incident',
		name: 'Daeya Incident',
		korean: '대야의 변',
		entity: 'concept',
		conceptKind: 'idiom',
		kingdom: 'silla',
		title: 'Idiom — a catastrophe that changes everything',
		tagline: 'The private wound that redraws the map — before and after, nothing is the same.',
		quote: 'Before Daeya. After Daeya. There is no third tense.',
		arc: 'In the eighth month of 642 Daeya Fortress falls, Gotaso dies, and Chunchu’s revenge begins — the West alliance, the end of Baekje, the end of Goryeo, all running back through one betrayed gate. The Daeya Incident is what people say for a single day that splits history: a 9/11 of Samhan, after which every sentence is dated. The fortress keeps the place; the phrase keeps the before-and-after.',
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
		id: 'phrase-kangrims-question',
		name: "Kangrim's Question",
		korean: '강림의 물음',
		entity: 'concept',
		conceptKind: 'idiom',
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
		entity: 'concept',
		conceptKind: 'idiom',
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
		id: 'phrase-gwanchangs-second-ride',
		name: "Gwanchang's Second Ride",
		korean: '관창의 재출전',
		entity: 'concept',
		conceptKind: 'idiom',
		kingdom: 'silla',
		title: 'Idiom — going back when you already know you will die',
		tagline: 'Released once. Rode back. That is the whole virtue — and the whole waste.',
		quote: 'Youth is not an excuse. It is a deadline.',
		arc: 'Sixteen-year-old Gwanchang charges the Baekje line, is captured, and is sent home by Gyebek for his age. He rides straight back. The second time, only his head returns — and Silla’s hesitation breaks. Gwanchang’s Second Ride is any return to certain death after a pardon: never retreat made flesh, the Five Precepts spending a teenager.',
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
		entity: 'concept',
		conceptKind: 'idiom',
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
		entity: 'concept',
		conceptKind: 'idiom',
		kingdom: 'silla',
		title: 'Idiom — one hand that stops everything',
		tagline: 'Unanimity or nothing — a single objection freezes a kingdom.',
		quote: 'One hand down stops a queen, an heir, or a war.',
		arc: 'Silla’s Harmony Council of Councillors (대등) decides only when every sleeve agrees under the High Councillor (상대등). Bidam’s single withheld hand blocks Sungman in 645; the physics is why Chunchu builds the Royal Secretariat (집사부). Harmony Veto is any system where one holdout equals infinity — a filibuster with bone rank, the polite word for paralysis.',
		events: [
			{ year: 645, label: 'Bidam alone withholds his hand.' },
			{ label: 'Named for any single-voice stoppage.' }
		],
		aliases: ['Harmony Veto', 'harmony veto', 'a Harmony Veto']
	},
	{
		id: 'phrase-one-oh-eight',
		name: 'The One Hundred and Eight',
		korean: '백팔',
		entity: 'concept',
		conceptKind: 'idiom',
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
		id: 'phrase-changan-coat',
		name: "Chang'an Coat",
		korean: '장안의 옷',
		entity: 'concept',
		conceptKind: 'idiom',
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
		entity: 'concept',
		conceptKind: 'idiom',
		kingdom: 'silla',
		title: 'Idiom — the hard sentence spoken to both walls',
		tagline: 'Admonish the loyalist and the rebel with the same mouth — and stand in neither camp.',
		quote: 'Judge what is best for the divine nation.',
		arc: 'In 647 Alchun is summoned by Yushin and by Bidam before noon. To the Sword he says: stop being blinded by the princess you loved as a boy. To the High Councillor he says: raising arms against the crown is highest treason. Then he raises neither blade nor banner. Alchun’s Counsel is any rebuke that costs you both friendships — the nation named out loud when loyalty has become a private fever.',
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
	}
];
