import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import fs from 'node:fs/promises';
import path from 'node:path';
import { armSkipChronicleHmr } from '$lib/server/chronicleHmr';
import type { RequestHandler } from './$types';

const FILE = path.resolve('src/lib/scenes.ts');

export const PUT: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Scene frames save only in local dev');
	const body = (await request.json()) as { id?: unknown; frames?: unknown };
	const id = typeof body.id === 'string' ? body.id : '';
	const frames = body.frames;
	if (!/^[\w-]+$/.test(id)) error(400, 'Bad scene id');
	if (
		!Array.isArray(frames) ||
		frames.length < 1 ||
		frames.some((frame) => typeof frame !== 'string' || !frame.startsWith('/') || frame.includes("'"))
	) {
		error(400, 'Bad frames');
	}

	const text = await fs.readFile(FILE, 'utf8');
	const marker = `id: '${id}'`;
	const start = text.indexOf(marker);
	if (start < 0) error(404, 'Scene not found');
	const nextScene = text.indexOf("\n\tid: '", start + marker.length);
	const sliceEnd = nextScene < 0 ? text.length : nextScene;
	const block = text.slice(start, sliceEnd);
	if (!/frames: \[/.test(block)) error(400, 'Scene has no frames array');

	const rendered =
		'frames: [\n' + frames.map((frame) => `\t\t\t'${frame}'`).join(',\n') + '\n\t\t]';
	const nextBlock = block.replace(/frames: \[[\s\S]*?\]/, rendered);
	if (nextBlock === block) error(400, 'Could not update frames');
	armSkipChronicleHmr();
	await fs.writeFile(FILE, text.slice(0, start) + nextBlock + text.slice(sliceEnd));
	return json({ ok: true });
};
