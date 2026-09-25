#!/usr/bin/env node
/**
 * Extract timed lyrics from YouTube auto-subs (json3) into compact JSON.
 *
 * Usage:
 *   node scripts/extract-lyrics.mjs              # convert existing raw files
 *   node scripts/extract-lyrics.mjs --fetch ID…  # download then convert
 *
 * Prefers ko > ko-orig > en-orig > en when multiple langs exist.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'scripts/.cache/lyrics-raw');
const OUT = path.join(ROOT, 'src/lib/data/lyrics');

fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const LANG_PREF = ['ko-orig', 'ko', 'en-orig', 'en', 'ko-en', 'en-en'];

function parseJson3(raw) {
	const data = JSON.parse(raw);
	const events = Array.isArray(data.events) ? data.events : [];
	/** @type {{ t: number, text: string }[]} */
	const lines = [];
	let prev = '';
	for (const ev of events) {
		const segs = ev.segs;
		if (!Array.isArray(segs) || segs.length === 0) continue;
		const text = segs
			.map((s) => (s && typeof s.utf8 === 'string' ? s.utf8 : ''))
			.join('')
			.replace(/\n+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
		if (!text) continue;
		// Karaoke rolling captions: skip when text is a prefix extension of the prior line
		// (or the prior is a prefix of this) within a short window — keep the longer form.
		const t = Math.max(0, (Number(ev.tStartMs) || 0) / 1000);
		if (lines.length > 0) {
			const last = lines[lines.length - 1];
			const dt = t - last.t;
			if (dt < 2.2) {
				if (text.startsWith(last.text) || last.text.startsWith(text)) {
					if (text.length >= last.text.length) last.text = text;
					continue;
				}
				if (text === last.text) continue;
			}
		}
		if (text === prev) continue;
		prev = text;
		lines.push({ t: Math.round(t * 100) / 100, text });
	}
	return lines;
}

function pickBestRaw(id) {
	const files = fs.readdirSync(RAW).filter((f) => f.startsWith(`${id}.`) && f.endsWith('.json3'));
	if (files.length === 0) return null;
	files.sort((a, b) => {
		const langA = a.slice(id.length + 1, -'.json3'.length);
		const langB = b.slice(id.length + 1, -'.json3'.length);
		const ia = LANG_PREF.indexOf(langA);
		const ib = LANG_PREF.indexOf(langB);
		return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
	});
	return path.join(RAW, files[0]);
}

function convertId(id) {
	const rawPath = pickBestRaw(id);
	if (!rawPath) {
		console.warn(`skip ${id}: no raw json3`);
		return false;
	}
	const lines = parseJson3(fs.readFileSync(rawPath, 'utf8'));
	if (lines.length < 3) {
		console.warn(`skip ${id}: only ${lines.length} lines from ${path.basename(rawPath)}`);
		return false;
	}
	const outPath = path.join(OUT, `${id}.json`);
	fs.writeFileSync(outPath, JSON.stringify({ id, lines }, null, '\t') + '\n');
	console.log(`ok ${id} → ${lines.length} lines (${path.basename(rawPath)})`);
	return true;
}

function fetchIds(ids) {
	for (const id of ids) {
		console.log(`fetch ${id}…`);
		const r = spawnSync(
			'yt-dlp',
			[
				'--no-check-certificates',
				'--skip-download',
				'--write-auto-sub',
				'--write-sub',
				'--sub-langs',
				'ko.*,en.*,ko,en',
				'--sub-format',
				'json3',
				'-o',
				path.join(RAW, '%(id)s'),
				'--',
				id
			],
			{ encoding: 'utf8' }
		);
		if (r.status !== 0) {
			console.warn(r.stderr?.slice(-400) || r.stdout?.slice(-400) || `exit ${r.status}`);
		}
		// gentle on YouTube
		spawnSync('sleep', ['2.5']);
	}
}

const args = process.argv.slice(2);
const fetchIdx = args.indexOf('--fetch');
if (fetchIdx >= 0) {
	const ids = args.slice(fetchIdx + 1).filter((a) => !a.startsWith('-'));
	if (ids.length) fetchIds(ids);
}

const ids = new Set();
for (const f of fs.readdirSync(RAW)) {
	const m = f.match(/^(.+?)\.[^.]+\.json3$/);
	if (m) ids.add(m[1]);
}
for (const id of [...ids].sort()) convertId(id);
