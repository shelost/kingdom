// Bihyung ends as a song: the fox hunt in full, a happy old age, then the ghosts who never come back.
// The Sunduk audience, the tower and the burial live only in Yongsu, which gains the one request and Gildal's mound.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(FILE, 'utf8'));
fs.writeFileSync('scripts/.cache/bihyung-rewrite/story.before8.json', JSON.stringify(story));
const entries = story.flatMap((c) => c.entries);
const bh = entries.find((e) => e.title === 'Bihyung');
const ys = entries.find((e) => e.title === 'Yongsu');

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, ko) => ({ kind: 'dialogue', person, lines: ko, en });
const sc = (label, ko, jump) => ({ kind: 'scene', label, ko, ...(jump ? { jump } : {}) });
const find = (e, needle, from = 0) => {
	const i = e.blocks.findIndex((b, k) => k >= from && JSON.stringify(b).includes(needle));
	if (i < 0) throw new Error(`${e.title}: no block with “${needle}”`);
	return i;
};

// ── Bihyung: the hunt, told in full ──────────────────────────────────────
const hunt = [
	sc('The gate south of Heungnyun Temple · the morning it was empty', '흥륜사 남쪽 문 · 문이 비던 아침'),
	p(
		'A goblin can wear a man’s coat for years, the song says. Then one night the moon gets into the seams, and he remembers he has a tail.',
		'도깨비는 사람 옷을 몇 해고 입고 지낼 수 있다고, 노래는 말한다. 그러다 어느 밤 달빛이 솔기로 스며들면, 꼬리가 있었다는 걸 기억해 낸다.'
	),
	p(
		'One morning the gate is empty, and a fox is running down the road to the south with its tail very low. At Heungnyun the dawn bell rings anyway, with nobody on the rope.',
		'어느 아침 문루가 비어 있고, 여우 한 마리가 꼬리를 바짝 낮춘 채 남쪽 길로 달아나고 있다. 흥륜사 새벽 종은 그래도 울린다. 줄을 당기는 사람도 없는데.'
	),
	d('jinpyung', ['Your fox ran.', 'Imjong is very upset. He’d only just had the gate painted.'], ['네 여우가 달아났다.', '임종이 몹시 언짢아한다. 문루 칠을 새로 한 참이었거든.']),
	d('yongsu', ['He was never my fox, Majesty. Foxes belong to themselves.', '…Mostly.'], ['제 여우였던 적 없어요, 전하. 여우는 제 거예요.', '…대개는요.']),
	d('jinpyung', ['Bring him back.'], ['데려와라.']),
	d('yongsu', ['I won’t have to. The reeds will.'], ['제가 안 가도 돼요. 갈대가 데려올 거예요.']),
	p(
		'Bihyung doesn’t chase it himself. He goes down to the reeds and says a few words, and that night the goblins bring it back to him, and kill it.',
		'비형은 몸소 쫓지 않는다. 갈대숲에 내려가 몇 마디 한다. 그날 밤 도깨비들이 그것을 그에게 끌고 와, 죽인다.'
	),
	p(
		'The song gives the hunt a whole verse. The goblins come out of every culvert in the city with their lanterns. The madman runs at the front of them, barefoot, calling the fox by its name, and the reeds bend flat to show which way it went.',
		'노래는 그 사냥에 한 소절을 통째로 바친다. 도깨비들이 성안 수로마다 등불을 들고 쏟아져 나온다. 미치광이는 맨발로 맨 앞에서 달리며 여우의 이름을 부르고, 갈대는 납작 엎드려 여우가 간 쪽을 가리킨다.'
	),
	p(
		'Near midnight the fox doubles back for the Ghost Bridge, the one it laid itself. The bridge won’t have it. Every stone it set with its own paws tips under its feet, one after another, until it is standing in the stream.',
		'자정 무렵 여우는 귀교 쪽으로 되짚어 달린다. 제가 손수 놓은 다리다. 다리는 여우를 받아 주지 않는다. 제 발로 앉힌 돌이 하나씩, 하나씩 발밑에서 기울더니, 여우는 결국 개울 한가운데 서 있다.'
	),
	p(
		'They corner it in the reeds where the south road meets the river. It sits down and folds its paws. The song lets it say one thing.',
		'남쪽 길이 강과 만나는 갈대밭에서 놈을 몰아넣는다. 여우는 주저앉아 앞발을 모은다. 노래는 여우에게 딱 한마디를 허락한다.'
	),
	d('gildal', ['Young lord. I’m late.', '…Just this once.'], ['도련님. 늦었습니다.', '…딱 이번 한 번.']),
	d('yongsu', ['I know.'], ['알아.']),
	p(
		'The goblins close over it like water. When they open again there is only a small red fox lying in the reeds, very still, and a madman kneeling beside it.',
		'도깨비들이 물처럼 그 위를 덮는다. 다시 걷히고 나면, 갈대 사이에 작은 붉은 여우 한 마리가 꼼짝 않고 누워 있고, 그 옆에 미치광이가 무릎을 꿇고 있다.'
	)
];
const huntFrom = find(bh, 'One morning the gate is empty');
const huntTo = find(bh, 'The song gives the hunt a whole verse.');
bh.blocks.splice(huntFrom, huntTo - huntFrom + 1, ...hunt);

// ── Bihyung: hold the ghosts' fear for the last page ─────────────────────
const fearAt = find(bh, 'After that the ghosts of Surabol are afraid of one name.');
const fear = bh.blocks.splice(fearAt, 3);

// ── Bihyung: Chunchu in the yard, from the gate ─────────────────────────
const yard = [
	sc('The Hwarang yard gate · Class 59’s first morning', '화랑 마당 문 · 오십구기 첫 아침', { year: 618, en: 'Six Years Later…', ko: '여섯 해 뒤…' }),
	p(
		'At fifteen the goblin’s whelp goes into the Hwarang yard. His father walks him to the gate, though he has been asked three times not to, and delivers a speech he has been practising on the stream all week.',
		'열다섯에 도깨비 새끼는 화랑 마당에 든다. 아버지는 세 번이나 오지 말라는 부탁을 듣고도 문까지 따라와, 한 주 내내 개울에 대고 연습한 연설을 한다.'
	),
	p(
		'Halfway through, his son tells forty boys that the man at the gate is the family steward. He gets confused, poor thing.',
		'연설 중간에 아들은 마흔 명 앞에서, 문 앞의 저 사람은 집 청지기라고 한다. 가끔 정신이 오락가락하는 불쌍한 양반이라고.'
	),
	p(
		'The steward walks home grinning the whole way. Chunmyung wants to know what’s funny.',
		'청지기는 집까지 내내 싱글거리며 걸어간다. 천명이 뭐가 그렇게 웃기냐고 묻는다.'
	),
	d('yongsu', ['He disowned me in front of the whole yard.', 'First morning! Took me thirty years to learn that.'], ['온 마당 앞에서 날 내쳤어.', '첫날 아침에! 난 그거 배우는 데 서른 해 걸렸는데.']),
	d('chunmyung', ['…You’re proud of him.'], ['…자랑스럽구나, 그 애가.']),
	d('yongsu', ['I’m going to have the steward’s coat made in better silk.'], ['청지기 옷을 더 좋은 비단으로 맞춰야겠어.']),
	p(
		'That autumn the watch reports that the goblin’s whelp gave the moon verse for his whole class and made the Yard Marshal laugh. The steward has the watchman repeat it four times, then tells it to the stream.',
		'그해 가을 순라꾼이 소식을 전한다. 도깨비 새끼가 제 기수 몫으로 달맞이 시를 읊었는데, 마당 대장이 웃더라고. 청지기는 순라꾼한테 네 번을 다시 말하게 하고, 그걸 개울한테 들려준다.'
	)
];
bh.blocks.splice(find(bh, 'Chunchu decides his father is the strangest man in Silla.') + 1, 0, ...yard);

// ── Bihyung: cut the Sunduk audience, the tower and the burial ──────────
const cutFrom = find(bh, 'Seven Years Later…', find(bh, '…You were never mad. Were you.'));
const cutTo = find(bh, 'Then he says something to the water. Nobody hears what.');
bh.blocks.splice(cutFrom, cutTo - cutFrom + 1);

// ── Bihyung: two old people watching it all ─────────────────────────────
const ending = [
	sc('The house by the stream · the years after', '개울가 집 · 그 뒤의 해들'),
	p(
		'The song spends its last verse on two people getting old in a house by a stream. It is the happiest verse in it.',
		'노래는 마지막 소절을 개울가 집에서 늙어 가는 두 사람에게 쓴다. 노래에서 가장 행복한 소절이다.'
	),
	p(
		'She still ties his sleeves back before he goes into the water. He still talks to the stream. After a while she starts answering it for him.',
		'그녀는 여전히 그가 물에 들기 전에 소매를 걷어 묶어 준다. 그는 여전히 개울과 이야기한다. 얼마쯤 지나자 그녀가 개울 대신 대답해 주기 시작한다.'
	),
	p(
		'When their son starts coming home with the ties torn off his coats, they sit on the step and inspect each one. Chunmyung finds teeth marks. Bihyung declares a holiday.',
		'아들이 옷고름이 뜯긴 채로 집에 오기 시작하자, 둘은 마루에 앉아 하나하나 살핀다. 천명이 잇자국을 찾아낸다. 비형은 잔치를 선포한다.'
	),
	p(
		'At the wedding he cries, loudly, into a borrowed sleeve. The bride’s brother lends him the sleeve. It is the first time anyone has seen Kim Yushin look alarmed.',
		'혼례에서 그는 남의 소매에 대고 큰 소리로 운다. 소매를 빌려준 건 신부의 오라비다. 김유신이 당황한 얼굴을 누가 본 건 그때가 처음이다.'
	),
	p(
		'The grandchildren come. He tells the boy ghost stories every night, and the boy dreams about goblins on a bridge. Chunmyung says he’ll give him nightmares.',
		'손주들이 온다. 그는 손자에게 밤마다 귀신 이야기를 들려주고, 아이는 다리 위 도깨비 꿈을 꾼다. 천명은 애한테 악몽만 심어 준다고 한다.'
	),
	d('yongsu', ['Good ones.', 'The bad ones he can get from the Council.'], ['좋은 악몽이야.', '나쁜 건 화백에서 얻으면 되고.']),
	p(
		'When the granddaughter marries, he dances at the feast until his knees give out, and his wife counts his cups, and lets him have one more than she says.',
		'손녀가 시집가는 날, 그는 잔치에서 무릎이 꺾일 때까지 춤을 추고, 아내는 그의 잔을 세다가, 말한 것보다 한 잔을 더 봐준다.'
	),
	p(
		'And that is the story of the boy who could talk to ghosts. He grew old by the water with a woman who laughed at him, and his son grew up to be a great man.',
		'귀신과 말하던 아이의 이야기는 이렇다. 그는 자기를 보고 웃어 주는 여인과 물가에서 늙었고, 그의 아들은 자라서 큰 사람이 되었다.'
	),
	sc('The reeds · night', '갈대밭 · 밤'),
	p('There is one more verse. Nobody sings it at weddings.', '노래에는 한 소절이 더 있다. 혼례에서는 아무도 그걸 부르지 않는다.'),
	p(
		'After the fox, the goblins never come back. No lanterns in the culverts. No shoes stolen off the pages. The bridge stands empty, a little crooked, and the reeds stop bending when he walks through them.',
		'여우 일 뒤로 도깨비들은 다시 오지 않는다. 수로에 등불도 없다. 시동들 신이 없어지는 일도 없다. 다리는 조금 삐뚠 채 비어 있고, 그가 지나가도 갈대는 더는 고개를 숙이지 않는다.'
	),
	p(
		'Some nights he goes down to the water and calls them by their names. Nothing answers. The song says that is because they are afraid of him now. It doesn’t say what of.',
		'어떤 밤엔 그가 물가에 내려가 그들을 하나하나 이름으로 부른다. 아무것도 대답하지 않는다. 노래는 그들이 이제 그를 무서워해서라고 한다. 무엇이 무서운지는 말하지 않는다.'
	),
	...fear
];
bh.blocks.splice(find(bh, 'The tale of the peach-blossom woman'), 0, ...ending);

// ── Yongsu: the one request ─────────────────────────────────────────────
const request = [
	p('She pours the tea herself. Everyone who comes into this room wants something, and she would rather hear it now.', '차는 그녀가 손수 따른다. 이 방에 드는 사람은 누구나 뭔가를 원한다. 그녀는 그걸 지금 듣는 편이 낫다.'),
	d('sunduk', ['So. A rank. Land. Your mother’s name on a tablet.', 'Name it.'], ['자. 품계. 땅. 어머님 이름을 새긴 위패.', '말해 봐요.']),
	d('yongsu', ['One thing.', 'There are people under this city who’ve been dead for forty years. Bring them back.'], ['하나만요.', '이 도성 밑에 마흔 해째 죽어 지내는 사람들이 있어요. 그 사람들을 살려 주세요.']),
	d('sunduk', ['…How many?'], ['…몇이나요?']),
	d('yongsu', ['Forty-one. Thirty-eight, now. Old Man Tree went in the spring.', 'Some of them were children when it happened. They’re grown men with wives, and none of them has a name you can say in daylight.'], ['마흔하나요. 이제는 서른여덟. 나무 할배가 봄에 갔어요.', '그때 애였던 놈들도 있어요. 지금은 장가까지 든 어른인데, 누구 하나 대낮에 부를 이름이 없어요.']),
	d('sunduk', ['The Council will hate this more than they hate you.'], ['화백은 당신보다 이걸 더 싫어할걸요.']),
	d('yongsu', ['Then you’ll have even more company.'], ['그럼 말동무가 더 늘겠네요.']),
	d('sunduk', ['Write me the list.'], ['명단을 적어 와요.']),
	p(
		'He takes it out of his sleeve. It is very old, the paper soft as cloth, written in a boy’s hand in a culvert and added to for forty years.',
		'그는 소매에서 그걸 꺼낸다. 아주 오래된 종이다. 천처럼 보드랍다. 수로 속에서 소년의 손으로 쓰기 시작해 마흔 해 동안 보태 온 명단이다.'
	),
	p(
		'She reads it twice. Half the names she has seen before, on the Council’s own list, crossed out. She takes up her brush and uncrosses them.',
		'그녀는 두 번 읽는다. 절반은 본 적 있는 이름이다. 화백의 명단에서, 줄이 그어진 채로. 그녀는 붓을 들어 그 줄을 걷어 낸다.'
	)
];
ys.blocks.splice(find(ys, 'When I was small I wanted to be her.') + 1, 0, ...request);

const mound = [
	sc('The hill above the reeds · the first spring of the restoration', '갈대밭 위 언덕 · 복권 첫 봄'),
	p(
		'The first thing the restored do with their names is bury somebody properly.',
		'복권된 사람들이 제 이름을 되찾고 맨 먼저 한 일은, 누군가를 제대로 묻어 주는 것이다.'
	),
	p(
		'Gildal has been in the reeds for thirty years under a stone with nothing on it. They lift him in daylight and carry him up the hill, where you can hear the Heungnyun bells. No Council men. No song.',
		'길달은 서른 해 동안 아무것도 새기지 않은 돌 밑, 갈대밭에 누워 있었다. 그들은 대낮에 그를 들어 올려 흥륜사 종소리가 들리는 언덕으로 메고 간다. 화백 사람은 없다. 노래도 없다.'
	),
	p(
		'The Rock Lady walks in front. The three brothers who aren’t brothers carry the bier, grey at the temples now. The one who never took off his red mask has taken it off.',
		'바위 할매가 맨 앞에서 걷는다. 형제 아닌 세 형제가 상여를 멘다. 이제 관자놀이가 희끗하다. 빨간 탈을 한 번도 벗지 않던 녀석은 오늘 탈을 벗었다.'
	),
	p(
		'At the top, the girl from the culvert step, forty now, unties the fox mask she has worn since she was six and puts it in Yongsu’s hands. She doesn’t need it any more. She has a name.',
		'꼭대기에서, 수로 계단의 그 계집아이가, 이제 마흔인 그녀가, 여섯 살부터 쓰던 여우탈을 풀어 용수 손에 쥐여 준다. 이제 그녀에겐 필요 없다. 이름이 있으니까.'
	),
	p(
		'He ties it to a pole himself and drives the pole into the top of the mound, so the fox looks down the south road.',
		'그는 손수 그것을 장대에 매달아 봉분 꼭대기에 꽂는다. 여우가 남쪽 길을 내려다보도록.'
	),
	d('yongsu', ['There. Now you’ll see them coming.', '…I’m the late one this time. Thirty years.'], ['됐다. 이제 오는 게 다 보이지.', '…이번엔 내가 늦었네. 서른 해나.']),
	d('chunmyung', ['He’d say you were exactly on time.'], ['그 사람이면 딱 맞춰 왔다고 할 거야.']),
	d('yongsu', ['He’d say it to be polite.', 'Then he’d shim the pole.'], ['예의상 그러겠지.', '그러고는 장대를 괴어 놓겠지.']),
	p('Down in the valley the Heungnyun bell rings the hour. Exactly on it.', '골짜기 아래에서 흥륜사 종이 시를 친다. 딱 맞춰서.')
];
ys.blocks.splice(find(ys, 'The next morning the east wing gets a new resident') + 1, 0, ...mound);

// ── Yongsu: the tower, between the bluff and the burial ─────────────────
const before = JSON.parse(fs.readFileSync('scripts/.cache/bihyung-rewrite/story.before8.json', 'utf8'));
const oldBh = before.flatMap((c) => c.entries).find((e) => e.title === 'Bihyung');
const tFrom = find(oldBh, 'Ten years later the queen wants a tower.') - 1;
const tTo = find(oldBh, 'The tower goes up within the year.');
const tower = structuredClone(oldBh.blocks.slice(tFrom, tTo + 1));
tower[0] = sc('Hwangnyong Temple · the tower yard', '황룡사 · 탑 마당', { year: 645, en: 'Three Years Later…', ko: '세 해 뒤…' });
tower[1] = { ...tower[1], html: tower[1].html.replace('Ten years later the queen', 'The queen'), ko: tower[1].ko.replace(/^열 해 뒤\s*/, '') };
if (!ys.blocks.some((b) => JSON.stringify(b).includes('Ten years later the queen wants a tower') || JSON.stringify(b).includes('The queen wants a tower')))
	ys.blocks.splice(find(ys, 'The hill west of the stream · the burial'), 0, ...tower);

// ── images: drop Bihyung stills whose lines left (Yongsu already has them) ─
const lc = (t) => t.toLowerCase();
const anchored = (e, m) => !m.at || e.blocks.some((b) => lc(JSON.stringify(b)).includes(lc(m.at)));
const ysArt = new Set(ys.images.map((m) => m.tempImage));
for (const m of oldBh.images.filter((m) => !anchored(bh, m) && !ysArt.has(m.tempImage)))
	if (anchored(ys, m)) ys.images.push({ ...m, id: 'ys-' + m.id.replace(/^bh-/, '') });
const lost = bh.images.filter((m) => !anchored(bh, m)).map((m) => m.id);
bh.images = bh.images.filter((m) => anchored(bh, m));

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('removed from Bihyung:', lost.join(', ') || 'none');
console.log('unanchored in Yongsu:', ys.images.filter((m) => !anchored(ys, m)).map((m) => m.id));
