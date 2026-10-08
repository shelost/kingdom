<script module lang="ts">
	export const STEPS = ['clans', 'exam', 'ranks'] as const;

	export const CLANS = [
		{ ko: '최', han: '崔' },
		{ ko: '노', han: '盧' },
		{ ko: '이', han: '李' },
		{ ko: '정', han: '鄭' },
		{ ko: '왕', han: '王' }
	];
	export const CLAN = { ko: '오성', han: '五姓', en: 'the great clans' };
	/** The shadow privilege: a son starts where his father's rank puts him. */
	export const SHADOW = { ko: '문음', han: '門蔭', en: "by father's rank", rank: 7 };
	export const EXAM = { ko: '과거', han: '科舉', en: 'the examinations' };
	export const GATES = [
		{ ko: '명경', han: '明經', en: 'Classics' },
		{ ko: '진사', han: '進士', en: 'Letters' }
	];
	export const GATE_RANK = 9;
	export const RANKS = Array.from({ length: 9 }, (_, i) => ({
		k: i + 1,
		ko: `${i + 1}품`,
		han: `${'一二三四五六七八九'[i]}品`
	}));
	export const NINE = { ko: '구품', han: '九品', en: 'nine ranks' };
</script>

<script lang="ts">
	/**
	 * Two ways onto the Tang ladder. The great clans step on halfway up by
	 * their fathers' rank; everyone else sits the examinations and starts on
	 * the bottom stair.
	 * Steps (cumulative; the current layer is the focus):
	 *   - 'clans' — the five great surnames and their shortcut
	 *   - 'exam'  — the Classics and Letters gates onto the ninth rank
	 *   - 'ranks' — the whole nine-rank stair (default)
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';
	import { stepIndex } from './three/kit.svelte';

	let { step = 'ranks', active = false, flat = false }: DiagramProps = $props();

	const level = $derived(stepIndex(STEPS, step));
	const BASE = 262;
	const stair = RANKS.map((r) => ({ ...r, x: 138 + (9 - r.k) * 22, top: BASE - (10 - r.k) * 19 }));
	const at = (k: number) => stair[k - 1];
</script>

<KitStage id="tang-exam" {step} {active} {flat}>
	{#snippet fallback()}
		<svg
			viewBox="0 0 360 300"
			class="dg"
			class:play={active}
			role="img"
			aria-label="Tang ways into office: the five great clans enter at the seventh rank by their fathers' rank; examination graduates in the Classics and in Letters start at the ninth; nine ranks above"
		>
			{#each stair as s (s.k)}
				<g class="k-node" class:k-dim={level < 2} style="--d: {100 + (9 - s.k) * 60}">
					<rect class="k-fill" x={s.x} y={s.top} width="21" height={BASE - s.top} rx="2" />
					<text class="rank" x={s.x + 10.5} y={s.top - 4}>{s.han}</text>
				</g>
			{/each}

			<g class="k-node" class:k-dim={level > 0} style="--d: 700">
				{#each CLANS as c, i (c.han)}
					<circle class="k-fill" cx={34 + i * 18} cy="92" r="8" />
					<text class="clan" x={34 + i * 18} y="95">{c.han}</text>
				{/each}
				<ChartLabel x="70" y="70" ko={CLAN.ko} han={CLAN.han} en={CLAN.en} w={70} size="sm" />
				<path
					class="k-link"
					style="--d: 900"
					d="M 108 92 C 140 92 {at(SHADOW.rank).x - 10} {at(SHADOW.rank).top - 30} {at(SHADOW.rank).x + 10} {at(SHADOW.rank).top - 2}"
					pathLength="100"
				/>
				<ChartLabel x="150" y="118" ko={SHADOW.ko} han={SHADOW.han} w={40} size="sm" />
			</g>

			{#if level >= 1}
				{#each GATES as g, i (g.han)}
					{@const y = 206 + i * 34}
					<g class="k-node" class:k-dim={level > 1} style="--d: {1100 + i * 140}">
						<rect class="k-fill" x="56" y={y - 12} width="42" height="24" rx="3" />
						<ChartLabel x="77" y={y} ko={g.ko} han={g.han} w={38} size="sm" />
						<path
							class="k-link"
							style="--d: {1200 + i * 140}"
							d="M 98 {y} C 120 {y} 124 {at(GATE_RANK).top - 4} {at(GATE_RANK).x + 6} {at(GATE_RANK).top - 2}"
							pathLength="100"
						/>
					</g>
				{/each}
				<g class="k-node" style="--d: 1050">
					<ChartLabel x="77" y="176" ko={EXAM.ko} han={EXAM.han} en={EXAM.en} w={72} size="sm" />
				</g>
			{/if}

			<text class="k-foot" style="--d: 1600" x="180" y="290">{NINE.ko} {NINE.han} · born halfway up, or sit the exam</text>
		</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--accent: #f0a03c;
		font-family: var(--serif);
	}

	.rank,
	.clan {
		text-anchor: middle;
		fill: var(--ink);
		font-size: 7px;
		font-weight: 700;
	}

	.clan {
		fill: #0c0c10;
	}
</style>
