/**
 * Throwaway end-to-end check of the Intimate-scenes toggle, driven through real
 * Chrome over CDP (the IDE browser bridge would not attach).
 *
 * Probes are derived from story.json at run time, so a concurrent edit to the
 * chronicle cannot make this lie: for each entry under test it picks phrases
 * out of blocks marked `nsfw` and phrases out of neighbouring plain blocks,
 * then asserts what the DOM shows with the toggle on and off.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = 'http://localhost:5173';
const PORT = 9333;
const OUT = '/tmp/kingdom-nsfw';
fs.mkdirSync(OUT, { recursive: true });

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/* ————— probes from the data ————— */

const chapters = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const slugOf = (t) =>
	t
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const strip = (s) =>
	String(s ?? '')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();

/** A distinctive run of words from a block, long enough to be unique. */
function phraseOf(b) {
	const raw =
		b.kind === 'dialogue'
			? (b.en?.[0] ?? b.lines?.[0] ?? '')
			: (b.html ?? b.label ?? b.title ?? '');
	const t = strip(raw);
	if (t.length < 24) return null;
	return t.slice(0, 48);
}

const TARGETS = [
	{ id: 'iron-will-the-first-kim', label: 'The First Kim' },
	{ id: 'iron-will-kim-yushin', label: 'Kim Yushin' },
	{ id: 'iron-will-daeya-fortress', label: 'Daeya Fortress (STEAM / STEAM, AGAIN)' },
	{
		id: 'silla-tang-war-the-death-of-kim-yushin',
		label: 'The Death of Kim Yushin (THE LAKE REMEMBERS)'
	}
];
/** The non-nsfw spine of the scene — names, counsel, the warm stone, the door. */
const SPINE_EXTRA = {
	'iron-will-the-first-kim': [
		'Golhwa',
		'Narim',
		'Hyullé',
		'The name is the toll',
		'river stone',
		'If it stays warm, the hill',
		'only Kim',
		'That is the door'
	],
	'iron-will-daeya-fortress': ['STEAM', 'STEAM, AGAIN'],
	'silla-tang-war-the-death-of-kim-yushin': ['THE LAKE REMEMBERS']
};

const probes = [];
for (const ch of chapters) {
	for (const e of ch.entries ?? []) {
		const id = `${ch.id}-${slugOf(e.title)}`;
		const t = TARGETS.find((x) => x.id === id);
		if (!t) continue;
		const blocks = e.blocks ?? [];
		const hidden = blocks.filter((b) => b.nsfw).map(phraseOf).filter(Boolean);
		const kept = blocks.filter((b) => !b.nsfw).map(phraseOf).filter(Boolean);
		probes.push({
			...t,
			hidden,
			kept: [...new Set([...kept.slice(0, 6), ...kept.slice(-4)])],
			spine: SPINE_EXTRA[id] ?? [],
			nsfwImages: (e.images ?? []).filter((im) => im.nsfw).length,
			images: (e.images ?? []).length
		});
	}
}

/* ————— CDP plumbing ————— */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kingdom-chrome-'));
const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${profile}`,
		'--no-first-run',
		'--no-default-browser-check',
		'--window-size=1440,1000',
		'--hide-scrollbars',
		'about:blank'
	],
	{ stdio: 'ignore' }
);

async function targetWs() {
	for (let i = 0; i < 60; i++) {
		try {
			const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
			const page = list.find((t) => t.type === 'page');
			if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
		} catch {
			/* not up yet */
		}
		await sleep(250);
	}
	throw new Error('chrome devtools never came up');
}

let ws;
let nextId = 1;
const pending = new Map();
const pageErrors = [];

function send(method, params = {}) {
	const id = nextId++;
	ws.send(JSON.stringify({ id, method, params }));
	return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
	const res = await send('Runtime.evaluate', {
		expression,
		returnByValue: true,
		awaitPromise: true
	});
	if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
	return res.result.value;
}

/* ————— the checks, run in the page ————— */

const READ_ENTRY = (id) => `(() => {
	const a = document.querySelector('[data-story-id=' + JSON.stringify(${JSON.stringify(id)}) + ']');
	if (!a) return null;
	const norm = (s) => s.replace(/\\s+/g, ' ').trim();
	const prose = [...a.querySelectorAll('.prose > *')];
	return {
		text: norm(a.textContent || ''),
		blockCount: prose.length,
		emptyBlocks: prose.filter((el) => !norm(el.textContent || '')).length,
		punctOnly: prose
			.map((el) => norm(el.textContent || ''))
			.filter((t) => t && t.length <= 3 && !/[\\p{L}\\p{N}]/u.test(t)),
		imgCount: a.querySelectorAll('img').length,
		sceneIds: [...a.querySelectorAll('[data-scene]')].map((el) => el.dataset.scene)
	};
})()`;

async function scrollTo(id) {
	await evaluate(
		`document.querySelector('[data-story-id=' + JSON.stringify(${JSON.stringify(id)}) + ']')?.scrollIntoView({ block: 'start' }), 1`
	);
	await sleep(900);
}

async function shot(name) {
	const res = await send('Page.captureScreenshot', { format: 'png' });
	const file = `${OUT}/${name}.png`;
	fs.writeFileSync(file, Buffer.from(res.data, 'base64'));
	return file;
}

async function readAll() {
	const out = {};
	for (const p of probes) {
		await scrollTo(p.id);
		out[p.id] = await evaluate(READ_ENTRY(p.id));
	}
	return out;
}

let failures = 0;
function assert(ok, msg) {
	if (!ok) failures++;
	console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
}

(async () => {
	const url = await targetWs();
	ws = new WebSocket(url);
	ws.addEventListener('message', (ev) => {
		const msg = JSON.parse(ev.data);
		if (msg.id && pending.has(msg.id)) {
			const { resolve, reject } = pending.get(msg.id);
			pending.delete(msg.id);
			msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
			return;
		}
		if (msg.method === 'Runtime.exceptionThrown') {
			pageErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description ?? ''));
		}
		if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
			pageErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
		}
	});
	await new Promise((r) => ws.addEventListener('open', r, { once: true }));

	await send('Page.enable');
	await send('Runtime.enable');
	await send('Emulation.setDeviceMetricsOverride', {
		width: 1440,
		height: 1000,
		deviceScaleFactor: 1,
		mobile: false
	});

	await send('Page.navigate', { url: ORIGIN });
	await sleep(9000); /* SvelteKit hydrate + the whole chronicle mounting */

	const stored0 = await evaluate(`localStorage.getItem('kingdom:nsfw')`);
	console.log(`\nlocalStorage kingdom:nsfw at first load: ${JSON.stringify(stored0)}`);
	const on = await evaluate(`(() => {
		const b = document.querySelector('button.nsfw-toggle');
		return b ? { present: true, pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label') } : { present: false };
	})()`);
	console.log('toggle button:', JSON.stringify(on));
	assert(on.present && on.pressed === 'true', 'toggle defaults to Intimate scenes ON');

	console.log('\n————— STATE: Intimate ON —————');
	const before = await readAll();
	for (const p of probes) {
		const e = before[p.id];
		if (!e) {
			assert(false, `${p.label}: entry rendered`);
			continue;
		}
		const missing = p.hidden.filter((h) => !e.text.includes(h));
		assert(
			p.hidden.length > 0 && missing.length === 0,
			`${p.label}: all ${p.hidden.length} nsfw blocks visible with the toggle ON` +
				(missing.length ? ` — missing ${JSON.stringify(missing)}` : '')
		);
	}
	await scrollTo('iron-will-the-first-kim');
	console.log('screenshot ON:', await shot('first-kim-intimate-on'));

	/* flip it the way a reader does */
	await evaluate(`document.querySelector('button.nsfw-toggle').click(), 1`);
	await sleep(1500);
	const stored1 = await evaluate(`localStorage.getItem('kingdom:nsfw')`);
	assert(stored1 === '0', `click persisted kingdom:nsfw = ${JSON.stringify(stored1)} (expected "0")`);
	const off = await evaluate(
		`document.querySelector('button.nsfw-toggle').getAttribute('aria-pressed')`
	);
	assert(off === 'false', 'toggle reports Intimate scenes OFF');

	console.log('\n————— STATE: Intimate OFF —————');
	const after = await readAll();
	for (const p of probes) {
		const e = after[p.id];
		const b = before[p.id];
		if (!e || !b) continue;
		const leaked = p.hidden.filter((h) => e.text.includes(h));
		assert(leaked.length === 0, `${p.label}: nsfw prose gone` + (leaked.length ? ` — leaked ${JSON.stringify(leaked)}` : ''));

		/* Only phrases the ON state actually rendered can be "lost" — language
		   mode and `linkPeople` rewriting decide the rest, and a concurrent
		   edit to story.json can retire a line entirely. */
		const all = [...p.kept, ...p.spine];
		const renderedOn = all.filter((k) => b.text.includes(k));
		const notInDom = all.filter((k) => !b.text.includes(k));
		const lostSpine = renderedOn.filter((k) => !e.text.includes(k));
		assert(
			lostSpine.length === 0,
			`${p.label}: all ${renderedOn.length} non-nsfw phrases rendered with the toggle ON survive it going OFF` +
				(lostSpine.length ? ` — lost ${JSON.stringify(lostSpine)}` : '')
		);
		if (notInDom.length)
			console.log(
				`      note  ${p.label}: not in the DOM in either state (language mode / retired line): ${JSON.stringify(notInDom)}`
			);

		assert(e.emptyBlocks === 0, `${p.label}: no blank block left behind (${e.emptyBlocks})`);
		assert(
			e.punctOnly.length === 0,
			`${p.label}: no punctuation-only block left behind ${JSON.stringify(e.punctOnly)}`
		);
		assert(
			e.blockCount < b.blockCount,
			`${p.label}: block count dropped ${b.blockCount} → ${e.blockCount}`
		);
		if (p.nsfwImages === p.images && p.images > 0) {
			assert(
				e.imgCount < b.imgCount,
				`${p.label}: cue art hidden too (${b.imgCount} → ${e.imgCount} img)`
			);
		}
		const goneScenes = b.sceneIds.filter((s) => !e.sceneIds.includes(s));
		assert(
			goneScenes.length === 0,
			`${p.label}: scene anchors intact ${JSON.stringify(e.sceneIds)}` +
				(goneScenes.length ? ` — lost ${JSON.stringify(goneScenes)}` : '')
		);
	}
	await scrollTo('iron-will-the-first-kim');
	console.log('screenshot OFF:', await shot('first-kim-intimate-off'));
	await scrollTo('iron-will-daeya-fortress');
	console.log('screenshot Daeya STEAM OFF:', await shot('daeya-steam-intimate-off'));

	/* survives a reload — the loadShowIntimate path */
	await send('Page.navigate', { url: ORIGIN });
	await sleep(9000);
	const reloaded = await evaluate(
		`document.querySelector('button.nsfw-toggle')?.getAttribute('aria-pressed')`
	);
	assert(reloaded === 'false', 'preference restored as OFF after reload');
	const firstKimAfterReload = await (async () => {
		await scrollTo('iron-will-the-first-kim');
		return evaluate(READ_ENTRY('iron-will-the-first-kim'));
	})();
	const leakedReload = probes
		.find((p) => p.id === 'iron-will-the-first-kim')
		.hidden.filter((h) => firstKimAfterReload.text.includes(h));
	assert(leakedReload.length === 0, 'The First Kim: still sanitized after reload');

	/* back on, from the restored-off state */
	await evaluate(`document.querySelector('button.nsfw-toggle').click(), 1`);
	await sleep(1200);
	await scrollTo('iron-will-the-first-kim');
	const backOn = await evaluate(READ_ENTRY('iron-will-the-first-kim'));
	const p0 = probes.find((p) => p.id === 'iron-will-the-first-kim');
	assert(
		p0.hidden.every((h) => backOn.text.includes(h)),
		'The First Kim: toggling back ON restores every nsfw block'
	);
	assert(
		backOn.imgCount > firstKimAfterReload.imgCount,
		`The First Kim: cue art comes back (${firstKimAfterReload.imgCount} → ${backOn.imgCount} img)`
	);
	console.log('screenshot ON again:', await shot('first-kim-intimate-on-again'));

	/* ————— cinema mode: the rail must index the same blocks as the document —————
	   The rail maps clicks and the live-line highlight onto the reading document
	   by ordinal position, so a gate that filtered one and not the other would
	   light the wrong line. */
	console.log('\n————— cinema mode rail vs document —————');
	/* Cinema is deliberately not persisted (`reading.mode` starts at script every
	   load), so it has to be switched through the HUD the way a reader does. */
	await scrollTo('iron-will-the-first-kim');
	const switched = await evaluate(`(() => {
		document.querySelector('[aria-controls="hud-settings"]')?.click();
		const btns = [...document.querySelectorAll('[aria-label="Reading mode"] button')];
		const cinema = btns.find((b) => /cinema/i.test((b.textContent || '') + ' ' + (b.title || '')));
		if (!cinema) return { ok: false, buttons: btns.map((b) => (b.textContent || '').trim()) };
		cinema.click();
		return { ok: true, pressed: cinema.getAttribute('aria-pressed') };
	})()`);
	console.log('  mode switch:', JSON.stringify(switched));
	await sleep(2500);
	await scrollTo('iron-will-the-first-kim');
	await sleep(1500);

	for (const mode of ['on', 'off']) {
		const want = mode === 'on';
		const state = await evaluate(`(() => {
			const b = document.querySelector('button.nsfw-toggle');
			if ((b.getAttribute('aria-pressed') === 'true') !== ${want}) b.click();
			return b.getAttribute('aria-pressed');
		})()`);
		console.log(`  toggle now aria-pressed=${state}`);
		await sleep(1500);
		if (mode === 'on') {
			/* Put an explicit line on the stage plate by hand, so the flip to OFF
			   has something to strand. */
			const staged = await evaluate(`(() => {
				const art = document.querySelector('[data-story-id="iron-will-the-first-kim"]');
				const pick = [...art.querySelectorAll('.lines.pick')][0];
				pick?.click();
				return pick ? 1 : 0;
			})()`);
			await sleep(2500);
			console.log(`  staged a line by clicking it: ${staged === 1}`);
		}
		const cine = await evaluate(`(() => {
			const rail = document.querySelector('.script-list');
			const art = document.querySelector('[data-story-id="iron-will-the-first-kim"]');
			const prose = (r) => [...r.querySelectorAll('.prose > *')].filter((el) => !el.matches('.mini'));
			return {
				rail: rail ? prose(rail).length : -1,
				railSpeakers: rail ? rail.querySelectorAll('[data-speaker]').length : -1,
				doc: art ? prose(art).length : -1,
				docSpeakers: art ? art.querySelectorAll('[data-speaker]').length : -1,
				cinemaLive: document.documentElement.classList.contains('is-cinema'),
				panels: document.querySelectorAll('.stage img').length,
				plate: (document.querySelector('.dialogue-plate, .plate, .stage-dialogue')?.textContent ?? '')
					.replace(/\\s+/g, ' ')
					.trim()
					.slice(0, 160),
				stageText: (document.querySelector('.stage')?.textContent ?? '').replace(/\\s+/g, ' ').trim()
			};
		})()`);
		const { stageText, ...brief } = cine;
		console.log(`  intimate ${mode}: ${JSON.stringify(brief)}`);
		if (mode === 'off') {
			const probe = probes.find((p) => p.id === 'iron-will-the-first-kim');
			const onStage = probe.hidden.filter((h) => stageText.includes(h));
			assert(
				onStage.length === 0,
				`cinema: no hidden line left on the stage plate` +
					(onStage.length ? ` — still showing ${JSON.stringify(onStage)}` : '')
			);
		}
		assert(
			cine.rail > 0 && cine.rail === cine.doc,
			`cinema (intimate ${mode}): rail block count matches the document (${cine.rail} vs ${cine.doc})`
		);
		assert(
			cine.railSpeakers === cine.docSpeakers,
			`cinema (intimate ${mode}): rail speaker lines match the document (${cine.railSpeakers} vs ${cine.docSpeakers})`
		);
		console.log(`  screenshot: ${await shot(`cinema-intimate-${mode}`)}`);
	}
	await evaluate(`localStorage.removeItem('kingdom:mode'), 1`);

	console.log(`\npage errors captured: ${pageErrors.length}`);
	for (const e of pageErrors.slice(0, 12)) console.log('  !', e.slice(0, 220));
	console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);

	ws.close();
	chrome.kill();
	process.exit(failures === 0 ? 0 : 1);
})().catch(async (err) => {
	console.error('harness error:', err);
	try {
		chrome.kill();
	} catch {
		/* already gone */
	}
	process.exit(2);
});
