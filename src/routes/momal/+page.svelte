<script lang="ts">
	/**
	 * Momal's own page. Empty, the welcome and the input sit in the middle of the screen;
	 * the first question sends the input down to the bottom and lifts the welcome away.
	 * The corner shell in the root layout grows over this page on the way in and fades into it.
	 */
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { reading } from '$lib/reading.svelte';
	import { MOMAL_HINTS, leaveMomalPage, type MomalHint } from '$lib/momal';
	import MomalMark from '$lib/components/MomalMark.svelte';
	import MomalAurora from '$lib/components/MomalAurora.svelte';
	import MomalLog from '$lib/components/MomalLog.svelte';
	import MomalComposer from '$lib/components/MomalComposer.svelte';
	import MomalThreads from '$lib/components/MomalThreads.svelte';

	const ko = $derived(reading.lang === 'ko');
	const lang = $derived(ko ? 'ko' : 'en');
	const started = $derived(storyAsk.messages.length > 0);
	const from = $derived(storyAsk.context.title);
	const hints = $derived<readonly MomalHint[]>(
		from
			? [{ en: `What should I know about ${from}?`, ko: `${from}에 대해 알아야 할 것은?`, icon: 'visibility' }, ...MOMAL_HINTS.slice(0, 5)]
			: MOMAL_HINTS
	);

	let drawer = $state(false);
	let composer = $state<ReturnType<typeof MomalComposer> | undefined>();
	let threads = $state<ReturnType<typeof MomalThreads> | undefined>();

	onMount(() => {
		storyAsk.restore();
		const id = setTimeout(() => composer?.focus(), 620);
		return () => clearTimeout(id);
	});

	function send(preset?: string) {
		void storyAsk.send(storyAsk.context.path, lang, preset);
	}

	function retry() {
		void storyAsk.retry(storyAsk.context.path, lang);
	}

	function fresh() {
		storyAsk.reset();
		composer?.focus();
	}

	function picked() {
		drawer = false;
		composer?.focus();
	}

	function onKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			drawer = true;
			void threads?.focusSearch();
			return;
		}
		if (e.key !== 'Escape') return;
		e.preventDefault();
		if (drawer) drawer = false;
		else leaveMomalPage(false);
	}
</script>

<svelte:window onkeydown={onKey} />

<svelte:head>
	<title>{ko ? '모말' : 'Momal'} · King for All</title>
	<meta
		name="description"
		content="Ask Momal, the chronicle's guide, about the people, places and record of the Three Kingdoms."
	/>
</svelte:head>

<div class="page" class:started>
	<MomalAurora strength={0.28} />
	<h1 class="sr">{ko ? '모말과 대화' : 'Chat with Momal'}</h1>

	<MomalThreads bind:this={threads} open={drawer} onclose={() => (drawer = false)} onpick={picked} />

	<header class="top">
		<button
			type="button"
			class="burger"
			class:open={drawer}
			onclick={() => (drawer = !drawer)}
			aria-expanded={drawer}
			aria-label={ko ? '대화 목록' : 'Chats'}
		>
			<span></span><span></span><span></span>
		</button>

		<button
			type="button"
			class="brand"
			class:show={started}
			onclick={fresh}
			tabindex={started ? 0 : -1}
			aria-hidden={!started}
			title={ko ? '새 대화' : 'New chat'}
		>
			<MomalMark size={20} spinning={storyAsk.pending} />
			<span>{ko ? '모말' : 'Momal'}</span>
		</button>

		<div class="right">
			{#if from}
				<button
					type="button"
					class="where"
					onclick={() => leaveMomalPage(true)}
					title={ko ? `${from}(으)로 돌아가기` : `Back to ${from}`}
				>
					<span class="material-symbols-outlined" aria-hidden="true">visibility</span>
					<span class="where-text">{from}</span>
				</button>
			{/if}
			<button
				type="button"
				class="icon"
				onclick={() => leaveMomalPage(true)}
				aria-label={ko ? '창으로 줄이기' : 'Shrink to panel'}
				title={ko ? '창으로 줄이기' : 'Shrink to panel'}
			>
				<span class="material-symbols-outlined" aria-hidden="true">close_fullscreen</span>
			</button>
			<button
				type="button"
				class="icon"
				onclick={() => leaveMomalPage(false)}
				aria-label={ko ? '닫기' : 'Close'}
				title={ko ? '닫기 (Esc)' : 'Close (Esc)'}
			>
				<span class="material-symbols-outlined" aria-hidden="true">close</span>
			</button>
		</div>
	</header>

	<MomalLog large anchor="turn" onretry={retry} onask={send} />

	<div class="dock">
		<div class="welcome" aria-hidden={started}>
			<MomalMark size={84} />
			<p class="title">{ko ? '모말에게 묻기' : 'Ask Momal'}</p>
			<p class="sub">
				{ko
					? '삼국사기와 삼국유사, 위키와 이 책의 대본을 읽은 길잡이'
					: 'Your guide to the Samguk Sagi, the Samguk Yusa, and this chronicle'}
			</p>
		</div>

		<div class="bar">
			<MomalComposer bind:this={composer} id="momal-page-q" large onsend={() => send()} />
		</div>

		{#if !started}
			<div class="samples" transition:slide={{ duration: 420, easing: cubicOut }}>
				{#each hints as hint (hint.en)}
					<button type="button" class="sample" onclick={() => send(ko ? hint.ko : hint.en)}>
						<span class="material-symbols-outlined" aria-hidden="true">{hint.icon}</span>
						<span>{ko ? hint.ko : hint.en}</span>
					</button>
				{/each}
			</div>
		{/if}

		<p class="fine">{ko ? '모말은 틀릴 수 있다. 기록을 확인할 것.' : 'Momal can be wrong. Check the record.'}</p>
	</div>
</div>

<style lang="scss">
	$gold: #ffb900;
	$bg: #050507;
	$glide: cubic-bezier(0.2, 0.8, 0.2, 1);

	.page {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		flex-direction: column;
		background: $bg;
		color: #fff;
		font-family: 'Inter', 'Noto Sans KR', system-ui, sans-serif;
		letter-spacing: -0.02em;
		color-scheme: dark;
		animation: page-in 420ms ease both;
	}

	@keyframes page-in {
		from {
			opacity: 0;
		}
	}

	.top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 6;
		display: flex;
		align-items: center;
		height: 3.6rem;
		padding: 0 0.75rem 0 1.1rem;
		pointer-events: none;
		background: linear-gradient($bg 30%, rgba($bg, 0));
		& > * {
			pointer-events: auto;
		}
	}

	.burger {
		width: 2.4rem;
		height: 2.4rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 4px;
		border: none;
		border-radius: 10px;
		background: transparent;
		cursor: pointer;
		& span {
			display: block;
			width: 18px;
			height: 2px;
			border-radius: 2px;
			background: rgba(255, 255, 255, 0.8);
			transition:
				transform 0.3s $glide,
				opacity 0.2s ease;
		}
		&:hover {
			background: rgba(255, 255, 255, 0.08);
		}
		&.open span:nth-child(1) {
			transform: translateY(6px) rotate(45deg);
		}
		&.open span:nth-child(2) {
			opacity: 0;
		}
		&.open span:nth-child(3) {
			transform: translateY(-6px) rotate(-45deg);
		}
	}

	/* Stanley's centre pill: only once the conversation has begun. */
	.brand {
		position: absolute;
		left: 50%;
		top: 0.6rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 1.6rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(22, 22, 28, 0.7);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		color: #fff;
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-style: italic;
		font-size: 1.15rem;
		font-weight: 500;
		cursor: pointer;
		opacity: 0;
		transform: translate(-50%, -6px);
		pointer-events: none;
		transition:
			opacity 0.3s $glide,
			transform 0.4s $glide;
		&.show {
			opacity: 1;
			transform: translate(-50%, 0);
			pointer-events: auto;
		}
		&:hover {
			border-color: rgba(255, 255, 255, 0.24);
		}
	}

	.right {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.where {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		max-width: 14rem;
		margin-right: 0.3rem;
		padding: 0.3rem 0.7rem 0.3rem 0.5rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.72);
		font: inherit;
		font-size: 0.74rem;
		font-weight: 550;
		cursor: pointer;
		& .material-symbols-outlined {
			font-size: 0.95rem;
			color: rgba(255, 255, 255, 0.5);
		}
		&:hover {
			background: rgba(255, 255, 255, 0.11);
			color: #fff;
		}
	}

	.where-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.icon {
		width: 2.2rem;
		height: 2.2rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.62);
		cursor: pointer;
		&:hover {
			background: rgba(255, 255, 255, 0.1);
			color: #fff;
		}
		& .material-symbols-outlined {
			font-size: 1.2rem;
		}
	}

	/* Input dock. Centred on an empty page, it glides to the bottom on the first question. */
	.dock {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 1.25rem max(0.9rem, env(safe-area-inset-bottom, 0px));
		pointer-events: none;
		transform: translateY(calc(-50dvh + 50%));
		transition: transform 1000ms $glide;
		& > * {
			pointer-events: auto;
		}
		.started & {
			transform: translateY(0);
		}
	}

	.welcome {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		text-align: center;
		transition:
			opacity 1000ms ease-in-out,
			transform 1000ms ease-in-out,
			filter 1000ms ease-in-out;
		.started & {
			opacity: 0;
			transform: translateY(calc(-25dvh - 45%)) scale(0.75);
			filter: blur(36px);
			pointer-events: none;
		}
	}

	.title {
		margin: 0.7rem 0 0;
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-style: italic;
		font-size: clamp(2.6rem, 6vw, 3.6rem);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.03em;
		background: linear-gradient(100deg, #ff8a8a, $gold 50%, #8cb4ff);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.sub {
		margin: 0;
		font-size: 0.88rem;
		font-weight: 550;
		color: rgba(255, 255, 255, 0.45);
	}

	.bar {
		position: relative;
		width: 100%;
		max-width: 48rem;
		&::before {
			content: '';
			position: absolute;
			left: 50%;
			width: 100vw;
			bottom: -2.5rem;
			height: calc(100% + 6rem);
			transform: translateX(-50%);
			background: linear-gradient(rgba($bg, 0), rgba($bg, 0.88) 55%);
			opacity: 0;
			transition: opacity 600ms ease;
			pointer-events: none;
			z-index: -1;
		}
		.started &::before {
			opacity: 1;
		}
	}

	.samples {
		width: 100%;
		max-width: 48rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
		padding-top: 1.4rem;
	}

	.sample {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.95rem;
		border-radius: 999px;
		border: 1px solid transparent;
		background: transparent;
		color: rgba(255, 255, 255, 0.5);
		font: inherit;
		font-size: 0.84rem;
		font-weight: 550;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
		& .material-symbols-outlined {
			font-size: 1rem;
		}
		&:hover {
			border-color: rgba(255, 255, 255, 0.18);
			color: #fff;
			& .material-symbols-outlined {
				color: $gold;
			}
		}
	}

	.fine {
		position: relative;
		margin: 0.6rem 0 0;
		font-size: 0.66rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.3);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	@media (max-width: 720px) {
		.where {
			display: none;
		}
		.samples {
			flex-direction: column;
			align-items: stretch;
		}
		.sample {
			border-color: rgba(255, 255, 255, 0.14);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.page {
			animation: none;
		}
		.dock,
		.welcome {
			transition-duration: 1ms;
		}
	}
</style>
