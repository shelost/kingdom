import json

STORY = 'src/lib/data/story.json'
CANON = 'src/lib/data/visual-canon.json'
ANIMALS = 'src/lib/animals.ts'

ANCHOR = 'The Satek clan begins to worry that Euija is about to exact revenge on them'
BLOCKS = [
    {
        'kind': 'p',
        'html': 'They have watched him work. In the border years after Daeya, Gyebek earned the name Hundred-Victories mostly one way, and the Silla garrison towns learned to dread it. He leaves the line to other men and goes looking for the general. <b>Gomanari</b>, the black horse from the Gomanaru ferry, is the fastest thing on four legs in Samhan, and Gyebek rides him flat along the neck like a thrown knife, the blade reversed back along his forearm. The general sees a black shape where the field was empty, starts to turn his horse, and does not finish turning. One cut on the pass. By the time the escort draws, the black horse is a speck on the far ridge and an army is standing in a field with nobody left to tell it what to do.',
        'ko': '그들은 그가 일하는 것을 본 적이 있다. 대야성 이후 국경의 몇 해 동안, 계백은 백승이라는 이름을 대개 한 가지 방식으로 얻었고, 신라 수비 고을들은 그것을 두려워하게 되었다. 진은 다른 사람들에게 맡기고, 그는 장수를 찾아간다. 고마나루 나루터에서 온 검은 말 <b>고마나리</b>는 삼한에서 네 발 달린 것 중 가장 빠르고, 계백은 던진 칼처럼 그 목에 납작 엎드려 달린다. 칼날은 거꾸로 쥐어 팔뚝을 따라 눕힌 채로. 장수는 비어 있던 들판에 검은 것이 나타난 것을 보고, 말머리를 돌리기 시작하고, 끝내 다 돌리지 못한다. 스쳐 지나가며 한 번 벤다. 호위들이 칼을 뽑을 즈음 검은 말은 먼 능선 위의 점이 되어 있고, 한 군대가 무엇을 하라고 말해 줄 사람 하나 없이 들판에 서 있다.',
    },
    {
        'kind': 'dialogue',
        'chip': '#3f6f8f',
        'person': 'eldersatek',
        'lines': ['그 자는 군대한테 달려드는 게 아니오.', '한 사람한테 달려들지.', '상이 끝나면, 그 말머리가 어느 집 쪽으로 돌 것 같소.'],
        'en': ['He doesn’t ride at armies.', 'He rides at one man.', 'When the mourning’s over, whose house do you suppose that horse turns toward.'],
    },
]

SIGNATURE = (
    ' SIGNATURE MOVE (the general-killer): alone on Gomanari at a flat-out gallop, he comes out of nowhere across an empty field '
    'straight at the enemy general, body folded flat and aerodynamic along the horse’s neck, cheek almost on the mane, the '
    'reverse-gripped blade laid back along his forearm and the horse’s flank; on the pass he snaps one backhand draw-cut, '
    'swift and clean like a samurai iai cut, and is already past, the blade flicked out to the side, before the escort moves. '
    'Show speed through the long low line of horse and rider, streaming mane, flung mud, motion-blurred ground — never gore; '
    'the cut reads as a bright arc, a flying helm plume or a riderless horse.'
)
GOMANARI_LOOK = (
    ' The fastest horse in Samhan: at full gallop his body stretches long and low, neck level, ears pinned, mane and tail '
    'streaming flat behind, hooves barely touching.'
)

story = json.load(open(STORY))
entry = next(e for ch in story for e in (ch.get('entries') or []) if e.get('title') == 'Gyebek’s Exile')
if not any('the fastest thing on four legs' in (b.get('html') or '') for b in entry['blocks']):
    i = next(i for i, b in enumerate(entry['blocks']) if ANCHOR in (b.get('html') or ''))
    chip = next((b['chip'] for b in entry['blocks'] if b.get('person') == 'eldersatek' and b.get('chip')), None)
    if chip:
        BLOCKS[1]['chip'] = chip
    entry['blocks'][i + 1:i + 1] = BLOCKS
    json.dump(story, open(STORY, 'w'), ensure_ascii=False, indent='\t')
    open(STORY, 'a').write('\n')
    print('story: inserted after block', i)

canon = json.load(open(CANON))
people = canon.get('people') or canon.get('characters') or canon
g = people['gyebek']
if 'SIGNATURE MOVE' not in g['fighting']:
    g['fighting'] += SIGNATURE
horses = next(v for v in canon.values() if isinstance(v, dict) and 'gomanari' in v)
if 'fastest horse in Samhan' not in horses['gomanari']['look']:
    horses['gomanari']['look'] += GOMANARI_LOOK
json.dump(canon, open(CANON, 'w'), ensure_ascii=False, indent='\t')
open(CANON, 'a').write('\n')

src = open(ANIMALS).read()
old_tag = "tagline: 'The one thing Gyebek owns that the Tang cannot sell in a slave market.',"
new_tag = "tagline: 'The fastest horse in Samhan, and the one thing Gyebek owns that the Tang cannot sell in a slave market.',"
old_arc = "arc: 'Named for the old bear ferry at Gomanaru (Ungjin) where Gyebek learned to ride. "
new_arc = "arc: 'Named for the old bear ferry at Gomanaru (Ungjin) where Gyebek learned to ride. In the border years he is how Hundred-Victories kills a general: out of an empty field at a speed no Silla horse can match, one cut on the pass, gone over the ridge before the escort draws. "
if old_tag in src:
    src = src.replace(old_tag, new_tag).replace(old_arc, new_arc)
    src = src.replace(
        "events: [{ year: 660, label: 'Carries Gyebek to Hwangsanbeol; stands by the planted sword.' }]",
        "events: [\n\t\t\t{ year: 648, label: 'The border years: carries Gyebek through Silla escorts to their generals, one cut on the pass.' },\n\t\t\t{ year: 660, label: 'Carries Gyebek to Hwangsanbeol; stands by the planted sword.' }\n\t\t]",
    )
    open(ANIMALS, 'w').write(src)
    print('animals updated')
