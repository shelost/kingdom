import json
import sqlite3
import base64
import os

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
raw = base64.b64decode(bubble["toolFormerData"]["toolCallBinary"])

# extract ascii paths
import re

paths = re.findall(rb"(?:/Users/[^\x00-\x1f]{10,200})", raw)
print("n paths", len(paths))
for p in paths:
    print(p.decode("utf-8", "replace"))

# find the 96-byte path field
idx = raw.find(b"/Users/heewon/.cursor/projects/")
print("\nfirst cursor path at", idx)
while idx >= 0:
    # walk back a few bytes for length
    print("context", raw[max(0, idx - 8) : idx + 120])
    idx = raw.find(b"/Users/heewon/.cursor/projects/", idx + 1)

# dump histogram of bytes after last path
last = raw.rfind(b"/Users/")
print("\nlast path at", last)
# find end of that string
end = last
while end < len(raw) and raw[end] >= 32:
    end += 1
print("path", raw[last:end])
print("next 32 bytes", raw[end : end + 32])
print("remaining", len(raw) - end)

rest = raw[end:]
# unique byte count
print("unique bytes in rest", len(set(rest)))
print("nul count", rest.count(b"\x00"))
print("high bytes", sum(1 for b in rest if b > 127), "of", len(rest))

# write rest to inspect
open("/tmp/cover-silla-r1.bin", "wb").write(rest)
print("wrote /tmp/cover-silla-r1.bin")

# composerHeaders / ItemTable samples related to bubble
print("\n--- composerHeaders ---")
cols = con.execute("PRAGMA table_info(composerHeaders)").fetchall()
print(cols)
print("count", con.execute("SELECT count(*) FROM composerHeaders").fetchone())

print("\n--- ItemTable keys matching bubble/image/composer ---")
# don't full scan 4M; use indexed lookup if possible
for k in (
    f"bubbleId:{cid}:{bid}",
    f"agentKv:{cid}",
    f"composerData:{cid}",
):
    print("skip known")

# try a few key patterns
for k in [
    f"image:{bid}",
    f"generatedImage:{bid}",
    f"toolResult:{bid}",
    f"blob:{bid}",
    f"checkpoint:{cid}",
]:
    row = con.execute(
        "SELECT key, length(value) FROM cursorDiskKV WHERE key=?", (k,)
    ).fetchone()
    print(k, row)
