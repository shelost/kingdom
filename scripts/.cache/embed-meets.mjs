import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function find(entries, title) {
	for (const e of entries || []) {
		if (e.title === title) return e;
		const hit = find(e.entries, title) || find(e.chapters, title);
		if (hit) return hit;
	}
}
function walkTop(obj, title) {
	if (Array.isArray(obj)) return find(obj, title);
	for (const k of Object.keys(obj)) {
		if (Array.isArray(obj[k])) {
			const h = find(obj[k], title);
			if (h) return h;
		}
	}
}

const sadaham = walkTop(story, 'Sadaham');
const cup = sadaham?.images?.find((im) => im.id === 'meet-sadaham-cup');
if (!cup) throw new Error('meet-sadaham-cup missing');
if (!cup.people.includes('mishil')) cup.people.push('mishil');

const munhee = walkTop(story, 'Munhee');
if (!munhee) throw new Error('Munhee missing');
munhee.images ??= [];
if (!munhee.images.some((im) => im.id === 'meet-chunchu-yushin-pear-class59')) {
	const src = walkTop(story, 'Queen Sunduk')?.images?.find((im) => im.id === 'meet-chunchu-yushin-pear');
	if (!src) throw new Error('pear source missing');
	munhee.images.push({
		id: 'meet-chunchu-yushin-pear-class59',
		ratio: 2,
		at: 'He tosses the core without looking',
		alt: src.alt,
		prompt: src.prompt,
		refs: src.refs,
		people: ['chunchu', 'yushin'],
		tempImage: '/temp/meet-chunchu-yushin-pear.jpg'
	});
	console.log('Munhee: pear still embedded.');
}

const muryuk = walkTop(story, 'Muryuk');
const rope = muryuk?.images?.find((im) => im.id === 'meet-muryuk-rope');
if (rope && !rope.tempImage) rope.tempImage = '/temp/meet-muryuk-rope.jpg';

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Sadaham cup people:', cup.people);
console.log('Wrote story.json');
