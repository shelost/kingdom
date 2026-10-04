// One-shot: Four Dragons by title, Thousand-Li Wall in The Summit, Eastern Fortress (645 first line),
// Sul Gedu at Stallion Mountain, titles over names in White River / 649 / Pyongyang.
// Usage: node scripts/.cache/tang-generals-and-yodong.mjs
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entries = story.flatMap((ch) => ch.entries ?? []);

function entry(title) {
	const en = entries.find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function indexOf(en, needle) {
	const i = en.blocks.findIndex((b) => JSON.stringify(b).includes(needle));
	if (i < 0) throw new Error(`${en.title}: no block with ${needle}`);
	return i;
}

function insertAfter(en, needle, blocks) {
	en.blocks.splice(indexOf(en, needle) + 1, 0, ...blocks);
}

function swap(block, key, from, to) {
	if (!block[key]?.includes(from)) throw new Error(`no "${from}" in ${key}`);
	block[key] = block[key].replace(from, to);
}

const p = (html, ko) => ({ kind: 'p', html, ko });

// ── The Summit: the Thousand-Li Wall ─────────────────────────────────────────
insertAfter(entry('The Summit'), 'The barbarians run away if they even hear his name', [
	p(
		'The outpost is also a building site. Three summers ago the Tang levelled the mound of Sui bones at the Liao, the one Goguryeo had heaped up as a trophy, and the court took the hint: every commandery now owes the crown men and stone for a chain of border forts strung a thousand li from Buyeo Fortress down to the sea at Bisa, so that the next emperor who comes east has to climb a wall every day of his march. The court calls it the Thousand-Li Wall. The men hauling the stone just call them the <b>Eastern Fortresses</b>. When Yeon is not killing anybody he walks the new courses with a plumb line and kicks the blocks that are not square.',
		'초소는 공사판이기도 하다. 세 여름 전 당이 요하 가의 수나라 해골 무덤, 고구려가 전리품 삼아 쌓아 올린 그것을 허물었고, 조정은 그 뜻을 알아들었다. 이제 모든 부는 나라에 사람과 돌을 빚진다. 부여성에서 바닷가 비사성까지 천 리에 걸쳐 국경의 성들을 사슬처럼 엮어서, 다음에 동쪽으로 오는 황제는 행군하는 날마다 성벽 하나씩을 넘어야 하게 만드는 일이다. 조정은 그것을 천리장성이라 부른다. 돌을 져 나르는 사내들은 그냥 <b>요동의 성들</b>이라 부른다. 연은 누구를 죽이지 않을 때면 다림줄을 들고 새로 쌓은 단을 따라 걸으며, 반듯하지 않은 돌을 걷어찬다.'
	)
]);

// ── Emperor of the West: the real Four Dragons, and the Heavenly Qaghan ──────
{
	const en = entry('Emperor of the West');
	const table = en.blocks[indexOf(en, '"head":["White Dragon","Red Dragon","Blue Dragon","Black Dragon"]')];
	table.rows = [['계필하력', '아사나사이', '이세적', '장손무기']];
	insertAfter(en, 'The fifth banner has no name on it at all.', [
		p(
			'Two of the four dragons are not Han at all. The Red Dragon is Ashina She’er, a prince of the Turkic royal clan who keeps his felt tents inside the capital walls; the White Dragon is Qibi Heli, who brought his whole Tiele tribe over the Wall as a boy. The steppe calls the Second Emperor the Heavenly Qaghan, and he answers to it. His six favourite chargers came off the steppe too, and one of them carries a Turkic prince’s title for a name. The Black Dragon is the empress’s brother, Zhangsun Wuji, who argued against this war in council and is riding to it anyway.',
			'용 넷 가운데 둘은 아예 한인이 아니다. 적룡 아사나사이는 돌궐 왕족의 왕자로, 도성 성벽 안에 제 펠트 천막을 치고 산다. 백룡 계필하력은 어린 나이에 철륵 부족을 통째로 이끌고 장성을 넘어왔다. 초원은 황제를 천가한이라 부르고, 그는 그 이름에 대답한다. 그가 가장 아끼는 여섯 준마도 초원에서 왔고, 그중 하나는 돌궐 왕자의 칭호를 제 이름으로 달고 있다. 흑룡은 황후의 오라비 장손무기다. 조정에서 이 전쟁을 반대했고, 그러고도 지금 그 전쟁에 말을 타고 간다.'
		)
	]);
}

// ── Eastern Fortress: the first line falls ───────────────────────────────────
{
	const en = entry('Eastern Fortress');
	const first = indexOf(en, 'In May the Eastern Fortress falls.');
	en.blocks.splice(first, 1, ...[
		p(
			'Goguryeo has spent fourteen years building a wall of fortresses along the Liao, and the Blue Dragon goes around it. He shows his banners on the middle road, turns north in the night, and on the first day of the fourth month his horse are across the river at a ford nobody was watching and outside the gates of <b>Hyeondo</b>. Hyeondo shuts them and holds for exactly as long as the gates do.',
			'고구려는 열네 해 동안 요하를 따라 성을 쌓아 담을 만들었고, 청룡은 그 담을 돌아간다. 가운뎃길에 깃발을 보여 주고는 밤사이 북쪽으로 꺾어, 사월 초하루에는 아무도 지키지 않던 여울로 강을 건너 <b>현도성</b> 문 앞에 와 있다. 현도는 문을 닫고, 문이 버티는 만큼만 버틴다.'
		),
		p(
			'<b>Sinseong</b>, the New Fortress, does not fall; the emperor’s cousin, the Prince of Jiangxia, spends ten days under its walls and comes away with nothing. So the Blue Dragon leaves a guard to watch it and turns south, and <b>Gaemo</b> goes in a little over ten days. Seven hundred men Yeon sent down from Gasi to hold it are taken in the gate. They ask to serve the emperor instead.',
			'<b>신성</b>은 떨어지지 않는다. 황제의 사촌 강하왕이 열흘을 성 밑에서 보내고 빈손으로 물러난다. 그래서 청룡은 신성을 지켜볼 병력만 남겨 두고 남쪽으로 꺾고, <b>개모성</b>은 열흘 남짓 만에 넘어간다. 연이 가시성에서 내려보내 지키게 한 칠백 명이 성문에서 붙잡힌다. 그들은 차라리 황제 밑에서 싸우겠다고 청한다.'
		),
		{
			kind: 'dialogue',
			chip: '#c97a2e',
			speaker: '👑',
			person: 'taizong',
			lines: ['이놈들 집이 다 가시에 있다지.', '짐을 위해 싸우면, 막리지가 처자식을 다 죽일 게다.', '한 사람의 힘을 얻자고 한 집안을 없애는 짓은 짐이 차마 못 하겠다. 돌려보내거라.'],
			en: ['Their homes are all in Gasi, I am told.', 'If they fight for Us, the Mangniji will kill every wife and child they have.', 'To gain one man’s arm by wiping out his house — that We cannot bring Ourselves to do. Send them home.'],
			zh: ['聽說他們家都在加尸。', '若為朕而戰，莫離支必盡殺其妻子。', '得一人之力而滅一家，朕不忍也。遣之歸。'],
			zhLatn: ['Tīngshuō tāmen jiā dōu zài Jiāshī.', 'Ruò wèi zhèn ér zhàn, Mòlízhī bì jìn shā qí qīzǐ.', 'Dé yī rén zhī lì ér miè yī jiā, zhèn bùrěn yě. Qiǎn zhī guī.']
		},
		p(
			'They go home with grain for the road. It is a kindness, and it is also arithmetic: seven hundred men who have seen the size of this army will describe it to Gasi better than any envoy could.',
			'그들은 길양식까지 받아 집으로 돌아간다. 자비이기도 하고 셈이기도 하다. 이 군대의 크기를 제 눈으로 본 칠백 명은 어떤 사신보다도 그것을 가시성에 잘 전할 것이다.'
		),
		p(
			'Between the Six Armies and the walls lies the Liao marsh, two hundred li of mud where a Sui host once went in to the knee and came out as a song. The Master of Works, Yan Lide, lays earth across it in a road wide enough for carts. When the last wagon is over, the Second Emperor has the road torn up behind them. Nobody is going home the way they came, and he wants every man in the column to know it.',
			'육군과 성벽 사이에는 요택이 있다. 이백 리 진흙 벌판, 수나라 대군이 무릎까지 빠져 들어갔다가 노래가 되어 나온 곳이다. 장작대장 염입덕이 그 위에 흙을 깔아 수레가 지나갈 만한 길을 낸다. 마지막 수레가 건너자 황제는 등 뒤의 길을 걷어 내게 한다. 온 길로 돌아갈 사람은 아무도 없고, 그는 행렬의 모든 사내가 그걸 알기를 바란다.'
		),
		p(
			'Then the <b>Eastern Fortress</b> itself: Yodong, the city that held the Sui off for three summers and never opened. The Blue Dragon has already driven one sortie back through its gate when the emperor arrives. He rides to the edge of the moat, carries a sack of earth across his own saddle and throws it in, and his officers, who cannot be seen carrying less than the Son of Heaven, carry two. The Tang ring the walls a hundred deep and beat the drums until the ground answers.',
			'그리고 <b>요동성</b>. 수나라를 세 여름 동안 막아 내고 끝내 문을 열지 않은 그 성이다. 황제가 도착했을 때 청룡은 이미 성에서 나온 군사를 한 번 문 안으로 밀어 넣은 뒤다. 황제는 해자 가장자리까지 말을 몰고 가서 흙 한 자루를 제 안장에 싣고 와 던져 넣고, 천자보다 덜 나르는 꼴을 보일 수 없는 장수들은 두 자루씩 나른다. 당군은 성을 수백 겹으로 에워싸고 땅이 대답할 때까지 북을 친다.'
		),
		p(
			'Inside the walls there is a shrine to Jumong, the Holy King who founded the country. A coat of chain mail hangs in it, and a long sharp spear, and the town will tell you both came down from heaven in the days of the old Yan. By the eighth day stones are coming over the parapet. The elders choose a girl from the town, wash her, paint her, dress her in red silk and a bride’s crown, and walk her up to the shrine to be given to the god.',
			'성안에는 나라를 세운 성왕 주몽의 사당이 있다. 사당에는 쇠사슬 갑옷 한 벌과 날 선 긴 창이 걸려 있는데, 성 사람들은 둘 다 옛 연나라 때 하늘에서 내려온 것이라고 말한다. 여드레째가 되자 성가퀴 너머로 돌이 날아든다. 어른들은 성안에서 처녀 하나를 골라 씻기고, 단장시키고, 붉은 비단과 신부의 관을 입혀, 신에게 바치러 사당으로 데려간다.'
		),
		{
			kind: 'dialogue',
			chip: '#d98a8a',
			speaker: '👰',
			lines: ['이거… 무거워요. 이 옷.', '…엄마한테 말해 줘요. 나 안 울었다고.'],
			en: ['It’s… heavy. The dress.', '…Tell my mum. Tell her I didn’t cry.']
		},
		{
			kind: 'dialogue',
			chip: '#7a6b5a',
			speaker: '🔔',
			lines: ['성왕께서… 웃으신다.', '신부를 받으셨다! 이 성은 온전하리라!'],
			en: ['The Holy King… is smiling.', 'He has taken his bride! This city will stand whole!']
		},
		p(
			'They close the shrine door on her. The record does not say whether anyone opens it again.',
			'그들은 아이를 들여보내고 사당 문을 닫는다. 그 문을 다시 연 사람이 있었는지, 기록은 말하지 않는다.'
		),
		{
			kind: 'quote',
			hanja: '城中有朱蒙祠，祠有鏁甲、銛矛，妄言前燕世天所降。方圍急，飾美女以婦神，巫言朱蒙悅，城必完。',
			html: 'In the city was a shrine to Jumong, and in the shrine a coat of chain mail and a sharp spear, which they falsely said had come down from heaven in the age of the Former Yan. When the siege grew desperate they adorned a beautiful woman as a wife for the god, and the shamans said: Jumong is pleased; the city will surely stand whole.',
			ko: '성안에 주몽의 사당이 있었는데, 사당에는 쇠사슬 갑옷과 날카로운 창이 있어, 전연 때 하늘에서 내려온 것이라고 망령되이 말하였다. 포위가 급해지자 미녀를 꾸며 신의 아내로 삼았고, 무당은 “주몽이 기뻐하니 성은 반드시 온전하리라” 하였다.',
			source: 'Zizhi Tongjian (資治通鑑) bk. 197'
		},
		p(
			'The Holy King is not consulted again. The Blue Dragon’s stone-throwers put rocks the size of grain jars three hundred paces over the walls and smash whatever they land on, and the Tang roll their towers up against the parapet. On the twelfth day a south wind gets up; they set fire to the south-west tower, and the fire runs into the town on the wind. When the gate gives they kill ten thousand men and take ten thousand soldiers, forty thousand townspeople and five hundred thousand sacks of grain. The fortress a million Sui soldiers could not open has lasted twelve days.',
			'성왕께 다시 묻는 사람은 없다. 청룡의 포차는 독만 한 돌을 삼백 보 너머 성안으로 날려 닿는 것마다 부수고, 당군은 공성탑을 성가퀴에 붙인다. 열이틀째 남풍이 거세지자 당군은 서남쪽 망루에 불을 지르고, 불길은 바람을 타고 성안으로 번진다. 성문이 무너지자 그들은 만 명을 죽이고, 군사 만 명과 백성 사만 명과 곡식 오십만 석을 거둔다. 수나라 백만 대군이 열지 못한 성이 열이틀을 버텼다.'
		),
		p(
			'After that the line comes down like roof tiles. At <b>Baegam</b> Yeon sends the Ogol garrison out to break the siege, and they put a spear into the White Dragon’s waist; he has it bound and is back in the saddle by evening, and the lord of Baegam, Son Daeeum, opens his gate anyway. Out on the southern cape the emperor’s fleet takes <b>Bisa</b> in a month. Of the forts Yeon spent fourteen years hauling stone for, only Sinseong and Geonan still fly Goguryeo banners.',
			'그 뒤로 방어선은 기와처럼 차례로 흘러내린다. <b>백암성</b>에서는 연이 오골성 군사를 내보내 포위를 깨게 하고, 그들은 백룡의 허리에 창을 꽂는다. 백룡은 상처를 동여매고 저녁이면 다시 말에 오르고, 백암 성주 손대음은 그래도 성문을 연다. 남쪽 곶에서는 황제의 수군이 한 달 만에 <b>비사성</b>을 떨어뜨린다. 연이 열네 해 동안 돌을 져 날라 쌓은 성들 가운데 아직 고구려 깃발을 단 것은 신성과 건안뿐이다.'
		),
		{
			kind: 'table',
			head: ['Fortress 城', 'Month', 'Fate'],
			rows: [
				['Hyeondo 현도', '4th', 'Stormed'],
				['Sinseong 신성', '4th', 'Holds'],
				['Gaemo 개모', '4th', 'Falls in ten days; 700 Gasi men sent home'],
				['Yodong 요동', '5th', 'Falls on the twelfth day'],
				['Bisa 비사', '5th', 'Taken from the sea'],
				['Baegam 백암', '6th', 'Its lord surrenders'],
				['Geonan 건안', '—', 'Holds'],
				['Ansi 안시', '6th', 'Ahead']
			]
		}
	]);
}

// ── Stallion Mountain: Sul Gedu ──────────────────────────────────────────────
{
	const en = entry('Stallion Mountain');
	insertAfter(en, 'tens of thousands under banners that think numbers are an argument', [
		p(
			'In the Tang line, among the guard captains, is a man whose Chinese still has the sea in it. Sul Gedu left Silla twenty-four winters ago in the hold of a merchant ship, and when the emperor called for men to march on Goguryeo he put his own name forward, which is the only way a foreigner becomes a captain of the Left Militant Guard. Across the field the Goguryeo banners are close enough to read.',
			'당진의 위사 장교들 사이에, 중국말에 아직 바다 냄새가 밴 사내가 하나 있다. 설계두는 스물네 해 전 상선 짐칸에 숨어 신라를 떠났고, 황제가 고구려를 칠 사람을 부르자 제 이름을 스스로 올렸다. 이방인이 좌무위과의가 되는 길은 그것뿐이다. 벌판 건너편으로 고구려 깃발이 글자를 읽을 수 있을 만큼 가깝다.'
		),
		{
			kind: 'dialogue',
			chip: '#8d8d95',
			speaker: '🪖',
			lines: ['어이, 설 과의. 저쪽 놈들 말이오… 삼한 사람들이라던데.', '당신도 삼한 출신 아니오?'],
			en: ['Hey, Captain Xue. That lot over there… they say they’re Samhan men.', 'Aren’t you from Samhan as well?'],
			zh: ['喂，薛果毅。對面那些人……聽說是三韓人。', '你不也是三韓來的嗎？'],
			zhLatn: ['Wèi, Xuē guǒyì. Duìmiàn nàxiē rén… tīngshuō shì Sānhán rén.', 'Nǐ bù yě shì Sānhán lái de ma?']
		},
		{
			kind: 'dialogue',
			chip: '#a8743a',
			person: 'xuejitou',
			lines: [
				'삼한이지. 신라.',
				'신라에선 사람 쓸 때 뼈부터 따져. 재주가 아무리 크고 공이 아무리 커도, 뼈가 아니면 못 넘어. 그냥 못 넘어.',
				'그래서 바다 건너왔지. 천자 곁에서 관 쓰고 띠 두르고 칼 차고 드나들어 보려고.',
				'…그거면 돼.'
			],
			en: [
				'Samhan. Silla.',
				'In Silla they count your bones before they hire you. Doesn’t matter how big your talent is or how big your deeds — wrong bones, and you don’t get over the wall. You just don’t.',
				'So I crossed the sea. To walk in and out at the Son of Heaven’s side with a cap and a sash and a sword.',
				'…That’ll do me.'
			],
			zh: ['三韓。新羅。', '新羅用人，先論骨頭。才再大、功再高，骨頭不對，就是過不去。就是過不去。', '所以我渡海來了。想在天子身邊，戴冠束帶、佩劍出入。', '……這就夠了。'],
			zhLatn: [
				'Sānhán. Xīnluó.',
				'Xīnluó yòng rén, xiān lùn gǔtou. Cái zài dà, gōng zài gāo, gǔtou bú duì, jiùshì guò bú qù. Jiùshì guò bú qù.',
				'Suǒyǐ wǒ dù hǎi lái le. Xiǎng zài tiānzǐ shēnbiān, dài guān shù dài, pèi jiàn chūrù.',
				'……Zhè jiù gòu le.'
			]
		},
		p(
			'The soldier laughs, not sure he was meant to. Sul Gedu ties off his helmet cord and does not look at the banners again.',
			'병사는 웃어도 되는 건지 모른 채 웃는다. 설계두는 투구 끈을 묶고, 다시는 그 깃발 쪽을 보지 않는다.'
		)
	]);
	insertAfter(en, 'The white coat stays. So does the ji.', [
		p(
			'There is another foreigner in the reckoning that night. Riding over the ground where the Goguryeo centre stood, the emperor finds Sul Gedu farther in than any of his own men got, face down among the dead he made.',
			'그날 밤 공을 헤아리는 자리에는 이방인이 하나 더 있다. 고구려 중군이 서 있던 땅을 말을 타고 지나던 황제는, 자기 군사 누구보다 깊이 들어간 자리에서, 제가 쓰러뜨린 시신들 사이에 엎어져 있는 설계두를 찾는다.'
		),
		{
			kind: 'quote',
			hanja: '至遼東，與麗人戰駐蹕山下，深入疾鬪而死，功一等。皇帝問是何許人，左右奏新羅人薛罽頭也。皇帝泫然曰：「吾人尙畏死，顧望不前，而外國人爲吾死事，何以報其功乎？」問從者，聞其平生之願，脫御衣覆之，授職爲大將軍，以禮葬之。',
			html: 'Reaching Liaodong, he fought the men of Goguryeo below Stallion Mountain; he went deep, fought hard and died, and his merit was ranked first. The emperor asked what manner of man he was, and those about him reported that he was Xue Jitou, a man of Silla. The emperor wept and said: “Our own men still fear death and look about them and will not advance, yet a man of a foreign country has died in Our cause. How shall We repay his merit?” He asked the man’s companions and learned the wish of his life; he took off the imperial robe and covered him with it, granted him the office of Grand General, and buried him with full rites.',
			ko: '요동에 이르러 주필산 아래에서 고구려 사람들과 싸웠는데, 깊이 들어가 맹렬히 싸우다 죽으니 공이 일등이었다. 황제가 어떤 사람이냐고 묻자, 좌우가 신라 사람 설계두라고 아뢰었다. 황제가 눈물을 흘리며 말하였다. “우리 사람들도 오히려 죽음을 두려워하여 두리번거리며 나아가지 않는데, 외국 사람이 우리를 위하여 죽었으니 무엇으로 그 공을 갚겠는가?” 따르던 자에게 물어 그의 평생 소원을 듣고는, 어의를 벗어 덮어 주고 대장군의 직을 내려 예로써 장사 지냈다.',
			source: 'Samguk Sagi (三國史記) bk. 47, Biographies 7, Seol Gyedu'
		},
		p(
			'The cap, the sash and the sword, more or less. He gets them lying down.',
			'관과 띠와 칼, 대강 그것이다. 그는 그것을 누워서 받는다.'
		)
	]);
}

// ── Titles over names ────────────────────────────────────────────────────────
{
	const b = entry('Death of the Second Emperor').blocks;
	const i = b.findIndex((x) => x.html?.includes('Two Turkic generals, Ashina She’er and Qibi Heli'));
	if (i < 0) throw new Error('649 petition block');
	swap(b[i], 'html', 'Two Turkic generals, Ashina She’er and Qibi Heli, petition', 'Two of his dragons, the Red and the White, both of them Turks, petition');
	swap(b[i], 'ko', '돌궐 장수 둘, 아사나사이와 계필하력이 순장을 청한다.', '그의 용 둘, 적룡과 백룡이 순장을 청한다. 둘 다 돌궐인이다.');
}
{
	const b = entry('Pyongyang, A').blocks;
	const i = b.findIndex((x) => x.html?.includes('with the <b>Black Dragon</b>'));
	if (i < 0) throw new Error('Pyongyang block');
	swap(b[i], 'html', '<b>Black Dragon</b>', '<b>Black Tortoise</b>');
	swap(b[i], 'ko', '<b>흑룡</b>', '<b>현무</b>');
}
{
	const en = entry('White River');
	const fix = (needle, pairs) => {
		const blk = en.blocks[indexOf(en, needle)];
		for (const [key, from, to] of pairs) swap(blk, key, from, to);
	};
	fix('Liu Rengui takes the water', [
		['html', 'Liu Rengui takes the water', 'The Black Tortoise takes the water'],
		['ko', '유인궤는 물을 맡는다', '현무는 물을 맡는다']
	]);
	fix('has already learned the river’s grammar', [['ko', '<b>현무</b>은', '<b>현무</b>는']]);
	fix('Liu Rengui has seen men of Wa', [
		['html', 'Liu Rengui has seen men of Wa', 'The Black Tortoise has seen men of Wa'],
		['ko', '유인궤는 왜인을', '현무는 왜인을']
	]);
	fix('and Liu Rengui hands it', [
		['html', 'and Liu Rengui hands it', 'and the Black Tortoise hands it'],
		['ko', '유인궤는 그것을', '현무는 그것을']
	]);
	fix('and Liu Rengui gives them back', [
		['html', 'and Liu Rengui gives them back', 'and the Black Tortoise gives them back'],
		['ko', '유인궤는 손인사의', '현무는 손인사의']
	]);
	fix('sits down with Kim Yushin', [['ko', '<b>현무</b>이', '<b>현무</b>가']]);
	const formation = en.blocks.find((b) => b.kind === 'formation');
	const unit = formation.sides[0].units.find((u) => u.label === 'Black Tortoise — Liu Rengui');
	if (!unit) throw new Error('formation unit');
	unit.label = 'The Black Tortoise';
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('story.json updated');
