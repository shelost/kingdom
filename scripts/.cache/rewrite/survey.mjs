import { loadStory, lists } from '../story-ops.mjs';
let n = 0;
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		const fb = e.blocks.filter(b => b.kind === 'flashback');
		const fbBlocks = fb.reduce((a, b) => a + (b.blocks?.length ?? 0), 0);
		const keys = Object.keys(e).filter(k => !['blocks','images','title','year','id'].includes(k));
		console.log(`#${n} ${e.title} y=${e.year} blocks=${e.blocks.length} fb=${fb.length}/${fbBlocks} imgs=${e.images?.length ?? 0} ${keys.join(',')}`);
	}
