import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { chronicleHmrSkipArmed } from './src/lib/server/chronicleHmr.ts';

const STORY = path.resolve('src/lib/data/story.json');
const PEOPLE = path.resolve('src/lib/data/image-people.json');
const INVENTORY = path.resolve('src/lib/tempArtInventory.ts');
const SCENES = path.resolve('src/lib/scenes.ts');
const VIRTUAL = '\0compact-story-json';

/** Same heuristic as `isNsfwCueImage` — bake flags when stripping prompts. */
const NSFW_HINT =
	/skin-forward|close hungry kiss|passionate kiss|robe (off|slipping|open on the chest)|bare (shoulder|chest|back|buttock|ass|thigh)|mouths almost touching|mouth at .{0,40}throat|wet (white )?jeogori|openly sexual|overwhelmed with (lust|desire)|grabbing .{0,80}(ass|hip|buttock)/i;

function isChroniclePersist(file: string): boolean {
	const n = path.normalize(file);
	return (
		n === path.normalize(STORY) ||
		n === path.normalize(PEOPLE) ||
		n === path.normalize(INVENTORY) ||
		n === path.normalize(SCENES)
	);
}

/**
 * Runtime chronicle never needs Midjourney prompts (~16MB) or generation refs.
 * Strip them always so Vite SSR `fetchModule` stays under the 60s transport
 * timeout. /grade loads prompts from disk via its `+page.server.ts`.
 */
function slimStoryForClient(data: unknown): unknown {
	const walk = (node: unknown): unknown => {
		if (Array.isArray(node)) return node.map(walk);
		if (!node || typeof node !== 'object') return node;
		const src = node as Record<string, unknown>;
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(src)) {
			if (k === 'prompt' || k === 'refs' || k === 'canon') continue;
			out[k] = walk(v);
		}
		if (typeof src.id === 'string' && ('ratio' in src || 'tempImage' in src || 'at' in src)) {
			if (!out.nsfw) {
				const blob = `${typeof src.prompt === 'string' ? src.prompt : ''} ${typeof src.alt === 'string' ? src.alt : ''}`;
				if (NSFW_HINT.test(blob)) out.nsfw = true;
			}
		}
		return out;
	};
	return walk(data);
}

/**
 * story.json is a multi‑MB pretty-printed chronicle. Vite’s default JSON
 * transform inlines a sourcemap of the whole file, which makes
 * `fetchModule` / HMR time out. Serve a slim object literal from a virtual
 * id so the JSON plugin never wraps it a second time.
 */
export function compactStoryJson(): Plugin {
	let cachedCode: string | null = null;
	let cachedMtime = 0;

	function build(): string {
		const raw = JSON.parse(fs.readFileSync(STORY, 'utf8'));
		const compact = JSON.stringify(slimStoryForClient(raw));
		// Object literal, not a JSON.parse(string) — half the payload, faster SSR.
		return `export default ${compact}`;
	}

	return {
		name: 'compact-story-json',
		enforce: 'pre',
		resolveId(source, importer) {
			const bare = source.split('?')[0];
			if (!bare.endsWith('story.json')) return;
			const resolved = importer
				? path.resolve(path.dirname(importer.split('?')[0]), bare)
				: path.resolve(bare);
			if (path.normalize(resolved) === path.normalize(STORY)) return VIRTUAL;
			if (bare.replaceAll('\\', '/').endsWith('src/lib/data/story.json')) return VIRTUAL;
		},
		load(id) {
			if (id !== VIRTUAL) return;
			const mtime = fs.statSync(STORY).mtimeMs;
			if (cachedCode && cachedMtime === mtime) {
				return {
					code: cachedCode,
					map: { version: 3, sources: [], names: [], mappings: '' }
				};
			}
			cachedCode = build();
			cachedMtime = mtime;
			return {
				code: cachedCode,
				// Empty map: Vite otherwise inlines sourcesContent of the whole
				// chronicle and HMR fetchModule times out.
				map: { version: 3, sources: [], names: [], mappings: '' }
			};
		},
		handleHotUpdate({ file, server }) {
			/* The virtual module is never the watched file, so it must be invalidated
			   by hand on every write or the next page load serves the old chronicle. */
			const mod =
				path.normalize(file) === path.normalize(STORY)
					? server.moduleGraph.getModuleById(VIRTUAL)
					: undefined;
			if (mod) {
				cachedCode = null;
				cachedMtime = 0;
				server.moduleGraph.invalidateModule(mod);
			}
			/* Edit-mode saves already patched client state. Pushing the update
			   remounts the page and jumps to top. */
			if (isChroniclePersist(file) && chronicleHmrSkipArmed()) return [];
			if (mod) return [...mod.importers];
		}
	};
}
