#!/usr/bin/env node
/**
 * Patch Prince Euija (Gyogi/Kimi rivalry), King Euija (exile), Go Anseung (GRA flesh-out).
 * Also light lock-in beats where thin. Does not commit.
 */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		for (const e of ch.entries ?? []) {
			if (e.title === title) return e;
		}
	}
	throw new Error(`missing entry: ${title}`);
}

function p(html, ko) {
	return { kind: 'p', html, ko };
}
function dialogue(person, lines, en) {
	return { kind: 'dialogue', person, lines, en };
}
function section(label, ko) {
	return { kind: 'section', label, ko };
}
function scene(label, ko) {
	return { kind: 'scene', label, ko };
}

// ─── Prince Euija ───────────────────────────────────────────────
{
	const e = findEntry('Prince Euija');
	e.year = '640';
	if (e.subtitle && /632|thirty-two|32/.test(String(e.subtitle))) {
		e.subtitle = String(e.subtitle).replace(/632/g, '640').replace(/thirty-two/gi, 'forty').replace(/\b32\b/g, '40');
	}
	if (e.logline) {
		e.logline = String(e.logline)
			.replace(/thirty-two/gi, 'forty')
			.replace(/\b32\b/g, '40');
	}

	// Age / year string fixes in existing blocks
	for (const b of e.blocks) {
		if (b.kind === 'p' || b.kind === 'cite') {
			if (typeof b.html === 'string') {
				b.html = b.html
					.replace('He is thirty-two, which is late for it.', 'He is forty, which is late for it — late enough that the houses have already picked another boy.')
					.replace('Prince Euija (32)', 'Prince Euija (40)')
					.replace(/\(32\)/g, '(40)');
			}
			if (typeof b.ko === 'string') {
				b.ko = b.ko
					.replace(/서른둘|서른 두|32세|서른두/g, '마흔')
					.replace(/\(32\)/g, '(40)');
			}
		}
		if (b.kind === 'cite' && typeof b.html === 'string') {
			b.html = b.html.replace('Prince Euija (32)', 'Prince Euija (40)');
		}
	}

	const rivalry = [
		section('The Favourite', '총아'),
		scene('The Ministers’ Hall', '조정'),
		p(
			'The eight houses do not argue about Euija in public. They argue about Gyogi in private, which is worse.',
			'여덟 집은 공개석상에선 의자 얘기를 안 한다. 사석에선 교기 얘기를 한다. 그게 더 나쁘다.'
		),
		p(
			'Gyogi is younger. His mother is Queen Satek — true Baekje sleeve, Deer Rock blood. Euija’s mother is a Silla princess the song still remembers. The houses have been doing that arithmetic since both boys could walk.',
			'교기가 어리다. 어머니는 사택왕후 — 진짜 백제 소매, 록암의 피. 의자의 어머니는 노래에 남는 신라 공주. 두 아이가 걷기 시작했을 때부터 집들은 그 셈을 해 왔다.'
		),
		p(
			'Euija has been waiting for a seal that should have come at twenty. He is forty now. He drinks through the wait. He tells himself he does not care who sits where.',
			'의자는 스물에 왔어야 할 인장을 기다려 왔다. 지금은 마흔이다. 기다림을 술로 넘긴다. 누가 어디에 앉든 관심 없다고 스스로에게 말한다.'
		),
		dialogue(
			'gyogi',
			['형님.', '오늘 조회에… 사택 좌평이 제 이름을 먼저 불렀습니다.', '실수였다고들 합니다.'],
			['Hyungnim.', 'At this morning’s assembly… the Satek jwapyŏng called my name first.', 'They say it was a mistake.']
		),
		dialogue(
			'euija',
			['실수겠지.', '우리 집은 실수가 잦아.'],
			['A mistake, then.', 'Our house makes a lot of those.']
		),
		dialogue(
			'gyogi',
			['형님께선 나라 이야기를 잘 하십니다.', '집들은 피 이야기를 잘 하지요.', '둘 다 필요한 거 아니겠습니까.'],
			['Hyungnim talks well about the country.', 'The houses talk well about blood.', 'Don’t we need both?']
		),
		dialogue(
			'euija',
			['필요하면 너가 해.', '난 활이나 쏘마.'],
			['If we need it, you do it.', 'I’ll stick to the bow.']
		),
		p(
			'He means it, mostly. Apathy is easier than wanting a chair somebody else’s mother already warmed.',
			'거의 진심이다. 남의 어머니가 이미 데운 자리를 바라는 것보다, 무관심한 편이 쉽다.'
		),
		scene('Behind the Screen', '병풍 뒤'),
		p(
			'Kimi does not raise his voice. He never has to. White hair at Gyogi’s ear, red silk, a smile that rearranges chairs.',
			'기미는 목소리를 높이지 않는다. 높일 필요가 없다. 교기 귓가의 흰 머리, 붉은 비단, 자리를 다시 놓는 웃음.'
		),
		dialogue(
			'kimi',
			['왕자마마.', '오늘 표는… 일곱이 이쪽이었습니다.', '여덟 번째도 곧 옵니다.', '의자는 술만 드시면 됩니다.'],
			['Your Highness.', 'Today’s count… seven on our side.', 'The eighth is coming.', 'Euija only has to keep drinking.']
		),
		dialogue(
			'gyogi',
			['형은 불쌍해.', '나라 이야기를 진짜로 믿으니까.'],
			['I feel for him.', 'He actually believes the country talk.']
		),
		dialogue(
			'kimi',
			['믿게 두십시오.', '믿는 사람은 표가 늦습니다.'],
			['Let him.', 'Believers are late to the vote.']
		),
		p(
			'Euija hears enough of it through the lacquer. He laughs once, short, and goes back to the garden with a bow. Clan politics taste like ditch-water. He has decided he is above both.',
			'의자는 옻칠 너머로 충분히 듣는다. 짧게 한 번 웃고, 활을 들고 후원으로 돌아간다. 가문 정치는 도랑물 맛이다. 둘 다 위에 있다고 정해 버렸다.'
		),
		p(
			'That is the boy who will meet a nameless fighter at the river in five days — and discover what resolve looks like when it is not wearing a sleeve.',
			'닷새 뒤 강가에서 이름 없는 무사를 만날 아이가 이 아이다. 소매를 안 걸친 결의가 어떤 얼굴인지, 거기서 처음으로 본다.'
		)
	];

	// Insert rivalry after block 21 ("He goes up the hill to see who.") and before the "In five days…" block
	const insertAt = e.blocks.findIndex(
		(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('In five days, Prince Euija')
	);
	if (insertAt < 0) throw new Error('Prince Euija: insert anchor missing');
	e.blocks.splice(insertAt, 0, ...rivalry);

	// Strengthen lock-in after Gyebek bank beat — find a late bank paragraph
	const lockIdx = e.blocks.findIndex(
		(b) =>
			b.kind === 'p' &&
			typeof b.html === 'string' &&
			b.html.includes('Gyebek looks back') &&
			b.html.includes('crown prince is already looking')
	);
	if (lockIdx >= 0) {
		e.blocks.splice(
			lockIdx + 1,
			0,
			p(
				'For the first time in years the arithmetic goes quiet. Not Gyogi’s blood. Not Kimi’s chairs. A boy who held the line because somebody had to.',
				'몇 년 만에 셈이 조용해진다. 교기의 피도, 기미의 의자도 아니다. 누군가 막아야 해서 막을 줄 아는 아이.'
			),
			p(
				'Euija puts the borrowed crown back on crooked and laughs — the real kind. He has found what he was drinking past.',
				'의자는 빌린 관을 삐딱하게 다시 얹고 웃는다 — 진짜로. 술로 넘기던 걸, 이제 봤다.'
			)
		);
	}
}

// ─── King Euija — exile after early wonders ─────────────────────
{
	const e = findEntry('King Euija');
	const anchor = e.blocks.findIndex(
		(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('So the reign begins with small wonders')
	);
	if (anchor < 0) throw new Error('King Euija: wonders anchor missing');

	const exile = [
		section('The Islands', '섬'),
		scene('The Harbour at Night', '밤의 항구'),
		p(
			'Queen Satek dies in the second year of the reign. The houses put on mourning the way they put on silk — carefully, and for an audience.',
			'사택왕후는 즉위 이년에 죽는다. 집들은 비단 입듯 상복을 입는다 — 조심조심, 관객을 위해.'
		),
		p(
			'Euija uses the mourning. The Nihon Shoki will write it as island exile: Prince Gyogi, four women of the queen’s sleeve, Naejwapyŏng Kimi, and about forty prominent men. Boats at night. No speeches on the pier.',
			'의자는 상을 쓴다. 일본서기는 섬 추방으로 적을 것이다. 왕자 교기, 왕후 소매의 여인 넷, 내좌평 기미, 그리고 이름 있는 남자 마흔쯤. 밤배. 부두에선 연설이 없다.'
		),
		dialogue(
			'euija',
			['교기.', '기미.', '섬이 비었다.', '가서 채워라.'],
			['Gyogi.', 'Kimi.', 'The islands are empty.', 'Go fill them.']
		),
		dialogue(
			'gyogi',
			['…형님.', '피 이야긴 끝이군요.'],
			['…Hyungnim.', 'So the blood talk is over.']
		),
		dialogue(
			'euija',
			['피 이야긴 네가 시작했지.', '난 나라 이야길 하겠네.', '배 타.'],
			['You started the blood talk.', 'I’ll stick to the country.', 'Get on the boat.']
		),
		dialogue(
			'kimi',
			['왕자마마.', '표는… 이제 이쪽에 없습니다.', '가십시다.'],
			['Your Highness.', 'The count… is no longer ours.', 'We go.']
		),
		p(
			'Gyogi does not shout. Kimi’s white hair catches the one harbour lantern. Forty men follow because the alternative is a shorter night.',
			'교기는 소리치지 않는다. 기미의 흰 머리가 항구의 등불 하나에 걸린다. 마흔 명이 따른다. 다른 밤은 더 짧으니까.'
		),
		p(
			'By morning the Satek sleeve has no prince. Euija walks back up the hill and asks for wine. The reign can begin in earnest now.',
			'아침이 되면 사택 소매엔 왕자가 없다. 의자는 언덕을 다시 올라가 술을 청한다. 이제야 치세가 제대로 시작된다.'
		)
	];
	e.blocks.splice(anchor + 1, 0, ...exile);
}

// ─── Go Anseung — flesh GRA before tent killing ─────────────────
{
	const e = findEntry('Go Anseung');

	// Replace the thin opening stretch (scene + early p's through pre-dialogue) with a fuller GRA beat,
	// keeping the quote and the later Munmu material.
	const tentIdx = e.blocks.findIndex(
		(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('That night Ansung has him killed')
	);
	if (tentIdx < 0) throw new Error('Go Anseung: tent kill anchor missing');

	// Find start: first scene or first p about revival
	const startIdx = e.blocks.findIndex(
		(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('Every revival needs two things')
	);
	if (startIdx < 0) throw new Error('Go Anseung: revival open missing');

	const quoteBlock = (() => {
		const q = e.blocks.find((b) => b.kind === 'quote');
		if (q) return { ...q };
		return {
			kind: 'quote',
			html: 'Mojam, a daehyeong of Goguryeo from Surim Fortress, gathered the surviving people, marched from Gungmo Fortress to south of the Pae River, and killed the Tang officials and the monk.',
			ko: '검모잠은 고구려 수림성 대형으로, 남은 백성을 모아 궁모성에서 패강 남쪽으로 나아가 당의 관리와 승려를 죽였다.',
			source: 'Samguk Sagi / later Tang notices (paraphrase)'
		};
	})();

	// Keep from tent kill onward; replace startIdx .. tentIdx-1
	const gra = [
		section('The Flag', '깃발'),
		scene('South of the Pae', '패강 남쪽'),
		p(
			'Every revival needs two things: a flag and a royal. Gum Mojam has the flag.',
			'부흥엔 두 가지가 필요하다. 깃발과 왕족. 검모잠에게는 깃발이 있다.'
		),
		p(
			'Pyongyang is a Protectorate now. Western clerks count the gates and seem surprised anyone minds. Mojam minds. He is a daehyeong out of Surim. He gathers what is left of the people, kills a Tang official and a monk who talked like one, and marches the survivors south of the Pae before the ledgers can catch up.',
			'평양은 이제 도호부다. 서쪽 서기들이 성문을 세며 누가 싫어하는지 모르겠다는 얼굴이다. 검모잠은 싫어한다. 수림 출신 대형. 남은 백성을 모으고, 당 관리와 관리처럼 말하는 중을 죽이고, 장부가 따라오기 전에 패강 남쪽으로 산 자들을 민다.'
		),
		scene('Saya Island', '사야도'),
		p(
			'He finds the royal on an island in the western sea, mending a net. The boy’s name is Ansung. His father is Yeon Jungto — the uncle who took twelve cities over to Silla when the house tore. Royal enough to put on a banner. Fisherman enough that nobody has looked for him.',
			'서쪽 바다 섬에서 그물을 깁고 있는 왕족을 찾는다. 이름은 안승. 아버지는 연정토 — 집이 찢어질 때 열두 성을 신라로 넘긴 숙부. 깃발에 걸 만큼은 왕족이고, 아무도 안 찾을 만큼은 어부다.'
		),
		dialogue(
			'mojam',
			['일어나시오.', '그물은 나중에 기우시오.', '왕을 만들어야겠소.'],
			['Get up.', 'The net can wait.', 'We need a king.']
		),
		dialogue(
			'ansung',
			['…나는 그물이나 깁는 사람이오.', '왕은 평양에 있지 않았소.'],
			['…I mend nets.', 'The king was in Pyongyang.']
		),
		dialogue(
			'mojam',
			['평양의 왕은 이미 서쪽으로 갔소.', '여기 남은 건 피요.', '피면 충분하오.'],
			['Pyongyang’s king already went west.', 'What’s left here is blood.', 'Blood is enough.']
		),
		scene('Hanseong', '한성'),
		p(
			'They crown him at Hanseong — the old name on a river bank the clerks still mispronounce. Four thousand households camp along the water by the next spring. Mojam drills. Ansung learns how to sit so men will look at him.',
			'한성에서 관을 씌운다 — 서기들이 아직도 잘못 읽는 강가의 옛 이름. 이듬해 봄이면 사천 호가 물을 따라 진을 친다. 검모잠은 훈련한다. 안승은 사람들이 보게끔 앉는 법을 배운다.'
		),
		p(
			'The revival asks Silla for aid. Munmu, who has use for a Goguryeo that is not Tang’s, sends grain, titles, and a seal that says King of Goguryeo as if the word still meant a country.',
			'부흥군은 신라에 도움을 청한다. 당의 것이 아닌 고구려가 필요한 문무는 곡식과 작위와, 고구려왕이라는 글자가 아직 나라인 양 찍힌 인장을 보낸다.'
		),
		quoteBlock,
		scene('River Camp', '강가 진영'),
		p(
			'By the time the Western army leans south again, the revival has a court, a royal, and an argument it cannot postpone.',
			'서쪽 군대가 다시 남으로 기울 때쯤, 부흥엔 조정과 왕족과, 미룰 수 없는 논쟁 하나가 있다.'
		),
		dialogue(
			'mojam',
			['강을 디키오.', '평양을 디키오.'],
			['Hold the river.', 'Hold Pyongyang.']
		),
		dialogue(
			'ansung',
			['두 해 전에 데들은 평양도 넘었소.', '우리 것보다 나은 성벽을 두고도.'],
			['Two years ago they took Pyongyang too.', 'With walls better than ours.']
		),
		dialogue(
			'mojam',
			['평양 땅에는 사백 년 묵은 임금들이 묻혀 계시오.', '그분들을 두고 신라 사랑채로 가갓다는 거요?'],
			['Four hundred years of kings are buried in that ground.', 'You would leave them for a Silla guest-room?']
		),
		dialogue(
			'ansung',
			['땅속의 임금들은 기다려 주실 거요.', '그 위의 사천 호는 못 기다리오.'],
			['The kings in the ground can wait.', 'The four thousand on top of it cannot.']
		),
		dialogue(
			'mojam',
			['기럼 가시오.', '그 사천 호 데리고.'],
			['Then go.', 'Take the four thousand with you.']
		),
		p(
			'He says it loud, to the fires. Around the fires, men stop eating. Ansung looks at them. Nobody stands up. Nobody sits down either. He understands what that silence costs.',
			'불 쪽으로, 크게 말한다. 불 옆 사람들이 수저를 멈춘다. 안승이 그들을 본다. 일어서는 자도, 앉는 자도 없다. 그 침묵이 얼마인지, 이제 안다.'
		),
		dialogue('ansung', ['…장군 말이 맞소.'], ['…The general is right.'])
	];

	const after = e.blocks.slice(tentIdx);
	e.blocks = [...e.blocks.slice(0, startIdx), ...gra, ...after];

	// Softening the south landing so Bodeok is named
	const southIdx = e.blocks.findIndex(
		(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('Then he takes four thousand households south')
	);
	if (southIdx >= 0) {
		e.blocks[southIdx] = p(
			'Then he takes four thousand households south, into Silla — and in time the thing gets a quieter name: Bodeokguk, a Goguryeo still standing inside someone else’s map.',
			'그러고는 사천 호를 이끌고 남으로, 신라 안으로 간다. 나중에 그 물건엔 더 조용한 이름이 붙는다. 보덕국. 남의 지도 안에 아직 서 있는 고구려.'
		);
	}
}

// ─── Light lock-in nudges: scan Daeya / High Summit if present ──
for (const title of ['Daeya', 'The Fall of Daeya', 'Gotaso', 'Fortress Daeya']) {
	try {
		const e = findEntry(title);
		const has = e.blocks.some(
			(b) => b.kind === 'p' && typeof b.html === 'string' && /world will not ignore|세상이 그를 무시/i.test(b.html)
		);
		if (!has) {
			const lastP = [...e.blocks].reverse().findIndex((b) => b.kind === 'p');
			if (lastP >= 0) {
				const idx = e.blocks.length - 1 - lastP;
				e.blocks.splice(
					idx + 1,
					0,
					p(
						'Chunchu learns the ugly half of apathy: you can ignore the world. The world does not return the favour.',
						'춘추는 무관심의 더러운 반쪽을 배운다. 세상을 무시할 수는 있다. 세상이 그걸 되돌려주진 않는다.'
					)
				);
			}
		}
		break;
	} catch {
		/* try next title */
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Prince Euija, King Euija, Go Anseung');
console.log(
	'counts',
	findEntry('Prince Euija').blocks.length,
	findEntry('King Euija').blocks.length,
	findEntry('Go Anseung').blocks.length
);
