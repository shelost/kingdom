import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'The Eight Great Clans');
if (!entry) throw new Error('entry missing');

const pGrid = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('square grid in the palace yard')
);
if (!pGrid) throw new Error('grid p missing');
pGrid.html =
	'Once a year the street volume drops and the palace raises its own. Same two-tier hall. Same long giwa wings. Same pale path to the steps. On that packed earth the court chalks a <b>square grid in the palace yard</b> — four hard white lines, no furniture, no banners worth reading — and the <b>young men of each house step onto the grid</b> in white. Eight houses. Eight fighting styles. The same quarrel as the west bridge, conducted without carts.';
pGrid.ko =
	'일 년에 한 번, 저잣거리의 소리가 잦아들고 궁이 제 소리를 올린다. 같은 이중 전각. 같은 긴 기와 날개. 섬돌로 가는 같은 옅은 길. 그 다진 흙에 조정이 <b>궁뜰 네모 격자</b>를 긋는다 — 흰 선 넷, 가구 없고, 읽을 만한 깃발도 없다 — 그러면 각 집 <b>젊은이들이 격자 위로</b> 흰옷을 입고 오른다. 여덟 가문. 여덟 가지 싸움법. 서시 다리와 같은 다툼을, 짐수레 없이 하는 것이다.';

const pSword = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('Mokgeom mid-strike on the grid')
);
if (!pSword) throw new Error('sword p missing');
pSword.html =
	'The sword bouts go first, still on that pale path, the two-tier hall filling the far end. Mokgeom — wood that still remembers steel. A boy from Jinmo takes <b>Sangdanse</b> high guard; a Satek answers from middle. On the call they move: overhead cut, advance-and-strike, blades skim, chalk dust. <b>Mokgeom mid-strike on the grid</b> — then a near-miss so close the white sleeves clap. <b>Blades skim the chalk.</b> <b>Over his shoulder the chalk holds</b> — from the steps you only see a back, a lunge, and the hard L of the square.';
pSword.ko =
	'검이 먼저다. 그 옅은 길 위, 먼 쪽이 이중 전각으로 막힌 채로. 목검 — 그래도 쇠를 기억하는 나무. 진모 쪽이 <b>상단세</b>로 올리고, 사택이 중단으로 받는다. 구령에 움직인다. 내려찍기, 진전격적, 날이 스치고, 분필 가루. <b>격자 위 목검이 한가운데서 부딪친다</b> — 그다음엔 흰 소매가 맞부딪힐 만큼 가까운 빗나감. <b>날이 분필선을 스친다.</b> <b>어깨 너머로 분필선이 버틴다</b> — 섬돌에서는 등, 찌르기, 네모의 굳은 ㄱ자만 보인다.';

const pDusk = entry.blocks.find(
	(b) => b.kind === 'p' && String(b.html).includes('elders watch from the hall steps')
);
if (!pDusk) throw new Error('dusk p missing');
pDusk.html =
	'From the timber steps of that same two-tier hall the houses keep score like berths. The <b>elders watch from the hall steps</b> — always — and still miscount when the sleeve is theirs. By dusk the white is grey with chalk and grit. The pale path is the same path. Nobody has settled four generations. That was never the point. The point was to put the quarrel where the throne can see it — and to send the boys home with a score instead of a funeral.';
pDusk.ko =
	'그 같은 이중 전각의 목재 섬돌에서 가문들은 선석 세듯 점수를 센다. <b>원로들은 전각 섬돌에서 본다</b> — 늘 본다 — 그래도 제 소매 일이면 잘못 센다. 해 질 녘이면 흰옷이 분필과 모래로 잿빛이 된다. 옅은 길은 그 길이다. 사대 원한을 누가 결판낸 것은 아니다. 애초에 그게 목적이 아니었다. 목적은 다툼을 왕좌가 볼 수 있는 자리에 두는 것 — 그리고 애들을 장례 대신 점수로 돌려보내는 것이다.';

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched tournament copy');
