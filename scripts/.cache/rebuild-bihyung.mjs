// One-off: rebuild the Bihyung episode around the Samguk Yusa tale (Jinji → Yeji → Bihyung → bridge → Gildal).
import fs from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(path, 'utf8'));
const entry = story.flatMap((c) => c.entries).find((e) => e.title === 'Bihyung');
const old = entry.blocks;
if (old.length !== 73) throw new Error(`unexpected block count ${old.length}; already rebuilt?`);

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, ko) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines: ko, en });
const voice = (speaker, en, ko) => ({ kind: 'dialogue', speaker, lines: ko, en });
const plate = (label, ko, year, en, jumpKo) => ({ kind: 'scene', label, ko, jump: { year, en, ko: jumpKo } });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const deathbed = old.slice(0, 22); // opening, deathbed, confession, Kangrim, epitaph
const tellIt = old[22];

const jinheung = [
	plate('The palace · the Cloud King’s last night', '궁 · 구름왕의 마지막 밤', 576, '72 Years Earlier…', '72년 전…'),
	p(
		'You’ve met the Cloud King. He doubled Silla, broke an ally, and put up stones on every mountain he could climb. At the end he shaved his head and put on a monk’s robe, as if heaven might not recognise him.',
		'구름왕은 이미 만났다. 신라를 두 배로 키웠고, 동맹을 저버렸고, 오를 수 있는 산마다 비석을 세웠다. 마지막에는 머리를 깎고 승복을 입었다. 하늘이 못 알아보기라도 할 것처럼.'
	),
	p(
		'His eldest son died four years ago. So the son kneeling by the bed tonight is the second one, Saryun, who smells of plum wine.',
		'맏아들은 네 해 전에 죽었다. 그래서 오늘 밤 침상 곁에 무릎 꿇은 아들은 둘째, 사륜이다. 매실주 냄새가 난다.'
	),
	say('jinheung', ['You’ve been drinking.', '…Good. Somebody should enjoy this family.'], ['마셨구나.', '…잘했다. 이 집안에 누구 하나는 즐거워야지.']),
	say('jinji', ['Father, the physicians say—', 'They say you’ll see the spring.'], ['아버님, 의원들이—', '봄은 보실 거랍니다.']),
	say(
		'jinheung',
		['Physicians count days. Councils count kings.', 'Listen to me, Saryun. When I’m gone, six old men will sit in a room and decide whether you were a good idea.', 'Don’t give them a reason to count twice.'],
		['의원은 날을 세고, 회의는 임금을 센다.', '들어라, 사륜아. 내가 가면 늙은이 여섯이 방에 앉아서 네가 괜찮은 생각이었는지 정할 거다.', '두 번 세게 만들지 마라.']
	),
	say('jinji', ['And if they do?'], ['세면요?']),
	say('jinheung', ['Then be more interesting than the arithmetic.', '…I always was.'], ['그럼 셈보다 재미있는 사람이 돼라.', '…난 늘 그랬다.']),
	p(
		'He dies before the bell. His queen, Sado, closes his eyes herself and does not call for anyone for a long time.',
		'그는 종이 울리기 전에 숨을 거둔다. 왕비 사도가 손수 눈을 감겨 준다. 그러고는 한참 동안 아무도 부르지 않는다.'
	),
	scene('The Harmony Council · three days later', '화백회의 · 사흘 뒤'),
	p(
		'Six sleeves around a table, and one boy at the end of it with a brush. Supum is fifteen. He is here to write down what the old men say, and to say nothing.',
		'탁자에 둘러앉은 소매 여섯, 그리고 끝자리에 붓을 든 소년 하나. 수품은 열다섯이다. 늙은이들이 하는 말을 받아 적으러 왔다. 아무 말도 하지 말라는 소리도 함께 들었다.'
	),
	say(
		'geochilbu',
		['He hunts. He drinks. He has opinions about other men’s wives.', 'He has never once read a tax roll.'],
		['사냥하고, 마시고, 남의 아내들에 대해 할 말이 많소.', '세금 장부는 한 번도 읽은 적이 없소.']
	),
	voice('Councillor', ['His brother read them. His brother is dead.', 'We have the one we have.'], ['그 형님은 읽었지요. 형님은 죽었고.', '있는 사람으로 가야지요.']),
	say('supum', ['…Then why are we voting?'], ['…그럼 왜 표결을 합니까?']),
	p('Six heads turn to the end of the table. The boy goes red to the ears.', '여섯 머리가 탁자 끝으로 돈다. 소년은 귀까지 빨개진다.'),
	say(
		'geochilbu',
		['Because one day we may need to remember that we did.', 'Write that down, boy. No— don’t write that down.'],
		['언젠가 우리가 표결했다는 걸 기억해야 할 날이 올지 모르니까.', '그거 적어라, 얘야. 아니— 그건 적지 마라.']
	),
	p(
		'The vote is unanimous. It always is, here. Supum writes the new king’s name in the minutes, very neatly, and sixty years later he will still be the man who keeps this room’s minutes. Remember his face.',
		'표결은 만장일치다. 여기선 늘 그렇다. 수품은 새 임금의 이름을 회의록에 아주 반듯하게 적는다. 예순 해 뒤에도 그는 이 방의 회의록을 지키는 사람일 것이다. 얼굴을 기억해 두라.'
	),
	p('Saryun is crowned before the month is out. They call him Jinji.', '사륜은 그달이 가기 전에 왕관을 쓴다. 사람들은 그를 진지왕이라 부른다.')
];

const crisis = [
	plate('The palace · the wine years', '궁 · 술의 해들', 578, 'Two Years Later…', '두 해 뒤…'),
	p(
		'To be fair to him, he tries. The first winter Baekje comes over the western hills, and his general throws it back with three thousand seven hundred heads. Jinji builds a fort where the fight was and goes to look at it personally.',
		'공정하게 말하자면, 그도 애는 쓴다. 첫겨울 백제가 서쪽 고개를 넘어오고, 그의 장수가 머리 삼천칠백을 베어 물리친다. 진지왕은 싸운 자리에 성을 쌓고 몸소 가서 둘러본다.'
	),
	p(
		'Then Baekje comes back. A mountain fort goes, then the roads around it. Goguryeo leans on the northern wall just to see if it moves. Every messenger who reaches the palace is muddier than the last.',
		'그러다 백제가 다시 온다. 산성 하나가 넘어가고, 그 둘레 길들이 끊긴다. 고구려는 북쪽 성벽이 밀리나 보려고 괜히 기댄다. 궁에 닿는 전령은 갈수록 진흙투성이다.'
	),
	voice('Messenger', ['Majesty— Alya mountain— it’s gone, they came at night and—'], ['전하— 알야산성이— 넘어갔습니다, 밤에 와서—']),
	say('jinji', ['Gone where?', '…Pour him a cup. He’s shaking. Pour me one too.'], ['어디로 갔는데?', '…저 사람한테 한 잔 따라 줘라. 떨고 있잖아. 나도 한 잔.']),
	p(
		'By the second year the cups come earlier in the day. The council sits outside his door with its reports, and through the door it can hear a zither, and laughing, and a different woman’s voice each week.',
		'둘째 해가 되자 잔이 하루 중 점점 일찍 나온다. 회의는 보고서를 들고 그의 문밖에 앉아 기다린다. 문 너머로 거문고 소리, 웃음소리, 그리고 주마다 다른 여인의 목소리가 들린다.'
	),
	say('sado', ['Saryun. Open the door.', 'Your mother is not one of your guests. Open it.'], ['사륜아. 문 열어라.', '이 어미는 네 손님이 아니다. 열어.']),
	say(
		'jinji',
		['Mother! Come in, come in— we’re celebrating.', 'We won a battle once. I like to keep it fresh.'],
		['어머니! 들어오세요, 들어와요— 잔치 중입니다.', '한 번 이긴 적이 있잖아요. 잊지 않으려고요.']
	),
	say('sado', ['You lost three forts this spring.'], ['이번 봄에만 성 셋을 잃었다.']),
	say('jinji', ['Then I’ll need three more cups.'], ['그럼 석 잔 더 해야겠네요.']),
	p(
		'Hold on to this picture: a king in a lit room, a war going badly outside it, and the door shut. You’ll see it again, eighty years from now, in another capital, with a better poet behind the door.',
		'이 장면을 기억해 두라. 불 밝힌 방 안의 임금, 문밖에서 무너지는 전쟁, 닫힌 문. 여든 해쯤 뒤, 다른 도성에서 또 보게 된다. 문 뒤엔 더 나은 시인이 앉아 있을 것이다.'
	)
];

const yeji = [
	plate('Saryang ward · the king’s summons', '사량부 · 임금의 부름', 579, 'One Year Later…', '한 해 뒤…'),
	p(
		'In Saryang ward there is a woman so lovely the neighbours call her the peach blossom. Her name is Yeji. She is married to a man who sells charcoal, and she likes him.',
		'사량부에 이웃들이 복숭아꽃이라고 부를 만큼 고운 여인이 산다. 이름은 예지. 숯 파는 사내의 아내이고, 그 사내를 좋아한다.'
	),
	p(
		'The king hears about her the way kings hear about everything. By evening she is standing in his hall, still in her apron.',
		'임금은 다른 모든 일을 듣는 식으로 그녀 이야기를 듣는다. 저녁이 되자 그녀는 앞치마도 못 벗은 채 그의 전각에 서 있다.'
	),
	say('jinji', ['So you’re the peach blossom.', 'Stay tonight. Stay as long as you like.'], ['네가 그 복숭아꽃이구나.', '오늘 밤 있어라. 있고 싶은 만큼.']),
	say('yeji', ['I have a husband, Majesty.', 'A woman has one. Not two. Not even for a king.'], ['저는 남편이 있어요, 전하.', '여자는 남편이 하나예요. 둘은 안 돼요. 임금님이라도요.']),
	say('jinji', ['I could have you killed for that.'], ['그 말로 너를 죽일 수도 있다.']),
	say('yeji', ['I know.', '…Then kill me. I’d rather that than the other thing.'], ['알아요.', '…그럼 죽이세요. 그 편이 나아요.']),
	p(
		'The hall goes very quiet. The musicians look at the floor. Somebody’s cup tips and nobody rights it.',
		'전각이 아주 조용해진다. 악공들은 바닥만 본다. 누군가의 잔이 기울어지는데 아무도 세우지 않는다.'
	),
	say('jinji', ['…And if you had no husband?', 'Would you come then?'], ['…남편이 없다면?', '그럼 오겠느냐?']),
	say('yeji', ['Then, yes.'], ['그럼, 네.']),
	p(
		'He laughs, really laughs, for the first time in a year, and lets her go home. It is the most kingly thing he does in his whole reign.',
		'그는 웃는다. 한 해 만에 처음으로 진짜로. 그리고 그녀를 집에 보내 준다. 그의 치세를 통틀어 가장 임금다운 일이다.'
	),
	scene('The Harmony Council · that summer', '화백회의 · 그해 여름'),
	p(
		'That summer the room counts again. Three counts, six sleeves. The boy at the end of the table writes it down, and this time his hand shakes.',
		'그해 여름, 그 방은 다시 센다. 세 번의 셈, 소매 여섯. 탁자 끝의 소년이 받아 적는다. 이번엔 손이 떨린다.'
	),
	say('jinji', ['You would unseat a Sacred Bone for a night’s rumour?'], ['하룻밤 소문으로 성골을 끌어내리겠다는 거요?']),
	say('sado', ['Not for one night, Saryun. For three years of them.'], ['하룻밤이 아니다, 사륜아. 세 해 동안의 밤들이다.']),
	p(
		'His nephew, a boy of twelve, is crowned instead. Jinji is shut in a house with a very high wall, and three months later he dies in it. His own son Yongsu is four, and has no idea what the wall is for.',
		'대신 열두 살 조카가 왕관을 쓴다. 진지왕은 담이 아주 높은 집에 갇히고, 석 달 뒤 그 안에서 죽는다. 그의 아들 용수는 네 살이다. 담이 무엇에 쓰이는지 전혀 모른다.'
	),
	old[25], // the house dropped a bone
	old[26] // royal diagram
];

const ghost = [
	plate('Saryang ward · the tenth night', '사량부 · 열흘째 밤', 581, 'Two Years Later…', '두 해 뒤…'),
	p(
		'Two years later the charcoal seller dies of a fever. Yeji buries him and wears white. On the tenth night after the funeral, somebody knocks.',
		'두 해 뒤, 숯장수가 열병으로 죽는다. 예지는 그를 묻고 흰옷을 입는다. 장례 뒤 열흘째 밤, 누군가 문을 두드린다.'
	),
	p(
		'It is the king. Not a ghost-shaped smoke. The king, exactly as he was, in his good robe, a little embarrassed, holding his hat.',
		'임금이다. 귀신 모양의 연기가 아니다. 살아 있을 때 그대로의 임금. 좋은 옷을 입고, 조금 쑥스러운 얼굴로, 갓을 손에 들고.'
	),
	say('jinji', ['You said, if you had no husband.', '…I’ve been waiting a long time to ask again.'], ['남편이 없으면, 이라고 했지.', '…다시 물어보려고 오래 기다렸다.']),
	say('yeji', ['You’re dead, Majesty.'], ['전하는 돌아가셨잖아요.']),
	say('jinji', ['So was my patience. Both came back.'], ['내 인내심도 죽었었지. 둘 다 돌아왔다.']),
	p('She does not answer him. She goes to her parents’ room in her night robe and wakes them.', '그녀는 대답하지 않는다. 잠옷 바람으로 부모 방에 가서 그들을 깨운다.'),
	voice('Yeji’s mother', ['…The king? THAT king?', 'Child, a king’s word isn’t a thing you say no to. Living or not.'], ['…임금님? 그 임금님?', '얘야, 임금님 말씀은 거절하는 게 아니야. 살아 계시든 아니든.']),
	say('yeji', ['I already said yes, Mother. Two years ago.', 'I just wanted someone to know.'], ['이미 그러겠다고 했어요, 어머니. 두 해 전에.', '그냥 누군가는 알았으면 해서요.']),
	p(
		'For seven days the house is wrapped in coloured cloud. The whole lane smells of incense. Neighbours stand in the street and argue about whether to call a priest, and nobody does. On the eighth morning the cloud lifts, and the king is gone.',
		'이레 동안 그 집은 오색구름에 덮인다. 골목 전체에 향내가 난다. 이웃들은 길에 서서 무당을 불러야 하나 말다툼을 하지만, 아무도 부르지 않는다. 여드레째 아침 구름이 걷히고, 임금은 사라졌다.'
	),
	p(
		'I was watching that week. I won’t tell you what I saw. I’ll only say that when her son was born, the ground shook, and the midwife ran out of the house and would not come back for her fee.',
		'그 주에 나는 지켜보고 있었다. 무엇을 봤는지는 말하지 않겠다. 다만 그 아들이 태어나던 날 땅이 흔들렸고, 산파가 집 밖으로 뛰쳐나가 품삯도 받으러 돌아오지 않았다는 것만 말해 두자.'
	),
	p('She names him Bihyung.', '그녀는 아이를 비형이라 이름 짓는다.')
];

const boyhood = [
	plate('The palace · the west wall at night', '궁 · 밤의 서쪽 담', 596, 'Fifteen Years Later…', '열다섯 해 뒤…'),
	p(
		'King Jinpyung hears the story the way the whole city hears it, and does what clever kings do with strange children: he takes the boy into the palace where he can see him. At fifteen Bihyung is made a clerk. He is good at it. He is also never in his bed.',
		'진평왕은 온 도성이 듣는 식으로 그 이야기를 듣는다. 그리고 영리한 임금들이 이상한 아이에게 하는 일을 한다. 눈에 보이는 궁 안으로 데려온다. 열다섯에 비형은 집사가 된다. 일을 잘한다. 그런데 잠자리에 있는 적이 없다.'
	),
	say('jinpyung', ['Fifty men. On the walls. All night.', 'If a clerk can get past fifty men, I want to know how.'], ['오십 명. 담 위에. 밤새.', '집사 하나가 오십 명을 지나간다면, 어떻게 하는지 알아야겠다.']),
	p(
		'He gets past fifty men. The guards swear he went over the west wall of the moon palace like a bird, and came down on the bank of the Hwangchun, where something was waiting for him in the reeds. They play until the temple bells ring for dawn. Then the reeds are empty and the clerk walks back in through the front gate, yawning.',
		'그는 오십 명을 지나간다. 군사들은 그가 새처럼 월성 서쪽 담을 넘어 황천 둑에 내려앉았고, 갈대숲에서 무언가가 그를 기다리고 있었다고 맹세한다. 그들은 새벽 절 종이 울릴 때까지 논다. 그러면 갈대숲은 텅 비고, 집사는 하품을 하며 정문으로 걸어 들어온다.'
	),
	voice('Guard', ['Sir, I swear on my mother— they had no feet, they had— they were laughing, sir—'], ['나리, 어머니를 걸고 맹세합니다— 발이 없었어요, 걔들은— 웃고 있었습니다, 나리—']),
	p('Somebody else is on the bank most nights, too. Bihyung’s half-brother. The real king’s real son.', '거의 매일 밤, 둑에는 다른 사람도 하나 있다. 비형의 이복형. 진짜 임금의 진짜 아들.'),
	p(
		'Yongsu is twenty-one, and his cousin King Jinpyung has two daughters and no son, and the court is doing arithmetic. A deposed king’s son is a very interesting number. Men start visiting Yongsu with gifts. Men who visit with gifts are counting.',
		'용수는 스물하나다. 사촌 형 진평왕에게는 딸만 둘 있고 아들이 없다. 조정은 셈을 시작한다. 폐위된 임금의 아들은 아주 흥미로운 숫자다. 사내들이 선물을 들고 용수를 찾아오기 시작한다. 선물을 들고 오는 사내들은 세고 있는 것이다.'
	),
	old[28],
	old[29],
	p(
		'That night he follows his little brother down to the stream in his sleeping robe and talks to the water until dawn. The night watch hears him laughing. By the market hour, so has everybody else.',
		'그날 밤 그는 잠옷 바람으로 동생을 따라 개울에 내려가 새벽까지 물에 말을 건다. 순라꾼들이 그가 웃는 소리를 듣는다. 장이 설 무렵엔 온 도성이 다 들었다.'
	),
	say('bihyung', ['Hyung. You can’t see them, can you.'], ['형. 형은 쟤들 안 보이지?']),
	say('yongsu', ['Not one.', 'Keep talking to them. Loudly. I’ll do the laughing.'], ['하나도.', '계속 말 걸어. 크게. 웃는 건 내가 할게.']),
	p('The men with gifts stop coming. Nobody counts the madman’s brother. Nobody counts the madman, either.', '선물 든 사내들은 발길을 끊는다. 미치광이의 형은 아무도 세지 않는다. 미치광이도 아무도 세지 않는다.')
];

const bridge = [
	plate('The Sinwon temple ditch · night', '신원사 북쪽 도랑 · 밤', 602, 'Six Years Later…', '여섯 해 뒤…'),
	p('King Jinpyung, who is bored and cleverer than his court, decides to see for himself.', '진평왕은 지루하고, 조정보다 영리하다. 직접 확인해 보기로 한다.'),
	say('jinpyung', ['They say you run with goblins.', 'Is it true?'], ['네가 도깨비들과 논다더구나.', '사실이냐?']),
	say('bihyung', ['Yes, Majesty.'], ['네, 전하.']),
	say(
		'jinpyung',
		['Good. I need a bridge over the ditch north of Sinwon temple, and my engineers want a year.', 'Your friends get one night.'],
		['좋다. 신원사 북쪽 도랑에 다리가 필요한데, 장인들은 한 해를 달란다.', '네 친구들한테는 하룻밤이다.']
	),
	say('bihyung', ['One night.', '…They’ll want rice cakes.'], ['하룻밤요.', '…떡을 달라고 할 거예요.']),
	p('Behind the king, in the line of True Bones who came to watch, Yongsu has gone quite still.', '임금 뒤, 구경 나온 진골들 줄 속에서 용수가 굳어 있다.'),
	old[38],
	old[39],
	scene('The Ghost Bridge · the next night', '귀교 · 이튿날 밤'),
	...old.slice(41, 47),
	scene('The palace · breakfast', '궁 · 아침상'),
	...old.slice(48, 53),
	old[53]
];

const gildal = [
	scene('The palace · the ghost clerk', '궁 · 귀신 집사'),
	p('The king is not finished with his goblins.', '임금은 도깨비들과 아직 볼일이 남았다.'),
	say(
		'jinpyung',
		['Among your friends. Is there one who can wear a man’s shape and help me govern?', 'I have a great many men who wear a man’s shape and don’t.'],
		['네 친구들 가운데. 사람 꼴을 하고 나랏일을 도울 만한 자가 있느냐?', '사람 꼴을 하고 안 돕는 자는 이미 넘치게 있다.']
	),
	say('bihyung', ['Gildal. He’s very punctual.'], ['길달이요. 시간을 아주 잘 지켜요.']),
	p(
		'The next morning there is a new clerk in the palace. He is never late, never wrong and never seen to eat. Within a year there is no more loyal man in the government, which says something about the government.',
		'이튿날 아침 궁에 새 집사가 하나 생긴다. 늦는 법도, 틀리는 법도 없고, 먹는 걸 본 사람도 없다. 한 해가 지나자 조정에 그보다 충직한 사람이 없다. 조정에 대해 많은 걸 말해 주는 일이다.'
	),
	say('gildal', ['I have never once been late, Majesty.', 'It is the only thing about men I truly admire. Your bells.'], ['저는 한 번도 늦은 적이 없습니다, 전하.', '사람에게서 제가 정말로 탄복하는 건 그것뿐입니다. 종소리.']),
	p(
		'The councillor Imjong has no son, and the king tells him to adopt one. He adopts Gildal. Gildal builds his new father a gate tower south of Heungnyun temple and sleeps on top of it every night, which the neighbours find reassuring until they think about it.',
		'대등 임종은 아들이 없다. 임금은 그에게 양자를 들이라고 한다. 그는 길달을 들인다. 길달은 새 아버지를 위해 흥륜사 남쪽에 문루를 세우고, 밤마다 그 꼭대기에서 잔다. 이웃들은 그게 든든하다고 여긴다. 곰곰 생각해 보기 전까지는.'
	),
	p(
		'One morning the gate is empty, and a fox is running down the road to the south with its tail very low. Bihyung doesn’t chase it himself. He goes down to the reeds and says a few words, and that night the goblins bring it back to him, and kill it.',
		'어느 아침 문루가 비어 있고, 여우 한 마리가 꼬리를 바짝 낮춘 채 남쪽 길로 달아나고 있다. 비형은 몸소 쫓지 않는다. 갈대숲에 내려가 몇 마디 한다. 그날 밤 도깨비들이 그것을 그에게 끌고 와, 죽인다.'
	),
	say('yongsu', ['…He was your friend.'], ['…네 친구였잖아.']),
	say('bihyung', ['He was late, Hyung.', 'First time ever.'], ['늦었어, 형.', '처음으로.']),
	p(
		'After that the ghosts of Surabol are afraid of one name. The city writes it on paper and pastes it over its doors.',
		'그 뒤로 서라벌의 귀신들은 이름 하나를 무서워한다. 도성 사람들은 그 이름을 종이에 써서 문 위에 붙인다.'
	),
	old[32],
	p(
		'The charm says Bihyung, but the neighbours paste it on the house by the stream too, where the elder brother still goes out at night. Nobody counts a house with a charm on the door.',
		'주문엔 비형이라고 적혀 있지만, 이웃들은 개울가 그 집에도 붙인다. 형이 아직도 밤마다 나가는 집. 문에 주문 붙은 집은 아무도 세지 않는다.'
	),
	old[54]
];

const chunchuBoy = old.slice(55, 63);
const sunduk = old.slice(63, 69);
const ending = old.slice(69);

const sources = {
	kind: 'p',
	html: 'The tale of the peach-blossom woman, the ghost bridge and Gildal the fox is in the Samguk Yusa. The Samguk Sagi gives the Cloud King’s monk’s robe, Jinji’s war and his death. The rest, as usual, is family gossip.',
	ko: '복숭아꽃 여인과 귀신 다리, 여우 길달의 이야기는 삼국유사에 있다. 구름왕의 승복, 진지왕의 전쟁과 죽음은 삼국사기가 전한다. 나머지는 늘 그렇듯 집안 이야기다.'
};

entry.blocks = [
	...deathbed,
	tellIt,
	...jinheung,
	...crisis,
	...yeji,
	...ghost,
	...boyhood,
	...bridge,
	...gildal,
	...chunchuBoy,
	...sunduk,
	...ending.slice(0, -1),
	sources,
	ending[ending.length - 1]
];

fs.writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log(`Bihyung: ${old.length} → ${entry.blocks.length} blocks`);
