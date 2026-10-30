// Maehwa's peach: she never bites it, she sucks it, and sets it down half-eaten when she has decided.
// Banquet → wall → his room → dawn, with the body she uses like a weapon. Idempotent on the marker line.
import { editStory } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, chip) => (en, lines) => ({ kind: 'dialogue', person, chip, lines, en });
const M = say('gumilwife', '#c98fb0');
const P = say('pumsuk', '#7aa8d8');
const MARKER = 'He has seen her eat a peach like that before.';

const swap = (block, [en, enNew], [ko, koNew]) => {
	if (!block.html.includes(en)) throw new Error(`missing EN “${en}”`);
	if (!block.ko.includes(ko)) throw new Error(`missing KO “${ko}”`);
	block.html = block.html.replace(en, enNew);
	block.ko = block.ko.replace(ko, koNew);
};

editStory((story) => {
	const mae = story.find((c) => c.id === 'iron-will').entries.find((e) => e.title === 'Maehwa');
	if (JSON.stringify(mae.blocks).includes(MARKER)) {
		console.log('maehwa-peach: already applied');
		return false;
	}
	const at = (text) => {
		const i = mae.blocks.findIndex((b) => (b.html ?? '').includes(text) || (b.en ?? []).join(' ').includes(text));
		if (i < 0) throw new Error(`Maehwa: no block with “${text}”`);
		return i;
	};
	const insertAfter = (text, ...blocks) => mae.blocks.splice(at(text) + 1, 0, ...blocks);
	const insertBefore = (text, ...blocks) => mae.blocks.splice(at(text), 0, ...blocks);

	insertAfter(
		'Then the lamp-line is hers.',
		p(
			'The old green has been washed so thin it holds her like a hand: the narrowest waist in Daeya, cinched hard by the red sash, and above and below it everything the top table pretends not to see. Maehwa has never once needed a man to look twice. She has never once let one stop at the first look.',
			'낡은 초록은 하도 빨아서 얇아진 나머지 손처럼 그녀를 감싼다. 붉은 띠로 바짝 조인 대야에서 제일 가는 허리, 그 위와 아래로는 윗상이 못 본 척하는 모든 것. 매화는 사내에게 두 번 보라고 할 필요가 없었다. 첫 번째에서 멈추게 둔 적도 없다.'
		)
	);

	const banquetPeach = mae.blocks[at('She takes a plum from a tray and eats it slowly')];
	banquetPeach.html = `She takes a peach from a tray and does not bite it. She sucks at it, slowly, eyes on nothing, because a peach is cheaper than silk and does more work. The juice runs down to her wrist and she lets it. At the back of the hall, among the yellow sleeves, Gumil watches the purple sleeve watch his wife. ${MARKER} He knows what comes after it.`;
	banquetPeach.ko =
		'그녀는 쟁반에서 복숭아 하나를 집는다. 베어 물지 않는다. 아무것도 보지 않는 눈으로 천천히 빤다. 복숭아는 비단보다 싸고, 일은 더 한다. 즙이 손목까지 흘러내려도 그냥 둔다. 전각 뒤쪽 황색 소매들 사이에서, 검일은 자색 소매가 제 아내를 보는 걸 본다. 그녀가 복숭아를 저렇게 먹는 걸 전에도 봤다. 그다음에 뭐가 오는지도 안다.';
	for (const im of mae.images ?? []) {
		if (im.at === 'She takes a plum from a tray and eats it slowly') im.at = 'She takes a peach from a tray and does not bite it.';
	}

	swap(mae.blocks[at('It has taken a plum.')], ['It has taken a plum.', 'It has taken a peach.'], ['자두 하나면 되는 일이었다.', '복숭아 하나면 되는 일이었다.']);

	swap(
		mae.blocks[at('The wall-walk above the river is the only place')],
		['a shawl around her knees, as if', 'a shawl around her knees and the banquet peach in her hand, as if'],
		['무릎에 숄을 두르고 성가퀴', '무릎에 숄을 두르고 연회의 복숭아를 손에 든 채 성가퀴']
	);

	insertAfter(
		'He sits. Not close.',
		P(['…Is that from the banquet?'], ['…그거, 연회에서 가져온 거요?']),
		M(['I don’t finish things in front of people.', 'Sit. You’ll see.'], ['사람들 앞에선 끝까지 안 먹어요.', '앉아요. 보게 될 테니까.'])
	);

	insertBefore(
		'She stands, shakes the shawl off her knees',
		p(
			'She lifts the peach she has been holding all this time and sucks the last of the juice off it, slowly, looking at him the whole while. Then she sets it down on the parapet, half-eaten, still dripping. The juice runs down the warm stone in one slow line. He watches it all the way down.',
			'그녀는 내내 들고 있던 복숭아를 들어 올려, 그를 빤히 보면서 남은 즙을 천천히 빨아 먹는다. 그러고는 반쯤 먹은 복숭아를, 아직 즙이 떨어지는 채로 성가퀴 위에 내려놓는다. 즙이 따뜻한 돌을 타고 한 줄로 천천히 흘러내린다. 그는 그 줄이 끝까지 내려가는 걸 지켜본다.'
		)
	);

	insertAfter(
		'He doesn’t remember the stair.',
		p(
			'A bowl of banquet peaches sits on the sill, sent up for the Guardian working late. She takes one on her way past him, as if she has all night, and sucks it once, slowly, holding his eyes. Then she sets it down on the sill by the lamp, bitten open. It goes on leaking onto the timber all night.',
			'창턱에 연회에서 올려 보낸 복숭아 한 그릇이 있다. 늦게까지 일하는 성주 몫이다. 그녀는 밤새 시간이 있는 것처럼 그의 곁을 지나며 하나를 집어, 그의 눈을 붙든 채 천천히 한 번 빤다. 그러고는 베어 문 자리가 벌어진 채로 등잔 옆 창턱에 내려놓는다. 복숭아는 밤새 나무 위로 즙을 흘린다.'
		)
	);

	swap(
		mae.blocks[at('The lamp burns down. Neither of them gets up to fix it.')],
		['Neither of them gets up to fix it.', 'Neither of them gets up to fix it. On the sill the peach has split along its seam and run down the wood in a dark, sweet line.'],
		['둘 다 고치러 일어나지 않는다.', '둘 다 고치러 일어나지 않는다. 창턱의 복숭아는 골을 따라 갈라져, 나무를 타고 검고 단 줄을 그으며 흘러내렸다.']
	);

	swap(
		mae.blocks[at('Grey in the door-slit.')],
		['as if it were a note.', 'as if it were a note. Beside the cold lamp, the peach is only a stone in a dark, sticky ring.'],
		['쪽지라도 되는 것처럼.', '쪽지라도 되는 것처럼. 식은 등잔 옆에서 복숭아는 끈적하고 검은 자국 속의 씨 하나로 남았다.']
	);

	console.log('maehwa-peach: applied');
});
