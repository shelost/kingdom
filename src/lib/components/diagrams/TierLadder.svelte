<script module lang="ts">
	import { KING } from './BoneRank.svelte';

	/** A rung: its name, and what it means (the flat figure's note). `crown` marks the King's rung. */
	export type Tier = { ko: string; han?: string; en: string; note: string; crown?: boolean };
	/** Someone on a rung: a people id (their face), or a plain name with no portrait. */
	export type Stander = string | { ko: string; en: string };
	export type LadderStep = {
		/** `who[i]` stand on rung i (top rung first). */
		who: Stander[][];
		lit?: number;
		/** Which Bone Rank layer opens up here, when not the ladder's own (index into LAYERS: 0 Sacred, 1 True). */
		bone?: number;
		/** People standing here a bone below the rest (the purple ring). */
		trueBone?: string[];
	};
	export type Ladder = { label: string; bone: number; tiers: Tier[]; steps: Record<string, LadderStep> };

	/** Diagram id → ladder: one layer of the Bone Rank pyramid, opened up. Top rung first. */
	export const LADDERS: Record<string, Ladder> = {
		'true-bone-tiers': {
			label: 'Inside the True Bone',
			bone: 1,
			tiers: [
				{ ko: '반성골', han: '半聖骨', en: 'Half-Sacred', note: 'Sacred Bone on one side of the blood. Nobody says which side.' },
				{ ko: '육부 직계', han: '六部直系', en: 'Primary lines', note: 'The six founding elders’ heirs: eldest son of eldest son.' },
				{ ko: '육부 방계', han: '六部傍系', en: 'Secondary lines', note: 'The same six houses, down a younger son’s road.' },
				{ ko: '육부 원방계', han: '六部遠傍系', en: 'Tertiary lines', note: 'A branch further off again.' },
				{ ko: '귀부', han: '歸附', en: 'Assimilants', note: 'Conquered royalty taken in: the Gaya Kims.' }
			],
			steps: {
				full: { who: [['bidam', 'chunchu'], [], ['alchun'], [], ['yushin', 'munhee']] }
			}
		},
		'royal-lines': {
			label: 'Inside the royal house',
			bone: 0,
			tiers: [
				{ ...KING, note: 'Whoever wears the crown this year.', crown: true },
				{ ko: '직계', han: '直系', en: 'Primary line', note: 'The king’s direct line: his queen and children.' },
				{ ko: '방계', han: '傍系', en: 'Secondary lines', note: 'One branch off the trunk: brothers, uncles, first cousins.' },
				{ ko: '원방계', han: '遠傍系', en: 'Tertiary lines', note: 'Two branches off: second cousins and their houses.' }
			],
			steps: {
				jinpyung: {
					who: [['jinpyung'], ['chunmyung', 'sunduk'], [{ ko: '백반', en: 'Baekban' }, { ko: '국반', en: 'Gukban' }, 'jinduk', 'yongsu', 'bidam'], []],
					lit: 2,
					trueBone: ['yongsu', 'bidam']
				},
				muyeol: { bone: 1, who: [['chunchu'], ['munhee', 'munmu', 'inmun'], [], []], lit: 1 }
			}
		}
	};

	export const SACRED_RING = '#e2b54f';
	export const TRUE_RING = '#8b5cf6';
</script>

<script lang="ts">
	/**
	 * One layer of the Bone Rank pyramid, opened into its own rungs (one component, several
	 * diagrams). In 3D the whole pyramid rises, then the camera closes on that layer and it
	 * splits into rungs with faces on their treads (TierScene). Flat: the rungs as a stacked
	 * ladder under a Bone Rank crumb, the `lit` rung gold, the King's rung crowned.
	 */
	import type { DiagramProps } from './registry';
	import { byId, avatarOf, nameOf } from '$lib/people';
	import { LAYERS } from './BoneRank.svelte';
	import KitStage from './three/KitStage.svelte';

	let { step, active = false, flat = false, diagram = 'royal-lines', year = null }: DiagramProps = $props();

	let def = $derived(LADDERS[diagram] ?? LADDERS['royal-lines']);
	let at = $derived(def.steps[step ?? ''] ?? Object.values(def.steps)[0]);
	let layer = $derived(LAYERS[at.bone ?? def.bone]);
	const ringOf = (id: string) => (at.trueBone?.includes(id) ? TRUE_RING : SACRED_RING);
</script>

<KitStage id={diagram} {step} {active} {flat} sceneProps={{ diagram, year }}>
	{#snippet fallback()}
		<figure class="ladder" class:play={active} aria-label={def.label} style:--layer={layer.c}>
			<p class="crumb">
				<span>골품 · Bone Rank</span>
				<span class="sep" aria-hidden="true">›</span>
				<span class="here">{layer.ko} · {layer.en}</span>
			</p>
			{#each def.tiers as tier, i (tier.en)}
				<div
					class="rung"
					class:lit={at.lit === i}
					class:crown={tier.crown}
					style:--i={i}
					style:--w={`${58 + (i * 42) / Math.max(1, def.tiers.length - 1)}%`}
				>
					<span class="rank" aria-hidden={tier.crown}>{tier.crown ? tier.han : i + 1}</span>
					<span class="names">
						<span class="ko" lang="ko">{tier.ko}{#if tier.han && !tier.crown}<span class="han" lang="zh-Hant">{tier.han}</span>{/if}</span>
						<span class="en">{tier.en}</span>
						<span class="note">{tier.note}</span>
					</span>
					<span class="faces">
						{#each at.who[i] ?? [] as s (typeof s === 'string' ? s : s.en)}
							{#if typeof s === 'string'}
								{@const p = byId.get(s)}
								{#if p}
									<span class="face" class:big={tier.crown} style:--ring={ringOf(s)} title={nameOf(p, year)}>
										<img src={avatarOf(p, undefined, year)} alt={nameOf(p, year)} loading="lazy" decoding="async" />
									</span>
								{/if}
							{:else}
								<span class="chip" title={s.en}><span lang="ko">{s.ko}</span></span>
							{/if}
						{/each}
					</span>
				</div>
			{/each}
		</figure>
	{/snippet}
</KitStage>

<style>
	.ladder {
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		margin: 0;
		font-size: 0.85rem;
	}

	.crumb {
		display: flex;
		gap: 0.4rem;
		margin: 0 0 0.3rem;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.crumb .here {
		color: color-mix(in srgb, var(--layer) 70%, var(--fg));
		font-weight: 700;
	}

	.rung {
		display: grid;
		grid-template-columns: 1.6rem 1fr auto;
		align-items: center;
		gap: 0.7rem;
		width: var(--w);
		min-width: min(100%, 18rem);
		padding: 0.5rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--layer) 35%, transparent);
		border-radius: 0.6rem;
		background: color-mix(in srgb, var(--layer) calc(16% - var(--i) * 2.5%), transparent);
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 500ms var(--ease) calc((4 - var(--i)) * 120ms),
			transform 600ms var(--ease) calc((4 - var(--i)) * 120ms);
	}

	.play .rung {
		opacity: 1;
		transform: none;
	}

	.rung.lit {
		border-color: color-mix(in srgb, #e2b54f 70%, transparent);
		background: color-mix(in srgb, #e2b54f 12%, transparent);
	}

	.rank {
		font-size: 1.1rem;
		font-weight: 700;
		text-align: center;
		color: var(--fg-faint);
	}

	.lit .rank {
		color: #e2b54f;
	}

	.crown .rank {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.4rem;
		font-weight: 900;
		color: var(--gold, #e2b54f);
	}

	.names {
		display: grid;
		gap: 0.05rem;
		min-width: 0;
	}

	.ko {
		font-weight: 600;
		color: var(--fg-strong);
	}

	.han {
		margin-left: 0.4rem;
		font-weight: 400;
		font-size: 0.85em;
		color: var(--fg-faint);
	}

	.en {
		font-size: 0.8rem;
		color: var(--fg-dim);
	}

	.note {
		font-size: 0.75rem;
		color: var(--fg-faint);
	}

	.faces {
		display: flex;
		align-items: center;
	}

	.face {
		width: 2rem;
		height: 2rem;
		margin-left: -0.35rem;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--ring, var(--bg-raised, #28282e));
		background: var(--bg-raised, #28282e);
	}

	.face.big {
		width: 2.4rem;
		height: 2.4rem;
		margin-left: 0;
	}

	.face img {
		width: 100%;
		height: 130%;
		object-fit: cover;
		object-position: top center;
	}

	.chip {
		margin-left: 0.2rem;
		padding: 0.1rem 0.4rem;
		border: 1px dashed color-mix(in srgb, var(--fg) 30%, transparent);
		border-radius: 999px;
		font-size: 0.72rem;
		color: var(--fg-dim);
	}

	@media (prefers-reduced-motion: reduce) {
		.rung {
			transition: none;
		}
	}
</style>
