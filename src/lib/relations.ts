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
	{ id: 'jayi', x: -40, y: 700, rank: 2, era: 'present', gender: 'f' },
	{ id: 'seonpum', x: -120, y: 620, rank: 1, era: 'present', gender: 'm' },
	{ id: 'inmun', x: 40, y: 760, rank: 1, era: 'present', gender: 'm' },
	{ id: 'alchun', x: 220, y: 780, rank: 1, era: 'present', gender: 'm' },
	{ id: 'gwanchang', x: 380, y: 780, rank: 1, era: 'present', gender: 'm' },

	// ——— PRESENT · Baekje ———
	{ id: 'euija', x: 820, y: 250, rank: 3, era: 'present', gender: 'm' },
	{ id: 'courtmaid', x: 1020, y: 250, rank: 1, era: 'present', gender: 'f' },
	{ id: 'ungo', x: 920, y: 160, rank: 1, era: 'present', gender: 'f' },
	{ id: 'gyebek', x: 720, y: 440, rank: 2, era: 'present', gender: 'm' },
	{ id: 'seongchung', x: 900, y: 440, rank: 1, era: 'present', gender: 'm' },
	{ id: 'chunbok', x: 1060, y: 440, rank: 1, era: 'present', gender: 'm' },
	{ id: 'queensatek', x: 720, y: 600, rank: 1, era: 'present', gender: 'f' },
	{ id: 'eldersatek', x: 620, y: 520, rank: 1, era: 'present', gender: 'm' },
	{ id: 'ministersatek', x: 620, y: 640, rank: 1, era: 'present', gender: 'm' },
	{ id: 'sateksondung', x: 540, y: 580, rank: 1, era: 'present', gender: 'm' },
	{ id: 'elderyunbi', x: 1140, y: 520, rank: 1, era: 'present', gender: 'm' },
	{ id: 'yunbihana', x: 1140, y: 640, rank: 1, era: 'present', gender: 'f' },
	{ id: 'yung', x: 820, y: 600, rank: 1, era: 'present', gender: 'm' },
	{ id: 'tae', x: 900, y: 600, rank: 1, era: 'present', gender: 'm' },
	{ id: 'hyo', x: 820, y: 700, rank: 1, era: 'present', gender: 'm' },
	{ id: 'yun', x: 900, y: 700, rank: 1, era: 'present', gender: 'm' },
	{ id: 'pung', x: 980, y: 700, rank: 1, era: 'present', gender: 'm' },
	{ id: 'yesikjin', x: 1060, y: 600, rank: 1, era: 'present', gender: 'm' },
	{ id: 'boksin', x: 980, y: 800, rank: 1, era: 'present', gender: 'm' },

	// ——— PRESENT · Goguryeo ———
	{ id: 'yeongnyu', x: 1380, y: 120, rank: 1, era: 'present', gender: 'm' },
	{ id: 'gesomun', x: 1380, y: 300, rank: 3, era: 'present', gender: 'm' },
	{ id: 'gulgul', x: 1560, y: 220, rank: 1, era: 'present', gender: 'm' },
	{ id: 'bojang', x: 1200, y: 300, rank: 2, era: 'present', gender: 'm' },
	{ id: 'yangmanchun', x: 1560, y: 300, rank: 2, era: 'present', gender: 'm' },
	{ id: 'jungto', x: 1200, y: 420, rank: 1, era: 'present', gender: 'm' },
	{ id: 'sooyoung', x: 1200, y: 520, rank: 1, era: 'present', gender: 'f' },
	{ id: 'namseng', x: 1380, y: 480, rank: 1, era: 'present', gender: 'm' },
	{ id: 'namgun', x: 1520, y: 520, rank: 1, era: 'present', gender: 'm' },
	{ id: 'namsan', x: 1460, y: 600, rank: 1, era: 'present', gender: 'm' },

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
	{ id: 'daebyeol', x: 1080, y: 1580, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'sobyeol', x: 1280, y: 1580, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'yumla', x: 1180, y: 1720, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'kangrim', x: 1080, y: 1900, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'haewonmek', x: 1280, y: 1900, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'sara', x: 1480, y: 1580, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'jacheongbi', x: 1380, y: 1720, rank: 2, era: 'myth', gender: 'f' },
	{ id: 'mundoryeong', x: 1580, y: 1720, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'sanbangdeok', x: 1580, y: 1900, rank: 1, era: 'myth', gender: 'f' },
	{ id: 'sulmun', x: 560, y: 1720, rank: 2, era: 'myth', gender: 'f' },
	{ id: 'mago', x: 40, y: 1720, rank: 1, era: 'myth', gender: 'f' },
	{ id: 'bari', x: 980, y: 1900, rank: 1, era: 'myth', gender: 'f' },
	{ id: 'heavenearthking', x: 1180, y: 1460, rank: 2, era: 'myth', gender: 'm' },
	{ id: 'chongmyeong', x: 1320, y: 1460, rank: 1, era: 'myth', gender: 'f' },
	{ id: 'yang_tamla', x: 680, y: 1900, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'go_tamla', x: 800, y: 1900, rank: 1, era: 'myth', gender: 'm' },
	{ id: 'bu_tamla', x: 920, y: 1900, rank: 1, era: 'myth', gender: 'm' }
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
		arc: 'After Chunchu brings her home from the ford, Gotaso falls the way a girl of fifteen falls — completely. Gyuku, rain, forever. At Daeya the oath fails; both die, and the private injury becomes a war.',
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
		id: 'rel-munmu-jayi',
		name: 'Bupmin & Jayi',
		korean: '법민 · 자의',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'love',
		between: ['munmu', 'jayi'],
		title: 'Harbour ledgers, rain, a queen',
		tagline: 'She corrected his sums. He kept her tide. The series’ most successful romance.',
		arc: 'Under Yushin’s voluntary countryside posting as junior Pajinchan, Bupmin meets Jayi (자의) — daughter of Councillor of Ocean Trade Kim Seonpum — in a K-drama of rain, brushes, and almost-kisses. Bone rank marries them cleanly later; the harbour married them first. Unlike the tragic and half-finished loves around them, they finish as political partners: queen and king still arguing tide tables when Samhan is finally one.',
		events: [
			{ year: 644, label: 'Meet over ocean ledgers at the quay.' },
			{ year: 661, label: 'She becomes queen consort when he takes the throne.' },
			{ year: 676, label: 'Stand together as the harbour lesson crowned.' }
		],
		aliases: ['Bupmin & Jayi', 'Munmu & Jayi', 'Jayi & Bupmin', 'Jayi & Munmu']
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
		name: 'Pumsuk & Gumil’s Wife',
		korean: '품석 · 검일의 아내',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'affair',
		between: ['pumsuk', 'gumilwife'],
		title: 'The feast that burns three kingdoms',
		tagline: 'A capital boy meets a woman who already knows what he wants.',
		arc: 'Pumsuk is Surabol-bred and still young enough to be startled by her. Gumil’s wife does not startle. What passes between them at the feast is mostly unspoken — and enough. Gumil opens the gates. Everything after runs through that room.',
		events: [{ year: 642, label: 'The feast; the gates open.' }],
		aliases: ['Pumsuk & Gumil’s Wife', 'Gumil’s Wife & Pumsuk', 'Pumsuk & Geomil’s Wife']
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
		tagline: 'She bathed naked in the Ubal; he came down the same afternoon — and came again for her soul.',
		arc: 'The sun god crosses the sky every day and stops once. Yuhwa does not hide. He builds a copper room on the bank because waiting has become unbearable. Habek casts her out; Geumwa takes her in; Jumong is born of that heat. When she dies he does not send a reaper. He comes himself. She keeps the night as moon.',
		events: [
			{ label: 'The Ubal; the copper room; the egg.' },
			{ label: 'He takes her soul; she becomes goddess of the moon.' }
		],
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
		kingdom: 'joseon',
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
		arc: 'Yeon brings a Mohe boy out of a border raid and keeps him. Gulgul grows into the quiet guard of the northern marches — seldom seen at court, always where the cold is — and when Yeon posts him north he gives him the surname Dae. Later ages will call his son Dae Joyoung.',
		events: [
			{ year: 634, label: 'Taken in; named Gulgul.' },
			{ year: 642, label: 'Given the surname Dae; posted north.' }
		],
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
		arc: 'Yuhwa bears Jumong after Haemosu. In Buyeo the boy outgrows jealousy; she is the river-blood in his claim to heaven. Her last mortal word is for him; after that she is the moon.',
		events: [
			{ label: 'The egg; the flight from Buyeo.' },
			{ label: 'She dies; the sun takes her soul; night keeps a face.' }
		],
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
		kingdom: 'joseon',
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
		title: 'Judge and reaper',
		tagline: 'Heaven sent an arrest; the court kept a messenger.',
		arc: 'Kangrim was meant to bring Judge Yumla up. He stayed. Under Big Star’s 저승, Yumla judges and Kangrim fetches — minutes kept, one question at the threshold — the way Silla runs on the Hwarang.',
		events: [{ label: 'Kangrim stays; the crow scrambles the ledger.' }],
		aliases: ['Yumla & Kangrim', 'Kangrim & Yumla']
	},
	{
		id: 'rel-kangrim-haewonmek',
		name: 'Kangrim & Haewonmek',
		korean: '강림 · 해원맥',
		entity: 'relationship',
		kingdom: 'underworld',
		bond: 'sworn',
		between: ['kangrim', 'haewonmek'],
		title: 'The two reapers',
		tagline: 'One office in the street — two names who argue at every door.',
		arc: 'They share the crow’s scrambled ledger and split the threshold: Kangrim asks Kangrim’s Question; Haewonmek asks only for last words. At Daeya Kangrim takes Gotaso, Haewonmek takes Pumsuk. At Hwangsan both come for Gyebek and the five thousand. At Salsu both fail Gesomun. Elites know both names; wet nurses still say only 저승사자.',
		events: [
			{ year: 642, label: 'Daeya — two collections, one banter.' },
			{ year: 660, label: 'Hwangsan — both named correctly by Gyebek.' },
			{ year: 662, label: 'Snake River — both refused by Yeon Gesomun.' }
		],
		aliases: [
			'Kangrim & Haewonmaek',
			'Kangrim & Haewonmek',
			'Haewonmaek & Kangrim',
			'Haewonmek & Kangrim',
			'the two reapers'
		]
	},
	{
		id: 'rel-daebyeol-sobyeol',
		name: 'Big Star & Little Star',
		korean: '대별왕 · 소별왕',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'kin',
		between: ['daebyeol', 'sobyeol'],
		title: 'Twin division of the worlds',
		tagline: 'Father retired; one cheated for the living world; one kept the orderly dark.',
		arc: 'Heaven–Earth King (Class I) retires from ruling all mortals — living and dead — and leaves the charge to his sons. Flower wager, swapped blooms, 이승 to the younger, 저승 to the elder. Big Star still mends suns and moons for his brother’s mess — and leaves human vice alone.',
		events: [
			{ label: 'Heaven–Earth King retires; sons inherit the charge.' },
			{ label: 'Flower wager; division of 이승 and 저승.' }
		],
		aliases: ['Big Star & Little Star', 'Daebyeol & Sobyeol', '대별왕 · 소별왕']
	},
	{
		id: 'rel-yumla-daebyeol',
		name: 'Big Star & Yumla',
		korean: '대별왕 · 염라',
		entity: 'relationship',
		kingdom: 'underworld',
		bond: 'mentor',
		between: ['daebyeol', 'yumla'],
		title: 'Ruler and judge',
		tagline: 'Big Star keeps 저승; Yumla keeps the sentence.',
		arc: 'Sovereignty and judgment split cleanly: Paradise, Siwang, Hell sit inside Big Star’s realm; Yumla’s purple court weighs the dead who arrive by reaper road.',
		events: [{ label: 'Judgment nested under Big Star’s rule.' }],
		aliases: ['Big Star & Yumla', 'Yumla & Big Star', '대별왕 · 염라']
	},
	{
		id: 'rel-sara-jacheongbi',
		name: 'Hallakgungi & Jacheongbi',
		korean: '할락궁이 · 자청비',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'mentor',
		between: ['sara', 'jacheongbi'],
		title: 'Flower warden and the girl who walked west',
		tagline: 'She borrowed resurrection — and later, ruin.',
		arc: 'Jacheongbi reaches 서천꽃밭 in man’s clothes; Hallakgungi (할락궁이 — active after Saradoryeong retired) yields the five life-flowers for Mun Doryeong, and later the extinction bloom against heaven’s rebels. The fourth realm opens for her because she asks correctly.',
		events: [{ label: 'Resurrection flowers; later the doom-flower.' }],
		aliases: [
			'Hallakgungi & Jacheongbi',
			'The Gardener & Jacheongbi',
			'Sara & Jacheongbi',
			'할락궁이 · 자청비',
			'사라도령 · 자청비'
		]
	},
	{
		id: 'rel-heavenearthking-chongmyeong',
		name: 'Heaven–Earth King & Chongmyeong',
		korean: '천지왕 · 총명부인',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'kin',
		between: ['heavenearthking', 'chongmyeong'],
		title: 'Retired prior and the mother of the twins',
		tagline: 'He kept both ledgers; she kept the house that later split.',
		arc: '「천지왕본풀이」: Heaven–Earth King and Lady Chongmyeong bear Big Star and Little Star. He retires from ruling living and dead; the sons wager flowers. She does not take a realm.',
		events: [{ label: 'Twins born; father retires; 이승 and 저승 divide.' }],
		aliases: [
			'Heaven–Earth King & Chongmyeong',
			'Chongmyeong & Heaven–Earth King',
			'천지왕 · 총명부인'
		]
	},
	{
		id: 'rel-go-yang',
		name: 'Go & Yang',
		korean: '고 · 양',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'kin',
		between: ['go_tamla', 'yang_tamla'],
		title: 'Princes of the hollow',
		tagline: 'Two of three who rose from Samseonghyeol — not from an egg.',
		arc: 'They divide Tamla by arrow with Bu, marry princesses from the East Sea box, and leave surnames the island still counts.',
		events: [{ label: 'Emergence from Samseonghyeol; arrow-division of the island.' }],
		aliases: ['Go & Yang', 'Yang & Go', '고 · 양']
	},
	{
		id: 'rel-yang-bu',
		name: 'Yang & Bu',
		korean: '양 · 부',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'kin',
		between: ['yang_tamla', 'bu_tamla'],
		title: 'Princes of the hollow',
		tagline: 'Well-brothers who learned farming from a drifting box.',
		arc: 'With Go they rise, shoot, marry, and open Tamla’s grain age when the sea-box yields calves, foals, and the five grains.',
		events: [{ label: 'Pond wedding; five grains from the box.' }],
		aliases: ['Yang & Bu', 'Bu & Yang', '양 · 부']
	},
	{
		id: 'rel-go-bu',
		name: 'Go & Bu',
		korean: '고 · 부',
		entity: 'relationship',
		kingdom: 'tamla',
		bond: 'kin',
		between: ['go_tamla', 'bu_tamla'],
		title: 'Princes of the hollow',
		tagline: 'Third and first of the surname lines — same breath from the well.',
		arc: 'Samseonghyeol’s triad: no eggs, three arrows, three princesses, one island taught to farm.',
		events: [{ label: 'Founding of the Go and Bu lines on Tamla.' }],
		aliases: ['Go & Bu', 'Bu & Go', '고 · 부']
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
	},
	{
		id: 'rel-yushin-bidam',
		name: 'Yushin & Bidam',
		korean: '유신 · 비담',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'rival',
		between: ['yushin', 'bidam'],
		title: 'One hundred and eight',
		tagline: 'Tied forever in the yard — until Radiance makes the count blood.',
		arc: 'Age-mates from the Hwarang: Gaya steel against Surabol’s oldest hall, score locked at 108–108. Bidam names Yushin foreigner when the star falls; the duel that was always even becomes a rebellion’s end.',
		events: [
			{ label: 'Yard rivals — the count never leaves 108–108.' },
			{ year: 647, label: 'Radiance; Bidam’s head; the score breaks.' }
		],
		aliases: ['Yushin & Bidam', 'Bidam & Yushin']
	},
	{
		id: 'rel-sunduk-jinduk',
		name: 'Sunduk & Jinduk',
		korean: '선덕 · 진덕',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['sunduk', 'jinduk'],
		title: 'Two queens, one house',
		tagline: 'Sister crowns; one dies in the crisis, one finishes the sentence.',
		arc: 'Sacred Bone sisters under Jinpyung. Sunduk takes the throne first; after Bidam and the falling star, Jinduk inherits the unfinished work and the Tang question Chunchu will answer.',
		events: [
			{ year: 632, label: 'Sunduk crowned.' },
			{ year: 647, label: 'Jinduk takes the throne after the rebellion.' }
		],
		aliases: ['Sunduk & Jinduk', 'Jinduk & Sunduk']
	},
	{
		id: 'rel-yushin-munhee',
		name: 'Yushin & Munhee',
		korean: '유신 · 문희',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['yushin', 'munhee'],
		title: 'Brother and the dream-buyer',
		tagline: 'He gives the marshal’s house a queen’s sister-in-law.',
		arc: 'Munhee is Yushin’s younger sister — the skirt that bought a drowned capital and sewed Chunchu into their bloodline. The marshal’s loyalty to the throne runs through her marriage as much as through bone rank.',
		events: [{ year: 625, label: 'Munhee marries Chunchu; two houses become one design.' }],
		aliases: ['Yushin & Munhee', 'Munhee & Yushin']
	},
	{
		id: 'rel-chunchu-munmu',
		name: 'Chunchu & Bupmin',
		korean: '춘추 · 법민',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['chunchu', 'munmu'],
		title: 'Father and the stolen sentence',
		tagline: '“A king for all” — the boy took the words; the father cleared the road.',
		arc: 'Bupmin grows in Chunchu’s shadow and Munhee’s packing lists. He inherits a half-won war and finishes the peninsula his father opened as far as Baekje — then turns on the ally the father invited in.',
		events: [
			{ label: 'Childhood: steals the sentence “a king for all.”' },
			{ year: 661, label: 'Muyeol dies; Munmu takes the unfinished map.' }
		],
		aliases: ['Chunchu & Bupmin', 'Chunchu & Munmu', 'Muyeol & Munmu']
	},
	{
		id: 'rel-gesomun-yeongnyu',
		name: 'Yeon & Yeongnyu',
		korean: '연개소문 · 영류',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'rival',
		between: ['gesomun', 'yeongnyu'],
		title: 'Banquet and the emptied summit',
		tagline: 'The king kept the final vote; the nephew took the blades.',
		arc: 'Yeongnyu’s court tries to contain Yeon; Yeon answers with a massacre at the High Summit and wears five swords home. The uncle dies; the nephew remakes the kingdom as Supreme Commander.',
		events: [{ year: 642, label: 'Yeon’s Massacre — Yeongnyu falls.' }],
		aliases: ['Yeon & Yeongnyu', 'Gesomun & Yeongnyu']
	},
	{
		id: 'rel-gesomun-bojang',
		name: 'Yeon & Bojang',
		korean: '연개소문 · 보장',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'mentor',
		between: ['gesomun', 'bojang'],
		title: 'Puppet crown, real sword',
		tagline: 'He seats a king so the Summit will still have a smile to finalise.',
		arc: 'After the knives, Yeon installs Bojang. The boy-king keeps the forms; the Supreme Commander keeps the blades. When Yeon dies, the forms are not enough to hold three sons.',
		events: [{ year: 642, label: 'Bojang enthroned under Yeon’s hand.' }],
		aliases: ['Yeon & Bojang', 'Gesomun & Bojang']
	},
	{
		id: 'rel-gesomun-namseng',
		name: 'Yeon & Namseng',
		korean: '연개소문 · 남생',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['gesomun', 'namseng'],
		title: 'Eldest of the three',
		tagline: 'Heir to five blades — and to a house that eats its own.',
		arc: 'Yeon Namseng is raised under Gesomun’s own strict roof — not Jungto’s softer hall — to inherit command. After Yeon’s death poisoned messengers and Tang’s invitation turn inheritance into exile; he opens a door his father would have barred.',
		events: [
			{ label: 'Raised as eldest sword-heir under Gesomun.' },
			{ year: 666, label: 'Defects; the fall accelerates.' }
		],
		aliases: ['Yeon & Namseng', 'Gesomun & Namseng', 'Yeon & Yeon Namseng']
	},
	{
		id: 'rel-namseng-namgun',
		name: 'Yeon Namseng & Yeon Namgun',
		korean: '연남생 · 연남건',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['namseng', 'namgun'],
		title: 'Brothers after the blades',
		tagline: 'One opens the gate to Tang; one stays to lose the city.',
		arc: 'Two roofs, one house: Yeon Namseng forged by Gesomun; Yeon Namgun and Yeon Namsan warmed by Jungto and Sooyoung — sons, not Mount Namsan of Surabol. Messengers tell each the other wants them dead — Chunchu’s kind of plot, never said aloud. Namseng rides to Tang; Namgun and Namsan take a last stand that cannot outlast betrayal.',
		events: [{ year: 666, label: 'The brothers’ coup; the house splits.' }],
		aliases: [
			'Yeon Namseng & Yeon Namgun',
			'Namseng & Namgun',
			'Namgun & Namseng',
			'연남생 · 연남건'
		]
	},
	{
		id: 'rel-euija-yung',
		name: 'Euija & Yung',
		korean: '의자 · 융',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'yung'],
		title: 'Father and the demoted eldest',
		tagline: 'Satek made him inevitable; Euija made him former.',
		arc: 'Yung is first of the five important sons — Satek-maternal, crown prince until 655. Euija cuts the mark to break the sleeve that raised him, and keeps a son who will never forgive the arithmetic.',
		events: [
			{ year: 644, label: 'Named crown prince while still Satek’s favourite.' },
			{ year: 655, label: 'Demoted; Hyo takes the mark.' }
		],
		aliases: ['Euija & Yung', 'Yung & Euija']
	},
	{
		id: 'rel-euija-tae',
		name: 'Euija & Tae',
		korean: '의자 · 태',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'tae'],
		title: 'Father and the Jinmo second',
		tagline: 'Second son, second house — counted, rarely crowned.',
		arc: 'Tae is second of the five — Jinmo maternal claim beside Yung’s Satek. Euija seats him with the forty-one; the street reads him as the spare key Jinmo kept polished.',
		events: [{ year: 655, label: 'Seated over emptied clan chairs.' }],
		aliases: ['Euija & Tae', 'Tae & Euija']
	},
	{
		id: 'rel-euija-hyo',
		name: 'Euija & Hyo',
		korean: '의자 · 효',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'hyo'],
		title: 'Father and the replacement crown',
		tagline: 'Eungo’s son — chosen because he was not Satek’s.',
		arc: 'Hyo is third of the five. Euija moves the crown-prince mark to him in 655 to keep Queen Satek’s house from ruling through the eldest. The gift is also a target.',
		events: [{ year: 655, label: 'Named crown prince in Yung’s place.' }],
		aliases: ['Euija & Hyo', 'Hyo & Euija']
	},
	{
		id: 'rel-euija-yun',
		name: 'Euija & Prince Yun',
		korean: '의자 · 부여연',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'yun'],
		title: 'Father and the Hae fourth',
		tagline: 'Prince Yun / Buyeo Yun — not Yeon Gesomun, not Yung, not Yunbi.',
		arc: 'Prince Yun is fourth of the five — Hae maternal, easy to mishear as Yung if the scribe is lazy, and easy for English to misfile under Yeon Gesomun’s 淵. Euija seats him with the rest; the chronicle keeps Buyeo Yun / 부여연 / 扶餘演 distinct from 융, from the wrong 윤, from Yunbi (연비), and from Goguryeo’s Yeon house.',
		events: [{ year: 655, label: 'Seated; another clan loses a quiet claim.' }],
		aliases: ['Euija & Prince Yun', 'Euija & Yun', 'Yun & Euija', 'Euija & Buyeo Yun']
	},
	{
		id: 'rel-euija-pung',
		name: 'Euija & Pung',
		korean: '의자 · 풍',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'pung'],
		title: 'Father and the restoration prince',
		tagline: 'Fifth of the five — Mokli berth, then Yamato, then a crown of leftovers.',
		arc: 'Pung is fifth among Euija’s important sons — Mokli-maternal enough that an eastern berth already feels like destiny. After Sabi he becomes the face of the Baekje Restoration Army — Yamato ships, Boksin’s plots, and a crown that no longer has a country.',
		events: [
			{ year: 655, label: 'Sons packed into the Assembly.' },
			{ year: 661, label: 'BRA wars begin in his name.' }
		],
		aliases: ['Euija & Pung', 'Pung & Euija']
	},
	{
		id: 'rel-tae-yun',
		name: 'Tae & Prince Yun',
		korean: '태 · 부여연',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['tae', 'yun'],
		title: 'Second and fourth',
		tagline: 'Jinmo ledger and Hae salt — Prince Yun is Buyeo Yun, not Yeon Gesomun.',
		arc: 'While Yung and Hyo burn over the mark, Tae and Prince Yun keep the quieter rivalry of maternal harbours: Jinmo arithmetic versus Hae berths. Neither gets the crown story; both get seats in 655 and captive lists in 660.',
		events: [{ year: 655, label: 'Both seated; both still someone else’s faction whisper.' }],
		aliases: ['Tae & Prince Yun', 'Tae & Yun', 'Yun & Tae', 'Tae & Buyeo Yun']
	},
	{
		id: 'rel-euija-queensatek',
		name: 'Euija & Queen Satek',
		korean: '의자 · 사택왕후',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'queensatek'],
		title: 'Mother of the Eraha',
		tagline: 'Satek blood on the throne — and on the veto that made him.',
		arc: 'Queen Satek’s house — under Minister Satek — holds both crown and Prime Minister when Euija rises. The Eight Clans’ grip is the childhood he later breaks by seating his own sons.',
		events: [{ label: 'Satek queen and Satek Premier — Euija’s starting board.' }],
		aliases: ['Euija & Queen Satek', 'Queen Satek & Euija']
	},
	{
		id: 'rel-euija-ungo',
		name: 'Euija & Queen Eungo',
		korean: '의자 · 웅고',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'kin',
		between: ['euija', 'ungo'],
		title: 'King and the mother of Hyo',
		tagline: 'She names the fear he already has — Yung belongs to Satek.',
		arc: 'Eungo is Euija’s wife and Hyo’s mother. After Queen Satek’s death she presses the succession cut: strip Yung of the crown-prince mark before Minister Satek’s sleeve grows back through the eldest son.',
		events: [{ year: 655, label: 'Hyo named crown prince; Yung demoted.' }],
		aliases: ['Euija & Eungo', 'Eungo & Euija', 'Euija & Queen Eungo', 'Euija & Queen Ungo']
	},
	{
		id: 'rel-yung-hyo',
		name: 'Yung & Hyo',
		korean: '융 · 효',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'rival',
		between: ['yung', 'hyo'],
		title: 'Crown-prince swap',
		tagline: 'Eldest stripped; younger crowned — brothers become factions.',
		arc: 'Euija removes Yung as crown prince for Hyo — motive: Yung too deep in Satek control, Eungo’s counsel in the same key. The rivalry outruns the Assembly purge and ends only when the kingdom does.',
		events: [{ year: 655, label: 'Mark moves from Yung to Hyo.' }],
		aliases: ['Yung & Hyo', 'Hyo & Yung']
	},
	{
		id: 'rel-tae-hyo',
		name: 'Tae & Hyo',
		korean: '태 · 효',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'rival',
		between: ['tae', 'hyo'],
		title: 'Skipped second and sudden third',
		tagline: 'The mark jumped the aisle — one brother watched, one wore it.',
		arc: 'When Euija demotes Yung, Tae is the son standing between eldest and chosen. The rivalry stays quieter than Yung–Hyo — a corridor silence rather than a river war — but the seating chart never quite forgives either of them.',
		events: [{ year: 655, label: 'Mark moves to Hyo past Tae.' }],
		aliases: ['Tae & Hyo', 'Hyo & Tae']
	},
	{
		id: 'rel-yung-pung',
		name: 'Yung & Pung',
		korean: '융 · 풍',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'rival',
		between: ['yung', 'pung'],
		title: 'Opposite banks at Baekgang',
		tagline: 'One kneels into Tang’s ledger; one sails a restoration into fire.',
		arc: 'Succession bitterness and exile routes put the brothers on opposite sides at the White River in 663 — Yung with the victors’ captive usefulness, Pung with the BRA’s last fleet.',
		events: [{ year: 663, label: 'Face each other across the White River.' }],
		aliases: ['Yung & Pung', 'Pung & Yung']
	},
	{
		id: 'rel-satek-yunbi',
		name: 'Elder Satek & Elder Yunbi',
		korean: '적덕 · 문진',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'rival',
		between: ['eldersatek', 'elderyunbi'],
		title: 'Sleeve versus arm',
		tagline: 'Four generations — harbours, writs, and lantern-festival dead.',
		arc: 'Elder Satek and Elder Yunbi are the named faces of the feud the street already knows. They truce once to remove Gyebek, then lose every chair to Euija’s sons anyway.',
		events: [
			{ year: 632, label: 'Feud already four generations deep.' },
			{ year: 655, label: 'Night truce; still purged.' }
		],
		aliases: ['Satek & Yunbi', 'Elder Satek & Elder Yunbi', 'Jukduk & Munjin', 'Jijeok & Munjin', 'Munjin & Jijeok']
	},
	{
		id: 'rel-jijeok-hana',
		name: 'Lady Yunbi & the Sateks',
		korean: '한아 · 사택',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'rival',
		between: ['yunbihana', 'sateksondung'],
		title: 'Wharf feud, personal volume',
		tagline: 'She keeps score; he climbs walls; both call it house honour.',
		arc: 'Lady Yunbi’s sharp house-pride meets Satek Sondeung’s street volume — the feud’s younger register under Elder Satek and Elder Yunbi’s Assembly theatre.',
		events: [{ year: 632, label: 'West-bridge cart; roof-tiles; unfinished insults.' }],
		aliases: ['Hana & Sondeung', 'Sondeung & Hana', 'Lady Yunbi & Satek', 'Yunbi Hana & Satek']
	},
	{
		id: 'rel-jungto-sooyoung',
		name: 'Jungto & Sooyoung',
		korean: '정토 · 수영',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['jungto', 'sooyoung'],
		title: 'The softer Yeon roof',
		tagline: 'Brother and sister who raised Yeon Namgun and Yeon Namsan — not the heir.',
		arc: 'While Gesomun drills Yeon Namseng, his siblings Jungto and Sooyoung keep a hall where Yeon Namgun and Yeon Namsan eat. That split becomes the crack messengers later poison. Yeon Namsan the son — never Mount Namsan of Surabol.',
		events: [{ label: 'Raise Yeon Namgun and Yeon Namsan away from Gesomun’s strict roof.' }],
		aliases: ['Jungto & Sooyoung', 'Sooyoung & Jungto']
	},
	{
		id: 'rel-gesomun-jungto',
		name: 'Gesomun & Jungto',
		korean: '개소문 · 정토',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['gesomun', 'jungto'],
		title: 'The strict brother and the soft',
		tagline: 'One house, two roofs — the drill hall and the supper hall.',
		arc: 'Brothers of the Yeon house. Gesomun keeps the heir Yeon Namseng under his own rules; Jungto raises Yeon Namgun and Yeon Namsan where supper is allowed to be supper. After Gesomun’s death the split he called logistics becomes the crack the messengers poison — and in 666 the softer brother takes his southern territory to Silla.',
		events: [
			{ label: 'Splits the three heirs between his roof and Jungto’s.' },
			{ year: 666, label: 'Jungto surrenders his southern territory to Silla.' }
		],
		aliases: ['Gesomun & Jungto', 'Jungto & Gesomun', 'Yeon Gesomun & Yeon Jungto']
	},
	{
		id: 'rel-gesomun-sooyoung',
		name: 'Gesomun & Sooyoung',
		korean: '개소문 · 수영',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['gesomun', 'sooyoung'],
		title: 'The Supreme Commander’s sister',
		tagline: 'He fed the heir rules; she fed the younger two supper.',
		arc: 'Brother and sister of the Yeon house. Gesomun trusts Sooyoung and Jungto with Yeon Namgun and Yeon Namsan while he forges Namseng into a second self. She corrects the cruelty his drills leave behind — the one Yeon hall where a boy is not a blade first.',
		events: [
			{ label: 'Entrusts Yeon Namgun and Yeon Namsan to Sooyoung and Jungto.' }
		],
		aliases: ['Gesomun & Sooyoung', 'Sooyoung & Gesomun', 'Yeon Gesomun & Yeon Sooyoung']
	},
	{
		id: 'rel-jumong-yuri',
		name: 'Jumong & Yuri',
		korean: '주몽 · 유리',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['jumong', 'yuri'],
		title: 'First wife’s son',
		tagline: 'The heir from Buyeo who costs Sosuno a kingdom.',
		arc: 'Yuri arrives from Lady Ye’s line; Jumong names him heir. Sosuno walks south with Onjo and Biryu — Baekje’s dowry paid for Goguryeo’s succession.',
		events: [{ year: -19, label: 'Yuri recognised; Sosuno leaves.' }],
		aliases: ['Jumong & Yuri', 'Yuri & Jumong']
	},
	{
		id: 'rel-haemosu-habek',
		name: 'Haemosu & Habek',
		korean: '해모수 · 하백',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'rival',
		between: ['haemosu', 'habek'],
		title: 'Sun and river court',
		tagline: 'One stops the chariot; one casts out a daughter.',
		arc: 'Desire crosses a border Habek keeps as sovereignty. Exile is his answer; Jumong’s later claim runs through both courts whether either god wills it.',
		events: [{ label: 'Yuhwa cast out; the egg still hatches.' }],
		aliases: ['Haemosu & Habek', 'Habek & Haemosu']
	},
	{
		id: 'rel-haemosu-haewonmek',
		name: 'Haemosu & Haewonmek',
		korean: '해모수 · 해원맥',
		entity: 'relationship',
		kingdom: 'other',
		bond: 'kin',
		between: ['haemosu', 'haewonmek'],
		title: 'Same 해, split roads',
		tagline: 'One 해 drives the sun’s chariot; the younger took the night-road.',
		arc: 'The names share a 해. One keeps Little Star’s day; the other fetches for Yumla under Big Star — 이승 and 저승, not one hall. At Jumong’s river the sun still outranks the fetch: one shove, a promise to let the boy finish, then the night-road again.',
		events: [{ year: -37, label: 'The river; Haemosu sends Haewonmek off.' }],
		aliases: ['Haemosu & Haewonmek', 'Haewonmek & Haemosu']
	},
	{
		id: 'rel-habek-yuhwa',
		name: 'Habek & Yuhwa',
		korean: '하백 · 유화',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'kin',
		between: ['habek', 'yuhwa'],
		title: 'River father, exiled daughter',
		tagline: 'He rules the Amnok; she pays for loving the sun.',
		arc: 'Yuhwa is Habek’s daughter. When Haemosu stops the chariot, Habek answers as a sovereign — exile, not negotiation — and the river later bridges her son’s flight anyway.',
		events: [{ label: 'Exile from the river court.' }],
		aliases: ['Habek & Yuhwa', 'Yuhwa & Habek']
	},
	{
		id: 'rel-hwanin-hwanung',
		name: 'Hwanin & Hwanung',
		korean: '환인 · 환웅',
		entity: 'relationship',
		kingdom: 'joseon',
		bond: 'kin',
		between: ['hwanin', 'hwanung'],
		title: 'Heaven sends a son',
		tagline: 'Lord of Heaven commissions; Son of Heaven descends.',
		arc: 'Hwanin does not plough — he sends. Three seals, three thousand, a sandalwood tree: the mandate becomes a farm and a marriage, and Dangun becomes the court that stays.',
		events: [{ label: 'Hwanung sent down under the sacred tree.' }],
		aliases: ['Hwanin & Hwanung', 'Hwanung & Hwanin']
	},
	{
		id: 'rel-suro-ijinasi',
		name: 'Suro & Ijinasi',
		korean: '수로 · 이진아시',
		entity: 'relationship',
		kingdom: 'gaya',
		bond: 'kin',
		between: ['suro', 'ijinasi'],
		title: 'Two eggs, two valleys',
		tagline: 'Brothers from the ridge night — Golden Gaya and Great Gaya.',
		arc: 'Twin-born of Ibiga and the Lady of the Right View. Suro takes the shore and the red sail; Ijinasi takes the larger hill. Six eggs, six thrones; these two name the confederacy’s poles.',
		events: [{ year: 42, label: 'Hatch; found Golden and Great Gaya.' }],
		aliases: ['Suro & Ijinasi', 'Ijinasi & Suro']
	},
	{
		id: 'rel-taizong-gaozong',
		name: 'Taizong & Gaozong',
		korean: '태종 · 고종',
		entity: 'relationship',
		kingdom: 'tang',
		bond: 'kin',
		between: ['taizong', 'gaozong'],
		title: 'Emperor and the son who finishes',
		tagline: 'One fails at Ansi; one finishes Baekje and Goguryeo.',
		arc: 'Taizong chooses Xue and still turns back from Ansi. Gaozong inherits the eastern war, Wu’s court, and the alliance Chunchu sealed — then overstays until Munmu expels him.',
		events: [
			{ year: 649, label: 'Taizong dies; Gaozong takes the eastern ledger.' },
			{ year: 660, label: 'Baekje falls under his reign.' }
		],
		aliases: ['Taizong & Gaozong', 'Gaozong & Taizong']
	},
	{
		id: 'rel-seonpum-jayi',
		name: 'Seonpum & Jayi',
		korean: '선품 · 자의',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'kin',
		between: ['seonpum', 'jayi'],
		title: 'Harbour father, tide daughter',
		tagline: 'Ocean Trade raises the girl who corrects a prince’s sums.',
		arc: 'Kim Seonpum’s ledgers are Jayi’s childhood. When Bupmin posts to the quay, he marries into the harbour before he marries into bone rank.',
		events: [{ year: 644, label: 'Bupmin meets Jayi under Seonpum’s roof of accounts.' }],
		aliases: ['Seonpum & Jayi', 'Jayi & Seonpum']
	},
	{
		id: 'rel-yushin-gyebek',
		name: 'Yushin & Gyebek',
		korean: '유신 · 계백',
		entity: 'relationship',
		kingdom: 'baekje',
		bond: 'rival',
		between: ['yushin', 'gyebek'],
		title: 'Hwangsanbeol',
		tagline: 'Fifty thousand against five thousand — four assaults, one afternoon.',
		arc: 'The marshal of Silla meets the named general of Baekje on the Yellow Mountain plain. Gyebek turns Yushin back four times before Gwanchang’s death shames the Silla line forward. The fifth assault ends the five thousand — and the two commanders enter the same afternoon of history from opposite sides.',
		events: [{ year: 660, label: 'Hwangsanbeol — four repulses, then the end.' }],
		aliases: ['Yushin & Gyebek', 'Gyebek & Yushin']
	},
	{
		id: 'rel-gesomun-yangmanchun',
		name: 'Yeon & Yang Manchun',
		korean: '연개소문 · 양만춘',
		entity: 'relationship',
		kingdom: 'goguryeo',
		bond: 'sworn',
		between: ['gesomun', 'yangmanchun'],
		title: 'Supreme Commander and Ansi’s wall',
		tagline: 'One remakes the court; one proves the wall still works.',
		arc: 'After 642 Yeon’s kingdom needs a legend that is not only knives. Yang Manchun holds Ansi against Taizong and joins the Hall of Heroes list Yeon has been auditioning for his whole life.',
		events: [{ year: 645, label: 'Ansi holds; Taizong turns back.' }],
		aliases: ['Yeon & Yang Manchun', 'Gesomun & Yang Manchun']
	},
	{
		id: 'rel-chunchu-ongunhae',
		name: 'Chunchu & On Gunhae',
		korean: '춘추 · 온군해',
		entity: 'relationship',
		kingdom: 'silla',
		bond: 'sworn',
		between: ['chunchu', 'ongunhae'],
		title: 'The coat and the small boat',
		tagline: 'One sat in the high cap. One went home.',
		arc: 'On Gunhae attends the Tang embassy and, on the Yellow Sea, wears Chunchu’s high cap and great coat so the Goguryeo patrol takes the wrong man. Chunchu reaches Silla in a small boat. Jinduk posthumously names Gunhae a Daeachan.',
		events: [{ year: 649, label: 'The patrol ship; the decoy; the small boat.' }],
		aliases: ['Chunchu & On Gunhae', 'On Gunhae & Chunchu']
	}
];

export function relationOf(a: string, b: string): Person | undefined {
	return RELATIONSHIPS.find(
		(r) => r.between && ((r.between[0] === a && r.between[1] === b) || (r.between[0] === b && r.between[1] === a))
	);
}
