// node scripts/.cache/audit-setups.mjs
// Prints the reading order, then where each motif is first mentioned vs. first paid off.
import fs from 'node:fs';
const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const textOf = (blocks) =>
	(blocks ?? [])
		.map((b) => (b.blocks ? textOf(b.blocks) : strip(b.html || (b.en || []).join(' ') || b.text || '')))
		.join(' ');

const flat = [];
story.forEach((c, ci) => c.entries.forEach((e) => flat.push({ n: flat.length, ch: c.title, title: e.title, year: e.year, text: textOf(e.blocks) })));
for (const e of flat) console.log(String(e.n).padStart(3), e.year?.padEnd(8), `[${e.ch}]`, e.title, `(${e.text.split(' ').length}w)`);

const MOTIFS = {
	muryuk: /Muryuk/,
	'muryuk+seong-death': /Muryuk[^.]{0,200}(Seong|Gwansan)|(Seong|Gwansan)[^.]{0,200}Muryuk/,
	jumong: /Jumong|Dongmyeong|Chumo/,
	buyeo: /Buyeo/,
	joseon: /Joseon/,
	dangun: /Dangun|Hwanung/,
	hyukgose: /Hyukgose|Hyeokgeose/,
	onjo: /Onjo/,
	talhae: /Talhae/,
	'yushin-white-horse': /white horse/i,
	'"Kim Yushin!" fear': /(It’s|It's) (Kim )?Yushin|Yushin[^.]{0,60}(fear|terror|dread)/,
	gyebek: /Gyebek/,
	'gyebek-reputation': /Gyebek[^.]{0,120}(fear|legend|undefeated|name|rumou?r)/,
	gesomun: /Gesomun/,
	'seven-branched sword': /Seven-Branched/,
	hwanin: /Hwanin/
};
console.log('\nMOTIF  first-mention  / count of entries');
for (const [k, re] of Object.entries(MOTIFS)) {
	const hits = flat.filter((e) => re.test(e.text));
	console.log(k.padEnd(22), hits.slice(0, 6).map((h) => `${h.n}:${h.title}`).join(' | '), `(${hits.length})`);
}
