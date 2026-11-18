#!/usr/bin/env python3
"""One sheet: intro-card style on top, identity and flowers below. Flowers stay whole."""
import os
import sys
from PIL import Image, ImageChops

ROOT = "/Users/heewon/Documents/GitHub/kingdom"
STYLE = f"{ROOT}/static/intro/heavenearthking--heaven-earth-king.jpg"
LIMIT = 45_000


def load(path):
    return Image.open(path).convert("RGB")


def bust(im):
    diff = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L")
    diff = diff.point(lambda v: 255 if v > 24 else 0)
    box = diff.getbbox()
    if box:
        im = im.crop(box)
    return im.crop((0, 0, im.width, round(im.height * 0.46)))


def row(ims, h):
    tiles = []
    for im in ims:
        w = max(1, round(im.width * h / im.height))
        tiles.append(im.resize((w, h), Image.LANCZOS))
    gap = 8
    width = sum(t.width for t in tiles) + gap * (max(len(tiles) - 1, 0))
    sheet = Image.new("RGB", (width, h), (255, 255, 255))
    x = 0
    for t in tiles:
        sheet.paste(t, (x, 0))
        x += t.width + gap
    return sheet


def fit_width(im, width):
    h = max(1, round(im.height * width / im.width))
    return im.resize((width, h), Image.LANCZOS)


def compose(out, faces):
    top = row([load(STYLE)], 280)
    bots = []
    for p in faces:
        im = load(p if p.startswith("/") else f"{ROOT}/{p.lstrip('/')}")
        if "flower_" not in p and im.height > im.width * 1.05:
            im = bust(im)
        elif "flower_" in p:
            diff = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L")
            diff = diff.point(lambda v: 255 if v > 18 else 0)
            box = diff.getbbox()
            if box:
                im = im.crop(box)
        bots.append(im)
    bot = row(bots, 420 if len(bots) <= 2 else 360)
    width = 1100
    top = fit_width(top, width)
    bot = fit_width(bot, width)
    gap = 10
    canvas = Image.new("RGB", (width, top.height + gap + bot.height), (255, 255, 255))
    canvas.paste(top, (0, 0))
    canvas.paste(bot, (0, top.height + gap))
    q, w = 76, width
    im = canvas
    while True:
        im = canvas if w == canvas.width else canvas.resize((w, round(canvas.height * w / canvas.width)), Image.LANCZOS)
        im.save(out, "JPEG", quality=q, optimize=True)
        if os.path.getsize(out) <= LIMIT or w <= 420:
            break
        if q > 48:
            q -= 6
        else:
            w = round(w * 0.86)
    print(f"{os.path.basename(out)} {os.path.getsize(out)} {im.size[0]}x{im.size[1]}")


if __name__ == "__main__":
    compose(sys.argv[1], sys.argv[2:])
