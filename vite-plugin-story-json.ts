import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { chronicleHmrSkipArmed } from './src/lib/server/chronicleHmr.ts';

const STORY = path.resolve('src/lib/data/story.json');
const PEOPLE = path.resolve('src/lib/data/image-people.json');
const INVENTORY = path.resolve('src/lib/tempArtInventory.ts');
const VIRTUAL = '\0compact-story-json';

function isChroniclePersist(file: string): boolean {
	const n = path.normalize(file);
	return (
		n === path.normalize(STORY) || n === path.normalize(PEOPLE) || n === path.normalize(INVENTORY)
	);
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
			const compact = JSON.stringify(JSON.parse(fs.readFileSync(STORY, 'utf8')));
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
