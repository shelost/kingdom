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
	if (b.kind === 'scene' || b.kind === 'day') return `${b.label ?? ''} ${b.ko ?? ''}`;
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipP = '#7aa8d8';
const chipG = '#8a8a94';

function spliceAfter(needle, blocks) {
	const i = daeya.blocks.findIndex((b) => text(b).includes(needle));
	if (i < 0) throw new Error(`no block: ${needle}`);
	daeya.blocks.splice(i + 1, 0, ...blocks);
}

const garrison = [
	{
		kind: 'scene',
		label: 'INSIDE THE FORTRESS',
		ko: '성 안'
	},
	{
		kind: 'p',
		html: 'Before the True Bone’s horse is even a rumour, the inside of Daeya already has a weather, and the weather is her. <b>The well-post learns her hip first.</b> Packed earth. Timber eaves. Men who were hauling grain forget the grain.',
		ko: '진골의 말이 소문도 되기 전에, 대야 안에는 이미 날씨가 있고, 그 날씨는 그녀다. <b>우물 기둥이 허리를 먼저 배운다.</b> 다진 흙. 나무 처마. 곡식을 나르던 사내들이 곡식을 잊는다.'
	},
	{
		kind: 'dialogue',
		chip: chipG,
		speaker: '🗣',
		lines: ['저 가슴… 아니 허리.', '둘 다야. 둘 다.', '검일 마누라인데 왜 저렇게—'],
		en: ['That chest— no, the waist.', 'Both. It’s both.', 'That’s Gumil’s wife. Why is she built like—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She does not look at them. She places a hand on the red sash as if it had slipped, and it has not slipped. <b>The storehouse door is a dark mouth.</b> Yellow sleeves in the shadow forget they have wives in the family rooms. Thirty-one. The silk is poor. The body is not.',
		ko: '그들을 보지 않는다. 붉은 끈이 흘러내린 것처럼 손을 올리는데, 흘러내린 적이 없다. <b>창고 문이 어두운 입이다.</b> 그늘의 노란 소매들이, 가족 전각에 아내가 있는 줄을 잊는다. 서른하나. 비단은 가난하다. 몸은 아니다.'
	},
	{
		kind: 'dialogue',
		chip: chipG,
		speaker: '🗣',
		lines: ['손 봐. 일부러야.', '그곳… 생각하면 안 되는데.', '생각하면 더 해.'],
		en: ['Watch the hand. That’s on purpose.', 'Down there… I shouldn’t.', 'That’s why I do.']
	},
	{
		kind: 'p',
		html: 'On the inner stair she lets the jeogori fall another finger. Gold lamp. Charcoal timber. <b>The post takes the silhouette.</b> They will tell themselves they were looking at the lamp. They were looking at the curve under the ochre.',
		ko: '안쪽 계단에서 저고리를 손가락 하나만큼 더 내린다. 금빛 등. 숯빛 나무. <b>기둥이 실루엣을 받는다.</b> 등잔을 봤다고 할 것이다. 황토 아래 곡선을 본 것이다.'
	}
];

const hellfire = [
	{
		kind: 'p',
		html: 'The feast is not a private room. It is every man in Daeya and the families they brought — yellow sleeves, children at the low tables, a pink silk at the far end of the True Bone’s own bench that he will not look at because looking would make him a husband. He looks at the lamp-line instead. <b>The families are still eating.</b> She is already working.',
		ko: '잔치는 밀실이 아니다. 대야의 사내들과 데려온 식구들이다 — 노란 소매, 낮은 상의 아이들, 진골 자리 먼 끝의 분홍 비단. 그는 거기를 보지 않는다. 보면 남편이 되니까. 등잔 줄을 본다. <b>식구들은 아직 먹고 있다.</b> 그녀는 이미 일하고 있다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She does it in public the way she does it in a dark room. A plum from a tray. A hand on her own hip, then on the sash, then — as if by accident — at the inner thigh where the ochre splits when she sits. <b>She has practised this.</b> The boy in ice-blue counts without meaning to. Twenty-four. The training does not cover a woman who knows where to put her hands.',
		ko: '어두운 방에서 하듯 사람들 앞에서 한다. 쟁반의 자두. 제 허리에 손, 끈에 손, 그리고 — 실수인 척 — 앉으면 황토가 갈라지는 허벅지 안쪽에. <b>연습한 것이다.</b> 얼음빛 소년이 세고 있다, 셀 생각이 없는데. 스물넷. 훈련은 손 둘 곳을 아는 여자를 다루지 않는다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['자두— 아, 입이야, 잔이 아니고.', '손? 여기. 일부러야.', '스물넷이 다 보이네.'],
		en: [
			'The plum— ah, it’s the mouth, not the cup.',
			'The hand? Here. I meant that.',
			'Twenty-four and you can see all of it.'
		]
	},
	{
		kind: 'monologue',
		nsfw: true,
		person: 'pumsuk',
		html: 'I should look at my own table. I am looking at her chest. At the split of the chima. At the place a general is not supposed to name. I like women built like that. I have always liked it. I am going to hate myself in a bed that is not hers.',
		ko: '제 상을 봐야 한다. 가슴을 보고 있다. 치마가 갈라진 곳을. 장군이 이름 붙이면 안 되는 곳을. 저런 몸매의 여자가 좋다. 원래 좋았다. 그 여자 것이 아닌 침상에서 나를 미워할 것이다.'
	},
	{
		kind: 'p',
		html: 'He does the correct thing. He stands. He bows to a feast that has not asked him to leave. He goes to sleep like a man with a pink room waiting. <b>The pallet does not take him.</b>',
		ko: '옳은 일을 한다. 일어선다. 나가라고 하지 않은 잔치에 절한다. 분홍 방이 기다리는 사람처럼 자러 간다. <b>침상이 받지 않는다.</b>'
	},
	{
		kind: 'scene',
		label: 'HE TRIES TO SLEEP',
		ko: '자려고 한다'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Ice-blue on dark timber. One dying lamp. Eyes open. The hall comes with him anyway — her hip, her mouth, the plum, the hand that was not an accident. <b>He tries to sleep and the hall comes with him.</b> A True Bone should be able to close his eyes. He is twenty-four and hard in the dark and he knows exactly why.',
		ko: '어두운 나무 위 얼음빛. 죽어 가는 등 하나. 눈은 떠 있다. 전각이 따라온다 — 허리, 입, 자두, 실수가 아니었던 손. <b>자려고 하면 전각이 따라온다.</b> 진골이면 눈을 감을 수 있어야 한다. 스물넷. 어둠 속에서 서 있고, 이유를 정확히 안다.'
	},
	{
		kind: 'monologue',
		nsfw: true,
		person: 'pumsuk',
		html: 'This fire. I did not light it. She walked the lamps and it caught. I have a wife. I have a name. I have a cock that will not listen. The curve of her — I like that. I have always liked that. If I sleep I will dream the split of the ochre. If I do not sleep I will go back. Beasts go back. I am going back.',
		ko: '이 불. 내가 지핀 게 아니다. 그녀가 등잔을 걸어서 붙었다. 아내가 있다. 이름이 있다. 말을 안 듣는 것이 있다. 그 곡선 — 좋다. 원래 좋았다. 잠들면 황토가 갈라진 꿈을 꿀 것이다. 안 잠들면 돌아갈 것이다. 짐승이 돌아간다. 나는 돌아간다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'In the gold behind his lids she arrives with the plum. Jeogori already wrong. <b>She arrives in the gold.</b> He cannot close his eyes on a mouth he has already counted.',
		ko: '눈꺼풀 뒤 금빛으로 그녀가 자두를 들고 온다. 저고리가 이미 틀렸다. <b>금빛 속으로 온다.</b> 이미 센 입 위로 눈을 감을 수가 없다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She looks back over the shoulder in the dirtied green and the dream is the same lamp as the feast. <b>The look-back in the dark.</b> He sits up. Palm down on taut ice-blue. Shame and hunger in the same hand. <b>Palm on the ice-blue.</b> The pink ribbon on the post is still there. He does not take it. He takes the hall.',
		ko: '때 묻은 초록 속에서 어깨 너머로 돌아보고, 꿈의 등잔이 잔치의 등잔이다. <b>어둠 속의 뒤돌아봄.</b> 일어앉는다. 팽팽한 얼음빛 위에 손바닥. 같은 손에 부끄러움과 굶주림. <b>얼음빛 위의 손.</b> 기둥의 분홍 리본은 아직 있다. 그것은 집어 들지 않는다. 전각을 집어 든다.'
	},
	{
		kind: 'p',
		html: 'He goes back. The families have thinned. The screen is cheaper in this hour. She is still there. She sits as if she knew he would fail the pallet.',
		ko: '돌아간다. 식구들은 줄어 있다. 이 시각의 병풍은 더 싸다. 그녀는 아직 있다. 침상에서 실패할 줄 알았다는 듯이 앉는다.'
	}
];

spliceAfter('The yard is about the curve she takes with her', garrison);
spliceAfter('The training is a joke tonight', hellfire);

const knot = daeya.blocks.find((b) => (b.lines ?? []).join('').includes('창고야, 새벽까지'));
if (knot) {
	knot.lines = [
		'창고야, 새벽까지. 그 사람은.',
		'손은— 내려. 가슴에. 아니, 더 아래.',
		'봐, 이미 찢어지잖아. 네가 찢은 거 아니야. 아직.',
		'자지가 먼저 왔구나. 착하지.'
	];
	knot.en = [
		'Stores. Till dawn. That’s where he is.',
		'Hand— down. On the chest. No — lower.',
		'Look, it’s already tearing. You didn’t do that. Not yet.',
		'Your cock got here first. Good boy.'
	];
	knot.nsfw = true;
}

const throatTalk = daeya.blocks.find((b) => (b.en ?? []).join('').includes('A general’s throat'));
if (throatTalk) {
	throatTalk.lines = [
		'서라벌 얘기 그만해. 숨이— 목덜미에 있잖아.',
		'장군 목덜미. 지금 내 거야.',
		'아래도 내 거야. 만져. 그곳.',
		'<b>숨이 목덜미에.</b> 기대. 기둥 있어.'
	];
	throatTalk.en = [
		'Drop Surabol. Your breath is— it’s on my throat already.',
		'A general’s throat. Mine tonight.',
		'Down there is mine too. Touch. There.',
		'<b>Breath on the throat.</b> Lean. There’s a post.'
	];
	throatTalk.nsfw = true;
}

const lead = daeya.blocks.find((b) => text(b).includes('She meant to lead'));
if (lead) {
	lead.html =
		'What follows is not a kiss. It is a True Bone boy with the manners torn off. From his eyes the chest is the lamp — heavy, thirty-one, the jeogori already a veil. The chronicle used to look away here. It does not, tonight. Worn hanbok still on — then less of it, beat by beat, until the ochre is only a sash at the hip and she is almost nothing but the body he dreamed on the pallet. <b>She meant to lead.</b> She lasts three thrusts and then she is the one making the sound.';
	lead.ko =
		'그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다. 그 눈에서는 가슴이 등잔이다 — 무겁고, 서른하나, 저고리는 이미 너울. 이 기록은 여기서 눈을 돌리곤 했다. 오늘 밤은 돌리지 않는다. 낡은 한복은 아직 있다 — 박자마다 덜 있고, 황토가 허리의 끈만 남을 때까지, 침상에서 꿈꾼 몸만 남을 때까지. <b>이끌려고 했다.</b> 세 번을 버티고, 소리를 내는 쪽이 그녀가 된다.';
}

const firstD = daeya.blocks.find((b) => (b.en ?? []).join('').includes('this body, ten years'));
if (firstD) {
	firstD.lines = [
		'씨발— 이 가슴, 이 보지, 십 년—',
		'더— 네 자지, 검일은 이렇게 안 해—'
	];
	firstD.en = [
		'Fuck— these tits, this cunt, ten years—',
		'More— your cock, Gumil never—'
	];
}

const refsM = ['/ch_gumil_wife.png', '/bn_gumil_wife.png'];
const refsMP = [...refsM, '/ch_pumsuk.png'];
const refsPlace = ['/ch_gumil_wife.png', '/pl_daeya_fortress.png'];

function slot(o) {
	return {
		ratio: o.ratio ?? 1.778,
		tone: o.tone ?? '#8AAFA0',
		nsfw: true,
		refs: o.refs ?? refsMP,
		people: o.people ?? ['gumilwife', 'pumsuk'],
		...o
	};
}

const newSlots = [
	slot({
		id: 'maehwa-garrison-01-well',
		at: 'The well-post learns her hip first',
		alt: 'High-contrast movie: packed-earth well, Maehwa crossing, tiny yellow-sleeve men watching',
		refs: refsPlace,
		people: ['gumilwife'],
		prompt: 'Cinematic 16:9. CARAVAGGIO Daeya inner yard. No text. No watermark.'
	}),
	slot({
		id: 'maehwa-garrison-02-store',
		at: 'The storehouse door is a dark mouth',
		alt: 'High-contrast: storehouse timber, she in the gold slit, men as shadow',
		refs: refsPlace,
		people: ['gumilwife'],
		prompt: 'Cinematic 16:9. CARAVAGGIO Daeya storehouse. No text. No watermark.'
	}),
	slot({
		id: 'maehwa-garrison-03-post',
		at: 'The post takes the silhouette',
		alt: 'High-contrast: inner stair, jeogori fallen, silhouette on the post',
		refs: refsM,
		people: ['gumilwife'],
		prompt: 'Cinematic 16:9. CARAVAGGIO inner stair. No text. No watermark.'
	}),
	slot({
		id: 'maehwa-feast-families',
		at: 'The families are still eating',
		alt: 'Wide feast: families at tables; she on the lamp-line; ice-blue failing not to look',
		refs: ['/ch_gumil_wife.png', '/ch_pumsuk.png', '/pl_daeya_fortress.png'],
		prompt: 'Cinematic 16:9. CARAVAGGIO feast with families. No text. No watermark.'
	}),
	slot({
		id: 'maehwa-feast-hands',
		at: 'She has practised this',
		alt: 'Close: her hand placed on hip and sash — the accident that is not',
		refs: refsM,
		people: ['gumilwife'],
		prompt: 'Intimate 16:9. Strategic hand. CARAVAGGIO. No text. No watermark.'
	}),
	slot({
		id: 'pumsuk-pov-body',
		at: 'From his eyes the chest is the lamp',
		alt: 'Pumsuk POV: looking down her open jeogori, the chest filling the frame',
		prompt: 'Intimate 16:9. POV looking down. CARAVAGGIO. No text. No watermark.'
	}),
	slot({
		id: 'pumsuk-pov-kiss',
		at: 'The mouth goes first',
		alt: 'Pumsuk POV: kissing her mouth, her face filling the gold',
		prompt: 'Intimate 16:9. POV kiss. CARAVAGGIO. No text. No watermark.'
	}),
	slot({
		id: 'pumsuk-lust-throat2',
		at: 'Heart-pupils, if anyone looked that close',
		alt: 'Another throat still: her mouth on the tendon, his ice-blue open, heart-pupils',
		prompt: 'Intimate 16:9. Throat lust. CARAVAGGIO. No text. No watermark.'
	})
];

const after = daeya.images.findIndex((im) => im.id === 'pumsuk-hc-01-walk');
if (after < 0) throw new Error('no pumsuk-hc-01-walk');
const have = new Set(daeya.images.map((im) => im.id));
daeya.images.splice(after + 1, 0, ...newSlots.filter((s) => !have.has(s.id)));

const dreamAt = {
	'pumsuk-dream-01-pallet': 'He tries to sleep and the hall comes with him',
	'pumsuk-dream-02-arrive': 'She arrives in the gold',
	'pumsuk-dream-03-lookback': 'The look-back in the dark',
	'pumsuk-dream-04-fruit': 'She arrives in the gold',
	'pumsuk-dream-05-shame': 'Palm on the ice-blue',
	'pumsuk-dream-06-token': 'Palm on the ice-blue'
};
for (const im of daeya.images) {
	if (dreamAt[im.id]) im.at = dreamAt[im.id];
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('hellfire + garrison + pov slots');
