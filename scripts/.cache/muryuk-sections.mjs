/** Promote story headers to sections; Muryuk gets Stories over location Scenes. */
import { editStory } from './story-ops.mjs';

const RESTORE = [
	{
		story: { label: 'Childhood', ko: '어린 시절' },
		at: 'Childhood',
		scene: { label: 'The Golden Gaya palace', ko: '금관, 금관가야 왕궁' }
	},
	{
		story: { label: 'Surrender', ko: '항복' },
		at: 'Surrender',
		scene: { label: 'The pines above the ford', ko: '여울 위 소나무 숲' }
	},
	{
		story: { label: 'The Severing', ko: '단절' },
		at: 'The Severing',
		scene: { label: 'The Night Road', ko: '밤길' }
	},
	{
		story: { label: 'Battle of Great Gaya', ko: '대가야 전투' },
		at: 'Battle of Great Gaya',
		scene: { label: 'Great Gaya', ko: '대가야' }
	},
	{
		story: { label: 'Sadaham', ko: '사다함' },
		at: 'Sadaham',
		scene: { label: 'The Cut Rope', ko: '끊긴 밧줄' }
	},
	{
		story: { label: 'Seohyun', ko: '서현' },
		at: 'Seohyun',
		scene: { label: 'Surabol, the Gaya house · eight years after Great Gaya', ko: '서라벌, 가야 집 · 대가야 여덟 해 뒤' }
	},
	{
		story: { label: 'Hwarang', ko: '화랑' },
		at: 'Hwarang',
		scene: { label: 'The hwarang yard', ko: '화랑 마당' }
	}
];

const out = editStory((story) => {
	const chs = story.chapters ?? story;
	let converted = 0;
	for (const c of chs) {
		for (const e of c.entries ?? []) {
			if (e.blocks.some((b) => b.kind === 'section')) continue;
			for (const b of e.blocks) {
				if (b.kind === 'story') {
					b.kind = 'section';
					converted++;
				}
			}
		}
	}

	let e;
	for (const c of chs) {
		e = c.entries?.find((x) => x.title === 'Muryuk');
		if (e) break;
	}
	if (!e) throw new Error('Muryuk not found');
	const blocks = e.blocks;

	for (const { story: st, at, scene } of RESTORE) {
		if (blocks.some((b) => b.kind === 'story' && b.label === st.label)) continue;
		const i = blocks.findIndex((b) => (b.kind === 'scene' || b.kind === 'story') && b.label === at);
		if (i < 0) throw new Error(`missing plate: ${at}`);
		const plate = blocks[i];
		plate.label = scene.label;
		plate.ko = scene.ko;
		plate.kind = 'scene';
		delete plate.outline;
		blocks.splice(i, 0, { kind: 'story', label: st.label, ko: st.ko });
	}

	const battle = blocks.find((b) => b.label === 'Battle of Golden Gaya');
	if (battle && battle.kind === 'scene') battle.kind = 'story';

	for (const b of blocks) {
		if ((b.kind === 'scene' || b.kind === 'day') && b.outline === false && b.label !== 'DAY 6') {
			delete b.outline;
		}
	}

	const tree = [];
	let sec;
	let sto;
	for (const b of blocks) {
		if (b.kind === 'section') {
			sec = { section: b.label, stories: [], scenes: [] };
			sto = undefined;
			tree.push(sec);
		} else if (b.kind === 'story' && sec) {
			sto = { story: b.label, scenes: [] };
			sec.stories.push(sto);
		} else if ((b.kind === 'scene' || b.kind === 'day') && b.outline !== false) {
			const title = b.label;
			if (sto) sto.scenes.push(title);
			else if (sec) sec.scenes.push(title);
		}
	}

	return { converted, tree };
});

console.log(JSON.stringify(out, null, 2));
