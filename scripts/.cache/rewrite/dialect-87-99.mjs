/**
 * Dialect pass, episodes #87–#99 (see DIALECT-PASS.md / DIALECTS.md).
 * Each edit swaps exact lines inside one dialogue block, matched by episode + speaker + an old line.
 * Idempotent: a pair whose new text is already present is skipped.
 */
import { editStory, lists } from '../story-ops.mjs';

const FIRST = 87;
const LAST = 99;

/** [episode, speaker (person id or speaker label), [[oldKo, newKo]…], [[oldEn, newEn]…]?] */
const EDITS = [
	/* #87 Pyongyang II — Goguryeo 평안 on the wall; surrender, court and Tang stay standard */
	[87, 'Pyongyang sentry',
		[
			['저놈이다. 흰옷에, 막대기에 달 두 개 단 놈.', '데놈이다. 흰옷에, 막대기에 달 두 개 단 놈.'],
			['우리 삼촌이 주필산에 있었거든. 저건 사람이 아니래. 여포래. 여포는 지치지도 않는대.', '우리 삼촌이래 주필산에 있었거든. 데건 사람이 아니래. 여포래. 여포는 지치지도 않는대.']
		],
		[
			['That’s him. The white one, with the two moons on a stick.', 'Aye, that’s him. The white one, with the two moons on a stick.'],
			['My uncle was at Stallion Mountain. He says that isn’t a man. It’s Lu Bu, and Lu Bu doesn’t get tired.', 'My uncle was at Stallion Mountain. He says yon’s no man. It’s Lu Bu, and Lu Bu doesn’t get tired.']
		]],
	[87, 'namsan', [['형… 저 사람, 저쪽 옷을 입었어.', '형… 데 사람, 데쪽 옷을 입었어.']]],
	[87, 'namsan', [['…남은 쪽이 거기 하나였는데.', '…남은 쪽이 거기 하나였디.']], [['…That was the last side we had.', '…Aye. That was the last side we had.']]],
	[87, 'namgun', [['스님은 가문도 없고, 파벌도 없고, 자식도 없소.', '스님은 가문도 없구, 파벌도 없구, 자식도 없수다.']], [['You have no clan, no faction, no sons.', 'You’ve no clan, no faction, no bairns.']]],
	[87, 'Goguryeo guard', [['막리지! 서남문이— 문이 열렸습니다! 안에서 열었습니다!', '막리지! 서남문이— 문이 열렸습네다! 안에서 연 겁네다!']]],
	[87, 'namgun', [['문을 누가 맡았지?', '문은 누구레 맡았네?']]],
	[87, 'Goguryeo guard', [['…스님이었습니다, 막리지.', '…스님이었습네다, 막리지.']]],

	/* #88 Mount Gain — Yushin drops into 경상 only at home: the empty stall, the bear */
	[88, 'yushin',
		[
			['일흔입니다, 전하. 셋을 묻었습니다.', '일흔입니더, 전하. 셋을 묻었심더.'],
			['말 대신 전쟁을 하나 찾아 주십시오. 또 무슨 맹세를 시키기 전에, 한 번만 더 가 보고 싶습니다.', '말 대신 전쟁을 하나 찾아 주이소. 또 무슨 맹세를 시키기 전에, 한 번만 더 가 보고 싶습니더.']
		],
		[['Find me a war instead. I’d like to go to one more before they make me swear to something else.', 'Find me a war instead. I’d rather like to go to one more before they make me swear to something else.']]],
	[88, 'yushin', [['어머님께 여쭤 보십시오. 집안 아이마다 들려주십니다.', '어머님께 여쭤 보이소. 집안 아이마다 들려주십니더.']]],
	[88, 'yushin', [['참을성 많은 곰입니다. 어머님은 그 대목만 오면 꼭 저를 보십니다.', '참을성 많은 곰입니다. 어머님은 그 대목만 오믄 꼭 저를 보십니더.']]],

	/* #90 Anseung — Goguryeo camp talk by the fires */
	[90, 'Geom Mojam',
		[
			['강을 지키오. 평양을 지키오.', '강을 디키오. 평양을 디키오.'],
			['도로 가져가려면 우리 시체를 넘어오라 하시오.', '도로 가져가갓다면 우리 시체를 넘어오라 하시오.']
		],
		[['If they want it back, they can climb over us.', 'If they’re wanting it back, they can climb over us.']]],
	[90, 'Anseung', [['두 해 전에 저들은 평양도 넘었소. 우리 것보다 나은 성벽을 두고도.', '두 해 전에 데들은 평양도 넘었소. 우리 것보다 나은 성벽을 두고도.']]],
	[90, 'Geom Mojam', [['평양 땅에는 사백 년 묵은 임금들이 묻혀 계시오. 그분들을 두고 신라 사랑채로 가겠다는 거요?', '평양 땅에는 사백 년 묵은 임금들이 묻혀 계시오. 그분들을 두고 신라 사랑채로 가갓다는 거요?']]],
	[90, 'Geom Mojam',
		[
			['그럼 가시오. 그 사천 호 데리고.', '기럼 가시오. 그 사천 호 데리고.'],
			['나는 남는 자들과 지키겠소.', '나는 남는 자들과 디키갓소.']
		]],
	[90, 'Anseung', [['하룻밤 자고 생각합시다.', '하룻밤 자고 생각합세다.']]],

	/* #92 Stone Gate — Silla lieutenant and aide in the field; Chunchu's home flashback */
	[92, 'Wonsul',
		[
			['무너진다! 저것 봐—', '무너진다! 저거 봐라—'],
			['타! 다들 타, 고개 넘어가기 전에!', '타라! 다 타래이, 고개 넘어가기 전에!']
		],
		[['Mount up! Everyone up, before they’re over the hill!', 'Mount up! Up, the lot of you, before they’re over the hill!']]],
	[92, 'Danneung',
		[
			['비장님. 대열이 이 리나 늘어졌습니다. 진이 안 섰어요.', '비장님. 대열이 이 리나 늘어졌심더. 진이 안 섰어요.'],
			['…그리고 저놈들 기병은 어디 갔습니까?', '…그라고 저놈들 기병은 어데 갔습니꺼?']
		],
		[['…And where did their horse go?', '…And where’s their horse got to?']]],
	[92, 'Wonsul', [['저놈들 달아나잖아. 달아나는 놈 쫓는 데 무슨 진이야.', '저놈들 달아난다 아이가. 달아나는 놈 쫓는 데 무슨 진이고.']]],
	[92, 'Wonsul', [['놔.', '놔라.']]],
	[92, 'Danneung',
		[
			['못 놓습니다.', '몬 놓습니더.'],
			['죽는 건 어려운 게 아닙니다, 비장님. 바보도 열 숨 안에 합니다.', '죽는 건 어려운 기 아입니더, 비장님. 바보도 열 숨 안에 합니다.'],
			['죽을 자리를 고르는 게 어렵지요. 여긴 도랑입니다. 여기서 죽으면 아무것도 못 삽니다.', '죽을 자리를 고르는 기 어렵지요. 여는 도랑입니더. 여서 죽으믄 아무것도 몬 삽니다.']
		],
		[['Dying’s not the hard part, Lieutenant. Any fool can do it in the next ten breaths.', 'Dying’s not the hard part, Lieutenant. Any fool can manage it in the next ten breaths.']]],
	[92, 'Wonsul', [['놔. 안 놓으면 손목을 자른다.', '놔라. 안 놓으믄 손목을 잘라 삔다.']], [['Let go, or I’ll cut your hand off.', 'Let go, or I’ll have your hand off.']]],
	[92, 'Danneung', [['자르십시오. 그래도 쥐고 있을 겁니다.', '자르이소. 그래도 쥐고 있을 낍니더.']]],
	[92, 'Wonsul',
		[
			['돌려—', '돌리라—'],
			['담릉, 아버지 이름을 걸고 말한다, 말 돌려!', '담릉, 아버지 이름 걸고 말한다, 말 돌리라!']
		]],
	[92, 'chunchu', [['법민아. 백제가 무너진 다음에 무슨 일이 일어날 것 같으냐?', '법민아. 백제 무너지고 나믄 무슨 일이 날 것 같노?']], [['Bupmin. What do you think happens after Baekje falls?', 'Bupmin. What do you suppose happens after Baekje falls?']]],
	[92, 'munmu', [['고려를 칩니다.', '고려를 칩니더.']]],
	[92, 'munmu', [['…통일입니다.', '…통일입니더.']]],
	[92, 'chunchu', [['아니다. / 그 다음은 <b>우리 차례</b>다.', '아이다. / 그 다음은 <b>우리 차례</b>다.']]],
	[92, 'chunchu', [[
		'그때 절대로 먼저 치지 마라. / 저들이 고려에서 지칠 때까지 기다려라. / 성은 하나씩 되찾고, 되찾을 때마다 사죄 사절을 보내라. / 저들이 원하는 건 땅이 아니라 문서니까.',
		'그때 절대로 먼저 치지 마라. / 저들이 고려에서 지칠 때까지 기다려라. / 성은 하나씩 되찾고, 되찾을 때마다 사죄 사절을 보내라. / 저들이 원하는 건 땅이 아이고 문서니까.'
	]]],
	[92, 'munmu', [['아버지. 그걸 어떻게 다 아십니까.', '아버지. 그걸 우째 다 아십니꺼.']]],
	[92, 'chunchu', [['이세민한테 배웠다. / 그자가 나한테 하려던 걸 그대로 적어 뒀거든.', '이세민한테 배웠다. / 그자가 내한테 할라 카던 걸 고대로 적어 놨거든.']]],

	/* #93 Wonsul — the steward and the hill farmer are full 경상; the king's hall stays standard */
	[93, 'Steward', [['나리. 작은 도련님이십니다. 다치신 것 같습니다. 말이—', '나리. 작은 도련님이십니더. 다치신 거 같심더. 말이—']]],
	[93, 'Farmer',
		[
			['괭이를 무슨 빚쟁이 잡듯 쥐네.', '괭이를 무슨 빚쟁이 잡듯이 쥐는구마.'],
			['군인이었소?', '군인이었는교?']
		]],
	[93, 'Wonsul', [['아니오.', '아이요.']]],

	/* #94 Kim Yushin† — the deathbed, the answer to Kangrim, the sister at the well */
	[94, 'yushin', [['…그 아이는. 밥은 먹습니까?', '…그 아이는. 밥은 묵습니꺼?']]],
	[94, 'yushin',
		[
			['…아닙니다.', '…아입니더.'],
			['됐습니다. 먹고 있다니.', '됐심더. 묵고 있다 카니.']
		]],
	[94, 'yushin', [['들어가고 싶은 건 부끄러운 게 아니야. 아니라고 꾸미는 게 부끄러운 거지.', '들어가고 싶은 건 부끄러운 게 아이다. 아니라고 꾸미는 게 부끄러운 거지.']]],
	[94, 'munhee', [['오라버니. 이제 신라 사람이에요?', '오라버니. 인자 신라 사람인교?']]],
	[94, 'yushin', [['…모르겠다. 물어봐 다오, 저들에게.', '…모르겠다. 물어봐 도, 저들한테.']]],

	/* #96 Maeso — Silla soldiers in the dune grass and at the picket lines; audiences stay standard */
	[96, 'Sideuk', [['장군, 말을 내립니다. 말부터요.', '장군, 말을 내립니더. 말부터요.']]],
	[96, 'Munhun', [['그래. 내리게 둬.', '그래. 내리게 놔둬라.']]],
	[96, 'Sideuk', [['상륙을 막으라고 하셨는데요.', '상륙을 막으라 카셨는데요.']]],
	[96, 'Munhun',
		[
			['막을 거다.', '막을 끼다.'],
			['젖은 모래에 선 말은 못 돈다. 배가 빌 때까지 기다려.', '젖은 모래에 선 말은 못 돈다. 배가 빌 때까지 기다리래이.']
		],
		[['We will.', 'We shall.']]],
	[96, 'Sideuk', [['…젖은 모래라. 기억해 두겠습니다.', '…젖은 모래라. 기억해 두겠심더.']]],
	[96, 'Sideuk',
		[['당나라 놈들은 여포가 환생한 거라고 합니다. 우리 애들도 다 들었고요.', '당나라 놈들은 여포가 환생한 기라 캅니더. 우리 애들도 다 들었고요.']],
		[['The Tang call him Lu Bu reborn. Our boys have heard it too.', 'The Tang call him Lu Bu reborn. Our lads have heard it too.']]],
	[96, 'Munhun',
		[
			['그럼 여포도 남들처럼 발 좀 적시라지.', '그라믄 여포도 남들처럼 발 좀 적시라 캐라.'],
			['가만 엎드려 있어.', '가만 엎드려 있어라.']
		]],
	[96, 'Silla commander',
		[
			['성벽은 두고.', '성벽은 고마 놔두고.'],
			['말뚝 줄을 끊어. 말부터 데려와.', '말뚝 줄 끊어라. 말부터 데리고 온나.']
		]],
	[96, 'Wonsul', [['비장입니다. 석문의.', '비장입니더. 석문의.']]],
	[96, 'Silla commander', [['말부터 세. 창은 그다음이다.', '말부터 세라. 창은 그다음이데이.']]],

	/* #97 Final Ford — Sideuk and his helmsman on the mudflats */
	[97, 'Silla helmsman', [['사찬님, 배 위에 망루를 올렸어요. 망루를요.', '사찬님, 배 우에 망루를 올렸심더. 망루를요.']]],
	[97, 'Sideuk', [['그럼 무겁겠군.', '그라믄 무겁겠네.']]],
	[97, 'Silla helmsman', [['사찬님, 또 나갑니까?', '사찬님, 또 나갑니꺼?']]],
	[97, 'Sideuk', [['물때 바뀌면.', '물때 바뀌믄.']]],
	[97, 'Sideuk', [['큰 배는 개펄에서 못 돈다. 끌고 들어와.', '큰 배는 개펄에서 못 돈다. 끌고 들어온나.']]],
	[97, 'Silla helmsman', [['옵니다! 다— 사찬님, 큰 놈들이 다 따라옵니다!', '옵니더! 다— 사찬님, 큰 놈들이 다 따라옵니더!']]],
	[97, 'Sideuk',
		[
			['당연하지. 두 번이나 이겼으니까.', '당연하제. 두 번이나 이겼으니까.'],
			['계속 달려. 겁먹은 척해.', '계속 달리라. 겁먹은 척해라.']
		],
		[['Keep running. Look scared.', 'Keep running. Look frightened.']]],
	[97, 'Silla helmsman', [['척하는 거 아닙니다, 사찬님.', '척하는 거 아입니더, 사찬님.']]],
	[97, 'Sideuk', [['지금이다. 돌아. 다들 돌아!', '지금이다. 돌아라. 다 돌아라!']]],

	/* #98 The King for All — Munhee and her son at home; the hall, the temple and the edict stay standard */
	[98, 'munhee', [['가만있어라. 목이 삐뚤다.', '가만있어라. 목이 삐뚤다 아이가.']]],
	[98, 'munmu', [['어머니. 저 오늘 삼한의 왕이 됩니다.', '어머니. 저 오늘 삼한의 왕이 됩니더.']]],
	[98, 'munhee', [['그러니까 더 가만있어야지.', '그라니까 더 가만있어야제.']]],
	[98, 'munhee',
		[
			['알아.', '안다.'],
			['너를 막으려던 나라마다 짐을 싸 줬으니까.', '니 막을라 카던 나라마다 짐을 싸 줬으니까.']
		]],
	[98, 'munhee',
		[
			['네 누이는 이 방에서 대야로 떠났다.', '니 누이는 이 방에서 대야로 떠났다.'],
			['가만있어. 문 하나에 자식을 또 잃을 생각은 없다.', '가만있어라. 문 하나에 자식을 또 잃을 생각은 없다.']
		]],
	[98, 'munhee', [['글씨는 하나도 안 늘었구나.', '글씨는 쪼매도 안 늘었네.']]],
	[98, 'munmu', [['아버지가 늘 하시던 말씀이 있었잖습니까. 천 년 가는 나라.', '아버지가 늘 하시던 말씀 안 있습니꺼. 천 년 가는 나라.']]],
	[98, 'munmu', [['외숙은 늘 저게 행성이라 하셨지.', '외숙은 늘 저게 행성이라 카셨지.']]],

	/* #99 Balhae — Gulgul and his son in the far north (함경); Gesomun's flashback is 평안 */
	[99, 'daejoyoung',
		[
			['아버지…', '아바이…'],
			['아버지, 발이… 발이 안 느껴져요.', '아바이, 발이… 발이 안 느껴집꾸마.']
		]],
	[99, 'gulgul', [['아픈 것보단 낫다.', '아픈 것보단 낫지비.']]],
	[99, 'daejoyoung', [['그게 무슨— 아버지!', '그게 무스거— 아바이!']]],
	[99, 'daejoyoung', [['아버지. 그거… 뭐예요?', '아바이. 그거… 무스거임둥?']]],
	[99, 'daejoyoung',
		[
			['근데 왜 아버지가요?', '근데 왜 아바이가요?'],
			['아버지는… 말갈이잖아요. 다들 그러던데.', '아바이는… 말갈이잖아요. 다들 그러던데.']
		]],
	[99, 'gulgul', [['고구려 군사들이 왔다 갔지. 연 장군의 군사들.', '고구려 군사들이 왔다 갔지비. 연 장군의 군사들.']]],
	[99, 'daejoyoung', [['아버지 —', '아바이 —']]],
	[99, 'gesomun', [['이놈 봐라. 다 타 버린 집을 지키고 섰네.', '이놈 보라우. 다 타 버린 집을 디키구 섰구만.']], [['Look at this one. Guarding a house that’s already burned.', 'Look at this wee one. Guarding a house that’s already burned.']]],
	[99, 'gesomun', [['춥냐.', '춥네?']]],
	[99, 'gulgul', [['…아닙니다.', '…아닙네다.']]],
	[99, 'gesomun', [['거짓말 마라. 나도 춥다.', '거짓말 말라우. 나도 춥다.']]]
];

const who = (b) => b.person ?? b.speaker;

/** Swap [old, new] pairs in arr; returns count changed, throws if a pair is neither old nor already new. */
function swap(arr, pairs, tag) {
	let n = 0;
	for (const [from, to] of pairs) {
		const i = arr.indexOf(from);
		if (i >= 0) {
			arr[i] = to;
			n++;
		} else if (!arr.includes(to)) throw new Error(`${tag}: line not found: ${from}`);
	}
	return n;
}

editStory((story) => {
	const entries = story.flatMap((c) => c.entries);
	const tally = {};
	let changed = 0;
	for (const [ep, speaker, ko, en = []] of EDITS) {
		if (ep < FIRST || ep > LAST) throw new Error(`#${ep} outside range`);
		const e = entries[ep - 1];
		const tag = `#${ep} ${speaker}`;
		const [probeOld, probeNew] = ko[0];
		const hits = lists(e)
			.flat()
			.filter((b) => b.kind === 'dialogue' && who(b) === speaker && (b.lines.includes(probeOld) || b.lines.includes(probeNew)));
		if (hits.length !== 1) throw new Error(`${tag}: ${hits.length} blocks match "${probeOld}"`);
		const b = hits[0];
		const n = swap(b.lines, ko, `${tag} ko`) + swap(b.en, en, `${tag} en`);
		if (b.lines.length !== b.en.length) throw new Error(`${tag}: ko/en length mismatch`);
		if (n) {
			changed += n;
			tally[ep] = (tally[ep] ?? 0) + ko.length;
		}
	}
	console.log(changed ? `changed ${changed} lines` : 'already applied', tally);
	return changed > 0;
});
