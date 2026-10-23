<script lang="ts">
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import type { Block } from '$lib/story';
	import { pinsToPanel, watchReached, widgetKey } from '$lib/pinnedWidgets.svelte';
	import { motionOf, widgetIn, type WidgetMotion } from '$lib/widgetMotion';
	import Blocks from './Blocks.svelte';

	/**
	 * Wide immersion's right column: each widget stands level with the spot
	 * the script would have drawn it, and arrives (with its kind's entrance,
	 * `$lib/widgetMotion`) once the reader reaches that cue. Each is drawn by
	 * `Blocks` itself (unpinned), with its own block list as context so
	 * letters, verse exchanges and testimonies still know their side and run.
	 */
	let { blocks, year = null }: { blocks: Block[]; year?: number | null } = $props();

	/** Room kept between two widgets whose cues sit close together. */
	const GAP = 16;

	type Pinned = { key: string; block: Block; source: Block[]; year: number | null; motion: WidgetMotion };

	let all = $derived.by(() => {
		const out: Pinned[] = [];
		const add = (b: Block, source: Block[], y: number | null) =>
			out.push({ key: widgetKey(b), block: b, source, year: y, motion: motionOf(b) });
		for (const b of blocks) {
			if (b.kind === 'flashback') {
				const inner = b.year ? Number(b.year) || year : year;
				for (const ib of b.blocks) if (pinsToPanel(ib)) add(ib, b.blocks, inner);
			} else if (pinsToPanel(b)) add(b, blocks, year);
		}
		return out;
	});

	let reached = $state<string[]>([]);
	let shown = $derived.by(() => {
		const keys = new Set(reached);
		return all.filter((w) => keys.has(w.key));
	});

	const track = watchReached('[data-widget]', (els) => {
		reached = els.map((el) => el.dataset.widget ?? '');
	});

	let reduce = $derived(prefersReducedMotion.current);

	/**
	 * Sets each widget's top to its cue's height in the script, nudged down
	 * just enough not to overlap the one above. Re-runs whenever the script
	 * or a widget changes size, never on scroll.
	 */
	const place: Attachment<HTMLElement> = (lane) => {
		const article = lane.closest<HTMLElement>('article.entry');
		if (!article) return;
		let raf = 0;
		const layout = () => {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
			const base = lane.getBoundingClientRect().top;
			let floor = -Infinity;
			for (const item of lane.querySelectorAll<HTMLElement>(':scope > .item')) {
				const mark = article.querySelector<HTMLElement>(`[data-widget="${item.dataset.key}"]`);
				if (!mark) continue;
				const top = Math.max(mark.getBoundingClientRect().top - base, floor);
				item.style.top = `${top}px`;
				floor = top + item.offsetHeight + GAP;
			}
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(layout);
		};
		const ro = new ResizeObserver(schedule);
		ro.observe(article);
		/* Runs before paint, so a widget never shows a frame at the lane's top. */
		const watchItems = () => {
			for (const item of lane.children) ro.observe(item);
			layout();
		};
		const mo = new MutationObserver(watchItems);
		mo.observe(lane, { childList: true });
		watchItems();
		return () => {
			if (raf) cancelAnimationFrame(raf);
			ro.disconnect();
			mo.disconnect();
		};
	};
</script>

<ol class="widget-lane" {@attach track} {@attach place}>
	{#each shown as w (w.key)}
		<li
			class="item {w.motion}"
			data-key={w.key}
			in:widgetIn={{ motion: w.motion, reduce }}
			out:fade={{ duration: reduce ? 0 : 180 }}
		>
			<Blocks blocks={[w.block]} year={w.year} sceneFrom={w.source} unpinned />
			{#if w.motion === 'plop'}
				<span class="pin material-symbols-outlined" aria-hidden="true">push_pin</span>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.widget-lane {
		position: relative;
		height: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.item {
		position: absolute;
		left: 0;
		right: 0;
		min-width: 0;
	}

	/* Widgets bring their own margins for the prose flow; the lane places them. */
	.item :global(.prose > *:first-child) {
		margin-top: 0;
	}

	.item :global(.prose > *:last-child) {
		margin-bottom: 0;
	}

	/* The battle map bleeds past the script column in the flow; here it fits the lane. */
	.item :global(.battle) {
		--wide: 100%;
		margin-inline: 0;
	}

	/* A place or a map lands with a pin pushed through its top edge. */
	.pin {
		position: absolute;
		top: -0.85rem;
		left: 50%;
		margin-left: -0.8rem;
		z-index: 3;
		font-size: 1.6rem;
		rotate: 24deg;
		font-variation-settings: 'FILL' 1;
		color: #e2483d;
		filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.45));
		pointer-events: none;
		opacity: 0;
		animation: pin-drop 620ms cubic-bezier(0.3, 1.5, 0.5, 1) 640ms forwards;
	}

	.pin::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0.05rem;
		width: 0.9rem;
		height: 0.3rem;
		margin-left: -0.45rem;
		border-radius: 50%;
		border: 2px solid #e2483d;
		opacity: 0;
		animation: pin-ring 900ms ease-out 1.1s;
	}

	@keyframes pin-drop {
		from {
			opacity: 0;
			transform: translateY(-1.6rem) scale(1.3);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes pin-ring {
		from {
			opacity: 0.9;
			transform: scale(0.4);
		}
		to {
			opacity: 0;
			transform: scale(2.6);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pin {
			opacity: 1;
			animation: none;
		}

		.pin::after {
			animation: none;
		}
	}
</style>
