// Rebuilds src/lib/tempArtInventory.ts from files present in static/temp/.
// Prefer `node scripts/sync-temp-deploy.mjs` — same inventory, plus Vercel ignore
// for unreferenced stand-ins so deploys do not ship orphans.
import { spawnSync } from 'node:child_process';

const r = spawnSync(process.execPath, ['scripts/sync-temp-deploy.mjs'], {
	stdio: 'inherit'
});
process.exit(r.status ?? 1);
