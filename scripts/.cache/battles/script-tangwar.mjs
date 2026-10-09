/** Align the script with the battle maps in #86 Pyongyang II, #91 Stone Gate, #95 Maeso, #96 Final Ford. */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, editStory, textOf } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const voice = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, lines, en });
const map = (battle, phase) => ({ kind: 'battle', battle, phase });

function at(blocks, frag, kind) {
	const hits = blocks.map((b, i) => [b, i]).filter(([b]) => (!kind || b.kind === kind) && textOf(b).includes(frag));
	if (hits.length !== 1) throw new Error(`"${frag}": ${hits.length} hits`);
	return hits[0][1];
}
const mapAt = (blocks, battle, phase) => {
	const i = blocks.findIndex((b) => b.kind === 'battle' && b.battle === battle && b.phase === phase);
	if (i < 0) throw new Error(`no map ${battle} ${phase}`);
	return i;
};
const set = (blocks, frag, html, ko) => Object.assign(blocks[at(blocks, frag, 'p')], { html, ko });

editStory((story) => {
	const all = story.flatMap((c) => c.entries);
	if (all[85].blocks.some((b) => b.kind === 'battle' && b.phase === 'garrison')) {
		console.log('already applied');
		return false;
	}

	// #86 Pyongyang II
	{
		const B = all[85].blocks;
		set(
			B,
			'Namseng rides beside the Blue Dragon',
			'Namseng rides at the head of the column in a Tang coat, down the north-west road, to show the Blue Dragon the way. He knows every gully. He used to hunt them. At the top of the last one he reins in and looks at the red gate.',
			'남생은 당나라 옷을 입고 행렬 맨 앞에서 서북쪽 길을 내려온다. 청룡에게 길을 보여 주는 것이다. 골짜기 하나하나를 다 안다. 예전에 거기서 사냥을 했다. 마지막 골짜기 위에서 그는 고삐를 당기고 붉은 문루를 바라본다.'
		);

		const ring = at(B, 'The ring closes. A month goes by.', 'p');
		B.splice(
			ring,
			1,
			p(
				'The ring closes. Every few days Namgun sends men out of a gate to break it, and fewer come back. Then the Blue Dragon moves his whole camp round to the south-west, between the walls and the river.',
				'포위가 조여든다. 며칠마다 남건이 성문 밖으로 군사를 내보내 뚫어 보지만, 돌아오는 수는 매번 줄어든다. 그러다 청룡이 진영을 통째로 서남쪽, 성벽과 강 사이로 옮긴다.'
			)
		);
		B.splice(
			mapAt(B, 'pyongyang-668', 'ring') + 1,
			0,
			say('namsan', ['Brother. Silla banners on the far bank.', '…That was the last side we had.'], ['형. 강 건너에 신라 깃발이야.', '…남은 쪽이 거기 하나였는데.']),
			p(
				'A month goes by. Inside, the granaries go down the way the Tang campfires did, seven winters ago, and someone on the wall is counting.',
				'한 달이 지난다. 성안의 곳간이, 일곱 겨울 전 당군의 모닥불이 그랬듯 줄어 간다. 그리고 성벽 위의 누군가가 그것을 세고 있다.'
			)
		);

		set(
			B,
			'He goes out through the gate with the king',
			'He goes out through the south-west gate with the king and ninety-eight officials, carrying a white banner. The king of Goguryeo has worn the crown twenty-six years. For most of them a Yeon told him what to say. Today a Yeon is telling him again.',
			'그는 왕과 관리 아흔여덟 명과 함께 흰 깃발을 들고 서남쪽 성문을 나선다. 고구려의 왕은 스물여섯 해 동안 관을 썼다. 그 대부분의 날 동안 연씨 집안 사람이 그에게 할 말을 일러 주었다. 오늘도 연씨 집안 사람이 일러 준다.'
		);

		set(
			B,
			'The Tang come in before the bell has stopped ringing.',
			'The Tang come in through the south-west gate before the bell has stopped ringing. Quietly at first, then not quietly at all.',
			'종소리가 채 그치기도 전에 당군이 서남쪽 성문으로 들어온다. 처음엔 조용히, 그다음엔 전혀 조용하지 않게.'
		);
		const guardChip = '#8d8d95';
		B.splice(
			mapAt(B, 'pyongyang-668', 'gate') + 1,
			0,
			voice('Goguryeo guard', guardChip, ['Mangniji! The south-west gate— it’s open! They opened it from inside!'], ['막리지! 서남문이— 문이 열렸습니다! 안에서 열었습니다!']),
			say('namgun', ['Who had the gate?'], ['문을 누가 맡았지?']),
			voice('Goguryeo guard', guardChip, ['…The monk, Mangniji.'], ['…스님이었습니다, 막리지.']),
			say('namgun', ['The monk…?'], ['스님이…?'])
		);

		set(
			B,
			'When the gate towers burn, Namgun stabs himself',
			'The gate towers catch one after another, like lamps being lit for a feast. In his own hall, Namgun turns his sword on himself. He does it badly, the first thing he has done badly in the whole war.',
			'문루들이 잔치에 등불을 켜듯 하나씩 차례로 불붙는다. 남건은 제 전각에서 스스로를 찌른다. 서툴게 찌른다. 그 전쟁 내내 그가 처음으로 서툴게 한 일이다.'
		);
		B.splice(
			mapAt(B, 'pyongyang-668', 'fire') + 1,
			0,
			say(
				'lishiji',
				['Put out the granaries. Let the towers burn.', 'And the Mangniji’s body— alive? Then find him a surgeon.', 'I want him in the register, not the ditch.'],
				['곳간부터 끄시오. 문루는 타게 두고.', '막리지의 시신은— 살아 있다고? 그럼 의원을 붙이시오.', '도랑이 아니라 명부에 올릴 사람이오.']
			),
			p(
				'The surgeons save him, so that he can be sent alive to the farthest edge of the empire.',
				'의원들이 그를 살려 낸다. 산 채로 제국의 가장 먼 끝으로 보내기 위해서다.'
			)
		);

		B.splice(at(B, 'When the city falls, the empire doesn', 'p') + 1, 0, map('pyongyang-668', 'garrison'));
	}

	// #91 Stone Gate
	{
		const B = all[90].blocks;
		set(
			B,
			'Silla and what is left of the Goguryeo revival meet the Tang',
			'Silla and what is left of the Goguryeo revival hit the Tang camp under Baeksu Fortress together, and cut down several thousand. By noon the Tang are running back up the road to Pyongyang. Soon after, Silla is running after them.',
			'신라와 고구려 부흥군의 남은 이들이 백수성 아래 당군 진영을 함께 들이쳐 수천을 벤다. 한낮이 되자 당군은 평양 쪽 길로 되짚어 달아난다. 얼마 뒤, 신라가 그 뒤를 쫓는다.'
		);
		const wonsulChip = '#5b7fc4';
		const danChip = '#8d8d95';
		B.splice(
			mapAt(B, 'seokmun-672', 'baeksu') + 1,
			0,
			voice('Wonsul', wonsulChip, ['They’re breaking! Look at them go—', 'Mount up! Everyone up, before they’re over the hill!'], ['무너진다! 저것 봐—', '타! 다들 타, 고개 넘어가기 전에!']),
			p(
				'Every banner wants its own three thousand prisoners, so every banner rides off to find them. Nobody watches the Mohe horse leave the road.',
				'깃발마다 포로 삼천을 제 몫으로 챙기고 싶어서, 깃발마다 따로 흩어져 찾아 나선다. 말갈 기병이 길을 벗어나는 것은 아무도 보지 않는다.'
			),
			map('seokmun-672', 'chase')
		);
		Object.assign(B[at(B, 'strung out over two li', 'dialogue')], {
			en: ['Lieutenant. The column’s strung out over two li. We’re not in line.', '…And where did their horse go?'],
			lines: ['비장님. 대열이 이 리나 늘어졌습니다. 진이 안 섰어요.', '…그리고 저놈들 기병은 어디 갔습니까?']
		});
		set(
			B,
			'At Seokmun the Tang turn around.',
			'At Seokmun the Tang turn around. Out of the side valleys, north and south of the road, come the Mohe cavalry, into a Silla army that has not yet formed up. It is over in an afternoon.',
			'석문에서 당군이 돌아선다. 길 북쪽과 남쪽 옆 골짜기에서 말갈 기병이 쏟아져, 아직 진을 펴지도 못한 신라군을 친다. 한나절 만에 끝난다.'
		);

		const bridle = mapAt(B, 'seokmun-672', 'bridle');
		const [bridleMap] = B.splice(bridle, 1);
		const tail = at(B, 'He doesn’t cut it.', 'p');
		B.splice(
			tail,
			1,
			p(
				'He doesn’t cut it. Danneung turns the horse himself and runs it back down the road, east, through the dust, with a lieutenant on its back who screams at him the whole way.',
				'원술은 자르지 않는다. 담릉이 손수 말머리를 돌려, 등 위에서 내내 소리 지르는 비장을 태운 채 먼지 속을 동쪽으로, 왔던 길을 되짚어 달린다.'
			),
			bridleMap,
			voice('Wonsul', wonsulChip, ['Turn around—', 'Danneung, I swear on my father, turn this horse around!'], ['돌려—', '담릉, 아버지 이름을 걸고 말한다, 말 돌려!']),
			p('Danneung doesn’t answer. Seven Silla generals die in that valley. Wonsul is not one of them.', '담릉은 대답하지 않는다. 그 골짜기에서 신라 장수 일곱이 죽는다. 원술은 그 일곱에 들지 않는다.')
		);
	}

	// #95 Maeso
	{
		const B = all[94].blocks;
		set(
			B,
			'The army at Maeso is mostly Mohe',
			'The army at Maeso is mostly Mohe, and the Mohe are mostly horse. Thirty thousand of them graze the flats east of the walls. The grass is outside. No fortress on that river was built to stable a herd.',
			'매소성의 군대는 대부분 말갈이고, 말갈은 대부분 말이다. 삼만 필이 성벽 동쪽 들판에서 풀을 뜯는다. 풀은 성 밖에 있다. 그 강가의 어떤 성도 그만한 무리를 들이도록 지어지지 않았다.'
		);
		B.splice(at(B, 'Before dawn the herd moves all at once', 'p') + 1, 0, map('maeso-675', 'herd'));
		set(
			B,
			'Horses are the thing.',
			'Horses are the thing. An army that has lost thirty thousand horses on the Imjin is not riding to Surabol next spring, or the spring after. Li Jinxing knows it by noon. He takes what is left north across the Hantan.',
			'중요한 건 말이다. 임진강에서 말 삼만을 잃은 군대는 다음 봄에도, 그다음 봄에도 서라벌로 달려오지 못한다. 이근행은 한낮이 되기 전에 그걸 안다. 남은 것을 이끌고 북쪽으로 한탄강을 건넌다.'
		);
		B.splice(
			mapAt(B, 'maeso-675', 'rout') + 1,
			0,
			voice('Silla commander', '#4f7fbf', ['Let them go.', 'Count the horses first. Then the spears.'], ['보내 줘라.', '말부터 세. 창은 그다음이다.'])
		);
	}

	// #96 Final Ford
	{
		const B = all[95].blocks;
		set(
			B,
			'The last of it happens at the mouth of the Geum',
			'The last of it happens at the mouth of the Geum, in the eleventh month. Sixteen years ago the Tang came in through this same water, onto a mile of grey mud, while Baekje watched from the high ground. Seongchung had begged a different king to hold it. Now Xue Rengui brings the last fleet in from the open sea.',
			'마지막은 열한째 달, 금강 어귀에서 벌어진다. 열여섯 해 전 당군이 바로 이 물로 들어와 십 리 잿빛 개펄에 올랐고, 백제는 높은 땅에서 그것을 지켜보았다. 성충이 다른 임금에게 지켜 달라 애원했던 물목이다. 이제 설인귀가 마지막 함대를 끌고 먼바다에서 들어온다.'
		);
		const helmChip = '#8d8d95';
		const sideukChip = '#4f7fbf';
		B.splice(
			mapAt(B, 'gibeolpo-676', 'arrive') + 1,
			0,
			voice('Silla helmsman', helmChip, ['Sachan, they’ve built towers. On the ships. Towers.'], ['사찬님, 배 위에 망루를 올렸어요. 망루를요.']),
			voice('Sideuk', sideukChip, ['Then they’re heavy.'], ['그럼 무겁겠군.'])
		);
		set(
			B,
			'He takes eight boats up the estuary',
			'He takes eight boats out toward the Tang flagship on the last of the flood, close enough to be insulting. Arrows thud into his deck. He lets them. Then he turns, badly, the way a beaten man turns, and makes for the mudflats on the north shore.',
			'그는 밀물 끝자락을 타고 배 여덟 척을 당의 기함 쪽으로 몬다. 모욕이 될 만큼 가까이. 화살이 갑판에 박힌다. 그대로 둔다. 그러고는 진 사람이 돌듯 엉성하게 돌아서, 북쪽 기슭 개펄로 간다.'
		);
		B.splice(at(B, 'The tide turns under them.', 'p') + 1, 0, map('gibeolpo-676', 'aground'));
		const dup = B.findIndex((b) => b.kind === 'map' && b.routes?.includes('tang676-home'));
		if (dup >= 0) B.splice(dup, 1);
	}
});

const file = path.join(ROOT, 'src/lib/data/battles/seokmun-672.json');
const battle = JSON.parse(fs.readFileSync(file, 'utf8'));
const last = battle.phases.find((ph) => ph.id === 'bridle');
last.caption = 'Wonsul turns toward the Mohe. His aide turns him back and runs the horse back down the road the whole way, with the lieutenant screaming. Silla stops attacking after this, and starts building walls.';
last.captionKo = '원술이 말갈 쪽으로 말을 돌린다. 그의 보좌가 도로 돌려세우고, 소리 지르는 비장을 태운 채 왔던 길을 내내 되짚어 달린다. 이날 이후 신라는 치는 것을 멈추고 성을 쌓기 시작한다.';
fs.writeFileSync(file, JSON.stringify(battle, null, '\t') + '\n');
console.log('done');
