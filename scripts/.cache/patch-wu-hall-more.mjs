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

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

function slot(o) {
	return {
		ratio: 1.778,
		nsfw: false,
		tone: '#e879a6',
		refs: ['/ch_wu_zetian.png', '/ch_chunchu.png'],
		people: ['wuzetian', 'chunchu'],
		...o
	};
}

const entry = findEntry('Death of the Second Emperor');
const blocks = entry.blocks;

const qIdx = blocks.findIndex(
	(b) => b.kind === 'dialogue' && b.person === 'chunchu' && (b.en ?? []).join(' ') === '?'
);
if (qIdx >= 0 && !blocks.slice(qIdx, qIdx + 2).some((b) => text(b).includes('He turns in the dark'))) {
	blocks.splice(qIdx + 1, 0, {
		kind: 'p',
		html: '<b>He turns in the dark.</b>',
		ko: '<b>어둠에서 돌아본다.</b>'
	});
}

const whisper = entry.images.find((im) => im.id === 'wu-farewell-whisper');
if (whisper) {
	whisper.at = 'leans over to his ear';
	whisper.alt = 'Wu on her toes at Chunchu’s ear; he is already going still';
	whisper.prompt =
		'Night Daming flying corridor. She whispers in his ear. Long shadows. Bright silk rims. No lanterns. No text. No watermark.';
}

const extras = [
	slot({
		id: 'wu-hall-call',
		at: 'Chunchu!',
		alt: 'Low angle: pale Wu calling his name down the dark flying corridor',
		prompt: 'Dramatic low-angle. She calls. Long shadows. Bright red silk. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-turn',
		at: 'He turns in the dark',
		alt: 'Chunchu turning in the dark, white hanbok catching a hard rim, question on his face',
		prompt: 'Over-shoulder turn. Question face. Long shadow. Bright white silk. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-she',
		at: 'that wasn’t my question',
		alt: 'Wu stepping into his space: How is she — the person, not the throne',
		prompt: 'She leans in. He caught. Long shadows. Bright silk. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-oh',
		at: 'She is doing well',
		alt: 'Close: Chunchu’s knowing smile — he has understood which she she meant',
		prompt: 'Close his smile. Bright white-magenta silk. Corridor dark. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-message',
		at: 'Can you deliver her a message',
		alt: 'Worm’s-eye: Wu delivering the message; both throw long shadows on brick',
		prompt: 'Worm’s-eye. Fierce Wu. Him listening. Long shadows. Bright silk. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-who',
		at: 'W-who did you say you were again',
		alt: 'Chunchu astonished, stammering who; her red silk a hard edge in the dark',
		prompt: 'His astonished face. Her red edge. Long shadows. Bright silk. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-stun',
		at: 'paralyzed in fear',
		alt: 'After the whisper: Chunchu frozen wide-eyed; long shadows down the corridor',
		prompt: 'He is stunned frozen. Wide eyes. Long shadows. Bright silk. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-wave',
		at: 'waves back flirtatiously',
		alt: 'She waves; he is already a small fleeing figure with a long shadow',
		prompt: 'She waves. He flees small. Long shadows. Bright silk. No text. No watermark.'
	})
];

const have = new Set(entry.images.map((im) => im.id));
const after = entry.images.findIndex((im) => im.id === 'wu-hall-05-silence');
const insertAt = after < 0 ? entry.images.length : after + 1;
entry.images.splice(insertAt, 0, ...extras.filter((s) => !have.has(s.id)));

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('wu-hall-more slots', extras.filter((s) => !have.has(s.id)).map((s) => s.id).join(', '));
