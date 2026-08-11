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
		<text class="verdict-ko" x={CX} y={CY - 1}>{verdict.ko}</text>
		<text class="verdict-en" x={CX} y={CY + 16}>{verdict.en}</text>
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
					<text class="mark yes" style="--d: {1450 + s.i * 90}" x={s.x} y={s.y + 4.5}>✓</text>
				{:else if v === 'no'}
					<text class="mark nay" style="--d: {1450 + s.i * 90}" x={s.x} y={s.y + 4.5}>✕</text>
				{/if}
			</g>
		</g>
		{#if s.i === BIDAM && (step === 'veto' || step === 'rebellion')}
			<text
				class="seat-name"
				style="--d: 1900; --bx: {step === 'rebellion' ? s.dx * 30 : 0}px; --by: {step ===
				'rebellion'
					? s.dy * 30
					: 0}px"
				x={s.x + 26}
				y={s.y + 4}>의원 · Councillor</text
			>
		{/if}
	{/each}

	<!-- the three gates of a session -->
	{#if voting}
		{#each gates as g, i (g.ko)}
			{@const fails = step === 'veto' && i === 2}
			<g class="gate" class:fail={fails} style="--d: {2100 + i * 350}">
				<circle cx={g.x} cy={266} r="3.2" />
				<text class="gate-ko" x={g.x} y={281}>{g.ko}</text>
				<text class="gate-en" x={g.x} y={292}>{fails ? '✕ ' + g.en : g.en}</text>
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
		--silla: #3e79e4;
		--gold: #d8b26a;
		--parchment: #fff8e8;
		--nay: #cf4b4b;
		font-family: var(--serif);
	}

	/* ——— motion (centre) ——— */
	.center {
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.motion {
		fill: color-mix(in srgb, var(--gold) 22%, var(--parchment));
		stroke: color-mix(in srgb, var(--gold) 70%, transparent);
		stroke-width: 1.15;
		transition: fill 800ms var(--ease) 2400ms, stroke 800ms var(--ease) 2400ms;
	}

	.verdict-ko {
		font-size: 17px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--fg-dim);
		opacity: 0;
		transition: opacity 700ms var(--ease) 2500ms, fill 700ms var(--ease) 2500ms;
	}

	.verdict-en {
		font-size: 8.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
		opacity: 0;
		transition: opacity 700ms var(--ease) 2600ms;
	}

	.play .center {
		opacity: 1;
	}

	.play .verdict-ko,
	.play .verdict-en {
		opacity: 1;
	}

	.play[data-step='unanimous'] .motion {
		fill: color-mix(in srgb, var(--gold) 38%, var(--parchment));
		stroke: var(--gold);
	}

	.play[data-step='unanimous'] .verdict-ko {
		fill: var(--gold);
	}

	.play[data-step='veto'] .verdict-ko {
		fill: var(--nay);
	}

	.play[data-step='veto'] .motion {
		stroke: color-mix(in srgb, var(--nay) 45%, transparent);
		fill: transparent;
	}

	.play[data-step='ornamental'] .motion,
	.play[data-step='rebellion'] .motion {
		stroke: color-mix(in srgb, var(--fg-faint) 45%, transparent);
		fill: transparent;
		stroke-dasharray: 3 4;
	}

	/* ——— spokes ——— */
	.spoke {
		stroke: color-mix(in srgb, var(--silla) 65%, transparent);
		stroke-width: 1.15;
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
		stroke: color-mix(in srgb, var(--nay) 70%, transparent);
	}

	.play .spoke.breakaway {
		opacity: 0.25;
		stroke-dasharray: 4 5;
		transition: stroke-dashoffset 800ms var(--ease) calc(var(--d) * 1ms),
			opacity 900ms var(--ease) 2000ms, stroke 900ms var(--ease) 2000ms;
	}

	.play[data-step='ornamental'] .spoke {
		stroke: color-mix(in srgb, var(--fg-faint) 35%, transparent);
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
		fill: color-mix(in srgb, var(--silla) 34%, var(--parchment));
		stroke: color-mix(in srgb, var(--silla) 85%, var(--gold));
		stroke-width: 1.35;
		transition: fill 800ms var(--ease) 1800ms, stroke 800ms var(--ease) 1800ms;
	}

	.play .seat {
		opacity: 1;
		transform: scale(1);
	}

	.play .seat.no circle,
	.play .seat.breakaway circle {
		fill: color-mix(in srgb, var(--nay) 32%, var(--parchment));
		stroke: var(--nay);
	}

	.play[data-step='rebellion'] .seat.breakaway circle {
		fill: color-mix(in srgb, var(--nay) 22%, var(--parchment));
	}

	.play[data-step='ornamental'] .seat circle {
		fill: color-mix(in srgb, var(--fg-faint) 14%, var(--parchment));
		stroke: color-mix(in srgb, var(--fg-faint) 45%, transparent);
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

	.seat-name {
		font-size: 9.5px;
		fill: color-mix(in srgb, var(--nay) 75%, #fff);
		opacity: 0;
		transform: translate(var(--bx, 0), var(--by, 0));
		transition: opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 900ms var(--ease) 2000ms;
	}

	.play .seat-name {
		opacity: 1;
	}

	/* ——— the three gates ——— */
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

	.gate-ko {
		font-size: 9.5px;
		font-weight: 600;
		text-anchor: middle;
		fill: var(--fg-dim);
	}

	.gate-en {
		font-size: 7px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	.gate.fail .gate-ko,
	.gate.fail .gate-en {
		fill: color-mix(in srgb, var(--nay) 80%, #fff);
	}

	.gate-link {
		stroke: color-mix(in srgb, var(--fg-faint) 40%, transparent);
		stroke-width: 1;
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
