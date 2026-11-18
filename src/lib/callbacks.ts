/**
 * Story devices: a plant, then the later episode that spends it.
 * Same-night retellings (Bihyung and Yongsu covering one another) are not devices.
 * A question answered in the same scene is not a device.
 */
import { chapters } from '$lib/story';

export type Kind = 'foreshadow' | 'object' | 'gun' | 'pov' | 'continued';

export type Beat = {
	episode: string;
	year: string;
	/** Short label over the still: First, Later, The king… */
	mark: string;
	line: string;
	stills: string[];
};

export type Thread = {
	id: string;
	kind: Kind;
	/** Payoff batch. Several threads can spend in the same episode. */
	batch: string;
	head: string;
	ko: string;
	note: string;
	beats: Beat[];
};

export type Batch = {
	id: string;
	title: string;
	ko: string;
	note: string;
	/** Episodes whose title images head the batch. */
	episodes: string[];
};

export const BATCHES: Batch[] = [
	{
		id: 'yongsu',
		title: 'Bihyung & Yongsu',
		ko: '비형 · 용수',
		note: 'The mad father, the ghosts, the yard that will not take the boy, and why he will not go into that room.',
		episodes: ['Bihyung', 'Kim Yongsu']
	},
	{
		id: 'gaya',
		title: 'The Gaya arc',
		ko: '가야',
		note: 'People say Gaya and will not explain. Suro, Muryuk, and Seohyun are the explanation.',
		episodes: ['Suro', 'Muryuk', 'Seohyun']
	},
	{
		id: 'gods',
		title: 'The posts and the birth',
		ko: '장승 · 삼신',
		note: 'A pair of lane posts, and a name cried at a birth. The gods arrive in their own episodes.',
		episodes: ['Grim Reaper', 'Three Realms']
	},
	{
		id: 'onjo',
		title: 'Onjo',
		ko: '온조',
		note: 'The whisper under the pine becomes half a sword.',
		episodes: ['Onjo']
	},
	{
		id: 'stele',
		title: 'The Stele',
		ko: '광개토 비',
		note: 'A king says he will write the name. The stone is the later episode.',
		episodes: ['The Stele']
	},
	{
		id: 'momal',
		title: 'Momal',
		ko: '모말',
		note: 'What the boot and the hostages did to the house he left.',
		episodes: ['Momal']
	},
	{
		id: 'hwangsan',
		title: 'Hwangsan',
		ko: '황산',
		note: 'One word, left with the queen, spent on the field.',
		episodes: ['Hwangsan Field']
	},
	{
		id: 'wedding',
		title: 'The wedding',
		ko: '혼례',
		note: 'One room. Faces the book will need for the rest of its life.',
		episodes: ['Munhee']
	}
];

export const KINDS: { id: Kind; label: string; line: string }[] = [
	{
		id: 'foreshadow',
		label: 'Foreshadowing',
		line: 'Said in passing. A later episode tells you what it meant.'
	},
	{
		id: 'object',
		label: 'Objects',
		line: 'A thing in the frame. Later, the thing has a name.'
	},
	{
		id: 'gun',
		label: 'Chekhov’s gun',
		line: 'A whisper. You do not hear the words. You know they will be spent.'
	},
	{
		id: 'pov',
		label: 'POV shift',
		line: 'The same hour, from another pair of eyes.'
	},
	{
		id: 'continued',
		label: 'Continued',
		line: 'A story leaves one episode and keeps going in the next.'
	}
];

const STILLS = new Map<string, string>();
for (const ch of chapters) {
	for (const entry of ch.entries) {
		for (const img of entry.images ?? []) {
			const src = img.tempImage || img.src;
			if (src) STILLS.set(img.id, src);
		}
	}
}

export function stillSrc(id: string): string | undefined {
	return STILLS.get(id);
}

export const THREADS: Thread[] = [
	{
		id: 'goblin-dream',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'Why does the boy dream of goblins on a bridge?',
		ko: '도깨비',
		note: 'A child’s dream, and a joke about talking to the stream. The nights those goblins were real come much later.',
		beats: [
			{
				episode: 'Queen Sunduk',
				year: '632',
				mark: 'First',
				line: 'Goblins with no feet built a bridge in the dark. One was a fox, and he bowed to Grandfather.',
				stills: []
			},
			{
				episode: 'Queen Sunduk',
				year: '632',
				mark: 'First',
				line: 'Stop listening to your grandfather. Next you’ll be talking to the stream.',
				stills: []
			},
			{
				episode: 'Bihyung',
				year: '576–654',
				mark: 'Later',
				line: 'In the morning there is a bridge. The court calls it the Ghost Bridge and walks the long way round.',
				stills: ['bh-myth-bridge-night', 'bh-bridge-reveal']
			}
		]
	},
	{
		id: 'ghost-boy',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'Why do they already call him ghost boy?',
		ko: '귀신 아이',
		note: 'The yard already has a name for Chunchu and his father. The name is the plot of two later episodes.',
		beats: [
			{
				episode: 'Munhee',
				year: '625',
				mark: 'First',
				line: 'Oi. Ghost boy. That your dad at the gate? Does he talk to your mum, or just the doors?',
				stills: ['mu-gate-father']
			},
			{
				episode: 'Bupmin',
				year: '641',
				mark: 'First',
				line: 'Nobody wants the ghost boy in their Order.',
				stills: []
			},
			{
				episode: 'Kim Yongsu',
				year: '576–653',
				mark: 'Later',
				line: 'Not Bihyung. Not ghost boy. Majesty.',
				stills: ['yongsu-no-goblins', 'km-fake-bridge']
			}
		]
	},
	{
		id: 'two-things',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'What two things did the king thank him for?',
		ko: '두 가지',
		note: 'A dying king thanks his son-in-law for a service the book has not shown yet.',
		beats: [
			{
				episode: 'Harmony Council',
				year: '632',
				mark: 'First',
				line: 'The years. Thank you for those. I asked you two things, once. You did both.',
				stills: ['hc-jp-yongsu-thanks']
			},
			{
				episode: 'Kim Yongsu',
				year: '576–653',
				mark: 'Later',
				line: 'She made me promise her father would die old, in his own house.',
				stills: ['ys-bridge-reveal']
			}
		]
	},
	{
		id: 'suulbu-busy',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'Why is Suulbu already out of patience?',
		ko: '이미 바쁜 노인',
		note: 'Suulbu scolds a romance as if the girl were the whole problem. His real trouble is still ahead of the reader.',
		beats: [
			{
				episode: 'Seohyun',
				year: '593',
				mark: 'First',
				line: 'He takes the news sitting down. Then he bars his own daughter in.',
				stills: ['seo-suulbu-scold', 'seo-he-locks']
			},
			{
				episode: 'Bihyung',
				year: '576–654',
				mark: 'Later',
				line: 'He walks the Ghost Bridge once, taps each stone, and asks what forty goblins eat.',
				stills: ['bh-suulbu-chair']
			}
		]
	},
	{
		id: 'you-be-that',
		batch: 'gaya',
		kind: 'foreshadow',
		head: 'Why will he stand beside the king and not be one?',
		ko: '너는 왕이 돼',
		note: 'He will stand beside the king and will not say why. The why is Gaya.',
		beats: [
			{
				episode: 'Queen Sunduk',
				year: '632',
				mark: 'First',
				line: '“A king for all.” …You be that. I will stand beside you.',
				stills: ['east-seq-vow']
			},
			{
				episode: 'Muryuk',
				year: '532',
				mark: 'Later',
				line: 'The cone stays on. A bought general keeps the helm that marks the blood.',
				stills: ['muryuk-seq-cone-fight']
			},
			{
				episode: 'Seohyun',
				year: '593',
				mark: 'Later',
				line: 'Indoors the helm sits on a stand by the door and watches the room.',
				stills: ['expo-seohyun-supper']
			}
		]
	},
	{
		id: 'ghost-bridge',
		batch: 'yongsu',
		kind: 'object',
		head: 'What is the Ghost Bridge?',
		ko: '귀교',
		note: 'Stones across a ditch. First a dream and a morning surprise. Later, who carried them.',
		beats: [
			{
				episode: 'Harmony Council',
				year: '632',
				mark: 'First',
				line: 'By morning there is a bridge of dressed stones that nobody remembers ordering.',
				stills: []
			},
			{
				episode: 'Kim Yongsu',
				year: '576–653',
				mark: 'Later',
				line: 'Forty masked people. Stone cut in a storehouse. That is how the Ghost Bridge was built.',
				stills: ['km-fake-bridge', 'bh-chunmyung-bridge']
			}
		]
	},
	{
		id: 'jangseung',
		batch: 'gods',
		kind: 'object',
		head: 'Who are the two posts by the door?',
		ko: '장승',
		note: 'Two posts by a shaman’s door. A spear and a black band. A wide hat, eyes half shut. Later they have names.',
		beats: [
			{
				episode: 'Lady Ungo',
				year: '657',
				mark: 'First',
				line: 'The lane calls them grandfather and grandmother.',
				stills: ['ungo-lane-posts', 'ungo-posts-rack']
			},
			{
				episode: 'Grim Reaper',
				year: '태초',
				mark: 'Later',
				line: 'His name is Mujangsung.',
				stills: ['kr-living-posts', 'kr-mujangsung-spring']
			},
			{
				episode: 'Three Realms',
				year: '태초',
				mark: 'Later',
				line: 'Bari points down the road. The wide hat was hers.',
				stills: ['tr-bari-road']
			}
		]
	},
	{
		id: 'stele',
		batch: 'stele',
		kind: 'object',
		head: 'What name did he say he would write on the stone?',
		ko: '비석',
		note: 'He says he will write the name on the stone. A later episode is the stone.',
		beats: [
			{
				episode: 'King Gwanggeto',
				year: '391–400',
				mark: 'First',
				line: 'I’ll write the name on the stele. The gate opens now.',
				stills: ['gwanggaeto_ride']
			},
			{
				episode: 'The Stele',
				year: '641',
				mark: 'Later',
				line: 'A family stands small before the stone. His stele remembers it more kindly than Silla does.',
				stills: ['stele-sunrise']
			}
		]
	},
	{
		id: 'birth-painting',
		batch: 'gods',
		kind: 'object',
		head: 'Who is the woman worn pale on the wall?',
		ko: '삼신',
		note: 'Three generations of hands have worn a birth goddess pale. She gets a name and a face much later.',
		beats: [
			{
				episode: 'High Summit',
				year: '634',
				mark: 'First',
				line: 'A painting of the birth goddess, rubbed pale.',
				stills: ['samsin-namseng-birth', 'namseng-birth-white']
			},
			{
				episode: 'Three Realms',
				year: '태초',
				mark: 'Later',
				line: 'Heaven–Earth King names her Samsin.',
				stills: ['three-realms-04-yumla-samsin', 'samsin-life-office']
			}
		]
	},
	{
		id: 'cone-stand',
		batch: 'gaya',
		kind: 'object',
		head: 'Whose helm is on the stand?',
		ko: '고깔',
		note: 'A boy eats supper under a cone helm by the door. The man who wore it is a later episode.',
		beats: [
			{
				episode: 'Seohyun',
				year: '593',
				mark: 'First',
				line: 'Every morning he still wears the helm out of the gate. Indoors it watches the room.',
				stills: ['expo-seohyun-supper', 'seohyun-est-gaya-house']
			},
			{
				episode: 'Muryuk',
				year: '532',
				mark: 'Later',
				line: 'He lifts his own helm off its stand and sets it on the boy’s head. It comes down over his eyes.',
				stills: ['muryuk-seq-cone-fight']
			}
		]
	},
	{
		id: 'half-sword',
		batch: 'onjo',
		kind: 'gun',
		head: 'What did he whisper to Lady Ye?',
		ko: '반쪽 칼',
		note: 'Jumong whispers it to Lady Ye. Yuri is told to go and find it. The reader is not told what “it” is until the stone.',
		beats: [
			{
				episode: 'Haemosu',
				year: '−59–−38',
				mark: 'First',
				line: 'He leans in. The words do not reach us.',
				stills: ['jumong-ye-whisper']
			},
			{
				episode: 'Onjo',
				year: '−18',
				mark: 'Later',
				line: 'He left something under the pine on the seven-sided stone. Find it, and he’ll know thee.',
				stills: ['onjo-seq-pine-dig']
			},
			{
				episode: 'Onjo',
				year: '−18',
				mark: 'Spent',
				line: 'Half a sword in the crack. Jumong takes out the other half. The two halves click.',
				stills: []
			}
		]
	},
	{
		id: 'dont-tell',
		batch: 'yongsu',
		kind: 'gun',
		head: 'What did the father tell him not to repeat?',
		ko: '말하지 마',
		note: 'A father sends a boy out of the room. What was said in the room waits for Yongsu’s own episode.',
		beats: [
			{
				episode: 'Harmony Council',
				year: '632',
				mark: 'First',
				line: 'Past midnight he walks the boy to the stream, where the palace cannot hear.',
				stills: []
			},
			{
				episode: 'Kim Yongsu',
				year: '576–653',
				mark: 'Later',
				line: 'Go on. Your friend’s waiting. Don’t tell him. Somebody has to remember their names when I’m gone.',
				stills: ['yongsu-no-goblins']
			}
		]
	},
	{
		id: 'gyebek-word',
		batch: 'hwangsan',
		kind: 'gun',
		head: 'Who did he give his word to?',
		ko: '계백의 말',
		note: 'One sentence. He will not say to whom. The field spends it.',
		beats: [
			{
				episode: 'Gyebek',
				year: '660',
				mark: 'First',
				line: 'I gave my word.',
				stills: ['gyebek-departs']
			},
			{
				episode: 'Hwangsan Field',
				year: '660',
				mark: 'Later',
				line: 'The last stand is the promise.',
				stills: ['hwangsan-laststand']
			}
		]
	},
	{
		id: 'gwansan-pov',
		batch: 'gaya',
		kind: 'pov',
		head: 'Why does the dying king ask “why you”?',
		ko: '왜 당신',
		note: 'One ditch, three episodes. The king sees a face. The cone tells us whose. The boy meets him years on and is not told the name.',
		beats: [
			{
				episode: 'King Seong',
				year: '553–554',
				mark: 'The king',
				line: 'Silla…? A general of Silla— on this road, tonight. Why you.',
				stills: ['seong-face-bokeh', 'muryuk-seq-ridge']
			},
			{
				episode: 'Muryuk',
				year: '532',
				mark: 'The cone',
				line: 'The fallen king looks up and sees Gaya before he sees Silla.',
				stills: ['muryuk-ditch-face', 'muryuk-seq-cone-fight']
			},
			{
				episode: 'Sadaham',
				year: '560–564',
				mark: 'The boy',
				line: 'A general in a cone helm watches him cut, and does not stop him. They have not spoken yet.',
				stills: ['jh-gaya-sadaham']
			}
		]
	},
	{
		id: 'wedding-pov',
		batch: 'wedding',
		kind: 'pov',
		head: 'Who is actually in the room?',
		ko: '혼례',
		note: 'One feast. The couple, the bride’s Gaya father, and an old man weeping into the best sword in Silla. Most of them are not important yet.',
		beats: [
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The couple',
				line: 'Two people who have already learned each other’s breath.',
				stills: ['par-wed-chunchu']
			},
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The father',
				line: 'The bride’s father drinks half the cup. The other half goes on the step.',
				stills: ['scenes-seohyun-half-cup']
			},
			{
				episode: 'Bihyung',
				year: '576–654',
				mark: 'The edge',
				line: 'Yongsu weeps into Yushin’s sleeve. Suulbu stops his chair at the door: you were never mad.',
				stills: ['bh-wedding-sleeve', 'bh-suulbu-chair']
			}
		]
	},
	{
		id: 'boot-continued',
		batch: 'momal',
		kind: 'continued',
		head: 'What did the boot do to the house he left?',
		ko: '그 신',
		note: 'Gwanggaeto puts a king on the ground and takes the sons north. Momal is what that did to the house he left.',
		beats: [
			{
				episode: 'King Gwanggeto',
				year: '391–400',
				mark: 'First',
				line: 'He puts his boot on the head. Silla’s crown princes go north as hostages.',
				stills: ['gwanggaeto-foot', 'gwanggaeto_hostages']
			},
			{
				episode: 'Momal',
				year: '408–418',
				mark: 'Later',
				line: 'You stay. Someone has to remember the boot.',
				stills: ['jesang-boot']
			}
		]
	},
	{
		id: 'talks-to-water',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'Why does the yard say his father talks to water?',
		ko: '미친 아버지',
		note: 'The yard’s joke about a mad father. The later episode is the man, with the lamps up.',
		beats: [
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The gate',
				line: 'Oi. Ghost boy. That your dad at the gate? Does he talk to your mum, or just the doors?',
				stills: ['mu-gate-father']
			},
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The yard',
				line: 'Your father talks to water. What do you talk to?',
				stills: []
			},
			{
				episode: 'Kim Yongsu',
				year: '576–653',
				mark: 'Later',
				line: 'There never were. No goblins, no ghost, no stream that talks. I’m not mad.',
				stills: ['yongsu-no-goblins']
			}
		]
	},
	{
		id: 'smaller-lives',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'Why does he hate that room?',
		ko: '정치는',
		note: 'He says he does not like that room. The reason is a warning his father gave him as a boy.',
		beats: [
			{
				episode: 'Queen Sunduk',
				year: '632',
				mark: 'First',
				line: 'Me? I like books, and wine, and your mother when she isn’t shouting. Politics is for men with smaller lives.',
				stills: []
			},
			{
				episode: 'Harmony Council',
				year: '632',
				mark: 'The warning',
				line: 'That room eats the men who amuse it. Stay out of that room. Sit on the bridge.',
				stills: []
			},
			{
				episode: 'Kim Yongsu',
				year: '576–653',
				mark: 'Later',
				line: 'There’s a room in the palace with six chairs in it. That room eats the men who amuse it. Stay out of that room.',
				stills: ['ys-bridge-reveal']
			}
		]
	},
	{
		id: 'yard-list',
		batch: 'yongsu',
		kind: 'foreshadow',
		head: 'Why will no band take him?',
		ko: '귀신 아이',
		note: 'The yard leaves him off every band. The name they will not say is the reason.',
		beats: [
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The bands',
				line: 'Nobody wants the ghost boy in their Order.',
				stills: []
			},
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The court',
				line: 'So this is the ghost’s grandson. Popular is a dangerous thing to be, in your family.',
				stills: []
			},
			{
				episode: 'Bupmin',
				year: '641',
				mark: 'Again',
				line: 'Nobody wants the ghost boy in their Order.',
				stills: []
			},
			{
				episode: 'Bihyung',
				year: '576–654',
				mark: 'Later',
				line: 'Surabol takes the spirits’ name for him and turns it into an insult. Mothers use it to frighten children.',
				stills: []
			}
		]
	},
	{
		id: 'gaya-said',
		batch: 'gaya',
		kind: 'foreshadow',
		head: 'Why does everyone keep saying Gaya?',
		ko: '가야',
		note: 'An insult, a bloodline, a bed. The arc is where the word gets a country.',
		beats: [
			{
				episode: 'Prologue',
				year: '',
				mark: 'The insult',
				line: 'You Gaya wretch…!',
				stills: ['prologue-rage']
			},
			{
				episode: 'Harmony Council',
				year: '632',
				mark: 'The blood',
				line: 'The Kim of Gaya, then. The Marshal’s blood is royal.',
				stills: []
			},
			{
				episode: 'Munhee',
				year: '625',
				mark: 'The bed',
				line: 'Do you know how many years it took me to lay Gaya blood and Silla royalty in the same bed.',
				stills: ['par-wed-chunchu']
			},
			{
				episode: 'Seung',
				year: '',
				mark: 'Again',
				line: 'Gaya blood came from the west too.',
				stills: []
			},
			{
				episode: 'Muryuk',
				year: '532',
				mark: 'The country',
				line: 'The fallen king looks up and sees Gaya before he sees Silla.',
				stills: ['muryuk-ditch-face', 'muryuk-seq-cone-fight']
			}
		]
	},

];
