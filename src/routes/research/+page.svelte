<script lang="ts">
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import ResearchDiagram from '$lib/components/research/ResearchDiagram.svelte';
	import { reading } from '$lib/reading.svelte';
	import {
		COMPARE,
		ELSEWHERE,
		IMAGES,
		KINGDOM_INFO,
		KINGDOM_ORDER,
		MUSEUMS,
		READING,
		TOPICS,
		type ResearchImage,
		type ResearchKingdom
	} from '$lib/research';

	let ko = $derived(reading.lang === 'ko');
	let kingdom = $state<ResearchKingdom | 'all'>('all');
	let open = $state<ResearchImage | null>(null);
	let dialog = $state<HTMLDialogElement>();

	const TABLE_KINGDOMS = KINGDOM_ORDER.filter((k): k is Exclude<ResearchKingdom, 'abroad'> => k !== 'abroad');
	const counts = Object.fromEntries(KINGDOM_ORDER.map((k) => [k, IMAGES.filter((i) => i.kingdom === k).length]));

	const keep = (k: ResearchKingdom) => kingdom === 'all' || k === kingdom;
	let sections = $derived(
		TOPICS.map((topic) => {
			const shown = IMAGES.filter((i) => i.topic === topic.id && keep(i.kingdom));
			return {
				topic,
				images: shown.filter((i) => !i.still),
				stills: shown.filter((i) => i.still),
				records: (topic.records ?? []).filter((r) => keep(r.kingdom))
			};
		})
	);

	function show(img: ResearchImage) {
		open = img;
		dialog?.showModal();
	}

	function close() {
		dialog?.close();
	}

	const name = (k: ResearchKingdom) => (ko ? KINGDOM_INFO[k].ko : KINGDOM_INFO[k].en);
</script>

{#snippet band(list: ResearchImage[], painted: boolean)}
	<div class="band" class:painted>
		<p class="band-head">
			<span>
				{#if painted}{ko ? '이야기를 위해 그린 그림' : 'Painted for the story'}{:else}{ko ? '박물관과 무덤에서' : 'From museums and tombs'}{/if}
				<small>{list.length}</small>
			</span>
			{#if painted}
				{ko ? '위의 유물과 벽화를 바탕으로 이 책의 화풍으로 그렸다. 증거가 아니라 해석이다.' : 'Made for this book in its own style from the evidence above. An interpretation, not evidence.'}
			{:else}
				{ko ? '실제 유물과 벽화의 사진.' : 'Photographs of real objects and murals.'}
			{/if}
		</p>
		<ul class="gallery">
			{#each list as img (img.id)}
				<li>
					<button type="button" class="tile" onclick={() => show(img)} aria-label={ko ? img.ko : img.title}>
						<img src={img.src} alt={ko ? img.captionKo : img.caption} width={img.w} height={img.h} loading="lazy" decoding="async" />
						{#if painted}<b class="badge">{ko ? '그림' : 'Painted'}</b>{/if}
					</button>
					<div class="meta">
						<span class="t">{ko ? img.ko : img.title}</span>
						<span class="s" style:--c={KINGDOM_INFO[img.kingdom].color}><i></i>{name(img.kingdom)} · {img.date}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}

<svelte:head>
	<title>Research · King for All</title>
	<meta
		name="description"
		content="What the people of Gojoseon, Buyeo, Goguryeo, Baekje, Silla and Gaya wore: crowns, feather caps, gold, dress and armour, from tombs, murals and the dynastic histories."
	/>
</svelte:head>

<main class="research">
	<SiteNavSpace />

	<header class="column head">
		<h1>{ko ? '자료' : 'Research'}</h1>
		<p class="lede">
			{ko
				? '고조선, 부여, 고구려, 백제, 신라, 가야 사람들은 무엇을 입었나. 관과 깃, 금붙이, 옷과 갑옷을 무덤과 벽화, 그리고 사서의 기록으로 본다.'
				: 'What the people of Gojoseon, Buyeo, Goguryeo, Baekje, Silla and Gaya wore: crowns and feather caps, gold, dress and armour, as the tombs, the murals and the dynastic histories show them.'}
		</p>

		<div class="filters" role="group" aria-label={ko ? '나라' : 'Kingdom'}>
			<button type="button" class:on={kingdom === 'all'} onclick={() => (kingdom = 'all')}>{ko ? '전체' : 'All'}</button>
			{#each KINGDOM_ORDER as k (k)}
				<button type="button" class:on={kingdom === k} style:--c={KINGDOM_INFO[k].color} onclick={() => (kingdom = k)}>
					<i></i>{name(k)}{#if counts[k]}<small>{counts[k]}</small>{/if}
				</button>
			{/each}
		</div>

		<nav class="toc" aria-label={ko ? '목차' : 'Contents'}>
			<a href="#glance">{ko ? '한눈에' : 'At a glance'}</a>
			{#each TOPICS as t (t.id)}
				<a href="#{t.id}">{ko ? t.ko : t.title}</a>
			{/each}
			<a href="#museums">{ko ? '박물관' : 'Museums'}</a>
		</nav>
	</header>

	<section class="column glance" id="glance">
		<h2>{ko ? '한눈에' : 'At a glance'}</h2>
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th></th>
						{#each TABLE_KINGDOMS as k (k)}
							<th class:dim={kingdom !== 'all' && kingdom !== k} style:--c={KINGDOM_INFO[k].color}>
								<i></i>{name(k)}
								<small>{KINGDOM_INFO[k].era}</small>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each COMPARE as row (row.feature)}
						<tr>
							<th scope="row">{ko ? row.ko : row.feature}</th>
							{#each TABLE_KINGDOMS as k (k)}
								<td class:dim={kingdom !== 'all' && kingdom !== k}>{row.cells[k][ko ? 1 : 0]}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	{#each sections as { topic, images, stills, records } (topic.id)}
		<section class="topic" id={topic.id}>
			<div class="column">
				<h2>{ko ? topic.ko : topic.title}{#if !ko}<span class="ko">{topic.ko}</span>{/if}</h2>
				{#each ko ? topic.bodyKo : topic.body as para, i (i)}
					<p class="body">{para}</p>
				{/each}
				{#if topic.diagram}<ResearchDiagram id={topic.diagram} />{/if}
				{#if records.length}
					<ul class="records">
						{#each records as r (r.hanja)}
							<li>
								<span class="who" style:--c={KINGDOM_INFO[r.kingdom].color}><i></i>{name(r.kingdom)}</span>
								<blockquote>
									<p class="hanja" lang="zh-Hant">{r.hanja}</p>
									<p class="tr">{ko ? r.ko : r.en}</p>
								</blockquote>
								<cite>{r.source}</cite>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
			{#if images.length}
				{@render band(images, false)}
			{:else if kingdom !== 'all'}
				<p class="column empty">{ko ? '이 나라의 이 주제 이미지는 아직 없다.' : 'No images for this kingdom on this topic yet.'}</p>
			{/if}
			{#if kingdom === 'all' && ELSEWHERE.some((x) => x.topic === topic.id)}
				<p class="column elsewhere">
					<span>{ko ? '여기 싣지 못한 것' : 'Not pictured here'}</span>
					{#each ELSEWHERE.filter((x) => x.topic === topic.id) as x (x.title)}
						<a href={x.url} target="_blank" rel="noreferrer">{ko ? x.ko : x.title}<small>{x.where}</small></a>
					{/each}
				</p>
			{/if}
			{#if stills.length}
				{@render band(stills, true)}
			{/if}
		</section>
	{/each}

	<section class="column refs" id="museums">
		<h2>{ko ? '박물관' : 'Museums'}</h2>
		<ul class="list">
			{#each MUSEUMS as m (m.name)}
				<li>
					<a href={m.url} target="_blank" rel="noreferrer">{ko ? m.ko : m.name}</a>
					<span class="where">{m.city}</span>
					<p>{m.note}</p>
				</li>
			{/each}
		</ul>

		<h2>{ko ? '더 읽을거리' : 'Further reading'}</h2>
		<ul class="list">
			{#each READING as r (r.title)}
				<li>
					{#if r.url}<a href={r.url} target="_blank" rel="noreferrer">{ko && r.ko ? r.ko : r.title}</a>{:else}<span class="plain">{r.title}</span>{/if}
					<span class="where">{r.author}</span>
					<p>{r.note}</p>
				</li>
			{/each}
		</ul>
		<p class="fine">
			{ko
				? '사진은 위키미디어 공용의 자유 이용 허락 자료이며, 이미지마다 저작자와 이용 조건을 밝혔다. ‘이야기를 위해 그린 그림’은 이 책을 위해 그린 것이다.'
				: 'Photographs are freely licensed files from Wikimedia Commons; each one carries its author and licence. The images under “Painted for the story” were made for this book.'}
		</p>
	</section>

	<dialog bind:this={dialog} class="lightbox" onclose={() => (open = null)} onclick={(e) => e.target === dialog && close()}>
		{#if open}
			<figure>
				<img src={open.src} alt={ko ? open.captionKo : open.caption} width={open.w} height={open.h} />
				<figcaption>
					<span class="t">{ko ? open.ko : open.title}{#if !ko}<span class="ko">{open.ko}</span>{/if}</span>
					{#if open.still}
						<span class="s">{name(open.kingdom)} · {open.date}</span>
						<span class="c">{ko ? open.captionKo : open.caption}</span>
						{#if open.url}
							<a class="credit" href="{resolve('/read')}?ep={open.url}">{ko ? `이야기에서 보기 · ${open.whereKo}` : `See it in the story · ${open.where}`}</a>
						{:else}
							<span class="credit">{ko ? open.whereKo : open.where} · {open.credit}</span>
						{/if}
					{:else}
						<span class="s">{name(open.kingdom)} · {open.date} · {ko ? open.whereKo : open.where}{#if open.treasure} · {open.treasure}{/if}</span>
						<span class="c">{ko ? open.captionKo : open.caption}</span>
						<a class="credit" href={open.url} target="_blank" rel="noreferrer">{open.credit} · {open.license}</a>
					{/if}
				</figcaption>
			</figure>
			<button type="button" class="x" onclick={close} aria-label={ko ? '닫기' : 'Close'}>
				<span class="material-symbols-outlined" aria-hidden="true">close</span>
			</button>
		{/if}
	</dialog>
</main>

<style>
	.research {
		min-height: 100dvh;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)
			calc(5rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	.column {
		max-width: var(--script-measure);
		margin-inline: auto;
	}

	h1 {
		margin: 3rem 0 1rem;
		font-family: var(--serif);
		font-size: clamp(2rem, 4vw, 2.6rem);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.lede {
		margin: 0 0 1.75rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--fg-dim);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.filters button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: none;
		font: 600 0.78rem/1 var(--ui);
		color: var(--fg-dim);
		cursor: pointer;
		transition:
			background 160ms ease,
			color 160ms ease;
	}

	.filters button.on {
		background: var(--fg-strong);
		border-color: var(--fg-strong);
		color: var(--bg);
	}

	.filters i,
	th i,
	.who i,
	.s i {
		display: inline-block;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--c);
	}

	.filters small {
		font-weight: 500;
		opacity: 0.6;
	}

	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 1.4rem 0 0;
		font: 500 0.82rem/1.6 var(--ui);
	}

	.toc a {
		color: var(--fg-faint);
		text-decoration: none;
	}

	.toc a:hover {
		color: var(--fg-strong);
	}

	h2 {
		margin: 0 0 1rem;
		font-family: var(--serif);
		font-size: 1.6rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	h2 .ko {
		margin-left: 0.6rem;
		font-size: 1rem;
		color: var(--fg-faint);
	}

	.glance,
	.topic,
	.refs {
		margin-top: 4rem;
		padding-top: 2.25rem;
		border-top: 1px solid var(--hairline);
		scroll-margin-top: 4.5rem;
	}

	.column.glance {
		max-width: 68rem;
	}

	.table-wrap {
		overflow-x: auto;
		margin-inline: -0.25rem;
	}

	table {
		width: 100%;
		min-width: 640px;
		border-collapse: collapse;
		font-size: 0.78rem;
		line-height: 1.45;
	}

	th,
	td {
		padding: 0.55rem 0.5rem;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid var(--hairline);
		transition: opacity 160ms ease;
	}

	thead th {
		font: 600 0.78rem/1.3 var(--ui);
		color: var(--fg-strong);
	}

	thead th small {
		display: block;
		margin-top: 0.15rem;
		font-weight: 500;
		font-size: 0.68rem;
		color: var(--fg-faint);
	}

	tbody th {
		font: 600 0.74rem/1.4 var(--ui);
		color: var(--fg-faint);
		white-space: nowrap;
	}

	td {
		color: var(--fg-dim);
	}

	.dim {
		opacity: 0.28;
	}

	.body {
		margin: 0 0 0.95rem;
		font-size: 1rem;
		line-height: 1.68;
		color: var(--fg-dim);
	}

	.records {
		display: grid;
		gap: 1.4rem;
		margin: 2rem 0 0;
		padding: 0;
		list-style: none;
	}

	.records li {
		padding-left: 1rem;
		border-left: 2px solid color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.who {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font: 600 0.68rem/1 var(--ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	blockquote {
		margin: 0.45rem 0 0.35rem;
	}

	.hanja {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.02rem;
		line-height: 1.7;
		letter-spacing: 0.06em;
		color: var(--fg-strong);
	}

	.tr {
		margin: 0.3rem 0 0;
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--fg-dim);
	}

	cite {
		font-size: 0.7rem;
		font-style: normal;
		color: var(--fg-faint);
	}

	.band {
		max-width: 76rem;
		margin: 2.25rem auto 0;
	}

	.band.painted {
		padding: 1.1rem 1.1rem 0.2rem;
		border: 1px solid color-mix(in srgb, var(--gold) 35%, transparent);
		border-radius: 8px;
		background: color-mix(in srgb, var(--gold) 6%, transparent);
	}

	.band-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.9rem;
		margin: 0 0 1rem;
		font-size: 0.8rem;
		color: var(--fg-dim);
	}

	.band-head span {
		display: inline-flex;
		align-items: baseline;
		gap: 0.45rem;
		font: 600 0.68rem/1 var(--ui);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-strong);
	}

	.painted .band-head span {
		color: var(--gold);
	}

	.band-head small {
		font-weight: 500;
		color: var(--fg-faint);
	}

	.gallery {
		columns: 4 9rem;
		column-gap: 0.85rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.gallery li {
		break-inside: avoid;
		margin-bottom: 1rem;
	}

	.tile {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: color-mix(in srgb, var(--fg) 5%, transparent);
		border-radius: 4px;
		overflow: hidden;
		cursor: zoom-in;
	}

	.tile img {
		display: block;
		width: 100%;
		height: auto;
		transition: transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.tile:hover img {
		transform: scale(1.025);
	}

	.badge {
		position: absolute;
		top: 0.4rem;
		left: 0.4rem;
		padding: 0.2rem 0.45rem;
		border-radius: 3px;
		background: rgb(0 0 0 / 62%);
		font: 600 0.6rem/1 var(--ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.meta {
		display: grid;
		gap: 0.15rem;
		margin-top: 0.5rem;
	}

	.meta .t {
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--fg-strong);
	}

	.meta .s,
	.lightbox .s {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.7rem;
		color: var(--fg-faint);
	}

	.empty {
		margin-top: 1.5rem;
		font-size: 0.85rem;
		color: var(--fg-faint);
	}

	.elsewhere {
		display: grid;
		gap: 0.35rem;
		margin-top: 1.5rem;
		font-size: 0.8rem;
	}

	.elsewhere span {
		font: 600 0.66rem/1 var(--ui);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.elsewhere a {
		color: var(--fg-dim);
		text-decoration: none;
	}

	.elsewhere a:hover {
		color: var(--fg-strong);
	}

	.elsewhere small {
		margin-left: 0.5rem;
		color: var(--fg-faint);
	}

	.list {
		display: grid;
		gap: 1.1rem;
		margin: 0 0 3rem;
		padding: 0;
		list-style: none;
	}

	.list a,
	.list .plain {
		font-weight: 600;
		color: var(--fg-strong);
		text-decoration: none;
	}

	.list a:hover {
		text-decoration: underline;
	}

	.where {
		margin-left: 0.5rem;
		font-size: 0.78rem;
		color: var(--fg-faint);
	}

	.list p {
		margin: 0.2rem 0 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.fine {
		font-size: 0.74rem;
		color: var(--fg-faint);
	}

	.lightbox {
		width: min(92vw, 70rem);
		max-height: 92dvh;
		padding: 0;
		border: 0;
		border-radius: 6px;
		background: var(--bg);
		color: var(--fg);
		box-shadow: 0 30px 80px rgb(0 0 0 / 45%);
	}

	.lightbox::backdrop {
		background: rgb(0 0 0 / 72%);
		backdrop-filter: blur(4px);
	}

	.lightbox figure {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(14rem, 1fr);
		margin: 0;
	}

	.lightbox img {
		display: block;
		width: 100%;
		height: auto;
		max-height: 92dvh;
		object-fit: contain;
		background: #0b0b0d;
	}

	.lightbox figcaption {
		display: grid;
		align-content: start;
		gap: 0.6rem;
		padding: 1.6rem 1.4rem;
	}

	.lightbox .t {
		font-family: var(--serif);
		font-size: 1.2rem;
		color: var(--fg-strong);
	}

	.lightbox .t .ko {
		display: block;
		margin-top: 0.2rem;
		font-family: var(--ui);
		font-size: 0.85rem;
		color: var(--fg-faint);
	}

	.lightbox .c {
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--fg-dim);
	}

	.credit {
		font-size: 0.7rem;
		color: var(--fg-faint);
	}

	.x {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		border: 0;
		border-radius: 50%;
		background: color-mix(in srgb, var(--bg) 80%, transparent);
		color: var(--fg-strong);
		cursor: pointer;
	}

	@media (max-width: 720px) {
		.lightbox {
			width: 100vw;
			max-width: 100vw;
			max-height: 100dvh;
			border-radius: 0;
		}

		.lightbox figure {
			grid-template-columns: 1fr;
		}

		.lightbox img {
			max-height: 60dvh;
		}

		.lightbox figcaption {
			padding: 1rem 1rem calc(1.25rem + env(safe-area-inset-bottom, 0px));
		}
	}

	@media (max-width: 520px) {
		.band {
			margin-top: 1.6rem;
		}

		.band.painted {
			margin-inline: -0.5rem;
			padding: 0.75rem 0.6rem 0;
		}

		.band-head {
			font-size: 0.74rem;
		}

		.gallery {
			column-gap: 0.55rem;
		}

		.gallery li {
			margin-bottom: 0.75rem;
		}

		.meta {
			margin-top: 0.35rem;
		}

		.meta .t {
			font-size: 0.74rem;
		}

		.meta .s {
			font-size: 0.64rem;
		}

		.badge {
			top: 0.3rem;
			left: 0.3rem;
			font-size: 0.52rem;
		}
	}
</style>
