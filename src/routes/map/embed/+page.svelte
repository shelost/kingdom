<script lang="ts">
	/**
	 * Bare cosmos map for Ovid's Home — no site chrome, the same interactive
	 * MapApp as /map. Posts `ready` so the Ovid window can drop its loader.
	 */
	import MapApp from '$lib/components/MapApp.svelte';
</script>

<MapApp embedded />
