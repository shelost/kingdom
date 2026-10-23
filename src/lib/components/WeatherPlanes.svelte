<script lang="ts">
	/**
	 * One weather as two planes: particles and haze behind the text (`back`),
	 * edge effects over it (`front`, which also holds `children`). Full-screen
	 * over the script, or `contained` inside a positioned preview box.
	 */
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { weatherLayer } from '$lib/stillMotion';
	import type { Weather } from '$lib/story';

	let { weather, contained = false, children }: { weather: Weather; contained?: boolean; children?: Snippet } =
		$props();
</script>

<div
	class="weather back"
	class:contained
	aria-hidden="true"
	transition:fade|global={{ duration: 900 }}
	{@attach weatherLayer(weather, 'back')}
></div>
<div
	class="weather front"
	class:contained
	aria-hidden="true"
	transition:fade|global={{ duration: 900 }}
	{@attach weatherLayer(weather, 'front')}
>
	{@render children?.()}
</div>

<style>
	.weather {
		position: fixed;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.contained {
		position: absolute;
	}

	/* Behind the reading column (z-index 1), over the page's own background. */
	.back {
		z-index: 0;
	}

	/* Over the script, under the table of contents and the stage chrome. */
	.front {
		z-index: 60;
	}
</style>
