<script lang="ts">
	/**
	 * A battle on its real ground, as a round table that turns: the baked relief cut to a
	 * disc, cartoon Samhan fortresses flying their holders' flags (swapped when a phase
	 * changes hands), troops that march between phases (a man, a rider, or a ship), low
	 * arrows, a portrait over every unit a named character leads, fires where the
	 * fighting is, and each side's ground washed in its colour like a Risk board, the
	 * borders flowing from phase to phase. Lost men go up in a puff of smoke; routed ones
	 * run for the edge of the table. Labels are DOM (KitLabel).
	 */
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		CanvasTexture,
		CircleGeometry,
		Color,
		ConeGeometry,
		DoubleSide,
		IcosahedronGeometry,
		InstancedMesh,
		LatheGeometry,
		MeshBasicMaterial,
		MeshStandardMaterial,
		Object3D,
		Quaternion,
		SRGBColorSpace,
		Vector2,
		Vector3,
		type BufferGeometry
	} from 'three';
	import { Tween } from 'svelte/motion';
	import { cubicIn, cubicInOut, cubicOut } from 'svelte/easing';
	import { BATTLES, fieldDots, flagSites, heldBy, moundAt, sideColors, unitSpots, type EventKind, type FieldDot, type Terrain } from '$lib/battles';
	import { BATTLE_GRID, DISC, DISC_SHEET, DISC_WORLD, buildRelief, groundAt, groundPalette, lineOf, toWorld } from '$lib/battleTerrain';
	import { blendAnchors, paintAnchors, territoryAnchors, type Anchor } from '$lib/battleTerritory';
	import { sideBanner } from '$lib/banners';
	import { curveThrough, type Pt } from '$lib/mapPaths';
	import { avatarOf, byId, koreanOf, nameOf } from '$lib/people';
	import { getKit, mix, type Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import BattleFlag from './BattleFlag.svelte';
	import { buildStructures, chevronGeometry, flameGeometry, shipParts, troopParts } from './structures';
	import { arrowGeometry, drapeGeometry, ribbonGeometry, riverFlow, terrainGeometry } from './ground';

	let {
		battle,
		index = 0,
		ko = false,
		full = false,
		replay = 0
	}: { battle: string; index?: number; ko?: boolean; full?: boolean; replay?: number } = $props();

	const kit = getKit();
	const { invalidate } = useThrelte();
	/** The slab's skirt hangs this far below sea level; the group lifts it onto the floor. */
	const LIFT = 0.22;
	/** Seconds a dot takes to march from one phase to the next. */
	const MARCH = 2;
	/** Seconds the borders take to flow into the new phase, after a short wait for the troops to set off. */
	const FLOW = { wait: 0.3, run: 1.9 };
	/** Painted territory: pixels per sheet unit. */
	const TERRITORY_RES = 0.7;

	const b = $derived(BATTLES[battle]);
	const phase = $derived(b.phases[Math.min(index, b.phases.length - 1)]);
	const light = $derived(kit.palette.light);
	const pal = $derived(groundPalette(light));
	const colors = $derived(sideColors(b));
	const colorOf = (side?: string) => (side && colors.get(side)) || kit.palette.base;

	let dem = $state.raw<Int16Array | null>(null);
	$effect(() => {
		const id = battle;
		let gone = false;
		fetch(`/battles/terrain/${id}.bin`)
			.then((r) => (r.ok ? r.arrayBuffer() : null))
			.then((buf) => {
				if (!gone && buf) dem = new Int16Array(buf);
			})
			.catch(() => {});
		return () => {
			gone = true;
			dem = null;
		};
	});

	const relief = $derived(buildRelief(b, dem));
	const ground = $derived(terrainGeometry(relief, pal, BATTLE_GRID, undefined, true, DISC_WORLD));
	const built = $derived(buildStructures(b, relief, colors, light));
	/** Walled places, camps and gates fly the banner of whoever holds them this phase; a walled town's pole stands at its centre. */
	const flags = $derived(
		flagSites(b).map(({ i, t, at }) => {
			const side = heldBy(b, t, index);
			const [x, z] = toWorld(at);
			return {
				key: `f${i}`,
				at: built.poles.get(i) ?? ([x, groundAt(relief, at), z] as Vec3),
				banner: sideBanner(b, side, colorOf(side)),
				big: t.kind === 'city' || t.kind === 'town'
			};
		})
	);
	const strips = $derived(
		b.terrain.flatMap((t: Terrain) =>
			t.kind === 'river'
				? [
						{ geo: ribbonGeometry(relief, lineOf(t.points), (t.width ?? 14) / 100, 0.004, true), color: pal.river },
						{ geo: ribbonGeometry(relief, lineOf(t.points), (t.width ?? 14) / 280, 0.009, true), color: light ? '#e9f7ff' : '#b7def5' }
					]
				: t.kind === 'road'
					? [{ geo: ribbonGeometry(relief, lineOf(t.points), 0.032, 0.008), color: pal.road }]
					: []
		)
	);
	const waterDisc = new CircleGeometry(DISC_WORLD - 0.004, 160);
	const drape = $derived(drapeGeometry(relief, 0.012, BATTLE_GRID, DISC_WORLD));

	$effect(() => {
		const owned: BufferGeometry[] = [ground, built.geometry, drape, ...strips.map((s) => s.geo)];
		invalidate();
		return () => owned.forEach((g) => g.dispose());
	});

	$effect(() => {
		const R = DISC_WORLD;
		kit.fit({ min: [-R, 0, -R], max: [R, relief.maxY + LIFT + 0.3, R] }, { az: 0, el: 0.95 });
	});

	/* —————————————— shared clock: marches, smoke, fire and borders all run on it —————————————— */

	let clock = 0;
	let running = false;
	/** Runs while something moves (every step reports whether it still is), then stops and lets the canvas rest. */
	const life = useTask(
		(delta) => {
			clock += Math.min(delta, 0.05);
			const busy = [stepTroops(), stepPuffs(), stepFires(), stepBorders(), stepFlow()].some(Boolean);
			invalidate();
			if (!busy) {
				running = false;
				life.stop();
			}
		},
		{ autoStart: false, autoInvalidate: false }
	);
	const wake = () => {
		if (running) return;
		running = true;
		life.start();
	};

	/* —————————————— territory: each side's ground, Risk-style, flowing between phases —————————————— */

	const sheet = document.createElement('canvas');
	const territory = new CanvasTexture(sheet);
	territory.colorSpace = SRGBColorSpace;
	territory.anisotropy = 4;
	$effect(() => () => territory.dispose());
	const frame = { ...DISC_SHEET, res: TERRITORY_RES };
	let shownAnchors: Anchor[] = [];
	let borders: { from: Anchor[]; to: Anchor[]; start: number; last: number } | null = null;
	function paint(anchors: Anchor[]) {
		shownAnchors = anchors;
		paintAnchors(
			sheet,
			anchors,
			b.sides.map((s) => s.id),
			colors,
			light,
			frame
		);
		territory.needsUpdate = true;
	}
	/** Repaints at most every 45 ms while the borders flow, then once more where they land. */
	function stepBorders(): boolean {
		if (!borders) return false;
		const t = Math.max(0, Math.min(1, (clock - borders.start - FLOW.wait) / FLOW.run));
		if (t < 1 && clock - borders.last < 0.045) return true;
		borders.last = clock;
		paint(blendAnchors(borders.from, borders.to, cubicInOut(t)));
		if (t >= 1) borders = null;
		return !!borders;
	}
	/* —————————————— troops: tokens on land, little ships at sea —————————————— */

	const solidMat = new MeshStandardMaterial({ roughness: 0.55, metalness: 0.04, flatShading: true });
	const ghostMat = new MeshStandardMaterial({ roughness: 0.6, flatShading: true, transparent: true, opacity: 0.62, depthWrite: false });
	const troop = troopParts();
	const ship = shipParts();
	const hullMat = new MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.8, side: DoubleSide });
	const sailMat = new MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.7, side: DoubleSide });

	type Group = 'foot' | 'ghost' | 'horse' | 'horseGhost' | 'ship';
	const groupOf = (d: FieldDot): Group =>
		d.arm === 'ship' ? 'ship' : d.arm === 'horse' ? (d.unrecorded ? 'horseGhost' : 'horse') : d.unrecorded ? 'ghost' : 'foot';

	const dots = $derived(fieldDots(b, index));
	/** Every dot keeps one slot in one mesh for the whole battle. */
	const meshes = $derived.by(() => {
		const all = fieldDots(b, 0);
		const count = { foot: 0, ghost: 0, horse: 0, horseGhost: 0, ship: 0 };
		const slot = new Map<string, { group: Group; i: number }>();
		for (const d of all) {
			const g = groupOf(d);
			slot.set(d.key, { group: g, i: count[g]++ });
		}
		return {
			slot,
			foot: Object.assign(new InstancedMesh(troop.foot, solidMat, Math.max(1, count.foot)), { count: count.foot }),
			ghost: Object.assign(new InstancedMesh(troop.foot, ghostMat, Math.max(1, count.ghost)), { count: count.ghost }),
			horse: Object.assign(new InstancedMesh(troop.horse, solidMat, Math.max(1, count.horse)), { count: count.horse }),
			horseGhost: Object.assign(new InstancedMesh(troop.horse, ghostMat, Math.max(1, count.horseGhost)), { count: count.horseGhost }),
			hull: Object.assign(new InstancedMesh(ship.hull, hullMat, Math.max(1, count.ship)), { count: count.ship }),
			sail: Object.assign(new InstancedMesh(ship.sail, sailMat, Math.max(1, count.ship)), { count: count.ship })
		};
	});
	$effect(() => {
		const m = meshes;
		m.foot.castShadow = true;
		m.horse.castShadow = true;
		m.hull.castShadow = true;
		m.sail.castShadow = true;
		return () => {
			m.foot.dispose();
			m.ghost.dispose();
			m.horse.dispose();
			m.horseGhost.dispose();
			m.hull.dispose();
			m.sail.dispose();
		};
	});

	type Pose = { x: number; y: number; z: number; s: number; tilt: number; yaw: number; up: number };
	/** How a dot gets from one phase to the next. */
	type Fate = 'march' | 'arrive' | 'die' | 'flee' | 'fade';
	type Track = { from: Pose; to: Pose; fate: Fate; delay: number; dur: number; puffed: boolean };
	let tracks: Track[] = [];
	let cur: Pose[] = [];
	let marchStart = 0;
	let marching = false;
	let shownIndex = -1;
	let shownReplay = 0;
	let wasOn = new Map<string, { on: boolean; routed: boolean }>();
	const dummy = new Object3D();
	const tint = new Color();

	/** Fleets read as a few pixels from the table's camera; drawn this much larger than a land token. */
	const SHIP_SCALE = 2.3;
	/** Ship heading in three.js yaw from a facing in map degrees (0 east, 90 south). */
	const yawOf = (deg: number) => (-deg * Math.PI) / 180;
	/** The shortest turn from `a` to `b`. */
	const turnTo = (a: number, c: number) => a + ((((c - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

	function write() {
		const m = meshes;
		dots.forEach((d, k) => {
			const p = cur[k];
			const at = m.slot.get(d.key);
			if (!p || !at) return;
			dummy.position.set(p.x, p.y + p.up, p.z);
			if (at.group === 'ship') {
				dummy.rotation.set(0, p.yaw, p.tilt * 0.6);
				dummy.scale.setScalar(Math.max(0.0001, p.s) * SHIP_SCALE);
				dummy.updateMatrix();
				m.hull.setMatrixAt(at.i, dummy.matrix);
				m.sail.setMatrixAt(at.i, dummy.matrix);
			} else {
				const big = at.group === 'horse' || at.group === 'horseGhost' ? 1.2 : 1.05;
				dummy.rotation.set(0, p.yaw, p.tilt);
				dummy.scale.setScalar(Math.max(0.0001, p.s) * big);
				dummy.updateMatrix();
				m[at.group].setMatrixAt(at.i, dummy.matrix);
			}
		});
		for (const mesh of [m.foot, m.ghost, m.horse, m.horseGhost, m.hull, m.sail]) mesh.instanceMatrix.needsUpdate = true;
	}

	const lerp = (a: number, c: number, t: number) => a + (c - a) * t;
	function poseAt(tr: Track, now: number): Pose {
		const { from: f, to: g } = tr;
		const t = Math.max(0, Math.min(1, (now - tr.delay) / tr.dur));
		const at = (e: number, s: number, up = 0): Pose => ({
			x: lerp(f.x, g.x, e),
			y: lerp(f.y, g.y, e),
			z: lerp(f.z, g.z, e),
			s,
			tilt: lerp(f.tilt, g.tilt, e),
			yaw: lerp(f.yaw, turnTo(f.yaw, g.yaw), Math.min(1, e * 2.5)),
			up
		});
		switch (tr.fate) {
			case 'arrive':
				return at(cubicOut(t), g.s * cubicOut(Math.min(1, t / 0.4)));
			case 'flee':
				return at(cubicIn(t), f.s * (1 - cubicIn(Math.max(0, (t - 0.55) / 0.45))));
			case 'die':
				return { ...at(0, f.s * (t < 0.45 ? 1 : ((1 - t) / 0.55) ** 2)), tilt: f.tilt + Math.min(1.4, t * 2.4) };
			case 'fade':
				return at(cubicInOut(t), lerp(f.s, 0, t));
			default: {
				const p = at(cubicInOut(t), lerp(f.s, g.s, cubicInOut(t)));
				p.up = Math.sin(t * Math.PI * 3) * 0.012 * p.s;
				return p;
			}
		}
	}

	function stepTroops(): boolean {
		if (!marching) return false;
		const now = clock - marchStart;
		let done = true;
		cur = tracks.map((tr, k) => {
			if (now < tr.delay + tr.dur) done = false;
			if (tr.fate === 'die' && !tr.puffed && now >= tr.delay + tr.dur * 0.4) {
				tr.puffed = true;
				poof(tr.from.x, tr.from.y + 0.04, tr.from.z, 1);
			}
			return poseAt(tr, now);
		});
		write();
		if (done) marching = false;
		return marching;
	}

	/** Where every dot stands at the shown phase. */
	function goals(list: FieldDot[], live: boolean): Pose[] {
		const r = relief;
		return list.map((d) => {
			const [x, z] = toWorld([d.x, d.y]);
			return {
				x,
				y: d.naval ? 0.004 : groundAt(r, [d.x, d.y]) + 0.02,
				z,
				s: d.on && live ? 1 : 0,
				tilt: d.routed ? 0.55 : 0,
				yaw: yawOf(d.facing),
				up: 0
			};
		});
	}

	$effect(() => {
		const live = kit.active;
		const list = dots;
		const m = meshes;
		const goal = goals(list, live);
		list.forEach((d) => {
			const at = m.slot.get(d.key);
			if (!at) return;
			const c = colorOf(d.side);
			tint.set(d.routed ? mix(c, kit.palette.bg, 0.5) : d.unrecorded && !d.naval ? mix(c, '#ffffff', 0.25) : c);
			(at.group === 'ship' ? m.sail : m[at.group]).setColorAt(at.i, tint);
		});
		for (const mesh of [m.foot, m.ghost, m.horse, m.horseGhost, m.sail]) if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

		const forward = index > shownIndex && shownIndex >= 0;
		const snap = kit.instant || cur.length !== goal.length || replay !== shownReplay || !live;
		shownReplay = replay;
		shownIndex = index;
		const before = wasOn;
		wasOn = new Map(list.map((d) => [d.key, { on: d.on, routed: d.routed }]));
		const anchors = live ? territoryAnchors(b, index) : [];
		if (snap) {
			cur = goal.map((g) => ({ ...g }));
			tracks = [];
			marching = false;
			borders = null;
			paint(anchors);
			write();
			invalidate();
			return;
		}

		tracks = list.map((d, k) => {
			const from = { ...cur[k], up: 0 };
			const to = goal[k];
			const prev = before.get(d.key);
			const moved = Math.hypot(to.x - from.x, to.z - from.z);
			if (d.naval && moved > 0.04) to.yaw = Math.atan2(-(to.z - from.z), to.x - from.x);
			const base = d.delay;
			if (prev?.on && !d.on) {
				if (!forward) return { from, to, fate: 'fade', delay: base, dur: MARCH * 0.6, puffed: false };
				if (!d.present && prev.routed) {
					const away = Math.hypot(d.x - DISC.cx, d.y - DISC.cy) || 1;
					const p: Pt = [d.x + ((d.x - DISC.cx) / away) * 130, d.y + ((d.y - DISC.cy) / away) * 130];
					const [x, z] = toWorld(p);
					const run = { ...from, x, z, y: d.naval ? from.y : groundAt(relief, p) + 0.02, s: 0 };
					return { from, to: run, fate: 'flee', delay: base, dur: MARCH, puffed: false };
				}
				return { from, to: { ...from, s: 0 }, fate: 'die', delay: MARCH * 0.45 + base * 3, dur: 0.6, puffed: false };
			}
			if (!prev?.on && d.on && from.s < 0.01) {
				const back = { ...to, s: 0, x: to.x - Math.cos(-to.yaw) * 0.5, z: to.z - Math.sin(-to.yaw) * 0.5 };
				return { from: back, to, fate: 'arrive', delay: base, dur: MARCH, puffed: false };
			}
			return { from, to, fate: 'march', delay: base, dur: MARCH, puffed: false };
		});
		marchStart = clock;
		marching = true;
		if (shownAnchors.length) borders = { from: shownAnchors, to: anchors, start: clock, last: -1 };
		else {
			borders = null;
			paint(anchors);
		}
		wake();
	});

	/* —————————————— smoke: where men are lost, a Clash-of-Clans poof —————————————— */

	const PUFF_CAP = 360;
	const puffGeo = new IcosahedronGeometry(1, 0);
	const puffMat = new MeshStandardMaterial({ color: '#f3efe6', roughness: 1, flatShading: true, transparent: true, opacity: 0.92, depthWrite: false });
	const puffMesh = new InstancedMesh(puffGeo, puffMat, PUFF_CAP);
	puffMesh.count = 0;
	$effect(() => () => puffMesh.dispose());
	type Puff = { x: number; y: number; z: number; vx: number; vy: number; vz: number; born: number; life: number; size: number; spin: number };
	let puffs: Puff[] = [];
	/** A burst of white smoke at a point; `big` scales it (a named death). */
	function poof(x: number, y: number, z: number, big: number) {
		const n = Math.round(5 * big);
		for (let i = 0; i < n && puffs.length < PUFF_CAP; i++) {
			const a = (i / n) * Math.PI * 2 + Math.random() * 0.6;
			const out = (0.12 + Math.random() * 0.1) * big;
			puffs.push({
				x,
				y,
				z,
				vx: Math.cos(a) * out,
				vz: Math.sin(a) * out,
				vy: (0.35 + Math.random() * 0.25) * big,
				born: clock,
				life: 0.85 + Math.random() * 0.35,
				size: (0.03 + Math.random() * 0.018) * big,
				spin: Math.random() * 6
			});
		}
		wake();
	}
	function stepPuffs(): boolean {
		if (!puffs.length && !puffMesh.count) return false;
		puffs = puffs.filter((p) => clock - p.born < p.life);
		puffs.forEach((p, i) => {
			const t = (clock - p.born) / p.life;
			const drift = 1 - (1 - t) ** 2;
			dummy.position.set(p.x + p.vx * drift, p.y + p.vy * t * (1 - t * 0.35), p.z + p.vz * drift);
			dummy.rotation.set(p.spin * t, p.spin, 0);
			dummy.scale.setScalar(Math.max(0.0001, p.size * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.5 * (1 + t)));
			dummy.updateMatrix();
			puffMesh.setMatrixAt(i, dummy.matrix);
		});
		puffMesh.count = puffs.length;
		puffMesh.instanceMatrix.needsUpdate = true;
		return puffs.length > 0;
	}

	/* —————————————— fire: flames where the fighting is, and bigger where something burns —————————————— */

	const FLAME_CAP = 200;
	const flameGeo = flameGeometry();
	const flameMat = new MeshBasicMaterial({ vertexColors: true, toneMapped: false, side: DoubleSide });
	const flameMesh = new InstancedMesh(flameGeo, flameMat, FLAME_CAP);
	flameMesh.count = 0;
	$effect(() => () => flameMesh.dispose());
	type Flame = { x: number; y: number; z: number; h: number; seed: number; at: number };
	let flames: Flame[] = [];
	$effect(() => {
		const live = kit.active;
		const r = relief;
		const list: Flame[] = [];
		const now = clock;
		(phase.events ?? []).forEach((e, ei) => {
			if (!live || (e.kind !== 'fire' && e.kind !== 'clash')) return;
			const n = e.kind === 'fire' ? 9 : 8;
			const spread = e.kind === 'fire' ? 22 : 16;
			const delay = (900 + (phase.arrows?.length ?? 0) * 300 + ei * 220) / 1000;
			for (let k = 0; k < n && list.length < FLAME_CAP; k++) {
				const a = k * 2.4 + ei;
				const d = k ? spread * Math.sqrt(k / n) : 0;
				const p: Pt = [e.at[0] + Math.cos(a) * d, e.at[1] + Math.sin(a) * d * 0.8];
				const [x, z] = toWorld(p);
				list.push({ x, y: groundAt(r, p) + 0.01, z, h: (e.kind === 'fire' ? 0.14 : 0.1) * (1 - (0.28 * d) / spread), seed: ei * 7.3 + k * 1.7, at: now + (kit.instant ? 0 : delay) });
			}
		});
		flames = list;
		flameMesh.count = list.length;
		wake();
	});
	/** Fires stop flickering off screen; coming back into view lights them again. */
	$effect(() => {
		if (kit.visible && flames.length) wake();
	});
	function stepFires(): boolean {
		if (!flames.length) {
			if (!flameMesh.count) return false;
			flameMesh.count = 0;
			return false;
		}
		flames.forEach((f, i) => {
			const grow = Math.max(0, Math.min(1, (clock - f.at) / 0.5));
			const flick = 1 + Math.sin(clock * 11 + f.seed) * 0.16 + Math.sin(clock * 17.3 + f.seed * 2) * 0.09;
			const w = f.h * 0.42 * grow;
			dummy.position.set(f.x, f.y, f.z);
			dummy.rotation.set(Math.sin(clock * 5 + f.seed) * 0.12, f.seed, Math.cos(clock * 6 + f.seed) * 0.12);
			dummy.scale.set(Math.max(0.0001, w), Math.max(0.0001, f.h * grow * flick), Math.max(0.0001, w));
			dummy.updateMatrix();
			flameMesh.setMatrixAt(i, dummy.matrix);
		});
		flameMesh.instanceMatrix.needsUpdate = true;
		return kit.visible;
	}

	/* —————————————— rivers: chevrons drifting downstream —————————————— */

	const chevron = chevronGeometry();
	const flowMat = new MeshBasicMaterial({ color: '#f7fbff', transparent: true, opacity: 0.92, depthWrite: false, side: DoubleSide, toneMapped: false });
	const flow = $derived.by(() => {
		const pts = b.terrain.flatMap((t) => (t.kind === 'river' ? riverFlow(lineOf(t.points)) : []));
		const mesh = new InstancedMesh(chevron, flowMat, Math.max(1, pts.length));
		mesh.count = pts.length;
		return { pts, mesh };
	});
	$effect(() => {
		const mesh = flow.mesh;
		return () => mesh.dispose();
	});
	$effect(() => {
		if (kit.visible && flow.pts.length) wake();
	});
	function stepFlow(): boolean {
		const { pts, mesh } = flow;
		if (!pts.length || !kit.visible) return false;
		pts.forEach((p, i) => {
			const slide = ((clock * 0.22 + i * 0.13) % 1) * 0.22;
			dummy.position.set(p.x + Math.cos(p.yaw) * slide, p.y, p.z - Math.sin(p.yaw) * slide);
			dummy.rotation.set(0, p.yaw, 0);
			dummy.scale.setScalar(1.6);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
		return true;
	}

	/* —————————————— named characters and unit labels —————————————— */

	const spots = $derived(unitSpots(b, phase));
	const units = $derived(
		spots.map((s, n) => {
			const [x, z] = toWorld([s.cx, s.cy]);
			const y = groundAt(relief, [s.cx, s.cy]);
			const person = s.unit.hero ? byId.get(s.unit.hero) : undefined;
			const color = colorOf(s.unit.side);
			/** Plain units are named only on the full map, and only away from a commander's portrait. */
			const named = full && !person && !spots.some((o) => o.unit.hero && Math.hypot(o.cx - s.cx, o.cy - s.cy) < 150);
			return {
				named,
				id: s.unit.id,
				x,
				y,
				z,
				/** Named leaders standing together stack their portraits instead of covering each other. */
				rise: 0.36 + spots.slice(0, n).filter((o) => o.unit.hero && Math.hypot(o.cx - s.cx, o.cy - s.cy) < 120).length * 0.42,
				color,
				routed: !!s.state.routed,
				text: ko ? (s.unit.ko ?? s.unit.label) : s.unit.label,
				person: person
					? {
							img: avatarOf(person, person.id, b.year),
							name: ko ? (koreanOf(person, b.year) ?? nameOf(person, b.year)) : nameOf(person, b.year)
						}
					: null
			};
		})
	);

	/* —————————————— arrows and events —————————————— */

	const RADIUS: Record<string, number> = { charge: 0.026, advance: 0.019, flank: 0.019, naval: 0.017, retreat: 0.015, pursuit: 0.016, feint: 0.014 };
	const UP = new Vector3(0, 1, 0);
	const arrows = $derived(
		(phase.arrows ?? []).flatMap((a, i) => {
			const c = curveThrough(a.points, { endGap: 13 });
			if (!c) return [];
			const r = RADIUS[a.kind] ?? 0.015;
			const g = arrowGeometry(relief, c.samples, a.kind, r);
			return [
				{
					key: `${phase.id}:${i}`,
					...g,
					r,
					color: colorOf(a.side),
					quat: new Quaternion().setFromUnitVectors(UP, g.dir).toArray() as [number, number, number, number]
				}
			];
		})
	);
	$effect(() => {
		const list = arrows;
		return () => list.forEach((a) => a.tubes.forEach((t) => t.dispose()));
	});

	const reveal = new Tween(0, { duration: 1500, easing: cubicOut });
	$effect(() => {
		void arrows;
		if (!kit.active) return void reveal.set(0, { duration: 0 });
		reveal.set(0, { duration: 0 }).then(() => reveal.set(1, { duration: kit.instant ? 0 : 1500, delay: 250 }));
	});
	$effect(() => {
		const p = reveal.current;
		for (const a of arrows) {
			const n = a.tubes.length;
			a.tubes.forEach((t, k) => {
				const local = Math.max(0, Math.min(1, p * n - k));
				const count = t.index?.count ?? 0;
				t.setDrawRange(0, Math.floor((count * local) / 6) * 6);
			});
		}
		invalidate();
	});
	const headGeo = new ConeGeometry(1, 1, 12);

	const ICON: Record<EventKind, string> = {
		clash: 'swords',
		fire: 'local_fire_department',
		death: 'skull',
		gate: 'door_open',
		flood: 'flood',
		surrender: 'flag',
		ambush: 'visibility'
	};
	const events = $derived(
		(phase.events ?? []).map((e, i) => {
			const [x, z] = toWorld(e.at);
			return {
				key: `${phase.id}:e${i}`,
				kind: e.kind,
				at: [x, groundAt(relief, e.at) + 0.12, z] as [number, number, number],
				label: e.label ? (ko ? (e.ko ?? e.label) : e.label) : undefined,
				delay: 900 + (phase.arrows?.length ?? 0) * 300 + i * 220
			};
		})
	);
	/** A named death goes up in a big poof when its marker lands. */
	$effect(() => {
		if (!kit.active || kit.instant) return;
		const list = events.filter((e) => e.kind === 'death');
		const timers = list.map((e) => setTimeout(() => poof(e.at[0], e.at[1] - 0.1, e.at[2], 2.2), e.delay));
		return () => timers.forEach(clearTimeout);
	});

	/* —————————————— earthworks raised between phases —————————————— */

	const MOUND_H = 0.95;
	const moundGeo = new LatheGeometry(
		[new Vector2(1, 0), new Vector2(0.86, 0.14), new Vector2(0.62, 0.42), new Vector2(0.4, 0.72), new Vector2(0.2, 0.93), new Vector2(0, 1)],
		18
	);
	const mounds = $derived(
		b.terrain.flatMap((t: Terrain) => {
			if (t.kind !== 'mound') return [];
			const m = moundAt(b, t, index);
			const [x, z] = toWorld(t.at);
			return [{ x, y: groundAt(relief, t.at) - 0.01, z, r: (t.r ?? 40) / 100, rise: m.rise, banner: sideBanner(b, m.hold, colorOf(m.hold)) }];
		})
	);
	const moundRise = new Tween<number[]>([], { duration: 1600, easing: cubicInOut });
	$effect(() => {
		const goal = mounds.map((m) => (kit.active ? m.rise : 0));
		moundRise.set(goal, { duration: kit.instant || moundRise.current.length !== goal.length ? 0 : 1600 });
	});
	$effect(() => {
		void moundRise.current;
		invalidate();
	});

	const terrainLabels = $derived(
		b.terrain.flatMap((t: Terrain, i) => {
			if (!t.label || (!full && t.kind === 'label')) return [];
			const at: Pt = t.labelAt ?? ('at' in t ? t.at : 'points' in t ? t.points[Math.floor(t.points.length / 2)] : [500, 280]);
			const [x, z] = toWorld(at);
			return [{ key: `t${i}`, text: ko ? (t.ko ?? t.label) : t.label, kind: t.kind, at: [x, groundAt(relief, at) + 0.06, z] as [number, number, number] }];
		})
	);
</script>

<T.Group position.y={LIFT}>
	<T.Mesh geometry={ground} receiveShadow castShadow>
		<T.MeshStandardMaterial vertexColors side={DoubleSide} roughness={0.92} metalness={0} />
	</T.Mesh>

	<T.Mesh geometry={waterDisc} rotation.x={-Math.PI / 2} position.y={0} receiveShadow>
		<T.MeshStandardMaterial color={pal.water} transparent opacity={0.9} roughness={0.22} metalness={0.15} />
	</T.Mesh>

	{#each strips as s, i (i)}
		<T.Mesh geometry={s.geo} receiveShadow>
			<T.MeshStandardMaterial color={s.color} side={DoubleSide} roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
		</T.Mesh>
	{/each}

	<T.Mesh geometry={drape} renderOrder={1} visible={kit.active}>
		<T.MeshBasicMaterial map={territory} transparent depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-4} />
	</T.Mesh>

	<T.Mesh geometry={built.geometry} castShadow receiveShadow>
		<T.MeshStandardMaterial vertexColors flatShading roughness={0.75} />
	</T.Mesh>

	{#each flags as f (f.key)}
		<BattleFlag at={f.at} banner={f.banner} big={f.big} />
	{/each}

	<T is={meshes.foot} />
	<T is={meshes.ghost} />
	<T is={meshes.horse} />
	<T is={meshes.horseGhost} />
	<T is={flow.mesh} />
	<T is={meshes.hull} />
	<T is={meshes.sail} />
	<T is={puffMesh} renderOrder={3} />
	<T is={flameMesh} renderOrder={2} />

	{#each mounds as m, i (i)}
		{@const h = Math.max(0.001, (moundRise.current[i] ?? 0) * MOUND_H)}
		<T.Mesh geometry={moundGeo} position={[m.x, m.y, m.z]} scale={[m.r, h, m.r]} visible={h > 0.01} castShadow receiveShadow>
			<T.MeshStandardMaterial color={pal.mound} roughness={0.95} flatShading />
		</T.Mesh>
		{#if m.banner && h > 0.08}
			<BattleFlag at={[m.x, m.y + h - 0.02, m.z]} banner={m.banner} />
		{/if}
	{/each}

	{#each arrows as a (a.key)}
		{#each a.tubes as t, k (k)}
			<T.Mesh geometry={t}>
				<T.MeshBasicMaterial color={a.color} toneMapped={false} />
			</T.Mesh>
		{/each}
		<T.Mesh geometry={headGeo} position={[a.end.x, a.end.y, a.end.z]} quaternion={a.quat} scale={[a.r * 3.6, a.r * 7, a.r * 3.6]} visible={reveal.current > 0.97}>
			<T.MeshBasicMaterial color={a.color} toneMapped={false} />
		</T.Mesh>
	{/each}
</T.Group>

{#each terrainLabels as t (t.key)}
	<KitLabel at={[t.at[0], t.at[1] + LIFT, t.at[2]]} tone="note" size="xs" minor en={t.text} />
{/each}

{#each units as u (u.id)}
	{#if u.person}
		<KitLabel at={[u.x, u.y + LIFT + u.rise, u.z]} lift tone="note" accent={u.color} delay={300}>
			<span class="hero" class:routed={u.routed} style:--c={u.color}>
				{#if u.person.img}<img src={u.person.img} alt="" loading="lazy" decoding="async" />{/if}
				<b>{u.person.name}</b>
			</span>
		</KitLabel>
	{:else if u.named}
		<KitLabel at={[u.x, u.y + LIFT + 0.12, u.z]} lift tone="accent" size="xs" accent={u.color} delay={300}>
			<span class="unit" class:routed={u.routed}>{u.text}</span>
		</KitLabel>
	{/if}
{/each}

{#each events as e (e.key)}
	<KitLabel at={[e.at[0], e.at[1] + LIFT, e.at[2]]} lift delay={e.delay} tone="plain" size="xs">
		<span class="event {e.kind}">
			<span class="material-symbols-outlined" aria-hidden="true">{ICON[e.kind]}</span>
			{#if full && e.label}<span>{e.label}</span>{/if}
		</span>
	</KitLabel>
{/each}

<style>
	.hero {
		display: grid;
		justify-items: center;
		gap: 0.15em;
		margin: -0.1em -0.2em;
	}

	.hero img {
		width: clamp(20px, 3.6cqi, 34px);
		height: clamp(20px, 3.6cqi, 34px);
		border-radius: 50%;
		object-fit: cover;
		object-position: 50% 18%;
		border: 2px solid var(--c);
		box-shadow:
			0 0 0 2px color-mix(in srgb, var(--panel, #16161c) 80%, transparent),
			0 6px 14px rgb(0 0 0 / 0.35);
		background: var(--panel-sunken, #0c0c10);
	}

	.hero b {
		text-shadow:
			0 0 6px var(--bg),
			0 0 2px var(--bg);
		font-family: var(--serif);
		font-size: 0.9em;
		line-height: 1;
		color: var(--fg);
	}

	.unit {
		font-weight: 600;
	}

	.routed {
		opacity: 0.55;
	}

	.routed img {
		filter: grayscale(1);
	}

	.event {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
	}

	.event .material-symbols-outlined {
		font-size: 1.35em;
		color: var(--gold);
	}

	.event.death .material-symbols-outlined,
	.event.fire .material-symbols-outlined {
		color: #ff5a52;
	}

	.event.clash .material-symbols-outlined {
		color: #ff9a3c;
	}

	.event.flood .material-symbols-outlined {
		color: #6fb3ff;
	}
</style>
