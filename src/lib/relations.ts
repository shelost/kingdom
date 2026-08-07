/**
 * Character relationships — edges that carry their own profiles — and the
 * layout for the floating relationship chart.
 */

import type { BondKind, Person } from '$lib/people';

export const BOND_LABEL: Record<BondKind, string> = {
	love: 'Love',
	affair: 'Affair',
	rival: 'Rival',
	kin: 'Kin',
	sworn: 'Sworn',
	mentor: 'Mentor'
};

/** Chart era bands — present chronicle vs historical flashbacks vs mythology. */
export type ChartEra = 'present' | 'past' | 'myth';

export type ChartNode = {
	id: string;
	x: number;
	y: number;
	rank: 1 | 2 | 3;
	era: ChartEra;
	gender: 'm' | 'f';
};

export const ERA_META: Record<ChartEra, { label: string; hint: string }> = {
	present: { label: 'Present', hint: 'The 7th-century war' },
	past: { label: 'Past', hint: 'Founders & flashbacks' },
	myth: { label: 'Myth', hint: 'Gods, eggs, and heaven' }
};

/**
 * People on the relationship chart.
 * `rank` 3 = leads (largest), 2 = major, 1 = supporting (smallest).
 * Bands: Present (top) → Past → Myth (bottom). Clusters by kingdom within each band.
 */
export const CHART_NODES: ChartNode[] = [
	// ——— PRESENT · Silla ———
	{ id: 'jinpyung', x: 40, y: 80, rank: 1, era: 'present', gender: 'm' },
	{ id: 'sunduk', x: 220, y: 80, rank: 3, era: 'present', gender: 'f' },
	{ id: 'jinduk', x: 400, y: 80, rank: 2, era: 'present', gender: 'f' },
	{ id: 'chunmyung', x: 40, y: 250, rank: 2, era: 'present', gender: 'f' },
	{ id: 'yushin', x: 220, y: 250, rank: 3, era: 'present', gender: 'm' },
	{ id: 'bidam', x: 400, y: 250, rank: 2, era: 'present', gender: 'm' },
	{ id: 'chunchu', x: 140, y: 440, rank: 3, era: 'present', gender: 'm' },
	{ id: 'munhee', x: 340, y: 440, rank: 2, era: 'present', gender: 'f' },
	{ id: 'bohee', x: 500, y: 380, rank: 1, era: 'present', gender: 'f' },
	{ id: 'gotaso', x: 140, y: 620, rank: 2, era: 'present', gender: 'f' },
	{ id: 'pumsuk', x: 340, y: 620, rank: 2, era: 'present', gender: 'm' },
	{ id: 'gumilwife', x: 520, y: 620, rank: 1, era: 'present', gender: 'f' },
	{ id: 'gumil', x: 520, y: 760, rank: 1, era: 'present', gender: 'm' },
	{ id: 'munmu', x: 40, y: 620, rank: 2, era: 'present', gender: 'm' },
	{ id: 'inmun', x: 40, y: 760, rank: 1, era: 'present', gender: 'm' },
	{ id: 'alchun', x: 220, y: 780, rank: 1, era: 'present', gender: 'm' },
	{ id: 'gwanchang', x: 380, y: 780, rank: 1, era: 'present', gender: 'm' },

	// ——— PRESENT · Baekje ———
	{ id: 'euija', x: 820, y: 250, rank: 3, era: 'present', gender: 'm' },
	{ id: 'courtmaid', x: 1020, y: 250, rank: 1, era: 'present', gender: 'f' },
	{ id: 'gyebek', x: 720, y: 440, rank: 2, era: 'present', gender: 'm' },
	{ id: 'seongchung', x: 900, y: 440, rank: 1, era: 'present', gender: 'm' },
	{ id: 'chunbok', x: 1060, y: 440, rank: 1, era: 'present', gender: 'm' },
	{ id: 'queensatek', x: 720, y: 600, rank: 1, era: 'present', gender: 'f' },
	{ id: 'pung', x: 900, y: 600, rank: 1, era: 'present', gender: 'm' },
	{ id: 'yesikjin', x: 1060, y: 600, rank: 1, era: 'present', gender: 'm' },

	// ——— PRESENT · Goguryeo ———
	{ id: 'yeongnyu', x: 1380, y: 120, rank: 1, era: 'present', gender: 'm' },
	{ id: 'gesomun', x: 1380, y: 300, rank: 3, era: 'present', gender: 'm' },
	{ id: 'gulgul', x: 1560, y: 220, rank: 1, era: 'present', gender: 'm' },
	{ id: 'bojang', x: 1200, y: 300, rank: 2, era: 'present', gender: 'm' },
	{ id: 'yangmanchun', x: 1560, y: 300, rank: 2, era: 'present', gender: 'm' },
	{ id: 'namseng', x: 1280, y: 480, rank: 1, era: 'present', gender: 'm' },
	{ id: 'namgun', x: 1480, y: 480, rank: 1, era: 'present', gender: 'm' },
	{ id: 'namsan', x: 1380, y: 560, rank: 1, era: 'present', gender: 'm' },

	// ——— PRESENT · Tang ———
	{ id: 'taizong', x: 1780, y: 200, rank: 2, era: 'present', gender: 'm' },
	{ id: 'gaozong', x: 1780, y: 380, rank: 2, era: 'present', gender: 'm' },
	{ id: 'xuerengui', x: 1960, y: 300, rank: 2, era: 'present', gender: 'm' },
	{ id: 'sudingfang', x: 1780, y: 540, rank: 1, era: 'present', gender: 'm' },

	// ——— PAST · founders & flashbacks ———
	{ id: 'sosuno', x: 120, y: 1100, rank: 2, era: 'past', gender: 'f' },
	{ id: 'onjo', x: 300, y: 1100, rank: 2, era: 'past', gender: 'm' },
	{ id: 'biryu', x: 460, y: 1100, rank: 1, era: 'past', gender: 'm' },
	{ id: 'haemosu', x: 720, y: 1100, rank: 2, era: 'past', gender: 'm' },
	{ id: 'habek', x: 560, y: 1100, rank: 1, era: 'past', gender: 'm' },
	{ id: 'yuhwa', x: 900, y: 1100, rank: 2, era: 'past', gender: 'f' },
	{ id: 'jumong', x: 810, y: 1280, rank: 3, era: 'past', gender: 'm' },
	{ id: 'ladyye', x: 640, y: 1280, rank: 1, era: 'past', gender: 'f' },
	{ id: 'geumwa', x: 1040, y: 1180, rank: 1, era: 'past', gender: 'm' },
	{ id: 'daeso', x: 1040, y: 1320, rank: 1, era: 'past', gender: 'm' },
	{ id: 'yuri', x: 810, y: 1440, rank: 1, era: 'past', gender: 'm' },

	{ id: 'suro', x: 1380, y: 1100, rank: 2, era: 'past', gender: 'm' },
	{ id: 'heohwangok', x: 1580, y: 1100, rank: 2, era: 'past', gender: 'f' },

	// ——— MYTH ———
	{ id: 'hwanin', x: 100, y: 1580, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'hwanung', x: 200, y: 1720, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'ungnyeo', x: 400, y: 1720, rank: 2, era: 'myth', gender: 'f' },
	{ id: 'dangun', x: 300, y: 1900, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'ibiga', x: 760, y: 1720, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'jeonggyeon', x: 960, y: 1720, rank: 2, era: 'myth', gender: 'f' },
	{ id: 'yumla', x: 1180, y: 1720, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'kangrim', x: 1180, y: 1900, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'jacheongbi', x: 1380, y: 1720, rank: 2, era: 'myth', gender: 'f' },
	{ id: 'mundoryeong', x: 1580, y: 1720, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'sanbangdeok', x: 1480, y: 1900, rank: 1, era: 'myth', gender: 'f' }
];

/** Pixel diameter for each importance rank — minimal dots. */
export const RANK_SIZE: Record<1 | 2 | 3, number> = {
	1: 10,
	2: 14,
	3: 20
};

/** Section header positions for each era band (near force y-centers). */
export const ERA_SECTIONS: { era: ChartEra; x: number; y: number }[] = [
	{ era: 'present', x: 40, y: 40 },
	{ era: 'past', x: 40, y: 480 },
	{ era: 'myth', x: 40, y: 860 }
];

/**
 * Important bonds. Each is a full profile (entity: 'relationship') so edges
 * can be opened in the same side panel as people.
 */
export const RELATIONSHIPS: Person[] = [
	{
		id: 'rel-gotaso-pumsuk',
		name: 'Gotaso & Pumsuk',
		korean: '고타소 · 품석',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'love',
		between: ['gotaso', 'pumsuk'],
		title: 'A year of forever, then Daeya',
		tagline: 'She named their children before he proposed. Then the fortress.',
		arc: 'After Chunchu brings her home from the ford, Gotaso falls the way a girl of fifteen falls — completely. Polo, rain, forever. At Daeya the oath fails; both die, and the private injury becomes a war.',
		events: [
			{ year: 641, label: 'Taken; rescued; married; leave for Daeya.' },
			{ year: 642, label: 'Die together when the fortress falls.' }
		],
		aliases: ['Gotaso & Pumsuk', 'Pumsuk & Gotaso']
	},
	{
		id: 'rel-chunchu-munhee',
		name: 'Chunchu & Munhee',
		korean: '춘추 · 문희',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'love',
		between: ['chunchu', 'munhee'],
		title: 'The dream, the skirt, the torn coat',
		tagline: 'She bought a drowned capital and sewed her way into a dynasty.',
		arc: 'Munhee buys Bohee’s dream for a silk skirt, then sews Chunchu’s coat so slowly he cannot leave. Their marriage produces Bupmin and Gotaso — and the private heat of that sewing room sits under every political move Chunchu makes afterward.',
		events: [
			{ year: 625, label: 'The coat is torn; Munhee sews it standing close.' },
			{ label: 'Married; parents of Bupmin and Gotaso.' }
		],
		aliases: ['Chunchu & Munhee', 'Munhee & Chunchu']
	},
	{
		id: 'rel-yushin-sunduk',
		name: 'Yushin & Sunduk',
		korean: '유신 · 선덕',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'love',
		between: ['yushin', 'sunduk'],
		title: 'The love that could not be crowned',
		tagline: 'He would have burned the country for her. She stops him herself.',
		arc: 'Sacred Bone cannot marry True Bone and keep the succession. Sunduk becomes queen; Yushin stays the marshal who would have been her husband in another life. When he finally says it out loud, it is she — not her sister — who names the cost, and chooses the throne over the man.',
		events: [
			{ label: 'Childhood romance thwarted by bone rank.' },
			{ year: 632, label: 'She takes the throne; he takes the army.' },
			{ year: 641, label: 'She stops him. Mercedes theme.' }
		],
		aliases: ['Yushin & Sunduk', 'Sunduk & Yushin']
	},
	{
		id: 'rel-pumsuk-gumilwife',
		name: 'Pumsuk & Geomil’s Wife',
		korean: '품석 · 검일의 아내',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'affair',
		between: ['pumsuk', 'gumilwife'],
		title: 'The feast that burns three kingdoms',
		tagline: 'A capital boy meets a woman who already knows what he wants.',
		arc: 'Pumsuk is Surabol-bred and still young enough to be startled by her. Geomil’s wife does not startle. What passes between them at the feast is mostly unspoken — and enough. Geomil opens the gates. Everything after runs through that room.',
		events: [{ year: 642, label: 'The feast; the gates open.' }],
		aliases: ['Pumsuk & Geomil’s Wife', 'Geomil’s Wife & Pumsuk']
	},
	{
		id: 'rel-euija-maids',
		name: 'Euija & the Court Maids',
		korean: '의자 · 궁녀',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'love',
		between: ['euija', 'courtmaid'],
		title: 'Two, then hundreds, then the cliffs',
		tagline: 'They never stop suggesting. By the end he stops refusing.',
		arc: 'He begins with two. They keep arriving. By his descent they number in the hundreds, and they talk while he tries to rule — until he stops trying. At the Flower Cliffs they jump rather than be taken.',
		events: [
			{ year: 641, label: 'Two.' },
			{ year: 656, label: 'Hundreds; the country is no longer the point.' },
			{ year: 660, label: 'Falling Flowers.' }
		],
		aliases: ['Euija & the Court Maids', 'Court Maids & Euija']
	},
	{
		id: 'rel-haemosu-yuhwa',
		name: 'Haemosu & Yuhwa',
		korean: '해모수 · 유화',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'love',
		between: ['haemosu', 'yuhwa'],
		title: 'Heaven stops the chariot',
		tagline: 'She bathed naked in the Ubal; he came down the same afternoon.',
		arc: 'The sun god crosses the sky every day and stops once. Yuhwa does not hide. He builds a copper room on the bank because waiting has become unbearable. Habek casts her out; Geumwa takes her in; Jumong is born of that heat.',
		events: [{ label: 'The Ubal; the copper room; the egg.' }],
		aliases: ['Haemosu & Yuhwa', 'Yuhwa & Haemosu']
	},
	{
		id: 'rel-jumong-sosuno',
		name: 'Jumong & Sosuno',
		korean: '주몽 · 소서노',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'love',
		between: ['jumong', 'sosuno'],
		title: 'Ledger and longing',
		tagline: 'She priced the marriage; he could not count grain for looking at her.',
		arc: 'Sosuno buys Jumong a kingdom with her father’s routes. At night the war-talk thins and he asks her to close the ledger. Twenty years later a first wife arrives from Buyeo; Sosuno walks south and founds Baekje instead.',
		events: [
			{ year: -37, label: 'Goguryeo founded at Jolbon.' },
			{ year: -18, label: 'Sosuno leaves with her sons; Baekje begins.' }
		],
		aliases: ['Jumong & Sosuno', 'Sosuno & Jumong']
	},
	{
		id: 'rel-suro-heo',
		name: 'Suro & Queen Heo',
		korean: '수로 · 허황옥',
		entity: 'relationship',
		kingdom: 'gaya',
		bond: 'love',
		between: ['suro', 'heohwangok'],
		title: 'The red-sailed ship',
		tagline: 'He walked down himself — and could barely keep his hands away.',
		arc: 'She arrives foreign, luminous, already dreaming of him. He fails at looking politely. Two nights in a tent before anyone may say marriage; by the second dusk he can barely keep his voice steady. A hundred and fifty years; ten sons; two carry her name.',
		events: [
			{ year: 48, label: 'She arrives; he comes down to the shore.' },
			{ label: 'Married a hundred and fifty years.' }
		],
		aliases: ['Suro & Queen Heo', 'Queen Heo & Suro', 'Suro & Heo']
	},
	{
		id: 'rel-ibiga-jeonggyeon',
		name: 'Ibiga & the Lady of the Right View',
		korean: '이비가 · 정견모주',
		entity: 'relationship',
		kingdom: 'gaya',
		bond: 'love',
		between: ['ibiga', 'jeonggyeon'],
		title: 'Heaven on the ridge',
		tagline: 'Sky came down to touch the mountain — and stayed until morning.',
		arc: 'Before the eggs, before the six kingdoms, a sky god kneels on a mountain goddess and admits his thoughts are no longer rightful. From that heat come Suro and Ijinasi.',
		events: [{ label: 'The ridge night; two sons; the eggs of Gaya.' }],
		aliases: ['Ibiga & Lady of the Right View', 'Ibiga & Jeonggyeon']
	},
	{
		id: 'rel-hwanung-ungnyeo',
		name: 'Hwanung & Ungnyeo',
		korean: '환웅 · 웅녀',
		entity: 'relationship',
		kingdom: 'other',
		bond: 'love',
		between: ['hwanung', 'ungnyeo'],
		title: 'Garlic, mugwort, and the sacred tree',
		tagline: 'She waited to be seen; he could not be king until he touched her.',
		arc: 'The bear endures twenty-one days and stands under the tree until heaven notices. What follows is not a tidy myth of duty — it is a prince undone by a woman who used to be a bear. Their son is Dangun.',
		events: [{ label: 'Marriage under the tree; Dangun is born.' }],
		aliases: ['Hwanung & Ungnyeo', 'Ungnyeo & Hwanung']
	},
	{
		id: 'rel-gesomun-gulgul',
		name: 'Yeon & Gulgul',
		korean: '연개소문 · 걸걸',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['gesomun', 'gulgul'],
		title: 'The Mohe boy from the snow',
		tagline: 'Rescued young; raised in Pyongyang; sent north.',
		arc: 'Yeon brings a Mohe boy out of a border raid and keeps him. Gulgul grows into the quiet guard of the northern marches — seldom seen at court, always where the cold is. Later ages will call his son Dae Joyoung.',
		events: [{ label: 'Taken in; raised; posted north.' }],
		aliases: ['Yeon & Gulgul', 'Gesomun & Gulgul']
	},
	{
		id: 'rel-jacheongbi-mundoryeong',
		name: 'Jacheongbi & Mun Doryeong',
		korean: '자청비 · 문도령',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'love',
		between: ['jacheongbi', 'mundoryeong'],
		title: 'Three years at the same desk',
		tagline: 'She cut her hair to study beside him — then made him look.',
		arc: 'Disguised as a boy for three years, she beats him at everything and lets him think it was close. At the parting stream she washes upstream and tells him to see. Heaven kills him for loving her; she walks to the underworld and puts him back together.',
		events: [{ label: 'The haircut; the stream; the resurrection flower.' }],
		aliases: ['Jacheongbi & Mun Doryeong', 'Jacheongbi & Mundoryeong']
	},
	{
		id: 'rel-chunchu-euija',
		name: 'Chunchu & Euija',
		korean: '춘추 · 의자',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'rival',
		between: ['chunchu', 'euija'],
		title: 'Revenge and the poured cup',
		tagline: 'One private injury; eighteen years; a king made to pour wine.',
		arc: 'Gotaso’s death at Daeya makes Chunchu patient. Euija’s manufactured miracles become the omen-war that hollows Baekje. At Sabi, Muyeol makes Euija pour his wine. Neither ever stops calling the other a wretch.',
		events: [
			{ year: 642, label: 'Daeya falls; the vow of revenge.' },
			{ year: 660, label: 'Sabi; the poured cup.' }
		],
		aliases: ['Chunchu & Euija', 'Euija & Chunchu']
	},
	{
		id: 'rel-chunchu-yushin',
		name: 'Chunchu & Yushin',
		korean: '춘추 · 유신',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'sworn',
		between: ['chunchu', 'yushin'],
		title: 'Brother-in-law and marshal',
		tagline: 'Politics and the sword — one house, two careers.',
		arc: 'Yushin is Munhee’s brother and Chunchu’s closest blade. Together they survive Bidam, win Tang, and finish Baekje. The private cost is Gotaso; the public reward is a True Bone throne.',
		events: [{ year: 660, label: 'Sabi falls under their joint design.' }],
		aliases: ['Chunchu & Yushin', 'Yushin & Chunchu']
	},
	{
		id: 'rel-sunduk-chunmyung',
		name: 'Sunduk & Chunmyung',
		korean: '선덕 · 천명',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['sunduk', 'chunmyung'],
		title: 'The sister who chose love',
		tagline: 'One took the throne; one took Chunchu’s father.',
		arc: 'Chunmyung forfeits the succession for love; Sunduk becomes queen. Watching Gotaso marry for love, Sunduk names the pattern across three generations — all but herself.',
		events: [{ year: 632, label: 'Sunduk crowned; Chunmyung’s son waits in the wings.' }],
		aliases: ['Sunduk & Chunmyung']
	},
	{
		id: 'rel-chunchu-gotaso',
		name: 'Chunchu & Gotaso',
		korean: '춘추 · 고타소',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['chunchu', 'gotaso'],
		title: 'Father and daughter',
		tagline: 'He made Pumsuk swear; he spent eighteen years collecting the debt.',
		arc: 'Gotaso’s death at Daeya is the private wound that turns diplomat into avenger. Every embassy after — Goguryeo, Yamato, Tang — runs through that room.',
		events: [{ year: 642, label: 'Daeya; the vow of revenge.' }],
		aliases: ['Chunchu & Gotaso']
	},
	{
		id: 'rel-munhee-bohee',
		name: 'Munhee & Bohee',
		korean: '문희 · 보희',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['munhee', 'bohee'],
		title: 'Sisters and a drowned capital',
		tagline: 'One dream, one silk skirt, one dynasty.',
		arc: 'Bohee sells the dream; Munhee buys it. The worst trade in Silla’s thousand years becomes the marriage that produces kings.',
		events: [{ year: 625, label: 'The dream is sold for a skirt.' }],
		aliases: ['Munhee & Bohee']
	},
	{
		id: 'rel-euija-gyebek',
		name: 'Euija & Gyebek',
		korean: '의자 · 계백',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'mentor',
		between: ['euija', 'gyebek'],
		title: 'The named general',
		tagline: 'He gave a commoner a name — and ten thousand men at Hwangsan.',
		arc: 'Euija elevates Gyebek when the clans will not. At Hwangsanbeol Gyebek kills his family and dies fighting. The king who named him cannot save the country.',
		events: [{ year: 660, label: 'Hwangsanbeol.' }],
		aliases: ['Euija & Gyebek']
	},
	{
		id: 'rel-jumong-yuhwa',
		name: 'Jumong & Yuhwa',
		korean: '주몽 · 유화',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['jumong', 'yuhwa'],
		title: 'Mother and the egg',
		tagline: 'Cast out for loving the sun; she raises the archer who founds a kingdom.',
		arc: 'Yuhwa bears Jumong after Haemosu. In Buyeo the boy outgrows jealousy; she is the river-blood in his claim to heaven.',
		events: [{ label: 'The egg; the flight from Buyeo.' }],
		aliases: ['Jumong & Yuhwa']
	},
	{
		id: 'rel-onjo-sosuno',
		name: 'Onjo & Sosuno',
		korean: '온조 · 소서노',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['onjo', 'sosuno'],
		title: 'Mother of Baekje',
		tagline: 'She walked south when Goguryeo chose another heir.',
		arc: 'Sosuno takes Onjo and Biryu south after Yuri inherits. Onjo founds Baekje; her money and routes are the kingdom’s dowry.',
		events: [{ year: -18, label: 'Baekje founded.' }],
		aliases: ['Onjo & Sosuno']
	},
	{
		id: 'rel-gesomun-chunchu',
		name: 'Yeon & Chunchu',
		korean: '연개소문 · 춘추',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'rival',
		between: ['gesomun', 'chunchu'],
		title: 'Prisoner and host',
		tagline: 'He locked Chunchu up — then let him go to Tang.',
		arc: 'Chunchu comes to Goguryeo for troops after Daeya. Yeon imprisons him, lectures him, releases him. The man he frees returns with Tang.',
		events: [{ year: 642, label: 'Chunchu held in Pyongyang.' }],
		aliases: ['Yeon & Chunchu', 'Gesomun & Chunchu']
	},
	{
		id: 'rel-hwanung-dangun',
		name: 'Hwanung & Dangun',
		korean: '환웅 · 단군',
		entity: 'relationship',
		kingdom: 'other',
		bond: 'kin',
		between: ['hwanung', 'dangun'],
		title: 'Son of Heaven and Grandson of Heaven',
		tagline: 'The mandate descends one generation, then stays to found a capital.',
		arc: 'Hwanung brings heaven’s seals to earth; Dangun keeps the court at Asadal. Lord of Heaven, Son of Heaven, Grandson of Heaven — one line, three offices.',
		events: [{ label: 'Asadal founded; fifteen hundred years.' }],
		aliases: ['Hwanung & Dangun']
	},
	{
		id: 'rel-yushin-munmu',
		name: 'Yushin & Bupmin',
		korean: '유신 · 법민',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'mentor',
		between: ['yushin', 'munmu'],
		title: 'Marshal and flower youth',
		tagline: 'Uncle by marriage; head of the Hwarang by oath.',
		arc: 'After Daeya, Yushin trains Bupmin among the Hwarang — horse, bow, the Five Principles — until “a king for all” starts to mean loyalty to a country, not only a childhood sentence. The boy who becomes Munmu still salutes the marshal who taught him the yard.',
		events: [{ year: 643, label: 'Bupmin trains under Marshal Yushin.' }],
		aliases: ['Yushin & Bupmin', 'Yushin & Munmu', 'Bupmin & Yushin']
	},
	{
		id: 'rel-yumla-kangrim',
		name: 'Yumla & Kangrim',
		korean: '염라 · 강림',
		entity: 'relationship',
		kingdom: 'underworld',
		bond: 'sworn',
		between: ['yumla', 'kangrim'],
		title: 'King and escort',
		tagline: 'Heaven sent an arrest; His Majesty kept a messenger.',
		arc: 'Kangrim was meant to bring King Yumla up. He stayed. The underworld kingdom runs on that loyalty the way Silla runs on the Hwarang — borders of the dead, minutes kept, one question at the threshold.',
		events: [{ label: 'Kangrim stays; the crow scrambles the ledger.' }],
		aliases: ['Yumla & Kangrim', 'Kangrim & Yumla']
	},
	{
		id: 'rel-sunduk-bidam',
		name: 'Sunduk & Bidam',
		korean: '선덕 · 비담',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'rival',
		between: ['sunduk', 'bidam'],
		title: 'The rebellion of the star',
		tagline: 'He read an omen against a queen; Yushin read it back.',
		arc: 'Bidam rebels when a star falls. Sunduk dies in the crisis; Yushin and Chunchu put the revolt down. Jinduk takes the throne afterward.',
		events: [{ year: 647, label: 'Bidam’s rebellion.' }],
		aliases: ['Sunduk & Bidam']
	},
	{
		id: 'rel-taizong-xuerengui',
		name: 'Taizong & Xue Rengui',
		korean: '태종 · 설인귀',
		entity: 'relationship',
		kingdom: 'tang',
		bond: 'mentor',
		between: ['taizong', 'xuerengui'],
		title: 'The white coat and the eye that found it',
		tagline: '“I am less happy about gaining Liaodong than about gaining you.”',
		arc: 'A farmer answers the muster; at Stallion Mountain Taizong sees the white armour and the fangtian ji and chooses his eastern blade. Xue spends the rest of the war proving the choice was cheaper than another province.',
		events: [{ year: 645, label: 'Taizong notices Xue Rengui in white at Stallion Mountain.' }],
		aliases: ['Taizong & Xue', 'Emperor & White Tiger II']
	}
];

export function relationOf(a: string, b: string): Person | undefined {
	return RELATIONSHIPS.find(
		(r) => r.between && ((r.between[0] === a && r.between[1] === b) || (r.between[0] === b && r.between[1] === a))
	);
}
