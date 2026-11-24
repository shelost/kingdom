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
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { AdditiveBlending, CanvasTexture, DoubleSide, SRGBColorSpace } from 'three';
	import {
		SAMHAN_GOLD_YEAR,
		SAMHAN_LINE,
		SKY_AT,
		SKY_HEIGHT,
		TAMLA_AT,
		cosmosProject,
		scopeFrame,
		setCosmosSplit,
		setFishEye,
		type CosmosLayout,
		type CosmosScope,
		type FishEyeId
	} from '$lib/cosmos';
	import { forgetPaint, samhanBox, labelOn, labelsAt, paintCosmos, paintPangaea, paintSamhanLine, paintWidth, uncrowded, type CosmosData, type CosmosShown } from '$lib/cosmosLayer';
	import { featherInset } from '$lib/mapLod';
	import { settledYear } from '$lib/borders';
	import { heightAt, reliefPaint, reliefWindow, type ReliefField, type WorldDem } from '$lib/worldRelief';
	import { drapeGeometry, fieldGeometry, morphGeometry, wallGeometry, waterGeometry } from './reliefMesh';
	import { cosmosGroundMaterial } from './cosmosGround';
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
		dem = null,
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
		peoples = true,
		nature = true,
		mythic = true,
		split = 1,
		pangaea = null,
		beginning = false,
		onwiki,
		inset = null,
		insetAlpha = 0,
		insetPaint = 2048,
		insetFeather = false
	}: {
		year: number;
		ko?: boolean;
		scope: CosmosScope;
		/** Halves of one circle, or 이승 and 저승 as two semi-attached circles. */
		layout?: CosmosLayout;
		data: CosmosData | null;
		dem?: WorldDem | null;
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
		/** Cosmos sheets. Ignored on the nearer frames, where they stay on. */
		peoples?: boolean;
		nature?: boolean;
		mythic?: boolean;
		/** 0 = Pangaea (one circle), 1 = the split cosmos. Drives the shader only. */
		split?: number;
		/** The single-circle ground, same grid as `field`. */
		pangaea?: ReliefField | null;
		/** Names and the present-only ornaments step aside while the circle is one. */
		beginning?: boolean;
		/** A name or place opens the wiki. Falls back to the profile card. */
		onwiki?: (id: string) => void;
		/** A finer grid over the ground under the camera, drawn over the wide sheet. */
		inset?: ReliefField | null;
		/** 0 while the view is wide, 1 once the patch should cover it. */
		insetAlpha?: number;
		/** Paint long side for the patch. Larger as the view comes in. */
		insetPaint?: number;
		/** A zoom patch melts at the rim. The resting sheet stays solid. */
		insetFeather?: boolean;
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
	const pangaeaSheet = document.createElement('canvas');
	/** Kingdom borders painted at peninsula resolution, then copied onto the cosmos sheet. */
	const penSheet = document.createElement('canvas');
	/** Previous political paint, so a year change can crossfade instead of popping. */
	const prevSheet = document.createElement('canvas');
	const mixSheet = document.createElement('canvas');
	let peninsulaOnSheet = false;
	let texture = $state.raw<CanvasTexture | null>(null);
	let pangaeaTex = $state.raw<CanvasTexture | null>(null);
	let mixTex = $state.raw<CanvasTexture | null>(null);
	let textureSize = '';
	const groundMat = cosmosGroundMaterial();
	const blend = new Tween(1, { duration: 520, easing: cubicOut });
	let lastSettled = Number.NaN;
	let lastScope: CosmosScope | null = null;
	let fading = false;
	onDestroy(() => {
		untrack(() => texture)?.dispose();
		untrack(() => pangaeaTex)?.dispose();
		untrack(() => mixTex)?.dispose();
		groundMat.mat.dispose();
	});

	function blit(from: HTMLCanvasElement, to: HTMLCanvasElement) {
		if (!from.width || !from.height) return;
		if (to.width !== from.width || to.height !== from.height) {
			to.width = from.width;
			to.height = from.height;
		}
		const c = to.getContext('2d')!;
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.globalAlpha = 1;
		c.globalCompositeOperation = 'source-over';
		c.clearRect(0, 0, to.width, to.height);
		c.drawImage(from, 0, 0);
	}

	function mixCanvases(live: HTMLCanvasElement, prev: HTMLCanvasElement, onto: HTMLCanvasElement, t: number) {
		if (!live.width || !prev.width) return;
		if (onto.width !== live.width || onto.height !== live.height) {
			onto.width = live.width;
			onto.height = live.height;
		}
		const c = onto.getContext('2d')!;
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.globalCompositeOperation = 'source-over';
		c.clearRect(0, 0, onto.width, onto.height);
		c.globalAlpha = 1 - t;
		c.drawImage(prev, 0, 0, onto.width, onto.height);
		c.globalAlpha = t;
		c.drawImage(live, 0, 0);
		c.globalAlpha = 1;
	}

	/** The morph uniform. This is the only work the tween does each frame. */
	$effect(() => {
		groundMat.setSplit(split);
		invalidate();
	});

	$effect(() => {
		setFishEye(fish);
		setCosmosSplit(1);
		if (!data || !field) return;
		const frame = field.box;
		const settled = settledYear(year);
		const handoff =
			lastScope === scope && Number.isFinite(lastSettled) && settled !== lastSettled && sheet.width > 0 && !kit.instant;
		if (handoff) blit(sheet, prevSheet);
		/**
		 * The cosmos paint fills the peninsula with one colour. Samhan redraws that
		 * window in kingdom colours. Ecumene redraws East Asia the same way, so the
		 * wide frame keeps the year-by-year borders.
		 */
		const stampSamhan = scope === 'samhan' && inset != null;
		const stampSphere = scope === 'sphere' && dem != null;
		const stamp = stampSamhan || stampSphere;
		if (stamp || peninsulaOnSheet) forgetPaint(sheet);
		const changed = paintCosmos(sheet, data, {
			year,
			pal,
			light: kit.palette.light,
			width: paintWidth(frame, LONG),
			layout,
			scope: 'cosmos',
			frame,
			relief: terrain ? reliefPaint(field, kit.palette.light) : null,
			shade: 0.7,
			rivers,
			washes,
			peoples,
			nature,
			mythic,
			split: 1
		});
		if (stampSamhan && inset) {
			const pen = inset.box;
			paintCosmos(penSheet, data, {
				year,
				pal,
				light: kit.palette.light,
				width: paintWidth(pen, 2048),
				layout,
				scope: 'samhan',
				frame: pen,
				relief: terrain ? reliefPaint(inset, kit.palette.light) : null,
				shade: 0.7,
				rivers,
				washes,
				peoples,
				nature,
				mythic: false,
				split: 1
			});
			const ctx = sheet.getContext('2d')!;
			const k = sheet.width / frame.w;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.imageSmoothingEnabled = true;
			ctx.drawImage(penSheet, (pen.x - frame.x) * k, (pen.y - frame.y) * k, pen.w * k, pen.h * k);
			peninsulaOnSheet = true;
		} else if (stampSphere && dem) {
			const pen = scopeFrame('sphere').frame;
			const relief = terrain ? reliefWindow(data, dem, 'cosmos', pen, 320, layout) : null;
			paintCosmos(penSheet, data, {
				year,
				pal,
				light: kit.palette.light,
				width: paintWidth(pen, 1792),
				layout,
				scope: 'sphere',
				frame: pen,
				relief: relief ? reliefPaint(relief, kit.palette.light) : null,
				shade: 0.7,
				rivers: false,
				washes,
				peoples,
				nature,
				mythic: false,
				split: 1
			});
			const ctx = sheet.getContext('2d')!;
			const k = sheet.width / frame.w;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.imageSmoothingEnabled = true;
			ctx.drawImage(penSheet, (pen.x - frame.x) * k, (pen.y - frame.y) * k, pen.w * k, pen.h * k);
			peninsulaOnSheet = true;
		} else peninsulaOnSheet = false;
		lastSettled = settled;
		lastScope = scope;
		if (handoff) {
			fading = true;
			blend.set(0, { duration: 0 });
			blend.set(1, { duration: 520 });
		} else fading = false;
		if (!changed && !stamp) return;
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
		if (!fading) groundMat.mat.map = untrack(() => texture);
		invalidate();
	});

	/** Crossfade the previous borders into the new ones while the year settles. */
	$effect(() => {
		const t = blend.current;
		const live = untrack(() => texture);
		if (!fading || t >= 0.999 || !prevSheet.width || !sheet.width || !live) {
			if (live && groundMat.mat.map !== live) {
				groundMat.mat.map = live;
				invalidate();
			}
			return;
		}
		mixCanvases(sheet, prevSheet, mixSheet, t);
		const old = untrack(() => mixTex);
		if (old && old.image === mixSheet) old.needsUpdate = true;
		else {
			old?.dispose();
			const tex = new CanvasTexture(mixSheet);
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 8;
			mixTex = tex;
		}
		groundMat.mat.map = untrack(() => mixTex);
		invalidate();
	});

	$effect(() => {
		if (!pangaea) return;
		const light = kit.palette.light;
		if (!paintPangaea(pangaeaSheet, pangaea.box, pangaea, light, paintWidth(pangaea.box, LONG))) return;
		const old = untrack(() => pangaeaTex);
		if (old && old.image === pangaeaSheet) old.needsUpdate = true;
		else {
			old?.dispose();
			const t = new CanvasTexture(pangaeaSheet);
			t.colorSpace = SRGBColorSpace;
			t.anisotropy = 8;
			pangaeaTex = t;
		}
		groundMat.setPangaea(untrack(() => pangaeaTex));
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
		if (!sheet.width || !field) {
			rimBuf = null;
			return;
		}
		const ctx = sheet.getContext('2d')!;
		rimBuf = { w: sheet.width, h: sheet.height, data: ctx.getImageData(0, 0, sheet.width, sheet.height).data, frame: field.box };
	});
	let panRim = $state.raw<{ w: number; h: number; data: Uint8ClampedArray; frame: { x: number; y: number; w: number; h: number } } | null>(null);
	$effect(() => {
		void pangaeaTex;
		if (!pangaeaSheet.width || !pangaea) {
			panRim = null;
			return;
		}
		const ctx = pangaeaSheet.getContext('2d')!;
		panRim = {
			w: pangaeaSheet.width,
			h: pangaeaSheet.height,
			data: ctx.getImageData(0, 0, pangaeaSheet.width, pangaeaSheet.height).data,
			frame: pangaea.box
		};
	});
	const colorOf = (buf: typeof rimBuf, x: number, y: number): [number, number, number] => {
		if (!buf) return [0.45, 0.4, 0.34];
		const u = Math.max(0, Math.min(0.999, (x - buf.frame.x) / buf.frame.w));
		const v = Math.max(0, Math.min(0.999, (y - buf.frame.y) / buf.frame.h));
		const i = (Math.floor(v * buf.h) * buf.w + Math.floor(u * buf.w)) * 4;
		return [buf.data[i] / 255, buf.data[i + 1] / 255, buf.data[i + 2] / 255];
	};
	const ground = $derived.by(() => {
		setFishEye(fish);
		setCosmosSplit(1);
		if (!field || !pangaea) return null;
		void rimBuf;
		void panRim;
		const presentWall = wallGeometry(field, layout, -lift, (x, y) => colorOf(rimBuf, x, y));
		setCosmosSplit(0);
		const pangaeaWall = wallGeometry(pangaea, layout, -lift, (x, y) => colorOf(panRim, x, y));
		setCosmosSplit(1);
		return {
			mesh: morphGeometry(field, pangaea),
			presentWall,
			pangaeaWall,
			water: terrain ? waterGeometry(field, layout) : null
		};
	});
	$effect(() => {
		const g = ground;
		invalidate();
		return () => {
			g?.mesh.dispose();
			g?.presentWall.dispose();
			g?.pangaeaWall.dispose();
			g?.water?.dispose();
		};
	});
	/** The sea's surface over the sea floor: clear enough that the depth still reads through it. */
	const water = $derived(kit.palette.light ? { color: '#3d86c4', opacity: 0.72 } : { color: '#0e4f78', opacity: 0.78 });

	const fade = new Tween(0, { duration: 700, easing: cubicInOut });
	$effect(() => {
		fade.set(texture && pangaeaTex && ground ? 1 : 0, kit.instant ? { duration: 0 } : undefined);
	});
	$effect(() => {
		groundMat.mat.opacity = fade.current;
		invalidate();
	});

	/** A fish-eyed sheet point on the ground (or on the sea's surface), `up` above it. */
	const onPlane = ([x, y]: [number, number], up = 0.04): Vec3 => {
		const [wx, wz] = toMapWorld(x, y);
		return [wx, lift + (field ? Math.max(0, heightAt(field, x, y)) : 0) + up, wz];
	};

	/* —— the close-up: a sharper sheet over whatever ground the camera is on —— */

	const insetSheet = document.createElement('canvas');
	const prevInset = document.createElement('canvas');
	const mixInset = document.createElement('canvas');
	let insetTex = $state.raw<CanvasTexture | null>(null);
	let mixInsetTex = $state.raw<CanvasTexture | null>(null);
	let insetFace = $state.raw<CanvasTexture | null>(null);
	let insetSettled = Number.NaN;
	onDestroy(() => {
		untrack(() => insetTex)?.dispose();
		untrack(() => mixInsetTex)?.dispose();
	});
	$effect(() => {
		setFishEye(fish);
		if (!data || !inset || !field) return;
		const settled = settledYear(year);
		const handoff = Number.isFinite(insetSettled) && settled !== insetSettled && insetSheet.width > 0 && !kit.instant;
		if (handoff) blit(insetSheet, prevInset);
		insetSettled = settled;
		const frame = inset.box;
		const pen = scopeFrame('samhan').frame;
		const ix = Math.max(0, Math.min(frame.x + frame.w, pen.x + pen.w) - Math.max(frame.x, pen.x));
		const iy = Math.max(0, Math.min(frame.y + frame.h, pen.y + pen.h) - Math.max(frame.y, pen.y));
		const overPeninsula = (ix * iy) / Math.max(frame.w * frame.h, 1) > 0.62;
		const cx = frame.x + frame.w / 2;
		const cy = frame.y + frame.h / 2;
		const lookingAtPeninsula = cx >= pen.x && cx <= pen.x + pen.w && cy >= pen.y && cy <= pen.y + pen.h;
		/** Samhan, and any close view aimed at the peninsula, keeps the kingdom borders, rivers and site colours. */
		const closeScope = scope === 'samhan' || lookingAtPeninsula || overPeninsula ? 'samhan' : scope;
		const wideK = paintWidth(field.box, LONG) / field.box.w;
		const styleK = closeScope === 'samhan' ? paintWidth(pen, 2048) / pen.w : wideK;
		const changed = paintCosmos(insetSheet, data, {
			year,
			pal,
			light: kit.palette.light,
			width: paintWidth(frame, insetPaint),
			layout,
			scope: closeScope,
			frame,
			relief: terrain ? reliefPaint(inset, kit.palette.light) : null,
			shade: 0.7,
			rivers: rivers && closeScope === 'samhan',
			washes,
			peoples,
			nature,
			mythic: closeScope === 'cosmos' && mythic,
			styleK
		});
		if (!changed) return;
		/** A zoom patch melts into the sheet under it, so the two borders never stack. */
		if (insetFeather) featherInset(insetSheet);
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
	$effect(() => {
		const t = blend.current;
		const live = untrack(() => insetTex);
		if (!prevInset.width || t >= 0.999 || !insetSheet.width || !live) {
			insetFace = live;
			return;
		}
		mixCanvases(insetSheet, prevInset, mixInset, t);
		const old = untrack(() => mixInsetTex);
		if (old && old.image === mixInset) old.needsUpdate = true;
		else {
			old?.dispose();
			const tex = new CanvasTexture(mixInset);
			tex.colorSpace = SRGBColorSpace;
			tex.anisotropy = 8;
			mixInsetTex = tex;
		}
		insetFace = untrack(() => mixInsetTex);
		invalidate();
	});
	const insetGeo = $derived.by(() => {
		setFishEye(fish);
		/** A 1500-wide field at every sample is a million vertices. Step by two past 900. */
		const stride = inset && inset.nx > 900 ? 2 : 1;
		return inset ? fieldGeometry(inset, layout, stride) : null;
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
	const sheets = $derived({ peoples, nature, myth: mythic });
	const shown = $derived.by(() => {
		setCosmosSplit(1);
		if (!labels) return [];
		return labelsAt(data, year, scope, layout, mythLabels, rulers).filter((l) => scope !== 'cosmos' || labelOn(l, sheets));
	});
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

	/** Orange beacon over Tamla — a pool of light with a tall shaft, wider on the far frames. */
	const BEACON_H = { samhan: 2.2, sphere: 4.2, world: 7, cosmos: 9.5 } as const;
	const BEACON_R = { samhan: 0.12, sphere: 0.28, world: 0.7, cosmos: 1.35 } as const;
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

{#if texture && pangaeaTex && ground && fade.current > 0.001}
	<T.Group position.y={lift}>
		<T.Mesh geometry={ground.mesh} material={groundMat.mat} renderOrder={-1} />
		{#if split > 0.92 && field?.inside}
			<T.Mesh geometry={ground.presentWall} renderOrder={-1}>
				<T.MeshLambertMaterial vertexColors color="#ffffff" transparent opacity={fade.current * ((split - 0.92) / 0.08)} side={DoubleSide} />
			</T.Mesh>
		{/if}
		{#if split < 0.08}
			<T.Mesh geometry={ground.pangaeaWall} renderOrder={-1}>
				<T.MeshLambertMaterial vertexColors color="#ffffff" transparent opacity={fade.current * ((0.08 - split) / 0.08)} side={DoubleSide} />
			</T.Mesh>
		{/if}
		{#if ground.water && split > 0.35}
			<T.Mesh geometry={ground.water} position.y={fitWidth * 0.0004} renderOrder={1}>
				<T.MeshLambertMaterial color={water.color} transparent opacity={water.opacity * fade.current * split} depthWrite={false} side={DoubleSide} />
			</T.Mesh>
		{/if}
		{#if insetGeo && insetTex && insetAlpha > 0.02}
			<!-- The cosmos sheet paints Samhan as one colour and its relief sits in front of this grid. On Samhan the kingdom map is drawn over it. -->
			<!-- The cosmos relief stands taller than this grid, so a depth test hides the sharp paint under the coarse sheet. Draw the paint on top. -->
			<T.Mesh geometry={insetGeo} position.y={fitWidth * 0.0006} renderOrder={3}>
				<T.MeshBasicMaterial
					map={insetFace ?? insetTex}
					transparent
					opacity={fade.current * insetAlpha * split}
					alphaTest={0.04}
					depthTest={false}
					depthWrite={false}
					side={DoubleSide}
					toneMapped={false}
				/>
			</T.Mesh>
		{/if}
		{#if gilded && goldDrape && gold.current > 0.001}
			<T.Mesh geometry={goldDrape} renderOrder={4}>
				<T.MeshBasicMaterial map={goldTexture} transparent opacity={gold.current * fade.current * split} alphaTest={0.05} depthWrite={false} toneMapped={false} side={DoubleSide} />
			</T.Mesh>
		{/if}
	</T.Group>
	{#if scope !== 'samhan'}
		<T.Mesh position={[sx, skyBase + thread.current[0] / 2, sz]} scale={[thread.current[1], thread.current[0], thread.current[1]]}>
			<T.CylinderGeometry args={[1, 1, 1, 8, 1, true]} />
			<T.MeshBasicMaterial color="#f2c14e" transparent opacity={0.5 * fade.current * split} depthWrite={false} toneMapped={false} />
		</T.Mesh>
		<!-- Tamla: orange light — a bright pool on the island, a thick shaft, a wide bloom -->
		<T.Group position={[tamla.wx, tamla.ground, tamla.wz]}>
			<T.Mesh position.y={beacon.current[1] * 0.15} scale={[beacon.current[1] * 3.2, beacon.current[1] * 0.45, beacon.current[1] * 3.2]}>
				<T.SphereGeometry args={[1, 24, 16]} />
				<T.MeshBasicMaterial
					color="#ff8c00"
					transparent
					opacity={0.9 * fade.current * split}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.Mesh position.y={beacon.current[0] * 0.48} scale={[beacon.current[1] * 0.7, beacon.current[0], beacon.current[1] * 0.7]}>
				<T.CylinderGeometry args={[0.55, 1, 1, 20, 1, true]} />
				<T.MeshBasicMaterial
					color="#ff7a00"
					transparent
					opacity={0.95 * fade.current * split}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.Mesh position.y={beacon.current[0] * 0.42} scale={[beacon.current[1] * 1.8, beacon.current[0] * 0.9, beacon.current[1] * 1.8]}>
				<T.CylinderGeometry args={[0.7, 1.15, 1, 20, 1, true]} />
				<T.MeshBasicMaterial
					color="#ff9a1a"
					transparent
					opacity={0.55 * fade.current * split}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.Mesh position.y={beacon.current[0] * 0.55} scale={[beacon.current[1] * 2.6, beacon.current[1] * 2.6, beacon.current[1] * 2.6]}>
				<T.SphereGeometry args={[1, 20, 16]} />
				<T.MeshBasicMaterial
					color="#ffb020"
					transparent
					opacity={0.5 * fade.current * split}
					depthWrite={false}
					toneMapped={false}
					blending={AdditiveBlending}
				/>
			</T.Mesh>
			<T.PointLight
				color="#ff7a00"
				intensity={(scope === 'cosmos' ? 26 : scope === 'world' ? 12 : 5) * split}
				distance={scope === 'cosmos' ? 70 : scope === 'world' ? 28 : 10}
				decay={2}
				position={[0, beacon.current[0] * 0.7, 0]}
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
		show={wide && !!data && !!field && !beginning && roomy.has(l.key) && (!!l.mark || !covered(l.xy))}
		moveDelay={0}
		onclick={wiki ? () => openLabel(l) : undefined}
	>
		<CosmosName
			han={l.han}
			ko={l.ko}
			en={l.en}
			epithet={l.epithet}
			role={l.role}
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
