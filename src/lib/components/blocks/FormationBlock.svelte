<script lang="ts">
	import type { Block } from '$lib/story';

	let { block }: { block: Extract<Block, { kind: 'formation' }> } = $props();
</script>

<figure class="formation">
	{#if block.title}<figcaption class="fm-title">{block.title}</figcaption>{/if}
	<div class="fm-field">
		{#each block.sides as side, si (si)}
			<div class="fm-side" style:--s={side.color}>
				<span class="fm-name">{side.name}</span>
				<div class="fm-units">
					{#each side.units as u, ui (ui)}
						<span class="fm-unit">
							<b>{u.label}</b>
							{#if u.sub}<i>{u.sub}</i>{/if}
						</span>
					{/each}
				</div>
			</div>
			{#if si === 0}<span class="fm-vs" aria-hidden="true"></span>{/if}
		{/each}
	</div>
	{#if block.note}<p class="fm-note">{block.note}</p>{/if}
</figure>

<style lang="scss">
	.formation {
		margin: 1.4rem 0;
		padding: 0.9rem 1rem 0.8rem;
		border: 1px solid var(--hairline);
		border-radius: var(--widget-radius);
	}

	.fm-title {
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
		margin-bottom: 0.7rem;
	}

	.fm-field {
		display: flex;
		align-items: stretch;
		gap: 0.9rem;
	}

	.fm-side {
		flex: 1;
		min-width: 0;
	}

	.fm-name {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: var(--s);
		margin-bottom: 0.45rem;
	}

	.fm-units {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.fm-unit {
		display: flex;
		flex-direction: column;
		padding: 0.32rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--s) 40%, transparent);
		border-left: 3px solid var(--s);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--s) 9%, transparent);
		& b {
			font-size: 0.78rem;
			font-weight: 500;
			color: var(--fg);
		}
		& i {
			font-size: 0.68rem;
			font-style: normal;
			color: var(--fg-faint);
		}
	}

	/* the line where the two sides meet */

	.fm-vs {
		width: 1px;
		background: var(--hairline);
		flex-shrink: 0;
	}

	.fm-note {
		margin: 0.7rem 0 0;
		font-size: 0.74rem;
		line-height: 1.55;
		color: var(--fg-faint);
	}
</style>
