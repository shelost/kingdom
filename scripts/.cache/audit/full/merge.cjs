// Merge the slice reports (report-1..9.json) with stats.txt into merged.json and print a digest.
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const stats = new Map();
for (const line of fs.readFileSync(path.join(dir, 'stats.txt'), 'utf8').split('\n')) {
	const m = line.match(/^#\s*(\d+)\s+(F?)\s+(.+?)\s+words\s+(\d+) \| dialogue (\d+)% narration (\d+)% records (\d+)%/);
	if (m) stats.set(+m[1], { flash: m[2] === 'F', words: +m[4], dialogue: +m[5], narration: +m[6], records: +m[7] });
}

const KEYS = ['followable', 'context', 'pacing', 'flow', 'entertainment'];
const episodes = [];
const arcs = [];
for (let s = 1; s <= 9; s++) {
	const file = path.join(dir, `report-${s}.json`);
	if (!fs.existsSync(file)) {
		console.log(`(slice ${s} missing)`);
		continue;
	}
	const r = JSON.parse(fs.readFileSync(file, 'utf8'));
	for (const e of r.episodes) {
		const total = KEYS.reduce((sum, k) => sum + (+e.scores[k] || 0), 0);
		episodes.push({
			n: e.n,
			title: e.title,
			slice: s,
			...stats.get(e.n),
			scores: e.scores,
			total,
			verdict: e.verdict,
			romance: e.romance || null,
			battle: e.battle || null,
			best: e.best,
			worst: e.worst,
			fixes: (e.fixes || []).slice(0, 3)
		});
	}
	arcs.push({ slice: s, range: r.range, ...r.arc });
}
episodes.sort((a, b) => a.n - b.n);
fs.writeFileSync(path.join(dir, 'merged.json'), JSON.stringify({ episodes, arcs }, null, 1));

const mean = (xs) => (xs.reduce((a, b) => a + b, 0) / (xs.length || 1)).toFixed(2);
console.log(`${episodes.length} episodes merged`);
console.log('means:', KEYS.map((k) => `${k} ${mean(episodes.map((e) => +e.scores[k]))}`).join(' · '));
const bySlice = arcs.map((a) => {
	const es = episodes.filter((e) => e.slice === a.slice);
	return `slice ${a.slice} (${a.range}): total ${mean(es.map((e) => e.total))}`;
});
console.log(bySlice.join('\n'));
const ranked = episodes.slice().sort((a, b) => b.total - a.total || a.n - b.n);
console.log('\nTOP 15:', ranked.slice(0, 15).map((e) => `#${e.n} ${e.title} ${e.total}`).join(' | '));
console.log('\nBOTTOM 15:', ranked.slice(-15).map((e) => `#${e.n} ${e.title} ${e.total}`).join(' | '));
const hist = {};
for (const e of episodes) hist[e.total] = (hist[e.total] || 0) + 1;
console.log('\ntotal histogram:', JSON.stringify(hist));
console.log('\nROMANCE episodes:', episodes.filter((e) => e.romance).map((e) => `#${e.n}(${e.scores.entertainment})`).join(' '));
console.log('BATTLE episodes:', episodes.filter((e) => e.battle).map((e) => `#${e.n}(${e.scores.entertainment})`).join(' '));
const broken = arcs.flatMap((a) => (a.handoffs || []).filter((h) => h.works && h.works !== 'yes'));
console.log(`\nhandoffs not fully working: ${broken.length} of ${arcs.flatMap((a) => a.handoffs || []).length}`);
console.log(broken.map((h) => `${h.from}→${h.to} ${h.works}`).join(', '));
