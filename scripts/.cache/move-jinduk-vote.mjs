import fs from 'node:fs';
const F = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(F, 'utf8'));
const E = story.flatMap((c) => c.entries);
const get = (t) => E.find((x) => x.title === t);
const bh = get('Bihyung');
const km = get('King Muyeol');
const rs = get('Royal Secretariat');
const txt = (b) => JSON.stringify(b);
const idx = (blocks, s) => {
	const i = blocks.findIndex((b) => txt(b).includes(s));
	if (i < 0) throw new Error('anchor missing: ' + s);
	return i;
};
const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });

if (!txt(km.blocks).includes('Sacred Bone ends on your breath')) {
	const jStart = idx(bh.blocks, 'The Moon Palace · the last of the Sacred Bone');
	const vStart = idx(bh.blocks, 'The Harmony Council meets to choose a king.') - 1;
	const vEnd = idx(bh.blocks, 'The age of <b>Kim Chunchu</b> begins.');
	const jinduk = bh.blocks.slice(jStart, vStart);
	const vote = bh.blocks.slice(vStart, vEnd + 1);
	bh.blocks.splice(jStart, bh.blocks.length - jStart,
		p('<b>Up in the Moon Palace, the last Sacred Bone queen is counting her breaths. And the story his father told him on a cliff is finally ours to hear…!</b>',
			'<b>월성 위에서는 마지막 성골 여왕이 숨을 세고 있다. 그리고 아버지가 벼랑 위에서 들려준 이야기를, 이제야 우리가 듣는다…!</b>'));

	const vh = vote.find((b) => txt(b).includes('The Harmony Council meets to choose a king.'));
	vh.html = 'The Harmony Council meets to choose the next king. The queen is still alive, upstairs, coughing. But for the first time since there was a council, there is no Sacred Bone left to come after her.';
	vh.ko = '화백회의가 다음 왕을 고르려고 모인다. 여왕은 아직 살아 있다. 위층에서 기침을 하고 있다. 하지만 회의가 생긴 이래 처음으로, 그 뒤를 이을 성골이 하나도 남지 않았다.';

	const old = idx(rs.blocks, 'That afternoon the Council votes for the next king.');
	rs.blocks.splice(old, 1, ...vote,
		{ kind: 'scene', place: 'The side hall · the same afternoon' },
		p('He does not stay to be congratulated. He walks back to the side hall, sits down, and picks up the rites office where he left it.',
			'축하는 받지 않는다. 그는 곁채로 걸어 돌아가 앉아서, 놓아 두었던 예부 일을 다시 집어 든다.'));

	km.blocks.splice(1, 0, ...jinduk);
	const card = km.blocks.find((b, i) => i > 1 && b.kind === 'card' && b.person === 'jinduk');
	void card;

	const move = (from, to, re) => {
		const keep = [];
		for (const im of from.images ?? []) (re.test(im.at ?? '') ? (to.images ??= []) : keep).push(im);
		from.images = keep;
	};
	move(bh, km, /Sacred Bone ends|Did you keep the crown warm|Queen Jinduk, the last of the Sacred Bone|kept the chair warm|For seven years the crown/);
	move(bh, rs, /Harmony Council meets to choose|The age of|Alchun|sit in it/);
}

if (!txt(bh.blocks).includes('They’re real. They’re all real.')) {
	const at = idx(bh.blocks, 'He comes back the next night. So does she.');
	bh.blocks.splice(at + 1, 0,
		p('And the song says that on the third night he shows her. Not the bridge. Everything under it.',
			'그리고 노래에 따르면, 사흘째 밤 그는 그녀에게 보여 준다. 다리가 아니라, 다리 밑의 모든 것을.'),
		p('He takes her hand at the end of the bridge and walks her into the reeds, and the reeds open like a door. The goblins come out with their lanterns. There is a market of the dead under the moon. The Rock Lady sells stones that hum. Old Man Tree reads her palm and refuses to say what he saw. The three rascals steal her shoes and bring them back full of fireflies.',
			'다리 끝에서 그가 그녀의 손을 잡고 갈대밭으로 걸어 들어가자, 갈대가 문처럼 열린다. 도깨비들이 등불을 들고 나온다. 달 아래 죽은 이들의 장이 선다. 바위 할매는 웅웅 우는 돌을 판다. 나무 할배는 손금을 보고는 뭘 봤는지 끝내 말을 안 한다. 꼬마 셋은 그녀의 신을 훔쳐 갔다가 반딧불을 가득 채워 돌려준다.'),
		d('chunmyung', ['They’re real.', '…They’re all real. You weren’t lying. You were never—'], ['진짜야.', '…다 진짜잖아. 거짓말 아니었네. 한 번도—']),
		d('yongsu', ['Always were, Princess.', 'You just had a wall in the way.'], ['원래 다 있었어요, 공주님.', '담이 가리고 있었을 뿐이죠.']),
		p('Before dawn he lifts her onto the roof of the gate tower, and the whole city below is lamps, and half of them belong to the dead. She stops being afraid somewhere around the second watch. She never says when.',
			'새벽이 오기 전 그는 그녀를 문루 지붕 위로 올려 준다. 발아래 온 도성이 등불이고, 그 절반은 죽은 이들의 것이다. 그녀는 이경 무렵 어딘가에서 무섭지 않게 된다. 언제였는지는 끝내 말하지 않는다.'),
		d('chunmyung', ['Show me again. Tomorrow.', 'And don’t you dare make it smaller.'], ['내일 또 보여 줘.', '그리고 감히 줄여서 보여 주기만 해 봐.'])
	);
}

const fb = km.blocks.find((b) => b.kind === 'flashback').blocks;
const m83 = fb.find((b) => txt(b).includes('The old man with one ear'));
if (m83) {
	m83.html = m83.html.replace('The old man with one ear', 'The old man with one eye');
	m83.ko = m83.ko.replace(/귀 하나 없는 노인/g, '눈 하나 없는 노인');
}
if (!txt(fb).includes('I’ve lived on top of this my whole life.')) {
	const at = idx(fb, '"I promise."');
	fb.splice(at + 1, 0,
		p('The song will say he showed her a world of ghosts under the bridge that month. He did. It just wasn’t the one in the song.',
			'노래는 그달 그가 다리 밑 귀신들의 세상을 그녀에게 보여 줬다고 할 것이다. 보여 줬다. 다만 노래 속의 그 세상은 아니었다.'),
		p('Every night he takes her down the culvert. The old man shows her where his eye was. The woman shows her three small mounds with no stones on them. The red-mask boy shows her the west gate, where the rope is still there. Up in the Moon Palace, the same men who did it are called her uncles.',
			'밤마다 그는 그녀를 데리고 수로를 내려간다. 노인은 눈이 있던 자리를 보여 준다. 여자는 비석 하나 없는 작은 무덤 셋을 보여 준다. 빨간 탈은 서문을 보여 준다. 밧줄이 아직 그대로 걸려 있다. 월성 위에서는 그 짓을 한 사람들을 그녀가 아저씨라고 부른다.'),
		p('She comes back up each dawn with mud to the knee and a new list in her head: whose field, whose son, whose name under whose brush.',
			'그녀는 새벽마다 무릎까지 진흙투성이로 올라온다. 머릿속엔 새 명단이 하나씩 늘어 있다. 누구네 밭, 누구네 아들, 누구의 붓 밑에 누구의 이름.'),
		d('chunmyung', ['I’ve lived on top of this my whole life.'], ['나 평생 이 위에서 살았어.']),
		d('yongsu', ['Everybody up there has.', 'That’s what the wall is for.'], ['위에 사는 사람은 다 그래요.', '담이 그러라고 있는 거예요.']),
		d('chunmyung', ['…Show me the rest.'], ['…나머지도 보여 줘.'])
	);
}
fs.writeFileSync(F, JSON.stringify(story, null, '\t') + '\n');
console.log(bh.blocks.length, km.blocks.length, rs.blocks.length, km.images.length, rs.images.length);
