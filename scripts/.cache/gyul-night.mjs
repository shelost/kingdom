import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Gyul');

const scene = e.blocks.find((b) => b.label === 'Between the Camps');
if (scene) scene.weather = 'clear';

const meet = e.blocks.find((b) => b.html?.startsWith('They meet in the hwarang yard'));
if (meet && !meet.html.includes('blue moon')) {
	meet.html =
		'They meet in the hwarang yard under the Moon Palace. Night. A bright blue moon overhead, and the gate only a black shape. Not as High Councillor and marshal, but as the yard’s two best. The same packed earth. Fish pommel against heavenly horse. The first exchanges are almost gentle. That is how Hwarang kill each other.';
	meet.ko =
		'그들은 월성 아래 화랑 마당에서 만난다. 밤이다. 머리 위에 밝은 푸른 달, 문은 검은 형태뿐. 상대등과 대장군이 아니라, 그 마당의 둘로서. 같은 맨땅. 물고기 고리와 천마 고리. 처음 몇 합은 거의 부드럽다. 화랑은 그렇게 서로를 죽인다.';
}

if (!e.blocks.some((b) => b.html?.includes('They do not fight in the road'))) {
	const i = e.blocks.findIndex((b) => b.html?.startsWith('They meet in the hwarang yard'));
	e.blocks.splice(i, 0, {
		kind: 'p',
		html: 'They do not fight in the road. The day burns out while they walk the old path, and the yard takes them after dark.',
		ko: '길에서는 싸우지 않는다. 옛길을 걷는 동안 낮이 타고, 마당은 어두워진 뒤에 둘을 받는다.'
	});
}

for (const im of e.images) {
	if (im.id?.startsWith('gyul-yard-')) im.time = 'night';
}
if (!e.images.some((im) => im.id === 'gyul-yard-cut')) {
	e.images.push({
		id: 'gyul-yard-cut',
		ratio: 2,
		time: 'night',
		at: 'Bidam’s third cut is a feint and the fourth isn’t.',
		alt: 'Night yard, blue moon. The fourth cut opens a line on Yushin’s brow.',
		people: ['bidam', 'yushin'],
		place: 'hwarang_yard'
	});
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('night ok');
