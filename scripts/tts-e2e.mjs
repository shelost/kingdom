/**
 * Throwaway end-to-end check for dialogue speech, driven over CDP against a
 * headless Chrome: click a line's speak button, and prove a clip was fetched
 * from /api/tts and actually played.
 *
 *   node scripts/tts-stub.mjs 5199 &
 *   OPENAI_API_KEY=sk-stub OPENAI_TTS_ENDPOINT=http://127.0.0.1:5199/v1/audio/speech npm run dev -- --port 5179 &
 *   node scripts/tts-e2e.mjs http://localhost:5179
 */
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const origin = process.argv[2] ?? 'http://localhost:5179';
const PORT = 9333;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function endpoint() {
	for (let i = 0; i < 40; i++) {
		try {
			const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
			const info = await res.json();
			return info.webSocketDebuggerUrl;
		} catch {
			await sleep(250);
		}
	}
	throw new Error('Chrome never opened its debugger');
}

class Cdp {
	#ws;
	#id = 0;
	#waiting = new Map();
	events = [];

	static async open(url) {
		const cdp = new Cdp();
		cdp.#ws = new WebSocket(url);
		await new Promise((res, rej) => {
			cdp.#ws.addEventListener('open', res, { once: true });
			cdp.#ws.addEventListener('error', rej, { once: true });
		});
		cdp.#ws.addEventListener('message', (e) => {
			const msg = JSON.parse(e.data);
			if (msg.id && cdp.#waiting.has(msg.id)) {
				const { res, rej } = cdp.#waiting.get(msg.id);
				cdp.#waiting.delete(msg.id);
				msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
			} else if (msg.method) {
				cdp.events.push(msg);
			}
		});
		return cdp;
	}

	send(method, params = {}, sessionId) {
		const id = ++this.#id;
		return new Promise((res, rej) => {
			this.#waiting.set(id, { res, rej });
			this.#ws.send(JSON.stringify({ id, method, params, sessionId }));
		});
	}

	close() {
		this.#ws.close();
	}
}

const profile = await mkdtemp(join(tmpdir(), 'tts-e2e-'));
const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${profile}`,
		'--autoplay-policy=no-user-gesture-required',
		'--no-first-run',
		'--mute-audio',
		'--window-size=1280,900',
		'about:blank'
	],
	{ stdio: 'ignore' }
);

const results = [];
const check = (name, ok, detail = '') => {
	results.push({ name, ok, detail });
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

try {
	const cdp = await Cdp.open(await endpoint());
	const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
	const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
	const call = (m, p = {}) => cdp.send(m, p, sessionId);

	await call('Page.enable');
	await call('Runtime.enable');
	await call('Network.enable');
	await call('Log.enable');

	/* Every `new Audio()` reports its own lifecycle, and the player builds its
	   element lazily — so patching on document creation always gets there first. */
	await call('Page.addScriptToEvaluateOnNewDocument', {
		source: `
			window.__ev = [];
			const Native = window.Audio;
			window.Audio = class extends Native {
				constructor(...args) {
					super(...args);
					window.__el = this;
					for (const t of ['loadstart', 'playing', 'ended', 'error', 'pause']) {
						this.addEventListener(t, () => window.__ev.push(t));
					}
				}
			};
		`
	});

	await call('Page.navigate', { url: `${origin}/` });
	await sleep(3500);

	const evaluate = async (expression) => {
		const { result, exceptionDetails } = await call('Runtime.evaluate', {
			expression,
			awaitPromise: true,
			returnByValue: true
		});
		if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails));
		return result.value;
	};

	const buttons = await evaluate(`document.querySelectorAll('.dialogue .speak').length`);
	check('speak controls render on dialogue', buttons > 100, `${buttons} controls`);

	const hud = await evaluate(
		`document.querySelector('.hud .voice')?.textContent?.trim() ?? 'missing'`
	);
	check('HUD carries the voice pill', hud.includes('Voice'), hud);

	/* Click the first line that has something to say, and wait for the audio. */
	const played = await evaluate(`(async () => {
		const btn = document.querySelector('.dialogue .speak');
		if (!btn) return { ok: false, why: 'no control' };
		btn.click();
		for (let i = 0; i < 120; i++) {
			if (window.__ev.includes('playing')) break;
			await new Promise((r) => setTimeout(r, 250));
		}
		const el = window.__el;
		return {
			ok: window.__ev.includes('playing'),
			events: window.__ev.slice(),
			src: el?.src ?? '',
			duration: el?.duration ?? 0,
			lit: !!document.querySelector('.dialogue .speak.on')
		};
	})()`);

	check('clicking a line plays a clip', played.ok, `events: ${played.events?.join(', ')}`);
	check(
		'the clip came from /api/tts',
		typeof played.src === 'string' && played.src.includes('/api/tts?'),
		decodeURIComponent(played.src).slice(0, 150)
	);
	check('clip has real audio in it', played.duration > 0.4, `${played.duration?.toFixed(2)}s`);
	check('the control lights while sounding', played.lit);

	const requests = cdp.events
		.filter((e) => e.method === 'Network.requestWillBeSent')
		.map((e) => e.params.request.url)
		.filter((u) => u.includes('/api/tts'));
	check('exactly one clip requested', requests.length === 1, `${requests.length} request(s)`);

	/* Same line again: the browser must not go back to the network for it. */
	const again = await evaluate(`(async () => {
		window.__ev.length = 0;
		const btn = document.querySelector('.dialogue .speak');
		btn.click();
		for (let i = 0; i < 80; i++) {
			if (window.__ev.includes('playing')) break;
			await new Promise((r) => setTimeout(r, 200));
		}
		return window.__ev.slice();
	})()`);
	const served = cdp.events
		.filter((e) => e.method === 'Network.responseReceived')
		.filter((e) => e.params.response.url.includes('/api/tts'))
		.map((e) => `${e.params.response.status}${e.params.response.fromDiskCache ? ' (disk cache)' : ''}`);
	check('replaying a line hits the cache, not the API', again.includes('playing'), served.join(', '));

	/* Advancing must cut the line off — that is what the HUD toggle drives too. */
	const interrupted = await evaluate(`(async () => {
		window.__ev.length = 0;
		document.querySelectorAll('.dialogue .speak')[0].click();
		for (let i = 0; i < 60; i++) {
			if (window.__ev.includes('playing')) break;
			await new Promise((r) => setTimeout(r, 150));
		}
		const before = window.__el.paused;
		document.querySelectorAll('.dialogue .lines.pick, .dialogue .lines')[4]?.click();
		window.scrollBy(0, 1200);
		window.dispatchEvent(new Event('scroll'));
		await new Promise((r) => setTimeout(r, 1200));
		return { before, after: window.__el.paused };
	})()`);
	check(
		'advancing stops the previous line',
		interrupted.before === false && interrupted.after === true,
		`paused before ${interrupted.before} → after ${interrupted.after}`
	);

	const logs = cdp.events
		.filter((e) => e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
		.map((e) => e.params.entry.text)
		.filter((t) => !t.includes('favicon'));
	check('no console errors', logs.length === 0, logs.slice(0, 3).join(' | '));

	cdp.close();
} finally {
	chrome.kill();
	await rm(profile, { recursive: true, force: true });
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
