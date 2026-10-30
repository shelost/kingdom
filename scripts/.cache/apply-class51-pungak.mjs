// Class 51 desk (Bidam's board, two noses, hall-face) + Pungak comet jump
// inside Gi's youth flashback. Kinship line in Seung 615. Guarded; rerun-safe.
import { openStory, p, text } from './story-edit.mjs';

const { entry, say, save, chipFor } = openStory();

const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const look = (person, lines, en) => ({
	kind: 'dialogue',
	person,
	look: 'hwarang',
	chip: chipFor(person),
	lines,
	en
});
const nam = (speaker, lines, en, extra = {}) => ({
	kind: 'dialogue',
	speaker,
	gender: extra.gender ?? 'm',
	chip: extra.chip ?? '#8d8d95',
	lines,
	en
});

const gi = entry('Gi');
const fb = gi.blocks.find((b) => b.kind === 'flashback' && (b.title || '').includes('Higher Teaching'));
if (!fb) throw new Error('Gi: Higher Teaching flashback missing');

const twoNoses = fb.blocks.findIndex((b) => text(b).includes('for the price of two noses'));
if (twoNoses < 0) throw new Error('Gi: two noses miss');

if (!JSON.stringify(fb.blocks).includes('The hall teaches its boys the same board')) {
	fb.blocks.splice(twoNoses + 1, 0, ...[
		scene('The Desk', '책상'),
		p(
			'The hall keeps a go board for boys who talk too much. Bidam sits without being asked. Two seniors are already losing and have not noticed.',
			'숙소에는, 말 많은 아이들용 바둑판이 있다. 비담은 불려지지도 않고 앉는다. 선배 둘이 이미 지고 있고, 아직 모른다.'
		),
		p(
			'Yushin is made to stand and watch. He does not know why. Alchun has found the leftover rice cakes and is not watching at all.',
			'유신은 서서 보라고 불린다. 이유는 모른다. 알천은 남은 주먹밥을 찾아냈고, 아예 안 본다.'
		),
		nam(
			'A senior',
			['새내기. 이름.', '이름 없으면 판에 못 앉혀.'],
			['New boy. Name.', 'No name, you don’t sit.']
		),
		look('yushin', ['아직입니다.'], ['Not yet.']),
		look(
			'bidam',
			['이름은 판이 끝나면 말하지.', '앉게. 돌이 멈추면 갖게 될 거야.'],
			['The name is the stake.', 'Sit. He’ll have it when the stones stop.']
		),
		p(
			'The hall teaches its boys the same board. You’ll meet the other one later, in magenta. This one is already three stones ahead, and still talking as if they were discussing weather.',
			'그 집안은 아이들에게 같은 판을 가르친다. 다른 하나는 나중에 만날 거다. 자홍 입고. 이 아이는 이미 세 수 앞이고, 날씨 이야기하듯 말을 잇는다.'
		),
		nam(
			'The other senior',
			['…너, 폐왕 아우 얼굴이군.', '비륜 아들인가.'],
			['…You’ve got the deposed king’s brother’s face.', 'Biryun’s boy.']
		),
		look('bidam', ['앉게.', '여기는 왼쪽이야. 자네 집이 아니야.'], ['Sit.', 'That’s the left. It isn’t your house.']),
		p(
			'They sit. They last eleven more stones. Bidam does not hurry them. When the bowl is empty he waits, still smiling, for a name that has not been paid.',
			'앉는다. 돌 열하나 더 간다. 비담은 재촉하지 않는다. 바구니가 비자, 아직 웃으면서, 아직 안 나온 이름을 기다린다.'
		),
		nam(
			'A senior',
			['이름 같은 건—'],
			['A name is—']
		),
		p(
			'They reach. He has already counted the reach. Two noses find the desk edge. Blood on the black headband, the first morning, before noon.',
			'손을 뻗는다. 그는 이미 그 거리를 세어 두었다. 코 둘이 책상 모서리를 만난다. 검은 머리띠에 피. 첫 아침, 낮이 되기도 전에.'
		),
		look('alchun', ['이야.', '주먹밥 남을 줄 알았는데.'], ['Well.', 'I thought there’d be cake left.']),
		look('bidam', ['김유신.', '써 두지.'], ['Kim Yushin.', 'I’ll write it down.']),
		p(
			'He writes it himself, in a hand the drum master will steal later. Yushin looks at the two seniors holding their faces, and at the boy who never stood up, and files both things away for a day when the score will still be even.',
			'그가 직접 쓴다. 북 장수가 나중에 훔쳐 갈 글씨로. 유신은 얼굴을 짚고 있는 선배 둘을 보고, 일어서지도 않은 아이를 보고, 둘 다 접어 둔다. 점수가 아직도 같을 날을 위해서.'
		)
	]);
}

const jokes = fb.blocks.findIndex((b) => text(b).includes('Jokes get thinner.'));
if (jokes < 0) throw new Error('Gi: jokes miss');

if (!JSON.stringify(fb.blocks).includes('A star sits on the roofs')) {
	fb.blocks.splice(jokes + 1, 0, ...[
		scene('Pungak', '풍악', {
			jump: { year: 616, en: 'Six Winters Later…', ko: '육 년 후…' }
		}),
		p(
			'A star sits on the roofs. The three of them are supposed to be on a mountain.',
			'별이 지붕 위에 앉아 있다. 셋은 산에 가 있어야 한다.'
		),
		p(
			'Pungak. The northern diamond. Class 51 has been told to go up and come back harder. They have a pack, a rope, and Alchun’s food, which is most of the pack.',
			'풍악. 북쪽 금강. 오십일기에게 올라갔다 더 세게 내려오라 했다. 짐, 밧줄, 알천의 양식. 짐의 대부분이 그것이다.'
		),
		look('alchun', ['별이 저렇게 낮으면 안 가는 거 아니냐.', '재앙이잖아. 연무장에서 그렇게 배웠어.'], [
			'If a star sits that low, you don’t go.',
			'That’s an omen. The yard said so.'
		]),
		look('yushin', ['임금이 부를 거다.', '지붕에 그게 앉아 있으면.'], [
			'The king will call.',
			'If that’s sitting on the roofs.'
		]),
		look(
			'bidam',
			['별은 우리 땅 별이야.', '산은 안 달아난다. 별이 먼저 꺼질 수도 있지.'],
			['It’s our sky.', 'The mountain will keep. The star might go out first.']
		),
		look('alchun', ['그래서, 먹어?'], ['So. Do we eat.']),
		p(
			'They turn the horses. Not because Bidam lost. Because Yushin said the roofs, and Bidam, for once, did not make him pay for it. The pass is a cut in the pines. A monk is already sitting in it, as if he had been waiting for three boys who would not reach the mountain.',
			'말을 돌린다. 비담이 져서가 아니다. 유신이 지붕을 말했고, 비담이 이번엔 값을 받지 않아서다. 고개는 소나무 사이 틈이다. 스님이 이미 앉아 있다. 산에 못 갈 아이 셋을 기다리던 사람처럼.'
		),
		scene('The Pass', '고개'),
		say(
			'yungcheon',
			['돌아가게.', '산은 안 달아날세.', '별이 지붕에 앉았으면, 노래를 불러 내리지.'],
			['Go home.', 'The mountain will keep.', 'If a star is sitting on the roofs, you sing it off.']
		),
		look('bidam', ['스님은 누구시오.'], ['And you are.']),
		say('yungcheon', ['고개야.', '이름은 노래가 끝나면.'], ['The pass.', 'The name is after the song.']),
		p(
			'He sings. It is not a long song. It does not name the star, or the capital, or the three of them. Halfway through the second verse the white smear over the southern roofs thins, as if someone had rubbed it with a thumb. By the last line it is gone.',
			'노래한다. 긴 노래가 아니다. 별도, 도성도, 셋도 부르지 않는다. 둘째 절 중간에, 남쪽 지붕 위 흰 자국이 얇아진다. 엄지로 문지른 것처럼. 마지막 줄에, 없다.'
		),
		say('yungcheon', ['자.', '별이 원하던 건 그게 다일세.'], ['There.', 'That’s all it wanted.']),
		look('alchun', ['…먹을 건 남았는데.'], ['…There’s still food.']),
		look('yushin', ['연무장으로.'], ['The yard.']),
		look('bidam', ['산은 다음에.'], ['The mountain next time.']),
		p(
			'They never go. Rumour on the east shore, that same hour: riders who had already wet their hooves turned around, as if a song had reached them too. The yard will call the three eternal. The song keeps the monk’s name. Bidam keeps the headband, blood and all, in a chest he will open on a worse night.',
			'다시는 안 간다. 같은 시각, 동쪽 바닷가 소문. 이미 발굽을 적신 기병들이 돌아갔다고. 노래가 거기까지 간 것처럼. 연무장은 셋을 영원하다 부를 것이다. 노래는 스님 이름을 남긴다. 비담은 피 묻은 머리띠를, 더 나쁜 밤에 열 궤짝에 넣어 둔다.'
		)
	]);
}

const seung = entry('Seung');
const names = JSON.stringify(seung.blocks);
if (!names.includes('From the side, in the purple')) {
	let n = 0;
	const walk = (blocks) => {
		for (const b of blocks) {
			if (b.html === 'Even their names take sides. Bidam’s sounds like this soil and its sutras. Chunchu’s is a foreign classic. Any clerk across the sea could file it without asking. Nobody notices yet. Names are patient.') {
				b.html =
					'Even their names take sides. Bidam’s sounds like this soil and its sutras. Chunchu’s is a foreign classic. Any clerk across the sea could file it without asking. From the side, in the purple, Bidam has the old hall’s face. Chunchu will grow into the same one. Nobody at the gyuku field has met the boy yet. Names are patient. Faces are not.';
				b.ko =
					'이름부터 편이 갈린다. 비담은 이 땅과 그 경전 소리다. 춘추는 바깥 고전이다. 바다 건너 서기라면 누구든 묻지 않고 철할 이름. 옆에서 보면, 보라 옷의 비담은 옛 대청 얼굴이다. 춘추도 그 얼굴을 닮아 클 것이다. 격구장에는 아직 그 아이를 만난 사람이 없다. 이름은 참을성 있다. 얼굴은 아니다.';
				n++;
			}
			if (b.blocks) walk(b.blocks);
		}
	};
	walk(seung.blocks);
	if (!n) throw new Error('Seung: names paragraph miss');
}

save();
console.log('ok desk + pungak + kinship');
