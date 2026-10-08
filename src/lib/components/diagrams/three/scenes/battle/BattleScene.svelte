<script lang="ts">
	/**
	 * A battle on its real ground: the baked relief bent to the sheet, cartoon Samhan
	 * fortresses flying their holders' flags (swapped when a phase changes hands), troop
	 * tokens that march between phases, arcing arrows, and a large portrait ring over
	 * every unit a named character leads. Labels are DOM (KitLabel).
	 */
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		Color,
		ConeGeometry,
		CylinderGeometry,
		DoubleSide,
		InstancedMesh,
		LatheGeometry,
		MeshStandardMaterial,
		Object3D,
		PlaneGeometry,
		Quaternion,
		TorusGeometry,
		Vector2,
		Vector3,
		type BufferGeometry
	} from 'three';
	import { Tween } from 'svelte/motion';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { BATTLES, fieldDots, flagSites, heldBy, moundAt, sideColors, unitSpots, type EventKind, type Terrain } from '$lib/battles';
	import { WORLD, buildRelief, groundAt, groundPalette, lineOf, toWorld } from '$lib/battleTerrain';
	import { sideBanner } from '$lib/banners';
	import { curveThrough, type Pt } from '$lib/mapPaths';
	import { avatarOf, byId, koreanOf, nameOf } from '$lib/people';
	import { getKit, mix, type Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import BattleFlag from './BattleFlag.svelte';
	import { buildStructures } from './structures';
	import { arrowGeometry, ribbonGeometry, terrainGeometry } from './ground';

	let {
		battle,
		index = 0,
		ko = false,
		az = 0,
		full = false
	}: { battle: string; index?: number; ko?: boolean; az?: number; full?: boolean } = $props();

	const kit = getKit();
	const { invalidate } = useThrelte();
	/** The slab's skirt hangs this far below sea level; the group lifts it onto the floor. */
	const LIFT = 0.22;
	const MARCH = 1.15;

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
	const ground = $derived(terrainGeometry(relief, pal));
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
				? [{ geo: ribbonGeometry(relief, lineOf(t.points), (t.width ?? 14) / 100, 0.004, true), color: pal.river }]
				: t.kind === 'road'
					? [{ geo: ribbonGeometry(relief, lineOf(t.points), 0.032, 0.008), color: pal.road }]
					: []
		)
	);
	const waterPlane = new PlaneGeometry(WORLD.w, WORLD.d);

	$effect(() => {
		const owned: BufferGeometry[] = [ground, built.geometry, ...strips.map((s) => s.geo)];
		invalidate();
		return () => owned.forEach((g) => g.dispose());
	});

	$effect(() => {
		kit.fit({ min: [-WORLD.w / 2, 0, -WORLD.d / 2], max: [WORLD.w / 2, relief.maxY + LIFT + 0.3, WORLD.d / 2] }, { az, el: 0.8 });
	});

	/* —————————————— troops —————————————— */

	const dotGeo = new CylinderGeometry(0.048, 0.054, 0.05, 14);
	const solidMat = new MeshStandardMaterial({ roughness: 0.45, metalness: 0.05 });
	const ghostMat = new MeshStandardMaterial({ roughness: 0.6, transparent: true, opacity: 0.62, depthWrite: false });

	const dots = $derived(fieldDots(b, index));
	/** One mesh for recorded forces, one see-through mesh for forces of unrecorded size. */
	const meshes = $derived.by(() => {
		const all = fieldDots(b, 0);
		const solid = all.filter((d) => !d.unrecorded).length;
		const ghost = all.length - solid;
		return {
			solid: new InstancedMesh(dotGeo, solidMat, Math.max(1, solid)),
			ghost: new InstancedMesh(dotGeo, ghostMat, Math.max(1, ghost))
		};
	});
	$effect(() => {
		const m = meshes;
		m.solid.castShadow = true;
		return () => {
			m.solid.dispose();
			m.ghost.dispose();
		};
	});

	type Pose = { x: number; y: number; z: number; s: number; tilt: number };
	let from: Pose[] = [];
	let cur: Pose[] = [];
	let goal: Pose[] = [];
	let delays: number[] = [];
	let elapsed = 0;
	const dummy = new Object3D();
	const tint = new Color();

	function write() {
		const m = meshes;
		const counters = { solid: 0, ghost: 0 };
		dots.forEach((d, k) => {
			const which = d.unrecorded ? 'ghost' : 'solid';
			const mesh = m[which];
			const i = counters[which]++;
			const p = cur[k];
			if (!p) return;
			dummy.position.set(p.x, p.y, p.z);
			dummy.rotation.set(0, 0, p.tilt);
			dummy.scale.setScalar(Math.max(0.0001, p.s));
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		m.solid.instanceMatrix.needsUpdate = true;
		m.ghost.instanceMatrix.needsUpdate = true;
		invalidate();
	}

	const march = useTask(
		(delta) => {
			elapsed += delta;
			let done = true;
			cur = goal.map((g, k) => {
				const f = from[k] ?? g;
				const t = Math.max(0, Math.min(1, (elapsed - (delays[k] ?? 0)) / MARCH));
				if (t < 1) done = false;
				const e = cubicInOut(t);
				return { x: f.x + (g.x - f.x) * e, y: f.y + (g.y - f.y) * e, z: f.z + (g.z - f.z) * e, s: f.s + (g.s - f.s) * e, tilt: f.tilt + (g.tilt - f.tilt) * e };
			});
			write();
			if (done) march.stop();
		},
		{ autoStart: false, autoInvalidate: false }
	);

	$effect(() => {
		const live = kit.active;
		const r = relief;
		const m = meshes;
		goal = dots.map((d) => {
			const [x, z] = toWorld([d.x, d.y]);
			return { x, y: groundAt(r, [d.x, d.y]) + 0.02, z, s: d.on && live ? 1 : 0, tilt: d.routed ? 0.55 : 0 };
		});
		delays = dots.map((d) => d.delay);
		const counters = { solid: 0, ghost: 0 };
		dots.forEach((d) => {
			const which = d.unrecorded ? 'ghost' : 'solid';
			const c = colorOf(d.side);
			tint.set(d.routed ? mix(c, kit.palette.bg, 0.5) : d.unrecorded ? mix(c, '#ffffff', 0.25) : c);
			m[which].setColorAt(counters[which]++, tint);
		});
		if (m.solid.instanceColor) m.solid.instanceColor.needsUpdate = true;
		if (m.ghost.instanceColor) m.ghost.instanceColor.needsUpdate = true;
		if (kit.instant || cur.length !== goal.length) {
			cur = goal.map((g) => ({ ...g }));
			write();
			return;
		}
		from = cur.map((p) => ({ ...p }));
		elapsed = 0;
		march.start();
	});

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
				ringR: Math.min(0.42, s.reach / 100 + 0.12),
				/** Named leaders standing together stack their portraits instead of covering each other. */
				rise: 0.36 + (spots.slice(0, n).filter((o) => o.unit.hero && Math.hypot(o.cx - s.cx, o.cy - s.cy) < 120).length) * 0.42,
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
	const ringGeo = new TorusGeometry(1, 0.04, 6, 48);

	/* —————————————— arrows and events —————————————— */

	const RADIUS: Record<string, number> = { charge: 0.022, advance: 0.016, flank: 0.016, naval: 0.014, retreat: 0.013, pursuit: 0.014, feint: 0.012 };
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
					quat: new Quaternion().setFromUnitVectors(UP, g.dir).toArray() as [number, number, number, number],
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

	<T.Mesh geometry={waterPlane} rotation.x={-Math.PI / 2} position.y={0} receiveShadow>
		<T.MeshStandardMaterial color={pal.water} transparent opacity={0.9} roughness={0.22} metalness={0.15} />
	</T.Mesh>

	{#each strips as s, i (i)}
		<T.Mesh geometry={s.geo} receiveShadow>
			<T.MeshStandardMaterial color={s.color} side={DoubleSide} roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
		</T.Mesh>
	{/each}

	<T.Mesh geometry={built.geometry} castShadow receiveShadow>
		<T.MeshStandardMaterial vertexColors flatShading roughness={0.75} />
	</T.Mesh>

	{#each flags as f (f.key)}
		<BattleFlag at={f.at} banner={f.banner} big={f.big} />
	{/each}

	<T is={meshes.solid} />
	<T is={meshes.ghost} />

	{#each mounds as m, i (i)}
		{@const h = Math.max(0.001, (moundRise.current[i] ?? 0) * MOUND_H)}
		<T.Mesh geometry={moundGeo} position={[m.x, m.y, m.z]} scale={[m.r, h, m.r]} visible={h > 0.01} castShadow receiveShadow>
			<T.MeshStandardMaterial color={pal.mound} roughness={0.95} flatShading />
		</T.Mesh>
		{#if m.banner && h > 0.08}
			<BattleFlag at={[m.x, m.y + h - 0.02, m.z]} banner={m.banner} />
		{/if}
	{/each}

	{#each units as u (u.id)}
		{#if u.person}
			<T.Mesh geometry={ringGeo} position={[u.x, u.y + 0.02, u.z]} rotation.x={-Math.PI / 2} scale={[u.ringR, u.ringR, 1]}>
				<T.MeshStandardMaterial color={u.color} emissive={u.color} emissiveIntensity={0.6} />
			</T.Mesh>
		{/if}
	{/each}

	{#each arrows as a (a.key)}
		{#each a.tubes as t, k (k)}
			<T.Mesh geometry={t} castShadow>
				<T.MeshStandardMaterial color={a.color} emissive={a.color} emissiveIntensity={0.3} roughness={0.4} />
			</T.Mesh>
		{/each}
		<T.Mesh geometry={headGeo} position={[a.end.x, a.end.y, a.end.z]} quaternion={a.quat} scale={[a.r * 3.4, a.r * 8, a.r * 3.4]} visible={reveal.current > 0.97} castShadow>
			<T.MeshStandardMaterial color={a.color} emissive={a.color} emissiveIntensity={0.3} roughness={0.4} />
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
		width: clamp(24px, 5cqi, 44px);
		height: clamp(24px, 5cqi, 44px);
		border-radius: 50%;
		object-fit: cover;
		object-position: 50% 18%;
		border: 3px solid var(--c);
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

	.event.flood .material-symbols-outlined {
		color: #6fb3ff;
	}
</style>
