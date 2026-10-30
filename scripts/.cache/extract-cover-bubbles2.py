import json
import sqlite3
import os
import base64

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"
obj = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)
    ).fetchone()[0]
)
headers = obj["fullConversationHeadersOnly"]

bid = "4a1417cf-64bb-4a2c-9637-e3edb86ebacc"
bubble = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?",
        (f"bubbleId:{cid}:{bid}",),
    ).fetchone()[0]
)
tfd = bubble["toolFormerData"]
tcb = tfd.get("toolCallBinary")
print("toolCallBinary type", type(tcb).__name__)
if isinstance(tcb, str):
    print("str len", len(tcb), "start", tcb[:80])
    # try decode
    try:
        raw = base64.b64decode(tcb[:200] + "==")
        print("b64 start", raw[:20])
    except Exception as e:
        print("b64 fail", e)
elif isinstance(tcb, dict):
    print("keys", list(tcb.keys()))
    for k, v in tcb.items():
        if isinstance(v, str):
            print(k, "str", len(v), v[:60])
        else:
            print(k, type(v).__name__)
elif isinstance(tcb, list):
    print("listlen", len(tcb), "item0", type(tcb[0]).__name__ if tcb else None)

print("\n=== search filenames cover- / moon / stars / snow ===")
hits = []
for h in headers:
    grp = h.get("grouping") or {}
    if grp.get("toolCallCase") != "generateImageToolCall":
        continue
    ts = h.get("createdAt") or ""
    row = con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?",
        (f"bubbleId:{cid}:{h['bubbleId']}",),
    ).fetchone()
    if not row:
        continue
    # cheap string search before json parse
    val = row[0]
    if not any(
        s in val
        for s in (
            "cover-silla",
            "cover-baekje",
            "cover-goguryeo",
            "cover-silla-moon",
            "moon.jpg",
        )
    ):
        continue
    b = json.loads(val)
    tfd = b.get("toolFormerData") or {}
    result = tfd.get("result")
    if isinstance(result, str):
        try:
            result = json.loads(result)
        except Exception:
            pass
    path = None
    if isinstance(result, dict):
        path = (result.get("success") or {}).get("filePath") or result.get("filePath")
    tcb = tfd.get("toolCallBinary")
    tlen = len(tcb) if isinstance(tcb, str) else type(tcb).__name__
    hits.append((ts, os.path.basename(path) if path else "-", tlen, h["bubbleId"]))

print("n hits", len(hits))
for h in hits:
    print(*h)
