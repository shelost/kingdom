// Upload a still to the kingforall R2 bucket.
// The host in R2_ENDPOINT is the private S3 API, not a URL a browser can open.
// Usage:
//   node scripts/r2.mjs status
//   node scripts/r2.mjs put <object-key> <file>
//   node scripts/r2.mjs del <object-key> [object-key...]
// Prints the public URL, or nothing and exits 0 when credentials are absent.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ENDPOINT = 'https://c8ddea43874d39279fccdbc60e6ac045.r2.cloudflarestorage.com';
const DEFAULT_BUCKET = 'kingforall';

function readEnvFile(file, into) {
	if (!fs.existsSync(file)) return;
	for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
		const t = line.trim();
		if (!t || t.startsWith('#')) continue;
		const i = t.indexOf('=');
		if (i < 1) continue;
		const k = t.slice(0, i).trim();
		let v = t.slice(i + 1).trim();
		if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
			v = v.slice(1, -1);
		}
		into[k] = v;
	}
}

function loadEnv() {
	const bag = {};
	const root = process.cwd();
	readEnvFile(path.join(root, '.env'), bag);
	readEnvFile(path.join(root, '.env.local'), bag);
	for (const [k, v] of Object.entries(bag)) {
		if (!process.env[k] && v) process.env[k] = v;
	}
}

function config() {
	loadEnv();
	const key = process.env.R2_ACCESS_KEY_ID?.trim() ?? '';
	const secret = process.env.R2_SECRET_ACCESS_KEY?.trim() ?? '';
	const pub = (process.env.R2_PUBLIC_BASE ?? '').trim().replace(/\/$/, '');
	const missing = [
		!key && 'R2_ACCESS_KEY_ID',
		!secret && 'R2_SECRET_ACCESS_KEY',
		!pub && 'R2_PUBLIC_BASE'
	].filter(Boolean);
	return {
		ready: missing.length === 0,
		missing,
		key,
		secret,
		pub,
		endpoint: (process.env.R2_ENDPOINT || DEFAULT_ENDPOINT).replace(/\/$/, ''),
		bucket: (process.env.R2_BUCKET || DEFAULT_BUCKET).trim()
	};
}

function sha256(data) {
	return crypto.createHash('sha256').update(data).digest('hex');
}

function hmac(key, data) {
	return crypto.createHmac('sha256', key).update(data).digest();
}

function encodedKey(objectKey) {
	return objectKey
		.split('/')
		.filter(Boolean)
		.map((part) => encodeURIComponent(part))
		.join('/');
}

/**
 * PUT one object. Returns the public URL with a cache-bust query.
 * @param {ReturnType<typeof config>} cfg
 * @param {string} objectKey
 * @param {Buffer} body
 */
async function putBytes(cfg, objectKey, body) {
	const host = new URL(cfg.endpoint).host;
	const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
	const dateStamp = amzDate.slice(0, 8);
	const region = 'auto';
	const service = 's3';
	const payloadHash = sha256(body);
	const canonicalUri = `/${encodeURIComponent(cfg.bucket)}/${encodedKey(objectKey)}`;
	const contentType = objectKey.endsWith('.png') ? 'image/png' : 'image/jpeg';
	const cacheControl = 'public, max-age=86400';
	const canonicalHeaders = [
		`cache-control:${cacheControl}`,
		`content-type:${contentType}`,
		`host:${host}`,
		`x-amz-content-sha256:${payloadHash}`,
		`x-amz-date:${amzDate}`,
		''
	].join('\n');
	const signedHeaders = 'cache-control;content-type;host;x-amz-content-sha256;x-amz-date';
	const canonicalRequest = ['PUT', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
	const scope = `${dateStamp}/${region}/${service}/aws4_request`;
	const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
	const signing = hmac(hmac(hmac(hmac(`AWS4${cfg.secret}`, dateStamp), region), service), 'aws4_request');
	const signature = crypto.createHmac('sha256', signing).update(stringToSign).digest('hex');
	const authorization = `AWS4-HMAC-SHA256 Credential=${cfg.key}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

	const res = await fetch(`${cfg.endpoint}${canonicalUri}`, {
		method: 'PUT',
		headers: {
			'cache-control': cacheControl,
			'content-type': contentType,
			'x-amz-content-sha256': payloadHash,
			'x-amz-date': amzDate,
			authorization
		},
		body
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`R2 PUT ${objectKey} failed (${res.status}): ${text.slice(0, 280)}`);
	}
	return `${cfg.pub}/${encodedKey(objectKey)}?v=${Date.now()}`;
}

/** @returns {{ ready: boolean, missing: string[] }} */
export function r2Status() {
	const cfg = config();
	return { ready: cfg.ready, missing: cfg.missing };
}

/** Upload a file. Returns the public URL, or '' when R2 is not configured. */
export async function putFile(objectKey, file) {
	const cfg = config();
	if (!cfg.ready) return '';
	return putBytes(cfg, objectKey, fs.readFileSync(file));
}

const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

/**
 * DELETE one object. Missing keys count as gone.
 * Returns false when R2 is not configured.
 * @param {string} objectKey
 */
export async function deleteObject(objectKey) {
	const cfg = config();
	if (!cfg.ready) return false;
	const host = new URL(cfg.endpoint).host;
	const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
	const dateStamp = amzDate.slice(0, 8);
	const region = 'auto';
	const service = 's3';
	const payloadHash = EMPTY_SHA256;
	const canonicalUri = `/${encodeURIComponent(cfg.bucket)}/${encodedKey(objectKey)}`;
	const canonicalHeaders = [`host:${host}`, `x-amz-content-sha256:${payloadHash}`, `x-amz-date:${amzDate}`, ''].join(
		'\n'
	);
	const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
	const canonicalRequest = ['DELETE', canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
	const scope = `${dateStamp}/${region}/${service}/aws4_request`;
	const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
	const signing = hmac(hmac(hmac(hmac(`AWS4${cfg.secret}`, dateStamp), region), service), 'aws4_request');
	const signature = crypto.createHmac('sha256', signing).update(stringToSign).digest('hex');
	const authorization = `AWS4-HMAC-SHA256 Credential=${cfg.key}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
	const res = await fetch(`${cfg.endpoint}${canonicalUri}`, {
		method: 'DELETE',
		headers: {
			'x-amz-content-sha256': payloadHash,
			'x-amz-date': amzDate,
			authorization
		}
	});
	if (res.status === 404 || res.ok) return true;
	const text = await res.text();
	throw new Error(`R2 DELETE ${objectKey} failed (${res.status}): ${text.slice(0, 280)}`);
}

/**
 * Plate key plus its 256px sibling.
 * Accepts a public URL, a `/temp/file.jpg` path, or a bare slot id.
 * @param {string} value
 * @returns {string[]}
 */
export function stillObjectKeys(value) {
	const raw = String(value ?? '').trim().split('?')[0] ?? '';
	if (!raw || raw.includes('..')) return [];
	/** @type {string} */
	let key = '';
	if (/^https?:\/\//i.test(raw)) {
		try {
			const url = new URL(raw);
			const pub = config().pub;
			if (pub && url.host !== new URL(pub).host) return [];
			key = decodeURIComponent(url.pathname.replace(/^\//, ''));
		} catch {
			return [];
		}
	} else if (raw.startsWith('/temp/')) {
		const base = raw.split('/').pop() ?? '';
		if (!base) return [];
		key = `stills/${base}`;
	} else if (raw.startsWith('/')) {
		key = raw.replace(/^\/+/, '');
	} else {
		const base = raw.split('/').pop() ?? '';
		if (!base) return [];
		key = /\.(jpe?g|png|webp)$/i.test(base) ? `stills/${base}` : `stills/${base}.jpg`;
	}
	if (!/\.(jpe?g|png|webp)$/i.test(key)) return [];
	if (key.endsWith('-256.jpg')) return [key];
	const thumb = key.replace(/\.(jpe?g|png|webp)$/i, '-256.jpg');
	return thumb === key ? [key] : [key, thumb];
}

const isMain =
	process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
	const cmd = process.argv[2];
	const cfg = config();
	if (cmd === 'status') {
		process.stdout.write(cfg.ready ? 'ready\n' : `missing ${cfg.missing.join(', ')}\n`);
	} else if (cmd === 'put') {
		const objectKey = process.argv[3];
		const file = process.argv[4];
		if (!objectKey || !file) {
			console.error('usage: node scripts/r2.mjs put <object-key> <file>');
			process.exit(2);
		}
		if (!cfg.ready) process.exit(0);
		const url = await putBytes(cfg, objectKey, fs.readFileSync(file));
		process.stdout.write(`${url}\n`);
	} else if (cmd === 'del') {
		const keys = process.argv.slice(3).filter(Boolean);
		if (!keys.length) {
			console.error('usage: node scripts/r2.mjs del <object-key> [object-key...]');
			process.exit(2);
		}
		if (!cfg.ready) process.exit(0);
		for (const key of keys) await deleteObject(key);
	} else {
		console.error('usage: node scripts/r2.mjs status | put <object-key> <file> | del <object-key>...');
		process.exit(2);
	}
}
