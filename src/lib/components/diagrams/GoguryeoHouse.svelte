<script module lang="ts">
	type Node = {
		id: string;
		ko: string;
		en: string;
		x: number;
		y: number;
		r?: number;
	};

	/** One generation of brothers; Suchun’s two sons under him; Ulbul under Dolgo. */
	export const NODES: Node[] = [
		{ id: 'ilu', ko: '일우', en: 'Ilu', x: 48, y: 48 },
		{ id: 'suchun', ko: '서천', en: 'Suchun', x: 160, y: 46, r: 22 },
		{ id: 'sobal', ko: '소발', en: 'Sobal', x: 272, y: 48 },
		{ id: 'dalga', ko: '달가', en: 'Dalga', x: 352, y: 48 },
		{ id: 'bongsang', ko: '봉상', en: 'Bongsang', x: 118, y: 148 },
		{ id: 'dolgo', ko: '돌고', en: 'Dolgo', x: 202, y: 148 },
		{ id: 'micheon', ko: '을불', en: 'Ulbul', x: 202, y: 230 }
	];

	const DEAD: Record<string, string[]> = {
		house: [],
		banquet: ['ilu', 'sobal'],
		suchun: ['ilu', 'sobal', 'suchun'],
		dalga: ['ilu', 'sobal', 'suchun', 'dalga'],
		dolgo: ['ilu', 'sobal', 'suchun', 'dalga', 'dolgo'],
		hunt: ['ilu', 'sobal', 'suchun', 'dalga', 'dolgo', 'bongsang']
	};

	const CROWN: Record<string, string> = {
		house: 'suchun',
		banquet: 'suchun',
		suchun: 'bongsang',
		dalga: 'bongsang',
		dolgo: 'bongsang',
		hunt: 'micheon'
	};

	/** Arrows drawn on this step only: who killed the newly crossed member. */
	const KILLS: Record<string, { from: string; to: string }[]> = {
		house: [],
		banquet: [
			{ from: 'suchun', to: 'ilu' },
			{ from: 'suchun', to: 'sobal' }
		],
		suchun: [],
		dalga: [{ from: 'bongsang', to: 'dalga' }],
		dolgo: [{ from: 'bongsang', to: 'dolgo' }],
		hunt: [{ from: 'micheon', to: 'bongsang' }]
	};

	function nodeOf(id: string) {
		return NODES.find((n) => n.id === id);
	}

	/** Quadratic from the killer’s rim to the victim’s rim, bowed off the family links. */
	function killPath(fromId: string, toId: string) {
		const a = nodeOf(fromId);
		const b = nodeOf(toId);
		if (!a || !b) return '';
		const ar = a.r ?? 18;
		const br = b.r ?? 18;
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const len = Math.hypot(dx, dy) || 1;
		const ux = dx / len;
		const uy = dy / len;
		const x1 = a.x + ux * (ar + 2);
		const y1 = a.y + uy * (ar + 2);
		const x2 = b.x - ux * (br + 4);
		const y2 = b.y - uy * (br + 4);
		const mx = (x1 + x2) / 2;
		const my = (y1 + y2) / 2;
		const bulge = 26;
		return `M ${x1} ${y1} Q ${mx - uy * bulge} ${my + ux * bulge} ${x2} ${y2}`;
	}
</script>

<script lang="ts">
	/**
	 * Brief Goguryeo royal house. Steps mark who is already dead, and a red
	 * arrow names the hand that did it.
	 * house → banquet → suchun → dalga → dolgo → hunt
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';
	import { byId, avatarOf } from '$lib/people';

	let { step = 'house', active = false, flat = false }: DiagramProps = $props();

	const dead = $derived(new Set(DEAD[step] ?? DEAD.house));
	const crownId = $derived(CROWN[step] ?? 'suchun');
	const kills = $derived(KILLS[step] ?? []);
	const gone = $derived(step === 'dolgo' ? new Set(['micheon']) : new Set<string>());
	function srcOf(id: string) {
		const p = byId.get(id);
		return p ? avatarOf(p) : null;
	}

	function nameOf(n: (typeof NODES)[number]) {
		if (n.id === 'micheon' && step === 'hunt') return { ko: '미천', en: 'Micheon' };
		if (n.id === 'micheon' && gone.has(n.id)) return { ko: '을불', en: 'gone' };
		return { ko: n.ko, en: n.en };
	}
</script>

<KitStage id="goguryeo-house" {step} {active} {flat} aspect={1.55}>
	{#snippet fallback()}
		<svg
			viewBox="0 0 400 268"
			class="dg"
			class:play={active}
			data-step={step}
			role="img"
			aria-label="Goguryeo royal house. Suchun and his brothers on one row; only his sons hang under him. Dead faces are struck through. A red arrow marks who killed whom."
		>
			<defs>
				<marker
					id="gog-kill-head-{step}"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="6"
					markerHeight="6"
					orient="auto"
				>
					<path d="M 0 0 L 8 4 L 0 8 Z" class="kill-head" />
				</marker>
			</defs>

			<!-- Sibling bar: Ilu, Suchun, Sobal, Dalga -->
			<path class="link" style="--d: 80" d="M 48 78 H 352" pathLength="100" />
			{#each [48, 160, 272, 352] as x, i (x)}
				<path class="link" style="--d: {120 + i * 24}" d="M {x} 68 V 78" pathLength="100" />
			{/each}
			<!-- Suchun to his two sons only -->
			<path class="link" style="--d: 220" d="M 160 68 V 110" pathLength="100" />
			<path class="link" style="--d: 250" d="M 118 110 H 202" pathLength="100" />
			<path class="link" style="--d: 270" d="M 118 110 V 130" pathLength="100" />
			<path class="link" style="--d: 290" d="M 202 110 V 130" pathLength="100" />
			<!-- Dolgo to Ulbul -->
			<path class="link" style="--d: 340" d="M 202 166 V 212" pathLength="100" />

			{#each kills as k, i (`${k.from}-${k.to}`)}
				<path
					class="kill"
					style="--d: {520 + i * 80}"
					d={killPath(k.from, k.to)}
					pathLength="100"
					marker-end="url(#gog-kill-head-{step})"
				/>
			{/each}

			{#each NODES as n, i (n.id)}
				{@const src = srcOf(n.id)}
				{@const r = n.r ?? 18}
				{@const isDead = dead.has(n.id)}
				{@const isGone = gone.has(n.id)}
				{@const isCrown = crownId === n.id && !isDead}
				{@const who = nameOf(n)}
				<g
					class="node person"
					class:dead={isDead}
					class:gone={isGone}
					class:crown={isCrown}
					data-person={n.id}
					style="--d: {80 + i * 70}"
				>
					<g transform="translate({n.x} {n.y})">
						<defs>
							<clipPath id="gog-face-{step}-{n.id}"><circle r={r - 2} /></clipPath>
						</defs>
						<circle class="disc" r={r} />
						{#if src}
							<image
								href={src}
								x={-r}
								y={-r - 3}
								width={r * 2}
								height={r * 2.5}
								preserveAspectRatio="xMidYMin slice"
								clip-path="url(#gog-face-{step}-{n.id})"
							/>
						{/if}
						<circle class="ring" r={r} />
						{#if isCrown}
							<path class="tick" d="M -5 {-r - 2} L 0 {-r - 8} L 5 {-r - 2}" />
						{/if}
						{#if isDead}
							<path class="x" d="M {-r * 0.55} {-r * 0.55} L {r * 0.55} {r * 0.55}" />
							<path class="x" d="M {r * 0.55} {-r * 0.55} L {-r * 0.55} {r * 0.55}" />
						{/if}
						<ChartLabel x="0" y={r + 12} ko={who.ko} en={who.en} w={48} size="sm" />
					</g>
				</g>
			{/each}

			<text class="foot" style="--d: 900" x="200" y="258">고구려 왕실 · the house</text>
		</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--accent: #c30000;
		--gog: #c30000;
		font-family: var(--serif);
	}

	.node,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: translateY(8px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 700ms var(--ease) calc(var(--d) * 1ms);
		cursor: pointer;
	}

	.play .node,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: translateY(0);
	}

	.play .node.dead {
		opacity: 0.42;
	}

	.play .node.gone {
		opacity: 0.55;
	}

	.disc {
		fill: color-mix(in srgb, var(--gog) 18%, #1a0a0a);
	}

	.ring {
		fill: none;
		stroke: var(--gog);
		stroke-width: 1.6;
	}

	.crown .ring {
		stroke-width: 2.4;
	}

	.gone .ring {
		stroke-dasharray: 3 2;
	}

	.tick {
		fill: none;
		stroke: var(--gog);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.x {
		fill: none;
		stroke: #e23a3a;
		stroke-width: 2.2;
		stroke-linecap: square;
	}

	.node.dead image {
		filter: grayscale(1);
	}

	.link {
		fill: none;
		stroke: var(--gog);
		stroke-width: var(--link-w, 1.4);
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

	.kill {
		fill: none;
		stroke: #e23a3a;
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 800ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .kill {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.kill-head {
		fill: #e23a3a;
	}

	.foot {
		font-size: 7.5px;
		text-transform: none;
		letter-spacing: 0.08em;
		fill: var(--gog);
		text-anchor: middle;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .link,
		.play .kill {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
