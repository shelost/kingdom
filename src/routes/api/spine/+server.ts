import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import { VOLUMES, normalizeHex } from '$lib/books';

const FILE = path.resolve('src/lib/data/spine-picks.json');
const ids = new Set(VOLUMES.map((v) => v.id));

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

/** POST { id, hex } — cloth colour for that volume’s spine on /books. */
export const POST: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Spine picks write to disk only in local dev');
	const body = (await request.json()) as { id?: unknown; hex?: unknown };
	const id = typeof body.id === 'string' ? body.id : '';
	const hex = typeof body.hex === 'string' ? normalizeHex(body.hex) : null;
	if (!ids.has(id)) error(400, 'Unknown volume');
	if (!hex) error(400, 'Expected a hex colour');
	const run = queue.then(async () => {
		const picks = await readPicks();
		picks[id] = hex;
		await fs.writeFile(FILE, JSON.stringify(picks, null, '\t') + '\n');
		return picks;
	});
	queue = run.catch(() => undefined);
	await run;
	return json({ ok: true, id, hex });
};
