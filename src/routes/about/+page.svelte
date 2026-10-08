<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import AboutBlurb from '$lib/components/AboutBlurb.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import { chapters } from '$lib/story';
	import { collectWidgets, widgetType, type WidgetGroup, type WidgetInstance } from '$lib/widgets';
	import { onceInView } from '$lib/inView';
	import { EPISODE_TOTAL, PARTS } from '$lib/episodeDirectory';

	/** One live widget from each family, in the order a reader meets them. */
	const FAMILIES: { group: WidgetGroup; title: string; note: string }[] = [
		{ group: 'sources', title: 'Sources', note: 'Real lines from the annals, steles and letters, each on its own paper.' },
		{ group: 'characters', title: 'Character cards', note: 'The first time someone walks on, with the title they hold that year.' },
		{ group: 'evolutions', title: 'Promotions', note: 'A prince becomes a king: the same face, a new name and title.' },
		{ group: 'places', title: 'Place cards', note: 'Where a scene stands, with its painted board.' },
		{ group: 'classics', title: 'Classics', note: 'Poems, idioms and terms, with the hanja brushed out.' },
		{ group: 'maps', title: 'Maps', note: 'Excerpts of the one map, with routes and battles drawn on.' },
		{ group: 'diagrams', title: 'Diagrams', note: 'Formations, tables and court charts.' }
	];

	const ALL = collectWidgets(chapters);
	const samples = FAMILIES.map((f) => ({ ...f, w: ALL.find((w) => w.group === f.group) })).filter(
		(f): f is (typeof FAMILIES)[number] & { w: WidgetInstance } => !!f.w
	);

	const shown = new SvelteSet<string>();

	type Doc = { title: string; body: string[] };
	const DOCS: Doc[] = [
		{
			title: 'The script',
			body: [
				`The whole book is one file of scenes: ${EPISODE_TOTAL} episodes in ${PARTS.length} parts. Each episode is a run of blocks: narration, dialogue, scene headers, flashbacks, record quotes and the widgets below.`,
				'Every line is written twice, in English and in Korean, and the Korean is written to be said aloud, not translated. Each speaker has a voice note in the wiki that their lines are checked against.',
				'The narrator is an old storyteller who already knows how everyone ends. He keeps it to himself, mostly.'
			]
		},
		{
			title: 'The people',
			body: [
				'The wiki is the cast list and the set: every person, place, clan, sword and horse, with the portrait, title and career for each year. Characters age, get promoted, change names and change clothes, and the cards in the script follow along.'
			]
		},
		{
			title: 'The pictures',
			body: [
				'Every still is painted in one house look: webtoon figures in a watercolour-and-oil world, laid out like a Romantic canvas and lit like a film. Faces come only from the portraits in the wiki, and a visual canon fixes each character’s dress, horse, sword and armour by year, so the same man looks like himself from one episode to the next.',
				'Myths are painted in black ink on bare paper, battles as a painted scroll, and fights in manga angles.'
			]
		},
		{
			title: 'The maps',
			body: [
				'There is one map. Its borders are drawn site by site, year by year, so the kingdoms swell and shrink as you read. The map on the home page plays that history as a loop.'
			]
		},
		{
			title: 'Reading it',
			body: [
				'Read it as a script, as a comic, or as the feed the court would have had if it had phones. Settings switch between English and Korean, light and dark, and the three dialogue styles.'
			]
		}
	];
</script>

<svelte:head>
	<title>About · King for All</title>
	<meta name="description" content="About King for All, and how it was made: the script, the cast, the pictures and the maps." />
</svelte:head>

<main class="about">
	<SiteNavSpace />

	<article class="column">
		<h1>About</h1>
		<AboutBlurb />

		<h2 class="part">How it was made</h2>
		{#each DOCS as doc (doc.title)}
			<section class="doc">
				<h3>{doc.title}</h3>
				{#each doc.body as para, i (i)}
					<p>{para}</p>
				{/each}
			</section>
		{/each}

		<section class="doc">
			<h3>The widgets</h3>
			<p>
				Between the lines, the script hands you things to hold. One of each, live from the story:
			</p>
		</section>
	</article>

	<ol class="samples">
		{#each samples as s (s.group)}
			{@const key = s.group}
			<li class="sample" {@attach onceInView(() => void shown.add(key), { threshold: 0, rootMargin: '600px 0px' })}>
				<header>
					<h4>{s.title}</h4>
					<p>{s.note} <span class="from">{widgetType(s.w.kind)?.label} · {s.w.entryTitle}</span></p>
				</header>
				<div class="stage" class:pending={!shown.has(key)}>
					{#if shown.has(key)}
						<Blocks blocks={[s.w.block]} year={s.w.year} idPrefix={`about-${key}-`} />
					{/if}
				</div>
			</li>
		{/each}
	</ol>

	<p class="all">
		<a href={resolve('/widgets')}>See every widget</a>
	</p>
</main>

<style>
	.about {
		min-height: 100dvh;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)
			calc(5rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	.column,
	.samples,
	.all {
		max-width: var(--script-measure);
		margin-inline: auto;
	}

	h1 {
		margin: 3rem 0 1.5rem;
		font-family: var(--serif);
		font-size: clamp(2rem, 4vw, 2.6rem);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.part {
		margin: 4rem 0 0.5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--hairline);
		font-family: var(--serif);
		font-size: 1.6rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.doc h3 {
		margin: 2rem 0 0.5rem;
		font-family: var(--ui);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-strong);
	}

	.doc p {
		margin: 0 0 0.9rem;
		font-size: 1rem;
		font-weight: var(--weight-body);
		line-height: 1.6;
		letter-spacing: var(--tracking-body);
		color: var(--fg-dim);
	}

	.samples {
		display: grid;
		gap: 3rem;
		margin-top: 1.5rem;
		padding: 0;
		list-style: none;
	}

	.sample header {
		margin-bottom: 0.9rem;
	}

	.sample h4 {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-strong);
	}

	.sample header p {
		margin: 0.2rem 0 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.from {
		color: var(--fg-faint);
	}

	.stage.pending {
		min-height: 14rem;
	}

	.all {
		margin-top: 3rem;
		font-family: var(--ui);
		font-size: 0.9rem;
	}

	.all a {
		font-weight: var(--weight-link);
		color: var(--fg-strong);
	}
</style>
