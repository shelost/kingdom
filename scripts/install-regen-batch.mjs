// Install generated PNGs from Cursor assets into static/temp as JPEGs,
// remove those ids from seededTempArt.ts, update regen-done/queue.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP_DIR = 'static/temp';
const ids = process.argv.slice(2);
if (!ids.length) {
	console.error('usage: node scripts/install-regen-batch.mjs <id>...');
	process.exit(1);
}

const installed = [];
for (const id of ids) {
	const source = path.join(ASSETS, `${id}.png`);
	if (!fs.existsSync(source)) {
		console.log('missing', id);
		continue;
	}
	const out = path.join(TEMP_DIR, `${id}.jpg`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', source, '--out', out],
		{ stdio: 'ignore' }
	);
	fs.rmSync(source);
	installed.push(id);
	console.log('installed', id, `${Math.round(fs.statSync(out).size / 1024)}KB`);
}

if (installed.length) {
	const seededPath = 'src/lib/seededTempArt.ts';
	let body = fs.readFileSync(seededPath, 'utf8');
	for (const id of installed) body = body.replace(new RegExp(`\\t'${id}',\\n`), '');
	fs.writeFileSync(seededPath, body);

	const donePath = 'scripts/.cache/regen-done.json';
	let done = [];
	try {
		done = JSON.parse(fs.readFileSync(donePath, 'utf8'));
	} catch {}
	for (const id of installed) if (!done.includes(id)) done.push(id);
	fs.writeFileSync(donePath, JSON.stringify(done, null, 2));

	const queuePath = 'scripts/.cache/regen-queue.json';
	const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
	fs.writeFileSync(queuePath, JSON.stringify(queue.filter((s) => !done.includes(s.id)), null, 2));

	execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
}
console.log(`batch ok: ${installed.length}; total done will be in regen-done.json`);
