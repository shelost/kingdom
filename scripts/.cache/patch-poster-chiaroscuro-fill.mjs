/**
 * Upsert poster_* slots for the chiaroscuro fill batch, then install.
 * Usage: node scripts/.cache/patch-poster-chiaroscuro-fill.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const MANIFEST = path.join(ROOT, 'scripts/.cache/poster-chiaroscuro-fill-manifest.json');

const ENTRY_BY_ID = {
	poster_gyebek: 'Five Thousand',
	poster_xuerengui: 'Stallion Mountain',
	poster_takutsu: 'White River',
	poster_euija: 'King Euija, the 31st Eraha',
	poster_yangmanchun: 'Ansi',
	poster_namseng: 'Birth of Namseng',
	poster_namgun: 'The Final Stand',
	poster_bojang: 'The Summit',
	poster_jumong: 'Jumong',
	poster_daeso: 'Jumong',
	poster_daebyeol: 'Big Star and Little Star',
	poster_sobyeol: 'Big Star and Little Star'
};

const PEOPLE_BY_ID = {
	poster_gyebek: ['gyebek'],
	poster_xuerengui: ['xuerengui'],
	poster_takutsu: ['takutsu'],
	poster_euija: ['euija'],
	poster_yangmanchun: ['yangmanchun'],
	poster_namseng: ['namseng'],
	poster_namgun: ['namgun'],
	poster_bojang: ['bojang'],
	poster_jumong: ['jumong'],
	poster_daeso: ['daeso'],
	poster_daebyeol: ['daebyeol'],
	poster_sobyeol: ['sobyeol']
};

const REFS_BY_ID = {
	poster_gyebek: ['/ch_gyebek.png'],
	poster_xuerengui: ['/ch_xue_rengui.png'],
	poster_takutsu: ['/ch_takutsu.png'],
	poster_euija: ['/ch_buyeo_euija.png'],
	poster_yangmanchun: ['/ch_guardian.png'],
	poster_namseng: ['/ch_yeon_namseng.png'],
	poster_namgun: ['/ch_yeon_namgun.png'],
	poster_bojang: ['/ch_bojang.png'],
	poster_jumong: ['/ch_jumong.png'],
	poster_daeso: ['/ch_daeso.png'],
	poster_daebyeol: ['/ch_big_star.png'],
	poster_sobyeol: ['/ch_little_star.png']
};

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing entry ${title}`);
}

const upserted = [];
for (const item of manifest) {
	const en = findEntry(ENTRY_BY_ID[item.id]);
	en.images ??= [];
	const slot = {
		id: item.id,
		ratio: 0.75,
		tone: '#111111',
		nsfw: false,
		alt: item.alt,
		prompt: item.prompt,
		refs: REFS_BY_ID[item.id],
		people: PEOPLE_BY_ID[item.id]
	};
	const existing = en.images.findIndex((im) => im.id === item.id);
	if (existing >= 0) Object.assign(en.images[existing], slot);
	else en.images.unshift(slot);
	upserted.push(item.id);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`upserted slots: ${upserted.join(', ')}`);

execFileSync(process.execPath, [path.join(ROOT, 'scripts/install-temp-art.mjs'), MANIFEST], {
	stdio: 'inherit',
	cwd: ROOT
});
