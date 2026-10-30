import { editStory, find } from './story-ops.mjs';

const CAVERN_IDS = [
	'scene-steam-cavern-43',
	'steam_02',
	'goddesses-settle-beauty',
	'goddesses-heads-turn',
	'steam_01',
	'steam-cavern-intimacy'
];

function one(entry, fragment, pred) {
	const hits = find(entry, fragment, pred);
	if (hits.length !== 1) throw new Error(`${entry.title}: ${hits.length} hits for ${JSON.stringify(fragment)}`);
	return hits[0];
}

function cutInclusive(entry, startFrag, endFrag) {
	const a = one(entry, startFrag);
	const b = one(entry, endFrag);
	if (a.list !== b.list) throw new Error(`${entry.title}: cut lists differ`);
	const i = a.list.indexOf(a.b);
	const j = b.list.indexOf(b.b);
	if (i < 0 || j < i) throw new Error(`${entry.title}: bad cut ${startFrag} → ${endFrag}`);
	return a.list.splice(i, j - i + 1);
}

function insertAfter(entry, fragment, blocks) {
	const { list, b } = one(entry, fragment);
	list.splice(list.indexOf(b) + 1, 0, ...blocks);
}

function insertBefore(entry, fragment, blocks) {
	const { list, b } = one(entry, fragment);
	list.splice(list.indexOf(b), 0, ...blocks);
}

function set(entry, fragment, patch) {
	Object.assign(one(entry, fragment).b, patch);
}

editStory((story) => {
	const entries = story.flatMap((c) => c.entries ?? []);
	const jgv = entries.find((e) => e.title === 'Jade Gate Valley');
	const yh = entries.find((e) => e.title === 'Yonghwa Hyangdo');
	const sad = entries.find((e) => e.title === 'Sadaham');
	if (!jgv || !yh || !sad) throw new Error('missing entry');

	/* —— move cavern stills Jade Gate → Yonghwa —— */
	jgv.images ??= [];
	yh.images ??= [];
	const moved = [];
	jgv.images = jgv.images.filter((im) => {
		if (!CAVERN_IDS.includes(im.id)) return true;
		moved.push(im);
		return false;
	});
	if (moved.length !== CAVERN_IDS.length) {
		throw new Error(`cavern move: expected ${CAVERN_IDS.length}, got ${moved.map((m) => m.id)}`);
	}
	const already = new Set(yh.images.map((im) => im.id));
	const steamAt = yh.images.findIndex((im) => im.id === 'steam_05');
	const at = steamAt >= 0 ? steamAt : yh.images.length;
	for (const im of moved) {
		if (already.has(im.id)) continue;
		yh.images.splice(at + yh.images.filter((x) => CAVERN_IDS.includes(x.id)).length, 0, im);
	}

	/* —— JGV: lift the bone-rank lecture out of the yard —— */
	const lore = cutInclusive(jgv, 'Silla’s purple is older than Silla', 'Here is how Silla counts a boy');
	const termHits = find(jgv, 'Bone, as in the bone you were born with');
	if (termHits.length !== 1) throw new Error(`term not unique (${termHits.length})`);
	const term = termHits[0].list.splice(termHits[0].list.indexOf(termHits[0].b), 1)[0];
	const tableList = jgv.blocks;
	const tableAt = tableList.findIndex((b) => b.kind === 'table' && b.head?.[0]?.includes('Bone'));
	if (tableAt < 0) throw new Error('bone table missing');
	const table = tableList.splice(tableAt, 1)[0];

	/* brief hwarang on the everyday yard */
	insertAfter(jgv, 'Class 77 drills on it anyway', [
		{
			kind: 'p',
			html: 'A hwarang is a boy the king has named. Each one leads his own Order. The boys who follow him are disciples. That is the whole machine. The rest is ice, and a wooden sword.',
			ko: '화랑은 임금이 이름 붙인 아이다. 저마다 제 향도를 이끈다. 그를 따르는 아이들이 낭도다. 기계는 그게 전부다. 나머지는 얼음과 목검이다.'
		}
	]);

	/* troops spotted — Bidam and Alchun take the valley */
	insertAfter(jgv, 'That is a muster', [
		{
			kind: 'dialogue',
			chip: '#8a7a64',
			speaker: 'A West-gate boy',
			gender: 'm',
			en: ['Troops. West of here. Jade Gate Valley.', 'I counted fires. A lot of fires.'],
			lines: ['군사요. 서쪽. 옥문곡.', '불빛을 셌는데요. 많아요.']
		},
		{
			kind: 'dialogue',
			person: 'bidam',
			en: ['Then we go.', 'Alchun. The valley is ours. The Marshal can have the door.'],
			lines: ['그러면 간다.', '알천. 골짜기는 우리 몫이야. 문은 원수에게 맡기고.']
		},
		{
			kind: 'dialogue',
			person: 'alchun',
			en: ['Finally. Something I can hit.'],
			lines: ['드디어. 때릴 게 생겼네.']
		}
	]);

	/* Yushin stays at the shut door — no cavern */
	set(jgv, 'Under the Hill', { label: 'The Shut Door', ko: '닫힌 문' });
	set(jgv, 'He rides east, into hills nobody uses', {
		html: 'Yushin reaches the palace before the drum has finished, and finds the queen already in council with it. The door stays shut. He stands in the corridor. He does not go west. Bidam and Alchun can carry one valley.',
		ko: '유신은 북이 그치기도 전에 궁에 닿는다. 여왕은 이미 그 북과 함께 회의 중이다. 문은 닫힌 채다. 그는 복도에 선다. 서쪽으로는 가지 않는다. 골짜기 하나는 비담과 알천이 든다.'
	});
	cutInclusive(jgv, 'A hole in a hill east of the capital', 'He dresses on the rock lip with his back to them');

	/* more Bidam stealth / Alchun brute, using the bowl */
	insertAfter(jgv, 'Men stand up in front of him and do not stay standing', [
		{
			kind: 'p',
			html: 'He uses the fog the spring makes. He walks between two tents and comes out behind a third. A man turns. Bidam is already past him. The beads do not click again.',
			ko: '그는 샘이 만든 안개를 쓴다. 천막 둘 사이로 들어가 셋째 뒤로 나온다. 사내가 돌아본다. 비담은 이미 지나갔다. 염주는 다시 소리가 나지 않는다.'
		},
		{
			kind: 'p',
			html: 'On the inner wall of the bowl he goes along a ledge the fog hides. One sentry. Then none. He leaves the ledge the way he found it.',
			ko: '사발 안쪽 벽을 따라, 안개가 숨기는 턱을 걷는다. 보초 하나. 그다음엔 없다. 턱은 발견한 그대로 남겨 둔다.'
		}
	]);
	insertAfter(jgv, 'then Alchun has a spear', [
		{
			kind: 'p',
			html: 'Alchun does not do between. He goes through. A wagon is in the dry creek. Then it is not a wagon. He puts the next man into the spring fog with one hand, and the fog keeps him.',
			ko: '알천은 사이로 가지 않는다. 뚫고 간다. 마른 시내에 수레가 있다. 그다음엔 수레가 아니다. 다음 사내를 한 손으로 샘 안개 속에 밀어 넣는다. 안개가 그를 붙든다.'
		}
	]);

	/* ridge lecture: hwarang to disciples, while they watch */
	set(jgv, 'The nangdo on the rim have stopped', {
		html: 'Then there is nothing left for the ridge to do but watch. The disciples on the rim have stopped in a long ragged line, the way people stop at a fire.',
		ko: '그다음엔 능선이 할 일이 구경밖에 없다. 가장자리의 낭도들이 길고 들쭉날쭉한 줄로 멈춰 선다. 사람들이 불구경할 때 멈추듯이.'
	});
	set(jgv, 'Are they— is that what— are they always like that', {
		speaker: 'A Disciple',
		chip: '#c96a5a',
		en: ['How does he— he didn’t even draw until—', 'Are they always like that?'],
		lines: ['저분은 어떻게— 칼도 나중에—', '저분들 원래 저렇습니까?']
	});
	set(jgv, 'Shut up and watch, young lord', {
		speaker: 'A Hwarang of Class 77',
		chip: '#7fa7c9',
		en: [
			'Watch the beads. That’s Bidam. He thinks first.',
			'The big one thinks with his shoulder. Same class. Different job.',
			'Get it right. You’ll be telling this when you’re old.'
		],
		lines: [
			'염주를 봐라. 저게 비담공이다. 먼저 생각하고.',
			'큰 분은 어깨로 생각하지. 같은 기다. 일이 다를 뿐.',
			'똑바로 봐라. 늙어서 이 얘기 할 테니까.'
		]
	});
	insertAfter(jgv, 'You’ll be telling this when you’re old', [
		{
			kind: 'dialogue',
			chip: '#c96a5a',
			speaker: 'A Disciple',
			gender: 'm',
			en: ['Why does the purple sleeve get to kick the snow.', 'I held a spear.'],
			lines: ['자색 소매는 눈이나 차고.', '나는 창을 들었는데.']
		},
		{
			kind: 'dialogue',
			chip: '#7fa7c9',
			speaker: 'A Hwarang of Class 77',
			gender: 'm',
			en: [
				'Silla’s purple is older than Silla. Sit down. I’ll tell it once.',
				'Before there was a king there were six villages. Each one had a Kan. An elder.'
			],
			lines: [
				'신라의 자색은 신라보다 오래됐다. 앉아. 한 번만 말한다.',
				'임금이 있기 전엔 마을이 여섯이었다. 마을마다 간이 있었지. 어른.'
			]
		},
		...lore.filter((b) => b.kind === 'hanja'),
		{
			kind: 'dialogue',
			chip: '#7fa7c9',
			speaker: 'A Hwarang of Class 77',
			gender: 'm',
			en: [
				'The six Kans met on a hill and chose one Great Kan over all six.',
				'The villages became the quarters of the capital. The Kans’ grandchildren became True Bone. Every purple sleeve on this yard can count back to one of six old men on a hill.',
				'Here is how Silla counts a boy. It starts with his bones.'
			],
			lines: [
				'여섯 간이 언덕에 모여, 여섯 위에 큰 간 하나를 세웠다.',
				'마을은 도성의 여섯 방이 됐고, 간의 손자들이 진골이 됐다. 이 마당의 자색 소매는 언덕 위 늙은이 여섯에게로 줄을 셀 수 있다.',
				'신라가 아이 하나를 세는 법은 이렇다. 뼈부터 센다.'
			]
		},
		term,
		table,
		{
			kind: 'dialogue',
			chip: '#c96a5a',
			speaker: 'A Disciple',
			gender: 'm',
			en: ['So the purple boy was born higher than the spear.'],
			lines: ['그라믄 자색 소매는 창보다 높은 데서 태어났다는 기가.']
		},
		{
			kind: 'dialogue',
			chip: '#7fa7c9',
			speaker: 'A Hwarang of Class 77',
			gender: 'm',
			en: [
				'Yes. And a hwarang is still only a boy the king named. Each one leads his Order. You follow me. I follow the Marshal.',
				'Now shut up and watch. Bidam is in the fog again.'
			],
			lines: [
				'그거다. 그래도 화랑은 임금이 이름 붙인 아이다. 저마다 제 향도를 이끌고. 너는 나를 따르고, 나는 원수를 따른다.',
				'이제 입 다물고 봐라. 비담공이 또 안개 속으로 들어간다.'
			]
		}
	]);

	set(jgv, 'hair still damp', {
		html: 'Yushin is at the door. He has been at the door since the drum, and somebody has made him eat. Bidam notices, and for once says nothing. Alchun will later call it the bravest thing he saw all night.',
		ko: '유신이 문 앞에 있다. 북이 울린 뒤로 줄곧, 누가 억지로 뭘 먹이기까지 한 얼굴로 문 앞에 있었다. 비담은 그걸 보고도, 웬일로 아무 말도 하지 않는다. 알천은 나중에 그것이 그 밤 본 것 중 가장 용감한 일이었다고 말한다.'
	});
	const queenStill = (jgv.images ?? []).find((im) => im.id === 'jade-queen-door');
	if (queenStill) {
		queenStill.alt =
			"Alchun holds out a fist of beads at the queen's door; Yushin has been standing there since the drum";
	}

	/* —— Yonghwa: first time the reader meets the cavern —— */
	insertBefore(yh, 'He undresses the way a man does when he is only fetching water', [
		{
			kind: 'p',
			html: 'He rides east, into hills nobody uses. His father found this cave by falling into it, and told his son exactly one thing about it: go when you’re stuck.',
			ko: '그는 동쪽으로, 아무도 쓰지 않는 언덕으로 말을 몬다. 아버지는 이 동굴을 굴러떨어져서 찾았고, 아들에게는 딱 한 가지만 일러 주었다. 막히면 가라.'
		},
		{
			kind: 'p',
			html: 'Inside, three women sit on the far rock as if they have always been there, which is roughly true. Narim, the eldest, keeps the rules. Hyullé keeps quiet. Golhwa keeps nothing.',
			ko: '안에는 세 여인이 저쪽 바위에 앉아 있다. 늘 거기 있었다는 듯이. 대충 맞는 말이다. 맏이 나림은 규칙을 지킨다. 혈레는 입을 지킨다. 골화는 아무것도 안 지킨다.'
		},
		{
			kind: 'p',
			html: 'The house rules are older than Silla: Kims only, clean-shaven, and nobody stands in the water dressed. Other nights he wades in to the chest with his eyes politely on the ceiling. Tonight he kneels at the lip and does not get in.',
			ko: '집 규칙은 신라보다 오래됐다. 김씨만, 면도한 얼굴로, 그리고 옷 입고 물에 서는 사람은 없다. 다른 밤이면 그는 눈은 예의 바르게 천장에 둔 채 가슴께까지 걸어 들어간다. 오늘 밤은 턱에 무릎을 꿇고, 들어가지 않는다.'
		}
	]);
	set(yh, 'He dresses with his back to them and takes the pail', {
		html: 'He dresses on the rock lip with his back to them, badly, the way every man does in that cave, and takes the pail. The steam follows him as far as the door and then thinks better of it.',
		ko: '그는 등을 돌린 채 바위턱에서 옷을 입는다. 그 동굴의 남자들이 다 그렇듯 서툴게. 그리고 들통을 든다. 김은 문까지 따라오다가 생각을 고친다.'
	});

	/* —— Sadaham: Golden Blossom Order —— */
	set(sad, 'the word for them is nangdo', {
		html: 'By the next spring the boys who eat his rice are a dozen. By the time he asks the king for Gaya they are forty, and they wait in the yard while he is on his knee in the hall, and the word for them is nangdo — disciples. It only means the ones who went.',
		ko: '이듬해 봄이면 그의 밥을 먹는 아이가 열둘이다. 가야를 청할 때면 마흔이 되고, 그가 전당에서 무릎을 꿇는 동안 마당에서 기다린다. 그들을 부르는 말은 낭도다. 따라간 사람이라는 뜻일 뿐이다.'
	});
	set(sad, 'forty nangdo are already holding the reins', {
		html: 'Outside, forty disciples are already holding the reins. Mugwan did not tell them to. They just heard the word going.',
		ko: '바깥에서는 낭도 마흔이 벌써 고삐를 잡고 있다. 무관이 시키지는 않았다. 말이 도는 소리를 들었을 뿐이다.'
	});
	set(sad, 'The ones who follow him are nangdo', {
		en: [
			'It’s boys. The king names a hwarang. Each hwarang leads his own Order. The ones who follow him are disciples. Could be two. Could be forty. Mine won’t shut up, so it’s forty.',
			'We ride. We sing. That’s the job.'
		],
		lines: [
			'아이지. 임금이 화랑을 이름 붙이오. 화랑마다 제 향도가 있고. 따라오는 아이가 낭도요. 둘일 수도 있고 마흔일 수도 있지. 내 놈들은 입을 안 다물어서, 마흔이오.',
			'달리고. 노래하고. 그게 일이오.'
		]
	});
	insertAfter(sad, 'Neither of them knows how short a year can be', [
		{
			kind: 'scene',
			label: 'Surabol, the yard · that spring',
			ko: '서라벌, 연무장 · 그해 봄'
		},
		{
			kind: 'p',
			html: 'They ride home to a yard that has grown while they were gone. Boys who were not there in autumn are there now. They have come for the boy who went through a gate, and they will not leave.',
			ko: '집에 오니 마당이 커져 있다. 가을에 없던 아이들이 있다. 문을 뚫고 들어간 아이를 보고 온 것이고, 가지 않을 것이다.'
		},
		{
			kind: 'p',
			html: 'Mugwan tries to count them and gives up past two hundred. The yard has never held an Order this large. The boys name it themselves, because Sadaham will not: 금화향도. The Golden Blossom Order.',
			ko: '무관이 세다가 이백이 넘자 손을 놓는다. 마당이 이만한 향도를 품은 적은 없다. 사다함은 이름을 안 붙이니까, 아이들이 스스로 붙인다. 금화향도.'
		},
		{
			kind: 'dialogue',
			person: 'mugwan',
			en: ['You have to stop feeding them.', 'They’ll eat the country.'],
			lines: ['밥 주는 거 그만해.', '나라 먹겠다.']
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			en: ['Then the country can come too.', 'There’s room.'],
			lines: ['그럼 나라도 와.', '자리 있어.']
		},
		{
			kind: 'p',
			html: 'He says it like a joke. Mugwan writes the number down anyway, because someone has to, and because a year is shorter than it looks.',
			ko: '농담처럼 말한다. 무관은 그래도 숫자를 적어 둔다. 누군가는 적어야 하니까. 그리고 일 년은 보기보다 짧으니까.'
		}
	]);

	return true;
});

console.log('applied JGV / Yonghwa cavern / Sadaham Golden Blossom');
