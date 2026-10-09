/**
 * Rough preview of a battle file: one SVG per phase (dots laid out the way battles.ts does), rendered to PNG by
 * qlmanage. `node preview.mjs <id>` → scripts/.cache/battles/preview/<id>-<n>.svg.png
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const id = process.argv[2];
const b = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/data/battles', `${id}.json`), 'utf8'));
const OUT = path.join(HERE, 'preview');
fs.mkdirSync(OUT, { recursive: true });

const COLORS = { silla: '#2a5fb8', baekje: '#d9b13a', goguryeo: '#c30000', tang: '#b5651d', gaya: '#8b5cf6' };
const sideColor = (s) => s?.color ?? COLORS[s?.kingdom] ?? '#888';

function noise(seed, i, salt = 0) {
	let h = 2166136261 ^ salt;
	for (let k = 0; k < seed.length; k++) h = Math.imul(h ^ seed.charCodeAt(k), 16777619);
	h = Math.imul(h ^ (i + 1) * 374761393, 668265263);
	h ^= h >>> 13;
	return ((Math.imul(h, 1274126177) >>> 0) % 10000) / 10000;
}
const GAP = 11.5;
function layoutDots(id, count, s) {
	const gap = GAP * (s.shape === 'ring' ? 1 : (s.r ?? 1));
	const shape = s.shape ?? 'block';
	const face = ((s.facing ?? 0) * Math.PI) / 180;
	const out = [];
	const place = (u, v, jitter = 0.18) => {
		const uu = u + (noise(id, out.length, 1) - 0.5) * gap * jitter;
		const vv = v + (noise(id, out.length, 2) - 0.5) * gap * jitter;
		out.push([s.at[0] - Math.sin(face) * uu - Math.cos(face) * vv, s.at[1] + Math.cos(face) * uu - Math.sin(face) * vv]);
	};
	if (shape === 'ring') {
		const r = s.r ?? 60;
		const [a0, a1] = s.arc ?? [0, 360];
		const full = Math.abs(a1 - a0) >= 359;
		const rows = Math.max(1, Math.ceil((count * gap) / (((Math.abs(a1 - a0) * Math.PI) / 180) * r)));
		const perRow = Math.ceil(count / rows);
		for (let i = 0; i < count; i++) {
			const row = Math.floor(i / perRow);
			const k = i % perRow;
			const n = Math.min(perRow, count - row * perRow);
			const t = full ? k / n : n > 1 ? k / (n - 1) : 0.5;
			const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
			const rr = r + row * gap;
			out.push([s.at[0] + Math.cos(a) * rr, s.at[1] + Math.sin(a) * rr]);
		}
		return out;
	}
	if (shape === 'scatter' || s.routed) {
		const spread = Math.sqrt(count) * gap * 1.5 + gap * 2;
		for (let i = 0; i < count; i++) {
			const a = noise(id, i, 5) * Math.PI * 2;
			const d = Math.sqrt(noise(id, i, 6)) * spread;
			out.push([s.at[0] + Math.cos(a) * d * 1.3, s.at[1] + Math.sin(a) * d * 0.8]);
		}
		return out;
	}
	if (shape === 'wedge') {
		let row = 0;
		while (out.length < count) {
			const n = row * 2 + 1;
			for (let k = 0; k < n && out.length < count; k++) place((k - (n - 1) / 2) * gap, row * gap * 0.9 - gap * 2);
			row++;
		}
		return out;
	}
	const ratio = shape === 'line' ? 6 : shape === 'column' ? 0.22 : shape === 'fleet' ? 2.4 : 1.6;
	const cols = Math.max(1, Math.min(count, Math.round(Math.sqrt(count * ratio))));
	const rows = Math.ceil(count / cols);
	const g = shape === 'fleet' ? gap * 1.35 : gap;
	for (let i = 0; i < count; i++) {
		const row = Math.floor(i / cols);
		const k = i % cols;
		const inRow = Math.min(cols, count - row * cols);
		const stagger = row % 2 ? g / 2 : 0;
		place((k - (inRow - 1) / 2) * g + stagger, (row - (rows - 1) / 2) * g * 0.9, shape === 'fleet' ? 0.5 : 0.18);
	}
	return out;
}
const dotsFor = (men) => (men > 0 ? Math.max(1, Math.round(men / 1000)) : 0);
const pl = (pts) => pts.map((p) => p.join(',')).join(' ');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const sides = new Map(b.sides.map((s) => [s.id, s]));
const unitSide = new Map(b.units.map((u) => [u.id, u.side]));
const unitLabel = new Map(b.units.map((u) => [u.id, u.label]));

b.phases.forEach((p, n) => {
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000"><rect width="1000" height="1000" fill="#f3ead8"/>`;
	for (const t of b.terrain) {
		if (['sea', 'lake'].includes(t.kind)) svg += `<polygon points="${pl(t.points)}" fill="#bcd3dc"/>`;
		else if (t.kind === 'marsh') svg += `<polygon points="${pl(t.points)}" fill="#cfd8b8"/>`;
		else if (t.kind === 'plain') svg += `<polygon points="${pl(t.points)}" fill="#ebe0b8"/>`;
		else if (t.kind === 'forest') svg += `<polygon points="${pl(t.points)}" fill="#b9cba3"/>`;
		else if (t.kind === 'town') svg += `<polygon points="${pl(t.points)}" fill="#d8c8b0"/>`;
		else if (t.kind === 'river') svg += `<polyline points="${pl(t.points)}" fill="none" stroke="#8fb4c4" stroke-width="${t.width ?? 14}"/>`;
		else if (t.kind === 'road') svg += `<polyline points="${pl(t.points)}" fill="none" stroke="#a08c6c" stroke-dasharray="6 4" stroke-width="2"/>`;
		else if (t.kind === 'wall') svg += `<polyline points="${pl(t.points)}" fill="none" stroke="#555" stroke-width="${t.width ?? 5}"/>`;
		else if (t.kind === 'ridge') svg += `<polyline points="${pl(t.points)}" fill="none" stroke="#8a7a5a" stroke-width="3"/>`;
		else if (t.kind === 'hill') svg += `<ellipse cx="${t.at[0]}" cy="${t.at[1]}" rx="${t.r ?? 40}" ry="${(t.r ?? 40) * 0.62}" fill="none" stroke="#a89470"/>`;
		else if (t.kind === 'mountain') svg += `<path d="M${t.at[0] - 22},${t.at[1] + 10}L${t.at[0]},${t.at[1] - 16}L${t.at[0] + 22},${t.at[1] + 10}Z" fill="#9a8a6a"/>`;
		else if (t.at) svg += `<rect x="${t.at[0] - 8}" y="${t.at[1] - 8}" width="16" height="16" fill="none" stroke="#333" stroke-width="2"/>`;
		if (t.label) {
			const at = t.labelAt ?? t.at ?? t.points[Math.floor(t.points.length / 2)];
			svg += `<text x="${at[0]}" y="${at[1] + (t.at ? 22 : 0)}" font-size="13" font-style="italic" text-anchor="middle" fill="#555">${esc(t.label)}</text>`;
		}
	}
	for (const [uid, s] of Object.entries(p.units)) {
		const c = sideColor(sides.get(unitSide.get(uid)));
		const pts = layoutDots(uid, dotsFor(s.men), s);
		for (const [x, y] of pts) svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.4" fill="${c}" opacity="${s.routed ? 0.45 : 0.9}"/>`;
		if (pts.length) {
			const top = Math.min(...pts.map((q) => q[1]));
			const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length;
			svg += `<text x="${cx}" y="${top - 6}" font-size="12" font-weight="bold" text-anchor="middle" fill="${c}">${esc(unitLabel.get(uid))} ${s.men}</text>`;
		}
	}
	for (const a of p.arrows ?? []) {
		const c = sideColor(sides.get(a.side));
		svg += `<polyline points="${pl(a.points)}" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="${a.kind === 'retreat' || a.kind === 'pursuit' ? '6 4' : ''}"/>`;
		const e = a.points.at(-1);
		svg += `<circle cx="${e[0]}" cy="${e[1]}" r="5" fill="${c}"/>`;
		if (a.label) {
			const m = a.points[Math.floor(a.points.length / 2)];
			svg += `<text x="${m[0]}" y="${m[1] - 6}" font-size="12" fill="${c}">${esc(a.label)}</text>`;
		}
	}
	for (const e of p.events ?? []) {
		svg += `<circle cx="${e.at[0]}" cy="${e.at[1]}" r="10" fill="none" stroke="#000" stroke-width="2"/><text x="${e.at[0]}" y="${e.at[1] + 4}" font-size="10" text-anchor="middle">${e.kind[0]}</text>`;
		if (e.label) svg += `<text x="${e.at[0] + 14}" y="${e.at[1] + 4}" font-size="12" fill="#000">${esc(e.label)}</text>`;
	}
	svg += `<rect x="820" y="405" width="180" height="155" fill="none" stroke="#c00" stroke-dasharray="3 3"/>`;
	svg += `<text x="10" y="585" font-size="14" font-weight="bold">${n + 1}. ${esc(p.label)}</text><text x="10" y="605" font-size="11">${esc(p.caption)}</text>`;
	svg += `</svg>`;
	const file = path.join(OUT, `${id}-${n + 1}.svg`);
	fs.writeFileSync(file, svg);
	execFileSync('qlmanage', ['-t', '-s', '1000', '-o', OUT, file], { stdio: 'ignore' });
});
console.log(`wrote ${b.phases.length} previews to ${OUT}`);
