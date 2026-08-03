/** Geometry helpers for floating edges that dock on circular node borders. */

export type CircleNode = {
	positionAbsolute: { x: number; y: number };
	measured?: { width?: number; height?: number };
	width?: number;
	height?: number;
};

function sizeOf(n: CircleNode) {
	const w = n.measured?.width ?? n.width ?? 48;
	const h = n.measured?.height ?? n.height ?? 48;
	return { w, h };
}

/** Center of the circular node (labels sit outside the measured box). */
export function circleCenter(n: CircleNode) {
	const { w, h } = sizeOf(n);
	const diameter = Math.min(w, h);
	return {
		x: n.positionAbsolute.x + w / 2,
		y: n.positionAbsolute.y + h / 2,
		r: diameter / 2
	};
}

/** Edge endpoints on the circumference of two circles. */
export function getFloatingEdgeParams(source: CircleNode, target: CircleNode) {
	const s = circleCenter(source);
	const t = circleCenter(target);
	const dx = t.x - s.x;
	const dy = t.y - s.y;
	const dist = Math.hypot(dx, dy) || 1;
	const ux = dx / dist;
	const uy = dy / dist;
	return {
		sx: s.x + ux * s.r,
		sy: s.y + uy * s.r,
		tx: t.x - ux * t.r,
		ty: t.y - uy * t.r
	};
}
