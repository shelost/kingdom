import { loadStory, saveStory, entryOf } from './story-ops.mjs';

const story = loadStory();
const en = entryOf(story, 'five-principles', 'Sadaham');
if (!en) throw new Error('no Sadaham entry');

const S = { person: 'sadaham', chip: '#6fa8ff' };
const M = { person: 'mugwan', chip: '#7aa0c8' };
const say = (who, en, lines) => ({ kind: 'dialogue', ...who, en, lines });
const p = (html, ko) => ({ kind: 'p', html, ko });
const fb = (title) => {
	const b = en.blocks.find((x) => x.kind === 'flashback' && x.title === title);
	if (!b) throw new Error(`no flashback ${title}`);
	return b.blocks;
};
const at = (list, fragment) => {
	const i = list.findIndex((b) => JSON.stringify(b).includes(fragment));
	if (i < 0) throw new Error(`no block with ${fragment}`);
	return i;
};

const oldOath = en.blocks.findIndex((b) => b.kind === 'oath');
if (oldOath < 0) throw new Error('oath block already moved');
const stone = en.blocks.splice(oldOath, 1)[0];

stone.hanja =
	'壬申年六月十六日二人幷誓記天前誓今自三年以後忠道執持過失无誓若此事失天大罪淂誓若國不安大舐世可容行誓之又別先辛未年七月卄二日大誓詩尙書礼傳倫淂誓三年';
stone.html =
	'Year imsin, sixth month, sixteenth day. The two of us swear together and write it down. We swear before Heaven: from today, for three years, we will hold fast to the way of loyalty and commit no fault. If we break this, we swear it is a great sin against Heaven. If the country is not at peace and the world falls into great disorder*, we swear we will go and do it. And apart from this: before, on the twenty-second day of the seventh month of the year sinmi, we swore a great oath, to master in turn the Odes, the Documents, the Rites and the Tradition† within three years.';
stone.ko =
	'임신년 6월 16일, 두 사람이 함께 맹세하여 적는다. 하늘 앞에 맹세한다. 지금부터 3년 동안 충도를 굳게 지니고 허물이 없기를 맹세한다. 이 일을 어기면 하늘에 큰 죄를 짓는 것이라 맹세한다. 만약 나라가 편안하지 않고 세상이 크게 어지러워지면*, 나아가 행할 것을 맹세한다. 또 따로, 앞서 신미년 7월 22일에 크게 맹세하였으니, 시경·상서·예기·전†을 차례로 3년 안에 익히기로 맹세하였다.';
stone.source =
	'Imsin Oath Stone (壬申誓記石), Silla, year imsin (552 or 612); found 1934 at Seokjang-dong, Gyeongju; Gyeongju National Museum, Treasure No. 1411';
stone.back = {
	html: 'Face down in the river mud. That is how two boys found it, and how they put it back.',
	ko: '냇가 진흙에 엎어진 채. 두 소년이 찾았을 때도, 도로 놓았을 때도.'
};

const first = fb('the first class');
first.splice(
	at(first, 'Mugwan stays up.') + 1,
	0,
	p(
		'Their first spring, the yard sends them down to the river for stones. Mugwan turns one over and goes very still. Somebody has cut writing into it.',
		'첫봄, 연무장은 둘을 냇가로 보내 돌을 날라 오게 한다. 무관랑이 돌 하나를 뒤집더니 꼼짝도 않는다. 누군가 거기에 글을 새겨 두었다.'
	),
	say(M, ['Come here.', 'Read this.'], ['이리 와 봐.', '이거 읽어 봐.']),
	say(S, ['You read it. You’re the one who studies.'], ['네가 읽어. 공부는 네가 하잖아.']),
	stone,
	p(
		'No names. Two boys from before the yard had a name promised Heaven three years of books, and a war if the country wanted one. What became of them, the stone doesn’t say. Stones rarely do.',
		'이름은 없다. 연무장에 이름이 붙기도 전의 두 소년이, 책으로 3년, 나라가 원하면 전쟁을 하늘에 약속했다. 그 둘이 어떻게 됐는지 돌은 말하지 않는다. 돌은 원래 말이 없다.'
	),
	say(S, ['Three years?', 'That’s all they had in them? Give me your knife.'], ['3년?', '겨우 그거야? 칼 줘 봐.']),
	say(M, ['That’s not ours. Put it back.'], ['그거 우리 거 아니야. 도로 놔.']),
	say(S, ['Not that one. We get our own.'], ['그거 말고. 우리 건 따로 만들 거야.']),
	p(
		'He finds a smaller stone, flat and grey, and scratches at it until the light goes. His characters are terrible. He leaves out the books entirely. What’s left fits in a closed hand.',
		'사다함은 더 작은 돌을 찾는다. 납작하고 잿빛이다. 해가 질 때까지 긁어 댄다. 글씨는 엉망이다. 책 얘기는 아예 뺀다. 남은 것은 주먹 하나에 다 들어간다.'
	),
	say(S, ['Read it.'], ['읽어.']),
	say(M, ['…“Two of us. One dies, the other follows.”', 'That’s it?'], ['…“우리 둘. 하나가 죽으면, 하나가 따라간다.”', '이게 다야?']),
	say(S, ['What else is there?'], ['그거 말고 뭐가 더 있는데.']),
	p(
		'Mugwan takes the knife. Under the bad characters he cuts one more, small and neat: <i>friend</i>. Then he puts the old stone back exactly where they found it, face down, as if they had never been there.',
		'무관랑이 칼을 받아 든다. 엉망인 글씨 아래에 한 글자를 작고 반듯하게 더 새긴다. <i>벗</i>. 그러고는 옛 돌을 찾았던 자리에 그대로, 엎어서 도로 놓는다. 둘이 거기 온 적도 없다는 듯이.'
	),
	p(
		'A museum in Gyeongju keeps the first stone now. Nobody has ever found the second. Good.',
		'첫 번째 돌은 지금 경주의 박물관에 있다. 두 번째 돌은 아무도 찾지 못했다. 다행이다.'
	)
);

const swear = fb('the swear');
swear.splice(
	at(swear, 'cough he cannot put down') + 1,
	0,
	p(
		'The little grey stone sits on the sill. Neither of them looks at it. Both of them know exactly where it is.',
		'작은 잿빛 돌이 창턱에 놓여 있다. 둘 다 그쪽을 보지 않는다. 둘 다 그게 어디 있는지 정확히 안다.'
	)
);
swear.splice(
	at(swear, 'neither of us is allowed to be late') + 1,
	0,
	p(
		'Mugwan pushes the stone across the mat with two fingers. It is the last thing he does on purpose.',
		'무관랑이 두 손가락으로 돌을 자리 너머로 밀어 준다. 그가 마음먹고 한 마지막 일이다.'
	)
);

const seven = fb('seven days');
seven.splice(
	at(seven, 'Sadaham did not take food for seven days') + 1,
	0,
	p(
		'He keeps the stone in his fist. At night he holds it up to the lamp, as if the bad characters might have changed.',
		'그는 돌을 주먹에 쥐고 지낸다. 밤이면 등잔에 비춰 본다. 엉망인 글씨가 바뀌기라도 했을 것처럼.'
	)
);
seven.splice(
	at(seven, 'Nobody snoring.') + 1,
	0,
	p(
		'On the seventh night the bowl by the door is still full. He lies down on Mugwan’s side of the mat.',
		'이레째 밤에도 문 앞의 그릇은 그대로다. 그는 자리의 무관랑 쪽에 눕는다.'
	),
	say(S, ['…Wait up.', 'I’m not late.'], ['…기다려.', '나 안 늦었어.'])
);
const buried = at(seven, 'buried two headbands');
seven[buried] = p(
	'He was seventeen. The order buried two headbands beside him, and one small stone with terrible handwriting. It kept the story, because a Hwarang who outlives his vow is only a boy with a nice coat.',
	'열일곱이었다. 화랑은 그 곁에 머리띠 둘과, 글씨가 엉망인 작은 돌 하나를 묻었다. 그리고 이야기를 남겼다. 맹세보다 오래 사는 화랑은, 옷만 좋은 소년에 불과하므로.'
);

saveStory(story);
console.log('ok');
