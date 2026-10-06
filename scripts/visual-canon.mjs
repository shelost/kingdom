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
//   --no-hat   drop the jougwan (bathing, sleeping, bare-headed beats)
//
// Costume: every Samhan person (or `dress:<kingdom>` extras) attaches that kingdom's hanbok chart;
// a King/Queen that year, out of battle, also gets the kingdom crown.
// Noble crown: a character `crown: "noble"` (or `noble:<kingdom>` for unnamed lords) wears the kingdom's
// great-clan crown out of battle (costume.kingdoms.<k>.noble).
// Jougwan: Samhan men wear the feather cap by default — out of armor, out of a crown.
// A character `hat` ("jougwan" | false, or a year-ranged list) overrides that.
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

/** Flat `{…}` items of a top-level `key: [ … ]` list in one people.ts entry (one-line or multi-line). */
function listField(entry, key) {
	const start = entry.indexOf(`\n\t\t${key}: [`);
	if (start < 0) return [];
	let i = entry.indexOf('[', start);
	for (let depth = 0; i < entry.length; i++) {
		if (entry[i] === '[') depth++;
		else if (entry[i] === ']' && --depth === 0) break;
	}
	return [...entry.slice(start, i).matchAll(/\{[^{}]*\}/g)].map(([s]) => s);
}

/** Person facts parsed from the people.ts source (people.ts itself imports $lib and can't load in Node). */
function personFacts(id) {
	const i = PEOPLE_SRC.indexOf(`\n\t\tid: '${id}',`);
	if (i < 0) return null;
	const b = PEOPLE_SRC.slice(i, PEOPLE_SRC.indexOf('\n\t},', i));
	const field = (k) => b.match(new RegExp(`\\n\\t\\t${k}: '([^']+)'`))?.[1];
	const stages = listField(b, 'stages')
		.map((s) => ({
			id: s.match(/\bid: '([^']+)'/)?.[1],
			lookOnly: /lookOnly: true/.test(s),
			from: Number(s.match(/from: (-?\d+)/)?.[1] ?? -Infinity),
			until: Number(s.match(/until: (-?\d+)/)?.[1] ?? Infinity),
			avatar: s.match(/avatar: '([^']+)'/)?.[1],
			name: s.match(/\bname: '([^']+)'/)?.[1]
		}));
	const career = listField(b, 'career').map((s) => ({
		title: s.match(/title: '([^']+)'/)?.[1] ?? '',
		org: s.match(/org: '([^']+)'/)?.[1],
		from: Number(s.match(/from: (-?\d+)/)?.[1] ?? -Infinity),
		until: Number(s.match(/\bto: (-?\d+)/)?.[1] ?? Infinity)
	}));
	return {
		name: field('name') ?? id,
		gender: field('gender'),
		kingdom: field('kingdom'),
		avatar: field('avatar'),
		stages,
		career,
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

/** people.ts `stageOf`: `until` is exclusive and the last matching stage wins; a stage without an avatar keeps the base portrait. */
const stageAt = (stages, year) =>
	year == null ? undefined : stages.filter((s) => !s.lookOnly && s.from <= year && year < s.until).at(-1);

/** Portrait + display name: a pinned look wins, then a canon era face, then the people.ts stage for the year, then the default avatar. */
function portrait(facts, canon, year, look) {
	const pinned = look ? facts?.stages?.find((s) => s.id === look) : undefined;
	if (look && !pinned) throw new Error(`${facts?.name ?? 'person'}: no stage with id "${look}"`);
	const stage = pinned ?? stageAt(facts?.stages ?? [], year);
	const name = stage?.name ?? facts?.name;
	const eraFace = pinned ? undefined : (canon?.eras ?? []).filter((e) => e.id?.startsWith('/ch_') && inYear(e, year)).at(-1);
	return { face: eraFace?.id ?? stage?.avatar ?? facts?.avatar ?? null, name };
}

const CROWNED = /\b(King|Queen|Emperor|Empress)\b/;
const isCrowned = (facts, year) => (facts?.career ?? []).some((o) => CROWNED.test(o.title) && inYear(o, year));

/** Canon `crown: "noble"` (or a year-ranged list): the kingdom's great-clan crown, out of armor and not bare-headed. */
const wearsNobleCrown = (c, facts, opts) =>
	!opts.battle && opts.hat !== false && Boolean(CANON.costume?.kingdoms?.[facts?.kingdom]?.noble) && atYear(c?.crown, opts.year).at(-1) === 'noble';

/** Jougwan for this person and year: explicit canon `hat`, else Samhan men out of armor and out of a crown. */
function wearsJougwan(c, facts, opts, redress) {
	const kit = CANON.hats?.jougwan;
	if (!kit || opts.hat === false || opts.battle || wearsNobleCrown(c, facts, opts)) return false;
	const explicit = c?.hat == null ? [] : atYear(c.hat, opts.year);
	if (explicit.length) return explicit.at(-1) === 'jougwan';
	if (redress || facts?.gender !== 'm' || !kit.kingdoms.includes(facts.kingdom)) return false;
	return !isCrowned(facts, opts.year);
}

/** Kingdom costume chart line, once per kingdom in the frame. */
function costumeBlock(kingdom, ctx) {
	const k = CANON.costume?.kingdoms?.[kingdom];
	if (!k) return null;
	ctx.refs.add(k.board);
	return `${k.name}: attached ${k.board}.${k.note ? ` ${k.note}` : ''}`;
}

const isHwarang = (facts, face, year) =>
	/_hwarang\./.test(face ?? '') ||
	(facts?.career ?? []).some((o) => o.org === 'hwarang' && /^Hwarang/.test(o.title) && inYear(o, year));

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

/** `chunchu:ambassador` → person `chunchu` pinned to the people.ts stage `ambassador`. */
function personBlock(raw, opts, ctx) {
	const { refs } = ctx;
	const [id, look] = raw.split(':');
	const c = CANON.characters[id];
	const f = personFacts(id);
	if (!c && !f) throw new Error(`unknown person ${id}`);
	if ((opts.battle || opts.flags) && f?.kingdom) ctx.kingdoms.add(f.kingdom);
	const year = opts.year;
	const { face, name } = portrait(f, c, year, look);
	const outfit = look ? c?.looks?.[look] : undefined;
	if (outfit?.hat === false) opts = { ...opts, hat: false };
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
	if (outfit?.text) out.push(`Dress: ${outfit.text}`);
	else if (c?.dress && !redress) out.push(`Dress: ${c.dress}`);
	if (wearsJougwan(c, f, opts, redress)) {
		const kit = CANON.hats.jougwan;
		for (const r of kit.refs) refs.add(r);
		ctx.hat = true;
		out.push(`Headwear: the jougwan (see HEADWEAR).${isHwarang(f, face, year) ? ` ${kit.hwarang}` : ''}`);
	}
	const dress = redress ? null : CANON.costume?.kingdoms?.[f?.kingdom];
	if (dress) ctx.costumes.add(f.kingdom);
	if (dress?.crownText && !opts.battle && isCrowned(f, year)) {
		for (const r of dress.crown ?? []) refs.add(r);
		out.push(`Crown: ${dress.crownText}`);
	} else if (!redress && wearsNobleCrown(c, f, opts)) {
		ctx.nobles.add(f.kingdom);
		out.push(`Crown: the great-clan gilt crown (see NOBLE CROWN), no jougwan.`);
	}
	for (const t of atYear(c?.eras, year)) if (t && !t.startsWith('/')) out.push(`Now: ${t}`);
	if (c?.demeanor) out.push(`Demeanor: ${c.demeanor}`);
	if (c?.presence && !redress) out.push(`Presence: ${c.presence}`);
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
		for (const t of atYear(c?.carry, year)) out.push(`Carry: ${t}`);
		for (const t of atYear(c?.fighting, year)) out.push(`Fighting: ${t}`);
	} else if (!c?.sword) for (const t of atYear(c?.carry, year)) out.push(`Carry: ${t}`);
	const hex = HEX[id];
	if (hex) out.push(`${hex.join(' + ')} as the hard key / specular / bounce in the dark — real light, never a glow aura or body halo.`);
	const never = (c?.never ?? []).filter((n) => typeof n === 'string' || inYear(n, year)).map((n) => n.text ?? n);
	if (never.length) out.push(`Never: ${never.join('; ')}.`);
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
 * @param {string[]} ids people ids (or `<person>:<stage id>` to pin a look), animal ids, `place:<id>`, `flag:<kingdom>`, `dress:<kingdom>` (costume chart for extras), or `noble:<kingdom>` (chart + great-clan crown)
 * @param {{ year?: number, battle?: boolean, sword?: boolean, mounted?: boolean, flags?: boolean, hat?: boolean }} opts
 * @returns {{ refs: string[], text: string }}
 */
export function buildCanon(ids, opts = {}) {
	const ctx = { refs: new Set(), kingdoms: new Set(), costumes: new Set(), nobles: new Set(), horse: false, hat: false, battle: Boolean(opts.battle) };
	const lines = [];
	for (const raw of ids) {
		if (raw.startsWith('place:')) lines.push(placeBlock(raw.slice(6), ctx));
		else if (raw.startsWith('flag:')) ctx.kingdoms.add(raw.slice(5));
		else if (raw.startsWith('dress:')) ctx.costumes.add(raw.slice(6));
		else if (raw.startsWith('noble:')) ctx.costumes.add(raw.slice(6)), ctx.nobles.add(raw.slice(6));
		else if (CANON.animals[raw]) lines.push(animalBlock(raw, ctx));
		else lines.push(...personBlock(raw, opts, ctx));
	}
	if (ctx.horse && CANON.horses?.common) lines.push(CANON.horses.common);
	if (ctx.hat) lines.push(`HEADWEAR: ${CANON.hats.jougwan.text}`);
	for (const k of ctx.nobles) {
		const kit = CANON.costume?.kingdoms?.[k]?.noble;
		if (!kit) continue;
		for (const r of kit.refs) ctx.refs.add(r);
		lines.push(`NOBLE CROWN: ${kit.text}`);
	}
	const costumes = [...ctx.costumes].map((k) => costumeBlock(k, ctx)).filter(Boolean);
	if (costumes.length) lines.push(`${CANON.costume.common} ${costumes.join(' ')}`);
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
		else if (a === '--no-hat') opts.hat = false;
		else ids.push(a);
	}
	if (!ids.length) {
		console.error('usage: node scripts/visual-canon.mjs --year <Y> [--battle|--sword|--mounted|--flags|--no-hat] <ids…|person:look> [place:<id>] [flag:<kingdom>] [dress:<kingdom>] [noble:<kingdom>]');
		process.exit(1);
	}
	const { refs, text } = buildCanon(ids, opts);
	console.log(JSON.stringify({ refs, abs: refs.map((r) => `${ROOT}static${r}`), text }, null, '\t'));
}
