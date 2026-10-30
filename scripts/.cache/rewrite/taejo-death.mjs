/**
 * Taejo's death moves into Dosuryu (641): Dosuryu brings the death, the
 * commanders' refusal to seat Gesomun in the East, and the plot; the episode
 * ends on Gesomun promising a banquet. Yeon's Massacre opens the banquet on his
 * toast. Also: every "Mangniji" becomes High Commander (막리지) or Supreme
 * Commander (대막리지).
 */
import { editStory } from '../story-ops.mjs';

const G = '#d0362f';
const D = '#c98578';
const say = (person, chip, en, ko, extra = {}) => ({ kind: 'dialogue', person, chip, lines: ko, en, ...extra });
const p = (html, ko) => ({ kind: 'p', html, ko });

function entryByTitle(story, title) {
	for (const c of story) for (const e of c.entries) if (e.title === title) return e;
	throw new Error(`no entry ${title}`);
}

function indexOf(blocks, test, what) {
	const i = blocks.findIndex(test);
	if (i < 0) throw new Error(`missing block: ${what}`);
	return i;
}

const enHas = (s) => (b) => (b.en ?? []).some((l) => l.includes(s)) || (b.html ?? '').includes(s);

editStory((story) => {
	const dos = entryByTitle(story, 'Dosuryu');
	const mas = entryByTitle(story, 'Yeon’s Massacre');
	if (dos.blocks.some(enHas('Your father’s dead.'))) {
		console.log('already applied');
		return false;
	}

	/* ——— Dosuryu ——— */
	const b = dos.blocks;
	b[indexOf(b, enHas('Gesomun is at supper with his boots on the table'), 'supper')] = p(
		'Gesomun is at supper with his boots on the table, which his wife gave up on years ago. The boys are in bed. The house is warm and loud, and nobody in it is afraid of anything. Nobody in it has heard yet.',
		'게소문은 장화 신은 발을 상에 올리고 저녁을 먹는 중이다. 아내는 오래전에 포기했다. 아이들은 잠자리에 들었다. 집은 따뜻하고 시끄럽고, 그 안에 뭘 무서워하는 사람은 하나도 없다. 아직 아무도 소식을 못 들었으니까.'
	);

	const afterStand = indexOf(b, enHas('You listen better standing.'), 'stand') + 1;
	b.splice(
		afterStand,
		0,
		say(
			'dosuryu',
			D,
			['Your father’s dead.'],
			['네 아바지 돌아가셨다.']
		),
		p(
			'Nobody moves. The fire does all the talking for a while.',
			'아무도 움직이지 않는다. 한동안 말은 불이 다 한다.'
		),
		say('gesomun', G, ['…When.'], ['…언제.']),
		say(
			'dosuryu',
			D,
			[
				'Four nights back. In the big house under the palace hill.',
				'He rode down to Pyongyang in the snow to ask the Summit for your seal himself. Sat in that chamber all day. Came home, lay down, and didnae get up.'
			],
			[
				'나흘 전. 궁궐 언덕 아래 그 큰 집에서.',
				'눈 오는데 평양까지 말을 타고 내려왔더라. 네 인장 달라고 제가회의에 직접 청하러. 하루 종일 그 방에 앉아 있다가, 집에 와서 눕더니, 못 일어났다.'
			]
		),
		say(
			'gesomun',
			G,
			['He couldn’t ride. He hasn’t been on a horse in seven years.'],
			['말을 못 타. 칠 년째 말 등에 올라 본 적이 없는 양반이야.']
		),
		say('dosuryu', D, ['He rode.'], ['탔다.']),
		say(
			'dosuryu',
			D,
			[
				'He left you a message. “Tell him to say half of what he thinks.”',
				'I told him you’d never manage a quarter. He laughed. That was the last of it.'
			],
			[
				'너한테 남긴 말이 있다. “생각하는 거 절반만 말하라고 전해라.”',
				'내가 기랬디, 저놈은 사분의 일도 못 할 거라고. 웃더라. 기게 마지막이었다.'
			]
		),
		p(
			'Gesomun looks at his boots on the table as if they belong to somebody else.',
			'게소문은 상 위에 올린 제 장화를, 남의 것이라도 되는 양 내려다본다.'
		),
		say('gesomun', G, ['And the seal.'], ['기래서. 인장은.']),
		say(
			'dosuryu',
			D,
			[
				'No.',
				'The North, the West, the South. All three of them. The Eastern seal goes in a box till they find somebody who doesnae shout at them.'
			],
			['안 준다.', '북부, 서부, 남부. 셋 다. 동부의 인장은 자기들한테 소리 안 지르는 놈을 찾을 때까지 상자에 넣어 둔단다.']
		),
		say('gesomun', G, ['Who shouted?'], ['누가 소리를 질렀다고?']),
		say(
			'dosuryu',
			D,
			[
				'You. At the Summit. Every year since you were old enough to sit in your father’s chair.',
				'You called the Northern Commander a horse-counter to his face. You told the West the Tang would eat him with chopsticks. Then you walked out on the king.'
			],
			[
				'네가. 제가회의에서. 아바지 자리에 앉을 나이가 된 뒤로 해마다.',
				'북부 욕살한테 대놓고 말 세는 놈이라 했지. 서부한텐 당나라가 젓가락으로 집어먹을 거라 했고. 기러고 임금 앞에서 박차고 나갔디.'
			]
		),
		say('gesomun', G, ['He is a horse-counter.'], ['말 세는 놈 맞잖아.']),
		say(
			'dosuryu',
			D,
			['He’s a horse-counter with a vote.', '“Too hot for the East,” they said. “He’ll start a war just to have something to do.”'],
			['표 가진 말 세는 놈이디.', '“동부를 맡기기엔 너무 뜨겁다.” 기러더라. “할 일 없으면 전쟁이라도 일으킬 놈이다.”']
		)
	);

	const bow = indexOf(b, enHas('Tomorrow I go and thank my uncle for supper.'), 'saddle');
	b[bow] = say(
		'gesomun',
		G,
		[
			'Gulgul. Saddle the bay.',
			'Tomorrow I ride to Pyongyang and bury my father. Then I thank my uncle for supper, and I bow. To the king. To every chair at that Summit. All summer, if that’s what it takes.'
		],
		[
			'굴굴. 밤색 말에 안장 얹으라우.',
			'내일 평양 가서 아바지 묻는다. 기다음엔 삼촌한테 저녁 잘 먹었다고 인사하고, 절한다. 임금한테. 제가회의 자리마다. 여름 내내라도.'
		]
	);
	const gulgul = indexOf(b, enHas('Yes. Saddle. The bay.'), 'gulgul') + 1;
	b.splice(
		gulgul,
		0,
		say(
			'gesomun',
			G,
			[
				'And when they finally hand me that seal—',
				'I’ll throw them a banquet. In Pyongyang. The biggest that city has ever seen.',
				'Every commander. My uncle. His Majesty. Nobody gets to miss it.'
			],
			[
				'기리고 마침내 그 인장을 내주면—',
				'내래 잔치를 연다. 평양에서. 그 도성이 생긴 이래 제일 큰 잔치를.',
				'욕살들 전부. 숙부도. 폐하도. 아무도 빠지면 안 되디.'
			]
		)
	);

	/* The deathbed still belongs where the death is told now. */
	const bed = mas.images.findIndex((im) => im.id === 'supreme-taejo-deathbed');
	if (bed >= 0) {
		const [slot] = mas.images.splice(bed, 1);
		dos.images.push({ ...slot, at: 'lay down, and didnae get up' });
	}

	/* ——— Yeon’s Massacre ——— */
	const m = mas.blocks;
	m[indexOf(m, enHas('Yeon\'s father dies in the spring'), 'father dies')] = p(
		'The Summit takes the whole summer to hand the son his father’s seal. When it finally does, Yeon decides to host a banquet, the one he promised the night Dosuryu came. The king is in attendance.',
		'제가회의는 아버지의 인장을 아들에게 넘기는 데 여름 한 철을 다 쓴다. 마침내 넘기자, 연은 연회를 열기로 한다. 도수류가 찾아왔던 그 밤에 약속한 잔치다. 왕도 자리한다.'
	);
	const lamps = indexOf(m, enHas('The lamps are already lit'), 'lamps') + 1;
	m.splice(
		lamps,
		0,
		p(
			'Yeon stands first, before the king can. He has a cup in one hand and his father’s seal on his belt, and he smiles at the room like a good host.',
			'왕보다 먼저 연이 일어선다. 한 손엔 잔, 허리엔 아버지의 인장. 그는 좋은 주인답게 방 안을 향해 웃는다.'
		),
		say(
			'gesomun',
			G,
			[
				'A cup! Everyone, a cup!',
				'To my father, who sat in that chair twelve years and came home grey.',
				'To the Summit, which took only one summer to agree with him.',
				'To my uncle, who never forgets a face. And to His Majesty.',
				'Drink up. Nobody leaves this hall thirsty.'
			],
			[
				'잔 드시라우! 다들, 잔!',
				'저 자리에 열두 해 앉았다가 백발로 돌아온 우리 아바지를 위하여.',
				'기 양반 말에 수긍하는 데 여름 한 철밖에 안 걸린 제가회의를 위하여.',
				'얼굴 한 번 보면 안 잊는 우리 숙부를 위하여. 기리고 폐하를 위하여.',
				'쭉 드시라우. 목마른 채로 이 전각을 나가는 사람은 없을 거우다.'
			],
			{ speaker: '🔴' }
		),
		p('They drink. Every one of them.', '그들은 마신다. 하나도 빠짐없이.')
	);

	/* ——— High Commander / Supreme Commander, never Mangniji ——— */
	let n = 0;
	for (const c of story)
		for (const e of c.entries) {
			const fix = (blocks) => {
				for (const blk of blocks) {
					if (blk.blocks) fix(blk.blocks);
					const supreme = e.year >= 642 && e.year <= 665;
					if (blk.kind === 'dialogue') {
						blk.en = blk.en.map((l, i) => {
							if (!l.includes('Mangniji')) return l;
							n++;
							const big = supreme || blk.lines[i]?.includes('대막리지');
							if (supreme) blk.lines[i] = blk.lines[i].replace(/(?<!대)막리지/g, '대막리지');
							return l.replace(/Mangniji/g, big ? 'Supreme Commander' : 'High Commander');
						});
					}
					for (const key of ['html', 'label']) {
						if (!blk[key]?.includes('Mangniji')) continue;
						n++;
						blk[key] = blk[key].replace(/Mangniji/g, supreme ? 'Supreme Commander' : 'High Commander');
						if (supreme && blk.ko) blk.ko = blk.ko.replace(/(?<!대)막리지/g, '대막리지');
					}
				}
			};
			fix(e.blocks);
		}
	console.log('Mangniji fixed:', n);
});
