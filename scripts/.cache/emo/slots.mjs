// add-image-slots.mjs semantics (canon block + house suffix + sword board), saved atomically through story-ops,
// with refs trimmed to GenerateImage's five-image cap.
// Usage: node scripts/.cache/emo/slots.mjs <manifest.json>
import fs from 'node:fs';
import { buildCanon } from '../../visual-canon.mjs';
import { HOUSE_RATIO } from '../../crop-ratio.mjs';
import { SWORD_BLADE_REF, SWORD_STILL_ANATOMY } from '../../../src/lib/swords.ts';
import { loadStory, saveStory, find, ROOT } from '../story-ops.mjs';

const MAX_REFS = 5;
const SLOT_KEYS = ['ratio', 'at', 'alt', 'prompt', 'refs', 'people'];
const STEEL_RE = /(?<!\b(?:no|without|unarmed,?) )\b(swords?|(?<!shoulder )blades?(?! of grass)|hilts?|scabbards?|sheath(e|ed)?|pommel|drawn steel)\b/i;
/** Lower rank survives the trim first: faces, then hair pins, objects, places, blade, crowns, charts, hat. */
const RANK = [/\/ch_/, /\/bn_/, /\/obj_/, /\/pl_/, /sw_bidam/, /crown/, /ref_hanbok/, /hat_jougwan_types/];
const rank = (r) => {
	const i = RANK.findIndex((re) => re.test(r));
	return i < 0 ? RANK.length : i;
};

const manifestPath = process.argv[2];
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const suffix = JSON.parse(fs.readFileSync(`${ROOT}/src/lib/data/image-prompt-house.json`, 'utf8')).suffix;

const story = loadStory();
const entries = story.flatMap((ch) => ch.entries ?? []);
const slotsById = new Map(entries.flatMap((en) => (en.images ?? []).map((im) => [im.id, im])));
const added = [];
const updated = [];

for (const item of manifest) {
	const matches = entries.filter((e) => e.title === item.entry);
	if (matches.length !== 1) throw new Error(`${item.id}: ${matches.length} entries titled ${item.entry}`);
	const en = matches[0];
	if (!find(en, item.at).length) throw new Error(`${item.id}: anchor not found in ${item.entry}: ${item.at}`);

	const opts = { ...(item.canon ?? {}) };
	const entryYear = Number.parseInt(String(en.year ?? ''), 10);
	opts.year ??= Number.isFinite(entryYear) ? entryYear : undefined;
	const ids = [...(item.people ?? []), ...(opts.with ?? [])];
	const canon = item.canon === false || !ids.length ? { refs: [], text: '' } : buildCanon(ids, opts);
	let refs = [...canon.refs];
	let text = canon.text;
	if (STEEL_RE.test(item.scene) && !refs.includes(SWORD_BLADE_REF)) {
		refs.push(SWORD_BLADE_REF);
		text = [text, `SWORD ANATOMY: ${SWORD_STILL_ANATOMY}`].filter(Boolean).join(' ');
	}
	refs = [...new Set([...(item.refs ?? []), ...refs])]
		.map((r, i) => ({ r, i }))
		.sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i)
		.slice(0, MAX_REFS)
		.map(({ r }) => r);

	item.ratio ??= HOUSE_RATIO;
	item.refs = refs;
	item.prompt = [item.scene, text, suffix].filter(Boolean).join(' ');

	const fields = Object.fromEntries(SLOT_KEYS.filter((k) => item[k] !== undefined).map((k) => [k, item[k]]));
	const existing = slotsById.get(item.id);
	if (existing) {
		Object.assign(existing, fields);
		updated.push(item.id);
		continue;
	}
	en.images ??= [];
	en.images.push({ id: item.id, ...fields });
	slotsById.set(item.id, fields);
	added.push(item.id);
}

saveStory(story);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`added ${added.length}: ${added.join(', ')}`);
if (updated.length) console.log(`updated ${updated.length}: ${updated.join(', ')}`);
