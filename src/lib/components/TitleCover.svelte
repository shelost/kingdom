<script module lang="ts">
	/** The wide primary button: a link from the hub, a jump inside the reader. */
	export type CoverRead = { label: string; ep: string; href?: string; onclick?: () => void };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import StillWall, { WALL_STILLS, type WallStill } from '$lib/components/StillWall.svelte';
	import { storyStills } from '$lib/thumbnail.svelte';
	import { lineNear } from '$lib/comicSay';
	import { EPISODE_TOTAL, PARTS, STORY_RANGE } from '$lib/episodeDirectory';

	/**
	 * The King for All title screen: key art on the still wall, each still with a
	 * line from its moment floating over it, and a way in. `lead` sits beside the
	 * copy *under* the wall (the home page's map); pointing at it melts the wall away.
	 */
	let {
		ko,
		read,
		storyId,
		lead
	}: { ko: boolean; read: CoverRead | null; storyId?: string; lead?: Snippet } = $props();

	/** A full wall, every still different: starred ones first, then episode thumbnails. */
	let stills = $derived(
		storyStills(WALL_STILLS).map(({ slot, src }): WallStill => {
			const say = lineNear(slot.id);
			const text = ko ? say?.ko : say?.en;
			return { src, line: text ? { text, person: say?.person } : undefined };
		})
	);
	let revealed = $state(false);
</script>

{#snippet readBody(r: CoverRead)}
	<span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
	<span class="read-label">{r.label}</span>
	<span class="read-ep">{r.ep}</span>
{/snippet}

<StillWall {stills} {storyId} wide={!!lead} faded={revealed}>
	<div class="cover" class:split={!!lead}>
		{#if lead}
			<div
				class="cover-lead float-up"
				style:--i={0}
				role="presentation"
				onpointerenter={() => (revealed = true)}
				onpointerleave={() => (revealed = false)}
				onfocusin={() => (revealed = true)}
				onfocusout={() => (revealed = false)}
			>
				<div class="lead-plane">{@render lead()}</div>
			</div>
		{/if}
		<div class="cover-copy">
			<img class="cover-logo float-up" style:--i={1} src="/samhan_logo.png" alt="삼한왕검" width="512" height="508" />
			<h1 class="cover-title float-up" style:--i={2}>King for All</h1>
			<h2 class="cover-subtitle float-up" style:--i={3}>A Story Told In Parts</h2>
			<p class="cover-author float-up" style:--i={4}>Heewon Ahn · 안희원</p>
			<p class="cover-meta float-up" style:--i={5}>
				<span>{STORY_RANGE}</span>
				<span aria-hidden="true">·</span>
				<span>{PARTS.length} {ko ? '부' : 'Parts'}</span>
				<span aria-hidden="true">·</span>
				<span>{EPISODE_TOTAL} {ko ? '화' : 'episodes'}</span>
			</p>

			<div class="cover-actions">
				{#if read?.href}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- the caller resolves it -->
					<a class="cover-read float-up" style:--i={6} href={read.href}>{@render readBody(read)}</a>
				{:else if read}
					<button type="button" class="cover-read float-up" style:--i={6} onclick={read.onclick}
						>{@render readBody(read)}</button
					>
				{/if}
				<div class="cover-secondary float-up" style:--i={7}>
					<a class="cover-glass liquid-glass" href={resolve('/episodes')}>
						<span class="material-symbols-outlined" aria-hidden="true">grid_view</span>
						{ko ? '에피소드' : 'Episodes'}
					</a>
					<a class="cover-glass liquid-glass" href={resolve('/about')}>
						<span class="material-symbols-outlined" aria-hidden="true">info</span>
						{ko ? '소개' : 'About'}
					</a>
				</div>
			</div>
		</div>
	</div>
</StillWall>

<style>
	/* The cover copy sits centred on the still wall, like a Part page. */
	.cover,
	.cover-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* With a lead: the lead fills the centre-left, the copy stands to its right. */
	.cover.split {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 1fr);
		align-items: center;
		gap: clamp(1.5rem, 4vw, 4rem);
		width: 100%;
	}

	/* Beneath the wall's stacking layer (-1), so the stills drift over it. */
	.cover-lead {
		position: relative;
		z-index: -2;
		height: clamp(28rem, 84svh, 56rem);
		min-width: 0;
	}

	/* Tipped like the still wall's plane, so the map lies on the same floor. */
	.lead-plane {
		height: 100%;
		transform: perspective(1300px) rotateX(var(--tilt-x)) rotateZ(var(--tilt-z));
	}

	.cover-logo {
		display: block;
		width: clamp(6.5rem, 11vw, 9rem);
		height: auto;
		margin: 0 0 0.6rem;
		filter: var(--logo-filter);
	}

	.cover-meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
		margin: 1.25rem 0 0;
		font-family: var(--ui);
		font-size: 0.82rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	/* One wide primary (Read), two glass secondaries under it, sharing its width. */
	.cover-actions {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		/* Wider than the copy column on a phone: no auto margins, so the column's centring holds. */
		width: min(22rem, calc(100vw - 2.5rem));
		margin: 1.75rem 0 0;
	}

	.cover-read {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.55rem;
		width: 100%;
		padding: 0.8rem 1.3rem 0.8rem 1.05rem;
		border: none;
		border-radius: var(--radius);
		background: var(--highlight);
		color: var(--on-highlight);
		font-family: var(--ui);
		font-size: 0.95rem;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.25s var(--ease),
			opacity 0.25s var(--ease);
	}

	.cover-read:hover {
		opacity: 0.88;
	}

	.cover-read:active {
		transform: scale(0.97);
	}

	.cover-read:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 3px;
	}

	.cover-read .material-symbols-outlined {
		font-size: 1.25rem;
	}

	.read-label {
		font-weight: 600;
	}

	.read-ep {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-left: 0.6rem;
		border-left: 1px solid color-mix(in srgb, var(--on-highlight) 25%, transparent);
		font-weight: 500;
		opacity: 0.72;
	}

	.cover-secondary {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}

	/* Liquid glass (app.css); the shape and type are the button's own. */
	.cover-glass {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.45rem;
		padding: 0.7rem 1rem;
		border-radius: var(--radius);
		color: var(--fg-strong);
		font-family: var(--ui);
		font-size: 0.9rem;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.25s var(--ease),
			--glass-tint 0.25s var(--ease);
	}

	.cover-glass:hover {
		--glass-tint: 72%;
	}

	.cover-glass:active {
		transform: scale(0.97);
	}

	.cover-glass:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 3px;
	}

	.cover-glass .material-symbols-outlined {
		font-size: 1.1rem;
	}

	.cover-title {
		margin: 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 52px;
		line-height: 1;
		letter-spacing: -3px;
	}

	.cover-subtitle {
		margin: 0.55rem 0 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 24px;
		letter-spacing: -1px;
	}

	.cover-author {
		margin: 0.85rem 0 0;
		font-family: var(--serif);
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		color: var(--fg-dim);
	}

	@media (max-width: 900px) {
		.cover.split {
			grid-template-columns: 1fr;
		}

		.cover-lead {
			order: 2;
			height: min(30rem, 62svh);
		}
	}

	@media (max-width: 820px) {
		.cover-title {
			font-size: clamp(2.1rem, 9vw, 2.8rem);
			letter-spacing: -0.04em;
		}
	}

	@media (max-width: 480px) {
		.cover-subtitle {
			font-size: 1.05rem;
		}
	}
</style>
