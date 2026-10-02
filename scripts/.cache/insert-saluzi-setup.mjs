// Saluzi setup → payoff in "The Emperor" (648), and the unnamed-Chinese pass:
// only emperors, Xue Rengui and the horses keep their names in the prose.
// Usage: node scripts/.cache/insert-saluzi-setup.mjs
import { openStory, insertAfter, indexOf, guard, p, text } from './story-edit.mjs';

const { entry, say, save } = openStory();

/** Replace `from` with `to` in every text field of the one block that contains `anchor`. */
function swap(e, anchor, pairs) {
	const b = e.blocks[indexOf(e, anchor)];
	for (const [from, to] of pairs) {
		let hit = false;
		const sub = (s) => {
			if (typeof s !== 'string' || !s.includes(from)) return s;
			hit = true;
			return s.split(from).join(to);
		};
		for (const k of ['html', 'ko', 'label']) if (b[k]) b[k] = sub(b[k]);
		for (const k of ['en', 'lines', 'zh', 'zhLatn']) if (b[k]) b[k] = b[k].map(sub);
		if (!hit) throw new Error(`${e.title}: "${from}" not in block "${anchor}"`);
	}
}

const emperor = entry('The Emperor');
guard(emperor, 'That, and Saluzi.');

// ── First audience: the go-board room. Taizong names his most loyal warrior. ──
const aliveAt = indexOf(emperor, 'It is why I am still alive.');
const alive = emperor.blocks[aliveAt];
const [, sonKo] = alive.lines;
const [, sonEn] = alive.en;
const [, sonZh] = alive.zh;
const [, sonZhLatn] = alive.zhLatn;
alive.lines = ['짐은 사람을 잘 보네. 그래서 아직 살아 있고.', '그리고 <b>삽로자</b> 덕분이지.'];
alive.en = ['I read people well. It is why I am still alive.', 'That, and Saluzi.'];
alive.zh = ['朕識人。所以朕還活着。', '還有颯露紫。'];
alive.zhLatn = ['Zhèn shí rén. Suǒyǐ zhèn hái huózhe.', 'Hái yǒu Sàlùzǐ.'];

const taizongZh = (b, zh, zhLatn) => Object.assign(b, { zh, zhLatn });

emperor.blocks.splice(
	aliveAt + 1,
	0,
	say('chunchu', ['삽로자… 말씀이옵니까, 폐하?', '송구하오나 처음 듣는 이름이옵니다.'], ['Saluzi, Majesty?', '…Forgive me. I don’t know the name.']),
	taizongZh(
		say(
			'taizong',
			[
				'모르는 게 당연하지. 벼슬을 한 적이 없으니.',
				'관작도, 봉지도, 짐이 올려 줄 아들도 조정에 없네. 낙양 밖에서 짐의 이름이 적힌 화살을 가슴으로 받고, 그걸 꽂은 채로 짐을 진영까지 데려왔지.',
				'짐이 거느려 본 가장 충직한 용사일세. 자네가 떠나기 전에 소개해 줄 수도 있겠군.'
			],
			[
				'No, you would not. He never held office.',
				'No title, no fief, no son at court for me to promote. Outside Luoyang he took an arrow in the chest that had my name on it, and brought me back to camp with it still in him.',
				'The most loyal warrior I have ever had. Perhaps I shall introduce you, before you go.'
			]
		),
		[
			'你自然不知。他從未做官。',
			'無官無爵，無封地，朝中也無兒子可讓朕提拔。洛陽城外，他胸口替朕挨了一箭，帶着那支箭把朕送回了營。',
			'朕平生最忠的勇士。你走之前，或許朕替你引見。'
		],
		[
			'Nǐ zìrán bù zhī. Tā cóngwèi zuò guān.',
			'Wú guān wú jué, wú fēngdì, cháo zhōng yě wú érzi kě ràng zhèn tíbá. Luòyáng chéng wài, tā xiōngkǒu tì zhèn ái le yī jiàn, dàizhe nà zhī jiàn bǎ zhèn sònghuí le yíng.',
			'Zhèn píngshēng zuì zhōng de yǒngshì. Nǐ zǒu zhīqián, huòxǔ zhèn tì nǐ yǐnjiàn.'
		]
	),
	say('chunchu', ['…꼭 뵙고 싶사옵니다, 폐하.'], ['…I would very much like that, Majesty.']),
	taizongZh(say('taizong', ['그건 «예»라는 뜻이로군. 좋아.'], ['That one means “yes.” Good.']), ['這句是「是」。好。'], ['Zhè jù shì “shì”. Hǎo.']),
	p(
		'Chunchu files the name the way he files everything in this city. A man who took an arrow for the emperor and asked for nothing afterwards is either a saint or a lever, and either way worth an introduction.',
		'춘추는 이 도성의 모든 것을 그러하듯 그 이름을 마음에 적어 둔다. 황제 대신 화살을 맞고도 아무것도 청하지 않은 사내라면 성인이거나 지렛대일 테고, 어느 쪽이든 인사를 터 둘 만하다.'
	),
	taizongZh(say('taizong', [sonKo], [sonEn]), [sonZh], [sonZhLatn])
);

// ── Between audiences: the Ministry of War has never heard of him. ──
insertAfter(emperor, 'Between audiences Chunchu watches the machinery.', [
	p(
		'He also asks, as idly as a foreign envoy can ask anything, after a general named Saluzi. A clerk of the Ministry of War spends an afternoon in the rolls on his behalf and comes back apologetic. There is no Saluzi: no rank, no fief, no tomb, no widow drawing a pension. Either the emperor’s most loyal warrior is dead, or he is the only man in Chang’an without paperwork. Chunchu finds he wants to meet him more than he wanted to meet the emperor.',
		'그리고 외국 사신이 물을 수 있는 한 가장 무심한 투로, 삽로자라는 장군에 대해서도 묻는다. 병부의 서기 하나가 그를 위해 오후 내내 명부를 뒤지고는 송구한 얼굴로 돌아온다. 삽로자는 없다. 품계도, 봉지도, 무덤도, 녹을 받는 과부도 없다. 황제의 가장 충직한 용사는 이미 죽었거나, 아니면 장안에서 유일하게 문서가 없는 사내다. 춘추는 황제를 만나고 싶었던 것보다 그 사내를 더 만나고 싶어진다.'
	)
]);

// ── The gallery: unnamed rivals, unnamed painter, unnamed general. ──
swap(emperor, 'from drawings by Yan Liben', [
	['from drawings by Yan Liben', 'from drawings by the court painter'],
	['염립본의 밑그림대로', '궁정 화가의 밑그림대로']
]);
swap(emperor, 'Xue Rengao held the whole of the west', [
	['Xue Rengao held the whole of the west', 'A warlord held the whole of the west'],
	['Xue Rengao woke to find me', 'He woke to find me'],
	['설인고가 서쪽을 통째로 쥐고 있었고', '한 군벌이 서쪽을 통째로 쥐고 있었고'],
	['설인고는 아침에 눈을 떠 보니', '그자는 아침에 눈을 떠 보니']
]);
swap(emperor, 'Song Jingang had seized Taiyuan', [
	['Song Jingang had seized Taiyuan', 'A northern warlord had seized Taiyuan'],
	['송금강이 태원을 빼앗았어', '북방의 군벌 하나가 태원을 빼앗았어']
]);
swap(emperor, 'Dou Jiande came with a hundred thousand', [
	['Dou Jiande came with a hundred thousand men', 'a rival who called himself king came with a hundred thousand men'],
	['두건덕이 낙양을 구하겠다고', '왕을 자칭한 자가 낙양을 구하겠다고']
]);
swap(emperor, 'He carried me against Wang Shichong and Dou Jiande both', [
	['He carried me against Wang Shichong and Dou Jiande both, in the same spring.', 'He carried me against both of them in the same spring: the one shut up in Luoyang, and the one who came to save him.'],
	['같은 봄에 왕세충과 두건덕을 둘 다 상대할 때 짐을 태웠지.', '같은 봄에 낙양에 틀어박힌 자와 그를 구하러 온 자, 둘을 다 상대할 때 짐을 태웠지.']
]);
swap(emperor, 'Liu Heita, by the Ming River', [
	['Liu Heita, by the Ming River.', 'The last of the rebels, by the Ming River.'],
	['명수 가에서 유흑달과 싸울 때였어.', '명수 가에서 마지막 반적과 싸울 때였어.']
]);

// ── The reveal: "Saluzi." lands, Chunchu understands, then the story. ──
const revealAt = indexOf(emperor, 'Purple, the colour of a fresh bruise');
const reveal = emperor.blocks[revealAt];
const restKo = reveal.lines.slice(1);
const restEn = reveal.en.slice(1);
reveal.lines = reveal.lines.slice(0, 1);
reveal.en = reveal.en.slice(0, 1);
const story = say('taizong', restKo, restEn);
emperor.blocks.splice(
	revealAt + 1,
	0,
	p(
		'Chunchu hears the name before he understands it. He looks at the purple horse in the stone, and at the man carved at its chest, and back at the emperor, and an afternoon of the Ministry of War’s rolls rearranges itself in his head. Five horses, five names, and not once has it occurred to him.',
		'춘추는 이름을 먼저 듣고, 뜻은 나중에 알아듣는다. 돌 속의 자줏빛 말을 보고, 그 가슴께에 새겨진 사내를 보고, 다시 황제를 본다. 병부 명부를 뒤지던 그 오후가 머릿속에서 통째로 다시 맞춰진다. 말 다섯에 이름 다섯을 들었는데도, 단 한 번도 그 생각을 하지 못했다.'
	),
	say(
		'chunchu',
		['…삽로자.', '폐하의 가장 충직한 용사. 벼슬을 한 적이 없다던.', '폐하. 그 용사가… 말이옵니까.'],
		['…Saluzi.', 'Your most loyal warrior. The one who never held office.', 'Majesty. He is a <i>horse</i>.']
	),
	taizongZh(
		say(
			'taizong',
			['제국에서 으뜸가는 놈이지. 짐은 사람이라고 한 적이 없네, 춘추. 그건 자네가 알아서 채워 넣은 게야.', '짐의 신하들도 대개 제 자신에 대해 같은 착각을 하지.'],
			['The finest in the empire. I never said he was a man, Spring-and-Autumn. You supplied that yourself.', 'Most of my ministers make the same mistake about themselves.']
		),
		['天下第一。朕可從沒說過他是人，春秋。是你自己添上的。', '朕的大臣們，多半也對自己犯同樣的錯。'],
		['Tiānxià dì yī. Zhèn kě cóng méi shuōguò tā shì rén, Chūnqiū. Shì nǐ zìjǐ tiān shàng de.', 'Zhèn de dàchénmen, duōbàn yě duì zìjǐ fàn tóngyàng de cuò.']
	),
	say('chunchu', ['소신, 병부 서기더러 그분을 찾으라고 명부를 뒤지게 했사옵니다.', '오후 내내요.'], ['I had a clerk of your Ministry of War search the rolls for him.', 'All afternoon.']),
	taizongZh(
		say(
			'taizong',
			['(웃음이 회랑 끝까지 울린다)', '그랬나. 그럼 짐의 병부 어딘가에, 신라 왕자가 짐의 장수를 사냥하고 다닌다고 믿는 서기가 하나 있겠군. 승진을 시켜 줘야겠어.'],
			['(laughs, and it carries all the way down the gallery)', 'Did you. Then somewhere in my ministry there is a clerk who believes the Silla prince is hunting my generals. I shall have to promote him.']
		),
		['（笑聲一路傳到迴廊盡頭）', '是麼。那朕的兵部裏，就有個書吏以為新羅王子在獵殺朕的將軍了。得給他升官。'],
		['(xiàoshēng yīlù chuándào huíláng jìntóu)', 'Shì me. Nà zhèn de bīngbù lǐ, jiù yǒu gè shūlì yǐwéi Xīnluó wángzǐ zài lièshā zhèn de jiāngjūn le. Děi gěi tā shēngguān.']
	),
	p(
		'Then the laugh goes out of him the way a lamp gutters, and he looks back up at the stone.',
		'그러다 웃음이 등잔불 잦아들듯 그에게서 빠져나가고, 황제는 다시 돌을 올려다본다.'
	),
	story
);
swap(emperor, 'Purple, the colour of a fresh bruise', [
	['alone with Wang Shichong’s army', 'alone with the pretender’s army'],
	['General Qiu Xinggong rode in', 'One of my generals rode in'],
	['왕세충의 군대 한가운데', '참칭한 자의 군대 한가운데'],
	['구행공 장군이 달려 들어와', '짐의 장수 하나가 달려 들어와']
]);

// ── The same rule in the rest of the chronicle's prose. ──
swap(entry('Emperor of the West'), 'Wei Zheng, the Grand Minister, is dying.', [
	['Wei Zheng, the Grand Minister, is dying.', 'The Grand Minister is dying.'],
	['대신 위징이 죽어 가고 있다.', '대신이 죽어 가고 있다.']
]);
swap(entry('Ansi'), 'Had Wei Zheng been alive', [
	['Had Wei Zheng been alive', 'Had [the Grand Minister] been alive'],
	['위징이 살아 있었다면', '[대신이] 살아 있었다면']
]);
swap(entry('Ansi'), 'Had Wei Zheng lived', [
	['Had Wei Zheng lived', 'Had my old minister lived'],
	['위징이 살았다면', '그 늙은 대신이 살았다면']
]);
swap(entry('Yellow Mountain Fields'), 'Su Dingfang’s host', [
	['Su Dingfang’s host', 'the <b>Red Fowl</b>’s host'],
	['소정방의 대군', '<b>주작</b>의 대군']
]);
swap(entry('White River'), 'Liu Rengui — the <b>Black Dragon</b> —', [
	['Liu Rengui — the <b>Black Dragon</b> — has', 'The <b>Black Dragon</b> has'],
	['<b>흑룡</b> 유인궤는', '<b>흑룡</b>은']
]);
const snake = entry('Snake River');
swap(snake, 'The <b>White Tiger</b> — Pang Xiaotai — drives', [
	['The <b>White Tiger</b> — Pang Xiaotai — drives', 'The <b>White Tiger</b> drives'],
	['<b>백호</b> 방효태가', '<b>백호</b>가']
]);
swap(snake, 'Pang Xiaotai fought Yeon Gaesomun', [
	['Pang Xiaotai fought Yeon Gaesomun', '[The White Tiger] fought Yeon Gaesomun'],
	['방효태가 개소문과', '[백호가] 개소문과']
]);
swap(snake, '<b>Pang Xiaotai</b> of Baekju', [
	['<b>Pang Xiaotai</b> of Baekju', 'The <b>White Tiger</b> of Baekju'],
	['백주 사람 <b>방효태</b>', '백주 사람, <b>백호</b>']
]);
swap(snake, 'Pang Xiaotai’s thirteen sons', [
	['Pang Xiaotai’s thirteen sons', 'The White Tiger’s thirteen sons'],
	['방효태의 아들 열셋', '백호의 아들 열셋']
]);
swap(entry('The Death of Yeon Gesomun'), 'Pang Xiaotai at the Snake River', [
	['Pang Xiaotai at the Snake River', 'the White Tiger at the Snake River'],
	['사수의 방효태를', '사수의 백호를']
]);

save();
console.log('Saluzi setup + reveal inserted; unnamed-Chinese pass applied.');
console.log(text(emperor.blocks[indexOf(emperor, 'That one means')]));
