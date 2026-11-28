<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { FxField } from '$lib/film/fx';
	import type { Fx } from '$lib/film/types';

	let { fx, time }: { fx: Fx[]; time: number } = $props();

	/** Draw the field from the film clock. Wall-clock frames, film-clock steps, so a pause freezes the smoke. */
	const paint: Attachment<HTMLCanvasElement> = (node) => {
		const live = new FxField(node);
		const box = node.parentElement;
		const fit = () => {
			if (!box) return;
			const r = box.getBoundingClientRect();
			live.resize(r.width, r.height, window.devicePixelRatio || 1);
		};
		fit();
		const watch = new ResizeObserver(fit);
		if (box) watch.observe(box);
		let last = -1;
		let raf = 0;
		const loop = () => {
			const now = time;
			const raw = last < 0 ? 0.016 : now - last;
			const seek = raw < 0 || raw > 0.2;
			const dt = seek ? 0 : Math.min(0.05, Math.max(0, raw));
			last = now;
			live.set(fx);
			live.step(dt, seek);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			watch.disconnect();
			live.clear();
		};
	};
</script>

<canvas {@attach paint}></canvas>

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
