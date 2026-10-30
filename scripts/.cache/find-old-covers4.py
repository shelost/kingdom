import json
import sqlite3
import os

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"
obj = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)
    ).fetchone()[0]
)
headers = obj["fullConversationHeadersOnly"]

# load one bubble and inspect structure
bid = "4a1417cf-64bb-4a2c-9637-e3edb86ebacc"
raw = con.execute(
    "SELECT value FROM cursorDiskKV WHERE key=?",
    (f"bubbleId:{cid}:{bid}",),
).fetchone()[0]
print("raw type", type(raw), "len", len(raw) if hasattr(raw, "__len__") else None)
if isinstance(raw, bytes):
    print("bytes start", raw[:40])
    try:
        bubble = json.loads(raw)
    except Exception as e:
        print("json fail", e)
        # maybe encrypted
        print("maybe not json")
        raise SystemExit
else:
    bubble = json.loads(raw) if isinstance(raw, str) else raw

print("bubble keys", list(bubble.keys()) if isinstance(bubble, dict) else type(bubble))


def summarize(o, prefix="", depth=0):
    if depth > 4:
        return
    if isinstance(o, dict):
        for k, v in o.items():
            if k.lower() in (
                "image",
                "images",
                "url",
                "path",
                "filename",
                "fileName",
                "description",
                "prompt",
                "result",
                "text",
                "content",
                "tool",
                "name",
                "args",
                "arguments",
                "output",
                "media",
                "mime",
                "mimeType",
            ) or "image" in k.lower() or "file" in k.lower() or "path" in k.lower():
                if isinstance(v, str) and len(v) > 200:
                    print(prefix + k, "str", len(v), v[:120].replace("\n", " "))
                else:
                    print(prefix + k, v if not isinstance(v, (dict, list)) else type(v).__name__)
            if isinstance(v, (dict, list)):
                summarize(v, prefix + k + ".", depth + 1)
    elif isinstance(o, list) and o:
        summarize(o[0], prefix + "[0].", depth + 1)
        if len(o) > 1:
            print(prefix, "listlen", len(o))


summarize(bubble)

# walk all 14h gens: size + any filename-like string
print("\n=== ALL 14h gens size + filename ===")
for h in headers:
    grp = h.get("grouping") or {}
    if grp.get("toolCallCase") != "generateImageToolCall":
        continue
    ts = h.get("createdAt") or ""
    if not ts.startswith("2026-10-20T14:"):
        continue
    b = h["bubbleId"]
    row = con.execute(
        "SELECT length(value), substr(value,1,80) FROM cursorDiskKV WHERE key=?",
        (f"bubbleId:{cid}:{b}",),
    ).fetchone()
    print(ts, b, row)
