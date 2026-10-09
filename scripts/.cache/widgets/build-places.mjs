// Builds scripts/.cache/widgets/places.json: place intro cards + Five Precepts calligraphy.
// Run: npx tsx scripts/.cache/widgets/build-places.mjs
import fs from 'fs';
import { PLACES } from '../../../src/lib/places.ts';

const chs = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const entryOf = (title) => {
	for (const c of chs) for (const e of c.entries) if (e.title === title) return { chapter: c.id, e };
	throw new Error('no entry ' + title);
};
const blockAt = (e, path) => String(path).split('.').reduce((bs, i, k, a) => (k === a.length - 1 ? bs[+i] : bs[+i].blocks), e.blocks);
const fields = (b) => [b.html, b.ko, b.label, b.hanja, ...(b.lines || []), ...(b.en || [])].filter((x) => typeof x === 'string');
const allTexts = (bs) => bs.flatMap((b) => [...fields(b), ...(b.blocks ? allTexts(b.blocks) : [])]);
const count = (e, frag) => allTexts(e.blocks).reduce((n, t) => n + t.split(frag).length - 1, 0);

/** A unique ≥20-char fragment of the block (prefers English html / en, then ko / lines). */
function anchor(e, b) {
	for (const t of fields(b)) {
		if (t.length < 20) continue;
		for (const len of [40, 30, 24, 20, 60, 90]) {
			for (let s = 0; s + len <= t.length; s += 5) {
				const frag = t.slice(s, s + len);
				if (/^\s|\s$/.test(frag)) continue;
				if (count(e, frag) === 1) return frag;
			}
		}
	}
	throw new Error('no unique anchor in ' + e.title);
}

const ops = [];
const add = (title, path, block, why, extra = {}) => {
	const { chapter, e } = entryOf(title);
	ops.push({ chapter, title, op: 'add', after: anchor(e, blockAt(e, path)), block, why, ...extra });
};
const place = (title, path, id, html, ko, why) => add(title, path, { kind: 'place', place: id, html, ko }, why);

// ——— 1. Place intro cards (reading order) ———
place('Queen Sunduk', 1, 'surabol', 'Surabol. Everyone here knows exactly how high they were born.', '서라벌. 여기선 다들 자기가 얼마나 높이 태어났는지 정확히 안다.', 'first scene set in Surabol; after the opening map, before the first scene');
place('Queen Sunduk', 55, 'cheomseongdae', 'Cheomseongdae. A tower for reading the sky, in case the sky has opinions.', '첨성대. 하늘에도 할 말이 있을지 몰라 세운 탑.', 'first mention of Cheomseongdae');
place('Prince Euija', 4, 'sabi', 'Sabi. The king lives here. So do eight families who think that’s a detail.', '사비. 임금이 사는 곳. 그걸 사소한 일로 여기는 여덟 가문도 산다.', 'first scene set in Sabi (Jinheung’s opener only names it in passing)');
place('Prince Euija', 27, 'baekgang', 'The White River. Wide, slow, and fought over one berth at a time.', '백강. 넓고 느리고, 선착장 한 칸씩 싸움이 붙는 강.', 'first introduction of the White River');
place('Gunchogo, the 13th', 0, 'pyongyang', 'Pyongyang. The north’s capital, and a long walk for anyone who wants it.', '평양성. 북쪽의 수도. 탐내는 자에겐 먼 길이다.', 'first mention of Pyongyang; a king dies on its wall here');
place('Pumsuk', 20, 'daeya', 'Daeya. A border post with a fine view of Baekje. The view works both ways.', '대야성. 백제가 훤히 보이는 국경 초소. 저쪽에서도 훤히 보인다.', 'first plot introduction of Daeya (Gunchogo only teases the name)');
place('Stele', 0, 'gungnae', 'Gungnae. The old capital, where the Great King’s stone still does the bragging.', '국내성. 옛 수도. 자랑은 아직도 대왕의 비석이 대신 한다.', 'first scene set at Gungnae (the stele); place is unnamed in the text');
place('The Severing', 5, 'gwansan', 'Gwansan. Every road into Silla’s valley squeezes through here.', '관산성. 신라 골짜기로 드는 길은 모두 여기서 좁아진다.', '“the fortress that opens Silla’s throat”: first scene at Gwansan (Jinheung names it only in a list)');
place('Gumil', 1, 'steam_cavern', 'The steam cavern. Black water, warm stone, and not as empty as it looks.', '김 동굴. 물은 검고 바위는 따뜻하다. 보이는 것만큼 비어 있지 않다.', 'first visit to the cavern lake');
place('Siege of Daeya', 27, 'underworld', 'The underworld. It keeps a ledger, and it is never late.', '저승. 명부를 쥐고 있고, 늦는 법이 없다.', 'first appearance of the underworld (Kangrim arrives)');
place('Nangbi', 2, 'nangbi', 'Nangbi. A Goguryeo wall that is about to make somebody famous.', '낭비성. 곧 누군가를 유명하게 만들 고구려의 성벽.', 'first scene at Nangbi');
place('Emperor', 0, 'changan', 'Chang’an. Half the world sends tribute here and calls it friendship.', '장안. 세상의 절반이 조공을 바치고, 그걸 우정이라 부르는 곳.', 'first scene set in Chang’an (earlier mentions are passing)');
place('Yodong', 6, 'yodong', 'Yodong. The gate the West keeps knocking on.', '요동성. 서쪽이 자꾸 두드리는 문.', 'first scene at the Eastern Fortress (Four Dragons’ closing card only teases it)');
place('Boiling River', 5, 'hwando', 'Hwando. A mountain capital, built for the day the plain is lost.', '환도산성. 들판을 잃는 날을 위해 지은 산 위의 수도.', 'first mention of Hwando');
place('Stallion Mountain', 0, 'jupil', 'Stallion Mountain. Named for where an emperor stopped. Emperors name a lot of things.', '주필산. 황제가 멈춰 선 자리라 붙은 이름. 황제들은 이름 붙이길 좋아한다.', 'first scene at Stallion Mountain');
place('Colossal River', 2, 'salsu', 'The Colossal River. Ask a Goguryeo grandfather. He will raise a cup first.', '살수. 고구려 할아버지에게 물어보라. 잔부터 들 것이다.', 'first scene at the Salsu (High Summit / Nangbi only toast it)');
place('Ansi', 0, 'ansi', 'Ansi. One small fortress, and one stubborn man on top of it.', '안시성. 작은 성 하나, 그 위에 고집 센 사내 하나.', 'first scene at Ansi (earlier mentions are passing)');
place('Haemosu', 2, 'amnok', 'The Amnok. Every god’s road crosses it. Most of them keep going.', '압록강. 신들의 길은 모두 이 강을 건넌다. 대개는 그냥 지나간다.', 'first mention of the Amnok');
place('Haemosu', 60, 'buyeo_north', 'Buyeo. An old kingdom that takes in strays and keeps count.', '부여. 떠돌이를 받아 주고, 셈은 해 두는 오래된 나라.', 'first sight of Buyeo’s capital');
place('Jolbon', 1, 'jolbon', 'Jolbon. Pine valleys, crow clans, and nobody waiting for a king.', '졸본. 소나무 골짜기, 까마귀 가문, 그리고 임금을 기다리는 이는 아무도 없다.', 'first scene in Jolbon (Four Dragons names it only in passing)');
place('Jolbon', 221, 'pine_kingdom', 'The Pine Kingdom. Old trees, older pride, and a king who got here first.', '소나무 나라. 오래된 나무, 더 오래된 자존심, 그리고 먼저 와 있던 임금.', 'first introduction of the Pine Kingdom');
place('Suro', 2, 'geumgwan', 'Golden Gaya. The harbour that sells iron to everyone, enemies included.', '금관가야. 원수에게까지 쇠를 파는 항구.', 'first scene set in Golden Gaya (The Severing’s mention belongs to an unrevealed prince)');
place('Sadaham', '12.0', 'daegaya', 'Great Gaya. A hill kingdom that has just stopped saying yes.', '대가야. 막 “예”라고 하기를 그만둔 산골 왕국.', 'first plot introduction of Great Gaya (inside the flashback)');
place('Seung (承)', 10, 'radiance', 'The Fortress of Radiance. Close enough to the palace to shout at it.', '명활성. 궁궐에 고함이 들릴 만큼 가까운 성.', 'first scene at the Fortress of Radiance (Bupmin names it only as a practice road)');
place('Jahee', 0, 'danghang', 'Danghang. Silla’s only door to the western sea. Everyone knows which door.', '당항성. 서쪽 바다로 난 신라의 단 하나뿐인 문. 다들 그 문이 어딘지 안다.', 'first scene set at Danghang (Euija & Yeon already has a map right on its mention)');
place('Exile', 54, 'mugun', 'Tamla. The island where Baekje sends men it can’t afford to kill.', '탐라. 백제가 죽이기엔 아까운 사내들을 보내는 섬.', 'Gyebek lands on Tamla: first scene there');
place('Sulmun', 2, 'halla', 'Mount Halla. The island’s spine, and a giantess’s favourite chair.', '한라산. 섬의 등뼈이자, 거인 할망이 즐겨 앉던 의자.', 'first mention of Mount Halla');
place('Gardener', 30, 'western_flower_field', 'The Western Flower Field. Every flower here does something. Ask before you pick.', '서천꽃밭. 여기 꽃은 다 하는 일이 있다. 꺾기 전에 물어보라.', 'first mention of the Western Flower Field');
place('Coup', 21, 'ungjin', 'Bear Fortress. Four generations of the Ye family, and not one invitation.', '웅진성. 예씨 가문 사 대, 초대장은 한 장도 없었다.', 'first plot introduction of Bear Fortress (Exile’s drill-ground mention is passing)');
place('Onjo', 52, 'michuhol', 'Michuhol. Salt flats and sea wind. Biryu calls it a view.', '미추홀. 갯벌과 바닷바람. 비류는 그걸 경치라 부른다.', 'Biryu’s half goes to Michuhol: first plot introduction');
place('Three Realms', 0, 'realms_pavilion', 'The Three Realms Pavilion. Four posts, clouds for a yard, and very strict seating.', '삼계정자. 기둥 넷, 구름 마당, 그리고 아주 엄격한 자리 배치.', 'the annual meeting place, introduced in block 0');
place('Yellow Mountain', 17, 'gibeolpo', 'Gibeolpo. A river mouth made of mud, and Sabi’s front door.', '기벌포. 진흙으로 된 강어귀, 사비의 앞문.', 'first scene at Gibeolpo (Heungsu and the Descent quote only name it)');
place('Yellow Mountain', 23, 'hwangsan', 'The Yellow Mountain Fields. Good ground for whoever gets there first.', '황산벌. 먼저 온 자에게 좋은 땅.', 'first scene on the field (Bupmin / Pumsuk only name the road)');
place('King Pungjang', '4.0', 'asuka', 'Asuka. The court across the cold sea, where favours are counted in ships.', '아스카. 차가운 바다 건너의 궁정. 은혜는 배로 센다.', 'first scene in Asuka (inside the flashback)');
place('King Pungjang', 8, 'juryu', 'Juryu. Bad farmland, good cliffs. Rebels pick the cliffs.', '주류성. 농사엔 나쁘고 벼랑은 좋다. 반란군은 벼랑을 고른다.', 'first scene at Juryu');
place('Snake River', 0, 'sasu', 'The Snake River. Shallow, slow, and patient with men who think rivers are roads.', '사수. 얕고 느리며, 강을 길로 아는 자에게 참을성이 많다.', 'first mention of the Snake River');
place('Mount Gain', 8, 'chwiri', 'Mount Gain. A hill outside Bear Ford, named by optimists.', '취리산. 웅진 밖의 언덕. 낙관주의자들이 붙인 이름.', 'first introduction of Mount Gain');
place('Dangun & Old Joseon', 27, 'asadal', 'Asadal. Where the mountain meets the plain, and the first crown met both.', '아사달. 산이 들을 만나는 곳. 첫 왕관이 둘 다를 만난 곳.', 'first narration of Asadal (the diagram above only lists it)');
place('Stone Gate', 3, 'seokmun', 'Stone Gate. A narrow place that looks like a way out, until it isn’t.', '석문. 빠져나갈 길처럼 보이다가, 아니게 되는 좁은 곳.', 'first narration of Seokmun; the episode is set there');
place('Maeso', 16, 'maeso', 'Maeso. Good walls. Terrible stables.', '매소성. 성벽은 좋다. 마구간이 형편없다.', 'first scene at Maeso Fortress');

// ——— 2. Five Secular Precepts calligraphy (Bupmin) ———
const c = (char, gloss, meaning) => ({ char, gloss, meaning });
const PRECEPTS = [
	{ anchorLine: '사군이충 (事君以忠)', chars: [c('事', '섬길 사', 'serve'), c('君', '임금 군', 'sovereign'), c('以', '써 이', 'with, by means of'), c('忠', '충성 충', 'loyalty')], name: 'Serve the king with loyalty', ko: '사군이충', note: 'First on the list, so nobody can say they missed it.', noteKo: '맨 앞에 두었다. 못 들었다는 소리는 못 하게.' },
	{ anchorLine: '사친이효 (事親以孝)', chars: [c('事', '섬길 사', 'serve'), c('親', '친할 친', 'parents, kin'), c('以', '써 이', 'with, by means of'), c('孝', '효도 효', 'filial devotion')], name: 'Serve your parents with devotion', ko: '사친이효', note: 'Easy, until the king and your father want different things.', noteKo: '쉽다. 임금과 아버지가 서로 다른 걸 원하기 전까지는.' },
	{ anchorLine: '교우이신 (交友以信)', chars: [c('交', '사귈 교', 'befriend'), c('友', '벗 우', 'friend'), c('以', '써 이', 'with, by means of'), c('信', '믿을 신', 'trust')], name: 'Keep faith with your friends', ko: '교우이신', note: 'The one boys swear to first and keep longest.', noteKo: '소년들이 제일 먼저 맹세하고, 제일 오래 지키는 것.' },
	{ anchorLine: '임전무퇴 (臨戰無退)', chars: [c('臨', '임할 림', 'face, stand before'), c('戰', '싸움 전', 'battle'), c('無', '없을 무', 'no, without'), c('退', '물러날 퇴', 'retreat')], name: 'Never retreat in battle', ko: '임전무퇴', note: 'The one they elbow each other at. For now.', noteKo: '소년들이 서로 팔꿈치로 찌르는 대목. 아직은.' },
	{ anchorLine: '살생유택 (殺生有擇)', chars: [c('殺', '죽일 살', 'kill'), c('生', '날 생', 'living thing'), c('有', '있을 유', 'have, there is'), c('擇', '가릴 택', 'choice, discernment')], name: 'Be choosy about killing', ko: '살생유택', note: 'The quiet one. Boys skip it. Old soldiers don’t.', noteKo: '조용한 계율. 소년들은 건너뛰고, 늙은 병사들은 그러지 않는다.' }
];
const hanja = (p) => ({ kind: 'hanja', chars: p.chars, name: p.name, ko: p.ko, note: p.note, noteKo: p.noteKo });

add(
	'Bupmin',
	17,
	{
		kind: 'hanja',
		chars: [c('世', '인간 세', 'the world'), c('俗', '풍속 속', 'custom; lay life'), c('五', '다섯 오', 'five'), c('戒', '경계할 계', 'precept, warning')],
		name: 'The Five Secular Precepts',
		ko: '세속오계',
		note: 'A monk wrote rules for boys who would never be monks. They mostly kept them.',
		noteKo: '스님이, 끝내 스님이 되지 않을 소년들을 위해 쓴 계율. 소년들은 대체로 지켰다.'
	},
	'first introduction of the Five Principles (세속오계)'
);
const bupmin = entryOf('Bupmin').e;
PRECEPTS.forEach((p, i) => {
	const line = bupmin.blocks[18].lines.find((l) => l.startsWith(p.anchorLine));
	ops.push({ chapter: 'five-principles', title: 'Bupmin', op: 'add', after: line, block: hanja(p), why: `first naming of ${p.ko} (the verse lists all five at once)`, seq: i + 1 });
});

// Alternative: spread each precept to the first beat that dramatizes it (not applied by default).
const alternativeOps = [];
const alt = (title, path, p, why) => {
	const { chapter, e } = entryOf(title);
	alternativeOps.push({ chapter, title, op: 'add', after: anchor(e, blockAt(e, path)), block: hanja(p), why });
};
alt('Yellow Mountain', 86, PRECEPTS[0], 'Heumsun to Bangul: “For a subject, nothing is greater than loyalty…”');
alt('Yellow Mountain', 86, PRECEPTS[1], '…“For a son, nothing is greater than filial piety.” (insert after the 사군이충 block)');
alt('Sadaham', 3, PRECEPTS[2], '“The Marshal does not let trust among friends stay a pretty line.”');
alt('Bupmin', 21, PRECEPTS[3], 'Bupmin answers “…Retreat.” — the one he will break first');
alt('Gyeol (結)', 3, PRECEPTS[4], 'Bidam: “Master Wongwang’s fifth precept. Be choosy about killing.”');

// ——— Missing hanja ———
const used = [...new Set(ops.filter((o) => o.block.kind === 'place').map((o) => o.block.place))];
const missingHanja = used.filter((id) => !PLACES[id]?.hanja);
const hanjaSuggestions = {
	surabol: '徐羅伐', cheomseongdae: '瞻星臺', sabi: '泗沘', baekgang: '白江', pyongyang: '平壤城', daeya: '大耶城',
	gungnae: '國內城', gwansan: '管山城', underworld: '冥府', nangbi: '娘臂城', changan: '長安', yodong: '遼東城',
	hwando: '丸都山城', jupil: '駐蹕山', salsu: '薩水', ansi: '安市城', amnok: '鴨綠江', buyeo_north: '夫餘',
	geumgwan: '金官加耶', daegaya: '大加耶', radiance: '明活城', danghang: '党項城', mugun: '耽羅', halla: '漢拏山',
	ungjin: '熊津城', michuhol: '彌鄒忽', gibeolpo: '伎伐浦', hwangsan: '黃山伐', asuka: '飛鳥', juryu: '周留城',
	sasu: '蛇水', chwiri: '就利山', asadal: '阿斯達', seokmun: '石門', maeso: '買肖城'
};

const out = {
	ops,
	alternativeOps,
	missingHanja,
	hanjaSuggestions: Object.fromEntries(missingHanja.map((id) => [id, hanjaSuggestions[id] ?? null])),
	notes: [
		'Ops are in reading order. The five precept ops (seq 1–5) all anchor to lines of the same Bupmin verse block, so they resolve to one insertion point: insert them in seq order, each after the previous insert, so the run reads 사군이충 → 살생유택 after the verse. The 世俗五戒 title block goes after the “Five Principles” p, i.e. just before the verse.',
		'The verse already spells out all five precepts in Korean+hanja; with six calligraphy blocks right there the editor may want to drop the verse, or use alternativeOps instead, which spread each precept to the first beat that dramatizes it (Yellow Mountain loyalty/filial speech, Sadaham “trust among friends”, Bupmin’s “…Retreat.”, Bidam quoting Wongwang’s fifth precept in Gyeol). Both alternative Yellow Mountain ops share an anchor: put 사군이충 first.',
		'No hanja block for the precepts exists anywhere yet (story-wide hanja blocks: 善德, 階伯), so nothing duplicated.',
		'missingHanja lists every carded place without `hanja` in places.ts. hanjaSuggestions are the standard record forms for review only (not written anywhere); mugun’s is the island name 耽羅 (Tamla), underworld’s 冥府 is a gloss for native 저승. Heaven (天界) was skipped.',
		'Max 2 cards per episode held: Queen Sunduk, Prince Euija, Haemosu, Jolbon, Yellow Mountain, King Pungjang carry two.',
		'Skipped on purpose: buyeo_fort (Commander Yeon’s map already introduces a minor outpost); deer_rock (Eight Great Clans already has a `term` card, “The Rock of Government”); samseonghyeol (Three Princes diagram “Three Princes · 삼성혈” introduces it); imjon (would be a 3rd card in King Pungjang; Heukchi Sangji carries it); sinseong, liao, gaemo, baegam, geonan, bisa, wirye, paektu, manchuria, central, sabi_tourney, flower_cliff, moon_palace, heaven, living_world (passing mentions, unnamed, or not visited). Huangdi (皇帝) untouched.',
		'Places unnamed at their anchor (set by the entry’s `place` field): gungnae (Stele), changan (Emperor), danghang (Jahee), gwansan (The Severing, “the fortress that opens Silla’s throat”). The card names them.',
		'Renderer note: Blocks.svelte has no `place` branch yet, so these cards render nothing until the PlaceCard lands.'
	].join('\n')
};
fs.writeFileSync('scripts/.cache/widgets/places.json', JSON.stringify(out, null, '\t') + '\n');
console.log(`ops ${ops.length} (places ${used.length}), alternatives ${alternativeOps.length}, missingHanja ${missingHanja.length}`);
