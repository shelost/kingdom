<script lang="ts">
	/**
	 * Momal's conversation, shared by the corner panel and the full page.
	 * `anchor="bottom"` sticks to the newest token (the panel). `anchor="turn"` lifts each
	 * new question to the top and leaves room under it for the answer (the page).
	 */
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { storyAsk, lastAssistant, type AskMsg } from '$lib/storyAsk.svelte';
	import { reading } from '$lib/reading.svelte';
	import { askAutoScroll } from '$lib/askScroll';
	import { momalPlain } from '$lib/momalTypes';
	import MomalAnswer from '$lib/components/MomalAnswer.svelte';

	type Turn = { key: string; user?: AskMsg; reply?: AskMsg };

	let {
		large = false,
		anchor = 'bottom',
		onretry,
		onask,
		empty
	}: {
		large?: boolean;
		anchor?: 'bottom' | 'turn';
		onretry: () => void;
		/** Ask a follow-up question straight from an answer. */
		onask?: (q: string) => void;
		empty?: Snippet;
	} = $props();

	const ko = $derived(reading.lang === 'ko');
	const live = $derived(storyAsk.pending ? lastAssistant() : undefined);
	const lastId = $derived(storyAsk.messages[storyAsk.messages.length - 1]?.id);

	const turns = $derived.by(() => {
		const out: Turn[] = [];
		for (const m of storyAsk.messages) {
			if (m.role === 'user') out.push({ key: m.id, user: m });
			else if (out.length && !out[out.length - 1].reply) out[out.length - 1].reply = m;
			else out.push({ key: m.id, reply: m });
		}
		return out;
	});
	const lastUserId = $derived(turns[turns.length - 1]?.user?.id);

	let logEl = $state<HTMLElement | undefined>();
	let lastTurnEl: HTMLElement | undefined;
	let pinned = $state(true);
	let spacer = $state(0);
	let copied = $state<string | null>(null);

	function attachLog(el: HTMLElement) {
		logEl = el;
		pinned = true;
		const cleanup =
			anchor === 'bottom'
				? askAutoScroll(el, (sticky) => {
						pinned = sticky;
					})
				: () => {};
		return () => {
			if (logEl === el) logEl = undefined;
			cleanup();
		};
	}

	/** Room under the newest turn, so it can sit at the top of the page while it is short. */
	function measure() {
		if (!logEl || !lastTurnEl) {
			spacer = 0;
			return;
		}
		const cs = getComputedStyle(logEl);
		const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
		spacer = Math.max(0, logEl.clientHeight - pad - lastTurnEl.offsetHeight - 24);
	}

	function attachLastTurn(el: HTMLElement) {
		lastTurnEl = el;
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		if (logEl) ro.observe(logEl);
		measure();
		return () => {
			ro.disconnect();
			if (lastTurnEl === el) lastTurnEl = undefined;
		};
	}

	let seenUser: string | undefined | null = null;
	$effect(() => {
		const id = lastUserId;
		if (anchor !== 'turn' || !logEl) return;
		const first = seenUser === null;
		if (!first && id === seenUser) return;
		seenUser = id;
		void tick().then(() =>
			requestAnimationFrame(() => {
				if (!logEl || !lastTurnEl) return;
				measure();
				logEl.scrollTo({ top: Math.max(0, lastTurnEl.offsetTop - 16), behavior: first ? 'instant' : 'smooth' });
			})
		);
	});

	function jumpToLatest() {
		if (!logEl) return;
		pinned = true;
		logEl.scrollTo({ top: logEl.scrollHeight, behavior: 'smooth' });
	}

	async function copy(m: AskMsg) {
		try {
			await navigator.clipboard.writeText(momalPlain(m.content));
			copied = m.id;
			setTimeout(() => {
				if (copied === m.id) copied = null;
			}, 1400);
		} catch {
			/* clipboard blocked */
		}
	}
</script>

<div
	class="log"
	class:large
	role="log"
	aria-live="polite"
	aria-busy={storyAsk.pending}
	onwheel={(e) => e.stopPropagation()}
	{@attach attachLog}
>
	<div class="column">
		{#if !storyAsk.messages.length && empty}
			{@render empty()}
		{/if}
		{#each turns as turn, i (turn.key)}
			<div class="turn" {@attach anchor === 'turn' && i === turns.length - 1 ? attachLastTurn : undefined}>
				{#if turn.user}
					<div class="row user" in:fly={{ y: 12, duration: 360, easing: cubicOut }}>
						<p class="bubble user">{turn.user.content}</p>
					</div>
				{/if}
				{#if turn.reply}
					{@const m = turn.reply}
					<div class="row assistant">
							<div class="answer">
								<MomalAnswer
									{m}
									{large}
									{onask}
									live={m.id === live?.id}
									followups={m.id === lastId && !storyAsk.pending}
								/>
								{#if m.id !== live?.id}
									<div class="actions">
										<button type="button" class="act" onclick={() => copy(m)} aria-label={ko ? '답 복사' : 'Copy answer'}>
											<span class="material-symbols-outlined" aria-hidden="true">
												{copied === m.id ? 'check' : 'content_copy'}
											</span>
											{copied === m.id ? (ko ? '복사됨' : 'Copied') : ko ? '복사' : 'Copy'}
										</button>
										{#if m.id === lastId && !storyAsk.pending}
											<button type="button" class="act" onclick={onretry} aria-label={ko ? '다시 묻기' : 'Ask again'}>
												<span class="material-symbols-outlined" aria-hidden="true">refresh</span>
												{ko ? '다시' : 'Retry'}
											</button>
										{/if}
									</div>
								{/if}
							</div>
					</div>
				{/if}
			</div>
		{/each}
		{#if storyAsk.error}
			<p class="err">
				{storyAsk.error}
				{#if !storyAsk.pending && turns.length}
					<button type="button" class="act" onclick={onretry}>{ko ? '다시 시도' : 'Try again'}</button>
				{/if}
			</p>
		{/if}
		{#if anchor === 'turn' && turns.length}
			<div class="spacer" style:height="{spacer}px" aria-hidden="true"></div>
		{/if}
	</div>
</div>

{#if anchor === 'bottom' && !pinned && storyAsk.messages.length}
	<button type="button" class="jump" onclick={jumpToLatest} aria-label={ko ? '맨 아래로' : 'Jump to latest'}>
		<span class="material-symbols-outlined" aria-hidden="true">arrow_downward</span>
	</button>
{/if}

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;
	$ink: #0a0a0f;

	.log {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		padding: 0.6rem 1rem 1.1rem;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
		&.large {
			padding: 5rem 1.25rem 11rem;
		}
	}

	.column {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		.large & {
			min-height: 0;
			max-width: 48rem;
			margin: 0 auto;
			gap: 1.6rem;
		}
	}

	.turn {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		.large & {
			gap: 1.1rem;
		}
	}

	.row {
		display: flex;
		max-width: 100%;
		&.user {
			justify-content: flex-end;
		}
	}

	.bubble {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		letter-spacing: -0.012em;
		&.user {
			max-width: 86%;
			padding: 0.5rem 0.9rem;
			border-radius: 20px;
			background: #fff;
			color: #18181b;
			font-weight: 500;
			white-space: pre-wrap;
			word-break: break-word;
		}
		.large & {
			font-size: 1rem;
			line-height: 1.65;
			&.user {
				max-width: 90%;
				padding: 0.65rem 1.05rem;
				color: #fff;
				background: linear-gradient(
					to top left,
					rgba($blue, 0.34),
					rgba($gold, 0.14) 55%,
					rgba($red, 0.26)
				);
				box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
			}
		}
	}

	.answer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		max-width: 100%;
		width: 100%;
		.large & {
			gap: 0.55rem;
		}
	}

	.actions {
		display: flex;
		gap: 0.15rem;
		margin-left: -0.35rem;
	}

	.act {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.5rem 0.2rem 0.38rem;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.4);
		font: inherit;
		font-size: 0.7rem;
		font-weight: 550;
		cursor: pointer;
		& .material-symbols-outlined {
			font-size: 0.9rem;
		}
		&:hover {
			background: rgba(255, 255, 255, 0.08);
			color: rgba(255, 255, 255, 0.85);
		}
	}

	.err {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: #ff9b9b;
	}

	.spacer {
		flex: 0 0 auto;
	}

	.jump {
		position: absolute;
		left: 50%;
		bottom: 5.6rem;
		z-index: 2;
		width: 2.1rem;
		height: 2.1rem;
		display: grid;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 999px;
		background: rgba(20, 20, 26, 0.9);
		color: #fff;
		cursor: pointer;
		transform: translateX(-50%);
		&:hover {
			background: #fff;
			color: $ink;
		}
		& .material-symbols-outlined {
			font-size: 1.1rem;
		}
	}
</style>
