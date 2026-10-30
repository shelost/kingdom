<script lang="ts">
	let { on = false }: { on?: boolean } = $props();
</script>

{#if on}
	<span class="star-badge" aria-label="Starred">★</span>
{/if}

<style>
	.star-badge {
		position: absolute;
		top: 0.4rem;
		right: 0.45rem;
		z-index: 4;
		font-size: 0.8rem;
		line-height: 1;
		color: #fff;
		text-shadow: 0 1px 6px rgb(0 0 0 / 0.65);
		pointer-events: none;
	}
</style>
