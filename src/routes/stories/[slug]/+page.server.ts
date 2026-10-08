import { error } from '@sveltejs/kit';
import { OUTLINES, outlineBySlug } from '$lib/outlines';
import { renderStoryMap } from '$lib/server/storyMaps';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => OUTLINES.map((o) => ({ slug: o.slug }));

export const load: PageServerLoad = ({ params }) => {
	const outline = outlineBySlug(params.slug);
	if (!outline) error(404, 'No such story');
	return { outline, maps: (outline.maps ?? []).map(renderStoryMap) };
};
