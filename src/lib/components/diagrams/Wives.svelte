<script lang="ts">
	import type { DiagramProps } from './registry';
	import WivesTable from '../WivesTable.svelte';

	let { active = false }: DiagramProps = $props();
</script>

<div class={['wives-diagram', { on: active }]}>
	<WivesTable />
</div>

<style lang="scss">
	.wives-diagram {
		opacity: 0.35;
		transform: translateY(0.4rem);
		transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
		&.on {
			opacity: 1;
			transform: none;
		}
	}
</style>
