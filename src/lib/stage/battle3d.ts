/**
 * A battle played on the real grounds. The battle sheet (1000 × 560 field units, x east,
 * y south) is laid over the site: one field dot (a thousand men) stands as a small squad of
 * soldiers, riders or a ship, in its side's colour, and every unit carries its banner.
 * Phases glide from one to the next on each dot's own beat; fires burn and clashes spark
 * where the sheet says they happen, and every held fort flies its holder's flag.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { FIELD, fieldDots, flagSites, heldBy, sideColors, type Battle, type FieldDot } from '$lib/battles';
import type { Pt } from '$lib/mapPaths';
import { patchFlag, type TimeUniform } from './build/nature';
import type { SiteBuild, View } from './build/types';

export type BattleStage = {
	group: THREE.Group;
	views: View[];
	setPhase(index: number): void;
	tick(t: number, dt: number): void;
	dispose(): void;
};

/** Where the battle sheet sits on a site: the field point laid on `at` (world x, z), turned by `rot` radians. */
export type BattleFit = { anchor?: Pt; at?: [number, number]; rot?: number; scale?: number };

const STEEL = '#8c9198';
const SKIN = '#d9b896';
const HULL = '#5a3f2c';
const HORSES = ['#6b3a22', '#3a2618', '#8a5a34', '#2a2420', '#cfc6b4'];
/** Figures across the whole field, so a big battle stays a crowd and not a slideshow. */
const FIGURE_BUDGET = 5200;
const TWEEN = 3.2;

function cone(rTop: number, rBot: number, h: number, y: number, seg = 7): THREE.BufferGeometry {
	return new THREE.CylinderGeometry(rTop, rBot, h, seg, 1).translate(0, y, 0);
}

function merged(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
	const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)));
	for (const p of parts) p.dispose();
	return g ?? new THREE.BufferGeometry();
}

/** Soldier cloth: the side's colour peeking under steel lamellar, coat skirt and shoulder flaps. */
function clothGeo(): THREE.BufferGeometry {
	const flaps = [-1, 1].map((s) => cone(0.07, 0.12, 0.26, 0, 5).rotateZ(s * 0.5).translate(s * 0.22, 1.24, 0));
	return merged([cone(0.17, 0.3, 0.62, 0.62), ...flaps]);
}

/** Steel: lamellar torso, legs, the tall pointed helm, and a spear held upright. */
function steelGeo(): THREE.BufferGeometry {
	return merged([
		cone(0.2, 0.18, 0.55, 1.12),
		cone(0.08, 0.09, 0.4, 0.2).translate(-0.08, 0, 0),
		cone(0.08, 0.09, 0.4, 0.2).translate(0.08, 0, 0),
		cone(0.015, 0.12, 0.26, 1.66),
		cone(0.12, 0.12, 0.05, 1.55),
		cone(0.018, 0.018, 3.2, 1.3).translate(0.3, 0.2, 0.05),
		cone(0, 0.04, 0.24, 2.98).translate(0.3, 0.2, 0.05)
	]);
}

function headGeo(): THREE.BufferGeometry {
	return new THREE.SphereGeometry(0.11, 7, 5).translate(0, 1.47, 0);
}

/** A horse, nose to +z: barrel, neck, head, four legs and a tail. */
function horseGeo(): THREE.BufferGeometry {
	const legs = [
		[-0.22, 0.55],
		[0.22, 0.55],
		[-0.22, -0.6],
		[0.22, -0.6]
	].map(([x, z]) => cone(0.06, 0.08, 1.05, 0.52).translate(x, 0, z));
	return merged([
		new THREE.CapsuleGeometry(0.34, 1.2, 3, 8).rotateX(Math.PI / 2).translate(0, 1.25, 0),
		cone(0.14, 0.24, 0.8, 0).rotateX(-0.7).translate(0, 1.6, 0.85),
		new THREE.CapsuleGeometry(0.12, 0.4, 2, 6).rotateX(1.2).translate(0, 1.88, 1.2),
		cone(0.02, 0.08, 0.7, 0).rotateX(0.5).translate(0, 1.05, -0.95),
		...legs
	]);
}

/** Hull and mast of a war boat 1 m long (scaled per kingdom), bow to +z. */
function hullGeo(): THREE.BufferGeometry {
	const shape = new THREE.Shape();
	shape.moveTo(0, 0.5);
	shape.quadraticCurveTo(0.12, 0.25, 0.12, -0.05);
	shape.lineTo(0.1, -0.5);
	shape.lineTo(-0.1, -0.5);
	shape.lineTo(-0.12, -0.05);
	shape.quadraticCurveTo(-0.12, 0.25, 0, 0.5);
	const hull = new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: false }).rotateX(Math.PI / 2).translate(0, 0.07, 0);
	return merged([hull, cone(0.005, 0.007, 0.5, 0.3), new THREE.BoxGeometry(0.2, 0.05, 0.25).translate(0, 0.09, -0.32)]);
}

/** A square sail on the mast, facing the bow. */
function sailGeo(): THREE.BufferGeometry {
	return new THREE.PlaneGeometry(0.2, 0.3, 4, 4).translate(0, 0.36, 0.01);
}

/** A tall war banner: pole and a pole-pinned sheet (uv.x 0 at the pole) that waves. */
function poleGeo(): THREE.BufferGeometry {
	return merged([cone(0.06, 0.08, 8, 4), cone(0.03, 0.03, 2.6, 0).rotateZ(Math.PI / 2).translate(1.3, 7.85, 0)]);
}

function clothSheet(): THREE.BufferGeometry {
	return new THREE.PlaneGeometry(2.5, 4, 8, 10).translate(1.3, 5.9, 0);
}

type Slot = { dot: number; dx: number; dz: number; yaw: number };

export function stageBattle(b: Battle, site: SiteBuild, fit: BattleFit = {}): BattleStage {
	const group = new THREE.Group();
	group.name = 'battle';
	const colors = sideColors(b);
	const kingdomOf = new Map(b.sides.map((s) => [s.id, s.kingdom ?? '']));

	/* ---------------------------------------------------------- the sheet on the ground */

	const mpp = b.scale ? (b.scale.km * 1000) / b.scale.px : 12;
	const k = Math.min(mpp, (site.radius * 2.2) / FIELD.w) * (fit.scale ?? 1);
	const flags = flagSites(b);
	const town = flags.find((f) => f.t.kind === 'city' || f.t.kind === 'town' || f.t.kind === 'fort');
	const anchor: Pt = fit.anchor ?? town?.at ?? [FIELD.w / 2, FIELD.h / 2];
	const at = fit.at ?? site.center;
	const cr = Math.cos(fit.rot ?? 0);
	const sr = Math.sin(fit.rot ?? 0);
	const world = (p: Pt): [number, number] => {
		const x = (p[0] - anchor[0]) * k;
		const z = (p[1] - anchor[1]) * k;
		return [at[0] + x * cr - z * sr, at[1] + x * sr + z * cr];
	};
	const yawOf = (facing: number) => {
		const f = (facing * Math.PI) / 180;
		// field facing: 0 east, 90 south; figures face +z
		const dx = Math.cos(f) * cr - Math.sin(f) * sr;
		const dz = Math.cos(f) * sr + Math.sin(f) * cr;
		return Math.atan2(dx, dz);
	};

	// every phase's dots, keyed the same, so each one can glide
	const phases = b.phases.map((_, i) => fieldDots(b, i));
	const base: FieldDot[] = phases[0] ?? [];
	const index = new Map(base.map((d, i) => [d.key, i]));
	const N = base.length;
	const P = phases.length;
	const px = new Float32Array(P * N);
	const pz = new Float32Array(P * N);
	const pyaw = new Float32Array(P * N);
	const pon = new Uint8Array(P * N);
	const prout = new Uint8Array(P * N);
	phases.forEach((dots, pi) => {
		for (const d of dots) {
			const j = index.get(d.key);
			if (j === undefined) continue;
			const [x, z] = world([d.x, d.y]);
			px[pi * N + j] = x;
			pz[pi * N + j] = z;
			pyaw[pi * N + j] = yawOf(d.facing);
			pon[pi * N + j] = d.on && d.present ? 1 : 0;
			prout[pi * N + j] = d.routed ? 1 : 0;
		}
	});

	/* ---------------------------------------------------------- squads */

	const landDots = base.filter((d) => d.arm !== 'ship').length;
	const per = Math.max(3, Math.min(14, Math.round(FIGURE_BUDGET / Math.max(1, landDots))));
	const spacing = Math.min(2.2, Math.max(1.3, (11.5 * k) / Math.sqrt(per) / 2.2));
	const foot: Slot[] = [];
	const riders: Slot[] = [];
	const ships: Slot[] = [];
	let seed = 1;
	const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
	base.forEach((d, j) => {
		if (d.arm === 'ship') {
			ships.push({ dot: j, dx: 0, dz: 0, yaw: 0 });
			return;
		}
		const n = d.arm === 'horse' ? Math.max(2, Math.round(per / 2)) : per;
		const cols = Math.ceil(Math.sqrt(n * 1.6));
		const gap = d.arm === 'horse' ? spacing * 1.9 : spacing;
		for (let m = 0; m < n; m++) {
			const c = m % cols;
			const r = Math.floor(m / cols);
			const slot = { dot: j, dx: (c - (cols - 1) / 2) * gap + (rand() - 0.5) * 0.4, dz: -r * gap * (d.arm === 'horse' ? 1.6 : 1) + (rand() - 0.5) * 0.4, yaw: (rand() - 0.5) * 0.2 };
			(d.arm === 'horse' ? riders : foot).push(slot);
		}
	});
	const people = [...foot, ...riders];

	const clothMat = new THREE.MeshStandardMaterial({ roughness: 0.75 });
	const steelMat = new THREE.MeshStandardMaterial({ color: STEEL, roughness: 0.4, metalness: 0.6 });
	const skinMat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.7 });
	const horseMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
	const hullMat = new THREE.MeshStandardMaterial({ color: HULL, roughness: 0.75 });
	const sailMat = new THREE.MeshStandardMaterial({ roughness: 0.7, side: THREE.DoubleSide });
	const poleMat = new THREE.MeshStandardMaterial({ color: '#4a3524', roughness: 0.8 });
	const time: TimeUniform = { value: 0 };
	const wind: TimeUniform = { value: 0.8 };
	const flagMat = new THREE.MeshStandardMaterial({ roughness: 0.7, side: THREE.DoubleSide });
	patchFlag(flagMat, time, wind);
	patchFlag(sailMat, time, { value: 0.25 });

	const inst = (geo: THREE.BufferGeometry, mat: THREE.Material, n: number, color = false) => {
		const m = new THREE.InstancedMesh(geo, mat, Math.max(1, n));
		m.count = n;
		m.castShadow = true;
		m.frustumCulled = false;
		if (color) m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, n) * 3), 3);
		group.add(m);
		return m;
	};
	const cloth = inst(clothGeo(), clothMat, people.length, true);
	const steel = inst(steelGeo(), steelMat, people.length);
	const heads = inst(headGeo(), skinMat, people.length);
	const horses = inst(horseGeo(), horseMat, riders.length, true);
	const hulls = inst(hullGeo(), hullMat, ships.length);
	const sails = inst(sailGeo(), sailMat, ships.length, true);

	const col = new THREE.Color();
	people.forEach((s, i) => cloth.setColorAt(i, col.set(colors.get(base[s.dot].side) ?? '#888888')));
	riders.forEach((_, i) => horses.setColorAt(i, col.set(HORSES[i % HORSES.length])));
	ships.forEach((s, i) => sails.setColorAt(i, col.set(colors.get(base[s.dot].side) ?? '#888888')));
	const shipLen = (dot: number) => {
		const kd = kingdomOf.get(base[dot].side);
		return kd === 'tang' ? 32 : kd === 'goguryeo' ? 25 : kd === 'silla' ? 20 : kd === 'baekje' ? 18 : kd === 'yamato' ? 15 : 18;
	};

	/* ---------------------------------------------------------- banners: one per unit, one per held fort */

	const units = b.units;
	const unitDots = units.map((u) => base.map((d, j) => (d.unit === u.id ? j : -1)).filter((j) => j >= 0));
	const nBanners = units.length + flags.length;
	const poles = inst(poleGeo(), poleMat, nBanners);
	const sheets = inst(clothSheet(), flagMat, nBanners, true);
	units.forEach((u, i) => sheets.setColorAt(i, col.set(colors.get(u.side) ?? '#888888')));
	const fortAt = flags.map((f) => world(f.at));

	/* ---------------------------------------------------------- fire and clash */

	type Fx = { kind: 'fire' | 'clash'; x: number; z: number; phase: number };
	const fx: Fx[] = b.phases.flatMap((ph, pi) =>
		(ph.events ?? [])
			.filter((e) => e.kind === 'fire' || e.kind === 'clash' || e.kind === 'ambush' || e.kind === 'gate')
			.map((e) => {
				const [x, z] = world(e.at);
				return { kind: e.kind === 'fire' || e.kind === 'gate' ? ('fire' as const) : ('clash' as const), x, z, phase: pi };
			})
	);
	const FLAMES = 14;
	const flameMat = new THREE.MeshBasicMaterial({ color: '#ff8a2a', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
	const smokeMat = new THREE.MeshStandardMaterial({ color: '#3b3632', transparent: true, opacity: 0.35, depthWrite: false, roughness: 1 });
	const fires = fx.filter((f) => f.kind === 'fire');
	const flames = inst(cone(0, 1, 1, 0.5, 6), flameMat, fires.length * FLAMES);
	flames.castShadow = false;
	const smoke = inst(new THREE.IcosahedronGeometry(1, 1), smokeMat, fires.length * FLAMES);
	smoke.castShadow = false;
	const fireLights = fires.slice(0, 3).map(() => {
		const l = new THREE.PointLight('#ff9a4a', 0, 140, 1.6);
		group.add(l);
		return l;
	});
	const SPARKS = 60;
	const clashes = fx.filter((f) => f.kind === 'clash');
	const sparkGeo = new THREE.BufferGeometry();
	sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Math.max(1, clashes.length * SPARKS) * 3), 3));
	sparkGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
	const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: '#ffd27a', size: 0.5, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
	group.add(sparks);

	/* ---------------------------------------------------------- views over the field */

	let cx = 0;
	let cz = 0;
	let span = 0;
	for (let j = 0; j < N; j++) {
		cx += px[j];
		cz += pz[j];
	}
	cx = N ? cx / N : at[0];
	cz = N ? cz / N : at[1];
	for (let j = 0; j < N; j++) span = Math.max(span, Math.hypot(px[j] - cx, pz[j] - cz));
	span = Math.max(120, Math.min(site.radius * 1.4, span));
	const gy = site.height(cx, cz);
	const views: View[] = [
		{ id: 'battle', en: 'Battle', ko: '전장', pos: [cx - span * 0.75, gy + span * 0.62, cz + span * 0.85], target: [cx, gy, cz], fov: 42 },
		{ id: 'melee', en: 'In the ranks', ko: '대열 속', pos: [cx - span * 0.16, gy + 14, cz + span * 0.2], target: [cx + span * 0.05, gy + 6, cz - span * 0.05], fov: 46 }
	];

	/* ---------------------------------------------------------- moving between phases */

	let from = 0;
	let to = 0;
	let clock = TWEEN + 1;
	const landY = new Float32Array(people.length);
	// the water under each ship where it starts and ends the glide: one raycast per ship per phase
	const shipFrom = new Float32Array(ships.length);
	const shipTo = new Float32Array(ships.length);
	const shipOf = new Map(ships.map((s, i) => [s.dot, i]));
	const waterAt = (j: number, pi: number) => {
		const x = px[pi * N + j];
		const z = pz[pi * N + j];
		return site.water(x, z) ?? site.height(x, z);
	};
	function sounding() {
		ships.forEach((s, i) => {
			shipFrom[i] = waterAt(s.dot, from);
			shipTo[i] = from === to ? shipFrom[i] : waterAt(s.dot, to);
		});
	}
	const dummy = new THREE.Object3D();
	const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
	const lerpAngle = (a: number, b2: number, t: number) => {
		let d = b2 - a;
		d = Math.atan2(Math.sin(d), Math.cos(d));
		return a + d * t;
	};

	function seat(dot: number, t: number) {
		const a = from * N + dot;
		const c = to * N + dot;
		const e = ease((t - base[dot].delay * 3) / (TWEEN * 0.75));
		const x = px[a] + (px[c] - px[a]) * e;
		const z = pz[a] + (pz[c] - pz[a]) * e;
		const yaw = lerpAngle(pyaw[a], pyaw[c], Math.min(1, e * 2));
		const show = pon[a] + (pon[c] - pon[a]) * e;
		const routed = prout[a] + (prout[c] - prout[a]) * e;
		return { x, z, yaw, show, routed, e, moving: e > 0 && e < 1 && (px[a] !== px[c] || pz[a] !== pz[c]) };
	}

	function placePeople(t: number) {
		let ri = 0;
		people.forEach((s, i) => {
			const d = seat(s.dot, clock);
			const horse = i >= foot.length;
			const loose = 1 + d.routed * 1.8;
			const cy = Math.cos(d.yaw);
			const sy = Math.sin(d.yaw);
			const ox = (s.dx * cy + s.dz * sy) * loose;
			const oz = (-s.dx * sy + s.dz * cy) * loose;
			const x = d.x + ox;
			const z = d.z + oz;
			landY[i] = site.height(x, z);
			const bob = d.moving ? Math.abs(Math.sin(t * (horse ? 9 : 7) + i)) * (horse ? 0.18 : 0.08) : 0;
			const sc = Math.max(0.001, d.show);
			const turn = d.yaw + s.yaw + d.routed * (Math.PI * (0.6 + (i % 5) * 0.2));
			dummy.position.set(x, landY[i] + bob + (horse ? 1.2 : 0), z);
			dummy.rotation.set(d.moving && !horse ? 0.08 : 0, turn, 0);
			dummy.scale.setScalar(sc);
			dummy.updateMatrix();
			cloth.setMatrixAt(i, dummy.matrix);
			steel.setMatrixAt(i, dummy.matrix);
			heads.setMatrixAt(i, dummy.matrix);
			if (horse) {
				dummy.position.y -= 1.2;
				dummy.rotation.set(0, turn, 0);
				dummy.updateMatrix();
				horses.setMatrixAt(ri++, dummy.matrix);
			}
		});
		cloth.instanceMatrix.needsUpdate = steel.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
		horses.instanceMatrix.needsUpdate = true;
	}

	const shipY = (i: number, e: number) => shipFrom[i] + (shipTo[i] - shipFrom[i]) * e;

	function placeShips(t: number) {
		ships.forEach((s, i) => {
			const d = seat(s.dot, clock);
			const L = shipLen(s.dot);
			dummy.position.set(d.x, shipY(i, d.e) - 0.05 * L + Math.sin(t * 0.8 + i) * 0.15, d.z);
			dummy.rotation.set(Math.sin(t * 0.6 + i) * 0.015, d.yaw, Math.sin(t * 0.7 + i * 2) * 0.03 + d.routed * 0.25);
			dummy.scale.setScalar(L * Math.max(0.001, d.show));
			dummy.updateMatrix();
			hulls.setMatrixAt(i, dummy.matrix);
			sails.setMatrixAt(i, dummy.matrix);
		});
		hulls.instanceMatrix.needsUpdate = sails.instanceMatrix.needsUpdate = true;
	}

	/** Each unit's banner rides at its centre (a fleet's on its lead ship). */
	function placeBanners() {
		units.forEach((_, i) => {
			const list = unitDots[i];
			let sx = 0;
			let sz = 0;
			let shown = 0;
			let yaw = 0;
			let e = 0;
			for (const j of list) {
				const d = seat(j, clock);
				sx += d.x;
				sz += d.z;
				shown = Math.max(shown, d.show);
				yaw = d.yaw;
				e = d.e;
			}
			const n = list.length || 1;
			const x = sx / n;
			const z = sz / n;
			const lead = shipOf.get(list[0] ?? -1);
			const y = lead !== undefined ? shipY(lead, e) + 4 : site.height(x, z);
			dummy.position.set(x, y, z);
			dummy.rotation.set(0, yaw + Math.PI / 2, 0);
			dummy.scale.setScalar(Math.max(0.001, shown) * 1.4);
			dummy.updateMatrix();
			poles.setMatrixAt(i, dummy.matrix);
			sheets.setMatrixAt(i, dummy.matrix);
		});
		poles.instanceMatrix.needsUpdate = sheets.instanceMatrix.needsUpdate = true;
	}

	function placeForts() {
		flags.forEach((f, i) => {
			const [x, z] = fortAt[i];
			const side = heldBy(b, f.t, to);
			dummy.position.set(x, site.height(x, z) + 6, z);
			dummy.rotation.set(0, 0.4, 0);
			dummy.scale.setScalar(side ? 2.2 : 0.001);
			dummy.updateMatrix();
			poles.setMatrixAt(units.length + i, dummy.matrix);
			sheets.setMatrixAt(units.length + i, dummy.matrix);
			sheets.setColorAt(units.length + i, col.set((side && colors.get(side)) || '#888888'));
		});
		if (sheets.instanceColor) sheets.instanceColor.needsUpdate = true;
		poles.instanceMatrix.needsUpdate = sheets.instanceMatrix.needsUpdate = true;
	}

	function effects(t: number) {
		const live = (f: Fx) => f.phase === to;
		fires.forEach((f, i) => {
			const on = live(f) ? 1 : 0;
			const y = site.height(f.x, f.z);
			for (let m = 0; m < FLAMES; m++) {
				const a = m * 2.399;
				const r = 3 + (m % 4) * 2.5;
				const flick = 0.7 + 0.3 * Math.sin(t * 11 + m * 3.1) * Math.sin(t * 7.3 + m);
				const h = (4 + (m % 3) * 2.5) * flick * on;
				dummy.position.set(f.x + Math.cos(a) * r, y, f.z + Math.sin(a) * r);
				dummy.rotation.set(0, 0, 0);
				dummy.scale.set(1.2 * on + 0.001, h + 0.001, 1.2 * on + 0.001);
				dummy.updateMatrix();
				flames.setMatrixAt(i * FLAMES + m, dummy.matrix);
				const rise = (t * 0.25 + m / FLAMES) % 1;
				dummy.position.set(f.x + Math.cos(a) * r * 0.6 + rise * 10, y + 6 + rise * 40, f.z + Math.sin(a) * r * 0.6 + rise * 4);
				dummy.scale.setScalar((2.5 + rise * 9) * on + 0.001);
				dummy.updateMatrix();
				smoke.setMatrixAt(i * FLAMES + m, dummy.matrix);
			}
			const l = fireLights[i];
			if (l) {
				l.position.set(f.x, y + 6, f.z);
				l.intensity = on * (60 + 25 * Math.sin(t * 13 + i));
			}
		});
		flames.instanceMatrix.needsUpdate = smoke.instanceMatrix.needsUpdate = true;
		const arr = sparkGeo.getAttribute('position').array as Float32Array;
		clashes.forEach((f, i) => {
			const on = live(f);
			const y = site.height(f.x, f.z);
			for (let m = 0; m < SPARKS; m++) {
				const o = (i * SPARKS + m) * 3;
				if (!on) {
					arr[o + 1] = -1e4;
					continue;
				}
				const life = (t * 1.7 + m * 0.137) % 1;
				const a = m * 2.399 + Math.floor(t * 1.7 + m * 0.137) * 1.3;
				const r = 4 + life * 9;
				arr[o] = f.x + Math.cos(a) * r;
				arr[o + 1] = y + 1.2 + life * 3 - life * life * 4;
				arr[o + 2] = f.z + Math.sin(a) * r;
			}
		});
		sparkGeo.getAttribute('position').needsUpdate = true;
		sparks.visible = clashes.some(live);
	}

	sounding();
	placePeople(0);
	placeShips(0);
	placeBanners();
	placeForts();

	return {
		group,
		views,
		setPhase(i) {
			const next = Math.max(0, Math.min(P - 1, i));
			if (next === to) return;
			from = to;
			to = next;
			clock = 0;
			sounding();
			placeForts();
		},
		tick(t, dt) {
			time.value = t;
			const marching = clock <= TWEEN + 0.1;
			clock += dt;
			// the crowd is only re-placed while it moves; ships ride the swell either way
			if (marching) {
				placePeople(t);
				placeBanners();
			}
			if (ships.length) placeShips(t);
			effects(t);
		},
		dispose() {
			group.traverse((o) => {
				const m = o as THREE.Mesh;
				m.geometry?.dispose();
			});
			for (const m of [clothMat, steelMat, skinMat, horseMat, hullMat, sailMat, poleMat, flagMat, flameMat, smokeMat, sparks.material as THREE.Material]) m.dispose();
			for (const l of fireLights) l.dispose();
		}
	};
}
