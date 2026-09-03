/**
 * Ring-pommel blades of the chronicle — each sword is a wiki profile (entity: 'sword')
 * linked to the character(s) who wield it. Only explicitly named blades from the
 * chronicle appear here; generic `blade:` prose on minor characters stays on person records.
 */

import type { LifeEvent, Person } from '$lib/people';

export interface SwordDef {
	id: string;
	name: string;
	korean?: string;
	hanja?: string;
	/** Person ids — most recent / primary wielder first. */
	owners: string[];
	kingdom: Person['kingdom'];
	swordImage?: string;
	/** Mirrors the wielder’s `blade` line when singular; lineage blades use shared copy. */
	tagline: string;
	arc?: string;
	events?: LifeEvent[];
	aliases?: string[];
}

export const SWORD_DEFS: SwordDef[] = [
	{
		id: 'sword-fish',
		name: 'Fish sword',
		korean: '어검',
		owners: ['yushin', 'seohyeon', 'muryuk'],
		kingdom: 'silla',
		swordImage: '/sword_fish.png',
		tagline: 'Ring-pommel fish sword — Gaya fish on the pommel, Silla blue in the fuller.',
		arc: 'Geumgwan Gaya’s ring-pommel — fish on the pommel, blue in the fuller. Kim Muryuk traded a kingdom so the line could keep it; Kim Seohyeon made the surrender a household; Kim Yushin made it the Sword of Silla. Three generations, one blade.',
		aliases: ['Fish sword', '어검', 'Sword of Silla']
	},
	{
		id: 'sword-chunchu',
		name: 'Imugi court sword',
		korean: '이무기검',
		owners: ['chunchu'],
		kingdom: 'silla',
		swordImage: '/sword_dragon.png',
		tagline: 'Ring-pommel court sword — imugi coiled on the grip; drawn rarely, remembered always.',
		arc: 'Kim Chunchu’s court sword — an imugi on the grip, not a finished dragon. The same dragon-steel illustration as Munmu’s sea-dragon sword; a different blade. Drawn rarely, remembered always.',
		aliases: ['Imugi court sword', '이무기검']
	},
	{
		id: 'sword-munmu',
		name: 'Sea-dragon sword',
		korean: '해룡검',
		hanja: '海龍劍',
		owners: ['munmu'],
		kingdom: 'silla',
		swordImage: '/sword_dragon.png',
		tagline: 'Ring-pommel sea-dragon sword — forged for a king who asked to become a dragon in the strait.',
		arc: 'Munmu’s 해룡검 — the chronicle’s dragon sword (용검). Not Yushin’s fish, not Tang’s Blue Dragon banner, not a Goguryeo crow. Forged for the king who asked to become a dragon in the East Sea strait.',
		aliases: ['Sea-dragon sword', '해룡검', '海龍劍', 'Dragon Sword', '용검', 'dragon sword']
	},
	{
		id: 'sword-gesomun',
		name: 'Eastern Crow Blade',
		korean: '동방 오도',
		hanja: '東方烏刀',
		owners: ['gesomun'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel Eastern Crow Blade — three-legged crow on the stamp; the march sword of the Eastern Commander.',
		arc: 'Yeon Gesomun’s own blade from the eastern marches — 동방 오도, the first of the four cardinal crow blades. He wears it into the banquet of 642; after the massacre it stays first on the spine, beside the High Commander Blade he takes from his uncle.',
		events: [
			{ year: 634, label: 'Worn as Eastern Commander (대가) of the eastern marches.' },
			{ year: 642, label: 'Carried into Yeon’s Banquet; remains his first sword after he takes the High Commander Blade.' }
		],
		aliases: ['Eastern Crow Blade', '동방 오도', '東方烏刀', 'Eastern Crow Sword', 'Eastern crow sword']
	},
	{
		id: 'sword-gusesa',
		name: 'High Commander Blade',
		korean: '막리지검',
		hanja: '莫離支劍',
		owners: ['gesomun', 'gusesa'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel High Commander Blade — haetae carved beneath the crow stamp; the 막리지검 of the Summit’s first chair.',
		arc: 'Yeon Gusesa’s 막리지검 — haetae beneath the three-legged crow, the High Commander’s sword, not a sixth “five blades” kit. Taken at the banquet of 642; Gesomun wears it thereafter as the office-blade of the new Supreme Commander (대막리지).',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun from High Commander Yeon Gusesa.' }],
		aliases: [
			'High Commander Blade',
			'막리지검',
			'莫離支劍',
			'Central crow sword',
			'중앙 오검'
		]
	},
	{
		id: 'sword-northcmd',
		name: 'Northern Crow Blade',
		korean: '북방 오도',
		hanja: '北方烏刀',
		owners: ['gesomun', 'northcmd'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel Northern Crow Blade — Mohe-frost nicks in the edge; 북방 오도 of the northern 대가.',
		arc: 'Go Ul’s Northern Crow Blade — Mohe-frost nicks in the edge. Taken at Yeon’s Banquet; worn on Gesomun’s back with the other cardinal crows.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun — Northern Crow Blade.' }],
		aliases: ['Northern Crow Blade', '북방 오도', '北方烏刀', 'Northern crow sabre', '북검']
	},
	{
		id: 'sword-southcmd',
		name: 'Southern Crow Blade',
		korean: '남방 오도',
		hanja: '南方烏刀',
		owners: ['gesomun', 'southcmd'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel Southern Crow Blade — grip worn smooth against Yushin’s passes; 남방 오도 of the southern 대가.',
		arc: 'Son Daeha’s Southern Crow Blade — grip worn smooth against Yushin’s passes. Taken at the banquet; the blade Yushin would have known from the marches.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun — Southern Crow Blade.' }],
		aliases: ['Southern Crow Blade', '남방 오도', '南方烏刀', 'Southern crow sword', '남검']
	},
	{
		id: 'sword-westcmd',
		name: 'Western Crow Blade',
		korean: '서방 오도',
		hanja: '西方烏刀',
		owners: ['gesomun', 'westcmd'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel Western Crow Blade — Liao timber-oil in the scabbard; 서방 오도 of the western 대가.',
		arc: 'Go Heumsong’s Western Crow Blade — Liao timber-oil in the scabbard. The western commandery’s stamp, strapped to Gesomun after 642.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun — Western Crow Blade.' }],
		aliases: ['Western Crow Blade', '서방 오도', '西方烏刀', 'Western crow sword', '서검']
	},
	{
		id: 'sword-bidam',
		name: 'Heavenly-horse sword',
		korean: '천마검',
		owners: ['bidam'],
		kingdom: 'silla',
		swordImage: '/sword_horse.png',
		tagline: 'Ring-pommel heavenly-horse sword — white horse rearing on the pommel, old-hall steel.',
		arc: 'Bidam’s heavenly-horse pommel — white horse rearing, old-hall steel. At Radiance’s tenth day it crosses the yard’s other best; the blade drops when the scoreboard becomes blood.'
	},
	{
		id: 'sword-gyebek',
		name: 'Phoenix blade',
		korean: '봉검',
		owners: ['gyebek'],
		kingdom: 'baekje',
		swordImage: '/sword_lotus.png',
		tagline: 'Single-edged phoenix blade — curved like an eastern sword, phoenix on the ring pommel; one side only, as he is.',
		arc: 'Gyebek’s phoenix blade — single-edged, curved, one side only as he is. The five thousand at Yellow Mountain carry the type into later ages.'
	},
	{
		id: 'sword-xuerengui',
		name: 'Fangtian ji',
		korean: '방천화극',
		hanja: '方天畫戟',
		owners: ['xuerengui'],
		kingdom: 'tang',
		tagline: 'No ring pommel at all — the fangtian ji, the storytellers’ heaven-halberd; the white coat is his crest.',
		arc: 'Xue Rengui’s fangtian ji — no ring pommel, only the heaven-halberd and the white coat Taizong chose at Stallion Mountain. Tang’s unsung eastern blade.'
	},
	{
		id: 'sword-kangrim',
		name: 'Death blade',
		korean: '저승검',
		owners: ['kangrim'],
		kingdom: 'underworld',
		swordImage: '/sword_crysanthemum.png',
		tagline: 'Black iron death blade — ring pommel cold as red-book ink; drawn only as far as a cord needs.',
		arc: 'Kangrim’s black iron death blade — ring pommel cold as 적패지 ink. Drawn only as far as the soul-cord needs; the Question comes after.'
	},
	{
		id: 'sword-haewonmek',
		name: 'Death blade',
		korean: '저승검',
		owners: ['haewonmek'],
		kingdom: 'underworld',
		swordImage: '/sword_crysanthemum.png',
		tagline: 'Black iron death blade — ring pommel cold as last words; drawn only as far as a cord needs.',
		arc: 'Haewonmek’s night-road death blade — ring pommel cold as last words. The 적패지, the name three times, the cut; then he asks for 유언.'
	}
];

/** Stable id for a character’s blade profile — `sword-{personId}` when one exists, else via `owners`. */
export function swordIdFor(personId: string): string {
	return `sword-${personId}`;
}

export function toSwordPerson(s: SwordDef): Person {
	const aliases = [
		s.name,
		...(s.korean ? [s.korean] : []),
		...(s.hanja ? [s.hanja] : []),
		...(s.aliases ?? [])
	].filter(Boolean);

	return {
		id: s.id,
		name: s.name,
		korean: s.korean,
		hanja: s.hanja,
		entity: 'sword',
		kingdom: s.kingdom,
		title: 'Ring-pommel blade',
		tagline: s.tagline,
		arc: s.arc,
		events: s.events,
		owners: s.owners,
		swordImage: s.swordImage,
		avatar: s.swordImage,
		aliases: [...new Set(aliases)]
	};
}

export const SWORDS: Person[] = SWORD_DEFS.map(toSwordPerson);
