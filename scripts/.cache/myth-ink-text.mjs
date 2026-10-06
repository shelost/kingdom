import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const BACKUP = 'scripts/.cache/prev-stills/story.pre-myth-ink.json';
if (!fs.existsSync(BACKUP)) fs.copyFileSync(FILE, BACKUP);
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entries = story.flatMap((c) => c.entries ?? []);
const entry = (title) => {
	const e = entries.find((x) => x.title === title);
	if (!e) throw new Error(`no entry ${title}`);
	return e;
};

// Episode kinds: single `kind` → ordered `kinds`, plus the backstories that are two things at once.
const EXTRA = {
	Haemosu: ['myth', 'love'],
	Suro: ['myth', 'love'],
	'Dangun & Old Joseon': ['myth', 'love'],
	Gardener: ['myth', 'love'],
	Hyukgose: ['myth', 'coronation'],
	Buyeo: ['myth']
};
for (const e of entries) {
	if (e.kind) {
		e.kinds = [e.kind];
		delete e.kind;
	}
	if (EXTRA[e.title]) e.kinds = EXTRA[e.title];
}

// Commander Yeon: the prisoner is a nameless northerner, not Gyebek.
const cy = entry('Commander Yeon');
const prisoner = cy.blocks.findIndex((b) => b.person === 'gyebek');
if (prisoner >= 0) {
	cy.blocks[prisoner] = {
		kind: 'dialogue',
		chip: '#8d8d95',
		speaker: 'Prisoner',
		lines: ['이름... 없습니다.'],
		en: ['I have… no name.']
	};
}
for (const im of cy.images) if (im.refs) im.refs = im.refs.filter((r) => r !== '/ch_gyebek.png');

// Commander Yeon: the Gulgul doorway, told in full (shared with the Balhae memory).
const at = (needle) => {
	const i = cy.blocks.findIndex((b) => JSON.stringify(b).includes(needle));
	if (i < 0) throw new Error(`no block ${needle}`);
	return i;
};
if (!cy.blocks.some((b) => JSON.stringify(b).includes('Goguryeo never dies'))) {
	cy.blocks[at('A month before the Summit')] = {
		kind: 'p',
		html: 'A month before the Summit, in a Mohe village the Eastern Command has finished with, there is a boy who will not move out of the doorway of a house that no longer has a roof. Snow is settling on the ash. He has a shaved crown and two braids, and he holds a stick the way he has seen men hold spears. Yeon gets down off the red bay and walks up until the stick touches his chest.',
		ko: '제가회의 한 달 전, 동부대가 일을 마치고 떠난 말갈 마을에, 지붕이 없어진 집 문간에서 비키지 않는 사내아이가 하나 있다. 재 위로 눈이 내려앉는다. 정수리를 밀고 머리를 두 갈래로 땋은 아이가, 어른들이 창 잡는 걸 본 대로 막대기를 쥐고 서 있다. 연은 붉은 밤색 말에서 내려, 막대기 끝이 가슴에 닿을 때까지 걸어온다.'
	};
	const gloves = at('Yeon looks at him for what his officers later agree');
	cy.blocks.splice(
		gloves,
		1,
		{
			kind: 'p',
			html: 'He does not. Yeon looks at him for what his officers later agree was an unreasonable length of time. Then he laughs, the slap of a laugh they will learn to dread, and pulls off his gloves.',
			ko: '알아듣지 못한다. 연은 부하들이 뒷날 지나치게 길었다고 입을 모으는 시간 동안 아이를 본다. 그러다 웃는다. 부하들이 두려워하게 될, 뺨을 치는 듯한 웃음이다. 그러고는 장갑을 벗는다.'
		},
		{
			kind: 'dialogue',
			chip: '#d0362f',
			person: 'gesomun',
			lines: ['이놈 봐라. 다 타 버린 집을 지키고 섰네.', '좋다. 이런 놈이 고구려다.', '타라. 두 번째 말.'],
			en: [
				'Look at this one. Guarding a house that’s already burned.',
				'Good. This is what Goguryeo looks like.',
				'Get on. The second horse.'
			]
		},
		{
			kind: 'p',
			html: 'He hands the gloves down. They do not fit. The boy gets on the second horse anyway, the stick still in his fist.',
			ko: '장갑을 내려 준다. 맞지 않는다. 아이는 그래도 막대기를 쥔 채 두 번째 말에 오른다.'
		}
	);
	const named = at('He gives him the name <b>Gulgul</b>');
	cy.blocks.splice(
		named + 1,
		0,
		{
			kind: 'p',
			html: 'Years later, on the north wall of Pyongyang in a winter worse than this one, Yeon stands with the grown boy a step behind him and the river frozen white below. He says the thing he says every winter, to anyone in earshot, as if the cold might forget it otherwise.',
			ko: '여러 해 뒤, 이번보다 더 혹독한 겨울, 평양 북쪽 성벽 위에 연이 서 있다. 다 큰 아이가 한 걸음 뒤에 있고, 아래로는 강이 하얗게 얼어 있다. 연은 겨울마다, 듣는 사람만 있으면 누구에게나 하는 말을 한다. 추위가 잊어버리기라도 할 것처럼.'
		},
		{ kind: 'dialogue', chip: '#d0362f', person: 'gesomun', lines: ['춥냐.'], en: ['Cold?'] },
		{ kind: 'dialogue', chip: '#8b3a3a', person: 'gulgul', lines: ['…아닙니다.'], en: ['…No, sir.'] },
		{
			kind: 'dialogue',
			chip: '#d0362f',
			person: 'gesomun',
			lines: ['거짓말 마라. 나도 춥다.', '그래도 기억해. 왕은 죽고, 조정은 지치고, 성은 무너져도—', '<b>고구려는 죽지 않는다.</b>'],
			en: ['Liar. I’m cold too.', 'Remember it anyway. Kings die, courts get tired, walls come down—', '<b>Goguryeo never dies.</b>']
		}
	);
}

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log(
	'kinds:',
	entries.filter((e) => e.kinds).map((e) => `${e.title}=${e.kinds.join('+')}`).join(' · ')
);
console.log('Commander Yeon blocks', cy.blocks.length);
