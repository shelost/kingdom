/**
 * An episode becomes a film. Every episode gets a draft straight from its text:
 * one scene per story scene, every spoken line, the stills where the text put
 * them, and the 3D site of the place when the stage has one. A script in
 * `scripts/` directs a scene on top of the draft: its set, its cards, its
 * effects, a shot on one line.
 */
import { displayArtOf } from '$lib/cueArt';
import { isVisibleCue } from '$lib/editUi.svelte';
import { nsfwAllowed } from '$lib/nsfwUi.svelte';
import { stageOpening, stageSiteOf } from '$lib/stage/placeStage';
import type { Entry } from '$lib/story';
import { extractScenes, type RawScene, type RawStill } from './extract';
import { FILM_SCRIPTS } from './scripts';
import type { Beat, Film, FilmScene, FilmScript, FilmSet, PlateMove, SceneScript, ScriptBeat, Transition, Visual } from './types';

const MOVES: PlateMove[] = ['push', 'left', 'pull', 'right', 'rise'];

/** Lines a still may hold before the camera cuts back to the set. */
const HOLD_LINES = 3;

export function yearOf(entry: Entry): number {
	const m = String(entry.year).match(/\d{3,4}/);
	return m ? Number(m[0]) : 600;
}

function slug(s: string): string {
	return (
		s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') || 'scene'
	);
}

/** A hand-written beat is a card unless it names a speaker. */
function beatOf(b: ScriptBeat): Beat {
	return { ...b, kind: b.kind ?? (b.person || b.speaker ? 'line' : 'card') };
}

/** The set a scene gets with no script: Kangrim's road, the place's 3D site, or its stills. */
function autoSet(raw: RawScene, place: string | undefined, year: number): FilmSet {
	if (raw.road) return { kind: 'road', step: raw.road };
	const site = stageSiteOf(raw.place ?? place);
	if (!site) return { kind: 'still' };
	return {
		kind: 'stage',
		site: site.id,
		year: raw.year ?? year,
		hour: stageOpening(site).hour,
		shots: [{ view: '*', dolly: 0.12, orbit: 10 }]
	};
}

function stillVisual(s: RawStill, n: number): Visual {
	return { kind: 'still', src: s.src, id: s.id, move: MOVES[n % MOVES.length] };
}

function setVisual(set: FilmSet, n: number): Visual | undefined {
	if (set.kind === 'stage') return { kind: 'stage', shot: set.shots[n % set.shots.length], year: set.year };
	if (set.kind === 'road') return { kind: 'road', step: set.step };
	return undefined;
}

/** Still ids a run of hand-written beats already shows. */
function stillIds(beats: ScriptBeat[] | undefined): string[] {
	return (beats ?? []).flatMap((b) => (b.visual?.kind === 'still' && b.visual.id ? [b.visual.id] : []));
}

/** Dialogue first: each line keeps the newest still, and the camera returns to the set when a still has held too long. */
function draftBeats(raw: RawScene, set: FilmSet, script: SceneScript | undefined, carry: Visual | undefined): Beat[] {
	let moves = 0;
	let cover = 0;
	const opening =
		script?.open ?? setVisual(set, cover++) ?? (raw.stills[0] ? stillVisual(raw.stills[0], moves++) : carry) ?? { kind: 'black' as const };
	const isOpen = raw.label === '@open';
	const beats: Beat[] = [{ kind: 'title', en: isOpen ? '' : raw.label, ko: isOpen ? '' : (raw.ko ?? ''), visual: opening, hold: isOpen ? 0.6 : 2.4 }];

	const used = new Set<string>([
		...stillIds(script?.cards),
		...stillIds(script?.end),
		...(script?.at ?? []).flatMap((d) => [...stillIds(d.before), ...(d.visual?.kind === 'still' && d.visual.id ? [d.visual.id] : [])])
	]);
	if (opening.kind === 'still' && opening.id) used.add(opening.id);
	beats.push(...(script?.cards ?? []).map(beatOf));

	if (!raw.lines.length) {
		for (const s of raw.stills.slice(0, 5)) {
			if (used.has(s.id)) continue;
			used.add(s.id);
			beats.push({ kind: 'card', en: '', ko: '', visual: stillVisual(s, moves++), hold: 2.8 });
		}
		beats.push(...(script?.end ?? []).map(beatOf));
		return beats;
	}

	const lines = script?.limit ? raw.lines.slice(0, script.limit) : raw.lines;
	let held = 0;
	let prevBlock = raw.first - 1;
	for (const line of lines) {
		const direction = script?.at?.find((d) => line.en.toLowerCase().includes(d.line.toLowerCase()));
		if (direction?.before?.length) {
			beats.push(...direction.before.map(beatOf));
			held = 0;
		}
		const fresh = raw.stills.filter((s) => s.block > prevBlock && s.block <= line.block && !used.has(s.id));
		prevBlock = line.block;
		// stills that arrived together beyond the newest get a short beat of their own
		for (const s of fresh.slice(-3, -1)) {
			used.add(s.id);
			beats.push({ kind: 'card', en: '', ko: '', visual: stillVisual(s, moves++), hold: 1.8 });
		}
		let visual: Visual | undefined;
		const newest = fresh.at(-1);
		if (newest) {
			used.add(newest.id);
			visual = stillVisual(newest, moves++);
			held = 0;
		} else if (held >= HOLD_LINES && set.kind !== 'still') {
			visual = setVisual(set, cover++);
			held = 0;
		}
		held++;
		beats.push({
			kind: 'line',
			en: line.en,
			ko: line.ko,
			person: line.person,
			speaker: line.speaker,
			look: line.look,
			visual: direction?.visual ?? visual,
			fx: direction?.fx
		});
		if (direction?.visual) held = 0;
	}
	beats.push(...(script?.end ?? []).map(beatOf));
	return beats;
}

function lastVisual(beats: Beat[]): Visual | undefined {
	for (let i = beats.length - 1; i >= 0; i--) if (beats[i].visual) return beats[i].visual;
	return undefined;
}

function siteOf(set: FilmSet): string | null {
	return set.kind === 'stage' ? set.site : null;
}

/** How one scene hands over to the next when the script does not say. */
function autoEnter(prev: FilmScene | undefined, set: FilmSet, memory: boolean): Transition {
	if (!prev) return 'fade';
	if (memory !== prev.memory) return 'ink';
	const a = siteOf(prev.set);
	const b = siteOf(set);
	if (a && b) return a === b ? 'fly' : 'travel';
	if (!a && b) return 'travel';
	if (prev.set.kind === 'road' && set.kind === 'road') return 'cut';
	return 'fade';
}

/** Art for every still the reader may see, by slot id. */
function artById(entry: Entry): Map<string, string> {
	const out = new Map<string, string>();
	for (const slot of entry.images ?? []) {
		if (!isVisibleCue(slot) || !nsfwAllowed(slot)) continue;
		const src = displayArtOf(slot);
		if (src) out.set(slot.id, src);
	}
	return out;
}

/** Give id-only stills their art; a still the reader may not see leaves the previous picture up. */
function resolveStills(scenes: FilmScene[], art: Map<string, string>): FilmScene[] {
	const fix = (v: Visual | undefined): Visual | undefined => {
		if (!v || v.kind !== 'still' || v.src) return v;
		const src = v.id ? art.get(v.id) : undefined;
		return src ? { ...v, src } : undefined;
	};
	return scenes.map((s) => {
		const beats = s.beats.map((b) => ({ ...b, visual: fix(b.visual) }));
		if (beats[0] && !beats[0].visual) beats[0] = { ...beats[0], visual: { kind: 'black' } };
		return { ...s, beats };
	});
}

function cutFilm(script: FilmScript): FilmScene[] {
	return (script.cut ?? []).map((c, i) => ({
		id: `${i}-${slug(c.label)}`,
		label: c.label,
		ko: c.ko,
		set: c.set ?? { kind: 'still' },
		enter: c.enter ?? (i === 0 ? 'fade' : 'ink'),
		fx: c.fx ?? [],
		memory: c.memory ?? false,
		beats: c.beats.map(beatOf)
	}));
}

export function buildFilm(entry: Entry): Film {
	const script = FILM_SCRIPTS[entry.title];
	const year = yearOf(entry);
	const art = artById(entry);
	const look = script?.look ?? 'watercolor';
	if (script?.cut?.length) return { title: entry.title, year, look, scenes: resolveStills(cutFilm(script), art) };
	const scenes: FilmScene[] = [];
	let carry: Visual | undefined;
	for (const raw of extractScenes(entry)) {
		const direction = script?.scenes.find((s) => s.scene === raw.label);
		if (direction?.skip) continue;
		const set = direction?.set ?? autoSet(raw, entry.place, year);
		const beats = direction?.beats ? direction.beats.map(beatOf) : draftBeats(raw, set, direction, carry);
		if (!beats.length) continue;
		if (!beats[0].visual) beats[0] = { ...beats[0], visual: carry ?? { kind: 'black' } };
		const prev = scenes.at(-1);
		scenes.push({
			id: `${scenes.length}-${slug(raw.label)}`,
			label: raw.label === '@open' ? '' : raw.label,
			ko: raw.label === '@open' ? undefined : raw.ko,
			set,
			enter: direction?.enter ?? autoEnter(prev, set, raw.memory),
			fx: direction?.fx ?? [],
			memory: raw.memory,
			beats
		});
		carry = lastVisual(beats) ?? carry;
	}
	return { title: entry.title, year, look, scenes: resolveStills(scenes, art) };
}
