/**
 * The /research page: what people of the six early kingdoms wore, with the
 * objects, murals and written records it is known from. Images live in
 * `data/research-images.json` (files in static/research/, credited per image);
 * `still: true` entries are the story's own paintings, shown apart from the evidence.
 */
import { KINGDOMS } from '$lib/people';
import images from '$lib/data/research-images.json';

export type ResearchKingdom = 'gojoseon' | 'buyeo' | 'goguryeo' | 'baekje' | 'silla' | 'gaya' | 'abroad';
export type TopicId = 'crowns' | 'feathers' | 'gold' | 'men' | 'women' | 'court' | 'armor' | 'customs' | 'neighbors';
export type DiagramId = 'jougwan' | 'crown' | 'layers' | 'armor' | 'ranks';

export type ResearchImage = {
	id: string;
	topic: TopicId;
	kingdom: ResearchKingdom;
	title: string;
	ko: string;
	date: string;
	where: string;
	whereKo: string;
	src: string;
	w: number;
	h: number;
	caption: string;
	captionKo: string;
	treasure?: string;
	credit: string;
	license: string;
	/** Commons file page, or for a story still the `?ep=` id of the episode it comes from. */
	url: string;
	/** Painted for the story rather than photographed in a museum; `where` is then the episode title. */
	still?: boolean;
};

/** A line of a dynastic history about dress, quoted with its translation. */
export type DressRecord = { kingdom: ResearchKingdom; hanja: string; en: string; ko: string; source: string };

export type Topic = {
	id: TopicId;
	title: string;
	ko: string;
	/** Two to four short paragraphs. */
	body: string[];
	bodyKo: string[];
	diagram?: DiagramId;
	records?: DressRecord[];
};

export const IMAGES = images as ResearchImage[];

export const KINGDOM_ORDER: ResearchKingdom[] = ['gojoseon', 'buyeo', 'goguryeo', 'baekje', 'silla', 'gaya', 'abroad'];

export const KINGDOM_INFO: Record<ResearchKingdom, { en: string; ko: string; era: string; color: string }> = {
	gojoseon: { en: 'Gojoseon', ko: '고조선', era: 'to 108 BCE', color: KINGDOMS.joseon.color },
	buyeo: { en: 'Buyeo', ko: '부여', era: '2nd c. BCE – 494', color: KINGDOMS.buyeo.color },
	goguryeo: { en: 'Goguryeo', ko: '고구려', era: '37 BCE – 668', color: KINGDOMS.goguryeo.color },
	baekje: { en: 'Baekje', ko: '백제', era: '18 BCE – 660', color: KINGDOMS.baekje.color },
	silla: { en: 'Silla', ko: '신라', era: '57 BCE – 935', color: KINGDOMS.silla.color },
	gaya: { en: 'Gaya', ko: '가야', era: '42 – 562', color: KINGDOMS.gaya.color },
	abroad: { en: 'Seen abroad', ko: '외국의 기록', era: 'envoys in foreign art', color: '#8a8a94' }
};

const R = {
	weiBuyeo: 'Records of the Three Kingdoms (三國志), Wei 30, Eastern Barbarians: Buyeo',
	weiGoguryeo: 'Records of the Three Kingdoms (三國志), Wei 30, Eastern Barbarians: Goguryeo',
	weiHan: 'Records of the Three Kingdoms (三國志), Wei 30, Eastern Barbarians: the Han peoples',
	zhouGoguryeo: 'Book of Zhou (周書) 49, Foreign Lands: Goguryeo',
	zhouBaekje: 'Book of Zhou (周書) 49, Foreign Lands: Baekje',
	tangGoguryeo: 'Old Book of Tang (舊唐書) 199, Eastern Barbarians: Goguryeo',
	tangBaekje: 'Old Book of Tang (舊唐書) 199, Eastern Barbarians: Baekje',
	suiSilla: 'Book of Sui (隋書) 81, Eastern Barbarians: Silla',
	liangSilla: 'Book of Liang (梁書) 54, Silla',
	sagiDress: 'Samguk Sagi (三國史記) 33, Treatise 2: Colours of Dress',
	shiji: 'Records of the Grand Historian (史記) 115, Joseon'
};

export const TOPICS: Topic[] = [
	{
		id: 'crowns',
		title: 'Crowns',
		ko: '관',
		body: [
			'Silla’s gold crowns are the best known: a headband with three uprights shaped like the character 出 (stylised trees) and two shaped like antlers, hung with comma-shaped jade (gogok) and hundreds of gold spangles that shiver when the head moves. Long pendants hang at the temples. Six have been excavated, all from great mound tombs in Gyeongju of the fifth and sixth centuries.',
			'Whether they were worn in life is still argued. In the tombs they sit low, around the face, with the pendants on the chest, and the sheet gold is thin. Many scholars read them as funerary or ceremonial, worn over an inner cap of birch bark or silk.',
			'Gaya’s gold crown (attributed to Goryeong) uses plant-shaped uprights instead. Baekje and Goguryeo crowns survive mostly in gilt bronze: Goguryeo openwork flame patterns, Baekje tall pointed caps from its Hanseong era, and the flame-shaped gold ornaments of King Muryeong that pinned to a black silk cap.'
		],
		bodyKo: [
			'가장 잘 알려진 것은 신라 금관이다. 관테 위에 出자 모양(나무를 형상화)의 세움장식 셋과 사슴뿔 모양 둘을 세우고, 곱은옥과 수백 개의 달개를 달아 머리를 움직이면 떨린다. 관자놀이에는 긴 드리개가 늘어진다. 지금까지 여섯 점이 나왔고, 모두 5–6세기 경주의 대형 고분에서 출토되었다.',
			'살아서 썼는지는 아직 논쟁 중이다. 무덤 속에서 금관은 얼굴을 감싸듯 낮게 놓이고 드리개는 가슴에 닿으며, 금판도 얇다. 그래서 장례용·의례용으로 보고, 자작나무 껍질이나 비단으로 만든 안쪽 모자 위에 썼다고 보는 학자가 많다.',
			'가야 금관(고령 출토로 전함)은 풀잎 모양 세움장식을 쓴다. 백제와 고구려의 관은 주로 금동으로 남았다. 고구려는 불꽃무늬 투조, 백제는 한성기의 높고 뾰족한 관모, 그리고 검은 비단 관에 꽂던 무령왕의 불꽃 모양 금제 관식이 있다.'
		],
		diagram: 'crown',
		records: [
			{
				kingdom: 'goguryeo',
				hanja: '唯王五綵，以白羅爲冠，白皮小帶，其冠及帶，咸以金飾。',
				en: 'Only the king wears the five colours. His cap is white silk gauze, his belt a narrow one of white leather, and both cap and belt are ornamented with gold.',
				ko: '오직 왕만 오색 옷을 입는다. 흰 비단으로 관을 만들고 흰 가죽 띠를 두르며, 관과 띠를 모두 금으로 꾸민다.',
				source: R.tangGoguryeo
			},
			{
				kingdom: 'baekje',
				hanja: '其王服大袖紫袍，青錦袴，烏羅冠，金花爲飾，素皮帶，烏革履。',
				en: 'Their king wears a wide-sleeved purple robe, trousers of blue brocade, and a black silk cap ornamented with gold flowers; a plain leather belt and black leather shoes.',
				ko: '왕은 소매가 넓은 자주색 도포에 푸른 비단 바지를 입고, 금꽃으로 꾸민 검은 비단 관을 쓰며, 흰 가죽 띠에 검은 가죽신을 신는다.',
				source: R.tangBaekje
			}
		]
	},
	{
		id: 'feathers',
		title: 'Feather caps and bird wings',
		ko: '조우관과 새 날개 장식',
		body: [
			'The everyday cap of a Goguryeo man was the jeolpung (折風), a small peaked cap tied under the chin. Men with office pushed two bird feathers into it, one each side, so their rank showed from across a yard. Chinese envoys noticed it in every century, and foreign painters drew it: two men with feathered caps and ring-pommel swords stand among the ambassadors on the seventh-century walls of Afrasiyab in Samarkand.',
			'Silla and Baekje carried the same idea in metal. Silla tombs hold gold ornaments shaped like a pair of bird wings or a butterfly, made to slot into the front of a cap. Baekje officials of the sixth rank and above wore silver flower ornaments on black caps, and the king gold ones.',
			'The two feathers were pheasant or similar long tail feathers, set upright or swept back. In the murals they move with the rider.'
		],
		bodyKo: [
			'고구려 남자의 평상 관모는 절풍(折風)이었다. 작고 뾰족한 모자를 턱 밑에서 끈으로 맨다. 벼슬이 있는 사람은 여기에 새 깃 두 개를 양쪽에 꽂아, 마당 건너에서도 신분이 보이게 했다. 중국 사신들은 시대마다 이를 적었고, 외국 화가들도 그렸다. 사마르칸트 아프라시아브 궁전의 7세기 벽화에는 깃 꽂은 관을 쓰고 고리자루칼을 찬 두 사람이 사절들 사이에 서 있다.',
			'신라와 백제는 같은 생각을 금속으로 옮겼다. 신라 무덤에서는 관 앞에 꽂도록 만든 새 날개나 나비 모양 금제 장식이 나온다. 백제는 6품 이상이 검은 관에 은꽃 장식을 달았고, 왕은 금꽃을 달았다.',
			'두 깃은 꿩 같은 새의 긴 꽁지깃으로, 곧게 세우거나 뒤로 눕혔다. 벽화에서 깃은 말 탄 사람과 함께 흔들린다.'
		],
		diagram: 'jougwan',
		records: [
			{
				kingdom: 'goguryeo',
				hanja: '大加主簿頭著幘，如幘而無餘，其小加著折風，形如弁。',
				en: 'The great lords and chief registrars wear a headcloth like the Chinese ze, but without its back flap; the lesser lords wear the jeolpung, shaped like a bian cap.',
				ko: '대가와 주부는 머리에 책을 쓰는데, 책과 같으나 뒷자락이 없다. 소가는 절풍을 쓰는데 그 모양이 고깔과 같다.',
				source: R.weiGoguryeo
			},
			{
				kingdom: 'goguryeo',
				hanja: '其冠曰骨蘇，多以紫羅爲之，雜以金銀爲飾。其有官品者，又插二鳥羽於其上，以顯異之。',
				en: 'Their cap is called the gol-so, mostly made of purple silk gauze and ornamented with gold and silver. Those who hold office also push two bird feathers into it, to set themselves apart.',
				ko: '관은 골소라 하는데 대개 자주색 비단으로 만들고 금은으로 섞어 꾸민다. 벼슬이 있는 사람은 그 위에 새 깃 두 개를 꽂아 남과 다름을 드러낸다.',
				source: R.zhouGoguryeo
			},
			{
				kingdom: 'baekje',
				hanja: '若朝拜祭祀，其冠兩廂加翅，戎事則不。',
				en: 'At court audiences and sacrifices, wings are added to both sides of the cap; in war, not.',
				ko: '조회나 제사 때는 관 양옆에 날개를 더하고, 전쟁 때는 하지 않는다.',
				source: R.zhouBaekje
			}
		]
	},
	{
		id: 'gold',
		title: 'Gold on the body',
		ko: '몸의 금',
		body: [
			'A Silla aristocrat was buried dressed in gold: earrings with thick or thin rings and hanging leaves, necklaces of gold and glass beads, bracelets and finger rings on every finger, and a gold belt hung with pendants of tools and fish, jade and tweezers that probably once marked what the wearer commanded.',
			'Baekje’s goldwork from King Muryeong’s tomb is finer and lighter: flame-shaped cap ornaments, hairpins, earrings with long chains, and gilt-bronze shoes with spiked soles meant for the grave.',
			'Gaya earrings and crowns follow their own forms, and Buyeo men, a Chinese visitor wrote, decorated their hats with gold and silver when they went abroad.'
		],
		bodyKo: [
			'신라 귀족은 금으로 차려입고 묻혔다. 굵은고리·가는고리에 나뭇잎 드리개를 단 귀걸이, 금과 유리구슬 목걸이, 팔찌, 손가락마다 반지, 그리고 연장·물고기·곱은옥·족집게 모양 드리개를 늘어뜨린 금제 허리띠. 드리개는 그 사람이 거느린 것을 나타냈으리라 본다.',
			'무령왕릉에서 나온 백제 금공품은 더 섬세하고 가볍다. 불꽃 모양 관식, 비녀, 긴 사슬 귀걸이, 바닥에 못을 박은 장례용 금동 신발.',
			'가야의 귀걸이와 관은 저마다의 형식을 따른다. 부여 사람은 나라 밖에 나갈 때 모자를 금은으로 꾸몄다고 중국 사신이 적었다.'
		],
		records: [
			{
				kingdom: 'buyeo',
				hanja: '在國衣尚白，白布大袂袍、袴，履革鞜。出國則尚繒繡錦罽，大人加狐狸、狖白、黑貂之裘，以金銀飾帽。',
				en: 'At home they prefer white: wide-sleeved robes and trousers of white cloth, and leather shoes. Abroad they prefer silk, embroidery, brocade and wool. Great men add furs of fox, white monkey and black sable, and ornament their hats with gold and silver.',
				ko: '나라 안에서는 흰옷을 숭상하여 흰 베로 소매 넓은 도포와 바지를 입고 가죽신을 신는다. 나라 밖에 나갈 때는 비단·수·금·모직을 즐기고, 대인은 여우·원숭이·검은담비 갖옷을 더 입으며 금은으로 모자를 꾸민다.',
				source: R.weiBuyeo
			}
		]
	},
	{
		id: 'men',
		title: 'Men’s dress',
		ko: '남자의 옷',
		body: [
			'Across all six kingdoms the base is the same northern riding dress: a jacket (yu, later jeogori) to the hips, crossed at the front and tied with a belt; wide trousers gathered at the ankle; boots or leather shoes. Over it, for rank or weather, a long coat.',
			'Goguryeo murals show the jacket edged at the collar, cuffs and hem with a band of another colour (the 襈 the histories mention), trousers loose and wide for the great and narrow for workers, and spotted or patterned silks for the rich. Baekje men dressed, the Chinese said, roughly like Goguryeo’s.',
			'Silla kept this dress until 649, when Kim Chunchu came home from Chang’an with Tang court robes and the court adopted them. From then on, Silla officials look like Tang officials in round-collared robes and soft black caps.'
		],
		bodyKo: [
			'여섯 나라 모두 바탕은 같은 북방 기마 복식이다. 엉덩이까지 오는 저고리(유)를 앞에서 여며 띠로 묶고, 발목에서 오므린 넓은 바지, 장화나 가죽신. 그 위에 신분이나 날씨에 따라 긴 포를 입는다.',
			'고구려 벽화의 저고리는 깃·소매끝·도련에 다른 색 선(사서가 말하는 襈)을 둘렀다. 귀인의 바지는 넓고 헐렁하며 일하는 사람의 바지는 좁다. 부자는 점무늬나 무늬 비단을 입었다. 백제 남자의 옷은 고구려와 대략 같았다고 중국인은 적었다.',
			'신라는 649년까지 이 옷을 입었다. 그해 김춘추가 장안에서 당의 관복을 가지고 돌아왔고, 조정이 이를 받아들였다. 그 뒤 신라 관리는 둥근 깃 포와 검은 복두를 쓴 당 관리처럼 보인다.'
		],
		diagram: 'layers',
		records: [
			{
				kingdom: 'goguryeo',
				hanja: '丈夫衣同袖衫、大口袴、白韋帶、黃革履。',
				en: 'Men wear jackets with sleeves of one width, wide-mouthed trousers, a white leather belt and yellow leather shoes.',
				ko: '남자는 통소매 적삼에 통 넓은 바지를 입고, 흰 가죽 띠를 두르며 누런 가죽신을 신는다.',
				source: R.zhouGoguryeo
			},
			{
				kingdom: 'silla',
				hanja: '其冠曰遺子禮，襦曰尉解，袴曰柯半，靴曰洗。',
				en: 'Their cap they call yujarye, their jacket wihae, their trousers gaban, their boots se.',
				ko: '관을 유자례, 저고리를 위해, 바지를 가반, 신을 세라 한다.',
				source: R.liangSilla
			},
			{
				kingdom: 'gojoseon',
				hanja: '滿亡命，聚黨千餘人，魋結蠻夷服而東走出塞。',
				en: 'Man fled into exile with a following of more than a thousand. He tied his hair in a topknot, put on the dress of the barbarians, and went east beyond the frontier.',
				ko: '만은 망명하여 무리 천여 명을 모아, 상투를 틀고 오랑캐 옷을 입고 동쪽으로 달아나 요새를 넘었다.',
				source: R.shiji
			}
		]
	},
	{
		id: 'women',
		title: 'Women’s dress',
		ko: '여자의 옷',
		body: [
			'Women wore the same jacket, often longer, over a skirt (chima) that reached the ground. Goguryeo murals show skirts finely pleated and banded in stripes, jackets edged with a contrasting trim at the collar, cuffs and hem, and sometimes trousers beneath the skirt.',
			'Hair said who you were. Baekje girls wore one braid coiled on the head with a single tail hanging down; married women wore two. Silla women braided their hair and wound it round the head, threaded with coloured silk and pearls. Goguryeo ladies in the murals wear tall coiled hair or a headcloth.',
			'In 664 Silla’s court women followed the men into Tang dress: the high-waisted long skirt, the short jacket and the shawl you can see on the seventh-century figurines from Yonggang-dong.'
		],
		bodyKo: [
			'여자도 같은 저고리를, 대개 더 길게 입고 땅에 닿는 치마를 입었다. 고구려 벽화의 치마는 잔주름을 잡고 줄무늬를 두르며, 저고리 깃·소매끝·도련에는 다른 색 선을 댔다. 치마 밑에 바지를 입기도 했다.',
			'머리 모양이 신분을 말했다. 백제 처녀는 땋은 머리를 머리 위에 틀고 한 가닥을 뒤로 늘였고, 혼인한 여자는 두 가닥으로 나눴다. 신라 여자는 머리를 땋아 머리에 두르고 색 비단과 구슬로 꾸몄다. 고구려 벽화의 귀부인은 높이 튼 머리나 수건을 쓴다.',
			'664년 신라 조정의 여자들도 남자들을 따라 당의 옷으로 바꿨다. 가슴 위까지 올린 긴 치마, 짧은 저고리, 어깨걸이. 용강동에서 나온 7세기 토용에서 볼 수 있다.'
		],
		records: [
			{
				kingdom: 'goguryeo',
				hanja: '婦人服裙襦，裾袖皆爲襈。',
				en: 'Women wear a skirt and jacket, both hem and sleeves edged with a band of trim.',
				ko: '부인은 치마와 저고리를 입는데, 옷자락과 소매에 모두 선을 두른다.',
				source: R.zhouGoguryeo
			},
			{
				kingdom: 'baekje',
				hanja: '婦人衣似袍，而袖微大。在室者，編髮盤於首，後垂一道爲飾；出嫁者，乃分爲兩道焉。',
				en: 'Women’s clothes are like a robe with slightly wide sleeves. A girl at home braids her hair, coils it on her head and lets one strand hang behind as an ornament; a married woman divides it into two.',
				ko: '부인의 옷은 도포 같은데 소매가 조금 넓다. 시집가지 않은 여자는 머리를 땋아 머리 위에 틀고 뒤로 한 가닥을 늘여 꾸미고, 시집간 여자는 두 가닥으로 나눈다.',
				source: R.zhouBaekje
			},
			{
				kingdom: 'silla',
				hanja: '服色尚素。婦人辮髮繞頭，以雜綵及珠爲飾。',
				en: 'They prefer plain undyed dress. Women braid their hair and wind it around the head, ornamented with coloured silks and pearls.',
				ko: '옷 색은 흰 것을 숭상한다. 부인은 머리를 땋아 머리에 두르고, 여러 색 비단과 구슬로 꾸민다.',
				source: R.suiSilla
			}
		]
	},
	{
		id: 'court',
		title: 'Rank and colour',
		ko: '관등과 옷 색',
		body: [
			'Every court dressed its ranks in colour. Silla’s law of 520 gave purple to the five highest ranks, crimson to the next four, blue to the next two and yellow to the rest, with ivory tablets for the purple and crimson. Bone rank capped how high a man could climb, so a robe’s colour also told you who his ancestors were.',
			'Baekje used purple for the sixth rank and above, with silver flowers on the cap, crimson to the eleventh and blue to the sixteenth, and belts coloured by rank. In Goguryeo the cap carried it: blue silk gauze for the noblest officials, crimson for the next, the two feathers for all who held office, and coarse brown cloth for everyone else.',
			'In 649 Silla traded its native court dress for Tang robes, and in 650 it began dating its documents by the Tang emperor’s era name. The colours stayed; the cut changed.'
		],
		bodyKo: [
			'어느 조정이나 관등을 색으로 입혔다. 신라는 520년의 법으로 상위 다섯 관등에 자색, 다음 넷에 비색, 다음 둘에 청색, 나머지에 황색을 주고, 자색과 비색에는 상아 홀을 들게 했다. 골품이 오를 수 있는 높이를 정했으니, 옷 색은 그 사람의 조상까지 말해 주었다.',
			'백제는 6품 이상이 자색에 관에 은꽃을 달고, 11품까지 비색, 16품까지 청색을 입었으며, 띠 색도 관등마다 달랐다. 고구려는 관이 신분을 드러냈다. 가장 귀한 관리는 푸른 비단 관, 다음은 붉은 비단 관, 벼슬이 있으면 누구나 새 깃 둘, 나머지 백성은 거친 갈색 베옷.',
			'649년 신라는 고유의 관복을 당의 관복으로 바꾸고, 650년부터 당의 연호를 썼다. 색은 남고 마름새가 바뀌었다.'
		],
		diagram: 'ranks',
		records: [
			{
				kingdom: 'silla',
				hanja: '法興王制：自太大角干至大阿飡紫衣，阿飡至級飡緋衣，並牙笏；大奈麻、奈麻靑衣；大舍至先沮知黃衣。',
				en: 'King Beopheung’s law: from Taedaegakgan to Daeachan, purple robes; from Achan to Geupchan, crimson robes, both with ivory tablets; Daenama and Nama, blue robes; Daesa down to Seonjeoji, yellow robes.',
				ko: '법흥왕이 제정하였다. 태대각간부터 대아찬까지는 자색 옷, 아찬부터 급찬까지는 비색 옷을 입되 모두 상아 홀을 들고, 대나마와 나마는 청색 옷, 대사부터 선저지까지는 황색 옷을 입는다.',
				source: R.sagiDress
			},
			{
				kingdom: 'silla',
				hanja: '眞德王在位二年，金春秋入唐，請襲唐儀，太宗皇帝詔可之，兼賜衣帶。遂還來施行，以夷易華。文武王在位四年，又革婦人之服，自此已後，衣冠同於中國。',
				en: 'In Queen Jindeok’s second year, Kim Chunchu went to Tang and asked to adopt Tang ceremony. Emperor Taizong granted it and gave him robes and belts. He came home and put it into practice, trading the native for the Chinese. In King Munmu’s fourth year the women’s dress was changed too, and from then on caps and robes were the same as China’s.',
				ko: '진덕왕 2년 김춘추가 당에 들어가 당의 의례를 따르기를 청하니, 태종이 조서로 허락하고 옷과 띠를 내렸다. 돌아와 시행하여 오랑캐의 것을 중화의 것으로 바꾸었다. 문무왕 4년에는 부인의 옷도 고쳐, 이후로 의관이 중국과 같아졌다.',
				source: R.sagiDress
			},
			{
				kingdom: 'baekje',
				hanja: '官人盡緋爲衣，銀花飾冠。庶人不得衣緋紫。',
				en: 'Officials all dress in crimson and ornament their caps with silver flowers. Commoners may not wear crimson or purple.',
				ko: '관리는 모두 붉은 옷을 입고 은꽃으로 관을 꾸민다. 서민은 붉은 옷이나 자줏빛 옷을 입을 수 없다.',
				source: R.tangBaekje
			},
			{
				kingdom: 'goguryeo',
				hanja: '官之貴者，則青羅爲冠，次以緋羅，插二鳥羽，及金銀爲飾。國人衣褐戴弁。',
				en: 'The noblest officials wear caps of blue silk gauze, the next of crimson gauze, with two bird feathers and ornaments of gold and silver. The common people wear coarse brown cloth and a peaked cap.',
				ko: '귀한 관리는 푸른 비단으로 관을 만들고, 그다음은 붉은 비단으로 만들며, 새 깃 둘을 꽂고 금은으로 꾸민다. 백성은 거친 베옷을 입고 고깔을 쓴다.',
				source: R.tangGoguryeo
			}
		]
	},
	{
		id: 'armor',
		title: 'Armour',
		ko: '갑옷',
		body: [
			'Two kinds of body armour meet on the peninsula. The older, made in Gaya and early Silla in the fourth and fifth centuries, is the plate cuirass: long iron strips or triangles riveted into a rigid shell, worn with a helmet of riveted vertical plates. Gaya’s iron made it the arsenal of the south.',
			'Lamellar replaced it: hundreds of small iron plates laced in overlapping rows, flexible enough for a rider. Goguryeo murals show whole lines of cavalry in lamellar to the knee, with horses in lamellar barding and face plates, the armoured horse (gaema) the histories feared. Silla and Gaya tombs have yielded real horse armour.',
			'Baekje lacquered its armour; a black-lacquered lamellar piece inscribed with a Tang date of 645 was dug out of Gongsanseong, and Baekje sent the Tang emperor gold-lacquered armour that year. The common sword of all three kingdoms was the straight ring-pommel dao.'
		],
		bodyKo: [
			'한반도에는 두 종류의 갑옷이 만난다. 오래된 쪽은 4–5세기 가야와 초기 신라에서 만든 판갑이다. 긴 철판이나 삼각형 철판을 못으로 이어 단단한 껍데기를 만들고, 세로판을 이은 투구를 쓴다. 가야의 철이 가야를 남쪽의 무기고로 만들었다.',
			'그 뒤를 찰갑이 이었다. 수백 개의 작은 철편을 겹쳐 엮어, 말 위에서도 움직일 만큼 유연하다. 고구려 벽화에는 무릎까지 찰갑을 입은 기병이 줄지어 있고, 말도 찰갑 마갑과 말 얼굴가리개를 썼다. 사서가 두려워한 개마다. 신라와 가야 고분에서는 실제 마갑이 나왔다.',
			'백제는 갑옷에 옻칠을 했다. 공산성에서 당의 연호로 645년을 새긴 검은 옻칠 찰갑이 나왔고, 그해 백제는 당 황제에게 금칠 갑옷을 보냈다. 세 나라에 공통된 칼은 곧은 고리자루칼이었다.'
		],
		diagram: 'armor'
	},
	{
		id: 'customs',
		title: 'Hair, skin and other customs',
		ko: '머리, 몸, 그 밖의 풍속',
		body: [
			'Men tied their hair in a topknot. When the Chinese defector Wiman crossed into Gojoseon, the record says, he tied his hair in a topknot and put on local dress, and the southern Han peoples went bare-headed with the knot showing.',
			'In the south, the Mahan (whose lands became Baekje’s) valued strung beads more than gold or silk, sewing them onto clothes and hanging them from the neck and ears. Among the Jinhan and Byeonhan, ancestors of Silla and Gaya, a stone was pressed against a newborn’s head to flatten it, and men and women near the Wa coast tattooed their bodies.',
			'Gojoseon is known mostly through bronze: the lute-shaped Liaoning-type dagger, fine-lined mirrors with several knobs, and ornaments that were worn or carried for ritual. Buyeo, a visitor wrote, wore white at home.'
		],
		bodyKo: [
			'남자는 상투를 틀었다. 중국에서 망명한 위만이 고조선에 들어올 때 상투를 틀고 이곳 옷을 입었다고 기록은 전하고, 남쪽 한의 사람들은 맨머리에 상투를 드러냈다.',
			'남쪽의 마한(훗날 백제의 땅) 사람들은 금이나 비단보다 꿴 구슬을 귀히 여겨 옷에 달거나 목과 귀에 걸었다. 신라와 가야의 조상인 진한과 변한에서는 갓난아기 머리를 돌로 눌러 납작하게 했고, 왜에 가까운 바닷가 사람들은 남녀 모두 문신을 했다.',
			'고조선은 주로 청동기로 알려진다. 비파 모양의 요령식 동검, 꼭지가 여럿 달린 잔무늬 거울, 몸에 걸거나 의례 때 들던 장신구들. 부여는 나라 안에서 흰옷을 입었다고 방문자가 적었다.'
		],
		records: [
			{
				kingdom: 'baekje',
				hanja: '以瓔珠爲財寶，或以綴衣爲飾，或以縣頸垂耳，不以金銀錦繡爲珍。',
				en: 'The Mahan count strung beads as treasure, sewing them onto their clothes or hanging them from neck and ears, and do not prize gold, silver, brocade or embroidery.',
				ko: '마한 사람은 구슬을 보배로 여겨 옷에 꿰매 꾸미거나 목에 걸고 귀에 늘어뜨리며, 금은이나 비단은 보배로 여기지 않는다.',
				source: R.weiHan
			},
			{
				kingdom: 'gaya',
				hanja: '兒生，便以石厭其頭，欲其褊。今辰韓人皆褊頭。男女近倭，亦文身。',
				en: 'When a child is born they press its head with a stone to make it flat; the people of Jinhan all have flat heads today. Men and women near the Wa also tattoo themselves.',
				ko: '아이가 태어나면 돌로 머리를 눌러 납작하게 하려 하니, 지금 진한 사람은 모두 머리가 납작하다. 왜와 가까운 남녀는 문신도 한다.',
				source: R.weiHan
			}
		]
	},
	{
		id: 'neighbors',
		title: 'The neighbours: Tang and Asuka Yamato',
		ko: '이웃 나라: 당과 아스카의 야마토',
		body: [
			'Tang Chang’an set the fashion for the whole of East Asia in the seventh century. Men at court wore round-collared robes belted with plaques and the soft black futou cap with its two stiff tails. Women piled their hair into tall looped chignons fixed with gold combs, and wore short jackets over long skirts tied high under the bust, with a translucent silk shawl over the shoulders.',
			'Yamato, across the sea, learned much of its court dress through Baekje and Goguryeo. The women of the Takamatsuzuka mural wear long belted jackets over striped pleated skirts, close cousins of the Goguryeo murals. Men wore round-collared robes and black caps, and boys looped their hair beside the ears.',
			'In 649 Silla took Tang robes for its men, and in 664 for its women. Yamato followed Tang more slowly, through its own court reforms.'
		],
		bodyKo: [
			'7세기 동아시아의 유행은 당의 장안이 정했다. 조정의 남자는 띠돈을 단 띠를 맨 둥근 깃 포에, 뻣뻣한 두 날개가 달린 검은 복두를 썼다. 여자는 금 빗을 꽂아 머리를 높이 틀어 올리고, 짧은 저고리에 가슴 밑까지 올려 묶은 긴 치마를 입고 어깨에 비치는 비단 숄을 걸쳤다.',
			'바다 건너 야마토는 궁중 복식의 많은 부분을 백제와 고구려를 통해 배웠다. 다카마쓰즈카 벽화의 여인들은 줄무늬 주름치마 위에 띠 맨 긴 저고리를 입어 고구려 벽화와 아주 가깝다. 남자는 둥근 깃 포에 검은 관을 썼고, 소년은 귀 옆에 머리를 고리처럼 묶었다.',
			'신라는 649년 남자의 옷을, 664년 여자의 옷을 당의 것으로 바꿨다. 야마토는 자기 조정의 개혁을 거치며 더 천천히 당을 따랐다.'
		]
	}
];

/** The side-by-side table: one row per feature, one cell per kingdom (in KINGDOM_ORDER, without `abroad`). */
export const COMPARE: { feature: string; ko: string; cells: Record<Exclude<ResearchKingdom, 'abroad'>, [string, string]> }[] = [
	{
		feature: 'Men’s head',
		ko: '남자 머리',
		cells: {
			gojoseon: ['Topknot', '상투'],
			buyeo: ['Hats trimmed in gold and silver abroad', '나라 밖에선 금은으로 꾸민 모자'],
			goguryeo: ['Jeolpung cap; two feathers for office', '절풍, 벼슬아치는 새 깃 둘'],
			baekje: ['Black silk cap; silver flowers for officials, gold for the king', '검은 비단 관, 관리는 은꽃, 왕은 금꽃'],
			silla: ['Silk or birch-bark cap with gold wings; Tang cap after 649', '비단·자작나무 껍질 관에 금 날개, 649년 뒤 당의 복두'],
			gaya: ['Cap with feather-like metal ornaments', '깃 모양 금속 장식의 관']
		}
	},
	{
		feature: 'Crown',
		ko: '왕관',
		cells: {
			gojoseon: ['—', '—'],
			buyeo: ['—', '—'],
			goguryeo: ['Gilt-bronze, flame openwork; king’s white silk cap with gold', '불꽃무늬 금동관, 왕은 금 장식 흰 비단 관'],
			baekje: ['Gilt-bronze peaked caps; gold flame ornaments on black silk', '금동 고깔 관, 검은 비단 관에 금 불꽃 관식'],
			silla: ['Gold: 出-shaped trees, antlers, jade, spangles', '금관: 出자 나무, 사슴뿔, 곱은옥, 달개'],
			gaya: ['Gold: plant-shaped uprights', '금관: 풀잎 모양 세움장식']
		}
	},
	{
		feature: 'Men’s dress',
		ko: '남자 옷',
		cells: {
			gojoseon: ['Local dress (record names it, does not describe it)', '토착 옷(기록은 이름만 남김)'],
			buyeo: ['White wide-sleeved robes and trousers', '흰 베의 넓은 소매 포와 바지'],
			goguryeo: ['Trimmed jacket, wide trousers, white belt, yellow shoes', '선 두른 저고리, 넓은 바지, 흰 띠, 누런 가죽신'],
			baekje: ['Much like Goguryeo; king in purple and blue brocade', '고구려와 비슷, 왕은 자주 포에 푸른 비단 바지'],
			silla: ['Jacket and trousers; Tang robes from 649', '저고리와 바지, 649년부터 당 관복'],
			gaya: ['Clean clothes, long hair, fine broad cloth (Byeonhan)', '깨끗한 옷, 긴 머리, 넓고 고운 베(변한)']
		}
	},
	{
		feature: 'Women',
		ko: '여자',
		cells: {
			gojoseon: ['—', '—'],
			buyeo: ['—', '—'],
			goguryeo: ['Pleated skirt; trim at hem and sleeves', '주름치마, 도련과 소매에 선'],
			baekje: ['Robe-like dress; one braid unmarried, two married', '도포 같은 옷, 처녀는 한 가닥, 부인은 두 가닥'],
			silla: ['Braids wound round the head with silk and pearls; Tang dress from 664', '머리에 두른 땋은 머리에 비단과 구슬, 664년부터 당의 옷'],
			gaya: ['Gold and glass-bead earrings and necklaces in the tombs', '무덤 속 금귀걸이와 유리구슬 목걸이']
		}
	},
	{
		feature: 'Rank shown by',
		ko: '신분 표시',
		cells: {
			gojoseon: ['—', '—'],
			buyeo: ['Furs: fox, sable', '갖옷: 여우, 담비'],
			goguryeo: ['Cap colour (blue, crimson) and feathers', '관 색(청·비)과 깃'],
			baekje: ['Robe colour (purple, crimson, blue) and belt colour', '옷 색(자·비·청)과 띠 색'],
			silla: ['Robe colour (purple, crimson, blue, yellow), capped by bone rank', '옷 색(자·비·청·황), 골품이 상한'],
			gaya: ['Grave goods: crowns, armour, iron', '껴묻거리: 관, 갑옷, 철']
		}
	},
	{
		feature: 'Armour',
		ko: '갑옷',
		cells: {
			gojoseon: ['Bronze daggers; little armour survives', '청동검, 남은 갑옷은 드묾'],
			buyeo: ['—', '—'],
			goguryeo: ['Lamellar to the knee; armoured horses', '무릎까지 찰갑, 개마'],
			baekje: ['Lacquered lamellar', '옻칠 찰갑'],
			silla: ['Lamellar; horse armour (Jjoksaem)', '찰갑, 마갑(쪽샘)'],
			gaya: ['Riveted plate cuirasses, then lamellar; horse armour', '판갑에서 찰갑으로, 마갑']
		}
	}
];

/** Key objects with no freely licensed photograph: named under their topic, with the museum that holds them. */
export const ELSEWHERE: { topic: TopicId; title: string; ko: string; where: string; url: string }[] = [
	{ topic: 'crowns', title: 'Gold crown attributed to Gaya (National Treasure 138)', ko: '전 고령 금관 (국보 138호)', where: 'Leeum Museum of Art', url: 'https://www.leeumhoam.org' },
	{ topic: 'crowns', title: 'Gilt-bronze cap from Ipjeom-ri, Iksan', ko: '익산 입점리 금동관모', where: 'National Museum of Korea', url: 'https://www.museum.go.kr' },
	{ topic: 'feathers', title: 'Baekje silver flower cap ornaments', ko: '백제 은제 관식', where: 'Buyeo National Museum', url: 'https://buyeo.museum.go.kr' },
	{ topic: 'feathers', title: 'Silla birch-bark caps', ko: '신라 자작나무 껍질 관모', where: 'Gyeongju National Museum', url: 'https://gyeongju.museum.go.kr' },
	{ topic: 'armor', title: 'Black-lacquered lamellar armour from Gongsanseong, dated 645', ko: '공산성 옻칠 갑옷 (645년)', where: 'Gongju National Museum', url: 'https://gongju.museum.go.kr' },
	{ topic: 'armor', title: 'Horse armour from Malijeong, Haman', ko: '함안 마갑총 말갑옷', where: 'Haman Museum', url: 'https://www.haman.go.kr/museum.web' },
	{ topic: 'armor', title: 'Horse armour from the Jjoksaem tombs, Gyeongju', ko: '경주 쪽샘 말갑옷', where: 'Gyeongju National Research Institute of Cultural Heritage', url: 'https://www.nrich.go.kr/gyeongju' },
	{ topic: 'armor', title: 'Armoured warriors of the Samsilchong mural', ko: '삼실총 벽화의 무사', where: 'Goguryeo tombs, Ji’an (UNESCO)', url: 'https://whc.unesco.org/en/list/1135' }
];

export const MUSEUMS: { name: string; ko: string; city: string; note: string; url: string }[] = [
	{ name: 'National Museum of Korea', ko: '국립중앙박물관', city: 'Seoul', note: 'The national collection; its e-museum catalogues every piece with photos, many free to reuse.', url: 'https://www.museum.go.kr' },
	{ name: 'Gyeongju National Museum', ko: '국립경주박물관', city: 'Gyeongju', note: 'Silla gold crowns, belts and earrings from the great tombs.', url: 'https://gyeongju.museum.go.kr' },
	{ name: 'Gongju National Museum', ko: '국립공주박물관', city: 'Gongju', note: 'The finds from King Muryeong’s tomb: cap ornaments, shoes, earrings.', url: 'https://gongju.museum.go.kr' },
	{ name: 'Buyeo National Museum', ko: '국립부여박물관', city: 'Buyeo', note: 'Baekje of the Sabi era, including the gilt-bronze incense burner.', url: 'https://buyeo.museum.go.kr' },
	{ name: 'Gimhae National Museum', ko: '국립김해박물관', city: 'Gimhae', note: 'Gaya iron: plate armour, helmets, horse gear.', url: 'https://gimhae.museum.go.kr' },
	{ name: 'Daegaya Museum', ko: '대가야박물관', city: 'Goryeong', note: 'Daegaya royal tombs at Jisan-dong, crowns and armour.', url: 'https://www.goryeong.go.kr/daegaya' },
	{ name: 'Leeum Museum of Art', ko: '리움미술관', city: 'Seoul', note: 'The gold crown attributed to Gaya, National Treasure 138.', url: 'https://www.leeumhoam.org' },
	{ name: 'Hanseong Baekje Museum', ko: '한성백제박물관', city: 'Seoul', note: 'Early Baekje, with reconstructions of dress and armour.', url: 'https://baekjemuseum.seoul.go.kr' },
	{ name: 'Afrasiyab Museum', ko: '아프라시아브 박물관', city: 'Samarkand', note: 'The ambassadors’ mural with two feather-capped envoys from the east.', url: 'https://en.wikipedia.org/wiki/Afrasiyab_murals' },
	{ name: 'Tokyo National Museum', ko: '도쿄국립박물관', city: 'Tokyo', note: 'The Ogura collection of Korean goldwork and armour.', url: 'https://www.tnm.jp' }
];

export const READING: { title: string; ko?: string; author: string; note: string; url?: string }[] = [
	{ title: 'Encyclopedia of Korean Culture', ko: '한국민족문화대백과사전', author: 'Academy of Korean Studies', note: 'Entries on jeolpung, jougwan, geumgwan, chalgap, each kingdom’s dress.', url: 'https://encykorea.aks.ac.kr' },
	{ title: 'Korean History Database: the Chinese histories on Korea', ko: '한국사데이터베이스 중국정사 조선전', author: 'National Institute of Korean History', note: 'The Eastern Barbarian chapters quoted on this page, in original and Korean translation.', url: 'https://db.history.go.kr' },
	{ title: 'Samguk Sagi, Treatise on colours of dress', ko: '삼국사기 잡지 색복', author: 'Kim Busik (1145)', note: 'Silla, Goguryeo and Baekje rank dress in one chapter.', url: 'https://db.history.go.kr' },
	{ title: 'National Museum of Korea e-museum', ko: 'e뮤지엄', author: 'Korean national and public museums', note: 'Searchable photographs of nearly every excavated object, many under the KOGL licence.', url: 'https://www.emuseum.go.kr' },
	{ title: 'Silla: Korea’s Golden Kingdom', author: 'Metropolitan Museum of Art (2013)', note: 'Exhibition catalogue on Silla gold, with essays on the crowns and how they were worn.', url: 'https://www.metmuseum.org/met-publications/silla-koreas-golden-kingdom' },
	{ title: 'The Ambassadors’ Painting at Afrasiyab', author: 'Matteo Compareti and others', note: 'On the two Korean envoys in the Samarkand mural and their feather caps.' }
];
