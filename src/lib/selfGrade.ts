/**
 * Heuristic self-grade from prompt / alt / refs — same axes as /grade.
 * Does not look at pixels; it scores whether the *call* encoded house doctrine.
 * Human scores on /grade remain the override.
 */
import {
	GRADE_AXES,
	averageAxes,
	type GradeAxes,
	type GradeAxisId,
	type ImageGrade
} from '$lib/imageGrades';
import { displayArtOf } from '$lib/cueArt';
import { MOVIE_SEQUENCES, type MovieSequence } from '$lib/movieSequences';
import type { ImageSlot } from '$lib/story';

const ANGLE_RE =
	/dutch|worm'?s-?eye|bird'?s-?eye|aerial|over-shoulder|\bots\b|ecu|extreme close|low angle|high angle|rack-?focus|bokeh|mise-?en-?sc[eè]ne|chiaroscuro|contre-jour|tracking/i;

const POSE_RE =
	/mid-stride|full-draw|kneel|tumble|lean|gallop|charging|weigh|arriving|not a standing|not the portrait/i;

const LIGHT_RE = /chiaroscuro|crushed black|tenebrism|hard key|long shadow|low-key|one hard/i;
const LIGHT_BAN = /even daylight|tourist postcard|well-lit studio|even wash/i;

const ICON_RE = /one device|ONE device|geometric device|lower-third|dark wedge|stamp|vertical/i;
const MIN_RE = /no army|monumental emptiness|few hues|no palace clutter|no furniture dump/i;
const STYLE_RE = /painterly|anime-adjacent|not photoreal|not 3d/i;
const STYLE_BAN = /photoreal|3d render/i;
const PLACE_RE = /giwa|timber|packed earth|seongmun|real korean|attached (place|cavern|fortress)|pl_/i;
const HEX_RE = /#[0-9a-fA-F]{3,8}|color symbolism|two color planes|person is/i;
const FACE_RE =
	/grimace|tsundere|wanting|shouting|flush|bitten|fierce|wrecked|not smiling|ears red/i;
const ICONIC_RE = /minimal iconic|poster-scale|lower third|tiny (figure|jumong|body)/i;

export type SelfStillInput = {
	id: string;
	prompt?: string;
	alt?: string;
	refs?: string[];
	people?: string[];
	at?: string;
};

export type SelfStillGrade = {
	id: string;
	score: number;
	axes: GradeAxes;
	note: string;
	source: 'self';
};

function blob(im: SelfStillInput): string {
	return `${im.prompt ?? ''} ${im.alt ?? ''} ${(im.refs ?? []).join(' ')}`;
}

function scoreHit(text: string, good: RegExp, bad?: RegExp, floor = 4, ceil = 9): number {
	let n = 6;
	if (good.test(text)) n += 2;
	if (bad?.test(text)) n -= 3;
	return Math.max(1, Math.min(10, n < floor && good.test(text) ? floor : Math.min(n, ceil)));
}

function axisScore(id: GradeAxisId, text: string): number {
	switch (id) {
		case 'style':
			return scoreHit(text, STYLE_RE, STYLE_BAN);
		case 'realism':
			return scoreHit(text, PLACE_RE, /white void|color-plane furniture|gold village/i);
		case 'layout':
			return scoreHit(text, ICON_RE, /standing portrait|fashion plate|lineup/i);
		case 'iconography':
			return scoreHit(text, ICON_RE);
		case 'iconic':
			return scoreHit(text, ICONIC_RE, /busy|army catalog/i);
		case 'minimalism':
			return scoreHit(text, MIN_RE, /army catalog|palace clutter|furniture dump/i);
		case 'pose':
			return scoreHit(text, POSE_RE, /standing clone|clasped hands|fashion plate/i);
		case 'face':
			return scoreHit(text, FACE_RE, /serene beauty|polite smile/i, 5, 8);
		case 'angle':
			return scoreHit(text, ANGLE_RE, /even daylight postcard/i);
		case 'colors':
			return scoreHit(text, HEX_RE, /gold-wash|muddy same-hue/i);
		case 'lighting':
			return scoreHit(text, LIGHT_RE, LIGHT_BAN);
		default:
			return 6;
	}
}

function noteFrom(axes: GradeAxes): string {
	const low = GRADE_AXES.filter((a) => (axes[a.id] ?? 10) <= 5).map((a) => a.label);
	const high = GRADE_AXES.filter((a) => (axes[a.id] ?? 0) >= 8).map((a) => a.label);
	const bits: string[] = [];
	if (high.length) bits.push(`keep ${high.join(', ')}`);
	if (low.length) bits.push(`cut ${low.join(', ')}`);
	return bits.join(' — ') || 'self-grade from prompt doctrine';
}

export function selfGradeStill(im: SelfStillInput): SelfStillGrade {
	const text = blob(im);
	const axes: GradeAxes = {};
	for (const axis of GRADE_AXES) {
		axes[axis.id] = axisScore(axis.id, text);
	}
	if (im.refs?.some((r) => r.includes('/ch_'))) {
		axes.realism = Math.min(10, (axes.realism ?? 6) + 1);
	}
	if (!im.at) {
		axes.layout = Math.max(1, (axes.layout ?? 6) - 1);
	}
	const avg = averageAxes(axes) ?? 6;
	const score = Math.max(1, Math.min(10, Math.round(avg)));
	return { id: im.id, score, axes, note: noteFrom(axes), source: 'self' };
}

export function selfGradeFromSlot(slot: ImageSlot): SelfStillGrade {
	return selfGradeStill({
		id: slot.id,
		prompt: slot.prompt,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		at: slot.at
	});
}

export type SequenceSelfGrade = {
	id: string;
	title: string;
	score: number;
	axes: {
		coverage: number;
		angleVariety: number;
		chronology: number;
		placeLock: number;
		stillAvg: number;
	};
	have: string[];
	missing: string[];
	angles: string[];
	note: string;
};

function angleToken(prompt?: string): string | null {
	if (!prompt) return null;
	const m = prompt.match(ANGLE_RE);
	return m ? m[0].toLowerCase() : null;
}

export function selfGradeSequence(
	seq: MovieSequence,
	slotsById: Map<string, ImageSlot>
): SequenceSelfGrade {
	const have: string[] = [];
	const missing: string[] = [];
	const angles: string[] = [];
	let withAt = 0;
	let withPlace = 0;
	for (const shot of seq.shots) {
		const slot = slotsById.get(shot.id);
		const art = slot ? displayArtOf(slot, 'gallery') : undefined;
		if (slot && art) have.push(shot.id);
		else missing.push(shot.id);
		const tok = angleToken(slot?.prompt) ?? shot.angle;
		if (tok) angles.push(tok);
		if (slot?.at || shot.at) withAt += 1;
		if (slot?.refs?.some((r) => r.includes('/pl_')) || /giwa|timber|fortress|hall/.test(slot?.prompt ?? '')) {
			withPlace += 1;
		}
	}
	const n = seq.shots.length || 1;
	const uniqueAngles = new Set(angles.map((a) => a.replace(/\s+/g, ' ').slice(0, 24)));
	const coverage = Math.round((have.length / n) * 10);
	const angleVariety = Math.min(10, Math.round((uniqueAngles.size / Math.min(5, n)) * 10));
	const chronology = Math.round((withAt / n) * 10);
	const placeLock = Math.round((withPlace / n) * 10);
	const stillScores = have
		.map((id) => {
			const slot = slotsById.get(id);
			return slot ? selfGradeFromSlot(slot).score : 0;
		})
		.filter((s) => s > 0);
	const stillAvg = stillScores.length
		? Math.round((stillScores.reduce((a, b) => a + b, 0) / stillScores.length) * 10) / 10
		: 0;
	const score = Math.round((coverage * 1.2 + angleVariety + chronology + placeLock + stillAvg) / 5.2);
	return {
		id: seq.id,
		title: seq.title,
		score: Math.max(1, Math.min(10, score)),
		axes: { coverage, angleVariety, chronology, placeLock, stillAvg },
		have,
		missing,
		angles: [...uniqueAngles],
		note: missing.length
			? `missing ${missing.length} planned cuts`
			: `${uniqueAngles.size} distinct angles`
	};
}

export function selfGradeAllSequences(slotsById: Map<string, ImageSlot>): SequenceSelfGrade[] {
	return MOVIE_SEQUENCES.map((s) => selfGradeSequence(s, slotsById));
}

export function toImageGradePatch(self: SelfStillGrade, base?: Partial<ImageGrade>): ImageGrade {
	return {
		id: self.id,
		score: self.score,
		note: self.note,
		axes: self.axes,
		keep: '',
		cut: '',
		tags: [],
		tagsWorked: [],
		tagsFailed: [],
		source: 'self',
		gradedAt: new Date().toISOString(),
		...base
	};
}
