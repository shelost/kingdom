#!/usr/bin/env node
/** Intimate prose: keep the beats, imply more, announce less. */
import { readFileSync, writeFileSync } from 'node:fs';

const storyPath = '/Users/heewon/Documents/GitHub/kingdom/src/lib/data/story.json';
const story = JSON.parse(readFileSync(storyPath, 'utf8'));

const P = (html, ko, nsfw = true) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const M = (person, html, ko) => ({ kind: 'monologue', person, html, ko, nsfw: true });
const D = (chip, person, lines, en) => ({
	kind: 'dialogue',
	nsfw: true,
	chip,
	person,
	lines,
	en
});

function walk(blocks, fn) {
	const out = fn(blocks);
	if (out) return out;
	return blocks.map((b) => {
		if (b.kind === 'flashback' && Array.isArray(b.blocks)) {
			return { ...b, blocks: walk(b.blocks, fn) };
		}
		return b;
	});
}

function spliceHtml(blocks, startHtml, endHtml, insert) {
	const i = blocks.findIndex((b) => b.html === startHtml);
	const j = blocks.findIndex((b) => b.html === endHtml);
	if (i < 0 || j < 0 || j < i) {
		throw new Error(`splice miss: ${startHtml.slice(0, 40)} … ${endHtml.slice(0, 40)}`);
	}
	return [...blocks.slice(0, i), ...insert, ...blocks.slice(j + 1)];
}

function insertAfterHtml(blocks, afterHtml, insert) {
	const i = blocks.findIndex((b) => b.html === afterHtml);
	if (i < 0) throw new Error(`after miss: ${afterHtml.slice(0, 50)}`);
	return [...blocks.slice(0, i + 1), ...insert, ...blocks.slice(i + 1)];
}

function insertAfterEn(blocks, person, en0, insert) {
	const i = blocks.findIndex(
		(b) => b.person === person && Array.isArray(b.en) && b.en[0] === en0
	);
	if (i < 0) throw new Error(`en miss ${person} ${en0}`);
	return [...blocks.slice(0, i + 1), ...insert, ...blocks.slice(i + 1)];
}

function patchEntry(title, fn) {
	let n = 0;
	for (const ch of story) {
		for (const e of ch.entries || []) {
			if (e.title !== title) continue;
			e.blocks = walk(e.blocks || [], fn);
			n++;
		}
	}
	if (!n) throw new Error(`no entry ${title}`);
}

function patchNestedTitle(parent, nested, fn) {
	let n = 0;
	for (const ch of story) {
		for (const e of ch.entries || []) {
			if (e.title !== parent) continue;
			e.blocks = (e.blocks || []).map((b) => {
				if (b.kind === 'flashback' && b.title === nested) {
					n++;
					return { ...b, blocks: fn(b.blocks) };
				}
				return b;
			});
		}
	}
	if (!n) throw new Error(`no nested ${parent}/${nested}`);
}

// ——— Maehwa feast ———
patchEntry('Daeya Fortress', (blocks) => {
	if (!blocks.some((b) => b.html?.startsWith('What follows is not a kiss'))) return null;
	return spliceHtml(
		blocks,
		'What follows is not a kiss. She sits him on the worn pine in that clean ice-blue and climbs on — ochre hiked, jeogori already a veil, the heavy chest in his face so he has to see it. She meant to lead. She takes his hands and puts them on her tits herself, like a lesson. <b>This milf will teach you.</b> He does not hear the lesson. He hears skin. He grabs like a dog that has never been fed, kneading, burying his mouth in the chest, a rabid animal whose whole mind is the next squeeze, the next wet, the hole he is already pushing up into. No rank. No wife in the pink room. Only this.',
		'They look. That is the whole end. A poor woman and a True Bone boy, wrecked on cheap pine, still joined, his hands still on her chest as if letting go would unmake the night. They are completely in love. The feast will not know what to do with that.',
		[
			P(
				'What follows is not a kiss. She sits him on the worn pine in that still-clean ice-blue and climbs on — ochre hiked, jeogori already a veil, the chest in his face so he has nowhere else to look. She takes his hands and puts them where she wants them. She meant to lead.',
				'그다음이 입맞춤이 아니다. 아직 깨끗한 얼음빛 그대로 낡은 마루에 앉히고 올라탄다 — 황토는 걷히고, 저고리는 이미 너울, 젖이 얼굴에 와서 다른 데를 볼 수가 없다. 제 손으로 그의 손을 원하는 곳에 얹는다. 이끌려고 했다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['가만히. 내가 할게.', '그렇게… 그래.'],
				['Stay still. Let me.', 'Like that… yes.']
			),
			D(
				'#7aa8d8',
				'pumsuk',
				['무거워…', '입—'],
				['They’re heavy…', 'Mouth—']
			),
			M(
				'pumsuk',
				'I should stop. I am not stopping. Both hands full. The rest of the hall can wait.',
				'멈춰야 한다. 안 멈춘다. 두 손이 가득하다. 전각의 나머지는 기다려도 된다.'
			),
			P(
				'She keeps the teacher-voice for three drops of her hips. Then it thins. He is in her to the base, and every time she lifts he follows — a thrust that knocks the cheap post. His hands never leave. She meant to laugh. A sound comes out that is not a laugh.',
				'세 번 앉을 때까지는 선생님 목소리다. 그러다 얇아진다. 밑까지 들어와 있고, 그녀가 일어날 때마다 그가 받아 박아서 싼 기둥이 운다. 손은 안 떨어진다. 웃으려 했다. 웃음이 아닌 소리가 나온다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['하아— 천천히. 그렇게 세게 안 해도—', '검일은 이렇게 안 해. 내가—'],
				['Haa— slow. You don’t have to go that hard—', 'Gumil never— I’ll—']
			),
			D(
				'#c98fb0',
				'gumilwife',
				['아… 잠깐. 그거… 거기…', '맛있어. 씨…', '이렇게 서 있어?'],
				['Ah… wait. That… there…', 'It feels good. Fuck…', 'You’re this hard?']
			),
			P(
				'The turning point is a breath she cannot finish. She looks at his face as if she had not seen it until now — twenty-four, ice-blue still clean, mouth open on her chest. The lesson is over. She comes the first time with a moan she tries to swallow. Then she looks at him, and that look is the rest of the night.',
				'전환점은 못 끝낸 숨이다. 이제야 얼굴을 본다 — 스물넷, 얼음빛은 아직 깨끗하고, 젖에 입이 열려 있다. 수업이 끝난다. 첫 번은 삼키려다 못 삼킨 신음으로 간다. 그리고 그를 본다. 그 눈이 남은 밤 전부다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['하아— 너…', '고타소는— 아— 미안—', '분홍 방은… 이거 못 가져—'],
				['Haa— you…', 'Gotaso— ah— sorry—', 'The pink room doesn’t… get this—']
			),
			D(
				'#7aa8d8',
				'pumsuk',
				['그 이름은— 입에서 빼—'],
				['That name— out of your mouth—']
			),
			M(
				'gumilwife',
				'He got angry. Good. I said the wife and he is still in me. I was going to teach him. I am not teaching.',
				'화났어. 좋아. 아내 이름을 말했는데 아직 안에 있어. 가르치려 했어. 안 가르쳐.'
			),
			P(
				'The name does it. Whatever was left of the general leaves the hips. He holds her by the cheap sash and the chest at once and drives until she cannot keep the teacher-voice even as a joke. She is still astride when the sound leaves her. <b>The laugh becomes a scream.</b> The cheap screen does not hide it. She comes on the second scream — and then the water comes with it, ice-blue finally stained, his lap, the ochre, the pine, a shameful hot spray she cannot stop. She laughs into the scream because that is not what she came here to do.',
				'그 이름이 한다. 장군으로 남은 것이 허리에서 나간다. 싼 끈과 가슴을 한꺼번에 잡고, 선생님 목소리를 농담으로도 못 붙들게 박는다. 소리가 나와도 아직 타고 있다. <b>웃음이 비명이 된다.</b> 싼 병풍이 가려 주지 않는다. 두 번째 비명에서 가고 — 물이 따라온다. 얼음빛이 드디어 젖고, 무릎, 황토, 마루, 못 멈추는 뜨거운 물. 이러려고 온 게 아니라서 비명 속에서 웃는다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['아아—!!', '빼지 마—', '안에—'],
				['Ah—!!', 'Don’t pull out—', 'Inside—']
			),
			P(
				'He does not last the courtesy of a first finish. He buries it and keeps moving through the water she put on him. She thinks that is the shape of a night: one, then thank you, then back to the feast. She starts to sit. The jeogori will not close. She does not try hard.',
				'첫 번의 예의를 지키지 못한다. 묻고, 그녀가 싼 물 위로 계속 움직인다. 밤의 모양이 그런 줄 안다: 한 번, 고맙다, 잔치로 돌아간다. 일어나려 한다. 저고리가 안 여며진다. 애쓰지 않는다.'
			),
			M(
				'gumilwife',
				'I screamed. He stayed. I was going to send him back. Look at me and it will not be over.',
				'소리쳤어. 남았어. 돌려보낼 거였어. 이 몸 보면 안 끝나.'
			),
			P(
				'He does not go soft. He looks — <b>the jeogori fallen off the shoulders like a veil</b>, the hip the ochre cannot keep, water and white already on the cheap sash — and the look is worse than the thrust. <b>He looks at her and is hard again.</b> His hands go back before he has a word. She sees it. She has never been looked at like that after.',
				'안 죽는다. 본다 — <b>저고리가 어깨에서 너울처럼 내려가 있다</b>, 황토가 못 가리는 엉덩이, 싼 끈에 이미 물과 흰 것 — 그 눈이 박기보다 나쁘다. <b>보고, 다시 선다.</b> 말이 나오기 전에 손이 돌아간다. 그녀가 본다. 그 다음에는 그렇게 보인 적이 없다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['끝난 줄— 벌써—?'],
				['I thought you were done— already—?']
			),
			P(
				'He takes her again before she has sat up. She meant to lead. She is not leading. <b>Already?</b> comes out as a laugh and then it is not a laugh. Then she is the one dropping — ochre wrecked at the hip, the cheap post knocking on every fall, first finish still leaking. The teacher is gone.',
				'일어나기도 전에 다시 가진다. 이끌려고 했다. 이끌지 못한다. <b>벌써?</b> 웃음으로 나왔다가 웃음이 아니게 된다. 그러고 떨어뜨리는 쪽이 그녀다 — 황토는 허리에서 망가졌고, 떨어질 때마다 싼 기둥이 울리고, 첫 한이 아직 흐른다. 선생님은 없다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['젊은 놈… 하아—', '남아—'],
				['You taste so young… haa—', 'Stay—']
			),
			P(
				'Second finish. She thinks that is the night. She tries to close the jeogori with a hand that does not work. He looks at the wreck of the ochre and the open green and the waist he already spent in, and <b>the look is the whole third round.</b>',
				'두 번째. 이번이 밤인 줄 안다. 안 되는 손으로 저고리를 여미려 한다. 망가진 황토와 열린 초록과 이미 싼 허리를 보고, <b>그 눈이 세 번째 전부다.</b>'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['또—? 보지 마—', '보면…'],
				['Again—? Don’t look—', 'If you look—']
			),
			P(
				'Then she is down against the wall and he is over her. Ice-blue stained with her. He folds her and drives — not rank, not a guest. She is louder than the feast. <b>She loses the room.</b> She came to steal a noble lady’s husband. She is the one shaking, asking without asking, legs still open.',
				'벽에 내려앉고 그가 위에 있다. 얼음빛은 그녀로 젖었다. 접고 박는다 — 계급도 손님도 아니다. 잔치보다 크다. <b>방을 잃는다.</b> 진골 아씨 남편을 훔치러 온 여자가, 떤다. 묻지 않고 청한다. 다리는 아직 열려 있다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['채워— 더—', '가— 멈추지 마—'],
				['Fill— more—', 'I’m— don’t you stop—']
			),
			P(
				'Every time she thinks the wick is the end, he looks. Instant. The hall from the other side of the torn screen is only two black shapes against one gold lamp. The feast pretends the night has a clock. <b>The lamp keeps dying and he does not.</b>',
				'심지가 끝인 줄 알 때마다, 본다. 즉시. 찢어진 병풍 너머 전각은 금빛 등잔 하나 앞의 검은 그림자 둘뿐이다. 잔치는 밤에 시계가 있는 척한다. <b>등잔은 죽어 가는데 그는 안 죽는다.</b>'
			),
			P(
				'<b>They do not stop until the lamp dies.</b> She loses the count. Hanbok still on — just less of it. She is hoarse. He is shaking and still in her, still holding on as if letting go would unmake the night.',
				'<b>등잔이 죽을 때까지 멈추지 않는다.</b> 세는 것을 잃는다. 한복은 아직 있다 — 다만 덜 있다. 목이 쉬었다. 그는 떨면서 아직 그 안에 있고, 손을 놓으면 밤이 없어질 것처럼 아직 잡고 있다.'
			),
			M(
				'gumilwife',
				'I cannot sit up. If he looks again I will not survive it. I want him to look. I was going to ruin him. That is the room now.',
				'못 일어나. 또 보면 못 버텨. 봐 줬으면 좋겠어. 그 아이를 망가뜨릴 거였어. 이제 방이 그거다.'
			),
			D(
				'#c98fb0',
				'gumilwife',
				['하아— 죽겠어—', '남아 줘서—'],
				['Haa— I’m wrecked—', 'You stayed—']
			),
			D('#7aa8d8', 'pumsuk', ['나도…', '이 방이.'], ['Me too…', 'This room.']),
			P(
				'They look. That is the whole end. A poor woman and a True Bone boy, wrecked on cheap pine, still joined. The feast will not know what to do with that.',
				'본다. 그게 끝의 전부다. 가난한 여자와 진골 소년, 싼 마루에서 망가지고, 아직 붙어 있다. 잔치는 그걸 어떻게 할지 모를 것이다.'
			)
		]
	);
});

// ——— Munhee: cut the thesis ———
patchNestedTitle('Gotaso’s Wedding', 'the closed months', (blocks) =>
	blocks.map((b) => {
		if (b.html?.startsWith('<b>They fit.</b>')) {
			return P(
				'<b>They fit.</b> Not the polite fit of a well-arranged marriage. He bottoms out and she makes a noise like she has been waiting for that exact depth, and then she laughs into it because the next one is already coming. Neither pretends otherwise.',
				'<b>둘이 맞는다.</b> 잘 짜인 혼사의 예의 바른 맞춤이 아니다 — 끝까지 들어가면 그 깊이를 기다리던 소리가 나고, 다음이 이미 와서 웃는다. 아닌 척하지 않는다.'
			);
		}
		if (b.html?.startsWith('<b>Months pass before')) {
			return P(
				'<b>Months pass before either of them remembers the yard</b>. When they finally open the door she walks like someone who has been filled until walking is a joke, and the pink silk will not stay clean. They look at each other like people who have won a private war, and are finally willing to put clothes back on for an afternoon.',
				'<b>둘 중 누구든 마당을 다시 떠올리기까지 몇 달이 걸린다</b>. 마침내 문을 열었을 때 그녀는 채워져서 걷기가 농담이 된 사람처럼 걷고, 분홍 비단은 깨끗하지가 않다. 둘은 사사로운 전쟁에서 이긴 사람처럼 서로를 보고, 겨우 오후 한나절 정도는 옷을 다시 입을 마음이 생긴다.'
			);
		}
		return b;
	})
);

// ——— First Kim look ———
patchEntry('The First Kim', (blocks) => {
	if (!blocks.some((b) => b.html?.startsWith('They finish looking at his back'))) return null;
	return blocks.map((b) => {
		if (b.html?.startsWith('They finish looking at his back')) {
			return P(
				'They finish looking at his back before they finish looking at his face. Then their eyes go lower — wet chest, the dark water at his hips, what the spring is not hiding — and stay. Someone’s breath catches. Golhwa’s mouth does not close. Hyullé’s silk between the knees darkens. Narim is sitting like an eldest and the eldest is soaked through. Nobody says whose ledge it is. They just stand closer than the last one will allow.',
				'얼굴보다 등을 먼저 다 본다. 그다음 눈이 아래로 가서 — 젖은 가슴, 허리의 검은 물, 샘이 감춰 주지 않는 것 — 머물고, 누가 숨을 걸는다. 골화의 입이 다물어지지 않는다. 혈레의 무릎 사이 비단이 어두워진다. 나림은 언니처럼 앉아 있고 언니가 다 젖었다. 누구 턱인지는 말하지 않는다. 그냥, 앞사람이 허락하는 것보다 더 가까이 선다.'
			);
		}
		if (b.html?.startsWith('Put him in a panel')) {
			return M(
				'golhwa',
				'Chest. The water at his hips. I will look at that and nothing else.',
				'가슴. 허리의 물. 그것만 볼래.'
			);
		}
		if (b.html?.startsWith('First a wet shoulder')) {
			return P(
				'First a wet shoulder. Then silk sitting on a breast as if it were tired of being cloth. Then three faces he cannot stop at. Heat hits him low. The waterline he is using as a wall is doing the opposite of hiding him. Golhwa’s legs are already open on the far rock. Hyullé’s knees are together, gaze down. The spring story is already a lie in his mouth.',
				'먼저 젖은 어깨. 천이기를 지친 것처럼 가슴에 앉은 비단. 얼굴에서 멈추지 못하는 얼굴 셋. 열이 아래서 온다. 벽으로 쓰는 수선이 오히려 드러낸다. 맞은편 바위에서 골화의 다리가 벌어져 있다. 혈레의 무릎은 모아져 있고 눈은 아래. 샘 이야기는 이미 입 안에서 거짓말이다.'
			);
		}
		return b;
	});
});

// ——— Yuhwa copper ———
patchEntry('Jumong', (blocks) => {
	if (!blocks.some((b) => b.html === 'The copper is already hot. He puts her back to it anyway. Wet river-silk hiked to the hip, her thighs around a sun-god who has never learned to be gentle with an hour. She guides him in with a wet hand — the same hand that washed her hair for heaven — and when he bottoms out she laughs like she meant the looking.'))
		return null;
	return spliceHtml(
		blocks,
		'The copper is already hot. He puts her back to it anyway. Wet river-silk hiked to the hip, her thighs around a sun-god who has never learned to be gentle with an hour. She guides him in with a wet hand — the same hand that washed her hair for heaven — and when he bottoms out she laughs like she meant the looking.',
		'He fucks her through the heat of the wall. Gold on wet skin. Each thrust knocks a sound out of her that the river throws back. She comes first, loud, looking up as if heaven were still watching — and then he buries it, a god’s stupid amount, white mixing with river-water down her thigh, and he does not pull out, because she told him not to, and because the hour is already ruined.',
		[
			P(
				'The copper is already hot. He puts her back to it anyway. Wet river-silk hiked. She guides him in with the same hand that washed her hair for heaven, and when he bottoms out she laughs like she meant the looking.',
				'구리는 이미 뜨겁다. 그래도 등을 민다. 젖은 강 비단이 걷힌다. 하늘을 위해 머리를 감던 그 손으로 넣고, 끝까지 들어오면, 올려다보던 게 이거였다는 듯이 웃는다.'
			),
			D(
				'#8fc4e0',
				'yuhwa',
				['하아—', '더… 구리에—'],
				['Haa—', 'More… against the copper—']
			),
			D(
				'#7fc4e8',
				'haemosu',
				['시각을 어겼다.', '이름— 이제—'],
				['I broke the hour.', 'Your name— now—']
			),
			D(
				'#8fc4e0',
				'yuhwa',
				['유화— 유화예요—', '빼지 마—'],
				['Yuhwa— Yuhwa—', 'Don’t pull out—']
			),
			P(
				'Each thrust knocks a sound out of her that the river throws back. She comes first, looking up as if heaven were still watching. Then he buries it — gold on wet skin, white mixing with river-water down her thigh — and he does not pull out, because she told him not to, and because the hour is already ruined.',
				'한 번이 한 소리를 내고 강이 되던진다. 그녀가 먼저 간다, 하늘이 아직 보는 것처럼 위를 보고. 그리고 그가 묻는다 — 젖은 살 위의 금, 허벅지로 강물과 섞이는 하얗게 — 안 뺀다. 빼지 말라고 했으니까. 시각은 이미 깨졌으니까.'
			)
		]
	);
});

// ——— Sosuno grain ———
patchEntry('Jumong', (blocks) => {
	if (!blocks.some((b) => b.html?.startsWith('The grain-room lamp.'))) return null;
	return spliceHtml(
		blocks,
		'The grain-room lamp. Dusty-rose hiked. She still pretends the count is what she came for until his cock is in her from behind, one hand on the open ledger, and she is not pretending. Tsundere breaks on the first thrust. She wanted this from the porch. She will not say it first. She says it now.',
		'He spends in her against the grain sacks — a fugitive’s unused load, messy, the dusty-rose already ruined at the hip. She laughs into the timber because she lost the count on purpose. Messy hair. Spent. She will found a country on this hunger. Tonight she just wants the next one.',
		[
			P(
				'The grain-room lamp. Dusty-rose hiked. She still pretends the count is what she came for until he is in her from behind, one of her hands still on the open ledger. The first thrust takes the pretence. She wanted this from the porch. She will not say it first.',
				'곡식방 등잔. 먼지로즈가 걷혀 있다. 셈하러 온 척하다가, 뒤에서 들어오고, 한 손은 아직 열린 장부에. 첫 찌름에 척이 끝난다. 누대에서부터 원했다. 먼저 말은 안 했다.'
			),
			D(
				'#e8a04a',
				'sosuno',
				['뒤에서— 아— 얼굴은 보지 마—', '장부는… 나중에—'],
				['From behind— ah— don’t look at my face—', 'The ledger… later—']
			),
			D('#e8563f', 'jumong', ['받아—', '장부는 내일—'], ['Take it—', 'The ledger is tomorrow—']),
			P(
				'He spends against the grain sacks — messy, the dusty-rose already ruined at the hip. She laughs into the timber because she lost the count on purpose. Tonight she just wants the next one.',
				'곡식 가마니에 대고 싼다 — 지저분하고, 먼지로즈는 이미 허리에서 망가졌다. 일부러 셈을 잃어서 들보에 웃는다. 오늘 밤은 다음이 고프다.'
			)
		]
	);
});

// ——— Suro / Heo tent ———
patchEntry('Gaya, the Lost Nations', (blocks) => {
	if (!blocks.some((b) => b.html?.startsWith('The lamp makes two skins.'))) return null;
	return spliceHtml(
		blocks,
		'The lamp makes two skins. His Gaya-gold, hers Ayuta-brown — chocolate at the hip, violet silk bunched so the ass he has been staring at since the dais is in his hands, tight, foreign, nothing this coast has a word for. He puts it in from behind. She is twenty-one and wet for a king she just taught to speak. He is a king who has never had a woman this color under him, and he says so, wrecked, like a prayer he should not say out loud.',
		'She rides him the second night. Violet off the shoulders. Gold tiger-pins in the lamp. Pale Gaya hands on dark hips. He watches her bounce and loses the language again, except the one word he should not have: chocolate. She laughs and calls him oppa while she cums, then king while he nuts, a load spent in a princess who crossed a sea to be filled by this specific man.',
		[
			P(
				'The lamp makes two skins. His Gaya-gold, hers Ayuta-brown. Violet bunched in his hands — the hip he has been staring at since the dais. He puts it in from behind. She is twenty-one and wet for a king she just taught to speak. He has no word for what the lamp is doing to the two of them, and that is the point.',
				'등잔이 살 둘을 만든다. 그의 가야 금빛, 그녀의 아유타 갈색. 자줏빛이 손에 뭉친다 — 대청부터 보던 허리. 뒤에서 넣는다. 스물하나. 방금 말 가르친 왕에게 젖어 있다. 등잔이 둘에게 하는 일에 쓸 말이 없고, 그게 요점이다.'
			),
			D(
				'#e0a33c',
				'suro',
				['조여—', '이 해안에… 이런 건 없었소—'],
				['Squeeze—', 'This coast… never had this—']
			),
			D(
				'#d98fa8',
				'heohwangok',
				['오빠— 왕— 더—', '안에… 싸 주세요—'],
				['Oppa— my king— harder—', 'Inside… please—']
			),
			P(
				'She rides him the second night. Violet off the shoulders. Gold tiger-pins in the lamp. Pale Gaya hands on dark hips. He watches and loses the language again. She laughs and calls him oppa when she goes, then king when he does — a princess who crossed a sea for this specific man.',
				'둘째 밤은 그녀가 탄다. 어깨에서 자줏빛. 등잔의 금 호랑이 비녀. 창백한 가야 손이 어두운 허리에. 보다가 또 말을 잃는다. 가면서 오빠라 부르고 웃고, 그가 쌀 때는 왕이라 부른다. 이 사내를 위해 바다를 건넌 공주.'
			)
		]
	);
});

// leftover Heo lines that still lecture brown
patchEntry('Gaya, the Lost Nations', (blocks) => {
	const i = blocks.findIndex(
		(b) =>
			b.person === 'heohwangok' &&
			Array.isArray(b.en) &&
			b.en[0]?.startsWith("Oppa’s— the king’s")
	);
	if (i < 0) return null;
	const next = [...blocks];
	next[i] = D(
		'#d98fa8',
		'heohwangok',
		['오빠 거— 왕 거— 아아—', '빼지 마— 다—'],
		["Oppa’s— the king’s— ah—", 'Don’t pull out— all of it—']
	);
	return next;
});

// ——— Ibiga ———
patchEntry('Gaya, the Lost Nations', (blocks) => {
	const i = blocks.findIndex(
		(b) =>
			b.person === 'ibiga' &&
			Array.isArray(b.en) &&
			b.en.some((l) => l.includes('between your thighs'))
	);
	if (i < 0) return null;
	const next = [...blocks];
	next[i] = {
		kind: 'dialogue',
		chip: '#7c6cf0',
		person: 'ibiga',
		lines: [
			'네 이름… 바른 경치라.',
			'보면 볼수록… 바르지 않은 생각이 든다.'
		],
		en: [
			'Your name… Right View.',
			'The longer I look, the less rightful my thoughts become.'
		]
	};
	const kneel = next.findIndex(
		(b) => b.person === 'jeonggyeon' && Array.isArray(b.en) && b.en.includes('All the way.')
	);
	if (kneel < 0) throw new Error('ibiga kneel');
	next.splice(kneel + 1, 0, {
		kind: 'p',
		nsfw: true,
		html: 'Cloud covers the ridge. What happens under it is not for the song. By the time the cloud thins, neither of them is kneeling, and neither of them has let go.',
		ko: '구름이 능선을 덮는다. 그 아래에서 일어나는 일은 노래의 것이 아니다. 구름이 옅어질 때쯤이면, 둘 다 무릎은 아니며, 둘 다 놓지 않았다.'
	});
	return next;
});

// ——— Sunduk empty hall ———
patchEntry('Gotaso’s Wedding', (blocks) => {
	const i = blocks.findIndex(
		(b) =>
			b.html ===
			'For a moment she does not answer, and the moment is long enough that both of them will spend years deciding what it meant.'
	);
	if (i < 0) return null;
	const insert = [
		P(
			'Her fingers are still on his mouth. He does not take the next step. The lamp between them does the looking. When she speaks again she is already Queen.',
			'손끝은 아직 그의 입에 있다. 그는 다음 걸음을 떼지 않는다. 둘 사이의 등잔이 본다. 다시 말할 때 그녀는 이미 여왕이다.'
		)
	];
	return [...blocks.slice(0, i + 1), ...insert, ...blocks.slice(i + 1)];
});

// ——— Yushin cavern: unfinished ———
patchNestedTitle('Bidam’s Rebellion', 'the lake, again', (blocks) => {
	const i = blocks.findIndex(
		(b) =>
			b.person === 'golhwa' &&
			Array.isArray(b.en) &&
			b.en[1] === 'She is not in the water, Yushin. We are.'
	);
	if (i < 0) return null;
	const next = [
		...blocks.slice(0, i + 1),
		P(
			'She takes his wrist under the water and does not wait for the Queen’s name to finish. For a few breaths there is only steam, and the walk they already know, and a marshal who cannot keep his arithmetic. Then Narim’s voice cuts the wick.',
			'물 속에서 손목을 잡고, 여왕의 이름이 끝나기를 기다리지 않는다. 몇 숨은 김뿐이고, 이미 아는 걸음뿐이고, 셈을 지키지 못하는 장군뿐이다. 그러다 나림의 목소리가 심지를 자른다.'
		),
		...blocks.slice(i + 1)
	];
	return next.map((b) => {
		if (b.html?.startsWith('The night before the tenth day')) {
			return {
				...b,
				nsfw: true,
				html: 'The night before the tenth day at the Fortress of Radiance, Yushin undresses without ceremony. The three are already in the steam — mentors, tormentors, the only room in Silla where no one asks him for a victory. Golhwa’s legs are already open. Hyullé’s knees are already pressed, eyes down, silk ruined. The spring does not hide much. He pretends the water is arithmetic.',
				ko: '명활성의 열흘째를 앞에 둔 밤, 유신은 격식 없이 옷을 벗는다. 셋은 이미 김 속에 있다 — 스승이자 장난꾼, 신라에서 승리를 요구하지 않는 유일한 방. 골화의 다리는 이미 벌어져 있다. 혈레의 무릎은 이미 모아져 있고 눈은 아래, 비단은 이미 망가졌다. 샘이 감춰 주는 게 없다. 물을 산술인 척한다.'
			};
		}
		return b;
	});
});

// ——— Euija descent catalog → implied ———
patchEntry('Euija’s Descent', (blocks) => {
	const start = blocks.findIndex((b) => b.html?.startsWith('The feast is no longer a feast.'));
	const end = blocks.findIndex((b) => b.html?.startsWith('His face finds a hip.'));
	if (start < 0 || end < 0) return null;
	return [
		...blocks.slice(0, start),
		P(
			'The feast is no longer a feast. Robes forget how to stay closed. Knees find laps. He does not bother to hide what the wine has done. The maids show him their bodies the way other courts show tribute.',
			'잔치는 이제 잔치가 아니다. 옷이 여며지는 법을 잊는다. 무릎이 무릎을 찾는다. 술이 자기에게 한 일을 숨길 생각도 없다. 궁녀들은 다른 조정이 공물을 보이듯 몸을 보인다.'
		),
		P(
			'The stories say three thousand. The room is not that. It is still too many — a hall so packed the lamp never finds a wall. They kneel in ranks. Two at a time find his lap. The dark trousers tell it first.',
			'전설은 삼천이라 한다. 이 방은 그게 아니다. 그래도 너무 많다 — 등이 벽을 찾지 못할 만큼 들어찬 전각. 열 지어 무릎을 꿇는다. 둘씩 무릎을 찾는다. 검은 바지가 먼저 말한다.'
		),
		P(
			'The hall is Sabi: vermilion columns, yellow wood, lamps on a wet floor. They fill it. They pour bent at the waist. Ribbons come undone. They compete to be seen, and then they stop competing, because he has already chosen with his hands.',
			'전각은 사비다. 주홍 기둥, 누런 나무, 젖은 마루 위의 등. 그들이 채운다. 허리를 숙여 따른다. 고름이 풀린다. 보이려고 다투다가, 다툼을 그만둔다. 손이 이미 골랐으니까.'
		),
		P(
			'A hem lifts. A maid finds his lap. His mouth finds the silk. The rest of the night is the sound of that — wine-wet, laughing into the lamp, until even the lattice has an opinion.',
			'자락이 들린다. 궁녀가 무릎을 찾는다. 입이 비단을 찾는다. 남은 밤은 그 소리다 — 술에 젖고, 등불 앞에서 웃고, 살창까지 의견을 가질 때까지.'
		),
		P(
			'The maids are twenty. Not girls. <b>She looks back.</b> <b>His hand finds the silk at her waist.</b> Less clothes. More lamp. The jeogori does not stay on the shoulder. They gasp and laugh in his face.',
			'궁녀들은 스물이다. 아이가 아니다. <b>그녀는 돌아본다</b>. <b>그의 손이 허리의 비단을 찾는다</b>. 옷은 더 적다. 등은 더 많다. 저고리는 어깨에 남아 있지 않는다. 그의 얼굴 앞에서 헐떡이고 웃는다.'
		),
		...blocks.slice(end + 1)
	];
});

writeFileSync(storyPath, JSON.stringify(story, null, '\t') + '\n');
console.log('ok');
