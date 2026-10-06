// node scripts/.cache/teasers-pass.mjs
// Appends a bold next-episode card to every entry (teasers-{a..d}.json), replacing old card-like blocks.
import fs from 'node:fs';
const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
fs.copyFileSync(FILE, 'scripts/.cache/prev-stills/story.pre-teasers.json');

const cards = Object.assign({}, ...['a', 'b', 'c', 'd'].map((x) => JSON.parse(fs.readFileSync(`scripts/.cache/teasers-${x}.json`, 'utf8'))));

const TIGHTER = {
	'The Severing': ['Back to now. Ten thousand Baekje men march on Daeya. Its grain clerk is called Gumil. Remember that name…!', '다시 지금으로. 백제군 만 명이 대야성으로 향한다. 그 성의 곳간지기 이름은 검일. 기억해 두라…!'],
	'승 (承)': ['“You were never even of Silla.” To see where that began, we go back to a Gaya prince nobody names…!', '“애초에 신라 사람도 아니잖아.” 그 말이 어디서 시작됐는지 보려면, 아무도 이름을 대지 않는 가야의 왕자에게로 거슬러 가야 한다…!'],
	'Queen Jinduk': ['Silla needs an army. Only one man alive can lend it. Chunchu goes west…!', '신라에는 군대가 필요하다. 그것을 빌려줄 사람은 세상에 단 하나. 춘추가 서쪽으로 간다…!'],
	Emperor: ['The seventh invasion of Goguryeo has not begun. It has only found its excuse. Now it needs four dragons…!', '고구려 일곱 번째 침공은 아직 시작되지 않았다. 구실을 찾았을 뿐이다. 이제 용 네 마리만 있으면 된다…!'],
	'Ungjin Commandery': ['Baekje has no king. Across the sea, an exiled prince is packing his bags…!', '백제에는 임금이 없다. 바다 건너, 쫓겨난 왕자 하나가 짐을 꾸린다…!']
};
for (const [t, [en, ko]] of Object.entries(TIGHTER)) Object.assign(cards[t], { en, ko });

const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const bold = (s) => `<b>${s}</b>`;

for (const c of story)
	for (const e of c.entries) {
		const card = cards[e.title];
		if (!card) continue;
		const last = e.blocks[e.blocks.length - 1];
		if (last?.kind === 'p' && last.html === bold(card.en)) continue;
		if (card.replaceBlock != null) {
			const old = e.blocks[card.replaceBlock];
			const oldText = strip(old?.html);
			const orphaned = (e.images ?? []).filter((im) => im.at && oldText.includes(strip(im.at)) && !card.en.includes(strip(im.at)));
			console.log(`replace ${e.title} b${card.replaceBlock}: "${oldText.slice(0, 80)}"`, orphaned.length ? `ORPHANS ${orphaned.map((i) => i.id)}` : '');
			if (orphaned.length) throw new Error('anchor would detach');
			e.blocks.splice(card.replaceBlock, 1);
		}
		e.blocks.push({ kind: 'p', html: bold(card.en), ko: bold(card.ko) });
	}

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('cards:', Object.keys(cards).length);
