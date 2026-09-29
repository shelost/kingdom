import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong entry missing');

const idx = (pred, label) => {
	const i = entry.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + label);
	return i;
};

const iHall = idx(
	(b) => b.kind === 'scene' && b.label === "Tabal’s Hall",
	'Tabal hall scene'
);
const iMillet = idx(
	(b) =>
		b.kind === 'p' &&
		typeof b.html === 'string' &&
		b.html.includes('The millet likes you. I don’t.'),
	'millet p'
);

const hall = [
	{
		kind: 'scene',
		label: "Tabal’s Hall",
		ko: '연타발의 대청'
	},
	{
		kind: 'p',
		html: '<b>Yeon Tabal</b> is the man the scouts meant. Crow-clan chieftain, largest roof in a valley of five that will not share a yard. Jumong is still wet. The bow they took off him is on the packed earth by Tabal’s foot. Tabal has not offered a mat.',
		ko: '<b>연타발</b>이 그 사람이다. 까마귀 족장. 마당을 안 나누는 지붕 다섯 중 제일 큰 집. 주몽은 아직 젖어 있다. 빼앗긴 활이 연타발 발치 다진 흙 위에 있다. 자리는 안 줬다.'
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: ['…So who sent you.'],
		lines: ['…그래서. 누가 보냈냐.']
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'…What?',
			'Nobody sent me. Your men grabbed me. I was just— here.'
		],
		lines: ['…네?', '아무도 안 보냈어요. 당신 사람들이 잡았잖아요. 저 그냥— 여기 있었어요.']
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: [
			'Don’t play dumb with me.',
			'Mohe? Khitan? Or the commandery.',
			'Your clothes don’t look like anything nearby. A spy would at least dress right.'
		],
		lines: [
			'바보인 척하지 마.',
			'말갈이냐. 거란이냐. 아니면 한 쪽, 군현 쪽.',
			'옷이 이 근처 게 아니야. 간첩이면 그래도 맞춰 입고 오지.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'I don’t know what you’re talking about.',
			'Did— did Daeso send you here as well?'
		],
		lines: ['무슨 말씀인지 모르겠어요.', '대소가— 대소도 여기까지 사람을 보냈어요?']
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: [
			'Alright.',
			'If you won’t talk, we’re just going to have to kill you.'
		],
		lines: ['그래.', '말 안 하면 죽일 수밖에 없다.']
	},
	{
		kind: 'p',
		html: 'He snaps his fingers. Two of the hall men move like they have done this before — spear-butts, a length of rope, Jumong’s knees in the packed earth. Tabal is not even looking at him. He picks up the bow.',
		ko: '손가락을 튕긴다. 대청 사람 둘이 전에 해 본 일처럼 움직인다 — 창 자루, 밧줄, 다진 흙 위 주몽의 무릎. 연타발은 보지도 않는다. 활을 집는다.'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Father…', 'So this is how I die…'],
		lines: ['아버지…', '이렇게 죽는 거였구나…']
	},
	{
		kind: 'p',
		html: 'The string will not come. Tabal puts his back into it the way he puts his back into a boar. The limb does not bend. He tries again, teeth showing, and the wood stays as it was on the pine needles — as if the bow had decided he was not the owner. <b>He cannot pull the string.</b>',
		ko: '시위가 안 온다. 멧돼지 잡듯 허리를 넣는다. 몸이 안 휜다. 이를 드러내고 한 번 더 당긴다. 나무는 솔잎 위에 있을 때와 같다 — 주인이 아니라고 정한 것처럼. <b>시위를 못 당긴다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: ['Stop.', '…Boy. Who did you say you were again.'],
		lines: ['멈춰.', '…야. 네가 누구라고 했냐. 다시.']
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: [
			'I am Jumong.',
			'Son of Haemosu — the sun god — and Yuhwa, daughter of the river god Habek.'
		],
		lines: [
			'주몽입니다.',
			'해모수의 아들입니다. 태양신. 그리고 유화, 하백의 딸이 어머니입니다.'
		]
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: [
			'…So a delusional madman.',
			'Sigh.',
			'If you can lift things, we still have some use for you.',
			'Let him go.'
		],
		lines: ['…미치광이구나.', '하.', '물건만 들 수 있으면 쓸 데는 있다.', '풀어.']
	},
	{
		kind: 'p',
		html: 'The chronicler can say what mouths will not. Jolbon is older-fashioned than northern Buyeo: five tribes named for animals — bear, tiger, crow, wolf, boar — and the crow roof is Tabal’s, the largest. They are a branch of Joseon people who came south years ago and forgot the common root; some winters they cut each other, some they cut Han columns, some they cut Mohe and Khitan who think the pine is empty. Tabal does not apologize. He walks Jumong the packed earth anyway — grain porch, well, pine — like a storeroom shown to a man he almost killed. <b>Tabal shows him the valley like a ledger.</b>',
		ko: '입은 안 하고 사관이 한다. 졸본은 북쪽 부여보다 옛것이다. 짐승 이름 다섯 부족 — 곰, 호랑이, 까마귀, 늑대, 멧돼지 — 그중 제일 큰 까마귀 지붕이 연타발의 것. 옛 조선 사람들이 남쪽으로 내려와 뿌리를 잊었다. 어떤 겨울엔 서로를 베고, 어떤 겨울엔 한의 줄을 베고, 어떤 겨울엔 소나무가 비었다고 오는 말갈과 거란을 벤다. 연타발은 미안하다는 말을 안 한다. 그래도 다진 흙을 걷힌다 — 곡식 누대, 우물, 소나무 — 방금 죽일 뻔한 사람에게 곳간 보여 주듯. <b>골짜기를 장부처럼 보여 준다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: [
			'Shed. You hunt, you eat.',
			'My daughter’s in that hall. You look, I dig a ditch.'
		],
		lines: ['헛간. 사냥하면 밥이다.', '내 딸이 저 안에 있다. 보면 도랑 판다.']
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Shed. Hunt. I got it.', 'I wasn’t going to look.'],
		lines: ['헛간. 사냥. 알겠어요.', '볼 생각 없었어요.']
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: ['You were.', 'Don’t.'],
		lines: ['하고 있었다.', '하지 마.']
	}
];

entry.blocks.splice(iHall, iMillet - iHall, ...hall);

const weigh = (entry.images ?? []).find((im) => im.id === 'jumong-seq-tabal-weigh');
if (weigh) {
	weigh.at = 'He cannot pull the string';
	weigh.alt =
		'OTS: Tabal in tiger-pelt straining at Jumong’s bow; the limb will not bend; Jumong kneeling';
}

const ledger = (entry.images ?? []).find((im) => im.id === 'jumong-seq-tabal-ledger');
if (ledger && !entry.images.some((im) => im.id === 'jumong-seq-tabal-bow')) {
	const bow = {
		id: 'jumong-seq-tabal-bow',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'He cannot pull the string',
		alt: 'Dutch: Tabal in tiger-pelt failing to draw Jumong’s bow; Jumong on his knees, two spear-men as specks',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png'],
		people: ['yeontabal', 'jumong'],
		prompt:
			'Minimal iconic 16:9 still. Dutch Jolbon timber hall, packed earth, grey giwa. Tabal FACE AND GARMENTS from attached: tiger-pelt, red headband, beard, straining mid-draw at a bow that WILL NOT BEND. Jumong kneeling, FACE from attached, red silk, scared not grinning. ONE device: the unbent bow as a hard black arc. Two tiny spear-men. High contrast chiaroscuro. No army catalog. No text. No watermark. 2D cel-painterly cinema.'
	};
	const i = entry.images.indexOf(ledger);
	entry.images.splice(i + 1, 0, bow);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Tabal hall interrogation');
