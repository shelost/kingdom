/**
 * Human grades on chronicle stills. Written by /grade → /api/grades
 * into `src/lib/data/image-grades.json` so later sessions can read them.
 *
 * A score without a note is a signal. A note that names the failure
 * (shed vs court, flat light, wrong body, portrait-copy pose) is the
 * training data. Optional tags say *which axis* the score is about.
 */

export const GRADE_TAGS = [
	{ id: 'composition', label: 'Composition' },
	{ id: 'likeness', label: 'Likeness' },
	{ id: 'lighting', label: 'Lighting' },
	{ id: 'setting', label: 'Setting' },
	{ id: 'pose', label: 'Pose' },
	{ id: 'clothes', label: 'Clothes' },
	{ id: 'nsfw', label: 'Heat' },
	{ id: 'color', label: 'Color' }
] as const;

export type GradeTagId = (typeof GRADE_TAGS)[number]['id'];

export type GradeLayout = 'intimate' | 'iconic';

export const GRADE_AXES = [
	{ id: 'style', label: 'Style' },
	{ id: 'realism', label: 'Realism', hint: 'Place a camera could stand' },
	{ id: 'layout', label: 'Layout', hint: 'One device' },
	{ id: 'iconography', label: 'Iconography' },
	{ id: 'iconic', label: 'Iconic', hint: 'Monumental emptiness' },
	{ id: 'minimalism', label: 'Minimalism' },
	{ id: 'pose', label: 'Pose', hint: 'Dynamic, not a clone' },
	{ id: 'face', label: 'Face', hint: 'Expression' },
	{ id: 'angle', label: 'Angle', hint: 'Named cinematography' },
	{ id: 'colors', label: 'Color', hint: 'Person as hex' },
	{ id: 'lighting', label: 'Lighting' }
] as const;

export type GradeAxisId = (typeof GRADE_AXES)[number]['id'];

export type GradeAxes = Partial<Record<GradeAxisId, number>>;

export type GradeDraft = {
	score: number;
	note: string;
	axes: GradeAxes;
	source?: 'human' | 'self';
};

export type ImageGrade = {
	id: string;
	score: number;
	note: string;
	/** 1–10 per axis. Filled by the form; keep/cut/tags are derived. */
	axes?: GradeAxes;
	/** What to copy on the next still. */
	keep: string;
	/** What to ban on the next still. */
	cut: string;
	tags: GradeTagId[];
	tagsWorked: GradeTagId[];
	tagsFailed: GradeTagId[];
	src?: string;
	prompt?: string;
	alt?: string;
	entryTitle?: string;
	chapterTitle?: string;
	nsfw?: boolean;
	people?: string[];
	refs?: string[];
	layout?: GradeLayout;
	at?: string;
	/** Human save from /grade vs heuristic self-grade. */
	source?: 'human' | 'self';
	gradedAt: string;
};

export function blankAxisScores(from?: GradeAxes): Record<GradeAxisId, number | null> {
	const out = {} as Record<GradeAxisId, number | null>;
	for (const axis of GRADE_AXES) {
		out[axis.id] = from?.[axis.id] ?? null;
	}
	return out;
}

export function averageAxes(axes: GradeAxes): number | null {
	const vals = GRADE_AXES.map((a) => axes[a.id]).filter((n): n is number => typeof n === 'number');
	if (!vals.length) return null;
	return Math.round((vals.reduce((s, n) => s + n, 0) / vals.length) * 10) / 10;
}

export type ImageGradeStore = {
	updatedAt: string;
	grades: Record<string, ImageGrade>;
};

export const EMPTY_GRADE_STORE: ImageGradeStore = {
	updatedAt: '',
	grades: {}
};

export function isGradeTagId(value: string): value is GradeTagId {
	return GRADE_TAGS.some((t) => t.id === value);
}

export function clampScore(n: number): number | null {
	if (!Number.isFinite(n)) return null;
	const i = Math.round(n);
	if (i < 1 || i > 10) return null;
	return i;
}

export function isGradeAxisId(value: string): value is GradeAxisId {
	return GRADE_AXES.some((a) => a.id === value);
}

export function cleanAxes(raw: unknown): GradeAxes {
	if (!raw || typeof raw !== 'object') return {};
	const src = raw as Record<string, unknown>;
	const out: GradeAxes = {};
	for (const axis of GRADE_AXES) {
		const score = clampScore(typeof src[axis.id] === 'number' ? src[axis.id] : Number(src[axis.id]));
		if (score !== null) out[axis.id] = score;
	}
	return out;
}

const LOCAL_KEY = 'kingdom:image-grades';

export function readLocalGrades(): ImageGradeStore | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '') as ImageGradeStore;
		if (!raw?.grades || typeof raw.grades !== 'object') return null;
		return raw;
	} catch {
		return null;
	}
}

export function writeLocalGrades(store: ImageGradeStore) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(LOCAL_KEY, JSON.stringify(store));
	} catch {
		/* private mode */
	}
}

/** High / low notes I should read before the next GenerateImage batch. */
export function summarizeGrades(store: ImageGradeStore) {
	const list = Object.values(store.grades);
	const withNotes = list.filter((g) => g.note);
	const highs = list.filter((g) => g.score >= 8).sort((a, b) => b.score - a.score);
	const lows = list.filter((g) => g.score <= 5).sort((a, b) => a.score - b.score);
	const avg = list.length
		? Math.round((list.reduce((s, g) => s + g.score, 0) / list.length) * 10) / 10
		: 0;
	return { count: list.length, avg, highs, lows, withNotes };
}

export function cleanGrade(raw: unknown): ImageGrade | null {
	if (!raw || typeof raw !== 'object') return null;
	const v = raw as Partial<ImageGrade>;
	if (typeof v.id !== 'string' || !v.id.trim()) return null;
	const score = clampScore(typeof v.score === 'number' ? v.score : Number(v.score));
	if (score === null) return null;
	const tagList = (raw: unknown): GradeTagId[] =>
		Array.isArray(raw)
			? raw.filter((t): t is GradeTagId => typeof t === 'string' && isGradeTagId(t))
			: [];
	const legacyTags = tagList(v.tags);
	const tagsWorked = tagList(v.tagsWorked);
	const tagsFailed = tagList(v.tagsFailed);
	const worked = tagsWorked.length ? tagsWorked : score >= 8 ? legacyTags : [];
	const failed = tagsFailed.length ? tagsFailed : score <= 5 ? legacyTags : [];
	const tags = [...new Set([...legacyTags, ...worked, ...failed])];
	const str = (x: unknown) => (typeof x === 'string' && x.trim() ? x.trim() : undefined);
	const people = Array.isArray(v.people)
		? v.people.filter((p): p is string => typeof p === 'string' && !!p.trim())
		: undefined;
	const refs = Array.isArray(v.refs)
		? v.refs.filter((p): p is string => typeof p === 'string' && !!p.trim())
		: undefined;
	const layout = v.layout === 'intimate' || v.layout === 'iconic' ? v.layout : undefined;
	const axes = cleanAxes(v.axes ?? v);
	return {
		id: v.id.trim(),
		score,
		note: typeof v.note === 'string' ? v.note.trim() : '',
		axes: Object.keys(axes).length ? axes : undefined,
		keep: typeof v.keep === 'string' ? v.keep.trim() : '',
		cut: typeof v.cut === 'string' ? v.cut.trim() : '',
		tags,
		tagsWorked: worked,
		tagsFailed: failed,
		src: str(v.src),
		prompt: str(v.prompt),
		alt: str(v.alt),
		entryTitle: str(v.entryTitle),
		chapterTitle: str(v.chapterTitle),
		nsfw: typeof v.nsfw === 'boolean' ? v.nsfw : undefined,
		people: people?.length ? people : undefined,
		refs: refs?.length ? refs : undefined,
		layout,
		at: str(v.at),
		source: v.source === 'self' || v.source === 'human' ? v.source : undefined,
		gradedAt: typeof v.gradedAt === 'string' && v.gradedAt ? v.gradedAt : new Date().toISOString()
	};
}
