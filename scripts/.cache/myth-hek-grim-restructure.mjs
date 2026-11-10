/**
 * HEK / Grim Reaper / Three Princes / Bonpuri restructure:
 * - HEK sections: Chaos · War · Daebyul & Sobyul
 * - Grim sections: Strongest Man · Journey · Hell
 * - Move Socheon + Sanbang Rock from Three Princes → Bonpuri
 * - Daebyul / Sobyul primary naming in myth prose
 * - Flesh Grim clothes beat; flesh Three Princes sections
 * - Romanizations: Gunchogo, Jinhung, Gwanggeto (display text)
 */
import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const data = JSON.parse(readFileSync(path, 'utf8'));

function entry(title) {
	for (const ch of data) for (const e of ch.entries) if (e.title === title) return e;
	throw new Error('missing ' + title);
}

function findScene(blocks, label) {
	const i = blocks.findIndex((b) => b.kind === 'scene' && b.label === label);
	if (i < 0) throw new Error('no scene ' + label);
	return i;
}

function insertSection(blocks, at, label, ko) {
	if (blocks[at]?.kind === 'section' && blocks[at].label === label) return at;
	blocks.splice(at, 0, { kind: 'section', label, ko });
	return at;
}

function insertStory(blocks, at, label, ko) {
	if (blocks[at]?.kind === 'story' && blocks[at].label === label) return at;
	blocks.splice(at, 0, { kind: 'story', label, ko });
	return at;
}

const p = (html, ko) => ({ kind: 'p', html, ko });
const dial = (person, lines, en) => ({ kind: 'dialogue', person, lines, en });

/* ─── HEK sections ─── */
{
	const e = entry('Heaven–Earth King');
	const b = e.blocks;
	// strip prior section plates if re-run
	for (let i = b.length - 1; i >= 0; i--) {
		if (b[i].kind === 'section' && /^(Chaos|War|Daebyul)/.test(b[i].label || '')) b.splice(i, 1);
	}
	insertSection(b, findScene(b, 'Two Suns'), 'Chaos', '혼돈');
	insertSection(b, findScene(b, 'The Helmet'), 'War', '전쟁');
	insertSection(b, findScene(b, 'The Contest'), 'Daebyul & Sobyul', '대별과 소별');
	e.kinds = e.kinds || ['myth'];
}

/* ─── Grim Reaper sections + clothes flesh ─── */
{
	const e = entry('Grim Reaper');
	const b = e.blocks;
	for (let i = b.length - 1; i >= 0; i--) {
		if (b[i].kind === 'section' && /^(Strongest Man|Journey|Hell)$/.test(b[i].label || '')) b.splice(i, 1);
	}
	insertSection(b, findScene(b, 'The Pond'), 'Strongest Man', '천하장사');
	insertSection(b, findScene(b, 'The Road Down'), 'Journey', '길');
	insertSection(b, findScene(b, 'The Belt'), 'Hell', '지옥');

	// Expand Yumla-on-earth + Gimchi deal + new reaper clothes (after split, before Red Cord)
	const splitIdx = b.findIndex(
		(x) => x.kind === 'p' && /So they split him/.test(x.html || '')
	);
	if (splitIdx < 0) throw new Error('no split beat');
	const already = b.some((x) => x.kind === 'scene' && x.label === 'The Black Coat');
	if (!already) {
		const flesh = [
			p(
				'Yumla had walked the living yard in a borrowed man’s height. The magistrate’s clerks bowed because the red cord made them. Gimchi did not bow. Gimchi watched the paperwork.',
				'염라가 산 자의 키를 빌려 마당을 걸었다. 붉은 끈 때문에 아전들은 절했다. 김치는 절하지 않았다. 김치는 장부를 봤다.'
			),
			dial(
				'yumla',
				['산 자의 법으로는 못을 두 번 재판할 수 없다.', '죽은 자의 법으로는 된다.', '그 법을 쓰려면 심부름꾼이 필요하다.'],
				[
					'A living court cannot try a pond twice.',
					'A dead court can.',
					'To use that court, I need a runner.'
				]
			),
			dial(
				'gimchi',
				['나는 영혼을 안 믿소.', '믿는 건 기한뿐이오.', '가을걷이.'],
				['I do not believe in souls.', 'I believe in deadlines.', 'Harvest.']
			),
			dial(
				'kangrim',
				['날짜를 약속했습니다.', '그 날짜를 어기면, 아내가 문을 열어 두지 않습니다.'],
				['I named a date.', 'If I miss it, she will not leave the gate open.']
			),
			dial(
				'yumla',
				['몸을 남기시오.', '혼만 빌리겠소.', '장부에 찍힐 이름만.'],
				['Keep the body.', 'Lend me the soul.', 'Only the name the ledger can hold.']
			),
			dial(
				'gimchi',
				['장부에 남는 절반이 내 것이오.', '안 보이는 절반은 가져가시오.', '돌아오면… 아니.', '돌아오지 마시오.'],
				[
					'The half that files reports stays mine.',
					'Take the half I cannot see.',
					'When you come back… no.',
					'Do not come back.'
				]
			),
			p(
				'So they split him. The flower he would not spend holds the half the magistrate can see. Yumla took the other. That is how Kangrim died upstairs and woke as a fetch.',
				'그렇게 그를 갈랐다. 쓰지 않은 꽃이 원님이 볼 수 있는 절반을 붙잡는다. 염라가 나머지를 가져갔다. 강림이 위에서 죽고 차사로 깨어난 사연이다.'
			),
			{ kind: 'scene', label: 'The Black Coat', ko: '검은 옷' },
			p(
				'Yumla did not send him out in the clothes he arrived in. A strongman’s jacket still smells of the yard.',
				'염라는 그가 입고 온 옷 그대로 보내지 않았다. 천하장사 웃옷은 아직도 마당 냄새다.'
			),
			p(
				'They gave him the black coat of the road. Wide sleeves. A sash that does not loosen. A hat that hides the eyes from the living who are not ready.',
				'길의 검은 옷을 입혔다. 넓은 소매. 풀리지 않는 띠. 아직 준비 안 된 산 자의 눈을 가리는 모자.'
			),
			dial(
				'yumla',
				['이제부터 네 이름은 차사다.', '장부를 열어라.', '이름을 세 번 불러라.', '끈을 잘라라.'],
				[
					'From now your name is Chasa.',
					'Open the ledger.',
					'Say the name three times.',
					'Cut the cord.'
				]
			),
			p(
				'Kangrim put the coat on. The yard went quiet the way a room goes quiet when the lamp finds the right corner.',
				'강림이 옷을 입었다. 마당이 조용해졌다. 등불이 제자리를 찾을 때 방이 조용해지는 것과 같았다.'
			),
			p(
				'His wife buried the body. She never learned he was still walking. The shrine got fed twice after all.',
				'아내는 시신을 묻었다. 그가 아직 걷고 있다는 걸 끝내 몰랐다. 신당 상은 결국 두 번 올랐다.'
			)
		];
		// replace old split + wife bury paragraphs with fleshed sequence
		const wifeIdx = b.findIndex(
			(x, i) => i > splitIdx && x.kind === 'p' && /His wife buried the body/.test(x.html || '')
		);
		const end = wifeIdx >= 0 ? wifeIdx + 1 : splitIdx + 1;
		// keep the quiet-bowl line if present after wife
		let after = end;
		if (b[after]?.kind === 'p' && /second bowl/.test(b[after].html || '')) after++;
		b.splice(splitIdx, after - splitIdx, ...flesh);
	}
}

/* ─── Move Socheon + Sanbang Rock: Three Princes → Bonpuri ─── */
{
	const tp = entry('Three Princes');
	const bp = entry('Bonpuri');
	const start = findScene(tp.blocks, 'Bekjuto and Socheon-guk');
	const sulmunStory = tp.blocks.findIndex((x) => x.kind === 'story' && /Sulmun/i.test(x.label || ''));
	if (sulmunStory < 0) throw new Error('no Sulmun story');
	// move through the tease paragraph before Sulmun story (exclusive of story plate)
	const end = sulmunStory;
	const chunk = tp.blocks.splice(start, end - start);
	// drop the dangling "serpent / woman / look back" tease if it leads the chunk end — keep if useful in Bonpuri
	const insertAt = (() => {
		const gam = findScene(bp.blocks, 'Gamunjang');
		return gam;
	})();
	// wrap moved material in story plates
	const wrapped = [
		{ kind: 'story', label: 'Sochun', ko: '소천국' },
		...chunk.filter((x) => !(x.kind === 'p' && /serpent in a cave/i.test(x.html || ''))),
		{ kind: 'story', label: 'Sanbang', ko: '산방' }
	];
	// If Sanbangduk scene already exists earlier, the Sanbang Rock chore follows Gamunjang insert —
	// place Socheon before Gamunjang; keep Sanbangduk where it is; put Sanbang Rock chore after Sanbangduk block ends.
	const sochun = [];
	const sanbang = [];
	let mode = 'sochun';
	for (const x of wrapped) {
		if (x.kind === 'story' && x.label === 'Sanbang') {
			mode = 'sanbang';
			continue;
		}
		if (x.kind === 'story' && x.label === 'Sochun') continue;
		if (x.kind === 'scene' && x.label === 'Sanbang Rock') mode = 'sanbang';
		(mode === 'sochun' ? sochun : sanbang).push(x);
	}
	const gam = findScene(bp.blocks, 'Gamunjang');
	bp.blocks.splice(gam, 0, { kind: 'story', label: 'Sochun', ko: '소천국' }, ...sochun);
	// Sanbang Rock chore after Sanbangduk section — before Gamunjang (now shifted)
	const gam2 = findScene(bp.blocks, 'Gamunjang');
	const sanduk = findScene(bp.blocks, 'Sanbangduk');
	// insert after Sanbangduk story content ends (= before next story/scene that isn't still sanduk)
	let sandukEnd = sanduk + 1;
	while (
		sandukEnd < bp.blocks.length &&
		bp.blocks[sandukEnd].kind !== 'scene' &&
		bp.blocks[sandukEnd].kind !== 'story' &&
		bp.blocks[sandukEnd].kind !== 'section'
	) {
		sandukEnd++;
	}
	bp.blocks.splice(sandukEnd, 0, { kind: 'story', label: 'Sanbang Rock', ko: '산방산' }, ...sanbang);

	// Three Princes: add sections + flesh princes / sulmun
	for (let i = tp.blocks.length - 1; i >= 0; i--) {
		if (tp.blocks[i].kind === 'section' && /^(The Princes|Sulmun|Three Princes)/.test(tp.blocks[i].label || ''))
			tp.blocks.splice(i, 1);
	}
	insertSection(tp.blocks, findScene(tp.blocks, 'The Three Holes'), 'The Princes', '세 왕자');
	const sul = tp.blocks.findIndex((x) => x.kind === 'story' && /Sulmun/i.test(x.label || ''));
	insertSection(tp.blocks, sul, 'Sulmun', '설문대할망');

	// Intro flesh after Three Holes scene
	const holes = findScene(tp.blocks, 'The Three Holes');
	if (!tp.blocks.some((x) => x.id === 'tp-princes-intro-note' || (x.kind === 'p' && /Nobeunnae, Yangunae, and Goeulla/.test(x.html || '')))) {
		tp.blocks.splice(
			holes + 1,
			0,
			p(
				'Nobeunnae. Yangunae. Goeulla. Three princes out of one hole, arguing about who cleared the rim first.',
				'노을나. 양을나. 고을라. 한 구멍에서 나온 세 왕자. 누가 먼저 턱을 짚었는지부터 싸운다.'
			),
			p(
				'They are not kings yet. They are three brothers with too much sky and not enough fence.',
				'아직 왕이 아니다. 하늘은 많고 담장은 부족한 세 형제다.'
			)
		);
	}
}

/* ─── Bonpuri: more section breaks ─── */
{
	const bp = entry('Bonpuri');
	for (let i = bp.blocks.length - 1; i >= 0; i--) {
		if (
			bp.blocks[i].kind === 'section' &&
			/^(Gimnyung|Sanbangduk|Sochun|Fortune|Jachungbi|Tribute)$/.test(bp.blocks[i].label || '')
		)
			bp.blocks.splice(i, 1);
	}
	const addSec = (sceneLabel, label, ko) => {
		const i = bp.blocks.findIndex(
			(b) => (b.kind === 'scene' || b.kind === 'story') && b.label === sceneLabel
		);
		if (i >= 0) insertSection(bp.blocks, i, label, ko);
	};
	addSec('Gimnyung Cave', 'Gimnyung', '김녕');
	addSec('Sanbangduk', 'Sanbangduk', '산방덕');
	addSec('Sochun', 'Sochun', '소천국');
	addSec('Gamunjang', 'Fortune', '가믄장');
	addSec('Jachungbi', 'Jachungbi', '자청비');
	addSec('Tribute', 'Tribute', '조공');
}

/* ─── Daebyul / Sobyul naming in myth entries ─── */
function renameStars(obj) {
	const s = JSON.stringify(obj);
	let out = s;
	// Prefer Daebyul / Sobyul; keep occasional sobriquet forms.
	out = out.replace(/\bBig Star\b/g, 'Daebyul');
	out = out.replace(/\bLittle Star\b/g, 'Sobyul');
	out = out.replace(/\bDebyul\b/g, 'Daebyul');
	out = out.replace(/\bDebyulwang\b/g, 'Daebyul');
	out = out.replace(/\bSobyulwang\b/g, 'Sobyul');
	return JSON.parse(out);
}

for (const title of ['Heaven–Earth King', 'Grim Reaper', 'Goddess Supreme', 'Gardener', 'Three Princes', 'Bonpuri']) {
	const e = entry(title);
	const next = renameStars(e);
	Object.assign(e, next);
}

/* First introductions: restore sobriquet once each in HEK opening of Daebyul section */
{
	const e = entry('Heaven–Earth King');
	const i = e.blocks.findIndex((b) => b.kind === 'section' && b.label === 'Daebyul & Sobyul');
	if (i >= 0) {
		const note = p(
			'Daebyul, the Big Star. Sobyul, the Little Star. The names Father left them — and the titles the worlds still use when they are afraid to say the short ones.',
			'대별, 큰별. 소별, 작은별. 아버지가 남겨 둔 이름 — 그리고 짧은 이름을 부르기 두려워할 때 세상이 붙잡는 호칭.'
		);
		if (!e.blocks.some((b) => b.kind === 'p' && /Daebyul, the Big Star/.test(b.html || ''))) {
			e.blocks.splice(i + 1, 0, note);
		}
	}
}

/* ─── Romanizations in display strings only (never ids / paths) ─── */
const ROMA = [
	[/King Geunchogo/g, 'King Gunchogo'],
	[/\bGeunchogo\b/g, 'Gunchogo'],
	[/King Jinheung/g, 'King Jinhung'],
	[/\bJinheung\b/g, 'Jinhung'],
	[/Gwanggaeto the Great/g, 'Gwanggeto the Great'],
	[/\bGwanggaeto\b/g, 'Gwanggeto']
];

function romaString(s) {
	if (typeof s !== 'string') return s;
	// skip paths, urls, person ids, file names
	if (/^\/|^https?:|ch_|img_|\.png|\.jpg|jinheung|geunchogo|gwanggaeto/i.test(s) && !/\s/.test(s)) return s;
	let out = s;
	for (const [re, to] of ROMA) out = out.replace(re, to);
	return out;
}

function walkRoma(node, key) {
	if (Array.isArray(node)) {
		// people / cast id arrays stay untouched
		if (key === 'people' || key === 'cast' || key === 'faces') return;
		node.forEach((v, i) => {
			if (typeof v === 'string') node[i] = romaString(v);
			else walkRoma(v, key);
		});
		return;
	}
	if (!node || typeof node !== 'object') return;
	for (const [k, v] of Object.entries(node)) {
		if (k === 'id' || k === 'person' || k === 'tempImage' || k === 'src' || k === 'avatar' || k === 'refs') continue;
		if (typeof v === 'string') node[k] = romaString(v);
		else walkRoma(v, k);
	}
}

walkRoma(data, '');

writeFileSync(path, JSON.stringify(data, null, '\t') + '\n');
console.log('story.json myth restructure written');
