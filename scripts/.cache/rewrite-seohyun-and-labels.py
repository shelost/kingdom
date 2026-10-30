#!/usr/bin/env python3
"""Restructure Seohyun; retitle every episode's scene labels for the Notion rail."""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORY = ROOT / "src/lib/data/story.json"


def p(html: str, ko: str) -> dict:
	return {"kind": "p", "html": html, "ko": ko}


def scene(label: str, ko: str, **extra) -> dict:
	return {"kind": "scene", "label": label, "ko": ko, **extra}


def section(label: str, ko: str) -> dict:
	return {"kind": "section", "label": label, "ko": ko}


def dlg(person: str, en: list[str], lines: list[str], **extra) -> dict:
	out = {"kind": "dialogue", "person": person, "en": en, "lines": lines}
	out.update(extra)
	return out


def find_entry(story):
	for ch in story:
		for e in ch.get("entries") or []:
			if e.get("title") == "Seohyun":
				return e
	raise SystemExit("Seohyun entry missing")


def rewrite_seohyun(entry):
	b = entry["blocks"]

	# --- plates ---
	b[1] = section("Childhood", "유년")
	b[2]["label"], b[2]["ko"] = "Egg Game", "알 놀이"
	b[10]["label"], b[10]["ko"] = "Family Dinner", "저녁상"
	b[26]["label"], b[26]["ko"] = "Helm on the Stand", "투구"
	b[33]["label"], b[33]["ko"] = "Night Polo", "밤 격구"
	b[37]["label"], b[37]["ko"] = "The Prince at the Gate", "왕자가 온 대문"
	b[50]["label"], b[50]["ko"] = "Yard Wall", "마당 담"
	b[62] = scene("Assimilation", "동화")

	# Insert Manmyung section before the ten-years-later jump
	jump_i = next(i for i, x in enumerate(b) if x.get("kind") == "scene" and "ten years later" in (x.get("label") or "").lower())
	b[jump_i]["label"], b[jump_i]["ko"] = "First Look", "첫눈"
	b.insert(jump_i, section("Manmyung", "만명"))

	relabel = {
		"The Gate": ("The Gate", "그 문"),
		"Getting Lost": ("Side Gate", "곁문"),
		"Prince Suulbu’s Hall": ("Suulbu's Hall", "수을부의 대청"),
		"The Gaya house · the gate, again": ("Rank Is a Coat", "벼슬은 옷"),
		"The House Apart": ("Locked Room", "별채"),
	}
	for x in b:
		if x.get("kind") == "scene" and x.get("label") in relabel:
			x["label"], x["ko"] = relabel[x["label"]]

	# Trim the Saryang-boy wall
	for i, x in enumerate(b):
		if x.get("kind") == "p" and "Saryang ward" in x.get("html", ""):
			b[i] = p(
				"Some mornings a thin boy from Saryang ward pulls the cart instead. He sees everything on that street and tells nobody.",
				"어떤 아침엔 사량부 마른 아이가 수레를 끈다. 그 골목의 일은 다 보고, 아무한테도 말하지 않는다.",
			)
			break

	# Compress the late / posting chat into five short turns. Keep the collar beat after.
	start = next(
		i
		for i, x in enumerate(b)
		if x.get("kind") == "dialogue"
		and x.get("person") == "manmyung"
		and (x.get("en") or [""])[0] == "You’re late."
	)
	end = start
	while end < len(b) and b[end].get("kind") == "dialogue":
		end += 1
	b[start:end] = [
		dlg("manmyung", ["You’re late.", "The horse?"], ["늦었어요.", "말은요?"]),
		dlg(
			"seohyeon",
			["The horse is fine.", "They kept us at the Ministry. There’s talk of a posting. North, probably."],
			["말은 괜찮소.", "병조에서 붙들었소. 발령 이야기가 있소. 북쪽일 거요."],
		),
		dlg("manmyung", ["Not much me."], ["나 없는 쪽."]),
		dlg("seohyeon", ["…I was going to say not much rice."], ["…쌀이 없다고 하려고 했소."]),
		dlg("manmyung", ["Liar."], ["거짓말."]),
	]

	# Suulbu's hall — cut the furniture-lecture opener
	for i, x in enumerate(b):
		if x.get("kind") == "p" and "Prince Suulbu takes the news" in x.get("html", ""):
			b[i] = p(
				"Prince Suulbu takes the news sitting down, without looking up from his cup. He has never once in his life been the one left standing.",
				"수을부 왕자는 소식을 앉은 채로 받는다. 잔에서 눈을 들지 않는다. 평생 한 번도, 혼자 서 남은 쪽이 된 적이 없다.",
			)
			break

	# Rank-is-a-coat visit: keep the good lines, drop the echo of the horse speech
	# (already tight)

	# --- Locked Room: insert lust + split lightning / kiss / hut / fury ---
	# Find house-apart interior after the place block
	place_i = next(
		i for i, x in enumerate(b) if x.get("kind") == "place" and x.get("place") == "locked_room"
	)
	# After guards (place, p, 4 dlg) comes interior p about counting boards
	interior_i = next(i for i, x in enumerate(b) if "counted the boards" in x.get("html", ""))
	lightning_i = next(i for i, x in enumerate(b) if "sky comes down on the door" in x.get("html", ""))

	lust = [
		p(
			"Inside, the raised house is one room and one lamp. The pink ribbon on the rail does not move. She has stopped eating to make a point and started again because the point was only hurting her.",
			"별채 안은 방 하나, 등 하나다. 난간 분홍 리본은 꿈쩍하지 않는다. 시위하느라 밥을 끊었다가, 그 시위가 저만 아프게 한다는 걸 알고 다시 먹기 시작했다.",
		),
		p(
			"She lies on the floor the way she is not supposed to lie, chima hiked to the hip, and thinks of a collar in a gate. Of a mouth that said <i>Manno</i> as if it were a question. Of the bar, still down, and his face on the other side of it.",
			"엎드려선 안 되는 자세로 마루에 눕는다. 치마를 허리까지 걷어 올린 채, 대문 틈의 옷깃을 생각한다. 만노, 하고 묻듯 말하던 입을. 아직 내려져 있던 빗장, 그 너머 얼굴을.",
		),
		p(
			"Her hand goes under the silk. She stops. Starts again. The boards will not tell her father, and the lamp is the only thing watching. Four nights of this. She says his name once, into the floor, and bites it off.",
			"손이 비단 밑으로 간다. 멈춘다. 다시 시작한다. 마루널은 아버지에게 고하지 않고, 등잔만 보고 있다. 나흘 밤이 이렇다. 바닥에다 그의 이름을 한 번 말하고, 깨물어 삼킨다.",
		),
		p(
			"At the foot of the back wall, where the drain runs out, there is a gap. She has been looking at it the way her father looks at furniture.",
			"뒷담 아래, 도랑물이 빠져나가는 자리에 틈이 하나 있다. 그녀는 그 틈을, 아버지가 가구를 보듯 쳐다보고 있다.",
		),
	]
	# Drop the old "Inside, Manmyung has stopped eating…" paragraph — replaced
	del b[interior_i]
	# indices after delete: lightning moved up 1
	lightning_i = next(i for i, x in enumerate(b) if "sky comes down on the door" in x.get("html", ""))
	b[lightning_i:lightning_i] = lust
	lightning_i += len(lust)

	# Split: Lightning / Rain Kiss / Charcoal Hut / Suulbu's Fury
	b.insert(lightning_i, scene("Lightning", "벼락"))

	kiss_i = next(i for i, x in enumerate(b) if x.get("html", "").startswith("He is at the bottom of the lane"))
	b.insert(kiss_i, scene("Rain Kiss", "빗속"))

	hut_i = next(i for i, x in enumerate(b) if x.get("html", "").startswith("The hut has a roof"))
	b.insert(hut_i, scene("Charcoal Hut", "숯 움막"))

	# After "In the morning the rain has stopped…" add Suulbu fury, then Manno stays
	morning_i = next(i for i, x in enumerate(b) if "In the morning the rain has stopped" in x.get("html", ""))
	# Keep that p, then insert fury scene after it
	fury = [
		scene("Suulbu's Fury", "수을부의 분노"),
		p(
			"The cousins stand in the hall with burned pine still on their sleeves. The door is in three pieces in the yard. Prince Suulbu does not sit down this time.",
			"사촌 둘이 대청에 서 있다. 소매에 탄 소나무 냄새가 남았다. 마당에는 문이 세 조각이다. 수을부 왕자는 이번엔 앉지 않는다.",
		),
		dlg(
			"sukhuljong",
			["Heaven.", "Heaven took my door. And my daughter used the drain.", "Find the Manno road. And if you find that Gaya boy on it, you bring me the horse. Not him."],
			["하늘이.", "하늘이 내 문을 가져갔다. 내 딸은 도랑으로 나갔고.", "만노 길을 찾아라. 그 길에 가야 놈이 있거든, 말은 데려와. 놈은 말고."],
		),
		p(
			"They do not find her on the Manno road. He will spend the next year telling the table he has never heard of the father.",
			"만노 길에서는 찾지 못한다. 이듬해 내내 그는 밥상에서, 그 아이의 아버지는 들어 본 적도 없다고 한다.",
		),
	]
	b[morning_i + 1 : morning_i + 1] = fury

	# Remaining Manmyung / later labels
	for x in b:
		if x.get("kind") != "scene":
			continue
		lab = x.get("label")
		if lab == "Manno":
			x["label"], x["ko"] = "County House", "만노 관아"
		elif lab == "Manno · the cart from Surabol":
			x["label"], x["ko"] = "The Cart", "수레"
		elif lab == "The Name at the Gate":
			x["label"], x["ko"] = "The Name at the Gate", "문 앞의 이름"
		elif lab == "The Spring":
			x["label"], x["ko"] = "Steam Spring", "샘"
		elif lab == "Home to Manno":
			x["label"], x["ko"] = "Warm Stone", "따뜻한 돌"
		elif lab == "Fifteen":
			x["label"], x["ko"] = "Fifteen", "열다섯"
		elif lab.startswith("Surabol, the hwarang"):
			x["label"], x["ko"] = "Hwarang Yard", "화랑 연무장"
		elif lab == "Daeyang":
			x["label"], x["ko"] = "Daeya Wall", "대야 성벽"
		elif lab == "Surabol · the torn coat":
			x["label"], x["ko"] = "Torn Coat", "뜯긴 옷고름"
		elif lab == "Daeya · a letter from Surabol":
			x["label"], x["ko"] = "The Letter", "편지"
		elif lab == "Surabol · the wedding":
			x["label"], x["ko"] = "The Wedding", "혼례"
		elif lab.startswith("Nangbi"):
			x["label"], x["ko"] = "White Horse", "백마"

	# Just One Person is a speech — one scene, not a story header
	for x in b:
		if x.get("kind") == "story" and x.get("label") == "Just One Person":
			x["kind"] = "scene"
			break

	# Tighten the Manno naming lecture (keep the joke, cut the scholar paragraph down)
	for i, x in enumerate(b):
		if x.get("kind") == "dialogue" and x.get("person") == "seohyeon":
			en = x.get("en") or []
			if en and en[0].startswith("I want to call him for the night"):
				# next seohyeon block is the etymology wall
				pass
		if x.get("kind") == "dialogue" and "gyeong" in " ".join(x.get("en") or []):
			x["en"] = [
				"But <i>gyeong</i>, written down, looks like <i>yu</i>. And <i>jin</i>, said quickly, is nearly <i>sin</i>.",
				"There was a scholar. Yu Xin. So it isn’t a day. It’s a name nobody can object to.",
			]
			x["lines"] = [
				"근데 경을 쓰면 유처럼 보이거든. 진은 빨리 말하면 신이고.",
				"옛 책에 유신이라는 선비가 있어. 날이 아니야. 누가 뭐라 못 하는 이름이지.",
			]
			break

	# Image `at` that pointed at old scene labels
	at_map = {
		"Surabol, the lane by the Gaya house": "Egg Game",
		"The Gaya house · supper": "Family Dinner",
		"The Gaya house · twenty years after Gwansan": "Helm on the Stand",
		"Surabol, the palace gyuku field · by night": "Night Polo",
		"The Gaya house · the gate": "The Prince at the Gate",
		"The Gaya house · the yard wall, that night": "Yard Wall",
		"The Gate": "The Gate",
		"Getting Lost": "Side Gate",
		"Suulbu’s Hall": "Suulbu's Hall",
		"The Gaya house · the gate, again": "Rank Is a Coat",
		"The House Apart": "Locked Room",
		"Manno is a wooden wall": "Manno is a wooden wall",
		"Manno · the cart from Surabol": "The Cart",
		"The Name at the Gate": "The Name at the Gate",
		"The Spring": "Steam Spring",
		"Fifteen": "Fifteen",
		"Surabol, the hwarang yard gate · Class 51’s first morning": "Hwarang Yard",
		"Daeya · a letter from Surabol": "The Letter",
		"Surabol · the wedding": "The Wedding",
		"Nangbi · the rise behind the trenches": "White Horse",
		"goes out through a gap in the wall so low that she has to crawl": "The gap is so low the good silk catches and tears.",
	}
	for im in entry.get("images") or []:
		at = im.get("at")
		if at in at_map:
			im["at"] = at_map[at]
		# unhide the first-meeting still — we want it
		if im.get("id") == "seohyun-third-pass":
			im.pop("hidden", None)
		if im.get("id") == "seohyun-crawl":
			im.pop("hidden", None)

	# New slots (prompts filled by add-image-slots)
	new_slots = [
		{
			"id": "seo-locked-want",
			"ratio": 2,
			"tone": "#c98bb9",
			"time": "night",
			"at": "She lies on the floor the way she is not supposed to lie",
			"alt": "Manmyung alone in the locked raised house, chima hiked, thinking of him",
			"people": ["manmyung"],
			"nsfw": "erotic",
		},
		{
			"id": "seo-locked-lust",
			"ratio": 2,
			"tone": "#c98bb9",
			"time": "night",
			"at": "Her hand goes under the silk",
			"alt": "One lamp. Her hand under the silk. His name bitten into the floor.",
			"people": ["manmyung"],
			"nsfw": "erotic",
		},
		{
			"id": "seo-lightning-door",
			"ratio": 2,
			"tone": "#c98bb9",
			"time": "night",
			"at": "On the last night the sky comes down on the door",
			"alt": "Lightning splits the iron-barred door of the raised house-apart",
			"people": ["manmyung"],
		},
		{
			"id": "seo-suulbu-fury",
			"ratio": 2,
			"tone": "#7a3b2e",
			"time": "night",
			"at": "Prince Suulbu does not sit down this time",
			"alt": "Suulbu standing in his hall over the burned pieces of the door",
			"people": ["sukhuljong"],
		},
		{
			"id": "seo-silhouette-kiss",
			"ratio": 2,
			"tone": "#3E8EF0",
			"time": "night",
			"at": "They ride west in the rain, not north",
			"alt": "Two riders in silhouette on a wet ridge, kissing in the storm break",
			"people": ["seohyeon", "manmyung"],
		},
		{
			"id": "seo-hut-free",
			"ratio": 2,
			"tone": "#c98bb9",
			"time": "night",
			"at": "This time there is no bar between them",
			"alt": "Charcoal hut: wet silk off, one hearth, they are finally free",
			"people": ["seohyeon", "manmyung"],
			"nsfw": "erotic",
		},
		{
			"id": "seo-side-gate-collar",
			"ratio": 2,
			"tone": "#c98bb9",
			"time": "day",
			"at": "She reaches through the gap above the bar and takes hold of his collar",
			"alt": "Manmyung pulls Seohyun to the barred side gate by the collar",
			"people": ["seohyeon", "manmyung"],
		},
	]
	have = {im["id"] for im in entry.get("images") or []}
	entry.setdefault("images", [])
	for slot in new_slots:
		if slot["id"] not in have:
			entry["images"].append(slot)

	# sanity: four sections, no leftover stories
	secs = [x["label"] for x in b if x.get("kind") == "section"]
	stories = [x["label"] for x in b if x.get("kind") == "story"]
	if secs != ["Childhood", "Manmyung", "Cavern", "Yushin"]:
		raise SystemExit(f"sections {secs}")
	if stories:
		raise SystemExit(f"leftover stories {stories}")


# Beat titles: (episode title, old English label) → (en, ko)
# Only the place-crumb / uninformative ones. Already-short titles stay.
TITLES: dict[tuple[str, str], tuple[str, str]] = {
	("King Jinheung", "The Side Hall, again"): ("The Gift Wife", "곁채의 아내"),
	("Prince Euija", "The Sabi yard · the years after the name"): ("After the Name", "이름 이후"),
	("High Summit", "Pyongyang · the High Summit"): ("Five Commands", "다섯 부대"),
	("Bupmin", "The Hwarang yard gate · Class 82’s first morning"): ("Hwarang Yard", "화랑 연무장"),
	("Bupmin", "The throat, again"): ("Same Pine", "같은 소나무"),
	("Bupmin", "Gyuku, two sides"): ("Two Sides", "격구 두 편"),
	("Sadaham", "Surabol, the hwarang yard · 560"): ("Hwarang Yard", "화랑 연무장"),
	("Sadaham", "The yard · that spring"): ("Best Sword", "제일 칼"),
	("Sadaham", "The forest · Isabu’s Order"): ("Isabu's Order", "이사부의 향도"),
	("Sadaham", "The Gaya border, a ford on the Hwang · autumn, 561"): ("Hwang Ford", "황강 나루"),
	("Sadaham", "Mount Danseok · winter, 561"): ("Danseok Winter", "단석산 겨울"),
	("Sadaham", "Surabol, the king’s hall · 562"): ("King's Hall", "임금의 전당"),
	("Sadaham", "The Battle of Great Gaya · 562"): ("Great Gaya", "대가야"),
	("Sadaham", "Great Gaya, the square · that afternoon"): ("The Square", "광장"),
	("Sadaham", "The Silla camp below Great Gaya · that night"): ("Cut Ropes", "끊긴 밧줄"),
	("Sadaham", "Surabol, the yard · that spring"): ("Home Yard", "돌아온 연무장"),
	("Sadaham", "Surabol, the hwarang hall · winter, 563"): ("The Cough", "기침"),
	("Sadaham", "Surabol · seven days, 564"): ("Seven Days", "이레"),
	("Munhee", "Surabol, the Hwarang yard gate · Class 59’s first morning"): ("Hwarang Yard", "화랑 연무장"),
	("Munhee", "The yard · roll call"): ("Roll Call", "점호"),
	("Munhee", "The hall · the first month"): ("Drain End", "숙소 끝"),
	("Munhee", "The forest · a piece of an animal"): ("The Line", "한 줄"),
	("Munhee", "The yard · last through the gate"): ("Last Through", "마지막 문"),
	("Munhee", "The yard · the Marshal’s question"): ("Marshal's Question", "도감의 물음"),
	("Munhee", "The storehouse · the quartermaster’s tally"): ("Short Rice", "모자란 쌀"),
	("Munhee", "The yard · the hill beacons"): ("Hill Beacons", "언덕 봉수"),
	("Munhee", "The yard · the autumn moon"): ("Autumn Verse", "가을 달"),
	("Munhee", "The yard · the Council’s review"): ("Council Review", "화백의 사열"),
	("Munhee", "The yard wall · that night"): ("Yard Wall", "연무장 담"),
	("Munhee", "The Moon Palace · the archery range, after dark"): ("Night Archery", "밤 활터"),
	("King Euija", "The royal stables · that night"): ("Promotion Gate", "승진이 붙는 문"),
	("Ulbul", "The hall · before anyone is sick"): ("Still Healthy", "아직 아픈 사람 없이"),
	("Ulbul", "The hot spring · a feast"): ("Hot Spring Feast", "온탕 잔치"),
	("Ulbul", "The side pool · the same steam"): ("Side Pool", "곁탕"),
	("Ulbul", "The inner hall · the same night"): ("Quiet Hall", "조용한 내전"),
	("Ulbul", "The spring again · the heads"): ("Heads in the Steam", "온탕의 머리"),
	("Ulbul", "The hall · the first morning"): ("Father's Bed", "아버지의 침상"),
	("Ulbul", "The yard · a popular uncle"): ("Popular Uncle", "인기 있는 숙부"),
	("Ulbul", "A corridor · the next day"): ("The Ledger", "장부"),
	("Ulbul", "The inner rooms · after Dalga"): ("After Dalga", "달가 다음"),
	("Ulbul", "The inner hall · a long night"): ("Long Night", "긴 밤"),
	("Ulbul", "The outer hall · a popular official"): ("Popular Official", "바깥 전각"),
	("Ulbul", "Outside the house · that night"): ("House Sits Down", "집이 주저앉는 밤"),
	("Ulbul", "The yard · the morning he still is a prince"): ("Still a Prince", "아직 왕자이던 아침"),
	("Ulbul", "The back door · the same night"): ("Back Door", "뒷문"),
	("Ulbul", "The shed · a winter night"): ("Frog Shed", "겨울 헛간"),
	("Ulbul", "The gate · a year on"): ("The Boat", "사립의 배"),
	("Ulbul", "The salt boat · the Amnok"): ("Salt Boat", "소금배"),
	("Ulbul", "A hungry house · downriver"): ("Hungry House", "굶는 집"),
	("Ulbul", "The yard · that afternoon"): ("The Shoe", "신"),
	("Ulbul", "The sacks · a later year"): ("Two Riders", "가마니와 기병"),
	("Ulbul", "The yards · a hungry year"): ("Look Down", "굶는 해"),
	("Ulbul", "The scaffolds · the same week"): ("Scaffolds", "비계"),
	("Ulbul", "The new roof · a hungry month"): ("New Roof", "새 지붕"),
	("Ulbul", "The market · under the fortress"): ("Living Market", "산성 아래 장"),
	("Ulbul", "The market · the same morning"): ("Same Market", "같은 장"),
	("Ulbul", "The same market · a famine morning"): ("Empty Aisles", "기근 아침"),
	("Ulbul", "The hall · that night"): ("Changjori's Numbers", "숫자"),
	("Ulbul", "The Biryu · the same week"): ("The Biryu", "비류"),
	("Ulbul", "The ditch · that night"): ("The Ditch", "도랑"),
	("Ulbul", "The mouth · dawn"): ("Cave Mouth", "굴 입구"),
	("Ulbul", "The south house · the plan"): ("The Plan", "남쪽 집"),
	("Ulbul", "The north slope · that autumn"): ("North Slope", "후산 북쪽"),
	("Ulbul", "The side room · that night"): ("Crown Off", "별실"),
	("Ulbul", "The hall · the next morning"): ("Salt Seller's Seal", "소금장수의 인장"),
	("Ulbul", "The northern seal · two years after the crown"): ("Northern Seal", "북쪽 인장"),
	("Ulbul", "The river road · nine years later"): ("River Road", "강의 길"),
	("Ulbul", "The western gate · thirteen years later"): ("Western Gate", "서쪽 성문"),
	("Ulbul", "The market · under a far fortress"): ("Far Market", "먼 성 아래 장"),
	("Jukjuk", "Daeya · the officers’ row, the night of the drums"): ("Bamboo Yard", "대나무 마당"),
	("Emperor", "Surabol · the twelfth month"): ("Twelfth Month", "섣달"),
	("King Dongcheon", "Hwando · spring"): ("Pine Smoke", "환도 봄"),
	("King Dongcheon", "The Liao · summer"): ("Wei Camp", "요하 여름"),
	("King Dongcheon", "Liaodong · the rains"): ("Twenty Li", "요동 장마"),
	("King Dongcheon", "The plain tent · nights"): ("Plain Tent", "수수한 막사"),
	("King Dongcheon", "Liaodong · the rain stops"): ("The Ramps", "비가 그치다"),
	("King Dongcheon", "Liaodong · after"): ("After Liaodong", "요동 그 뒤"),
	("King Dongcheon", "The Liao ford · autumn"): ("Liao Ford", "요하 나루"),
	("Lord of Ansi", "Ansi · autumn 642"): ("Hill Town", "안시 가을"),
	("Lord of Ansi", "Ansi · that winter"): ("Red Seal", "안시 겨울"),
	("Lord of Ansi", "Ansi · the thaw"): ("Three Thousand", "얼음 풀릴 무렵"),
	("Lord of Ansi", "Ansi · summer 645"): ("The Emperor Comes", "안시 여름"),
	("Lord of Ansi", "Ansi · that winter"): ("The Statue", "석상"),
	("Suro", "Turtle Peak · the next spring"): ("Six Kings", "구지봉"),
	("Muryuk", "Golden Gaya · eight years later"): ("Into the Helm", "투구 속으로"),
	("Muryuk", "Surabol, the Moon Palace"): ("Treasury Count", "월성 창고"),
	("Muryuk", "Surabol, the Gaya house · the first winter"): ("First Winter", "가야 집 첫 겨울"),
	("Muryuk", "The Gaya house gate · that spring"): ("House Gate", "가야 집 대문"),
	("Muryuk", "The Harmony Council · some years on"): ("Harmony Council", "화백회의"),
	("Muryuk", "Surabol · the years after"): ("The Oath", "맹세 이후"),
	("Muryuk", "Surabol, the Gaya house · the next spring"): ("He Marries", "이듬해 봄"),
	("Muryuk", "Surabol, the Gaya house · eight years after Great Gaya"): ("Birth Night", "해산의 밤"),
	("Jeon", "The Nakdong · a night he still washes"): ("He Washes", "낙동강"),
	("Jeon", "The Moon Palace · near midnight"): ("Three Days of Rice", "쌀 사흘"),
	("Jeon", "The Kim house, Surabol · the small hours"): ("Father's Bed", "김씨 집"),
	("Jeon", "The Outer Ditch · before light"): ("Outer Ditch", "바깥 도랑"),
	("Gyul", "The cavern under the hill · before light"): ("Cavern Lake", "언덕 아래 동굴"),
	("Gyul", "The cavern mouth · first light"): ("Cavern Mouth", "동굴 어귀"),
	("Li Shimin", "The Cuiwei Palace · 649"): ("Dying in Front", "취미궁"),
	("Royal Secretariat", "Surabol · autumn 649"): ("Buried Promises", "서라벌 가을"),
	("Royal Secretariat", "Surabol · 650"): ("Border Petition", "변방 청원"),
	("Royal Secretariat", "The Harmony Council · 651"): ("New Year Bow", "화백 원단"),
	("Royal Secretariat", "The Harmony Council · the next spring"): ("Not About Rice", "쌀이 아닌 법"),
	("Royal Secretariat", "The side hall · that night"): ("Oldest Box", "곁채의 상자"),
	("Royal Secretariat", "Surabol · the spring of the heir"): ("On a Roll", "후계의 봄"),
	("Royal Secretariat", "The side hall · the same afternoon"): ("He Walks Back", "다시 곁채"),
	("Royal Secretariat", "The House by the Stream · that night"): ("Shared Bed", "개울가 집"),
	("Bihyung", "The palace · the Cloud King’s last night"): ("Cloud King's Night", "구름왕의 마지막 밤"),
	("Bihyung", "The eastern hills · the Cloud King’s tomb"): ("The Tomb Hill", "구름왕의 무덤"),
	("Bihyung", "The Harmony Council · three days later"): ("Six Sleeves", "화백 사흘"),
	("Bihyung", "The Moon Palace · the wine years"): ("Wine Years", "술의 해들"),
	("Bihyung", "The throne hall · after midnight"): ("Boy on the Throne", "자정의 정전"),
	("Bihyung", "Saryang ward · the king’s summons"): ("Peach Blossom", "사량부"),
	("Bihyung", "The Harmony Council · the night drum"): ("Night Drum", "밤의 북"),
	("Bihyung", "The Moon Palace · before dawn"): ("Somebody Carries Him", "동트기 전"),
	("Bihyung", "The throne hall · three days later"): ("Brought Back", "정전 사흘"),
	("Bihyung", "The walled house · autumn"): ("Sado Comes Once", "담 높은 집"),
	("Bihyung", "Saryang ward · the tenth night"): ("Tenth Night", "열흘째 밤"),
	("Bihyung", "Prince Suulbu’s house · supper"): ("Family Dinner", "수을부의 저녁상"),
	("Bihyung", "Saryang ward · the river bank at dusk"): ("River Bank", "해 질 녘 강둑"),
	("Bihyung", "The Moon Palace · the king’s small room"): ("King's Small Room", "임금의 작은 방"),
	("Bihyung", "The Moon Palace · the servants’ yard"): ("Servants' Yard", "하인 마당"),
	("Bihyung", "The Hwangchun reeds · a walk at night"): ("Hwangchun Reeds", "황천 갈대밭"),
	("Bihyung", "The palace · the west wall at night"): ("West Wall", "서쪽 담"),
	("Bihyung", "The king’s rooms · supper"): ("King's Supper", "왕의 저녁상"),
	("Bihyung", "The palace · the High Councillor’s visit"): ("High Councillor", "상대등의 방문"),
	("Bihyung", "The palace garden · the introduction"): ("The Introduction", "첫 대면"),
	("Bihyung", "The Sinwon temple ditch · night"): ("Sinwon Ditch", "신원사 도랑"),
	("Bihyung", "The Ghost Bridge · the next night"): ("Ghost Bridge", "귀교"),
	("Bihyung", "The palace · the ghost clerk"): ("Ghost Clerk", "귀신 집사"),
	("Bihyung", "The gate south of Heungnyun Temple · the morning it was empty"): ("Empty Gate", "흥륜사 남문"),
	("Bihyung", "The House by the Stream · spring"): ("House by the Stream", "개울가 집"),
	("Bihyung", "The palace stream · night"): ("Goblin's Whelp", "궁 개울"),
	("Bihyung", "The Hwarang yard gate · Class 59’s first morning"): ("Hwarang Yard", "화랑 연무장"),
	("Bihyung", "Surabol · Chunchu’s wedding"): ("Chunchu's Wedding", "춘추의 혼례"),
	("Bihyung", "The house by the stream · the years after"): ("Years After", "개울가 그 뒤"),
	("Bihyung", "The reeds · night"): ("Last Verse", "갈대밭"),
	("Kim Yongsu", "The bluff over the river · the night of the lotuses"): ("Paper Lotuses", "연등 밤"),
	("Kim Yongsu", "The house by the stream · a night when Chunchu was seven"): ("Age Seven", "일곱 살이던 밤"),
	("Kim Yongsu", "The palace · the Cloud King’s last night"): ("Cloud King's Night", "구름왕의 마지막 밤"),
	("Kim Yongsu", "The eastern hills · the Cloud King’s tomb"): ("The Tomb Hill", "구름왕의 무덤"),
	("Kim Yongsu", "The Harmony Council · three days later"): ("Six Old Men", "화백 사흘"),
	("Kim Yongsu", "The Moon Palace · the wine years"): ("Wine Years", "술의 해들"),
	("Kim Yongsu", "The Moon Palace · a feast that does not end"): ("Feast That Does Not End", "끝나지 않는 잔치"),
	("Kim Yongsu", "Saryang ward · the morning after"): ("Barefoot King", "사량부 아침"),
	("Kim Yongsu", "The Harmony Council · a match"): ("A Match", "혼담"),
	("Kim Yongsu", "The palace outskirts · the side well"): ("Side Well", "곁우물"),
	("Kim Yongsu", "The throne hall · after midnight"): ("Boy on the Throne", "자정의 정전"),
	("Kim Yongsu", "Saryang ward · the king’s summons"): ("Peach Blossom", "사량부"),
	("Kim Yongsu", "The Harmony Council · the night drum"): ("Night Drum", "밤의 북"),
	("Kim Yongsu", "The Moon Palace · before dawn"): ("Forty Guards", "동트기 전"),
	("Kim Yongsu", "The throne hall · three days later"): ("Nephew Crowned", "정전 사흘"),
	("Kim Yongsu", "The walled house · autumn"): ("Before Frost", "담 높은 집"),
	("Kim Yongsu", "Saryang ward · the tenth night"): ("Tenth Night", "열흘째 밤"),
	("Kim Yongsu", "Saryang ward · the birth"): ("The Birth", "해산"),
	("Kim Yongsu", "The edge of Surabol · the charcoal road"): ("Charcoal Road", "숯 길"),
	("Kim Yongsu", "Saryang ward · the charcoal hut"): ("Charcoal Hut", "숯 오두막"),
	("Kim Yongsu", "The Moon Palace · the king’s small room"): ("King's Small Room", "임금의 작은 방"),
	("Kim Yongsu", "The Moon Palace · the servants’ yard"): ("Servants' Yard", "하인 마당"),
	("Kim Yongsu", "The servants’ yard · a prince in the shade"): ("Prince in the Shade", "그늘의 왕자"),
	("Kim Yongsu", "The king’s small room · baduk"): ("Baduk", "바둑"),
	("Kim Yongsu", "The palace roof · the night of the plum wine"): ("Plum Wine Roof", "매실주 지붕"),
	("Kim Yongsu", "The Hwangchun reeds · a walk at night"): ("Hwangchun Reeds", "황천 갈대밭"),
	("Kim Yongsu", "Under the west wall · the Ghost Children"): ("Ghost Children", "귀자"),
	("Kim Yongsu", "The Harmony Council · a number"): ("A Number", "숫자 하나"),
	("Kim Yongsu", "The king’s rooms · supper"): ("King's Supper", "왕의 저녁상"),
	("Kim Yongsu", "The palace · the High Councillor’s visit"): ("High Councillor", "상대등의 방문"),
	("Kim Yongsu", "The palace garden · the introduction"): ("The Introduction", "첫 대면"),
	("Kim Yongsu", "The princesses’ room · that night"): ("She Cries", "공주들 방"),
	("Kim Yongsu", "The Sinwon temple ditch · night"): ("Sinwon Ditch", "신원사 도랑"),
	("Kim Yongsu", "The Sinwon ditch · the night of the bridge"): ("Building the Bridge", "다리 놓던 밤"),
	("Kim Yongsu", "The Ghost Bridge · the next night"): ("Ghost Bridge", "귀교"),
	("Kim Yongsu", "Under the west wall · the night the princess followed"): ("She Followed", "공주가 뒤따라온 밤"),
	("Kim Yongsu", "The storehouse · the night before the clerk"): ("Fox in a Basket", "창고"),
	("Kim Yongsu", "The east corridor · after the High Councillor"): ("East Corridor", "동쪽 회랑"),
	("Kim Yongsu", "The Harmony Council · the cellar"): ("The Cellar", "지하 옥"),
	("Kim Yongsu", "The gate south of Heungnyun temple · that night"): ("Gildal Leaves", "흥륜사 남문"),
	("Kim Yongsu", "The throne hall · the next morning"): ("Something Cleverer", "정전 아침"),
	("Kim Yongsu", "The south road · the reeds at dawn"): ("Forty Riders", "새벽 갈대밭"),
	("Kim Yongsu", "Surabol · the ride"): ("The Ride", "말 달리기"),
	("Kim Yongsu", "The king’s small room · that same morning"): ("He Starts Anyway", "그날 아침"),
	("Kim Yongsu", "The House by the Stream · spring"): ("House by the Stream", "개울가 집"),
	("Kim Yongsu", "The palace stream · night"): ("Goblin's Whelp", "궁 개울"),
	("Kim Yongsu", "The palace yard · the winter Chunchu was eleven"): ("Age Eleven", "열한 살 겨울"),
	("Kim Yongsu", "The Hwarang yard gate · Class 59’s first morning"): ("Hwarang Yard", "화랑 연무장"),
	("Kim Yongsu", "Surabol · Chunchu’s wedding"): ("Chunchu's Wedding", "춘추의 혼례"),
	("Kim Yongsu", "The palace · the year of the crown"): ("Year of the Crown", "즉위하던 해"),
	("Kim Yongsu", "The hill above the reeds · the first spring of the restoration"): ("Proper Burial", "복권 첫 봄"),
	("Kim Yongsu", "Hwangnyong Temple · the tower yard"): ("Nine Storeys", "황룡사 탑"),
	("Kim Yongsu", "The hill west of the stream · the burial"): ("One Mound", "개울 서쪽 언덕"),
	("Kim Yongsu", "Prince Biryun’s hall · a winter lamp"): ("Winter Lamp", "비륜의 겨울 등"),
	("King Muyeol", "The Moon Palace · the last of the Sacred Bone"): ("Last Sacred Bone", "마지막 성골"),
	("King Muyeol", "The Moon Palace · the morning of the crown"): ("Morning of the Crown", "즉위하는 아침"),
	("King Muyeol", "The Ghost Bridge · the same hour"): ("Ghost Bridge", "귀교"),
	("King Muyeol", "The throne hall · the crown"): ("The Crown", "정전의 관"),
	("Jahee", "The Moon Palace · the new king’s first council"): ("First Council", "새 임금의 첫 회의"),
	("Jahee", "The Quay, Again"): ("The Quay Again", "다시, 포구"),
	("Gyebek", "The yard · ten thousand"): ("Ten Thousand", "만"),
	("Hwangsan Field", "The Fifth Clash · The Final Stand"): ("Final Stand", "최후의 항전"),
	("Hwangsan Field", "Gumdol Fortress · that night"): ("Gumdol Night", "금돌성"),
	("Yeon Namgun", "Gungnae · Summer"): ("Old Capital", "국내성 여름"),
	("Talhae", "Dapana, a thousand li beyond the East"): ("A Thousand Li", "다파나"),
	("Talhae", "Geumgwan · the yards"): ("Charcoal Yards", "쇠 마당"),
	("Talhae", "Surabol · 57"): ("Brother-in-Law", "서라벌"),
	("Alji", "The Moon Palace · Talhae’s ninth spring"): ("Gold Box", "탈해 아홉 해 봄"),
	("Alji", "Gyerim · ten springs later"): ("Ten Springs", "계림"),
	("Alji", "The Moon Palace · Talhae’s last winter"): ("Last Winter", "탈해의 마지막 겨울"),
	("Alji", "The elders’ floor · that same winter"): ("Elders' Floor", "어른들의 마루"),
	("Alji", "Surabol · 262"): ("No Son", "서라벌"),
}


def fallback_title(label: str, ko: str) -> tuple[str, str] | None:
	"""Shorten leftover place crumbs the map missed."""
	if "·" not in label and "," not in label:
		return None
	# take the last meaningful clause
	part = label.split("·")[-1].strip() if "·" in label else label.split(",")[-1].strip()
	# drop years
	words = [w for w in part.replace(",", " ").split() if not w.isdigit() and w not in {"AD", "CE"}]
	if not words:
		return None
	# drop leading 'the' / 'that' / seasons-only if very long
	cut = " ".join(words)
	if len(cut) > 28:
		cut = " ".join(words[:3])
	# title case but keep small words
	small = {"a", "the", "of", "at", "on", "in", "by"}
	titled = " ".join(w if w.lower() in small and i else w[:1].upper() + w[1:] for i, w in enumerate(cut.split()))
	k = ko.split("·")[-1].strip() if ko and "·" in ko else (ko.split(",")[-1].strip() if ko and "," in ko else ko)
	return titled, k or titled


def retitle_all(story):
	n = 0
	missed = []
	used_fallback = 0
	# Handle duplicate keys like two "Ansi · that winter" — apply in order per episode
	seen: dict[tuple[str, str], int] = {}
	for ch in story:
		for e in ch.get("entries") or []:
			title = e.get("title") or ""
			if title == "Seohyun":
				continue  # already done
			for b in e.get("blocks") or []:
				if b.get("kind") != "scene":
					continue
				lab = b.get("label") or ""
				key = (title, lab)
				if key in TITLES:
					en, ko = TITLES[key]
					# second Ansi winter etc: if already applied this exact pair once, still ok (same title)
					b["label"], b["ko"] = en, ko
					n += 1
				else:
					fb = fallback_title(lab, b.get("ko") or "")
					if fb:
						b["label"], b["ko"] = fb
						used_fallback += 1
						n += 1
					elif ("," in lab or "·" in lab) and len(lab) >= 28:
						missed.append((title, lab))
	return n, used_fallback, missed


def main():
	story = json.loads(STORY.read_text())
	entry = find_entry(story)
	rewrite_seohyun(entry)
	n, fb, missed = retitle_all(story)
	STORY.write_text(json.dumps(story, ensure_ascii=False, indent="\t") + "\n")
	print("seohyun blocks", len(entry["blocks"]))
	print("retitled", n, "fallback", fb, "missed", len(missed))
	for m in missed[:40]:
		print("  MISS", m)
	# print seohyun outline
	print("\n--- Seohyun outline ---")
	sec = None
	for x in entry["blocks"]:
		k = x.get("kind")
		if k == "section":
			sec = x["label"]
			print(f"\n# {sec}")
		elif k == "story":
			print(f"  STORY {x['label']}")
		elif k == "scene":
			print(f"  · {x['label']} / {x.get('ko')}")


if __name__ == "__main__":
	main()
