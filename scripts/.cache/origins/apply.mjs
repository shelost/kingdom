// Where the ruling houses came from, told once per kingdom with a silhouette still
// in the prologue's look and a brushed plate of the native words:
//   Five Tribes:       Jolbon's five tribes → Goguryeo's five tribes → the Five Commanderies (가, 대가, 5부)
//   Jade Gate Valley:  six village Kans → the Great Kan → True Bone (간, 거서간, 6촌)
//   Eight Great Clans: ten attendants → eight houses, two lost
// Also: Baekje's Premier becomes the Prime Minister. Idempotent.
//   node scripts/.cache/origins/apply.mjs
import fs from 'node:fs';
import { CAP, STYLE } from '../prologue-founding/silhouettes.mjs';

const FILE = 'src/lib/data/story.json';
const chapters = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entryOf = (chapterId, title) => {
	const e = chapters.find((c) => c.id === chapterId)?.entries.find((x) => x.title === title);
	if (!e) throw new Error(`missing ${chapterId} / ${title}`);
	return e;
};
const textOf = (b) => [b.html, b.label, ...(b.en || []), b.title].filter(Boolean).join(' ');
const findIdx = (blocks, needle) => blocks.findIndex((b) => textOf(b).includes(needle));
const must = (i, what) => {
	if (i < 0) throw new Error(`not found: ${what}`);
	return i;
};
const has = (blocks, needle) => findIdx(blocks, needle) >= 0;

const p = (html, ko) => ({ kind: 'p', html, ko });
const chipOf = (person) => {
	for (const c of chapters)
		for (const e of c.entries)
			for (const b of e.blocks) if (b.kind === 'dialogue' && b.person === person && b.chip) return b.chip;
	return '#8d8d95';
};
const say = (person, en, lines) => ({ kind: 'dialogue', person, chip: chipOf(person), en, lines });
const words = (chars, note, noteKo) => ({ kind: 'hanja', tab: 'words', chars, name: 'Native words', ko: '우리말', note, noteKo });
const silhouette = (scene) => `Symbolic poster still. ${scene} ${CAP} ${STYLE}`;
const slot = (id, at, alt, scene) => ({ id, ratio: 2, at, alt, prompt: silhouette(scene), refs: ['/hat_jougwan_types.png'] });
const addImage = (e, im) => {
	e.images = e.images || [];
	if (!e.images.some((x) => x.id === im.id)) e.images.push(im);
};

// ── Five Tribes ──────────────────────────────────────────────────────────────
const tribes = entryOf('samhan', 'Five Tribes');
{
	const B = tribes.blocks;
	const open = must(findIdx(B, 'Five roofs. Listen.'), 'Five roofs. Listen.');
	if (!has(B, 'there were five tribes in one valley')) {
		B[open] = say(
			'gesomun',
			[
				'Five roofs. Listen.',
				'Back in Jolbon, before there was a Goguryeo, there were five tribes in one valley. Crow, horse, cow, pig, dog.',
				'Every tribe had a ka. A chief. The crow was us.'
			],
			[
				'지붕 다섯. 들어 보라.',
				'졸본 시절, 고구려가 생기기도 전에, 한 골짜기에 부족 다섯이 있었디. 까마귀, 말, 소, 돼지, 개.',
				'부족마다 가가 하나씩 있었어. 족장. 까마귀가 우리였디.'
			]
		);
		const term = must(
			B.findIndex((b) => b.kind === 'term' && b.diagram === 'five-tribes'),
			'five-tribes term'
		);
		Object.assign(B[term], {
			hanja: '五族',
			reading: '오족',
			term: 'Five Tribes',
			html: 'Five roofs in one valley. Each tribe had its own ka, its own herds and its own grudges. Men in the far north named their chiefs after their herds, so four of the five were the horse, the cow, the pig and the dog. The crow was the valley’s own.',
			ko: '한 골짜기에 지붕 다섯. 부족마다 제 가가 있고, 제 가축이 있고, 제 원한이 있었다. 먼 북쪽 사람들은 족장을 제 가축 이름으로 불렀다. 그래서 다섯 가운데 넷이 말, 소, 돼지, 개다. 까마귀만은 그 골짜기 토박이다.'
		});
		const married = must(findIdx(B, 'It came over the river and married in.'), 'married in');
		B.splice(
			married + 1,
			0,
			say('yeonwife', ['You’ve skipped six hundred years.'], ['육백 년을 건너뛰었어요.']),
			say(
				'gesomun',
				[
					'I’m getting there.',
					'The five got bigger. They moved, swallowed their neighbours, took river names. Not animals any more.',
					'Five tribes still. Not the same five.'
				],
				['가는 중이야.', '다섯이 커졌디. 옮겨 다니고, 이웃을 삼키고, 강 이름을 달았어. 이젠 짐승이 아니야.', '여전히 다섯 부족이디. 같은 다섯은 아니고.']
			),
			{
				kind: 'table',
				head: ['Jolbon · 졸본', 'Goguryeo · 고구려', 'Now · 지금'],
				rows: [
					['Crow · 까마귀', 'Hwanna · 환나부', 'East · 동부'],
					['Cow · 소', 'Biryuna · 비류나부', 'West · 서부'],
					['Pig · 돼지', 'Gwanna · 관나부', 'South · 남부'],
					['Dog · 개', 'Yeonna · 연나부', 'North · 북부'],
					['Horse · 말', 'Gyeru, the king’s own · 계루부, 임금의 부', 'Inner · 내부']
				]
			},
			say('dosuryu', ['And now they’re not tribes either.'], ['이젠 부족도 아니고.']),
			say(
				'gesomun',
				[
					'Now they’re commanderies. Five Commanderies. East, West, South, North, and the Inner one round the palace.',
					'The ka got bigger with them. Now he’s a Deka. A Commander. Like my father. Tomorrow, like me.'
				],
				['이젠 부야. 다섯 부. 동부, 서부, 남부, 북부, 기리고 대궐 둘레 내부.', '가도 같이 커졌디. 이젠 대가라 부른다. 우리 아바이처럼. 내일은 나처럼.']
			),
			words(
				[
					{ char: '가', gloss: 'Ka', meaning: 'Chieftain, of a tribe', meaningKo: '족장, 부족의' },
					{ char: '대가', gloss: 'Deka', meaning: 'Commander, of a commandery', meaningKo: '사령관, 부의' },
					{ char: '5부', gloss: 'O-bu', meaning: 'Five Commanderies', meaningKo: '다섯 부' }
				],
				'Goguryeo’s own words, older than any character the West wrote them in.',
				'고구려 사람들 제 말이다. 서쪽 사람들이 갖다 붙인 어느 글자보다도 오래됐다.'
			),
			say('gesomun', ['The Inner one sits in the middle. Whoever’s High Commander sits there.'], ['내부는 가운데 앉디. 막리지가 누구든 거기 앉아.']),
			{ kind: 'dialogue', person: 'gulgul', speaker: '🧒', chip: chipOf('gulgul'), en: ['…Deka.'], lines: ['…대가.'] },
			say('yeonwife', ['Don’t teach him that one.'], ['그건 가르치지 마요.'])
		);
		console.log('Five Tribes: Jolbon → five tribes → Five Commanderies');
	}
	const eye = findIdx(B, 'Every ka keeps his own men, aye?');
	if (eye >= 0) B[eye].en[0] = B[eye].en[0].replace('Every ka keeps', 'Every Deka keeps');

	addImage(
		tribes,
		slot(
			'five-tribes-jolbon',
			'there were five tribes in one valley',
			'Five chieftains in silhouette sit around one fire in a valley ring, each under a totem of his tribe: crow, horse, cow, boar, dog',
			'Five tribes in one valley, long ago at Jolbon. A packed-earth ring at the bottom of a narrow river valley between black ink mountains; around ONE fire in the centre FIVE chieftains in black silhouette sit or crouch in a wide ring, five poses (one standing and pointing, one with arms crossed, one leaning on a spear, one drinking from a horn, one half turned away); behind each a tall totem pole topped by his animal (a crow, a horse head, cow horns, a boar, a dog); the five animals loom again as smoke on the ridgeline in a crimson #c8322a sky. Ink black, crimson, bone-white haze.'
		)
	);
	addImage(
		tribes,
		slot(
			'five-tribes-commanderies',
			'Now they’re commanderies',
			'Five mounted Commanders in silhouette on five ridges around a walled river city, each banner a direction colour, roads of riders running into the walls',
			'The Five Commanderies. High bird’s-eye over a walled city on a wide river at dusk (walls inside walls, a red two-tier gate tower); on four ridges at the four directions FOUR mounted Commanders in black silhouette with tall banners (east banner blue, west white, south red, north black), and the fifth on the palace terrace inside the walls with a yellow banner; from each ridge a long road of tiny riders runs into the city like a spoke. Crimson-to-black sky, ink black, the five banner colours as the only accents. Riders wear helmets.'
		)
	);
}

// The handoff at the Summit uses the new word.
{
	const summit = entryOf('samhan', 'High Summit');
	const i = findIdx(summit.blocks, 'Every ka keeps his own men.');
	if (i >= 0) {
		summit.blocks[i].en = summit.blocks[i].en.map((l) => l.replace('Every ka keeps', 'Every Deka keeps'));
		console.log('High Summit: Every Deka keeps his own men');
	}
}

// ── Jade Gate Valley ─────────────────────────────────────────────────────────
const jade = entryOf('samhan', 'Jade Gate Valley');
{
	const B = jade.blocks;
	if (!has(B, 'chose one Great Kan over all six')) {
		const at = must(findIdx(B, 'Here is how Silla counts a boy.'), 'Here is how Silla counts a boy');
		B.splice(
			at,
			0,
			p(
				'Silla’s purple is older than Silla. Before there was a king, there were six villages in the valley, and each one had a Kan. An elder.',
				'신라의 자색은 신라보다 오래됐다. 임금이 있기 전, 골짜기에 마을이 여섯 있었고, 마을마다 간이 하나 있었다. 어른.'
			),
			words(
				[
					{ char: '간', gloss: 'Kan', meaning: 'Elder, of a village', meaningKo: '촌장, 마을의' },
					{ char: '거서간', gloss: 'Great Kan', meaning: 'Hyukgose, the great Kan', meaningKo: '혁거세, 큰 간' },
					{ char: '6촌', gloss: 'Yukchon', meaning: 'Six Elders', meaningKo: '여섯 촌장' }
				],
				'Silla’s own words, from before anyone in Surabol could write.',
				'신라 사람들 제 말이다. 서라벌에 글 아는 사람이 하나도 없던 때부터 쓰던 말.'
			),
			p(
				'The six Kans met on a hill and chose one Great Kan over all six. Where they found him is another story, and a good one.',
				'여섯 간이 언덕에 모여, 여섯 위에 큰 간 하나를 세웠다. 그를 어디서 찾았는지는 다른 이야기다. 좋은 이야기다.'
			),
			p(
				'The six villages became the six quarters of the capital. The Kans’ grandchildren became True Bone. Every purple sleeve on this yard can count back to one of six old men on a hill, and most of them will, if you let them.',
				'여섯 마을은 도성의 여섯 부가 되었다. 간들의 자손은 진골이 되었다. 이 연무장의 자색 소매는 하나같이 언덕 위 늙은이 여섯 중 하나까지 거슬러 셀 수 있다. 내버려 두면 대개 정말 센다.'
			)
		);
		const bone = must(
			B.findIndex((b) => b.kind === 'term' && b.diagram === 'bone-rank'),
			'bone-rank term'
		);
		B[bone].html =
			'Bone, as in the bone you were born with. Sacred Bone may wear the crown. True Bone may run the country. Everyone else may count the robes. Even among the True Bone, the eldest son of the eldest son outranks his cousins, and at every dinner in Surabol everyone knows exactly who that is.';
		B[bone].ko =
			'뼈. 타고난 그 뼈다. 성골은 왕관을 쓸 수 있다. 진골은 나라를 굴릴 수 있다. 나머지는 옷 색깔을 셀 수 있다. 진골 안에서도 맏아들의 맏아들로 내려온 줄기가 사촌들 위에 앉고, 서라벌의 어느 잔칫상에서든 그게 누군지 모르는 사람은 없다.';
		console.log('Jade Gate Valley: six Kans → True Bone');
	}
	addImage(
		jade,
		slot(
			'jade-six-kan',
			'chose one Great Kan over all six',
			'Six village elders in silhouette climb a moonlit hill from six directions toward one young figure on the summit',
			'Six elders choose a Great Kan. A low grassy hill on a wide plain under a deep Silla-blue #2a4fa8 dusk with a huge pale-gold #e9cf7a moon; SIX village elders in black silhouette climb toward the summit from six directions, each with a staff or a torch, six poses (bent with a staff, arm raised, carrying a torch, kneeling to rest, pointing up, beckoning the one behind); on the summit, small, ONE young figure stands with his back to us; far below behind each elder a tiny village of thatched roofs with one hearth light. No egg, no horse. Blue, gold, black.'
		)
	);
	addImage(
		jade,
		slot(
			'jade-six-shadows',
			'Every purple sleeve on this yard can count back',
			'Six old elders in silhouette cast long shadows across a courtyard that turn into rows of young nobles in purple sleeves',
			'From six elders to True Bone. Low sun from the left over a long packed-earth courtyard; on the left SIX old elders in black silhouette stand in a row leaning on staffs; their long shadows stretch to the right across the ground and, as they go, the shadows turn into rows and rows of young nobles in silhouette whose wide sleeves alone are coloured deep purple #6b3fa0; at the far right edge a tiny Hwarang yard of drilling boys. Ink black, warm hanji cream, purple sleeves as the only accent.'
		)
	);
}

// ── Eight Great Clans ────────────────────────────────────────────────────────
const clans = entryOf('samhan', 'Eight Great Clans');
{
	const B = clans.blocks;
	if (!has(B, 'Ten men walked south with the first king')) {
		const quote = must(
			B.findIndex((b) => b.kind === 'quote'),
			'eight surnames quote'
		);
		B.splice(
			quote + 1,
			0,
			p(
				'Ask any of the eight where they came from, and you will get a long answer that ends with their own house. Here is the short one.',
				'여덟 가문 누구에게든 어디서 왔느냐고 물어보라. 긴 대답이 돌아오고, 그 끝은 꼭 제 집안이다. 짧은 대답은 이렇다.'
			),
			p(
				'Ten men walked south with the first king. Ten attendants. They carried his rice, led his horse and held his banner, and when he built his city each of them got a hill.',
				'열 사내가 첫 임금을 따라 남쪽으로 걸어왔다. 열 신하. 쌀을 지고, 말을 끌고, 깃발을 들었다. 임금이 도읍을 세우자 저마다 언덕 하나씩을 받았다.'
			),
			p(
				'Eight of those hills are still in Sabi, with the same names over the gates. Nobody knows what became of the other two.',
				'그 언덕 가운데 여덟은 아직 사비에 있다. 대문 위 이름도 그대로다. 나머지 둘이 어떻게 됐는지는 아무도 모른다.'
			),
			{
				kind: 'dialogue',
				speaker: '🗣',
				chip: '#8a8a94',
				en: [
					'Went back north, they say.',
					'Drowned in the river.',
					'Went over to Silla, and Silla’s too proud to say.',
					'Married into Satek. Ever notice Satek never counts past eight?'
				],
				lines: [
					'북쪽으루 돌아갔다던디.',
					'강에 빠져 죽었댜.',
					'신라루 넘어갔는디 신라가 체면 땜에 말을 안 하는 겨.',
					'사택이랑 붙었지 뭐. 사택이 여덟 넘어 세는 거 본 적 있어?'
				]
			}
		);
		console.log('Eight Great Clans: ten attendants → eight houses');
	}
	addImage(
		clans,
		slot(
			'clans-ten-attendants',
			'Ten men walked south with the first king',
			'Ten attendants in silhouette reach a river plain at dawn: eight plant clan banners on eight low hills, the last two walk on into the fog',
			'Ten attendants become eight houses. A wide river plain at golden dawn #e2b23c with a river curving through it; TEN attendants in black silhouette who have walked south arrive at the plain; EIGHT of them each plant a tall clan banner on eight low hills in a long arc (eight poses: driving a pole into the earth, kneeling, raising both arms, holding a child, leading a horse, carrying a rice sack, a spear, a seed jar); the last TWO keep walking on into a bank of white river fog, already half dissolved, one of them looking back. Baekje gold, indigo foreground, black.'
		)
	);
}

// ── Baekje's Prime Minister ──────────────────────────────────────────────────
const BAEKJE = [
	['samhan', 'Eight Great Clans'],
	['samhan', 'Deer Rock'],
	['five-principles', 'Yunchung'],
	['fall-of-euija', 'Coup'],
	['fall-of-euija', 'Descent'],
	['fall-of-euija', 'Nine Omens']
];
const PM = (s) => s.replace(/\bPremier\b/g, 'Prime Minister').replace(/\bpremier\b/g, 'prime minister');
const rewrite = (o) => {
	if (typeof o === 'string') return PM(o);
	if (Array.isArray(o)) return o.map(rewrite);
	if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, rewrite(v)]));
	return o;
};
for (const [c, t] of BAEKJE) {
	const e = entryOf(c, t);
	e.blocks = rewrite(e.blocks);
	e.images = rewrite(e.images);
}
console.log('Baekje: Premier → Prime Minister');

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + '\n');

const manifest = [tribes, jade, clans].flatMap((e) =>
	e.images.filter((im) => /^(five-tribes-|jade-six-|clans-ten-)/.test(im.id)).map(({ id, alt, prompt }) => ({ id, alt, prompt }))
);
fs.writeFileSync(new URL('./manifest.json', import.meta.url), JSON.stringify(manifest, null, '\t') + '\n');
console.log(`manifest: ${manifest.length} stills`);
