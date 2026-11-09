/**
 * Shared Momal chat state. Mount `Momal` once in the root layout; any page can open it,
 * and `/momal` reads the same store, so the corner panel and the full page share threads.
 * Threads live in localStorage. `context` remembers the last page the reader was on, so
 * Momal can still answer about it from `/momal`.
 */

import type { MomalTrace } from '$lib/momalTypes';

export type AskMsg = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	/** What Momal looked up for this answer (assistant only). */
	trace?: MomalTrace;
	/** Milliseconds from asking to the first word (assistant only). */
	thinkMs?: number;
};
type AskFrame = { text?: string; trace?: MomalTrace; error?: string };
export type AskContext = { path: string; title: string };
export type AskThread = { id: string; title: string; updated: number; messages: AskMsg[] };

const STORE_KEY = 'momal:threads';
const LEGACY_KEY = 'momal:thread';
const MAX_THREADS = 60;
const TITLE_LEN = 64;

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
let threads = $state<AskThread[]>([]);
let currentId = $state(nid());
let context = $state<AskContext>({ path: '/', title: '' });
let abort: AbortController | null = null;
let restored = false;

function titleOf(list: AskMsg[]): string {
	const first = list.find((m) => m.role === 'user')?.content.trim().replace(/\s+/g, ' ') ?? '';
	return first.length > TITLE_LEN ? `${first.slice(0, TITLE_LEN - 1)}…` : first;
}

function cleanList(list: unknown): AskMsg[] {
	if (!Array.isArray(list)) return [];
	return list.filter(
		(m): m is AskMsg =>
			!!m &&
			typeof m.id === 'string' &&
			typeof m.content === 'string' &&
			(m.role === 'user' || m.role === 'assistant') &&
			(m.trace === undefined || (typeof m.trace === 'object' && Array.isArray(m.trace.steps)))
	);
}

function save() {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORE_KEY, JSON.stringify($state.snapshot(threads)));
	} catch {
		/* storage full or blocked; history just won't survive a reload */
	}
}

/** Write the open conversation into its thread (newest first), then save. */
function persist() {
	const kept = messages.filter((m) => m.content.trim());
	const i = threads.findIndex((t) => t.id === currentId);
	if (!kept.length) {
		if (i >= 0) threads.splice(i, 1);
		save();
		return;
	}
	const old = i >= 0 ? threads[i] : undefined;
	const thread: AskThread = {
		id: currentId,
		title: old?.title || titleOf(kept),
		updated: Date.now(),
		messages: $state.snapshot(kept) as AskMsg[]
	};
	if (i >= 0) threads.splice(i, 1);
	threads.unshift(thread);
	if (threads.length > MAX_THREADS) threads.length = MAX_THREADS;
	save();
}

function restore() {
	if (restored || typeof localStorage === 'undefined') return;
	restored = true;
	try {
		const raw = localStorage.getItem(STORE_KEY);
		const list = raw ? (JSON.parse(raw) as AskThread[]) : [];
		threads = (Array.isArray(list) ? list : [])
			.filter((t) => t && typeof t.id === 'string')
			.map((t) => ({
				id: t.id,
				title: typeof t.title === 'string' ? t.title : '',
				updated: typeof t.updated === 'number' ? t.updated : Date.now(),
				messages: cleanList(t.messages)
			}))
			.filter((t) => t.messages.length);
		/* The single session thread from before threads existed becomes the first one. */
		const legacy = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(LEGACY_KEY) : null;
		if (legacy) {
			const msgs = cleanList(JSON.parse(legacy));
			if (msgs.length) threads.unshift({ id: nid(), title: titleOf(msgs), updated: Date.now(), messages: msgs });
			sessionStorage.removeItem(LEGACY_KEY);
			save();
		}
		if (!messages.length && threads[0] && Date.now() - threads[0].updated < 1000 * 60 * 60 * 6) {
			currentId = threads[0].id;
			messages = threads[0].messages.map((m) => ({ ...m }));
		}
	} catch {
		/* corrupt entry; start fresh */
	}
}

export function lastAssistant(): AskMsg | undefined {
	for (let i = messages.length - 1; i >= 0; i--) {
		if (messages[i].role === 'assistant') return messages[i];
	}
	return undefined;
}

async function readSse(body: ReadableStream<Uint8Array>, onFrame: (frame: AskFrame) => void): Promise<void> {
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
					const json = JSON.parse(data) as AskFrame;
					if (json && typeof json === 'object') onFrame(json);
				} catch {
					/* incomplete frame; wait for the next chunk */
				}
			}
		}
		if (done) return;
	}
}

/** Ask for the next assistant turn on the current messages (the last one is the user's). */
async function answer(page: string, lang: 'en' | 'ko') {
	messages.push({ id: nid(), role: 'assistant', content: '' });
	const assistant = messages[messages.length - 1];
	const drop = () => {
		if (!assistant.content.trim()) messages = messages.filter((m) => m.id !== assistant.id);
	};
	const tid = currentId;
	pending = true;
	error = null;
	abort?.abort();
	abort = new AbortController();
	const signal = abort.signal;
	try {
		const history = messages
			.filter((m) => m.id !== assistant.id && m.content.trim())
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
			drop();
			return;
		}
		if (stream && res.body) {
			const asked = Date.now();
			let failed = null as string | null;
			await readSse(res.body, (f) => {
				if (f.trace) assistant.trace = f.trace;
				if (typeof f.error === 'string') failed = f.error;
				if (typeof f.text === 'string' && f.text) {
					assistant.thinkMs ??= Date.now() - asked;
					assistant.content += f.text;
				}
			});
			if (failed && !assistant.content.trim()) {
				error = failed;
				drop();
				return;
			}
		} else {
			const data = (await res.json()) as { text?: string; message?: string };
			assistant.content = data.text ?? '';
		}
		if (!assistant.content.trim()) {
			error = 'The chronicle did not answer.';
			drop();
		}
	} catch (e) {
		if (!signal.aborted) error = e instanceof Error ? e.message : 'Network error';
		drop();
	} finally {
		if (currentId === tid) {
			pending = false;
			persist();
		}
		if (abort?.signal === signal) abort = null;
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
	get threads() {
		return threads;
	},
	get currentId() {
		return currentId;
	},
	get context() {
		return context;
	},
	set context(v: AskContext) {
		context = v;
	},
	restore,
	toggle() {
		open = !open;
	},
	show() {
		open = true;
	},
	hide() {
		open = false;
	},
	/** Start a fresh conversation. The old one is already saved in `threads`. */
	reset() {
		persist();
		abort?.abort();
		abort = null;
		messages = [];
		error = null;
		pending = false;
		input = '';
		currentId = nid();
	},
	select(id: string) {
		if (id === currentId) return;
		const thread = threads.find((t) => t.id === id);
		if (!thread) return;
		persist();
		abort?.abort();
		abort = null;
		pending = false;
		error = null;
		currentId = id;
		messages = thread.messages.map((m) => ({ ...m }));
	},
	remove(id: string) {
		const isOpen = id === currentId;
		if (isOpen) {
			abort?.abort();
			messages = [];
		}
		threads = threads.filter((t) => t.id !== id);
		save();
		if (isOpen) storyAsk.reset();
	},
	rename(id: string, title: string) {
		const thread = threads.find((t) => t.id === id);
		const next = title.trim().replace(/\s+/g, ' ');
		if (!thread || !next) return;
		thread.title = next.slice(0, TITLE_LEN);
		save();
	},
	stop() {
		abort?.abort();
	},
	async send(page: string, lang: 'en' | 'ko', preset?: string) {
		const text = (preset ?? input).trim();
		if (!text || pending) return;
		input = '';
		messages.push({ id: nid(), role: 'user', content: text });
		await answer(page, lang);
	},
	/** Ask the last question again, dropping the answer it got. */
	async retry(page: string, lang: 'en' | 'ko') {
		if (pending) return;
		const last = messages[messages.length - 1];
		if (last?.role === 'assistant') messages.pop();
		if (messages[messages.length - 1]?.role !== 'user') return;
		await answer(page, lang);
	}
};
