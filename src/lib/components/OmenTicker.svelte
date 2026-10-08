<script lang="ts">
	import type { Block } from '$lib/story';
	import type { RecordSeal as Seal } from '$lib/recordBooks';
	import { linkPeople } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import Material from './Material.svelte';
	import RecordSeal from './RecordSeal.svelte';
	import RecordCite from './RecordCite.svelte';

	type Omens = Extract<Block, { kind: 'omens' }>;

	let { block, year = null }: { block: Omens; year?: number | null } = $props();

	/** Each portent lands this long after the one before. */
	const STAGGER_MS = 380;
	const NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

	let title = $derived(reading.lang === 'ko' && block.ko ? block.ko : block.title);
	let titleSub = $derived(reading.lang === 'both' && block.ko && block.title ? block.ko : undefined);
	let inked = $state(false);

	function stamp(i: number): Seal {
		return {
			text: NUMERALS[i] ?? String(i + 1),
			shape: 'square',
			color: '#b8302a',
			cut: 'intaglio',
			tilt: i % 2 ? 4 : -5
		};
	}

	const ink = onceInView(() => {
		inked = true;
	}, { threshold: 0.2 });
</script>

<figure class="omens" class:inked {@attach ink}>
	<Material kind="paper" />
	<header class="head">
		<span class="mark" lang="zh-Hant" aria-hidden="true">兆</span>
		<span class="titles">
			<span class="title">{title ?? (reading.lang === 'ko' ? '징조' : 'Portents')}</span>
			{#if titleSub && titleSub !== title}<span class="title-sub" lang="ko">{titleSub}</span>{/if}
		</span>
	</header>
	<ol class="list">
		{#each block.omens as omen, i (i)}
			{@const ko = reading.lang !== 'en' ? omen.ko : undefined}
			{@const en = reading.lang === 'ko' && ko ? undefined : omen.html}
			<li style:--d="{i * STAGGER_MS}ms">
				<span class="stamp">
					<RecordSeal seal={stamp(i)} {inked} delay={i * STAGGER_MS} />
				</span>
				<div class="omen">
					{#if omen.hanja}<p class="hanja" lang="zh-Hant">{omen.hanja}</p>{/if}
					{#if en}<p class="en">{@html linkPeople(en, year)}</p>{/if}
					{#if ko}<p class="ko" lang="ko">{@html linkPeople(ko, year)}</p>{/if}
					{#if omen.source}
						<span class="tag"><RecordCite source={omen.source} {inked} delay={i * STAGGER_MS + 200} compact /></span>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</figure>

<style>
	.omens {
		--text-ko: color-mix(in srgb, var(--quote) 88%, var(--fg-strong));
		--text-en: color-mix(in srgb, var(--quote) 70%, var(--fg-dim));
		--text-cite: color-mix(in srgb, var(--quote) 70%, var(--fg-strong));
		--text-faint: color-mix(in srgb, var(--quote) 45%, var(--fg-faint));
		position: relative;
		isolation: isolate;
		margin: var(--widget-gap) 0;
		padding: 1rem 1.2rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--quote) 22%, transparent);
		border-radius: var(--widget-radius);
		background: color-mix(in srgb, var(--quote) 7%, transparent);
	}

	.head {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 0.7rem;
	}

	.mark {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.6rem;
		font-weight: 900;
		line-height: 1;
		color: #b8302a;
	}

	.titles {
		display: grid;
	}

	.title {
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-cite);
	}

	.title-sub {
		font-size: 0.74rem;
		color: var(--text-faint);
	}

	.list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
	}

	li {
		display: grid;
		grid-template-columns: 2.2rem minmax(0, 1fr);
		gap: 0.75rem;
		padding: 0.65rem 0;
		border-top: 1px dashed color-mix(in srgb, var(--quote) 20%, transparent);
	}

	.stamp {
		display: grid;
		justify-items: center;
		padding-top: 0.15rem;
	}

	.stamp :global(.seal) {
		font-size: 1rem;
	}

	/* The words follow their stamp down. */
	.omen {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
		opacity: 0;
		transform: translateX(-0.4rem);
		transition:
			opacity 360ms var(--ease),
			transform 360ms var(--ease);
		transition-delay: calc(var(--d) + 180ms);
	}

	.inked .omen {
		opacity: 1;
		transform: none;
	}

	.omen p {
		margin: 0;
	}

	.hanja {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.02rem;
		letter-spacing: 0.12em;
		color: var(--text-ko);
	}

	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		color: var(--text-en);
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		color: var(--text-ko);
	}

	.tag {
		margin-top: 0.15rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.omen {
			transition: none;
		}
	}
</style>
