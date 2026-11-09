/**
 * The book's own widgets (diagrams, records, terms, poems, maps, cards…) ranked
 * against the question, so Momal can embed the exact one by its `storyWidgetId`.
 */

import { byId } from '$lib/people';
import { plainText } from '$lib/speech';
import { chapters } from '$lib/story';
import { collectWidgets, storyWidgetId, widgetPeople, widgetSearchText, widgetType, type WidgetInstance } from '$lib/widgets';
import { askNorm, askScore, askTokens } from '$lib/server/askCorpus';

type Packed = { id: string; w: WidgetInstance; hay: string; people: string[]; summary: string };

const MAX = 6;
const SUMMARY = 180;
let packed: Packed[] | null = null;

function index(): Packed[] {
	if (packed) return packed;
	const hidden = new Set(
		chapters.flatMap((ch) => ch.entries).flatMap((e, i) => (e.hidden ? [i] : []))
	);
	packed = collectWidgets(chapters)
		.filter((w) => !hidden.has(w.entryIndex))
		.map((w) => {
			const text = widgetSearchText(w.block).map(plainText).filter(Boolean);
			const people = widgetPeople(w.block);
			const names = people.flatMap((id) => {
				const p = byId.get(id);
				return p ? [p.name, p.korean ?? ''] : [id];
			});
			const type = widgetType(w.kind);
			const flat = text.join(' · ').replace(/\s+/g, ' ');
			return {
				id: storyWidgetId(w),
				w,
				people,
				hay: askNorm([...text, ...names, type?.label ?? '', type?.ko ?? '', w.entryTitle].join(' ')),
				summary: flat.length > SUMMARY ? `${flat.slice(0, SUMMARY - 1)}…` : flat
			};
		});
	return packed;
}

/** Widgets that answer this question best: text matches first, then the people and episodes in play. */
export function findWidgets(query: string, people: string[], episodeTitles: string[]): Packed[] {
	const toks = askTokens(query);
	const who = new Set(people);
	const eps = new Set(episodeTitles);
	return index()
		.map((p) => {
			let s = askScore(p.hay, toks);
			if (p.people.some((id) => who.has(id))) s += 4;
			if (eps.has(p.w.entryTitle)) s += 2;
			if (p.w.kind === 'diagram' || p.w.kind.startsWith('quote:')) s += s > 0 ? 1 : 0;
			return { p, s };
		})
		.filter((x) => x.s >= 6)
		.sort((a, b) => b.s - a.s)
		.slice(0, MAX)
		.map((x) => x.p);
}

/** The widgets as briefing lines: id, type, where it sits, and what it says. */
export function widgetBriefing(list: Packed[]): string {
	return list
		.map((p) => {
			const type = widgetType(p.w.kind)?.label ?? p.w.kind;
			return `- ${p.id} · ${type} · in "${p.w.entryTitle}"${p.w.year != null ? ` (${p.w.year})` : ''} — ${p.summary}`;
		})
		.join('\n');
}
