/**
 * Every image slot in the chronicle by id, with the episode it lives in, for
 * readers that borrow stills across episodes (the prologue's emotion galleries).
 */
import { chapters, entryId, type ImageSlot } from './story';

export interface IndexedSlot {
	slot: ImageSlot;
	episodeId: string;
	entryTitle: string;
}

let index: Map<string, IndexedSlot> | undefined;

/** First slot with this id in reading order; built on first ask. */
export function slotById(id: string): IndexedSlot | undefined {
	if (!index) {
		index = new Map();
		for (const chapter of chapters) {
			for (const entry of chapter.entries) {
				const episodeId = entryId(chapter.id, entry.title);
				for (const slot of entry.images ?? []) {
					if (!index.has(slot.id)) index.set(slot.id, { slot, episodeId, entryTitle: entry.title });
				}
			}
		}
	}
	return index.get(id);
}
