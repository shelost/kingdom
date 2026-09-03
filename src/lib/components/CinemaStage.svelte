<script lang="ts">
	/**
	 * Cinema mode — the chronicle played as an episode.
	 *
	 * Layout (desktop): a fixed viewport grid matching the cinema mockup —
	 *   Scene (top-left, letterboxed) | Script (full-height right rail)
	 *   Character | Active Dialogue   | ↑
	 *
	 * The reader still scrolls the same document under the stage: nothing here
	 * drives the story, it *stages* what `watchReading()` already reports. The
	 * reading column is hidden while cinema is live (see `app.css` /
	 * `+page.svelte`); Peek hands that chrome back. Script-rail clicks call
	 * `activateDialogue` so the live line, panel cuts and voice stay in sync.
	 *
	 * Cuts are timed, not scrubbed: a new episode gets a hard fade to black and
	 * a cold-open card, a new panel inside an episode gets a short smash cut, a
	 * new speaker gets a reaction dip. `prefers-reduced-motion` shortens every
	 * one of them and stops the camera moving at all.
	 */
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import {
		reading,
		goToEpisodeById,
		activateDialogue,
		scrollToBand
	} from '$lib/reading.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { stageText } from '$lib/stageText';
	import { buildBeats } from '$lib/beats';
	import {
		episodeContextOf,
		gradeFilter,
		gradeFor,
		panelIndexAt,
		panelsOf,
		placeArt
	} from '$lib/cinema';
	import { PLACES } from '$lib/places';
	import {
		avatarOf,
		byId,
		colorOf,
		hangulInitial,
		isPlaceholderArt,
		koreanOf,
		nameOf,
		KINGDOMS
	} from '$lib/people';
	import { openProfile } from '$lib/profiles.svelte';
	import { speech, stopSpeech } from '$lib/speech.svelte';
	import { stinger, whoosh, closeStingers } from '$lib/stingers';
	import Blocks from './Blocks.svelte';
	import SpeakerPlate from './SpeakerPlate.svelte';
	import { storyImg, optimizeSrc } from '$lib/img';

	/** Cinema only takes the screen once the reader is past cover + blurb. */
	let live = $derived(reading.mode === 'cinema' && scriptUi.inScript);
	let reduce = $derived(prefersReducedMotion.current);

	/* ————— where we are ————— */
	let episode = $derived(episodeContextOf(reading.entryId));
	let place = $derived(reading.place ? (PLACES[reading.place] ?? null) : null);

	let panels = $derived(episode ? panelsOf(episode.entry, reading.place) : []);
	let panelIndex = $derived(panelIndexAt(panels.length, reading.entryProgress));
	let panel = $derived(panels[panelIndex] ?? null);
	/** The card behind the cold open: location art, else the episode's own panel. */
	let cardArt = $derived(placeArt(reading.place) ?? panels[0]?.src ?? null);

	let grade = $derived(gradeFor(reading.place, reading.flash));
	let filter = $derived(gradeFilter(grade));

	/* ————— script rail —————
	   The rail renders the *actual* script — the live episode's beats through
	   the same `Blocks` component the script / immersion column uses — so the
	   two renderings can never drift. Interaction is mapped back onto the
	   reading document under the stage: a click on a rail line activates the
	   matching line in the page, and the page's live line lights the matching
	   rail block. */
	let beats = $derived(episode ? buildBeats(episode.entry) : []);
	let railEl: HTMLElement | undefined = $state();

	/** Blocks of one prose tree, flashback containers unwrapped to their blocks. */
	function proseBlocks(root: ParentNode): HTMLElement[] {
		return [...root.querySelectorAll<HTMLElement>('.prose > *')].filter(
			(el) => !el.matches('.mini')
		);
	}

	/** The live entry's article in the reading document. */
	function liveArticle(): HTMLElement | null {
		return reading.entryId ? document.getElementById(reading.entryId) : null;
	}

	/* Light + reveal the rail line matching the live one. The marker is the
	   same `is-speaking` class the document wears, so the rail line takes the
	   identical featured wash. The rail and the article render the same blocks
	   through the same component, so `[data-speaker]` indexes line up 1:1. */
	$effect(() => {
		if (!live) return;
		/* subscribe to the live utterance */
		void stageText.key;
		void reading.speaker;
		void reading.entryId;
		const root = railEl;
		if (!root) return;
		const raf = requestAnimationFrame(() => {
			const article = liveArticle();
			const docNodes = article
				? [...article.querySelectorAll<HTMLElement>('[data-speaker]')]
				: [];
			const i = docNodes.findIndex((n) => n.classList.contains('is-speaking'));
			const railNodes = [...root.querySelectorAll<HTMLElement>('[data-speaker]')];
			railNodes.forEach((n, j) => n.classList.toggle('is-speaking', j === i));
			if (i >= 0) {
				railNodes[i]?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
			}
		});
		return () => cancelAnimationFrame(raf);
	});

	/** Rail clicks act on the reading document, not the rail's copy of the line. */
	function onRailClickCapture(e: MouseEvent) {
		const root = railEl;
		const t = e.target instanceof Element ? e.target : null;
		const pick = t?.closest('.lines.pick');
		if (!root || !pick || !root.contains(pick)) return;
		e.preventDefault();
		e.stopPropagation();
		stopPlay();
		const node = pick.closest<HTMLElement>('[data-speaker]');
		const article = liveArticle();
		if (!node || !article) return;
		const i = [...root.querySelectorAll<HTMLElement>('[data-speaker]')].indexOf(node);
		const docNode = article.querySelectorAll<HTMLElement>('[data-speaker]')[i];
		if (!docNode) return;
		activateDialogue(docNode.querySelector<HTMLElement>('.lines') ?? docNode);
	}

	/* ————— play: the chronicle read straight through —————
	   Advances the reading document block by block: dialogue is put on stage
	   (and spoken, when the voice is on), narration is glided through on a
	   clock proportional to its length. Any hand on the wheel pauses it. */
	let autoplay = $state(false);
	let playToken = 0;

	const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

	/** How long a silent block holds the stage — proportional to its text. */
	function readMs(text: string): number {
		return Math.min(14000, Math.max(1500, text.length * 55));
	}

	/** Every script block in the reading document, in reading order. */
	function documentBlocks(): HTMLElement[] {
		const root = document.getElementById('script');
		return root ? proseBlocks(root) : [];
	}

	/** The block nearest the reading band — where a fresh run picks up. */
	function nearestBlockIndex(blocks: HTMLElement[]): number {
		const mid = window.innerHeight * 0.4;
		let best = 0;
		let bestD = Infinity;
		blocks.forEach((el, i) => {
			const r = el.getBoundingClientRect();
			const d = Math.abs((r.top + r.bottom) / 2 - mid);
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		});
		return best;
	}

	/** Scroll the rail to its copy of a document block (narration beats). */
	function revealInRail(docBlock: HTMLElement) {
		const root = railEl;
		const article = docBlock.closest<HTMLElement>('article.entry');
		if (!root || !article || article.id !== reading.entryId) return;
		const i = proseBlocks(article).indexOf(docBlock);
		if (i < 0) return;
		proseBlocks(root)[i]?.scrollIntoView({
			block: 'center',
			behavior: reduce ? 'auto' : 'smooth'
		});
	}

	function stillPlaying(token: number) {
		return autoplay && token === playToken && live;
	}

	/** Wait out the live line's clip (or give up if it never starts). */
	async function waitForVoice(token: number) {
		const started = Date.now();
		while (
			stillPlaying(token) &&
			!speech.playing &&
			!speech.loading &&
			Date.now() - started < 2500
		) {
			await sleep(120);
		}
		while (
			stillPlaying(token) &&
			(speech.playing || speech.loading) &&
			Date.now() - started < 90000
		) {
			await sleep(150);
		}
	}

	async function playLoop() {
		const token = ++playToken;
		let blocks = documentBlocks();
		if (!blocks.length) {
			autoplay = false;
			return;
		}
		let i = nearestBlockIndex(blocks);

		while (stillPlaying(token)) {
			blocks = documentBlocks(); /* episodes scope remounts the document */
			const el = blocks[i];

			if (!el) {
				/* End of the mounted document: episodes scope hands off to the
				   next episode; the full scroll has simply finished. */
				const next = episode?.next;
				if (reading.viewScope === 'episodes' && next) {
					goToEpisodeById(next.id);
					await sleep(900);
					i = 0;
					continue;
				}
				break;
			}

			const text = (el.textContent ?? '').trim();
			if (el.matches('.dialogue[data-speaker]')) {
				/* A profiled line: put it on stage the way a click would. */
				activateDialogue(el.querySelector<HTMLElement>('.lines') ?? el);
				await sleep(700); /* the glide + the voice cueing up */
				if (!stillPlaying(token)) break;
				if (speech.auto) await waitForVoice(token);
				else await sleep(readMs(text));
			} else {
				scrollToBand(el);
				revealInRail(el);
				await sleep(Math.max(900, readMs(text)));
			}
			i += 1;
		}

		if (token === playToken) autoplay = false;
	}

	function stopPlay() {
		if (!autoplay) return;
		autoplay = false;
		playToken += 1;
		stopSpeech();
	}

	function togglePlay() {
		if (autoplay) {
			stopPlay();
			return;
		}
		autoplay = true;
		void playLoop();
	}

	/* The reader's own hand always wins: wheel / touch / keys pause the run.
	   The pills themselves are exempt, or the keyboard could never pause. */
	$effect(() => {
		if (!autoplay) return;
		const stop = (e: Event) => {
			const t = e.target;
			if (t instanceof Element && t.closest('.pills')) return;
			stopPlay();
		};
		window.addEventListener('wheel', stop, { passive: true });
		window.addEventListener('touchstart', stop, { passive: true });
		window.addEventListener('keydown', stop);
		return () => {
			window.removeEventListener('wheel', stop);
			window.removeEventListener('touchstart', stop);
			window.removeEventListener('keydown', stop);
		};
	});

	$effect(() => {
		if (!live) stopPlay();
	});

	/** Wheel over the stage (not the script rail) advances the underlying scroll. */
	function onStageWheel(e: WheelEvent) {
		if (!live || peek) return;
		const t = e.target;
		if (t instanceof Element && t.closest('.script')) return;
		e.preventDefault();
		window.scrollBy({ top: e.deltaY, left: 0, behavior: 'auto' });
	}

	/* ————— who is on stage ————— */
	let person = $derived(reading.speaker ? (byId.get(reading.speaker) ?? null) : null);
	let accent = $derived(
		person ? colorOf(person) || KINGDOMS[person.kingdom].color : 'var(--gold)'
	);
	let bust = $derived(
		person ? avatarOf(person, stageText.ko || stageText.en, reading.year, reading.look) : null
	);

	/* ————— transient camera state ————— */
	let coldOpen = $state(false);
	let cutting = $state(false);
	let reaction = $state(false);
	let placeShift = $state(false);
	let peek = $state(false);

	/* Timed chrome: the title card and the scene slug appear on their cue, hold
	   a beat, then clear the frame — fixed chrome must never sit over prose the
	   reader is scrolling through. */
	let runShown = $state(false);
	let slugShown = $state(false);

	let cutTimer: ReturnType<typeof setTimeout> | undefined;
	let reactionTimer: ReturnType<typeof setTimeout> | undefined;
	let runTimer: ReturnType<typeof setTimeout> | undefined;
	let slugTimer: ReturnType<typeof setTimeout> | undefined;

	/** Black out the panel for one beat — a cut, not a dissolve. */
	function flashCut(ms: number) {
		clearTimeout(cutTimer);
		cutting = true;
		cutTimer = setTimeout(() => (cutting = false), ms);
	}

	/* Entry change: hard cut, cold-open card, episode sting. Held in a local
	   rather than derived state — it is a record of what has already been
	   announced, not part of the rendered scene. */
	let announced: string | null = null;
	let lastPlace: string | null = null;

	$effect(() => {
		if (!live) {
			announced = null;
			lastPlace = null;
			coldOpen = false;
			placeShift = false;
			runShown = false;
			return;
		}

		const id = reading.entryId;
		if (!id || id === announced) return;
		announced = id;

		const here = reading.place;
		placeShift = !!lastPlace && !!here && here !== lastPlace;
		lastPlace = here;

		flashCut(reduce ? 140 : 320);
		coldOpen = true;
		stinger();

		/* The episode title card holds long enough to be read after the cold
		   open lifts, then gets out of the reader's way. */
		clearTimeout(runTimer);
		runShown = true;
		runTimer = setTimeout(() => (runShown = false), reduce ? 3200 : 5600);

		const hold = setTimeout(
			() => {
				coldOpen = false;
				placeShift = false;
			},
			reduce ? 1100 : 2300
		);
		return () => clearTimeout(hold);
	});

	/* Speaker change: a soft whoosh and a reaction dip on the panel. */
	let lastSpeaker: string | null = null;

	$effect(() => {
		if (!live) {
			lastSpeaker = null;
			return;
		}
		const next = reading.speaker;
		if (next === lastSpeaker) return;
		const had = lastSpeaker !== null;
		lastSpeaker = next;
		if (!had || !next) return;

		whoosh();
		clearTimeout(reactionTimer);
		reaction = true;
		reactionTimer = setTimeout(() => (reaction = false), reduce ? 90 : 220);
	});

	/* Panel change inside an episode: a short smash cut between beats. */
	let lastPanel = -1;

	$effect(() => {
		if (!live) {
			lastPanel = -1;
			return;
		}
		const i = panelIndex;
		if (i === lastPanel) return;
		const had = lastPanel >= 0;
		lastPanel = i;
		if (had) flashCut(reduce ? 100 : 210);
	});

	/** Peek: hand the page's own chrome back for as long as it is held open. */
	$effect(() => {
		const on = live && peek;
		document.documentElement.classList.toggle('is-cinema-peek', on);
		return () => document.documentElement.classList.remove('is-cinema-peek');
	});

	$effect(() => {
		if (live) return;
		/* Leaving cinema: drop the synth so no context is left running. */
		closeStingers();
		peek = false;
	});

	$effect(() => {
		return () => {
			clearTimeout(cutTimer);
			clearTimeout(reactionTimer);
			clearTimeout(runTimer);
			clearTimeout(slugTimer);
			closeStingers();
		};
	});

	/** Caption box: the scene slug, with a connective when the scene moved. */
	let eyebrow = $derived(
		reading.flash ? 'Years before' : placeShift ? 'Meanwhile' : null
	);
	let slug = $derived(
		[place?.name, episode?.entry.year].filter((s) => !!s && String(s).trim()).join(' · ')
	);

	/* Scene slug: announce the scene (or a flashback's "Years before…"), hold,
	   then fade — it reads like a broadcast super, not a permanent fixture. */
	let lastSlugKey: string | null = null;

	$effect(() => {
		if (!live) {
			lastSlugKey = null;
			slugShown = false;
			return;
		}
		const key = slug ? `${eyebrow ?? ''}|${slug}` : null;
		if (key === lastSlugKey) return;
		lastSlugKey = key;
		clearTimeout(slugTimer);
		if (!key) {
			slugShown = false;
			return;
		}
		slugShown = true;
		slugTimer = setTimeout(() => (slugShown = false), reduce ? 2800 : 4800);
	});

	/**
	 * End card: the episode has played out and another one follows.
	 *
	 * The threshold is deliberately short of the entry's last pixel — the next
	 * entry takes the reading band before this one has fully left it, so a card
	 * that waited for 1.0 would never be seen.
	 */
	let nextUp = $derived(episode?.next ?? null);
	let atEnd = $derived(reading.entryProgress > 0.86 && !!nextUp);

	function jumpNext() {
		stopPlay();
		const next = episode?.next;
		if (!next) return;
		/* Episodes scope mounts one entry at a time — it has to remount first. */
		if (reading.viewScope === 'episodes') {
			goToEpisodeById(next.id);
			return;
		}
		document
			.getElementById(next.id)
			?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
	}

	let cardIn = $derived({ duration: reduce ? 0 : 420 });
	let cardOut = $derived({ duration: reduce ? 0 : 320 });
	let nextPanel = $derived(panels[panelIndex + 1] ?? null);
	const CINEMA_SIZES = '(max-width: 820px) 100vw, 70vw';
</script>

<svelte:head>
	{#if live && nextPanel}
		<link rel="preload" as="image" href={optimizeSrc(nextPanel.src, 1200)} />
	{/if}
</svelte:head>

{#if live}
	<!-- Wheel advances the underlying document; script rail keeps its own scroll. -->
	<div
		class="stage"
		class:peeking={peek}
		class:cut={cutting}
		style:--k={accent}
		style:--cin-tint={grade.tint}
		style:--cin-wash={grade.wash}
		onwheel={onStageWheel}
	>
		<!-- ————— Scene (top-left, letterboxed) ————— -->
		<section class="scene" aria-label="Scene">
			{#if panel}
				{#key panel.src}
					<div
						class="matte"
						class:pan={panel.kind === 'place'}
						class:hold={!person}
						class:dip={reaction}
					>
						<img
							{...storyImg(panel.src, {
								kind: 'cue',
								priority: true,
								sizes: CINEMA_SIZES,
								alt: panel.alt ?? ''
							})}
							style:filter
							in:fade={cardIn}
							out:fade={cardOut}
						/>
					</div>
				{/key}
			{:else}
				<div class="matte empty" aria-hidden="true"></div>
			{/if}
			<div class="wash" aria-hidden="true"></div>
			<div class="vignette" aria-hidden="true"></div>

			{#if episode && runShown}
				<div
					class="run"
					in:fly={{ y: reduce ? 0 : -10, duration: reduce ? 0 : 360 }}
					out:fade={{ duration: reduce ? 0 : 460 }}
				>
					<span class="season">Season {episode.season} · {episode.chapter.title}</span>
					<span class="ep">
						Episode {episode.episode}
						<span class="of">/</span>
						{episode.episodeCount}
					</span>
					<span class="bar" aria-hidden="true">
						<span class="fill" style:transform="scaleX({reading.entryProgress})"></span>
					</span>
				</div>
			{/if}

			{#if slug && slugShown}
				{#key slug}
					<div
						class="caption"
						in:fly={{ y: reduce ? 0 : -8, duration: reduce ? 0 : 320 }}
						out:fade={{ duration: reduce ? 0 : 420 }}
					>
						{#if eyebrow}<span class="cap-eyebrow">{eyebrow}…</span>{/if}
						<span class="cap-slug">{slug}</span>
					</div>
				{/key}
			{/if}
		</section>

		<!-- ————— Script (full-height right) —————
		     The real script: the live episode's beats through the same Blocks
		     component the reading column uses. Clicks are delegated back onto
		     the document (capture, so the rail's own copies never take the stage). -->
		<aside class="script" aria-label="Script">
			<header class="script-head">
				<span class="script-label">Script</span>
				{#if episode}
					<span class="script-ep">Ep {episode.episode} · {episode.entry.title}</span>
				{/if}
			</header>
			<div class="script-list" bind:this={railEl} onclickcapture={onRailClickCapture}>
				{#if beats.length}
					{#each beats as beat, bi (bi)}
						<div class="rail-beat" data-beat={bi}>
							<Blocks blocks={beat.blocks} year={reading.year} />
						</div>
					{/each}
				{:else}
					<p class="script-empty">No script in this episode.</p>
				{/if}
			</div>
		</aside>

		<!-- ————— floor: Character | Active Dialogue ————— -->
		<div class="floor">
			<section class="character" aria-label="Character">
				{#if person}
					{@const p = person}
					{@const who = nameOf(p, reading.year)}
					{@const ko = koreanOf(p, reading.year)}
					{#key `${p.id}:${bust}`}
						<button
							type="button"
							class="bust"
							class:fallback={!bust}
							class:silhouette={isPlaceholderArt(bust) && p.id !== 'courtmaid'}
							onclick={() => openProfile(p.id, reading.year)}
							aria-label="Open profile for {who}"
							in:fade={{ duration: reduce ? 0 : 300 }}
							out:fade={{ duration: reduce ? 0 : 200 }}
						>
							{#if bust}
								<img {...storyImg(bust, { kind: 'portrait', alt: '', sizes: '176px' })} />
							{:else}
								<span class="initial" aria-hidden="true">{hangulInitial(p)}</span>
							{/if}
						</button>
					{/key}
					<div class="char-meta">
						<span class="char-name">{who}</span>
						{#if ko}<span class="char-ko">{ko}</span>{/if}
					</div>
				{:else}
					<div class="char-empty" aria-hidden="true">
						<span class="char-empty-label">Character</span>
					</div>
				{/if}
			</section>

			<section class="dialogue" aria-label="Active dialogue" aria-live="polite">
				{#if person}
					<!-- The immersion speaker plate itself, mounted as a panel — one
					     dialogue box for both stages, so they can never drift. -->
					<SpeakerPlate variant="panel" />
				{:else if episode}
					{@const entry = episode.entry}
					<div class="narration">
						<span class="nar-label">{eyebrow ?? 'Narration'}</span>
						<p class="nar-title">
							{entry.title}
							{#if entry.subtitle}<span class="nar-ko">{entry.subtitle}</span>{/if}
						</p>
						{#if place}
							<p class="nar-place">{place.name}{place.korean ? ` · ${place.korean}` : ''}</p>
						{/if}
					</div>
				{:else}
					<div class="narration idle">
						<span class="nar-label">Active Dialogue</span>
						<p class="nar-title">Scroll or pick a line from the script.</p>
					</div>
				{/if}
			</section>
		</div>

		<!-- play / peek pills + end card sit over the grid -->
		<div class="pills">
			<button
				type="button"
				class="pill play"
				class:on={autoplay}
				aria-pressed={autoplay}
				title={autoplay
					? 'Pause the read-through'
					: 'Play the script straight through, line by line'}
				onclick={togglePlay}
			>
				<span class="material-symbols-outlined" aria-hidden="true">
					{autoplay ? 'pause' : 'play_arrow'}
				</span>
				<span class="pill-label">{autoplay ? 'Pause' : 'Play'}</span>
			</button>
			<button
				type="button"
				class="pill peek"
				class:on={peek}
				aria-pressed={peek}
				title={peek ? 'Hide the page chrome again' : 'Peek at relations, location and art'}
				onclick={() => {
					stopPlay();
					peek = !peek;
				}}
			>
				<span class="material-symbols-outlined" aria-hidden="true">
					{peek ? 'visibility_off' : 'visibility'}
				</span>
				<span class="pill-label">{peek ? 'Hide' : 'Peek'}</span>
			</button>
		</div>

		{#if atEnd && episode && nextUp}
			{@const ep = episode}
			{@const next = nextUp}
			<div
				class="end-card"
				in:fly={{ y: reduce ? 0 : 14, duration: reduce ? 0 : 380 }}
				out:fade={cardOut}
			>
				<span class="end-eyebrow">End of episode {ep.episode}</span>
				<button type="button" class="end-next" onclick={jumpNext}>
					<span class="end-arrow" aria-hidden="true">Next →</span>
					<span class="end-title">{next.title}</span>
					{#if next.subtitle}<span class="end-ko">{next.subtitle}</span>{/if}
				</button>
				<span class="end-run">{ep.overall} of {ep.overallCount}</span>
			</div>
		{/if}
	</div>

	<!-- ————— cold open ————— -->
	{#if coldOpen && episode}
		<div class="cold" out:fade={cardOut} in:fade={{ duration: reduce ? 0 : 160 }}>
			{#if cardArt}
				<img
					class="cold-art"
					{...storyImg(cardArt, {
						kind: 'cue',
						priority: true,
						sizes: '100vw',
						alt: ''
					})}
					style:filter
				/>
			{/if}
			<div class="cold-inner" in:fly={{ y: reduce ? 0 : 16, duration: reduce ? 0 : 520 }}>
				<span class="cold-season">Season {episode.season} · {episode.chapter.title}</span>
				<h2 class="cold-title">
					<span class="cold-num">Episode {episode.episode}</span>
					<span class="cold-dot" aria-hidden="true">·</span>
					<span class="cold-name">{episode.entry.title}</span>
				</h2>
				{#if episode.entry.subtitle}
					<p class="cold-ko">{episode.entry.subtitle}</p>
				{/if}
				<p class="cold-meta">
					{episode.entry.year}{place ? ` · ${place.name}` : ''}
				</p>
			</div>
		</div>
	{/if}
{/if}

<style>
	/* ————— viewport grid —————
	   Two columns: wide stage + script rail. Left column splits into Scene on
	   top and Character | Active Dialogue on the bottom row. */
	.stage {
		--gap: 0.65rem;
		/* The stage's own grid metrics: a fixed 400px script rail, the floor row
		   (character + dialogue) and the character pane's width. */
		--cin-script-w: 400px;
		--cin-floor-h: clamp(11rem, 26vh, 14rem);
		--cin-char-w: 11rem;
		--pad: max(0.75rem, env(safe-area-inset-top, 0px)) max(0.75rem, env(safe-area-inset-right, 0px))
			max(0.75rem, env(safe-area-inset-bottom, 0px)) max(0.75rem, env(safe-area-inset-left, 0px));
		position: fixed;
		inset: 0;
		left: var(--shell-shift);
		z-index: 92;
		display: grid;
		grid-template-columns: minmax(0, 1fr) var(--cin-script-w);
		grid-template-rows: minmax(0, 1fr) var(--cin-floor-h);
		gap: var(--gap);
		padding: var(--pad);
		box-sizing: border-box;
		background: var(--bg);
		transition:
			left var(--toc-duration) var(--toc-ease),
			opacity 280ms var(--ease),
			visibility 280ms var(--ease);
	}

	.stage.peeking {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.stage.cut .matte img {
		opacity: 0;
		transition: opacity 90ms linear;
	}

	.scene {
		grid-column: 1;
		grid-row: 1;
		position: relative;
		min-height: 0;
		overflow: hidden;
		border: 1px solid var(--hairline);
		background: #050508;
	}

	.script {
		grid-column: 2;
		grid-row: 1 / -1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--panel) 88%, #0c0c10);
		pointer-events: auto;
	}

	.floor {
		grid-column: 1;
		grid-row: 2;
		display: grid;
		grid-template-columns: var(--cin-char-w) minmax(0, 1fr);
		gap: var(--gap);
		min-width: 0;
		min-height: 0;
	}

	.character {
		position: relative;
		display: flex;
		align-items: stretch;
		min-width: 0;
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--plate-ink) 92%, transparent);
		overflow: hidden;
	}

	.dialogue {
		min-width: 0;
		display: flex;
		align-items: stretch;
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--plate-ink) 90%, transparent);
		pointer-events: auto;
	}

	/* ————— letterboxed scene ————— */
	.matte {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
	}

	.matte.empty {
		background:
			linear-gradient(180deg, #0a0a0e 0%, #121218 100%);
	}

	.matte img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 100%;
		aspect-ratio: 21 / 9;
		object-fit: cover;
		object-position: center 42%;
		transform-origin: 50% 45%;
		animation: push-in 30s var(--ease) infinite alternate;
		background: #000;
	}

	.matte.pan img {
		object-position: center 50%;
		animation: pan-across 38s var(--ease) infinite alternate;
	}

	.matte.hold img {
		animation-play-state: paused;
	}

	.matte.dip img {
		filter: brightness(0.72) saturate(0.8) !important;
		transition: filter 120ms linear;
	}

	@keyframes push-in {
		from {
			transform: scale(1.04) translate3d(0, 0, 0);
		}
		to {
			transform: scale(1.12) translate3d(0, -1.2%, 0);
		}
	}

	@keyframes pan-across {
		from {
			transform: scale(1.08) translate3d(-2%, 0, 0);
		}
		to {
			transform: scale(1.08) translate3d(2%, 0, 0);
		}
	}

	.wash {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: var(--cin-tint);
		opacity: var(--cin-wash);
		mix-blend-mode: soft-light;
		transition:
			background 900ms var(--ease),
			opacity 900ms var(--ease);
	}

	.vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0.45) 0%,
				transparent 18%,
				transparent 78%,
				rgba(0, 0, 0, 0.55) 100%
			),
			radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(0, 0, 0, 0.35) 100%);
	}

	/* ————— scene chrome ————— */
	.run {
		position: absolute;
		top: 0.7rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		display: grid;
		grid-template-columns: auto auto;
		align-items: baseline;
		gap: 0 0.9rem;
		padding: 0.4rem 0.95rem 0.5rem;
		border: 1px solid var(--hairline);
		border-radius: 4px;
		background: color-mix(in srgb, var(--plate-ink) 78%, transparent);
		backdrop-filter: blur(10px);
		max-width: min(34rem, calc(100% - 2rem));
		pointer-events: none;
	}

	.season,
	.ep {
		font-size: 0.66rem;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--plate-fg-quiet);
	}

	.ep {
		justify-self: end;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.of {
		opacity: 0.5;
		margin: 0 0.1em;
	}

	.bar {
		grid-column: 1 / -1;
		margin-top: 0.35rem;
		height: 1px;
		background: var(--hairline);
		overflow: hidden;
	}

	.fill {
		display: block;
		height: 100%;
		width: 100%;
		transform-origin: left center;
		background: var(--gold);
		transition: transform 220ms linear;
	}

	.caption {
		position: absolute;
		top: 0.7rem;
		left: 0.7rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		max-width: min(20rem, 46%);
		padding: 0.45rem 0.8rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--gold) 36%, transparent);
		border-left-width: 3px;
		border-radius: 2px;
		background: color-mix(in srgb, var(--plate-ink) 80%, transparent);
		backdrop-filter: blur(10px);
		pointer-events: none;
	}

	.cap-eyebrow {
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.78rem;
		line-height: 1.15;
		color: var(--gold);
	}

	.cap-slug {
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--plate-fg);
	}

	/* ————— script rail ————— */
	.script-head {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.7rem 0.85rem 0.55rem;
		border-bottom: 1px solid var(--hairline);
	}

	.script-label {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.script-ep {
		font-family: var(--serif);
		font-size: 0.78rem;
		color: var(--fg-dim);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.script-list {
		flex: 1 1 auto;
		min-height: 0;
		overflow: auto;
		padding: 0.65rem 0.85rem 1rem;
		overscroll-behavior: contain;
	}

	/* The blocks inside are the reading column's own (Blocks.svelte carries
	   their styling, including the cinema lettering) — the rail only spaces
	   the beats it stacks. */
	.rail-beat {
		margin: 0 0 0.4rem;
	}

	.rail-beat :global(.prose) {
		max-width: none;
	}

	.script-empty {
		margin: 1rem 0.6rem;
		font-size: 0.8rem;
		color: var(--fg-faint);
	}

	/* ————— character ————— */
	.bust {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.bust:focus-visible {
		outline: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		outline-offset: -3px;
	}

	.bust img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		user-select: none;
		-webkit-user-drag: none;
	}

	.bust.silhouette img {
		opacity: 0.5;
	}

	.bust.fallback {
		display: grid;
		place-items: center;
	}

	.initial {
		display: grid;
		place-items: center;
		width: 4.5rem;
		height: 4.5rem;
		border-radius: 50%;
		font-family: var(--serif);
		font-size: 2rem;
		font-weight: 700;
		color: #fffdf8;
		background: radial-gradient(
			circle at 35% 30%,
			color-mix(in srgb, var(--k) 55%, #2a2a30),
			color-mix(in srgb, var(--k) 72%, #000)
		);
	}

	.char-meta {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		padding: 1.6rem 0.55rem 0.45rem;
		background: linear-gradient(to top, rgba(8, 8, 12, 0.92) 0%, transparent 100%);
		pointer-events: none;
	}

	.char-name {
		display: block;
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--plate-fg-strong);
	}

	.char-ko {
		display: block;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.68rem;
		color: color-mix(in srgb, var(--gold) 70%, var(--plate-fg));
	}

	.char-empty {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		background: color-mix(in srgb, var(--panel-sunken) 80%, transparent);
	}

	.char-empty-label {
		font-size: 0.68rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	/* ————— active dialogue —————
	   The box itself is SpeakerPlate (panel variant) — its styles live there. */
	.narration {
		flex: 1 1 auto;
		min-width: 0;
		padding: 0.85rem 1.1rem;
		border-left: 3px solid color-mix(in srgb, var(--gold) 55%, transparent);
		margin: 0.55rem 0.7rem;
	}

	.nar-label {
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		color: var(--gold);
	}

	.nar-title {
		margin: 0.15rem 0 0;
		font-family: var(--serif);
		font-size: 1.02rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--plate-fg-strong);
	}

	.nar-ko {
		margin-left: 0.5rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--plate-fg-quiet);
	}

	.nar-place {
		margin: 0.15rem 0 0;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--plate-fg-faint);
	}

	/* ————— play / peek pills ————— */
	.pills {
		pointer-events: auto;
		position: absolute;
		right: calc(var(--cin-script-w) + var(--gap) + 0.85rem);
		bottom: calc(var(--cin-floor-h) + var(--gap) + 0.85rem);
		display: flex;
		align-items: center;
		gap: 0.45rem;
		z-index: 3;
	}

	.pill {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.34rem 0.75rem;
		font: inherit;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-dim);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: var(--glass);
		backdrop-filter: blur(14px);
		cursor: pointer;
		opacity: 0.45;
		transition:
			opacity 0.25s var(--ease),
			color 0.25s var(--ease),
			border-color 0.25s var(--ease);
	}

	.pill:hover,
	.pill:focus-visible {
		opacity: 1;
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.pill.on {
		opacity: 1;
		color: var(--on-gold);
		background: var(--gold);
		border-color: var(--gold);
	}

	.pill .material-symbols-outlined {
		font-size: 0.95rem;
	}

	/* ————— end card ————— */
	.end-card {
		position: absolute;
		left: calc((100% - var(--cin-script-w) - var(--gap)) / 2);
		bottom: calc(var(--cin-floor-h) + var(--gap) + 0.85rem);
		transform: translateX(-50%);
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 0.85rem 1.5rem 0.95rem;
		border: 1px solid color-mix(in srgb, var(--gold) 32%, transparent);
		border-radius: 6px;
		background: color-mix(in srgb, var(--plate-ink) 88%, transparent);
		backdrop-filter: blur(14px);
		box-shadow: 0 14px 40px var(--plate-shadow);
		max-width: min(26rem, 48vw);
		text-align: center;
	}

	.end-eyebrow,
	.end-run {
		font-size: 0.64rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--plate-fg-faint);
	}

	.end-next {
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		padding: 0.3rem 0.6rem;
		font: inherit;
		border: none;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		transition: background 0.25s var(--ease);
	}

	.end-next:hover,
	.end-next:focus-visible {
		background: color-mix(in srgb, var(--gold) 14%, transparent);
	}

	.end-arrow {
		font-size: 0.68rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.end-title {
		font-family: var(--serif);
		font-size: 1.12rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--plate-fg-strong);
	}

	.end-ko {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.78rem;
		color: var(--plate-fg-quiet);
	}

	/* ————— cold open ————— */
	.cold {
		position: fixed;
		inset: 0;
		z-index: 94;
		display: grid;
		place-items: center;
		overflow: hidden;
		pointer-events: none;
		background: color-mix(in srgb, var(--plate-ink) 92%, transparent);
	}

	.cold-art {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.3;
		animation: cold-drift 4.2s var(--ease) both;
	}

	@keyframes cold-drift {
		from {
			transform: scale(1.02);
		}
		to {
			transform: scale(1.1);
		}
	}

	.cold-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		padding: 0 2rem;
		text-align: center;
	}

	.cold-season {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.38em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.cold-title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		gap: 0.5rem;
		margin: 0.4rem 0 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(1.6rem, 4.4vw, 3rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--plate-fg-strong);
	}

	.cold-num {
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.cold-dot {
		color: var(--plate-fg-faint);
	}

	.cold-ko {
		margin: 0.35rem 0 0;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: clamp(0.95rem, 1.8vw, 1.2rem);
		color: var(--plate-fg);
	}

	.cold-meta {
		margin: 0.7rem 0 0;
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--plate-fg-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.matte img,
		.matte.pan img,
		.cold-art {
			animation: none;
			transform: none;
		}
	}

	/* ————— mobile: stack Scene → floor → Script ————— */
	@media (max-width: 820px) {
		.stage {
			left: 0;
			grid-template-columns: 1fr;
			grid-template-rows: minmax(28vh, 34vh) auto minmax(0, 1fr);
			--cin-floor-h: auto;
		}

		.scene {
			grid-column: 1;
			grid-row: 1;
		}

		.floor {
			grid-column: 1;
			grid-row: 2;
			grid-template-columns: 5.5rem minmax(0, 1fr);
			min-height: 7.5rem;
		}

		.script {
			grid-column: 1;
			grid-row: 3;
			min-height: 0;
		}

		.pills {
			right: 0.7rem;
			bottom: auto;
			top: 0.65rem;
		}

		.pill-label {
			display: none;
		}

		.end-card {
			left: 50%;
			bottom: auto;
			top: 36%;
			max-width: calc(100vw - 2rem);
		}

		.run {
			max-width: calc(100% - 1.2rem);
			padding: 0.32rem 0.7rem 0.42rem;
		}

		.season {
			max-width: 42vw;
		}
	}
</style>
