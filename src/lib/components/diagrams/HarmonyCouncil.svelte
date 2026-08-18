<script lang="ts">
	/**
	 * The Harmony Council (화백회의): one motion in the centre, six Councillor
	 * seats around it. Steps:
	 *   - 'unanimous'  — seats pop in, every sleeve assents, the motion passes
	 *   - 'veto'       — five assent, one (Bidam) objects; the motion dies
	 *   - 'rebellion'  — Bidam's seat goes dark and breaks away from the circle
	 *   - 'ornamental' — after the Secretariat: chairs polished, room empty of power
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'unanimous', active = false }: DiagramProps = $props();

	const CX = 180;
	const CY = 136;
	const R = 92;
	const BIDAM = 1; // the upper-right seat, when the story needs him

	const seats = Array.from({ length: 6 }, (_, i) => {
		const a = ((-90 + i * 60) * Math.PI) / 180;
		return {
			i,
			x: CX + R * Math.cos(a),
			y: CY + R * Math.sin(a),
			dx: Math.cos(a),
			dy: Math.sin(a)
		};
	});

	const voting = $derived(step === 'unanimous' || step === 'veto');

	function vote(i: number): 'yes' | 'no' | 'none' {
		if (step === 'unanimous') return 'yes';
		if (step === 'veto') return i === BIDAM ? 'no' : 'yes';
		return 'none';
	}

	const verdict = $derived(
		step === 'unanimous'
			? { ko: '가결', en: 'passed' }
			: step === 'veto'
				? { ko: '부결', en: 'vetoed' }
				: step === 'rebellion'
					? { ko: '화백', en: 'the Council' }
					: { ko: '화백', en: 'ornamental' }
	);

	// The three gates of every session, lit in sequence while a vote is shown.
	const gates = [
		{ ko: '초투표', en: 'initial vote', x: 78 },
		{ ko: '숙고', en: 'deliberation', x: 180 },
		{ ko: '최종 투표', en: 'final vote', x: 282 }
	];
</script>

<svg
	viewBox="0 0 360 300"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Diagram of the Harmony Council: six Councillor seats around one motion"
>
	<!-- spokes: each Councillor's hand on the motion -->
	{#each seats as s (s.i)}
		<line
			class="spoke"
			class:no={vote(s.i) === 'no'}
			class:breakaway={step === 'rebellion' && s.i === BIDAM}
			style="--d: {150 + s.i * 110}"
			x1={CX + s.dx * 36}
			y1={CY + s.dy * 36}
			x2={s.x - s.dx * 22}
			y2={s.y - s.dy * 22}
			pathLength="100"
		/>
	{/each}

	<!-- the motion before the room -->
	<g class="center" style="--d: 0">
		<circle class="motion" cx={CX} cy={CY} r="34" />
		<ChartLabel x={CX} y={CY + 2} ko={verdict.ko} en={verdict.en} w={62} size="lg" />
	</g>

	<!-- the six sleeves -->
	{#each seats as s (s.i)}
		{@const v = vote(s.i)}
		<g
			class="seat-pos"
			class:breakaway={step === 'rebellion' && s.i === BIDAM}
			style="--bx: {s.dx * 30}px; --by: {s.dy * 30}px"
		>
			<g
				class="seat"
				class:no={v === 'no'}
				class:breakaway={step === 'rebellion' && s.i === BIDAM}
				style="--d: {380 + s.i * 130}"
			>
				<circle cx={s.x} cy={s.y} r="19" />
				{#if v === 'yes'}
					<text class="mark yes" style="--d: {1450 + s.i * 90}" x={s.x} y={s.y - 5}>✓</text>
				{:else if v === 'no'}
					<text class="mark nay" style="--d: {1450 + s.i * 90}" x={s.x} y={s.y - 5}>✕</text>
				{/if}
				<ChartLabel x={s.x} y={s.y + 8} ko="의원" w={36} size="sm" />
			</g>
		</g>
	{/each}

	<!-- the three gates of a session -->
	{#if voting}
		{#each gates as g, i (g.ko)}
			{@const fails = step === 'veto' && i === 2}
			<g class="gate" class:fail={fails} style="--d: {2100 + i * 350}">
				<circle cx={g.x} cy={266} r="3.2" />
				<ChartLabel x={g.x} y={286} ko={g.ko} en={fails ? '✕ ' + g.en : g.en} w={72} size="sm" />
			</g>
			{#if i < 2}
				<line
					class="gate-link"
					style="--d: {2280 + i * 350}"
					x1={g.x + 34}
					y1={266}
					x2={gates[i + 1].x - 34}
					y2={266}
					pathLength="100"
				/>
			{/if}
		{/each}
	{/if}
</svg>

<style>
	.dg {
		--accent: #4d8eff;
		--silla: #4d8eff;
		--gold: #e8c36a;
		--nay: #ff4d4d;
		font-family: var(--serif);
	}

	/* ——— motion (centre) ——— */
	.center {
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.motion {
		fill: var(--gold);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
		transition: fill 800ms var(--ease) 2400ms, stroke 800ms var(--ease) 2400ms;
	}

	.play .center {
		opacity: 1;
	}

	.play[data-step='unanimous'] .motion {
		fill: var(--gold);
		stroke: var(--node-stroke);
		stroke-width: 3;
	}

	.play[data-step='veto'] .motion {
		stroke: color-mix(in srgb, var(--nay) 28%, #080604);
		fill: var(--nay);
		stroke-width: 3;
	}

	.play[data-step='ornamental'] .motion,
	.play[data-step='rebellion'] .motion {
		stroke: color-mix(in srgb, var(--ink-muted) 40%, #080604);
		fill: color-mix(in srgb, var(--silla) 55%, #6b7280);
		stroke-dasharray: 4 5;
		stroke-width: var(--stroke-w);
	}

	/* ——— spokes ——— */
	.spoke {
		stroke: var(--silla);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		transition: stroke-dashoffset 800ms var(--ease), opacity 800ms var(--ease),
			stroke 800ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .spoke {
		stroke-dashoffset: 0;
	}

	.play .spoke.no {
		stroke: var(--nay);
	}

	.play .spoke.breakaway {
		opacity: 0.25;
		stroke-dasharray: 4 5;
		transition: stroke-dashoffset 800ms var(--ease) calc(var(--d) * 1ms),
			opacity 900ms var(--ease) 2000ms, stroke 900ms var(--ease) 2000ms;
	}

	.play[data-step='ornamental'] .spoke {
		stroke: var(--ink-muted);
		stroke-dasharray: 3 5;
	}

	/* ——— seats ——— */
	.seat-pos {
		transition: transform 900ms var(--ease) 2000ms;
	}

	/* Bidam's seat leaves the circle */
	.play .seat-pos.breakaway {
		transform: translate(var(--bx), var(--by));
	}

	.seat {
		opacity: 0;
		transform: scale(0.3);
		transform-box: fill-box;
		transform-origin: center;
		transition: opacity 550ms var(--ease), transform 650ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.seat circle {
		fill: var(--silla);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
		transition: fill 800ms var(--ease) 1800ms, stroke 800ms var(--ease) 1800ms;
	}

	.play .seat {
		opacity: 1;
		transform: scale(1);
	}

	.play .seat.no circle,
	.play .seat.breakaway circle {
		fill: var(--nay);
		stroke: color-mix(in srgb, var(--nay) 28%, #080604);
	}

	.play[data-step='rebellion'] .seat.breakaway circle {
		fill: color-mix(in srgb, var(--nay) 82%, #4a1010);
		stroke: color-mix(in srgb, var(--nay) 28%, #080604);
		stroke-dasharray: 4 4;
	}

	.play[data-step='ornamental'] .seat circle {
		fill: color-mix(in srgb, var(--silla) 55%, #6b7280);
		stroke: color-mix(in srgb, var(--ink-muted) 40%, #080604);
		stroke-dasharray: 3 4;
	}

	/* ——— votes ——— */
	.mark {
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
		opacity: 0;
		transition: opacity 500ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.mark.yes {
		fill: var(--gold);
	}

	.mark.nay {
		fill: var(--nay);
	}

	.play .mark {
		opacity: 1;
	}

	.gate {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .gate {
		opacity: 1;
	}

	.gate circle {
		fill: var(--gold);
	}

	.gate.fail circle {
		fill: var(--nay);
	}

	.gate-link {
		stroke: var(--ink-muted);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		transition: stroke-dashoffset 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .gate-link {
		stroke-dashoffset: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
