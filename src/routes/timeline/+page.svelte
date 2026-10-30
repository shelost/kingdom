<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Avatar from '$lib/components/Avatar.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { reading } from '$lib/reading.svelte';
	import { storyImg } from '$lib/img';
	import type { DirectoryEpisode } from '$lib/episodeDirectory';
	import {
		ARC_STRIP_W,
		LANE_W,
		TIMELINE,
		concurrent,
		yearAt,
		yearLabel,
		type TimelineColumn,
		type TimelineEvent,
		type TimelineItem
	} from '$lib/timeline';

	const AXIS_W = 50;
	const HEAD_H = 44;
	const TIMELESS_ROW_H = 20;
	const PAD = 4;
	/** A story stretch inside a bar needs this much height to print its name (the first sits under the episode label). */
	const STORY_H = 14;
	const STORY_FIRST_H = 42;
	/** The cursor jumps to a key event this close to the pointer. */
	const SNAP_PX = 10;

	let ko = $derived(reading.lang === 'ko');
	/** The bar under the pointer (or focus): its stretch of time is banded across every column. */
	let hovered = $state<TimelineItem | null>(null);
	let scroller = $state<HTMLDivElement>();
	let board = $state<HTMLDivElement>();
	/** Pointer height on the time axis, in board pixels; null when the pointer is off the board. */
	let pointerY = $state<number | null>(null);
	/** An event tick the pointer is on — holds the card even if the hairline moves. */
	let pinned = $state<TimelineEvent | null>(null);
	let panning = $state(false);
	let pan = { x: 0, y: 0, sl: 0, st: 0 };
	let scrollTop = $state(0);
	let unpinTimer: ReturnType<typeof setTimeout> | undefined;

	function pin(e: TimelineEvent) {
		clearTimeout(unpinTimer);
		pinned = e;
	}

	function scheduleUnpin() {
		clearTimeout(unpinTimer);
		unpinTimer = setTimeout(() => (pinned = null), 140);
	}

	let nearest = $derived.by((): TimelineEvent | null => {
		if (pointerY === null) return null;
		let best: TimelineEvent | null = null;
		for (const e of TIMELINE.events) {
			const d = Math.abs(e.top - pointerY);
			if (d <= SNAP_PX && (!best || d < Math.abs(best.top - pointerY))) best = e;
		}
		return best;
	});
	let snapped = $derived(pinned ?? nearest);
	let cursorY = $derived(snapped ? snapped.top : pointerY);
	/** Episode id → whether it tells the snapped event in full (false = a brief mention). */
	let coverage = $derived(new Map(snapped?.covers.map((c) => [c.ep.id, c.full]) ?? []));
	/** Flip the card above the hairline when the event sits in the lower half of the viewport. */
	let flipCard = $derived.by(() => {
		if (!snapped || !scroller) return false;
		return HEAD_H + snapped.top - scrollTop > scroller.clientHeight * 0.52;
	});

	$effect(() => {
		if (scroller) scroller.scrollTop = Math.max(0, TIMELINE.presentTop - 8);
	});

	const timelessH = TIMELINE.timelessRows ? TIMELINE.timelessRows * TIMELESS_ROW_H + 12 : 0;

	function hrefOf(ep: DirectoryEpisode, hash = ''): string {
		return hrefWithNsfw(`${resolve('/read')}?ep=${encodeURIComponent(ep.queryId)}${hash ? `#${hash}` : ''}`, page.url);
	}

	function titleOf(ep: DirectoryEpisode): string {
		return ko && ep.ko ? ep.ko : ep.title;
	}

	function spanOf(item: TimelineItem): string {
		const sub = item.ep.entry.sub && !ko ? ` ${item.ep.entry.sub}` : '';
		return item.from === item.to
			? `${yearLabel(item.from, ko)}${sub}`
			: `${yearLabel(item.from, ko)}–${yearLabel(item.to, ko)}`;
	}

	function show(item: TimelineItem | null) {
		hovered = item;
	}

	/** Left edge of a column's first lane: the primary column keeps a strip for its Arcs. */
	function insetOf(col: TimelineColumn): number {
		return (col.id === 'primary' ? ARC_STRIP_W : 0) + PAD;
	}

	function laneX(col: TimelineColumn, item: TimelineItem): number {
		return insetOf(col) + item.lane * LANE_W;
	}

	/** A snapped event fades every bar that does not tell it; otherwise a hovered bar fades what is not concurrent. */
	function faded(item: TimelineItem): boolean {
		if (snapped) return !coverage.has(item.ep.id);
		return !!hovered && !concurrent(hovered, item);
	}

	function track(e: PointerEvent) {
		if (!board || !scroller || panning) return;
		if (e.clientY - scroller.getBoundingClientRect().top < HEAD_H) {
			pointerY = null;
			return;
		}
		const y = e.clientY - board.getBoundingClientRect().top - HEAD_H;
		pointerY = y >= 0 && y <= TIMELINE.height ? y : null;
	}

	function canPanFrom(el: EventTarget | null): boolean {
		return !(el instanceof Element && el.closest('a, button, .event-card, .event-tick'));
	}

	function startPan(e: PointerEvent) {
		if (e.button !== 0 || !scroller || !canPanFrom(e.target)) return;
		panning = true;
		pan = { x: e.clientX, y: e.clientY, sl: scroller.scrollLeft, st: scroller.scrollTop };
		scroller.setPointerCapture(e.pointerId);
	}

	function movePan(e: PointerEvent) {
		if (panning && scroller) {
			scroller.scrollLeft = pan.sl - (e.clientX - pan.x);
			scroller.scrollTop = pan.st - (e.clientY - pan.y);
		}
		track(e);
	}

	function endPan(e: PointerEvent) {
		if (!panning) return;
		panning = false;
		if (scroller?.hasPointerCapture(e.pointerId)) scroller.releasePointerCapture(e.pointerId);
	}

	function eventDate(e: TimelineEvent): string {
		return e.sub && !ko ? `${yearLabel(e.year, ko)} ${e.sub}` : yearLabel(e.year, ko);
	}
</script>

<svelte:head>
	<title>Timeline · King for All</title>
	<meta name="description" content="Every episode of King for All on one time axis, so you can see which stories happen at the same time." />
</svelte:head>

{#snippet band()}
	{#if hovered}
		<div class="band" style:top="{hovered.top}px" style:height="{hovered.height}px" aria-hidden="true"></div>
	{/if}
{/snippet}

<main class="timeline-page">
	<div
		class="scroller"
		class:panning
		bind:this={scroller}
		onpointerdown={startPan}
		onpointermove={movePan}
		onpointerup={endPan}
		onpointercancel={endPan}
		onscroll={() => {
			if (scroller) scrollTop = scroller.scrollTop;
		}}
	>
		<div
			class="board"
			style:--head="{HEAD_H}px"
			style:--timeless="{timelessH}px"
			bind:this={board}
			role="presentation"
			onpointerleave={() => {
				if (!panning) pointerY = null;
			}}
		>
			{#if cursorY !== null}
				<div class="cursor" class:snapped style:top="{HEAD_H + cursorY}px" aria-hidden="true">
					<div class="cursor-tag" style:width="{AXIS_W}px">
						{#if snapped}{eventDate(snapped)}{:else if yearAt(cursorY) !== null}{yearLabel(yearAt(cursorY)!, ko)}{/if}
					</div>
					{#if snapped}
						<div
							class="event-card"
							class:crossover={snapped.crossover}
							class:flip={flipCard}
							style:left="{AXIS_W + 4}px"
							onpointerenter={() => snapped && pin(snapped)}
							onpointerleave={scheduleUnpin}
						>
							{#if snapped.crossover}
								<span class="xover">{ko ? '교차' : 'Crossover'}</span>
							{/if}
							<strong>{ko ? snapped.title.ko : snapped.title.en}</strong>
							{#if snapped.people.length}
								<div class="faces" role="group" aria-label={ko ? '등장인물' : 'People'}>
									{#each snapped.people as person (person.id)}
										<Avatar {person} year={snapped.year} size="2rem" label />
									{/each}
								</div>
							{/if}
							{#if snapped.stills.length}
								<div class="stills">
									{#each snapped.stills as still (still.id)}
										<img {...storyImg(still.src, { kind: 'place', alt: still.alt, sizes: '160px' })} />
									{/each}
								</div>
							{/if}
							<span class="covers">
								{#each snapped.covers as c (c.ep.id)}
									<span class="cover" class:full={c.full}>
										<i class="hit" class:full={c.full}></i>{#if c.ep.number}<span class="num">{c.ep.number}</span>{/if}{titleOf(c.ep)}
									</span>
								{/each}
							</span>
						</div>
					{/if}
				</div>
			{/if}
			<div class="axis" style:width="{AXIS_W}px">
				<div class="corner"></div>
				<div class="body" style:height="{TIMELINE.height}px">
					{#each TIMELINE.ticks as t (t.year)}
						<span class="tick" class:major={t.major} style:top="{t.top}px">{yearLabel(t.year, ko)}</span>
					{/each}
					{#each TIMELINE.breaks as g (g.from)}
						<span class="fold" style:top="{g.top}px" style:height="{g.height}px">
							<span>⋯</span>
							<small>{g.to - g.from}{ko ? '년' : ' yrs'}</small>
						</span>
					{/each}
					{#each TIMELINE.events as e (e.id)}
						<button
							type="button"
							class="event-tick"
							class:on={snapped === e}
							class:crossover={e.crossover}
							style:top="{e.top}px"
							title="{eventDate(e)} · {ko ? e.title.ko : e.title.en}{e.crossover ? (ko ? ' · 교차' : ' · crossover') : ''}"
							aria-label="{eventDate(e)} · {ko ? e.title.ko : e.title.en}"
							onpointerenter={() => pin(e)}
							onpointerleave={scheduleUnpin}
						></button>
					{/each}
					{@render band()}
				</div>
				{#if timelessH}<div class="timeless-label">{ko ? '태초' : 'Timeless'}</div>{/if}
			</div>

			{#each TIMELINE.columns as col (col.id)}
				<section
					class="column"
					class:primary={col.id === 'primary'}
					style:width="{insetOf(col) + col.lanes * LANE_W + PAD}px"
					aria-label={col.title.en}
				>
					<header class="head">
						<span class="eyebrow">{ko ? col.note.ko : col.note.en}</span>
						<span class="head-title">{ko ? col.title.ko : col.title.en}</span>
					</header>
					<div class="body" style:height="{TIMELINE.height}px">
						{#each TIMELINE.breaks as g (g.from)}
							<div class="fold-line" style:top="{g.top + g.height / 2}px" aria-hidden="true"></div>
						{/each}
						{@render band()}

						{#if col.id === 'primary'}
							{#each TIMELINE.arcs as a (a.id)}
								<span
									class="arc"
									style:top="{a.top}px"
									style:height="{a.height}px"
									style:width="{ARC_STRIP_W}px"
									title="{ko ? a.label.ko : a.label.en} · {ko ? a.title.ko : a.title.en}"
								>
									<span>{ko ? a.title.ko : a.title.en}</span>
								</span>
							{/each}
						{/if}

						{#each col.items as item (item.ep.id)}
							{@const x = laneX(col, item)}
							{#each item.flashbacks as m (m.year)}
								<span
									class="link"
									style:left="{x + 10}px"
									style:top="{Math.min(m.top, item.top)}px"
									style:height="{Math.abs(item.top - m.top)}px"
									class:dim={snapped ? faded(item) : hovered && hovered !== item}
									aria-hidden="true"
								></span>
								<span
									class="marker"
									style:left="{x + 6}px"
									style:top="{m.top - 4}px"
									style:--tone={item.tone}
									class:dim={snapped ? faded(item) : hovered && hovered !== item}
									title="{titleOf(item.ep)} · {ko ? '회상' : 'remembers'} {yearLabel(m.year, ko)}"
								></span>
							{/each}
						{/each}

						{#each col.items as item (item.ep.id)}
							<div
								class="item"
								class:flash={item.flash}
								class:dim={faded(item)}
								class:on={hovered === item}
								class:tells={coverage.get(item.ep.id) === true}
								class:mentions={coverage.get(item.ep.id) === false}
								style:left="{laneX(col, item)}px"
								style:width="{LANE_W - PAD}px"
								style:top="{item.top}px"
								style:height="{item.height}px"
								style:--tone={item.tone}
								role="presentation"
								onpointerenter={() => show(item)}
								onpointerleave={() => show(null)}
								onfocusin={() => show(item)}
								onfocusout={() => show(null)}
							>
								{#each item.stories as s, i (s.id)}
									{@const name = ko && s.ko ? s.ko : s.title}
									{@const year = yearLabel(Math.floor(s.start), ko)}
									{#if s.height > 0}
										<a
											class="story"
											class:first={i === 0}
											href={hrefOf(item.ep, s.id)}
											style:top="{s.top - item.top}px"
											style:height="{s.height}px"
											title="{name} · {year}"
										>
											{#if s.height >= (i === 0 ? STORY_FIRST_H : STORY_H)}
												<span class="story-name">{name}</span><span class="story-year">{year}</span>
											{/if}
										</a>
									{/if}
								{/each}
								<a class="label" href={hrefOf(item.ep)}>
									<span class="line">
										{#if item.ep.number}<span class="num">{item.ep.number}</span>{/if}
										<span class="title">{titleOf(item.ep)}</span>
									</span>
									<span class="years">{spanOf(item)}</span>
								</a>
								{#if snapped && coverage.has(item.ep.id)}
									<i
										class="hit on-bar"
										class:full={coverage.get(item.ep.id)}
										style:top="{Math.min(Math.max(snapped.top - item.top, 0), item.height)}px"
									></i>
								{/if}
							</div>
						{/each}
					</div>
					{#if timelessH}
						<div class="timeless">
							{#each col.timeless as ep (ep.id)}
								<a class="chip" href={hrefOf(ep)}><span class="num">{ep.number}</span>{titleOf(ep)}</a>
							{/each}
						</div>
					{/if}
				</section>
			{/each}
		</div>
	</div>

	<p class="legend" aria-hidden="true">
		<span class="key"><i class="swatch present"></i>{ko ? '현재' : 'Present'}</span>
		<span class="key"><i class="swatch past"></i>{ko ? '회상' : 'Flashback'}</span>
		<span class="key"><i class="hit full"></i>{ko ? '다룸' : 'Tells'}</span>
		<span class="key"><i class="hit"></i>{ko ? '언급' : 'Mentions'}</span>
		<span class="key"><i class="event-tick legend-tick crossover"></i>{ko ? '교차 사건' : 'Crossover'}</span>
	</p>
</main>
<PersonLayer />

<style>
	.timeline-page {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100dvh;
		padding-bottom: var(--tabbar-space);
		box-sizing: border-box;
		overflow: hidden;
		background: var(--bg);
		color: var(--fg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
	}

	.legend {
		position: fixed;
		left: max(0.55rem, env(safe-area-inset-left));
		bottom: calc(var(--tabbar-space, 0px) + 0.55rem);
		z-index: 8;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.85rem;
		margin: 0;
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--hairline);
		border-radius: 6px;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		font-size: 0.62rem;
		color: var(--fg-faint);
		pointer-events: none;
	}

	.key {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		width: 0.9rem;
		height: 0.65rem;
		border-radius: 2px;
		border-left: 3px solid var(--gold);
		background: color-mix(in srgb, var(--gold) 18%, transparent);
	}

	.swatch.past {
		border-left: 3px dashed #8a8a94;
		background: repeating-linear-gradient(135deg, color-mix(in srgb, #8a8a94 22%, transparent) 0 3px, transparent 3px 6px);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--fg-dim);
	}

	.squiggle {
		font-style: normal;
		color: var(--fg-dim);
	}

	/* —— The board: one scroll box, sticky Arc headers on top, sticky years on the left —— */
	.scroller {
		flex: 1;
		min-height: 0;
		overflow: auto;
		cursor: grab;
		overscroll-behavior: contain;
		touch-action: none;
	}

	.scroller.panning {
		cursor: grabbing;
		user-select: none;
	}

	.board {
		position: relative;
		display: flex;
		width: max-content;
		min-width: 100%;
	}

	/* —— The cursor: a hairline across every column, gold when it snaps to a key event —— */
	.cursor {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 6;
		height: 0;
		border-top: 1px solid color-mix(in srgb, var(--fg) 35%, transparent);
		pointer-events: none;
	}

	.cursor.snapped {
		border-top: 2px solid var(--gold);
	}

	.cursor-tag {
		position: sticky;
		left: 0;
		box-sizing: border-box;
		padding: 0 0.4rem 0 0.2rem;
		transform: translateY(-50%);
		background: var(--bg);
		font-size: 0.62rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
		color: var(--fg-strong);
	}

	.cursor.snapped .cursor-tag {
		color: var(--gold);
	}

	.event-card {
		position: sticky;
		left: 0;
		z-index: 7;
		display: grid;
		gap: 0.3rem;
		width: max-content;
		max-width: min(28rem, 72vw);
		margin-top: 4px;
		padding: 0.4rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		border-radius: 4px;
		background: color-mix(in srgb, var(--bg) 94%, transparent);
		box-shadow: 0 4px 14px rgb(0 0 0 / 0.35);
		font-size: 0.66rem;
		pointer-events: auto;
	}

	.event-card.crossover {
		border-color: var(--gold);
	}

	.event-card.flip {
		transform: translateY(calc(-100% - 10px));
	}

	.xover {
		width: max-content;
		padding: 0.05rem 0.35rem;
		border: 1px solid color-mix(in srgb, var(--gold) 70%, transparent);
		border-radius: 999px;
		font-size: 0.52rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.faces {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.55rem;
	}

	.faces :global(.name) {
		font-size: 0.62rem;
		color: var(--fg-strong);
	}

	.stills {
		display: flex;
		gap: 0.3rem;
	}

	.stills img {
		width: 7.4rem;
		height: 3.7rem;
		object-fit: cover;
		border-radius: 3px;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.event-card strong {
		font-family: var(--serif);
		font-size: 0.78rem;
		color: var(--fg-strong);
	}

	.covers {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
	}

	.cover {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--fg-dim);
	}

	.cover.full {
		color: var(--fg-strong);
	}

	.event-tick {
		position: absolute;
		left: 0;
		z-index: 5;
		width: 16px;
		height: 16px;
		padding: 0;
		border: none;
		background: transparent;
		transform: translateY(-50%);
		cursor: pointer;
	}

	.event-tick::after {
		content: '';
		position: absolute;
		left: 4px;
		top: 50%;
		width: 6px;
		height: 6px;
		transform: translateY(-50%) rotate(45deg);
		background: color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.event-tick.on::after {
		background: var(--gold);
	}

	.event-tick.crossover::after {
		width: 8px;
		height: 8px;
		background: var(--gold);
		box-shadow: 0 0 0 1.5px var(--bg), 0 0 0 3px color-mix(in srgb, var(--gold) 75%, transparent);
	}

	.legend-tick {
		position: relative;
		display: inline-block;
		width: 12px;
		height: 12px;
		transform: none;
		vertical-align: middle;
	}

	/* A diamond: filled when the episode tells the event, hollow when it only mentions it. */
	.hit {
		display: inline-block;
		flex: 0 0 auto;
		width: 7px;
		height: 7px;
		box-sizing: border-box;
		transform: rotate(45deg);
		border: 1.5px solid var(--gold);
		background: var(--bg);
	}

	.hit.full {
		background: var(--gold);
	}

	.hit.on-bar {
		position: absolute;
		right: 6px;
		z-index: 2;
		width: 9px;
		height: 9px;
		transform: translateY(-50%) rotate(45deg);
	}

	.item.tells {
		z-index: 2;
		box-shadow: 0 0 0 1.5px var(--gold);
	}

	.item.mentions {
		z-index: 2;
		outline: 1px dashed color-mix(in srgb, var(--gold) 70%, transparent);
		outline-offset: 1px;
	}

	.axis {
		position: sticky;
		left: 0;
		z-index: 4;
		flex: 0 0 auto;
		background: var(--bg);
		border-right: 1px solid var(--hairline);
	}

	.corner,
	.head {
		position: sticky;
		top: 0;
		height: var(--head);
		box-sizing: border-box;
		background: var(--bg);
		border-bottom: 1px solid var(--hairline);
	}

	.corner {
		z-index: 5;
	}

	.timeless-label {
		display: flex;
		align-items: flex-start;
		justify-content: flex-end;
		height: var(--timeless);
		padding: 0.4rem 0.45rem 0 0;
		box-sizing: border-box;
		border-top: 1px solid var(--hairline);
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--fg-faint);
	}

	.body {
		position: relative;
	}

	.tick {
		position: absolute;
		right: 0.45rem;
		transform: translateY(-0.1em);
		font-size: 0.6rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
		white-space: nowrap;
	}

	.tick.major {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--fg-dim);
	}

	.fold {
		position: absolute;
		right: 0.45rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		line-height: 1;
		color: var(--fg-faint);
	}

	.fold small {
		font-size: 0.55rem;
	}

	.column {
		flex: 0 0 auto;
		border-right: 1px solid var(--hairline);
	}

	.column.primary {
		border-right-color: color-mix(in srgb, var(--gold) 40%, var(--hairline));
	}

	.head {
		z-index: 3;
		display: grid;
		align-content: center;
		gap: 0.05rem;
		padding: 0 0.4rem;
		overflow: hidden;
	}

	.eyebrow {
		font-size: 0.58rem;
		font-weight: 600;
		color: var(--gold);
	}

	.head-title {
		overflow: hidden;
		font-family: var(--serif);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-strong);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.arc {
		position: absolute;
		left: 0;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		padding: 4px 0;
		border-top: 1px solid color-mix(in srgb, var(--gold) 45%, transparent);
		border-right: 1px solid var(--hairline);
		overflow: hidden;
	}

	.arc span {
		writing-mode: vertical-rl;
		font-size: 0.58rem;
		font-weight: 600;
		color: var(--fg-faint);
		white-space: nowrap;
	}

	.timeless {
		display: flex;
		flex-direction: column;
		gap: 3px;
		height: var(--timeless);
		padding: 4px;
		box-sizing: border-box;
		border-top: 1px solid var(--hairline);
	}

	.chip {
		overflow: hidden;
		padding: 0.05rem 0.3rem;
		border-radius: 3px;
		background: color-mix(in srgb, var(--fg) 7%, transparent);
		font-size: 0.62rem;
		color: var(--fg-dim);
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chip:hover {
		color: var(--gold);
	}

	.fold-line {
		position: absolute;
		left: 0;
		right: 0;
		border-top: 1px dashed var(--hairline);
	}

	.band {
		position: absolute;
		left: 0;
		right: 0;
		background: color-mix(in srgb, var(--gold) 9%, transparent);
		border-block: 1px solid color-mix(in srgb, var(--gold) 35%, transparent);
		pointer-events: none;
	}

	/* —— Bars —— */
	.item {
		position: absolute;
		box-sizing: border-box;
		border-left: 3px solid var(--tone);
		border-radius: 3px;
		background: color-mix(in srgb, var(--tone) 16%, var(--bg));
		transition:
			opacity 0.18s var(--ease),
			box-shadow 0.18s var(--ease);
	}

	.item.flash {
		border-left-style: dashed;
		background:
			repeating-linear-gradient(135deg, color-mix(in srgb, var(--tone) 14%, transparent) 0 4px, transparent 4px 9px),
			color-mix(in srgb, var(--tone) 8%, var(--bg));
	}

	.item.on {
		z-index: 2;
		box-shadow: 0 0 0 1px var(--tone);
	}

	.dim {
		opacity: 0.16;
		filter: saturate(0.2);
	}

	.label {
		position: sticky;
		top: calc(var(--head) + 2px);
		z-index: 1;
		display: grid;
		gap: 0;
		padding: 0.15rem 0.3rem;
		color: inherit;
		text-decoration: none;
	}

	.line {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		min-width: 0;
	}

	.num {
		flex: 0 0 auto;
		font-size: 0.56rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.chip .num {
		margin-right: 0.3rem;
	}

	.title {
		overflow: hidden;
		font-family: var(--serif);
		font-size: 0.7rem;
		font-weight: 600;
		line-height: 1.15;
		color: var(--fg-strong);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.label:is(:hover, :focus-visible) .title {
		color: var(--gold);
	}

	.years {
		font-size: 0.56rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
	}

	.story {
		position: absolute;
		left: 0;
		right: 0;
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		box-sizing: border-box;
		padding: 0.1rem 0.3rem 0;
		border-top: 1px solid color-mix(in srgb, var(--tone) 45%, transparent);
		color: var(--fg-dim);
		text-decoration: none;
	}

	/* The first story starts under the episode's own label. */
	.story.first {
		padding-top: 1.75rem;
		border-top-color: transparent;
	}

	.story-name {
		overflow: hidden;
		font-size: 0.58rem;
		font-style: italic;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.story-year {
		flex: none;
		font-size: 0.5rem;
		font-variant-numeric: tabular-nums;
		opacity: 0.7;
	}

	.story:hover {
		background: color-mix(in srgb, var(--tone) 14%, transparent);
		color: var(--fg-strong);
	}

	.marker {
		position: absolute;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--tone);
		box-shadow: 0 0 0 2px var(--bg);
		transition: opacity 0.18s var(--ease);
	}

	.link {
		position: absolute;
		border-left: 1px dashed color-mix(in srgb, var(--fg) 25%, transparent);
		pointer-events: none;
		transition: opacity 0.18s var(--ease);
	}

	@media (prefers-reduced-motion: reduce) {
		.item,
		.marker,
		.link {
			transition: none;
		}
	}

	:global(body:has(.timeline-page) .nav-blur) {
		display: none;
	}
</style>
