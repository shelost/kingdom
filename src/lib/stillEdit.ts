/** Shared types for chronicle still edits (`?edit=true` → `/api/images/edit`). */

export const STILL_EDIT_OPS = ['remove-bg', 'prompt-edit', 'expand'] as const;
export type StillEditOp = (typeof STILL_EDIT_OPS)[number];

export const STILL_EXPAND_ASPECTS = ['16:9', '4:3', '1:1', '9:16'] as const;
export type StillExpandAspect = (typeof STILL_EXPAND_ASPECTS)[number];

export type StillEditCapabilities = {
	available: boolean;
	ops: StillEditOp[];
	/** Why tools are hidden (no FAL_KEY, production, …). */
	reason?: string;
};

export type StillEditRequest = {
	slotId: string;
	op: StillEditOp;
	prompt?: string;
	aspect?: StillExpandAspect;
};

export type StillEditResponse = {
	ok: true;
	slotId: string;
	op: StillEditOp;
	tempImage: string;
	previewUrl: string;
	backup?: string;
	model: string;
};

export function isStillEditOp(value: unknown): value is StillEditOp {
	return typeof value === 'string' && (STILL_EDIT_OPS as readonly string[]).includes(value);
}

export function isStillExpandAspect(value: unknown): value is StillExpandAspect {
	return typeof value === 'string' && (STILL_EXPAND_ASPECTS as readonly string[]).includes(value);
}
