/**
 * The fall out of heaven, as 3D: a chariot under a red parasol leaves a palace
 * isle above the clouds, dives through three cloud decks trailing five-colour
 * cloud, and strikes the south rim of the white mountain's crater. Toon-shaded
 * with ink outlines (the film's action register). Everything is posed from the
 * shot's `k` and the film clock, so a scrub lands on the same frame.
 */
import * as THREE from 'three';
import { CLOUD_DECKS, fallAt, fallS, IMPACT, PAEKTU } from '../mapPlan';
import { METRE, type Ground } from './ground';

const OBANG = ['#3e79e4', '#e0402e', '#f2c94a', '#f7f2e6', '#3a3a44'];
const INK = '#160f1c';

let ramp: THREE.DataTexture | null = null;
/** Three hard bands of light: the cel look. */
function toonRamp(): THREE.DataTexture {
	if (ramp) return ramp;
	ramp = new THREE.DataTexture(new Uint8Array([70, 70, 70, 255, 165, 165, 165, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
	ramp.magFilter = THREE.NearestFilter;
	ramp.minFilter = THREE.NearestFilter;
	ramp.needsUpdate = true;
	return ramp;
}

const toon = (color: string, emissive = '#000000') => new THREE.MeshToonMaterial({ color, gradientMap: toonRamp(), emissive });
const outlineMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });

/** A part with its inked hull: the same shape a touch larger, back faces only, drawn black. */
function inked(geo: THREE.BufferGeometry, mat: THREE.Material, hull = 1.07): THREE.Group {
	const g = new THREE.Group();
	g.add(new THREE.Mesh(geo, mat));
	const line = new THREE.Mesh(geo, outlineMat);
	line.scale.setScalar(hull);
	g.add(line);
	return g;
}

function place<T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T {
	o.position.set(x, y, z);
	return o;
}

/** The chariot, a unit long, facing +z. Returns the parts that move. */
function chariot() {
	const root = new THREE.Group();
	const red = toon('#c0352b');
	const gold = toon('#e3b04b');
	const wood = toon('#3b2519');
	const robe = toon('#f1e8d2');
	const hair = toon('#141018');
	root.add(place(inked(new THREE.BoxGeometry(0.72, 0.3, 0.86), red), 0, 0.36, 0));
	for (const x of [-0.37, 0.37]) root.add(place(inked(new THREE.BoxGeometry(0.05, 0.08, 0.9), gold, 1.15), x, 0.55, 0));
	root.add(place(inked(new THREE.BoxGeometry(0.76, 0.08, 0.05), gold, 1.15), 0, 0.55, 0.44));
	root.add(place(inked(new THREE.BoxGeometry(0.06, 0.06, 0.9), wood, 1.2), 0, 0.3, 0.86));
	const wheels: THREE.Group[] = [];
	for (const x of [-0.44, 0.44]) {
		const w = new THREE.Group();
		w.add(inked(new THREE.TorusGeometry(0.33, 0.035, 8, 28).rotateY(Math.PI / 2), gold, 1.12));
		for (let i = 0; i < 8; i++) {
			const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.64, 5), wood);
			spoke.rotation.x = (i / 8) * Math.PI;
			w.add(spoke);
		}
		w.add(inked(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 10).rotateZ(Math.PI / 2), gold));
		w.position.set(x, 0.33, -0.05);
		root.add(w);
		wheels.push(w);
	}
	// the rider, from behind: white robe, broad shoulders, black hair up under a gold crown
	const rider = new THREE.Group();
	rider.add(place(inked(new THREE.CylinderGeometry(0.13, 0.24, 0.6, 14), robe), 0, 0.3, 0));
	rider.add(place(inked(new THREE.SphereGeometry(0.17, 14, 10).scale(1.25, 0.6, 0.85), robe), 0, 0.6, 0));
	for (const x of [-1, 1]) {
		const arm = inked(new THREE.CylinderGeometry(0.05, 0.075, 0.42, 8), robe);
		arm.position.set(x * 0.2, 0.46, 0.12);
		arm.rotation.set(-0.9, 0, x * 0.25);
		rider.add(arm);
	}
	rider.add(place(inked(new THREE.SphereGeometry(0.105, 14, 10), hair), 0, 0.8, 0));
	rider.add(place(inked(new THREE.SphereGeometry(0.05, 10, 8), hair), 0, 0.9, -0.02));
	rider.add(place(inked(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 14, 1, true), gold, 1.1), 0, 0.88, 0));
	for (let i = 0; i < 3; i++) {
		const spike = inked(new THREE.ConeGeometry(0.025, 0.11, 5), gold, 1.15);
		spike.position.set((i - 1) * 0.06, 0.95, 0.07);
		rider.add(spike);
	}
	rider.position.set(0, 0.5, -0.1);
	root.add(rider);
	// the parasol of heaven on its pole
	root.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.0, 6), wood), 0, 1.02, -0.32));
	const shade = inked(new THREE.ConeGeometry(0.62, 0.24, 18, 1, true), toon('#b82c26', '#2a0503'), 1.05);
	shade.position.set(0, 1.5, -0.32);
	root.add(shade);
	root.add(place(inked(new THREE.SphereGeometry(0.045, 10, 8), gold), 0, 1.64, -0.32));
	// two red sashes streaming back from the shoulders
	const sashes: THREE.Mesh[] = [];
	for (const x of [-0.16, 0.16]) {
		const geo = new THREE.PlaneGeometry(0.07, 1.4, 1, 16).translate(0, -0.7, 0).rotateX(Math.PI / 2);
		const m = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color: '#d63a2c', gradientMap: toonRamp(), side: THREE.DoubleSide }));
		m.position.set(x, 1.1, -0.2);
		m.userData.base = Float32Array.from(geo.attributes.position.array);
		root.add(m);
		sashes.push(m);
	}
	return { root, wheels, sashes };
}

/** A painted cumulus: round puffs, lit white on top, a lilac shadow underneath. */
function cloudTexture(seed: number): THREE.CanvasTexture {
	const c = document.createElement('canvas');
	c.width = c.height = 256;
	const g = c.getContext('2d')!;
	let s = seed;
	const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
	const puffs: [number, number, number][] = [];
	for (let i = 0; i < 9; i++) puffs.push([60 + r() * 136, 110 + r() * 60 - (i % 3) * 18, 34 + r() * 30]);
	const shape = () => {
		g.beginPath();
		for (const [x, y, rad] of puffs) {
			g.moveTo(x + rad, y);
			g.arc(x, y, rad, 0, Math.PI * 2);
		}
	};
	g.fillStyle = '#b8a7cc';
	shape();
	g.fill();
	g.save();
	shape();
	g.clip();
	g.fillStyle = '#ffffff';
	g.beginPath();
	for (const [x, y, rad] of puffs) {
		g.moveTo(x - 8 + rad * 0.92, y - 10);
		g.arc(x - 8, y - 10, rad * 0.92, 0, Math.PI * 2);
	}
	g.fill();
	g.fillStyle = 'rgba(255,214,170,0.55)';
	g.beginPath();
	for (const [x, y, rad] of puffs) {
		g.moveTo(x - 16 + rad * 0.55, y - 18);
		g.arc(x - 16, y - 18, rad * 0.55, 0, Math.PI * 2);
	}
	g.fill();
	g.restore();
	const tex = new THREE.CanvasTexture(c);
	tex.colorSpace = THREE.SRGBColorSpace;
	return tex;
}

function softDot(): THREE.CanvasTexture {
	const c = document.createElement('canvas');
	c.width = c.height = 64;
	const g = c.getContext('2d')!;
	const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
	grad.addColorStop(0, 'rgba(255,255,255,1)');
	grad.addColorStop(0.5, 'rgba(255,255,255,0.75)');
	grad.addColorStop(1, 'rgba(255,255,255,0)');
	g.fillStyle = grad;
	g.fillRect(0, 0, 64, 64);
	return new THREE.CanvasTexture(c);
}

/** A seeded unit random, so the clouds and the burst are the same on every build. */
function seeded(seed: number) {
	let s = seed;
	return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

const SKY_VERT = `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const SKY_FRAG = `
uniform vec3 uSun;
varying vec3 vDir;
void main(){
	float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
	vec3 zen = vec3(0.13, 0.15, 0.36);
	vec3 mid = vec3(0.62, 0.45, 0.62);
	vec3 hor = vec3(1.0, 0.72, 0.5);
	vec3 col = mix(hor, mid, smoothstep(0.48, 0.62, h));
	col = mix(col, zen, smoothstep(0.62, 0.95, h));
	float sun = max(dot(normalize(vDir), uSun), 0.0);
	col += vec3(1.0, 0.8, 0.5) * pow(sun, 18.0) * 0.6 + vec3(1.0, 0.95, 0.8) * smoothstep(0.9975, 0.999, sun);
	gl_FragColor = vec4(col, 1.0);
}`;

export type Descent = {
	group: THREE.Group;
	/** Pose everything and the camera for `k` (0…1 through the shot) at film time `t`; `secs` is the shot's length. */
	update(camera: THREE.PerspectiveCamera, k: number, t: number, secs: number): void;
	/** The ground under the crater disc (sheet x, y, radius), cut out of the map so the bowl shows. */
	hole: THREE.Vector3;
	dispose(): void;
};

/** The fall over the ground `g`, lifted by `lift`. */
export function buildDescent(g: Ground, lift: number): Descent {
	const group = new THREE.Group();
	const disposables: { dispose(): void }[] = [];

	// the crater: the true summit, then a sculpted rim and Heaven Lake on top of it
	let peak: [number, number] = PAEKTU;
	let best = -Infinity;
	for (let dy = -8; dy <= 8; dy += 0.5) {
		for (let dx = -8; dx <= 8; dx += 0.5) {
			const h = g.at(PAEKTU[0] + dx, PAEKTU[1] + dy);
			if (h > best) {
				best = h;
				peak = [PAEKTU[0] + dx, PAEKTU[1] + dy];
			}
		}
	}
	const crater = g.world(peak[0], peak[1], lift);
	const W = 1 / 50;
	const RIM = 1.7;
	const relief = (r: number, a: number) => {
		const cone = 520 * Math.exp(-((r / 3.4) ** 2));
		const rim = (300 + 90 * Math.sin(a * 7) + 60 * Math.sin(a * 13 + 1)) * Math.exp(-(((r - RIM) / 0.5) ** 2));
		const bowl = -760 * (1 - smoothstepJs(0.55, RIM + 0.1, r));
		return cone + rim + bowl;
	};
	const R = 9;
	const hole = new THREE.Vector3(peak[0], peak[1], R * 0.6);
	{
		const geo = new THREE.RingGeometry(0.0001, R * W, 200, 90).rotateX(-Math.PI / 2);
		const p = geo.attributes.position;
		const colors = new Float32Array(p.count * 4);
		const rock = new THREE.Color('#5c5560');
		const snowC = new THREE.Color('#f4f6fb');
		const c = new THREE.Color();
		for (let i = 0; i < p.count; i++) {
			const x = p.getX(i) / W;
			const z = p.getZ(i) / W;
			const r = Math.hypot(x, z);
			const a = Math.atan2(z, x);
			const sx = peak[0] + x;
			const sy = peak[1] + z;
			const fade = 1 - smoothstepJs(R * 0.62, R, r);
			const y = (Math.max(0, g.at(sx, sy)) + relief(r, a) * METRE * fade) * lift;
			p.setY(i, y - crater.y + 0.0015);
			const streak = Math.sin(a * 23 + r * 3) * 0.5 + 0.5;
			const crest = Math.exp(-(((r - RIM) / 0.45) ** 2));
			const wall = r < RIM ? 0.2 + 0.45 * streak : 0.35 + 0.55 * streak * (1 - smoothstepJs(RIM, R * 0.8, r));
			c.copy(rock).lerp(snowC, Math.min(1, wall + crest));
			c.toArray(colors, i * 4);
			colors[i * 4 + 3] = 1 - smoothstepJs(hole.z + 0.2, R, r);
		}
		geo.setAttribute('color', new THREE.BufferAttribute(colors, 4));
		geo.computeVertexNormals();
		const mat = new THREE.MeshToonMaterial({
			vertexColors: true,
			transparent: true,
			gradientMap: toonRamp(),
			polygonOffset: true,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2
		});
		const mesh = new THREE.Mesh(geo, mat);
		mesh.position.copy(crater);
		group.add(mesh);
		disposables.push(geo, mat);
		const lakeY = (Math.max(0, g.at(peak[0], peak[1])) + relief(1.05, 0) * METRE) * lift - crater.y + 0.003;
		const lake = new THREE.Mesh(
			new THREE.CircleGeometry(1.25 * W, 48).rotateX(-Math.PI / 2),
			new THREE.MeshToonMaterial({ color: '#2f7fc0', emissive: '#0b2a4a', gradientMap: toonRamp() })
		);
		lake.position.set(crater.x, crater.y + lakeY, crater.z);
		group.add(lake);
	}
	// the fall is measured from the top of the south rim, where it ends
	const rimY = (Math.max(0, g.at(peak[0], peak[1] + RIM)) + relief(RIM, Math.PI / 2) * METRE) * lift;
	const base = new THREE.Vector3(crater.x, rimY, crater.z);

	// sky dome
	const sunDir = new THREE.Vector3(-0.8, 0.22, 0.4).normalize();
	const sky = new THREE.Mesh(
		new THREE.SphereGeometry(30, 32, 16),
		new THREE.ShaderMaterial({ vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, uniforms: { uSun: { value: sunDir } } })
	);
	sky.renderOrder = -1;
	group.add(sky);

	const sun = new THREE.DirectionalLight('#ffe0b8', 2.4);
	sun.position.copy(sunDir).multiplyScalar(20);
	group.add(sun, new THREE.HemisphereLight('#c9d4ff', '#6a4a52', 1.1));

	// the palace isle the chariot leaves from
	const start = fallAt(0).pos;
	const isle = new THREE.Group();
	isle.add(place(inked(new THREE.ConeGeometry(1, 1.6, 9).rotateX(Math.PI), toon('#7c6656')), 0, -0.8, 0));
	isle.add(place(inked(new THREE.CylinderGeometry(1.02, 1.0, 0.16, 18), toon('#d9cfbf')), 0, 0.02, 0));
	const hall = (x: number, z: number, s: number) => {
		const h = new THREE.Group();
		h.add(place(inked(new THREE.BoxGeometry(0.9, 0.12, 0.6), toon('#efe6d6')), 0, 0.06, 0));
		h.add(place(inked(new THREE.BoxGeometry(0.72, 0.34, 0.44), toon('#b83228')), 0, 0.29, 0));
		const roof = inked(new THREE.ConeGeometry(0.62, 0.3, 4).rotateY(Math.PI / 4).scale(1.25, 1, 0.82), toon('#2f8f86'));
		roof.position.y = 0.6;
		h.add(roof);
		const upper = inked(new THREE.ConeGeometry(0.36, 0.24, 4).rotateY(Math.PI / 4).scale(1.25, 1, 0.82), toon('#2f8f86'));
		upper.position.y = 0.86;
		h.add(upper);
		h.add(place(inked(new THREE.SphereGeometry(0.04, 8, 6), toon('#f2c94a', '#5a3a00')), 0, 1.0, 0));
		h.position.set(x, 0.1, z);
		h.scale.setScalar(s);
		return h;
	};
	isle.add(hall(0, -0.2, 1), hall(-0.62, 0.2, 0.62), hall(0.62, 0.22, 0.62));
	isle.scale.setScalar(0.42);
	isle.position.set(base.x + start[0] + 0.55, base.y + start[1] - 0.12, base.z + start[2] + 0.45);
	group.add(isle);

	// three decks of cloud along the fall
	const sprites: THREE.Sprite[] = [];
	const textures = [cloudTexture(11), cloudTexture(29), cloudTexture(47)];
	disposables.push(...textures);
	const rand = seeded(7);
	CLOUD_DECKS.forEach((alt, deck) => {
		let s = 0;
		while (s < 1 && fallAt(s).pos[1] > alt) s += 0.005;
		const at = fallAt(s).pos;
		const n = deck === 0 ? 80 : 64;
		for (let i = 0; i < n; i++) {
			const mat = new THREE.SpriteMaterial({ map: textures[i % 3], transparent: true, depthWrite: false, fog: false });
			const sp = new THREE.Sprite(mat);
			const ang = rand() * Math.PI * 2;
			const r = Math.sqrt(rand()) * (2.8 - deck * 0.7);
			const size = (0.9 + rand() * 1.3) * (1 - deck * 0.22);
			sp.position.set(base.x + at[0] + Math.cos(ang) * r, base.y + alt + (rand() - 0.5) * 0.35, base.z + at[2] + Math.sin(ang) * r);
			sp.scale.set(size * 1.6, size, 1);
			group.add(sp);
			sprites.push(sp);
			disposables.push(mat);
		}
	});

	// the chariot and its five-colour cloud
	const car = chariot();
	group.add(car.root);
	const TRAIL = 420;
	const trailPos = new Float32Array(TRAIL * 3);
	const trailCol = new Float32Array(TRAIL * 3);
	const trailGeo = new THREE.BufferGeometry();
	trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
	trailGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
	const dot = softDot();
	const trailMat = new THREE.PointsMaterial({ map: dot, size: 0.05, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true });
	const trail = new THREE.Points(trailGeo, trailMat);
	trail.frustumCulled = false;
	group.add(trail);
	const trailSeed = Array.from({ length: TRAIL }, (_, i) => {
		const r = seeded(100 + i);
		return [r() - 0.5, r() - 0.5, r() - 0.5, r()];
	});
	const palette = OBANG.map((c) => new THREE.Color(c));

	// the hit: a shockwave over the lake and a burst of snow and rock
	const ring = new THREE.Mesh(
		new THREE.RingGeometry(0.86, 1, 64).rotateX(-Math.PI / 2),
		new THREE.MeshBasicMaterial({ color: '#e8f4ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
	);
	group.add(ring);
	const BURST = 360;
	const burstPos = new Float32Array(BURST * 3);
	const burstGeo = new THREE.BufferGeometry();
	burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
	const burstMat = new THREE.PointsMaterial({ map: dot, size: 0.006, color: '#f4f7ff', transparent: true, depthWrite: false });
	const burst = new THREE.Points(burstGeo, burstMat);
	burst.frustumCulled = false;
	group.add(burst);
	const burstV = Array.from({ length: BURST }, (_, i) => {
		const r = seeded(900 + i);
		const a = r() * Math.PI * 2;
		const up = 0.25 + r() * 0.9;
		const sp = 0.4 + r() * 0.9;
		return [Math.cos(a) * sp, up * sp * 1.2, Math.sin(a) * sp];
	});
	disposables.push(trailGeo, trailMat, dot, burstGeo, burstMat, ring.geometry, ring.material as THREE.Material);

	const pos = new THREE.Vector3();
	const dir = new THREE.Vector3();
	const look = new THREE.Vector3();
	const up = new THREE.Vector3(0, 1, 0);
	const hit = new THREE.Vector3();
	const tmp = new THREE.Vector3();

	return {
		group,
		hole,
		update(camera, k, t, secs) {
			const s = fallS(k);
			const f = fallAt(s);
			pos.set(base.x + f.pos[0], base.y + f.pos[1], base.z + f.pos[2]);
			dir.set(f.dir[0], f.dir[1], f.dir[2]);
			const end = fallAt(1).pos;
			hit.set(base.x + end[0], base.y + end[1], base.z + end[2]);
			const alt = Math.max(0, f.pos[1]);
			// the chariot stays the same size on screen while the world rushes up at it
			const size = 0.014 + 0.05 * Math.min(1, alt / 9);
			const after = Math.max(0, k - IMPACT);
			car.root.scale.setScalar(size);
			car.root.position.copy(pos);
			if (after > 0) {
				car.root.position.copy(hit);
				car.root.rotation.set(0.9 + Math.min(1, after * 30) * 0.6, 2.4, 0.5);
			} else {
				look.copy(pos).add(dir);
				car.root.lookAt(look);
				car.root.rotateZ(Math.sin(t * 2.3) * 0.06 + Math.sin(k * 9) * 0.12);
			}
			for (const w of car.wheels) w.rotation.x = -t * 14;
			for (const [n, sash] of car.sashes.entries()) {
				const base = sash.userData.base as Float32Array;
				const arr = sash.geometry.attributes.position.array as Float32Array;
				for (let i = 0; i < arr.length; i += 3) {
					const back = -base[i + 2];
					arr[i] = base[i] + Math.sin(t * 9 + back * 6 + n) * 0.05 * back;
					arr[i + 1] = base[i + 1] + Math.sin(t * 7 + back * 4 + n * 2) * 0.09 * back + back * 0.2;
					arr[i + 2] = base[i + 2];
				}
				sash.geometry.attributes.position.needsUpdate = true;
			}

			// five-colour cloud, laid along the path already flown
			for (let i = 0; i < TRAIL; i++) {
				const [jx, jy, jz, life] = trailSeed[i];
				const born = Math.max(0, Math.min(k, IMPACT) - life * 0.22);
				const age = Math.min(k, IMPACT) - born;
				const at = fallAt(fallS(born));
				const spread = 0.02 + age * 2.2 * (0.014 + 0.05 * Math.min(1, Math.max(0, at.pos[1]) / 9));
				trailPos[i * 3] = base.x + at.pos[0] + jx * spread * 6;
				trailPos[i * 3 + 1] = base.y + at.pos[1] + jy * spread * 6 + 0.012;
				trailPos[i * 3 + 2] = base.z + at.pos[2] + jz * spread * 6;
				const c = palette[i % 5];
				const fade = after > 0 ? Math.max(0, 1 - after * 12) : Math.max(0, 1 - age * 4);
				trailCol[i * 3] = c.r * fade;
				trailCol[i * 3 + 1] = c.g * fade;
				trailCol[i * 3 + 2] = c.b * fade;
			}
			trailGeo.attributes.position.needsUpdate = true;
			trailGeo.attributes.color.needsUpdate = true;
			trailMat.size = 0.25 * size * 4;

			const tau = after * secs;
			ring.visible = after > 0;
			ring.position.copy(hit);
			ring.position.y += 0.002;
			ring.scale.setScalar(0.004 + 0.32 * Math.sqrt(tau / 1.6));
			(ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - tau / 1.4);
			burst.visible = after > 0;
			for (let i = 0; i < BURST; i++) {
				const v = burstV[i];
				burstPos[i * 3] = hit.x + v[0] * tau * 0.05;
				burstPos[i * 3 + 1] = hit.y + v[1] * tau * 0.05 - 0.02 * tau * tau;
				burstPos[i * 3 + 2] = hit.z + v[2] * tau * 0.05;
			}
			burstGeo.attributes.position.needsUpdate = true;
			burstMat.opacity = Math.max(0, 1 - tau / 2.2);

			// the camera rides behind and above, lagging; after the hit it is thrown and rolls
			const back = 3.4 * size;
			const sway = Math.sin(t * 1.3) * 0.18 + Math.sin(t * 3.1) * 0.06;
			if (after <= 0) {
				tmp.copy(dir).multiplyScalar(-back);
				camera.position.copy(pos).add(tmp);
				camera.position.y += back * 0.55;
				camera.position.x += sway * back;
				look.copy(pos).addScaledVector(dir, back * 2.2);
				camera.up.copy(up);
				camera.lookAt(look);
				camera.fov = 48 + 22 * smoothstepJs(0.45, IMPACT, k);
			} else {
				const thrown = Math.min(1, tau / 1.2);
				camera.position.set(hit.x - 0.02 - 0.05 * thrown, hit.y + 0.03 + 0.02 * Math.sin(thrown * 3), hit.z + 0.08 + 0.06 * thrown);
				look.set(hit.x, hit.y + 0.15 * thrown * thrown, hit.z - 0.05);
				camera.up.set(Math.sin(thrown * 1.3), Math.cos(thrown * 1.3), 0);
				camera.lookAt(look);
				camera.fov = 70 - 12 * thrown;
			}
			camera.near = Math.max(0.0008, back * 0.06);
			camera.far = 45;
			camera.updateProjectionMatrix();
			sky.position.copy(camera.position);
		},
		dispose() {
			group.traverse((o) => {
				const m = o as THREE.Mesh;
				if (m.geometry) m.geometry.dispose();
			});
			for (const d of disposables) d.dispose();
		}
	};
}

function smoothstepJs(a: number, b: number, x: number): number {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
}
