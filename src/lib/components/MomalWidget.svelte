<script lang="ts">
	/** One inline card in a Momal answer, chosen by the widget's `type`. */
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { reading } from '$lib/reading.svelte';
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { momalRefs } from '$lib/momalRefs.svelte';
	import { MOMAL_LAYERS, momalEpisodeHref } from '$lib/momal';
	import { storyImg } from '$lib/img';
	import { openLightbox } from '$lib/imageLightbox.svelte';
	import type { MomalWidget } from '$lib/momalTypes';
	import MomalPerson from '$lib/components/MomalPerson.svelte';
	import MomalSplit from '$lib/components/MomalSplit.svelte';
	import MomalTimeline from '$lib/components/MomalTimeline.svelte';
	import MomalStory from '$lib/components/MomalStory.svelte';
	import MomalKin from '$lib/components/MomalKin.svelte';
	import MomalFamily from '$lib/components/MomalFamily.svelte';

	let { widget, pending }: { widget?: MomalWidget; pending?: string } = $props();

	const ko = $derived(reading.lang === 'ko');

	const PENDING: Record<string, { en: string; ko: string }> = {
		split: { en: 'Setting the record beside the story…', ko: '기록과 이야기를 나란히 놓는 중…' },
		people: { en: 'Fetching portraits…', ko: '초상을 꺼내는 중…' },
		relation: { en: 'Tracing the tie…', ko: '관계를 잇는 중…' },
		timeline: { en: 'Laying out the years…', ko: '연표를 펼치는 중…' },
		quote: { en: 'Copying the passage…', ko: '구절을 옮기는 중…' },
		episodes: { en: 'Finding the episodes…', ko: '에피소드를 찾는 중…' },
		gallery: { en: 'Pulling stills…', ko: '스틸을 꺼내는 중…' },
		story: { en: 'Opening the book to the page…', ko: '책을 그 쪽으로 펼치는 중…' },
		kin: { en: 'Climbing the family tree…', ko: '족보를 거슬러 오르는 중…' },
		family: { en: 'Gathering the household…', ko: '집안을 모으는 중…' }
	};
	const pendingCopy = $derived(PENDING[pending ?? ''] ?? { en: 'Drawing…', ko: '그리는 중…' });

	$effect(() => {
		if (widget?.type === 'episodes') momalRefs.want([], widget.ids);
		if (widget?.type === 'gallery') momalRefs.want([widget.person]);
	});

	function thumb(src: string) {
		const a = storyImg(src, { kind: 'thumb' });
		return { src: a.src, srcset: a.srcset, sizes: a.sizes };
	}

	function openStills(person: string, index: number, from: EventTarget | null) {
		const stills = momalRefs.stills(person) ?? [];
		openLightbox(
			stills.map((s) => ({ src: s.src, alt: s.alt, title: s.episodeTitle, caption: s.alt, episodeId: s.episode })),
			index,
			{ from }
		);
	}
</script>

{#if !widget}
	<div
		class="skeleton"
		class:tall={['split', 'timeline', 'story', 'kin', 'family'].includes(pending ?? '')}
		aria-hidden="true"
	>
		<span class="shimmer">{ko ? pendingCopy.ko : pendingCopy.en}</span>
	</div>
{:else}
	<div class="widget" in:fly={{ y: 10, duration: 420, easing: cubicOut }}>
		{#if widget.type === 'split'}
			<MomalSplit {widget} />
		{:else if widget.type === 'story'}
			<MomalStory id={widget.id} note={widget.note} />
		{:else if widget.type === 'kin'}
			<MomalKin a={widget.a} b={widget.b} />
		{:else if widget.type === 'family'}
			<MomalFamily person={widget.person} />
		{:else if widget.type === 'timeline'}
			<MomalTimeline {widget} />
		{:else if widget.type === 'people'}
			<div class="people" class:solo={widget.ids.length === 1}>
				{#each widget.ids as id (id)}<MomalPerson {id} />{/each}
			</div>
			{#if widget.note}<p class="note">{widget.note}</p>{/if}
		{:else if widget.type === 'relation'}
			{@const layer = MOMAL_LAYERS[widget.layer ?? 'record']}
			<div class="relation">
				<MomalPerson id={widget.a} compact />
				<div class="tie">
					<span class="line"></span>
					<span class="what">{widget.label}</span>
					<span class="layer {widget.layer ?? 'record'}">
						<span class="material-symbols-outlined" aria-hidden="true">{layer.icon}</span>
						{ko ? layer.ko : layer.en}
					</span>
				</div>
				<MomalPerson id={widget.b} compact />
			</div>
		{:else if widget.type === 'quote'}
			<figure class="quote">
				{#if widget.hanja}<blockquote class="hanja" lang="zh-Hant">{widget.hanja}</blockquote>{/if}
				{#if ko && widget.ko}
					<p lang="ko">{widget.ko}</p>
				{:else if widget.en}
					<p>{widget.en}</p>
				{:else if widget.ko}
					<p lang="ko">{widget.ko}</p>
				{/if}
				<figcaption>
					<span class="material-symbols-outlined" aria-hidden="true">{MOMAL_LAYERS.record.icon}</span>
					{widget.source}
				</figcaption>
			</figure>
		{:else if widget.type === 'episodes'}
			<div class="episodes">
				{#each widget.ids as id (id)}
					{@const ep = momalRefs.episode(id)}
					<a class="ep" href={momalEpisodeHref(ep?.queryId ?? id)} onclick={() => storyAsk.show()}>
						<span class="cover">
							{#if ep?.cover}<img {...thumb(ep.cover)} alt="" loading="lazy" decoding="async" />{/if}
							<span class="play material-symbols-outlined" aria-hidden="true">play_arrow</span>
						</span>
						<span class="ep-text">
							<span class="ep-year">{ep?.year ?? ''}</span>
							<span class="ep-title">{ep?.title ?? id}</span>
							{#if ep?.logline}<span class="ep-line">{ko ? ep.logline.ko : ep.logline.en}</span>{/if}
						</span>
					</a>
				{/each}
			</div>
		{:else if widget.type === 'gallery'}
			{@const person = widget.person}
			{@const stills = momalRefs.stills(person) ?? []}
			{@const who = momalRefs.person(person)}
			{#if stills.length}
				<div class="gallery" aria-label={who?.name}>
					{#each stills as s, i (s.id)}
						<button
							type="button"
							class="still"
							onclick={(e) => openStills(person, i, e.currentTarget)}
							aria-label={s.alt}
						>
							<img {...thumb(s.src)} alt={s.alt} loading="lazy" decoding="async" />
							<span class="still-ep">{s.episodeTitle}</span>
						</button>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;
	$parchment: #efe3c8;

	.widget {
		width: 100%;
		margin: 0.35rem 0 0.5rem;
	}

	.skeleton {
		width: 100%;
		height: 4.5rem;
		margin: 0.35rem 0 0.5rem;
		display: flex;
		align-items: flex-end;
		padding: 0.75rem 0.9rem;
		border-radius: 20px;
		background:
			linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.06) 50%, transparent 70%) 0 0 / 220% 100%,
			rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
		animation: sweep 1.6s linear infinite;
		&.tall {
			height: 9rem;
		}
	}

	.shimmer {
		font-size: 0.74rem;
		font-weight: 600;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.35), #fff, rgba(255, 255, 255, 0.35)) 0 0 / 200% 100%;
		background-clip: text;
		color: transparent;
		animation: sweep 1.8s linear infinite reverse;
	}

	@keyframes sweep {
		to {
			background-position: -220% 0;
		}
	}

	.people {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: 0.5rem;
		&.solo {
			grid-template-columns: minmax(0, 24rem);
		}
	}

	.note {
		margin: 0.45rem 0 0;
		font-size: 0.78rem;
		color: rgba(255, 255, 255, 0.55);
	}

	.relation {
		display: grid;
		grid-template-columns: 5.5rem 1fr 5.5rem;
		align-items: start;
		gap: 0.4rem;
		padding: 0.9rem 0.6rem 0.75rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	.tie {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		padding-top: 1.35rem;
		text-align: center;
	}

	.line {
		position: absolute;
		top: 1.8rem;
		left: -0.4rem;
		right: -0.4rem;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(90deg, $red, $gold, $blue);
		opacity: 0.55;
	}

	.what {
		position: relative;
		padding: 0.15rem 0.65rem;
		border-radius: 999px;
		background: #0e0e14;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 0.88rem;
		font-weight: 600;
		color: #fff;
	}

	.layer {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		& .material-symbols-outlined {
			font-size: 0.85rem;
		}
		&.record {
			color: $parchment;
		}
		&.chronicle {
			color: $gold;
		}
		&.both {
			color: rgba(255, 255, 255, 0.75);
		}
	}

	.quote {
		margin: 0;
		padding: 0.95rem 1.1rem 0.8rem;
		border-radius: 20px;
		color: rgba($parchment, 0.92);
		background:
			radial-gradient(120% 100% at 0% 0%, rgba($parchment, 0.12), transparent 70%),
			rgba($parchment, 0.04);
		box-shadow: inset 0 0 0 1px rgba($parchment, 0.16);
		& p {
			margin: 0.4rem 0 0;
			font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
			font-size: 0.95rem;
			font-style: italic;
			line-height: 1.55;
		}
	}

	.hanja {
		margin: 0;
		font-family: 'Noto Serif KR', 'Noto Serif TC', serif;
		font-size: 1.12rem;
		line-height: 1.7;
		letter-spacing: 0.04em;
		color: #fff;
	}

	figcaption {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: 0.6rem;
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.04em;
		color: rgba($parchment, 0.6);
		& .material-symbols-outlined {
			font-size: 0.95rem;
		}
	}

	.episodes {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		gap: 0.55rem;
	}

	.ep {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
		background: rgba(255, 255, 255, 0.04);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
		color: inherit;
		text-decoration: none;
		transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
		&:hover {
			transform: translateY(-2px);
			& .play {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1);
			}
			& img {
				transform: scale(1.04);
			}
		}
	}

	.cover {
		position: relative;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		background: linear-gradient(135deg, rgba($red, 0.25), rgba($blue, 0.25));
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
		}
	}

	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.92);
		color: #0a0a0f;
		font-size: 1.5rem;
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.8);
		transition:
			opacity 200ms ease,
			transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	.ep-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding: 0.55rem 0.75rem 0.7rem;
	}

	.ep-year {
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: $gold;
	}

	.ep-title {
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 0.98rem;
		font-weight: 600;
		color: #fff;
	}

	.ep-line {
		font-size: 0.74rem;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.6);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.gallery {
		display: flex;
		gap: 0.45rem;
		overflow-x: auto;
		padding-bottom: 0.3rem;
		scroll-snap-type: x mandatory;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
	}

	.still {
		position: relative;
		flex: 0 0 auto;
		width: 13rem;
		aspect-ratio: 2 / 1;
		padding: 0;
		overflow: hidden;
		border: none;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.05);
		cursor: zoom-in;
		scroll-snap-align: start;
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
		}
		&:hover img {
			transform: scale(1.05);
		}
	}

	.still-ep {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1rem 0.6rem 0.35rem;
		font-size: 0.66rem;
		font-weight: 600;
		text-align: left;
		color: #fff;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton,
		.shimmer {
			animation: none;
		}
	}
</style>
