#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const jobs = [
	{
		id: 'nsfw-sosuno-loft-spread',
		face: 'static/ch_sosuno.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, explicit, 1girl, solo, sitting on wood, legs spread, hiked skirt, heavy blush, black pupils, manhwa, loft timber'
	},
	{
		id: 'nsfw-sosuno-loft-fingers',
		face: 'static/ch_sosuno.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, explicit, 1girl, solo, hand under skirt, legs open, heavy blush, black pupils, wood loft, manhwa'
	},
	{
		id: 'nsfw-sosuno-queen-slut',
		face: 'static/ch_sosuno_queen.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, explicit, 1girl, from behind, looking back, riding, silk fallen, heavy blush, black pupils, grain timber, manhwa'
	},
	{
		id: 'nsfw-grain-ots-her-back',
		face: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, score_8_up, explicit, 1girl, from behind, looking over shoulder, silk at hips, arched back, grain sacks, black pupils, manhwa'
	},
	{
		id: 'nsfw-sosuno-jealous-heat',
		face: 'static/ch_sosuno.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, 1girl, close up, hiked skirt, heavy blush, open mouth, black pupils, timber, manhwa'
	},
	{
		id: 'nsfw-royal-queen-ass',
		face: 'static/ch_sosuno_queen.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, explicit, 1girl, from behind, looking over shoulder, silk at waist, grain lamp, black pupils, manhwa'
	},
	{
		id: 'nsfw-royal-grind',
		face: 'static/ch_sosuno_queen.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, explicit, 1girl, riding, looking back, silk down, grain room, black pupils, manhwa'
	},
	{
		id: 'nsfw-royal-naked-pose',
		face: 'static/ch_sosuno_queen.png',
		w: '832',
		h: '1216',
		prompt:
			'score_9, score_8_up, 1girl, kneeling on sacks, silk down, sexy pose, heavy blush, black pupils, grain lamp, manhwa'
	},
	{
		id: 'nsfw-jumong-pov-her-back',
		face: 'static/ch_sosuno.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, score_8_up, 1girl, from behind, looking over shoulder, silk at hips, grain, black pupils, manhwa'
	},
	{
		id: 'nsfw-sosuno-pov-his-back',
		face: 'static/ch_jumong.png',
		w: '1216',
		h: '832',
		prompt:
			'score_9, score_8_up, 1boy, shirtless, muscular back, grain lamp, manhwa'
	}
];

function runOne(job) {
	return new Promise((res) => {
		const args = [
			'scripts/generate-nsfw-pony-swap.mjs',
			'--id',
			job.id,
			'--prompt',
			job.prompt,
			'--face',
			job.face,
			'--w',
			job.w,
			'--h',
			job.h
		];
		console.log('\n=== SWAP', job.id, '===');
		const child = spawn(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
		child.on('close', (code) => res(code === 0));
	});
}

const ok = [];
const fail = [];
for (const job of jobs) {
	const good = await runOne(job);
	(good ? ok : fail).push(job.id);
}
writeFileSync(
	resolve(ROOT, 'scripts/.cache/sosuno-love-swap-log.json'),
	JSON.stringify({ ok, fail }, null, 2)
);
console.log('\nSWAP OK', ok.join(', ') || '(none)');
console.log('SWAP FAIL', fail.join(', ') || '(none)');
