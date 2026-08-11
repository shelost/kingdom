/**
 * Throwaway stand-in for the OpenAI speech endpoint, so /api/tts and the
 * browser player can be exercised end to end without a key or a bill.
 *
 * Speaks the request's `input` with macOS `say` (Korean voice for Hangul), and
 * counts calls so caching and request-dedupe can be proven from the outside.
 *
 *   node scripts/tts-stub.mjs 5199
 *   OPENAI_API_KEY=sk-stub OPENAI_TTS_ENDPOINT=http://127.0.0.1:5199/v1/audio/speech npm run dev
 */
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = Number(process.argv[2] ?? 5199);
let calls = 0;

const run = (cmd, args) =>
	new Promise((resolve, reject) =>
		execFile(cmd, args, (err) => (err ? reject(err) : resolve()))
	);

const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

async function speak(text) {
	const out = join(tmpdir(), `tts-stub-${Date.now()}-${Math.random().toString(36).slice(2)}.m4a`);
	const voice = HANGUL.test(text) ? 'Yuna' : 'Samantha';
	await run('/usr/bin/say', ['-v', voice, '-o', out, '--data-format=aac', text]);
	try {
		return await readFile(out);
	} finally {
		await unlink(out).catch(() => {});
	}
}

createServer((req, res) => {
	if (req.url === '/calls') {
		res.writeHead(200, { 'content-type': 'application/json' });
		res.end(JSON.stringify({ calls }));
		return;
	}

	let body = '';
	req.on('data', (chunk) => (body += chunk));
	req.on('end', async () => {
		calls += 1;
		let input = '';
		try {
			input = JSON.parse(body).input ?? '';
		} catch {
			/* leave empty — the error below says enough */
		}
		console.log(`call ${calls}: ${input.slice(0, 90)}`);
		try {
			const audio = await speak(input || 'nothing to say');
			res.writeHead(200, { 'content-type': 'audio/mpeg' });
			res.end(audio);
		} catch (e) {
			res.writeHead(500, { 'content-type': 'application/json' });
			res.end(JSON.stringify({ error: { message: String(e) } }));
		}
	});
}).listen(port, () => console.log(`tts stub on ${port}`));
