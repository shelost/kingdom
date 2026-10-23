<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import {
		CanvasTexture,
		Color,
		Group,
		MeshStandardMaterial,
		SRGBColorSpace,
		Texture,
		TextureLoader
	} from 'three';
	import { spineInk, type BookVolume } from '$lib/books';
	import { spineColor } from '$lib/spine.svelte';

	let {
		volume,
		cover,
		featured = false,
		dimmed = false,
		ko = false,
		onhover,
		onleave,
		onopen
	}: {
		volume: BookVolume;
		cover?: string;
		featured?: boolean;
		dimmed?: boolean;
		ko?: boolean;
		onhover: (id: string) => void;
		onleave: (id: string) => void;
		onopen: (id: string) => void;
	} = $props();

	const BOARD = 0.0028;
	const PAGE_IN = 0.006;
	const w = $derived(volume.w);
	const h = $derived(volume.h);
	const d = $derived(volume.d);

	const cloth = new Color('#000000');
	$effect(() => {
		cloth.set(spineColor(volume.id));
	});
	const paper = new MeshStandardMaterial({ color: '#efe6d4', roughness: 0.92, metalness: 0.02 });
	const coverMat = new MeshStandardMaterial({ color: cloth, roughness: 0.42, metalness: 0.04 });
	const spineMat = new MeshStandardMaterial({
		color: '#ffffff',
		roughness: 0.5,
		metalness: 0.04,
		emissive: cloth,
		emissiveIntensity: 0.08
	});
	const backMat = new MeshStandardMaterial({ color: cloth, roughness: 0.55, metalness: 0.05 });

	let bobGroup = $state.raw<Group | undefined>(undefined);
	let phase = Math.random() * Math.PI * 2;

	useTask(
		(dt) => {
			if (!bobGroup) return;
			if (!featured) {
				bobGroup.position.y += (0 - bobGroup.position.y) * Math.min(1, dt * 8);
				return;
			}
			phase += dt * 1.15;
			bobGroup.position.y = Math.sin(phase) * 0.007;
		},
		{ autoInvalidate: false }
	);

	function paintSpine(v: BookVolume, hex: string, korean: boolean): CanvasTexture {
		const c = document.createElement('canvas');
		c.width = 96;
		c.height = 512;
		const ctx = c.getContext('2d');
		if (!ctx) return new CanvasTexture(c);
		ctx.fillStyle = hex;
		ctx.fillRect(0, 0, 96, 512);
		ctx.fillStyle = 'rgba(0,0,0,0.18)';
		ctx.fillRect(0, 0, 7, 512);
		ctx.fillRect(89, 0, 7, 512);
		const ink = spineInk(hex);
		ctx.fillStyle = ink;
		ctx.textAlign = 'center';
		ctx.font = korean
			? '700 34px "Black Han Sans", "Noto Sans KR", sans-serif'
			: '700 28px Inter, "Noto Sans KR", sans-serif';
		ctx.fillText(String(v.number).padStart(2, '0'), 48, 64);
		const label = (korean ? v.ko || v.title : v.title).replace(/\s+/g, ' ');
		const shown = label.length > 12 ? `${label.slice(0, 12)}` : label;
		ctx.save();
		ctx.translate(48, 308);
		ctx.rotate(-Math.PI / 2);
		ctx.font = korean
			? `${shown.length > 8 ? 600 : 700} ${shown.length > 8 ? 22 : 28}px "Black Han Sans", "Noto Sans KR", sans-serif`
			: `${shown.length > 8 ? 500 : 600} ${shown.length > 8 ? 20 : 24}px Platypi, "Noto Serif KR", serif`;
		ctx.fillText(shown, 0, 8);
		ctx.restore();
		const tex = new CanvasTexture(c);
		tex.colorSpace = SRGBColorSpace;
		tex.anisotropy = 8;
		return tex;
	}

	$effect(() => {
		const v = volume;
		const hex = spineColor(v.id);
		const korean = ko;
		let cancelled = false;
		const apply = () => {
			if (cancelled) return;
			const tex = paintSpine(v, hex, korean);
			const prev = spineMat.map;
			spineMat.map = tex;
			spineMat.needsUpdate = true;
			if (prev && prev !== tex) prev.dispose();
		};
		apply();
		void Promise.all([
			document.fonts.load('600 24px Platypi'),
			document.fonts.load('700 28px Inter'),
			document.fonts.load('700 28px "Black Han Sans"')
		]).then(apply);
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		const src = cover;
		if (!src) {
			coverMat.map = null;
			coverMat.color.copy(cloth);
			coverMat.needsUpdate = true;
			return;
		}
		let disposed = false;
		let loaded: Texture | undefined;
		new TextureLoader().load(src, (tex) => {
			if (disposed) {
				tex.dispose();
				return;
			}
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 8;
			loaded = tex;
			coverMat.map = tex;
			coverMat.color.set('#ffffff');
			coverMat.needsUpdate = true;
		});
		return () => {
			disposed = true;
			loaded?.dispose();
			if (coverMat.map === loaded) coverMat.map = null;
		};
	});

	$effect(() => {
		const mute = dimmed ? 0.45 : 1;
		paper.color.setRGB(0.93 * mute, 0.9 * mute, 0.83 * mute);
		backMat.color.copy(cloth).multiplyScalar(mute);
		coverMat.opacity = dimmed ? 0.72 : 1;
		coverMat.transparent = dimmed;
		spineMat.opacity = dimmed ? 0.72 : 1;
		spineMat.transparent = dimmed;
		backMat.opacity = dimmed ? 0.72 : 1;
		backMat.transparent = dimmed;
	});

	$effect(() => {
		return () => {
			paper.dispose();
			coverMat.dispose();
			spineMat.dispose();
			backMat.dispose();
		};
	});

	let down = { x: 0, y: 0 };

	function pointerdown(e: { nativeEvent?: PointerEvent }) {
		const n = e.nativeEvent;
		if (!n) return;
		down = { x: n.clientX, y: n.clientY };
	}

	function click(e: { nativeEvent?: PointerEvent; stopPropagation?: () => void }) {
		e.stopPropagation?.();
		const n = e.nativeEvent;
		if (n) {
			const dx = n.clientX - down.x;
			const dy = n.clientY - down.y;
			if (dx * dx + dy * dy > 36) return;
		}
		onopen(volume.id);
	}
</script>

<T.Group
	oncreate={(ref) => {
		bobGroup = ref;
	}}
>
	<T.Mesh
		castShadow
		receiveShadow
		material={paper}
		onpointerenter={() => onhover(volume.id)}
		onpointerleave={() => onleave(volume.id)}
		onpointerdown={pointerdown}
		onclick={click}
	>
		<T.BoxGeometry args={[w - PAGE_IN, h - PAGE_IN, d]} />
	</T.Mesh>
	<T.Mesh
		castShadow
		receiveShadow
		position={[0, 0, d / 2 + BOARD / 2]}
		material={coverMat}
		onpointerenter={() => onhover(volume.id)}
		onpointerleave={() => onleave(volume.id)}
		onpointerdown={pointerdown}
		onclick={click}
	>
		<T.BoxGeometry args={[w, h, BOARD]} />
	</T.Mesh>
	<T.Mesh
		castShadow
		receiveShadow
		position={[0, 0, -(d / 2 + BOARD / 2)]}
		material={backMat}
		onpointerenter={() => onhover(volume.id)}
		onpointerleave={() => onleave(volume.id)}
		onpointerdown={pointerdown}
		onclick={click}
	>
		<T.BoxGeometry args={[w, h, BOARD]} />
	</T.Mesh>
	<T.Mesh
		castShadow
		receiveShadow
		position={[-(w / 2 + BOARD / 2), 0, 0]}
		rotation.y={Math.PI / 2}
		material={spineMat}
		onpointerenter={() => onhover(volume.id)}
		onpointerleave={() => onleave(volume.id)}
		onpointerdown={pointerdown}
		onclick={click}
	>
		<T.BoxGeometry args={[d, h, BOARD]} />
	</T.Mesh>
</T.Group>
