<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { clipOf } from '$lib/film/clips';
	import type { PlateShow } from '$lib/film/present';
	import type { PlateMove } from '$lib/film/types';
	import FilmPaper from './FilmPaper.svelte';

	let { plates, speed, paused }: { plates: PlateShow[]; speed: number; paused: boolean } = $props();

	/** Drift across a still so a held picture is never a frozen slide. */
	function ken(move: PlateMove, k: number): string {
		if (move === 'orbit') {
			const yaw = -9 + 18 * k;
			const pitch = 5 - 8 * k;
			return `perspective(900px) translate3d(${-3 + 6 * k}%, ${2 - 4 * k}%, 0) rotateY(${yaw}deg) rotateX(${pitch}deg) scale(1.14)`;
		}
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
	<div
		class={['plate', { box: plate.paper }]}
		style:opacity={plate.opacity}
		style:transform={plate.paper ? undefined : ken(plate.move, plate.k)}
	>
		{#if plate.paper}
			<FilmPaper scene={plate.paper} t={plate.t} k={plate.k} />
		{:else if clip}
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
	.box {
		inset: 0;
	}
	img,
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
