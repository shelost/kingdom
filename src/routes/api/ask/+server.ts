import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { askSystem } from '$lib/server/askContext';
import type { RequestHandler } from './$types';

type Provider = { name: string; url: string; key: string; model: string };

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

/** OpenAI/OpenRouter SSE → `data: {"text":"…"}\n\n` for the Ask panel. */
function pipeOpenaiSse(upstream: ReadableStream<Uint8Array>, signal: AbortSignal): ReadableStream<Uint8Array> {
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let buf = '';
	return new ReadableStream({
		async start(controller) {
			const reader = upstream.getReader();
			const abort = () => {
				void reader.cancel();
				try {
					controller.close();
				} catch {
					/* already closed */
				}
			};
			signal.addEventListener('abort', abort, { once: true });
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					buf += decoder.decode(value, { stream: true });
					const frames = buf.split('\n\n');
					buf = frames.pop() ?? '';
					for (const frame of frames) {
						const line = frame.split('\n').find((row) => row.startsWith('data:'));
						if (!line) continue;
						const payload = line.slice(5).trim();
						if (!payload) continue;
						if (payload === '[DONE]') {
							controller.enqueue(encoder.encode('data: [DONE]\n\n'));
							continue;
						}
						try {
							const json = JSON.parse(payload) as {
								choices?: { delta?: { content?: string } }[];
							};
							const text = json.choices?.[0]?.delta?.content;
							if (typeof text === 'string' && text) {
								controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
							}
						} catch {
							/* wait for a complete JSON frame */
						}
					}
				}
				controller.enqueue(encoder.encode('data: [DONE]\n\n'));
				controller.close();
			} catch (e) {
				if (signal.aborted) {
					try {
						controller.close();
					} catch {
						/* already closed */
					}
					return;
				}
				controller.error(e);
			} finally {
				signal.removeEventListener('abort', abort);
			}
		}
	});
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
	const sys = await askSystem({ query: asked, page: where, lang });

	const payload = [
		{ role: 'system', content: sys },
		...messages.map((m) => ({ role: m.role, content: m.content }))
	];

	const failures: string[] = [];
	for (const p of list) {
		const res = await fetch(p.url, {
			method: 'POST',
			headers: { authorization: `Bearer ${p.key}`, 'content-type': 'application/json' },
			signal: request.signal,
			body: JSON.stringify({ model: p.model, messages: payload, temperature: 0.2, stream: true })
		});
		if (res.ok && res.body) {
			return new Response(pipeOpenaiSse(res.body, request.signal), { headers: SSE });
		}
		failures.push(`${p.name} ${res.status}`);
		if (![401, 402, 403, 429].includes(res.status)) break;
	}
	error(502, `Ask failed. ${failures.join(' · ')}`);
};
