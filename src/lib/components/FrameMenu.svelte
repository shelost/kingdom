<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { asset } from '$app/paths';

	let {
		x,
		y,
		label,
		src,
		canDelete = true,
		ondelete,
		onclose
	}: {
		x: number;
		y: number;
		/** Which still the menu is for, e.g. "Still 3 of 6". */
		label: string;
		/** Site path of the still, e.g. `/scene_bidam_sing.png`. */
		src: string;
		canDelete?: boolean;
		ondelete: () => void;
		onclose: () => void;
	} = $props();

	const MENU_W = 184;
	const MENU_H = 124;

	function download() {
		const link = document.createElement('a');
		/* Frames are runtime strings from scenes.ts, so they cannot narrow to the static-file union. */
		link.href = asset(src as Parameters<typeof asset>[0]);
		link.download = src.split('?')[0]?.split('/').pop() || 'still';
		link.click();
		onclose();
	}

	let left = $derived(Math.max(8, Math.min(x, window.innerWidth - MENU_W - 8)));
	let top = $derived(Math.max(8, Math.min(y, window.innerHeight - MENU_H - 8)));

	const dismiss: Attachment<HTMLElement> = (node) => {
		const onDown = (e: PointerEvent) => {
			if (!node.contains(e.target as Node)) onclose();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				onclose();
			}
		};
		const onAway = () => onclose();
		const onContext = (e: MouseEvent) => {
			if (!node.contains(e.target as Node)) onclose();
		};
		window.addEventListener('pointerdown', onDown, true);
		window.addEventListener('keydown', onKey, true);
		window.addEventListener('blur', onAway);
		window.addEventListener('resize', onAway);
		window.addEventListener('wheel', onAway, { passive: true, capture: true });
		window.addEventListener('contextmenu', onContext, true);
		node.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
		return () => {
			window.removeEventListener('pointerdown', onDown, true);
			window.removeEventListener('keydown', onKey, true);
			window.removeEventListener('blur', onAway);
			window.removeEventListener('resize', onAway);
			window.removeEventListener('wheel', onAway, true);
			window.removeEventListener('contextmenu', onContext, true);
		};
	};
</script>

<div
	class="frame-menu"
	role="menu"
	tabindex="-1"
	aria-label={label}
	style:left="{left}px"
	style:top="{top}px"
	{@attach dismiss}
	oncontextmenu={(e) => e.preventDefault()}
>
	<p class="label">{label}</p>
	<button type="button" role="menuitem" onclick={download}>Download still</button>
	<button
		type="button"
		role="menuitem"
		class="danger"
		disabled={!canDelete}
		title={canDelete ? undefined : 'A song needs at least one still'}
		onclick={() => {
			ondelete();
			onclose();
		}}
	>
		Delete still
	</button>
	<button type="button" role="menuitem" onclick={onclose}>Cancel</button>
</div>

<style>
	.frame-menu {
		position: fixed;
		z-index: 400;
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
	}

	.label {
		margin: 0;
		padding: 0.3rem 0.5rem 0.25rem;
		font-size: 0.62rem;
		letter-spacing: var(--tracking-ui);
		text-transform: uppercase;
		color: color-mix(in srgb, var(--fg) 55%, transparent);
	}

	button {
		appearance: none;
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

	.danger {
		color: #ff8a8a;
	}

	button[disabled] {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
