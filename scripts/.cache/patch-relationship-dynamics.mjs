// Adds `dynamic` + `still` to existing bonds in src/lib/relations.ts and appends the new bonds.
// Usage: node scripts/.cache/patch-relationship-dynamics.mjs
import fs from 'node:fs';

const FILE = 'src/lib/relations.ts';
let src = fs.readFileSync(FILE, 'utf8');

const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const dyn = (en, ko) => `{ en: ${q(en)}, ko: ${q(ko)} }`;

const EXISTING = {
	'rel-chunchu-munmu': ['rel-chunchu-bupmin', 'Loving father · optimistic, heroic son', '다정한 아버지 · 낙천적이고 영웅적인 아들'],
	'rel-yushin-munmu': ['rel-yushin-bupmin', 'Strong, disciplined uncle · apprentice nephew', '강인하고 엄격한 외삼촌 · 수련하는 조카'],
	'rel-taizong-gaozong': ['rel-taizong-zhi', 'Stern, worried father · son trying to fill his shoes', '엄하고 걱정 많은 아버지 · 그 자리를 채우려 애쓰는 아들'],
	'rel-sunduk-jinduk': ['rel-sunduk-jinduk', 'Sisterly cousins', '자매 같은 사촌'],
	'rel-jumong-sosuno': ['rel-jumong-sosuno', 'Laid-back, charming king · doting, hot-blooded, clingy tsundere queen', '느긋하고 매력적인 왕 · 헌신적이고 뜨겁고 집착하는 츤데레 왕비'],
	'rel-yushin-bidam': ['rel-bidam-yushin', 'Eternal friends and rivals — the two greatest men in Samhan', '영원한 벗이자 맞수 — 삼한 최고의 두 사내'],
	'rel-yushin-sunduk': ['rel-sunduk-yushin', 'A love that cannot be — mutual, aching, wanting', '이루어질 수 없는 사랑 — 서로 사랑하고, 서로 원하는'],
	'rel-euija-gyebek': ['rel-euija-gyebek', 'Extraverted, social king · the general who answers only the question', '외향적이고 사교적인 왕 · 묻는 말에만 답하는 장군']
};

for (const [id, [still, en, ko]] of Object.entries(EXISTING)) {
	const start = src.indexOf(`id: '${id}',`);
	if (start < 0) throw new Error(`missing ${id}`);
	const end = src.indexOf('\n\t}', start);
	const body = src.slice(start, end);
	if (body.includes('dynamic:')) continue;
	const m = body.match(/\n\t\tbetween: \[[^\]]+\],/);
	if (!m) throw new Error(`${id}: no between`);
	const at = start + m.index + m[0].length;
	src = `${src.slice(0, at)}\n\t\tdynamic: ${dyn(en, ko)},\n\t\tstill: ${q(still)},${src.slice(at)}`;
}

const NEW = [
	{
		id: 'rel-kingmu-euija',
		name: 'King Mu & Euija',
		korean: '무왕 · 의자',
		kingdom: 'baekje',
		between: ['kingmu', 'euija'],
		title: 'Learn their names anyway',
		tagline: 'The old king says the clan names first. His son would rather not learn them.',
		arc: 'King Mu bought a country with a children’s song and spent his reign fighting Silla. Euija grows up admiring the trick and despising the clans that make it necessary. The father’s one plain lesson — learn their names anyway — is the one the son keeps after he stops keeping anything else; on his coronation morning he stages a dragon over the Sabi because his father once staged a song.',
		events: [
			[632, 'Learn their names anyway.'],
			[641, 'Mu dies; Euija takes the throne to finish his war.']
		],
		dynamic: ['Ageing father · ambitious, cynical son', '늙어 가는 아버지 · 야심 많고 냉소적인 아들'],
		still: 'rel-mu-euija',
		aliases: ['King Mu & Euija', 'Euija & King Mu', 'Mu & Euija']
	},
	{
		id: 'rel-munmu-gotaso',
		name: 'Bupmin & Gotaso',
		korean: '법민 · 고타소',
		kingdom: 'silla',
		between: ['munmu', 'gotaso'],
		title: 'Not racing — following',
		tagline: 'She shouted faster. He insisted he wasn’t racing.',
		arc: 'A year apart and inseparable: Gotaso demands faster, Bupmin insists he is only following. She marries for love and rides to Daeya; he waits at the gate for a sister who promised forever and learns the empty road from Munhee. “I will make a country where sisters come home” is the first thing he says like a king for all.',
		events: [
			[632, 'The palace-road ride: faster, and following.'],
			[642, 'Daeya falls; he waits at the gate.']
		],
		dynamic: ['Loving siblings', '다정한 남매'],
		still: 'rel-bupmin-gotaso',
		aliases: ['Bupmin & Gotaso', 'Gotaso & Bupmin', 'Munmu & Gotaso']
	},
	{
		id: 'rel-seohyeon-yushin',
		name: 'Seohyeon & Yushin',
		korean: '서현 · 유신',
		kingdom: 'silla',
		between: ['seohyeon', 'yushin'],
		title: 'Your helmet’s crooked',
		tagline: 'A Gaya father who proved belonging by service, and a son who wanted him to say so.',
		arc: 'Seohyeon made the surrender of Gaya into a Silla household by working harder than anyone born to it, and raised his son the same way: no praise, only the next order. At Nangbi Yushin takes off his helmet before him to ask leave; Seohyeon tells him to put it back on and go. When the son comes back with a general’s head, the father straightens the helmet with both hands — the most he ever says. His ghost says the rest before Radiance’s tenth day.',
		events: [
			[629, 'Nangbi: “Put your helmet on. Then go.”'],
			[647, 'Ghost in the cavern — “You are Kim Yushin.”']
		],
		dynamic: ['Stern father with an immigrant’s work ethic · son eager for acceptance', '이주민의 근면을 지닌 엄한 아버지 · 인정받고 싶은 아들'],
		still: 'rel-seohyeon-yushin',
		aliases: ['Seohyeon & Yushin', 'Yushin & Seohyeon']
	},
	{
		id: 'rel-sukwon-bidam',
		name: 'Sukwon & Bidam',
		korean: '숙원 · 비담',
		kingdom: 'silla',
		between: ['sukwon', 'bidam'],
		title: 'The higher teaching',
		tagline: 'An old-hall father who sent his son to the yard with one question and a tight headband.',
		arc: 'Son Sukwon of Musan hall named his boy after the Abhidharma and taught by asking. On Class 51’s first morning he walks Bidam to the yard gate and no further: rather a righteous traitor than an unrighteous king. He dies before Radiance; the teaching does not, and it is the sentence Bidam carries into the rebellion.',
		events: [
			[610, 'Ties the headband once, tight, at the yard gate.'],
			[647, 'His son raises the banner at Radiance.']
		],
		dynamic: ['Aristocratic father and son', '귀족 가문의 아버지와 아들'],
		still: 'rel-bidam-sukwon',
		aliases: ['Sukwon & Bidam', 'Bidam & Sukwon', 'Bidam & his father']
	},
	{
		id: 'rel-yongsu-chunchu',
		name: 'Yongsu & Chunchu',
		korean: '용수 · 춘추',
		kingdom: 'silla',
		between: ['yongsu', 'chunchu'],
		title: 'The night bridge',
		tagline: 'A strange, brilliant father who talked to the dark, and the son who carried the lamp.',
		arc: 'Kim Yongsu is the deposed King Jinji’s son, and the Bihyung streak runs in him: up past midnight by the stream, talking to things nobody else can see, laying a bridge of stones before dawn. He is also the cleverest man in the house. He tells nine-year-old Chunchu the Council’s three counts and one rule — stay out of the room that eats the men who amuse it — and Chunchu spends his life sitting wherever the room has to come to him.',
		events: [[612, 'The night bridge — “Stay out of that room.”']],
		dynamic: ['Brilliant, odd father · intelligent son', '영리하지만 기이한 아버지 · 총명한 아들'],
		still: 'rel-yongsu-chunchu',
		aliases: ['Yongsu & Chunchu', 'Chunchu & Yongsu']
	},
	{
		id: 'rel-sunduk-chunchu',
		name: 'Sunduk & Chunchu',
		korean: '선덕 · 춘추',
		kingdom: 'silla',
		between: ['sunduk', 'chunchu'],
		title: 'The aunt he asks first',
		tagline: 'He brings her the plan. She comes down the steps to hear it.',
		arc: 'Chunchu’s aunt by blood and his queen by vote. When the most cunning man in Samhan needs a second mind he comes to her before he comes to the Council. After Daeya he asks her again and again to send him north, and the night she finally says yes she says it sitting on the lowest step of her own dais.',
		events: [
			[632, 'She is crowned; he becomes the nephew with the plans.'],
			[642, 'She lets him go north to Pyongyang.']
		],
		dynamic: ['Loving aunt · nephew who comes to her for advice', '다정한 이모 · 조언을 구하러 오는 조카'],
		still: 'rel-sunduk-chunchu',
		aliases: ['Sunduk & Chunchu', 'Chunchu & Sunduk']
	},
	{
		id: 'rel-chunmyung-chunchu',
		name: 'Chunmyung & Chunchu',
		korean: '천명 · 춘추',
		kingdom: 'silla',
		between: ['chunmyung', 'chunchu'],
		title: 'Still bigger than you in this hall',
		tagline: 'She gave up a crown for his father and never mentioned it. She mentions very little.',
		arc: 'Princess Chunmyung stepped out of the Sacred Bone succession to marry a True Bone, and raised the son who would found the Gyeongju Kim throne anyway. She let his father teach him to count and let him grow cleverer than her without once being impressed. The night Daeya falls she finds him on the floor below the dais and tells him to stop counting.',
		events: [
			[603, 'Chunchu is born.'],
			[642, 'The night Daeya falls: “Put your head down.”']
		],
		dynamic: ['Intelligent son · ageing mother', '총명한 아들 · 늙어 가는 어머니'],
		still: 'rel-chunmyung-chunchu',
		aliases: ['Chunmyung & Chunchu', 'Chunchu & Chunmyung']
	}
];

const render = (r) =>
	[
		'\t{',
		`\t\tid: ${q(r.id)},`,
		`\t\tname: ${q(r.name)},`,
		`\t\tkorean: ${q(r.korean)},`,
		`\t\tentity: 'relationship',`,
		`\t\tkingdom: ${q(r.kingdom)},`,
		`\t\tbond: 'kin',`,
		`\t\tbetween: [${r.between.map(q).join(', ')}],`,
		`\t\tdynamic: ${dyn(...r.dynamic)},`,
		`\t\tstill: ${q(r.still)},`,
		`\t\ttitle: ${q(r.title)},`,
		`\t\ttagline: ${q(r.tagline)},`,
		`\t\tarc: ${q(r.arc)},`,
		'\t\tevents: [',
		r.events.map(([year, label]) => `\t\t\t{ year: ${year}, label: ${q(label)} }`).join(',\n'),
		'\t\t],',
		`\t\taliases: [${r.aliases.map(q).join(', ')}]`,
		'\t}'
	].join('\n');

const fresh = NEW.filter((r) => !src.includes(`id: '${r.id}',`));
if (fresh.length) {
	const close = src.indexOf('\n];\n\nexport function relationOf');
	if (close < 0) throw new Error('RELATIONSHIPS close not found');
	src = `${src.slice(0, close)},\n${fresh.map(render).join(',\n')}${src.slice(close)}`;
}

fs.writeFileSync(FILE, src);
console.log(`dynamics on ${Object.keys(EXISTING).length} bonds; added ${fresh.map((r) => r.id).join(', ') || 'none'}`);
