<script lang="ts">
	import { browser } from '$app/environment';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SheetMusic from '$lib/components/SheetMusic.svelte';
	import {
		LEITMOTIFS,
		INSTRUMENT_LABELS,
		playLeitmotif,
		stopLeitmotif,
		motifDurationMs,
		backingLabels,
		tempsOf,
		type Leitmotif
	} from '$lib/leitmotifs';
	import TempRefs from '$lib/components/TempRefs.svelte';
	import {
		byId,
		avatarOf,
		nameOf,
		koreanOf,
		titleOf,
		isPlaceholderArt,
		hangulInitial,
		KINGDOMS,
		kingdomFlag,
		colorOf,
		type Person
	} from '$lib/people';

	interface MotifCard {
		id: string;
		motif: Leitmotif;
		person: Person | undefined;
	}

	interface MotifSection {
		key: string;
		title: string;
		subtitle: string;
		color?: string;
		cards: MotifCard[];
	}

	const NATION_ORDER = [
		'nation-goguryeo',
		'nation-baekje',
		'nation-silla',
		'nation-joseon',
		'nation-tang',
		'nation-yamato',
		'nation-gaya',
		'nation-tamla'
	];

	const FOUNDER_ORDER = ['hyukgose', 'alyoung', 'jumong', 'onjo', 'suro', 'dangun'] as const;
	const GOD_ORDER = [
		'hwanin',
		'daebyeol',
		'sobyeol',
		'sara',
		'haemosu',
		'yuhwa',
		'habek',
		'ibiga',
		'samsin',
		'yumla',
		'kangrim',
		'haewonmek'
	] as const;
	const CONCEPT_ORDER = ['hwarang', 'steam_cavern', 'four_divisions', 'fairytales', 'romance'] as const;

	const founderSet = new Set<string>(FOUNDER_ORDER);
	const godSet = new Set<string>(GOD_ORDER);
	const conceptSet = new Set<string>(CONCEPT_ORDER);

	function cardOf(id: string): MotifCard {
		return { id, motif: LEITMOTIFS[id], person: byId.get(id) };
	}

	function cardsIn(ids: readonly string[]): MotifCard[] {
		return ids.filter((id) => id in LEITMOTIFS).map(cardOf);
	}

	const kingdomCards = cardsIn(NATION_ORDER);
	const founderCards = cardsIn(FOUNDER_ORDER);
	const godCards = cardsIn(GOD_ORDER);
	const conceptCards = cardsIn(CONCEPT_ORDER);

	const characterCards = Object.keys(LEITMOTIFS)
		.filter(
			(id) =>
				!id.startsWith('nation-') && !founderSet.has(id) && !godSet.has(id) && !conceptSet.has(id)
		)
		.map(cardOf);

	const sections: MotifSection[] = [
		{
			key: 'kingdoms',
			title: 'Kingdoms',
			subtitle: 'Eight courts in a contemporary mix — Korean ache, a Qin-Wang march, a Japanese taiko cell.',
			cards: kingdomCards
		},
		{
			key: 'founders',
			title: 'Founders',
			subtitle: 'Older, simpler cuts of each kingdom hook — the egg, the fifth, the river, the mountain.',
			cards: founderCards
		},
		{
			key: 'characters',
			title: 'Characters',
			subtitle: 'Court hooks in a modern pulse — a shared hymn, a fox-step, a count of duty, Chang’an, the eastern taiko.',
			cards: characterCards
		},
		{
			key: 'gods',
			title: 'Gods',
			subtitle: 'Unearthly and electronic — pads, saws, whistle, odd meters. Not bound to earthly court music.',
			cards: godCards
		},
		{
			key: 'concepts',
			title: 'Concepts',
			subtitle: 'Abstract registers — Hwarang steel, cavern steam, the gods’ brass, fairy-tale chime, K-drama sixth.',
			cards: conceptCards
		}
	].filter((s) => s.cards.length > 0);

	const total = sections.reduce((n, s) => n + s.cards.length, 0);

	let playingId = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function quiet() {
		if (!browser) return;
		stopLeitmotif();
		clearTimeout(timer);
		playingId = null;
	}

	function toggle(id: string) {
		if (!browser) return;
		if (playingId === id) {
			quiet();
			return;
		}
		clearTimeout(timer);
		const ms = playLeitmotif(id);
		if (ms <= 0) return;
		playingId = id;
		timer = setTimeout(() => (playingId = null), ms);
	}

	// Stop any playback when the page unmounts.
	$effect(() => quiet);

	function cardArt(card: MotifCard): string | undefined {
		if (!card.person) return undefined;
		if (card.person.entity === 'nation') return kingdomFlag(card.person.kingdom);
		return avatarOf(card.person) ?? undefined;
	}

	function durationLabel(motif: Leitmotif): string {
		return `${Math.round(motifDurationMs(motif) / 100) / 10}s`;
	}
</script>

<svelte:head>
	<title>Music · King for All</title>
	<meta
		name="description"
		content="Short iconic leitmotifs of the chronicle — kingdom themes and character hooks in a contemporary mix, with sheet music."
	/>
</svelte:head>

<main class="music">
	<header class="mast">
		<div class="mast-nav">
			<SiteNav />
			<span class="dot" aria-hidden="true">·</span>
			<span>{total} motifs</span>
		</div>
		<h1>Leitmotifs</h1>
		<p class="lede">
			Iconic hooks, then a variation, then a return — in 평조, 계면조, Chinese 宫/徵, and Japanese
			ヨ音階, played by a contemporary ensemble (pads, bass, kick and clap) with court color
			as accent. A <strong>Temp</strong> mark is a tone-reference (YouTube, your click only),
			not the chronicle theme.
		</p>
	</header>

	{#each sections as section (section.key)}
		<section class="group" style:--k={section.color ?? 'var(--gold)'}>
			<header class="group-head">
				<h2>{section.title} <span>{section.cards.length}</span></h2>
				<p class="group-sub">{section.subtitle}</p>
			</header>
			<ul class="grid">
				{#each section.cards as card (card.id)}
					{@const p = card.person}
					{@const art = cardArt(card)}
					{@const isNation = p?.entity === 'nation'}
					{@const kc = p ? (KINGDOMS[p.kingdom] ?? KINGDOMS.other) : KINGDOMS.other}
					{@const playing = playingId === card.id}
					<li class="card" class:playing style:--k={p ? colorOf(p) : 'var(--gold)'}>
						<div class="card-top">
							<span
								class="portrait"
								class:flag={isNation}
								class:silhouette={!isNation && !!art && p ? isPlaceholderArt(art) : false}
								aria-hidden="true"
							>
								{#if art}
									<img src={art} alt="" />
								{:else if p}
									{hangulInitial(p)}
								{:else}
									♪
								{/if}
							</span>
							<span class="who">
								<span class="who-name">{p ? nameOf(p) : card.id}</span>
								<span class="who-sub">
									{#if p && koreanOf(p)}<span class="ko">{koreanOf(p)}</span><span class="sep">·</span>{/if}
									{#if !isNation && p}
										{#if kingdomFlag(p.kingdom)}<img class="mini-flag" src={kingdomFlag(p.kingdom)} alt="" />{/if}
										{kc.label}
									{:else if p && titleOf(p)}
										{titleOf(p)}
									{/if}
								</span>
								<span class="chips">
									<span class="chip">{INSTRUMENT_LABELS[card.motif.instrument ?? 'gayageum']}</span>
									{#each backingLabels(card.motif) as part (part)}
										<span class="chip">{part}</span>
									{/each}
									{#if tempsOf(card.motif).length}
										<span class="chip temp-chip">TEMP</span>
									{/if}
									<span class="chip dim">{card.motif.bpm} bpm · {durationLabel(card.motif)}</span>
								</span>
							</span>
							<span class="play-col">
								<button
									type="button"
									class={['play', playing && 'on']}
									onclick={() => toggle(card.id)}
									aria-pressed={playing}
									aria-label={playing ? `Stop ${p ? nameOf(p) : card.id}` : `Play ${p ? nameOf(p) : card.id}`}
								>
									<span class="material-symbols-outlined" aria-hidden="true"
										>{playing ? 'stop' : 'play_arrow'}</span
									>
								</button>
							</span>
						</div>

						<div class="score">
							<SheetMusic motif={card.motif} />
						</div>

						<p class="idea">{card.motif.idea}</p>

						<TempRefs temps={tempsOf(card.motif)} />
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</main>

<style>
	.music {
		min-height: 100dvh;
		padding: max(2rem, env(safe-area-inset-top, 0px) + 1.25rem)
			max(1.75rem, env(safe-area-inset-right, 0px))
			max(4rem, env(safe-area-inset-bottom, 0px) + 2rem)
			max(1.75rem, env(safe-area-inset-left, 0px));
		background:
			radial-gradient(ellipse 70% 45% at 8% 0%, rgba(216, 178, 106, 0.08), transparent 55%),
			radial-gradient(ellipse 55% 40% at 92% 8%, rgba(62, 121, 228, 0.05), transparent 50%),
			var(--bg);
	}

	.mast {
		max-width: 72rem;
		margin: 0 auto 2.4rem;
	}

	.mast-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.75rem;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.dot {
		opacity: 0.5;
	}

	.mast h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.85rem, 2.6vw, 2.6rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: var(--fg-strong);
	}

	.lede {
		margin: 0.7rem 0 0;
		max-width: 46rem;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.group {
		max-width: 72rem;
		margin: 0 auto 2.8rem;
	}

	.group-head {
		margin: 0 0 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--k) 30%, var(--hairline));
		padding-bottom: 0.5rem;
	}

	.group h2 {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		margin: 0;
		font-family: var(--serif);
		font-size: 0.88rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.group h2 span {
		font-family: var(--sans);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.group-sub {
		margin: 0.28rem 0 0;
		font-family: var(--serif);
		font-size: 0.88rem;
		font-style: italic;
		letter-spacing: 0.02em;
		color: var(--fg-dim);
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(26rem, 100%), 1fr));
		gap: 0.9rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 1rem 1.05rem 0.95rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: var(--panel);
		transition:
			border-color 0.22s var(--ease),
			background 0.22s var(--ease);
	}

	.card:hover {
		border-color: rgba(216, 178, 106, 0.35);
		background: var(--bg-raised);
	}

	.card.playing {
		border-color: color-mix(in srgb, var(--gold) 60%, transparent);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--gold) 35%, transparent) inset;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.portrait {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 3.4rem;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: var(--radius);
		font-family: var(--serif);
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--fg-dim);
	}

	.portrait img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
	}

	.portrait.silhouette img {
		opacity: 0.62;
	}

	.portrait.flag {
		aspect-ratio: 3 / 2;
		width: 4.4rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--k) 14%, var(--panel-sunken));
		border: 1px solid var(--hairline);
	}

	.portrait.flag img {
		object-fit: contain;
		object-position: center;
		padding: 0.3rem 0.4rem;
		box-sizing: border-box;
	}

	.who {
		min-width: 0;
		flex: 1;
		display: grid;
		gap: 0.2rem;
	}

	.who-name {
		font-weight: 600;
		font-size: 1.02rem;
		color: var(--fg-strong);
		letter-spacing: var(--tracking-display);
	}

	.who-sub {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.74rem;
		color: var(--fg-faint);
	}

	.sep {
		opacity: 0.45;
	}

	.mini-flag {
		width: 0.9rem;
		height: 0.6rem;
		object-fit: cover;
		border-radius: 1px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.15rem;
	}

	.chip {
		font-size: 0.62rem;
		letter-spacing: 0.05em;
		color: var(--fg-dim);
		background: var(--glass);
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		padding: 0.14rem 0.5rem;
	}

	.chip.dim {
		color: var(--fg-faint);
	}

	.play-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.28rem;
		flex-shrink: 0;
	}

	.play {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 2.7rem;
		height: 2.7rem;
		border-radius: var(--radius-pill);
		border: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		background: var(--glass);
		color: var(--gold);
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			color 0.2s var(--ease),
			transform 0.2s var(--ease);
	}

	.temp-chip {
		color: var(--gold);
		border-style: dashed;
	}

	.play:hover {
		transform: scale(1.05);
	}

	.play.on {
		background: var(--gold);
		color: var(--on-gold);
		border-color: var(--gold);
	}

	.play .material-symbols-outlined {
		font-size: 1.35rem;
	}

	.score {
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--panel-sunken) 70%, transparent);
		padding: 0.25rem 0.4rem;
		color: var(--fg);
	}

	.idea {
		margin: 0;
		font-size: 0.8rem;
		font-style: italic;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
