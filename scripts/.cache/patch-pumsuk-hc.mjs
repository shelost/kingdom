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

const daeya = findEntry('Daeya Fortress');
const lockRefs = ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'];
const lockPrompt =
	'Intimate cinematic 16:9. HIGH CONTRAST: charcoal-black Daeya hall, one hard gold lamp. Clean ice-blue #7EB8F0 vs dirtied green #8AAFA0. Progressive skin. Faces and garments match attached portraits. No text. No watermark.';

const twins = [
	{
		id: 'pumsuk-hc-01-walk',
		after: 'pumsuk-seq-01-walk',
		at: 'the lamp-line is hers',
		alt: 'High contrast: dirtied green silhouette on the gold lamp-line; clean ice-blue at the table'
	},
	{
		id: 'pumsuk-hc-02-contain',
		after: 'pumsuk-seq-02-contain',
		at: 'The training is a joke tonight',
		alt: 'High contrast: Pumsuk’s ice-blue face failing in the gold; green smear behind'
	},
	{
		id: 'pumsuk-hc-03-sit',
		after: 'pumsuk-seq-03-sit',
		at: 'She sits like the chair was always hers',
		alt: 'High contrast: she sits — dirtied green already open a wedge; his clean blue empty'
	},
	{
		id: 'pumsuk-hc-04-waist',
		after: 'pumsuk-seq-04-waist',
		at: 'His palm finds the worn knot',
		alt: 'High contrast: clean blue hand on the torn red chest-knot; more skin in the gold'
	},
	{
		id: 'pumsuk-hc-05-count',
		after: 'pumsuk-seq-05-count',
		at: 'She counts his looks out loud',
		alt: 'High contrast: Maehwa counting — dirtied green fallen another width against black'
	},
	{
		id: 'pumsuk-hc-06-throat',
		after: 'pumsuk-seq-06-throat',
		at: 'Heart-pupils, if anyone looked that close',
		alt: 'High contrast: her mouth at his throat; ice-blue robe open, heart-pupils in the gold'
	},
	{
		id: 'pumsuk-hc-07-kiss',
		after: 'pumsuk-seq-07-kiss',
		at: 'The mouth goes first',
		alt: 'High contrast: jeogori off both shoulders; clean ice-blue holds dirtied green'
	},
	{
		id: 'pumsuk-hc-08-leave',
		after: 'pumsuk-seq-08-leave',
		at: 'I should go, she says, like a joke that wants to be caught',
		alt: 'High contrast: jeogori closed as a stamp; figure still the silhouette; his hand up'
	},
	{
		id: 'pumsuk-hc-09-ankle',
		after: 'pumsuk-seq-09-ankle',
		at: 'He is already on the floor',
		alt: 'High contrast: hiked hem, bare foot in the gold; clean blue sleeve on the ankle'
	},
	{
		id: 'pumsuk-hc-10-fruit',
		after: 'pumsuk-seq-10-fruit',
		at: 'She puts the plum in her mouth so he has to watch',
		alt: 'High contrast: jeogori open on the figure, plum at the mouth; pink heart-pupils'
	},
	{
		id: 'pumsuk-hc-11-scream',
		after: 'pumsuk-seq-11-scream',
		at: 'The laugh becomes a scream',
		alt: 'High contrast: still standing, more open, the sound leaving her; he behind in clean blue'
	},
	{
		id: 'pumsuk-hc-12-lose',
		after: 'pumsuk-seq-12-lose',
		at: 'She loses the room',
		alt: 'High contrast: most skin of the night, dirtied green still on; his ice-blue still clean'
	}
];

function upsertAfter(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = entry.images.findIndex((im) => im.id === afterId);
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

for (const t of twins) {
	upsertAfter(
		daeya,
		{
			id: t.id,
			ratio: 1.778,
			tone: '#8AAFA0',
			nsfw: true,
			at: t.at,
			alt: t.alt,
			refs: lockRefs,
			people: ['gumilwife', 'pumsuk'],
			prompt: lockPrompt
		},
		t.after
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`upserted ${twins.length} high-contrast twins`);
