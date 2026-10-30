/** Apply the approved Part → Arc → Chapter → Episode rearrange. */
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmSync,
	writeFileSync,
	copyFileSync
} from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');
const storyPath = join(ROOT, 'src/lib/data/story.json');

function load(rel) {
	return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}
function save(rel, data) {
	writeFileSync(join(ROOT, rel), JSON.stringify(data, null, '\t') + '\n');
}

function slug(title) {
	return String(title)
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[''']/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
function eid(arcId, title) {
	return `${arcId}-${slug(title)}`;
}

function yearSpan(entries) {
	let min = Infinity;
	let max = -Infinity;
	for (const e of entries) {
		const nums = String(e.year).match(/\d+/g)?.map(Number) ?? [];
		for (const n of nums) {
			min = Math.min(min, n);
			max = Math.max(max, n);
		}
	}
	if (!Number.isFinite(min)) return '';
	return min === max ? String(min) : `${min}–${max}`;
}

function take(bag, arcId, title) {
	const list = bag.get(arcId);
	if (!list) throw new Error(`no arc ${arcId}`);
	const i = list.findIndex((e) => e.title === title);
	if (i < 0) throw new Error(`missing ${arcId} / ${title}`);
	const [e] = list.splice(i, 1);
	return e;
}

function rename(e, title, subtitle, extra = {}) {
	e.title = title;
	if (subtitle != null) e.subtitle = subtitle;
	Object.assign(e, extra);
	return e;
}

function uniqueImages(images) {
	const seen = new Set();
	const out = [];
	for (const img of images ?? []) {
		let id = img.id;
		if (!id) {
			out.push(img);
			continue;
		}
		if (seen.has(id)) {
			let n = 2;
			while (seen.has(`${id}-${n}`)) n++;
			id = `${id}-${n}`;
			out.push({ ...img, id });
			seen.add(id);
		} else {
			seen.add(id);
			out.push(img);
		}
	}
	return out;
}

function mergeInto(into, from, storyLabel, storyKo) {
	if (!from) return into;
	into.blocks.push({ kind: 'story', label: storyLabel, ko: storyKo }, ...from.blocks);
	into.images = uniqueImages([...(into.images ?? []), ...(from.images ?? [])]);
	if (from.cast?.length) {
		const set = new Set(into.cast ?? []);
		for (const id of from.cast) set.add(id);
		into.cast = [...set];
	}
	if (from.badges?.length) {
		const set = new Set(into.badges ?? []);
		for (const b of from.badges) set.add(b);
		into.badges = [...set];
	}
	if (from.flash || from.flashback) {
		into.flash = true;
		into.flashback = true;
	}
	const a = String(into.year);
	const b = String(from.year);
	if (a !== b && /^\d/.test(a) && /^\d/.test(b)) {
		into.year = yearSpan([into, from]);
	}
	return into;
}

function setCloser(e, en, ko) {
	const last = e.blocks[e.blocks.length - 1];
	if (last?.kind === 'p' && typeof last.html === 'string' && /<b>/i.test(last.html)) {
		last.html = `<b>${en}</b>`;
		last.ko = `<b>${ko}</b>`;
	} else {
		e.blocks.push({ kind: 'p', html: `<b>${en}</b>`, ko: `<b>${ko}</b>` });
	}
}

function micheonEntry() {
	const src = readFileSync(join(ROOT, 'scripts/.cache/micheon-episode.mjs'), 'utf8');
	const start = src.indexOf('const entry =');
	const end = src.lastIndexOf('editStory');
	if (start < 0 || end < 0) throw new Error('micheon-episode.mjs shape changed');
	const obj = src.slice(start + 'const entry ='.length, end).replace(/;?\s*$/, '');
	// eslint-disable-next-line no-eval
	const entry = eval(`(${obj})`);
	entry.kinds = ['founding', 'coup'];
	return entry;
}

const story = JSON.parse(readFileSync(storyPath, 'utf8'));
const bag = new Map(story.map((ch) => [ch.id, [...ch.entries]]));
const oldIds = [];
for (const ch of story) {
	for (const e of ch.entries) oldIds.push({ id: eid(ch.id, e.title), arc: ch.id, title: e.title });
}

const T = take;

const queenSunduk = T(bag, 'samhan', 'Queen Sunduk');
const harmony = T(bag, 'samhan', 'Harmony Council');
const jade = T(bag, 'samhan', 'Jade Gate Valley');
const jinheung = rename(T(bag, 'samhan', 'Jinhung, the Cloud'), 'King Jinheung', '진흥왕');
const princeEuija = T(bag, 'samhan', 'Prince Euija');
const clans = T(bag, 'samhan', 'Eight Great Clans');
const deer = rename(T(bag, 'samhan', 'Deer Rock'), 'Deer Rock Council', '정사암회의');
const geunchogo = rename(T(bag, 'samhan', 'Gunchogo, the 13th'), 'King Geunchogo', '근초고왕');
const commanderYeon = T(bag, 'samhan', 'Commander Yeon');
const fiveTribes = T(bag, 'samhan', 'Five Tribes');
const highSummit = T(bag, 'samhan', 'High Summit');
const gwanggaeto = rename(T(bag, 'samhan', 'Gwanggeto, the Great King'), 'King Gwanggaeto', '광개토대왕');

const bupmin = T(bag, 'five-principles', 'Bupmin');
const sadaham = rename(T(bag, 'five-principles', 'Sadaham'), 'Sadaham', '김사다함');
const gotaso = T(bag, 'five-principles', 'Gotaso');
const pumsuk = T(bag, 'five-principles', 'Pumsuk');
mergeInto(gotaso, pumsuk, 'Pumsuk', '품석');
const munhee = rename(T(bag, 'five-principles', 'Munhee'), 'Munhee', '김문희');
const kingEuija = T(bag, 'five-principles', 'King Euija');
const kingSeong = rename(T(bag, 'five-principles', 'Gwansan'), 'King Seong', '성왕');
const yunchung = T(bag, 'five-principles', 'Yunchung');
const namsengEp = rename(T(bag, 'five-principles', 'Academy'), 'Yeon Namseng', '연남생');
const stele = rename(T(bag, 'five-principles', 'Stele'), 'The Stele', '비석');
const soryu = T(bag, 'five-principles', 'Dosuryu');
mergeInto(stele, soryu, 'Yeon Soryu', '연소류');
const micheon = micheonEntry();

const gumil = T(bag, 'iron-will', 'Gumil');
const maehwa = T(bag, 'iron-will', 'Maehwa');
const jukjuk = rename(T(bag, 'iron-will', 'Siege of Daeya'), 'Jukjuk', '죽죽');
const revolt = rename(T(bag, 'iron-will', 'Yeon’s Massacre'), 'The Revolt', '난');
const cut = rename(T(bag, 'iron-will', 'Chunchu & Yeon'), 'The Cut', '단');
const oath = rename(T(bag, 'iron-will', 'Euija & Yeon'), 'The Oath', '맹');
const nangbi = T(bag, 'iron-will', 'Nangbi');
const yonghwa = rename(T(bag, 'iron-will', 'Yushin'), 'Yonghwa Hyangdo', '용화향도');
const morningStar = rename(T(bag, 'iron-will', 'The Eastern Star'), 'The Morning Star', '샛별');

const fourDragonsEpi = T(bag, 'epilogue', 'Four Dragons');
const emperor = T(bag, 'seventh-invasion', 'Emperor');
const yodong = T(bag, 'seventh-invasion', 'Yodong');
const dongcheon = rename(T(bag, 'seventh-invasion', 'Boiling River'), 'King Dongcheon', '동천왕');
const sima = T(bag, 'seventh-invasion', 'Sima Yi');
mergeInto(dongcheon, sima, 'Sima Yi', '사마의');
const stallion = T(bag, 'seventh-invasion', 'Stallion Mountain');
const lordAnsi = rename(T(bag, 'seventh-invasion', 'Ansi'), 'Lord of Ansi', '안시성주');
const eulji = rename(T(bag, 'seventh-invasion', 'Colossal River'), 'Eulji Mundeok', '을지문덕');
const haemosu = T(bag, 'seventh-invasion', 'Haemosu');
const buyeo = T(bag, 'seventh-invasion', 'Buyeo');
const jolbon = T(bag, 'seventh-invasion', 'Jolbon');

const gi = rename(T(bag, 'chunchu-era', 'Gi (起)'), 'Gi', '기');
const suro = rename(T(bag, 'chunchu-era', 'Suro'), 'Suro', '김수로');
const seung = rename(T(bag, 'chunchu-era', 'Seung (承)'), 'Seung', '승');
const muryuk = T(bag, 'chunchu-era', 'Muryuk');
const jeon = rename(T(bag, 'chunchu-era', 'Jeon (轉)'), 'Jeon', '전');
const seohyun = T(bag, 'chunchu-era', 'Seohyun');
const gyul = rename(T(bag, 'chunchu-era', 'Gyul (結)'), 'Gyul', '결');
const jinduk = T(bag, 'chunchu-era', 'Queen Jinduk');
const liShimin = rename(T(bag, 'chunchu-era', 'Huangdi (皇帝)'), 'Li Shimin', '이세민');
const jiabeng = T(bag, 'chunchu-era', 'Jiabeng (駕崩)');
mergeInto(liShimin, jiabeng, 'The Passing', '가붕');
const secretariat = T(bag, 'chunchu-era', 'Royal Secretariat');
const bihyung = T(bag, 'chunchu-era', 'Bihyung');
const yongsu = T(bag, 'chunchu-era', 'Yongsu');
const muyeol = T(bag, 'chunchu-era', 'King Muyeol');
const jahee = T(bag, 'chunchu-era', 'Jahee');
const hyukgose = T(bag, 'chunchu-era', 'Hyukgosé');
const talhae = T(bag, 'chunchu-era', 'Talhae');
const alji = T(bag, 'chunchu-era', 'Alji');

const yuri = rename(T(bag, 'fall-of-euija', 'Exile'), 'Yuri Dora', '유리도라');
const heavenEarth = T(bag, 'fall-of-euija', 'Heaven–Earth King');
const threePrinces = T(bag, 'fall-of-euija', 'Three Princes');
const sulmun = T(bag, 'fall-of-euija', 'Sulmun');
mergeInto(threePrinces, sulmun, 'Sulmun', '설문대할망');
const hallak = rename(T(bag, 'fall-of-euija', 'Gardener'), 'Hallakgungi', '할락궁이');
const kangrim = T(bag, 'fall-of-euija', 'Kangrim');
const bonpuri = rename(T(bag, 'fall-of-euija', 'Stone Lady'), 'Bonpuri', '본풀이');
const jachungbi = T(bag, 'fall-of-euija', 'Jachungbi');
const tribute = T(bag, 'fall-of-euija', 'Tribute');
mergeInto(bonpuri, jachungbi, 'Jachungbi', '자청비');
mergeInto(bonpuri, tribute, 'Tribute', '탐라와 백제');
const cheonbok = rename(T(bag, 'fall-of-euija', 'Coup'), 'Cheonbok', '천복');
const ungo = rename(T(bag, 'fall-of-euija', 'Descent'), 'Lady Ungo', '은고부인');
const theFall = rename(T(bag, 'fall-of-euija', 'Nine Omens'), 'The Fall', '망국');
const onjo = T(bag, 'fall-of-euija', 'Onjo');
const sunchung = T(bag, 'fall-of-euija', 'Sunchung');
const hungsu = T(bag, 'fall-of-euija', 'Hungsu');
const gyebek = T(bag, 'fall-of-euija', 'Gyebek');
const threeRealms = T(bag, 'epilogue-part-ii', 'Three Realms');

const hwangsan = rename(T(bag, 'fall-of-baekje', 'Yellow Mountain'), 'Hwangsan Field', '황산벌 전투');
const buyeoEuija = rename(T(bag, 'fall-of-baekje', 'Buyeo Euija†'), 'Buyeo Euija', '부여의자');
const sabi = T(bag, 'fall-of-baekje', 'Sabi');
mergeInto(buyeoEuija, sabi, 'Sabi', '사비성');
const kimChunchu = rename(T(bag, 'fall-of-baekje', 'Kim Chunchu†'), 'Kim Chunchu', '김춘추');
const pungjang = T(bag, 'fall-of-baekje', 'King Pungjang');
const echi = rename(T(bag, 'fall-of-baekje', 'Ungjin Commandery'), 'Echi', '이치');
echi.blocks.unshift(
	{
		kind: 'p',
		html: 'The Third Emperor inherits a war his father could not finish, and four nicknames that were never his.',
		ko: '제삼황제는 아버지가 끝내지 못한 전쟁과, 한 번도 제 것이 아니었던 별명 넷을 물려받는다.'
	},
	{
		kind: 'p',
		html: 'He gathers the beasts. First he throws a net over a country that already fell.',
		ko: '그는 짐승들을 모은다. 먼저, 이미 넘어진 나라 위에 그물을 던진다.'
	}
);

const pyongyang = rename(T(bag, 'final-stand', 'Pyongyang I'), 'Pyongyang', '평양성');
const snake = T(bag, 'final-stand', 'Snake River');
const tamlaSurrenders = T(bag, 'final-stand', 'Tamla Surrenders');
mergeInto(snake, tamlaSurrenders, 'Tamla Surrenders', '탐라 항복');
const jinju = rename(T(bag, 'final-stand', 'Rebellion'), 'Kim Jinju', '김진주');
const boksin = rename(T(bag, 'final-stand', 'Betrayal'), 'Gwisil Boksin', '귀실복신');
const whiteRiver = T(bag, 'final-stand', 'White River');
const gesomunDeath = rename(T(bag, 'final-stand', 'Yeon Gesomun†'), 'Yeon Gesomun', '연개소문');
const namgunEp = rename(T(bag, 'final-stand', 'Brothers’ Coup'), 'Yeon Namgun', '연남건');
const namsanEp = rename(T(bag, 'final-stand', 'Pyongyang II'), 'Yeon Namsan', '연남산');

const dangun = rename(T(bag, 'silla-tang-war', 'Dangun & Old Joseon'), 'Dangun', '단군왕검');
const anseung = rename(T(bag, 'silla-tang-war', 'Ansung'), 'Go Anseung', '고안승');
const prosperity = T(bag, 'silla-tang-war', 'Prosperity Mountain');
mergeInto(anseung, prosperity, 'Prosperity Mountain', '취리산 회맹');
const xue = rename(T(bag, 'silla-tang-war', 'Letters'), 'Xue Rengui', '설인귀');
const stoneGate = T(bag, 'silla-tang-war', 'Stone Gate');
const wonsul = T(bag, 'silla-tang-war', 'Wonsul');
const yushinDeath = rename(T(bag, 'silla-tang-war', 'Kim Yushin†'), 'Kim Yushin', '김유신');
const munmu = T(bag, 'silla-tang-war', 'Munmu');
const maeso = rename(T(bag, 'silla-tang-war', 'Maeso'), 'Maeso', '매소성');
const gibulpo = rename(T(bag, 'silla-tang-war', 'Final Ford'), 'Gibulpo', '기벌포');
const kingOfSamhan = rename(T(bag, 'silla-tang-war', 'Wanggum'), 'King of Samhan', '삼한왕검');
const balhae = T(bag, 'epilogue-2', 'Balhae');

setCloser(munhee, 'The prince who oiled a rusty hinge now sits where his father sat…!', '녹슨 경첩에 기름을 치던 태자가, 이제 아버지가 앉던 자리에 앉는다…!');
setCloser(kingEuija, 'Before this king, another Baekje king walked into a trap with a gift in his hand…!', '이 왕보다 앞서, 다른 백제 왕이 선물을 든 채로 덫 안으로 걸어 들어갔다…!');
setCloser(yunchung, 'In the north, a boy is born whose name means the waiting is over…!', '북쪽에서는, 기다림이 끝났다는 이름의 사내아이가 태어난다…!');
setCloser(stele, 'Before the stone, a salt seller took the last Chinese city on the river…!', '그 비석보다 앞서, 소금장수가 강가의 마지막 한성(漢城)을 취한다…!');
setCloser(micheon, 'West of the river, a fortress still thinks it will last the winter…!', '강 서쪽의 한 성은, 아직 겨울을 넘길 줄 안다…!');
setCloser(emperor, 'The first wall has a name. The men who have to take it do not sleep…!', '첫 성에는 이름이 있다. 그 성을 넘어야 하는 자들은 잠을 자지 않는다…!');
setCloser(yodong, 'Sixty years after a capital burned, a king still remembers the water…!', '도성이 불타고 예순 해. 왕은 아직 그 물을 기억한다…!');
setCloser(lordAnsi, 'Thirty years before this wall, another general made a river boil without fire…!', '이 성벽보다 삼십 년 전, 다른 장수가 불 없이 강을 끓게 했다…!');
setCloser(jahee, 'In Sabi, a king is done being his father’s son…!', '사비에서는, 한 왕이 아버지의 아들 노릇을 끝낸다…!');
setCloser(alji, 'A letter will cross the sea. The man who writes it has already chosen the ending…!', '편지가 바다를 건넌다. 그 편지를 쓰는 자는 이미 결말을 골라 두었다…!');
setCloser(gyebek, 'The island across the strait has been watching this country drown…!', '해협 너머 섬은, 이 나라가 가라앉는 것을 보고 있었다…!');
setCloser(kangrim, 'The island still has smaller stories, and they all end in the same sea…!', '섬에는 아직 작은 이야기들이 남아 있고, 모두 같은 바다에서 끝난다…!');
setCloser(bonpuri, 'A field of yellow grass is waiting for five thousand men who will not come home…!', '노란 풀밭이, 집으로 돌아오지 못할 오천을 기다리고 있다…!');
setCloser(snake, 'In the south, a restoration still has a name, and a fortress that will not keep it…!', '남쪽에서는, 부흥에 아직 이름이 있고, 그 이름을 지키지 못할 성이 있다…!');
setCloser(namsanEp, 'To understand the country that remains, we have to go back to an egg…!', '남은 나라를 이해하려면, 알 하나로 돌아가야 한다…!');
setCloser(yushinDeath, 'Before any of these kings, there was a bear, a tiger, and a man who called himself a king…!', '이 왕들보다 앞서, 곰과 호랑이와, 스스로 왕이라 부른 사내가 있었다…!');
setCloser(dangun, 'The king who finishes the war was born in a year nobody wanted a prince…!', '전쟁을 끝내는 왕은, 아무도 태자를 원하지 않던 해에 태어났다…!');
setCloser(echi, 'The next wall is the one the beasts were gathered for…!', '다음 성벽은, 그 짐승들을 모은 이유다…!');

function arc(meta, entries) {
	return { ...meta, range: yearSpan(entries.filter((e) => !e.hidden)), entries };
}

const tiger = T(bag, 'prologue-samhan', 'Back When Tigers Smoked');
for (const [id, list] of bag) {
	if (list.length) {
		throw new Error(`leftover in ${id}: ${list.map((e) => e.title).join(', ')}`);
	}
}
const prologue = story.find((c) => c.id === 'prologue-samhan');
const epilogue = story.find((c) => c.id === 'epilogue');
const epilogue2 = story.find((c) => c.id === 'epilogue-part-ii');
const epilogue3 = story.find((c) => c.id === 'epilogue-2');

const chapters = [
	{ ...prologue, entries: [tiger] },
	arc(
		{
			id: 'three-kingdoms',
			part: 'Part I',
			partTitle: 'Land of Samhan',
			partKorean: '삼한산천',
			partHanja: '三韓山川',
			title: 'The Three Kingdoms',
			korean: '삼국시대',
			hanja: '三國時代'
		},
		[
			queenSunduk,
			harmony,
			jade,
			jinheung,
			princeEuija,
			clans,
			deer,
			geunchogo,
			commanderYeon,
			fiveTribes,
			highSummit,
			gwanggaeto
		]
	),
	arc(
		{
			id: 'five-principles',
			title: 'The Five Principles',
			korean: '세속오계',
			hanja: '世俗五戒'
		},
		[bupmin, sadaham, gotaso, munhee, kingEuija, kingSeong, yunchung, namsengEp, stele, micheon]
	),
	arc(
		{
			id: 'iron-will',
			title: 'Iron Will',
			korean: '불굴의지',
			hanja: '不屈意志'
		},
		[gumil, maehwa, jukjuk, revolt, cut, oath, nangbi, yonghwa, morningStar]
	),
	{ ...epilogue, entries: [fourDragonsEpi] },
	arc(
		{
			id: 'goguryeo-tang-war',
			part: 'Part II',
			partTitle: 'Meritorious Subjects of Samhan',
			partKorean: '삼한공신',
			partHanja: '三韓功臣',
			title: 'Goguryeo–Tang War',
			korean: '고당전쟁',
			hanja: '高唐戰爭'
		},
		[emperor, yodong, dongcheon, stallion, lordAnsi, eulji, haemosu, buyeo, jolbon]
	),
	arc(
		{
			id: 'chunchu-era',
			title: 'The Chunchu Era',
			korean: '춘추시대'
		},
		[
			gi,
			suro,
			seung,
			muryuk,
			jeon,
			seohyun,
			gyul,
			jinduk,
			liShimin,
			secretariat,
			bihyung,
			yongsu,
			muyeol,
			jahee
		]
	),
	arc(
		{
			id: 'haedong-jeungja',
			title: 'Haedong Jeungja',
			korean: '해동증자',
			hanja: '海東曾子'
		},
		[cheonbok, ungo, theFall, onjo, sunchung, hungsu, gyebek]
	),
	{ ...epilogue2, entries: [threeRealms] },
	arc(
		{
			id: 'fall-of-baekje',
			part: 'Part III',
			partTitle: 'Unification of Samhan',
			partKorean: '삼한일통',
			partHanja: '三韓一統',
			title: 'The Fall of Baekje',
			korean: '백제멸망',
			hanja: '百濟滅亡'
		},
		[
			yuri,
			heavenEarth,
			threePrinces,
			hallak,
			kangrim,
			bonpuri,
			hwangsan,
			buyeoEuija,
			kimChunchu,
			pungjang,
			echi,
			pyongyang,
			snake
		]
	),
	arc(
		{
			id: 'fall-of-goguryeo',
			title: 'The Fall of Goguryeo',
			korean: '고려멸망',
			hanja: '高麗滅亡'
		},
		[jinju, boksin, whiteRiver, gesomunDeath, namgunEp, namsanEp]
	),
	arc(
		{
			id: 'silla-tang-war',
			title: 'Silla-Tang War',
			korean: '나당전쟁',
			hanja: '羅唐戰爭'
		},
		[
			hyukgose,
			talhae,
			alji,
			xue,
			anseung,
			stoneGate,
			wonsul,
			yushinDeath,
			dangun,
			munmu,
			maeso,
			gibulpo,
			kingOfSamhan
		]
	),
	{ ...epilogue3, entries: [balhae] }
];

// Fix accidental stray tokens if any slipped in
for (const ch of chapters) {
	for (const k of Object.keys(ch)) {
		if (k.trim() !== k || k.includes(' ')) delete ch[k];
	}
}

writeFileSync(storyPath, JSON.stringify(chapters, null, '\t') + '\n');

const newIds = [];
for (const ch of chapters) {
	for (const e of ch.entries) newIds.push({ id: eid(ch.id, e.title), arc: ch.id, title: e.title });
}

const titleMove = new Map();
for (const old of oldIds) {
	const folded = {
		Pumsuk: 'Gotaso',
		Dosuryu: 'The Stele',
		'Sima Yi': 'King Dongcheon',
		'Jiabeng (駕崩)': 'Li Shimin',
		Sulmun: 'Three Princes',
		Jachungbi: 'Bonpuri',
		Tribute: 'Bonpuri',
		Sabi: 'Buyeo Euija',
		'Tamla Surrenders': 'Snake River',
		'Prosperity Mountain': 'Go Anseung'
	};
	const newTitle = folded[old.title] ?? null;
	let hit = newIds.find((n) => n.title === (newTitle ?? old.title));
	if (!hit) {
		const renamed = {
			'Jinhung, the Cloud': 'King Jinheung',
			'Gunchogo, the 13th': 'King Geunchogo',
			'Deer Rock': 'Deer Rock Council',
			'Gwanggeto, the Great King': 'King Gwanggaeto',
			Gwansan: 'King Seong',
			Academy: 'Yeon Namseng',
			Stele: 'The Stele',
			'Siege of Daeya': 'Jukjuk',
			'Yeon’s Massacre': 'The Revolt',
			'Chunchu & Yeon': 'The Cut',
			'Euija & Yeon': 'The Oath',
			Yushin: 'Yonghwa Hyangdo',
			'The Eastern Star': 'The Morning Star',
			'Boiling River': 'King Dongcheon',
			Ansi: 'Lord of Ansi',
			'Colossal River': 'Eulji Mundeok',
			'Gi (起)': 'Gi',
			'Suro': 'Suro',
			'Seung (承)': 'Seung',
			'Jeon (轉)': 'Jeon',
			'Gyul (結)': 'Gyul',
			'Huangdi (皇帝)': 'Li Shimin',
			Exile: 'Yuri Dora',
			Gardener: 'Hallakgungi',
			'Stone Lady': 'Bonpuri',
			Coup: 'Cheonbok',
			Descent: 'Lady Ungo',
			'Nine Omens': 'The Fall',
			'Yellow Mountain': 'Hwangsan Field',
			'Buyeo Euija†': 'Buyeo Euija',
			'Kim Chunchu†': 'Kim Chunchu',
			'Ungjin Commandery': 'Echi',
			'Pyongyang I': 'Pyongyang',
			Rebellion: 'Kim Jinju',
			Betrayal: 'Gwisil Boksin',
			'Yeon Gesomun†': 'Yeon Gesomun',
			'Brothers’ Coup': 'Yeon Namgun',
			'Pyongyang II': 'Yeon Namsan',
			'Dangun & Old Joseon': 'Dangun',
			Ansung: 'Go Anseung',
			Letters: 'Xue Rengui',
			'Kim Yushin†': 'Kim Yushin',
			'Final Ford': 'Gibulpo',
			Wanggum: 'King of Samhan'
		};
		hit = newIds.find((n) => n.title === renamed[old.title]);
	}
	if (!hit && newTitle) hit = newIds.find((n) => n.title === newTitle);
	if (hit) titleMove.set(old.id, hit.id);
	else if (old.title) {
		// same title, new arc
		const same = newIds.find((n) => n.title === old.title);
		if (same) titleMove.set(old.id, same.id);
		else console.warn('no remap for', old.id);
	}
}

save('scripts/.cache/episode-id-remap.json', Object.fromEntries(titleMove));
console.log('story rewritten', chapters.reduce((n, c) => n + c.entries.length, 0), 'episodes');
console.log('id remaps', titleMove.size);
