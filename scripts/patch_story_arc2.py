#!/usr/bin/env python3
"""Story arc 2: Secretariat/Jukji, Wu, Munhee/Bupmin, merchant, Kangrim, kite fix, etc."""

from __future__ import annotations

import json
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


def quote(
	html: str,
	ko: str | None = None,
	source: str | None = None,
	hanja: str | None = None,
) -> dict:
	d: dict = {"kind": "quote", "html": html, "source": source or ""}
	if ko:
		d["ko"] = ko
	if hanja:
		d["hanja"] = hanja
	return d


def find_entry(chapters, title: str):
	for ch in chapters:
		for e in ch["entries"]:
			if e["title"] == title:
				return ch, e
	raise KeyError(title)


def already(blocks, needle: str) -> bool:
	return any(needle in json.dumps(b, ensure_ascii=False) for b in blocks)


def patch_kite(entry: dict) -> None:
	"""Historical polarity: falling star + Bidam quote; Yushin reverses with burning kite."""
	blocks = entry["blocks"]
	start = None
	end = None
	for i, b in enumerate(blocks):
		html = b.get("html") or ""
		if "flies a kite over the Fortress" in html or "flies a kite" in html and "Radiance" in html:
			start = i
		if start is not None and "Bidam falls the way a Hwarang falls" in html:
			end = i
			break
	if start is None:
		print("kite block not found")
		return
	if end is None:
		end = start + 6

	# Keep duel middle if present between kite and fall — rebuild historically
	replacement = [
		p(
			"On the tenth night a star falls toward <b>Wolseong</b> — bright enough that both camps look up. Bidam does not invent the omen. He only names it, the way a good speaker names what the room already fears.",
			"열흘째 밤, 별이 월성을 향해 떨어진다 — 양쪽 진영이 다 올려다볼 만큼 밝다. 비담은 징조를 지어내지 않는다. 방이 이미 두려워하는 것을 이름 붙일 뿐이다.",
		),
		quote(
			"Where a star falls, blood will surely be shed. This is an omen that the queen will be defeated.",
			ko="별이 떨어진 곳에는 반드시 피 흘릴 일이 있다 하니, 이는 여주가 패할 징조다.",
			hanja="星隕之處 必有血戰 此女主敗亡之兆也",
			source="Samguk Sagi (三國史記) bk. 41, Biography of Kim Yushin — Bidam’s rebellion omen (tradition)",
		),
		dlg(
			"bidam",
			[
				"You heard it.",
				"Heaven has already voted against a woman on the throne.",
				"女主不能善理 — and now the sky writes it in fire.",
			],
			[
				"들었지.",
				"하늘이 이미 여주에게 반대표를 던졌다.",
				"女主不能善理 — 이제 하늘이 불로 쓴다.",
			],
			"#7b5cd6",
		),
		p(
			"The rebel shout shakes the ground. Inside Wolseong <b>Queen Sunduk</b> goes pale. <b>Yushin</b> asks for leave to speak — and for a kite, a scarecrow, and a coal that will not go out.",
			"반란군의 함성이 땅을 흔든다. 월성 안에서 <b>선덕여왕</b>의 얼굴이 하얘진다. <b>유신</b>은 아뢸 틈을 청한다 — 그리고 연과 허수아비와, 꺼지지 않을 숯을.",
		),
		dlg(
			"yushin",
			[
				"Your Majesty — do not fear a falling light.",
				"If they can read a star, they can also unread one.",
			],
			[
				"폐하 — 떨어지는 빛을 두려워 마십시오.",
				"별을 읽을 수 있다면, 읽지 못하게 할 수도 있습니다.",
			],
			"#4a8fe0",
		),
		p(
			"He flies the kite from the palace dark: a burning scarecrow rising where the star had fallen, so the night sky seems to take its light back. Bidam’s followers watch their omen climb home — and the shout that had been certainty becomes a cough.",
			"궁궐의 어둠에서 연을 띄운다. 별이 떨어졌던 자리로 불타는 허수아비가 올라가, 밤하늘이 제 빛을 되찾는 것처럼 보이게. 비담의 무리는 자기네 징조가 집으로 돌아가는 것을 본다 — 확신이던 함성이 기침이 된다.",
		),
		dlg(
			"yushin",
			[
				"Look up.",
				"Heaven changed its mind — or we changed heaven’s handwriting.",
				"Hwarang, with me.",
			],
			[
				"올려 봐라.",
				"하늘이 마음을 바꿨거나 — 우리가 하늘의 글씨를 고쳤거나.",
				"화랑, 나를 따르라.",
			],
			"#4a8fe0",
		),
		p(
			"They meet again between the camps — not as councillor and marshal, but as the yard’s two best. Dragon pommel against heavenly horse. The first eight exchanges are a language only alumni speak: the rising cut named for Jinheung’s spring, the paired retreat that never counts as retreat, the 108th return that both of them have landed on each other’s shoulders a hundred times. This time Bidam’s horse-sword opens a line at Yushin’s ribs. This time Yushin’s dragon closes it at Bidam’s throat.",
			"그들은 다시 진영 사이에서 만난다 — 재상과 원수가 아니라, 연병장의 두 최고로. 용 자루 대 천마 자루. 처음 여덟 합은 동문만 아는 말이다. 진흥의 봄에서 이름 딴 올려치기, 후퇴가 후퇴로 세어지지 않는 쌍의 물러섬, 서로의 어깨에 백 번도 더 닿았던 백여덟 번째 되돌림. 이번엔 비담의 천마검이 유신의 갈비에 길을 연다. 이번엔 유신의 용이 비담의 목에서 그 길을 닫는다.",
		),
		dlg(
			"bidam",
			["…One hundred and nine.", "Finally."],
			["…백아홉.", "드디어."],
			"#7b5cd6",
		),
		dlg(
			"gangnim",
			[
				"Councillor.",
				"Your list ends here. Walk with me — the underworld keeps better minutes than Surabol.",
			],
			[
				"재상.",
				"명부가 여기서 끝난다. 같이 걷자 — 저승이 서라벌보다 회의록을 잘 남긴다.",
			],
			"#5f5f6b",
		),
		dlg(
			"bidam",
			[
				"Tell the sacred country I loved it badly.",
				"That is still love.",
			],
			[
				"신성한 나라에 전해라. 잘못 사랑했다고.",
				"그래도 사랑이다.",
			],
			"#7b5cd6",
		),
		p(
			"Bidam falls the way a Hwarang falls — eyes open, form unbroken. The kite burns out over the wall. Somewhere behind Yushin the queen is already ending.",
			"비담은 화랑이 쓰러지듯 쓰러진다 — 눈 뜨고, 형 깨지지 않은 채. 연은 성벽 위에서 타 버린다. 유신 뒤에서 여왕은 이미 끝나고 있다.",
		),
		dlg(
			"gangnim",
			[
				"And you, Majesty —",
				"Two names on one night. Crowded schedule.",
			],
			[
				"그리고 폐하 —",
				"하루에 이름 둘. 일정 빡빡하군.",
			],
			"#5f5f6b",
		),
	]
	entry["blocks"] = blocks[:start] + replacement + blocks[end + 1 :]
	print("Bidam kite rewritten to historical polarity + Kangrim")


def patch_secretariat(entry: dict) -> None:
	if already(entry["blocks"], "first Chancellor"):
		print("Secretariat already expanded")
		return
	extra = [
		dlg(
			"jukji",
			[
				"Petition. Seal. Courier.",
				"I can do that before the Council finishes clearing its throat.",
			],
			[
				"상소. 인장. 파발.",
				"화백이 목청 가다듬기 전에 끝낼 수 있습니다.",
			],
			"#6a9e7a",
		),
		dlg(
			"chunchu",
			[
				"Then you are 시중 — Chancellor of the Royal Secretariat.",
				"True Bone. Young Hwarang. My confidante.",
				"In Chang’an the emperor does not wait for every uncle to agree. I watched that power and wanted it for this country — not for my vanity. For speed.",
			],
			[
				"그럼 네가 시중이다 — 집사부의 장.",
				"진골. 젊은 화랑. 내 심복.",
				"장안에서 황제는 모든 삼촌의 동의를 기다리지 않더라. 그 힘을 보고 이 나라에 갖고 싶었다 — 허영이 아니라. 속도를 위해.",
			],
			"#D8258C",
		),
		p(
			"The <b>Harmony Council</b> still meets on the appointed days. The chairs are still polished. The unanimity rule is still recited. Nothing of consequence waits for it anymore. They have been made lame ducks without the dignity of abolition — and they know it by the third week, when a border petition returns sealed before their debate has chosen a speaker.",
			"<b>화백회의</b>는 여전히 정한 날에 모인다. 자리는 닦여 있고, 만장일치 규정도 외워진다. 중요한 일은 더 이상 기다리지 않는다. 폐지라는 존엄도 없이 식물 의회가 된 셈이다 — 사흘도 안 돼 안다. 변방 상소가 토론의 발언자를 정하기도 전에 인장 찍혀 돌아올 때.",
		),
		p(
			"In the market a storyteller invents a joke that sticks: <i>Our prince is in love with the emperor.</i> Another version: <i>enamored with China.</i> Chunchu hears both and does not correct them. Munhee, packing a different set of bags, corrects them for him.",
			"저자거리에서 이야기꾼이 들러붙는 농담을 만든다. <i>우리 왕자는 황제와 연애 중이라네.</i> 다른 판: <i>중국에 반했대.</i> 춘추는 둘 다 듣고 고치지 않는다. 문희가 — 다른 짐을 싸며 — 대신 고친다.",
		),
		dlg(
			"munhee",
			[
				"He is in love with a door that opens when he knocks.",
				"Call that China if you like. I call it not waiting for twelve men to finish a sentence.",
			],
			[
				"그는 두드리면 열리는 문을 좋아해요.",
				"그걸 중국이라 불러도 돼요. 나는 열두 사람이 문장 끝낼 때까지 안 기다리는 거라 불러요.",
			],
			"#e07fa8",
		),
		dlg(
			"jukji",
			[
				"The Council asked what my title means.",
				"I told them: 侍中 — I stand beside the work.",
				"They did not laugh. That was how I knew it had worked.",
			],
			[
				"화백이 제 직함이 뭐냐고 물었습니다.",
				"侍中이라고 했습니다 — 일 옆에 선다고.",
				"안 웃더군요. 그래서 된 줄 알았습니다.",
			],
			"#6a9e7a",
		),
	]
	entry["blocks"].extend(extra)
	print("Secretariat expanded with Jukji / lame ducks / China dig")


def patch_wu(chapters) -> None:
	_, doe = find_entry(chapters, "Death of the Emperor")
	if already(doe["blocks"], "wuzetian"):
		print("Wu scenes already in Death of Emperor")
	else:
		doe["blocks"].extend(
			[
				p(
					"In an anteroom a young concubine waits with the other women who must not be seen grieving too loudly. Her name is not yet heavy. Her attention already is. She watches how a seal moves from a dead hand to a living one — and files the lesson where ambition keeps its dry goods.",
					"곁방에서 젊은 후궁이, 너무 크게 울면 안 되는 여인들과 함께 기다린다. 이름은 아직 무겁지 않다. 시선은 이미 그렇다. 죽은 손에서 산 손으로 인장이 옮아가는 법을 보고 — 야심이 마른 식량을 두는 곳에 그 수업을 넣는다.",
				),
				dlg(
					"wuzetian",
					[
						"(soft, to no one)",
						"So that is how an empire changes owners.",
						"Quietly. With someone else speaking the first sentence.",
					],
					[
						"(작게, 누구에게도 아닌)",
						"제국이 주인 바꾸는 법이 이거구나.",
						"조용히. 첫 문장은 남이 말하게 두고.",
					],
					"#9d7bd0",
				),
				dlg(
					"gaozong",
					[
						"Lady Wu — you were of my father’s household.",
						"Stay. The palace is… unfinished.",
					],
					[
						"무 낭자 — 선제의 사람이었지.",
						"남아라. 궁이… 아직 덜 끝났으니.",
					],
					"#b8935a",
				),
				dlg(
					"wuzetian",
					[
						"As Your Majesty commands.",
						"(and already the room tilts a degree toward her)",
					],
					[
						"분부대로.",
						"(그리고 이미 방이 그녀 쪽으로 한 치 기운다)",
					],
					"#9d7bd0",
				),
			]
		)
		print("Wu added to Death of the Emperor")

	_, alliance = find_entry(chapters, "Silla-Tang Alliance")
	if not already(alliance["blocks"], "concubine who listens"):
		# append near end
		alliance["blocks"].extend(
			[
				p(
					"At a banquet meant to impress the Silla guest, Taizong’s laughter is the loudest thing in the hall. Behind a screen a concubine listens the way a strategist listens — counting who drinks, who flinches, which foreign prince the emperor calls brother.",
					"신라 사신을 압도하려는 연회에서 태종의 웃음이 가장 크다. 병풍 뒤에서 후궁 하나가 전략가처럼 듣는다 — 누가 마시고, 누가 움츠리고, 황제가 어느 외국 왕자를 형이라 부르는지.",
				),
				dlg(
					"wuzetian",
					[
						"He likes the one who weeps well.",
						"Noted.",
					],
					[
						"잘 우는 사람을 좋아하시는군.",
						"기억해 두지.",
					],
					"#9d7bd0",
				),
			]
		)
		print("Wu added to Silla-Tang Alliance")

	_, muyeol = find_entry(chapters, "King Muyeol")
	if not already(muyeol["blocks"], "influence growing by the day"):
		muyeol["blocks"].extend(
			[
				p(
					"Far west, Gaozong’s court learns a new gravity. The young woman who once waited in an anteroom now finishes sentences the emperor starts. Clerks say her influence is growing by the day. They say it softly. Softness is how courts admit a transfer of weather.",
					"서쪽 멀리, 고종의 조정은 새 중력을 배운다. 곁방에서 기다리던 젊은 여인이 이제 황제가 시작한 문장을 끝낸다. 서기들은 영향력이 날로 커진다고 한다. 작게 말한다. 작음은 조정이 날씨 이전을 인정하는 방식이다.",
				)
			]
		)
		print("Wu influence note on King Muyeol")


def patch_jinduk_lameduck(chapters) -> None:
	_, e = find_entry(chapters, "King Muyeol")
	if already(e["blocks"], "lame duck"):
		print("Jinduk lame duck already present")
		return
	# insert at beginning
	intro = [
		p(
			"For seven years the crown has sat on <b>Queen Jinduk</b> — Sunduk’s cousin, Chunchu’s aunt in the house’s counting — while the work sat on Chunchu’s table. She is not foolish. She is simply outnumbered by seals.",
			"칠 년 동안 왕관은 <b>진덕여왕</b>에게 있었다 — 선덕의 사촌, 집안의 셈으로는 춘추의 고모 — 일은 춘추의 책상에 있었다. 어리석지 않다. 다만 인장에 수적으로 밀렸을 뿐.",
		),
		dlg(
			"jinduk",
			[
				"Nephew.",
				"When I die, do not pretend I ruled.",
				"Say I kept the chair warm until the country was ready to admit who was already sitting in it.",
			],
			[
				"조카.",
				"내가 죽거든 내가 다스렸다고 하지 마라.",
				"나라가, 이미 앉아 있던 사람을 인정할 준비가 될 때까지 자리를 따뜻하게 지켜 줬다고 해라.",
			],
			"#9d7bd0",
		),
		dlg(
			"chunchu",
			[
				"Aunt.",
				"You ruled the only way left to Sacred Bone — by lasting.",
			],
			[
				"고모.",
				"성골에게 남은 유일한 방식으로 다스리셨습니다 — 버팀으로.",
			],
			"#D8258C",
		),
	]
	e["blocks"] = intro + e["blocks"]
	print("Jinduk lame-duck frame added to King Muyeol")


def patch_bupmin_child(chapters) -> None:
	_, e = find_entry(chapters, "Queen Sunduk")
	if already(e["blocks"], "I want to be the king for all"):
		print("Child Bupmin already speaks")
		return
	# append near early domestic material — find munhee or bupmin mention
	insert_at = None
	for i, b in enumerate(e["blocks"]):
		html = b.get("html") or ""
		if "Bupmin" in html or "문희" in html and b.get("kind") == "p":
			insert_at = i + 1
			break
	if insert_at is None:
		insert_at = min(8, len(e["blocks"]))
	scene = [
		p(
			"<b>Bupmin</b> is six and already collecting sentences the way other children collect stones. He finds his father and uncle on the hill where adults invent countries, and he does not wait to be invited into the invention.",
			"<b>법민</b>은 여섯 살이고, 다른 아이들이 돌을 모으듯 이미 문장을 모은다. 어른들이 나라를 발명하는 언덕에서 아버지와 외숙을 발견하고, 발명에 초대받기를 기다리지 않는다.",
		),
		dlg(
			"munmu",
			[
				"I want to be the king for all.",
				"Not a king for Sacred Bone. Not a king for True Bone.",
				"For all.",
			],
			[
				"나는 모두를 위한 임금이 될 거야.",
				"성골을 위한 임금도, 진골을 위한 임금도 말고.",
				"모두.",
			],
			"#3fa9c9",
		),
		dlg(
			"munhee",
			[
				"Listen to him.",
				"He steals your best lines and improves the audacity.",
			],
			[
				"저 아이 말 좀 들어 봐요.",
				"당신 명대사를 훔쳐서 배짱만 키운다니까.",
			],
			"#e07fa8",
		),
		dlg(
			"chunchu",
			[
				"…Keep that.",
				"I may need to borrow it back when I am braver.",
			],
			[
				"…그건 간직해라.",
				"내가 더 용감해지면 다시 빌릴지도 모르니.",
			],
			"#D8258C",
		),
	]
	e["blocks"] = e["blocks"][:insert_at] + scene + e["blocks"][insert_at:]
	print("Child Bupmin dream scene added")


def patch_gotaso_bupmin_munhee(chapters) -> None:
	_, e = find_entry(chapters, "Daeya Fortress")
	if already(e["blocks"], "Bupmin waits at the gate"):
		print("Daeya Bupmin already present")
		return
	e["blocks"].extend(
		[
			p(
				"In Surabol <b>Bupmin</b> waits at the gate the way a boy waits for a sister who promised forever. <b>Munhee</b> does not send him inside. She lets him see the empty road. Some educations are cruel on purpose.",
				"서라벌에서 <b>법민</b>은 영원히를 약속한 누나를 기다리듯 문 앞에서 기다린다. <b>문희</b>는 그를 들여보내지 않는다. 빈 길을 보게 둔다. 어떤 교육은 일부러 잔인하다.",
			),
			dlg(
				"munhee",
				[
					"Remember this.",
					"A king for all still loses people. The ‘all’ does not get smaller. You do.",
				],
				[
					"이걸 기억해.",
					"모두를 위한 임금도 사람을 잃어. ‘모두’가 작아지는 게 아니야. 네가 작아지는 거지.",
				],
				"#e07fa8",
			),
			dlg(
				"munmu",
				["…I will make a country where sisters come home."],
				["…누나가 돌아오는 나라를 만들 거야."],
				"#3fa9c9",
			),
			dlg(
				"munhee",
				["Good. Start by surviving your father."],
				["좋아. 일단 아버지 옆에서 살아남는 것부터."],
				"#e07fa8",
			),
		]
	)
	print("Daeya Munhee/Bupmin added")


def patch_merchant(chapters) -> None:
	_, e = find_entry(chapters, "Gotaso’s Wedding")
	if already(e["blocks"], "haesang"):
		print("Merchant already in Gotaso wedding")
	else:
		e["blocks"].extend(
			[
				p(
					"At the feast’s edge a southern merchant named <b>Haesang</b> pours a story instead of wine — careful, delighted, never a boast. He has been as far as the harbours of Funan, seen Indian ships with eyes painted on the prow, traded glass that Persians swore came from farther west than maps admit, and shared flatbread with Sogdian caravaneers who could insult you affectionately in six languages.",
					"잔치 가장자리에서 남쪽 상인 <b>해상</b>이 술 대신 이야기를 따른다 — 조심스럽고, 기쁘고, 허세 없이. 푸난의 항구까지 가 봤고, 선수에 눈을 그린 천축 배를 봤고, 지도가 인정하는 것보다 서쪽이라고 페르시아인이 맹세한 유리를 거래했고, 여섯 나라 말로 친근하게 욕할 줄 아는 소그드 대상과 납작빵을 나눴다.",
				),
				dlg(
					"haesang",
					[
						"In the south they greet a guest before they ask his rank.",
						"I recommend it. Rank keeps. Guests leave.",
					],
					[
						"남쪽에선 손님 맞이하고 나서야 신분을 묻습니다.",
						"추천합니다. 신분은 남고, 손님은 떠나니까요.",
					],
					"#c4a35a",
				),
			]
		)
		print("Merchant at Gotaso wedding")

	_, east = find_entry(chapters, "Chunchu Goes to the East")
	if not already(east["blocks"], "haesang"):
		east["blocks"].extend(
			[
				dlg(
					"haesang",
					[
						"If you reach the eastern islands, my lord, ask after their lacquer.",
						"And if you reach Chang’an again — ask after a woman who finishes the emperor’s sentences. Merchants hear weather early.",
					],
					[
						"동국에 가시거든 옻칠을 물어보십시오.",
						"장안에 다시 가시거든 — 황제 문장을 끝내는 여인을 물어보십시오. 상인은 날씨를 일찍 듣습니다.",
					],
					"#c4a35a",
				)
			]
		)
		print("Merchant teases Wu / east")


def patch_yeon_taoism(chapters) -> None:
	_, e = find_entry(chapters, "Yeon’s Massacre")
	if already(e["blocks"], "Taoism"):
		print("Yeon Taoism already present")
		return
	e["blocks"].extend(
		[
			p(
				"After the blood dries Yeon does something the temples will not forgive and the chronicles barely record: he sends for Tang masters of the Way. Taoism, imported on purpose — not for his soul, which he distrusts, but to starve the Buddhist monk aristocracy of the prestige they wear like armour. Incense changes. Halls cool. One young monk named <b>Shinsung</b> learns how to wait.",
				"피가 마른 뒤 연은 절이 용서하지 않고 사가가 거의 적지 않는 일을 한다. 당의 도사를 부른다. 의도적으로 들여온 도교 — 영혼을 위해서가 아니라 (그건 못 믿으니까) 승려 귀족이 갑옷처럼 걸친 권위를 굶기기 위해. 향이 바뀌고 전각이 식는다. <b>신성</b>이라는 젊은 스님은 기다리는 법을 배운다.",
			),
			dlg(
				"gesomun",
				[
					"Pray quieter.",
					"Or pray to something that does not own half the capital.",
				],
				[
					"기도 소리 낮춰.",
					"아니면 수도 절반을 소유하지 않은 것한테 기도해.",
				],
				"#d0362f",
			),
			dlg(
				"shinsung",
				["(bows)", "Amitabha."],
				["(절하며)", "아미타불."],
				"#8f7b70",
			),
		]
	)
	print("Yeon Taoism + Shinsung planted")


def patch_yeon_kangrim_near_death(chapters) -> None:
	# Put near-death during Snake River victory era - Death of Yeon or after Massacre battle
	# Use Snake River if exists, else append to Yeon's Massacre a battle echo, or Final Stand's prior
	try:
		_, e = find_entry(chapters, "Snake River")
	except KeyError:
		_, e = find_entry(chapters, "Yeon’s Massacre")
	if already(e["blocks"], "Gangnim hover"):
		print("Yeon Kangrim near-death already present")
		return
	e["blocks"].extend(
		[
			p(
				"In the worst hour of the fighting — arrows spent, horse down, a Tang blade a finger from his throat — the air thins the way Tamla stories promised. <b>Gangnim</b> is simply there, hovering as if courtesy required altitude, ledger half-open.",
				"싸움의 가장 나쁜 시각 — 화살 떨어지고 말 쓰러지고 당의 칼이 목에서 손가락 하나 간격일 때 — 탐라 이야기가 약속한 대로 공기가 옅어진다. <b>강림</b>이 그냥 있다. 예의가 고도를 요구한다는 듯 떠 있고, 명부는 반쯤 열려 있다.",
			),
			dlg(
				"gangnim",
				[
					"Yeon Gesomun.",
					"Your page is… persuasive today.",
				],
				[
					"연개소문.",
					"네 장이 오늘은… 설득력 있군.",
				],
				"#5f5f6b",
			),
			dlg(
				"gesomun",
				[
					"Not today.",
					"I still have sons to disappoint.",
				],
				[
					"오늘은 안 돼.",
					"실망시킬 아들이 아직 남았거든.",
				],
				"#d0362f",
			),
			p(
				"He stands up on will alone. The blade misses. Gangnim closes the ledger with something like respect — the rare expression of a reaper impressed by rudeness.",
				"의지 하나로 일어선다. 칼이 빗나간다. 강림이 명부를 덮으며 존중에 가까운 표정을 짓는다 — 무례에 감명받은 저승사자의 드문 얼굴.",
			),
			dlg(
				"gangnim",
				[
					"Hah.",
					"Keep the country a little longer, then.",
					"I hate refiling.",
				],
				[
					"하.",
					"그럼 나라 좀 더 붙들고 있어.",
					"서류 다시 넣기 싫거든.",
				],
				"#5f5f6b",
			),
		]
	)
	print("Yeon near-death Kangrim scene added")


def patch_yellow_mountain(chapters) -> None:
	_, e = find_entry(chapters, "Yellow Mountain Fields")
	if already(e["blocks"], "five thousand wave"):
		print("Hwangsan Kangrim already present")
		return
	# Insert after the 5000 vs 50000 dialogue (~block 9)
	idx = None
	for i, b in enumerate(e["blocks"]):
		ens = " ".join(b.get("en") or [])
		if "Five thousand against fifty thousand" in ens:
			idx = i + 1
			break
	if idx is None:
		idx = 10
	scene = [
		p(
			"Then the air above the Yellow Mountain does what air should not. <b>Gangnim</b> hangs there in plain day — visible not to one dying man but to all five thousand at once. They have already finished negotiating with life. Dedication that complete has a side effect: you can see the escort early.",
			"그때 황산 위 공기가 하면 안 되는 일을 한다. <b>강림</b>이 대낮에 떠 있다 — 죽어 가는 한 사람이 아니라 오천이 한꺼번에 본다. 그들은 이미 삶과의 협상을 끝냈다. 그 정도로 바친 충성엔 부작용이 있다. 호위를 일찍 보는 것.",
		),
		p(
			"They cheer. They wave. Someone shouts a greeting as if the reaper were a popular general arriving late to his own war. Gangnim, who has collected kings with less fuss, actually blinks.",
			"그들은 환호한다. 손을 흔든다. 누군가는 저승사자를 — 자기 전쟁에 늦게 도착한 인기 장군처럼 — 소리쳐 맞는다. 왕을 더 조용히 데려가 본 강림이 정말로 눈을 깜빡인다.",
		),
		dlg(
			"gangnim",
			[
				"…You can all see me.",
				"That is — new.",
				"Ah. You have already decided. Of course.",
			],
			[
				"…다들 보이느냐.",
				"이건 — 새롭군.",
				"아. 이미 정했구나. 그럴 수밖에.",
			],
			"#5f5f6b",
		),
		dlg(
			"gyebek",
			[
				"Men of Baekje —",
				"If even death showed up early, we must be on time.",
				"Spears.",
			],
			[
				"백제의 장병들이여 —",
				"죽음이 일찍 왔다면, 우리는 제시각인 거다.",
				"창.",
			],
			"#d9b13a",
		),
		p(
			"Five thousand against fifty thousand — not a formation so much as a sentence written in bodies. Like the three hundred at Thermopylae in stories that have not yet reached Samhan, they arrange themselves to be remembered rather than rescued. The math does not change. The watching does.",
			"오천 대 오만 — 진형이라기보다 몸으로 쓴 문장. 삼한에 아직 닿지 않은 이야기 속 삼백처럼, 구출되기보다 기억되도록 선다. 셈은 바뀌지 않는다. 응시가 바뀔 뿐.",
		),
	]
	e["blocks"] = e["blocks"][:idx] + scene + e["blocks"][idx:]
	# Kangrim at Gyebek death - before his last line
	for i, b in enumerate(e["blocks"]):
		ens = " ".join(b.get("en") or [])
		if "this is as far as I go" in ens:
			e["blocks"].insert(
				i,
				dlg(
					"gangnim",
					[
						"General.",
						"Your five thousand already waved. You may walk without apology.",
					],
					[
						"장군.",
						"네 오천이 이미 손 흔들었다. 사과 없이 걸어도 된다.",
					],
					"#5f5f6b",
				),
			)
			break
	print("Yellow Mountain Kangrim + 300 framing added")


def patch_tamla(chapters) -> None:
	_, e = find_entry(chapters, "Tamla, the Island of Oranges")
	if already(e["blocks"], "status games"):
		print("Tamla warmth already present")
		return
	e["blocks"].extend(
		[
			p(
				"Ordinary Tamla does not play the mainland’s endless status games. A diver offers <b>Gyebek</b> grilled fish before she asks which Baekje office ruined him. A boy corrects his orange-peeling and laughs when he fails. Kindness here is not strategy. That, more than the stories, is what keeps him five years.",
				"탐라의 보통 사람들은 육지의 끝없는 신분 놀이를 하지 않는다. 해녀는 백제의 어느 관직이 그를 망쳤는지 묻기 전에 구운 생선을 건넨다. 아이가 오렌지 까는 법을 고쳐 주고, 실패하면 웃는다. 여기 친절은 전략이 아니다. 이야기보다 그게 그를 오 년 붙든다.",
			),
			dlg(
				"haenyeo",
				[
					"Eat.",
					"You look like a man who was promoted by being useful and punished for the same crime.",
				],
				[
					"먹어.",
					"쓸모 있어서 출세했다가 같은 죄로 벌받은 사람 얼굴이네.",
				],
				"#6fa8a0",
			),
			dlg(
				"gyebek",
				["…That is an exact sentence."],
				["…정확한 문장입니다."],
				"#d9b13a",
			),
			dlg(
				"haenyeo",
				[
					"We have those. We just don’t put them on banners.",
				],
				[
					"우리도 있지. 깃발에만 안 쓸 뿐.",
				],
				"#6fa8a0",
			),
		]
	)
	print("Tamla ordinary kindness added")


def patch_coup(chapters) -> None:
	_, e = find_entry(chapters, "Euija’s Coup")
	if already(e["blocks"], "emergency cabinet"):
		print("Coup parody already deepened")
		return
	# After martial law dialogue
	for i, b in enumerate(e["blocks"]):
		ens = " ".join(b.get("en") or [])
		if "emergency martial law" in ens:
			extra = [
				p(
					"He has prepared a script that sounds like safety and functions like a padlock: dissolve the inconvenient Assembly, seat loyal blood, call the pause a rescue. The clans stare as if watching a man declare war on the furniture of his own house — briefly, confidently, and with the stunned loneliness of someone who expected applause.",
					"안전처럼 들리고 자물쇠처럼 작동하는 대본을 준비해 두었다. 거추장스러운 회의를 해산하고, 충성스러운 피를 앉히고, 멈춤을 구원이라 부른다. 씨족들은 — 자기 집 가구에 전쟁을 선포하는 사람을 보듯 — 짧게, 자신 있게, 박수를 기대한 사람의 멍한 고독으로 그를 본다.",
				),
				dlg(
					"chunbok",
					[
						"Oh my — he’s lost his mind…",
						"Also he printed the proclamation before the session. I can smell the ink.",
					],
					[
						"아이고 — 미쳤네…",
						"회의 전에 포고문을 찍어 두셨네. 먹 냄새 나요.",
					],
					"#d4a94e",
				),
				dlg(
					"euija",
					[
						"This is temporary.",
						"Temporary is how permanent things begin when you are afraid to say permanent.",
					],
					[
						"임시적이다.",
						"임시란 — 영구라고 말하기 두려울 때 영구가 시작되는 방식이지.",
					],
					"#e08a2e",
				),
			]
			# Avoid duplicating chunbok lost mind if already next
			e["blocks"] = e["blocks"][: i + 1] + extra + e["blocks"][i + 2 :]
			print("Euija coup parody deepened")
			return
	print("Coup martial law line not found")


def patch_sunduk_kangrim(chapters) -> None:
	_, e = find_entry(chapters, "Bidam’s Rebellion")
	if already(e["blocks"], "Your Majesty — two names"):
		# may have been added in kite patch
		pass
	# Ensure deathbed has a brief Kangrim if not
	if already(e["blocks"], "comforted by Yushin") and not already(
		e["blocks"], "Yushin is still holding"
	):
		for i, b in enumerate(e["blocks"]):
			if b.get("kind") == "p" and "dies, comforted by Yushin" in (b.get("html") or ""):
				e["blocks"].insert(
					i + 1,
					dlg(
						"gangnim",
						[
							"Your Majesty.",
							"Yushin is still holding your hand. I can wait one sentence.",
						],
						[
							"폐하.",
							"유신이 아직 손을 잡고 있습니다. 문장 하나쯤 기다릴 수 있습니다.",
						],
						"#5f5f6b",
					),
				)
				print("Sunduk Kangrim beat added")
				break


def patch_temple_munhee(chapters) -> None:
	_, e = find_entry(chapters, "The Death of Kim Chunchu")
	if already(e["blocks"], "temple courtyard"):
		print("Temple/Munhee already at Chunchu death")
		return
	e["blocks"][0:0] = [
		p(
			"They take him first to a Buddhist temple on the edge of Surabol — not for miracle, for quiet. Incense. Stone. A monk who knows when not to speak. <b>Munhee</b> sits where wives of True Bone have always sat when history arrives as a fever.",
			"먼저 서라벌 가장자리 절로 옮긴다 — 기적이 아니라 고요를 위해. 향. 돌. 말없이 있을 때를 아는 스님. <b>문희</b>는 진골의 아내들이 역사가 열병으로 올 때 항상 앉던 자리에 앉는다.",
		),
		dlg(
			"munhee",
			[
				"You reinvented a kingdom in a side hall.",
				"Leave me the hours. I invent endings.",
			],
			[
				"곁방에서 나라를 다시 만들었지.",
				"시간은 내게 남겨. 끝은 내가 발명할게.",
			],
			"#e07fa8",
		),
	]
	print("Temple + Munhee at Chunchu death")


def patch_final_stand_shinsung(chapters) -> None:
	_, e = find_entry(chapters, "The Final Stand")
	if already(e["blocks"], "Taoism starved"):
		print("Shinsung deepen already")
		return
	for i, b in enumerate(e["blocks"]):
		html = b.get("html") or ""
		if "Shinsung" in html or "신성" in html:
			e["blocks"].insert(
				i,
				p(
					"The monk aristocracy Yeon tried to starve with Tang Taoism has waited a generation. <b>Shinsung</b> does not make a speech about doctrine. He opens a gate. Betrayal, in the end, is also a kind of liturgy — performed from the inside.",
					"연이 당의 도교로 굶기려 했던 승려 귀족이 한 세대를 기다렸다. <b>신성</b>은 교리에 대해 연설하지 않는다. 문을 연다. 배신도 결국 일종의 의례다 — 안에서 올리는.",
				),
			)
			print("Shinsung motivation before gate")
			return
	print("Shinsung line not found in Final Stand")


def patch_king_for_all_bupmin(chapters) -> None:
	_, e = find_entry(chapters, "The King for All")
	if already(e["blocks"], "childhood sentence"):
		print("King for All Bupmin frame already")
		return
	e["blocks"][0:0] = [
		p(
			"<b>Bupmin</b> — <b>King Munmu</b> — stands where a six-year-old once stole a sentence. The war is commanded. The ally is expelled. The childhood dream has the bad manners to come true.",
			"<b>법민</b> — <b>문무왕</b> — 여섯 살 아이가 문장을 훔치던 자리에 선다. 전쟁은 지휘되었고, 동맹은 쫓겨났고, 어린 시절의 꿈이 무례하게도 이루어진다.",
		),
		dlg(
			"munmu",
			[
				"Mother.",
				"I kept the childhood sentence.",
			],
			[
				"어머니.",
				"어린 문장을 지켰어요.",
			],
			"#3fa9c9",
		),
		dlg(
			"munhee",
			[
				"I know.",
				"I packed for every country that tried to stop you.",
			],
			[
				"알아.",
				"너를 막으려던 나라마다 짐을 싸 줬으니까.",
			],
			"#e07fa8",
		),
	]
	print("King for All Munhee/Bupmin frame added")


def main() -> None:
	chapters = json.loads(STORY.read_text())
	_, bidam = find_entry(chapters, "Bidam’s Rebellion")
	patch_kite(bidam)
	patch_sunduk_kangrim(chapters)
	_, sec = find_entry(chapters, "The Royal Secretariat")
	patch_secretariat(sec)
	patch_wu(chapters)
	patch_jinduk_lameduck(chapters)
	patch_bupmin_child(chapters)
	try:
		patch_gotaso_bupmin_munhee(chapters)
	except KeyError:
		print("Daeya Fortress missing — skip")
	patch_merchant(chapters)
	patch_yeon_taoism(chapters)
	patch_yeon_kangrim_near_death(chapters)
	patch_yellow_mountain(chapters)
	patch_tamla(chapters)
	patch_coup(chapters)
	patch_temple_munhee(chapters)
	patch_final_stand_shinsung(chapters)
	patch_king_for_all_bupmin(chapters)
	STORY.write_text(json.dumps(chapters, ensure_ascii=False, indent="\t") + "\n")
	print("Wrote", STORY)


if __name__ == "__main__":
	main()
