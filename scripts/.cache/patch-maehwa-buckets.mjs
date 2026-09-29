#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const storyPath = '/Users/heewon/Documents/GitHub/kingdom/src/lib/data/story.json';
const story = JSON.parse(readFileSync(storyPath, 'utf8'));

const P = (html, ko) => ({ kind: 'p', nsfw: true, html, ko });
const M = (person, html, ko) => ({ kind: 'monologue', person, nsfw: true, html, ko });
const D = (chip, person, lines, en) => ({
	kind: 'dialogue',
	nsfw: true,
	chip,
	person,
	lines,
	en
});

const MW = '#c98fb0';
const PU = '#7aa8d8';
const GU = '#9a7b5f';

function entry(title) {
	for (const ch of story) {
		for (const e of ch.entries || []) {
			if (e.title === title) return e;
		}
	}
	throw new Error(title);
}

function splice(blocks, startPred, endPred, insert) {
	const i = blocks.findIndex(startPred);
	const j = blocks.findIndex(endPred);
	if (i < 0 || j < 0 || j < i) throw new Error(`splice ${i} ${j}`);
	return [...blocks.slice(0, i), ...insert, ...blocks.slice(j + 1)];
}

function insertBefore(blocks, pred, insert) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('insertBefore miss');
	return [...blocks.slice(0, i), ...insert, ...blocks.slice(i)];
}

function insertAfter(blocks, pred, insert) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('insertAfter miss');
	return [...blocks.slice(0, i + 1), ...insert, ...blocks.slice(i + 1)];
}

const e = entry('Daeya Fortress');

const kiss = [
	P(
		'<b>The mouth goes first.</b> Not a polite peck. Tongues. Wet. She sucks his lower lip and he makes a stupid sound into her. Ice-blue fist in dirtied green. She is starving. Ten years of three-stroke nights and a husband who is done before she starts. She kisses him like she is going to eat him. <i>Chup. Chup.</i> Spit on the chin. His young mouth does not know how. She teaches that too.',
		'<b>입이 먼저다.</b> 예의 바른 쪽 아님. 혀. 젖은. 아랫입술을 빨면 그가 바보 소리를 낸다. 때 묻은 초록을 얼음빛이 쥔다. 굶었다. 십 년, 세 번에 끝나는 밤, 시작도 전에 끝나는 남편. 잡아먹을 듯이 입맞춘다. <i>춥. 춥.</i> 턱에 침. 젊은 입은 모른다. 그것도 가르친다.'
	),
	D(
		MW,
		'gumilwife',
		['혀— 그래. 더 넣어—', '젊은 입 맛이야. 씨발.', '옷 벗어. 등 보고 싶어. 허리도.'],
		['Tongue— yes. Deeper—', 'You taste so young. Fuck.', 'Clothes off. I want the back. The hips too.']
	),
	P(
		'<b>As little silk as the lamp allows.</b> She peels the ice-blue off his shoulders with both hands — <i>ssrk</i> — and the chest is right there, twenty-four, muscle she has not had in her mouth. She bites. Jeogori off her own shoulders like it never meant to stay. Ochre hiked to the waist. Nothing left that is not skin or a cheap sash. Deep french kiss while she opens him. <i>Mmh—</i> His cock slaps her thigh, already leaking. Made for this. Both of them. She can feel it in the fit before he is even in.',
		'<b>등이 허락하는 만큼만 비단.</b> 두 손으로 얼음빛을 어깨에서 벗긴다 — <i>스르륵</i> — 가슴이 있다. 스물넷. 입에 넣어 본 적 없는 근육. 문다. 제 저고리도 어깨에서, 처음부터 남을 생각 없던 것처럼. 황토는 허리까지. 살과 싼 끈 말고는 없다. 벗기면서 혀를 깊게. <i>음—</i> 자지가 허벅지에 닿고, 이미 흘린다. 이걸 위해 만들어진 몸. 둘 다. 넣기도 전에 맞춤이 느껴진다.'
	),
	D(
		PU,
		'pumsuk',
		['입— 더— 하아—', '젖이— 등도— 보고만 있으면—'],
		['Mouth— more— haa—', 'The tits— the back— if I just look—']
	)
];

const rest = [
	P(
		'He does not last the courtesy of a first finish. <i>Plap-plap-plap—</i> and he is already shaking. He buries it — a stupid, young, endless amount, a first bucket poured into a woman who has been empty for a decade — and keeps thrusting through the squirt, wetter, louder, white already running down the inside of the ochre in ropes. <b>Bucket. First bucket.</b> She laughs into the scream. She thought that was a night. One. Thank you. Back to the feast. She starts to sit. It is still coming out of her. <i>Glk. Glk.</i>',
		'첫 번의 예의를 지키지 못한다. <i>철벅철벅철벅—</i> 이미 떤다. 묻는다 — 바보같고, 젊고, 끝이 없는 양, 십 년을 비워 둔 여자 안에 첫 통 — 싼 물 위로 계속 박는다. 더 젖고, 더 크고, 하얗게가 황토 안으로 줄줄. <b>한 통. 첫 통.</b> 비명 속에서 웃는다. 이게 밤인 줄 알았다. 한 번. 고맙다. 잔치로. 일어나려 한다. 아직 나온다. <i>꿀꺽. 꿀꺽.</i>'
	),
	D(
		MW,
		'gumilwife',
		['AUUAAAAUAGGH—!!', '씨발 양이— 안에 차—!!', '젊은 허리 존나 좋아— 등 근육— 전부—!!'],
		['AUUAAAAUAGGH—!!', 'FUCK the amount— filling me—!!', 'This young waist— the back— ALL of it—!!']
	),
	D(
		PU,
		'pumsuk',
		['AUUAAAAUAGGH—', '또— 나와— 통째로—!!'],
		['AUUAAAAUAGGH—', 'More— coming— the whole bucket—!!']
	),
	M(
		'gumilwife',
		'I screamed. He stayed. I was going to thank him and send him back. I am sitting up. It is leaking down my thigh in a line. It is over. It is over. If he looks at this mess it will not be over.',
		'소리쳤어. 남았어. 고맙다 하고 돌려보낼 거였어. 일어나. 허벅지로 줄이 흘러. 끝이야. 끝이야. 이 꼴 보면 안 끝나.'
	),
	P(
		'He does not go soft. He is staring at her cunt — open, used, his first load already spilling out in a thick white sheet onto the cheap sash — and the looking is the fuck. His cock jumps. Hard again. Instant. He grabs the tits with both hands like he dropped them. Twenty-four. Starving. He slams back in through his own mess, <i>shlick</i>, all the way, and she feels the next bucket already loading. A used hole and he wants it more than a clean one. She has been starved of this. He looks like he has been starved of her.',
		'안 죽는다. 그 구멍을 본다 — 벌어지고, 쓰이고, 첫 한이 싼 끈 위로 두껍게 흘러 — 보는 게 박기다. 자지가 뛴다. 다시 선다. 즉시. 젖을 두 손으로, 떨어뜨린 것처럼. 스물넷. 굶었다. 제 것에 미끄러져 다시 넣는다, <i>찔꺽</i>, 밑까지, 다음 통이 이미 차는 게 느껴진다. 쓰인 구멍을 깨끗한 것보다 원한다. 그녀가 굶었다. 그는 그녀를 굶은 눈이다.'
	),
	D(
		MW,
		'gumilwife',
		['끝난 줄— 벌써 또—?!!', '이 젊은 몸— 등— 엉덩이까지 단단해—', '빼지 마. 씨 더 줘. 통째로—'],
		['I thought you were DONE— ALREADY—?!!', 'This young body— the back— even the ass is hard—', 'Don’t pull out. More nut. The whole bucket—']
	),
	D(
		PU,
		'pumsuk',
		['보면— 또 나와—!!', '젖만 봐도— 싸겠소— 안에—!!'],
		['If I look I nut again—!!', 'Just the tits— I’m gonna fill you—!!']
	),
	P(
		'<b>Cowgirl again.</b> She drops on him — <i>PLAP. PLAP. PLAP.</i> Ochre wrecked. Ass slapping his lap. Tits bouncing in his grip. First load squelching out around the cock every time she sits. <i>Schlk-schlk-schlk.</i> She rides like a woman who has not been fucked properly since she was a girl. She loves the back under her hands. The hips. The stomach. All of it. Young man body and she is going to use every inch.',
		'<b>또 올라탄다.</b> 떨어진다 — <i>철벅. 철벅. 철벅.</i> 황토 망가짐. 엉덩이가 무릎에. 젖이 쥔 대로 튐. 앉을 때마다 첫 한이 자지 옆으로 새어. <i>찔꺽찔꺽찔꺽.</i> 제대로 박힌 적 없는 여자처럼 탄다. 손 아래 등이 좋다. 허리. 배. 전부. 젊은 남자 몸. 한 치도 안 남긴다.'
	),
	D(
		MW,
		'gumilwife',
		['등 만져— 허리 만져— 이 몸 내 거야—!!', '검일은 세 번이면 싸. 넌 통이야. 통—!!'],
		['Touch the back— the waist— this body is MINE—!!', 'Gumil lasts three strokes. You’re a bucket. A BUCKET—!!']
	),
	D(
		PU,
		'pumsuk',
		['튀겨— 젖도 튀겨—!!', '이 보지에 또 쌀 거요— 통째로—!!', 'AUUAAAAUAGGH—!!'],
		['Bounce— bounce those tits—!!', 'Gonna nut in this cunt again— the whole bucket—!!', 'AUUAAAAUAGGH—!!']
	),
	P(
		'Second finish. He shouts it into her chest. Another bucket. She feels it hit deep, hot, too much, overflowing the first. She thinks that is the night. It is not. He folds her in half on the pine — missionary, legs over his shoulders, her own wet on her belly — and drives. <i>Plap-plap-plap-plap.</i> She claws the back she has been talking about. Muscle. Sweat. She licks it.',
		'두 번째. 가슴에 대고 고함친다. 또 한 통. 깊이 맞고, 뜨겁고, 너무 많아서 첫 번을 넘친다. 이번이 밤인 줄 안다. 아니다. 마루에서 반으로 접는다 — 정상위, 다리가 어깨에, 제 물이 배에 — 박는다. <i>철벅철벅철벅철벅.</i> 말하던 등을 긁는다. 근육. 땀. 핥는다.'
	),
	D(
		MW,
		'gumilwife',
		['AUUAAAAUAGGH— 등— 등 존나 섹시해—!!', '젊은 엉덩이 움직임— 씨발— 더—!!', '채워— 채워— 통—!!'],
		['AUUAAAAUAGGH— the BACK— your back is so fucking sexy—!!', 'That young ass moving— fuck— more—!!', 'Fill it— fill it— the bucket—!!']
	),
	P(
		'<b>He turns her.</b> Doggy. Cheap post in her fists. He takes the hips he has been staring at since the yard and slams. <i>CLAP. CLAP. CLAP.</i> Her tits swing. Milk already running down the inside of her thighs, dripping off the knees onto pine. Third bucket. He does not pull out. She would kill him if he pulled out. Breeding. Raw. The bodies slot like they were cut from the same want.',
		'<b>돌린다.</b> 뒤에서. 싼 기둥이 주먹에. 마당부터 보던 허리를 잡고 박는다. <i>짝. 짝. 짝.</i> 젖이 흔들린다. 흰 것이 이미 허벅지 안으로, 무릎에서 마루로. 세 번째 통. 안 뺀다. 빼면 죽일 것이다. 씨. 생. 몸이 같은 욕으로 잘린 것처럼 맞는다.'
	),
	D(
		PU,
		'pumsuk',
		['받아— 받아— AUUAAAAUAGGH—!!', '조여— 이 안이— 또 나와—!!'],
		['Take it— take it— AUUAAAAUAGGH—!!', 'Tighten— I’m nutting again—!!']
	),
	D(
		MW,
		'gumilwife',
		['AUUAAAAUAGGH— 누구 거야— 말해—!!', '젊은 자지— 젊은 등— 젊은 씨— 내 거—!!'],
		['AUUAAAAUAGGH— WHOSE IS IT— SAY IT—!!', 'Young cock— young back— young nut— MINE—!!']
	),
	D(PU, 'pumsuk', ['내 거요— 이 보지— 내 거—!!'], ['MINE— this cunt— MINE—!!']),
	P(
		'Against the wall. Her legs around the waist she keeps praising. Standing. He is twenty-four and still hard and the fourth bucket slops out of her when he lifts, a wet sound, <i>blorp</i>, and he puts it back before it hits the floor. She is louder than the feast. <b>She loses the room.</b> She came to steal a husband. She is the one getting bred. Shaking. Dripping. Asking for the next load with her mouth on his.',
		'<b>벽.</b> 칭찬하던 허리를 다리가 감싼다. 서서. 스물넷, 아직 서 있고, 들어올릴 때 네 번째 통이 <i>푸슉</i> 흘렀다가, 바닥에 닿기 전에 다시 넣는다. 잔치보다 크다. <b>방을 잃는다.</b> 남편을 훔치러 온 여자가 씨받는다. 떨고. 흘리고. 입에 입을 대고 다음 한을 청한다.'
	),
	D(
		MW,
		'gumilwife',
		['혀— 혀 넣어— 싸면서 입맞춰—!!', '등 넓어— 허리 좁아— 이 몸 미치겠어—!!', '더— 통— 더—!!'],
		['Tongue— tongue in— kiss me while you nut—!!', 'Wide back— narrow waist— I’m losing it over this body—!!', 'More— buckets— more—!!']
	),
	P(
		'On her side. Then on her back again. Then her on top facing away so he can watch the ass he ruined. <i>Plap. Squelch. Drip.</i> Load after load of pure breeding lust. She loses the count. Five. Six. The pine is white. The ochre is a rag. Ice-blue is stained to the hip. Every time she thinks the wick is the end he looks at the mess between her legs and gets hard inside her. <b>The lamp keeps dying and he does not.</b>',
		'옆으로. 다시 바로. 등을 보이게 타서 망가뜨린 엉덩이를 보게 한다. <i>철벅. 찔꺽. 뚝.</i> 씨 욕망이 통째로, 한 통 한 통. 세는 것을 잃는다. 다섯. 여섯. 마루가 하얗다. 황토는 걸레. 얼음빛은 허리까지 젖었다. 심지가 끝인 줄 알 때마다 다리 사이를 보고 안에서 다시 선다. <b>등잔은 죽어 가는데 그는 안 죽는다.</b>'
	),
	D(
		MW,
		'gumilwife',
		['AUUAAAAUAGGH— 또— 또 나와—!!', '빼지 마— 씨 넘쳐— 허벅지로—!!'],
		['AUUAAAAUAGGH— again— it’s coming again—!!', 'Don’t pull out— the nut’s overflowing— down my thighs—!!']
	),
	D(
		PU,
		'pumsuk',
		['사랑하오— 이 몸— 이 구멍— 안 멈춰—!!', 'AUUAAAAUAGGH— 통—!!'],
		['I love you— this body— this hole— I can’t stop—!!', 'AUUAAAAUAGGH— the bucket—!!']
	),
	P(
		'<b>They do not stop until the lamp dies.</b> Bucket after bucket inside her — she squirts again on the last one, water and white, on the dirtied green, on the worn pine, on the frayed red sash, on the tits she cannot cover, on his stomach, on the cheap post. Hanbok still on — just straps of it. The hall smells of sex. She is hoarse. He is shaking and still in her, still holding the chest, still twitching out the last of a night that was only breeding. For the first time in this fortress <b>they are in love in a room that cannot keep them.</b>',
		'<b>등잔이 죽을 때까지 멈추지 않는다.</b> 그 안에 통째로 — 마지막에 또 물이 나오고, 하얗고 물이고, 때 묻은 초록에, 낡은 마루에, 헐거운 붉은 끈에, 못 가리는 젖에, 그의 배에, 싼 기둥에. 한복은 아직 있다 — 끈만. 전각에 그 냄새가 있다. 목이 쉬었다. 그는 떨면서 아직 그 안에 있고, 아직 가슴을 잡고, 씨만 있던 밤의 마지막을 아직 튄다. 이 성에서 처음으로 <b>붙잡아 둘 수 없는 방에서 사랑한다.</b>'
	),
	M(
		'gumilwife',
		'I cannot sit up. If he looks again I will not survive it. I want him to look. I wanted the buckets. I wanted the back, the hips, the young body. I was going to ruin him. I am in love with him. That is the room now.',
		'못 일어나. 또 보면 못 버텨. 봐 줬으면 좋겠어. 그 통을 원했어. 등, 허리, 젊은 몸을 원했어. 그 아이를 망가뜨릴 거였어. 사랑해. 이제 방이 그거다.'
	),
	D(
		MW,
		'gumilwife',
		['하아— 죽겠어—', '사랑해— 이 몸— 남아 줘서— 사랑해—'],
		['Haa— I’m wrecked—', 'I love you— this body— you stayed— I love you—']
	),
	D(PU, 'pumsuk', ['나도— 사랑하오.', '젖이. 당신이. 이 방이. 이 안이.'], ['I love you too.', 'The tits. You. This room. This inside.']),
	P(
		'They look. That is the whole end. A poor woman and a True Bone boy, wrecked on cheap pine, still joined, his cock still in, last bucket still leaking around it. They are completely in love. The feast will not know what to do with that.',
		'본다. 그게 끝의 전부다. 가난한 여자와 진골 소년, 싼 마루에서 망가지고, 아직 붙어 있고, 아직 그 안에, 마지막 통이 아직 옆으로 샌다. 완전히 사랑한다. 잔치는 그걸 어떻게 할지 모를 것이다.'
	),
	P(
		'Afterwards she is <b>on the worn pine</b>. Jeogori open. Chima a wreck. <b>White milk on the dirtied green</b> — buckets of it, on the boards, on the cheap sash, on her, still pumping out when she tries to close her legs, catching the last of the lamp. She cannot sit up yet. She does not try. The feast on the other side of the screen has gone very quiet.',
		'끝나고 <b>낡은 마루 위에 있다</b>. 저고리는 열려 있다. 치마는 망가졌다. <b>때 묻은 초록 위에 흰 젖</b> — 통째로, 마루에, 싼 끈에, 그녀에, 다리를 모으려 해도 아직 나오고, 마지막 등잔에 잡힌다. 아직 일어나지 못한다. 하려고도 하지 않는다. 병풍 너머 잔치가 아주 조용해진다.'
	)
];

const gumil = [
	P(
		'She does not wait for the rest of the questions. Same pine. Same wrecked ochre. She is still in milf mode — the voice she used on the boy, the hands on the chest, the hike. She pulls the yellow sleeve down, puts him in, and <b>does not let go</b>. He is already overwhelmed. Her. The smell. Last night still wet on her. Three strokes. He always was three strokes.',
		'나머지 질문을 기다리지 않는다. 같은 마루. 같은 망가진 황토. 아직 아줌마 모드다 — 그 아이에게 쓰던 목소리, 가슴의 손, 걷어 올린 것. 노란 소매를 내리고, 넣고, <b>안 놓는다</b>. 이미 압도됐다. 그녀. 냄새. 지난밤이 아직 젖어. 세 번. 원래 세 번이었다.'
	),
	D(
		MW,
		'gumilwife',
		['가만히. 내가 할게.', '검일아. 그렇게— 그래. 착하지.', '빼지 마. 아직이야.'],
		['Stay still. Let me.', 'Gumil. Like that— yes. Good boy.', 'Don’t pull out. We’re not done.']
	),
	D(
		GU,
		'gumil',
		['하아— 매화— 잠깐—', '벌써— 안 돼— AUUAAAAUAGGH—'],
		['Haa— Maehwa— wait—', 'Already— I can’t— AUUAAAAUAGGH—']
	),
	P(
		'He cums. Fast. A small, overwhelmed sound into her neck, <i>hnngh</i>, and it is over for him. She keeps the hips down. Milf. She rides the twitch until there is nothing left and then she still does not lift. He is shaking. She is not. This is why she was starved. This is why the boy’s buckets felt like a country.',
		'싼다. 빨리. 목덜미에 작은, 압도된 소리, <i>으응</i>, 그걸로 그는 끝. 허리는 내린 채. 아줌마. 더 나올 게 없을 때까지 타고, 그래도 안 일어난다. 그는 떤다. 그녀는 아니다. 그래서 굶었다. 그래서 그 아이 통이 나라처럼 느껴졌다.'
	),
	D(
		MW,
		'gumilwife',
		['벌써야.', '알아. 원래 그래.', '아직 안에 있어. 내가 안 놓으니까.'],
		['Already.', 'I know. You always are.', 'You’re still in. Because I’m not letting go.']
	),
	M(
		'gumil',
		'I came. She is still on me. I cannot look at her tits without finishing. I have never lasted. She knows. She is telling me the boy lasted all night.',
		'쌌다. 아직 타고 있다. 젖만 봐도 끝이다. 오래 가 본 적이 없다. 그녀가 안다. 그 아이는 밤새 갔다고 말하고 있다.'
	)
];

const imgs = [
	{
		id: 'nsfw-maehwa-french-kiss',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'The mouth goes first',
		alt: 'Deep french kiss: Maehwa and Pumsuk, tongues, jeogori falling, lamp',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'],
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9 CLOSE two-shot. Deep french kiss, open mouths, tongues, spit sheen. Adult Maehwa and adult Pumsuk. CINEMATOGRAPHY: ECU, dutch, shallow DOF, chiaroscuro lamp. ONE device: their joined mouths as a wet horizontal bar. Jeogori falling off shoulders, as little silk as the lamp allows, hiked ochre, ice-blue #7EB8F0 open. Teal-sage #8AAFA0 rim. FACE AND GARMENTS from attached portraits; wood-sprig binyeo. Skin-forward, hungry faces, not serene. Crushed black Daeya timber hall. No text. No watermark.'
	},
	{
		id: 'nsfw-maehwa-disrobe',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'As little silk as the lamp allows',
		alt: 'Silk peeling: ice-blue off his back, her jeogori a veil, chests together',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'],
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9. Disrobing. CINEMATOGRAPHY: over-shoulder, rack focus, tenebrism. ONE device: falling ice-blue #7EB8F0 silk as a diagonal slash. Adult Maehwa peeling Pumsuk’s jeogori off a muscular young back; her own teal-sage #8AAFA0 jeogori off the shoulders, ochre hiked. As little clothes as the filter allows, silk still on as straps. Faces match attached; wood-sprig binyeo. Hungry mouths. Cheap pine, crushed black. No text. No watermark.'
	},
	{
		id: 'nsfw-maehwa-scream-load',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'AUUAAAAUAGGH',
		alt: 'Orgasm scream: both wrecked, mouths open, lamp on wet skin',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'],
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9 CLOSE. Dual orgasm faces, mouths wide, ahegao-adjacent, sweat, heavy blush. CINEMATOGRAPHY: dutch ECU, chiaroscuro. ONE device: two open mouths as stacked ovals. Adult Maehwa riding, adult Pumsuk, as little silk as allowed. Faces match attached portraits; binyeo. Ice-blue #7EB8F0 and teal #8AAFA0 rims. Manhwa panel energy. No readable text. No watermark.'
	},
	{
		id: 'nsfw-maehwa-buckets',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'Bucket. First bucket',
		alt: 'Creampie overflow on ochre and cheap sash, still joined',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'],
		people: ['gumilwife', 'pumsuk'],
		prompt:
			'Intimate cinematic 16:9. Still joined on worn pine. CINEMATOGRAPHY: low angle, long-shadow key. ONE device: a white drip-line down hiked ochre as a vertical. Adult bodies, as little silk as the filter allows, overflow implied not porn-catalog. Faces match attached. Ice-blue #7EB8F0 stained, teal #8AAFA0. Hungry wrecked faces. No text. No watermark.'
	},
	{
		id: 'nsfw-gumil-milf-fast',
		ratio: 1.778,
		tone: '#6b7f9e',
		nsfw: true,
		at: 'does not let go',
		alt: 'Morning: Maehwa in milf-mode on Gumil, he already spent, she still seated',
		refs: ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_gumil.png'],
		people: ['gumilwife', 'gumil'],
		prompt:
			'Intimate cinematic 16:9. Grey morning same hall. CINEMATOGRAPHY: over-shoulder, shallow DOF. ONE device: her hips pinned down as a heavy horizontal. Adult Maehwa milf-mode, yellow-sleeve Gumil overwhelmed, mouth open, already finished, she has not lifted. As little silk as allowed. Faces match attached portraits; wood-sprig binyeo. Teal #8AAFA0, gumil grey #6b7f9e. No text. No watermark.'
	}
];

e.blocks = insertBefore(
	e.blocks,
	(b) => (b.html || '').startsWith('What follows is not a kiss'),
	kiss
);
e.blocks = splice(
	e.blocks,
	(b) => (b.html || '').startsWith('He does not last the courtesy'),
	(b) => (b.html || '').startsWith('Afterwards she is'),
	rest
);
e.blocks = insertAfter(
	e.blocks,
	(b) => Array.isArray(b.en) && b.en[0] === 'After that.' && b.person === 'gumil',
	gumil
);

const gi = (e.images || []).findIndex((im) => im.id === 'gumil-am-01-door');
if (gi < 0) throw new Error('gumil-am slot');
e.images = [...e.images.slice(0, gi), ...imgs, ...e.images.slice(gi)];

writeFileSync(storyPath, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', kiss.length, rest.length, gumil.length, 'imgs', imgs.length);
