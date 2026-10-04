import json

CANON = 'src/lib/data/visual-canon.json'

PEOPLE = {
    'talhae': {
        'look': 'Very tall (nine cheok), long-limbed and sea-weathered, tanned, broad easy grin, sly narrow eyes; black hair in a loose topknot with salt-stiff strands; clean-shaven as a young man, a short grey beard when he is old and king.',
        'dress': 'Young: plain undyed hemp jeogori and trousers, sleeves rolled, a fisherman’s cord belt. King: deep sea-green silk robe with a gold-ringed belt and a low gold diadem.',
        'demeanor': 'A con man who became a king and never stopped enjoying the joke. Deadpan when caught, delighted when he wins.',
    },
    'hogong': {
        'look': 'Small, wiry old man from Wa, bald crown with a grey fringe tied back, thin white beard, quick indignant eyes.',
        'dress': 'Faded indigo minister’s robe; a dried calabash gourd always tied at his waist on a cord.',
        'demeanor': 'Perpetually outraged and perpetually loyal; the straight man to Talhae’s joke for forty years.',
    },
    'alji': {
        'look': 'A small boy of about four, round solemn face, bright wide-awake black eyes, short black hair tied in a tiny tuft.',
        'dress': 'Wrapped in a little white silk cloth with a thin gold thread edge.',
        'demeanor': 'Unafraid; looks at kings as if they were the strange ones.',
    },
    'manmyung': {
        'look': 'Young Sacred-Bone noblewoman, oval face, strong dark brows, amused knowing eyes, a stubborn chin; long black hair in a low coiled chignon with a plain gold pin.',
        'dress': 'Rich plum-violet silk chima with a pale ivory jeogori and a deep plum ribbon; good silk she will ruin in the rain.',
        'demeanor': 'Teasing, decisive, braver than the men around her; she makes the decisions and lets Seohyeon think he did.',
    },
}

canon = json.load(open(CANON))
chars = canon['characters']
for pid, facts in PEOPLE.items():
    chars.setdefault(pid, {}).update(facts)
json.dump(canon, open(CANON, 'w'), ensure_ascii=False, indent='\t')
open(CANON, 'a').write('\n')
print('canon:', ', '.join(PEOPLE))
