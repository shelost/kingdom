<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import ComicBookCanvas from '$lib/components/comic/ComicBookCanvas.svelte';
	import ComicPageSheet from '$lib/components/comic/ComicPageSheet.svelte';
	import { hasWebGL } from '$lib/components/diagrams/three/kit.svelte';
	import { comicUi } from '$lib/comicUi.svelte';
	import type { ComicStory } from '$lib/comic';

	let {
		story,
		n,
		onturn
	}: {
		story: ComicStory;
		n: number;
		onturn: (p: number) => void;
	} = $props();

	const reduced = new MediaQuery('(prefers-reduced-motion: reduce)');
	const total = $derived(story.pages.length);

	let gl = $state(false);
	let host = $state<HTMLDivElement | undefined>();
	let box = $state({ w: 0, h: 0 });
	let lastStory = '';
	let live = $state(false);

	onMount(() => {
		live = true;
		lastStory = story.id;
		gl = hasWebGL();
		displayed = n;
		incoming = Math.min(n + 1, story.pages.length);
		if (!host) return;
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			box = { w: width, h: height };
		});
		ro.observe(host);
		return () => ro.disconnect();
	});

	const fit = $derived.by(() => {
		const ratio = 210 / 297;
		if (box.w < 8 || box.h < 8) return { w: 0, h: 0 };
		if (box.w / box.h > ratio) return { w: box.h * ratio, h: box.h };
		return { w: box.w, h: box.w / ratio };
	});

	const angle = new Tween(0, { duration: 720, easing: cubicInOut });
	let displayed = $state(1);
	let incoming = $state(2);
	let busy = $state(false);

	const showing = $derived(busy && Math.abs(n - displayed) === 1 ? displayed : n);
	const front = $derived(story.pages[showing - 1] ?? story.pages[0]);
	const under = $derived(story.pages[incoming - 1] ?? story.pages[Math.min(showing, total) - 1]);

	$effect(() => {
		if (!live) return;
		const id = story.id;
		const target = n;
		untrack(() => {
			const swapped = id !== lastStory;
			lastStory = id;
			if (target === displayed && !swapped) return;
			const jump = swapped || busy || Math.abs(target - displayed) > 1 || reduced.current;
			if (jump) {
				displayed = target;
				incoming = Math.min(target + 1, total);
				busy = false;
				void angle.set(0, { duration: 0 });
				return;
			}
			void animateTo(target);
		});
	});

	async function animateTo(target: number) {
		const to = Math.min(total, Math.max(1, target));
		if (to === displayed || busy) return;
		busy = true;
		const from = displayed;
		if (reduced.current) {
			displayed = to;
			incoming = Math.min(to + 1, total);
			await angle.set(0, { duration: 0 });
			busy = false;
			if (n !== displayed) void animateTo(n);
			return;
		}
		try {
			if (to > from) {
				incoming = to;
				await tick();
				await angle.set(Math.PI);
				displayed = to;
				incoming = Math.min(to + 1, total);
				await angle.set(0, { duration: 0 });
			} else {
				incoming = from;
				displayed = to;
				await angle.set(Math.PI, { duration: 0 });
				await tick();
				await angle.set(0);
				incoming = Math.min(to + 1, total);
			}
		} finally {
			busy = false;
			if (n !== displayed) void animateTo(n);
		}
	}

</script>

<div class="host" bind:this={host}>
<div
	class="book"
	style:--flip={angle.current / Math.PI}
	style:width={fit.w ? `${fit.w}px` : '100%'}
	style:height={fit.h ? `${fit.h}px` : '100%'}
>
	{#if gl}
		<div class="shell">
			<ComicBookCanvas angle={angle.current} />
		</div>
	{/if}

	<div class="leaves">
		{#if under && incoming !== displayed}
			<div class="leaf under" aria-hidden="true">
				<ComicPageSheet
					page={under}
					year={story.year}
					n={incoming}
					ink={comicUi.ink}
					series={story.title}
				/>
			</div>
		{/if}
		{#if front}
			<div class="leaf front">
				<ComicPageSheet
					page={front}
					year={story.year}
					n={showing}
					ink={comicUi.ink}
					series={story.title}
				/>
			</div>
		{/if}
	</div>

	<button
		type="button"
		class="hit back"
		disabled={n <= 1}
		aria-label="Previous page"
		onclick={() => onturn(n - 1)}
	></button>
	<button
		type="button"
		class="hit next"
		disabled={n >= total}
		aria-label="Next page"
		onclick={() => onturn(n + 1)}
	></button>
</div>
</div>

<style>
	.host {
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		display: grid;
		place-items: center;
	}

	.book {
		position: relative;
		isolation: isolate;
	}

	.hit {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 3;
		width: 28%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
	}

	.hit.back {
		left: 0;
	}

	.hit.next {
		right: 0;
	}

	.hit:disabled {
		cursor: default;
	}

	.shell {
		position: absolute;
		inset: -7% -9% -11% -11%;
		z-index: 0;
		pointer-events: none;
	}

	.leaves {
		position: absolute;
		inset: 0;
		z-index: 2;
		isolation: isolate;
		perspective: 1800px;
		transform-style: preserve-3d;
	}

	.leaf {
		position: absolute;
		inset: 0;
		transform-origin: left center;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		overflow: hidden;
		background: #111213;
		z-index: 1;
		box-shadow:
			0 0 0 1px color-mix(in srgb, #000 55%, transparent),
			0.35rem 0.55rem 1.4rem color-mix(in srgb, #000 38%, transparent);
	}

	.leaf.under {
		z-index: 0;
	}

	.leaf.front {
		z-index: 1;
		transform: rotateY(calc(var(--flip) * -180deg));
		transform-style: preserve-3d;
	}

	.leaf.front::after {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 14%;
		pointer-events: none;
		background: linear-gradient(
			to right,
			color-mix(in srgb, #000 calc(var(--flip) * 42%), transparent),
			transparent
		);
	}

	@media (prefers-reduced-motion: reduce) {
		.leaf.front {
			transition: none;
		}
	}
</style>
