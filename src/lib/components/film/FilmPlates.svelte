<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { clipOf } from '$lib/film/clips';
	import type { PlateShow } from '$lib/film/present';
	import type { PlateMove } from '$lib/film/types';

	let { plates, speed, paused }: { plates: PlateShow[]; speed: number; paused: boolean } = $props();

	/** Drift across a still so a held picture is never a frozen slide. */
	function ken(move: PlateMove, k: number): string {
		const s = move === 'pull' ? 1.16 - 0.12 * k : move === 'still' ? 1.04 + 0.04 * k : 1.04 + 0.12 * k;
		const x = move === 'left' ? -6 * k : move === 'right' ? -6 + 6 * k : 0;
		const y = move === 'rise' ? 4 - 8 * k : 0;
		return `translate3d(${x}%, ${y}%, 0) scale(${s})`;
	}

	function rate(spd: number, hold: boolean): Attachment<HTMLVideoElement> {
		return (node) => {
			node.playbackRate = spd;
			if (hold) node.pause();
			else void node.play().catch(() => {});
		};
	}
</script>

{#each plates as plate (plate.key)}
	{@const clip = clipOf(plate.id)}
	<div class="plate" style:opacity={plate.opacity} style:transform={ken(plate.move, plate.k)}>
		{#if clip}
			<video src={clip} muted loop playsinline autoplay {@attach rate(speed, paused)}></video>
		{:else}
			<img src={plate.src} alt="" />
		{/if}
	</div>
{/each}

<style>
	.plate {
		position: absolute;
		inset: -8%;
		transition: opacity 0.15s linear;
	}
	img,
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
