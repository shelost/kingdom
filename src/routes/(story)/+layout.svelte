<script lang="ts">
	import { browser } from '$app/environment';
	import Toc from '$lib/components/Toc.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import Hud from '$lib/components/Hud.svelte';
	import SpeakerPlate from '$lib/components/SpeakerPlate.svelte';
	import CinemaStage from '$lib/components/CinemaStage.svelte';
	import RelationChart from '$lib/components/RelationChart.svelte';
	import StoryMap from '$lib/components/StoryMap.svelte';
	import { tocUi } from '$lib/tocUi.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';

	let { children } = $props();

	/** Sync TOC open → CSS vars (--shell-shift / --corner-left) for fixed chrome. */
	$effect(() => {
		if (!browser) return;
		document.documentElement.classList.toggle('is-toc-open', tocUi.open);
		return () => document.documentElement.classList.remove('is-toc-open');
	});

	/** Fixed chrome only after the reader leaves cover + blurb. */
	$effect(() => {
		if (!browser) return;
		document.documentElement.classList.toggle('is-in-script', scriptUi.inScript);
		return () => document.documentElement.classList.remove('is-in-script');
	});
</script>

<Toc bind:open={tocUi.open} />

<!-- Reading column: padding push (Notion-style). Duration matches --toc-duration. -->
<div class="reading" class:toc-open={tocUi.open}>
	{@render children()}
</div>

<!-- Fixed story chrome — plate / corners follow --shell-shift & --corner-left.
     Only one stage is ever live: the plate answers to immersion, the cinema
     stage (Scene / Script / Character / Dialogue grid) to cinema, and script
     mode mounts neither. -->
<SpeakerPlate />
<CinemaStage />
<RelationChart />
<StoryMap />
<Hud />
<PersonLayer />

<style>
	.reading {
		padding-left: 22px; /* clear the fixed rail */
		transition: padding-left var(--toc-duration) var(--toc-ease);
	}

	.reading.toc-open {
		padding-left: var(--toc-w);
	}

	@media (max-width: 1000px) {
		.reading.toc-open {
			padding-left: 22px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reading {
			transition: none;
		}
	}
</style>
