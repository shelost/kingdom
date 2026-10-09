// Final Stand rewrite (#78–#86). Run once: `node scripts/.cache/rewrite/finalstand.mjs`.
// Each episode is rebuilt from fresh blocks inside its own editStory call and skipped if its marker is already present.
import { editStory, find } from '../story-ops.mjs';

const CH = {
	boksin: '#a8781f', pung: '#e6c76a', takutsu: '#b05575', sateksangya: '#b8933f', sangji: '#8a6b1f', yushin: '#4a8fe0',
	liurengui: '#1f2937', namgun: '#9e3b32', wuzetian: '#9d7bd0', gaozong: '#b8935a', gesomun: '#d0362f', munmu: '#3fa9c9',
	pangxiaotai: '#c4b896', xuerengui: '#e8e3d5', kangrim: '#5f5f6b', haewonmek: '#6b5b6e', sudingfang: '#d95f4b',
	yung: '#d4b45a', namseng: '#c25a4e', yumla: '#7c3aed', namsan: '#d4776a', shinsung: '#8f7b70', yuridora: '#f97316',
	haenyeo: '#6fa8a0', gulgul: '#8fa87a', bojang: '#8f4a44', kimpunghun: '#7a8aa8'
};
const P = (html, ko) => ({ kind: 'p', html, ko });
const CARD = (html, ko) => P(`<b>${html}</b>`, `<b>${ko}</b>`);
const S = (label, ko) => ({ kind: 'scene', label, ko });
const D = (who, en, ko) => {
	const b = { kind: 'dialogue' };
	if (typeof who === 'string') Object.assign(b, { chip: CH[who] ?? '#8d8d95', person: who });
	else Object.assign(b, { chip: who.chip ?? '#8d8d95', speaker: who.speaker });
	return Object.assign(b, { lines: ko, en });
};
const NPC = (speaker, chip) => ({ speaker, chip });
const strip = (s = '') => s.replace(/<[^>]+>/g, '');
const allText = (e) => JSON.stringify(e.blocks);

/** Clone an existing block by text fragment (throws if missing), optionally patching fields. `''` picks the first map. */
const keeper = (e) => (frag, patch = {}) => {
	const hit = frag ? find(e, frag)[0] : find(e, '', (b) => b.kind === 'map')[0];
	if (!hit) throw new Error(`#${e.title}: no block with “${frag}”`);
	return { ...structuredClone(hit.b), ...patch };
};
const reanchor = (e, from, to) => {
	for (const im of e.images ?? []) if (im.at === from) im.at = to;
};

function episode(n, marker, build) {
	editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (allText(e).includes(marker)) {
			console.log(`#${n} already done`);
			return false;
		}
		e.blocks = build(e, keeper(e));
		console.log(`#${n} ${e.title}: ${e.blocks.length} blocks`);
	});
}

/* ───────────────────────── #78 Pyongyang I ───────────────────────── */
episode(78, 'Every child in the city will tell you so', (e, K) => {
	const walls = 'The walls are still here.';
	for (const from of ['The impenetrable walls of Pyongyang', 'The impenetrable walls of Pyongyang are tested once again']) reanchor(e, from, walls);
	reanchor(e, 'fortress gate', 'through the fortress gate');
	return [
		P('Pyongyang has never fallen. Every child in the city will tell you so, usually twice.',
			'평양성은 한 번도 함락된 적이 없다. 성안의 아이라면 누구나 그렇게 말해 준다. 대개 두 번씩.'),
		P("Red Sun's capital sits on its ridge: a red two-storey gate, grey stone, and clouds that always look about to pick a side. The last emperor tried these walls. So did the one before him. The walls are still here.",
			'붉은 해의 도성이 능선 위에 앉아 있다. 붉은 이층 문루, 회색 돌, 어느 편을 들지 막 정하려는 듯한 구름. 지난 황제도 이 성벽을 두드렸다. 그 전 황제도 그랬다. 성벽은 아직 그대로다.'),
		K('A fleet up the river, an army at the Amnok'),
		S('The Wall', '성벽'),
		P("Up on the wall, Gesomun's second son is explaining this to a sentry who did not ask.",
			'성벽 위에서 연개소문의 둘째 아들이, 묻지도 않은 보초에게 그 이야기를 해 주고 있다.'),
		{ kind: 'card', person: 'namgun', caption: 'Gesomun’s second son. Loud, loyal, and he believes everything he’s told twice.', ko: '연개소문의 둘째 아들. 목소리가 크고, 충직하고, 들은 말은 두 번씩 믿는다.' },
		K('Pyongyang does not fall.'),
		D('namsan', ['You said that yesterday.'], ['어제도 그 말 했잖아.']),
		D('namgun', ['It was true yesterday too.'], ['어제도 맞는 말이었으니까.']),
		P('Their father walks the wall behind them with a scout’s report in his fist. A Mohe man walks one step behind him, as he has for twenty-seven years. Nobody introduces Gulgul. Nobody ever has.',
			'그 뒤로 아버지가 정찰 보고를 주먹에 쥔 채 성벽을 걷는다. 말갈 사내 하나가 한 걸음 뒤에서 따라 걷는다. 스물일곱 해째 그 자리다. 아무도 걸걸을 소개하지 않는다. 한 번도 그런 적이 없다.'),
		D('gesomun', ['Four beasts, it says. The emperor sends animals now.', 'One of them brought his sons. All thirteen of them.'],
			['짐승 네 마리를 보냈단다. 이제 황제가 짐승을 부려.', '그중 한 놈은 아들들을 데려왔다. 열세 놈 전부.']),
		D('namgun', ['Thirteen? He brought children to a war?'], ['열셋이요? 전쟁에 애들을 데려왔단 말입니까?']),
		D('gesomun', ['Not children. Grown men.', 'They came to watch their father work.'], ['애들 아니다. 다 큰 놈들이야.', '아비가 일하는 걸 구경하러 왔다더군.']),
		P('He says it the way other men mention rain. Then he goes down the stairs to send his eldest north, to hold the river.',
			'다른 사람들이 비 온다는 말 하듯 그렇게 말한다. 그러고는 계단을 내려가, 맏아들을 북쪽 강으로 보낸다.'),
		S('Luoyang', '낙양'),
		K('In Luoyang the Third Emperor announces'),
		K('Ask the six horses at Zhaoling how that went.'),
		K('…We will send someone.'),
		S('The Taedong', '대동강'),
		P('The someone is the Red Fowl, the old steppe horseman who took Sabi. He comes up the Taedong in the eighth month and takes the river forts one by one. Then he sits down in front of Pyongyang to wait for winter to soften it. Winter has never been on anybody’s side but Goguryeo’s.',
			'그 다른 사람이 바로 주작이다. 사비를 무너뜨린 늙은 초원의 기병. 그는 팔월에 대동강을 거슬러 올라와 강가의 성들을 하나씩 빼앗는다. 그러고는 평양성 앞에 눌러앉아 겨울이 성을 무르게 해 주기를 기다린다. 겨울은 고구려 말고는 누구 편도 들어 본 적이 없다.'),
		S('The Frozen River', '얼어붙은 강'),
		P('Namseng holds the Amnok. He is twenty-seven, the heir, and he has read every record of every crossing.',
			'남생이 압록강을 지킨다. 스물일곱, 후계자, 그리고 지금껏 있었던 모든 도하의 기록을 다 읽은 사람이다.'),
		P('His orders are simple. Tens of thousands of picked men, one river, nobody across. On the far bank waits the White Dragon, the old emperor’s Turkish general. He once asked to be buried alive beside his master. They told him no. He has been looking for a useful place to die ever since.',
			'명령은 간단하다. 정예 수만, 강 하나, 아무도 건너오지 못하게. 건너편 둑에는 백룡이 기다린다. 선제의 돌궐 장수다. 그는 한때 주군 곁에 산 채로 묻히게 해 달라고 청했다. 조정은 허락하지 않았다. 그 뒤로 그는 쓸모 있게 죽을 자리를 찾아다니는 중이다.'),
		P('Then the ninth month turns cold. Not autumn cold. Wrong cold.',
			'그러다 구월에 날이 추워진다. 가을 추위가 아니다. 잘못된 추위다.'),
		D(NPC('officer'), ['Commander. The shallows are white.', '…The middle’s going too.'], ['장군님. 여울이 하얗게 얼었습니다.', '…가운데도 얼고 있습니다.']),
		D('namseng', ['The river has never frozen hard in the ninth month.', 'Not in any record.'], ['구월에 강이 단단히 언 적은 없다.', '어느 기록에도 없어.']),
		D(NPC('officer'), ['Sir. The river hasn’t read the records.'], ['장군님. 강은 기록을 안 읽습니다.']),
		P('At dawn the drums start on the far bank. The White Dragon does not build a bridge. He walks out onto the ice himself, leading his horse, and stamps twice.',
			'새벽에 건너편 둑에서 북소리가 시작된다. 백룡은 다리를 놓지 않는다. 그는 말고삐를 쥐고 몸소 얼음 위로 걸어 나와, 발을 두 번 구른다.'),
		P('It holds. His army follows him across a river that is no longer there, drumming as it comes. The first Goguryeo arrows skitter off the ice. The second volley never comes. Men who were told to guard water do not know how to guard a floor.',
			'얼음은 버틴다. 그의 군대가 북을 치며 더는 강이 아닌 강을 건너온다. 고구려의 첫 화살은 얼음 위로 미끄러진다. 두 번째 화살은 끝내 날아가지 않는다. 물을 지키라는 명을 받은 병사들은 마룻바닥을 지키는 법을 모른다.'),
		D('namseng', ['Hold the bank! Hold— the bank is—'], ['둑을 지켜라! 지켜— 둑이—']),
		P('There is no bank. There is only ice, and then there is everywhere. Thirty thousand men die defending a line that has gone white. Namseng gets away with his life and very little else.',
			'둑은 없다. 얼음뿐이고, 그다음엔 사방이 다 길이다. 하얗게 지워진 선 하나를 지키다 삼만 명이 죽는다. 남생은 목숨만, 그리고 그 밖에는 거의 아무것도 없이 빠져나온다.'),
		S('The Gate', '성문'),
		P('He comes home through the fortress gate at dusk, on a borrowed horse. His father is waiting under the red gate. Gulgul holds the lamp.',
			'그는 해 질 녘, 빌린 말을 타고 성문을 지나 돌아온다. 아버지가 붉은 문루 아래서 기다리고 있다. 걸걸이 등불을 들고 있다.'),
		K('One river, Namseng. I gave you one river.'),
		D('namseng', ['Not in the ninth month, Father. There is no precedent—'], ['구월에는 아닙니다, 아버님. 전례가—']),
		D('gesomun', ['Precedent! The river can’t read, you idiot.'], ['전례! 강이 글을 읽냐, 이놈아.']),
		D('namgun', ['Father, he brought the men home. Half of them—'], ['아버님, 형님이 병사들을 데리고 돌아왔습니다. 절반은—']),
		D('gesomun', ['Half. He left with all of them.'], ['절반. 갈 때는 전부 데리고 갔다.']),
		P('Nobody speaks. Namseng waits for the blow. He has been waiting for one since he was eleven, at the Liao, when an emperor’s men gave it to him instead.',
			'아무도 말하지 않는다. 남생은 매를 기다린다. 열한 살 때 요하에서, 아버지 대신 황제의 사람들에게 매를 맞은 뒤로 그는 줄곧 그 매를 기다려 왔다.'),
		P('It does not come. Gesomun lays a hand on the iron studs of the gate, the way you would test a horse’s leg.',
			'매는 오지 않는다. 개소문은 말의 다리를 짚어 보듯, 성문의 쇠못 위에 손을 얹는다.'),
		D('gesomun', ['Listen. Walls don’t fall. Nobody’s ever knocked these down.', 'Gates get opened. From the inside.', 'This one’s yours now. Remember which side of it you’re standing on.'],
			['잘 들어. 성벽은 안 무너진다. 이걸 무너뜨린 놈은 아무도 없어.', '문이 열리는 거다. 안에서.', '이제 이 문은 네 거다. 네가 어느 쪽에 서 있는지 잊지 마라.']),
		D('namseng', ['…Yes, Father.'], ['…예, 아버님.']),
		P('Remember this gate. All three of his sons will.', '이 문을 기억해 두시라. 그의 세 아들도 기억할 테니.'),
		S('The Campfires', '모닥불'),
		P('The Red Fowl’s army freezes in the snow outside the walls. Every night Gesomun counts its campfires from the parapet. Every night there are fewer.',
			'주작의 군대가 성 밖 눈 속에서 얼어 간다. 개소문은 밤마다 성가퀴에서 적진의 모닥불을 센다. 밤마다 줄어 있다.'),
		D('gesomun', ['They’re eating the horses. Fires go down when the horses run out.', 'Keep counting, Gulgul. The night they stop going down, somebody’s feeding them.'],
			['말을 잡아먹고 있는 거다. 말이 떨어지면 불도 줄지.', '계속 세라, 걸걸. 불이 안 줄어드는 밤이 오면, 누가 저놈들을 먹이고 있는 거다.']),
		D('gulgul', ['…Yes, sir.'], ['…예.']),
		S('Surabol', '서라벌'),
		P('In the twelfth month a letter comes down from the north. The Red Fowl is out of rice. Munmu reads it to his generals. Everyone in the room knows that road in winter. Nobody offers.',
			'섣달에 북쪽에서 편지가 내려온다. 주작의 군량이 떨어졌다. 문무가 장수들 앞에서 편지를 읽는다. 그 방에 겨울의 그 길을 모르는 사람은 없다. 아무도 나서지 않는다.'),
		D('munmu', ['If they starve out there, the emperor will remember who let them.', 'And everything my father was promised starves with them.'],
			['저들이 저기서 굶어 죽으면, 황제는 누가 그렇게 뒀는지 기억할 것이오.', '선왕께서 받으신 약속도 저들과 함께 굶어 죽소.']),
		P('Silence. Then Kim Yushin, who is sixty-six, gets up.', '침묵. 그러다 예순여섯의 김유신이 자리에서 일어난다.'),
		K('Uncle. Not you. Send someone younger.'),
		K('Hanseul and I do.'),
		K('Rice for the Red Fowl, through enemy country', {
			caption: 'Rice for the Red Fowl, through enemy country, in the dead of winter, driven by the oldest general in Silla.',
			ko: '주작에게 보낼 쌀. 적국을 가로질러, 한겨울에, 신라에서 가장 늙은 장수가 몬다.'
		}),
		K('The White Tiger has thirteen sons.')
	];
});

/* ───────────────────────── #79 Snake River ───────────────────────── */
episode(79, 'Let him walk on it.', (e, K) => [
	K('The White Tiger drives his host into the Snake River.'),
	K('Shallow, slow, and patient with men who think rivers are roads.'),
	K('The White Tiger thought the river was a road.'),
	S('The Ford', '여울'),
	P('Here is the plan, such as it is. The Tiger is marching to join the Red Fowl outside Pyongyang. If he gets there, the city is in a ring.',
		'계획이라고 할 만한 건 이렇다. 백호는 평양성 밖의 주작과 합치려고 행군 중이다. 그가 거기 닿으면, 도성은 포위된다.'),
	K('A Tang general who brought all his sons to war'),
	P('Gesomun lets him get halfway. The Snake has gravel at the edges and mud in the middle, and Gesomun knows which is which.',
		'개소문은 그를 강 한복판까지 들어오게 둔다. 사수는 가장자리가 자갈이고 가운데가 진흙이다. 개소문은 어디가 어딘지 안다.'),
	D('gesomun', ['He thinks it’s a road. Let him walk on it.', 'When the middle horses sink — both banks. All at once.'],
		['저놈은 강을 길로 안다. 걸어 들어오게 둬.', '가운데 말들이 빠지면 — 양쪽 둑에서. 한꺼번에.']),
	P('The middle horses sink. Both banks open up at once.', '가운데 말들이 빠진다. 양쪽 둑이 한꺼번에 열린다.'),
	S('Thirteen Sons', '열세 아들'),
	P('The river does not take them in a heap. Yeon counts. Chang’an’s clerks will later write <i>thirteen sons</i> as if a number were a grave. It is a morning. The water is February-cold.',
		'강은 그들을 한꺼번에 삼키지 않는다. 연개소문이 센다. 훗날 장안의 서기들은 <i>열세 아들</i>이라고, 숫자가 무덤이라도 되는 듯 적을 것이다. 지금은 아침이고, 물은 이월의 물처럼 차다.'),
	K('The thirteenth and the twelfth come together'),
	K('Thirteen.'),
	K('The eleventh tries the reeds.'),
	K('Eleven.'),
	P('The tenth and the ninth turn back toward their father. That is the expensive choice. They die reaching for a sleeve that is still too far upriver.',
		'열째와 아홉째는 아버지 쪽으로 말머리를 돌린다. 값비싼 선택이다. 둘은 아직 너무 먼 상류의 소매를 향해 손을 뻗다가 죽는다.'),
	K('Ten.'),
	P('The eighth is the archer. He puts three shafts into the rim of Yeon’s shield and the fourth into his horse’s neck. The horse goes down, and Yeon goes into the water with it.',
		'여덟째는 궁수다. 그는 연개소문의 방패 테두리에 화살 셋을 박고, 넷째 화살을 말의 목에 꽂는다. 말이 쓰러지고, 연개소문도 함께 물속으로 처박힌다.'),
	S('Yumla Defied', '염라를 거스르다'),
	P('In the worst hour of it — arrows spent, horse down, a Tang blade a finger from his throat — the air thins the way Tamla stories promised. The river stops moving. <b>Kangrim</b> and <b>Haewonmek</b> are standing on it, a ledger half-open between them.',
		'가장 나쁜 순간 — 화살은 떨어지고, 말은 쓰러지고, 당군의 칼날이 목에서 한 치 앞에 — 탐라의 이야기가 말하던 대로 공기가 엷어진다. 강물이 멈춘다. <b>강림</b>과 <b>해원맥</b>이 그 위에 서 있다. 둘 사이에 장부가 반쯤 펼쳐져 있다.'),
	K('Your page is… persuasive today.'),
	K('are you choosing Goguryeo, or choosing not to be finished'),
	K('Any last words?'),
	K('And neither is your business until I am done.'),
	K('I still have sons to disappoint.'),
	P('Then he turns his back on them. He takes hold of his own body the way you take a coat off a peg, and puts it back on. The river starts moving again.',
		'그러고는 그들에게 등을 돌린다. 못에 걸린 겉옷을 집어 들듯 제 몸을 붙잡아, 도로 걸쳐 입는다. 강물이 다시 흐른다.'),
	P('He stands up on will alone. The blade misses. He breaks the spearman’s wrist before the man has finished the thrust. Behind him, the two reapers close the ledger with something like respect.',
		'그는 오직 의지 하나로 일어선다. 칼날이 빗나간다. 그는 창병이 찌르기를 다 끝내기도 전에 그 손목을 꺾는다. 그 뒤에서 두 저승차사가 존경 비슷한 것을 담아 장부를 덮는다.'),
	K('Keep the country a little longer, then.'),
	K('Next time we bring a longer chain.'),
	P('The archer is still nocking his fifth arrow. He does not finish it. Afterward Yeon takes the bow out of the water and breaks it across his knee.',
		'궁수는 아직 다섯째 화살을 시위에 메기는 중이다. 끝내 다 메기지 못한다. 연개소문은 나중에 그 활을 물에서 건져 무릎에 대고 부러뜨린다.'),
	K('Eight. The bow ends here.'),
	P('The seventh almost makes the far bank. Yeon’s throw finds him between the shoulder-blades, and the current carries him the rest of the way.',
		'일곱째는 거의 건너편 둑에 닿는다. 연개소문이 던진 창이 그의 견갑골 사이에 박히고, 나머지 길은 물살이 데려다준다.'),
	K('Baekju…'),
	K('Seven. Home is not that bank.'),
	P('Three at once in a knot of horses: the sixth, the fifth, the fourth. They shout one father’s name in three pitches.',
		'뒤엉킨 말들 사이에서 셋이 한꺼번에. 여섯째, 다섯째, 넷째. 그들은 한 아버지의 이름을 세 가지 목소리로 부른다.'),
	K('Six. Five. Four.'),
	P('The third is old enough to bargain. He offers the banner, the southern levy, a road south, if the Mangniji will count him as a messenger instead of a son.',
		'셋째는 흥정할 나이다. 그는 깃발과 남쪽의 징병과 남으로 가는 길을 내놓는다. 막리지가 자기를 아들이 아닌 전령으로 세어 준다면.'),
	K('Let me go as a messenger.'),
	K('You did not come as a messenger.'),
	P('The second is younger. He does not speak. Yeon does not ask him to.', '둘째는 더 어리다. 그는 말이 없다. 연개소문도 말하라고 하지 않는다.'),
	K('Two.'),
	K('Yeon cuts the pole.'),
	K('Now the tiger.'),
	S('The White Tiger', '백호'),
	P('Then only the tiger is left. He stands where his boys could still see him, if any of them still had eyes. Someone shouts to break east, toward any camp that is not this one.',
		'이제 호랑이만 남았다. 그는 아들들이 아직 눈이 있다면 볼 수 있었을 자리에 서 있다. 누군가 동쪽으로 빠지자고, 여기만 아니면 어느 진영이든 가자고 외친다.'),
	K('Live, and leave the account!'),
	K('I have eaten too much favour under two emperors.'),
	P('He does not run. The arrows make a hedgehog of him. Yeon walks the last three steps through the water and finishes what the shafts began.',
		'그는 달아나지 않는다. 화살이 그를 고슴도치로 만든다. 연개소문이 마지막 세 걸음을 물을 헤치고 걸어가, 화살이 시작한 일을 끝낸다.'),
	K('Titles drown too.'),
	K('Still haven’t come to your senses'),
	S('The Rice Road', '쌀길'),
	K('In the second month a train of carts comes up out of the south'),
	K('The Tang camp outside Pyongyang has been eating its horses.'),
	K('Silla is late.'),
	K('You may eat it slowly.'),
	K('The Red Fowl takes the rice, breaks camp within the week'),
	S('The Far West', '머나먼 서쪽'),
	P('A thousand miles the other way, the courier finds Xue Rengui. You may remember him: the farmer in the white coat who left his ancestors unburied to answer a muster. He has just ended a war in the far west with three arrows. Now he is given the dead man’s title, White Tiger II. And the bill.',
		'반대편으로 천 리 밖에서, 파발이 설인귀를 찾아낸다. 기억하실지 모르겠다. 조상의 무덤을 다 짓지도 못하고 징집에 응했던, 흰 옷의 그 농부. 그는 막 서쪽 끝의 전쟁을 화살 세 대로 끝낸 참이다. 이제 그는 죽은 자의 칭호, 제2대 백호를 받는다. 그리고 그 청구서도.'),
	K('White Tiger… I will take the name.'),
	K('The fangtian ji goes east again.'),
	K('And on an island far to the south')
]);

/* ───────────────────────── #80 Tamla Surrenders ───────────────────────── */
episode(80, 'the one who asks is usually holding a fish', (e, K) => {
	reanchor(e, 'sends its envoys', 'The two boats leave on the same tide');
	const envoyB = NPC('Baekje envoy', '#c9a24a');
	const envoyS = NPC('Silla envoy', '#4a7fb8');
	e.logline = { en: 'Two envoys, one fire, and an island king who won’t pick only one side.', ko: '사신 둘, 불 하나, 그리고 한쪽 편만 고르지 않는 섬의 왕.' };
	return [
		P('“Whose side are we on now?” On Tamla, the one who asks is usually holding a fish.',
			'“이제 우리는 누구 편이야?” 탐라에서 그런 걸 묻는 사람은 대개 손에 생선을 들고 있다.'),
		K('', { caption: 'An island off the bottom of the map, with two kingdoms’ boats in its harbour.', ko: '지도 맨 아래의 섬 하나. 포구에는 두 나라의 배.' }),
		P('This time it is a diver, still wet from the morning, with an octopus in one fist. She asks it in the king’s hall, loudly, because the king’s hall is also where the island dries its nets.',
			'이번에는 해녀다. 아침 물질에 아직 젖은 채로, 한 손에 문어를 쥐고 있다. 그녀는 왕의 집에서 큰 소리로 묻는다. 왕의 집은 섬사람들이 그물을 말리는 곳이기도 하니까.'),
		P('Yuri Dora does not answer at once. He never answers anything at once. He has a fire, two cups, and two envoys who will not sit down.',
			'유리도라는 바로 대답하지 않는다. 그는 무엇에도 바로 대답하는 법이 없다. 그에게는 불 하나, 잔 두 개, 그리고 앉으려 하지 않는 사신 둘이 있다.'),
		P('One came down from the last Baekje hill fort. The other came from Silla, with a Tang officer behind him like a second shadow.',
			'하나는 백제의 마지막 산성에서 내려왔다. 다른 하나는 신라에서 왔는데, 그 뒤에 당나라 무관이 두 번째 그림자처럼 붙어 있다.'),
		S('Two Envoys', '두 사신'),
		D(envoyB, ['Seven hundred years, my lord. Your fathers carried our ranks.', 'Boksin asks for boats. Grain. Any man who can hold an oar.'],
			['칠백 년입니다, 전하. 전하의 선조들께서 백제의 관등을 받으셨습니다.', '복신 장군께서 배를 청하십니다. 곡식도. 노를 잡을 수 있는 자라면 누구든.']),
		D(envoyS, ['The Snake River went badly for the Tang, my lord. It will not go badly twice.', 'My king asks for nothing but your name on a list.'],
			['사수에서 당군이 크게 졌습니다, 전하. 두 번은 지지 않을 겁니다.', '저희 임금께서는 전하의 이름을 명부에 올리는 것 말고는 바라시는 게 없습니다.']),
		D('yuridora', ['Only my name. You hear that? Only a name.', 'Names are the dearest thing on this island. We have so few.'],
			['이름만이라. 들었냐? 이름만이란다.', '이 섬에서 제일 비싼 게 이름이다. 몇 개 없거든.']),
		D('haenyeo', ['Feed them first, my lord. Nobody decides anything hungry.'], ['먼저 멕여요, 왕님. 배고프민 아무것도 못 정해.']),
		P('So they eat. Raw octopus, barley, a bowl of something orange. The Baekje envoy eats like a man who has not seen a full bowl since Sabi. The Silla envoy eats like a man being watched, which he is.',
			'그래서 먹는다. 날문어, 보리, 무언가 주황색인 것 한 그릇. 백제 사신은 사비가 무너진 뒤로 가득 찬 그릇을 처음 본 사람처럼 먹는다. 신라 사신은 감시당하는 사람처럼 먹는다. 실제로 감시당하고 있다.'),
		S('The Turtle', '거북이'),
		P('Then the Baekje envoy plays the only card he brought.', '그러다 백제 사신이 들고 온 단 한 장의 패를 꺼낸다.'),
		D(envoyB, ['My lord. The general they called Hundred-Victories lived here five years.', 'He died at the Yellow Mountain, for Baekje. Fighting these men’s army.', 'Will you bow to the side that killed him?'],
			['전하. 백전백승이라 불린 그 장군이 이 섬에서 다섯 해를 살았습니다.', '그분은 황산에서 백제를 위해 돌아가셨습니다. 바로 이자들의 군대와 싸우다가.', '그분을 죽인 쪽에 머리를 숙이시겠습니까?']),
		P('The hall goes quiet. Even the divers stop chewing. Every one of them remembers the Turtle.',
			'집 안이 조용해진다. 해녀들마저 씹던 것을 멈춘다. 거북이를 기억하지 못하는 사람은 하나도 없다.'),
		P('Yuri Dora turns his cup in his hands for a long time.', '유리도라는 오래도록 손안에서 잔을 돌린다.'),
		D('yuridora', ['The first night, he asked me how many days. Not hello. How many days.', 'Five years. He never once sat down by this fire.'],
			['첫날 밤에 그놈이 나한테 며칠이냐고 묻더라. 인사도 없이. 며칠이냐고.', '다섯 해야. 이 불 앞에 한 번을 안 앉더구나.']),
		D(envoyB, ['Then you owe him—'], ['그렇다면 그분께 빚을—']),
		D('yuridora', ['I told him one thing when he left. Do not forget people.', 'I didn’t say, don’t forget kings. Kings he remembered fine. Look where it got him.'],
			['떠날 때 딱 한마디 해 줬지. 사람을 잊지 말라고.', '왕을 잊지 말라곤 안 했다. 왕은 잘만 기억하더라. 그래서 어떻게 됐는지 봐라.']),
		P('He points his cup at the door. Outside, on the black rock by the eastern shore, a handful of children are drilling in fives, badly, out of step. Nobody taught them. They learned it by standing behind a man who never turned round.',
			'그는 잔으로 문밖을 가리킨다. 동쪽 바닷가의 검은 바위 위에서 아이들 몇이 다섯씩 짝을 지어 서툴게, 발도 안 맞춰 훈련하고 있다. 가르친 사람은 없다. 한 번도 뒤돌아보지 않던 사내 뒤에 서서 배운 것이다.'),
		D('yuridora', ['Those are my people. That’s who I’m not forgetting.'], ['저게 내 사람들이다. 내가 안 잊을 건 저거야.']),
		S('Two Boats', '배 두 척'),
		P('So the king of Tamla makes his choice the way the island does everything: sideways.', '그래서 탐라의 왕은 섬이 늘 하던 식으로 결정을 내린다. 옆걸음으로.'),
		D('yuridora', ['Get two boats ready.', 'One goes to Silla with my name for their list. Make them spell it right.', 'The other takes him back up to his hill fort. Barley, oranges, whatever the divers can spare.'],
			['배 두 척 준비해라.', '한 척은 내 이름 들고 신라로 간다. 명부에 똑바로 적으라고 해.', '한 척은 이 사람 태우고 그 산성으로 돌아가고. 보리든 귤이든, 해녀들이 내줄 수 있는 건 다 실어.']),
		D(envoyS, ['My lord— you cannot bow to both.'], ['전하— 두 쪽에 다 절하실 수는 없습니다.']),
		D('yuridora', ['Watch me. I’m an island. I don’t have a side. I have a harbour.', 'And a story isn’t begun with its ending already fixed.'],
			['봐라. 나는 섬이다. 편 같은 건 없고, 포구가 있지.', '그리고 이야기는 끝을 정해 놓고 시작하는 게 아니다.']),
		D('haenyeo', ['…So whose side are we on?'], ['…그래서 우리 누구 편인데?']),
		D('yuridora', ['Ours. Eat your octopus.'], ['우리 편. 문어나 먹어.']),
		P('The two boats leave on the same tide, one east, one north. From the black rock the children wave at both. Nobody has told them which one to wave at.',
			'배 두 척이 같은 물때에 떠난다. 하나는 동쪽으로, 하나는 북쪽으로. 검은 바위 위의 아이들이 두 척 모두에게 손을 흔든다. 어느 쪽에 흔들어야 하는지 아무도 알려 주지 않았으니까.'),
		P('In the emperor’s city, a clerk writes the visit down. He has never seen the island. It shows.',
			'황제의 도성에서 서기 하나가 그 방문을 받아 적는다. 그는 그 섬을 본 적이 없다. 티가 난다.'),
		K('Early in Longshuo there was a land called Danluo'),
		CARD('Baekje refuses to stay dead. And in Surabol, a great lord feels a fever coming on…!',
			'백제는 죽은 채로 있어 주지 않는다. 그리고 서라벌에서는, 한 대귀족이 갑자기 열이 오른다…!')
	];
});

/* ───────────────────────── #81 Rebellion ───────────────────────── */
episode(81, 'Half of Surabol has watched it play gyuku', (e, K) => {
	const jinheum = NPC('Jinheum', '#7f7a6a');
	return [
		P('Kim Jinju has a fever. Half of Surabol has watched it play gyuku.', '김진주가 앓아누웠다. 서라벌의 절반이 그 병이 격구 치는 걸 구경했다.'),
		S('Naesaji', '내사지성'),
		P('Two summers after Sabi, Baekje is supposed to be finished. Baekje has not been informed. Its leftovers hold a hill fort east of the old capital. They collect grain. They hang collaborators. They send boys to watch the Silla roads.',
			'사비가 무너지고 두 번째 여름. 백제는 끝났어야 한다. 백제는 그 소식을 듣지 못했다. 남은 자들이 옛 도읍 동쪽의 산성 하나를 차지하고 있다. 곡식을 걷는다. 부역자를 목매단다. 아이들을 보내 신라의 길목을 지켜본다.'),
		K(''),
		K('Munmu names nineteen generals for it.'),
		S('Sick Leave', '병가'),
		P('Jinju sends word that he is ill. So does his friend <b>Jinheum</b>. Neither of them is ill. They stay home through the whole campaign, eat well, and receive visitors.',
			'진주는 병이 났다고 기별을 보낸다. 그의 벗 <b>진흠</b>도 그렇게 한다. 둘 다 아프지 않다. 둘은 원정 내내 집에 머물며 잘 먹고, 손님을 맞는다.'),
		K('Nineteen generals for one hill fort.'),
		P('The gyuku field is full that week. Jinju plays well for a sick man. Between rounds, Jinheum leans on the rail beside him.',
			'그 주에 격구장은 사람으로 가득하다. 진주는 환자치고 공을 잘 친다. 판과 판 사이, 진흠이 그의 곁 난간에 기댄다.'),
		D(jinheum, ['The king’s man is in the stands. Third row. He hasn’t watched the ball once.'], ['임금의 사람이 관람석에 있네. 셋째 줄. 공은 한 번도 안 보더군.']),
		D(NPC('Kim Jinju', '#8a7f6a'), ['Let him count. My son stands at the emperor’s door.', 'Munmu won’t touch a house with a boy in Chang’an. He needs the emperor too much.'],
			['세라지. 내 아들이 황제의 문을 지키네.', '문무는 장안에 아들 둔 집안은 못 건드려. 황제가 너무 아쉽거든.']),
		P('It is a good argument. It is the argument every lord in the city would make. Munmu has been king for one year, and nobody knows yet what he is.',
			'좋은 논리다. 서라벌의 어느 귀족이라도 똑같이 말했을 논리다. 문무는 왕이 된 지 한 해, 그가 어떤 왕인지 아직 아무도 모른다.'),
		S('The Moon Palace', '월성'),
		K('Naesaji falls without him.'),
		K('And well enough for gyuku.'),
		K('Majesty, the fever came and went.'),
		K('My father never had a day off from this war.'),
		D(NPC('Kim Jinju', '#8a7f6a'), ['Majesty— my son. He’s in the emperor’s guard.', 'Someone has to write to him—'], ['전하— 제 아들이… 황제의 숙위에 있습니다.', '누군가는 그 아이에게 편지를—']),
		D('munmu', ['I’ll write to him myself.'], ['내가 직접 쓰겠소.']),
		P('Jinju and Jinheum are beheaded, and their households with them, down to the cousins. It is the first time Munmu kills his own nobility. After it, nobody in Surabol mistakes the new king for a soft one.',
			'진주와 진흠은 목이 베이고, 그 집안도 사촌까지 함께 죽는다. 문무가 제 손으로 귀족을 죽인 첫 번째 일이다. 그 뒤로 서라벌에서 새 임금을 무른 사람으로 보는 이는 없다.'),
		P('He writes the letter that night. It is short. He does not ask a secretary to do it.', '그는 그날 밤 편지를 쓴다. 짧은 편지다. 서기에게 맡기지 않는다.'),
		S('Chang’an', '장안'),
		P('<b>Kim Punghun</b> is in Chang’an when the letter comes, in the emperor’s guard, where vassal houses keep their sons. He reads it twice. He hears the rest from a Tang officer who is sorry for him, which is worse. He asks for leave to go home for the mourning and is told, kindly, that he has no home to go to.',
			'편지가 왔을 때 <b>김풍훈</b>은 장안에 있다. 속국의 집안들이 아들을 맡겨 두는 황제의 숙위다. 그는 편지를 두 번 읽는다. 나머지는 그를 딱하게 여기는 당나라 무관에게서 듣는다. 그게 더 아프다. 상을 치르러 돌아가게 해 달라고 청하자, 돌아갈 집이 없지 않느냐는 친절한 대답이 돌아온다.'),
		K('I can wait for a ship.'),
		P('Remember the boy. The emperor’s ships do go east, eventually.', '이 소년을 기억해 두시라. 황제의 배는 결국 동쪽으로 간다.'),
		CARD('Meanwhile at Juryu, the general who crowned Baekje’s king has taken to his bed. He would love a visit…!',
			'한편 주류성에서는, 백제 왕에게 관을 씌워 준 장군이 병석에 눕는다. 문병을 몹시 기다리면서…!')
	];
});

/* ───────────────────────── #82 Betrayal ───────────────────────── */
episode(82, 'It is the healthiest he has looked in years.', (e, K) => {
	reanchor(e, 'Boksin plots to kill the king by pretending to be sick', 'The guards pull the screen down.');
	Object.assign(e, { year: '663', sub: 'June' });
	delete e.flash;
	delete e.flashback;
	delete e.flashTone;
	e.logline = { en: 'The general who crowned Baekje’s king is sick in bed and asking for a visit. The king remembers another supper.', ko: '백제 왕에게 관을 씌운 장군이 병석에서 문병을 청한다. 왕은 또 다른 저녁 자리를 기억한다.' };
	return [
		P('Boksin is sick. It is the healthiest he has looked in years.', '복신이 앓아누웠다. 근래 몇 년 중 가장 혈색이 좋다.'),
		P('For nine days he has not left his bed at Juryu. Every morning he sends the same message up the hill. The king should come. He has something to say that cannot be said in a hall.',
			'아흐레째 그는 주류성의 병상을 떠나지 않는다. 아침마다 같은 전갈을 언덕 위로 올려 보낸다. 전하께서 와 주셔야 한다. 대전에서는 할 수 없는 말이 있다.'),
		K('', { year: 663 }),
		S('The King’s Room', '왕의 방'),
		P('King Pung reads the message nine times. Then he sends for <b>Heukchi Sangji</b>, who took back two hundred fortresses for Boksin in a single season and has never once made a speech about it.',
			'풍왕은 전갈을 아홉 번 읽는다. 그러고는 <b>흑치상지</b>를 부른다. 한 철 만에 복신을 위해 성 이백 개를 되찾고도, 그 일로 연설 한 번 한 적 없는 사내다.'),
		D('pung', ['He is your general, Sangji. Should I go?'], ['그대의 장군이오, 상지. 내가 가야 하겠소?']),
		D('sangji', ['He’s your general, Majesty. Not mine.'], ['전하의 장군이십니다. 제 장군이 아니라.']),
		D('pung', ['…Do you know what happened to the monk?'], ['…그 승려가 어떻게 됐는지 아시오?']),
		D('sangji', ['He went on a retreat, Majesty. That’s what we were told.'], ['수행을 떠나셨다고 들었습니다, 전하.']),
		D('pung', ['That is what I was told too. The morning after a supper.'], ['나도 그렇게 들었소. 어느 저녁 자리의 다음 날 아침에.']),
		P('He was new then. He had been king a few weeks and still did not know everyone’s name. He knew what a supper was, though.',
			'그때 그는 새 임금이었다. 왕이 된 지 몇 주, 아직 모두의 이름도 다 외우지 못했다. 그래도 저녁 자리가 무엇인지는 알았다.'),
		{
			kind: 'flashback',
			year: '661',
			title: 'the monk’s supper',
			blocks: [
				K('Before Boksin and the king, there were Boksin and the monk.'),
				K('All fear death; there is none who does not dread'),
				K('Then a Tang envoy came to the walls with a letter'),
				K('The Buddha gave me this army, Boksin.'),
				K('Supper tonight, then. Just the two of us.'),
				K('Dochim comes to supper. He does not leave it.'),
				K('A retreat. In the middle of a war.'),
				K('So that Your Majesty need never worry about it.')
			]
		},
		P('Pung remembers the answer. He has had two years to think about it.', '풍은 그 대답을 기억한다. 생각할 시간이 두 해나 있었다.'),
		S('The Sickbed', '병석'),
		P('Sangji goes down the hill instead. He finds Boksin propped on cushions, eating well. There is a screen behind the bed. Under the screen, Sangji counts four pairs of boots.',
			'대신 상지가 언덕을 내려간다. 복신은 방석에 기대 앉아 잘 먹고 있다. 침상 뒤에 병풍이 하나 있다. 병풍 아래로, 상지는 신발 네 켤레를 센다.'),
		D('boksin', ['Sangji. Sit. Is His Majesty coming?'], ['상지. 앉게. 전하께서 오시는가?']),
		D('sangji', ['At dusk, General.'], ['해 질 녘에 오십니다, 장군.']),
		D('boksin', ['You know, it’s I who raised this country. Twice.', 'And it’s he who wears the crown.'], ['알다시피, 이 나라를 두 번 일으킨 건 나일세.', '그런데 관은 그가 쓰고 있지.']),
		D('sangji', ['Four pairs of boots under that screen, General.'], ['저 병풍 밑에 신발이 네 켤레입니다, 장군.']),
		D('boksin', ['Guests. A sick man gets lonely.', '…And he’ll want to move the court again. You know he will.'], ['손님일세. 병자는 외로운 법이지.', '…그리고 또 도읍을 옮기자고 할 걸세. 자네도 알잖나.']),
		P('Sangji looks at the boots a while longer. Then he goes back up the hill. He is up there a long time.',
			'상지는 그 신발을 조금 더 바라본다. 그러고는 언덕을 다시 올라간다. 그는 꽤 오래 그 위에 머문다.'),
		S('Dusk', '해 질 녘'),
		P('The king comes at dusk, as promised. He brings the Yamato guard, which was not promised.', '왕은 약속대로 해 질 녘에 온다. 약속에 없던 왜의 호위병들을 데리고.'),
		D('pung', ['General. You look terribly well.'], ['장군. 아주 좋아 보이는구려.']),
		D('boksin', ['Majesty. Forgive me for not rising.'], ['전하. 일어나 맞지 못함을 용서하소서.']),
		D('pung', ['I hear you have risen twice already. That is plenty.'], ['벌써 두 번이나 일으켜 세우셨다고 들었소. 그만하면 충분하오.']),
		P('Boksin looks past the king, at Sangji. Sangji is looking at the screen.', '복신의 눈이 왕을 지나 상지에게 간다. 상지는 병풍을 보고 있다.'),
		P('The guards pull the screen down. The four guests are holding knives, which is an odd thing to bring to a sickroom.',
			'호위병들이 병풍을 걷어 넘긴다. 네 손님은 칼을 쥐고 있다. 병문안에 들고 오기엔 이상한 물건이다.'),
		P('That night Pung has the general who crowned him bound with a leather thong through the palms. He asks the room whether a man like that should be cut down. The room says yes. A courtier named Jipdeuk says it first and loudest. Boksin spits at him.',
			'그날 밤 풍은 자기에게 관을 씌워 준 장군의 손바닥을 가죽끈으로 꿰어 묶게 한다. 그러고는 이런 자를 베어야 하겠느냐고 좌중에 묻는다. 좌중은 그렇다고 한다. 집득이라는 신하가 가장 먼저, 가장 크게 말한다. 복신이 그에게 침을 뱉는다.'),
		K('Rotten dog, idiot slave!'),
		K('Two generals stand at the back while the head is salted.'),
		K('What do you think he does with the ones who didn’t?'),
		K('Same thing. Less salt.'),
		P('Neither of them says what the whole hill is thinking. Boksin was the only general they had who ever won anything.',
			'둘 다 온 산성이 생각하는 것을 입 밖에 내지 않는다. 복신은 그들에게 있던 장군 가운데 무엇이든 이겨 본 유일한 사람이었다.'),
		K('Four banners. One river mouth.')
	];
});

/* ───────────────────────── #83 White River ───────────────────────── */
episode(83, 'Only the tide has been here before.', (e, K) => {
	const first = 'Four banners come to one river mouth. Only the tide has been here before.';
	reanchor(e, 'for the first time the West, Samhan, and the East meet in one mouth of water', 'Only the tide has been here before.');
	reanchor(e, 'Upriver, King Pungjang still believes', 'So the East sends sails.');
	reanchor(e, 'The unification of Samhan is not far off…', 'Men guard boats when they mean to leave in them.');
	reanchor(e, 'Chunchu, you wretch… how dare you, to His Majesty…!', 'you wear their coat on our river');
	return [
		P(first, '네 개의 깃발이 한 강어귀로 모여든다. 이곳에 와 본 것은 밀물뿐이다.'),
		P('The White River empties into the western sea through sandbars that move like rumours. Whoever holds its mouth holds what is left of Baekje.',
			'백강은 소문처럼 자리를 옮기는 모래톱들을 지나 서해로 흘러든다. 그 어귀를 쥔 자가 백제의 남은 것을 쥔다.'),
		K(''),
		S('Four Banners', '네 깃발'),
		P('The Tang come by sea. The Black Tortoise has held the old capital for two winters with too few men. The emperor offered to bring him home. He wrote back that he’d rather not. So the emperor sent more.',
			'당은 바다로 온다. 현무는 너무 적은 군사로 두 겨울 동안 옛 도읍을 지켰다. 황제가 돌아오라고 했다. 그는 사양한다는 답장을 썼다. 그래서 황제는 군사를 더 보냈다.'),
		P('Silla comes by land. King Munmu rides out with Kim Yushin and every general he has. Yushin is sixty-eight and still sits a horse as if the horse had asked him to.',
			'신라는 뭍으로 온다. 문무왕이 김유신과 가진 장수를 모두 이끌고 나선다. 유신은 예순여덟, 그런데도 말이 먼저 태워 달라고 청하기라도 한 듯 말 위에 앉아 있다.'),
		P('Baekje is what is left of it: a hill fort called Juryu, a king raised overseas, and no Boksin.',
			'백제는 남은 것이 전부다. 주류라는 산성 하나, 바다 건너에서 자란 왕 하나, 그리고 복신은 없다.'),
		P('So the East sends sails. Hundreds of them, packed too tight to row. Takutsu is among the captains. He brought Pung home two years ago. Last winter he told him not to move the court down to the plain. He was right, and was thanked for it the way men usually are.',
			'그래서 동쪽에서 돛이 온다. 수백 척, 노를 젓기도 힘들 만큼 빽빽하게. 다쿠쓰도 그 장수들 가운데 있다. 두 해 전 풍을 고국으로 데려온 사람이다. 지난겨울에는 도읍을 평지로 옮기지 말라고 왕에게 말했다. 그가 옳았고, 사람들이 대개 그렇듯 그 대가로 고맙다는 말만 들었다.'),
		S('The King Leaves', '왕이 떠나다'),
		K('the king of Baekje announces that he will leave it'),
		K('Generals, make ready for him.', {
			en: ['Yamato’s relief general is crossing the sea with ten thousand men and more.', 'Generals, make ready for him.', 'I shall go down to the river mouth myself, and receive them there with a feast.'],
			lines: ['야마토의 구원장이 건아 만여를 이끌고 바다를 건너오고 있소.', '장군들은 미리 채비하시오.', '과인은 몸소 강어귀로 내려가, 그들을 잔치로 맞겠소.']
		}),
		K('Majesty. And Juryu?'),
		K('Juryu has walls.'),
		K('…It had a general, too.'),
		S('The Throat of the River', '강의 목'),
		P('At Ungjin the allied generals argue about where to begin. One fortress sits where the road crosses the river, and most of the room wants it first.',
			'웅진에서 연합군 장수들은 어디서부터 시작할지를 두고 다툰다. 성 하나가 뭍길과 물길이 엇갈리는 자리에 앉아 있고, 좌중 대부분은 그곳부터 치자고 한다.'),
		K('Rush it and we bleed men.', {
			en: ['That fort is steep and strong.', 'Rush it and we bleed men. Sit under it and we bleed days.', 'Juryu is the nest. Pull the root, and the branches come down by themselves.'],
			lines: ['저 성은 험하고 굳소.', '서두르면 군사를 잃고, 눌러앉으면 날을 잃소.', '주류가 소굴이오. 뿌리를 뽑으면 가지는 저절로 떨어지오.']
		}),
		K('So the armies split.'),
		K('Tang by sea twice'),
		K('Euija’s eldest. He knelt at Sabi'),
		K('Your brother’s banner will be on that fleet.'),
		K('Born to be crown prince.'),
		K('I looked at my father.'),
		K('The Black Tortoise has already learned'),
		S('The Shore', '물가'),
		K('On the bank the Baekje horsemen guard the landing.'),
		D('yushin', ['Good riders. Guarding boats.', 'Men guard boats when they mean to leave in them.'], ['좋은 기병이군. 배를 지키고 있어.', '배를 지키는 자는 그 배로 떠날 생각인 걸세.']),
		K('I want Silla in the first line.'),
		K('The shore camp goes in one charge.'),
		S('The Twenty-Seventh Day', '스무이렛날'),
		K('The first Yamato ships to arrive do not wait'),
		K('The Black Tortoise has seen men of Wa once before'),
		K('they’re rowing standing up.'),
		K('Watch their oars, not their faces.'),
		K('Nobody chases.'),
		S('The Twenty-Eighth Day', '스무여드렛날'),
		K('That night the Yamato captains and the king of Baekje hold council'),
		K('Whoever hits first, the other side gives way.'),
		K('Let them see the king’s ship at the front.'),
		K('The tide turns before noon.'),
		K('The Baekgang, eighth month, 663'),
		S('The Tide', '물때'),
		P('Takutsu’s ship is in the first line. His rowers pull standing. The Tang hulls come up out of the haze like a wall, and do not move.',
			'다쿠쓰의 배는 맨 앞줄에 있다. 노꾼들이 선 채로 노를 당긴다. 안개 속에서 당의 배들이 벽처럼 솟아오르고, 꿈쩍도 하지 않는다.'),
		P('The first charge hits a wall of hulls and stops dead. Grapnels go over. Crossbows fire down from Tang decks built a man’s height higher. Takutsu’s men climb, fall back, and climb again.',
			'첫 돌격이 선체의 벽에 부딪혀 그대로 멈춘다. 갈고리가 넘어간다. 사람 키 하나만큼 높게 지은 당의 갑판에서 쇠뇌가 내리꽂힌다. 다쿠쓰의 군사들이 기어오르다 떨어지고, 다시 기어오른다.'),
		D('takutsu', ['Back oars. Form again.', '…The water is going slack.'], ['노를 물리시오. 다시 진을 짜시오.', '…물이 멎어 가오.']),
		P('The second charge goes in on slack water and comes out against the ebb, the current turning against them. Now the river is pushing the eastern ships back onto each other. Hulls grind. Oars snap against a neighbour’s oars. Nobody can turn.',
			'두 번째 돌격은 물이 멎을 때 들어가 썰물을 거슬러 나온다. 물살이 그들을 거슬러 돌아선 것이다. 이제 강이 왜의 배들을 서로에게 밀어붙인다. 선체가 맞갈린다. 노가 옆 배의 노에 부딪혀 부러진다. 아무도 뱃머리를 돌리지 못한다.'),
		P('On the Tang flagship, the Black Tortoise has waited all morning for exactly this. He says one word.',
			'당의 기함에서 현무는 아침 내내 바로 이 순간을 기다렸다. 그는 한마디만 한다.'),
		D('liurengui', ['Now.'], ['지금이오.']),
		P('The arrows wrapped for flame go up white and come down burning. Ships pressed together turn one burning deck into a neighbourhood. On the third charge and the fourth, fire travels faster than orders. Four hundred eastern ships do not sink so much as spend themselves into light.',
			'불을 감은 화살이 하얗게 솟았다가 불타며 떨어진다. 서로 맞붙은 배들 사이에서 불붙은 갑판 하나가 금세 한 동네가 된다. 세 번째, 네 번째 돌격에서는 불이 명령보다 빨리 번진다. 왜의 배 사백 척은 가라앉는다기보다 빛으로 타 없어진다.'),
		K('smoke and flame filled the sky'),
		K('Then the wings close.'),
		P('From the king’s ship Pung can see the Tang flagship. On its deck, in a Tang coat, stands his elder brother.',
			'왕의 배에서 풍은 당의 기함을 볼 수 있다. 그 갑판 위에, 당나라 옷을 입고, 그의 형이 서 있다.'),
		D('pung', ['Yung… you wear their coat on our river…!'], ['융… 네가 우리 강에서 저들의 옷을 입고 있구나…!']),
		K('Land of the Heavenly Deer'),
		K('His ship is burning under him'),
		K('Baekje must survive'),
		K('and there fell in battle'),
		K('A river mouth is a judge.'),
		K('At the back of the fleet Abe no Hirafu’s ships are still afloat.'),
		S('Brothers', '형제'),
		K('In the smoke a small boat gets away'),
		K('They bring the sword to the Tang flagship.'),
		K('Whose?'),
		K('Our father gave it to him the year they sent him east.'),
		K('Shall I send boats after him?'),
		K('He was always better at being sent away than I was.'),
		S('Juryu', '주류'),
		P('Juryu holds ten more days without its king. Then it opens its gate. Pung’s younger brothers walk out at the head of what is left: soldiers, women, the Yamato men who missed the boats, and an envoy from <b>Tamla</b> who came up the hill to bargain for an island and is now surrendering for it.',
			'주류는 왕 없이 열흘을 더 버틴다. 그러고는 성문을 연다. 풍의 아우들이 남은 것들의 맨 앞에서 걸어 나온다. 군사들, 여자들, 배를 놓친 야마토 사람들, 그리고 섬 하나를 흥정하러 산을 올랐다가 이제 그 섬을 위해 항복하는 <b>탐라</b>의 사신.'),
		P('The people who are not surrendering go south, to the port where the Yamato ships will take them off. On the road they say the thing to one another that the Yamato chronicle wrote down, because nobody was left in Baekje to write it.',
			'항복하지 않는 사람들은 남쪽으로, 야마토의 배가 그들을 태워 갈 포구로 간다. 길 위에서 그들은 서로에게 그 말을 한다. 야마토의 사서가 받아 적은 말이다. 백제에는 그것을 적을 사람이 남지 않았으니까.'),
		K('The name of Baekje ends today.'),
		S('Imjon', '임존성'),
		P('One fortress doesn’t hear it. Its commander shuts the gate and holds all autumn, and the siege goes home. Then two Baekje generals walk into the Tang camp and ask for their armour back.',
			'한 성만은 그 말을 듣지 않는다. 성주는 문을 닫고 가을 내내 버티고, 포위군은 돌아간다. 그러다 백제 장수 둘이 당의 진영으로 걸어 들어와 제 갑옷을 돌려 달라고 한다.'),
		D('liurengui', ['Heukchi Sangji. Your name is in my register already.', 'It reads better with you alive. Why now?'], ['흑치상지. 그대 이름은 이미 내 명부에 있소.', '살아 있는 편이 기록이 깔끔하오. 왜 지금이오?']),
		D('sangji', ['I watched the king’s hands at Juryu.', 'Then I watched them row north.'], ['주류에서 왕의 손을 봤습니다.', '그다음엔 그 손이 북쪽으로 노 젓는 걸 봤고요.']),
		P('The Black Tortoise hands back their armour and points them up the slope.', '현무는 그들에게 갑옷을 돌려주고 비탈 위를 가리킨다.'),
		K('The north wall is the low one.'),
		P('Imjon falls to its own people’s hands. Its commander leaves his wife and children inside and goes north to Goguryeo, which by now is where Baekje’s last kings go.',
			'임존성은 제 나라 사람 손에 떨어진다. 성주는 아내와 자식들을 성안에 두고 북쪽 고구려로 간다. 이제 백제의 마지막 왕들이 가는 곳이 그곳이다.'),
		K('When the water cools to ordinary colour again'),
		K('Two reapers failed to take Yeon Gesomun at the river.')
	];
});

/* ───────────────────────── #84 Yeon Gesomun† ───────────────────────── */
episode(84, 'Put me in the chair.', (e, K) => [
	K('King Yumla'),
	K('The Eternal General is dying.'),
	K(''),
	P('He is sixty, which in his line of work is an insult to everyone he fought. The room in Pyongyang is small and too warm. His three sons stand at the bed. Gulgul stands by the door with his back to the wall, the way he has sat at every table since he was a boy.',
		'그는 예순이다. 그의 직업에서 그 나이는 그와 싸웠던 모든 이에게 모욕이다. 평양의 방은 좁고 너무 덥다. 세 아들이 침상 곁에 서 있다. 걸걸은 문 옆에 벽을 등지고 서 있다. 어릴 적부터 어느 밥상에서나 그렇게 앉던 사람이다.'),
	K('Do not… fight amongst yourselves…'),
	K('You never kept a brother close.'),
	K('That is precisely why I am telling you.'),
	D('namsan', ['…He means it, brother.'], ['…진심이셔, 형.']),
	D('namseng', ['He always means it. That has never been the trouble.'], ['아버지는 늘 진심이시지. 그게 문제였던 적은 없어.']),
	P('Then he does something nobody in the room expects. He sits up.', '그때 그는 방 안의 누구도 예상하지 못한 일을 한다. 몸을 일으킨다.'),
	D('gesomun', ['Gulgul. The chair. Put me in the chair.', 'I’m not meeting anybody lying down.'], ['걸걸. 의자. 의자에 앉혀.', '누워서 누굴 맞을 생각 없다.']),
	P('Gulgul carries him across the room like a sack of grain he is fond of. The swords go on the wall behind the chair, all five, where a visitor will see them.',
		'걸걸은 아끼는 곡식 자루를 옮기듯 그를 안아 방을 가로지른다. 칼 다섯 자루가 의자 뒤 벽에 걸린다. 찾아오는 자가 볼 수 있는 자리다.'),
	D('gesomun', ['I said it once. Until every bone in me is broken.', 'Count them, Gulgul. How many are left?'], ['내가 한 번 말했지. 뼈가 다 부러질 때까지라고.', '세어 봐라, 걸걸. 몇 개 남았냐?']),
	D('gulgul', ['Enough, sir.'], ['충분합니다.']),
	K('He expects one of them'),
	K('Which of you failed me at the Snake River?'),
	K('himself stands in the room.'),
	K('Consider the courtesy returned.'),
	K('So the clerks failed, and the boss clocked in.'),
	K('The minutes will remember the joke.'),
	P('At the very end Yeon catches a vision of something. A young man, centuries off, standing in a gate and saying Goryeo as if it had never gone.',
		'마지막 순간, 연개소문은 무언가의 환영을 본다. 몇백 년 뒤의 젊은이 하나가 성문에 서서, 한 번도 사라진 적 없다는 듯 고려라고 말하고 있다.'),
	D('gesomun', ['…Goguryeo, you idiot. Say the whole thing.'], ['…고구려다, 이놈아. 끝까지 다 말해.']),
	P('Then he dies in his sleep, sitting up, which is not how anyone expected it to go.', '그러고는 앉은 채로, 잠든 채로 죽는다. 누구도 그렇게 되리라 생각하지 않았던 방식이다.'),
	K('even a man like that stands before Yumla in the end'),
	K('takes on the title of Supreme Commander'),
	K('It was built for one man, and it shows.'),
	S('The Chair', '의자'),
	P('Namseng sits in the chair the next morning. It is too big. Everyone pretends not to notice, which is how you know they have.',
		'이튿날 아침 남생이 그 의자에 앉는다. 너무 크다. 다들 못 본 척한다. 그래서 다들 봤다는 걸 안다.'),
	D('namgun', ['The old man… he really did have a gift, didn’t he.'], ['아버지가… 재주 하나는 정말 끝내주셨지, 그렇지?']),
	D('namsan', ['He had one. We don’t.'], ['아버지한텐 있었지. 우리한텐 없고.']),
	P('He outlasted the Second Emperor’s war. He broke the White Tiger in the Snake River with his own hands. Every victory made the kingdom lean on him a little harder, until the whole weight of it rested on one man’s spine. A spine is a magnificent thing. No one has ever built a house on one.',
		'그는 두 번째 황제의 전쟁을 견뎌 냈다. 사수에서 백호를 제 손으로 꺾었다. 이길 때마다 나라는 그에게 조금 더 기댔고, 마침내 나라의 무게 전부가 한 사람의 등뼈 위에 얹혔다. 등뼈는 훌륭한 것이다. 그러나 등뼈 위에 집을 지은 사람은 아무도 없다.'),
	P('Once, three men looked up at the same star and wanted the same thing. He is the last of them to go.',
		'예전에 세 사람이 같은 별을 올려다보며 같은 것을 원했다. 그가 그 가운데 마지막으로 떠난다.'),
	K('He had three sons. How long do you think that lasts?')
]);

/* ───────────────────────── #85 Brothers’ Coup ───────────────────────── */
episode(85, 'Nine months. That is how long it lasts.', (e, K) => [
	P('Nine months. That is how long it lasts.', '아홉 달. 딱 그만큼 간다.'),
	S('The Provinces', '지방 순시'),
	P('In the spring Namseng rides out to tour the provinces, as a new Supreme Commander should. He leaves his two younger brothers to keep the capital.',
		'봄에 남생은 새 대막리지라면 마땅히 그래야 하듯 지방 순시를 떠난다. 도성은 두 아우에게 맡겨 둔다.'),
	K('Within a month there are men whispering in both directions.'),
	K('They are my brothers.'),
	S('The Pyongyang Gate', '평양성 문'),
	K('The man he sends is caught at the Pyongyang gate within the week.'),
	K('He sends spies. To his own brothers.'),
	P('Namseng’s son is in the capital that spring, with his mother. He is nine years old and wears a little gold ring his grandfather gave him.',
		'그해 봄 남생의 아들은 어머니와 함께 도성에 있다. 아홉 살, 할아버지가 준 작은 금가락지를 끼고 있다.'),
	S('The Shut Gate', '닫힌 문'),
	K('He rides back to his own capital and finds the gate shut.'),
	K('Open the gate, Namgun'),
	D('namgun', ['Supreme Commander! You send spies to your brothers’ supper and call it command!'], ['대막리지라! 아우들 저녁상에 첩자를 보내 놓고 그걸 지휘라고 하냐!']),
	D('namseng', ['I sent a man to ask how you were. You hanged him.'], ['너희 안부를 물으라고 사람 하나 보냈다. 너는 그를 목매달았지.']),
	D('namseng', ['Namgun. Look at me. At the Liao, who took the flogging?'], ['남건아. 나를 봐라. 요하에서, 매는 누가 맞았냐?']),
	D('namgun', ['…You did.'], ['…형이.']),
	D('namseng', ['And why?'], ['왜?']),
	D('namgun', ['Because you’re the elder. You’ve been the elder every single day since.', 'And they told me you were coming back with a seal for my head.'], ['형이 맏이니까. 그날부터 하루도 안 빼고 맏이였지.', '그리고 형이 내 목 칠 인장을 들고 돌아온다고 하더라.']),
	D('namseng', ['Who told you? Traitor.'], ['누가 그러더냐? 역적.']),
	K('Traitor…?', { en: ['Traitor…? Me?'], lines: ['역적…? 내가?'] }),
	D('namseng', ['Open the gate. My wife is in there. My son—'], ['문 열어라. 안에 내 처가 있다. 내 아들이—']),
	P('Namgun does not answer. He looks at Namsan. Namsan looks at the ground.', '남건은 대답하지 않는다. 그는 남산을 본다. 남산은 땅을 본다.'),
	P('Something small comes over the wall and lands in the mud at the horse’s feet. A gold ring, a child’s size.', '무언가 작은 것이 성벽을 넘어와 말발굽 앞 진흙에 떨어진다. 금가락지. 아이 손가락 크기다.'),
	D('namgun', ['He had your letter on him. At the water gate. The guards didn’t— I didn’t—'], ['형 편지를 품고 있었어. 수구문에서. 군사들이— 내가 그런 게—']),
	P('Namseng gets down from his horse and picks the ring out of the mud. He wipes it on his sleeve. He does not look at the wall again.',
		'남생은 말에서 내려 진흙 속의 가락지를 집어 든다. 소매에 닦는다. 다시는 성벽을 쳐다보지 않는다.'),
	P('That night he rides north to the old capital at Gungnae. From there he sends his other son west, to Chang’an, to ask the Third Emperor for an army.',
		'그날 밤 그는 북쪽 옛 도읍 국내성으로 간다. 거기서 다른 아들을 서쪽 장안으로 보내, 황제에게 군대를 청한다.'),
	S('Defection of Yeon Namseng', '연남생의 투항'),
	K('Namseng rides west, across the river'),
	K('North to the old capital, then west over the Liao.'),
	S('Chang’an', '장안'),
	K('Goryeo is nothing but swindlers and thieves'),
	K('My father spoke of a boy he met at the Liao.'),
	K('I did not kneel then.'),
	K('Nobody flogs him for the answer this time.'),
	K('Your Majesty will never conquer Samhan alone.'),
	K('ten thousand years'),
	K('Namseng is given a Tang title'),
	P('The Third Emperor has wanted this war since he was a boy, watching his father come home from it. Now it arrives with a guide.',
		'황제는 아버지가 그 전쟁에서 돌아오는 것을 지켜보던 소년 시절부터 이 전쟁을 원했다. 이제 그 전쟁이 길잡이를 데리고 찾아온다.'),
	K('who raised two of them, waits to hear which nephew will send for him'),
	P('Years later, in the emperor’s country, Namseng’s tombstone will tell the story his way.', '훗날 황제의 땅에서, 남생의 묘지석은 그 이야기를 그의 방식대로 전할 것이다.'),
	K('His little son with the gold ring'),
	K('Namseng knows the road in.')
]);

/* ───────────────────────── #86 Pyongyang II ───────────────────────── */
episode(86, 'Namseng brings the empire with him.', (e, K) => {
	const beasts = 'Three of the emperor’s four beasts come for the city at once.';
	reanchor(e, 'The <b>Blue Dragon</b>, with the <b>Black Dragon</b> and <b>White Tiger II</b>', beasts);
	reanchor(e, 'King Bojang', 'The king kneels.');
	return [
		P('Every son comes home in the end. Namseng brings the empire with him.', '아들은 결국 모두 집으로 돌아온다. 남생은 제국을 데리고 온다.'),
		S('The Ninth Invasion', '제9차 침공'),
		P(`${beasts} The Blue Dragon leads, the old marshal who has been at this war since the last emperor. The Black Tortoise and the second White Tiger ride behind him.`,
			'황제의 네 짐승 가운데 셋이 한꺼번에 이 성으로 온다. 청룡이 앞장선다. 지난 황제 때부터 이 전쟁에 있었던 늙은 원수다. 현무와 두 번째 백호가 그 뒤를 따른다.'),
		K(''),
		K('Breaking a fortress… is like farming.'),
		K('There is no cruelty in him'),
		S('Brothers', '형제'),
		P('Namseng rides beside the Blue Dragon in a Tang coat, to show him the road. He knows every gully. He used to hunt them. At the top of the last one he reins in and looks at the red gate.',
			'남생은 당나라 옷을 입고 청룡 곁에서 말을 몰며 길을 안내한다. 골짜기 하나하나를 다 안다. 예전에 거기서 사냥을 했다. 마지막 골짜기 위에서 그는 고삐를 당기고 붉은 문루를 바라본다.'),
		K('At last… I set foot on Pyongyang’s ground—'),
		P('On the wall, Namgun can see him. Everyone on the wall can see him.', '성벽 위에서 남건은 그를 볼 수 있다. 성벽 위의 모두가 그를 볼 수 있다.'),
		K('Gesomun’s youngest son, and the one who listens at doors.'),
		K('Brother…', { en: ['Brother… he’s wearing their coat.'], lines: ['형… 저 사람, 저쪽 옷을 입었어.'] }),
		K('Goguryeo… never dies….!'),
		P('That is the only conversation the three of them have that year. A whisper, a shout, and a man on a horse who does not answer.',
			'그해 세 형제가 나눈 대화는 그것이 전부다. 속삭임 하나, 고함 하나, 그리고 대답하지 않는 말 위의 사내.'),
		S('The White Banner', '흰 깃발'),
		P('The ring closes. A month goes by. Inside, the granaries go down the way the Tang campfires did, seven winters ago, and someone on the wall is counting.',
			'포위가 조여든다. 한 달이 지난다. 성안의 곳간이, 일곱 겨울 전 당군의 모닥불이 그랬듯 줄어 간다. 그리고 성벽 위의 누군가가 그것을 세고 있다.'),
		P('Namsan counts best. So it is Namsan who walks out first.', '셈은 남산이 제일 잘한다. 그래서 먼저 걸어 나가는 것도 남산이다.'),
		P('He goes out through the gate with the king and ninety-eight officials, carrying a white banner. The king of Goguryeo has worn the crown twenty-six years. For most of them a Yeon told him what to say. Today a Yeon is telling him again.',
			'그는 왕과 관리 아흔여덟 명과 함께 흰 깃발을 들고 성문을 나선다. 고구려의 왕은 스물여섯 해 동안 관을 썼다. 그 대부분의 날 동안 연씨 집안 사람이 그에게 할 말을 일러 주었다. 오늘도 연씨 집안 사람이 일러 준다.'),
		D('bojang', ['Do I— do I kneel to him, or to the banner?'], ['내— 내가 저자에게 꿇는 건가, 아니면 깃발에?']),
		D('namsan', ['To the banner, Majesty. He’s only holding it.'], ['깃발에 꿇으십시오, 전하. 저 사람은 들고 있을 뿐입니다.']),
		P('The king kneels. The Blue Dragon accepts the surrender very politely. Then he looks up at the walls, where the gate has already shut again behind them.',
			'왕이 무릎을 꿇는다. 청룡은 아주 정중하게 항복을 받는다. 그러고는 성벽을 올려다본다. 그들 뒤에서 성문이 이미 다시 닫혀 있다.'),
		S('Betrayal from Inside', '안에서 열린 문'),
		P('Namgun has not surrendered. He has the walls, the army and the gate. What he needs is one man nobody can buy. He picks a monk. Shinsung has kept a small temple at the foot of the hill for twenty-five years. He has never asked anyone for anything.',
			'남건은 항복하지 않았다. 그에게는 성벽과 군대와 성문이 있다. 그에게 필요한 것은 아무도 살 수 없는 사람 하나다. 그는 승려를 고른다. 신성은 언덕 아래 작은 절을 스물다섯 해 지켜 왔다. 누구에게도 무엇 하나 청한 적이 없다.'),
		K('You’re the only man in this city I can’t imagine selling it.'),
		K('Then I shall try to be worthy of your imagination'),
		K('For five days a novice walks out of the lesser house'),
		P('Yeon once tried to starve the temples with the emperor’s Daoists. The monks have waited a generation. Shinsung doesn’t make a speech about doctrine. He opens a gate.',
			'연개소문은 한때 황제의 도사들을 들여 절을 굶기려 했다. 승려들은 한 세대를 기다렸다. 신성은 교리를 연설하지 않는다. 그는 문을 연다.'),
		P('The Tang come in before the bell has stopped ringing. Quietly at first, then not quietly at all. The gate towers catch one after another, like lamps being lit for a feast.',
			'종소리가 채 그치기도 전에 당군이 들어온다. 처음엔 조용히, 그다음엔 전혀 조용하지 않게. 문루들이 잔치에 등불을 켜듯 하나씩 차례로 불붙는다.'),
		S('Last Words', '유언'),
		K('Namgun is thirty-one. He leads'),
		K('Silla’s sacred blood — rot!'),
		P('The wall is already lost. He knows it. He says it anyway, to the men who can still hear, and to a bloodline across the river he can’t see.',
			'성벽은 이미 졌다. 그도 안다. 그래도 말한다. 아직 들을 수 있는 사람들에게, 강 건너 보이지 않는 핏줄에게.'),
		K('Goguryeo… never dies….!'),
		K('When the gate towers burn, Namgun stabs himself'),
		P('In the burning palace, a Mohe man with a border sabre walks into a treasury nobody is guarding any more. He comes out with a piece of gold no longer than a finger, snapped off something that used to be worn on a head. Nobody stops him. Nobody ever looks at Gulgul.',
			'불타는 궁궐에서, 국경의 칼을 찬 말갈 사내 하나가 이제 아무도 지키지 않는 보물 창고로 걸어 들어간다. 그는 손가락보다 짧은 금붙이 하나를 들고 나온다. 한때 누군가의 머리 위에 얹혀 있던 것에서 꺾어 낸 조각이다. 아무도 그를 막지 않는다. 걸걸을 쳐다보는 사람은 늘 아무도 없다.'),
		P('Among the captives is a Baekje king with a Yamato accent. Pung ran north to the last kingdom left. The kingdoms ran out before he did.',
			'포로들 가운데 왜 말씨가 섞인 백제의 왕이 하나 있다. 풍은 남은 마지막 나라로 북쪽으로 달아났다. 그보다 나라들이 먼저 바닥났다.'),
		K('When the city falls, the empire'),
		K('I… did not wish to be your enemy.'),
		P('Goguryeo had stood seven hundred years. The record, for its part, writes only the month and the surrender.', '고구려는 칠백 년을 섰다. 편년은, 제 몫으로는, 달과 항복만을 적는다.'),
		S('Zhaoling', '소릉'),
		K('Before the captives are shown to the living emperor'),
		S('The New Rank', '새 관등'),
		K('cuts a rank the grades did not have'),
		K('Marshal.'),
		K('Majesty.'),
		K('You have been Marshal since before I could hold a bow.'),
		K('The word is enough.'),
		K('I had them cut one above that.', { en: ['There was already a grade above the seventeen.', 'I had them cut one above that.', 'Supreme General.'] }),
		K('A rank above every rank.'),
		K('A new name for an old man.'),
		K('It is the name of the man who opened this city.', {
			en: ['It is the name of the man who fed this war through the snow.', 'Wear it.', 'You may keep Marshal for the boys on the yard.'],
			lines: ['눈 속을 뚫고 이 전쟁을 먹여 살린 사람의 이름이오.', '받으시오.', '연무장 아이들에게는 대장군으로 남아도 좋소.']
		}),
		K('…As you command.'),
		K('The story isn’t over yet.')
	];
});

/* Anchor touch-ups after the rebuild. */
editStory((story) => {
	const e = story.flatMap((c) => c.entries)[81 - 1];
	reanchor(e, 'He hears it from a Tang officer who is sorry for him', 'a Tang officer who is sorry for him');
});

/* Second pass: growth beats and line fixes. Each insert checks its own marker. */
const insertAfter = (e, frag, blocks, marker) => {
	if (allText(e).includes(marker)) return;
	const hit = find(e, frag)[0];
	if (!hit) throw new Error(`#${e.title}: no anchor “${frag}” for insert`);
	hit.list.splice(hit.i + 1, 0, ...blocks);
};
editStory((story) => {
	const ep = (n) => story.flatMap((c) => c.entries)[n - 1];

	const e80 = ep(80);
	insertAfter(e80, 'Names are the dearest thing on this island.', [
		D(NPC('Tang officer', '#b45309'), ['The emperor’s fleet sails past this island on its way to everywhere, my lord.', 'It could stop.'], ['황제의 함대는 어디로 가든 이 섬 앞을 지나갑니다, 전하.', '멈출 수도 있지요.']),
		D('yuridora', ['Then it can stop for oranges. Everyone does.'], ['그럼 귤이나 사러 멈추라지. 다들 그러니까.'])
	], 'It could stop.');
	insertAfter(e80, 'He never once sat down by this fire.', [
		P('He fills the second cup anyway and sets it by the door, where a man used to stand.', '그래도 그는 두 번째 잔을 채워, 한 사내가 늘 서 있던 문 옆에 내려놓는다.')
	], 'where a man used to stand');

	const e81 = ep(81);
	insertAfter(e81, 'he reports who was missing', [
		P('Before he sends for them, Munmu asks his uncle one question.', '그들을 부르기 전에, 문무는 숙부에게 하나를 묻는다.'),
		D('munmu', ['Uncle. If I spare them?'], ['숙부. 내가 저들을 살려 두면 어찌 되겠소?']),
		D('yushin', ['Then next year you name nineteen generals, Majesty, and seventeen come.'], ['그러면 내년에 장수 열아홉을 부르시면, 전하, 열일곱이 올 것입니다.']),
		D('munmu', ['And when Jinju’s son hears of it in Chang’an?'], ['진주의 아들이 장안에서 그 소식을 들으면?']),
		D('yushin', ['He’ll hear either way. Better he hears you meant it.'], ['어느 쪽이든 듣게 될 겁니다. 진심이셨다는 걸 듣는 편이 낫습니다.'])
	], 'and seventeen come');

	const e84 = ep(84);
	reanchor(e84, 'Gesomun… he really did have a gift, didn’t he.', 'he really did have a gift, didn’t he.');
	const room = find(e84, 'He is sixty, which in his line of work')[0];
	if (room) {
		room.b.html = 'He is sixty, which in his line of work is an insult to everyone he fought. The room in Pyongyang is small and too warm. His three sons stand at the bed. Gulgul stands by the door with his back to the wall. In his whole life he has never once sat with his back to a door.';
		room.b.ko = '그는 예순이다. 그의 직업에서 그 나이는 그와 싸웠던 모든 이에게 모욕이다. 평양의 방은 좁고 너무 덥다. 세 아들이 침상 곁에 서 있다. 걸걸은 문 옆에 벽을 등지고 서 있다. 그는 평생 단 한 번도 문을 등지고 앉은 적이 없다.';
	}
	insertAfter(e84, 'Judgment keeps better hours than Supreme Commanders.', [
		D('gesomun', ['One thing first. My sons—'], ['하나만 먼저. 내 아들들—']),
		D('yumla', ['Are not my department.', '…Yet.'], ['내 소관이 아니다.', '…아직은.'])
	], 'Are not my department.');
	insertAfter(e84, 'He had one. We don’t.', [
		P('Gulgul does not sit at all. He rides north that afternoon, to the border the old man gave him. Nobody tells him to.', '걸걸은 아예 앉지 않는다. 그날 오후 그는 노인이 맡겨 준 북쪽 국경으로 말을 달린다. 아무도 그러라고 하지 않았다.')
	], 'He rides north that afternoon');

	const e85 = ep(85);
	const who = find(e85, 'Who told you? Traitor.')[0];
	if (who) Object.assign(who.b, { en: ['And you believed them. Traitor.'], lines: ['그걸 믿었냐. 역적.'] });
	const letter = find(e85, 'He had your letter on him.')[0];
	if (letter) Object.assign(letter.b, { en: ['He was carrying a letter to you. Out through the water gate.', 'The guards didn’t— I didn’t—'], lines: ['형한테 가는 편지를 품고 있었어. 수구문으로 빠져나가다가.', '군사들이— 내가 그런 게—'] });
});

/* Third pass: the campfire payoff in #79 and a trim in #82. */
editStory((story) => {
	const ep = (n) => story.flatMap((c) => c.entries)[n - 1];
	insertAfter(ep(79), 'look at the carts as if they might be another', [
		P('On Pyongyang’s wall that night, Gulgul counts the Tang fires twice. They have stopped going down.', '그날 밤 평양성 위에서 걸걸은 당군의 모닥불을 두 번 센다. 더는 줄지 않는다.'),
		D('gesomun', ['Somebody’s feeding them.', '…Find out who. Then follow him home.'], ['누가 저놈들을 먹이고 있다.', '…누군지 알아내. 그리고 집까지 따라가.'])
	], 'They have stopped going down.');
	const n10 = find(ep(82), 'He was new then.')[0];
	if (n10) Object.assign(n10.b, { html: 'He was new then, and did not know much. He knew what a supper was, though.', ko: '그때 그는 새 임금이었고, 아는 게 많지 않았다. 그래도 저녁 자리가 무엇인지는 알았다.' });
});
