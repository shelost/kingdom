/**
 * Shared /grade persist: snapshot a cue + POST `/api/grades`.
 * Used by the grade page and the script-page right-click popover.
 */
import { resolve } from '$app/paths';
import {
	EMPTY_GRADE_STORE,
	writeLocalGrades,
	type GradeDraft,
	type ImageGrade,
	type ImageGradeStore
} from '$lib/imageGrades';
import { peopleOfSlot } from '$lib/imagePeople';
import { enrichGrade, layoutOfPrompt, type PromptHouse } from '$lib/promptHouse';
import type { StoryCueImage } from '$lib/storyImages';

export type GradeSaveResult = {
	ok: boolean;
	grade: ImageGrade;
	store: ImageGradeStore;
	house?: PromptHouse;
	error?: string;
};

export function snapshotCueGrade(im: StoryCueImage, draft: GradeDraft, prev?: ImageGrade): ImageGrade {
	const refs = im.refs.map((r) => r.src).filter(Boolean);
	return enrichGrade({
		id: im.slot.id,
		score: draft.score,
		note: draft.note,
		axes: Object.keys(draft.axes).length ? draft.axes : (prev?.axes ?? {}),
		keep: '',
		cut: '',
		tags: [],
		tagsWorked: [],
		tagsFailed: [],
		src: im.displayArt ?? prev?.src,
		prompt: im.prompt ?? prev?.prompt,
		alt: im.slot.alt ?? prev?.alt,
		entryTitle: im.entryTitle,
		chapterTitle: im.chapterTitle,
		nsfw: im.isNsfw,
		people: peopleOfSlot(im.slot.id, im.slot.people),
		refs: refs.length ? refs : prev?.refs,
		layout: layoutOfPrompt(im.prompt) ?? prev?.layout,
		at: im.at ?? prev?.at,
		source: draft.source ?? 'human',
		gradedAt: new Date().toISOString()
	});
}

export function snapshotBareGrade(slotId: string, draft: GradeDraft, prev?: ImageGrade): ImageGrade {
	return enrichGrade({
		id: slotId,
		score: draft.score,
		note: draft.note,
		axes: Object.keys(draft.axes).length ? draft.axes : (prev?.axes ?? {}),
		keep: '',
		cut: '',
		tags: prev?.tags ?? [],
		tagsWorked: prev?.tagsWorked ?? [],
		tagsFailed: prev?.tagsFailed ?? [],
		src: prev?.src,
		prompt: prev?.prompt,
		alt: prev?.alt,
		entryTitle: prev?.entryTitle,
		chapterTitle: prev?.chapterTitle,
		nsfw: prev?.nsfw,
		people: prev?.people,
		refs: prev?.refs,
		layout: prev?.layout,
		at: prev?.at,
		source: draft.source ?? 'human',
		gradedAt: new Date().toISOString()
	});
}

export async function postGrade(grade: ImageGrade, fallback: ImageGradeStore): Promise<GradeSaveResult> {
	try {
		const res = await fetch(resolve('/api/grades'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(grade)
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(text || res.statusText);
		}
		const body = (await res.json()) as {
			grade?: ImageGrade;
			store: ImageGradeStore;
			house?: PromptHouse;
		};
		writeLocalGrades(body.store);
		return { ok: true, grade: body.grade ?? grade, store: body.store, house: body.house };
	} catch (err) {
		const store: ImageGradeStore = {
			updatedAt: grade.gradedAt,
			grades: { ...fallback.grades, [grade.id]: grade }
		};
		writeLocalGrades(store);
		return {
			ok: false,
			grade,
			store,
			error: err instanceof Error ? err.message : 'Saved in this tab only'
		};
	}
}

export async function fetchGradeStore(): Promise<{
	ok: boolean;
	store: ImageGradeStore;
	house?: PromptHouse;
}> {
	try {
		const res = await fetch(resolve('/api/grades'));
		if (!res.ok) return { ok: false, store: EMPTY_GRADE_STORE };
		const body = (await res.json()) as {
			store?: ImageGradeStore;
			house?: PromptHouse;
			grades?: ImageGradeStore['grades'];
			updatedAt?: string;
		};
		if (body.store?.grades) return { ok: true, store: body.store, house: body.house };
		if (body.grades) {
			return {
				ok: true,
				store: { updatedAt: body.updatedAt ?? '', grades: body.grades },
				house: body.house
			};
		}
		return { ok: true, store: EMPTY_GRADE_STORE, house: body.house };
	} catch {
		return { ok: false, store: EMPTY_GRADE_STORE };
	}
}
