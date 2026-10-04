"""Manga action-frame pass on Gyebek's general-killer: canon note + slot manifest (retakes + new frames)."""
import json

CANON = 'src/lib/data/visual-canon.json'
OUT = 'scripts/.cache/gyebek-manga-manifest.json'
MANGA = open('scripts/.cache/manga-action.txt').read().strip()
CROP = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.'
NOTE = ' Stills of the move are manga action frames: speed lines, focus lines, extreme foreshortening, an impact flash at the cut.'

canon = json.load(open(CANON))
g = canon['characters']['gyebek']
if 'manga action frames' not in g['fighting']:
    g['fighting'] += NOTE
    json.dump(canon, open(CANON, 'w'), ensure_ascii=False, indent='\t')
    open(CANON, 'a').write('\n')

SIG = {'year': 648, 'battle': True, 'mounted': True, 'with': ['flag:silla']}
SILLA = 'a Silla general in grey steel lamellar with a tall cone-shaped jonghyeongju helm and blue cloth at the collar, on a chestnut horse'
E = 'Gyebek’s Exile'

FRAMES = [
    ('gyebek-sig-eye', 'gyebek-sig-ridge', 'He leaves the line to other men',
     'Manga focus-line close-up: Gyebek’s narrowed eyes just above Gomanari’s streaming black mane, the far Silla banners tiny in one pupil-bright gap',
     'Extreme close-up, hard dutch tilt: Gyebek’s eyes and the bridge of his nose just above the rim of his rounded steel helm and the streaming black mane of Gomanari, eyes narrowed to blades, fixed on a target off frame. Radial ink focus lines converge on his eyes from every edge; the mane whips across the lower frame in motion smears. Far behind, out of focus, tiny blue Silla banners on a rise. One low gold shaft cuts across his eyes; the rest heavy black ink.'),
    ('gyebek-sig-hooves', 'gyebek-sig-eye', 'the fastest thing on four legs in Samhan',
     'Worm’s-eye from the dirt: Gomanari’s hooves and belly fly over the lens in a blast of speed lines and flung clods',
     'Worm’s-eye from inside the dirt, the lens on the ground: the jet-black horse Gomanari leaps straight over the camera at full gallop, extreme foreshortening, the two front hooves huge and smeared with motion right at the lens, the belly and girth overhead, Gyebek a low crouched silhouette at the top of the frame with the straight blade trailing back. Clods of earth and stubble burst toward the lens as ink splatter; bold speed lines rake diagonally across the whole frame. Storm sky with one gold break behind the horse.'),
    ('gyebek-sig-tuck', 'gyebek-sig-hooves', 'rides him flat along the neck like a thrown knife',
     'Manga speed-line frame from low in front: Gyebek folded flat along Gomanari’s neck, the reverse-gripped straight blade trailing back, the whole frame streaking',
     'Low front three-quarter, almost head-on, hard dutch tilt: Gyebek folded flat along Gomanari’s neck like a thrown knife, chest on the mane, the horse’s head and pinned ears huge and foreshortened toward the lens, nostrils flared. His right fist on the neck in reverse grip, the small ring forward above his thumb, the ruler-straight blade trailing back along his forearm and the horse’s flank. Horizontal ink speed lines streak past on every side; the mane and his crimson scarf smear backward; flung dirt splatters. One low gold sun break rakes the steel plates and the straight blade.'),
    ('gyebek-sig-turn', 'gyebek-sig-tuck', 'starts to turn his horse',
     'Over the Silla general’s shoulder, dutch and foreshortened: the black horse bursts out of the dust at him inside a ring of focus lines',
     f'Over-the-shoulder from behind {SILLA}, hard dutch tilt: his cone helm and blue collar dark in the left foreground, his gauntlet yanking the rein as the chestnut twists. Bursting out of gold dust straight at the lens, extremely foreshortened, Gyebek low on the black Gomanari, the horse’s head and chest enormous, Gyebek’s fierce eyes just above the mane. Radial ink focus lines converge on Gyebek; dust explodes outward as ink splatter.'),
    ('gyebek-sig-impact', 'gyebek-sig-turn', 'does not finish turning',
     'Impact frame: the two riders cross as white silhouettes cut out of black, one gold line of the blade between them',
     'Manga IMPACT FRAME at the instant of the cut: near-monochrome inverted flash, the two riders crossing side-on as stark white silhouettes cut out of solid black ink — Gyebek low on the black horse on the left, already past, arm snapped out; the Silla general and his rearing horse on the right. ONE gold accent: the single thin line of the straight blade’s path between them. Radial burst lines explode from the point of the cut; ink splatter. No blood, no gore, no severed body.'),
    ('gyebek-sig-cut', 'gyebek-sig-impact', 'One cut on the pass.',
     'From below, dutch: Gyebek whips through the backhand cut at full gallop, a bright arc and a spinning cone helm overhead, speed lines everywhere',
     f'Low worm’s-eye from beside the hooves, hard dutch tilt, as the horses cross: Gyebek on the black Gomanari whips his right arm out behind him in a backhand reverse-grip cut, the ruler-straight ring-pommel blade a bright smear, a thin gold crescent of light hanging in its path. Above and behind him {SILLA} is thrown back, his tall cone helm with its blue plume spinning away into the storm sky. Speed lines streak with the gallop; the helm trails motion lines. No blood, no gore.'),
    ('gyebek-sig-flick', 'gyebek-sig-cut', 'By the time the escort draws',
     'From behind and below: Gyebek, already gone, flicks the blade clean out to the side as the escort behind him only now reaches for their swords',
     'Low angle from behind Gyebek as Gomanari gallops away from the lens, hard dutch: in the sharp foreground his back, the black horse’s haunches and streaming tail, his right arm flicking the straight ring-pommel blade clean out to the side, a spray of ink droplets flung off the steel. Far behind, small and frozen, four Silla escorts in grey lamellar only now reaching for their swords, a riderless chestnut beside them. Speed lines pull toward the horizon; dust smears.'),
]

items = []
for sid, after, at, alt, scene in FRAMES:
    items.append({'id': sid, 'entry': E, 'after': after, 'tone': '#d9b13a', 'at': at, 'alt': alt,
                  'people': ['gyebek'] if 'impact' not in sid else [], 'canon': SIG if 'impact' not in sid else {'year': 648, 'with': ['flag:silla']},
                  'scene': f'{scene} {MANGA} {CROP}'})
json.dump(items, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(items), '->', OUT)
