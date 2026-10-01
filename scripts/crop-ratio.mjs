// House frame for chronicle stills: horizontal 2:1. The generator tops out at 16:9,
// so installers centre-crop to the house ratio unless an item asks for another one.
import { execFileSync } from 'node:child_process';

export const HOUSE_RATIO = 2;

/** `'native'` / `0` / `null` keep the generator's frame; any other value is width ÷ height. */
export function parseRatio(value, fallback = HOUSE_RATIO) {
	if (value === 'native' || value === 0 || value === null) return null;
	if (value === undefined || value === '') return fallback;
	const n = Number(value);
	return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function imageSize(file) {
	const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
	return {
		w: Number(out.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0),
		h: Number(out.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0)
	};
}

/** sips args that centre-crop `file` to `ratio`, or [] when it already fits / ratio is null. */
export function cropArgs(file, ratio) {
	if (!ratio) return [];
	const { w, h } = imageSize(file);
	if (!w || !h) return [];
	const [cw, ch] = w / h > ratio ? [Math.round(h * ratio), h] : [w, Math.round(w / ratio)];
	return cw === w && ch === h ? [] : ['-c', String(ch), String(cw)];
}
