import { readFileSync, writeFileSync } from 'fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Park Jesang');
if (!e) throw new Error('Park Jesang not found');

function insertBefore(pred, card) {
	const i = e.blocks.findIndex(pred);
	if (i < 0) throw new Error(`no block for ${card.person}`);
	if (e.blocks[i - 1]?.kind === 'card' && e.blocks[i - 1].person === card.person) {
		console.log('already', card.person);
		return;
	}
	e.blocks.splice(i, 0, card);
	console.log('inserted', card.person, 'at', i);
}

insertBefore(
	(b) => b.kind === 'dialogue' && b.person === 'bokho' && b.en?.[0] === 'They said I could leave.',
	{
		kind: 'card',
		person: 'bokho',
		caption: 'The Goguryeo hostage. Came home first. Knows what a hostage costs.',
		ko: '고구려의 인질. 먼저 돌아왔다. 인질이 얼마인지 안다.'
	}
);

insertBefore(
	(b) => b.kind === 'dialogue' && b.person === 'gwanggaeto' && b.en?.[0] === 'You wrote it.',
	{
		kind: 'card',
		person: 'gwanggaeto',
		caption: 'The Great King. Does not get off a horse unless he means the boot.',
		ko: '태왕. 발을 올리려는 게 아니면 말에서 안 내린다.'
	}
);

insertBefore(
	(b) => b.kind === 'dialogue' && b.person === 'kangrim' && b.en?.[0] === 'Eraha. Servant.',
	{
		kind: 'card',
		person: 'kangrim',
		caption: 'The fetch. Reads the name. Asks one question, and waits.',
		ko: '저승사자. 이름을 읽는다. 질문 하나, 그리고 기다린다.'
	}
);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('ok');
