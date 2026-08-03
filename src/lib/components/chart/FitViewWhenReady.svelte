<script lang="ts">
	import { useSvelteFlow } from '@xyflow/svelte';

	/** Bump to re-fit after nodes/edges finish settling into the viewport. */
	let { token }: { token: number } = $props();

	const { fitView } = useSvelteFlow();

	$effect(() => {
		token;
		let cancelled = false;
		// Wait for nodes to measure, then fit — force layout positions are already final.
		const t = setTimeout(() => {
			if (cancelled) return;
			requestAnimationFrame(() => {
				if (cancelled) return;
				fitView({ padding: 0.24, duration: 320 });
			});
		}, 40);
		return () => {
			cancelled = true;
			clearTimeout(t);
		};
	});
</script>
