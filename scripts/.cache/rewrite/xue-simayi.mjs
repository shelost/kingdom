/**
 * Xue Rengui's ji thread (Four Dragons → Final Ford) and the new "Sima Yi" episode (238, Xiangping).
 * Run once: `node scripts/.cache/rewrite/xue-simayi.mjs` (`DRY=1` to test). Each patch checks a marker and skips if done.
 */
import { editStory, find } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const CARD = (person, caption, ko) => ({ kind: 'card', person, caption, ko });
const closing = (en, ko) => P(`<b>${en}</b>`, `<b>${ko}</b>`);

const CHIPS = { simayi: '#4a4f63', gongsunyuan: '#a08040', wangqi: '#6b8fa3', chusuiliang: '#5b6b7a', dongchun: '#C30000' };

function helpers(story) {
	const all = story.flatMap((c) => c.entries.map((e) => ({ e, ch: c.id })));
	const ep = (ch, title) => {
		const hit = all.find((x) => x.ch === ch && x.e.title === title);
		if (!hit) throw new Error(`no entry ${ch} › ${title}`);
		return hit.e;
	};
	const chips = { ...CHIPS };
	for (const { e } of all)
		for (const b of e.blocks) if (b.kind === 'dialogue' && b.chip) chips[b.person ?? b.speaker] ??= b.chip;
	const D = (person, en, ko, zh, zhLatn) => ({
		kind: 'dialogue',
		chip: chips[person] ?? '#8a8a94',
		person,
		lines: ko,
		en,
		...(zh ? { zh, zhLatn } : {})
	});
	const S = (speaker, en, ko, zh, zhLatn) => ({
		kind: 'dialogue',
		speaker,
		chip: chips[speaker] ?? '#8d8d95',
		lines: ko,
		en,
		...(zh ? { zh, zhLatn } : {})
	});
	/** Index of the one top-level block containing `frag`. */
	const at = (e, frag, pred) => {
		const hits = find(e, frag, pred).filter((h) => h.list === e.blocks);
		if (hits.length !== 1) throw new Error(`${e.title}: ${hits.length} hits for "${frag}"`);
		return hits[0].i;
	};
	const anchor = (e, id, frag) => {
		const im = e.images.find((i) => i.id === id);
		if (!im) throw new Error(`no image ${id}`);
		im.at = frag;
	};
	return { ep, D, S, at, anchor };
}

const has = (e, frag) => JSON.stringify(e.blocks).includes(frag);

/** `DRY=1` runs every patch against a fresh load and saves nothing. */
const edit = (name, fn) =>
	editStory((s) => {
		const r = fn(s);
		console.log(name, r === false ? 'skip' : 'ok');
		return process.env.DRY ? false : r;
	});

/* ───────────────────────── Four Dragons: Longmen field ───────────────────────── */
edit('Four Dragons', (story) => {
	const { ep, D, at, anchor } = helpers(story);
	const e = ep('seventh-invasion', 'Four Dragons');
	if (has(e, 'Four winters of eggs')) return false;

	const shed = at(e, 'The ji is in the shed.');
	e.blocks.splice(
		shed,
		1,
		D(
			'xuerengui',
			['A ji.', 'Liu, we don’t own a ji. We own a hoe and half an ox.', 'Father sold Grandfather’s ji the winter I was born. For seed.'],
			['극이라.', '유씨, 우리 집엔 극 같은 거 없어. 호미 하나에 소 반 마리지.', '할아버지 극은 내가 나던 겨울에 아버지가 팔았어. 씨앗 값으로.'],
			['戟。', '柳氏，咱家哪有戟。只有一把鋤，半頭牛。', '爺爺的戟，我出生那年冬天，爹賣了。換種子。'],
			['Jǐ.', 'Liǔ shì, zán jiā nǎ yǒu jǐ. Zhǐ yǒu yì bǎ chú, bàn tóu niú.', 'Yéye de jǐ, wǒ chūshēng nà nián dōngtiān, diē mài le. Huàn zhǒngzi.']
		),
		P(
			'Liu goes into the hut without a word. She comes back with something long, wrapped in oiled hemp, and lays it across his arms. It is heavier than a hoe.',
			'유씨는 말없이 흙집으로 들어간다. 기름 먹인 삼베에 싼 긴 것을 들고 나와 그의 두 팔에 얹는다. 호미보다 무겁다.'
		),
		P(
			'Under the hemp is an old ji. Dark iron, a side blade nicked in somebody else’s war, new cord bound over old wood.',
			'삼베 안에는 낡은 극이 있다. 검게 삭은 쇠, 누군가의 옛 전쟁에서 이가 빠진 곁날, 묵은 나무 자루에 새로 감은 끈.'
		),
		D(
			'xuerengui',
			['…Where did you—', 'This is— Liu, this is his.'],
			['…이걸 어디서—', '이거— 유씨, 이거 할아버지 거잖아.'],
			['……你從哪兒——', '這是——柳氏，這是爺爺的。'],
			['……Nǐ cóng nǎr——', 'Zhè shì——Liǔ shì, zhè shì yéye de.']
		),
		D(
			'xueliu',
			['From the house your father sold it to. The son had it. He didn’t even know what it was.', 'Eggs. Four winters of eggs.', 'You kept asking why we never had any.'],
			['아버님이 팔았던 집에서요. 그 집 아들이 갖고 있더라고요. 뭔지도 모르고.', '달걀이요. 네 해 겨울 치 달걀.', '왜 우리 집엔 달걀이 없냐고 당신 맨날 물었잖아요.'],
			['從你爹賣給的那家。他兒子收著，連是什麼都不知道。', '雞蛋。攢了四個冬天的雞蛋。', '你老問咱家怎麼總沒雞蛋。'],
			['Cóng nǐ diē mài gěi de nà jiā. Tā érzi shōuzhe, lián shì shénme dōu bù zhīdào.', 'Jīdàn. Zǎn le sì ge dōngtiān de jīdàn.', 'Nǐ lǎo wèn zán jiā zěnme zǒng méi jīdàn.']
		),
		P(
			'Six fathers back, a Xue rode for kings with a weapon like this. The family still tells it, in the voice people keep for stories they stopped believing. Liu believed it. She has oiled that blade every new moon behind the millet jars, and he never once asked about the smell.',
			'여섯 대 위에, 설씨 하나가 이런 극을 들고 임금들을 위해 말을 달렸다. 집안은 아직도 그 이야기를 한다. 더는 믿지 않는 이야기를 할 때의 말투로. 유씨는 믿었다. 그녀는 초하루마다 조 항아리 뒤에서 그 날에 기름을 먹였고, 그는 그 냄새가 뭐냐고 한 번도 묻지 않았다.'
		),
		D(
			'xuerengui',
			['…It’s lighter than I thought.', 'No. Heavier.', 'Liu. If I go — this door.'],
			['…생각보다 가볍네.', '아니. 무겁다.', '유씨. 내가 가면 — 이 문은.'],
			['……比我想的輕。', '不。重。', '柳氏。我要是走了——這門。'],
			['……Bǐ wǒ xiǎng de qīng.', 'Bù. Zhòng.', 'Liǔ shì. Wǒ yàoshi zǒu le——zhè mén.']
		)
	);
	anchor(e, 'scene-xue-lady-liu-3', 'It’s lighter than I thought');

	e.blocks.splice(
		-1,
		1,
		closing(
			'Yodong has never opened its gates to the West. Except once, four hundred years ago, for a very patient man…!',
			'요동성은 서쪽에 문을 열어 준 적이 없다. 딱 한 번, 사백 년 전, 아주 참을성 많은 사내에게만 빼고…!'
		)
	);
});

/* ───────────────────────── Stallion Mountain: the gift ───────────────────────── */
edit('Stallion Mountain', (story) => {
	const { ep, D, S, at } = helpers(story);
	const e = ep('seventh-invasion', 'Stallion Mountain');
	if (has(e, 'fangtian huaji')) return false;

	const charge = e.blocks[at(e, 'decides the field needs a mark')];
	charge.html = charge.html.replace('takes up the <b>fangtian ji</b>,', 'takes up his grandfather’s old <b>ji</b>, the one his wife bought back with eggs,');
	charge.ko = charge.ko.replace('<b>방천화극</b>을 들어,', '아내가 달걀로 되사 온 할아버지의 낡은 <b>극</b>을 들고,');
	if (!charge.html.includes('bought back') || !charge.ko.includes('달걀')) throw new Error('charge text not patched');

	const humble = at(e, 'This ji only widened');
	e.blocks.splice(
		humble + 1,
		0,
		P(
			'The emperor looks at the ji longer than at the man. New cord over old wood. A blade sharpened so many times it has gone thin as a leaf.',
			'황제는 사내보다 극을 더 오래 본다. 묵은 나무에 감은 새 끈. 하도 갈아서 잎사귀처럼 얇아진 날.'
		),
		D(
			'taizong',
			['That ji is older than Our dynasty.', 'It has done its work. Bring him the one from the armoury.'],
			['그 극은 짐의 왕조보다 늙었구나.', '제 할 일은 다 했다. 무고에 있는 것을 가져오너라.'],
			['這戟，比朕的國還老。', '它的事做完了。把武庫那一把拿來給他。'],
			['Zhè jǐ, bǐ zhèn de guó hái lǎo.', 'Tā de shì zuò wán le. Bǎ wǔkù nà yì bǎ ná lái gěi tā.']
		),
		P(
			'The one from the armoury is a <b>fangtian huaji</b>: a painted shaft taller than a man, a spear point, and two crescent blades set back to back like a pair of moons. The tag on it says it belonged to <b>Lu Bu</b>, the best fighter of the Han’s last days and its worst son. Armoury tags say a lot of things. Nobody has swung it properly in four hundred years.',
			'무고에서 나온 것은 <b>방천화극</b>이다. 사람 키보다 긴 칠한 자루, 창끝 하나, 그리고 등을 맞댄 달 두 개처럼 붙은 초승달 날 한 쌍. 달린 꼬리표에는 <b>여포</b>의 것이라고 적혀 있다. 한나라 끝물에 가장 잘 싸운 사내이자, 가장 못난 아들. 무고의 꼬리표는 별말을 다 한다. 사백 년 동안 이걸 제대로 휘두른 사람은 없었다.'
		),
		D(
			'taizong',
			['The man who carried this killed two fathers, and lost anyway.', 'Let it learn some manners in a house that buries its own.'],
			['이것을 들던 자는 아비를 둘이나 죽이고도 졌다.', '제 조상을 묻을 줄 아는 집에서 예의를 좀 배우게 하거라.'],
			['持此戟者，弒了兩個父親，還是敗了。', '讓它到一個肯葬祖先的人家，學學規矩。'],
			['Chí cǐ jǐ zhě, shì le liǎng ge fùqīn, háishì bài le.', 'Ràng tā dào yí ge kěn zàng zǔxiān de rénjiā, xuéxue guīju.']
		),
		D(
			'xuerengui',
			['A farmer’s house is strict, Majesty.', 'It will learn.'],
			['농가는 엄합니다, 폐하.', '배울 겁니다.'],
			['農家規矩嚴，陛下。', '它會學的。'],
			['Nóngjiā guīju yán, bìxià.', 'Tā huì xué de.']
		),
		P(
			'He swings it once to learn the weight. The horses on the picket line step back. So do two of the guards.',
			'무게를 익히려고 한 번 휘두른다. 말뚝에 맨 말들이 뒷걸음친다. 호위병 둘도 그런다.'
		),
		S(
			'🪖',
			['Did you see that?', 'That’s Lu Bu. Lu Bu come back from the dead, I swear it.'],
			['봤어?', '여포야. 죽었던 여포가 돌아왔다니까, 진짜로.'],
			['看見沒？', '呂布。呂布還魂了，我發誓。'],
			['Kànjiàn méi?', 'Lǚ Bù. Lǚ Bù huánhún le, wǒ fāshì.']
		)
	);

	const gifts = e.blocks[at(e, 'They give him gold, silk')];
	gifts.html =
		'They give him gold, silk, a general’s title, and a place among the men who stand at the northern gate. The white coat stays. The old ji rides behind his saddle in its oiled hemp. He made it a promise.';
	gifts.ko =
		'금과 비단과 장군의 호와, 북문을 지키는 자리까지 내린다. 흰옷은 남는다. 낡은 극은 기름 먹인 삼베에 싸여 안장 뒤에 실린다. 그 극에게 한 약속이 있다.';

	const letter = e.blocks[at(e, 'Liu should buy the good stone.')];
	letter.html += ' He does not mention the halberd. She would only say she told him so.';
	letter.ko += ' 화극 얘기는 쓰지 않는다. 그러면 그녀는 내가 뭐랬냐고만 할 것이다.';

	const net = e.blocks[at(e, 'nets, numbers')];
	net.html = net.html.replace('the ji knocked from his hands', 'the halberd knocked from his hands');
	net.ko = net.ko.replace('손에서 떨어진 극', '손에서 떨어진 화극');

	const wall = at(e, 'He finds the ji on a rack');
	e.blocks[wall].ko = e.blocks[wall].ko.replace('남의 손이 묻은 극을', '남의 손이 묻은 화극을');
	e.blocks.splice(
		wall + 1,
		0,
		D(
			'goguard_a',
			['He went over the wall with that two-moon thing in one hand.', 'The Tang prisoners call him Lu Bu. I laughed at them. I’m not laughing.'],
			['달 두 개 달린 그걸 한 손에 들고 성벽을 넘었어.', '당나라 포로들이 저놈을 여포라고 부르더라. 그땐 웃었는데. 이젠 안 웃겨.']
		)
	);
});

/* ───────────────────────── Lu Bu reborn: fear in later episodes ───────────────────────── */
edit('Snake River', (story) => {
	const { ep, D, S, at } = helpers(story);
	const e = ep('final-stand', 'Snake River');
	if (has(e, 'Lu Bu')) return false;
	const i = at(e, 'The fangtian ji goes east again.');
	e.blocks.splice(
		i + 1,
		0,
		SCENE('Pyongyang', '평양'),
		S(
			'Goguryeo scout',
			['The new tiger is the one in white, Supreme Commander. From Stallion Mountain.', 'Their prisoners won’t even say his name. They say Lu Bu. Lu Bu come back.'],
			['새 호랑이는 그 흰옷입니다, 대막리지. 주필산의 그놈이요.', '포로들은 이름도 안 댑니다. 여포랍니다. 여포가 돌아왔다고요.']
		),
		D('gesomun', ['Lu Bu. Ha!', 'Lu Bu got strangled on a gate tower. Tell them we’ve got gate towers.'], ['여포? 하!', '여포는 성문 누각에서 목 졸려 뒈졌어. 우리한테도 누각은 있다고 전해.'])
	);
});

edit('Pyongyang II', (story) => {
	const { ep, S, at } = helpers(story);
	const e = ep('final-stand', 'Pyongyang II');
	if (has(e, 'Lu Bu')) return false;
	const i = at(e, 'There is no cruelty in him');
	e.blocks.splice(
		i + 1,
		0,
		S(
			'Pyongyang sentry',
			['That’s him. The white one, with the two moons on a stick.', 'My uncle was at Stallion Mountain. He says that isn’t a man. It’s Lu Bu, and Lu Bu doesn’t get tired.'],
			['저놈이다. 흰옷에, 막대기에 달 두 개 단 놈.', '우리 삼촌이 주필산에 있었거든. 저건 사람이 아니래. 여포래. 여포는 지치지도 않는대.']
		)
	);
});

edit('Letters', (story) => {
	const { ep, at } = helpers(story);
	const e = ep('silla-tang-war', 'Letters');
	if (has(e, 'Lu Bu')) return false;
	const b = e.blocks[at(e, 'a softer word here and there costs nothing')];
	b.en.splice(1, 0, 'The man who wrote it is the one in white. In the ports they say Lu Bu has come back and is sitting off our coast.');
	b.lines.splice(1, 0, '그 편지를 쓴 자가 바로 그 흰옷입니다. 포구에서는 여포가 살아 돌아와 우리 바다에 떠 있다고들 합니다.');
});

edit('Maeso', (story) => {
	const { ep, S, at } = helpers(story);
	const e = ep('silla-tang-war', 'Maeso');
	if (has(e, 'Lu Bu')) return false;
	const i = at(e, 'Wet sand. I’ll remember that.');
	e.blocks.splice(
		i + 1,
		0,
		S('Sideuk', ['General. At the bow. The one in white.', 'The Tang call him Lu Bu reborn. Our boys have heard it too.'], ['장군. 뱃머리에요. 흰옷 입은 자.', '당나라 놈들은 여포가 환생한 거라고 합니다. 우리 애들도 다 들었고요.']),
		S('Munhun', ['Then Lu Bu can get his feet wet like everybody else.', 'Lie still.'], ['그럼 여포도 남들처럼 발 좀 적시라지.', '가만 엎드려 있어.'])
	);
});

edit('Final Ford', (story) => {
	const { ep, at } = helpers(story);
	const e = ep('silla-tang-war', 'Final Ford');
	const b = e.blocks[at(e, 'I asked you to wait a little longer.')];
	if (b.en[2].includes('Grandfather')) return false;
	b.en[2] = 'I am coming home without the east. I still have Grandfather’s ji.';
	b.lines[2] = '동쪽은 못 가져갑니다. 할아버님 극은 아직 있습니다.';
	if (b.zh) {
		b.zh[2] = '東方，帶不回去了。爺爺的戟還在。';
		b.zhLatn[2] = 'Dōngfāng, dài bù huíqù le. Yéye de jǐ hái zài.';
	}
});

/* ───────────────────────── Sima Yi (238) ───────────────────────── */
edit('Sima Yi', (story) => {
	const { ep, D, S, at } = helpers(story);
	const e = ep('seventh-invasion', 'Sima Yi');
	if (has(e, 'Shut up and write')) return false;
	at(e, '(Draft in progress.)');
	const CAP = 'The captain';

	Object.assign(e, {
		tone: 'war legend — unlikely friends',
		subtitle: '사마의 (司馬懿)',
		logline: {
			en: 'A Goguryeo captain, a Wei officer who digs ditches, and an old man who has never once hurried. For one summer, they are on the same side.',
			ko: '고구려 대장 하나, 도랑 파는 위나라 장교 하나, 그리고 평생 서두른 적 없는 노인 하나. 한 여름 동안, 그들은 같은 편이다.'
		},
		badges: ['🇨🇳', 'flag:goguryeo'],
		place: 'liao',
		flash: true,
		flashback: true
	});

	e.blocks = [
		P(
			'Every emperor who marches on Liaodong thinks he is the first to have the idea. The ones who read know better, which only makes them worse.',
			'요동으로 군대를 끌고 가는 황제는 누구나 그 생각을 자기가 처음 해낸 줄 안다. 책을 읽는 황제는 아니라는 걸 안다. 그래서 더 고약하다.'
		),
		SCENE('The Liao marsh · 645', '요택 · 645'),
		P(
			'The Second Emperor reads in the mud. His tent stands on a raft of cut reeds, and every night the water comes up through the mats another finger. Chu Suiliang holds the lamp in one hand and the old record in the other, which takes practice.',
			'황제는 진흙 속에서 책을 읽는다. 장막은 베어 낸 갈대를 엮은 뗏목 위에 서 있고, 밤마다 물이 자리 밑으로 손가락 한 마디씩 차오른다. 저수량은 한 손에 등잔을, 다른 손에 옛 기록을 든다. 연습이 필요한 일이다.'
		),
		D('taizong', ['The city at the end of this mud. Who was the last man to take it?', 'Not the Sui. We know about the Sui.'], ['이 진흙 끝에 있는 저 성. 마지막으로 저 성을 떨어뜨린 자가 누구냐.', '수나라는 빼라. 수나라 얘기는 짐도 안다.']),
		D('chusuiliang', ['Sima Yi, Majesty, for Wei. It was called Xiangping then.', 'He took it from a man named Gongsun Wenyi.'], ['사마의이옵니다, 폐하. 위나라를 위해서였지요. 그때는 양평이라 불렸습니다.', '공손문의라는 자에게서 빼앗았습니다.']),
		D('taizong', ['Wenyi is a courtesy name. What was he called?'], ['문의는 자(字)가 아니냐. 본이름이 뭐였느냐.']),
		D('chusuiliang', ['…Yuan, Majesty.', 'We leave off a stroke.'], ['…연(淵)이옵니다, 폐하.', '획 하나를 뺍니다.']),
		P(
			'The emperor looks at the lamp for a while. His father’s name, again, on the wrong side of the Liao. It keeps coming up over there, like a weed in a road.',
			'황제는 한동안 등잔을 바라본다. 선황의 이름이 또 요하 건너편에 있다. 길바닥의 잡초처럼, 거기서 자꾸 돋는다.'
		),
		D('taizong', ['Read on. Leave out nothing but the name.'], ['계속 읽거라. 그 이름만 빼고 전부.']),
		D('chusuiliang', ['There is one line Your Majesty may enjoy.', 'Goguryeo sent men to help him. To help Wei, I mean. Against Liaodong.'], ['폐하께서 즐거워하실 줄이 하나 있습니다.', '고구려가 군사를 보내 도왔습니다. 위나라를요. 요동을 치는 데.']),
		{
			kind: 'quote',
			html: 'In the second year of Jingchu, the Grand Commandant Sima Xuanwang led an army against Gongsun Yuan. Gung sent a great lord, his Jubu, at the head of several thousand men to aid the army.',
			ko: '경초 2년, 태위 사마선왕이 무리를 거느리고 공손연을 치니, 궁이 주부 대가를 보내 수천 명을 거느리고 군을 돕게 하였다.',
			hanja: '景初二年，太尉司馬宣王率衆討公孫淵，宮遣主簿大加將數千人助軍。',
			source: 'Records of the Three Kingdoms (三國志) bk. 30, Book of Wei — Eastern Barbarians: Goguryeo (東夷傳 高句麗)',
			event: 'goguryeo-238',
			stance: 'differ',
			claim: 'How many men did Goguryeo send?',
			claimKo: '고구려는 몇 명을 보냈는가?'
		},
		{
			kind: 'quote',
			html: 'Twelfth year. The Grand Tutor of Wei, Sima Xuanwang, led an army against Gongsun Yuan. The king sent a great lord, his Jubu, at the head of a thousand soldiers to help him.',
			ko: '12년, 위나라 태부 사마선왕이 무리를 거느리고 공손연을 치니, 왕이 주부 대가를 보내 군사 천 명을 거느리고 돕게 하였다.',
			hanja: '十二年，魏太傅司馬宣王率衆討公孫淵，王遣主簿大加將兵千人助之。',
			source: 'Samguk Sagi (三國史記) bk. 17, Goguryeo Annals — King Dongcheon, yr. 12 (238)',
			event: 'goguryeo-238'
		},
		D('chusuiliang', ['Our record says several thousand. Theirs says one thousand.', 'For once, we are the generous ones.'], ['우리 기록은 수천이라 하고, 저쪽 기록은 천이라 합니다.', '이번만은 우리 쪽이 후합니다.']),
		D('taizong', ['So Goryeo has marched beside the Middle Kingdom before.', 'It never seems to take.'], ['그러니 고려가 중원과 나란히 행군한 적도 있었구나.', '어째 오래가는 법이 없군.']),
		P(
			'Three years from now he will write Sima Yi’s verdict for the official history, in his own hand. Tonight he only wants to know how long it took.',
			'삼 년 뒤, 그는 정사에 실릴 사마의의 평을 제 손으로 쓰게 된다. 오늘 밤 그가 알고 싶은 건 하나뿐이다. 얼마나 걸렸느냐.'
		),

		SCENE('Hwando · 238', '환도 · 238'),
		{
			kind: 'map',
			year: 238,
			places: ['hwando', 'liao', 'yodong'],
			caption: 'Wei in the west, Goguryeo in the hills, and in between a lord who has started calling himself a king.',
			ko: '서쪽엔 위, 산속엔 고구려, 그리고 그 사이엔 스스로를 왕이라 부르기 시작한 영주 하나.'
		},
		P(
			'Four hundred years earlier, in a mountain capital that smells of pine smoke, a young king is reading a letter from Wei and enjoying it.',
			'사백 년 전, 소나무 연기 냄새가 나는 산성 도읍에서, 젊은 임금 하나가 위나라에서 온 편지를 읽으며 즐거워하고 있다.'
		),
		CARD('dongchun', 'Young, proud, and fond of any war he can win from the saddle. So far, that has been all of them.', '젊고, 콧대 높고, 말 위에서 이길 수 있는 전쟁이라면 다 좋아한다. 지금까지는 전부 그랬다.'),
		P(
			'The letter says Wei is marching on the lord of Liaodong, who has lately started calling himself a king. Wei would welcome friends.',
			'편지에 따르면 위나라가 요동의 영주를 치러 간다. 그 영주는 요즘 들어 스스로를 왕이라 부르기 시작했다. 위나라는 벗이 생기면 반갑겠다고 한다.'
		),
		D(
			'dongchun',
			['He sends us silk every spring and spies every autumn.', 'Wei is a thousand li away. He’s next door.', 'Help the far one kill the near one. Who wants to go and watch?'],
			['그자는 봄마다 비단을 보내고, 가을마다 첩자를 보낸다.', '위는 천 리 밖이고, 그자는 바로 옆집이야.', '먼 놈을 도와서 가까운 놈을 치자. 누가 가서 구경하고 올 테냐?']
		),
		P(
			'A thousand riders go. An old lord with a long title leads them, and would rather be hunting. Behind him rides a young captain who would rather be wherever the fighting is.',
			'기병 천이 간다. 긴 직함을 단 늙은 귀족이 이끄는데, 그는 차라리 사냥이나 갔으면 한다. 그 뒤에 젊은 대장 하나가 따른다. 그는 싸움이 있는 곳이면 어디든 가고 싶다.'
		),
		S(CAP, ['Majesty. How long do we stay?'], ['전하. 얼마나 있다 오면 됩니까?']),
		D('dongchun', ['Until the city falls. Then come home and tell me how Wei fights.', 'Look at everything.'], ['성이 떨어질 때까지. 그다음 돌아와서 위놈들이 어떻게 싸우는지 말해 다오.', '전부 봐 둬라.']),

		SCENE('The Liao · summer', '요하 · 여름'),
		P(
			'The Wei camp is the first thing the captain has ever seen that is bigger than a mountain and flatter than a lake. Forty thousand men, and every one of them is digging.',
			'위나라 진영은 대장이 난생처음 보는 것이다. 산보다 크고 호수보다 평평하다. 사만 명이 있고, 그 하나하나가 땅을 파고 있다.'
		),
		CARD('wangqi', 'A Wei officer from the coast. He misses the sea, talks to anyone, and digs better than he rides.', '바닷가 출신의 위나라 장교. 바다를 그리워하고, 아무하고나 말을 트고, 말 타는 것보다 땅 파는 걸 더 잘한다.'),
		P(
			'The officer in charge of the ditch is called <b>Wang Qi</b>. He picked up forty words of Goguryeo from horse traders, most of them prices. The captain has about forty words of Han. It turns out to be enough for most things.',
			'도랑을 맡은 장교의 이름은 <b>왕기</b>다. 말장수들한테서 고구려 말을 마흔 마디쯤 주워들었는데, 대부분 값 부르는 말이다. 대장도 한나라 말을 마흔 마디쯤 안다. 웬만한 일엔 그걸로 충분하다는 게 밝혀진다.'
		),
		S(CAP, ['You came all this way to dig?', 'In Goguryeo we ride at a thing until it’s dead.'], ['여기까지 와서 땅을 파?', '고구려에선 뭐든 죽을 때까지 말 타고 들이받아.']),
		D('wangqi', ['And when it doesn’t die?'], ['안 죽으면?']),
		S(CAP, ['Everything dies if you ride at it long enough.'], ['오래 들이받으면 다 죽어.']),
		D('wangqi', ['Sure. Sometimes it’s the horse.', 'Here, hold this end. What’s your name?'], ['그렇지. 가끔은 말이 죽어서 그렇지.', '자, 이쪽 끝 좀 잡아. 이름이 뭐야?']),
		S(CAP, ['You’ll forget it. You Han forget anything you don’t write down.'], ['어차피 까먹을걸. 너네 한족은 안 적어 두면 다 까먹잖아.']),
		D('wangqi', ['Then I’ll write it down.'], ['그럼 적어 두지 뭐.']),
		S(CAP, ['Then you’ll lose the paper.'], ['그럼 종이를 잃어버리겠지.']),
		P(
			'One Wei officer does not dig. He is the governor of the province, a stiff man who tried this same war last summer and drowned it in rain. He spends a whole morning at the Goguryeo horse lines with his hands behind his back.',
			'땅을 파지 않는 위나라 장교가 하나 있다. 이 고을의 자사다. 뻣뻣한 사내로, 지난여름 똑같은 전쟁을 벌였다가 빗속에 빠뜨렸다. 그는 아침나절 내내 뒷짐을 지고 고구려 말들이 매인 줄 앞에 서 있다.'
		),
		S(CAP, ['Why is that one counting our horses?'], ['저 사람은 왜 우리 말을 세고 있어?']),
		D('wangqi', ['He counts everything. He lost last year.', 'Now he counts.'], ['저 양반은 뭐든 세. 작년에 졌거든.', '그 뒤로 세.']),
		P(
			'Across the river, the lord of Liaodong has built twenty li of earthworks and is waiting behind them. The Wei commander looks at them for one afternoon. That night he leaves his banners standing in the south, crosses in the north, and walks straight past the earthworks toward the city behind them. The men behind the earthworks find they are guarding nothing. They run home. He beats them three times on the way.',
			'강 건너에서 요동의 영주는 이십 리에 걸쳐 흙성을 쌓고 그 뒤에서 기다린다. 위나라 총대장은 그것을 오후 한나절 바라본다. 그날 밤 그는 남쪽에 깃발을 세워 둔 채 북쪽에서 강을 건너, 흙성을 그냥 지나쳐 그 뒤의 성으로 곧장 걸어간다. 흙성 뒤의 사내들은 자기들이 아무것도 지키고 있지 않다는 걸 깨닫는다. 그들은 집으로 달아난다. 그는 가는 길에 그들을 세 번 깬다.'
		),
		CARD('simayi', 'Fifty-nine years old, and he has never once been in a hurry. Wei has learned to find that frightening.', '쉰아홉. 평생 한 번도 서두른 적이 없다. 위나라는 그게 무섭다는 걸 배웠다.'),
		S(CAP, ['Grand Commandant. They’ve run back inside their walls.', 'Shouldn’t we be chasing them?'], ['태위님. 놈들이 성안으로 도로 달아났습니다.', '쫓아가야 하지 않습니까?']),
		D(
			'simayi',
			['Why? He has gone exactly where I wanted him.', 'A man who runs is hard to catch. A man who sits in a city has already been caught.', 'He simply hasn’t been told.'],
			['왜? 내가 바라던 곳으로 제 발로 갔는데.', '달아나는 자는 잡기 어렵네. 성에 들어앉은 자는 이미 잡힌 것이고.', '아직 그 말을 못 들었을 뿐이지.']
		),
		P(
			'The captain has never heard a general talk about a war as if it were already over. He doesn’t like it. He can’t stop listening.',
			'대장은 전쟁을 이미 끝난 일처럼 말하는 장수를 처음 본다. 마음에 들지 않는다. 그런데도 귀를 뗄 수가 없다.'
		),

		SCENE('Xiangping · the rains', '양평 · 장마'),
		P(
			'The city sits on the plain where the river bends. Four hundred years from now it will have a Goguryeo name, and a shrine with a god’s armour in it. For now it has a self-made king.',
			'성은 강이 휘도는 들판에 앉아 있다. 사백 년 뒤 이 성은 고구려 이름을 얻고, 신의 갑옷이 걸린 사당도 갖게 된다. 지금은 스스로 왕이 된 사내 하나를 갖고 있다.'
		),
		P(
			'Then it rains. It rains for a month. The river comes over its banks, and the plain where Wei is camped turns into a lake a few feet deep, with forty thousand men standing in it.',
			'그리고 비가 온다. 한 달 내내 온다. 강물이 둑을 넘고, 위나라가 진을 친 들판은 몇 자 깊이의 호수가 된다. 그 안에 사만 명이 서 있다.'
		),
		P(
			'Inside the walls, the lord of Liaodong is delighted. The record in the emperor’s tent calls him Wenyi. This story is not in the emperor’s tent.',
			'성안에서 요동의 영주는 신이 났다. 황제의 장막에 있는 기록은 그를 문의라 부른다. 이 이야기는 황제의 장막 안에 있지 않다.'
		),
		CARD('gongsunyuan', 'Lord of Liaodong, King of Yan, and a friend to anyone who could help him. He has run out of anyone.', '요동의 영주, 연나라의 왕, 그리고 자기를 도울 수 있는 자라면 누구의 벗이든 되었던 사내. 이제 그 누구가 다 떨어졌다.'),
		D(
			'gongsunyuan',
			['Look at them. Standing in the lake like herons.', 'Heaven has always liked me. Send the cattle out to graze. Let them watch us eat.'],
			['저것 좀 봐라. 호수에 선 왜가리 떼 같구나.', '하늘은 늘 나를 좋아했지. 소를 내보내 풀을 먹여라. 우리가 먹는 꼴을 구경이나 하라고.']
		),
		P(
			'So the cattle graze in full view of the Wei lines, and men from the city cut firewood under the walls. The Goguryeo riders sit their horses in the water and watch dinner walk past.',
			'그래서 소들은 위나라 진영이 다 보는 앞에서 풀을 뜯고, 성안 사내들은 성벽 아래서 땔감을 벤다. 고구려 기병들은 물속에 말을 세운 채 저녁거리가 지나가는 걸 바라본다.'
		),
		S(CAP, ['Two hundred head. In the open.', 'Give me fifty riders and I’ll bring you dinner.'], ['이백 마리야. 훤히 드러나 있다고.', '기병 쉰만 줘 봐. 저녁 갖다 바칠 테니.']),
		D('wangqi', ['Nobody moves. The old man said.'], ['아무도 안 움직여. 영감님 명이야.']),
		P(
			'A Wei officer asks to move the camp to higher ground. The old man has him beheaded that afternoon. Nobody asks again. The captain watches the head go up on a pole above the water.',
			'위나라 장교 하나가 진을 높은 데로 옮기자고 청한다. 영감은 그날 오후 그의 목을 벤다. 다시 묻는 자는 없다. 대장은 그 머리가 물 위 장대에 걸리는 것을 지켜본다.'
		),
		S(CAP, ['He killed a man for wanting dry feet.'], ['발 좀 말리고 싶다는 사람을 죽였어.']),
		D('wangqi', ['He killed a man for saying so out loud.', 'The rest of us want dry feet very quietly.'], ['그걸 입 밖에 냈다고 죽인 거야.', '나머지는 다들 아주 조용히 발 말리고 싶어 하지.']),
		P(
			'The captain goes to the old man’s tent himself. Goguryeo is an ally, and allies may ask. The guards aren’t sure about that, and let him in to find out.',
			'대장은 직접 영감의 장막으로 간다. 고구려는 동맹이고, 동맹은 물어볼 수 있다. 호위병들은 그게 맞는지 몰라서, 알아보라고 그를 들여보낸다.'
		),
		S(CAP, ['Grand Commandant. The cattle. We could have them by dark.'], ['태위님. 저 소들 말입니다. 해 지기 전에 다 끌고 올 수 있습니다.']),
		D('simayi', ['I know.', 'In your hills, when you hunt deer in the rain, do you chase them?'], ['알고 있네.', '자네 산에서 비 오는 날 사슴을 잡을 때, 쫓아가나?']),
		S(CAP, ['…No. They’re faster in the mud than we are.'], ['…아뇨. 진창에선 놈들이 우리보다 빠르니까요.']),
		D('simayi', ['So is a frightened city.'], ['겁먹은 성도 그렇다네.']),
		S(CAP, ['They don’t look frightened. They look like they’re having a picnic.'], ['겁먹은 꼴이 아닌데요. 무슨 소풍 나온 것 같습니다.']),
		D(
			'simayi',
			['Good. A man at a picnic doesn’t run.', 'They are many and hungry. We are few and fed. Let them think the rain is on their side.'],
			['좋지. 소풍 나온 자는 도망가지 않아.', '저쪽은 많고 굶주렸고, 우리는 적고 배부르네. 비가 제 편이라고 믿게 두게.']
		),
		D(
			'simayi',
			['You ride well. Do you look at the ground as well as you ride?', 'When the water goes down, which part of this plain dries first?'],
			['자네 말은 잘 타더군. 땅도 그만큼 잘 보나?', '물이 빠지면, 이 들판에서 어디가 먼저 마르겠나?']
		),
		S(CAP, ['…I don’t know.'], ['…모르겠습니다.']),
		D('simayi', ['Then that is what you are for, this month. Go and find out.'], ['그럼 이번 달 자네 일은 그걸세. 가서 알아 오게.']),
		P(
			'So for the rest of the rain, a Goguryeo captain rides around a besieged city in water up to his horse’s knees, poking the ground with a spear butt like a farmer deciding when to plant. Wang Qi rides with him, complaining, and draws a map in charcoal on a board. The south-east dries first. Under the water there is a spine of gravel, running down to the little river behind the city.',
			'그래서 남은 장마 내내, 고구려 대장 하나가 말 무릎까지 차는 물속을 헤치며 포위된 성 둘레를 돈다. 씨 뿌릴 때를 가늠하는 농부처럼 창 자루 끝으로 땅을 찔러 본다. 왕기가 투덜대며 따라다니고, 판자에 숯으로 지도를 그린다. 동남쪽이 먼저 마른다. 물 밑으로 자갈 등성이가 하나, 성 뒤의 작은 강까지 뻗어 있다.'
		),
		D('wangqi', ['You know you’re the only cavalryman in the world doing this.'], ['이런 짓 하는 기병은 세상에 너 하나뿐인 거 알지?']),
		S(CAP, ['Shut up and write. South-east. Firm.'], ['닥치고 적기나 해. 동남쪽. 단단함.']),

		SCENE('Xiangping · the rain stops', '양평 · 비가 그치다'),
		P(
			'The rain stops. Within a week the Wei have earth ramps against the walls, ladders, rams, and engines that throw stones over the parapet. They shoot day and night. Inside, the grain runs out. Then the cattle. Then people start to go missing, and nobody asks where.',
			'비가 그친다. 한 주 만에 위나라는 성벽에 흙산을 붙이고, 사다리와 충차와, 성가퀴 너머로 돌을 날리는 투석기를 세운다. 밤낮없이 쏜다. 성안에서는 곡식이 떨어진다. 그다음엔 소가. 그다음엔 사람들이 하나둘 사라지기 시작하고, 아무도 어디 갔냐고 묻지 않는다.'
		),
		P(
			'One night the captain and Wang Qi are on watch on the south-east gravel when the sky does something.',
			'어느 밤, 대장과 왕기가 동남쪽 자갈밭에서 불침번을 서고 있는데 하늘에서 무슨 일이 벌어진다.'
		),
		D('wangqi', ['Look— look up—'], ['저기— 위에 봐—']),
		P(
			'A long white star with a tail like a horse’s mane crosses over the city and drops into the little river behind it. Right where the gravel runs down to the water.',
			'말갈기 같은 꼬리를 단 길고 흰 별 하나가 성 위를 가로질러, 성 뒤의 작은 강으로 떨어진다. 바로 자갈 등성이가 물에 닿는 그 자리로.'
		),
		S(CAP, ['…That’s our gravel.'], ['…저거 우리 자갈밭인데.']),
		D('wangqi', ['That’s his grave. My grandmother would say so.', 'She’d also say don’t point at it.'], ['저건 그놈 무덤이야. 우리 할머니라면 그랬을걸.', '손가락질하지 말라고도 했을 거고.']),
		P('Inside the walls, everyone saw it. Nobody sleeps.', '성안에서도 다들 봤다. 아무도 잠들지 못한다.'),
		P(
			'In the morning two old ministers come out under a white flag. Lift the siege, they say, step back a little, and the king will come out bound. The old man has them both beheaded, and sends word that they were clearly too old and must have muddled the message. A younger envoy comes, offering a son as hostage. The old man sends him home with a list.',
			'아침에 늙은 대신 둘이 흰 깃발을 들고 나온다. 포위를 풀고 조금만 물러나 주면, 왕이 스스로 묶고 나오겠다고 한다. 영감은 둘의 목을 다 베고, 너무 늙어서 말을 잘못 전한 모양이라고 전갈을 보낸다. 더 젊은 사신이 아들을 볼모로 보내겠다며 온다. 영감은 그를 목록 하나와 함께 돌려보낸다.'
		),
		{
			kind: 'quote',
			html: 'The great essentials of war are five. If you can fight, fight. If you cannot fight, defend. If you cannot defend, run. The two that remain are only surrender and death. You will not come out bound, so you have chosen death. There is no need to send a hostage.',
			ko: '군사의 큰 요체는 다섯이다. 싸울 수 있으면 싸우고, 싸울 수 없으면 지키고, 지킬 수 없으면 달아나는 것이다. 남은 두 가지는 항복과 죽음뿐이다. 네가 스스로 결박하고 나오려 하지 않으니, 이는 죽기로 작정한 것이다. 볼모는 보낼 필요 없다.',
			hanja: '軍事大要有五，能戰當戰，不能戰當守，不能守當走，餘二事惟有降與死耳。汝不肯面縛，此為決就死也，不須送任。',
			source: 'Jin Shu (晉書) bk. 1, Annals of Emperor Xuan (宣帝紀) — Jingchu 2 (238), to Gongsun Yuan’s envoy',
			person: 'simayi'
		},
		D(
			'gongsunyuan',
			['A list.', 'He sends me a list, like a grain merchant.', 'Saddle the horses. Whichever ones are still horses.'],
			['목록이라.', '쌀장수처럼 목록을 보내는구나.', '말에 안장을 얹어라. 아직 말인 놈들한테만.']
		),

		SCENE('The Liang River', '양수'),
		P(
			'He breaks out at night through the southern lines, with his son and a few hundred riders, and turns south-east. Of course he does. It’s the only ground that will hold a horse.',
			'그는 밤에 아들과 기병 몇백을 데리고 남쪽 포위를 뚫고 나와 동남쪽으로 꺾는다. 당연하다. 말을 버텨 주는 땅은 거기뿐이니까.'
		),
		P('The Goguryeo thousand are already sitting on it.', '고구려 기병 천이 이미 거기 앉아 있다.'),
		S(CAP, ['Told you. Firm.'], ['거봐. 단단하다니까.']),
		D('wangqi', ['You told a board. I wrote it.'], ['판자한테 말한 거지. 적은 건 나고.']),
		P(
			'It isn’t much of a fight. The lord’s riders are starved, and their horses are worse. The captain’s arrow takes the king’s horse at the water’s edge, about where the star went in. The King of Yan goes into the shallows on his hands and knees and comes up muddy to the eyes, still in silk.',
			'싸움이랄 것도 없다. 영주의 기병들은 굶주렸고, 말들은 더 굶주렸다. 대장의 화살이 물가에서 왕의 말을 꿰뚫는다. 별이 떨어진 바로 그 언저리다. 연나라 왕은 네 발로 얕은 물에 처박혔다가, 눈까지 진흙을 뒤집어쓰고 일어난다. 여전히 비단 차림이다.'
		),
		D(
			'gongsunyuan',
			['Goguryeo! You’re— you’re Goguryeo, aren’t you? Look at your hat.', 'Listen to me. Listen. I’m your neighbour.'],
			['고구려! 너— 너 고구려지? 그 모자 보니 알겠다.', '내 말 들어. 들어 봐. 난 너희 이웃이다.']
		),
		S(CAP, ['You send us spies.'], ['우리한테 첩자를 보내잖아.']),
		D(
			'gongsunyuan',
			['I send everyone spies! That’s what neighbours are for!', 'Think, boy. Kill me tonight, and tomorrow who’s your neighbour?', 'Them.'],
			['난 누구한테나 첩자를 보내! 이웃이 원래 그런 거다!', '생각해 봐라, 이놈아. 오늘 밤 날 죽이면, 내일 너희 이웃은 누구냐?', '저놈들이다.']
		),
		P(
			'The captain’s bow stays half drawn. He looks up the gravel at the Wei banners coming down it, and for one breath he does the arithmetic.',
			'대장의 활이 반쯤 당겨진 채 멈춘다. 그는 자갈 등성이를 따라 내려오는 위나라 깃발들을 올려다본다. 그리고 한 호흡 동안 셈을 한다.'
		),
		P(
			'Wang Qi doesn’t do any arithmetic. His spear goes in under the silk. The Wei riders find the son a little further up the bank.',
			'왕기는 셈 같은 건 하지 않는다. 그의 창이 비단 밑으로 들어간다. 위나라 기병들이 조금 더 올라간 둑에서 아들을 찾아낸다.'
		),
		S(CAP, ['He was talking.'], ['말하고 있었잖아.']),
		D('wangqi', ['That’s why.'], ['그러니까.']),

		SCENE('Xiangping · after', '양평 · 그 뒤'),
		P(
			'The old man enters the city the next day and sorts it like a clerk sorting grain. Every man over fifteen is walked out onto the plain. Seven thousand. The heads go into a mound by the gate, so that anyone coming down the western road will understand. The officials who served the King of Yan are killed. The ones he locked up for disagreeing with him are let out, with apologies.',
			'이튿날 영감은 성에 들어가 곡식 고르는 아전처럼 성을 골라낸다. 열다섯 넘은 사내는 모두 들판으로 끌려 나간다. 칠천 명. 머리들은 성문 옆에 무덤처럼 쌓인다. 서쪽 길로 오는 자라면 누구든 알아보라고. 연나라 왕을 섬긴 관리들은 죽는다. 왕에게 맞섰다가 갇혀 있던 자들은 사과와 함께 풀려난다.'
		),
		P('It turns cold early that year. Some Wei soldiers come to the old man’s tent about coats.', '그해엔 추위가 일찍 온다. 위나라 병사 몇이 솜옷 얘기로 영감의 장막을 찾아온다.'),
		S('Wei soldier', ['Grand Commandant. The stores are full of padded coats.', 'We’re freezing out there.'], ['태위 나리. 창고에 솜옷이 가득합니다.', '밖에서 얼어 죽겠습니다요.']),
		D('simayi', ['The stores belong to the state.', 'So does the cold, this year. Bear it for the state.'], ['창고는 나라의 것이다.', '올해는 추위도 나라의 것이다. 나라를 위해 견뎌라.']),
		P(
			'The captain stands at the mound for a long time. He has killed men. He has never seen them stacked.',
			'대장은 그 머리 무덤 앞에 오래 서 있다. 사람을 죽여 본 적은 있다. 쌓아 놓은 건 처음 본다.'
		),
		S(CAP, ['In Goguryeo we’d have burned the gate and gone home.'], ['고구려였으면 성문 태우고 그냥 집에 갔을 거야.']),
		D('wangqi', ['In Goguryeo you’d still be out there in the lake. Three years.'], ['고구려였으면 넌 아직도 저 호수에 서 있을걸. 삼 년은.']),
		S(CAP, ['…Maybe.'], ['…그럴지도.']),

		SCENE('The Liao ford · autumn', '요하 나루 · 가을'),
		P(
			'The thousand go home before the first snow. Wang Qi rides with them as far as the ford, which he is not supposed to do.',
			'첫눈 전에 고구려 기병 천이 돌아간다. 왕기는 나루까지 따라 나온다. 그래선 안 되는 일이다.'
		),
		P(
			'At the water the captain pulls off his own coat, a Goguryeo riding coat with the fur turned in, and throws it at him.',
			'물가에서 대장이 제 옷을 벗는다. 털을 안으로 댄 고구려의 말 탈 때 입는 옷이다. 그걸 왕기에게 던진다.'
		),
		D('wangqi', ['I can’t take that. That’s—'], ['이건 못 받아. 이건—']),
		S(CAP, ['It’s mine. In Goguryeo a coat belongs to whoever’s cold.', 'Tell your old man.'], ['내 거야. 고구려에선 옷은 추운 놈 거야.', '너네 영감한테도 전해.']),
		D('wangqi', ['…Your name. Come on. You owe me a name. I dug you a ditch.'], ['…이름. 야, 좀. 이름 하나는 빚졌잖아. 도랑도 파 줬는데.']),
		P(
			'So the captain tells him. Wang Qi says it over twice to be sure, grins, and doesn’t write it down. Men don’t write down their friends’ names. They think they’ll remember.',
			'그래서 대장은 이름을 말해 준다. 왕기는 확실히 하려고 두 번 따라 하고, 씩 웃고, 적어 두지 않는다. 사내들은 친구 이름을 적어 두지 않는다. 기억할 줄 안다.'
		),
		D('wangqi', ['Look at the ground first. Always. The old man was right about that, at least.'], ['땅부터 봐. 언제나. 영감이 그거 하나는 맞았어.']),
		S(CAP, ['And you learn to ride. You sit a horse like a sack of millet.'], ['넌 말이나 좀 배워. 조 자루 얹어 놓은 것처럼 타더라.']),

		SCENE('Hwando · winter', '환도 · 겨울'),
		P(
			'Wei sends the king presents and a very polite letter. The king likes both. He has the captain brought in to report.',
			'위나라가 임금에게 선물과 아주 정중한 편지를 보낸다. 임금은 둘 다 마음에 든다. 그는 대장을 불러 보고를 듣는다.'
		),
		D('dongchun', ['So. How does Wei fight?'], ['그래. 위놈들은 어떻게 싸우더냐?']),
		S(
			CAP,
			['Slowly, Majesty. They looked at the ground for a month before they moved.', 'And they don’t run. They dig, and they sit, and they don’t run.'],
			['느리게 싸웁니다, 전하. 움직이기 전에 한 달 동안 땅만 봤습니다.', '그리고 도망을 안 갑니다. 파고, 앉아 있고, 도망을 안 갑니다.']
		),
		D('dongchun', ['Patience is for people without horses.', 'And Liaodong? Whose is it now?'], ['참을성은 말 없는 놈들이나 부리는 거다.', '요동은? 이제 누구 땅이냐?']),
		S(CAP, ['…Wei’s, Majesty. Right up to our river.'], ['…위나라 땅입니다, 전하. 우리 강 바로 앞까지.']),
		P(
			'The king laughs and calls for wine, and asks nothing else. Wei and Goguryeo now share a long fence through the hills, and both sides are very polite about it. Fences between friends are like that. For about six summers.',
			'임금은 웃으며 술을 내오라 하고, 더는 아무것도 묻지 않는다. 이제 위나라와 고구려는 산줄기를 따라 긴 울타리 하나를 같이 쓴다. 양쪽 다 그 울타리에 아주 예의 바르다. 친구 사이의 울타리란 그런 거다. 한 여섯 해쯤은.'
		),

		SCENE('The Liao marsh · 645', '요택 · 645'),
		P('Chu Suiliang rolls the scroll shut. The water has come up another finger through the mats.', '저수량이 두루마리를 만다. 물이 자리 밑으로 또 손가락 한 마디 차올랐다.'),
		D('taizong', ['And six summers later?'], ['그리고 여섯 해 뒤에는?']),
		D('chusuiliang', ['That is another scroll, Majesty.', 'It is shorter.'], ['그건 다른 두루마리이옵니다, 폐하.', '더 짧습니다.']),
		D('taizong', ['A month in the rain, for that wall.', 'We shall not need a month.'], ['저 성벽 하나에 빗속에서 한 달이라.', '짐에게는 한 달도 필요 없다.']),
		D('taizong', ['Has the Blue Dragon read this?'], ['청룡도 이걸 읽었느냐?']),
		D('chusuiliang', ['He borrowed it in the winter, Majesty.', 'He returned it with notes.'], ['겨울에 빌려 갔습니다, 폐하.', '주석을 달아서 돌려주었지요.']),
		P(
			'Somewhere out in the dark column, a farmer from Longmen is oiling an old ji by a fire, the way his wife showed him. Nobody has noticed him yet.',
			'어둠 속 행렬 어딘가에서, 용문에서 온 농부 하나가 모닥불 곁에서 낡은 극에 기름을 먹인다. 아내가 가르쳐 준 대로. 아직은 아무도 그를 눈여겨보지 않는다.'
		),
		closing('Same walls, a new name, and no ally this time. The Blue Dragon has done his reading…!', '같은 성벽, 새 이름, 이번엔 동맹도 없다. 그리고 청룡은 읽을 건 다 읽어 왔다…!')
	];
});
