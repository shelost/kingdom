<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { prepare, render } from '$lib/film/paper/render';
	import { PAPER, type PaperId } from '$lib/film/paper/scenes';

	let { scene, t, k }: { scene: PaperId; t: number; k: number } = $props();

	let el: HTMLCanvasElement | null = null;
	let ctx = $state.raw<CanvasRenderingContext2D | null>(null);
	let cw = $state(0);
	let ch = $state(0);

	const grab: Attachment<HTMLCanvasElement> = (node) => {
		el = node;
		ctx = node.getContext('2d');
		return () => {
			el = null;
			ctx = null;
		};
	};

	/** Cut the sheets and bake their shadows once per scene. */
	const ready = $derived(ctx ? prepare(PAPER[scene], ctx) : null);

	$effect(() => {
		if (!ctx || !ready || !el || !cw || !ch) return;
		const scale = Math.min(Math.min(2, window.devicePixelRatio || 1), 2400 / cw);
		const w = Math.round(cw * scale);
		const h = Math.round(ch * scale);
		if (el.width !== w) el.width = w;
		if (el.height !== h) el.height = h;
		render(ctx, ready, w, h, t, k);
	});
</script>

<div class="paper" data-scene={scene} bind:clientWidth={cw} bind:clientHeight={ch}>
	<canvas {@attach grab}></canvas>
</div>

<style>
	.paper {
		position: absolute;
		inset: 0;
		background: #05070d;
	}
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
