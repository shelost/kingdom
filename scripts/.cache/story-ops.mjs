/** Shared helpers for scripts that patch src/lib/data/story.json from proposal files. */
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const STORY = path.join(ROOT, 'src/lib/data/story.json');

export function loadStory() {
	return JSON.parse(fs.readFileSync(STORY, 'utf8'));
}

/** Atomic write, same tab-indented layout the file already uses. */
export function saveStory(story) {
	const tmp = STORY + '.tmp';
	fs.writeFileSync(tmp, JSON.stringify(story, null, '\t') + '\n');
	fs.renameSync(tmp, STORY);
}

/**
 * Load → mutate → save under a lock dir, so parallel patch scripts never clobber each other.
 * `fn(story)` mutates in place; return false to skip the save.
 */
export function editStory(fn) {
	const lock = STORY + '.lock';
	const start = Date.now();
	for (;;) {
		try {
			fs.mkdirSync(lock);
			break;
		} catch {
			if (Date.now() - fs.statSync(lock, { throwIfNoEntry: false })?.mtimeMs > 60_000) fs.rmSync(lock, { recursive: true, force: true });
			if (Date.now() - start > 120_000) throw new Error('story.json lock timeout');
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150);
		}
	}
	try {
		const story = loadStory();
		const out = fn(story);
		if (out !== false) saveStory(story);
		return out;
	} finally {
		fs.rmSync(lock, { recursive: true, force: true });
	}
}

export function personIds() {
	const src = fs.readFileSync(path.join(ROOT, 'src/lib/people.ts'), 'utf8');
	return new Set([...src.matchAll(/\bid:\s*'([^']+)'/g)].map((m) => m[1]));
}

/** Every searchable string on a block, for matching an anchor fragment. */
export function textOf(b) {
	return [b.html, b.ko, b.hanja, b.label, b.title, b.caption, ...(b.lines ?? []), ...(b.en ?? [])]
		.filter(Boolean)
		.join(' \u0001 ');
}

/** Every block list in an entry (top level + flashback interiors). */
export function lists(entry) {
	const out = [entry.blocks];
	const walk = (blocks) => {
		for (const b of blocks)
			if (b.kind === 'flashback' && Array.isArray(b.blocks)) {
				out.push(b.blocks);
				walk(b.blocks);
			}
	};
	walk(entry.blocks);
	return out;
}

export function find(entry, fragment, pred = () => true) {
	const hits = [];
	for (const list of lists(entry))
		list.forEach((b, i) => {
			if (pred(b) && textOf(b).includes(fragment)) hits.push({ list, i, b });
		});
	return hits;
}

export function entryOf(story, chapterId, title) {
	return story.find((c) => c.id === chapterId)?.entries.find((e) => e.title === title);
}

/**
 * Insert blocks after the block holding `after`; repeated inserts after the same
 * block keep their proposal order. Returns false when the anchor isn't unique.
 */
export function makeInserter(entry) {
	const lastAt = new Map();
	return (after, blocks) => {
		const hits = find(entry, after);
		if (hits.length !== 1) return hits.length;
		const { list, b } = hits[0];
		const prev = lastAt.get(b);
		const at = prev ? list.indexOf(prev) + 1 : list.indexOf(b) + 1;
		list.splice(at, 0, ...blocks);
		lastAt.set(b, blocks[blocks.length - 1]);
		return true;
	};
}

export function emptyEpisodes(story) {
	const out = [];
	for (const c of story)
		for (const e of c.entries) if (!lists(e).some((l) => l.some((b) => b.kind === 'quote'))) out.push(`${c.id} › ${e.title}`);
	return out;
}
