<script lang="ts">
	import type { Block } from '$lib/story';
	import { PLACES } from '$lib/places';
	import { KINGDOMS, linkPeople } from '$lib/people';
	import { NATIVE_NAMES, realmInk } from '$lib/names';
	import { PLACE_TYPE_LABEL, cultureOf, nationFlag, nationName, placeType, type PlaceType } from '$lib/cardTheme';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import { openProfile } from '$lib/profiles.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { storyImg } from '$lib/img';
	import BrushGlyphs from './BrushGlyphs.svelte';
	import CornerMark from './CornerMark.svelte';
	import Material, { type MaterialKind } from './Material.svelte';

	type PlaceBlock = Extract<Block, { kind: 'place' }>;

	let { block, year = null }: { block: PlaceBlock; year?: number | null } = $props();

	const PAREN = /\s*\((.*)\)\s*/;
	/** Surfaces that are not paper: dressed stone, the night of the other world. */
	const SURFACE: Partial<Record<PlaceType, MaterialKind>> = { fortress: 'stone', monument: 'stone', otherworld: 'indigo' };

	let place = $derived(PLACES[block.place]);
	let tone = $derived(place ? KINGDOMS[place.side]?.color ?? '#8a8a94' : '#8a8a94');
	let type = $derived<PlaceType>(place ? placeType(place) : 'city');
	let culture = $derived(place ? cultureOf(place.side) : 'samhan');
	let dark = $derived(type === 'otherworld');
	let surface = $derived<MaterialKind>(
		SURFACE[type] ?? (culture === 'tang' ? 'silk' : culture === 'yamato' ? 'cloth' : 'paper')
	);
	/** The corner: the owner's flag and the character for what the place is (城 江 山 …). */
	let flag = $derived(place ? nationFlag(place.side, reading.lang) : undefined);
	let kindLabel = $derived.by(() => {
		if (!place) return '';
		const t = PLACE_TYPE_LABEL[type];
		const nation = place.side === 'other' ? '' : nationName(place.side, reading.lang);
		const what = reading.lang === 'en' ? t.en : t.ko;
		return nation ? `${nation} · ${what}` : what;
	});
	/** The place's own boards, avatar first; a board that fails to load hands over to the next. */
	let boards = $derived(
		[place?.avatar, ...(place?.gallery ?? [])].map((b) => b?.trim()).filter((b): b is string => !!b)
	);
	let failed = $derived.by(() => {
		void boards;
		return 0;
	});
	let artPath = $derived(boards[failed]);
	let art = $derived(artPath ? staticAsset(artPath) : null);
	/** The Korean name leads; a modern town in parentheses rides along as a footnote. */
	let korean = $derived(place?.korean?.replace(PAREN, '').trim() || undefined);
	let modern = $derived(place?.korean?.match(PAREN)?.[1]?.trim());
	/** Hanja only when they are the name's meaning, not a spelling of its native sound. */
	let hanja = $derived(
		place && !NATIVE_NAMES.has(place.id) ? place.hanja?.replace(PAREN, '').trim() || undefined : undefined
	);
	/** First sentence of the blurb when the block brings no caption of its own. */
	let fallback = $derived(place?.blurb.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? place?.blurb ?? '');
	let caption = $derived(
		reading.lang === 'ko' && block.ko ? block.ko : (block.html ?? fallback)
	);
	let captionSub = $derived(reading.lang === 'both' && block.ko && block.html ? block.ko : undefined);
	let play = $state(false);

	const start = onceInView(() => {
		play = true;
	});
</script>

{#if place}
	<figure
		class="place-card ink-plate t-{type} culture-{culture}"
		class:has-art={!!art}
		class:dark
		class:live={play}
		style:--tone={tone}
		{@attach start}
	>
		<Material kind={surface} />
		<span class="scenery" aria-hidden="true"></span>
		<span class="plate-tab">{reading.lang === 'en' ? 'Place' : '장소 · Place'}</span>
		<CornerMark
			{flag}
			glyph={PLACE_TYPE_LABEL[type].glyph}
			label={reading.lang === 'en' ? PLACE_TYPE_LABEL[type].en : PLACE_TYPE_LABEL[type].ko}
			color={dark ? '#c9a24a' : realmInk(tone, 0.62)}
			shown={play}
		/>
		<div class="words">
			<span class="kind">{kindLabel}</span>
			{#if hanja}
				<span class="han">
					<BrushGlyphs text={hanja} size="clamp(1rem, 2.8vw, 1.25rem)" {play} />
				</span>
			{/if}
			{#if korean}
				<span class="korean" lang="ko" aria-label={korean}>
					{#each Array.from(korean) as g, i (i)}
						{#if g.trim()}<span class="syl" style:--i={i} aria-hidden="true">{g}</span>{:else}<span class="gap" aria-hidden="true"></span>{/if}
					{/each}
				</span>
			{/if}
			<div class="meta">
				<button type="button" class="name" class:lead={!korean} onclick={() => openProfile(place.id, year)}>
					{place.name}
				</button>
				{#if modern}<span class="modern" lang="ko">{modern}</span>{/if}
				{#if caption}<p class="caption">{@html linkPeople(caption, year)}</p>{/if}
				{#if captionSub && captionSub !== caption}<p class="caption sub" lang="ko">{@html linkPeople(captionSub, year)}</p>{/if}
			</div>
		</div>
		{#if art}
			<div class="art">
				{#key art}
					<img
						{...storyImg(art, { kind: 'place', alt: '', sizes: '(max-width: 820px) 60vw, 22rem' })}
						onerror={() => (failed += 1)}
					/>
				{/key}
			</div>
		{/if}
	</figure>
{/if}

<style>
	.place-card {
		/* The hanja's ink: the owner's colour worked into the theme's sumi. */
		--ink: color-mix(in srgb, var(--tone) 40%, var(--sumi));
		/* The owner's band down the inside of the panel line. */
		--stripe: inset 5px 0 0 var(--tone);
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: 1rem 1.3rem;
		padding: 1.5rem 1.3rem 1.2rem 1.5rem;
		letter-spacing: var(--name-track);
		cursor: pointer;
		box-shadow: var(--stripe);
	}

	.place-card > :global(.material) {
		opacity: 0.75;
	}

	.place-card.has-art {
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
	}

	/* The name keeps clear of the flag and seal in the corner. */
	.place-card:not(.has-art) .words {
		padding-right: 4.4rem;
	}

	.has-art .art {
		margin-top: 1.6rem;
	}

	/* The drawn landscape behind the words: walls, waves, ridges, stars. */
	.scenery {
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
		background-repeat: no-repeat;
	}

	.words,
	.art {
		position: relative;
	}

	.words {
		display: grid;
		justify-items: start;
		gap: 0.25rem;
		min-width: 0;
	}

	.kind {
		font-family: 'Noto Sans KR', var(--ui);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--tone) 70%, var(--sumi));
	}

	/* The hanja: a small brushed footnote above the name, in realm-tinted ink. */
	.han {
		--sumi: var(--ink);
		line-height: 1;
		opacity: 0.88;
	}

	.han :global(.brush-glyphs) {
		gap: 0;
	}

	.korean {
		display: inline-flex;
		flex-wrap: wrap;
		font-family: var(--display-ko);
		font-size: clamp(2.2rem, 7.5vw, 3.1rem);
		line-height: 1.02;
		letter-spacing: var(--name-track);
		color: var(--sumi);
	}

	.gap {
		width: 0.22em;
	}

	.syl {
		display: inline-block;
		opacity: 0;
		transform: translateY(0.28em);
		filter: blur(5px);
	}

	.live .syl {
		animation: syl-in 620ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 75ms + 180ms);
	}

	/* Each line floats up after the one above it: name, modern name, then the blurb. */
	.meta {
		display: grid;
		justify-items: start;
		gap: 0.1rem;
	}

	.meta > * {
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 420ms var(--ease) calc(600ms + var(--k, 0) * 200ms),
			transform 420ms var(--ease) calc(600ms + var(--k, 0) * 200ms);
	}

	.meta > :nth-child(2) { --k: 1; }
	.meta > :nth-child(3) { --k: 2; }
	.meta > :nth-child(4) { --k: 3; }

	.live .meta > * {
		opacity: 1;
		transform: none;
	}

	/* The picture is a panel inside the panel. */
	.art {
		overflow: hidden;
		aspect-ratio: 4 / 3;
		border-radius: var(--widget-radius);
	}

	.art img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* The name opens the place's profile; its hit area stretches over the whole card. */
	.name {
		padding: 0;
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.2;
		text-align: left;
		color: var(--sumi);
		background: none;
		border: none;
		cursor: pointer;
	}

	.name.lead {
		font-size: 1.4rem;
		font-weight: 700;
	}

	.name::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}

	.name:focus-visible {
		outline: none;
	}

	.place-card:has(.name:focus-visible) {
		outline: 2px solid var(--tone);
		outline-offset: 3px;
	}

	.modern {
		font-family: 'Noto Sans KR', var(--ui);
		font-size: 0.74rem;
		font-weight: 500;
		color: var(--sumi-dim);
	}

	.caption {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0.45rem 0 0;
		color: var(--sumi);
	}

	.caption.sub {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin-top: 0.1rem;
		color: var(--sumi-dim);
	}

	/* Person links inside the caption stay clickable above the stretched name. */
	.caption :global(.person) {
		position: relative;
		z-index: 2;
	}

	/* ————— Place types ————— */

	/* Fortress: dressed grey stone in courses, a crenellated parapet along the top. */
	.t-fortress {
		--hanji: #d9d7d1;
		--hanji-edge: #9d9a92;
		background:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='28'%3E%3Cpath d='M0 .5H72M0 14.5H72M.5 0V14M36.5 14V28' stroke='%233c3a34' stroke-opacity='.11' fill='none'/%3E%3C/svg%3E")
				0 0 / 72px 28px,
			linear-gradient(170deg, #dedcd6, #c4c1b9);
		--stripe: inset 5px 0 0 color-mix(in srgb, var(--tone) 75%, #4a4740);
	}

	:global(html:not([data-theme='light'])) .t-fortress {
		--hanji: #24241f;
		--hanji-edge: #44433c;
		background:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='28'%3E%3Cpath d='M0 .5H72M0 14.5H72M.5 0V14M36.5 14V28' stroke='%23e8e4da' stroke-opacity='.07' fill='none'/%3E%3C/svg%3E")
				0 0 / 72px 28px,
			linear-gradient(170deg, #2a2a26, #1d1d1a);
	}

	.t-fortress .scenery {
		background:
			repeating-linear-gradient(90deg, #8e8a82 0 1rem, transparent 1rem 1.6rem) top / 100% 0.45rem no-repeat,
			linear-gradient(#8e8a82, #8e8a82) 0 0.45rem / 100% 2px no-repeat;
	}

	.t-fortress > .plate-tab {
		background: #4a4740;
	}

	/* Capital: a gilt double frame and the eaves of the royal city along the foot. */
	.t-capital {
		box-shadow:
			var(--stripe),
			inset 0 0 0 3px var(--hanji),
			inset 0 0 0 4.5px #c9a24a,
			inset 0 0 0 6.5px var(--hanji),
			inset 0 0 0 7.5px color-mix(in srgb, #c9a24a 55%, transparent);
	}

	.t-capital .scenery {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 40' preserveAspectRatio='none'%3E%3Cpath d='M0 40V30Q60 30 90 18Q130 14 170 18Q200 30 230 30Q260 30 290 16Q330 10 360 16Q385 28 400 28V40Z' fill='%2315120e' fill-opacity='.1'/%3E%3C/svg%3E")
			bottom / 100% 2.6rem no-repeat;
	}

	:global(html:not([data-theme='light'])) .t-capital .scenery {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 40' preserveAspectRatio='none'%3E%3Cpath d='M0 40V30Q60 30 90 18Q130 14 170 18Q200 30 230 30Q260 30 290 16Q330 10 360 16Q385 28 400 28V40Z' fill='%23eee6d6' fill-opacity='.07'/%3E%3C/svg%3E")
			bottom / 100% 2.6rem no-repeat;
	}

	.t-capital > .plate-tab {
		background: #8a6418;
		color: #fff6dc;
	}

	/* Palace: vermilion pillars at the edges, a sweeping giwa eave overhead. */
	.t-palace .scenery {
		background:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 30' preserveAspectRatio='none'%3E%3Cpath d='M0 26Q100 6 200 4Q300 6 400 26V18Q300 0 200 0Q100 0 0 18Z' fill='%23252220' fill-opacity='.55'/%3E%3C/svg%3E")
				top / 100% 1.6rem no-repeat,
			linear-gradient(90deg, transparent 0 0.6rem, #b3261e 0.6rem 1.05rem, transparent 1.05rem) left / 100% 100% no-repeat,
			linear-gradient(270deg, transparent 0 0.6rem, #b3261e 0.6rem 1.05rem, transparent 1.05rem) right / 100% 100% no-repeat;
		opacity: 0.85;
	}

	.t-palace {
		padding-left: 1.8rem;
		padding-right: 1.8rem;
	}

	/* Monument: a speckled granite slab. */
	.t-monument {
		--hanji: #e2e0db;
		background:
			radial-gradient(circle at 20% 30%, rgb(0 0 0 / 0.08) 0 1px, transparent 1.5px) 0 0 / 9px 9px,
			radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.4) 0 1px, transparent 1.5px) 0 0 / 13px 13px,
			linear-gradient(175deg, #e6e4df, #cfccc5);
	}

	:global(html:not([data-theme='light'])) .t-monument {
		--hanji: #22221f;
		background:
			radial-gradient(circle at 20% 30%, rgb(0 0 0 / 0.3) 0 1px, transparent 1.5px) 0 0 / 9px 9px,
			radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.06) 0 1px, transparent 1.5px) 0 0 / 13px 13px,
			linear-gradient(175deg, #282825, #1c1c1a);
	}

	/* River and sea: a blue wash rising from the foot, the swell drawn over it. */
	.t-river,
	.t-sea {
		--wave: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='14' viewBox='0 0 80 14'%3E%3Cpath d='M0 7Q10 0 20 7T40 7T60 7T80 7' fill='none' stroke='%232f5f8a' stroke-opacity='.4' stroke-width='1.4'/%3E%3C/svg%3E");
	}

	.t-river {
		background:
			linear-gradient(to top, rgb(70 120 170 / 0.22), transparent 55%),
			linear-gradient(170deg, #eef0ea, #dde6e8);
	}

	.t-sea {
		background:
			linear-gradient(to top, rgb(30 90 120 / 0.3), transparent 65%),
			linear-gradient(170deg, #e8eee9, #d2e0e2);
	}

	:global(html:not([data-theme='light'])) .t-river,
	:global(html:not([data-theme='light'])) .t-sea {
		--hanji: #151c22;
		--wave: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='14' viewBox='0 0 80 14'%3E%3Cpath d='M0 7Q10 0 20 7T40 7T60 7T80 7' fill='none' stroke='%2393bfe6' stroke-opacity='.35' stroke-width='1.4'/%3E%3C/svg%3E");
		background:
			linear-gradient(to top, rgb(60 120 180 / 0.22), transparent 60%),
			linear-gradient(170deg, #182028, #11171d);
	}

	.t-river .scenery,
	.t-sea .scenery {
		background:
			var(--wave) 0 calc(100% - 0.4rem) / 80px 14px repeat-x,
			var(--wave) 40px calc(100% - 1.3rem) / 80px 14px repeat-x;
		opacity: 0.85;
	}

	.t-sea .scenery {
		background:
			var(--wave) 0 calc(100% - 0.4rem) / 64px 12px repeat-x,
			var(--wave) 32px calc(100% - 1.2rem) / 64px 12px repeat-x,
			var(--wave) 0 calc(100% - 2rem) / 64px 12px repeat-x;
	}

	/* The swell and the ridges get their own strip below the caption. */
	.t-river,
	.t-sea,
	.t-mountain {
		padding-bottom: 2.6rem;
	}

	.t-river > .plate-tab,
	.t-sea > .plate-tab {
		background: #24506f;
	}

	/* Mountain and field: ink ridges laid in two washes along the foot. */
	.t-mountain .scenery {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60' preserveAspectRatio='none'%3E%3Cpath d='M0 60V38L40 22L70 34L110 8L150 30L190 18L230 36L270 12L320 32L360 24L400 40V60Z' fill='%2315120e' fill-opacity='.06'/%3E%3Cpath d='M0 60V48L60 36L120 46L180 30L250 44L310 34L400 50V60Z' fill='%2315120e' fill-opacity='.09'/%3E%3C/svg%3E")
			bottom / 100% 2.6rem no-repeat;
	}

	:global(html:not([data-theme='light'])) .t-mountain .scenery {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60' preserveAspectRatio='none'%3E%3Cpath d='M0 60V38L40 22L70 34L110 8L150 30L190 18L230 36L270 12L320 32L360 24L400 40V60Z' fill='%23eee6d6' fill-opacity='.05'/%3E%3Cpath d='M0 60V48L60 36L120 46L180 30L250 44L310 34L400 50V60Z' fill='%23eee6d6' fill-opacity='.08'/%3E%3C/svg%3E")
			bottom / 100% 2.6rem no-repeat;
	}

	.t-mountain > .plate-tab {
		background: #3d4a32;
	}

	/* Cavern and shrine: lamplight at the centre, umber closing in at the edges. */
	.t-cave {
		background:
			radial-gradient(90% 85% at 40% 45%, transparent 45%, rgb(70 44 20 / 0.32) 100%),
			linear-gradient(170deg, #efe4cf, #dccaa8);
	}

	:global(html:not([data-theme='light'])) .t-cave {
		--hanji: #231a10;
		background:
			radial-gradient(70% 65% at 40% 45%, rgb(232 150 70 / 0.12), transparent 70%),
			radial-gradient(90% 85% at 40% 45%, transparent 45%, rgb(0 0 0 / 0.45) 100%),
			linear-gradient(170deg, #271d12, #1a130b);
	}

	.t-cave > .plate-tab {
		background: #4a2f16;
	}

	/* The other world: indigo night, a scatter of stars, pale ink. */
	.t-otherworld {
		--sumi: #efe8d8;
		--sumi-dim: #b9b4c8;
		--hanji: #141a36;
		--hanji-edge: #2c3566;
		background:
			radial-gradient(70% 60% at 80% 0%, rgb(120 130 200 / 0.25), transparent 70%),
			linear-gradient(170deg, #1a2148, #0c1024);
		--ink: color-mix(in srgb, var(--tone) 35%, var(--sumi));
		--stripe: inset 5px 0 0 #c9a24a;
	}

	.t-otherworld .scenery {
		background:
			radial-gradient(circle, rgb(255 250 230 / 0.8) 0 1px, transparent 1.6px) 0 0 / 37px 41px,
			radial-gradient(circle, rgb(255 250 230 / 0.5) 0 0.8px, transparent 1.3px) 11px 17px / 23px 29px;
		-webkit-mask-image: linear-gradient(to bottom, #000, transparent 85%);
		mask-image: linear-gradient(to bottom, #000, transparent 85%);
	}

	.t-otherworld > .plate-tab {
		background: #c9a24a;
		color: #141a36;
	}

	.dark .kind {
		color: color-mix(in srgb, var(--tone) 35%, #e8dcc0);
	}

	.dark .art {
		border-color: #2c3566;
	}

	/* ————— Foreign ground: Tang vermilion and black, Yamato washi under the sun ————— */
	.culture-tang {
		--stripe: inset 0 5px 0 #b3261e;
		border: 1px solid #15120e;
	}

	.culture-tang.t-city,
	.culture-tang.t-capital {
		background:
			repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 2px, transparent 2px 5px),
			linear-gradient(160deg, #f6ecd9, #e9d6b4);
	}

	:global(html:not([data-theme='light'])) .culture-tang.t-city,
	:global(html:not([data-theme='light'])) .culture-tang.t-capital {
		--hanji: #22180f;
		background:
			repeating-linear-gradient(90deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 5px),
			linear-gradient(160deg, #271b12, #1a120c);
	}

	.culture-tang > .plate-tab {
		background: #b3261e;
		color: #fff4e0;
		box-shadow: 0 0 0 1.5px #15120e;
	}

	.culture-yamato {
		--stripe: inset 5px 0 0 #1f2a44;
	}

	:global(html:not([data-theme='light'])) .culture-yamato {
		--stripe: inset 5px 0 0 #4a5d8c;
	}

	.culture-yamato.t-city,
	.culture-yamato.t-capital,
	.culture-yamato.t-palace {
		background:
			radial-gradient(circle at 92% 78%, rgb(188 0 45 / 0.11) 0 2.3rem, transparent 2.35rem),
			linear-gradient(175deg, #fbf9f4, #efe9dc);
	}

	:global(html:not([data-theme='light'])) .culture-yamato.t-city,
	:global(html:not([data-theme='light'])) .culture-yamato.t-capital,
	:global(html:not([data-theme='light'])) .culture-yamato.t-palace {
		--hanji: #1a1b20;
		background:
			radial-gradient(circle at 92% 78%, rgb(220 40 70 / 0.2) 0 2.3rem, transparent 2.35rem),
			linear-gradient(175deg, #1d1e24, #15161a);
	}

	.culture-yamato > .plate-tab {
		background: #1f2a44;
		color: #f4f1ea;
	}

	@keyframes syl-in {
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}

	@media (max-width: 560px) {
		.place-card.has-art {
			grid-template-columns: minmax(0, 1fr);
		}

		.art {
			grid-row: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.syl,
		.meta > * {
			animation: none;
			transition: none;
		}

		.syl {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
</style>
