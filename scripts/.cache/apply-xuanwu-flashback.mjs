import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (speaker, en, lines, extra = {}) => ({
	kind: 'dialogue',
	speaker,
	en,
	lines,
	...extra
});

const flashback = {
	kind: 'flashback',
	year: '626',
	title: 'the north gate',
	blocks: [
		p(
			'Dawn at the north gate. The Second Prince is already inside.',
			'북쪽 문, 새벽. 이황자는 이미 안에 있다.'
		),
		p(
			'He got there first. In that family that was always the whole game.',
			'그가 먼저 왔다. 그 집안에선 그게 언제나 전부였다.'
		),
		p(
			'A bow in the shadow of the lintel. One arrow. He has been holding the draw so long his fingers have gone numb.',
			'인방 그늘에 활. 화살 하나. 시위를 너무 오래 당겨 손가락이 저리다.'
		),
		p(
			'The First Prince rides in. The other brother beside him. They think they are coming to do it.',
			'일황자가 들어온다. 다른 아우가 곁에. 그들은 하러 온 줄 안다.'
		),
		p('He lets go. He does not miss.', '시위를 놓는다. 빗나가지 않는다.'),
		p(
			'The First Prince comes off the horse. The other brother turns. They pull him down before the gate.',
			'일황자가 말에서 내린다. 다른 아우가 말을 돌린다. 문 앞에서 끌어내린다.'
		),
		p(
			'The First Emperor is on a lake. Someone has to go and tell him.',
			'선황은 호수에 있다. 누가 가서 아뢰어야 한다.'
		),
		p(
			'He is boating. He is not hurrying. When they tell him, he looks at the water a long time.',
			'배를 타고 있다. 서두르지 않는다. 아뢰었을 때, 물을 오래 본다.'
		),
		d(
			'The First Emperor',
			['Which of you.'],
			['누구냐.'],
			{ chip: '#c9a227' }
		),
		p(
			'Three days later he takes the robe off. The Second Prince sits.',
			'사흘 뒤에 곤룡포를 벗는다. 이황자가 앉는다.'
		)
	]
};

let found = false;
for (const ch of story) {
	for (const e of ch.entries ?? []) {
		if (e.title !== 'Li Shimin') continue;
		found = true;
		const b = e.blocks;
		const i = b.findIndex(
			(x) =>
				x.kind === 'dialogue' &&
				x.person === 'chusuiliang' &&
				Array.isArray(x.en) &&
				x.en.some((line) => String(line).includes('Nothing happened at it'))
		);
		if (i < 0) throw new Error('Chu “nothing happened” line not found');
		if (b[i + 1]?.kind === 'flashback' && b[i + 1].title === 'the north gate') {
			console.log('flashback already present');
			break;
		}
		b.splice(i + 1, 0, flashback);
		console.log('inserted north-gate flashback after block', i);
	}
}
if (!found) throw new Error('Li Shimin not found');

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('wrote story.json');
