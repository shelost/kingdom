<script lang="ts">
	import type { RecordSeal } from '$lib/recordBooks';

	let {
		seal,
		inked = true,
		delay = 0
	}: {
		seal: RecordSeal;
		/** False until the card scrolls in; the stamp lands when it turns true. */
		inked?: boolean;
		/** Milliseconds to wait for the original to finish inking. */
		delay?: number;
	} = $props();

	let len = $derived([...seal.text].length);
	/** Characters per column: one tall column for a slim seal, a single row for a wide one, two columns otherwise. */
	let rows = $derived(
		seal.shape === 'tall' && len <= 4
			? len
			: seal.shape === 'wide' && len <= 4
				? 1
				: Math.max(1, Math.ceil(len / 2))
	);
</script>

<span
	class="seal {seal.shape} {seal.cut}"
	class:double={seal.double}
	class:inked
	style:--ink={seal.color}
	style:--tilt="{seal.tilt}deg"
	style:--rows={rows}
	style:--delay="{delay}ms"
	lang="zh-Hant"
	aria-hidden="true"><span class="cut">{seal.text}</span></span
>

<style>
	.seal {
		/* The colour of the cut strokes; a stone rubbing sets it dark under a chalk seal. */
		--paper-ink: var(--seal-cut, #fff6ec);
		flex-shrink: 0;
		display: inline-grid;
		place-items: center;
		box-sizing: content-box;
		padding: 0.28em;
		font-family: 'Noto Serif KR', serif;
		font-size: 0.82rem;
		font-weight: 900;
		line-height: 1;
		letter-spacing: 0;
		border-radius: 3px;
		transform: rotate(var(--tilt));
		transition:
			opacity 260ms var(--ease),
			transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
		transition-delay: var(--delay);
		/* Seal paste never lies perfectly flat. */
		mask-image: radial-gradient(circle at 32% 38%, #000 55%, rgb(0 0 0 / 0.86) 100%);
	}

	.seal:not(.inked) {
		opacity: 0;
		transform: rotate(var(--tilt)) scale(1.7);
	}

	.cut {
		display: block;
		writing-mode: vertical-rl;
		height: calc(var(--rows) * 1em + 0.1em);
	}

	/* Characters cut away: paper-coloured strokes in a solid field of paste. */
	.intaglio {
		color: var(--paper-ink);
		background: var(--ink);
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--paper-ink) 55%, transparent);
	}

	.intaglio.double {
		box-shadow:
			inset 0 0 0 1.5px var(--ink),
			inset 0 0 0 3px color-mix(in srgb, var(--paper-ink) 70%, transparent);
	}

	/* Characters left standing: inked strokes inside an inked border. */
	.relief {
		color: var(--ink);
		background: color-mix(in srgb, var(--ink) 6%, transparent);
		box-shadow: inset 0 0 0 1.6px var(--ink);
	}

	.relief.double {
		outline: 1px solid var(--ink);
		outline-offset: 2px;
	}

	.round {
		padding: 0.5em;
		border-radius: 50%;
	}

	.oval {
		padding: 0.5em 0.36em;
		border-radius: 50% / 44%;
	}

	.tall {
		padding: 0.34em 0.26em;
		border-radius: 2px;
	}

	.wide {
		padding: 0.24em 0.38em;
		border-radius: 2px;
	}

	.lozenge {
		padding: 0.62em;
		clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
		border-radius: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.seal {
			transition: none;
		}
	}
</style>
