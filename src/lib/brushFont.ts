/**
 * Which calligraphy face to brush a run of hanja in.
 *
 * Yuji Boku is a true brush kaisho but is cut for Japanese, so it lacks some
 * Korean/Traditional forms (內 姬 戶 說 雞…). Google's unicode-range slices
 * over-report its coverage, so each character is checked by drawing it.
 * A run uses one face throughout: if Yuji is missing any character, the whole
 * run falls back to LXGW WenKai TC bold, then per glyph to Noto Serif KR.
 */

export const BRUSH_HAN = `'Yuji Boku', 'LXGW WenKai TC', 'Noto Serif KR', serif`;
export const BRUSH_HAN_FALLBACK = `'LXGW WenKai TC', 'Noto Serif KR', serif`;

const HAN = /\p{Script=Han}/u;
const PX = 40;
const covered = new Map<string, boolean>();
let canvas: CanvasRenderingContext2D | null | undefined;

function ctx() {
	if (canvas === undefined) {
		const c = document.createElement('canvas');
		c.width = c.height = PX;
		canvas = c.getContext('2d', { willReadFrequently: true });
	}
	return canvas;
}

function draw(c: CanvasRenderingContext2D, char: string, font: string) {
	c.clearRect(0, 0, PX, PX);
	c.font = `${PX * 0.8}px ${font}`;
	c.textBaseline = 'middle';
	c.fillText(char, 2, PX / 2);
	return c.getImageData(0, 0, PX, PX).data;
}

/**
 * Yuji Boku has a glyph if putting it in front of the fallback stack changes the drawing.
 * Both sides must end in the same loaded faces: the system fallback the browser picks
 * for a missing glyph depends on the primary family, so a bare `serif` would differ anyway.
 */
function inYuji(char: string): boolean {
	const hit = covered.get(char);
	if (hit !== undefined) return hit;
	const c = ctx();
	let ok = true;
	if (c) {
		const a = draw(c, char, BRUSH_HAN);
		const b = draw(c, char, BRUSH_HAN_FALLBACK);
		ok = a.some((v, i) => v !== b[i]);
	}
	covered.set(char, ok);
	return ok;
}

/** The font stack to brush `text` in, once its hanja subsets have loaded. */
export async function brushFamily(text: string): Promise<string> {
	const han = Array.from(text).filter((g) => HAN.test(g));
	if (!han.length || typeof document === 'undefined' || !document.fonts) return BRUSH_HAN;
	const sample = han.join('');
	try {
		await Promise.all([
			document.fonts.load(`${PX}px 'Yuji Boku'`, sample),
			document.fonts.load(`700 ${PX}px 'LXGW WenKai TC'`, sample),
			document.fonts.load(`900 ${PX}px 'Noto Serif KR'`, sample)
		]);
	} catch {
		return BRUSH_HAN;
	}
	return han.every(inYuji) ? BRUSH_HAN : BRUSH_HAN_FALLBACK;
}
