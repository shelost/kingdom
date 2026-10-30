// West/East conceit: China/Sui -> the West/서국, Japan/Yamato/Wa -> the East/동국.
// Skips quotes (verbatim), prompts (art anchors), sources, ids, hanja, urls,
// filenames, org/side codes, music, aliases. `at` anchors get the same rules
// so stills stay attached to their beats.
import fs from 'node:fs';

const NOUN =
	'soldiers?|ships?|fleet|fleets|army|armies|courts?|emperors?|generals?|officer\u2019s|officers?|officials?|robes?|silks?|coats?|dress(?:es)?|garrisons?|camps?|campfires?|lines?|sides?|walls?|prisoners?|priests?|sutras?|codes?|laws?|keels?|sails?|compan(?:y|ies)|banners?|part(?:y|ies)|envelopes?|historians?|histor(?:y|ies)|princes?|princess(?:es)?|capitals?|governors?|stonecutters?|brushwork|squads?|men|women|people|envoys?|troops?|works?|days?|boats?|decks?|hulls?|horses?|riders?|cavalr(?:y|ies)|infantr(?:y|ies)|archers?|crossbows?|arrows?|bows?|swords?|seals?|edicts?|letters?|harbours?|harbors?|maps?|calendars?|clerks?|scouts?|monks?|colonels?|adjutants?|titles?|foot|flagship|flagships|halls?|books?|transports?|tower-ships?|vessels?|blades?|victor(?:y|ies)|warriors?|tailors?|wi(?:fe|ves)|centres?|centers?|accents?|chronicles?|guards?|imperial|royal|yellow|gold|golden|verses?|poetr(?:y|ies)|proses?|songs?|music|classics|letters?|vassals?|hosts?|wars?|drills?';
const YNOUN =
	'courts?|ships?|fleets?|men|guards?|chronicles?|captains?|harbours?|harbors?|halls?|emperors?|envoys?|soldiers?|warriors?|boats?|princes?|princess(?:es)?|kings?|people|troops?|arm(?:y|ies)|generals?|officers?|officials?|tailors?|wi(?:fe|ves)|centres?|centers?|accents?|garrisons?|camps?|banners?|commanders?|sieges?|priestess(?:es)?|hosts?|wars?|drills?';
const SNOUN =
	'arm(?:y|ies)|banners?|flags?|hosts?|soldiers?|courts?|emperors?|fleets?|generals?|ships?|camps?|envoys?|wars?|drills?';
// Adjective-repair lists: nouns that followed the anaphoric bare country sense
// ('the West books' -> 'the Western books').
const ADJNOUN =
	'books?|classics|letters?|vassals?|tongues?|customs?|tales?|verses?|poetr(?:y|ies)|proses?|songs?|music|histor(?:y|ies)|chronicles?|envelopes?|works?|maps?|calendars?|seals?|brushwork|foot';
const EADJNOUN =
	'wives|priestess(?:es)?|boats?|harbour|men|captains?|warriors?|ships?|tongues?|customs?|tales?|books?|classics|verses?|songs?|music';

const R = (s, f) => new RegExp(s, f);

// Repair pass first: fix lines broken by the earlier run's dead lookahead rules.
const REPAIR = [
	[R('[Tt]he the (West|East|Western|Eastern|Westerners|Easterners)\\b', 'g'), 'the $1'],
	[R('[Aa] the (West|East|Western|Eastern)\\b', 'g'), 'the $1'],
	[R('the West (?=(?:' + NOUN + ')\\b)', 'g'), 'the Western '],
	[R('the East (?=(?:' + YNOUN + ')\\b)', 'g'), 'the Eastern '],
	[R('Westerners (?=(?:' + NOUN + ')\\b)', 'g'), 'Western '],
	[R('Westerner (?=(?:' + NOUN + ')\\b)', 'g'), 'Western '],
	[R('Easterners (?=(?:' + YNOUN + ')\\b)', 'g'), 'Eastern '],
	[R('Easterner (?=(?:' + YNOUN + ')\\b)', 'g'), 'Eastern ']
];

const EN_RULES = [
	[/Su Dingfang/g, '§SUDINGFANG§'],
	[/Jiu Tangshu/g, '§JIU§'],
	[/Xin Tangshu/g, '§XIN§'],
	[/Zizhi Tongjian/g, '§ZZTJ§'],
	[/pro-Tang/g, 'pro-West'],
	[/[Tt]he Great Tang/g, 'the great West'],
	[R('\\b([Aa]) Tang (?=(?:' + NOUN + ')\\b)', 'g'), '$1 Western '],
	[R('\\bthe Tang (?=(?:' + NOUN + ')\\b)', 'g'), 'the Western '],
	[/\bthe Tang\b/g, 'the West'],
	[/\bTang\u2019s\b/g, 'the West\u2019s'],
	[/\bTang's\b/g, "the West's"],
	[R('\\bTang (?=(?:Taizong|Gaozong|Gaozu|Chang\'an|Daming|Zhenguan)\\b)', 'g'), 'Western '],
	[R('\\bTang (?=(?:' + NOUN + ')\\b)', 'g'), 'Western '],
	[/Tang(?=[\u2013\u2014-])/g, 'West'],
	[/—Tang\b/g, '—West'],
	[/\bTang\b/g, 'the West'],
	[/\ba the West\b/g, 'the West'],
	[/\bthe the West\b/g, 'the West'],
	[/\bthe Chinese\b(?!\s+[a-z])/g, 'the Westerners'],
	// REPAIR: anaphoric bare → adjectival before known nouns
	[R('\\b[Tt]he [Ww]est (?=(?:' + NOUN + ')\\b)', 'g'), 'the Western '],
	[R('\\b[Tt]he [Ee]ast (?=(?:' + YNOUN + ')\\b)', 'g'), 'the Eastern '],
	[R('\\b[Ww]esterners? (?=(?:' + ADJNOUN + ')\\b)', 'g'), 'Western '],
	[R('\\b[Ee]asterners? (?=(?:' + EADJNOUN + ')\\b)', 'g'), 'Eastern '],
	// REPAIR: doubled articles from case variants
	[/\b[Aa] the (West|East|Western|Eastern|Westerners?|Easterners?)\b/g, 'the $1'],
	[/\b[Tt]he the (West|East|Western|Eastern|Westerners?|Easterners?)\b/g, 'the $1'],
	[/\ba the Western\b/g, 'the Western'],
	[/\bthe the Western\b/g, 'the Western'],
	[/\ba Chinese\b(?!\s+[a-z])/g, 'a Westerner'],
	[/\bChinese\b/g, 'Western'],
	[/\bChina\b/g, 'the West'],
	[/\bthe Japanese\b(?!\s+[a-z])/g, 'the Easterners'],
	[/\bJapanese\b/g, 'Eastern'],
	[/\bJapan\b/g, 'the East'],
	[R('\\bthe Yamato (?=(?:' + YNOUN + ')\\b)', 'g'), 'the Eastern '],
	[R('\\bYamato (?=(?:' + YNOUN + ')\\b)', 'g'), 'Eastern '],
	[/\bYamato\u2019s\b/g, 'the East\u2019s'],
	[/\bYamato's\b/g, "the East's"],
	[/\bYamato\b/g, 'the East'],
	[/\bmen of Wa\b/g, 'men of the East'],
	[/\bmountains of Wa\b/g, 'mountains of the East'],
	[/\bpeople from Wa\b/g, 'people from the East'],
	[/\bfrom Wa\b/g, 'from the East'],
	[/\bbeyond Wa\b/g, 'beyond the East'],
	[/\bof Wa\b/g, 'of the East'],
	[R('\\bWa (?=(?:' + YNOUN + ')\\b)', 'g'), 'Eastern '],
	[/\bthe Wa\b/g, 'the Easterners'],
	[/\bWa\b/g, 'the East'],
	[R('\\bthe Sui (?=(?:' + SNOUN + ')\\b)', 'g'), 'the Western '],
	[R('\\bSui (?=(?:' + SNOUN + ')\\b)', 'g'), 'Western '],
	[/\bSui\u2019s\b/g, 'the West\u2019s'],
	[/\bSui's\b/g, "the West's"],
	[/\bSui\b/g, 'the West'],
	[/§SUDINGFANG§/g, 'Su Dingfang'],
	[/§JIU§/g, 'Jiu Tangshu'],
	[/§XIN§/g, 'Xin Tangshu'],
	[/§ZZTJ§/g, 'Zizhi Tongjian'],
	// FOSSIL REPAIR (runs last): quantifier + stray article, collective
	// subjects, and sentence-initial case left by earlier runs.
	[(/(\\b[Oo]ne|\b[Tt]wo|\b[Tt]hree|\b[Ff]our|\b[Ff]ive|\b[Ss]ix|\b[Ss]even|\b[Ee]ight|\b[Nn]ine|\b[Tt]en|\b[Ee]leven|\b[Tt]welve|\b[Hh]undred|\b[Tt]housand|\b[Mm]yriad|\b[Dd]ozen|\b[Ss]core|\b[Ff]orty|\b[Ff]ifty|\b[Ss]ixty|\b[Ss]eventy|\b[Ee]ighty|\b[Nn]inety|\b[Ss]ingle|\b[Dd]ouble|\b[Tt]riple|\b[Mm]assive) the (West|East|Western|Eastern)\b/g),
		(m, q, w) => q + ' ' + (w === 'West' ? 'Western' : w === 'East' ? 'Eastern' : w)],
	[/([–—-])the (West|East|Western|Eastern)\b/g, (m, d, w) => d + (w === 'West' ? 'Western' : w === 'East' ? 'Eastern' : w)],
	[/the Tang turn for home/g, 'the Westerners turn for home'],
	[/At Sukmun the West turn around/g, 'At Sukmun the Westerners turn around'],
	[/From Han the West, by way of/g, 'From the West\u2019s Han lands, by way of'],
	[/([.!?…]["'”’]?\s+)the (?=(?:West|East|Western|Eastern|Westerners?|Easterners?)\b)/g, '$1The '],
	[/^the (?=(?:West|East|Western|Eastern|Westerners?|Easterners?)\b)/gm, 'The ']
];

const KO_RULES = [
	[/야마토 조정/g, '동조정'],
	[/왜 조정/g, '동조정'],
	[/야마토의 천황/g, '동국의 천황'],
	[/야마토 항구/g, '동국 항구'],
	[/야마토/g, '동국'],
	[/당나라 장수/g, '서국 장수'],
	[/당나라 병사/g, '서국 병사'],
	[/당나라 관리/g, '서국 관리'],
	[/당나라 사신/g, '서국 사신'],
	[/당나라/g, '서국'],
	[/대당/g, '대서국'],
	[/친당/g, '친서'],
	[/당 황제/g, '서국 황제'],
	[/당황제/g, '서국 황제'],
	[/당 조정/g, '서조정'],
	[/당조정/g, '서조정'],
	[/당군/g, '서군'],
	[/당병/g, '서병'],
	[/당 율령/g, '서 율령'],
	[/당률/g, '서율'],
	[/당의/g, '서국의'],
	[/(?<![가-힣A-Za-z])당(?![가-힣A-Za-z])/g, '서국'],
	[/왜병/g, '동병'],
	[/왜군/g, '동군'],
	[/왜장/g, '동장'],
	[/왜적/g, '동적'],
	[/왜인/g, '동인'],
	[/왜놈/g, '동놈'],
	[/왜(?=[가은는도의로과와에에서보다까지만너머])/g, '동국'],
	[/중국의/g, '서국의'],
	[/중국/g, '서국'],
	[/일본/g, '동국'],
	[/수나라/g, '서국']
];

function en(s) {
	for (const [re, to] of EN_RULES) s = s.replace(re, to);
	return s;
}
function ko(s) {
	for (const [re, to] of KO_RULES) s = s.replace(re, to);
	return s;
}

// Apply KO rules to Korean text and EN rules to English text. A field with
// mixed content gets all three passes (repair first); each pass only matches
// its own script.
function B(s) {
	if (typeof s !== 'string') return s;
	let out = s;
	for (const [re, to] of REPAIR) out = out.replace(re, to);
	const k2 = ko(out);
	const e2 = en(k2);
	return e2;
}

let changed = 0;
function Bec(s) {
	const out = B(s);
	if (out !== s) changed++;
	return out;
}

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
function walkBlocks(bs) {
	for (const b of bs) {
		if (!b || typeof b !== 'object') continue;
		if (b.kind === 'quote') continue;
		if (b.kind === 'p') {
			b.html = Bec(b.html);
			if (b.ko) b.ko = Bec(b.ko);
		} else if (b.kind === 'dialogue') {
			if (b.en) b.en = b.en.map(Bec);
			if (b.lines) b.lines = b.lines.map(Bec);
		} else if (b.kind === 'scene' || b.kind === 'day') {
			b.label = Bec(b.label);
			if (b.ko) b.ko = Bec(b.ko);
		} else if (b.kind === 'map') {
			if (b.title) b.title = Bec(b.title);
			if (b.caption) b.caption = Bec(b.caption);
			if (b.ko) b.ko = Bec(b.ko);
		} else if (b.kind === 'card' || b.kind === 'monologue' || b.kind === 'moral') {
			if (b.caption) b.caption = Bec(b.caption);
			if (b.html) b.html = Bec(b.html);
			if (b.ko) b.ko = Bec(b.ko);
		} else if (b.kind === 'term' || b.kind === 'place') {
			if (b.html) b.html = Bec(b.html);
			if (b.ko) b.ko = Bec(b.ko);
		} else if (b.kind === 'poem') {
			if (b.title) b.title = Bec(b.title);
		} else if (b.kind === 'table') {
			if (b.head) b.head = b.head.map(Bec);
			if (b.rows) b.rows = b.rows.map((r) => r.map(Bec));
		} else if (b.kind === 'formation') {
			if (b.title) b.title = Bec(b.title);
			for (const s of b.sides || []) {
				if (s.name) s.name = Bec(s.name);
				for (const u of s.units || []) {
					if (u.label) u.label = Bec(u.label);
					if (u.sub) u.sub = Bec(u.sub);
				}
			}
		} else if (b.kind === 'flashback') {
			walkBlocks(b.blocks || []);
		}
		if (typeof b.speaker === 'string') b.speaker = Bec(b.speaker);
		if (typeof b.art === 'string') b.art = Bec(b.art);
		if (b.logline) {
			if (b.logline.en) b.logline.en = Bec(b.logline.en);
			if (b.logline.ko) b.logline.ko = Bec(b.logline.ko);
		}
	}
}
function walkEntries(chs) {
	for (const ch of chs) {
		for (const e of ch.entries || []) {
			if (e.logline) {
				if (e.logline.en) e.logline.en = Bec(e.logline.en);
				if (e.logline.ko) e.logline.ko = Bec(e.logline.ko);
			}
			for (const im of e.images || []) {
				if (im.alt) im.alt = Bec(im.alt);
				if (im.at) im.at = Bec(im.at);
				if (im.say && typeof im.say === 'object') {
					if (im.say.en) im.say.en = Bec(im.say.en);
					if (im.say.ko) im.say.ko = Bec(im.say.ko);
				}
			}
			walkBlocks(e.blocks || []);
		}
		for (const k of Object.keys(ch)) {
			const v = ch[k];
			if (Array.isArray(v) && k !== 'entries') {
				for (const x of v) if (x && x.entries) walkEntries([x]);
			}
		}
	}
}
walkEntries(Array.isArray(story) ? story : story.chapters);
fs.writeFileSync('src/lib/data/story.json', JSON.stringify(story, null, '\t') + '\n');
console.log('story fields changed:', changed);

// ---- TS prose files: line-based, skipping structural/verbatim keys ----
const SKIP_KEY =
	/(^\s*(?:quote|hanja|id|avatar|flag|src|url|music|aliases|org|reportsTo|side|kind|entity|kingdom)\s*:|reportsTo:|image-people|import |export (?:const|function|interface|type)|label: '(?:Tang|Yamato)'|Modern-gloss political affiliation)/;
for (const f of ['src/lib/people.ts', 'src/lib/places.ts', 'src/lib/animals.ts', 'src/lib/phrases.ts']) {
	const lines = fs.readFileSync(f, 'utf8').split('\n');
	let n = 0;
	const out = lines.map((ln) => {
		if (SKIP_KEY.test(ln)) return ln;
		const t2 = B(ln);
		if (t2 !== ln) n++;
		return t2;
	});
	fs.writeFileSync(f, out.join('\n'));
	console.log(f, 'lines changed:', n);
}

// ---- mapRoutes.ts: only label/ko/note lines ----
{
	const f = 'src/lib/mapRoutes.ts';
	const lines = fs.readFileSync(f, 'utf8').split('\n');
	let n = 0;
	const out = lines.map((ln) => {
		if (!/^\s*(?:label|ko|note)\s*:/.test(ln)) return ln;
		const t2 = B(ln);
		if (t2 !== ln) n++;
		return t2;
	});
	fs.writeFileSync(f, out.join('\n'));
	console.log(f, 'lines changed:', n);
}
