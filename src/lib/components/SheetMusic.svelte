<script lang="ts">
	/**
	 * SheetMusic — dependency-free SVG notation for a motif's melody line.
	 *
	 * Renders a five-line staff with clef, time signature (when the motif
	 * declares a meter), note heads/stems/flags/dots, triplet marks, rests,
	 * ledger lines, ties (long notes split across barlines) and barlines.
	 * Pure layout math — no DOM access, safe during SSR.
	 */
	import type { Leitmotif } from '$lib/leitmotifs';

	type Base = 'w' | 'h' | 'q' | 'e' | 's';

	interface NoteSym {
		kind: 'note';
		x: number;
		y: number;
		d: number;
		base: Base;
		dots: number;
		triplet: boolean;
		acc: '' | '♯' | '♭';
		up: boolean;
		ledger: number[];
	}

	interface RestSym {
		kind: 'rest';
		x: number;
		base: Base;
		dots: number;
	}

	interface BarSym {
		kind: 'bar';
		x: number;
	}

	type Sym = NoteSym | RestSym | BarSym;

	interface TieArc {
		x1: number;
		x2: number;
		y: number;
		down: boolean;
	}

	interface Layout {
		width: number;
		clef: 'treble' | 'bass';
		syms: Sym[];
		ties: TieArc[];
	}

	let { motif }: { motif: Leitmotif } = $props();

	const TOP = 44;
	const GAP = 8;
	const STEP = GAP / 2;
	const BOTTOM = TOP + 4 * GAP;
	const MIDDLE = TOP + 2 * GAP;
	const HEIGHT = 128;
	const EPS = 1e-4;

	/** Pitch-class spelling — flats where the pentatonic modes prefer them. */
	const SPELL: readonly (readonly [letter: number, acc: '' | '♯' | '♭'])[] = [
		[0, ''], // C
		[1, '♭'], // Db
		[1, ''], // D
		[2, '♭'], // Eb
		[2, ''], // E
		[3, ''], // F
		[3, '♯'], // F#
		[4, ''], // G
		[5, '♭'], // Ab
		[5, ''], // A
		[6, '♭'], // Bb
		[6, ''] // B
	];

	const VALUES: readonly { beats: number; base: Base; dots: number; triplet: boolean }[] = [
		{ beats: 4, base: 'w', dots: 0, triplet: false },
		{ beats: 3, base: 'h', dots: 1, triplet: false },
		{ beats: 2, base: 'h', dots: 0, triplet: false },
		{ beats: 1.5, base: 'q', dots: 1, triplet: false },
		{ beats: 1, base: 'q', dots: 0, triplet: false },
		{ beats: 0.75, base: 'e', dots: 1, triplet: false },
		{ beats: 2 / 3, base: 'q', dots: 0, triplet: true },
		{ beats: 0.5, base: 'e', dots: 0, triplet: false },
		{ beats: 1 / 3, base: 'e', dots: 0, triplet: true },
		{ beats: 0.25, base: 's', dots: 0, triplet: false }
	];

	/** Diatonic index (C0 = 0, one step per staff position) with spelling. */
	function diatonicOf(midi: number): { d: number; acc: '' | '♯' | '♭' } {
		const pc = ((midi % 12) + 12) % 12;
		const [letter, acc] = SPELL[pc];
		const octave = Math.floor(midi / 12) - 1;
		return { d: octave * 7 + letter, acc };
	}

	/** Greedy split of a beat-count into renderable note values. */
	function decompose(t: number): (typeof VALUES)[number][] {
		const out: (typeof VALUES)[number][] = [];
		let r = t;
		let guard = 0;
		while (r > EPS && guard++ < 32) {
			const v = VALUES.find((v) => v.beats <= r + EPS) ?? VALUES[VALUES.length - 1];
			out.push(v);
			r -= v.beats;
		}
		return out;
	}

	function symWidth(beats: number): number {
		return 24 + 11 * Math.min(beats, 3);
	}

	function layout(m: Leitmotif): Layout {
		const sounding = m.notes.filter(([midi]) => midi != null) as readonly (readonly [number, number])[];
		const ds = sounding.map(([midi]) => diatonicOf(midi).d);

		// Pick the clef that keeps notes closest to the staff.
		const overflow = (bottomD: number) =>
			ds.reduce((s, d) => s + Math.max(0, d - (bottomD + 8)) + Math.max(0, bottomD - d), 0);
		const clef: 'treble' | 'bass' = overflow(30) <= overflow(18) ? 'treble' : 'bass';
		const bottomD = clef === 'treble' ? 30 : 18; // E4 / G2 on the bottom line
		const topD = bottomD + 8;

		const yOf = (d: number) => BOTTOM - (d - bottomD) * STEP;

		const barLen = m.meter ?? Infinity;
		const syms: Sym[] = [];
		const ties: TieArc[] = [];

		let x = m.meter ? 76 : 56;
		let pos = 0;

		const maybeBar = () => {
			if (barLen === Infinity || pos < EPS) return;
			const inBar = pos % barLen;
			if (inBar < EPS || barLen - inBar < EPS) {
				syms.push({ kind: 'bar', x });
				x += 14;
			}
		};

		for (const [midi, beats] of m.notes) {
			// Split the event at barlines, then into renderable values.
			let remaining = beats;
			const pieces: (typeof VALUES)[number][] = [];
			let scanPos = pos;
			while (remaining > EPS) {
				const inBar = barLen === Infinity ? remaining : barLen - (scanPos % barLen);
				const room = inBar < EPS ? Math.min(barLen, remaining) : Math.min(inBar, remaining);
				for (const v of decompose(room)) pieces.push(v);
				remaining -= room;
				scanPos += room;
			}

			for (let i = 0; i < pieces.length; i++) {
				const v = pieces[i];
				maybeBar();
				if (midi == null) {
					syms.push({ kind: 'rest', x, base: v.base, dots: v.dots });
				} else {
					const { d, acc } = diatonicOf(midi);
					const y = yOf(d);
					const up = y >= MIDDLE;
					const ledger: number[] = [];
					for (let dd = bottomD - 2; dd >= d - 1; dd -= 2) ledger.push(yOf(dd));
					for (let dd = topD + 2; dd <= d + 1; dd += 2) ledger.push(yOf(dd));
					const sym: NoteSym = {
						kind: 'note',
						x,
						y,
						d,
						base: v.base,
						dots: v.dots,
						triplet: v.triplet,
						acc,
						up,
						ledger
					};
					if (i < pieces.length - 1) {
						// tied to the next piece of the same held note
						ties.push({
							x1: x,
							x2: x + symWidth(v.beats) + (isBarNext(pos + v.beats, barLen) ? 14 : 0),
							y: up ? y + 7 : y - 7,
							down: up
						});
					}
					syms.push(sym);
				}
				pos += v.beats;
				x += symWidth(v.beats);
			}
		}

		return { width: x + 16, clef, syms, ties };
	}

	function isBarNext(pos: number, barLen: number): boolean {
		if (barLen === Infinity || pos < EPS) return false;
		const inBar = pos % barLen;
		return inBar < EPS || barLen - inBar < EPS;
	}

	function stemPath(s: NoteSym): string {
		const sx = s.up ? s.x + 4.4 : s.x - 4.4;
		const y1 = s.up ? s.y - 1.5 : s.y + 1.5;
		const y2 = s.up ? s.y - 27 : s.y + 27;
		return `M ${sx} ${y1} L ${sx} ${y2}`;
	}

	function flagPaths(s: NoteSym): string[] {
		const n = s.base === 'e' ? 1 : s.base === 's' ? 2 : 0;
		const sx = s.up ? s.x + 4.4 : s.x - 4.4;
		const tip = s.up ? s.y - 27 : s.y + 27;
		const dir = s.up ? 1 : -1;
		const paths: string[] = [];
		for (let i = 0; i < n; i++) {
			const y0 = tip + dir * i * 6;
			paths.push(
				`M ${sx} ${y0} C ${sx + 6.5} ${y0 + dir * 4}, ${sx + 8} ${y0 + dir * 10}, ${sx + 3} ${y0 + dir * 16}`
			);
		}
		return paths;
	}

	function dotY(s: NoteSym): number {
		// Dots sit in a space: nudge up when the head is on a line.
		return Math.round((BOTTOM - s.y) / STEP) % 2 === 0 ? s.y - 3.5 : s.y;
	}

	function tiePath(t: TieArc): string {
		const bend = t.down ? 6 : -6;
		return `M ${t.x1 + 5} ${t.y} Q ${(t.x1 + t.x2) / 2} ${t.y + bend} ${t.x2 - 5} ${t.y}`;
	}

	function quarterRestPath(x: number): string {
		return `M ${x - 2.5} ${TOP + 9} L ${x + 3} ${TOP + 15} L ${x - 2} ${TOP + 20} Q ${x + 4.5} ${TOP + 24} ${x + 1.5} ${TOP + 28}`;
	}

	function eighthRestPath(x: number, sixteenth: boolean): string {
		let p = `M ${x + 3.5} ${TOP + 13} L ${x - 2} ${TOP + 26}`;
		if (sixteenth) p += ` M ${x + 2} ${TOP + 18.5} L ${x - 2} ${TOP + 26}`;
		return p;
	}

	let art = $derived(layout(motif));
</script>

<div class="sheet">
	<svg
		viewBox="0 0 {art.width} {HEIGHT}"
		width={art.width}
		height={HEIGHT}
		role="img"
		aria-label="Sheet music for this motif"
	>
		<!-- staff -->
		{#each { length: 5 } as _, i (i)}
			<line class="staff" x1="6" y1={TOP + i * GAP} x2={art.width - 6} y2={TOP + i * GAP} />
		{/each}

		<!-- clef -->
		{#if art.clef === 'treble'}
			<text class="clef" x="10" y={BOTTOM + 3} font-size="46">𝄞</text>
		{:else}
			<text class="clef" x="10" y={MIDDLE + 3.5} font-size="34">𝄢</text>
		{/if}

		<!-- time signature -->
		{#if motif.meter}
			<text class="tsig" x="56" y={TOP + 14}>{motif.meter}</text>
			<text class="tsig" x="56" y={TOP + 30}>4</text>
		{/if}

		<!-- symbols -->
		{#each art.syms as s, i (i)}
			{#if s.kind === 'bar'}
				<line class="bar" x1={s.x} y1={TOP} x2={s.x} y2={BOTTOM} />
			{:else if s.kind === 'rest'}
				{#if s.base === 'w'}
					<rect class="head" x={s.x - 5} y={TOP + GAP} width="10" height="3.6" />
				{:else if s.base === 'h'}
					<rect class="head" x={s.x - 5} y={MIDDLE - 3.6} width="10" height="3.6" />
				{:else if s.base === 'q'}
					<path class="rest" d={quarterRestPath(s.x)} />
				{:else}
					<circle class="head" cx={s.x + 2} cy={TOP + 14.5} r="2" />
					<path class="rest" d={eighthRestPath(s.x, s.base === 's')} />
				{/if}
				{#each { length: s.dots } as _, di (di)}
					<circle class="head" cx={s.x + 9 + di * 5} cy={MIDDLE - 4} r="1.8" />
				{/each}
			{:else}
				{#each s.ledger as ly (ly)}
					<line class="staff ledger" x1={s.x - 8} y1={ly} x2={s.x + 8} y2={ly} />
				{/each}
				{#if s.acc}
					<text class="acc" x={s.x - 15} y={s.y + 3.5}>{s.acc}</text>
				{/if}
				{#if s.base === 'w'}
					<ellipse class="hollow" cx={s.x} cy={s.y} rx="5.8" ry="3.6" />
				{:else if s.base === 'h'}
					<ellipse
						class="hollow"
						cx={s.x}
						cy={s.y}
						rx="4.8"
						ry="3.4"
						transform="rotate(-18 {s.x} {s.y})"
					/>
					<path class="stem" d={stemPath(s)} />
				{:else}
					<ellipse
						class="head"
						cx={s.x}
						cy={s.y}
						rx="4.6"
						ry="3.4"
						transform="rotate(-18 {s.x} {s.y})"
					/>
					<path class="stem" d={stemPath(s)} />
					{#each flagPaths(s) as fp (fp)}
						<path class="flag" d={fp} />
					{/each}
				{/if}
				{#each { length: s.dots } as _, di (di)}
					<circle class="head" cx={s.x + 9 + di * 5} cy={dotY(s)} r="1.8" />
				{/each}
				{#if s.triplet}
					<text class="trip" x={s.x + (s.up ? 4 : -4)} y={s.up ? s.y - 31 : s.y + 37}>3</text>
				{/if}
			{/if}
		{/each}

		<!-- ties -->
		{#each art.ties as t, i (i)}
			<path class="tie" d={tiePath(t)} />
		{/each}
	</svg>
</div>

<style>
	.sheet {
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
		color: var(--fg, currentColor);
	}

	svg {
		display: block;
	}

	.staff {
		stroke: currentColor;
		stroke-width: 1;
		opacity: 0.26;
	}

	.staff.ledger {
		opacity: 0.4;
	}

	.bar {
		stroke: currentColor;
		stroke-width: 1;
		opacity: 0.35;
	}

	.clef {
		fill: var(--gold, currentColor);
		opacity: 0.9;
	}

	.tsig {
		fill: currentColor;
		opacity: 0.75;
		font-family: var(--serif, Georgia, serif);
		font-size: 15px;
		font-weight: 700;
		text-anchor: middle;
	}

	.head {
		fill: currentColor;
		opacity: 0.92;
	}

	.hollow {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		opacity: 0.92;
	}

	.stem {
		stroke: currentColor;
		stroke-width: 1.2;
		opacity: 0.92;
		fill: none;
	}

	.flag {
		stroke: currentColor;
		stroke-width: 1.4;
		fill: none;
		opacity: 0.92;
	}

	.rest {
		stroke: currentColor;
		stroke-width: 1.5;
		fill: none;
		opacity: 0.8;
	}

	.tie {
		stroke: currentColor;
		stroke-width: 1.1;
		fill: none;
		opacity: 0.7;
	}

	.acc {
		fill: currentColor;
		opacity: 0.85;
		font-size: 11px;
		text-anchor: middle;
	}

	.trip {
		fill: currentColor;
		opacity: 0.7;
		font-size: 9px;
		font-style: italic;
		text-anchor: middle;
	}
</style>
