import json
import sqlite3
import base64
import os
import re

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"
obj = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)
    ).fetchone()[0]
)
headers = obj["fullConversationHeadersOnly"]

# inspect images field of first bubble
bid = "4a1417cf-64bb-4a2c-9637-e3edb86ebacc"
bubble = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?",
        (f"bubbleId:{cid}:{bid}",),
    ).fetchone()[0]
)
imgs = bubble.get("images") or []
print("n images", len(imgs))
if imgs:
    im = imgs[0]
    print("image keys", list(im.keys()) if isinstance(im, dict) else type(im))
    if isinstance(im, dict):
        for k, v in im.items():
            if isinstance(v, str):
                print(k, "str", len(v), v[:80].replace("\n", " "))
            else:
                print(k, type(v).__name__, v if not isinstance(v, (dict, list)) else (len(v) if hasattr(v, "__len__") else ""))

print("toolFormerData keys", list((bubble.get("toolFormerData") or {}).keys()))
tfd = bubble.get("toolFormerData") or {}
print("params", json.dumps(tfd.get("params") or tfd.get("arguments") or tfd.get("input") or list(tfd.keys()))[:500])

print("\n=== filePaths + filename from params ===")
for h in headers:
    grp = h.get("grouping") or {}
    if grp.get("toolCallCase") != "generateImageToolCall":
        continue
    ts = h.get("createdAt") or ""
    if not ts.startswith("2026-10-20T14:"):
        continue
    b = json.loads(
        con.execute(
            "SELECT value FROM cursorDiskKV WHERE key=?",
            (f"bubbleId:{cid}:{h['bubbleId']}",),
        ).fetchone()[0]
    )
    tfd = b.get("toolFormerData") or {}
    result = tfd.get("result")
    params = tfd.get("params") or tfd.get("arguments") or tfd.get("input") or {}
    # params may be string
    if isinstance(params, str):
        try:
            params = json.loads(params)
        except Exception:
            pass
    fn = None
    if isinstance(params, dict):
        fn = params.get("filename") or params.get("fileName") or params.get("name")
    path = None
    if isinstance(result, str):
        try:
            result = json.loads(result)
        except Exception:
            pass
    if isinstance(result, dict):
        path = (result.get("success") or {}).get("filePath") or result.get("filePath")
    nimg = len(b.get("images") or [])
    print(ts, fn or "-", os.path.basename(path) if path else "-", "imgs", nimg, "keys", list(tfd.keys()))
