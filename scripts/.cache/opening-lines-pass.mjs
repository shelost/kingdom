// node scripts/.cache/opening-lines-pass.mjs
// Heewon's opening lines as block 0, and "Li Shimin, the 2nd Huangdi" → "Emperor".
import fs from 'node:fs';
const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
fs.copyFileSync(FILE, 'scripts/.cache/prev-stills/story.pre-opening-lines.json');

const OPENINGS = {
	'Eight Great Clans': ['Satek. Yunbi. Jinmo. Mokli. Hae. Baek. Guk. Ahn.', '사택. 연비. 진모. 목리. 해. 백. 국. 안.'],
	'Queen Sunduk': ['A Queen? Ridiculous.', '여왕? 웃기지도 않는군.'],
	Nangbi: ['Kim Yushin — a name that strikes fear in all of Samhan. Maybe this is why.', '김유신. 삼한 어디서든 두려움을 부르는 이름. 아마 이래서일 것이다.'],
	Gotaso: ['A young girl is going to do what she’s going to do.', '어린 여자애는 하고 싶은 건 결국 하고 만다.'],
	Yunchung: ['There was only one man Euija knew he could trust to deliver.', '의자가 믿고 맡길 수 있는 사람은 단 한 명뿐이었다.'],
	'The Severing': ['The sad thing about betrayal… is that it never comes from your enemies.', '배신이 슬픈 건… 그게 절대 적에게서 오지 않는다는 거다.'],
	Maehwa: ['A man is measured by his self-control.', '사내의 그릇은 자제력으로 잰다.']
};

const entries = story.flatMap((c) => c.entries);
for (const [title, [en, ko]] of Object.entries(OPENINGS)) {
	const e = entries.find((x) => x.title === title);
	if (!e) throw new Error(`no entry ${title}`);
	if (e.blocks[0]?.kind === 'p' && e.blocks[0].html === en) continue;
	e.blocks.unshift({ kind: 'p', html: en, ko });
	console.log('opening →', title);
}

const emp = entries.find((x) => x.title === 'Li Shimin, the 2nd Huangdi');
if (emp) {
	emp.title = 'Emperor';
	emp.subtitle = '에필로그 · 황제';
	console.log('renamed → Emperor');
}

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
