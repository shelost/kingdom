#!/usr/bin/env python3
"""Expand Seohyun romance: dinner, lock-up, first-look, hut storm, pregnancy."""
from __future__ import annotations

import json
from pathlib import Path

STORY = Path("src/lib/data/story.json")


def p(html, ko):
	return {"kind": "p", "html": html, "ko": ko}


def scene(label, ko, **extra):
	return {"kind": "scene", "label": label, "ko": ko, **extra}


def dlg(person, en, lines, **extra):
	out = {"kind": "dialogue", "person": person, "en": en, "lines": lines}
	out.update(extra)
	return out


def speaker(name, en, lines, chip="#7a7a82"):
	return {"kind": "dialogue", "speaker": name, "chip": chip, "en": en, "lines": lines}


def find(blocks, pred):
	return next(i for i, x in enumerate(blocks) if pred(x))


def main():
	story = json.loads(STORY.read_text())
	entry = next(e for ch in story for e in (ch.get("entries") or []) if e.get("title") == "Seohyun")
	b = entry["blocks"]

	# --- First meeting: the street falls away ---
	step = find(b, lambda x: "steps down off the threshold" in x.get("html", ""))
	b[step:step + 1] = [
		p(
			"Then she does something nobody on that street has seen a Sacred Bone daughter do. She steps down off the threshold into the dust.",
			"그러고는 그 거리 누구도 성골 집 딸이 하는 걸 본 적 없는 일을 한다. 문턱에서 흙바닥으로 내려선다.",
		),
		p(
			"The street goes. The cart goes. The maid goes. What is left is a man on a horse and a woman in the dust.",
			"거리가 사라진다. 수레가 사라진다. 하녀가 사라진다. 남은 건 말 탄 사내와, 흙 위의 여자다.",
		),
		p(
			"You have seen looks. This one takes the street with it. The histories, which do not usually bother, wrote it down anyway.",
			"눈길 같은 건 보셨을 거다. 이건 거리까지 들고 간다. 이런 일을 잘 안 적는 사서도, 이번엔 적어 두었다.",
		),
	]

	# --- Family Dinner after the maid's Agassi, before Side Gate ---
	side = find(b, lambda x: x.get("kind") == "scene" and x.get("label") == "Side Gate")
	dinner = [
		scene("Family Dinner", "저녁상"),
		p(
			"That night three people eat at a table built for twelve, because that is the size of table a High Councillor is supposed to have.",
			"그날 밤 세 사람이 열두 명 앉는 상에 둘러앉는다. 상대등이라면 그만한 상은 있어야 하니까.",
		),
		dlg(
			"sukhuljong",
			["Muryuk’s boy rode past the gate again. Three times today.", "And you were in it."],
			["무력의 아들놈이 또 대문 앞을 지나갔다. 오늘만 세 번.", "네가 거기 서 있었고."],
		),
		speaker("Suulbu’s wife", ["Perhaps the road is bad."], ["길이 험한가 보지요."]),
		dlg("sukhuljong", ["The road is fine. The road is mine."], ["길은 멀쩡해. 내 길이다."]),
		dlg("manmyung", ["He nearly ate a charcoal cart."], ["숯 수레를 들이받을 뻔했어요."]),
		dlg(
			"sukhuljong",
			["Good. The charcoal can have him.", "You do not stand in my gate for a Gaya boy. Not tomorrow. Not the day after."],
			["잘됐군. 숯이나 가져가라 해.", "내 대문에 가야 놈 보겠다고 서지 마라. 내일도. 모레도."],
		),
		dlg("manmyung", ["I was looking at the road."], ["길 보고 있었어요."]),
		dlg("sukhuljong", ["You were looking at the horse."], ["말 보고 있었지."]),
		speaker(
			"Suulbu’s wife",
			["Manmyung. Eat your greens.", "And stop looking at the gate."],
			["만명아. 나물 먹어.", "대문 좀 그만 보고."],
		),
		dlg("manmyung", ["I’m not looking at the gate.", "I’m looking at the road."], ["대문 안 봐요.", "길 봐요."]),
		p(
			"She eats the greens. She looks at the road anyway. Across the city a thin boy is setting down a basket of charcoal and hearing every word, but that is someone else’s dinner.",
			"나물은 먹는다. 길은 그래도 본다. 도성 저편에선 마른 아이가 숯 바구니를 내려놓으며 한 마디도 빠짐없이 듣고 있지만, 그건 다른 집 저녁이다.",
		),
	]
	b[side:side] = dinner

	# --- Suulbu's Hall: order the room BUILT ---
	i = find(b, lambda x: x.get("kind") == "dialogue" and "You’re going nowhere" in " ".join(x.get("en") or []))
	# replace that speech + the "shuts her in" p
	shut = find(b, lambda x: "shuts her in a house apart" in x.get("html", ""))
	b[i : shut + 1] = [
		dlg(
			"sukhuljong",
			["Then hear this from me. You’re going nowhere.", "Not to Manno. Not through my side gate. Not on that horse."],
			["그럼 너도 내게서 들어라. 넌 아무 데도 안 간다.", "만노도. 쪽문도. 그 말도."],
		),
		dlg("manmyung", ["Father—"], ["아버지—"]),
		dlg(
			"sukhuljong",
			["Don’t.", "A Gaya boy does not stand in my daughter’s road. I have spent a life making sure of that."],
			["입 다물어.", "가야 놈이 내 딸 길에 서지 않는다. 그걸 지키느라 평생을 썼다."],
		),
		dlg(
			"manmyung",
			["Then you should have built a higher gate."],
			["그럼 대문을 좀 더 높게 지으셨어야죠."],
		),
		p(
			"He looks at her the way he looks at furniture that has started to lean.",
			"그는 딸을, 기울기 시작한 가구 보듯 본다.",
		),
		dlg(
			"sukhuljong",
			["Build one.", "At the back. Raised. A door I hold the bar for. Start today. I want it up before that boy leaves for the north."],
			["하나 지어.", "뒤에. 띄워서. 빗장은 내가 쥔다. 오늘 시작해. 그 놈이 북으로 떠나기 전에 올려 놔."],
		),
		p(
			"The steward writes it down. Manmyung does not sit. She has never been the one left standing either, until now.",
			"청지기가 받아 적는다. 만명은 앉지 않는다. 평생 혼자 서 남은 쪽이 된 적이 없었는데, 오늘은 그렇다.",
		),
	]

	# --- Carpenters + he locks her, inserted before Rank Is a Coat ---
	rank = find(b, lambda x: x.get("kind") == "scene" and x.get("label") == "Rank Is a Coat")
	build = [
		scene("Carpenters", "목수들"),
		p(
			"The timber goes up in three days. The neighbours count the posts. The pink ribbon on the rail is his joke. A house for a daughter, dressed like a gift.",
			"목재는 사흘 만에 올라간다. 이웃들이 기둥을 센다. 난간 분홍 리본은 그의 농담이다. 딸에게 주는 집. 선물처럼 꾸며 놓고.",
		),
		dlg(
			"sukhuljong",
			["Higher.", "If she can see the street from the lattice I have wasted the wood."],
			["더 높여.", "창호로 길이 보이면 나무를 낭비한 거다."],
		),
		p(
			"She watches from the kitchen steps. She does not give him the satisfaction of looking away.",
			"그녀는 부엌 섬돌에서 본다. 눈을 피해서 아버지를 편하게 해 주지는 않는다.",
		),
	]
	b[rank:rank] = build

	# after Rank Is a Coat (Muryuk bows p) insert The Bar
	bow = find(b, lambda x: "puts his hand on the helm" in x.get("html", ""))
	lock = [
		scene("The Bar", "빗장"),
		p(
			"He walks her there himself. The cousins are already on the stair. The door is new. The iron still smells of the forge.",
			"직접 데려간다. 사촌들은 이미 계단에 있다. 문은 새것이다. 쇠에서는 아직 대장간 냄새가 난다.",
		),
		dlg("manmyung", ["You’re locking your own daughter in."], ["친딸을 가두시는 거예요."]),
		dlg(
			"sukhuljong",
			["Then you can look at the gate from the inside."],
			["그럼 이제 대문은 안에서 봐라."],
		),
		p(
			"He drops the bar. It sounds like a verdict. She hears him walk away without looking back, the way he leaves a hall when the vote has gone his way.",
			"빗장을 내린다. 판결 소리다. 그는 뒤도 안 보고 걸어간다. 투표가 자기 쪽으로 끝났을 때 대청을 나서는 그 걸음이다.",
		),
	]
	b[bow + 1 : bow + 1] = lock

	# --- Locked Room: body longing first, then guards ---
	place = find(b, lambda x: x.get("kind") == "place" and x.get("place") == "locked_room")
	guards_p = find(b, lambda x: "cannot be bribed and cannot read" in x.get("html", ""))
	inside = find(b, lambda x: "raised house is one room" in x.get("html", ""))
	# replace from inside through hand-under-silk with richer longing
	gap = find(b, lambda x: "drain runs out, there is a gap" in x.get("html", ""))
	longing = [
		p(
			"Inside, the raised house is one room and one lamp. The pink ribbon on the rail does not move.",
			"별채 안은 방 하나, 등 하나다. 난간 분홍 리본은 꿈쩍하지 않는다.",
		),
		p(
			"Her body does not wait for her. It remembers a collar in a gate. A mouth that said <i>Manno</i> as if it were a question. The bar, still down, and his face on the other side of it.",
			"몸은 기다려 주지 않는다. 대문 틈의 옷깃을 기억한다. 만노, 하고 묻듯 말하던 입을. 아직 내려져 있던 빗장, 그 너머 얼굴을.",
		),
		p(
			"She lies on the floor the way she is not supposed to lie, chima hiked to the hip. The lamp is the only thing watching.",
			"엎드려선 안 되는 자세로 마루에 눕는다. 치마를 허리까지 걷어 올린 채. 등잔만 보고 있다.",
		),
		p(
			"Her hand goes under the silk. She stops. Starts again. She says his name once, into the floor, and bites it off.",
			"손이 비단 밑으로 간다. 멈춘다. 다시 시작한다. 바닥에다 그의 이름을 한 번 말하고, 깨물어 삼킨다.",
		),
		p(
			"Four nights of this. She tries to sleep and the boards are warm. She tries to eat and her mouth wants a different thing. The cousins outside talk about the north. She is already there.",
			"나흘 밤이 이렇다. 잠을 자려 하면 마루가 따뜻하다. 밥을 먹으려 하면 입이 다른 걸 찾는다. 바깥 사촌들은 북쪽 이야기를 한다. 그녀는 이미 거기 있다.",
		),
	]
	# keep guards where they are (before longing currently) — move longing to after place, guards after longing
	# current: place, guards p+4dlg, inside...gap
	# want: place, longing, guards, gap
	guard_block = b[guards_p:inside]
	b[guards_p:gap] = longing + guard_block + [
		p(
			"At the foot of the back wall, where the drain runs out, there is a gap. She has been looking at it the way her father looks at furniture.",
			"뒷담 아래, 도랑물이 빠져나가는 자리에 틈이 하나 있다. 그녀는 그 틈을, 아버지가 가구를 보듯 쳐다보고 있다.",
		)
	]

	# --- Charcoal Hut: 폭풍섹스 innuendo ---
	hut = find(b, lambda x: "The hut has a roof, mostly" in x.get("html", ""))
	morning = find(b, lambda x: "In the morning the rain has stopped" in x.get("html", ""))
	# keep stop-apologising exchange, replace the silk-off p and expand
	silk = find(b, lambda x: "wet silk off before it catches" in x.get("html", ""))
	b[silk : morning + 1] = [
		p(
			"He gets the fire going with shaking hands. She has the wet silk off before it catches.",
			"그는 떨리는 손으로 불을 붙인다. 불이 붙기도 전에 그녀는 젖은 비단을 벗는다.",
		),
		p(
			"The storm does the talking. They do not. The door that will not shut keeps trying, and nobody helps it.",
			"말은 폭풍이 한다. 둘은 안 한다. 닫히지 않는 문이 자꾸 닫히려 하고, 도와주는 사람은 없다.",
		),
		p(
			"This time there is no bar between them. The rain finds the holes in the roof and they find each other under it. Silk on the packed earth. A mouth at a throat. The hearth learns their names and forgets them again.",
			"이번엔 둘 사이에 빗장이 없다. 비는 지붕 구멍을 찾고, 둘은 그 아래에서 서로를 찾는다. 다진 흙 위의 비단. 목덜미의 입. 아궁이가 둘의 이름을 배웠다가 다시 잊는다.",
		),
		p(
			"By morning the rain has stopped and the hearth is ash. She is already late, though neither of them knows the word for it yet. They ride north.",
			"아침이 되자 비는 그치고 아궁이는 재다. 그녀는 이미 늦었다. 아직 둘 다 그 말을 모르지만. 북으로 달린다.",
		),
	]

	# --- County House: pregnancy intimacy before the dream ---
	noon = find(b, lambda x: "not to knock before noon" in x.get("html", ""))
	dream = find(b, lambda x: "gyeongjin" in x.get("html", ""))
	b[noon + 1 : dream] = [
		p(
			"She was with child before they ever reached Manno. She does not say so until the chima starts to tell on her. Then she takes his hand and puts it where the silk is tight, and laughs at his face.",
			"만노에 닿기도 전에 이미 아이를 갖고 있었다. 치마가 일러 주기 전엔 말하지 않는다. 그리고는 그의 손을 잡아 비단이 팽팽한 데에 얹고, 그 얼굴을 보고 웃는다.",
		),
		dlg("seohyeon", ["That’s— is that—"], ["그게— 그게 지금—"]),
		dlg("manmyung", ["Yes.", "And you can still look at me like that. I checked."], ["네.", "그래도 그렇게 봐도 돼요. 확인해 봤어요."]),
		p(
			"They are not careful at noon either. The door that shuts, shuts. The granary can wait. The hills can wait. A Sacred Bone daughter in a county bed with a Gaya governor is already the scandal. They might as well be good at it.",
			"정오에도 조심하지 않는다. 닫히는 문은 닫힌다. 곳간은 기다려도 된다. 언덕도. 가야 원님 침상에 누운 성골 딸은 이미 스캔들이다. 잘할 수밖에.",
		),
		p(
			"Word reaches Surabol before the spring rains do. A Sacred Bone daughter, with child, in a county house, and no wedding anyone was invited to. The city has been waiting for exactly this.",
			"소문은 봄비보다 먼저 서라벌에 닿는다. 성골 딸이, 아이 가진 채로, 군 관아에 있다. 청첩장 받은 혼례는 없다. 도성은 바로 이 이야기를 기다리고 있었다.",
		),
	]
	# the old "She was with child before they ever reached Manno" later may duplicate — trim if still there
	for i, x in enumerate(b):
		if x.get("kind") == "p" and x.get("html", "").startswith("She was with child before they ever reached Manno. She is still with child"):
			b[i] = p(
				"She is still with child the following spring, and the clerk’s wife, who has delivered half the county, stops coming to check and starts coming to stare.",
				"이듬해 봄에도 아이는 그대로고, 군 반을 받은 아전의 아내는 진찰하러 오다가 이제는 보러 온다.",
			)
			break

	# image slots
	new_slots = [
		{"id": "seo-white-look", "ratio": 2, "tone": "#c98bb9", "time": "day", "at": "What is left is a man on a horse and a woman in the dust.", "alt": "White-void two-shot: Seohyun and Manmyung look, the street gone", "people": ["seohyeon", "manmyung"]},
		{"id": "seo-white-kiss", "ratio": 2, "tone": "#c98bb9", "time": "day", "at": "This one takes the street with it", "alt": "White ground: first kiss, paper-white world", "people": ["seohyeon", "manmyung"]},
		{"id": "seo-family-dinner", "ratio": 2, "tone": "#7a3b2e", "time": "night", "at": "three people eat at a table built for twelve", "alt": "Suulbu's hall: three at a table for twelve, Manmyung looking at the gate", "people": ["sukhuljong", "manmyung"]},
		{"id": "seo-suulbu-scold", "ratio": 2, "tone": "#7a3b2e", "time": "night", "at": "You do not stand in my gate for a Gaya boy", "alt": "Suulbu scolds Manmyung across the supper table", "people": ["sukhuljong", "manmyung"]},
		{"id": "seo-room-built", "ratio": 2, "tone": "#7a3b2e", "time": "day", "at": "The timber goes up in three days", "alt": "The raised house-apart going up; Suulbu watches", "people": ["sukhuljong", "manmyung"]},
		{"id": "seo-he-locks", "ratio": 2, "tone": "#7a3b2e", "time": "night", "at": "Then you can look at the gate from the inside", "alt": "Suulbu drops the bar on his own daughter", "people": ["sukhuljong", "manmyung"]},
		{"id": "seo-hut-storm", "ratio": 2, "tone": "#c98bb9", "time": "night", "at": "The storm does the talking. They do not.", "alt": "Storm hut: wet silk, hearth, the door that will not shut", "people": ["seohyeon", "manmyung"], "nsfw": "erotic"},
		{"id": "seo-pregnant-room", "ratio": 2, "tone": "#c98bb9", "time": "day", "at": "puts it where the silk is tight", "alt": "Manno room: his hand on the tight silk, she laughs", "people": ["seohyeon", "manmyung"], "nsfw": "erotic"},
		{"id": "seo-pregnant-kiss", "ratio": 2, "tone": "#c98bb9", "time": "night", "at": "They are not careful at noon either", "alt": "Pregnant Manmyung and Seohyun, still all over each other", "people": ["seohyeon", "manmyung"], "nsfw": "erotic"},
	]
	have = {im["id"] for im in entry.get("images") or []}
	entry.setdefault("images", [])
	for s in new_slots:
		if s["id"] not in have:
			entry["images"].append(s)

	# sanity
	labs = [x["label"] for x in b if x.get("kind") in ("section", "scene")]
	print("outline:")
	for x in b:
		if x.get("kind") in ("section", "scene"):
			print(f"  {x['kind']:7} {x['label']}")

	STORY.write_text(json.dumps(story, ensure_ascii=False, indent="\t") + "\n")
	print("blocks", len(b), "new slots", [s["id"] for s in new_slots])


if __name__ == "__main__":
	main()
