"""Set the title, Korean title, tagline and credit on each generated poster.

    python3 scripts/.cache/posters/compose.py

Art comes from the conversation assets folder (GenerateImage output); finished posters go to
scripts/.cache/posters/out/. Each poster names where its title block sits (the quiet band the
prompt kept empty) and where its tagline sits.
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.expanduser('~/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets')
OUT = os.path.join(HERE, 'out')
PLATYPI = os.path.join(HERE, 'fonts/Platypi.ttf')
NOTO_KR = os.path.join(HERE, 'fonts/NotoSerifKR.ttf')
W, H = 1536, 2048
INK = (241, 233, 218)
DIM = (241, 233, 218, 190)

POSTERS = [
    {
        'id': 'poster-three-generals',
        'title': 'top',
        'tagline': 'bottom',
        'accent': (217, 177, 58),
        'en': 'Three kingdoms. One crown.',
        'ko': '세 나라. 왕관은 하나.',
    },
    {
        'id': 'poster-queens-tower',
        'title': 'bottom',
        'tagline': 'top-left',
        'accent': (232, 85, 43),
        'en': 'A Queen? Ridiculous.',
        'ko': '여왕? 웃기지도 않는군.',
    },
    {
        'id': 'poster-ansi',
        'title': 'bottom',
        'tagline': 'top-left',
        'accent': (201, 122, 46),
        'en': 'He has many names, and he is running out of countries.',
        'ko': '이름은 많고, 접어 넣을 나라는 거의 다 떨어졌다.',
    },
    {
        'id': 'poster-king-for-all',
        'title': 'bottom',
        'tagline': 'top-left',
        'accent': (224, 127, 168),
        'en': 'She never held the sword. She is the only one still standing.',
        'ko': '칼을 쥔 적은 한 번도 없다. 아직 서 있는 사람은 그녀뿐이다.',
    },
]


def variable(path, size, weight):
    font = ImageFont.truetype(path, size)
    font.set_variation_by_axes([weight])
    return font


def platypi(size, weight):
    return variable(PLATYPI, size, weight)


def korean(size, weight):
    return variable(NOTO_KR, size, weight)


def spaced(draw, xy, text, font, fill, tracking, anchor_center):
    """Draw letter-spaced text; returns its width."""
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x, y = xy
    if anchor_center:
        x -= total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return total


def scrim(img, band, top):
    """Darken a band toward the frame edge so type reads over the art."""
    y0, y1 = band
    mask = Image.new('L', img.size, 0)
    d = ImageDraw.Draw(mask)
    for y in range(y0, y1):
        t = (y - y0) / max(1, y1 - y0)
        alpha = (1 - t) if top else t
        d.line([(0, y), (img.width, y)], fill=round(215 * alpha ** 1.6))
    black = Image.new('RGB', img.size, (8, 7, 6))
    return Image.composite(black, img, mask)


def wrap(draw, text, font, width):
    words, lines, line = text.split(' '), [], ''
    for word in words:
        trial = f'{line} {word}'.strip()
        if draw.textlength(trial, font=font) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    lines.append(line)
    return lines


def title_block(draw, cx, y, accent, center):
    title = platypi(150, 700)
    ko = korean(56, 600)
    rule_w = 96
    x_rule = cx - rule_w / 2 if center else cx
    width = spaced(draw, (cx, y), 'KING FOR ALL', title, INK, 8, center)
    y += 212
    draw.line([(x_rule, y), (x_rule + rule_w, y)], fill=accent, width=4)
    y += 30
    spaced(draw, (cx, y), '삼한왕검', ko, INK, 28, center)
    return width


def tagline_block(draw, x, y, en, ko, width, center):
    en_font = platypi(54, 500)
    ko_font = korean(34, 500)
    credit = platypi(30, 600)
    for line in wrap(draw, en, en_font, width):
        lw = draw.textlength(line, font=en_font)
        draw.text((x - lw / 2 if center else x, y), line, font=en_font, fill=INK)
        y += 68
    y += 10
    for line in wrap(draw, ko, ko_font, width):
        lw = draw.textlength(line, font=ko_font)
        draw.text((x - lw / 2 if center else x, y), line, font=ko_font, fill=DIM)
        y += 52
    y += 34
    spaced(draw, (x, y), 'HEEWON AHN', credit, DIM, 12, center)


def compose(p):
    art = Image.open(os.path.join(ASSETS, f"{p['id']}.jpg")).convert('RGB').resize((W, H), Image.LANCZOS)
    title_top = p['title'] in ('top', 'top-left')
    art = scrim(art, (0, 560) if title_top else (H - 640, H), title_top)
    tag_top = p['tagline'].startswith('top')
    art = scrim(art, (0, 520) if tag_top else (H - 560, H), tag_top)
    art = art.convert('RGBA')
    layer = Image.new('RGBA', art.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    margin = 120

    if p['title'] == 'top':
        title_block(draw, W / 2, 110, p['accent'], True)
    elif p['title'] == 'top-left':
        title_block(draw, margin, 110, p['accent'], False)
    else:
        title_block(draw, W / 2, H - 400, p['accent'], True)

    if p['tagline'] == 'bottom':
        tagline_block(draw, W / 2, H - 400, p['en'], p['ko'], W - 2 * margin - 200, True)
    else:
        tagline_block(draw, margin, 120, p['en'], p['ko'], 600, False)

    shadow = layer.filter(ImageFilter.GaussianBlur(6))
    shadow_alpha = shadow.split()[-1].point(lambda v: round(v * 0.7))
    dark = Image.new('RGBA', art.size, (0, 0, 0, 255))
    dark.putalpha(shadow_alpha)
    out = Image.alpha_composite(Image.alpha_composite(art, dark), layer).convert('RGB')
    os.makedirs(OUT, exist_ok=True)
    dest = os.path.join(OUT, f"{p['id']}.jpg")
    out.save(dest, 'JPEG', quality=92)
    print(dest)


for poster in POSTERS:
    compose(poster)
