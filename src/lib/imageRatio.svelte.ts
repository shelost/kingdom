import type { Attachment } from 'svelte/attachments';
import { SvelteMap } from 'svelte/reactivity';

/** Natural width ÷ height per image src, recorded once the file decodes. */
const ratios = new SvelteMap<string, number>();

export function naturalRatio(src: string | null | undefined): number | undefined {
	return src ? ratios.get(src) : undefined;
}

/** Record the decoded image's natural aspect ratio under `src` (the logical src, not the srcset pick). */
export function measureRatio(src: string): Attachment<HTMLImageElement> {
	return (img) => {
		const read = () => {
			if (img.naturalWidth <= 0 || img.naturalHeight <= 0) return;
			const ratio = img.naturalWidth / img.naturalHeight;
			if (ratios.get(src) !== ratio) ratios.set(src, ratio);
		};
		if (img.complete) read();
		img.addEventListener('load', read);
		return () => img.removeEventListener('load', read);
	};
}
