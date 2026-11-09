<script lang="ts">
	/**
	 * Momal, the chronicle's guide. One fixed shell in the root layout that changes shape:
	 * the corner pill grows into the floating panel, and on `/momal` the shell grows to fill
	 * the screen and fades into the full chat page beneath it. Leaving the page, it reappears
	 * full-size and shrinks back. The panel body is laid out at its open size and anchored
	 * bottom-right, so the shell unfolds over it instead of squeezing it.
	 */
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { reading } from '$lib/reading.svelte';
	import { MOMAL_HINTS, MOMAL_PATH, leaveMomalPage, openMomalPage } from '$lib/momal';
	import MomalMark from '$lib/components/MomalMark.svelte';
	import MomalAurora from '$lib/components/MomalAurora.svelte';
	import MomalLog from '$lib/components/MomalLog.svelte';
	import MomalComposer from '$lib/components/MomalComposer.svelte';

	type Mode = 'fab' | 'panel' | 'page';

	const ko = $derived(reading.lang === 'ko');
	const lang = $derived(ko ? 'ko' : 'en');
	const onPage = $derived(page.url.pathname === MOMAL_PATH);
	const mode = $derived<Mode>(onPage ? 'page' : storyAsk.open ? 'panel' : 'fab');
	const path = $derived(`${page.url.pathname}${page.url.search}`);

	let ready = $state(false);
	let fabEl = $state<HTMLButtonElement | undefined>();
	let composer = $state<ReturnType<typeof MomalComposer> | undefined>();

	onMount(() => {
		storyAsk.restore();
		const raf = requestAnimationFrame(() => (ready = true));
		return () => cancelAnimationFrame(raf);
	});

	afterNavigate(() => {
		if (page.url.pathname === MOMAL_PATH) return;
		storyAsk.context = {
			path: `${page.url.pathname}${page.url.search}`,
			title: document.title.split(/\s[|·—–-]\s/)[0].trim()
		};
	});

	function send(preset?: string) {
		void storyAsk.send(path, lang, preset);
	}

	function retry() {
		void storyAsk.retry(path, lang);
	}

	function onKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'j') {
			e.preventDefault();
			if (mode === 'page') leaveMomalPage(false);
			else storyAsk.toggle();
			return;
		}
		/* The page handles its own Escape (it closes the chat drawer first). */
		if (e.key === 'Escape' && mode === 'panel') {
			e.stopPropagation();
			storyAsk.hide();
		}
	}

	/* Focus follows the shape: the composer once the panel has opened, the pill once it closes. */
	let lastMode: Mode | undefined;
	$effect(() => {
		const m = mode;
		const prev = lastMode;
		lastMode = m;
		if (prev === undefined || prev === m || m === 'page') return;
		const id = setTimeout(() => {
			void tick().then(() => {
				if (m === 'fab') fabEl?.focus({ preventScroll: true });
				else composer?.focus();
			});
		}, 260);
		return () => clearTimeout(id);
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="momal {mode}" class:ready class:thinking={storyAsk.pending} inert={mode === 'page'}>
	<MomalAurora strength={0.16} size="34rem" />

	<button
		type="button"
		class="face"
		bind:this={fabEl}
		onclick={() => storyAsk.show()}
		tabindex={mode === 'fab' ? 0 : -1}
		aria-hidden={mode !== 'fab'}
		aria-label={ko ? '모말에게 묻기' : 'Ask Momal'}
		title={ko ? '모말에게 묻기 (⌘J)' : 'Ask Momal (⌘J)'}
	>
		<MomalMark size={20} spinning={storyAsk.pending} />
		<span class="face-name">{ko ? '모말' : 'Momal'}</span>
	</button>

	<section class="body" inert={mode !== 'panel'} aria-label={ko ? '모말과 대화' : 'Chat with Momal'}>
		<header>
			<div class="id">
				<MomalMark size={26} spinning={storyAsk.pending} />
				<div class="who">
					<p class="name">{ko ? '모말' : 'Momal'}</p>
					<p class="role">{ko ? '기록을 지키는 이' : 'Keeper of the record'}</p>
				</div>
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
					onclick={openMomalPage}
					aria-label={ko ? '전체 화면' : 'Open full page'}
					title={ko ? '전체 화면' : 'Open full page'}
				>
					<span class="material-symbols-outlined" aria-hidden="true">open_in_full</span>
				</button>
				<button
					type="button"
					class="icon"
					onclick={() => storyAsk.hide()}
					aria-label={ko ? '닫기' : 'Close'}
					title={ko ? '닫기' : 'Close'}
				>
					<span class="material-symbols-outlined" aria-hidden="true">close</span>
				</button>
			</div>
		</header>

		<MomalLog onretry={retry} onask={send}>
			{#snippet empty()}
				<div class="empty">
					<MomalMark size={40} />
					<h2>{ko ? '무엇이 궁금한가?' : 'What would you like to know?'}</h2>
					<p class="hint">
						{ko
							? '삼국사기·삼국유사, 위키, 나무위키, 그리고 이 책의 위키와 대본을 읽고 답한다. 기록과 이 이야기는 구분해 말한다.'
							: 'I have read the Samguk Sagi and Yusa, Wikipedia, Namu wiki, and this book’s wiki and script. I keep the record and the chronicle apart.'}
					</p>
					<div class="chips">
						{#each MOMAL_HINTS.slice(0, 3) as hint (hint.en)}
							<button type="button" class="chip" onclick={() => send(ko ? hint.ko : hint.en)}>
								<span>{ko ? hint.ko : hint.en}</span>
								<span class="material-symbols-outlined" aria-hidden="true">arrow_outward</span>
							</button>
						{/each}
					</div>
				</div>
			{/snippet}
		</MomalLog>

		<div class="foot">
			<MomalComposer bind:this={composer} id="momal-panel-q" onsend={() => send()} />
			<p class="fine">{ko ? '모말은 틀릴 수 있다. 기록을 확인할 것.' : 'Momal can be wrong. Check the record.'}</p>
		</div>
	</section>
</div>

<style lang="scss">
	@property --momal-turn {
		syntax: '<angle>';
		inherits: false;
		initial-value: 0deg;
	}

	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;
	$ink: #0a0a0f;
	$ease: cubic-bezier(0.32, 0.72, 0, 1);
	$morph: 560ms;
	$ring: 1.5px;

	.momal {
		/* Sizes for each shape. The body always keeps the panel size. */
		--fab-w: 7.6rem;
		--fab-h: 2.9rem;
		--panel-w: min(27rem, calc(100vw - 1.4rem));
		--panel-h: min(38rem, calc(100dvh - 6.5rem));
		--edge: 1.1rem;
		--w: var(--fab-w);
		--h: var(--fab-h);

		position: fixed;
		right: var(--edge);
		bottom: var(--edge);
		z-index: 210;
		width: var(--w);
		height: var(--h);
		border-radius: 999px;
		overflow: hidden;
		color: #fff;
		font-family: 'Inter', 'Noto Sans KR', system-ui, sans-serif;
		letter-spacing: -0.02em;
		border: $ring solid transparent;
		background:
			linear-gradient($ink, $ink) padding-box,
			conic-gradient(from var(--momal-turn), $red, $gold, $blue, $red) border-box;
		box-shadow:
			-14px 18px 40px -18px rgba($blue, 0.55),
			14px 18px 40px -18px rgba($red, 0.5),
			0 -10px 36px -20px rgba($gold, 0.45),
			0 2px 6px rgba(0, 0, 0, 0.3);
		animation: momal-turn 9s linear infinite;
		color-scheme: dark;

		&.ready {
			transition:
				width $morph $ease,
				height $morph $ease,
				right $morph $ease,
				bottom $morph $ease,
				border-radius $morph $ease,
				box-shadow $morph ease,
				opacity 0s;
		}

		&.thinking {
			animation-duration: 2.2s;
		}

		&.panel {
			--w: var(--panel-w);
			--h: var(--panel-h);
			border-radius: 28px;
		}

		/* Grow to the screen, then hand over to the page underneath. */
		&.page {
			--w: 100vw;
			--h: 100dvh;
			right: 0;
			bottom: 0;
			border-radius: 0;
			opacity: 0;
			pointer-events: none;
			box-shadow: none;
			&.ready {
				transition:
					width $morph $ease,
					height $morph $ease,
					right $morph $ease,
					bottom $morph $ease,
					border-radius $morph $ease,
					box-shadow $morph ease,
					opacity 260ms ease 480ms;
			}
		}
	}

	@keyframes momal-turn {
		to {
			--momal-turn: 360deg;
		}
	}

	/* The pill. It fades as the shell starts to grow and returns as it lands. */
	.face {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0 0.95rem 0 0.8rem;
		border: none;
		border-radius: inherit;
		background: transparent;
		color: #fff;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 650;
		letter-spacing: -0.02em;
		cursor: pointer;
		transition: opacity 220ms ease 260ms;
		&:hover {
			background: rgba(255, 255, 255, 0.06);
		}
		&:focus-visible {
			outline: 2px solid #fff;
			outline-offset: -4px;
		}
		.momal:not(.fab) & {
			opacity: 0;
			pointer-events: none;
			transition: opacity 120ms ease;
		}
	}

	.body {
		position: absolute;
		right: 0;
		bottom: 0;
		z-index: 1;
		width: var(--panel-w);
		height: var(--panel-h);
		display: flex;
		flex-direction: column;
		opacity: 0;
		transform: scale(0.97);
		transform-origin: bottom right;
		transition:
			opacity 160ms ease,
			transform 160ms ease;
		.momal.panel & {
			opacity: 1;
			transform: none;
			transition:
				opacity 300ms ease 140ms,
				transform $morph $ease;
		}
	}

	header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 0.75rem 0.7rem 1rem;
		flex: 0 0 auto;
	}

	.id {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.who {
		min-width: 0;
	}

	.name {
		margin: 0;
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-style: italic;
		font-size: 1.28rem;
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.01em;
		background: linear-gradient(100deg, #ff8a8a, $gold 50%, #8cb4ff);
		background-clip: text;
		-webkit-background-clip: text;
		color: transparent;
	}

	.role {
		margin: 0.22rem 0 0;
		font-size: 0.68rem;
		font-weight: 550;
		color: rgba(255, 255, 255, 0.5);
	}

	.tools {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.1rem;
	}

	.icon {
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.62);
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease;
		&:hover:not(:disabled) {
			background: rgba(255, 255, 255, 0.1);
			color: #fff;
		}
		&:disabled {
			opacity: 0.3;
			cursor: default;
		}
		& .material-symbols-outlined {
			font-size: 1.12rem;
		}
	}

	.empty {
		margin: auto 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}

	h2 {
		margin: 0.35rem 0 0;
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 1.55rem;
		font-weight: 500;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.hint {
		margin: 0;
		font-size: 0.84rem;
		font-weight: 500;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.62);
	}

	/* Ovid's glass feature rows. */
	.chips {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.3rem;
	}

	.chip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		width: 100%;
		padding: 0.72rem 0.9rem;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 4px 14px rgba(0, 0, 0, 0.14);
		color: rgba(255, 255, 255, 0.86);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 550;
		text-align: left;
		cursor: pointer;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			transform 0.18s $ease;
		& .material-symbols-outlined {
			font-size: 1rem;
			color: rgba(255, 255, 255, 0.4);
			transition: color 0.18s ease;
		}
		&:hover {
			background: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.28);
			transform: translateY(-1px);
			& .material-symbols-outlined {
				color: $gold;
			}
		}
	}

	.foot {
		flex: 0 0 auto;
		padding: 0.4rem 0.75rem 0.65rem;
	}

	.fine {
		margin: 0.4rem 0 0;
		text-align: center;
		font-size: 0.64rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.34);
	}

	@media (max-width: 720px) {
		.momal {
			--edge: 0.7rem;
			bottom: calc(var(--tabbar-space, 0px) + 0.7rem);
			&.panel {
				--panel-h: min(38rem, calc(100dvh - var(--tabbar-space, 0px) - 5rem));
			}
			&.page {
				bottom: 0;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.momal {
			animation: none;
		}
		.momal.ready,
		.momal.page.ready,
		.body,
		.face {
			transition: opacity 150ms ease !important;
		}
	}
</style>
