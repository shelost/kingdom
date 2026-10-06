import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));
const ironWill = story.find((c) => c.id === 'iron-will');
const entry = (title) => {
	const e = ironWill.entries.find((x) => x.title === title);
	if (!e) throw new Error(`missing entry ${title}`);
	return e;
};

const GESOMUN_CHIP = '#d0362f';

const supreme = entry('Supreme Commander');
const opening = supreme.blocks[0];
if (opening?.kind !== 'flashback' || !/Jumong Cavern/.test(opening.title ?? '')) {
	throw new Error('Supreme Commander no longer opens on the Jumong Cavern flashback');
}
supreme.blocks.shift();

const star = entry('The Eastern Star');
const firstMonologue = star.blocks.findIndex(
	(b) => b.kind === 'dialogue' && b.person === 'gyebek' && b.en?.[0]?.startsWith('…All my life')
);
if (firstMonologue < 0) throw new Error('Gyebek monologue not found');
const monologue = star.blocks.slice(firstMonologue, firstMonologue + 2);
if (monologue[1]?.person !== 'gyebek' || !monologue[1].en.some((l) => l.includes('King for All'))) {
	throw new Error('Gyebek monologue tail not found');
}

const asGesomun = (b) => ({
	...b,
	chip: GESOMUN_CHIP,
	person: 'gesomun',
	lines: b.lines.map((l) => l.replace('폐하께서는', '성왕께서는'))
});

const cavern = [
	{
		kind: 'p',
		html: 'Three nights after the banquet hall is scrubbed, Yeon climbs to <b>Jumong Cavern</b> — 국동대혈, where the holy king prayed when the river had no bridge. The marches believe the stone remembers bowstrings.',
		ko: '연회장의 피를 씻어 낸 지 사흘 뒤, 연은 <b>주몽 동굴</b>로 올라간다. 강에 나루가 없던 시절 성왕이 기도하던 국동대혈이다. 변경 사람들은 그 돌이 활시위를 기억한다고 믿는다.'
	},
	{
		kind: 'p',
		html: 'He kneels at the mouth and lays a crow-stamped ring-pommel on the stone. He does not ask forgiveness for the hall. He asks for witnesses.',
		ko: '그는 동굴 입구에 무릎을 꿇고, 삼족오가 찍힌 환두대도를 돌 위에 내려놓는다. 전각의 일로 용서를 구하지는 않는다. 증인을 구한다.'
	},
	{
		kind: 'dialogue',
		chip: GESOMUN_CHIP,
		person: 'gesomun',
		lines: ['성왕께서 여기서 나라를 빚으셨습니다.', '저도… 제 손으로 빚겠습니다.'],
		en: ['The Holy King forged a country here.', 'I too… will forge one with my own hands.']
	},
	...monologue.map(asGesomun)
];

star.blocks.splice(firstMonologue, 2, ...cavern);

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log(
	`Supreme Commander: ${supreme.blocks.length} blocks. The Eastern Star: ${star.blocks.length} blocks.`
);
