import path from 'node:path';
import type { Plugin } from 'vite';

const STATIC_ROOT = path.resolve('static');
const IMAGE_RE = /\.(png|jpe?g|webp|gif|svg|ico)$/i;

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
		}
	};
}
