#!/usr/bin/env python3
"""Sunhwa at Jinpyung’s supper; adult-young Chunmyung/Yongsu romance in 606."""
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


def find(bs, pred):
	for i, b in enumerate(bs):
		if pred(b):
			return i
	raise KeyError("anchor")


def replace_html(e, old, html, ko):
	for b in e["blocks"]:
		if b.get("html") == old:
			b["html"] = html
			b["ko"] = ko
			return
	raise KeyError(old)


def after_html(e, frag, blocks):
	bs = e["blocks"]
	i = find(bs, lambda b: frag in (b.get("html") or ""))
	for j, nb in enumerate(blocks):
		bs.insert(i + 1 + j, nb)


def after_en(e, frag, blocks):
	bs = e["blocks"]
	i = find(bs, lambda b: frag in " ".join(b.get("en") or []))
	for j, nb in enumerate(blocks):
		bs.insert(i + 1 + j, nb)


SUPPER_598 = [
	{
		"kind": "dialogue",
		"person": "sunhwa",
		"chip": "#eeb8d2",
		"lines": [
			"먹어요, 천명아.",
			"안 먹으면 아버지가 진짜로 그 사람한테 보내. 국 든 그 사람.",
		],
		"en": [
			"Eat it, Chunmyung.",
			"If you don’t, Father will actually send you to him. The one with the soup.",
		],
	},
	{
		"kind": "dialogue",
		"person": "chunmyung",
		"chip": "#d8a0e8",
		"lines": ["선화 언니는 상관없잖아요."],
		"en": ["Easy for you to say."],
	},
	{
		"kind": "dialogue",
		"person": "sunhwa",
		"chip": "#eeb8d2",
		"lines": [
			"상관없지.",
			"난 이 상에 오래 안 있을 거니까.",
		],
		"en": [
			"It is easy.",
			"I’m not staying at this table long.",
		],
	},
	{
		"kind": "dialogue",
		"person": "jinpyung",
		"lines": ["선화야."],
		"en": ["Sunhwa."],
	},
	{
		"kind": "dialogue",
		"person": "sunhwa",
		"chip": "#eeb8d2",
		"lines": ["생선은 먹었어요, 아버지. 저 얘긴 안 한 거예요."],
		"en": ["I ate my fish, Father. I didn’t say the other part."],
	},
]

SUPPER_602 = [
	{
		"kind": "dialogue",
		"person": "sunhwa",
		"chip": "#eeb8d2",
		"lines": [
			"국은 안 흘리네.",
			"천명아. 저 사람, 농담이 아니었어.",
		],
		"en": [
			"He didn’t spill it.",
			"Chunmyung. That wasn’t a joke.",
		],
	},
	{
		"kind": "dialogue",
		"person": "chunmyung",
		"chip": "#d8a0e8",
		"lines": ["언니는 빠져 나가잖아요. 저만 남고요."],
		"en": ["You’re getting out. I’m the one who stays."],
	},
	{
		"kind": "dialogue",
		"person": "sunhwa",
		"chip": "#eeb8d2",
		"lines": [
			"서쪽 우물에서 노래 하나 돌잖아.",
			"아버지, 그거 사람이에요, 아니면 아직 노래예요.",
		],
		"en": [
			"There’s a song at the west well.",
			"Father. Is that a person yet, or still a song.",
		],
	},
	{
		"kind": "dialogue",
		"person": "jinpyung",
		"lines": ["나중에 하자. 오늘 밤은 네 동생 몫이다."],
		"en": ["Later. Tonight is your sister’s."],
	},
]

ROMANCE_606 = [
	{
		"kind": "scene",
		"label": "Stream House",
		"ko": "개울가 집",
		"jump": {
			"year": 606,
			"en": "Four Years Later…",
			"ko": "네 해 뒤…",
		},
	},
	{
		"kind": "p",
		"html": "The boy is three. He is asleep in the next room, which is the only reason the house is quiet.",
		"ko": "아이는 세 살이다. 옆방에서 자고 있다. 집이 조용한 이유는 그것뿐이다.",
	},
	{
		"kind": "p",
		"html": "She finds him on the bank with his sleeves in the water, counting something only he can see. She ties them back. He lets her. He always lets her.",
		"ko": "그녀는 둑에서 그를 찾는다. 소매를 물에 담근 채, 자기만 보이는 걸 세고 있다. 그녀가 소매를 걷어 묶는다. 그는 그냥 둔다. 늘 그냥 둔다.",
	},
	{
		"kind": "dialogue",
		"person": "chunmyung",
		"chip": "#d8a0e8",
		"lines": [
			"또 물에 넣었어.",
			"세고 있는 거, 나한테도 말해.",
		],
		"en": [
			"In the water again.",
			"Whatever you’re counting, tell me too.",
		],
	},
	{
		"kind": "dialogue",
		"person": "yongsu",
		"chip": "#6a7cb0",
		"lines": [
			"비녀.",
			"일곱. 하나가 빠져 있어. 머리 왼쪽.",
		],
		"en": [
			"Hairpins.",
			"Seven. One’s missing. Left side.",
		],
	},
	{
		"kind": "dialogue",
		"person": "chunmyung",
		"chip": "#d8a0e8",
		"lines": [
			"일부러야.",
			"네가 세게.",
		],
		"en": [
			"On purpose.",
			"So you’d count.",
		],
	},
	{
		"kind": "p",
		"html": "He laughs on the beat. She kisses him before he can be late about it.",
		"ko": "그가 제때 웃는다. 그녀는 그가 한 박자 늦기 전에 입을 맞춘다.",
	},
	{
		"kind": "dialogue",
		"person": "yongsu",
		"chip": "#6a7cb0",
		"lines": ["…서까래한테는 이 얘기 안 해."],
		"en": ["…I’m not telling the rafters this one."],
	},
	{
		"kind": "dialogue",
		"person": "chunmyung",
		"chip": "#d8a0e8",
		"lines": [
			"여기선 내 거랬지.",
			"들어와. 발 시려.",
		],
		"en": [
			"In here you’re mine. I said that.",
			"Come in. My feet are cold.",
		],
	},
	{
		"kind": "p",
		"html": "They go in. The lamp is already lit. She does not let him talk to the dark.",
		"ko": "둘은 들어간다. 등잔은 이미 켜져 있다. 그녀는 그가 어둠에 말 걸게 두지 않는다.",
	},
]


def patch(title):
	e = entry(title)
	replace_html(
		e,
		"The king eats with his family when he can, which is not often, and with the door shut, which is the point. A queen, two daughters, and a servant with the soup.",
		"The king eats with his family when he can, which is not often, and with the door shut, which is the point. A queen, three daughters, and a servant with the soup.",
		"왕은 틈이 나면 가족과 밥을 먹는다. 자주는 아니다. 문은 닫는다. 그게 핵심이다. 왕비, 딸 셋, 그리고 국을 든 하인 하나.",
	)
	after_en(e, "She’s three. She says no to everything.", SUPPER_598)
	after_html(e, "The soup does not spill.", SUPPER_602)
	after_html(
		e,
		"The neighbours, listening at the wall for goblins, are bitterly disappointed.",
		ROMANCE_606,
	)


patch("Bihyung")
patch("Kim Yongsu")
STORY.write_text(json.dumps(story, ensure_ascii=False, indent="\t") + "\n")
print("patched Bihyung + Kim Yongsu")
