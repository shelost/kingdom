/** Client + API contract for permanent /images deletes. */

export type GalleryDeleteKind = 'cue' | 'orphan';

export type GalleryDeleteItem =
	| { kind: 'cue'; slotId: string }
	| { kind: 'orphan'; id: string };

export type GalleryDeleteRequest = {
	items: GalleryDeleteItem[];
};

export type GalleryDeleteResponse = {
	ok: true;
	deleted: GalleryDeleteItem[];
	files: string[];
};
