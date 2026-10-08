<script lang="ts">
	/**
	 * A card's corner: the realm's flag, flat and small, beside one character
	 * stamped like a seal (帝 王 神 將 眞 城 江 …).
	 */
	let {
		flag,
		glyph,
		label,
		color = '#b3261e',
		shown = true
	}: {
		flag?: { src: string; label: string };
		glyph?: string;
		/** What the glyph means, in the reader's language. */
		label?: string;
		/** The seal's ink: a plain hex. */
		color?: string;
		/** Stamps the seal once true. */
		shown?: boolean;
	} = $props();

	let description = $derived([flag?.label, label].filter(Boolean).join(' · '));
</script>

{#if flag || glyph}
	<span class="corner-mark" class:shown role="img" aria-label={description} title={description}>
		{#if flag}<img class="flag" src={flag.src} alt="" loading="lazy" decoding="async" />{/if}
		{#if glyph}<span class="seal" lang="zh-Hant" style:--seal={color} aria-hidden="true">{glyph}</span>{/if}
	</span>
{/if}

<style>
	.corner-mark {
		position: absolute;
		top: 0.7rem;
		right: 0.8rem;
		z-index: 3;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		pointer-events: auto;
	}

	.flag {
		display: block;
		width: 1.7rem;
		height: 1.15rem;
		object-fit: cover;
		border-radius: 1.5px;
		box-shadow: 0 0 0 1px rgb(21 18 14 / 0.22);
	}

	/* A square seal in cinnabar-style relief: the paper shows through the cut rim. */
	.seal {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 3px;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.12rem;
		font-weight: 900;
		line-height: 1;
		color: #fffaf0;
		background: var(--seal);
		box-shadow: inset 0 0 0 2px var(--seal), inset 0 0 0 3px rgb(255 250 240 / 0.6);
		transform: rotate(-4deg);
		opacity: 0;
	}

	.shown .seal {
		animation: stamp 380ms cubic-bezier(0.3, 1.4, 0.5, 1) 200ms both;
	}

	@keyframes stamp {
		from {
			opacity: 0;
			transform: scale(1.8) rotate(-12deg);
		}
		to {
			opacity: 1;
			transform: rotate(-4deg);
		}
	}

	/* On night paper the flag gets a pale keyline and the seal's paste a little light. */
	:global(html:not([data-theme='light'])) .flag {
		box-shadow: 0 0 0 1px rgb(238 230 214 / 0.3);
	}

	:global(html:not([data-theme='light'])) .seal {
		background: color-mix(in oklab, var(--seal), white 16%);
	}

	@media (prefers-reduced-motion: reduce) {
		.seal,
		.shown .seal {
			animation: none;
			opacity: 1;
		}
	}
</style>
