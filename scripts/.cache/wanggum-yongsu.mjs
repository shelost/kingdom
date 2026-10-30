// Yongsu (and Chunmyung) in The Wanggum's Guest: Bupmin's grandparents in the steam, and in the line of hands.
// Usage: node scripts/.cache/wanggum-yongsu.mjs   (idempotent)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const ep = story.flatMap((c) => c.entries ?? []).find((e) => /Wanggum/.test(e.title));
const plain = (b) => (b.html ?? (b.en ?? []).join(' / ') ?? '').replace(/<[^>]+>/g, '');
const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });

if (!ep.blocks.some((b) => b.kind === 'scene' && b.label === 'The Outlet')) {
	const hands = ep.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Hands');
	if (hands < 0) throw new Error('no Hands scene');
	ep.blocks.splice(
		hands,
		0,
		{ kind: 'scene', label: 'The Outlet', ko: '물 빠지는 곳' },
		p(
			'On the far side of the pool, where the water slips out through a crack in the rock, an old man is sitting on a stone with his feet in the stream, talking to it. Nobody in the cave saw him arrive. That was always his best trick.',
			'못 건너편, 바위틈으로 물이 빠져나가는 곳에 한 노인이 돌 위에 앉아 개울에 발을 담그고 물에 말을 걸고 있다. 그가 언제 왔는지 동굴 안 누구도 보지 못했다. 그게 늘 그의 제일가는 재주였다.'
		),
		p(
			'Grey topknot, a little crooked. Plain hemp. Ink on his fingers. Golhwa mutters something about goblins and moves her feet away from his.',
			'조금 삐뚤어진 하얀 상투. 수수한 삼베옷. 손가락엔 먹물. 골화가 도깨비가 어쩌고 하고 투덜대더니 그쪽에서 발을 치운다.'
		),
		say('munmu', ['…Grandfather?'], ['…할아버지?']),
		say('yongsu', ['Mm.', 'You were under the azaleas. The night of the lanterns.'], ['음.', '너, 진달래 밑에 있었지. 등불 띄우던 밤에.']),
		say('munmu', ['You saw me?'], ['보셨어요?']),
		say('yongsu', ['Everyone saw your heel, Bupmin.', 'Princess Seungman stood on her own skirt for an hour so nobody would have to mention it.'], ['다들 네 발뒤꿈치를 봤다, 법민아.', '승만 공주가 아무도 그 얘기를 안 해도 되게 한 시진이나 제 치마를 밟고 서 있었어.']),
		p(
			'Beside him, sitting very straight with her hands folded, is a woman with a wax tablet tucked in her sleeve. She has been there the whole time too. They died on the same night, and they have plainly not been apart since.',
			'그 곁에 손을 모으고 아주 꼿꼿하게 앉은 여인이 있다. 소매에 밀랍판을 넣은 채로. 그녀도 내내 거기 있었다. 둘은 같은 밤에 죽었고, 그 뒤로 떨어진 적이 없는 게 분명하다.'
		),
		say('chunmyung', ['He’s been talking to that crack for an hour.', 'Ask him your question before he starts naming the stones.'], ['저 틈에 대고 한 시진째 얘기 중이다.', '돌마다 이름 붙이기 전에 어서 물어봐라.']),
		say(
			'munmu',
			['Grandfather. The West wants me on my knees in a letter.', 'Father would have written it and not meant a word. Uncle says write it, paper is cheap. The queen says count the hungry.', 'What do you say?'],
			['할아버지. 서국이 저더러 편지로 무릎을 꿇으랍니다.', '아버지라면 쓰고 한 마디도 진심은 아니었겠죠. 외숙은 쓰라고 합니다. 종이는 싸다고. 여왕께선 굶주린 사람을 세라고 하시고요.', '할아버지는요?']
		),
		say('yongsu', ['I say, who’s counting you?'], ['나는 이렇게 묻지. 누가 너를 세고 있냐?']),
		say('munmu', ['The emperor. Every border, every granary. He has a whole office for it.'], ['황제요. 국경이며 곳간이며 전부요. 그 일만 하는 관청이 따로 있습니다.']),
		say(
			'yongsu',
			['Then give him something boring to count.', 'A loyal little king. Bad at sums. Always writing thank-you letters.', 'A man who is laughing at you isn’t counting you. I did it for forty years with a stream.'],
			['그럼 지루한 걸 세게 해 줘라.', '충성스러운 조그만 임금. 셈은 못 하고, 맨날 감사 편지나 쓰는.', '너를 비웃는 사람은 너를 세지 않아. 난 개울 하나로 사십 년을 그렇게 했다.']
		),
		say('munmu', ['And meanwhile?'], ['그동안엔요?']),
		say('yongsu', ['Meanwhile you build the bridge at night.', 'And pay the masons yourself. Never let a goblin do the heavy part.'], ['그동안엔 밤에 다리를 놓는 거지.', '석수 품삯은 네 손으로 주고. 무거운 일은 절대 도깨비한테 맡기지 마라.']),
		say('chunmyung', ['And when it’s built, tell your son what it cost.', 'Don’t wait as long as he did.'], ['그리고 다 놓으면, 네 아들한테 그게 얼마 들었는지 말해 줘라.', '저 양반처럼 그렇게 오래 기다리지 말고.']),
		p(
			'Then the old man turns back to the crack in the rock, says something to it, and laughs at the answer. For the first time in his life, Munmu wishes he could hear what the water says.',
			'그러고는 노인이 다시 바위틈으로 돌아앉아 뭐라고 말하더니, 그 대답에 웃는다. 문무는 난생처음, 물이 뭐라고 하는지 들을 수 있었으면 하고 바란다.'
		)
	);
}

/* the line of hands: his father's parents behind his father */
if (!ep.blocks.some((b) => (b.html ?? '').includes('wax tablet in her other hand'))) {
	const fox = ep.blocks.findIndex((b) => plain(b).includes('It is the only time in his life, or after it, that he has been brief.'));
	if (fox < 0) throw new Error('no Chunchu hand');
	ep.blocks.splice(
		fox + 1,
		0,
		p(
			'Behind his father, two more hands: an old man’s with ink on the fingers, and beside it a woman’s, a wax tablet in her other hand. The side branch, back on the trunk, all in a row. The old man winks.',
			'아버지 뒤로 손이 둘 더 얹힌다. 손가락에 먹물이 묻은 노인의 손, 그리고 그 곁에 다른 손엔 밀랍판을 든 여인의 손. 곁가지였던 줄이 줄기로 돌아와 나란히 섰다. 노인이 한쪽 눈을 찡긋한다.'
		)
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
for (const b of ep.blocks) if (b.kind === 'dialogue' && b.lines.length !== b.en.length) console.log('MISMATCH', b.en);
console.log('Wanggum’s Guest blocks', ep.blocks.length);
