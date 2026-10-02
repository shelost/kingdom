// Upserts image slots from an install manifest, then the same manifest feeds install-temp-art.mjs.
// Usage: node scripts/.cache/add-image-slots.mjs <manifest.json> [tail.txt]
// Item: { id, entry, after?, ratio, tone?, at, alt, scene, refs?, people?, canon? }
// `canon` (default on when `people` is set): { year?, battle?, sword?, mounted?, with?: ['gomanari', 'place:hwangsan'] } or false.
// `prompt` is written back as `scene` + canon block + tail (default: the house suffix); canon refs are merged into `refs`.
// `ratio` defaults to the house 2:1. Any scene that mentions steel gets sw_bidam.png + the sword anatomy.
import fs from 'node:fs';
import { buildCanon } from '../visual-canon.mjs';
import { HOUSE_RATIO } from '../crop-ratio.mjs';
import { SWORD_BLADE_REF, SWORD_STILL_ANATOMY } from '../../src/lib/swords.ts';

const STORY = 'src/lib/data/story.json';
const HOUSE = 'src/lib/data/image-prompt-house.json';

const [manifestPath, tailPath] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const tail = tailPath
	? fs.readFileSync(tailPath, 'utf8').trim()
	: JSON.parse(fs.readFileSync(HOUSE, 'utf8')).suffix;

const entries = story.flatMap((ch) => ch.entries ?? []);
const slotsById = new Map(entries.flatMap((en) => (en.images ?? []).map((im) => [im.id, im])));

const SLOT_KEYS = ['ratio', 'tone', 'at', 'alt', 'prompt', 'refs', 'people'];

function slotFields(item) {
	const out = {};
	for (const k of SLOT_KEYS) if (item[k] !== undefined) out[k] = item[k];
	return out;
}

function canonFor(item, en) {
	if (item.canon === false || (!item.people?.length && !item.canon?.with?.length)) return { refs: [], text: '' };
	const opts = { ...(item.canon ?? {}) };
	const entryYear = Number.parseInt(String(en.year ?? ''), 10);
	opts.year ??= Number.isFinite(entryYear) ? entryYear : undefined;
	return buildCanon([...(item.people ?? []), ...(opts.with ?? [])], opts);
}

const STEEL_RE = /(?<!\b(?:no|without|unarmed,?) )\b(swords?|(?<!shoulder )blades?(?! of grass)|hilts?|scabbards?|sheath(e|ed)?|pommel|hwandudaedo|환두대도|drawn steel|unsheath\w*)\b/i;

/** The one ring-pommel sword board rides along whenever a blade can be in frame. */
function withSword(item, canon) {
	if (!STEEL_RE.test(item.scene ?? '') || canon.refs.includes(SWORD_BLADE_REF)) return canon;
	return {
		refs: [...canon.refs, SWORD_BLADE_REF],
		text: [canon.text, `SWORD ANATOMY: ${SWORD_STILL_ANATOMY}`].filter(Boolean).join(' ')
	};
}

const added = [];
const updated = [];

for (const item of manifest) {
	const en = entries.find((e) => e.title === item.entry);
	if (!en) throw new Error(`missing entry ${item.entry}`);
	if (!JSON.stringify(en.blocks).includes(JSON.stringify(item.at).slice(1, -1))) {
		throw new Error(`${item.id}: anchor not found in ${item.entry}: ${item.at}`);
	}
	item.ratio ??= HOUSE_RATIO;
	const canon = withSword(item, canonFor(item, en));
	item.prompt = [item.scene, canon.text, tail].filter(Boolean).join(' ');
	const refs = [...new Set([...(item.refs ?? []), ...canon.refs])].filter((r) => typeof r === 'string');
	if (refs.length) item.refs = refs;
	const existing = slotsById.get(item.id);
	if (existing) {
		Object.assign(existing, slotFields(item));
		updated.push(item.id);
		continue;
	}
	const slot = { id: item.id, ...slotFields(item) };
	en.images ??= [];
	const i = item.after ? en.images.findIndex((im) => im.id === item.after) : -1;
	if (i >= 0) en.images.splice(i + 1, 0, slot);
	else en.images.push(slot);
	slotsById.set(item.id, slot);
	added.push(item.id);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t') + '\n');

console.log(`added ${added.length}: ${added.join(', ')}`);
if (updated.length) console.log(`updated ${updated.length}: ${updated.join(', ')}`);
