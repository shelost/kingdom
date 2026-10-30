// Yongsu and Bihyung are one man: Dohwa's son by the ghost of King Jinji, named Yongsu at birth;
// the goblins call him Bihyung, he takes the name, and Surabol uses it as an insult.
// The peach-blossom woman is Dohwa (id `dohwa`, formerly `yeji`).
// Usage: node scripts/.cache/bihyung-merge.mjs   (idempotent)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const bi = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Bihyung');
const plain = (b) => (b.html ?? (b.en ?? []).join(' / ') ?? '').replace(/<[^>]+>/g, '');
const at = (frag) => bi.blocks.findIndex((b) => plain(b).includes(frag));
const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines, en });

/** Replace the block holding `frag` (no-op when it is already gone). */
function swap(frag, ...blocks) {
	const i = at(frag);
	if (i >= 0) bi.blocks.splice(i, 1, ...blocks);
}

/* every speaker id: one man, one mother */
const walk = (bs) =>
	bs.forEach((b) => {
		if (b.kind === 'flashback') walk(b.blocks ?? []);
		if (b.person === 'bihyung') b.person = 'yongsu';
		if (b.person === 'yeji') b.person = 'dohwa';
	});
walk(bi.blocks);

/* the frame: born 581, so seventy-two */
for (const b of bi.blocks) {
	if (b.html) b.html = b.html.replace('Kim Yongsu is seventy-eight.', 'Kim Yongsu is seventy-two.');
	if (b.ko) b.ko = b.ko.replace('김용수는 일흔여덟, 천명공주는 일흔셋이다.', '김용수는 일흔둘, 천명공주는 일흔셋이다.');
}
swap(
	'Mad men don’t get voted on.',
	say(
		'yongsu',
		['Oh, the goblins were real. The madness was the act.', 'Mad men don’t get voted on.', 'Their wives don’t get poisoned. Their boys grow up.', '…You grew up. Very loud. Very clever. You nearly frightened me to death twice.'],
		['아, 도깨비는 진짜였다. 미친 건 연극이었고.', '미친 사람은 표결에 안 올라.', '그 아내는 독을 안 먹고, 그 아들은 자라지.', '…넌 자랐다. 아주 시끄럽게. 아주 영리하게. 덕분에 두 번이나 놀라 죽을 뻔했다.']
	)
);
swap(
	'The bridge. You paid for it.',
	say(
		'chunchu',
		['The bridge. You paid for it.', 'The stream. The laughing. Forty years of it.', '…You were never mad.'],
		['그 다리. 아버지가 돈을 내셨군요.', '개울도. 웃음도. 사십 년을.', '…한 번도 미치신 적이 없었군요.']
	),
	say('yongsu', ['Goblins can’t lift stone, son. Very good company. Useless with a shovel.'], ['도깨비는 돌을 못 들어, 얘야. 같이 놀기엔 최고인데 삽질은 영 꽝이야.'])
);
swap(
	'Seventy years I’ve been talking to you people.',
	say('yongsu', ['Oh.', 'Goblins I’ve talked to all my life. Never one of your sort.', 'And one of you finally answers.'], ['아.', '도깨비하고는 평생 얘기했지. 너희 같은 쪽은 한 번도 없었는데.', '이제야 너희 쪽에서 대답을 하는구나.'])
);

/* Jinji’s fall: no son yet */
swap(
	'His own son Yongsu is four',
	p(
		'His nephew, a boy of twelve, is crowned instead. Jinji is shut in a house with a very high wall, and three months later he dies in it. He leaves no son the Council has to worry about. Not yet.',
		'대신 열두 살 조카가 왕관을 쓴다. 진지는 담이 아주 높은 집에 갇히고, 석 달 뒤 그 안에서 죽는다. 회의가 신경 쓸 만한 아들은 남기지 않는다. 아직은.'
	)
);
swap(
	'The house dropped a bone in one afternoon',
	p(
		'His house dropped a bone in one afternoon, from Sacred to True. Any son of his would be born a step down.',
		'그의 집은 하루 오후 만에 뼈 하나가 내려앉았다. 성골에서 진골로. 그의 아들이라면 누구든 한 단 아래에서 태어날 것이다.'
	)
);
swap(
	'Jinji’s fall moved his son off the trunk',
	p(
		'Jinji’s fall moved his whole branch off the trunk in a single afternoon. And a side branch with a better claim than the trunk is the most dangerous thing in any palace.',
		'진지왕이 쫓겨나던 그날 오후, 그 가지는 통째로 줄기에서 떨려 나갔다. 그리고 줄기보다 명분이 좋은 곁가지는, 어느 궁에서나 제일 위험한 물건이다.'
	)
);

/* Dohwa */
for (const b of bi.blocks) {
	if (b.html) b.html = b.html.replace('Her name is Yeji.', 'Her name is Dohwa.');
	if (b.ko) b.ko = b.ko.replace(/이름은 예지(다|이다)/, '이름은 도화$1').replace(/예지/g, '도화');
}

/* the birth, the palace, the name */
swap(
	'She names him Bihyung.',
	p('She names him Yongsu. It is a perfectly ordinary name. It will not last.', '그녀는 아이 이름을 용수라고 짓는다. 아주 평범한 이름이다. 오래가지는 못한다.')
);
for (const b of bi.blocks) {
	if (b.html?.includes('At fifteen Bihyung is made a clerk.')) {
		b.html = b.html.replace('At fifteen Bihyung is made a clerk.', 'At fifteen Yongsu is made a clerk.');
		if (b.ko) b.ko = b.ko.replace('열다섯에 비형은', '열다섯에 용수는');
	}
}
swap(
	'Somebody else is on the bank most nights, too.',
	p(
		'The things in the reeds have their own name for him. They call him Bihyung, and they will not say why, and they will not call him anything else. He starts answering to it. Then he starts signing it.',
		'갈대숲의 그것들은 그를 부르는 이름이 따로 있다. 비형이라 부르는데, 왜인지는 말해 주지 않고, 다른 이름으로는 절대 부르지 않는다. 그는 그 이름에 대답하기 시작한다. 그러다 그 이름으로 서명까지 하기 시작한다.'
	)
);
for (const b of bi.blocks) {
	if (b.html?.includes('Yongsu is twenty-one, and his cousin King Jinpyung')) {
		b.html = b.html.replace('Yongsu is twenty-one, and his cousin', 'He is fifteen, and his cousin').replace('A deposed king’s son is a very interesting number.', 'A dead king’s son, even a ghost’s, is a very interesting number.');
		if (b.ko) b.ko = b.ko.replace(/용수는 스물하나(이고|다)[,.]?\s*/, '그는 열다섯이다. ').replace('폐위된 임금의 아들은', '죽은 임금의 아들은, 귀신의 아들이라도,');
	}
}
swap(
	'That night he follows his little brother down to the stream',
	p(
		'That night he goes down to the reeds in his sleeping robe and talks to them until dawn, loudly, where the night watch can hear. He laughs. By the market hour, so has everybody else.',
		'그날 밤 그는 잠옷 바람으로 갈대숲에 내려가 새벽까지 그것들과 이야기한다. 순라꾼들이 들을 수 있게, 큰 소리로. 그가 웃는다. 장이 설 무렵엔 온 도성이 다 웃었다.'
	)
);
swap(
	'Hyung. You can’t see them, can you.',
	p(
		'Surabol picks up the goblins’ name and turns it into an insult. Bihyung: the ghost’s bastard, the clerk who runs with things that have no feet. Mothers use it to frighten children. Courtiers use it to end a conversation. He lets them.',
		'서라벌은 도깨비들이 붙인 그 이름을 주워다 욕으로 만든다. 비형. 귀신의 사생아, 발 없는 것들과 뛰어다니는 서기. 어미들은 아이를 겁줄 때 그 이름을 쓰고, 신하들은 말을 끊을 때 그 이름을 쓴다. 그는 그러라고 둔다.'
	)
);
swap('Keep talking to them. Loudly. I’ll do the laughing.');
swap(
	'Nobody counts the madman’s brother.',
	p('The men with gifts stop coming. Nobody counts a madman.', '선물 든 사내들은 발길을 끊는다. 미치광이는 아무도 세지 않는다.')
);
swap(
	'Behind the king, in the line of True Bones who came to watch, Yongsu has gone quite still.',
	p('Then he goes home and counts his silver.', '그러고는 집에 가서 은을 센다.')
);

/* Gildal: his wife asks now */
swap('…He was your friend.', say('chunmyung', ['…He was your friend.'], ['…친구였잖아.']));
swap('He was late, Hyung.', say('yongsu', ['He was late.', 'First time ever.'], ['늦었거든.', '처음으로.']));
swap(
	'The charm says Bihyung, but the neighbours paste it on the house by the stream too',
	p(
		'The charm says Bihyung, and the city pastes it on every door in Surabol, his own included. He finds this very funny. Nobody counts a house with a charm on the door.',
		'주문에는 비형이라 적혀 있고, 도성은 그걸 서라벌의 모든 문에 붙인다. 그의 집 문에도. 그는 그게 아주 우습다. 주문 붙은 집은 아무도 세지 않는다.'
	)
);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
const left = JSON.stringify(bi).match(/half-brother|little brother|Hyung|"bihyung"|"yeji"|Yeji/g);
console.log('Bihyung blocks', bi.blocks.length, '· leftovers', left ?? 'none');
