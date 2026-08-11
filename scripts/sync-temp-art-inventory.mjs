// Rebuilds src/lib/tempArtInventory.ts from files present in static/temp/.
import fs from 'node:fs';
import path from 'node:path';

const TEMP_DIR = 'static/temp';
const OUT = 'src/lib/tempArtInventory.ts';

const files = fs
	.readdirSync(TEMP_DIR)
	.filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
	.sort();

const body = [
	'/**',
	' * Build-time inventory of stand-in art under `static/temp/`.',
	' * Used when a cue slot has no `src` / `tempImage` but a file exists by id.',
	' * Regenerate: `node scripts/sync-temp-art-inventory.mjs`',
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

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, body);
console.log(`wrote ${files.length} temp art entries → ${OUT}`);
