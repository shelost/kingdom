import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';
import { entryId, type Block, type Chapter } from '$lib/story';
import { byId } from '$lib/people';
import {
	REWRITE_SYSTEM,
	blockAt,
	blockText,
	findEntry,
	locateBlock,
	rewriteUserPrompt,
	setBlockAt,
	type BlockPath
} from '$lib/rewrite';

const FILE = path.resolve('src/lib/data/story.json');

type Provider = { name: string; url: string; key: string; model: string };

/** OpenAI first; OpenRouter (same wire format) when OpenAI is out of credit or refuses the key. */
function providers(): Provider[] {
	const list: Provider[] = [];
	const openai = env.OPENAI_API_KEY?.trim();
	if (openai)
		list.push({
			name: 'OpenAI',
			url: env.OPENAI_REWRITE_ENDPOINT?.trim() || 'https://api.openai.com/v1/chat/completions',
			key: openai,
			model: env.OPENAI_REWRITE_MODEL?.trim() || 'gpt-4.1'
		});
	const openrouter = env.OPENROUTER_API_KEY?.trim();
	if (openrouter)
		list.push({
			name: 'OpenRouter',
			url: 'https://openrouter.ai/api/v1/chat/completions',
			key: openrouter,
			model: env.OPENROUTER_REWRITE_MODEL?.trim() || 'openai/gpt-4.1'
		});
	return list;
}

async function complete(messages: { role: string; content: string }[]): Promise<string> {
	const list = providers();
	if (!list.length) error(503, 'Set OPENAI_API_KEY or OPENROUTER_API_KEY');
	const failures: string[] = [];
	for (const p of list) {
		const res = await fetch(p.url, {
			method: 'POST',
			headers: { authorization: `Bearer ${p.key}`, 'content-type': 'application/json' },
			body: JSON.stringify({ model: p.model, response_format: { type: 'json_object' }, messages })
		});
		if (res.ok) {
			const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
			return data.choices?.[0]?.message?.content ?? '';
		}
		failures.push(`${p.name} ${res.status}: ${(await res.text()).slice(0, 160)}`);
		if (![401, 402, 403, 429].includes(res.status)) break;
	}
	error(502, `Rewrite model failed. ${failures.join(' · ')}`);
}

async function readStory(): Promise<Chapter[]> {
	return JSON.parse(await fs.readFile(FILE, 'utf-8')) as Chapter[];
}

/** Writes to the same file the editor and the other passes use; one at a time. */
let queue: Promise<unknown> = Promise.resolve();

type PreviewBody = { mode: 'preview'; episodeId: string; selection: string; context?: string; note?: string };
type ApplyBody = { mode: 'apply'; episodeId: string; path: BlockPath; before: Block; block: Block };

function samePath(p: unknown): p is BlockPath {
	return Array.isArray(p) && (p.length === 1 || p.length === 2) && p.every((n) => Number.isInteger(n) && n >= 0);
}

async function preview(body: PreviewBody) {
	const story = await readStory();
	const entry = findEntry(story, body.episodeId, entryId);
	if (!entry) error(404, 'No such episode');
	const where = locateBlock(entry.blocks, body.selection, body.context);
	if (!where) error(404, 'Could not find the highlighted passage in story.json');
	const block = blockAt(entry.blocks, where)!;
	const speaker = block.kind === 'dialogue' && block.person ? byId.get(block.person) : undefined;
	const text = blockText(block);
	const anchor = (entry.images ?? []).find((img) => img.at && text.includes(img.at.toLowerCase().replace(/\s+/g, ' ')))?.at;

	const content = await complete([
		{ role: 'system', content: REWRITE_SYSTEM },
		{
			role: 'user',
			content: rewriteUserPrompt({
				block,
				selection: body.selection,
				note: body.note ?? '',
				voice: speaker?.voice,
				speakerName: speaker?.name,
				protectedPhrase: anchor
			})
		}
	]);
	let next: Block | undefined;
	try {
		next = (JSON.parse(content || '{}') as { block?: Block }).block;
	} catch {
		next = undefined;
	}
	if (!next || next.kind !== block.kind) error(502, 'The model did not return a block of the same kind');
	return json({ path: where, before: block, block: next });
}

async function apply(body: ApplyBody) {
	if (!samePath(body.path) || !body.block || !body.before) error(400, 'Expected { path, before, block }');
	const run = queue.then(async () => {
		const story = await readStory();
		const entry = findEntry(story, body.episodeId, entryId);
		if (!entry) error(404, 'No such episode');
		const current = blockAt(entry.blocks, body.path);
		if (!current || JSON.stringify(current) !== JSON.stringify(body.before))
			error(409, 'That block changed since the preview; highlight it again');
		if (body.block.kind !== current.kind) error(400, 'A rewrite keeps the block kind');
		setBlockAt(entry.blocks, body.path, body.block);
		await fs.writeFile(FILE, JSON.stringify(story, null, '\t') + '\n');
	});
	queue = run.catch(() => undefined);
	await run;
	return json({ ok: true });
}

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) error(403, 'Rewrites edit story.json, so they run only in local dev');
	const body = (await request.json()) as Partial<PreviewBody | ApplyBody>;
	if (typeof body.episodeId !== 'string' || !body.episodeId) error(400, 'Expected an episodeId');
	if (body.mode === 'preview' && typeof (body as PreviewBody).selection === 'string')
		return preview(body as PreviewBody);
	if (body.mode === 'apply') return apply(body as ApplyBody);
	error(400, 'Expected mode "preview" or "apply"');
};
