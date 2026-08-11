<script lang="ts">
	/**
	 * Speak one dialogue line — or stop it, if it is the one already sounding.
	 *
	 * Placement is deliberately left to the caller (`:global(.speak)`): the same
	 * control sits in the gutter of a script line and on the lip of the immersion
	 * plate, and only the page around it knows where that is.
	 */
	import SpeakIcon from './SpeakIcon.svelte';
	import { speech, speechKeyOf, toggleSpeech, type Utterance } from '$lib/speech.svelte';

	let {
		utterance,
		variant = 'inline',
		size = 13,
		title = 'Speak this line'
	}: {
		utterance: Utterance | null;
		variant?: 'inline' | 'plate';
		size?: number;
		title?: string;
	} = $props();

	let key = $derived(speechKeyOf(utterance));
	let live = $derived(!!key && speech.key === key);
	let busy = $derived(live && speech.loading);
	let sounding = $derived(live && speech.playing);
	let label = $derived(sounding ? 'Stop speaking this line' : title);
</script>

<!-- Nothing sayable in the reader's language — no control to offer. -->
{#if key}
	<button
		type="button"
		class="speak {variant}"
		class:on={sounding}
		class:busy
		title={label}
		aria-label={label}
		aria-pressed={sounding}
		onclick={() => toggleSpeech(utterance)}
	>
		<SpeakIcon on={sounding} {size} />
	</button>
{/if}

<style>
	.speak {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: 50%;
		background: var(--glass);
		backdrop-filter: blur(10px);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease);
	}

	.speak:hover,
	.speak.on {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 50%, transparent);
	}

	.speak:focus-visible {
		outline: 1px solid var(--gold);
		outline-offset: 2px;
	}

	/* Waiting on the first synthesis of a line — the colour, not the opacity,
	   so a parent is still free to fade the control in and out. */
	.speak.busy {
		animation: speak-busy 900ms var(--ease) infinite;
	}

	@keyframes speak-busy {
		0%,
		100% {
			color: var(--fg-faint);
		}
		50% {
			color: var(--gold);
		}
	}

	/* On the plate the control is part of the gilt frame, not the page chrome. */
	.speak.plate {
		width: 1.7rem;
		height: 1.7rem;
		color: var(--gold);
		border: 2px solid #e0c878;
		background: var(--plate-ink);
		box-shadow:
			inset 0 0 0 1px #a8893a,
			0 2px 8px var(--plate-shadow);
		backdrop-filter: none;
	}

	.speak.plate:hover,
	.speak.plate.on {
		color: var(--plate-fg-strong);
		border-color: #f0d898;
	}

	@media (prefers-reduced-motion: reduce) {
		.speak.busy {
			animation: none;
		}
	}

	/* Phones: a thumb-sized target, grown from the centre so the icon stays put. */
	@media (max-width: 700px) {
		.speak {
			width: 2.1rem;
			height: 2.1rem;
		}

		.speak.plate {
			width: 2.1rem;
			height: 2.1rem;
		}
	}
</style>
