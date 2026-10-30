#!/usr/bin/env python3
"""Insert adult couple / cavern heat. Gotaso is 14 — do not add her."""
import json
from pathlib import Path

STORY = Path("src/lib/data/story.json")
story = json.loads(STORY.read_text())


def entry(title):
	for ch in story:
		for e in ch.get("entries") or []:
			if e.get("title") == title:
				return e
	raise KeyError(title)


def after_html(e, frag, blocks):
	bs = e["blocks"]
	for i, b in enumerate(bs):
		if frag in (b.get("html") or ""):
			for j, nb in enumerate(blocks):
				bs.insert(i + 1 + j, nb)
			return
	raise KeyError(frag)


def before_html(e, frag, blocks):
	bs = e["blocks"]
	for i, b in enumerate(bs):
		if frag in (b.get("html") or ""):
			for j, nb in enumerate(blocks):
				bs.insert(i + j, nb)
			return
	raise KeyError(frag)


def add_slots(e, slots):
	imgs = e.setdefault("images", [])
	have = {im.get("id") for im in imgs}
	for s in slots:
		if s["id"] not in have:
			imgs.append(s)


# ── Seohyun cavern ──────────────────────────────────────────
seo = entry("Seohyun")
after_html(
	seo,
	"Hyullé does not look, mostly. Golhwa does not pretend.",
	[
		{"kind": "scene", "label": "The Water", "ko": "물", "weather": "cavern"},
		{
			"kind": "p",
			"html": "The steam does not wait for the question.",
			"ko": "김은 질문을 기다려 주지 않는다.",
		},
		{
			"kind": "dialogue",
			"person": "golhwa",
			"chip": "#e86820",
			"en": ["Come here. No — closer.", "I’ve been stone for a hundred years. You’re warm."],
			"lines": ["이리 와. 아니 — 더.", "백 년을 돌로 있었어. 너는 따뜻해."],
		},
		{
			"kind": "dialogue",
			"person": "hyulle",
			"chip": "#2eb8c4",
			"en": ["…Unnie. Don’t—"],
			"lines": ["…언니. 하지 마—"],
		},
		{
			"kind": "dialogue",
			"person": "golhwa",
			"chip": "#e86820",
			"en": ["Don’t what. Look at him."],
			"lines": ["뭘 하지 마. 저거 봐."],
		},
		{
			"kind": "p",
			"html": "She is already in the water. Legs open on the wet rock the way she always sits. The chima is hiked. He is only steam and a wet chest and the name Kim, and he does not know where to put his hands.",
			"ko": "그녀는 이미 물속에 있다. 늘 앉던 대로 젖은 바위에 다리를 벌리고. 치마는 걷혀 있다. 그는 김과 젖은 가슴과 김이라는 이름뿐이고, 손을 어디 둘지 모른다.",
		},
		{
			"kind": "dialogue",
			"person": "seohyeon",
			"chip": "#3E8EF0",
			"en": ["I— I was going to ask one thing—"],
			"lines": ["나는— 하나만 물으려던 참인데—"],
		},
		{
			"kind": "dialogue",
			"person": "narim",
			"chip": "#5fad6e",
			"en": ["After.", "The hill can wait one hour. I—"],
			"lines": ["그다음에.", "언덕은 한 시진 기다려요. 나는—"],
		},
		{
			"kind": "p",
			"html": "Narim runs out of the sentence when he looks at her kindly. Hyullé has not moved. Knees together. Soaked. Watching him the way water watches a warm hand.",
			"ko": "그가 상냥하게 쳐다보자 나림은 말이 끊긴다. 혈례는 아직 안 움직였다. 무릎을 붙이고. 흠뻑 젖은 채로. 따뜻한 손을 보는 물처럼 그를 본다.",
		},
		{
			"kind": "dialogue",
			"person": "hyulle",
			"chip": "#2eb8c4",
			"en": ["…You can hold the rock. If you want.", "I won’t… I won’t look at your face."],
			"lines": ["…바위 잡으셔도 돼요. 원하시면.", "전… 얼굴은 안 볼게요."],
		},
		{
			"kind": "dialogue",
			"person": "golhwa",
			"chip": "#e86820",
			"en": ["I will."],
			"lines": ["난 볼 건데."],
		},
		{
			"kind": "p",
			"html": "They have gone centuries without a man coming down. They do not pretend they are polite about it. The storm in the hill does the talking. He does not.",
			"ko": "몇백 년째 사내 하나 내려온 적이 없다. 그들은 점잖은 척하지 않는다. 언덕 속의 폭풍이 대신 말한다. 그는 말하지 않는다.",
		},
	],
)
add_slots(
	seo,
	[
		{
			"id": "seo-cavern-golhwa",
			"ratio": 2,
			"time": "night",
			"at": "Legs open on the wet rock the way she always sits.",
			"alt": "Golhwa on the rock, chima hiked; shirtless Seohyun in the steam",
			"people": ["golhwa", "seohyeon"],
			"canon": {"year": 595, "hat": False},
		},
		{
			"id": "seo-cavern-hyulle",
			"ratio": 2,
			"time": "night",
			"at": "Knees together. Soaked.",
			"alt": "Hyullé pressed-knees shy; shirtless Seohyun; water light",
			"people": ["hyulle", "seohyeon"],
			"canon": {"year": 595, "hat": False},
		},
		{
			"id": "seo-cavern-narim",
			"ratio": 2,
			"time": "night",
			"at": "Narim runs out of the sentence when he looks at her kindly.",
			"alt": "Narim breathless, covered; shirtless Seohyun looking kindly",
			"people": ["narim", "seohyeon"],
			"canon": {"year": 595, "hat": False},
		},
	],
)

# ── Queen Sunduk: colonnade + watching ──────────────────────
sd = entry("Queen Sunduk")
after_html(
	sd,
	"The pigeons leave the roof.",
	[
		{"kind": "scene", "label": "The Colonnade", "ko": "회랑"},
		{
			"kind": "p",
			"html": "The coronation is tomorrow. Tonight the marshal walks the Eastern Palace colonnade as if it were his yard.",
			"ko": "즉위식은 내일이다. 오늘 밤 장군은 동궁 회랑을 제 마당처럼 걷는다.",
		},
		{
			"kind": "p",
			"html": "Court ladies lean from every pillar. One drops a fan on purpose. He picks it up. He smiles. He is the most popular man in Silla, and he knows how to return a fan without returning a promise.",
			"ko": "궁녀들이 기둥마다 몸을 내민다. 하나가 일부러 부채를 떨어뜨린다. 그는 줍는다. 웃는다. 신라에서 가장 인기 있는 사내이고, 약속을 돌려주지 않으면서 부채만 돌려주는 법을 안다.",
		},
		{
			"kind": "dialogue",
			"speaker": "A court lady",
			"chip": "#c4a484",
			"en": ["Marshal. Will you walk the lanterns after."],
			"lines": ["장군님. 등 켜지면 같이 거닐어요."],
		},
		{
			"kind": "dialogue",
			"person": "yushin",
			"en": ["After the oaths. The Princess comes first."],
			"lines": ["맹세 뒤에. 공주님이 먼저다."],
		},
		{
			"kind": "p",
			"html": "Behind a screen in the side alcove, the Princess who will be Queen does not come first. She watches the smile he gave the girl. She wants it. She has wanted it since the yard. She cannot have it, and the wanting does not care.",
			"ko": "옆 감실 병풍 뒤에서, 내일 여왕이 될 공주는 먼저가 아니다. 그가 그 아이에게 준 웃음을 본다. 갖고 싶다. 마당 때부터 갖고 싶었다. 가질 수는 없고, 그 마음은 상관하지 않는다.",
		},
		{"kind": "scene", "label": "The Side Lattice", "ko": "옆 창"},
		{
			"kind": "p",
			"html": "Two nights before the crown, her cousin’s house is loud in the way a house is loud when the children are finally asleep.",
			"ko": "왕관을 쓰기 이틀 전, 사촌의 집은 아이들이 겨우 잠든 집처럼 시끄럽다.",
		},
		{
			"kind": "p",
			"html": "Chunchu has Munhee against the lattice. Magenta silk. Pink silk. The coat is already on the floor. They do not know anyone is in the garden.",
			"ko": "춘추가 문희를 창살에 밀어 두고 있다. 자줏빛 비단. 분홍 비단. 겉옷은 이미 바닥에 있다. 뜰에 누가 있는 줄은 모른다.",
		},
		{
			"kind": "p",
			"html": "Sunduk stands in the dark under the eaves and does not go in. She watches other people love. She has been doing it her whole life. Tonight it includes this.",
			"ko": "선덕은 처마 밑 어둠에 서서 들어가지 않는다. 남이 사랑하는 걸 보기만 한다. 평생 그래 왔다. 오늘 밤엔 이것까지.",
		},
		{"kind": "scene", "label": "The Sister's Pavilion", "ko": "언니의 별채"},
		{
			"kind": "p",
			"html": "Chunmyung’s pavilion is quieter. Yongsu’s hair is already white. She still takes his hand as if it were a sum he has not finished.",
			"ko": "천명의 별채는 더 조용하다. 용수의 머리는 이미 하얗다. 그녀는 아직도 그의 손을, 아직 안 끝난 셈처럼 잡는다.",
		},
		{
			"kind": "p",
			"html": "They kiss the way people kiss who have already survived a secret. The lamp is one. The door shuts.",
			"ko": "이미 비밀 하나를 같이 살아 낸 사람들처럼 입을 맞춘다. 등잔은 하나. 문은 닫힌다.",
		},
		{
			"kind": "p",
			"html": "Sunduk watches this too, from the same dark. A sister who gave up a throne and kept a man. A sister who kept a throne and watches.",
			"ko": "선덕은 같은 어둠에서 이것도 본다. 왕관을 포기하고 사내를 지킨 언니. 왕관을 지키고 보기만 하는 동생.",
		},
	],
)
add_slots(
	sd,
	[
		{
			"id": "sd-yushin-ladies",
			"ratio": 2,
			"time": "night",
			"at": "One drops a fan on purpose. He picks it up. He smiles.",
			"alt": "Yushin returns a fan; court ladies lean from the colonnade",
			"people": ["yushin"],
			"canon": {"year": 632},
		},
		{
			"id": "sd-watch-yushin",
			"ratio": 2,
			"time": "night",
			"at": "She watches the smile he gave the girl.",
			"alt": "Sunduk behind a screen, flushed, watching Yushin with the ladies",
			"people": ["sunduk", "yushin"],
			"canon": {"year": 632, "hat": False},
		},
		{
			"id": "sd-munhee-lattice",
			"ratio": 2,
			"time": "night",
			"at": "Chunchu has Munhee against the lattice.",
			"alt": "Chunchu and Munhee against the lattice; coat on the floor",
			"people": ["chunchu", "munhee"],
			"canon": {"year": 632, "hat": False},
		},
		{
			"id": "sd-watch-munhee",
			"ratio": 2,
			"time": "night",
			"at": "She watches other people love.",
			"alt": "Sunduk under the eaves, wanting, watching Munhee’s house",
			"people": ["sunduk", "chunchu", "munhee"],
			"canon": {"year": 632},
		},
		{
			"id": "sd-chunmyung-night",
			"ratio": 2,
			"time": "night",
			"at": "They kiss the way people kiss who have already survived a secret.",
			"alt": "Chunmyung and Yongsu, one lamp, the door that shuts",
			"people": ["chunmyung", "yongsu"],
			"canon": {"year": 632, "hat": False},
		},
		{
			"id": "sd-watch-chunmyung",
			"ratio": 2,
			"time": "night",
			"at": "A sister who gave up a throne and kept a man.",
			"alt": "Sunduk in the dark watching Chunmyung’s pavilion",
			"people": ["sunduk", "chunmyung", "yongsu"],
			"canon": {"year": 632},
		},
	],
)

# ── Jahee, adult years (661 — she is 34) ────────────────────
jh = entry("Jahee")
# Insert before the episode's next-card if we can find a bold closer; else append before last p that is bold.
bs = jh["blocks"]
inserted = False
for i in range(len(bs) - 1, -1, -1):
	h = bs[i].get("html") or ""
	if h.startswith("<b>") and "…" in h:
		for j, nb in enumerate(
			[
				{
					"kind": "scene",
					"label": "The Tide Book",
					"ko": "조수 장부",
					"jump": {"year": 661, "en": "Seventeen Winters Later…", "ko": "십칠 년 후…"},
				},
				{
					"kind": "p",
					"html": "The harbour book is still open. The crown is in the next room. She has not put it on yet.",
					"ko": "항구 장부는 아직 열려 있다. 왕관은 옆방에 있다. 그녀는 아직 쓰지 않았다.",
				},
				{
					"kind": "p",
					"html": "He shuts the door that shuts. She laughs at his face the way she laughed at his sums.",
					"ko": "그는 닫히는 문을 닫는다. 그녀는 셈 틀렸을 때처럼 그의 얼굴을 보고 웃는다.",
				},
				{
					"kind": "dialogue",
					"person": "jayi",
					"en": ["Count again. While I am watching."],
					"lines": ["다시 세요. 내가 보는 앞에서."],
				},
				{
					"kind": "dialogue",
					"person": "munmu",
					"en": ["I am not counting."],
					"lines": ["지금은 안 셉니다."],
				},
				{
					"kind": "p",
					"html": "The ledger can wait. The tide can wait. A queen with a Gaya-blood king in a room that shuts is already the scandal. They might as well be good at it.",
					"ko": "장부는 기다려도 된다. 조수도 기다려도 된다. 닫히는 방에 가야 피 임금을 들인 왕후는 이미 스캔들이다. 잘할 수밖에.",
				},
			]
		):
			bs.insert(i + j, nb)
		inserted = True
		break
if not inserted:
	raise SystemExit("no Jahee closer")

add_slots(
	jh,
	[
		{
			"id": "jh-tide-door",
			"ratio": 2,
			"time": "night",
			"at": "He shuts the door that shuts.",
			"alt": "Adult Jahee and Bupmin; the door that shuts, one lamp",
			"people": ["jayi", "munmu"],
			"canon": {"year": 661, "hat": False},
		}
	],
)

STORY.write_text(json.dumps(story, ensure_ascii=False, indent="\t") + "\n")
print("ok", "seo blocks+", "sd blocks+", "jahee 661")
