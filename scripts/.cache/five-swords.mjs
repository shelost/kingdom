// Plant the five Summit swords in High Summit (634), Son Daeha draws on Yeon, callbacks in Yeon's Massacre (642).
import fs from 'node:fs';
const F = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(F, 'utf8'));
const es = story.flatMap((p) => p.entries);
const hs = es.find((e) => e.title === 'High Summit');
const ym = es.find((e) => e.title === 'Yeon’s Massacre');
if (JSON.stringify(hs).includes('a little too long')) { console.log('already applied'); process.exit(0); }
fs.copyFileSync(F, 'scripts/.cache/prev-stills/story.json.pre-five-swords.bak');

const chip = (id) => hs.blocks.find((b) => b.person === id && b.chip)?.chip;
const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines) => ({ kind: 'dialogue', person, en, lines, ...(chip(person) ? { chip: chip(person) } : {}) });
const at = (blocks, test) => {
	const i = blocks.findIndex(test);
	if (i < 0) throw new Error('anchor missing: ' + test);
	return i;
};

const plant = [
	p(
		'Five swords sit at this table, a crow stamped in every ring. Nobody draws at the Summit. Everybody comes armed anyway. The South’s grip is worn smooth by Yushin’s passes. The North’s edge is nicked from the Mohe frost. The West oils his scabbard with Liao timber, so he smells faintly of a forest.',
		'이 상에는 칼이 다섯 자루 놓인다. 고리마다 삼족오가 찍혀 있다. 제가회의에서 칼을 뽑는 자는 없다. 그래도 다들 차고 온다. 남부의 칼은 유신의 고개에서 손잡이가 닳아 매끈하다. 북부의 칼날엔 말갈 서리에 이 빠진 자국이 있다. 서부는 칼집에 요하 목재 기름을 먹여, 희미하게 숲 냄새가 난다.'
	),
	p(
		'The clerk who only keeps the minutes wears one too, because the rules say so. Ink on the grip, none on the edge. By the High Commander’s teacup lies the first sword, a small stone haetae carved under its crow. Yeon left his own at the gate. Junior seats do. He looks at theirs a little too long.',
		'회의록만 적는 서기도 규칙이라 한 자루 찬다. 손잡이엔 먹이 묻었고, 날엔 아무것도 없다. 막리지의 찻잔 옆에는 첫 칼이 누워 있다. 삼족오 아래 작은 돌 해태가 새겨져 있다. 연은 제 칼을 대문에 맡겼다. 말석은 원래 그렇다. 그는 남의 칼을 조금 오래 본다.'
	)
];
hs.blocks.splice(at(hs.blocks, (b) => b.kind === 'p' && b.html.startsWith('The chamber is already loud')) + 1, 0, ...plant);

const draw = [
	p(
		'The Southern Commander is up before the sentence is finished. The smooth grip turns once in his palm. Then the blade is out, resting a finger’s width under Yeon’s jaw.',
		'말이 끝나기도 전에 남부 대가가 일어선다. 닳은 손잡이가 손바닥에서 한 번 돈다. 그리고 칼날이 나와, 연의 턱 밑 한 마디 거리에 멈춘다.'
	),
	d('southcmd', ['Polite?', 'Say it again. Say “polite” to the South.'], ['공손?', '다시 해 보시오. 남부 앞에서 ‘공손’이라고.']),
	d('gesomun', ['…Nice edge. You keep it sharp.', 'Pity about the arm holding it.'], ['…날 잘 세웠네. 관리 잘했어.', '그걸 쥔 팔이 아깝다.']),
	d('yeongnyu', ['Commander Son.', 'Not in my hall.'], ['손 장군.', '과인의 전각에서는 아니 된다.']),
	p(
		'The blade does not move. The High Commander does not stand. He reaches over and sets two fingers on the flat of it, the way you’d steady a cup about to spill.',
		'칼은 움직이지 않는다. 막리지는 일어서지 않는다. 손을 뻗어 칼등에 손가락 두 개를 얹는다. 넘치려는 잔을 붙잡듯이.'
	),
	d('gusesa', ['Daeha. Put it away.', 'If this room ever cuts my nephew, it will do it properly. In writing.'], ['대하. 넣게.', '이 방이 언젠가 내 조카를 벤다면, 제대로 할 걸세. 글로.']),
	p(
		'It goes back in on the second try. Yeon touches his throat, looks at his fingers, and finds nothing on them. He watches that scabbard for the rest of the afternoon.',
		'칼은 두 번 만에 칼집에 들어간다. 연은 목을 한 번 만지고, 손가락을 보고, 아무것도 묻지 않은 걸 확인한다. 그날 오후 내내 그는 그 칼집을 본다.'
	)
];
hs.blocks.splice(at(hs.blocks, (b) => b.kind === 'dialogue' && b.en?.[0] === 'Listen to yourselves.') + 1, 0, ...draw);

const swap = (test, patch) => Object.assign(ym.blocks[at(ym.blocks, test)], patch);
swap((b) => b.kind === 'dialogue' && b.en?.[0] === 'Son Daeha.', {
	en: ['Son Daeha.', 'Last time, this was under my chin.', 'You asked for men, not speeches. I am taking the men.'],
	lines: ['손대하.', '지난번엔 이게 내 턱 밑에 있었지.', '연설 말고 병력을 달라 했지. 병력은 내가 가져가오.']
});
swap((b) => b.kind === 'p' && b.html.startsWith('He draws the Southern ring-pommel'), {
	html: 'He draws the Southern ring-pommel from a belt that no longer needs it. The grip is still smooth. One crow. One weight on the spine to come.',
	ko: '더 이상 필요하지 않은 허리띠에서 남부의 환두를 뽑는다. 손잡이는 여전히 매끈하다. 삼족오 하나. 앞으로 등에 올릴 무게 하나.'
});
swap((b) => b.kind === 'p' && b.html.startsWith('The Northern crow joins'), {
	html: 'The Northern crow joins the first, frost-nicks and all. Outside, a horse screams in the yard and then does not.',
	ko: '서리에 이 빠진 북부의 삼족오가 첫 번째에 더해진다. 바깥 마당에서 말이 울다 만다.'
});
swap((b) => b.kind === 'p' && b.html.startsWith('Three crows.'), {
	html: 'Three crows. The third still smells of Liao timber. The hall’s lamps lean as if listening.',
	ko: '삼족오 셋. 세 번째에선 아직 요하 목재 냄새가 난다. 전각의 등불이 듣는 것처럼 기운다.'
});
swap((b) => b.kind === 'p' && b.html.startsWith('Four. The verdict'), {
	html: 'Four. Ink on the grip, and now something on the edge. The verdict becomes metal he can wear.',
	ko: '넷. 손잡이엔 먹, 이제 날에도 무언가. 그에게 내린 판결이, 멜 수 있는 쇠가 된다.'
});
swap((b) => b.kind === 'p' && b.html.startsWith('Five ring-pommels.'), {
	html: 'Five ring-pommels. Five crows. The first sword comes off the High Commander’s belt last, stone haetae and all. Yeon wipes none of them clean.',
	ko: '환두 다섯. 삼족오 다섯. 첫 칼이 막리지의 허리에서 마지막으로 풀린다. 돌 해태째. 연은 하나도 닦지 않는다.'
});

fs.writeFileSync(F, JSON.stringify(story, null, '\t') + '\n');
console.log('High Summit +', plant.length + draw.length, 'blocks; Massacre callbacks 6');
