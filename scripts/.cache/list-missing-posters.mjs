import { existsSync, readFileSync } from 'node:fs';

const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
const cat = JSON.parse(readFileSync('src/lib/data/episode-poster-catalog.json', 'utf8'));
const RR_I = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const RR_M = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const RR_F = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

function slug(title) {
	return title
		.replace(/[\uac00-\ud7a3]/g, (ch) => {
			const n = ch.charCodeAt(0) - 0xac00;
			return RR_I[Math.floor(n / 588)] + RR_M[Math.floor((n % 588) / 28)] + RR_F[n % 28];
		})
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function speakers(blocks, score) {
	for (const b of blocks || []) {
		if (b.kind === 'dialogue' && b.person) score.set(b.person, (score.get(b.person) || 0) + (b.lines?.length || 1));
		else if (b.kind === 'monologue' && b.person) score.set(b.person, (score.get(b.person) || 0) + 1);
		else if (b.kind === 'flashback') speakers(b.blocks, score);
	}
}

const LEGACY = {
	'three-kingdoms-queen-sunduk': 'samhan-queen-sunduk',
	'three-kingdoms-harmony-council': 'samhan-harmony-council',
	'three-kingdoms-jade-gate-valley': 'samhan-jade-gate-valley',
	'three-kingdoms-king-jinheung': 'samhan-jinhung-the-cloud',
	'three-kingdoms-prince-euija': 'samhan-prince-euija',
	'three-kingdoms-eight-great-clans': 'samhan-eight-great-clans',
	'three-kingdoms-deer-rock-council': 'samhan-deer-rock',
	'three-kingdoms-king-geunchogo': 'samhan-gunchogo-the-13th',
	'three-kingdoms-commander-yeon': 'samhan-commander-yeon',
	'fall-of-baekje-grim-reaper': 'fall-of-baekje-kangrim'
};

function hasPoster(eid) {
	const dir = cat[eid] ? eid : LEGACY[eid] ?? eid;
	const listed = (cat[eid] ?? cat[dir] ?? []).includes('poster.jpg');
	const onDisk = existsSync(`static/posters/episodes/${dir}/poster.jpg`) || existsSync(`static/posters/episodes/${eid}/poster.jpg`);
	return listed || onDisk;
}

const rows = [];
for (const ch of story.chapters || story) {
	for (const en of ch.entries || []) {
		const eid = `${ch.id}-${slug(en.title)}`;
		const score = new Map();
		speakers(en.blocks, score);
		const cast = [...score.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8)
			.map(([id, n]) => `${id}:${n}`);
		rows.push({
			eid,
			title: en.title,
			sub: en.subtitle || '',
			thumb: en.thumbnail || '',
			hasThumb: !!en.thumbnail,
			poster: hasPoster(eid),
			log: (en.logline?.en || '').slice(0, 120),
			cast: cast.join(', ')
		});
	}
}

const missing = rows.filter((r) => r.hasThumb && !r.poster);
const orphan = Object.keys(cat).filter((k) => !rows.some((r) => r.eid === k || LEGACY[r.eid] === k));
console.log(
	JSON.stringify(
		{
			total: rows.length,
			thumb: rows.filter((r) => r.hasThumb).length,
			poster: rows.filter((r) => r.poster).length,
			thumbNoPoster: missing.length,
			orphanCatalog: orphan,
			missing: missing.map((r) => `${r.eid} | ${r.title} | ${r.cast} | ${r.log}`)
		},
		null,
		2
	)
);
