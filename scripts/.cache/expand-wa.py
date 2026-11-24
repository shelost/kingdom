# One-shot surgical edit. Does not pretty-print story.json.
import json
from pathlib import Path

root = Path("/Users/heewon/Documents/GitHub/kingdom")
story_path = root / "src/lib/data/story.json"
raw = story_path.read_text()

def once(hay, old, new, label):
    n = hay.count(old)
    if n != 1:
        raise SystemExit(f"{label}: expected 1, found {n}")
    return hay.replace(old, new, 1)

def blocks(items):
    return ",\n".join(items)

def p(html, ko):
    return (
        '\t\t\t\t\t{\n'
        '\t\t\t\t\t\t"kind": "p",\n'
        f'\t\t\t\t\t\t"html": {json.dumps(html, ensure_ascii=False)},\n'
        f'\t\t\t\t\t\t"ko": {json.dumps(ko, ensure_ascii=False)}\n'
        '\t\t\t\t\t}'
    )

def card(person, caption, ko):
    return (
        '\t\t\t\t\t{\n'
        '\t\t\t\t\t\t"kind": "card",\n'
        f'\t\t\t\t\t\t"person": {json.dumps(person)},\n'
        f'\t\t\t\t\t\t"caption": {json.dumps(caption, ensure_ascii=False)},\n'
        f'\t\t\t\t\t\t"ko": {json.dumps(ko, ensure_ascii=False)}\n'
        '\t\t\t\t\t}'
    )

def dialogue(person, chip, lines, en):
    def arr(xs):
        inner = ",\n".join(f'\t\t\t\t\t\t\t{json.dumps(x, ensure_ascii=False)}' for x in xs)
        return "[\n" + inner + "\n\t\t\t\t\t\t]"
    return (
        '\t\t\t\t\t{\n'
        '\t\t\t\t\t\t"kind": "dialogue",\n'
        f'\t\t\t\t\t\t"person": {json.dumps(person)},\n'
        f'\t\t\t\t\t\t"chip": {json.dumps(chip)},\n'
        f'\t\t\t\t\t\t"lines": {arr(lines)},\n'
        f'\t\t\t\t\t\t"en": {arr(en)}\n'
        '\t\t\t\t\t}'
    )

def slot(**fields):
    lines = ['\t\t\t\t\t{']
    for k, v in fields.items():
        lines.append(f'\t\t\t\t\t\t{json.dumps(k)}: {json.dumps(v, ensure_ascii=False)},')
    # drop the last comma? JSON allows no trailing comma. Remove it.
    lines[-1] = lines[-1].rstrip(',')
    lines.append('\t\t\t\t\t}')
    return '\n'.join(lines)

wa_intro = blocks([
    p(
        "Two courts on this water call the man on the seat heaven. They mean it. In Surabol you may look a queen in the face. In these rooms the piety is the floor.",
        "이 바다의 두 조정은 자리에 앉은 사람을 하늘이라 부른다. 그 말을 그대로 믿는다. 서라벌에서는 여왕의 얼굴을 봐도 된다. 이 방들에서 신앙은 마루다.",
    ),
    p(
        "Two summers ago the eastern seat changed hands in a ceremony. A prince walked up to the man who ran the court and cut him down in front of the empress. She left the room. The dead man was Soga no Iruka. The prince is Naka no Ōe. He is twenty-one. He did not take the seat. He put his uncle on it.",
        "두 해 전 여름, 동쪽 자리가 의식 한가운데서 바뀌었다. 왕자가 조정을 쥐던 사내에게 걸어가, 여왕 앞에서 그를 베었다. 여왕은 방을 나갔다. 죽은 사람은 소가노이루카다. 왕자는 나카노오에다. 스물하나다. 자리는 받지 않았다. 숙부를 앉혔다.",
    ),
    card(
        "tenji",
        "Naka no Ōe. He cut the court's man down in front of the empress, and left the seat to his uncle. The East will call him Tenji when the seat is finally his.",
        "나카노오에. 여왕 앞에서 조정의 사람을 베고, 자리는 숙부에게 남겼다. 자리가 드디어 그의 것이 되면, 동쪽은 그를 덴지라 부를 것이다.",
    ),
    p(
        "The uncle is Kōtoku. He thanks people. He is rewriting the laws so they look like the western ones. The prince who made him sits where the lamp thins. The room watches that dark the way other rooms watch a crown.",
        "숙부는 고토쿠다. 사람에게 고맙다 한다. 법을 서국 법처럼 보이게 고치고 있다. 그를 만든 왕자는 등불이 얇아지는 곳에 앉는다. 방은 다른 나라가 왕관을 보듯 그 어둠을 본다.",
    ),
    p(
        "Pung came east at seventeen. He is past thirty. The cushion has his shape. The clerks copy a hand he taught them. The court calls him a friend. That is the polite word for a hostage it has decided to love.",
        "풍은 열일곱에 동쪽으로 왔다. 지금은 서른을 넘겼다. 방석은 그의 모양이다. 서기들은 그가 가르친 손을 베낀다. 조정은 그를 벗이라 부른다. 좋아하기로 한 볼모를 점잖게 부르는 말이다.",
    ),
    p(
        "Across the wider water, the man this ship wants killed his own brothers at a gate. The world agreed to call that heaven. The floor is the same. So is the worship. The knife is larger. This court first. Then that one.",
        "더 넓은 바다 건너, 이 배가 찾는 사내는 문 앞에서 제 형제를 죽였다. 세상은 그것을 하늘이라 부르기로 했다. 마루는 같다. 신앙도 같다. 칼이 더 크다. 먼저 이 조정이다. 그다음이 저쪽이다.",
    ),
])

village = blocks([
    p(
        "They do not hurry the fire. The bear elder goes for dry wood and comes back with an armful that still drips. The young falcon man says the word again, softer, as if the second time might land. Chunchu counts the gaps between the huts. Three. All of them end at the sea.",
        "불을 서두르지 않는다. 곰 어른이 마른 나무를 가지러 갔다가, 아직 물이 떨어지는 나뭇짐을 안고 돌아온다. 젊은 매가 그 말을 한 번 더 한다. 더 작게. 이번엔 닿을 것처럼. 춘추는 집과 집 사이를 센다. 셋. 전부 방금 나온 바다에서 끝난다.",
    ),
    p(
        "Night comes down on the stakes and the spirals. Up the island a capital is lighting lamps for a king who thanks people. Down here the piety is a coal and a green branch.",
        "말뚝과 소용돌이 위로 밤이 내린다. 섬 위에서는 고맙다 하는 왕을 위해 등불을 켠다. 여기의 신앙은 숯 하나와 푸른 가지다.",
    ),
])

pung_room = p(
    "The room behind him is a life. A chest with Baekje clasps. A stack of slips in a hand he has taught other people. A lamp he lit himself, before anyone came to fetch him. He has been this court's favorite guest for half his life. He wears it the way a man wears a house.",
    "등 뒤의 방은 생활이다. 백제 장석이 달린 궤. 남에게 가르친 글씨의 나무쪽 더미. 누가 데리러 오기 전에 제가 켠 등불. 그는 이 조정의 귀한 손님으로 반생을 살았다. 사람이 집을 입듯, 그 자리를 입고 있다.",
)

hall = blocks([
    p(
        "The hall is night. One lamp on the floor. The king sits in the light. A younger man sits just outside it, hair looped, a sword already used in a ceremony. Nobody presents him. The knees point at him. The sentences point at the king. The crown gets the sentence. The knife gets the room.",
        "전각은 밤이다. 등불은 마루에 하나. 왕은 빛 안에 앉는다. 더 젊은 사내가 빛 바로 밖에 앉는다. 말아 올린 머리. 의식에서 이미 한 번 쓴 칼. 아무도 그를 소개하지 않는다. 무릎은 그를 향한다. 문장은 왕을 향한다. 왕관이 문장을 받는다. 칼이 방을 받는다.",
    ),
    dialogue(
        "tenji",
        "#e06a95",
        ["배가 몇이오.", "성이 잠잠해지면, 이 조정은 무엇을 남기오."],
        ["Ships. How many.", "When the forts go quiet, what does this court keep."],
    ),
    dialogue(
        "chunchu",
        "#D8258C",
        ["봄까지 제 성 셋이 서 있을 군사라면 됩니다.", "바다는 그대로 두십시오. 건너 달라는 청은 제가 거두겠습니다."],
        ["Men enough that three of my forts are standing in the spring.", "Keep the sea. I will stop asking you to cross it."],
    ),
])

tang_intro = blocks([
    p(
        "The man on the western seat is Li Shimin. He killed his brothers to sit there. The world has had twenty years to call that heaven.",
        "서쪽 자리의 사내는 이세민이다. 형제를 죽이고 앉았다. 세상은 스무 해 동안 그것을 하늘이라 불렀다.",
    ),
    p(
        "The north gate of the palace. He was already inside it. Dawn. A bow. One arrow for the elder brother. The other brother died in the knives that followed. Their father was out on a lake. Three days later the robe changed shoulders.",
        "궁의 북문. 그는 이미 그 안에 있었다. 새벽. 활. 형에게 화살 하나. 다른 아우는 뒤따른 칼에 죽었다. 아버지는 호수 위에 있었다. 사흘 뒤 옷이 어깨를 바꿨다.",
    ),
    p(
        "They looked at the floor and called him the Son of Heaven. Across the water a prince of twenty-one has just done the smaller version, and left his uncle in the light. Chunchu has seen that floor. He is about to see this one.",
        "그들은 마루를 보고 그를 천자라 불렀다. 바다 건너 스물하나의 왕자가 방금 더 작은 판을 끝내고, 숙부를 빛 안에 남겨 두었다. 춘추는 그 마루를 봤다. 이제 이 마루를 보러 간다.",
    ),
])

def after_block(hay, html_start, extra, label):
    needle = f'"html": "{html_start}'
    n = hay.count(needle)
    if n != 1:
        raise SystemExit(f"{label} anchor: {n}")
    i = hay.find(needle)
    end = hay.find("},", i)
    if end < 0:
        raise SystemExit(f"{label}: no close")
    line_end = hay.find("\n", end)
    return hay[: line_end + 1] + extra + ",\n" + hay[line_end + 1 :]

def before_block(hay, html_exact, extra, label):
    needle = f'"html": {json.dumps(html_exact, ensure_ascii=False)}'
    n = hay.count(needle)
    if n != 1:
        raise SystemExit(f"{label} anchor: {n}")
    i = hay.find(needle)
    brace = hay.rfind("\n", 0, i)
    # the { is the line before "html"
    prev = hay.rfind("\n", 0, brace)
    return hay[: prev + 1] + extra + ",\n" + hay[prev + 1 :]

raw = after_block(raw, "Bidam is a month dead.", wa_intro, "wa intro")
raw = after_block(raw, "The chief looks pleased.", village, "village")
raw = before_block(raw, "He does not stand up quickly. That is the welcome, and the little cut inside it. Then he stands, because he is still a prince, and the standing is graceful and half a breath late.", pung_room, "pung room")
raw = before_block(raw, "The king is courteous and unhurried. He asks after the new queen. He admires the padding in a crown he has never seen. He lets Chunchu get as far as the door, and no farther.", hall, "hall")

# The king sentence may differ. If before_block failed we already exited.
# Tang insert: before the embassy paragraph. Confirm the exact html first by a guarded find.
embassy = "The embassy comes in at the hour the street drums stop. The great avenue opens ahead of it, a hundred and fifty paces wide and perfectly empty."
raw = before_block(raw, embassy, tang_intro, "tang")

replacements = [
    (
        "They walk north.",
        "They walk north in the dark.",
        "walk en",
    ),
    (
        "북으로 걷는다.",
        "어둠 속을 북으로 걷는다.",
        "walk ko",
    ),
    (
        "The hall is new wood and old loyalties.",
        "The hall is new wood and old loyalties, and the rest of it is dark.",
        "hall en",
    ),
    (
        "전각은 새 나무와 오래된 의리다.",
        "전각은 새 나무와 오래된 의리고, 나머지는 어둡다.",
        "hall ko",
    ),
    (
        "He says it lightly. The cup in his hand is full, and was full before Chunchu came in. Fifteen years of someone else\u2019s capital have taught him the timing of a laugh. He uses it now, so the next thing can sound like a kindness.",
        "He says it lightly. The cup in his hand is full, and was full before Chunchu came in. The man on the cushion is past thirty. He was seventeen when they sent him. The laugh is a man\u2019s, and he uses it when he wants the next sentence to arrive softly.",
        "laugh en",
    ),
    (
        "가볍게 말한다. 손의 잔은 가득하고, 춘추가 들기 전부터 가득했다. 남의 도성에서 십오 년을 살면 웃음의 박자를 배운다. 지금 그 박자를 쓴다. 다음 말이 친절처럼 들리게.",
        "가볍게 말한다. 손의 잔은 가득하고, 춘추가 들기 전부터 가득했다. 방석의 사내는 서른을 넘겼다. 보내질 때 열일곱이었다. 웃음은 사내의 것이고, 다음 문장을 부드럽게 내리고 싶을 때 쓴다.",
        "laugh ko",
    ),
    (
        "The boat takes the current. Behind him the new halls are a dark comb against a pale sky.",
        "The boat takes the current. Behind him the new halls are a dark comb against the last of the night.",
        "sky en",
    ),
    (
        "배가 물살을 탄다. 등 뒤의 새 전각은 옅은 하늘에 걸린 검은 빗이다.",
        "배가 물살을 탄다. 등 뒤의 새 전각은 밤의 끝에 걸린 검은 빗이다.",
        "sky ko",
    ),
    (
        "Prince Pung. Fifth son of Baekje. The most comfortable man in the room.",
        "Prince Pung. Sent east at seventeen. Past thirty, and the most comfortable man in the room.",
        "caption",
    ),
    (
        "부여풍. 백제의 다섯째. 이 방에서 제일 편한 사람.",
        "부여풍. 열일곱에 동쪽으로 왔다. 서른을 넘긴, 이 방에서 제일 편한 사람.",
        "caption ko",
    ),
    (
        "김공. 도조— 아니.",
        "김공. 앉으시오.",
        "sit ko1",
    ),
    (
        "앉으시오. 바닥이 더 편하오. 의자는 보여 주려고 둔 거요.",
        "의자는 첫날 밤 사람 거요. 나는 여기 사오. 마루가 나를 아오.",
        "sit ko2",
    ),
    (
        "Lord Kim. Dōzo— no.",
        "Lord Kim. Sit.",
        "sit en1",
    ),
    (
        "Sit. The floor is kinder. The chair is here so someone can be seen sitting in it.",
        "The chair is for a first night. I live here. The floor knows me.",
        "sit en2",
    ),
    (
        "스승의 스승의 손이오. 나는 베끼기만 하오.",
        "그 글씨는 이제 내 제자 손이오. 스승은 죽었고, 학교는 내가 지키오.",
        "school ko1",
    ),
    (
        "여기선 베끼면 대접이오. 사비에서는 베끼면 다섯째였소.",
        "사비에서는 다섯째였소. 여기에서는 손님이고, 오래 머물면 손님도 집이 되오.",
        "school ko2",
    ),
    (
        "My teacher\u2019s teacher\u2019s hand. I only copy.",
        "That hand belongs to my students now. The teacher is dead. I kept the school.",
        "school en1",
    ),
    (
        "Here, copying gets you a cushion. At home, copying got me fifth.",
        "In Sabi I was the fifth son. Here I am the guest. Stay long enough and a guest becomes a house.",
        "school en2",
    ),
    (
        "청은 하지 마시오, 김공.",
        "청은 하시오, 김공.",
        "ask ko1",
    ),
    (
        "왕은 끝까지 들을 거요. 그게 이 집의 예절이오. 배는 안 나올 거요.",
        "왕은 끝까지 듣소. 결정은 등불 바깥의 왕자가 이미 했소.",
        "ask ko2",
    ),
    (
        "Don\u2019t ask, Lord Kim.",
        "Ask, Lord Kim.",
        "ask en1",
    ),
    (
        "The king will hear you out. That\u2019s the manners here. The ships will not come out of it.",
        "The king will hear all of it. The prince outside the lamp has already decided.",
        "ask en2",
    ),
    (
        "그러면 나는 집으로 가는 거요.",
        "한 말씀이면 나는 손님이 아니게 되오.",
        "stay ko1",
    ),
    (
        "집은 아직 싫소. 술은 여기가 먼저 오니까.",
        "손님으로 있는 편이 내 나라고. 술은 좋고, 방석은 맞고, 나는 남소.",
        "stay ko2",
    ),
    (
        "Then I go home.",
        "One word and I stop being a guest.",
        "stay en1",
    ),
    (
        "I\u2019m not ready for home. The wine arrives here before I finish wanting it.",
        "Being the guest is my country. The wine is good. The cushion fits. I am staying.",
        "stay en2",
    ),
]

for old, new, label in replacements:
    raw = once(raw, old, new, label)

raw = once(
    raw,
    '\t\t\t\t\t"pung",\n\t\t\t\t\t"kotoku"\n\t\t\t\t],\n\t\t\t\t"images": [],',
    '\t\t\t\t\t"pung",\n\t\t\t\t\t"tenji",\n\t\t\t\t\t"kotoku"\n\t\t\t\t],\n\t\t\t\t"images": [],',
    "cast",
)

wa_images = ",\n".join([
    slot(id="wa-isshi", ratio=2, tone="#1a120e", alt="Night hall from above: a white-robed body in a pool of blood, a standing man with a sword, looped-hair courtiers", at="cut him down in front of the empress", src="/in_isshi_incident.png", people=["tenji"]),
    slot(id="wa-blue-post", ratio=2, tone="#1a2744", alt="Night sea: Chunchu bows in a boat toward a blue flame standing on a rock", at="a blue flame stands up", tempImage="/temp/wa-blue-post.jpg", people=["chunchu"]),
    slot(id="wa-green-stake", ratio=2, tone="#1c2418", alt="Night village: Chunchu at a stake, a falcon chief with a coal, a tattooed spearman, green wood that will not catch", at="They tie his wrists to the post", tempImage="/temp/wa-green-stake.jpg", people=["chunchu", "hayato-chief", "hayato-spear"]),
    slot(id="wa-cut-rope", ratio=2, tone="#2a1814", alt="Night rescue: Abe laughing, Echi cutting the cord, Chunchu at the post, a small fire", at="The cord parts.", tempImage="/temp/wa-cut-rope.jpg", people=["chunchu", "abe", "takutsu"]),
    slot(id="wa-pung-night", ratio=2, tone="#3a2412", alt="Night hall: Pung past thirty on a cushion with a cup, Chunchu in magenta, one oil lamp", at="The man on the cushion is past thirty", tempImage="/temp/wa-pung-night.jpg", people=["pung", "chunchu"]),
    slot(id="wa-two-seats", ratio=2, tone="#141018", alt="Night audience from above: the king in the lamp, Chunchu kneeling, the prince with a sword just outside the light", at="The crown gets the sentence.", tempImage="/temp/wa-two-seats.jpg", people=["chunchu", "tenji", "kotoku"]),
])
raw = once(raw, '"images": []', '"images": [\n' + wa_images + '\n\t\t\t\t]', "images")

xuanwu = slot(
    id="tang-xuanwu",
    ratio=2,
    tone="#140e0c",
    alt="Night palace gate in Chinese ink: a mounted archer from behind, two bodies in blood, one lit doorway",
    at="The north gate of the palace.",
    src="/in_xuanwu_incident.png",
    people=["taizong"],
)
raw = once(raw, '"id": "silla-tang-wide"', xuanwu + ",\n\t\t\t\t\t" + '"id": "silla-tang-wide"', "xuanwu slot")
# The once() replaced the id key only, so the opening brace of silla-tang-wide is now after our object
# but our object was inserted in place of the key, leaving the previous brace owning our fields.
# Fix: we inserted before the key, so the previous `{` now opens a block whose first key is ours
# and silla's keys follow. That is WRONG.
# Undo by not having done it that way — the script hasn't written yet. Recheck below after parse.

raw = once(raw, '"title": "Li Shimin"', '"title": "Tang"', "title")
raw = once(raw, '"subtitle": "이세민"', '"subtitle": "당나라"', "subtitle")

story_path.write_text(raw)
print("wrote", story_path.stat().st_size)
