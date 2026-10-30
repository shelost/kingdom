import json
import sqlite3
import os
import base64
import re

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"
bid = "c24d854a-f850-4bf1-b1de-4cc830323e26"
bubble = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?",
        (f"bubbleId:{cid}:{bid}",),
    ).fetchone()[0]
)

# all strings that look like urls/paths/ids
found = []


def walk(o, p=""):
    if isinstance(o, dict):
        for k, v in o.items():
            walk(v, p + "." + k)
    elif isinstance(o, list):
        for i, v in enumerate(o[:3]):
            walk(v, p + f"[{i}]")
    elif isinstance(o, str) and 8 < len(o) < 500:
        if any(
            x in o
            for x in (
                "http",
                "file://",
                ".jpg",
                ".png",
                ".webp",
                "blob",
                "asset",
                "image",
            )
        ):
            found.append((p, o[:200]))


walk(bubble)
print("string hits", len(found))
for p, o in found:
    print(p, "=>", o.replace("\n", " ")[:200])

raw = base64.b64decode(bubble["toolFormerData"]["toolCallBinary"])
print("\ndecoded magics later:")
for mag in (b"\xff\xd8", b"\x89PNG", b"RIFF", b"\x00\x00\x00\x18ftyp", b"{", b"<svg"):
    print(mag, raw.find(mag), raw.find(mag, 2000))

# dump a slice after the refs path
idx = raw.find(b"scripts/.cache/refs")
print("refs idx", idx)
if idx >= 0:
    chunk = raw[idx : idx + 120]
    print("after refs", chunk)

# printable-ish tail
print("tail", raw[-40:])

# keys of ItemTable
print("\n--- tables ---")
print(con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
