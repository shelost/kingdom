<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople, byId, nameOf } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import Avatar from './Avatar.svelte';
	import Material from './Material.svelte';
	import RecordCite from './RecordCite.svelte';
	import RecordOriginal from './RecordOriginal.svelte';
	import RecordNotes, { supMarks } from './RecordNotes.svelte';

	type Covenant = Extract<Block, { kind: 'covenant' }>;

	let { block, year = null }: { block: Covenant; year?: number | null } = $props();

	const COLUMN_MAX = 90;
	const uid = $props.id();

	let parties = $derived(block.parties.map((id) => ({ id, person: byId.get(id) })));
	let length = $derived([...(block.hanja ?? '').replace(/\s+/g, '')].length);
	let columns = $derived(length > 0 && length <= COLUMN_MAX);
	let inked = $state(false);

	const ink = onceInView(() => {
		inked = true;
	}, { threshold: 0.3 });
</script>

<figure class="covenant ink-plate" class:columns class:inked {@attach ink}>
	<Material kind="paper" />
	<span class="plate-tab">{reading.lang === 'en' ? 'Covenant' : '맹약 · Covenant'}</span>
	<header class="parties">
		<svg class="cord" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
			<path d="M0 5 C 12 1, 22 9, 34 5 S 56 1, 66 5 S 88 9, 100 5" />
		</svg>
		{#each parties as party (party.id)}
			<span class="party">
				{#if party.person}
					<Avatar person={party.person} {year} size="2.5rem" />
					<span class="party-name">{nameOf(party.person, year)}</span>
				{:else}
					<span class="party-mark" aria-hidden="true">{[...party.id][0]}</span>
					<span class="party-name">{party.id}</span>
				{/if}
			</span>
		{/each}
	</header>
	{#if block.title}<p class="title">{block.title}</p>{/if}
	<div class="text">
		{#if block.hanja}
			<RecordOriginal text={block.hanja} {inked} {columns} perColumn={12} />
		{/if}
		<div class="body">
			{#if block.ko}
				<p class="ko" lang="ko">{@html supMarks(linkPeople(block.ko, year), block.notes)}</p>
			{/if}
			<blockquote class="en">{@html supMarks(linkPeople(block.html, year), block.notes)}</blockquote>
			<RecordNotes notes={block.notes} {year} />
			<RecordCite source={block.source} {inked} delay={Math.min(length, 60) * 26 + 300} />
		</div>
	</div>
	<!-- The oath is sealed: blood smeared across the corner, a thumb pressed in it. -->
	<svg class="blood" viewBox="0 0 120 120" aria-hidden="true">
		<defs>
			<filter id="rough-{uid}" x="-20%" y="-20%" width="140%" height="140%">
				<feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="7" />
				<feDisplacementMap in="SourceGraphic" scale="14" />
			</filter>
			<radialGradient id="clot-{uid}" cx="62%" cy="58%" r="60%">
				<stop offset="0" stop-color="#5e0b0b" stop-opacity="0.9" />
				<stop offset="0.55" stop-color="#7d1212" stop-opacity="0.65" />
				<stop offset="1" stop-color="#9b1c1c" stop-opacity="0" />
			</radialGradient>
		</defs>
		<g filter="url(#rough-{uid})">
			<path class="smear" fill="url(#clot-{uid})" d="M118 58c-4 22-22 46-48 52c-20 4-44-2-52-10c14 2 30-2 40-12c-8-2-18 0-26-2c14-6 30-14 38-30c8-14 22-24 48 2z" />
		</g>
		<g class="thumb" fill="none" stroke="#6d0f0f" stroke-width="1.1">
			<ellipse cx="78" cy="76" rx="15" ry="19" />
			<ellipse cx="78" cy="77" rx="11" ry="14.5" />
			<ellipse cx="78" cy="78" rx="7" ry="10" />
			<ellipse cx="78" cy="79" rx="3.4" ry="5.5" />
		</g>
	</svg>
</figure>

<style>
	.covenant {
		--glyph: var(--sumi);
		--rule: color-mix(in srgb, var(--sumi) 18%, transparent);
		--text-cite: #7d1212;
		--text-faint: var(--sumi-dim);
		isolation: isolate;
		padding: 1.6rem 1.3rem 1.2rem;
	}

	:global(html:not([data-theme='light'])) .covenant {
		--text-cite: #e8806f;
	}

	.parties {
		position: relative;
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		gap: 0.6rem;
		margin-bottom: 0.9rem;
	}

	/* A red cord strung from one party to the next. */
	.cord {
		position: absolute;
		left: 12%;
		right: 12%;
		top: 0.95rem;
		width: 76%;
		height: 0.7rem;
		z-index: -1;
		overflow: visible;
	}

	/* Non-scaling stroke measures dashes in screen pixels, so the cord is wiped in, not dashed. */
	.cord path {
		fill: none;
		stroke: #a8231c;
		stroke-width: 1.6;
		vector-effect: non-scaling-stroke;
	}

	.cord {
		clip-path: inset(-50% 100% -50% 0);
		transition: clip-path 900ms var(--ease);
	}

	.inked .cord {
		clip-path: inset(-50% 0 -50% 0);
	}

	.party {
		display: grid;
		justify-items: center;
		gap: 0.3rem;
		min-width: 0;
	}

	.party-mark {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		font-family: 'Noto Serif KR', var(--serif);
		font-weight: 800;
		color: var(--hanji);
		background: var(--sumi);
	}

	.party-name {
		font-family: var(--serif);
		font-size: 0.74rem;
		font-weight: 600;
		text-align: center;
		color: var(--sumi);
	}

	.title {
		margin: 0 0 0.8rem;
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-align: center;
		color: var(--sumi-dim);
	}

	.text {
		display: grid;
		gap: 0.9rem 1.4rem;
	}

	.columns .text {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: start;
	}

	.body {
		display: grid;
		gap: 0.45rem;
		min-width: 0;
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--sumi);
	}

	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--sumi-dim);
	}

	.blood {
		position: absolute;
		right: -0.4rem;
		bottom: -0.4rem;
		width: 7.5rem;
		height: 7.5rem;
		pointer-events: none;
		mix-blend-mode: multiply;
	}

	/* Multiply vanishes on night paper; the blood sits on top instead. */
	:global(html:not([data-theme='light'])) .blood {
		mix-blend-mode: normal;
		filter: saturate(1.2) brightness(1.25);
	}

	.smear {
		transform-origin: 100% 60%;
		transform: scale(0.15);
		opacity: 0;
		transition:
			transform 1600ms cubic-bezier(0.2, 0.7, 0.2, 1) 500ms,
			opacity 500ms ease-out 500ms;
	}

	.thumb {
		opacity: 0;
		transition: opacity 600ms ease-out 1500ms;
	}

	.inked .smear {
		transform: none;
		opacity: 0.8;
	}

	.inked .thumb {
		opacity: 0.4;
	}

	@media (prefers-reduced-motion: reduce) {
		.smear,
		.thumb,
		.cord {
			transition: none;
		}
	}

	@media (max-width: 560px) {
		.columns .text {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
