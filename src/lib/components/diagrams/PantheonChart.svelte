<script lang="ts">
	/**
	 * Pantheon org-chart: Hwanin (Creator) above the Three Realms.
	 * Steps:
	 *   - 'realms' — Creator + three realm heads only
	 *   - 'courts' — full tree under each head (default)
	 * Optional `realm` prop filters to one column (centered at x=200).
	 * `heaven` focuses Hwanin’s mandate line (Hwanung → Dangun).
	 * `tamla` focuses Tamla Class III shrine gods under Little Star’s living world.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let {
		step = 'courts',
		active = false,
		realm
	}: DiagramProps = $props();

	const CENTER = 200;

	type RealmId = 'heaven' | 'underworld' | 'living' | 'flower' | 'tamla';

	function normalizeRealm(raw: string | undefined): RealmId | null {
		if (!raw) return null;
		const key = raw.toLowerCase();
		if (key === 'heaven' || key === 'hwanin') return 'heaven';
		if (key === 'underworld' || key === 'dead' || key === 'daebyeol') return 'underworld';
		if (key === 'living' || key === 'sobyeol') return 'living';
		if (key === 'flower' || key === 'west' || key === 'field' || key === 'sara') return 'flower';
		if (key === 'tamla' || key === 'halla' || key === 'sulmun') return 'tamla';
		return null;
	}

	/** Three Realms principals — Hwanin sits above, not as a peer column. */
	const COLS = [
		{
			id: 'daebyeol' as const,
			realm: 'underworld' as const,
			x: 80,
			realmKo: '저승',
			realmEn: 'Dead',
			ko: '대별왕',
			en: 'Big Star'
		},
		{
			id: 'sobyeol' as const,
			realm: 'living' as const,
			x: 200,
			realmKo: '이승',
			realmEn: 'Living',
			ko: '소별왕',
			en: 'Little Star'
		},
		{
			id: 'sara' as const,
			realm: 'flower' as const,
			x: 320,
			realmKo: '서천꽃밭',
			realmEn: 'West Field',
			ko: '할락궁이',
			en: 'Hallakgungi'
		}
	];

	const CREATOR_Y = 28;
	const HEAD_Y = 88;
	const MID_Y = 168;
	const LOW_Y = 248;

	const livingBase = [
		{ ko: '이비가', en: 'Ibiga', tag: '하늘', tagEn: 'sky', x: 148 },
		{ ko: '해모수', en: 'Haemosu', tag: '태양', tagEn: 'sun', x: 200 },
		{ ko: '삼신녀', en: 'Samsin', tag: '생명', tagEn: 'life', x: 252 }
	] as const;

	const tamlaIII = [
		{ ko: '설문', en: 'Sulmun', x: 80 },
		{ ko: '자청비', en: 'Jacheongbi', x: 160 },
		{ ko: '가믄장', en: 'Gameunjang', x: 240 },
		{ ko: '산방덕', en: 'Sanbangdeok', x: 320 }
	] as const;

	const focus = $derived(normalizeRealm(realm));

	const visibleCols = $derived(
		focus === 'heaven' || focus === 'tamla'
			? []
			: focus
				? COLS.filter((c) => c.realm === focus).map((c) => ({ ...c, x: CENTER }))
				: COLS
	);

	const full = $derived(focus ? true : step !== 'realms');

	const ox = $derived(
		focus && focus !== 'heaven' && focus !== 'tamla'
			? CENTER - (COLS.find((c) => c.realm === focus)?.x ?? CENTER)
			: 0
	);

	const living = $derived(
		livingBase.map((L) => ({
			...L,
			x: L.x + ox
		}))
	);

	const foot = $derived(
		focus === 'heaven'
			? '하늘나라 · Heaven · Creator'
			: focus === 'tamla'
				? '탐라 · Tamla · Class III'
				: focus
					? (() => {
							const c = COLS.find((col) => col.realm === focus)!;
							return `${c.realmKo} · ${c.realmEn}`;
						})()
					: '삼계 · Three Realms under Hwanin'
	);

	const hx = (base: number) => base + ox;
	const showCreator = $derived(!focus || focus === 'heaven');
	const showRealms = $derived(!focus || (focus !== 'heaven' && focus !== 'tamla'));
	const showTamla = $derived(focus === 'tamla');
	const aria = $derived(
		showTamla
			? 'Org chart of Tamla Class III gods under Little Star: Sulmun, Jacheongbi, Gameunjang, and Sanbangdeok.'
			: 'Org chart of the Three Realms under Hwanin the Creator: Big Star, Little Star, and Hallakgungi, with their courts below.'
	);
</script>

<svg
	viewBox="0 0 400 320"
	class="dg"
	class:play={active}
	data-step={step}
	data-realm={focus ?? 'all'}
	role="img"
	aria-label={aria}
>
	{#if showCreator}
		<!-- Creator above the Three Realms -->
		<g class="node head creator" style="--d: 40">
			<rect class="plate" x={CENTER - 62} y={CREATOR_Y - 22} width="124" height="56" rx="6" />
			<ChartLabel x={CENTER} y={CREATOR_Y + 6} ko="환인" en="Creator" w={110} size="lg" />
		</g>

		{#if showRealms}
			<path
				class="link"
				style="--d: 160"
				d="M {CENTER} 58 V 68"
				pathLength="100"
			/>
			<path
				class="link"
				style="--d: 200"
				d="M {hx(80)} 68 H {hx(320)}"
				pathLength="100"
			/>
			{#each visibleCols as c, i (c.id)}
				<path
					class="link"
					style="--d: {240 + i * 30}"
					d="M {c.x} 68 V 74"
					pathLength="100"
				/>
			{/each}
		{/if}

		{#if full && focus === 'heaven'}
			<path class="link" style="--d: 520" d="M {CENTER} 58 V 128" pathLength="100" />
			<path class="link" style="--d: 720" d="M {CENTER} 168 V 228" pathLength="100" />
			<g class="node child" style="--d: 600">
				<rect class="plate" x={CENTER - 38} y={MID_Y - 18} width="76" height="38" rx="5" />
				<ChartLabel x={CENTER} y={MID_Y} ko="환웅" en="Hwanung" w={70} />
			</g>
			<g class="node child" style="--d: 800">
				<rect class="plate" x={CENTER - 38} y={LOW_Y - 18} width="76" height="38" rx="5" />
				<ChartLabel x={CENTER} y={LOW_Y} ko="단군" en="Dangun" w={70} />
			</g>
		{/if}
	{/if}

	{#if showRealms}
		{#each visibleCols as c, i (c.id)}
			<g class="node head {c.realm}" style="--d: {280 + i * 60}">
				<rect class="plate" x={c.x - 50} y={HEAD_Y - 26} width="100" height="58" rx="6" />
				<ChartLabel x={c.x} y={HEAD_Y + 4} ko={c.ko} en={c.en} w={92} size="lg" />
			</g>
		{/each}

		{#if full}
			{#if !focus || focus === 'underworld'}
				<!-- Big Star → Yumla → Kangrim + Haewonmek -->
				<path class="link" style="--d: 560" d="M {hx(80)} 116 V 148" pathLength="100" />
				<path class="link" style="--d: 760" d="M {hx(80)} 188 V 210" pathLength="100" />
				<path class="link" style="--d: 820" d="M {hx(42)} 210 H {hx(118)}" pathLength="100" />
				<path class="link" style="--d: 860" d="M {hx(42)} 210 V 228" pathLength="100" />
				<path class="link" style="--d: 900" d="M {hx(118)} 210 V 228" pathLength="100" />
				<g class="node child underworld" style="--d: 640">
					<rect class="plate" x={hx(80) - 36} y={MID_Y - 18} width="72" height="38" rx="5" />
					<ChartLabel x={hx(80)} y={MID_Y} ko="염라" en="Yumla" w={66} />
				</g>
				<g class="node child underworld" style="--d: 940">
					<rect class="plate" x={hx(42) - 32} y={LOW_Y - 18} width="64" height="38" rx="5" />
					<ChartLabel x={hx(42)} y={LOW_Y} ko="강림" en="Kangrim" w={60} size="sm" />
				</g>
				<g class="node child underworld" style="--d: 980">
					<rect class="plate" x={hx(118) - 36} y={LOW_Y - 18} width="72" height="38" rx="5" />
					<ChartLabel x={hx(118)} y={LOW_Y} ko="해원맥" en="Haewonmek" w={68} size="sm" />
				</g>
			{/if}

			{#if !focus || focus === 'living'}
				<!-- Little Star → Ibiga / Haemosu / Samsin -->
				<path class="link" style="--d: 600" d="M {hx(200)} 116 V 130" pathLength="100" />
				<path
					class="link"
					style="--d: 680"
					d="M {living[0].x} 130 H {living[2].x}"
					pathLength="100"
				/>
				{#each living as L, i (L.en)}
					<path
						class="link"
						style="--d: {740 + i * 40}"
						d="M {L.x} 130 V 148"
						pathLength="100"
					/>
					<g class="node child tagged living" style="--d: {820 + i * 60}">
						<rect class="plate" x={L.x - 38} y={MID_Y - 18} width="76" height="38" rx="5" />
						<ChartLabel x={L.x} y={MID_Y} ko={L.ko} en={L.en} w={70} size="sm" />
					</g>
				{/each}
			{/if}

			<!-- Hallakgungi: alone among the Three Realms principals -->
		{/if}
	{/if}

	{#if showTamla}
		<g class="node head living" style="--d: 280">
			<rect class="plate" x={CENTER - 50} y={HEAD_Y - 26} width="100" height="58" rx="6" />
			<ChartLabel x={CENTER} y={HEAD_Y + 4} ko="소별왕" en="Little Star" w={92} size="lg" />
		</g>
		<path class="link" style="--d: 520" d="M {CENTER} 116 V 130" pathLength="100" />
		<path
			class="link"
			style="--d: 600"
			d="M {tamlaIII[0].x} 130 H {tamlaIII[3].x}"
			pathLength="100"
		/>
		{#each tamlaIII as T, i (T.en)}
			<path
				class="link"
				style="--d: {680 + i * 40}"
				d="M {T.x} 130 V 148"
				pathLength="100"
			/>
			<g class="node child tamla" style="--d: {760 + i * 50}">
				<rect class="plate" x={T.x - 38} y={MID_Y - 18} width="76" height="38" rx="5" />
				<ChartLabel x={T.x} y={MID_Y} ko={T.ko} en={T.en} w={70} size="sm" />
			</g>
		{/each}
	{/if}

	<text class="foot" style="--d: {full ? 1100 : 500}" x="200" y="300">{foot}</text>
</svg>

<style>
	.dg {
		--accent: #f0c86e;
		--pantheon: #f0c86e;
		--heaven: #f4f1e8;
		--living: #ff4d4d;
		--dead: #4d8eff;
		--flower: #6fdb78;
		--tamla: #ff9a2e;
		font-family: var(--serif);
	}

	.node,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .node,
	.play .foot {
		opacity: 1;
	}

	.node {
		transform: translateY(6px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 700ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node {
		transform: translateY(0);
	}

	.plate {
		fill: var(--pantheon);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.head .plate {
		stroke-width: 3.2;
	}

	.creator .plate {
		fill: var(--gold);
		stroke: var(--node-stroke);
	}

	.underworld .plate {
		fill: var(--dead);
		stroke: color-mix(in srgb, var(--dead) 28%, #080604);
	}

	.living .plate {
		fill: var(--living);
		stroke: color-mix(in srgb, var(--living) 28%, #080604);
	}

	.flower .plate {
		fill: var(--flower);
		stroke: color-mix(in srgb, var(--flower) 28%, #080604);
	}

	.tamla .plate {
		fill: var(--tamla);
		stroke: color-mix(in srgb, var(--tamla) 28%, #080604);
	}

	.link {
		fill: none;
		stroke: var(--pantheon);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 900ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .link {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 7px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--pantheon);
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .link {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
