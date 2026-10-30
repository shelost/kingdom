import { readFileSync, writeFileSync, existsSync } from 'fs';

function load(p) {
	return JSON.parse(readFileSync(p, 'utf8'));
}
function save(p, o) {
	writeFileSync(p, JSON.stringify(o, null, '\t') + '\n');
}

{
	const p = 'src/lib/data/episode-story.json';
	const j = load(p);
	const eps = j.episodes ?? j;
	const map = {
		'chunchu-era::Bihyung': 'chunchu-era::Bihyungnang',
		'chunchu-era::Yongsu': 'chunchu-era::Kim Yongsu'
	};
	for (const [oldK, newK] of Object.entries(map)) {
		if (eps[oldK]) {
			const e = eps[oldK];
			e.id = newK;
			e.title = newK.split('::')[1];
			eps[newK] = e;
			delete eps[oldK];
			console.log('story', oldK, '->', newK);
		}
	}
	save(p, j);
}

{
	const p = 'src/lib/data/episode-story-notes.json';
	const j = load(p);
	const eps = j.episodes ?? {};
	if (eps.Bihyung) {
		eps.Bihyungnang = eps.Bihyung;
		delete eps.Bihyung;
		console.log('notes Bihyungnang');
	}
	if (eps.Yongsu) {
		eps['Kim Yongsu'] = eps.Yongsu;
		delete eps.Yongsu;
		console.log('notes Kim Yongsu');
	}
	save(p, j);
}

{
	const p = 'src/lib/data/key-events.json';
	const raw = readFileSync(p, 'utf8');
	const next = raw
		.replaceAll('"ep": "Bihyung"', '"ep": "Bihyungnang"')
		.replaceAll('"ep": "Yongsu"', '"ep": "Kim Yongsu"');
	writeFileSync(p, next);
	console.log('key-events remapped');
}

{
	const p = 'src/lib/data/line-stars.json';
	const j = load(p);
	const rows = Array.isArray(j) ? j : (j.stars ?? j.lines ?? []);
	for (const row of rows) {
		if (!row || typeof row !== 'object') continue;
		if (row.episodeId === 'chunchu-era-bihyung') row.episodeId = 'chunchu-era-bihyungnang';
		if (row.entryTitle === 'Bihyung') row.entryTitle = 'Bihyungnang';
		if (row.episodeId === 'chunchu-era-yongsu') row.episodeId = 'chunchu-era-kim-yongsu';
		if (row.entryTitle === 'Yongsu') row.entryTitle = 'Kim Yongsu';
	}
	save(p, j);
	console.log('line-stars remapped');
}

{
	const p = 'scripts/.cache/episode-id-remap.json';
	if (existsSync(p)) {
		const j = load(p);
		j['chunchu-era-bihyung'] = 'chunchu-era-bihyungnang';
		j['chunchu-era-yongsu'] = 'chunchu-era-kim-yongsu';
		save(p, j);
		console.log('id-remap updated');
	}
}
