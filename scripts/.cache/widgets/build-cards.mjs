// node scripts/.cache/widgets/build-cards.mjs → scripts/.cache/widgets/cards.json
// Intro + evolution card proposals and the High Summit diagram. Anchors are fragments
// of existing blocks; conversions copy the current block from story.json.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadStory, entryOf, find } from '../story-ops.mjs';

const story = loadStory();
const ops = [];

const chapterOf = (title) => story.find((c) => c.entries.some((e) => e.title === title))?.id;

/** Intro card. */
function intro(title, after, person, caption, ko, extra = {}) {
	ops.push({
		chapter: chapterOf(title),
		title,
		op: 'add',
		after,
		block: { kind: 'card', person, ...extra, caption, ko },
		why: `intro: ${person}`
	});
}

/** Evolution card (from → look). */
function evolve(title, after, person, from, look, write, sub, caption, ko) {
	const block = { kind: 'card', person, from, look, write, sub };
	if (caption) Object.assign(block, { caption, ko });
	ops.push({ chapter: chapterOf(title), title, op: 'add', after, block, why: `evolution: ${person} ${from} → ${look}` });
}

/** Replace an existing block, starting from its current fields. */
function convert(title, match, edit, why) {
	const entry = entryOf(story, chapterOf(title), title);
	const hits = find(entry, match);
	if (hits.length !== 1) throw new Error(`${title}: "${match}" found ${hits.length}×`);
	const block = structuredClone(hits[0].b);
	edit(block);
	ops.push({ chapter: chapterOf(title), title, op: 'convert', match, block, why });
}

// ── Queen Sunduk ──
intro('Queen Sunduk', 'is six. He finds his father and uncle on the hill', 'munmu',
	'Six years old, and already drafting laws for the people with no bones.',
	'여섯 살. 벌써 뼈 없는 사람들을 위한 법을 짜고 있다.', { look: 'child' });
intro('Queen Sunduk', 'Before they dress for the hall he takes the two of them', 'gotaso',
	'Chunchu’s daughter. Whatever it is, she wants it faster.',
	'춘추의 딸. 무엇이든 더 빨리 가길 원한다.');
intro('Queen Sunduk', 'In the hall the sleeves are the census', 'alchun',
	'A True Bone elder who has sat through every kind of meeting. He still sits up straight.',
	'온갖 회의를 다 견뎌 낸 진골 원로. 아직도 허리를 펴고 앉는다.');
intro('Queen Sunduk', 'Silla sends envoys to the other kingdoms', 'kingmu',
	'Baekje’s old king. He has buried a great many Silla plans and keeps the shovel handy.',
	'백제의 늙은 임금. 신라의 계획을 수없이 묻었고, 삽은 늘 손 닿는 데 둔다.');
intro('Queen Sunduk', 'So that old brat Jinpyung is finally dead', 'yeongnyu',
	'Goguryeo’s king. He builds walls, pays for peace, and enjoys other people’s councils.',
	'고구려의 임금. 성을 쌓고, 평화에 값을 치르고, 남의 나라 회의 구경을 즐긴다.');
intro('Queen Sunduk', 'She has the seeds planted anyway', 'jomei',
	'The king across the eastern sea. He collects envoys the way other kings collect swords.',
	'동쪽 바다 건너의 왕. 남들이 칼을 모으듯 사신을 모은다.');

// ── Jinheung, Prince Euija, Eight Great Clans, Gunchogo ──
intro('Jinheung, the Cloud', 'He was seven when they put the crown on him', 'jinheung',
	'The Cloud King. Wherever he rides, the border rides after him.',
	'구름의 왕. 그가 말을 달리면 국경이 뒤따라 달린다.');
intro('Prince Euija', 'It’s the name of a great man', 'gyebek',
	'A boy with no name until a prince lent him one. He means to pay it back.',
	'왕자가 이름을 빌려주기 전까지 이름이 없던 아이. 그는 그 빚을 갚을 작정이다.', { look: 'boy' });
intro('Eight Great Clans', 'If anyone bleeds the wrong colour', 'elderyunbi',
	'Head of the Yunbi. The family business is knowing things first.',
	'연비 가문의 어른. 이 집안의 생업은 남보다 먼저 아는 것이다.');
intro('Gunchogo, the 13th', 'marches north to Pyongyang. A Goguryeo king dies', 'gyeonggeunchogo',
	'The king every later Baekje king quotes when he wants to sound brave.',
	'후대 백제 임금들이 용감해 보이고 싶을 때마다 들먹이는 임금.');

// ── Commander Yeon ──
intro('Commander Yeon', 'He hands the gloves down', 'dosuryu',
	'An old Yeon friend. The one man at the outpost who asks the commander questions.',
	'연의 오랜 벗. 초소에서 장군에게 질문을 하는 단 한 사람.');
intro('Commander Yeon', 'which is not a Goguryeo name and is not a Mohe one either', 'gulgul',
	'A Mohe boy who guarded a burned house. Now he guards whatever Yeon points at.',
	'타 버린 집을 지키던 말갈 아이. 이제는 연이 가리키는 것을 지킨다.', { look: 'young' });
evolve('Commander Yeon', 'Gulgul grows up quiet', 'gulgul', 'young', 'dae', '大乞乞', '대걸걸',
	'A surname at last. Big, as big as the country.', '드디어 성이 생겼다. 크다. 나라만큼.');
intro('Commander Yeon', 'The summons isn\'t addressed to him', 'yeontaejo',
	'The old Eastern Commander. He sat in the big chair long enough to know what it costs.',
	'늙은 동부 대가. 큰 자리에 오래 앉아 봐서, 그 값을 안다.');

// ── High Summit ──
intro('High Summit', 'The Liao watch needs timber and iron', 'gusesa',
	'The High Commander. He chairs the room like a feast and counts it like a granary.',
	'막리지. 잔치처럼 회의를 주재하고, 곳간처럼 셈한다.');
intro('High Summit', 'The portrait does not stay paint', 'samsin',
	'The birth goddess. She does not knock.',
	'아이를 점지하는 여신. 문을 두드리지 않는다.');
convert('High Summit', 'A ka was a tribal chief, back when Goguryeo was five roofs', (b) => {
	delete b.diagram;
	delete b.step;
}, 'High Summit: the term keeps its gloss; the org chart becomes its own diagram block');
ops.push({
	chapter: 'samhan',
	title: 'High Summit',
	op: 'add',
	after: 'A ka was a tribal chief, back when Goguryeo was five roofs',
	block: {
		kind: 'diagram',
		diagram: 'high-summit',
		step: 'council',
		title: '제가회의 · The Commanders’ Council',
		caption: 'Five commands around one table, and the High Commander at its head. The king sits just outside the ring. He has the last word, and they make sure it is the last.',
		ko: '한 상에 둘러앉은 다섯 부, 그 머리에 막리지. 왕은 고리 바로 바깥에 앉는다. 마지막 말은 왕의 것이고, 그들은 그 말이 정말 마지막이 되도록 한다.'
	},
	why: 'High Summit as an org: the council seats with the king outside'
});

intro('Gwanggaeto, the Great King', 'Then Gwanggaeto sends fifty thousand horsemen south', 'gwanggaeto',
	'Goguryeo’s widest king. The stele ran out of room before he ran out of fortresses.',
	'고구려에서 가장 넓은 임금. 성이 바닥나기 전에 비석 자리가 먼저 바닥났다.');

// ── Five Principles ──
intro('Sadaham', 'is thirteen and talks like a dare', 'sadaham',
	'The first class’s brightest boy. He makes promises the way other boys throw stones.',
	'제일기에서 가장 빛나던 소년. 다른 아이들이 돌을 던지듯 약속을 던진다.');
intro('Gotaso', 'takes the ball on the off-side', 'pumsuk',
	'Kim Pumsuk. Rich, handsome, and legal by about an inch.',
	'김품석. 돈 많고, 잘생겼고, 딱 한 뼘 차이로 반칙이 아니다.');
intro('Grand Academy', 'is the careful one — the heir', 'namseng',
	'Yeon’s eldest. He would very much like to be told he did well.',
	'연의 맏아들. 잘했다는 말을, 정말로 듣고 싶다.', { look: 'heir' });
intro('Grand Academy', 'is the fierce one, who never backs down first', 'namgun',
	'The second son. Nobody ever had to teach him to push.',
	'둘째. 밀어붙이는 법은 누구도 가르칠 필요가 없었다.');
evolve('King Euija', 'It was four lacquered paper kites', 'gyebek', 'boy', 'general', '將軍', '계백',
	'The boy with the borrowed name, grown. He still cannot say a thing he does not believe.',
	'이름을 빌린 아이가 자랐다. 아직도 믿지 않는 말은 입에 올리지 못한다.');
intro('King Euija', 'Rice comes up on ground where nothing was planted', 'seongchung',
	'The minister who asks the question the king hoped nobody would.',
	'임금이 아무도 묻지 않기를 바란 질문을 묻는 신하.');
intro('King Euija', 'stands. He is the quiet one, the one with the good handwriting', 'pung',
	'The quiet prince with the good handwriting. He is about to learn what a hostage is for.',
	'글씨 잘 쓰는 조용한 왕자. 볼모가 무엇에 쓰이는지 곧 배운다.', { look: 'prince' });
intro('Yunchung', 'and nobody from the eight houses is told', 'yunchung',
	'A frontier general from a family too small to count. That is the point.',
	'셈에도 안 들 만큼 작은 집안의 변방 장수. 바로 그게 요점이다.');
intro('Yunchung', 'the Assembly\'s loud fight isn\'t about war', 'ministersatek',
	'Satek Jijeok, first minister and first Satek. He holds the shipping writs and the king’s sleeve.',
	'사택지적. 첫째 재상이자 사택의 첫째. 뱃길 문서와 임금의 소매를 함께 쥔다.');
intro('The Severing', 'King Seong feels the cut in the marrow', 'kingsung',
	'Baekje’s king. He has lost a river, and he means to get it back.',
	'백제의 임금. 강 하나를 잃었고, 되찾을 작정이다.');

// ── Iron Will ──
intro('Gumil', 'They are already on the far rock', 'narim',
	'The eldest. Moss, roots, and the rules nobody else keeps.',
	'맏언니. 이끼와 뿌리, 그리고 아무도 안 지키는 규칙.');
intro('Gumil', 'They are already on the far rock', 'golhwa',
	'Fire in the stone. She has been bored for a very long time.',
	'돌 속의 불. 아주 오래 심심했다.');
intro('Gumil', 'They are already on the far rock', 'hyulle',
	'The water sister. She says nothing and misses nothing.',
	'물을 맡은 동생. 아무 말도 안 하고, 아무것도 놓치지 않는다.');
intro('Gumil', 'has been riding since dawn, the bright-blue robe', 'seohyeon',
	'Kim Seohyeon, long before anyone called him Yushin’s father. Mostly, he is thirsty.',
	'아직 누구의 아버지도 아닌 김서현. 지금은 그저 목이 마르다.');
intro('Gumil', 'is the head general of Daeya, despite his young age', 'gumil',
	'A yellow-sleeve officer. He does the work, and the purple sleeve signs it.',
	'누런 소매의 관리. 일은 그가 하고, 서명은 자줏빛 소매가 한다.');
intro('Gumil', 'is the poorest woman in Daeya', 'gumilwife',
	'Maehwa. Plum blossom: the flower that does not wait for spring.',
	'매화. 봄을 기다리지 않는 꽃.');
intro('Siege of Daeya', 'reads her name aloud three times', 'kangrim',
	'The underworld’s fetch. He asks one question at the door, and he waits for the answer.',
	'저승차사. 문 앞에서 질문 하나를 묻고, 대답을 기다린다.');
intro('Yeon’s Massacre', 'In the aftermath, Yeon enthrones the king', 'bojang',
	'The old king’s nephew. He has been given a crown and very little to do with it.',
	'옛 임금의 조카. 왕관은 받았는데, 그걸로 할 일은 별로 받지 못했다.');
convert('Yeon’s Massacre', 'A chair he built himself, above every other chair in the room', (b) => {
	delete b.tab;
	b.from = 'commander';
	b.look = 'supreme';
}, 'evolution: gesomun commander → supreme (was a profile card)');

// ── Seventh Invasion ──
intro('Four Dragons', 'Four dragon banners go up over the muster', 'lishiji',
	'The Blue Dragon. The emperor’s most patient general, which is its own kind of danger.',
	'청룡. 황제의 장수 가운데 가장 참을성이 많다. 그것도 일종의 위험이다.');
intro('Four Dragons', 'a farmer named Xue Rengui', 'xuerengui',
	'A poor farmer with good soil for graves. His wife thinks he could do better.',
	'무덤 쓰기 좋은 땅을 가진 가난한 농부. 아내는 그가 더 큰일을 할 사람이라고 본다.');
intro('Yodong', 'rides on to look at Ansi', 'yangmanchun',
	'The man who holds Ansi. The other side never learns his name, and he never offers it.',
	'안시를 지키는 사람. 저쪽은 끝내 그의 이름을 모르고, 그도 알려 주지 않는다.');
intro('Boiling River', 'picks a fight over a diplomatic spat', 'dongchun',
	'A king who starts a war over a letter. This time, someone writes back.',
	'편지 한 장으로 싸움을 거는 임금. 이번엔 답장이 온다.');
intro('Haemosu', 'god of the sun, has kept this hour', 'haemosu',
	'The sun god. Punctual since before the rivers, until this afternoon.',
	'태양신. 강이 생기기 전부터 시간을 지켰다. 오늘 오후까지는.');
intro('Haemosu', 'three river-daughters are bathing', 'yuhwa',
	'The river’s eldest daughter. Heaven is about to ruin her afternoon, or make it.',
	'강의 맏딸. 하늘이 그녀의 오후를 망치려 한다. 아니면 만들어 주거나.');
intro('Haemosu', 'capital is a palisade', 'geumwa',
	'The gold-frog king. Found under a rock, raised in a palace, kind to strays.',
	'금개구리 임금. 바위 밑에서 발견되어 궁에서 자랐고, 떠돌이에게 너그럽다.');
intro('Buyeo', 'can find a fly’s wing with an arrow', 'jumong',
	'The best archer in Buyeo. The princes have noticed.',
	'부여에서 활을 제일 잘 쏘는 아이. 왕자들도 눈치챘다.', { look: 'exile' });
intro('Buyeo', 'the reaper who collects each day’s dead', 'haewonmek',
	'A fetch of the underworld. Black hat, black silk, and a mouth bound shut so he can’t haggle.',
	'저승의 차사. 검은 갓, 검은 비단, 흥정 못 하게 묶인 입.');
intro('Jolbon', 'walks him across the packed earth', 'yeontabal',
	'The chief of Jolbon. He shows thieves his storeroom on purpose.',
	'졸본의 우두머리. 일부러 도둑에게 곳간을 보여 준다.');
intro('Jolbon', 'a widow, is already on the grain porch', 'sosuno',
	'Tabal’s daughter. She has priced every man in the yard, and she has not finished with this one.',
	'타발의 딸. 마당의 사내 값을 모두 매겼고, 이 사내는 아직 셈이 안 끝났다.', { look: 'widow' });
intro('Jolbon', 'watch the well the way other boys watch a hunt', 'onjo',
	'Sosuno’s younger boy. He watches everything, including his brother.',
	'소서노의 작은아들. 모든 걸 지켜본다. 형까지도.');
evolve('Jolbon', 'they agree. They vote Jumong first king', 'jumong', 'exile', 'king', '東明聖王', '주몽');
evolve('Jolbon', 'is the first queen of a country that still smells like millet', 'sosuno', 'widow', 'queen', '王妃', '소서노');

// ── Chunchu Era ──
intro('Gi (起)', 'receives him politely, which is its own kind of answer', 'kotoku',
	'The King of the East. His politeness comes with a price list.',
	'동쪽의 왕. 그의 정중함에는 값이 매겨져 있다.');
convert('Gi (起)', 'First chair of the Harmony Council. Every vote now passes', (b) => {
	delete b.tab;
	b.from = 'young';
	b.look = 'elder';
}, 'evolution: bidam young → elder (was a profile card)');
intro('Suro', 'Before the sons, there is a look from very high up', 'ibiga',
	'The sky god. Cloud is his body, and he does not usually look down.',
	'하늘신. 구름이 곧 그의 몸이고, 평소엔 아래를 내려다보지 않는다.');
intro('Suro', 'On her mountain the Lady of the Right View is on watch', 'jeonggyeon',
	'The mountain goddess. The ridge was a woman before anyone noticed.',
	'산신. 누가 알아채기 전부터 능선은 여인이었다.');
intro('Suro', 'give birth to two sons', 'suro',
	'King Suro. Born from a golden egg, and in no hurry to marry anyone local.',
	'수로왕. 황금알에서 났고, 동네 처녀와 혼인할 생각은 없다.');
intro('Suro', 'an Indian princess, becomes the first queen of Golden Gaya', 'heohwangok',
	'Heo Hwang-ok. She sailed farther than anyone in Samhan had heard of, and arrived dressed for it.',
	'허왕후. 삼한의 누구도 들어 본 적 없는 먼 곳에서 배를 타고, 그에 걸맞게 차려입고 왔다.');
intro('Muryuk', 'The youngest was Muryuk', 'muryuk',
	'The youngest son in the cart. Gaya handed over its crown. It did not hand over him.',
	'수레에 탄 막내아들. 가야는 왕관을 내주었다. 그까지 내준 건 아니다.');
intro('Huangdi (皇帝)', 'Inmun. That one over the lodging gate', 'inmun',
	'Chunchu’s second son. He reads Tang characters better than his father would like.',
	'춘추의 둘째 아들. 당의 글자를 아버지가 바라는 것보다 잘 읽는다.');
intro('Huangdi (皇帝)', 'steals Chunchu from the memorial-hall', 'gaozong',
	'Li Zhi. Heir to everything, and the first man in Chang’an to laugh.',
	'이치. 모든 것의 후계자, 그리고 장안에서 제일 먼저 웃는 사람.', { look: 'prince' });
intro('Huangdi (皇帝)', 'does not merely listen. She works the room', 'wuzetian',
	'Wu, a lady of the inner palace. The screen is doing very little of the hiding.',
	'후궁의 무씨. 숨기는 일을 병풍이 하는 것 같지는 않다.', { look: 'consort' });
evolve('Jiabeng (駕崩)', 'I receive the late emperor’s last command', 'gaozong', 'prince', 'emperor', '皇帝', '이치');
evolve('King Muyeol', 'Munhee becomes queen', 'munhee', 'young', 'queen', '文明王后', '김문희');
intro('Hyukgose', 'A young boy is born from the egg', 'hyukgose',
	'Hyukgose. Born from an egg, crowned before his voice broke.',
	'혁거세. 알에서 태어나, 목소리가 굵어지기도 전에 왕관을 썼다.');
intro('Hyukgose', 'is born from a Chicken Dragon’s rib', 'alyoung',
	'Lady Alyoung. Born from a dragon’s rib, and the one person in Seorabeol who can tell the king no.',
	'알영부인. 계룡의 갈비뼈에서 났고, 서라벌에서 임금에게 안 된다고 말할 수 있는 단 한 사람.');
intro('Talhae', 'Gaya tells it differently, and with more nerve', 'talhae',
	'Seok Talhae. He arrived in a chest and talks like he owns the beach.',
	'석탈해. 궤짝에 실려 왔는데, 말투는 해변 주인이다.');

// ── Fall of Euija ──
intro('Exile', 'The island where Baekje sends men it can', 'yuridora',
	'Yuri Dora, king of Tamla. He tells stories to men nobody else will talk to.',
	'탐라의 임금 유리도라. 아무도 말을 걸지 않는 사내들에게 이야기를 들려준다.');
intro('Heaven–Earth King', 'ran the living and the dead out of one office', 'heavenearthking',
	'The god with two jobs and one desk. He dreams about breakfast.',
	'일 두 개에 책상 하나인 신. 꿈에서 아침을 먹는다.');
intro('Heaven–Earth King', 'She has twins. The elder comes out quiet', 'daebyeol',
	'Big Star, the elder twin. He would rather be right than first.',
	'대별, 맏이. 먼저인 쪽보다 옳은 쪽을 고른다.', { look: 'young' });
intro('Heaven–Earth King', 'She has twins. The elder comes out quiet', 'sobyeol',
	'Little Star, the younger twin. He would rather be first.',
	'소별, 동생. 먼저인 쪽을 고른다.', { look: 'young' });
evolve('Heaven–Earth King', 'goes down. <b>Little Star</b> keeps the warm side', 'daebyeol', 'young', 'king', '저승', '대별왕');
evolve('Heaven–Earth King', 'goes down. <b>Little Star</b> keeps the warm side', 'sobyeol', 'young', 'king', '이승', '소별왕');
intro('Sulmun', 'Before the island there is a woman, and she is enormous', 'sulmun',
	'Grandmother Sulmun. The sea comes to her knee, and she has opinions about the view.',
	'설문대할망. 바다가 무릎까지밖에 안 오고, 경치에 대해 할 말이 많다.');
intro('Three Princes', 'three divine princes named Yang, Go and Bu', 'go_tamla',
	'Prince Go. Climbed out of the earth already arguing about who climbed first.',
	'고을나. 땅에서 나오자마자 누가 먼저 나왔는지 따지기 시작했다.');
intro('Three Princes', 'three divine princes named Yang, Go and Bu', 'yang_tamla',
	'Prince Yang. He hunts, he shoots, and he would like a wife, please.',
	'양을나. 사냥하고, 활 쏘고, 아내가 있었으면 좋겠다.');
intro('Three Princes', 'three divine princes named Yang, Go and Bu', 'bu_tamla',
	'Prince Bu. The quiet one, who looks out to sea first.',
	'부을나. 조용한 쪽. 바다를 제일 먼저 내다본다.');
intro('Gardener', 'Jacheongbi wanted to study beside a boy from the sky', 'jacheongbi',
	'Jacheongbi. Disguise, scholarship, and not one ounce of patience.',
	'자청비. 변장, 학문, 그리고 인내심은 한 톨도 없음.');
intro('Gardener', 'Her son was born in that house and grew up a servant', 'sara',
	'Hallakgungi. Born a servant, and he means to find his father.',
	'할락궁이. 종으로 태어났고, 아버지를 찾아갈 작정이다.');
intro('Kangrim', 'The living court requests you', 'yumla',
	'The judge of the dead. Every ledger in the dark ends on his desk.',
	'죽은 자의 재판관. 어둠 속 모든 장부는 그의 책상에서 끝난다.');
intro('Onjo', 'is a boy with a sling and bad aim', 'yuri',
	'Yuri. Bad aim or bad luck, and a mother who will not answer one question.',
	'유리. 조준이 나쁘거나 운이 나쁘거나. 그리고 질문 하나에 대답하지 않는 어머니.');

// ── Fall of Baekje ──
intro('Yellow Mountain', 'Three years before he sees Samhan, Su Dingfang', 'sudingfang',
	'The Red Fowl. Sixty-five, and he still prefers to march at night.',
	'주작. 예순다섯, 아직도 밤에 진군하는 걸 좋아한다.');
intro('Yellow Mountain', 'does not call his son', 'gwanchang',
	'Gwanchang. A hwarang so young they had to pad the helmet.',
	'관창. 투구 안에 솜을 덧대야 할 만큼 어린 화랑.');
intro('Ungjin Commandery', 'takes over the Tang garrison', 'liurengui',
	'The Black Tortoise. Sixty, disgraced last year, and in an excellent mood.',
	'현무. 예순, 작년에 파직당했고, 기분이 아주 좋다.');
evolve('Ungjin Commandery', 'Father went east three times', 'wuzetian', 'consort', 'empress', '皇后', '무후');
intro('King Pungjang', 'sends to Yamato the East with a hundred Tang prisoners', 'boksin',
	'Gwishil Boksin. He raised a dead country once, and he kept the receipts.',
	'귀실복신. 쓰러진 나라를 한 번 일으켰고, 영수증은 다 챙겨 두었다.');
intro('King Pungjang', 'The court across the cold sea, where favours are counted in ships', 'tenji',
	'The Eastern Prince. He does the arithmetic before anyone asks for it.',
	'동쪽의 왕자. 누가 묻기 전에 셈부터 한다.');
intro('King Pungjang', 'The empress has let all of it run', 'saimei',
	'The Eastern Empress. She has outlived two reigns and most of her ministers’ opinions.',
	'동쪽의 여제. 두 번의 치세와 대신들 의견 대부분보다 오래 살았다.');
intro('King Pungjang', 'introduces himself sitting down', 'dochim',
	'Dochim. A monk with a general’s staff, in no hurry about either.',
	'도침. 장수의 지팡이를 든 승려. 둘 다 서두르지 않는다.');
intro('King Pungjang', 'is seven feet tall. The autumn Sabi fell', 'sangji',
	'Heukchi Sangji. The biggest man on the beach, and the hardest to line up.',
	'흑치상지. 해변에서 제일 큰 사내, 그리고 줄 세우기 제일 어려운 사내.');
evolve('King Pungjang', 'I am Buyeo Pung, son of King Euija', 'pung', 'prince', 'king', '豐章王', '부여풍');

// ── Final Stand ──
evolve('Yeon Gesomun†', 'takes on the title of Supreme Commander', 'namseng', 'heir', 'supreme', '大莫離支', '연남생',
	'His father’s chair. It was built for one man, and it shows.', '아버지의 자리. 한 사람을 위해 짠 자리라, 티가 난다.');
evolve('Pyongyang II', 'There was already a grade above the seventeen', 'yushin', 'marshal', 'elder', '太大角干', '김유신',
	'A rank above every rank. They had to invent it for him.', '모든 품계 위의 품계. 그를 위해 새로 만들어야 했다.');

// ── Silla–Tang War, Balhae ──
intro('Dangun & Old Joseon', 'Before there are any kingdoms, there is a son in heaven', 'hwanin',
	'The Lord of Heaven. He has been watching this peninsula since before it had names.',
	'하늘의 주인. 이 반도에 이름이 생기기 전부터 내려다보고 있었다.');
intro('Dangun & Old Joseon', 'lands on a mountain under the sacred birch', 'hwanung',
	'Hwanung. A son of heaven who kept looking down until his father let him go.',
	'환웅. 자꾸 아래를 내려다보다가, 끝내 아버지가 보내 준 하늘의 아들.');
intro('Dangun & Old Joseon', 'She comes out a woman on the twenty-first morning', 'ungnyeo',
	'Ungnyeo. Twenty-one days in a cave, and the tiger left first. A husband should be easy.',
	'웅녀. 동굴에서 스무하루, 먼저 나간 건 호랑이였다. 지아비 하나쯤이야.');
intro('Dangun & Old Joseon', 'Their son is Dangun. The name on the stone', 'dangun',
	'Dangun. Half heaven, half bear, and all the paperwork of a first king.',
	'단군. 반은 하늘, 반은 곰, 그리고 첫 임금의 서류는 전부 그의 몫.');
intro('Balhae', 'under dried millet and a spare pair of boots', 'daejoyoung',
	'Dae Joyoung. A boy with frozen feet, and a piece of a crown in the pack.',
	'대조영. 발이 언 아이. 봇짐 속에는 왕관 한 조각이 있다.');

const notes = {
	scheme:
		'Evolution cards use people.ts stage ids. A coronation stage renames (name/korean/hanja + its own portrait); a promotion stage keeps the name, puts the rank in title/titleKo and omits avatar so the portrait carries over (gesomun commander→supreme, namseng heir→supreme, yushin marshal→elder, bidam young→elder, gyebek boy→general, wuzetian consort→empress). Pin-only stages are lookOnly (jumong exile/king, sosuno widow/queen, daebyeol/sobyeol young/king).',
	renderer:
		'PersonCard animates an evolution only when the two portraits differ (fromSrc !== src). Promotions that share a portrait (gesomun, namseng, wuzetian, daebyeol, sobyeol, gulgul) need the redesign to animate the title/titleKo change instead. titleKo is new on PersonStage and not read by any component yet.',
	highSummit:
		'Roster for the High Summit council diagram (634): king yeongnyu sits outside the ring; High Commander (막리지) gusesa chairs; East gesomun (sitting in his father yeontaejo’s seat); West westcmd; South southcmd; North northcmd. The story’s seat table also lists Yeon Gusesa as Central Command, so there is no separate Central commander person yet. Block #3’s Korean calls the High Commander 대대로, while people.ts uses 막리지 for High Commander and 대대로 for Chancellor (dosuryu, after the massacre).',
	skipped:
		'No intro for taizong in Queen Sunduk (his name is a Huangdi reveal; he already has cards). No intro naming the Gaya prince in The Severing (Muryuk reveal). No evolution for namgun (no on-page promotion beat), onjo (no second portrait), or the cavern goddesses’ shapeshift forms (no portraits).'
};

const out = path.join(ROOT, 'scripts/.cache/widgets/cards.json');
fs.writeFileSync(out, JSON.stringify({ ops, notes }, null, '\t') + '\n');
const n = (pred) => ops.filter(pred).length;
console.log(`wrote ${ops.length} ops: ${n((o) => o.why.startsWith('intro'))} intro, ${n((o) => o.why.startsWith('evolution'))} evolution, ${n((o) => o.block.kind === 'diagram')} diagram, ${n((o) => o.op === 'convert')} convert`);
