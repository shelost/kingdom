// One-off: full names, rank facts and promotion stages in src/lib/people.ts. Idempotent-ish: each edit asserts its anchor.
import fs from 'node:fs';
const FILE = 'src/lib/people.ts';
let src = fs.readFileSync(FILE, 'utf8');
const log = [];

function block(id) {
	const start = src.indexOf(`\n\t\tid: '${id}',`);
	if (start < 0) throw new Error(`no person ${id}`);
	const end = src.indexOf('\n\t},', start);
	return [start, end];
}
/** Replace `find` (first hit) inside a person's record. */
function edit(id, find, replace) {
	const [s, e] = block(id);
	const body = src.slice(s, e);
	if (body.includes(replace) && !body.includes(find)) return log.push(`= ${id}: already`);
	const i = body.indexOf(find);
	if (i < 0) throw new Error(`${id}: "${find}" not found`);
	src = src.slice(0, s) + body.slice(0, i) + replace + body.slice(i + find.length) + src.slice(e);
	log.push(`~ ${id}: ${find.trim()} → ${replace.trim()}`);
}
/** Add a field line after the person's `korean:` (or `name:`) line, unless the field exists. */
function add(id, field, value, after = 'korean') {
	const [s, e] = block(id);
	const body = src.slice(s, e);
	if (new RegExp(`\\n\\t\\t${field}:`).test(body)) return log.push(`= ${id}: has ${field}`);
	const m = body.match(new RegExp(`\\n\\t\\t${after}: [^\\n]*`)) ?? body.match(/\n\t\tname: [^\n]*/);
	const at = s + m.index + m[0].length;
	src = src.slice(0, at) + `\n\t\t${field}: ${JSON.stringify(value).replace(/^"|"$/g, "'")}` + src.slice(at);
	log.push(`+ ${id}: ${field} = ${value}`);
}
/** Insert a `stages: [...]` array before `aliases:` when the person has none. */
function stages(id, text) {
	const [s, e] = block(id);
	const body = src.slice(s, e);
	if (/\n\t\tstages: \[/.test(body)) throw new Error(`${id} already has stages`);
	const i = body.indexOf('\n\t\taliases:');
	src = src.slice(0, s + i) + '\n\t\tstages: [\n' + text + '\n\t\t],' + src.slice(s + i);
	log.push(`+ ${id}: stages`);
}

// ── Full names ─────────────────────────────────────────────
edit('munhee', "korean: '문희'", "korean: '김문희'");
edit('munhee', "hanja: '文姬'", "hanja: '金文姬'");
edit('munhee', "korean: '문명왕후',\n\t\t\t\tlabel: 'As queen'", "korean: '문명왕후',\n\t\t\t\thanja: '文明王后',\n\t\t\t\tlabel: 'As queen'");
edit('jayi', "korean: '자희'", "korean: '김자희'");
edit('jayi', "hanja: '慈儀'", "hanja: '金慈儀'");
edit('gotaso', "korean: '고타소'", "korean: '김고타소'");
add('gotaso', 'hanja', '金古陀炤');
add('pumsuk', 'hanja', '金品釋');
add('alchun', 'hanja', '閼川');
add('gumil', 'hanja', '黔日');
add('jinheung', 'hanja', '眞興王');
add('geumwa', 'hanja', '金蛙王');
add('daeso', 'hanja', '帶素');
add('yuhwa', 'hanja', '柳花夫人');
add('munduk', 'hanja', '乙支文德');
edit('hyukgose', "korean: '혁거세'", "korean: '박혁거세'");
edit('hyukgose', "hanja: '赫居世'", "hanja: '朴赫居世'");
add('talhae', 'hanja', '昔脫解');
add('alji', 'hanja', '金閼智');
add('muryuk', 'hanja', '金武力');
add('seohyeon', 'hanja', '金舒玄');
add('manmyung', 'hanja', '萬明夫人');
add('hyo', 'hanja', '扶餘孝');
add('yung', 'hanja', '扶餘隆');
add('pung', 'hanja', '扶餘豐');
edit('pung', "korean: '부여풍',\n\t\t\t\ttitle: 'Prince of Baekje'", "korean: '부여풍',\n\t\t\t\thanja: '扶餘豐',\n\t\t\t\ttitle: 'Prince of Baekje'");
edit('pung', "korean: '풍장왕',", "korean: '풍장왕',\n\t\t\t\thanja: '豐章王',");
add('boksin', 'hanja', '鬼室福信');
add('jungto', 'hanja', '淵淨土');
add('yeontabal', 'hanja', '延陀勃');
add('bojang', 'hanja', '寶藏王');
add('sosuno', 'hanja', '召西奴');
for (const stage of ['child', 'prince', 'hwarang'])
	edit('munmu', `id: '${stage}',`, `id: '${stage}',`); // anchor check only
src = src.replace(/(\n\t\tid: 'munmu',[\s\S]*?\n\t\},)/, (m) => m.replaceAll("korean: '법민'", "korean: '김법민'").replaceAll("hanja: '法敏'", "hanja: '金法敏'"));
log.push('~ munmu: stages 법민 法敏 → 김법민 金法敏');
edit('gulgul', "id: 'dae',\n\t\t\t\tfrom: 642,", "id: 'dae',\n\t\t\t\tfrom: 642,\n\t\t\t\tname: 'Dae Gulgul',\n\t\t\t\tkorean: '대걸걸',\n\t\t\t\thanja: '大乞乞',");

// ── Rank facts ─────────────────────────────────────────────
for (const id of ['alchun', 'bidam', 'pumsuk', 'jukji', 'pumil', 'gwanchang', 'bangul', 'inmun', 'muryuk'])
	add(id, 'boneRank', 'True Bone (진골)', 'kingdom');
add('munsa', 'clan', 'clan-buyeo', 'kingdom');
for (const [id, tribe] of [
	['gusesa', 'central'],
	['northcmd', 'north'],
	['southcmd', 'south'],
	['westcmd', 'west'],
	['cowchief', 'west'],
	['pigchief', 'south'],
	['dogchief', 'north'],
	['horsechief', 'central']
])
	add(id, 'tribe', tribe, 'kingdom');

// ── Promotion / evolution stages ───────────────────────────
stages(
	'gesomun',
	`			{
				id: 'commander',
				until: 642,
				title: 'Eastern Commander of Goguryeo',
				titleKo: '동부 대가',
				label: 'As Eastern Commander'
			},
			{
				id: 'supreme',
				from: 642,
				title: 'Supreme Commander (대막리지) of Goguryeo',
				titleKo: '대막리지',
				label: 'As Supreme Commander'
			}`
);
stages(
	'namseng',
	`			{
				id: 'heir',
				until: 665,
				title: 'Eldest son of Yeon Gesomun',
				titleKo: '대막리지의 맏아들',
				label: 'As heir'
			},
			{
				id: 'supreme',
				from: 665,
				title: 'Supreme Commander (대막리지) of Goguryeo',
				titleKo: '대막리지',
				label: 'As Supreme Commander'
			}`
);
stages(
	'wuzetian',
	`			{
				id: 'consort',
				until: 655,
				title: 'Talented Lady of the inner palace',
				titleKo: '재인',
				label: 'In the inner palace'
			},
			{
				id: 'empress',
				from: 655,
				until: 690,
				title: 'Empress of Tang',
				titleKo: '황후',
				label: 'As empress'
			},
			{
				id: 'emperor',
				from: 690,
				title: 'Emperor of Zhou',
				titleKo: '황제',
				label: 'As emperor of Zhou'
			}`
);
stages(
	'jumong',
	`			{
				id: 'exile',
				lookOnly: true,
				title: 'Exile from Buyeo',
				label: 'In exile'
			},
			{
				id: 'king',
				lookOnly: true,
				name: 'King Dongmyung',
				korean: '동명성왕',
				hanja: '東明聖王',
				title: 'First King of Goryeo',
				label: 'As King Dongmyung',
				avatar: '/ch_dongmyung.png'
			}`
);
stages(
	'sosuno',
	`			{
				id: 'widow',
				lookOnly: true,
				title: 'Widow of Jolbon',
				label: 'At the grain porch'
			},
			{
				id: 'queen',
				lookOnly: true,
				name: 'Queen Sosuno',
				title: 'First Queen of Goryeo',
				titleKo: '왕비',
				label: 'As queen',
				avatar: '/ch_sosuno_queen.png'
			}`
);
edit('gaozong', "\t\t\t{\n\t\t\t\tuntil: 649,", "\t\t\t{\n\t\t\t\tid: 'prince',\n\t\t\t\tuntil: 649,");
edit('gaozong', "title: 'Crown Prince of Tang',\n\t\t\t\tavatar: '/ch_gaozong.png'", "title: 'Crown Prince of Tang',\n\t\t\t\ttitleKo: '황태자',\n\t\t\t\tlabel: 'As crown prince',\n\t\t\t\tavatar: '/ch_li_zhi.png'");
edit('gaozong', "\t\t\t{\n\t\t\t\tfrom: 649,", "\t\t\t{\n\t\t\t\tid: 'emperor',\n\t\t\t\tfrom: 649,");
edit('gaozong', "title: 'Third Emperor of Tang (Gaozong)',\n\t\t\t\tavatar", "title: 'Third Emperor of Tang (Gaozong)',\n\t\t\t\ttitleKo: '황제',\n\t\t\t\tlabel: 'As emperor',\n\t\t\t\tavatar");
edit('yushin', "id: 'elder',\n\t\t\t\tfrom: 668,", "id: 'elder',\n\t\t\t\tfrom: 668,\n\t\t\t\ttitle: 'Taedaegakgan, Supreme General of Silla',\n\t\t\t\ttitleKo: '태대각간',");
edit('yushin', "id: 'marshal',\n\t\t\t\tfrom: 632,\n\t\t\t\tuntil: 668,", "id: 'marshal',\n\t\t\t\tfrom: 632,\n\t\t\t\tuntil: 668,\n\t\t\t\ttitleKo: '대장군',");
edit('bidam', "id: 'young',\n\t\t\t\tfrom: 632,\n\t\t\t\tuntil: 645,", "id: 'young',\n\t\t\t\tfrom: 632,\n\t\t\t\tuntil: 645,\n\t\t\t\ttitle: 'Councillor (대등) of Silla',\n\t\t\t\ttitleKo: '대등',");
edit('bidam', "id: 'elder',\n\t\t\t\tfrom: 645,", "id: 'elder',\n\t\t\t\tfrom: 645,\n\t\t\t\ttitle: 'High Councillor (상대등) of Silla',\n\t\t\t\ttitleKo: '상대등',");
edit('gyebek', "title: 'General of Baekje',", "title: 'General of Baekje',\n\t\t\t\ttitleKo: '장군',");
for (const [id, realm, ko] of [
	['daebyeol', 'Ruler of the Land of the Dead', '저승의 주인'],
	['sobyeol', 'Ruler of the Land of the Living', '이승의 주인']
]) {
	edit(id, "id: 'young',\n\t\t\t\tlabel: 'Before the wager',", "id: 'young',\n\t\t\t\tlookOnly: true,\n\t\t\t\tlabel: 'Before the wager',");
	edit(
		id,
		`avatar: '/ch_${id === 'daebyeol' ? 'big' : 'little'}_star_young.png'\n\t\t\t}`,
		`avatar: '/ch_${id === 'daebyeol' ? 'big' : 'little'}_star_young.png'\n\t\t\t},\n\t\t\t{\n\t\t\t\tid: 'king',\n\t\t\t\tlookOnly: true,\n\t\t\t\ttitle: '${realm}',\n\t\t\t\ttitleKo: '${ko}',\n\t\t\t\tlabel: 'After the wager'\n\t\t\t}`
	);
}

fs.writeFileSync(FILE, src);
console.log(log.join('\n'));
