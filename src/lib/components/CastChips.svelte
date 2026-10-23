<script lang="ts">
	import { avatarOf, byId, hangulInitial, isPlaceholderArt, nameOf } from '$lib/people';
	import { storyImg } from '$lib/img';
	import type { CastChip } from '$lib/wiki';

	/**
	 * A row of people to narrow an index to: pick one or a few, see every entry
	 * they are in. Chips arrive most-featured first; nothing picked shows all.
	 */
	let {
		chips,
		selected = $bindable([]),
		label = 'With',
		limit = 14,
		onchange
	}: {
		chips: CastChip[];
		/** Picked person ids, in the order they were picked. */
		selected?: string[];
		label?: string;
		/** Chips shown before “more”; picked chips always show. */
		limit?: number;
		onchange?: (ids: string[]) => void;
	} = $props();

	let expanded = $state(false);
	let picked = $derived(new Set(selected));
	/** A pick the other filters have emptied stays visible, so it can be unpicked. */
	let stranded = $derived(
		selected
			.filter((id) => !chips.some((c) => c.person.id === id))
			.flatMap((id) => {
				const person = byId.get(id);
				return person ? [{ person, count: 0 }] : [];
			})
	);
	let shown = $derived([
		...(expanded ? chips : chips.filter((c, i) => i < limit || picked.has(c.person.id))),
		...stranded
	]);
	let hidden = $derived(chips.length + stranded.length - shown.length);

	function set(ids: string[]) {
		selected = ids;
		onchange?.(ids);
	}

	function toggle(id: string) {
		set(picked.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);
	}
</script>

<div class="cast" role="group" aria-label="Show entries with these people">
	<span class="cast-label">{label}</span>
	{#each shown as c (c.person.id)}
		{@const art = avatarOf(c.person)}
		<button
			type="button"
			class="chip"
			aria-pressed={picked.has(c.person.id)}
			onclick={() => toggle(c.person.id)}
		>
			<span class="face" class:silhouette={isPlaceholderArt(art)} aria-hidden="true">
				{#if art}
					<img {...storyImg(art, { kind: 'thumb', alt: '', sizes: '28px' })} />
				{:else}
					{hangulInitial(c.person)}
				{/if}
			</span>
			<span class="name">{nameOf(c.person)}</span>
			<span class="n">{c.count}</span>
		</button>
	{/each}
	{#if hidden > 0 || expanded}
		<button type="button" class="more" onclick={() => (expanded = !expanded)}>
			{expanded ? 'Fewer' : `+${hidden} more`}
		</button>
	{/if}
	{#if selected.length}
		<button type="button" class="more clear" onclick={() => set([])}>
			<span class="material-symbols-outlined" aria-hidden="true">close</span>
			Clear
		</button>
	{/if}
</div>

<style>
	.cast {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin: -0.75rem 0 1.9rem;
		font-family: var(--ui);
		font-size: 0.78rem;
		letter-spacing: var(--tracking-ui);
	}

	.cast-label {
		margin-right: 0.3rem;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.chip,
	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 2rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 4%, transparent);
		font: inherit;
		color: var(--fg-dim);
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			border-color 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.chip {
		padding: 0 0.7rem 0 0.2rem;
	}

	.more {
		padding: 0 0.8rem;
		color: var(--fg-faint);
	}

	.chip:hover,
	.more:hover {
		color: var(--fg-strong);
		border-color: color-mix(in srgb, var(--fg) 28%, transparent);
	}

	.chip:focus-visible,
	.more:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--gold) 70%, transparent);
		outline-offset: 2px;
	}

	.chip[aria-pressed='true'] {
		border-color: var(--gold);
		background: color-mix(in srgb, var(--gold) 18%, transparent);
		color: var(--fg-strong);
		font-weight: 600;
	}

	.face {
		display: grid;
		place-items: center;
		flex: none;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		overflow: hidden;
		background: color-mix(in srgb, var(--fg) 10%, transparent);
		font-size: 0.7rem;
		color: var(--fg-dim);
	}

	.face img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 18%;
	}

	.face.silhouette img {
		opacity: 0.55;
	}

	.n {
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.chip[aria-pressed='true'] .n {
		color: var(--gold);
	}

	.clear .material-symbols-outlined {
		font-size: 0.95rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.more {
			transition: none;
		}
	}
</style>
