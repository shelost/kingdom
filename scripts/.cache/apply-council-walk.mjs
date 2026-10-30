// Chunchu and Jukji walk into the palace Harmony Council as the new center of power.
import { openStory, p, insertBefore, guard } from './story-edit.mjs';

const { entry, save } = openStory();
const sec = entry('Royal Secretariat');
guard(sec, 'They walk the length of the hall');
insertBefore(sec, 'Bupmin walks in wearing it', [
	p(
		'They walk the length of the hall. Magenta first. The Western robe half a step behind. The uncles have to turn. Heaven is not in this room. The clerk by the door is.',
		'전각을 가로지른다. 자주색이 먼저다. 서국 옷이 반 걸음 뒤다. 삼촌들이 고개를 돌려야 한다. 하늘은 이 방에 없다. 문 옆 서리가 있다.'
	)
]);
save();
console.log('council walk inserted');
