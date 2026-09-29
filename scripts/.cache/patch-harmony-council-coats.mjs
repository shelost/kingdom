import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function upsertImage(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const COAT =
	'Every councillor wears Bidam’s Harmony Council dress: magenta/plum inner robe, silky white overcoat with faint dragon (heavenly-horse) embroidery. Face matches attached portrait. Do not wear armor, teal, or mixed court colors.';
const ROOM =
	'SAME chamber as img_sunduk_02: pale grey void, black oval table, low incense bowl with a small BLUE flame and blue-white smoke — the one accent. No pillars, lanterns, or palace furniture.';

const sunduk = findEntry('Queen Sunduk');
const harmony = findEntry('The Harmony Council');

upsertImage(
	sunduk,
	{
		id: 'council-blue-table',
		ratio: 1.778,
		tone: '#3E79E4',
		at: 'The Harmony Council (화백회의)',
		alt: 'Harmony Council pale void: black oval table, blue flame at center, six white dragon-coats over magenta',
		refs: ['/img_sunduk_02.png', '/ch_bidam.png', '/ch_eulje.png', '/ch_alchun.png'],
		prompt: `Minimal iconic 16:9 still. ${ROOM} ${COAT} No text. No watermark.`
	},
	'harmony-council'
);

upsertImage(
	sunduk,
	{
		id: 'council-flame-close',
		ratio: 1.778,
		tone: '#3E79E4',
		at: 'The Council decides by',
		alt: 'Table-rim close: blue flame on the black disc, Bidam and Euljé in white dragon-coats over magenta',
		refs: ['/img_sunduk_02.png', '/ch_bidam.png', '/ch_eulje.png'],
		prompt: `Intimate cinematic 16:9 still. Camera at table-rim. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-blue-table'
);

upsertImage(
	sunduk,
	{
		id: 'council-bidam-coat',
		ratio: 0.5625,
		tone: '#141C2E',
		at: 'I have known Princess Dukman',
		alt: 'Bidam stands — magenta inner, white dragon overcoat, blue flame shaft behind him',
		refs: ['/img_sunduk_02.png', '/ch_bidam.png'],
		prompt: `Minimal iconic 9:16 poster. Bidam standing, blue flame shaft behind. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-bidam-rise'
);

upsertImage(
	sunduk,
	{
		id: 'council-across-flame',
		ratio: 1.778,
		tone: '#3E79E4',
		at: 'Across the floor',
		alt: 'Bidam and Yushin across the black table, blue flame between them, same white dragon-coats',
		refs: ['/img_sunduk_02.png', '/ch_bidam.png', '/ch_kim_yushin.png'],
		prompt: `Intimate 16:9 two-shot. Bidam clean-shaven; Yushin bearded, no armor. Blue flame divider. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-across-stare'
);

upsertImage(
	sunduk,
	{
		id: 'council-alchun-tiger',
		ratio: 1.778,
		tone: '#8fb3e0',
		at: 'A tiger has no sex',
		alt: 'Alchun raises his hand — grey hair, scar, white dragon-coat over magenta, blue flame low-left',
		refs: ['/img_sunduk_02.png', '/ch_alchun.png', '/ch_bidam.png'],
		prompt: `Intimate 16:9 still. Alchun scar and grey goatee, hand raised. Not teal. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-across-flame'
);

upsertImage(
	sunduk,
	{
		id: 'council-yushin-coat',
		ratio: 0.5625,
		tone: '#2A5FB8',
		at: 'Well stood.',
		alt: 'Yushin seated in council dress — beard, white dragon-coat over magenta, blue flame at his shoulder',
		refs: ['/img_sunduk_02.png', '/ch_kim_yushin.png', '/ch_bidam.png'],
		prompt: `Minimal iconic 9:16 poster. Yushin beard and topknot, no armor. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-alchun-tiger'
);

upsertImage(
	harmony,
	{
		id: 'council-supum-flame',
		ratio: 1.778,
		tone: '#7f9fd0',
		at: 'Premier Supum',
		alt: 'Premier Supum at the far side of the oval table, blue flame framing his face, white dragon-coat',
		refs: ['/img_sunduk_02.png', '/ch_supum.png', '/ch_bidam.png'],
		prompt: `Minimal iconic 16:9 still. Older Supum, long hair, thin beard. ${ROOM} ${COAT} No text. No watermark.`
	},
	'harmony-council-wide'
);

upsertImage(
	harmony,
	{
		id: 'council-hands-blue',
		ratio: 1.778,
		tone: '#3E79E4',
		at: 'Yushin’s hand is among them',
		alt: 'Overhead stamp: black oval table, blue flame at center, white dragon-coat sleeves in a ring',
		refs: ['/img_sunduk_02.png', '/ch_bidam.png'],
		prompt: `Intimate 16:9 overhead. Table as a dark disc. Blue flame center. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council_morning'
);

upsertImage(
	harmony,
	{
		id: 'council-veto-blue',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'I object.',
		alt: 'Five white dragon-coat sleeves up around the blue flame; Bidam’s fist stays on the table',
		refs: ['/img_sunduk_02.png', '/ch_bidam.png', '/ch_alchun.png', '/ch_supum.png'],
		prompt: `Intimate 16:9 table-edge. Five hands up, Bidam’s fist down. ${ROOM} ${COAT} No text. No watermark.`
	},
	'council-veto-fist'
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Queen Sunduk + The Harmony Council slots');
