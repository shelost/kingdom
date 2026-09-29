import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = story
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Silla-Tang Alliance');
if (!entry) throw new Error('missing Silla-Tang Alliance');

const hallRefs = [
	'/ch_taizong.png',
	'/ar_tang_taizong_yuanling.jpg',
	'/ch_chunchu.png',
	'/pl_daming_palace.png'
];
const goRefs = [
	'/ch_taizong.png',
	'/ar_tang_taizong_yuanling.jpg',
	'/ch_chunchu.png',
	'/pl_daming_palace.png'
];

const grounded =
	'Grounded NIGHT movie 16:9 of the REAL interior of Daming Palace. SAME architecture every cut: vermilion timber columns in a row, stone floor, dark timber ceiling, raised brick-and-timber dais with wooden stairs attached to the floor. A camera could stand here. NOT a floating box, NOT a yellow cube, NOT a graphic void, NOT a flying dragon. Dragon is chest embroidery only. Oil-lamp, no glass lantern. High contrast, mostly dark, yellow #c97a2e silk highlights. Worm’s-eye / from below. FACE from attached portraits. Li Shimin: full imperial-yellow yuanlingpao and black futou from the attached robe painting — not the old yellow-over-black cape. Chunchu: magenta #D8258C wrap hanbok, wavy hair, thin jawline beard from attached — NOT a long full beard, ONE Chunchu only. Painterly historical cinema. No army. No furniture dump. No readable text. No watermark.';

const byId = new Map((entry.images ?? []).map((im) => [im.id, im]));

const updates = {
	'taizong-meet-court-wide': {
		at: 'approaches the Second Emperor',
		alt: 'Worm’s-eye Daming hall: vermilion columns, real dais with stairs; Chunchu walking in, looking up',
		refs: hallRefs,
		prompt: `${grounded} CINEMATOGRAPHY: worm’s-eye WIDE, Chunchu in the lower third walking into the hall. ONE device: the receding colonnade as a dark tunnel ending at the real audience dais. Li Shimin seated on that dais in yellow dragon yuanlingpao, small in the distance. Attach palace architecture; IGNORE the sunset sky — camera is INSIDE at night.`
	},
	'taizong-meet-robe': {
		at: 'Chunchu knelt and memorialized',
		alt: 'Worm’s-eye from the hall floor: Taizong seated on the real Daming dais, yellow yuanlingpao, columns in the dark',
		refs: ['/ch_taizong.png', '/ar_tang_taizong_yuanling.jpg', '/pl_daming_palace.png'],
		people: ['taizong'],
		prompt: `${grounded} CINEMATOGRAPHY: worm’s-eye from the stone floor looking UP the real dais. Taizong SEATED, leaning slightly forward. Vermilion columns visible left and right in crushed shadow. ONE device: the dais edge as a dark horizontal bar; yellow silk above it. Same audience hall.`
	},
	'taizong-meet-dais': {
		at: 'Chunchu knelt and memorialized',
		alt: 'From the floor: Chunchu kneeling on stone at the foot of real stairs; Taizong on the dais above',
		refs: hallRefs,
		prompt: `${grounded} CINEMATOGRAPHY: worm’s-eye looking UP real wooden stairs of the audience dais. Chunchu kneeling on the STONE FLOOR at the foot of the stairs, magenta hanbok, FACE from attached. Taizong seated on the platform above. ONE device: the stair as a real timber wedge, not a gold ramp in a void. Same hall. Two people.`
	},
	'taizong-meet-name': {
		at: 'Your name is Spring and Autumn',
		alt: 'Worm’s-eye ECU: Taizong looking down from the Daming dais, speaking, yellow robe, column in shadow',
		refs: ['/ch_taizong.png', '/ar_tang_taizong_yuanling.jpg', '/pl_daming_palace.png'],
		people: ['taizong'],
		prompt: `${grounded} CINEMATOGRAPHY: worm’s-eye ECU, shallow DOF. Taizong looking DOWN, speaking the name-joke, still seated on the same dais. A vermilion column and dais-edge stay in frame so the hall is readable. ONE device: a yellow lamp-key cutting the face; the rest crushed black. Same audience hall.`
	},
	'taizong-meet-go-wide': {
		at: 'After the hall, a smaller room. A go board.',
		alt: 'Worm’s-eye Daming side-chamber: go board on stone; emperor on a low raised platform, Chunchu on the floor',
		refs: goRefs,
		prompt: `${grounded} CUT TO a smaller SIDE CHAMBER of the SAME palace: same vermilion columns, same stone floor, same night. CINEMATOGRAPHY: worm’s-eye WIDE from near the floor looking toward the emperor — NOT a bird’s-eye dollhouse. ONE device: the pale go board on the floor as a square between two heights. Li Shimin seated on a low raised timber platform at the far end; Chunchu seated on the floor closer to camera. TWO PEOPLE only. Oil-lamp, no glass.`
	},
	'taizong-meet-go-up': {
		at: 'Yes — there is something between us that fits.',
		alt: 'OTS from Chunchu on the floor: looking up across the go board to Taizong on the platform',
		refs: goRefs,
		prompt: `${grounded} SAME side chamber. CINEMATOGRAPHY: over-shoulder worm’s-eye from Chunchu’s seated height. ONE device: the go board as a pale bar; magenta sleeve in the foreground, yellow emperor higher beyond. FACE from attached. Playing go. Height difference. Vermilion column in the dark behind Taizong.`
	},
	'taizong-meet-go-stone': {
		at: 'I prefer allies who can count',
		alt: 'Worm’s-eye ECU: yellow sleeve placing a stone on the go board; magenta cuff below; palace floor',
		refs: goRefs,
		prompt: `${grounded} SAME side chamber. CINEMATOGRAPHY: worm’s-eye ECU, shallow DOF. ONE device: one black go-stone on pale wood. Yellow yuanlingpao sleeve from above; magenta cuff below. Stone floor and a column base still readable. No glass lamp. No readable grid labels.`
	},
	'taizong-meet-fit': {
		at: 'You asked my name, did you not.',
		alt: 'Worm’s-eye two-shot: one Chunchu on the floor, Taizong higher on the platform, go board between them',
		refs: goRefs,
		prompt: `${grounded} SAME side chamber. CINEMATOGRAPHY: worm’s-eye two-shot. ONE Chunchu only — do NOT double him. Taizong on the raised platform in yellow yuanlingpao; Chunchu on the floor in magenta hanbok; go board between them. They look at each other. ONE device: the height split. Vermilion columns in crushed black.`
	}
};

for (const [id, patch] of Object.entries(updates)) {
	const im = byId.get(id);
	if (!im) throw new Error(`missing ${id}`);
	Object.assign(im, patch);
}

const goHtml = '<b>After the hall, a smaller room. A go board.</b> The emperor keeps the platform. Chunchu sits on the floor. Stones click in the dark.';
entry.blocks = (entry.blocks ?? []).filter((b) => !(typeof b.html === 'string' && b.html.includes('After the hall, a smaller room')));
const allies = entry.blocks.findIndex(
	(b) => b.kind === 'dialogue' && b.person === 'taizong' && (b.en ?? []).some((t) => t.includes('I prefer allies who can count'))
);
const goPara = {
	kind: 'p',
	html: goHtml,
	ko: '<b>대전 다음, 작은 방. 바둑판.</b> 황제는 높은 자리에 그대로 앉는다. 춘추는 바닥에 앉는다. 어둠 속에서 돌이 맞는다.'
};
if (allies >= 0) entry.blocks.splice(allies + 1, 0, goPara);
else entry.blocks.push(goPara);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('updated 8 slots; go beat after allies-who-can-count');
