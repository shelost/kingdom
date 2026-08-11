<script lang="ts">
	/**
	 * Pantheon org-chart: Hwanin (Creator) above the Three Realms.
	 * Steps:
	 *   - 'realms' — Creator + three realm heads only
	 *   - 'courts' — full tree under each head (default)
	 * Optional `realm` prop filters to one column (centered at x=200).
	 * `heaven` focuses Hwanin’s mandate line (Hwanung → Dangun).
	 */
	import type { DiagramProps } from './registry';

	let {
		step = 'courts',
		active = false,
		realm
	}: DiagramProps = $props();

	const CENTER = 200;

	type RealmId = 'heaven' | 'underworld' | 'living' | 'flower';

	function normalizeRealm(raw: string | undefined): RealmId | null {
		if (!raw) return null;
		const key = raw.toLowerCase();
		if (key === 'heaven' || key === 'hwanin') return 'heaven';
		if (key === 'underworld' || key === 'dead' || key === 'daebyeol') return 'underworld';
		if (key === 'living' || key === 'sobyeol') return 'living';
		if (key === 'flower' || key === 'west' || key === 'field' || key === 'sara') return 'flower';
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

	const focus = $derived(normalizeRealm(realm));

	const visibleCols = $derived(
		focus && focus !== 'heaven'
			? COLS.filter((c) => c.realm === focus).map((c) => ({ ...c, x: CENTER }))
			: focus === 'heaven'
				? []
				: COLS
	);

	const full = $derived(focus ? true : step !== 'realms');

	const ox = $derived(
		focus && focus !== 'heaven'
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
			: focus
				? (() => {
						const c = COLS.find((col) => col.realm === focus)!;
						return `${c.realmKo} · ${c.realmEn}`;
					})()
				: '삼계 · Three Realms under Hwanin'
	);

	const hx = (base: number) => base + ox;
	const showCreator = $derived(!focus || focus === 'heaven');
	const showRealms = $derived(!focus || focus !== 'heaven');
</script>

<svg
	viewBox="0 0 400 320"
	class="dg"
	class:play={active}
	data-step={step}
	data-realm={focus ?? 'all'}
	role="img"
	aria-label="Org chart of the Three Realms under Hwanin the Creator: Big Star, Little Star, and Hallakgungi, with their courts below."
>
	{#if showCreator}
		<!-- Creator above the Three Realms -->
		<g class="node head creator" style="--d: 40">
			<text class="realm-ko" x={CENTER} y={CREATOR_Y - 10}>창조주 · 하늘나라</text>
			<text class="realm-en" x={CENTER} y={CREATOR_Y}>Creator · Heaven</text>
			<text class="n-ko" x={CENTER} y={CREATOR_Y + 16}>환인</text>
			<text class="n-en" x={CENTER} y={CREATOR_Y + 28}>Hwanin</text>
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
				<text class="n-ko" x={CENTER} y={MID_Y}>환웅</text>
				<text class="n-en" x={CENTER} y={MID_Y + 12}>Hwanung</text>
			</g>
			<g class="node child" style="--d: 800">
				<text class="n-ko" x={CENTER} y={LOW_Y}>단군</text>
				<text class="n-en" x={CENTER} y={LOW_Y + 12}>Dangun</text>
			</g>
		{/if}
	{/if}

	{#if showRealms}
		{#each visibleCols as c, i (c.id)}
			<g class="node head" style="--d: {280 + i * 60}">
				<text class="realm-ko" x={c.x} y={HEAD_Y - 14}>{c.realmKo}</text>
				<text class="realm-en" x={c.x} y={HEAD_Y - 4}>{c.realmEn}</text>
				<text class="n-ko" x={c.x} y={HEAD_Y + 14}>{c.ko}</text>
				<text class="n-en" x={c.x} y={HEAD_Y + 26}>{c.en}</text>
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
				<g class="node child" style="--d: 640">
					<text class="n-ko" x={hx(80)} y={MID_Y}>염라</text>
					<text class="n-en" x={hx(80)} y={MID_Y + 12}>Yumla</text>
				</g>
				<g class="node child" style="--d: 940">
					<text class="n-ko" x={hx(42)} y={LOW_Y}>강림</text>
					<text class="n-en" x={hx(42)} y={LOW_Y + 12}>Kangrim</text>
				</g>
				<g class="node child" style="--d: 980">
					<text class="n-ko" x={hx(118)} y={LOW_Y}>해원맥</text>
					<text class="n-en" x={hx(118)} y={LOW_Y + 12}>Haewonmek</text>
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
					<g class="node child tagged" style="--d: {820 + i * 60}">
						<text class="n-ko" x={L.x} y={MID_Y}>{L.ko}</text>
						<text class="n-en" x={L.x} y={MID_Y + 12}>{L.en}</text>
						<text class="tag" x={L.x} y={MID_Y + 26}>{L.tag} · {L.tagEn}</text>
					</g>
				{/each}
			{/if}

			<!-- Hallakgungi: alone among the Three Realms principals -->
		{/if}
	{/if}

	<text class="foot" style="--d: {full ? 1100 : 500}" x="200" y="300">{foot}</text>
</svg>

<style>
	.dg {
		--pantheon: #d4b86a;
		--heaven: #f4f1e8;
		--living: #c94040;
		--dead: #3b6fbf;
		--flower: #8fbf8a;
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

	.realm-ko {
		font-size: 7.5px;
		letter-spacing: 0.06em;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--pantheon) 70%, var(--fg-faint));
	}

	.realm-en {
		font-size: 5.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	.n-ko {
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--pantheon) 85%, var(--gold));
	}

	.head .n-ko {
		font-size: 13px;
	}

	.creator .n-ko {
		font-size: 14px;
		fill: color-mix(in srgb, var(--heaven) 70%, var(--gold));
	}

	.n-en {
		font-size: 6px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	.tag {
		font-size: 6px;
		letter-spacing: 0.04em;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--pantheon) 55%, var(--fg-faint));
	}

	.link {
		fill: none;
		stroke: color-mix(in srgb, var(--pantheon) 78%, var(--gold));
		stroke-width: 1.15;
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
		fill: color-mix(in srgb, var(--pantheon) 50%, var(--fg-faint));
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
