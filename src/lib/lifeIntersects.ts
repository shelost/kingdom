/**
 * Lives mode on /timeline: each figure is a line from birth to death on the same
 * year axis as the episode board. Shared key-events are the places the lines meet.
 */
import { byId, colorOf, PEOPLE, type Person } from '$lib/people';
import { TIMELINE, yearLabel, yearScale, type TimelineEvent } from '$lib/timeline';

export type PairShape = 'cross' | 'loop' | 'weave' | 'parent' | 'parallel' | 'brief';

export const LIVES_PAD = 20;
/** Compress the shared year axis so overlapping lives fit in one viewport. */
export const LIVES_Y = 0.42;

export function defaultLives(): string[] {
	return datedPeople()
		.slice()
		.sort((a, b) => (a.born as number) - (b.born as number) || a.id.localeCompare(b.id))
		.map((p) => p.id);
}

/** Every dated mortal, oldest birth first. */
export const DEFAULT_LIVES = defaultLives();

export function sameWho(a: string[], b: string[]): boolean {
	if (a.length !== b.length) return false;
	const s = new Set(b);
	return a.every((id) => s.has(id));
}

export function laneGap(n: number): number {
	if (n >= 60) return 16;
	if (n >= 24) return 22;
	if (n >= 10) return 32;
	return 44;
}

export function strokeWidth(n: number): number {
	if (n >= 40) return 1.35;
	if (n >= 16) return 2;
	return 2.4;
}

export function livesY(px: number): number {
	return px * LIVES_Y;
}

export function livesAxis(): {
	height: number;
	ticks: typeof TIMELINE.ticks;
	breaks: typeof TIMELINE.breaks;
	events: TimelineEvent[];
} {
	return {
		height: livesY(TIMELINE.height),
		ticks: TIMELINE.ticks.map((t) => ({ ...t, top: livesY(t.top) })),
		breaks: TIMELINE.breaks.map((g) => ({ ...g, top: livesY(g.top), height: livesY(g.height) })),
		events: TIMELINE.events.map((e) => ({ ...e, top: livesY(e.top) }))
	};
}

type Bilingual = { en: string; ko: string };

export type LifeMeet = {
	id: string;
	year: number;
	top: number;
	title: Bilingual;
	people: string[];
	event: TimelineEvent | null;
};

export type LifeLane = {
	person: Person;
	x: number;
	color: string;
	born: number;
	died: number;
	bornTop: number;
	diedTop: number;
	/** Open path from birth to death, bending toward each shared event. */
	d: string;
	ticks: { year: number; top: number; label: string }[];
};

export type LifePair = {
	a: string;
	b: string;
	shape: PairShape;
	label: Bilingual;
	meets: LifeMeet[];
};

export type LivesView = {
	width: number;
	height: number;
	lanes: LifeLane[];
	meets: LifeMeet[];
	pairs: LifePair[];
};

const PARENT_RE = /^(father|mother|parent|son|daughter|grandson|granddaughter|grandfather|grandmother)$/i;

/** Mortal people with a birth year — gods, places and ideas stay off the board. */
export function datedPeople(): Person[] {
	return PEOPLE.filter((p) => !p.entity && Number.isFinite(p.born));
}

export function parseWho(raw: string | null): string[] {
	const ids = (raw ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter((id) => byId.get(id) && Number.isFinite(byId.get(id)!.born));
	const unique = [...new Set(ids)];
	return unique.length ? unique : DEFAULT_LIVES.slice();
}

export function searchDated(query: string): Person[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return datedPeople()
		.filter((p) => {
			const hay = [p.name, p.korean, p.hanja, p.title, ...(p.aliases ?? [])]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			return hay.includes(q);
		})
		.slice(0, 12);
}

/** People who share at least one key event — the useful starting set. */
export function suggestedPeople(): Person[] {
	const counts = new Map<string, number>();
	for (const e of TIMELINE.events) {
		for (const p of e.people) counts.set(p.id, (counts.get(p.id) ?? 0) + 1);
	}
	const pinned = [
		'sadaham',
		'muryuk',
		'mugwan',
		'yushin',
		'chunchu',
		'bidam',
		'gyebek',
		'gesomun',
		'seohyeon',
		'jinheung',
		'kingmu',
		'gwisan',
		'chuhang'
	];
	const rest = [...counts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([id]) => id)
		.filter((id) => !pinned.includes(id));
	return [...pinned, ...rest].flatMap((id) => {
		const p = byId.get(id);
		return p && Number.isFinite(p.born) ? [p] : [];
	});
}

function spanOf(p: Person): { born: number; died: number } | null {
	if (!Number.isFinite(p.born)) return null;
	const born = p.born as number;
	const died = Number.isFinite(p.died) ? (p.died as number) : born + 80;
	return { born, died: Math.max(died, born + 1) };
}

function related(a: Person, b: Person): boolean {
	return (
		!!a.family?.some((f) => f.id === b.id && PARENT_RE.test(f.role)) ||
		!!b.family?.some((f) => f.id === a.id && PARENT_RE.test(f.role))
	);
}

export function pairShape(a: Person, b: Person, meets: LifeMeet[]): PairShape {
	if (related(a, b)) return 'parent';
	if (meets.length >= 3) return 'weave';
	if (meets.length === 2) return 'loop';
	if (meets.length === 1) {
		const sa = spanOf(a);
		const sb = spanOf(b);
		if (sa && sb) {
			const short = Math.min(sa.died - sa.born, sb.died - sb.born);
			const after = Math.min(sa.died, sb.died) - meets[0].year;
			if (short <= 25 && after <= 5) return 'brief';
		}
		return 'cross';
	}
	return 'parallel';
}

const SHAPE_LABEL: Record<PairShape, Bilingual> = {
	cross: { en: 'One meeting', ko: '한 번의 만남' },
	loop: { en: 'They meet twice', ko: '두 번의 만남' },
	weave: { en: 'Their lives keep crossing', ko: '삶이 계속 겹친다' },
	parent: { en: 'Blood', ko: '혈연' },
	parallel: { en: 'Same years, no meeting', ko: '같은 시대, 만나지 않음' },
	brief: { en: 'One meeting, then one life ends', ko: '한 번 만나고, 하나가 먼저 간다' }
};

function meetsOf(ids: Set<string>): LifeMeet[] {
	const out: LifeMeet[] = [];
	for (const e of TIMELINE.events) {
		const people = e.people.map((p) => p.id).filter((id) => ids.has(id));
		if (people.length < 2) continue;
		out.push({
			id: e.id,
			year: e.year,
			top: livesY(e.top),
			title: e.title,
			people,
			event: { ...e, top: livesY(e.top) }
		});
	}
	return out;
}

function pathOf(x: number, bornTop: number, diedTop: number, bends: { top: number; x: number }[]): string {
	const pts = [{ top: bornTop, x }, ...bends.filter((b) => b.top > bornTop && b.top < diedTop), { top: diedTop, x }];
	let d = `M ${x.toFixed(1)} ${pts[0].top.toFixed(1)}`;
	for (let i = 1; i < pts.length; i++) {
		const prev = pts[i - 1];
		const cur = pts[i];
		const mid = (prev.top + cur.top) / 2;
		d += ` C ${prev.x.toFixed(1)} ${mid.toFixed(1)}, ${cur.x.toFixed(1)} ${mid.toFixed(1)}, ${cur.x.toFixed(1)} ${cur.top.toFixed(1)}`;
	}
	return d;
}

export function layoutLives(ids: string[]): LivesView {
	const people = ids
		.flatMap((id) => {
			const p = byId.get(id);
			const span = p ? spanOf(p) : null;
			return p && span ? [{ person: p, ...span }] : [];
		})
		.sort((a, b) => a.born - b.born || a.person.id.localeCompare(b.person.id));
	const idSet = new Set(people.map((p) => p.person.id));
	const meets = meetsOf(idSet);
	const gap = laneGap(people.length);
	const width = Math.max(LIVES_PAD * 2 + people.length * gap, 280);
	const lanes: LifeLane[] = people.map((row, i) => {
		const x = LIVES_PAD + i * gap + gap / 2;
		const bornTop = livesY(yearScale(row.born));
		const diedTop = livesY(yearScale(row.died));
		const myMeets = meets.filter((m) => m.people.includes(row.person.id));
		const bends = myMeets.map((m) => {
			const others = m.people.map((id) => people.findIndex((p) => p.person.id === id)).filter((j) => j >= 0);
			const midX =
				others.reduce((s, j) => s + (LIVES_PAD + j * gap + gap / 2), 0) / Math.max(others.length, 1);
			return { top: m.top, x: midX };
		});
		const ticks = (row.person.events ?? [])
			.filter((ev) => Number.isFinite(ev.year))
			.map((ev) => ({
				year: ev.year as number,
				top: livesY(yearScale(ev.year as number)),
				label: ev.label
			}));
		return {
			person: row.person,
			x,
			color: colorOf(row.person),
			born: row.born,
			died: row.died,
			bornTop,
			diedTop,
			d: pathOf(x, bornTop, diedTop, bends),
			ticks
		};
	});

	const pairs: LifePair[] = [];
	const crowded = people.length > 12;
	for (let i = 0; i < people.length; i++) {
		for (let j = i + 1; j < people.length; j++) {
			const a = people[i].person;
			const b = people[j].person;
			const shared = meets.filter((m) => m.people.includes(a.id) && m.people.includes(b.id));
			if (crowded && !shared.length) continue;
			const sa = spanOf(a);
			const sb = spanOf(b);
			const overlap = sa && sb && sa.born < sb.died && sb.born < sa.died;
			if (!shared.length && !overlap && !related(a, b)) continue;
			const shape = pairShape(a, b, shared);
			pairs.push({ a: a.id, b: b.id, shape, label: SHAPE_LABEL[shape], meets: shared });
		}
	}

	return { width, height: livesY(TIMELINE.height), lanes, meets, pairs };
}

export function lifeYears(p: Person, ko = false): string {
	const span = spanOf(p);
	if (!span) return '';
	const a = `${p.bornApprox ? (ko ? '약 ' : 'c. ') : ''}${yearLabel(span.born, ko)}`;
	const b = Number.isFinite(p.died) ? yearLabel(span.died, ko) : ko ? '—' : '—';
	return `${a}–${b}`;
}
