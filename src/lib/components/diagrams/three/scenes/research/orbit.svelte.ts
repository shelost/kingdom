/**
 * Research models sit on a slow turntable: the camera swings between a few
 * views while the figure is on screen. Labels re-project with the camera, so
 * they stay pinned. Reduced motion holds the first view.
 */
import { getKit, type Bounds, type View } from '../../kit.svelte';

export function useOrbit(bounds: Bounds, views: View[], every = 5200) {
	const kit = getKit();
	let i = $state(0);

	$effect(() => kit.fit(bounds, views[i % views.length]));

	$effect(() => {
		if (!kit.active || !kit.visible || kit.reduced || views.length < 2) return;
		const id = setInterval(() => i++, every);
		return () => clearInterval(id);
	});
}

/** Points around a ring of radius r at angle a (radians, 0 = facing the viewer). */
export const around = (r: number, a: number, y: number): [number, number, number] => [
	Math.sin(a) * r,
	y,
	Math.cos(a) * r
];
