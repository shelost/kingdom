import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import catalogFile from '$lib/data/poster-catalog.json';

const FILE = path.resolve('src/lib/data/poster-picks.json');
const catalog = catalogFile as Record<string, string[]>;

let queue: Promise<unknown> = Promise.resolve();

async function readPicks(): Promise<Record<string, string>> {
	try {
		const raw = JSON.parse(await fs.readFile(FILE, 'utf8')) as unknown;
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
		return raw as Record<string, string>;
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
		throw err;
	}
}

/** POST { id, file } — that alternate becomes the arc or chapter poster. */
export const POST: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Poster picks write to disk only in local dev');
	const body = (await request.json()) as { id?: unknown; file?: unknown };
	const id = typeof body.id === 'string' ? body.id : '';
	const file = typeof body.file === 'string' ? body.file : '';
	const alts = catalog[id];
	if (!alts?.includes(file)) error(400, 'Unknown poster');
	const run = queue.then(async () => {
		const picks = await readPicks();
		picks[id] = file;
		await fs.writeFile(FILE, JSON.stringify(picks, null, '\t') + '\n');
		return picks;
	});
	queue = run.catch(() => undefined);
	await run;
	return json({ ok: true, id, file });
};
