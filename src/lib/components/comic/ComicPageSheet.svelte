<script lang="ts">
	import ComicSpeech from '$lib/components/comic/ComicSpeech.svelte';
	import { comicArtOf } from '$lib/comicArt';
	import { storyImg } from '$lib/img';
	import { reading } from '$lib/reading.svelte';
	import type { ComicCaption, ComicLine, ComicPage } from '$lib/comic';

	let {
		page,
		year,
		n,
		ink = false,
		series
	}: {
		page: ComicPage;
		year: number;
		n: number;
		ink?: boolean;
		series?: ComicLine;
	} = $props();

	const ko = $derived(reading.lang === 'ko');
	const kind = $derived(page.kind ?? 'page');

	function art(slot: string): string | undefined {
		return comicArtOf(slot)?.displayArt;
	}

	function alt(slot: string): string {
		return comicArtOf(slot)?.slot.alt ?? '';
	}

	function caps(panel: ComicPage['panels'][number]): ComicCaption[] {
		if (panel.captions?.length) return panel.captions;
		if (panel.caption) return [{ ...panel.caption, at: panel.captionAt ?? 'top' }];
		return [];
	}
</script>

<article
	class={['sheet', kind, { ink }]}
	style:--ground={page.ground ?? '#111213'}
	aria-label={ko ? `${n}쪽` : `Page ${n}`}
>
	{#if kind === 'cover'}
		<div class="cover">
			{#if page.logo}
				<p class="logo">{page.logo}</p>
			{/if}
			{#if page.kicker}
				<p class="cover-en">{ko ? page.kicker.ko : page.kicker.en}</p>
			{:else if page.title}
				<p class="cover-en">{ko ? page.title.ko : page.title.en}</p>
			{/if}
		</div>
	{:else}
		{#if kind === 'chapter'}
			<div class="splash" aria-hidden="true">
				{#if page.logo}
					<div class="splash-logo">
						<span class="logo-mark">{page.logo}</span>
						{#if series}
							<span class="logo-sub">{ko ? series.ko : series.en}</span>
						{/if}
					</div>
				{/if}
				{#if page.kicker}
					<p class="splash-kicker">{ko ? page.kicker.ko : page.kicker.en}</p>
				{/if}
			</div>
		{/if}

		{#each page.panels as panel (panel.id)}
			{@const src = art(panel.slot)}
			{@const boxes = caps(panel)}
			<figure
				class={['panel', { tall: panel.rows === 2, circle: panel.shape === 'circle' }]}
				style:--cols={panel.cols}
				style:--rows={panel.rows ?? 1}
			>
				{#if src}
					<img {...storyImg(src, { kind: 'cue', alt: alt(panel.slot), sizes: '720px' })} />
				{:else}
					<div class="empty" aria-hidden="true"></div>
				{/if}
				{#each boxes as box, i (i)}
					<figcaption
						class={['caption', box.at ?? 'top', box.corner ?? 'tl']}
						lang={ko ? 'ko' : 'en'}
					>
						{ko ? box.ko : box.en}
					</figcaption>
				{/each}
				{#if panel.card}
					<aside class="namecard">
						<span class="hangul">{panel.card.hangul}</span>
						<span class="roman">{panel.card.roman}</span>
						<span class="role">{ko ? panel.card.role.ko : panel.card.role.en}</span>
					</aside>
				{/if}
				{#each panel.balloons ?? [] as balloon, i (i)}
					<ComicSpeech {balloon} {year} />
				{/each}
				{#if panel.sfx}
					<span class="sfx" lang={ko ? 'ko' : 'en'}>{ko ? panel.sfx.ko : panel.sfx.en}</span>
				{/if}
			</figure>
		{/each}

		{#if page.footer}
			<p class="footer" lang={ko ? 'ko' : 'en'}>{ko ? page.footer.ko : page.footer.en}</p>
		{/if}
	{/if}
	<span class="folio">{n}</span>
</article>

<style>
	.sheet {
		position: relative;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		grid-auto-rows: minmax(0, 1fr);
		gap: 0.28rem;
		padding: 0.42rem 0.42rem 1.15rem;
		width: 100%;
		height: 100%;
		min-height: 0;
		background: var(--ground, #111213);
		overflow: hidden;
	}

	.sheet.cover {
		display: grid;
		place-items: center;
		padding: 0;
		gap: 0;
	}

	.sheet.chapter {
		padding-top: 3.4rem;
	}

	.cover {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2.4rem;
		width: 100%;
		height: 100%;
		padding: 0 8%;
		box-sizing: border-box;
		text-align: center;
	}

	.logo {
		margin: 0;
		font-family: var(--display-ko);
		font-size: clamp(3.4rem, 18cqw, 5.8rem);
		font-weight: 800;
		line-height: 0.92;
		letter-spacing: -0.04em;
		color: #fff;
		text-shadow:
			0.06em 0 0 #c41e3a,
			-0.04em 0 0 #c41e3a,
			0 0.05em 0 #c41e3a,
			0 -0.03em 0 #c41e3a;
	}

	.cover-en {
		margin: 0;
		max-width: 100%;
		font-family: var(--serif);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #f4f1ea;
		text-align: center;
	}

	.splash {
		position: absolute;
		inset: 0.4rem 0.5rem auto;
		z-index: 4;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
		pointer-events: none;
	}

	.splash-logo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background: #c41e3a;
		color: #fff;
		padding: 0.18rem 0.55rem 0.28rem;
		border-radius: 0.12rem;
	}

	.logo-mark {
		font-family: var(--display-ko);
		font-size: 1.55rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.logo-sub {
		font-size: 0.42rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.9;
	}

	.splash-kicker {
		margin: 0.15rem 0 0;
		padding: 0.2rem 0.45rem;
		font-size: 0.62rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #1a1a1a;
		background: #f4ecd4;
		border: 1.5px solid #1a1a1a;
		text-align: right;
		max-width: 46%;
	}

	.panel {
		position: relative;
		grid-column: span var(--cols);
		grid-row: span var(--rows);
		min-height: 0;
		margin: 0;
		overflow: hidden;
		background: #1a1b1d;
		isolation: isolate;
	}

	.panel.circle {
		background: #000;
	}

	.panel.circle img,
	.panel.circle .empty {
		width: min(92%, 100%);
		height: min(92%, 100%);
		margin: auto;
		border-radius: 50%;
		object-fit: cover;
		clip-path: circle(50% at 50% 50%);
		box-shadow: 0 0 0 3px #f0c14b;
	}

	.panel img,
	.empty {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 46%;
	}

	.sheet.ink .panel img {
		filter: grayscale(1) contrast(1.32) brightness(1.03);
	}

	.empty {
		background:
			repeating-linear-gradient(
				-12deg,
				transparent,
				transparent 10px,
				color-mix(in srgb, #fff 4%, transparent) 10px,
				color-mix(in srgb, #fff 4%, transparent) 11px
			),
			#1c1d20;
		min-height: inherit;
	}

	.caption {
		position: absolute;
		z-index: 2;
		margin: 0;
		max-width: min(72%, 16rem);
		padding: 0.28rem 0.55rem 0.32rem;
		font-size: 0.62rem;
		font-weight: 750;
		line-height: 1.28;
		color: #1a1a1a;
		background: #f4ecd4;
		border: 1.5px solid #1a1a1a;
		pointer-events: none;
	}

	.caption.top,
	.caption.tl {
		top: 4%;
		left: 4%;
	}
	.caption.tr {
		top: 4%;
		right: 4%;
		left: auto;
	}
	.caption.tc {
		top: 4%;
		left: 50%;
		transform: translateX(-50%);
	}
	.caption.bottom,
	.caption.bl {
		top: auto;
		bottom: 5%;
		left: 4%;
	}
	.caption.br {
		top: auto;
		bottom: 5%;
		right: 4%;
		left: auto;
	}
	.caption.bc {
		top: auto;
		bottom: 5%;
		left: 50%;
		transform: translateX(-50%);
	}

	.namecard {
		position: absolute;
		z-index: 3;
		left: 3%;
		top: 50%;
		transform: translateY(-50%);
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		gap: 0.12rem 0.35rem;
		pointer-events: none;
	}

	.namecard .hangul {
		grid-row: 1 / 3;
		writing-mode: vertical-rl;
		font-family: var(--display-ko);
		font-size: 1.35rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.08em;
		color: #fff;
		background: #111;
		padding: 0.45rem 0.22rem;
		border: 2px solid #4aa3ff;
	}

	.namecard .roman {
		align-self: end;
		font-size: 0.72rem;
		font-weight: 850;
		letter-spacing: 0.08em;
		color: #fff;
		background: #111;
		padding: 0.12rem 0.35rem;
	}

	.namecard .role {
		font-size: 0.48rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #111;
		background: #fff;
		padding: 0.1rem 0.3rem;
	}

	.sfx {
		position: absolute;
		bottom: 10%;
		right: 8%;
		z-index: 2;
		font-weight: 900;
		font-size: 1.05rem;
		letter-spacing: 0.04em;
		color: #f4f1ea;
		text-shadow: 0 0.1rem 0 #000;
		pointer-events: none;
		transform: rotate(-8deg);
	}

	.footer {
		position: absolute;
		left: 50%;
		bottom: 0.18rem;
		z-index: 4;
		transform: translateX(-50%);
		margin: 0;
		padding: 0.18rem 0.85rem 0.22rem;
		font-size: 0.58rem;
		font-weight: 850;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #f4f1ea;
		background: #111;
		border-radius: 999px;
		pointer-events: none;
	}

	.folio {
		position: absolute;
		right: 0.55rem;
		bottom: 0.22rem;
		z-index: 3;
		font-size: 0.62rem;
		font-weight: 750;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		color: color-mix(in srgb, #fff 55%, transparent);
		pointer-events: none;
	}

	@media (max-width: 40rem) {
		.sheet {
			gap: 0.2rem;
			padding: 0.28rem 0.28rem 0.95rem;
		}
		.sheet.chapter {
			padding-top: 2.7rem;
		}
		.caption {
			font-size: 0.54rem;
		}
		.logo {
			font-size: 3.4rem;
		}
	}
</style>
