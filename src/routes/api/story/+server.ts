import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';

const FILE = path.resolve('src/lib/data/story.json');

export const GET: RequestHandler = async () => {
	if (dev) {
		return json(JSON.parse(await fs.readFile(FILE, 'utf-8')));
	}
	const { chapters } = await import('$lib/story');
	return json(chapters);
};

export const PUT: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'The editor only saves in local dev, where story.json is on disk');
	const data = await request.json();
	if (!Array.isArray(data)) error(400, 'Expected an array of chapters');
	await fs.writeFile(FILE, JSON.stringify(data, null, '\t') + '\n');
	return json({ ok: true });
};
