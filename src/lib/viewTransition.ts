import type { OnNavigate } from '@sveltejs/kit';

/**
 * Run a SvelteKit navigation inside a View Transition, with `className` on <html>
 * until it finishes so app.css can choreograph just this kind of move.
 * Return the result from `onNavigate`. Without the API, or under reduced motion,
 * the navigation simply happens.
 */
export function withViewTransition(
	navigation: OnNavigate,
	className: string
): Promise<void> | undefined {
	if (typeof document === 'undefined' || !document.startViewTransition) return;
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const root = document.documentElement;
	const done = () => root.classList.remove(className);
	return new Promise((resolve) => {
		root.classList.add(className);
		const transition = document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
		transition.finished.then(done, done);
	});
}
