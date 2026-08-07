#!/usr/bin/env python3
"""Arc 3: Kangrim rename + deathbeds, Wu/ambassadors, Euija White River, Tamla origin finale."""

from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORY = ROOT / "src/lib/data/story.json"
PEOPLE = ROOT / "src/lib/people.ts"


def load():
	return json.loads(STORY.read_text())


def save(data):
	STORY.write_text(json.dumps(data, ensure_ascii=False, indent="\t") + "\n")


def find_entry(chapters, title: str, year: str | None = None):
	for ch in chapters:
		for en in ch.get("entries", []):
			if en.get("title") == title and (year is None or en.get("year") == year):
				return en
	raise KeyError(f"entry not found: {title} ({year})")


def already(blocks, needle: str) -> bool:
	blob = json.dumps(blocks, ensure_ascii=False)
	return needle in blob


def p(html, ko=None):
	b = {"kind": "p", "html": html}
	if ko:
		b["ko"] = ko
	return b


def dlg(person, en, lines=None, chip=None):
	b = {"kind": "dialogue", "person": person, "en": en, "lines": lines or en}
	if chip:
		b["chip"] = chip
	return b


def mono(html, ko, person="chunchu"):
	return {"kind": "monologue", "person": person, "html": html, "ko": ko}


def rename_kangrim(data) -> None:
	"""Rename id gangnim → kangrim everywhere in story.json."""
	blob = json.dumps(data, ensure_ascii=False)
	blob = blob.replace('"person": "gangnim"', '"person": "kangrim"')
	blob = blob.replace("<b>Gangnim</b>", "<b>Kangrim</b>")
	blob = blob.replace("Gangnim", "Kangrim")
	blob = blob.replace("gangnim", "kangrim")
	# Korean spelling stays 강림
	new = json.loads(blob)
	data.clear()
	data.extend(new)
	print("Renamed gangnim → kangrim in story.json")


def patch_white_river_meet(chapters) -> None:
	en = find_entry(chapters, "The Eight Great Clans", "632")
	if already(en["blocks"], "White River where he will one day"):
		print("White River meet already named")
		return
	# Name the meeting water as White River in first suitable dive/name beat
	for b in en["blocks"]:
		if b.get("kind") == "p" and "dive" in b.get("html", "").lower() and "Gyebek" in b.get("html", ""):
			b["html"] = b["html"].replace(
				"the water",
				"the White River",
				1,
			)
			if b.get("ko") and "물" in b["ko"]:
				b["ko"] = b["ko"].replace("물", "백강", 1)
			print("Named Euija–Gyebek meet as White River (partial)")
			break
	# Stronger: insert clarifying line if we find the naming
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "dialogue" and b.get("person") == "euija":
			ens = " ".join(b.get("en") or [])
			if "Gyebek" in ens or "계백" in " ".join(b.get("lines") or []):
				# insert after this naming line
				if not already(en["blocks"], "It is the White River"):
					en["blocks"].insert(
						i + 1,
						p(
							"It is the <b>White River</b> — the same water that will later turn red in the omens, and the same water he will throw himself into when the wine finally stops working.",
							"그곳이 <b>백강</b>이다 — 훗날 징조에서 붉어질 물, 술이 더는 듣지 않을 때 그가 제 몸을 던질 바로 그 물.",
						),
					)
					print("White River foreshadow inserted after naming")
				return
	print("WARN: could not find Euija naming Gyebek to attach White River")


def patch_gotaso_kangrim(chapters) -> None:
	en = find_entry(chapters, "Daeya Fortress", "642")
	if already(en["blocks"], "Who… are you"):
		print("Gotaso Kangrim already present")
		return
	scene = [
		p(
			"In the inner room <b>Gotaso</b> understands before anyone says the word. The fortress is finished. Her husband is finished. She is nineteen and the forever she promised at the wedding has run out of road.",
			"안방에서 <b>고타소</b>는 누가 그 말을 꺼내기 전에 알아차린다. 성이 끝났다. 남편이 끝났다. 열아홉이고, 혼례에서 약속한 영원은 길이 다했다.",
		),
		dlg(
			"gotaso",
			[
				"Husband…",
				"If you are going to do it — look at me.",
			],
			[
				"낭군…",
				"하실 거라면 — 저를 보세요.",
			],
			"#e8a0b8",
		),
		p(
			"The air thins. A man who was not in the fortress is suddenly in the fortress — ledger under one arm, crow-dark robe, the polite distance of someone who has nowhere to hurry because he owns the schedule.",
			"공기가 옅어진다. 성에 없던 사내가 갑자기 성 안에 있다 — 한쪽 팔에 명부, 까마귀빛 도포, 서두를 곳이 없는 사람의 공손한 거리. 일정을 소유한 자이니까.",
		),
		dlg(
			"kangrim",
			[
				"Lady Gotaso.",
				"One question, then we walk.",
				"When you chose forever — did you choose the man, or the vow?",
			],
			[
				"고타소 낭자.",
				"질문 하나, 그리고 걷읍시다.",
				"영원을 고르실 때 — 그 사람을 고르신 겁니까, 맹세를 고르신 겁니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"gotaso",
			[
				"Who… are you?",
				"I don’t know your face. I don’t know your house.",
				"Are you Baekje? Are you—",
			],
			[
				"당신… 누구세요?",
				"얼굴을 모르겠어요. 집안도 모르고.",
				"백제 사람인가요? 아니면—",
			],
			"#e8a0b8",
		),
		dlg(
			"kangrim",
			[
				"Neither. I collect.",
				"You do not need to know me. Almost nobody does, until they do.",
				"The question stands.",
			],
			[
				"둘 다 아닙니다. 저는 거둬 갑니다.",
				"저를 아실 필요 없습니다. 알기 전까지는 거의 아무도 모릅니다.",
				"질문은 그대로입니다.",
			],
			"#5f5f6b",
		),
		dlg(
			"gotaso",
			[
				"…The vow.",
				"No — him.",
				"…Both. That is why it hurts.",
			],
			[
				"…맹세요.",
				"아니 — 그이요.",
				"…둘 다요. 그래서 아픈 거예요.",
			],
			"#e8a0b8",
		),
		dlg(
			"kangrim",
			[
				"Honest. Rare.",
				"Come. The underworld keeps better forever than fortresses do.",
			],
			[
				"정직하시군요. 드뭅니다.",
				"갑시다. 저승이 성보다 영원을 잘 지킵니다.",
			],
			"#5f5f6b",
		),
		p(
			"She goes with him surprised to the last — not by dying, but by discovering there was a door she had never been told about.",
			"그녀는 끝까지 놀라며 그와 함께 간다 — 죽는 것 때문이 아니라, 아무도 알려 주지 않은 문이 있었다는 발견 때문에.",
		),
	]
	# Insert just before Surabol messenger
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "messenger brings the news to Surabol" in b.get("html", ""):
			en["blocks"][i:i] = scene
			print(f"Gotaso–Kangrim deathbed inserted ({len(scene)} blocks)")
			return
	# fallback: after summary kill line
	for i, b in enumerate(en["blocks"]):
		if "kills himself and his wife" in b.get("html", ""):
			en["blocks"][i + 1 : i + 1] = scene
			print("Gotaso–Kangrim inserted after summary")
			return
	raise RuntimeError("Daeya insert point missing")


def deepen_death_question(blocks, person_id: str, question_en: list[str], question_ko: list[str], answer_en=None, answer_ko=None, answer_person=None) -> bool:
	"""After first kangrim dialogue with person_id, ensure a life-choice question exists."""
	for i, b in enumerate(blocks):
		if b.get("kind") == "dialogue" and b.get("person") == "kangrim":
			# look nearby for the dying person
			window = blocks[max(0, i - 3) : i + 6]
			ids = {x.get("person") for x in window if x.get("kind") == "dialogue"}
			if person_id in ids or (answer_person and answer_person in ids):
				if already(window, question_en[0][:40]):
					return False
				insert_at = i + 1
				extra = [
					dlg("kangrim", question_en, question_ko, "#5f5f6b"),
				]
				if answer_en and answer_person:
					extra.append(dlg(answer_person, answer_en, answer_ko or answer_en))
				blocks[insert_at:insert_at] = extra
				return True
	return False


def patch_existing_kangrim_questions(chapters) -> None:
	# Bidam
	en = find_entry(chapters, "Bidam’s Rebellion")
	if deepen_death_question(
		en["blocks"],
		"bidam",
		[
			"Councillor — one question before the minutes close.",
			"When you flew the kite: were you saving the country, or saving the version of it that still needed you?",
		],
		[
			"재상 — 회의록이 닫히기 전 질문 하나.",
			"연을 올리실 때: 나라를 구한 겁니까, 아니면 아직 당신이 필요한 그 나라의 버전을 구한 겁니까?",
		],
		[
			"…Both answers hang me.",
			"I will take the honest one. I needed to be necessary.",
		],
		[
			"…어느 대답이든 목이 답니다.",
			"정직한 쪽으로 가겠소. 나는 필요해지고 싶었소.",
		],
		"bidam",
	):
		print("Bidam Kangrim question deepened")

	# Sunduk — find kangrim near sunduk
	if deepen_death_question(
		en["blocks"],
		"sunduk",
		[
			"Majesty. While Yushin still holds your hand —",
			"Did you choose the throne because heaven asked, or because the room would not stop asking?",
		],
		[
			"폐하. 유신이 아직 손을 잡는 동안 —",
			"하늘이 물어서 왕좌를 고르셨습니까, 아니면 방이 묻기를 멈추지 않아서입니까?",
		],
		[
			"…Tell the sacred country I was tired of being clever for other people’s fear.",
			"That is my answer.",
		],
		[
			"…신성한 나라에 전하라. 남의 공포를 위해 영리하기에 지쳤다고.",
			"그게 내 대답이다.",
		],
		"sunduk",
	):
		print("Sunduk Kangrim question deepened")

	# Gyebek at Yellow Mountain
	try:
		en = find_entry(chapters, "Yellow Mountain Fields")
	except KeyError:
		en = find_entry(chapters, "Yellow Mountain Fields", "660")
	if deepen_death_question(
		en["blocks"],
		"gyebek",
		[
			"General. The five thousand can already see me — so I will ask you alone.",
			"When you killed your family to keep your oath: was that loyalty, or terror of becoming soft?",
		],
		[
			"장군. 오천이 이미 나를 보니 — 질문만 당신에게.",
			"약조를 지키려 집안을 베었을 때: 그것이 충성이었습니까, 아니면 무르게 될까 두려운 것이었습니까?",
		],
		[
			"…Loyalty.",
			"If it was terror, do not tell them. Let them keep the prettier word.",
		],
		[
			"…충성이오.",
			"두려움이었다면 그들에게 말하지 마시오. 더 예쁜 말을 갖게 두시오.",
		],
		"gyebek",
	):
		print("Gyebek Kangrim question deepened")

	# Yeon near-death — he refuses; still ask
	en = find_entry(chapters, "Snake River", "662")
	if not already(en["blocks"], "If you walk away now"):
		for i, b in enumerate(en["blocks"]):
			if b.get("person") == "kangrim" and "ledger" not in json.dumps(b).lower():
				pass
		for i, b in enumerate(en["blocks"]):
			if b.get("kind") == "dialogue" and b.get("person") == "kangrim":
				en["blocks"][i + 1 : i + 1] = [
					dlg(
						"kangrim",
						[
							"Commander. If you walk away now —",
							"are you choosing Goguryeo, or choosing not to be finished by anyone else’s schedule?",
						],
						[
							"대막리지. 지금 걸어가신다면 —",
							"고구려를 고르는 겁니까, 아니면 남의 일정에 끝나지 않기를 고르는 겁니까?",
						],
						"#5f5f6b",
					),
					dlg(
						"gesomun",
						[
							"Both.",
							"And neither is your business until I am done.",
						],
						[
							"둘 다다.",
							"그리고 내가 끝날 때까지 네 알 바 아니다.",
						],
						"#d0362f",
					),
				]
				print("Yeon Kangrim choice question added")
				break


def patch_jinduk_kangrim(chapters) -> None:
	en = find_entry(chapters, "King Muyeol", "654")
	if already(en["blocks"], "Sacred Bone ends"):
		print("Jinduk Kangrim already present")
		return
	scene = [
		dlg(
			"kangrim",
			[
				"Majesty.",
				"Sacred Bone ends on your breath. One question.",
				"Did you keep the crown warm for the next hand — or keep it from cooling into a man’s?",
			],
			[
				"폐하.",
				"성골이 당신 숨에서 끝납니다. 질문 하나.",
				"다음 손을 위해 왕관을 따뜻이 두셨습니까 — 아니면 사내의 것으로 식지 않게 지키신 겁니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"jinduk",
			[
				"…I kept a seat from becoming a joke.",
				"That is all the Sacred Bone had left to do.",
			],
			[
				"…자리가 농담이 되지 않게 지켰소.",
				"성골에게 남은 일은 그것뿐이었어.",
			],
			"#E8552B",
		),
		dlg(
			"kangrim",
			[
				"Then the minutes are clean.",
				"Walk.",
			],
			[
				"그러면 회의록은 깨끗합니다.",
				"걸으시지요.",
			],
			"#5f5f6b",
		),
	]
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "Queen Jinduk</b> is dead" in b.get("html", ""):
			en["blocks"][i:i] = scene
			print("Jinduk–Kangrim inserted")
			return
	print("WARN: Jinduk death line not found")


def patch_euija_kangrim(chapters) -> None:
	en = find_entry(chapters, "The Death of Buyeo Euija")
	if already(en["blocks"], "drag a foreign army"):
		# still check for kangrim
		if already(en["blocks"], "person\": \"kangrim") or already(en["blocks"], '"person": "kangrim"'):
			print("Euija Kangrim already present")
			return
	if already(en["blocks"], "You sold miracles"):
		print("Euija Kangrim already present")
		return
	scene = [
		dlg(
			"kangrim",
			[
				"Eraha.",
				"Before the enemy capital finishes humiliating you — one question.",
				"When you named a nameless boy at the White River: were you making a friend, or manufacturing a miracle you could not later refuse?",
			],
			[
				"어라하.",
				"적국 도읍이 능욕을 끝내기 전 — 질문 하나.",
				"백강에서 이름 없는 아이를 이름 붙였을 때: 친구를 만든 겁니까, 아니면 나중에도 거절할 수 없는 기적을 만든 겁니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"euija",
			[
				"…A friend.",
				"The miracle was the cheap part. The friend was the expensive one.",
			],
			[
				"…친구요.",
				"기적은 싼 쪽이었어. 친구가 비싼 쪽이었지.",
			],
			"#e08a2e",
		),
		dlg(
			"kangrim",
			[
				"Then you die richer than the record will admit.",
				"Come.",
			],
			[
				"그러면 기록보다 부자로 죽는 겁니다.",
				"갑시다.",
			],
			"#5f5f6b",
		),
	]
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "Euija dies, vengeful" in b.get("html", ""):
			en["blocks"][i:i] = scene
			print("Euija–Kangrim inserted")
			return
	print("WARN: Euija death insert missing")


def patch_chunchu_kangrim(chapters) -> None:
	en = find_entry(chapters, "The Death of Kim Chunchu", "661")
	if already(en["blocks"], "Council politics"):
		print("Chunchu Kangrim already present")
		return
	scene = [
		dlg(
			"kangrim",
			[
				"King Muyeol.",
				"We have met before — in your daughter’s eyes, if not in yours.",
				"One question. When you knelt in Chang’an and brought their army home: were you saving Silla, or ending the kind of country that argues itself to death?",
			],
			[
				"무열왕.",
				"우리는 만난 적 있습니다 — 당신 눈이 아니라 따님의 눈에서.",
				"질문 하나. 장안에서 무릎 꿇고 그들의 군대를 데려왔을 때: 신라를 구한 겁니까, 아니면 말다툼하다 죽는 나라의 종류를 끝낸 겁니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"chunchu",
			[
				"…Both.",
				"I saw a room where they all absolutely obeyed one man — no matter what.",
				"I never un-saw it. That is my crime, and my gift to my son.",
			],
			[
				"…둘 다요.",
				"한 사람에게 — 무슨 일이 있어도 — 모두가 절대 복종하는 방을 보았소.",
				"그걸 언-보지는 못했소. 그게 내 죄이고, 아들에게 주는 선물이오.",
			],
			"#D8258C",
		),
		dlg(
			"kangrim",
			[
				"The ledger does not moralize.",
				"It only asks whether you knew. You knew.",
				"Walk, Spring-and-Autumn.",
			],
			[
				"명부는 도덕을 논하지 않습니다.",
				"알았는지만 묻습니다. 당신은 알았습니다.",
				"걸으시지요, 춘추.",
			],
			"#5f5f6b",
		),
	]
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and ("King Muyeol (58) dies" in b.get("html", "") or "dies." in b.get("html", "") and "Muyeol" in b.get("html", "")):
			en["blocks"][i:i] = scene
			print("Chunchu–Kangrim inserted")
			return
	# before eulogy header
	for i, b in enumerate(en["blocks"]):
		if b.get("html", "").startswith("<b>— Kim Chunchu"):
			en["blocks"][i:i] = scene
			print("Chunchu–Kangrim inserted before eulogy")
			return
	print("WARN: Chunchu death insert missing")


def patch_gesomun_death_kangrim(chapters) -> None:
	en = find_entry(chapters, "The Death of Yeon Gesomun", "665")
	if already(en["blocks"], "You refused me once"):
		print("Gesomun death Kangrim already present")
		return
	scene = [
		dlg(
			"kangrim",
			[
				"Commander. You refused me once at the Snake River.",
				"The crow does not allow a second refusal.",
				"Question: when you killed the council — were you freeing Goguryeo from talk, or freeing yourself from being talked back to?",
			],
			[
				"대막리지. 당신, 살수에서 나를 한 번 거절했지.",
				"까마귀는 두 번을 허락하지 않네.",
				"질문: 회의를 베었을 때 — 고구려를 말로부터 해방한 겁니까, 아니면 되받아치는 말로부터 당신을 해방한 겁니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"gesomun",
			[
				"…Talk was killing us slower than Tang.",
				"I chose the faster knife. Leave my sons the rest.",
			],
			[
				"…말은 당보다 천천히 우리를 죽이고 있었다.",
				"빠른 칼을 골랐다. 나머지는 아들들에게 남겨라.",
			],
			"#d0362f",
		),
		dlg(
			"kangrim",
			[
				"They will use it on each other.",
				"I am not here to argue. Tip of the hat — you were rude with style.",
			],
			[
				"서로에게 쓰겠군.",
				"논쟁하러 온 게 아니야. 모자 끝을 — 무례해도 품위는 있었어.",
			],
			"#5f5f6b",
		),
	]
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "Yeon Gesomun is dying" in b.get("html", ""):
			en["blocks"][i + 1 : i + 1] = scene
			print("Gesomun death–Kangrim inserted")
			return
	print("WARN: Gesomun death insert missing")


def patch_yushin_kangrim(chapters) -> None:
	en = find_entry(chapters, "The Death of Kim Yushin", "673")
	if already(en["blocks"], "Assimilation is a long word"):
		# still ok to add kangrim
		pass
	if already(en["blocks"], "Were you becoming Silla"):
		print("Yushin Kangrim already present")
		return
	scene = [
		dlg(
			"kangrim",
			[
				"Marshal.",
				"One hundred and eight draws, one win that ended a friend, sixty years of being useful.",
				"Question: were you becoming Silla — or proving you never needed their blood to outserve them?",
			],
			[
				"대장군.",
				"백여덟 무승부, 친구를 끝낸 한 승, 육십 년의 쓸모.",
				"질문: 신라가 되려 한 겁니까 — 아니면 그들 피 없이도 더 섬길 수 있음을 증명한 겁니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"yushin",
			[
				"…I wanted in.",
				"Wanting in is not shameful. Pretending I did not is.",
			],
			[
				"…들어가고 싶었네.",
				"들어가고 싶은 건 부끄러운 게 아니야. 아니라고 꾸미는 게 부끄러운 거지.",
			],
			"#4a8fe0",
		),
		dlg(
			"kangrim",
			[
				"Clean answer.",
				"The underworld has room for men who told the truth late.",
			],
			[
				"깨끗한 대답이군.",
				"저승엔 늦게 진실을 말한 사내를 둘 자리가 있네.",
			],
			"#5f5f6b",
		),
	]
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "He is seventy-nine" in b.get("html", ""):
			# insert near end before Munhee courtyard, after Munmu quotes
			pass
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "Munhee (65)</b> is in the courtyard" in b.get("html", ""):
			en["blocks"][i:i] = scene
			print("Yushin–Kangrim inserted")
			return
	en["blocks"].extend(scene)
	print("Yushin–Kangrim appended")


def patch_pumsuk_kangrim(chapters) -> None:
	en = find_entry(chapters, "Daeya Fortress", "642")
	if already(en["blocks"], "Hwarang Pumsuk"):
		if already(en["blocks"], "Did you swear"):
			print("Pumsuk Kangrim already present")
			return
	scene = [
		dlg(
			"kangrim",
			[
				"Hwarang Pumsuk.",
				"Did you swear to protect her because you loved her — or because her father’s eyes were on you?",
			],
			[
				"품석 화랑.",
				"그녀를 지키겠다고 맹세한 것이 — 사랑 때문이었습니까, 아니면 장인 어른의 눈 때문이었습니까?",
			],
			"#5f5f6b",
		),
		dlg(
			"pumsuk",
			[
				"…I wanted both to be the same thing.",
				"They were not. That is on me.",
			],
			[
				"…둘 다 같은 것이길 바랐소.",
				"아니었소. 내 탓이오.",
			],
			"#5b7fd0",
		),
	]
	# after Gotaso walks with Kangrim
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "surprised to the last" in b.get("html", ""):
			en["blocks"][i + 1 : i + 1] = scene
			print("Pumsuk–Kangrim inserted")
			return
	print("WARN: Pumsuk Kangrim insert missing (Gotaso scene first)")


def patch_nine_plagues_euija(chapters) -> None:
	en = find_entry(chapters, "The Nine Plagues", "659")
	if already(en["blocks"], "Summon Gyebek"):
		print("Euija White River awakening already present")
		return
	scene = [
		p(
			"That night he leaves the palace the way he left it as a boy — without asking, without banners. The White River is waiting where it always waited. The omen said it ran red. Under the moon it is only black water and the smell of wet stone.",
			"그날 밤 그는 소년 때처럼 궁을 나선다 — 묻지 않고, 깃발 없이. 백강은 늘 기다리던 자리에 있다. 징조는 붉다 했고, 달 아래에서는 검은 물과 젖은 돌 냄새뿐이다.",
		),
		p(
			"He has spent years drowning on dry land — wine, women, the soft violence of refusing to hear his own name for the man he sent away. The river does not care. It knew him before the crown.",
			"그는 마른 땅에서 몇 해를 익사하며 보냈다 — 술, 여인, 멀리 보낸 사내의 이름을 듣지 않으려는 부드러운 폭력. 강은 상관하지 않는다. 왕관보다 먼저 그를 알았으니까.",
		),
		dlg(
			"euija",
			[
				"(to the water, and to a boy who once would have died on the twentieth dive)",
				"I named you here.",
				"I will not die drunk on the bank of my own invention.",
			],
			[
				"(물에게, 그리고 스무 번째 잠수에서 죽었을 소년에게)",
				"여기서 네 이름을 지었다.",
				"내 발명품 강둑에서 취해 죽지는 않겠다.",
			],
			"#e08a2e",
		),
		p(
			"He jumps. The cold edits him. Years of hedonism come off like a coat that never fitted. When he surfaces he is coughing, furious, awake — the promising prince the eight clans once feared, scraped clean by the same river that taught him friendship.",
			"뛰어든다. 추위가 그를 교정한다. 몇 해의 향락이 맞지 않던 겉옷처럼 벗겨진다. 물 밖으로 나올 때 그는 기침하고, 분노하고, 깨어 있다 — 대성팔족이 한때 두려워하던 촉망받는 왕자, 우정을 가르친 바로 그 강에 긁혀 깨끗해진.",
		),
		dlg(
			"euija",
			[
				"Summon Gyebek…!",
			],
			[
				"계백을 불러라…!",
			],
			"#e08a2e",
		),
	]
	en["blocks"].extend(scene)
	print("Euija White River awakening appended to Nine Plagues")


def patch_kangrim_origin_finale(chapters) -> None:
	"""Insert Kangrim origin as the final Tamla tale after The Fifth Year."""
	# find chapter containing Fifth Year
	host = None
	idx = None
	for ch in chapters:
		for i, en in enumerate(ch.get("entries", [])):
			if en.get("title") == "The Fifth Year":
				host = ch
				idx = i
				break
		if host:
			break
	if host is None:
		raise RuntimeError("Fifth Year not found")
	# already?
	for en in host["entries"]:
		if en.get("title") == "Kangrim":
			print("Kangrim origin tale already present")
			return
	tale = {
		"year": "태초",
		"title": "Kangrim",
		"subtitle": "강림",
		"badges": ["flag:tamla"],
		"images": [{"id": "kangrim-ledger", "ratio": 2.4, "tone": "#1f2937"}],
		"blocks": [
			p(
				"The island keeps one story for last — not because it is kind, but because once you have heard it, every other ending on the mainland makes a different kind of sense.",
				"섬은 이야기를 하나를 마지막에 남겨 둔다 — 착해서가 아니라, 듣고 나면 육지의 모든 끝이 다른 종류로 이해되기 때문이다.",
			),
			p(
				"Heaven once sent a messenger to arrest the <b>King of the Dead</b>. The messenger’s name was <b>Kangrim</b>. He went down with a ledger that told each living person their hour. A crow found the ledger. Crows are not sentimental. It scrambled the pages for sport.",
				"하늘이 한때 <b>저승왕</b>을 잡아 오라 사신을 보냈다. 사신의 이름은 <b>강림</b>이었다. 그는 산 사람마다 죽을 시각을 적은 명부를 들고 내려갔다. 까마귀가 명부를 보았다. 까마귀는 감상적이지 않다. 장난으로 장을 뒤섞었다.",
			),
			dlg(
				"kangrim",
				[
					"I was told to bring one king up.",
					"I stayed. The underworld keeps better hours than heaven.",
					"Now I come for you — and because of the crow, neither of us knows when until I am already in the room.",
				],
				[
					"왕 하나를 올려 보내라는 명을 받았지.",
					"남았다. 저승이 하늘보다 시간을 잘 지키거든.",
					"이제 내가 당신을 데리러 온다 — 까마귀 때문에, 내가 이미 방에 들어오기 전엔 누구도 언제인지 모른다.",
				],
				"#5f5f6b",
			),
			p(
				"That is why he asks a question at the threshold. Not for judgment — for the minutes. A scrambled list still deserves accurate last words.",
				"그래서 그는 문턱에서 질문을 한다. 심판이 아니라 회의록을 위해서. 뒤섞인 명부에도 정확한 유언은 필요하니까.",
			),
			dlg(
				"kangrim",
				[
					"I do not punish.",
					"I collect.",
					"If your answer is honest, the walk is shorter.",
				],
				[
					"나는 벌하지 않는다.",
					"거둬 갈 뿐.",
					"대답이 정직하면, 걸음이 짧아진다.",
				],
				"#5f5f6b",
			),
			p(
				"On Tamla they tell children: be kind before you are finished, because Kangrim’s crow has already decided the hour, and the only thing left to choose is what you will admit when he asks.",
				"탐라에서는 아이들에게 말한다. 끝나기 전에 착하게 살아라. 강림의 까마귀가 이미 시각을 정했고, 남는 선택은 그가 물을 때 무엇을 인정할 것뿐이니.",
			),
			{
				"kind": "moral",
				"label": "the last island story",
				"html": "You cannot bargain with the hour. You can still answer the question.",
				"ko": "시각과는 흥정할 수 없다. 질문에는 여전히 답할 수 있다.",
			},
		],
		"music": "The Last of the Gaya",
	}
	host["entries"].insert(idx + 1, tale)
	# Soften the earlier stone-tale intro so origin is not duplicated as "final"
	try:
		stone = find_entry(chapters, "The Ones That End in Stone")
		for b in stone["blocks"]:
			if b.get("kind") == "p" and "Kangrim</b>, sent down" in b.get("html", ""):
				b["html"] = (
					"There is <b>Kangrim</b> — but the island does not tell his full story until last. "
					"For now it is enough to know he comes for you, and that a crow once ruined his schedule."
				)
				b["ko"] = (
					"<b>강림</b>이 있다 — 그러나 섬은 그의 전부를 마지막에야 말한다. "
					"지금은, 그가 당신을 데리러 온다는 것과 까마귀가 한때 그의 일정을 망쳤다는 것만으로 충분하다."
				)
				print("Softened early Kangrim mention in stone tale")
				break
	except KeyError:
		pass
	print("Kangrim origin inserted as final Tamla tale after Fifth Year")


def patch_chang_an(chapters) -> None:
	en = find_entry(chapters, "Silla-Tang Alliance", "648")
	if already(en["blocks"], "Western Ambassador"):
		print("Chang'an ambassadors already present — refreshing Wu flirt if needed")
	else:
		# After Inmun stays / before gyuku — insert power amazement + ambassadors banquet
		insert_at = None
		for i, b in enumerate(en["blocks"]):
			if b.get("kind") == "p" and "Inmun stays in Chang" in b.get("html", ""):
				insert_at = i + 1
				break
		if insert_at is None:
			raise RuntimeError("Inmun stays anchor missing")
		power = [
			p(
				"Between audiences Chunchu watches the machinery. A clerk bows. An order moves. A province three months away changes its taxes because one man in yellow silk nodded. No Harmony Council. No uncle with a veto. No night of unanimity.",
				"알현과 알현 사이, 춘추는 기계를 본다. 서기가 절한다. 명이 움직인다. 석 달 길의 고을이 노란 비단 사내 하나의 끄덕임으로 세금을 바꾼다. 화백회의 없다. 거부권을 든 삼촌도 없다. 만장일치의 밤도 없다.",
			),
			dlg(
				"chunchu",
				[
					"Your Majesty… forgive a barbarian’s question.",
					"You mean… they all absolutely obey you, no matter what?",
				],
				[
					"폐하… 오랑캐의 질문을 용서하십시오.",
					"그러니까… 무슨 일이 있어도, 모두가 절대적으로 폐하께 복종한단 말씀입니까?",
				],
				"#D8258C",
			),
			dlg(
				"taizong",
				[
					"If they do not, they stop being useful.",
					"Useful men live longer. That is not cruelty. That is administration.",
				],
				[
					"안 하면, 쓸모가 끝나지.",
					"쓸모 있는 자가 더 오래 산다. 잔인이 아니라 행정이다.",
				],
				"#c97a2e",
			),
			dlg(
				"chunchu",
				[
					"In Samhan a single hand can hold a kingdom still all night.",
					"I have watched clever men die of committees.",
				],
				[
					"삼한에서는 손 하나가 나라를 밤새 붙잡아 둘 수 있습니다.",
					"영리한 자들이 회의 때문에 죽는 것을 보았습니다.",
				],
				"#D8258C",
			),
			dlg(
				"taizong",
				[
					"Then stop marrying your government to every uncle in the room.",
					"A throne is not a feast. It is a blade with a seat attached.",
					"(smiles, fond and superior)",
					"You are wasted on barbarian politeness, Spring-and-Autumn.",
				],
				[
					"그러면 조정을 방 안의 모든 삼촌과 혼인시키지 말게.",
					"왕좌는 잔치가 아니야. 자리가 달린 칼이지.",
					"(웃으며, 다정하고 우월하게)",
					"오랑캐의 공손함에 쓰기엔 아깝군, 춘추.",
				],
				"#c97a2e",
			),
			p(
				"Chunchu laughs because the insult is also a compliment, and because he has just seen the future of Samhan politics wearing an emperor’s face — chauvinist, competent, impossible to un-admire.",
				"춘추는 웃는다. 모욕이 곧 칭찬이기도 하고, 삼한 정치의 미래가 황제의 얼굴을 하고 있는 것을 방금 보았기 때문이다 — 남성 우월하고, 유능하고, 감탄을 거둘 수 없는.",
			),
		]
		en["blocks"][insert_at:insert_at] = power
		print("Taizong power / friendship beat inserted")

		# Banquet ambassadors + flirty Wu — before existing Wu "weeps well" or at banquet p
		banquet_at = None
		for i, b in enumerate(en["blocks"]):
			if b.get("kind") == "p" and "banquet meant to impress" in b.get("html", ""):
				banquet_at = i + 1
				break
		if banquet_at is not None:
			banq = [
				dlg(
					"west_ambassador",
					[
						"(Tang court, wine raised)",
						"To the Khan of Heaven — who makes even Samhan learn the proper direction to bow.",
					],
					[
						"(당 조정, 잔을 들며)",
						"천가한께 — 삼한조차 절할 방향을 배우게 하신 분께.",
					],
					"#b45309",
				),
				dlg(
					"east_ambassador",
					[
						"(Yamato envoy, smiling carefully)",
						"And to the guest who weeps beautifully enough to move an empire.",
						"We of the East know the value of a well-timed tear.",
					],
					[
						"(왜의 사신, 조심스레 웃으며)",
						"그리고 제국을 움직일 만큼 아름답게 우는 손님께.",
						"동쪽도 때를 아는 눈물의 값을 압니다.",
					],
					"#6b8cae",
				),
				dlg(
					"chunchu",
					[
						"Gentlemen. If tears were an army, Silla would have conquered you both already.",
						"(the room laughs; he has bought himself a second of safety)",
					],
					[
						"두 분. 눈물이 군대라면, 신라가 이미 두 분을 정복했을 겁니다.",
						"(방이 웃는다. 그는 안전의 한 순간을 샀다)",
					],
					"#D8258C",
				),
				dlg(
					"taizong",
					[
						"Listen to him. A barbarian who understands banquet combat.",
						"Zhi — keep this one. Men who can joke while kneeling are rarer than honest generals.",
					],
					[
						"저 말 듣게. 연회 전투를 아는 오랑캐야.",
						"治 — 이 자를 옆에 두게. 무릎 꿇고도 농담할 줄 아는 자는 정직한 장군보다 드무니까.",
					],
					"#c97a2e",
				),
				p(
					"Behind the screen <b>Wu</b> does not merely listen. She works the room without entering it — a glance that steadies a nervous maid, a smile that makes the Western Ambassador drink slower, a silence that pulls the Eastern envoy’s eyes toward the foreign prince. Flirtation, in her hands, is logistics.",
					"병풍 뒤의 <b>무</b>는 듣기만 하지 않는다. 방에 들어가지 않고 방을 움직인다 — 긴장한 시녀를 가라앉히는 눈빛, 서방 사신이 잔을 늦추게 하는 미소, 동방 사신의 눈을 외국 왕자에게로 끄는 침묵. 그녀의 손에서 유혹은 병참이다.",
				),
				dlg(
					"wuzetian",
					[
						"(soft, to Chunchu when the toast turns)",
						"So it is true. Your country seats a woman as king.",
						"How daring. How… instructive.",
					],
					[
						"(잔이 돌 때, 낮게, 춘추에게)",
						"정말이군요. 그대 나라는 여인을 임금으로 앉힌다.",
						"대담하네요. 얼마나… 교육적인지.",
					],
					"#9d7bd0",
				),
				dlg(
					"chunchu",
					[
						"Heaven chose her. We only stopped arguing long enough to notice.",
					],
					[
						"하늘이 고르셨습니다. 우리는 알아챌 만큼만 말다툼을 멈췄을 뿐입니다.",
					],
					"#D8258C",
				),
				dlg(
					"wuzetian",
					[
						"(laughs — warm, precise, a little too close)",
						"Heaven is so often credited after the clever have already moved the chairs.",
						"Tell me — when she speaks, do the uncles still pretend the voice is a man’s?",
					],
					[
						"(웃는다 — 따뜻하고, 정확하고, 조금 너무 가깝게)",
						"하늘은 영리한 자들이 의자를 옮긴 뒤에야 공을 받곤 하지요.",
						"말해 보세요 — 그녀가 말할 때, 삼촌들은 여전히 그 목소리를 사내의 것으로 꾸미나요?",
					],
					"#9d7bd0",
				),
				dlg(
					"west_ambassador",
					[
						"A woman king… picturesque. Like a story told to frighten boys.",
					],
					[
						"여왕이라… 그림 같군요. 사내아이들을 겁주려 하는 이야기처럼.",
					],
					"#b45309",
				),
				dlg(
					"east_ambassador",
					[
						"In our islands we have empresses. Power wears many sleeves.",
						"(glances at Wu, then away — too slow)",
					],
					[
						"우리 섬에도 여제가 있습니다. 권력은 소매가 많지요.",
						"(무를 보고, 너무 늦게 눈을 치운다)",
					],
					"#6b8cae",
				),
				dlg(
					"wuzetian",
					[
						"(to Chunchu alone, smiling as if they share a private theater)",
						"I like a man who brings dangerous news and still finds time to flirt with an empire.",
						"Stay for one more cup. Or must Silla’s tears dry on schedule?",
					],
					[
						"(춘추에게만, 둘만의 극장을 공유하듯 웃으며)",
						"위험한 소식을 들고도 제국과 농담할 틈을 찾는 사내가 좋아요.",
						"잔 하나만 더. 아니면 신라의 눈물은 일정대로 말라야 하나요?",
					],
					"#9d7bd0",
				),
			]
			en["blocks"][banquet_at:banquet_at] = banq
			print("Ambassador + flirty Wu banquet inserted")

	# 649 farewell — whisper + smile
	en649 = find_entry(chapters, "Death of the Emperor", "649")
	if already(en649["blocks"], "leans to his ear"):
		print("Wu whisper already present")
		return
	# Replace the blunt end of farewell with whisper beat
	# Find "You will try" wu line and enhance after it
	for i, b in enumerate(en649["blocks"]):
		if b.get("person") == "wuzetian" and any("You will try" in x for x in (b.get("en") or [])):
			# insert whisper before leave paragraph
			whisper = [
				p(
					"She steps in as if adjusting a sleeve. The corridor’s clerks learn, instantly, to study the floor tiles.",
					"소매를 고치듯 한 걸음 들어온다. 복도의 서리들은 즉시 바닥 벽돌을 연구하는 법을 배운다.",
				),
				dlg(
					"wuzetian",
					[
						"(leans to his ear — still smiling)",
						"…",
					],
					[
						"(귀에 기대며 — 여전히 웃으며)",
						"…",
					],
					"#9d7bd0",
				),
				p(
					"Whatever she says takes less than a breath. When she draws back she is still smiling — the social smile of a woman who could host a banquet or end a lineage with the same mouth. Chunchu’s face does not change in any way a painter could use. Inside, something that has survived Yeon and Euija and Bone Rank finally understands fear.",
					"그녀가 한 말은 숨 한 번보다 짧다. 몸을 뺄 때도 그녀는 여전히 웃는다 — 연회를 주관할 수도, 가문을 끝낼 수도 있는 입으로 짓는 사교의 미소. 춘추의 얼굴은 화가가 쓸 수 있는 어떤 방식으로도 변하지 않는다. 안에서, 연과 의자와 골품을 견딘 무언가가 드디어 공포를 이해한다.",
				),
			]
			en649["blocks"][i + 1 : i + 1] = whisper
			print("Wu whisper/smile beat inserted before departure")
			return
	print("WARN: Wu 'You will try' line not found for whisper insert")


def patch_people_ts() -> None:
	text = PEOPLE.read_text()
	# Rename gangnim block to kangrim
	if "id: 'kangrim'" in text and "id: 'gangnim'" not in text:
		print("people.ts already uses kangrim id")
	else:
		text = text.replace("id: 'gangnim'", "id: 'kangrim'")
		text = text.replace("name: 'Gangnim'", "name: 'Kangrim'")
		text = text.replace("gangnim: '#5f5f6b'", "kangrim: '#5f5f6b'")
		text = text.replace("Once Gangnim almost", "Once Kangrim almost")
		# aliases: prefer Kangrim
		text = text.replace(
			"aliases: ['Gangnim', 'Kangrim', '강림', 'the reaper']",
			"aliases: ['Kangrim', 'Gangnim', '강림', 'the reaper']",
		)
		print("Renamed gangnim → kangrim in people.ts")

	# Avatar + nature refresh for kangrim
	old_k = re.search(
		r"\{\s*id: 'kangrim',.*?aliases: \[.*?\]\s*\}",
		text,
		re.S,
	)
	if old_k and "avatar: '/people/kangrim.png'" not in old_k.group(0):
		replacement = """{
		id: 'kangrim',
		avatar: '/people/kangrim.png',
		name: 'Kangrim',
		korean: '강림',
		entity: 'concept',
		gender: 'm',
		kingdom: 'tamla',
		title: 'The messenger who comes for you',
		tagline: 'Korean grim reaper — one question at the threshold, then the walk.',
		quote: 'I do not punish. I collect.',
		nature: 'Dry, curious, never cruel. Appears at death with a single question about the choice that made the life. A crow scrambled his ledger, which is why hours are unclear. Impressed by dedication; surprised by honesty; tipped his hat once to a man rude enough to refuse him.',
		arc: 'Heaven sent him to arrest the King of the Dead; he stayed as escort. Across Samhan he collects queens, rebels, marshals, and a girl at Daeya who did not know his face. The island tells his full story last — after every kinder Tamla tale — because once you have heard it, every ending changes key.',
		events: [
			{ year: 642, label: 'Collects Gotaso at Daeya — she does not know him.' },
			{ year: 647, label: 'Two names in one night: Bidam and Sunduk.' },
			{ label: 'A crow scrambles his list — which is why nobody knows their hour.' },
			{ year: 660, label: 'At Hwangsan, five thousand wave up at him.' },
			{ year: 662, label: 'Yeon Gesomun looks at him and walks away.' }
		],
		aliases: ['Kangrim', 'Gangnim', '강림', 'the reaper']
	}"""
		text = text[: old_k.start()] + replacement + text[old_k.end() :]
		print("Kangrim people entry refreshed")

	# Gaozong avatar + arc
	if "id: 'gaozong'" in text and "avatar: '/people/gaozong.png'" not in text:
		text = text.replace(
			"id: 'gaozong',\n\t\tname: 'Li Zhi',",
			"id: 'gaozong',\n\t\tavatar: '/people/gaozong.png',\n\t\tname: 'Li Zhi',",
		)
	text = text.replace(
		"tagline: 'The younger brother Chunchu found in Chang’an — then the emperor who kept the promise.',\n\t\tquote: 'I inherited a war. I intend to finish it.',\n\t\tarc: 'As crown prince he rides and drinks with Kim Chunchu like a man who has finally been allowed a friend outside the palace wall. When his father dies he becomes Gaozong; when Chunchu takes the Silla throne they write as brothers who ended up wearing the same kind of loneliness. He finishes the war Taizong could not — and then discovers his sworn friend’s kingdom will not hand him the peninsula.',",
		"tagline: 'Decent, earnest — filling shoes that were never made in his size.',\n\t\tquote: 'I inherited a war. I intend to finish it.',\n\t\tnature: 'Less brilliant than his father, more willing to be loved. Sexually confident in the soft way of a man who has never had to take a room by force. Tries to rule as Taizong’s son and as Zhi the gyuku friend — and the gap between those two men is the weather Wu learns to inhabit.',\n\t\tarc: 'As crown prince he rides and drinks with Kim Chunchu like a man who has finally been allowed a friend outside the palace wall. He becomes Gaozong without his father’s genius and with his father’s wars still open. He keeps promises, finishes what Taizong could not, and slowly discovers that living up to a legend is a different skill from becoming one — and that the woman who finishes his sentences may be the better emperor.',",
	)

	# Taizong chauvinist competent
	text = text.replace(
		"tagline: 'Khan of Heaven. Beat everyone except a fortress in Liaodong.',\n\t\tquote: 'I am less happy about gaining Liaodong than about gaining you.',\n\t\tarc: 'Murdered his brothers for the throne and then justified it by conquering the known world. Goguryeo is the one page he cannot write: he goes himself, is stopped at Ansi, and dies asking Chunchu to finish it for him.',",
		"tagline: 'Khan of Heaven — chauvinist, magnetic, terrifyingly good at his job.',\n\t\tquote: 'A throne is not a feast. It is a blade with a seat attached.',\n\t\tnature: 'Openly prefers a world run by decisive men; still the most competent person in any room he enters. Respected even by those he calls barbarian. Builds real friendship with Chunchu without ever forgetting who holds the silk. Sexually assured the way conquerors are — present, not crude.',\n\t\tarc: 'Murdered his brothers for the throne and then justified it by conquering the known world. Shows Chunchu what absolute obedience looks like and accidentally teaches Silla the grammar of Chinese absolutism. Goguryeo is the one page he cannot write: stopped at Ansi, he dies asking a friend to finish it.',",
	)

	# Wu flirty social master
	text = text.replace(
		"nature: 'First a young concubine in rooms that still smell of Taizong; then the growing weather around Gaozong. Influence accumulates the way ink accumulates — day by day, until the page is hers. Liberal with cruelty, precise with legitimacy. One of the few Tang figures the chronicle allows a personal name.',\n\t\tarc: 'Seen beside both emperors: demure where Taizong’s court can hear, decisive where Gaozong’s body falters. The wars that finish Goryeo and sour the Silla alliance happen in a court she increasingly runs. After his death she founds her own Zhou — the only woman to take the imperial title in her own right.',",
		"nature: 'Flirtation as logistics. Master of the glance, the aside, the smile that rearranges a banquet. Intensely interested in Silla’s woman king — not as gossip, as precedent. Liberal with cruelty, precise with legitimacy; can terrify a diplomat without raising her voice.',\n\t\tarc: 'Works Taizong’s court from behind a screen, then Gaozong’s from beside the seal. Whispers one sentence into Chunchu’s ear before he leaves Chang’an and smiles; he never again meets anyone who frightens him the same way. The wars that finish Goryeo happen in weather she increasingly owns. After Gaozong’s death she founds her own Zhou.',",
	)

	# Ambassadors — insert before Gaya section if missing
	if "id: 'west_ambassador'" not in text:
		amb = """
	{
		id: 'west_ambassador',
		avatar: '/people/west_ambassador.png',
		name: 'Western Ambassador',
		korean: '서방 사신',
		title: 'Tang court voice',
		kingdom: 'tang',
		gender: 'm',
		tagline: 'China’s smile at the banquet — fond of hierarchy, fond of wine.',
		quote: 'Even Samhan can learn the proper direction to bow.',
		nature: 'Socially confident, a little smug, sexually self-assured without needing to prove it. Treats foreign tears as entertainment until they move policy.',
		arc: 'Toasts Taizong, needles Chunchu, and underestimates the woman behind the screen.',
		aliases: ['Western Ambassador', 'the Western Ambassador', '서방 사신']
	},
	{
		id: 'east_ambassador',
		avatar: '/people/east_ambassador.png',
		name: 'Eastern Ambassador',
		korean: '동방 사신',
		title: 'Yamato envoy at Chang’an',
		kingdom: 'yamato',
		gender: 'm',
		tagline: 'Japan’s careful smile — knows empresses exist, and watches Wu too long.',
		quote: 'Power wears many sleeves.',
		nature: 'Refined, flirtatious in the soft register, politically cautious. More at ease with women on thrones than the Western table is — which does not make him safer.',
		arc: 'Shares the Tang banquet with Silla’s weeping prince and leaves having learned who in the room was actually dangerous.',
		aliases: ['Eastern Ambassador', 'the Eastern Ambassador', '동방 사신', 'Yamato envoy']
	},

"""
		text = text.replace(
			"\n\n\t// ————————————————————————— Gaya —————————————————————————",
			amb + "\n\t// ————————————————————————— Gaya —————————————————————————",
		)
		# colors
		text = text.replace(
			"\twuzetian: '#e879a6',",
			"\twuzetian: '#e879a6',\n\twest_ambassador: '#b45309',\n\teast_ambassador: '#6b8cae',",
		)
		print("Ambassador people added")

	PEOPLE.write_text(text)


def patch_absolutism_echo(chapters) -> None:
	"""Light thematic echo at Secretariat founding."""
	try:
		en = find_entry(chapters, "The Royal Secretariat", "651")
	except KeyError:
		return
	if already(en["blocks"], "Chinese-style"):
		print("Absolutism echo already present")
		return
	for i, b in enumerate(en["blocks"]):
		if b.get("kind") == "p" and "side hall" in b.get("html", ""):
			en["blocks"].insert(
				i + 1,
				p(
					"He is not copying a banquet toast. He is importing a grammar: one seal, one speed, fewer uncles. The fall of native council politics does not arrive as a proclamation. It arrives as a table that has never held a feast.",
					"연회의 건배를 베끼는 것이 아니다. 문법을 수입하는 것이다: 어보 하나, 속도 하나, 삼촌은 더 적게. 토착 합의 정치의 몰락은 조서로 오지 않는다. 잔치를 올려 본 적 없는 상으로 온다.",
				),
			)
			print("Absolutism echo at Secretariat")
			return


def main():
	chapters = load()
	rename_kangrim(chapters)
	patch_white_river_meet(chapters)
	patch_gotaso_kangrim(chapters)
	patch_pumsuk_kangrim(chapters)
	patch_existing_kangrim_questions(chapters)
	patch_jinduk_kangrim(chapters)
	patch_euija_kangrim(chapters)
	patch_chunchu_kangrim(chapters)
	patch_gesomun_death_kangrim(chapters)
	patch_yushin_kangrim(chapters)
	patch_nine_plagues_euija(chapters)
	patch_kangrim_origin_finale(chapters)
	patch_chang_an(chapters)
	patch_absolutism_echo(chapters)
	save(chapters)
	patch_people_ts()
	print("Done.")


if __name__ == "__main__":
	main()
