<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { collectKind, sameName, shortLabel, type ArcBeat, type ArcNode, type ArcReview } from '$lib/episodeArc';

	let {
		outline = [],
		beats = [],
		reviews = [],
		words = 0
	}: {
		outline?: ArcNode[];
		beats?: ArcBeat[];
		reviews?: ArcReview[];
		words?: number;
	} = $props();

	const TONES = ['#d8b26a', '#7f9bb3', '#c47a6a', '#6a9c7a', '#9a7bb3', '#c4a07a'];

	type Cell = { id: string; label: string; words: number; at: number; tone: string; title: string };

	const total = $derived(words || outline.reduce((a, n) => a + n.words, 0) || 1);

	function cellsOf(nodes: ArcNode[], tones: string[]): Cell[] {
		return nodes
			.filter((n) => n.words > 0)
			.map((n, i) => {
				const pct = Math.round((1000 * n.words) / total) / 10;
				const name = shortLabel(n.label);
				return {
					id: `${n.kind}-${n.label}-${n.at ?? 0}-${i}`,
					label: name,
					words: n.words,
					at: n.at ?? 0,
					tone: tones[i % tones.length],
					title: `${n.label} · ${n.words.toLocaleString('en-US')} words · ${pct}%`
				};
			});
	}

	const sectionNodes = $derived(outline.filter((n) => n.kind === 'section'));
	const topOther = $derived(outline.filter((n) => n.kind !== 'section'));

	const storyNodes = $derived(collectKind(outline, 'story').filter((n) => n.words > 0));

	const sceneNodes = $derived.by(() => {
		const nested = [
			...collectKind(outline, 'scene'),
			...collectKind(outline, 'day'),
			...topOther.filter((n) => n.kind === 'scene' || n.kind === 'day')
		];
		const seen = new SvelteSet<string>();
		return nested.filter((n) => {
			const id = `${n.at ?? 0}:${n.label}`;
			if (seen.has(id)) return false;
			seen.add(id);
			return n.words > 0;
		});
	});

	const lanes = $derived.by(() => {
		const out: { key: string; label: string; cells: Cell[] }[] = [];
		if (sectionNodes.length) {
			const opening = topOther.filter((n) => n.kind === 'scene' || n.kind === 'day' || n.kind === 'story');
			out.push({
				key: 'sections',
				label: 'Sections',
				cells: cellsOf([...opening.filter((n) => n.kind !== 'story'), ...sectionNodes], TONES)
			});
		}
		if (storyNodes.length) {
			const onlySame =
				sectionNodes.length > 0 &&
				storyNodes.length === sectionNodes.length &&
				storyNodes.every((s, i) => {
					const sec = sectionNodes[i];
					return sec && sameName(s.label, sec.label) && Math.abs(s.words - sec.words) < 8;
				});
			if (!onlySame) out.push({ key: 'stories', label: 'Stories', cells: cellsOf(storyNodes, TONES) });
		}
		if (sceneNodes.length && sceneNodes.length <= 20 && (sectionNodes.length > 0 || storyNodes.length > 0)) {
			out.push({ key: 'scenes', label: 'Scenes', cells: cellsOf(sceneNodes, TONES) });
		}
		if (!out.length && outline.length) {
			out.push({ key: 'scenes', label: 'Scenes', cells: cellsOf(outline, TONES) });
		}
		return out;
	});

	let width = $state(640);
	let hover = $state<number | null>(null);

	const H = 104;
	const PAD = { l: 8, r: 8, t: 16, b: 18 };
	const innerW = $derived(Math.max(80, width - PAD.l - PAD.r));
	const innerH = $derived(H - PAD.t - PAD.b);

	function xOf(at: number, w: number): number {
		return PAD.l + ((at + w / 2) / total) * innerW;
	}
	function yOf(t: number): number {
		return PAD.t + innerH * (1 - t / 100);
	}
	function diamond(cx: number, cy: number, r: number): string {
		return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
	}

	const line = $derived.by(() => {
		if (beats.length < 2) return '';
		return beats.map((b, i) => `${i === 0 ? 'M' : 'L'}${xOf(b.at, b.words).toFixed(1)},${yOf(b.tension).toFixed(1)}`).join(' ');
	});
	const area = $derived.by(() => {
		if (!line) return '';
		const last = beats.at(-1);
		const first = beats[0];
		if (!last || !first) return '';
		const base = (PAD.t + innerH).toFixed(1);
		return `${line} L${xOf(last.at, last.words).toFixed(1)},${base} L${xOf(first.at, first.words).toFixed(1)},${base} Z`;
	});
	const hot = $derived(hover != null ? beats[hover] : null);
	const peak = $derived(beats.find((b) => b.climax));

	function indexAt(clientX: number, el: SVGSVGElement): number {
		const box = el.getBoundingClientRect();
		const x = ((clientX - box.left) / box.width) * width;
		const word = ((x - PAD.l) / innerW) * total;
		let best = 0;
		let dist = Infinity;
		beats.forEach((b, i) => {
			const mid = b.at + b.words / 2;
			const d = Math.abs(mid - word);
			if (d < dist) {
				dist = d;
				best = i;
			}
		});
		return best;
	}

	function onmove(e: PointerEvent) {
		hover = indexAt(e.clientX, e.currentTarget as SVGSVGElement);
	}

	function leftPct(cell: Cell): string {
		return `${(100 * cell.at) / total}%`;
	}
	function widthPct(cell: Cell): string {
		return `${(100 * cell.words) / total}%`;
	}
</script>

{#if lanes.length}
	<section class="arc" aria-label="How the episode's length is allocated">
		<p class="kicker">Length</p>
		<div class="lanes">
			{#each lanes as lane (lane.key)}
				<div class="lane">
					<span class="lane-label">{lane.label}</span>
					<div class="track" role="list">
						{#each lane.cells as cell (cell.id)}
							<span
								class={['cell', { tight: cell.words / total < 0.06 }]}
								role="listitem"
								title={cell.title}
								style:left={leftPct(cell)}
								style:width={widthPct(cell)}
								style:--tone={cell.tone}
							>
								<span class="cell-name">{cell.label}</span>
								<span class="cell-n">{cell.words.toLocaleString('en-US')}</span>
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if beats.length > 1}
	<section class="tension" aria-label="Story tension">
		<p class="kicker">Tension</p>
		<div class="frame" bind:clientWidth={width}>
			<svg
				viewBox="0 0 {width} {H}"
				role="img"
				aria-label="Line chart of key events and tension across the episode"
				onpointermove={onmove}
				onpointerleave={() => (hover = null)}
			>
				<line class="base" x1={PAD.l} x2={width - PAD.r} y1={PAD.t + innerH} y2={PAD.t + innerH} />
				{#if area}<path class="area" d={area} />{/if}
				{#if line}<path class="line" d={line} />{/if}
				{#each beats as b, i (b.at + b.label)}
					{#if b.climax}
						<polygon
							class={{ climax: true, on: hover === i }}
							points={diamond(xOf(b.at, b.words), yOf(b.tension), hover === i ? 6.2 : 5.2)}
						/>
					{:else}
						<circle
							class={{ dot: true, start: b.start, on: hover === i }}
							cx={xOf(b.at, b.words)}
							cy={yOf(b.tension)}
							r={hover === i ? 3.6 : b.start ? 2.4 : 2.2}
						/>
					{/if}
				{/each}
				{#if peak}
					<text class="climax-label" x={xOf(peak.at, peak.words)} y={Math.max(10, yOf(peak.tension) - 10)}>Climax</text>
				{/if}
				{#if hot}
					<line class="rule" x1={xOf(hot.at, hot.words)} x2={xOf(hot.at, hot.words)} y1={PAD.t} y2={PAD.t + innerH} />
				{/if}
			</svg>
			{#if hot}
				<p class="tip">
					{#if hot.climax}<span class="mark">Climax</span>{/if}
					{hot.label}
					<span class="n">{hot.tension}</span>
				</p>
			{:else}
				<p class="tip mute">Hover a node. Each mark is a turn. The diamond is the climax.</p>
			{/if}
		</div>
	</section>
{/if}

{#if reviews.length}
	<section class="reviews" aria-label="Reader notes">
		<p class="kicker">A reader</p>
		<ul>
			{#each reviews as r, i (`${r.by}-${i}`)}
				<li class={r.lean}>
					<p>{r.text}</p>
					<span>{r.by}</span>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.arc,
	.tension,
	.reviews {
		margin: 0.85rem 0 0.4rem;
	}
	.kicker {
		margin: 0 0 0.35rem;
		font-size: 0.66rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}
	.lanes {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.lane {
		display: grid;
		grid-template-columns: 4.6rem 1fr;
		gap: 0.45rem;
		align-items: stretch;
		min-height: 2.1rem;
	}
	.lane-label {
		align-self: center;
		font-size: 0.66rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}
	.track {
		position: relative;
		min-width: 0;
		min-height: 2.1rem;
	}
	.cell {
		position: absolute;
		top: 0;
		bottom: 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.05rem;
		min-width: 0;
		padding: 0.28rem 0.4rem;
		border-left: 3px solid var(--tone);
		border-radius: 3px;
		background: color-mix(in srgb, var(--tone) 16%, var(--bg));
		overflow: hidden;
	}
	.cell-name {
		overflow: hidden;
		font-family: var(--serif);
		font-size: 0.72rem;
		font-weight: 600;
		line-height: 1.15;
		color: var(--fg-strong);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.cell-n {
		font-size: 0.6rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}
	.cell.tight .cell-name,
	.cell.tight .cell-n {
		display: none;
	}
	.frame {
		position: relative;
		width: 100%;
	}
	.frame svg {
		display: block;
		width: 100%;
		height: 104px;
		cursor: crosshair;
	}
	.base {
		stroke: var(--hairline);
		stroke-width: 1;
	}
	.area {
		fill: color-mix(in srgb, var(--gold) 18%, transparent);
	}
	.line {
		fill: none;
		stroke: var(--gold);
		stroke-width: 1.6;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.dot {
		fill: var(--gold);
	}
	.dot.start {
		fill: var(--fg-dim);
	}
	.dot.on {
		fill: var(--fg-strong);
	}
	.climax {
		fill: #d0624a;
		stroke: color-mix(in srgb, #d0624a 40%, white);
		stroke-width: 1;
	}
	.climax.on {
		fill: var(--fg-strong);
	}
	.climax-label {
		fill: #d0624a;
		font-size: 9px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-anchor: middle;
	}
	.rule {
		stroke: color-mix(in srgb, var(--gold) 55%, transparent);
		stroke-width: 1;
		stroke-dasharray: 2 3;
	}
	.tip {
		margin: 0.15rem 0 0;
		min-height: 1.1em;
		font-size: 0.74rem;
		color: var(--fg-dim);
	}
	.tip .mark {
		margin-right: 0.4rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.62rem;
		color: #d0624a;
	}
	.tip .n {
		margin-left: 0.35rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}
	.tip.mute {
		color: var(--fg-faint);
	}
	.reviews ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 0.55rem;
	}
	.reviews li {
		margin: 0;
		padding: 0.55rem 0.7rem 0.5rem;
		border-radius: var(--radius);
		background: var(--panel);
		border-left: 3px solid var(--hairline);
	}
	.reviews li.up {
		border-left-color: #5fae7a;
	}
	.reviews li.down {
		border-left-color: #d0624a;
	}
	.reviews p {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.84rem;
		line-height: 1.35;
		color: var(--fg);
	}
	.reviews span {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.66rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}
	@media (max-width: 640px) {
		.lane {
			grid-template-columns: 1fr;
			gap: 0.15rem;
		}
	}
</style>
