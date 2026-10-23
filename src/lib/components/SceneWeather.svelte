<script lang="ts">
	/**
	 * Full-screen weather over the script: embers over a battle, rain over the
	 * last nights of a rebellion, snow on the northern wall, blood in a
	 * massacre, petals over a flirtation and a pink haze over a seduction,
	 * dark-blue steam in the caverns, the colour draining when a reaper comes.
	 * Reads the scene on the reading line (`$lib/sceneWeather.svelte`).
	 *
	 * Two planes keep the script readable: particles and haze paint behind the
	 * reading column (`back`), and only edge effects and brief moments paint over
	 * it (`front`). Neither ever takes a pointer.
	 */
	import { weatherUi } from '$lib/sceneWeather.svelte';
	import { animating } from '$lib/motionUi.svelte';
	import WeatherPlanes from './WeatherPlanes.svelte';
	import WeatherMoment from './WeatherMoment.svelte';

	let live = $derived(animating() ? weatherUi.current : undefined);
	let moment = $derived(animating() ? weatherUi.moment : undefined);

	/** Lets the script's own styles answer the weather (the text halo below). */
	$effect(() => {
		const root = document.documentElement;
		if (live) root.dataset.weather = live;
		else delete root.dataset.weather;
		return () => delete root.dataset.weather;
	});
</script>

{#if live}
	{#key live}
		<WeatherPlanes weather={live}>
			{#if live === 'blood'}
				{#key weatherUi.hit}
					<span class="hit"></span>
				{/key}
				{#each weatherUi.splats as s (s.id)}
					<span class="splat" style:left="{s.x}%" style:top="{s.y}%" style:rotate="{s.r}deg" style:--s={s.s}></span>
				{/each}
			{/if}
		</WeatherPlanes>
	{/key}
{/if}

{#if moment}
	{#key moment.id}
		<WeatherMoment kind={moment.kind} />
	{/key}
{/if}

<style>
	/* Text keeps a soft halo of the page colour, so haze behind it never eats a letter. */
	:global(html[data-weather] :is(.reading, .widgets-page .stage) :is(p, .dialogue:not(.as-msg) .lines, .verse, header)) {
		text-shadow:
			0 0 3px var(--bg),
			0 0 10px var(--bg);
	}

	/* A red frame-flash on each new beat of a massacre: edges only, the middle stays clear. */
	.hit {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse 80% 75% at 50% 50%, transparent 45%, rgba(160, 0, 24, 0.75));
		opacity: 0;
		animation: flash 0.5s ease-out;
	}

	/* One splatter: a dark core, a ring of droplets, flung out fast and left to dry. */
	.splat {
		position: absolute;
		width: calc(220px * var(--s));
		height: calc(220px * var(--s));
		translate: -50% -50%;
		background:
			radial-gradient(circle at 50% 50%, #6a0012 0 18%, transparent 19%),
			radial-gradient(circle at 26% 38%, #7a0014 0 7%, transparent 8%),
			radial-gradient(circle at 72% 30%, #8a0016 0 5%, transparent 6%),
			radial-gradient(circle at 66% 70%, #7a0014 0 8%, transparent 9%),
			radial-gradient(circle at 30% 74%, #8a0016 0 4%, transparent 5%),
			radial-gradient(circle at 86% 52%, #9a0a1e 0 3%, transparent 4%),
			radial-gradient(circle at 12% 56%, #9a0a1e 0 2.5%, transparent 3.5%),
			radial-gradient(circle at 50% 12%, #8a0016 0 3%, transparent 4%),
			radial-gradient(ellipse 34% 10% at 62% 46%, #6a0012 0 60%, transparent 62%);
		filter: drop-shadow(0 0 2px rgba(60, 0, 10, 0.5));
		animation: splat 2.6s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
	}

	@keyframes flash {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes splat {
		0% {
			scale: 0.2;
			opacity: 0;
		}
		6% {
			scale: 1.08;
			opacity: 0.95;
		}
		14% {
			scale: 1;
		}
		70% {
			opacity: 0.8;
		}
		100% {
			scale: 1.02;
			opacity: 0;
		}
	}
</style>
