import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
const onjo = story.flatMap((c) => c.entries).find((e) => e.title === 'Onjo');
if (!jumong || !onjo) throw new Error('Jumong/Onjo missing');

const d = (person, chip, en, lines, nsfw = true) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});
const p = (html, ko, nsfw = true) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });

const J = '#e8563f';
const S = '#e8a04a';

function findEn0(entry, person, first) {
	const i = entry.blocks.findIndex((b) => b.person === person && b.en?.[0] === first);
	if (i < 0) throw new Error(`missing ${person} ${first}`);
	return i;
}

const grain = [
	d(
		'sosuno',
		S,
		[
			'Look— look at you— that chest— that back— those hips I watched from the loft—',
			'That sound. Wet. Slap. That’s— that’s Little Sosuno, she’s— ah— dripping, she—',
			'Take it. That sexy— man meat— I said take it and— destroy my tight little ass—',
			'Beat her up. Beat up Little Sosuno till she’s just wet. Nothing left. That’s all she is—'
		],
		[
			'봐— 봐봐— 그 가슴— 그 등— 그 엉덩이 다락에서 봤거든—',
			'그 소리. 젖은. 철썩. 그게— 작은 소서노야, 얘가— 아— 흘리고, 얘가—',
			'가져와. 그 섹시한— 그 고기— 가져와서— 내 꽉 끼는 엉덩이 박살내—',
			'두들겨 패. 작은 소서노 패. 젖은 것만 남게. 아무것도 없게. 그게 얘야—'
		]
	),
	d('jumong', J, ['Hey. Hey—', 'Or don’t. God.', 'Look at you talking.'], [
		'야. 야—',
		'아니면 말고. 진짜.',
		'말하는 거 봐.'
	]),
	d(
		'sosuno',
		S,
		[
			'Don’t slow. Don’t be nice. I said destroy—',
			'I want the slap. The noise when you— when you hit that wet— again— again—',
			'Fill her. Ruin her. She’s been hungry since the yard went quiet—',
			'Well girls don’t get this. Mine. Little Sosuno is mine to— ah— wreck—'
		],
		[
			'천천히 하지 마. 착하게 굴지 마. 박살내라니까—',
			'그 철썩 원해. 젖은 데 맞을 때 그 소리— 또— 또—',
			'채워. 망가뜨려. 마당 조용해진 그날부터 배고팠어—',
			'우물 년들은 이거 못 가져. 내 거. 작은 소서노는 내가— 아— 망가뜨릴—'
		]
	),
	d('jumong', J, ['Little Sosuno.', 'Cute.', 'I’ve got both of you.'], [
		'작은 소서노.',
		'귀엽네.',
		'둘 다 잡고 있어.'
	]),
	d(
		'sosuno',
		S,
		[
			'Don’t NAME her don’t— ah— she can hear— she likes it she likes it—',
			'Deeper. The meat. All of it. Don’t you dare pull out—',
			'AHH— DON’T STOP—',
			'DUMB BIG IDIOT—'
		],
		[
			'이름 부르지 마— 아— 듣거든— 좋아하거든 좋아하거든—',
			'더 깊이. 그 고기. 다. 빼지 마—',
			'아아— 멈추지 마—',
			'이 멍청한 큰 바보야—'
		]
	),
	d('jumong', J, ['That’s it—', 'I’ve got you.', 'Take it—'], ['그래—', '잡고 있어.', '받아—']),
	p(
		'He spends in her against the grain sacks. She bites his shoulder so she does not have to hear herself. Messy. Love-hate, spent. Then she hears the loft-voice still in the room.',
		'곡식 가마니에 대고 싼다. 제 목소리가 듣기 싫어서 어깨를 문다. 지저분하다. 사랑이고 미움이고, 다 씀. 그런데 다락 목소리가 아직 방에 있다.'
	),
	d(
		'sosuno',
		S,
		[
			'I didn’t— you didn’t hear destroy— I don’t talk like—',
			'Little Sosuno isn’t— I don’t have a—',
			'Forget it. Get out. Don’t look at me.'
		],
		['그런 말— 박살— 안 했어. 그렇게 말 안 하거든—', '작은 소서노는— 그런 거 없어—', '잊어. 나가. 보지 마.']
	),
	d(
		'jumong',
		J,
		[
			'I heard.',
			'You can talk like that.',
			'It’s you. It’s hot. I’m keeping you. Both.'
		],
		['들었어.', '그렇게 말해도 돼.', '너야. 섹시해. 둘 다 둘게.']
	),
	d(
		'sosuno',
		S,
		[
			'Don’t— don’t be nice.',
			'I’ll get stupid.',
			'I am not— melting. I’m a chieftain’s daughter. I’m not— shy.',
			'…Stay. Not because you asked.'
		],
		['착하게 굴 생각하지 마.', '바보 돼.', '녹는 거 아니거든. 족장 딸이야. 수줍은 거 아니거든.', '…남아. 네가 청해서가 아니야.'],
		false
	)
];

const iHate = findEn0(jumong, 'jumong', 'Hate me then.');
const iMelt = findEn0(jumong, 'sosuno', 'Don’t— don’t be nice.');
if (iMelt <= iHate) throw new Error(`grain slice ${iHate} ${iMelt}`);
jumong.blocks.splice(iHate + 1, iMelt - iHate, ...grain);

const lastNight = [
	d(
		'sosuno',
		S,
		[
			'Don’t— ha— don’t say sexy I’ll—',
			'Little Sosuno listen— that’s him— that’s the noise— wet— god the wet— twenty winters and still that slap—',
			'Look at you. Chest. Back. That ass. That man meat. Still. Still.',
			'Take it and destroy my tight little ass. Beat her up. Beat up Little Sosuno till she’s dripping and there’s nothing left—'
		],
		[
			'말하지— 하— 섹시하다고 하면 나—',
			'작은 소서노 들어— 저거 그거야— 그 소리— 젖은— 아 그 젖은 소리— 스무 겨울인데 그 철썩 아직—',
			'봐봐. 가슴. 등. 그 엉덩이. 그 고기. 아직. 아직.',
			'가져와서 내 꽉 끼는 엉덩이 박살내. 두들겨 패. 작은 소서노 패. 질질 흐르고 아무것도 안 남게—'
		]
	),
	d('jumong', J, ['Yours.', 'Always was.', 'Scream it. Last time. Louder.'], [
		'네 거야.',
		'처음부터.',
		'질러. 마지막이야. 더 크게.'
	]),
	d(
		'sosuno',
		S,
		[
			'I hate you I love you don’t you dare stop—',
			'Fill her— ruin her— she’s been waiting—',
			'DUMB BIG IDIOT— LAST— FILL—',
			'AHH— LITTLE SOSUNO’S— CUMMING— DON’T YOU LEAVE THE ROOM—'
		],
		[
			'미워 사랑해 멈추지 마—',
			'채워— 망가뜨려— 기다렸거든—',
			'이 멍청한 큰 바보야— 마지막— 채워—',
			'아아— 작은 소서노가— 가— 방에서 나가지 마—'
		]
	),
	p(
		'After, she is scarlet at what she heard herself say. Destroy. Beat her up. The whole book. He kisses the place on her temple that used to hide in a sleeve.',
		'그 다음, 제 입이 한 말에 새빨개진다. 박살. 두들겨 패. 그 책 전부. 그는 예전에 소매로 숨기던 관자놀이에 입을 맞춘다.'
	),
	d(
		'jumong',
		J,
		['I heard.', 'You can still talk like that.', 'I’m keeping both of you. Even from a chair away.'],
		['들었어.', '그렇게 말해도 돼. 아직.', '둘 다 둘게. 의자 멀리서도.']
	),
	d(
		'sosuno',
		S,
		['Don’t be nice.', 'I’ll get stupid.', '…I’m already stupid.', 'Keep the well. I’m taking the glow.'],
		['착하게 굴지 마.', '바보 돼.', '…이미 바보야.', '우물은 가져. 빛은 내가 가져갈게.'],
		false
	)
];

const iLastP = onjo.blocks.findIndex((b) => b.html?.includes('one last screaming night'));
const iOnjoStart = onjo.blocks.findIndex(
	(b, i) => i > iLastP && b.person === 'sosuno' && b.en?.some((l) => /Little Sosuno listen|Haemosu/.test(l))
);
const iOnjoEnd = onjo.blocks.findIndex((b, i) => i > iOnjoStart && b.person === 'sosuno' && b.en?.[0] === 'Don’t be nice.');
if (iLastP < 0 || iOnjoStart < 0 || iOnjoEnd < 0) {
	throw new Error(`onjo slice lastP=${iLastP} start=${iOnjoStart} end=${iOnjoEnd}`);
}
onjo.blocks.splice(iOnjoStart, iOnjoEnd - iOnjoStart + 1, ...lastNight);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');

const hae = [...jumong.blocks, ...onjo.blocks].filter(
	(b) => b.person === 'sosuno' && JSON.stringify(b).includes('Haemosu')
);
console.log('patched grain+onjo', { haeInSosunoMouth: hae.length });
