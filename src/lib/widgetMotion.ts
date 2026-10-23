/**
 * How each kind of widget arrives in immersion's widgets panel. The motion is
 * picked from the widget's group (`$lib/widgets`), so a new kind inherits the
 * entrance of its family:
 *
 * - paper   records, edicts, covenants, omens, oaths: slide in from the right,
 *           tilted like a sheet laid down, and settle flat.
 * - float   character cards and coronations: float up into place.
 * - plop    place cards and maps: drop onto the table with a little squash;
 *           the panel adds a pin that falls in after (see `.pin` there).
 * - unroll  hanja, terms, idioms, poems: unroll top to bottom like a scroll.
 * - zoom    diagrams: come into focus.
 * - rise    anything else: a plain fade up.
 */
import type { TransitionConfig } from 'svelte/transition';
import { cubicOut, cubicInOut, quintOut } from 'svelte/easing';
import type { Block } from '$lib/story';
import { widgetKindOf, widgetType, type WidgetGroup } from '$lib/widgets';

export type WidgetMotion = 'paper' | 'float' | 'plop' | 'unroll' | 'zoom' | 'rise';

const BY_GROUP: Record<WidgetGroup, WidgetMotion> = {
	sources: 'paper',
	characters: 'float',
	evolutions: 'float',
	places: 'plop',
	maps: 'plop',
	classics: 'unroll',
	diagrams: 'zoom',
	other: 'rise'
};

export function motionOf(b: Block): WidgetMotion {
	const kind = widgetKindOf(b);
	const group = kind ? widgetType(kind)?.group : undefined;
	return group ? BY_GROUP[group] : 'rise';
}

/** Piecewise drop: fall, squash on landing, spring back. */
function plop(t: number): string {
	if (t < 0.55) {
		const p = t / 0.55;
		const y = -44 * (1 - p * p);
		return `transform: translateY(${y}px) scale(${1.08 - 0.08 * p}); opacity: ${Math.min(1, p * 1.6)}`;
	}
	if (t < 0.75) {
		const p = Math.sin(((t - 0.55) / 0.2) * Math.PI);
		return `transform: scale(${1 + 0.035 * p}, ${1 - 0.06 * p}); transform-origin: center bottom`;
	}
	const p = Math.sin(((t - 0.75) / 0.25) * Math.PI);
	return `transform: translateY(${-5 * p}px); transform-origin: center bottom`;
}

export function widgetIn(
	_node: Element,
	{ motion, reduce = false }: { motion: WidgetMotion; reduce?: boolean }
): TransitionConfig {
	if (reduce) return { duration: 200, css: (t) => `opacity: ${t}` };
	switch (motion) {
		case 'paper':
			return {
				duration: 760,
				easing: cubicOut,
				css: (t, u) =>
					`transform: translateX(${u * 72}%) translateY(${-u * 14}px) rotate(${u * 9 - Math.sin(t * Math.PI) * 1.6}deg);` +
					`transform-origin: right top; opacity: ${Math.min(1, t * 2.2)}`
			};
		case 'float':
			return {
				duration: 820,
				easing: quintOut,
				css: (t, u) => `transform: translateY(${u * 56}px) scale(${0.93 + 0.07 * t}); opacity: ${t}`
			};
		case 'plop':
			return { duration: 760, css: (t) => plop(t) };
		case 'unroll':
			return {
				duration: 820,
				easing: cubicInOut,
				css: (t, u) =>
					`clip-path: inset(0 0 ${u * 100}% 0 round var(--widget-radius)); transform: translateY(${-u * 10}px); opacity: ${Math.min(1, t * 3)}`
			};
		case 'zoom':
			return {
				duration: 640,
				easing: cubicOut,
				css: (t, u) => `transform: scale(${0.86 + 0.14 * t}); filter: blur(${u * 6}px); opacity: ${t}`
			};
		default:
			return {
				duration: 520,
				easing: cubicOut,
				css: (t, u) => `transform: translateY(${u * 24}px); opacity: ${t}`
			};
	}
}
