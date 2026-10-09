// One-off: turn single record quotes into testimony runs — several records on one fact,
// marked as agreeing or contradicting each other. Idempotent (skips runs already added).
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(FILE, 'utf8'));

/** Every block array in the story, with each entry's title, so anchors can be found anywhere. */
function* arrays(node, title) {
	if (Array.isArray(node)) {
		if (node.some((b) => b && typeof b === 'object' && 'kind' in b)) yield [node, title];
		for (const x of node) yield* arrays(x, title);
	} else if (node && typeof node === 'object') {
		const t = typeof node.title === 'string' && 'year' in node ? node.title : title;
		for (const v of Object.values(node)) if (v && typeof v === 'object') yield* arrays(v, t);
	}
}

function find(test, entry) {
	for (const [arr, title] of arrays(story, '')) {
		if (entry && title !== entry) continue;
		const i = arr.findIndex((b) => b && test(b));
		if (i >= 0) return [arr, i];
	}
	throw new Error(`anchor not found${entry ? ` in ${entry}` : ''}`);
}

const has = (hanja) => JSON.stringify(story).includes(hanja);

/** Tag the anchor quote as the run's first record and put `after` straight behind it. */
function extend({ anchor, entry, event, stance, claim, claimKo, after }) {
	if (after.every((q) => has(q.hanja))) return console.log(`skip ${event}`);
	const [arr, i] = find(anchor, entry);
	Object.assign(arr[i], { event, stance, claim, claimKo });
	arr.splice(i + 1, 0, ...after.map((q) => ({ kind: 'quote', ...q, event })));
	console.log(`${event}: ${after.length + 1} records`);
}

/** Put a whole new run after the block that `anchor` finds. */
function insert({ anchor, entry, event, stance, claim, claimKo, quotes }) {
	if (quotes.every((q) => has(q.hanja))) return console.log(`skip ${event}`);
	const [arr, i] = find(anchor, entry);
	const run = quotes.map((q) => ({ kind: 'quote', ...q, event }));
	Object.assign(run[0], { stance, claim, claimKo });
	arr.splice(i + 1, 0, ...run);
	console.log(`${event}: ${run.length} records`);
}

/* ——— Chunchu's looks: Korea, the Tang emperor's eye (in the Korean annal), Japan ——— */
insert({
	entry: 'King Muyeol',
	anchor: (b) => b.kind === 'card' && b.person === 'chunchu',
	event: 'chunchu-handsome',
	stance: 'agree',
	claim: 'Kim Chunchu was handsome.',
	claimKo: '김춘추는 잘생겼다.',
	quotes: [
		{
			html: 'The king was splendid in looks and bearing, and from boyhood he meant to set the world right.',
			ko: '왕은 풍채가 영특하고 훌륭하였으며, 어려서부터 세상을 구제할 뜻을 품었다.',
			hanja: '王儀表英偉，幼有濟世志。',
			source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — King Taejong Muyeol, yr. 1 (654)',
			person: 'chunchu'
		},
		{
			html: 'Emperor Taizong sent Liu Heng, Chamberlain for the Palace Larder, out past the walls to welcome him. When Chunchu arrived, the emperor saw how splendid his looks and bearing were, and treated him generously.',
			ko: '당 태종이 광록경 유형을 교외로 보내 그를 맞아 위로하게 하였다. 도착하자, 태종은 춘추의 풍채가 영특하고 훌륭한 것을 보고 후하게 대접하였다.',
			hanja: '唐太宗遣光祿卿柳亨郊勞之。旣至，見春秋儀表英偉，厚待之。',
			source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Jindeok, yr. 2 (648)',
			person: 'taizong'
		},
		{
			html: 'Chunchu was handsome, and good at talk and laughter.',
			ko: '춘추는 용모가 아름답고 담소를 잘하였다.',
			hanja: '春秋美姿顏，善談咲。',
			source: 'Nihon Shoki (日本書紀) bk. 25, Emperor Kōtoku — Taika 3 (647)'
		}
	]
});

/* ——— Gaya, 562: Silla says Gaya rebelled; Yamato says Silla betrayed ——— */
extend({
	anchor: (b) => b.kind === 'quote' && b.event === 'gaya-562',
	event: 'gaya-562',
	stance: 'differ',
	claim: 'Who betrayed whom at Gaya?',
	claimKo: '가야에서 배신한 쪽은 누구인가?',
	after: [
		{
			html: 'Silla is a petty villain of the western barbarians. It defies Heaven and knows no decency. It has betrayed our kindness and destroyed our <i>miyake</i>. It poisons our people and butchers our districts.',
			ko: '신라는 서쪽 오랑캐의 보잘것없는 무리로, 하늘을 거스르고 무도하다. 우리의 은혜를 저버리고 우리의 관가를 깨뜨렸으며, 우리 백성을 해치고 우리 군현을 짓밟았다.',
			hanja: '新羅西羌小醜，逆天無狀，違我恩義，破我官家，毒害我黎民，誅殘我郡縣。',
			source: 'Nihon Shoki (日本書紀) bk. 19, Emperor Kinmei — yr. 23 (562), 6th month'
		}
	]
});

/* ——— Gesomun's five swords: the Korean biography and the Tang history ——— */
extend({
	anchor: (b) => b.kind === 'quote' && b.event === 'five-blades',
	event: 'five-blades',
	stance: 'agree',
	claim: 'He wore five swords, and stood on men to mount.',
	claimKo: '그는 칼 다섯 자루를 찼고, 사람을 밟고 말에 올랐다.',
	after: [
		{
			html: 'He was imposing and handsome, with a fine beard, and his cap and robes were all trimmed in gold. He wore five swords, and no one around him dared look up. He made nobles lie on the ground and stepped on them to mount his horse.',
			ko: '생김새가 우람하고 빼어났으며 수염이 아름다웠고, 관과 옷을 모두 금으로 꾸몄다. 칼 다섯 자루를 차니 좌우가 감히 우러러보지 못하였다. 귀인을 땅에 엎드리게 하고 그를 밟고 말에 올랐다.',
			hanja: '貌魁秀，美須髯，冠服皆飾以金，佩五刀，左右莫敢仰視。使貴人伏諸地，踐以升馬。',
			source: 'Xin Tangshu (新唐書) bk. 220, Eastern Barbarians — Goguryeo',
			person: 'gesomun'
		}
	]
});

/* ——— The coup of 642: the Tang report and the Goguryeo envoys at the Yamato court ——— */
extend({
	entry: 'Emperor',
	anchor: (b) => b.kind === 'quote' && (b.hanja ?? '').includes('弒其王武'),
	event: 'gesomun-coup-642',
	stance: 'agree',
	claim: 'He murdered his king.',
	claimKo: '그는 자기 왕을 죽였다.',
	after: [
		{
			html: 'In autumn, the ninth month, the great minister Iri Kasumi murdered the great king, and killed Iri Kosesi and others with him, more than a hundred and eighty men.',
			ko: '가을 9월, 대신 이리가수미가 대왕을 시해하고, 이리거세사 등 180여 명을 함께 죽였다.',
			hanja: '秋九月，大臣伊梨柯須彌弑大王，并殺伊梨渠世斯等百八十餘人。',
			source: 'Nihon Shoki (日本書紀) bk. 24, Empress Kōgyoku — yr. 1 (642), 2nd month, the Goguryeo envoys’ report'
		}
	]
});

/* ——— The war of 645: Silla, the Tang emperor and Gesomun each name the aggressor ——— */
insert({
	entry: 'Yodong',
	anchor: (b) => b.kind === 'p' && b.html.startsWith('Every wall assumes the enemy will knock'),
	event: 'who-started-645',
	stance: 'differ',
	claim: 'Who started this war?',
	claimKo: '누가 이 전쟁을 시작했는가?',
	quotes: [
		{
			html: 'Envoys went to the Great Tang and said: “Goguryeo and Baekje trample on your servant’s country. We are attacked again and again, and have lost dozens of forts. The two countries have joined their armies and swear to take us, and they will march in force this ninth month. Our altars will not survive. We send this envoy to submit to the great country, and beg for a detachment to save us.”',
			ko: '사신을 대당에 보내 아뢰었다. “고구려와 백제가 신의 나라를 침범하여 여러 차례 공격을 받아 수십 성을 잃었습니다. 두 나라가 군사를 합쳐 기어이 빼앗으려 하며, 이번 9월에 크게 일어나려 합니다. 저희 나라의 사직은 반드시 온전하지 못할 것이니, 삼가 배신을 보내 대국에 목숨을 맡기오며, 군사 얼마를 빌려 구원해 주시기를 청합니다.”',
			hanja: '遣使大唐上言：「高句麗、百濟侵凌臣國，累遭攻襲數十城。兩國連兵，期之必取，將以今玆九月大擧。下國社稷必不獲全，謹遣陪臣歸命大國，願乞偏師，以存救援。」',
			source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Seondeok, yr. 12 (643), 9th month'
		},
		{
			html: 'The emperor said: “Gai Suwen murdered his lord, butchered his ministers and tortures his people. Now he defies Our edict and preys on his neighbours. He cannot go unpunished.”',
			ko: '황제가 말하였다. “개소문은 그 임금을 시해하고 대신들을 해쳤으며 백성을 잔혹하게 학대하였다. 이제 또 짐의 조명을 어기고 이웃 나라를 침략하니, 치지 않을 수 없다.”',
			hanja: '上曰：「蓋蘇文弒其君，賊其大臣，殘虐其民，今又違我詔命，侵暴鄰國，不可以不討。」',
			source: 'Zizhi Tongjian (資治通鑑) bk. 197, Tang Taizong, Zhenguan 18 (644)',
			person: 'taizong'
		},
		{
			html: 'Gai Suwen said to the envoy Xuanjiang: “Silla and I have hated each other a long time. When the Sui invaded us, Silla took its chance and seized five hundred li of our land, every walled town on it. Unless they give back what they took, I doubt the fighting can stop.”',
			ko: '개소문이 현장에게 말하였다. “우리와 신라는 원한이 쌓인 지 오래다. 지난날 수나라가 쳐들어왔을 때 신라가 그 틈을 타 우리 땅 오백 리를 빼앗아 성읍을 모두 차지하였다. 빼앗은 땅을 돌려주지 않는 한, 싸움은 그치지 않을 것이다.”',
			hanja: '蓋蘇文謂玄獎曰：「我與新羅怨隙已久。往者隋人入寇，新羅乘釁奪我地五百里，城邑皆據有之。自非歸我侵地，兵恐未能已。」',
			source: 'Zizhi Tongjian (資治通鑑) bk. 197, Tang Taizong, Zhenguan 18 (644)',
			person: 'gesomun'
		}
	]
});

writeFileSync(FILE, `${JSON.stringify(story, null, '\t')}\n`);
