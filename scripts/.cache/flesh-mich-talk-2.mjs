/** One more talk pass: cut the leftover caption, loosen the last telegrams. */
import { editStory, find } from './story-ops.mjs';

function setTalk(entry, fragment, lines, en, extra = {}) {
	const hits = find(entry, fragment, (b) => b.kind === 'dialogue' && (!extra.who || b.person === extra.who));
	if (hits.length !== 1) throw new Error(`talk ${fragment}: ${hits.length}`);
	const { who, ...rest } = extra;
	Object.assign(hits[0].b, { lines, en, ...rest });
}

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('missing');

	/* leftover caption that repeated the Xuantu line */
	const dup = find(mich, '길일 뿐이오.', (b) => b.kind === 'dialogue');
	if (dup.length === 1) {
		const { list, i } = dup[0];
		list.splice(i, 1);
	}

	setTalk(
		mich,
		'되. 가득.',
		['되. 가득 담아.', '아니, 다시. 저쪽 눈 있잖아.'],
		['The measure. Full.', 'Again. They’re watching.']
	);
	setTalk(
		mich,
		'가득이면 밑져.',
		['가득이면 밑져.', '사장인데 그것도 몰라?'],
		['Full is how we lose.', 'You the boss and you don’t know that?']
	);

	setTalk(
		mich,
		'배 있소?',
		['저기. 배 있소? 나, 일자리.'],
		['Hey. Do you have a boat. I need the work.']
	);
	setTalk(
		mich,
		'배는 있어.',
		['배는 있지.', '너는 뭐냐. 야. 팔 봐. 가마니보다 가벼워 보이는데.'],
		['I’ve got a boat.', 'What are you. Hey. Look at those arms. Lighter than a sack.']
	);

	setTalk(
		mich,
		'편지, 이제 헤엄쳐야 해요.',
		['편지, 이제 헤엄쳐야 해요.', '헤엄 못 하면… 글이 끊기는 거죠. 그게 답니다.'],
		['The letters have to swim now.', 'If they can’t swim… that’s the letter gone. That’s the point.']
	);
	setTalk(
		mich,
		'그 성. 삿갓으로 보시던.',
		['전하. 남쪽이 남았습니다.', '그 성. 예전에 삿갓 밑으로 보시던. 기억나시죠.'],
		['Majesty. The south is still there.', 'That fortress. The one you used to look at from under the hat. You remember.']
	);
	setTalk(
		mich,
		'급하지 않아요.',
		['알아요.', '급하지 않아요. 손부터 멈추고.', '손이 떨리거든요. 아직도.'],
		['I know.', 'I’m not in a hurry. Stop the hand first.', 'It still shakes.']
	);

	setTalk(
		mich,
		'걷는 사람은 걷소.',
		['걷고 싶은 사람은 걷소. 막지 마시오.', '남는 사람은 내 사람이오. 가게 열면 그게 답이오.', '세금은 내일. 소금값은 오늘. 오늘은 그걸로 합시다.'],
		['If they want to walk, let them. Don’t stop them.', 'Whoever stays is mine. A shop that opens is the answer.', 'Tax tomorrow. Salt today. That’s enough for today.']
	);

	return { ok: true };
});
