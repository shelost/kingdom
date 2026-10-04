import json
import re

TITLES = {
    'Big Star and Little Star': 'Heaven–Earth King',
    'Tamla, the Island of Oranges': 'Sulmun and the Three Princes',
    'The Great Lady’s Apron': 'Sulmun’s Apron',
    'Her Own Navel-String': 'Gameunjang',
    'The Girl Who Cut Her Hair': 'Jacheongbi',
    'The Ox and the Iron Chest': 'Baekjuto and Socheon-guk',
    'The Ones That End in Stone': 'Sanbangduk',
}
NAMES = [
    ('a girl called <b>Chongmyeong</b>', 'a girl the village calls <b>the Lady of Wisdom</b>'),
    ('Heaven–Earth King & Chongmyeong', 'Heaven–Earth King & the Lady of Wisdom'),
    ('Lady Chongmyeong', 'the Lady of Wisdom'),
    ('Chongmyeong', 'the Lady of Wisdom'),
    ('Sumyeongjangja', 'Sumyung Jangja'),
    ('Sanbangdeok', 'Sanbangduk'),
]
ALIAS_LINE = re.compile(r'^\s*(aliases:|\'[^\']*\',?$)')


def rename_text(s):
    for a, b in NAMES:
        s = s.replace(a, b)
    return s.replace('the the Lady', 'the Lady').replace('The the Lady', 'The Lady')


# story.json
PATH = 'src/lib/data/story.json'
story = json.load(open(PATH))
for ch in story:
    for e in ch.get('entries') or []:
        if e.get('title') in TITLES:
            e['title'] = TITLES[e['title']]
        for b in e.get('blocks') or []:
            if 'html' in b:
                b['html'] = rename_text(b['html'])
            if 'en' in b and isinstance(b['en'], list):
                b['en'] = [rename_text(x) for x in b['en']]
        for im in e.get('images') or []:
            for k in ('alt', 'prompt'):
                if k in im:
                    im[k] = rename_text(im[k])
raw = json.dumps(story, ensure_ascii=False, indent='\t')
for old in TITLES:
    assert '"title": "' + old + '"' not in raw, 'story.json still titles ' + old
open(PATH, 'w').write(raw + '\n')


def edit(path, fn):
    src = open(path).read()
    out = fn(src)
    if out != src:
        open(path, 'w').write(out)
        print('edited', path)


def text_only(src):
    lines = src.split('\n')
    out = []
    for line in lines:
        out.append(line if ALIAS_LINE.match(line) or 'aliases: [' in line else rename_text(line))
    return '\n'.join(out)


def people(src):
    src = src.replace("name: 'Lady Chongmyeong'", "name: 'Lady of Wisdom'")
    src = src.replace('Big Star and Little Star first', 'Heaven–Earth King first')
    src = text_only(src)
    src = src.replace("aliases: ['Lady Chongmyeong',", "aliases: ['Lady of Wisdom', 'the Lady of Wisdom', 'Lady Chongmyeong',")
    src = src.replace("aliases: ['Sumyeongjangja',", "aliases: ['Sumyung Jangja', 'Sumyeongjangja',")
    src = src.replace("aliases: ['Sanbangdeok']", "aliases: ['Sanbangduk', 'Sanbangdeok']")
    return src


def relations(src):
    src = text_only(src)
    return src.replace(
        "\t\t\t'Heaven–Earth King & Chongmyeong',\n",
        "\t\t\t'Heaven–Earth King & the Lady of Wisdom',\n\t\t\t'Heaven–Earth King & Chongmyeong',\n",
    )


def titles(src):
    for a, b in TITLES.items():
        src = src.replace("'" + a + "'", "'" + b + "'")
    return src


def toc(src):
    src = titles(src)
    for t in ('Sulmun and the Three Princes', 'Sulmun’s Apron', 'Kangrim'):
        src = re.sub(r"(\{ title: '" + re.escape(t) + r"'), label: '[^']*'", r'\1', src)
    return src


edit('src/lib/people.ts', people)
edit('src/lib/relations.ts', relations)
edit('src/lib/tocTree.ts', toc)
edit('src/lib/places.ts', titles)
edit('src/lib/movieSequences.ts', lambda s: rename_text(titles(s)))
edit('src/lib/components/diagrams/PantheonChart.svelte', rename_text)
edit('src/lib/components/diagrams/wikiCharts.ts', rename_text)
for cache in ('scripts/.cache/rewrite-heaven-earth.py', 'scripts/.cache/hek-ink-more.py'):
    edit(cache, lambda s: rename_text(titles(s)))
