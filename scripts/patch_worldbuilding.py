#!/usr/bin/env python3
"""One-shot story worldbuilding patch — Bidam kite/lake, Balhae, naming."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORY = ROOT / "src/lib/data/story.json"


def dlg(person: str, en: list[str], lines: list[str], chip: str | None = None) -> dict:
	d: dict = {"kind": "dialogue", "person": person, "en": en, "lines": lines}
	if chip:
		d["chip"] = chip
	return d


def p(html: str, ko: str) -> dict:
	return {"kind": "p", "html": html, "ko": ko}


def patch_bidam(entry: dict) -> None:
	blocks = entry["blocks"]
	# Expand lake flashback with ancestor spirits after goddess counsel.
	for b in blocks:
		if b.get("kind") == "flashback" and b.get("title") == "the lake, again":
			extra = [
				p(
					"Steam thins. The three step back without being asked — as if the water had called a different audience. Two shapes wait where the rock shelves into black: an older man with a Gaya pommel still unread under Silla polish, and a younger one who looks like Yushin will look when the wars are done.",
					"김이 옅어진다. 셋은 시키지도 않았는데 물러선다 — 물이 다른 청중을 부른 것처럼. 바위가 검은 물로 지는 곳에 두 형상이 기다린다. 가야 자루가 신라 광택 아래 아직 읽히는 노인, 그리고 전쟁이 끝나면 유신이 닮을 젊은이.",
				),
				dlg(
					"muryuk",
					[
						"They called me foreigner too.",
						"I gave them a kingdom so you could keep a sword.",
						"Do not let a boy with an old hall tell you what soil you stand on.",
					],
					[
						"나도 외인이라 불렸다.",
						"너희가 칼을 쥐게 하려고 나라를 내줬다.",
						"오래된 집 가진 아이가 네 땅을 정하게 두지 마라.",
					],
					"#9b6fd8",
				),
				dlg(
					"seohyeon",
					[
						"A man’s loyalty is the only soil that counts.",
						"Love the country that let you keep your name — and the woman who keeps you honest.",
						"We were Gaya. We died Silla. That is not a stain. That is a choice kept every morning.",
					],
					[
						"사내의 충성이 유일한 흙이다.",
						"이름을 지키게 해 준 나라를 사랑해라 — 그리고 너를 바르게 붙드는 여자를.",
						"우리는 가야였다. 신라로 죽었다. 그건 오점이 아니다. 매일 아침 지켜 낸 선택이다.",
					],
					"#7a8fc4",
				),
				dlg(
					"yushin",
					[
						"Father…",
						"Grandfather…",
						"She is dying. And he is still my score — one hundred and eight.",
					],
					[
						"아버지…",
						"할아버지…",
						"그분은 죽어 가십니다. 그리고 그는 여전히 제 점수입니다 — 백팔.",
					],
					"#4a8fe0",
				),
				dlg(
					"muryuk",
					[
						"Then finish the count as a Hwarang finishes it — clean form, no apology for the blood that trained you.",
						"Dragon on your pommel. Crow in your memory. Horse on his. None of that is the country.",
						"The country is who you refuse to abandon.",
					],
					[
						"그럼 화랑이 끝내듯 끝내라 — 깨끗한 형, 너를 길러 준 피에 사과하지 말고.",
						"네 자루엔 용. 기억엔 삼족오. 그자 자루엔 천마. 그게 나라는 아니다.",
						"나라는 — 네가 버리지 않는 사람이다.",
					],
					"#9b6fd8",
				),
				p(
					"When Yushin opens his eyes the goddesses are only steam again. Narim’s hand has been on his shoulder the whole time. He does not ask which of them lent the voices. He puts the dragon sword back through his sash and climbs toward Radiance.",
					"눈을 뜨면 여신들은 다시 김뿐이다. 나림의 손이 줄곧 어깨에 있었다. 누가 목소리를 빌려 줬는지 묻지 않는다. 용검을 띠에 꽂고 명활성을 향해 오른다.",
				),
			]
			# Insert before the final wash-face paragraph
			inner = b["blocks"]
			if inner and inner[-1].get("kind") == "p" and "washes his face" in inner[-1].get("html", ""):
				b["blocks"] = inner[:-1] + extra + [inner[-1]]
			else:
				b["blocks"] = inner + extra
			break

	# Find index of "Gaya wretch" block to insert kite + fight after the foreigner arc.
	insert_at = None
	for i, b in enumerate(blocks):
		if b.get("kind") == "dialogue" and b.get("person") == "bidam":
			en = " ".join(b.get("en") or [])
			if "Gaya wretch" in en:
				insert_at = i
				break
	if insert_at is None:
		raise SystemExit("could not find Gaya wretch block")

	# After Yushin's "Where did that man go" exchange (block ~19), before Sunduk dies.
	# Insert kite scene + final Hwarang duel after block 21 (yushin: raised a banner).
	# Find the p about Sunduk dies
	die_at = None
	for i, b in enumerate(blocks):
		if b.get("kind") == "p" and "dies, comforted by Yushin" in b.get("html", ""):
			die_at = i
			break
	if die_at is None:
		raise SystemExit("could not find Sunduk death block")

	kite_and_fight = [
		p(
			"Before the last charge Bidam does what the histories will not quite believe: he flies a kite over the Fortress of Radiance with a burning coal at its belly, so the night sky carries a second star. The nobles read omen. The Hwarang alumni in both camps read theatre — and still feel their throats tighten, because Bidam always knew how to make heaven look like it had taken his side.",
			"마지막 돌격 전, 비담은 사가가 반쯤만 믿을 일을 한다. 명활성 위로 연을 띄우고 배에 숯불을 달아, 밤하늘에 두 번째 별이 가게 한다. 귀족들은 징조로 읽는다. 양쪽 진영의 화랑 출신들은 연극으로 읽는다 — 그래도 목이 조여 온다. 비담은 언제나 하늘이 자기 편인 것처럼 보이게 만들 줄 알았으니까.",
		),
		dlg(
			"bidam",
			[
				"Heaven votes with the sacred country.",
				"Look up, Gaya steel — even the sky refuses you.",
			],
			[
				"하늘이 신성한 나라의 편에 표를 던졌다.",
				"올려 봐라, 가야 쇠 — 하늘조차 너를 거절한다.",
			],
			"#7b5cd6",
		),
		dlg(
			"yushin",
			[
				"Heaven does not vote, Lord Bidam.",
				"Hwarang do. And we learned the same forms.",
			],
			[
				"하늘은 투표하지 않습니다, 비담 공.",
				"화랑이 하지요. 그리고 우리는 같은 형을 배웠습니다.",
			],
			"#4a8fe0",
		),
		p(
			"They meet again between the camps — not as councillor and marshal, but as the yard’s two best. Dragon pommel against heavenly horse. The first eight exchanges are a language only alumni speak: the rising cut named for Jinheung’s spring, the paired retreat that never counts as retreat, the 108th return that both of them have landed on each other’s shoulders a hundred times. This time Bidam’s horse-sword opens a line at Yushin’s ribs. This time Yushin’s dragon closes it at Bidam’s throat.",
			"그들은 다시 진영 사이에서 만난다 — 재상과 원수가 아니라, 연병장의 두 최고로. 용 자루 대 천마 자루. 처음 여덟 합은 동문만 아는 말이다. 진흥의 봄에서 이름 딴 올려치기, 후퇴가 후퇴로 세어지지 않는 쌍의 물러섬, 서로의 어깨에 백 번도 더 닿았던 백여덟 번째 되돌림. 이번엔 비담의 천마검이 유신의 갈비에 길을 연다. 이번엔 유신의 용이 비담의 목에서 그 길을 닫는다.",
		),
		dlg(
			"bidam",
			[
				"…One hundred and nine.",
				"Finally.",
			],
			[
				"…백아홉.",
				"드디어.",
			],
			"#7b5cd6",
		),
		dlg(
			"yushin",
			[
				"It was never the score.",
				"It was always the country.",
			],
			[
				"점수가 아니었습니다.",
				"언제나 나라였습니다.",
			],
			"#4a8fe0",
		),
		p(
			"Bidam falls the way a Hwarang falls — eyes open, form unbroken. The kite burns out over the wall. Somewhere behind Yushin the queen is already ending.",
			"비담은 화랑이 쓰러지듯 쓰러진다 — 눈 뜨고, 형 깨지지 않은 채. 연은 성벽 위에서 타 버린다. 유신 뒤에서 여왕은 이미 끝나고 있다.",
		),
	]

	# Avoid double-insert on re-run
	if any(
		b.get("kind") == "p" and "flies a kite" in b.get("html", "")
		for b in blocks
	):
		print("Bidam kite already present — skip insert")
	else:
		entry["blocks"] = blocks[:die_at] + kite_and_fight + blocks[die_at:]
		print("Bidam kite + duel inserted; lake ancestors expanded")


def patch_balhae(entry: dict) -> None:
	if entry.get("blocks"):
		print("Balhae already has blocks — skip")
		return
	entry["blocks"] = [
		p(
			"Thirty years after Pyongyang, the fields of Manchuria are taller than a boy’s shoulder. <b>Gulgul</b> walks them with a cloth bundle hard against his ribs — not grain. A shard of the Goryeo crown, broken when the city fell, still warm with the authority nobody else would carry north.",
			"평양 이후 삼십 년, 만주의 밭은 아이 어깨보다 높다. <b>걸걸</b>이 갈비에 단단한 보따리를 안고 걷는다 — 곡식이 아니다. 성이 무너질 때 깨진 고려 왕관의 조각. 북쪽으로 가져가려 한 사람이 없어서, 아직도 권위의 온기가 남아 있다.",
		),
		p(
			"His son runs ahead, then back, then ahead again — too young for the weight, too old for not knowing what the cloth means. Behind them the smoke of someone else’s victory. Ahead, only millet and the cold that Yeon once pulled a Mohe boy out of.",
			"아들은 앞서 달리다가, 되돌아오다가, 다시 앞선다 — 무게엔 너무 어리고, 천의 뜻을 모를 나이는 아니다. 뒤에는 남의 승리의 연기. 앞에는 조와, 연이 한때 말갈 아이를 끌어낸 추위뿐.",
		),
		dlg(
			"gulgul",
			[
				"Keep it under the coat.",
				"If they see gold, they will remember we were a country.",
			],
			[
				"웃옷 안에 넣어라.",
				"금을 보면, 우리가 나라였다는 걸 기억할 테니까.",
			],
			"#8b3a3a",
		),
		dlg(
			"daejoyoung",
			[
				"Father —",
				"When we stop… what do we call it?",
			],
			[
				"아버지 —",
				"멈추면… 뭐라고 불러요?",
			],
			"#c45a4a",
		),
		dlg(
			"gulgul",
			[
				"He called it Goguryeo.",
				"Everyone else got tired and said Goryeo.",
				"You — you say it the way he would have wanted.",
			],
			[
				"그는 고구려라 불렀다.",
				"나머지는 지쳐서 고려라 했다.",
				"너는 — 그가 원했을 방식으로 말해라.",
			],
			"#8b3a3a",
		),
		p(
			"The boy stops in the millet. Wind moves the crowns of the grain the way banners used to move. He presses the cloth once, as if the three-legged crow could still hear through gold, and answers the empty north the only way the chronicle will keep.",
			"아이는 조밭 한가운데 선다. 바람이 곡식 이삭을 예전 깃발처럼 움직인다. 천을 한 번 누르며 — 삼족오가 금 너머로도 들을 수 있다는 듯 — 빈 북쪽을 사가가 기억할 유일한 방식으로 대답한다.",
		),
		dlg(
			"daejoyoung",
			[
				"Goguryeo never dies…!",
			],
			[
				"고구려는… 죽지 않는다…!",
			],
			"#c45a4a",
		),
		p(
			"They walk on. Years later the boy will raise a kingdom called Balhae on that sentence — and the shard will still be warm.",
			"그들은 계속 걷는다. 세월이 지나 아이는 그 문장 위에 발해라는 나라를 세울 것이다 — 그리고 조각은 여전히 따뜻할 것이다.",
		),
	]
	print("Balhae blocks written")


def patch_unified_silla(entry: dict) -> None:
	"""Tie the broken crown piece to the Balhae escape."""
	for b in entry["blocks"]:
		if b.get("kind") == "dialogue":
			en = b.get("en") or []
			joined = " ".join(en)
			if "piece broke" in joined and "no harm" in joined:
				b["en"] = [
					"Ah… it seems a piece broke when it was carried from Pyongyang.",
					"It does no harm to Your Majesty’s sovereignty — wear it as it is.",
					"Whoever carries a crown is understood to speak for the beasts of that nation.",
					"A missing shard is… a beast that walked north. Live ten thousand years anyway.",
				]
				b["lines"] = [
					"아… 평양에서 옮기다 조각이 깨진 듯합니다.",
					"폐하의 권위엔 해가 되지 않습니다 — 있는 그대로 쓰십시오.",
					"왕관을 짊어진 자는 그 나라의 신수를 부린다고들 하지요.",
					"빠진 조각은… 북으로 걸어간 짐승입니다. 그래도 만수무강하소서.",
				]
				print("Unified Silla crown dialogue deepened")
				return
	print("Unified Silla crown line not found")


def patch_jumong_tabal(entry: dict) -> None:
	"""Make Tabal’s register echo later Yeon; hint Yeon vs Go."""
	for b in entry["blocks"]:
		if b.get("kind") == "dialogue" and b.get("person") == "yeontabal":
			en = b.get("en") or []
			if en and "I have heard the name" in en[0]:
				b["en"] = [
					"I have heard the name. Jumong.",
					"Go blood with nothing but a bow.",
					"I do not want ash tracked into my hall.",
				]
				b["lines"] = [
					"이름은 들었다. 주몽.",
					"활 하나 든 고씨 피.",
					"내 마루에 재 끌어들이고 싶지 않다.",
				]
				print("Tabal opening line sharpened")
				break
	# Add a closing implication line if not present
	htmls = [
		b.get("html", "")
		for b in entry["blocks"]
		if b.get("kind") == "p"
	]
	if not any("Yeon hall" in h or "연 집안" in h for h in htmls):
		entry["blocks"].append(
			p(
				"The chronicles will not write that the Yeon hall never forgot weighing a Go exile. Centuries later another Yeon will speak in the same short heat — and call the country by its longest name, as if shortening it were already kneeling to a softer king.",
				"사가는 연 집안이 고씨 망명을 저울질한 일을 잊지 않았다고 쓰지 않을 것이다. 수백 년 뒤 또 다른 연이 같은 짧은 열기로 말할 것이고 — 나라를 가장 긴 이름으로 부를 것이다. 줄이는 일이 이미 부드러운 임금에게 무릎 꿇는 일이라도 되는 양.",
			)
		)
		print("Jumong Yeon/Go coda added")


def naming_pass(chapters: list) -> None:
	"""Soft naming: in non-Yeon dialogue, prefer Goryeo; ensure Yeon keeps Goguryeo."""
	changed = 0
	for ch in chapters:
		for e in ch["entries"]:
			for b in e.get("blocks", []):
				stack = [b]
				while stack:
					cur = stack.pop()
					if cur.get("kind") == "flashback":
						stack.extend(cur.get("blocks") or [])
						continue
					if cur.get("kind") != "dialogue":
						continue
					person = cur.get("person")
					ens = cur.get("en") or []
					lines = cur.get("lines") or []
					new_en = []
					new_ko = []
					local = False
					for en, ko in zip(ens, lines + [""] * (len(ens) - len(lines))):
						e2, k2 = en, ko
						if person == "gesomun":
							# Traditionalist: expand bare Goryeo -> Goguryeo, but keep
							# contrast lines like "Not Goryeo" / "고려가 아니라".
							if "Not Goryeo" in e2 or "고려가 아니라" in k2:
								pass
							else:
								if "Goryeo" in e2 and "Goguryeo" not in e2:
									e2 = e2.replace("Goryeo", "Goguryeo")
									local = True
								if "고려" in k2 and "고구려" not in k2:
									k2 = k2.replace("고려", "고구려")
									local = True
						elif person == "chunchu":
							# Leave mixed; occasionally prefer Goguryeo already in text
							pass
						elif person not in ("daejoyoung", "namgun", "gulgul"):
							# Common speech: Goguryeo -> Goryeo (except catchphrase holders)
							if "Goguryeo" in e2 and "never dies" not in e2.lower():
								e2 = e2.replace("Goguryeo", "Goryeo")
								local = True
							if "고구려" in k2 and "죽지" not in k2:
								k2 = k2.replace("고구려", "고려")
								local = True
						new_en.append(e2)
						new_ko.append(k2)
					if local:
						cur["en"] = new_en
						cur["lines"] = new_ko
						changed += 1
	print(f"Naming pass touched {changed} dialogue blocks")


def patch_gesomun_insist(chapters: list) -> None:
	"""Add one explicit traditionalist correction if missing."""
	for ch in chapters:
		for e in ch["entries"]:
			if e["title"] != "Chunchu & Gesomun":
				continue
			for b in e.get("blocks", []):
				if b.get("kind") == "dialogue" and b.get("person") == "gesomun":
					en = " ".join(b.get("en") or [])
					if "Call it Goguryeo" in en or "Goguryeo — not Goryeo" in en:
						print("Gesomun naming beat already present")
						return
			# Insert after first gesomun dialogue
			blocks = e["blocks"]
			for i, b in enumerate(blocks):
				if b.get("kind") == "dialogue" and b.get("person") == "gesomun":
					ins = dlg(
						"gesomun",
						[
							"And call it Goguryeo.",
							"Not Goryeo. I am not tired enough to shorten my own country.",
						],
						[
							"그리고 고구려라 불러.",
							"고려가 아니라. 내 나라를 줄일 만큼 지치지 않았다.",
						],
						"#d0362f",
					)
					# Avoid dup
					if any(
						x.get("kind") == "dialogue"
						and x.get("person") == "gesomun"
						and any("Not Goryeo" in s for s in (x.get("en") or []))
						for x in blocks
					):
						return
					e["blocks"] = blocks[: i + 1] + [ins] + blocks[i + 1 :]
					print("Gesomun Goguryeo insistence added")
					return


def main() -> None:
	chapters = json.loads(STORY.read_text())
	for ch in chapters:
		for e in ch["entries"]:
			if e["title"] == "Bidam’s Rebellion":
				patch_bidam(e)
			elif e["title"] == "Balhae":
				patch_balhae(e)
			elif e["title"] == "Unified Silla":
				patch_unified_silla(e)
			elif e["title"] == "Jumong":
				patch_jumong_tabal(e)
	patch_gesomun_insist(chapters)
	naming_pass(chapters)
	STORY.write_text(json.dumps(chapters, ensure_ascii=False, indent="\t") + "\n")
	print("Wrote", STORY)


if __name__ == "__main__":
	main()
