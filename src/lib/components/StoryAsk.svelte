<script lang="ts">
	/**
	 * Floating chronicle chat: stream, markdown, a fixed box.
	 * One instance in the root layout is enough for the whole site.
	 */
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { storyAsk, lastAssistant } from '$lib/storyAsk.svelte';
	import { reading } from '$lib/reading.svelte';
	import { askMarkdown } from '$lib/askMarkdown';
	import { askAutoScroll } from '$lib/askScroll';

	const ko = $derived(reading.lang === 'ko');
	const path = $derived(`${page.url.pathname}${page.url.search}`);
	const lang = $derived(ko ? 'ko' : 'en');
	const liveId = $derived(storyAsk.pending ? lastAssistant()?.id : undefined);

	const HINTS = [
		{ en: 'Who is Momal?', ko: '모말은 누구인가' },
		{ en: 'Who is Park Jesang?', ko: '박제상은 누구인가' },
		{ en: 'How are Yushin and Bidam related?', ko: '유신과 비담은 몇 촌인가' }
	] as const;

	let field = $state<HTMLTextAreaElement | undefined>();
	let pinned = $state(true);
	let logEl = $state<HTMLElement | undefined>();

	function logScroll(el: HTMLElement) {
		logEl = el;
		pinned = true;
		const cleanup = askAutoScroll(el, (sticky) => {
			pinned = sticky;
		});
		return () => {
			if (logEl === el) logEl = undefined;
			cleanup();
		};
	}

	function jumpToLatest() {
		if (!logEl) return;
		pinned = true;
		logEl.scrollTo({ top: logEl.scrollHeight, behavior: 'smooth' });
	}

	function grow(el: HTMLTextAreaElement | undefined = field) {
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
	}

	function send(preset?: string) {
		void storyAsk.send(path, lang, preset).then(() => grow());
	}

	function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		send();
	}

	function onComposerKey(e: KeyboardEvent) {
		if (e.key !== 'Enter' || e.shiftKey) return;
		if (e.isComposing || e.keyCode === 229) return;
		e.preventDefault();
		if (storyAsk.input.trim()) send();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && storyAsk.open) {
			e.stopPropagation();
			storyAsk.hide();
		}
	}

	$effect(() => {
		if (!storyAsk.open) return;
		void tick().then(() => {
			field?.focus();
			grow();
		});
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="ask" class:open={storyAsk.open}>
	{#if storyAsk.open}
		<section
			class="panel"
			aria-label={ko ? '모말에게 묻기' : 'Ask Momal'}
			aria-busy={storyAsk.pending}
			in:fly={{ y: 18, duration: 360, easing: cubicOut }}
			out:fly={{ y: 12, duration: 200, easing: cubicOut }}
			onwheel={(e) => e.stopPropagation()}
		>
			<header>
				<img class="face" src="/ch_park_jesang.png" alt="" width="40" height="40" />
				<div class="who">
					<p class="kicker">Momal</p>
					<h2>{ko ? '무엇이든 물어보세요' : 'Ask anything'}</h2>
				</div>
				<div class="tools">
					<button
						type="button"
						class="icon"
						onclick={() => storyAsk.reset()}
						disabled={!storyAsk.messages.length && !storyAsk.input}
						aria-label={ko ? '새 대화' : 'New chat'}
						title={ko ? '새 대화' : 'New chat'}
					>
						<span class="material-symbols-outlined" aria-hidden="true">edit_square</span>
					</button>
					<button
						type="button"
						class="icon"
						onclick={() => storyAsk.hide()}
						aria-label={ko ? '닫기' : 'Close'}
					>
						<span class="material-symbols-outlined" aria-hidden="true">close</span>
					</button>
				</div>
			</header>
			<div class="log" role="log" aria-live="polite" {@attach logScroll}>
				{#if !storyAsk.messages.length}
					<div class="empty">
						<p class="hint">
							{ko
								? '모말입니다. 삼국사기·삼국유사, 위키, 나무위키, 그리고 이 책의 위키와 대본을 읽고 답합니다. 기록과 이 이야기는 구분해 말합니다.'
								: 'I am Momal. I read the Samguk Sagi and Yusa, Wikipedia, Namu wiki, and this book’s wiki and script. I keep the record and this chronicle apart.'}
						</p>
						<div class="chips">
							{#each HINTS as hint (hint.en)}
								<button type="button" class="chip" onclick={() => send(ko ? hint.ko : hint.en)}>
									{ko ? hint.ko : hint.en}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				{#each storyAsk.messages as m (m.id)}
					<div
						class="row {m.role}"
						in:fly={{ y: 12, duration: 360, easing: cubicOut }}
					>
						{#if m.role === 'user'}
							<p class="bubble user">{m.content}</p>
						{:else if !m.content.trim() && storyAsk.pending && m.id === liveId}
							<p class="bubble assistant thinking" aria-label={ko ? '듣는 중' : 'Listening'}>
								<span></span><span></span><span></span>
							</p>
						{:else}
							<div
								class="bubble assistant md"
								class:live={m.id === liveId}
							>
								{@html askMarkdown(m.content)}
							</div>
						{/if}
					</div>
				{/each}
				{#if storyAsk.error}
					<p class="err">{storyAsk.error}</p>
				{/if}
			</div>
			{#if !pinned && storyAsk.messages.length}
				<button type="button" class="jump" onclick={jumpToLatest} aria-label={ko ? '맨 아래로' : 'Jump to latest'}>
					<span class="material-symbols-outlined" aria-hidden="true">arrow_downward</span>
				</button>
			{/if}
			<form onsubmit={onSubmit}>
				<label class="sr" for="story-ask-q">{ko ? '질문' : 'Question'}</label>
				<div class="composer">
					<textarea
						id="story-ask-q"
						rows="1"
						bind:this={field}
						bind:value={storyAsk.input}
						placeholder={ko ? '모말에게 묻기' : 'Message Momal'}
						autocomplete="off"
						enterkeyhint="send"
						onkeydown={onComposerKey}
						oninput={() => grow()}
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
				</div>
			</form>
		</section>
	{/if}
	<button
		type="button"
		class="fab"
		class:on={storyAsk.open}
		onclick={() => storyAsk.toggle()}
		aria-pressed={storyAsk.open}
		aria-label={ko ? '모말에게 묻기' : 'Ask Momal'}
	>
		<span class="material-symbols-outlined" aria-hidden="true">chat</span>
		Momal
	</button>
</div>

<style>
	.ask {
		position: fixed;
		right: 1.1rem;
		bottom: 1.1rem;
		z-index: 200;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.65rem;
		pointer-events: none;
	}

	.panel,
	.fab {
		pointer-events: auto;
	}

	.panel {
		position: relative;
		width: 26rem;
		height: 34rem;
		display: flex;
		flex-direction: column;
		border: 1px solid color-mix(in srgb, var(--gold) 38%, var(--hairline));
		border-radius: 16px;
		background: color-mix(in srgb, var(--bg) 96%, transparent);
		backdrop-filter: blur(22px) saturate(1.15);
		box-shadow: var(--shadow-float);
		overflow: hidden;
	}

	header {
		display: grid;
		grid-template-columns: auto 1fr auto;
		column-gap: 0.65rem;
		align-items: center;
		padding: 0.85rem 0.85rem 0.7rem 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--gold) 22%, transparent);
		flex: 0 0 auto;
	}

	.face {
		width: 2.45rem;
		height: 2.45rem;
		border-radius: 50%;
		object-fit: cover;
		border: 1px solid color-mix(in srgb, var(--gold) 40%, transparent);
	}

	.who {
		min-width: 0;
	}

	.kicker {
		margin: 0;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	h2 {
		margin: 0.12rem 0 0;
		font-family: var(--serif);
		font-size: 1.12rem;
		font-weight: 700;
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}

	.icon {
		width: 1.85rem;
		height: 1.85rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.icon:hover:not(:disabled) {
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		color: var(--fg-strong);
	}

	.icon:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.icon .material-symbols-outlined {
		font-size: 1.15rem;
	}

	.log {
		flex: 1;
		min-height: 0;
		overflow: auto;
		padding: 0.9rem 1rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		overscroll-behavior: contain;
	}

	.log::-webkit-scrollbar {
		width: 6px;
	}

	.log::-webkit-scrollbar-thumb {
		background: var(--scroll-thumb);
		border-radius: 3px;
	}

	.empty {
		margin: auto 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.hint {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		font: inherit;
		font-size: 0.78rem;
		padding: 0.38rem 0.7rem;
		border-radius: var(--radius-pill);
		border: 1px solid color-mix(in srgb, var(--gold) 35%, var(--hairline));
		background: color-mix(in srgb, var(--gold) 10%, transparent);
		color: var(--fg);
		cursor: pointer;
	}

	.chip:hover {
		background: color-mix(in srgb, var(--gold) 22%, transparent);
	}

	.row {
		display: flex;
		max-width: 100%;
	}

	.row.user {
		justify-content: flex-end;
	}

	.bubble {
		margin: 0;
		max-width: 86%;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.bubble.user {
		padding: 0.55rem 0.75rem;
		border-radius: 14px 14px 4px 14px;
		background: color-mix(in srgb, var(--gold) 22%, transparent);
		white-space: pre-wrap;
		word-break: break-word;
	}

	.bubble.assistant {
		color: var(--fg);
		max-width: 100%;
	}

	.md :global(p) {
		margin: 0 0 0.45em;
	}

	.md :global(p:last-child) {
		margin-bottom: 0;
	}

	.md :global(ul),
	.md :global(ol) {
		margin: 0.2em 0 0.5em;
		padding-left: 1.2em;
	}

	.md :global(code) {
		font-size: 0.86em;
		padding: 0.08em 0.32em;
		border-radius: 4px;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.md :global(pre) {
		margin: 0.4em 0;
		padding: 0.6em 0.7em;
		border-radius: 8px;
		overflow: auto;
		background: color-mix(in srgb, var(--panel-sunken) 80%, transparent);
	}

	.md :global(pre code) {
		padding: 0;
		background: none;
	}

	.md :global(a) {
		color: var(--gold);
	}

	.md :global(blockquote) {
		margin: 0.3em 0;
		padding-left: 0.7em;
		border-left: 2px solid color-mix(in srgb, var(--gold) 50%, transparent);
		color: var(--fg-dim);
	}

	.md :global(h1),
	.md :global(h2),
	.md :global(h3) {
		margin: 0.4em 0 0.25em;
		font-family: var(--serif);
		font-size: 1em;
	}

	.md.live :global(p:last-child)::after,
	.md.live:not(:has(p))::after {
		content: '';
		display: inline-block;
		width: 0.48em;
		height: 0.48em;
		margin-left: 0.28em;
		vertical-align: middle;
		border-radius: 50%;
		background: var(--gold);
		animation: ask-dot 1.3s ease-in-out infinite;
	}

	.thinking {
		display: flex;
		gap: 0.28rem;
		padding: 0.55rem 0.15rem;
		align-items: center;
	}

	.thinking span {
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 50%;
		background: var(--gold);
		opacity: 0.35;
		animation: ask-think 1.1s ease-in-out infinite;
	}

	.thinking span:nth-child(2) {
		animation-delay: 0.15s;
	}

	.thinking span:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes ask-dot {
		0%,
		100% {
			transform: scale(0.72);
			opacity: 0.45;
		}
		50% {
			transform: scale(1.18);
			opacity: 1;
		}
	}

	@keyframes ask-think {
		0%,
		100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		50% {
			opacity: 1;
			transform: translateY(-2px);
		}
	}

	.err {
		margin: 0;
		font-size: 0.8rem;
		color: var(--danger, #c24040);
	}

	.jump {
		position: absolute;
		left: 50%;
		bottom: 4.55rem;
		z-index: 1;
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--gold) 40%, var(--hairline));
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 92%, transparent);
		color: var(--fg-strong);
		box-shadow: var(--shadow-pill);
		cursor: pointer;
		transform: translateX(-50%);
	}

	.jump:hover {
		background: var(--gold);
		color: var(--on-gold);
	}

	.jump .material-symbols-outlined {
		font-size: 1.1rem;
	}

	form {
		flex: 0 0 auto;
		padding: 0.55rem 0.7rem 0.75rem;
		border-top: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.composer {
		display: flex;
		align-items: flex-end;
		gap: 0.45rem;
		padding: 0.4rem 0.4rem 0.4rem 0.7rem;
		border-radius: 14px;
		border: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
		background: color-mix(in srgb, var(--bg) 70%, transparent);
		transition: border-color 0.18s ease, box-shadow 0.18s ease;
	}

	.composer:focus-within {
		border-color: color-mix(in srgb, var(--gold) 55%, var(--hairline));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 18%, transparent);
	}

	textarea {
		flex: 1;
		resize: none;
		min-height: 1.5rem;
		max-height: 7.5rem;
		field-sizing: content;
		font: inherit;
		font-size: 0.9rem;
		line-height: 1.45;
		padding: 0.28rem 0;
		border: none;
		background: transparent;
		color: var(--fg);
		outline: none;
	}

	.go {
		flex: 0 0 auto;
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 10%, transparent);
		color: var(--fg-dim);
		cursor: pointer;
		opacity: 0.45;
		transition:
			opacity 0.18s ease,
			background 0.18s ease,
			color 0.18s ease;
	}

	.go.ready,
	.go.stop {
		opacity: 1;
		background: var(--gold);
		color: var(--on-gold);
	}

	.go.ready:hover,
	.go.stop:hover {
		filter: brightness(1.06);
	}

	.go:disabled {
		cursor: default;
	}

	.go .material-symbols-outlined {
		font-size: 1.15rem;
	}

	.fab {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		padding: 0.58rem 0.95rem 0.58rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--gold) 50%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 88%, var(--gold));
		color: var(--fg-strong);
		cursor: pointer;
		box-shadow: var(--shadow-pill);
	}

	.fab .material-symbols-outlined {
		font-size: 1.1rem;
	}

	.fab.on {
		background: var(--gold);
		color: var(--on-gold);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.md.live :global(p:last-child)::after,
		.md.live:not(:has(p))::after,
		.thinking span {
			animation: none;
			opacity: 0.85;
		}
	}

	@media (max-width: 720px) {
		.ask {
			right: 0.7rem;
			bottom: 4.4rem;
		}

		.panel {
			width: min(26rem, calc(100vw - 1.4rem));
			height: min(34rem, calc(100dvh - 7.2rem));
		}
	}
</style>
