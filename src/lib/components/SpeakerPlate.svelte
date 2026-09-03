<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { reading, leadLang } from '$lib/reading.svelte';
	import {
		avatarOf,
		nameOf,
		koreanOf,
		isPlaceholderArt,
		byId,
		colorOf,
		hangulInitial,
		KINGDOMS,
		type Person
	} from '$lib/people';
	import { openProfile } from '$lib/profiles.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { stageText } from '$lib/stageText';
	import { activeUtterance } from '$lib/speech.svelte';
	import SpeakButton from './SpeakButton.svelte';
	import { storyImg } from '$lib/img';

	/**
	 * `overlay` is the immersion plate — fixed to the foot of the page, bust
	 * standing beside the box. `panel` is the very same plate mounted inside
	 * the cinema stage's Active Dialogue cell: it fills its container and drops
	 * the bust (cinema's Character pane already holds the portrait). One
	 * component, so the two dialogue boxes can never drift apart.
	 */
	let { variant = 'overlay' }: { variant?: 'overlay' | 'panel' } = $props();

	let wantedMode = $derived(variant === 'panel' ? 'cinema' : 'immersion');

	/** Live speaker from reading state (null when not in this stage / no speaker). */
	let person = $derived.by(() => {
		if (!scriptUi.inScript || reading.mode !== wantedMode || !reading.speaker) return null;
		return byId.get(reading.speaker) ?? null;
	});

	/**
	 * Dual absolute portrait layers for a simple crossfade:
	 * - At rest: only `currentPerson` is mounted (one visible portrait).
	 * - On switch: hold the old speaker in `previousPerson`, fade it out while the new
	 *   speaker flies in — avoids {#key}-only remount thrashing / layout jitter.
	 * `untrack` is required so writing current/previous does not re-enter this effect
	 * and cancel the rAF that starts the previous-layer outro.
	 */
	let currentPerson = $state<Person | null>(null);
	let previousPerson = $state<Person | null>(null);
	let showPrevious = $state(false);

	$effect(() => {
		const next = person;
		const cur = untrack(() => currentPerson);
		if (next?.id === cur?.id) return;

		if (cur) {
			previousPerson = cur;
			showPrevious = true;
		} else {
			previousPerson = null;
			showPrevious = false;
		}
		currentPerson = next;

		if (!cur) return;

		// Mount previous at full opacity, then drop the flag so out:fade runs.
		let frame = 0;
		let cancelled = false;
		tick().then(() => {
			if (cancelled) return;
			frame = requestAnimationFrame(() => {
				if (!cancelled) showPrevious = false;
			});
		});
		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
		};
	});

	let accentPerson = $derived(currentPerson ?? previousPerson);
	let accent = $derived(
		accentPerson
			? colorOf(accentPerson) || KINGDOMS[accentPerson.kingdom].color
			: 'transparent'
	);

	/* The live line, as `$lib/stageText` resolves it — one flowing paragraph per
	   language layer. Shared with the cinema strip so both stages letter the
	   same utterance the same way. */
	let textKo = $derived(stageText.ko);
	let textEn = $derived(stageText.en);
	let textZh = $derived(stageText.zh);
	let textZhLatn = $derived(stageText.zhLatn);
	let textJa = $derived(stageText.ja);
	let textJaLatn = $derived(stageText.jaLatn);

	let hasZh = $derived(stageText.hasZh);
	let hasJa = $derived(stageText.hasJa);
	let empty = $derived(stageText.empty);

	/* Which tongues this plate actually letters, and which of them leads —
	   the reader's own choice, not a fixed Korean-first order. */
	let koShown = $derived(stageText.showKo && stageText.hasKo);
	let enShown = $derived(stageText.showEn && stageText.hasEn);
	let koFirst = $derived(leadLang(reading.lang) === 'ko');

	/** Remount dialogue text when the active utterance (or lang) changes. */
	let utteranceKey = $derived(stageText.key);

	let reduce = $derived(prefersReducedMotion.current);
	let portraitIn = $derived({
		y: reduce ? 0 : 22,
		duration: reduce ? 0 : 420
	});
	let portraitOut = $derived({ duration: reduce ? 0 : 220 });
	let boxMotion = $derived({
		y: reduce ? 0 : 18,
		duration: reduce ? 0 : 480
	});
	let lineIn = $derived({
		duration: reduce ? 0 : 280
	});
	let lineOut = $derived({ duration: reduce ? 0 : 180 });
	let nameIn = $derived({ duration: reduce ? 0 : 280 });
	let nameOut = $derived({ duration: reduce ? 0 : 160 });

	/** Keep stage up while previous is still outroing (previousPerson held until onoutroend). */
	let stageVisible = $derived(currentPerson !== null || previousPerson !== null);

	/**
	 * The live line, for the plate's own speak control. Tied to `person` rather
	 * than to the reading state alone: the stage can outlive its speaker while it
	 * fades, and a plate on its way out must not offer to read anything.
	 */
	let spoken = $derived(person ? activeUtterance() : null);
</script>

<!-- One bust, used by both the outgoing and the incoming layer. -->
{#snippet bust(p: Person)}
	{@const art = avatarOf(
		p,
		p.id === 'courtmaid' ? textKo || textEn : undefined,
		reading.year,
		reading.look
	)}
	{@const who = nameOf(p, reading.year, reading.look)}
	<button
		type="button"
		class="portrait"
		class:fallback={!art}
		class:silhouette={isPlaceholderArt(art) && p.id !== 'courtmaid'}
		onclick={() => openProfile(p.id, reading.year)}
		aria-label="Open profile for {who}"
	>
		{#if art}
			<img {...storyImg(art, { kind: 'portrait', alt: '', sizes: '220px' })} />
		{:else}
			<span class="initial" aria-hidden="true">{hangulInitial(p)}</span>
		{/if}
	</button>
{/snippet}

{#if stageVisible}
	<div
		class="stage"
		class:in={scriptUi.inScript}
		class:panel={variant === 'panel'}
		style:--k={accent}
		role="region"
		aria-label="Dialogue"
		in:fly={boxMotion}
		out:fade={portraitOut}
	>
		{#if variant === 'overlay'}
			<div class="portrait-slot">
				<!-- Outgoing layer: fades out, then cleared so only current remains -->
				{#if showPrevious && previousPerson}
					{@const outgoing = previousPerson}
					<div
						class="portrait-layer is-prev"
						out:fade={portraitOut}
						onoutroend={() => {
							if (previousPerson?.id === outgoing.id) previousPerson = null;
						}}
					>
						{@render bust(outgoing)}
					</div>
				{/if}

				<!-- Incoming / current layer: flies in on speaker (or maid-face) change -->
				{#if currentPerson}
					{@const faceKey = `${currentPerson.id}:${avatarOf(currentPerson, textKo || textEn, reading.year, reading.look)}:${nameOf(currentPerson, reading.year, reading.look)}`}
					{#key faceKey}
						{@const incoming = currentPerson}
						<div class="portrait-layer is-next" in:fly={portraitIn}>
							{@render bust(incoming)}
						</div>
					{/key}
				{/if}
			</div>
		{/if}

		<div class="box">
			{#if currentPerson}
				{@const person = currentPerson}
				{@const who = nameOf(person, reading.year, reading.look)}
				{@const ko = koreanOf(person, reading.year, reading.look)}
				{#key `${person.id}:${who}`}
					<button
						type="button"
						class="name-tab"
						onclick={() => openProfile(person.id, reading.year)}
						aria-label="Open profile for {who}"
						in:fade={nameIn}
						out:fade={nameOut}
					>
						<span class="name">{who}</span>
						{#if ko}
							<span class="korean">{ko}</span>
						{/if}
					</button>
				{/key}
			{/if}

			<!-- Hear this line — on the lip of the frame, opposite the name tab. -->
			<SpeakButton utterance={spoken} variant="plate" size={15} title="Speak this line" />

			<div class="frame" aria-live="polite">
				<div class="text">
					{#key utteranceKey}
						<div class="utterance" in:fade={lineIn} out:fade={lineOut}>
							{#if empty}
								<p class="line ellipsis">…</p>
							{:else}
								<!-- The chosen language leads the plate; the others sit
								     under it, smaller and half-lit. -->
								{#if koFirst}
									{#if koShown}
										<p class="line ko lead">{textKo}</p>
									{/if}
									{#if enShown}
										<p class="line en" class:lead={!koShown} class:sub={koShown}>
											{textEn}
										</p>
									{/if}
								{:else}
									{#if enShown}
										<p class="line en lead">{textEn}</p>
									{/if}
									{#if koShown}
										<p class="line ko" class:lead={!enShown} class:sub={enShown}>
											{textKo}
										</p>
									{/if}
								{/if}
								{#if hasZh}
									<p class="line zh sub">{textZh}</p>
									{#if textZhLatn}
										<p class="line zh-latn sub">{textZhLatn}</p>
									{/if}
								{/if}
								{#if hasJa}
									<p class="line ja sub">{textJa}</p>
									{#if textJaLatn}
										<p class="line ja-latn sub">{textJaLatn}</p>
									{/if}
								{/if}
							{/if}
						</div>
					{/key}
				</div>
				<span class="caret" aria-hidden="true">▼</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.stage {
		position: fixed;
		/* --shell-shift grows with the TOC so bust + dialogue clear the panel */
		left: var(--shell-shift);
		right: 0;
		bottom: 0;
		z-index: 93;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-end;
		pointer-events: none;
		padding-top: 0;
		padding-right: max(1rem, env(safe-area-inset-right, 0px));
		padding-bottom: max(0.7rem, env(safe-area-inset-bottom, 0px));
		padding-left: max(0.75rem, env(safe-area-inset-left, 0px));
		gap: 0;
		opacity: 0;
		transform: translate3d(0, 1.25rem, 0);
		transition:
			left var(--toc-duration) var(--toc-ease),
			opacity 520ms var(--ease),
			transform 560ms var(--ease);
	}

	.stage.in {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	/* ————— Panel variant (cinema's Active Dialogue cell) —————
	   Same plate, different stage: it fills the grid cell it was mounted in
	   instead of fixing itself to the viewport, takes its own pointer events
	   (there is no page underneath to scroll), and leaves the portrait to the
	   Character pane beside it. */
	.stage.panel {
		position: relative;
		left: auto;
		right: auto;
		bottom: auto;
		z-index: auto;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0.85rem 0.85rem 0.8rem;
		pointer-events: auto;
		/* the phone overlay's scrim / row layout must not leak into the cell */
		background: none;
		flex-direction: column;
		transition:
			opacity 520ms var(--ease),
			transform 560ms var(--ease);
	}

	.stage.panel .box {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-height: 0;
		height: 100%;
		margin-top: 0;
		padding-top: 0.55rem;
	}

	.stage.panel .frame {
		flex: 1 1 auto;
		height: auto;
		min-height: 0;
		max-height: none;
	}

	/* The bust stands on the left and *behind* the box: the negative margin
	   pulls the frame up over its feet, so the text always reads on top.
	   `--bust-h` is set in app.css, which also reserves the matching page
	   padding, so the two can never drift apart. */
	.portrait-slot {
		position: relative;
		z-index: 1;
		display: block;
		padding-left: 0.35rem;
		margin-bottom: -2.4rem;
		/* reserve height so in/out portraits can crossfade without layout jump */
		height: var(--bust-h);
		pointer-events: none;
	}

	.portrait-layer {
		position: absolute;
		left: 0.35rem;
		right: auto;
		bottom: 0;
		height: var(--bust-h);
		pointer-events: none;
	}

	.portrait-layer.is-prev {
		z-index: 1;
	}

	.portrait-layer.is-next {
		z-index: 2;
	}

	.portrait {
		pointer-events: auto;
		position: relative;
		display: block;
		margin: 0;
		padding: 0;
		width: auto;
		height: var(--bust-h);
		border: none;
		background: transparent;
		cursor: pointer;
		isolation: isolate;
		-webkit-tap-highlight-color: transparent;
		filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.5));
		transition: filter 280ms var(--ease, ease);
	}

	.portrait:hover {
		filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.58));
	}

	.portrait:focus-visible {
		outline: 1px solid rgba(216, 178, 106, 0.55);
		outline-offset: 4px;
	}

	.portrait img {
		display: block;
		height: 100%;
		width: auto;
		max-width: min(22rem, 48vw);
		object-fit: contain;
		object-position: bottom center;
		user-select: none;
		-webkit-user-drag: none;
	}

	/* A stand-in body is a stand-in: it holds the stage without pretending
	   to be a likeness. */
	.portrait.silhouette img {
		opacity: 0.5;
	}

	.portrait.fallback {
		width: min(13rem, var(--bust-h));
		height: min(13rem, var(--bust-h));
	}

	.initial {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		font-family: var(--serif);
		font-size: 4rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #fffdf8;
		background: radial-gradient(
			circle at 35% 30%,
			color-mix(in srgb, var(--k) 55%, #2a2a30),
			color-mix(in srgb, var(--k) 72%, #000)
		);
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--k) 40%, rgba(216, 178, 106, 0.35));
	}

	.box {
		position: relative;
		z-index: 3;
		width: 100%;
		margin-top: 0.55rem;
		padding-top: 0.55rem;
	}

	.name-tab {
		pointer-events: auto;
		position: absolute;
		top: 0.55rem;
		left: 0.9rem;
		z-index: 2;
		transform: translateY(-52%);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.02rem;
		margin: 0;
		padding: 0.26rem 0.7rem 0.3rem;
		border: 2px solid #e0c878;
		border-radius: 3px;
		background: var(--plate-ink);
		box-shadow:
			inset 0 0 0 1px #a8893a,
			0 2px 8px var(--plate-shadow);
		cursor: pointer;
		color: inherit;
		font: inherit;
		text-align: left;
		transform-origin: left center;
	}

	.name-tab:hover {
		border-color: #f0d898;
	}

	.name-tab:focus-visible {
		outline: 1px solid color-mix(in srgb, var(--gold) 70%, transparent);
		outline-offset: 2px;
	}

	/* Straddles the top edge of the frame the way the name tab does, and has to
	   take pointer events back from the stage, which lets them through. */
	.box :global(.speak) {
		pointer-events: auto;
		position: absolute;
		top: 0.55rem;
		right: 0.85rem;
		z-index: 4;
		transform: translateY(-50%);
	}

	.name {
		font-family: var(--serif);
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1.15;
		color: var(--plate-fg-strong);
	}

	.korean {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.66rem;
		font-weight: 500;
		line-height: 1.2;
		color: color-mix(in srgb, var(--gold) 70%, var(--plate-fg-strong));
	}

	.frame {
		position: relative;
		height: 7rem;
		min-height: 7rem;
		max-height: 7rem;
		padding: 1.1rem 1.35rem 1rem 1.15rem;
		border: 3px solid #e0c878;
		border-radius: 5px;
		background: var(--plate-ink);
		box-shadow:
			inset 0 0 0 2px var(--plate-ink),
			inset 0 0 0 4px #c9a84c,
			0 8px 28px var(--plate-shadow);
		box-sizing: border-box;
	}

	.text {
		display: grid;
		height: 100%;
		overflow: auto;
		padding-right: 1.1rem;
	}

	.utterance {
		grid-area: 1 / 1;
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		align-self: start;
	}

	.line {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 500;
		line-height: 1.38;
		letter-spacing: 0.01em;
		color: var(--plate-fg);
	}

	.line.ko {
		font-family: 'Noto Serif KR', var(--serif);
	}

	/* The reader's language is the line; every other tongue is a gloss. */
	.line.lead {
		opacity: 1;
	}

	.line.sub {
		font-size: 0.9rem;
		font-weight: 400;
		opacity: 0.74;
		color: var(--plate-fg-quiet);
	}

	.line.zh,
	.line.ja {
		font-family: 'Noto Serif KR', var(--serif);
		letter-spacing: 0.05em;
		color: color-mix(in srgb, var(--k) 42%, var(--plate-fg));
	}

	.line.zh-latn,
	.line.ja-latn {
		font-size: 0.78rem;
		font-style: italic;
		letter-spacing: 0.02em;
		color: var(--plate-fg-faint);
	}

	.line.ellipsis {
		color: var(--plate-fg-faint);
		letter-spacing: 0.12em;
	}

	.caret {
		position: absolute;
		right: 0.85rem;
		bottom: 0.55rem;
		font-size: 0.72rem;
		line-height: 1;
		color: var(--gold);
		animation: caret-blink 1.05s step-end infinite;
	}

	@keyframes caret-blink {
		0%,
		45% {
			opacity: 1;
		}
		55%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage {
			transition: left var(--toc-duration) var(--toc-ease);
			transform: none;
		}

		.portrait {
			filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
			transition: none;
		}

		.caret {
			animation: none;
			opacity: 0.85;
		}
	}

	/* ————— Phones —————
	   The text box owns the bottom of the screen and the bust shrinks to a
	   marker beside the name tab: on a 6" screen a full-height portrait eats
	   the half of the viewport the reader actually needs. Heights come from
	   `--bust-h` / `--plate-box-h` (app.css), which also reserve page padding. */
	@media (max-width: 700px) {
		.stage {
			/* Soft fade into the page so the plate doesn't hard-cut prose. */
			padding-top: 1.6rem;
			padding-right: max(0.55rem, env(safe-area-inset-right, 0px));
			padding-bottom: max(0.45rem, env(safe-area-inset-bottom, 0px));
			padding-left: max(0.55rem, env(safe-area-inset-left, 0px));
			background: linear-gradient(
				to top,
				var(--plate-scrim) 0%,
				var(--plate-scrim-mid) 42%,
				transparent 100%
			);
		}

		.portrait-slot {
			padding-left: 0;
			margin-bottom: -0.45rem;
			align-self: flex-start;
			width: min(8.5rem, 36vw);
			flex-shrink: 0;
		}

		.portrait-layer {
			left: 0;
			right: auto;
		}

		.portrait {
			filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
		}

		.portrait img {
			max-width: min(8rem, 34vw);
		}

		.portrait.fallback {
			width: min(5.5rem, var(--bust-h));
			height: min(5.5rem, var(--bust-h));
		}

		.initial {
			font-size: 1.55rem;
		}

		.box {
			margin-top: 0;
			padding-top: 0.45rem;
			min-width: 0;
			flex: 1 1 auto;
			max-height: 100%;
		}

		/* the tab is also a link to the profile — give it a thumb-sized target */
		.name-tab {
			left: 0.55rem;
			min-height: 2.5rem;
			padding: 0.38rem 0.8rem 0.4rem;
		}

		.box :global(.speak) {
			top: 0.45rem;
			right: 0.55rem;
		}

		.name {
			font-size: 0.88rem;
		}

		.korean {
			font-size: 0.6rem;
		}

		/* Viewport-capped so multi-language lines scroll inside the frame
		   instead of pushing the plate off-screen. */
		.frame {
			height: auto;
			min-height: 6.25rem;
			max-height: min(26dvh, 9.75rem);
			padding: 1rem 1rem 1.35rem 0.95rem;
			border-width: 2px;
			box-shadow:
				inset 0 0 0 2px var(--plate-ink),
				inset 0 0 0 3px #c9a84c,
				0 -2px 26px rgba(0, 0, 0, 0.5);
		}

		.text {
			padding-right: 0.5rem;
			overscroll-behavior: contain;
			-webkit-overflow-scrolling: touch;
		}

		.utterance {
			gap: 0.35rem;
		}

		.line {
			font-size: 1.02rem;
			font-weight: 500;
			line-height: 1.42;
			color: var(--plate-fg-strong);
			overflow-wrap: anywhere;
			word-break: keep-all;
		}

		.line.sub {
			font-size: 0.88rem;
			color: var(--plate-fg-quiet);
		}

		.line.zh-latn,
		.line.ja-latn {
			font-size: 0.72rem;
		}

		.caret {
			right: 0.7rem;
			bottom: 0.4rem;
			font-size: 0.7rem;
		}
	}

	@media (max-width: 480px) {
		.portrait-slot {
			width: min(7.25rem, 34vw);
			margin-bottom: -0.3rem;
		}

		.portrait img {
			max-width: min(6.75rem, 32vw);
		}

		.frame {
			min-height: 5.85rem;
			max-height: min(28dvh, 9rem);
			padding: 0.95rem 0.9rem 1.3rem 0.85rem;
		}

		.line {
			font-size: 0.98rem;
		}
	}

	@media (max-width: 900px) and (max-height: 480px) {
		.stage {
			padding-top: 0.6rem;
			flex-direction: row;
			align-items: flex-end;
			gap: 0.4rem;
		}

		.portrait-slot {
			width: min(5.5rem, 22vw);
			margin-bottom: 0;
			order: 1;
		}

		.box {
			order: 2;
			flex: 1;
			padding-top: 0.35rem;
		}

		.frame {
			min-height: 4.5rem;
			max-height: min(40dvh, 6.5rem);
		}

		.name-tab {
			display: none;
		}
	}
</style>
