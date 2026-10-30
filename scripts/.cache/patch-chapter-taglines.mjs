/** Sync episode taglines to the painted wordmarks, plus Hyukgose / Talhae / Alji. */
import { editStory } from './story-ops.mjs';

/** @type {Record<string, { tagline: string; taglineKo: string }>} */
const TAGLINES = {
	Sadaham: { tagline: 'Legend of the Hwarang', taglineKo: '화랑의 전설' },
	Momal: { tagline: 'Flame of Hope', taglineKo: '희망의 불꽃' },
	Jolbon: { tagline: 'Founder of Goguryeo', taglineKo: '고구려의 시조' },
	Onjo: { tagline: '& The 10 Vassals', taglineKo: '십제' },
	Bihyung: { tagline: 'Ghost Boy', taglineKo: '귀신 아이' },
	'Kim Yongsu': { tagline: 'The Truth', taglineKo: '참말' },
	Suro: { tagline: 'Son of the Sky', taglineKo: '하늘의 아들' },
	Muryuk: { tagline: 'The Last Prince', taglineKo: '마지막 왕자' },
	Seohyun: { tagline: 'Love & Valor', taglineKo: '사랑과 용맹' },
	Sunchung: { tagline: 'Final Blood', taglineKo: '마지막 피' },
	Hungsu: { tagline: 'Ten Years', taglineKo: '십 년' },
	Gyebek: { tagline: 'Hundred Victories', taglineKo: '백전백승' },
	Kangrim: { tagline: 'The Grim Reaper', taglineKo: '저승사자' },
	Hallakgungi: { tagline: 'The Gardener', taglineKo: '정원사' },
	'Heaven–Earth King': { tagline: 'A Tamla Tale', taglineKo: '탐라 이야기' },
	'Park Hyukgosé': { tagline: 'A New Hatchling', taglineKo: '갓 깬 알' },
	Talhae: { tagline: 'The Iron Man', taglineKo: '철인' },
	Alji: { tagline: 'The Golden Boy', taglineKo: '금동자' }
};

function place(entry, tagline, taglineKo) {
	const rest = { ...entry };
	delete rest.tagline;
	delete rest.taglineKo;
	const out = {};
	let placed = false;
	for (const [k, v] of Object.entries(rest)) {
		out[k] = v;
		if (!placed && (k === 'subtitle' || k === 'title')) {
			out.tagline = tagline;
			out.taglineKo = taglineKo;
			placed = true;
		}
	}
	if (!placed) {
		out.tagline = tagline;
		out.taglineKo = taglineKo;
	}
	return out;
}

editStory((story) => {
	const seen = new Set();
	for (const ch of story) {
		ch.entries = ch.entries.map((e) => {
			const t = TAGLINES[e.title];
			if (!t) return e;
			seen.add(e.title);
			return place(e, t.tagline, t.taglineKo);
		});
	}
	const missing = Object.keys(TAGLINES).filter((k) => !seen.has(k));
	if (missing.length) throw new Error(`missing titles: ${missing.join(', ')}`);
	console.log(`wrote ${seen.size} official taglines`);
});
