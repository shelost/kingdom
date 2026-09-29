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

// House lust-voice: Golhwa cavern — moaned need, not captions.
// Maehwa: 반말, 착하지, 씨발, 싸 줘. Not 오빠.
// Pumsuk: 하오체 breaking into moans.
const rewrites = [
	{
		find: 'Ah— ten years, I haven’t',
		lines: ['아—! 씨발—', '더— 하아, 더, 더—'],
		en: ['Ah—! Fuck—', 'More— haa, more—']
	},
	{
		find: 'Your waist— you’re so— I can’t',
		lines: ['조여— 쌀 것 같소—', '빼지— 마시오— 아—'],
		en: ['You’re— I’m gonna—', 'Don’t let me pull out— ah—']
	},
	{
		find: 'that’s it, good boy, like that',
		lines: ['하아— 착하지— 그래—', '아— 멈추지 마— 더—'],
		en: ['Haa— good boy— yes—', 'Ah— don’t stop— more—']
	},
	{
		find: 'I’ll— no— deeper',
		lines: ['더— 미치겠소—', '조여— 아—'],
		en: ['More— I’m gone—', 'Tighten— ah—']
	},
	{
		find: 'That lady— ah, Gotaso',
		lines: ['고타소— 아— 미안—', '분홍 방— 내가— 하아—'],
		en: ['Gotaso— ah— sorry—', 'The pink room— I’m— haa—']
	},
	{
		find: 'That name— haa— out of your mouth',
		lines: ['그 이름은— 아—', '입에서— 빼—'],
		en: ['That name— ah—', 'Out of your mouth—']
	},
	{
		find: 'too deep, too— don’t you pull out',
		lines: ['아아악—!', '빼지 마— 빼지 마—', '싸 줘— 안에—!', '하아아— 착하지—'],
		en: ['Ah—!', 'Don’t pull out— don’t—', 'Come in me— inside—!', 'Haaa— good boy—']
	},
	{
		find: 'Again— I’m— I’m coming',
		lines: ['또— 싸, 싸겠소—', '조여— 미치겠소—'],
		en: ['Again— I’m coming—', 'Tighten— I’m gone—']
	},
	{
		find: 'Yes, again, again— ah',
		lines: ['그래— 싸, 싸— 아악—', '더— 하아— 좋아—'],
		en: ['Yes— come, come— ah—', 'More— haa— yes—']
	},
	{
		find: 'It’s leaking— ah, more, more',
		lines: ['흘러— 아— 더 줘—', '채워— 착하지—'],
		en: ['It’s leaking— ah— more—', 'Fill me— good boy—']
	},
	{
		find: 'Can you— ah',
		lines: ['또— 나오오—', '안 멈춰— 아—'],
		en: ['Again— I’m—', 'I can’t stop— ah—']
	},
	{
		find: 'Ten years since anyone',
		lines: ['하아— 남았어—', '또 와— 또 박아—'],
		en: ['Haa— you stayed—', 'Come back— fuck me again—']
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
console.log(`rewrote ${n} sex dialogues to cavern-heat voice`);
