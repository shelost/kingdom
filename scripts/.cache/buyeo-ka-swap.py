"""Swap Jolbon's four non-crow tribes for the attested Buyeo ka (Sanguozhi, Wei shu 30):
tiger→cow (牛加), boar→pig (豬加), wolf→dog (狗加), bear→horse (馬加). Crow stays."""
import os, re, subprocess

ROOT = '/Users/heewon/Documents/GitHub/kingdom'

def edit(rel, pairs):
	path = os.path.join(ROOT, rel)
	src = open(path, encoding='utf-8').read()
	for old, new in pairs:
		n = src.count(old)
		assert n >= 1, f'{rel}: not found: {old[:80]}'
		src = src.replace(old, new)
	tmp = path + '.tmp'
	with open(tmp, 'w', encoding='utf-8') as f:
		f.write(src)
		f.flush(); os.fsync(f.fileno())
	os.replace(tmp, path)

IDS = [('tigerchief', 'cowchief'), ('boarchief', 'pigchief'), ('wolfchief', 'dogchief'), ('bearchief', 'horsechief')]
FILES = [('ch_tiger_chief', 'ch_cow_chief'), ('ch_boar_chief', 'ch_pig_chief'), ('ch_wolf_chief', 'ch_dog_chief'), ('ch_bear_chief', 'ch_horse_chief')]

PEOPLE_CHIEFS = [
	# Tiger → Cow (west)
	("""		name: 'Tiger Chief',
		korean: '호랑이 족장',
		kingdom: 'jolbon',
		title: 'Tiger-clan chieftain of Jolbon',
		tagline: 'Youngest of the four roofs that are not crow — arrives with a bow and a pelt still warm.',
		quote: 'Count your ditch. I’ll count the shot.',
		nature:
			'Proud hunter voice. Red headband, tiger pelt, bow already in the hand. Talks like a man who wants the first look and the last word. Not Tabal — the tiger roof, not the crow.',
		events: [{ label: 'Walks Tabal’s packed-earth yard for the first summit of the five tribes.' }],
		career: [{ title: 'Tiger-clan chieftain', korean: '족장', org: 'fivetribes', from: -37, note: 'Later the western commandery' }],
		aliases: ['Tiger Chief', '호랑이 족장', 'tiger chief']""",
	 """		name: 'Cow Ka',
		korean: '우가',
		hanja: '牛加',
		kingdom: 'jolbon',
		title: 'Cow-ka chieftain of Jolbon',
		tagline: 'Youngest of the four roofs that are not crow — keeps the herds, and still arrives with a bow in his hand.',
		quote: 'Count your ditch. I’ll count the shot.',
		nature:
			'Proud herdsman voice. Red headband, bow already in the hand; counts cattle the way the crow counts millet. Talks like a man who wants the first look and the last word. Not Tabal — the cow roof, not the crow.',
		events: [{ label: 'Walks Tabal’s packed-earth yard for the first summit of the five tribes.' }],
		career: [{ title: 'Cow ka', korean: '우가', hanja: '牛加', org: 'fivetribes', from: -37, note: 'Later the western commandery' }],
		aliases: ['Cow Ka', '우가', '牛加', 'cow ka', 'Ox Ka', 'cow chief']"""),
	# Boar → Pig (south)
	("""		name: 'Boar Chief',
		korean: '멧돼지 족장',
		kingdom: 'jolbon',
		title: 'Boar-clan chieftain of Jolbon',
		tagline: 'Heavy man, boar pelt, the roof that eats first and argues later.',
		quote: 'If the store is full I don’t care whose ditch it was.',
		nature:
			'Blunt, thick, practical. Talks in grain and meat. The boar pelt is not costume — it is the roof. Not Tabal’s crow, not the tiger’s pride.',
		events: [{ label: 'Sits the five-fire ring and votes Jumong king.' }],
		career: [{ title: 'Boar-clan chieftain', korean: '족장', org: 'fivetribes', from: -37, note: 'Later the southern commandery' }],
		aliases: ['Boar Chief', '멧돼지 족장', 'boar chief']""",
	 """		name: 'Pig Ka',
		korean: '저가',
		hanja: '豬加',
		kingdom: 'jolbon',
		title: 'Pig-ka chieftain of Jolbon',
		tagline: 'Heavy man, full pens, the roof that eats first and argues later.',
		quote: 'If the store is full I don’t care whose ditch it was.',
		nature:
			'Blunt, thick, practical. Talks in grain and meat. The pig pens are not a joke — they are the roof’s winter. Not Tabal’s crow, not the cow ka’s pride.',
		events: [{ label: 'Sits the five-fire ring and votes Jumong king.' }],
		career: [{ title: 'Pig ka', korean: '저가', hanja: '豬加', org: 'fivetribes', from: -37, note: 'Later the southern commandery' }],
		aliases: ['Pig Ka', '저가', '豬加', 'pig ka', 'pig chief']"""),
	# Wolf → Dog (north)
	("""		name: 'Wolf Chief',
		korean: '늑대 족장',
		kingdom: 'jolbon',
		title: 'Wolf-clan chieftain of Jolbon',
		tagline: 'White-fur eldest — counts winters, not miracles.',
		quote: 'I have held this yard longer than that boy has been dry.',
		nature:
			'Oldest of the four. White beard, white wolf pelt, grey headband. Seniority first. Yields in full sentences when he yields. Not Tabal.',
		events: [{ label: 'Oldest roof at the first summit; votes with the ring.' }],
		career: [{ title: 'Wolf-clan chieftain', korean: '족장', org: 'fivetribes', from: -37, note: 'Later the northern commandery' }],
		aliases: ['Wolf Chief', '늑대 족장', 'wolf chief']""",
	 """		name: 'Dog Ka',
		korean: '구가',
		hanja: '狗加',
		kingdom: 'jolbon',
		title: 'Dog-ka chieftain of Jolbon',
		tagline: 'White-fur eldest — counts winters, not miracles.',
		quote: 'I have held this yard longer than that boy has been dry.',
		nature:
			'Oldest of the four. White beard, white fur mantle, grey headband; his dogs reach the gate before he does. Seniority first. Yields in full sentences when he yields. Not Tabal.',
		events: [{ label: 'Oldest roof at the first summit; votes with the ring.' }],
		career: [{ title: 'Dog ka', korean: '구가', hanja: '狗加', org: 'fivetribes', from: -37, note: 'Later the northern commandery' }],
		aliases: ['Dog Ka', '구가', '狗加', 'dog ka', 'dog chief']"""),
	# Bear → Horse (central)
	("""		name: 'Bear Chief',
		korean: '곰 족장',
		kingdom: 'jolbon',
		title: 'Bear-clan chieftain of Jolbon',
		tagline: 'Two black-bear heads on the shoulders — few words, red sash, the heaviest roof.',
		quote: 'I came. That is the vote.',
		nature:
			'Heavy, few words. Black robe, red sash, two bear heads. Does not speechify. Sits, eats, nods. The bear roof, not the crow.',
		events: [{ label: 'Watches the vermilion cord from the bear fire.' }],
		career: [{ title: 'Bear-clan chieftain', korean: '족장', org: 'fivetribes', from: -37, note: 'Later the central commandery' }],
		aliases: ['Bear Chief', '곰 족장', 'bear chief']""",
	 """		name: 'Horse Ka',
		korean: '마가',
		hanja: '馬加',
		kingdom: 'jolbon',
		title: 'Horse-ka chieftain of Jolbon',
		tagline: 'First of the four ka — few words, red sash, the heaviest roof and the most horses.',
		quote: 'I came. That is the vote.',
		nature:
			'Heavy, few words. Black robe, red sash, horse-hair tassels at the shoulders. Does not speechify. Sits, eats, nods. The horse roof, not the crow.',
		events: [{ label: 'Watches the vermilion cord from the horse fire.' }],
		career: [{ title: 'Horse ka', korean: '마가', hanja: '馬加', org: 'fivetribes', from: -37, note: 'Later the central commandery' }],
		aliases: ['Horse Ka', '마가', '馬加', 'horse ka', 'horse chief']"""),
]

PEOPLE_REST = [
	("note: 'Sits the bear tribe’s central 부 as first sword'", "note: 'Sits the horse ka’s central 부 as first sword'"),
	("note: 'Wolf tribe’s northern 부'", "note: 'Dog ka’s northern 부'"),
	("note: 'Boar tribe’s southern 부'", "note: 'Pig ka’s southern 부'"),
	("note: 'Tiger tribe’s western 부'", "note: 'Cow ka’s western 부'"),
	("crow East, tiger West, boar South, wolf North, bear Central. They argue as Commanders (대가); the High Commander (막리지) is first sword — Yeon Gusesa sits the old bear chair;",
	 "crow East, cow West, pig South, dog North, horse Central. They argue as Commanders (대가) — the same 加 the four ka carried; the High Commander (막리지) is first sword — Yeon Gusesa sits the old horse chair;"),
	("tagline: 'Crow, tiger, boar, wolf, bear — the league that votes Jumong king, then becomes Goguryeo’s five commanderies.',",
	 "tagline: 'The crow and the four ka — horse, cow, pig, dog — the league that votes Jumong king, then becomes Goguryeo’s five commanderies.',"),
	("arc: 'Bear, tiger, crow, wolf, boar sit Tabal’s packed-earth ring",
	 "arc: 'Horse, cow, crow, dog, pig sit Tabal’s packed-earth ring"),
	("The animal names do not die; they are relabeled as the five 부.",
	 "The four ka are the Buyeo way of naming men after herds — 馬加, 牛加, 豬加, 狗加 in the Wei annals — and the crow is Jolbon’s own. The animal names do not die; they are relabeled as the five 부."),
	("Tiger → west (Go Heumsong), boar → south (Son Daeha), wolf → north (Go Ul), bear → central (the High Commander’s seat, Yeon Gusesa).",
	 "Cow → west (Go Heumsong), pig → south (Son Daeha), dog → north (Go Ul), horse → central (the High Commander’s seat, Yeon Gusesa)."),
	("{ id: 'tigerchief', role: 'Tiger · 서부', reportsTo: 'jumong' },", "{ id: 'tigerchief', role: 'Cow ka · 우가 · 서부', reportsTo: 'jumong' },"),
	("{ id: 'boarchief', role: 'Boar · 남부', reportsTo: 'jumong' },", "{ id: 'boarchief', role: 'Pig ka · 저가 · 남부', reportsTo: 'jumong' },"),
	("{ id: 'wolfchief', role: 'Wolf · 북부', reportsTo: 'jumong' },", "{ id: 'wolfchief', role: 'Dog ka · 구가 · 북부', reportsTo: 'jumong' },"),
	("{ id: 'bearchief', role: 'Bear · 중부', reportsTo: 'jumong' }", "{ id: 'bearchief', role: 'Horse ka · 마가 · 중부', reportsTo: 'jumong' }"),
	("			'Five Animal Tribes',\n			'five roofs'\n",
	 "			'Five Animal Tribes',\n			'five roofs',\n			'four ka',\n			'사가',\n			'四加'\n"),
	("Before Goryeo there is Jolbon: crow, tiger, boar, wolf, bear.", "Before Goryeo there is Jolbon: crow, horse, cow, pig, dog."),
	("Go Heumsong in the West (tiger), Son Daeha in the South (boar), Go Ul in the North (wolf), and Yeon Gusesa as High Commander on the bear’s central seat",
	 "Go Heumsong in the West (cow ka), Son Daeha in the South (pig ka), Go Ul in the North (dog ka), and Yeon Gusesa as High Commander on the horse ka’s central seat"),
]

WIKI = [
	("'Jolbon’s five animal roofs — crow, tiger, boar, wolf, bear — become Goguryeo’s five commanderies.",
	 "'Jolbon’s five animal roofs — the crow and the four ka: horse, cow, pig, dog — become Goguryeo’s five commanderies."),
	("ko: '졸본의 다섯 짐승 지붕이 오부가 된다.", "ko: '졸본의 다섯 짐승 지붕 — 까마귀와 마가·우가·저가·구가 — 이 오부가 된다."),
	("'Crow East, tiger West, boar South, wolf North, bear Central — the same five chairs the High Summit later names 부.'",
	 "'Crow East, cow ka West, pig ka South, dog ka North, horse ka Central — the same five chairs the High Summit later names 부.'"),
	("ko: '까마귀 동부, 호랑이 서부, 멧돼지 남부, 늑대 북부, 곰 중부 — 제가가 나중에 부라고 부르는 그 다섯 자리.'",
	 "ko: '까마귀 동부, 우가 서부, 저가 남부, 구가 북부, 마가 중부 — 제가가 나중에 부라고 부르는 그 다섯 자리.'"),
]

DIAGRAM = [
	("{ ko: '호랑이', en: 'West', id: 'tigerchief' },", "{ ko: '우가', en: 'West', id: 'tigerchief' },"),
	("{ ko: '멧돼지', en: 'South', id: 'boarchief' },", "{ ko: '저가', en: 'South', id: 'boarchief' },"),
	("{ ko: '늑대', en: 'North', id: 'wolfchief' },", "{ ko: '구가', en: 'North', id: 'wolfchief' },"),
	("{ ko: '곰', en: 'Central', id: 'bearchief' }", "{ ko: '마가', en: 'Central', id: 'bearchief' }"),
	("crow east, tiger west, boar south, wolf north, bear central", "crow east, cow ka west, pig ka south, dog ka north, horse ka central"),
]

edit('src/lib/people.ts', PEOPLE_CHIEFS + PEOPLE_REST + IDS + FILES)
edit('src/lib/components/diagrams/wikiCharts.ts', WIKI)
edit('src/lib/components/diagrams/FiveTribes.svelte', DIAGRAM + IDS)
edit('src/lib/movieSequences.ts', FILES)

for old, new in FILES:
	subprocess.run(['git', 'mv', f'static/{old}.png', f'static/{new}.png'], cwd=ROOT, check=True)

print('ok')
