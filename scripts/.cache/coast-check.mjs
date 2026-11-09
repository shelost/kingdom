import { cosmosProject, setFishEye, fieldRivers, DEAD_DISC, LIVING_DISC, meadow, lensPoint } from '../lib/cosmos.ts';
setFishEye('mid');
const pts = [[-16.5,18],[-16.5,14],[-15,11],[-13,8],[-10,5.6],[-30,4.2],[-60,4.4],[-220,4.6],[12,42],[10,38],[8,41]];
for (const [lon,lat] of pts) {
  const [x,y] = cosmosProject(lon, lat);
  const d = Math.hypot(x-DEAD_DISC.x, y-DEAD_DISC.y);
  console.log(String(lon).padStart(6), String(lat).padStart(5), 'sheet', Math.round(x), Math.round(y), 'beyond dead rim', Math.round(d-DEAD_DISC.r));
}
const m = meadow();
console.log('meadow', Math.round(m.x), Math.round(m.y));
for (const r of fieldRivers()) console.log(r.id, 'beyond', Math.round(r.r - (r.id==='samdo'?LIVING_DISC.r:DEAD_DISC.r)));
