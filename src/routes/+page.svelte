<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import MapTimelapse from '$lib/components/MapTimelapse.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import StillWall, { type WallStill } from '$lib/components/StillWall.svelte';
	import VolumePreview from '$lib/components/books/VolumePreview.svelte';
	import { VOLUMES } from '$lib/books';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { volumeCover } from '$lib/posters.svelte';
	import {
		episodeNavLabel,
		episodeQueryId,
		episodes,
		lastEpisode,
		reading,
		type EpisodeRef
	} from '$lib/reading.svelte';
	import { spineColor } from '$lib/spine.svelte';
	import { storyStills } from '$lib/thumbnail.svelte';
	import { lineNear } from '$lib/comicSay';
	import { EPISODE_TOTAL, PARTS, STORY_RANGE } from '$lib/episodeDirectory';
	import { WORLD_STILLS, WORLD_WIKI, WORLD_WORDS } from '$lib/worldAtlas';

	let ko = $derived(reading.lang === 'ko');

	const FIRST_EPISODE = episodes[0];
	let resume = $state<EpisodeRef | null>(null);

	function readHref(ep: EpisodeRef): string {
		return hrefWithNsfw(`${resolve('/read')}?ep=${encodeURIComponent(episodeQueryId(ep))}`, page.url);
	}

	let read = $derived.by(() => {
		const ep = resume ?? FIRST_EPISODE;
		if (!ep) return null;
		return {
			label: resume ? (ko ? '이어 읽기' : 'Continue') : ko ? '읽기' : 'Read',
			ep: episodeNavLabel(ep),
			href: readHref(ep)
		};
	});

	/** Compact gallery band — fewer stills so one viewport stays calm. */
	const GALLERY_N = 18;
	let gallery = $derived(
		storyStills(GALLERY_N).map(({ slot, src }): WallStill => {
			const say = lineNear(slot.id);
			const text = ko ? say?.ko : say?.en;
			return { src, line: text ? { text, person: say?.person } : undefined };
		})
	);

	/** A short shelf of volumes — first of each part, then fill. */
	let shelf = $derived.by(() => {
		const seen = new Set<number>();
		const firsts: typeof VOLUMES = [];
		const rest: typeof VOLUMES = [];
		for (const v of VOLUMES) {
			if (!seen.has(v.partIndex)) {
				seen.add(v.partIndex);
				firsts.push(v);
			} else rest.push(v);
		}
		return [...firsts, ...rest].slice(0, 10);
	});

	const portals = [
		{
			href: '/map',
			icon: 'map',
			en: 'Map',
			ko: '지도',
			ledeEn: 'The peninsula as it changes.',
			ledeKo: '바뀌는 반도.'
		},
		{
			href: '/tree',
			icon: 'account_tree',
			en: 'Silla Tree',
			ko: '신라 왕통',
			ledeEn: 'Royal blood as a living diagram.',
			ledeKo: '살아 있는 왕통도.'
		},
		{
			href: '/wiki?story=Bihyung',
			icon: 'auto_stories',
			en: 'Myths',
			ko: '신화',
			ledeEn: 'Bihyung, Tamla, founding tales.',
			ledeKo: '비형, 탐라, 건국 설화.'
		},
		{
			href: '/timeline',
			icon: 'view_timeline',
			en: 'Timeline',
			ko: '연표',
			ledeEn: 'Years stacked against lives.',
			ledeKo: '세월과 목숨이 겹친다.'
		},
		{
			href: '/wiki',
			icon: 'menu_book',
			en: 'Wiki',
			ko: '위키',
			ledeEn: 'Every name, place, sword, bond.',
			ledeKo: '이름, 땅, 칼, 인연.'
		},
		{
			href: '/images',
			icon: 'photo_library',
			en: 'Images',
			ko: '장면',
			ledeEn: 'The chronicle as a gallery.',
			ledeKo: '연대기를 그림으로.'
		}
	] as const;

	function href(path: string): string {
		const [base, q] = path.split('?');
		const resolved = resolve((base || '/') as '/');
		return hrefWithNsfw(q ? `${resolved}?${q}` : resolved, page.url);
	}

	function n(v: number): string {
		return v.toLocaleString(ko ? 'ko-KR' : 'en-US');
	}

	onMount(() => {
		if (location.hash) {
			void goto(`${resolve('/read')}${location.search}${location.hash}`, { replaceState: true });
			return;
		}
		resume = lastEpisode();
	});
</script>

<svelte:head>
	<title>King for All 삼한왕검</title>
	<meta
		name="description"
		content={ko
			? '삼한왕검 — 7세기 삼한의 서사. 신화와 역사, 위키·권·장면이 한 세계에 들어 있다.'
			: 'King for All — an epic Samhan chronicle. History and myth, with a built-in wiki, volumes, and stills.'}
	/>
</svelte:head>

<main class="hub">
	<SiteNavSpace />

	<div class="stage">
		<section class="gallery" aria-label={ko ? '장면' : 'Gallery'}>
			<StillWall stills={gallery} compact fill />
		</section>

		<section class="hero">
			<a class="map" href={href('/map')} aria-label={ko ? '지도 열기' : 'Open the map'}>
				<MapTimelapse {ko} />
			</a>

			<div class="copy">
				<img class="logo" src="/samhan_logo.png" alt="삼한왕검" width="160" height="160" />
				<p class="kicker">{ko ? '삼한왕검' : 'King for All'}</p>
				<h1>King for All</h1>
				<p class="subtitle">{ko ? '부로 쓰인 이야기' : 'A Story Told In Parts'}</p>
				<p class="blurb">
					{ko
						? '우선은 이야기입니다. 7세기 삼한의 왕과 장수, 그리고 그 이전에 깔린 신화와 설화(비형, 탐라, 건국)까지 — 드라마보다 더 크게, 국제 독자가 역사를 몰라도 따라올 수 있게. 그 위에 위키, 권, 장면, 왕통도가 붙은 하나의 세계입니다.'
						: 'First, a story: 7th-century Samhan — kings, marshals, and the myths under them (Bihyung, Tamla, the foundings) told epic enough that you need not already know the history. Around that spine sits an interactive universe: wiki, volumes, stills, the Silla tree.'}
				</p>
				<p class="meta">
					<span>{STORY_RANGE}</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{PARTS.length} {ko ? '부' : 'parts'}</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{n(EPISODE_TOTAL)} {ko ? '화' : 'chapters'}</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{n(WORLD_WORDS)} {ko ? '단어' : 'words'}</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{n(WORLD_WIKI)} wiki</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{n(WORLD_STILLS)} {ko ? '장면' : 'stills'}</span>
				</p>

				<div class="actions">
					{#if read}
						<a class="read" href={read.href}>
							<span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
							<span class="read-label">{read.label}</span>
							<span class="read-ep">{read.ep}</span>
						</a>
					{/if}
					<a class="glass" href={href('/books')}>
						<span class="material-symbols-outlined" aria-hidden="true">library_books</span>
						{ko ? '서가' : 'Library'}
					</a>
				</div>
			</div>
		</section>

		<section class="volumes" aria-labelledby="vol-h">
			<header class="row-head">
				<h2 id="vol-h">{ko ? '권' : 'Volumes'}</h2>
				<a href={href('/books')}>{ko ? '서가 열기' : 'Open shelf'}</a>
			</header>
			<ul class="shelf">
				{#each shelf as v (v.id)}
					<li>
						<a href={href(`/books?v=${encodeURIComponent(v.id)}`)} title={ko ? v.ko || v.title : v.title}>
							<VolumePreview
								volume={v}
								cover={volumeCover(v.id)}
								spine={spineColor(v.id)}
								title={ko ? v.ko || v.title : v.title}
								number={v.number}
								pose="tilt"
								height={7.2}
							/>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<nav class="portals" aria-label={ko ? '세계로' : 'Into the world'}>
			{#each portals as p (p.href)}
				<a href={href(p.href)}>
					<span class="material-symbols-outlined" aria-hidden="true">{p.icon}</span>
					<span class="p-title">{ko ? p.ko : p.en}</span>
					<span class="p-lede">{ko ? p.ledeKo : p.ledeEn}</span>
				</a>
			{/each}
		</nav>
	</div>
</main>

<style lang="scss">
	.hub {
		height: 100svh;
		max-height: 100svh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.stage {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-rows: minmax(4.5rem, 16%) minmax(0, 1fr) auto auto;
		gap: 0.55rem;
		padding: 0 1.1rem calc(0.75rem + var(--tabbar-space, 0px));
		max-width: 72rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.gallery {
		min-height: 0;
		overflow: hidden;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: var(--panel-sunken);
		& :global(.wall) {
			height: 100%;
		}
	}

	.hero {
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr);
		gap: 1rem 1.35rem;
		align-items: stretch;
	}

	.map {
		display: block;
		min-height: 0;
		height: 100%;
		overflow: hidden;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: var(--panel-sunken);
		text-decoration: none;
		color: inherit;
		& :global(.canvas) {
			height: 100%;
			border-radius: var(--radius);
		}
	}

	.copy {
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.28rem;
		overflow: hidden;
	}

	.logo {
		width: 2.6rem;
		height: auto;
		margin-bottom: 0.15rem;
	}

	.kicker {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.85rem, 3.6vw, 2.75rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display, -0.02em);
		line-height: 1.05;
		color: var(--fg-strong);
	}

	.subtitle {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.02rem;
		font-style: italic;
		color: var(--fg-dim);
	}

	.blurb {
		margin: 0.35rem 0 0;
		max-width: 36rem;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--fg-dim);
		display: -webkit-box;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		margin: 0.2rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.45rem;
		font-size: 0.75rem;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
	}

	.sep {
		color: var(--hairline);
	}

	.actions {
		margin-top: 0.55rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.read,
	.glass {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		text-decoration: none;
		border-radius: var(--radius-pill);
		font-size: 0.88rem;
		font-weight: 600;
	}

	.read {
		padding: 0.65rem 1.1rem;
		background: var(--gold);
		color: #1a1208;
	}

	.read-ep {
		font-weight: 500;
		opacity: 0.75;
	}

	.glass {
		padding: 0.55rem 0.9rem;
		color: var(--fg);
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--bg) 55%, transparent);
	}

	.glass:hover,
	.read:hover {
		filter: brightness(1.05);
	}

	.volumes {
		min-height: 0;
	}

	.row-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.35rem;
		& h2 {
			margin: 0;
			font-family: var(--serif);
			font-size: 1rem;
			font-weight: 600;
			color: var(--fg-strong);
		}
		& a {
			font-size: 0.78rem;
			color: var(--fg-dim);
			text-decoration: none;
			&:hover {
				color: var(--gold);
			}
		}
	}

	.shelf {
		margin: 0;
		padding: 0.15rem 0 0.35rem;
		list-style: none;
		display: flex;
		gap: 0.65rem;
		overflow-x: auto;
		scrollbar-width: thin;
		& li {
			flex: 0 0 auto;
		}
		& a {
			display: block;
			color: inherit;
			text-decoration: none;
		}
	}

	.portals {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.4rem;
		min-height: 0;
		& a {
			display: grid;
			grid-template-rows: auto auto 1fr;
			gap: 0.12rem;
			padding: 0.55rem 0.55rem 0.5rem;
			border-radius: var(--radius);
			border: 1px solid var(--hairline);
			background: color-mix(in srgb, var(--panel-sunken) 80%, transparent);
			color: inherit;
			text-decoration: none;
			min-height: 0;
			overflow: hidden;
			transition: border-color 0.15s var(--ease, ease);
			&:hover {
				border-color: color-mix(in srgb, var(--gold) 50%, var(--hairline));
			}
		}
		& .material-symbols-outlined {
			font-size: 1.15rem;
			color: var(--gold);
		}
	}

	.p-title {
		font-size: 0.82rem;
		font-weight: 650;
		color: var(--fg-strong);
	}

	.p-lede {
		font-size: 0.7rem;
		line-height: 1.3;
		color: var(--fg-faint);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 900px) {
		.hero {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(8rem, 34%) minmax(0, 1fr);
		}
		.portals {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.blurb {
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}
	}

	@media (max-width: 720px) {
		.stage {
			grid-template-rows: minmax(3.5rem, 12%) minmax(0, 1fr) auto auto;
			padding-inline: 0.75rem;
			gap: 0.45rem;
		}
		.portals {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.p-lede {
			display: none;
		}
	}
</style>
