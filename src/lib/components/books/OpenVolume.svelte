<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { volumeOf } from '$lib/books';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { EP_QUERY } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';
	import {
		continueQuery,
		leavesOf,
		spreadCount,
		spreadOf,
		type VolumeLeaf
	} from './volumeLeaves';

	/**
	 * Stripe Press–style open book on /books: cover + title + episode leaves
	 * as spreads, with a dock that hands off to /read.
	 */
	let {
		volumeId,
		ko = false,
		onclose
	}: {
		volumeId: string;
		ko?: boolean;
		onclose: () => void;
	} = $props();

	let volume = $derived(volumeOf(volumeId) ?? null);
	let leaves = $derived(volume ? leavesOf(volume, ko) : []);
	let total = $derived(spreadCount(leaves));
	let spread = $state(0);
	let still = $derived(prefersReducedMotion.current);
	let pair = $derived(spreadOf(leaves, spread));
	let continueId = $derived(
		volume ? continueQuery(leaves, spread, volume.queryId) : ''
	);
	let readHref = $derived(
		continueId.startsWith('/')
			? continueId
			: continueId
				? hrefWithNsfw(
						`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(continueId)}`,
						page.url
					)
				: resolve('/read')
	);

	function prev() {
		spread = Math.max(0, spread - 1);
	}

	function next() {
		spread = Math.min(total - 1, spread + 1);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}
</script>

<svelte:window onkeydown={onKey} />

{#if volume}
	<div
		class="open"
		role="dialog"
		aria-label={ko ? '펼친 책' : 'Open book'}
		in:fly={{ y: 18, duration: still ? 0 : 420, easing: cubicOut }}
		out:fly={{ y: 10, duration: still ? 0 : 220, easing: cubicOut }}
	>
		<div
			class="atmosphere"
			style:background-image={pair.left?.cover || pair.left?.poster
				? `url(${pair.left.cover || pair.left.poster})`
				: pair.right?.poster
					? `url(${pair.right.poster})`
					: undefined}
			aria-hidden="true"
		></div>

		<div class="stage">
			<div class="book" aria-live="polite">
				{#key `${volumeId}:${spread}`}
					<div class="spread" in:fly={{ x: still ? 0 : 16, duration: still ? 0 : 280, easing: cubicOut }}>
						{@render face(pair.left, 'left')}
						<span class="gutter" aria-hidden="true"></span>
						{@render face(pair.right, 'right')}
					</div>
				{/key}
			</div>
		</div>

		<div class="dock">
			<button type="button" class="nav" disabled={spread <= 0} aria-label={ui('Previous page')} onclick={prev}>
				<span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
			</button>
			<p class="pos">{spread + 1} / {total}</p>
			<button
				type="button"
				class="nav"
				disabled={spread >= total - 1}
				aria-label={ui('Next page')}
				onclick={next}
			>
				<span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
			</button>
			<a class="continue" href={readHref}>{ui('Continue reading')}</a>
			<button type="button" class="close" onclick={onclose}>{ui('Close book')}</button>
		</div>
	</div>
{/if}

{#snippet face(leaf: VolumeLeaf | undefined, side: 'left' | 'right')}
	<div class={['page', side, leaf?.kind ?? 'empty']}>
		{#if leaf?.kind === 'cover'}
			{#if leaf.cover}
				<img class="cover" src={leaf.cover} alt="" />
			{:else}
				<div class="cover empty">
					<p class={['heading', { han: ko }]}>{leaf.heading}</p>
				</div>
			{/if}
		{:else if leaf}
			<div class="ink">
				{#if leaf.kind === 'title'}
					<p class="kicker">{leaf.meta}</p>
					<h2 class={{ han: ko }}>{leaf.heading}</h2>
					{#if leaf.sub}
						<p class={['second', { han: !ko }]}>{leaf.sub}</p>
					{/if}
					{#if leaf.body}
						<p class="body">{leaf.body}</p>
					{/if}
				{:else}
					{#if leaf.poster}
						<img class="poster" src={leaf.poster} alt="" />
					{/if}
					<p class="kicker">{leaf.sub}</p>
					<h3 class={{ han: ko }}>{leaf.heading}</h3>
					{#if leaf.meta}
						<p class="meta">{leaf.meta}</p>
					{/if}
				{/if}
			</div>
		{:else}
			<span class="blank" aria-hidden="true"></span>
		{/if}
	</div>
{/snippet}

<style lang="scss">
	.open {
		position: absolute;
		inset: 0;
		z-index: 4;
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 0;
		overflow: hidden;
		background: color-mix(in srgb, var(--bg) 82%, #1a1612);
		color: var(--fg);
	}

	.atmosphere {
		position: absolute;
		inset: -8%;
		z-index: 0;
		background-position: center;
		background-size: cover;
		filter: blur(42px) saturate(0.85);
		opacity: 0.28;
		pointer-events: none;
		transform: scale(1.08);
	}

	.stage {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		min-height: 0;
		padding: 1.25rem 1.5rem 0.5rem;
	}

	.book {
		width: min(100%, 52rem);
		height: min(100%, 34rem);
		min-height: 16rem;
	}

	.spread {
		display: grid;
		grid-template-columns: 1fr 0.7rem 1fr;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 18px 40px color-mix(in srgb, #000 28%, transparent));
	}

	.gutter {
		background:
			linear-gradient(
				90deg,
				color-mix(in srgb, #000 22%, transparent),
				color-mix(in srgb, #000 8%, transparent) 45%,
				color-mix(in srgb, #000 8%, transparent) 55%,
				color-mix(in srgb, #000 22%, transparent)
			);
		border-radius: 1px;
	}

	.page {
		position: relative;
		overflow: hidden;
		background: #f4efe6;
		color: #1c1915;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, #000 8%, transparent);

		&.left {
			border-radius: 0.35rem 0 0 0.35rem;
		}
		&.right {
			border-radius: 0 0.35rem 0.35rem 0;
		}
		&.empty,
		&.cover {
			background: #171412;
			color: #f4efe6;
		}
	}

	.cover {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;

		&.empty {
			display: grid;
			place-items: center;
			padding: 1.5rem;
			text-align: center;
		}

		.heading {
			margin: 0;
			font-family: var(--display, Georgia, serif);
			font-size: clamp(1.2rem, 2.4vw, 1.85rem);
			line-height: 1.25;
		}
	}

	.ink {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		height: 100%;
		padding: 1.35rem 1.4rem 1.5rem;
		box-sizing: border-box;
	}

	.poster {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		max-height: 48%;
		margin: 0 auto 0.35rem;
		object-fit: cover;
		border-radius: 0.2rem;
		box-shadow: 0 8px 20px color-mix(in srgb, #000 18%, transparent);
	}

	.kicker,
	.meta {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, #1c1915 55%, transparent);
	}

	h2,
	h3 {
		margin: 0;
		font-family: var(--display, Georgia, serif);
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	h2 {
		font-size: clamp(1.45rem, 2.6vw, 2.1rem);
	}

	h3 {
		font-size: clamp(1.15rem, 2vw, 1.55rem);
	}

	.second {
		margin: 0;
		font-family: var(--display, Georgia, serif);
		font-style: italic;
		font-size: 0.95rem;
		color: color-mix(in srgb, #1c1915 62%, transparent);
	}

	.body {
		margin: 0.4rem 0 0;
		font-family: var(--ui);
		font-size: 0.92rem;
		line-height: 1.55;
		color: color-mix(in srgb, #1c1915 82%, transparent);
		overflow: auto;
	}

	.blank {
		display: block;
		height: 100%;
		background:
			repeating-linear-gradient(
				0deg,
				transparent,
				transparent 1.55rem,
				color-mix(in srgb, #1c1915 5%, transparent) 1.55rem,
				color-mix(in srgb, #1c1915 5%, transparent) 1.58rem
			);
		opacity: 0.55;
	}

	.han {
		font-family: var(--display-ko, var(--display, Georgia, serif));
		letter-spacing: 0;
	}

	.dock {
		position: relative;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.45rem 0.65rem;
		padding: 0.75rem 1rem calc(0.9rem + var(--tabbar-space, 0px));
	}

	.nav,
	.close,
	.continue {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		min-height: 2rem;
		padding: 0.35rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		color: var(--fg);
		font-family: var(--ui);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-decoration: none;
		cursor: pointer;
	}

	.nav {
		padding: 0.3rem;
		& .material-symbols-outlined {
			font-size: 1.15rem;
		}
		&:disabled {
			opacity: 0.35;
			cursor: default;
		}
	}

	.pos {
		margin: 0 0.15rem;
		min-width: 3.5rem;
		text-align: center;
		font-family: var(--ui);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--fg-dim);
		font-variant-numeric: tabular-nums;
	}

	.continue {
		border-color: transparent;
		background: var(--gold, #c4a35a);
		color: #16130f;
		font-weight: 600;
	}

	.close:hover,
	.nav:not(:disabled):hover,
	.continue:hover {
		filter: brightness(1.05);
	}

	@media (max-width: 720px) {
		.spread {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 0 1fr;
			gap: 0.45rem;
		}
		.gutter {
			display: none;
		}
		.page.left,
		.page.right {
			border-radius: 0.35rem;
		}
		.book {
			height: min(100%, 40rem);
		}
	}
</style>
