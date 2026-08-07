<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { reading } from '$lib/reading.svelte';
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

	/** Live speaker from reading state (null when not immersive / no speaker). */
	let person = $derived.by(() => {
		if (reading.mode !== 'immersive' || !reading.speaker) return null;
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

	let linesKo = $derived(reading.linesKo);
	let linesEn = $derived(reading.linesEn);
	let linesZh = $derived(reading.linesZh);
	let linesZhLatn = $derived(reading.linesZhLatn);
	let linesJa = $derived(reading.linesJa);
	let linesJaLatn = $derived(reading.linesJaLatn);

	let showKo = $derived(reading.lang === 'ko' || reading.lang === 'both');
	let showEn = $derived(reading.lang === 'en' || reading.lang === 'both');

	/** Space-joined flowing paragraphs (not one block per source line). */
	let textKo = $derived(
		linesKo
			.map((l) => l.trim())
			.filter(Boolean)
			.join(' ')
	);
	let textEn = $derived(
		linesEn
			.map((l) => l.trim())
			.filter(Boolean)
			.join(' ')
	);
	let textZh = $derived(
		linesZh
			.map((l) => l.trim())
			.filter(Boolean)
			.join(' ')
	);
	let textZhLatn = $derived(
		linesZhLatn
			.map((l) => l.trim())
			.filter(Boolean)
			.join(' ')
	);
	let textJa = $derived(
		linesJa
			.map((l) => l.trim())
			.filter(Boolean)
			.join(' ')
	);
	let textJaLatn = $derived(
		linesJaLatn
			.map((l) => l.trim())
			.filter(Boolean)
			.join(' ')
	);

	let hasKo = $derived(textKo.length > 0);
	let hasEn = $derived(textEn.length > 0);
	let hasZh = $derived(textZh.length > 0);
	let hasJa = $derived(textJa.length > 0);
	let empty = $derived(
		(showKo ? !hasKo : true) &&
			(showEn ? !hasEn : true) &&
			!hasZh &&
			!hasJa
	);

	/** Remount dialogue text when the active utterance (or lang) changes. */
	let utteranceKey = $derived(
		[
			reading.speaker ?? '',
			reading.lang,
			textKo,
			'\u0001',
			textEn,
			'\u0001',
			textZh,
			'\u0001',
			textZhLatn,
			'\u0001',
			textJa,
			'\u0001',
			textJaLatn
		].join('\u0000')
	);

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
</script>

<!-- One bust, used by both the outgoing and the incoming layer. -->
{#snippet bust(p: Person)}
	{@const art = avatarOf(
		p,
		p.id === 'courtmaid' ? textKo || textEn : undefined,
		reading.year
	)}
	{@const who = nameOf(p, reading.year)}
	<button
		type="button"
		class="portrait"
		class:fallback={!art}
		class:silhouette={isPlaceholderArt(art) && p.id !== 'courtmaid'}
		onclick={() => openProfile(p.id, reading.year)}
		aria-label="Open profile for {who}"
	>
		{#if art}
			<img src={art} alt="" />
		{:else}
			<span class="initial" aria-hidden="true">{hangulInitial(p)}</span>
		{/if}
	</button>
{/snippet}

{#if stageVisible}
	<div
		class="stage"
		style:--k={accent}
		role="region"
		aria-label="Dialogue"
		in:fly={boxMotion}
		out:fade={portraitOut}
	>
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
				{@const faceKey = `${currentPerson.id}:${avatarOf(currentPerson, textKo || textEn, reading.year)}:${nameOf(currentPerson, reading.year)}`}
				{#key faceKey}
					{@const incoming = currentPerson}
					<div class="portrait-layer is-next" in:fly={portraitIn}>
						{@render bust(incoming)}
					</div>
				{/key}
			{/if}
		</div>

		<div class="box">
			{#if currentPerson}
				{@const person = currentPerson}
				{@const who = nameOf(person, reading.year)}
				{@const ko = koreanOf(person, reading.year)}
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

			<div class="frame" aria-live="polite">
				<div class="text">
					{#key utteranceKey}
						<div class="utterance" in:fade={lineIn} out:fade={lineOut}>
							{#if empty}
								<p class="line ellipsis">…</p>
							{:else}
								{#if showKo && hasKo}
									<p class="line ko">{textKo}</p>
								{/if}
								{#if showEn && hasEn}
									<p class="line en" class:quiet={reading.lang === 'both' && hasKo}>
										{textEn}
									</p>
								{/if}
								{#if hasZh}
									<p class="line zh">{textZh}</p>
									{#if textZhLatn}
										<p class="line zh-latn">{textZhLatn}</p>
									{/if}
								{/if}
								{#if hasJa}
									<p class="line ja">{textJa}</p>
									{#if textJaLatn}
										<p class="line ja-latn">{textJaLatn}</p>
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
		left: 0;
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
	}

	/* The bust stands on the right and *behind* the box: the negative margin
	   pulls the frame up over its feet, so the text always reads on top.
	   `--bust-h` is set in app.css, which also reserves the matching page
	   padding, so the two can never drift apart. */
	.portrait-slot {
		position: relative;
		z-index: 1;
		display: block;
		padding-right: 0.35rem;
		margin-bottom: -2.4rem;
		/* reserve height so in/out portraits can crossfade without layout jump */
		height: var(--bust-h);
		pointer-events: none;
	}

	.portrait-layer {
		position: absolute;
		left: auto;
		right: 0.35rem;
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
			0 2px 8px rgba(0, 0, 0, 0.35);
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
		outline: 1px solid rgba(216, 178, 106, 0.7);
		outline-offset: 2px;
	}

	.name {
		font-family: var(--serif);
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1.15;
		color: #fff8e8;
	}

	.korean {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.66rem;
		font-weight: 500;
		line-height: 1.2;
		color: color-mix(in srgb, var(--gold, #d8b26a) 70%, #fff8e8);
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
			0 8px 28px rgba(0, 0, 0, 0.48);
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
		line-height: 1.45;
		letter-spacing: 0.01em;
		color: #f4efe4;
	}

	.line.ko {
		font-family: 'Noto Serif KR', var(--serif);
	}

	.line.en.quiet {
		font-size: 0.92rem;
		font-weight: 400;
		color: color-mix(in srgb, #f4efe4 72%, #8a8478);
	}

	.line.zh,
	.line.ja {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		color: color-mix(in srgb, var(--k) 42%, #f4efe4);
	}

	.line.zh-latn,
	.line.ja-latn {
		font-size: 0.78rem;
		font-weight: 400;
		font-style: italic;
		letter-spacing: 0.02em;
		color: color-mix(in srgb, #f4efe4 55%, #8a8478);
	}

	.line.ellipsis {
		color: color-mix(in srgb, #f4efe4 55%, #8a8478);
		letter-spacing: 0.12em;
	}

	.caret {
		position: absolute;
		right: 0.85rem;
		bottom: 0.55rem;
		font-size: 0.72rem;
		line-height: 1;
		color: #e0c878;
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
				rgba(20, 20, 26, 0.92) 0%,
				rgba(20, 20, 26, 0.72) 42%,
				transparent 100%
			);
		}

		.portrait-slot {
			padding-right: 0;
			margin-bottom: -0.45rem;
			align-self: flex-end;
			width: min(8.5rem, 36vw);
			flex-shrink: 0;
		}

		.portrait-layer {
			right: 0;
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
			line-height: 1.55;
			color: #faf6ee;
			overflow-wrap: anywhere;
			word-break: keep-all;
		}

		.line.en.quiet {
			font-size: 0.9rem;
			color: color-mix(in srgb, #faf6ee 78%, #8a8478);
		}

		.line.zh,
		.line.ja {
			font-size: 0.88rem;
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
			order: 2;
		}

		.box {
			order: 1;
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
