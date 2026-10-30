// The queue of bookend, death and birth stills still waiting for art: builds each one's reference sheet
// and a compact GenerateImage description (house line + scene + which face is where on the sheet).
// Usage: node scripts/.cache/still-queue.mjs [count] [offset]   → JSON lines { id, sheet, desc }
//        node scripts/.cache/still-queue.mjs --count            → how many are left
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const QUEUED = /-(open|close)(-bk)?$|-(death-body|blood-close|reaper-black|tomb|birth-white)$/;
const HOUSE =
	'HEEWON STYLE: Korean webtoon figures with bold tapered ink contours and clean drawn faces, painted into a watercolor-and-oil world; interiors and night as an old-master tenebrist canvas. Minimal iconic layout, one device, one or two subjects on the thirds, half the frame quiet negative space. Movie tenebrism: deep painted shadow, one hard practical key raking the subject, crushed blacks, long shadows, three depth planes with bokeh. FULL-BLEED 2:1 movie frame composed for a 2:1 letterbox crop, nothing important at the top or bottom edge. Not photoreal, not a 3D render. One of each named person. No text, no lettering, no watermark.';
const INK =
	'JOSEON SUMI INK myth frame: huge black ink masses against blinding bare paper, splashed ink and dry-brush flying white, one graphic device, at most one translucent colour wash on the symbolic object. Topknots, no brimmed hats. FULL-BLEED, no paper margin. No text, no watermark.';
const SWORD = 'Any sword is the straight Korean ring-pommel dao of the attached sw_bidam board: small iron ring pommel, short grip, NO hand guard, perfectly STRAIGHT narrow blade.';

const pending = story
	.flatMap((ch) => ch.entries ?? [])
	.flatMap((e) => (e.images ?? []).map((im) => ({ ...im, entry: e.title })))
	.filter((im) => QUEUED.test(im.id) && !im.tempImage);

if (process.argv[2] === '--count') {
	console.log(pending.length);
	process.exit(0);
}

const [count = 4, offset = 0] = process.argv.slice(2).map(Number);
const POS = (i, n) => (n === 1 ? 'the sheet' : n === 2 ? ['LEFT', 'RIGHT'][i] : n === 3 ? ['LEFT', 'MIDDLE', 'RIGHT'][i] : `${['1st', '2nd', '3rd', '4th'][i]} from the left`);

for (const im of pending.slice(offset, offset + count)) {
	/** Faces first, then the place board, then the sword; at most four panels on one sheet. */
	const refs = (im.refs ?? []).map((r) => r.replace(/^\//, ''));
	const faces = refs.filter((r) => r.startsWith('ch_')).slice(0, 3);
	const place = refs.find((r) => r.startsWith('pl_'));
	const scene = (im.prompt ?? '').split(/ CANON —| HEEWON STYLE:|\| HEADWEAR| SWORD ANATOMY/)[0].replace(/^HEEWON STYLE[^.]*\.\s*/, '');
	const sword = /\b(swords?|blades?|hilt)\b/i.test(scene);
	const sheetRefs = [...faces, ...(place ? [place] : []), ...(sword ? ['sw_bidam.png'] : [])].filter((r) => fs.existsSync(`static/${r}`));
	let sheet = null;
	if (sheetRefs.length) {
		sheet = execFileSync('node', ['scripts/small-refs.mjs', im.id, ...sheetRefs.map((r) => `static/${r}`)], { encoding: 'utf8' }).trim().split('\n').pop();
	}
	const who = faces.map((f, i) => `${POS(i, sheetRefs.length)} of the sheet = ${f.replace(/^ch_|\.png$/g, '').replace(/_/g, ' ').toUpperCase()}`);
	const desc = [
		im.style === 'ink' ? INK : HOUSE,
		scene.slice(0, 1500),
		who.length ? `CHARACTER SHEET: ${who.join('; ')}. FACE and garments from the sheet; new dramatic poses.` : '',
		place ? 'The place board on the sheet is the location: keep its architecture.' : '',
		sword ? SWORD : ''
	]
		.filter(Boolean)
		.join(' ');
	console.log(JSON.stringify({ id: im.id, sheet, desc }));
}
