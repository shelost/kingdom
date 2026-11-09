import { cosmosProject, setFishEye, DEAD_DISC } from '../../src/lib/cosmos.ts';
setFishEye('mid');
for (const lat of [16, 14, 12, 10, 8, 6, 4]) {
  const row = [];
  for (const lon of [-8, -12, -16, -20, -28, -40]) {
    const [x,y] = cosmosProject(lon, lat);
    const d = Math.hypot(x-DEAD_DISC.x, y-DEAD_DISC.y) - DEAD_DISC.r;
    row.push(lon + ':' + Math.round(d));
  }
  console.log('lat', lat, row.join('  '));
}
