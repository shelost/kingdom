import type { Block, ImageSlot } from '$lib/story';

/**
 * The Later Three Kingdoms, told as one episode. Not part of the chronicle's
 * reading order — `/later` renders this on its own.
 *
 * Stills are intro-card frames. `src` stays empty until the file is in
 * `static/later/`; the page hides a slot with nothing to show.
 */
export const LATER_CAST = [
	'jinsung',
	'wonjong',
	'aeno',
	'yeonggi',
	'uryeon',
	'ajagae',
	'kyunhwon',
	'yanggil',
	'gungye',
	'wanggun',
	'gyeongae',
	'gyeongsun',
	'singeom'
] as const;

function still(id: string, at: string, alt: string, people: string[], src?: string): ImageSlot {
	return { id, ratio: 2, alt, at, people, wide: true, ...(src ? { src } : {}) };
}

export const laterImages: ImageSlot[] = [
	still('later-sabeol-yard', 'Two men there have had enough', 'Wonjong and Aeno in the night yard at Sabeolju, grain jars behind them', ['wonjong', 'aeno'], '/later/later-sabeol-yard.jpg'),
	still('later-yeonggi-turns', 'He comes over the ridge', 'Yeonggi on horseback, turning away from the town', ['yeonggi']),
	still('later-uryeon', 'An old village head goes in', 'Uryeon charging with a short spear, seen from the dirt', ['uryeon']),
	still('later-jinsung-room', 'The crown is on the table', 'Queen Jinseong among short-haired men, the crown set aside, enjoying them', ['jinsung'], '/later/later-jinsung-room.jpg'),
	still('later-jinsung-pull', 'She pulls the nearest one down', 'Queen Jinseong pulling a short-haired man down by his headband', ['jinsung'], '/later/later-jinsung-pull.jpg'),
	still('later-jinsung-laugh', 'Another one laughs', 'Queen Jinseong with her head back, a man at her knee, mouth open', ['jinsung'], '/later/later-jinsung-laugh.jpg'),
	still('later-jinsung-lamp', 'The lamp sees more of her', 'Queen Jinseong flushed in lamplight, a man’s bare shoulder against her', ['jinsung'], '/later/later-jinsung-lamp.jpg'),
	still('later-jinsung-store', 'She stands in the building', 'Queen Jinseong in an empty storehouse, one lamp at her feet', ['jinsung'], '/later/later-jinsung-store.jpg'),
	still('later-ajagae-gate', 'His son is already packed', 'Ajagae at the Sangju gate, his son walking away down the road', ['ajagae', 'kyunhwon'], '/later/later-ajagae-gate.jpg'),
	still('later-yanggil-three', 'The merchant’s son is already in the yard', 'Yang Gil seated, Gung Ye and Wang Geon below him', ['yanggil', 'gungye', 'wanggun'], '/later/later-yanggil-three.jpg'),
	still('later-yanggil-yard', 'lends soldiers the way other men lend oxen', 'Yang Gil seated in his yard, Gung Ye standing below him', ['yanggil', 'gungye'], '/later/later-yanggil-yard.jpg'),
	still('later-sabi-vow', 'the old palace at Sabi', 'Kyun Hwon in the old Sabi palace, vowing for Euija', ['kyunhwon'], '/later/later-sabi-vow.jpg'),
	still('later-sabi-letter', 'He picks one up like a letter', 'Kyun Hwon kneeling in the ruined palace, a piece of old gold in his hand', ['kyunhwon'], '/later/later-sabi-letter.jpg'),
	still('later-kyun-void', 'He looks down from the gate', 'Kyun Hwon from under the chin, black void, looking down', ['kyunhwon'], '/later/later-kyun-void.jpg'),
	still('later-kyun-volume', 'The cloak comes first', 'Kyun Hwon, chest and cloak huge in the foreground, face above', ['kyunhwon'], '/later/later-kyun-volume.jpg'),
	still('later-wansan', 'He puts a chair in the gate', 'Kyun Hwon at the Wansan gate, a chair set in the doorway', ['kyunhwon'], '/later/later-wansan.jpg'),
	still('later-gungye-void', 'Under him there is no hall', 'Gung Ye from under the chin, black void, looking down', ['gungye'], '/later/later-gungye-void.jpg'),
	still('later-gungye-volume', 'The shoulder comes first', 'Gung Ye, shoulder huge in the foreground, face smaller above', ['gungye'], '/later/later-gungye-volume.jpg'),
	still('later-gungye-below', 'From the floor he is a pillar', 'Gung Ye from the floor of the hall, gold patch in the lamp', ['gungye'], '/later/later-gungye-below.jpg'),
	still('later-maitreya', 'The chair was empty on purpose', 'Gung Ye from the floor, telling the hall the chair was for him', ['gungye'], '/later/later-maitreya.jpg'),
	still('later-cheorwon', 'the gate opens from the inside', 'The Cheorwon gate at night, Wang Geon on the step', ['wanggun', 'gungye'], '/later/later-cheorwon.jpg'),
	still('later-wanggun-bolt', 'His boot is on the threshold', 'Wang Geon from the threshold, hand on the bolt', ['wanggun'], '/later/later-wanggun-bolt.jpg'),
	still('later-wang-void', 'The count is already done', 'Wang Geon from under the chin, black void, looking down', ['wanggun'], '/later/later-wang-void.jpg'),
	still('later-wang-volume', 'The plate comes first', 'Wang Geon, armor plate huge in the foreground, face above', ['wanggun'], '/later/later-wang-volume.jpg'),
	still('later-wang-names', 'He has the names before the night does', 'Wang Geon by one lamp, the names already in his hand', ['wanggun'], '/later/later-wang-names.jpg'),
	still('later-gongsan', 'the king of the old capital rides out', 'King Gyeongae riding out of the capital gate as Kyun Hwon comes in', ['gyeongae', 'kyunhwon']),
	still('later-kyun-yard', 'The king dies in his own yard', 'Kyun Hwon from the palace yard floor, the king fallen behind him', ['kyunhwon'], '/later/later-kyun-yard.jpg'),
	still('later-gochang', 'the merchant\'s son is the one still mounted', 'Wang Geon still mounted at dusk, Kyun Hwon\'s horse already turning', ['wanggun', 'kyunhwon'], '/later/later-gochang.jpg'),
	still('later-two-kings', 'The last battle was supposed to be two kings', 'The battle that was meant to be two kings, and the son standing in the way', ['singeom', 'kyunhwon', 'wanggun'], '/later/later-two-kings.jpg'),
	still('later-barred-gate', 'The other son bars the gate', 'Kyun Singum behind a barred gate, his father outside in the rain', ['singeom', 'kyunhwon'], '/later/later-singeom-gate.jpg'),
	{ ...still('later-singeom-vow', 'The son was not in that story.', 'Kyun Singum stands in the dark hall. His father kneels by the one lamp', ['singeom', 'kyunhwon'], '/later/later-singeom-vow.jpg'), say: false },
	{ ...still('later-singeom-bar', 'The other son bars the gate and kills the boy.', 'A timber bar across the temple door. Kyun Singum and his father stand on either side of it', ['singeom', 'kyunhwon'], '/later/later-singeom-bar.jpg'), say: false },
	{ ...still('later-singeom-favorite', 'kills the boy.', 'Kyun Singum stands. Kyun Gumgang sits. The lamp is between them', ['singeom', 'geumgang'], '/later/later-singeom-favorite.jpg'), say: false },
	{ ...still('later-singeom-threshold', 'Not as a king.', 'Kyun Hwon sits in the doorway and looks up at his son', ['kyunhwon', 'singeom'], '/later/later-singeom-threshold.jpg'), say: false },
	still('later-singeom-rain', 'The rain is on his face', 'Kyun Hwon at the bars in the rain, Kyun Singum inside, neither looking away', ['kyunhwon', 'singeom']),
	still('later-kyun-horse', 'asks for a horse', 'Kyun Hwon in the rain looking up at Wang Geon, a horse at the step', ['kyunhwon', 'wanggun'], '/later/later-kyun-horse.jpg'),
	still('later-singeom-door', 'From the dirt he is the whole door', 'Kyun Singum from the dirt, looking down, sword at his side', ['singeom'], '/later/later-singeom-door.jpg'),
	still('later-singeom-hall', 'The hall is already his', 'Kyun Singum on the hall step, lit from the floor, the bar across the door', ['singeom'], '/later/later-singeom-stoic.jpg'),
	still('later-singeom-wind', 'The wind takes his hair', 'Kyun Singum in the hall wind, half-lidded, sword hanging', ['singeom'], '/later/later-singeom-wind.jpg'),
	still('later-singeom-void', 'The room goes black', 'Kyun Singum from under the chin, black void, sword, looking down', ['singeom'], '/later/later-singeom-void.jpg'),
	still('later-singeom-volume', 'The chest comes first', 'Kyun Singum, chest huge in the foreground, face above, sword at the hip', ['singeom'], '/later/later-singeom-volume.jpg'),
	still('later-singeom-bank', 'The bank is his', 'Kyun Singum on the river bank, looking down, hair in the wind', ['singeom'], '/later/later-singeom-bank.jpg'),
	still('later-seals', 'He walks out with the seals', 'King Gyeongsun walking out with a box of seals', ['gyeongsun']),
	still('later-illicheon', 'They meet at a river', 'Illicheon from the bank, two small hosts, the father on the far side', ['kyunhwon', 'singeom', 'wanggun'], '/later/later-illicheon.jpg'),
	still('later-river-look', 'The son does not bow', 'Kyun Hwon in the river, Kyun Singum on the bank, looking at each other', ['kyunhwon', 'singeom'])
];

const blocks: Block[] = [
	{
		kind: 'p',
		html: 'You know how the old stories end. One crown. A river. The right king on the bank.',
		ko: '옛이야기가 어떻게 끝나는지, 알지. 왕관 하나. 강 하나. 기슭에 있어야 할 왕.'
	},
	{
		kind: 'p',
		html: 'This one was walking there. Then a son closed a gate.',
		ko: '이번 이야기도 그쪽으로 가고 있었다. 그런데 아들이 문을 닫았다.'
	},
	{
		kind: 'p',
		html: 'By then the country had one mind. Wonhyo’s. The books said Ilsim. The road said Hanmaum. The old gods were a story you told a child, and did not light.',
		ko: '그때쯤 나라에는 마음이 하나였다. 원효의 마음. 책에서는 일심이라 했다. 길에서는 한마음이라 했다. 옛 신들은, 아이에게 들려주고 불은 켜지 않는 이야기였다.'
	},
	{
		kind: 'p',
		html: 'People waited for a man. The huts were still up. Almost nobody sent for them.',
		ko: '사람들은 사내 하나를 기다렸다. 오두막은 아직 서 있었다. 부르는 사람은 거의 없었다.'
	},
	{
		kind: 'p',
		html: 'A queen sent one general to one village. He looked at the village, and he went home.',
		ko: '여왕이 장군 하나를 마을 하나로 보냈다. 장군은 마을을 보고, 돌아왔다.'
	},
	{ kind: 'scene', label: 'Sabeolju', ko: '사벌주', year: 889 },
	{
		kind: 'p',
		html: 'The storehouse in the capital is empty. So the capital goes to the villages.',
		ko: '서울의 곳간이 비었다. 그래서 서울이 마을로 간다.'
	},
	{
		kind: 'p',
		html: 'Sabeolju is a grain town. Two men there have had enough of being a storehouse.',
		ko: '사벌주는 곡식 고을이다. 그곳의 두 남자는 곳간 노릇이 지긋지긋하다.'
	},
	{
		kind: 'dialogue',
		chip: '#c4a574',
		person: 'wonjong',
		lines: ['또 항아리를 셌어.'],
		en: ['They counted our jars again.']
	},
	{
		kind: 'dialogue',
		chip: '#8d4a3a',
		person: 'aeno',
		lines: ['그럼 항아리를 그만두자.'],
		en: ['Then we stop being jars.']
	},
	{
		kind: 'dialogue',
		chip: '#c4a574',
		person: 'wonjong',
		lines: ['군사들은.'],
		en: ['And the soldiers.']
	},
	{
		kind: 'dialogue',
		chip: '#8d4a3a',
		person: 'aeno',
		lines: ['우리도 세라고 해.'],
		en: ['Let them count us too.']
	},
	{
		kind: 'p',
		html: 'They do not make a speech. They keep the grain. By morning the next village has heard that someone kept it.',
		ko: '연설 같은 건 없다. 곡식을 안 내놓는다. 아침이면 옆 마을이 듣는다. 누가 안 내놨다는 걸.'
	},
	{
		kind: 'p',
		html: 'Three risings before this one were crushed before the rice went cold. This is the one a royal horse turns around for.',
		ko: '이번 전에 일어난 셋은 밥이 식기 전에 꺼졌다. 왕의 말이 고개를 돌린 건 이번이다.'
	},
	{ kind: 'scene', label: 'The road', ko: '돌아가는 길', year: 889 },
	{
		kind: 'p',
		html: 'She sends Yeonggi.',
		ko: '여왕이 영기를 보낸다.'
	},
	{
		kind: 'p',
		html: 'He comes over the ridge at dusk. More men than he brought. More than a town ought to hold. He does not dismount.',
		ko: '해 질 녘에 고개 위로 온다. 데려온 군사보다 많다. 고을이 품기엔 많다. 그는 말에서 내리지 않는다.'
	},
	{
		kind: 'dialogue',
		chip: '#2A5FB8',
		person: 'yeonggi',
		lines: ['돌아간다.'],
		en: ["We're turning around."]
	},
	{
		kind: 'p',
		html: 'An old village head goes in with a short spear and the men he can call by name.',
		ko: '늙은 촌주가 짧은 창을 들고 들어간다. 이름을 부를 수 있는 사람들만 데리고.'
	},
	{
		kind: 'dialogue',
		chip: '#d7d2c8',
		person: 'uryeon',
		lines: ['장군이 안 하면, 내가 한다.'],
		en: ["If the general won't, I will."]
	},
	{
		kind: 'p',
		html: 'Uryeon dies in the street he was defending. The general is already on the road south, and still in the saddle.',
		ko: '우련은 지키던 골목에서 죽는다. 장군은 이미 남쪽 길에 있다. 아직 말 위다.'
	},
	{
		kind: 'p',
		html: 'The queen hears both stories before noon.',
		ko: '여왕은 두 이야기를 한낮이 되기 전에 듣는다.'
	},
	{
		kind: 'dialogue',
		chip: '#3d3a6b',
		person: 'jinsung',
		lines: ['죽은 사람 아들에게 상을 내려라.'],
		en: ["Reward the dead man's son."]
	},
	{
		kind: 'dialogue',
		chip: '#9aa4b2',
		speaker: 'A minister',
		lines: ['장군은요.'],
		en: ['And the general.']
	},
	{
		kind: 'dialogue',
		chip: '#3d3a6b',
		person: 'jinsung',
		lines: ['걸어서 가게 해라. 다시는 말을 주지 마라.'],
		en: ['He can walk home. He will not ride for me again.']
	},
	{
		kind: 'p',
		html: 'Every village has now watched a royal horse turn around.',
		ko: '이제 어느 마을이나 보았다. 왕의 말이 고개를 돌리는 걸.'
	},
	{
		kind: 'p',
		html: 'In the villages they still tell the old ones.',
		ko: '마을에서는 아직 옛이야기를 한다.'
	},
	{
		kind: 'p',
		html: 'A sword held backwards. A monk who argued with a hill. A general who would not sit down.',
		ko: '칼을 거꾸로 쥔 사람. 언덕과 말다툼한 중. 앉지 않은 장군.'
	},
	{ kind: 'scene', label: 'The inner room', ko: '안채', year: 889 },
	{
		kind: 'p',
		html: 'The crown is on the table. The boys are not. Crescent bands, shirts off, and she has stopped counting them.',
		ko: '왕관은 상 위에 있다. 젊은이들은 아니다. 초승달 띠, 웃옷은 벗어 두고, 그녀는 세는 것을 그만둔다.'
	},
	{
		kind: 'p',
		html: 'She pulls the nearest one down by the band. Short hair. A shoulder she can get a hand around. She likes the weight of him.',
		ko: '가장 가까운 아이를 띠를 잡아 끌어내린다. 짧은 머리. 한 손으로 잡히는 어깨. 그 무게가 좋다.'
	},
	{
		kind: 'p',
		html: 'Another one laughs. She does not. Her mouth is already open for a different reason.',
		ko: '또 하나가 웃는다. 그녀는 웃지 않는다. 입은 이미 다른 이유로 벌어져 있다.'
	},
	{
		kind: 'p',
		html: 'The lamp sees more of her than the court does.',
		ko: '등잔이, 조정보다 그녀의 더 많은 것을 본다.'
	},
	{ kind: 'scene', label: 'The storehouse', ko: '곳간', year: 889 },
	{
		kind: 'p',
		html: 'She stands in the building with one lamp. The floor is swept. That is the grain. A swept floor.',
		ko: '등잔 하나를 두고 건물 안에 서 있다. 바닥은 쓸려 있다. 곡식이라고는 그뿐이다. 쓸린 바닥.'
	},
	{
		kind: 'p',
		html: 'She has been queen for two winters. Her brothers wore the crown and left her the bill.',
		ko: '여왕이 된 지 두 겨울이다. 오빠들이 왕관을 쓰고, 청구서를 남겼다.'
	},
	{
		kind: 'dialogue',
		chip: '#9aa4b2',
		speaker: 'A minister',
		lines: ['폐하. 서쪽이 또 늦습니다.'],
		en: ['Majesty. The west is late again.']
	},
	{
		kind: 'dialogue',
		chip: '#3d3a6b',
		person: 'jinsung',
		lines: ['늦은 게 아니야. 간 거야.'],
		en: ['The west is not late. The west is gone.']
	},
	{
		kind: 'p',
		html: 'She is early. The west does not wait for a queen to catch up.',
		ko: '그녀는 빠르다. 서쪽은 여왕을 기다려 주지 않는다.'
	},
	{ kind: 'scene', label: 'Sangju', ko: '상주', year: 889 },
	{
		kind: 'p',
		html: "Ajagae keeps a gate a day's walk from the trouble. He is not a king. He is the man the jars are afraid of.",
		ko: '아자개는 그 소란에서 하룻길인 곳에 문을 가지고 있다. 왕은 아니다. 항아리들이 무서워하는 남자다.'
	},
	{
		kind: 'p',
		html: 'A child is born in the room behind that gate. Kyun Hwon’s. The first. The cry is the reason the pack is by the door.',
		ko: '그 문 안쪽 방에서 아이가 태어난다. 견훤의 아이. 첫째. 그 울음이, 짐이 문간에 있는 이유다.'
	},
	{
		kind: 'p',
		html: 'His son is already packed.',
		ko: '아들은 이미 짐을 쌌다.'
	},
	{
		kind: 'dialogue',
		chip: '#6b5344',
		person: 'ajagae',
		lines: ['군대가 밥은 줄 거다.'],
		en: ["The army will feed you."]
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['그래서 가는 거야.'],
		en: ["That's why I'm going."]
	},
	{
		kind: 'dialogue',
		chip: '#6b5344',
		person: 'ajagae',
		lines: ['누구 잡으라고 보낼 텐데.'],
		en: ["They'll send you at someone."]
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['좋지.'],
		en: ['Good.']
	},
	{
		kind: 'p',
		html: "The boy walks out toward the queen's army. The child stays. The father watches the road until it bends.",
		ko: '아들은 여왕의 군대를 향해 걸어 나간다. 아이는 남는다. 아비는 길이 굽을 때까지 본다.'
	},
	{
		kind: 'p',
		html: 'He will see that road again. From the other end.',
		ko: '그 길을 다시 보게 된다. 반대편에서.'
	},
	{ kind: 'scene', label: "Yang Gil's yard", ko: '양길의 마당', year: 892 },
	{
		kind: 'p',
		html: 'In the north, Yang Gil sits in a yard and lends soldiers the way other men lend oxen.',
		ko: '북쪽에서는 양길이 마당에 앉아 군사를 빌려 준다. 남들이 소를 빌려 주듯이.'
	},
	{
		kind: 'p',
		html: 'A monk comes in bald, a gold patch on the one eye he has left, blue robe, a dragon on the red sash, a staff. He has already left one captain who would not look at him. The merchant’s son is already in the yard, red band on his topknot, listening.',
		ko: '스님이 들어온다. 대머리, 남은 한쪽 눈에 금 안대, 푸른 옷, 붉은 띠에 용, 지팡이. 자기를 봐 주지 않은 대장을 이미 하나 두고 왔다. 상인의 아들은 이미 마당에 있다. 상투에 붉은 띠. 듣고 있다.'
	},
	{
		kind: 'dialogue',
		chip: '#8B3A3A',
		person: 'yanggil',
		lines: ['백 명이면 뭘 할 수 있나.'],
		en: ['What can you do with a hundred.']
	},
	{
		kind: 'dialogue',
		chip: '#1c1a17',
		person: 'gungye',
		lines: ['고을 하나를 가져오겠습니다.'],
		en: ["I'll bring you a town."]
	},
	{
		kind: 'dialogue',
		chip: '#8B3A3A',
		person: 'yanggil',
		lines: ['못 가져오면.'],
		en: ["And if you don't."]
	},
	{
		kind: 'dialogue',
		chip: '#1c1a17',
		person: 'gungye',
		lines: ['백 명은 그대로 남으시죠.'],
		en: ['Then you still have the hundred.']
	},
	{
		kind: 'p',
		html: 'He brings the town. Then another. The hundred become an army, and the army stops coming back to the yard.',
		ko: '고을을 가져온다. 그리고 하나를 더. 백 명이 군대가 되고, 군대는 마당으로 돌아오지 않는다.'
	},
	{
		kind: 'dialogue',
		chip: '#8B3A3A',
		person: 'yanggil',
		lines: ['내 사람들이다.'],
		en: ['Those are my men.']
	},
	{
		kind: 'dialogue',
		chip: '#1c1a17',
		person: 'gungye',
		lines: ['이었죠.'],
		en: ['They were.']
	},
	{
		kind: 'p',
		html: "The yard is still Yang Gil's. The north is not.",
		ko: '마당은 아직 양길의 것이다. 북쪽은 아니다.'
	},
	{ kind: 'scene', label: 'Wansan', ko: '완산', year: 900 },
	{
		kind: 'p',
		html: "The son from Sangju has been the queen's man for years. She sent him after pirates. He stayed, and the coast started answering to him.",
		ko: '상주에서 나온 아들은 여러 해 동안 여왕의 사람이었다. 여왕이 해적을 치라고 보냈다. 그는 남았고, 해안이 그에게 대답하기 시작했다.'
	},
	{
		kind: 'p',
		html: 'He stands in the old palace at Sabi. The gold is in the dirt.',
		ko: '그는 사비의 옛 궁에 선다. 금은 흙 속에 있다.'
	},
	{
		kind: 'p',
		html: 'He picks one up like a letter.',
		ko: '그는 그것을 편지처럼 집어 든다.'
	},
	{
		kind: 'p',
		html: 'A dead woman in this palace once called the gold a letter. He does not know her. He agrees with her anyway.',
		ko: '이 궁의 죽은 여자가, 언젠가 이 금을 편지라 했다. 그는 그 여자를 모른다. 그래도 동의한 셈이 된다.'
	},
	{
		kind: 'p',
		html: 'A mudang is hard to find. He finds one. She is annoyed to be found.',
		ko: '무당은 찾기 어렵다. 그는 한 명을 찾는다. 그녀는 들킨 것이 언짢다.'
	},
	{
		kind: 'dialogue',
		chip: '#6b3a4a',
		speaker: 'A mudang',
		gender: 'f',
		lines: ['대별이 아직 이 마루에 있습니다. 소별도.'],
		en: ['Daebyeol is still in this floor. Sobyeol too.']
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['그럼 다시 부르지.', '저 향 셋은 배신자다.'],
		en: ['Then we call them again.', 'Those three sticks of incense are traitors.']
	},
	{
		kind: 'p',
		html: 'He starts wearing the old century. In the market he spits when the three names are said. The crowd goes quiet, because that is how you pray now.',
		ko: '그는 옛 세기를 입기 시작한다. 저자에서 그 이름 셋이 나오면 침을 뱉는다. 군중이 조용해진다. 지금은 그렇게 비는 법이니까.'
	},
	{
		kind: 'p',
		html: 'He says the dead king’s name. Then he puts a chair in the gate at Wansan.',
		ko: '죽은 왕의 이름을 말한다. 그리고 완산의 문 안에 의자를 놓는다.'
	},
	{
		kind: 'p',
		html: 'He looks down from the gate.',
		ko: '그는 문 위에서 내려다본다.'
	},
	{
		kind: 'p',
		html: 'The cloak comes first.',
		ko: '망토가 먼저다.'
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['백제다.'],
		en: ['Baekje.']
	},
	{
		kind: 'dialogue',
		chip: '#9aa4b2',
		speaker: 'A minister',
		lines: ['여왕께서는—'],
		en: ['The queen—']
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['여왕의 말은 고개를 돌린다. 나한테는 문이 있다.'],
		en: ['The queen has a horse that turns around. I have a gate.']
	},
	{
		kind: 'p',
		html: "He says he is clearing an old king's grief. The letters still go north with her seal on them. Then they stop.",
		ko: '그는 옛 왕의 한을 푼다고 한다. 편지는 한동안 그녀의 도장이 찍힌 채 북으로 간다. 그리고 끊긴다.'
	},
	{ kind: 'scene', label: 'Cheorwon', ko: '철원', year: 918 },
	{
		kind: 'p',
		html: 'The one-eyed man calls the old northern kingdom back, gets tired of the name, and picks another. A gold patch goes over the eye. He tells the court he can see what they cannot.',
		ko: '외눈의 남자는 옛 북쪽 나라의 이름을 불러 왔다가, 그 이름에 질려 다른 이름을 고른다. 눈 위에 금빛 안대를 붙인다. 조정에게 말한다. 너희 눈이 못 보는 걸 나는 본다고.'
	},
	{
		kind: 'p',
		html: 'From the floor he is a pillar. The patch is a coin of gold.',
		ko: '바닥에서 보면 기둥이다. 안대는 금화 한 닢이다.'
	},
	{
		kind: 'p',
		html: 'The chair was empty on purpose.',
		ko: '그 자리는 비어 있도록 비워 둔 것이다.'
	},
	{
		kind: 'p',
		html: 'Under him there is no hall.',
		ko: '그 아래에는 전각이 없다.'
	},
	{
		kind: 'p',
		html: 'The shoulder comes first.',
		ko: '어깨가 먼저다.'
	},
	{
		kind: 'dialogue',
		chip: '#1c1a17',
		person: 'gungye',
		lines: ['그 자리는 내 자리다.'],
		en: ['That chair is mine.']
	},
	{
		kind: 'dialogue',
		chip: '#1c1a17',
		person: 'gungye',
		lines: ['기다리던 사람이 납니다.', '내가 그 사람입니다.'],
		en: ['The man you have been waiting for has arrived.', 'I am that man.']
	},
	{
		kind: 'p',
		html: 'Wonhyo’s water already won. Gung Ye does not argue with it. He sits down in the waiting.',
		ko: '원효의 물은 이미 이겼다. 궁예는 그 물과 다투지 않는다. 기다림 한가운데 앉는다.'
	},
	{
		kind: 'p',
		html: "One night the gate opens from the inside. A merchant's son from Songak is standing where the king was.",
		ko: '어느 밤, 문이 안에서 열린다. 송악의 상인 아들이, 왕이 서 있던 자리에 서 있다.'
	},
	{
		kind: 'dialogue',
		chip: '#8f2d2d',
		person: 'wanggun',
		lines: ['문 닫아라. 우리 뒤로.'],
		en: ['Shut it behind us.']
	},
	{
		kind: 'p',
		html: 'He does not make a speech on the step. He counts who is already through. The count is the reign.',
		ko: '섬돌 위에서 연설하지 않는다. 이미 문을 통과한 사람을 센다. 그 숫자가 치세다.'
	},
	{
		kind: 'p',
		html: 'He does not ask which god won. The door is the question. Gesomun would have counted the same door, and skipped the hymn.',
		ko: '어느 신이 이겼는지는 묻지 않는다. 문이 질문이다. 개소문이라면 같은 문을 세고, 찬가는 건너뛰었을 것이다.'
	},
	{
		kind: 'p',
		html: 'His boot is on the threshold. The bolt is already in his hand.',
		ko: '신은 문지방에 있다. 빗장은 이미 손에 들렸다.'
	},
	{
		kind: 'p',
		html: 'He has the names before the night does.',
		ko: '밤보다 먼저, 그는 이름을 가지고 있다.'
	},
	{
		kind: 'diagram',
		diagram: 'wives',
		title: 'The twenty-nine',
		caption: 'Each number is a daughter. The name beside it is her father.',
		ko: '숫자는 딸의 차례다. 곁의 이름은 그 아비다.'
	},
	{
		kind: 'p',
		html: 'The count is already done.',
		ko: '셈은 이미 끝났다.'
	},
	{
		kind: 'p',
		html: 'The plate comes first.',
		ko: '갑옷이 먼저다.'
	},
	{ kind: 'scene', label: 'The capital', ko: '서울', year: 927 },
	{
		kind: 'p',
		html: 'Hostages, and one winter of truce. Then Kyun Hwon comes north, and the king of the old capital rides out, because that is what a king is told to do.',
		ko: '인질이 오가고, 휴전은 한 겨울이다. 그리고 견훤이 북으로 온다. 옛 서울의 왕이 말을 타고 나간다. 왕에게 그렇게 하라고 했으니까.'
	},
	{
		kind: 'dialogue',
		chip: '#6fa8ff',
		person: 'gyeongae',
		lines: ['나간다.'],
		en: ['We go out.']
	},
	{
		kind: 'p',
		html: 'The king dies in his own yard. Wang Geon arrives in time to lose. One of his men stays on the road so the rest can leave it.',
		ko: '왕은 자기 마당에서 죽는다. 왕건은 질 시간에 맞춰 도착한다. 그의 사람 하나가 길에 남아, 나머지가 그 길을 떠나게 한다.'
	},
	{
		kind: 'p',
		html: 'The man who did the killing picks the next king on his way out.',
		ko: '죽인 사람이, 나가는 길에 다음 왕을 고른다.'
	},
	{ kind: 'scene', label: 'Gochang', ko: '고창', year: 930 },
	{
		kind: 'p',
		html: "Three autumns later the same two meet again. This time the merchant's son is the one still mounted at dusk.",
		ko: '세 가을이 지나 둘이 다시 만난다. 이번에는 해 질 녘까지 말에 남아 있는 쪽이 그 상인의 아들이다.'
	},
	{
		kind: 'p',
		html: 'Kyun Hwon goes home alive. He does not forgive the day. He remembers which son was elsewhere.',
		ko: '견훤은 살아서 돌아간다. 그날을 용서하지 않는다. 어느 아들이 다른 곳에 있었는지를 기억한다.'
	},
	{ kind: 'scene', label: 'The barred gate', ko: '빗장', year: 935 },
	{
		kind: 'p',
		html: 'The last battle was supposed to be two kings.',
		ko: '마지막 싸움은 왕 둘의 것이어야 했다.'
	},
	{
		kind: 'p',
		html: 'Yellow against red. A river. One of them stays in it.',
		ko: '노랑 대 빨강. 강. 둘 중 하나가 그 안에 남는다.'
	},
	{
		kind: 'p',
		html: 'The son was not in that story.',
		ko: '아들은 그 이야기에 없었다.'
	},
	{
		kind: 'p',
		html: 'He has a favorite. The other son bars the gate and kills the boy.',
		ko: '사랑하는 아들이 있다. 다른 아들이 빗장을 지르고, 그 아이를 죽인다.'
	},
	{
		kind: 'p',
		html: 'The son has already decided the new country cannot be a memory. He sets three tablets. Mu. Euija. Gyebek. Above them, Onjo, the god-king, as if a country could be founded twice.',
		ko: '아들은 이미 정했다. 새 나라는 추억일 수 없다고. 위패를 셋 세운다. 무왕. 의자. 계백. 그 위에 온조, 신왕을. 나라가 두 번 세워져도 된다는 듯이.'
	},
	{
		kind: 'p',
		html: 'The men who liked the father’s jokes stop being asked.',
		ko: '아비의 농담을 좋아하던 사람들은 더 이상 불리지 않는다.'
	},
	{
		kind: 'dialogue',
		chip: '#a6842a',
		person: 'singeom',
		lines: ['아버지로는 들어오십시오.'],
		en: ['You can come in as a father.']
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['열어라.'],
		en: ['Open it.']
	},
	{
		kind: 'dialogue',
		chip: '#a6842a',
		person: 'singeom',
		lines: ['왕으로는 안 됩니다.'],
		en: ['Not as a king.']
	},
	{
		kind: 'dialogue',
		chip: '#a6842a',
		person: 'singeom',
		lines: ['새 백제는 기억이 아닙니다.', '부드러운 사람은 남지 않습니다.'],
		en: ['New Baekje is not a memory.', 'The soft ones do not stay.']
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['…내가 키운 게 이거였나.'],
		en: ['…This is what I raised.']
	},
	{
		kind: 'p',
		html: 'From the dirt he is the whole door.',
		ko: '흙에서 보면, 그가 문 전부다.'
	},
	{
		kind: 'p',
		html: 'The rain is on his face. His son does not look away.',
		ko: '비가 얼굴에 내린다. 아들은 눈을 피하지 않는다.'
	},
	{
		kind: 'p',
		html: 'The hall is already his. He does not raise his voice to take it.',
		ko: '전각은 이미 그의 것이다. 목청을 높이지 않고 가져간다.'
	},
	{
		kind: 'p',
		html: 'He looks down. The wind takes his hair. The sword stays.',
		ko: '그는 내려다본다. 바람이 머리를 가져간다. 칼은 그대로다.'
	},
	{
		kind: 'p',
		html: 'The room goes black. He stays.',
		ko: '방이 검어진다. 그는 남는다.'
	},
	{
		kind: 'p',
		html: 'The chest comes first.',
		ko: '가슴이 먼저다.'
	},
	{
		kind: 'p',
		html: 'The father goes north, to the man he has been trying to kill since both of them were captains, and asks for a horse.',
		ko: '아비는 북으로 간다. 둘 다 대장이었을 때부터 죽이려 했던 남자에게. 그리고 말을 청한다.'
	},
	{ kind: 'scene', label: 'The seals', ko: '도장', year: 935 },
	{
		kind: 'p',
		html: 'The last king of the old capital has a minister who is still saying no.',
		ko: '옛 서울의 마지막 왕에게는, 아직 안 된다고 말하는 신하가 있다.'
	},
	{
		kind: 'dialogue',
		chip: '#9aa4b2',
		speaker: 'Majije',
		lines: ['나가지 마십시오.'],
		en: ["Don't go out."]
	},
	{
		kind: 'dialogue',
		chip: '#9aa4b2',
		person: 'gyeongsun',
		lines: ['남으면, 나머지도 탑니다.'],
		en: ['If I stay, they burn the rest of it.']
	},
	{
		kind: 'p',
		html: 'He walks out with the seals. The minister stays in the room.',
		ko: '그는 도장을 들고 걸어 나간다. 신하는 방에 남는다.'
	},
	{ kind: 'scene', label: 'Illicheon', ko: '일리천', year: 936 },
	{
		kind: 'p',
		html: 'They meet at a river. The son has the army he took from his father. The father has the other king\'s.',
		ko: '강에서 만난다. 아들은 아비에게서 빼앗은 군대를 가지고 있다. 아비는 다른 왕의 군대를 가지고 있다.'
	},
	{
		kind: 'p',
		html: 'The son does not bow. The father does not look away.',
		ko: '아들은 절하지 않는다. 아비는 눈을 떼지 않는다.'
	},
	{
		kind: 'p',
		html: 'The bank is his. He does not step down.',
		ko: '기슭은 그의 것이다. 그는 내려가지 않는다.'
	},
	{
		kind: 'p',
		html: 'The water takes the color of the bank that loses.',
		ko: '물은, 진 쪽 기슭의 색을 띤다.'
	},
	{ kind: 'scene', label: 'Songak', ko: '송악', year: 936 },
	{
		kind: 'p',
		html: 'Wang Geon pardons the son. Other men led him, he says. The father asked for the grave.',
		ko: '왕건이 아들을 살려 준다. 다른 사람들이 이끌었다고 한다. 아비는 무덤을 청했다.'
	},
	{
		kind: 'p',
		html: 'Goryeo gives them one room. It is not a big room.',
		ko: '고려는 둘에게 방 하나를 준다. 큰 방은 아니다.'
	},
	{
		kind: 'dialogue',
		chip: '#d9b13a',
		person: 'kyunhwon',
		lines: ['문 열라고 했을 때. 열 수 있었으면.'],
		en: ['When I told you to open it. If I could have.']
	},
	{
		kind: 'dialogue',
		chip: '#a6842a',
		person: 'singeom',
		lines: ['지금은 열립니다.'],
		en: ['It is open now.']
	},
	{
		kind: 'p',
		html: 'Kyun Hwon’s face is wet first. Kyun Singum’s follows. He does not make that face, and he makes it anyway.',
		ko: '견훤의 얼굴이 먼저 젖는다. 견신검이 뒤따른다. 그 얼굴을 짓는 사람이 아닌데, 짓는다.'
	},
	{
		kind: 'p',
		html: 'They hold on. The swords are in the other room. By morning the holding is all that is left of either of them.',
		ko: '붙든다. 칼은 옆방에 있다. 아침이면, 붙든 것만이 둘에게 남아 있다.'
	},
	{
		kind: 'p',
		html: '<b>Samhan has one roof again. In the north, someone is packing camels…!</b>',
		ko: '<b>삼한에 다시 지붕이 하나다. 북쪽에서는 누가 낙타를 싸고 있다…!</b>'
	}
];

export const laterEntry = {
	title: 'Later',
	ko: '후삼국',
	sub: '889–936',
	blocks,
	images: laterImages
};
