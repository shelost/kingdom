/**
 * Writing-desk notes for the dashboard story view: A/B plot, acts, themes,
 * newly introduced people, and 떡밥 (mystery boxes planted / paid / still open).
 */
import raw from '$lib/data/episode-story.json';
import { byId, nameOf, koreanOf, type Person } from '$lib/people';

export type MysteryBox = {
	id: string;
	head: string;
	question: string;
	nameKo: string;
	about: string;
};

export type StoryTheme = {
	id: string;
	label: string;
	note?: string;
};

export type EpisodeStory = {
	n: number;
	id: string;
	title: string;
	want: string;
	conflict: string;
	development: string;
	climax: string;
	resolution: string;
	aPlot: string;
	bPlot: string;
	themes: StoryTheme[];
	concepts: string[];
	plant: string[];
	pay: string[];
	hold: string[];
	introduced: string[];
	places: string[];
	problem: string;
	events?: { label: string; scene?: string; tension?: number; climax?: boolean; last?: boolean; start?: boolean }[];
};

export type BoxSpan = {
	box: MysteryBox;
	color: string;
	plantN: number;
	plantId: string;
	plantTitle: string;
	payN: number | null;
	payId: string | null;
	payTitle: string | null;
};

const data = raw as {
	generated: string;
	boxes: MysteryBox[];
	episodes: Record<string, EpisodeStory>;
};

const SKIP_ENTITY = new Set([
	'relationship',
	'place',
	'organization',
	'group',
	'clan',
	'phrase',
	'nation',
	'concept',
	'sword',
	'instrument'
]);

const HUES = [12, 28, 42, 58, 78, 98, 132, 162, 188, 204, 222, 248, 268, 292, 318, 338];

export const MYSTERY_BOXES: MysteryBox[] = data.boxes;
export const BOX_BY_ID = new Map(MYSTERY_BOXES.map((b) => [b.id, b]));
export const EPISODE_STORY = data.episodes;
export const STORY_LIST = Object.values(EPISODE_STORY).sort((a, b) => a.n - b.n);

export function storyOf(id: string): EpisodeStory | undefined {
	return EPISODE_STORY[id];
}

export function boxesOf(ids: string[] | undefined): MysteryBox[] {
	if (!ids?.length) return [];
	return ids.map((id) => BOX_BY_ID.get(id)).filter((b): b is MysteryBox => !!b);
}

export function boxLabel(box: MysteryBox): string {
	return `${box.head} / ${box.question}`;
}

export function boxColor(id: string): string {
	const i = MYSTERY_BOXES.findIndex((b) => b.id === id);
	const hue = HUES[(i >= 0 ? i : hashHue(id)) % HUES.length];
	return `hsl(${hue} 62% 58%)`;
}

function hashHue(id: string): number {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
	return Math.abs(h);
}

export function isCastId(id: string): boolean {
	const p = byId.get(id);
	if (!p) return false;
	if (p.entity && SKIP_ENTITY.has(p.entity)) return false;
	return true;
}

export function introducedPeople(story: EpisodeStory | undefined): Person[] {
	if (!story) return [];
	return story.introduced.map((id) => byId.get(id)).filter((p): p is Person => !!p && isCastId(p.id));
}

export function personLabel(p: Person): string {
	const ko = koreanOf(p);
	const en = nameOf(p);
	return ko && ko !== en ? `${en} · ${ko}` : en;
}

export function aPlotOf(s: EpisodeStory | undefined): string {
	if (!s) return '';
	return s.aPlot || s.want || '';
}

export function bPlotOf(s: EpisodeStory | undefined): string {
	return s?.bPlot ?? '';
}

export function boxSpans(): BoxSpan[] {
	const firstPlant = new Map<string, EpisodeStory>();
	const firstPay = new Map<string, EpisodeStory>();
	for (const ep of STORY_LIST) {
		for (const id of ep.plant) if (!firstPlant.has(id)) firstPlant.set(id, ep);
		for (const id of ep.pay) if (!firstPay.has(id)) firstPay.set(id, ep);
	}
	return MYSTERY_BOXES.map((box) => {
		const plant = firstPlant.get(box.id);
		const pay = firstPay.get(box.id);
		if (!plant) {
			return {
				box,
				color: boxColor(box.id),
				plantN: 0,
				plantId: '',
				plantTitle: '',
				payN: pay?.n ?? null,
				payId: pay?.id ?? null,
				payTitle: pay?.title ?? null
			};
		}
		return {
			box,
			color: boxColor(box.id),
			plantN: plant.n,
			plantId: plant.id,
			plantTitle: plant.title,
			payN: pay?.n ?? null,
			payId: pay?.id ?? null,
			payTitle: pay?.title ?? null
		};
	}).filter((s) => s.plantId);
}
