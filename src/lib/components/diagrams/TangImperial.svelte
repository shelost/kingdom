<script module lang="ts">
	import { DEPTS, MINISTRIES } from './TangDepartments.svelte';
	import { HUE } from './three/kit.svelte';

	export const STEPS = ['mandate', 'court', 'realm', 'tribute'] as const;

	export const HEAVEN = { ko: '천명', han: '天命', en: 'Mandate of Heaven' };
	export const SON = { ko: '천자', han: '天子', en: 'Son of Heaven' };

	/** Three Departments, Six Ministries, then the Censorate watching all of them. */
	export const COURT = [
		...DEPTS.map((d) => ({ ko: d.ko, han: d.han, en: d.en, kind: 'dept' as const })),
		...MINISTRIES.map((m) => ({ ko: `${m.ko}부`, han: `${m.han}部`, en: m.en, kind: 'ministry' as const })),
		{ ko: '어사대', han: '御史臺', en: 'Censorate', kind: 'censor' as const }
	];

	export const REALM = { ko: '주현', han: '州縣', en: 'provinces · prefectures' };

	/** The ten circuits (道) the provinces were grouped into. */
	export const CIRCUITS = [
		{ ko: '관내', han: '關內' },
		{ ko: '하남', han: '河南' },
		{ ko: '하동', han: '河東' },
		{ ko: '하북', han: '河北' },
		{ ko: '산남', han: '山南' },
		{ ko: '농우', han: '隴右' },
		{ ko: '회남', han: '淮南' },
		{ ko: '강남', han: '江南' },
		{ ko: '검남', han: '劍南' },
		{ ko: '영남', han: '嶺南' }
	];

	/** Compass bearing in degrees: 0 east, 90 south (screen-down / toward the viewer). */
	export const VASSALS = [
		{ ko: '고구려', han: '高句麗', en: 'Goguryeo', deg: -40, hue: HUE.goguryeo },
		{ ko: '백제', han: '百濟', en: 'Baekje', deg: 5, hue: HUE.baekje },
		{ ko: '신라', han: '新羅', en: 'Silla', deg: 45, hue: HUE.silla },
		{ ko: '왜', han: '倭', en: 'Yamato', deg: 95, hue: undefined },
		{ ko: '토번', han: '吐蕃', en: 'Tibet', deg: 180, hue: undefined },
		{ ko: '돌궐', han: '突厥', en: 'Turks', deg: -115, hue: undefined }
	];
</script>

<script lang="ts">
	/**
	 * The Tang world as the Tang drew it: Heaven's mandate onto one man, his
	 * court round him, the provinces round the court, and the kings of the
	 * edge facing in with tribute.
	 * Steps (cumulative; the current layer is the focus):
	 *   - 'mandate' — Heaven above, the Son of Heaven on his dais
	 *   - 'court'   — Three Departments, Six Ministries, the Censorate
	 *   - 'realm'   — the provinces and prefectures in ten circuits
	 *   - 'tribute' — Silla, Baekje, Goguryeo, the Turks… bowing inward (default)
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';
	import { stepIndex } from './three/kit.svelte';

	let { step = 'tribute', active = false, flat = false }: DiagramProps = $props();

	const level = $derived(stepIndex(STEPS, step));
	const C = 180;
	const CY = 196;
	const polar = (r: number, deg: number) => {
		const a = (deg * Math.PI) / 180;
		return { x: C + r * Math.cos(a), y: CY + r * Math.sin(a) };
	};
	const court = COURT.map((c, i) => ({ ...c, ...polar(52, -126 + i * 36) }));
	const circuits = CIRCUITS.map((c, i) => ({ ...c, ...polar(90, -90 + i * 36) }));
	const vassals = VASSALS.map((v) => ({ ...v, ...polar(134, v.deg) }));
</script>

<KitStage id="tang-imperial" {step} {active} {flat}>
	{#snippet fallback()}
		<svg
			viewBox="0 0 360 352"
			class="dg"
			class:play={active}
			role="img"
			aria-label="The Tang imperial order: the Mandate of Heaven on the Son of Heaven, his court of Three Departments, Six Ministries and the Censorate, the provinces in ten circuits, and the tributary kings of Silla, Baekje, Goguryeo, Yamato, Tibet and the Turks facing inward"
		>
			<g class="k-node" class:k-dim={level > 0} style="--d: 0">
				<path class="k-link" style="--d: 120" d="M {C} 34 V {CY - 24}" pathLength="100" />
				<ChartLabel x={C} y="22" ko={HEAVEN.ko} han={HEAVEN.han} en={HEAVEN.en} w={80} size="sm" />
			</g>
			<g class="k-node" style="--d: 200">
				<circle class="k-fill" cx={C} cy={CY} r="22" />
				<ChartLabel x={C} y={CY} ko={SON.ko} han={SON.han} en={SON.en} w={60} size="sm" />
			</g>

			{#if level >= 1}
				{#each court as c, i (c.han)}
					<g class="k-node" class:k-dim={level > 1} style="--d: {400 + i * 60}">
						<circle class="k-fill" cx={c.x} cy={c.y} r={c.kind === 'dept' ? 9 : 6} />
						{#if c.kind !== 'ministry'}
							<ChartLabel x={c.x} y={c.y - 16} ko={c.ko} han={c.han} w={34} size="sm" />
						{/if}
					</g>
				{/each}
			{/if}

			{#if level >= 2}
				<circle class="k-link" style="--d: 900" cx={C} cy={CY} r="90" pathLength="100" />
				{#each circuits as c, i (c.han)}
					<g class="k-node" class:k-dim={level > 2} style="--d: {1000 + i * 40}">
						<rect class="k-fill" x={c.x - 9} y={c.y - 5} width="18" height="10" rx="2" />
					</g>
				{/each}
				<g class="k-node" class:k-dim={level > 2} style="--d: 1400">
					<ChartLabel x={C} y={CY + 116} ko={REALM.ko} han={REALM.han} en={REALM.en} w={92} size="sm" />
				</g>
			{/if}

			{#if level >= 3}
				{#each vassals as v, i (v.han)}
					{@const inner = polar(104, v.deg)}
					<g class="k-node" style="--d: {1500 + i * 90}; --fill: {v.hue ?? 'var(--fg-dim)'}">
						<path
							class="k-link"
							style="--d: {1550 + i * 90}"
							d="M {v.x} {v.y} L {inner.x} {inner.y}"
							pathLength="100"
						/>
						<ChartLabel x={v.x} y={v.y} ko={v.ko} han={v.han} en={v.en} w={50} size="sm" />
					</g>
				{/each}
			{/if}

			<text class="k-foot" style="--d: 1900" x={C} y="346">천하 · all under Heaven, facing one throne</text>
		</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--accent: #f0a03c;
		font-family: var(--serif);
	}
</style>
