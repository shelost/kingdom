<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, disableScrollHandling } from '$app/navigation';
	import Toc from '$lib/components/Toc.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import Hud from '$lib/components/Hud.svelte';
	import SpeakerPlate from '$lib/components/SpeakerPlate.svelte';
	import CinemaStage from '$lib/components/CinemaStage.svelte';
	import StoryMap from '$lib/components/StoryMap.svelte';
	import { tocUi } from '$lib/tocUi.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import {
		consumeLeftoverStoryHash,
		consumePendingStoryJump,
		reading,
		rememberLastEpisode
	} from '$lib/reading.svelte';

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

	$effect(() => rememberLastEpisode(reading.episodeIndex));

	/** Fixed chrome only after the reader leaves cover + blurb. */
	$effect(() => {
		if (!browser) return;
		document.documentElement.classList.toggle('is-in-script', scriptUi.inScript);
		return () => document.documentElement.classList.remove('is-in-script');
	});
</script>

<Toc bind:open={tocUi.open} />

<!-- Reading column: padding push (Notion-style). Isolated below the TOC so
     inline art / sticky frames cannot paint over the panel. The clip sits on
     the padding edge (viewport left), so full-bleed still walls reach under the
     rail and the TOC; chapters clip themselves to keep figures out of that
     gutter. clip-path is avoided: it would become the containing block for
     position:fixed chrome. -->
<div class="reading">
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
<StoryMap />
<Hud />
<PersonLayer />

<style>
	/*
	  Stacking: this column is a single context at z-index 1. Inline art
	  (ImageStack frames use z-index internally), map siblings, and
	  the speaker plate sit below the TOC layer (100+). Descendants cannot
	  escape this context to cover the panel.
	*/
	.reading {
		position: relative;
		z-index: 1;
		isolation: isolate;
	}

	.reading-clip {
		overflow-x: clip;
		min-width: 0;
		/* The rail, or the open TOC (app.css); phones draw the rail in the text's own gutter. */
		padding-left: var(--reading-inset);
		transition: padding-left var(--toc-duration) var(--toc-ease);
	}

	@media (prefers-reduced-motion: reduce) {
		.reading-clip {
			transition: none;
		}
	}
</style>
