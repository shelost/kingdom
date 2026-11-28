/**
 * Effects drawn over the film frame on one 2D canvas: a flower's scent you can
 * see, petals, embers, a coloured cloud, ghost wisps, foxfire, rain, a lamp
 * that will not hold still. Each effect fades in and out as shots change;
 * particles already in the air finish their flight.
 */
import type { Fx, FxId } from './types';

type P = {
	id: FxId;
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
	life: number;
	size: number;
	rot: number;
	vr: number;
	seed: number;
	color: string;
	trail?: number[];
};

type Kind = {
	/** Particles a second at full strength. */
	rate: number;
	color: string;
	/** Default emitter, 0…1 of the frame. */
	at?: [number, number];
	spawn?: (f: FxField, spec: Fx, color: string) => P;
};

const FIVE = ['#f2a7b5', '#f6d27a', '#9fd6c2', '#a9c3f0', '#d7b3ef'];

/* ————— a little value noise for drifting things ————— */

function hash(x: number, y: number, z: number): number {
	const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
	return s - Math.floor(s);
}

function noise(x: number, y: number, z: number): number {
	const xi = Math.floor(x);
	const yi = Math.floor(y);
	const zi = Math.floor(z);
	const xf = x - xi;
	const yf = y - yi;
	const zf = z - zi;
	const u = xf * xf * (3 - 2 * xf);
	const v = yf * yf * (3 - 2 * yf);
	const w = zf * zf * (3 - 2 * zf);
	const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
	const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
	return lerp(
		lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v),
		lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v),
		w
	);
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function rgba(hex: string, a: number): string {
	const h = hex.replace('#', '');
	const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
	return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

function base(f: FxField, id: FxId, color: string, x: number, y: number): P {
	return { id, x, y, vx: 0, vy: 0, age: 0, life: 4, size: 2, rot: Math.random() * Math.PI * 2, vr: 0, seed: Math.random() * 100, color };
}

const KINDS: Record<FxId, Kind> = {
	scent: {
		rate: 16,
		color: '#b9c8e8',
		at: [0.5, 0.68],
		spawn: (f, s, color) => {
			const [ax, ay] = s.at ?? [0.5, 0.68];
			const p = base(f, 'scent', color, ax * f.w + rnd(-14, 14), ay * f.h + rnd(-8, 8));
			p.vy = -rnd(26, 46);
			p.life = rnd(3.4, 5.4);
			p.size = rnd(1.4, 3.8);
			p.trail = [];
			return p;
		}
	},
	petals: {
		rate: 7,
		color: '#f4b6c8',
		spawn: (f, _s, color) => {
			const p = base(f, 'petals', color, rnd(-0.1, 1.05) * f.w, -20);
			p.vx = rnd(10, 40);
			p.vy = rnd(36, 70);
			p.vr = rnd(-2, 2);
			p.life = (f.h + 40) / p.vy + 1;
			p.size = rnd(4, 8);
			return p;
		}
	},
	embers: {
		rate: 12,
		color: '#ffad5a',
		spawn: (f, s, color) => {
			const [ax] = s.at ?? [Math.random(), 1];
			const p = base(f, 'embers', color, (s.at ? ax + rnd(-0.12, 0.12) : Math.random()) * f.w, f.h * rnd(0.75, 1.02));
			p.vy = -rnd(30, 80);
			p.vx = rnd(-10, 10);
			p.life = rnd(2.5, 5);
			p.size = rnd(1, 2.6);
			return p;
		}
	},
	snow: {
		rate: 34,
		color: '#ffffff',
		spawn: (f, _s, color) => {
			const p = base(f, 'snow', color, rnd(-0.05, 1.05) * f.w, -8);
			p.vy = rnd(24, 56);
			p.vx = rnd(-8, 8);
			p.life = (f.h + 20) / p.vy;
			p.size = rnd(1, 3);
			return p;
		}
	},
	rain: {
		rate: 140,
		color: '#c8d4e6',
		spawn: (f, _s, color) => {
			const p = base(f, 'rain', color, rnd(-0.2, 1.05) * f.w, -30);
			p.vy = rnd(900, 1300);
			p.vx = p.vy * 0.16;
			p.life = (f.h + 60) / p.vy;
			p.size = rnd(12, 22);
			return p;
		}
	},
	motes: {
		rate: 7,
		color: '#fff1c8',
		spawn: (f, _s, color) => {
			const p = base(f, 'motes', color, Math.random() * f.w, Math.random() * f.h);
			p.vx = rnd(-6, 6);
			p.vy = rnd(-10, -2);
			p.life = rnd(4, 8);
			p.size = rnd(0.8, 2.2);
			return p;
		}
	},
	stars: {
		rate: 10,
		color: '#eef4ff',
		spawn: (f, _s, color) => {
			const p = base(f, 'stars', color, Math.random() * f.w, Math.random() * f.h * 0.5);
			p.life = rnd(2.5, 5);
			p.size = rnd(0.6, 1.8);
			return p;
		}
	},
	wisps: {
		rate: 2.4,
		color: '#d6e9ff',
		spawn: (f, s, color) => {
			const [ax, ay] = s.at ?? [Math.random(), rnd(0.55, 0.95)];
			const p = base(f, 'wisps', color, (s.at ? ax + rnd(-0.2, 0.2) : ax) * f.w, (s.at ? ay + rnd(-0.1, 0.1) : ay) * f.h);
			p.vy = -rnd(10, 26);
			p.vx = rnd(-14, 14);
			p.life = rnd(4.5, 7);
			p.size = rnd(26, 60);
			p.trail = [];
			return p;
		}
	},
	cloud: {
		rate: 1.8,
		color: FIVE[0],
		at: [0.5, 0.32],
		spawn: (f, s, color) => {
			const [ax, ay] = s.at ?? [0.5, 0.32];
			const p = base(f, 'cloud', s.color ? color : FIVE[Math.floor(Math.random() * FIVE.length)], (ax + rnd(-0.22, 0.22)) * f.w, (ay + rnd(-0.1, 0.1)) * f.h);
			p.vx = rnd(-8, 8);
			p.vy = rnd(-4, 2);
			p.life = rnd(7, 10);
			p.size = rnd(110, 240) * (f.w / 1400);
			return p;
		}
	},
	fog: {
		rate: 0.7,
		color: '#dfe5ea',
		spawn: (f, _s, color) => {
			const left = Math.random() < 0.5;
			const p = base(f, 'fog', color, left ? -0.25 * f.w : 1.25 * f.w, f.h * rnd(0.62, 0.98));
			p.vx = (left ? 1 : -1) * rnd(10, 24);
			p.life = rnd(14, 20);
			p.size = rnd(0.35, 0.6) * f.w;
			return p;
		}
	},
	foxfire: {
		rate: 1.6,
		color: '#7ff0d8',
		spawn: (f, s, color) => {
			const [ax, ay] = s.at ?? [Math.random(), rnd(0.5, 0.9)];
			const p = base(f, 'foxfire', color, (s.at ? ax + rnd(-0.25, 0.25) : ax) * f.w, (s.at ? ay + rnd(-0.08, 0.08) : ay) * f.h);
			p.vx = rnd(-12, 12);
			p.vy = rnd(-8, 4);
			p.life = rnd(3.5, 6);
			p.size = rnd(6, 12);
			return p;
		}
	},
	flicker: { rate: 0, color: '#1a0e06' },
	heartbeat: { rate: 0, color: '#3a0008' },
	speed: { rate: 0, color: '#ffffff' }
};

export class FxField {
	w = 0;
	h = 0;
	private ctx: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;
	private ps: P[] = [];
	private specs: Fx[] = [];
	/** 0…1 per effect, easing toward on or off. */
	private level = new Map<FxId, number>();
	private owed = new Map<FxId, number>();
	private t = 0;
	private scale = 1;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('no 2d context');
		this.ctx = ctx;
	}

	resize(w: number, h: number, dpr: number): void {
		this.w = w;
		this.h = h;
		this.scale = Math.min(dpr, 1.5);
		this.canvas.width = Math.round(w * this.scale);
		this.canvas.height = Math.round(h * this.scale);
	}

	set(fx: Fx[]): void {
		this.specs = fx;
	}

	clear(): void {
		this.ps = [];
		this.level.clear();
		this.owed.clear();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Advance `dt` film seconds and draw. A seek (the clock jumped) snaps each
	 * effect on or off, so a scrub lands on the lines instead of easing toward them.
	 */
	step(dt: number, seek = false): void {
		const ctx = this.ctx;
		this.t += Math.max(0, dt);
		const on = new Set(this.specs.map((s) => s.id));
		for (const id of new Set([...this.level.keys(), ...on])) {
			const cur = this.level.get(id) ?? 0;
			const next = seek || dt <= 0 ? (on.has(id) ? 1 : 0) : on.has(id) ? Math.min(1, cur + dt / 0.9) : Math.max(0, cur - dt / 1.2);
			if (next <= 0 && !on.has(id)) this.level.delete(id);
			else this.level.set(id, next);
		}
		for (const spec of this.specs) {
			const kind = KINDS[spec.id];
			if (!kind.spawn || kind.rate <= 0) continue;
			const owed = (this.owed.get(spec.id) ?? 0) + kind.rate * (spec.amount ?? 1) * (this.level.get(spec.id) ?? 0) * dt;
			let n = Math.floor(owed);
			this.owed.set(spec.id, owed - n);
			while (n-- > 0 && this.ps.length < 900) this.ps.push(kind.spawn(this, spec, spec.color ?? kind.color));
		}

		ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
		ctx.clearRect(0, 0, this.w, this.h);
		this.drawVeils(ctx);

		const alive: P[] = [];
		for (const p of this.ps) {
			p.age += dt;
			if (p.age >= p.life) continue;
			this.move(p, dt);
			this.draw(ctx, p);
			alive.push(p);
		}
		this.ps = alive;
		ctx.globalCompositeOperation = 'source-over';
		this.drawOverlays(ctx);
	}

	private move(p: P, dt: number): void {
		const t = this.t;
		switch (p.id) {
			case 'scent': {
				const a = noise(p.x * 0.006, p.y * 0.006, t * 0.25 + p.seed) * Math.PI * 4;
				p.vx += Math.cos(a) * 34 * dt;
				p.vx *= 1 - 0.9 * dt;
				p.vy -= 4 * dt;
				break;
			}
			case 'petals':
				p.vx += Math.sin(t * 1.3 + p.seed) * 22 * dt;
				break;
			case 'embers':
				p.vx += (noise(p.x * 0.01, p.y * 0.01, t + p.seed) - 0.5) * 60 * dt;
				break;
			case 'wisps': {
				const a = noise(p.x * 0.004, p.y * 0.004, t * 0.2 + p.seed) * Math.PI * 4;
				p.vx += Math.cos(a) * 18 * dt;
				p.vy += Math.sin(a) * 8 * dt - 2 * dt;
				p.vx *= 1 - 0.5 * dt;
				break;
			}
			case 'foxfire':
				p.vy += Math.sin(t * 3 + p.seed) * 12 * dt;
				break;
			case 'cloud':
				p.size += 10 * dt;
				break;
		}
		p.x += p.vx * dt;
		p.y += p.vy * dt;
		p.rot += p.vr * dt;
		if (p.trail) {
			p.trail.push(p.x, p.y);
			const cap = p.id === 'scent' ? 36 : 12;
			if (p.trail.length > cap) p.trail.splice(0, p.trail.length - cap);
		}
	}

	private draw(ctx: CanvasRenderingContext2D, p: P): void {
		const life = p.age / p.life;
		const fade = Math.min(1, p.age / 0.5) * Math.min(1, (p.life - p.age) / 0.9);
		const lvl = this.level.get(p.id) ?? 0.0001;
		const a = fade * Math.max(0.25, lvl);
		switch (p.id) {
			case 'scent': {
				const tr = p.trail ?? [];
				if (tr.length < 4) return;
				ctx.globalCompositeOperation = 'lighter';
				ctx.lineCap = 'round';
				for (let i = 2; i < tr.length; i += 2) {
					const k = i / tr.length;
					ctx.strokeStyle = rgba(p.color, a * 0.32 * k);
					ctx.lineWidth = p.size * (0.4 + k) * (1 + life * 2.2);
					ctx.beginPath();
					ctx.moveTo(tr[i - 2], tr[i - 1]);
					ctx.lineTo(tr[i], tr[i + 1]);
					ctx.stroke();
				}
				return;
			}
			case 'petals': {
				ctx.globalCompositeOperation = 'source-over';
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				ctx.scale(1, 0.55 + 0.45 * Math.sin(this.t * 3 + p.seed));
				ctx.fillStyle = rgba(p.color, a * 0.9);
				ctx.beginPath();
				ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
				return;
			}
			case 'snow':
			case 'motes':
			case 'stars':
			case 'embers': {
				ctx.globalCompositeOperation = p.id === 'snow' ? 'source-over' : 'lighter';
				const tw = p.id === 'stars' || p.id === 'embers' ? 0.55 + 0.45 * Math.sin(this.t * 7 + p.seed * 9) : 1;
				const r = p.size * (p.id === 'snow' ? 1 : 2.6);
				const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
				g.addColorStop(0, rgba(p.color, a * tw));
				g.addColorStop(1, rgba(p.color, 0));
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
				ctx.fill();
				return;
			}
			case 'rain': {
				ctx.globalCompositeOperation = 'source-over';
				ctx.strokeStyle = rgba(p.color, a * 0.32);
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(p.x - p.vx * 0.018, p.y - p.size);
				ctx.stroke();
				return;
			}
			case 'wisps':
			case 'foxfire':
			case 'cloud':
			case 'fog': {
				ctx.globalCompositeOperation = p.id === 'fog' ? 'source-over' : 'lighter';
				const peak = p.id === 'cloud' ? 0.16 : p.id === 'fog' ? 0.12 : p.id === 'wisps' ? 0.2 : 0.55;
				const pts = p.trail && p.trail.length >= 2 ? p.trail : [p.x, p.y];
				const step = Math.max(2, Math.floor(pts.length / 4) * 2);
				for (let i = pts.length - 2; i >= 0; i -= step) {
					const k = 1 - (pts.length - 2 - i) / pts.length;
					const r = p.size * (0.5 + 0.5 * k);
					const x = pts[i];
					const y = pts[i + 1];
					const g = ctx.createRadialGradient(x, y, 0, x, y, r);
					g.addColorStop(0, rgba(p.id === 'foxfire' ? '#ffffff' : p.color, a * peak * k));
					g.addColorStop(p.id === 'foxfire' ? 0.25 : 0.4, rgba(p.color, a * peak * 0.7 * k));
					g.addColorStop(1, rgba(p.color, 0));
					ctx.fillStyle = g;
					if (p.id === 'fog') {
						ctx.save();
						ctx.translate(x, y);
						ctx.scale(1, 0.22);
						ctx.translate(-x, -y);
					}
					ctx.beginPath();
					ctx.arc(x, y, r, 0, Math.PI * 2);
					ctx.fill();
					if (p.id === 'fog') ctx.restore();
				}
				return;
			}
		}
	}

	/** Light that sits over the whole frame: a lamp's breath, a pulse. */
	private drawVeils(ctx: CanvasRenderingContext2D): void {
		const flicker = this.level.get('flicker') ?? 0;
		if (flicker > 0) {
			const n = noise(this.t * 6, 0.5, 1.7) * 0.6 + noise(this.t * 17, 2.1, 0.3) * 0.4;
			const g = ctx.createRadialGradient(this.w * 0.5, this.h * 0.55, this.h * 0.2, this.w * 0.5, this.h * 0.55, this.h * 0.95);
			g.addColorStop(0, 'rgba(0,0,0,0)');
			g.addColorStop(1, rgba(KINDS.flicker.color, flicker * (0.32 + n * 0.38)));
			ctx.globalCompositeOperation = 'source-over';
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, this.w, this.h);
			ctx.fillStyle = rgba('#ffb067', flicker * n * 0.06);
			ctx.fillRect(0, 0, this.w, this.h);
		}
		const beat = this.level.get('heartbeat') ?? 0;
		if (beat > 0) {
			const ph = (this.t * 1.15) % 1;
			const pulse = Math.exp(-((ph - 0.08) ** 2) / 0.002) + 0.7 * Math.exp(-((ph - 0.26) ** 2) / 0.002);
			const g = ctx.createRadialGradient(this.w / 2, this.h / 2, this.h * 0.3, this.w / 2, this.h / 2, this.h * 0.9);
			g.addColorStop(0, 'rgba(0,0,0,0)');
			g.addColorStop(1, rgba(KINDS.heartbeat.color, beat * (0.25 + pulse * 0.4)));
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, this.w, this.h);
		}
	}

	/** Comic speed lines: stable rays, thick at the rim, pointed at the vanishing hole, streaming outward. */
	private drawOverlays(ctx: CanvasRenderingContext2D): void {
		const speed = this.level.get('speed') ?? 0;
		if (speed <= 0) return;
		const spec = this.specs.find((s) => s.id === 'speed');
		const amount = spec?.amount ?? 1;
		const ink = spec?.color ?? '#f7fbff';
		const [ax, ay] = spec?.at ?? [0.5, 0.5];
		const cx = this.w * ax;
		const cy = this.h * ay;
		const reach = Math.hypot(Math.max(cx, this.w - cx), Math.max(cy, this.h - cy)) * 1.2;
		const hole = Math.min(this.w, this.h) * 0.11;
		const n = Math.round(16 + amount * 18);
		ctx.globalCompositeOperation = 'source-over';
		for (let i = 0; i < n; i++) {
			const wobble = Math.sin(i * 12.9898) * 0.045;
			const ang = (i / n) * Math.PI * 2 + wobble + this.t * 0.08;
			const flow = (this.t * 0.55 + i * 0.017) % 1;
			const inner = hole * (0.35 + flow * 0.9);
			const outer = hole + reach * (0.28 + 0.72 * flow);
			const thick = (i % 5 === 0 ? 11 : i % 2 === 0 ? 4.2 : 1.6) * (0.45 + Math.min(1, amount) * 0.7);
			const alpha = (i % 5 === 0 ? 0.62 : 0.3) * Math.min(1, speed) * Math.min(1.15, amount);
			const cos = Math.cos(ang);
			const sin = Math.sin(ang);
			const px = -sin * thick * 0.5;
			const py = cos * thick * 0.5;
			ctx.fillStyle = rgba(ink, alpha);
			ctx.beginPath();
			ctx.moveTo(cx + cos * inner, cy + sin * inner);
			ctx.lineTo(cx + cos * outer + px, cy + sin * outer + py);
			ctx.lineTo(cx + cos * outer - px, cy + sin * outer - py);
			ctx.closePath();
			ctx.fill();
		}
	}
}
