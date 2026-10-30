import json
import sqlite3
import os
import base64

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"

# round-1 silla 18:30 UTC
bid = "c24d854a-f850-4bf1-b1de-4cc830323e26"
bubble = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?",
        (f"bubbleId:{cid}:{bid}",),
    ).fetchone()[0]
)
tfd = bubble["toolFormerData"]
print("result", tfd.get("result")[:400] if isinstance(tfd.get("result"), str) else tfd.get("result"))
print("error", tfd.get("error"))
print("status", tfd.get("status"))
print("rawArgs len", len(tfd.get("rawArgs") or ""))
print("params len", len(tfd.get("params") or "") if isinstance(tfd.get("params"), str) else type(tfd.get("params")))

raw = base64.b64decode(tfd["toolCallBinary"])
print("decoded", len(raw))
# find magics
for name, mag in [
    ("jpeg", b"\xff\xd8\xff"),
    ("png", b"\x89PNG"),
    ("webp", b"RIFF"),
    ("jpg2", b"\xff\xd8"),
]:
    i = 0
    found = []
    while True:
        j = raw.find(mag, i)
        if j < 0:
            break
        found.append(j)
        i = j + 1
        if len(found) > 5:
            break
    print(name, found)

# dump around start as printable
print("head bytes", raw[:40])
# look for filePath in decoded
idx = raw.find(b"cover-silla-moon")
print("path idx", idx, raw[idx : idx + 80] if idx >= 0 else None)

# jpeg extract if present
j = raw.find(b"\xff\xd8\xff")
if j >= 0:
    k = raw.rfind(b"\xff\xd9")
    print("jpeg span", j, k, (k - j) if k > j else None)
    if k > j:
        out = "/tmp/cover-silla-moon-r1.jpg"
        open(out, "wb").write(raw[j : k + 2])
        print("wrote", out, os.path.getsize(out))

# also check if the whole bubble JSON contains jpeg/base64 image fields
val = json.dumps(bubble)
print("bubble json has FFD8", "\\xff\\xd8" in val)
print("bubble has data:image", "data:image" in val)
print("bubble has iVBORw0", "iVBORw0" in val)
print("bubble has /9j/", "/9j/" in val)
