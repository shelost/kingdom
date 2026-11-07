/**
 * Everything `Blocks` reads across a whole entry before it draws one block:
 * who is named, which year a line happens in, which lines share a card,
 * which quotes form one testimony. Pure: the same blocks give the same index.
 */
import {
	isSceneHeader,
	plateYear,
	sceneIdForBlock,
	scenesOf,
	sectionNumbers,
	storyNumbers,
	type Block,
	type Sky
} from '$lib/story';
import { isMonarch, wearsSquare, type Person } from '$lib/people';
import { chatForms, mailOf, standings, type ChatForm, type Mail, type Standing } from '$lib/chat';
import { recordBook, type Testimony } from '$lib/recordBooks';
import { sceneMoods, type SceneMood } from '$lib/sceneMood';
import type { DialogueStyle } from '$lib/dialogueUi.svelte';

export type Dialogue = Extract<Block, { kind: 'dialogue' }>;
type Quote = Extract<Block, { kind: 'quote' }>;
type MapBlock = Extract<Block, { kind: 'map' }>;

export type Thread = { above: boolean; below: boolean; replyTo?: Dialogue };
export type News = { block: MapBlock; headline: string; headlineKo?: string; ticker: string[] };

export interface BlockScene {
	/** Testimony runs (quotes sharing an `event`) and the side each letter or poem sits on. */
	records: { testimony: Map<Block, Testimony>; side: Map<Block, 'left' | 'right'> };
	/** Repeat speakers in an unbroken exchange: the face carries the name. */
	quiet: Set<Block>;
	sectionNo: Map<Block, number>;
	storyNo: Map<Block, number>;
	moods: Map<Block, SceneMood>;
	/** Hybrid letters, threaded as an inbox. Empty outside Hybrid. */
	mails: Map<Block, Mail>;
	/** Hybrid war episode: the first titled map breaks as news. */
	news?: News;
	hybrid: boolean;
	yearAt(b: Block): number | null;
	formOf(b: Block): ChatForm;
	lookOf(b: Dialogue): string | undefined;
	threadOf(b: Block): Thread | undefined;
	/** Posts always sit in a card; in Hybrid, so do messages. */
	carded(b: Block | undefined): b is Dialogue;
	/** On the throne at this line (an heir under a living king is not). */
	reigns(b: Dialogue, p: Person): boolean;
	/** Wears the square monarch badge at this line. */
	squared(b: Dialogue, p: Person): boolean;
	sceneIdFor(b: Block): string | undefined;
}

export interface SceneOptions {
	year: number | null;
	style: DialogueStyle;
	idPrefix: string;
	breaking: boolean;
	weather?: Sky;
}

/** How many source lines an utterance has, across all its language layers. */
export function lineCount(b: Dialogue): number {
	return Math.max(b.lines.length, b.en?.length ?? 0, b.zh?.length ?? 0, b.ja?.length ?? 0);
}

function headerIds(source: Block[], idPrefix: string): Map<Block, string> {
	const map = new Map<Block, string>();
	if (!idPrefix) return map;
	const list = scenesOf(source, idPrefix);
	let n = 0;
	for (const b of source) {
		if (!isSceneHeader(b)) continue;
		const s = list[n++];
		if (s) map.set(b, s.id);
	}
	return map;
}

/** Runs of quotes sharing an `event` become one testimony; letters and poems alternate sides by sender. */
function recordsOf(source: Block[]): BlockScene['records'] {
	const testimony = new Map<Block, Testimony>();
	const side = new Map<Block, 'left' | 'right'>();
	const senders: string[] = [];
	const poets: string[] = [];
	for (let i = 0; i < source.length; i++) {
		const b = source[i];
		if (b.kind === 'poem') {
			const who = b.person ?? `~${i}`;
			if (!poets.includes(who)) poets.push(who);
			side.set(b, poets.indexOf(who) % 2 ? 'right' : 'left');
			continue;
		}
		if (b.kind !== 'quote') continue;
		if (b.style === 'letter') {
			const who = b.person ?? b.source;
			if (!senders.includes(who)) senders.push(who);
			side.set(b, senders.indexOf(who) % 2 ? 'right' : 'left');
		}
		if (!b.event || testimony.has(b)) continue;
		const run: Quote[] = [b];
		for (let j = i + 1; j < source.length; j++) {
			const next = source[j];
			if (next.kind !== 'quote' || next.event !== b.event) break;
			run.push(next);
		}
		if (run.length < 2) continue;
		const nations = run.map((q) => recordBook(q.source).nation);
		const sources = run.map((q) => q.source);
		const { stance, claim, claimKo } = run[0];
		run.forEach((q, index) =>
			testimony.set(q, { index, count: run.length, nations, sources, key: run[0], stance, claim, claimKo })
		);
	}
	return { testimony, side };
}

function quietOf(source: Block[]): Set<Block> {
	const quiet = new Set<Block>();
	let named = new Set<string>();
	for (const b of source) {
		if (b.kind !== 'dialogue') {
			named = new Set();
			continue;
		}
		const key = `${b.person ?? b.speaker ?? ''}|${b.look ?? ''}`;
		if (named.has(key)) quiet.add(b);
		else named.add(key);
	}
	return quiet;
}

/** A dated scene plate moves the episode to its year until the next one. */
function yearsOf(source: Block[], year: number | null): Map<Block, number> {
	const map = new Map<Block, number>();
	let at = year;
	for (const b of source) {
		at = plateYear(b) ?? at;
		if (at != null) map.set(b, at);
	}
	return map;
}

function newsOf(source: Block[]): News | undefined {
	const headlineOf = (b: Block) =>
		b.kind === 'map' ? (b.title ?? b.caption) : b.kind === 'formation' ? b.title : b.kind === 'day' ? b.label : undefined;
	const lead = source.find((b): b is MapBlock => b.kind === 'map' && !!headlineOf(b));
	const headline = lead && headlineOf(lead);
	if (!lead || !headline) return undefined;
	const ticker = source
		.filter((b) => b !== lead)
		.map(headlineOf)
		.filter((t): t is string => !!t);
	return { block: lead, headline, headlineKo: lead.ko, ticker };
}

/** Read the whole entry once; beats split it between stills, so every map is keyed by block. */
export function blockScene(source: Block[], { year, style, idPrefix, breaking, weather }: SceneOptions): BlockScene {
	const hybrid = style === 'hybrid';
	const ids = headerIds(source, idPrefix);
	const years = yearsOf(source, year);
	const forms = chatForms(source, style, year);
	const standing: Map<Block, Standing> = standings(source, year);

	const yearAt = (b: Block) => years.get(b) ?? year;
	const formOf = (b: Block) => forms.get(b) ?? 'script';
	const lookOf = (b: Dialogue) => b.look ?? standing.get(b)?.look;
	const carded = (b: Block | undefined): b is Dialogue =>
		b?.kind === 'dialogue' && (formOf(b) === 'post' || (formOf(b) === 'message' && hybrid));

	const threads = new Map<Block, Thread>();
	const joins = (a: Block | undefined, b: Dialogue) => carded(a) && formOf(a) === formOf(b);
	for (let i = 0; i < source.length; i++) {
		const b = source[i];
		if (!carded(b)) continue;
		const prev = source[i - 1];
		const above = joins(prev, b);
		const replyTo =
			above && formOf(b) === 'post' && prev?.kind === 'dialogue' && prev.person && prev.person !== b.person
				? prev
				: undefined;
		threads.set(b, { above, below: joins(source[i + 1], b), replyTo });
	}

	return {
		records: recordsOf(source),
		quiet: quietOf(source),
		sectionNo: sectionNumbers(source),
		storyNo: storyNumbers(source),
		moods: sceneMoods(source, weather),
		mails: hybrid ? mailOf(source, forms) : new Map(),
		news: hybrid && breaking ? newsOf(source) : undefined,
		hybrid,
		yearAt,
		formOf,
		lookOf,
		threadOf: (b) => threads.get(b),
		carded,
		reigns: (b, p) => !standing.get(b)?.heir && isMonarch(p, yearAt(b), lookOf(b)),
		squared: (b, p) => !standing.get(b)?.heir && wearsSquare(p, yearAt(b), lookOf(b)),
		sceneIdFor: (b) => ids.get(b) ?? sceneIdForBlock(b, source, idPrefix)
	};
}
