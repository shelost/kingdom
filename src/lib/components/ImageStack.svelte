<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { StackImage } from '$lib/story';
	import type { ScriptArtFrame } from '$lib/cueArt';
	import { liveDisplayArt, liveScriptFrames } from '$lib/stillEditUi.svelte';
	import { storyImg } from '$lib/img';
	import { reveal } from '$lib/reveal';
	import { reading } from '$lib/reading.svelte';
	import { filterNsfw } from '$lib/nsfwUi.svelte';
	import { editUi, filterVisibleCues } from '$lib/editUi.svelte';
	import { hasRealImage, isBrokenArt, markBrokenArt } from '$lib/storyImages';
	import { cueMenuTarget, openImageMenu } from '$lib/imageMenu.svelte';
	import { openLightbox, type LightboxItem } from '$lib/imageLightbox.svelte';
	import { isNsfwCueImage } from '$lib/nsfwCue';
	import { measureRatio, naturalRatio } from '$lib/imageRatio.svelte';
	import { dialogueUi } from '$lib/dialogueUi.svelte';
	import { sayOf } from '$lib/comicSay';
	import { hash } from '$lib/tweet';

	let {
		images,
		inline = false,
		priority = false
	}: {
		images: StackImage[];
		/** When true, show every frame in reading order (no sticky cue swap). */
		inline?: boolean;
		/** First visible stack — eager + high fetch for the opening cue. */
		priority?: boolean;
	} = $props();

	/** Immersion keeps the landscape phone-frame treatment; script uses normal sticky + cues. */
	let immersion = $derived(reading.mode === 'immersion');
	/* Empty slots only show (as prompt cards) in edit mode, where art is generated into them. */
	let visible = $derived.by(() => {
		const cues = filterVisibleCues(filterNsfw(images));
		return editUi.enabled ? cues : cues.filter(hasRealImage);
	});

	/** Script frames of a slot, minus any that failed to load. */
	function framesOf(slot: StackImage) {
		return liveScriptFrames(slot).filter((f) => !isBrokenArt(f.src));
	}

	/** Reading art; a final that 404s falls back to its temp stand-in. */
	function readingArt(slot: StackImage): string | undefined {
		const art = liveDisplayArt(slot, 'reading');
		return art && isBrokenArt(art) ? framesOf(slot)[0]?.src : art;
	}

	/** Panoramas this wide and portraits this tall never share a row. */
	const WIDE_RATIO = 2.4;
	const TALL_RATIO = 0.6;

	/** One inline figure: a script frame of a slot, or (edit mode) the empty slot's prompt card. */
	type InlineItem = {
		key: string;
		slot: StackImage;
		/** Index of the slot in `visible`. */
		index: number;
		frame?: ScriptArtFrame;
		first: boolean;
		ratio: number;
		fitted: boolean;
		/** Reading order across the whole stack. */
		order: number;
	};

	type InlineRow =
		| { key: string; solo: InlineItem }
		| { key: string; cols: [InlineItem[], InlineItem[]] };

	const isExtreme = (r: number) => r >= WIDE_RATIO || r <= TALL_RATIO;

	/** Shortest column first, so the pair ends level and reading order runs top to bottom. */
	function masonry(items: InlineItem[]): [InlineItem[], InlineItem[]] {
		const cols: [InlineItem[], InlineItem[]] = [[], []];
		const h = [0, 0];
		for (const it of items) {
			const c = h[1] < h[0] ? 1 : 0;
			cols[c].push(it);
			h[c] += 1 / it.ratio;
		}
		return cols;
	}

	/**
	 * Inline rows in reading order: extreme ratios and lone figures stand alone
	 * at the column's width; every other run of two or more pairs up as masonry.
	 */
	let inlineRows = $derived.by<InlineRow[]>(() => {
		if (!inline) return [];
		const items: InlineItem[] = [];
		visible.forEach((slot, index) => {
			const frames = framesOf(slot);
			if (!frames.length) {
				const ratio = slot.ratio ?? 2;
				items.push({ key: `${slot.id}:${index}`, slot, index, first: true, ratio, fitted: false, order: items.length });
				return;
			}
			frames.forEach((frame, fi) => {
				const fit = naturalRatio(frame.src);
				items.push({
					key: `${slot.id}:${index}:${frame.layer}`,
					slot,
					index,
					frame,
					first: fi === 0,
					ratio: fit ?? slot.ratio ?? 2,
					fitted: fit != null,
					order: items.length
				});
			});
		});

		const rows: InlineRow[] = [];
		let run: InlineItem[] = [];
		const flush = () => {
			if (run.length === 1) rows.push({ key: run[0].key, solo: run[0] });
			else if (run.length) rows.push({ key: `pair:${run[0].key}`, cols: masonry(run) });
			run = [];
		};
		for (const it of items) {
			if (isExtreme(it.ratio)) {
				flush();
				rows.push({ key: it.key, solo: it });
			} else run.push(it);
		}
		flush();
		return rows;
	});

	let live = $state(0);
	/** Sticky / inline stacks only fetch once near the viewport (or marked LCP). */
	let near = $state(false);

	const CUE_SIZES = '(max-width: 820px) 100vw, 42vw';
	/** Solo figures take the prose column; masonry figures half of it (one column on a phone). */
	const SOLO_SIZES = '(max-width: 820px) 92vw, 640px';
	const PAIR_SIZES = '(max-width: 599px) 92vw, (max-width: 820px) 46vw, 320px';

	/** Same mid as the reading band in `reading.svelte.ts` — a fixed viewport line. */
	const BAND_MID = 0.4;

	/**
	 * Sticky mode stacks every frame in the same viewport cell, so native
	 * `loading="lazy"` does not help — the browser treats them all as in-view.
	 * Only decode the live cue plus one neighbour for the fade / the next cut.
	 * Inline (script) stacks also wait until near the viewport — otherwise every
	 * cue on the chronicle mounts an `<img>` at once.
	 */
	function paintSlot(i: number): boolean {
		if (!near) return false;
		if (inline) return true;
		if (priority && i <= 1) return true;
		return Math.abs(i - live) <= 1;
	}

	const watchNear: Attachment<HTMLElement> = (node) => {
		if (priority) {
			near = true;
			return;
		}
		if (typeof IntersectionObserver === 'undefined') {
			near = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) near = true;
			},
			{ rootMargin: inline ? '600px 0px' : '400px 0px', threshold: 0 }
		);
		io.observe(node);
		return () => io.disconnect();
	};

	/**
	 * Rank of this slot among images that share its beat, and how many share it.
	 * Used to subdivide a beat's scroll range so every image gets its own cue.
	 */
	function cueShare(i: number): { rank: number; total: number; beat: number } {
		const beat = visible[i]?.beatIndex ?? 0;
		let rank = 0;
		let total = 0;
		for (let j = 0; j < visible.length; j++) {
			if ((visible[j].beatIndex ?? 0) !== beat) continue;
			if (j < i) rank++;
			total++;
		}
		return { rank, total: Math.max(1, total), beat };
	}

	/**
	 * Active image = last cue whose top has crossed the reading-band mid.
	 * Hysteresis keeps the live index from flickering when a cue sits on
	 * the mid-line (subpixel + sticky reflow used to chatter the reel).
	 */
	const CUE_HYSTERESIS = 12;

	function cueTopOf(i: number, beats: HTMLElement[]): number | null {
		const { rank, total, beat } = cueShare(i);
		const el = beats[beat];
		if (!el) return null;
		const r = el.getBoundingClientRect();
		return r.top + (r.height * rank) / total;
	}

	function indexAtBand(beats: HTMLElement[], mid: number, current: number): number {
		let active = 0;
		for (let i = 0; i < visible.length; i++) {
			const cueTop = cueTopOf(i, beats);
			if (cueTop == null) continue;
			if (cueTop <= mid) active = i;
		}
		if (active === current) return current;
		if (active > current) {
			const cueTop = cueTopOf(active, beats);
			return cueTop != null && cueTop <= mid - CUE_HYSTERESIS ? active : current;
		}
		const cueTop = cueTopOf(current, beats);
		return cueTop != null && cueTop > mid + CUE_HYSTERESIS ? active : current;
	}

	const watchLive: Attachment<HTMLElement> = (node) => {
		if (inline || !visible.length) {
			live = 0;
			return;
		}

		const article = node.closest<HTMLElement>('article.entry');
		const beats = article
			? [...article.querySelectorAll<HTMLElement>('[data-beat]')]
			: [];

		if (!beats.length) {
			live = 0;
			return;
		}

		let raf = 0;
		let roTimer = 0;
		const pick = () => {
			raf = 0;
			if (article) {
				const r = article.getBoundingClientRect();
				const slop = window.innerHeight * 1.5;
				if (r.bottom < -slop || r.top > window.innerHeight + slop) return;
			}
			const next = indexAtBand(beats, window.innerHeight * BAND_MID, live);
			if (next !== live) live = next;
		};

		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(pick);
		};

		const onResize = () => {
			if (roTimer) return;
			roTimer = window.setTimeout(() => {
				roTimer = 0;
				onScroll();
			}, 80);
		};

		pick();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		const ro =
			typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(onResize)
				: null;
		for (const el of beats) ro?.observe(el);

		return () => {
			if (raf) cancelAnimationFrame(raf);
			if (roTimer) clearTimeout(roTimer);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			ro?.disconnect();
		};
	};

	/**
	 * Fade each frame up as it arrives — except inline, where the figures are
	 * part of the manuscript and must simply be there, with nothing to wait for.
	 */
	function revealFrame(index: number): Attachment<HTMLElement> {
		return (node) => {
			if (inline) return;
			const handle = reveal(node, { delay: index * 70, y: 0 });
			return 'destroy' in handle ? handle.destroy : undefined;
		};
	}

	function cueText(slot: StackImage): string {
		if (slot.prompt?.trim()) return slot.prompt.trim();
		const alt = slot.alt?.trim();
		if (alt) return alt;
		return `Generate art for “${slot.id}”`;
	}

	function episodeIdOf(node: HTMLElement | null): string | undefined {
		const article = node?.closest<HTMLElement>('article.entry');
		return article?.dataset.storyId || undefined;
	}

	function stackItems(host: HTMLElement | null): LightboxItem[] {
		const episodeId = episodeIdOf(host);
		const items: LightboxItem[] = [];
		for (const slot of visible) {
			const frames = inline ? framesOf(slot) : [];
			const srcs = frames.length
				? frames.map((f) => f.src)
				: [readingArt(slot)].filter((s): s is string => !!s);
			for (const src of srcs) {
				items.push({
					src,
					alt: slot.alt ?? slot.id,
					title: slot.alt ?? slot.id,
					caption: slot.id,
					nsfw: isNsfwCueImage(slot),
					episodeId
				});
			}
		}
		return items;
	}

	function openAt(src: string, host: HTMLElement | null) {
		const items = stackItems(host);
		const index = items.findIndex((im) => im.src === src);
		openLightbox(items, index >= 0 ? index : 0, host);
	}

	function onEditContextMenu(e: MouseEvent, slotId: string, src?: string) {
		openImageMenu(e, cueMenuTarget(slotId, src));
	}
</script>

<!--
	Sticky single-frame stack: all slots occupy one viewport; scroll position
	picks which frame is live (symmetric, no IO hysteresis). Reading prefers
	final `src` over temp stand-in. Slots with no resolvable art are dropped,
	except in edit mode, where they show id + prompt.

	Inline layout (script mode): every frame sits in reading order at its own
	proportions, always visible — no reveal, no crop. Runs of ordinary frames
	pair up as a two-column masonry; panoramas, tall portraits and lone frames
	stand alone. Final art leads; a distinct temp stand-in is shown beside it
	so references are not hidden behind a locked-in `src`.
-->
<!-- Comic mode: the speaker's line in a white balloon over the still. -->
{#snippet balloon(slot: StackImage)}
	{@const say = dialogueUi.style === 'comic' || dialogueUi.style === 'hybrid' ? sayOf(slot.id) : undefined}
	{@const text = say && (reading.lang === 'ko' ? (say.ko ?? say.en) : (say.en ?? say.ko))}
	{#if text}
		<p class="balloon" class:right={hash(slot.id) % 2 === 1} lang={text === say?.ko ? 'ko' : undefined}>{text}</p>
	{/if}
{/snippet}

{#snippet inlineFigure(it: InlineItem, sizes: string)}
	{#if it.frame}
		{@const frame = it.frame}
		<figure
			class="frame art live"
			class:fitted={it.fitted}
			class:tall={it.ratio <= TALL_RATIO}
			style:--tone={it.slot.tone ?? '#3a3a40'}
			style:--ratio={it.ratio}
			style:--order={it.order}
			oncontextmenu={(e) => onEditContextMenu(e, it.slot.id, frame.src)}
		>
			{#if paintSlot(it.index)}
				<button
					type="button"
					class="open"
					onclick={(e) => openAt(frame.src, e.currentTarget)}
					aria-label={`Open ${it.slot.alt ?? it.slot.id}`}
				>
					<img
						class="shot"
						onerror={() => markBrokenArt(frame.src)}
						{@attach measureRatio(frame.src)}
						{...storyImg(frame.src, {
							kind: 'cue',
							priority: priority && it.index === 0 && it.first,
							sizes,
							widths: [384, 640, 828, 1200],
							alt:
								frame.layer === 'temp'
									? `${it.slot.alt ?? it.slot.id} (temp)`
									: (it.slot.alt ?? '')
						})}
					/>
				</button>
				{#if it.first}{@render balloon(it.slot)}{/if}
			{/if}
		</figure>
	{:else}
		<figure
			class="frame live"
			style:--tone={it.slot.tone ?? '#3a3a40'}
			style:--ratio={it.ratio}
			style:--order={it.order}
		>
			<div class="ph">
				<div class="cue">
					<span class="cue-id">{it.slot.id}</span>
					<p class="cue-prompt">{cueText(it.slot)}</p>
				</div>
			</div>
		</figure>
	{/if}
{/snippet}

{#if visible.length}
<div class="stack" class:immersion class:inline {@attach watchLive} {@attach watchNear}>
	{#if inline}
		{#each inlineRows as row (row.key)}
			{#if 'solo' in row}
				<div class="solo">{@render inlineFigure(row.solo, SOLO_SIZES)}</div>
			{:else}
				<div class="pair">
					{#each row.cols as col, c (c)}
						<div class="col">
							{#each col as it (it.key)}
								{@render inlineFigure(it, PAIR_SIZES)}
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		{/each}
	{:else}
		{#each visible as slot, i (`${slot.id}:${i}`)}
			{@const art = readingArt(slot)}
			{@const fit = naturalRatio(art)}
			<figure
				class="frame"
				class:art={!!art}
				class:live={i === live}
				class:fitted={fit != null}
				style:--ratio={immersion ? '3 / 2' : (fit ?? slot.ratio ?? 2)}
				style:--tone={slot.tone ?? '#3a3a40'}
				{@attach revealFrame(i)}
				oncontextmenu={(e) => onEditContextMenu(e, slot.id, art)}
			>
				{#if art && paintSlot(i)}
					<button
						type="button"
						class="open"
						onclick={(e) => openAt(art, e.currentTarget)}
						aria-label={`Open ${slot.alt ?? slot.id}`}
					>
						<img
							class="shot"
							onerror={() => markBrokenArt(art)}
							{@attach measureRatio(art)}
							{...storyImg(art, {
								kind: 'cue',
								priority: priority && i === 0,
								sizes: CUE_SIZES,
								alt: slot.alt ?? ''
							})}
						/>
					</button>
					{@render balloon(slot)}
				{:else if !art}
					<div class="ph">
						<div class="cue">
							<span class="cue-id">{slot.id}</span>
							<p class="cue-prompt">{cueText(slot)}</p>
						</div>
					</div>
				{/if}

				{#if visible.length > 1}
					<figcaption class="count" aria-hidden="true">{i + 1}/{visible.length}</figcaption>
				{/if}
			</figure>
		{/each}
	{/if}
</div>
{/if}

<style>
	.balloon {
		position: absolute;
		top: 6%;
		left: 5%;
		z-index: 2;
		max-width: min(55%, 18rem);
		margin: 0;
		padding: 0.4rem 0.6rem 0.45rem;
		font-family: var(--sans);
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: 0;
		color: #111;
		background: #fff;
		border: 1.5px solid #111;
		border-radius: 2px;
		box-shadow: 2px 2px 0 rgb(0 0 0 / 0.35);
		pointer-events: none;
	}

	.balloon.right {
		left: auto;
		right: 5%;
	}

	/* The tail, pointing down toward the speaker. */
	.balloon::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 1.1rem;
		border: 0.45rem solid transparent;
		border-top-color: #111;
		border-left-width: 0;
	}

	.balloon.right::after {
		left: auto;
		right: 1.1rem;
		border-left-width: 0.45rem;
		border-right-width: 0;
	}

	@media (max-width: 30rem) {
		.balloon {
			font-size: 0.7rem;
			max-width: 62%;
		}
	}

	.stack {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 12rem;
		display: grid;
		place-items: center;
	}

	.frame {
		grid-area: 1 / 1;
		position: relative;
		margin: 0;
		width: 100%;
		max-height: 100%;
		aspect-ratio: var(--ratio);
		overflow: hidden;
		box-shadow: none;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 480ms var(--ease),
			visibility 0s linear 480ms;
	}

	.frame.live {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		transition-delay: 0s;
		z-index: 1;
	}

	.frame.art {
		background: color-mix(in srgb, var(--tone) 40%, #14141a);
	}

	/* Tone is only a loading placeholder; once the real ratio is known the frame is the image. */
	.frame.art.fitted {
		background: transparent;
	}

	.frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.open {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: zoom-in;
		font: inherit;
		color: inherit;
	}

	.ph {
		width: 100%;
		height: 100%;
		min-height: 10rem;
		display: grid;
		place-items: center;
		padding: 1.1rem;
		background: color-mix(in srgb, var(--tone) 55%, #14141a);
	}

	.cue {
		max-width: 18rem;
		text-align: left;
	}

	.cue-id {
		display: inline-block;
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
		padding-bottom: 0.28rem;
		margin-bottom: 0.55rem;
	}

	.cue-prompt {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.78rem;
		line-height: 1.45;
		letter-spacing: var(--tracking-display);
		color: rgba(255, 253, 248, 0.78);
		white-space: pre-wrap;
		user-select: text;
	}

	/* Immersion: horizontal / landscape 3:2 phone frame — width locked to the stage column. */
	.stack.immersion {
		width: 100%;
		height: auto;
		min-height: 0;
		place-items: stretch;
	}

	.stack.immersion .frame {
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 100%;
		max-height: none;
		aspect-ratio: 3 / 2;
		background: #14141a;
		border-radius: var(--widget-radius);
	}

	.stack.immersion .open,
	.stack.immersion .shot,
	.stack.immersion .ph {
		grid-area: 1 / 1;
	}

	.stack.immersion .shot {
		z-index: 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	/* ————— Inline (script) —————
	   Every frame in reading order at the prose column's width. Width is the
	   column and height follows --ratio, so lazy decode cannot shove the page
	   (that was the mid-scroll jump). Runs of ordinary frames share a
	   two-column masonry; panoramas, tall portraits and lone frames stand alone. */
	.stack.inline {
		--inline-gap: 0.6rem;
		display: flex;
		flex-direction: column;
		gap: var(--inline-gap);
		height: auto;
		min-height: 0;
		place-items: stretch;
	}

	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
		gap: var(--inline-gap);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: var(--inline-gap);
		min-width: 0;
	}

	.stack.inline .frame {
		grid-area: auto;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		height: auto;
		max-height: none;
		aspect-ratio: var(--ratio, 2);
		contain: layout style;
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		z-index: auto;
		/* Always present: nothing to fade, nothing to slide. */
		transition: none;
		border-radius: var(--widget-radius);
		overflow: hidden;
	}

	/* A standalone portrait would run screens tall at full width: cap its height, centre it. */
	.solo .frame.tall {
		width: auto;
		height: min(78dvh, 40rem);
		margin-inline: auto;
	}

	.stack.inline .open {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
	}

	.stack.inline .frame img {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.stack.inline .ph {
		width: 100%;
		height: 100%;
		min-height: 0;
		padding: 0.5rem 0.7rem;
	}

	.stack.inline .cue-prompt {
		font-size: 0.7rem;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Phones: one column. The masonry columns dissolve and each figure takes
	   back its reading-order slot. */
	@media (max-width: 599px) {
		.pair {
			display: flex;
			flex-direction: column;
		}

		.col {
			display: contents;
		}

		.pair .frame {
			order: var(--order);
		}
	}

	.count {
		position: absolute;
		z-index: 2;
		right: 0.55rem;
		bottom: 0.55rem;
		padding: 0.1rem 0.45rem;
		font-size: 0.62rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		line-height: 1.6;
		color: rgba(255, 253, 248, 0.86);
		background: rgba(0, 0, 0, 0.42);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: var(--radius-pill);
		backdrop-filter: blur(6px);
		opacity: 0;
		transition: opacity 420ms var(--ease);
	}

	.frame.live .count {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.frame {
			transition: none;
		}
	}

	/* Narrow / portrait: cap the immersion reel so art leads the card without
	   owning the whole first screenful. Script keeps a calmer landscape + cues. */
	@media (max-width: 820px) {
		.stack {
			min-height: 0;
			width: 100%;
			padding: 0.65rem 1.1rem 0;
		}

		.stack.inline {
			padding: 0;
		}

		.stack:not(.immersion):not(.inline) .frame {
			max-height: min(38dvh, 16rem);
			border-radius: var(--widget-radius);
			overflow: hidden;
		}

		.stack.immersion .frame {
			width: 100%;
			margin-inline: auto;
			border-radius: var(--widget-radius);
		}

		.stack.immersion .shot {
			max-height: 100%;
			height: 100%;
			object-fit: cover;
		}

		.cue {
			max-width: 100%;
		}

		.cue-prompt {
			font-size: 0.72rem;
			display: -webkit-box;
			-webkit-line-clamp: 5;
			line-clamp: 5;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	@media (max-width: 480px) {
		.stack:not(.inline) {
			padding: 0.5rem 0.9rem 0;
		}
	}
</style>
