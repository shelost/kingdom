<script lang="ts">
	/** Where the reader is on Part → Arc → Chapter → Episode. Each step is smaller than the one above it. */
	let { current, ko = false }: { current: 'part' | 'arc' | 'chapter'; ko?: boolean } = $props();

	const steps = [
		{ id: 'part', en: 'Part', ko: '부' },
		{ id: 'arc', en: 'Arc', ko: '편' },
		{ id: 'chapter', en: 'Chapter', ko: '장' },
		{ id: 'episode', en: 'Episode', ko: '화' }
	] as const;
</script>

<ol class="scale" aria-label={ko ? '규모' : 'Scale'}>
	{#each steps as step (step.id)}
		<li class:on={step.id === current}>{ko ? step.ko : step.en}</li>
	{/each}
</ol>

<style>
	.scale {
		display: flex;
		align-items: baseline;
		gap: 0;
		list-style: none;
		margin: 0 0 1.1rem;
		padding: 0;
	}

	.scale li {
		color: var(--fg-faint);
		font-weight: 600;
		letter-spacing: 0.18em;
		line-height: 1;
		text-transform: uppercase;
	}

	.scale li:nth-child(1) {
		font-size: 0.95rem;
	}

	.scale li:nth-child(2) {
		font-size: 0.78rem;
	}

	.scale li:nth-child(3) {
		font-size: 0.64rem;
	}

	.scale li:nth-child(4) {
		font-size: 0.52rem;
	}

	.scale li.on {
		color: var(--gold);
	}

	.scale li + li::before {
		content: '·';
		margin: 0 0.45rem;
		color: var(--fg-faint);
		font-size: 0.7rem;
		letter-spacing: 0;
	}
</style>
