import fs from 'node:fs';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));

function find(title) {
	let hit;
	(function walk(n) {
		if (!n || typeof n !== 'object' || hit) return;
		if (n.title === title && n.blocks) hit = n;
		for (const v of Object.values(n)) {
			if (Array.isArray(v)) v.forEach(walk);
			else if (v && typeof v === 'object') walk(v);
		}
	})(story);
	return hit;
}

const S =
	'Character-intro-card paint, the Heewon chronicle look: loose black ink line with real weight, watercolor sky and ground, dry-brush cloth, small adult eyes, paper grain at the edges. Not a photograph. Not flat vector. Not huge cartoon eyes. 16:9 composed for a 2:1 letterbox crop; nothing important in the top or bottom strip. One hard key. No text, no letters, no watermark, no glow aura.';

function slot(o) {
	return {
		id: o.id,
		ratio: 2,
		time: o.time || 'day',
		at: o.at,
		alt: o.alt,
		prompt: `${S} ${o.scene}`,
		refs: o.refs,
		people: o.people
	};
}

const gardener = find('Gardener');
const goddess = find('Goddess Supreme');
const hek = find('Heaven–Earth King');

const opening = [
	{
		kind: 'p',
		html: 'Two villages. One mountain valley. They shared the rain and nothing else.',
		ko: '마을이 둘이었다. 산골짜기 하나. 비는 같이 맞고, 그 외에는 같이하는 게 없었다.'
	},
	{ kind: 'section', label: 'The Valley', ko: '골짜기' },
	{
		kind: 'p',
		html: 'The rich one sat up the hill and called itself Gimjin. Tile roofs. Full jars.',
		ko: '언덕 위가 부자 마을이다. 김진국. 기와지붕. 독이 가득했다.'
	},
	{
		kind: 'p',
		html: 'Down in the mud sat Imjin. Same mountain. Thinner bowls.',
		ko: '진흙 쪽이 임진국이다. 산은 같다. 그릇만 얇다.'
	},
	{
		kind: 'p',
		html: 'Their prince would not leave a seed alone.',
		ko: '그 집 왕자는 씨를 가만 두지 못했다.'
	},
	{
		kind: 'p',
		html: 'Sara. If a field went hungry, he invented a crop for it.',
		ko: '사라. 밭이 굶으면 작물을 만들어 냈다.'
	},
	{
		kind: 'p',
		html: 'When the upper soil ran out of lessons, he came down the hill with empty hands.',
		ko: '윗마을 흙이 더 가르칠 게 없으면, 빈손으로 언덕을 내려왔다.'
	},
	{ kind: 'scene', label: 'The Lower Field', ko: '아랫밭' },
	{
		kind: 'p',
		html: 'Princess Wongang finds him on his knees in her dirt, shaking seed into a furrow that is not his.',
		ko: '원강 공주가 그를 발견한 건 임진국 흙 위였다. 무릎을 꿇고, 자기 밭이 아닌 고랑에 씨를 털고 있었다.'
	},
	{
		kind: 'dialogue',
		person: 'wongang',
		lines: ['야.', '그 씨. 우리 거다.'],
		en: ['Hey.', 'Those seeds. They’re ours.']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['훔친 거 아니우다.', '느네 흙이 우리 흙이랑 달라. 한번 보자고.'],
		en: ['I’m not stealing.', 'Your dirt isn’t our dirt. I wanted to see.']
	},
	{
		kind: 'dialogue',
		person: 'wongang',
		lines: ['보면 가져가잖아. 왕자는.'],
		en: ['You look. Then you take it. Princes do.']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['가져가면 먹는다. 느네 사람들.'],
		en: ['If I take it, someone eats. Your people.']
	},
	{
		kind: 'dialogue',
		person: 'wongang',
		lines: ['…뭐가 날 건데.'],
		en: ['…And what comes up.']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['배 부른 거.'],
		en: ['Full stomachs.']
	},
	{
		kind: 'p',
		html: 'He comes down the next morning. And the one after. By the fourth she has stopped calling it theft.',
		ko: '다음 날 아침에도 내려왔다. 그 다음에도. 나흘째엔 도둑질이라는 말을 그만뒀다.'
	},
	{ kind: 'scene', label: 'One Gate', ko: '한 문' },
	{
		kind: 'p',
		html: 'They marry in the ditch between the villages. After that the hill is just a hill.',
		ko: '둘은 마을 사이 도랑에서 혼인했다. 그 다음부터 언덕은 그냥 언덕이었다.'
	},
	{
		kind: 'p',
		html: 'Gimjin and Imjin keep their names for a season. Then people say the valley, and mean one kingdom.',
		ko: '김진국과 임진국은 한 철을 더 이름을 붙잡고 있었다. 그 다음엔 사람들이 골짜기라고만 했다. 한 나라라는 뜻이었다.'
	},
	{
		kind: 'p',
		html: 'Then the dreams start.',
		ko: '그때부터 꿈이 시작됐다.'
	},
	{
		kind: 'p',
		html: 'A king he has never met. Two suns. A field past the edge of any map he owns.',
		ko: '만난 적 없는 왕. 해가 둘. 그가 가진 어떤 지도에도 없는 밭.'
	},
	{
		kind: 'p',
		html: 'He wakes with dirt under his nails. He counts seeds he did not bring to bed. She is already watching.',
		ko: '손톱 밑에 흙을 묻힌 채 깼다. 침대까지 가져온 적 없는 씨를, 그가 센다. 아내는 이미 보고 있다.'
	}
];

const gardenerSlots = [
	slot({
		id: 'hlk-two-villages',
		at: 'They shared the rain and nothing else.',
		alt: 'One mountain valley. Rich Gimjin up the hill, poor Imjin in the mud.',
		time: 'day',
		people: ['saradoryeong', 'wongang'],
		refs: ['/ch_sara.png', '/ch_wongang_princess.png'],
		scene:
			'WIDE dusk. One mountain, one valley. UPPER slope: a wealthy Korean village, giwa roofs, full grain jars, warm gold light. LOWER slope: a poor village of mud and thatch, thin smoke, thinner fields. A dirt path is the only thing they share. Tiny figures. ONE device: the ridge as a diagonal. No large faces. No crowd portrait.'
	}),
	slot({
		id: 'hlk-upper-crop',
		at: 'If a field went hungry, he invented a crop for it.',
		alt: 'Prince Sara kneels in Gimjin soil and opens a gold peony among the millet.',
		time: 'day',
		people: ['saradoryeong'],
		refs: ['/ch_sara.png', '/flower_wealthy.png'],
		scene:
			'LOW three-quarter. Sara, prince of the upper village, kneels in a rich terrace, mid-invention, dirt on his wrists. FACE from the father portrait: young man, black headband, long hair in a tail, grey-green robe, closed-eye smile gone concentrating, eyes open for the work. Beside the millet a huge gold peony opens, petals plain blank coin-discs, NO characters, NO numbers. Match the wealthy flower on the sheet, strip every letter. Basket at his hip.'
	}),
	slot({
		id: 'hlk-down-hill',
		at: 'he came down the hill with empty hands.',
		alt: 'Sara comes down from Gimjin toward Imjin with a basket and a fist of seed.',
		time: 'day',
		people: ['saradoryeong'],
		refs: ['/ch_sara.png'],
		scene:
			'Sara mid-stride down a steep dirt path, basket on his hip, a fist of seed held up to the light. Rich giwa roofs small behind him up the hill. Poor thatch below. FACE from the father portrait, black headband, long tail, grey-green robe. He is going to test the lower soil. Worm’s-eye from the path.'
	}),
	slot({
		id: 'hlk-seed-thief',
		at: 'Those seeds. They’re ours.',
		alt: 'Princess Wongang catches Sara on his knees in Imjin dirt.',
		time: 'day',
		people: ['wongang', 'saradoryeong'],
		refs: ['/ch_wongang_princess.png', '/ch_sara.png', '/flower_good.png'],
		scene:
			'Sara kneels in poor dark soil, seed in his fist. Princess Wongang stands over him, accusing, not posing. Her FACE and vermilion-orange gold-trimmed court dress, braid, gold hair ornaments, grey bundle from the princess portrait. His FACE from the father portrait, black headband, grey-green robe. Between them a sprout of the good flower: an orange flame-heart bloom on a black stem, match the sheet, no text. She thinks he is stealing. He is explaining the dirt.'
	}),
	slot({
		id: 'hlk-furrow-ask',
		at: 'By the fourth she has stopped calling it theft.',
		alt: 'Wongang and Sara share the furrow. A laughing sunflower stands between their hands.',
		time: 'day',
		people: ['wongang', 'saradoryeong'],
		refs: ['/ch_wongang_princess.png', '/ch_sara.png', '/flower_laughing.png'],
		scene:
			'INTIMATE two-shot at dusk in the lower field. She has stopped being angry. A huge laughing flower, a sunflower with flame in the petals, stands between their hands. Match that flower. Clothed. Faces close, almost a laugh, charge in the look, not a kiss catalog. Her vermilion-orange princess dress. His grey-green robe and black headband. Foreground grass. Poor thatch bokeh.'
	}),
	slot({
		id: 'hlk-ditch-wedding',
		at: 'They marry in the ditch between the villages.',
		alt: 'Sara and Wongang marry in the ditch. The two villages become one gate.',
		time: 'day',
		people: ['saradoryeong', 'wongang'],
		refs: ['/ch_sara.png', '/ch_wongang_princess.png'],
		scene:
			'They stand in a muddy ditch, her hand on his sleeve, marrying. She is the princess in vermilion-orange and gold ornaments. He is the prince in grey-green, black headband. Behind them one new timber gate is going up. The rich roofs and the poor roofs are both small on the ridges. No crowd filling the frame. One device: the ditch as a dark line, the couple on it.'
	}),
	slot({
		id: 'hlk-one-kingdom',
		at: 'mean one kingdom.',
		alt: 'The valley is one kingdom. One road joins the hill to the mud.',
		time: 'day',
		people: ['saradoryeong', 'wongang'],
		refs: ['/ch_sara.png', '/ch_wongang_princess.png'],
		scene:
			'WIDE. The same valley, now one road and one gate. Giwa and thatch share a lane. The couple small in the lower third, walking it, her orange dress, his grey-green robe. Paper-white day sky, one cloud-break. Quiet. A kingdom that used to be two villages.'
	}),
	slot({
		id: 'hlk-dream-start',
		at: 'Then the dreams start.',
		alt: 'Sara wakes counting seeds. A king and two suns are still in the dream.',
		time: 'night',
		people: ['saradoryeong', 'heavenearthking'],
		refs: ['/ch_sara.png', '/ch_heaven_earth_king.png'],
		scene:
			'NIGHT interior, one oil lamp on the floor. Sara sits up on a mat, dirt under his nails, seeds spilled, eyes open, frightened of a dream. In the dark above the rafters, only as a dream, the Heaven–Earth King: old, white goatee, grey robe, no bow, no helmet. Two suns faint in the dream-wash of the ceiling. Wongang stands in the doorway in vermilion-orange, watching, not yet pregnant. Do not copy a desk or books.'
	}),
	slot({
		id: 'hlk-fl-laughing',
		at: 'Laughing-Baffling first.',
		alt: 'Laughing-Baffling, the flaming sunflower, opens at the magistrate’s table.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_laughing.png'],
		scene:
			'The son, Hallakgungi, late-teen, sage-green robe, black headband, sly open eyes, red flowers on one sleeve. NEVER the father’s closed-eye face. Gray hood, a fake grey beard. He sits at the head of a lamp-lit table. A huge laughing flower fills the foreground: a sunflower with fire in the petals, match the sheet. The household beyond him is starting to laugh. He watches.'
	}),
	slot({
		id: 'hlk-fl-fighting',
		at: 'Fighting-Inciting picks the fight.',
		alt: 'Fighting-Inciting, a smoky russet peony, starts the fight.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_fighting.png'],
		scene:
			'Hallakgungi in sage green and black headband stands calm. A huge fighting flower owns the frame: a russet peony with brown smoke pouring off it, match the sheet. Beyond it, two figures lunge at each other in a dark hall. He does not join. Dutch tilt. Lamp on the floor.'
	}),
	slot({
		id: 'hlk-fl-crying',
		at: 'Crying-Dying keeps a ditch.',
		alt: 'Crying-Dying, a cyan iris, keeps the ditch of the hall.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_crying.png'],
		scene:
			'A huge crying flower in a dark ditch of a hall: a cyan iris glowing like wet glass, match the sheet. A woman covers her face. Hallakgungi, sage green, black headband, stands at the edge and does not comfort her. One lamp. Quiet cruelty.'
	}),
	slot({
		id: 'hlk-fl-bone',
		at: 'Bone-Hone first.',
		alt: 'Bone-Hone, white bone petals and an amber heart, sits a skeleton up.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_bone.png'],
		scene:
			'Bamboo dark. Bone-Hone huge in the foreground: white bone-shaped petals, amber heart, a stem like a bone, match the sheet. A skeleton starts to sit up because a son asked. Hallakgungi kneels, sage green, black headband, one hand out, not afraid. White order. One lamp.'
	}),
	slot({
		id: 'hlk-fl-flesh',
		at: 'Flesh-Refresh.',
		alt: 'Flesh-Refresh, a pale muscle rose, puts the body back.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_flesh.png'],
		scene:
			'Flesh-Refresh huge: a pale peach rose whose petals are muscle, match the sheet, painted not clinical. Hallakgungi in sage green holds the stem and watches a body fill back in, in shadow, not a medical plate. Bamboo. One lamp.'
	}),
	slot({
		id: 'hlk-fl-blood',
		at: 'Blood-Flood.',
		alt: 'Blood-Flood, a crimson liquid tulip, pours the blood back.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_blood.png'],
		scene:
			'Blood-Flood huge: a crimson tulip made of liquid red, pouring, match the sheet. Painted myth, not a wound catalog. Hallakgungi, sage green, black headband, stands in the bamboo dark and lets it work. One lamp.'
	}),
	slot({
		id: 'hlk-fl-organ',
		at: 'Internal-Vernal is the long one',
		alt: 'Internal-Vernal, the long amber heart-flower, in the middle of the row.',
		time: 'day',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_organ.png'],
		scene:
			'The long one in the middle of a flower row. Internal-Vernal huge: an amber bloom shaped like a heart and lungs, match the sheet, painted, no labels. Hallakgungi kneels beside it, sage green, naming it the way a man names a tool. Day, paper-white sky, the row dissolving behind.'
	}),
	slot({
		id: 'hlk-fl-air',
		at: 'Breath-Undeath.',
		alt: 'Breath-Undeath, an ice-blue wind chrysanthemum, puts the breath back.',
		time: 'day',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_air.png'],
		scene:
			'Breath-Undeath huge in the wind: an ice-blue chrysanthemum whose petals are made of air, match the sheet. Hallakgungi, sage green, black headband, leans into the gust, hair and sleeves moving. A chest beyond him rises. Paper-white day. One cloud-break.'
	}),
	slot({
		id: 'hlk-fl-soul',
		at: 'Soul-Whole last',
		alt: 'Soul-Whole, a silver-blue ghost tulip, puts someone back behind the eyes.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_soul.png'],
		scene:
			'Soul-Whole last and huge: a silver-blue tulip of smoke and ghost petals, match the sheet. Hallakgungi holds it near a face in the dark so the eyes come back. Sage green, black headband. One lamp. Quiet. He does not smile.'
	}),
	slot({
		id: 'hlk-fl-ruin',
		at: 'Only after the house has laughed itself raw',
		alt: 'Ruin-Human, the magenta heart-smoke, comes out last.',
		time: 'night',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_evil.png'],
		scene:
			'The end of the row. Ruin-Human huge: a magenta bloom with a black heart and pink smoke, match the sheet. Hallakgungi in a gray hood sets it on the table. The hall has gone quiet. One lamp. He is exact, not gloating.'
	}),
	slot({
		id: 'hlk-fl-burning',
		at: 'At dusk the boy walks east with a gray hood',
		alt: 'The burning rose rides in the basket as the boy walks east.',
		time: 'day',
		people: ['sara'],
		refs: ['/ch_gardener.png', '/flower_burning.png'],
		scene:
			'Dusk. Hallakgungi walks east, gray hood, sage-green robe, black headband, basket on his hip. Out of the basket a burning rose: a red rose made of fire, match the sheet. The road is a diagonal. He is mid-stride. Paper sky going dark at one edge.'
	})
];

const goddessSlots = [
	slot({
		id: 'gs-chaos-world',
		at: 'The world was still in chaos.',
		alt: 'Bodies and souls miss each other on a road that has no border.',
		time: 'day',
		people: [],
		refs: ['/ch_sky_princess.png', '/ch_dragon_lady.png'],
		scene:
			'WIDE myth road under a paper-white sky. Small bodies walk one way. Pale souls walk the other and pass through them. No border. Chaos as weather, not a lecture. Two tiny women far apart: one in the clouds, one toward the sea. Intro-card ink and watercolor. No text.'
	}),
	slot({
		id: 'gs-bodies-wait',
		at: 'A body could be born and wait.',
		alt: 'A newborn body waits. A soul walks past and does not enter.',
		time: 'night',
		people: [],
		refs: ['/ch_sky_princess.png'],
		scene:
			'A small newborn wrapped in white cloth lies on a mat. A pale soul, only a wash of a person, walks past the door and does not go in. One lamp. The emptiness is the picture. No gore. Intro-card paint.'
	}),
	slot({
		id: 'gs-two-ends',
		at: 'The living world has two ends.',
		alt: 'Clouds at the west end. The sea palace at the east end. The living world between.',
		time: 'day',
		people: ['samsin', 'yongnyeo'],
		refs: ['/ch_sky_princess.png', '/ch_dragon_lady.png'],
		scene:
			'ONE device: a thin strip of living world across the middle. Above it, west, a cloud palace and the Sky Princess small on a rail. Below it, east, an undersea hall and the Dragon Lady small with a spear. They do not face each other. Watercolor clouds, ink water. No letters.'
	}),
	slot({
		id: 'gs-rabbit-brush',
		at: 'The Rabbit King is brushing the red rabbit.',
		alt: 'The Rabbit King brushes the red rabbit. Cloud-petals stick in the comb.',
		time: 'day',
		people: ['rabbitking', 'samsin'],
		refs: ['/ch_rabbit_king.png', '/ch_sky_princess.png'],
		scene:
			'Cloud palace rail. The Rabbit King, FACE from his portrait, brushes a red rabbit. Cloud-petals stuck in the comb. The Sky Princess, FACE and dress from her portrait, sets tea on the rail and laughs because a cloud missed the roof. Gold in her hair. Day, paper-white. Intimate, not a lineup.'
	}),
	slot({
		id: 'gs-gold-hair',
		at: 'You have gold in your hair again.',
		alt: 'Gold in the Sky Princess’s hair. She likes it. The beds are calling.',
		time: 'day',
		people: ['samsin', 'rabbitking'],
		refs: ['/ch_sky_princess.png', '/ch_rabbit_king.png'],
		scene:
			'CLOSE on the Sky Princess at the cloud rail, gold ornaments in her hair, she refuses to take them out, already turning toward her garden beds. Her father the Rabbit King is a soft shape behind her with the red rabbit. Match her face and dress. She is decorating, and leaving.'
	}),
	slot({
		id: 'gs-cloud-stair',
		at: 'He watches her take the stair that leaves the clouds.',
		alt: 'The Sky Princess takes the stair out of the clouds. He goes back to the rabbit.',
		time: 'day',
		people: ['samsin', 'rabbitking'],
		refs: ['/ch_sky_princess.png', '/ch_rabbit_king.png'],
		scene:
			'A stair of cloud going down out of a palace. The Sky Princess mid-step, descending, sleeves full of seedlings, gold in her hair. The Rabbit King stays on the rail with the red rabbit and does not follow. Worm’s-eye up the stair. She is going to the living world.'
	}),
	slot({
		id: 'gs-fish-under',
		at: 'He went under the gate.',
		alt: 'The Dragon Lady hunts a fish under the sea gate and loses it.',
		time: 'day',
		people: ['yongnyeo'],
		refs: ['/ch_dragon_lady.png'],
		scene:
			'Under the sea, ink-blue water, a coral-and-timber gate. The Dragon Lady, FACE from her portrait, tomboy, spear in hand, lunging, a fish slipping under the gate. She is furious and grinning. Not a court portrait. Bubbles, one shaft of surface light. Action, dutch tilt.'
	}),
	slot({
		id: 'gs-beds-smile',
		at: 'dirt on her knees, and she is already smiling.',
		alt: 'The Sky Princess hears the seat is open, on her knees in the beds.',
		time: 'day',
		people: ['samsin'],
		refs: ['/ch_sky_princess.png'],
		scene:
			'The Sky Princess on her knees in a garden bed, dirt on the silk, already smiling at news we do not see. New trees and seedlings around her, each one a different shape. Gold in her hair. She treats the world like a bed. Day, paper-white. Match her face.'
	}),
	slot({
		id: 'gs-sea-no-smile',
		at: 'Under the water, the other one does not smile.',
		alt: 'Under the water the Dragon Lady hears the same news and does not smile.',
		time: 'night',
		people: ['yongnyeo'],
		refs: ['/ch_dragon_lady.png'],
		scene:
			'Under the sea, dark. The Dragon Lady has just heard the same news. She does not smile. Spear lowered. Fish ignore her. One shaft from the surface. Match her face. Stillness after the hunt.'
	}),
	slot({
		id: 'gs-one-flower',
		at: 'One flower each. Grow a life.',
		alt: 'One flower each on the table. Hers will open. The dragon’s is already burning.',
		time: 'day',
		people: ['heavenearthking', 'samsin', 'yongnyeo'],
		refs: ['/ch_heaven_earth_king.png', '/ch_sky_princess.png', '/ch_dragon_lady.png', '/flower_good.png', '/flower_burning.png'],
		scene:
			'A low table. Two flowers. The Sky Princess’s is the orange flame-heart good flower, just opening. The Dragon Lady’s is the burning rose, already going black at the edges. Match both flowers, no text. The retired Heaven–Earth King, old, white goatee, no bow, hates the meeting, stands back. The two women watch the table, not each other. Intro-card paint.'
	})
];

const hekSlots = [
	slot({
		id: 'hek-ate-both',
		at: 'He dreamed he was eating. One sun. One moon.',
		alt: 'Heaven–Earth King dreams he swallows one sun and one moon.',
		time: 'night',
		people: ['heavenearthking'],
		refs: ['/ch_heaven_earth_king.png'],
		scene:
			'He is asleep, not at a desk, slumped on a mat, old face, white goatee, grey robe. The dream is in the same frame: he is also mid-bite, swallowing one sun like a peach and one moon like a dumpling. One sun and one moon remain in the window. Do NOT copy a desk, books, or a man working. Intro-card paint. No text.'
	}),
	slot({
		id: 'hek-empty-jar',
		at: 'The bottom of it looks up at her.',
		alt: 'The Lady of Wisdom lifts the jar. The bottom looks back.',
		time: 'night',
		people: ['chongmyeong'],
		refs: ['/ch_lady_wisdom.png'],
		scene:
			'The poorest house. The Lady of Wisdom, FACE from her portrait, lifts a jar lid out back. The jar is empty. The bottom looks up at her. She almost puts the lid back. No fire in the hearth. One scrap of moonlight. She is about to cross the road.'
	}),
	slot({
		id: 'hek-sand-bite',
		at: 'Your rice has a bit of bite to it.',
		alt: 'The king takes a spoonful. The rice is full of sand.',
		time: 'night',
		people: ['heavenearthking', 'chongmyeong'],
		refs: ['/ch_heaven_earth_king.png', '/ch_lady_wisdom.png'],
		scene:
			'One lamp, one bowl. The Heaven–Earth King, old, white goatee, no bow, has a spoon at his mouth and has just bitten sand. The Lady of Wisdom across the tiny table knows. Shame, not a speech. Poorest room. Intro-card paint.'
	}),
	slot({
		id: 'hek-ninth-black',
		at: 'the sky over the ninth one goes black at noon.',
		alt: 'Noon goes black over Sumyung’s ninth storehouse.',
		time: 'day',
		people: ['sumyeongjangja', 'heavenearthking'],
		refs: ['/ch_sumyung.png', '/ch_heaven_earth_king.png'],
		scene:
			'Nine storehouses. Noon. The sky over the ninth goes black. Sumyung Jangja, FACE from his portrait, rich robes, looks up and his horse will not kick. A dog crawls under the porch. The king is only a darkness in that noon, not yet a figure. Epic scale, intro-card ink, the storehouses real Korean timber and giwa.'
	}),
	slot({
		id: 'hek-floor-opens',
		at: 'The floor of the ninth storehouse opens.',
		alt: 'The ninth floor opens. A boar, a wolf, and teeth haul Sumyung down.',
		time: 'day',
		people: ['sumyeongjangja'],
		refs: ['/ch_sumyung.png'],
		scene:
			'Looking down. The floor of a grain storehouse has opened. Sumyung, rich robes, falls. Up the same hole come a boar, a wolf, and a dark shape with too many teeth. Grain spills. Epic, intro-card ink and watercolor, not a photograph. He is being hauled out of the world.'
	}),
	slot({
		id: 'hek-tie-sleeves',
		at: 'he is already tying his sleeves.',
		alt: 'Morning. The king ties his sleeves. She is still holding the night.',
		time: 'day',
		people: ['heavenearthking', 'chongmyeong'],
		refs: ['/ch_heaven_earth_king.png', '/ch_lady_wisdom.png'],
		scene:
			'Dawn in the poor house. The Heaven–Earth King is already tying his sleeves to leave, old face, white goatee, no bow. The Lady of Wisdom stands with the night still on her, watching him go. One window. Intro-card paint. He will not stay.'
	}),
	slot({
		id: 'hek-gourd-seeds',
		at: 'Two gourd seeds in her palm',
		alt: 'Two gourd seeds and half a comb in her palm. The other half is in his sleeve.',
		time: 'day',
		people: ['chongmyeong', 'heavenearthking'],
		refs: ['/ch_lady_wisdom.png', '/ch_heaven_earth_king.png'],
		scene:
			'CLOSE on her palm: two gourd seeds and half a wooden comb. His sleeve takes the other half. Their faces above, hers the Lady of Wisdom, his the old king with the white goatee. Fifteen years in the objects. No text. One morning shaft.'
	})
];

function add(entry, slots) {
	const have = new Set(entry.images.map((i) => i.id));
	const fresh = slots.filter((s) => !have.has(s.id));
	entry.images.unshift(...fresh);
	return fresh.map((s) => s.id);
}

if (!gardener.blocks[0].html.startsWith('Two villages.')) {
	gardener.blocks.unshift(...opening);
}

const invent = gardener.images.find((i) => i.id === 'hlk-invent-bloom');
if (invent) {
	invent.people = ['sara'];
	invent.refs = ['/ch_gardener.png', '/flower_burning.png', '/flower_laughing.png', '/flower_crying.png'];
	invent.prompt = `${S} DAY. Hallakgungi, the son, sage-green robe, black headband, open sly eyes, red flowers on one sleeve. NEVER the father’s closed-eye face. He kneels in a long row inventing. Foreground bud is the burning rose. Down the row: the flaming sunflower, the cyan iris, each one different. Match the flowers on the sheet. Dirt to the wrists. He is mid-invention.`;
}
const life = gardener.images.find((i) => i.id === 'hlk-life-last');
if (life) {
	life.people = ['sara'];
	life.refs = ['/ch_gardener.png', '/flower_soul.png', '/flower_good.png'];
	life.prompt = `${S} DAY, paper-white. Hallakgungi sits back on his heels at the end of the row, sage green, black headband, the son’s open eyes, not the father’s. The last flower has just opened: the silver-blue soul tulip, and beside it the orange flame-heart, the kind one. Match those flowers. He looks at them as if he did not expect them to live. Earlier blooms small and different behind him. Quiet.`;
}

const sky = goddess.images.find((i) => i.id === 'gs-sky-trees');
if (sky) {
	sky.people = ['samsin'];
	sky.refs = ['/ch_sky_princess.png'];
	sky.prompt = `${S} DAY. The Sky Princess in her cloud garden, FACE and dress from her portrait, gold in her hair, on her knees planting a tree that has never grown before. Other new trees, each a different shape, recede. She decorates the world. She is delighted. Not a standing portrait.`;
}
const spear = goddess.images.find((i) => i.id === 'gs-dragon-spear');
if (spear) {
	spear.people = ['yongnyeo'];
	spear.refs = ['/ch_dragon_lady.png'];
	spear.prompt = `${S} NIGHT water. The Dragon Lady is not at the table. She is out in the dark water with a spear, hunting a fish, tomboy, hair loose, grinning at the miss. FACE from her portrait. The sea palace glows small behind her. Action, not a banquet.`;
}

console.log('gardener new', add(gardener, gardenerSlots).join(' '));
console.log('goddess new', add(goddess, goddessSlots).join(' '));
console.log('hek new', add(hek, hekSlots).join(' '));
console.log('gardener blocks', gardener.blocks.length, 'images', gardener.images.length);

fs.writeFileSync('src/lib/data/story.json', JSON.stringify(story, null, '\t') + '\n');
