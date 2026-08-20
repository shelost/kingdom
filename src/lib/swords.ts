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
		id: 'sword-gesomun',
		name: 'The Five Blades',
		korean: '오검',
		hanja: '五劍',
		owners: ['gesomun'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'The Five Blades — four commandery ring-pommels and the king’s own, each crow-stamped, worn across one spine.',
		arc: 'After the massacre of 642 Yeon Gesomun straps four commandery swords and the king’s own across his back — every pommel stamped with Goguryeo’s three-legged crow. Authority is not granted; it is carried.',
		events: [{ year: 642, label: 'Taken at Yeon’s Banquet — worn across Gesomun’s spine thereafter.' }],
		aliases: ['Five Blades', 'The Five Blades', '오검', '五劍']
	},
	{
		id: 'sword-gusesa',
		name: 'Central crow sword',
		korean: '중앙 오검',
		owners: ['gusesa', 'gesomun'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel crow sword — haetae carved beneath the stamp; first of the Five to change hands.',
		arc: 'Yeon Gusesa’s crow stamp — haetae beneath the three-legged crow. First of the Five to change hands at the banquet of 642; Gesomun wears it across his spine thereafter.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun at the Pyongyang massacre.' }]
	},
	{
		id: 'sword-northcmd',
		name: 'Northern crow sabre',
		korean: '북검',
		owners: ['northcmd', 'gesomun'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel crow sabre — Mohe-frost nicks in the edge; the Northern blade of the Five.',
		arc: 'Go Ul’s Northern crow sabre — Mohe-frost nicks in the edge. One of the Five taken at Yeon’s Banquet; worn on Gesomun’s back with the rest.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun — Northern blade of the Five.' }]
	},
	{
		id: 'sword-southcmd',
		name: 'Southern crow sword',
		korean: '남검',
		owners: ['southcmd', 'gesomun'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel crow sword — grip worn smooth against Yushin’s passes; the Southern blade of the Five.',
		arc: 'Son Daeha’s Southern crow — grip worn smooth against Yushin’s passes. Taken at the banquet; the blade Yushin would have known from the marches.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun — Southern blade of the Five.' }]
	},
	{
		id: 'sword-westcmd',
		name: 'Western crow sword',
		korean: '서검',
		owners: ['westcmd', 'gesomun'],
		kingdom: 'goguryeo',
		swordImage: '/sword_crow.png',
		tagline: 'Ring-pommel crow sword — Liao timber-oil in the scabbard; the Western blade of the Five.',
		arc: 'Go Heumsong’s Western crow — Liao timber-oil in the scabbard. The western commandery’s stamp, strapped to Gesomun after 642.',
		events: [{ year: 642, label: 'Taken by Yeon Gesomun — Western blade of the Five.' }]
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
		tagline: 'Black iron death blade — ring pommel cold as ledger-ink; shown once, never drawn.',
		arc: 'Kangrim’s black iron death blade — ring pommel cold as ledger-ink. Shown once on the fetch-road, never drawn; the Question is the edge.'
	},
	{
		id: 'sword-haewonmek',
		name: 'Death blade',
		korean: '저승검',
		owners: ['haewonmek'],
		kingdom: 'underworld',
		swordImage: '/sword_crysanthemum.png',
		tagline: 'Black iron death blade — ring pommel cold as last words; shown once, never drawn.',
		arc: 'Haewonmek’s night-road death blade — ring pommel cold as last words. Kangrim asks the Question; he asks for 유언.'
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
