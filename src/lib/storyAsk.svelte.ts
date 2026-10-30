/**
 * Shared floating ask-panel state. Mount `StoryAsk` once; any page can open it.
 */

export type AskMsg = { id: string; role: 'user' | 'assistant'; content: string };

function nid(): string {
	return typeof crypto !== 'undefined' && 'randomUUID' in crypto
		? crypto.randomUUID()
		: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

let open = $state(false);
let input = $state('');
let pending = $state(false);
let error = $state<string | null>(null);
let messages = $state<AskMsg[]>([]);
let abort: AbortController | null = null;

export function lastAssistant(): AskMsg | undefined {
	for (let i = messages.length - 1; i >= 0; i--) {
		if (messages[i].role === 'assistant') return messages[i];
	}
	return undefined;
}

async function readSse(body: ReadableStream<Uint8Array>, onText: (chunk: string) => void): Promise<void> {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buf = '';
	while (true) {
		const { value, done } = await reader.read();
		if (value) buf += decoder.decode(value, { stream: !done });
		if (done) buf += decoder.decode();
		const parts = buf.split('\n\n');
		buf = parts.pop() ?? '';
		for (const part of parts) {
			for (const line of part.split('\n')) {
				if (!line.startsWith('data:')) continue;
				const data = line.slice(5).trim();
				if (data === '[DONE]') return;
				if (!data) continue;
				try {
					const json = JSON.parse(data) as { text?: string };
					if (typeof json.text === 'string' && json.text) onText(json.text);
				} catch {
					/* incomplete frame; wait for the next chunk */
				}
			}
		}
		if (done) return;
	}
}

export const storyAsk = {
	get open() {
		return open;
	},
	get input() {
		return input;
	},
	set input(v: string) {
		input = v;
	},
	get pending() {
		return pending;
	},
	get error() {
		return error;
	},
	get messages() {
		return messages;
	},
	toggle() {
		open = !open;
	},
	show() {
		open = true;
	},
	hide() {
		open = false;
	},
	reset() {
		abort?.abort();
		abort = null;
		messages = [];
		error = null;
		pending = false;
		input = '';
	},
	stop() {
		abort?.abort();
	},
	async send(page: string, lang: 'en' | 'ko', preset?: string) {
		const text = (preset ?? input).trim();
		if (!text || pending) return;
		input = '';
		error = null;
		messages.push({ id: nid(), role: 'user', content: text });
		messages.push({ id: nid(), role: 'assistant', content: '' });
		const assistant = messages[messages.length - 1];
		pending = true;
		abort?.abort();
		abort = new AbortController();
		const signal = abort.signal;
		try {
			const history = messages
				.filter((m) => m.content.trim())
				.map((m) => ({ role: m.role, content: m.content }));
			const res = await fetch('/api/ask', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				signal,
				body: JSON.stringify({ messages: history, page, lang })
			});
			const stream = res.headers.get('content-type')?.includes('text/event-stream');
			if (!res.ok) {
				let message = `Ask failed (${res.status})`;
				try {
					const data = (await res.json()) as { message?: string };
					if (data.message) message = data.message;
				} catch {
					/* keep status text */
				}
				error = message;
				if (!assistant.content) messages = messages.filter((m) => m.id !== assistant.id);
				return;
			}
			if (stream && res.body) {
				await readSse(res.body, (chunk) => {
					assistant.content += chunk;
				});
			} else {
				const data = (await res.json()) as { text?: string; message?: string };
				assistant.content = data.text ?? '';
			}
			if (!assistant.content.trim()) {
				error = 'The chronicle did not answer.';
				messages = messages.filter((m) => m.id !== assistant.id);
			}
		} catch (e) {
			if (signal.aborted) {
				if (!assistant.content.trim()) messages = messages.filter((m) => m.id !== assistant.id);
				return;
			}
			error = e instanceof Error ? e.message : 'Network error';
			if (!assistant.content.trim()) messages = messages.filter((m) => m.id !== assistant.id);
		} finally {
			pending = false;
			if (abort?.signal === signal) abort = null;
		}
	}
};
