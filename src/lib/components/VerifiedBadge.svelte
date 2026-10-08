<script lang="ts">
	/**
	 * The X checkmark: a scalloped seal in the badge colour with a white tick.
	 * Gold for a monarch, purple for Sacred Bone, blue for True Bone and noble
	 * houses, grey for officials.
	 */
	import type { Badge } from '$lib/tweet';

	let { badge }: { badge: NonNullable<Badge> } = $props();

	const LABEL: Record<NonNullable<Badge>, string> = {
		gold: 'Verified monarch',
		purple: 'Verified Sacred Bone',
		blue: 'Verified',
		grey: 'Verified official'
	};
</script>

<svg class="badge {badge}" viewBox="0 0 24 24" role="img" aria-label={LABEL[badge]}>
	<path
		class="seal"
		d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
	/>
	<path class="tick" d="M10.54 16.2 6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z" />
</svg>

<style>
	.badge {
		flex: none;
		width: 1.15em;
		height: 1.15em;
	}

	.tick {
		fill: #fff;
	}

	.blue .seal {
		fill: #1d9bf0;
	}

	.gold .seal {
		fill: #e2b33c;
	}

	.purple .seal {
		fill: #8b4fd8;
	}

	.grey .seal {
		fill: #829aab;
	}
</style>
