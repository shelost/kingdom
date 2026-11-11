/**
 * Western Flower Field blooms — each one is a wiki profile (`entity: 'flower'`).
 *
 * Source of truth for the rows: 「이공본풀이」 / Igong bon-puri (Hallakgungi’s gift from
 * Sara), plus the organ bloom of the Igong Maji rite and Samsin’s Life Flower.
 * English names keep the field’s mean rhyme: Bone-Hone, Blood-Flood, Ruin-Human…
 */

import type { Person } from '$lib/people';

/** Shelf under Flowers — resurrection chain, curse blooms, and the one-life bloom. */
export type FlowerKind = 'revive' | 'curse' | 'life';

export interface FlowerDef {
	id: string;
	/** Stable wiki id (`flower-bone`, …). */
	profileId: string;
	name: string;
	korean: string;
	/** Board in `/static` when one exists. */
	avatar?: string;
	color: string;
	kind: FlowerKind;
	title: string;
	tagline: string;
	nature: string;
	aliases?: string[];
	/** Order inside the resurrection chain (1–6), when kind is revive. */
	order?: number;
}

/**
 * Every named bloom that grows in 서천꽃밭.
 * Revive six: bone → flesh → blood → organ → breath → soul.
 * Curse: laugh, cry, fight, flame, rich, kind, ruin.
 * Life: Samsin’s one-bloom-one-person flower.
 */
export const FLOWER_DEFS: FlowerDef[] = [
	{
		id: 'bone',
		profileId: 'flower-bone',
		name: 'Bone-Hone',
		korean: '뼈살이꽃',
		avatar: '/flower_bone.png',
		color: '#f4efe2',
		kind: 'revive',
		order: 1,
		title: 'First of the six that raise the dead',
		tagline: 'Laid on the bones. The stem is a bone.',
		nature:
			'뼈살이꽃, also 뼈오를꽃. White petals, an orange heart, a stem like a bone. First flower on a body that is coming back. Without it the rest have nothing to hang on. Sara hands it to Hallakgungi with the other four resurrection blooms; Jachungbi and Bari use the same order.',
		aliases: ['Bone-Hone', '뼈살이꽃', '뼈오를꽃', '뼈 오를 꽃', '골생화']
	},
	{
		id: 'flesh',
		profileId: 'flower-flesh',
		name: 'Flesh-Refresh',
		korean: '살살이꽃',
		avatar: '/flower_flesh.png',
		color: '#f2a99c',
		kind: 'revive',
		order: 2,
		title: 'Second of the six',
		tagline: 'The flesh climbs back onto the bone.',
		nature:
			'살살이꽃, also 살오를꽃 / 살오를 꽃. Comes after Bone-Hone and before the blood. The body remembers its shape. The stake between the white bloom and the red one is this flower, and it is often late.',
		aliases: ['Flesh-Refresh', '살살이꽃', '살오를꽃', '살오를 꽃', '살 오를 꽃', '육생화']
	},
	{
		id: 'blood',
		profileId: 'flower-blood',
		name: 'Blood-Flood',
		korean: '피살이꽃',
		avatar: '/flower_blood.png',
		color: '#c8172f',
		kind: 'revive',
		order: 3,
		title: 'Third of the six',
		tagline: 'The veins fill. Red returns before the face does.',
		nature:
			'피살이꽃, also 피오를꽃 / 피돌게 할 꽃. A deep red bloom that drips. Laid after the flesh, so the blood has somewhere to run.',
		aliases: ['Blood-Flood', '피살이꽃', '피오를꽃', '피돌게 할 꽃', '피 오를 꽃', '혈생화']
	},
	{
		id: 'organ',
		profileId: 'flower-organ',
		name: 'Internal-Vernal',
		korean: '오장육부살이꽃',
		avatar: '/flower_organ.png',
		color: '#ff8a1e',
		kind: 'revive',
		order: 4,
		title: 'Fourth of the six',
		tagline: 'The long name. The organs take their seats.',
		nature:
			'오장육부살이꽃, also 오장육부 기를 꽃. Orange, and it looks like what it restores. The middle of the revival, and the one people shorten because the name will not fit in a mouth. Some Igong Maji tellings put this bloom in the chain between blood and breath.',
		aliases: ['Internal-Vernal', '오장육부살이꽃', '오장육부 기를 꽃']
	},
	{
		id: 'breath',
		profileId: 'flower-breath',
		name: 'Breath-Undeath',
		korean: '숨살이꽃',
		avatar: '/flower_air.png',
		color: '#5ec8f0',
		kind: 'revive',
		order: 5,
		title: 'Fifth of the six',
		tagline: 'One pull of air. Then she is not a picture.',
		nature:
			'숨살이꽃, also 숨오를꽃 / 숨돌게 할 꽃 / 숨 트일 꽃. Pale blue, and it looks like air. Comes after the organs and before the soul. The bamboo moves. In Bari tellings the medicinal water sometimes does this work instead.',
		aliases: ['Breath-Undeath', '숨살이꽃', '숨오를꽃', '숨돌게 할 꽃', '숨 트일 꽃']
	},
	{
		id: 'soul',
		profileId: 'flower-soul',
		name: 'Soul-Whole',
		korean: '혼살이꽃',
		avatar: '/flower_soul.png',
		color: '#d5e2ee',
		kind: 'revive',
		order: 6,
		title: 'Last of the six',
		tagline: 'Last, or the body wakes with nobody in it.',
		nature:
			'혼살이꽃, also 도환생꽃. Grey-blue, like smoke. The last flower of a revival. Rush it and you get a body with the lights out. Some mainland tellings call this bloom alone the 환생꽃 and assume the flesh is already whole.',
		aliases: ['Soul-Whole', '혼살이꽃', '도환생꽃', '혼오를꽃']
	},
	{
		id: 'laugh',
		profileId: 'flower-laugh',
		name: 'Laughing-Baffling',
		korean: '웃음웃을꽃',
		avatar: '/flower_laughing.png',
		color: '#f6c43c',
		kind: 'curse',
		title: 'A flower for the living',
		tagline: 'They laugh until they cannot stand.',
		nature:
			'웃음웃을꽃, also 웃음꽃 / 웃웃을꽃. Gold, and the petal tips burn. Made to give joy to those in despair; shown hard, a house that smells it cannot stop laughing. Blood comes with some of the laughs. Hallakgungi’s first card against the magistrate.',
		aliases: ['Laughing-Baffling', '웃음웃을꽃', '웃음꽃', '웃웃을꽃', '웃음 웃을 꽃']
	},
	{
		id: 'cry',
		profileId: 'flower-cry',
		name: 'Crying-Dying',
		korean: '울음울꽃',
		avatar: '/flower_crying.png',
		color: '#1498b0',
		kind: 'curse',
		title: 'A flower for the living',
		tagline: 'They weep until the hall is slick.',
		nature:
			'울음울꽃, also 울음꽃 / 울음울을꽃. A teal iris. It keeps a ditch to itself. Designed to grant tears to those who had none. A house that smells it cries for the dead it made.',
		aliases: ['Crying-Dying', '울음울꽃', '울음꽃', '울음울을꽃', '울음 울을 꽃']
	},
	{
		id: 'fight',
		profileId: 'flower-fight',
		name: 'Fighting-Inciting',
		korean: '싸움싸울꽃',
		avatar: '/flower_fighting.png',
		color: '#c45a1a',
		kind: 'curse',
		title: 'A flower for the living',
		tagline: 'The house turns on itself.',
		nature:
			'싸움싸울꽃, also 싸움꽃 / 싸움하게할꽃. Rust-red, and it smokes. Sisters go for each other. It will pick a fight with the stakes if nobody else is in the row. The magistrate’s house dies under this one before the last bloom comes out.',
		aliases: ['Fighting-Inciting', '싸움싸울꽃', '싸움꽃', '싸움 싸울 꽃', '싸움하게할꽃']
	},
	{
		id: 'flame',
		profileId: 'flower-flame',
		name: 'Burning-Yearning',
		korean: '불붙을꽃',
		avatar: '/flower_burning.png',
		color: '#e85a1a',
		kind: 'curse',
		title: 'A flower that lights the house',
		tagline: 'The roof catches. The quarrel already had a spark.',
		nature:
			'불붙을꽃. Sara hands it to Hallakgungi with the laugh, the weep, and the fight. A house that smells it finds fire under the eaves. Disaster in the Igong rite — the bloom that starts a blaze so the others have somewhere to finish.',
		aliases: [
			'Burning-Yearning',
			'Flame-Claim',
			'불붙을꽃',
			'불 붙을 꽃',
			'Bulbuteulkkot'
		]
	},
	{
		id: 'rich',
		profileId: 'flower-rich',
		name: 'Wealthy-Healthy',
		korean: '부자될꽃',
		avatar: '/flower_wealthy.png',
		color: '#d4a017',
		kind: 'curse',
		title: 'A flower that fattens a house',
		tagline: 'Gold comes. So does the envy that follows it.',
		nature:
			'부자될꽃. Sara’s gift of affluence. A house that smells it grows fat — barns full, coffers loud — and the next flower in the row is usually the one that ends a line. Prosperity and ruin grow in the same western ditch.',
		aliases: [
			'Wealthy-Healthy',
			'Rich-Enrich',
			'부자될꽃',
			'부자 될 꽃',
			'Bujadoelkkot',
			'번성꽃'
		]
	},
	{
		id: 'kind',
		profileId: 'flower-kind',
		name: 'Kind-Mind',
		korean: '선심꽃',
		avatar: '/flower_good.png',
		color: '#ff7a1a',
		kind: 'curse',
		title: 'It grew itself, opposite the worst one',
		tagline: 'An orange heart on a black stem. It bites less.',
		nature:
			'선심꽃. Nobody planted the first one. It came up facing Ruin-Human, and it has stayed there. The gentler of the two, which is not the same as safe. Sara still names it among the blooms he hands his son.',
		aliases: ['Kind-Mind', '선심꽃']
	},
	{
		id: 'ghoul',
		profileId: 'flower-ghoul',
		name: 'Ruin-Human',
		korean: '수레멸망악심꽃',
		avatar: '/flower_evil.png',
		color: '#e23a78',
		kind: 'curse',
		title: 'The end of a row, and of a line',
		tagline: 'A family turns on its own meat.',
		nature:
			'수레멸망악심꽃, also 멸망악심꽃 / 수레멜망악심꽃 / 멸망꽃. A magenta heart in pink smoke. Not by the gate. Last of the three Hallakgungi carries into the magistrate’s house — after laugh, weep, and fight — and the line ends. Jachungbi later borrows it against heaven’s rebel host. In the Igong Maji rite a bundle of tied reeds stands in for this bloom on the altar.',
		aliases: [
			'Ruin-Human',
			'Cruel-Ghoul',
			'수레멸망악심꽃',
			'멸망악심꽃',
			'수레멜망악심꽃',
			'멸망꽃',
			'Suremyeolmangakshimkkot'
		]
	},
	{
		id: 'life',
		profileId: 'flower-life',
		name: 'Life Flower',
		korean: '생명꽃',
		avatar: '/flower_birth.png',
		color: '#ffd2e2',
		kind: 'life',
		title: 'One bloom, one person',
		tagline: 'Samsin sets it on the mother. It dies when they do.',
		nature:
			'The field calls the kind 생불꽃 / 오색꽃. Samsin calls the bloom she sets on a mother 생명꽃. White petals for a boy, red for a girl, leaves in that person’s own color. One flower is one life. When the life ends, Kangrim carries the spent bloom, and the leaves have usually gone black. It is not one of the six that raise the dead, and it is not the flowers that laugh or weep or fight. Some Samsin tellings say the midwife walks the western rows to pick it.',
		aliases: ['Life Flower', '생명꽃', '생불꽃', '오색꽃']
	}
];

export function flowerKindOf(p: Person): FlowerKind {
	if (p.flowerKind === 'revive' || p.flowerKind === 'curse' || p.flowerKind === 'life') {
		return p.flowerKind;
	}
	const hit = FLOWER_DEFS.find((f) => f.profileId === p.id);
	return hit?.kind ?? 'curse';
}

export function toFlowerPerson(def: FlowerDef): Person {
	return {
		id: def.profileId,
		name: def.name,
		korean: def.korean,
		entity: 'flower',
		flowerKind: def.kind,
		kingdom: 'tamla',
		color: def.color,
		title: def.title,
		tagline: def.tagline,
		nature: def.nature,
		avatar: def.avatar,
		objectImage: def.avatar,
		aliases: def.aliases ?? [def.name, def.korean]
	};
}

export const FLOWERS: Person[] = FLOWER_DEFS.map(toFlowerPerson);

/** Boards + names for wiki scene attachment (same shape as ANIMAL_INDEX). */
export const FLOWER_INDEX: { profileId: string; boards: string[]; names: string[] }[] =
	FLOWER_DEFS.map((def) => ({
		profileId: def.profileId,
		boards: def.avatar ? [def.avatar] : [],
		names: [def.name, def.korean, def.id, ...(def.aliases ?? [])]
	}));
