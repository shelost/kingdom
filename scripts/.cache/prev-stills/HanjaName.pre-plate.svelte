<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { onceInView, prefersReducedMotion } from '$lib/inView';

	type Hanja = Extract<Block, { kind: 'hanja' }>;

	let { block }: { block: Hanja } = $props();

	/** `ghost` before the brush arrives; `writer` once stroke data loads; `ink` when it can't. */
	let mode = $state<'ghost' | 'writer' | 'ink'>('ghost');
	let written = $state<boolean[]>([]);
	let boxes: HTMLElement[] = $state([]);

	let note = $derived(
		reading.lang === 'ko' ? (block.noteKo ?? block.note) : block.note
	);
	let noteSub = $derived(reading.lang === 'both' ? block.noteKo : undefined);

	const STROKE_SPEED = 2.4;
	const STROKE_GAP = 45;
	const CHAR_GAP = 200;

	function withAlpha(rgb: string, a: number): string {
		const n = rgb.match(/[\d.]+/g);
		return n && n.length >= 3 ? `rgba(${n[0]}, ${n[1]}, ${n[2]}, ${a})` : rgb;
	}

	const write = onceInView((root) => {
		let cancelled = false;
		const reduced = prefersReducedMotion();
		const ink = getComputedStyle(root).color;

		(async () => {
			try {
				const { default: HanziWriter } = await import('hanzi-writer');
				const writers = await Promise.all(
					boxes.map(
						(box, i) =>
							new Promise<InstanceType<typeof HanziWriter>>((ok, fail) => {
								const size = box.clientWidth;
								const w = HanziWriter.create(box, block.chars[i].char, {
									width: size,
									height: size,
									padding: size * 0.08,
									showCharacter: reduced,
									showOutline: !reduced,
									strokeColor: ink,
									radicalColor: null,
									outlineColor: withAlpha(ink, 0.12),
									strokeAnimationSpeed: STROKE_SPEED,
									delayBetweenStrokes: STROKE_GAP,
									onLoadCharDataSuccess: () => ok(w),
									onLoadCharDataError: (e) => fail(e)
								});
							})
					)
				);
				if (cancelled) return;
				mode = 'writer';
				if (reduced) {
					written = block.chars.map(() => true);
					return;
				}
				for (let i = 0; i < writers.length; i++) {
					await writers[i].animateCharacter();
					if (cancelled) return;
					written[i] = true;
					await new Promise((r) => setTimeout(r, CHAR_GAP));
				}
			} catch {
				if (cancelled) return;
				for (const box of boxes) box.querySelector('svg')?.remove();
				mode = 'ink';
				written = block.chars.map(() => true);
			}
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<figure class="hanja-name" class:writer={mode === 'writer'} class:ink={mode === 'ink'} {@attach write}>
	<div class="chars">
		{#each block.chars as c, i (i)}
			<div class="cell" class:done={written[i]} style:--i={i}>
				<div class="square">
					<svg class="grid" viewBox="0 0 100 100" aria-hidden="true">
						<rect x="0.5" y="0.5" width="99" height="99" />
						<line x1="50" y1="0" x2="50" y2="100" />
						<line x1="0" y1="50" x2="100" y2="50" />
						<line x1="0" y1="0" x2="100" y2="100" />
						<line x1="100" y1="0" x2="0" y2="100" />
					</svg>
					<span class="glyph" lang="zh-Hant">{c.char}</span>
					<div class="brush" bind:this={boxes[i]} aria-hidden="true"></div>
				</div>
				<span class="gloss" lang="ko">{c.gloss}</span>
				{#if c.meaning && reading.lang !== 'ko'}<span class="meaning">{c.meaning}</span>{/if}
			</div>
		{/each}
	</div>
	{#if block.name || note}
		<figcaption>
			{#if block.name}
				<span class="name">{block.name}</span>
				{#if block.ko}<span class="name-ko" lang="ko">{block.ko}</span>{/if}
			{/if}
			{#if note}<span class="note">{note}</span>{/if}
			{#if noteSub && noteSub !== note}<span class="note sub" lang="ko">{noteSub}</span>{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.hanja-name {
		margin: 1.8rem 0 1.2rem;
		color: var(--gold);
	}

	.chars {
		display: flex;
		flex-wrap: wrap;
		gap: 1.1rem 1.4rem;
	}

	.cell {
		display: grid;
		justify-items: center;
		gap: 0.3rem;
		width: clamp(5.5rem, 17vw, 7.25rem);
	}

	.square {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
	}

	/* The 米字格 practice square a calligrapher writes into. */
	.grid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: none;
		stroke: color-mix(in srgb, var(--gold) 28%, transparent);
		stroke-width: 0.6;
		vector-effect: non-scaling-stroke;
	}

	.grid line {
		stroke-dasharray: 2 3;
	}

	.glyph {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-family: 'Noto Serif KR', serif;
		font-size: clamp(3.6rem, 11vw, 4.8rem);
		font-weight: 900;
		line-height: 1;
		color: color-mix(in srgb, var(--gold) 14%, transparent);
	}

	.brush {
		position: absolute;
		inset: 0;
	}

	.brush :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* The brush draws its own outline; the typeset ghost steps aside. */
	.writer .glyph {
		opacity: 0;
	}

	/* No stroke data: the glyph is inked in with a top-down wipe instead. */
	.ink .glyph {
		color: var(--gold);
		animation: ink-in 900ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
		animation-delay: calc(var(--i) * 320ms);
	}

	@keyframes ink-in {
		from {
			clip-path: inset(0 0 100% 0);
			filter: blur(3px);
		}
		to {
			clip-path: inset(0 0 0 0);
			filter: blur(0);
		}
	}

	.gloss,
	.meaning {
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 520ms var(--ease),
			transform 520ms var(--ease);
	}

	.done .gloss,
	.done .meaning {
		opacity: 1;
		transform: none;
	}

	.done .meaning {
		transition-delay: 90ms;
	}

	.gloss {
		margin-top: 0.25rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.meaning {
		font-size: 0.78rem;
		font-style: italic;
		text-align: center;
		color: var(--fg-dim);
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		margin-top: 1rem;
		padding-top: 0.7rem;
		border-top: 1px solid color-mix(in srgb, var(--gold) 22%, transparent);
	}

	.name {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.name-ko {
		font-size: 0.85rem;
		color: var(--gold);
	}

	.note {
		flex-basis: 100%;
		font-size: 0.92rem;
		color: var(--fg-dim);
	}

	.note.sub {
		font-size: 0.82rem;
		color: var(--fg-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.ink .glyph {
			animation: none;
		}

		.gloss,
		.meaning {
			transition: none;
		}
	}
</style>
