import fs from 'node:fs';
import path from 'node:path';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const entry = Object.values(story)
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');

function onDisk(id) {
	return (
		fs.existsSync(path.join('static/temp', `${id}.jpg`)) ||
		fs.existsSync(path.join('static/temp', `${id}.png`))
	);
}

function slotOk(im) {
	if (im.src) return true;
	if (onDisk(im.id)) return true;
	if (im.tempImage && fs.existsSync(path.join('static', im.tempImage.replace(/^\//, ''))))
		return true;
	return false;
}

const before = entry.images.map((im) => im.id);
const kept = [];
const deleted = [];
for (const im of entry.images) {
	if (slotOk(im)) kept.push(im);
	else deleted.push(im.id);
}
entry.images = kept;

fs.writeFileSync('src/lib/data/story.json', JSON.stringify(story, null, '\t') + '\n');

const seqPath = 'src/lib/movieSequences.ts';
let seq = fs.readFileSync(seqPath, 'utf8');
for (const id of deleted) {
	seq = seq.replace(new RegExp(`\\n\\t\\t\\t\\{ id: '${id}',[^}]+\\},`, 'g'), '');
}
fs.writeFileSync(seqPath, seq);

console.log('deleted', deleted.length, deleted.join(', ') || '(none)');
console.log('kept Jumong images', kept.length, 'was', before.length);
