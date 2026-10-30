<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import MapTimelapse from '$lib/components/MapTimelapse.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { reading } from '$lib/reading.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import {
		WORLD_CENSUS,
		WORLD_EPISODES,
		WORLD_KINGDOMS,
		WORLD_KINDS,
		WORLD_LAYERS,
		WORLD_RANGE,
		WORLD_SPINE,
		WORLD_WORDS,
		type WorldCopy
	} from '$lib/worldAtlas';

	let ko = $derived(reading.lang === 'ko');

	function t(c: WorldCopy): string {
		return ko ? c.ko : c.en;
	}

	function n(v: number): string {
		return v.toLocaleString(ko ? 'ko-KR' : 'en-US');
	}

	function href(path: string): string {
		const [base, q] = path.split('?');
		const resolved = resolve((base || '/') as '/');
		return hrefWithNsfw(q ? `${resolved}?${q}` : resolved, page.url);
	}
</script>

<svelte:head>
	<title>{ko ? '세계' : 'World'} · King for All</title>
	<meta
		name="description"
		content={ko
			? '삼한왕검의 세계: 이야기, 땅, 사람, 그림, 시간, 기록이 한 앱 안에 들어 있다.'
			: 'The world of King for All: the chronicle, the land, the people, the pictures, time and the record, in one app.'}
	/>
</svelte:head>

<main class="world">
	<SiteNavSpace />

	<div class="column">
		<header class="intro">
			<p class="kicker">{ko ? '삼한왕검' : 'King for All'}</p>
			<h1>{ko ? '세계' : 'World'}</h1>
			<p class="lede">
				{ko
					? '이 앱이 세계다. 스크립트, 책 표지, 위키, 연표, 지도, 장면이 따로 노는 도구가 아니라, 한 나라의 방들이다.'
					: 'This app is the world. The script, the covers, the wiki, the timeline, the map and the stills are not separate tools. They are rooms of one country.'}
			</p>
			<p class="meta">
				<span>{WORLD_RANGE}</span>
				<span class="sep" aria-hidden="true">·</span>
				<span>{n(WORLD_EPISODES)} {ko ? '화' : 'episodes'}</span>
				<span class="sep" aria-hidden="true">·</span>
				<span>{n(WORLD_WORDS)} {ko ? '단어' : 'words'}</span>
			</p>
		</header>

		<a class="map-door" href={href('/map')} aria-label={ko ? '지도 열기' : 'Open the map'}>
			<MapTimelapse {ko} />
		</a>

		<dl class="census">
			{#each WORLD_CENSUS as row (row.unit.en)}
				<div class="stat">
					<dt>{n(row.n)}</dt>
					<dd>{t(row.unit)}</dd>
				</div>
			{/each}
		</dl>

		<section class="block" aria-labelledby="spine-h">
			<h2 id="spine-h">{ko ? '부의 뼈대' : 'The spine'}</h2>
			<ol class="spine">
				{#each WORLD_SPINE as part (part.id)}
					<li>
						<a href="{href('/episodes')}#part-{part.id}">
							<span class="spine-label">{part.label}</span>
							<span class="spine-title">{ko ? part.korean || part.title : part.title || part.korean}</span>
							<span class="spine-meta">
								{part.range}
								<span aria-hidden="true">·</span>
								{n(part.count)}{ko ? '화' : ''}
							</span>
						</a>
					</li>
				{/each}
			</ol>
		</section>

		<section class="block" aria-labelledby="kingdoms-h">
			<h2 id="kingdoms-h">{ko ? '나라' : 'Kingdoms'}</h2>
			<ul class="kingdoms">
				{#each WORLD_KINGDOMS as k (k.id)}
					<li>
						<a href={href(`/wiki?kingdom=${k.id}`)} style:--kingdom={k.color}>
							{#if k.flag}
								<img src={staticAsset(k.flag)} alt="" width="28" height="18" />
							{/if}
							<span class="k-name">{ko ? k.korean || k.label : k.label}</span>
							<span class="k-count">{n(k.people)}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		{#each WORLD_LAYERS as layer (layer.id)}
			<section class={['block', 'layer', { workshop: layer.id === 'workshop' }]} aria-labelledby="layer-{layer.id}">
				<h2 id="layer-{layer.id}">{t(layer.title)}</h2>
				<p class="note">{t(layer.note)}</p>
				<ul class="doors">
					{#each layer.doors as door (door.href)}
						<li>
							<a href={href(door.href)}>
								<span class="material-symbols-outlined" aria-hidden="true">{door.icon}</span>
								<span class="door-copy">
									<span class="door-title">{t(door.title)}</span>
									<span class="door-lede">{t(door.lede)}</span>
									{#if door.count != null}
										<span class="door-count">
											{n(door.count)}
											{door.unit ? t(door.unit) : ''}
										</span>
									{/if}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}

		<section class="block" aria-labelledby="kinds-h">
			<h2 id="kinds-h">{ko ? '위키의 권' : 'Wiki volumes'}</h2>
			<p class="note">
				{ko
					? '백과는 종류별로 한 권이다. 숫자를 누르면 그 권으로 간다.'
					: 'The encyclopedia is bound by kind. A number opens that volume.'}
			</p>
			<ul class="kinds">
				{#each WORLD_KINDS as kind (kind.id)}
					<li>
						<a href={href(kind.href)}>
							<span class="kind-title">{ko ? kind.ko : kind.title}</span>
							<span class="kind-n">{n(kind.count)}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</main>

<style>
	.world {
		min-height: 100svh;
		padding-bottom: calc(3rem + var(--tabbar-space, 0px));
	}

	.column {
		max-width: 52rem;
		margin: 0 auto;
		padding: 0.5rem 1.2rem 4rem;
	}

	.intro {
		display: grid;
		gap: 0.55rem;
		margin: 0 0 1.6rem;
	}

	.kicker {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(2.1rem, 5vw, 3.1rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display, -0.02em);
		line-height: 1.05;
		color: var(--fg-strong);
	}

	.lede {
		margin: 0.35rem 0 0;
		max-width: 38rem;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--fg-dim);
	}

	.meta {
		margin: 0.35rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.55rem;
		font-size: 0.82rem;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
	}

	.sep {
		color: var(--hairline);
	}

	.map-door {
		display: block;
		height: min(46svh, 30rem);
		margin: 0 0 1.75rem;
		overflow: hidden;
		color: inherit;
		text-decoration: none;
		background: var(--panel-sunken);
		border: 1px solid var(--hairline);
		border-radius: var(--widget-radius);
		transition: border-color 0.2s var(--ease, ease);
	}

	.map-door:hover,
	.map-door:focus-visible {
		border-color: color-mix(in srgb, var(--gold) 55%, var(--hairline));
		outline: none;
	}

	.census {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem 1rem;
		margin: 0 0 2.4rem;
	}

	.stat {
		display: grid;
		gap: 0.15rem;
	}

	.stat dt {
		font-family: var(--serif);
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
	}

	.stat dd {
		margin: 0;
		font-size: 0.75rem;
		color: var(--fg-faint);
	}

	.block {
		margin: 0 0 2.4rem;
	}

	h2 {
		margin: 0 0 0.4rem;
		font-family: var(--serif);
		font-size: 1.28rem;
		font-weight: 600;
		letter-spacing: var(--tracking-display, -0.02em);
		color: var(--fg-strong);
	}

	.note {
		margin: 0 0 0.9rem;
		max-width: 36rem;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.spine,
	.kingdoms,
	.doors,
	.kinds {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.spine {
		display: grid;
		gap: 0.35rem;
	}

	.spine a,
	.kingdoms a,
	.doors a,
	.kinds a {
		display: flex;
		align-items: baseline;
		gap: 0.65rem;
		padding: 0.55rem 0.15rem;
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid var(--hairline);
		transition: color 0.15s var(--ease, ease);
	}

	.spine a:hover .spine-title,
	.doors a:hover .door-title,
	.kinds a:hover .kind-title,
	.kingdoms a:hover .k-name {
		color: var(--gold);
	}

	.spine a:focus-visible,
	.kingdoms a:focus-visible,
	.doors a:focus-visible,
	.kinds a:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.spine-label {
		flex: 0 0 4.2rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--gold);
	}

	.spine-title {
		flex: 1 1 auto;
		min-width: 0;
		font-family: var(--serif);
		font-size: 1.02rem;
		color: var(--fg-strong);
	}

	.spine-meta {
		flex: 0 0 auto;
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.kingdoms {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem 0.35rem;
	}

	.kingdoms li {
		flex: 0 0 auto;
	}

	.kingdoms a {
		align-items: center;
		gap: 0.45rem;
		padding: 0.35rem 0.7rem 0.35rem 0.45rem;
		border: 1px solid var(--hairline);
		border-bottom: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--kingdom) 12%, var(--panel));
	}

	.kingdoms img {
		display: block;
		height: 0.85rem;
		width: auto;
	}

	.k-name {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.k-count {
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.doors {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 0.15rem 1.25rem;
	}

	.doors a {
		align-items: flex-start;
		gap: 0.7rem;
		padding: 0.85rem 0.1rem;
		border-bottom: 1px solid var(--hairline);
	}

	.doors .material-symbols-outlined {
		flex: 0 0 auto;
		margin-top: 0.1rem;
		font-size: 1.25rem;
		color: var(--gold);
	}

	.door-copy {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	.door-title {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.door-lede {
		font-size: 0.84rem;
		line-height: 1.4;
		color: var(--fg-dim);
	}

	.door-count {
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.workshop h2,
	.workshop .note,
	.workshop .door-title {
		color: var(--fg-dim);
	}

	.kinds {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 0.25rem 1rem;
	}

	.kinds a {
		justify-content: space-between;
		padding: 0.45rem 0;
	}

	.kind-title {
		font-size: 0.88rem;
		color: var(--fg-strong);
	}

	.kind-n {
		font-variant-numeric: tabular-nums;
		font-size: 0.78rem;
		color: var(--fg-faint);
	}

	@media (max-width: 720px) {
		.census {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.spine a {
			flex-wrap: wrap;
		}

		.spine-meta {
			width: 100%;
			padding-left: 4.2rem;
		}

		.map-door {
			height: min(38svh, 22rem);
			margin-left: -0.4rem;
			margin-right: -0.4rem;
			border-radius: 0;
			border-left: none;
			border-right: none;
		}
	}
</style>
