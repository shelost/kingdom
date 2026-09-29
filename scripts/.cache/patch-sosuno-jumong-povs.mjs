import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('Jumong');

const slots = [
	{
		id: 'jumong-pov-tease',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'So how long has it been.',
		alt: 'Jumong’s POV: OTS red headband, Sosuno still open-mouthed on the grain porch, furious blush',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Jumong. Sharp red headband and red silk shoulder in foreground. Sosuno midground on Jolbon grain porch, dusty-rose hanbok NOT gold, bird binyeo, mouth still open from the shout, furious blush. His slow grin implied by camera. ONE device: porch-beam as a dark bar. FACE from attached. Packed earth, grey giwa. High contrast. No text.'
	},
	{
		id: 'sosuno-pov-grin',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'Don’t— don’t grin like you found something.',
		alt: 'Sosuno’s POV: OTS dusty-rose sleeve, Jumong’s well-grin filling the frame',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Sosuno. Sharp dusty-rose sleeve and black hair in foreground. Jumong’s FACE fills midground: red headband, laid-back well-grin like he found something, red silk #e8563f. FACE from attached. Jolbon grain porch, grey giwa bokeh. ONE device: his grin as the whole picture. High contrast. No text.'
	},
	{
		id: 'jumong-pov-blush',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'Then why are you furiously blushing.',
		alt: 'Jumong’s POV: her ears throat and whole face red, dusty-rose, he is looking',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Jumong. Red silk shoulder FG. Sosuno FACE fills the frame: furious blush, ears red, throat red, dusty-rose hanbok, bird binyeo, looking away, tsundere caught. FACE from attached. Grain-porch lamp. ONE device: the blush as a dusty-rose #e8a04a plane on her cheeks. High contrast ECU. No text.'
	},
	{
		id: 'sosuno-pov-leave',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'I’m also not stopping.',
		alt: 'Sosuno’s POV: Jumong’s unturned red back walking toward the pine, grin gone',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Sosuno. Dusty-rose sleeve FG. Jumong’s red back receding toward grey-giwa and pine, red headband, grin gone, mid-stride. FACE not needed on him — the back is the picture. Packed earth, long shadow. ONE device: red back as a receding plane. High contrast dutch. No text.'
	},
	{
		id: 'jumong-pov-lookback',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'He turns for the pine',
		alt: 'Jumong’s glance: Sosuno still on the porch, mouth open, dusty-rose, he is already walking',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'Over-the-shoulder glance from Jumong mid-stride. Sharp red headband edge FG. Sosuno a dusty-rose figure on the grain porch, mouth still open, not running yet. Packed earth, grey giwa, pine. FACE from attached. ONE device: the gap of packed earth between them. High contrast. No text.'
	},
	{
		id: 'jumong-pov-wont-say',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'I wasn’t going to say it',
		alt: 'Jumong’s POV: Sosuno looking down, cannot look at him, heavy blush, dusty-rose',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Jumong stopped. Red silk FG. Sosuno looking DOWN, heavy blush, bitten mouth, bird binyeo, dusty-rose, cannot look at him. FACE from attached, not portrait stance. Jolbon packed earth. ONE device: her downcast face filling the lower third. Intimate ECU-mid. High contrast. No text.'
	},
	{
		id: 'sosuno-pov-listen',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'I wanted you. From the first look.',
		alt: 'Sosuno’s POV: Jumong listening, grin gone, red silk, not walking anymore',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Sosuno looking up. Dusty-rose FG. Jumong FACE from attached: red headband, grin GONE, listening, serious for once, red silk. Packed earth, dusk. ONE device: his eyes as the still. High contrast dutch. No text.'
	},
	{
		id: 'jumong-pov-say-rest',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'What you want me to do to you.',
		alt: 'Jumong’s POV: Sosuno biting her lip, having to say the rest, dusty-rose',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Jumong waiting. Red silk FG. Sosuno FACE: bitten lip, furious blush, angry-wanting, dusty-rose, bird binyeo, about to spit the rest. FACE from attached. Grain porch dusk. ONE device: her bitten mouth. Intimate. High contrast. No text.'
	},
	{
		id: 'jumong-pov-never',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		at: 'I’ve never—',
		alt: 'Jumong’s POV in the grain room: Sosuno scared-blush, clothes still on, lamp',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Jumong in Jolbon grain room. Red silk FG. Sosuno FACE: scared blush, clothes ON dusty-rose hanbok, bird binyeo, lamp, not nude. Wanting and afraid. FACE from attached. ONE device: the lamp as a hard key. Intimate close, adult, not explicit. High contrast. No text.'
	},
	{
		id: 'sosuno-pov-done',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'I’ve done this.',
		alt: 'Sosuno’s POV: Jumong’s experienced calm face in the grain lamp, she is jealous',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt:
			'OTS from Sosuno in grain room. Dusty-rose sleeve FG. Jumong FACE from attached: red headband, not mocking, experienced calm, close, lamp on his cheek. Clothes on. She is jealous of that calm. ONE device: lamp shaft on his face. Intimate close, not explicit. High contrast. No text.'
	}
];

const ids = new Set(entry.images.map((im) => im.id));
const fresh = slots.filter((s) => !ids.has(s.id));
const i = entry.images.findIndex((im) => im.id === 'jumong-seq-turn-leave');
entry.images.splice(i < 0 ? entry.images.length : i + 1, 0, ...fresh);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('inserted', fresh.map((s) => s.id).join(', '));
