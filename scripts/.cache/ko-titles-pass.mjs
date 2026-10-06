// Korean episode titles (entry.subtitle) and the Jinheung retitle.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const BACKUP = 'scripts/.cache/prev-stills/story.pre-ko-titles.json';
if (!fs.existsSync(BACKUP)) fs.copyFileSync(FILE, BACKUP);
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));

/** chapter id → English title → new Korean title */
const KO = {
	samhan: { 'Commander Yeon': '연개소문' },
	'five-principles': {
		Bupmin: '김법민',
		Gotaso: '김고타소',
		'Chunchu & Munhee': '문희',
		'The Severing': '단 (斷)'
	},
	'iron-will': { Gumil: '검일', 'Chunchu & Yeon': '자의악마', 'Euija & Yeon': '해동증자' },
	'seventh-invasion': { 'Four Dragons': '사룡 (四龍)' },
	'chunchu-era': {
		Muryuk: '김무력',
		Seohyun: '김서현',
		'Jiabeng (駕崩)': '가붕 (駕崩)',
		Jahee: '김자희'
	},
	'fall-of-euija': {
		Exile: '유배',
		'Heaven–Earth King': '천지왕',
		Tribute: '탐라와 백제',
		Coup: '혁명',
		Descent: '삼천궁녀',
		'Nine Omens': '망국'
	},
	'epilogue-part-ii': { 'Three Realms': '삼계' },
	'fall-of-baekje': { 'Kim Chunchu†': '김춘추' },
	'final-stand': { 'White River': '백강' },
	'silla-tang-war': { "The Wanggeom's Guest": '단군왕검' }
};

const RETITLE = { samhan: { 'Jinheung, the Cloud King': 'Jinheung, the Cloud' } };

let n = 0;
for (const ch of story) {
	for (const e of ch.entries) {
		const ko = KO[ch.id]?.[e.title];
		if (ko) {
			e.subtitle = ko;
			n++;
		}
		const title = RETITLE[ch.id]?.[e.title];
		if (title) e.title = title;
	}
}
fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log(`${n} Korean titles set`);
