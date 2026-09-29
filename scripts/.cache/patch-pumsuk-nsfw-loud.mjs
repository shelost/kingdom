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
	if (b.kind === 'monologue') return `${b.html ?? ''} ${b.ko ?? ''}`;
	return '';
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipP = '#7aa8d8';

const start = daeya.blocks.findIndex((b) => text(b).includes('What follows is not a kiss'));
const end = daeya.blocks.findIndex((b) => text(b).includes('Afterwards she is'));
if (start < 0 || end < 0 || end <= start) throw new Error(`range ${start} ${end}`);

const newBlocks = [
	{
		kind: 'p',
		nsfw: true,
		html: 'What follows is not a kiss. It is a True Bone boy with the manners torn off. The chronicle used to look away here. It does not, tonight. Worn hanbok still on — just more of her, beat by beat: the chest the jeogori cannot keep, the waist the ochre is already losing, thirty-one years of unused heat. <b>She meant to lead.</b> She lasts three thrusts and then she is the one making the sound.',
		ko: '그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다. 이 기록은 여기서 눈을 돌리곤 했다. 오늘 밤은 돌리지 않는다. 낡은 한복은 아직 있다 — 다만 박자마다 그녀가 더 보인다: 저고리가 못 가리는 가슴, 황토가 이미 놓치는 허리, 십 년을 안 쓴 서른하나의 열. <b>이끌려고 했다.</b> 세 번을 버티고, 소리를 내는 쪽이 그녀가 된다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['씨발— 이 몸, 십 년—', '더— 검일은 이렇게 안 해, 너는—'],
		en: ['Fuck— this body, ten years—', 'More— Gumil never— you—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['이 허리— 미쳤소—', '이 몸이— 쌀 것 같소—'],
		en: ['This waist— it’s insane—', 'This body— I’m gonna—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He takes her standing first, from behind, the way a man takes something he has been staring at since the lamp-line. Ice-blue still on. Dirtied green hiked up the hip so the waist is in his hands. Each thrust is a hit — hip to hip, the cheap post knocking, her chest thrown into the gold, heavy, used, wanted. She is thirty-one and wet like the first time. He is twenty-four and does not know how to be gentle. The virility is stupid. It does not stop.',
		ko: '먼저 서서, 뒤에서 가진다. 등잔 줄부터 보던 것을 가지는 방식이다. 얼음빛은 아직 있다. 때 묻은 초록이 허리까지 걷혀, 허리가 손에 있다. 한 번이 한 대다 — 허리와 허리, 싼 기둥이 울리고, 가슴이 금빛으로 밀린다, 무겁고, 쓰였고, 원하게. 서른하나. 처음처럼 젖어 있다. 스물넷. 부드럽게 하는 법을 모른다. 그 기운이 바보같다. 안 멈춘다.'
	},
	{
		kind: 'monologue',
		person: 'pumsuk',
		nsfw: true,
		html: 'I should stop. I am not stopping. The silk is still clean. That waist. That chest. Harder. She asked. I am going to fill her until the lamp hates me.',
		ko: '멈춰야 한다. 안 멈춘다. 비단은 아직 깨끗하다. 그 허리. 그 가슴. 더 세게. 그녀가 청했다. 등잔이 싫어할 때까지 채울 것이다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['하아— 착하지— 그래, 그렇게—', '멈추지 마— 이 안에 다—'],
		en: ['Haa— good boy— yes, like that—', 'Don’t you stop— all of it in me—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['더— 미치겠소—', 'YOUR BODY— 아—'],
		en: ['More— I’m gone—', 'YOUR BODY IS INSANE—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['고타소는— 아— 미안—', '분홍 방은 이거 못 가져— 하아— 내 거야—'],
		en: ['Gotaso— ah— sorry—', 'The pink room doesn’t get THIS— haa— it’s mine—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['그 이름은— 아—', '입에서— 빼—'],
		en: ['That name— ah—', 'Out of your mouth—']
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'He got angry. Good. I said the wife and he is still in me. I stole a husband out of a pink room and he is going to punish me for saying it and I am going to come from that. This body did that. I love this. I am not sorry.',
		ko: '화났어. 좋아. 아내 이름을 말했는데 아직 안에 있어. 분홍 방에서 남편을 훔쳤고, 그 말 했다고 벌할 거고, 나는 그걸로 갈 거야. 이 몸이 한 거야. 이게 좋아. 안 미안해.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'The name does it. Whatever was left of the general leaves the hips. He holds her by the cheap sash and drives — angry, arrhythmic, each thrust a punishment for the word she used, and she laughs into it because that is what she wanted. She is still standing when the sound leaves her. Jeogori open on the chest. Him behind her in that clean ice-blue, already not a guest, pounding so the torn screen jumps. <b>The laugh becomes a scream.</b> The cheap screen does not hide it. The feast pretends not to hear a poor woman making a True Bone’s name — and then it cannot pretend, because she does not stop, and because she said the other name too. She comes on the second scream, loud, messy, asking for the next angry thrust before she has finished the first.',
		ko: '그 이름이 한다. 장군으로 남은 것이 허리에서 나간다. 싼 끈을 잡고 박는다 — 화나서, 박자 없이, 한 번이 그 단어에 대한 벌이고, 그녀는 그게 원하던 거라서 웃는다. 소리가 나올 때도 아직 서 있다. 저고리가 가슴에서 열려 있다. 깨끗한 얼음빛 안에서 그는 이미 손님이 아니다. 병풍이 뛰도록 박는다. <b>웃음이 비명이 된다.</b> 싼 병풍이 가려 주지 않는다. 잔치는 가난한 여자가 진골 이름을 내는 것을 안 들은 척한다 — 그리고 못 한다. 멈추지 않으니까. 다른 이름도 말했으니까. 두 번째 비명에서 가고, 크고, 지저분하고, 화난 다음 박기를 이번 것이 끝나기 전에 청한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['아아아악—!!', '빼지 마— 빼지 마—!!', '씨 줘— 아기 줘—!!', '안에 다—!!'],
		en: [
			'AH—!!',
			'DON’T PULL OUT— DON’T—!!',
			'GIVE ME YOUR BABIES—!!',
			'ALL OF IT— INSIDE—!!'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He does not last the courtesy of a first finish. He buries it — a stupid, young, endless amount, twenty-four years of unused virility spent in a woman who has not been filled in a decade — and keeps thrusting through it, wet now, louder, the milk already running down the inside of the ochre chima, over the hip, onto the cheap sash. She laughs into the scream. She thinks that is the shape of a night: one finish, then she thanks him, then he goes back to the feast. She starts to sit. The jeogori will not close over the chest. She does not try hard.',
		ko: '첫 번의 예의를 지키지 못한다. 묻는다 — 바보같고, 젊고, 끝이 없는 양, 십 년을 안 채운 여자 안에 스물넷의 안 쓴 기운 — 그리고 그 위로 계속 박는다. 이제 젖어 있고, 더 크고, 흰 젖이 이미 황토 치마 안으로, 허리로, 싼 끈으로 흐른다. 비명 속에서 웃는다. 밤의 모양이 그런 줄 안다: 한 번, 고맙다, 잔치로 돌아간다. 일어나려 한다. 저고리가 가슴 위에서 안 여며진다. 애쓰지 않는다.'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I screamed. He stayed. I was going to thank him and send him back. I am sitting up. It is over. It is over. Look at me and it will not be over.',
		ko: '소리쳤어. 남았어. 고맙다 하고 돌려보낼 거였어. 일어나. 끝이야. 끝이야. 이 몸 보면 안 끝나.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He does not go soft. He looks — open dirtied green, the chest still out, hiked ochre, milk already on the cheap sash, the waist he just ruined — and the look is worse than the thrust. <b>He looks at her and is hard again.</b> Instant. A boy staring at a used body and wanting it more than the unused one. Thirty-one did that. She sees it. She has never been looked at like that after.',
		ko: '안 죽는다. 본다 — 열린 때 묻은 초록, 아직 나온 가슴, 걷힌 황토, 싼 끈에 이미 흰 젖, 방금 망가뜨린 허리 — 그 눈이 박기보다 나쁘다. <b>보고, 다시 선다.</b> 즉시. 쓰인 몸을 보고 안 쓰인 몸보다 더 원하는 소년. 서른하나가 한 것이다. 그녀가 본다. 그 다음에는 그렇게 보인 적이 없다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['끝난 줄— 벌써 서 있어—?', '이 몸 봐서 그래— 하아— 미쳤어—'],
		en: ['I thought you were done— ALREADY—?', 'You looked at this body— haa— you’re insane—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['보면— 못 멈추겠소—', '이 몸이— YOUR BODY—'],
		en: ['If I look I can’t stop—', 'YOUR BODY IS INSANE—']
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I was going to send him back. He is looking at my chest like the lamp-line. Harder than the first time. Twenty-four and he has more. If he looks again I am going to come from the looking. Give it to me. Give me the rest of it.',
		ko: '돌려보낼 거였어. 등잔 줄 때처럼 가슴을 봐. 처음보다 더 서 있어. 스물넷인데 더 있어. 또 보면 보는 것만으로 가겠어. 줘. 나머지도 줘.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He takes her again before she has sat up. The cheap post at her back. She meant to lead. She is not leading. <b>Already?</b> The word comes out as a laugh and then it is a scream. Ice-blue still clean. Dirtied green open as far as it will go. He is twenty-four and the looking did it — not wine, not rank. The chest. The waist. The milk still on her. Her.',
		ko: '일어나기도 전에 다시 가진다. 싼 기둥이 등에. 이끌려고 했다. 이끌지 못한다. <b>벌써?</b> 웃음으로 나왔다가 비명이 된다. 얼음빛은 아직 깨끗하다. 때 묻은 초록이 열릴 수 있는 데까지 열려 있다. 스물넷. 술이 한 게 아니다. 계급이 한 게 아니다. 그 눈이 한 것이다. 가슴. 허리. 아직 묻은 흰 젖. 그녀가.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['망가뜨려— 아아악—', '누구 거야— 말해— WHOSE—'],
		en: ['Wreck me— AH—', 'WHOSE IS IT— SAY IT—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['내 거요—', '조여— 이 안이—'],
		en: ['MINE—', 'Tighten— this—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She asks it wrecked, like a prize she is handing over. <b>Whose is it.</b> The feast on the other side of the screen hears a poor woman give a True Bone the room — and the body that came with it.',
		ko: '망가진 채로 묻는다, 넘겨 주는 전리품처럼. <b>누구 거야.</b> 병풍 너머 잔치가 가난한 여자가 진골에게 방을 주는 소리를 듣는다 — 그리고 그 몸도.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Second finish. She thinks that is the night. She is shaking. She tries to close the jeogori over the chest with a hand that does not work. He looks at the wreck of the ochre and the open green and the milk on the pine and the waist he already spent in, and <b>the look is the whole third round.</b>',
		ko: '두 번째. 이번이 밤인 줄 안다. 떤다. 안 되는 손으로 가슴 위 저고리를 여미려 한다. 망가진 황토와 열린 초록과 마루의 흰 젖과 이미 싼 허리를 보고, <b>그 눈이 세 번째 전부다.</b>'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['또—? 씨발— 보지 마—', '보면 또 싸잖아— 하아— 이 몸—'],
		en: ['AGAIN—? Fuck— don’t look—', 'If you look you’ll come again— haa— this body—']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['봐서— 또 싸겠소—', '빼지— 마시오— 아기—'],
		en: ['Looking— I’m gonna again—', 'Don’t you pull out— I’ll—']
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I cannot send him back. He is looking again. I am wet from being looked at. Give me the babies. Give me the rest. I am not running this room.',
		ko: '못 돌려보내. 또 봐. 보이는 것만으로 젖어. 씨 줘. 나머지도 줘. 이 방을 운영하는 쪽이 아니야.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Then she is down against the wall and he is over her, and the dirtied green is open as far as it will go without coming off. The ochre chima is a wreck at the hip. The chest is out. His silk is still clean. That is the insult of it. He folds her in half and drives harder than before — the anger still in it, the looking still in it — a boy ruining a room because her body will not let him finish for good. She is louder than the feast. She says the name again, wrecked, like a prize, and he punishes that too, and then he looks, and it starts again. <b>She loses the room.</b> She came to steal a noble lady’s husband and she is the one being owned — shaking, dripping, asking for the next one with her legs still open.',
		ko: '벽에 내려앉고 그가 위에 있다. 때 묻은 초록이, 벗지 않고 열릴 수 있는 데까지 열려 있다. 황토 치마는 허리에서 망가졌다. 가슴이 나와 있다. 그의 비단은 아직 깨끗하다. 그게 모욕이다. 반으로 접고 전보다 세게 박는다 — 화가 아직 들어 있고, 그 눈이 아직 들어 있고 — 이 몸이 끝나게 두지 않아서 방을 망가뜨리는 소년. 잔치보다 크다. 그 이름을 또 말한다, 망가진 채로, 전리품처럼, 그것도 벌하고, 그리고 보고, 또 시작한다. <b>방을 잃는다.</b> 진골 아씨 남편을 훔치러 온 여자가, 소유당한다 — 떨며, 흘리며, 다리가 아직 열린 채로 다음을 청한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['네 거야— 네 거— 아아악—!!', '채워— 아기 줘— 더—!!', 'GIVE ME— 씨발—'],
		en: [
			'YOURS— IT’S YOURS— AH—!!',
			'FILL ME— GIVE ME YOUR BABIES— MORE—!!',
			'I’M COMING— DON’T YOU STOP—'
		]
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['또— 나오오—', '안 멈춰— 이 몸이—'],
		en: ['AGAIN— I’M—', 'I CAN’T STOP— THIS BODY—']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Every time she thinks the wick is the end, he looks. The chest. The waist. The milk. Instant. The hall from the other side of the torn screen is only two black shapes against one gold lamp — the cheap post knocking, the feast pretending the night has a clock. <b>The lamp keeps dying and he does not.</b>',
		ko: '심지가 끝인 줄 알 때마다, 본다. 가슴. 허리. 흰 젖. 즉시. 찢어진 병풍 너머 전각은 금빛 등잔 하나 앞의 검은 그림자 둘뿐이다 — 싼 기둥이 울리고, 잔치는 밤에 시계가 있는 척한다. <b>등잔은 죽어 가는데 그는 안 죽는다.</b>'
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Load after load inside her — a third, a fourth, she loses the count, the last one leaking out as fast as he puts it in, white on the dirtied green, white on the worn pine, white on the frayed red sash, white on the chest she cannot cover. Hanbok still on — just less of it. The hall smells of sex. She is hoarse. He is shaking and still in her. For the first time in this fortress <b>she is not running the room anymore.</b>',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 그 안에, 한 번이 아니다 — 세 번, 네 번, 세는 것을 잃고, 넣는 만큼 흘러나오고, 때 묻은 초록에 하얗고, 낡은 마루에 하얗고, 헐거운 붉은 끈에 하얗고, 못 가리는 가슴에 하얗다. 한복은 아직 있다 — 다만 덜 있다. 전각에 그 냄새가 있다. 목이 쉬었다. 그는 떨면서 아직 그 안에 있다. 이 성에서 처음으로 <b>방을 운영하는 쪽이 아니다.</b>'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		nsfw: true,
		html: 'I cannot sit up. He is still looking. If he looks again I will not survive it. I want him to look. I wanted his babies. I was going to ruin him. He ruined the room with this body.',
		ko: '못 일어나. 아직 봐. 또 보면 못 버텨. 봐 줬으면 좋겠어. 씨 받고 싶었어. 그 아이를 망가뜨릴 거였어. 이 몸으로 방을 망가뜨린 건 그 아이야.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['하아— 죽겠어—', '네 거였어— 남아 줘서— 씨 다—'],
		en: ['Haa— I’m wrecked—', 'It was yours— you stayed— all of it—']
	}
];

daeya.blocks.splice(start, end - start, ...newBlocks);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`milf-heat: ${end - start} → ${newBlocks.length}`);
