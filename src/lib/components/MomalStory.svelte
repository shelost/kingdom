<script lang="ts">
	/**
	 * A widget lifted straight out of the book (diagram, record, term, map, card…), drawn by
	 * the reader's own `Blocks` on a page of the book's paper, so it reads as the chronicle.
	 */
	import type BlocksView from '$lib/components/Blocks.svelte';
	import { reading } from '$lib/reading.svelte';
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { momalEpisodeHref } from '$lib/momal';
	import type { MomalStoryWidget } from '$lib/momalStory';

	let { id, note }: { id: string; note?: string } = $props();

	const ko = $derived(reading.lang === 'ko');
	let found = $state<MomalStoryWidget | null | undefined>(undefined);
	let Blocks = $state<typeof BlocksView | null>(null);

	$effect(() => {
		const wid = id;
		let gone = false;
		void Promise.all([import('$lib/momalStory'), import('$lib/components/Blocks.svelte')]).then(([m, b]) => {
			if (gone) return;
			found = m.storyWidget(wid);
			Blocks = b.default;
		});
		return () => {
			gone = true;
		};
	});
</script>

{#if found === undefined}
	<div class="frame loading" aria-hidden="true"></div>
{:else if found && Blocks}
	{@const w = found.w}
	<figure class="frame">
		<figcaption>
			<span class="kind">
				<span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
				{ko ? found.label.ko : found.label.en}
			</span>
			<a class="where" href={momalEpisodeHref(found.episode)} onclick={() => storyAsk.show()}>
				{w.entryTitle}
				<span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
			</a>
		</figcaption>
		<div class="page">
			<Blocks blocks={[w.block]} year={w.year} idPrefix={`momal-${id.replace(/[^a-z0-9]/gi, '-')}-`} unpinned />
		</div>
		{#if note}<p class="note">{note}</p>{/if}
	</figure>
{/if}

<style lang="scss">
	$gold: #ffb900;

	.frame {
		width: 100%;
		margin: 0;
		border-radius: 20px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.04);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			0 18px 40px -24px rgba(0, 0, 0, 0.9);
		&.loading {
			height: 10rem;
			background:
				linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.06) 50%, transparent 70%) 0 0 / 220% 100%,
				rgba(255, 255, 255, 0.035);
			animation: sweep 1.6s linear infinite;
		}
	}

	@keyframes sweep {
		to {
			background-position: -220% 0;
		}
	}

	figcaption {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.55rem 0.8rem 0.5rem;
		font-size: 0.68rem;
		font-weight: 650;
	}

	.kind {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: $gold;
		& .material-symbols-outlined {
			font-size: 0.95rem;
		}
	}

	.where {
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		& .material-symbols-outlined {
			font-size: 0.85rem;
		}
		&:hover {
			color: #fff;
		}
	}

	/* The book's own surface and ink, so the widget looks exactly as it does in the reader. */
	.page {
		container-type: inline-size;
		max-height: 34rem;
		overflow: auto;
		padding: 1rem 1.1rem 1.15rem;
		background: var(--bg);
		color: var(--fg);
		font-family: var(--serif, 'Newsreader', Georgia, serif);
		scrollbar-width: thin;
		& > :global(:first-child) {
			margin-top: 0;
		}
		& > :global(:last-child) {
			margin-bottom: 0;
		}
	}

	.note {
		margin: 0;
		padding: 0.55rem 0.85rem 0.65rem;
		font-size: 0.8rem;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.7);
	}

	@media (prefers-reduced-motion: reduce) {
		.frame.loading {
			animation: none;
		}
	}
</style>
