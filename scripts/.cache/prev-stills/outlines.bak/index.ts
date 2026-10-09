import type { EpisodeKind } from '$lib/episodeKindMeta';
import type { Episode, Outline, Still } from './types';
import { husam } from './husam';
import { chunchu } from './chunchu';
import { xiangyu } from './xiangyu';
import { sijo } from './sijo';
import { shahanshah } from './shahanshah';
import { khagan } from './khagan';
import { commandLine } from './command-line';
import { judges } from './judges';
import { lordAndShepherd } from './lord-and-shepherd';
import { kings } from './kings';
import { STORY_MAPS } from './maps';
import { STORY_LORE } from './lore';

/** Keyword cues for each episode kind, read from the title, hook and beats. Order is display order. */
const KIND_CUES: [EpisodeKind, RegExp][] = [
	['coronation', /\b(crowned|coronation|enthron\w*|is elected|elected (khan|king)|made (great )?(khan|king|emperor|hegemon)|takes the throne|proclaims? (himself|herself|goryeo|the|a))\b/i],
	['love', /\b(marr(y|ies|ied|iage)|wedding|bride|lover|kiss\w*|falls? in love|seduc\w*|beloved)\b/i],
	['coup', /\b(coup|rebel\w*|revolt|usurp\w*|overthrow\w*|purge|assassin\w*|conspira\w*|mutiny)\b/i],
	['siege', /\b(siege|besieg\w*|trebuchet|walls? (fall|falls|breach\w*))\b/i],
	['naval', /\b(fleets?|naval|warships?|sea battle)\b/i],
	['battle', /\b(battle|charges?|ambush\w*|routs?|cavalry|slaughter\w*|breaks? out|armies (meet|clash))\b/i],
	['myth', /\b(legend\)|angel|miracle|oracle|prophec\w*|vision|chariot of fire)\b/i]
];

function deriveKinds(e: Episode): EpisodeKind[] {
	const text = [e.title, e.hook, ...e.beats].join(' ');
	const kinds = KIND_CUES.filter(([, re]) => re.test(text)).map(([k]) => k);
	return e.flashback ? ['flashback', ...kinds] : kinds;
}

/** Merge the per-slug maps and lore files into an outline. */
function withExtras(o: Outline): Outline {
	const lore = STORY_LORE[o.slug];
	return {
		...o,
		maps: STORY_MAPS[o.slug] ?? o.maps ?? [],
		legends: lore?.legends ?? o.legends ?? [],
		concepts: lore?.concepts ?? o.concepts ?? [],
		parts: o.parts.map((p) => ({
			...p,
			episodes: p.episodes.map((e) => ({ ...e, kinds: e.kinds ?? deriveKinds(e) }))
		})),
		cast: o.cast.map((c) => ({
			...c,
			creed: lore?.creeds[c.name] ?? c.creed,
			sobriquets: lore?.sobriquets?.[c.name] ?? c.sobriquets
		}))
	};
}

/** Display order on /stories. Shelves appear in the order their first story does. */
export const OUTLINES: Outline[] = [
	husam,
	chunchu,
	xiangyu,
	sijo,
	shahanshah,
	khagan,
	judges,
	lordAndShepherd,
	kings,
	commandLine
].map(withExtras);

/** The key-art still: the first poster, else the first safe still. */
export function heroStill(o: Outline): Still | undefined {
	return o.images.find((s) => s.kind === 'poster' && !s.nsfw) ?? o.images.find((s) => !s.nsfw);
}

export function outlineBySlug(slug: string): Outline | undefined {
	return OUTLINES.find((o) => o.slug === slug);
}

export function outlineShelves(): { shelf: string; outlines: Outline[] }[] {
	const shelves = new Map<string, Outline[]>();
	for (const o of OUTLINES) shelves.set(o.shelf, [...(shelves.get(o.shelf) ?? []), o]);
	return [...shelves].map(([shelf, outlines]) => ({ shelf, outlines }));
}

export function episodeCount(o: Outline): number {
	return o.parts.reduce((n, p) => n + p.episodes.length, 0);
}
