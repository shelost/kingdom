<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
	import type { StageSiteId } from '$lib/stage/sites';
	import type { Label, LightPreset, Quality, StageApi, View } from '$lib/stage/build';
	import GroundsScene from './GroundsScene.svelte';

	let {
		site,
		year,
		light,
		quality,
		view,
		labels,
		onbusy,
		onbuilt,
		onapi
	}: {
		site: StageSiteId;
		year: number;
		light: LightPreset;
		quality: Quality;
		view: string;
		labels: boolean;
		onbusy?: (busy: boolean) => void;
		onbuilt?: (info: { views: View[]; labels: Label[]; ms: number } | null) => void;
		onapi?: (api: StageApi) => void;
	} = $props();

	function createRenderer(canvas: HTMLCanvasElement) {
		const renderer = new WebGLRenderer({
			canvas,
			antialias: false,
			alpha: false,
			powerPreference: 'high-performance'
		});
		renderer.outputColorSpace = SRGBColorSpace;
		renderer.setClearColor('#cfdbe2');
		return renderer;
	}
</script>

<div class="host">
	<Canvas {createRenderer} renderMode="always" shadows={PCFShadowMap} toneMapping={ACESFilmicToneMapping} dpr={quality === 'cinematic' ? [1, 2] : [1, 1.25]}>
		<GroundsScene {site} {year} {light} {quality} {view} {labels} {onbusy} {onbuilt} {onapi} />
	</Canvas>
</div>

<style>
	.host {
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.host :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
