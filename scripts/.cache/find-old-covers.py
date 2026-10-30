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
print("n headers", len(headers))
gkeys = set()
for h in headers:
    gkeys.update((h.get("grouping") or {}).keys())
print("grouping keys", sorted(gkeys))

for i, h in enumerate(headers):
    grp = h.get("grouping") or {}
    created = h.get("createdAt") or ""
    blob = json.dumps(grp)
    if "2026-10-20T1" not in created:
        continue
    interesting = any(
        x in blob
        for x in (
            "cover-silla",
            "cover-baekje",
            "cover-goguryeo",
            "cover-silla-moon",
            "moon.jpg",
            '"toolFormerTool": 53',
        )
    )
    if not interesting and "toolDisplayPath" not in blob:
        continue
    extra = {
        k: grp[k]
        for k in grp
        if any(s in k.lower() for s in ("path", "file", "image", "name", "url", "case", "tool"))
    }
    if extra:
        print(i, created, extra)
