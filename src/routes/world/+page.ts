import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

/** World is merged into the Home hub. */
export const load: PageLoad = () => {
	redirect(308, '/');
};
