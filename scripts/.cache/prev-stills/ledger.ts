/**
 * Shared reading of a ledger of claims (LedgerData): every source as a column,
 * every claim parsed for its number so it can count up, and the rows where the
 * records disagree flagged with their highest and lowest figure. Drawn as a full
 * table by CasualtyLedger and as a strip under a battle map by LedgerStrip.
 */
import type { Attachment } from 'svelte/attachments';
import type { LedgerData } from '$lib/story';
import { onceInView, prefersReducedMotion } from '$lib/inView';

export type LedgerRow = LedgerData['rows'][number];

export type Claim = {
	source: string;
	raw: string;
	note?: string;
	n: number | null;
	pre: string;
	post: string;
	commas: boolean;
	decimals: number;
};

export type ReadRow = {
	row: LedgerRow;
	/** One cell per source column, null where that record gives no figure. */
	cells: (Claim | null)[];
	hi: number | null;
	lo: number | null;
	disputed: boolean;
};

const COUNT_MS = 1300;
/** Thousands groups only, so a comma after the figure ("30,380, and…") stays in the text. */
const NUM = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/;

/** Split a claim around its first number ("1,133,800 (proclaimed…)" → pre, 1133800, post). */
export function parseClaim(source: string, raw: string, note?: string): Claim {
	const m = raw.match(NUM);
	if (!m || m.index === undefined) return { source, raw, note, n: null, pre: raw, post: '', commas: false, decimals: 0 };
	const digits = m[0];
	return {
		source,
		raw,
		note,
		n: Number(digits.replace(/,/g, '')),
		pre: raw.slice(0, m.index),
		post: raw.slice(m.index + digits.length),
		commas: digits.includes(','),
		decimals: digits.split('.')[1]?.length ?? 0
	};
}

/** The claim with its number counted `t` (0–1) of the way up, formatted as written. */
export function shownClaim(c: Claim, t: number): string {
	if (c.n == null) return c.raw;
	const v = c.n * t;
	const text = c.commas
		? v.toLocaleString('en-US', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals })
		: v.toFixed(c.decimals);
	return c.pre + text + c.post;
}

/** Every source cited in any row, in order of first appearance. */
export function ledgerSources(data: LedgerData): string[] {
	const out: string[] = [];
	for (const row of data.rows) for (const v of row.values) if (!out.includes(v.source)) out.push(v.source);
	return out;
}

export function readLedger(data: LedgerData, sources = ledgerSources(data)): ReadRow[] {
	return data.rows.map((row) => {
		const cells = sources.map((s) => {
			const v = row.values.find((x) => x.source === s);
			return v ? parseClaim(v.source, v.value, v.note) : null;
		});
		const nums = cells.flatMap((c) => (c?.n == null ? [] : [c.n]));
		const hi = nums.length ? Math.max(...nums) : null;
		const lo = nums.length ? Math.min(...nums) : null;
		return { row, cells, hi, lo, disputed: new Set(nums).size > 1 };
	});
}

/** Highest / lowest claim in a disputed row — the cells that get coloured. */
export function claimRank(r: ReadRow, c: Claim | null): 'hi' | 'lo' | null {
	if (!r.disputed || c?.n == null) return null;
	return c.n === r.hi ? 'hi' : c.n === r.lo ? 'lo' : null;
}

/**
 * Attachment: the first time the ledger scrolls in, call `start`, then report
 * an eased 0→1 count-up through `step` (straight to 1 under reduced motion).
 */
export function countUp(step: (t: number) => void, start?: () => void): Attachment<HTMLElement> {
	return onceInView(
		() => {
			start?.();
			if (prefersReducedMotion()) {
				step(1);
				return;
			}
			let frame = 0;
			const t0 = performance.now();
			const tick = (now: number) => {
				const k = Math.min(1, (now - t0) / COUNT_MS);
				step(1 - Math.pow(1 - k, 3));
				if (k < 1) frame = requestAnimationFrame(tick);
			};
			frame = requestAnimationFrame(tick);
			return () => cancelAnimationFrame(frame);
		},
		{ threshold: 0.3 }
	);
}
