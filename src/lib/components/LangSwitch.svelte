<script lang="ts">
	import { LANGS, reading, setLang } from '$lib/reading.svelte';

	let { compact = false }: { compact?: boolean } = $props();
</script>

<div class="langs" class:compact role="group" aria-label="Language">
	{#each LANGS as l (l.id)}
		<button
			type="button"
			class:active={reading.lang === l.id}
			title={l.hint}
			aria-pressed={reading.lang === l.id}
			onclick={() => setLang(l.id)}
		>
			{l.label}
		</button>
	{/each}
</div>

<style>
	.langs {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.05rem;
		margin-left: 0.15rem;
		padding: 0.18rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.langs button {
		font: inherit;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1;
		color: var(--fg-dim);
		padding: 0.48rem 0.58rem;
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.langs button.active {
		color: var(--fg-strong);
		background: var(--bg);
	}

	.langs button:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	.compact {
		margin: 0;
		width: 100%;
		justify-content: stretch;
	}

	.compact button {
		flex: 1;
		padding: 0.55rem 0.4rem;
		font-size: 0.85rem;
	}
</style>
