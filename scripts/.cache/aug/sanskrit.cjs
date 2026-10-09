// Sutra quotes: the Indic original (Sanskrit, or Pali for the Dhammapada) beside the Chinese.
// node scripts/.cache/aug/sanskrit.cjs [--dry]
const { entries, log, finish } = require('./lib.cjs');

/** IAST (Sanskrit / Pali) to Devanagari. */
function devanagari(iast) {
	const V = { a: 'अ', ā: 'आ', i: 'इ', ī: 'ई', u: 'उ', ū: 'ऊ', ṛ: 'ऋ', ṝ: 'ॠ', ḷ: 'ऌ', e: 'ए', ai: 'ऐ', o: 'ओ', au: 'औ' };
	const M = { a: '', ā: 'ा', i: 'ि', ī: 'ी', u: 'ु', ū: 'ू', ṛ: 'ृ', ṝ: 'ॄ', ḷ: 'ॢ', e: 'े', ai: 'ै', o: 'ो', au: 'ौ' };
	const C = {
		kh: 'ख', gh: 'घ', ch: 'छ', jh: 'झ', ṭh: 'ठ', ḍh: 'ढ', th: 'थ', dh: 'ध', ph: 'फ', bh: 'भ',
		k: 'क', g: 'ग', ṅ: 'ङ', c: 'च', j: 'ज', ñ: 'ञ', ṭ: 'ट', ḍ: 'ड', ṇ: 'ण', t: 'त', d: 'द', n: 'न',
		p: 'प', b: 'ब', m: 'म', y: 'य', r: 'र', l: 'ल', ḷ: 'ळ', v: 'व', ś: 'श', ṣ: 'ष', s: 'स', h: 'ह'
	};
	const VIRAMA = '्';
	const text = iast.normalize('NFC').toLowerCase().replace(/’|'/g, 'ऽ');
	let out = '';
	let i = 0;
	const take = (table) => {
		for (const len of [2, 1]) {
			const key = text.slice(i, i + len);
			if (table[key] !== undefined) {
				i += len;
				return table[key];
			}
		}
		return undefined;
	};
	while (i < text.length) {
		const consonant = take(C);
		if (consonant !== undefined) {
			out += consonant;
			const vowel = take(M);
			if (vowel === undefined) out += VIRAMA;
			else out += vowel;
			continue;
		}
		const vowel = take(V);
		if (vowel !== undefined) {
			out += vowel;
			continue;
		}
		const ch = text[i++];
		out += ch === 'ṃ' ? 'ं' : ch === 'ḥ' ? 'ः' : ch === '|' ? '।' : ch;
	}
	// A word ending in a bare consonant is written joined to the next word.
	const MATRA = { अ: '', आ: 'ा', इ: 'ि', ई: 'ी', उ: 'ु', ऊ: 'ू', ऋ: 'ृ', ए: 'े', ऐ: 'ै', ओ: 'ो', औ: 'ौ' };
	return out
		.replace(/।।/g, '॥')
		.replace(/्\s([अआइईउऊऋएऐओऔ])/g, (_, v) => MATRA[v])
		.replace(/्\s(?=[\u0915-\u0939])/g, '्');
}

const ORIGINALS = [
	{
		match: /Devadatta \(提婆達多品\)/,
		lang: 'sa',
		cite: 'Sanskrit: Saddharmapuṇḍarīka ch. 11, Stūpasaṃdarśana-parivarta (Vaidya ed.)',
		latn: 'samyaksaṃbuddhatvaṃ tu durlabham | … pañca sthānāni strī adyāpi na prāpnoti | … yady ahaṃ bhadanta śāriputra maharddhikī syām, śīghrataraṃ samyaksaṃbodhim abhisaṃbudhyeyam |'
	},
	{
		match: /Nirvana Sutra \(大般涅槃經\) fasc\. 14/,
		lang: 'sa',
		cite: 'Sanskrit: the same verse in the Mahāparinirvāṇasūtra (Waldschmidt ed.)',
		latn: 'anityā bata saṃskārā utpādavyayadharmiṇaḥ | utpadya hi nirudhyante teṣāṃ vyupaśamaḥ sukham ||'
	},
	{
		match: /Dhammapada \(法句經\) ch\. 9/,
		lang: 'pi',
		cite: 'Pali: Dhammapada 1, Yamakavagga',
		latn: 'manopubbaṅgamā dhammā manoseṭṭhā manomayā | manasā ce paduṭṭhena bhāsati vā karoti vā | tato naṃ dukkham anveti cakkaṃ va vahato padaṃ ||'
	},
	{
		match: /Vimalakīrti Sutra \(維摩詰所說經\) ch\. 5/,
		lang: 'sa',
		cite: 'Sanskrit: Vimalakīrtinirdeśa 4.6 (Study Group on Buddhist Sanskrit Literature ed.)',
		latn: 'yāvacciram upādāya mañjuśrīḥ avidyā bhavatṛṣṇā ca tāvacciram upādāya mamaiṣa vyādhiḥ | yadā ca sarvasatvā vigatavyādhayo bhaviṣyanti tadā mama vyādhiḥ praśrabdho bhaviṣyati |'
	},
	{
		match: /Dhammapada \(法句經\) ch\. 18/,
		lang: 'pi',
		cite: 'Pali: Dhammapada 129, Daṇḍavagga',
		latn: 'sabbe tasanti daṇḍassa sabbe bhāyanti maccuno | attānaṃ upamaṃ katvā na haneyya na ghātaye ||'
	},
	{
		match: /Lotus Sutra \(妙法蓮華經\) ch\. 3, Parable/,
		lang: 'sa',
		cite: 'Sanskrit: Saddharmapuṇḍarīka 3.86, Aupamya-parivarta (Vaidya ed.)',
		latn: 'traidhātukaṃ co yatha tan niveśanaṃ subhairavaṃ duḥkhaśatābhikīrṇam | aśeṣataḥ prajvalitaṃ samantāj jātījarāvyādhiśatair anekaiḥ ||'
	}
];

for (const e of entries) {
	const walk = (blocks) =>
		blocks.forEach((b) => {
			if (b.blocks) walk(b.blocks);
			if (b.kind !== 'quote' || b.native) return;
			const o = ORIGINALS.find((x) => x.match.test(b.source));
			if (!o) return;
			b.native = devanagari(o.latn);
			b.nativeLang = o.lang;
			b.nativeLatn = o.latn;
			if (!b.source.includes(o.cite)) b.source = `${b.source} · ${o.cite}`;
			log.push(`~ ${e.title}: ${o.cite}\n    ${b.native}`);
		});
	walk(e.blocks);
}

finish();
