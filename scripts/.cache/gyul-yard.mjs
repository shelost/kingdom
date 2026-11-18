import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Gyul');

const meet = e.blocks.find((b) => b.html?.startsWith('They meet again between the camps'));
if (meet) {
	meet.html =
		'They meet in the hwarang yard under the Moon Palace — not as High Councillor and marshal, but as the yard’s two best. The same packed earth. The same gate. Fish pommel against heavenly horse. The first exchanges are almost gentle. That is how Hwarang kill each other.';
	meet.ko =
		'그들은 월성 아래 화랑 마당에서 만난다. 상대등과 대장군이 아니라, 그 마당의 둘로서. 같은 맨땅. 같은 문. 물고기 고리와 천마 고리. 처음 몇 합은 거의 부드럽다. 화랑은 그렇게 서로를 죽인다.';
}

const holdAt = 'Yushin drops the fish sword and gets an arm under him.';
if (!e.blocks.some((b) => b.html?.includes(holdAt))) {
	const i = e.blocks.findIndex((b) => b.html?.includes('neither one wanted to go home'));
	e.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'Yushin drops the fish sword and gets an arm under him. They are in the middle of the yard. Bidam bleeds out against the blue sleeve, and Yushin holds him until the breath is gone.',
		ko: '유신이 물고기 칼을 내려놓고 팔 하나를 그 아래로 넣는다. 둘은 마당 한가운데다. 비담의 피가 푸른 소매로 빠져나가고, 유신은 숨이 다할 때까지 안는다.'
	});
}

const kneel = e.blocks.find((b) => b.html?.startsWith('Yushin kneels once'));
if (kneel) {
	kneel.html =
		'He is already on his knees in the middle of the yard. He unties the black headband from the body. Then he stands, mud still wet, turns to the Hwarang behind him and names a house. Bidam’s own line. The one he carried in his jaw and never once claimed aloud.';
	kneel.ko =
		'그는 이미 마당 한가운데 무릎을 꿇고 있다. 시신에서 검은 머리띠를 푼다. 그리고 일어선다. 진흙은 아직 젖어 있다. 뒤의 화랑을 돌아보고 한 집안을 부른다. 비담 자신의 성. 턱에 물고 한 번도 소리 내 주장하지 않던 그 성.';
}

const slots = [
	{
		id: 'gyul-yard-open',
		ratio: 2,
		time: 'day',
		at: 'They meet in the hwarang yard under the Moon Palace',
		alt: 'The old hwarang yard. Bidam and Yushin step onto the packed earth with the swords they grew up on.',
		people: ['bidam', 'yushin'],
		place: 'hwarang_yard'
	},
	{
		id: 'gyul-yard-cross',
		ratio: 2,
		time: 'day',
		at: 'For one breath they are tied together at the wrist.',
		alt: 'In the yard: blades crossed, Bidam’s beads caught on Yushin’s ring.',
		people: ['bidam', 'yushin'],
		place: 'hwarang_yard'
	},
	{
		id: 'gyul-yard-hold',
		ratio: 2,
		time: 'day',
		at: 'Yushin drops the fish sword and gets an arm under him.',
		alt: 'Overhead. The middle of the yard. Yushin holds Bidam while he bleeds out.',
		people: ['bidam', 'yushin'],
		place: 'hwarang_yard'
	}
];
for (const slot of slots) {
	if (!e.images.some((im) => im.id === slot.id)) e.images.push(slot);
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('gyul yard ok');
