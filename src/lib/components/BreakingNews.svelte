<script lang="ts">
	import { reading } from '$lib/reading.svelte';

	/**
	 * A battle broken as cable news: the red BREAKING slate, a LIVE light, the
	 * headline on a white bar and the rest of the war crawling underneath.
	 * Hybrid dialogue only; Blocks hangs it above a war episode's first map.
	 */
	let {
		headline,
		headlineKo,
		ticker = []
	}: {
		headline: string;
		headlineKo?: string;
		/** The episode's other headlines: later maps, formations, the siege's days. */
		ticker?: string[];
	} = $props();

	let ko = $derived(reading.lang === 'ko');
	let crawl = $derived(ticker.length ? ticker : [headline]);
</script>

<div class="news" role="group" aria-label={ko ? '속보' : 'Breaking news'}>
	<div class="news-top">
		<span class="news-slate">{ko ? '속보' : 'BREAKING NEWS'}</span>
		<span class="news-live"><span class="news-dot" aria-hidden="true"></span>{ko ? '생방송' : 'LIVE'}</span>
		<span class="news-bug" aria-hidden="true">{ko ? '삼한 뉴스' : 'SAMHAN NEWS'}</span>
	</div>
	<p class="news-headline">{ko && headlineKo ? headlineKo : headline}</p>
	<div class="news-ticker" aria-hidden="true">
		<span class="news-tag">{ko ? '전황' : 'WAR DESK'}</span>
		<span class="news-window">
			<span class="news-crawl">
				{#each [0, 1] as copy (copy)}
					<span class="news-run">
						{#each crawl as item, i (i)}
							<span class="news-item">{item}</span>
						{/each}
					</span>
				{/each}
			</span>
		</span>
	</div>
</div>

<style>
	.news {
		--news-red: #c8102e;
		--news-navy: #0b1b33;
		margin: var(--widget-gap) 0 0.75rem;
		overflow: hidden;
		font-family: 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif;
		letter-spacing: normal;
		border-radius: 0.5rem;
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 10%, transparent);
	}

	.news-top {
		display: flex;
		align-items: stretch;
		background: var(--news-navy);
	}

	.news-slate {
		padding: 0.4rem 0.75rem;
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		color: #fff;
		background: var(--news-red);
	}

	.news-live {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0 0.7rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #fff;
	}

	.news-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--news-red);
		animation: news-pulse 1.4s ease-in-out infinite;
	}

	.news-bug {
		margin-left: auto;
		align-self: center;
		padding: 0 0.75rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: rgb(255 255 255 / 0.7);
	}

	.news .news-headline {
		margin: 0;
		padding: 0.6rem 0.8rem;
		font-size: 1.05rem;
		font-weight: 800;
		line-height: 1.3;
		color: #111;
		background: #fff;
	}

	.news-ticker {
		display: flex;
		align-items: stretch;
		font-size: 0.78rem;
		color: #fff;
		background: var(--news-navy);
	}

	.news-tag {
		flex: none;
		padding: 0.35rem 0.6rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		color: var(--news-navy);
		background: #ffcb51;
	}

	.news-window {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 1.5rem, #000 calc(100% - 1.5rem), transparent);
	}

	.news-crawl {
		display: inline-flex;
		white-space: nowrap;
		animation: news-crawl 38s linear infinite;
	}

	.news-run {
		display: inline-flex;
	}

	.news-item {
		padding: 0.35rem 0 0.35rem 1.4rem;
	}

	.news-item::before {
		content: '■';
		margin-right: 0.6rem;
		font-size: 0.55em;
		vertical-align: 0.2em;
		color: var(--news-red);
	}

	@keyframes news-crawl {
		to {
			transform: translateX(-50%);
		}
	}

	@keyframes news-pulse {
		50% {
			opacity: 0.25;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.news-crawl,
		.news-dot {
			animation: none;
		}

		.news-window {
			overflow-x: auto;
		}
	}

	@media (max-width: 480px) {
		.news-bug {
			display: none;
		}

		.news .news-headline {
			font-size: 0.95rem;
		}
	}
</style>
