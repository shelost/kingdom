import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import { cleanStarStore, EMPTY_STAR_STORE, type ImageStarStore } from '$lib/imageStars';

const FILE = path.resolve('src/lib/data/image-stars.json');

async function readStore(): Promise<ImageStarStore> {
	try {
		return cleanStarStore(JSON.parse(await fs.readFile(FILE, 'utf-8')));
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { ...EMPTY_STAR_STORE, stars: [] };
		throw err;
	}
}

/** Rapid right-clicks must not race read-modify-write on the file. */
let queue: Promise<unknown> = Promise.resolve();

async function setStar(key: string, starred: boolean): Promise<ImageStarStore> {
	const store = await readStore();
	const set = new Set(store.stars);
	if (starred) set.add(key);
	else set.delete(key);
	const next = cleanStarStore({ updatedAt: new Date().toISOString(), stars: [...set] });
	await fs.writeFile(FILE, JSON.stringify(next, null, '\t') + '\n');
	return next;
}

export const GET: RequestHandler = async () => json({ store: await readStore() });

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Stars write to disk only in local dev');
	const body = (await request.json()) as { key?: unknown; starred?: unknown };
	const key = typeof body.key === 'string' ? body.key.trim() : '';
	const starred = body.starred;
	if (!key || typeof starred !== 'boolean') error(400, 'Expected { key, starred }');
	const run = queue.then(() => setStar(key, starred));
	queue = run.catch(() => undefined);
	return json({ ok: true, store: await run });
};
