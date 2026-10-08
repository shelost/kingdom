/**
 * The diagram kit: shared state, theme palette, motion helpers and pure
 * layout maths for the 3D org charts.
 *
 * This module never imports three.js, so the story bundle can use it (for
 * the WebGL probe, the lazy loader and the scene table) without pulling in
 * WebGL code. Everything that needs three lives in the lazy Kit*.svelte files.
 *
 * World axes: x to the right, y up, z towards the viewer. A 2D chart's "top"
 * is the far side (-z); rank is height.
 */

import { createContext, type Component } from 'svelte';
import { Tween } from 'svelte/motion';
import { createSubscriber } from 'svelte/reactivity';
import { cubicInOut, cubicOut } from 'svelte/easing';

export type Vec3 = [number, number, number];
export type RGB = [number, number, number];

export interface Bounds {
	min: Vec3;
	max: Vec3;
}

/** Camera direction: azimuth from +z towards +x, elevation above the ground (radians). */
export interface View {
	az: number;
	el: number;
}

export const DEFAULT_VIEW: View = { az: 0.36, el: 0.66 };

/** A scene's footprint: x and z extents on the ground, plus the tallest thing in it. */
export function box(minX: number, maxX: number, minZ: number, maxZ: number, maxY = 2): Bounds {
	return { min: [minX, 0, minZ], max: [maxX, maxY, maxZ] };
}

/* ———————————————————————— colour ———————————————————————— */

export function hex([r, g, b]: RGB): string {
	const c = (v: number) =>
		Math.round(Math.max(0, Math.min(1, v)) * 255)
			.toString(16)
			.padStart(2, '0');
	return `#${c(r)}${c(g)}${c(b)}`;
}

export function rgbOf(color: string): RGB {
	const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
	if (m) {
		const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
		return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
	}
	return parseCssColor(color) ?? [0.5, 0.5, 0.5];
}

/** Parses what getComputedStyle hands back: rgb()/rgba() or color(srgb …). */
function parseCssColor(css: string): RGB | null {
	const nums = css.match(/-?[\d.]+/g)?.map(Number);
	if (!nums || nums.length < 3) return null;
	if (css.startsWith('color(')) return [nums[0], nums[1], nums[2]];
	return [nums[0] / 255, nums[1] / 255, nums[2] / 255];
}

/** Linear mix, a → b by t (0 keeps a). */
export function mix(a: string, b: string, t: number): string {
	const x = rgbOf(a);
	const y = rgbOf(b);
	return hex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as RGB);
}

/* ———————————————————————— theme ———————————————————————— */

export interface KitPalette {
	light: boolean;
	/** The ground the figure sits on (the box background). */
	bg: string;
	fg: string;
	gold: string;
	/** Neutral slab: the "monochrome" in monochrome + one accent. */
	base: string;
	/** A slab that has receded (dimmed, struck, out of focus). */
	dim: string;
	/** Neutral beams and rings. */
	line: string;
	red: string;
	shadow: string;
	shadowOpacity: number;
	ambient: number;
	hemi: number;
	key: number;
	fill: number;
}

const FALLBACK = { bg: '#16161c', fg: '#f3f1ec', gold: '#d8b26a' };

let probe: HTMLElement | undefined;

/** Resolves a CSS custom property to a hex colour, color-mix() and all. */
function cssColor(name: string, fallback: string): string {
	if (typeof document === 'undefined') return fallback;
	if (!probe) {
		probe = document.createElement('span');
		probe.style.display = 'none';
		document.documentElement.appendChild(probe);
	}
	probe.style.color = '';
	probe.style.color = `var(${name}, ${fallback})`;
	const rgb = parseCssColor(getComputedStyle(probe).color);
	return rgb ? hex(rgb) : fallback;
}

function readPalette(): KitPalette {
	const light =
		typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
	const bg = cssColor('--panel', FALLBACK.bg);
	const fg = cssColor('--fg', FALLBACK.fg);
	const gold = cssColor('--gold', FALLBACK.gold);
	return {
		light,
		bg,
		fg,
		gold,
		base: mix(fg, bg, light ? 0.3 : 0.4),
		dim: mix(fg, bg, 0.8),
		line: mix(fg, bg, light ? 0.5 : 0.55),
		red: light ? '#d93a3a' : '#ff5a52',
		shadow: light ? '#3b2a12' : '#000000',
		shadowOpacity: light ? 0.2 : 0.5,
		ambient: light ? 0.95 : 0.55,
		hemi: light ? 0.55 : 0.5,
		key: light ? 2.1 : 2.4,
		fill: light ? 0.45 : 0.35
	};
}

const watchTheme = createSubscriber((update) => {
	if (typeof MutationObserver === 'undefined') return;
	const mo = new MutationObserver(update);
	mo.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme', 'class', 'style']
	});
	return () => mo.disconnect();
});

/** The live site palette. Reactive: re-reads whenever <html data-theme> (or its class/style) changes. */
export function themePalette(): KitPalette {
	watchTheme();
	return readPalette();
}

/** Kingdom accents, the same hexes the 2D charts use. */
export const HUE = {
	silla: '#4d8eff',
	baekje: '#ffd24a',
	goguryeo: '#ff3d36',
	tang: '#f0a03c',
	gaya: '#8f5fcf',
	tamla: '#ff9a2e',
	joseon: '#f0c56a',
	jolbon: '#5f8a52',
	pantheon: '#f0c86e',
	gold: '#e8c36a'
} as const;

export type Tone = 'base' | 'accent' | 'hot' | 'dim' | 'ghost' | 'red';

/** Monochrome + one accent: every slab colour comes from here. */
export function toneColor(p: KitPalette, tone: Tone, accent?: string): string {
	const a = accent ?? p.gold;
	switch (tone) {
		case 'accent':
			return a;
		case 'hot':
			return mix(a, p.light ? '#000000' : '#ffffff', 0.12);
		case 'dim':
			return mix(accent ?? p.base, p.bg, 0.72);
		case 'ghost':
			return p.dim;
		case 'red':
			return p.red;
		default:
			return p.base;
	}
}

/* ———————————————————————— kit context ———————————————————————— */

export interface KitContext {
	readonly palette: KitPalette;
	/** The figure has entered the viewport once: reveal. */
	readonly active: boolean;
	/** Skip animation (reduced motion, or a remount after it already played). */
	readonly instant: boolean;
	/** Strictly on screen: continuous effects (pulses) may run. */
	readonly visible: boolean;
	readonly reduced: boolean;
	/** The canvas is phone-sized: scenes and labels collapse. */
	readonly narrow: boolean;
	/** Frame the camera on these bounds. */
	fit(bounds: Bounds, view?: View): void;
	/** The DOM layer over the canvas that labels portal into. */
	readonly layer: HTMLElement | undefined;
	/**
	 * Canvas pixel position of a world point, plus a stacking order (nearer
	 * is higher). Reactive: re-reads whenever the camera moves or resizes.
	 */
	project(at: Vec3): { x: number; y: number; z: number };
}

export const [getKit, setKit] = createContext<KitContext>();

/* ———————————————————————— motion ———————————————————————— */

/**
 * 0 → 1 once the figure is active (and `show` holds), after `delay` ms.
 * Back to 0 when `show` drops. Instant when the kit says so.
 */
export function useReveal(
	opts: () => { delay?: number; show?: boolean; duration?: number },
	fallbackDuration = 650
): Tween<number> {
	const kit = getKit();
	const t = new Tween(0, { duration: fallbackDuration, easing: cubicOut });
	$effect(() => {
		const { delay = 0, show = true, duration = fallbackDuration } = opts();
		const on = kit.active && show;
		if (kit.instant) t.set(on ? 1 : 0, { duration: 0 });
		else t.set(on ? 1 : 0, { delay: on ? delay : 0, duration: on ? duration : duration * 0.6 });
	});
	return t;
}

/**
 * Follows a value (number, tuple, nested tuples). Before the figure plays,
 * it snaps; afterwards step changes glide, after `delay` ms.
 */
export function useFollow<T>(get: () => T, delay: () => number = () => 0, duration = 800): Tween<T> {
	const kit = getKit();
	const t = new Tween<T>(get(), { duration, easing: cubicInOut });
	$effect(() => {
		const v = get();
		if (!kit.active || kit.instant) t.set(v, { duration: 0 });
		else t.set(v, { delay: delay() });
	});
	return t;
}

/* ———————————————————————— layout ———————————————————————— */

export interface RingSeat {
	i: number;
	x: number;
	z: number;
	/** Angle in radians (0 = +x, clockwise seen from above towards +z). */
	a: number;
}

/** n seats on a circle; start at -90° = the far side (the top of a 2D chart). */
export function ring(n: number, r: number, startDeg = -90, cx = 0, cz = 0): RingSeat[] {
	return Array.from({ length: n }, (_, i) => {
		const a = ((startDeg + (i * 360) / n) * Math.PI) / 180;
		return { i, a, x: cx + r * Math.cos(a), z: cz + r * Math.sin(a) };
	});
}

/** n points spread evenly on a line from x0 to x1. */
/**
 * Position of `step` in a cumulative sequence; layers up to it are drawn and
 * it is the focus. No step (or an unknown one) shows the whole picture.
 */
export function stepIndex(steps: readonly string[], step?: string): number {
	const i = step ? steps.indexOf(step) : -1;
	return i < 0 ? steps.length - 1 : i;
}

export function spread(n: number, x0: number, x1: number): number[] {
	if (n === 1) return [(x0 + x1) / 2];
	return Array.from({ length: n }, (_, i) => x0 + ((x1 - x0) * i) / (n - 1));
}

export interface Level {
	w: number;
	d: number;
	h: number;
}

/** Stacked platforms, bottom first: where each level's base and top sit. */
export function stack<L extends Level>(levels: L[], y0 = 0): (L & { y: number; top: number })[] {
	let y = y0;
	return levels.map((l) => {
		const out = { ...l, y, top: y + l.h };
		y += l.h;
		return out;
	});
}

export interface TreeItem {
	id: string;
	parent?: string | null;
}

export interface TreeNode<T extends TreeItem> {
	item: T;
	id: string;
	depth: number;
	/** Order among all nodes (reading order), for staggered reveals. */
	order: number;
	x: number;
	z: number;
}

/** How KitTree draws one node. */
export interface TreeLook {
	shape?: 'slab' | 'disc';
	size?: [number, number] | [number];
	height?: number;
	tone?: Tone;
	color?: string;
	glow?: number;
	show?: boolean;
}

export interface TreeLayout<T extends TreeItem> {
	nodes: TreeNode<T>[];
	links: { from: string; to: string; depth: number; points: Vec3[] }[];
	/** Ground footprint (x and z extents). */
	width: number;
	depth: number;
	maxDepth: number;
}

/**
 * Tidy tree on the ground: roots at the back, children towards the viewer,
 * parents centred over their children. A parent with more than `wrap` leaf
 * children lays them out in rows of `wrap`, so wide councils stay readable.
 */
export function treeLayout<T extends TreeItem>(
	items: T[],
	{ dx = 1.6, dz = 1.9, wrap = 6 }: { dx?: number; dz?: number; wrap?: number } = {}
): TreeLayout<T> {
	const ids = new Set(items.map((n) => n.id));
	const kids = new Map<string | null, T[]>();
	for (const n of items) {
		const p = n.parent && ids.has(n.parent) ? n.parent : null;
		const list = kids.get(p);
		if (list) list.push(n);
		else kids.set(p, [n]);
	}
	const childrenOf = (id: string | null) => kids.get(id) ?? [];
	const isLeaf = (id: string) => childrenOf(id).length === 0;
	const gridded = (id: string) => {
		const c = childrenOf(id);
		return c.length > wrap && c.every((k) => isLeaf(k.id));
	};

	const widthMemo = new Map<string, number>();
	function width(id: string): number {
		const memo = widthMemo.get(id);
		if (memo !== undefined) return memo;
		const c = childrenOf(id);
		const w = !c.length ? 1 : gridded(id) ? wrap : c.reduce((s, k) => s + width(k.id), 0);
		widthMemo.set(id, w);
		return w;
	}

	// Rows per depth, so a gridded block pushes the next generation back.
	const rowsAt: number[] = [];
	const place: { item: T; depth: number; slot: number; row: number }[] = [];
	function walk(n: T, depth: number, left: number) {
		const w = width(n.id);
		place.push({ item: n, depth, slot: left + w / 2, row: 0 });
		rowsAt[depth] = Math.max(rowsAt[depth] ?? 1, 1);
		const c = childrenOf(n.id);
		if (gridded(n.id)) {
			const rows = Math.ceil(c.length / wrap);
			rowsAt[depth + 1] = Math.max(rowsAt[depth + 1] ?? 1, rows);
			c.forEach((k, i) => {
				const row = Math.floor(i / wrap);
				const inRow = Math.min(wrap, c.length - row * wrap);
				const col = i % wrap;
				place.push({
					item: k,
					depth: depth + 1,
					slot: left + (wrap - inRow) / 2 + col + 0.5,
					row
				});
			});
			return;
		}
		let x = left;
		for (const k of c) {
			walk(k, depth + 1, x);
			x += width(k.id);
		}
	}
	let left = 0;
	for (const r of childrenOf(null)) {
		walk(r, 0, left);
		left += width(r.id);
	}

	const maxDepth = Math.max(0, ...place.map((p) => p.depth));
	const zAt: number[] = [0];
	for (let d = 1; d <= maxDepth + 1; d++) {
		zAt[d] = zAt[d - 1] + dz * (1 + 0.62 * ((rowsAt[d - 1] ?? 1) - 1));
	}
	const total = left;
	const span = zAt[maxDepth] + dz * 0.62 * ((rowsAt[maxDepth] ?? 1) - 1);

	const nodes: TreeNode<T>[] = place.map((p, order) => ({
		item: p.item,
		id: p.item.id,
		depth: p.depth,
		order,
		x: (p.slot - total / 2) * dx,
		z: zAt[p.depth] + p.row * dz * 0.62 - span / 2
	}));
	const byId = new Map(nodes.map((n) => [n.id, n]));

	const links: TreeLayout<T>['links'] = [];
	const Y = 0.02;
	for (const n of nodes) {
		const pid = n.item.parent;
		const p = pid ? byId.get(pid) : undefined;
		if (!p) continue;
		const mid = p.z + dz * 0.5;
		links.push({
			from: p.id,
			to: n.id,
			depth: n.depth,
			points: [
				[p.x, Y, p.z],
				[p.x, Y, mid],
				[n.x, Y, mid],
				[n.x, Y, n.z]
			]
		});
	}

	return { nodes, links, width: Math.max(1, total) * dx, depth: span, maxDepth };
}

/* ———————————————————————— loading ———————————————————————— */

/** Props every 3D scene receives. Scene-specific extras ride along. */
export interface SceneProps {
	step?: string;
	realm?: string;
	[key: string]: unknown;
}

export interface SceneEntry {
	/** Scenes declare only the props they read; `never` admits all of them. */
	load: () => Promise<{ default: Component<never> }>;
	/** Width / height of the canvas box. */
	aspect: number;
	/** A taller box for phone widths, so labels have room. */
	narrowAspect?: number;
}

let webgl: boolean | undefined;

/** One throwaway probe per page; the context is released straight away. */
export function hasWebGL(): boolean {
	if (webgl !== undefined) return webgl;
	if (typeof document === 'undefined') return false;
	try {
		const c = document.createElement('canvas');
		const gl = c.getContext('webgl2') ?? c.getContext('webgl');
		webgl = !!gl;
		gl?.getExtension('WEBGL_lose_context')?.loseContext();
	} catch {
		webgl = false;
	}
	return webgl;
}

/** Reader zoom on a diagram: `k` ≥ 1, pan `x`/`y` in fractions of the fitted half-frame (right / up). */
export interface Zoom {
	k: number;
	x: number;
	y: number;
}

export const NO_ZOOM: Zoom = { k: 1, x: 0, y: 0 };

export interface CanvasProps {
	scene: Component<SceneProps>;
	sceneProps: SceneProps;
	active: boolean;
	instant: boolean;
	visible: boolean;
	reduced: boolean;
	zoom?: Zoom;
	onready?: (ready: boolean) => void;
}

let canvasModule: Promise<Component<CanvasProps>> | undefined;

/** Threlte + three load only when the first diagram nears the viewport. */
export function loadCanvas(): Promise<Component<CanvasProps>> {
	canvasModule ??= import('./KitCanvas.svelte').then(
		(m) => m.default,
		(err) => {
			canvasModule = undefined;
			throw err;
		}
	);
	return canvasModule;
}
