<script lang="ts">
	import { isSceneHeader, sceneIdForBlock, scenesOf, type Block, type ImageSlot } from '$lib/story';
	import {
		linkPeople,
		avatarOf,
		nameOf,
		isPlaceholderArt,
		byId,
		colorOf,
		hangulInitial,
		isMonarch,
		wearsSquare,
		godRingOf,
		placeholderFor,
		type Person
	} from '$lib/people';
	import { reading, isKorean, isStageMode, leadLang, activateDialogue } from '$lib/reading.svelte';
	import { filterScriptNsfw } from '$lib/nsfwUi.svelte';
	import { dialogueUi } from '$lib/dialogueUi.svelte';
	import { affiliationOf, badgeOf, handleOf } from '$lib/tweet';
	import { chatForms, mailOf, speakerName, standings, type Mail } from '$lib/chat';
	import { buildBeats } from '$lib/beats';
	import { utteranceOf } from '$lib/speech.svelte';
	import { storyImg } from '$lib/img';
	import { recordBook, type Testimony } from '$lib/recordBooks';
	import Self from './Blocks.svelte';
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
	import SpeakButton from './SpeakButton.svelte';
	import ImageStack from './ImageStack.svelte';
	import Replay from './Replay.svelte';
	import VerifiedBadge from './VerifiedBadge.svelte';
	import EmailLetter from './EmailLetter.svelte';
	import FacebookLifeEvent from './FacebookLifeEvent.svelte';
	import BreakingNews from './BreakingNews.svelte';

	type Dialogue = Extract<Block, { kind: 'dialogue' }>;

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
		breaking = false
	}: {
		blocks: Block[];
		year?: number | null;
		idPrefix?: string;
		sceneFrom?: Block[];
		flashImages?: ImageSlot[];
		media?: ImageSlot[];
		breaking?: boolean;
	} = $props();

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

	/** How many source lines an utterance has, across all its language layers. */
	function lineCount(b: Dialogue) {
		return Math.max(
			b.lines.length,
			b.en?.length ?? 0,
			b.zh?.length ?? 0,
			b.ja?.length ?? 0
		);
	}

	let koFirst = $derived(leadLang(reading.lang) === 'ko');

	let shown = $derived(filterScriptNsfw(blocks).filter(visible));

	let headerIdByBlock = $derived.by(() => {
		const map = new Map<Block, string>();
		if (!idPrefix) return map;
		const source = sceneFrom ?? blocks;
		const list = scenesOf(source, idPrefix);
		let n = 0;
		for (const b of source) {
			if (!isSceneHeader(b)) continue;
			const s = list[n++];
			if (s) map.set(b, s.id);
		}
		return map;
	});

	type Quote = Extract<Block, { kind: 'quote' }>;

	/**
	 * Read across the whole entry, since beats split it between stills: runs of quotes
	 * sharing an `event` become one testimony, and letters alternate sides by sender.
	 */
	let records = $derived.by(() => {
		const testimony = new Map<Block, Testimony>();
		const side = new Map<Block, 'left' | 'right'>();
		const senders: string[] = [];
		const poets: string[] = [];
		const source = sceneFrom ?? blocks;
		for (let i = 0; i < source.length; i++) {
			const b = source[i];
			// A verse exchange: each poet keeps a side; an unnamed poet takes the next one.
			if (b.kind === 'poem') {
				const who = b.person ?? `~${i}`;
				if (!poets.includes(who)) poets.push(who);
				side.set(b, poets.indexOf(who) % 2 ? 'right' : 'left');
				continue;
			}
			if (b.kind !== 'quote') continue;
			if (b.style === 'letter') {
				const who = b.person ?? b.source;
				if (!senders.includes(who)) senders.push(who);
				side.set(b, senders.indexOf(who) % 2 ? 'right' : 'left');
			}
			if (!b.event || testimony.has(b)) continue;
			const run: Quote[] = [b];
			for (let j = i + 1; j < source.length; j++) {
				const next = source[j];
				if (next.kind !== 'quote' || next.event !== b.event) break;
				run.push(next);
			}
			if (run.length < 2) continue;
			const nations = run.map((q) => recordBook(q.source).nation);
			const sources = run.map((q) => q.source);
			const { stance, claim, claimKo } = run[0];
			run.forEach((q, index) =>
				testimony.set(q, {
					index,
					count: run.length,
					nations,
					sources,
					key: run[0],
					stance,
					claim,
					claimKo
				})
			);
		}
		return { testimony, side };
	});

	/**
	 * In an unbroken exchange, a speaker is named only the first time they talk;
	 * after that the face carries it. Read across the whole entry, since beats
	 * split one exchange between stills.
	 */
	let quietNames = $derived.by(() => {
		const quiet = new Set<Block>();
		let named = new Set<string>();
		for (const b of sceneFrom ?? blocks) {
			if (b.kind !== 'dialogue') {
				named = new Set();
				continue;
			}
			const key = `${b.person ?? b.speaker ?? ''}|${b.look ?? ''}`;
			if (named.has(key)) quiet.add(b);
			else named.add(key);
		}
		return quiet;
	});

	/** Script, message or post for each line, by the reader's dialogue style (Hybrid reads the room). */
	let forms = $derived(chatForms(sceneFrom ?? blocks, dialogueUi.style));
	const formOf = (b: Block) => forms.get(b) ?? 'script';

	/** Who each speaker is at their line: the card that introduced them, or an heir under a living king. */
	let standing = $derived(standings(sceneFrom ?? blocks, year));
	const lookOf = (b: Dialogue) => b.look ?? standing.get(b)?.look;
	const reigns = (b: Dialogue, p: Person) => !standing.get(b)?.heir && isMonarch(p, year, lookOf(b));
	const squared = (b: Dialogue, p: Person) => !standing.get(b)?.heir && wearsSquare(p, year, lookOf(b));

	let hybrid = $derived(dialogueUi.style === 'hybrid');

	/** Hybrid letters: records and `chat: 'mail'` lines, threaded as an inbox. */
	let mails = $derived(hybrid ? mailOf(sceneFrom ?? blocks, forms) : new Map<Block, Mail>());

	/** A letter's lines in the reader's language first, the other tongue under it. */
	function mailLines(b: Dialogue): { lead: string; sub?: string }[] {
		return Array.from({ length: lineCount(b) }, (_, j) => {
			const ko = reading.lang === 'en' ? undefined : b.lines[j];
			const en = reading.lang === 'ko' ? undefined : b.en?.[j];
			const [lead, sub] = koFirst ? [ko ?? en, ko ? en : undefined] : [en ?? ko, en ? ko : undefined];
			return { lead: lead ?? '', sub };
		}).filter((l) => l.lead);
	}

	/** Hybrid, war episode: the first map is breaking news; every later headline crawls under it. */
	let news = $derived.by(() => {
		if (!hybrid || !breaking) return undefined;
		const source = sceneFrom ?? blocks;
		const headlineOf = (b: Block) =>
			b.kind === 'map' ? (b.title ?? b.caption) : b.kind === 'formation' ? b.title : b.kind === 'day' ? b.label : undefined;
		const lead = source.find((b): b is Extract<Block, { kind: 'map' }> => b.kind === 'map' && !!headlineOf(b));
		const headline = lead && headlineOf(lead);
		if (!lead || !headline) return undefined;
		const ticker = source
			.filter((b) => b !== lead)
			.map(headlineOf)
			.filter((t): t is string => !!t);
		return { block: lead, headline, headlineKo: lead.ko, ticker };
	});

	/** Posts always sit in a card; in Hybrid, so do messages, so every app reads as its own screen. */
	const carded = (b: Block | undefined): b is Dialogue =>
		b?.kind === 'dialogue' &&
		(formOf(b) === 'post' || (formOf(b) === 'message' && dialogueUi.style === 'hybrid'));

	/**
	 * An unbroken run of carded lines in one form is one card (a post thread, a
	 * chat screen). Each line knows whether the card runs on above or below it;
	 * a post also knows whom it answers when the speaker changes.
	 */
	let threads = $derived.by(() => {
		const map = new Map<Block, { above: boolean; below: boolean; replyTo?: Dialogue }>();
		const source = sceneFrom ?? blocks;
		const joins = (a: Block | undefined, b: Dialogue) => carded(a) && formOf(a) === formOf(b);
		for (let i = 0; i < source.length; i++) {
			const b = source[i];
			if (!carded(b)) continue;
			const prev = source[i - 1];
			const above = joins(prev, b);
			const replyTo =
				above && formOf(b) === 'post' && prev?.kind === 'dialogue' && prev.person && prev.person !== b.person
					? prev
					: undefined;
			map.set(b, { above, below: joins(source[i + 1], b), replyTo });
		}
		return map;
	});

	function sceneIdFor(block: Block): string | undefined {
		return headerIdByBlock.get(block) ?? sceneIdForBlock(block, sceneFrom ?? blocks, idPrefix);
	}
</script>

<!-- Every widget that animates in, drawn inside a replay control. -->
{#snippet widget(block: Block)}
	{#if block.kind === 'hanja'}
		<HanjaName {block} />
	{:else if block.kind === 'quote'}
		<RecordQuote {block} {year} testimony={records.testimony.get(block)} side={records.side.get(block)} />
	{:else if block.kind === 'map'}
		<MapExcerpt {block} />
	{:else if block.kind === 'card'}
		<PersonCard {block} {year} />
	{:else if block.kind === 'term'}
		<TermCard {block} />
	{:else if block.kind === 'poem'}
		<PoemCard {block} {year} side={records.side.get(block)} />
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

<!-- The body of one dialogue block: who is talking, then the lines themselves.
     Shared by the plain rendering and the clickable immersive one. -->
{#snippet utterance(block: Dialogue, p: Person | undefined)}
	{@const look = lookOf(block)}
	{#if formOf(block) === 'post' && p}
		{@const replyTo = threads.get(block)?.replyTo}
		{@const answered = replyTo?.person ? byId.get(replyTo.person) : undefined}
		{@const monarch = reigns(block, p)}
		{@const badge = badgeOf(p, year, look, monarch)}
		{@const org = affiliationOf(p, year)}
		<span class="tweet-head">
			<span class="tweet-name person" data-person={p.id}>{speakerName(p, year, look)}</span>
			{#if badge}<VerifiedBadge {badge} />{/if}
			{#if org}
				<span class="org person" data-person={org.id} style:--org={org.color} title={org.name}>{org.glyph}</span>
			{/if}
			<span class="tweet-meta">{handleOf(p, year, look, monarch)}</span>
		</span>
		{#if answered && replyTo}
			{@const theirLook = lookOf(replyTo)}
			<span class="tweet-reply"
				>Replying to <span class="handle person" data-person={answered.id}
					>{handleOf(answered, year, theirLook, reigns(replyTo, answered))}</span
				></span
			>
		{/if}
	{:else if p && !quietNames.has(block)}
		<span class="who"><span class="person" data-person={p.id}>{speakerName(p, year, look)}</span></span>
	{:else if p}
		<span class="sr-only">{speakerName(p, year, look)}</span>
	{:else if block.speaker}
		<span class="speaker">{block.speaker}</span>
	{/if}
	{#each { length: lineCount(block) } as _, j (j)}
		{@const ko = reading.lang === 'en' ? undefined : block.lines[j]}
		{@const en = reading.lang === 'ko' ? undefined : block.en?.[j]}
		<!-- The language the reader chose leads at body size; every other tongue
		     follows underneath it, a step smaller and a shade through. Each line
		     is one message: a bubble in comic mode, invisible otherwise. -->
		<span class="msg">
		{#if koFirst}
			{#if ko}
				<span class="line ko lead">{@html ko}</span>
			{/if}
			{#if en}
				<span class="line en" class:lead={!ko} class:sub={!!ko}>{@html en}</span>
			{/if}
		{:else}
			{#if en}
				<span class="line en lead">{@html en}</span>
			{/if}
			{#if ko}
				<span class="line ko" class:lead={!en} class:sub={!!en}>{@html ko}</span>
			{/if}
		{/if}
		<!-- Native CN/JP subtitle + transcription: always shown when present -->
		{#if block.zh?.[j]}
			<span class="line zh sub">{@html block.zh[j]}</span>
		{/if}
		{#if block.zhLatn?.[j]}
			<span class="line zh-latn sub">{block.zhLatn[j]}</span>
		{/if}
		{#if block.ja?.[j]}
			<span class="line ja sub">{@html block.ja[j]}</span>
		{/if}
		{#if block.jaLatn?.[j]}
			<span class="line ja-latn sub">{block.jaLatn[j]}</span>
		{/if}
		</span>
	{/each}
{/snippet}


<div class="prose">
	{#each shown as block, i (i)}
		{#if block.kind === 'p'}
			<p data-music={block.music || undefined}>{@html linkPeople(prose(block), year)}</p>
		{:else if block.kind === 'cite'}
			<p class="cite">{@html linkPeople(prose(block), year)}</p>
		{:else if (block.kind === 'dialogue' || block.kind === 'quote') && mails.has(block)}
			{@const mail = mails.get(block)!}
			{@const next = mails.get(shown[i + 1])}
			{@const from = mail.from ? byId.get(mail.from) : undefined}
			{@const to = mail.to ? byId.get(mail.to) : undefined}
			<EmailLetter
				{mail}
				{from}
				{to}
				{year}
				above={!mail.head && mails.has(shown[i - 1])}
				below={!!next && !next.head}
				look={block.kind === 'dialogue' ? lookOf(block) : undefined}
				lines={block.kind === 'dialogue' ? mailLines(block) : []}
				record={block.kind === 'quote' ? block : undefined}
			/>
		{:else if block.kind === 'wed'}
			{@const couple = block.couple.map((id) => byId.get(id))}
			{#if hybrid && couple[0] && couple[1]}
				<FacebookLifeEvent couple={[couple[0], couple[1]]} {year} />
			{/if}
		{:else if block.kind === 'map' && news?.block === block}
			<BreakingNews headline={news.headline} headlineKo={news.headlineKo} ticker={news.ticker} />
			<Replay>{@render widget(block)}</Replay>
		{:else if block.kind === 'dialogue'}
			{@const p = block.person ? byId.get(block.person) : undefined}
			{@const spoken = utteranceOf(block.lines, block.en, p?.id ?? null)}
			{@const thread = threads.get(block)}
			{@const form = formOf(block)}
			{@const look = lookOf(block)}
			<div
				class="dialogue"
				class:as-msg={form === 'message'}
				class:as-post={form === 'post'}
				class:carded={carded(block)}
				class:wechat={form === 'message' && !!block.zh?.length}
				class:line-app={form === 'message' && !block.zh?.length && !!block.ja?.length}
				class:thread-above={thread?.above}
				class:thread-below={thread?.below}
				style:--chip={p ? colorOf(p) : block.chip}
				data-speaker={p?.id ?? undefined}
				data-look={look ?? undefined}
			>
				{#if p}
					{@const maidSeed =
						p.id === 'courtmaid'
							? (block.lines ?? block.en ?? []).join('\n')
							: undefined}
					{@const art = avatarOf(p, maidSeed, year, look)}
					{@const who = nameOf(p, year, look)}
					{@const ring = godRingOf(p)}
					<button
						type="button"
						class="face person"
						class:monarch={squared(block, p)}
						class:god-ring={!!ring}
						class:silhouette={isPlaceholderArt(art) && p.id !== 'courtmaid'}
						style:--god-ring={ring}
						data-person={p.id}
						title={who}
						aria-label={who}
					>
						{#if art}
							<img {...storyImg(art, { kind: 'thumb', alt: '', sizes: '44px' })} />
						{:else}
							<span class="initial">{hangulInitial(p)}</span>
						{/if}
					</button>
				{:else}
					{@const stand = placeholderFor(block.speaker, block.gender)}
					<span class="face silhouette unnamed" aria-hidden="true">
						{#if stand}<img {...storyImg(stand, { kind: 'thumb', alt: '', sizes: '44px' })} />{/if}
					</span>
				{/if}
				<!-- Immersion / cinema: the lines are a control — click one to put it
				     on stage. Only speakers with a profile can hold a stage, so only
				     those become clickable; everything else stays plain prose. -->
				{#if p && isStageMode(reading.mode)}
					<button
						type="button"
						class="lines pick"
						title="Speak this line"
						onclick={(e) => activateDialogue(e.currentTarget)}
					>
						{@render utterance(block, p)}
					</button>
				{:else}
					<div class="lines">
						{@render utterance(block, p)}
					</div>
				{/if}
				{#if media?.length && form === 'post' && block === blocks[0]}
					<div class="tweet-media">
						<ImageStack images={media} inline />
					</div>
				{/if}
				<!-- Hear the line: parked in the gutter under the face, out of the
				     text's way, and out of flow so it changes no measurement. -->
				<SpeakButton utterance={spoken} />
			</div>
		{:else if block.kind === 'verse'}
			<div class="verse" style:--vc={block.color}>
				{#each block.lines as line, j (j)}
					<span class="line">{line}</span>
					{#if reading.lang !== 'ko' && block.en?.[j]}
						<span class="line en sub">{block.en[j]}</span>
					{/if}
				{/each}
			</div>
		{:else if block.kind === 'table'}
			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							{#each block.head as h, j (j)}
								<th style:--hc={block.colors?.[j]}>{h}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each block.rows as row, j (j)}
							<tr>
								{#each row as cell, k (k)}
									<td>{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if REPLAYABLE.has(block.kind)}
			<Replay>{@render widget(block)}</Replay>
			{#if block.kind === 'hanja' && block.after}
				<p class="hanja-after">{@html linkPeople(block.after, year)}</p>
			{/if}
		{:else if block.kind === 'moral'}
			<aside class="moral">
				<span class="moral-label">{block.label ?? 'the warning'}</span>
				<p>{@html linkPeople(prose(block), year)}</p>
			</aside>
		{:else if block.kind === 'monologue'}
			{@const p = block.person ? byId.get(block.person) : undefined}
			<aside
				class="monologue"
				style:--chip={p ? colorOf(p) : 'var(--fg-dim)'}
				data-speaker={p?.id ?? undefined}
				data-look={block.look ?? undefined}
			>
				{#if p}<span class="mono-label">{nameOf(p, year, block.look)}</span>{/if}
				<p>{@html linkPeople(prose(block), year)}</p>
			</aside>
		{:else if block.kind === 'battle'}
			<BattleMap {block} />
		{:else if block.kind === 'formation'}
			<figure class="formation">
				{#if block.title}<figcaption class="fm-title">{block.title}</figcaption>{/if}
				<div class="fm-field">
					{#each block.sides as side, si (si)}
						<div class="fm-side" style:--s={side.color}>
							<span class="fm-name">{side.name}</span>
							<div class="fm-units">
								{#each side.units as u, ui (ui)}
									<span class="fm-unit">
										<b>{u.label}</b>
										{#if u.sub}<i>{u.sub}</i>{/if}
									</span>
								{/each}
							</div>
						</div>
						{#if si === 0}<span class="fm-vs" aria-hidden="true"></span>{/if}
					{/each}
				</div>
				{#if block.note}<p class="fm-note">{block.note}</p>{/if}
			</figure>
		{:else if block.kind === 'day' || block.kind === 'scene'}
			{@const sid = sceneIdFor(block)}
			<!-- the siege calendar / merged-episode scene plate -->
			<header class="day" data-story-id={sid} data-scene={sid}>
				<span class="day-label">{block.label}</span>
				{#if block.ko}<span class="day-ko">{block.ko}</span>{/if}
			</header>
		{:else if block.kind === 'flashback'}
			{@const sid = sceneIdFor(block)}
			{@const innerBeats =
				flashImages && flashImages.length
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
						<Self
							blocks={ib.blocks}
							year={block.year ? Number(block.year) || year : year}
						/>
					{/each}
				{:else}
					<Self blocks={block.blocks} year={block.year ? Number(block.year) || year : year} />
				{/if}
			</aside>
		{/if}
	{/each}
</div>

<style>
	.prose {
		max-width: 54rem;
	}

	.prose p {
		margin: 0 0 1.2rem;
		line-height: 1.5;
		color: var(--fg);
	}

	/* Attribution lines — a hairline tick instead of a bullet */
	.cite {
		position: relative;
		padding-left: 1.35rem;
		font-size: 0.92em;
		color: var(--fg-dim);
	}

	.cite::before {
		content: '';
		position: absolute;
		left: 0.35rem;
		top: 0.72em;
		width: 0.55rem;
		height: 1px;
		background: var(--fg-faint);
	}

	/* ————— dialogue ————— */
	.dialogue {
		position: relative;
		display: grid;
		grid-template-columns: 2.15rem 1fr;
		gap: 0.75rem;
		margin: 1.25rem 0;
		transition:
			background 420ms var(--ease),
			box-shadow 420ms var(--ease),
			opacity 420ms var(--ease),
			padding 420ms var(--ease),
			margin 420ms var(--ease);
	}

	/* Stage modes (immersion + cinema): script lines stay; the live line gets a
	   soft featured pulse and the rest steps back — but never so far that the
	   page reads as empty. Neighbours stay skimmable. */
	:global(html.is-stage) .dialogue:not(:global(.is-speaking)) {
		opacity: 0.74;
	}

	/* The lit wash is the whole cue — no edge rule, so the line reads as a
	   raised piece of the page rather than a quoted block. */
	:global(html.is-stage) .dialogue:global(.is-speaking) {
		margin-left: -0.55rem;
		padding: 0.45rem 0.65rem 0.45rem 0.55rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--chip) 12%, color-mix(in srgb, var(--fg) 4%, transparent));
		opacity: 1;
	}

	/* ————— Cinema lettering —————
	   Comic rhythm: a balloon around every cue, narration set as a caption box
	   with a gold edge, and the translation kept deliberately under its breath
	   so a bilingual panel still reads as one voice. */
	:global(html.is-cinema) .prose p {
		font-size: 1.02rem;
		line-height: 1.62;
	}

	:global(html.is-cinema) .dialogue {
		margin: 1.05rem 0;
		padding: 0.5rem 0.8rem 0.55rem 0.6rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--plate-ink) 46%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--chip) 20%, transparent);
	}

	:global(html.is-cinema) .dialogue:not(:global(.is-speaking)) {
		opacity: 0.72;
	}

	:global(html.is-cinema) .dialogue:global(.is-speaking) {
		margin-left: 0;
		padding: 0.5rem 0.8rem 0.55rem 0.6rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--chip) 16%, color-mix(in srgb, var(--plate-ink) 62%, transparent));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--chip) 45%, transparent);
	}

	:global(html.is-cinema) .line.lead {
		font-size: 1.04em;
		color: var(--fg);
	}

	:global(html.is-cinema) .line.ko.sub,
	:global(html.is-cinema) .line.en.sub {
		font-size: 0.86em;
		color: var(--fg-dim);
	}

	/* Narration, monologue and the moral read as caption boxes. */
	:global(html.is-cinema) .cite,
	:global(html.is-cinema) .monologue,
	:global(html.is-cinema) .moral {
		border-left: 3px solid color-mix(in srgb, var(--gold) 45%, transparent);
		padding-left: 0.9rem;
		background: color-mix(in srgb, var(--plate-ink) 34%, transparent);
	}

	:global(html.is-cinema) .cite::before {
		display: none;
	}

	/* profile picture (or initial) for an assigned speaker */
	.face {
		width: 2.15rem;
		height: 2.15rem;
		margin-top: 0.15rem;
		padding: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--chip) 55%, transparent);
		border-radius: 50%;
		background: var(--chip);
		cursor: pointer;
		transition:
			transform 0.25s var(--ease),
			box-shadow 0.25s var(--ease);
	}

	/* Whoever holds the throne that year: a square badge with softened corners. */
	.face.monarch {
		border-radius: var(--monarch-radius);
	}

	/* Initials sit on the same accent disk. */
	.face:not(:has(img)) {
		background: var(--chip);
	}

	.face:hover {
		transform: scale(1.1);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--chip) 25%, transparent);
	}

	/* Full standing bust — never crop heads/feet. */
	.face img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		background: transparent;
	}

	/* a placeholder body, not a likeness — it sits back a little */
	.face.silhouette img {
		opacity: 0.62;
	}

	/* A voice with no profile (a guard, a crowd): the silhouette, and nothing to open. */
	.face.unnamed {
		cursor: default;
		background: color-mix(in srgb, var(--chip, var(--fg-faint)) 45%, transparent);
		border-color: color-mix(in srgb, var(--chip, var(--fg-faint)) 40%, transparent);
	}

	.face.unnamed:hover {
		transform: none;
		box-shadow: none;
	}

	.initial {
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 700;
		color: #fff;
	}

	.lines {
		display: flex;
		flex-direction: column;
		color: var(--fg-dim);
		min-width: 0;
	}

	/* One message per line. In the script it is invisible. */
	.msg {
		display: contents;
	}

	/* ————— Comic: every line a grey message bubble, the face at the foot of the stack ————— */
	/* Mixed from the page itself, so a bubble stays a step off any ground: night, paper or flashback. */
	.dialogue {
		--bubble: color-mix(in srgb, var(--fg) 7%, var(--bg));
		--bubble-ink: var(--fg);
		--post-pad: 1.15rem;
		--post-face: 2.5rem;
	}

	.dialogue.as-msg {
		align-items: end;
	}

	.as-msg .lines {
		align-items: flex-start;
		gap: 0.2rem;
	}

	.as-msg .who {
		margin: 0 0 0.05rem;
	}

	.as-msg .msg {
		display: flex;
		flex-direction: column;
		width: fit-content;
		max-width: min(100%, 30rem);
		padding: 0.42rem 0.8rem 0.46rem;
		border-radius: 1.15rem;
		color: var(--bubble-ink);
		background: var(--bubble);
	}

	.as-msg .msg:last-child {
		border-bottom-left-radius: 0.3rem;
	}

	.as-msg .msg .line {
		color: inherit;
	}

	.as-msg .msg .line.sub {
		margin-bottom: 0;
	}

	/* ————— Cards: a post thread (and, in Hybrid, a chat) is one bordered screen ————— */
	.dialogue.carded {
		--post-edge: color-mix(in srgb, var(--fg) 10%, transparent);
		margin: var(--widget-gap) 0 0;
		padding: var(--post-pad) calc(var(--post-pad) + 0.25rem) 0.5rem var(--post-pad);
		border: 1px solid var(--post-edge);
		border-bottom: none;
		border-radius: var(--widget-radius) var(--widget-radius) 0 0;
	}

	.dialogue.carded.thread-above {
		margin-top: 0;
		padding-top: 0.6rem;
		border-top: none;
		border-radius: 0;
	}

	.dialogue.carded:not(.thread-below) {
		margin-bottom: var(--widget-gap);
		padding-bottom: var(--post-pad);
		border-bottom: 1px solid var(--post-edge);
		border-bottom-left-radius: var(--widget-radius);
		border-bottom-right-radius: var(--widget-radius);
	}

	/* ————— Tweet: a post per utterance, threaded down the avatars ————— */
	.dialogue.as-post {
		grid-template-columns: var(--post-face) 1fr;
		gap: 0.85rem;
	}

	.dialogue.as-post.thread-below::before {
		content: '';
		position: absolute;
		left: calc(var(--post-pad) + var(--post-face) / 2 - 1px);
		top: calc(var(--post-pad) + var(--post-face) + 0.3rem);
		bottom: -0.3rem;
		width: 2px;
		border-radius: 1px;
		background: color-mix(in srgb, var(--fg) 20%, transparent);
	}

	.dialogue.as-post.thread-above.thread-below::before {
		top: calc(0.6rem + var(--post-face) + 0.3rem);
	}

	.as-post .face {
		width: var(--post-face);
		height: var(--post-face);
		margin-top: 0;
	}

	/* A still that opens on a post rides in it, as media under the text. */
	.tweet-media {
		grid-column: 2;
		margin-top: 0.35rem;
		overflow: hidden;
		border: 1px solid var(--post-edge);
		border-radius: var(--widget-radius);
	}

	.tweet-media :global(.stack) {
		margin: 0;
	}

	.as-post .lines {
		color: var(--fg);
	}

	.as-post .line.lead {
		color: var(--fg);
	}

	.tweet-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 0.15rem;
		font-size: 0.9rem;
		line-height: 1.3;
	}

	/* Names in dialogue open the wiki; they keep the dialogue's own type. */
	.prose .who .person {
		font-weight: inherit;
		color: inherit;
	}

	.prose .tweet-name {
		font-weight: 700;
		color: var(--fg-strong);
	}

	.prose .tweet-name:hover,
	.prose .who .person:hover {
		text-decoration: underline;
	}

	/* An affiliation: the house's glyph brushed in white on a small square of its
	   colour, as X tiles a company. Three classes deep, past the global .person reset. */
	.prose .tweet-head .org {
		display: inline-grid;
		place-items: center;
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 3px;
		font-family: 'Yuji Boku', 'LXGW WenKai TC', 'Noto Serif KR', serif;
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1;
		color: #fff;
		-webkit-text-stroke: 0.035em #fff;
		background: var(--org);
	}

	.prose .tweet-head .org:hover {
		color: #fff;
		filter: brightness(1.12);
	}

	.tweet-meta,
	.tweet-reply {
		font-size: 0.85rem;
		color: var(--fg-faint);
	}

	.tweet-reply {
		margin-bottom: 0.3rem;
	}

	.prose .tweet-reply .handle {
		font-weight: inherit;
		color: #1d9bf0;
	}

	/* ————— Tang speech as WeChat: square green bubbles ————— */
	.dialogue.as-msg.wechat {
		--bubble: #95ec69;
		--bubble-ink: #111;
	}

	.wechat .msg,
	.wechat .msg:last-child {
		border-radius: 4px;
		box-shadow: none;
	}

	.wechat .msg .line.sub {
		color: #3c5a2c;
		opacity: 0.85;
	}

	/* ————— Yamato speech as LINE: white rounded bubbles, the name in LINE green ————— */
	.dialogue.as-msg.line-app {
		--bubble: #ffffff;
		--bubble-ink: #111;
	}

	.line-app .msg {
		border-radius: 1.2rem;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
	}

	.line-app .msg:last-child {
		border-top-left-radius: 0.35rem;
		border-bottom-left-radius: 1.2rem;
	}

	.prose .line-app .who .person {
		color: #06c755;
	}

	.line-app .msg .line.sub {
		color: #5c5c66;
	}

	/* ————— speak this line —————
	   Out of flow in the gutter beneath the face, so it can never crowd the
	   text or change how tall a dialogue is. It keeps out of sight until the
	   reader is on this line, and stays lit while it is the one sounding. */
	.dialogue :global(.speak) {
		position: absolute;
		top: 2.55rem;
		left: 0.12rem;
		opacity: 0;
		transition: opacity 0.25s var(--ease);
	}

	@media (hover: hover) {
		.dialogue:hover :global(.speak) {
			opacity: 1;
		}
	}

	/* Nothing hovers on a touch screen — the control just sits there, quiet. */
	@media (hover: none) {
		.dialogue :global(.speak) {
			opacity: 0.45;
		}
	}

	.dialogue:focus-within :global(.speak),
	.dialogue :global(.speak.on),
	.dialogue :global(.speak.busy) {
		opacity: 1;
	}

	/* Immersive: the lines are the click target; the wash paints the whole
	   `.dialogue` (same box as `.is-speaking`), not just the text column. */
	.lines.pick {
		align-items: flex-start;
		width: 100%;
		margin: 0;
		padding: 0;
		font: inherit;
		letter-spacing: inherit;
		text-align: left;
		border: none;
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
	}

	/* Hover only where hovering exists — on a touch screen the state would
	   stick to the last line tapped. Mirror the active wash on the parent. */
	@media (hover: hover) {
		:global(html.is-stage) .dialogue:has(.lines.pick:hover):not(:global(.is-speaking)) {
			margin-left: -0.55rem;
			padding: 0.45rem 0.65rem 0.45rem 0.55rem;
			border-radius: var(--radius);
			background: color-mix(in srgb, var(--chip) 10%, color-mix(in srgb, var(--fg) 3%, transparent));
			opacity: 0.92;
		}
	}

	.lines.pick:focus-visible {
		outline: 1px solid color-mix(in srgb, var(--chip) 55%, var(--fg-strong));
		outline-offset: 0.35rem;
	}

	/* ————— language layers —————
	   Whichever language the reader picked *is* the line: body size, full
	   strength. Everything else is a gloss set beneath it. */
	.line {
		font-weight: calc(var(--weight-body) + 100);
		color: var(--fg-dim);
	}

	.line.lead {
		font-size: 1em;
		font-style: normal;
		opacity: 1;
	}

	.line.sub {
		font-size: 0.88em;
		opacity: 0.62;
		margin-bottom: 0.22rem;
	}

	.line.en.sub {
		font-style: italic;
	}

	/* Tang / Yamato native speech, and its transcription */
	.line.zh,
	.line.ja {
		margin-top: 0.12rem;
		font-family: 'Noto Serif KR', var(--serif);
		letter-spacing: 0.06em;
		line-height: 1.42;
		color: color-mix(in srgb, var(--chip) 38%, var(--fg-dim));
	}

	.line.zh-latn,
	.line.ja-latn {
		font-size: 0.78em;
		font-style: italic;
		letter-spacing: 0.02em;
		line-height: 1.45;
		color: var(--fg-faint);
	}

	.who {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: color-mix(in srgb, var(--chip) 45%, var(--fg-strong));
		margin-bottom: 0.1rem;
	}

	/* A repeat speaker's name: kept for screen readers, gone from the page. */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.speaker {
		font-size: 0.85em;
		opacity: 0.8;
	}

	/* Verse — a lit rule down the left edge */
	.verse {
		position: relative;
		margin: 1.15rem 0;
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-weight: 500;
		color: color-mix(in srgb, var(--vc) 58%, var(--fg-strong));
	}

	.verse::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.25rem;
		bottom: 0.25rem;
		width: 2px;
		border-radius: 2px;
		background: var(--vc);
		box-shadow: 0 0 16px -1px var(--vc);
	}

	.table-scroll {
		overflow-x: auto;
		margin: 1.2rem 0;
		border: 1px solid var(--hairline);
		border-radius: var(--widget-radius);
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.84rem;
	}

	th,
	td {
		border-right: 1px solid var(--hairline);
		padding: 0.4rem 0.9rem;
		text-align: center;
		white-space: nowrap;
	}

	th:last-child,
	td:last-child {
		border-right: none;
	}

	th {
		font-weight: 600;
		color: var(--fg-strong);
		letter-spacing: var(--tracking-micro);
		background: color-mix(in srgb, var(--fg) 5%, transparent);
		border-bottom: 1px solid var(--hairline);
	}

	/* Column-tinted heads (the four Dragons, the four Beasts) */
	th[style*='--hc'] {
		background: color-mix(in srgb, var(--hc, transparent) 16%, transparent);
	}

	td {
		color: var(--fg-dim);
	}

	.hanja-after {
		margin-top: 1.2rem;
	}

	/* ————— what the story leaves behind ————— */
	.moral {
		margin: 1.5rem 0 0.4rem;
		padding: 0.85rem 0 0;
		border-top: 1px solid color-mix(in srgb, var(--fg-faint) 30%, transparent);
	}

	.moral-label {
		display: block;
		margin-bottom: 0.4rem;
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide, 0.14em);
		color: var(--fg-faint);
	}

	.moral p {
		margin: 0;
		font-size: 0.98em;
		font-style: italic;
		line-height: 1.48;
		color: color-mix(in srgb, var(--fg) 78%, var(--fg-faint));
	}

	/* ————— retrospective interior (spoken from later) ————— */
	.monologue {
		position: relative;
		margin: 1.55rem 0 1.4rem;
		padding: 0.85rem 0 0.85rem 1.05rem;
		border-left: 2px solid color-mix(in srgb, var(--chip) 55%, transparent);
	}

	.mono-label {
		display: block;
		margin-bottom: 0.35rem;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--chip) 55%, var(--fg-faint));
	}

	.monologue p {
		margin: 0;
		font-family: var(--sans);
		font-size: 1.02em;
		font-style: italic;
		font-weight: 500;
		line-height: 1.5;
		letter-spacing: var(--tracking-body);
		color: color-mix(in srgb, var(--chip) 28%, var(--fg-strong));
	}

	/* ————— battle formation ————— */
	.formation {
		margin: 1.4rem 0;
		padding: 0.9rem 1rem 0.8rem;
		border: 1px solid var(--hairline);
		border-radius: var(--widget-radius);
	}

	.fm-title {
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
		margin-bottom: 0.7rem;
	}

	.fm-field {
		display: flex;
		align-items: stretch;
		gap: 0.9rem;
	}

	.fm-side {
		flex: 1;
		min-width: 0;
	}

	.fm-name {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: var(--s);
		margin-bottom: 0.45rem;
	}

	.fm-units {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.fm-unit {
		display: flex;
		flex-direction: column;
		padding: 0.32rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--s) 40%, transparent);
		border-left: 3px solid var(--s);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--s) 9%, transparent);
	}

	.fm-unit b {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--fg);
	}

	.fm-unit i {
		font-size: 0.68rem;
		font-style: normal;
		color: var(--fg-faint);
	}

	/* the line where the two sides meet */
	.fm-vs {
		width: 1px;
		background: var(--hairline);
		flex-shrink: 0;
	}

	.fm-note {
		margin: 0.7rem 0 0;
		font-size: 0.74rem;
		line-height: 1.55;
		color: var(--fg-faint);
	}

	/* ————— siege-day / scene header ————— */
	.day {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
		margin: 2.8rem 0 1rem;
	}

	.day:first-child {
		margin-top: 1rem;
	}

	.day-label {
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--fg-strong);
	}

	.day-ko {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	/* ————— inline mini-flashback ————— */
	.mini {
		position: relative;
		margin: 2rem 0 2.2rem;
		padding: 1.1rem 0 1.1rem 1.6rem;
		border-left: 1px solid rgba(216, 178, 106, 0.28);
	}

	.mini::before,
	.mini::after {
		content: '';
		position: absolute;
		left: -1px;
		width: 1px;
		height: 1.6rem;
		background: var(--gold);
	}

	.mini::before {
		top: 0;
	}

	.mini::after {
		bottom: 0;
		background: var(--gold);
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

	/* ————— Phones: targets a thumb can actually hit ————— */
	@media (max-width: 820px) {
		.dialogue {
			grid-template-columns: 2.6rem 1fr;
			gap: 0.8rem;
			margin: 1.5rem 0;
		}

		.face {
			width: 2.6rem;
			height: 2.6rem;
			margin-top: 0.1rem;
		}

		/* clears the taller face, and the target grows to thumb size */
		.dialogue :global(.speak) {
			top: 3.1rem;
			left: 0.08rem;
		}

		/* The line is already the full width of the column; only its height is
		   short of a comfortable target, and padding-block grown against an
		   equal negative margin-block adds it without moving any text. */
		.lines.pick {
			min-height: 2.75rem;
			margin-block: -0.5rem;
			padding-block: 0.5rem;
			border-radius: var(--radius);
			-webkit-tap-highlight-color: transparent;
		}

		/* the chronicle either side of the live line still has to be readable */
		:global(html.is-stage) .dialogue:not(:global(.is-speaking)) {
			opacity: 0.88;
		}
	}
</style>
