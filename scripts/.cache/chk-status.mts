const { PROFILES, reignAt, isMonarch } = await import('$lib/people');
for (const p of PROFILES) {
  if (!reignAt(p)) continue;
  for (const s of p.stages ?? []) if (s.id && s.title) console.log(p.id, s.id, JSON.stringify(s.title), s.from ?? '', s.until ?? '', s.lookOnly ? 'lookOnly' : '', '→', isMonarch(p, s.from ?? null, s.id));
}
const byId = new Map(PROFILES.map((p: any) => [p.id, p]));
for (const [id, y, look] of [['jumong', -18], ['jumong', -37, 'exile'], ['jumong', -37, 'king'], ['yuri', -18], ['yuri', -18, 'prince'], ['hyukgose', 0]] as const)
  console.log(id, y, look, isMonarch(byId.get(id), y, look));
