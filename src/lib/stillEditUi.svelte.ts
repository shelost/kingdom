/**
 * Chronicle still tools in `?edit=true` (Fal rembg / kontext / outpaint).
 * Same edit-only gate as inline grading.
 */
import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import { editUi } from '$lib/editUi.svelte';
import { displayArtOf, scriptArtFramesOf, type ArtDisplayPrefer, type ScriptArtFrame } from '$lib/cueArt';
import { chapters, type ImageSlot } from '$lib/story';
import {
	type StillEditCapabilities,
	type StillEditOp,
	type StillEditResponse,
	type StillExpandAspect
} from '$lib/stillEdit';

export const stillEditUi = $state({
	available: null as boolean | null,
	reason: '',
	ops: [] as StillEditOp[],
	busy: false,
	error: '',
	prompt: '',
	aspect: '16:9' as StillExpandAspect
});

export function liveDisplayArt(
	slot: ImageSlot,
	prefer: ArtDisplayPrefer = 'reading'
): string | undefined {
	const preview = editUi.previewById[slot.id];
	if (preview) return preview;
	return displayArtOf(slot, prefer);
}

export function liveScriptFrames(slot: ImageSlot): ScriptArtFrame[] {
	const preview = editUi.previewById[slot.id];
	if (preview) return [{ src: preview, layer: 'temp' }];
	return scriptArtFramesOf(slot);
}

function applyPreview(slotId: string, tempImage: string, previewUrl: string) {
	editUi.previewById[slotId] = previewUrl;
	for (const ch of chapters) {
		for (const entry of ch.entries ?? []) {
			for (const slot of entry.images ?? []) {
				if (slot.id !== slotId) continue;
				slot.tempImage = tempImage;
				if (slot.src?.startsWith('/temp/')) slot.src = tempImage;
			}
		}
	}
}

export async function ensureStillEditCaps(): Promise<void> {
	if (!browser || stillEditUi.available !== null) return;
	try {
		const res = await fetch(resolve('/api/images/edit'));
		const body = (await res.json()) as StillEditCapabilities;
		stillEditUi.available = body.available === true;
		stillEditUi.ops = body.ops ?? [];
		stillEditUi.reason = body.reason ?? '';
	} catch {
		stillEditUi.available = false;
		stillEditUi.reason = 'Could not reach still-edit API';
	}
}

export async function runStillEdit(slotId: string, op: StillEditOp): Promise<boolean> {
	if (!browser || !slotId || stillEditUi.busy || editUi.busyId) return false;
	if (op === 'prompt-edit' && !stillEditUi.prompt.trim()) {
		stillEditUi.error = 'Write what to change';
		return false;
	}
	stillEditUi.busy = true;
	stillEditUi.error = '';
	editUi.busyId = slotId;
	try {
		const res = await fetch(resolve('/api/images/edit'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				slotId,
				op,
				prompt: stillEditUi.prompt.trim() || undefined,
				aspect: stillEditUi.aspect
			})
		});
		if (!res.ok) {
			let message = `Edit failed (${res.status})`;
			try {
				const body = (await res.json()) as { message?: string };
				if (body.message) message = body.message;
			} catch {
				/* keep status */
			}
			stillEditUi.error = message;
			return false;
		}
		const body = (await res.json()) as StillEditResponse;
		applyPreview(body.slotId, body.tempImage, body.previewUrl);
		return true;
	} catch (err) {
		stillEditUi.error = err instanceof Error ? err.message : 'Edit failed';
		return false;
	} finally {
		stillEditUi.busy = false;
		editUi.busyId = null;
	}
}
