/**
 * More Jumong childhood stills — slots + bury `at` in brothers blocks + wire jumong-buyeo-north.
 * node scripts/.cache/patch-jumong-childhood-more.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');
const HOUSE = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/data/image-prompt-house.json'), 'utf8'));
const SUFFIX = HOUSE.suffix;

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];
if (j.title !== 'Jumong') throw new Error(`expected Jumong, got ${j.title}`);

function findP(needle) {
	const i = j.blocks.findIndex((b) => b.kind === 'p' && String(b.html ?? '').includes(needle));
	if (i < 0) throw new Error(`p missing: ${needle}`);
	return j.blocks[i];
}

function bury(block, enNeedle, enInsert, koNeedle, koInsert) {
	if (!block.html.includes(enNeedle)) throw new Error(`en needle missing: ${enNeedle}`);
	if (block.html.includes(enInsert.replace(/<\/?b>/g, '').slice(0, 18))) return;
	block.html = block.html.replace(enNeedle, enInsert);
	if (!block.ko.includes(koNeedle)) throw new Error(`ko needle missing: ${koNeedle}`);
	block.ko = block.ko.replace(koNeedle, koInsert);
}

const grows = findP('grows up with his brothers');
bury(
	grows,
	'Same grey-giwa bar of a hall.',
	'Same grey-giwa bar of a hall. <b>Yuhwa watches from the hall door.</b>',
	'같은 회색 기와 대청.',
	'같은 회색 기와 대청. <b>유화는 대청 문에서 본다.</b>'
);

const boysFirst = findP('They are boys first');
bury(
	boysFirst,
	'<b>three tiny princes at one stake</b>,',
	'<b>three tiny princes at one stake</b> — <b>tiny stamps at the same stake</b>,',
	'<b>말뚝 하나에 작은 왕자 셋</b>,',
	'<b>말뚝 하나에 작은 왕자 셋</b> — <b>같은 말뚝에 작은 도장처럼</b>,'
);

const youths = findP('The smiles keep shrinking');
bury(
	youths,
	'By the time they are youths in the same square',
	'<b>They grow apart in the same square.</b> By the time they are youths in the same square',
	'같은 네모에서 청년이 될 때쯤',
	'<b>같은 네모에서 서로 멀어진다.</b> 같은 네모에서 청년이 될 때쯤'
);

const fly = findP('find a fly’s wing with an arrow');
bury(
	fly,
	'He can <b>find a fly’s wing with an arrow</b>.',
	'<b>He practices on a fly’s wing</b> until the yard knows the sound. Then he can <b>find a fly’s wing with an arrow</b>.',
	'그는 <b>화살로 파리의 날개를 맞힌다</b>.',
	'<b>파리 날개로 연습한다</b>. 마당이 그 소리에 익는다. 그다음 그는 <b>화살로 파리의 날개를 맞힌다</b>.'
);

const yardRefs = [
	'/pl_buyeo_yard.png',
	'/temp/buyeo-seq-yard-dutch.jpg',
	'/temp/jumong-seq-buyeo-wide.jpg'
];
const boyFaces = ['/ch_jumong.png', '/ch_daeso.png', '/ch_galsa.png'];

function prompt(body) {
	return `${body} ${SUFFIX}`;
}

const slots = [
	{
		id: 'jumong-child-tiny-stamps',
		at: 'tiny stamps at the same stake',
		alt: 'Bird’s-eye dusk Buyeo yard: three tiny child princes as stamps at one mark-stake, grey-giwa hall a dark bar',
		tone: '#e8563f',
		people: ['jumong', 'daeso', 'galsa'],
		refs: [...yardRefs, ...boyFaces],
		role: 'tiny stamps',
		angle: 'bird’s-eye stake',
		prompt: prompt(
			'Minimal iconic 16:9 still. BIRD’S-EYE dusk crane. LOCK attached Buyeo yard: same timber palisade, same grey-giwa hall as a dark horizontal bar, same mark-stake a thin vertical, packed earth. ONE device: the empty packed-earth square; three TINY child-prince stamps in the lower third at one stake. ONE Jumong boy only — clean-shaven, fun grin, child body not the adult portrait stance, red silk #e8563f as the single accent. ONE Daeso boy too close, olive-dust #9b8f6a. ONE Galsa boy delayed, sage #6b8f4a. FACE language only from attached portraits — invent small boy bodies, short, mid-lean at the stake, not a 3/4 fashion lineup. High contrast, crushed blacks, one hard dusk key, long stake-shadow. Natural sky. No army. No glow. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-borrowed-bows',
		at: 'borrowed bows',
		alt: 'Dutch Buyeo yard: three boys lifting borrowed adult bows too big, mark-stake, grey-giwa hall bar',
		tone: '#e8563f',
		people: ['jumong', 'daeso', 'galsa'],
		refs: [...yardRefs, ...boyFaces],
		role: 'borrowed bows',
		angle: 'dutch lift',
		prompt: prompt(
			'Minimal iconic 16:9 still. DUTCH low. LOCK attached Buyeo yard: palisade, grey-giwa hall as a dark bar, mark-stake, packed earth. ONE device: three borrowed adult bows as too-long diagonals. THREE BOYS only, ONE of each: Jumong a grinning clean-shaven boy in red #e8563f lifting a bow bigger than his shoulder; Daeso teen too close, olive #9b8f6a, correcting the grip; Galsa sage #6b8f4a looking down, delayed smile. FACE from attached — boy/teen bodies, cracked-voice age, not adult fashion plates, not clasped-hands clones. Mid-lift, mid-stride, not standing portraits. High contrast chiaroscuro, one hard key, long shadows. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-fly-practice',
		at: 'He practices on a fly’s wing',
		alt: 'Rack-focus Buyeo stake: boy Jumong full-draw at a fly, clean-shaven grin, hall bar in bokeh',
		tone: '#e8563f',
		people: ['jumong'],
		refs: [...yardRefs, '/ch_jumong.png'],
		role: 'fly practice',
		angle: 'rack-focus draw',
		prompt: prompt(
			'Minimal iconic 16:9 still. RACK-FOCUS. LOCK attached Buyeo yard. Foreground: a fly on the mark-stake, creamy bokeh. Midground: ONE boy Jumong full-draw — CHILD body, clean-shaven, fun grin, red #e8563f as the arrow-line accent, not the adult portrait stance. FACE only from attached. ONE device: the bow as a hard horizontal. Grey-giwa hall melts into bokeh. High contrast, shallow DOF. No second Jumong. No mustache. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-fly-hit',
		at: 'The yard hears the wood take it',
		alt: 'Shallow DOF: fly wing pinned to the Buyeo mark-stake, boy Jumong grinning in the midground',
		tone: '#e8563f',
		people: ['jumong'],
		refs: [...yardRefs, '/ch_jumong.png'],
		role: 'wood takes it',
		angle: 'shallow DOF pin',
		prompt: prompt(
			'Minimal iconic 16:9 still. SHALLOW DOF. LOCK attached Buyeo yard. ONE device: a fly’s wing pinned to the mark-stake in sharp foreground; boy Jumong a clean-shaven grinning midground stamp, red #e8563f as the single accent on the shaft. CHILD body, not adult fashion plate. FACE from attached. Hall bar creamy bokeh. High contrast. No clone. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-daeso-no-clap',
		at: 'Daeso does not clap',
		alt: 'Dutch two-shot Buyeo yard: boy Jumong grinning after the hit; teen Daeso arms down, not clapping',
		tone: '#9b8f6a',
		people: ['daeso', 'jumong'],
		refs: [...yardRefs, '/ch_daeso.png', '/ch_jumong.png'],
		role: 'Daeso not clapping',
		angle: 'dutch two-shot',
		prompt: prompt(
			'Minimal iconic 16:9 still. DUTCH two-shot. LOCK attached Buyeo yard: mark-stake, packed earth, grey-giwa hall bar. ONE Jumong boy grinning, clean-shaven, red #e8563f rim, child/teen body mid-turn from the hit. ONE Daeso teen too close, arms down, not clapping, olive-dust #9b8f6a as the plane. FACE from attached — invent new bodies, not portrait clones. ONE device: the gap between them as a hard packed-earth wedge. High contrast, one hard key. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-galsa-dirt',
		at: 'Galsa looking at the dirt instead of the hit',
		alt: 'Worm’s-eye Buyeo packed earth: boy Galsa looking at dirt, mark-stake bokeh, hall bar above',
		tone: '#6b8f4a',
		people: ['galsa'],
		refs: [...yardRefs, '/ch_galsa.png'],
		role: 'Galsa at dirt',
		angle: 'worm’s-eye dirt',
		prompt: prompt(
			'Minimal iconic 16:9 still. WORM’S-EYE from packed earth. LOCK attached Buyeo yard. ONE boy Galsa kneeling / looking down at dirt, delayed almost-smile dying, sage #6b8f4a as the single accent. FACE from attached — teen/boy body, not adult fashion plate. ONE device: the mark-stake as a thin vertical in creamy bokeh; grey-giwa hall a dark bar above. High contrast. No clap. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-one-roof-pile',
		at: 'They sleep in a pile like dogs',
		alt: 'Dutch night Buyeo step: three boys asleep in a pile, millet bowls, grey-giwa hall bar',
		tone: '#9b8f6a',
		people: ['daeso', 'galsa', 'jumong'],
		refs: [...yardRefs, ...boyFaces],
		role: 'night pile',
		angle: 'dutch night step',
		prompt: prompt(
			'Minimal iconic 16:9 still. DUTCH night. LOCK attached Buyeo yard: same grey-giwa hall as a dark bar, palisade, packed-earth step. ONE device: three boys asleep in a pile on the step — ONE Jumong clean-shaven boy red #e8563f sleeve, ONE Daeso olive #9b8f6a, ONE Galsa sage #6b8f4a. Child/teen bodies, not adult clones. One lamp as a hard key, crushed blacks, long shadows. FACE from attached. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-millet',
		at: 'Jumong steals the last millet',
		alt: 'Intimate dutch Buyeo step: boy Jumong stealing the last millet bowl, Daeso flicking his ear',
		tone: '#e8563f',
		people: ['jumong', 'daeso'],
		refs: [...yardRefs, '/ch_jumong.png', '/ch_daeso.png'],
		role: 'millet steal',
		angle: 'intimate dutch',
		prompt: prompt(
			'Minimal iconic 16:9 still. INTIMATE DUTCH. LOCK attached Buyeo night step, grey-giwa hall bar in bokeh. ONE boy Jumong grinning, clean-shaven, stealing the last millet bowl, red #e8563f as the bowl-accent. ONE teen Daeso mid-flick at his ear, olive #9b8f6a, too close. FACE from attached — boy bodies, not portrait stance. ONE device: the three bowls as a low strip, one lifted. Lamp chiaroscuro. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-daeso-close',
		at: 'Daeso stands too close',
		alt: 'OTS Buyeo yard: Daeso’s shoulder filling the frame, boy Jumong at the mark-stake beyond',
		tone: '#9b8f6a',
		people: ['daeso', 'jumong'],
		refs: [...yardRefs, '/ch_daeso.png', '/ch_jumong.png'],
		role: 'too close',
		angle: 'OTS shoulder',
		prompt: prompt(
			'Minimal iconic 16:9 still. OVER-SHOULDER. LOCK attached Buyeo yard. Foreground: ONE teen Daeso shoulder and cheek, olive-dust #9b8f6a as the plane, standing too close, FACE from attached. Midground: ONE boy Jumong at the mark-stake, clean-shaven fun grin, red #e8563f accent, child body drawing. ONE device: Daeso’s shoulder as a dark vertical eating half the frame. Hall bar bokeh. High contrast. No clone. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-yuhwa-door',
		at: 'Yuhwa watches from the hall door',
		alt: 'OTS Buyeo hall door: Yuhwa in ice-blue court silk watching three tiny boys at the mark-stake',
		tone: '#8fc4e0',
		people: ['yuhwa', 'jumong', 'daeso', 'galsa'],
		refs: [...yardRefs, '/ch_yuhwa.png', '/bn_yuhwa.png', ...boyFaces],
		role: 'mother at the door',
		angle: 'OTS doorway',
		prompt: prompt(
			'Minimal iconic 16:9 still. OVER-SHOULDER from the timber hall door. LOCK attached Buyeo yard beyond the doorway. ONE Yuhwa only in ice-blue court silk — FACE and garments from attached portrait, wave-binyeo matching attached, not river wrap, not a fashion plate; she leans in the door watching. Midground: three TINY boy stamps at the mark-stake — ONE Jumong red #e8563f, ONE Daeso #9b8f6a, ONE Galsa #6b8f4a, child bodies, not adult clones. ONE device: the dark door-frame as a hard rectangle; yard packed earth through it. Ice-blue #8fc4e0 as her silk-plane, not a halo. High contrast. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-grow-apart',
		at: 'They grow apart in the same square',
		alt: 'Bird’s-eye same Buyeo square: three youths spaced farther from one mark-stake, hall as a dark bar',
		tone: '#9b8f6a',
		people: ['jumong', 'daeso', 'galsa'],
		refs: [...yardRefs, ...boyFaces],
		role: 'growing apart',
		angle: 'bird’s-eye spaced',
		prompt: prompt(
			'Minimal iconic 16:9 still. BIRD’S-EYE dusk. LOCK attached Buyeo yard: same square, same grey-giwa hall bar, same mark-stake. ONE device: three teen bodies spaced far apart around one stake — growing apart, empty packed earth as ink. ONE Jumong clean-shaven teen grin, red #e8563f. ONE Daeso too close to the stake still, olive #9b8f6a. ONE Galsa turned toward dirt, sage #6b8f4a. FACE from attached — teen bodies, not adult fashion plates, not a side-by-side lineup. High contrast, long shadows. Natural sky. No army. No text. No watermark.'
		)
	},
	{
		id: 'jumong-child-two-talk',
		at: 'Only two come back talking',
		alt: 'Dutch palisade path: Daeso and Jumong walking back talking; Galsa a sage stamp behind, hall bar',
		tone: '#6b8f4a',
		people: ['galsa', 'daeso', 'jumong'],
		refs: [...yardRefs, ...boyFaces],
		role: 'two talking',
		angle: 'dutch path',
		prompt: prompt(
			'Minimal iconic 16:9 still. DUTCH mid-stride on the packed-earth path inside the palisade. LOCK attached Buyeo yard: iron-boss hint, grey-giwa hall as a distant dark bar. TWO in front talking: ONE teen Daeso olive #9b8f6a, ONE Jumong clean-shaven teen red #e8563f grin. ONE Galsa a sage #6b8f4a stamp behind, not talking, delayed. FACE from attached — teen bodies mid-stride, not standing clones. ONE device: the path as a hard receding wedge. High contrast, one hard key. No army. No text. No watermark.'
		)
	}
];

function ensureImage(slot) {
	const { role, angle, ...im } = slot;
	const i = j.images.findIndex((x) => x.id === im.id);
	const rec = { ratio: 1.778, nsfw: false, ...im };
	if (i < 0) j.images.push(rec);
	else j.images[i] = { ...j.images[i], ...rec };
}

for (const s of slots) ensureImage(s);

let seq = fs.readFileSync(SEQ, 'utf8');
const needle = `{ id: 'buyeo-seq-childhood-tiny', role: 'princes as stamps', angle: 'bird’s-eye stake', at: 'three tiny princes at one stake' },`;
const insert = `${needle}
			{ id: 'jumong-child-tiny-stamps', role: 'tiny stamps', angle: 'bird’s-eye stake', at: 'tiny stamps at the same stake' },
			{ id: 'jumong-buyeo-boys-young', role: 'boys', angle: 'bird’s-eye stake', at: 'They are boys first' },
			{ id: 'jumong-buyeo-boys-worm', role: 'boys from earth', angle: 'worm’s-eye stake', at: 'They are boys first' },
			{ id: 'jumong-child-borrowed-bows', role: 'borrowed bows', angle: 'dutch lift', at: 'borrowed bows' },
			{ id: 'jumong-buyeo-boys', role: 'brothers', angle: 'worm’s-eye stake', at: 'grows up with his brothers' },
			{ id: 'jumong-child-yuhwa-door', role: 'mother at the door', angle: 'OTS doorway', at: 'Yuhwa watches from the hall door' },
			{ id: 'jumong-child-daeso-close', role: 'too close', angle: 'OTS shoulder', at: 'Daeso stands too close' },
			{ id: 'jumong-child-fly-practice', role: 'fly practice', angle: 'rack-focus draw', at: 'He practices on a fly’s wing' },
			{ id: 'jumong-child-fly-hit', role: 'wood takes it', angle: 'shallow DOF pin', at: 'The yard hears the wood take it' },
			{ id: 'jumong-child-daeso-no-clap', role: 'Daeso not clapping', angle: 'dutch two-shot', at: 'Daeso does not clap' },
			{ id: 'jumong-child-galsa-dirt', role: 'Galsa at dirt', angle: 'worm’s-eye dirt', at: 'Galsa looking at the dirt instead of the hit' },
			{ id: 'buyeo-one-roof-night', role: 'still a pile', angle: 'dutch step night', at: 'One roof, three bowls' },
			{ id: 'jumong-child-one-roof-pile', role: 'night pile', angle: 'dutch night step', at: 'They sleep in a pile like dogs' },
			{ id: 'jumong-child-millet', role: 'millet steal', angle: 'intimate dutch', at: 'Jumong steals the last millet' },
			{ id: 'jumong-buyeo-youths', role: 'youths', angle: 'dutch yard', at: 'The smiles keep shrinking' },
			{ id: 'jumong-child-grow-apart', role: 'growing apart', angle: 'bird’s-eye spaced', at: 'They grow apart in the same square' },
			{ id: 'jumong-child-two-talk', role: 'two talking', angle: 'dutch path', at: 'Only two come back talking' },`;

if (!seq.includes("id: 'jumong-child-tiny-stamps'")) {
	// Replace the old boy-shot run so new stills sit among them (no duplicate ids).
	const oldRun = `{ id: 'buyeo-seq-childhood-tiny', role: 'princes as stamps', angle: 'bird’s-eye stake', at: 'three tiny princes at one stake' },
			{ id: 'jumong-buyeo-boys-young', role: 'boys', angle: 'bird’s-eye stake', at: 'They are boys first' },
			{ id: 'jumong-buyeo-boys-worm', role: 'boys from earth', angle: 'worm’s-eye stake', at: 'They are boys first' },
			{ id: 'jumong-buyeo-boys', role: 'brothers', angle: 'worm’s-eye stake', at: 'grows up with his brothers' },
			{ id: 'jumong-buyeo-youths', role: 'youths', angle: 'dutch yard', at: 'The smiles keep shrinking' },
			{ id: 'buyeo-one-roof-night', role: 'still a pile', angle: 'dutch step night', at: 'One roof, three bowls' },`;
	if (!seq.includes(oldRun)) throw new Error('movieSequences boy-run missing');
	seq = seq.replace(oldRun, insert);
	fs.writeFileSync(SEQ, seq);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const manifest = slots.map(({ id, alt, prompt }) => ({ id, alt, prompt }));
fs.writeFileSync(
	path.join(ROOT, 'scripts/.cache/jumong-childhood-more-manifest.json'),
	JSON.stringify(manifest, null, '\t') + '\n'
);

console.log(`patched ${slots.length} childhood slots`);
