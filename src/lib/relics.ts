/**
 * Relics and carved posts of the chronicle — wiki profiles under Objects
 * (`entity: 'relic'`), beside swords, instruments and clothing.
 */

import type { Person } from '$lib/people';

interface RelicDef {
	id: string;
	name: string;
	ko: string;
	hanja?: string;
	altNames?: string[];
	kingdom: Person['kingdom'];
	color: string;
	title: string;
	board: string;
	build: string;
	tagline: string;
	arc: string;
}

const RELIC_DEFS: RelicDef[] = [
	{
		id: 'samsin-painting',
		name: 'Samsin painting',
		ko: '삼신도',
		altNames: ['Samsin musindo', '삼신할머니 그림', 'birth-goddess painting'],
		kingdom: 'joseon',
		color: '#e8b4c8',
		title: 'Household birth-goddess painting',
		board: '/icon_samsin_painting.png',
		build: 'Framed musindo of Samsin Halmang on a gold ground — white gokkal, blue jeogori, red chima, a small white bird in both hands. Hung by rope on a timber wall in the inner room or a mudang’s altar.',
		tagline: 'The birth goddess as a hanging — what grandmothers keep when they say Samsin Halmang.',
		arc: 'Folk and musok keep Samsin as a painting and as a rice jar. This board is the painting: the midwife who opens the breath, framed for a shelf that also holds the 삼신단지. See Samsin’s profile for the jar, the birth table, and the gate rope.'
	},
	{
		id: 'bihyung-charm',
		name: 'Bihyung door charm',
		ko: '비형랑 문부',
		hanja: '鼻荊郎',
		altNames: ['Bihyeong charm', '비형 부적', 'ghost-bar charm'],
		kingdom: 'silla',
		color: '#5a4a3a',
		title: 'Gate charm against ghosts',
		board: '/icon_bihyung_charm.png',
		build: 'Aged hanji sheet: Bihyung on a dark horse holds a fox by the scruff; four columns of hanja name his room and tell the flying ghosts not to stay.',
		tagline: 'Paste his name — or his face — and the dokkaebi will not linger.',
		arc: 'Samguk Yusa: after Bihyung kills the fox Gildal, ghosts flee the name. People write that he lives here, or paste this portrait, on the gate. Cheoyong’s plague face is the older twin office; this one is for ghosts.'
	},
	{
		id: 'samsin-table',
		name: 'Samsin table',
		ko: '삼신상',
		altNames: ['birth offering table', '삼신상 제상', 'miyeok soup table'],
		kingdom: 'joseon',
		color: '#e8b4c8',
		title: 'Birth-goddess offering table',
		board: '/icon_samsin_table.png',
		build: 'Low lacquered table set beside the mother after a birth: white rice bowls, miyeok soup, water, and a small oil lamp — the 삼신상. Only the mother eats what was offered.',
		tagline: 'Rice and seaweed soup for the midwife goddess — next to every mother who has just given birth.',
		arc: 'Wherever a child arrives in the chronicle, the Samsin table sits at the mother’s side under the hanging painting. Three weeks, hundred days, and the first birthday repeat the same small feast.'
	},
	{
		id: 'jangsung-male',
		name: 'Heaven’s General',
		ko: '천하대장군',
		hanja: '天下大將軍',
		altNames: ['Jangseung', 'Jangsung', '장승', 'male jangseung'],
		kingdom: 'joseon',
		color: '#8A6A44',
		title: 'Male village guardian post',
		board: '/ch_jangsung_male.png',
		build: 'Tall carved wood post with a grim painted face under a black hat, a rope at the neck with red and blue cloth, and the four characters 天下大將軍 down the chest.',
		tagline: 'Heaven’s Great General — the male post at the village gate.',
		arc: 'A jangseung stands where a village meets the road. The male post is Heaven’s Great General: a carved face, a black hat, and four characters cut down the front so every stranger knows who watches the gate. Rope and coloured cloth hang at the neck. He is wood, not a god with a wiki voice, but the chronicle keeps him with the other objects people walk past and remember.'
	},
	{
		id: 'jangsung-female',
		name: 'Underground Girl',
		ko: '지하대장군',
		hanja: '地下女將軍',
		altNames: ['Jangseung', 'Jangsung', '장승', 'female jangseung', 'Underground General'],
		kingdom: 'joseon',
		color: '#8A6A44',
		title: 'Female village guardian post',
		board: '/ch_jangsung_female.png',
		build: 'Tall carved wood post with a grim painted face under a black hat, a rope at the neck with coloured cloth, and the characters naming the underground general down the chest.',
		tagline: 'The Underground Girl — the female post that keeps the gate with her brother.',
		arc: 'Where the male post is Heaven’s Great General, the female is the Underground Girl, or Underground General. They stand in pairs at a village mouth: one for heaven, one for the ground under the road. Same carved wood, same black hat, a different name on the chest. Travellers bow or spit and walk on. The posts stay.'
	}
];

export function relicProfileId(id: string): string {
	return `relic-${id}`;
}

function toRelicPerson(def: RelicDef): Person {
	return {
		id: relicProfileId(def.id),
		name: def.name,
		korean: def.ko,
		hanja: def.hanja,
		entity: 'relic',
		kingdom: def.kingdom,
		color: def.color,
		title: def.title,
		tagline: def.tagline,
		arc: def.arc,
		avatar: def.board,
		objectImage: def.board,
		object: def.build,
		aliases: [...new Set([def.name, def.ko, ...(def.hanja ? [def.hanja] : []), ...(def.altNames ?? [])])]
	};
}

export const RELICS: Person[] = RELIC_DEFS.map(toRelicPerson);
