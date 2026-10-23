/**
 * Plain-language summaries for script view's scene card.
 *
 *   npx tsx --tsconfig .svelte-kit/tsconfig.json scripts/scene-summaries.mjs [--force] [episodeId…]
 *
 * One model call per episode writes `src/lib/data/scene-summaries.json`, keyed like
 * `summarySections` (episode id for the opening, scene id after that). A section
 * whose text hash is unchanged keeps its summary, so a re-run only pays for edits.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { chapters, entryId } from '../src/lib/story.ts';
import { summarySections, sectionText } from '../src/lib/sceneSummary.ts';

const OUT = 'src/lib/data/scene-summaries.json';
const MODEL = process.env.SUMMARY_MODEL || 'gpt-4.1';
const CONCURRENCY = 6;

try {
	process.loadEnvFile('.env');
} catch {
	/* keys may already be in the environment */
}
/** OpenAI first; OpenRouter (same wire format) when OpenAI is out of credit or refuses the key. */
const PROVIDERS = [
	process.env.OPENAI_API_KEY?.trim() && {
		url: 'https://api.openai.com/v1/chat/completions',
		key: process.env.OPENAI_API_KEY.trim(),
		model: MODEL
	},
	process.env.OPENROUTER_API_KEY?.trim() && {
		url: 'https://openrouter.ai/api/v1/chat/completions',
		key: process.env.OPENROUTER_API_KEY.trim(),
		model: `openai/${MODEL}`
	}
].filter(Boolean);
if (!PROVIDERS.length) throw new Error('Set OPENAI_API_KEY or OPENROUTER_API_KEY');
const FALL_THROUGH = new Set([401, 402, 403, 429]);

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = new Set(args.filter((a) => !a.startsWith('--')));

const store = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
/** people.ts imports a runes module, so read profile names from its source instead. */
const NAMES = new Map(
	fs
		.readFileSync('src/lib/people.ts', 'utf8')
		.split(/\n\t\tid: '/)
		.slice(1)
		.map((chunk) => [chunk.slice(0, chunk.indexOf("'")), chunk.match(/\n\t\tname: ['"](.+?)['"],/)?.[1]])
		.filter(([, name]) => name)
);
const nameOf = (id) => NAMES.get(id) ?? id;
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

const SYSTEM = `You write the scene guide that sits beside a historical drama set in 7th-century Korea (Silla, Baekje, Goguryeo, Gaya, Tang China).
For each section you get, write what is happening in SIMPLE, PLAIN language for a reader who may be lost: who is there, what they are doing or arguing about, and why it matters right now.
Rules:
- One or two short sentences, at most 35 words in English. Present tense.
- Everyday words. No poetry, no metaphors, no em dashes, no quotes from the script.
- Use the names the section uses. Briefly say who someone is the first time if the section makes it clear (e.g. "Yushin, the Silla general").
- Only what happens in that section. Never reveal what happens later.
- No years, no dates, no regnal numbers.
- Korean: the same meaning in natural, plain written Korean (평서체 -다), not a word-for-word translation. Use the Korean names the script uses.
Return JSON: {"sections":[{"key":"…","en":"…","ko":"…"}]} with one item per input section, same keys, same order.`;

async function summarize(entry, eid, sections) {
	const body = sections
		.map((s) => `### key: ${s.key}${s.title ? `\nScene: ${s.title}` : '\nScene: (opening)'}\n${s.text}`)
		.join('\n\n');
	let last = '';
	for (const p of PROVIDERS) {
		const res = await fetch(p.url, {
			method: 'POST',
			headers: { authorization: `Bearer ${p.key}`, 'content-type': 'application/json' },
			body: JSON.stringify({
				model: p.model,
				temperature: 0.3,
				response_format: { type: 'json_object' },
				messages: [
					{ role: 'system', content: SYSTEM },
					{ role: 'user', content: `Episode: ${entry.title} (${entry.year})\n\n${body}` }
				]
			})
		});
		if (res.ok) {
			const data = await res.json();
			return JSON.parse(data.choices[0].message.content).sections ?? [];
		}
		last = `${res.status} ${(await res.text()).slice(0, 200)}`;
		if (!FALL_THROUGH.has(res.status)) break;
	}
	throw new Error(`${eid}: ${last}`);
}

const jobs = [];
for (const ch of chapters) {
	for (const entry of ch.entries) {
		const eid = entryId(ch.id, entry.title);
		if (only.size && !only.has(eid)) continue;
		const sections = summarySections(entry.blocks, eid)
			.map((s) => ({ ...s, text: sectionText(s.blocks, nameOf) }))
			.filter((s) => s.text.length > 0)
			.map((s) => ({ ...s, h: hash(s.text) }));
		const stale = sections.filter((s) => force || store[s.key]?.h !== s.h);
		if (stale.length) jobs.push({ entry, eid, sections: stale });
	}
}

console.log(`${jobs.length} episodes to summarize (${jobs.reduce((n, j) => n + j.sections.length, 0)} sections)`);

let done = 0;
const failed = [];
async function worker() {
	while (jobs.length) {
		const job = jobs.shift();
		try {
			const out = await summarize(job.entry, job.eid, job.sections);
			const byKey = new Map(out.map((o) => [o.key, o]));
			for (const s of job.sections) {
				const o = byKey.get(s.key);
				if (o?.en && o?.ko) store[s.key] = { en: o.en.trim(), ko: o.ko.trim(), h: s.h };
				else failed.push(s.key);
			}
			fs.writeFileSync(OUT, JSON.stringify(store, null, '\t') + '\n');
			console.log(`${++done} ${job.eid} · ${job.sections.length}`);
		} catch (e) {
			failed.push(job.eid);
			console.error(String(e));
		}
	}
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
if (failed.length) console.log(`missing: ${failed.join(', ')}`);
