import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** Chapters folded into the Library shelf at /books. */
export const load: PageLoad = ({ url }) => {
	throw redirect(308, `/books${url.search}`);
};
