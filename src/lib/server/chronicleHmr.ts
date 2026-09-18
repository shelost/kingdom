import fs from 'node:fs';
import path from 'node:path';

/** Written just before the image-delete API persists story/inventory so Vite can skip a full reload. */
export const SKIP_CHRONICLE_HMR_FLAG = path.resolve('scripts/.cache/skip-chronicle-hmr');

export function armSkipChronicleHmr() {
	fs.mkdirSync(path.dirname(SKIP_CHRONICLE_HMR_FLAG), { recursive: true });
	fs.writeFileSync(SKIP_CHRONICLE_HMR_FLAG, String(Date.now()));
}

export function chronicleHmrSkipArmed(windowMs = 10_000): boolean {
	try {
		const t = Number(fs.readFileSync(SKIP_CHRONICLE_HMR_FLAG, 'utf8'));
		return Number.isFinite(t) && Date.now() - t < windowMs;
	} catch {
		return false;
	}
}
