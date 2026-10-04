// Tang as a slogan state: banners, taboo, the uncounted day, people as numbers. Idempotent.
// Usage: node scripts/.cache/insert-tang-parody.mjs
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const TANG = '#b45309';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (who, en, lines, extra = {}) => ({
	kind: 'dialogue',
	...(who.startsWith('@') ? { speaker: who.slice(1), chip: TANG } : { person: who }),
	en,
	lines,
	...extra
});
const zh = (zhLines, latn) => ({ zh: zhLines, zhLatn: latn });

/** Each insert: entry title, the block to insert after, a marker that proves it already ran, the new blocks. */
const INSERTS = [
	{
		entry: 'Emperor of the West',
		after: (b) => b.person === 'taizong' && b.en?.some((l) => l.includes('The Prince of Qin!')),
		marker: 'THE GREAT TANG DREAM',
		blocks: [
			p(
				'By the next spring the dream has left the sickroom. Over every ward gate in Chang’an the sign-painters letter it in gold on red, THE GREAT TANG DREAM, each banner at the same height and the same distance from the next. Nobody can say who ordered it, which is how the best orders travel.',
				'이듬해 봄, 그 꿈은 병상을 떠나 있다. 장안의 방문(坊門)마다 간판장이들이 붉은 바탕에 금색으로 〈대당몽(大唐夢)〉이라 써 붙인다. 모두 같은 높이, 모두 같은 간격. 누가 시켰는지는 아무도 모른다. 가장 좋은 명령은 원래 그렇게 퍼진다.'
			)
		]
	},
	{
		entry: 'Longmen Field',
		after: (b) => b.kind === 'p' && b.html?.startsWith('The Son of Heaven is calling up troops'),
		marker: 'The edict comes on red paper',
		blocks: [
			p(
				'The edict comes on red paper, pasted to the well-house wall at the height of a man’s eyes: SERVE THE EMPEROR. Under it, in smaller characters, the quota. It does not ask for Xue Li. It asks for one man from every household with the right number of hands, and any man with hands will do.',
				'칙령은 붉은 종이로 온다. 우물가 담벼락, 사람 눈높이에 붙는다. 〈천자를 위해 봉사하라〉. 그 아래 작은 글씨로 할당량. 칙령은 설례를 부르지 않는다. 손이 제대로 달린 사내를 집마다 하나씩 부를 뿐이고, 손만 있으면 누구라도 된다.'
			)
		]
	},
	{
		entry: 'The Emperor',
		after: (b) => b.kind === 'diagram' && b.diagram === 'tang-departments',
		marker: 'CO-PROSPERITY SPHERE',
		blocks: [
			p(
				'The embassy comes in by the Mingde Gate at the hour the street drums stop, and Zhuque Avenue opens ahead of it, a hundred and fifty paces wide and perfectly empty. Red banners hang from every ward wall the whole length of it, each at the same height, each the same distance from the next, gold characters on red: WITHOUT THE GREAT TANG THERE WOULD BE NO NEW CHINA. SERVE THE EMPEROR. THE GREAT TANG DREAM. EIGHT DIRECTIONS UNDER ONE ROOF. Over the gate of the envoys’ lodging, so that no guest can miss it on the way to bed: THE GREATER CHINA CO-PROSPERITY SPHERE.',
				'사절단은 거리의 북소리가 그치는 시각에 명덕문으로 들어서고, 눈앞에 주작대로가 열린다. 폭이 백오십 보, 그리고 텅 비어 있다. 길 끝까지 방마다 담장에 붉은 현수막이 걸려 있다. 모두 같은 높이, 모두 같은 간격, 붉은 바탕에 금색 글자. 〈대당이 없으면 새 중화도 없다〉. 〈천자를 위해 봉사하라〉. 〈대당몽〉. 〈팔굉일우(八紘一宇)〉. 그리고 객관 대문 위에는, 어떤 손님도 자러 가는 길에 놓치지 않도록, 〈대중화공영권(大中華共榮圈)〉.'
			),
			p(
				'The second banner was lettered, the older clerks say, SERVE THE PEOPLE. But the second character of <i>the people</i>, 民, is also the second character of the emperor’s name, and nobody in Chang’an writes that. The sign-painters found a word of the right width.',
				'나이 든 서기들 말로는, 두 번째 현수막은 원래 〈인민을 위해 봉사하라(爲人民服務)〉였다. 그런데 인민의 민(民) 자는 황제 이름의 두 번째 글자이기도 하고, 장안에서는 아무도 그 글자를 쓰지 않는다. 간판장이들은 폭이 맞는 다른 말을 찾아냈다.'
			),
			say('chunchu', ['Inmun. That one over the lodging gate. Read it for me.'], ['인문아. 저 객관 문 위에 건 거. 읽어 봐라.'], { chip: '#D8258C' }),
			say('inmun', ['…“The Greater China Co-Prosperity Sphere,” Father.'], ['…대중화공영권, 이라고 쓰여 있습니다, 아버님.'], { chip: '#6fb0d8' }),
			say(
				'chunchu',
				['Co-prosperity. Prospering together. A lovely word.', '…Odd place to hang it, though. Over the one door where the foreigners sleep.'],
				['공영이라. 함께 번영한다. 좋은 말이지.', '…그런데 걸어 둔 자리가 묘하구나. 하필 외국 손님 자는 문 위에.'],
				{ chip: '#D8258C' }
			),
			say('inmun', ['I think it’s there for us to read.'], ['저희 보라고 건 것 같습니다.'], { chip: '#6fb0d8' }),
			say(
				'chunchu',
				['Then remember it.', 'When the big house offers to share the harvest, the small house counts its own granary before supper.'],
				['그럼 기억해 둬라.', '큰집이 수확을 나누자고 하면, 작은집은 저녁 먹기 전에 제 곳간부터 세어 보는 거다.'],
				{ chip: '#D8258C' }
			),
			p(
				'Chang’an is a hundred and eight walled wards, locked at the drums. Inside each, five households make a <i>bao</i>, and every one of them answers for the other four. At the lodging a ward chief is waiting with a lamp and a register. He does not look at the prince’s face. He counts heads the way a man counts sacks, and writes a number.',
				'장안은 담장을 두른 방(坊) 백여덟 개로 되어 있고, 북이 울리면 모두 잠긴다. 방 안에서는 다섯 집이 한 보(保)를 이루고, 다섯 집 모두가 나머지 넷을 책임진다. 객관 앞에서 방정(坊正)이 등불과 장부를 들고 기다린다. 그는 왕자의 얼굴을 보지 않는다. 자루를 세듯 머릿수를 세고, 숫자 하나를 적는다.'
			),
			say(
				'@Ward chief',
				['Silla embassy. Eleven mouths.', 'Eleven in, eleven out. If one of you dies, report it to the ward before the morning drum.', 'We’ll send a man to make up the count.'],
				['신라 사절. 입 열하나.', '열하나 들어왔으면 열하나 나가는 거요. 누가 죽으면 새벽 북 전에 방에 신고하시오.', '모자라는 머릿수는 우리가 사람 하나 보내서 맞춰 드리지.'],
				zh(['新羅使團。十一口。', '十一口進，十一口出。若有人死，晨鼓前報坊。', '缺的數，坊裡派人補上。'], ['Xīnluó shǐtuán. Shíyī kǒu.', 'Shíyī kǒu jìn, shíyī kǒu chū. Ruò yǒu rén sǐ, chén gǔ qián bào fāng.', 'Quē de shù, fāng lǐ pài rén bǔ shàng.'])
			),
			say('chunchu', ['Make up the count.', '…With whom?'], ['머릿수를 맞춘다고.', '…누구로?'], { chip: '#D8258C' }),
			say('@Ward chief', ['With a man.'], ['사람으로요.'], zh(['用人。'], ['Yòng rén.'])),
			say('chunchu', ['Any man?'], ['아무 사람이나?'], { chip: '#D8258C' }),
			say(
				'@Ward chief',
				['The register hasn’t got a column for names, sir. Only for the number.'],
				['장부에는 이름 칸이 없소. 숫자 칸만 있지.'],
				zh(['冊上沒有名字那一欄。只有數。'], ['Cè shàng méiyǒu míngzi nà yì lán. Zhǐ yǒu shù.'])
			),
			p(
				'Inmun reads the register over the man’s shoulder. Eleven. He will live in this city for most of his life, and in every count it ever makes of him he will be one stroke in that column.',
				'인문은 사내의 어깨 너머로 장부를 읽는다. 열하나. 그는 생의 대부분을 이 도시에서 살게 되고, 이 도시가 그를 셀 때마다 그는 저 칸의 획 하나일 것이다.'
			)
		]
	},
	{
		entry: 'The Emperor',
		after: (b) => b.kind === 'p' && b.html?.startsWith('He also asks, as idly as a foreign envoy'),
		marker: 'Historiography Office',
		blocks: [
			p(
				'Since the Ministry of War cannot find him a general, Chunchu tries the Historiography Office. Chu Suiliang receives him among the shelves: the man who once refused to let the emperor read his own diary, now high enough at court to choose what he says and careful enough to say very little.',
				'병부가 장군 하나를 찾아내지 못하자, 춘추는 사관(史館)에 가 본다. 저수량이 서가 사이에서 그를 맞는다. 한때 황제에게 황제 자신의 기거주(起居注)를 보여 주기를 거절했던 사람. 이제는 무엇을 말할지 고를 만큼 높아졌고, 거의 아무 말도 하지 않을 만큼 조심스러워졌다.'
			),
			say(
				'chunchu',
				['Lord Chu. A small question from a small country.', 'His Majesty came to the throne by way of the Xuanwu Gate, I’m told. The ninth year of Wude, the sixth month, the fourth day—'],
				['저공(褚公). 작은 나라의 작은 질문 하나만.', '폐하께서 현무문을 거쳐 보위에 오르셨다 들었습니다. 무덕 구년, 유월, 초나흘에—'],
				{ chip: '#D8258C' }
			),
			say('chusuiliang', ['Which gate?'], ['어느 문 말씀이십니까?'], { chip: '#8c7a5b', ...zh(['哪個門？'], ['Nǎge mén?']) }),
			say('chunchu', ['…The Xuanwu Gate. The north one.'], ['…현무문 말입니다. 북쪽 문.'], { chip: '#D8258C' }),
			say(
				'chusuiliang',
				['There is a gate there. A very fine gate. Nothing happened at it.'],
				['거기 문이 있긴 합니다. 아주 훌륭한 문이지요. 그 앞에선 아무 일도 없었습니다.'],
				{ chip: '#8c7a5b', ...zh(['那裡是有一座門。很好的門。門前什麼事也沒有。'], ['Nàlǐ shì yǒu yí zuò mén. Hěn hǎo de mén. Mén qián shénme shì yě méiyǒu.']) }
			),
			say('chunchu', ['And the fourth day of the sixth month?'], ['그럼 유월 초나흘은요?'], { chip: '#D8258C' }),
			say(
				'chusuiliang',
				['The third was a fine day, Prince. The fifth was finer.', 'I can recommend either.'],
				['초사흘은 날이 좋았습니다, 전하. 초닷새는 더 좋았고요.', '어느 쪽이든 권해 드리지요.'],
				{ chip: '#8c7a5b', ...zh(['初三天氣很好，殿下。初五更好。', '兩天都可推薦。'], ['Chū sān tiānqì hěn hǎo, diànxià. Chū wǔ gèng hǎo.', 'Liǎng tiān dōu kě tuījiàn.']) }
			),
			say('chunchu', ['I’d heard the account was rewritten.'], ['기록을 고쳐 썼다고 들었습니다만.'], { chip: '#D8258C' }),
			say(
				'chusuiliang',
				['Harmonized, Prince.', 'Here we say harmonized.'],
				['화해(和諧)라 합니다, 전하.', '여기선 고쳐 썼다 하지 않고, 조화롭게 했다고 하지요.'],
				{ chip: '#8c7a5b', ...zh(['是和諧了，殿下。', '這裡我們說和諧。'], ['Shì héxié le, diànxià.', 'Zhèlǐ wǒmen shuō héxié.']) }
			),
			say('chunchu', ['Then I’ll take the fifth.', 'I’ve always liked a fine day.'], ['그럼 저는 초닷새로 하지요.', '원래 맑은 날을 좋아합니다.'], { chip: '#D8258C' }),
			p(
				'The rest he hears at the envoys’ lodging, where foreigners trade what the palace will not. The emperor got the record from his chancellor in the end, read the pages about the gate, and sent them back to be written more plainly. Nobody has forbidden the fourth day of the sixth month since. It has simply stopped coming round.',
				'나머지는 객관에서 듣는다. 궁이 말하지 않는 것을 외국인들끼리 주고받는 곳이다. 황제는 결국 재상에게서 실록을 받아 냈고, 문에 관한 대목을 읽고는, 좀 더 담백하게 고쳐 쓰라며 돌려보냈다. 그 뒤로 유월 초나흘을 금한 사람은 없다. 그날이 그냥 더는 돌아오지 않을 뿐이다.'
			)
		]
	},
	{
		entry: 'The Emperor',
		after: (b) => b.person === 'chunchu' && b.en?.some((l) => l.startsWith('Gentlemen. If tears were an army')),
		marker: 'hurts the feelings of ten million households',
		blocks: [
			say(
				'west_ambassador',
				['(not laughing)', 'The prince’s jest hurts the feelings of ten million households of the Great Tang.'],
				['(웃지 않고)', '왕자의 농담이 대당 천만 호(戶)의 감정을 상하게 하였소.'],
				{ chip: '#b45309', ...zh(['（不笑）', '王子此言，傷害了大唐千萬戶的感情。'], ['(Bú xiào)', 'Wángzǐ cǐ yán, shānghài le Dà Táng qiān wàn hù de gǎnqíng.']) }
			)
		]
	},
	{
		entry: 'The Emperor',
		after: (b) => b.person === 'taizong' && b.en?.some((l) => l.startsWith('Listen to him. A barbarian who understands banquet combat')),
		marker: 'LUXURY IS THE ENEMY',
		blocks: [
			p(
				'Above the dais hangs one more banner, gold on red: LUXURY IS THE ENEMY. Under it a thousand dishes go round, each carried by a servant in the same livery, at the same pace, with the same face. When the emperor lifts his cup the whole hall shouts <i>Ten thousand years!</i> on one breath, and sits again on the next.',
				'단 위에 현수막이 하나 더 걸려 있다. 붉은 바탕에 금색 글자, 〈사치는 적이다〉. 그 아래로 요리 천 가지가 돈다. 같은 옷을 입은 시종들이, 같은 걸음으로, 같은 얼굴을 하고 나른다. 황제가 잔을 들면 온 전각이 한 호흡에 〈만세!〉를 외치고, 다음 호흡에 앉는다.'
			),
			{
				kind: 'dialogue',
				person: 'east_ambassador',
				en: ['(reading the banners along the wall, half to himself)', 'Eight directions under one roof…', 'We must borrow that one. We have rather a lot of islands, so we’ll want a bigger roof.'],
				lines: ['(벽의 현수막을 읽으며, 반쯤 혼잣말로)', '팔굉일우라…', '저희도 저건 빌려 가야겠습니다. 섬이 좀 많아서, 지붕은 더 커야겠지만요.'],
				chip: '#6b8cae',
				ja: ['（壁の垂れ幕を読みながら、半ば独り言に）', '八紘一宇……', 'あれは拝借せねばなりませんな。島が多いもので、屋根はもっと大きくなりましょうが。'],
				jaLatn: ['(Kabe no taremaku o yominagara, nakaba hitorigoto ni)', 'Hakkō ichiu……', 'Are wa haishaku seneba narimasen na. Shima ga ōi mono de, yane wa motto ōkiku narimashō ga.']
			}
		]
	},
	{
		entry: 'Death of the Second Emperor',
		after: (b) => b.person === 'gaozong' && b.en?.some((l) => l.includes('temple name is hereby set as Taizong')),
		marker: 'Ashina She’er',
		blocks: [
			p(
				'The empire is told how to grieve. The edict fixes the days of mourning by rank, and at dusk in every ward of Chang’an the ward chief walks the lanes and listens at the doors, to be sure the weeping inside is of the proper length.',
				'제국은 어떻게 슬퍼할지 지시받는다. 칙령은 품계에 따라 상복 입을 날수를 정하고, 해 질 녘이면 장안의 방마다 방정이 골목을 돌며 문에 귀를 댄다. 안의 곡소리가 정해진 길이만큼인지 확인하려고.'
			),
			p(
				'Two Turkic generals, Ashina She’er and Qibi Heli, petition to be killed and laid beside him, to guard the tomb the way the six stone horses will. It is the highest loyalty the steppe knows. The court is moved. The young emperor reads the petition twice.',
				'돌궐 장수 둘, 아사나사이와 계필하력이 순장을 청한다. 죽어서 그의 곁에 묻혀, 여섯 돌말처럼 능을 지키겠다는 것이다. 초원이 아는 가장 높은 충성이다. 조정은 감동한다. 젊은 황제는 그 상소를 두 번 읽는다.'
			),
			say(
				'gaozong',
				['Denied.', '…Father already has six horses waiting at his door.', 'He would scold Us for wasting two good generals.'],
				['불허한다.', '…선제 문 앞엔 이미 말 여섯이 기다리고 있다.', '멀쩡한 장수 둘을 버렸다고, 짐을 꾸짖으실 게다.'],
				{ chip: '#b8935a', ...zh(['不准。', '……先帝門前，已有六駿相候。', '他會怪朕白白折了兩員良將。'], ['Bù zhǔn.', '……Xiāndì mén qián, yǐ yǒu liù jùn xiāng hòu.', 'Tā huì guài zhèn báibái shé le liǎng yuán liáng jiàng.']) }
			)
		]
	},
	{
		entry: 'The Death of Buyeo Euija',
		after: (b) => b.kind === 'p' && b.html?.startsWith('In the Tang capital, Euija is brought forth'),
		marker: 'First there is paperwork',
		blocks: [
			p(
				'First there is paperwork. A clerk of the Court of State Ceremonial hands the prisoner a confession already written out in a fair hand, with a space left at the bottom for his name.',
				'먼저 서류가 있다. 홍려시의 서기 하나가 포로에게 자백서를 건넨다. 이미 단정한 글씨로 다 써 놓았고, 맨 아래에 이름 쓸 자리만 비워 두었다.'
			),
			say(
				'@Tang clerk',
				['Aloud, please. Clearly. The scribes are taking it down.'],
				['소리 내어 읽으시오. 또박또박. 사관들이 받아 적고 있소.'],
				zh(['請高聲宣讀，字字清楚。史官在記。'], ['Qǐng gāoshēng xuāndú, zìzì qīngchu. Shǐguān zài jì.'])
			),
			say(
				'euija',
				[
					'‘I, the criminal Euija, having been liberated by the Great Tang—’',
					'Liberated. Hm. So that’s what that was.',
					'‘—confess with gratitude that without the Great Tang there would be no New Baekje—’',
					'There isn’t one. You burned it.',
					'‘—and resolve to serve the Emperor for ten thousand years.’',
					'Ten thousand? I’m sixty. Ambitious fellow, your clerk.'
				],
				[
					'‘죄인 의자는 대당의 해방을 입어—’',
					'해방이라. 흠. 그게 그거였나.',
					'‘—대당이 없었다면 새 백제도 없었음을 감사히 자백하며—’',
					'없지. 너희가 다 태웠잖아.',
					'‘—만세토록 천자를 섬길 것을 결심하나이다.’',
					'만세? 내가 예순이다. 야심 한번 크구먼, 너희 서기.'
				],
				{ chip: '#e08a2e' }
			),
			say(
				'euija',
				['It’s a bad story. Nobody’s afraid of anything, there’s no villain, and the hero is a building.', 'Who wrote this? I’ve done better drunk.'],
				['형편없는 이야기다. 겁나는 것도 없고, 악당도 없고, 주인공이 건물이야.', '누가 썼냐? 난 취해서도 이보단 잘 썼다.'],
				{ chip: '#e08a2e' }
			),
			say('@Tang clerk', ['Your name, please. Here.'], ['이름을. 여기.'], zh(['請署名。這裡。'], ['Qǐng shǔmíng. Zhèlǐ.'])),
			p(
				'He signs in a hand so large the name runs off the edge of the paper, and gives it back. The clerk files it without looking. A confession only needs a name, and has never much minded whose.',
				'그는 이름이 종이 끝을 넘어갈 만큼 큼직하게 서명하고 돌려준다. 서기는 보지도 않고 철해 둔다. 자백서에 필요한 건 이름 하나뿐이고, 그게 누구 이름인지는 늘 별로 상관하지 않았다.'
			)
		]
	}
];

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entries = story.flatMap((ch) => ch.entries ?? []);

for (const ins of INSERTS) {
	const en = entries.find((e) => e.title === ins.entry);
	if (!en) throw new Error(`missing entry ${ins.entry}`);
	if (JSON.stringify(en.blocks).includes(ins.marker)) {
		console.log(`skip (already in): ${ins.entry} · ${ins.marker}`);
		continue;
	}
	const i = en.blocks.findIndex(ins.after);
	if (i < 0) throw new Error(`anchor not found in ${ins.entry} for ${ins.marker}`);
	en.blocks.splice(i + 1, 0, ...ins.blocks);
	console.log(`+${ins.blocks.length} after #${i} in ${ins.entry} · ${ins.marker}`);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
