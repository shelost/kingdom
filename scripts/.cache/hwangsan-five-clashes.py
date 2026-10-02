"""Rework Yellow Mountain Fields into the five clashes of the Samguk sagi."""
import json, os, re

P = 'src/lib/data/story.json'
d = json.load(open(P))
e = d[8]['entries'][1]
assert e['title'] == 'Yellow Mountain Fields'
B = e['blocks']

GYEBEK = '#d9b13a'
HEUMSUN = '#4f7fc4'


def find(pred, what):
    hits = [i for i, b in enumerate(B) if pred(b)]
    assert len(hits) == 1, (what, hits)
    return hits[0]


def has(b, s):
    return s in (b.get('html') or '') or any(s in x for x in b.get('en', []))


def scene(label, ko):
    return {'kind': 'scene', 'label': label, 'ko': ko}


def p(html, ko):
    return {'kind': 'p', 'html': html, 'ko': ko}


def say(person, chip, en, ko):
    b = {'kind': 'dialogue', 'chip': chip, 'en': en, 'lines': ko}
    if person:
        b['person'] = person
    return b


def count(n_en, n_ko):
    return say('gyebek', GYEBEK, [n_en], [n_ko])


i_clashes = find(lambda b: has(b, 'Silla comes on the first time in three columns'), 'clashes')
i_quote4 = find(lambda b: b['kind'] == 'quote' and 'Four times they met' in b.get('html', ''), 'quote4')
i_report = find(lambda b: b['kind'] == 'dialogue' and b.get('en') == ['Report.'], 'report')
i_status = find(lambda b: has(b, 'Right has both, and less of each'), 'status')
assert (i_clashes, i_quote4, i_report, i_status) == (i_clashes, i_clashes + 1, i_clashes + 2, i_clashes + 3)
quote4, report, status = B[i_quote4], B[i_report], B[i_status]

fourth_ko = B[i_clashes]['ko'].split('네 번째에는', 1)[1]
clashes = [
    scene('The First Clash', '첫 번째 접전'),
    p(
        'Silla comes on the first time in three columns — Yushin centre, Heumsun left, Pumil right — down the three roads at once, exactly as the arithmetic says to. Uphill, in the heat, into yellow-lacquered shields set edge to edge behind the palisade. The Baekje archers do not loose until they can see which column has the most men in it, and then they loose at that one. The three Baekje camps throw them back into their own dust.',
        '신라가 처음으로 세 길로 온다 — 가운데 유신, 왼쪽 흠순, 오른쪽 품일 — 셈이 시키는 그대로, 세 길목을 한꺼번에. 더위 속에 오르막을 올라, 목책 뒤에 가장자리를 맞대어 세운 황칠 방패를 향해. 백제 궁수들은 어느 대열에 사람이 가장 많은지 보일 때까지 쏘지 않다가, 보이자 그 대열에만 쏜다. 백제 세 진영이 그들을 제 먼지로 되밀어낸다.'
    ),
    count('One.', '하나.'),
    scene('The Second Clash', '두 번째 접전'),
    p(
        'The second time Silla does not spread itself across three roads. It comes down the northern road in one fist at the left camp, hwarang in front, on the theory that the camp which shot the most is the camp with the fewest arrows left. It is a good theory. The left camp has counted its arrows too, and has been shooting half of what it could. The fist opens on the stakes and goes back up the road carrying its own.',
        '두 번째에 신라는 세 길로 흩어지지 않는다. 북쪽 길로 한 주먹이 되어 왼쪽 진영을 친다. 화랑을 맨 앞에 세우고. 가장 많이 쏜 진영이 화살이 가장 적게 남은 진영이라는 이론에서다. 좋은 이론이다. 왼쪽 진영도 제 화살을 세어 두었고, 쏠 수 있는 것의 절반만 쏘아 왔다. 주먹은 말뚝 앞에서 펴지고, 제 사람들을 메고 길을 되올라간다.'
    ),
    count('Two.', '둘.'),
    report,
    status,
    scene('The Third Clash', '세 번째 접전'),
    p(
        'The third time Pumil takes the southern road, where the ground is softest and the right camp sits lowest, and for the length of a held breath the right road almost opens — and closes again on spears counted in the night. The camp is not quite where Pumil’s scouts drew it at dawn. It is further back and higher, every pace of the difference is uphill, and the Silla line arrives at the stakes with nothing left in its legs.',
        '세 번째에 품일이 남쪽 길을 탄다. 땅이 가장 무르고 오른쪽 진영이 가장 낮게 앉은 곳. 숨 한 번 참는 동안 오른쪽 길이 거의 열렸다가 — 밤에 세어 둔 창에 다시 닫힌다. 진영은 새벽에 품일의 척후가 그려 온 자리에 꼭 있지 않다. 더 뒤에, 더 높은 곳에 있고, 그 차이의 걸음은 전부 오르막이라, 신라의 대열은 다리에 남은 것 없이 말뚝에 닿는다.'
    ),
    count('Three.', '셋.'),
    scene('The Fourth Clash', '네 번째 접전'),
    p(
        'The fourth time Yushin rides at the head of the centre himself, on the white horse, and meets Hundred-Victories in the gap between the camps. Both armies stop to watch two men, which armies are not supposed to do. It lasts about as long as it takes a banner to fall and be picked up again, and then the white horse is going back the way it came with a red line along its shoulder, and the Sword of Silla is holding his left arm against his ribs.',
        '네 번째에는' + fourth_ko
    ),
    p(
        'Behind him the fifty thousand sit down where they stand. Four times up the same slope in the same heat — the clerks will write that the soldiers’ strength was spent, which is the polite way to say that grown men are lying in the dust of their own road and cannot be made to get up.',
        '그의 뒤에서 오만이 선 자리에 주저앉는다. 같은 더위에 같은 비탈을 네 번 — 서기들은 군사의 힘이 다했다고 적을 것이다. 다 큰 사내들이 제 길의 먼지에 누워 일으켜 세울 수 없게 되었다는 말을 예의 바르게 하는 방법이다.'
    ),
    count('Four.', '넷.'),
    {
        'kind': 'quote',
        'html': 'Yushin and the others divided the army into three roads. They fought four times without advantage, and the soldiers’ strength was spent.',
        'ko': '유신 등이 군사를 세 길로 나누어 네 번 싸웠으나 이롭지 못하여, 군사들의 힘이 다하였다.',
        'hanja': '庾信等分軍爲三道 四戰不利 士卒力竭',
        'source': 'Samguk Sagi (三國史記) bk. 5, Silla Annals — King Muyeol, year 7'
    },
    quote4,
    p(
        'Both kingdoms wrote the morning down. They agree on the number, and on nothing else.',
        '두 나라 모두 그 아침을 적었다. 숫자에는 동의한다. 그 밖엔 아무것도.'
    ),
]
B[i_clashes:i_status + 1] = clashes

i_bangul = find(lambda b: has(b, 'Bangul rides out alone and does not come back.'), 'bangul')
i_helmet = find(lambda b: has(b, 'The second time, Gyebek has his helmet unstrapped again'), 'helmet')
assert i_helmet == i_bangul + 1
B[i_bangul:i_bangul + 1] = [
    scene('Bangul', '반굴'),
    p(
        'Heumsun calls his son to his stirrup. Bangul is fifteen, near enough, and Yushin’s nephew; he comes at a run, because he has been watching his father look at him since the white horse came back.',
        '흠순이 아들을 등자 곁으로 부른다. 반굴은 얼추 열다섯, 유신의 조카다. 흰 말이 돌아온 뒤로 아비가 자기를 보고 있는 것을 줄곧 지켜보았기에, 그는 달려온다.'
    ),
    say(None, HEUMSUN,
        ['For a subject, nothing is greater than loyalty. For a son, nothing is greater than filial piety.',
         'To see the danger and give your life to it — that keeps both, whole, at once.'],
        ['신하로서는 충만 한 것이 없고, 자식으로서는 효만 한 것이 없다.',
         '위태로움을 보고 목숨을 바치면 — 충과 효를 함께 온전히 하는 것이다.']),
    say('bangul', '#5e9dd8', ['I have heard you, Father.'], ['삼가 명을 받들겠습니다.']),
    p(
        'Bangul rides out alone and does not come back. He goes into the Baekje line where it is thickest and fights there until it closes over him, and the place where it closed is the place Silla aims at next.',
        '반굴이 홀로 말을 몰고 나가 돌아오지 않는다. 그는 백제의 대열이 가장 두터운 곳으로 들어가, 대열이 그를 덮을 때까지 싸운다. 대열이 닫힌 그 자리가, 신라가 다음에 겨누는 자리다.'
    ),
    scene('Gwanchang', '관창'),
    p(
        'Pumil does not call his son. He has him brought to stand in front of his horse, before all the generals, and points at him the way a man points at a map.',
        '품일은 아들을 부르지 않는다. 장수들이 다 보는 앞에서 아들을 제 말 앞에 세우게 하고, 지도를 가리키듯 그를 가리킨다.'
    ),
    say('pumil', '#6a8ab8',
        ['My son is only sixteen, but his spirit is brave enough.',
         'In today’s battle — can he be the mark the three armies aim by?'],
        ['내 아이는 겨우 열여섯이나, 뜻과 기개가 자못 용감하오.',
         '오늘 싸움에서 — 삼군이 겨눌 표적이 될 수 있겠느냐?']),
    say('gwanchang', '#79b6f2', ['Yes.'], ['예.']),
    p(
        'He takes an armoured horse and one spear and goes straight at the Baekje centre. He gets further than Bangul did. Then they pull him off the horse alive and bring him to Gyebek.',
        '그는 갑옷 입힌 말 한 필과 창 한 자루로 곧장 백제의 가운데로 달려든다. 반굴보다 더 깊이 들어간다. 그리고 산 채로 말에서 끌어내려져 계백 앞에 끌려온다.'
    ),
    p(
        'Gyebek has the helmet taken off. Inside it is a boy’s face, sweat-striped, furious at being alive.',
        '계백이 투구를 벗기게 한다. 그 안에 소년의 얼굴이 있다. 땀으로 줄이 지고, 살아 있다는 데 분해 하는 얼굴.'
    ),
    say('gyebek', GYEBEK,
        ['Silla cannot be withstood.', 'If a boy is like this — what are its grown men?', 'Go home.'],
        ['신라는 대적할 수 없겠구나.', '소년이 이러하니 — 장정들은 어떻겠는가.', '집으로 가라.']),
    p(
        'They put him back on his horse and point it at the Silla line. At his father’s stirrup Gwanchang does not get down.',
        '그들은 그를 다시 말에 태워 신라 쪽으로 머리를 돌려 보낸다. 아비의 등자 곁에서 관창은 말에서 내리지 않는다.'
    ),
    say('gwanchang', '#79b6f2',
        ['I went into their midst and could not cut down their general or take their banner.',
         'It was not because I was afraid to die.'],
        ['제가 적진에 들어가 장수를 베지도, 깃발을 뽑지도 못한 것은',
         '죽음이 두려워서가 아니었습니다.']),
    p(
        'Behind the Silla line there is a well, dug that morning for the horses. He scoops the water out with both hands, drinks, and rides back the way he came. Gyebek sends him home once. He comes back.',
        '신라 대열 뒤에 그날 아침 말들을 위해 판 우물이 있다. 그는 두 손으로 물을 떠 마시고, 왔던 길로 다시 달려간다. 계백은 그를 한 번 돌려보냈다. 그는 다시 온다.'
    ),
]

i_pumil_q = find(lambda b: b['kind'] == 'quote' and 'my son’s face is as if he lived' in b.get('html', ''), 'pumil quote')
i_onward = find(lambda b: has(b, 'is worth more than a fourth failure'), 'onward')
i_last = find(lambda b: has(b, 'By the fifth charge the left camp is a rumour of men.'), 'last')
assert i_onward == i_pumil_q + 1 and i_last == i_onward + 1
onward = B[i_onward]
B[i_pumil_q + 1:i_last] = [
    p(
        'He holds the head up in front of the army and wipes the blood from its face with his own sleeve, so that the three armies can see whose son it is.',
        '그는 그 머리를 군사들 앞에 들어 올리고, 제 소매로 얼굴의 피를 닦는다. 삼군이 그것이 누구의 아들인지 볼 수 있도록.'
    ),
    scene('The Fifth Clash', '다섯 번째 접전'),
    p(
        'Nobody gives an order. The drums start on their own, one column and then the next, and fifty thousand men who could not be made to get up an hour ago are on their feet and shouting.',
        '아무도 명령하지 않는다. 북이 저절로 울기 시작한다. 한 대열, 그다음 대열. 한 시진 전만 해도 일으켜 세울 수 없던 오만이 일어서서 함성을 지른다.'
    ),
    onward,
    p('On the Baekje side, nobody says five.', '백제 쪽에서는, 아무도 다섯이라고 말하지 않는다.'),
]

i_keeps = find(lambda b: has(b, 'The Yellow Mountain keeps the dust.'), 'keeps')
B.insert(i_keeps + 1, p(
    'The Silla clerks count too. Twenty-odd taken alive, the ministers Chungsang and Sangyeong among them. They do not write down how many of the five thousand were left to take.',
    '신라의 서기들도 센다. 산 채로 잡힌 이 스물 남짓, 그 가운데 좌평 충상과 상영. 오천 가운데 잡을 사람이 몇이나 남아 있었는지는 적지 않는다.'
))

i_form = find(lambda b: b['kind'] == 'formation', 'formation')
B[i_form]['note'] = '5,000 against 50,000. Five clashes: Baekje held the first four; the fifth broke them.'

def text(b):
    if b['kind'] == 'p':
        return (b.get('html', '') + ' ' + b.get('ko', '')).lower()
    if b['kind'] == 'dialogue':
        return (' '.join(b.get('lines', [])) + ' ' + ' '.join(b.get('en', []))).lower()
    return json.dumps(b, ensure_ascii=False).lower()

missing = [im['id'] for im in e['images'] if im.get('at') and not any(im['at'].lower() in text(b) for b in B)]
print('blocks', len(B), 'unanchored images', missing)

out = json.dumps(d, ensure_ascii=False, indent='\t') + '\n'
tmp = P + '.tmp'
with open(tmp, 'w') as f:
    f.write(out)
    f.flush()
    os.fsync(f.fileno())
json.load(open(tmp))
os.replace(tmp, P)
