<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import {
		DEFAULT_LIVES,
		LIVES_Y,
		layoutLives,
		lifeYears,
		sameWho,
		searchDated,
		strokeWidth,
		suggestedPeople,
		type LifeLane,
		type LifeMeet
	} from '$lib/lifeIntersects';
	import { koreanOf, type Person } from '$lib/people';
	import { TIMELINE, yearLabel, type TimelineEvent } from '$lib/timeline';

	let {
		ids,
		ko = false,
		onids,
		pinned = null,
		onpin,
		pointerY = null,
		scroller = undefined
	}: {
		ids: string[];
		ko?: boolean;
		onids: (ids: string[]) => void;
		pinned?: TimelineEvent | null;
		onpin?: (e: TimelineEvent | null) => void;
		pointerY?: number | null;
		scroller?: HTMLDivElement;
	} = $props();

	const SNAP_PX = 10;

	let query = $state('');
	let hoverId = $state<string | null>(null);
	let focusId = $state<string | null>(null);
	let unpinTimer: ReturnType<typeof setTimeout> | undefined;

	let board = $derived(layoutLives(ids));
	let hits = $derived(searchDated(query));
	let allOn = $derived(sameWho(ids, DEFAULT_LIVES));
	let suggestions = $derived(
		allOn ? [] : suggestedPeople().filter((p) => !ids.includes(p.id)).slice(0, 6)
	);
	let taken = $derived(new Set(ids));
	let people = $derived(new Map(board.lanes.map((lane) => [lane.person.id, lane.person])));
	let compact = $derived(board.lanes.length > 10);
	let ink = $derived(strokeWidth(board.lanes.length));
	let named = $derived(board.lanes.length <= 12);

	let hotMeet = $derived.by((): LifeMeet | null => {
		if (hoverId) return board.meets.find((m) => m.id === hoverId) ?? null;
		if (pinned) return board.meets.find((m) => m.id === pinned.id) ?? null;
		if (pointerY === null) return null;
		let best: LifeMeet | null = null;
		for (const m of board.meets) {
			const d = Math.abs(m.top - pointerY);
			if (d <= SNAP_PX && (!best || d < Math.abs(best.top - pointerY))) best = m;
		}
		return best;
	});

	function labelOf(p: Person): string {
		return ko ? (koreanOf(p) ?? p.name) : p.name;
	}

	function nameOfId(id: string): string {
		const p = people.get(id);
		return p ? labelOf(p) : id;
	}

	function meetX(m: LifeMeet): number {
		const xs = m.people.flatMap((id) => {
			const lane = board.lanes.find((l) => l.person.id === id);
			return lane ? [lane.x] : [];
		});
		return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
	}

	function faded(id: string): boolean {
		if (focusId) return focusId !== id && !hotMeet?.people.includes(id);
		return !!hotMeet && !hotMeet.people.includes(id);
	}

	function showName(id: string): boolean {
		if (named) return true;
		if (focusId === id) return true;
		return !!hotMeet?.people.includes(id);
	}

	function scrollToLane(lane: LifeLane) {
		if (!scroller) return;
		scroller.scrollTo({
			left: Math.max(0, lane.x - 96),
			top: Math.max(0, lane.bornTop - 72),
			behavior: 'smooth'
		});
	}

	function focusLane(id: string) {
		const lane = board.lanes.find((l) => l.person.id === id);
		focusId = id;
		if (lane) scrollToLane(lane);
	}

	function add(person: Person) {
		if (taken.has(person.id)) {
			focusLane(person.id);
			query = '';
			return;
		}
		onids([...ids, person.id]);
		query = '';
	}

	function remove(id: string) {
		onids(ids.filter((x) => x !== id));
		if (focusId === id) focusId = null;
	}

	function submitSearch() {
		const first = hits[0];
		if (first) add(first);
	}

	function pinMeet(e: TimelineEvent | null) {
		clearTimeout(unpinTimer);
		if (e) {
			onpin?.(e);
			return;
		}
		unpinTimer = setTimeout(() => onpin?.(null), 140);
	}

	function meetLabel(m: LifeMeet): string {
		const title = ko ? m.title.ko : m.title.en;
		return `${yearLabel(m.year, ko)} · ${title}`;
	}
</script>

<section class={['lives', { dense: compact }]} style:width="{Math.max(board.width, 340)}px" aria-label={ko ? '삶' : 'Lives'}>
	<header class="head lives-picker">
		<div class="chips" role="list">
			<span class="count">{board.lanes.length}{ko ? '명' : ' lives'}</span>
			{#if !allOn}
				<button type="button" class="hint all" onclick={() => onids(DEFAULT_LIVES.slice())}>
					{ko ? '모두' : 'Show all'}
				</button>
				{#each board.lanes as lane (lane.person.id)}
					<div class={['chip', { on: focusId === lane.person.id }]} role="listitem" style:--c={lane.color}>
						<button type="button" class="face" onclick={() => focusLane(lane.person.id)}>
							<Avatar person={lane.person} year={lane.born} size={compact ? '1.1rem' : '1.35rem'} interactive={false} />
							{#if !compact}
								<span class="chip-text">
									<span class="chip-name">{labelOf(lane.person)}</span>
									<span class="chip-years">{lifeYears(lane.person, ko)}</span>
								</span>
							{/if}
						</button>
						<button
							type="button"
							class="drop"
							aria-label="{ko ? '빼기' : 'Remove'} {labelOf(lane.person)}"
							onclick={() => remove(lane.person.id)}
						>
							×
						</button>
					</div>
				{/each}
			{/if}
		</div>

		<div class="find">
			<input
				type="search"
				bind:value={query}
				placeholder={ko ? '이름 검색' : 'Find a person'}
				aria-label={ko ? '인물 검색' : 'Search people'}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						submitSearch();
					}
				}}
			/>
			{#if hits.length}
				<ul class="hits" role="listbox">
					{#each hits as person (person.id)}
						<li role="option" aria-selected="false">
							<button type="button" onclick={() => add(person)}>
								<Avatar {person} size="1.2rem" interactive={false} />
								<span>{labelOf(person)}</span>
								<small>{taken.has(person.id) ? (ko ? '보기' : 'on board') : lifeYears(person, ko)}</small>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if suggestions.length}
			<div class="suggest" role="group" aria-label={ko ? '추천' : 'Suggested'}>
				{#each suggestions as person (person.id)}
					<button type="button" class="hint" onclick={() => add(person)}>
						{labelOf(person)}
					</button>
				{/each}
			</div>
		{/if}

		{#if !compact && board.pairs.length}
			<p class="pairs">
				{#each board.pairs as pair (pair.a + ':' + pair.b)}
					<span>{nameOfId(pair.a)} · {ko ? pair.label.ko : pair.label.en} · {nameOfId(pair.b)}</span>
				{/each}
			</p>
		{/if}
	</header>

	<div class="body" style:height="{board.height}px">
		{#each TIMELINE.breaks as g (g.from)}
			<div class="fold-line" style:top="{g.top * LIVES_Y}px" aria-hidden="true"></div>
		{/each}

		<svg
			class="strokes"
			width={board.width}
			height={board.height}
			viewBox="0 0 {board.width} {board.height}"
			aria-hidden="true"
		>
			{#each board.lanes as lane (lane.person.id)}
				<g class={{ dim: faded(lane.person.id) }} style:--c={lane.color}>
					<path
						d={lane.d}
						fill="none"
						stroke="var(--c)"
						stroke-width={ink}
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<circle class="birth" cx={lane.x} cy={lane.bornTop} r={Math.max(1.6, ink)} fill="var(--c)" />
					<line
						class="death"
						x1={lane.x - 4}
						y1={lane.diedTop}
						x2={lane.x + 4}
						y2={lane.diedTop}
						stroke="var(--c)"
						stroke-width={Math.max(1, ink * 0.7)}
						stroke-linecap="round"
					/>
					{#each lane.ticks as tick (`${lane.person.id}:${tick.year}:${tick.label}`)}
						<line
							class="life-tick"
							x1={lane.x - 2}
							y1={tick.top}
							x2={lane.x + 2}
							y2={tick.top}
							stroke="var(--c)"
							stroke-width="1.1"
							stroke-linecap="round"
						>
							<title>{tick.label} · {yearLabel(tick.year, ko)}</title>
						</line>
					{/each}
				</g>
			{/each}
		</svg>

		{#each board.lanes as lane (lane.person.id)}
			{#if showName(lane.person.id)}
				<span
					class={['born-name', { dim: faded(lane.person.id) }]}
					style:left="{lane.x}px"
					style:top="{lane.bornTop}px"
					style:--c={lane.color}
				>
					{labelOf(lane.person)}
				</span>
			{/if}
		{/each}

		{#each board.meets as meet (meet.id)}
			<button
				type="button"
				class={['meet', { on: hotMeet?.id === meet.id }]}
				style:left="{meetX(meet)}px"
				style:top="{meet.top}px"
				aria-label={meetLabel(meet)}
				title={meetLabel(meet)}
				onpointerenter={() => {
					hoverId = meet.id;
					if (meet.event) pinMeet(meet.event);
				}}
				onpointerleave={() => {
					hoverId = null;
					pinMeet(null);
				}}
				onclick={() => {
					if (meet.event) pinMeet(meet.event);
				}}
			></button>
		{/each}
	</div>
</section>

<style lang="scss">
	.lives {
		flex: 0 0 auto;
		border-right: 1px solid var(--hairline);
		background: var(--bg);
		color: var(--fg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
	}

	.head {
		position: sticky;
		top: 0;
		z-index: 6;
		box-sizing: border-box;
		height: var(--head);
		padding: 0.28rem 0.4rem 0.22rem;
		overflow: visible;
		background: var(--bg);
		border-bottom: 1px solid var(--hairline);
	}

	.lives-picker {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(7.5rem, 11rem);
		align-content: start;
		gap: 0.16rem 0.45rem;
	}

	.chips {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.2rem 0.3rem;
		max-height: 2.15rem;
		overflow: auto;
	}

	.count {
		flex: none;
		font-size: 0.58rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
		white-space: nowrap;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.12rem;
		max-width: 100%;
		padding: 0.05rem 0.12rem 0.05rem 0.08rem;
		border: 1px solid color-mix(in srgb, var(--c) 45%, var(--hairline));
		border-radius: 999px;
		background: color-mix(in srgb, var(--c) 12%, transparent);
		&.on {
			border-color: var(--gold);
		}
	}

	.face {
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		min-width: 0;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.chip-text {
		display: grid;
		min-width: 0;
		line-height: 1.1;
	}

	.chip-name {
		overflow: hidden;
		font-family: var(--serif);
		font-size: 0.66rem;
		font-weight: 600;
		color: var(--fg-strong);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chip-years {
		font-size: 0.52rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
	}

	.drop {
		flex: none;
		width: 1rem;
		height: 1rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: var(--fg-dim);
		font: inherit;
		font-size: 0.78rem;
		line-height: 1;
		cursor: pointer;
		&:hover, &:focus-visible {
			color: var(--gold);
		}
	}

	.find {
		position: relative;
		& input {
			box-sizing: border-box;
			width: 100%;
			padding: 0.12rem 0.4rem;
			border: 1px solid var(--hairline);
			border-radius: 4px;
			background: color-mix(in srgb, var(--bg) 88%, transparent);
			color: var(--fg);
			font: inherit;
			font-size: 0.62rem;
			&:focus {
				outline: 1px solid var(--gold);
				border-color: var(--gold);
			}
		}
	}

	.hits {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 6;
		margin: 0;
		padding: 0.15rem 0;
		list-style: none;
		border: 1px solid var(--hairline);
		border-radius: 4px;
		background: color-mix(in srgb, var(--bg) 96%, transparent);
		box-shadow: 0 4px 14px rgb(0 0 0 / 0.28);
		& button {
			display: flex;
			align-items: center;
			gap: 0.35rem;
			width: 100%;
			padding: 0.18rem 0.4rem;
			border: none;
			background: transparent;
			color: inherit;
			font: inherit;
			font-size: 0.66rem;
			text-align: left;
			cursor: pointer;
			&:hover, &:focus-visible {
				background: color-mix(in srgb, var(--gold) 12%, transparent);
			}
		}
		& small {
			margin-left: auto;
			font-size: 0.52rem;
			font-variant-numeric: tabular-nums;
			color: var(--fg-dim);
		}
	}

	.suggest,
	.pairs {
		grid-column: 1 / -1;
	}

	.suggest {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.35rem;
	}

	.hint {
		padding: 0;
		border: none;
		background: none;
		color: var(--fg-faint);
		font: inherit;
		font-size: 0.58rem;
		cursor: pointer;
		&.all {
			color: var(--gold);
			font-weight: 600;
			white-space: nowrap;
		}
		&:hover, &:focus-visible {
			color: var(--gold);
		}
	}

	.pairs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.7rem;
		margin: 0;
		font-size: 0.58rem;
		color: var(--fg-dim);
		& span {
			white-space: nowrap;
		}
	}

	.body {
		position: relative;
	}

	.fold-line {
		position: absolute;
		left: 0;
		right: 0;
		border-top: 1px dashed var(--hairline);
	}

	.strokes {
		display: block;
		overflow: visible;
	}

	.dim {
		opacity: 0.16;
		filter: saturate(0.2);
		transition: opacity 0.18s var(--ease), filter 0.18s var(--ease);
	}

	.born-name {
		position: absolute;
		z-index: 1;
		padding-left: 0.45rem;
		transform: translate(-0.15rem, -1.15em);
		font-family: var(--serif);
		font-size: 0.62rem;
		font-weight: 600;
		color: var(--c);
		white-space: nowrap;
		pointer-events: none;
		transition: opacity 0.18s var(--ease);
		.dense & {
			font-size: 0.52rem;
		}
	}

	.meet {
		position: absolute;
		z-index: 5;
		width: 16px;
		height: 16px;
		padding: 0;
		border: none;
		background: transparent;
		transform: translate(-50%, -50%);
		cursor: pointer;
		&::after {
			content: '';
			position: absolute;
			left: 50%;
			top: 50%;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background: var(--gold);
			box-shadow: 0 0 0 1.5px var(--bg);
			transform: translate(-50%, -50%);
		}
		&:focus-visible::after, &.on::after {
			width: 10px;
			height: 10px;
			box-shadow: 0 0 0 1.5px var(--bg), 0 0 0 3px color-mix(in srgb, var(--gold) 75%, transparent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dim,
		.born-name {
			transition: none;
		}
	}
</style>
