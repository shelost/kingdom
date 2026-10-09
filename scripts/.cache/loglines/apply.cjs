// Writes scripts/.cache/loglines/loglines.json into story.json as `logline: { en, ko }` per episode.
const fs = require('fs');
const FILE = 'src/lib/data/story.json';
const lines = JSON.parse(fs.readFileSync('scripts/.cache/loglines/loglines.json', 'utf8'));
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let i = 0;
for (const arc of story) {
	arc.entries = arc.entries.map((entry) => {
		const [title, en, ko] = lines[i++] ?? [];
		if (title !== entry.title) throw new Error(`#${i}: expected "${entry.title}", got "${title}"`);
		const out = {};
		for (const [k, v] of Object.entries(entry)) {
			if (k === 'logline') continue;
			out[k] = v;
			if (k === (entry.subtitle != null ? 'subtitle' : 'title')) out.logline = { en, ko };
		}
		return out;
	});
}
if (i !== lines.length) throw new Error(`${lines.length} lines for ${i} episodes`);
fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log(`loglines: ${i} episodes`);
