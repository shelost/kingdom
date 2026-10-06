/**
 * In-memory chronicle search: entry/scene titles, quotes, dialogue, narration.
 * Built from `chapters` already loaded with the app — never fetches story.json again.
 */
import { MOVIE_SEQUENCES } from '$lib/movieSequences';
import { nsfwUi } from '$lib/nsfwUi.svelte';
import { chapters, entryId, isSceneHeader, scenesOf, type Block, type Entry } from '$lib/story';
import { plainText } from '$lib/speech';

export type StorySearchKind = 'title' | 'scene' | 'quote' | 'dialogue' | 'narration' | 'sequence';

export type StorySearchHit = {
	episodeId: string;
	destId: string;
	episodeTitle: string;
	episodeKo?: string;
	sceneTitle?: string;
	sceneKo?: string;
	snippet: string;
	kind: StorySearchKind;
};

type Chunk = { kind: StorySearchKind; text: string; nsfw?: boolean };

type SearchDoc = {
	episodeId: string;
	destId: string;
	episodeTitle: string;
	episodeKo?: string;
	sceneTitle?: string;
	sceneKo?: string;
	hay: string;
	hayAll: string;
	chunks: Chunk[];
};

const SNIPPET = 140;
const MAX_HITS = 40;

let docs: SearchDoc[] | null = null;

function norm(s: string): string {
	return s.replace(/\s+/g, ' ').trim();
}

function hayOf(s: string): string {
	return s.toLowerCase();
}

function pushChunk(chunks: Chunk[], kind: StorySearchKind, raw: string | undefined, nsfw?: boolean) {
	if (!raw) return;
	const text = norm(plainText(raw));
	if (!text) return;
	chunks.push({ kind, text, nsfw: nsfw || undefined });
}

function walkBlocks(
	blocks: Block[] | undefined,
	onHeader: (block: Block) => void,
	onText: (kind: StorySearchKind, text: string, nsfw?: boolean) => void
) {
	for (const b of blocks ?? []) {
		if (isSceneHeader(b)) onHeader(b);
		const nsfw = 'nsfw' in b && !!b.nsfw;
		switch (b.kind) {
			case 'p':
			case 'cite':
			case 'moral':
			case 'monologue':
				onText('narration', b.html, nsfw);
				onText('narration', b.ko, nsfw);
				break;
			case 'quote':
				onText('quote', b.hanja, nsfw);
				onText('quote', b.ko, nsfw);
				onText('quote', b.html, nsfw);
				break;
			case 'dialogue':
				for (const line of b.lines) onText('dialogue', line, nsfw);
				for (const line of b.en ?? []) onText('dialogue', line, nsfw);
				for (const line of b.zh ?? []) onText('dialogue', line, nsfw);
				for (const line of b.ja ?? []) onText('dialogue', line, nsfw);
				break;
			case 'verse':
				for (const line of b.lines) onText('narration', line, nsfw);
				break;
			case 'day':
			case 'scene':
				onText('scene', b.label);
				onText('scene', b.ko);
				break;
			case 'flashback':
				onText('scene', b.title);
				walkBlocks(b.blocks, onHeader, onText);
				break;
			default:
				break;
		}
	}
}

function finishDoc(out: SearchDoc[], base: Omit<SearchDoc, 'hay' | 'hayAll'>, extra: string[]) {
	const titles = [base.episodeTitle, base.episodeKo, base.sceneTitle, base.sceneKo, ...extra];
	const hay = hayOf(
		[...titles, ...base.chunks.filter((c) => !c.nsfw).map((c) => c.text)].filter(Boolean).join('\n')
	);
	const hayAll = hayOf([...titles, ...base.chunks.map((c) => c.text)].filter(Boolean).join('\n'));
	if (!hayAll.trim()) return;
	out.push({ ...base, hay, hayAll });
}

function buildIndex(): SearchDoc[] {
	const out: SearchDoc[] = [];
	const titleToEpisode = new Map<string, string>();

	for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
		const ch = chapters[chapterIndex];
		for (let entryIndex = 0; entryIndex < ch.entries.length; entryIndex++) {
			const entry: Entry = ch.entries[entryIndex];
			const epId = entryId(ch.id, entry.title);
			titleToEpisode.set(entry.title, epId);

			const sceneList = scenesOf(entry.blocks, epId);
			let sceneCursor = -1;
			const byDest = new Map<string, SearchDoc>();

			const ensure = (destId: string, sceneTitle?: string, sceneKo?: string): SearchDoc => {
				let doc = byDest.get(destId);
				if (!doc) {
					doc = {
						episodeId: epId,
						destId,
						episodeTitle: entry.title,
						episodeKo: entry.subtitle,
						sceneTitle,
						sceneKo,
						hay: '',
						hayAll: '',
						chunks: []
					};
					byDest.set(destId, doc);
				}
				return doc;
			};

			const entryDoc = ensure(epId, entry.title, entry.subtitle);
			pushChunk(entryDoc.chunks, 'title', entry.title);
			pushChunk(entryDoc.chunks, 'title', entry.subtitle);

			let current = entryDoc;

			walkBlocks(
				entry.blocks,
				() => {
					sceneCursor += 1;
					const s = sceneList[sceneCursor];
					current = s ? ensure(s.id, s.title, s.ko) : entryDoc;
					if (s) {
						pushChunk(current.chunks, 'scene', s.title);
						pushChunk(current.chunks, 'scene', s.ko);
					}
				},
				(kind, text, nsfw) => {
					pushChunk(current.chunks, kind, text, nsfw);
				}
			);

			for (const doc of byDest.values()) {
				finishDoc(out, doc, []);
			}
		}
	}

	for (const seq of MOVIE_SEQUENCES) {
		for (const title of seq.entryTitles) {
			const episodeId = titleToEpisode.get(title);
			if (!episodeId) continue;
			const extra = [seq.title, ...seq.shots.map((s) => s.at ?? '').filter(Boolean)];
			const doc: Omit<SearchDoc, 'hay' | 'hayAll'> = {
				episodeId,
				destId: episodeId,
				episodeTitle: title,
				sceneTitle: seq.title,
				chunks: [{ kind: 'sequence', text: extra.join(' · ') }]
			};
			finishDoc(out, doc, extra);
		}
	}

	return out;
}

function getDocs(): SearchDoc[] {
	if (!docs) docs = buildIndex();
	return docs;
}

function tokensOf(q: string): string[] {
	return q
		.toLowerCase()
		.split(/\s+/)
		.map((t) => t.trim())
		.filter((t) => t.length > 0);
}

function snippetAround(text: string, tokens: string[]): string {
	const lower = hayOf(text);
	let at = -1;
	for (const t of tokens) {
		const i = lower.indexOf(t);
		if (i >= 0) {
			at = i;
			break;
		}
	}
	if (at < 0) {
		return text.length > SNIPPET ? `${text.slice(0, SNIPPET)}…` : text;
	}
	const start = Math.max(0, at - 36);
	const end = Math.min(text.length, at + SNIPPET - 36);
	const slice = text.slice(start, end);
	return `${start > 0 ? '…' : ''}${slice}${end < text.length ? '…' : ''}`;
}

function bestChunk(doc: SearchDoc, tokens: string[], intimate: boolean): Chunk | null {
	const usable = intimate ? doc.chunks : doc.chunks.filter((c) => !c.nsfw);
	for (const c of usable) {
		const h = hayOf(c.text);
		if (tokens.every((t) => h.includes(t))) return c;
	}
	for (const c of usable) {
		const h = hayOf(c.text);
		if (tokens.some((t) => h.includes(t))) return c;
	}
	return usable[0] ?? null;
}

function score(doc: SearchDoc, tokens: string[], chunk: Chunk | null): number {
	const titleHay = hayOf(
		`${doc.episodeTitle} ${doc.episodeKo ?? ''} ${doc.sceneTitle ?? ''} ${doc.sceneKo ?? ''}`
	);
	let n = 0;
	if (tokens.every((t) => titleHay.includes(t))) n += 80;
	if (chunk?.kind === 'title') n += 50;
	else if (chunk?.kind === 'scene') n += 40;
	else if (chunk?.kind === 'quote') n += 30;
	else if (chunk?.kind === 'dialogue') n += 20;
	else if (chunk?.kind === 'sequence') n += 15;
	else n += 8;
	return n;
}

export function searchStory(query: string, limit = MAX_HITS): StorySearchHit[] {
	const tokens = tokensOf(query);
	if (!tokens.length) return [];
	const intimate = nsfwUi.showIntimate;
	const ranked: { hit: StorySearchHit; score: number }[] = [];

	for (const doc of getDocs()) {
		const field = intimate ? doc.hayAll : doc.hay;
		if (!tokens.every((t) => field.includes(t))) continue;
		const chunk = bestChunk(doc, tokens, intimate);
		ranked.push({
			score: score(doc, tokens, chunk),
			hit: {
				episodeId: doc.episodeId,
				destId: doc.destId,
				episodeTitle: doc.episodeTitle,
				episodeKo: doc.episodeKo,
				sceneTitle: doc.sceneTitle && doc.sceneTitle !== doc.episodeTitle ? doc.sceneTitle : undefined,
				sceneKo: doc.sceneKo && doc.sceneKo !== doc.episodeKo ? doc.sceneKo : undefined,
				snippet: chunk ? snippetAround(chunk.text, tokens) : doc.episodeTitle,
				kind: chunk?.kind ?? 'narration'
			}
		});
	}

	ranked.sort((a, b) => b.score - a.score);
	const seen = new Set<string>();
	const out: StorySearchHit[] = [];
	for (const row of ranked) {
		const key = `${row.hit.destId}::${row.hit.kind}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(row.hit);
		if (out.length >= limit) break;
	}
	return out;
}

export type StorySearchGroup = {
	episodeId: string;
	episodeTitle: string;
	episodeKo?: string;
	hits: StorySearchHit[];
};

export function groupStoryHits(hits: StorySearchHit[]): StorySearchGroup[] {
	const order: string[] = [];
	const map = new Map<string, StorySearchGroup>();
	for (const hit of hits) {
		let g = map.get(hit.episodeId);
		if (!g) {
			g = {
				episodeId: hit.episodeId,
				episodeTitle: hit.episodeTitle,
				episodeKo: hit.episodeKo,
				hits: []
			};
			map.set(hit.episodeId, g);
			order.push(hit.episodeId);
		}
		g.hits.push(hit);
	}
	return order.map((id) => map.get(id)!);
}
