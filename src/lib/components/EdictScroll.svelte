<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople, byId } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { onceInView, prefersReducedMotion } from '$lib/inView';
	import Avatar from './Avatar.svelte';
	import Material from './Material.svelte';
	import RecordCite from './RecordCite.svelte';
	import RecordOriginal from './RecordOriginal.svelte';
	import RecordNotes, { supMarks } from './RecordNotes.svelte';
	import { balance } from './balance';

	type Edict = Extract<Block, { kind: 'edict' }>;

	let { block, year = null }: { block: Edict; year?: number | null } = $props();

	/** Longer than this, the edict is written across instead of in columns. */
	const COLUMN_MAX = 240;
	const UNROLL_MS = 1100;

	let emperor = $derived(block.person ? byId.get(block.person) : undefined);
	let length = $derived([...(block.hanja ?? '').replace(/\s+/g, '')].length);
	let columns = $derived(length > 0 && length <= COLUMN_MAX);
	let perColumn = $derived(Math.min(16, Math.max(8, Math.ceil(Math.sqrt(length * 1.4)))));
	/** One translation beside the original in a single language; both in 'both'. */
	let showKo = $derived(!!block.ko && reading.lang !== 'en');
	let showEn = $derived(reading.lang !== 'ko' || !block.ko);
	let open = $state(false);
	let inked = $state(false);

	const unroll = onceInView(() => {
		open = true;
		if (prefersReducedMotion()) {
			inked = true;
			return;
		}
		const t = setTimeout(() => (inked = true), UNROLL_MS * 0.7);
		return () => clearTimeout(t);
	}, { threshold: 0.3 });
</script>

<figure class="edict" class:open {@attach unroll}>
	{#if emperor || block.title}
		<header class="head">
			{#if emperor}<Avatar person={emperor} {year} size="2.2rem" label />{/if}
			{#if block.title}<span class="title">{block.title}</span>{/if}
		</header>
	{/if}
	<div class="scroll">
		<div class="silk">
			<Material kind="silk" />
			<span class="clouds top" aria-hidden="true"></span>
			<div class="field" class:stacked={!columns} {@attach balance('.text', '.trans')}>
				<span class="heading" lang="zh-Hant" aria-hidden="true">奉天承運</span>
				<span class="heading big" lang="zh-Hant">聖旨</span>
				{#if block.hanja}
					<div class="text" class:columns>
						<RecordOriginal text={block.hanja} {inked} {columns} {perColumn} />
					</div>
				{/if}
				<div class="trans" class:shown={inked}>
					{#if showKo}
						<p class="ko" lang="ko">{@html supMarks(linkPeople(block.ko ?? '', year), block.notes)}</p>
					{/if}
					{#if showEn}
						<blockquote class="en">{@html supMarks(linkPeople(block.html, year), block.notes)}</blockquote>
					{/if}
				</div>
			</div>
			<footer class="foot" class:shown={inked}>
				<RecordNotes notes={block.notes} {year} />
				<RecordCite source={block.source} {inked} delay={Math.min(length, 60) * 26 + 200} />
			</footer>
			<span class="clouds bottom" aria-hidden="true"></span>
		</div>
		<span class="roller left" aria-hidden="true"></span>
		<span class="roller right" aria-hidden="true"></span>
	</div>
</figure>

<style>
	.edict {
		--silk: #e9c650;
		--silk-deep: #d2a630;
		--silk-hi: #f2d677;
		--silk-ink: #2b1d07;
		--silk-ink-soft: #3a2707;
		--silk-ink-faint: #4a3410;
		--silk-red: #8e1c12;
		--wood: #5a3418;
		margin: var(--widget-gap) 0;
	}

	/* Night silk: the imperial yellow sinks to old gold, the ink turns to gold leaf. */
	:global(html:not([data-theme='light'])) .edict {
		--silk: #3a2b0f;
		--silk-deep: #261b08;
		--silk-hi: #47350f;
		--silk-ink: #f3e2b0;
		--silk-ink-soft: #e2cf9c;
		--silk-ink-faint: #cdb986;
		--silk-red: #f2846a;
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.8rem;
		margin-bottom: 0.7rem;
	}

	.title {
		font-family: var(--serif);
		font-size: 0.8rem;
		font-style: italic;
		color: var(--fg-faint);
	}

	.scroll {
		position: relative;
		container-type: inline-size;
		padding: 0 0.7rem;
	}

	/* The silk opens from the middle outward as the rollers part. */
	.silk {
		--glyph: var(--silk-ink);
		--rule: color-mix(in srgb, var(--silk-ink) 22%, transparent);
		--text-cite: var(--silk-ink-soft);
		--text-faint: var(--silk-ink-faint);
		position: relative;
		isolation: isolate;
		padding: 1.5rem 1.6rem;
		color: var(--silk-ink);
		background:
			linear-gradient(180deg, rgb(255 255 255 / 0.18), transparent 22%, transparent 78%, rgb(120 70 0 / 0.12)),
			linear-gradient(90deg, var(--silk-deep), var(--silk) 12%, var(--silk-hi) 50%, var(--silk) 88%, var(--silk-deep));
		clip-path: inset(0 50% 0 50%);
		transition: clip-path 1100ms cubic-bezier(0.65, 0, 0.35, 1);
	}

	/* Open, the clip leaves room for the panel line and its print shadow. */
	.open .silk {
		clip-path: inset(-2rem -0.6rem -2rem -0.6rem);
	}

	/* A running band of cloud scrolls where a dragon border would be woven. */
	.clouds {
		position: absolute;
		left: 0.6rem;
		right: 0.6rem;
		height: 0.85rem;
		opacity: 0.55;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='14' viewBox='0 0 44 14'%3E%3Cg fill='none' stroke='%237a5310' stroke-width='1.2' stroke-linecap='round'%3E%3Cpath d='M2 11c0-4 5-6 8-3c0-4 6-5 8-1c2-3 7-2 7 2'/%3E%3Cpath d='M8 9a2 2 0 1 1 2-1'/%3E%3Cpath d='M27 11h4c3 0 4-3 7-3s4 2 4 3'/%3E%3C/g%3E%3C/svg%3E") repeat-x center / auto 100%;
		border-block: 1px solid rgb(122 83 16 / 0.45);
	}

	.top {
		top: 0.45rem;
	}

	.bottom {
		bottom: 0.45rem;
	}

	/* Right to left: the formula, the title, then the text in columns. */
	.field {
		display: flex;
		flex-direction: row-reverse;
		align-items: flex-start;
		gap: 0.9rem;
		padding: 0.7rem 0 0.4rem;
	}

	.heading {
		writing-mode: vertical-rl;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.3em;
		opacity: 0.7;
	}

	.heading.big {
		font-size: 1.5rem;
		font-weight: 900;
		letter-spacing: 0.2em;
		opacity: 1;
		color: var(--silk-red);
	}

	.text {
		flex: 1;
		min-width: 0;
	}

	/* Columns that outgrow their share of the silk scroll sideways, starting from the right. */
	.text.columns {
		flex: 0 1 auto;
		max-width: 58%;
		writing-mode: vertical-rl;
		overflow-x: auto;
		scrollbar-width: thin;
	}

	/* The translation is written on the same silk, left of the columns or under a long text. */
	.trans {
		flex: 1 1 14rem;
		display: grid;
		align-content: start;
		gap: 0.6rem;
		min-width: 0;
		padding-right: 0.9rem;
		border-right: 1px solid var(--rule);
		opacity: 0;
		transform: translateY(0.3rem);
		transition:
			opacity 700ms var(--ease) 500ms,
			transform 700ms var(--ease) 500ms;
	}

	.stacked {
		flex-wrap: wrap;
	}

	.stacked .trans {
		flex-basis: 100%;
		padding: 0.8rem 0 0;
		border-right: none;
		border-top: 1px solid var(--rule);
	}

	/* A long translation beside short columns: the columns keep the top, the translation runs under in two. */
	.field:global([data-balance='band']) {
		flex-wrap: wrap;
	}

	.field:global([data-balance='band']) .text.columns {
		flex: 1 1 0;
		max-width: none;
	}

	.field:global([data-balance='band']) .trans {
		display: block;
		flex-basis: 100%;
		padding: 0.8rem 0 0;
		border-right: none;
		border-top: 1px solid var(--rule);
		columns: 2 14rem;
		column-gap: 1.6rem;
		column-rule: 1px solid var(--rule);
	}

	.field:global([data-balance='band']) .trans > * + * {
		margin-top: 0.6rem;
	}

	.trans.shown,
	.foot.shown {
		opacity: 1;
		transform: none;
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--silk-ink);
	}

	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--silk-ink-soft);
	}

	.ko + .en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		color: var(--silk-ink-faint);
	}

	.foot {
		display: grid;
		gap: 0.6rem;
		margin-top: 0.9rem;
		padding-bottom: 0.4rem;
		opacity: 0;
		transition: opacity 700ms var(--ease) 900ms;
	}

	.foot :global(.record-notes) {
		margin-top: 0;
	}

	@container (max-width: 34rem) {
		.field {
			flex-wrap: wrap;
		}

		.text.columns {
			flex: 1 1 0;
			max-width: none;
		}

		.trans {
			flex-basis: 100%;
			padding: 0.8rem 0 0;
			border-right: none;
			border-top: 1px solid var(--rule);
		}
	}

	.text :global(.original) {
		font-weight: 600;
	}

	.text.columns :global(.original) {
		padding-right: 0;
		border-right: none;
	}

	/* Wooden rollers with turned knobs, pressed together until the edict opens. */
	.roller {
		position: absolute;
		top: -0.55rem;
		bottom: -0.55rem;
		width: 0.95rem;
		border-radius: 0.45rem;
		background: linear-gradient(90deg, #3a2010, var(--wood) 30%, #8a5a30 50%, var(--wood) 70%, #3a2010);
		box-shadow: 0 8px 14px -8px rgb(0 0 0 / 0.7);
		transition: transform 1100ms cubic-bezier(0.65, 0, 0.35, 1);
	}

	.roller::before,
	.roller::after {
		content: '';
		position: absolute;
		left: -0.12rem;
		right: -0.12rem;
		height: 0.55rem;
		border-radius: 0.3rem;
		background: linear-gradient(90deg, #6b4a12, #d8b04a 50%, #6b4a12);
	}

	.roller::before {
		top: -0.2rem;
	}

	.roller::after {
		bottom: -0.2rem;
	}

	.roller.left {
		left: 0;
		transform: translateX(calc(50cqw - 0.95rem));
	}

	.roller.right {
		right: 0;
		transform: translateX(calc(-50cqw + 0.95rem));
	}

	.open .roller {
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.silk,
		.roller,
		.trans,
		.foot {
			transition: none;
		}
	}

	@media (max-width: 560px) {
		.silk {
			padding: 1.4rem 1rem;
		}
	}
</style>
