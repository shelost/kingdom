<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { byId, avatarOf, titleOf, colorOf, isMonarch, stageById, resolveStage } from '$lib/people';
	import { dialogueUi } from '$lib/dialogueUi.svelte';
	import {
		fullName,
		sameName,
		hanjaFor,
		isHanja,
		isEmperor,
		realmInk,
		promotionSeal,
		personName,
		rankGlyph,
		NAME_GAP
	} from '$lib/names';
	import { beingOf, cultureOf, nationFlag, toneOf } from '$lib/cardTheme';
	import { onceInView, prefersReducedMotion } from '$lib/inView';
	import { storyImg } from '$lib/img';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import BrushGlyphs from './BrushGlyphs.svelte';
	import CornerMark from './CornerMark.svelte';
	import Material from './Material.svelte';
	import LinkedInPost from './LinkedInPost.svelte';

	type Card = Extract<Block, { kind: 'card' }>;

	let { block, year = null }: { block: Card; year?: number | null } = $props();

	/** A coronation: the old self settles, the realm's light runs the arrow, the new self rises, the seal lands. */
	const STEPS = ['idle', 'before', 'sweep', 'rise', 'stamp', 'done'] as const;
	const BEAT_MS = [0, 0, 750, 1700, 2650, 3200];

	let person = $derived(byId.get(block.person));
	let src = $derived(person ? avatarOf(person, undefined, year, block.look) : null);
	let still = $derived(staticAsset(block.still));
	let fromSrc = $derived(person && block.from ? avatarOf(person, undefined, year, block.from) : null);
	let full = $derived(person ? fullName(person, year, block.look) : null);
	let role = $derived(block.role ?? (person ? titleOf(person, year, block.look) : undefined));
	let emperor = $derived(!!person && isEmperor(person, year, block.look));
	let monarch = $derived(!!person && isMonarch(person, year, block.look));
	/** Gods, the dead's officers and demigods wear their own palette; mortals their realm's. */
	let being = $derived(person ? beingOf(person, year) : 'mortal');
	let realm = $derived(person ? toneOf(person, year) : '#8a8a94');
	let culture = $derived(person ? cultureOf(person.kingdom) : 'samhan');
	/** The corner: the realm's flag and one character for where they stand this year. */
	let flag = $derived(person ? nationFlag(person.kingdom, reading.lang) : undefined);
	let mark = $derived(person ? rankGlyph(person, year, block.look) : undefined);
	let markLabel = $derived(mark && (reading.lang === 'en' ? mark.en : mark.ko));
	let caption = $derived(reading.lang === 'ko' ? (block.ko ?? block.caption) : block.caption);
	let captionSub = $derived(reading.lang === 'both' && block.ko && block.caption ? block.ko : undefined);

	/** A year the earlier look was worn, so a later reign doesn't leak into it. */
	let fromYear = $derived.by(() => {
		if (!person || !block.from) return null;
		const stage = stageById(person, block.from);
		return stage?.from ?? (stage?.until != null ? stage.until - 1 : year == null ? null : year - 1);
	});
	let before = $derived(person && block.from ? fullName(person, fromYear, block.from) : null);
	let fromMonarch = $derived(!!person && !!block.from && isMonarch(person, fromYear, block.from));
	/** A new face, a new name or a new title: a promotion plays the same way as a crown. */
	let evolves = $derived(
		!!person &&
			!!fromSrc &&
			(fromSrc !== src ||
				before?.korean !== full?.korean ||
				titleOf(person, fromYear, block.from) !== titleOf(person, year, block.look))
	);

	/**
	 * What the plate writes. Korean leads; the hanja is a footnote above it, unless
	 * the block writes a hanja title of its own (大莫離支, 皇帝) or the sitter is an
	 * emperor, when the hanja is the hero and `sub` is its reading.
	 */
	let plate = $derived.by(() => {
		const empty = { han: undefined as string | undefined, ko: undefined as string | undefined, hanjaFirst: false, subUsed: false };
		if (!person || !full) return empty;
		const w = block.write?.trim();
		if (isHanja(w)) {
			const stage = person.stages?.find((s) => sameName(w, s.hanja));
			const named = sameName(w, person.hanja) || !!stage || sameName(w, full.hanja);
			if (named) {
				const ko = sameName(w, person.hanja) ? person.korean : (stage?.korean ?? full.korean);
				const n = personName(person, w, ko);
				return { han: n.hanja, ko: n.korean, hanjaFirst: emperor, subUsed: false };
			}
			const ko = block.sub && sameName(block.sub, person.korean) ? personName(person, person.hanja, block.sub).korean : block.sub;
			return { han: w, ko: ko ?? full.korean, hanjaFirst: true, subUsed: !!block.sub };
		}
		if (w) return { han: hanjaFor(w, full.hanja), ko: w, hanjaFirst: emperor, subUsed: false };
		return { han: full.hanja, ko: full.korean, hanjaFirst: emperor, subUsed: false };
	});
	let heroHan = $derived(plate.hanjaFirst && !!plate.han);
	let sub = $derived(plate.subUsed ? undefined : block.sub);
	/** The other name they answer to: the birth name under a reign name, or the reign name under a birth name. */
	let alias = $derived.by(() => {
		if (!full || !plate.ko) return undefined;
		if (sameName(plate.ko, full.korean) && full.birth?.korean) return full.birth;
		if (full.birth && sameName(plate.ko, full.birth.korean) && !sameName(full.korean, plate.ko))
			return { korean: full.korean, hanja: full.hanja };
		return undefined;
	});
	let seal = $derived(
		evolves && person && full ? promotionSeal(person, { year, hanja: full.hanja, korean: full.korean }, fromYear) : undefined
	);
	let sealLatin = $derived(evolves && !seal && role ? role.split(/\s*(?:\(|,| of )/)[0] : undefined);
	/** Characters in the emperor's line, spaces counted short: sets the glyph size that fills the plate. */
	let heroCount = $derived(
		Array.from(plate.han ?? '').reduce((n, g) => n + (g.trim() ? 1 : 0.35), 0) || 1
	);

	const TABS: Record<string, { en: string; ko: string }> = {
		intro: { en: 'Character', ko: '인물' },
		profile: { en: 'Profile', ko: '약력' },
		coronation: { en: 'Coronation', ko: '즉위' },
		promotion: { en: 'Promotion', ko: '승진' },
		emperor: { en: 'Emperor', ko: '황제' }
	};
	/** The black plate is for a sitting emperor; becoming one still plays as a coronation. */
	let throne = $derived(emperor && !evolves);
	let tab = $derived.by(() => {
		if (throne) return 'emperor';
		if (evolves) return block.tab === 'coronation' || (monarch && !fromMonarch) ? 'coronation' : 'promotion';
		return block.tab ?? (block.role ? 'profile' : 'intro');
	});

	/** Hybrid reads the room: a promotion or a crown is announced on LinkedIn. */
	let social = $derived(dialogueUi.style === 'hybrid' && evolves);
	let previous = $derived.by(() => {
		if (!person || !block.from) return undefined;
		const was = titleOf(person, fromYear, block.from);
		return was && was !== role ? was : undefined;
	});

	/** A title without the name it repeats: "King Euija, 31st Eraha of Baekje" under "King Euija" reads "31st Eraha of Baekje". */
	const bareTitle = (title: string | undefined, name: string | undefined) =>
		title && name && title.startsWith(`${name}, `) ? title.slice(name.length + 2) : title;

	/** What stands under each face in a promotion: the name then, and what it was called. */
	let stages = $derived.by(() => {
		if (!person || !evolves) return undefined;
		const ko = reading.lang === 'ko';
		const was = ko
			? stageById(person, block.from)?.titleKo
			: bareTitle(titleOf(person, fromYear, block.from), before?.english);
		const now = ko
			? (resolveStage(person, year, block.look)?.titleKo ?? block.sub)
			: bareTitle(role, full?.english);
		/** The realm is said once, on the new title. */
		const realmTail = now?.match(/ of [^,]+$/)?.[0];
		return {
			before: { name: ko ? before?.korean : before?.english, title: realmTail && was?.endsWith(realmTail) ? was.slice(0, -realmTail.length) : was },
			after: { name: ko ? full?.korean : full?.english, title: now }
		};
	});

	let step = $state(0);
	let hanDone = $state(false);
	let done = $derived(step >= STEPS.length - 1);

	const begin = onceInView(() => {
		if (!evolves || prefersReducedMotion()) {
			step = STEPS.length - 1;
			return;
		}
		step = 1;
		const timers = BEAT_MS.slice(2).map((ms, i) => setTimeout(() => (step = i + 2), ms));
		return () => timers.forEach(clearTimeout);
	});

	const glyphsOf = (s: string | undefined) => Array.from(s ?? '');
</script>

<!-- The Korean name, syllable by syllable, so it can rise in after the brush. -->
{#snippet koName(text: string | undefined, cls: string)}
	{#if text}
		<span class={cls} lang="ko" aria-label={text}>
			{#each glyphsOf(text) as g, i (i)}
				{#if g === NAME_GAP || !g.trim()}<span class="gap" aria-hidden="true"></span>{:else}<span class="syl" style:--i={i} aria-hidden="true">{g}</span>{/if}
			{/each}
		</span>
	{/if}
{/snippet}

<!-- Under a face in a promotion: the name, then the title it held. -->
{#snippet standing(at: { name?: string; title?: string } | undefined)}
	<span class="standing" lang={reading.lang === 'ko' ? 'ko' : undefined}>
		{#if at?.name}<span class="st-name">{at.name}</span>{/if}
		{#if at?.title}<span class="st-title">{at.title}</span>{/if}
	</span>
{/snippet}

<!-- The intro still: the moment they walk in, across the head of the plate. -->
{#snippet intro(art: string)}
	<div class="still">
		<img {...storyImg(art, { kind: 'cue', alt: full?.english ?? '', sizes: '(max-width: 820px) 100vw, 40rem' })} />
	</div>
{/snippet}

<!-- The English name, the role, and the name they also answer to. -->
{#snippet meta(cls: string)}
	<div class="meta {cls}">
		{#if full}<span class="en-name">{full.english}</span>{/if}
		{#if role && reading.lang !== 'ko'}<span class="role">{role}</span>{/if}
		{#if alias?.korean}
			<span class="alias">
				<span lang="ko">{alias.korean}</span>{#if alias.hanja}<span class="alias-han" lang="zh-Hant">{alias.hanja}</span>{/if}
			</span>
		{/if}
		{#if caption}<span class="caption">{caption}</span>{/if}
		{#if captionSub && captionSub !== caption}<span class="caption sub" lang="ko">{captionSub}</span>{/if}
	</div>
{/snippet}

{#if person && full && social}
	<LinkedInPost
		{person}
		name={full.english}
		nameKo={full.korean}
		headline={role}
		headlineKo={resolveStage(person, year, block.look)?.titleKo}
		{previous}
		art={src}
		square={monarch}
		crowned={tab === 'coronation'}
		caption={block.caption}
		captionKo={block.ko}
	/>
{:else if person && throne}
	<figure
		class="person-card ink-plate emperor"
		class:live={done}
		class:seen={step >= 1}
		class:inked={done && (hanDone || !plate.han)}
		class:has-face={!!src}
		{@attach begin}
	>
		<Material kind="rubbing" />
		<span class="plate-tab">{reading.lang === 'en' ? TABS[tab].en : `${TABS[tab].ko} · ${TABS[tab].en}`}</span>
		<CornerMark {flag} glyph={mark?.glyph} label={markLabel} color="#b3261e" shown={done} />
		{#if still}
			{@render intro(still)}
		{:else if src}
			<div class="em-face is-monarch" aria-hidden="true">
				<img src={src} alt="" loading="lazy" decoding="async" />
			</div>
		{/if}
		<span class="em-vignette" aria-hidden="true"></span>
		<div class="em-words">
			{#if plate.han}
				<span class="em-han" style:--n={heroCount}>
					<BrushGlyphs
						text={plate.han}
						size="min(calc((100cqi - 2.6rem) / (var(--n) * 1.02)), 11rem)"
						speed={0.42}
						play={done}
						ondone={() => (hanDone = true)}
					/>
				</span>
				<span class="em-rule" aria-hidden="true"></span>
			{/if}
			{@render koName(plate.ko, 'em-ko')}
			{@render meta('em-meta')}
		</div>
	</figure>
{:else if person}
	<figure
		class="person-card ink-plate being-{being} culture-{culture}"
		class:evolves
		class:live={done}
		class:seen={step >= 1}
		class:hero-han={heroHan}
		class:has-mark={!!(flag || mark)}
		class:has-still={!!still}
		style:--tone={being === 'mortal' ? colorOf(person) : realm}
		style:--realm={realm}
		style:--seal={realmInk(realm, 0.58)}
		{@attach begin}
	>
		<Material kind={culture === 'tang' ? 'silk' : culture === 'yamato' ? 'cloth' : 'paper'} />
		<span class="plate-tab">{reading.lang === 'en' ? TABS[tab].en : `${TABS[tab].ko} · ${TABS[tab].en}`}</span>
		<CornerMark {flag} glyph={mark?.glyph} label={markLabel} color={realmInk(realm, 0.62)} shown={done} />
		{#if still}{@render intro(still)}{/if}
		{#if evolves && fromSrc}
			<div
				class="evolution"
				class:at-before={step >= 1}
				class:at-sweep={step >= 2}
				class:at-rise={step >= 3}
				class:at-stamp={step >= 4}
			>
				<div class="stage before">
					<div class="portrait" class:is-monarch={fromMonarch}>
						<span class="disk"></span>
						<img class="face" src={fromSrc} alt="" loading="lazy" decoding="async" />
					</div>
					{@render standing(stages?.before)}
				</div>
				<div class="track">
					<span class="beam"></span>
					<svg class="arrow" viewBox="0 0 48 24">
						<path d="M2 12h40M33 4l9 8l-9 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					<span class="spark"></span>
				</div>
				<div class="stage after">
					<div class="portrait" class:is-monarch={monarch}>
						<span class="halo"></span>
						<span class="disk"></span>
						<span class="shine"></span>
						{#if src}<img class="face" src={src} alt="" loading="lazy" decoding="async" />{/if}
						{#if seal || sealLatin}
							<span class="seal" class:latin={!seal} lang={seal ? 'zh-Hant' : undefined}>{seal ?? sealLatin}</span>
						{/if}
					</div>
					{@render standing(stages?.after)}
				</div>
			</div>
		{:else}
			<div class="portrait" class:is-monarch={monarch} aria-hidden="true">
				<span class="disk"></span>
				{#if src}<img class="face solo" src={src} alt="" loading="lazy" decoding="async" />{/if}
			</div>
		{/if}
		{#if !evolves}
		<div class="words">
			<div class="title">
				{#if heroHan && plate.han}
					<span class="han-hero">
						<BrushGlyphs text={plate.han} size="clamp(1.9rem, 6.5vw, 2.6rem)" play={done} ondone={() => (hanDone = true)} />
					</span>
					{@render koName(plate.ko, 'ko-under')}
				{:else}
					{#if plate.han}
						<span class="han-over">
							<BrushGlyphs text={plate.han} size="clamp(0.9rem, 2.4vw, 1.1rem)" play={done} ondone={() => (hanDone = true)} />
						</span>
					{/if}
					{@render koName(plate.ko, 'ko-hero')}
				{/if}
			</div>
			{#if sub}<span class="sub-line" lang="ko">{sub}</span>{/if}
			{@render meta('')}
		</div>
		{/if}
	</figure>
{/if}

<style>
	.person-card {
		/* The hanja's ink: the realm's colour worked into the theme's sumi. */
		--ink: color-mix(in srgb, var(--realm) 40%, var(--sumi));
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(4.25rem, 18%) 1fr;
		align-items: center;
		gap: 0.9rem;
		padding-top: 1.25rem;
		letter-spacing: var(--name-track);
	}

	/* The paper grain stays, a shade lighter than the shared plate. */
	.person-card:not(.emperor) > :global(.material) {
		opacity: 0.7;
	}

	/* The hero name keeps clear of the flag and seal in the corner, unless they are stamped on the still. */
	.has-mark .title {
		padding-right: 4.4rem;
	}

	.has-still .title {
		padding-right: 0;
	}

	/* ————— The intro still: full-bleed across the head of the plate, surfacing once in view ————— */
	.still {
		grid-column: 1 / -1;
		margin: -1.25rem -1.2rem 0.35rem;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: calc(var(--widget-radius) - 1px) calc(var(--widget-radius) - 1px) 0 0;
		background: #0b0a09;
	}

	.emperor .still {
		margin: -2rem -1.3rem 0.6rem;
	}

	.still img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transform: scale(1.05);
		transition:
			opacity 900ms var(--ease),
			transform 2400ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.seen .still img {
		opacity: 1;
		transform: none;
	}

	.title {
		display: grid;
		justify-items: start;
		gap: 0.3rem;
		min-width: 0;
		max-width: 100%;
	}

	/* ————— Kinds of being: gods, the dead's officers, demigods, beasts ————— */
	.being-god {
		--hanji: #f8efd6;
		background:
			radial-gradient(70% 60% at 20% 0%, rgb(255 246 214 / 0.95), transparent 70%),
			radial-gradient(50% 50% at 100% 100%, rgb(184 137 44 / 0.16), transparent 70%),
			linear-gradient(165deg, #f7ecd0, #ecdcb2);
		border-color: rgb(184 137 44 / 0.55);
		box-shadow:
			inset 0 0 0 5px var(--hanji),
			inset 0 0 0 6px rgb(184 137 44 / 0.45);
	}

	.being-underworld {
		--hanji: #dcdad6;
		background:
			radial-gradient(80% 70% at 50% 120%, rgb(43 47 74 / 0.22), transparent 70%),
			linear-gradient(170deg, #e2e0dc, #c9c6c2);
		border-color: rgb(43 47 74 / 0.45);
	}

	.being-demigod {
		--hanji: #eef1ec;
		background:
			linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.55) 46%, transparent 62%),
			radial-gradient(60% 60% at 85% 10%, rgb(79 143 156 / 0.22), transparent 70%),
			linear-gradient(170deg, #f1f2ec, #dfe6e0);
		border-color: rgb(79 143 156 / 0.5);
	}

	.being-beast {
		background:
			radial-gradient(70% 60% at 50% 110%, rgb(110 127 62 / 0.2), transparent 70%),
			linear-gradient(170deg, #f0ecd8, #e1dcc0);
	}

	/* Night versions of the same grounds: the colour moves into the light, the paper goes dark. */
	:global(html:not([data-theme='light'])) .being-god {
		--hanji: #241e12;
		background:
			radial-gradient(70% 60% at 20% 0%, rgb(201 162 74 / 0.2), transparent 70%),
			radial-gradient(50% 50% at 100% 100%, rgb(201 162 74 / 0.1), transparent 70%),
			linear-gradient(165deg, #2a2316, #1b160d);
		border-color: rgb(201 162 74 / 0.5);
		box-shadow:
			inset 0 0 0 5px var(--hanji),
			inset 0 0 0 6px rgb(201 162 74 / 0.4);
	}

	:global(html:not([data-theme='light'])) .being-underworld {
		--hanji: #17181f;
		background:
			radial-gradient(80% 70% at 50% 120%, rgb(110 118 170 / 0.18), transparent 70%),
			linear-gradient(170deg, #1d1e26, #131419);
		border-color: rgb(110 118 170 / 0.4);
	}

	:global(html:not([data-theme='light'])) .being-demigod {
		--hanji: #161f1e;
		background:
			linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.04) 46%, transparent 62%),
			radial-gradient(60% 60% at 85% 10%, rgb(79 143 156 / 0.22), transparent 70%),
			linear-gradient(170deg, #182221, #121918);
		border-color: rgb(79 143 156 / 0.5);
	}

	:global(html:not([data-theme='light'])) .being-beast {
		background:
			radial-gradient(70% 60% at 50% 110%, rgb(140 160 80 / 0.16), transparent 70%),
			linear-gradient(170deg, #1f2017, #17180f);
	}

	.being-god > .plate-tab {
		background: #8a6418;
		color: #fff6dc;
	}

	.being-underworld > .plate-tab {
		background: #2b2f4a;
		color: #e8e6f0;
	}

	.being-demigod > .plate-tab {
		background: #2f6a75;
		color: #effafa;
	}

	/* ————— Foreign courts: Tang silk and vermilion, Yamato washi and the sun ————— */
	.culture-tang {
		--hanji: #f6ecd9;
		background:
			linear-gradient(180deg, #b3261e 0 5px, #15120e 5px 6.5px, transparent 6.5px),
			repeating-linear-gradient(90deg, rgb(255 255 255 / 0.06) 0 2px, transparent 2px 5px),
			linear-gradient(160deg, #f6ecd9, #e9d6b4);
		border: 1px solid #15120e;
		box-shadow:
			inset 0 0 0 4px var(--hanji),
			inset 0 0 0 5px rgb(179 38 30 / 0.5);
	}

	:global(html:not([data-theme='light'])) .culture-tang {
		--hanji: #22180f;
		background:
			linear-gradient(180deg, #b3261e 0 5px, #0c0a08 5px 6.5px, transparent 6.5px),
			repeating-linear-gradient(90deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 5px),
			linear-gradient(160deg, #271b12, #1a120c);
		border-color: #4a1a14;
	}

	.culture-tang > .plate-tab {
		background: #b3261e;
		color: #fff4e0;
		box-shadow: 0 0 0 1.5px #15120e;
	}

	.culture-yamato {
		--hanji: #f8f5ee;
		background:
			radial-gradient(circle at 92% 78%, rgb(188 0 45 / 0.11) 0 2.3rem, transparent 2.35rem),
			linear-gradient(180deg, transparent 0 calc(100% - 4px), #1f2a44 calc(100% - 4px)),
			linear-gradient(175deg, #fbf9f4, #efe9dc);
		border-color: rgb(31 42 68 / 0.35);
		box-shadow: inset 5px 0 0 #1f2a44;
	}

	:global(html:not([data-theme='light'])) .culture-yamato {
		--hanji: #1a1b20;
		background:
			radial-gradient(circle at 92% 78%, rgb(220 40 70 / 0.2) 0 2.3rem, transparent 2.35rem),
			linear-gradient(180deg, transparent 0 calc(100% - 4px), #4a5d8c calc(100% - 4px)),
			linear-gradient(175deg, #1d1e24, #15161a);
		box-shadow: inset 5px 0 0 #4a5d8c;
	}

	.culture-yamato > .plate-tab {
		background: #1f2a44;
		color: #f4f1ea;
	}

	/* A coronation reads top to bottom: before → after, then the name. */
	.person-card.evolves {
		grid-template-columns: minmax(0, 1fr);
	}

	.portrait {
		position: relative;
		aspect-ratio: 2 / 3;
		isolation: isolate;
	}

	/* A faint wash of the character's colour on the paper behind the cut-out; monarchs stand on the softened square. */
	.disk {
		position: absolute;
		left: 8%;
		right: 8%;
		bottom: 6%;
		aspect-ratio: 1;
		border-radius: var(--avatar-radius, 50%);
		background: radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--tone) 22%, transparent), transparent 72%);
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--tone) 38%, transparent);
		z-index: -1;
	}

	.face {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: bottom center;
		-webkit-mask-image: linear-gradient(to bottom, #000 82%, transparent 99%);
		mask-image: linear-gradient(to bottom, #000 82%, transparent 99%);
	}

	.solo {
		opacity: 0;
		transform: translateY(6%);
		transition:
			opacity 700ms var(--ease),
			transform 700ms var(--ease);
	}

	.live .solo {
		opacity: 1;
		transform: none;
	}

	/* ————— The name plate ————— */
	.words {
		display: grid;
		justify-items: start;
		gap: 0.3rem;
		min-width: 0;
	}

	/* The hanja above the Korean: a brushed footnote in realm-tinted ink. */
	.han-over {
		--sumi: var(--ink);
		line-height: 1;
		opacity: 0.88;
	}

	.ko-hero,
	.ko-under,
	.em-ko {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		font-family: var(--display-ko);
		font-weight: 400;
		line-height: 1.02;
		letter-spacing: var(--name-track);
		color: var(--sumi);
	}

	.ko-hero {
		font-size: clamp(1.9rem, 6.5vw, 2.6rem);
	}

	.ko-under {
		font-size: clamp(1.35rem, 4.4vw, 1.75rem);
		color: color-mix(in srgb, var(--realm) 30%, var(--sumi));
	}

	.gap {
		width: 0.22em;
	}

	.syl {
		display: inline-block;
		opacity: 0;
		transform: translateY(0.28em) scale(0.96);
		filter: blur(5px);
	}

	.live .syl {
		animation: syl-in 620ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 75ms + 180ms);
	}

	.han-hero {
		line-height: 1;
	}

	.sub-line {
		display: block;
		padding-top: 0.3rem;
		border-top: 1px solid color-mix(in srgb, var(--sumi) 16%, transparent);
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink);
		opacity: 0;
		transition: opacity 520ms var(--ease) 550ms;
	}

	.live .sub-line {
		opacity: 1;
	}

	/* Brushed hanja sit shoulder to shoulder, not in spaced practice squares. */
	.han-over :global(.brush-glyphs),
	.han-hero :global(.brush-glyphs),
	.em-han :global(.brush-glyphs) {
		gap: 0;
	}

	/* Each line floats up after the one above it: name, title, then the blurb. */
	.meta {
		--meta-at: 600ms;
		display: grid;
		gap: 0.1rem;
	}

	.meta > * {
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 520ms var(--ease) calc(var(--meta-at) + var(--k, 0) * 220ms),
			transform 520ms var(--ease) calc(var(--meta-at) + var(--k, 0) * 220ms);
	}

	.meta > :nth-child(2) { --k: 1; }
	.meta > :nth-child(3) { --k: 2; }
	.meta > :nth-child(4) { --k: 3; }
	.meta > :nth-child(5) { --k: 4; }

	.live .meta > * {
		opacity: 1;
		transform: none;
	}

	.en-name {
		font-family: var(--serif);
		font-size: 0.88rem;
		font-weight: 600;
		color: var(--sumi);
	}

	.role {
		font-size: 0.72rem;
		color: var(--sumi-dim);
	}

	.alias {
		display: inline-flex;
		align-items: baseline;
		gap: 0.35rem;
		font-family: 'Noto Sans KR', var(--ui);
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--sumi-dim);
	}

	.alias-han {
		font-family: 'Noto Serif KR', var(--serif);
		font-weight: 600;
		font-size: 0.72rem;
		opacity: 0.8;
	}

	/* The blurb reads in the script's own type. */
	.caption {
		margin-top: 0.4rem;
		font-family: var(--sans);
		font-size: 1em;
		font-weight: var(--weight-body);
		line-height: 1.5;
		letter-spacing: var(--tracking-body);
		color: var(--sumi);
	}

	.caption.sub {
		margin-top: 0;
		color: var(--sumi-dim);
	}

	/* ————— Coronation: before → after ————— */
	.evolution {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		grid-template-rows: auto auto;
		align-items: center;
		gap: 0.5rem 0.4rem;
		max-width: 23rem;
		width: 100%;
		margin: 0 auto;
	}

	/* Each self is a face with its name and title written underneath. */
	.stage {
		grid-row: span 2;
		display: grid;
		grid-template-rows: subgrid;
		justify-items: center;
		row-gap: 0.5rem;
	}

	.stage .portrait {
		width: 100%;
	}

	.standing {
		align-self: start;
		display: grid;
		justify-items: center;
		gap: 0.15rem;
		text-align: center;
		line-height: 1.2;
	}

	.st-name {
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--sumi);
	}

	.standing:lang(ko) .st-name {
		font-family: var(--display-ko);
		font-size: 1.15rem;
		font-weight: 400;
		letter-spacing: var(--name-track);
	}

	.st-title {
		font-size: 0.72rem;
		color: var(--sumi-dim);
	}

	/* The arrow sits between the faces and level with them, not the names under them.
	   Columns are explicit: a row-locked item is auto-placed first and would take column 1. */
	.track {
		grid-area: 1 / 2;
	}

	.stage.before {
		grid-column: 1;
	}

	.stage.after {
		grid-column: 3;
	}

	/* The earlier self settles in first, and steps back once the new one rises. */
	.before {
		opacity: 0;
		transform: translateY(8%) scale(0.96);
		transition:
			opacity 600ms var(--ease),
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			filter 800ms var(--ease);
	}

	.at-before .before {
		opacity: 1;
		transform: none;
	}

	.at-rise .before {
		opacity: 0.72;
		filter: saturate(0.55);
	}

	/* The arrow is a track the realm's light runs along. */
	.track {
		position: relative;
		display: grid;
		place-items: center;
		width: 3.4rem;
		height: 1.6rem;
	}

	.arrow {
		position: relative;
		width: 100%;
		color: color-mix(in srgb, var(--realm) 80%, var(--sumi));
		stroke-dasharray: 64;
		stroke-dashoffset: 64;
		transition: stroke-dashoffset 800ms cubic-bezier(0.65, 0, 0.35, 1);
	}

	.at-sweep .arrow {
		stroke-dashoffset: 0;
	}

	.beam {
		position: absolute;
		left: -60%;
		right: -60%;
		top: 50%;
		height: 3px;
		border-radius: 3px;
		background: linear-gradient(90deg, transparent, var(--realm) 45%, #fff8 50%, var(--realm) 55%, transparent);
		transform: translateY(-50%) scaleX(0);
		opacity: 0;
		filter: blur(0.5px);
	}

	.spark {
		position: absolute;
		left: 0;
		top: 50%;
		width: 2.2rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle, #fff 0 12%, var(--realm) 30%, transparent 68%);
		transform: translate(-60%, -50%) scale(0.4);
		opacity: 0;
	}

	.at-sweep .beam {
		animation: beam 950ms cubic-bezier(0.65, 0, 0.35, 1) both;
	}

	.at-sweep .spark {
		animation: spark 950ms cubic-bezier(0.65, 0, 0.35, 1) both;
	}

	/* The new self waits offstage until the light reaches it. */
	.after .face,
	.after .standing {
		opacity: 0;
	}

	.after .disk {
		transition: box-shadow 900ms var(--ease);
	}

	.at-sweep .after .disk {
		box-shadow:
			inset 0 0 0 2px var(--realm),
			0 0 26px 4px color-mix(in srgb, var(--realm) 40%, transparent);
	}

	.at-rise .after .face {
		animation: rise-in 1000ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	.at-rise .after .standing {
		opacity: 1;
		transition: opacity 400ms var(--ease) 300ms;
	}

	.at-rise .after .st-name {
		animation: wipe-down 700ms cubic-bezier(0.3, 0.6, 0.3, 1) 250ms both;
	}

	.halo {
		position: absolute;
		left: 50%;
		bottom: 34%;
		width: 92%;
		aspect-ratio: 1;
		border-radius: 50%;
		border: 2px solid var(--realm);
		transform: translate(-50%, 50%) scale(0.3);
		opacity: 0;
		z-index: -2;
		pointer-events: none;
	}

	.at-rise .halo {
		animation: halo 1100ms ease-out both;
	}

	/* A band of the realm's light crosses the ground behind the new self as it lands. */
	.shine {
		position: absolute;
		left: 4%;
		right: 4%;
		bottom: 6%;
		aspect-ratio: 1;
		z-index: -1;
		border-radius: var(--avatar-radius, 50%);
		background: linear-gradient(105deg, transparent 35%, color-mix(in srgb, var(--realm) 65%, #fff) 50%, transparent 65%);
		background-size: 260% 100%;
		background-position: 120% 0;
		opacity: 0;
		pointer-events: none;
	}

	.at-rise .shine {
		animation: shine 1200ms cubic-bezier(0.4, 0, 0.2, 1) 300ms both;
	}

	/* The new title, stamped in the realm's colour. */
	.seal {
		position: absolute;
		top: 4%;
		right: -6%;
		display: grid;
		place-items: center;
		min-width: 1.9rem;
		padding: 0.2rem 0.24rem;
		border-radius: 3px;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.82rem;
		font-weight: 900;
		line-height: 1;
		writing-mode: vertical-rl;
		color: #fffaf0;
		background: var(--seal);
		box-shadow:
			inset 0 0 0 1.5px rgb(255 250 240 / 0.55),
			0 4px 10px -4px rgb(0 0 0 / 0.6);
		opacity: 0;
		transform: scale(2.4) rotate(-14deg);
	}

	.seal.latin {
		writing-mode: horizontal-tb;
		font-family: var(--ui);
		font-size: 0.56rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		padding: 0.25rem 0.35rem;
		max-width: 6.5rem;
		text-align: center;
	}

	.at-stamp .seal {
		animation: stamp 460ms cubic-bezier(0.3, 1.4, 0.5, 1) both;
	}

	@keyframes syl-in {
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}

	@keyframes beam {
		0% { opacity: 0; transform: translateY(-50%) scaleX(0); transform-origin: left; }
		40% { opacity: 1; transform: translateY(-50%) scaleX(1); transform-origin: left; }
		60% { opacity: 1; transform: translateY(-50%) scaleX(1); transform-origin: right; }
		100% { opacity: 0; transform: translateY(-50%) scaleX(0); transform-origin: right; }
	}

	@keyframes spark {
		0% { left: 0; opacity: 0; transform: translate(-60%, -50%) scale(0.4); }
		20% { opacity: 1; }
		85% { opacity: 1; transform: translate(-40%, -50%) scale(1.15); }
		100% { left: 100%; opacity: 0; transform: translate(-40%, -50%) scale(1.6); }
	}

	@keyframes rise-in {
		0% { opacity: 0; transform: translateY(16%) scale(0.94); filter: brightness(2.6) saturate(0); }
		45% { opacity: 1; filter: brightness(1.7) saturate(0.4); }
		100% { opacity: 1; transform: none; filter: none; }
	}

	@keyframes wipe-down {
		from { clip-path: inset(0 0 100% 0); filter: blur(2px); }
		to { clip-path: inset(0 0 0 0); filter: none; }
	}

	@keyframes halo {
		0% { opacity: 0.9; transform: translate(-50%, 50%) scale(0.35); }
		100% { opacity: 0; transform: translate(-50%, 50%) scale(1.45); }
	}

	@keyframes shine {
		0% { opacity: 0; background-position: 120% 0; }
		20% { opacity: 0.85; }
		100% { opacity: 0; background-position: -20% 0; }
	}

	@keyframes stamp {
		0% { opacity: 0; transform: scale(2.4) rotate(-14deg); }
		60% { opacity: 1; transform: scale(0.92) rotate(-5deg); }
		100% { opacity: 1; transform: scale(1) rotate(-6deg); }
	}

	/* ————— The emperor: lacquer black in both themes, the hanja filling the plate ————— */
	.emperor {
		container-type: inline-size;
		grid-template-columns: minmax(0, 1fr);
		min-height: 22rem;
		padding: 2rem 1.3rem 1.4rem;
		color: var(--emperor-ink);
		background:
			radial-gradient(60% 50% at 18% 12%, rgb(179 38 30 / 0.16), transparent 70%),
			radial-gradient(40% 40% at 90% 100%, rgb(201 162 74 / 0.1), transparent 70%),
			var(--emperor-ground);
		border-color: color-mix(in srgb, var(--emperor-gold) 30%, #000);
		filter: none;
	}

	.emperor > .plate-tab {
		color: var(--emperor-ink);
		background: var(--emperor-vermilion);
	}

	/* The face emerges from the dark, slowly, and never fully into the light. */
	.em-face {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 56%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		border-radius: 0 var(--widget-radius) var(--widget-radius) 0;
		opacity: 0;
		transform: scale(1.08);
		transition:
			opacity 4200ms ease-out,
			transform 6000ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.em-face img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: bottom right;
		filter: brightness(0.5) contrast(1.2) saturate(0.55) drop-shadow(-6px 0 12px rgb(179 38 30 / 0.35));
		-webkit-mask-image: radial-gradient(85% 80% at 65% 45%, #000 40%, transparent 85%);
		mask-image: radial-gradient(85% 80% at 65% 45%, #000 40%, transparent 85%);
	}

	.emperor.live .em-face {
		opacity: 0.9;
		transform: none;
	}

	.em-vignette {
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		border-radius: inherit;
		background:
			radial-gradient(120% 90% at 40% 35%, transparent 35%, rgb(0 0 0 / 0.88) 100%),
			linear-gradient(to top, rgb(0 0 0 / 0.75), transparent 45%);
	}

	.em-words {
		position: relative;
		display: grid;
		justify-items: start;
		gap: 0.35rem;
		align-self: end;
		min-width: 0;
	}

	.em-han {
		--sumi: var(--emperor-ink);
		display: block;
		width: 100%;
		line-height: 1;
		filter: drop-shadow(0 0 18px rgb(179 38 30 / 0.35));
	}

	.em-rule {
		width: 100%;
		height: 1px;
		background: linear-gradient(90deg, var(--emperor-gold), color-mix(in srgb, var(--emperor-vermilion) 70%, transparent) 60%, transparent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 1600ms cubic-bezier(0.65, 0, 0.35, 1);
	}

	.emperor.inked .em-rule {
		transform: none;
	}

	.em-ko {
		font-size: clamp(1.8rem, 7vw, 2.8rem);
		color: var(--emperor-ink);
	}

	.emperor .syl {
		animation: none;
	}

	.emperor.inked .syl {
		animation: syl-in 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 140ms + 200ms);
	}

	.emperor .meta {
		--meta-at: 900ms;
	}

	.emperor:not(.inked) .meta > * {
		opacity: 0;
		transform: translateY(0.35rem);
	}

	.em-meta .en-name {
		font-size: 0.92rem;
		color: var(--emperor-gold);
	}

	.em-meta .role,
	.em-meta .alias {
		color: color-mix(in srgb, var(--emperor-ink) 60%, transparent);
	}

	.em-meta .caption {
		max-width: 34rem;
		color: color-mix(in srgb, var(--emperor-ink) 88%, transparent);
	}

	.em-meta .caption.sub {
		color: color-mix(in srgb, var(--emperor-ink) 62%, transparent);
	}

	@media (max-width: 30rem) {
		.person-card:not(.evolves):not(.emperor) {
			grid-template-columns: 4.25rem 1fr;
			gap: 0.75rem;
		}

		.st-name {
			font-size: 0.82rem;
		}

		.st-title {
			font-size: 0.66rem;
		}

		.track {
			width: 1.8rem;
		}

		.emperor {
			min-height: 18rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.still img,
		.face,
		.solo,
		.disk,
		.syl,
		.meta > *,
		.before,
		.arrow,
		.beam,
		.spark,
		.halo,
		.shine,
		.seal,
		.standing,
		.st-name,
		.em-face,
		.em-rule {
			animation: none !important;
			transition: none !important;
		}

		.still img,
		.syl,
		.after .face,
		.after .standing {
			opacity: 1;
			transform: none;
			filter: none;
		}

		.seal {
			opacity: 1;
			transform: rotate(-6deg);
		}
	}
</style>
