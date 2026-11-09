<script lang="ts">
	import ImageStack from '$lib/components/ImageStack.svelte';
	import { tuckedOrphans } from '$lib/beats';
	import { editUi, isVisibleCue } from '$lib/editUi.svelte';
	import { openImageMenu } from '$lib/imageMenu.svelte';
	import { restoreOrphans } from '$lib/orphanRestore.svelte';
	import { reading } from '$lib/reading.svelte';
	import { hasRealImage } from '$lib/storyImages';
	import type { Entry } from '$lib/story';

	let { entry }: { entry: Pick<Entry, 'blocks' | 'images'> } = $props();

	let open = $state(false);

	let stills = $derived(
		tuckedOrphans(entry).filter((im) => isVisibleCue(im) && (editUi.enabled || hasRealImage(im)))
	);
	let label = $derived(
		reading.lang === 'ko'
			? `큐 없는 그림 ${stills.length}장`
			: `${stills.length} ${stills.length === 1 ? 'still' : 'stills'} without a cue`
	);

	function onMenu(e: MouseEvent) {
		if (!editUi.enabled || !stills.length) return;
		openImageMenu(e, {
			label,
			starKey: '',
			restoreLabel: 'Restore all',
			restore: () => restoreOrphans(stills.map((s) => s.id))
		});
	}
</script>

{#if stills.length}
	<details class="orphans" bind:open>
		<summary oncontextmenu={onMenu}>{label}</summary>
		{#if open}
			<div class="pile">
				<ImageStack images={stills} inline />
			</div>
		{/if}
	</details>
{/if}

<style lang="scss">
	.orphans {
		margin: 0 0 1.25rem;
		padding: 0;
	}

	summary {
		width: fit-content;
		margin: 0.35rem 0 0;
		padding: 0;
		color: var(--fg-dim);
		font-family: var(--ui);
		font-size: 0.82rem;
		letter-spacing: 0.01em;
		text-decoration: underline;
		text-underline-offset: 0.18em;
		cursor: pointer;
		list-style: disclosure-closed;

		&::-webkit-details-marker {
			color: color-mix(in srgb, var(--fg) 55%, transparent);
		}
	}

	.orphans[open] summary {
		list-style: disclosure-open;
		margin-bottom: 0.65rem;
	}

	.pile {
		margin-top: 0.75rem;
	}

	:global(html.is-cinema:not(.is-cinema-peek)) .orphans {
		display: none;
	}
</style>
