import { createReadStream } from 'node:fs';
import { access, constants } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { RequestHandler } from './$types';

/** Cover art lives on R2. This route makes it same-origin so the book mesh can use it. */
const HOST = 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev';

export const GET: RequestHandler = async ({ params }) => {
	const rel = params.path;
	if (!rel || rel.includes('..')) return new Response('bad path', { status: 400 });

	const upstream = await fetch(`${HOST}/${rel}`);
	if (upstream.ok && upstream.body) {
		return new Response(upstream.body, {
			headers: {
				'content-type': upstream.headers.get('content-type') ?? 'application/octet-stream',
				'cache-control': 'public, max-age=86400'
			}
		});
	}

	/** Local installs (no R2 credentials yet) under `static/posters/alts/…`. */
	const local = path.resolve('static', ...rel.split('/').filter(Boolean));
	const root = path.resolve('static');
	if (!local.startsWith(root + path.sep)) return new Response('bad path', { status: 400 });
	try {
		await access(local, constants.R_OK);
	} catch {
		return new Response('missing', { status: upstream.status || 404 });
	}
	const stream = Readable.toWeb(createReadStream(local)) as ReadableStream;
	const contentType = local.endsWith('.png')
		? 'image/png'
		: local.endsWith('.webp')
			? 'image/webp'
			: 'image/jpeg';
	return new Response(stream, {
		headers: {
			'content-type': contentType,
			'cache-control': 'public, max-age=3600'
		}
	});
};
