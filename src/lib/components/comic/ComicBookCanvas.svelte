<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { NoToneMapping, PCFSoftShadowMap, WebGLRenderer } from 'three';
	import ComicBookScene from './ComicBookScene.svelte';

	let { angle = 0 }: { angle: number } = $props();

	let renderer: WebGLRenderer | undefined;

	function createRenderer(canvas: HTMLCanvasElement) {
		renderer = new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance'
		});
		return renderer;
	}

	$effect(() => {
		return () => {
			const r = renderer;
			queueMicrotask(() => r?.forceContextLoss());
		};
	});
</script>

<div class="gl">
	<Canvas
		{createRenderer}
		renderMode="always"
		dpr={[1, 1.75]}
		shadows={PCFSoftShadowMap}
		toneMapping={NoToneMapping}
	>
		<ComicBookScene {angle} />
	</Canvas>
</div>

<style>
	.gl {
		position: absolute;
		inset: 0;
	}
</style>
