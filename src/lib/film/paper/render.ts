/**
 * The shadow box. Sheets stand one behind another in front of a light; the
 * camera eases across the shot and near sheets slide further than far ones.
 * Each sheet is a crisp vector cut with fibre texture, a lit torn edge, and a
 * soft shadow baked once onto a small canvas and laid on the sheet behind.
 */
import { BLEED, H, W, ease, fibres, mix, rgba, wave, type Pt } from './kit';

export type Frame = {
	/** Seconds of film time: loops read this. */
	t: number;
	/** 0…1 through the shot: one-way actions read this. */
	k: number;
	/** This sheet's paper colour. */
	color: string;
	light: string;
	/** Paper fibre, for cut-outs that bring their own colour. */
	grain: CanvasPattern | null;
};

export type Sheet = {
	/** 0 at the back of the box, 1 against the lens. */
	depth: number;
	color?: string;
	/** The static cut. */
	cut?: (p: Path2D) => void;
	/** The whole sheet slides over the shot (clouds parting, a sun rising). */
	move?: (f: Frame) => Pt;
	/** Moving cut-outs on this sheet, drawn after it and before the next. */
	draw?: (ctx: CanvasRenderingContext2D, f: Frame) => void;
	/** How strongly the light catches the torn edge, 0…1. */
	rim?: number;
	/** Colour of the figures cut from this sheet, when it differs from the sheet (dark walkers on snow). */
	ink?: string;
};

export type PaperScene = {
	sky: [string, string];
	/** Paper colour at the back and at the front; a sheet without a colour mixes by depth. */
	far: string;
	near: string;
	light: { x: number; y: number; r: number; color: string; flicker?: number; power?: number; rise?: number };
	/** Camera at the start and end of the shot: pan x, pan y, zoom. */
	cam: { from: [number, number, number]; to: [number, number, number] };
	/** On the back wall, behind every sheet: moon, sun, stars. */
	back?: (ctx: CanvasRenderingContext2D, f: Frame) => void;
	/** In front of every sheet: snow, petals. */
	front?: (ctx: CanvasRenderingContext2D, f: Frame) => void;
	sheets: Sheet[];
};

type Baked = {
	sheet: Sheet;
	color: string;
	path: Path2D | null;
	shadow: HTMLCanvasElement | null;
	edge: HTMLCanvasElement | null;
};

type Ready = {
	scene: PaperScene;
	sheets: Baked[];
	pattern: CanvasPattern | null;
};

/** Resolution of the baked shadow and edge light, in pixels per board unit. */
const SHADE = 0.25;
const EDGE = 0.5;
/** Board width a tall screen still shows; the bleed covers the extra height. */
const KEEP = 1250;

function layer(scale: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
	const c = document.createElement('canvas');
	c.width = Math.ceil((W + BLEED * 2) * scale);
	c.height = Math.ceil((H + BLEED * 2) * scale);
	const g = c.getContext('2d')!;
	g.setTransform(scale, 0, 0, scale, BLEED * scale, BLEED * scale);
	return [c, g];
}

function bake(path: Path2D, depth: number): HTMLCanvasElement {
	const [c, g] = layer(SHADE);
	const off = (W + BLEED * 3) * SHADE;
	g.setTransform(SHADE, 0, 0, SHADE, BLEED * SHADE - off, BLEED * SHADE);
	g.shadowColor = 'rgba(0,0,0,0.85)';
	g.shadowBlur = (10 + depth * 16) * SHADE * 2;
	g.shadowOffsetX = off;
	g.fillStyle = '#000';
	g.fill(path);
	return c;
}

/**
 * Light caught on the torn edge, from the sheet's outline as a whole: the space
 * outside the sheet is blurred in the light's colour and kept only inside it, so
 * the pieces a sheet is cut from leave no seams. Nudged away from the light, the
 * lip that faces it glows hardest.
 */
function edgeLight(path: Path2D, light: string, dx: number, dy: number): HTMLCanvasElement {
	const [c, g] = layer(EDGE);
	const [o, og] = layer(EDGE);
	og.fillRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2);
	og.globalCompositeOperation = 'destination-out';
	og.fill(path);
	g.setTransform(1, 0, 0, 1, 0, 0);
	for (const [blur, alpha, push] of [
		[30, 0.32, 1.6],
		[3, 0.9, 1]
	]) {
		g.shadowColor = rgba(light, alpha);
		g.shadowBlur = blur * EDGE;
		g.shadowOffsetX = c.width + dx * push * EDGE;
		g.shadowOffsetY = dy * push * EDGE;
		g.drawImage(o, -c.width, 0);
	}
	g.shadowColor = 'transparent';
	g.globalCompositeOperation = 'destination-in';
	g.setTransform(EDGE, 0, 0, EDGE, BLEED * EDGE, BLEED * EDGE);
	g.fill(path);
	return c;
}

const made = new WeakMap<PaperScene, Ready>();

/** Cut every sheet and bake its shadow and edge light, once per scene. */
export function prepare(scene: PaperScene, ctx: CanvasRenderingContext2D): Ready {
	const hit = made.get(scene);
	if (hit) return hit;
	const L = scene.light;
	const vx = W / 2 - L.x;
	const vy = H * 0.75 - L.y;
	const vl = Math.hypot(vx, vy) || 1;
	const sheets = [...scene.sheets]
		.sort((a, b) => a.depth - b.depth)
		.map((sheet): Baked => {
			const color = sheet.color ?? mix(scene.far, scene.near, sheet.depth);
			if (!sheet.cut) return { sheet, color, path: null, shadow: null, edge: null };
			const path = new Path2D();
			sheet.cut(path);
			const lit = (sheet.rim ?? 0.6) > 0.02;
			return { sheet, color, path, shadow: bake(path, sheet.depth), edge: lit ? edgeLight(path, L.color, (vx / vl) * 5, (vy / vl) * 5) : null };
		});
	const ready = { scene, sheets, pattern: ctx.createPattern(fibres(), 'repeat') };
	made.set(scene, ready);
	return ready;
}

const shimmer = wave(911);

export function render(ctx: CanvasRenderingContext2D, ready: Ready, cw: number, ch: number, t: number, k: number): void {
	const { scene } = ready;
	const S = Math.max(cw / W, Math.min(ch / H, cw / KEEP));
	const e = ease(k);
	const [fx, fy, fz] = scene.cam.from;
	const [tx, ty, tz] = scene.cam.to;
	const cx = fx + (tx - fx) * e + Math.sin(t * 0.23) * 9;
	const cy = fy + (ty - fy) * e + Math.sin(t * 0.31 + 1) * 5;
	const cz = fz + (tz - fz) * e;
	const L = scene.light;
	const flick = 1 + (L.flicker ?? 0) * (shimmer(t * 2.7) * 0.6 + shimmer(t * 7.3 + 40) * 0.4);
	const ly = L.y - (L.rise ?? 0) * e;

	const at = (d: number, dx = 0, dy = 0) => {
		const s = S * (1 + (cz - 1) * (0.3 + 0.7 * d));
		const m = 0.12 + 0.88 * d;
		ctx.setTransform(s, 0, 0, s, cw / 2 - (W / 2 + cx * m - dx) * s, ch / 2 - (H / 2 + cy * m - dy) * s);
		return s;
	};

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.globalCompositeOperation = 'source-over';
	ctx.globalAlpha = 1;
	const sky = ctx.createLinearGradient(0, 0, 0, ch);
	sky.addColorStop(0, scene.sky[0]);
	sky.addColorStop(1, scene.sky[1]);
	ctx.fillStyle = sky;
	ctx.fillRect(0, 0, cw, ch);

	at(0);
	const glow = ctx.createRadialGradient(L.x, ly, 0, L.x, ly, L.r * flick);
	const power = (L.power ?? 0.9) * Math.min(1.15, flick);
	glow.addColorStop(0, rgba(L.color, power));
	glow.addColorStop(0.35, rgba(L.color, power * 0.38));
	glow.addColorStop(1, rgba(L.color, 0));
	ctx.globalCompositeOperation = 'screen';
	ctx.fillStyle = glow;
	ctx.fillRect(-BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2);
	ctx.globalCompositeOperation = 'source-over';

	const frame = (color: string): Frame => ({ t, k, color, light: L.color, grain: ready.pattern });
	if (scene.back) {
		ctx.save();
		scene.back(ctx, frame(scene.far));
		ctx.restore();
	}

	for (const { sheet, color, path, shadow, edge } of ready.sheets) {
		const ink = sheet.ink ?? color;
		const f = frame(ink);
		const [mx, my] = sheet.move?.(f) ?? [0, 0];
		const s = at(sheet.depth, mx, my);
		if (path && shadow) {
			const away = Math.sign(W / 2 - L.x) || 1;
			ctx.globalAlpha = 0.5;
			ctx.drawImage(shadow, -BLEED + away * (4 + sheet.depth * 10), -BLEED + 6 + sheet.depth * 14, W + BLEED * 2, H + BLEED * 2);
			ctx.globalAlpha = 1;
			ctx.fillStyle = color;
			ctx.fill(path);
			if (ready.pattern) {
				ctx.globalAlpha = 0.55;
				ctx.fillStyle = ready.pattern;
				ctx.fill(path);
			}
			if (edge) {
				ctx.globalAlpha = Math.min(1, (sheet.rim ?? 0.6) * (0.55 + 0.45 * (1 - sheet.depth)) * Math.min(1.25, flick));
				ctx.drawImage(edge, -BLEED, -BLEED, W + BLEED * 2, H + BLEED * 2);
			}
			ctx.globalAlpha = 1;
		}
		if (sheet.draw) {
			ctx.save();
			ctx.fillStyle = ink;
			ctx.strokeStyle = ink;
			ctx.shadowColor = 'rgba(0,0,0,0.45)';
			ctx.shadowBlur = 8 * s;
			ctx.shadowOffsetY = 5 * s;
			sheet.draw(ctx, f);
			ctx.restore();
		}
	}

	if (scene.front) {
		at(1.1);
		ctx.save();
		scene.front(ctx, frame(scene.near));
		ctx.restore();
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	if (ready.pattern) {
		ctx.globalCompositeOperation = 'overlay';
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = ready.pattern;
		ctx.fillRect(0, 0, cw, ch);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
	}
	const vig = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.35, cw / 2, ch / 2, Math.max(cw, ch) * 0.75);
	vig.addColorStop(0, 'rgba(0,0,0,0)');
	vig.addColorStop(1, 'rgba(0,0,0,0.55)');
	ctx.fillStyle = vig;
	ctx.fillRect(0, 0, cw, ch);
}
