// One-off: the Yellow Sea attack from the Silla deck — sighting, chase, fire, boarding, the stern ladder, the ram.
import fs from 'node:fs';
const S = 'src/lib/data/story.json';
const o = JSON.parse(fs.readFileSync(S, 'utf8'));
const e = o.flatMap((c) => c.entries ?? []).find((x) => x.title.startsWith('Huangdi'));
const b = e.blocks;
const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (speaker, gender, en, lines) => ({ kind: 'dialogue', speaker, gender, lines, en });
const k = b.findIndex((x) => x.kind === 'scene' && x.label === 'The Yellow Sea');
const m = b.findIndex((x) => x.html?.startsWith('By red dawn they are wading'));
if (k < 0 || m < k) throw new Error('anchors');
const old = b.slice(k + 1, m);
const keep = (frag) => {
	const x = old.find((y) => JSON.stringify(y).includes(frag));
	if (!x) throw new Error(frag);
	return x;
};
const CAPTAIN = 'The Goguryeo commander';
const MASTER = 'The Silla shipmaster';
const LOOKOUT = 'The lookout';
const SAILOR = 'A Silla sailor';
const OFFICER = 'A Silla officer';

const seq = [
	P('A day out to sea, under a full moon, the boy at the masthead stops singing.', '바다로 나온 지 하루, 보름달 아래, 돛대 꼭대기의 소년이 노래를 멈춘다.'),
	D(LOOKOUT, 'm', ['Sail! Sail astern!', '…Wait. Red. Red banner— GOGURYEO! GOGURYEO!'], ['돛이다! 고물 쪽에 돛!', '……잠깐. 붉은. 붉은 깃발— 고구려다! 고구려다!']),
	D(MASTER, 'm', ['All hands! Oars out, both banks! Get the envoy below!'], ['전원 기상! 양쪽 노 내려! 사신 어른 아래로 모셔!']),
	P('One hull comes up out of the haze behind them, black against the moon. Flat-bottomed and plank-built, one square sail of woven matting, two banks of oars, a fighting deck raised at the stern. It is lighter than the embassy ship, and it was built for exactly this.',
		'안개 속에서 배 한 척이 달을 등지고 검게 올라온다. 바닥이 평평한 널판 배, 돗자리를 엮은 네모 돛 하나, 양쪽으로 늘어선 노, 고물에 높이 세운 싸움 다락. 사신선보다 가볍고, 바로 이런 일을 하려고 만든 배다.'),
	keep('sits a man in white and purple'),
	P('The chase runs into the small hours. The embassy ship’s rowers pull until their palms open. The red banner gains anyway, one oar-stroke at a time, close enough now to hear their drum.',
		'추격은 새벽 깊은 시각까지 이어진다. 사신선 노꾼들은 손바닥이 터질 때까지 젓는다. 그래도 붉은 깃발은 한 번 젓는 만큼씩 따라붙는다. 이제는 저쪽 북소리가 들릴 만큼 가깝다.'),
	D(MASTER, 'm', ['Pull! PULL!', 'You want to row for Pyongyang the rest of your lives?! Pull!'], ['저어! 저으라고!', '평생 평양 놈들 배에서 노나 저을 테냐?! 저어!']),
	keep('The lead ship carries the commander'),
	keep('There. White and purple.'),
	keep('The sky fills.'),
	D(SAILOR, 'm', ['Water! Water on the sail— no, cut it, CUT IT LOOSE—'], ['물! 돛에 물— 아니, 잘라, 끊어 버려—']),
	keep('get below! Please!'),
	keep('does not answer. He sits very straight'),
	D(CAPTAIN, 'f', ['Grapples. Bring her alongside.', 'I said I want to see him. I meant up close.'], ['갈고리. 옆에 붙여.', '얼굴을 보고 싶다고 했지. 가까이서란 뜻이었어.']),
	P('Iron hooks bite the embassy rail. The two hulls grind together, and Goguryeo comes over the side: marines in steel lamellar to the knee, red cloth wings at the shoulder, spears first and ring-pommel swords behind. Silla meets them at the rail in its own lamellar and tall pointed helms, blue cloth at the collar, shields up. The deck is fire on one side and the sea on the other, and nobody has room to fall.',
		'쇠갈고리가 사신선 난간을 문다. 두 배가 맞부딪혀 갈리고, 고구려가 뱃전을 넘어온다. 무릎까지 오는 강철 비늘 갑옷, 어깨에 붉은 날개 천, 창이 앞서고 환두대도가 뒤따른다. 신라는 난간에서 맞선다. 저들 나름의 비늘 갑옷과 높고 뾰족한 투구, 깃에 푸른 천, 방패를 올리고. 갑판 한쪽은 불이고 다른 쪽은 바다다. 쓰러질 자리도 없다.'),
	D(OFFICER, 'm', ['To the stern! The ladder! Nobody touches the envoy!', 'NOBODY! Do you hear me?!'], ['고물로! 사다리를 막아! 사신 어른께 손 하나 못 대게 해!', '아무도! 알아들어?!']),
	P('They hold the stern ladder. They hold it for as long as men can hold a ladder against more men, and then for a while after. Above them the envoy sits in his high cap and watches every one of them die for him, and does not move, and does not say a word.',
		'그들은 고물 사다리를 지킨다. 사람이 더 많은 사람을 상대로 사다리를 지킬 수 있는 만큼, 그리고 그 뒤로도 한동안. 그 위에서 사신은 높은 관을 쓰고 앉아, 자기를 위해 하나하나 죽어 가는 그들을 지켜본다. 움직이지 않는다. 한마디도 하지 않는다.'),
	D(CAPTAIN, 'f', ['Enough. Everyone back aboard.', 'Ram her.'], ['됐어. 전원 복귀.', '들이받아.']),
	keep('The lead ship comes in under oars')
];
b.splice(k + 1, m - k - 1, ...seq);
for (const im of e.images ?? []) if (im.id === 'ongunhae-sacrifice') im.at = 'One hull comes up out of the haze behind them';
fs.writeFileSync(S, JSON.stringify(o, null, '\t') + '\n');
console.log('ok', k, m);
