/**
 * Client lookup of a book widget by its `storyWidgetId`, for Momal's `story` widget.
 * Loaded on demand so the corner shell does not pull the whole story bundle.
 */
import { chapters, entryId } from '$lib/story';
import { collectWidgets, storyWidgetId, widgetType, type WidgetInstance } from '$lib/widgets';

let byKey: Map<string, WidgetInstance> | null = null;

export type MomalStoryWidget = {
	w: WidgetInstance;
	/** `?ep=` value of the episode it sits in. */
	episode: string;
	label: { en: string; ko: string };
};

export function storyWidget(id: string): MomalStoryWidget | null {
	byKey ??= new Map(collectWidgets(chapters).map((w) => [storyWidgetId(w), w]));
	const w = byKey.get(id);
	if (!w) return null;
	const type = widgetType(w.kind);
	return {
		w,
		episode: entryId(w.chapterId, w.entryTitle),
		label: { en: type?.label ?? w.kind, ko: type?.ko ?? w.kind }
	};
}
