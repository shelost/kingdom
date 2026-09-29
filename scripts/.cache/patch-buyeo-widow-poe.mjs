/**
 * Buyeo brother falling-apart + Sosuno widow hints (objects, not lectures).
 * node scripts/.cache/patch-buyeo-widow-poe.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');
const PEOPLE = path.join(ROOT, 'src/lib/people.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];
if (j.title !== 'Jumong') throw new Error(j.title);

function ensureImage(slot) {
	const i = j.images.findIndex((im) => im.id === slot.id);
	if (i < 0) j.images.push(slot);
	else Object.assign(j.images[i], slot);
}

function findHtml(s) {
	return j.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(s));
}

// —— Sosuno intro: widow as fact-lite, not "widow with two sons" dump ——
{
	const i = findHtml('a widow with two sons');
	if (i >= 0) {
		j.blocks[i] = {
			kind: 'p',
			html: 'His daughter <b>Sosuno</b> is already on the grain porch and already running Jolbon before she has priced the exile. Spear-count. West line. Who eats, who rides. The yard answers her first and her father second. Chin up. Not soft. The hall behind her has been quiet for a while. <b>She is running the hunt.</b>',
			ko: '딸 <b>소서노</b>는 이미 곡식 누대에 있고, 망명객의 값을 매기기 전에 이미 졸본을 굴린다. 창 점고. 서쪽 줄. 누가 먹고 누가 탄다. 마당은 아버지보다 그녀에게 먼저 답한다. 턱. 안 부드럽다. 등 뒤 대청은 한동안 조용하다. <b>사냥을 돌린다.</b>'
		};
	}
}

// —— Widow objects after first-look snap-back / work first ——
{
	const i = findHtml('Work first. Looking later');
	if (i >= 0 && !j.blocks[i + 1]?.html?.includes?.('The second bowl stays dry')) {
		j.blocks.splice(i + 1, 0, {
			kind: 'p',
			html: 'On the porch a man’s jeogori still hangs from a peg nobody uses. Dusty-rose walks past it without looking. <b>The second bowl stays dry.</b> Two cups. One filled. The hall learned that arithmetic the year the arranged match ended and the lamp went out mid-winter. She does not say his name. The peg does not ask.',
			ko: '누대에 남자 저고리가 아직 걸려 있다. 쓰는 사람 없는 못. 회분홍은 안 보고 지나간다. <b>둘째 그릇은 마른 채다.</b> 잔 둘. 채운 건 하나. 중매로 들인 혼이 끝나고 등잔이 한겨울에 꺼진 해부터 대청이 그 셈을 안다. 이름은 안 부른다. 못도 안 묻는다.'
		});
	}
}

// —— Tabal fragment when he assigns the worker ——
{
	const hire = j.blocks.findIndex(
		(b) =>
			b.kind === 'dialogue' &&
			b.person === 'yeontabal' &&
			Array.isArray(b.en) &&
			b.en.some((l) => String(l).includes("He's Sosuno's worker") || String(l).includes('Sosuno’s worker') || String(l).includes("He's Sosuno"))
	);
	// softer: after shed / hire narration
}

{
	const i = findHtml("He's Sosuno's worker");
	const i2 = findHtml('He’s Sosuno’s worker');
	const idx = i >= 0 ? i : i2;
	if (idx >= 0 && !j.blocks.slice(idx, idx + 3).some((b) => b.html?.includes?.('Since the hall'))) {
		j.blocks.splice(idx + 1, 0, {
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#141C2E',
			en: [
				'She’s been counting since the hall—',
				'Never mind.',
				'You hunt, you eat. You answer to her. Not to me.'
			],
			lines: [
				'대청이— 그 다음부터 걔가 세고 있어.',
				'됐다.',
				'사냥하면 먹어. 나한테 말고 걔한테 답해.'
			]
		});
	}
}

// —— First-look wreck includes the old door ——
{
	const i = findHtml('Something in her goes stupid');
	if (i >= 0 && !j.blocks[i]?.html?.includes?.('the last door')) {
		const b = j.blocks[i];
		j.blocks[i] = {
			...b,
			html: b.html.replace(
				'<b>Something in her goes stupid.</b>',
				'She already closed one door. She was not going to open another. <b>Something in her goes stupid.</b>'
			),
			ko: b.ko.replace(
				'<b>안에서 뭔가 바보가 된다.</b>',
				'문은 이미 하나 닫았다. 또 열 생각 없었다. <b>안에서 뭔가 바보가 된다.</b>'
			)
		};
	}
}

// —— Grain-room "I've never" becomes widow-coded ——
{
	const d = j.blocks.findIndex(
		(b) =>
			b.kind === 'dialogue' &&
			b.person === 'sosuno' &&
			Array.isArray(b.en) &&
			b.en.includes('I’ve never—')
	);
	if (d >= 0) {
		const en = [...j.blocks[d].en];
		const lines = [...j.blocks[d].lines];
		const ei = en.indexOf('I’ve never—');
		if (ei >= 0) {
			en[ei] = 'I’ve never— not since the hall—';
			lines[ei] = '한 적— 대청이 조용해진 다음엔—';
			j.blocks[d] = { ...j.blocks[d], en, lines };
		}
	}
}

// —— Buyeo: one roof that still likes each other, then sour ——
{
	const smiles = findHtml('The smiles keep shrinking');
	if (smiles >= 0 && !j.blocks[smiles + 1]?.html?.includes?.('One roof, three bowls')) {
		j.blocks.splice(
			smiles + 1,
			0,
			{
				kind: 'p',
				html: '<b>One roof, three bowls.</b> Night on the Buyeo step — same grey-giwa bar, same mark-stake a black stick in the yard. Daeso still calls him 막내 when the lamp is low. Galsa does the voices of the gate-guard. Jumong steals the last millet and gets his ear flicked. They sleep in a pile like dogs that have not learned houses yet.',
				ko: '<b>지붕 하나, 그릇 셋.</b> 부여 섬돌의 밤 — 같은 회색 기와 띠, 마당의 과녁 말뚝은 검은 막대기. 등잔이 낮으면 대소는 아직 그를 막내라고 한다. 갈사는 문지기 성대를 낸다. 주몽이 조 마지막을 훔치면 귀를 맞는다. 집을 아직 모르는 개처럼 포개져 잔다.'
			},
			{
				kind: 'dialogue',
				person: 'daeso',
				chip: '#9b8f6a',
				en: [
					'막내. Mouth closed when you eat.',
					'Father said the east line is yours tomorrow.',
					'Don’t make me look stupid in front of the old men.'
				],
				lines: [
					'막내. 먹을 때 입 닫아.',
					'아버지께서 내일 동쪽은 너래.',
					'노인들 앞에서 나 바보 만들지 마.'
				]
			},
			{
				kind: 'dialogue',
				person: 'jumong',
				chip: '#e8563f',
				en: [
					'형.',
					'I hit it because you showed me the grip.',
					'You can have the clap. I’ll take the fly.'
				],
				lines: [
					'형.',
					'형이 쥐는 거 가르쳐 줘서 맞힌 거예요.',
					'박수는 형이 가져. 파리는 내가.'
				]
			},
			{
				kind: 'dialogue',
				person: 'galsa',
				chip: '#6b8f4a',
				en: [
					'If I clap first, hyung looks at me.',
					'If I don’t, you look at me.',
					'…I’m going to look at the dirt. That’s allowed.'
				],
				lines: [
					'내가 먼저 치면 형이 나를 봐.',
					'안 치면 네가 나를 봐.',
					'…난 흙 볼게. 그건 되잖아.'
				]
			},
			{
				kind: 'p',
				html: 'Morning he still fixes Jumong’s grip on the packed earth — thumb, then a shove. He hates that it helped. <b>Daeso teaches the grip, then resents the hit.</b> Galsa’s laugh arrives late on purpose now. The three of them walk to the river-edge like they used to. Only two come back talking.',
				ko: '아침에도 다진 흙 위에서 주몽의 쥐는 법을 고쳐 준다 — 엄지, 그다음 밀침. 도움이 된 게 싫다. <b>대소는 쥐는 법을 가르치고, 맞힌 것을 미워한다.</b> 갈사의 웃음은 이제 일부러 늦다. 셋이 예전에 가던 대로 강턱까지 걷는다. 말하며 돌아오는 것은 둘뿐이다.'
			},
			{
				kind: 'dialogue',
				person: 'galsa',
				chip: '#6b8f4a',
				en: [
					'I’m going east someday.',
					'Not tonight. Don’t look at me like that.',
					'A smaller roof. My name on it. That’s all.'
				],
				lines: [
					'난 언젠가 동쪽으로 가.',
					'오늘 밤은 아니야. 그렇게 보지 마.',
					'작은 지붕. 내 이름. 그게 다야.'
				]
			},
			{
				kind: 'dialogue',
				person: 'daeso',
				chip: '#9b8f6a',
				en: [
					'You’re not going anywhere.',
					'This house is one house.',
					'…He is not. That’s the problem.'
				],
				lines: [
					'아무 데도 안 가.',
					'이 집은 한 집이야.',
					'…저 놈은 아니야. 그게 문제지.'
				]
			}
		);
	}
}

const refsBuyeo = ['/pl_buyeo_yard.png', '/temp/buyeo-seq-yard-dutch.jpg'];
ensureImage({
	id: 'buyeo-one-roof-night',
	ratio: 1.778,
	nsfw: false,
	tone: '#9b8f6a',
	at: 'One roof, three bowls',
	alt: 'Dutch Buyeo step at night: three princes, millet bowls, same grey-giwa hall bar',
	refs: ['/ch_daeso.png', '/ch_galsa.png', '/ch_jumong.png', ...refsBuyeo],
	people: ['daeso', 'galsa', 'jumong'],
	prompt: ''
});
ensureImage({
	id: 'buyeo-daeso-grip',
	ratio: 1.778,
	nsfw: false,
	tone: '#9b8f6a',
	at: 'Daeso teaches the grip, then resents the hit',
	alt: 'OTS packed earth: Daeso correcting Jumong’s bow grip; same Buyeo hall bar',
	refs: ['/ch_daeso.png', '/ch_jumong.png', ...refsBuyeo],
	people: ['daeso', 'jumong'],
	prompt: ''
});
ensureImage({
	id: 'buyeo-galsa-dirt',
	ratio: 1.778,
	nsfw: false,
	tone: '#6b8f4a',
	at: 'I’m going to look at the dirt',
	alt: 'ECU Galsa looking at packed earth; mark-stake bokeh; same Buyeo yard',
	refs: ['/ch_galsa.png', ...refsBuyeo],
	people: ['galsa'],
	prompt: ''
});
ensureImage({
	id: 'sosuno-widow-peg',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8a04a',
	at: 'The second bowl stays dry',
	alt: 'Dutch grain porch: unused man’s jeogori on a peg; one dry bowl; Sosuno walking past, chin up',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/jumong-seq-well-wide.jpg'],
	people: ['sosuno'],
	prompt: ''
});

let seq = fs.readFileSync(SEQ, 'utf8');
const needle = "{ id: 'jumong-buyeo-youths', role: 'youths', angle: 'dutch yard', at: 'The smiles keep shrinking' },";
const insert = `${needle}
			{ id: 'buyeo-one-roof-night', role: 'still a pile', angle: 'dutch step night', at: 'One roof, three bowls' },
			{ id: 'buyeo-daeso-grip', role: 'teaches then resents', angle: 'OTS grip', at: 'Daeso teaches the grip, then resents the hit' },
			{ id: 'buyeo-galsa-dirt', role: 'looks at dirt', angle: 'ECU', at: 'I’m going to look at the dirt' },`;
if (!seq.includes("id: 'buyeo-one-roof-night'")) {
	if (!seq.includes(needle)) throw new Error('buyeo youths needle missing');
	seq = seq.replace(needle, insert);
}
if (!seq.includes("id: 'sosuno-widow-peg'")) {
	const w =
		"{ id: 'sosuno-seq-thatch-aftermath', role: 'after, beam stare', angle: 'low dutch', at: 'The first night does not leave the bed' },";
	seq = seq.replace(
		w,
		`${w}
			{ id: 'sosuno-widow-peg', role: 'the dry bowl', angle: 'dutch porch', at: 'The second bowl stays dry' },`
	);
}
fs.writeFileSync(SEQ, seq);

// people.ts natures — surgical string replaces
let people = fs.readFileSync(PEOPLE, 'utf8');
people = people.replace(
	"nature: 'Heir-voice, short. Counts the yard like it already belongs to him. Does not clap.',",
	"nature: 'Heir-voice, short. Used to call the foundling 막내 and fix his grip; now the house is a contest he is losing. Counts the yard like it already belongs to him. Does not clap.',"
);
people = people.replace(
	"nature: 'Second son energy beside Daeso’s heir-rage: less throne, more side-eye. Keeps score the way hunters keep wind.',",
	"nature: 'Second son: the delayed clap. Wants all three at the same table and will not pick a knife, so he looks at the dirt, then takes a smaller roof east and puts his own name on it.',"
);
if (!people.includes('the hall that went quiet')) {
	people = people.replace(
		'Tabal’s eldest: chin-up girl-boss on the packed earth',
		'Tabal’s eldest, a young widow whose arranged match ended mid-winter — the unused peg, the dry second bowl; the chin-up is the lid. Girl-boss on the packed earth'
	);
}
fs.writeFileSync(PEOPLE, people);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched Buyeo brothers + widow hints');
