import * as THREE from 'three';
import { rng } from './build/geo';
import { cloudTexture } from './build/nature';
import { blend, blendColor, weight, type Layers, type LightMix, type LightPreset, type Weather } from './build/types';

type Tint = { cloud: string; cloudOpacity: number; stars: number; birds: number; lamp: number };

const TINTS: Record<LightPreset, Tint> = {
	dawn: { cloud: '#f2c9c4', cloudOpacity: 0.85, stars: 0, birds: 1, lamp: 0 },
	day: { cloud: '#ffffff', cloudOpacity: 0.9, stars: 0, birds: 1, lamp: 0 },
	golden: { cloud: '#ffc796', cloudOpacity: 0.9, stars: 0, birds: 1, lamp: 45 },
	night: { cloud: '#46557a', cloudOpacity: 0.55, stars: 1, birds: 0, lamp: 140 }
};

const LAMP_POOL = 4;

/** Air particles: leaves and petals on the wind, snow, fireflies at night, otherworld motes. */
const AIR = 1600;
const AIR_BOX = 280;
const AIR_H = 70;

type AirKind = 0 | 1 | 2 | 3;

function softDot(): THREE.CanvasTexture {
	const c = document.createElement('canvas');
	c.width = c.height = 64;
	const g = c.getContext('2d')!;
	const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
	grad.addColorStop(0, 'rgba(255,255,255,1)');
	grad.addColorStop(0.35, 'rgba(255,255,255,0.85)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');
	g.fillStyle = grad;
	g.fillRect(0, 0, 64, 64);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

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
	private mix: LightMix = { a: 'day', b: 'day', t: 0 };
	private layers: Pick<Layers, 'clouds' | 'birds' | 'lamps' | 'nature' | 'wind'> = { clouds: true, birds: true, lamps: true, nature: true, wind: true };
	private m = new THREE.Matrix4();
	private q = new THREE.Quaternion();
	private v = new THREE.Vector3();
	private s = new THREE.Vector3();

	// switches fade instead of popping
	private fadeAt = { clouds: 1, birds: 1, lamps: 1, wind: 1, nature: 1 };
	private cloudClock = 0;

	private air: THREE.Points;
	private airTex: THREE.Texture;
	private airSeed: Float32Array;
	private airKind: Uint8Array;
	private airCol: Float32Array;
	private weather: Weather = {};
	private airK = 0;
	private airDrift = 0;
	private airAt = new THREE.Vector3();

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
		this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, fog: false, transparent: true, depthWrite: false, opacity: 0 }));
		this.stars.visible = false;
		this.stars.renderOrder = -1;
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

		// four seeds per particle: x, y, z in the box, and a phase
		this.airSeed = new Float32Array(AIR * 4);
		for (let i = 0; i < AIR * 4; i++) this.airSeed[i] = rand();
		this.airKind = new Uint8Array(AIR);
		this.airCol = new Float32Array(AIR * 3);
		const ag = new THREE.BufferGeometry();
		ag.setAttribute('position', new THREE.BufferAttribute(new Float32Array(AIR * 3), 3).setUsage(THREE.DynamicDrawUsage));
		ag.setAttribute('color', new THREE.BufferAttribute(this.airCol, 3));
		ag.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
		this.airTex = softDot();
		this.air = new THREE.Points(
			ag,
			new THREE.PointsMaterial({ size: 0.55, map: this.airTex, vertexColors: true, transparent: true, depthWrite: false, opacity: 0, sizeAttenuation: true })
		);
		this.air.visible = false;
		this.group.add(this.air);
		this.setWeather({});
	}

	/** A new site: its lanterns, where its sky should centre, and what drifts in its air. */
	setSite(lamps: [number, number, number][], center: [number, number], weather: Weather = {}): void {
		this.lamps = lamps;
		this.center.set(center[0], center[1]);
		this.lampTimer = 0;
		this.setWeather(weather);
	}

	private setWeather(w: Weather): void {
		this.weather = w;
		for (const l of this.lights) l.color.set(w.lamp ?? '#ffb36b');
		const rand = rng(77);
		const c = new THREE.Color();
		const leaf = ['#c9802e', '#8a6a2a', '#b44a22', '#7f9a3a'];
		const petal = ['#f6c9d6', '#fbe4ea', '#f2b2c4'];
		for (let i = 0; i < AIR; i++) {
			const r = rand();
			// 0 leaf, 1 petal, 2 snow, 3 firefly / mote
			let kind: AirKind = 0;
			if (w.motes) kind = r < 0.7 ? 3 : 0;
			else if (w.snow) kind = r < 0.75 ? 2 : 0;
			else if (w.petals) kind = r < 0.55 ? 1 : r < 0.8 ? 0 : 3;
			else kind = r < 0.72 ? 0 : 3;
			this.airKind[i] = kind;
			if (kind === 0) c.set(leaf[Math.floor(rand() * leaf.length)]);
			else if (kind === 1) c.set(petal[Math.floor(rand() * petal.length)]);
			else if (kind === 2) c.set('#f4f7ff');
			else c.set(w.motes ?? '#d9ff7a');
			this.airCol[i * 3] = c.r;
			this.airCol[i * 3 + 1] = c.g;
			this.airCol[i * 3 + 2] = c.b;
		}
		(this.air.geometry.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
	}

	setLight(mix: LightMix): void {
		this.mix = mix;
		const c = blendColor(mix, (id) => TINTS[id].cloud, new THREE.Color());
		const o = blend(mix, (id) => TINTS[id].cloudOpacity);
		for (const m of this.cloudMats) {
			m.color.copy(c);
			m.opacity = o * this.fadeAt.clouds;
		}
		const st = weight(mix, 'night');
		(this.stars.material as THREE.PointsMaterial).opacity = st;
		this.stars.visible = st > 0.02;
		this.apply();
	}

	/** The page's layer switches: sky clouds, birds, the lamp lights and the air. */
	setLayers(on: Pick<Layers, 'clouds' | 'birds' | 'lamps' | 'nature' | 'wind'>): void {
		this.layers = { ...on };
	}

	private apply(): void {
		const lamp = blend(this.mix, (id) => TINTS[id].lamp) * this.fadeAt.lamps;
		for (const c of this.clouds) c.sprite.visible = this.fadeAt.clouds > 0;
		this.birds.visible = blend(this.mix, (id) => TINTS[id].birds) > 0.5 && this.fadeAt.birds > 0;
		for (const l of this.lights) {
			l.intensity = lamp;
			l.visible = lamp > 0.5;
		}
	}

	private fade(delta: number): boolean {
		let moved = false;
		const f = this.fadeAt;
		for (const k of ['clouds', 'birds', 'lamps', 'wind', 'nature'] as const) {
			const to = this.layers[k] ? 1 : 0;
			if (f[k] === to) continue;
			f[k] = to > f[k] ? Math.min(to, f[k] + delta / 1.4) : Math.max(to, f[k] - delta / 1.4);
			moved = true;
		}
		return moved;
	}

	/** `eye` is the camera: the air drifts between it and what it looks at, where it can be seen. */
	update(t: number, delta: number, focus: THREE.Vector3, eye?: THREE.Vector3): void {
		if (this.fade(delta)) this.setLight(this.mix);
		// the wind pushes the sky along faster
		this.cloudClock += delta * (1 + this.fadeAt.wind * 2.2);
		for (const c of this.clouds) {
			const a = c.angle + this.cloudClock * c.speed;
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
				const k = this.fadeAt.birds;
				this.s.set(0.85 * k, flap * 0.85 * k, 0.85 * k);
				this.m.compose(this.v, this.q, this.s);
				this.birds.setMatrixAt(i, this.m);
			});
			this.birds.instanceMatrix.needsUpdate = true;
		}

		this.updateAir(t, delta, eye ? this.airAt.lerpVectors(eye, focus, 0.3) : focus);

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

	/** Wind-blown leaves, petals and snow; fireflies come out after dark; motes always drift in a realm. */
	private updateAir(t: number, delta: number, focus: THREE.Vector3): void {
		const night = weight(this.mix, 'night');
		const want = this.weather.motes ? this.fadeAt.nature : Math.max(this.fadeAt.wind, night * 0.6) * this.fadeAt.nature;
		this.airK += (want - this.airK) * Math.min(1, delta * 1.5);
		const mat = this.air.material as THREE.PointsMaterial;
		mat.opacity = this.airK;
		this.air.visible = this.airK > 0.01;
		if (!this.air.visible) return;
		const wind = this.fadeAt.wind;
		this.airDrift += delta * (0.25 + wind);
		const pos = this.air.geometry.getAttribute('position') as THREE.BufferAttribute;
		const arr = pos.array as Float32Array;
		const s = this.airSeed;
		const B = AIR_BOX;
		const wrap = (v: number, c: number, span: number) => c - span / 2 + ((((v - c + span / 2) % span) + span) % span);
		for (let i = 0; i < AIR; i++) {
			const kind = this.airKind[i];
			const ph = s[i * 4 + 3] * 100;
			let x = s[i * 4] * B;
			let y = s[i * 4 + 1] * AIR_H;
			let z = s[i * 4 + 2] * B;
			if (kind === 3) {
				// fireflies and motes wander low and blink; only by night unless the realm glows
				const on = this.weather.motes ? 1 : night;
				x += Math.sin(t * 0.3 + ph) * 6;
				z += Math.cos(t * 0.27 + ph * 1.3) * 6;
				y = (s[i * 4 + 1] * 14 + Math.sin(t * 0.5 + ph) * 2) * (this.weather.motes ? 2 : 1);
				if (on < 0.05 || Math.sin(t * 2 + ph) < -0.6) y = -1e4;
			} else {
				const fall = kind === 2 ? 1.4 : kind === 1 ? 0.7 : 1.1;
				const blow = (kind === 2 ? 1.2 : 5.5) * this.airDrift;
				x += blow + Math.sin(t * 1.7 + ph) * 1.6;
				z += blow * 0.4 + Math.cos(t * 1.3 + ph) * 1.6;
				y -= t * fall;
				// leaves only fly with the wind; snow falls either way
				if (kind !== 2 && wind < 0.05) y = -1e4;
			}
			arr[i * 3] = wrap(x, focus.x, B);
			arr[i * 3 + 1] = y < -1e3 ? y : focus.y - 8 + ((((y % AIR_H) + AIR_H) % AIR_H));
			arr[i * 3 + 2] = wrap(z, focus.z, B);
		}
		pos.needsUpdate = true;
	}

	dispose(): void {
		for (const m of this.cloudMats) m.dispose();
		for (const t of this.cloudTex) t.dispose();
		this.stars.geometry.dispose();
		(this.stars.material as THREE.Material).dispose();
		this.birds.geometry.dispose();
		(this.birds.material as THREE.Material).dispose();
		this.air.geometry.dispose();
		(this.air.material as THREE.Material).dispose();
		this.airTex.dispose();
		for (const l of this.lights) l.dispose();
	}
}
