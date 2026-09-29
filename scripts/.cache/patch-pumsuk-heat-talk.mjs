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

function talk(b) {
	if (!b || b.kind !== 'dialogue') return '';
	return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
}

const daeya = findEntry('Daeya Fortress');

const rewrites = [
	{
		find: 'Look. This body— it’s been ten years',
		lines: ['아— 십 년, 십 년 만에— 하아—', '이렇게는 안 했어, 너는— 씨발, 더—'],
		en: ['Ah— ten years, I haven’t— haa—', 'Not like this, you— fuck, more—']
	},
	{
		find: 'The waist— your waist is insane',
		lines: ['허리가— 조여— 못 참겠소—', '빼지 마시오, 빼면— 아—'],
		en: ['Your waist— you’re so— I can’t—', 'Don’t you dare pull out, if I— ah—']
	},
	{
		find: 'Good boy— I don’t mean good',
		lines: ['하아— 착하지, 그래, 그렇게—', '기다려— 아니, 안 돼, 멈추지 마—'],
		en: ['Haa— that’s it, good boy, like that—', 'Wait— no, don’t you stop—']
	},
	{
		find: 'I’ll make a sound— no. Deeper',
		lines: ['소리— 안 돼— 더—', '미치겠소, 이 안이—'],
		en: ['I’ll— no— deeper—', 'I’m gone, you’re so—']
	},
	{
		find: 'Lady Gotaso is— sorry',
		lines: ['그 아씨— 아, 고타소— 미안—', '훔치는 거— 내가, 지금— 하아, 좋아—'],
		en: ['That lady— ah, Gotaso— sorry—', 'I’m taking him— I’m— haa, I love this—']
	},
	{
		find: 'That name— don’t put it in your mouth',
		lines: ['그 이름은— 하아— 올리지 마—', '입에서— 그 이름만— 아—'],
		en: ['That name— haa— out of your mouth—', 'Not that— just— not her name—']
	},
	{
		find: 'Wait— too deep. Don’t pull out',
		lines: ['아악— 깊어, 깊어— 빼지 마, 빼면 죽어—', '싸 줘, 착하지, 안에— 하아아—'],
		en: [
			'Ah— too deep, too— don’t you pull out, I’ll die—',
			'Give it, good boy, inside— haaa—'
		]
	},
	{
		find: 'Again— it’s coming again',
		lines: ['또— 나와, 나와—', '조여, 그렇게— 미치겠소—'],
		en: ['Again— I’m— I’m coming—', 'Tighten— like that— I’m gone—']
	},
	{
		find: 'Yes. Again. Our general',
		lines: ['그래, 또, 또— 아악—', '허리, 허리— 하아, 좋아 죽겠어—'],
		en: ['Yes, again, again— ah—', 'Your hips— haa, I can’t, I can’t—']
	},
	{
		find: 'Look, it’s running out',
		lines: ['흘러— 아, 다 새, 더 줘—', '채워, 착하지— 하아—'],
		en: ['It’s leaking— ah, more, more—', 'Fill me, good boy— haa—']
	},
	{
		find: 'You can take it? These breasts',
		lines: ['받을 수 있소— 아—', '멈추면 안 되오, 안 돼—'],
		en: ['Can you— ah—', 'If I stop I’ll— don’t let me stop—']
	},
	{
		find: 'Ten years. This much. This waist',
		lines: ['십 년이야, 이런 거— 하아—', '또 오면 또 해, 알았지— 남아 줘서—'],
		en: ['Ten years since anyone— haa—', 'You come back, you do this again— you stayed—']
	}
];

let n = 0;
for (const b of daeya.blocks) {
	if (b.kind !== 'dialogue') continue;
	const hay = talk(b);
	const r = rewrites.find((x) => hay.includes(x.find));
	if (!r) continue;
	b.lines = r.lines;
	b.en = r.en;
	b.nsfw = true;
	n++;
}

if (n !== rewrites.length) {
	throw new Error(`rewrote ${n}/${rewrites.length} dialogues`);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`rewrote ${n} sex dialogues to heat-talk`);
