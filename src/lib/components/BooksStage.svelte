<script lang="ts">
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { hasWebGL } from '$lib/components/diagrams/three/kit.svelte';
	import { BOOK_PARTS, VOLUMES, type BookMode } from '$lib/books';
	import { spineColor, spineInkOf } from '$lib/spine.svelte';
	import { bookView } from '$lib/bookView.svelte';
	import { volumeCover } from '$lib/posters.svelte';
	import { reading } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';
	import BooksCanvas from './books/BooksCanvas.svelte';

	let {
		hovered = $bindable<string | null>(null),
		selected = $bindable<string | null>(null),
		mode = $bindable<BookMode>('shelf'),
		onopen,
		onback
	}: {
		hovered?: string | null;
		selected?: string | null;
		mode?: BookMode;
		onopen: (id: string) => void;
		onback?: () => void;
	} = $props();

	const reduced = new MediaQuery('(prefers-reduced-motion: reduce)');
	const narrow = new MediaQuery('max-width: 860px');
	let ko = $derived(reading.lang === 'ko');

	let gl = $state(typeof document !== 'undefined' && hasWebGL());
	let broken = $state(false);
	let warmed = $state(false);

	$effect(() => {
		bookView.mode = mode;
	});

	function setMode(next: BookMode, e?: Event) {
		e?.stopPropagation();
		mode = next;
		bookView.mode = next;
	}

	const covers = $derived(
		Object.fromEntries(VOLUMES.map((v) => [v.id, volumeCover(v.id) ?? '']).filter(([, src]) => src))
	);

	const three = $derived(gl && !broken);

	onMount(() => {
		for (const src of Object.values(covers)) {
			if (!src) continue;
			const img = new Image();
			img.src = src;
		}
		if (!hasWebGL()) return;
		gl = true;
		let frames = 0;
		let id = 0;
		const tick = () => {
			frames += 1;
			if (frames >= 3) {
				warmed = true;
				return;
			}
			id = requestAnimationFrame(tick);
		};
		id = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(id);
	});
</script>

<div
	class="stage"
	class:open={!!selected}
	class:narrow={narrow.current}
	class:display={mode === 'display'}
>
	<div class="chrome">
		<div class="modes" role="group" aria-label={ui('View')}>
			<button type="button" class:on={mode === 'shelf'} onclick={(e) => setMode('shelf', e)}>{ui('Shelf')}</button>
			<button type="button" class:on={mode === 'display'} onclick={(e) => setMode('display', e)}>{ui('Display')}</button>
		</div>
	</div>
	{#if three}
		<ol class="parts" class:solo={!!selected} aria-hidden="true">
			{#each BOOK_PARTS as row (row.part)}
				<li>
					<span class="pk">{row.part}</span>
					<span class="pt" class:han={ko}>{ko ? row.korean || row.title : row.title || row.korean}</span>
				</li>
			{/each}
		</ol>
	{/if}
	{#if three}
		<div class="gl-cell" class:ready={warmed}>
			<svelte:boundary
				onerror={(err) => {
					if (import.meta.env.DEV) console.warn('[BooksStage] staying flat:', err);
					broken = true;
				}}
			>
				<BooksCanvas
					{hovered}
					{selected}
					reduced={reduced.current}
					narrow={narrow.current}
					{covers}
					{mode}
					{ko}
					onhover={(id) => (hovered = id)}
					{onopen}
					onback={() => (onback ? onback() : (selected = null))}
				/>
				{#snippet failed()}{/snippet}
			</svelte:boundary>
		</div>
	{/if}
	<div class="fallback" class:hidden={three && warmed} hidden={three && warmed} inert={three && warmed} aria-hidden={three && warmed ? 'true' : undefined}>
		{#each BOOK_PARTS as row (row.part)}
			<div class="row">
				<p class="row-part">
					<span class="pk">{row.part}</span>
					<span class="pt" class:han={ko}>{ko ? row.korean || row.title : row.title || row.korean}</span>
				</p>
				<ul class="line" class:faces={mode === 'display'}>
					{#each row.volumes as volume (volume.id)}
						<li>
							<button
								type="button"
								class:on={hovered === volume.id || selected === volume.id}
								style:--spine={spineColor(volume.id)}
								style:--ink={spineInkOf(volume.id)}
								style:--thick={`${Math.max(8, Math.round(volume.d * 400))}px`}
								onpointerenter={() => (hovered = volume.id)}
								onpointerleave={() => (hovered = null)}
								onclick={() => onopen(volume.id)}
							>
								{#if mode === 'display' && covers[volume.id]}
									<img class="face" src={covers[volume.id]} alt="" />
								{:else}
									<span class="spine">
										<span class="num" class:han={ko}>{String(volume.number).padStart(2, '0')}</span>
										<span class="ttl" class:han={ko}>{ko ? volume.ko || volume.title : volume.title}</span>
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>

<style>
	.stage {
		position: relative;
		width: 100%;
		height: 100%;
		flex: 1 1 auto;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		font-family: var(--ui);
		cursor: default;
	}

	.stage.open,
	.stage:hover {
		cursor: pointer;
	}

	.parts {
		position: absolute;
		left: 0;
		top: 50%;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 44%;
		margin: 0;
		padding: 0.15rem 1.15rem 0.15rem 1.7rem;
		list-style: none;
		pointer-events: none;
		transform: translateY(-50%);
	}

	.stage.display .parts {
		height: 56%;
	}

	.parts.solo {
		display: none;
	}

	.chrome {
		position: absolute;
		top: 0.85rem;
		right: 1rem;
		z-index: 9;
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.stage.open .chrome {
		display: none;
	}

	.gl-cell {
		position: absolute;
		inset: 0;
		z-index: 0;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		opacity: 0;
	}
	.gl-cell.ready {
		opacity: 1;
	}

	.parts li,
	.row-part {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin: 0;
		padding-block: 0.2rem;
	}

	.pk {
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.modes {
		display: flex;
		gap: 0.15rem;
		padding: 0.15rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		backdrop-filter: blur(10px);
	}

	.modes button {
		padding: 0.28rem 0.75rem;
		border: 0;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--fg-dim);
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.modes button.on,
	.modes button:hover,
	.modes button:focus-visible {
		background: color-mix(in srgb, var(--gold) 22%, transparent);
		color: var(--fg-strong);
		outline: none;
	}

	.pt {
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--fg);
		letter-spacing: var(--tracking-display);
		max-width: 9.4rem;
		line-height: 1.3;
		text-wrap: balance;
	}

	.pt.han {
		font-family: var(--display-ko);
		font-weight: 400;
		letter-spacing: 0;
	}

	.fallback {
		position: absolute;
		inset: 0;
		z-index: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.7rem;
		overflow: auto;
		padding: 1.5rem 1rem 3rem;
	}

	.fallback.hidden {
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.row {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 0.6rem;
		max-width: 92rem;
		margin: 0 auto;
		width: 100%;
	}

	.row-part {
		flex: 0 0 9.6rem;
	}

	.line {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: flex-end;
		gap: 3px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.line button {
		position: relative;
		display: block;
		width: var(--thick, 14px);
		height: 11.5rem;
		padding: 0;
		border: 0;
		border-radius: 1px 1px 0 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.28), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.22)),
			var(--spine, #241c14);
		cursor: pointer;
		overflow: hidden;
		transform-origin: 50% 100%;
	}

	.line button.on,
	.line button:hover,
	.line button:focus-visible {
		transform: translateY(-8px) rotateX(-4deg);
		outline: none;
	}

	.spine {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 100%;
		padding: 0.45rem 0 0.3rem;
		color: #f4efe4;
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}

	.num {
		font-family: var(--ui);
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		writing-mode: horizontal-tb;
		margin-bottom: 0.35rem;
		color: var(--ink, #f4efe4);
	}

	.num.han {
		font-family: var(--display-ko);
	}

	.ttl {
		font-family: var(--serif);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0;
		white-space: nowrap;
		color: var(--ink, #f4efe4);
	}

	.ttl.han {
		font-family: var(--display-ko);
		font-weight: 400;
	}

	.line.faces {
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.75rem 0.65rem;
	}

	.line.faces button {
		width: 7.8rem;
		height: 11.7rem;
		background: var(--spine, #241c14);
	}

	.face {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 18%;
	}

	@media (max-width: 860px) {
		.stage {
			min-height: 0;
		}

		.parts {
			height: 58%;
			padding: 0.1rem 0.45rem 0.1rem 0.85rem;
		}

		.pk {
			font-size: 0.58rem;
			letter-spacing: 0.1em;
		}

		.pt {
			font-size: 0.7rem;
			max-width: 5.4rem;
		}

		.fallback {
			padding: 0.7rem 0.55rem 1rem;
			gap: 1.1rem;
			overflow-x: hidden;
		}

		.row {
			gap: 0.4rem;
			max-width: none;
		}

		.row-part {
			flex-basis: 4.4rem;
		}

		.line.faces button {
			width: 5.8rem;
			height: 8.7rem;
		}

		.line {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: none;
		}

		.line::-webkit-scrollbar {
			display: none;
		}

		.line button {
			flex: 0 0 auto;
			width: 12px;
			height: 7.2rem;
		}
	}

	@media (max-width: 720px) {
		.parts {
			height: 56%;
			padding: 0.1rem 0.3rem 0.1rem max(0.7rem, env(safe-area-inset-left, 0px));
		}

		.row-part {
			flex-basis: 5.6rem;
		}
	}
</style>
