<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
	import type { StageSiteId } from '$lib/stage/sites';
	import { DEFAULT_LAYERS, type Label, type Layers, type StageApi, type View } from '$lib/stage/build';
	import type { StageStyle } from '$lib/stage/post';
	import type { StageQuality } from '$lib/stage/quality';
	import type { BattleFit } from '$lib/stage/battle3d';
	import GroundsScene from './GroundsScene.svelte';

	let {
		site,
		year,
		hour,
		view,
		labels,
		style = 'natural',
		people = true,
		boats = true,
		layers = DEFAULT_LAYERS,
		quality = 'medium',
		battle = null,
		phase = 0,
		fit,
		onbusy,
		onbuilt,
		onapi
	}: {
		site: StageSiteId;
		year: number;
		hour: number;
		view: string;
		labels: boolean;
		style?: StageStyle;
		people?: boolean;
		boats?: boolean;
		layers?: Layers;
		quality?: StageQuality;
		battle?: string | null;
		phase?: number;
		fit?: BattleFit;
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
	<Canvas {createRenderer} renderMode="always" shadows={PCFShadowMap} toneMapping={ACESFilmicToneMapping} dpr={[1, 2]}>
		<GroundsScene {site} {year} {hour} {view} {labels} {style} {people} {boats} {layers} {quality} {battle} {phase} {fit} {onbusy} {onbuilt} {onapi} />
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
