<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { Block, ImageSlot, Sky } from '$lib/story';
	import { linkPeople, byId } from '$lib/people';
	import { reading, isKorean, leadLang } from '$lib/reading.svelte';
	import { filterScriptNsfw } from '$lib/nsfwUi.svelte';
	import { dialogueUi, type DialogueStyle } from '$lib/dialogueUi.svelte';
	import { buildBeats } from '$lib/beats';
	import { blockScene, lineCount, type Dialogue } from '$lib/blockScene';
	import { pinsToPanel, widgetKey, widgetsPinned } from '$lib/pinnedWidgets.svelte';
	import { floatIn } from '$lib/floatIn';
	import { sceneReveal } from '$lib/sceneReveal';
	import { weatherMark } from '$lib/sceneWeather.svelte';
	import { animating } from '$lib/motionUi.svelte';
	import { chain } from '$lib/attachments/chain';
	import { blockRef } from '$lib/cueLayout.svelte';
	import Self from './Blocks.svelte';
	import DialogueBlock from './blocks/DialogueBlock.svelte';
	import ScenePlate from './blocks/ScenePlate.svelte';
	import VerseBlock from './blocks/VerseBlock.svelte';
	import AsideBlock from './blocks/AsideBlock.svelte';
	import FormationBlock from './blocks/FormationBlock.svelte';
	import TableBlock from './blocks/TableBlock.svelte';
	import DiagramBlock from './diagrams/DiagramBlock.svelte';
	import HanjaName from './HanjaName.svelte';
	import RecordQuote from './RecordQuote.svelte';
	import MapExcerpt from './MapExcerpt.svelte';
	import BattleMap from './BattleMap.svelte';
	import PersonCard from './PersonCard.svelte';
	import TermCard from './TermCard.svelte';
	import PoemCard from './PoemCard.svelte';
	import ChengyuCard from './ChengyuCard.svelte';
	import EdictScroll from './EdictScroll.svelte';
	import CovenantCard from './CovenantCard.svelte';
	import OmenTicker from './OmenTicker.svelte';
	import OathStone from './OathStone.svelte';
	import PlaceCard from './PlaceCard.svelte';
	import ImageStack from './ImageStack.svelte';
	import Replay from './Replay.svelte';
	import EmailLetter from './EmailLetter.svelte';
	import FacebookLifeEvent from './FacebookLifeEvent.svelte';
	import BreakingNews from './BreakingNews.svelte';
	import EmotionWord from './EmotionWord.svelte';

	let {
		blocks,
		year = null,
		idPrefix = '',
		sceneFrom,
		/** Cue art for a solo flashback beat — interleaved beside inner blocks in script mode. */
		flashImages,
		/** Cue art for a beat that opens on a post: drawn inside that post, as attached media. */
		media,
		/** A war episode: Hybrid breaks its first titled map as news. */
		breaking = false,
		/** The episode's own weather, under any a plate sets (`SceneWeather`). */
		weather,
		/** The reading flow itself: its lines steer the full-screen weather. Copies elsewhere (widgets, stage) do not. */
		sky = false,
		/** Draw widgets here even in wide immersion (the widgets panel itself). */
		unpinned = false,
		/** Pin the dialogue style instead of following the reader's setting (the effects gallery shows bubbles). */
		dialogueStyle
	}: {
		blocks: Block[];
		year?: number | null;
		idPrefix?: string;
		sceneFrom?: Block[];
		flashImages?: ImageSlot[];
		media?: ImageSlot[];
		breaking?: boolean;
		weather?: Sky;
		sky?: boolean;
		unpinned?: boolean;
		dialogueStyle?: DialogueStyle;
	} = $props();

	let style = $derived(dialogueStyle ?? dialogueUi.style);

	let pinned = $derived(!unpinned && widgetsPinned());

	/** Blocks drawn whatever the reading language: plates, cards, and records (which carry every tongue together). */
	const ALWAYS = new Set<Block['kind']>([
		'flashback',
		'table',
		'hanja',
		'verse',
		'formation',
		'battle',
		'diagram',
		'map',
		'card',
		'term',
		'day',
		'scene',
		'story',
		'section',
		'quote',
		'poem',
		'chengyu',
		'edict',
		'covenant',
		'omens',
		'oath',
		'place',
		'wed'
	]);

	/** Widgets that animate in, and so carry a replay control. */
	const REPLAYABLE = new Set<Block['kind']>([
		'hanja',
		'quote',
		'map',
		'card',
		'term',
		'poem',
		'chengyu',
		'edict',
		'covenant',
		'omens',
		'oath',
		'place',
		'diagram'
	]);

	function visible(b: Block) {
		if (ALWAYS.has(b.kind)) return true;
		if (reading.lang === 'both') return true;
		if (b.kind === 'dialogue')
			return reading.lang === 'en'
				? !!b.en?.length || !b.lines.some((l) => isKorean(l))
				: b.lines.some(Boolean);
		// narration + retrospective monologue: EN always; KO when translated
		if (reading.lang === 'en' || !('html' in b) || !b.html) return true;
		return ('ko' in b && !!b.ko) || isKorean(b.html);
	}

	/** The narration string to render for the current language. */
	function prose(b: { html: string; ko?: string }) {
		return reading.lang === 'ko' && b.ko ? b.ko : b.html;
	}

	let koFirst = $derived(leadLang(reading.lang) === 'ko');

	let shown = $derived(filterScriptNsfw(blocks).filter(visible));

	/** Read across the whole entry, since beats split it between stills. */
	let scene = $derived(blockScene(sceneFrom ?? blocks, { year, style, idPrefix, breaking, weather }));

	/** A letter's lines in the reader's language first, the other tongue under it. */
	function mailLines(b: Dialogue): { lead: string; sub?: string }[] {
		return Array.from({ length: lineCount(b) }, (_, j) => {
			const ko = reading.lang === 'en' ? undefined : b.lines[j];
			const en = reading.lang === 'ko' ? undefined : b.en?.[j];
			const [lead, sub] = koFirst ? [ko ?? en, ko ? en : undefined] : [en ?? ko, en ? ko : undefined];
			return { lead: lead ?? '', sub };
		}).filter((l) => l.lead);
	}

	/** The screen takes each block's scene weather (`SceneWeather`); the script arrives the way its scene plays (`$lib/sceneReveal`). */
	const mark = (b: Block): Attachment<HTMLElement> => (sky ? weatherMark(scene.moods.get(b)) : () => {});
	const arrive = (b: Block) => chain(mark(b), sceneReveal(scene.moods.get(b)?.text ?? 'calm'), blockRef(b));
</script>

<!-- Every widget that animates in, drawn inside a replay control. -->
{#snippet widget(block: Block)}
	{@const year = scene.yearAt(block)}
	{#if block.kind === 'hanja'}
		<HanjaName {block} />
	{:else if block.kind === 'quote'}
		<RecordQuote {block} {year} testimony={scene.records.testimony.get(block)} side={scene.records.side.get(block)} />
	{:else if block.kind === 'map'}
		<MapExcerpt {block} />
	{:else if block.kind === 'card'}
		<PersonCard {block} {year} />
	{:else if block.kind === 'term'}
		<TermCard {block} />
	{:else if block.kind === 'poem'}
		<PoemCard {block} {year} side={scene.records.side.get(block)} />
	{:else if block.kind === 'chengyu'}
		<ChengyuCard {block} {year} />
	{:else if block.kind === 'edict'}
		<EdictScroll {block} {year} />
	{:else if block.kind === 'covenant'}
		<CovenantCard {block} {year} />
	{:else if block.kind === 'omens'}
		<OmenTicker {block} {year} />
	{:else if block.kind === 'oath'}
		<OathStone {block} {year} />
	{:else if block.kind === 'place'}
		<PlaceCard {block} {year} />
	{:else if block.kind === 'diagram'}
		<DiagramBlock {block} {year} />
	{/if}
{/snippet}

<div class="prose">
	{#each shown as block, i (i)}
		{#if pinned && pinsToPanel(block)}
			<!-- Wide immersion: the widget lives in the widgets panel; this marks
			     where the reader reaches it (and, for a place, where the scene moves). -->
			<span
				class="widget-mark"
				data-widget={widgetKey(block)}
				data-mark={widgetKey(block)}
				data-place-mark={block.kind === 'place' ? block.place : undefined}
				aria-hidden="true"
			></span>
			{#if block.kind === 'hanja' && block.after}
				<p class="hanja-after">{@html linkPeople(block.after, scene.yearAt(block))}</p>
			{/if}
		{:else if block.kind === 'p' && block.emotion}
			<EmotionWord
				emotion={block.emotion}
				text={prose(block)}
				ko={block.ko}
				focus={block.focus}
				gallery={block.gallery}
			/>
		{:else if block.kind === 'p'}
			<p data-music={block.music || undefined} {@attach arrive(block)}>{@html linkPeople(prose(block), scene.yearAt(block))}</p>
		{:else if block.kind === 'cite'}
			<p class="cite" {@attach arrive(block)}>{@html linkPeople(prose(block), scene.yearAt(block))}</p>
		{:else if (block.kind === 'dialogue' || block.kind === 'quote') && scene.mails.has(block)}
			{@const mail = scene.mails.get(block)!}
			{@const next = scene.mails.get(shown[i + 1])}
			<EmailLetter
				{mail}
				from={mail.from ? byId.get(mail.from) : undefined}
				to={mail.to ? byId.get(mail.to) : undefined}
				year={scene.yearAt(block)}
				above={!mail.head && scene.mails.has(shown[i - 1])}
				below={!!next && !next.head}
				look={block.kind === 'dialogue' ? scene.lookOf(block) : undefined}
				lines={block.kind === 'dialogue' ? mailLines(block) : []}
				record={block.kind === 'quote' ? block : undefined}
			/>
		{:else if block.kind === 'wed'}
			{@const couple = block.couple.map((id) => byId.get(id))}
			{#if scene.hybrid && couple[0] && couple[1]}
				<FacebookLifeEvent couple={[couple[0], couple[1]]} year={scene.yearAt(block)} />
			{/if}
		{:else if block.kind === 'map' && scene.news?.block === block}
			<BreakingNews headline={scene.news.headline} headlineKo={scene.news.headlineKo} ticker={scene.news.ticker} />
			<Replay>{@render widget(block)}</Replay>
		{:else if block.kind === 'dialogue'}
			<DialogueBlock
				{block}
				{scene}
				media={block === blocks[0] ? media : undefined}
				arrive={scene.formOf(block) === 'message' && animating() ? chain(mark(block), floatIn, blockRef(block)) : arrive(block)}
			/>
		{:else if block.kind === 'verse'}
			<VerseBlock {block} arrive={block.person ? chain(mark(block), blockRef(block)) : arrive(block)} />
		{:else if block.kind === 'table'}
			<TableBlock {block} />
		{:else if REPLAYABLE.has(block.kind)}
			{#if block.kind === 'place' && !unpinned}
				<span class="widget-mark" data-place-mark={block.place} data-mark={widgetKey(block)} aria-hidden="true"
				></span>
			{/if}
			<Replay>{@render widget(block)}</Replay>
			{#if block.kind === 'hanja' && block.after}
				<p class="hanja-after">{@html linkPeople(block.after, scene.yearAt(block))}</p>
			{/if}
		{:else if block.kind === 'moral'}
			<AsideBlock {block} year={scene.yearAt(block)} />
		{:else if block.kind === 'monologue'}
			<AsideBlock {block} year={scene.yearAt(block)} arrive={arrive(block)} />
		{:else if block.kind === 'battle'}
			<BattleMap {block} />
		{:else if block.kind === 'formation'}
			<FormationBlock {block} />
		{:else if block.kind === 'section' || block.kind === 'story'}
			{@const no = block.kind === 'section' ? scene.sectionNo : scene.storyNo}
			<ScenePlate {block} sid={scene.sceneIdFor(block)} n={no.get(block)} arrive={arrive(block)} />
		{:else if block.kind === 'day' || block.kind === 'scene'}
			<ScenePlate {block} sid={scene.sceneIdFor(block)} arrive={arrive(block)} />
		{:else if block.kind === 'flashback'}
			{@const sid = scene.sceneIdFor(block)}
			{@const innerYear = block.year ? Number(block.year) || year : year}
			{@const innerWeather = scene.moods.get(block)?.weather ?? 'clear'}
			{@const innerBeats =
				flashImages && flashImages.length && block === blocks[0]
					? buildBeats({ blocks: block.blocks, images: flashImages })
					: null}
			<!-- mini-flashback: the page drops to black while this is under the reading line -->
			<aside class="mini" data-story-id={sid} data-scene={sid} data-flash="1">
				<header class="mini-head">
					<span class="mini-mark" aria-hidden="true"></span>
					{#if block.year}<span class="mini-year">{block.year}</span>{/if}
					{#if block.title}<span class="mini-title">{block.title}</span>{/if}
				</header>
				{#if innerBeats}
					{#each innerBeats as ib, ii (ii)}
						{#if ib.images.length}
							<div class="fb-art">
								<ImageStack images={ib.images} inline />
							</div>
						{/if}
						<Self blocks={ib.blocks} year={innerYear} weather={innerWeather} {sky} {unpinned} />
					{/each}
				{:else}
					<Self blocks={block.blocks} year={innerYear} weather={innerWeather} {sky} {unpinned} />
				{/if}
			</aside>
		{/if}
	{/each}
</div>

<style lang="scss">
	/* Widgets lay themselves out by the width they are given, so the same card
	fits the script column, a phone and immersion's widgets panel. */

	.prose {
		max-width: 54rem;
		container: prose / inline-size;
		& p {
			margin: 0 0 1.2rem;
			line-height: 1.5;
			color: var(--fg);
		}
	}

	/* Attribution lines — a hairline tick instead of a bullet */

	.cite {
		position: relative;
		padding-left: 1.35rem;
		font-size: 0.92em;
		color: var(--fg-dim);
		&::before {
			content: '';
			position: absolute;
			left: 0.35rem;
			top: 0.72em;
			width: 0.55rem;
			height: 1px;
			background: var(--fg-faint);
		}
	}

	/* ————— Cinema lettering: narration set as a caption box with a gold edge ————— */

	:global(html.is-cinema) .prose p {
		font-size: 1.02rem;
		line-height: 1.62;
	}

	:global(html.is-cinema) .cite {
		border-left: 3px solid color-mix(in srgb, var(--gold) 45%, transparent);
		padding-left: 0.9rem;
		background: color-mix(in srgb, var(--plate-ink) 34%, transparent);
		&::before {
			display: none;
		}
	}

	.widget-mark {
		display: block;
		height: 0;
	}

	.hanja-after {
		margin-top: 1.2rem;
	}

	/* ————— inline mini-flashback ————— */

	.mini {
		position: relative;
		margin: 2rem 0 2.2rem;
		padding: 1.1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
		border-radius: 8px;
		background: rgb(0 0 0 / 0.1);
	}

	.mini-head {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 0.7rem;
	}

	/* Cue plates interleaved with flashback prose (script / inline mode). */

	.fb-art {
		margin: 0 0 0.85rem;
	}

	.mini-mark {
		width: 0.75rem;
		height: 1px;
		background: var(--gold);
		align-self: center;
	}

	.mini-year {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--gold);
		letter-spacing: 0;
	}

	.mini-title {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.mini :global(.prose) {
		max-width: none;
	}

	/* ————— person triggers ————— */

	.prose :global(.person) {
		font: inherit;
		font-weight: var(--weight-link);
		letter-spacing: inherit;
		color: var(--fg-strong);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		transition: color 0.2s var(--ease);
	}

	.prose :global(.person:hover) {
		color: var(--gold);
	}

	/* the avatar is also a person trigger, but must not take the text styling */

	.prose :global(.face.person) {
		text-decoration: none;
		box-shadow: none;
		background: var(--chip);
	}

	.prose :global(.person:focus-visible) {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.prose :global(.person-age) {
		font-size: 0.65em;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0;
		line-height: 0;
		color: color-mix(in srgb, var(--fg) 48%, transparent);
		margin-left: 0.08em;
	}

	.prose :global(.person:hover .person-age) {
		color: color-mix(in srgb, var(--gold) 72%, transparent);
	}
</style>
