<script lang="ts">
	/**
	 * A crisp DOM label pinned to a point in the scene (Korean, hanja,
	 * English). Text stays real text: readable, selectable, bilingual. On a
	 * phone-sized canvas it collapses to the reader's language and `minor`
	 * labels drop out, so neighbours don't collide.
	 */
	import type { Snippet } from 'svelte';
	import { reading } from '$lib/reading.svelte';
	import { getKit, useFollow, type Vec3 } from './kit.svelte';

	let {
		at,
		ko,
		han,
		en,
		size = 'md',
		tone = 'plain',
		accent,
		delay = 0,
		show = true,
		minor = false,
		struck = false,
		img,
		faceZoom,
		onclick,
		title,
		moveDelay,
		lift = false,
		children
	}: {
		at: Vec3;
		ko?: string;
		han?: string;
		en?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		/** plain pill · accent (kingdom colour edge) · strong (inverted) · note (no pill) · muted */
		tone?: 'plain' | 'accent' | 'strong' | 'note' | 'muted';
		accent?: string;
		delay?: number;
		show?: boolean;
		/** Dropped on phone-sized canvases. */
		minor?: boolean;
		struck?: boolean;
		/** Round avatar above the text. */
		img?: string | null;
		/** Zoom on the avatar's head: portraits are three-quarter figures, so a seat's face wants ~1.8. */
		faceZoom?: number;
		/** Makes the label a button (pointer events on). */
		onclick?: () => void;
		title?: string;
		moveDelay?: number;
		/** Sit above `at` (bottom edge on the point) instead of centred on it. */
		lift?: boolean;
		/** Replaces the default text body. */
		children?: Snippet;
	} = $props();

	const kit = getKit();
	const pos = useFollow(() => at, () => moveDelay ?? delay * 0.3);
	const on = $derived(kit.active && show);

	// Collapse to one language on a narrow canvas: the reader's choice wins.
	const showKo = $derived(!!ko && !(kit.narrow && reading.lang === 'en' && en));
	const showEn = $derived(!!en && !(kit.narrow && reading.lang !== 'en' && ko));
	const showHan = $derived(!!han && !(kit.narrow && (showKo || showEn)));
	const hidden = $derived(minor && kit.narrow);
	const screen = $derived(kit.project(pos.current));

	/** Lift the label out of the canvas subtree into the kit's DOM layer. */
	function portal(layer: HTMLElement) {
		return (node: HTMLElement) => {
			layer.appendChild(node);
			return () => node.remove();
		};
	}
</script>

{#snippet body()}
	{#if img}
		<span class="face" style:--fz={faceZoom}><img src={img} alt="" loading="lazy" decoding="async" /></span>
	{/if}
	{#if children}
		{@render children()}
	{:else}
		{#if showKo}<span class="ko">{ko}</span>{/if}
		{#if showHan}<span class="han">{han}</span>{/if}
		{#if showEn}<span class="en">{en}</span>{/if}
	{/if}
{/snippet}

{#if !hidden && kit.layer}
	<div
		class="pin"
		class:live={!!onclick}
		class:lift
		style:translate="{screen.x}px {screen.y}px"
		style:z-index={screen.z}
		{@attach portal(kit.layer)}
	>
		{#if onclick}
			<button
				type="button"
				class="kl {size} {tone} btn"
				class:on
				class:struck
				class:has-face={!!img}
				style:--kd={kit.instant ? '0ms' : `${delay}ms`}
				style:--kc={accent}
				{title}
				{onclick}
			>
				{@render body()}
			</button>
		{:else}
			<div
				class="kl {size} {tone}"
				class:on
				class:struck
				class:has-face={!!img}
				style:--kd={kit.instant ? '0ms' : `${delay}ms`}
				style:--kc={accent}
			>
				{@render body()}
			</div>
		{/if}
	</div>
{/if}

<style>
	.pin {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.pin.lift {
		align-items: flex-end;
	}

	.pin.live .kl {
		pointer-events: auto;
	}

	.pin > .kl {
		flex-shrink: 0;
	}

	.kl {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.08em;
		padding: 0.28em 0.55em 0.3em;
		border: 1px solid color-mix(in srgb, var(--fg) 16%, transparent);
		border-radius: 3px;
		background: color-mix(in srgb, var(--panel, #16161c) 84%, transparent);
		backdrop-filter: blur(3px);
		color: var(--fg);
		font-family: var(--serif);
		font-size: clamp(9px, 2.5cqi, 12.5px);
		line-height: 1.12;
		text-align: center;
		white-space: nowrap;
		opacity: 0;
		translate: 0 0.35em;
		transition:
			opacity 450ms var(--ease, ease) var(--kd, 0ms),
			translate 500ms var(--ease, ease) var(--kd, 0ms),
			border-color 400ms ease,
			background 400ms ease;
		user-select: none;
	}

	.kl.on {
		opacity: 1;
		translate: 0 0;
	}

	.xs {
		font-size: clamp(7.5px, 1.9cqi, 10px);
		padding: 0.18em 0.4em 0.2em;
	}

	.sm {
		font-size: clamp(8px, 2.15cqi, 11px);
	}

	.lg {
		font-size: clamp(10px, 3cqi, 14.5px);
	}

	.ko {
		font-family: 'Noto Serif KR', var(--serif);
		font-weight: 700;
	}

	.han {
		font-size: 0.78em;
		letter-spacing: 0.08em;
		opacity: 0.8;
	}

	.en {
		font-family: var(--ui, sans-serif);
		font-size: 0.66em;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-dim);
	}

	.accent {
		border-color: color-mix(in srgb, var(--kc, var(--gold)) 70%, transparent);
		box-shadow: inset 0 -2px 0 var(--kc, var(--gold));
	}

	.strong {
		background: var(--fg);
		border-color: var(--fg);
		color: var(--bg);
	}

	.strong .en {
		color: color-mix(in srgb, var(--bg) 75%, var(--fg));
	}

	.note {
		background: none;
		border-color: transparent;
		backdrop-filter: none;
		color: color-mix(in srgb, var(--kc, var(--fg-dim)) 60%, var(--fg));
		font-style: italic;
	}

	.note .ko {
		font-weight: 600;
	}

	.muted {
		color: var(--fg-faint);
		border-style: dashed;
	}

	.kl.on.muted {
		opacity: 0.7;
	}

	.struck .ko,
	.struck .en {
		text-decoration: line-through;
		text-decoration-color: var(--kc, #ff5a52);
		text-decoration-thickness: 1.5px;
	}

	.has-face {
		padding-top: 0.3em;
	}

	.face {
		width: 2.6em;
		height: 2.6em;
		margin-bottom: 0.2em;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--kc, var(--gold));
		background: var(--panel-sunken, #0c0c10);
	}

	.face img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 15%;
		scale: var(--fz, 1);
		transform-origin: 50% 4%;
	}

	.struck .face {
		filter: grayscale(1) brightness(0.6);
	}

	.btn {
		cursor: pointer;
	}

	.btn:hover,
	.btn:focus-visible {
		border-color: var(--kc, var(--gold));
		background: color-mix(in srgb, var(--panel, #16161c) 70%, var(--kc, var(--gold)));
	}

	.btn:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.kl {
			transition: none;
		}
	}
</style>
