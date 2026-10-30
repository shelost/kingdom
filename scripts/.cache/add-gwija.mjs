import fs from 'node:fs';
const f = 'src/lib/people.ts';
let s = fs.readFileSync(f, 'utf8');
const swaps = [
	['When Little Fox was caught, he left his gate to carry her out of the Council’s cellar.', 'When the red-mask boy was caught, he left his gate to carry him out of the Council’s cellar.'],
	['Carries Little Fox out of the Council’s cellar', 'Carries the red-mask boy out of the Council’s cellar'],
	['When the child Little Fox was caught and blurted the Restoration and Gildal’s name, Gildal left his gate to break her out', 'When the red-mask boy was caught and blurted the Restoration and Gildal’s name, Gildal left his gate to break him out']
];
for (const [a, b] of swaps) s = s.split(a).join(b);
const person = (o) => `\t{\n${Object.entries(o).map(([k, v]) => `\t\t${k}: ${JSON.stringify(v).replace(/"([a-z]+)":/g, '$1: ')}`).join(',\n')}\n\t},\n`;
const fam = (a, b, c) => [{ id: 'gildal', role: a }, { id: 'yongsu', role: b }, { id: 'sukhuljong', role: c }];
const add = [
	{ id: 'gwija_elder', avatar: '/ch_old_man_tree_spirit.png', gender: 'm', name: 'The One-Eyed Elder', korean: '외눈 노인', kingdom: 'silla',
		tagline: 'The old tree spirit of the reeds; in truth a palace door guard whose eye Suulbu’s men put out on the night of the purge.',
		quote: 'I’d stood at his door. That was the whole charge.',
		voice: 'Slow, dry, unbothered by kings. Korean: old man’s 하오체.',
		arc: 'In the song he is the Old Man Tree, the oldest of the goblins, who bows the reeds when Bihyung walks past. In the truth he stood guard at King Jinji’s door the night the Council carried the king out barefoot. Suulbu’s men put out his eye for having seen whose hands did it, then hanged his sons for their field. He keeps the Ghost Children’s count and their patience, and it is his reeds the masked children bend flat for the miracle.',
		family: fam('Fellow Ghost Child', 'The prince he waits for', 'The man who took his eye'),
		aliases: ['One-Eyed Elder', 'Old Man Tree', '외눈 노인'] },
	{ id: 'gwija_mother', avatar: '/ch_rock_lady_spirit.png', gender: 'f', name: 'The Mother in the Reeds', korean: '갈대밭 어미', kingdom: 'silla',
		tagline: 'The rock lady of the goblin song; in truth a mother whose three elder children Suulbu listed as Jinji’s men and killed.',
		quote: 'Give her back a name. That’s all.',
		voice: 'Flat and tired until her children come up, then sharp. Korean: 해요체, breaking into 반말.',
		arc: 'In the song she is the Rock Lady, who sits on the bridge stone and will not move. In the truth Suulbu wrote “Jinji’s man” beside her husband’s name, and then beside her children’s: fourteen, twelve and nine. Only the baby on her back is left, and the baby has no name, because a child of the list cannot be registered or buried. She asks Yongsu for the plainest thing the Restoration can give.',
		family: fam('Fellow Ghost Child', 'The prince she asks for a name', 'The man who listed her children'),
		aliases: ['Mother in the Reeds', 'Rock Lady', '갈대밭 어미'] },
	{ id: 'gwija_redmask', avatar: '/ch_rascals_spirit.png', gender: 'm', name: 'The Red-Mask Boy', korean: '빨간 탈', kingdom: 'silla',
		tagline: 'The smallest of the three rascal goblins; in truth an orphan of the purge who never takes off his red mask, and the child the Council catches.',
		quote: 'When he’s king, you’ll be sorry.',
		voice: 'Twelve and furious. Korean: 반말, all of it.',
		arc: 'In the song the rascals are three goblin brothers who steal the pages’ shoes. In the truth they are three boys who aren’t brothers: one father exiled to the islands, one hanged at the west gate, one mother who went to the Council to ask after her husband and never came home. The smallest has worn the red mask ever since, running messages through the culvert. At twelve the watch catches him; in the Council’s cellar they take the mask off, and he is so angry he says Gildal’s name and “when he’s king.” Gildal leaves his gate that night to carry him out, and dies for it on the south road.',
		family: fam('Rescuer', 'The prince he talks about too loudly', 'Captor'),
		aliases: ['Red-Mask Boy', 'Little Red', '빨간 탈'] }
].map(person).join('');
if (!s.includes("id: 'gwija_elder'")) s = s.replace("\t{\n\t\tid: 'sado',", add + "\t{\n\t\tid: 'sado',");
fs.writeFileSync(f, s);
