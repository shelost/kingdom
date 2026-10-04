<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { editUi } from '$lib/editUi.svelte';
	import { closeImageMenu, imageMenu, onEditImageContextMenu } from '$lib/imageMenu.svelte';
	import { ensureStars, isStarred, starUi, toggleStar } from '$lib/imageStarsUi.svelte';

	const MENU_W = 184;
	const MENU_H = 120;

	let vw = $state(0);
	let vh = $state(0);
	let target = $derived(editUi.enabled ? imageMenu.target : null);
	let starred = $derived(!!target && isStarred(target.starKey));
	let left = $derived(Math.max(8, Math.min(imageMenu.x, vw - MENU_W - 8)));
	let top = $derived(Math.max(8, Math.min(imageMenu.y, vh - MENU_H - 8)));

	$effect(() => {
		if (editUi.enabled) void ensureStars();
	});

	function star() {
		if (target?.starKey) toggleStar(target.starKey);
		closeImageMenu();
	}

	function remove() {
		const run = target?.remove;
		closeImageMenu();
		void run?.();
	}

	/* A manual popover joins the top layer, so the menu opens above the modal lightbox too. */
	const surface: Attachment<HTMLElement> = (node) => {
		node.showPopover();
		const onDown = (e: PointerEvent) => {
			if (!node.contains(e.target as Node)) closeImageMenu();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			e.preventDefault();
			e.stopPropagation();
			closeImageMenu();
		};
		const onContext = (e: MouseEvent) => {
			if (!node.contains(e.target as Node)) closeImageMenu();
		};
		window.addEventListener('pointerdown', onDown, true);
		window.addEventListener('keydown', onKey, true);
		window.addEventListener('contextmenu', onContext, true);
		window.addEventListener('blur', closeImageMenu);
		window.addEventListener('resize', closeImageMenu);
		window.addEventListener('wheel', closeImageMenu, { passive: true, capture: true });
		node.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
		return () => {
			window.removeEventListener('pointerdown', onDown, true);
			window.removeEventListener('keydown', onKey, true);
			window.removeEventListener('contextmenu', onContext, true);
			window.removeEventListener('blur', closeImageMenu);
			window.removeEventListener('resize', closeImageMenu);
			window.removeEventListener('wheel', closeImageMenu, true);
		};
	};
</script>

<svelte:window
	bind:innerWidth={vw}
	bind:innerHeight={vh}
	oncontextmenu={onEditImageContextMenu}
/>

{#if target}
	<div
		class="image-menu"
		popover="manual"
		role="menu"
		tabindex="-1"
		aria-label={target.label}
		style:left="{left}px"
		style:top="{top}px"
		{@attach surface}
		oncontextmenu={(e) => e.preventDefault()}
	>
		<p class="label">{target.label}</p>
		<button
			type="button"
			role="menuitem"
			class:starred
			disabled={!target.starKey}
			onclick={star}
		>
			<span class="glyph" aria-hidden="true">{starred ? '★' : '☆'}</span>
			{starred ? 'Unstar' : 'Star'}
		</button>
		<button
			type="button"
			role="menuitem"
			class="danger"
			disabled={!target.remove || !!editUi.busyId}
			onclick={remove}
		>
			<span class="glyph" aria-hidden="true">✕</span>
			Remove
		</button>
		{#if !target.remove && target.removeHint}
			<p class="hint">{target.removeHint}</p>
		{/if}
		{#if starUi.localOnly}
			<p class="hint">Stars are saved in this browser only</p>
		{/if}
	</div>
{/if}

<style>
	.image-menu {
		position: fixed;
		inset: auto;
		margin: 0;
		width: 11.5rem;
		padding: 0.3rem;
		display: grid;
		gap: 0.1rem;
		border-radius: 8px;
		background: color-mix(in srgb, #0b0b0e 92%, transparent);
		border: 1px solid color-mix(in srgb, #fff 14%, transparent);
		box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(14px);
		font-family: var(--ui);
		color: var(--fg);
	}

	.label {
		margin: 0;
		padding: 0.3rem 0.5rem 0.25rem;
		font-size: 0.62rem;
		letter-spacing: var(--tracking-ui);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--fg) 55%, transparent);
		word-break: break-all;
	}

	button {
		appearance: none;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
		padding: 0.42rem 0.5rem;
		border: none;
		border-radius: 5px;
		background: transparent;
		color: var(--fg);
		font: inherit;
		font-size: 0.78rem;
		text-align: left;
		cursor: pointer;
	}

	button:hover:not([disabled]),
	button:focus-visible {
		outline: none;
		background: color-mix(in srgb, #fff 10%, transparent);
	}

	button[disabled] {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.glyph {
		width: 0.9rem;
		text-align: center;
	}

	.starred {
		color: var(--gold);
	}

	.danger {
		color: #ff8a8a;
	}

	.hint {
		margin: 0;
		padding: 0.15rem 0.5rem 0.3rem;
		font-size: 0.6rem;
		color: color-mix(in srgb, var(--fg) 45%, transparent);
	}
</style>
