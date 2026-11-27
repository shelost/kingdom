<script lang="ts">
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { plateTab, reading } from '$lib/reading.svelte';
	import {
		BONDS,
		AXIS,
		CLASHES,
		END,
		FAMILIES,
		LANE_ORDER,
		MARKS,
		START,
		factionById,
		related,
		yearPct,
		type Faction,
		type FactionId,
		type Mark
	} from '$lib/breaking/factions';

	let picked = $state<FactionId | null>(null);
	let markId = $state<string | null>(null);

	const lanes = $derived(LANE_ORDER.map((id) => factionById(id)));
	const listed = $derived([...MARKS].sort((a, b) => a.year - b.year || a.en.localeCompare(b.en)));
	const active = $derived(MARKS.find((m) => m.id === markId) ?? null);
	const throne = factionById('throne');

	function dim(id: FactionId): boolean {
		return picked !== null && !related(picked, id);
	}

	function pick(id: FactionId) {
		picked = picked === id ? null : id;
		if (picked && active && !related(picked, active.faction)) markId = null;
	}

	function choose(mark: Mark) {
		markId = mark.id;
		picked = mark.faction;
	}

	function nudge(mark: Mark): number {
		const same = MARKS.filter((m) => m.faction === mark.faction && m.year === mark.year);
		const i = same.findIndex((m) => m.id === mark.id);
		return (i - (same.length - 1) / 2) * 16;
	}
</script>

{#snippet t(en: string, ko: string)}
	{#if reading.lang === 'ko'}
		{ko}
	{:else}
		{en}
		{#if reading.lang === 'both'}
			<span class="alt" lang="ko">{ko}</span>
		{/if}
	{/if}
{/snippet}

{#snippet card(f: Faction)}
	<button
		type="button"
		class={['card', { on: picked === f.id, dim: dim(f.id) }]}
		style:--c={f.hex}
		aria-pressed={picked === f.id}
		onclick={() => pick(f.id)}
	>
		<p class="years">{f.years}</p>
		<h3>{@render t(f.en, f.ko)}</h3>
		<p class="also">{reading.lang === 'ko' ? f.alsoKo : f.alsoEn}</p>
		<p class="want">{@render t(f.wantEn, f.wantKo)}</p>
		<p class="people">
			{#each f.people as person, i (person.en)}
				{i > 0 ? ' · ' : ''}{reading.lang === 'ko' ? person.ko : person.en}
			{/each}
		</p>
	</button>
{/snippet}

<svelte:head>
	<title>{plateTab('Breaking', '대한사람')} · {plateTab('Factions', '세력')} · {plateTab('King for All', '삼한왕검')}</title>
	<meta
		name="description"
		content="Gaehwadang, the Independence Club, and Wijeong Cheoksa: who split, who inherited whom, and who never met, 1876–1910."
	/>
</svelte:head>

<main class="page">
	<SiteNavSpace />
	<header class="head">
		<p class="eyebrow">
			<a href={resolve('/stories/our-land')}>{plateTab('Breaking', '대한사람')}</a>
			· {plateTab('Guhanmal', '구한말')}
		</p>
		<h1>{plateTab('Factions', '세력')}</h1>
		<p class="lede">
			{@render t(
				'Three names, and the rooms between them. The reform party takes a weekend. The Club is that party, twelve years later, legal, and gone in two years. The traditionalists call both a disease, and later take the hills.',
				'이름 셋, 그리고 그 사이의 방들. 개화당은 주말 하나를 가진다. 협회는 그 당이 열두 해 뒤, 합법으로, 두 해 만에 사라지는 것이다. 위정척사는 둘 다를 병이라 부르다, 나중에 산으로 간다.'
			)}
		</p>
		<p class="span">{START}–{END}</p>
	</header>

	<div class="families">
		{#if FAMILIES[0]}
			<section class="family" aria-label={reading.lang === 'ko' ? FAMILIES[0].ko : FAMILIES[0].en}>
				<h2>{@render t(FAMILIES[0].en, FAMILIES[0].ko)}</h2>
				<div class="stack">
					{#each FAMILIES[0].ids as id (id)}
						{@render card(factionById(id))}
					{/each}
				</div>
			</section>
		{/if}
		<p class="between">
			{@render t(
				'1894. One spring. Kim Ok-gyun is shot in Shanghai. Gobu rises. They never meet.',
				'1894. 한 봄. 김옥균은 상하이에서 총에 맞고, 고부가 일어난다. 만나지 않는다.'
			)}
		</p>
		{#if FAMILIES[1]}
			<section class="family" aria-label={reading.lang === 'ko' ? FAMILIES[1].ko : FAMILIES[1].en}>
				<h2>{@render t(FAMILIES[1].en, FAMILIES[1].ko)}</h2>
				<div class="stack">
					{#each FAMILIES[1].ids as id (id)}
						{@render card(factionById(id))}
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<div class="palace">
		{@render card(throne)}
		<ul class="outside">
			<li>
				{@render t(
					'Qing sits in the palace after Imo.',
					'임오 뒤 청이 궁에 앉는다.'
				)}
			</li>
			<li>
				{@render t(
					'Japan is the lever in 1884, and the master after 1905.',
					'일본은 1884년의 지렛대이고, 1905년 이후의 주인이다.'
				)}
			</li>
			<li>
				{@render t(
					'Russia is the room he runs to in 1896.',
					'러시아는 1896년 그가 도망친 방이다.'
				)}
			</li>
		</ul>
	</div>

	<section class="bonds" aria-label={plateTab('Relationships', '관계')}>
		<h2>{plateTab('What passes between them', '그 사이를 지나는 것')}</h2>
		<ul>
			{#each BONDS as bond (bond.en)}
				<li class={{ dim: picked !== null && bond.a !== picked && bond.b !== picked }}>
					<span class="pair">
						<i style:background={factionById(bond.a).hex}></i>
						<i style:background={factionById(bond.b).hex}></i>
					</span>
					{@render t(bond.en, bond.ko)}
				</li>
			{/each}
		</ul>
	</section>

	<section class="when" aria-label={plateTab('Timeline', '연표')}>
		<h2>{plateTab('The same years', '같은 해')}</h2>
		<p class="hint">
			{@render t(
				'A lane is a faction. A mark is a year it acts. The pale lines are the seasons when more than one of them is in the room.',
				'한 줄이 한 세력이다. 점이 그 세력이 움직이는 해다. 옅은 선은 둘 이상이 같은 방에 있는 계절이다.'
			)}
		</p>
		<div class="board">
			<div class="axis">
				<div class="gutter"></div>
				<div class="track">
					{#each AXIS as year (year)}
						<span class="tick" style:left="{yearPct(year)}%">{year}</span>
					{/each}
				</div>
			</div>
			{#each lanes as lane (lane.id)}
				<div class={['lane', { dim: dim(lane.id) }]}>
					<button type="button" class="gutter" style:--c={lane.hex} aria-pressed={picked === lane.id} onclick={() => pick(lane.id)}>
						{@render t(lane.en, lane.ko)}
					</button>
					<div class="track">
						{#each CLASHES as year (year)}
							<span class="clash" style:left="{yearPct(year)}%"></span>
						{/each}
						{#each MARKS.filter((m) => m.faction === lane.id) as mark (mark.id)}
							<button
								type="button"
								class={['dot', { on: markId === mark.id }]}
								style:left="{yearPct(mark.year)}%"
								style:--nudge="{nudge(mark)}px"
								style:--c={lane.hex}
								aria-label="{mark.year}. {reading.lang === 'ko' ? mark.ko : mark.en}"
								onclick={() => choose(mark)}
							></button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		<p class="reading">
			{#if active}
				<span class="y">{active.year}</span>
				{@render t(active.en, active.ko)}
			{:else}
				{@render t(
					'Choose a mark. The line under the chart says what that year did.',
					'점을 고르면, 도표 아래 줄이 그 해가 한 일을 말한다.'
				)}
			{/if}
		</p>
		<ol class="beats">
			{#each listed as mark (mark.id)}
				<li class={{ dim: picked !== null && !related(picked, mark.faction) }}>
					<button type="button" class={{ on: markId === mark.id }} onclick={() => choose(mark)}>
						<span class="y">{mark.year}</span>
						<i style:background={factionById(mark.faction).hex}></i>
						{@render t(mark.en, mark.ko)}
					</button>
				</li>
			{/each}
		</ol>
	</section>
</main>

<style>
	.page {
		max-width: 76rem;
		margin: 0 auto;
		padding: 0 1.25rem 5rem;
		color: var(--fg);
	}
	.eyebrow {
		margin: 0.5rem 0 0;
		font-size: 0.82rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}
	.eyebrow a {
		color: var(--gold);
		text-decoration: none;
	}
	h1 {
		margin: 0.35rem 0 0;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3.4rem);
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.lede {
		max-width: 42rem;
		margin: 0.8rem 0 0;
		font-size: 1.08rem;
		line-height: 1.45;
	}
	.span {
		margin: 0.4rem 0 0;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
	}
	.alt {
		display: block;
		margin-top: 0.15rem;
		color: var(--fg-dim);
		font-size: 0.86em;
		line-height: 1.4;
	}
	h2 {
		margin: 0 0 0.75rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}
	.families {
		display: grid;
		gap: 1rem;
		margin-top: 2rem;
	}
	.family {
		min-width: 0;
	}
	.stack {
		display: grid;
		gap: 0.55rem;
	}
	.between {
		margin: 0;
		padding: 0.9rem 1rem;
		border-left: 2px solid var(--gold);
		background: var(--panel);
		line-height: 1.45;
	}
	.card {
		display: block;
		width: 100%;
		margin: 0;
		padding: 0.85rem 0.95rem 0.95rem;
		border: 1px solid var(--hairline);
		border-left: 3px solid var(--c);
		border-radius: var(--radius);
		background: var(--panel);
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.card.on {
		border-color: var(--c);
		background: color-mix(in srgb, var(--c) 16%, var(--panel));
	}
	.card.dim,
	.lane.dim,
	.bonds li.dim,
	.beats li.dim {
		opacity: 0.38;
	}
	.years,
	.also {
		margin: 0;
		color: var(--fg-faint);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
	}
	.card h3 {
		margin: 0.15rem 0 0;
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 500;
	}
	.want,
	.people {
		margin: 0.45rem 0 0;
		line-height: 1.4;
	}
	.people {
		color: var(--fg-dim);
		font-size: 0.88rem;
	}
	.palace {
		margin-top: 1rem;
	}
	.outside {
		display: grid;
		gap: 0.4rem;
		margin: 0.55rem 0 0;
		padding: 0;
		list-style: none;
		color: var(--fg-dim);
		font-size: 0.92rem;
	}
	.bonds {
		margin-top: 2.5rem;
	}
	.bonds ul,
	.beats {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.bonds li {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.7rem;
		align-items: start;
		padding: 0.55rem 0;
		border-top: 1px solid var(--hairline);
		line-height: 1.4;
	}
	.pair {
		display: flex;
		gap: 0.2rem;
		padding-top: 0.35rem;
	}
	.pair i,
	.beats i {
		display: block;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 99px;
	}
	.when {
		margin-top: 2.5rem;
	}
	.hint {
		margin: 0 0 0.8rem;
		color: var(--fg-dim);
	}
	.board {
		overflow-x: auto;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: var(--panel-sunken);
	}
	.axis,
	.lane {
		display: grid;
		grid-template-columns: 10.2rem minmax(40rem, 1fr);
	}
	.gutter {
		position: sticky;
		left: 0;
		z-index: 1;
		background: var(--bg);
		border-right: 1px solid var(--hairline);
	}
	.axis .gutter {
		min-height: 1.6rem;
	}
	.lane .gutter {
		margin: 0;
		padding: 0 0.55rem;
		border-top: 0;
		border-bottom: 0;
		border-left: 3px solid var(--c);
		color: inherit;
		font: inherit;
		font-size: 0.78rem;
		text-align: left;
		cursor: pointer;
	}
	.lane .gutter .alt {
		display: block;
	}
	.track {
		position: relative;
		min-height: 2.8rem;
	}
	.tick {
		position: absolute;
		top: 0.35rem;
		transform: translateX(-50%);
		color: var(--fg-faint);
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
	}
	.clash {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--hairline);
		pointer-events: none;
	}
	.dot {
		position: absolute;
		top: 50%;
		width: 0.7rem;
		height: 0.7rem;
		margin: 0;
		padding: 0;
		border: 0;
		border-radius: 99px;
		background: var(--c);
		transform: translate(calc(-50% + var(--nudge)), -50%);
		cursor: pointer;
	}
	.dot.on {
		outline: 2px solid var(--fg);
		outline-offset: 2px;
	}
	.reading {
		min-height: 2.6rem;
		margin: 0.8rem 0 0;
		line-height: 1.45;
	}
	.reading .y,
	.beats .y {
		margin-right: 0.45rem;
		color: var(--gold);
		font-variant-numeric: tabular-nums;
	}
	.beats {
		margin-top: 0.4rem;
	}
	.beats button {
		display: grid;
		grid-template-columns: 3rem 0.7rem 1fr;
		gap: 0.55rem;
		align-items: start;
		width: 100%;
		margin: 0;
		padding: 0.45rem 0;
		border: 0;
		border-top: 1px solid var(--hairline);
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		line-height: 1.4;
		cursor: pointer;
	}
	.beats button.on {
		color: var(--fg-strong);
	}
	.beats i {
		margin-top: 0.4rem;
	}
	@media (min-width: 900px) {
		.families {
			grid-template-columns: 1fr 16rem 1fr;
			align-items: stretch;
		}
		.between {
			align-self: center;
		}
		.outside {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
	@media (max-width: 720px) {
		.page {
			padding-bottom: 8rem;
		}
		.axis,
		.lane {
			grid-template-columns: 6.4rem minmax(36rem, 1fr);
		}
		.card h3 {
			font-size: 1.2rem;
		}
	}
</style>
