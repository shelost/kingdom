import { editStory, find } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (who, en, lines) => {
	const block = { kind: 'dialogue', en: Array.isArray(en) ? en : [en], lines: Array.isArray(lines) ? lines : [lines] };
	if (who.person) block.person = who.person;
	else {
		block.speaker = who.speaker;
		if (who.gender) block.gender = who.gender;
	}
	if (who.chip) block.chip = who.chip;
	return block;
};

const GW = { person: 'gwanggaeto', chip: '#e0442e' };
const KH = { speaker: 'The Khitan Khan', gender: 'm', chip: '#6a5a4a' };
const YAN = { speaker: 'The Yan Emperor', gender: 'm', chip: '#c45c4a' };
const BAJ = { speaker: 'The southern king', gender: 'm', chip: '#eec052' };
const GC = { person: 'gyeonggeunchogo', chip: '#eec052' };
const GOG = { speaker: 'The Goguryeo King', gender: 'm', chip: '#C30000' };
const BOY = { speaker: 'A Goguryeo Archer', gender: 'm', chip: '#8a8a94' };
const DODO = { person: 'dodo', chip: '#7f96b5' };

function insertAfter(entry, frag, blocks) {
	const hits = find(entry, frag);
	if (hits.length !== 1) throw new Error(`insertAfter "${frag}": ${hits.length} hits`);
	hits[0].list.splice(hits[0].i + 1, 0, ...blocks);
}

function insertBefore(entry, frag, blocks) {
	const hits = find(entry, frag);
	if (hits.length !== 1) throw new Error(`insertBefore "${frag}": ${hits.length} hits`);
	hits[0].list.splice(hits[0].i, 0, ...blocks);
}

function replaceFrom(entry, startFrag, endFrag, blocks) {
	const a = find(entry, startFrag);
	const b = find(entry, endFrag);
	if (a.length !== 1 || b.length !== 1) throw new Error(`replace ${startFrag}..${endFrag}: ${a.length}/${b.length}`);
	if (a[0].list !== b[0].list) throw new Error('replace: different lists');
	const from = a[0].i;
	const to = b[0].i;
	a[0].list.splice(from, to - from + 1, ...blocks);
}

editStory((story) => {
	const gw = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Gwanggaeto');
	if (!gw) throw new Error('King Gwanggaeto not found');

	if (!gw.blocks.some((x) => x.html?.includes('He will put a boot'))) {
		insertAfter(gw, 'The chair does not mention it.', [
			p(
				'He will put a boot on four heads before he is done. North. West. South. East. The chair is only the first thing that has to take his weight.',
				'끝나기 전에 머리 넷에 발을 올릴 것이다. 북. 서. 남. 동. 의자는 그의 무게를 견뎌야 하는 첫 번째일 뿐이다.'
			)
		]);
	}

	const card = gw.blocks.find((x) => x.kind === 'card' && x.person === 'gwanggaeto');
	if (card) {
		const i = gw.blocks.indexOf(card);
		const boy = gw.blocks.findIndex((x) => x.kind === 'scene' && x.label === 'The Boy');
		if (boy >= 0 && i !== boy + 1) {
			gw.blocks.splice(i, 1);
			const boy2 = gw.blocks.findIndex((x) => x.kind === 'scene' && x.label === 'The Boy');
			gw.blocks.splice(boy2 + 1, 0, card);
		}
	}

	if (!gw.blocks.some((x) => x.html?.includes('The khan has a name the ice'))) {
		insertAfter(gw, 'The tents do not care.', [
			p(
				'The khan has a name the ice does not keep. He sits a white horse at the far bank and counts Goguryeo the way other men count weather: something that will pass.',
				'칸에게는 얼음이 기억하지 않는 이름이 있다. 그는 건너편 기슭에서 백마를 타고, 고구려를 날씨 세듯 센다. 지나가는 것.'
			),
			d(KH, ['A boy.', 'Send him home before the ice goes.'], ['아이다.', '얼음 녹기 전에 돌려보내라.']),
			d(GW, ['Come down.', 'Count with me.'], ['내려와라.', '같이 세자.'])
		]);
	}

	if (!gw.blocks.some((x) => x.html?.includes('The khan is on his knees on the ice'))) {
		insertBefore(gw, 'North, then. Without sitting', [
			scene('The Ice', '얼음'),
			p(
				'The khan is on his knees on the ice. Gwanggaeto gets off the horse. He does not get off a horse for a thin king unless he means the boot.',
				'칸이 얼음 위에 무릎을 꿇는다. 광개토가 말에서 내린다. 얇은 임금 때문에 말에서 내리는 법은, 발을 올릴 때가 아니면 없다.'
			),
			d(KH, ['The river—'], ['강은—']),
			d(GW, ['Mine.', 'Stay there.'], ['내 거다.', '거기 있어.']),
			p('The boot finds the head. North learns it first.', '발이 머리를 찾는다. 북이 먼저 배운다.')
		]);
	}

	if (!gw.blocks.some((x) => x.html?.includes('The west is a wall you can see from a horse'))) {
		insertAfter(gw, 'Yan writes. He rides.', [
			p(
				'The west is a wall you can see from a horse, and a man behind it who still thinks a letter is a kind of army. The Yan Emperor. China, if you want a shorter word. He has a vermilion sleeve and a gate that closes at dusk.',
				'서는 말 위에서 보이는 성벽이고, 그 안에 편지 한 장이 군대라고 믿는 사내가 있다. 연의 황제. 짧게 말하면, 중국. 주홍색 소매와, 해 지면 닫히는 문이 있다.'
			),
			d(YAN, ['The gate opens for a name, not a horse.'], ['문은 이름에 열리지, 말에 열리지 않는다.']),
			d(GW, ['Then I’ll write it on the way in.'], ['그럼 들어가면서 적는다.'])
		]);
	}

	if (!gw.blocks.some((x) => x.html?.includes('The emperor comes out in vermilion'))) {
		insertBefore(gw, 'The west folds the way paper folds.', [
			scene('The Threshold', '문지방'),
			p(
				'The emperor comes out in vermilion. He has the letter. Gwanggaeto has the morning. He gets off the horse.',
				'황제가 주홍을 입고 나온다. 편지는 그가 쥐고 있다. 아침은 광개토가. 말에서 내린다.'
			),
			d(YAN, ['The west is—'], ['서는—']),
			d(GW, ['Mine. Stay there.'], ['내 거다. 거기 있어.']),
			p('The boot finds the head. West learns it second.', '발이 머리를 찾는다. 서가 두 번째로 배운다.')
		]);
	}

	if (!gw.blocks.some((x) => x.html?.includes('The southern king still thinks the river is a gift'))) {
		insertAfter(gw, 'South is a river and a king who still thinks the river is his.', [
			p(
				'The southern king still thinks the river is a gift his grandfathers left him. He has a yellow hall and a brother he can put on a horse. He has not yet learned what a boot is for.',
				'남쪽 임금은 아직 그 강이 할아버지가 남겨 준 선물이라고 생각한다. 노란 전각이 있고, 말에 태울 아우가 있다. 발이 무엇을 위한 것인지는, 아직 모른다.'
			),
			d(BAJ, ['Take the water if you must. Leave the hall.'], ['물이 필요하면 가져가시오. 전각은 남겨 두시오.']),
			d(GW, ['I didn’t come to bargain the furniture.'], ['가구 흥정하러 온 게 아니다.'])
		]);
	}

	if (!gw.blocks.some((x) => x.html?.includes('He said he did not come for the chair'))) {
		insertAfter(gw, 'I didn’t come for the chair.', [
			p(
				'He said he did not come for the chair. He came for the head that sat in it. The southern king is already on the packed earth of his own bank. Gwanggaeto gets off the horse.',
				'의자를 가지러 온 게 아니라 했다. 그 의자에 앉아 있던 머리를 가지러 온 것이다. 남쪽 임금은 이미 제 기슭의 땅에 무릎이 닿아 있다. 광개토가 말에서 내린다.'
			),
			d(BAJ, ['The chair is yours. Take it.'], ['의자는 그대 것이오. 가져가시오.']),
			d(GW, ['Stay there.'], ['거기 있어.']),
			p('The boot finds the head. South learns it third.', '발이 머리를 찾는다. 남이 세 번째로 배운다.')
		]);
	}

	if (!gw.blocks.some((x) => x.html?.includes('The Silla king has a thin country and one letter left'))) {
		insertAfter(gw, 'The Burning Capital', [
			p(
				'The Silla king has a thin country and one letter left. He stands on his own wall and counts fires that are not his. He has not yet written the word. He will.',
				'신라 임금에게는 얇은 나라와 편지 한 장이 남았다. 제 성벽 위에 서서, 제 것이 아닌 불을 센다. 그 글자는 아직 안 썼다. 쓸 것이다.'
			)
		]);
	}

	const geun = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Geunchogo');
	if (!geun) throw new Error('King Geunchogo not found');

	if (geun.logline) {
		geun.logline.en = 'A Baekje king marches north, and takes a Goguryeo king’s head on that king’s own wall. In seven hundred years, it never happens again.';
		geun.logline.ko = '백제 임금이 북으로 진군하고, 고구려 임금의 목을 그 임금의 성벽 위에서 가져온다. 칠백 년 동안 다시는 없는 일이다.';
	}

	geun.blocks.forEach((x) => {
		if (x.kind === 'p' && x.html?.includes('A Goguryeo king dies on his own wall')) {
			x.html = 'Baekje’s thirteenth king marches north to Pyongyang. He takes a Goguryeo king’s head on that king’s own wall. In seven hundred years, it never happens again.';
			x.ko = '백제의 열셋째 임금이 북쪽 평양으로 진군한다. 고구려 임금의 목을, 그 임금의 성벽 위에서 가져온다. 칠백 년 동안, 그런 일은 다시 없다.';
		}
	});

	const wallDark = (geun.images ?? []).find((im) => im.id === 'gc-wall-dark');
	if (wallDark) wallDark.at = 'The wall does not hold.';

	if (!geun.blocks.some((x) => x.html?.includes('The Baekje king is on the parapet'))) {
		replaceFrom(
			geun,
			'The arrow that finds him isn’t aimed at anyone',
			'That’s a king’s funeral.',
			[
				p(
					'The wall does not hold. The Baekje king is on the parapet with a wet sword, and the Goguryeo king has run out of wall to stand on.',
					'성벽이 버티지 못한다. 백제 임금이 젖은 칼을 들고 성가퀴에 서 있고, 고구려 임금에게는 더 서 있을 성벽이 없다.'
				),
				d(BOY, ['Majesty—'], ['전하—']),
				d(GOG, ['Stay behind me.'], ['내 뒤로.']),
				d(GC, ['Then don’t climb off.', 'Come here.'], ['그럼 내려오지 마.', '이리 와.']),
				d(GOG, ['You walked a long way for a wall.'], ['성벽 하나 보러 먼 길 왔다.']),
				d(GC, ['I walked it for you.'], ['니 보러 왔다.']),
				p(
					'They meet on the stones. There is no speech in it. The southern king’s blade finds the northern king’s neck, and the head goes down into the same frozen mud the boy has been standing in all morning.',
					'돌 위에서 만난다. 연설은 없다. 남쪽 임금의 칼이 북쪽 임금의 목을 찾고, 머리가 소년이 아침 내내 서 있던 그 언 진흙 위로 떨어진다.'
				),
				p(
					'The head lies by itself. Blood on the giwa. Blood on the boy’s boots. The eyes are still open, as if the wall were still a place a king could keep.',
					'머리가 혼자 놓여 있다. 기와 위에 피. 소년의 신에도 피. 눈은 아직 떠 있다. 성벽이 아직 임금이 지킬 수 있는 자리인 것처럼.'
				),
				d(GC, ['That’s a king’s funeral.', '…Turn them around. We came for a city. We’re going home with something better.'], [
					'저건 임금의 장례다.',
					'……돌려라. 성 하나 얻으러 왔는디, 그보다 나은 걸 갖구 돌아간다.'
				])
			]
		);
	}

	if (!geun.blocks.some((x) => x.html?.includes('The record says arrow'))) {
		insertAfter(geun, 'was struck by a stray arrow', [
			p(
				'The record says arrow. You were on the wall. You saw.',
				'기록은 화살이라 한다. 너는 성벽 위에 있었다. 봤다.'
			)
		]);
	}

	const seong = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Seong');
	if (!seong) throw new Error('King Seong not found');

	if (!seong.blocks.some((x) => x.html?.includes('The knife is not long'))) {
		insertAfter(seong, 'puts his neck out.', [
			p(
				'The knife is not long. Dodo has to come in close.',
				'칼은 길지 않다. 도도는 가까이 붙어야 한다.'
			),
			d(DODO, ['…I’m sorry.', 'I was told.'], ['……미안합니다.', '시키셔서요.']),
			p(
				'One stroke. The gold flame ornaments stay in the cap when the rest of him doesn’t.',
				'한 번이다. 관모의 금불꽃 장식은, 나머지가 떠나고도 그대로다.'
			),
			p(
				'The head lands on its side in the packed earth. Grey hair in the mud. Blood finds the freeze-line in the dirt and follows it.',
				'머리가 언 땅에 옆으로 눕는다. 백발은 진흙에. 피가 땅의 언 금을 찾아 따라간다.'
			)
		]);
	}

	return true;
});
