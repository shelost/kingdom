import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const STORY = path.resolve('src/lib/data/story.json');
const VIRTUAL = '\0compact-story-json';

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
			if (path.normalize(file) !== path.normalize(STORY)) return;
			const mod = server.moduleGraph.getModuleById(VIRTUAL);
			if (!mod) return;
			server.moduleGraph.invalidateModule(mod);
			return [...mod.importers];
		}
	};
}
