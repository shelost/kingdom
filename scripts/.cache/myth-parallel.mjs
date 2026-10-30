// Retell the reality flashback (King Muyeol) over the myth's own stills:
// each myth still reappears at its beat, followed by the angle that exposes it.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entries = story.flatMap((c) => c.entries);
const bh = entries.find((e) => e.title === 'Bihyung');
const km = entries.find((e) => e.title === 'King Muyeol');
const fb = km.blocks.find((b) => b.kind === 'flashback').blocks;

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });
const findIdx = (blocks, needle) => {
	const i = blocks.findIndex((b) => JSON.stringify(b).includes(needle));
	if (i < 0) throw new Error('missing block: ' + needle);
	return i;
};
const has = (blocks, needle) => blocks.some((b) => JSON.stringify(b).includes(needle));

// ── Myth: Gildal finds Bihyung on a night walk ───────────────────────────
if (!has(bh.blocks, 'Instead a fox comes out of the reeds')) {
	const at = findIdx(bh.blocks, 'The palace · the west wall at night');
	bh.blocks.splice(
		at,
		0,
		{ kind: 'scene', label: 'The Hwangchun reeds · a walk at night', ko: '황천 갈대밭 · 밤 산책' },
		p(
			'Seventeen, then, and barefoot, walking the bank because the palace is too loud with sleeping men. The moon is behind cloud. Something in the reeds says Majesty.',
			'그러니까 열일곱, 맨발로 둑을 걷는다. 잠든 사내들 숨소리로 궁이 너무 시끄러워서. 달은 구름 뒤에 있다. 갈대 속에서 무언가가 말한다. 전하.'
		),
		p('Not Bihyung. Not ghost boy. Majesty.', '비형이 아니다. 귀신 아이도 아니다. 전하다.'),
		p(
			'He nearly runs. Instead a fox comes out of the reeds, red as a lantern, and stands up on its hind legs, and by the time it has finished standing it is a young man with a fox’s eyes. He goes down on both knees in the mud.',
			'그는 하마터면 달아난다. 대신 갈대 속에서 여우 한 마리가 나온다. 등불처럼 붉다. 뒷발로 일어서는데, 다 일어섰을 때는 여우 눈을 한 젊은이다. 그가 진흙에 두 무릎을 꿇는다.'
		),
		say('gildal', ['Majesty. Forgive me.', 'I have waited a long time to say it to the right face.'], ['전하. 용서하시오.', '맞는 얼굴에 그 말을 하려고 오래 기다렸소.']),
		say(
			'yongsu',
			['Get up— get up, are you mad? Don’t call me that. Who are you? Who sent you?', 'If anybody hears that word on this bank, they’ll hang us off the same tree.'],
			['일어나— 일어나요, 미쳤어요? 그렇게 부르지 마요. 누구예요? 누가 보냈어요?', '이 둑에서 누가 그 말 들으면 우리 둘 다 같은 나무에 매달려요.']
		),
		say(
			'gildal',
			['Nobody hears anything on this bank. We have made sure of it.', 'You are the son of the king who came back from the dead…!'],
			['이 둑에선 아무도 아무것도 못 듣소. 우리가 그리 해 두었소.', '그대는 죽었다 돌아온 임금의 아드님이시오…!']
		),
		say('yongsu', ['Why me?', 'Everyone walks right past you lot. Why do I hear you?'], ['왜 나예요?', '다들 그쪽 사람들 그냥 지나치잖아요. 근데 왜 나한텐 들려요?']),
		say(
			'gildal',
			['Because your father is one of us, young lord. A spirit.', 'The dead hear their own.'],
			['그대 아버님이 우리 쪽이기 때문이오, 도련님. 혼령이시니.', '죽은 것들은 제 핏줄 말을 알아듣소.']
		),
		say('yongsu', ['…“We”?'], ['…“우리”요?']),
		say('gildal', ['Yes, sir. There are more of us.', 'Please. Follow me…!'], ['그렇소. 우리가 더 있소.', '부디. 따라오시오…!']),
		p(
			'He follows the fox into the reeds. The song doesn’t say what he saw there. It only says he came back at dawn smiling, and went again the next night, and the next.',
			'그는 여우를 따라 갈대 속으로 들어간다. 노래는 거기서 무얼 봤는지 말하지 않는다. 새벽에 웃으며 돌아왔고, 다음 날 밤에도, 그다음 날 밤에도 또 갔다고만 한다.'
		)
	);
}

// ── Reality: the same question, the real answer ──────────────────────────
if (!has(fb, 'Deposed children hear each other in the dark')) {
	const at = findIdx(fb, 'The name lands like a stone in the water') + 1;
	fb.splice(
		at,
		0,
		say('yongsu', ['Why me?', 'Everyone walks right past you lot. Why do I hear you?'], ['왜 나예요?', '다들 그쪽 사람들 그냥 지나치잖아요. 근데 왜 나한텐 들려요?']),
		say(
			'gildal',
			['Because you are one of us, sir. They took your father’s crown and struck out your name.', 'They did the same to ours. Deposed children hear each other in the dark.'],
			['그대도 우리와 같기 때문이오. 아버님 관을 벗기고 그대 이름을 지웠지.', '우리 아비들한테도 똑같이 했소. 쫓겨난 집 자식들은 어둠 속에서 서로 알아듣소.']
		)
	);
}

// ── Myth ride: the city's view only; the tears belong to the reality ─────
const rideIdx = findIdx(bh.blocks, 'And the song remembers the part the city does not.');
bh.blocks[rideIdx] = p(
	'And the song remembers how it ended. He carried the fox through every ward of Surabol on his own horse, shouting the king’s name the whole way. Up on the Council’s balcony, an old man’s chair went over.',
	'그리고 노래는 끝을 기억한다. 그는 여우를 제 말에 싣고 서라벌 모든 동네를 돌았다. 가는 내내 임금 이름을 외치면서. 화백 누각 위에서는 늙은이 하나의 의자가 넘어갔다.'
);

// ── Images ───────────────────────────────────────────────────────────────
const byId = (list, id) => list.find((m) => m.id === id);
const mythSlot = (id) => byId(bh.images, id) ?? byId(km.images, id);

const weeping = byId(bh.images, 'bh-myth-ride-weeping');
const rideCity = byId(km.images, 'km-ride-city');
bh.images = bh.images.filter((m) => m.id !== 'bh-myth-ride-weeping' && m.id !== 'bh-myth-ride-city');
bh.images.push({ ...rideCity, id: 'bh-myth-ride-city', at: 'And the song remembers how it ended.', alt: 'Legend: the madman rides the fox through every ward while, on the Council balcony, Suulbu’s chair goes over.' });

const bow = {
	id: 'bh-myth-gildal-bow',
	ratio: 2,
	at: 'Instead a fox comes out of the reeds',
	alt: 'Legend: on a night walk in the reeds, a fox spirit stands up as a young man and kneels to Bihyung.',
	people: ['yongsu', 'gildal'],
	tempImage: '/temp/bh-myth-gildal-bow.jpg',
	inset: '/temp/km-gildal-kneel.jpg'
};
bh.images = bh.images.filter((m) => m.id !== bow.id);
bh.images.push(bow);

// Reality order: [myth still id, anchor in the flashback, reality still ids that follow it]
const pairs = [
	['bh-myth-gildal-bow', 'Something in the reeds says Majesty.', ['km-gildal-kneel']],
	['bh-myth-reeds', 'By morning the guards swear he went over the wall like a bird', []],
	['bh-myth-bow', 'By morning the guards swear he went over the wall like a bird', ['km-fake-reeds']],
	['bh-myth-bridge-night', 'Here is how a miracle is done.', ['km-fake-bridge']],
	['bh-myth-spirit-market', 'The song will say he showed her a world of ghosts', []],
	['bh-myth-lantern-bridge', 'The song will say he showed her a world of ghosts', []],
	['bh-myth-roof-lamps', 'The song will say he showed her a world of ghosts', []],
	['bh-myth-cloth-fox', 'So he does. The court is very impressed', ['km-fox-swap']],
	['bh-suulbu-cane', 'Suulbu has been counting the madman', []],
	['bh-suulbu-screen', 'Suulbu has been counting the madman', ['km-suulbu-counting']],
	['bh-myth-gildal-fox', 'Gildal hears by the second watch', ['km-gildal-drain']],
	['bh-myth-fox-hunt', 'Forty of Imjong’s riders', ['km-riders-night']],
	['bh-myth-gildal-death', 'He takes Yongsu’s wrist, very gently', ['km-knife-wrist']],
	['bh-myth-ride-city', 'From the palace wall he is very small', ['km-ride-city-weeping']]
];

const gildalKneel = {
	id: 'km-gildal-kneel',
	ratio: 2,
	alt: 'The same night from behind the reeds: a thin young man with a wooden goblin mask pushed up on his forehead kneels in the mud.',
	people: ['yongsu', 'gildal'],
	tempImage: '/temp/km-gildal-kneel.jpg'
};
const realityExtra = {
	'km-gildal-kneel': gildalKneel,
	'km-ride-city-weeping': { ...weeping, id: 'km-ride-city-weeping', alt: 'What nobody on the wall could see: the madman weeping the whole ride, the dead fox across his saddle.' }
};
delete realityExtra['km-ride-city-weeping'].inset;

const placed = new Set(pairs.flatMap(([m, , r]) => ['km-m-' + m, ...r]));
placed.add('km-ride-city');
const rest = km.images.filter((m) => !placed.has(m.id) && !m.id.startsWith('km-m-'));
const added = [];
for (const [mythId, at, realIds] of pairs) {
	const src = mythSlot(mythId);
	if (!src) throw new Error('missing myth still ' + mythId);
	const copy = { ...src, id: 'km-m-' + mythId, at, alt: 'As the song tells it: ' + src.alt.replace(/^(Legend|Myth):\s*/, '') };
	delete copy.inset;
	added.push(copy);
	for (const rid of realIds) {
		const real = byId(km.images, rid) ?? realityExtra[rid];
		if (!real) throw new Error('missing reality still ' + rid);
		added.push({ ...real, at });
	}
}
// keep the flashback's other stills, splice the pairs in where the old ones sat
km.images = [...rest, ...added];

// the myth ride carries the weeping still in its corner
const mythRide = byId(bh.images, 'bh-myth-ride-city');
mythRide.inset = '/temp/bh-myth-ride-weeping.jpg';

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('bihyung images', bh.images.length, '· king muyeol images', km.images.length, '· pairs', pairs.length);
