import json

PATH = 'src/lib/data/story.json'
TITLE = 'Heaven–Earth King'

TAIL = (
    'Figures in confident calligraphic brush line; faces match the attached portraits, translated into a few ink strokes. '
    'Not photoreal, not webtoon shading, not watercolor, not oil, no glow, no halo. Composed for a 2:1 letterbox crop; nothing '
    'important at the top or bottom edge. No text, no calligraphy, no seal stamp, no watermark.'
)
LIVING = (
    'STRIKING INK PAINTING, the living world: Joseon sumi ink on raw paper with EXTREME LIGHT AGAINST DARK. Huge saturated masses '
    'of black ink against blinding bare paper; light is always the unpainted paper, never painted white; almost no mid-grey; hard '
    'edges where light meets dark, wet bleeding edges elsewhere. Splashed ink (발묵), dry-brush flying white, spatter. One graphic '
    'device, monumental emptiness. {accent} ' + TAIL
)
DEAD = (
    'STRIKING INVERTED INK, the realm of the dead: silver-white ink and chalky white brush on black indigo-dyed paper. Here the '
    'paper is the dark and the brush lays down the light: every figure, cord and edge is drawn in thin luminous silver line and dry '
    'white brush on near-black indigo; vast empty dark; almost no mid-tone; no writing or script anywhere on the dark paper. '
    '{accent} ' + TAIL
)
SPLIT = (
    'STRIKING SPLIT INK: one half of the frame is the living world, black sumi ink on blinding bare paper; the other half is the realm '
    'of the dead, silver-white line on black indigo-dyed paper. The seam between the two papers is a hard straight line. Almost no '
    'mid-grey; no writing or script anywhere on the dark paper. {accent} ' + TAIL
)
RED = 'The only colour is one cinnabar wash.'
BLUE = 'The only colour is one indigo wash.'
ORANGE = 'The only colour is one orange wash in the firelight.'
NONE = 'No colour at all.'

HEK = '/ch_heaven_earth_king.png'
BIG_Y, LIT_Y = '/ch_big_star_young.png', '/ch_little_star_young.png'
BIG, LIT = '/ch_big_star.png', '/ch_little_star.png'
GYEBEK, YURIDORA = '/ch_gyebek.png', '/ch_yuri_dora.png'


def slot(id, tone, at, alt, people, refs, scene, style, accent):
    return {'id': id, 'ratio': 2, 'tone': tone, 'at': at, 'alt': alt, 'people': people, 'refs': refs,
            'prompt': scene + ' ' + style.format(accent=accent)}


NEW = [
    slot('hek-ink-frame', '#f97316', 'Yuri Dora has a fire going',
         'Ink: Gyebek stands black in the doorway; Yuri Dora sits with her back to us at a small fire',
         ['gyebek', 'yuridora'], [GYEBEK, YURIDORA],
         'Low over-the-shoulder from behind Yuri Dora, seated on the floor, her back and loose hair a dark ink mass in the foreground. Before her a small fire is the only bare paper in the room, two cups beside it. Across the black room, framed in a narrow doorway, Gyebek stands, arms folded, refusing to come in; the firelight catches only his scowl and the crimson scarf at his chest.',
         LIVING, ORANGE),
    slot('hek-ink-doorway', '#C30000', 'the poorest house on the road',
         'Ink: two moons over a road at night; a tall stranger stops at the poorest hut',
         ['heavenearthking'], [HEK],
         'Wide, night. Black ink sky with TWO moons as bare paper discs, one low and one high. A road of dry-brush runs diagonally; at its end a tiny sagging thatched hut with a dark, fireless doorway. Heaven–Earth King has stopped at the gate, tall, his long shadow doubled by the two moons into two shadows that cross the road. Cold, quiet.',
         LIVING, RED),
    slot('hek-ink-noon', '#8a7a3a', 'goes black at noon',
         'Ink: at noon the sky lowers like a lid over nine storehouses; the king’s face forms in the cloud',
         ['heavenearthking'], [HEK],
         'Worm’s-eye from the yard. Nine storehouse roofs as black wedges marching into depth. Above them the sky comes down at noon as one enormous mass of splashed black ink, and inside it, made only of the cloud’s bleeding edges, the face of Heaven–Earth King looks down, eyes as two narrow slits of bare paper. In the bare-paper yard below, a fat rich man, tiny, looks up, his counting hand frozen; a horse rears away; a dog flattens itself under the porch.',
         LIVING, NONE),
    slot('hek-ink-yard', '#111111', 'whose sons they are in every yard',
         'Ink: two small boys in a yard under two suns, each boy casting two shadows, village children pointing',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Bird’s-eye straight down into a bare-paper village yard at noon under TWO suns. Two small boys, about eight, stand close together in the centre; the elder holds the younger’s sleeve, the younger glares out. Each boy casts TWO hard black shadows in two directions. Around the edge of the frame, a ring of other children’s shadows only, pointing in. Hard, cruel light.',
         LIVING, RED),
    slot('hek-ink-teeth', '#C30000', 'The teeth close.',
         'Ink: two comb halves meet in a huge hand; fifteen years close in one seam',
         ['heavenearthking', 'daebyeol'], [HEK, BIG_Y],
         'Extreme close-up at the top of the vine, above the clouds. A huge, open palm of Heaven–Earth King fills the frame, his cinnabar sleeve at one edge. In it, two halves of a wooden comb slide together, teeth interlocking; the broken line where they meet is the one hard bright seam of bare paper. At the far edge, a fifteen-year-old boy’s fingers are just letting go. Clouds below as wet grey bleed.',
         LIVING, RED),
    slot('hek-ink-forge', '#C30000', 'a thousand geun of iron melted down',
         'Ink: molten iron pours white into bow moulds; the twins lit from below',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Low wide in a black forge at the edge of the sky. A giant crucible tips, and molten iron pours as a thick blinding stream of bare paper into two long bow-shaped moulds in the floor. Black smoke billows in splashed ink. The twins, fifteen, stand on either side of the moulds, faces lit from below by the white iron, the elder grave, the younger grinning with heat on his cheeks.',
         LIVING, RED),
    slot('hek-ink-moon', '#C94040', 'At midnight Sobyeol draws',
         'Ink: Little Star at full draw, silhouetted against one moon while the other cracks',
         ['sobyeol'], [LIT_Y],
         'Contre-jour at midnight. A vast black ink sky. One moon, huge, low behind Little Star as a perfect bare-paper disc, so that he stands as a sharp black silhouette at full draw of a heavy iron bow, only the cinnabar of his hair and the edge of his grin catching. High in the upper corner the second moon is already cracking into white shards drifting west.',
         LIVING, RED),
    slot('hek-ink-riddle', '#3B6FBF', 'Daebyeol proposes riddles',
         'Ink: the brothers sit on either side of a bamboo grove; one cut stalk shows its hollow',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Wide. A row of black bamboo stalks stands like vertical bars across the bare paper, dividing the frame. Big Star sits cross-legged on the left, calm, one finger raised. Little Star sits on the right, arms crossed, scowling. In the centre one stalk is cut clean, and its cross-section is a ring of black around a hollow of bare white. Bamboo leaves in fast calligraphic strokes.',
         LIVING, BLUE),
    slot('hek-ink-seeds', '#C30000', 'drops two flower seeds between them',
         'Ink: from the top of the frame a huge hand drops two seeds toward two tiny brothers',
         ['heavenearthking', 'daebyeol', 'sobyeol'], [HEK, BIG_Y, LIT_Y],
         'Vertical drop composition. At the top edge, Heaven–Earth King’s huge hand and cinnabar sleeve, lazily open, reaching down out of a white cloud bank. Two seeds fall as two tiny black points down a long empty field of bare paper. At the very bottom, tiny, the two brothers look up between two empty silver basins.',
         LIVING, RED),
    slot('hek-ink-walk', '#3B6FBF', 'already walking toward the dark edge',
         'Ink split: Big Star walks off the white paper into the black; Little Star reaches after him',
         ['daebyeol', 'sobyeol'], [BIG_Y, LIT_Y],
         'Wide profile. The frame is split vertically: left side the living world in black ink on bare paper, right side the dead realm, silver line on black indigo paper. Big Star is mid-stride across the seam, half his body already drawn in silver on black, back straight, not turning. On the white side Little Star, small, half-rises from his knees with one hand out, the open flower in its silver basin beside him.',
         SPLIT, BLUE),
    slot('hek-ink-haunted', '#111111', 'a ghost answers too',
         'Ink: at dusk a mother calls at the gate; two identical sons answer on the road, one of them a ghost',
         [], [],
         'Low wide at dusk. A village gate, a mother small at it, hand cupped to her mouth calling. On the road toward her walk two young men in identical clothes, side by side, same height, same stride: one solid black ink, the other drawn in white on a patch of black indigo, a ghost. Along the road the knots in the tree trunks have become open mouths, and a crow on the gatepost has its beak open mid-word. Nobody can tell which is which.',
         SPLIT, NONE),
    slot('hek-ink-pine', '#3B6FBF', 'pine-bark powder',
         'Ink: Big Star scatters pine-bark powder over the world and the trees fall silent',
         ['daebyeol'], [BIG],
         'High above the world, grown Big Star stands on a cloud edge and flings his arm in a wide arc; from his sleeve a vast curtain of pine-bark powder drifts down as grey dry-brush over a tiny bare-paper world of trees, birds and cattle. Where the powder lands, the open mouths in the tree bark close into knots. His sleeve and his figure are drawn in silver on a ragged patch of black indigo paper torn into the white sky: the dead realm visiting the living.',
         SPLIT, BLUE),
    slot('hek-ink-embers', '#d9b13a', 'The fire has gone low.',
         'Ink: Gyebek sits by the dying fire, face lit from below, not looking up',
         ['gyebek'], [GYEBEK],
         'Extreme close-up, worm’s-eye from the floor beside the embers. Gyebek has sat down at last, elbows on his knees; the low fire is the only bare paper, lighting the underside of his jaw and his downcast eyes. Everything else is black ink. In the foreground, out of focus, an untouched cup and a few grains of rice spilled on the dark floor, each grain a point of white.',
         LIVING, ORANGE),
]

RETAKE = {
    'hek-ink-measure': (
        'Worm’s-eye from the floor of a black storehouse, looking up past a square wooden rice measure held at chest height. The rice pours into it as bare paper; from inside the rich man’s sleeve a thin thread of sand slides in with it, the brightest line in the frame. Above, his heavy body is a black mass and his face is lost in shadow except one crescent of white grin. Through a crack in the storehouse door, a tiny white slit, a girl waits with her head down.',
        LIVING, NONE),
    'hek-ink-scale': (
        'Monumental, the realm of the dead. A single silver cord drops from the top of the frame and holds a huge steelyard scale, its beam a hard silver horizontal across the black indigo paper. Grown Big Star stands beneath it, seen from a low three-quarter angle, one hand setting the weight on the beam, eyes level. On one pan stands a tiny silver soul, weightless; the pan does not go down. Behind, a long line of silver-line souls fades into the indigo dark. At the very edge of the frame, a ragged tear of bare white paper shows the living world, where grown Little Star watches, small, the only black ink figure.',
        DEAD, BLUE),
}

story = json.load(open(PATH))
entry = next(e for ch in story for e in (ch.get('entries') or []) if e.get('title') == TITLE)
text = json.dumps(entry['blocks'], ensure_ascii=False)
for s in NEW:
    assert s['at'] in text, s['id'] + ': ' + s['at']

images = [im for im in entry['images'] if im['id'] not in {s['id'] for s in NEW}]
for im in images:
    if im['id'] in RETAKE:
        scene, style, accent = RETAKE[im['id']]
        im['prompt'] = scene + ' ' + style.format(accent=accent)

posters = [im for im in images if not im['id'].startswith('hek-ink-')]
ink = [im for im in images if im['id'].startswith('hek-ink-')] + NEW
ink.sort(key=lambda im: text.index(im['at']))
entry['images'] = posters + ink

json.dump(story, open(PATH, 'w'), ensure_ascii=False, indent='\t')
open(PATH, 'a').write('\n')

todo = NEW + [im for im in ink if im['id'] in RETAKE]
json.dump([{'id': s['id'], 'alt': s['alt'], 'prompt': s['prompt'], 'ratio': 2} for s in todo],
          open('scripts/.cache/hek-ink-more-manifest.json', 'w'), ensure_ascii=False, indent=2)

for im in ink:
    print(im['id'], '|', im['at'])
