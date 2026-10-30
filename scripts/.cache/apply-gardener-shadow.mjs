// Three Realms: Kangrim sees the boy. Haewonmek warns. Tamla tale withheld.
import { openStory, p, insertAfter, insertBefore, guard } from './story-edit.mjs';

const { entry, say, save } = openStory();
const e = entry('Three Realms');
guard(e, 'The smile is on');

insertAfter(e, '꽃감관이라 부르지 마', [
	say('kangrim', ['저 아이가 일등이오.'], ['That boy is class one.']),
	say('haewonmek', ['일등이야.'], ['Class one.']),
	say('kangrim', ['…너무 어려 보이오.'], ['…He looks too young.']),
	say(
		'haewonmek',
		['건들지 마.', '웃잖아. 그게 얼굴이야.'],
		['Don’t mess with him.', 'He smiles. That’s the face.']
	),
	say('kangrim', ['세 보이오.'], ['He looks strong.']),
	say('haewonmek', ['세.', '섬이 그 얘길 해.'], ['He is.', 'The island tells it.']),
	say('kangrim', ['무슨 얘기.'], ['Tells what.']),
	say(
		'haewonmek',
		['듣기 전에 건드리지 마.', '너는 서.'],
		['Don’t touch him before you hear it.', 'You stand.']
	),
	p('The smile is on. The rest of the face is not.', '웃음은 붙어 있다. 나머지 얼굴은 아니다.')
]);

save();
console.log('Three Realms: gardener warning inserted');
