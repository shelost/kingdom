import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, en, lines });
const dx = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, en, lines });
const S = '#e8a04a';
const J = '#e8563f';
const C = '#8d8d95';

function afterEn0(person, first) {
	const i = jumong.blocks.findIndex((b) => b.person === person && b.en?.[0] === first);
	if (i < 0) throw new Error(`missing ${person} ${first}`);
	return i;
}

// 1) After hunter “Yes—” — more spear-count, cold, men listen
const iHunter = jumong.blocks.findIndex((b) => b.speaker === 'A hunter' && b.en?.[0] === 'Yes—');
if (iHunter < 0) throw new Error('hunter missing');
jumong.blocks.splice(
	iHunter + 1,
	0,
	d(
		'sosuno',
		S,
		['Not yes. The count.', 'East, you’re overlapping. Split.', 'If I have to say it twice you sit the hunt out.'],
		['예가 아니야. 점고.', '동쪽, 겹쳤어. 갈라.', '두 번 말하게 하면 사냥 빠져.']
	),
	dx('A hunter', C, ['—Split. Sorry.'], ['—갈랐습니다. 죄송합니다.']),
	p(
		'She does not smile when they move. She does not thank them. <b>She does not raise her voice.</b> The spears go where the chin points.',
		'움직이면 웃지 않는다. 고맙다는 말도 없다. <b>목소리를 높이지 않는다.</b> 창은 턱이 가리키는 데로 간다.'
	)
);

// 2) After “Other water exists.” — look down on Jumong
const iWater = afterEn0('sosuno', 'Other water exists.');
jumong.blocks.splice(
	iWater + 1,
	0,
	p(
		'She looks down on him the way she looks down on a bent spear. He grins anyway. That is worse. <b>You’re in the way.</b>',
		'휜 창 보듯 내려다본다. 그래도 웃는다. 그게 더 싫다. <b>길에 있잖아.</b>'
	),
	d(
		'sosuno',
		S,
		['You’re in the way.', 'The line is behind you.', 'Move or I count you as a sack.', 'Around. I said around.'],
		['길에 있잖아.', '줄은 네 뒤야.', '안 비키면 가마니로 센다.', '돌아가. 돌아가라니까.']
	),
	d('jumong', J, ['Moving.', 'See? Moved.', 'You’re fun when you’re like this.'], [
		'비킬게.',
		'봐. 비켰어.',
		'이럴 때 재밌어.'
	]),
	d('sosuno', S, ['I’m not fun.', 'I’m working.', 'Don’t grin at the work.'], [
		'재미없는 거거든.',
		'일하는 중이야.',
		'일 보고 웃지 마.'
	])
);

// 3) After well-girl “This well’s ours.” — talk down to the girls
const iWellOurs = afterEn0('sosuno', 'This well’s ours.');
jumong.blocks.splice(
	iWellOurs + 1,
	0,
	dx('A girl', C, ['We were only—'], ['그냥—']),
	d(
		'sosuno',
		S,
		['You. Bucket.', 'That well is not a porch.', 'Go home before I tell your mother you can’t count steam.'],
		['너. 두레박.', '우물이 누대는 아니거든.', '김 세는 것도 못 한다고 어미한테 말하기 전에 가.']
	)
);

function upsert(slot) {
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	const row = {
		id: slot.id,
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: false,
		at: slot.at,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		prompt: slot.prompt
	};
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...row };
	else jumong.images.push(row);
}

const chS = '/ch_sosuno.png';
const bnS = '/bn_sosuno.png';
const chJ = '/ch_jumong.png';

upsert({
	id: 'sosuno-seq-cold-ecu',
	at: 'She does not raise her voice',
	alt: 'ECU: Sosuno cold command face, shuttered eyes, chin up, dusty-rose, no blush',
	refs: [chS, bnS],
	people: ['sosuno'],
	prompt:
		'Minimal iconic 16:9 ECU. Sibling of a girl-boss silence still: Sosuno COLD command face, shuttered eyes, chin up, not wrecked, not blushing, not cute. FACE from ch_sosuno, binyeo from bn_sosuno, dusty-rose NOT gold. ONE device: her eye as the frame. Rack-focus, crushed blacks, one hard key. #e8a04a rim only. Cel-painterly. No text.'
});
upsert({
	id: 'sosuno-seq-muster-dutch',
	at: 'The yard answers her first',
	alt: 'Dutch: poster-scale Sosuno barking spear-count, tiny men in the lower third',
	refs: [chS, bnS],
	people: ['sosuno'],
	prompt:
		'Minimal iconic 16:9 DUTCH. Sosuno poster-scale, mid-point, chin up, barking a spear-count. FACE from ch_sosuno, binyeo, dusty-rose NOT gold. Tiny men in the lower third listening — not an army catalog. ONE device: her pointing arm as a hard diagonal. Jolbon packed earth, grey giwa. #e8a04a rim. High contrast chiaroscuro. Cel-painterly. No text.'
});
upsert({
	id: 'sosuno-seq-mean-two',
	at: 'You’re in the way',
	alt: 'Dutch two-shot: Sosuno looking down on Jumong, cold chin; he grins',
	refs: [chS, bnS, chJ],
	people: ['sosuno', 'jumong'],
	prompt:
		'Minimal iconic 16:9 DUTCH two-shot. Sosuno looking DOWN on Jumong, cold chin, shuttered eyes, dusty-rose NOT gold, FACE from ch_sosuno, binyeo. Jumong lower in frame, easy grin, red #e8563f silk, FACE from ch_jumong. ONE device: her shoulder as a hard descending plane. Packed earth. High contrast. Dramatic, not a standing pair. Cel-painterly. No text.'
});
upsert({
	id: 'sosuno-seq-cold-ots',
	at: 'Around. Big idiot.',
	alt: 'OTS: Sosuno’s cold dusty-rose shoulder; Jumong a small red grin in the yard',
	refs: [chS, bnS, chJ],
	people: ['sosuno', 'jumong'],
	prompt:
		'Minimal iconic 16:9 OTS. Foreground: Sosuno’s cold back and dusty-rose shoulder, chin turned a degree, FACE sliver from ch_sosuno, binyeo. Midground: Jumong small in the packed-earth yard, easy grin, red #e8563f. ONE device: her shoulder as the frame edge. Grey giwa bokeh. High contrast. Cel-painterly. No text. No blush. No heat face.'
});

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('mean beats + slots');
