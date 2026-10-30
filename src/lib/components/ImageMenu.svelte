<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { editUi } from '$lib/editUi.svelte';
	import { CUE_SHAPES, closeImageMenu, downloadImage, imageMenu, onEditImageContextMenu } from '$lib/imageMenu.svelte';
	import { ensureStars, isStarred, starUi, toggleStar } from '$lib/imageStarsUi.svelte';

	const MENU_W = 220;
	const MENU_H = 560;

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

	/** Close first, then run — the action may alert. */
	function run(action: (() => unknown) | undefined) {
		closeImageMenu();
		void action?.();
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
		style:right="auto"
		style:bottom="auto"
		style:width="13.5rem"
		style:height="max-content"
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
			disabled={!target.src}
			onclick={() => {
				const src = target?.src;
				run(() => (src ? downloadImage(src) : undefined));
			}}
		>
			<span class="glyph" aria-hidden="true">↓</span>
			Download
		</button>
		<button
			type="button"
			role="menuitem"
			class:current={target.isThumbnail}
			disabled={!target.thumbnail || target.isThumbnail || !!editUi.busyId}
			onclick={() => run(target?.thumbnail)}
		>
			<span class="glyph" aria-hidden="true">{target.isThumbnail ? '✓' : '▭'}</span>
			{target.isThumbnail ? 'Episode thumbnail' : 'Set as thumbnail'}
		</button>
		{#if target.poster}
			<button
				type="button"
				role="menuitem"
				class:current={target.isPoster}
				disabled={target.isPoster || !!editUi.busyId}
				onclick={() => run(target?.poster)}
			>
				<span class="glyph" aria-hidden="true">{target.isPoster ? '✓' : '▭'}</span>
				{target.isPoster ? 'This poster' : 'Set as poster'}
			</button>
		{/if}
		{#if target.setShape}
			<p class="label">Shape</p>
			<div class="shapes" role="group" aria-label="Shape">
				{#each CUE_SHAPES as shape (shape.label)}
					<button
						type="button"
						class="chip"
						class:current={target.crop != null && Math.abs(target.crop - (shape.ratio ?? 0)) < 0.04}
						disabled={!!editUi.busyId}
						onclick={() => {
							const set = target?.setShape;
							const ratio = shape.ratio;
							run(() => set?.(ratio));
						}}
					>
						{shape.label}
					</button>
				{/each}
			</div>
		{/if}
		<p class="label">Grid</p>
		<button
			type="button"
			role="menuitem"
			class:current={target.wide}
			disabled={!target.toggleWide || !!editUi.busyId}
			onclick={() => run(target?.toggleWide)}
		>
			<span class="glyph" aria-hidden="true">{target.wide ? '✓' : '↔'}</span>
			Full width
		</button>
		{#if target.pair}
			<button type="button" role="menuitem" disabled={!!editUi.busyId} onclick={() => run(target?.pair)}>
				<span class="glyph" aria-hidden="true">⊞</span>
				Back in the grid
			</button>
		{/if}
		{#if target.setBalloon}
			<p class="label">Balloon</p>
			<button
				type="button"
				role="menuitem"
				class:current={target.balloon === 'on'}
				disabled={!!editUi.busyId}
				onclick={() => {
					const set = target?.setBalloon;
					run(() => set?.('on'));
				}}
			>
				<span class="glyph" aria-hidden="true">{target.balloon === 'on' ? '✓' : '💬'}</span>
				Comic bubble
			</button>
			<button type="button" role="menuitem" disabled={!!editUi.busyId} onclick={() => {
				const set = target?.setBalloon;
				run(() => set?.('edit'));
			}}>
				<span class="glyph" aria-hidden="true">✎</span>
				Edit bubble
			</button>
			<button
				type="button"
				role="menuitem"
				class:current={target.balloon === 'off'}
				disabled={!!editUi.busyId || target.balloon === 'off'}
				onclick={() => {
					const set = target?.setBalloon;
					run(() => set?.('off'));
				}}
			>
				<span class="glyph" aria-hidden="true">{target.balloon === 'off' ? '✓' : '◌'}</span>
				No bubble
			</button>
		{/if}
		<button
			type="button"
			role="menuitem"
			disabled={!target.move || !!editUi.busyId}
			onclick={() => run(target?.move)}
		>
			<span class="glyph" aria-hidden="true">↕</span>
			Move…
		</button>
		{#if target.resetCrop}
			<button
				type="button"
				role="menuitem"
				disabled={!!editUi.busyId}
				onclick={() => run(target?.resetCrop)}
			>
				<span class="glyph" aria-hidden="true">⤢</span>
				Original shape
			</button>
		{/if}
		<button
			type="button"
			role="menuitem"
			disabled={!target.hide || !!editUi.busyId}
			onclick={() => run(target?.hide)}
		>
			<span class="glyph" aria-hidden="true">◌</span>
			Hide
		</button>
		<button
			type="button"
			role="menuitem"
			class="danger"
			disabled={!target.remove || !!editUi.busyId}
			onclick={() => run(target?.remove)}
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
		inset: unset;
		margin: 0;
		padding: 0.3rem;
		/* The popover UA style stretches the box to the viewport. Hug the items. */
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.1rem;
		border-radius: 8px;
		background: color-mix(in srgb, var(--panel) 94%, transparent);
		border: 1px solid var(--hairline);
		box-shadow: var(--shadow-menu);
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
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		height: auto;
		min-height: 0;
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
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	button[disabled] {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.glyph {
		width: 0.9rem;
		text-align: center;
	}

	.starred,
	.current {
		color: var(--gold);
	}

	button.current[disabled] {
		opacity: 1;
		cursor: default;
	}

	.danger {
		color: var(--danger);
	}

	.hint {
		margin: 0;
		padding: 0.15rem 0.5rem 0.3rem;
		font-size: 0.6rem;
		color: color-mix(in srgb, var(--fg) 45%, transparent);
	}

	.shapes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		padding: 0 0.35rem 0.3rem;
	}

	.chip {
		width: auto;
		padding: 0.28rem 0.45rem;
		font-size: 0.68rem;
	}
</style>
