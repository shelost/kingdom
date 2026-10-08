/** Widgets cut from the script, kept only for the widgets page (its own module, so the 1 MB list never ships elsewhere). */
import type { Block, Chapter } from '$lib/story';
import hiddenWidgets from '$lib/data/hidden-widgets.json';
import { widgetKindOf, widgetType, yearOf, type WidgetInstance } from '$lib/widgets';

type HiddenWidget = { chapterId: string; entryTitle: string; after: string | null; block: Block };

/**
 * Widgets cut from the script (`data/hidden-widgets.json`), placed by the episode they
 * came from. Block indexes are negative so their keys never meet a live widget's.
 */
export function collectHiddenWidgets(story: Chapter[]): WidgetInstance[] {
	const index = new Map<string, { i: number; year: number | null }>();
	let i = 0;
	for (const ch of story) for (const e of ch.entries) index.set(`${ch.id}|${e.title}`, { i: i++, year: yearOf(e.year) });
	return (hiddenWidgets as unknown as HiddenWidget[]).flatMap((h, n) => {
		const at = index.get(`${h.chapterId}|${h.entryTitle}`);
		const kind = widgetKindOf(h.block);
		if (!at || !kind) return [];
		const type = widgetType(kind);
		return [
			{
				kind,
				group: type?.group ?? 'other',
				label: type?.label ?? kind,
				chapterId: h.chapterId,
				entryTitle: h.entryTitle,
				entryIndex: at.i,
				blockIndex: -1 - n,
				block: h.block,
				year: at.year,
				hidden: { after: h.after }
			}
		];
	});
}
