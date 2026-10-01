/**
 * Keep production deploys from shipping orphan stand-in art under static/temp/.
 *
 * - Writes a managed block into `.vercelignore` for every temp file that nothing
 *   in story / image-people / people art references, and that no `/temp/…`
 *   literal in `src/` code names (the /scenes feed, animals) — same key rules
 *   as `artAttachmentKey` in storyImages.ts.
 * - Rebuilds `tempArtInventory.ts` from **referenced** on-disk files only, so
 *   the client never points at a path excluded from deploy.
 *
 * Local `static/temp/` is left intact (re-attach / regen still works).
 * Future installs: run after `install-temp-art.mjs` (it already syncs inventory;
 * call this from `prebuild` so deploys stay lean).
 *
 * Usage: node scripts/sync-temp-deploy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TEMP_DIR = path.join(ROOT, 'static/temp');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const IMAGE_PEOPLE = path.join(ROOT, 'src/lib/data/image-people.json');
const PEOPLE_TS = path.join(ROOT, 'src/lib/people.ts');
const SRC = path.join(ROOT, 'src');
const VERCELIGNORE = path.join(ROOT, '.vercelignore');
const INVENTORY = path.join(ROOT, 'src/lib/tempArtInventory.ts');

const BEGIN = '# --- generated: unreferenced static/temp (scripts/sync-temp-deploy.mjs) ---';
const END = '# --- end generated: unreferenced static/temp ---';

function artAttachmentKey(pathOrId) {
	const raw = String(pathOrId).trim().split('?')[0] ?? '';
	if (!raw) return '';
	const base = raw.split('/').pop() ?? raw;
	return base.replace(/\.[^.]+$/i, '').replace(/_/g, '-').toLowerCase();
}

function addArtKey(keys, value) {
	if (!value) return;
	const key = artAttachmentKey(value);
	if (key) keys.add(key);
}

function referencedKeys() {
	const keys = new Set();
	const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
	for (const ch of story) {
		for (const entry of ch.entries ?? []) {
			for (const slot of entry.images ?? []) {
				addArtKey(keys, slot.id);
				addArtKey(keys, slot.src);
				addArtKey(keys, slot.tempImage);
				for (const ref of slot.refs ?? []) addArtKey(keys, ref);
			}
		}
	}

	const peopleMap = JSON.parse(fs.readFileSync(IMAGE_PEOPLE, 'utf8'));
	for (const slotId of Object.keys(peopleMap)) addArtKey(keys, slotId);

	const peopleSrc = fs.readFileSync(PEOPLE_TS, 'utf8');
	for (const m of peopleSrc.matchAll(/['"](\/temp\/[^'"]+)['"]/g)) addArtKey(keys, m[1]);
	for (const m of peopleSrc.matchAll(
		/\b(?:avatar|poster|photo|binyeoImage|swordImage|objectImage)\s*:\s*['"]([^'"]+)['"]/g
	)) {
		addArtKey(keys, m[1]);
	}

	for (const file of sourceFiles(SRC)) {
		for (const m of fs.readFileSync(file, 'utf8').matchAll(/['"`](\/temp\/[^'"`$]+)['"`]/g)) {
			addArtKey(keys, m[1]);
		}
	}

	return keys;
}

/** Code under src/ that can point the client at temp art. The inventory is
 *  skipped: it is built from this result, so reading it would keep every
 *  orphan alive. */
function sourceFiles(dir) {
	const out = [];
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, ent.name);
		if (ent.isDirectory()) out.push(...sourceFiles(p));
		else if (/\.(ts|js|svelte)$/.test(ent.name) && p !== INVENTORY) out.push(p);
	}
	return out;
}

function listTempFiles() {
	if (!fs.existsSync(TEMP_DIR)) return [];
	return fs
		.readdirSync(TEMP_DIR)
		.filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
		.sort();
}

function writeInventory(files) {
	const body = [
		'/**',
		' * Build-time inventory of stand-in art under `static/temp/`.',
		' * Only files referenced by the chronicle (story / people / image-people) or src/ code.',
		' * Regenerate: `node scripts/sync-temp-deploy.mjs` (or sync-temp-art-inventory.mjs).',
		' */',
		'',
		'/** slot id → public URL (`/temp/{file}`) */',
		'export const TEMP_ART_BY_ID: ReadonlyMap<string, string> = new Map([',
		...files.map((f) => {
			const id = f.replace(/\.[^.]+$/, '');
			return `\t['${id}', '/temp/${f}'],`;
		}),
		']);',
		'',
		'export function tempArtPath(id: string): string | undefined {',
		'\treturn TEMP_ART_BY_ID.get(id);',
		'}',
		''
	].join('\n');
	fs.writeFileSync(INVENTORY, body);
}

function patchVercelIgnore(orphanPaths) {
	const block = [BEGIN, ...orphanPaths.map((p) => p.replaceAll('\\', '/')), END].join('\n');
	let text = fs.existsSync(VERCELIGNORE) ? fs.readFileSync(VERCELIGNORE, 'utf8') : '';
	const start = text.indexOf(BEGIN);
	const end = text.indexOf(END);
	if (start !== -1 && end !== -1 && end > start) {
		text = `${text.slice(0, start).replace(/\n+$/, '\n')}${block}\n${text.slice(end + END.length).replace(/^\n+/, '')}`;
	} else {
		text = `${text.replace(/\n+$/, '')}\n\n${block}\n`;
	}
	fs.writeFileSync(VERCELIGNORE, text.replace(/\n{3,}/g, '\n\n'));
}

const attached = referencedKeys();
const all = listTempFiles();
const kept = [];
const orphans = [];
for (const f of all) {
	const key = artAttachmentKey(f);
	if (key && attached.has(key)) kept.push(f);
	else orphans.push(f);
}

writeInventory(kept);
patchVercelIgnore(orphans.map((f) => `static/temp/${f}`));

const orphanBytes = orphans.reduce((n, f) => n + fs.statSync(path.join(TEMP_DIR, f)).size, 0);
console.log(
	`temp deploy: keep ${kept.length} · ignore ${orphans.length} (${(orphanBytes / 1e6).toFixed(1)} MB) → inventory + .vercelignore`
);
