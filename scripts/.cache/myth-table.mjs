import fs from 'node:fs';
const F = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(F, 'utf8'));
const km = story.flatMap((c) => c.entries).find((e) => e.title === 'King Muyeol');
const c = (en, ko) => `${en} · ${ko}`;
const rows = [
	[c('Bihyung talks to ghosts because a ghost fathered him', '귀신의 아들이라 귀신과 말한다'), c('The Ghost Children follow Yongsu because he is Jinji’s son, the first child of the purge', '귀자들이 용수를 따르는 건 그가 진지의 아들, 숙청의 첫 아이라서다'), c('The ghosts are the purged. He is the one they were waiting for.', '귀신은 숙청당한 사람들이다. 그는 그들이 기다리던 사람이다.')],
	[c('Old Man Tree has one empty eye hole', '나무 할배는 눈구멍이 하나뿐이다'), c('His eye was put out the night of the purge, for having stood at Jinji’s door', '진지의 문을 지켰다는 죄로 숙청하던 밤 눈을 뽑혔다'), c('The wound becomes the mask.', '상처가 탈이 된다.')],
	[c('The Rock Lady will not move off the bridge stone', '바위 할매는 다리 돌에서 꿈쩍도 안 한다'), c('A mother whose three elder children were listed as Jinji’s men and killed', '위로 셋을 “진지의 사람”으로 올려 잃은 어미'), c('Grief that stays put.', '자리를 뜨지 않는 슬픔.')],
	[c('Three rascal goblins steal the pages’ shoes', '꼬마 도깨비 셋이 시동들 신을 훔친다'), c('Three orphans whose parents were exiled or hanged; the smallest never takes off his red mask', '부모가 귀양 가거나 목 매달린 고아 셋. 제일 작은 놈은 빨간 탈을 안 벗는다'), c('Children with nothing left but mischief.', '장난 말고는 남은 게 없는 아이들.')],
	[c('The goblins build a bridge in one night', '도깨비들이 하룻밤에 다리를 놓는다'), c('Forty masked people cut stone for a month; the madman shouts at the stream to cover the hammers', '탈 쓴 마흔이 한 달 동안 돌을 깎는다. 미치광이는 망치 소리를 덮으려 냇물에 고함친다'), c('A miracle is work nobody is allowed to name.', '기적이란 이름을 댈 수 없는 사람들의 일이다.')],
	[c('The reeds bow to him', '갈대가 그에게 절한다'), c('The masked children kneel in the reeds', '탈 쓴 아이들이 갈대밭에 엎드린다'), c('Loyalty mistaken for magic.', '도술로 오해받은 충성.')],
	[c('A lost seal reappears under the cruel steward’s pillow', '잃어버린 인장이 못된 집사의 베개 밑에서 나온다'), c('A girl in a fox mask puts it there', '여우탈 쓴 계집아이가 넣어 둔다'), c('The weak can reach the bedroom of the strong.', '약한 자도 강한 자의 침실에 닿을 수 있다.')],
	[c('Chunmyung is won over by the wonder of the spirit world', '천명은 귀신 세상의 신비에 마음을 뺏긴다'), c('Chunmyung is won over by the plight of the Ghost Children and the cruelty above them', '천명은 귀자들의 처지와 그 위의 잔인함에 마음을 뺏긴다'), c('Love starts when she sees past the palace wall.', '사랑은 그녀가 담 너머를 볼 때 시작된다.')],
	[c('The goblin Gildal takes human shape and serves the court', '도깨비 길달이 사람이 되어 조정을 섬긴다'), c('A purge orphan comes out of hiding as Imjong’s clerk', '숙청의 고아가 임종의 서기로 세상에 나온다'), c('The hidden coming up into the light.', '숨은 자가 빛으로 올라온다.')],
	[c('Gildal turns into a fox and runs', '길달이 여우로 변해 달아난다'), c('Gildal leaves his gate to carry the red-mask boy out of the Council’s cellar', '길달이 빨간 탈을 화백의 지하 옥에서 꺼내려 문을 비운다'), c('The Council’s word for loyalty is betrayal.', '화백의 말로 충성은 배신이다.')],
	[c('Bihyung has the goblins kill the fox', '비형이 도깨비들을 시켜 여우를 죽인다'), c('Yongsu cuts his friend’s throat on the south road, with Gildal guiding the knife', '남쪽 길에서 용수가 벗의 목을 벤다. 칼은 길달이 잡아 준다'), c('The loyal man pays; the clever master weeps and accepts.', '충신은 값을 치르고, 영리한 주인은 울며 받아들인다.')],
	[c('The ghosts are afraid of Bihyung, and his name on a door keeps them out', '귀신은 비형을 무서워하고, 문에 붙인 그 이름에 못 들어온다'), c('He rode Gildal’s body through every ward to tell the masks the plot was over', '길달의 시신을 싣고 온 도성을 돌며 탈들에게 거사가 끝났다고 알렸다'), c('The charm is a warning.', '부적은 경고다.')]
];
const fbIdx = km.blocks.findIndex((b) => b.kind === 'flashback');
if (!km.blocks.some((b) => b.kind === 'table' && b.head[0].startsWith('The song'))) {
	km.blocks.splice(fbIdx + 1, 0,
		{ kind: 'p', html: 'If you’ve been keeping both books, here they are side by side.', ko: '두 장부를 다 챙겨 왔다면, 여기 나란히 펼쳐 둔다.' },
		{ kind: 'table', head: ['The song · 노래', 'The truth · 진실', 'What it means · 뜻'], rows }
	);
}
fs.writeFileSync(F, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', fbIdx);
