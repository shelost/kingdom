import { resolveEpisodeIndex, episodes } from '../../src/lib/reading.svelte.ts';
import { chapters } from '../../src/lib/story.ts';
import { entryCast } from '../../src/lib/entryHead.ts';
import { entryBullets } from '../../src/lib/summary.ts';
import { buildBeats } from '../../src/lib/beats.ts';

const i = resolveEpisodeIndex('bupmin');
console.log('index', i, episodes[i]?.id, episodes.length);
const ch = chapters.find((c) => c.id === 'five-principles');
const e = ch?.entries.find((x) => x.title === 'Bupmin');
if (!e) throw new Error('no bupmin');
console.log('cast', entryCast(e).length);
console.log('bullets', entryBullets(e).length);
console.log('beats', buildBeats(e).length);
console.log('ok');
