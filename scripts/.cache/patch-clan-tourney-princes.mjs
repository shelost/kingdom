import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'The Eight Great Clans');
if (!entry) throw new Error('entry missing');

const PLACE = '/pl_sabi_tourney.png';
const YUNG = '/ch_yung.png';
const TAE = '/ch_tae.png';
const HYO = '/ch_hyo.png';
const YUN = '/ch_yun.png';

const refsById = {
	'clan-tourney-grid-wide': [PLACE],
	'clan-tourney-call': [PLACE, YUNG, HYO],
	'clan-tourney-sword-midstrike': [PLACE, YUNG, HYO],
	'clan-tourney-sword-dutch': [PLACE, YUNG, HYO],
	'clan-tourney-sword-ots': [PLACE, YUNG, HYO],
	'clan-tourney-sword-victory': [PLACE, YUNG, HYO],
	'clan-tourney-ssireum-grip': [PLACE, TAE, YUN],
	'clan-tourney-ssireum-lift': [PLACE, TAE, YUN],
	'clan-tourney-ssireum-throw': [PLACE, TAE, YUN],
	'clan-tourney-spectators': [PLACE]
};
const peopleById = {
	'clan-tourney-grid-wide': ['yung', 'tae', 'hyo', 'yun', 'pung'],
	'clan-tourney-call': ['yung', 'hyo'],
	'clan-tourney-sword-midstrike': ['yung', 'hyo'],
	'clan-tourney-sword-dutch': ['yung', 'hyo'],
	'clan-tourney-sword-ots': ['yung', 'hyo'],
	'clan-tourney-sword-victory': ['yung', 'hyo'],
	'clan-tourney-ssireum-grip': ['tae', 'yun'],
	'clan-tourney-ssireum-lift': ['tae', 'yun'],
	'clan-tourney-ssireum-throw': ['tae', 'yun'],
	'clan-tourney-spectators': ['pung', 'eldersatek', 'elderyunbi']
};

for (const im of entry.images ?? []) {
	if (!refsById[im.id]) continue;
	im.refs = refsById[im.id];
	im.people = peopleById[im.id];
}

const pGrid = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('square grid in the palace yard')
);
if (!pGrid) throw new Error('grid p missing');
pGrid.html =
	'Once a year the street volume drops and the palace raises its own. On crushed-black packed earth the court chalks a <b>square grid in the palace yard</b> — one white square, slightly rotated, a gold sun-stripe through it, the two-tier hall only a dark bar at the far edge. Then <b>the five princes step onto the grid</b> in white. Not clan champions. Euija’s named sons. The houses still keep score from the steps; the bodies on the chalk are already the succession.';
pGrid.ko =
	'일 년에 한 번, 저잣거리의 소리가 잦아들고 궁이 제 소리를 올린다. 짓이겨진 검은 다진 흙에 조정이 <b>궁뜰 네모 격자</b>를 긋는다 — 흰 네모 하나, 살짝 기울고, 금빛 햇살이 한 줄 지나가고, 이중 전각은 먼 쪽의 어두운 가로대일 뿐. 그러면 <b>다섯 왕자가 격자 위로</b> 흰옷을 입고 오른다. 가문의 전사가 아니다. 의자의 이름 있는 아들들이다. 점수는 여전히 섬돌에서 가문들이 매기고, 분필 위의 몸은 이미 후계다.';

const pSword = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('Mokgeom mid-strike on the grid')
);
if (!pSword) throw new Error('sword p missing');
pSword.html =
	'The sword bouts go first. <b>Yung</b> takes the gold stripe without asking; <b>Hyo</b> takes the ink half of the square. Mokgeom — wood that still remembers steel. Eldest high guard; the quieter brother from middle. On the call they move. <b>Mokgeom mid-strike on the grid</b> — then a near-miss so close the white sleeves clap. <b>Blades skim the chalk.</b> <b>Over his shoulder the chalk holds</b> — from the hall bar you only see Yung’s back, Hyo’s lunge, and the hard L of the square.';
pSword.ko =
	'검이 먼저다. <b>융</b>은 묻지 않고 금빛 줄을 차지하고, <b>효</b>는 네모의 먹 쪽을 차지한다. 목검 — 그래도 쇠를 기억하는 나무. 맏이가 상단, 조용한 아우가 중단. 구령에 움직인다. <b>격자 위 목검이 한가운데서 부딪친다</b> — 그다음엔 흰 소매가 맞부딪힐 만큼 가까운 빗나감. <b>날이 분필선을 스친다.</b> <b>어깨 너머로 분필선이 버틴다</b> — 전각 가로대에서는 융의 등, 효의 찌르기, 네모의 굳은 ㄱ자만 보인다.';

const crowd = entry.blocks.find(
	(b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en.includes('Point to the white sleeve.')
);
if (crowd) {
	crowd.en = [
		'That’s Yung.',
		'Of course it is.',
		'Hyo’s feet are faster.',
		'Point to the white sleeve.'
	];
	crowd.lines = ['저거 융이다.', '당연하지.', '효 쪽이 발은 빨라.', '점 — 흰 소매에.'];
}

const pSsireum = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('satba locked before they stand')
);
if (!pSsireum) throw new Error('ssireum p missing');
pSsireum.html =
	'When the wooden points are tallied, the sand comes out inside the same square. Ssireum — <b>Tae</b> and <b>Yun</b>, <b>satba locked before they stand</b>, knees in the grit, equal grips on waist and thigh, then up without letting go. No circling for a hold. The bout is the hold. Second son versus the one whose name the street keeps mishearing.';
pSsireum.ko =
	'목검 점수가 쌓이면 같은 네모 안에 모래가 나온다. 씨름 — <b>태</b>와 <b>연</b>, <b>일어서기 전에 샅바부터 잠근다</b>. 무릎은 모래에, 허리와 허벅지 샅바를 같은 힘으로 잡고, 놓지 않은 채로 일어선다. 잡고 돌 틈이 없다. 붙잡은 것이 곧 시합이다. 둘째와, 저잣거리가 이름을 자꾸 잘못 듣는 아이.';

const pLift = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('deulbaejigi clears the sand')
);
if (!pLift) throw new Error('lift p missing');
pLift.html =
	'Tae hooks; Yun answers with hip. Then <b>deulbaejigi clears the sand</b> — lift onto the belly, second hoist, turn right, and Yun’s feet leave the earth. The yard goes quiet the way a berth goes quiet when a rope snaps. <b>Sand takes the shoulder.</b> Any part above the knee. The chalk does not argue.';
pLift.ko =
	'태가 걸고, 연이 허리로 받는다. 그러다 <b>들배지기가 모래를 비운다</b> — 배로 올리고, 한 번 더 추켜, 오른쪽으로 돌리면 연의 발이 뜬다. 마당이 조용해진다. 밧줄이 끊어질 때 선석이 조용해지듯. <b>모래가 어깨를 받는다.</b> 무릎 위 어디든. 분필은 따지지 않는다.';

const pDusk = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('elders watch from the hall steps')
);
if (!pDusk) throw new Error('dusk p missing');
pDusk.html =
	'From the timber bar of that hall the houses keep score like berths. The <b>elders watch from the hall steps</b> — always — and still miscount when the sleeve is theirs. <b>Pung</b> sits too small for the square, white like his brothers, kicking the step. By dusk the white is grey with chalk and grit. Nobody has settled four generations. That was never the point. The point was to put the quarrel where the throne can see it — and to send the boys home with a score instead of a funeral.';
pDusk.ko =
	'그 전각의 목재 가로대에서 가문들은 선석 세듯 점수를 센다. <b>원로들은 전각 섬돌에서 본다</b> — 늘 본다 — 그래도 제 소매 일이면 잘못 센다. <b>풍</b>은 네모에 오르기엔 아직 작고, 형들처럼 흰옷만 입고 섬돌을 찬다. 해 질 녘이면 흰옷이 분필과 모래로 잿빛이 된다. 사대 원한을 누가 결판낸 것은 아니다. 애초에 그게 목적이 아니었다. 목적은 다툼을 왕좌가 볼 수 있는 자리에 두는 것 — 그리고 애들을 장례 대신 점수로 돌려보내는 것이다.';

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched princes tournament');
