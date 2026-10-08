<script module lang="ts">
	import { CylinderGeometry, PlaneGeometry, SphereGeometry, SRGBColorSpace, TextureLoader, type Texture } from 'three';

	/** One pole, finial and cloth shape for every flag on every field; each flag scales them. */
	const poleGeo = new CylinderGeometry(0.5, 0.5, 1, 6).translate(0, 0.5, 0);
	const finialGeo = new SphereGeometry(1, 8, 6);
	/** A unit cloth hung from its left edge, rippling more towards the free end. */
	const clothGeo = (() => {
		const g = new PlaneGeometry(1, 1, 12, 1).translate(0.5, 0, 0);
		const p = g.attributes.position;
		for (let i = 0; i < p.count; i++) {
			const x = p.getX(i);
			p.setZ(i, Math.sin(x * Math.PI * 1.7) * 0.07 * x);
			p.setY(i, p.getY(i) - x * 0.06);
		}
		g.computeVertexNormals();
		return g;
	})();

	/** Flag rasters, loaded once and shared by every battle canvas (seven small files in all). */
	const textures = new Map<string, { tex: Texture; ready: Promise<void> }>();
	function flagTex(url: string) {
		let hit = textures.get(url);
		if (!hit) {
			let done = () => {};
			const ready = new Promise<void>((r) => (done = r));
			const tex = new TextureLoader().load(url, () => done(), undefined, () => done());
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 4;
			hit = { tex, ready };
			textures.set(url, hit);
		}
		return hit;
	}
</script>

<script lang="ts">
	/**
	 * A flag over a fortress, gate, camp or mound on the 3D field, flying the banner of
	 * whoever holds it this phase. When the place changes hands the cloth runs down the
	 * pole, swaps, and runs back up.
	 */
	import { T, useThrelte } from '@threlte/core';
	import { DoubleSide } from 'three';
	import { Tween } from 'svelte/motion';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { flagTexture, type Banner } from '$lib/banners';
	import { getKit, type Vec3 } from '../../kit.svelte';

	let { at, banner, big = false }: { at: Vec3; banner: Banner | null; big?: boolean } = $props();

	const kit = getKit();
	const { invalidate } = useThrelte();

	const pole = $derived(big ? 0.58 : 0.46);
	const cloth = $derived(big ? 0.4 : 0.31);

	/** The banner on the pole right now; it trails `banner` by one lowering. */
	let shown = $state<Banner | null>(null);
	const hoist = new Tween(1);

	$effect(() => {
		const next = banner;
		if (shown?.key === next?.key) return;
		if (!shown || !next || !kit.active || kit.instant) {
			shown = next;
			hoist.set(1, { duration: 0 });
			return;
		}
		let gone = false;
		hoist.set(0, { duration: 380, easing: cubicIn }).then(() => {
			if (gone) return;
			shown = next;
			hoist.set(1, { duration: 720, delay: 120, easing: cubicOut });
		});
		return () => (gone = true);
	});

	const art = $derived(shown?.src ? flagTex(flagTexture(shown.src)) : null);
	$effect(() => {
		const t = art;
		if (!t) return;
		let live = true;
		t.ready.then(() => live && invalidate());
		return () => (live = false);
	});

	$effect(() => {
		void hoist.current;
		void at;
		invalidate();
	});

	const h = $derived(cloth * (2 / 3));
	/** The cloth's top edge slides from the finial to just above the ground. */
	const clothY = $derived(at[1] + pole - 0.012 - h / 2 - (1 - hoist.current) * (pole - h - 0.02));
</script>

{#if shown}
	<T.Mesh geometry={poleGeo} position={at} scale={[0.021, pole, 0.021]} castShadow>
		<T.MeshStandardMaterial color="#6b4f2c" roughness={0.8} />
	</T.Mesh>
	<T.Mesh geometry={finialGeo} position={[at[0], at[1] + pole + 0.012, at[2]]} scale={0.026}>
		<T.MeshStandardMaterial color="#e8c36a" metalness={0.6} roughness={0.35} />
	</T.Mesh>
	<T.Mesh
		geometry={clothGeo}
		position={[at[0] + 0.01, clothY, at[2]]}
		scale={[cloth * (0.3 + 0.7 * hoist.current), h, cloth]}
		visible={hoist.current > 0.02}
		castShadow
	>
		{#if art}
			<T.MeshStandardMaterial
				map={art.tex}
				emissiveMap={art.tex}
				emissive="#ffffff"
				emissiveIntensity={0.35}
				side={DoubleSide}
				roughness={0.85}
			/>
		{:else}
			<T.MeshStandardMaterial color={shown.color} emissive={shown.color} emissiveIntensity={0.25} side={DoubleSide} roughness={0.85} />
		{/if}
	</T.Mesh>
{/if}
