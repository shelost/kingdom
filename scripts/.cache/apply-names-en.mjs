import { editStory } from './story-ops.mjs';

/** English chronicle: nangdo → disciples, hyangdo → Order. Korean fields stay. */
const EN_KEYS = new Set(['html', 'en', 'at', 'alt', 'label', 'title', 'caption', 'term', 'reading']);

function rewriteEnglish(s) {
	if (typeof s !== 'string') return s;
	let out = s;
	out = out.replace(/Yonghwa Hyangdo/g, 'Dragon Flower Order');
	out = out.replace(/\b[Hh]yangdo\b/g, 'Order');
	out = out.replace(/\bAn Old Nangdo\b/g, 'An Old Disciple');
	out = out.replace(/\bA bigger Nangdo\b/g, 'A bigger Disciple');
	out = out.replace(/\bA Nangdo\b/g, 'A Disciple');
	out = out.replace(/nangdo — disciples/g, '\0GLOSS\0');
	out = out.replace(/\bthe word for them is nangdo\b/g, 'the word for them is nangdo — disciples');
	out = out.replace(/\bnangdo\b/g, 'disciples');
	out = out.replace(/\bNangdo\b/g, 'Disciples');
	out = out.replace(/\0GLOSS\0/g, 'nangdo — disciples');
	return out;
}

function walk(node, parentKey) {
	if (Array.isArray(node)) {
		if (parentKey === 'en' || parentKey === 'lines') {
			if (parentKey === 'en') {
				for (let i = 0; i < node.length; i++) if (typeof node[i] === 'string') node[i] = rewriteEnglish(node[i]);
			}
			return;
		}
		for (const item of node) walk(item, parentKey);
		return;
	}
	if (!node || typeof node !== 'object') return;
	for (const [k, v] of Object.entries(node)) {
		if (k === 'ko' || k === 'lines' || k === 'prompt' || k === 'subtitle') continue;
		if (typeof v === 'string' && (EN_KEYS.has(k) || k === 'speaker' || k === 'logline')) {
			node[k] = rewriteEnglish(v);
			continue;
		}
		if (k === 'logline' && v && typeof v === 'object' && typeof v.en === 'string') {
			v.en = rewriteEnglish(v.en);
			continue;
		}
		if (k === 'en' && Array.isArray(v)) {
			walk(v, 'en');
			continue;
		}
		walk(v, k);
	}
}

editStory((story) => {
	for (const ch of story) {
		for (const entry of ch.entries ?? []) {
			if (entry.title === 'Yonghwa Hyangdo') entry.title = 'Dragon Flower Order';
			walk(entry, '');
		}
	}
	return true;
});

console.log('rewrote English nangdo/hyangdo');
