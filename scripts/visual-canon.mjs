// Visual canon → GenerateImage refs + a prompt block, from one source of truth.
// Hand-authored facts: src/lib/data/visual-canon.json.
// Derived (never copied): portrait-by-year / binyeo / object board + hex from src/lib/people.ts,
// sword tagline + pommel from src/lib/swords.ts, place boards from src/lib/places.ts.
//
// Kingdom flag ref from KINGDOMS in people.ts (flag_*.svg → flag_*.png, see scripts/rasterize-flags.mjs).
//
// CLI: node scripts/visual-canon.mjs --year 660 [--battle] [--sword] [--mounted] [--flags] gyebek yushin gomanari place:hwangsan flag:tang
//   --battle   armor kit refs + sword + fighting + horse + kingdom banners
//   --sword    sword + fighting (no armor)
//   --mounted  the person's horse for that year
//   --flags    each person's kingdom banner without the battle kit
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SWORD_DEFS, SWORD_BLADE_REF, SWORD_STILL_ANATOMY } from '../src/lib/swords.ts';
import { PLACES } from '../src/lib/places.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => fs.readFileSync(ROOT + p, 'utf8');

export const CANON = JSON.parse(read('src/lib/data/visual-canon.json'));
const PEOPLE_SRC = read('src/lib/people.ts');

function block(src, start, end) {
	const i = src.indexOf(start);
	if (i < 0) return '';
	return src.slice(i, src.indexOf(end, i));
}

const HEX = (() => {
	const out = {};
	for (const m of block(PEOPLE_SRC, 'const COLOR: Record', '\n};').matchAll(/\n\t'?([\wé-]+)'?: '(#[0-9a-fA-F]{3,8})'/g)) {
		out[m[1]] = [m[2]];
	}
	const accents = block(PEOPLE_SRC, 'const CHARACTER_COLORS', '\n};');
	for (const m of accents.matchAll(/\n\t'?([\wé-]+)'?: \{ color: '(#\w+)'(?:, colorSecondary: '(#\w+)')?/g)) {
		out[m[1]] = [m[2], m[3]].filter(Boolean);
	}
	return out;
})();

/** Primary character hex from people.ts (CHARACTER_COLORS, else COLOR). */
export const hexFor = (id) => HEX[id]?.[0];

/** kingdom id → raster flag ref, from KINGDOMS in people.ts (only kingdoms whose png exists). */
const FLAG_REF = (() => {
	const out = {};
	for (const m of block(PEOPLE_SRC, 'export const KINGDOMS', '\n};').matchAll(/\n\t(\w+): \{([^{}]*)\}/g)) {
		const svg = m[2].match(/flag: '([^']+)\.svg'/)?.[1];
		if (svg && fs.existsSync(`${ROOT}static${svg}.png`)) out[m[1]] = `${svg}.png`;
	}
	return out;
})();

/** Person facts parsed from the people.ts source (people.ts itself imports $lib and can't load in Node). */
function personFacts(id) {
	const i = PEOPLE_SRC.indexOf(`\n\t\tid: '${id}',`);
	if (i < 0) return null;
	const b = PEOPLE_SRC.slice(i, PEOPLE_SRC.indexOf('\n\t},', i));
	const field = (k) => b.match(new RegExp(`\\n\\t\\t${k}: '([^']+)'`))?.[1];
	const stagesSrc = block(b, '\n\t\tstages: [', '\n\t\t],');
	const stages = [...stagesSrc.matchAll(/\{[^{}]*\}/g)]
		.map(([s]) => ({
			from: Number(s.match(/from: (-?\d+)/)?.[1] ?? -Infinity),
			until: Number(s.match(/until: (-?\d+)/)?.[1] ?? Infinity),
			avatar: s.match(/avatar: '([^']+)'/)?.[1],
			name: s.match(/\bname: '([^']+)'/)?.[1]
		}))
		.filter((s) => s.avatar);
	return {
		name: field('name') ?? id,
		kingdom: field('kingdom'),
		avatar: field('avatar'),
		stages,
		binyeo: field('binyeoImage'),
		object: field('objectImage')
	};
}

const inYear = (r, year) => year == null || ((r.from ?? -Infinity) <= year && year <= (r.until ?? Infinity));

/** A canon field is a plain value or a list of `{ from?, until?, id | text }` ranges. */
function atYear(value, year) {
	if (!Array.isArray(value) || typeof value[0] !== 'object') return value == null ? [] : [value];
	return value.filter((r) => inYear(r, year)).map((r) => r.id ?? r.text);
}

/** Portrait + display name for the year: a canon era face wins, then the people.ts stage, then the default avatar. */
function portrait(facts, canon, year) {
	const stage = (facts?.stages ?? []).filter((s) => inYear(s, year)).at(-1);
	const name = stage?.name ?? facts?.name;
	const eraFace = (canon?.eras ?? []).filter((e) => e.id?.startsWith('/ch_') && inYear(e, year)).at(-1);
	return { face: eraFace?.id ?? stage?.avatar ?? facts?.avatar ?? null, name };
}

function animalBlock(id, ctx) {
	const a = CANON.animals[id];
	if (!a) return null;
	const board = (ctx.battle && a.battleBoard) || a.board;
	if (board) ctx.refs.add(board);
	if (/horse/.test(a.kind)) ctx.horse = true;
	const tie = a.owner ? `${a.owner}'s ${a.kind}` : `${a.kind}, guide of ${(a.guides ?? []).join(' and ')}`;
	return `${a.name.toUpperCase()} (${a.ko}, ${tie})${board ? ` — attached board ${board}` : ''}: ${a.look} ${a.temperament}`;
}

function placeBlock(id, ctx) {
	const c = CANON.places[id] ?? {};
	const p = Array.isArray(PLACES) ? PLACES.find((x) => x.id === id) : PLACES[id];
	const board = c.board ?? p?.avatar;
	if (!board && !c.dna) throw new Error(`unknown place ${id}`);
	if (board) ctx.refs.add(board);
	const name = p ? `${p.name}${p.korean ? ` (${p.korean})` : ''}` : id;
	return `PLACE ${name}${board ? ` — attached board ${board}; keep this exact architecture and ground` : ''}. ${c.dna ?? ''}${c.mood ? ` Mood: ${c.mood}` : ''}`.trim();
}

function flagBlock(kingdom, ctx) {
	const ref = FLAG_REF[kingdom];
	const text = CANON.flags?.[kingdom];
	if (!ref && !text) return null;
	if (ref) ctx.refs.add(ref);
	return `${text ?? `${kingdom} banners.`}${ref ? ` Attached flag ${ref}.` : ''}`;
}

function personBlock(id, opts, ctx) {
	const { refs } = ctx;
	const c = CANON.characters[id];
	const f = personFacts(id);
	if (!c && !f) throw new Error(`unknown person ${id}`);
	if ((opts.battle || opts.flags) && f?.kingdom) ctx.kingdoms.add(f.kingdom);
	const year = opts.year;
	const { face, name } = portrait(f, c, year);
	const redress = Array.isArray(c?.eras) && c.eras.some((e) => e?.redress && inYear(e, year));
	const out = [];
	const head = (name ?? id).toUpperCase();
	if (face) {
		refs.add(face);
		out.push(
			redress
				? `${head} — FACE ONLY from attached ${face}; ignore the portrait's clothing, headgear, jewelry and hair styling — dress exactly as "Now" below (invent a new pose).`
				: `${head} — FACE and garments from attached ${face} (face only; invent a new pose).`
		);
	} else out.push(`${head}.`);
	if (f?.binyeo && !redress) {
		refs.add(f.binyeo);
		out.push(`Hair ornament matches attached ${f.binyeo} when the head is visible.`);
	}
	if (c?.look && !redress) out.push(`Look: ${c.look}`);
	if (c?.dress && !redress) out.push(`Dress: ${c.dress}`);
	for (const t of atYear(c?.eras, year)) if (t && !t.startsWith('/')) out.push(`Now: ${t}`);
	if (c?.demeanor) out.push(`Demeanor: ${c.demeanor}`);
	if (c?.element) out.push(`Element: ${c.element}`);
	if (c?.style) out.push(`Style: ${c.style}`);
	if (c?.props) out.push(`Props: ${c.props}`);
	const armed = opts.battle || opts.sword;
	if (opts.battle && c?.armor) {
		const kit = CANON.armor[c.armor];
		for (const r of [...kit.refs, ...(c.armorRefs ?? [])]) refs.add(r);
		out.push(`Armor: ${kit.text} ${CANON.armor.common}`);
	}
	if (armed) {
		for (const sid of atYear(c?.sword, year)) {
			const s = SWORD_DEFS.find((d) => d.id === sid);
			if (!s) throw new Error(`${id}: unknown sword ${sid}`);
			if (s.swordImage) {
				refs.add(SWORD_BLADE_REF);
				const motif = c?.pommel ?? s.swordImage.replace(/^\/sword_|\.png$/g, '');
				out.push(`Sword: ${s.name} — ${s.tagline} Pommel motif ${motif} inside the small ring (name only; do not attach the pommel ECU).`);
			} else out.push(`Weapon: ${s.name} — ${s.tagline}`);
		}
		if (c?.carry) out.push(`Carry: ${c.carry}`);
		if (c?.fighting) out.push(`Fighting: ${c.fighting}`);
	} else if (c?.carry && !c?.sword) out.push(`Carry: ${c.carry}`);
	const hex = HEX[id];
	if (hex) out.push(`${hex.join(' + ')} as the hard key / specular / bounce in the dark — real light, never a glow aura or body halo.`);
	if (c?.never?.length) out.push(`Never: ${c.never.join('; ')}.`);
	const lines = [out.join(' ')];
	if (opts.battle || opts.mounted) {
		for (const hid of atYear(c?.horse, year)) {
			const h = animalBlock(hid, ctx);
			if (h) lines.push(h);
		}
	}
	return lines;
}

/**
 * @param {string[]} ids people ids, animal ids, `place:<id>`, or `flag:<kingdom>`
 * @param {{ year?: number, battle?: boolean, sword?: boolean, mounted?: boolean, flags?: boolean }} opts
 * @returns {{ refs: string[], text: string }}
 */
export function buildCanon(ids, opts = {}) {
	const ctx = { refs: new Set(), kingdoms: new Set(), horse: false, battle: Boolean(opts.battle) };
	const lines = [];
	for (const raw of ids) {
		if (raw.startsWith('place:')) lines.push(placeBlock(raw.slice(6), ctx));
		else if (raw.startsWith('flag:')) ctx.kingdoms.add(raw.slice(5));
		else if (CANON.animals[raw]) lines.push(animalBlock(raw, ctx));
		else lines.push(...personBlock(raw, opts, ctx));
	}
	if (ctx.horse && CANON.horses?.common) lines.push(CANON.horses.common);
	const banners = [...ctx.kingdoms].map((k) => flagBlock(k, ctx)).filter(Boolean);
	if (banners.length) lines.push(`${CANON.flags.common} ${banners.join(' ')}`);
	if (ctx.refs.has(SWORD_BLADE_REF)) lines.push(`SWORD ANATOMY: ${SWORD_STILL_ANATOMY}`);
	const uniq = [...new Set(lines)];
	return { refs: [...ctx.refs], text: uniq.length ? `CANON — ${uniq.join(' | ')}` : '' };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const args = process.argv.slice(2);
	const opts = {};
	const ids = [];
	for (let i = 0; i < args.length; i++) {
		const a = args[i];
		if (a === '--year') opts.year = Number(args[++i]);
		else if (a === '--battle') opts.battle = true;
		else if (a === '--sword') opts.sword = true;
		else if (a === '--mounted') opts.mounted = true;
		else if (a === '--flags') opts.flags = true;
		else ids.push(a);
	}
	if (!ids.length) {
		console.error('usage: node scripts/visual-canon.mjs --year <Y> [--battle|--sword|--mounted|--flags] <ids…> [place:<id>] [flag:<kingdom>]');
		process.exit(1);
	}
	const { refs, text } = buildCanon(ids, opts);
	console.log(JSON.stringify({ refs, abs: refs.map((r) => `${ROOT}static${r}`), text }, null, '\t'));
}
