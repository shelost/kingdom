<script lang="ts">
	import type { Block } from '$lib/story';

	let { block }: { block: Extract<Block, { kind: 'table' }> } = $props();
</script>

<div class="table-scroll">
	<table>
		<thead>
			<tr>
				{#each block.head as h, j (j)}
					<th style:--hc={block.colors?.[j]}>{h}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each block.rows as row, j (j)}
				<tr>
					{#each row as cell, k (k)}
						<td>{cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	.table-scroll {
		overflow-x: auto;
		margin: 1.2rem 0;
		border: 1px solid var(--hairline);
		border-radius: var(--widget-radius);
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.84rem;
	}

	th,
	td {
		border-right: 1px solid var(--hairline);
		padding: 0.4rem 0.9rem;
		text-align: center;
		white-space: nowrap;
	}

	th:last-child,
	td:last-child {
		border-right: none;
	}

	th {
		font-weight: 600;
		color: var(--fg-strong);
		letter-spacing: var(--tracking-micro);
		background: color-mix(in srgb, var(--fg) 5%, transparent);
		border-bottom: 1px solid var(--hairline);
		/* Column-tinted heads (the four Dragons, the four Beasts) */
		&[style*='--hc'] {
			background: color-mix(in srgb, var(--hc, transparent) 16%, transparent);
		}
	}

	td {
		color: var(--fg-dim);
	}
</style>
