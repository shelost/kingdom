// Hyukgosé opens on the road: refugees out of the fallen north, six groups, six villages,
// six Kans (surnames first), and a vote that goes six ways until the horse.
// Idempotent.  node scripts/.cache/hyukgose-open/apply.mjs
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const chapters = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const e = chapters.find((c) => c.id === 'chunchu-era').entries.find((x) => x.title === 'Hyukgosé');
if (!e) throw new Error('missing Hyukgosé');
const B = e.blocks;

const p = (html, ko) => ({ kind: 'p', html, ko });
const extra = (speaker, en, lines, gender = 'm') => ({ kind: 'dialogue', speaker, chip: '#8d8d95', gender, en, lines });

if (!B.some((b) => b.kind === 'scene' && b.label === 'The Road South')) {
	const map = B.findIndex((b) => b.kind === 'map');
	Object.assign(B[map], {
		places: ['asadal', 'surabol'],
		routes: ['joseon-refugees-south'],
		title: 'The road south',
		caption: 'Out of the fallen north, down the east side of the mountains, to six valleys by the sea.',
		ko: '무너진 북쪽에서, 산줄기 동쪽을 타고, 바다 가까운 여섯 골짜기로.'
	});

	const opening = [
		{ kind: 'scene', label: 'The Road South', ko: '남쪽 길', weather: 'snow' },
		p(
			'Start further back. Fifty years before the horse, an emperor from the west takes the old kingdom in the north. Its people do what people do. They pick up the pot, the seed bag and the grandmother, and they walk.',
			'조금 더 앞에서 시작하자. 그 말이 나타나기 쉰 해 전, 서쪽의 황제가 북쪽의 옛 나라를 삼킨다. 그 나라 사람들은 사람들이 늘 하는 일을 한다. 솥을 지고, 씨앗 자루를 들고, 할머니를 업고, 걷는다.'
		),
		extra('A woman on the road', ['Where are we going?'], ['어디로 가요?'], 'f'),
		extra('Her husband', ['South.'], ['남쪽.']),
		extra('A woman on the road', ['What’s south?'], ['남쪽에 뭐가 있는데요?'], 'f'),
		extra('Her husband', ['Not them.'], ['그놈들이 없는 데.']),
		extra('An old man', ['There’s no Joseon to go back to. Stop looking over your shoulder.'], ['돌아갈 조선은 없다. 그만 뒤돌아봐.']),
		p(
			'They do not go as one people. They go as families, then as whoever shares a fire, then as whoever is still walking. By the time the mountains run out, the road has sorted them into six groups.',
			'그들은 한 무리로 가지 않는다. 처음엔 집안끼리, 그다음엔 불을 나눠 쓰는 사람끼리, 나중엔 아직 걷고 있는 사람끼리 간다. 산이 끝날 무렵, 길은 그들을 여섯 무리로 갈라 놓았다.'
		),
		p(
			'Each group finds a valley and stays. Six valleys, six villages. Each village has a Kan, an elder, who settles the fights about water and gets blamed for the weather.',
			'무리마다 골짜기 하나를 찾아 눌러앉는다. 골짜기 여섯, 마을 여섯. 마을마다 간이 하나 있다. 물싸움을 말리고, 날씨 탓을 뒤집어쓰는 어른.'
		),
		p(
			'Remember the surnames. Their grandchildren will still be using them in seven hundred years. <b>Lee</b> Alpyung talks first. <b>Choi</b> Sobuldori asks what everyone else was avoiding. <b>Jung</b> Jibekho brings the wine, or complains that nobody did. <b>Son</b> Gurema says almost nothing and is listened to anyway. <b>Bae</b> Jita counts. <b>Sul</b> Hojin came the farthest and has never let anyone forget it.',
			'성을 기억해 두라. 그 손자의 손자들이 칠백 년 뒤에도 그 성을 쓴다. <b>이</b>알평은 먼저 말한다. <b>최</b>소벌도리는 다들 피하던 질문을 한다. <b>정</b>지백호는 술을 가져오거나, 아무도 안 가져왔다고 투덜댄다. <b>손</b>구례마는 거의 말이 없는데도 다들 귀를 기울인다. <b>배</b>지타는 센다. <b>설</b>호진은 제일 멀리서 왔고, 그걸 아무에게도 잊게 두지 않는다.'
		),
		p(
			'Strictly, the surnames came later, from a grateful king. The six families will tell you they had them all along.',
			'엄밀히 말하면 성은 나중에, 고마워한 어느 임금이 내려 준 것이다. 여섯 집안은 원래부터 있었다고 할 것이다.'
		)
	];
	B.splice(map + 1, 0, ...opening);

	const ridge = B.findIndex((b) => b.kind === 'p' && b.html.startsWith('They are village chiefs, from six valleys'));
	B.splice(
		ridge,
		1,
		p(
			'Every spring the six Kans meet on the ridge of Mount Yang to choose a king. Every spring they vote. Six stones, one bowl, and it has to be all six, or the losers go home and sharpen something.',
			'해마다 봄이면 여섯 간이 양산 능선에 모여 임금을 뽑는다. 해마다 패를 넣는다. 돌 여섯, 그릇 하나. 여섯이 다 같아야 한다. 아니면 진 쪽이 집에 가서 뭔가를 간다.'
		),
		p(
			'This spring they count the bowl. Six stones, five names. Every Kan has voted for himself, except Son Gurema, who voted for Lee Alpyung. Lee Alpyung voted for himself.',
			'올봄에도 그릇을 센다. 돌 여섯에 이름 다섯. 간마다 저 자신을 찍었다. 손구례마만 이알평을 찍었다. 이알평은 저 자신을 찍었다.'
		)
	);
	console.log('Hyukgosé: road south, six villages, six Kans, the vote');
}

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + '\n');
