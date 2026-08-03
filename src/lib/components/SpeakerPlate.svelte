<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { reading } from '$lib/reading.svelte';
	import { byId, colorOf, hangulInitial, KINGDOMS, type Person } from '$lib/people';
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

	let hasKo = $derived(textKo.length > 0);
	let hasEn = $derived(textEn.length > 0);
	let empty = $derived((showKo ? !hasKo : true) && (showEn ? !hasEn : true));

	/** Remount dialogue text when the active utterance (or lang) changes. */
	let utteranceKey = $derived(
		[reading.speaker ?? '', reading.lang, textKo, '\u0001', textEn].join('\u0000')
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
					<button
						type="button"
						class="portrait"
						class:fallback={!outgoing.avatar}
						onclick={() => openProfile(outgoing)}
						aria-label="Open profile for {outgoing.name}"
					>
						{#if outgoing.avatar}
							<img src={outgoing.avatar} alt="" />
						{:else}
							<span class="initial" aria-hidden="true">{hangulInitial(outgoing)}</span>
						{/if}
					</button>
				</div>
			{/if}

			<!-- Incoming / current layer: flies in on speaker change -->
			{#if currentPerson}
				{#key currentPerson.id}
					{@const incoming = currentPerson}
					<div class="portrait-layer is-next" in:fly={portraitIn}>
						<button
							type="button"
							class="portrait"
							class:fallback={!incoming.avatar}
							onclick={() => openProfile(incoming)}
							aria-label="Open profile for {incoming.name}"
						>
							{#if incoming.avatar}
								<img src={incoming.avatar} alt="" />
							{:else}
								<span class="initial" aria-hidden="true">{hangulInitial(incoming)}</span>
							{/if}
						</button>
					</div>
				{/key}
			{/if}
		</div>

		<div class="box">
			{#if currentPerson}
				{#key currentPerson.id}
					<button
						type="button"
						class="name-tab"
						onclick={() => openProfile(currentPerson)}
						aria-label="Open profile for {currentPerson.name}"
						in:fade={nameIn}
						out:fade={nameOut}
					>
						<span class="name">{currentPerson.name}</span>
						{#if currentPerson.korean}
							<span class="korean">{currentPerson.korean}</span>
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
		padding: 0 1rem max(0.7rem, env(safe-area-inset-bottom, 0px)) 0.75rem;
		gap: 0;
	}

	.portrait-slot {
		position: relative;
		z-index: 2;
		display: block;
		padding-left: 0.35rem;
		margin-bottom: -0.55rem;
		/* reserve height so in/out portraits can crossfade without layout jump */
		height: 21rem;
		pointer-events: none;
	}

	.portrait-layer {
		position: absolute;
		left: 0.35rem;
		bottom: 0;
		height: 21rem;
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
		height: 21rem;
		border: none;
		background: transparent;
		cursor: pointer;
		isolation: isolate;
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

	.portrait.fallback {
		width: 13rem;
		height: 13rem;
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
		z-index: 1;
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
		padding: 0.22rem 0.7rem 0.28rem;
		border: 2px solid #e0c878;
		border-radius: 3px;
		background: #16141c;
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
		height: 6.5rem;
		min-height: 6.5rem;
		max-height: 6.5rem;
		padding: 1.05rem 1.35rem 0.95rem 1.15rem;
		border: 3px solid #e0c878;
		border-radius: 5px;
		background: #141218;
		box-shadow:
			inset 0 0 0 2px #141218,
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

	@media (max-width: 700px) {
		.stage {
			padding: 0 0.55rem max(0.45rem, env(safe-area-inset-bottom, 0px)) 0.4rem;
		}

		.portrait-slot {
			padding-left: 0.15rem;
			margin-bottom: -0.4rem;
			height: 13rem;
		}

		.portrait-layer {
			left: 0.15rem;
			height: 13rem;
		}

		.portrait {
			height: 13rem;
		}

		.portrait img {
			max-width: min(14rem, 54vw);
		}

		.portrait.fallback {
			width: 8.5rem;
			height: 8.5rem;
		}

		.initial {
			font-size: 2.5rem;
		}

		.box {
			width: 100%;
			margin-top: 0.4rem;
			padding-top: 0.45rem;
		}

		.name-tab {
			left: 0.65rem;
			padding: 0.16rem 0.55rem 0.2rem;
		}

		.name {
			font-size: 0.8rem;
		}

		.korean {
			font-size: 0.58rem;
		}

		.frame {
			height: 5.5rem;
			min-height: 5.5rem;
			max-height: 5.5rem;
			padding: 0.85rem 1.05rem 0.8rem 0.9rem;
		}

		.line {
			font-size: 0.95rem;
		}

		.line.en.quiet {
			font-size: 0.84rem;
		}
	}
</style>
