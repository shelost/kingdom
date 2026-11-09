<script lang="ts">
	/**
	 * Hosts one diagram's 3D scene and its flat 2D fallback.
	 *
	 * - SSR, no WebGL, `flat`, or a failed load: the fallback renders as is.
	 * - Otherwise the box takes the scene's aspect, and three.js + the scene
	 *   load only once the figure is within ~300px of the viewport. Far away,
	 *   the canvas unmounts and its WebGL context is released.
	 * - Reduced motion still gets the 3D scene, landed in its final state.
	 * - A remount after the scene already played lands instantly too.
	 * - The fallback stays in the DOM (invisible) for screen readers, unless
	 *   `keepFallback` is false (when the 3D labels are themselves the controls).
	 */
	import { untrack, type Component, type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import {
		NO_ZOOM,
		hasWebGL,
		loadCanvas,
		type CanvasProps,
		type SceneEntry,
		type SceneProps,
		type Zoom
	} from './kit.svelte';
	import { SCENES } from './scenes';

	let {
		id,
		scene,
		step,
		realm,
		active = false,
		flat = false,
		aspect,
		fill = false,
		sceneProps = {},
		keepFallback = true,
		orbit = false,
		turnable = false,
		turn = $bindable(0),
		reframe,
		onzoomout,
		maxZoom,
		zoomTo = null,
		fallback
	}: {
		/** Scene id in the SCENES table. */
		id?: string;
		/** A scene entry not in the table (wiki org charts). */
		scene?: SceneEntry;
		step?: string;
		realm?: string;
		active?: boolean;
		/** Force the 2D drawing (thumbnails). */
		flat?: boolean;
		/** Overrides the entry's aspect (layouts that size themselves). */
		aspect?: number;
		/** Take the parent's whole box, whatever its shape, instead of an aspect ratio. */
		fill?: boolean;
		sceneProps?: SceneProps;
		keepFallback?: boolean;
		/** Map-style handling: drag spins and tilts, right / Shift / Space + drag pans, the wheel zooms. */
		orbit?: boolean;
		/** A horizontal drag turns the scene about its vertical axis (the wheel still scrolls the page). */
		turnable?: boolean;
		/** The reader's turn, in radians; bind it to show or reset it from outside. */
		turn?: number;
		/** A new value means a new framing from outside: the reader's zoom, pan and turn start over. */
		reframe?: unknown;
		/** The reader keeps zooming out past the whole frame (wheel or pinch at no zoom). */
		onzoomout?: () => void;
		/** Orbit maps that zoom from a world down to a city. */
		maxZoom?: number;
		/**
		 * Fly the zoom toward a screen point (−1…1, right / up) without touching
		 * the spin or the tilt. `n` bumps once per request.
		 */
		zoomTo?: { n: number; u: number; v: number; k: number } | null;
		fallback: Snippet;
	} = $props();

	const entry = $derived(scene ?? (id ? SCENES[id] : undefined));
	const reduced = new MediaQuery('(prefers-reduced-motion: reduce)');

	let gl = $state(false);
	let near = $state(false);
	let visible = $state(false);
	let ready = $state(false);
	let broken = $state(false);
	let width = $state(0);
	let KitCanvas = $state.raw<Component<CanvasProps>>();
	let Scene = $state.raw<Component<SceneProps>>();
	/** Set once the scene has shown the reveal; later mounts skip it. */
	let played = $state(false);
	let instantMount = $state(false);

	const three = $derived(gl && !!entry && !flat && !broken);
	const ratio = $derived(
		width && width < 440 && entry?.narrowAspect ? entry.narrowAspect : (aspect ?? entry?.aspect ?? 1.4)
	);
	const sceneInput = $derived<SceneProps>({ ...sceneProps, step, realm });

	function watch(node: HTMLElement) {
		if (typeof IntersectionObserver === 'undefined' || !hasWebGL()) return;
		gl = true;
		const nearIO = new IntersectionObserver(([e]) => (near = e.isIntersecting), {
			rootMargin: '300px 0px'
		});
		const seenIO = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
		nearIO.observe(node);
		seenIO.observe(node);
		return () => {
			nearIO.disconnect();
			seenIO.disconnect();
		};
	}

	$effect(() => {
		if (!three || !near || (KitCanvas && Scene)) return;
		const e = entry!;
		let cancelled = false;
		Promise.all([loadCanvas(), e.load()]).then(
			([c, s]) => {
				if (cancelled) return;
				KitCanvas = c;
				Scene = s.default as Component<SceneProps>;
			},
			(err) => {
				if (import.meta.env.DEV) console.warn('[KitStage] staying flat:', err);
				if (!cancelled) broken = true;
			}
		);
		return () => {
			cancelled = true;
		};
	});

	// A new scene id (same component, different diagram) starts over.
	$effect(() => {
		void entry;
		return () => {
			Scene = undefined;
			played = false;
		};
	});

	$effect(() => {
		if (ready && active) played = true;
	});

	function onready(r: boolean) {
		if (r) instantMount = played;
		ready = r;
	}

	/** Without `keepFallback`, the 2D drawing shows until the scene has faded in over it. */
	let covered = $state(false);
	$effect(() => {
		if (!ready) {
			covered = false;
			return;
		}
		const t = setTimeout(() => (covered = true), 650);
		return () => clearTimeout(t);
	});

	/*
	 * —— reader zoom: pinch or ⌘/Ctrl-scroll at a point, drag to pan, buttons for the rest.
	 *    Orbit stages: drag spins and tilts, right / Shift / Space + drag pans (even unzoomed),
	 *    plain wheel zooms. ——
	 */

	/** Orbit stages are maps: they zoom down to a single valley. The world map asks for more. */
	const MAX_ZOOM = $derived(maxZoom ?? (orbit ? 12 : 5));
	/** Orbit tilt either way from the scene's own elevation (the rig clamps it to the ground and the zenith). */
	const MAX_TILT = 1.4;
	let zoom = $state<Zoom>(NO_ZOOM);
	/** Space is held over an orbit stage: a drag pans instead of spinning. */
	let spacePan = $state(false);
	/** The current drag pans (right button or Shift on an orbit stage). */
	let dragPan = false;
	const moved = $derived(zoom.k > 1 || zoom.r !== 0 || !!zoom.t || zoom.x !== 0 || zoom.y !== 0 || turn !== 0);
	/** What the canvas sees: the reader's zoom with the turn folded into its spin. */
	const view = $derived<Zoom>(turn ? { ...zoom, r: zoom.r + turn } : zoom);
	/** A full drag across a turnable stage turns it this far. */
	const TURN_PER_WIDTH = Math.PI * 1.6;
	const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));
	/** How far the view may pan, in half-frames: inside the zoomed frame, or two frames on orbit stages. */
	const panLimit = (k: number) => (orbit ? 2 : 1 - 1 / k);

	/** Zoom-out gathered past the whole frame; one firm gesture asks once, then rests. */
	let outward = 1;
	let outwardAt = 0;
	const OUTWARD = 0.6;
	const OUTWARD_REST = 900;

	let framed: { value: unknown } | null = null;
	let zoomApplied = 0;
	$effect(() => {
		const req = zoomTo;
		if (!req || req.n === zoomApplied) return;
		zoomApplied = req.n;
		untrack(() => {
			const k = Math.max(1, Math.min(MAX_ZOOM, req.k));
			const lim = panLimit(k);
			const prev = zoom.k || 1;
			zoom = {
				...zoom,
				k,
				x: clamp(zoom.x + req.u * (1 / prev - 1 / k), lim),
				y: clamp(zoom.y + req.v * (1 / prev - 1 / k), lim)
			};
		});
	});
	$effect(() => {
		const value = reframe;
		if (framed && framed.value !== value) {
			zoom = NO_ZOOM;
			turn = 0;
		}
		framed = { value };
	});

	/** Zoom by `f` keeping the point at (u, v) (−1…1, right / up) under the finger. */
	function zoomAt(f: number, u = 0, v = 0) {
		if (onzoomout && f < 1 && zoom.k <= 1) {
			outward *= f;
			const now = performance.now();
			if (outward < OUTWARD && now - outwardAt > OUTWARD_REST) {
				outward = 1;
				outwardAt = now;
				onzoomout();
			}
			return;
		}
		outward = 1;
		const k = Math.max(1, Math.min(MAX_ZOOM, zoom.k * f));
		if (k === 1 && !orbit) return void (zoom = NO_ZOOM);
		const lim = panLimit(k);
		zoom = {
			...zoom,
			k,
			x: clamp(zoom.x + u * (1 / zoom.k - 1 / k), lim),
			y: clamp(zoom.y + v * (1 / zoom.k - 1 / k), lim)
		};
	}

	function panBy(du: number, dv: number) {
		const lim = panLimit(zoom.k);
		zoom = { ...zoom, x: clamp(zoom.x - du / zoom.k, lim), y: clamp(zoom.y - dv / zoom.k, lim) };
	}

	/** A full drag across the stage turns the scene half a turn; a drag down the stage looks further down on it. */
	function spinBy(du: number, dv = 0) {
		zoom = { ...zoom, r: zoom.r - du * (Math.PI / 2), t: clamp((zoom.t ?? 0) + dv * (Math.PI / 2), MAX_TILT) };
	}

	const zoomable: Attachment<HTMLElement> = (el) => {
		const local = (x: number, y: number) => {
			const r = el.getBoundingClientRect();
			return { u: ((x - r.left) / r.width) * 2 - 1, v: -(((y - r.top) / r.height) * 2 - 1), w: r.width, h: r.height };
		};
		const pts = new Map<number, { x: number; y: number }>();
		let pinch = 0;
		let hover = false;
		const wheel = (e: WheelEvent) => {
			if (!(e.ctrlKey || e.metaKey || orbit)) return;
			e.preventDefault();
			const { u, v } = local(e.clientX, e.clientY);
			zoomAt(Math.exp(-e.deltaY * (orbit && !e.ctrlKey ? 0.002 : 0.01)), u, v);
		};
		const down = (e: PointerEvent) => {
			if ((e.target as HTMLElement).closest('button, a, [role="button"]')) return;
			pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (pts.size === 1) dragPan = orbit && (e.button === 2 || e.shiftKey);
			if (pts.size === 2) {
				const [a, b] = [...pts.values()];
				pinch = Math.hypot(a.x - b.x, a.y - b.y);
			}
			if (pts.size === 2 || zoom.k > 1 || orbit || turnable) {
				e.stopPropagation();
				el.setPointerCapture(e.pointerId);
			}
		};
		/* Space over an orbit stage switches the drag to panning (and must not scroll the page). */
		const typing = (t: EventTarget | null) => t instanceof HTMLElement && t.closest('input, textarea, select, [contenteditable]');
		const key = (e: KeyboardEvent) => {
			if (!orbit || e.code !== 'Space' || typing(e.target)) return;
			if (e.type === 'keyup') return void (spacePan = false);
			if (!hover && !spacePan) return;
			e.preventDefault();
			spacePan = true;
		};
		const enter = () => (hover = true);
		const leave = () => (hover = false);
		const blur = () => (spacePan = false);
		/** The right button pans an orbit stage; its menu would cut the drag short. */
		const menu = (e: MouseEvent) => {
			if (orbit) e.preventDefault();
		};
		const move = (e: PointerEvent) => {
			const prev = pts.get(e.pointerId);
			if (!prev) return;
			const next = { x: e.clientX, y: e.clientY };
			pts.set(e.pointerId, next);
			if (pts.size === 2) {
				const [a, b] = [...pts.values()];
				const d = Math.hypot(a.x - b.x, a.y - b.y);
				const { u, v } = local((a.x + b.x) / 2, (a.y + b.y) / 2);
				if (pinch) zoomAt(d / pinch, u, v);
				pinch = d;
				e.stopPropagation();
			} else if (orbit && !spacePan && !dragPan) {
				const r = el.getBoundingClientRect();
				spinBy(((next.x - prev.x) / r.width) * 2, (next.y - prev.y) / r.height);
				e.stopPropagation();
			} else if (turnable && zoom.k <= 1) {
				turn -= ((next.x - prev.x) / el.getBoundingClientRect().width) * TURN_PER_WIDTH;
				e.stopPropagation();
			} else if (zoom.k > 1 || orbit) {
				const r = el.getBoundingClientRect();
				panBy(((next.x - prev.x) / r.width) * 2, -((next.y - prev.y) / r.height) * 2);
				e.stopPropagation();
			}
		};
		const up = (e: PointerEvent) => {
			pts.delete(e.pointerId);
			if (pts.size < 2) pinch = 0;
		};
		el.addEventListener('wheel', wheel, { passive: false });
		el.addEventListener('pointerdown', down);
		el.addEventListener('pointermove', move);
		el.addEventListener('pointerup', up);
		el.addEventListener('pointercancel', up);
		el.addEventListener('pointerenter', enter);
		el.addEventListener('pointerleave', leave);
		el.addEventListener('contextmenu', menu);
		window.addEventListener('keydown', key);
		window.addEventListener('keyup', key);
		window.addEventListener('blur', blur);
		return () => {
			el.removeEventListener('wheel', wheel);
			el.removeEventListener('pointerdown', down);
			el.removeEventListener('pointermove', move);
			el.removeEventListener('pointerup', up);
			el.removeEventListener('pointercancel', up);
			el.removeEventListener('pointerenter', enter);
			el.removeEventListener('pointerleave', leave);
			el.removeEventListener('contextmenu', menu);
			window.removeEventListener('keydown', key);
			window.removeEventListener('keyup', key);
			window.removeEventListener('blur', blur);
		};
	};
</script>

<div class="kit" class:three class:fill bind:clientWidth={width} {@attach watch}>
	{#if three}
		<div
			class="kit-box"
			class:zoomed={zoom.k > 1}
			class:orbit={orbit || turnable}
			class:panning={orbit && spacePan}
			style:aspect-ratio={fill ? undefined : ratio}
			{@attach zoomable}
		>
			{#if keepFallback || !covered}
				<div class="kit-fallback" class:interim={!keepFallback} aria-hidden={keepFallback ? undefined : 'true'} inert={!keepFallback}>
					{@render fallback()}
				</div>
			{/if}
			{#if near && KitCanvas && Scene}
				<div class="kit-gl" class:shown={ready} aria-hidden={keepFallback ? 'true' : undefined}>
					<svelte:boundary
						onerror={(err) => {
							if (import.meta.env.DEV) console.warn('[KitStage] staying flat:', err);
							broken = true;
						}}
					>
						<KitCanvas
							scene={Scene}
							sceneProps={sceneInput}
							{active}
							instant={reduced.current || instantMount}
							{visible}
							reduced={reduced.current}
							zoom={view}
							{onready}
						/>
						{#snippet failed()}{/snippet}
					</svelte:boundary>
				</div>
				<div class="kit-zoom" class:on={moved}>
					<button type="button" onclick={() => zoomAt(1 / 1.5)} disabled={zoom.k <= 1} aria-label="Zoom out">
						<span class="material-symbols-outlined" aria-hidden="true">remove</span>
					</button>
					<button type="button" onclick={() => zoomAt(1.5)} disabled={zoom.k >= MAX_ZOOM} aria-label="Zoom in">
						<span class="material-symbols-outlined" aria-hidden="true">add</span>
					</button>
					{#if moved}
						<button type="button" onclick={() => ((zoom = NO_ZOOM), (turn = 0))} aria-label="Reset view">
							<span class="material-symbols-outlined" aria-hidden="true">fit_screen</span>
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		{@render fallback()}
	{/if}
</div>

<style lang="scss">
	.kit {
		container: kit / inline-size;
		&.fill {
			height: 100%;
			& > .kit-box {
				height: 100%;
			}
		}
	}

	.kit-box {
		position: relative;
		width: 100%;
		overflow: hidden;
		touch-action: pan-y;
		&.zoomed {
			touch-action: none;
			cursor: grab;
		}
		&.orbit {
			/* Orbit: a horizontal drag spins; vertical swipes still scroll the page on touch. */
			cursor: grab;
			&:active {
				cursor: grabbing;
			}
		}
		&.panning {
			cursor: move;
		}
	}

	/* Shown on hover or focus, always on touch screens and while zoomed. */

	.kit-zoom {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		z-index: 5;
		display: flex;
		gap: 2px;
		padding: 2px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		backdrop-filter: blur(6px);
		opacity: 0;
		transition: opacity 200ms ease;
		.kit-box:hover &, &:focus-within, &.on {
			opacity: 1;
		}
	}

	@media (hover: none) {
		.kit-zoom {
			opacity: 1;
		}
	}

	.kit-zoom button {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--fg-strong);
		cursor: pointer;
		&:disabled {
			opacity: 0.3;
			cursor: default;
		}
	}

	.kit-zoom .material-symbols-outlined {
		font-size: 1.1rem;
	}

	/* Still read by screen readers; never seen while the scene is up. */

	.kit-fallback {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		overflow: hidden;
		&.interim {
			opacity: 1;
		}
	}

	.kit-gl {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 600ms var(--ease, ease);
		&.shown {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.kit-gl {
			transition: none;
		}
	}
</style>
