import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { chronicleHmrSkipArmed } from './src/lib/server/chronicleHmr.ts';

const STORY = path.resolve('src/lib/data/story.json');
const PEOPLE = path.resolve('src/lib/data/image-people.json');
const INVENTORY = path.resolve('src/lib/tempArtInventory.ts');
const VIRTUAL = '\0compact-story-json';

/** Same heuristic as `isNsfwCueImage` — bake flags when stripping prompts in prod. */
const NSFW_HINT =
	/skin-forward|close hungry kiss|passionate kiss|robe (off|slipping|open on the chest)|bare (shoulder|chest|back|buttock|ass|thigh)|mouths almost touching|mouth at .{0,40}throat|wet (white )?jeogori|openly sexual|overwhelmed with (lust|desire)|grabbing .{0,80}(ass|hip|buttock)/i;

function isChroniclePersist(file: string): boolean {
	const n = path.normalize(file);
	return (
		n === path.normalize(STORY) || n === path.normalize(PEOPLE) || n === path.normalize(INVENTORY)
	);
}

/**
 * Production reader never needs Midjourney prompts (~0.5MB). Keep them in
 * dev so /grade and empty-slot copy still work. Bake NSFW from prompt text
 * onto the few slots that only had the heuristic.
 */
function slimStoryForClient(data: unknown, stripPrompts: boolean): unknown {
	if (!stripPrompts) return data;
	const walk = (node: unknown): unknown => {
		if (Array.isArray(node)) return node.map(walk);
		if (!node || typeof node !== 'object') return node;
		const src = node as Record<string, unknown>;
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(src)) {
			if (k === 'prompt') continue;
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
 * story.json is a 1.2MB pretty-printed chronicle. Vite’s default JSON
 * transform inlines a sourcemap of the whole file (~10MB), which makes
 * `fetchModule` / HMR time out. Serve a compact `JSON.parse(...)` from a
 * virtual id so the JSON plugin never wraps it a second time.
 */
export function compactStoryJson(): Plugin {
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
			const raw = JSON.parse(fs.readFileSync(STORY, 'utf8'));
			const stripPrompts = process.env.NODE_ENV === 'production';
			const compact = JSON.stringify(slimStoryForClient(raw, stripPrompts));
			return {
				code: `export default JSON.parse(${JSON.stringify(compact)})`,
				// Empty map: Vite otherwise inlines sourcesContent of the whole
				// chronicle (~5MB) and HMR fetchModule times out.
				map: { version: 3, sources: [], names: [], mappings: '' }
			};
		},
		handleHotUpdate({ file, server }) {
			/* Edit-mode cue delete already patched client state. Reloading
			   story.json / inventory remounts the chronicle and jumps to top. */
			if (isChroniclePersist(file) && chronicleHmrSkipArmed()) return [];
			if (path.normalize(file) !== path.normalize(STORY)) return;
			const mod = server.moduleGraph.getModuleById(VIRTUAL);
			if (!mod) return;
			server.moduleGraph.invalidateModule(mod);
			return [...mod.importers];
		}
	};
}
