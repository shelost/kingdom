import json

PATH = 'src/lib/data/story.json'
VECTOR = (
    'GEOMETRIC VECTOR POSTER. Flat hard-edged vector shapes, crisp straight edges and perfect arcs, no gradients, no brush texture, '
    'no outlines thicker than the shapes themselves. The cliff at Sanbang is built from tessellated HEXAGONS of columnar basalt. '
    'Limited palette: basalt black #1b1d1f, deep sea-green #2f5a52, rust iron-oxide #a4532f, cream #efe6d2, and her sea-green '
    '#8fb3a8 as the one accent. Bold negative space, Swiss/Saul Bass poster composition, one geometric device. Figures reduced to '
    'clean planes; her face simplified to a few flat shapes but recognisably the attached portrait (long dark hair, sea-green '
    'hanbok with white goreum). Not photoreal, not painterly, not ink, no glow. Composed for a 2:1 letterbox crop; nothing '
    'important at the top or bottom edge. No text, no watermark.'
)
SCENES = {
    'sanbang-seq-out': (
        'Wide. The whole right two-thirds is a wall of black basalt hexagons. One hexagon column near the centre has slid forward '
        'out of the wall, and from that gap she steps out onto cream ground, mid-stride, one foot still on the black, her sea-green '
        'chima a single flat triangle. On the left, small, a poor man in a rust-brown jacket stops with a bundle of firewood.'
    ),
    'sanbang-seq-hand': (
        'Close. Two hands meet in the exact centre of the frame: hers enters from the right, built of flat sea-green planes still '
        'faceted like a hexagon at the wrist; his from the left in warm rust and cream. Where the fingers interlock, the facets on her '
        'hand smooth into one soft cream plane. Background split into black hexagons on her side, plain cream on his.'
    ),
    'sanbang-seq-return': (
        'Wide profile. On the left, a black geometric official on a raised step, a tall rectangle of a hat, one arm pointing. On the '
        'cream ground in the middle, the poor man lies fallen as a flat rust shape. On the right, she walks into the hexagon wall, '
        'her back turned, half her body already black hexagons, the sea-green fading column by column.'
    ),
    'sanbang-seq-spring': (
        'Wide, empty. The black hexagon wall fills the frame, perfectly closed. At its foot, from between two hexagons, a single thin '
        'vertical stream of sea-green water runs down into a small cream semicircle of a pool. One hexagon at eye height is very '
        'faintly sea-green, the only trace of her. Nobody in frame.'
    ),
}

story = json.load(open(PATH))
entry = next(e for ch in story for e in (ch.get('entries') or []) if e.get('title') == 'Sanbangduk')
items = []
for im in entry['images']:
    if im['id'] in SCENES:
        im['prompt'] = SCENES[im['id']] + ' ' + VECTOR
        im['alt'] = 'Vector: ' + im['alt'].split(': ', 1)[-1]
        items.append({'id': im['id'], 'alt': im['alt'], 'prompt': im['prompt'], 'ratio': 2})
json.dump(story, open(PATH, 'w'), ensure_ascii=False, indent='\t')
open(PATH, 'a').write('\n')
json.dump(items, open('scripts/.cache/sanbang-vector-manifest.json', 'w'), ensure_ascii=False, indent=2)

seq = 'src/lib/movieSequences.ts'
src = open(seq).read()
start = src.index("id: 'sanbang-fresco'")
end = src.index('shots:', start)
block = src[start:end]
new = block.replace("title: 'Sanbangduk — basalt fresco'", "title: 'Sanbangduk — geometric vector'")
canon_start = new.index("canon: '")
canon_end = new.index("',\n", canon_start)
new = new[:canon_start] + (
    "canon: 'GEOMETRIC VECTOR: flat hard-edged shapes, no gradients, no brush; the cliff is tessellated basalt hexagons; palette "
    "basalt black, deep sea-green, rust, cream, with her #8fb3a8 as the one accent. Face from ch_sanbangdeok, reduced to flat planes. "
    "The poor man and the official stay faceless shapes. No text."
) + new[canon_end:]
open(seq, 'w').write(src[:start] + new + src[end:])
print(len(items), 'prompts updated')
