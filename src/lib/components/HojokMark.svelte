<script lang="ts">
	/**
	 * A castle lord: the surname in its own seal above the name, not inside it.
	 * One character is a circle. Two or more (皇甫) are a pill.
	 */
	let {
		hanja = '',
		name,
		epithet = '',
		color
	}: {
		hanja?: string;
		name: string;
		epithet?: string;
		color: string;
	} = $props();
</script>

<span class="hojok" style:--c={color}>
	{#if hanja}
		<span class={['badge', { pill: hanja.length > 1 }]}>{hanja}</span>
	{/if}
	<span class="card">
		<span class="who">{name}</span>
		{#if epithet}<span class="epi">{epithet}</span>{/if}
	</span>
</span>

<style lang="scss">
	.hojok {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.22em;
		color: #fff;
		font-style: normal;
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1;
		white-space: nowrap;
		text-shadow: none;
	}

	.badge {
		display: grid;
		place-items: center;
		box-sizing: border-box;
		width: 1.55em;
		height: 1.55em;
		border: 2px solid var(--c, #fff);
		border-radius: 50%;
		background: #000;
		color: var(--c, #fff);
		font-family: 'LXGW WenKai TC', 'Nanum Brush Script', serif;
		font-style: normal;
		font-weight: 700;
		font-size: 1.35em;
		line-height: 1;
		box-shadow: 0 0 0 1px #000;
		&.pill {
			width: auto;
			min-width: 1.55em;
			padding: 0 0.38em;
			border-radius: 999px;
			letter-spacing: 0.04em;
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.04em;
		padding: 0.16em 0.5em 0.2em;
		border: 2px solid var(--c, #fff);
		border-radius: 3px;
		background: #000;
		box-shadow: 0 0 0 1px #000;
	}

	.who {
		font-style: normal;
		line-height: 1.15;
	}

	.epi {
		font-style: normal;
		font-size: 0.68em;
		font-weight: 500;
		letter-spacing: 0.01em;
		line-height: 1.15;
		opacity: 0.78;
	}
</style>
