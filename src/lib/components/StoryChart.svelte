<script lang="ts">
	type ChartRow = {
		n: number;
		id: string;
		title: string;
		ko: string;
		year: string;
		arc: string;
		grade: string | null;
		composite: number;
		stats: Record<string, number | boolean | null>;
	};

	type SeriesKey = 'words' | 'score' | 'speakers' | 'dialoguePct' | 'stills';

	let {
		rows,
		highlightId = null,
		onhover
	}: {
		rows: ChartRow[];
		highlightId?: string | null;
		onhover?: (id: string | null) => void;
	} = $props();

	const SERIES: { key: SeriesKey; label: string; kind: 'bar' | 'line'; color: string }[] = [
		{ key: 'words', label: 'Words', kind: 'bar', color: 'var(--fg-faint)' },
		{ key: 'score', label: 'Score', kind: 'line', color: 'var(--gold)' },
		{ key: 'speakers', label: 'Speakers', kind: 'line', color: '#7eb8c9' },
		{ key: 'dialoguePct', label: 'Dialogue %', kind: 'line', color: '#c4a07a' },
		{ key: 'stills', label: 'Stills', kind: 'line', color: '#9aa3b5' }
	];

	let on = $state<Record<SeriesKey, boolean>>({
		words: true,
		score: true,
		speakers: true,
		dialoguePct: false,
		stills: false
	});
	let width = $state(960);
	let hover = $state<string | null>(null);

	const H = 300;
	const PAD = { l: 48, r: 18, t: 28, b: 42 };
	const innerW = $derived(Math.max(120, width - PAD.l - PAD.r));
	const innerH = $derived(H - PAD.t - PAD.b);
	const n = $derived(rows.length);
	const slot = $derived(n ? innerW / n : 0);

	function valueOf(row: ChartRow, key: SeriesKey): number {
		if (key === 'score') return row.composite;
		const field = key === 'stills' ? 'images' : key;
		return Number(row.stats[field]) || 0;
	}

	const maxOf = $derived.by(() => {
		const m: Record<SeriesKey, number> = { words: 1, score: 100, speakers: 1, dialoguePct: 100, stills: 1 };
		for (const row of rows) {
			m.words = Math.max(m.words, valueOf(row, 'words'));
			m.speakers = Math.max(m.speakers, valueOf(row, 'speakers'));
			m.stills = Math.max(m.stills, valueOf(row, 'stills'));
		}
		return m;
	});

	function yOf(row: ChartRow, key: SeriesKey): number {
		const max = key === 'score' || key === 'dialoguePct' ? 100 : maxOf[key];
		const t = max ? valueOf(row, key) / max : 0;
		return PAD.t + innerH * (1 - t);
	}

	function xOf(i: number): number {
		return PAD.l + slot * i + slot / 2;
	}

	const linePath = $derived.by(() => {
		const out: Partial<Record<SeriesKey, string>> = {};
		for (const s of SERIES) {
			if (s.kind !== 'line' || !on[s.key] || !n) continue;
			out[s.key] = rows
				.map((row, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(row, s.key).toFixed(1)}`)
				.join(' ');
		}
		return out;
	});

	const areaPath = $derived.by(() => {
		if (!on.score || !n) return '';
		const top = rows.map((row, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(row, 'score').toFixed(1)}`).join(' ');
		const last = xOf(n - 1).toFixed(1);
		const first = xOf(0).toFixed(1);
		const base = (PAD.t + innerH).toFixed(1);
		return `${top} L${last},${base} L${first},${base} Z`;
	});

	const arcs = $derived.by(() => {
		const marks: { i: number; name: string }[] = [];
		let last = '';
		rows.forEach((row, i) => {
			if (row.arc !== last) {
				marks.push({ i, name: row.arc });
				last = row.arc;
			}
		});
		return marks;
	});

	const active = $derived(hover ?? highlightId);
	const activeIndex = $derived(active ? rows.findIndex((r) => r.id === active) : -1);
	const activeRow = $derived(activeIndex >= 0 ? rows[activeIndex] : null);

	function indexAt(clientX: number, el: HTMLElement): number {
		const box = el.getBoundingClientRect();
		const x = ((clientX - box.left) / box.width) * width;
		const i = Math.floor((x - PAD.l) / slot);
		return Math.max(0, Math.min(n - 1, i));
	}

	function onmove(e: PointerEvent) {
		if (!n) return;
		const i = indexAt(e.clientX, e.currentTarget as HTMLElement);
		const id = rows[i]?.id ?? null;
		hover = id;
		onhover?.(id);
	}

	function onleave() {
		hover = null;
		onhover?.(null);
	}

	const ticks = [0, 25, 50, 75, 100];
</script>

{#if n}
	<section class="chart" aria-label="Episode metrics across the book">
		<div class="legend">
			{#each SERIES as s (s.key)}
				<button
					type="button"
					class={['pill', { on: on[s.key] }]}
					style:--swatch={s.color}
					aria-pressed={on[s.key]}
					onclick={() => (on[s.key] = !on[s.key])}
				>
					<span class={['swatch', { bar: s.kind === 'bar' }]}></span>
					{s.label}
				</button>
			{/each}
		</div>
		<div
			class="frame"
			bind:clientWidth={width}
			role="img"
			aria-label="Words, score and speakers by episode"
			onpointermove={onmove}
			onpointerleave={onleave}
		>
			<svg viewBox="0 0 {width} {H}" aria-hidden="true">
				{#each ticks as t (t)}
					{@const y = PAD.t + innerH * (1 - t / 100)}
					<line class="grid" x1={PAD.l} x2={width - PAD.r} y1={y} y2={y} />
					<text class="tick" x={PAD.l - 8} y={y + 3} text-anchor="end">{t}</text>
				{/each}
				{#each arcs as a (a.name + a.i)}
					<line class="arc" x1={xOf(a.i)} x2={xOf(a.i)} y1={PAD.t} y2={PAD.t + innerH} />
					<text class="arc-label" x={xOf(a.i) + 4} y={16}>{a.name}</text>
				{/each}
				{#if on.words}
					{#each rows as row, i (row.id)}
						{@const h = ((valueOf(row, 'words') / maxOf.words) * innerH) | 0}
						<rect
							class={['bar', { hot: row.id === active }]}
							x={xOf(i) - slot * 0.28}
							y={PAD.t + innerH - h}
							width={Math.max(1.2, slot * 0.56)}
							height={h}
						/>
					{/each}
				{/if}
				{#if areaPath}
					<path class="area" d={areaPath} />
				{/if}
				{#each SERIES as s (s.key)}
					{#if s.kind === 'line' && linePath[s.key]}
						<path class="line" d={linePath[s.key]} style:stroke={s.color} />
					{/if}
				{/each}
				{#if activeRow && activeIndex >= 0}
					<line class="rule" x1={xOf(activeIndex)} x2={xOf(activeIndex)} y1={PAD.t} y2={PAD.t + innerH} />
					{#each SERIES as s (s.key)}
						{#if on[s.key] && s.kind === 'line'}
							<circle
								cx={xOf(activeIndex)}
								cy={yOf(activeRow, s.key)}
								r="3.4"
								fill={s.color}
							/>
						{/if}
					{/each}
				{/if}
			</svg>
			{#if activeRow}
				<div
					class="tip"
					style:left="{Math.min(width - 220, Math.max(8, xOf(activeIndex) - 70))}px"
					style:top="28px"
				>
					<span class="tip-k">#{activeRow.n} · {activeRow.arc}</span>
					<strong>{activeRow.title}</strong>
					<span class="tip-k">{activeRow.ko}{activeRow.year ? ` · ${activeRow.year}` : ''}</span>
					<span class="tip-m">
						{activeRow.stats.words.toLocaleString('en-US')} words
						· {activeRow.composite} score
						· {activeRow.stats.speakers} speakers
					</span>
				</div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.chart { margin: 0 0 1.1rem; }
	.legend { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.55rem; }
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: 0;
		background: var(--panel);
		color: var(--fg-dim);
		border-radius: var(--radius-pill);
		padding: 0.28rem 0.7rem;
		font: inherit;
		font-size: 0.76rem;
		cursor: pointer;
	}
	.pill.on { background: color-mix(in srgb, var(--gold) 18%, var(--panel)); color: var(--fg-strong); }
	.swatch {
		width: 0.7rem;
		height: 2px;
		background: var(--swatch);
		border-radius: 1px;
	}
	.swatch.bar { height: 0.45rem; width: 0.45rem; opacity: 0.55; }
	.frame {
		position: relative;
		background: var(--panel);
		border-radius: var(--widget-radius);
		overflow: hidden;
	}
	svg { display: block; width: 100%; height: auto; cursor: crosshair; }
	.grid { stroke: var(--hairline); stroke-width: 1; }
	.tick {
		fill: var(--fg-faint);
		font-size: 10px;
		font-variant-numeric: tabular-nums;
	}
	.arc { stroke: color-mix(in srgb, var(--gold) 22%, transparent); stroke-width: 1; }
	.arc-label {
		fill: var(--fg-faint);
		font-size: 9px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.bar { fill: color-mix(in srgb, var(--fg) 13%, transparent); }
	.bar.hot { fill: color-mix(in srgb, var(--fg) 28%, transparent); }
	.area { fill: color-mix(in srgb, var(--gold) 16%, transparent); }
	.line { fill: none; stroke-width: 1.55; stroke-linejoin: round; stroke-linecap: round; }
	.rule { stroke: var(--gold); stroke-width: 1; opacity: 0.55; }
	.tip {
		position: absolute;
		pointer-events: none;
		min-width: 11.5rem;
		max-width: 16rem;
		padding: 0.45rem 0.6rem 0.5rem;
		background: var(--panel-sunken);
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		z-index: 2;
	}
	.tip strong { font-size: 0.86rem; font-weight: 560; color: var(--fg-strong); }
	.tip-k { color: var(--fg-faint); font-size: 0.7rem; }
	.tip-m { color: var(--fg-dim); font-size: 0.72rem; font-variant-numeric: tabular-nums; }
	@media (prefers-reduced-motion: no-preference) {
		.bar, .line, .area { transition: opacity 120ms linear; }
	}
</style>
