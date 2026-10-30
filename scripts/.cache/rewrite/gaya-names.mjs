// One-shot: Gaya translation names (Golden/Great/Holy/Bright). Idempotent via exact pairs.
import fs from 'node:fs';
const swap = (file, pairs) => {
	let t = fs.readFileSync(file, 'utf8'); let n = 0;
	for (const [a, b] of pairs) { const c = t.split(a).length - 1; if (c) { t = t.split(a).join(b); n += c; } }
	if (n) fs.writeFileSync(file, t);
	console.log('wrote', file, n);
};
const S = 'src/lib/data/story.json';
swap(S, [
	['One takes Ara, on the river bend to the west,', 'One takes Bright Gaya \u2014 Ara, on the river bend to the west,'],
	['Ara. Horses first. Everything else after.', 'Bright Gaya. Horses first. Everything else after.'],
	['One takes Sungsan, the hill nearest the neighbours,', 'One takes Holy Gaya \u2014 Sungsan, the hill nearest the neighbours,'],
	['Sungsan. The wall faces out. So does he.', 'Holy Gaya. The wall faces out. So does he.'],
	['The Sungsan king votes for nobody, on principle. The Ara king votes', 'The Holy Gaya king votes for nobody, on principle. The Bright Gaya king votes'],
	['Then Ara. The Sungsan king tries', 'Then Bright Gaya. The Holy Gaya king tries'],
	['The king of Sungsan', 'The king of Holy Gaya'],
	['A Degaya archer', 'A Great Gaya archer'],
	['Degaya has been forging', 'Great Gaya has been forging'],
	['the old lords of Degaya', 'the old lords of Great Gaya'],
	['An old lord of Degaya', 'An old lord of Great Gaya'],
	['A prince of Gumgwan', 'A prince of Golden Gaya'],
	['handed over Gumgwan with the keys', 'handed over Golden Gaya with the keys'],
]);
swap('src/lib/people.ts', [
	['Leads the vanguard that takes Degaya.', 'Leads the vanguard that takes Great Gaya.'],
	['Conquers Degaya.', 'Conquers Great Gaya.'],
	['He surrenders Gumgwan so his line', 'He surrenders Golden Gaya so his line'],
	['King Suro of Gumgwan, cons', 'King Suro of Golden Gaya, cons'],
	['Loses the shapeshift contest to Suro of Gumgwan.', 'Loses the shapeshift contest to Suro of Golden Gaya.'],
	['Took Gumgwan without a battle, and paid for it in rank.', 'Took Golden Gaya without a battle, and paid for it in rank.'],
	['Receives the surrender of Gumgwan Gaya.', 'Receives the surrender of Golden Gaya.'],
	['Three generations of Gumgwan Kims, from the last prince of Golden Gaya', 'Three generations of Golden Gaya Kims, from the last prince of Golden Gaya'],
	['Gumgwan leads the early iron age; Degaya leads the late one; Ara / Anra talks', 'Golden Gaya leads the early iron age; Great Gaya leads the late one; Bright Gaya / Anra talks'],
	['Gumgwan yields in 532 so its blood', 'Golden Gaya yields in 532 so its blood'],
	['From Byunhan into early Gaya \u2014 Gumgwan as coastal centre.', 'From Byunhan into early Gaya \u2014 Golden Gaya as coastal centre.'],
	['Golden Gaya / Gumgwan surrenders to Silla.', 'Golden Gaya surrenders to Silla.'],
	['Ara / Anra and the southern courts fold under Silla.', 'Bright Gaya / Anra and the southern courts fold under Silla.'],
	['Kim \u00b7 Gumgwan Gaya line', 'Kim \u00b7 Golden Gaya line'],
]);
swap('src/lib/movieSequences.ts', [['A prince of Gumgwan', 'A prince of Golden Gaya']]);
swap('src/lib/data/research-images.json', [
	['Degaya royal tomb (museum reconstruction)', 'Great Gaya royal tomb (museum reconstruction)'],
	['Full-scale reconstruction of a Degaya royal tomb', 'Full-scale reconstruction of a Great Gaya royal tomb'],
	['while he is still a prince of Gumgwan Gaya:', 'while he is still a prince of Golden Gaya:'],
]);
swap('src/lib/data/battles/gwanggaeto-400.json', [['a fortress of Geumgwan Gaya at Gimhae', 'a fortress of Golden Gaya at Gimhae']]);
swap('src/lib/places.ts', [
	["id: 'ara',\n\t\tname: 'Ara Gaya',", "id: 'ara',\n\t\tname: 'Bright Gaya',"],
	["id: 'seongsan',\n\t\tname: 'Sungsan Gaya',", "id: 'seongsan',\n\t\tname: 'Holy Gaya',"],
]);
console.log('done');
