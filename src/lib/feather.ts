/**
 * The barred pheasant feather of the jougwan (조우관), the Goguryeo feather cap.
 * Drawn once here so the research diagram and the prologue's falling feathers share one shape.
 */

export type FeatherPaths = { vane: string; quill: string; bars: string };

/** A barred pheasant feather from (x, y) along `angle` (degrees, 0 = up), `len` long. */
export function feather(x: number, y: number, angle: number, len: number): FeatherPaths {
	const a = (angle * Math.PI) / 180;
	const dx = Math.sin(a);
	const dy = -Math.cos(a);
	const nx = -dy;
	const ny = dx;
	const w = len * 0.09;
	const tip = [x + dx * len, y + dy * len];
	const at = (k: number, side: number) => [
		x + dx * len * k + nx * w * side * Math.sin(Math.PI * k) * 1.2,
		y + dy * len * k + ny * w * side * Math.sin(Math.PI * k) * 1.2
	];
	const l = at(0.5, 1);
	const r = at(0.5, -1);
	const vane = `M${x},${y}Q${l[0]},${l[1]} ${tip[0]},${tip[1]}Q${r[0]},${r[1]} ${x},${y}Z`;
	let bars = '';
	for (let k = 0.2; k < 0.9; k += 0.1) {
		const p = at(k, 1);
		const q = at(k, -1);
		bars += `M${p[0].toFixed(1)},${p[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}`;
	}
	return { vane, quill: `M${x},${y}L${tip[0]},${tip[1]}`, bars };
}
