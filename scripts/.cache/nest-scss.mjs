/**
 * Turn <style> blocks (and src/app.css) into nested SCSS whose compiled CSS
 * matches the original rule order. A child is nested only when it sits in a
 * contiguous run after its parent, so the cascade does not move.
 */
import { writeFileSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import * as sass from 'sass';

const root = new URL('../../', import.meta.url).pathname;
const src = join(root, 'src');

function splitSelectors(selector) {
	const parts = [];
	let cur = '';
	let depth = 0;
	for (const ch of selector) {
		if (ch === '(') depth++;
		else if (ch === ')') depth--;
		else if (ch === ',' && depth === 0) {
			parts.push(cur.trim());
			cur = '';
			continue;
		}
		cur += ch;
	}
	if (cur.trim()) parts.push(cur.trim());
	return parts;
}

function isIdent(ch) {
	return ch !== undefined && /[a-zA-Z0-9_-]/.test(ch);
}

/** How `selector` sits under `parent`, or null. */
function remainder(selector, parent) {
	if (selector === parent) return null;
	if (selector.startsWith(parent) && !isIdent(selector[parent.length])) {
		const raw = selector.slice(parent.length);
		if (raw.startsWith('.') || raw.startsWith(':') || raw.startsWith('[') || raw.startsWith('#')) {
			return '&' + raw;
		}
		const m = raw.match(/^(\s*[>+~]\s*|\s+)([\s\S]+)$/);
		if (!m) return null;
		const comb = m[1].trim();
		const rest = m[2].trim();
		if (!rest) return null;
		return comb ? `& ${comb} ${rest}` : `& ${rest}`;
	}
	if (selector.endsWith(parent)) {
		const before = selector.slice(0, selector.length - parent.length);
		const m = before.match(/^([\s\S]*?)(\s*[>+~]\s*|\s+)$/);
		if (!m || !m[1].trim()) return null;
		const lead = m[1].trim();
		const comb = m[2].trim();
		return comb ? `${lead} ${comb} &` : `${lead} &`;
	}
	return null;
}

function ruleParent(selector, parents) {
	const parts = splitSelectors(selector);
	let shared = null;
	const rests = [];
	for (const part of parts) {
		let best = null;
		let bestRest = null;
		for (const parent of parents) {
			const rest = remainder(part, parent);
			if (!rest) continue;
			if (!best || parent.length > best.length) {
				best = parent;
				bestRest = rest;
			}
		}
		if (!best) return null;
		if (shared === null) shared = best;
		else if (shared !== best) return null;
		rests.push(bestRest);
	}
	return { parent: shared, selector: rests.join(', ') };
}

function isRule(node) {
	return node.type === 'rule';
}

/** Nest contiguous descendant runs. Repeats so `.a .b .c` can settle inside `.a .b`. */
function nestLevel(parentNode) {
	let moved = false;
	const nodes = parentNode.nodes ?? [];
	for (let i = 0; i < nodes.length; i++) {
		const rule = nodes[i];
		if (!isRule(rule) || splitSelectors(rule.selector).length !== 1) continue;
		const parentSel = rule.selector.trim();
		const kids = [];
		let notes = [];
		for (let j = i + 1; j < nodes.length; j++) {
			const next = nodes[j];
			if (next.type === 'comment') {
				notes.push(next);
				continue;
			}
			if (!isRule(next)) break;
			const rel = ruleParent(next.selector, [parentSel]);
			if (!rel) break;
			kids.push({ node: next, selector: rel.selector, notes });
			notes = [];
		}
		if (!kids.length) continue;
		for (const kid of kids) {
			kid.node.selector = kid.selector;
			for (const note of [...kid.notes].reverse()) kid.node.prepend(note);
			rule.append(kid.node);
		}
		moved = true;
		break;
	}
	if (moved) nestLevel(parentNode);
	for (const node of parentNode.nodes ?? []) {
		if (node.type === 'atrule' && node.nodes) nestLevel(node);
		if (node.type === 'rule' && node.nodes) nestLevel(node);
	}
}

function normSel(s) {
	return s.replace(/\s+/g, ' ').trim();
}

function flatten(rootNode, prefix = '', out = []) {
	for (const node of rootNode.nodes ?? []) {
		if (node.type === 'rule') {
			const sel = node.selector
				.split(',')
				.map((part) => {
					const p = part.trim();
					if (!prefix) return p;
					if (p.includes('&')) return p.replaceAll('&', prefix);
					return `${prefix} ${p}`;
				})
				.join(', ');
			const decls = (node.nodes ?? [])
				.filter((n) => n.type === 'decl')
				.map((d) => `${d.prop}:${d.value.replace(/\s+/g, ' ').trim()}`);
			if (decls.length) out.push({ kind: 'rule', sel: normSel(sel), decls });
			flatten(node, sel, out);
		} else if (node.type === 'atrule') {
			if (node.name === 'media' || node.name === 'supports') {
				const inner = [];
				flatten(node, prefix, inner);
				out.push({ kind: 'at', name: node.name, params: normSel(node.params), inner });
			} else if (node.nodes) {
				const decls = (node.nodes ?? [])
					.filter((n) => n.type === 'decl')
					.map((d) => `${d.prop}:${d.value.replace(/\s+/g, ' ').trim()}`);
				out.push({
					kind: 'at-block',
					name: node.name,
					params: normSel(node.params || ''),
					decls
				});
				flatten(node, prefix, out);
			} else {
				out.push({ kind: 'at-leaf', name: node.name, params: normSel(node.params || '') });
			}
		}
	}
	return out;
}

function same(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}

function canon(css) {
	return sass
		.compileString(css, { style: 'expanded' })
		.css.replace(/^@charset "UTF-8";\s*/, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

function emit(node, depth) {
	const pad = '\t'.repeat(depth);
	const lines = [];
	for (const child of node.nodes ?? []) {
		if (depth === 1 && lines.length && lines.at(-1) !== '') lines.push('');
		if (child.type === 'comment') {
			const text = child.raws?.left === undefined ? child.toString() : child.toString();
			for (const line of text.split('\n')) lines.push(pad + line.trim());
		} else if (child.type === 'decl') {
			const bang = child.important ? ' !important' : '';
			const value = child.value.replace(/\s*\n\s*/g, ' ').trim();
			lines.push(`${pad}${child.prop}: ${value}${bang};`);
		} else if (child.type === 'rule') {
			lines.push(`${pad}${child.selector} {`);
			const inner = emit(child, depth + 1);
			if (inner) lines.push(inner);
			lines.push(`${pad}}`);
		} else if (child.type === 'atrule') {
			const head = `@${child.name}${child.params ? ` ${child.params}` : ''}`;
			if (!child.nodes) {
				lines.push(`${pad}${head};`);
			} else {
				lines.push(`${pad}${head} {`);
				const inner = emit(child, depth + 1);
				if (inner) lines.push(inner);
				lines.push(`${pad}}`);
			}
		}
	}
	return lines.join('\n');
}

function transformCss(css) {
	let before;
	try {
		before = canon(css);
	} catch (err) {
		return { ok: false, reason: err.message?.split('\n')[0] ?? 'sass' };
	}
	const root = postcss.parse(css);
	nestLevel(root);
	const nested = `\n${emit(root, 1)}\n`;
	let after;
	try {
		after = canon(nested);
	} catch (err) {
		return { ok: false, reason: err.message?.split('\n')[0] ?? 'sass' };
	}
	if (before !== after) {
		if (process.env.DEBUG) {
			const n = Math.min(before.length, after.length);
			let i = 0;
			while (i < n && before[i] === after[i]) i++;
			console.log('DIFF', before.slice(Math.max(0, i - 80), i + 160));
			console.log(' ---');
			console.log(after.slice(Math.max(0, i - 80), i + 160));
			writeFileSync('/tmp/nest-debug.scss', nested);
		}
		return { ok: false, reason: 'cascade' };
	}
	const changed = nested !== css;
	return { ok: true, nested, changed };
}

async function walk(dir, acc = []) {
	for (const ent of await readdir(dir, { withFileTypes: true })) {
		const p = join(dir, ent.name);
		if (ent.isDirectory()) await walk(p, acc);
		else if (ent.name.endsWith('.svelte')) acc.push(p);
	}
	return acc;
}

const only = process.argv.slice(2);
const files = (await walk(src)).filter((file) => !only.length || only.some((p) => file.endsWith(p)));
let nestedCount = 0;
let scssCount = 0;
const skipped = [];

for (const file of files) {
	let text = await readFile(file, 'utf8');
	const re = /<style(\s[^>]*)?>([\s\S]*?)<\/style>/g;
	let match;
	let next = '';
	let cursor = 0;
	let touched = false;
	while ((match = re.exec(text))) {
		next += text.slice(cursor, match.index);
		const attrs = match[1] ?? '';
		const css = match[2];
		let result;
		try {
			result = transformCss(css);
		} catch (err) {
			result = { ok: false, reason: err.message?.split('\n')[0] ?? 'throw' };
		}
		if (!result.ok) {
			skipped.push(`${relative(root, file)}: ${result.reason}`);
			next += match[0];
		} else {
			const lang = /lang\s*=/.test(attrs) ? attrs : `${attrs} lang="scss"`;
			const body = result.nested;
			if (result.changed) nestedCount++;
			scssCount++;
			next += `<style${lang}>${body}</style>`;
			touched = true;
		}
		cursor = match.index + match[0].length;
	}
	next += text.slice(cursor);
	if (touched) await writeFile(file, next);
}

if (!only.length) {
	const { unlink } = await import('node:fs/promises');
	const sheets = [
		'app.scss',
		'lib/stillMotion.css',
		'lib/sceneReveal.scss',
		'lib/components/diagrams/orgChartTheme.css'
	];
	for (const rel of sheets) {
		const path = join(src, rel);
		let css;
		try {
			css = await readFile(path, 'utf8');
		} catch {
			console.log(`${rel} missing`);
			continue;
		}
		let result;
		try {
			result = transformCss(css);
		} catch (err) {
			result = { ok: false, reason: err.message?.split('\n')[0] ?? 'throw' };
		}
		if (!result.ok) {
			console.log(`${rel} skipped (${result.reason})`);
			continue;
		}
		const dest = path.replace(/\.css$/, '.scss');
		await writeFile(dest, result.nested.trim() + '\n');
		if (dest !== path) await unlink(path);
		nestedCount++;
		console.log(`${rel} → ${rel.replace(/\.css$/, '.scss')}`);
	}
}

console.log(`scss blocks ${scssCount}, nested ${nestedCount}, skipped ${skipped.length}`);
for (const line of skipped) console.log('  ' + line);
