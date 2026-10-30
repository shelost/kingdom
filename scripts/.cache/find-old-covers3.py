import json
import sqlite3

g = "/Users/heewon/Library/Application Support/Cursor/User/globalStorage/state.vscdb"
con = sqlite3.connect(f"file:{g}?mode=ro", uri=True)
cid = "6ffe22d1-968c-4bb7-b284-962473b3014f"
obj = json.loads(
    con.execute(
        "SELECT value FROM cursorDiskKV WHERE key=?", (f"composerData:{cid}",)
    ).fetchone()[0]
)
headers = obj["fullConversationHeadersOnly"]

print("newlyCreatedFiles", json.dumps(obj.get("newlyCreatedFiles"), indent=2)[:2000])
print("newlyCreatedFolders", obj.get("newlyCreatedFolders"))
cb = obj.get("codeBlockData") or {}
print("codeBlockData type", type(cb), "len", len(cb) if hasattr(cb, "__len__") else None)
if isinstance(cb, dict):
    print("codeBlockData keys sample", list(cb.keys())[:20])

gens = []
for h in headers:
    grp = h.get("grouping") or {}
    if grp.get("toolCallCase") != "generateImageToolCall":
        continue
    ts = h.get("createdAt") or ""
    if ts.startswith("2026-10-20T14:"):
        gens.append(h)

print("oct20 14h gens", len(gens))
for h in gens:
    grp = h.get("grouping") or {}
    print(
        h.get("createdAt"),
        h.get("bubbleId"),
        h.get("serverBubbleId"),
        (grp.get("toolCallId") or "")[-40:],
    )

# look up bubble keys for first few
print("\n--- KV key prefixes ---")
# sample keys that mention a bubbleId
bid = gens[0]["bubbleId"] if gens else None
print("sample bubbleId", bid)
if bid:
    for pattern in (
        bid,
        f"bubbleId:{cid}:{bid}",
        f"bubbleId:{bid}",
        f"agentKv:{cid}",
    ):
        row = con.execute(
            "SELECT key, length(value) FROM cursorDiskKV WHERE key=?", (pattern,)
        ).fetchone()
        print("exact", pattern, row)
