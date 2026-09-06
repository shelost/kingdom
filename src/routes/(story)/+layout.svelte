<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, disableScrollHandling } from '$app/navigation';
	import Toc from '$lib/components/Toc.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import Hud from '$lib/components/Hud.svelte';
	import SpeakerPlate from '$lib/components/SpeakerPlate.svelte';
	import CinemaStage from '$lib/components/CinemaStage.svelte';
	import RelationChart from '$lib/components/RelationChart.svelte';
	import StoryMap from '$lib/components/StoryMap.svelte';
	import { tocUi } from '$lib/tocUi.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { consumeLeftoverStoryHash, consumePendingStoryJump } from '$lib/reading.svelte';

	let { children } = $props();

	afterNavigate(() => {
		/* Kit would otherwise scroll to `#id`. Story nodes have no HTML ids. */
		if (typeof location !== 'undefined' && location.hash) disableScrollHandling();
		const jumped = consumePendingStoryJump();
		if (!jumped) consumeLeftoverStoryHash();
	});

	/** Sync TOC open → CSS vars (--shell-shift / --corner-left) for fixed chrome. */
	$effect(() => {
		if (!browser) return;
		document.documentElement.classList.toggle(
			'is-toc-open',
			tocUi.open && scriptUi.inScript
		);
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

<!-- Reading column: padding push (Notion-style). Isolated below the TOC so
     inline art / sticky frames cannot paint over the panel. Inner clip is the
     content edge — overflow on .reading itself would clip at the padding edge
     (viewport left) and still let figures draw in the TOC gutter. clip-path is
     avoided: it would become the containing block for position:fixed chrome. -->
<div class="reading" class:toc-open={tocUi.open && scriptUi.inScript}>
	<div class="reading-clip">
		{@render children()}
	</div>
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
	/*
	  Stacking: this column is a single context at z-index 1. Inline art
	  (ImageStack frames use z-index internally), relation/map siblings, and
	  the speaker plate sit below the TOC layer (100+). Descendants cannot
	  escape this context to cover the panel.
	*/
	.reading {
		position: relative;
		z-index: 1;
		isolation: isolate;
		padding-left: 22px; /* clear the fixed rail */
		transition: padding-left var(--toc-duration) var(--toc-ease);
	}

	.reading-clip {
		overflow-x: clip;
		min-width: 0;
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
