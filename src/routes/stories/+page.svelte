<script lang="ts">
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { resolve } from '$app/paths';
	import { episodeCount, heroStill, outlineShelves } from '$lib/outlines';
	import { EPISODE_TOTAL } from '$lib/episodeDirectory';
	import { plateTab, reading } from '$lib/reading.svelte';

	const shelves = outlineShelves();

	const SHELF_KO: Record<string, string> = {
		Samhan: '삼한',
		China: '중국',
		'Persia and the Steppe': '페르시아와 초원',
		Israel: '이스라엘',
		America: '아메리카'
	};

	const chronicle = {
		en: 'King for All',
		ko: '삼한왕검',
		taglineEn: 'The chronicle, from the myths through the unification wars.',
		taglineKo: '신화에서 통일 전쟁까지의 연대기.',
		metaEn: `${EPISODE_TOTAL} episodes`,
		metaKo: `${EPISODE_TOTAL}편`,
		accent: '#9a2b3a',
		src: '/album_sunduk.png',
		altEn: 'Queen Sunduk under the title 삼한왕검',
		altKo: '삼한왕검, 선덕여왕'
	};
</script>

<svelte:head>
	<title>{plateTab('Stories', '이야기')} · {plateTab('King for All', '삼한왕검')}</title>
	<meta
		name="description"
		content={plateTab(
			'King for All, and the outlines that follow: Korea, China, Persia, the steppe, Israel and Silicon Valley.',
			'삼한왕검, 그리고 그 다음 구상. 한국, 중국, 페르시아, 초원, 이스라엘, 실리콘밸리.'
		)}
	/>
</svelte:head>

<main class="stories">
	<SiteNavSpace />

	<header>
		<h1>{plateTab('Stories', '이야기')}</h1>
		<p>{plateTab('King for All, and the books that follow it.', '삼한왕검, 그리고 그 다음 책들.')}</p>
	</header>

	{#each shelves as { shelf, outlines } (shelf)}
		<section>
			<h2>{plateTab(shelf, SHELF_KO[shelf] ?? shelf)}</h2>
			<ul class="grid">
				{#if shelf === 'Samhan'}
					<li style:--accent={chronicle.accent}>
						<a href={resolve('/books')}>
							<img src={staticAsset(chronicle.src)} alt={plateTab(chronicle.altEn, chronicle.altKo)} loading="lazy" />
							<div class="text">
								<h3>
									{reading.lang === 'ko' ? chronicle.ko : chronicle.en}
									{#if reading.lang === 'both'}<span class="ko">{chronicle.ko}</span>{/if}
								</h3>
								<p class="tagline">{plateTab(chronicle.taglineEn, chronicle.taglineKo)}</p>
								<p class="meta">{plateTab(chronicle.metaEn, chronicle.metaKo)}</p>
							</div>
						</a>
					</li>
				{/if}
				{#each outlines as o (o.slug)}
					{@const cover = heroStill(o)}
					<li style:--accent={o.accent}>
						<a href={resolve('/stories/[slug]', { slug: o.slug })}>
							{#if cover}
								<img src={staticAsset(cover.src)} alt={cover.alt} loading="lazy" />
							{/if}
							<div class="text">
								<h3>
									{reading.lang === 'ko' ? o.ko : o.title}
									{#if o.badge}<span class="badge">{o.badge}</span>{/if}
									{#if reading.lang === 'both'}<span class="ko">{o.ko}</span>{/if}
								</h3>
								<p class="tagline">{o.tagline}</p>
								<p class="meta">{o.years} · {plateTab(`${episodeCount(o)} episodes`, `${episodeCount(o)}편`)}</p>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</main>

<style lang="scss">
	.stories {
		min-height: 100dvh;
		max-width: 72rem;
		margin-inline: auto;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem) calc(5rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	header {
		margin: 3rem 0 1rem;
	}

	h1 {
		margin: 0 0 0.4rem;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	header p {
		margin: 0;
		font-family: var(--ui);
		color: var(--fg-dim);
	}

	h2 {
		margin: 3rem 0 1rem;
		font-family: var(--ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	img {
		display: block;
		width: 100%;
		aspect-ratio: 2;
		object-fit: contain;
		background: color-mix(in srgb, var(--fg) 6%, var(--bg));
		border-radius: 0.5rem;
		transition: opacity 0.2s;
		a:hover & {
			opacity: 0.85;
		}
	}

	.text {
		padding-top: 0.75rem;
		border-top: 2px solid transparent;
	}

	h3 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--fg-strong);
		a:hover & {
			color: var(--accent);
		}
	}

	.ko {
		font-family: var(--ui);
		font-size: 0.7em;
		color: var(--fg-faint);
	}

	.badge {
		display: inline-block;
		margin-left: 0.45rem;
		padding: 0.05em 0.4em 0.08em;
		border-radius: 2px;
		background: color-mix(in srgb, var(--accent, #2f8f83) 22%, transparent);
		color: var(--fg-strong);
		font-family: var(--ui);
		font-size: 0.62rem;
		font-weight: 650;
		letter-spacing: 0.06em;
		vertical-align: 0.15em;
	}

	.tagline {
		margin: 0.25rem 0 0;
		font-family: var(--ui);
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.meta {
		margin: 0.25rem 0 0;
		font-family: var(--ui);
		font-size: 0.78rem;
		color: var(--fg-faint);
	}
</style>
