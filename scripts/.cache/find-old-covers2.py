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
print("top keys", list(obj.keys())[:40])
print("composerId", obj.get("composerId"))
print("conversationMap keys", list((obj.get("conversationMap") or {}).keys())[:10])
print("len conversationMap", len(obj.get("conversationMap") or {}))

gens = []
for i, h in enumerate(headers):
    grp = h.get("grouping") or {}
    if grp.get("toolCallCase") != "generateImageToolCall":
        continue
    gens.append((i, h.get("createdAt"), h.get("bubbleId"), grp.get("toolCallId"), list(h.keys())))

print("n generateImage", len(gens))
print("sample keys", gens[0][4] if gens else None)
for g in gens:
    print(g[0], g[1], g[2], (g[3] or "")[:80])
