/** Remap catalogs, poster folders, widgets, hashes after the TOC rearrange. */
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmdirSync,
	statSync,
	writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
function load(rel) {
	return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}
function save(rel, data) {
	writeFileSync(join(ROOT, rel), JSON.stringify(data, null, '\t') + '\n');
}

const ARC = {
	samhan: 'three-kingdoms',
	'seventh-invasion': 'goguryeo-tang-war',
	'fall-of-euija': 'haedong-jeungja',
	'final-stand': 'fall-of-goguryeo'
};

const TITLE = {
	'Jinhung, the Cloud': 'King Jinheung',
	'Gunchogo, the 13th': 'King Geunchogo',
	'Deer Rock': 'Deer Rock Council',
	'Gwanggeto, the Great King': 'King Gwanggaeto',
	Pumsuk: 'Gotaso',
	Gwansan: 'King Seong',
	Academy: 'Yeon Namseng',
	Stele: 'The Stele',
	Dosuryu: 'The Stele',
	'Siege of Daeya': 'Jukjuk',
	'Yeon’s Massacre': 'The Revolt',
	'Chunchu & Yeon': 'The Cut',
	'Euija & Yeon': 'The Oath',
	Yushin: 'Yonghwa Hyangdo',
	'The Eastern Star': 'The Morning Star',
	'Sima Yi': 'King Dongcheon',
	'Boiling River': 'King Dongcheon',
	Ansi: 'Lord of Ansi',
	'Colossal River': 'Eulji Mundeok',
	'Gi (起)': 'Gi',
	'Suro': 'Suro',
	'Seung (承)': 'Seung',
	'Jeon (轉)': 'Jeon',
	'Gyul (結)': 'Gyul',
	'Huangdi (皇帝)': 'Li Shimin',
	'Jiabeng (駕崩)': 'Li Shimin',
	Exile: 'Yuri Dora',
	Sulmun: 'Three Princes',
	Gardener: 'Hallakgungi',
	'Stone Lady': 'Bonpuri',
	Jachungbi: 'Bonpuri',
	Tribute: 'Bonpuri',
	Coup: 'Cheonbok',
	Descent: 'Lady Ungo',
	'Nine Omens': 'The Fall',
	'Yellow Mountain': 'Hwangsan Field',
	Sabi: 'Buyeo Euija',
	'Buyeo Euija†': 'Buyeo Euija',
	'Kim Chunchu†': 'Kim Chunchu',
	'Ungjin Commandery': 'Echi',
	'Pyongyang I': 'Pyongyang',
	'Tamla Surrenders': 'Snake River',
	Rebellion: 'Kim Jinju',
	Betrayal: 'Gwisil Boksin',
	'Yeon Gesomun†': 'Yeon Gesomun',
	'Brothers’ Coup': 'Yeon Namgun',
	'Pyongyang II': 'Yeon Namsan',
	'Dangun & Old Joseon': 'Dangun',
	'Prosperity Mountain': 'Go Anseung',
	Ansung: 'Go Anseung',
	Letters: 'Xue Rengui',
	'Kim Yushin†': 'Kim Yushin',
	'Final Ford': 'Gibulpo',
	Wanggum: 'King of Samhan'
};

const VOL = {
	'ch-samhan--silla': 'ch-three-kingdoms--silla',
	'ch-samhan--baekje': 'ch-three-kingdoms--baekje',
	'ch-samhan--goguryeo': 'ch-three-kingdoms--goguryeo',
	'ch-five-principles--two-treasures': 'ch-five-principles--hwarang',
	'ch-five-principles--three-sons': 'ch-five-principles--grand-academy',
	'ch-five-principles--five-princes': 'ch-five-principles--master-of-the-classics',
	'ch-iron-will--general': 'ch-iron-will--marshal',
	'ch-seventh-invasion--four-dragons': 'ch-goguryeo-tang-war--four-dragons',
	'ch-seventh-invasion--guardian': 'ch-goguryeo-tang-war--ansi',
	'ch-seventh-invasion--jumong': 'ch-goguryeo-tang-war--jumong',
	'ch-chunchu-era--hyukgos': 'ch-silla-tang-war--hyukgos',
	'ch-fall-of-euija--tamla': 'ch-fall-of-baekje--tamla',
	'ch-fall-of-euija--euija': 'ch-haedong-jeungja--three-thousand-maids',
	'ch-fall-of-euija--three-loyalists': 'ch-haedong-jeungja--three-loyalists',
	'ch-fall-of-baekje--fall-of-baekje': 'ch-fall-of-baekje--yellow-mountain',
	'ch-fall-of-baekje--baekje-restoration-army-bra': 'ch-fall-of-baekje--yellow-mountain',
	'ch-final-stand--four-beasts': 'ch-fall-of-baekje--four-beasts',
	'ch-final-stand--kudara': 'ch-fall-of-goguryeo--kudara',
	'ch-final-stand--brothers': 'ch-fall-of-goguryeo--grand-supreme-commander',
	'ch-silla-tang-war--protectorate-general': 'ch-silla-tang-war--unified-silla',
	'ch-silla-tang-war--king-for-all': 'ch-silla-tang-war--unified-silla'
};

function remapKeyObj(obj, map) {
	const out = {};
	for (const [k, v] of Object.entries(obj)) {
		const nk = map[k] ?? ARC[k] ?? k;
		if (Array.isArray(v) && Array.isArray(out[nk])) {
			out[nk] = [...new Set([...out[nk], ...v])];
		} else if (out[nk] == null) {
			out[nk] = v;
		}
	}
	return out;
}

function remapPrefixed(obj, idMap) {
	const keys = Object.keys(idMap).sort((a, b) => b.length - a.length);
	const out = {};
	for (const [k, v] of Object.entries(obj)) {
		let nk = k;
		for (const old of keys) {
			if (k === old || k.startsWith(old + '-')) {
				nk = idMap[old] + k.slice(old.length);
				break;
			}
		}
		if (out[nk] == null) out[nk] = v;
	}
	return out;
}

function moveDir(oldRel, newRel) {
	const oldP = join(ROOT, oldRel);
	const newP = join(ROOT, newRel);
	if (!existsSync(oldP) || oldP === newP) return;
	mkdirSync(newP, { recursive: true });
	for (const f of readdirSync(oldP)) {
		const src = join(oldP, f);
		const dest = join(newP, f);
		if (statSync(src).isDirectory()) {
			moveDir(join(oldRel, f), join(newRel, f));
			continue;
		}
		if (!existsSync(dest)) renameSync(src, dest);
	}
	try {
		if (readdirSync(oldP).length === 0) rmdirSync(oldP);
	} catch {
		/* ignore */
	}
}

function moveFile(oldRel, newRel) {
	const oldP = join(ROOT, oldRel);
	const newP = join(ROOT, newRel);
	if (!existsSync(oldP) || oldP === newP) return;
	if (!existsSync(newP)) renameSync(oldP, newP);
}

const idMap = load('scripts/.cache/episode-id-remap.json');

for (const [oldK, newK] of Object.entries({ ...ARC, ...VOL })) {
	moveDir(`static/posters/alts/${oldK}`, `static/posters/alts/${newK}`);
}
for (const [oldK, newK] of Object.entries(ARC)) {
	moveFile(`static/posters/${oldK}.jpg`, `static/posters/${newK}.jpg`);
}

for (const rel of [
	'src/lib/data/poster-catalog.json',
	'src/lib/data/poster-picks.json',
	'src/lib/data/cover-picks.json',
	'src/lib/data/spine-picks.json'
]) {
	save(rel, remapKeyObj(load(rel), { ...ARC, ...VOL }));
	console.log('remapped', rel);
}

const widgets = load('src/lib/data/hidden-widgets.json');
for (const w of widgets) {
	if (ARC[w.chapterId]) w.chapterId = ARC[w.chapterId];
	if (TITLE[w.entryTitle]) w.entryTitle = TITLE[w.entryTitle];
}
save('src/lib/data/hidden-widgets.json', widgets);
console.log('widgets', widgets.length);

const summaries = load('src/lib/data/scene-summaries.json');
save('src/lib/data/scene-summaries.json', remapPrefixed(summaries, idMap));
console.log('scene-summaries');

const stars = load('src/lib/data/line-stars.json');
for (const line of stars.lines ?? []) {
	if (line.episodeId && idMap[line.episodeId]) line.episodeId = idMap[line.episodeId];
	if (line.entryTitle && TITLE[line.entryTitle]) line.entryTitle = TITLE[line.entryTitle];
}
save('src/lib/data/line-stars.json', stars);

const scores = load('src/lib/data/episode-scores.json');
if (scores.book?.arcs) {
	for (const a of scores.book.arcs) {
		if (ARC[a.id]) a.id = ARC[a.id];
	}
}
if (scores.episodes) {
	const next = {};
	for (const [k, v] of Object.entries(scores.episodes)) {
		const i = k.indexOf('::');
		if (i < 0) {
			next[k] = v;
			continue;
		}
		const arc = k.slice(0, i);
		const title = k.slice(i + 2);
		const nk = `${ARC[arc] ?? arc}::${TITLE[title] ?? title}`;
		if (v && typeof v === 'object') v.id = nk;
		if (v && TITLE[title]) v.title = TITLE[title];
		next[nk] = v;
	}
	scores.episodes = next;
}
save('src/lib/data/episode-scores.json', scores);
console.log('episode-scores');

let reading = readFileSync(join(ROOT, 'src/lib/reading.svelte.ts'), 'utf8');
reading = reading.replace(
	/(const EPISODE_HASH_ALIASES: Record<string, string> = \{)([\s\S]*?)(\n\};)/,
	(m, open, body, close) => {
		const extra = Object.entries(idMap)
			.filter(([k, v]) => k !== v)
			.map(([k, v]) => `\t'${k}': '${v}',`)
			.join('\n');
		const newBody = body.replace(/(:\s*)'([^']+)'/g, (mm, colon, id) =>
			idMap[id] && idMap[id] !== id ? `${colon}'${idMap[id]}'` : mm
		);
		return `${open}\n${extra}${newBody}${close}`;
	}
);
writeFileSync(join(ROOT, 'src/lib/reading.svelte.ts'), reading);
console.log('reading aliases');

const story = load('src/lib/data/story.json');
const RANGES = {
	'three-kingdoms': '632–642',
	'five-principles': '641',
	'iron-will': '642',
	'goguryeo-tang-war': '643–645',
	'chunchu-era': '643–654',
	'haedong-jeungja': '655–660',
	'fall-of-baekje': '660–662',
	'fall-of-goguryeo': '662–668',
	'silla-tang-war': '670–676'
};
for (const ch of story) {
	if (RANGES[ch.id]) ch.range = RANGES[ch.id];
}
save('src/lib/data/story.json', story);
console.log('ranges');
