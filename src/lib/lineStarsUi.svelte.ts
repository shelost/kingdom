/**
 * Starred script lines in the browser: the file's copy at build time, then
 * /api/line-stars in dev, with this browser's localStorage when the API is out of reach.
 */
import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import { cleanLineStore, type LineStarStore, type StarredLine } from '$lib/lineStars';
import seed from '$lib/data/line-stars.json';

const LOCAL_KEY = 'kingdom:line-stars';

export const lineStars = $state<{ lines: StarredLine[]; localOnly: boolean }>({
	lines: cleanLineStore(seed).lines,
	localOnly: false
});

function readLocal(): LineStarStore | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(LOCAL_KEY);
		return raw ? cleanLineStore(JSON.parse(raw)) : null;
	} catch {
		return null;
	}
}

function writeLocal() {
	if (!browser) return;
	try {
		localStorage.setItem(
			LOCAL_KEY,
			JSON.stringify({ updatedAt: new Date().toISOString(), lines: lineStars.lines })
		);
	} catch {
		/* private mode */
	}
}

let loading: Promise<void> | null = null;

export function ensureLineStars(): Promise<void> {
	if (!browser) return Promise.resolve();
	loading ??= (async () => {
		const local = readLocal();
		if (local?.lines.length) lineStars.lines = local.lines;
		try {
			const res = await fetch(resolve('/api/line-stars'));
			if (res.ok) {
				const remote = cleanLineStore(((await res.json()) as { store?: unknown }).store);
				if (remote.lines.length || !local?.lines.length) lineStars.lines = remote.lines;
			}
		} catch {
			/* keep local */
		}
	})();
	return loading;
}

export function isLineStarred(id: string): boolean {
	return lineStars.lines.some((l) => l.id === id);
}

/** Flip a line's star now; the file catches up in the background. Returns the new state. */
export function toggleLineStar(line: StarredLine): boolean {
	const on = !isLineStarred(line.id);
	lineStars.lines = on ? [...lineStars.lines, line] : lineStars.lines.filter((l) => l.id !== line.id);
	writeLocal();
	void (async () => {
		try {
			const res = await fetch(resolve('/api/line-stars'), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ line, starred: on })
			});
			lineStars.localOnly = !res.ok;
		} catch {
			lineStars.localOnly = true;
		}
	})();
	return on;
}
