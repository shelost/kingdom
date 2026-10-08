import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import { cleanLineStore, EMPTY_LINE_STORE, type LineStarStore, type StarredLine } from '$lib/lineStars';

const FILE = path.resolve('src/lib/data/line-stars.json');

async function readStore(): Promise<LineStarStore> {
	try {
		return cleanLineStore(JSON.parse(await fs.readFile(FILE, 'utf-8')));
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { ...EMPTY_LINE_STORE, lines: [] };
		throw err;
	}
}

/** Quick double-clicks must not race read-modify-write on the file. */
let queue: Promise<unknown> = Promise.resolve();

async function setLine(line: StarredLine, starred: boolean): Promise<LineStarStore> {
	const store = await readStore();
	const rest = store.lines.filter((l) => l.id !== line.id);
	const next = cleanLineStore({
		updatedAt: new Date().toISOString(),
		lines: starred ? [...rest, line] : rest
	});
	await fs.writeFile(FILE, JSON.stringify(next, null, '\t') + '\n');
	return next;
}

export const GET: RequestHandler = async () => json({ store: await readStore() });

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Line stars write to disk only in local dev');
	const body = (await request.json()) as { line?: unknown; starred?: unknown };
	const [line] = cleanLineStore({ lines: [body.line] }).lines;
	if (!line || typeof body.starred !== 'boolean') error(400, 'Expected { line, starred }');
	const run = queue.then(() => setLine(line, body.starred as boolean));
	queue = run.catch(() => undefined);
	return json({ ok: true, store: await run });
};
