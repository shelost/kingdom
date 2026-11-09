import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { askFind, askLive, askSystem } from '$lib/server/askContext';
import { buildTrace } from '$lib/server/askTrace';
import type { RequestHandler } from './$types';

type Provider = { name: string; url: string; key: string; model: string };
type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

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

const SSE = {
	'content-type': 'text/event-stream; charset=utf-8',
	'cache-control': 'no-cache, no-transform',
	connection: 'keep-alive'
};

const encoder = new TextEncoder();

/** One frame of Momal's stream: `{trace}`, `{text}` or `{error}`, then `[DONE]`. */
function frame(data: object | '[DONE]'): Uint8Array {
	return encoder.encode(`data: ${data === '[DONE]' ? data : JSON.stringify(data)}\n\n`);
}

/** First provider that accepts the request, falling through on auth / quota errors. */
async function openUpstream(
	list: Provider[],
	messages: ChatMessage[],
	signal: AbortSignal
): Promise<{ body: ReadableStream<Uint8Array> } | { error: string }> {
	const failures: string[] = [];
	for (const p of list) {
		const res = await fetch(p.url, {
			method: 'POST',
			headers: { authorization: `Bearer ${p.key}`, 'content-type': 'application/json' },
			signal,
			body: JSON.stringify({ model: p.model, messages, temperature: 0.2, stream: true })
		});
		if (res.ok && res.body) return { body: res.body };
		failures.push(`${p.name} ${res.status}`);
		if (![401, 402, 403, 429].includes(res.status)) break;
	}
	return { error: `Ask failed. ${failures.join(' · ')}` };
}

/** OpenAI/OpenRouter SSE deltas → `{text}` frames on our stream. */
async function pumpOpenai(
	upstream: ReadableStream<Uint8Array>,
	controller: ReadableStreamDefaultController<Uint8Array>,
	signal: AbortSignal
) {
	const decoder = new TextDecoder();
	const reader = upstream.getReader();
	const abort = () => void reader.cancel();
	signal.addEventListener('abort', abort, { once: true });
	let buf = '';
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			buf += decoder.decode(value, { stream: true });
			const frames = buf.split('\n\n');
			buf = frames.pop() ?? '';
			for (const raw of frames) {
				const line = raw.split('\n').find((row) => row.startsWith('data:'));
				const payload = line?.slice(5).trim();
				if (!payload || payload === '[DONE]') continue;
				try {
					const json = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
					const text = json.choices?.[0]?.delta?.content;
					if (typeof text === 'string' && text) controller.enqueue(frame({ text }));
				} catch {
					/* wait for a complete JSON frame */
				}
			}
		}
	} finally {
		signal.removeEventListener('abort', abort);
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		messages?: { role?: string; content?: string }[];
		page?: string;
		lang?: string;
	};
	const messages = (body.messages ?? []).filter(
		(m): m is { role: 'user' | 'assistant'; content: string } =>
			(m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && !!m.content.trim()
	);
	if (!messages.length) error(400, 'Expected messages');

	const list = providers();
	if (!list.length) error(503, 'Set OPENAI_API_KEY or OPENROUTER_API_KEY');

	const where = typeof body.page === 'string' ? body.page : '';
	const lang = body.lang === 'ko' ? 'Korean' : 'English';
	const asked = messages
		.filter((m) => m.role === 'user')
		.slice(-3)
		.map((m) => m.content)
		.join('\n');
	const signal = request.signal;
	const t0 = Date.now();
	const found = askFind(asked, where);

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			const close = () => {
				try {
					controller.close();
				} catch {
					/* already closed */
				}
			};
			try {
				controller.enqueue(frame({ trace: buildTrace(found, null, Date.now() - t0) }));
				const live = await askLive(found);
				if (signal.aborted) return close();
				controller.enqueue(frame({ trace: buildTrace(found, live, Date.now() - t0) }));

				const upstream = await openUpstream(
					list,
					[{ role: 'system', content: askSystem(found, live, lang) }, ...messages],
					signal
				);
				if ('error' in upstream) controller.enqueue(frame({ error: upstream.error }));
				else await pumpOpenai(upstream.body, controller, signal);
				if (!signal.aborted) controller.enqueue(frame('[DONE]'));
			} catch (e) {
				if (!signal.aborted) controller.enqueue(frame({ error: e instanceof Error ? e.message : 'Ask failed' }));
			}
			close();
		}
	});
	return new Response(stream, { headers: SSE });
};
