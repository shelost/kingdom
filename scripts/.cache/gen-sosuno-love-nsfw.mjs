#!/usr/bin/env node
/**
 * Sequential Fal NSFW gens for Sosuno cinema pass.
 * Single-face IP-Adapter. --no-suffix. Short prompts.
 * On failure, logs and continues (caller deletes bare slots).
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const log = [];

const jobs = [
	{
		id: 'nsfw-sosuno-loft-spread',
		ref: 'static/ch_sosuno.png',
		prompt:
			'score_9, 1girl, Korean woman, black pupils dark irises, sitting loft timber legs spread wide, hiked dusty-rose chima, heavy blush, masturbation, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-loft-fingers',
		ref: 'static/ch_sosuno.png',
		prompt:
			'score_9, 1girl, Korean woman, black pupils, fingers in pussy, hiked skirt, legs open, heavy blush, timber loft, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-queen-slut',
		ref: 'static/ch_sosuno_queen.png',
		prompt:
			'score_9, 1girl riding, reverse cowgirl, Korean woman, black pupils, ass to camera, grinding, dusty-rose fallen, grain timber, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-only-mine',
		ref: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, ECU Korean woman face, black pupils dark irises, open mouth drool heavy blush, dusty-rose, grain shadow, manhwa, no text'
	},
	{
		id: 'nsfw-grain-ots-her-back',
		ref: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, from behind, 1girl naked, Korean woman looking over shoulder, black pupils, arched back, ass, riding, grain sacks, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-jealous-heat',
		ref: 'static/ch_sosuno.png',
		prompt:
			'score_9, 1girl pinning against timber, Korean woman, black pupils, hiked dusty-rose, heavy blush open mouth, intimate, manhwa, no text'
	},
	{
		id: 'nsfw-royal-queen-ass',
		ref: 'static/ch_sosuno_queen.png',
		prompt:
			'score_9, from behind, 1girl naked ass filling frame, Korean queen look over shoulder, black pupils, grain lamp, manhwa, no text'
	},
	{
		id: 'nsfw-royal-grind',
		ref: 'static/ch_sosuno_queen.png',
		prompt:
			'score_9, 1girl grinding naked, Korean woman, black pupils, ass grind, grain room, manhwa, no text'
	},
	{
		id: 'nsfw-royal-naked-pose',
		ref: 'static/ch_sosuno_queen.png',
		prompt:
			'score_9, 1girl fully naked kneeling on sacks, Korean queen, black pupils, sexy pose, heavy blush, grain lamp, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-grind-fit',
		ref: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, 1girl grinding, tight fit, Korean woman, black pupils, hiked dusty-rose, grain sacks, manhwa, no text'
	},
	{
		id: 'nsfw-jumong-pov-her-back',
		ref: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, from behind 1girl naked back, Korean woman look over shoulder, black pupils, grain, manhwa, no text'
	},
	{
		id: 'nsfw-royal-queen-back-h',
		ref: 'static/ch_sosuno_queen.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, from behind 1girl naked back, Korean queen, look over shoulder, black pupils, grain lamp, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-creampie-drip',
		ref: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, 1girl aftermath, cum on thighs, Korean woman, black pupils, wrecked blush, grain, manhwa, no text'
	},
	{
		id: 'nsfw-sosuno-pov-his-back',
		ref: 'static/ch_jumong.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, male naked muscular back filling frame, Korean man, grain lamp, manhwa, no text'
	},
	{
		id: 'nsfw-grain-ots-his-back',
		ref: 'static/ch_jumong.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, male naked back, Korean man, grain loft, manhwa, no text'
	}
];

function runOne(job) {
	return new Promise((res) => {
		const args = [
			'scripts/generate-nsfw.mjs',
			'--id',
			job.id,
			'--no-suffix',
			'--prompt',
			job.prompt,
			'--ref',
			job.ref,
			'--face-scale',
			'0.55'
		];
		if (job.w) args.push('--w', job.w, '--h', job.h);
		console.log('\n===', job.id, '===');
		const child = spawn(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
		child.on('close', (code) => {
			log.push({ id: job.id, ok: code === 0, code });
			res(code === 0);
		});
	});
}

const ok = [];
const fail = [];
for (const job of jobs) {
	const good = await runOne(job);
	if (good) ok.push(job.id);
	else fail.push(job.id);
}

writeFileSync(
	resolve(ROOT, 'scripts/.cache/sosuno-love-nsfw-log.json'),
	JSON.stringify({ ok, fail, log }, null, 2)
);
console.log('\nOK', ok.join(', ') || '(none)');
console.log('FAIL', fail.join(', ') || '(none)');
