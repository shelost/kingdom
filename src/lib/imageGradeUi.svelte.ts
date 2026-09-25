/**
 * Inline still grading on the chronicle when `?edit=true`.
 * Same JSON + `/api/grades` path as `/grade`.
 */
import { browser } from '$app/environment';
import { editUi } from '$lib/editUi.svelte';
import {
	EMPTY_GRADE_STORE,
	readLocalGrades,
	type GradeDraft,
	type ImageGrade,
	type ImageGradeStore
} from '$lib/imageGrades';
import {
	fetchGradeStore,
	postGrade,
	snapshotBareGrade,
	snapshotCueGrade
} from '$lib/gradeSave';
import { findStoryCueBySlotId } from '$lib/storyImages';
import { ensureStillEditCaps } from '$lib/stillEditUi.svelte';

export const imageGradeUi = $state({
	open: false,
	x: 0,
	y: 0,
	slotId: null as string | null,
	saving: false,
	error: '',
	loaded: false,
	ignoreUntil: 0,
	draftScore: null as number | null,
	draftNote: '',
	store: EMPTY_GRADE_STORE as ImageGradeStore
});

export function existingGrade(slotId: string | null): ImageGrade | undefined {
	if (!slotId) return undefined;
	return imageGradeUi.store.grades[slotId];
}

export function closeImageGrade() {
	imageGradeUi.open = false;
	imageGradeUi.slotId = null;
	imageGradeUi.error = '';
	imageGradeUi.draftScore = null;
	imageGradeUi.draftNote = '';
}

function seedDraft(slotId: string) {
	const g = imageGradeUi.store.grades[slotId];
	imageGradeUi.draftScore = g?.score ?? null;
	imageGradeUi.draftNote = g?.note || [g?.keep, g?.cut].filter(Boolean).join(' — ') || '';
}

export async function ensureGradeStore(): Promise<void> {
	if (!browser || imageGradeUi.loaded) return;
	const local = readLocalGrades();
	if (local) imageGradeUi.store = local;
	const remote = await fetchGradeStore();
	imageGradeUi.store = remote.ok ? remote.store : (local ?? EMPTY_GRADE_STORE);
	imageGradeUi.loaded = true;
	if (imageGradeUi.open && imageGradeUi.slotId) {
		const g = imageGradeUi.store.grades[imageGradeUi.slotId];
		if (g && imageGradeUi.draftScore === null && !imageGradeUi.draftNote) seedDraft(imageGradeUi.slotId);
	}
}

/** Right-click on a visible still in edit mode — grades that slot id. */
export function onEditGradeContextMenu(e: MouseEvent, slotId: string | undefined) {
	if (!editUi.enabled || !slotId) return;
	e.preventDefault();
	e.stopPropagation();
	imageGradeUi.slotId = slotId;
	imageGradeUi.x = e.clientX + 6;
	imageGradeUi.y = e.clientY + 6;
	imageGradeUi.open = true;
	imageGradeUi.error = '';
	imageGradeUi.ignoreUntil = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + 280;
	seedDraft(slotId);
	void ensureGradeStore();
	void ensureStillEditCaps();
}

export async function saveInlineGrade(draft: GradeDraft): Promise<boolean> {
	const slotId = imageGradeUi.slotId;
	if (!browser || !slotId || imageGradeUi.saving) return false;
	imageGradeUi.saving = true;
	imageGradeUi.error = '';
	const prev = existingGrade(slotId);
	const cue = findStoryCueBySlotId(slotId);
	const grade = cue
		? snapshotCueGrade(cue, draft, prev)
		: snapshotBareGrade(slotId, draft, prev);
	try {
		const result = await postGrade(grade, imageGradeUi.store);
		imageGradeUi.store = result.store;
		if (!result.ok) imageGradeUi.error = result.error ?? '';
		if (result.ok) closeImageGrade();
		return result.ok;
	} finally {
		imageGradeUi.saving = false;
	}
}
