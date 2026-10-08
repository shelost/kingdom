<script module lang="ts">
	export const STEPS = ['fubing', 'guards', 'expedition', 'protectorate'] as const;

	export const CAPITAL = { ko: '장안', han: '長安', en: "Chang'an" };
	export const FUBING = { ko: '절충부', han: '折衝府', en: 'militia garrisons' };
	export const FUBING_NOTE = { ko: '농사철엔 농부, 번이 돌면 근위', en: 'farmers by season, guards by turn' };
	export const GUARDS = { ko: '십육위', han: '十六衛', en: 'Sixteen Guards' };
	/** Compass bearing in degrees: 0 east, -90 north (away from the viewer). */
	export const EXPEDITION = { ko: '행군대총관', han: '行軍大總管', en: 'expedition marshal', deg: -28 };
	export const EXPEDITION_NOTE = { ko: '전쟁이 끝나면 해산', en: 'raised for one war, then sent home' };
	export const PROTECTORATES = [
		{ ko: '안동', han: '安東', en: 'Pacify the East', deg: -10 },
		{ ko: '안북', han: '安北', en: 'Pacify the North', deg: -90 },
		{ ko: '안서', han: '安西', en: 'Pacify the West', deg: 180 },
		{ ko: '안남', han: '安南', en: 'Pacify the South', deg: 90 }
	];
	export const PROTECTORATE = { ko: '도호부', han: '都護府', en: 'protectorates' };

	/**
	 * Garrison sites as fractions of the realm radius: a sunflower spiral,
	 * thick round the capital the way the real ones were. Every fifth is shown
	 * marching its turn to the capital.
	 */
	export const GARRISONS = Array.from({ length: 36 }, (_, i) => {
		const r = 0.36 + 0.6 * Math.sqrt((i + 0.5) / 36);
		const a = i * 2.39996;
		return { i, x: r * Math.cos(a), z: r * Math.sin(a), turn: i % 5 === 2 };
	});
</script>

<script lang="ts">
	/**
	 * How the Tang kept an army without paying one.
	 * Steps (cumulative; the current layer is the focus):
	 *   - 'fubing'       — farmer-soldier garrisons taking turns at the capital
	 *   - 'guards'       — the Sixteen Guards they fill round the palace
	 *   - 'expedition'   — a marshal raised for one war, drawing on both
	 *   - 'protectorate' — the four protectorates holding the conquered rim (default)
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';
	import { stepIndex } from './three/kit.svelte';

	let { step = 'protectorate', active = false, flat = false }: DiagramProps = $props();

	const level = $derived(stepIndex(STEPS, step));
	const C = 180;
	const CY = 172;
	const R = 112;
	const polar = (r: number, deg: number) => {
		const a = (deg * Math.PI) / 180;
		return { x: C + r * Math.cos(a), y: CY + r * Math.sin(a) };
	};
	const exp = polar(R * 0.62, EXPEDITION.deg);
	const rims = PROTECTORATES.map((p) => ({ ...p, ...polar(R + 26, p.deg) }));
</script>

<KitStage id="tang-military" {step} {active} {flat}>
	{#snippet fallback()}
		<svg
			viewBox="0 0 360 340"
			class="dg"
			class:play={active}
			role="img"
			aria-label="The Tang army: farmer-soldier garrisons rotating to the capital, the Sixteen Guards round the palace, an expedition marshal raised for one war, and four protectorates at the rim"
		>
			<circle class="k-link" style="--d: 0; --stroke: var(--fg-faint)" cx={C} cy={CY} r={R} pathLength="100" />

			{#each GARRISONS as g (g.i)}
				<g class="k-node" class:k-dim={level > 0} style="--d: {100 + g.i * 18}">
					<rect class="k-fill" x={C + g.x * R - 3} y={CY + g.z * R - 3} width="6" height="6" rx="1" />
					{#if g.turn && level === 0}
						<path
							class="k-link"
							style="--d: {900 + g.i * 20}"
							d="M {C + g.x * R} {CY + g.z * R} L {C + g.x * 26} {CY + g.z * 26}"
							pathLength="100"
						/>
					{/if}
				</g>
			{/each}

			<g class="k-node" style="--d: 300">
				<rect class="k-fill" x={C - 14} y={CY - 9} width="28" height="18" rx="3" />
			</g>

			{#if level >= 1}
				{#each Array.from({ length: 16 }, (_, i) => polar(22, i * 22.5)) as p, i (i)}
					<circle class="k-node k-fill" class:k-dim={level > 1} style="--d: {600 + i * 30}" cx={p.x} cy={p.y} r="2.6" />
				{/each}
			{/if}

			{#if level >= 2}
				<g class="k-node" class:k-dim={level > 2} style="--d: 1100">
					<path class="k-link" style="--d: 1150" d="M {C} {CY} L {exp.x} {exp.y}" pathLength="100" />
					<circle class="k-fill" cx={exp.x} cy={exp.y} r="8" />
					<ChartLabel x={exp.x} y={exp.y + 18} ko={EXPEDITION.ko} han={EXPEDITION.han} w={54} size="sm" />
				</g>
			{/if}

			{#if level >= 3}
				{#each rims as p, i (p.han)}
					<g class="k-node" style="--d: {1400 + i * 100}">
						<ChartLabel x={p.x} y={p.y} ko={p.ko} han={p.han} en={p.en} w={58} size="sm" />
					</g>
				{/each}
			{/if}

			<g class="k-node" style="--d: 400">
				<ChartLabel
					x={C}
					y={CY - 26}
					ko={[FUBING, GUARDS, EXPEDITION, PROTECTORATE][level].ko}
					han={[FUBING, GUARDS, EXPEDITION, PROTECTORATE][level].han}
					en={[FUBING, GUARDS, EXPEDITION, PROTECTORATE][level].en}
					w={70}
					size="sm"
				/>
			</g>
			<text class="k-foot" style="--d: 1800" x={C} y="334">{CAPITAL.ko} {CAPITAL.han} · {FUBING_NOTE.en}</text>
		</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--accent: #f0a03c;
		font-family: var(--serif);
	}
</style>
