// Upserts image slots from an install manifest, then the same manifest feeds install-temp-art.mjs.
// Usage: node scripts/.cache/add-image-slots.mjs <manifest.json> [tail.txt]
// Item: { id, entry, after?, ratio, tone?, at, alt, scene, refs?, people? }
// `prompt` is written back as `scene` + tail (default: the house suffix) so the installer keeps it.
import fs from 'node:fs';

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

const added = [];
const updated = [];

for (const item of manifest) {
	item.prompt = `${item.scene} ${tail}`;
	const en = entries.find((e) => e.title === item.entry);
	if (!en) throw new Error(`missing entry ${item.entry}`);
	if (!JSON.stringify(en.blocks).includes(JSON.stringify(item.at).slice(1, -1))) {
		throw new Error(`${item.id}: anchor not found in ${item.entry}: ${item.at}`);
	}
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
