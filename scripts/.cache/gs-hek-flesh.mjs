import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
let raw = readFileSync(path, 'utf8');
const data = JSON.parse(raw);

function entry(title) {
	for (const ch of data) for (const e of ch.entries) if (e.title === title) return e;
	throw new Error('no ' + title);
}

function span(source, title, key) {
	const at = source.indexOf(`"title": "${title}"`);
	const re = new RegExp(`"${key}":\\s*\\[`, 'g');
	re.lastIndex = at;
	const m = re.exec(source);
	if (!m) throw new Error('no ' + key + ' ' + title);
	const bracket = source.indexOf('[', m.index);
	let depth = 0;
	let inStr = false;
	let esc = false;
	let j = bracket;
	for (; j < source.length; j++) {
		const c = source[j];
		if (inStr) {
			if (esc) esc = false;
			else if (c === '\\') esc = true;
			else if (c === '"') inStr = false;
			continue;
		}
		if (c === '"') inStr = true;
		else if (c === '[') depth++;
		else if (c === ']') {
			depth--;
			if (depth === 0) {
				j++;
				break;
			}
		}
	}
	return [bracket, j];
}

function putArray(source, title, key, value) {
	const [a, b] = span(source, title, key);
	const json = JSON.stringify(value, null, '\t').replace(/\n/g, '\n\t\t\t\t');
	return source.slice(0, a) + json + source.slice(b);
}

const INK =
	' Joseon sumi ink myth frame. Huge black ink masses against blinding bare paper. Light is the unpainted paper. Splashed ink, dry-brush flying white, one graphic device. At most one translucent colour wash, on the one symbolic object. Topknots, no brimmed hats. FULL-BLEED, no paper margin. Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. No text. No watermark.';

const HEEWON =
	' HEEWON STYLE. Minimal iconic 2:1 still, composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. Painted webtoon faces with bold ink line, watercolor-and-oil world, movie tenebrism, one hard key, crushed blacks. FACE ONLY from the attached portrait. No text. No watermark. Not photoreal.';

/* ── Goddess Supreme ── */
const gsImages = [
	{
		id: 'gs-chaos-empty',
		ratio: 2,
		time: 'night',
		alt: 'A mother holds a quiet child. No one knows how to open a soul.',
		at: 'Nobody knew how to make a soul.',
		people: ['samsin'],
		refs: ['/ch_sky_princess.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. A mother on packed earth holds a newborn that does not cry. The Sky Princess, FACE from the attached portrait, black hair with gold flowers, pale blue silk, watches from a doorway she has not stepped through. ONE device: the doorway as a dark vertical. #e8b4c8 as a single lamp catch on the silk, never a glow. Earth: timber, packed earth, natural night.' +
			HEEWON
	},
	{
		id: 'gs-life-flower',
		ratio: 2,
		time: 'day',
		alt: 'The Sky Princess finds the Life Flower that will power a soul.',
		at: 'One flower. One soul. For a whole life.',
		people: ['samsin'],
		refs: ['/ch_sky_princess.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 day still. High-key paper-white sky. The Sky Princess, FACE from the attached portrait, kneels in a western garden bed holding one open flower toward the lens. ONE device: the flower as the only colour in a pale yard. #e8b4c8 as real light on the petals, never a glow. Dynamic kneel, not a standing portrait.' +
			HEEWON
	},
	{
		id: 'gs-ink-palace',
		ratio: 2,
		style: 'ink',
		alt: 'The Sky Princess at her palace in the western heaven gardens.',
		at: 'A palace, small for heaven. The doors open on the beds.',
		people: ['samsin'],
		refs: ['/ch_sky_princess.png'],
		prompt:
			'Minimal Joseon sumi ink 2:1 still. The Sky Princess, FACE from the attached portrait, kneels on the step of a small palace with a bowl of living flowers. One device: the palace door as a tall paper-white rectangle. One translucent gold wash on the flowers only.' +
			INK
	},
	{
		id: 'gs-ink-under',
		ratio: 2,
		style: 'ink',
		alt: 'The Dragon Lady in her palace under the sea.',
		at: 'Her court is under the eastern sea.',
		people: ['yongnyeo'],
		refs: ['/ch_dragon_lady.png'],
		prompt:
			'Minimal Joseon sumi ink 2:1 still. ONE woman. The Dragon Lady, FACE from the attached portrait, stands at the dark end of an underworld palace hall with a wrapped infant. One device: the hall as a receding black wedge. One translucent blue wash on the wet floor only.' +
			INK
	},
	{
		id: 'gs-ink-wager',
		ratio: 2,
		style: 'ink',
		alt: 'Heaven–Earth King sets one flower in front of each woman.',
		at: 'He puts two flowers on the table.',
		people: ['samsin', 'heavenearthking', 'yongnyeo'],
		refs: ['/ch_sky_princess.png', '/ch_heaven_earth_king.png', '/ch_dragon_lady.png'],
		prompt:
			'Minimal Joseon sumi ink 2:1 still. Three distinct faces. LEFT Sky Princess, CENTRE Heaven–Earth King setting two flowers, RIGHT Dragon Lady. One device: the table as a hard black bar. One translucent gold wash on the flowers only.' +
			INK
	},
	{
		id: 'gs-samsin-title',
		ratio: 2,
		time: 'day',
		alt: 'He names her 삼신. Samsin.',
		at: 'You. 삼신. Samsin.',
		people: ['samsin', 'heavenearthking'],
		refs: ['/ch_samsin.png', '/ch_heaven_earth_king.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 still. LEFT face of the sheet is Samsin after the office: white hair, blue jeogori, red chima, FACE from the attached portrait, holding an open Life Flower. RIGHT is Heaven–Earth King naming her. ONE device: the flower between them as the hard key. #e8b4c8 as real light, never a glow.' +
			HEEWON
	},
	{
		id: 'gs-gusam-title',
		ratio: 2,
		time: 'night',
		alt: 'He names her 구삼신. Gusamsin.',
		at: 'You. 구삼신. Gusamsin.',
		people: ['yongnyeo'],
		refs: ['/ch_gusamsin.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. Gusamsin, FACE from the attached portrait, white braid, green eyes, dark dragon robe, turns in an underworld hall with a blackened flower in her hand. ONE device: the turned shoulder against a black hall. #1a6a8a as a wet-floor catch, never a glow.' +
			HEEWON
	},
	{
		id: 'gs-ink-fields',
		ratio: 2,
		style: 'ink',
		alt: 'The palace beds run past the wall and become the field.',
		at: 'The beds reach the wall. She opens the gate.',
		people: ['samsin'],
		refs: ['/ch_samsin.png'],
		prompt:
			'Minimal Joseon sumi ink 2:1 still. Samsin, FACE from the attached portrait, white hair, blue jeogori, red chima, kneels planting past an open palace gate. One device: the open gate as a black frame, the row a single receding line. One translucent red wash on the petals only. Nothing in her mouth.' +
			INK
	},
	{
		id: 'gs-ink-gotaso',
		ratio: 2,
		style: 'ink',
		alt: 'Kangrim brings Gotaso to Gusamsin at the underworld gate.',
		at: 'Gusamsin is at the gate of the underworld palace.',
		people: ['yongnyeo', 'kangrim', 'gotaso'],
		refs: ['/ch_gusamsin.png', '/ch_kangrim.png', '/ch_gotaso.png'],
		prompt:
			'Minimal Joseon sumi ink 2:1 still. Exactly three people. LEFT Gusamsin white braid dark robe at a black gate. CENTRE Kangrim topknot no hat. RIGHT Gotaso fourteen white silk blue sash. Tiny children beyond the gate, unarmed. One translucent blue wash inside the gate only. Three distinct faces.' +
			INK
	}
];

const gsBlocks = [
	{
		kind: 'p',
		html: 'The world was still in chaos.',
		ko: '세상은 아직 어지러웠다.'
	},
	{
		kind: 'p',
		html: 'People knew how to hold a child. Nobody knew how to make a soul.',
		ko: '사람은 아이를 안는 법은 알았다. 혼을 만드는 법은 아무도 몰랐다.'
	},
	{
		kind: 'p',
		html: 'A baby could be born and stay quiet. A mother could wait, and wait, and the breath would not open.',
		ko: '아기가 태어나서도 조용할 수 있었다. 어머니는 기다리다가, 숨이 열리지 않았다.'
	},
	{
		kind: 'p',
		html: 'Two women would fix that seat. Only one of them would keep it.',
		ko: '여자 둘이 그 자리를 고치러 온다. 자리는 하나만 남는다.'
	},
	{ kind: 'scene', label: 'The Answer', ko: '답' },
	{
		kind: 'p',
		html: 'The Sky Princess lives where the western gardens start.',
		ko: '하늘공주는 서쪽 정원이 시작되는 곳에 산다.'
	},
	{
		kind: 'p',
		html: 'A palace, small for heaven. The doors open on the beds.',
		ko: '하늘치고는 작은 궁이다. 문이 밭으로 열린다.'
	},
	{
		kind: 'p',
		html: 'She is the one who finds it.',
		ko: '그걸 찾아낸 건 그녀다.'
	},
	{
		kind: 'p',
		html: 'One flower. One soul. For a whole life.',
		ko: '꽃 하나. 혼 하나. 한평생.'
	},
	{
		kind: 'p',
		html: 'She calls it a Life Flower. 생명꽃. White petals for a boy. Red for a girl. The leaves come out in the colour you will know that child by.',
		ko: '그녀는 그걸 생명꽃이라 부른다. 흰 꽃잎은 아들. 붉은 꽃잎은 딸. 잎은 그 아이를 알아볼 색으로 나온다.'
	},
	{
		kind: 'p',
		html: 'It powers the soul from the first breath. When the flower is spent, the life is over.',
		ko: '첫 숨부터 혼에 힘을 준다. 꽃이 다하면, 목숨도 끝이다.'
	},
	{
		kind: 'dialogue',
		person: 'samsin',
		look: 'sky',
		en: ['Stay.', 'They grow if I stay.', 'Out here. Not in the bowl.'],
		lines: ['있어.', '내가 있으면 자라.', '여기. 그릇 안이 아니라.']
	},
	{ kind: 'scene', label: 'The Underworld Palace', ko: '저승 궁' },
	{
		kind: 'p',
		html: 'The Dragon Lady is the sea’s daughter. Her court is under the eastern sea.',
		ko: '용녀는 바다의 딸이다. 그녀의 궁은 동해 아래다.'
	},
	{
		kind: 'p',
		html: 'Down there, the water goes black. Pillars. A wet floor. A throne she rarely sits.',
		ko: '거기는 물이 검다. 기둥. 젖은 바닥. 좀처럼 앉지 않는 자리.'
	},
	{
		kind: 'p',
		html: 'She has been doing the births. She can put a child in. She cannot bring one out.',
		ko: '출산을 맡아 왔다. 아이를 넣기는 한다. 꺼내지는 못한다.'
	},
	{
		kind: 'p',
		html: 'A birth dies in the Dragon Lady’s hands. She does not put the child down.',
		ko: '출산 하나가 용녀의 손에서 죽는다. 그녀는 아이를 내려놓지 않는다.'
	},
	{
		kind: 'card',
		person: 'yongnyeo',
		look: 'dragon',
		caption: 'She could put a child in. She never learned the way out.',
		ko: '넣는 건 했다. 나오는 길은 끝내 몰랐다.',
		still: '/intro/yongnyeo--goddess-supreme.jpg'
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		look: 'dragon',
		en: ['I put them in.', 'The way out is still mine.'],
		lines: ['넣는 건 내가 한다.', '나오는 길도 내 것이다.']
	},
	{ kind: 'p', html: 'It was not.', ko: '아니었다.' },
	{ kind: 'scene', label: 'The Wager', ko: '내기' },
	{
		kind: 'p',
		html: 'Heaven–Earth King had already retired. He hated another meeting.',
		ko: '천지왕은 이미 물러난 몸이었다. 모이는 것도 싫었다.'
	},
	{
		kind: 'p',
		html: 'He called one anyway. He puts two flowers on the table.',
		ko: '그래도 하나를 불렀다. 상 위에 꽃 둘을 놓는다.'
	},
	{
		kind: 'dialogue',
		person: 'heavenearthking',
		en: ['I am retired.'],
		lines: ['나 물러난 몸이야.']
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		look: 'dragon',
		en: ['Then go home.'],
		lines: ['그럼 가.']
	},
	{
		kind: 'dialogue',
		person: 'heavenearthking',
		en: ['I would.', 'You keep losing them.', 'One flower each. Grow a life. Not a speech.'],
		lines: ['그러고 싶지.', '네가 계속 놓치잖아.', '하나씩. 목숨 하나를 키워. 연설 말고.']
	},
	{
		kind: 'dialogue',
		person: 'samsin',
		look: 'sky',
		en: ['Mine opens.'],
		lines: ['내 건 핀다.']
	},
	{
		kind: 'dialogue',
		person: 'heavenearthking',
		en: [
			'Not yet.',
			'On the table. Where I can see.',
			'The one that opens keeps the living. Until they are fifteen.'
		],
		lines: ['아직.', '상 위에. 내가 보게.', '핀 쪽이 산 자를 가져. 열다섯까지.']
	},
	{
		kind: 'dialogue',
		person: 'heavenearthking',
		en: ['The one that dies keeps the other door. The children who do not arrive.'],
		lines: ['죽는 쪽이 다른 문을 맡아. 도착하지 못한 애들.']
	},
	{
		kind: 'p',
		html: 'The dragon’s flower blackens on the stem. The sky’s flower opens on the stem.',
		ko: '용의 꽃은 줄기에서 검게 죽는다. 하늘의 꽃은 줄기에서 핀다.'
	},
	{
		kind: 'p',
		html: 'She watches it, and her mouth shakes once, before she smiles.',
		ko: '그녀는 보다가, 웃기 전에 입이 한 번 흔들린다.'
	},
	{ kind: 'scene', label: '삼신 · 구삼신', ko: '삼신 · 구삼신' },
	{
		kind: 'dialogue',
		person: 'heavenearthking',
		en: [
			'You. 삼신. Samsin.',
			'You open the breath. The Life Flower is yours to set.',
			'Until they are fifteen, they are yours.'
		],
		lines: ['너. 삼신.', '숨은 네가 연다. 생명꽃은 네가 놓아.', '열다섯까지는 네 아이다.']
	},
	{
		kind: 'card',
		person: 'samsin',
		write: '삼신',
		sub: '하늘공주',
		caption: 'The name the houses use, once her flower has opened.',
		ko: '그녀의 꽃이 핀 뒤에 집들이 부르는 이름.',
		still: '/intro/samsin--goddess-supreme.jpg'
	},
	{
		kind: 'p',
		html: 'The Dragon Lady’s eyes are wet. She turns before the room can see it.',
		ko: '용녀의 눈이 젖는다. 방이 보기 전에 그녀는 돌아선다.'
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		en: ['The sea stays mine.'],
		lines: ['바다는 내 거야.']
	},
	{
		kind: 'dialogue',
		person: 'heavenearthking',
		en: [
			'You. 구삼신. Gusamsin.',
			'The underworld stays yours.',
			'The ones who die before fifteen. Their souls. You keep them.'
		],
		lines: ['너. 구삼신.', '저승은 네 거야.', '열다섯 전에 죽는 애들. 그 혼은 네가 지켜.']
	},
	{
		kind: 'card',
		person: 'yongnyeo',
		write: '구삼신',
		sub: '용녀',
		caption: 'Samsin’s parallel on the dead side.',
		ko: '산 자의 삼신과 짝이 되는, 저승의 이름.',
		still: '/intro/yongnyeo--goddess-supreme.jpg'
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		en: ['Then I will learn their names.'],
		lines: ['그럼 이름은 내가 외운다.']
	},
	{
		kind: 'p',
		html: 'He lets her keep the sea. He is tired. He goes home.',
		ko: '바다는 두고 가게 한다. 그는 지쳐 있다. 집에 간다.'
	},
	{ kind: 'scene', label: 'The First Rows', ko: '첫 이랑' },
	{
		kind: 'p',
		html: 'The west was his, and it was grass.',
		ko: '서쪽은 그의 것이었고, 풀이었다.'
	},
	{
		kind: 'p',
		html: 'She takes the open flower home. She does not put it back in the bowl.',
		ko: '핀 꽃을 들고 돌아온다. 그릇에는 다시 넣지 않는다.'
	},
	{
		kind: 'p',
		html: 'She kneels in the palace bed and plants it. The Life Flowers grow better there than anywhere she has tried.',
		ko: '궁의 밭에 무릎을 꿇고 심는다. 생명꽃은 그녀가 심어 본 어디보다 거기서 잘 자란다.'
	},
	{
		kind: 'p',
		html: 'The beds reach the wall. She opens the gate.',
		ko: '밭이 담에 닿는다. 그녀는 문을 연다.'
	},
	{
		kind: 'p',
		html: 'Past the wall she plants another row. Then another. She loses count at dusk.',
		ko: '담 너머에 이랑을 하나 더 심는다. 또 하나. 해 질 녘에 수를 잊는다.'
	},
	{
		kind: 'p',
		html: 'That is the start of the western flower field. Not a decree. A gate left open.',
		ko: '서천꽃밭은 그렇게 시작된다. 명이 아니다. 열어 둔 문이다.'
	},
	{
		kind: 'dialogue',
		person: 'samsin',
		en: [
			'They like it here.',
			'I cannot walk every row and open every breath.',
			'Someone will have to stay. All day.'
		],
		lines: ['여기가 좋아하나 봐.', '숨도 열고 이랑도 다 걸을 수는 없어.', '누가 여기 남아야 해. 하루 종일.']
	},
	{ kind: 'scene', label: 'A Birth', ko: '출산' },
	{
		kind: 'p',
		html: 'A mother sleeps. Nobody in the room sees the woman who comes in.',
		ko: '어머니가 잔다. 방 안의 누구도, 들어오는 여자를 못 본다.'
	},
	{
		kind: 'p',
		html: 'She sets a red Life Flower on the belly. The baby cries. By the time someone turns the lamp, she is gone.',
		ko: '배 위에 붉은 생명꽃 하나를 놓는다. 아기가 운다. 누가 등잔을 돌릴 때쯤 그녀는 없다.'
	},
	{
		kind: 'dialogue',
		person: 'samsin',
		en: ['Don’t cry.', 'I’ll open the breath.'],
		lines: ['울지 마.', '내가 숨 열어 줄게.']
	},
	{ kind: 'scene', label: 'The Other Door', ko: '다른 문' },
	{
		kind: 'p',
		html: 'Another child does not cry. The soul sits up. The body does not.',
		ko: '다른 아이는 울지 않는다. 혼이 일어앉는다. 몸은 안 따라온다.'
	},
	{
		kind: 'p',
		html: 'A pale soul cord still runs from navel to navel. Kangrim cuts it. The cord shrivels into a flower with no colour left.',
		ko: '창백한 혼줄이 배꼽에서 배꼽으로 남아 있다. 강림이 자른다. 혼줄은 색이 없는 꽃으로 오그라든다.'
	},
	{
		kind: 'p',
		html: 'Samsin does not come for this one. Gusamsin does. Same office. The other door.',
		ko: '이 아이에게는 삼신이 오지 않는다. 구삼신이 온다. 같은 자리. 다른 문.'
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		en: ['Fifteen was not yours.', 'Come with me. The others are already playing.'],
		lines: ['열다섯은 네 것이 아니었다.', '따라와. 애들은 벌써 놀고 있어.']
	},
	{ kind: 'scene', label: 'A Girl of Fourteen', ko: '열네 살' },
	{
		kind: 'p',
		html: 'You have already met this one. She is fourteen. She does not reach fifteen.',
		ko: '이 아이는 이미 만난 아이다. 열네 살이다. 열다섯에는 닿지 못한다.'
	},
	{
		kind: 'p',
		html: 'Kangrim walks her down. The road is quiet. Then she hears children.',
		ko: '강림이 그녀를 데리고 내려간다. 길은 조용하다. 그러다 아이들 소리가 난다.'
	},
	{
		kind: 'dialogue',
		person: 'gotaso',
		en: ['They’re playing.'],
		lines: ['애들, 놀고 있어요.']
	},
	{
		kind: 'dialogue',
		person: 'kangrim',
		en: ['They have been. A long time.', 'The yard is not your road.'],
		lines: ['오래됐소. 아주.', '저 뜰은 부인의 길이 아니오.']
	},
	{
		kind: 'p',
		html: 'Gusamsin is at the gate of the underworld palace.',
		ko: '구삼신이 저승 궁의 문 앞에 있다.'
	},
	{
		kind: 'dialogue',
		person: 'gotaso',
		en: ['I heard them.'],
		lines: ['애들 소리가 들려요.']
	},
	{
		kind: 'dialogue',
		person: 'kangrim',
		en: ['Lady Gotaso. You can see the gate. That is all.'],
		lines: ['고타소 부인. 문은 봐도 되오. 거기까지요.']
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		en: ['They stay with me.', 'You were close. You go on.'],
		lines: ['애들은 나한테 있어.', '아슬아슬했어. 너는 가.']
	},
	{
		kind: 'p',
		html: 'Gotaso looks into the yard. She does not ask for a name. She nods.',
		ko: '고타소가 뜰을 본다. 이름을 묻지 않는다. 고개를 끄덕인다.'
	},
	{
		kind: 'dialogue',
		person: 'yongnyeo',
		en: ['I’ll keep the count.'],
		lines: ['수는 내가 센다.']
	},
	{
		kind: 'dialogue',
		person: 'kangrim',
		en: ['This way.'],
		lines: ['이쪽으로.']
	},
	{
		kind: 'p',
		html: 'The houses stop saying Sky Princess. They say 삼신. Grandmothers, who like a longer name, say 삼신할망.',
		ko: '집들은 하늘공주라 하지 않게 된다. 삼신이라 한다. 할매들은 더 긴 이름을 좋아해서 삼신할망이라 한다.'
	},
	{ kind: 'scene', label: 'The Kitchen Garden', ko: '채소밭' },
	{
		kind: 'p',
		html: 'Morning. Yuri Dora is thinning seedlings. Gyebek holds the basket and does not help.',
		ko: '아침. 유리도라가 모를 솎고 있다. 계백은 바구니를 들고 돕지 않는다.'
	},
	{
		kind: 'dialogue',
		person: 'gyebek',
		en: ['She said someone has to stay.'],
		lines: ['누가 남아야 한다고 했소.']
	},
	{ kind: 'dialogue', person: 'yuridora', en: ['All day.'], lines: ['하루 종일.'] },
	{ kind: 'dialogue', person: 'gyebek', en: ['A gardener.'], lines: ['정원사.'] },
	{
		kind: 'dialogue',
		person: 'yuridora',
		en: ['Tomorrow.', 'Eat.'],
		lines: ['내일.', '먹어.']
	},
	{
		kind: 'p',
		html: '<b>She has the rows. She does not have the one who will stay and keep them…!</b>',
		ko: '<b>이랑은 있다. 남아 지킬 사람은 아직 없다…!</b>'
	}
];

for (const im of gsImages) {
	const hit = gsBlocks.some(
		(b) =>
			(b.html && b.html.includes(im.at)) ||
			(b.en && b.en.some((line) => line.includes(im.at))) ||
			(b.write && im.at.includes(b.write))
	);
	if (!hit) throw new Error('gs at missing ' + im.at);
}
for (const b of gsBlocks) {
	if (b.kind === 'dialogue' && b.en.length !== b.lines.length) throw new Error('gs len ' + b.person);
}

const gs = entry('Goddess Supreme');
gs.blocks = gsBlocks;
gs.images = gsImages;
gs.logline = {
	en: 'The world did not know how to make a soul. The Sky Princess finds the Life Flower. Heaven–Earth King names her 삼신, and the sea’s daughter 구삼신.',
	ko: '세상은 혼을 만드는 법을 몰랐다. 하늘공주가 생명꽃을 찾아낸다. 천지왕은 그녀를 삼신이라 부르고, 바다의 딸을 구삼신이라 부른다.'
};
gs.cast = ['samsin', 'yongnyeo', 'heavenearthking', 'kangrim', 'gotaso', 'yuridora', 'gyebek'];

/* ── HEK Warm Side + Dead Side expansion ── */
const hek = entry('Heaven–Earth King');
const warmAt = hek.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Warm Side');
const fieldAt = hek.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Field Wall');
if (warmAt < 0 || fieldAt < 0) throw new Error('hek scenes missing');

const hekMid = [
	{ kind: 'scene', label: 'The Warm Side', ko: '이승' },
	{
		kind: 'p',
		html: 'Little Star walks into the heat like a man who just won a house.',
		ko: '소별은 집을 막 딴 사람처럼 더위 속으로 걸어 들어간다.'
	},
	{
		kind: 'p',
		html: 'The white robe comes off. He puts on the red marks of the living.',
		ko: '흰 옷을 벗는다. 산 자의 붉은 무늬를 입는다.'
	},
	{
		kind: 'card',
		person: 'sobyeol',
		from: 'young',
		look: 'king',
		caption: 'Lord of the Living. The stolen flower. The warm side.',
		ko: '이승임금. 훔친 꽃. 따뜻한 쪽.',
	},
	{
		kind: 'p',
		html: 'One sun still going. The other is a hole in the sky. He likes this better already.',
		ko: '해는 아직 하나 간다. 다른 하나는 하늘의 구멍이다. 벌써 이게 낫다.'
	},
	{
		kind: 'p',
		html: 'He sits on a hill like a king. The hill doesn’t notice.',
		ko: '언덕에 임금처럼 앉는다. 언덕은 모른다.'
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: ['Hey.', 'You still going?'],
		lines: ['야.', '아직 가?']
	},
	{
		kind: 'p',
		html: 'The one still flying doesn’t stop. He has a schedule. Long white hair, no interest in a new king on a hill.',
		ko: '아직 나는 놈은 멈추지 않는다. 시간표가 있다. 흰 머리 길게, 언덕의 새 임금 따위엔 관심 없다.'
	},
	{
		kind: 'dialogue',
		person: 'haemosu',
		en: ['Somebody has to.'],
		lines: ['누가 안 가면.']
	},
	{
		kind: 'p',
		html: 'Little Star holds up his father’s five-dragon chariot. Gold. Jade. Azure. Crimson. White.',
		ko: '소별이 아버지의 오룡거를 든다. 금. 비취. 푸른빛. 다홍. 흰빛.'
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: ['Take it.', 'Keep the sky on time.', 'I have enough to do on the ground.'],
		lines: ['가져.', '하늘 시간 맞춰.', '땅 일도 많아.']
	},
	{
		kind: 'p',
		html: 'Haemosu takes the rail. The schedule finally has a name.',
		ko: '해모수가 난간을 잡는다. 시간표에 비로소 이름이 붙는다.'
	},
	{ kind: 'scene', label: 'Ten Regions', ko: '열 나라' },
	{
		kind: 'p',
		html: 'The living side is a mess. Too many peoples. Too many wars. Ghosts still walking the same road.',
		ko: '이승은 엉망이다. 겨레가 너무 많다. 싸움이 너무 많다. 귀신도 아직 같은 길을 걷는다.'
	},
	{
		kind: 'p',
		html: 'Little Star cuts the warm side into ten regions. One for each people.',
		ko: '소별이 따뜻한 쪽을 열로 가른다. 겨레마다 하나.'
	},
	{
		kind: 'p',
		html: 'Huaxia. Yamato. Tobun. Cheonchuk. Daesik. Persia. Bullim. The southern seas. The northern nomads.',
		ko: '화하. 왜. 토번. 천축. 대식. 파사. 불림. 남쪽 바다. 북쪽 초원.'
	},
	{
		kind: 'p',
		html: 'And Samhan. A mountain peninsula. He puts it right next to the plot where his flowers are planted.',
		ko: '그리고 삼한. 산이 많은 반도. 그가 꽃을 심은 밭 바로 옆에 둔다.'
	},
	{
		kind: 'p',
		html: 'That plot will be an island later. You already know the name. Not yet.',
		ko: '그 밭은 나중에 섬이 된다. 이름은 이미 안다. 아직은 아니다.'
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: ['Stay in your own yard.', 'Fight each other if you must.', 'Stay off my flowers.'],
		lines: ['네 마당에 있어.', '싸울 거면 알아서 싸워.', '내 꽃에는 손대지 마.']
	},
	{
		kind: 'p',
		html: 'Then he drives the spirits out.',
		ko: '그리고 귀신을 쫓아낸다.'
	},
	{
		kind: 'p',
		html: 'Every ghost that still walks the warm road is pushed down the dark edge. The most violent ones he seats at the border, so the rest think twice about crawling back.',
		ko: '따뜻한 길을 아직 걷는 귀신은 어두운 끝으로 밀어 내린다. 그중 가장 사나운 것들을 경계에 앉혀 둔다. 나머지는 다시 기어 올라올 생각을 두 번 하게.'
	},
	{
		kind: 'p',
		html: 'A pine at the foot of the hill already has an opinion.',
		ko: '언덕 아래 소나무가 벌써 할 말이 있다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A pine',
		en: ['Nice flower.'],
		lines: ['꽃 잘 골랐다.']
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: ['What.'],
		lines: ['뭐.']
	},
	{
		kind: 'dialogue',
		speaker: 'A pine',
		en: ['The stolen one.'],
		lines: ['훔친 거.']
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: ['Trees.', 'Fine. I can live with trees.'],
		lines: ['나무는 괜찮아.', '나무는 살 수 있어.']
	},
	{
		kind: 'p',
		html: 'He hasn’t thought about ghosts answering a mother’s call yet. You’ll see.',
		ko: '어머니가 불러도 귀신이 대답하는 일은 아직 생각 안 했다. 곧 한다.'
	},
	{ kind: 'scene', label: 'The Dark Road', ko: '저승길' },
	{
		kind: 'p',
		html: 'On the way down, Big Star passes his mother’s house. The rice is still on. Smoke from the pot. He does not stop.',
		ko: '내려가는 길에 대별은 어머니 집을 지난다. 밥은 아직 올려져 있다. 솥에서 김. 멈추지 않는다.'
	},
	{
		kind: 'p',
		html: 'The dark edge is not a gate. It’s a road that forgets colour as it goes.',
		ko: '어두운 끝은 문이 아니다. 갈수록 색을 잊는 길이다.'
	},
	{
		kind: 'p',
		html: 'Halfway down, something is still burning.',
		ko: '반쯤 내려가니, 아직 타고 있는 것이 있다.'
	},
	{ kind: 'scene', label: 'The Fallen Sun', ko: '떨어진 해' },
	{
		kind: 'p',
		html: 'A sun deity sits against a black rock, shorter-haired than the one still flying, same bones, same white robe torn at the chest. A golden arrow is in him. Noon’s leftover.',
		ko: '해의 신이 검은 바위에 기대 앉아 있다. 아직 나는 놈보다 머리가 짧고, 뼈대는 같고, 흰 옷은 가슴이 찢겼다. 금빛 화살이 박혀 있다. 한낮의 나머지.'
	},
	{
		kind: 'dialogue',
		person: 'haewonmek',
		en: ['…You.'],
		lines: ['……너냐.']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		en: ['You’re still burning.'],
		lines: ['아직 타고 있구나.']
	},
	{
		kind: 'dialogue',
		person: 'haewonmek',
		en: ['You drew.', 'The long-haired one kept flying.'],
		lines: ['네가 쐈지.', '긴 머리 놈은 아직 난다.']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		en: ['Can you walk.'],
		lines: ['걸을 수 있어.']
	},
	{
		kind: 'dialogue',
		person: 'haewonmek',
		en: ['I fell from noon.', 'I can walk anything.'],
		lines: ['정오에서 떨어졌다.', '어디든 걷지.']
	},
	{
		kind: 'p',
		html: 'Big Star looks at the hole the arrow made, then at the road that still has no clerks.',
		ko: '대별은 화살이 낸 구멍을 본다. 그리고 아직 차사 없는 길을 본다.'
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		en: ['People will die up there.', 'Someone has to take them down.', 'I can’t be on every road.'],
		lines: ['위에선 사람이 죽을 거다.', '누군가는 데려와야 해.', '내가 모든 길에 있을 순 없어.']
	},
	{
		kind: 'dialogue',
		person: 'haewonmek',
		en: ['You shot me.'],
		lines: ['날 쐈잖아.']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		en: ['And now I’m offering you a job.'],
		lines: ['그래서 일을 주는 거다.']
	},
	{
		kind: 'p',
		html: 'The fallen sun laughs once, which hurts, and then he listens.',
		ko: '떨어진 해가 한 번 웃는다. 아프다. 그리고 듣는다.'
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		en: ['Walk them from life to death.', 'I’ll call you Haewonmek.'],
		lines: ['산 자에서 죽은 자로.', '이름은 해원맥이다.']
	},
	{
		kind: 'dialogue',
		person: 'haewonmek',
		en: ['…해.'],
		lines: ['……해.']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		en: ['Keep it. You’ll need it, down there.'],
		lines: ['남겨. 아래선 그게 필요할 거다.']
	},
	{
		kind: 'card',
		person: 'haewonmek',
		caption: 'The other 해. Shot down at noon. Walks the night now.',
		ko: '다른 해. 한낮에 떨어졌다. 이젠 밤길을 걷는다.',
		still: 'https://pub-5124ab5db2944603a07562ea9fafdd76.r2.dev/intro/haewonmek--buyeo.jpg?v=1794205277633'
	},
	{
		kind: 'p',
		html: 'Ink takes the white robe first. Then a brim. Then the mouth, and nothing above it.',
		ko: '먹이 흰 옷부터 먹는다. 그다음 모자 챙. 그다음 입. 그 위는 없다.'
	},
	{ kind: 'scene', label: 'The Dead Side', ko: '저승' },
	{
		kind: 'p',
		html: 'The dead side is almost empty.',
		ko: '저승은 거의 비어 있다.'
	},
	{
		kind: 'p',
		html: 'A barren waste. No roofs. No roads worth the name. Every spirit that could crawl had already crawled up into the warm side. That was half the problem their father never finished.',
		ko: '거친 황무지다. 지붕도 없다. 길이라 할 것도 없다. 기어 올라갈 수 있는 귀신은 이미 따뜻한 쪽으로 다 올라갔다. 아버지가 못 끝낸 문제의 절반이 그것이었다.'
	},
	{
		kind: 'p',
		html: 'Big Star hangs an empty bench in the dark, and sits on it once, to see if it holds.',
		ko: '대별은 어둠에 빈 걸상을 달고, 한 번 앉아 본다. 버티는지.'
	},
	{
		kind: 'p',
		html: 'The white of the wager years comes off. He puts on the black silk of the dead.',
		ko: '내기 때의 흰 옷을 벗는다. 죽은 자의 검은 비단을 입는다.'
	},
	{
		kind: 'card',
		person: 'daebyeol',
		from: 'young',
		look: 'king',
		caption: 'Lord of the Dead. The better flower. The dark side.',
		ko: '저승임금. 더 잘 핀 꽃. 어두운 쪽.',
	},
	{
		kind: 'p',
		html: 'Then he finds one man.',
		ko: '그러다 사내 하나를 본다.'
	},
	{
		kind: 'p',
		html: 'The first man to die. He stayed. He did not try the warm road again.',
		ko: '맨 먼저 죽은 사내. 그는 남았다. 따뜻한 길을 다시 시도하지 않았다.'
	},
	{
		kind: 'dialogue',
		person: 'yumla',
		look: 'first',
		en: ['I died.', 'That was enough.'],
		lines: ['죽었다.', '그걸로 됐다.']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		look: 'king',
		en: ['You stayed.', 'That is rarer than dying.'],
		lines: ['남았구나.', '죽는 것보다 드문 일이다.']
	},
	{
		kind: 'p',
		html: 'Big Star cuts his hair. Puts a black robe on him. An orange-red lower silk. A bead necklace. A small white skull at the crown.',
		ko: '대별이 머리를 깎아 준다. 검은 도포를 입힌다. 다홍빛 아랫단. 염주. 정수리에 작은 흰 해골.'
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		look: 'king',
		en: ['Stand up.', 'I’ll call you Yumla.', 'You keep the minutes.'],
		lines: ['일어서.', '이름은 염라다.', '기록은 네가 맡아.']
	},
	{
		kind: 'card',
		person: 'yumla',
		from: 'first',
		look: 'judge',
		caption: 'The first man who stayed. Now the judge.',
		ko: '남았던 첫사람. 이제는 판관.',
	},
	{ kind: 'scene', label: 'Ten Hells', ko: '십대지옥' },
	{
		kind: 'p',
		html: 'They do not leave the waste as they found it.',
		ko: '황무지를 본 그대로 두지 않는다.'
	},
	{
		kind: 'p',
		html: 'Big Star and Yumla split the underworld into ten hells. One court for each of the ten peoples above.',
		ko: '대별과 염라가 저승을 열 지옥으로 가른다. 위의 열 겨레마다 법정 하나.'
	},
	{
		kind: 'p',
		html: 'They walk the quiet souls. The ones who stayed. The ones who told the truth late. Worthy enough for a seat.',
		ko: '조용한 혼들을 걷는다. 남았던 이들. 늦게라도 진실을 말한 이들. 자리 하나 맡을 만하다.'
	},
	{
		kind: 'p',
		html: 'Ten of them take a court. The Ten Kings. Yumla takes the fifth, the one that mirrors Samhan.',
		ko: '그중 열이 법정을 맡는다. 시왕. 염라는 다섯 번째, 삼한을 비추는 자리를 맡는다.'
	},
	{
		kind: 'dialogue',
		person: 'yumla',
		en: ['Clear law.', 'That’s all.'],
		lines: ['맑은 법.', '그게 다다.']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		look: 'king',
		en: ['Clear law.', 'And a road that remembers who came down.'],
		lines: ['맑은 법.', '그리고 누가 내려왔는지 기억하는 길.']
	},
	{
		kind: 'p',
		html: 'Two brothers. Two suns. A warm hill cut into ten, and a dark road cut into ten. Nobody waves.',
		ko: '형제 둘. 해 둘. 열로 가른 따뜻한 언덕, 열로 가른 어두운 길. 아무도 손 흔들지 않는다.'
	},
	{
		kind: 'p',
		html: 'Up there, Little Star is still arguing with a pine.',
		ko: '위에선 소별이 아직 소나무와 다투고 있다.'
	},
	{
		kind: 'p',
		html: 'It goes the way his brother said, and worse, because Little Star had never thought about the parts he didn’t want. The trees still talk. So do the birds, the cattle and the stones, mostly about him. When a mother calls her son’s name at dusk a ghost answers too. He still cannot tell who is who.',
		ko: '형이 말한 대로 된다. 그보다 더하다. 소별은 원하지 않는 쪽은 생각도 안 했으니까. 나무는 아직 말한다. 새와 소와 돌도, 대개 그 얘길 한다. 해 질 녘에 어머니가 아들 이름을 부르면 귀신도 대답한다. 그는 아직 누가 누군지 모른다.'
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: [
			'Brother.',
			'Brother, help me, just this once.',
			'The trees talk. The ghosts answer. I can’t tell who’s a man and who’s a ghost.'
		],
		lines: [
			'형님.',
			'형님, 한 번만 도와주오.',
			'나무가 말을 하오. 귀신이 대답을 하오. 누가 사람이고 누가 귀신인지 모르겠소.'
		]
	},
	{
		kind: 'p',
		html: 'Big Star comes up. He scatters five measures of pine-bark powder over the world, and the trees and the birds and the cattle go quiet and have stayed quiet since. Then he hangs a scale from the sky.',
		ko: '대별왕이 올라온다. 송피 가루 닷 말을 세상에 뿌리자 나무와 새와 짐승이 입을 다물고, 그 뒤로 다물었다. 그리고 하늘에 저울을 단다.'
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		look: 'king',
		en: ['Line up.', 'A hundred geun or more, you stay up here.', 'Less, you come with me.'],
		lines: ['줄 서.', '백 근 넘으면 이승에 남아라.', '못 넘으면, 따라와.']
	},
	{
		kind: 'dialogue',
		person: 'sobyeol',
		look: 'king',
		en: ['……And the thieves? The ones who kill people?'],
		lines: ['……그럼 도둑은? 사람 죽이는 놈들은?']
	},
	{
		kind: 'dialogue',
		person: 'daebyeol',
		look: 'king',
		en: ['Those are your flower.'],
		lines: ['그건 네 꽃이다.']
	},
	{
		kind: 'p',
		html: 'He goes back down with the light ones following him in a long quiet line. Since then the dead weigh less than the living, the law below runs clear, and the law up here belongs to Little Star. Under Big Star, <b>Yumla</b> judges, and the Ten Kings keep the minutes.',
		ko: '그는 가벼운 것들을 긴 줄로 데리고 다시 내려간다. 그 뒤로 죽은 자는 산 자보다 가볍고, 아래의 법은 맑고, 위의 법은 소별의 것이다. 대별 아래에서는 <b>염라</b>가 판결하고, 시왕이 기록을 지킨다.'
	},
	{
		kind: 'p',
		html: 'So the house was divided, and it has stayed divided. Downstairs, the dead, and a judge with honest measures. Upstairs, the living, and a king who got there with a stolen flower. Out at the far western end there is a flower field. That is a story for another night.',
		ko: '집은 그렇게 갈라졌고, 갈라진 채로 있다. 아래는 죽은 자와, 저울이 바른 판관. 위는 산 자와, 훔친 꽃으로 올라온 임금. 서쪽 맨 끝에 꽃밭이 있다. 그건 다른 밤의 이야기다.'
	},
	{
		kind: 'p',
		html: 'Above all of it sits the oldest lord of the sky. He will tell you he never interferes. He says it with a straight face. He has had a great deal of practice.',
		ko: '그 모든 것 위에 하늘의 가장 늙은 어른이 앉아 있다. 그는 자기가 절대 끼어들지 않는다고 말할 것이다. 얼굴색 하나 안 바꾸고 말한다. 연습을 아주 많이 했다.'
	},
	{
		kind: 'p',
		html: 'As for the Lady of Wisdom, she kept the rice on, the way she said she would. Nobody in this story remembers to go back down and tell her how it went. Somebody should have.',
		ko: '총명아기는 말한 대로 밥을 안쳐 두었다. 이 이야기에서 다시 내려가 어떻게 됐는지 일러 준 이는 아무도 없다. 누군가는 그랬어야 했다.'
	}
];

for (const b of hekMid) {
	if (b.kind === 'dialogue' && b.en && b.lines && b.en.length !== b.lines.length) {
		throw new Error('hek len ' + (b.person || b.speaker));
	}
}

hek.blocks = [...hek.blocks.slice(0, warmAt), ...hekMid, ...hek.blocks.slice(fieldAt)];

// new HEK stills (append if missing)
const hekNew = [
	{
		id: 'hek-ten-regions',
		ratio: 2,
		time: 'day',
		alt: 'Little Star cuts the living world into ten regions, Samhan by the flower plot.',
		at: 'And Samhan. A mountain peninsula.',
		people: ['sobyeol'],
		refs: ['/ch_little_star.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 day still. High-key pale sky. Little Star as Lord of the Living, FACE from the attached portrait, white silk with red marks, stands on a ridge looking over a mountain peninsula beside a small flower plot. ONE device: the ridge as a hard diagonal. Tiny distant peoples as ink dots only. #C94040 as hard key on the red marks, never a glow.' +
			HEEWON
	},
	{
		id: 'hek-first-man',
		ratio: 2,
		time: 'night',
		alt: 'Big Star finds the first man who stayed dead.',
		at: 'Then he finds one man.',
		people: ['daebyeol', 'yumla'],
		refs: ['/ch_big_star.png', '/ch_first_man.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. LEFT face of the sheet is Big Star in black silk and ice-blue sash. RIGHT is the First Man: long unkempt hair, ragged cloth, from the attached first-man portrait. Empty wasteland. ONE device: the empty bench between them. #3B6FBF as a hard key, never a glow. Two distinct faces.' +
			HEEWON
	},
	{
		id: 'hek-yumla-named',
		ratio: 2,
		time: 'night',
		alt: 'Big Star names the first man Yumla.',
		at: 'I’ll call you Yumla.',
		people: ['daebyeol', 'yumla'],
		refs: ['/ch_big_star.png', '/ch_yumla.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. LEFT Big Star in black silk. RIGHT Yumla newly dressed: grey beard, black robe, orange-red lower silk, skull ornament, FACE from the attached portrait. ONE device: Big Star’s hand on the new collar. #3B6FBF as hard key, never a glow.' +
			HEEWON
	},
	{
		id: 'hek-ten-hells',
		ratio: 2,
		time: 'night',
		alt: 'Ten courts rise in the underworld.',
		at: 'Big Star and Yumla split the underworld into ten hells.',
		people: ['daebyeol', 'yumla'],
		refs: ['/ch_big_star.png', '/ch_yumla.png'],
		prompt:
			'HEEWON STYLE. Minimal iconic 2:1 night still. Worm’s-eye of ten dark court gates in a barren underworld, tiny. Big Star and Yumla small in the lower third. ONE device: ten vertical gate slits. #3B6FBF and a single orange-red accent on Yumla’s hem. No army catalog. No readable text.' +
			HEEWON
	}
];

const have = new Set(hek.images.map((i) => i.id));
for (const im of hekNew) {
	if (!have.has(im.id)) hek.images.push(im);
}

raw = putArray(raw, 'Goddess Supreme', 'blocks', gsBlocks);
raw = putArray(raw, 'Goddess Supreme', 'images', gsImages);
raw = putArray(raw, 'Goddess Supreme', 'cast', gs.cast);
raw = putArray(raw, 'Heaven–Earth King', 'blocks', hek.blocks);
raw = putArray(raw, 'Heaven–Earth King', 'images', hek.images);

// logline: replace the whole object after the title
function putField(source, title, key, value) {
	const at = source.indexOf(`"title": "${title}"`);
	const re = new RegExp(`"${key}":\\s*`);
	re.lastIndex = at;
	const m = re.exec(source);
	if (!m) throw new Error('no field ' + key);
	const start = m.index + m[0].length;
	let end = start;
	if (source[start] === '{') {
		let depth = 0;
		let inStr = false;
		let esc = false;
		for (let j = start; j < source.length; j++) {
			const c = source[j];
			if (inStr) {
				if (esc) esc = false;
				else if (c === '\\') esc = true;
				else if (c === '"') inStr = false;
				continue;
			}
			if (c === '"') inStr = true;
			else if (c === '{') depth++;
			else if (c === '}') {
				depth--;
				if (depth === 0) {
					end = j + 1;
					break;
				}
			}
		}
	} else if (source[start] === '"') {
		end = start + 1;
		while (end < source.length) {
			if (source[end] === '\\') {
				end += 2;
				continue;
			}
			if (source[end] === '"') {
				end++;
				break;
			}
			end++;
		}
	} else throw new Error('bad field ' + key);
	return source.slice(0, start) + JSON.stringify(value, null, '\t').replace(/\n/g, '\n\t\t\t') + source.slice(end);
}

raw = putField(raw, 'Goddess Supreme', 'logline', gs.logline);

const check = JSON.parse(raw);
const g = check.flatMap((c) => c.entries).find((e) => e.title === 'Goddess Supreme');
const h = check.flatMap((c) => c.entries).find((e) => e.title === 'Heaven–Earth King');
if (!g.blocks[0].html.includes('chaos') && !g.blocks[0].html.includes('Chaos') && !g.blocks[0].html.includes('어지러')) {
	// English "chaos"
}
if (!g.blocks.some((b) => b.html && b.html.includes('Life Flower'))) throw new Error('life flower missing');
if (!g.blocks.some((b) => b.en && b.en.some((l) => l.includes('삼신')))) throw new Error('samsin title missing');
if (!h.blocks.some((b) => b.html && b.html.includes('ten regions'))) throw new Error('ten regions missing');
if (!h.blocks.some((b) => b.html && b.html.includes('first man'))) throw new Error('first man missing');
if (!h.blocks.some((b) => b.kind === 'card' && b.person === 'yumla')) throw new Error('yumla card missing');

writeFileSync(path, raw);
console.log('goddess', g.blocks.length, g.images.length);
console.log('hek', h.blocks.length, h.images.length);
console.log('gs scenes', g.blocks.filter((b) => b.kind === 'scene').map((b) => b.label).join(' | '));
console.log('hek has ten hells', h.blocks.some((b) => b.label === 'Ten Hells'));
