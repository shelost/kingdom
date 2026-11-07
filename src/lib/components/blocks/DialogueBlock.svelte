<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { ImageSlot } from '$lib/story';
	import {
		avatarOf,
		byId,
		colorOf,
		godRingOf,
		hangulInitial,
		isPlaceholderArt,
		placeholderFor,
		type Person
	} from '$lib/people';
	import { reading, isStageMode, leadLang, activateDialogue } from '$lib/reading.svelte';
	import { unnamedKo } from '$lib/unnamedKo';
	import { affiliationOf, badgeOf, handleOf } from '$lib/tweet';
	import { speakerName } from '$lib/chat';
	import { utteranceOf } from '$lib/speech.svelte';
	import { storyImg } from '$lib/img';
	import { lineCount, type BlockScene, type Dialogue } from '$lib/blockScene';
	import SpeakerName from '../SpeakerName.svelte';
	import VerifiedBadge from '../VerifiedBadge.svelte';
	import ImageStack from '../ImageStack.svelte';
	import SpeakButton from '../SpeakButton.svelte';

	let {
		block,
		scene,
		/** A still that opens on a post rides inside it, as attached media. */
		media,
		arrive
	}: {
		block: Dialogue;
		scene: BlockScene;
		media?: ImageSlot[];
		arrive: Attachment<HTMLElement>;
	} = $props();

	let koFirst = $derived(leadLang(reading.lang) === 'ko');
	let nameLang = $derived<'en' | 'ko'>(reading.lang === 'en' ? 'en' : 'ko');

	let p = $derived(block.person ? byId.get(block.person) : undefined);
	let year = $derived(scene.yearAt(block));
	let look = $derived(scene.lookOf(block));
	let form = $derived(scene.formOf(block));
	let thread = $derived(scene.threadOf(block));
	let spoken = $derived(utteranceOf(block.lines, block.en, p?.id ?? null));
</script>

<!-- Who is talking, then the lines. Shared by the plain rendering and the clickable stage one. -->
{#snippet utterance(p: Person | undefined)}
	{#if form === 'post' && p}
		{@const replyTo = thread?.replyTo}
		{@const answered = replyTo?.person ? byId.get(replyTo.person) : undefined}
		{@const monarch = scene.reigns(block, p)}
		{@const badge = badgeOf(p, year, look, monarch)}
		{@const org = affiliationOf(p, year)}
		<span class="tweet-head">
			<span class="tweet-name person" data-person={p.id}><SpeakerName name={speakerName(p, year, look, nameLang)} /></span>
			{#if badge}<VerifiedBadge {badge} />{/if}
			{#if org}
				<span class="org person" data-person={org.id} style:--org={org.color} title={org.name}>{org.glyph}</span>
			{/if}
			<span class="tweet-meta">{handleOf(p, year, look, monarch)}</span>
		</span>
		{#if answered && replyTo}
			<span class="tweet-reply"
				>Replying to <span class="handle person" data-person={answered.id}
					>{handleOf(answered, year, scene.lookOf(replyTo), scene.reigns(replyTo, answered))}</span
				></span
			>
		{/if}
	{:else if p && !scene.quiet.has(block)}
		<span class="who"><span class="person" data-person={p.id}><SpeakerName name={speakerName(p, year, look, nameLang)} /></span></span>
	{:else if p}
		<span class="sr-only">{speakerName(p, year, look, nameLang)}</span>
	{:else if block.speaker}
		<span class="speaker">{nameLang === 'ko' ? unnamedKo(block.speaker) : block.speaker}</span>
	{/if}
	{#each { length: lineCount(block) } as _, j (j)}
		{@const ko = reading.lang === 'en' ? undefined : block.lines[j]}
		{@const en = reading.lang === 'ko' ? undefined : block.en?.[j]}
		<!-- The language the reader chose leads at body size; every other tongue
		     follows underneath it, a step smaller and a shade through. Each line
		     is one message: a bubble in comic mode, invisible otherwise. -->
		<span class="msg">
			{#if koFirst}
				{#if ko}
					<span class="line ko lead">{@html ko}</span>
				{/if}
				{#if en}
					<span class="line en" class:lead={!ko} class:sub={!!ko}>{@html en}</span>
				{/if}
			{:else}
				{#if en}
					<span class="line en lead">{@html en}</span>
				{/if}
				{#if ko}
					<span class="line ko" class:lead={!en} class:sub={!!en}>{@html ko}</span>
				{/if}
			{/if}
			<!-- Native CN/JP subtitle + transcription: always shown when present -->
			{#if block.zh?.[j]}
				<span class="line zh sub">{@html block.zh[j]}</span>
			{/if}
			{#if block.zhLatn?.[j]}
				<span class="line zh-latn sub">{block.zhLatn[j]}</span>
			{/if}
			{#if block.ja?.[j]}
				<span class="line ja sub">{@html block.ja[j]}</span>
			{/if}
			{#if block.jaLatn?.[j]}
				<span class="line ja-latn sub">{block.jaLatn[j]}</span>
			{/if}
			{#if block.mnc?.[j]}
				<span class="line mnc sub">{block.mnc[j]}</span>
			{/if}
		</span>
	{/each}
{/snippet}

<div
	class="dialogue"
	class:as-msg={form === 'message'}
	class:as-post={form === 'post'}
	class:carded={scene.carded(block)}
	class:wechat={form === 'message' && !!block.zh?.length}
	class:line-app={form === 'message' && !block.zh?.length && !!block.ja?.length}
	class:thread-above={thread?.above}
	class:thread-below={thread?.below}
	style:--chip={p ? colorOf(p) : block.chip}
	data-speaker={p?.id ?? undefined}
	data-look={look ?? undefined}
	data-sky={scene.moods.get(block)?.weather}
	{@attach arrive}
>
	{#if p}
		{@const maidSeed = p.id === 'courtmaid' ? (block.lines ?? block.en ?? []).join('\n') : undefined}
		{@const art = avatarOf(p, maidSeed, year, look)}
		{@const who = speakerName(p, year, look, nameLang)}
		{@const ring = godRingOf(p)}
		<button
			type="button"
			class="face person"
			class:monarch={scene.squared(block, p)}
			class:god-ring={!!ring}
			class:silhouette={isPlaceholderArt(art) && p.id !== 'courtmaid'}
			style:--god-ring={ring}
			data-person={p.id}
			title={who}
			aria-label={who}
		>
			{#if art}
				<img {...storyImg(art, { kind: 'thumb', alt: '', sizes: '44px' })} />
			{:else}
				<span class="initial">{hangulInitial(p)}</span>
			{/if}
		</button>
	{:else}
		{@const stand = placeholderFor(block.speaker, block.gender)}
		<span class="face silhouette unnamed" aria-hidden="true">
			{#if stand}<img {...storyImg(stand, { kind: 'thumb', alt: '', sizes: '44px' })} />{/if}
		</span>
	{/if}
	<!-- Immersion / cinema: the lines are a control — click one to put it
	     on stage. Only speakers with a profile can hold a stage, so only
	     those become clickable; everything else stays plain prose. -->
	{#if p && isStageMode(reading.mode)}
		<button type="button" class="lines pick" title="Speak this line" onclick={(e) => activateDialogue(e.currentTarget)}>
			{@render utterance(p)}
		</button>
	{:else}
		<div class="lines">
			{@render utterance(p)}
		</div>
	{/if}
	{#if media?.length && form === 'post'}
		<div class="tweet-media">
			<ImageStack images={media} inline />
		</div>
	{/if}
	<!-- Hear the line: parked in the gutter under the face, out of the
	     text's way, and out of flow so it changes no measurement. -->
	<SpeakButton utterance={spoken} />
</div>

<style lang="scss">
	.dialogue {
		position: relative;
		display: grid;
		grid-template-columns: 2.15rem 1fr;
		gap: 0.75rem;
		margin: 1.25rem 0;
		/* Mixed from the page itself, so a bubble stays a step off any ground: night, paper or flashback. */
		--bubble: color-mix(in srgb, var(--fg) 11%, var(--bg));
		--bubble-ink: var(--fg);
		--post-pad: 1.15rem;
		--post-face: 2.5rem;
		transition: background 420ms var(--ease), box-shadow 420ms var(--ease), opacity 420ms var(--ease), padding 420ms var(--ease), margin 420ms var(--ease);
	}

	/* Stage modes (immersion + cinema): script lines stay; the live line gets a
	soft featured pulse and the rest steps back — but never so far that the
	page reads as empty. Neighbours stay skimmable. */

	:global(html.is-stage) .dialogue:not(:global(.is-speaking)) {
		opacity: 0.74;
	}

	/* The lit wash is the whole cue — no edge rule, so the line reads as a
	raised piece of the page rather than a quoted block. */

	:global(html.is-stage) .dialogue:global(.is-speaking) {
		margin-left: -0.55rem;
		padding: 0.45rem 0.65rem 0.45rem 0.55rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--chip) 12%, color-mix(in srgb, var(--fg) 4%, transparent));
		opacity: 1;
	}

	/* ————— Cinema lettering —————
	A balloon around every cue, and the translation kept deliberately under
	its breath so a bilingual panel still reads as one voice. */

	:global(html.is-cinema) .dialogue {
		margin: 1.05rem 0;
		padding: 0.5rem 0.8rem 0.55rem 0.6rem;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--plate-ink) 46%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--chip) 20%, transparent);
		&:not(:global(.is-speaking)) {
			opacity: 0.72;
		}
		&:global(.is-speaking) {
			margin-left: 0;
			padding: 0.5rem 0.8rem 0.55rem 0.6rem;
			border-radius: var(--radius);
			background: color-mix(in srgb, var(--chip) 16%, color-mix(in srgb, var(--plate-ink) 62%, transparent));
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--chip) 45%, transparent);
		}
	}

	:global(html.is-cinema) .line.lead {
		font-size: 1.04em;
		color: var(--fg);
	}

	:global(html.is-cinema) .line.ko.sub,
	:global(html.is-cinema) .line.en.sub {
		font-size: 0.86em;
		color: var(--fg-dim);
	}

	/* profile picture (or initial) for an assigned speaker */

	.face {
		width: 2.15rem;
		height: 2.15rem;
		margin-top: 0.15rem;
		padding: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--chip) 55%, transparent);
		border-radius: 50%;
		background: var(--chip);
		cursor: pointer;
		transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
		&.monarch {
			/* Whoever holds the throne that year: a square badge with softened corners. */
			border-radius: var(--monarch-radius);
		}
		&:not(:has(img)) {
			/* Initials sit on the same accent disk. */
			background: var(--chip);
		}
		&:hover {
			transform: scale(1.1);
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--chip) 25%, transparent);
		}
		& img {
			/* Full standing bust — never crop heads/feet. */
			width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: center bottom;
			background: transparent;
		}
		&.silhouette img {
			/* a placeholder body, not a likeness — it sits back a little */
			opacity: 0.62;
		}
		&.unnamed {
			/* A voice with no profile (a guard, a crowd): the silhouette, and nothing to open. */
			cursor: default;
			background: color-mix(in srgb, var(--chip, var(--fg-faint)) 45%, transparent);
			border-color: color-mix(in srgb, var(--chip, var(--fg-faint)) 40%, transparent);
			&:hover {
				transform: none;
				box-shadow: none;
			}
		}
	}

	.initial {
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 700;
		color: #fff;
	}

	.lines {
		display: flex;
		flex-direction: column;
		color: var(--fg-dim);
		min-width: 0;
	}

	/* One message per line. In the script it is invisible. */

	.msg {
		display: contents;
	}

	/* ————— Comic: every line a grey message bubble, the face at the foot of the stack ————— */

	.dialogue.as-msg {
		align-items: end;
	}

	.as-msg .lines {
		align-items: flex-start;
		gap: 0.2rem;
	}

	.as-msg .who {
		margin: 0 0 0.05rem;
	}

	.as-msg .msg {
		display: flex;
		flex-direction: column;
		width: fit-content;
		max-width: min(100%, 30rem);
		padding: 0.42rem 0.8rem 0.46rem;
		border-radius: 1.15rem;
		color: var(--bubble-ink);
		background: var(--bubble);
		&:last-child {
			border-bottom-left-radius: 0.3rem;
		}
	}

	/* Bubbles arrive one by one (`floatIn`), iMessage-style: the pending state
	is set from JS, and each bubble's `data-tone` picks its entrance. */

	.as-msg:global(.float-pending) .msg {
		position: relative;
		opacity: 0;
		transform-origin: left bottom;
	}

	.as-msg:global(.float-in) .msg {
		animation: msg-pop 420ms cubic-bezier(0.2, 0.9, 0.25, 1.2) var(--float-delay, 0ms) both;
		&[data-tone='loud'] {
			/* Shouted: swells far past its size, shudders, and settles back. */
			z-index: 2;
			transform-origin: left center;
			animation: msg-loud 900ms cubic-bezier(0.2, 0.8, 0.3, 1) var(--float-delay, 0ms) both;
		}
		&[data-tone='slam'] {
			/* Shouted in a fight: drops from above the page and hits it, with a shockwave. */
			z-index: 2;
			transform-origin: center;
			animation: msg-slam 640ms cubic-bezier(0.55, 0, 0.3, 1) var(--float-delay, 0ms) both;
			&::after {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: inherit;
				border: 2px solid var(--chip, var(--bubble-ink));
				opacity: 0;
				pointer-events: none;
				animation: msg-shock 600ms ease-out calc(var(--float-delay, 0ms) + 330ms) both;
			}
		}
		&[data-tone='gentle'] {
			/* Trailing off: arrives small and slow, as if from across the room. */
			animation: msg-gentle 1100ms cubic-bezier(0.25, 0.6, 0.3, 1) var(--float-delay, 0ms) both;
		}
		&[data-tone='ink'] {
			/* Said under the breath: the bubble lands, its words still hidden in shimmer, then clear. */
			animation: msg-pop 420ms cubic-bezier(0.2, 0.9, 0.25, 1.2) var(--float-delay, 0ms) both;
			& > :global(*) {
				animation: msg-ink 1300ms ease-out calc(var(--float-delay, 0ms) + 200ms) both;
			}
		}
	}

	@keyframes msg-pop {
		0% {
			opacity: 0;
			transform: translateY(0.6rem) scale(0.55);
		}
		60% {
			opacity: 1;
			transform: translateY(-0.1rem) scale(1.04);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes msg-loud {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		22% {
			opacity: 1;
			transform: scale(1.9);
		}
		32% {
			transform: scale(1.85) rotate(-2.5deg);
		}
		40% {
			transform: scale(1.85) rotate(2.5deg);
		}
		48% {
			transform: scale(1.82) rotate(-1deg);
		}
		72% {
			transform: scale(0.94);
		}
		86% {
			transform: scale(1.04);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes msg-slam {
		0% {
			opacity: 0;
			transform: translateY(-2.2rem) scale(2.6);
			filter: blur(3px);
		}
		45% {
			opacity: 1;
			transform: translateY(0) scale(2.4);
			filter: blur(0);
		}
		58% {
			transform: scale(0.9);
		}
		68% {
			transform: translate(-3px, 1px) scale(1.03);
		}
		78% {
			transform: translate(3px, -1px) scale(0.99);
		}
		88% {
			transform: translate(-1px, 0) scale(1);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes msg-shock {
		0% {
			opacity: 0.8;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.35, 1.9);
		}
	}

	@keyframes msg-gentle {
		0% {
			opacity: 0;
			transform: translateY(0.3rem) scale(0.88);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}

	@keyframes msg-ink {
		0% {
			filter: blur(7px);
			opacity: 0.35;
		}
		45% {
			filter: blur(5px);
			opacity: 0.5;
		}
		100% {
			filter: blur(0);
			opacity: 1;
		}
	}

	.as-msg .msg .line {
		color: inherit;
		&.sub {
			margin-bottom: 0;
		}
	}

	/* ————— Cards: a post thread (and, in Hybrid, a chat) is one bordered screen ————— */

	.dialogue.carded {
		--post-edge: color-mix(in srgb, var(--fg) 10%, transparent);
		margin: var(--widget-gap) 0 0;
		padding: var(--post-pad) calc(var(--post-pad) + 0.25rem) 0.5rem var(--post-pad);
		border: 1px solid var(--post-edge);
		border-bottom: none;
		border-radius: var(--widget-radius) var(--widget-radius) 0 0;
		&.thread-above {
			margin-top: 0;
			padding-top: 0.6rem;
			border-top: none;
			border-radius: 0;
		}
		&:not(.thread-below) {
			margin-bottom: var(--widget-gap);
			padding-bottom: var(--post-pad);
			border-bottom: 1px solid var(--post-edge);
			border-bottom-left-radius: var(--widget-radius);
			border-bottom-right-radius: var(--widget-radius);
		}
	}

	/* ————— Tweet: a post per utterance, threaded down the avatars ————— */

	.dialogue.as-post {
		grid-template-columns: var(--post-face) 1fr;
		gap: 0.85rem;
		&.thread-below::before {
			content: '';
			position: absolute;
			left: calc(var(--post-pad) + var(--post-face) / 2 - 1px);
			top: calc(var(--post-pad) + var(--post-face) + 0.3rem);
			bottom: -0.3rem;
			width: 2px;
			border-radius: 1px;
			background: color-mix(in srgb, var(--fg) 20%, transparent);
		}
		&.thread-above.thread-below::before {
			top: calc(0.6rem + var(--post-face) + 0.3rem);
		}
	}

	.as-post .face {
		width: var(--post-face);
		height: var(--post-face);
		margin-top: 0;
	}

	/* A still that opens on a post rides in it, as media under the text. */

	.tweet-media {
		grid-column: 2;
		margin-top: 0.35rem;
		overflow: hidden;
		border: 1px solid var(--post-edge);
		border-radius: var(--widget-radius);
		& :global(.stack) {
			margin: 0;
		}
	}

	.as-post .lines {
		color: var(--fg);
	}

	.as-post .line.lead {
		color: var(--fg);
	}

	.tweet-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 0.15rem;
		font-size: 0.9rem;
		line-height: 1.3;
	}

	/* Names in dialogue open the wiki; they keep the dialogue's own type. */

	:global(.prose) .who .person {
		font-weight: inherit;
		color: inherit;
	}

	:global(.prose) .tweet-name {
		font-weight: 700;
		color: var(--fg-strong);
	}

	:global(.prose) .tweet-name:hover,
	:global(.prose) .who .person:hover {
		text-decoration: underline;
	}

	/* An affiliation: the house's glyph brushed in white on a small square of its
	colour, as X tiles a company. Three classes deep, past the global .person reset. */

	:global(.prose) .tweet-head .org {
		display: inline-grid;
		place-items: center;
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 3px;
		font-family: 'Yuji Boku', 'LXGW WenKai TC', 'Noto Serif KR', serif;
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1;
		color: #fff;
		-webkit-text-stroke: 0.035em #fff;
		background: var(--org);
		&:hover {
			color: #fff;
			filter: brightness(1.12);
		}
	}

	.tweet-meta,
	.tweet-reply {
		font-size: 0.85rem;
		color: var(--fg-faint);
	}

	.tweet-reply {
		margin-bottom: 0.3rem;
	}

	:global(.prose) .tweet-reply .handle {
		font-weight: inherit;
		color: #1d9bf0;
	}

	/* ————— Tang speech as WeChat: square green bubbles ————— */

	.dialogue.as-msg.wechat {
		--bubble: #95ec69;
		--bubble-ink: #111;
	}

	.wechat .msg,
	.wechat .msg:last-child {
		border-radius: 4px;
		box-shadow: none;
	}

	.wechat .msg .line.sub {
		color: #3c5a2c;
		opacity: 0.85;
	}

	/* ————— Yamato speech as LINE: white rounded bubbles, the name in LINE green ————— */

	.dialogue.as-msg.line-app {
		--bubble: #ffffff;
		--bubble-ink: #111;
	}

	.line-app .msg {
		border-radius: 1.2rem;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.08);
		&:last-child {
			border-top-left-radius: 0.35rem;
			border-bottom-left-radius: 1.2rem;
		}
	}

	:global(.prose) .line-app .who .person {
		color: #06c755;
	}

	.line-app .msg .line.sub {
		color: #5c5c66;
	}

	/* ————— speak this line —————
	Out of flow in the gutter beneath the face, so it can never crowd the
	text or change how tall a dialogue is. It keeps out of sight until the
	reader is on this line, and stays lit while it is the one sounding. */

	.dialogue :global(.speak) {
		position: absolute;
		top: 2.55rem;
		left: 0.12rem;
		opacity: 0;
		transition: opacity 0.25s var(--ease);
	}

	@media (hover: hover) {
		.dialogue:hover :global(.speak) {
			opacity: 1;
		}
	}

	/* Nothing hovers on a touch screen — the control just sits there, quiet. */

	@media (hover: none) {
		.dialogue :global(.speak) {
			opacity: 0.45;
		}
	}

	.dialogue:focus-within :global(.speak),
	.dialogue :global(.speak.on),
	.dialogue :global(.speak.busy) {
		opacity: 1;
	}

	/* Immersive: the lines are the click target; the wash paints the whole
	`.dialogue` (same box as `.is-speaking`), not just the text column. */

	.lines.pick {
		align-items: flex-start;
		width: 100%;
		margin: 0;
		padding: 0;
		font: inherit;
		letter-spacing: inherit;
		text-align: left;
		border: none;
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
		&:focus-visible {
			outline: 1px solid color-mix(in srgb, var(--chip) 55%, var(--fg-strong));
			outline-offset: 0.35rem;
		}
	}

	/* ————— language layers —————
	Whichever language the reader picked *is* the line: body size, full
	strength. Everything else is a gloss set beneath it. */

	.line {
		font-weight: calc(var(--weight-body) + 100);
		color: var(--fg-dim);
		&.lead {
			font-size: 1em;
			font-style: normal;
			opacity: 1;
		}
		&.sub {
			font-size: 0.88em;
			opacity: 0.62;
			margin-bottom: 0.22rem;
		}
		&.en.sub {
			font-style: italic;
		}
		& :global(b), & :global(strong) {
			/* A real line from the record, spoken in a mouth: heavier than ordinary emphasis. */
			font-weight: 800;
			color: var(--fg-strong);
			letter-spacing: 0.01em;
		}
		&.zh, &.ja {
			/* Tang / Yamato native speech, and its transcription */
			margin-top: 0.12rem;
			font-family: 'Noto Serif KR', var(--serif);
			letter-spacing: 0.06em;
			line-height: 1.42;
			color: color-mix(in srgb, var(--chip) 38%, var(--fg-dim));
		}
		&.zh-latn, &.ja-latn, &.mnc {
			font-size: 0.78em;
			font-style: italic;
			letter-spacing: 0.02em;
			line-height: 1.45;
			color: var(--fg-faint);
		}
	}

	.who {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: color-mix(in srgb, var(--chip) 45%, var(--fg-strong));
		margin-bottom: 0.1rem;
	}

	/* A repeat speaker's name: kept for screen readers, gone from the page. */

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.speaker {
		font-size: 0.85em;
		opacity: 0.8;
	}

	/* ————— Phones: targets a thumb can actually hit ————— */

	@media (max-width: 820px) {
		.dialogue {
			grid-template-columns: 2.6rem 1fr;
			gap: 0.8rem;
			margin: 1.5rem 0;
		}
		.face {
			width: 2.6rem;
			height: 2.6rem;
			margin-top: 0.1rem;
		}
		/* clears the taller face, and the target grows to thumb size */
		.dialogue :global(.speak) {
			top: 3.1rem;
			left: 0.08rem;
		}
		/* The line is already the full width of the column; only its height is
		short of a comfortable target, and padding-block grown against an
		equal negative margin-block adds it without moving any text. */
		.lines.pick {
			min-height: 2.75rem;
			margin-block: -0.5rem;
			padding-block: 0.5rem;
			border-radius: var(--radius);
			-webkit-tap-highlight-color: transparent;
		}
		/* the chronicle either side of the live line still has to be readable */
		:global(html.is-stage) .dialogue:not(:global(.is-speaking)) {
			opacity: 0.88;
		}
	}
</style>
