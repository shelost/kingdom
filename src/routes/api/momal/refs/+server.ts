import { json } from '@sveltejs/kit';
import { refsFor } from '$lib/server/askTrace';
import type { RequestHandler } from './$types';

function ids(raw: string | null): string[] {
	return (raw ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean)
		.slice(0, 12);
}

/** Cards for widget ids Momal named that were not in the answer's trace. */
export const GET: RequestHandler = ({ url }) =>
	json(refsFor(ids(url.searchParams.get('people')), ids(url.searchParams.get('episodes'))), {
		headers: { 'cache-control': 'public, max-age=300' }
	});
