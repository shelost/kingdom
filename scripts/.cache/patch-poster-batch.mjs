/**
 * Delete the cloned *-poster batch and insert poster_* character posters.
 * Usage: node scripts/.cache/patch-poster-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const MANIFEST = path.join(ROOT, 'scripts/.cache/poster-batch-manifest.json');
const TEMP = path.join(ROOT, 'static/temp');

const DELETE_TEMP = [
	'bidam-poster.jpg',
	'sunduk-poster.jpg',
	'muyeol-poster.jpg',
	'jinduk-poster.jpg',
	'chunchu-poster.jpg',
	'euija-poster.jpg',
	'hyukgose-poster.jpg',
	'munmu-poster.jpg',
	'namgun-poster.jpg',
	'namseng-poster.jpg',
	'pung-poster.jpg'
];

const STRIP_TEMP = [
	'bidam-poster',
	'sunduk-poster',
	'jinduk-poster',
	'chunchu-poster',
	'euija-poster'
];

const REMOVE_SLOTS = [
	'muyeol-poster',
	'hyukgose-poster',
	'munmu-poster',
	'pung-poster',
	'namseng-poster',
	'namgun-poster'
];

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing entry ${title}`);
}

function allImages() {
	const out = [];
	for (const ch of story) {
		for (const en of ch.entries ?? []) {
			for (const im of en.images ?? []) out.push({ en, im });
		}
	}
	return out;
}

const deletedFiles = [];
for (const file of DELETE_TEMP) {
	const p = path.join(TEMP, file);
	if (fs.existsSync(p)) {
		fs.rmSync(p);
		deletedFiles.push(file);
	}
}

const stripped = [];
const removed = [];

for (const { en, im } of allImages()) {
	if (STRIP_TEMP.includes(im.id) && im.tempImage) {
		delete im.tempImage;
		stripped.push(im.id);
	}
}

for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (!en.images) continue;
		const before = en.images.length;
		en.images = en.images.filter((im) => !REMOVE_SLOTS.includes(im.id));
		if (en.images.length !== before) {
			for (const id of REMOVE_SLOTS) {
				if (!en.images.some((im) => im.id === id) && !removed.includes(id)) removed.push(id);
			}
		}
	}
}

function toSlot(item) {
	return {
		id: item.id,
		ratio: item.ratio,
		tone: item.tone,
		nsfw: false,
		alt: item.alt,
		prompt: item.prompt,
		refs: item.refs,
		people: item.people
	};
}

const inserted = [];
for (const item of manifest) {
	const en = findEntry(item.entry);
	en.images ??= [];
	const slot = toSlot(item);
	const replaceId = item.replaceId;
	const existing = en.images.findIndex((im) => im.id === item.id);
	const replaceAt = replaceId ? en.images.findIndex((im) => im.id === replaceId) : -1;
	if (existing >= 0) {
		Object.assign(en.images[existing], slot);
	} else if (replaceAt >= 0) {
		en.images[replaceAt] = slot;
	} else {
		en.images.unshift(slot);
	}
	inserted.push(item.id);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

console.log(`deleted temp: ${deletedFiles.join(', ') || '(none on disk)'}`);
console.log(`stripped tempImage: ${stripped.join(', ') || '(none)'}`);
console.log(`removed slots: ${removed.join(', ') || '(none)'}`);
console.log(`upserted posters: ${inserted.join(', ')}`);
