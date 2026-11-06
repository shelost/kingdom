/** One frame of the intro at time `t`. Pure on (plan, images, t): scrub, preview and recording agree. */

import { CLOSE, cutAt, type Plan } from './timeline';

export type Look = { title: string; ko: string; color: string; ink?: string };

type Rect = { x: number; y: number; w: number; h: number };

export const TITLE_FONT = 'Anton';
export const KO_FONT = 'Black Han Sans';

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);
const easeInOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, r: Rect, zoom: number, px: number, py: number) {
	const iw = img.naturalWidth;
	const ih = img.naturalHeight;
	if (!iw || !ih) return;
	const s = Math.max(r.w / iw, r.h / ih) * zoom;
	const w = iw * s;
	const h = ih * s;
	const tall = ih / iw > r.h / r.w;
	const x = r.x + (r.w - w) / 2 + px;
	const y = r.y + (r.h - h) * (tall ? 0.14 : 0.5) + py;
	ctx.drawImage(img, x, y, w, h);
}

function logoBox(ctx: CanvasRenderingContext2D, W: number, H: number, title: string): { box: Rect; size: number } {
	const size = Math.round(H * 0.2);
	ctx.font = `${size}px "${TITLE_FONT}"`;
	ctx.letterSpacing = `${Math.round(size * 0.02)}px`;
	const tw = ctx.measureText(title).width;
	const w = tw + size * 0.55;
	const h = size * 1.3;
	return { box: { x: (W - w) / 2, y: (H - h) / 2, w, h }, size };
}

export function draw(
	ctx: CanvasRenderingContext2D,
	W: number,
	H: number,
	t: number,
	plan: Plan,
	images: (HTMLImageElement | null)[],
	look: Look
) {
	ctx.save();
	ctx.globalCompositeOperation = 'source-over';
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, W, H);

	const i = cutAt(plan.cuts, t);
	if (i < 0) {
		ctx.restore();
		return;
	}
	const cut = plan.cuts[i];
	const next = plan.cuts[i + 1]?.t ?? cut.t + 0.6;
	const local = t - cut.t;
	const u = clamp(local / Math.max(0.01, next - cut.t));

	const { box, size } = logoBox(ctx, W, H, look.title);
	const close = easeInOut(clamp((t - plan.logo) / CLOSE));
	const rect: Rect = {
		x: lerp(0, box.x, close),
		y: lerp(0, box.y, close),
		w: lerp(W, box.w, close),
		h: lerp(H, box.h, close)
	};

	ctx.save();
	ctx.beginPath();
	ctx.rect(rect.x, rect.y, rect.w, rect.h);
	ctx.clip();

	const img = images[cut.frame];
	if (img) {
		let zoom = 1.08;
		let px = 0;
		let py = 0;
		if (cut.kind === 'slow') {
			zoom = 1.05 + 0.1 * u;
			px = cut.dx * rect.w * 0.025 * u;
			py = cut.dy * rect.h * 0.015 * u;
		} else if (cut.kind === 'hold') {
			zoom = 1.02 + 0.12 * easeOut(u);
		} else {
			zoom = 1.14 - 0.06 * u;
			px = cut.dx * rect.w * 0.06 * (1 - easeOut(clamp(local / 0.06)));
		}
		cover(ctx, img, rect, zoom, px, py);
	}

	const fastU = clamp((t - plan.drop) / Math.max(0.1, plan.logo - plan.drop));
	const tint =
		cut.kind === 'slow' ? 0.5 : cut.kind === 'hold' ? 0.55 : cut.kind === 'logo' ? 0.85 : lerp(0.5, 0.82, fastU);
	ctx.globalCompositeOperation = 'color';
	ctx.globalAlpha = tint;
	ctx.fillStyle = look.color;
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	ctx.globalCompositeOperation = 'multiply';
	ctx.globalAlpha = tint * 0.4;
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

	ctx.globalCompositeOperation = 'source-over';
	const vignette = ctx.createRadialGradient(
		rect.x + rect.w / 2, rect.y + rect.h / 2, Math.min(rect.w, rect.h) * 0.35,
		rect.x + rect.w / 2, rect.y + rect.h / 2, Math.hypot(rect.w, rect.h) * 0.6
	);
	vignette.addColorStop(0, 'rgba(0,0,0,0)');
	vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
	ctx.globalAlpha = 1 - close;
	ctx.fillStyle = vignette;
	ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

	if (cut.hit > 0) {
		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = cut.hit * 0.3 * Math.exp(-local * 22);
		ctx.fillStyle = '#fff';
		ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	}

	const solid = clamp((t - plan.logo - CLOSE * 0.6) / (CLOSE * 0.4));
	if (solid > 0) {
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = solid;
		ctx.fillStyle = look.color;
		ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
	}
	ctx.restore();

	const landed = t - plan.logo - CLOSE;
	if (landed >= 0) {
		const tail = plan.end - plan.logo - CLOSE;
		const pop = easeOut(clamp(landed / 0.45));
		const scale = (1.16 - 0.16 * pop) * (1 - 0.03 * clamp(landed / tail));
		ctx.save();
		ctx.translate(W / 2, H / 2);
		ctx.scale(scale, scale);
		ctx.globalAlpha = clamp(landed / 0.12);
		ctx.fillStyle = look.ink ?? '#fff';
		ctx.font = `${size}px "${TITLE_FONT}"`;
		ctx.letterSpacing = `${Math.round(size * 0.02)}px`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(look.title, 0, size * 0.04);
		ctx.restore();

		const ko = clamp((landed - 0.5) / 0.5);
		if (ko > 0) {
			ctx.save();
			ctx.globalAlpha = ko * 0.9;
			ctx.fillStyle = '#fff';
			ctx.font = `${Math.round(H * 0.035)}px "${KO_FONT}"`;
			ctx.letterSpacing = `${Math.round(H * 0.02)}px`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillText(look.ko, W / 2, box.y + box.h + H * 0.04);
			ctx.restore();
		}

		ctx.globalCompositeOperation = 'lighter';
		ctx.globalAlpha = 0.75 * Math.exp(-landed * 7);
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, W, H);
	}

	const fade = clamp((plan.end - t) / 0.35);
	if (fade < 1) {
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 1 - fade;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, W, H);
	}
	ctx.restore();
}
