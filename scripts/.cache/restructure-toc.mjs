// node scripts/.cache/restructure-toc.mjs [--dry]
// One-shot TOC restructure: split / merge / rename / move / reorder story.json entries,
// carry each image with the block it was anchored to, then rewrite the episode-id aliases
// (reading.svelte.ts) and movie-sequence entry titles (movieSequences.ts).
import fs from 'node:fs';
import * as X from './toc-prose.mjs';

const DRY = process.argv.includes('--dry');
const STORY = 'src/lib/data/story.json';
const BACKUP = 'scripts/.cache/prev-stills/story.pre-toc-restructure.json';
const READING = 'src/lib/reading.svelte.ts';
const SEQUENCES = 'src/lib/movieSequences.ts';

const raw = fs.readFileSync(STORY, 'utf8');
const story = JSON.parse(raw);
if (!story.some((c) => c.id === 'jumong')) {
	console.log('story.json is already restructured — nothing to do.');
	process.exit(0);
}
if (!DRY && !fs.existsSync(BACKUP)) fs.writeFileSync(BACKUP, raw);

// ——— slugs (mirror of entrySlug in src/lib/story.ts) ———
const RR_INITIAL = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const RR_MEDIAL = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const RR_FINAL = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
const romanizeHangul = (s) =>
	s.replace(/[\uac00-\ud7a3]/g, (ch) => {
		const n = ch.charCodeAt(0) - 0xac00;
		return RR_INITIAL[Math.floor(n / 588)] + RR_MEDIAL[Math.floor((n % 588) / 28)] + RR_FINAL[n % 28];
	});
const entrySlug = (title) =>
	romanizeHangul(title)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
const entryId = (chapterId, title) => `${chapterId}-${entrySlug(title)}`;

// ——— anchors (mirror of textOf in src/lib/beats.ts) ———
function textOf(b) {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return b.lines.join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + (b.after ?? '');
		case 'flashback':
			return (b.title ?? '') + ' ' + (b.year ?? '') + ' ' + b.blocks.map(textOf).join(' ');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'day':
		case 'scene':
			return [b.label, b.ko].filter(Boolean).join(' ');
		case 'formation':
			return [b.title, b.note].filter(Boolean).join(' ');
		default:
			return '';
	}
}
const findAnchor = (blocks, at) => {
	const needle = at.trim().toLowerCase();
	return blocks.findIndex((b) => textOf(b).toLowerCase().includes(needle));
};
const descendants = (b) => (b.kind === 'flashback' ? b.blocks.flatMap((x) => [x, ...descendants(x)]) : []);
const contains = (outer, inner) => outer === inner || descendants(outer).includes(inner);

// ——— place map (title-keyed today; moves onto entries) ———
const placesSrc = fs.readFileSync('src/lib/places.ts', 'utf8');
const epStart = placesSrc.indexOf('export const ENTRY_PLACE');
const ENTRY_PLACE = {};
if (epStart >= 0) {
	const body = placesSrc.slice(epStart, placesSrc.indexOf('\n};', epStart));
	for (const m of body.matchAll(/^\t(?:'((?:[^'\\]|\\.)*)'|"([^"]*)"|([A-Za-z]+)): '([a-z_]+)',?$/gm)) {
		const key = (m[1] ?? m[2] ?? m[3]).replace(/\\u2019/g, '’').replace(/\\'/g, "'");
		ENTRY_PLACE[key] = m[4];
	}
}

// ——— index the old story ———
const oldEntries = new Map(); // title → { ch, en }
for (const ch of story) {
	for (const en of ch.entries) {
		if (oldEntries.has(en.title)) throw new Error(`duplicate title ${en.title}`);
		oldEntries.set(en.title, { ch, en });
	}
}
const E = (title) => {
	const hit = oldEntries.get(title);
	if (!hit) throw new Error(`missing entry: ${title}`);
	return hit.en;
};
const blockOwner = new Map(); // every original block (and flashback descendant) → source entry
for (const { en } of oldEntries.values()) {
	for (const b of en.blocks) for (const x of [b, ...descendants(b)]) blockOwner.set(x, en);
}
const expected = new Map(); // image → original anchor block (null = opening art)
for (const { en } of oldEntries.values()) {
	for (const im of en.images ?? []) {
		if (!im.at) expected.set(im, null);
		else {
			const i = findAnchor(en.blocks, im.at);
			expected.set(im, i < 0 ? null : en.blocks[i]);
		}
	}
}
const chipByPerson = (() => {
	const tally = new Map();
	const walk = (blocks) => {
		for (const b of blocks) {
			if (b.kind === 'dialogue' && b.person && b.chip) {
				const t = tally.get(b.person) ?? new Map();
				t.set(b.chip, (t.get(b.chip) ?? 0) + 1);
				tally.set(b.person, t);
			}
			if (b.kind === 'flashback') walk(b.blocks);
		}
	};
	for (const { en } of oldEntries.values()) walk(en.blocks);
	return new Map([...tally].map(([p, t]) => [p, [...t].sort((a, b) => b[1] - a[1])[0][0]]));
})();

// ——— block pickers and in-place edits ———
const R = (title, a, b) => {
	const blocks = E(title).blocks;
	const end = b ?? blocks.length - 1;
	if (a > end || end >= blocks.length) throw new Error(`bad range ${title} ${a}-${end}`);
	return blocks.slice(a, end + 1);
};
const I = (title, ...idx) =>
	idx.map((i) => {
		const b = E(title).blocks[i];
		if (!b) throw new Error(`bad index ${title} ${i}`);
		return b;
	});
const ALL = (title) => E(title).blocks.slice();
const setP = (block, { html, ko }) => Object.assign(block, { html, ko });
const setD = (block, { en, lines }) => Object.assign(block, { en, lines });
function swap(block, [enOld, enNew], [koOld, koNew], enKey = 'html', koKey = 'ko') {
	const get = (k) => (Array.isArray(block[k]) ? block[k].join('\u0000') : block[k]);
	const put = (k, v) => (block[k] = Array.isArray(block[k]) ? v.split('\u0000') : v);
	if (!get(enKey).includes(enOld)) throw new Error(`swap: "${enOld}" not found`);
	if (!get(koKey).includes(koOld)) throw new Error(`swap: "${koOld}" not found`);
	put(enKey, get(enKey).replace(enOld, enNew));
	put(koKey, get(koKey).replace(koOld, koNew));
}
const flashbackOf = (title, label) => {
	const src = E(title);
	return { kind: 'flashback', title: label, year: src.year, blocks: src.blocks.slice() };
};

// ——— builders ———
const used = new Set();
const usedDeep = new Set();
const claimed = new Set(); // source entries whose opening art has been placed
const placedImages = new Set();
const META_SKIP = new Set(['blocks', 'images', 'title', 'kind', 'place']);

function assemble(title, blocks, { base, meta = {}, place, kind, claim = [] } = {}) {
	const src = base ? E(base) : null;
	const en = {};
	if (src) for (const [k, v] of Object.entries(src)) if (!META_SKIP.has(k)) en[k] = structuredClone(v);
	Object.assign(en, meta);
	en.title = title;
	for (const k of Object.keys(en)) if (en[k] === undefined) delete en[k];

	const flat = blocks.flat();
	for (const b of flat) {
		if (used.has(b)) throw new Error(`${title}: block used twice (${textOf(b).slice(0, 60)})`);
		used.add(b);
		if (b.kind === 'dialogue' && b.person && !b.chip && chipByPerson.has(b.person)) b.chip = chipByPerson.get(b.person);
	}
	const inside = new Set(flat.flatMap((b) => [b, ...descendants(b)]));
	for (const b of inside) usedDeep.add(b);
	const covers = (b) => inside.has(b) || (b.kind === 'flashback' && b.blocks.some((x) => inside.has(x)));

	const sources = [];
	for (const b of inside) {
		const owner = blockOwner.get(b);
		if (owner && !sources.includes(owner)) sources.push(owner);
	}
	for (const t of claim) if (!sources.includes(E(t))) sources.push(E(t));

	const images = [];
	for (const s of sources) {
		const takesOpening = !claimed.has(s) && (claim.includes(s.title) || covers(s.blocks[0]));
		if (takesOpening) claimed.add(s);
		for (const im of s.images ?? []) {
			const anchor = expected.get(im);
			if (anchor ? covers(anchor) : takesOpening) {
				if (placedImages.has(im)) throw new Error(`${title}: image placed twice ${im.id}`);
				placedImages.add(im);
				images.push(im);
			}
		}
	}
	en.images = images;
	en.blocks = flat;
	const placeId = place ?? (src ? ENTRY_PLACE[src.title] : undefined);
	if (placeId) en.place = placeId;
	if (kind) en.kind = kind;
	return en;
}

/** An episode that keeps all its blocks; optionally renamed, trimmed or tagged. */
function keep(oldTitle, opts = {}) {
	const src = E(oldTitle);
	const drop = new Set(opts.drop ?? []);
	return assemble(
		opts.title ?? oldTitle,
		src.blocks.filter((_, i) => !drop.has(i)),
		{ base: oldTitle, meta: opts.meta, place: opts.place, kind: opts.kind }
	);
}

// ——— prose edits on existing blocks (identity kept, so their art stays attached) ———
const J = 'Jinheung, The Crescent Moon';
setD(E(J).blocks[10], X.JINHEUNG_ELDER_1);
setD(E(J).blocks[12], X.JINHEUNG_ELDER_2);
setP(E('The Eight Great Clans').blocks[0], X.PRINCE_EUIJA_OPEN);
const hb = E('The Hwarang').blocks;
setP(hb[1], X.BUPMIN_EDITS.date);
setP(hb[2], X.BUPMIN_EDITS.intro);
setD(hb[8], X.BUPMIN_EDITS.fifteen);
setD(hb[11], X.BUPMIN_EDITS.principles);
setD(hb[12], X.BUPMIN_EDITS.retreat);
const K = 'King Euija, the 31st Eraha';
swap(E(K).blocks[63], ['Crescent Moon like a god', 'Cloud King like a god'], ['초승달을', '구름왕을'], 'en', 'lines');
swap(E(K).blocks[63], ['the Crescent Moon was', 'the Cloud King was'], ['초승달이', '구름왕이'], 'en', 'lines');
swap(E('The Severing').blocks[0], ['the Crescent Moon', 'the Cloud King'], ['<b>초승달</b>', '<b>구름왕</b>']);
swap(E('The Severing').blocks[1], ['the Crescent Moon', 'the Cloud King'], ['초승달은', '구름왕은']);
swap(E('Chunchu Goes to the East').blocks[1], ['Munhee (41)', 'Munhee (39)'], ['문희 (41)', '문희 (39)']);
setP(E('Bidam’s Rebellion').blocks[233], X.GYEOL_REMEMBERS);
setP(E('Sulmun’s Apron').blocks[0], X.SULMUN_NEXT);
Object.assign(E('Sabi Palace').blocks[23], X.UNGJIN_SCENE);
setP(E('The Bear Ford Commandery').blocks[1], X.UNGJIN_EDITS.nets);
swap(E('The Bear Ford Commandery').blocks[2], ...X.UNGJIN_EDITS.paperwork);
swap(E('The Bear Ford Commandery').blocks[5], ...X.UNGJIN_EDITS.edict);
swap(E('Your Humble Servant').blocks[9], ...X.HUMBLE_SERVANT_EDIT);
swap(E('Eastern Fortress').blocks[12], ...X.YODONG_EDIT);

// ——— The King for All ———
const QS = 'Queen Sunduk';
const G8 = 'The Eight Great Clans';
const SUM = 'The Summit';
const samhan = [
	assemble(QS, [R(QS, 0, 18), X.SUNDUK_BRIDGE, R(QS, 48)], { base: QS, kind: 'coronation' }),
	assemble('Harmony Council', [X.COUNCIL_OPEN, R(QS, 19, 47)], {
		base: QS,
		meta: { tone: 'chamber deliberation drama', subtitle: '화백회의', badges: ['flag:silla'], music: 'The Harmony Council' }
	}),
	assemble('Jinheung, the Cloud King', [R(J, 0, 8), X.JINHEUNG_BEOPUN, R(J, 9)], {
		base: J,
		meta: { subtitle: '진흥왕, <법운>', badges: ['flag:silla', '☁️'] }
	}),
	assemble('Prince Euija', [R(G8, 0, 5), X.PRINCE_EUIJA_INVESTITURE, I(G8, 41, 42), R(G8, 46, 63)], {
		base: G8,
		meta: { tone: 'palace coming-of-age', subtitle: '의자태자', badges: ['flag:baekje'] }
	}),
	assemble('Eight Great Clans', [R(G8, 6, 39), I(G8, 40, 43, 44, 45)], { base: G8 }),
	keep('Gunchogo, The Hurricane', { title: 'Gunchogo, the 13th', meta: { subtitle: '근초고왕' } }),
	assemble('Commander Yeon', [R(SUM, 0, 8), R(SUM, 43, 54), R(SUM, 9, 12)], {
		base: SUM,
		meta: { tone: 'frontier military drama', subtitle: '연 장군' },
		place: 'yeon_east'
	}),
	assemble('High Summit', [R(SUM, 13, 42), X.NAMSENG_SCENE, ALL('Birth of Namseng')], { base: SUM }),
	keep('Gwanggaeto, The Conqueror', { title: 'Gwanggaeto, the Great King', meta: { subtitle: '광개토대왕' } })
];

// ——— The Five Principles ———
const HW = 'The Hwarang';
const GW = 'Gotaso’s Wedding';
const T3 = 'Yeon’s Three Sons';
const gwb = E(GW).blocks;
const fivePrinciples = [
	assemble(
		'Bupmin',
		[hb[0], hb[1], gwb[22], R(HW, 2, 5), R(GW, 25, 28), R(HW, 6, 9), R(GW, 23, 24), R(HW, 10)],
		{ base: HW, meta: { year: '641', subtitle: '법민' } }
	),
	assemble('Gotaso', [R(GW, 0, 21), R(GW, 38, 65)], { base: GW, meta: { subtitle: '고타소' }, kind: 'love' }),
	assemble('Pumsuk', [R(GW, 66)], { base: GW, meta: { subtitle: '품석', badges: ['flag:silla', '🌙'] } }),
	assemble(
		'Chunchu & Munhee',
		[
			X.CM_SCENES.met,
			gwb[29].blocks,
			gwb[30],
			X.CM_SCENES.closed,
			gwb[31].blocks,
			X.CM_SCENES.birth,
			gwb[32].blocks,
			R(GW, 33, 37)
		],
		{
			base: GW,
			meta: {
				year: '625',
				flash: true,
				flashback: true,
				flashTone: '#fce7f3',
				tone: 'K-drama romance',
				subtitle: '춘추와 문희',
				badges: ['flag:silla']
			}
		}
	),
	assemble('Grand Academy', [R(T3, 0, 4), X.GRAND_ACADEMY], {
		base: T3,
		meta: { tone: 'academy intrigue', subtitle: '태학' },
		place: 'pyongyang'
	}),
	assemble('Stele', [R(T3, 5, 8)], { base: T3, meta: { subtitle: '광개토대왕릉비' } }),
	assemble('Dosuryu', [X.DOSURYU_OPEN, I(T3, 12, 13), X.DOSURYU_CLOSE], {
		base: T3,
		meta: { tone: 'conspiracy thriller', subtitle: '도수류' }
	}),
	assemble('King Euija', [R(K, 0, 52), X.EUIJA_PRINCES], { base: K, kind: 'coronation' }),
	assemble('Yunchung', [X.YUNCHUNG_OPEN, R(K, 53, 81), X.YUNCHUNG_CLOSE], {
		base: K,
		meta: { tone: 'war council', subtitle: '윤충' }
	}),
	keep('The Severing')
];

// ——— Iron Will ———
const ironWill = [
	keep('Not Even Human', { title: 'Gumil' }),
	keep('Maehwa'),
	keep('Siege of Daeya', { kind: 'siege' }),
	keep('Supreme Commander', { kind: 'coup' }),
	keep('Chunchu & Yeon'),
	keep('Euija & Yeon'),
	keep('Nangbi'),
	keep('Forty Fortresses', { kind: 'battle' }),
	keep('The Eastern Star')
];
const epilogue = [keep('Li Shimin, the 2nd Huangdi')];

// ——— The Seventh Invasion ———
const EOW = 'Emperor of the West';
const EF = 'Eastern Fortress';
const JM = 'Jumong';
const seventhInvasion = [
	assemble('Four Dragons', [ALL(EOW), X.LONGMEN_SCENE, ALL('Longmen Field')], { base: EOW, meta: { subtitle: '사룡' } }),
	assemble('Yodong', [R(EF, 0, 11), R(EF, 14, 18), X.YODONG_FOOTNOTE, R(EF, 12, 13)], {
		base: EF,
		meta: { subtitle: '요동성' },
		kind: 'siege'
	}),
	keep('Boiling River'),
	keep('Stallion Mountain', { kind: 'battle' }),
	keep('Great River', { title: 'Colossal River' }),
	keep('Ansi', { kind: 'siege' }),
	assemble('Haemosu', [R(JM, 0, 63)], { base: JM, meta: { subtitle: '해모수' }, place: 'buyeo_north', kind: 'love' }),
	assemble('Buyeo', [R(JM, 64, 142)], { base: JM, meta: { subtitle: '부여' }, place: 'buyeo_north' }),
	assemble('Jolbon', [R(JM, 143), X.DONGMYUNG_SCENE, ALL('Dongmyung')], {
		base: JM,
		meta: { subtitle: '졸본' },
		kind: 'love'
	})
];
const onjo = [keep('Onjo')];

// ——— The Chunchu Era ———
const BR = 'Bidam’s Rebellion';
const chunchuEra = [
	assemble('기 (起)', [ALL('Chunchu Goes to the East'), X.GI_COUNCIL, ALL('The Harmony Council'), X.GI_BRIDGE], {
		base: 'Chunchu Goes to the East',
		meta: {
			year: '645',
			sub: 'Autumn',
			subtitle: '비담의 난 · 기',
			tone: 'envoy intrigue into chamber drama',
			music: 'The Harmony Council'
		},
		place: 'surabol'
	}),
	keep('Suro', { kind: 'love' }),
	assemble('승 (承)', [R(BR, 0, 89)], { base: BR, meta: { subtitle: '비담의 난 · 승' } }),
	keep('Muryuk'),
	assemble('전 (轉)', [R(BR, 90, 174)], { base: BR, meta: { subtitle: '비담의 난 · 전' } }),
	keep('Seohyun'),
	assemble('결 (結)', [R(BR, 175, 226), R(BR, 233, 236)], { base: BR, meta: { subtitle: '비담의 난 · 결' }, kind: 'battle' }),
	assemble('Queen Jinduk', [X.JINDUK_OPEN, I(BR, 227, 228), X.JINDUK_COMPARE, R(BR, 229, 232), X.JINDUK_CLOSE], {
		base: BR,
		meta: {
			year: '647',
			sub: 'February',
			subtitle: '진덕여왕',
			tone: 'coronation drama',
			badges: ['👑', 'flag:silla'],
			music: 'The Crowning'
		},
		kind: 'coronation'
	}),
	keep('The Emperor', { title: 'Huangdi (皇帝)' }),
	keep('The Royal Secretariat', { title: 'Royal Secretariat' }),
	keep('Death of the Second Emperor', { title: 'Jiabeng (駕崩)' }),
	keep('King Muyeol', { drop: [17, 18], kind: 'coronation' }),
	keep('Harbour Ledgers', { title: 'Jahee', kind: 'love' }),
	keep('Hyukgosé', { title: 'Hyukgose', kind: 'myth' }),
	keep('Talhae', { kind: 'myth' }),
	keep('Alji', { kind: 'myth' })
];

// ——— The Fall of Euija ———
const S3P = 'Sulmun and the Three Princes';
const AP = 'Sulmun’s Apron';
const TL = 'The Three Loyalists';
const fallOfEuija = [
	assemble(
		'Exile',
		[ALL('Gyebek’s Exile'), X.EXILE_SCENES.blackRock, ALL('Black Rock'), X.EXILE_SCENES.fiveThousand, ALL('Five Thousand')],
		{ base: 'Gyebek’s Exile' }
	),
	keep('Heaven–Earth King', { kind: 'myth' }),
	assemble('Sulmun', [I(AP, 0, 1), I(S3P, 2), R(AP, 3, 8), I(S3P, 4, 5), R(AP, 9)], {
		base: AP,
		place: 'halla',
		kind: 'myth'
	}),
	assemble('Three Princes', [I(S3P, 0, 1), R(S3P, 7), X.BAEKJUTO_SCENE, ALL('Baekjuto and Socheon-guk')], {
		base: S3P,
		meta: { subtitle: '삼성혈' },
		place: 'samseonghyeol',
		kind: 'myth'
	}),
	assemble('Stone Lady', [ALL('Sanbangduk'), X.GAMEUNJANG_SCENE, ALL('Gameunjang')], {
		base: 'Sanbangduk',
		meta: { subtitle: '산방덕' },
		place: 'halla',
		kind: 'myth'
	}),
	assemble('Gardener', [X.GARDENER, X.JACHEONGBI_SCENE, ALL('Jacheongbi')], {
		base: 'Jacheongbi',
		meta: { subtitle: '할락궁이' },
		kind: 'myth'
	}),
	keep('Kangrim', { kind: 'myth' }),
	keep('The Tribute of Oranges', { title: 'Tribute', meta: { subtitle: '탐라국 조공' } }),
	keep('Euija’s Coup', { title: 'Coup', kind: 'coup' }),
	assemble('Descent', [X.DESCENT_NIGHTMARES, ALL('Euija’s Descent')], { base: 'Euija’s Descent' }),
	keep('The Nine Plagues', { title: 'Nine Omens' }),
	assemble('Sungchung', [R(TL, 1, 3), R(TL, 8, 11)], { base: TL, meta: { subtitle: '성충' }, claim: [TL] }),
	assemble('Heungsu', [R(TL, 13, 31)], { base: TL, meta: { subtitle: '흥수' } }),
	assemble('Gyebek', [ALL('The Fifth Year'), R(TL, 4, 7), R(TL, 33, 40)], { base: TL, meta: { subtitle: '계백' } })
];
const epiloguePartII = [keep('Annual Meeting of the Three Realms', { title: 'Three Realms', kind: 'myth' })];

// ——— The Fall of Baekje ———
const SP = 'Sabi Palace';
const BF = 'The Bear Ford Commandery';
const BRS = 'Baekje Restoration Society';
const fallOfBaekje = [
	assemble('Yellow Mountain', [ALL('The Red Fowl'), X.YELLOW_MOUNTAIN_SCENE, ALL('Yellow Mountain Fields')], {
		base: 'Yellow Mountain Fields',
		kind: 'battle'
	}),
	assemble('Sabi', [R(SP, 0, 22), X.SABI_NAKHWAAM, R(SP, 23)], { base: SP, meta: { subtitle: '사비성 · 웅진성' }, place: 'sabi', kind: 'siege' }),
	keep('The Death of Buyeo Euija', { title: 'Buyeo Euija†' }),
	keep('The Death of Kim Chunchu', { title: 'Kim Chunchu†' }),
	assemble('Ungjin Commandery', [I(BF, 0, 1), R(BRS, 11, 13), R(BF, 2, 10), X.UNGJIN_GAOZONG, ALL('The Four Beasts')], {
		base: BF,
		meta: { year: '661', sub: 'Autumn' },
		place: 'ungjin'
	}),
	assemble('King Pungjang', [flashbackOf('The Seven Branched Sword', 'The Seven-Branched Sword'), R(BRS, 0, 10), R(BRS, 14, 21)], {
		base: BRS,
		meta: { subtitle: '부여풍' }
	})
];

// ——— The Final Stand ———
const finalStand = [
	keep('Pyongyang', { title: 'Pyongyang I', kind: 'siege' }),
	keep('Snake River', { kind: 'battle' }),
	keep('The Surrender of Tamla', { title: 'Tamla Surrenders' }),
	assemble('Rebellion', [X.REBELLION], {
		meta: {
			year: '662',
			sub: 'August',
			accent: '#b91c1c',
			subtitle: '내사지성',
			badges: ['flag:silla', 'flag:baekje'],
			music: 'Rebellion',
			tone: 'court purge drama'
		},
		place: 'surabol',
		kind: 'coup'
	}),
	assemble('Betrayal', [X.BETRAYAL_DOCHIM, R(BRS, 22, 30)], {
		base: BRS,
		meta: {
			year: '661',
			sub: undefined,
			flash: true,
			flashback: true,
			flashTone: '#efe6d8',
			subtitle: '배신',
			tone: 'resistance tragedy',
			badges: ['flag:baekje'],
			music: 'Betrayal'
		}
	}),
	keep('White River', { kind: 'naval' }),
	keep('The Death of Yeon Gesomun', { title: 'Yeon Gesomun†' }),
	keep('The Brothers’ Coup', { title: 'Brothers’ Coup', kind: 'coup' }),
	keep('Pyongyang, A', { title: 'Pyongyang II', kind: 'siege' })
];

// ——— Silla-Tang War ———
const SG = 'Stone Gate';
const MS = 'Maeso Fortress';
const sillaTangWar = [
	assemble('Mount Gain', [R(BF, 11, 17), ALL('Mount Gain')], { base: 'Mount Gain' }),
	keep('Dangun & Old Joseon', { kind: 'love' }),
	assemble('Anseung', [R(SG, 0, 2), X.ANSEUNG_QUARREL, I(SG, 3), X.ANSEUNG_CLOSE], {
		base: SG,
		meta: { year: '670', sub: 'June', accent: undefined, subtitle: '안승', tone: 'exile court drama', badges: ['flag:goguryeo', 'flag:silla'] },
		place: 'pyongyang'
	}),
	keep('Your Humble Servant', { title: 'Betrayal' }),
	assemble('Stone Gate', [R(SG, 4, 7), R(SG, 12)], { base: SG, kind: 'battle' }),
	assemble('Wonsul', [R(SG, 8, 11), X.WONSUL_MORE], {
		base: SG,
		meta: { accent: undefined, subtitle: '원술', tone: 'family tragedy', badges: ['flag:silla'] },
		place: 'surabol'
	}),
	assemble('Kim Yushin†', [ALL('The Death of Kim Yushin'), X.JISO], { base: 'The Death of Kim Yushin' }),
	keep("The Wanggeom's Guest"),
	assemble('Inmun', [R(MS, 0, 2), X.INMUN_SHIP, I(MS, 3), X.INMUN_CLOSE], {
		base: MS,
		meta: { year: '674', sub: undefined, subtitle: '김인문', tone: 'brothers’ tragedy' },
		place: 'changan'
	}),
	assemble('Maeso', [R(MS, 4, 24), X.MAESO_WONSUL, R(MS, 25)], { base: MS, kind: 'siege' }),
	keep('Strike Harbor', { title: 'Final Ford', kind: 'naval' }),
	keep('The King for All')
];
const epilogue2 = [keep('Balhae')];

// ——— art that needs a hand ———
const allNew = [
	...samhan, ...fivePrinciples, ...ironWill, ...epilogue, ...seventhInvasion, ...onjo, ...chunchuEra,
	...fallOfEuija, ...epiloguePartII, ...fallOfBaekje, ...finalStand, ...sillaTangWar, ...epilogue2
];
const newByTitle = (title) => {
	const hits = allNew.filter((e) => e.title === title);
	if (hits.length !== 1) throw new Error(`ambiguous/missing new entry ${title}`);
	return hits[0];
};
/** Opening art that belongs to a different part of its old episode. */
const IMAGE_TO = { 'halla-goddess': 'Sulmun', 'loyalists-ship': 'Gyebek' };
/** Art whose anchor block was a dropped duplicate. */
const ORPHAN_TO = {
	'sulmun-seq-hills': ['Sulmun'],
	'sulmun-seq-silk': ['Sulmun', 'a hundred rolls of silk'],
	'stone-generals': ['Stele', 'Sixty-four fortresses are written on that rock']
};
/** Anchors rewritten with their block. */
const AT = {
	'parody-seodang-hwarang': 'which one will you break first',
	'rel-yushin-bupmin': 'Then make it true at fifteen',
	'young-princes-grown': 'lengthened twice',
	'pyre-smoke-signal': 'How They Met',
	'jumong-yuhwa-rise': 'Yuhwa has stopped',
	'chunchu-strategist': 'A country is not a score',
	'silla-moon-hall': '고려의 개소문 한 명',
	'seolmundae-ninety-nine': 'They found ninety-nine',
	'jinheung-han-turn': 'the Cloud King turns his army'
};
for (const [id, title] of Object.entries(IMAGE_TO)) {
	const from = allNew.find((e) => e.images.some((im) => im.id === id));
	if (!from) throw new Error(`IMAGE_TO: ${id} not placed`);
	const im = from.images.find((x) => x.id === id);
	from.images = from.images.filter((x) => x !== im);
	newByTitle(title).images.push(im);
}
const deleted = new Set(['Ocean Trade']);
const unplaced = [];
for (const { en } of oldEntries.values()) {
	if (deleted.has(en.title)) continue;
	for (const im of en.images ?? []) {
		if (placedImages.has(im)) continue;
		const to = ORPHAN_TO[im.id];
		if (!to) {
			unplaced.push(`${im.id} (from ${en.title}, at "${im.at}")`);
			continue;
		}
		if (to[1]) im.at = to[1];
		newByTitle(to[0]).images.push(im);
		placedImages.add(im);
	}
}
if (unplaced.length) throw new Error(`unplaced images:\n${unplaced.join('\n')}`);
for (const en of allNew) for (const im of en.images) if (AT[im.id]) im.at = AT[im.id];

// ——— verification ———
const problems = [];
for (const en of allNew) {
	for (const im of en.images) {
		if (!im.at) continue;
		const i = findAnchor(en.blocks, im.at);
		if (i < 0 && expected.get(im) === null && !AT[im.id] && !ORPHAN_TO[im.id]) continue;
		if (i < 0) {
			problems.push(`${en.title}: ${im.id} anchor not found ("${im.at}")`);
			continue;
		}
		if (AT[im.id] || ORPHAN_TO[im.id]) continue;
		const want = expected.get(im);
		const got = en.blocks[i];
		if (want && !(contains(got, want) || contains(want, got))) {
			problems.push(`${en.title}: ${im.id} drifted to block ${i} ("${textOf(got).slice(0, 50)}")`);
		}
	}
}
const dropped = [];
for (const { en } of oldEntries.values()) {
	if (deleted.has(en.title)) continue;
	en.blocks.forEach((b, i) => {
		if (!usedDeep.has(b) && !descendants(b).some((x) => usedDeep.has(x))) dropped.push(`${en.title}[${i}]`);
	});
}
console.log('dropped blocks:', dropped.join(', '));
if (problems.length) {
	console.log('ANCHOR PROBLEMS:\n' + problems.join('\n'));
	process.exit(1);
}

// ——— chapters ———
const chapterById = new Map(story.map((c) => [c.id, c]));
const layout = [
	['samhan', samhan],
	['five-principles', fivePrinciples],
	['iron-will', ironWill],
	['epilogue', epilogue],
	['seventh-invasion', seventhInvasion],
	['onjo', onjo],
	['chunchu-era', chunchuEra],
	['fall-of-euija', fallOfEuija],
	['epilogue-part-ii', epiloguePartII],
	['fall-of-baekje', fallOfBaekje],
	['final-stand', finalStand],
	['silla-tang-war', sillaTangWar],
	['epilogue-2', epilogue2]
];
const next = layout.map(([id, entries]) => {
	const ch = chapterById.get(id);
	if (!ch) throw new Error(`no chapter ${id}`);
	return { ...ch, entries };
});

// ——— old id → new id ———
const newIdOfBlock = new Map();
for (const [chId, entries] of layout) {
	for (const en of entries) for (const b of en.blocks) for (const x of [b, ...descendants(b)]) newIdOfBlock.set(x, entryId(chId, en.title));
}
const idMap = {};
for (const ch of story) {
	for (const en of ch.entries) {
		const from = entryId(ch.id, en.title);
		const to = deleted.has(en.title) ? entryId('samhan', 'Gunchogo, the 13th') : newIdOfBlock.get(en.blocks[0]) ?? newIdOfBlock.get(en.blocks.find((b) => newIdOfBlock.has(b)));
		if (!to) throw new Error(`no new id for ${from}`);
		if (from !== to) idMap[from] = to;
	}
}
idMap['seventh-invasion-jumong'] = idMap['jumong-jumong'];
idMap['silla-tang-war-the-protectorate'] = entryId('silla-tang-war', 'Anseung');

const readingSrc = fs.readFileSync(READING, 'utf8');
const aliasRe = /const EPISODE_HASH_ALIASES: Record<string, string> = \{\n([\s\S]*?)\n\};/;
const aliasMatch = aliasRe.exec(readingSrc);
if (!aliasMatch) throw new Error('EPISODE_HASH_ALIASES not found');
const aliases = {};
for (const m of aliasMatch[1].matchAll(/'([^']+)': '([^']+)'/g)) aliases[m[1]] = m[2];
const liveIds = new Set(layout.flatMap(([chId, entries]) => entries.map((en) => entryId(chId, en.title))));
const resolveId = (id) => {
	let cur = id;
	for (let n = 0; n < 8 && !liveIds.has(cur) && (idMap[cur] || aliases[cur]); n++) cur = idMap[cur] ?? aliases[cur];
	return cur;
};
const merged = {};
for (const k of [...Object.keys(aliases), ...Object.keys(idMap)]) {
	if (liveIds.has(k)) continue;
	const v = resolveId(k);
	if (liveIds.has(v)) merged[k] = v;
	else console.log(`alias dropped (dead end): ${k} → ${v}`);
}
const aliasBody = Object.entries(merged)
	.map(([k, v]) => `\t'${k}': '${v}'`)
	.join(',\n');
const nextReading = readingSrc.replace(aliasRe, `const EPISODE_HASH_ALIASES: Record<string, string> = {\n${aliasBody}\n};`);

// ——— movie sequences follow their shots ———
const titleOfImage = new Map();
for (const en of allNew) for (const im of en.images) titleOfImage.set(im.id, en.title);
const oldToNewTitle = new Map();
for (const { en } of oldEntries.values()) {
	if (deleted.has(en.title)) continue;
	const target = allNew.find((n) => n.blocks.includes(en.blocks[0])) ?? allNew.find((n) => en.blocks.some((b) => n.blocks.includes(b)));
	if (target) oldToNewTitle.set(en.title, target.title);
}
const seqSrc = fs.readFileSync(SEQUENCES, 'utf8');
const seqParts = seqSrc.split(/(?=\n\t\{\n\t\tid: ')/);
const quote = (t) => (t.includes("'") ? `"${t}"` : `'${t}'`);
const nextSeq = seqParts
	.map((part) => {
		const m = /entryTitles: \[([^\]]*)\]/.exec(part);
		if (!m) return part;
		const shotIds = [...part.matchAll(/\n\t\t\t\tid: '([^']+)'/g)].map((x) => x[1]);
		let titles = [...new Set(shotIds.map((id) => titleOfImage.get(id)).filter(Boolean))];
		if (!titles.length) {
			const old = [...m[1].matchAll(/'((?:[^'\\]|\\.)*)'|"([^"]*)"/g)].map((x) => (x[1] ?? x[2]).replace(/\\u2019/g, '’'));
			titles = [...new Set(old.map((t) => oldToNewTitle.get(t) ?? t))];
		}
		return part.replace(m[0], `entryTitles: [${titles.map(quote).join(', ')}]`);
	})
	.join('');

// ——— report + write ———
for (const [id, entries] of layout) {
	console.log(`\n${id}`);
	for (const en of entries) {
		const opening = en.images.filter((im) => !im.at || findAnchor(en.blocks, im.at) < 0).length;
		console.log(
			`  ${entryId(id, en.title).padEnd(48)} ${String(en.blocks.length).padStart(4)} blocks ${String(en.images.length).padStart(4)} img (${opening} opening) ${en.kind ?? ''} ${en.place ?? ''}`
		);
	}
}
console.log(`\n${Object.keys(merged).length} aliases`);
if (DRY) {
	console.log('\n--dry: nothing written');
	process.exit(0);
}
fs.writeFileSync(STORY, JSON.stringify(next, null, '\t') + '\n');
fs.writeFileSync(READING, nextReading);
fs.writeFileSync(SEQUENCES, nextSeq);
console.log('\nwrote story.json, reading.svelte.ts aliases, movieSequences.ts entryTitles');
