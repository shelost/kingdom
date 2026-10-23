import type { Attachment } from 'svelte/attachments';

/** Several attachments as one, cleaned up in reverse. */
export function chain<T extends Element>(...parts: Attachment<T>[]): Attachment<T> {
	return (node) => {
		const stops = parts.map((a) => a(node));
		return () => {
			for (const stop of stops.reverse()) if (typeof stop === 'function') stop();
		};
	};
}
