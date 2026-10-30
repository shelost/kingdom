// Jukjuk green cloth (not Baekje yellow). Heighten Jesang's fire and
// Jukjuk's last stand. Rerun-safe.
import { openStory, p, text, insertAfter, guard } from './story-edit.mjs';

const { entry, say, save, chipFor } = openStory();
const nam = (speaker, lines, en) => ({
	kind: 'dialogue',
	speaker,
	gender: 'm',
	chip: '#8d8d95',
	lines,
	en
});

function walkMut(blocks, fn) {
	for (const b of blocks ?? []) {
		fn(b);
		if (b.blocks) walkMut(b.blocks, fn);
	}
}

function replacePair(b, enFrom, enTo, koFrom, koTo) {
	if (b.html === enFrom) b.html = enTo;
	if (b.ko === koFrom) b.ko = koTo;
	if (b.en) b.en = b.en.map((x) => (x === enFrom ? enTo : x));
	if (b.lines) b.lines = b.lines.map((x) => (x === koFrom ? koTo : x));
}

const jj = entry('Jukjuk');
walkMut(jj.blocks, (b) => {
	replacePair(
		b,
		'Beside him stands Jukjuk, yellow sleeve, who has been holding this wall since Pumsuk was learning to ride. He does not raise his voice. He has never needed to.',
		'Beside him stands Jukjuk, green cloth under the steel, who has been holding this wall since Pumsuk was learning to ride. He does not raise his voice. He has never needed to.',
		'그의 곁에는 황색 소매의 죽죽이 서 있다. 품석이 말 타기를 배울 때부터 이 성벽을 지켜 온 사람이다. 목소리를 높이지 않는다. 높일 필요가 한 번도 없었다.',
		'그의 곁에는 초록 옷 위의 갑옷인 죽죽이 서 있다. 품석이 말 타기를 배울 때부터 이 성벽을 지켜 온 사람이다. 목소리를 높이지 않는다. 높일 필요가 한 번도 없었다.'
	);
});

if (!JSON.stringify(jj.blocks).includes('Then we are the hill')) {
	insertAfter(jj, 'The bamboo by his door goes up one joint at a time', [
		nam('A survivor', ['성주님— 언덕이 없습니다.'], ['Sir— the hill is gone.']),
		say(
			'jukjuk',
			['그럼 우리가 언덕이오.', '내가 안 굽힐 때까지 지킵니다. 명령은 그게 전부요.'],
			['Then we are the hill.', 'I hold until I don’t. That’s the whole order.']
		)
	]);
}

const sec = entry('Royal Secretariat');
walkMut(sec.blocks, (b) => {
	replacePair(
		b,
		'Yellow sleeve. A low post. The men who hold a wall like that are supposed to be the lowest.',
		'Green cloth. A low post. The men who hold a wall like that are supposed to be the lowest.',
		'노란 소매였습니다. 낮은 자리입니다. 원래 그런 성을 지키는 사람들은 제일 낮은 사람들입니다.',
		'초록 옷이었습니다. 낮은 자리입니다. 원래 그런 성을 지키는 사람들은 제일 낮은 사람들입니다.'
	);
	replacePair(
		b,
		'He wore that sleeve so nobody would know. He said the border was the real duty. So he went.',
		'He wore the green so nobody would know. He said the border was the real duty. So he went.',
		'아무도 모르게 그 소매를 입었습니다. 거기가 끝이라고, 그래서 갔습니다.',
		'아무도 모르게 그 초록을 입었습니다. 거기가 끝이라고, 그래서 갔습니다.'
	);
});
for (const im of sec.images ?? []) {
	if (im.id === 'sec-jukjuk-gate' && im.alt) {
		im.alt = im.alt.replace('a yellow sleeve catching', 'green cloth catching');
	}
}

const je = entry('Park Jesang');
walkMut(je.blocks, (b) => {
	replacePair(
		b,
		'They tie him to the post. The fire takes the hem first. He does not sit. He looks up, and he uses the whole of his air.',
		'They tie him to the post. The fire takes the hem first. He does not sit.',
		'기둥에 묶는다. 불이 먼저 옷자락을 가져간다. 그는 앉지 않는다. 하늘을 보고, 숨을 다 쓴다.',
		'기둥에 묶는다. 불이 먼저 옷자락을 가져간다. 그는 앉지 않는다.'
	);
});

if (!JSON.stringify(je.blocks).includes('He is still saying it when the post goes')) {
	const i = je.blocks.findIndex((b) => (b.en ?? []).includes('I’d rather be a dog of Silla!'));
	// The shout may be nested. Walk to splice after it.
	const spliceAfter = (blocks) => {
		for (let k = 0; k < blocks.length; k++) {
			const b = blocks[k];
			if ((b.en ?? []).includes('I’d rather be a dog of Silla!')) {
				blocks.splice(
					k + 1,
					0,
					p(
						'The fire takes the skirt. He looks up. He uses the whole of his air, and then the air after that.',
						'불이 치마를 가져간다. 하늘을 본다. 숨을 다 쓰고, 그 다음 숨까지 쓴다.'
					),
					{
						kind: 'dialogue',
						person: 'jesang',
						chip: chipFor('jesang'),
						lines: ['신라의 개다!', '신라의— 개—다—!'],
						en: ['A dog of Silla!', 'A dog— of— Silla—!']
					},
					p(
						'He is still saying it when the post goes. The same sentence. Louder each time, until there is no more air in him, only the sentence.',
						'기둥이 넘어갈 때까지 그 말을 하고 있다. 같은 문장. 갈수록 더 크게. 숨이 다하면 문장만 남는다.'
					)
				);
				return true;
			}
			if (b.blocks && spliceAfter(b.blocks)) return true;
		}
		return false;
	};
	if (!spliceAfter(je.blocks)) throw new Error('jesang shout not found');
}

save();
console.log('green + drama applied');
