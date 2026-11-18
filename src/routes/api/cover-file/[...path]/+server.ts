import type { RequestHandler } from './$types';

/** Cover art lives on R2. This route makes it same-origin so the book mesh can use it. */
const HOST = 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev';

export const GET: RequestHandler = async ({ params }) => {
	const rel = params.path;
	if (!rel || rel.includes('..')) return new Response('bad path', { status: 400 });
	const upstream = await fetch(`${HOST}/${rel}`);
	if (!upstream.ok || !upstream.body) {
		return new Response('missing', { status: upstream.status || 404 });
	}
	return new Response(upstream.body, {
		headers: {
			'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
			'cache-control': 'public, max-age=86400'
		}
	});
};
