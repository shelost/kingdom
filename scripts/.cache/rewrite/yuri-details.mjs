// One-shot: Yuri Isageum fun details (Dosolga, Gabae/Chuseok, 17 ranks, Lelang/Maek/Iseoguk, Sareung burial).
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const anchor = 'A village with a surname has decided to stay.';
if (!t.includes(anchor)) throw new Error('anchor missing');
const blocks = `{
						"kind": "p",
						"html": "In his fifth year Yuri does something no king before him has done. He writes a song. The court sings the Dosolga at every feast after that. The shy boy who counted teeth has the whole hall singing his words back at him.",
						"ko": "5년째에 유리는 그전 임금들이 아무도 한 적 없는 일을 한다. 노래를 짓는다. 그 뒤로 궁에서는 잔치 때마다 도솔가를 부른다. 이빨 세던 수줍은 소년이 온 전각에 제 노랫말을 되받아 부르게 만든 것이다."
					},
					{
						"kind": "p",
						"html": "Then he invents a holiday. On the full moon of the eighth month he splits the women of the six houses into two weaving teams, and the side with more cloth by moonrise wins. The losers feast the winners, and everyone sings the Hoesogok. The wager is called Gabae. They still play it. You call it Chuseok.",
						"ko": "그리고 명절을 하나 만든다. 8월 보름달이 뜨면 여섯 집안의 여인들을 두 편으로 갈라 베를 짜게 한다. 달이 뜨기까지 더 많이 짠 편이 이긴다. 진 편이 이긴 편에 잔치를 차리고, 다 함께 회소곡을 부른다. 그 내기의 이름은 가배다. 지금도 한다. 사람들은 추석이라 부른다."
					},
					{
						"kind": "p",
						"html": "He counts the offices too. Seventeen ranks, from Ibeolchan at the top to Jowi at the bottom. Every man in Surabol now knows exactly how tall he stands.",
						"ko": "관직도 다 센다. 이벌찬부터 조위까지 열일곱 등급. 서라벌의 모든 사내는 이제 제 키가 얼마인지 정확히 안다."
					},
					{
						"kind": "p",
						"html": "Lelang marches on his border. Yuri makes peace with the Maek instead of fighting two enemies at once, and takes the hill fort of Iseoguk.",
						"ko": "낙랑이 국경을 치고 들어온다. 유리는 두 적과 한꺼번에 싸우는 대신 맥과 화친하고, 산골의 이서국 성을 취한다."
					},
					{
						"kind": "p",
						"html": "Years later Goguryeo smashes Lelang\u2019s city, and five thousand Lelang people walk south. Yuri divides them among the six houses. Uninvited new cousins.",
						"ko": "몇 해 뒤 고구려가 낙랑 성을 깨뜨리자 낙랑 사람 오천이 남쪽으로 걸어 내려온다. 유리는 그들을 여섯 집안에 나누어 준다. 초대받지 못한 새 사촌들이다."
					},
					`;
const idx = t.indexOf(anchor);
const blockEnd = t.indexOf('},', idx) + 2;
t = t.slice(0, blockEnd) + '\n\t\t\t\t\t' + blocks.trimEnd() + t.slice(blockEnd);
const burialOld =
	'Then he is dead, and nobody in Surabol knows whether a dead king\u2019s word is enough.';
if (!t.includes(burialOld)) throw new Error('burial anchor missing');
t = t.replace(
	burialOld,
	'Then he is dead, and nobody in Surabol knows whether a dead king\u2019s word is enough. They lay him at Sareung, the Snake Mound.'
);
const burialKo = '서라벌의 누구도 죽은 임금의 말 한마디로 충분한지 모른다.';
t = t.replace(burialKo, burialKo + ' 사릉, 뱀무덤에 눕힌다.');
fs.writeFileSync(f, t);
console.log('done');
