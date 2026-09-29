import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

const daeya = findEntry('Daeya Fortress');

const well = daeya.blocks.find((b) => text(b).includes('The well-post learns her hip first'));
if (well) {
	well.html =
		'Before the True Bone’s horse is even a rumour, the inside of Daeya already has a weather, and the weather is her. <b>The well-post learns her hip first.</b> Packed earth. Timber eaves. Men turn their heads as she passes. The wives they brought watch her instead of the water.';
	well.ko =
		'진골의 말이 소문도 되기 전에, 대야 안에는 이미 날씨가 있고, 그 날씨는 그녀다. <b>우물 기둥이 허리를 먼저 배운다.</b> 다진 흙. 나무 처마. 지나갈 때 사내들이 고개를 돌린다. 데려온 아내들은 물이 아니라 그녀를 본다.';
}

const store = daeya.blocks.find((b) => text(b).includes('The storehouse door is a dark mouth'));
if (store) {
	store.html =
		'She does not look at them. She places a hand on the red sash as if it had slipped, and it has not slipped. <b>The storehouse door is a dark mouth.</b> Yellow sleeves in the shadow forget they have wives standing next to them. The wives do not forget. Thirty-one. The silk is poor. The body is not.';
	store.ko =
		'그들을 보지 않는다. 붉은 끈이 흘러내린 것처럼 손을 올리는데, 흘러내린 적이 없다. <b>창고 문이 어두운 입이다.</b> 그늘의 노란 소매들이, 옆에 선 아내가 있는 줄을 잊는다. 아내들은 잊지 않는다. 서른하나. 비단은 가난하다. 몸은 아니다.';
}

const post = daeya.blocks.find((b) => text(b).includes('The post takes the silhouette'));
if (post) {
	post.html =
		'On the inner stair she lets the jeogori fall another finger. <b>The post takes the silhouette.</b> Men turn on the steps. Wives on the landing go still. They will tell themselves they were looking at the stair. They were looking at the curve under the ochre.';
	post.ko =
		'안쪽 계단에서 저고리를 손가락 하나만큼 더 내린다. <b>기둥이 실루엣을 받는다.</b> 계단의 사내들이 고개를 돌린다. 참의 아내들이 멈춘다. 계단을 봤다고 할 것이다. 황토 아래 곡선을 본 것이다.';
}

const jealous = daeya.blocks.find((b) => (b.en ?? []).join('').includes('That’s why I do.'));
if (jealous) {
	jealous.lines = ['손 봐. 일부러야.', '여보— 보지 마.', '못 봐. 그게 문제야.'];
	jealous.en = ['Watch the hand. That’s on purpose.', 'Don’t look at her.', 'I can’t. That’s the problem.'];
}

const feast = daeya.blocks.find((b) => text(b).includes('The families are still eating'));
if (feast) {
	feast.html =
		'The feast is not a private room. It is every man in Daeya and the families they brought. She walks the aisle. Bowls stop. Necks turn. The wives watch her, not the food, and the watching is already a fight. He looks at her instead of his own table. <b>The families are still eating.</b> She is already working.';
	feast.ko =
		'잔치는 밀실이 아니다. 대야의 사내들과 데려온 식구들이다. 그녀가 통로를 걷는다. 그릇이 멈춘다. 고개가 돈다. 아내들은 밥이 아니라 그녀를 보고, 그 눈이 이미 싸움이다. 그는 제 상 대신 그녀를 본다. <b>식구들은 아직 먹고 있다.</b> 그녀는 이미 일하고 있다.';
}

const alts = {
	'maehwa-garrison-01-well':
		'Movie frame: Maehwa walking the well-yard among men turning their heads; wives watching her',
	'maehwa-garrison-02-store':
		'Movie frame: she in the storehouse door; husbands turning; wives pulling sleeves',
	'maehwa-garrison-03-post':
		'Movie frame: inner stair, look-back; men turning up; wives on the landing jealous',
	'maehwa-feast-families':
		'Movie frame: feast aisle; she among the tables; men turning; wives jealous',
	'maehwa-feast-hands':
		'Movie medium: she seated at the feast, hand on hip and sash, room still around her'
};

for (const im of daeya.images ?? []) {
	if (alts[im.id]) {
		im.alt = alts[im.id];
		im.prompt =
			'One 16:9 movie frame. She is in the space with the extras, same light, no lamps, no halo. Men turning. Wives jealous. No text. No watermark.';
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('heads + jealous wives copy');
