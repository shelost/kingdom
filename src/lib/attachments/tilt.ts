import type { Attachment } from 'svelte/attachments';

/**
 * Quasi-3D pointer tilt. Writes CSS variables only — the `.tilt` class in
 * app.css turns them into a perspective rotation and a moving glare:
 *   --tilt-x / --tilt-y   pointer offset from centre, -1 … 1
 *   --tilt-mx / --tilt-my pointer position in %, for the glare
 * Inert on touch / coarse pointers and under reduced motion.
 */
export function tilt(): Attachment<HTMLElement> {
	return (node) => {
		const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!fine || still) return;

		let rect: DOMRect | null = null;
		let frame = 0;
		let x = 0.5;
		let y = 0.5;

		const apply = () => {
			frame = 0;
			node.style.setProperty('--tilt-x', ((x - 0.5) * 2).toFixed(3));
			node.style.setProperty('--tilt-y', ((y - 0.5) * 2).toFixed(3));
			node.style.setProperty('--tilt-mx', `${(x * 100).toFixed(1)}%`);
			node.style.setProperty('--tilt-my', `${(y * 100).toFixed(1)}%`);
		};

		const enter = () => {
			rect = node.getBoundingClientRect();
		};

		const move = (e: PointerEvent) => {
			rect ??= node.getBoundingClientRect();
			x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
			y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
			frame ||= requestAnimationFrame(apply);
		};

		const leave = () => {
			cancelAnimationFrame(frame);
			frame = 0;
			rect = null;
			for (const name of ['--tilt-x', '--tilt-y', '--tilt-mx', '--tilt-my']) {
				node.style.removeProperty(name);
			}
		};

		node.addEventListener('pointerenter', enter);
		node.addEventListener('pointermove', move);
		node.addEventListener('pointerleave', leave);
		return () => {
			leave();
			node.removeEventListener('pointerenter', enter);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		};
	};
}
