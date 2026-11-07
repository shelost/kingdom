import { createRequire } from 'module';
// quick syntax/type smoke via dynamic import of built modules isn't available;
// instead just parse the TS with esbuild if present
import { readFileSync } from 'fs';
const files = [
  'src/lib/cosmos.ts',
  'src/lib/cosmosLayer.ts',
];
for (const f of files) {
  const s = readFileSync(f,'utf8');
  if (s.includes('CosmosScope = ') && s.includes('scopes?:')) console.log(f, 'ok scopes');
  if (f.includes('Layer') && !s.includes('near:')) console.log(f, 'MISSING near');
  if (f.includes('Layer') && s.includes('paintPathDots')) console.log(f, 'ok path dots');
  if (f.includes('Layer') && s.includes('warpFishCanvas')) console.log(f, 'ok warp');
}
console.log('done');
