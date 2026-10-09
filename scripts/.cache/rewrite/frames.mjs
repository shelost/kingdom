import { loadStory } from '../story-ops.mjs';
let n = 0;
for (const c of loadStory())
	for (const e of c.entries) {
		n++;
		if (!(e.flash || e.flashback)) continue;
		const fb = e.blocks.filter(b => b.kind === 'flashback').length;
		const top = {};
		e.blocks.forEach(b => { if (b.kind === 'dialogue') top[b.person ?? b.speaker] = (top[b.person ?? b.speaker] ?? 0) + 1; });
		console.log(`#${n} ${e.title} (${e.year}) inlineFB=${fb} topSpeakers=${JSON.stringify(top)}`);
	}
