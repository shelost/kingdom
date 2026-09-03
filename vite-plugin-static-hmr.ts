import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { Plugin } from 'vite';

const STATIC_ROOT = path.resolve('static');
const IMAGE_RE = /\.(png|jpe?g|webp|gif|svg|ico)$/i;
const require = createRequire(import.meta.url);
const VITE_DIR = path.dirname(require.resolve('vite/package.json'));
const VITE_CLIENT = path.join(VITE_DIR, 'dist/client/client.mjs');
const VITE_ENV = path.join(VITE_DIR, 'dist/client/env.mjs');

/** Notify the client when static art changes so image URLs can re-bust. */
export function staticAssetHmr(): Plugin {
	return {
		name: 'static-asset-hmr',
		config(_config, { command: _command }) {
			return {
				define: {
					'import.meta.env.VITE_STATIC_ASSET_REV': JSON.stringify(String(Date.now()))
				}
			};
		},
		configureServer(server) {
			const notify = (file: string) => {
				if (!file.startsWith(STATIC_ROOT) || !IMAGE_RE.test(file)) return;
				server.ws.send({ type: 'custom', event: 'static-asset-change', data: { file } });
			};

			server.watcher.add(STATIC_ROOT);
			server.watcher.on('change', notify);
			server.watcher.on('add', notify);
			server.watcher.on('unlink', notify);

			/**
			 * Vite 8 + SvelteKit: `/@vite/client` can fall through to Kit's
			 * terminal SSR catch-all (HTML 404). Hydration never starts, so
			 * script-mode inline cue art never mounts. Insert a handler
			 * immediately before that catch-all (this plugin's post-hook must
			 * run after `sveltekit()`).
			 */
			return () => {
				const handler = async (
					req: { url?: string },
					res: {
						setHeader: (k: string, v: string) => void;
						end: (body: string | Buffer) => void;
					},
					next: () => void
				) => {
					const url = req.url?.split('?')[0];
					if (url !== '/@vite/client' && url !== '/@vite/env') {
						next();
						return;
					}
					try {
						const transformed = await server.environments.client.transformRequest(url);
						if (transformed?.code) {
							res.setHeader('Content-Type', 'text/javascript');
							res.setHeader('Cache-Control', 'no-cache');
							res.setHeader('X-Vite-Client', 'transformed');
							res.end(transformed.code);
							return;
						}
					} catch {
						/* fall through to the on-disk client */
					}
					const file = url === '/@vite/env' ? VITE_ENV : VITE_CLIENT;
					if (!fs.existsSync(file)) {
						next();
						return;
					}
					res.setHeader('Content-Type', 'text/javascript');
					res.setHeader('Cache-Control', 'no-cache');
					res.setHeader('X-Vite-Client', 'disk');
					res.end(fs.readFileSync(file));
				};
				const stack = server.middlewares.stack;
				const idx = Math.max(0, stack.length - 1);
				stack.splice(idx, 0, { route: '', handle: handler });
			};
		}
	};
}
