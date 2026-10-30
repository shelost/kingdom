import json
import sqlite3
import base64
import os
import hashlib
import subprocess

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"

gens = [
    # round 1 — first afternoon ensemble
    ("r1", "silla", "c24d854a-f850-4bf1-b1de-4cc830323e26", "moon-v1.jpg"),
    ("r1", "baekje", "576da8e9-0461-4576-ac44-f4b7ff095084", "stars-v1.jpg"),
    ("r1", "goguryeo", "135c5ea9-0dac-4cb9-9261-97b924407c76", "snow-v1.jpg"),
    # round 2 — painterly intro-card (previous before hat-fix)
    ("r2", "silla", "1ee8384f-f59d-42db-befa-2cc740dbe2d7", "moon-v2.jpg"),
    ("r2", "baekje", "24525223-5681-43aa-8b6f-0c4c3daae59f", "stars-v2.jpg"),
    ("r2", "goguryeo", "3ec37e18-767e-4772-ad0f-e4a416bca0c2", "snow-v2.jpg"),
]

root = "/Users/heewon/Documents/GitHub/kingdom"
alts = {
    "silla": os.path.join(root, "static/posters/alts/ch-samhan--silla"),
    "baekje": os.path.join(root, "static/posters/alts/ch-samhan--baekje"),
    "goguryeo": os.path.join(root, "static/posters/alts/ch-samhan--goguryeo"),
}
current = {
    "silla": os.path.join(alts["silla"], "moon.jpg"),
    "baekje": os.path.join(alts["baekje"], "stars.jpg"),
    "goguryeo": os.path.join(alts["goguryeo"], "snow.jpg"),
}


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def extract_jpeg(bid):
    bubble = json.loads(
        con.execute(
            "SELECT value FROM cursorDiskKV WHERE key=?",
            (f"bubbleId:{cid}:{bid}",),
        ).fetchone()[0]
    )
    raw = base64.b64decode(bubble["toolFormerData"]["toolCallBinary"])
    marker = b"/9j/"
    i = raw.find(marker)
    if i < 0:
        raise SystemExit(f"no jpeg b64 in {bid}")
    # take until first non-b64 (protobuf will have bytes < 43 or whitespace)
    j = i
    while j < len(raw) and raw[j] in b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=":
        j += 1
    b64 = raw[i:j]
    # pad
    pad = (-len(b64)) % 4
    data = base64.b64decode(b64 + b"=" * pad)
    if data[:3] != b"\xff\xd8\xff":
        raise SystemExit(f"not jpeg {bid} start={data[:8]!r} b64len={len(b64)}")
    return data, len(b64), j - i


for round_id, kingdom, bid, fname in gens:
    data, b64len, span = extract_jpeg(bid)
    out = os.path.join(alts[kingdom], fname)
    os.makedirs(alts[kingdom], exist_ok=True)
    with open(out, "wb") as f:
        f.write(data)
    # match other alts: sips jpeg max 1200 on long side, keep portrait
    subprocess.check_call(
        ["sips", "-s", "format", "jpeg", "-Z", "1200", out],
        stdout=subprocess.DEVNULL,
    )
    cur = current[kingdom]
    same = md5(out) == md5(cur) if os.path.exists(cur) else False
    print(
        round_id,
        kingdom,
        fname,
        "bytes",
        os.path.getsize(out),
        "b64",
        b64len,
        "same-as-current",
        same,
        md5(out),
    )

print("done extract")
