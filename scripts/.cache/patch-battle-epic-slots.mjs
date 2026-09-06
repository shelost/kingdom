import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) {
		for (const en of ch.entries ?? []) out.push(en);
	}
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

const epic = (id, at, alt, tone, extra = {}) => ({
	id,
	ratio: 1.778,
	tone,
	at,
	alt,
	prompt: `Iconic minimal epic cinematic still, 16:9. ${alt} Tiny figures, hard color planes, monumental emptiness, one symbolic accent. Flat sky, no clouds. No readable text, no watermark, no Latin captions.`,
	...extra
});

const portrait = (id, at, alt, tone, refs) => ({
	id,
	ratio: 0.5625,
	tone,
	at,
	alt,
	prompt: `Intimate cinematic CLOSE-UP still, 9:16. ${alt} Face fills the frame. Painterly anime-adjacent cinema, not photoreal, not cartoon. No text, no watermark.`,
	refs
});

const added = [];

added.push(
	...insertAfter(findEntry('Yellow Mountain Fields').images, 'gyebek-last-stand-yellow', [
		epic(
			'hwangsan-three-camps',
			'He sets three camps across the three ways in',
			'Bird’s-eye of Hwangsanbeol: three tiny yellow Baekje infantry camps as a tight triangle on a flat yellow-ochre field #FFCB51; one huge Confucian-blue #3E79E4 crescent of Silla cavalry wrapping them. Unique three-camp lock on a yellow mountain plain. One accent: a single gold lotus-blade speck at the triangle’s heart.',
			'#FFCB51',
			{ refs: ['/ch_gyebek.png', '/ch_kim_yushin.png'] }
		),
		epic(
			'hwangsan-cavalry-fourth',
			'By the fourth charge the left camp is a rumour',
			'Ground-level low strip: Silla cavalry as a thin blue ribbon of horses and lances crashing a fourth time into a yellow Baekje infantry wall. Tiny figures, dust as white haze, one gold helmet speck for Gyebek. Realistic 7th-century cavalry, no clouds.',
			'#3E79E4',
			{ refs: ['/ch_kim_yushin.png', '/ch_gyebek.png'] }
		),
		portrait(
			'gyebek-field-face',
			'Five thousand against fifty thousand',
			'Adult Gyebek’s face filling the frame before the yellow field — gold headband, set jaw, loyalty without hope, painterly cinema.',
			'#d9b13a',
			['/ch_gyebek.png']
		),
		portrait(
			'yushin-after-yellow',
			'After the battle',
			'Adult Kim Yushin after Hwangsanbeol — Confucian marshal blue, sword still upright beside his face, no triumph, only duty. Face fills the frame.',
			'#2A5FB8',
			['/ch_kim_yushin.png']
		)
	])
);

added.push(
	...insertAfter(findEntry('Great River').images, 'munduk-battle', [
		epic(
			'salsu-ford-ribbon',
			'At the Battle of the <b>Great River</b>',
			'Bird’s-eye Salsu: a gold Sui column as one thin ribbon mid-ford across a flat black-red river plane #C30000. Unique: the water trap — a single white wall of water about to drop from the top edge. Tiny figures only.',
			'#C30000',
			{ refs: ['/ch_ulchi_munduk.png'] }
		),
		epic(
			'salsu-red-wedge',
			'Munduk is honored with the title',
			'Ground worm’s-eye: Goguryeo cavalry as one red wedge of horses driving into gold debris on a wet black floor. Ulchi Munduk a single red speck at the point. Realistic 7th-century cavalry.',
			'#e0503f',
			{ refs: ['/ch_ulchi_munduk.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Ansi').images, 'ansi-winter', [
		epic(
			'ansi-stone-ring',
			'The Second Emperor tries the wall first',
			'Bird’s-eye Ansi: a circular red stone mountain-fortress ring #C30000 on empty grey-white haze. Outside, gold Tang dots — catapults, rams, one yellow emperor tent. Unique: the ring that will not open.',
			'#C30000',
			{ refs: ['/ch_taizong.png'] }
		),
		epic(
			'ansi-earthen-ramp',
			'Five hundred thousand man-days, sixty days of haul',
			'Unique split: a gold Tang earthen siege ramp climbing from the bottom; the top half is the same ramp recaptured as a red Goguryeo fighting terrace. Tiny crews, one traction trebuchet as a black machine. No clouds.',
			'#c97a2e',
			{ refs: ['/ch_taizong.png'] }
		),
		portrait(
			'yangmanchun-wall-close',
			'Ansi… so that man is still alive',
			'The unnamed Ansi chief — weathered adult face filling the frame on a red stone parapet, wind, no triumph, only the wall.',
			'#e05a3c',
			[]
		)
	])
);

added.push(
	...insertAfter(findEntry('Daeya Fortress').images, 'daeya_granary_gate', [
		epic(
			'daeya-door-inside',
			'opens the granary gate to Yunchung',
			'Bird’s-eye Daeya: a blue Silla fortress square on empty ground. Yellow Baekje host as a strip outside. Unique: the gate is a single black slit opening from the INSIDE, not breached. One pink speck on the wall for Gotaso. No storming ladders.',
			'#3E79E4',
			{ refs: ['/ch_yunchung.png', '/ch_pumsuk.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('White River').images, 'naval-fire', [
		epic(
			'baekgang-line-hold',
			'Liu Rengui — the <b>Black Dragon</b>',
			'Bird’s-eye Baekgang estuary: a narrow white river mouth. Gold Tang hulls as a rigid ordered line of 170 triangles holding the choke. Pink Yamato swarm as a disordered fan trying the front three times. Blue Silla bank. Unique: formation beats numbers in a narrow mouth. One black-dragon speck for Liu Rengui.',
			'#b45309',
			{ refs: ['/ch_black_dragon.png'] }
		),
		epic(
			'baekgang-envelop',
			'Four hundred eastern ships do not sink so much as',
			'Ground-level low strip across white water: Tang tower-ships as gold rectangles with traction trebuchets; pink Wa hulls burning as a single orange accent. Tiny figures falling. Ordered line vs broken swarm.',
			'#ec4899',
			{ refs: ['/ch_black_dragon.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Stone Gate').images, 'mohe-ambush', [
		epic(
			'seokmun-feint-hook',
			'At Seokmun the Tang turn around',
			'Bird’s-eye Seokmun: a gold Tang column that has turned 180 degrees into a hook. Blue Silla army strung out as a broken ribbon in pursuit, not yet in line. Brown Mohe cavalry as a side wedge into the flank. Unique: the feigned withdrawal.',
			'#b45309'
		)
	])
);

added.push(
	...insertAfter(findEntry('Jinheung’s Betrayal').images, 'gwansanseong_night', [
		epic(
			'gwansan-three-hosts',
			'He gathers Baekje, remaining Gaya houses, and a Wa contingent',
			'Bird’s-eye Gwansanseong night: one blue Silla fortress block. Three approaching hosts as color strips — yellow Baekje, purple Gaya remnant, pink Wa. Campfires as a single gold accent on a navy void. Unique: three nations on one ditch.',
			'#FFCB51',
			{ refs: ['/ch_jinheung.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Bidam’s Rebellion').images, 'bidam-incense-column', [
		epic(
			'radiance-siege-ring',
			'High Councillor <b>Bidam (42)</b>',
			'Bird’s-eye Fortress of Radiance: navy #141C2E stone block. A thin Confucian-blue #2A5FB8 Silla ring outside (Wolseong grain, ten days). Unique: one gold incense/lotus shaft rising from the navy center — a Buddhist siege, not a generic assault. Tiny figures only.',
			'#141C2E',
			{ refs: ['/ch_bidam.png', '/ch_kim_yushin.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Pyongyang Fortress').images, 'pyongyang-walls', [
		epic(
			'pyongyang-triple-ring',
			'The impenetrable walls of Pyongyang are tested once again',
			'Bird’s-eye Pyongyang: three concentric red stone rings #C30000 on empty white-haze. A gold Tang navy as a thin river-strip at the bottom. Unique: the triple wall. Tiny figures on the inner ring.',
			'#C30000'
		)
	])
);

added.push(
	...insertAfter(findEntry('Snake River').images, 'sasu-battle', [
		epic(
			'sasu-serpent-bend',
			'The thirteenth and the twelfth come together',
			'Bird’s-eye Snake River: the river as a black S-curve on pale ground. Gold Tang host entering the first bend. Red Goguryeo as a waiting hook. Unique: the river itself is the formation. Tiny cavalry.',
			'#C30000',
			{ refs: ['/ch_yeon_gesomun.png', '/ch_xue_rengui.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('The Final Stand').images, 'three-dragons', [
		epic(
			'final-three-dragons',
			'The <b>Blue Dragon</b>, with the <b>Black Dragon</b> and <b>White Tiger II</b>',
			'Bird’s-eye last Pyongyang: a dying red ring. Three Tang beast-colors as three approaching wedges — blue, black, pale-white. Unique: three named dragons on one capital. Tiny figures.',
			'#C30000'
		)
	])
);

added.push(
	...insertAfter(findEntry('Goguryeo Revival Society').images, 'white-tiger-banner', [
		epic(
			'andong-grid-stamp',
			'The Third Emperor establishes the <b>Eastern Commandery</b>',
			'Unique stamp layout: a gold Tang administrative grid (Andong Protectorate) pressed onto a flat red Goguryeo land-plane #C30000. One pale-white speck for Xue Rengui at the grid’s east edge. Not abstract — readable as a fortress-city lattice. Flat sky, no clouds.',
			'#e8e3d5',
			{ refs: ['/ch_xue_rengui.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Eastern Fortress').images, 'xuerengui-banner', [
		epic(
			'xue-eastern-shaft',
			'Eastern Commandery the safest',
			'Iconic not-too-abstract: a pale #e8e3d5 empty eastern yard, one white banner-shaft, tiny Xue Rengui in white armour at the foot. Red Goguryeo horizon as a single thin line. Symbolic Eastern Commandery.',
			'#e8e3d5',
			{ refs: ['/ch_xue_rengui.png'] }
		),
		portrait(
			'xue-east-gaze',
			'Xue Rengui',
			'Adult Xue Rengui filling the frame — pale armour, white-dragon calm, looking east, painterly cinema.',
			'#e8e3d5',
			['/ch_xue_rengui.png']
		)
	])
);

added.push(
	...insertAfter(findEntry('Stallion Mountain').images, 'jupil-mountain', [
		epic(
			'xue-white-ridge',
			'Who is that man in white armour.',
			'Low-strip layout: a dark Stallion Mountain ridge as one hard plane; a pale-white cavalry line of tiny Tang horsemen; one brighter white speck for Xue and the fangtian ji. Realistic cavalry. Flat sky.',
			'#e8e3d5',
			{ refs: ['/ch_xue_rengui.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('The Summit').images, 'five-banners', [
		epic(
			'goguryeo-five-blocks',
			'a gathering of all Five Commanderies',
			'Goguryeo High Summit court: five red stone blocks of unequal height on a black reflective floor — East, West, South, North, and the 막리지. One taller red for Gesomun. Unique five-block court, not a kowtow hall. Tiny figures. Flat sky.',
			'#C30000',
			{ refs: ['/ch_yeon_gesomun.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('The Harmony Council').images, 'council_morning', [
		epic(
			'silla-harmony-planes',
			'One by one the hands go up',
			'Silla Harmony Council as stacked Confucian-blue #2A5FB8 planes of bone rank — Sacred, True, Head-rank — receding into white haze. Tiny seated silhouettes, one empty chair. Unique stacked-rank court, not a kowtow. Flat sky.',
			'#3E79E4',
			{ refs: ['/ch_kim_yushin.png', '/ch_bidam.png'] }
		),
		epic(
			'silla-moon-hall',
			'Our sacred country has produced no end of talent',
			'Silla Surabol architecture: one long wooden palace hall as a blue-white plane, a single cylindrical Cheomseongdae as the only accent, crescent-empty moonless flat sky. Tiny figures. Monumental wooden court, not stone China.',
			'#3E79E4'
		)
	])
);

added.push(
	...insertAfter(findEntry('The Eight Great Clans').images, 'baekje-river', [
		epic(
			'baekje-eight-seats',
			'The Eight Great Clans',
			'Baekje Jeongsaam court: eight yellow #FFCB51 empty seats in a broken arc around a vacant center — no circle of eggs, no kowtow. Sabi wooden elegance, one deer-crown accent. Tiny clan silhouettes. Flat sky.',
			'#FFCB51'
		),
		epic(
			'baekje-river-palace',
			'Sabi from the White River',
			'Baekje Sabi architecture: a yellow wooden riverside palace as one elegant horizontal bar above a flat pale river. Pagoda as a single vertical accent. Empty trading water — no busy boats. Heavenly-deer yellow. Flat sky.',
			'#FFCB51'
		)
	])
);

added.push(
	...insertAfter(findEntry('The Royal Secretariat').images, 'secretariat_tang_formation', [
		epic(
			'tang-three-six-grid',
			'Tang protocol adopted',
			'Tang court system: three long gold rectangles (三省) above six smaller gold blocks (六部) on a black reflective floor, one yellow emperor-light shaft. Readable as offices, not abstract tiles. Tiny officials. Flat sky.',
			'#b45309'
		)
	])
);

added.push(
	...insertAfter(findEntry('Li Shimin, the 2nd Huangdi').images, 'tang-palace', [
		epic(
			'tang-axis-palace',
			'Chang’an Daming hall',
			'Tang Chang’an architecture: a single gold axial boulevard receding to one rectangular Daming hall. Vermillion side-planes, yellow emperor light at the vanishing point. Tiny procession. Monumental axis — not a busy street.',
			'#b45309',
			{ refs: ['/ch_taizong.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Gaya, the Lost Nations').images, 'gaya_04', [
		epic(
			'gaya-iron-coast',
			'Golden Gaya at its height',
			'Gaya architecture: six purple #8b5cf6 iron hall-bars along a flat coastal plane — confederacy as a shoreline of workshops, not eggs, not a circle. One gold branch-crown speck. Empty water. Flat sky.',
			'#8b5cf6',
			{ refs: ['/ch_suro.png'] }
		)
	])
);

added.push(
	...insertAfter(findEntry('Pyongyang Fortress').images, 'pyongyang-triple-ring', [
		epic(
			'goguryeo-mountain-keep',
			'Pyongyang does not fall',
			'Goguryeo architecture: one red stone mountain-keep growing out of a cliff-plane #C30000, three-legged-crow accent as a single black bird-shape on the gate, no busy army. Unique vertical mountain fortress vs Silla wood and Tang axis.',
			'#C30000'
		)
	])
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('added', added.flat().length, added.flat().join(', '));
