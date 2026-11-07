<script lang="ts">
	import { chapters } from '$lib/story';

	let { arcIndex }: { arcIndex: number } = $props();

	function startYear(range: string | undefined): number | null {
		const m = range?.match(/-?\d+/);
		return m ? Number(m[0]) : null;
	}

	let marks = $derived(
		chapters
			.map((ch, i) => ({ i, y: startYear(ch.range) }))
			.filter((m): m is { i: number; y: number } => m.y !== null)
	);
	let span = $derived.by(() => {
		if (!marks.length) return { min: 0, max: 1 };
		const ys = marks.map((m) => m.y);
		return { min: Math.min(...ys), max: Math.max(...ys) };
	});

	function pct(y: number) {
		const d = span.max - span.min || 1;
		return ((y - span.min) / d) * 100;
	}

	let here = $derived(marks.find((m) => m.i === arcIndex));
	let prev = $derived(marks.filter((m) => m.i < arcIndex).at(-1));
	let to = $derived(here ? pct(here.y) : 0);
	let from = $derived(prev ? pct(prev.y) : Math.max(0, to - 14));
</script>

{#if here}
	<div class="arc-rail" style:--from="{from}%" style:--to="{to}%" aria-hidden="true">
		<span class="line"></span>
		{#each marks as m (m.i)}
			<span class={['tick', { now: m.i === arcIndex }]} style:left="{pct(m.y)}%"></span>
		{/each}
		<span class="head"></span>
	</div>
{/if}

<style lang="scss">
	.arc-rail {
		position: relative;
		width: min(34rem, 70vw);
		height: 1.6rem;
		margin: 0.35rem auto 0.7rem;
	}

	.line {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 1px;
		background: color-mix(in srgb, var(--gold) 55%, var(--fg-faint));
	}

	.tick {
		position: absolute;
		top: 50%;
		width: 1px;
		height: 0.45rem;
		background: color-mix(in srgb, var(--fg) 70%, transparent);
		transform: translate(-50%, -50%);
		&.now {
			height: 0.7rem;
			background: var(--gold);
		}
	}

	.head {
		position: absolute;
		top: 50%;
		left: var(--to);
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: var(--gold);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--gold) 22%, transparent);
		transform: translate(-50%, -50%);
		animation: travel 1.15s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@keyframes travel {
		from {
			left: var(--from);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.head {
			animation: none;
		}
	}
</style>
