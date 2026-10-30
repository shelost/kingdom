import { editStory } from './story-ops.mjs';

const FRAG = 'Behind him the cave is full. Everyone who came.';
const HTML =
	'The house and the three who stayed. The Kims. The first yard. The founders. The hill. All of them, their faces in the steam, watching him go.';
const KO =
	'그 집과, 남았던 셋. 김씨들. 제일 마당. 시조들. 산. 다, 김 속 얼굴로, 그가 가는 걸 본다.';

editStory((story) => {
	const en = story.flatMap((ch) => ch.entries ?? []).find((e) => e.title === 'Munmu');
	if (!en) throw new Error('Munmu missing');
	const i = en.blocks.findIndex((b) => b.kind === 'p' && (b.html ?? '').includes(FRAG));
	if (i < 0) throw new Error('dawn p missing');
	const next = en.blocks[i + 1];
	if (next?.kind === 'p' && next.html === HTML) return false;
	en.blocks.splice(i + 1, 0, { kind: 'p', html: HTML, ko: KO });
	return true;
});
console.log('inserted group-watch p');
