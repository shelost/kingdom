// node scripts/.cache/voice-report-manual.mjs
// Hand fixes for the voice-report items the parser could not apply (flag-only or odd labels).
import fs from 'node:fs';
const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const BACKUP = 'scripts/.cache/prev-stills/story.pre-voice-manual.json';
if (!fs.existsSync(BACKUP)) fs.copyFileSync(FILE, BACKUP);

const entryOf = (t) => {
	const e = story.flatMap((c) => c.entries).find((x) => x.title === t);
	if (!e) throw new Error(`no entry ${t}`);
	return e;
};
const blockText = (b) =>
	(b.kind === 'dialogue' ? [...(b.lines ?? []), ...(b.en ?? [])] : [b.html, b.ko, b.label, b.title, b.caption]).filter(Boolean).join(' ').toLowerCase();
const firstIdx = (blocks, at) => blocks.findIndex((b) => blockText(b).includes(at.trim().toLowerCase()));
const find = (e, start, nth = 0) => {
	const hits = e.blocks.map((b, i) => (b.kind === 'p' && b.html.replace(/<[^>]+>/g, '').startsWith(start) ? i : -1)).filter((i) => i >= 0);
	if (hits[nth] == null) throw new Error(`${e.title}: no block starting "${start}" (#${nth})`);
	return hits[nth];
};

/** Replace a paragraph; images that lose their anchor move to `at`. */
function rewrite(title, start, en, ko, at) {
	const e = entryOf(title);
	const i = find(e, start);
	const before = e.images.filter((im) => im.at && firstIdx(e.blocks, im.at) === i);
	Object.assign(e.blocks[i], { html: en, ko });
	for (const im of before)
		if (firstIdx(e.blocks, im.at) !== i) {
			if (!at || firstIdx(e.blocks, at) !== i) throw new Error(`${title}: ${im.id} needs an anchor`);
			console.log(`  ${im.id}: "${im.at}" → "${at}"`);
			im.at = at;
		}
	console.log('rewrite', title, '·', start);
}

/** Delete a paragraph; its images move to the opening words of the block that follows. */
function remove(title, start, nth = 0) {
	const e = entryOf(title);
	const i = find(e, start, nth);
	const moving = e.images.filter((im) => im.at && firstIdx(e.blocks, im.at) === i);
	e.blocks.splice(i, 1);
	if (moving.length) {
		const next = e.blocks[i];
		const words = (next?.html ?? (next?.en ?? []).join(' ')).replace(/<[^>]+>/g, '').split(/\s+/);
		let at = null;
		for (let n = 4; n <= Math.min(words.length, 12) && !at; n++) {
			const cand = words.slice(0, n).join(' ');
			if (firstIdx(e.blocks, cand) === i) at = cand;
		}
		if (!at) throw new Error(`${title}: no anchor after deleting "${start}"`);
		for (const im of moving) {
			console.log(`  ${im.id}: "${im.at}" → "${at}"`);
			im.at = at;
		}
	}
	console.log('remove ', title, '·', start);
}

/** Edit inside a paragraph without changing its anchors. */
function edit(title, start, pairs) {
	const e = entryOf(title);
	const b = e.blocks[find(e, start)];
	for (const [field, from, to] of pairs) {
		if (!b[field].includes(from)) throw new Error(`${title}: "${from}" not in ${field}`);
		b[field] = b[field].replace(from, to);
	}
	console.log('edit   ', title, '·', start);
}

// Gunchogo — one king, one wall, no regnal numbers
rewrite(
	'Gunchogo, the 13th',
	'At the Siege of Pyongyang',
	'Baekje’s thirteenth king marches north to Pyongyang. A Goguryeo king dies on his own wall. In seven hundred years, it never happens again.',
	'백제의 열셋째 임금이 북쪽 평양으로 진군한다. 고구려 임금이 제 성벽 위에서 죽는다. 칠백 년 동안, 그런 일은 다시 없다.',
	'marches north to Pyongyang'
);
remove('Gunchogo, the 13th', 'It is the only time in seven hundred years');

// Commander Yeon — the guards' rumour is theirs, not the narrator's
rewrite(
	'Commander Yeon',
	'He’s a monster, you know',
	'The guards talk about him the way men talk about weather. “He’s a monster, you know. Out here they call him the Red Sun of Pyongyang. He’s made the Eastern Commandery the safest in the kingdom. The barbarians run if they hear his name.”',
	'경비병들은 날씨 얘기하듯 그를 입에 올린다. “저 사람 괴물이야, 알지? 여기선 평양의 붉은 해라고들 해. 동부 도호부를 나라에서 제일 안전한 데로 만들어 놨잖아. 오랑캐들은 이름만 들어도 도망간다니까.”'
);

// The Severing — two kings, one river, no years or basins
rewrite(
	'The Severing',
	'In 551, Baekje under King Seong',
	'Two kings take a river back together. One is Seong of Baekje. The other is the Cloud King. The deal is simple. Baekje gets the river mouth, near the sea. Silla gets the upper valley.',
	'두 임금이 함께 강을 되찾는다. 하나는 백제의 성왕. 하나는 구름왕. 약속은 간단하다. 바다에 가까운 하구는 백제가, 위쪽 골짜기는 신라가 갖는다.'
);

// Supreme Commander — the dying commanders are titles in narration; Gesomun still says their names
rewrite(
	'Supreme Commander',
	'First the Southern Commander',
	'First the Southern Commander. He wanted the next levy for Yushin’s passes, and called Eastern fighting easy work.',
	'먼저 <b>남부 욕살</b>. 유신의 고개를 막겠다며 다음 징발을 달라 했고, 동부의 싸움은 쉬운 일이라 하던 자.'
);
rewrite(
	'Supreme Commander',
	'Then the Northern Commander',
	'Then the Northern Commander. He would not freeze another winter while the capital counted his remounts twice.',
	'다음은 <b>북부 욕살</b>. 중앙이 보충 말을 두 번 세는 동안 또 한 겨울을 얼고 싶지는 않다던 자.'
);
rewrite(
	'Supreme Commander',
	'The Western Commander',
	'The Western Commander had warned that this would gift the Tang a road. He dies looking west, as if the road might still be argued shut.',
	'<b>서부 욕살</b>은 이러다 당에게 길을 선물하게 된다고 경고했었다. 그는 서쪽을 보며 죽는다. 그 길을 아직 말로 닫을 수 있다는 듯이.'
);

// Huangdi — the opening caption was pasted twice
{
	const e = entryOf('Huangdi (皇帝)');
	if (e.blocks.filter((b) => b.kind === 'p' && b.html.replace(/<[^>]+>/g, '').startsWith('Prince Chunchu (45) approaches')).length === 2) {
		for (const im of e.images) if (im.at === 'Prince Chunchu (45) approaches the Second Emperor') im.at = 'After the hall, a smaller room';
		remove('Huangdi (皇帝)', 'Prince Chunchu (45) approaches', 1);
	}
}

// Small textbook leftovers
edit('결 (結)', 'Before the gate opens Bidam', [['html', 'which a Sangdaedeung does not do', 'which a High Councillor does not do']]);
edit('Seohyun', 'Manno is a wooden wall', [
	['html', ' Later it will be called Jincheon.', ''],
	['ko', ' 훗날 진천이라 불리게 될 곳이다.', '']
]);
rewrite(
	'기 (起)',
	'He says it once more, under his breath',
	'He says it once more, under his breath, as if testing the weight.',
	'그는 숨결 아래로 한 번 더 그 말을 해 본다. 무게를 달아 보듯.'
);
edit('Jiabeng (駕崩)', 'King Euija (49) grows', [
	['html', 'King Euija (49)', 'King Euija'],
	['ko', '의자왕 (49)', '의자왕']
]);
edit('Jiabeng (駕崩)', 'Gyebek (29) already', [
	['html', 'Gyebek (29)', 'Gyebek'],
	['ko', '계백 (29)', '계백']
]);
rewrite(
	'Suro',
	'The people find a box of 6 eggs',
	'The people find a box of six eggs. Six babies hatch, Suro and Ijinasi among them. They found six kingdoms:',
	'사람들이 알 여섯 개가 든 궤짝을 찾아낸다. 아기 여섯이 깨어나고, 수로와 이진아시도 그중에 있다. 이들이 여섯 가야를 세운다:',
	'box of six eggs'
);

// Sabi — the cliff is already told at Falling Flower Rock
remove('Sabi', 'In the Flower Cliffs, the concubines of Euija');

// Euija & Yeon — Hansung: Gaero was caught fleeing and killed below a mountain, not hung on a wall
{
	const e = entryOf('Euija & Yeon');
	const fb = e.blocks.find((b) => b.kind === 'flashback' && b.title === 'Hansung');
	const p = fb.blocks[0];
	p.html = 'Once, a Goguryeo king came south and took Baekje’s old capital. The Baekje king tried to run. They caught him and killed him at the foot of a mountain. Baekje has not forgotten. Goguryeo has not apologised.';
	p.ko = '한때 고구려 왕이 남으로 내려와 백제의 옛 도읍을 빼앗았다. 백제 왕은 달아나려 했다. 그들은 그를 붙잡아 산 아래에서 죽였다. 백제는 잊지 않았다. 고구려는 사과하지 않았다.';
	console.log('rewrite Euija & Yeon · Hansung flashback');
}

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
