/** Dolgo sends Ulbul out the back door. Last word: 을불아… */
import { editStory } from './story-ops.mjs';

function d(person, lines, en, extra = {}) {
	return { kind: 'dialogue', person, lines, en, ...extra };
}
function p(html, ko) {
	return { kind: 'p', html, ko };
}
function scene(label, ko, weather = 'night') {
	return { kind: 'scene', label, ko, weather };
}

function walk(blocks, fn) {
	for (const b of blocks) {
		fn(b, blocks);
		if (b.kind === 'flashback' && Array.isArray(b.blocks)) walk(b.blocks, fn);
	}
}

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('missing');

	let fb;
	walk(mich.blocks, (b) => {
		if (b.kind === 'flashback' && b.title === 'The night he was told to run') fb = b;
	});
	if (!fb) throw new Error('flashback missing');

	const cut = fb.blocks.findIndex((b) => (b.html || '').includes('The father stands in a doorway'));
	if (cut < 0) throw new Error('doorway p missing');
	fb.blocks.splice(
		cut,
		fb.blocks.length - cut,
		p(
			'The father stands in the doorway and will not come in. The cup is in his other hand. That is how Eulbul knows it is already over.',
			'아버지가 문간에 선 채 들어오지 않는다. 다른 손에 잔이 있다. 을불은 그걸로 이미 끝났음을 안다.'
		),
		d(
			'dolgo',
			['가.', '지금. 뒤문으로.', '다시 오지 마. 이 집, 다시 보지 마.'],
			['Go.', 'Now. The back door.', 'Don’t come back. Don’t look at this house again.'],
			{ chip: '#9a5348' }
		),
		d(
			'micheon',
			['아버지—', '같이— 그 잔, 왜—'],
			['Father—', 'Come with— that cup, why—'],
			{ chip: '#C30000', look: 'exile' }
		),
		d(
			'dolgo',
			['너는 마시면 안 돼.', '내가 마실게.', '가. 가라고.'],
			['You don’t drink that.', 'I will.', 'Go. I said go.'],
			{ chip: '#9a5348' }
		),
		p(
			'He drops the cup onto the threshold so he can hold his son with both arms. The bronze rings. Neither of them lets go on the first try. You can hear the house sitting down behind him, and he is crying into a shoulder that is still too thin for this.',
			'잔을 문턱에 내려놓고 두 팔로 아들을 안는다. 놋쇠가 운다. 둘 다 한 번에 놓지 못한다. 등 뒤에서 집이 앉는 소리가 난다. 그는 아직 이 일을 하기엔 얇은 어깨에 울고 있다.'
		),
		d(
			'micheon',
			['가지 마요.', '아버지. 가지 마요. 내가—'],
			['Don’t. Don’t go.', 'Father. Don’t. I’ll—'],
			{ chip: '#C30000', look: 'exile' }
		),
		d(
			'dolgo',
			['이름 꺼내지 마.', '한 번 물으면 모른다.', '두 번 물으면, 더 잘 둘러대.', '강으로. 소금 있는 데로.'],
			['Don’t use your name.', 'If they ask once, you don’t know it.', 'If they ask twice, lie better.', 'The river. Where the salt is.'],
			{ chip: '#9a5348' }
		),
		p(
			'He pushes him toward the back corridor. The cup is waiting where he left it. He does not pick it up until the boy’s hands are off his robe.',
			'뒤 복도로 민다. 잔은 놔둔 자리에 있다. 아들의 손이 옷에서 떨어지기 전에는 집어 들지 않는다.'
		),
		d(
			'micheon',
			['아버지.'],
			['Father.'],
			{ chip: '#C30000', look: 'exile' }
		),
		d('dolgo', ['을불아…'], ['Ulbul…'], { chip: '#9a5348' }),
		scene('The back door · the same night', '뒷문 · 그날 밤', 'night'),
		p(
			'The back door of the palace is a timber leaf with iron bosses. He hits it with his shoulder because his hands will not work. Night packed earth. Giwa. One lamp still burning in the doorway he just left.',
			'궁 뒷문은 쇠못 박힌 나무짝이다. 손이 안 되어서 어깨로 연다. 밤의 흙. 기와. 방금 나온 문간에 등잔이 하나 아직 켜 있다.'
		),
		p(
			'He runs. Then he looks back, which is the one thing he was not supposed to do. His father is still in that door. The cup is up again. Eulbul is crying so hard he misses a step, and he knows, the way you know a lamp has gone out even before it does, that the man in the door is dying in there.',
			'달린다. 그리고 뒤돌아본다. 하지 말라는 그것이다. 아버지는 아직 그 문에 있다. 잔을 다시 들었다. 을불은 울어서 발을 헛디딘다. 등잔이 꺼지기 전에 꺼진 줄 아는 것처럼, 문간의 사내가 그 안에서 죽고 있음을 안다.'
		),
		p(
			'That is the last of him. After that the boy does not look back again.',
			'그게 아버지의 마지막이다. 그다음부터 소년은 다시 뒤돌아보지 않는다.'
		)
	);

	const run = (mich.images ?? []).find((im) => im.id === 'mich-ulbul-run');
	if (run) {
		run.at = 'Then he looks back';
		run.alt = 'Eulbul runs from the palace back door and looks back crying; a lamp holds his father in the doorway.';
	}

	return { ok: true };
});
