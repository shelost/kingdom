<script lang="ts">
	/** Momal's input: grows with the text, Enter sends, Shift+Enter breaks the line, Stop while he answers. */
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { reading } from '$lib/reading.svelte';

	let {
		id,
		large = false,
		onsend
	}: { id: string; large?: boolean; onsend: () => void } = $props();

	const ko = $derived(reading.lang === 'ko');
	const max = $derived(large ? 220 : 160);

	let field = $state<HTMLTextAreaElement | undefined>();

	export function focus() {
		field?.focus({ preventScroll: true });
		grow();
	}

	export function grow() {
		if (!field) return;
		field.style.height = 'auto';
		field.style.height = `${Math.min(field.scrollHeight, max)}px`;
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (storyAsk.input.trim()) onsend();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key !== 'Enter' || e.shiftKey) return;
		if (e.isComposing || e.keyCode === 229) return;
		e.preventDefault();
		if (storyAsk.input.trim()) onsend();
	}

	/* Sending clears the input from the store; shrink the box back with it. */
	$effect(() => {
		if (!storyAsk.input) grow();
	});
</script>

<form class="composer" class:large onsubmit={submit}>
	<label class="sr" for={id}>{ko ? '질문' : 'Question'}</label>
	<textarea
		{id}
		rows="1"
		bind:this={field}
		bind:value={storyAsk.input}
		placeholder={ko ? '모말에게 묻기' : 'Ask Momal anything'}
		autocomplete="off"
		enterkeyhint="send"
		onkeydown={onKey}
		oninput={grow}
	></textarea>
	{#if storyAsk.pending}
		<button type="button" class="go stop" onclick={() => storyAsk.stop()} aria-label={ko ? '멈추기' : 'Stop'}>
			<span class="material-symbols-outlined" aria-hidden="true">stop</span>
		</button>
	{:else}
		<button
			type="submit"
			class="go"
			class:ready={!!storyAsk.input.trim()}
			disabled={!storyAsk.input.trim()}
			aria-label={ko ? '보내기' : 'Send'}
		>
			<span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>
		</button>
	{/if}
</form>

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;
	$ease: cubic-bezier(0.32, 0.72, 0, 1);

	.composer {
		position: relative;
		width: 100%;
		display: flex;
		align-items: flex-end;
		gap: 0.45rem;
		padding: 0.42rem 0.42rem 0.42rem 0.95rem;
		border-radius: 22px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.07);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(18px) saturate(1.2);
		-webkit-backdrop-filter: blur(18px) saturate(1.2);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			transform 0.3s $ease;
		&:focus-within {
			border-color: rgba(255, 255, 255, 0.3);
			background: rgba(255, 255, 255, 0.1);
		}
		&.large {
			padding: 0.8rem 0.7rem 0.8rem 1.25rem;
			border-radius: 26px;
			background: rgba(22, 22, 28, 0.82);
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.08),
				0 20px 50px -20px rgba(0, 0, 0, 0.7);
			&:focus-within {
				transform: scale(1.01);
				background: rgba(28, 28, 35, 0.9);
			}
		}
	}

	textarea {
		flex: 1;
		resize: none;
		min-height: 1.6rem;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.45;
		letter-spacing: -0.015em;
		padding: 0.32rem 0;
		border: none;
		background: transparent;
		color: #fff;
		outline: none;
		&::placeholder {
			color: rgba(255, 255, 255, 0.4);
		}
		.large & {
			font-size: 1rem;
		}
	}

	.go {
		flex: 0 0 auto;
		width: 2.1rem;
		height: 2.1rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			transform 0.2s $ease;
		&.ready {
			background: conic-gradient(from 210deg, $red, $gold, $blue, $red);
			color: #fff;
			&:hover {
				transform: scale(1.08) rotate(12deg);
			}
		}
		&.stop {
			background: #fff;
			color: #0a0a0f;
		}
		&:disabled {
			cursor: default;
		}
		& .material-symbols-outlined {
			font-size: 1.15rem;
			font-weight: 600;
		}
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
</style>
