import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { compactStoryJson } from './vite-plugin-story-json.ts';
import { staticAssetHmr } from './vite-plugin-static-hmr.ts';

export default defineConfig({
	define: {
		'import.meta.env.VERCEL': JSON.stringify(process.env.VERCEL ?? '')
	},
	plugins: [
		compactStoryJson(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({
				images: {
					// Must include every `w=` used by `$lib/img` (thumbs through cinema).
					sizes: [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920],
					formats: ['image/avif', 'image/webp'],
					minimumCacheTTL: 60 * 60 * 24 * 7,
					domains: []
				}
			})
		}),
		// After sveltekit() so our post-hook can splice before Kit's SSR catch-all.
		staticAssetHmr()
	]
});
