import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	if (b.kind === 'monologue') return `${b.html ?? ''} ${b.ko ?? ''}`;
	return '';
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipP = '#7aa8d8';

const afterInsane = daeya.blocks.findIndex(
	(b) => b.kind === 'dialogue' && blockText(b).includes('You’re insane. Sorry. You’re insane.')
);
if (afterInsane < 0) throw new Error('missing insane beat');

const insert = [
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'고타소 아씨는— 미안, 그 이름.',
			'분홍 방에 남겨 둔 거. 내가 지금 훔치고 있잖아.',
			'진골 아씨 남편. 그게— 씨발. 그게 더 좋아.'
		],
		en: [
			'Lady Gotaso is— sorry. That name.',
			'The one you left in the pink room. I’m stealing him right now.',
			'A noble lady’s husband. That’s— fuck. That’s hotter.'
		]
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: [
			'그 이름은— 입에 올리지 마.',
			'올리지— 잠깐. 안 돼. 그 이름은 이 방에 없어.'
		],
		en: [
			'That name— don’t put it in your mouth.',
			'Don’t— wait. No. That name is not in this room.'
		]
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		html: 'He got angry. Good. I said the wife and he is still in me. I stole a noble girl’s husband and he is going to punish me for saying it and I am going to come from that. I love this. I am not sorry.',
		ko: '화났어. 좋아. 아내 이름을 말했는데 아직 안에 있어. 진골 아씨 남편을 훔쳤고, 그 말 했다고 벌할 거고, 나는 그걸로 갈 거야. 이게 좋아. 안 미안해.',
		nsfw: true
	}
];

daeya.blocks.splice(afterInsane + 1, 0, ...insert);

const scream = daeya.blocks.findIndex((b) =>
	blockText(b).includes('The laugh becomes a scream')
);
if (scream < 0) throw new Error('missing scream');

daeya.blocks[scream] = {
	kind: 'p',
	nsfw: true,
	html: 'The name does it. Whatever was left of the general leaves the hips. He holds her by the cheap sash and drives — angry, arrhythmic, each thrust a punishment for the word she used, and she laughs into it because that is what she wanted. She is still standing when the sound leaves her. Jeogori open on the chest. Him behind her in that clean ice-blue, already not a guest, pounding so the torn screen jumps. <b>The laugh becomes a scream.</b> The cheap screen does not hide it. The feast pretends not to hear a poor woman making a True Bone’s name — and then it cannot pretend, because she does not stop, and because she said the other name too. She comes on the second scream, loud, messy, asking for the next angry thrust before she has finished the first.',
	ko: '그 이름이 한다. 장군으로 남은 것이 허리에서 나간다. 싼 끈을 잡고 박는다 — 화나서, 박자 없이, 한 번이 그 단어에 대한 벌이고, 그녀는 그게 원하던 거라서 웃는다. 소리가 나올 때도 아직 서 있다. 저고리가 가슴에서 열려 있다. 깨끗한 얼음빛 안에서 그는 이미 손님이 아니다. 병풍이 뛰도록 박는다. <b>웃음이 비명이 된다.</b> 싼 병풍이 가려 주지 않는다. 잔치는 가난한 여자가 진골 이름을 내는 것을 안 들은 척한다 — 그리고 못 한다. 멈추지 않으니까. 다른 이름도 말했으니까. 두 번째 비명에서 가고, 크고, 지저분하고, 화난 다음 박기를 이번 것이 끝나기 전에 청한다.'
};

const lose = daeya.blocks.findIndex((b) => blockText(b).includes('She loses the room'));
if (lose < 0) throw new Error('missing lose');

daeya.blocks[lose] = {
	kind: 'p',
	nsfw: true,
	html: 'Then she is down against the wall and he is over her, and the dirtied green is open as far as it will go without coming off. The ochre chima is a wreck at the hip. His silk is still clean. That is the insult of it. He folds her in half and drives harder than before — the anger still in it, the theft still in it — a boy ruining a room because she named the wife he left in the other hall. She is louder than the feast. She says the name again, wrecked, like a prize, and he punishes that too. He finishes inside her a second time before the lamp has burned an inch, and it is not a polite amount. <b>She loses the room.</b> She came to steal a noble lady’s husband and she is the one shaking, dripping, asking for the next one with her legs still open.',
		ko: '벽에 내려앉고 그가 위에 있다. 때 묻은 초록이, 벗지 않고 열릴 수 있는 데까지 열려 있다. 황토 치마는 허리에서 망가졌다. 그의 비단은 아직 깨끗하다. 그게 모욕이다. 반으로 접고 전보다 세게 박는다 — 화가 아직 들어 있고, 훔친 것이 아직 들어 있고 — 다른 전각에 남겨 둔 아내의 이름을 말해서 방을 망가뜨리는 소년. 잔치보다 크다. 그 이름을 또 말한다, 망가진 채로, 전리품처럼, 그것도 벌한다. 등잔이 한 치도 안 줄어 두 번째로 그 안에 붓고, 예의를 지키는 양이 아니다. <b>방을 잃는다.</b> 진골 아씨 남편을 훔치러 온 여자가, 떨며, 흘리며, 다리가 아직 열린 채로 다음을 청한다.'
};

const recount = daeya.blocks.findIndex((b) =>
	blockText(b).includes('He makes her say the leaving last')
);
if (recount >= 0) {
	daeya.blocks[recount] = {
		kind: 'p',
		nsfw: true,
		html: 'She tells it. The walk. The knot. The scream the screen did not hide. Load after load, and the clean silk that never stained. She tells him she said the wife’s name, and that is when the boy got angry, and that is when she liked it most — stealing a noble lady’s husband out loud. <b>He makes her say the leaving last</b> — that the boy stood up, did not look, and walked out of the feast as if the room were already empty.',
		ko: '말한다. 걸음. 매듭. 병풍이 가리지 못한 소리. 그 안에 몇 번, 그리고 더러워지지 않은 비단. 아내 이름을 말했다고 하고, 그때 그 아이가 화났다고 하고, 그때가 제일 좋았다고 한다 — 진골 아씨 남편을 소리 내어 훔친 것. <b>떠나는 것을 마지막에 말하게 한다</b> — 그 아이가 일어서서, 보지 않고, 방이 이미 빈 것처럼 잔치를 나갔다고.'
	};
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('inserted Gotaso-name turn; scream/lose/morning updated');
