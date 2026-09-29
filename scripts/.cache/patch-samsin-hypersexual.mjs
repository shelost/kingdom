import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

const samsin = '/ch_samsin.png';
const yumla = '/ch_yumla.png';
const haemosu = '/ch_haemosu.png';
const ibiga = '/ch_ibiga.png';
const kangrim = '/ch_kangrim.png';
const AT = 'H-hey, Samsin';

const slots = [
	{
		id: 'nsfw-samsin-rail-pose',
		ratio: 1.778,
		tone: '#e8b4c8',
		nsfw: true,
		at: AT,
		alt: 'Samsin at the pavilion rail — mature S-curve, hiked red chima, looking back laughing',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Goddess Samsin, ONE adult midwife, mature, openly flirty. ONE geometric device: a timber rail as a hard horizontal bar; her body an S-curve above it, looking back over the shoulder. Face matches the attached portrait: white hair updo, swirl binyeo, cream jeogori off one shoulder, royal-blue bodice, red chima hiked at the hip, red lipstick, knowing laugh. Blush-pink #e8b4c8 as the single accent. Striking silky hanbok, few hues. Skin-forward, taut silk, flushed cheeks. Otherworld flat charcoal void. Modest: no breasts, no nipples, no buttocks, no genitals. ONE woman only. No army. No clutter. No clouds. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin],
		people: ['samsin']
	},
	{
		id: 'nsfw-samsin-hip-weight',
		ratio: 1.778,
		tone: '#e8b4c8',
		nsfw: true,
		at: AT,
		alt: 'Samsin hip-cocked toward the camera — off-shoulder cream silk, mature smirk, posing for anyone',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Goddess Samsin, ONE adult woman, hypersexual midwife-goddess, mature vibe. ONE geometric device: her cocked hip as a triangular WEDGE filling the right two-thirds; face in the remaining third, looking at the viewer. Face matches the attached portrait: white hair, swirl binyeo, red lipstick, cream silk off the shoulder, red chima taut. Blush-pink #e8b4c8 accent. Striking silky hanbok. Flushed, laughing, posing on purpose. Flat charcoal void. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin],
		people: ['samsin']
	},
	{
		id: 'nsfw-samsin-silk-slide',
		ratio: 0.75,
		tone: '#e8b4c8',
		nsfw: true,
		at: AT,
		alt: 'Samsin seated wrong — one knee up, cream silk sliding, red chima hiked, mature heat',
		prompt:
			'Intimate cinematic CLOSE-UP still, 3:4. Goddess Samsin, ONE adult midwife. ONE geometric device: a falling DIAGONAL of cream silk; she sits with one knee up, chima hiked, posing as if the empty floor were a bed. Face matches the attached portrait: white hair, swirl binyeo, red lipstick, flushed, open smile. Blush-pink #e8b4c8. Striking silky hanbok, wet sheen, taut cloth. Otherworld flat black. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin],
		people: ['samsin']
	},
	{
		id: 'nsfw-samsin-over-shoulder',
		ratio: 1.778,
		tone: '#e8b4c8',
		nsfw: true,
		at: AT,
		alt: 'Over-shoulder: Samsin’s white nape and hiked red silk, looking back with a mature invitation',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Goddess Samsin. ONE geometric device: over-the-shoulder EDGE-GAZE — nape and hiked red chima fill the frame; her face turns back, red lipstick, knowing. Face matches the attached portrait: white hair, swirl binyeo. Blush-pink #e8b4c8 rim. Striking silky hanbok. Flushed, taut silk, S-curve. Flat charcoal void. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin],
		people: ['samsin']
	},
	{
		id: 'nsfw-samsin-yumla-red',
		ratio: 1.778,
		tone: '#7c3aed',
		nsfw: true,
		at: AT,
		alt: 'Samsin leans in, hiked silk, laughing; Yumla scarlet to the ears, purple robe, cannot look at her hip',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Samsin and adult Yumla, both clothed. ONE geometric device: a hard COLOR SPLIT — blush-pink #e8b4c8 left, violet #7c3aed going scarlet right. She leans, hiked red chima, cream silk off the shoulder, mature laugh. He is grey-bearded, purple robe, face flushed deep red, looking away, collar tight, visibly flustered. Faces match the attached portraits. Striking silky hanbok. Otherworld flat charcoal. Modest: no breasts, no nipples, no buttocks, no genitals, no nude two-shot. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin, yumla],
		people: ['samsin', 'yumla']
	},
	{
		id: 'nsfw-samsin-yumla-heat',
		ratio: 1.778,
		tone: '#7c3aed',
		nsfw: true,
		at: AT,
		alt: 'Foreground: Samsin’s hip and hiked silk. Background: Yumla’s face burning red, mouth parted',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. ONE geometric device: a LOW STRIP — Samsin’s hiked red silk hip as a blush-pink #e8b4c8 plane across the lower third; Yumla’s grey-bearded face in the upper void, burning red, mouth parted, looking at the silk not at her eyes. Faces match the attached portraits. Clothed. Striking silky hanbok. Otherworld flat charcoal. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin, yumla],
		people: ['samsin', 'yumla']
	},
	{
		id: 'nsfw-samsin-haemosu-tease',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: AT,
		alt: 'Samsin poses hip-out for Haemosu; the sun-god grins gold, unashamed, matching her heat',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Samsin posing, adult Haemosu grinning. ONE geometric device: a gold #f0b429 SHAFT down the left; her blush-pink #e8b4c8 S-curve on the right, hiked chima, off-shoulder silk. Faces match the attached portraits: her white hair and red lipstick; his white hair and sun-gold, laughing, not shy. Clothed. Striking silky hanbok. Otherworld flat charcoal. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin, haemosu],
		people: ['samsin', 'haemosu']
	},
	{
		id: 'nsfw-samsin-ibiga-weather',
		ratio: 1.778,
		tone: '#1e4d9c',
		nsfw: true,
		at: AT,
		alt: 'Samsin and Ibiga close — her hiked silk, his sky-blue sleeve, both smiling like appetite is manners',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Samsin and adult Ibiga, flirting, clothed. ONE geometric device: a deep-blue #1e4d9c SLEEVE-PLANE; her blush-pink #e8b4c8 hiked chima as the crossing ribbon. Faces match the attached portraits. Mature, laughing, skin-forward silk. Otherworld flat charcoal. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin, ibiga],
		people: ['samsin', 'ibiga']
	},
	{
		id: 'nsfw-samsin-kangrim-lookaway',
		ratio: 1.778,
		tone: '#4a4a58',
		nsfw: true,
		at: AT,
		alt: 'Samsin poses in the lamp; Kangrim in the gat stares hard at a notebook he is not reading',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Samsin posing, adult Kangrim looking away. ONE geometric device: a black LEDGER as a hard rectangle he hides behind; she fills the rest as a blush-pink #e8b4c8 S-curve, hiked silk, laughing at him. Faces match the attached portraits: her white hair; his black gat and grey clerk gravity. Clothed. Otherworld flat charcoal. Modest: no breasts, no nipples, no buttocks, no genitals. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [samsin, kangrim],
		people: ['samsin', 'kangrim']
	}
];

const meeting = findEntry('Annual Meeting of the Three Realms');
const after = meeting.images.findIndex((im) => im.id === 'three-realms-04-yumla-samsin');
if (after < 0) throw new Error('missing yumla-samsin still');

for (const slot of slots) {
	const i = meeting.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) Object.assign(meeting.images[i], slot);
}
const missing = slots.filter((s) => !meeting.images.some((im) => im.id === s.id));
meeting.images.splice(after + 1, 0, ...missing);

for (const slot of slots) {
	imagePeople[slot.id] = slot.people;
}
imagePeople['three-realms-04-yumla-samsin'] = ['samsin', 'yumla'];

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log(`added ${slots.length} nsfw slots on ${AT}`);
