/**
 * Confession floor-sit: hair undone, Sosuno surrendered on packed earth.
 * node scripts/.cache/patch-confess-floor.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];
if (j.title !== 'Jumong') throw new Error(`expected Jumong, got ${j.title}`);

function ensureImage(slot) {
	const i = j.images.findIndex((im) => im.id === slot.id);
	if (i < 0) j.images.push(slot);
	else j.images[i] = { ...j.images[i], ...slot };
}

const sayRest = j.blocks.findIndex(
	(b) =>
		b.kind === 'dialogue' &&
		Array.isArray(b.en) &&
		b.en.some((l) => String(l).includes('What you want me to do to you.'))
);
if (sayRest < 0) throw new Error('say-the-rest dialogue missing');

const alreadySit = j.blocks[sayRest + 1]?.html?.includes?.('The bird pin comes out');
if (!alreadySit) {
	j.blocks.splice(sayRest + 1, 0, {
		kind: 'p',
		html: '<b>The bird pin comes out</b> of her hair like she has been waiting to be ugly about this. <b>Hair falls</b> all at once. She goes down with it. <b>She sits on packed earth facing down</b>, <b>forehead toward the boards</b>, <b>dusty-rose a surrendered heap</b>. <b>The crown of undone hair</b> is the only thing facing him. <b>Undone hair veils her face.</b> <b>She still doesn’t look up.</b>',
		ko: '<b>비녀가 빠진다.</b> 이제 와서 예쁘게 굴 생각 없다는 듯이. <b>머리가 내린다.</b> 한 번에. 같이 주저앉는다. <b>다진 흙에 앉아 아래를 본다.</b> <b>이마가 마루 쪽.</b> <b>회분홍이 항복한 더미다.</b> <b>풀린 머리 정수리</b>만 그를 향한다. <b>풀린 머리가 얼굴을 가린다.</b> <b>여전히 안 올려다본다.</b>'
	});
}

const heyHere = j.blocks.findIndex(
	(b) =>
		b.kind === 'dialogue' &&
		Array.isArray(b.en) &&
		b.en.some((l) => String(l).includes('Hey. Hey I’m here.'))
);
if (heyHere < 0) throw new Error('hey-I’m-here dialogue missing');

const alreadyHands = j.blocks[heyHere + 1]?.html?.includes?.('She keeps talking into the dirt');
if (!alreadyHands) {
	j.blocks.splice(heyHere + 1, 0, {
		kind: 'p',
		html: '<b>She keeps talking into the dirt.</b> <b>Her hands stay on the packed earth.</b> <b>Hair hides the binyeo.</b> <b>He kneels into the downcast frame</b> and her chin does not lift.',
		ko: '<b>흙한테 말을 이어간다.</b> <b>손은 다진 흙에 그대로다.</b> <b>머리가 비녀를 숨긴다.</b> <b>그가 그 숙인 프레임 안으로 무릎을 꿇는다.</b> 턱은 안 든다.'
	});
}

const sosunoRefs = ['/ch_sosuno.png', '/bn_sosuno.png'];
const bothRefs = ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'];

const slots = [
	{
		id: 'confess-pin-out',
		at: 'The bird pin comes out',
		alt: 'ECU: bird binyeo sliding from Sosuno’s hair, fingers, heavy blush, Jolbon packed earth',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate ECU. Bird pin coming out. Hair starting to fall. Dusty-rose #e8a04a blush-plane.'
	},
	{
		id: 'confess-hair-falls',
		at: 'Hair falls',
		alt: 'Dutch ECU: Sosuno’s black hair falling fully undone, bird pin in her lowered hand, blush',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate dutch ECU. Hair falls undone. Pin in hand. Dusty-rose #e8a04a blush-plane.'
	},
	{
		id: 'confess-sit-floor',
		at: 'She sits on packed earth facing down',
		alt: 'Low dutch: Sosuno collapsed sitting on packed earth, chin down, hair fully undone, dusty-rose pool',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate low dutch. She sits facing down. Hair undone. Dusty-rose #e8a04a pool.'
	},
	{
		id: 'confess-heap-two',
		at: 'dusty-rose a surrendered heap',
		alt: 'Dutch two-shot: Jumong stopped standing, Sosuno a surrendered heap on packed earth, hair undone',
		people: ['jumong', 'sosuno'],
		refs: bothRefs,
		prompt: 'Dutch two-shot. She a surrendered heap. He standing clean-shaven. Packed-earth gap.'
	},
	{
		id: 'confess-forehead-boards',
		at: 'forehead toward the boards',
		alt: 'High ECU: Sosuno’s forehead toward packed earth, undone hair, heavy blush',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate high ECU. Forehead toward packed earth. Hair undone. Dusty-rose #e8a04a.'
	},
	{
		id: 'confess-hair-veil',
		at: 'Undone hair veils her face',
		alt: 'ECU Sosuno: undone hair veiling her face, eyes down, heavy blush, surrendered',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate ECU. Hair veils her face. Eyes down. Heavy blush. Dusty-rose #e8a04a.'
	},
	{
		id: 'confess-crown-down',
		at: 'The crown of undone hair',
		alt: 'Dutch from above: crown of Sosuno’s undone hair, dusty-rose chima pooled on packed earth',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Dutch from above. Crown of undone hair. Dusty-rose pool. Packed earth.'
	},
	{
		id: 'confess-mid-word',
		at: 'She keeps talking into the dirt',
		alt: 'ECU Sosuno mid-word, mouth open, blush, chin down, hair undone, not looking up',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate ECU. Mouth mid-word. Chin down. Hair undone. Dusty-rose #e8a04a blush.'
	},
	{
		id: 'confess-no-look',
		at: 'She still doesn’t look up',
		alt: 'Dutch close: Sosuno still talking, still not looking up, hair undone, surrendered blush',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'Intimate dutch. Still doesn’t look up. Keep talking. Hair undone. Dusty-rose #e8a04a.'
	},
	{
		id: 'confess-hands-earth',
		at: 'Her hands stay on the packed earth',
		alt: 'ECU: Sosuno’s hands on packed earth, undone hair falling over wrists, blush in bokeh',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'ECU hands on packed earth. Hair over wrists. Blush bokeh. Dusty-rose #e8a04a.'
	},
	{
		id: 'confess-binyeo-hide',
		at: 'Hair hides the binyeo',
		alt: 'ECU: bird binyeo half-hidden under Sosuno’s undone hair on packed earth',
		people: ['sosuno'],
		refs: sosunoRefs,
		prompt: 'ECU. Hair hides the bird binyeo on packed earth. Dusty-rose sleeve. #e8a04a rim.'
	},
	{
		id: 'confess-he-kneels',
		at: 'He kneels into the downcast frame',
		alt: 'OTS: Jumong kneeling into Sosuno’s downcast sitting frame, her undone hair, his clean-shaven face',
		people: ['jumong', 'sosuno'],
		refs: bothRefs,
		prompt: 'OTS kneel. He enters her downcast frame. Clean-shaven. Hair undone. Red #e8563f.'
	}
];

for (const s of slots) {
	ensureImage({
		ratio: 1.778,
		nsfw: false,
		tone: s.people.includes('jumong') && s.people.length === 1 ? '#e8563f' : '#e8a04a',
		...s
	});
}

let seq = fs.readFileSync(SEQ, 'utf8');
const needle =
	"{ id: 'jumong-pov-say-rest', role: 'his view she has to say it', angle: 'OTS Jumong', at: 'What you want me to do to you.' },";
const insert = `${needle}
			{ id: 'confess-pin-out', role: 'binyeo comes out', angle: 'ECU pin', at: 'The bird pin comes out' },
			{ id: 'confess-hair-falls', role: 'hair falls', angle: 'dutch ECU hair', at: 'Hair falls' },
			{ id: 'confess-sit-floor', role: 'she sits down', angle: 'low dutch sit', at: 'She sits on packed earth facing down' },
			{ id: 'confess-heap-two', role: 'surrendered heap', angle: 'dutch two-shot', at: 'dusty-rose a surrendered heap' },
			{ id: 'confess-forehead-boards', role: 'forehead to earth', angle: 'high ECU', at: 'forehead toward the boards' },
			{ id: 'confess-hair-veil', role: 'hair veils face', angle: 'ECU veil', at: 'Undone hair veils her face' },
			{ id: 'confess-crown-down', role: 'crown of hair', angle: 'dutch above', at: 'The crown of undone hair' },
			{ id: 'confess-mid-word', role: 'she confesses', angle: 'ECU mouth', at: 'She keeps talking into the dirt' },
			{ id: 'confess-no-look', role: 'still down', angle: 'dutch close', at: 'She still doesn’t look up' },
			{ id: 'confess-hands-earth', role: 'hands on floor', angle: 'ECU hands', at: 'Her hands stay on the packed earth' },
			{ id: 'confess-binyeo-hide', role: 'pin hidden', angle: 'ECU still-life', at: 'Hair hides the binyeo' },
			{ id: 'confess-he-kneels', role: 'he kneels in', angle: 'OTS kneel', at: 'He kneels into the downcast frame' },`;
if (!seq.includes("id: 'confess-pin-out'")) {
	if (!seq.includes(needle)) throw new Error('movieSequences needle missing');
	seq = seq.replace(needle, insert);
	fs.writeFileSync(SEQ, seq);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched confession floor-sit beats + 12 slots');
