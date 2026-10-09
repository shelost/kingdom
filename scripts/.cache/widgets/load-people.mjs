// Bundle src/lib/people.ts (+ ranks.ts) for node scripts: `const { PEOPLE, byId, rankOf } = await loadPeople()`.
import { build } from 'esbuild';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..');

export async function loadPeople({ ranks = true } = {}) {
	const out = path.join(ROOT, 'scripts/.cache/widgets/.people.bundle.mjs');
	await build({
		stdin: {
			contents: `export * from '$lib/people';` + (ranks ? ` export * from '$lib/ranks';` : ''),
			resolveDir: ROOT,
			loader: 'ts'
		},
		bundle: true,
		format: 'esm',
		platform: 'node',
		outfile: out,
		logLevel: 'error',
		plugins: [
			{
				name: 'lib',
				setup(b) {
					b.onResolve({ filter: /staticAsset\.svelte$/ }, () => ({ path: 'static', namespace: 'stub' }));
					b.onResolve({ filter: /^\$app\// }, () => ({ path: 'app', namespace: 'stub' }));
					b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
						contents: 'export const staticAsset = (p) => p ?? null; export const staticAssetCache = {}; export default {};',
						loader: 'js'
					}));
					b.onResolve({ filter: /^\$lib\// }, async (a) => {
						const rel = a.path.slice(5);
						for (const ext of ['.ts', '.svelte.ts', '.json', '/index.ts', ''])
							try {
								const p = path.join(ROOT, 'src/lib', rel + ext);
								await import('node:fs').then((fs) => fs.promises.access(p));
								if (!p.endsWith('/') ) return { path: p };
							} catch {}
						return undefined;
					});
				}
			}
		]
	});
	return import(out + '?t=' + Date.now());
}
