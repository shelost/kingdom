import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const D = (person, chip, en, lines, extra = {}) => ({
	kind: 'dialogue',
	chip,
	person,
	en,
	lines,
	...extra
});
const P = (html, ko, extra = {}) => ({ kind: 'p', html, ko, ...extra });
const M = (person, html, ko, extra = {}) => ({ kind: 'monologue', person, html, ko, ...extra });

const firstKimBlocks = [
	P(
		'Years before the marshal. <b>Kim Seohyeon</b> is not looking for a shrine. He is looking for water. The horse blows wet air. The bright-blue robe sticks between his shoulders. Heat comes out of the stone like a mouth.',
		'원수보다 몇 해 전. <b>김서현</b>은 사당을 찾는 것이 아니다. 물을 찾는다. 말이 젖은 숨을 분다. 밝은 푸른 도포가 어깨 사이에 붙는다. 돌에서 열이 난다. 입처럼.'
	),
	P(
		'He names it a spring. A village bath, if the road is unkind. Then a laugh that does not belong to any village he knows. He should turn the horse. He does not.',
		'샘이라고 이름 붙인다. 길이 고약하면 마을 목욕탕. 그러다 마을 것이 아닌 웃음. 말을 돌려야 한다. 안 돌린다.'
	),
	P(
		'Under the hill the water has no need of faces. It has been a bird, a wet light, an old woman at a well that was never a well. They have not seen a man in centuries.',
		'언덕 아래 물은 얼굴이 필요 없다. 새였고, 젖은 빛이었고, 우물이 아닌 우물가의 노파였다. 남자를 본 지가 몇 백 년이다.'
	),
	P(
		'The boredom lives between the knees. Nothing to look at. Nothing that looks back. The steam has been doing the looking for them.',
		'심심함이 무릎 사이에 산다. 볼 것이 없다. 다시 보는 것이 없다. 김이 대신 보고 있다.',
		{ nsfw: true }
	),
	D(
		'golhwa',
		'#e0783a',
		[
			'Unnie. I’m going to say something stupid.',
			'If I have to be mist for another century I am going to start chewing the rock. A man. Any man. I want him to look and then I want him to have to sit down.'
		],
		[
			'언니. 바보 같은 말 할 거야.',
			'한 백 년 더 안개로 살면 돌 씹기 시작할 거야. 남자. 아무 남자. 보게 하고, 앉을 수밖에 없게 하고 싶어.'
		],
		{ nsfw: true }
	),
	D(
		'hyulle',
		'#6ec4c9',
		[
			'We can be anything…',
			'A bird. Mist. Let him take the water and go. I don’t want to want him already. I haven’t even—'
		],
		['아무거나 될 수 있잖아…', '새로. 안개로. 물만 떠 가게 해도 돼. 이미 원하고 싶지가 않아. 아직—']
	),
	D(
		'narim',
		'#5fad6e',
		[
			'If we’re a bird he won’t look. If we’re a crone he runs.',
			'So women. Sit so the silk sticks. I pick.'
		],
		['새면 안 봐. 노리면 도망가.', '그러니까 여자로. 비단이 붙게 앉아. 내가 골라.']
	),
	P(
		'They take the shapes the way a hand takes a pin. Olive silk. Coral silk. Pale blue that will not stay closed. Three beautiful women on the far rock, as if the hill had always kept them that way.',
		'형상을 고른다. 비녀를 집듯. 올리브 비단. 산호 비단. 여며지지 않는 옅은 파랑. 맞은편 바위에 예쁜 여자 셋, 언덕이 처음부터 그렇게 두었던 것처럼.'
	),
	P(
		'He is still calling it a spring when the hill opens under his foot.',
		'아직 샘이라 부르는 중에 언덕이 발 밑에서 열린다.'
	),
	P(
		'He comes up in a bowl of black water under stone that has a rule he does not know yet.',
		'돌 아래 검은 물의 사발에서 올라온다. 아직 법이 있는 줄 모른다.'
	),
	P(
		'The robe falls because every man who has been this wet does the same with his hands. Silk off, or it drowns you. Bright blue on the stone.',
		'도포가 내린다. 이만큼 젖은 남자라면 누구나 같은 손을 쓴다. 벗지 않으면 물에 끌려간다. 밝은 푸른 비단이 돌 위에.'
	),
	P(
		'He still thinks he is alone. He walks into the steam.',
		'아직 혼자인 줄 안다. 김 속으로 걸어 들어간다.'
	),
	P(
		'Time drops in the steam. The water goes still. They have never seen a Kim. Golhwa’s mouth opens and does not close. A thread of wet finds her lip. Hyullé’s thighs press the rock and stay there. Narim’s jeogori turns honest and she hears herself swallow.',
		'김 속에서 시간이 떨어진다. 물이 멈춘다. 김을 본 적이 없다. 골화의 입이 열리고 다물어지지 않는다. 젖은 실이 입술에 붙는다. 혈레의 허벅지가 바위를 누르고 그대로 있다. 나림의 저고리가 솔직해지고, 삼키는 소리가 들린다.',
		{ nsfw: true }
	),
	M(
		'golhwa',
		'If I do not put my mouth on that line of his back I will make a sound. I have not had a clean thought since he hit the surface. In, out, on him, under him — I am not picking. I am drooling on the rock like a dog.',
		'등줄기에 입을 안 대면 소리가 난다. 수면에 떨어진 뒤로 깨끗한 생각이 없다. 넣고, 빼고, 그 위에, 그 밑에 — 고르는 게 아니야. 개처럼 바위에 침을 흘리고 있어.',
		{ nsfw: true }
	),
	M(
		'hyulle',
		'Do not stare at the waist. I am already making the sound in my head. I want him in my mouth and I want him slower than that and I hate both and I am wetter than the ledge. If he turns I will die. If he does not turn I will die.',
		'허리 보지 마. 머리 속에서는 이미 소리가 났다. 입에 넣고 싶고 그것보다 느리게 하고 싶고 둘 다 싫고 턱보다 젖어 있어. 돌리면 죽어. 안 돌려도 죽어.',
		{ nsfw: true }
	),
	M(
		'narim',
		'Counsel. I am sitting like an eldest. The eldest is soaked through. Look at his throat. Don’t. They are already dividing him and I have not said a word.',
		'조언. 언니처럼 앉아 있다. 언니가 다 젖었다. 목구멍 봐. 보지 마. 말은 한 마디도 안 했는데 벌써 그를 나누고 있다.',
		{ nsfw: true }
	),
	P(
		'They finish looking at his back before they finish looking at his face. Then their eyes go lower, and stay, and someone’s breath catches as if the water had touched a nerve.',
		'얼굴보다 등을 먼저 다 본다. 그다음 눈이 아래로 가서 머물고, 누가 숨을 걸는다. 물이 신경을 건드린 것처럼.',
		{ nsfw: true }
	),
	P(
		'He does not step out of the water. He stands as if the black bowl were a wall he is holding in front of himself. He forgets the horse.',
		'물 밖으로 나오지 않는다. 검은 사발이 제 앞에 세운 벽인 것처럼 선다. 말을 잊는다.',
		{ nsfw: true }
	),
	P(
		'First a wet shoulder. Then silk sitting on a breast as if it were tired of being cloth. Then three faces he cannot stop at. Heat hits him low. The spring story is already a lie in his mouth.',
		'먼저 젖은 어깨. 천이기를 지친 것처럼 가슴에 앉은 비단. 얼굴에서 멈추지 못하는 얼굴 셋. 열이 아래서 온다. 샘 이야기는 이미 입 안에서 거짓말이다.',
		{ nsfw: true }
	),
	D(
		'seohyeon',
		'#3E8EF0',
		['Who…', 'Who lives here. I was looking for water.'],
		['누구…', '여긴 누가 사는 곳이오. 물을 찾았소.']
	),
	D(
		'narim',
		'#5fad6e',
		['We do. You fell.', 'Sit down before you fall in again.'],
		['우리가 살아요. 당신은 떨어졌고요.', '또 빠지기 전에 앉아요.']
	),
	P(
		'Water against rock. Nobody takes the next line for a moment. Golhwa is already in the water up to the knee, as if she had forgotten there was a conversation.',
		'바위에 물. 한동안 다음 말을 아무도 안 한다. 골화는 이미 무릎까지 물에 들어가 있다. 대화가 있는 줄 잊은 것처럼.',
		{ nsfw: true }
	),
	D(
		'golhwa',
		'#e0783a',
		[
			'You already— wait. Hi. I’m Golhwa. That’s unnie. That’s Hyullé, she won’t say it unless you look at her first, which you should, but maybe don’t look at me like that or I am going to say the stupid thing.'
		],
		[
			'벌써— 잠깐. 안녕. 골화야. 저쪽이 언니. 저쪽이 혈레, 네가 먼저 봐야 말하거든, 보는 게 맞는데, 나를 그렇게 보면 바보 같은 말 할 것 같아.'
		]
	),
	D(
		'hyulle',
		'#6ec4c9',
		['I was going to.', 'Hello.'],
		['하려고 했어요.', '안녕.']
	),
	D(
		'seohyeon',
		'#3E8EF0',
		['Kim Seohyeon.', 'Are you… I mean. People.'],
		['김서현이오.', '당신들은… 그러니까. 사람이오?']
	),
	D(
		'narim',
		'#5fad6e',
		['Today.', 'Yesterday you would have gotten a different answer. I’m Narim. The water is ours. The hill can keep the rest.'],
		['오늘은요.', '어제였으면 답이 달랐을 거예요. 나림이에요. 물은 우리 것. 나머지는 언덕이 가져도 돼요.']
	),
	D(
		'golhwa',
		'#e0783a',
		['Kim.', 'Say it again. No, I heard you. It just… sticks. Same sound as the steam. I like it.'],
		['김.', '다시. 아니, 들었어. 그냥… 붙어. 김이랑 같은 소리. 좋아.']
	),
	P(
		'Steam, surname — 김 — the same sound. Golhwa answers his next silence by staring at his mouth. Hyullé’s hand goes under the water and stays. Narim’s voice drops half an octave and she pretends she meant to clear her throat.',
		'김, 성 — 같은 소리. 골화는 그의 다음 침묵을 입을 보는 것으로 받는다. 혈레의 손이 물 아래로 가서 그대로 있다. 나림의 목소리가 반 옥타브 내려가고, 목을 가다듬으려 한 척한다.',
		{ nsfw: true }
	),
	D(
		'seohyeon',
		'#3E8EF0',
		['I should — the horse is up there.'],
		['이만 — 위에 말이 있소.']
	),
	D(
		'narim',
		'#5fad6e',
		[
			'If you came for water, take it.',
			'If you come back, come with a question. That is what we do here. Advice. Not… whatever Golhwa is about to offer.'
		],
		['물을 찾았으면 가져가요.', '다시 오면 질문을 가지고 와요. 여기서 하는 일이 그거예요. 조언. 골화가 지금 꺼내려고 하는 것 말고.']
	),
	D(
		'golhwa',
		'#e0783a',
		[
			'I was going to say the ledge is warmer.',
			'And also come back. Your horse almost died. The next thing that almost dies will be worse. Come back.'
		],
		['턱이 더 따뜻하다고 하려고 했어.', '그리고 다시 와. 말이 거의 죽었잖아. 다음에 거의 죽을 게 더 나쁠 거야. 다시 와.']
	),
	D(
		'seohyeon',
		'#3E8EF0',
		['I have officers. I don’t need —', 'I don’t know what I would ask.'],
		['장교들이 있소. 필요 없—', '뭘 물어야 할지도 모르겠소.']
	),
	D(
		'narim',
		'#5fad6e',
		['Then come when you do.', 'Bring the name. Kim. That is enough of a door.'],
		['그때 와요.', '이름만 가져와요. 김. 그걸로 문은 돼요.']
	),
	D(
		'hyulle',
		'#6ec4c9',
		['The far ledge stays warm.', 'If you sit I can… I’ll keep it. That is all I meant. Somewhere warmer.'],
		['저쪽 턱은 따뜻해요.', '앉으면 제가… 데워 둘게요. 그 말이에요. 더 따뜻한 데.']
	),
	P(
		'Narim turns a river stone in her fingers — ordinary, grey, too warm for the cave — and puts it in his palm.',
		'나림이 강돌을 손가락에서 굴린다 — 평범한 회색, 동굴치고는 너무 따뜻한 — 그리고 그의 손바닥에 얹는다.'
	),
	D(
		'narim',
		'#5fad6e',
		['If it goes cold, you are lost.', 'If it stays warm, the hill will open. Don’t drop it in a pocket you forget.'],
		['식으면 길을 잃은 거예요.', '따뜻하면 언덕이 열려요. 잊어버리는 주머니에 넣지 말아요.']
	),
	D(
		'seohyeon',
		'#3E8EF0',
		['I should go. There are people on the road.', '…I’ll think about the question.'],
		['가야 하오. 길에 사람이 있소.', '…질문은 생각해 보겠소.']
	),
	D(
		'golhwa',
		'#e0783a',
		['Come back though.'],
		['그래도 다시 와.']
	),
	D(
		'narim',
		'#5fad6e',
		['Then go.'],
		['그럼 가세요.']
	),
	P(
		'Olive silk has slipped off one of Narim’s shoulders and she does not pull it up until he has already seen. She hears herself not pulling it up.',
		'올리브 비단이 나림의 어깨 하나에서 내려가 있고, 그가 본 뒤에야 올린다. 안 올리는 소리가 들린다.',
		{ nsfw: true }
	),
	P(
		'He dresses with three pairs of eyes on the bright blue coming back. Nobody helps. Nobody looks away from the waterline he is trying to hide with a sleeve.',
		'밝은 파란 것이 돌아오는 것을 눈 셋이 본다. 아무도 도와주지 않는다. 소매로 가리려는 수선에서 눈을 피하지 않는다.',
		{ nsfw: true }
	),
	M(
		'seohyeon',
		'Three names. A stone that will not cool. I will tell the next post it was a spring. I looked too long. I stood in the water too long.',
		'이름 셋. 식지 않는 돌. 다음 진에는 샘이었다고 하리라. 너무 오래 봤다. 물에 너무 오래 서 있었다.'
	),
	P(
		'He rides. The robe dries badly. The stone stays warm in the pocket he did not forget.',
		'탄다. 도포가 고약하게 마른다. 잊지 않은 주머니에서 돌이 따뜻하다.'
	),
	D(
		'golhwa',
		'#e0783a',
		['He looked at me first.', 'No he didn’t. He looked at the water. Which is worse. I want him back anyway.'],
		['나 먼저 봤어.', '아니야. 물을 봤어. 그게 더 나빠. 그래도 다시 왔으면.']
	),
	D(
		'hyulle',
		'#6ec4c9',
		['If he does… I want the face next time.', 'I’ll hide. I’ll look anyway.'],
		['오면… 다음에는 얼굴을.', '숨겠지. 그래도 볼 거야.']
	),
	D(
		'narim',
		'#5fad6e',
		['If he does — only Kim.', 'That sound. That is the door.'],
		['오면 김만.', '그 소리. 그게 문이야.']
	),
	D(
		'golhwa',
		'#e0783a',
		['That’s a rule now?'],
		['지금 규칙이야?']
	),
	D(
		'narim',
		'#5fad6e',
		['That’s the door.'],
		['그게 문이야.']
	),
	P(
		'Hyullé’s footprint takes a long time to fade from the rock he did not sit on. She presses her thighs together and hates that it helps. Golhwa swings her foot harder. Narim’s smile is small.',
		'혈레의 발자국이 그가 앉지 않은 바위에서 오래 남는다. 허벅지를 모으고, 그게 도움이 되는 게 싫다. 골화는 발을 더 세게 흔든다. 나림의 웃음은 작다.',
		{ nsfw: true }
	)
];

const newSlots = [
	{
		id: 'narim-silk-appeal',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'Olive silk has slipped',
		alt: 'Narim close: olive silk slipped off one shoulder on purpose, emerald eyes, wet rock, appealing',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Narim, eldest steam-cavern goddess, appealing. Face fills the frame, matches attached portrait: emerald eyes, jade binyeo, olive silk slipped off one shoulder on wet rock. Skin-forward, painterly anime-adjacent cinema. Dim attached cavern. No text. No watermark.',
		refs: ['/ch_narim.png', '/pl_cave.png'],
		people: ['narim']
	},
	{
		id: 'golhwa-wade-close',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Golhwa is already in the water',
		alt: 'Golhwa wading closer — ember eyes, drool, coral silk riding a hip, possessive',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Golhwa wading closer through cyan steam. Face fills the frame, matches attached portrait: ember eyes, drool at the lip, coral silk on a hip. Skin-forward, painterly. Dim attached cavern. No text. No watermark.',
		refs: ['/ch_golhwa.png', '/pl_cave.png'],
		people: ['golhwa']
	},
	{
		id: 'hyulle-thighs-claim',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Hyullé’s thighs press the rock',
		alt: 'Hyullé shy face, cyan heart-eyes, thighs pressed to wet rock, secretly wrecked',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Hyullé, shy and wrecked. Face fills the frame, matches attached portrait: cyan eyes, hand half over the mouth, pale-blue silk, thighs pressed to wet black rock. Skin-forward, painterly. Dim attached cavern. No text. No watermark.',
		refs: ['/ch_hyullé.png', '/pl_cave.png'],
		people: ['hyulle']
	},
	{
		id: 'seohyeon-wont-stand',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: 'He does not step out of the water',
		alt: 'Seohyeon waist-up in black water from behind, not leaving the bowl; three goddess glances at the waterline',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. FROM BEHIND. Seohyeon waist-up in black cavern water, athletic back, he will not step out. Three goddess faces at the edge looking at the waterline. Face matches attached Seohyeon portrait only as wet hair. Dim attached cavern. Waist-up. No genitals. No text. No watermark.',
		refs: ['/ch_kim_seohyun.png', '/ch_narim.png', '/ch_golhwa.png', '/ch_hyullé.png', '/pl_cave.png'],
		people: ['seohyeon', 'narim', 'golhwa', 'hyulle']
	},
	{
		id: 'goddesses-stake-him',
		ratio: 1.778,
		tone: '#0e7490',
		nsfw: true,
		at: 'They are already dividing him',
		alt: 'Three goddesses possessive close — Narim composed failing, Golhwa drooling, Hyullé shy and hungriest',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Three steam-cavern goddess faces filling the frame, possessive, heart-struck. Narim emerald, Golhwa ember drooling, Hyullé cyan peeking. Faces match attached portraits. Dim attached cavern. No text. No watermark.',
		refs: ['/ch_narim.png', '/ch_golhwa.png', '/ch_hyullé.png', '/pl_cave.png'],
		people: ['narim', 'golhwa', 'hyulle']
	}
];

function findEntry(title) {
	for (const ch of story) {
		const en = ch.entries?.find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error('missing entry ' + title);
}

const first = findEntry('The First Kim');
first.blocks = firstKimBlocks;
const have = new Set((first.images ?? []).map((im) => im.id));
for (const slot of newSlots) {
	if (!have.has(slot.id)) first.images.push(slot);
}

function insertAfterHtml(entry, htmlStart, blocks) {
	const i = entry.blocks.findIndex((b) => b.kind === 'p' && b.html?.startsWith(htmlStart));
	if (i < 0) throw new Error('anchor missing: ' + htmlStart);
	entry.blocks.splice(i + 1, 0, ...blocks);
}

const daeya = findEntry('Daeya Fortress');
insertAfterHtml(daeya, 'Steam lifts. They are already on the far rock', [
	P(
		'Golhwa’s foot stops swinging. A thread of wet finds her lip and she does not wipe it. Hyullé stares at his mouth and answers nothing. Narim’s silk clings and her next breath is late.',
		'골화의 발이 멈춘다. 젖은 실이 입술에 붙고 닦지 않는다. 혈레는 입을 보고 아무 말도 안 한다. 나림의 비단이 붙고, 다음 숨이 늦다.',
		{ nsfw: true }
	),
	M(
		'hyulle',
		'His father’s shoulders. Worse. I want him in my mouth and I will say the ledge is warm. I am the quiet one. I am not quiet.',
		'아버지 어깨. 더 나빠. 입에 넣고 싶고 턱이 따뜻하다고 말할 거야. 나는 조용한 쪽이야. 조용하지 않아.',
		{ nsfw: true }
	),
	M(
		'golhwa',
		'Kim. Ours. If unnie talks first I will still get my hand in the water before she finishes the counsel.',
		'김. 우리 거야. 언니가 먼저 말해도 조언 끝나기 전에 손에 물을 묻힐 거야.',
		{ nsfw: true }
	)
]);

insertAfterHtml(daeya, 'After Daeya, the Sword of Silla does not sleep', [
	P(
		'They do not look at his face first. Hyullé’s thighs press the rock she saved for him. Golhwa swallows. Narim’s voice, when it comes, is half an octave down.',
		'얼굴을 먼저 보지 않는다. 혈레의 허벅지가 그를 위해 남겨 둔 바위를 누른다. 골화가 삼킨다. 나림의 목소리는, 나올 때, 반 옥타브 아래다.',
		{ nsfw: true }
	),
	M(
		'hyulle',
		'He came back. I kept the ledge. I want to keep the rest. I hate that I kept the ledge like a wife.',
		'돌아왔어. 턱을 데워 뒀어. 나머지도 지키고 싶어. 아내처럼 턱을 지킨 게 싫어.',
		{ nsfw: true }
	)
]);

const yushin = findEntry('Kim Yushin');
const laterIdx = yushin.blocks.findIndex(
	(b) => b.kind === 'p' && b.html?.startsWith('Between campaigns he still goes alone to the cavern lake')
);
if (laterIdx < 0) throw new Error('Between campaigns block missing');
yushin.blocks.splice(
	laterIdx,
	1,
	P(
		'Between campaigns he still goes alone to the cavern lake. The stone in the story is his father’s. His own pocket is empty. He undresses anyway.',
		'원정 사이, 그는 여전히 홀로 동굴 호수로 간다. 이야기 속의 돌은 아버지 것이다. 제 주머니는 비어 있다. 그래도 벗는다.'
	),
	D(
		'narim',
		'#5fad6e',
		['You came with a question, or you came because the hill opened.', 'Either is fine. Sit down before you fall in again.'],
		['질문을 들고 왔거나, 언덕이 열려서 온 거죠.', '둘 다 괜찮아요. 또 빠지기 전에 앉아요.']
	),
	D(
		'yushin',
		'#4a8fe0',
		['Three things.', 'The northern door. The queen’s count. How long I may stay.'],
		['세 가지요.', '북쪽 문. 여왕의 수. 얼마나 있어도 되는지.']
	),
	D(
		'golhwa',
		'#e0783a',
		['Stay is not a number, marshal.', 'Sit. Unnie will do the other two.'],
		['남는 건 숫자가 아니야, 대장군.', '앉아. 나머지 둘은 언니가 해.']
	),
	P(
		'Hyullé does not speak. She has already warmed the far ledge. Her eyes are on his mouth while Narim answers the north.',
		'혈레는 말이 없다. 이미 먼 턱을 데워 두었다. 나림이 북쪽을 답하는 동안 눈은 그의 입에.',
		{ nsfw: true }
	),
	M(
		'hyulle',
		'He will ride before I finish a sentence. I still want him under the water. I still will not say it.',
		'문장 끝내기 전에 탈 거야. 그래도 물 아래에 두고 싶어. 그래도 안 말할 거야.',
		{ nsfw: true }
	),
	D(
		'narim',
		'#5fad6e',
		['Yeon’s door is a guest-door only from one side.', 'Take what you need. Leave before Golhwa asks you to stay. She will ask.'],
		['연의 문은 한쪽에서만 손님 문이에요.', '필요한 것만 가져가요. 골화가 남으라 하기 전에 가요. 할 테니까.']
	),
	D(
		'golhwa',
		'#e0783a',
		['Stay.'],
		['남아.']
	),
	D(
		'yushin',
		'#4a8fe0',
		['I have the three answers.', 'That is enough.'],
		['답 셋이 있소.', '그걸로 충분하오.']
	)
);

const death = findEntry('The Death of Kim Yushin');
if (death) {
	const i = death.blocks.findIndex((b) => b.kind === 'p' && b.html?.startsWith('Old now, between campaigns'));
	if (i >= 0) {
		death.blocks.splice(
			i + 1,
			0,
			P(
				'Hyullé’s hand finds the water and stays. She looks at his mouth while he sits like a man who has finally learned the ledge.',
				'혈레의 손이 물을 찾아 그대로 있다. 그가 턱을 배운 사람처럼 앉는 동안 입을 본다.',
				{ nsfw: true }
			),
			M(
				'hyulle',
				'He is old and I still want. I hate that I kept the ledge warm for fifty years.',
				'늙었는데 아직 원해. 오십 년을 턱을 데워 둔 게 싫어.',
				{ nsfw: true }
			)
		);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched First Kim, Daeya steam days, Kim Yushin visit, lake remembers');
console.log('first kim blocks', first.blocks.length, 'images', first.images.length);
