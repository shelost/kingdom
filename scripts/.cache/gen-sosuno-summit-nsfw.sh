#!/bin/bash
# Requires Draw Things API on :7860 with Pony Diffusion V6 XL
set -euo pipefail
cd "$(dirname "$0")/../.."
node - <<'NODE'
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const man = JSON.parse(readFileSync('scripts/.cache/sosuno-summit-nsfw-manifest.json','utf8'));
for (const item of man) {
  console.log('generating', item.id);
  const r = spawnSync('node', ['scripts/generate-nsfw.mjs', '--id', item.id, '--prompt', item.prompt], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
}
spawnSync('node', ['scripts/install-temp-art.mjs', 'scripts/.cache/sosuno-summit-nsfw-manifest.json'], { stdio: 'inherit' });
spawnSync('node', ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
NODE
