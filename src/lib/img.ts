/**
 * Production image loading for story/wiki/cinema art.
 *
 * Files live in `static/` and are referenced dynamically from JSON (`ch_*.png`,
 * `img_*.png`, `pl_*.png`, `temp/*.jpg`, …). `@sveltejs/enhanced-img` cannot
 * transform those without importing every file at build time, so production
 * uses Vercel Image Optimization (`/_vercel/image`) for AVIF/WebP + srcset.
 * Locally, thumbs and portraits request `?w=` and Vite serves a cached JPEG.
 *
 * Later pass: recompress the on-disk PNGs (many are 1–4 MB) to WebP/AVIF.
 */

export const IMG_WIDTHS = {
	/** Sticky / cinema / gallery story plates. */
	cue: [640, 828, 1200],
	/** Place banners and landscape wiki cards. */
	place: [640, 828, 1200],
	/** Speaker-plate / peek / wiki-detail busts. */
	portrait: [256, 384, 640],
	/** Dialogue faces, wiki grid, org-chart avatars. */
	thumb: [64, 96, 128, 256],
	/** Wiki / profile heroes. */
	hero: [640, 828, 1200]
} as const;

export type StoryImgKind = keyof typeof IMG_WIDTHS;

const DEFAULT_SIZES: Record<StoryImgKind, string> = {
	cue: '(max-width: 820px) 100vw, 42vw',
	place: '(max-width: 820px) 100vw, 28vw',
	portrait: '(max-width: 820px) 40vw, 176px',
	thumb: '128px',
	hero: '(max-width: 820px) 100vw, 420px'
};

export type StoryImgOpts = {
	kind?: StoryImgKind;
	/** LCP / above-fold — eager + fetchpriority=high. */
	priority?: boolean;
	sizes?: string;
	alt?: string;
	/** Override srcset widths (e.g. a tiny blur-fill layer). */
	widths?: readonly number[];
	loading?: 'eager' | 'lazy';
	fetchpriority?: 'high' | 'low' | 'auto';
};

export type StoryImgAttrs = {
	src: string;
	alt: string;
	loading: 'eager' | 'lazy';
	decoding: 'async';
	fetchpriority: 'high' | 'low' | 'auto';
	srcset?: string;
	sizes?: string;
	width?: number;
	height?: number;
};

/** Intrinsic box for thumbs so the browser can reserve space (2:3 portraits). */
const INTRINSIC: Partial<Record<StoryImgKind, { width: number; height: number }>> = {
	thumb: { width: 128, height: 192 }
};

function withWidthQuery(src: string, width: number): string {
	const q = src.indexOf('?');
	const base = q === -1 ? src : src.slice(0, q);
	const params = new URLSearchParams(q === -1 ? '' : src.slice(q + 1));
	params.set('w', String(width));
	return `${base}?${params}`;
}

function vercelImageCdn(): boolean {
	return Boolean(import.meta.env.VERCEL) && import.meta.env.PROD;
}

function shouldOptimize(src: string): boolean {
	if (!src || src.startsWith('data:') || src.startsWith('blob:')) return false;
	if (src.startsWith('/_vercel/image')) return false;
	const path = src.split('?')[0] ?? src;
	if (/\.svg$/i.test(path)) return false;
	return true;
}

/** Path the optimizer should fetch (relative, including cache-bust query). */
function optimizerUrl(src: string): string {
	if (src.startsWith('http://') || src.startsWith('https://')) {
		try {
			const u = new URL(src);
			return `${u.pathname}${u.search}`;
		} catch {
			return src;
		}
	}
	return src;
}

/** Single optimized URL, or the original when the CDN is not available. */
export function optimizeSrc(src: string, width: number, quality = 75): string {
	if (!vercelImageCdn() || !shouldOptimize(src)) return src;
	return `/_vercel/image?url=${encodeURIComponent(optimizerUrl(src))}&w=${width}&q=${quality}`;
}

/** `srcset` string, or `undefined` off Vercel (callers omit the attribute). */
export function optimizeSrcset(
	src: string,
	widths: readonly number[],
	quality = 75
): string | undefined {
	if (!vercelImageCdn() || !shouldOptimize(src) || !widths.length) return undefined;
	return [...widths]
		.sort((a, b) => a - b)
		.map((w) => `${optimizeSrc(src, w, quality)} ${w}w`)
		.join(', ');
}

/**
 * Spread onto a native `<img>` (parent scoped CSS still matches `img`).
 * Do not wrap in a component — that would break `.face img` / `.shot` selectors.
 */
export function storyImg(src: string, opts: StoryImgOpts = {}): StoryImgAttrs {
	const kind = opts.kind ?? 'cue';
	const widths = opts.widths ?? IMG_WIDTHS[kind];
	const priority = opts.priority === true;
	const fallbackWidth =
		kind === 'thumb' ? 256 : (widths[Math.min(1, widths.length - 1)] ?? 828);
	const attrs: StoryImgAttrs = {
		src: optimizeSrc(src, fallbackWidth),
		alt: opts.alt ?? '',
		loading: opts.loading ?? (priority ? 'eager' : 'lazy'),
		decoding: 'async',
		fetchpriority: opts.fetchpriority ?? (priority ? 'high' : 'low')
	};
	const box = INTRINSIC[kind];
	if (box) {
		attrs.width = box.width;
		attrs.height = box.height;
	}
	const srcset = optimizeSrcset(src, widths);
	if (srcset) {
		attrs.srcset = srcset;
		attrs.sizes = opts.sizes ?? DEFAULT_SIZES[kind];
	} else if (shouldOptimize(src) && (kind === 'thumb' || kind === 'portrait')) {
		/* Dev / non-Vercel: Vite middleware resizes `?w=` so wiki cards don't pull 2–4 MB PNGs. */
		attrs.src = withWidthQuery(src, fallbackWidth);
	}
	return attrs;
}
