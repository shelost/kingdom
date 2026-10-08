<script module lang="ts">
	export type MaterialKind = 'paper' | 'stone' | 'rubbing' | 'indigo' | 'silk' | 'cloth';
</script>

<script lang="ts">
	/**
	 * The physical surface under a card, printed as a comic panel: drop it as the
	 * first child of a card that is positioned and sets `isolation: isolate` (so the
	 * layer sits above the card's background and beneath its text). It draws the
	 * material's grain and light (hanji fibre, a bevelled stone, silk, indigo sutra
	 * paper) and a soft lift off the page, without touching
	 * the card's own background, so each card keeps its colours.
	 */
	let { kind = 'paper' }: { kind?: MaterialKind } = $props();
</script>

<span class="material {kind}" aria-hidden="true"></span>

<style>
	/* Names linked in text on a physical surface take the surface's ink, not the page's. */
	:global(:has(> .material) .person:not(.avatar):not(.face)) {
		color: inherit;
		font-weight: var(--weight-link);
		letter-spacing: inherit;
		text-decoration: underline dotted color-mix(in srgb, currentColor 45%, transparent);
		text-underline-offset: 0.18em;
	}

	.material {
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
	}

	/* No ink frame: a soft lift off the page is the panel's only edge. */
	.material::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow:
			0 1px 2px rgb(0 0 0 / 0.06),
			0 10px 28px -14px rgb(0 0 0 / 0.35);
	}

	/* Hanji: long fibres and a little light raking across the top. */
	.paper {
		background:
			linear-gradient(170deg, rgb(255 255 255 / 0.07), transparent 38%),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55 0.08' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.38 0 0 0 0 0.28 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
	}

	/* Cut stone: a bevel on every edge, a grain in the face. */
	.stone {
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.28),
			inset 1px 0 0 rgb(255 255 255 / 0.12),
			inset 0 -2px 0 rgb(0 0 0 / 0.14),
			inset -1px 0 0 rgb(0 0 0 / 0.08),
			inset 0 0 22px rgb(0 0 0 / 0.06);
		background:
			linear-gradient(155deg, rgb(255 255 255 / 0.1), transparent 30%, transparent 70%, rgb(0 0 0 / 0.12)),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E");
	}

	/* A rubbing is paper pressed onto stone: dark ground, pale tone. */
	.rubbing {
		box-shadow:
			inset 0 1px 0 rgb(255 255 255 / 0.06),
			inset 0 -1px 0 rgb(0 0 0 / 0.3);
		background: linear-gradient(165deg, rgb(255 255 255 / 0.05), transparent 40%);
	}

	/* Indigo sutra paper, dyed and burnished: a sheen. */
	.indigo {
		background:
			linear-gradient(160deg, rgb(255 255 255 / 0.08), transparent 35%),
			radial-gradient(70% 40% at 100% 100%, rgb(0 0 0 / 0.25), transparent 70%);
	}

	/* Silk catches light in long bands along the weave. */
	.silk {
		background:
			repeating-linear-gradient(90deg, rgb(255 255 255 / 0.05) 0 2px, transparent 2px 5px),
			linear-gradient(175deg, rgb(255 255 255 / 0.22), transparent 30%, rgb(0 0 0 / 0.06) 70%, rgb(255 255 255 / 0.1));
	}

	.cloth {
		background:
			repeating-linear-gradient(0deg, rgb(255 255 255 / 0.025) 0 1px, transparent 1px 3px),
			repeating-linear-gradient(90deg, rgb(0 0 0 / 0.03) 0 1px, transparent 1px 3px);
	}

	:global(html:not([data-theme='light'])) .silk {
		background:
			repeating-linear-gradient(90deg, rgb(255 255 255 / 0.025) 0 2px, transparent 2px 5px),
			linear-gradient(175deg, rgb(255 255 255 / 0.06), transparent 30%, rgb(0 0 0 / 0.12) 70%);
	}
</style>
