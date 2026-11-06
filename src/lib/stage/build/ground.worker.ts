/// <reference lib="webworker" />
/**
 * Samples one band of rows of every ground grid a site builds, off the main thread.
 * The builders paint a few canvas textures while they run; an OffscreenCanvas stands in for the DOM one.
 */
import type { StageSiteId } from '../sites';
import type { BuildOptions } from './types';
import type { GridBand, GridSpec } from './terrain';

export type GroundJob = { rid: number; id: StageSiteId; opts: BuildOptions; part: number; parts: number };
export type GroundReply = { rid: number; specs: GridSpec[]; bands: GridBand[] } | { rid: number; error: string };

const scope = self as unknown as DedicatedWorkerGlobalScope;
(scope as unknown as { document: unknown }).document = {
	createElement: () => new OffscreenCanvas(1, 1)
};

const modules = Promise.all([import('./index'), import('./terrain')]);

scope.onmessage = async (e: MessageEvent<GroundJob>) => {
	const { rid, id, opts, part, parts } = e.data;
	try {
		const [{ buildSite }, { recordGrids, bandRows, gridBand }] = await modules;
		const grids = recordGrids(() => buildSite(id, opts)?.dispose());
		const bands = grids.map(({ spec, g, lift }) => {
			const [j0, j1] = bandRows(spec, part, parts);
			return gridBand(g, spec, lift, j0, j1);
		});
		const buffers = bands.flatMap((b) => [b.y.buffer, b.normal.buffer, b.color.buffer, b.cover.buffer]) as ArrayBuffer[];
		const reply: GroundReply = { rid, specs: grids.map((r) => r.spec), bands };
		scope.postMessage(reply, buffers);
	} catch (err) {
		const reply: GroundReply = { rid, error: err instanceof Error ? err.message : String(err) };
		scope.postMessage(reply);
	}
};
