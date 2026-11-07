<script lang="ts">
	/**
	 * The known world around the relief: a topographic mesh painted by
	 * src/lib/cosmosLayer.ts, cosmological names over it, and a gold thread from the
	 * mountain at the head of the peninsula up to where heaven hangs.
	 */
	import { T, useThrelte } from '@threlte/core';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { CanvasTexture, DoubleSide, SRGBColorSpace } from 'three';
	import type { Relief } from '$lib/battleTerrain';
	import {
		COSMOS_FRAME,
		SAMHAN_GOLD_YEAR,
		SAMHAN_LINE,
		SKY_AT,
		SKY_HEIGHT,
		cosmosProject,
		type CosmosLayout,
		type CosmosScope
	} from '$lib/cosmos';
	import { SAMHAN_BOX, labelsAt, loadCosmos, paintCosmos, paintSamhanLine, type CosmosData } from '$lib/cosmosLayer';
	import { buildCosmosRelief, cosmosHeight, drapeGeometry, reliefGeometry, rimGeometry } from './cosmosGround';
	import CosmosName from './CosmosName.svelte';
	import { mapPalette, toMapWorld } from '$lib/mapTerrain';
	import { getKit, type Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';

	let {
		year,
		ko = false,
		scope,
		layout = 'circles',
		lift,
		show = true,
		mythLabels = true,
		skyBase,
		peninsula = null,
		rulers = false,
		labels = true
	}: {
		year: number;
		ko?: boolean;
		scope: CosmosScope;
		/** Halves of one circle, or 이승 and 저승 as two semi-attached circles. */
		layout?: CosmosLayout;
		/** World height of the relief's sea. */
		lift: number;
		/** The plane is up (it fades in and out). */
		show?: boolean;
		/** Name the myth band's realms (off when the realms are markers of their own). */
		mythLabels?: boolean;
		/** World height of the ground under heaven's thread. */
		skyBase: number;
		/** The Samhan sheet's real elevation, blended into the world mesh. */
		peninsula?: Relief | null;
		/** Each realm's ruler this year, in a pill under its name. */
		rulers?: boolean;
		/** Civilization and hell names. */
		labels?: boolean;
	} = $props();

	const kit = getKit();
	const { invalidate } = useThrelte();
	const pal = $derived(mapPalette(kit.palette.light));
	const F = COSMOS_FRAME;
	/** Fixed for the plane's life: a texture cannot change size once it is up. */
	const WIDTH = window.innerWidth >= 900 ? 4096 : 2048;

	let data = $state.raw<CosmosData | null>(null);
	$effect(() => {
		let gone = false;
		loadCosmos().then(
			(d) => {
				if (!gone) data = d;
			},
			() => {}
		);
		return () => {
			gone = true;
		};
	});

	const sheet = document.createElement('canvas');
	const texture = new CanvasTexture(sheet);
	texture.colorSpace = SRGBColorSpace;
	texture.anisotropy = 8;
	$effect(() => () => texture.dispose());

	let painted = $state(false);
	$effect(() => {
		if (!data) return;
		if (paintCosmos(sheet, data, year, pal, kit.palette.light, WIDTH, layout)) {
			texture.needsUpdate = true;
			painted = true;
			invalidate();
		}
	});

	const ground = $derived.by(() => {
		if (!data || scope !== 'cosmos') return null;
		const rel = buildCosmosRelief(data.land, layout, peninsula);
		const mesh = reliefGeometry(rel, layout);
		return { mesh, rim: rimGeometry(layout), gold: drapeGeometry(SAMHAN_BOX) };
	});
	$effect(() => {
		const g = ground;
		invalidate();
		return () => {
			g?.mesh.dispose();
			g?.rim.dispose();
			g?.gold?.dispose();
		};
	});

	const fade = new Tween(0, { duration: 700, easing: cubicInOut });
	$effect(() => {
		fade.set(show ? 1 : 0, kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		void fade.current;
		invalidate();
	});

	const [cx, cz] = toMapWorld(F.x + F.w / 2, F.y + F.h / 2);

	/** A sheet point on the relief, `up` above the land. Courts stay on the flat plane. */
	const onPlane = ([x, y]: [number, number], up = 0.04): Vec3 => {
		void ground;
		const [wx, wz] = toMapWorld(x, y);
		const h = scope === 'cosmos' ? cosmosHeight(x, y) : 0;
		return [wx, lift + h + up, wz];
	};

	const wide = $derived(scope !== 'samhan');
	const shown = $derived(labels ? labelsAt(data, year, scope, layout, mythLabels, rulers) : []);

	/* —— the gold line round Samhan, on the wide views only —— */
	const goldSheet = document.createElement('canvas');
	const goldTexture = new CanvasTexture(goldSheet);
	goldTexture.colorSpace = SRGBColorSpace;
	goldTexture.anisotropy = 8;
	$effect(() => () => goldTexture.dispose());
	let gilded = $state(false);
	$effect(() => {
		if (!data || scope === 'samhan') return;
		if (paintSamhanLine(goldSheet, data, SAMHAN_GOLD_YEAR, SAMHAN_LINE[scope], kit.palette.light)) {
			goldTexture.needsUpdate = true;
			gilded = true;
			invalidate();
		}
	});
	const gold = new Tween(0, { duration: 700, easing: cubicInOut });
	$effect(() => {
		gold.set(wide && show ? 1 : 0, kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		void gold.current;
		invalidate();
	});
	const [gx, gz] = toMapWorld(SAMHAN_BOX.x + SAMHAN_BOX.w / 2, SAMHAN_BOX.y + SAMHAN_BOX.h / 2);

	/* —— heaven's thread: thicker and taller the farther out the camera stands —— */
	const THREAD = { samhan: 0.01, sphere: 0.035, world: 0.06, cosmos: 0.09 } as const;
	const thread = new Tween<[number, number]>([SKY_HEIGHT.samhan, THREAD.samhan], { duration: 900, easing: cubicInOut });
	$effect(() => {
		thread.set([SKY_HEIGHT[scope], THREAD[scope]], kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		void thread.current;
		invalidate();
	});
	const [sx, sz] = (() => {
		const [x, y] = cosmosProject(...SKY_AT);
		return toMapWorld(x, y);
	})();
	const sky = $derived<Vec3>([sx, skyBase + thread.current[0], sz]);
</script>

{#if painted && show && scope !== 'samhan' && fade.current > 0.001}
	{#if scope === 'cosmos' && ground}
		<T.Mesh geometry={ground.mesh} position={[cx, lift, cz]} renderOrder={-1}>
			<T.MeshLambertMaterial map={texture} transparent opacity={fade.current} alphaTest={0.12} depthWrite side={DoubleSide} />
		</T.Mesh>
		<T.Mesh geometry={ground.rim} position={[cx, lift, cz]} renderOrder={-1}>
			<T.MeshLambertMaterial color={kit.palette.light ? '#8a7558' : '#2a2118'} transparent opacity={fade.current} side={DoubleSide} />
		</T.Mesh>
	{:else}
		<T.Mesh position={[cx, lift - 0.006, cz]} rotation.x={-Math.PI / 2} renderOrder={-1}>
			<T.PlaneGeometry args={[F.w / 50, F.h / 50]} />
			<T.MeshLambertMaterial map={texture} transparent opacity={fade.current} depthWrite={false} />
		</T.Mesh>
	{/if}
	<T.Mesh position={[sx, skyBase + thread.current[0] / 2, sz]} scale={[thread.current[1], thread.current[0], thread.current[1]]}>
		<T.CylinderGeometry args={[1, 1, 1, 8, 1, true]} />
		<T.MeshBasicMaterial color="#f2c14e" transparent opacity={0.5 * fade.current} depthWrite={false} toneMapped={false} />
	</T.Mesh>
{/if}

{#if gilded && gold.current > 0.001}
	{#if scope === 'cosmos' && ground?.gold}
		<T.Mesh geometry={ground.gold} position={[gx, lift, gz]} renderOrder={4}>
			<T.MeshBasicMaterial map={goldTexture} transparent opacity={gold.current} alphaTest={0.05} depthWrite={false} toneMapped={false} side={DoubleSide} />
		</T.Mesh>
	{:else}
		<T.Mesh position={[gx, lift + 0.004, gz]} rotation.x={-Math.PI / 2} renderOrder={4}>
			<T.PlaneGeometry args={[SAMHAN_BOX.w / 50, SAMHAN_BOX.h / 50]} />
			<T.MeshBasicMaterial map={goldTexture} transparent opacity={gold.current} depthWrite={false} depthTest={false} toneMapped={false} />
		</T.Mesh>
	{/if}
{/if}

{#each shown as l (l.key)}
	<KitLabel at={onPlane(l.xy, l.realm ? 3 : 0.04)} tone="note" size="lg" show={wide && show && !!data} moveDelay={0}>
		<CosmosName
			han={l.han}
			ko={l.ko}
			en={l.en}
			epithet={l.epithet}
			standing={l.standing}
			ruler={l.ruler}
			lines={l.lines}
			sea={l.sea}
			myth={l.myth}
			realm={l.realm}
			home={l.home}
			reach={l.protectorate}
			sub={l.sub}
			native={l.native ?? ''}
			icon={l.icon ?? ''}
			color={l.color}
			uiKo={ko}
		/>
	</KitLabel>
{/each}
