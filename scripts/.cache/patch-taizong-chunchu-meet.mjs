import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = story
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Silla-Tang Alliance');
if (!entry) throw new Error('missing Silla-Tang Alliance');

const suffix =
	'Painterly anime-adjacent cinema, not photoreal, not 3D. FACE AND GARMENTS: FACE ONLY from attached ch_taizong — NEVER copy the portrait’s yellow-over-black cape, raised-hand stance, or standing clone. GARMENTS from the attached Tang imperial refs: full imperial-yellow yuanlingpao, round chest dragon, black futou, long hem. Chunchu FACE AND magenta wrap hanbok from attached. Invent a new DRAMATIC body. CINEMATOGRAPHY: worm’s-eye, chiaroscuro, tenebrism, long-shadow yellow key from below. HIGH CONTRAST: 80 percent crushed black + yellow #c97a2e highlights only. ICONIC: one named device. Two garment-true figures against crushed black. No army. No palace clutter. No readable text. No watermark.';

const refsCourt = [
	'/ch_taizong.png',
	'/ar_tang_taizong_yuanling.jpg',
	'/ar_tang_taizong_dragon.png',
	'/ch_chunchu.png',
	'/pl_daming_palace.png'
];
const refsGo = [
	'/ch_taizong.png',
	'/ar_tang_taizong_yuanling.jpg',
	'/ar_tang_taizong_dragon.png',
	'/ch_chunchu.png'
];
const refsRobe = [
	'/ch_taizong.png',
	'/ar_tang_taizong_yuanling.jpg',
	'/ar_tang_taizong_dragon.png'
];

function slot(o) {
	return {
		ratio: 1.778,
		nsfw: false,
		tone: '#c97a2e',
		people: ['taizong', 'chunchu'],
		...o
	};
}

const extras = [
	slot({
		id: 'taizong-meet-court-wide',
		at: 'approaches the Second Emperor',
		alt: 'Worm’s-eye night court: yellow dais-plane high; tiny magenta Chunchu in the lower third',
		refs: refsCourt,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye wide, chiaroscuro, tenebrism. Mise-en-scène: INTERIOR Tang Daming audience hall at night — same timber hall language as the attached palace, IGNORE the sunset sky. ONE device: the emperor’s elevated dais as a hard yellow #c97a2e rectangle floating in crushed black. Tiny Chunchu in magenta #D8258C hanbok, lower third, looking up. Li Shimin a yellow silk mass on the high platform, FACE from attached, full yellow dragon yuanlingpao from attached robe refs, black futou. Monumental emptiness. No court catalog. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-robe',
		people: ['taizong'],
		at: 'Li Shimin.',
		alt: 'Worm’s-eye: Taizong seated high in full yellow dragon yuanlingpao, face in shadow, yellow hem-light',
		refs: refsRobe,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye, dutch, chiaroscuro. ONE device: the yellow hem as a downward triangle of light. Li Shimin SEATED on an elevated lacquer platform, not standing, not the portrait’s raised hand. FACE ONLY from attached portrait. GARMENTS from attached Tang refs: full imperial-yellow yuanlingpao with round chest dragon, black futou, long silky hem. 80 percent crushed black; yellow #c97a2e as highlights only. Encompassed in shadow. Painterly anime-adjacent. No army. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-dais',
		at: 'Chunchu knelt and memorialized',
		alt: 'Looking UP the platform steps: magenta Chunchu kneeling; Taizong a yellow silk mountain above',
		refs: refsCourt,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye looking UP stairs, long-shadow key. Mise-en-scène: locked Daming interior, night, crushed black. ONE device: a stair-wedge of yellow #c97a2e light receding to the dais. Chunchu kneeling in magenta #D8258C wrap hanbok, lower third. Taizong seated higher in full yellow dragon yuanlingpao from attached robe refs; FACE from attached; black futou. Height is the picture. No kowtow crowd. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-name',
		at: 'Your name is Spring and Autumn',
		alt: 'Worm’s-eye ECU: Taizong looking down from the dais, black futou, yellow dragon robe half-void',
		refs: refsRobe,
		people: ['taizong'],
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye ECU, shallow DOF, rack-focus. ONE device: a yellow #c97a2e blade of light cutting down the face; the rest crushed black. Li Shimin looking DOWN, speaking, seated on the high platform. FACE from attached. GARMENTS from attached: full yellow yuanlingpao, chest dragon, black futou. New pose — lean forward from the dais, not a standing clone. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-go-wide',
		at: 'After the hall, a smaller room. A go board.',
		alt: 'Private chamber: pale go-board square; emperor on a raised platform, Chunchu seated lower',
		refs: refsGo,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye wide, chiaroscuro. Mise-en-scène: locked private Tang chamber, crushed black, one yellow lamp. ONE device: the go board as a pale square stamp in the middle; TWO HEIGHTS — Li Shimin seated on an elevated platform above, Chunchu seated on the floor below. FACE from attached portraits. Taizong full yellow dragon yuanlingpao from attached robe refs; Chunchu magenta #D8258C hanbok. Stones as tiny dots, no readable grid. No furniture dump. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-go-up',
		at: 'Yes — there is something between us that fits.',
		alt: 'From the floor: looking up past magenta sleeve and the go board to Taizong on the dais',
		refs: refsGo,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye from Chunchu’s seated height, over-shoulder, tenebrism. ONE device: the go board as a pale horizon bar splitting the frame — low magenta #D8258C sleeve in the foreground, high yellow #c97a2e emperor on the platform beyond. FACE from attached. Taizong garments from attached yellow dragon yuanlingpao refs, black futou, mostly in shadow with yellow highlights. Playing go. Height difference is the picture. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-go-stone',
		at: 'I prefer allies who can count',
		alt: 'Worm’s-eye: yellow sleeve placing a black stone; magenta sleeve waiting below',
		refs: refsGo,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye ECU, shallow DOF, bokeh. ONE device: a single black go-stone as a hard disc; imperial-yellow sleeve filling the upper two-thirds from above; magenta #D8258C sleeve a thin lower bar. FACE hints only. Taizong yellow yuanlingpao from attached robe refs. Crushed black around the board. No readable grid labels. ${suffix}`
	}),
	slot({
		id: 'taizong-meet-fit',
		at: 'You asked my name, did you not.',
		alt: 'Two-shot from below: Taizong high in yellow dragon robe, Chunchu low in magenta, board between them',
		refs: refsGo,
		prompt: `Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye two-shot, dutch, chiaroscuro. Mise-en-scène: same private chamber, crushed black. ONE device: a vertical height-split — emperor on the elevated platform, guest on the floor, pale go board as the hinge. FACE from attached. Taizong full yellow dragon yuanlingpao from attached refs; Chunchu magenta wrap hanbok. Yellow #c97a2e highlights vs magenta #D8258C. They look at each other across the board. ${suffix}`
	})
];

const have = new Set((entry.images ?? []).map((im) => im.id));
const fresh = extras.filter((s) => !have.has(s.id));
const after = entry.images.findIndex((im) => im.id === 'taizong-seq-fit');
if (after < 0) throw new Error('missing taizong-seq-fit');
entry.images.splice(after + 1, 0, ...fresh);

const alreadyGo = (entry.blocks ?? []).some(
	(b) => typeof b.html === 'string' && b.html.includes('After the hall, a smaller room')
);
if (!alreadyGo) {
	const react = (entry.blocks ?? []).findIndex(
		(b) => typeof b.html === 'string' && b.html.includes('The room does not react')
	);
	const para = {
		kind: 'p',
		html: '<b>After the hall, a smaller room. A go board.</b> The emperor keeps the platform. Chunchu sits on the floor. Stones click in the dark.',
		ko: '<b>대전 다음, 작은 방. 바둑판.</b> 황제는 높은 자리에 그대로 앉는다. 춘추는 바닥에 앉는다. 어둠 속에서 돌이 맞는다.'
	};
	if (react >= 0) entry.blocks.splice(react, 0, para);
	else entry.blocks.push(para);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('inserted', fresh.map((s) => s.id).join(', ') || '(all existed)');
