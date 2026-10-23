<script lang="ts">
	import { boxLabel, boxSpans, STORY_LIST, type BoxSpan } from '$lib/episodeStory';

	let {
		selectedId = null,
		onselect
	}: {
		selectedId?: string | null;
		onselect?: (id: string | null) => void;
	} = $props();

	let width = $state(960);
	let hoverId = $state<string | null>(null);

	const H = 340;
	const PAD = { l: 18, r: 18, t: 16, b: 36 };
	const innerW = $derived(Math.max(120, width - PAD.l - PAD.r));
	const innerH = $derived(H - PAD.t - PAD.b);
	const count = STORY_LIST.length;
	const slot = $derived(count ? innerW / count : 0);
	const baseY = $derived(PAD.t + innerH);
	const spans = boxSpans();
	const maxSpan = $derived(Math.max(1, ...spans.map((s) => Math.abs((s.payN ?? count - 1) - s.plantN))));

	function xOf(n: number): number {
		return PAD.l + slot * n + slot / 2;
	}

	function pathOf(span: BoxSpan): string {
		const x1 = xOf(span.plantN);
		const x2 = xOf(span.payN ?? count - 1);
		const dx = Math.abs((span.payN ?? count - 1) - span.plantN);
		const h = 14 + (dx / maxSpan) * (innerH - 20);
		const mid = (x1 + x2) / 2;
		return `M ${x1.toFixed(1)} ${baseY.toFixed(1)} Q ${mid.toFixed(1)} ${(baseY - h).toFixed(1)} ${x2.toFixed(1)} ${baseY.toFixed(1)}`;
	}

	const activeId = $derived(hoverId ?? selectedId);
	const active = $derived(activeId ? spans.find((s) => s.box.id === activeId) : null);

	function pick(id: string) {
		onselect?.(selectedId === id ? null : id);
	}
</script>

<section class="chart" aria-label="Mystery boxes across the book">
	<div class="legend">
		{#each spans as span (span.box.id)}
			<button
				type="button"
				class={['pill', { on: activeId === span.box.id, open: span.payN == null }]}
				style:--swatch={span.color}
				aria-pressed={selectedId === span.box.id}
				onclick={() => pick(span.box.id)}
				onpointerenter={() => (hoverId = span.box.id)}
				onpointerleave={() => (hoverId = null)}
			>
				<span class="swatch"></span>
				{span.box.head}
			</button>
		{/each}
	</div>
	<div class="frame" bind:clientWidth={width} role="img" aria-label="Arcs from plant to payoff">
		<svg viewBox="0 0 {width} {H}" aria-hidden="true">
			<line class="axis" x1={PAD.l} x2={width - PAD.r} y1={baseY} y2={baseY} />
			{#each spans as span (span.box.id)}
				{@const hot = !activeId || activeId === span.box.id}
				<path
					class={['arc', { dim: !hot, open: span.payN == null }]}
					d={pathOf(span)}
					style:stroke={span.color}
				/>
			{/each}
			{#each spans as span (span.box.id + '-dots')}
				{@const hot = !activeId || activeId === span.box.id}
				<circle class={['dot', { dim: !hot }]} cx={xOf(span.plantN)} cy={baseY} r="2.4" fill={span.color} />
				{#if span.payN != null}
					<circle class={['dot', { dim: !hot }]} cx={xOf(span.payN)} cy={baseY} r="2.4" fill={span.color} />
				{/if}
			{/each}
		</svg>
		{#if active}
			<div class="tip">
				<strong>{boxLabel(active.box)}</strong>
				<span>
					{active.plantTitle}
					{#if active.payTitle}
						→ {active.payTitle}
					{:else}
						· still open
					{/if}
				</span>
			</div>
		{/if}
	</div>
</section>

<style>
	.chart { margin: 0 0 1.1rem; }
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-bottom: 0.5rem;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
		border: 0;
		background: var(--panel);
		color: var(--fg-dim);
		border-radius: var(--radius-pill);
		padding: 0.22rem 0.58rem;
		font: inherit;
		font-size: 0.72rem;
		cursor: pointer;
	}
	.pill.on { background: color-mix(in srgb, var(--swatch) 28%, var(--panel)); color: var(--fg-strong); }
	.pill.open { opacity: 0.72; }
	.swatch {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--swatch);
	}
	.frame {
		position: relative;
		background: var(--panel);
		border-radius: var(--widget-radius);
		overflow: hidden;
	}
	svg { display: block; width: 100%; height: auto; }
	.axis { stroke: var(--hairline); stroke-width: 1; }
	.arc {
		fill: none;
		stroke-width: 1.55;
		stroke-linecap: round;
		opacity: 0.82;
	}
	.arc.open { stroke-dasharray: 3 4; opacity: 0.4; }
	.arc.dim, .dot.dim { opacity: 0.08; }
	.dot { opacity: 0.9; }
	.tip {
		position: absolute;
		left: 0.8rem;
		top: 0.65rem;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		pointer-events: none;
		max-width: 28rem;
	}
	.tip strong { font-size: 0.86rem; font-weight: 560; color: var(--fg-strong); }
	.tip span { color: var(--fg-faint); font-size: 0.72rem; }
</style>
