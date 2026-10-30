import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function findEntry(title) {
	for (const a of story)
		for (const e of a.entries || []) if (e.title === title) return e;
	throw new Error('missing ' + title);
}

function ix(blocks, pred, msg) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error(msg || 'not found');
	return i;
}

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko, extra = {}) => ({ kind: 'scene', label, ko, ...extra });
const section = (label, ko) => ({ kind: 'section', label, ko });
function d(person, en, lines, extra = {}) {
	return { kind: 'dialogue', person, en, lines, ...extra };
}
function sp(speaker, gender, en, lines, extra = {}) {
	return { kind: 'dialogue', speaker, gender, en, lines, ...extra };
}

const e = findEntry('Park Jesang');
delete e.kinds;
const b = e.blocks;

const hook = b[0];
if (!hook || !String(hook.html).startsWith('There was only one man'))
	throw new Error('hook drifted');

// ── opening: streets after Gwanggaeto’s “rescue”, then the boyhood jump ──
b.splice(1, 0, section('Silla', '신라'), scene('The Streets', '거리'), p(
	'Seventeen winters after the horsemen came down like weather, Surabol still sings like a city that lost.',
	'기병들이 날씨처럼 내려온 지 열일곱 겨울. 서라벌은 아직, 진 도시처럼 노래를 부른다.'
), p(
	'The red banners never quite went home. They saved the capital. Then they stayed. Then they took the king’s brothers and called it rent.',
	'붉은 깃발은 끝내 다 돌아가지 않았다. 도성을 구했다. 그리고 남았다. 그리고 임금의 아우들을 데려가고, 그걸 세라 불렀다.'
), sp(
	'A woman at the well',
	'f',
	['It’s finished.', 'You hear me? The country’s finished.'],
	['끝났다 아이가.', '들리냐. 나라가 끝났어.']
), sp(
	'A boy',
	'm',
	['Older brother went north—', 'Younger went over the water—', 'The king sits in a hall with nobody in it—'],
	['형은 북으로—', '아우는 바다로—', '임금은 빈 대청에 앉아—']
), p(
	'He is not making it up. It is a song. The market has three tunes for it, and they all rhyme, and none of them are kind.',
	'지어내는 게 아니다. 노래다. 장터에 곡이 셋 있고, 다 운이 맞고, 하나도 곱지 않다.'
), sp(
	'A drunk against the gate',
	'm',
	['They came to save us.', 'They’re still here.', 'That’s not a country. That’s a stall.'],
	['구하러 왔지.', '아직 있어.', '그게 나라냐. 가게지.']
), p(
	'A stone hits the palace wall and does not mean to. A woman pulls her son back by the collar. Nobody picks the stone up.',
	'돌 하나가 궁담에 맞는다. 뜻은 없었다. 여자가 아들 멱살을 잡아 끌어낸다. 돌을 줍는 사람은 없다.'
), scene('The Empty Hall', '빈 대청'), p(
	'Nulji hears it from the window he is not supposed to open. He opens it anyway. He has been king long enough to know the songs get to the chair first.',
	'눌지는 열면 안 되는 창으로 그 노래를 듣는다. 그래도 연다. 의자에 앉은 지 오래돼서 안다. 노래가 의자보다 먼저 온다는 것을.'
), d('nulji', ['Jesang.'], ['제상아.']), d('jesang', ['I heard it on the shore.', 'Three tunes.'], [
	'나루에서 들었다.',
	'곡이 셋이더라.'
]), d(
	'nulji',
	['I’m putting this country back.', 'I can’t put it back with my brothers sitting in other people’s halls.', 'That’s first. Then the rest.'],
	['나, 이 나라 다시 세울 거야.', '아우들이 남의 대청에 앉아 있는데 뭘 세우냐.', '그게 먼저야. 나머지는 그다음.']
), d('jesang', ['Then send me.'], ['그럼 나를 보내.']), p(
	'They had decided that as boys. The streets have not. The streets want a funeral.',
	'소년일 때 이미 정한 일이다. 거리는 아니다. 거리는 장례를 원한다.'
));

// Thin Hour: don’t lecture the horsemen twice; add the revival into the send
const horsemen = b.find(
	(x) => x.kind === 'p' && String(x.html).startsWith('The horsemen who saved the capital')
);
if (!horsemen) throw new Error('horsemen p missing');
horsemen.html = 'The song followed him into the hall. He lets it. He has been walking since the lamps went.';
horsemen.ko = '노래가 대청까지 따라온다. 그는 따른다. 등잔이 꺼진 뒤로 걷고 있다.';

const chairLine = ix(
	b,
	(x) =>
		x.kind === 'dialogue' &&
		x.person === 'nulji' &&
		Array.isArray(x.en) &&
		x.en[0] === 'Jesang.' &&
		x.en.includes('I have a chair.'),
	'nulji chair line'
);
b.splice(
	chairLine + 1,
	0,
	d(
		'nulji',
		['If I bring them home, the songs stop.', 'If the songs stop, I can start.'],
		['데려오면 노래가 멈춰.', '노래가 멈추면, 그때 시작해.']
	)
);

// ── Goguryeo hall: flattery, guest-word, then the hunt ──
const kneelI = ix(
	b,
	(x) => x.kind === 'p' && String(x.html).startsWith('Jesang does not kneel first.'),
	'kneel p'
);
const bokhoCardI = ix(b, (x) => x.kind === 'card' && x.person === 'bokho', 'bokho card');

const hall = [
	p(
		'Jesang does not kneel first. He sits the way a man sits when he has already decided the ending, and only needs the room to catch up.',
		'제상은 먼저 꿇지 않는다. 이미 끝을 정해 둔 사람이 앉는 방식으로 앉는다. 방이 따라오기만을 기다린다.'
	),
	d('jangsu', ['Another Silla man.'], ['신라 사람이 또 왔군.']),
	d('jesang', ['The man who wrote that word is dead.', 'So is the man he wrote it to.'], [
		'그 글자를 쓴 사람은 죽었소.',
		'그 글자를 받은 사람도.'
	]),
	d('jangsu', ['You talk well.'], ['말 잘하는군.']),
	d(
		'jesang',
		['Your father took kingdoms.', 'You already have them.', 'A man who has them does not need a child for furniture.'],
		['선왕께서는 나라를 취하셨소.', '태왕께서는 이미 가지고 계시고.', '가진 사람은, 아이를 가구로 두지 않아도 되오.']
	),
	d('jangsu', ['That’s flattery.'], ['아부군.']),
	d(
		'jesang',
		['Flattery is for the weak.', 'I am telling a great king a fact, in his own hall.'],
		['아부는 약한 자에게나 씁니다.', '나는 큰 나라 임금께, 그 대청에서, 사실을 말하고 있소.']
	),
	p(
		'Jangsu’s mouth moves. Not a smile. The start of one. The hall feels it, the way a hall feels a weather change.',
		'장수의 입이 움직인다. 웃음은 아니다. 웃음의 시작이다. 대청이 느낀다. 날씨가 바뀌는 것을 대청이 아는 방식으로.'
	),
	d('jangsu', ['You came alone.'], ['혼자 왔군.']),
	d('jesang', ['A hall that needs an army has already said no.'], ['군대가 필요한 대청은, 이미 아니라고 한 것이오.']),
	d('jangsu', ['And if I say no.'], ['내가 안 된다면.']),
	d('jesang', ['Then I go to the island with nothing.'], ['그러면 빈손으로 섬에 가오.']),
	sp(
		'A Goguryeo officer',
		'm',
		['Rent is rent, Tae Wang.', 'The boy stays.'],
		['세는 세입니다, 태왕.', '아이는 남습니다.']
	),
	p(
		'Jangsu walks to the window. The hall waits the way a large country waits: as if it has all the time, and might use none of it.',
		'장수가 창으로 간다. 전각은 큰 나라가 기다리듯 기다린다. 시간은 다 있는 것처럼, 하나도 안 쓸 것처럼.'
	),
	d(
		'jesang',
		['The paper that boy came on was written for a dead king, by a dead king.', 'Since that paper died, he has eaten your rice as a guest.', 'I am only taking a guest home.'],
		['그 아이가 들고 온 종이는, 죽은 임금이 죽은 임금에게 쓴 것이오.', '그 종이가 죽은 뒤로 이 대청에서 그 아이는 손님이오.', '나는 손님을 데려갈 뿐이오.']
	),
	p(
		'The officer opens his mouth. Jangsu does not look at him.',
		'무관이 입을 연다. 장수는 그를 보지 않는다.'
	),
	d('jangsu', ['A well-made ask is still an ask.', 'A guest may leave.', 'Take him.'], [
		'잘 물은 물음도 물음이오.',
		'손님이면 가도 되겠지.',
		'데려가시오.'
	]),
	d('jesang', ['There is a next.', 'That one is ours.'], ['다음이 있소.', '그건 이쪽 일이오.']),
	d('jangsu', ['I will not ask what is next.'], ['그 다음은 안 묻겠소.']),
	p(
		'They are already on the stairs when the officer finds his voice. Jesang does not look back. Looking back would be staying.',
		'무관이 목소리를 찾았을 때, 둘은 이미 계단에 있다. 제상은 돌아보지 않는다. 돌아보는 것이 남는 일이다.'
	),
	sp('A Goguryeo officer', 'm', ['Tae Wang.', 'You said guest.'], ['태왕.', '손님이라고 하셨습니다.']),
	d('jangsu', ['I did.'], ['했다.']),
	sp(
		'A Goguryeo officer',
		'm',
		['A hostage owes. A guest does not.', 'If he was a guest, they never owed.', 'Every title we put on them comes off from the other side.'],
		['인질은 빚이 있습니다. 손님은 없습니다.', '손님이었으면, 저들은 처음부터 빚이 없었습니다.', '우리가 씌운 벼슬은 저쪽에서도 벗습니다.']
	),
	p(
		'Jangsu’s hand is on the window-frame. The start of the smile is gone. He has been generous in his own hall, and the generosity has a hole in it the size of a country.',
		'장수의 손이 창틀에 있다. 웃음의 시작이 없다. 제 대청에서 후했다. 그 후함에, 나라만 한 구멍이 나 있다.'
	),
	d('jangsu', ['Bring the boy.', 'Alive.', 'The Silla man too.'], ['아이를 데려와.', '살아서.', '신라 놈도.'])
];

b.splice(kneelI, bokhoCardI - kneelI, ...hall);

const cardI = ix(b, (x) => x.kind === 'card' && x.person === 'bokho', 'bokho card after hall');
b.splice(cardI, 0, scene('The Road', '길'), p(
	'They ride south as if the hall still means it. For one ridge, it does.',
	'대청이 아직 진심인 것처럼 남으로 달린다. 능선 하나만큼은, 진심이다.'
), p(
	'Then the dust behind them is not weather. It is horses. A lot of horses. Jesang does not swear. He shortens the reins.',
	'그러고 나면 뒤의 먼지는 날씨가 아니다. 말이다. 말이 많다. 제상은 욕하지 않는다. 고삐를 짧게 쥔다.'
), d('bokho', ['They said I could leave.'], ['가도 된다 했소.']), d('jesang', ['Keep low.', 'Don’t look back.'], [
	'숙이시오.',
	'돌아보지 마시오.'
]), p(
	'The first arrows come at the river-bend. One hits Jesang’s saddle and stands there, quivering, like a question. Bokho waits for the blood. There is no blood.',
	'첫 화살은 강굽이에서 온다. 하나가 제상의 안장에 꽂혀 선다. 질문처럼 떤다. 복호가 피를 기다린다. 피가 없다.'
), d('bokho', ['That one—', 'There’s no head on it.'], ['저거—', '촉이 없소.']), p(
	'Another shaft slaps the horse’s neck and falls in the grass. Wood. Just wood. A third kisses Jesang’s sleeve and drops, blunt as a finger.',
	'또 하나가 말 목에 맞고 풀로 떨어진다. 나무다. 나무뿐이다. 세 번째가 제상 소매를 스치고 떨어진다. 손가락처럼 뭉툭하다.'
), p(
	'On the ridge the Goguryeo line is still shooting. Nobody is aiming at the horses’ legs. Nobody is riding down to finish it. A man up there turns his face away as he looses, as if he does not want the boy to see him do a kindness.',
	'능선에서 고구려 줄이 아직 쏜다. 말 다리를 노리는 사람은 없다. 내려와 끝내는 사람도 없다. 위의 사내 하나가, 놓으면서 얼굴을 돌린다. 아이가 그 호의를 보는 것이 싫은 사람처럼.'
), d('bokho', ['They used to steal my rice.', 'I let them.', 'I— I knew their names.'], [
	'제 밥을 훔치던 사람들이오.',
	'그냥 뒀소.',
	'나— 이름을 알고 있었소.'
]), d('jesang', ['Then ride.', 'They just spent that.'], ['그럼 달리시오.', '방금 그걸 다 쓴 것이니.']), p(
	'They hit the water so hard the horses scream. Arrows stitch the far bank, still blunt, still enough to kill if one finds an eye. Jesang’s wrist is open where a shaft tore him anyway. Bokho is crying and laughing at once, which is a terrible sound on a horse.',
	'물에 그렇게 세게 들어간다, 말이 운다. 화살이 저쪽 둑을 수놓는다. 아직 뭉툭하고, 눈에 맞으면 그래도 죽는다. 제상 손목은 촉 없는 나무가 찢어서 열려 있다. 복호는 울면서 웃는다. 말 위에서는 무서운 소리다.'
), p(
	'On the Silla side a royal rider is already waiting. He did not come to congratulate them. He came with the next sentence.',
	'신라 쪽에 왕실 기병 하나가 이미 기다려 있다. 축하하러 온 사람이 아니다. 다음 문장을 들고 온 사람이다.'
), sp(
	'A royal rider',
	'm',
	['The king said don’t stop.', 'The island. Now.'],
	['임금께서, 들르지 말라 하셨습니다.', '섬입니다. 지금.']
), p(
	'Jesang looks at his own gate, which is close enough to smell. Bokho looks at Jesang. The rider looks at neither of them. He looks at the water they just crawled out of, as if it might change its mind.',
	'제상이 제 문을 본다. 냄새까지 나는 거리다. 복호가 제상을 본다. 기병은 둘 다 안 본다. 방금 기어 나온 물을 본다. 물이 마음을 바꿀지도 모른다는 듯이.'
));

// 불지지: she sees the king’s man; fury at Nulji as well as the boat
const sandP = ix(
	b,
	(x) => x.kind === 'p' && String(x.html) === 'He does not answer. Answering would be stopping. The oars take him. She sits in the wet until the mark is gone.',
	'sand close p'
);
b.splice(sandP, 1, p(
	'The king’s rider is still on the sand. She sees the colour of his coat. She understands, then, who sent the second sentence.',
	'임금의 기병이 아직 모래 위에 있다. 옷 색깔을 본다. 그제야 안다. 두 번째 문장을 누가 보냈는지.'
), d(
	'chisul',
	['You.', 'You sat. You sent him.', 'You— you sent him again—'],
	['당신.', '앉아 있었잖아요. 보냈잖아요.', '또— 또 보냈잖아요—']
), sp('A royal rider', 'm', ['Lady— the king—'], ['마님— 임금께서—']), d(
	'chisul',
	['Don’t you say king to me.', 'Don’t you.'],
	['임금 소리 하지 마요.', '하지 마.']
), p(
	'He does not answer her. Answering would be stopping. The oars take him. She sits in the wet until the mark is gone, and the king’s man has the sense to get off her sand.',
	'제상은 대답하지 않는다. 대답이 멈춤이니까. 노가 데려간다. 그녀는 점이 없어질 때까지 물에 앉아 있다. 임금의 사람은, 제 모래에서 내려갈 줄 안다.'
));

// The Chair: Bokho home, Chisul in the hall, furious at Nulji
const well = b.find(
	(x) => x.kind === 'p' && String(x.html).startsWith('He says it too early.')
);
if (!well) throw new Error('too early p missing');

const wellI = b.indexOf(well);
b.splice(
	wellI,
	1,
	p('He says it too early. The second boat has not left yet. The woman on the sand has.', '너무 일찍 말한다. 두 번째 배는 아직 안 떠났다. 모래 위의 여자는 떠났다.'),
	p(
		'She comes into the hall with the river still on her clothes. The children are behind her. She does not bow. Nulji stands up, which is the first honest thing he has done all morning, and it is not enough.',
		'옷에 강을 묻힌 채로 대청에 들어온다. 아이들이 뒤에 있다. 절하지 않는다. 눌지가 일어선다. 오늘 아침 그가 한 일 중에 제일 정직한 일이다. 그것으로는 안 된다.'
	),
	d(
		'chisul',
		['You had him.', 'You sent him again.', 'He didn’t even turn— he didn’t even—'],
		['있었잖아요.', '또 보냈잖아요.', '안 돌아봤어요— 안 돌아봤잖아—']
	),
	d('nulji', ['There is still one.'], ['아직 하나 남았어.']),
	d(
		'chisul',
		['Then you go.', 'You said you would.', 'You said if he didn’t—'],
		['그럼 당신이 가요.', '간다고 했잖아요.', '안 가면 내가 간다고—']
	),
	d('nulji', ['I can’t.'], ['못 가.']),
	d(
		'chisul',
		['Then sit.', 'Keep sitting.', 'I’ll stand at the water.'],
		['그럼 앉아요.', '앉아 있어요.', '나는 물에서 설 테니.']
	),
	p(
		'Bokho looks at his brother, and at the woman, and does not know which sentence to pick up. Nobody picks it up. The chair is still the chair.',
		'복호가 형을 보고, 여자를 보고, 어느 문장을 집어야 할지 모른다. 아무도 안 집는다. 의자는 아직 의자다.'
	)
);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');

const locks = [
	'There was only one man',
	'You didn’t even turn.',
	'Then I will wear it',
	'I’d rather be a dog of Silla!',
	'She looks east'
];
const t = JSON.stringify(e.blocks);
for (const l of locks) {
	if (!t.includes(l) && !JSON.stringify(story).includes(l)) console.log('MISSING', l);
}
console.log(
	'sections',
	e.blocks.filter((x) => x.kind === 'section').map((x) => x.label).join(', ')
);
console.log(
	'scenes',
	e.blocks.filter((x) => x.kind === 'scene').map((x) => x.label).join(' | ')
);
console.log('ok', e.blocks.length);
