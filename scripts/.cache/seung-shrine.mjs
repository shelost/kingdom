import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function find(entries) {
	for (const e of entries || []) {
		if (e.title === 'Seung (承)') return e;
		const hit = find(e.entries) || find(e.chapters);
		if (hit) return hit;
	}
}
function walkTop(obj) {
	if (Array.isArray(obj)) return find(obj);
	for (const k of Object.keys(obj)) {
		if (Array.isArray(obj[k])) {
			const h = find(obj[k]);
			if (h) return h;
		}
	}
}

const ep = walkTop(story);
if (!ep) throw new Error('Seung episode not found');

if (ep.blocks[0]?.label === 'The Shrine') {
	console.log('Seung shrine scene already present; skip.');
	process.exit(0);
}

const d = (person, lines, en, extra = {}) => ({ kind: 'dialogue', person, lines, en, ...extra });
const speak = (speaker, lines, en, extra = {}) => ({
	kind: 'dialogue',
	speaker,
	gender: 'm',
	lines,
	en,
	...extra
});
const p = (html, ko) => ({ kind: 'p', html, ko });

const BIDAM = { chip: '#7b5cd6' };
const YUMJONG = { chip: '#8a68c9' };
const REBEL = { chip: '#6b5344' };

ep.blocks.unshift(
	{ kind: 'section', label: 'The Shrine', ko: '사당' },
	{
		kind: 'scene',
		label: 'The Shrine Hall',
		ko: '사당',
		jump: { year: 647, en: 'The First Night…', ko: '첫날 밤…' }
	},
	{
		kind: 'place',
		place: 'radiance',
		html: 'Close enough to shout at the palace. Close enough to ruin what you came to keep.',
		ko: '궁에 고함이 들릴 만큼 가깝다. 지키러 온 것을 망가뜨리기에도 가깝다.'
	},
	p(
		'The first thing they break is a god.',
		'처음 부수는 건 부처다.'
	),
	p(
		'They take the hill after dark. The gate opens from the inside. You know that part.',
		'언덕은 밤에 떨어진다. 문은 안에서 열린다. 그 부분은 아실 것이다.'
	),
	p(
		'The men go through the shrine first. That’s where the rice is.',
		'군사들은 사당부터 들어간다. 쌀이 거기 있어서다.'
	),
	p(
		'Someone has already kicked the incense over.',
		'이미 누가 향로를 걷어찼다.'
	),
	speak(
		'A man with a black headband',
		['여왕 꺼잖아.', '다 태워.'],
		['It’s the queen’s.', 'Let it all burn.'],
		REBEL
	),
	p(
		'He takes the Maitreya at the shoulder. The pensive one. Ankle on one knee. Two fingers at the cheek. The smile that never answers.',
		'그는 미륵의 어깨를 잡는다. 반가사유의 그 분. 한쪽 발목을 무릎 위에. 두 손가락은 볼에. 대답하지 않는 미소.'
	),
	p(
		'The blade goes through the neck. The head rings on the boards.',
		'칼이 목을 지난다. 머리가 마루에서 운다.'
	),
	p(
		'Bidam is in the yard when he hears bronze. He does not run. He walks.',
		'비담은 마당에 있다. 놋쇠 소리를 듣는다. 뛰지 않는다. 걷는다.'
	),
	d('yumjong', ['상대등. 사당에서—'], ['Councillor. In the shrine—'], YUMJONG),
	d('bidam', ['알고 있소.'], ['I know.'], BIDAM),
	p(
		'He looks at the head on the floor. The smile is still there.',
		'마루 위 머리를 본다. 미소는 그대로다.'
	),
	d('bidam', ['누구요.'], ['Who.'], BIDAM),
	p(
		'The man with the sword is still grinning. Bidam’s beads are in his left hand. The heavenly-horse sword is in his right before anyone has counted.',
		'칼을 든 자는 아직 웃고 있다. 비담의 염주는 왼손에 있다. 누가 세기 전에 천마환도가 오른손에 있다.'
	),
	p(
		'The body drops. Bidam does not look at it.',
		'몸이 쓰러진다. 비담은 보지 않는다.'
	),
	d(
		'bidam',
		[
			'이 전각 판자 한 장이 — 여기 선 목숨 전부를 합친 것보다 귀하오.',
			'우리는 역적이오.',
			'짐승이 아니오.',
			'이견이 있는 자는 — 내가 벤다. 직접.'
		],
		[
			'One wooden panel in this hall is worth all of your lives combined.',
			'We are rebels.',
			'We are not animals.',
			'Anyone who disagrees will be executed. By me.'
		],
		BIDAM
	),
	p(
		'Yumjong’s mouth is open. Nobody else makes a sound.',
		'염종의 입이 벌어져 있다. 아무도 소리 내지 않는다.'
	),
	p(
		'You’ve seen this kind of party. A city on fire, and the boys calling it a march. Paris did it again last summer. Then they were surprised by the ash.',
		'이런 잔치, 본 적 있을 것이다. 도시가 타고, 아이들은 그걸 행진이라고 부른다. 파리도 지난 여름 또 그랬다. 그리고 재에 놀라더라.'
	),
	p(
		'By morning the shrine is swept. The head is wrapped. The incense is lit again.',
		'아침이 되면 사당은 쓸려 있다. 머리는 싸여 있다. 향은 다시 피어 있다.'
	)
);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Seung blocks:', ep.blocks.length);
