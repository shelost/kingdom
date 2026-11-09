<script lang="ts">
	/**
	 * The map's ground in every frame: the scope's relief field (worldRelief.ts) as a
	 * raised, walled sheet wearing the painted known world (cosmosLayer.ts), the
	 * cosmological names over it, and a gold thread from the mountain at the head of
	 * the peninsula up to where heaven hangs.
	 */
	import { T, useThrelte } from '@threlte/core';
	import { onDestroy, untrack } from 'svelte';
	import { fromStore } from 'svelte/store';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { AdditiveBlending, CanvasTexture, DoubleSide, SRGBColorSpace } from 'three';
	import {
		SAMHAN_GOLD_YEAR,
		SAMHAN_LINE,
		SKY_AT,
		SKY_HEIGHT,
		TAMLA_AT,
		cosmosProject,
		scopeFrame,
		setFishEye,
		type CosmosLayout,
		type CosmosScope,
		type FishEyeId
	} from '$lib/cosmos';
	import { samhanBox, labelsAt, paintCosmos, paintSamhanLine, paintWidth, uncrowded, type CosmosData, type CosmosShown } from '$lib/cosmosLayer';
	import { featherInset } from '$lib/mapLod';
	import { heightAt, reliefPaint, type ReliefField } from '$lib/worldRelief';
	import { drapeGeometry, fieldGeometry, wallGeometry, waterGeometry } from './reliefMesh';
	import CosmosName from './CosmosName.svelte';
	import { mapPalette, toMapWorld } from '$lib/mapTerrain';
	import { getKit, type Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import { openProfile } from '$lib/profiles.svelte';
	import { byId } from '$lib/people';
	import { PLACES } from '$lib/places';
	import { reading } from '$lib/reading.svelte';

	let {
		year,
		ko = false,
		scope,
		layout = 'circles',
		data,
		field,
		lift,
		skyBase,
		mythLabels = true,
		rulers = false,
		labels = true,
		rivers = true,
		quiet = false,
		fish = 'mid',
		terrain = true,
		washes = true,
		onwiki,
		inset = null,
		insetAlpha = 0
	}: {
		year: number;
		ko?: boolean;
		scope: CosmosScope;
		/** Halves of one circle, or 이승 and 저승 as two semi-attached circles. */
		layout?: CosmosLayout;
		data: CosmosData | null;
		/** The scope's ground; the sheet waits for it. */
		field: ReliefField | null;
		/** World height of sea level (the table's underside sits on the stage floor). */
		lift: number;
		/** World height of the ground under heaven's thread. */
		skyBase: number;
		/** Name the myth band's realms (off when the realms are markers of their own). */
		mythLabels?: boolean;
		/** Each realm's ruler this year, in a pill under its name. */
		rulers?: boolean;
		/** Civilization and hell names. */
		labels?: boolean;
		/** The peninsula frame's rivers. */
		rivers?: boolean;
		/** The Stage's picker: the washes step back so the lit sites read first. */
		quiet?: boolean;
		/** Fish-eye strength — changing it rebuilds the paint and ground. */
		fish?: FishEyeId;
		/** Relief tint, hillshade and the sea's surface; off, the sheet lies flat and plain. */
		terrain?: boolean;
		/** Civilization / Ten Peoples / Ten Hells colour washes. */
		washes?: boolean;
		/** A name or place opens the wiki. Falls back to the profile card. */
		onwiki?: (id: string) => void;
		/** The peninsula at a finer grid, drawn over the wide sheet once the view comes in. */
		inset?: ReliefField | null;
		/** 0 while the view is wide, 1 once the peninsula fills it. */
		insetAlpha?: number;
	} = $props();

	const kit = getKit();
	const { invalidate, size: sizeStore } = useThrelte();
	const size = fromStore(sizeStore);
	const pal = $derived.by(() => {
		const p = mapPalette(kit.palette.light);
		return quiet ? { ...p, wash: p.wash * 0.7 } : p;
	});
	/** Long side of the painted sheet, in pixels (the GPU holds it plus its mipmaps). */
	const LONG = window.innerWidth >= 900 ? 3072 : 2048;

	function openLabel(l: { id: string; nation?: string }) {
		const wiki = l.nation && byId.has(l.nation) ? l.nation : byId.has(l.id) ? l.id : PLACES[l.id] ? l.id : PLACES[l.nation ?? ''] ? l.nation! : null;
		if (!wiki) return;
		if (onwiki) {
			onwiki(wiki);
			return;
		}
		if (byId.has(wiki)) openProfile(wiki, year);
		else reading.place = wiki;
	}

	/* —— the painted sheet: one canvas, a new texture whenever its size changes —— */

	const sheet = document.createElement('canvas');
	let texture = $state.raw<CanvasTexture | null>(null);
	let textureSize = '';
	onDestroy(() => untrack(() => texture)?.dispose());

	$effect(() => {
		setFishEye(fish);
		if (!data || !field) return;
		const { frame } = scopeFrame(scope);
		const changed = paintCosmos(sheet, data, {
			year,
			pal,
			light: kit.palette.light,
			width: paintWidth(frame, LONG),
			layout,
			scope,
			frame,
			relief: terrain ? reliefPaint(field, kit.palette.light) : null,
			shade: 0.7,
			rivers,
			washes
		});
		if (!changed) return;
		const size = `${sheet.width}x${sheet.height}`;
		const old = untrack(() => texture);
		if (old && size === textureSize) old.needsUpdate = true;
		else {
			old?.dispose();
			const t = new CanvasTexture(sheet);
			t.colorSpace = SRGBColorSpace;
			t.anisotropy = 8;
			texture = t;
			textureSize = size;
		}
		invalidate();
	});

	/* —— the ground —— */

	const fitWidth = $derived.by(() => {
		setFishEye(fish);
		return scopeFrame(scope).fit.w / 50;
	});
	/** Full paint buffer for rim sampling (one read per paint, not per vertex). */
	let rimBuf = $state.raw<{ w: number; h: number; data: Uint8ClampedArray; frame: { x: number; y: number; w: number; h: number } } | null>(null);
	$effect(() => {
		void texture;
		void year;
		setFishEye(fish);
		if (!sheet.width) {
			rimBuf = null;
			return;
		}
		const { frame } = scopeFrame(scope);
		const ctx = sheet.getContext('2d')!;
		rimBuf = { w: sheet.width, h: sheet.height, data: ctx.getImageData(0, 0, sheet.width, sheet.height).data, frame };
	});
	const rimFromSheet = (x: number, y: number): [number, number, number] => {
		const buf = rimBuf;
		if (!buf) return [0.45, 0.4, 0.34];
		const u = Math.max(0, Math.min(0.999, (x - buf.frame.x) / buf.frame.w));
		const v = Math.max(0, Math.min(0.999, (y - buf.frame.y) / buf.frame.h));
		const i = (Math.floor(v * buf.h) * buf.w + Math.floor(u * buf.w)) * 4;
		return [buf.data[i] / 255, buf.data[i + 1] / 255, buf.data[i + 2] / 255];
	};
	const ground = $derived.by(() => {
		setFishEye(fish);
		if (!field) return null;
		/** Depend on the live paint so rim colours refresh with the sheet. */
		void rimBuf;
		return {
			mesh: fieldGeometry(field, layout),
			wall: wallGeometry(field, layout, -lift, rimFromSheet),
			water: terrain ? waterGeometry(field, layout) : null
		};
	});
	$effect(() => {
		const g = ground;
		invalidate();
		return () => {
			g?.mesh.dispose();
			g?.wall.dispose();
			g?.water?.dispose();
		};
	});
	/** The sea's surface over the sea floor: clear enough that the depth still reads through it. */
	const water = $derived(kit.palette.light ? { color: '#5f9fd0', opacity: 0.5 } : { color: '#1c6a9a', opacity: 0.58 });

	const fade = new Tween(0, { duration: 700, easing: cubicInOut });
	$effect(() => {
		fade.set(texture && ground ? 1 : 0, kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		void fade.current;
		invalidate();
	});

	/** A fish-eyed sheet point on the ground (or on the sea's surface), `up` above it. */
	const onPlane = ([x, y]: [number, number], up = 0.04): Vec3 => {
		const [wx, wz] = toMapWorld(x, y);
		return [wx, lift + (field ? Math.max(0, heightAt(field, x, y)) : 0) + up, wz];
	};

	/* —— the peninsula close-up: a sharper sheet over the coarse one —— */

	const insetSheet = document.createElement('canvas');
	let insetTex = $state.raw<CanvasTexture | null>(null);
	onDestroy(() => untrack(() => insetTex)?.dispose());
	$effect(() => {
		setFishEye(fish);
		if (!data || !inset) return;
		const frame = inset.box;
		const changed = paintCosmos(insetSheet, data, {
			year,
			pal,
			light: kit.palette.light,
			width: paintWidth(frame, 2048),
			layout,
			scope: 'samhan',
			frame,
			relief: terrain ? reliefPaint(inset, kit.palette.light) : null,
			shade: 0.7,
			rivers,
			washes
		});
		if (!changed) return;
		featherInset(insetSheet);
		const old = untrack(() => insetTex);
		if (old && old.image === insetSheet) old.needsUpdate = true;
		else {
			old?.dispose();
			const t = new CanvasTexture(insetSheet);
			t.colorSpace = SRGBColorSpace;
			t.anisotropy = 8;
			insetTex = t;
		}
		invalidate();
	});
	const insetGeo = $derived.by(() => {
		setFishEye(fish);
		return inset ? fieldGeometry(inset, layout, 1) : null;
	});
	$effect(() => {
		const g = insetGeo;
		invalidate();
		return () => g?.dispose();
	});
	/** Wide-frame names step aside once the peninsula's own names cover that ground. */
	const covered = (xy: [number, number]) => {
		if (insetAlpha < 0.55) return false;
		setFishEye(fish);
		const b = scopeFrame('samhan').fit;
		return xy[0] > b.x - 30 && xy[0] < b.x + b.w + 30 && xy[1] > b.y - 30 && xy[1] < b.y + b.h + 30;
	};

	const wide = $derived(scope !== 'samhan');
	const shown = $derived(labels ? labelsAt(data, year, scope, layout, mythLabels, rulers) : []);
	const labelAt = (l: CosmosShown) => onPlane(l.xy, l.realm ? fitWidth * 0.012 : fitWidth * 0.0015);
	/** KitLabel `lg`: clamp(10px, 3cqi, 14.5px) of the stage. */
	const labelPx = $derived(Math.min(14.5, Math.max(10, size.current.width * 0.03)));
	/** The names with room from this camera; crowded ones wait for the reader to zoom in. */
	const roomy = $derived(
		uncrowded(
			shown,
			(l) => {
				const p = kit.project(labelAt(l));
				return p.x < -9000 ? null : [p.x, p.y];
			},
			ko,
			labelPx
		)
	);

	/* —— the gold line round Samhan, on the wide frames —— */
	const goldSheet = document.createElement('canvas');
	const goldTexture = new CanvasTexture(goldSheet);
	goldTexture.colorSpace = SRGBColorSpace;
	goldTexture.anisotropy = 8;
	onDestroy(() => goldTexture.dispose());
	let gilded = $state(false);
	$effect(() => {
		setFishEye(fish);
		if (!data || scope === 'samhan') return;
		if (paintSamhanLine(goldSheet, data, SAMHAN_GOLD_YEAR, SAMHAN_LINE[scope], kit.palette.light)) {
			goldTexture.needsUpdate = true;
			gilded = true;
			invalidate();
		}
	});
	const goldDrape = $derived.by(() => {
		setFishEye(fish);
		if (!field || scope === 'samhan') return null;
		return drapeGeometry(field, samhanBox(), fitWidth * 0.0015);
	});
	$effect(() => {
		const g = goldDrape;
		invalidate();
		return () => g?.dispose();
	});
	const gold = new Tween(0, { duration: 700, easing: cubicInOut });
	$effect(() => {
		gold.set(wide ? 1 : 0, kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		void gold.current;
		invalidate();
	});

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
	const [sx, sz] = $derived.by(() => {
		setFishEye(fish);
		return toMapWorld(...cosmosProject(...SKY_AT));
	});

	/** Orange beacon over Tamla — a glowing shaft that grows with the wide frames. */
	const BEACON_H = { samhan: 0.9, sphere: 1.8, world: 3.2, cosmos: 5.2 } as const;
	const BEACON_R = { samhan: 0.018, sphere: 0.04, world: 0.075, cosmos: 0.12 } as const;
	const beacon = new Tween<[number, number]>([BEACON_H.samhan, BEACON_R.samhan], { duration: 900, easing: cubicInOut });
	$effect(() => {
		beacon.set([BEACON_H[scope], BEACON_R[scope]], kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		void beacon.current;
		invalidate();
	});
	const tamla = $derived.by(() => {
		setFishEye(fish);
		const [x, y] = cosmosProject(...TAMLA_AT);
		const [wx, wz] = toMapWorld(x, y);
		const ground = lift + (field ? Math.max(0, heightAt(field, x, y)) : 0);
		return { wx, wz, ground };
	});
</script>

{#if texture && ground && fade.current > 0.001}
	<T.Group position.y={lift}>
		<T.Mesh geometry={ground.mesh} renderOrder={-1}>
			<T.MeshLambertMaterial map={texture} transparent opacity={fade.current} alphaTest={scope === 'cosmos' ? 0.12 : 0} side={DoubleSide} />
		</T.Mesh>
		<T.Mesh geometry={ground.wall} renderOrder={-1}>
			<T.MeshLambertMaterial
				vertexColors
				color="#ffffff"
				transparent
				opacity={fade.current}
				side={DoubleSide}
			/>
		</T.Mesh>
		{#if ground.water}
			<T.Mesh geometry={ground.water} position.y={fitWidth * 0.0004} renderOrder={1}>
				<T.MeshLambertMaterial color={water.color} transparent opacity={water.opacity * fade.current} depthWrite={false} side={DoubleSide} />
			</T.Mesh>
		{/if}
		{#if insetGeo && insetTex && insetAlpha > 0.02}
			<T.Mesh geometry={insetGeo} position.y={fitWidth * 0.0016} renderOrder={3}>
				<T.MeshLambertMaterial
					map={insetTex}
					transparent
					opacity={fade.current * insetAlpha}
					alphaTest={0.04}
					depthWrite={insetAlpha > 0.85}
					side={DoubleSide}
				/>
			</T.Mesh>
		{/if}
		{#if gilded && goldDrape && gold.current > 0.001}
			<T.Mesh geometry={goldDrape} renderOrder={4}>
				<T.MeshBasicMaterial map={goldTexture} transparent opacity={gold.current * fade.current} alphaTest={0.05} depthWrite={false} toneMapped={false} side={DoubleSide} />
			</T.Mesh>
		{/if}
	</T.Group>
	{#if scope !== 'samhan'}
		<T.Mesh position={[sx, skyBase + thread.current[0] / 2, sz]} scale={[thread.current[1], thread.current[0], thread.current[1]]}>
			<T.CylinderGeometry args={[1, 1, 1, 8, 1, true]} />
			<T.MeshBasicMaterial color="#f2c14e" transparent opacity={0.5 * fade.current} depthWrite={false} toneMapped={false} />
		</T.Mesh>
		<!-- Tamla: orange beacon of light (core + soft glow + point light) -->
		<T.Group position={[tamla.wx, tamla.ground, tamla.wz]}>
			<T.Mesh position.y={beacon.current[0] / 2} scale={[beacon.current[1] * 0.45, beacon.current[0], beacon.current[1] * 0.45]}>
				<T.CylinderGeometry args={[1, 1.15, 1, 16, 1, true]} />
				<T.MeshBasicMaterial
					color="#ff7a18"
					transparent
					opacity={0.95 * fade.current}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.Mesh position.y={beacon.current[0] / 2} scale={[beacon.current[1] * 2.4, beacon.current[0] * 1.02, beacon.current[1] * 2.4]}>
				<T.CylinderGeometry args={[1, 1.35, 1, 16, 1, true]} />
				<T.MeshBasicMaterial
					color="#ff9a3a"
					transparent
					opacity={0.28 * fade.current}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.Mesh position.y={beacon.current[0]} scale={[beacon.current[1] * 3.2, beacon.current[1] * 0.55, beacon.current[1] * 3.2]}>
				<T.SphereGeometry args={[1, 16, 12]} />
				<T.MeshBasicMaterial
					color="#ffc078"
					transparent
					opacity={0.55 * fade.current}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.PointLight
				color="#ff7a18"
				intensity={scope === 'cosmos' ? 4.5 : scope === 'world' ? 2.8 : 1.6}
				distance={scope === 'cosmos' ? 18 : scope === 'world' ? 10 : 5}
				decay={2}
				position={[0, beacon.current[0] * 0.65, 0]}
			/>
		</T.Group>
	{/if}
{/if}

{#each shown as l (l.key)}
	{@const wiki = l.nation && byId.has(l.nation) ? l.nation : byId.has(l.id) ? l.id : PLACES[l.id] ? l.id : PLACES[l.nation ?? ''] ? l.nation : null}
	<KitLabel
		at={labelAt(l)}
		tone="note"
		size="lg"
		show={wide && !!data && !!field && roomy.has(l.key) && !covered(l.xy)}
		moveDelay={0}
		onclick={wiki ? () => openLabel(l) : undefined}
	>
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
			mark={l.mark}
			color={l.color}
			kind={l.kind}
			tint={l.tint}
			night={l.night}
			uiKo={ko}
		/>
	</KitLabel>
{/each}
