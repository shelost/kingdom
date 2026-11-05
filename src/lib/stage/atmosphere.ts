import * as THREE from 'three';
import { rng } from './build/geo';
import { cloudTexture } from './build/nature';
import type { LightPreset } from './build/types';

type Tint = { cloud: string; cloudOpacity: number; stars: boolean; birds: boolean; lamp: number };

const TINTS: Record<LightPreset, Tint> = {
	dawn: { cloud: '#f2c9c4', cloudOpacity: 0.85, stars: false, birds: true, lamp: 0 },
	day: { cloud: '#ffffff', cloudOpacity: 0.9, stars: false, birds: true, lamp: 0 },
	golden: { cloud: '#ffc796', cloudOpacity: 0.9, stars: false, birds: true, lamp: 45 },
	night: { cloud: '#46557a', cloudOpacity: 0.55, stars: true, birds: false, lamp: 140 }
};

const LAMP_POOL = 4;

/** Sky dressing and practical light around whatever site is built. */
export class Atmosphere {
	readonly group = new THREE.Group();
	private clouds: { sprite: THREE.Sprite; angle: number; r: number; speed: number }[] = [];
	private cloudMats: THREE.SpriteMaterial[] = [];
	private cloudTex: THREE.Texture[] = [];
	private stars: THREE.Points;
	private birds: THREE.InstancedMesh;
	private flock: { phase: number; r: number; h: number; speed: number; off: THREE.Vector3 }[] = [];
	private lights: THREE.PointLight[] = [];
	private lamps: [number, number, number][] = [];
	private center = new THREE.Vector2();
	private lampTimer = 0;
	private m = new THREE.Matrix4();
	private q = new THREE.Quaternion();
	private v = new THREE.Vector3();
	private s = new THREE.Vector3();

	constructor() {
		this.group.name = 'atmosphere';
		const rand = rng(404);

		this.cloudTex = [1, 2, 3].map((seed) => cloudTexture(seed * 17));
		this.cloudMats = this.cloudTex.map((map) => new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, fog: false }));
		for (let i = 0; i < 26; i++) {
			const sprite = new THREE.Sprite(this.cloudMats[i % 3]);
			const w = 2600 + rand() * 3400;
			sprite.scale.set(w, w * (0.36 + rand() * 0.14), 1);
			sprite.position.y = 1600 + rand() * 2200;
			sprite.renderOrder = -1;
			this.group.add(sprite);
			this.clouds.push({ sprite, angle: rand() * Math.PI * 2, r: 5000 + rand() * 11000, speed: (0.0015 + rand() * 0.002) * (rand() > 0.5 ? 1 : -1) });
		}

		const pos: number[] = [];
		const col: number[] = [];
		for (let i = 0; i < 1800; i++) {
			const a = rand() * Math.PI * 2;
			const e = Math.asin(0.04 + rand() * 0.96);
			pos.push(Math.cos(a) * Math.cos(e) * 30000, Math.sin(e) * 30000, Math.sin(a) * Math.cos(e) * 30000);
			const k = 0.55 + rand() * 0.45;
			col.push(k, k, k * (0.9 + rand() * 0.2));
		}
		const sg = new THREE.BufferGeometry();
		sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		sg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
		this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, fog: false, transparent: true, depthWrite: false }));
		this.stars.visible = false;
		this.group.add(this.stars);

		const bg = new THREE.BufferGeometry();
		bg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.25, -1, 0.35, -0.1, 0, 0, -0.2, 0, 0, 0.25, 0, 0, -0.2, 1, 0.35, -0.1], 3));
		bg.computeVertexNormals();
		this.birds = new THREE.InstancedMesh(bg, new THREE.MeshBasicMaterial({ color: '#2a2e33', side: THREE.DoubleSide }), 22);
		for (let i = 0; i < 22; i++) {
			const lead = i < 12 ? 0 : 1;
			this.flock.push({
				phase: rand() * Math.PI * 2,
				r: 70 + lead * 50 + rand() * 12,
				h: 55 + lead * 30 + rand() * 10,
				speed: (0.11 + rand() * 0.02) * (lead ? -1 : 1),
				off: new THREE.Vector3((rand() - 0.5) * 18, (rand() - 0.5) * 6, (rand() - 0.5) * 18)
			});
		}
		this.birds.frustumCulled = false;
		this.group.add(this.birds);

		for (let i = 0; i < LAMP_POOL; i++) {
			const l = new THREE.PointLight('#ffb36b', 0, 46, 2);
			l.visible = false;
			this.lights.push(l);
			this.group.add(l);
		}
	}

	/** A new site: its lanterns and where its sky should centre. */
	setSite(lamps: [number, number, number][], center: [number, number]): void {
		this.lamps = lamps;
		this.center.set(center[0], center[1]);
		this.lampTimer = 0;
	}

	setLight(preset: LightPreset): void {
		const t = TINTS[preset];
		for (const m of this.cloudMats) {
			m.color.set(t.cloud);
			m.opacity = t.cloudOpacity;
		}
		this.stars.visible = t.stars;
		this.birds.visible = t.birds;
		for (const l of this.lights) {
			l.intensity = t.lamp;
			l.visible = t.lamp > 0;
		}
	}

	update(t: number, delta: number, focus: THREE.Vector3): void {
		for (const c of this.clouds) {
			const a = c.angle + t * c.speed;
			c.sprite.position.x = this.center.x + Math.cos(a) * c.r;
			c.sprite.position.z = this.center.y + Math.sin(a) * c.r;
		}

		if (this.birds.visible) {
			this.flock.forEach((b, i) => {
				const a = b.phase + t * b.speed;
				this.v.set(focus.x + Math.cos(a) * b.r + b.off.x, focus.y + b.h + b.off.y + Math.sin(t * 0.4 + i) * 3, focus.z + Math.sin(a) * b.r + b.off.z);
				const heading = Math.atan2(-Math.sin(a) * Math.sign(b.speed), Math.cos(a) * Math.sign(b.speed));
				this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, heading);
				const flap = Math.sin(t * 9 + i * 1.7);
				this.s.set(0.85, flap * 0.85, 0.85);
				this.m.compose(this.v, this.q, this.s);
				this.birds.setMatrixAt(i, this.m);
			});
			this.birds.instanceMatrix.needsUpdate = true;
		}

		this.lampTimer -= delta;
		if (this.lampTimer > 0 || !this.lamps.length) return;
		this.lampTimer = 0.4;
		const near = this.lamps
			.map((p) => ({ p, d: (p[0] - focus.x) ** 2 + (p[1] - focus.y) ** 2 * 4 + (p[2] - focus.z) ** 2 }))
			.sort((a, b) => a.d - b.d);
		this.lights.forEach((l, i) => {
			const hit = near[i];
			if (hit && hit.d < 300 ** 2) l.position.set(hit.p[0], hit.p[1] - 0.2, hit.p[2]);
			else l.position.set(0, -1000, 0);
		});
	}

	dispose(): void {
		for (const m of this.cloudMats) m.dispose();
		for (const t of this.cloudTex) t.dispose();
		this.stars.geometry.dispose();
		(this.stars.material as THREE.Material).dispose();
		this.birds.geometry.dispose();
		(this.birds.material as THREE.Material).dispose();
		for (const l of this.lights) l.dispose();
	}
}
