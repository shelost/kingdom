<script lang="ts">
	/**
	 * The lazy WebGL half of a diagram: a transparent, render-on-demand Threlte
	 * canvas (dpr capped at 2) around the rig and one scene. Loaded by dynamic
	 * import from KitStage, so three.js never ships with the story bundle.
	 */
	import { Canvas } from '@threlte/core';
	import { NoToneMapping, PCFShadowMap, WebGLRenderer } from 'three';
	import KitRig from './KitRig.svelte';
	import type { CanvasProps } from './kit.svelte';

	let { scene: Scene, sceneProps, ...rig }: CanvasProps = $props();

	let renderer: WebGLRenderer | undefined;
	let layer = $state<HTMLElement>();

	function createRenderer(canvas: HTMLCanvasElement) {
		renderer = new WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'low-power'
		});
		return renderer;
	}

	// Threlte disposes the renderer but leaves the context to GC; browsers cap
	// live contexts, so hand it back the moment the diagram scrolls far away.
	$effect(() => {
		return () => {
			const r = renderer;
			queueMicrotask(() => r?.forceContextLoss());
		};
	});
</script>

<div class="kit-scene">
	<Canvas
		{createRenderer}
		renderMode="on-demand"
		dpr={[1, 2]}
		shadows={PCFShadowMap}
		toneMapping={NoToneMapping}
	>
		<KitRig {...rig} {layer}>
			<Scene {...sceneProps} />
		</KitRig>
	</Canvas>
	<div class="kit-layer" bind:this={layer}></div>
</div>

<style>
	.kit-scene,
	.kit-layer {
		position: absolute;
		inset: 0;
	}

	.kit-layer {
		overflow: hidden;
		pointer-events: none;
	}
</style>
