<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { StackImage } from '$lib/story';
	import type { ScriptArtFrame } from '$lib/cueArt';
	import { liveDisplayArt, liveScriptFrames } from '$lib/stillEditUi.svelte';
	import { storyImg } from '$lib/img';
	import { reveal } from '$lib/reveal';
	import { reading } from '$lib/reading.svelte';
	import { filterNsfw } from '$lib/nsfwUi.svelte';
	import { editUi, filterVisibleCues } from '$lib/editUi.svelte';
	import { hasRealImage, isBrokenArt, markBrokenArt } from '$lib/storyImages';
	import { cueMenuTarget, openImageMenu } from '$lib/imageMenu.svelte';
	import { openLightbox, type LightboxItem } from '$lib/imageLightbox.svelte';
	import { isNsfwCueImage } from '$lib/nsfwCue';
	import { measureRatio, naturalRatio } from '$lib/imageRatio.svelte';
	import { slotMotion, stillMotion } from '$lib/stillMotion';
	import { CROP_MAX, CROP_MIN, WIDTH_MAX, WIDTH_MIN } from '$lib/story';
	import {
		commitCrop,
		commitFocus,
		commitWidth,
		cueLayoutOf,
		previewCrop,
		previewFocus,
		previewWidth,
		startCueDrag
	} from '$lib/cueLayout.svelte';
	import { animating } from '$lib/motionUi.svelte';
	import ComicBalloon from './ComicBalloon.svelte';
	import CardTag from './CardTag.svelte';
	import MythRealityCompare, { VERSION_TAG } from './MythRealityCompare.svelte';

	let {
		images,
		inline = false,
		priority = false,
		track = false
	}: {
		images: StackImage[];
		/** When true, show every frame in reading order (no sticky cue swap). */
		inline?: boolean;
		/** First visible stack — eager + high fetch for the opening cue. */
		priority?: boolean;
		/**
		 * Immersion's scenes panel: the frames stand in a rail that slides up
		 * as the reader goes, the live one on top and the next ones under it.
		 */
		track?: boolean;
	} = $props();

	/** Upcoming frames a track paints ahead of the live one. */
	const TRACK_AHEAD = 3;

	/** Immersion keeps the landscape phone-frame treatment; script uses normal sticky + cues. */
	let immersion = $derived(reading.mode === 'immersion');
	/* Empty slots only show (as prompt cards) in edit mode, where art is generated into them. */
	let visible = $derived.by(() => {
		const cues = filterVisibleCues(filterNsfw(images));
		return editUi.enabled ? cues : cues.filter(hasRealImage);
	});

	/** Script frames of a slot, minus any that failed to load. */
	function framesOf(slot: StackImage) {
		return liveScriptFrames(slot).filter((f) => !isBrokenArt(f.src));
	}

	/** Reading art; a final that 404s falls back to its temp stand-in. */
	function readingArt(slot: StackImage): string | undefined {
		const art = liveDisplayArt(slot, 'reading');
		return art && isBrokenArt(art) ? framesOf(slot)[0]?.src : art;
	}

	/** Panoramas this wide and portraits this tall never share a row. */
	const WIDE_RATIO = 2.4;
	const TALL_RATIO = 0.6;

	/** One inline figure: a script frame of a slot, or (edit mode) the empty slot's prompt card. */
	type InlineItem = {
		key: string;
		slot: StackImage;
		/** Index of the slot in `visible`. */
		index: number;
		frame?: ScriptArtFrame;
		first: boolean;
		/** Shape the frame shows: the dragged `crop`, else the picture's own. */
		ratio: number;
		/** The picture's own shape; decides solo vs masonry, so a drag never reflows the row. */
		natural: number;
		/** A dragged shape: the picture fills the frame, cropped. */
		cropped: boolean;
		fitted: boolean;
		/** Reading order across the whole stack. */
		order: number;
	};

	type InlineRow =
		| { key: string; solo: InlineItem }
		| { key: string; cols: [InlineItem[], InlineItem[]] }
		| { key: string; compare: { myth: InlineItem; reality: InlineItem } };

	/** Slot ids of myth stills whose reality twin follows them, and of those twins. */
	let paired = $derived.by(() => {
		const ids = new Set<string>();
		visible.forEach((slot, i) => {
			if (slot.pair && visible[i + 1]?.id === slot.pair) ids.add(slot.id).add(slot.pair);
		});
		return ids;
	});

	const isExtreme = (r: number) => r >= WIDE_RATIO || r <= TALL_RATIO;

	/** Shortest column first, so the pair ends level and reading order runs top to bottom. */
	function masonry(items: InlineItem[]): [InlineItem[], InlineItem[]] {
		const cols: [InlineItem[], InlineItem[]] = [[], []];
		const h = [0, 0];
		for (const it of items) {
			const c = h[1] < h[0] ? 1 : 0;
			cols[c].push(it);
			h[c] += 1 / it.natural;
		}
		return cols;
	}

	/**
	 * Inline rows in reading order: extreme ratios, full-width cues and lone figures
	 * stand alone at the column's width; every other run of two or more pairs up as masonry.
	 */
	let inlineRows = $derived.by<InlineRow[]>(() => {
		if (!inline) return [];
		const items: InlineItem[] = [];
		visible.forEach((slot, index) => {
			const frames = framesOf(slot);
			if (!frames.length) {
				const natural = slot.ratio ?? 2;
				items.push({
					key: `${slot.id}:${index}`,
					slot,
					index,
					first: true,
					ratio: slot.crop ?? natural,
					natural,
					cropped: !!slot.crop,
					fitted: false,
					order: items.length
				});
				return;
			}
			frames.forEach((frame, fi) => {
				const fit = naturalRatio(frame.src);
				const natural = fit ?? slot.ratio ?? 2;
				items.push({
					key: `${slot.id}:${index}:${frame.layer}`,
					slot,
					index,
					frame,
					first: fi === 0,
					ratio: slot.crop ?? natural,
					natural,
					cropped: !!slot.crop,
					fitted: fit != null,
					order: items.length
				});
			});
		});

		const rows: InlineRow[] = [];
		let run: InlineItem[] = [];
		const flush = () => {
			if (run.length === 1) rows.push({ key: run[0].key, solo: run[0] });
			else if (run.length) rows.push({ key: `pair:${run[0].key}`, cols: masonry(run) });
			run = [];
		};
		const slider = animating();
		for (const it of items) {
			if (paired.has(it.slot.id)) {
				flush();
				if (!slider || !it.frame) {
					rows.push({ key: it.key, solo: it });
					continue;
				}
				if (!it.slot.pair || !it.first) continue;
				const reality = items.find((r) => r.slot.id === it.slot.pair && r.first && r.frame);
				if (reality) rows.push({ key: `compare:${it.key}`, compare: { myth: it, reality } });
				else rows.push({ key: it.key, solo: it });
				continue;
			}
			if (it.slot.wide || isExtreme(it.natural)) {
				flush();
				rows.push({ key: it.key, solo: it });
			} else run.push(it);
		}
		flush();
		return rows;
	});

	let live = $state(0);
	/** Sticky / inline stacks only fetch once near the viewport (or marked LCP). */
	let near = $state(false);

	const CUE_SIZES = '(max-width: 820px) 100vw, 42vw';
	/** Solo figures take the prose column; masonry figures half of it (one column on a phone). */
	const SOLO_SIZES = '(max-width: 820px) 92vw, 640px';
	const PAIR_SIZES = '(max-width: 599px) 92vw, (max-width: 820px) 46vw, 320px';

	/** Same mid as the reading band in `reading.svelte.ts` — a fixed viewport line. */
	const BAND_MID = 0.4;

	/**
	 * Sticky mode stacks every frame in the same viewport cell, so native
	 * `loading="lazy"` does not help — the browser treats them all as in-view.
	 * Only decode the live cue plus one neighbour for the fade / the next cut.
	 * Inline (script) stacks also wait until near the viewport — otherwise every
	 * cue on the chronicle mounts an `<img>` at once.
	 */
	function paintSlot(i: number): boolean {
		if (!near) return false;
		if (inline) return true;
		if (priority && i <= 1) return true;
		if (track) return i >= live - 1 && i <= live + TRACK_AHEAD;
		return Math.abs(i - live) <= 1;
	}

	const watchNear: Attachment<HTMLElement> = (node) => {
		if (priority) {
			near = true;
			return;
		}
		if (typeof IntersectionObserver === 'undefined') {
			near = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) near = true;
			},
			{ rootMargin: inline ? '600px 0px' : '400px 0px', threshold: 0 }
		);
		io.observe(node);
		return () => io.disconnect();
	};

	/**
	 * Rank of this slot among images that share its beat, and how many share it.
	 * Used to subdivide a beat's scroll range so every image gets its own cue.
	 */
	function cueShare(i: number): { rank: number; total: number; beat: number } {
		const beat = visible[i]?.beatIndex ?? 0;
		let rank = 0;
		let total = 0;
		for (let j = 0; j < visible.length; j++) {
			if ((visible[j].beatIndex ?? 0) !== beat) continue;
			if (j < i) rank++;
			total++;
		}
		return { rank, total: Math.max(1, total), beat };
	}

	/**
	 * Active image = last cue whose top has crossed the reading-band mid.
	 * Hysteresis keeps the live index from flickering when a cue sits on
	 * the mid-line (subpixel + sticky reflow used to chatter the reel).
	 */
	const CUE_HYSTERESIS = 12;

	function cueTopOf(i: number, beats: HTMLElement[]): number | null {
		const { rank, total, beat } = cueShare(i);
		const el = beats[beat];
		if (!el) return null;
		const r = el.getBoundingClientRect();
		return r.top + (r.height * rank) / total;
	}

	function indexAtBand(beats: HTMLElement[], mid: number, current: number): number {
		let active = 0;
		for (let i = 0; i < visible.length; i++) {
			const cueTop = cueTopOf(i, beats);
			if (cueTop == null) continue;
			if (cueTop <= mid) active = i;
		}
		if (active === current) return current;
		if (active > current) {
			const cueTop = cueTopOf(active, beats);
			return cueTop != null && cueTop <= mid - CUE_HYSTERESIS ? active : current;
		}
		const cueTop = cueTopOf(current, beats);
		return cueTop != null && cueTop > mid + CUE_HYSTERESIS ? active : current;
	}

	const watchLive: Attachment<HTMLElement> = (node) => {
		if (inline || !visible.length) {
			live = 0;
			return;
		}

		const article = node.closest<HTMLElement>('article.entry');
		const beats = article
			? [...article.querySelectorAll<HTMLElement>('[data-beat]')]
			: [];

		if (!beats.length) {
			live = 0;
			return;
		}

		let raf = 0;
		let roTimer = 0;
		const pick = () => {
			raf = 0;
			if (article) {
				const r = article.getBoundingClientRect();
				const slop = window.innerHeight * 1.5;
				if (r.bottom < -slop || r.top > window.innerHeight + slop) return;
			}
			const next = indexAtBand(beats, window.innerHeight * BAND_MID, live);
			if (next !== live) live = next;
		};

		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(pick);
		};

		const onResize = () => {
			if (roTimer) return;
			roTimer = window.setTimeout(() => {
				roTimer = 0;
				onScroll();
			}, 80);
		};

		pick();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		const ro =
			typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(onResize)
				: null;
		for (const el of beats) ro?.observe(el);

		return () => {
			if (raf) cancelAnimationFrame(raf);
			if (roTimer) clearTimeout(roTimer);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			ro?.disconnect();
		};
	};

	/**
	 * Fade each frame up as it arrives — except inline, where the figures are
	 * part of the manuscript and must simply be there, with nothing to wait for.
	 */
	function revealFrame(index: number): Attachment<HTMLElement> {
		return (node) => {
			if (inline || track) return;
			const handle = reveal(node, { delay: index * 70, y: 0 });
			return 'destroy' in handle ? handle.destroy : undefined;
		};
	}

	function cueText(slot: StackImage): string {
		if (slot.prompt?.trim()) return slot.prompt.trim();
		const alt = slot.alt?.trim();
		if (alt) return alt;
		return `Generate art for “${slot.id}”`;
	}

	function episodeIdOf(node: HTMLElement | null): string | undefined {
		const article = node?.closest<HTMLElement>('article.entry');
		return article?.dataset.storyId || undefined;
	}

	function stackItems(host: HTMLElement | null): LightboxItem[] {
		const episodeId = episodeIdOf(host);
		const items: LightboxItem[] = [];
		for (const slot of visible) {
			const frames = inline ? framesOf(slot) : [];
			const srcs = frames.length
				? frames.map((f) => f.src)
				: [readingArt(slot)].filter((s): s is string => !!s);
			for (const src of srcs) {
				items.push({
					src,
					alt: slot.alt ?? slot.id,
					title: slot.alt ?? slot.id,
					caption: slot.id,
					nsfw: isNsfwCueImage(slot),
					episodeId
				});
			}
		}
		return items;
	}

	function openAt(src: string, host: HTMLElement | null) {
		const items = stackItems(host);
		const index = items.findIndex((im) => im.src === src);
		openLightbox(items, index >= 0 ? index : 0, host);
	}

	function onEditContextMenu(e: MouseEvent, slotId: string, src?: string) {
		openImageMenu(e, cueMenuTarget(slotId, src));
	}

	/** How close an edge must come, in px, before it locks to another edge. */
	const SNAP = 8;

	/** A white line while a drag is locked to another still's edge, in viewport px. */
	let guide = $state<{ axis: 'x' | 'y'; px: number } | null>(null);

	/** Side-by-side gutters in this stack. Dragging one splits those two stills. */
	type Seam = { key: string; leftKey: string; rightKey: string; left: number; top: number; height: number };
	let seams = $state<Seam[]>([]);
	let stackRoot = $state<HTMLDivElement | null>(null);

	/** The column these stills snap against: the episode, or this stack alone. */
	function snapRoot(from: HTMLElement): HTMLElement {
		return from.closest<HTMLElement>('.beats') ?? from.closest<HTMLElement>('.stack') ?? from;
	}

	function otherFrames(root: HTMLElement, skip: Set<HTMLElement>): HTMLElement[] {
		return [...root.querySelectorAll<HTMLElement>('figure.frame')].filter((fig) => !skip.has(fig));
	}

	/**
	 * Lock `client` to another still's edge, or to a third of the column.
	 * `along` is the cross-axis span the candidate must overlap, so a still
	 * far above does not steal the snap.
	 */
	function snapPoint(
		root: HTMLElement,
		skip: HTMLElement[],
		client: number,
		axis: 'x' | 'y'
	): { at: number; guide: number | null } {
		const box = root.getBoundingClientRect();
		const mine = skip[0]?.getBoundingClientRect();
		const origin = axis === 'x' ? box.left : box.top;
		const span = axis === 'x' ? box.width : box.height;
		const points = [origin, origin + span / 3, origin + span / 2, origin + (2 * span) / 3, origin + span];
		for (const fig of otherFrames(root, new Set(skip))) {
			const r = fig.getBoundingClientRect();
			const overlap = mine
				? axis === 'x'
					? Math.min(mine.bottom, r.bottom) - Math.max(mine.top, r.top)
					: Math.min(mine.right, r.right) - Math.max(mine.left, r.left)
				: 20;
			if (overlap < 12 && axis === 'x') continue;
			points.push(axis === 'x' ? r.left : r.top, axis === 'x' ? r.right : r.bottom);
		}
		let best = client;
		let dist = SNAP;
		for (const p of points) {
			const d = Math.abs(p - client);
			if (d < dist) {
				dist = d;
				best = p;
			}
		}
		return {
			at: best,
			guide: best === client ? null : ((best - origin) / span) * 100
		};
	}

	function clampWidth(fraction: number): number {
		return Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, fraction));
	}

	/** The nearest still to the right, so a side drag stops at its edge. */
	function rightLimit(root: HTMLElement, self: HTMLElement): number {
		const mine = self.getBoundingClientRect();
		let limit = root.getBoundingClientRect().right;
		for (const fig of otherFrames(root, new Set([self]))) {
			const r = fig.getBoundingClientRect();
			const overlap = Math.min(mine.bottom, r.bottom) - Math.max(mine.top, r.top);
			if (overlap < 12 || r.left < mine.right - 4) continue;
			limit = Math.min(limit, r.left - 2);
		}
		return limit;
	}

	/**
	 * Edit mode: drag a frame's top or bottom edge to reshape it; the picture fills
	 * the new shape. The drag snaps to other stills' edges and to the same height.
	 * Saves on release; a double-click goes back to the picture's own shape.
	 */
	function edgeDrag(slotId: string, side: 'top' | 'bottom'): Attachment<HTMLElement> {
		return (handle) => {
			const sign = side === 'bottom' ? 1 : -1;
			const noNativeDrag = (e: MouseEvent) => e.preventDefault();
			const onDown = (e: PointerEvent) => {
				const frame = handle.closest<HTMLElement>('figure');
				if (e.button !== 0 || !frame) return;
				e.preventDefault();
				e.stopPropagation();
				const root = snapRoot(frame);
				const before = cueLayoutOf(slotId).crop;
				const y0 = e.clientY;
				const h0 = frame.getBoundingClientRect().height;
				let crop = before ?? frame.getBoundingClientRect().width / h0;
				const onMove = (ev: PointerEvent) => {
					const box = frame.getBoundingClientRect();
					const w = box.width;
					let h = Math.max(w / CROP_MAX, Math.min(w / CROP_MIN, h0 + (ev.clientY - y0) * sign));
					const edge = side === 'bottom' ? box.top + h : box.bottom - h;
					const snapped = snapPoint(root, [frame], edge, 'y');
					h = side === 'bottom' ? snapped.at - box.top : box.bottom - snapped.at;
					if (!snapped.guide) {
						for (const fig of otherFrames(root, new Set([frame]))) {
							const oh = fig.getBoundingClientRect().height;
							if (Math.abs(oh - h) < SNAP) h = oh;
						}
					}
					h = Math.max(w / CROP_MAX, Math.min(w / CROP_MIN, h));
					crop = w / h;
					guide = snapped.guide == null ? null : { axis: 'y', px: snapped.at };
					previewCrop(slotId, crop);
				};
				const onUp = () => {
					window.removeEventListener('pointermove', onMove);
					window.removeEventListener('pointerup', onUp);
					window.removeEventListener('pointercancel', onUp);
					guide = null;
					if (crop !== before) void commitCrop(slotId, crop, before);
				};
				window.addEventListener('pointermove', onMove);
				window.addEventListener('pointerup', onUp);
				window.addEventListener('pointercancel', onUp);
			};
			const onReset = (e: MouseEvent) => {
				e.stopPropagation();
				const { crop } = cueLayoutOf(slotId);
				if (crop) void commitCrop(slotId, null, crop);
			};
			handle.addEventListener('mousedown', noNativeDrag);
			handle.addEventListener('pointerdown', onDown);
			handle.addEventListener('dblclick', onReset);
			return () => {
				handle.removeEventListener('mousedown', noNativeDrag);
				handle.removeEventListener('pointerdown', onDown);
				handle.removeEventListener('dblclick', onReset);
			};
		};
	}

	/**
	 * Edit mode: drag the right edge. Only this still's width changes; the one
	 * beside it keeps its width and the drag stops at its edge.
	 */
	function widthDrag(slotId: string): Attachment<HTMLElement> {
		return (handle) => {
			const noNativeDrag = (e: MouseEvent) => e.preventDefault();
			const onDown = (e: PointerEvent) => {
				const frame = handle.closest<HTMLElement>('figure');
				const stack = frame?.closest<HTMLElement>('.stack');
				if (e.button !== 0 || !frame || !stack) return;
				e.preventDefault();
				e.stopPropagation();
				const root = snapRoot(frame);
				const before = cueLayoutOf(slotId).width;
				const left0 = frame.getBoundingClientRect().left;
				const start = frame.getBoundingClientRect().width / stack.getBoundingClientRect().width;
				let width = start;
				const onMove = (ev: PointerEvent) => {
					const stackBox = stack.getBoundingClientRect();
					const snapped = snapPoint(root, [frame], ev.clientX, 'x');
					const x = Math.min(Math.max(snapped.at, left0 + 8), rightLimit(root, frame));
					width = clampWidth((x - left0) / stackBox.width);
					guide = snapped.guide != null && x === snapped.at ? { axis: 'x', px: x } : null;
					previewWidth(slotId, width);
				};
				const onUp = () => {
					window.removeEventListener('pointermove', onMove);
					window.removeEventListener('pointerup', onUp);
					window.removeEventListener('pointercancel', onUp);
					guide = null;
					if (Math.abs(width - start) > 0.008) void commitWidth(slotId, width, before);
					else previewWidth(slotId, before ?? null);
				};
				window.addEventListener('pointermove', onMove);
				window.addEventListener('pointerup', onUp);
				window.addEventListener('pointercancel', onUp);
			};
			const onReset = (e: MouseEvent) => {
				e.stopPropagation();
				const { width } = cueLayoutOf(slotId);
				if (width) void commitWidth(slotId, null, width);
			};
			handle.addEventListener('mousedown', noNativeDrag);
			handle.addEventListener('pointerdown', onDown);
			handle.addEventListener('dblclick', onReset);
			return () => {
				handle.removeEventListener('mousedown', noNativeDrag);
				handle.removeEventListener('pointerdown', onDown);
				handle.removeEventListener('dblclick', onReset);
			};
		};
	}

	/**
	 * The gutter between two side-by-side stills. Dragging it trades width:
	 * what one gains, the other loses.
	 */
	function seamDrag(leftKey: string, rightKey: string): Attachment<HTMLElement> {
		return (handle) => {
			const noNativeDrag = (e: MouseEvent) => e.preventDefault();
			const onDown = (e: PointerEvent) => {
				const stack = handle.closest<HTMLElement>('.stack');
				const left = stack?.querySelector<HTMLElement>(`[data-key="${CSS.escape(leftKey)}"]`);
				const right = stack?.querySelector<HTMLElement>(`[data-key="${CSS.escape(rightKey)}"]`);
				if (e.button !== 0 || !stack || !left || !right) return;
				e.preventDefault();
				e.stopPropagation();
				const leftId = left.dataset.slot ?? '';
				const rightId = right.dataset.slot ?? '';
				if (!leftId || !rightId || leftId === rightId) return;
				const root = snapRoot(left);
				const box0 = stack.getBoundingClientRect();
				const l0 = left.getBoundingClientRect();
				const r0 = right.getBoundingClientRect();
				const sum = (l0.width + r0.width) / box0.width;
				const startL = l0.width / box0.width;
				const beforeL = cueLayoutOf(leftId).width;
				const beforeR = cueLayoutOf(rightId).width;
				let lw = startL;
				let rw = r0.width / box0.width;
				const onMove = (ev: PointerEvent) => {
					const box = stack.getBoundingClientRect();
					const snapped = snapPoint(root, [left, right], ev.clientX, 'x');
					const best = snapped.at;
					lw = (best - l0.left) / box.width;
					rw = sum - lw;
					if (rw < WIDTH_MIN) {
						rw = WIDTH_MIN;
						lw = sum - rw;
					}
					if (lw < WIDTH_MIN) {
						lw = WIDTH_MIN;
						rw = sum - lw;
					}
					lw = clampWidth(lw);
					rw = clampWidth(rw);
					guide = snapped.guide != null ? { axis: 'x', px: l0.left + lw * box.width } : null;
					previewWidth(leftId, lw);
					previewWidth(rightId, rw);
				};
				const onUp = () => {
					window.removeEventListener('pointermove', onMove);
					window.removeEventListener('pointerup', onUp);
					window.removeEventListener('pointercancel', onUp);
					guide = null;
					if (Math.abs(lw - startL) <= 0.008) {
						previewWidth(leftId, beforeL ?? null);
						previewWidth(rightId, beforeR ?? null);
						return;
					}
					void (async () => {
						await commitWidth(leftId, lw, beforeL);
						await commitWidth(rightId, rw, beforeR);
					})();
				};
				window.addEventListener('pointermove', onMove);
				window.addEventListener('pointerup', onUp);
				window.addEventListener('pointercancel', onUp);
			};
			handle.addEventListener('mousedown', noNativeDrag);
			handle.addEventListener('pointerdown', onDown);
			return () => {
				handle.removeEventListener('mousedown', noNativeDrag);
				handle.removeEventListener('pointerdown', onDown);
			};
		};
	}

	$effect(() => {
		const root = stackRoot;
		const on = editUi.enabled && inline;
		void inlineRows;
		if (!on || !root) {
			seams = [];
			return;
		}
		let frame = 0;
		const measure = () => {
			const box = root.getBoundingClientRect();
			const figs = [...root.querySelectorAll<HTMLElement>('figure.frame')].map((el) => ({
				key: el.dataset.key ?? '',
				r: el.getBoundingClientRect()
			}));
			const next: Seam[] = [];
			for (const a of figs) {
				for (const b of figs) {
					if (!a.key || !b.key || a.key === b.key) continue;
					const gap = b.r.left - a.r.right;
					if (gap < -6 || gap > 36) continue;
					const top = Math.max(a.r.top, b.r.top);
					const bot = Math.min(a.r.bottom, b.r.bottom);
					if (bot - top < 24) continue;
					next.push({
						key: `${a.key}|${b.key}`,
						leftKey: a.key,
						rightKey: b.key,
						left: (a.r.right + b.r.left) / 2 - box.left,
						top: top - box.top,
						height: bot - top
					});
				}
			}
			seams = next;
		};
		frame = requestAnimationFrame(measure);
		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		});
		ro.observe(root);
		return () => {
			cancelAnimationFrame(frame);
			ro.disconnect();
		};
	});

	/** Edit mode: drag inside a cropped frame to slide which part of the picture shows. */
	function panDrag(slotId: string): Attachment<HTMLElement> {
		return (handle) => {
			const noNativeDrag = (e: MouseEvent) => e.preventDefault();
			const onDown = (e: PointerEvent) => {
				const frame = handle.closest<HTMLElement>('figure');
				if (e.button !== 0 || !frame) return;
				e.preventDefault();
				e.stopPropagation();
				const before = cueLayoutOf(slotId).focus;
				const x0 = e.clientX;
				const y0 = e.clientY;
				const start = before ?? { x: 50, y: 50 };
				let focus = start;
				handle.setPointerCapture(e.pointerId);
				const onMove = (ev: PointerEvent) => {
					const box = frame.getBoundingClientRect();
					focus = {
						x: start.x - ((ev.clientX - x0) / box.width) * 100,
						y: start.y - ((ev.clientY - y0) / box.height) * 100
					};
					previewFocus(slotId, focus);
				};
				const onUp = () => {
					handle.removeEventListener('pointermove', onMove);
					handle.removeEventListener('pointerup', onUp);
					handle.removeEventListener('pointercancel', onUp);
					void commitFocus(slotId, focus, before);
				};
				handle.addEventListener('pointermove', onMove);
				handle.addEventListener('pointerup', onUp);
				handle.addEventListener('pointercancel', onUp);
			};
			handle.addEventListener('mousedown', noNativeDrag);
			handle.addEventListener('pointerdown', onDown);
			return () => {
				handle.removeEventListener('mousedown', noNativeDrag);
				handle.removeEventListener('pointerdown', onDown);
			};
		};
	}
</script>

<!--
	Sticky single-frame stack: all slots occupy one viewport; scroll position
	picks which frame is live (symmetric, no IO hysteresis). Reading prefers
	final `src` over temp stand-in. Slots with no resolvable art are dropped,
	except in edit mode, where they show id + prompt.

	Inline layout (script mode): every frame sits in reading order at its own
	proportions, always visible — no reveal, no crop. Runs of ordinary frames
	pair up as a two-column masonry; panoramas, tall portraits and lone frames
	stand alone. Final art leads; a distinct temp stand-in is shown beside it
	so references are not hidden behind a locked-in `src`.
-->
<!-- Comic mode: the speaker's line in a white balloon over the still. -->
{#snippet balloon(slot: StackImage)}
	<ComicBalloon id={slot.id} say={slot.say} preview={editUi.enabled} />
{/snippet}

<!-- The same beat from the other telling, small in the corner; or, shown side by side, which telling this is. -->
{#snippet inset(slot: StackImage)}
	{#if slot.inset}
		<img class="inset" src={slot.inset} alt="" loading="lazy" decoding="async" />
	{/if}
	{#if slot.version}
		<span class="version-tag">
			<CardTag icons={[slot.version]} colors={[VERSION_TAG[slot.version].color]} label={VERSION_TAG[slot.version].label} />
		</span>
	{/if}
{/snippet}

{#snippet inlineFigure(it: InlineItem, sizes: string)}
	{#if it.frame}
		{@const frame = it.frame}
		<figure
			class="frame art live"
			class:fitted={it.fitted}
			class:cropped={it.cropped}
			class:sized={it.slot.width != null}
			class:tall={!it.cropped && it.slot.width == null && it.ratio <= TALL_RATIO}
			data-key={it.key}
			data-slot={it.slot.id}
			style:--tone={it.slot.tone ?? '#3a3a40'}
			style:--w={it.slot.width}
			style:--ratio={it.ratio}
			style:--fx={it.slot.focus ? `${it.slot.focus.x}%` : undefined}
			style:--fy={it.slot.focus ? `${it.slot.focus.y}%` : undefined}
			style:--order={it.order}
			draggable={editUi.enabled ? 'true' : undefined}
			ondragstart={(e) => startCueDrag(e, it.slot.id)}
			{@attach stillMotion(slotMotion(it.slot))}
			oncontextmenu={(e) => onEditContextMenu(e, it.slot.id, frame.src)}
		>
			{#if paintSlot(it.index)}
				<button
					type="button"
					class="open"
					onclick={(e) => openAt(frame.src, e.currentTarget)}
					aria-label={`Open ${it.slot.alt ?? it.slot.id}`}
				>
					<img
						class="shot"
						onerror={() => markBrokenArt(frame.src)}
						{@attach measureRatio(frame.src)}
						{...storyImg(frame.src, {
							kind: 'cue',
							priority: priority && it.index === 0 && it.first,
							sizes,
							widths: [384, 640, 828, 1200],
							alt:
								frame.layer === 'temp'
									? `${it.slot.alt ?? it.slot.id} (temp)`
									: (it.slot.alt ?? '')
						})}
					/>
				</button>
				{#if it.first}{@render balloon(it.slot)}{/if}
				{@render inset(it.slot)}
			{/if}
			{#if editUi.enabled}
				<span class="thirds" aria-hidden="true"></span>
				<span class="edge top" title="Drag to resize · double-click for the original" {@attach edgeDrag(it.slot.id, 'top')}></span>
				<span class="edge bottom" title="Drag to resize · double-click for the original" {@attach edgeDrag(it.slot.id, 'bottom')}></span>
				<span class="edge side" title="Drag to set the width · double-click to reset" {@attach widthDrag(it.slot.id)}></span>
				{#if it.cropped}
					<span class="pan" title="Drag to slide the crop" {@attach panDrag(it.slot.id)}></span>
				{/if}
			{/if}
		</figure>
	{:else}
		<figure
			class="frame live"
			class:sized={it.slot.width != null}
			data-key={it.key}
			data-slot={it.slot.id}
			style:--tone={it.slot.tone ?? '#3a3a40'}
			style:--w={it.slot.width}
			style:--ratio={it.ratio}
			style:--order={it.order}
		>
			<div class="ph">
				<div class="cue">
					<span class="cue-id">{it.slot.id}</span>
					<p class="cue-prompt">{cueText(it.slot)}</p>
				</div>
			</div>
		</figure>
	{/if}
{/snippet}

{#if visible.length}
<div class="stack" class:immersion class:inline class:track bind:this={stackRoot} {@attach watchLive} {@attach watchNear}>
	{#if track}
		<div class="cue-rail" style:--live={live}>
			{#each visible as slot, i (`${slot.id}:${i}`)}
				{@const art = readingArt(slot)}
				<figure
					class="frame"
					class:art={!!art}
					class:live={i === live}
					class:past={i < live}
					class:next={i > live}
					class:far={i > live + TRACK_AHEAD}
					style:--tone={slot.tone ?? '#3a3a40'}
					style:--ahead={Math.max(0, i - live)}
					{@attach stillMotion(slotMotion(slot))}
					oncontextmenu={(e) => onEditContextMenu(e, slot.id, art)}
				>
					{#if art && paintSlot(i)}
						<button
							type="button"
							class="open"
							tabindex={i === live ? 0 : -1}
							onclick={(e) => openAt(art, e.currentTarget)}
							aria-label={`Open ${slot.alt ?? slot.id}`}
						>
							<img
								class="shot"
								onerror={() => markBrokenArt(art)}
								{...storyImg(art, {
									kind: 'cue',
									priority: priority && i === 0,
									sizes: CUE_SIZES,
									alt: slot.alt ?? ''
								})}
							/>
						</button>
						{#if i === live}{@render balloon(slot)}{/if}
					{:else if !art}
						<div class="ph">
							<div class="cue">
								<span class="cue-id">{slot.id}</span>
								<p class="cue-prompt">{cueText(slot)}</p>
							</div>
						</div>
					{/if}
					{#if visible.length > 1}
						<figcaption class="count" aria-hidden="true">{i + 1}/{visible.length}</figcaption>
					{/if}
				</figure>
			{/each}
		</div>
	{:else if inline}
		{#each inlineRows as row (row.key)}
			{#if 'solo' in row}
				<div class="solo">{@render inlineFigure(row.solo, SOLO_SIZES)}</div>
			{:else if 'compare' in row}
				{@const { myth, reality } = row.compare}
				<div class="solo">
					{#if paintSlot(myth.index)}
						<MythRealityCompare
							myth={{ src: myth.frame!.src, alt: myth.slot.alt ?? myth.slot.id }}
							reality={{ src: reality.frame!.src, alt: reality.slot.alt ?? reality.slot.id }}
							ratio={myth.ratio}
							sizes={SOLO_SIZES}
							oncontextmenu={(e, side) => {
								const it = side === 'myth' ? myth : reality;
								onEditContextMenu(e, it.slot.id, it.frame?.src);
							}}
						/>
					{:else}
						<figure class="frame live" style:--ratio={myth.ratio} style:--tone={myth.slot.tone ?? '#3a3a40'}></figure>
					{/if}
				</div>
			{:else}
				<div class="pair">
					{#each row.cols as col, c (c)}
						<div class="col">
							{#each col as it (it.key)}
								{@render inlineFigure(it, PAIR_SIZES)}
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		{/each}
		{#if editUi.enabled}
			{#each seams as seam (seam.key)}
				<span
					class="seam"
					style:left="{seam.left}px"
					style:top="{seam.top}px"
					style:height="{seam.height}px"
					title="Drag to split the width"
					{@attach seamDrag(seam.leftKey, seam.rightKey)}
				></span>
			{/each}
		{/if}
		{#if guide}
			<i class="guide {guide.axis}" style:left={guide.axis === 'x' ? `${guide.px}px` : undefined} style:top={guide.axis === 'y' ? `${guide.px}px` : undefined}></i>
		{/if}
	{:else}
		{#each visible as slot, i (`${slot.id}:${i}`)}
			{@const art = readingArt(slot)}
			{@const fit = naturalRatio(art)}
			<figure
				class="frame"
				class:art={!!art}
				class:live={i === live}
				class:fitted={fit != null}
				style:--ratio={immersion ? '3 / 2' : (fit ?? slot.ratio ?? 2)}
				style:--tone={slot.tone ?? '#3a3a40'}
				{@attach revealFrame(i)}
				{@attach stillMotion(slotMotion(slot))}
				oncontextmenu={(e) => onEditContextMenu(e, slot.id, art)}
			>
				{#if art && paintSlot(i)}
					<button
						type="button"
						class="open"
						onclick={(e) => openAt(art, e.currentTarget)}
						aria-label={`Open ${slot.alt ?? slot.id}`}
					>
						<img
							class="shot"
							onerror={() => markBrokenArt(art)}
							{@attach measureRatio(art)}
							{...storyImg(art, {
								kind: 'cue',
								priority: priority && i === 0,
								sizes: CUE_SIZES,
								alt: slot.alt ?? ''
							})}
						/>
					</button>
					{@render balloon(slot)}
					{@render inset(slot)}
				{:else if !art}
					<div class="ph">
						<div class="cue">
							<span class="cue-id">{slot.id}</span>
							<p class="cue-prompt">{cueText(slot)}</p>
						</div>
					</div>
				{/if}

				{#if visible.length > 1}
					<figcaption class="count" aria-hidden="true">{i + 1}/{visible.length}</figcaption>
				{/if}
			</figure>
		{/each}
	{/if}
</div>
{/if}

<style>
	.stack {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 12rem;
		display: grid;
		place-items: center;
	}

	.version-tag {
		position: absolute;
		top: 0.6rem;
		left: 0.6rem;
		z-index: 3;
		pointer-events: none;
	}

	.inset {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		width: 28%;
		aspect-ratio: 2;
		object-fit: cover;
		border: 2px solid rgb(255 255 255 / 0.85);
		box-shadow: 0 4px 14px rgb(0 0 0 / 0.55);
		pointer-events: none;
		z-index: 2;
	}

	.frame {
		grid-area: 1 / 1;
		position: relative;
		margin: 0;
		width: 100%;
		max-height: 100%;
		aspect-ratio: var(--ratio);
		overflow: hidden;
		box-shadow: none;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 480ms var(--ease),
			visibility 0s linear 480ms;
	}

	.frame.live {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		transition-delay: 0s;
		z-index: 1;
	}

	.frame.art {
		background: color-mix(in srgb, var(--tone) 40%, #14141a);
	}

	/* Tone is only a loading placeholder; once the real ratio is known the frame is the image. */
	.frame.art.fitted {
		background: transparent;
	}

	.frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.open {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: zoom-in;
		font: inherit;
		color: inherit;
	}

	.ph {
		width: 100%;
		height: 100%;
		min-height: 10rem;
		display: grid;
		place-items: center;
		padding: 1.1rem;
		background: color-mix(in srgb, var(--tone) 55%, #14141a);
	}

	.cue {
		max-width: 18rem;
		text-align: left;
	}

	.cue-id {
		display: inline-block;
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
		padding-bottom: 0.28rem;
		margin-bottom: 0.55rem;
	}

	.cue-prompt {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.78rem;
		line-height: 1.45;
		letter-spacing: var(--tracking-display);
		color: rgba(255, 253, 248, 0.78);
		white-space: pre-wrap;
		user-select: text;
	}

	/* Immersion: horizontal / landscape 3:2 phone frame — width locked to the stage column. */
	.stack.immersion {
		width: 100%;
		height: auto;
		min-height: 0;
		place-items: stretch;
	}

	.stack.immersion .frame {
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 100%;
		max-height: none;
		aspect-ratio: 3 / 2;
		background: #14141a;
		border-radius: var(--widget-radius);
	}

	.stack.immersion .open,
	.stack.immersion .shot,
	.stack.immersion .ph {
		grid-area: 1 / 1;
	}

	.stack.immersion .shot {
		z-index: 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	/* ————— Track (immersion scenes panel) —————
	   Every frame 3:2 at the column's width, one under the next. The rail
	   rises one frame per cue, so the live still sits on top and the next
	   ones wait underneath, the same size but dimmer, until it is their turn. */
	.stack.track {
		--track-gap: 0.7rem;
		display: block;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		container-type: size;
		mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 4rem), transparent 100%);
	}

	.cue-rail {
		display: flex;
		flex-direction: column;
		gap: var(--track-gap);
		transform: translateY(calc(var(--live) * -1 * (100cqw * 2 / 3 + var(--track-gap))));
		transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.stack.track .frame {
		grid-area: auto;
		display: grid;
		flex: none;
		width: 100%;
		max-height: none;
		aspect-ratio: 3 / 2;
		border-radius: var(--widget-radius);
		background: #14141a;
		visibility: visible;
		transform-origin: center top;
		transition:
			opacity 560ms var(--ease),
			filter 560ms var(--ease);
	}

	.stack.track .frame.live {
		opacity: 1;
		pointer-events: auto;
	}

	.stack.track .frame.next {
		opacity: calc(0.62 - var(--ahead) * 0.12);
		filter: saturate(0.7);
		pointer-events: auto;
	}

	.stack.track .frame.past,
	.stack.track .frame.far {
		opacity: 0;
		pointer-events: none;
	}

	.stack.track .open,
	.stack.track .shot,
	.stack.track .ph {
		grid-area: 1 / 1;
	}

	.stack.track .shot {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	@media (prefers-reduced-motion: reduce) {
		.cue-rail {
			transition: none;
		}
	}

	/* ————— Inline (script) —————
	   Every frame in reading order at the prose column's width. Width is the
	   column and height follows --ratio, so lazy decode cannot shove the page
	   (that was the mid-scroll jump). Runs of ordinary frames share a
	   two-column masonry; panoramas, tall portraits and lone frames stand alone. */
	.stack.inline {
		--inline-gap: 0.6rem;
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: var(--inline-gap);
		height: auto;
		min-height: 0;
		place-items: stretch;
	}

	.pair {
		display: grid;
		grid-template-columns: max-content max-content;
		justify-content: start;
		align-items: start;
		gap: var(--inline-gap);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: var(--inline-gap);
		min-width: 0;
	}

	.stack.inline .frame {
		grid-area: auto;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		height: auto;
		max-height: none;
		aspect-ratio: var(--ratio, 2);
		contain: layout style;
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		z-index: auto;
		/* Always present: nothing to fade, nothing to slide. */
		transition: none;
		border-radius: var(--widget-radius);
		overflow: hidden;
	}

	/* A dragged width is this still only. Pair-mates keep half the column. */
	.stack.inline .pair .frame {
		width: calc((100cqi - var(--inline-gap)) / 2);
	}

	.stack.inline .frame.sized {
		width: calc(var(--w) * 100cqi);
		max-width: 100cqi;
		height: auto;
	}

	/* A standalone portrait would run screens tall at full width: cap its height, centre it. */
	.solo .frame.tall {
		width: auto;
		height: min(78dvh, 40rem);
		margin-inline: auto;
	}

	.stack.inline .open {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
	}

	.stack.inline .frame img {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	/* A dragged shape: the picture fills it. --fx/--fy slide the window. */
	.stack.inline .frame.cropped img {
		object-fit: cover;
		object-position: var(--fx, 50%) var(--fy, 50%);
	}

	.thirds {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
		opacity: 0;
		background:
			linear-gradient(to right, transparent 33%, rgb(255 255 255 / 0.45) 33%, rgb(255 255 255 / 0.45) calc(33% + 1px), transparent calc(33% + 1px)),
			linear-gradient(to right, transparent 66%, rgb(255 255 255 / 0.45) 66%, rgb(255 255 255 / 0.45) calc(66% + 1px), transparent calc(66% + 1px)),
			linear-gradient(to bottom, transparent 33%, rgb(255 255 255 / 0.45) 33%, rgb(255 255 255 / 0.45) calc(33% + 1px), transparent calc(33% + 1px)),
			linear-gradient(to bottom, transparent 66%, rgb(255 255 255 / 0.45) 66%, rgb(255 255 255 / 0.45) calc(66% + 1px), transparent calc(66% + 1px));
	}

	.frame:hover .thirds {
		opacity: 1;
	}

	.pan {
		position: absolute;
		z-index: 4;
		left: 50%;
		top: 50%;
		width: 1.6rem;
		height: 1.6rem;
		translate: -50% -50%;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.45);
		cursor: move;
		touch-action: none;
	}

	/* Edit mode: the frame's top and bottom edges drag to reshape it. */
	.edge {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 12px;
		cursor: ns-resize;
		touch-action: none;
	}

	.edge.top {
		top: 0;
	}

	.edge.bottom {
		bottom: 0;
	}

	.edge.side {
		top: 0;
		bottom: 0;
		left: auto;
		right: 0;
		width: 14px;
		height: auto;
		cursor: ew-resize;
	}

	.edge.side::after {
		left: auto;
		right: 4px;
		top: 50%;
		width: 4px;
		height: 2.5rem;
		translate: 0 -50%;
	}

	.seam {
		position: absolute;
		z-index: 5;
		width: 14px;
		translate: -50% 0;
		cursor: ew-resize;
		touch-action: none;
	}

	.seam::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 4px;
		height: 2.5rem;
		translate: -50% -50%;
		border-radius: 2px;
		background: rgb(255 255 255 / 0.9);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.4);
	}

	.guide {
		position: fixed;
		z-index: 40;
		pointer-events: none;
		background: #fff;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.45);
	}

	.guide.x {
		top: 0;
		bottom: 0;
		width: 1px;
	}

	.guide.y {
		left: 0;
		right: 0;
		height: 1px;
	}

	.edge::after {
		content: '';
		position: absolute;
		left: 50%;
		width: 2.5rem;
		height: 4px;
		translate: -50% 0;
		border-radius: 2px;
		background: rgb(255 255 255 / 0.85);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35);
		opacity: 0;
		transition: opacity 160ms var(--ease);
	}

	.edge.top::after {
		top: 4px;
	}

	.edge.bottom::after {
		bottom: 4px;
	}

	.frame:hover .edge::after,
	.edge:active::after {
		opacity: 1;
	}

	.stack.inline .ph {
		width: 100%;
		height: 100%;
		min-height: 0;
		padding: 0.5rem 0.7rem;
	}

	.stack.inline .cue-prompt {
		font-size: 0.7rem;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Phones: one column. The masonry columns dissolve and each figure takes
	   back its reading-order slot. */
	@media (max-width: 599px) {
		.pair {
			display: flex;
			flex-direction: column;
		}

		.stack.inline .pair .frame,
		.stack.inline .frame.sized {
			width: 100%;
		}

		.seam {
			display: none;
		}

		.col {
			display: contents;
		}

		.pair .frame {
			order: var(--order);
		}
	}

	.count {
		position: absolute;
		z-index: 2;
		right: 0.55rem;
		bottom: 0.55rem;
		padding: 0.1rem 0.45rem;
		font-size: 0.62rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		line-height: 1.6;
		color: rgba(255, 253, 248, 0.86);
		background: rgba(0, 0, 0, 0.42);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: var(--radius-pill);
		backdrop-filter: blur(6px);
		opacity: 0;
		transition: opacity 420ms var(--ease);
	}

	.frame.live .count {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.frame {
			transition: none;
		}
	}

	/* Narrow / portrait: cap the immersion reel so art leads the card without
	   owning the whole first screenful. Script keeps a calmer landscape + cues. */
	@media (max-width: 820px) {
		.stack {
			min-height: 0;
			width: 100%;
			padding: 0.65rem 1.1rem 0;
		}

		.stack.inline {
			padding: 0;
		}

		.stack:not(.immersion):not(.inline) .frame {
			max-height: min(38dvh, 16rem);
			border-radius: var(--widget-radius);
			overflow: hidden;
		}

		.stack.immersion .frame {
			width: 100%;
			margin-inline: auto;
			border-radius: var(--widget-radius);
		}

		.stack.immersion .shot {
			max-height: 100%;
			height: 100%;
			object-fit: cover;
		}

		.cue {
			max-width: 100%;
		}

		.cue-prompt {
			font-size: 0.72rem;
			display: -webkit-box;
			-webkit-line-clamp: 5;
			line-clamp: 5;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	@media (max-width: 480px) {
		.stack:not(.inline) {
			padding: 0.5rem 0.9rem 0;
		}
	}
</style>
