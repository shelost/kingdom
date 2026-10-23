<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { ACESFilmicToneMapping, PCFSoftShadowMap, WebGLRenderer } from 'three';
	import type { BookMode, PointerNdc } from '$lib/books';
	import BooksScene from './BooksScene.svelte';

	let {
		hovered,
		selected = null,
		reduced = false,
		narrow = false,
		covers,
		mode = 'shelf',
		ko = false,
		onhover,
		onopen,
		onback
	}: {
		hovered: string | null;
		selected?: string | null;
		reduced?: boolean;
		narrow?: boolean;
		covers: Record<string, string>;
		mode?: BookMode;
		ko?: boolean;
		onhover: (id: string | null) => void;
		onopen: (id: string) => void;
		onback: () => void;
	} = $props();

	let renderer: WebGLRenderer | undefined;
	let pointer = $state<PointerNdc>({ x: 0, y: 0 });
	let host: HTMLDivElement | undefined;

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

	function move(e: PointerEvent) {
		if (!host) return;
		const r = host.getBoundingClientRect();
		const w = r.width || 1;
		const h = r.height || 1;
		pointer = {
			x: ((e.clientX - r.left) / w) * 2 - 1,
			y: -((e.clientY - r.top) / h) * 2 + 1
		};
	}

	function leave() {
		pointer = { x: 0, y: 0 };
		if (!selected) onhover(null);
	}
</script>

<div
	class="books-gl"
	bind:this={host}
	onpointermove={move}
	onpointerleave={leave}
	role="presentation"
>
	<Canvas
		{createRenderer}
		renderMode="always"
		dpr={narrow ? [1, 1.25] : [1, 2]}
		shadows={PCFSoftShadowMap}
		toneMapping={ACESFilmicToneMapping}
	>
		<BooksScene {hovered} {selected} {reduced} {narrow} {covers} {pointer} {mode} {ko} {onhover} {onopen} {onback} />
	</Canvas>
</div>

<style>
	.books-gl {
		position: absolute;
		inset: 0;
	}
</style>
