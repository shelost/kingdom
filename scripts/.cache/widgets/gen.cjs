// node gen.cjs → writes content.json (proposals only; story.json is never touched)
const fs = require('fs');
const path = require('path');
const story = require('../../../src/lib/data/story.json');

const WS = (t) => `https://zh.wikisource.org/wiki/${t}`;
const URL = {
	sui4: WS('隋書/卷04'),
	zz181: WS('資治通鑑/卷181'),
	zz197: WS('資治通鑑/卷197'),
	zz198: WS('資治通鑑/卷198'),
	zz202: WS('資治通鑑/卷202'),
	ssg05: WS('三國史記/卷05'),
	ssg06: WS('三國史記/卷06'),
	ssg07: WS('三國史記/卷07'),
	ssg20: WS('三國史記/卷20'),
	ssg21: WS('三國史記/卷21'),
	ssg28: WS('Page:三國史記(玉山書院本)_卷第二十八.pdf/1'),
	ssg44: WS('三國史記/卷44'),
	jts84: WS('舊唐書/卷84'),
	jts199a: WS('舊唐書/卷199上'),
	xts220: WS('新唐書/卷220'),
	ns27: WS('日本書紀/卷第廿七'),
	sy2: WS('三國遺事/卷第二'),
	imsin: 'https://db.history.go.kr/ancient/level.do?levelId=gskh_003_0010_0120_0020'
};

const SRC = {
	sui4: 'Sui Shu (隋書) bk. 4, Annals of Emperor Yang (煬帝下), Daye 8 (612), first month',
	zz181: 'Zizhi Tongjian (資治通鑑) bk. 181, Sui Daye 8 (612)',
	ssg20: 'Samguk Sagi (三國史記) bk. 20, Goguryeo Annals — King Yeongyang, yr. 23 (612)',
	zz198: 'Zizhi Tongjian (資治通鑑) bk. 198, Tang Zhenguan 19 (645)',
	ssg21: 'Samguk Sagi (三國史記) bk. 21, Goguryeo Annals — King Bojang, yr. 4 (645)',
	ns27: 'Nihon Shoki (日本書紀) bk. 27, Tenji 1–2 (662–663)',
	jts84: 'Jiu Tangshu (舊唐書) bk. 84, Biography of Liu Rengui (劉仁軌)',
	xts220b: 'Xin Tangshu (新唐書) bk. 220, Eastern Barbarians — Baekje',
	ssg07letter: 'Samguk Sagi (三國史記) bk. 7, Silla Annals — King Munmu, yr. 11 (671), King Munmu’s reply to Xue Rengui',
	ssg07maeso: 'Samguk Sagi (三國史記) bk. 7, Silla Annals — King Munmu, yr. 15 (675), ninth month',
	zz202: 'Zizhi Tongjian (資治通鑑) bk. 202, Tang Gaozong, Shangyuan 2 (675), second month',
	xts220s: 'Xin Tangshu (新唐書) bk. 220, Eastern Barbarians — Silla',
	ssg28y19: (m) => `Samguk Sagi (三國史記) bk. 28, Baekje Annals — King Uija, yr. 19 (659), ${m}`,
	ssg28y20: (m) => `Samguk Sagi (三國史記) bk. 28, Baekje Annals — King Uija, yr. 20 (660)${m ? `, ${m}` : ''}`
};

const ops = [];

/* ── A. edicts ─────────────────────────────────────────────── */

ops.push({
	chapter: 'seventh-invasion',
	title: 'Colossal River',
	op: 'add',
	after: 'Emperor Yang of Sui invades Goguryeo',
	block: {
		kind: 'edict',
		title: 'Edict for the Liao campaign',
		hanja:
			'而高麗小醜，迷昏不恭，崇聚勃、碣之間，荐食遼、獩之境。……此而可忍，孰不可容！……於是親總六師，用申九伐，拯厥阽危，協從天意，殄茲逋穢，克嗣先謨。',
		html: 'And Goguryeo, that petty villain, sits lost in its own fog and shows no respect. It herds itself together between the Bo and the Jie and keeps eating into the lands of Liao and Ye. … If this can be borne, what cannot? … So We take the six armies in hand Ourselves and carry out the ninefold punishment: to pull the endangered back from the edge, to follow the will of Heaven, to wipe out this runaway filth, and to finish what Our fathers planned.',
		ko: '그런데 고구려라는 하찮은 무리가 어둡고 미혹하여 공손하지 않다. 발해와 갈석 사이에 무리를 모으고, 요동과 예의 땅을 거듭 갉아먹는다. …… 이것을 참는다면 무엇인들 참지 못하랴! …… 이에 짐이 몸소 여섯 군대를 거느리고 아홉 가지 정벌을 펴, 위태로운 이들을 건지고, 하늘의 뜻을 따르며, 이 도망친 더러운 무리를 없애고, 선대의 계획을 잇고자 한다.',
		source: SRC.sui4
	},
	url: URL.sui4,
	why: 'Emperor Yang’s own call to war, set right after the line that names the invasion. Uses the Sui Shu annal text; no person id exists for Emperor Yang, so person is omitted.'
});

ops.push({
	chapter: 'seventh-invasion',
	title: 'Four Dragons',
	op: 'add',
	after: 'The edict comes on red paper, pasted to the well-house wall',
	block: {
		kind: 'edict',
		person: 'taizong',
		title: 'Handwritten edict to the realm',
		hanja:
			'高麗蓋蘇文弒主虐民，情何可忍！今欲巡幸幽、薊，問罪遼、碣，所過營頓，無為勞費。……昔隋煬帝殘暴其下，高麗王仁愛其民，以思亂之軍擊安和之眾，故不能成功。今略言必勝之道有五：一曰以大擊小，二曰以順討逆，三曰以治乘亂，四曰以逸敵勞，五曰以悅當怨，何憂不克！佈告元元，勿為疑懼！',
		html: 'Gesomun of Goguryeo has murdered his lord and savages his people. Who could bear it? We mean to ride out to You and Ji and call Liao and Jie to account. Wherever We camp or halt, let nothing be wasted and no one be burdened. … Emperor Yang of Sui was cruel to those beneath him, and the king of Goguryeo was kind to his people. An army that longed for revolt struck a people at peace, and so it failed. Now, in short, there are five ways We are certain to win. One: the great strikes the small. Two: the loyal punishes the rebel. Three: order rides down disorder. Four: the rested meets the weary. Five: the glad meets the bitter. Why fear we will not prevail? Tell it to all the people. Let no one doubt, and no one be afraid.',
		ko: '고구려의 개소문이 임금을 죽이고 백성을 학대하니, 어찌 참을 수 있으랴! 이제 유주와 계주로 나아가 요동과 갈석에 죄를 묻고자 한다. 지나는 곳마다 진을 치고 머무는 데 헛된 수고와 비용이 없게 하라. …… 옛날 수 양제는 아랫사람에게 잔인하였고 고구려 왕은 백성을 아꼈다. 난을 꿈꾸는 군대로 편안하고 화목한 무리를 쳤으니 이기지 못한 것이다. 이제 반드시 이기는 길 다섯 가지를 대략 말한다. 첫째, 큰 것으로 작은 것을 친다. 둘째, 순리로 역적을 친다. 셋째, 다스려진 것으로 어지러운 것을 탄다. 넷째, 편안한 몸으로 지친 적을 맞는다. 다섯째, 기쁜 마음으로 원망하는 자를 상대한다. 어찌 이기지 못할까 걱정하랴! 백성에게 널리 알려 의심하거나 두려워하지 말게 하라!',
		source:
			'Zizhi Tongjian (資治通鑑) bk. 197, Tang Taizong, Zhenguan 18 (644), eleventh month · cf. Samguk Sagi bk. 21 (以理乘亂)'
	},
	url: `${URL.zz197} ${URL.ssg21}`,
	why: 'The edict the village sees pasted on the well-house: this is its actual text (the five ways to certain victory). Placed right after the red-paper beat, before Xue Rengui answers it.'
});

ops.push({
	chapter: 'chunchu-era',
	title: 'Royal Secretariat',
	op: 'add',
	after: 'Emperor Kōtoku does not fill the sea.',
	block: {
		kind: 'edict',
		person: 'gaozong',
		title: 'Sealed letter to the king of Baekje',
		hanja:
			'至如海東三國，開基自久，並列疆界，地實犬牙。近代已來，遂構嫌隙。戰爭交起，略無寧歲。遂令三韓之氓，命懸刀俎，尋戈肆憤，朝夕相仍。……新羅使金法敏奏書：「高麗、百濟，脣齒相依，競舉兵戈，侵逼交至。大城重鎮，並爲百濟所並；疆宇日蹙，威力並謝。乞詔百濟，令歸所侵之城。若不奉詔，即自興兵打取。但得故地，即請交和。」……王所兼新羅之城，並宜還其本國；新羅所獲百濟俘虜，亦遣還王。……王若不從進止，朕已依法敏所請，任其與王決戰；亦令約束高麗，不許遠相救恤。高麗若不承命，即令契丹諸蕃渡遼澤入抄掠。王可深思朕言，自求多福，審圖良策，無貽後悔。',
		html: 'The three kingdoms east of the sea were founded long ago. Their borders run side by side and bite into each other like dogs’ teeth. In recent times they have fallen out. War follows war, and there is hardly a year of peace. So the people of Samhan live with their lives on the chopping block, and spears are taken up in rage from morning to night. … Silla’s envoy, Kim Bupmin, presented a letter: “Goguryeo and Baekje lean on each other like lips and teeth. They raise arms by turns and press on us from both sides. Our great cities and strongholds have all been swallowed by Baekje; our land shrinks by the day and our strength is gone. We beg you to command Baekje to return the cities it took. If it will not obey, we will raise troops and take them back ourselves. Give us our old land, and we ask only for peace.” … The Silla cities you have taken must all go back to their own country, and the Baekje prisoners Silla holds will be sent back to you. … If you will not do as you are told, We have already granted Bupmin’s request: he may settle it with you in battle. We will also restrain Goguryeo and forbid it to come to your aid from afar. And if Goguryeo will not obey, the Khitan and the other tribes will be sent across the Liao marshes to raid it. Think hard on Our words, King. Seek your own good fortune, plan well, and leave yourself nothing to regret.',
		ko: '바다 동쪽의 세 나라는 나라를 연 지 오래되었고, 국경을 나란히 하여 땅이 개의 이빨처럼 맞물려 있다. 근래 들어 마침내 틈이 벌어져, 전쟁이 번갈아 일어나 편안한 해가 거의 없다. 그리하여 삼한의 백성은 목숨이 도마 위에 걸렸고, 창을 들고 분을 터뜨리는 일이 아침저녁으로 이어진다. …… 신라의 사신 김법민이 글을 올려 아뢰었다. “고구려와 백제가 입술과 이처럼 서로 기대어 다투어 군사를 일으키고, 번갈아 침범해 옵니다. 큰 성과 중요한 진은 모두 백제에게 빼앗겼고, 강토는 날로 줄어 힘이 다하였습니다. 백제에 조서를 내려 빼앗은 성을 돌려주게 하소서. 조서를 받들지 않으면 저희가 스스로 군사를 일으켜 되찾겠습니다. 옛 땅만 얻으면 곧 화친을 청하겠습니다.” …… 왕이 차지한 신라의 성은 모두 그 나라에 돌려주고, 신라가 잡은 백제 포로도 왕에게 돌려보내게 하라. …… 왕이 따르지 않는다면, 짐은 이미 법민의 청에 따라 그가 왕과 결전하도록 맡겼다. 또 고구려를 단속하여 멀리서 구원하지 못하게 할 것이다. 고구려가 명을 받들지 않으면 거란과 여러 번국에게 요택을 건너 노략하게 할 것이다. 왕은 짐의 말을 깊이 생각하여 스스로 복을 구하고, 좋은 계책을 살펴 뒷날 후회를 남기지 말라.',
		source:
			'Jiu Tangshu (舊唐書) bk. 199上, Eastern Barbarians — Baekje, Yonghui 2 (651) · cf. Samguk Sagi bk. 28, King Uija, yr. 11'
	},
	url: `${URL.jts199a} ${URL.ssg28}`,
	why: 'Bupmin went west with the ode; this is what his petition bought. The new emperor’s letter to Euija quotes him by name and settles the 651 diplomacy, so it closes the Tang-dress / Tsukushi run before the rewind to Chang’an. The Samguk Sagi copy (Uija yr. 11) differs only in single characters (開基日久, 築戈).'
});

/* ── A. covenant ───────────────────────────────────────────── */

ops.push({
	chapter: 'silla-tang-war',
	title: 'Mount Gain',
	op: 'add',
	after: 'The covenant is written out three times. One copy is buried',
	block: {
		kind: 'covenant',
		parties: ['munmu', 'yung'],
		title: 'The covenant of Mount Chwiri',
		hanja:
			'往者，百濟先王迷於逆順，不敦鄰好，不睦親姻，結託高句麗，交通倭國，共爲殘暴，侵削新羅，剽邑屠城，略無寧歳。……故立前百濟大司稼正卿扶餘隆，爲熊津都督，守其祭祀，保其桑梓，依倚新羅，長爲與國，各除宿憾，結好和親，各承詔命，永爲藩服。……約之以婚姻，申之以盟誓，刑牲歃血，共敦終始，分災恤患，恩若弟兄，祗奉綸音，不敢失墜，旣盟之後，共保歳寒。若有背盟，二三其德，興兵動衆，侵犯邊陲，明神鑒之，百殃是降，子孫不育，社稷無守，禋祀磨滅，罔有遺餘。故作金書鐵券，藏之宗廟，子孫萬代，無敢違犯。神之聽之，是享是福。',
		html: 'In days past, the late king of Baekje lost his way between loyalty and revolt. He kept no faith with his neighbours and no peace with his in-laws. He bound himself to Goguryeo and dealt with Yamato, and together they did violence: they cut into Silla, plundered its towns and butchered its forts, and there was hardly a year of peace. … Therefore Buyeo Yung, once Baekje’s minister of farming, is made Commander of Ungjin, to keep his fathers’ rites and guard the trees of his home. Let him lean on Silla and stand with it for ever. Let each put away old grudges, join in friendship and kinship, receive the imperial command, and remain a fence of the empire for all time. … They are bound by marriage and sworn by oath. The victim is killed and the blood is touched to the lips. Together they will keep faith to the end, share disaster and pity each other’s sorrows, as kind as brothers. They will keep the emperor’s word and never let it drop. After this oath they will stand together through the cold years. If either breaks the oath, turns two-faced, raises troops and crosses the border, may the bright gods see it. May a hundred calamities fall on him, may his sons not grow, may no one remain to keep his altars, and may his sacrifices be wiped out until nothing is left. So it is written in gold on iron and laid up in the ancestral temple, and for ten thousand generations no son or grandson will dare break it. Gods, hear it. Accept it, and bless it.',
		ko: '지난날 백제의 선왕은 순리와 역리를 헤아리지 못하여, 이웃과 좋게 지내지 않고 인척과도 화목하지 않았다. 고구려와 손잡고 왜국과 내통하여 함께 포악한 짓을 하니, 신라를 침범해 깎아 먹고 고을을 노략하고 성을 도륙하여 편안한 해가 거의 없었다. …… 그러므로 옛 백제의 대사가정경 부여융을 웅진도독으로 세워, 그 제사를 지키고 고향을 보전하게 한다. 신라에 기대어 길이 우방이 되고, 각자 묵은 원한을 풀고 좋게 지내며 화친하고, 각각 조명을 받들어 길이 번국이 되라. …… 혼인으로 묶고 맹세로 다짐하며, 희생을 잡아 피를 마시고 처음과 끝을 함께 도탑게 한다. 재앙을 나누고 근심을 서로 돌보며 은혜를 형제처럼 하고, 천자의 말씀을 받들어 감히 떨어뜨리지 않으며, 맹세한 뒤에는 추운 해를 함께 견딘다. 만약 맹세를 어기고 마음을 둘 셋으로 바꾸어, 군사를 일으키고 무리를 움직여 변경을 침범하면, 밝은 신이 굽어보시어 온갖 재앙이 내리고, 자손이 자라지 못하며, 사직을 지킬 자가 없고, 제사가 끊어져 남는 것이 없으리라. 그러므로 쇠 문서에 금으로 써서 종묘에 간직하니, 자손 만대에 감히 어기지 말라. 신이여 들으시고, 흠향하시고 복을 내리소서.',
		source:
			'Samguk Sagi (三國史記) bk. 6, Silla Annals — King Munmu, yr. 5 (665), eighth month · the words of Liu Rengui (劉仁軌之辭也)'
	},
	url: URL.ssg06,
	why: 'The covenant text itself, placed after the narrator says it is written out three times. The notice quote earlier in the entry (王與勅使劉仁願…) carries no oath text, so nothing to convert; the Black Tortoise’s dialogue speaks two lines of it aloud, and this is the full document behind them.'
});

/* ── A. omens ──────────────────────────────────────────────── */

ops.push({
	chapter: 'fall-of-euija',
	title: 'Nine Omens',
	op: 'add',
	after: '9. A ghost enters the palace and burrows into the ground.',
	block: {
		kind: 'omens',
		title: 'The nine omens, as the annals keep them',
		ko: '기록에 남은 아홉 가지 흉조',
		omens: [
			{
				hanja: '衆狐入宮中，一白狐坐上佐平書案。',
				html: 'Foxes came into the palace in a pack, and one white fox sat down on the Senior Minister’s desk.',
				ko: '여우 떼가 궁 안에 들어오고, 흰 여우 한 마리가 상좌평의 책상에 올라앉았다.',
				source: SRC.ssg28y19('second month')
			},
			{
				hanja: '太子宮，雌雞與黃雀交。',
				html: 'In the Crown Prince’s palace, a hen mated with a sparrow.',
				ko: '태자궁에서 암탉이 참새와 교미하였다.',
				source: SRC.ssg28y19('fourth month')
			},
			{
				hanja: '王都西南泗沘河，大魚出死，長三丈。',
				html: 'In the river at Sabi, southwest of the capital, a huge fish came up dead. It was three jang long.',
				ko: '도성 서남쪽 사비하에서 큰 물고기가 나와 죽었는데, 길이가 세 장이었다.',
				source: SRC.ssg28y19('fifth month')
			},
			{
				hanja: '有女屍浮生草津，長十八尺。',
				html: 'A woman’s body floated up at Saengcho Ford. It was eighteen feet long.',
				ko: '생초진에 여자 시체가 떠올랐는데, 길이가 열여덟 자였다.',
				source: SRC.ssg28y19('eighth month')
			},
			{
				hanja: '宮中槐樹鳴，如人哭聲。夜，鬼哭於宮南路。',
				html: 'A pagoda tree in the palace moaned like someone weeping. At night, ghosts wailed on the road south of the palace.',
				ko: '궁 안의 회화나무가 사람이 우는 소리처럼 울었다. 밤에는 궁 남쪽 길에서 귀신이 곡하였다.',
				source: SRC.ssg28y19('ninth month')
			},
			{
				hanja: '泗沘河水，赤如血色。',
				html: 'The river at Sabi ran as red as blood.',
				ko: '사비하의 물이 핏빛처럼 붉었다.',
				source: SRC.ssg28y20('second month')
			},
			{
				hanja: '蝦蟆數萬，集於樹上。',
				html: 'Tens of thousands of toads gathered in the trees.',
				ko: '두꺼비 수만 마리가 나무 위에 모였다.',
				source: SRC.ssg28y20('fourth month')
			},
			{
				hanja: '風雨暴至，震天王、道讓二寺塔，又震白石寺講堂。玄雲如龍，東西相鬪於空中。',
				html: 'Wind and rain came all at once. Lightning struck the pagodas of Cheonwang and Doyang temples, and the lecture hall of Baekseok Temple. Black clouds like dragons fought, east against west, in the sky.',
				ko: '비바람이 갑자기 몰아쳐 천왕사와 도양사 두 절의 탑에 벼락이 치고, 또 백석사 강당에 벼락이 쳤다. 검은 구름이 용처럼 동쪽과 서쪽에서 공중에서 서로 싸웠다.',
				source: SRC.ssg28y20('fifth month')
			},
			{
				hanja: '有一鬼入宮中，大呼：「百濟亡，百濟亡！」卽入地，王怪之，使人掘地，深三尺許，有一龜。',
				html: 'A ghost came into the palace and shouted, “Baekje is falling, Baekje is falling!” Then it went into the ground. The king thought it strange and had men dig. About three feet down, there was a turtle.',
				ko: '귀신 하나가 궁 안에 들어와 크게 외쳤다. “백제가 망한다, 백제가 망한다!” 그러고는 땅속으로 들어갔다. 왕이 괴이하게 여겨 사람을 시켜 땅을 파게 하니, 석 자쯤 깊이에 거북이 한 마리 있었다.',
				source: SRC.ssg28y20('')
			}
		]
	},
	url: URL.ssg28,
	why: 'One record line per numbered omen, in the story’s order, right after the list ends. The turtle’s inscription is left out on purpose: the later quote in this entry (得一龜 背有文曰…) already carries it. The record’s 泗沘河 is the river at Sabi, which the story’s sixth omen calls the White River.'
});

/* ── A. ledgers ────────────────────────────────────────────── */

ops.push({
	chapter: 'seventh-invasion',
	title: 'Colossal River',
	op: 'add',
	after: 'When the nine armies crossed the Liao there were three hundred and five thousand',
	block: {
		kind: 'ledger',
		title: 'Counting the Sui army',
		ko: '수나라 군대 세기',
		rows: [
			{
				label: 'The whole host',
				ko: '전체 군사',
				values: [
					{ source: SRC.sui4, value: '1,133,800 (proclaimed as 2,000,000)', note: 'Twice as many again hauled the supplies.' },
					{ source: SRC.zz181, value: '1,133,800 (proclaimed as 2,000,000)' },
					{ source: SRC.ssg20, value: '1,133,800 (proclaimed as 2,000,000)' }
				]
			},
			{
				label: 'The nine armies that crossed the Liao',
				ko: '요수를 건넌 아홉 군대',
				values: [
					{ source: SRC.zz181, value: '305,000' },
					{ source: SRC.ssg20, value: '305,000' }
				]
			},
			{
				label: 'Back at the Liaodong fortress',
				ko: '요동성으로 돌아온 군사',
				values: [
					{ source: SRC.zz181, value: '2,700' },
					{ source: SRC.ssg20, value: '2,700' }
				]
			}
		]
	},
	url: `${URL.sui4} ${URL.zz181} ${URL.ssg20}`,
	why: 'Salsu, 612. Placed after the 305,000 → 2,700 quote. The three books agree to the man, which is the point: Goguryeo’s own annal copies the Chinese count rather than inventing a bigger one.'
});

ops.push({
	chapter: 'seventh-invasion',
	title: 'Ansi',
	op: 'add',
	after: 'The eastern campaign came to grief at Ansi, so its lord',
	block: {
		kind: 'ledger',
		title: 'The 645 campaign, two ledgers',
		ko: '645년 원정, 두 장부',
		rows: [
			{
				label: 'Goguryeo relief army',
				ko: '고구려 구원군',
				values: [
					{ source: SRC.zz198, value: '150,000 Goguryeo and Mohe' },
					{ source: SRC.ssg21, value: '150,000, ours and Mohe', note: 'Adds that the emperor looked at their forty-li line and was afraid.' }
				]
			},
			{
				label: 'Dead at Stallion Mountain',
				ko: '주필산 전사자',
				values: [
					{ source: SRC.zz198, value: '20,000+ heads taken' },
					{ source: SRC.ssg21, value: '三二萬餘 dead', note: 'The figure is garbled: “three-two ten-thousand”.' }
				]
			},
			{
				label: 'Surrendered with the two commanders',
				ko: '두 장수와 함께 항복한 군사',
				values: [
					{ source: SRC.zz198, value: '36,800' },
					{ source: SRC.ssg21, value: '36,800' }
				]
			},
			{
				label: 'Horses taken',
				ko: '빼앗긴 말',
				values: [
					{ source: SRC.zz198, value: '50,000' },
					{ source: SRC.ssg21, value: '50,000' }
				]
			},
			{
				label: 'The earth mound at Ansi',
				ko: '안시성 토산',
				values: [
					{ source: SRC.zz198, value: '500,000 man-days over sixty days' },
					{ source: SRC.ssg21, value: '500,000 man-days over sixty days' }
				]
			},
			{
				label: 'Losses in the three great battles',
				ko: '세 차례 큰 싸움의 손실',
				values: [
					{ source: SRC.zz198, value: '40,000+ Goguryeo heads; Tang dead nearly 2,000; seven or eight war horses in ten' },
					{ source: SRC.ssg21, value: '“Very many” men and horses dead, ours and Tang’s alike', note: 'Kim Busik copies the Chinese sentence and deletes every number in it.' }
				]
			}
		]
	},
	url: `${URL.zz198} ${URL.ssg21}`,
	why: 'Ansi / 645, after the historian’s verdict that closes the siege. Shows where Kim Busik copies Sima Guang word for word and where he quietly removes the Tang body count.'
});

ops.push({
	chapter: 'final-stand',
	title: 'White River',
	op: 'add',
	after: 'They burned four hundred of their ships; smoke and flame filled the sky',
	block: {
		kind: 'ledger',
		title: 'Ships at the White River',
		ko: '백강의 배',
		rows: [
			{
				label: 'Tang warships in line at the river mouth',
				ko: '강어귀에 진을 친 당 전함',
				values: [{ source: SRC.ns27, value: '170' }]
			},
			{
				label: 'Ships burned',
				ko: '불탄 배',
				values: [
					{ source: SRC.jts84, value: '400, after four fights won' },
					{ source: SRC.xts220b, value: '400, after four clashes won' }
				]
			},
			{
				label: 'Yamato ships waiting at the landing',
				ko: '상륙지에 머문 왜의 배',
				values: [{ source: SRC.ssg07letter, value: '1,000, moored at Baeksa', note: 'King Munmu, looking back eight years later.' }]
			},
			{
				label: 'Yamato troops sent',
				ko: '왜가 보낸 군사',
				values: [{ source: SRC.ns27, value: '27,000 against Silla; then 10,000+ more under Iohara', note: 'The Tang books give no count.' }]
			},
			{
				label: 'Yamato fleet that took the Baekje prince home the year before',
				ko: '한 해 전 백제 왕자를 데려다준 왜 선단',
				values: [{ source: SRC.ns27, value: '170' }]
			}
		]
	},
	url: `${URL.ns27} ${URL.jts84} ${URL.xts220} ${URL.ssg07}`,
	why: 'White River, 663, after the four-hundred-ships quote. The story already says Tang had 170 ships; the ledger shows where that comes from (Nihon Shoki) and that no book counts the Yamato fleet the same way twice.'
});

ops.push({
	chapter: 'silla-tang-war',
	title: 'Maeso',
	op: 'add',
	after: 'By edict Li Jinxing was made Commissioner for Pacifying Andong',
	block: {
		kind: 'ledger',
		title: 'Who won at Maeso',
		ko: '매소성에서 누가 이겼나',
		rows: [
			{
				label: 'The result',
				ko: '결과',
				values: [
					{ source: SRC.zz202, value: 'Tang: three battles, three wins; Silla sends tribute and apologises' },
					{ source: SRC.xts220s, value: 'Tang: three battles, the enemy ran every time; Bupmin sends to apologise' },
					{ source: SRC.ssg07maeso, value: 'Silla: “our army struck them and drove them off”' }
				]
			},
			{
				label: 'Li Jinxing’s army',
				ko: '이근행의 군사',
				values: [{ source: SRC.ssg07maeso, value: '200,000', note: 'The Chinese books give no number.' }]
			},
			{
				label: 'War horses taken',
				ko: '얻은 전마',
				values: [{ source: SRC.ssg07maeso, value: '30,380, and weapons to match' }]
			},
			{
				label: 'Battles with Tang that year',
				ko: '그해 당과의 싸움',
				values: [{ source: SRC.ssg07maeso, value: 'Eighteen, large and small, all won; 6,047 heads' }]
			}
		]
	},
	url: `${URL.zz202} ${URL.xts220} ${URL.ssg07}`,
	why: 'Maeso, 675, after the Zizhi Tongjian quote that gives Tang the win. The ledger puts the Silla annal beside it: same fortress, same year, opposite winner.'
});

/* ── A. oath ───────────────────────────────────────────────── */

ops.push({
	chapter: 'five-principles',
	title: 'Sadaham',
	op: 'convert',
	match: 'Year imsin, sixth month, sixteenth day. The two of us swear together',
	block: {
		kind: 'oath',
		hanja:
			'壬申年六月十六日，二人幷誓記。天前誓，今自三年以後，忠道執持，過失无誓。若此事失，天大罪淂誓。若國不安大舐世，可容行誓之。又別，先辛未年七月卄二日，大誓。詩·尙書·禮·傳倫淂誓三年。',
		html: 'Year imsin, sixth month, sixteenth day. The two of us swear together and write it down. We swear before Heaven: from now until three years hence we will hold fast to the way of loyalty and commit no fault. If we fail in this, we swear it is a great sin against Heaven. If the country is not at peace and the world falls into great disorder*, we swear we will go and do what must be done. And apart from this: on the twenty-second day of the seventh month of the year sinmi before, we swore a great oath, that in three years we would master, one after another, the Odes, the Documents, the Rites and the Tradition†.',
		ko: '임신년 6월 16일, 두 사람이 함께 맹세하여 적는다. 하늘 앞에 맹세한다. 지금부터 3년 뒤까지 충도를 굳게 지니고 허물이 없기를 맹세한다. 이 일을 어기면 하늘에 큰 죄를 짓는 것이라 맹세한다. 만약 나라가 편안하지 않고 세상이 크게 어지러워지면*, 마땅히 나아가 행할 것을 맹세한다. 또 따로, 앞서 신미년 7월 22일에 크게 맹세하였으니, 시경·상서·예기·전†을 차례로 익히기를 3년으로 맹세하였다.',
		source: 'Imsin Oath Stone (壬申誓記石), Gyeongju (552 or 612)',
		back: {
			html: 'Two boys, no names, one pebble: three years of books, and a war if the country asks for one.',
			ko: '이름 없는 두 소년, 조약돌 하나. 책으로 3년, 나라가 부르면 전쟁.'
		},
		notes: [
			{
				mark: '*',
				html: 'The stone’s character here is worn. The database prints 舐; nearly every editor reads it as 亂, “disorder”.',
				ko: '이 자리의 글자는 닳아 있다. 판독문은 舐로 적지만, 거의 모든 연구자가 亂(어지러울 란)으로 읽는다.'
			},
			{
				mark: '†',
				html: 'The Tradition (傳) is usually taken as the Zuo commentary on the Spring and Autumn Annals.',
				ko: '전(傳)은 보통 『춘추좌씨전』으로 본다.'
			}
		]
	},
	url: URL.imsin,
	why: 'Converts the Imsin quote to an oath card and restores the second half of the stone the old quote cut off (the war clause and the three-year reading list). Text is the National Institute of Korean History transcription, punctuation set full-width; its 舐 is kept and footnoted rather than silently changed to 亂. The old style:"stele" has no place on the oath type and is dropped.'
});

/* ── A. poems ──────────────────────────────────────────────── */

ops.push({
	chapter: 'seventh-invasion',
	title: 'Colossal River',
	op: 'convert',
	match: '神策究天文',
	block: {
		kind: 'poem',
		person: 'munduk',
		title: 'Poem sent to the Sui general',
		hanja: '神策究天文\n妙算窮地理\n戰勝功旣高\n知足願云止',
		html: 'Your godlike strategy has searched out the patterns of heaven;<br>your wondrous reckoning has mastered the lie of the land.<br>Your victories have already won you high merit —<br>know it is enough, and I pray you stop.',
		ko: '그대의 귀신 같은 계책은 하늘의 이치를 다 헤아렸고<br>신묘한 계산은 땅의 이치를 통달했다<br>전쟁에 이겨 쌓은 공이 이미 높으니<br>만족함을 알고 그치기를 바라노라',
		source: 'Samguk Sagi (三國史記) bk. 44, Biographies — Eulji Mundeok'
	},
	url: URL.ssg44,
	why: 'The verse block already carries Eulji Mundeok’s poem; converting it to a poem card adds the speaker and the record. Hanja checked against bk. 44 (文德遺仲文詩曰). EN lines kept as written; KO lines are the existing glosses without the inline readings.'
});

ops.push({
	chapter: 'chunchu-era',
	title: 'Royal Secretariat',
	op: 'convert',
	match: 'Jinduk then wove brocade with a five-character Ode to Great Peace',
	block: {
		kind: 'poem',
		person: 'jinduk',
		title: 'Ode to Great Peace (太平頌)',
		hanja:
			'大唐開洪業，巍巍皇猷昌，\n止戈戎威定，修文繼百王。\n統天崇雨施，理物體含章。\n深仁偕日月，撫運邁時康。\n幡旗何赫赫，錚鼓何鍠鍠。\n外夷違命者，剪覆被天殃。\n淳風凝幽顯，遐邇競呈祥。\n四時和玉燭，七曜巡萬方。\n維嶽降宰輔，維帝任忠良。\n五三成一德，昭我唐家皇。',
		html: 'Great Tang has opened its vast work; lofty, lofty, the imperial plan shines.<br>The spear is stilled and its might has settled all; letters are cultivated, heir to a hundred kings.<br>It rules as Heaven does and honours the falling rain; it orders all things and keeps their beauty within.<br>Its deep kindness keeps pace with sun and moon; its fortunes outrun the years of peace.<br>How bright, how bright the banners blaze; how loud, how loud the gongs and drums.<br>Outer tribes who defy its command are cut down by Heaven’s punishment.<br>Pure custom settles on the seen and the unseen; near and far vie to offer good omens.<br>The four seasons turn in tune like a jade candle; the seven lights wheel over ten thousand lands.<br>The holy peaks send down ministers; the emperor trusts the loyal and good.<br>The Three and the Five are made one virtue: shine on, sovereign of our Tang house!*',
		ko: '위대한 당이 큰 업을 여니, 높고 높은 황제의 계책 빛나도다.<br>창을 거두니 무위가 천하를 평정하고, 글을 닦아 백 왕의 뒤를 잇도다.<br>하늘을 거느려 비를 내리듯 은혜를 베풀고, 만물을 다스려 아름다움을 품었도다.<br>깊은 어짊은 해와 달과 나란하고, 시운을 어루만져 태평한 때를 넘어서도다.<br>깃발은 어찌 그리 빛나며, 징과 북은 어찌 그리 우렁찬가.<br>명을 어기는 바깥 오랑캐는 하늘의 재앙을 입어 엎어지리라.<br>순박한 풍속이 보이는 곳과 보이지 않는 곳에 엉기니, 멀고 가까운 곳이 다투어 상서를 바치도다.<br>사계절은 옥촉처럼 고르고, 일곱 별은 온 세상을 도는도다.<br>산악이 재상을 내리고, 황제는 충성스럽고 어진 이를 쓰도다.<br>삼황오제의 덕이 하나가 되니, 우리 당나라 황제를 빛내도다!*',
		source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Jindeok, yr. 4 (650), sixth month · cf. Jiu Tangshu bk. 199上 (止戈戎衣定)',
		notes: [
			{
				mark: '*',
				html: 'The emperor liked it. He made Bupmin a Chief Minister of the Treasury and sent him home.',
				ko: '황제는 이를 가상히 여겨 법민을 태부경으로 삼아 돌려보냈다.'
			}
		]
	},
	url: `${URL.ssg05} ${URL.jts199a}`,
	why: 'The old quote gave only two couplets from the Jiu Tangshu. The card gives the whole ode from Samguk Sagi bk. 5. The JTS sentence about Bupmin’s new title moves into the note. One variant matters: Samguk Sagi reads 戎威 (“martial might”) where JTS reads 戎衣 (“war-robe”, the old quote’s wording). The quote just before it (bk. 5, 王織錦作五言太平頌…) stays as the setup.'
});

ops.push({
	chapter: 'five-principles',
	title: 'King Euija',
	op: 'add',
	after: 'He fed yams to the village children, and the children took to him.',
	block: {
		kind: 'poem',
		person: 'kingmu',
		title: 'Seodong’s Song (薯童謠)',
		hanja: '善化公主主隱\n他密只嫁良置古\n薯童房乙\n夜矣卯乙抱遣去如',
		html: 'Princess Sunhwa*<br>has married in secret,<br>and to the yam boy’s room<br>by night she goes to hold him.',
		ko: '선화공주님은*<br>남몰래 시집가 두고<br>서동 도련님 방을<br>밤에 몰래 안고 간다',
		source: 'Samguk Yusa (三國遺事) bk. 2, Marvels — King Mu (武王)',
		notes: [
			{
				mark: '*',
				html: 'The song promises a Silla princess. The queen this book knows, Euija’s mother, is a Satek, and a relic box from the Mireuksa pagoda names King Mu’s queen as a Satek daughter too. Either the song lied, or a king can have more than one queen. Both happen.',
				ko: '노래는 신라 공주를 약속한다. 그런데 이 책이 아는 왕비, 의자의 어머니는 사택씨이고, 미륵사 탑에서 나온 사리봉영기도 무왕의 왕비를 사택씨의 딸로 적는다. 노래가 거짓말을 했거나, 왕에게 왕비가 하나가 아니었거나. 둘 다 있는 일이다.'
			}
		]
	},
	url: URL.sy2,
	why: 'The quote says he made up a song and coaxed the children into singing it; this is the song. Hanja is the 향찰 text right after the quoted sentence in Samguk Yusa bk. 2, laid out in its four lines. The note explains why the princess it names never shows up in the story.'
});

/* ── B. footnotes on existing quotes ───────────────────────── */

const N = {
	gaesomun: { html: 'The Korean annals spell him Gaesomun. This book says Gesomun. One man, five swords.', ko: '기록의 개소문이 곧 이 책의 연개소문이다. 영어 표기만 다르다.' },
	geonmu: { html: 'Geonmu (建武) was the king’s own name. This book calls him King Yeongnyu, the name the court gave him after he died.', ko: '건무는 왕의 이름이다. 이 책은 죽은 뒤에 받은 이름, 영류왕으로 부른다.' },
	qian: { html: 'The family name was Yeon (淵), “deep water”. Tang could not write that character, because it belonged to the dynasty’s founder, so its books swap in 泉, “spring”, or here 錢.', ko: '그의 성은 연(淵)이다. 당은 고조 이연의 이름자인 淵을 쓸 수 없어, 泉이나 여기처럼 錢으로 바꿔 적었다.' },
	iri: { html: 'Yamato wrote down what its ears caught: Iri for Yeon, Kasumi for Gaesomun.', ko: '왜는 귀에 들린 대로 적었다. 이리는 연, 가수미는 개소문이다.' },
	quan: { html: 'Quan (泉) is Tang’s stand-in for Yeon (淵), a character it could not write. Gai Suwen is Gaesomun read in Chinese. Together: Yeon Gesomun.', ko: '천(泉)은 당이 쓸 수 없던 연(淵) 대신 쓴 글자다. 곧 연개소문이다.' },
	wu: { html: 'Wu is Geonmu (建武), the king this book calls Yeongnyu.', ko: '무는 건무, 이 책의 영류왕이다.' },
	taizong: { html: 'Taizong is the temple name Tang gave him after death. In this book he is the Second Emperor.', ko: '태종은 죽은 뒤 받은 묘호다. 이 책에서는 ‘두 번째 황제’다.' },
	heli: { html: 'Qibi Heli: the steppe prince this book calls the White Dragon.', ko: '계필하력, 이 책의 흰 용(백룡)이다.' },
	su: { html: 'General Su is Su Dingfang. Chang’an calls him the Red Fowl.', ko: '소 장군은 소정방, 장안이 주작이라 부르는 사람이다.' },
	beopmin: { html: 'Beopmin is Bupmin, spelled the other way.', ko: '영어 표기만 다를 뿐, 이 책의 법민이다.' },
	taejong: { html: 'King Taejong is Chunchu, by the temple name Silla gave him. It is the same name Tang gave the Second Emperor, and Tang will notice.', ko: '태종왕은 춘추다. 신라가 붙인 묘호인데, 당 태종과 같은 이름이라 당이 그냥 넘어가지 않는다.' }
};

const findEntry = (chapter, title) => {
	const c = story.find((c) => c.id === chapter);
	const e = c && c.entries.find((e) => e.title === title);
	if (!e) throw new Error(`entry not found: ${chapter} › ${title}`);
	return e;
};

const insertAfter = (text, term, mark, where) => {
	const i = text.indexOf(term);
	if (i < 0) throw new Error(`term “${term}” not in ${where}`);
	return text.slice(0, i + term.length) + mark + text.slice(i + term.length);
};

const MARKS = ['*', '†', '‡'];

function footnote(chapter, title, match, terms, why) {
	const e = findEntry(chapter, title);
	const block = e.blocks.find((b) => b.kind === 'quote' && b.html && b.html.includes(match));
	if (!block) throw new Error(`quote not found: ${title} / ${match}`);
	const ordered = [...terms].sort((a, b) => block.html.indexOf(a.en) - block.html.indexOf(b.en));
	let html = block.html;
	let ko = block.ko;
	const notes = [];
	ordered.reverse().forEach((t) => {
		const mark = MARKS[ordered.length - 1 - notes.length];
		html = insertAfter(html, t.en, mark, `${title} html`);
		ko = insertAfter(ko, t.ko, mark, `${title} ko`);
		notes.unshift({ mark, html: N[t.note].html, ko: N[t.note].ko });
	});
	ops.push({ chapter, title, op: 'notes', match, html, ko, notes, why });
}

footnote('samhan', 'Commander Yeon', 'Gaesomun, also called Gaegeum', [{ en: 'Gaesomun', ko: '개소문', note: 'gaesomun' }], 'First record mention of him in the book; the record’s spelling differs from the story’s Gesomun. Later Gaesomun quotes are left unmarked.');
footnote('samhan', 'Commander Yeon', 'The king, Geonmu, afraid his country would be invaded', [{ en: 'Geonmu', ko: '건무', note: 'geonmu' }], 'The record names the king by his personal name; the story only ever says Yeongnyu.');
footnote('five-principles', 'Dosuryu', 'conferred with the king, Geonmu, on killing him', [{ en: 'Geonmu', ko: '건무', note: 'geonmu' }], 'Same personal-name problem, in a different entry.');
footnote('iron-will', 'Yeon’s Massacre', 'Somun\'s surname is Qian.', [{ en: 'Qian', ko: '전씨', note: 'qian' }], 'A reader who knows him as Yeon is told his surname is Qian; the taboo substitution needs one line.');
footnote('iron-will', 'Yeon’s Massacre', 'The great minister Iri Kasumi, that is Gesomun', [{ en: 'Iri Kasumi', ko: '이리가수미', note: 'iri' }], 'The html already says who he is; the note explains why Yamato’s name sounds nothing like it.');
footnote('epilogue', 'Emperor', 'Quan Gai Suwen, Great Man of Goguryeo', [
	{ en: 'Quan Gai Suwen', ko: '천개소문', note: 'quan' },
	{ en: 'his king, Wu', ko: '그 왕 무', note: 'wu' }
], 'Both the killer and the king appear under names the story never uses.');
footnote('final-stand', 'Pyongyang I', 'Heli led his men over with a roar', [{ en: 'Heli', ko: '하력', note: 'heli' }], 'The story calls Qibi Heli the White Dragon; the quote gives only his personal name.');
footnote('seventh-invasion', 'Four Dragons', 'Taizong campaigned in person against Liaodong', [{ en: 'Taizong', ko: '태종', note: 'taizong' }], 'Story prose always says the Second Emperor; first record use of Taizong in this entry.');
footnote('chunchu-era', 'Gi (起)', 'Taizong marched in person against Goguryeo', [{ en: 'Taizong', ko: '태종', note: 'taizong' }], 'Same: Taizong = the Second Emperor.');
footnote('chunchu-era', 'Queen Jinduk', 'Taizong of Tang sent an envoy bearing his tally', [{ en: 'Taizong', ko: '태종', note: 'taizong' }], 'Same: Taizong = the Second Emperor.');
footnote('chunchu-era', 'Jiabeng (駕崩)', 'Taizong of Tang died. His testamentary edict', [{ en: 'Taizong', ko: '태종', note: 'taizong' }], 'Same: Taizong = the Second Emperor, at his death.');
footnote('chunchu-era', 'Jiabeng (駕崩)', 'Ashina She’er and Qibi Heli asked to kill themselves', [{ en: 'Qibi Heli', ko: '계필하력', note: 'heli' }], 'Qibi Heli = the White Dragon.');
footnote('fall-of-baekje', 'Sabi', 'were seized by General Su on the thirteenth day', [{ en: 'General Su', ko: '소 장군', note: 'su' }], 'The story only calls him the Red Fowl.');
footnote('fall-of-baekje', 'Buyeo Euija†', 'seized by General Su and the rest', [{ en: 'General Su', ko: '장군 소정방', note: 'su' }], 'Same: General Su = the Red Fowl.');
footnote('fall-of-baekje', 'Kim Chunchu†', 'His taboo-name was Beopmin; he was the eldest son of King Taejong', [
	{ en: 'Beopmin', ko: '법민', note: 'beopmin' },
	{ en: 'King Taejong', ko: '태종왕', note: 'taejong' }
], 'In Chunchu’s own death entry the record calls him King Taejong, a title the reader has only seen on the Tang emperor.');

const out = {
	ops,
	notes:
		'All hanja fetched this session (zh.wikisource raw pages; the Imsin stone from db.history.go.kr, gskh_003_0010_0120_0020). Translations are new. Ellipses (……) in hanja mark cuts; nothing inside a cut-out span is altered. The Huangdi (皇帝) entry in chunchu-era is untouched. Block types edict/covenant/omens/ledger/oath/poem follow src/lib/story.ts; ledger values carry no ko field in the type, so values are English only. Omen sources and ledger sources use the “Book (漢字題) detail” form recordBooks.ts matches. Gaesomun is footnoted once (its first record appearance), not at every quote.'
};

fs.writeFileSync(path.join(__dirname, 'content.json'), JSON.stringify(out, null, '\t') + '\n');
console.log(`wrote ${ops.length} ops`);
