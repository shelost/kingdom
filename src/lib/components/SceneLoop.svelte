<script lang="ts">
	import { untrack } from 'svelte';
	import { storyImg } from '$lib/img';

	let {
		frames,
		alt = '',
		live = false,
		/** Milliseconds per frame. */
		frameMs = 3000,
		kind = 'hero' as 'hero' | 'thumb' | 'cue',
		priority = false,
		sizes = '(max-width: 900px) 100vw, 72vw',
		onactivate,
		onmenu,
		onindex,
		cue = null
	}: {
		frames: readonly string[];
		alt?: string;
		/** When false, freeze on the first frame. */
		live?: boolean;
		frameMs?: number;
		kind?: 'hero' | 'thumb' | 'cue';
		priority?: boolean;
		sizes?: string;
		/** Click on the still (not the story bar) — e.g. arm + play. */
		onactivate?: () => void;
		/** Right-click on the still. Omit to keep the browser menu. */
		onmenu?: (event: MouseEvent, index: number) => void;
		/** Fires when the visible frame changes. */
		onindex?: (index: number) => void;
		/** Bump `token` to show `index` and restart the clock there. */
		cue?: { index: number; token: number } | null;
	} = $props();

	let index = $state(0);
	/** 0–1 progress through the current segment. */
	let progress = $state(0);
	let reduceMotion = $state(false);
	/** Bumped on segment click so the clock restarts on that frame. */
	let restartToken = $state(0);

	const list = $derived(frames.length > 0 ? frames : ['']);
	const duration = $derived(Math.max(1200, frameMs));

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			reduceMotion = mq.matches;
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	$effect(() => {
		const n = list.length;
		const ms = duration;
		const token = restartToken;
		void token;

		/* A deleted still shrinks the list: stay on the same slot, not frame one. */
		const kept = Math.min(untrack(() => index), Math.max(0, n - 1));
		if (!live || n < 2 || reduceMotion) {
			index = live ? kept : 0;
			progress = live && n >= 2 && reduceMotion ? 1 : 0;
			return;
		}

		let frame = kept;
		index = frame;
		progress = 0;
		let start = performance.now();
		let raf = 0;

		const tick = (now: number) => {
			const elapsed = now - start;
			progress = Math.min(1, elapsed / ms);
			if (elapsed >= ms) {
				frame = (frame + 1) % n;
				index = frame;
				progress = 0;
				start = now;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(raf);
	});

	function show(i: number) {
		if (i < 0 || i >= list.length) return;
		index = i;
		progress = 0;
		restartToken += 1;
	}

	/* Only a new cue token jumps. Everything else is untracked so segment clicks stick. */
	$effect(() => {
		const target = cue;
		if (!target) return;
		void target.token;
		untrack(() => show(target.index));
	});

	$effect(() => {
		const i = index;
		const report = onindex;
		untrack(() => report?.(i));
	});

	function jumpTo(i: number, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		show(i);
	}

	function fillFor(i: number): number {
		if (i < index) return 1;
		if (i > index) return 0;
		if (!live) return 0;
		if (reduceMotion) return 1;
		return progress;
	}

	function onStillClick() {
		onactivate?.();
	}

	function onStillKey(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onactivate?.();
		}
	}
</script>

<div class="loop" class:live>
	{#if list.length > 1}
		<div class="story" role="group" aria-label="Scene frames">
			{#each list as _, i (i)}
				<button
					type="button"
					class="seg"
					aria-label="Frame {i + 1} of {list.length}"
					aria-current={i === index ? 'true' : undefined}
					onclick={(e) => jumpTo(i, e)}
				>
					<span class="track" aria-hidden="true"></span>
					<span
						class="fill"
						aria-hidden="true"
						style:transform="scaleX({fillFor(i)})"
					></span>
				</button>
			{/each}
		</div>
	{/if}

	<div
		class="still"
		role="button"
		tabindex="0"
		aria-label={alt || 'Scene still'}
		onclick={onStillClick}
		onkeydown={onStillKey}
		oncontextmenu={onmenu
			? (e) => {
					e.preventDefault();
					onmenu(e, index);
				}
			: undefined}
	>
		{#each list as src, i (src)}
			<img
				class:on={i === index}
				{...storyImg(src, {
					kind,
					priority: priority && i === 0,
					sizes,
					alt: i === 0 ? alt : ''
				})}
				loading={i === 0 ? undefined : 'eager'}
			/>
		{/each}
	</div>
</div>

<style>
	.loop {
		position: absolute;
		inset: 0;
		display: block;
		overflow: hidden;
		background: #050506;
	}

	.story {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 4;
		display: flex;
		gap: 0.28rem;
		padding: max(0.55rem, env(safe-area-inset-top)) 0.7rem 0.45rem;
		pointer-events: auto;
	}

	.seg {
		position: relative;
		flex: 1 1 0;
		height: 0.2rem;
		padding: 0.55rem 0;
		margin: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		appearance: none;
	}

	.track,
	.fill {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 0.16rem;
		margin-top: -0.08rem;
		border-radius: 999px;
		pointer-events: none;
	}

	.track {
		background: rgba(255, 255, 255, 0.28);
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
	}

	.fill {
		background: #fff;
		transform-origin: left center;
		transform: scaleX(0);
		will-change: transform;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
	}

	.seg:hover .track {
		background: rgba(255, 255, 255, 0.4);
	}

	.seg:focus-visible {
		outline: none;
	}

	.seg:focus-visible .track {
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.85);
	}

	.still {
		position: absolute;
		inset: 0;
		display: block;
		margin: 0;
		padding: 0;
		border: none;
		background: #050506;
		cursor: pointer;
	}

	.still img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
		display: block;
		opacity: 0;
		transition: opacity 900ms ease;
		will-change: opacity;
		pointer-events: none;
	}

	.still img.on {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.still img {
			transition: none;
		}
	}
</style>
