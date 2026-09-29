import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function insertAfter(images, afterId, slots) {
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	if (!fresh.length) return [];
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function findBlockIndex(blocks, needle) {
	return blocks.findIndex((b) => {
		if (typeof b.html === 'string' && b.html.includes(needle)) return true;
		if (Array.isArray(b.en) && b.en.some((s) => s.includes(needle))) return true;
		if (Array.isArray(b.lines) && b.lines.some((s) => s.includes(needle))) return true;
		if (b.kind === 'day' && (b.label?.includes(needle) || b.ko?.includes(needle))) return true;
		if (b.kind === 'flashback' && b.title?.includes(needle)) return true;
		return false;
	});
}

function insertBlockBeforeHtml(blocks, needle, newBlocks) {
	const i = findBlockIndex(blocks, needle);
	if (i < 0) throw new Error(`missing block containing: ${needle}`);
	blocks.splice(i, 0, ...newBlocks);
}

function insertBlockAfterHtml(blocks, needle, newBlocks) {
	const i = findBlockIndex(blocks, needle);
	if (i < 0) throw new Error(`missing block containing: ${needle}`);
	blocks.splice(i + 1, 0, ...newBlocks);
}

const log = [];

// ── Bidam’s Rebellion — steam cavern accident ───────────────────────────
const bidam = findEntry('Bidam’s Rebellion');
if (!bidam.blocks.some((b) => b.kind === 'flashback' && b.title === 'not a Kim')) {
	insertBlockBeforeHtml(bidam.blocks, 'the lake, again', [
		{
			kind: 'flashback',
			year: '647',
			title: 'not a Kim',
			blocks: [
				{
					kind: 'p',
					html: '<b>Bidam</b> finds the cavern the way a man finds a rumor — sword still on, beads under the sleeve, the navy coat not yet wet. He has heard Yushin wash here. He has not heard the house rule.',
					ko: '<b>비담</b>은 소문을 찾듯 동굴을 찾는다 — 칼은 아직 차고, 염주는 소매 아래, 남색 도포는 아직 젖지 않았다. 유신이 여기서 씻는다는 말은 들었다. 집법은 듣지 못했다.'
				},
				{
					kind: 'dialogue',
					chip: '#e86820',
					person: 'golhwa',
					en: ['Wrong door. He brought iron.'],
					lines: ['문 잘못 들었어. 쇠를 들고 왔네.']
				},
				{
					kind: 'dialogue',
					chip: '#3d9e52',
					person: 'narim',
					en: ['He is not a Kim. The steam already knows.'],
					lines: ['김씨가 아니에요. 김이 이미 알아요.']
				},
				{
					kind: 'dialogue',
					chip: '#2eb8c4',
					person: 'hyulle',
					en: ['…The mouth. Before the water takes the blade.'],
					lines: ['…입구로. 물이 칼을 가져가기 전에.']
				},
				{
					kind: 'p',
					html: 'They kick him toward the light. Three colors, one refusal. The sword makes a hard line against the steam and then the night has him again. The lake keeps Kims. It does not keep slogans.',
					ko: '셋이 그를 빛 쪽으로 밀어낸다. 색 셋, 거절 하나. 칼이 김 속에서 단단한 선이 되었다가, 밤이 다시 그를 갖는다. 호수는 김씨를 지킨다. 구호는 지키지 않는다.'
				}
			]
		}
	]);
}

const lakeSlot = bidam.images.find((im) => im.id === 'bidam-lake-again');
const afterId = lakeSlot ? 'bidam-lake-again' : 'bidam-pavilion-empty';
log.push(
	...insertAfter(bidam.images, afterId, [
		{
			id: 'bidam-cave-kicked',
			ratio: 1.778,
			tone: '#141C2E',
			at: 'They kick him toward the light',
			alt: 'Tiny Bidam in a navy steam-void, sword a hard black line, kicked toward the cave mouth; three goddess color-specks',
			prompt:
				'Minimal iconic 16:9 poster. Bidam accidentally in the steam cavern, kicked out. ONE geometric device: the sword as a hard black VERTICAL LINE from steam to cave-mouth light; tiny Bidam in navy #141C2E silky hanbok flung toward the mouth at the left edge. Three tiny goddess accents only — Narim emerald #3d9e52, Golhwa ember #e86820, Hyullé cyan #2eb8c4 — as color specks on the far rock, THREE women not one. Face matches the attached Bidam portrait only as a tiny likeness. 108 beads a small gold loop at the wrist. Cyan steam plane, attached cavern. Monumental emptiness. Callback to Kim men welcomed here: he is refused. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: [
				'/ch_bidam.png',
				'/ch_narim.png',
				'/ch_golhwa.png',
				'/ch_hyullé.png',
				'/pl_cave.png'
			],
			people: ['bidam', 'narim', 'golhwa', 'hyulle']
		},
		{
			id: 'bidam-cave-refuse',
			ratio: 1.778,
			tone: '#141C2E',
			at: 'He is not a Kim',
			alt: 'Close: three steam-cavern goddesses refuse Bidam — sword still on, 108 beads, he is not a Kim',
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. THREE steam-cavern goddesses refusing Bidam. Faces fill the frame: Narim emerald eyes #3d9e52, Golhwa ember #e86820, Hyullé cyan #2eb8c4 — three distinct women, not Samsin, not a trio melted into one. Bidam at the edge, navy #141C2E silk, sword still on as a hard black line, 108 Buddhist beads at the wrist. Faces match the attached portraits. Dim attached cavern. He is not welcome. No genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
			refs: [
				'/ch_bidam.png',
				'/ch_narim.png',
				'/ch_golhwa.png',
				'/ch_hyullé.png',
				'/pl_cave.png'
			],
			people: ['bidam', 'narim', 'golhwa', 'hyulle']
		}
	])
);

// ── Jinheung’s Betrayal + Dodo executes King Seong ──────────────────────
const betrayal = findEntry('Jinheung’s Betrayal');
if (!betrayal.blocks.some((b) => b.html?.includes('The record almost forgets the slave'))) {
	insertBlockAfterHtml(betrayal.blocks, 'King Seong is taken and killed', [
		{
			kind: 'p',
			html: 'The record almost forgets the slave’s name. The ditch does not. <b>Dodo</b> does the work the rank system will not put on a prince’s hands.',
			ko: '기록은 노비의 이름을 거의 잊는다. 도랑은 잊지 않는다. <b>도도</b>가, 골품이 왕자의 손에 올리지 않을 일을 한다.'
		}
	]);
}

log.push(
	...insertAfter(betrayal.images, 'gwansan-three-hosts', [
		{
			id: 'jinheung-han-turn',
			ratio: 1.778,
			tone: '#2f6fd4',
			at: 'the Crescent Moon turns his army',
			alt: 'A silver crescent-arc cuts a yellow Han-river plane — tiny Jinheung turning on his ally',
			prompt:
				'Minimal iconic 16:9 poster. Jinheung’s betrayal of Baekje. ONE geometric device: a silver CRESCENT-ARC as a hard blade cutting a yellow Han-river plane #e5b83a from bank to bank. Tiny silky Silla figure in Jinheung blue #2f6fd4 on the upper bank, turning his army. Face matches the attached portrait only as a tiny likeness. REAL Han river, natural sky, simple water and earth. Monumental emptiness. No army catalog. No crescent-halo behind a head. No bowing Hwarang circle. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_jinheung.png'],
			people: ['jinheung']
		},
		{
			id: 'dodo-seong-ditch',
			ratio: 1.778,
			tone: '#7f96b5',
			at: 'The record almost forgets the slave',
			alt: 'A single dark ditch-strip: tiny gold King Seong, tinier Dodo, one blade-line, vast emptiness',
			prompt:
				'Minimal iconic 16:9 poster. Dodo the slave executes King Seong of Baekje. ONE geometric device: a single DITCH as a dark horizontal STRIP across the lower third of a vast empty winter field. Tiny gold-yellow #e5b83a royal silk figure on the strip — King Seong, no invented face, a crown-silhouette only. Tinier Dodo standing, face matches the attached portrait only as a speck of likeness, slave-blue #7f96b5 as the single accent on plain cloth. ONE hard blade-line. Monumental emptiness. Natural overcast sky. No army. No clutter. No readable text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_dodo.png'],
			people: ['dodo', 'kingsung']
		}
	])
);

// ── Sadaham — The Flower Youth (existing first-class prose) ─────────────
const flower = findEntry('The Flower Youth');
if (!flower.images) flower.images = [];
if (!flower.images.some((im) => im.id === 'sadaham-gaya-road')) {
	const slots = [
		{
			id: 'sadaham-gaya-road',
			ratio: 1.778,
			tone: '#6fa8ff',
			at: '<b>Sadaham</b> was fifteen',
			alt: 'Tiny Sadaham on a vast empty Gaya road — ice-blue accent, monumental emptiness',
			prompt:
				'Minimal iconic 16:9 poster. Sadaham, God of the Hwarang, fifteen, taking Great Gaya. ONE geometric device: a long empty ROAD as a pale wedge receding to a hard horizon; tiny silky Hwarang figure in the lower third, standing, not kneeling. Face matches the attached Sadaham portrait only as a tiny likeness. Ice-blue #6fa8ff as the single accent on silk. REAL empty country road, natural dusk sky. Monumental emptiness. No army catalog. No crescent halo. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_sadaham.png'],
			people: ['sadaham']
		},
		{
			id: 'sadaham-seven-days',
			ratio: 1.778,
			tone: '#6fa8ff',
			at: 'Sadaham did not take food for seven days',
			alt: 'Two pale headband-stamps on charcoal; tiny Sadaham, empty bowl as a disc, seven days',
			prompt:
				'Minimal iconic 16:9 poster. Sadaham mourning Mugwan. ONE geometric device: two pale HEADBANDS as hard rectangular STAMPS on a charcoal void, side by side, no readable text. Tiny silky Hwarang figure at the lower edge, not eating, empty bowl as a small disc. Face matches the attached Sadaham portrait only as a tiny likeness. Ice-blue #6fa8ff as the single accent. Monumental emptiness. Follow the chronicle: grief, seven days, no food — not a new plot. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
			refs: ['/ch_sadaham.png', '/ch_mugwan.png'],
			people: ['sadaham', 'mugwan']
		}
	];
	if (flower.images[0]) log.push(...insertAfter(flower.images, flower.images[0].id, slots));
	else {
		flower.images.push(...slots);
		log.push('sadaham-gaya-road', 'sadaham-seven-days');
	}
}

const peopleMap = {
	'bidam-cave-kicked': ['bidam', 'narim', 'golhwa', 'hyulle'],
	'bidam-cave-refuse': ['bidam', 'narim', 'golhwa', 'hyulle'],
	'jinheung-han-turn': ['jinheung'],
	'dodo-seong-ditch': ['dodo', 'kingsung'],
	'sadaham-gaya-road': ['sadaham'],
	'sadaham-seven-days': ['sadaham', 'mugwan']
};
Object.assign(imagePeople, peopleMap);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log('added', [...new Set(log)].join(', '));
