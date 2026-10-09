// Rewrite pass for #47–#55 (The Chunchu Era, second half). Idempotent: each episode skips if its marker is present.
// node scripts/.cache/rewrite/chunchu.mjs
import { editStory } from '../story-ops.mjs';

/** strict String.replace: throws when the fragment is missing */
const R = (str, a, b) => {
	if (!str.includes(a)) throw new Error(`replace miss: "${a.slice(0, 50)}"`);
	return str.replace(a, b);
};
const P = (html, ko) => ({ kind: 'p', html, ko });
const BOLD = (html, ko) => ({ kind: 'p', html: `<b>${html}</b>`, ko: `<b>${ko}</b>` });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
/** D('chunchu', [['EN', 'KO'], …], { look }) */
const D = (person, pairs, extra = {}) => ({
	kind: 'dialogue',
	...(person ? { person } : {}),
	en: pairs.map((p) => p[0]),
	lines: pairs.map((p) => p[1]),
	...extra
});

function tools(story, n) {
	const entries = story.flatMap((c) => c.entries);
	const e = entries[n - 1];
	const chips = new Map();
	for (const x of entries)
		for (const b of x.blocks) if (b.kind === 'dialogue' && b.person && b.chip && !chips.has(b.person)) chips.set(b.person, b.chip);
	const hits = (frag) => e.blocks.map((b, i) => [b, i]).filter(([b]) => JSON.stringify(b).includes(frag));
	const one = (frag) => {
		const h = hits(frag);
		if (h.length !== 1) throw new Error(`#${n}: "${frag}" matched ${h.length} blocks`);
		return h[0][1];
	};
	const chip = (blocks) => blocks.map((b) => (b.kind === 'dialogue' && b.person && !b.chip && chips.has(b.person) ? { ...b, chip: chips.get(b.person) } : b));
	return {
		e,
		has: (frag) => hits(frag).length > 0,
		remove: (...frags) => {
			for (const f of frags) e.blocks.splice(one(f), 1);
		},
		removeRange: (fromFrag, toFrag) => {
			const a = one(fromFrag);
			const b = one(toFrag);
			e.blocks.splice(a, b - a + 1);
		},
		replace: (frag, ...blocks) => e.blocks.splice(one(frag), 1, ...chip(blocks)),
		after: (frag, ...blocks) => e.blocks.splice(one(frag) + 1, 0, ...chip(blocks)),
		before: (frag, ...blocks) => e.blocks.splice(one(frag), 0, ...chip(blocks)),
		edit: (frag, fn) => fn(e.blocks[one(frag)]),
		card: (...blocks) => {
			const last = e.blocks.at(-1);
			if (last.kind !== 'p' || !/^<b>/.test(last.html)) throw new Error(`#${n}: last block is not a card`);
			e.blocks.splice(e.blocks.length - 1, 1, ...blocks);
		},
		retarget: (pairs) => {
			for (const [id, at] of pairs) {
				const im = (e.images ?? []).find((x) => x.id === id);
				if (!im) throw new Error(`#${n}: no image ${id}`);
				im.at = at;
			}
		}
	};
}

const DRY = process.argv.includes('--dry');
const ONLY = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number);

/** Cut-only passes have no new marker: they are done once `present` is gone. */
const trim = (n, present, fn) => episode(n, present, fn, true);

function episode(n, marker, fn, invert = false) {
	if (ONLY.length && !ONLY.includes(n)) return;
	try {
		editStory((story) => {
			const t = tools(story, n);
			if (t.has(marker) !== invert) {
				console.log(`#${n} already done`);
				return false;
			}
			fn(t);
			console.log(`#${n} ${DRY ? 'ok (dry)' : 'patched'}`);
			if (DRY) return false;
		});
	} catch (err) {
		console.log(`#${n} FAILED: ${err.message}`);
		process.exitCode = 1;
	}
}

// ───────────────────────── #47 Queen Jinduk ─────────────────────────
episode(47, 'Nobody here is going to draw on you', (t) => {
	t.remove('In the twenty-first year, Sunduk died.');
	t.replace(
		'Day 1 through Day 10, unanswered',
		P(
			'Alchun is not at the coronation. The court writes his absence down as illness. Everyone knows the illness’s name. It lasted ten days.',
			'알천은 즉위식에 없다. 궁은 그의 부재를 병으로 적는다. 모두가 그 병의 이름을 안다. 그 병은 열흘을 갔다.'
		)
	);
	t.replace(
		'After the rites, the new queen keeps two men behind.',
		P(
			'After the rites, the new queen keeps two men behind. One of them has not had time to wash the mud off his boots.',
			'의식이 끝나자 새 여왕은 두 사람을 남긴다. 그중 하나는 아직 신발의 진흙을 씻을 틈도 없었다.'
		)
	);
	t.after(
		'"Bidam…"',
		P(
			'She does not finish the name. Everyone in Surabol has heard what Bidam called him by the end. Gaya. Never of Silla.',
			'그녀는 이름을 끝까지 부르지 못한다. 비담이 끝에 그를 뭐라 불렀는지 서라벌에서 모르는 사람이 없다. 가야 놈. 신라 사람이었던 적도 없는 놈.'
		)
	);
	t.after(
		'I am a loyal servant of the sacred country.',
		P(
			'He says it the way he says the oath on the yard, every word where it belongs. His right hand has closed on his sword belt and does not open. She grew up beside Dukman. She notices hands.',
			'그는 연무장에서 맹세를 외듯 말한다. 단어 하나하나가 제자리에 있다. 오른손은 칼띠를 쥔 채 펴지지 않는다. 그녀는 덕만 곁에서 자랐다. 손을 볼 줄 안다.'
		),
		D('jinduk', [
			['Then let go of the belt, General.', '그럼 띠는 놓게, 장군.'],
			['Nobody here is going to draw on you.', '여기서 자네한테 칼 뽑을 사람은 없네.']
		]),
		P('He lets go. It takes him a moment to remember how.', '그가 손을 놓는다. 어떻게 놓는지 떠올리는 데 잠깐이 걸린다.')
	);
	t.after(
		'Since the funeral, Majesty.',
		P(
			'Then the border spoils the moment, the way borders do. A runner comes in still wearing the road. Baekje is over the western line again, three forts at once. The court turns to the new queen the way it used to turn to the old one, waiting for her to already know.',
			'그때 국경이 이 순간을 망친다. 국경은 늘 그렇다. 길을 그대로 뒤집어쓴 전령이 들어온다. 백제가 또 서쪽 경계를 넘었다. 성 셋을 한꺼번에. 조정은 예전에 선왕을 보던 눈으로 새 여왕을 본다. 그녀가 이미 알고 있기를 기다리며.'
		),
		D('jinduk', [
			['I don’t know.', '모르겠네.'],
			['Unni would have dreamed it last week. I didn’t dream anything. I slept badly, that’s all.', '언니였으면 지난주에 꿈으로 봤겠지. 나는 아무 꿈도 안 꿨어. 잠을 설쳤을 뿐이야.']
		]),
		D('yushin', [
			['Give me the men, Majesty. I’ll go.', '군사를 주십시오, 전하. 제가 가겠습니다.'],
			['I won’t need a dream to find three forts.', '성 셋 찾는 데 꿈은 필요 없습니다.']
		]),
		D('chunchu', [
			['He’ll win them back. He always does.', '되찾을 겁니다. 늘 그러니까요.'],
			['And next spring they’ll come for three more. And the spring after that.', '그리고 내년 봄이면 또 셋을 노리겠지요. 그다음 봄에도.'],
			['Majesty, we can hold the door forever. We can’t make it stop knocking.', '전하, 문은 영원히 막을 수 있습니다. 두드리는 걸 멈추게 할 수는 없지만요.']
		]),
		D('jinduk', [['Then what stops it?', '그럼 무엇이 멈추게 하는가?']]),
		D('chunchu', [
			['A bigger door.', '더 큰 문이지요.'],
			['One man alive has an army that size. He lost a summer at Ansi, and he hates losing.', '그만한 군대를 가진 사람은 세상에 하나뿐입니다. 안시에서 여름 한 철을 잃었고, 지는 걸 싫어하지요.'],
			['Let me go west and ask him.', '서쪽으로 가서 청해 보게 해 주십시오.']
		]),
		P(
			'The old queen would have decided this with a smile, as if she had read it in the stars the night before. The new one has read nothing. She looks at Yushin’s hand, which is back on the belt. She looks at Chunchu, who has clearly had this ready since the funeral too.',
			'선왕이었다면 전날 밤 별에서 읽기라도 한 듯 웃으며 정했을 일이다. 새 여왕은 아무것도 읽지 않았다. 그녀는 다시 칼띠로 돌아간 유신의 손을 본다. 춘추를 본다. 이 말도 장례 때부터 준비해 둔 게 분명한 얼굴이다.'
		),
		D('jinduk', [
			['Yushin, take the men.', '유신, 군사를 데려가게.'],
			['Chunchu, go west.', '춘추, 서쪽으로 가게.'],
			['…If you’re both wrong, I want to hear it from you. Not from a runner.', '……둘 다 틀리거든, 전령 말고 자네들한테서 듣고 싶네.']
		]),
		P(
			'Outside, it starts to rain. Nobody predicted it.',
			'밖에 비가 내리기 시작한다. 아무도 예언하지 않은 비다.'
		),
		D('courtmaid', [
			['…It’s raining.', '……비 온다.'],
			['Did anybody know?', '누가 알았어?'],
			['Shh.', '쉿.']
		]),
		P(
			'Nobody says a word about the old queen. For the maids, that is the coronation.',
			'선왕 이야기는 아무도 꺼내지 않는다. 시녀들에게는 그게 즉위식이다.'
		)
	);
	t.card(
		BOLD(
			'Silla needs an army. Only one man alive can lend it, and he has never lent anything for free. Chunchu goes west…!',
			'신라에는 군대가 필요하다. 그것을 빌려줄 사람은 세상에 단 하나, 공짜로는 아무것도 빌려준 적 없는 사람이다. 춘추가 서쪽으로 간다…!'
		)
	);
});

// ───────────────────────── #48 Huangdi ─────────────────────────
episode(48, 'Chunchu has asked for it three ways', (t) => {
	t.remove('In Chang’an he watches a machine that doesn’t wait for uncles.');
	t.edit('The second banner was lettered', (b) => {
		b.html = R(b.html, 'The second banner was lettered, the older clerks say, SERVE THE PEOPLE.', 'The banner over the lodging gate once read SERVE THE PEOPLE, the older clerks say.');
		b.ko = R(b.ko, '나이 든 서기들 말로는, 두 번째 현수막은 원래', '나이 든 서기들 말로는, 객관 문 위의 현수막은 원래');
	});
	t.after(
		'one stroke in that column.',
		P(
			'The tenth stroke is a young Hwarang called Jukji, who writes down everything. The eleventh is On Gunhae, who carries his master’s coat and has not said a word since the harbour. The ward chief does not look at him either.',
			'열 번째 획은 무엇이든 받아 적는 젊은 화랑 죽지다. 열한 번째 획은 온군해다. 주인의 겉옷을 들고 다니며, 항구를 떠난 뒤로 한마디도 하지 않았다. 방정은 그도 쳐다보지 않는다.'
		)
	);
	// Idiom cards whose line already explains the idiom, and the record that spends the emperor's yes.
	t.remove('"hanja":"名不正言不順"', '"hanja":"知彼知己"', 'Taizong deeply agreed, and promised to send an army.', '"hanja":"脣亡齒寒"', '"hanja":"遠交近攻"');
	t.after(
		'He will be there, on and off, for the rest of his life.',
		P(
			'Nobody has said the word army yet. Chunchu has asked for it three ways. The emperor has answered with a house, a title and a hostage.',
			'아직 아무도 군대라는 말을 꺼내지 않았다. 춘추는 세 가지 방식으로 청했다. 황제는 집 한 채, 관작 하나, 볼모 하나로 답했다.'
		)
	);
	t.remove('Between audiences Chunchu watches the machinery.', 'What the clerk does find, while he isn’t finding Saluzi', '"diagram":"tang-military"');
	t.edit('He also asks, as idly as a foreign envoy', (b) => {
		b.html = R(b.html, 'He also asks, as idly as a foreign envoy can ask anything, after a general named Saluzi.', 'Between audiences he asks, as idly as a foreign envoy can ask anything, after a general named Saluzi.');
		b.ko = R(b.ko, '그리고 외국 사신이 물을 수 있는 한 가장 무심한 투로', '알현과 알현 사이, 외국 사신이 물을 수 있는 한 가장 무심한 투로');
	});
	t.edit('Chu Suiliang receives him among the shelves.', (b) => {
		b.html += ' Everyone in Chang’an knows how this emperor got the throne: at a palace gate, over two dead brothers. Nobody in Chang’an says it.';
		b.ko += ' 장안 사람이면 누구나 이 황제가 어떻게 보위에 올랐는지 안다. 궁궐 문 하나에서, 죽은 형제 둘을 넘어서. 장안에서 그 말을 하는 사람은 없다.';
	});
	t.removeRange('Mind the shelves, Prince. Every book in this room is a copy.', 'It has simply stopped coming round.');
	t.edit('Chunchu asks one favour no envoy has asked in years.', (b) => {
		b.html += ' Sons of dukes and sons of clerks sit the same examination here. A good enough answer can put any of them in a purple robe.';
		b.ko += ' 이곳에서는 공의 아들과 서리의 아들이 같은 시험을 친다. 답만 훌륭하면 누구든 자줏빛 관복을 입을 수 있다.';
	});
	t.remove('Sons of dukes recite in one hall', 'The students’ favourite gossip is ten years old.', '"diagram":"tang-exam"');
	t.after(
		'…Not even one, Majesty.',
		D('taizong', [['Then your kings are boats with no water under them. Anyone at all could tip one over.', '그럼 자네 나라 임금들은 물 없는 배로군. 아무나 뒤집을 수 있겠어.']])
	);
	t.remove('"hanja":"載舟覆舟"', '"diagram":"tang-departments"');
	t.remove('<b>Telebiao</b>. Yellow, with a pale muzzle.', 'He does not wait for Chunchu to catch up.', '<b>Shifachi</b>. Red as a seal.');
	t.edit('past the arrows, past the red horse and the grey', (b) => {
		b.html = R(b.html, 'past the red horse and the grey', 'past the grey horse and the black');
		b.ko = R(b.ko, '붉은 말과 잿빛 말을 지나', '잿빛 말과 검은 말을 지나');
	});
	t.edit('Five horses, five names, and not once has it occurred to him.', (b) => {
		b.html = R(b.html, 'Five horses, five names, and not once has it occurred to him.', 'Horse after horse, name after name, and not once has it occurred to him.');
		b.ko = R(b.ko, '말 다섯에 이름 다섯을 들었는데도, 단 한 번도 그 생각을 하지 못했다.', '말 하나에 이름 하나씩을 듣고도, 단 한 번도 그 생각을 하지 못했다.');
	});
	t.replace(
		'The Second Emperor reveals he is dying.',
		P(
			'He coughs into his sleeve, a small dry cough, and looks at the sleeve a moment too long before he folds it away. Chunchu has seen men do that. None of them were emperors.',
			'그가 소매에 대고 기침한다. 작고 마른 기침이다. 그러고는 소매를 한 박자 너무 오래 들여다보다가 접어 넣는다. 춘추는 그러는 사람들을 본 적이 있다. 황제는 하나도 없었다.'
		)
	);
	t.remove('"hanja":"天子無戲言"', 'I attack Goguryeo now for no other reason than pity for you');
	t.removeRange('So it is true. Your country seats a woman as king.', 'He likes the one who answers in rhyme.');
	t.edit('One of the two rubbings is for a temple at Jinci', (b) => {
		b.html =
			'One of the two rubbings is for a temple at Jinci, raised to a little brother who was once handed a leaf. Chunchu reads the first column and laughs out loud. He asked the emperor for that promise in writing. Here it is, in the emperor’s own hand.';
		b.ko =
			'탁본 두 벌 가운데 하나는 진사(晉祠)의 비문이다. 오래전 나뭇잎 한 장을 받은 어린 아우를 모신 사당. 춘추는 첫 줄을 읽고 소리 내어 웃는다. 그는 황제에게 그 약속을 글로 달라고 했었다. 여기 있다. 황제의 친필로.';
	});
	t.remove('Samhan has its own story about westerners who came east.', 'This is the story of migration from the West into Samhan.');
	t.remove('On the way home, at sea, Chunchu met Goguryeo patrol soldiers.');
	t.after(
		'a boat Chang’an wouldn’t have bothered to count.',
		P(
			'Eleven went in at the drum. Inmun is still inside the wall. On Gunhae is wherever the patrol left him.',
			'북소리에 맞춰 열하나가 들어갔다. 인문은 아직 성벽 안에 있다. 온군해는 순라선이 그를 버려둔 어딘가에 있다.'
		),
		D(
			'chunchu',
			[
				['Nine.', '아홉.'],
				['…Report it to the ward before the morning drum.', '……새벽 북 전에 방에 신고하라 했지.'],
				['He never asked me for anything either.', '저 사람도 내게 아무것도 청한 적이 없었다.']
			],
			{ look: 'ambassador' }
		)
	);
	t.retarget([
		['tang-daming-dusk', 'The embassy comes in at the hour the street drums stop.'],
		['taizong-meet-robe', 'You would teach Us Samhan?'],
		['taizong-meet-dais', 'Silla will accept investiture from the Great Tang.'],
		['tang-clerks-machine', 'He is watching the brush in the emperor’s hand'],
		['huangdi-ink-qin-fire', 'burned the books'],
		['huangdi-ink-qin-pit', 'And that Jin is gone.'],
		['steed-telebiao-queshu', 'their two shadows climb the wall'],
		['steed-shifachi-hedgehog', 'arrow by arrow'],
		['huangdi-ink-hen', 'Behind the screen Wu does not merely listen.'],
		['gija-scroll', 'laughs out loud'],
		['wiman-topknot', 'laughs out loud'],
		['wiman-no-enemy', 'laughs out loud']
	]);
});

// ───────────────────────── #49 Royal Secretariat ─────────────────────────
episode(49, 'like a man returning a borrowed bowl', (t) => {
	t.after(
		'For three months a border petition has been circling',
		P(
			'He has reasons to be in a hurry. The emperor who promised him an army, in a gallery of stone horses, has been dead two years. The promise went into the tomb with him, or near enough.',
			'그에게는 서두를 까닭이 있다. 돌말 회랑에서 그에게 군대를 약속한 황제는 죽은 지 두 해다. 약속은 그와 함께 무덤에 들어갔다. 거의 그렇다.'
		)
	);
	t.remove('"diagram":"royal-secretariat"', '"diagram":"harmony-council"', 'What he brought home from the west is a grammar.');
	t.edit('Today, the king will reinvent the kingdom.', (b) => {
		b.en = ['Today, Silla reinvents the court.'];
		b.lines = ['오늘, 신라가 조정을 다시 발명합니다.'];
	});
	t.remove('an institution that reports to the king alone');
	t.edit('"person":"jukji","caption"', (b) => {
		b.caption = 'A Hwarang who sailed with Chunchu to Chang’an and wrote down everything. Quiet, exact, and always holding the right paper.';
		b.ko = '춘추와 함께 장안에 다녀오며 모든 것을 받아 적은 화랑. 조용하고 정확하며, 늘 맞는 문서를 들고 있다.';
	});
	t.edit('Then you are 중시', (b) => {
		b.en = [
			'Then you are its Premier. The Secretariat is yours.',
			'You’re young, you’re quick, and you already write faster than the Council talks.',
			b.en[2]
		];
		b.lines = ['그럼 네가 중시다. 집사부는 네 자리다.', '젊고, 빠르고, 화백이 말하는 것보다 벌써 빨리 쓰지.', b.lines[2]];
	});
	t.remove('the old treasury office was remade as the Royal Secretariat');
	t.replace(
		'reciting the unanimity rule',
		P(
			'The Council finds out in the third week. Alchun is High Councillor now, because after Bidam nobody else wanted the chair. He comes to the side hall himself, with the border petition under his arm. He has been meaning to debate it.',
			'화백은 셋째 주에 알게 된다. 비담 뒤로 아무도 그 자리를 원하지 않아, 이제 상대등은 알천이다. 그가 변방의 청원을 옆구리에 끼고 몸소 곁채로 온다. 그것을 논할 참이었다.'
		),
		D('alchun', [
			['Oi. This petition.', '어이. 이 청원 말이오.'],
			['We were going to argue about it at the full moon.', '보름에 이걸 두고 다툴 참이었는데.']
		]),
		D('jukji', [['It’s sealed, my lord. The garrison marched yesterday.', '인장이 찍혔습니다, 대감. 수비대는 어제 떠났습니다.']]),
		D('alchun', [
			['Yesterday.', '어제라.'],
			['…Then what’s the Council for, Chunchu?', '……그럼 화백은 뭐에 쓰는 거요, 춘추?']
		]),
		D('chunchu', [
			['For the day the seal is wrong, my lord.', '인장이 틀리는 날을 위해서요, 대감.'],
			['Somebody has to be in the room to say so.', '그날 틀렸다고 말할 사람이 방에 있어야 하니.']
		]),
		D('alchun', [['…That’s a very polite way of saying a chair.', '……그거 의자라는 말을 참 점잖게도 하는구려.']]),
		P(
			'He leaves the petition on the table anyway, sealed, like a man returning a borrowed bowl.',
			'그래도 그는 청원을 탁자 위에 두고 간다. 인장이 찍힌 채로. 빌린 그릇을 돌려주는 사람처럼.'
		)
	);
	t.replace(
		'Bupmin sails west with the queen’s ode woven into a length of silk.',
		P(
			'The queen weaves the ode herself, at the loom she sits at when nobody is comparing. It takes her a season. When Bupmin comes to collect it, she does not let go of the bolt at once.',
			'송가는 여왕이 손수 짠다. 아무도 견주지 않을 때 앉는 그 베틀에서. 한 철이 걸린다. 법민이 가지러 왔을 때 그녀는 비단 필을 바로 놓지 않는다.'
		),
		D('jinduk', [
			['Tell him I wove it.', '짰다고 전하거라.'],
			['Not wrote. Wove.', '썼다가 아니라. 짰다고.'],
			['…Unni could see the future. I can at least make it look nice.', '……언니는 앞날을 봤지. 나는 적어도 보기 좋게는 만들 수 있네.']
		]),
		D('munmu', [['I’ll tell him, Your Highness.', '그리 전하겠습니다, 전하.']]),
		P(
			'Bupmin sails west with it. The new emperor in Chang’an admires it extravagantly. He also reads the letter rolled up inside, which asks for the Baekje cities back.',
			'법민이 그것을 들고 서쪽으로 간다. 장안의 새 황제는 요란하게 칭찬한다. 그리고 비단 속에 말아 넣은 글월도 읽는다. 백제가 가져간 성들을 돌려 달라는 글월이다.'
		)
	);
	t.remove('The queen wove brocade with a five-character Ode to Great Peace');
	t.edit('"label":"Tsukushi"', (b) => {
		b.label = 'Yamato';
		b.ko = '야마토';
	});
	t.replace(
		'In the summer of 651 a Silla tribute ship puts in at Tsukushi',
		P(
			'That summer a Silla tribute ship puts in at a Yamato harbour, its envoys dressed in the new robes. The Yamato court takes one look at them and sends them home.',
			'그해 여름, 새 관복을 입은 사신들을 태운 신라 조공선이 야마토의 항구에 닿는다. 야마토 조정은 그들을 한 번 쳐다보고는 돌려보낸다.'
		)
	);
	t.remove('This year the Silla tribute envoys, the sachan Jiman and others');
	t.edit('If we do not strike Silla now', (b) => {
		b.en[1] = 'Fill the sea from our harbours to theirs with ships, bow to stern, and call them to account. It would be easy.';
		b.lines[1] = '우리 나루에서 저쪽 바다까지 배를 이물과 고물이 닿게 띄우고, 신라를 불러 그 죄를 물으면 쉬운 일입니다.';
	});
	t.replace(
		'Emperor Kōtoku does not fill the sea.',
		P('The Yamato emperor does not fill the sea. His successors will remember the idea.', '야마토의 천황은 바다를 메우지 않는다. 그의 후계자들이 그 생각을 기억해 둘 것이다.')
	);
	t.replace(
		'"label":"The Emperor’s Letter"',
		SCENE('Sabi', '사비'),
		P(
			'The emperor’s answer goes to Sabi first, because it is addressed to Sabi. Euija reads it aloud to the whole hall. He reads everything aloud, insults especially.',
			'황제의 답은 사비에 먼저 간다. 받는 이가 사비이니까. 의자는 그것을 온 전각에 대고 소리 내어 읽는다. 그는 무엇이든 소리 내어 읽는다. 욕은 특히.'
		),
		D('euija', [
			['“Return the cities you took from Silla.” Ha! Listen to this, Gyebek. It gets better.', '“신라에서 빼앗은 성을 돌려주라.” 하! 들어 봐라, 계백아. 더 재밌다.'],
			['“If the king will not obey, We grant Bupmin’s request, and leave him to settle it with you in battle.”', '“왕이 따르지 않으면, 짐은 법민의 청을 들어 그가 왕과 싸워 결판내도록 맡기겠노라.”'],
			['In battle! The Son of Heaven writes me a whole scroll to say he’s staying home.', '싸워서! 천자께서 집에 계시겠다는 말을 두루마리 하나 가득 써 보내셨구나.']
		]),
		D('gyebek', [['Then it is only Silla.', '그럼 신라뿐입니다.']]),
		D('euija', [
			['Only Silla! Hear that? Heaven just counted my enemies for me. One!', '신라뿐! 들었느냐? 하늘이 내 적을 세어 주셨다. 하나!'],
			['Write back that we’re honoured. Then go and take another fort.', '영광이라고 답장 써라. 그리고 가서 성 하나 더 빼앗아 와.']
		]),
		D('gyebek', [['…For now, one.', '……지금은, 하나입니다.']]),
		SCENE('Surabol', '서라벌'),
		P(
			'In Surabol, Jukji reads the copy that came home with Bupmin. He reads the battle line twice.',
			'서라벌에서 죽지가 법민이 가져온 사본을 읽는다. 싸움에 관한 줄은 두 번 읽는다.'
		),
		D('jukji', [
			['He’ll let us fight them, my lord.', '저들과 싸우는 건 허락하겠답니다, 대감.'],
			['He doesn’t say he’ll fight with us.', '함께 싸우겠다는 말은 없습니다.']
		]),
		D('chunchu', [
			['No.', '없지.'],
			['His father said that. In a gallery full of horses, with the lamp on the floor.', '그 말은 그의 아버지가 했네. 말들로 가득한 회랑에서, 등잔을 바닥에 내려놓고.']
		])
	);
	t.remove('"kind":"edict"');
	t.card(
		BOLD(
			'What happened to that promise? Two years back, the room is too warm, and a dying emperor has one more thing to say…!',
			'그 약속은 어떻게 되었나? 두 해 전, 방은 너무 덥고, 죽어 가는 황제에게는 할 말이 하나 더 남아 있다…!'
		)
	);
	t.retarget([
		['parody-godfather-chunchu', 'We were going to argue about it at the full moon.'],
		['secretariat-polished-chairs', 'That’s a very polite way of saying a chair.'],
		['secretariat_tang_formation', 'Tang robes and caps for every official'],
		['tang-three-six-grid', 'Tang robes and caps for every official'],
		['secretariat_cultural_contrast', 'The people keep their own clothes.'],
		['secretariat_seals_documents', 'Petition. Seal. Courier.'],
		['secretariat_tang_bowing', 'the whole court bows to the queen at once'],
		['secretariat_shadow_officials', 'He holds it like a man who has been handed a live fish.']
	]);
});

// ───────────────────────── #50 Jiabeng ─────────────────────────
episode(50, 'in front of witnesses', (t) => {
	t.before(
		'The emperor dies in the Cuiwei Palace in the fifth month.',
		P(
			'Two summers earlier, the Son of Heaven is dying the way he did everything else: in front of witnesses.',
			'두 해 전 여름, 천자는 다른 모든 일을 해 온 방식대로 죽어 간다. 증인들 앞에서.'
		),
		P(
			'The crown prince holds a hand that used to lift a lamp to stone horses. It has nothing left to lift. It still gives orders.',
			'태자가 손 하나를 쥐고 있다. 돌말에 등잔을 들어 올리던 손이다. 이제 들어 올릴 것은 없다. 그래도 명은 내린다.'
		),
		D('taizong', [
			['Zhi.', '치야.'],
			['The six. When they go up the mountain—', '그 여섯 말이다. 산으로 올라가거든—'],
			['Put the purple one nearest the door. …He hates waiting.', '자줏빛 놈을 문 가장 가까이 두어라. ……기다리는 걸 싫어하니.']
		]),
		D('gaozong', [['I know, Father. You told me. You’ve told me every—', '알아요, 아버지. 말씀하셨어요. 몇 번이나—']])
	);
	t.remove('The great emperor’s temple name is hereby set as Taizong');
	t.remove('On the renshen day the death was announced in the Taiji Hall');
	t.remove('Ashina She’er and Qibi Heli');
	t.removeRange('"label":"Sabi"', 'A house that fights itself does not need an emperor');
	t.remove('When Taizong died, she became a nun and lived at the Ganye Temple.');
});

// ───────────────────────── #51 King Muyeol ─────────────────────────
episode(51, 'The room asks you first', (t) => {
	t.remove('has finally gone extinct');
	t.edit('"write":"金春秋"', (b) => (b.sub = '태종 무열왕'));
	t.replace(
		'meets again to enthrone',
		P(
			'The Harmony Council meets to choose a king. For the first time since there was a council, there is no Sacred Bone left to choose.',
			'화백회의가 임금을 고르려고 모인다. 회의가 생긴 이래 처음으로, 고를 성골이 남아 있지 않다.'
		)
	);
	t.replace(
		'Again the rule is unanimity.',
		P(
			'So the room does what rooms do with an empty chair. It offers it to the oldest man present. Alchun is High Councillor. He has been waiting seven years for this, so that he can refuse it.',
			'그래서 방은 빈 의자를 두고 방들이 늘 하는 일을 한다. 그 자리에서 가장 나이 든 사람에게 내민다. 상대등은 알천이다. 그는 이 순간을 일곱 해 기다려 왔다. 거절하려고.'
		),
		D(null, [['High Councillor. The room asks you first.', '상대등. 회의가 먼저 대감께 청합니다.']], { speaker: 'Councillor', chip: '#8a8a8a' }),
		D('alchun', [
			['Me?', '나?'],
			['Your servant is old, and has no virtue worth naming.', '신은 늙었고, 칭할 만한 덕행이 없소.'],
			['I told you lot on the wall. The chair you offered me afterward would be empty.', '성벽 위에서 말했잖소. 나중에 내게 줄 자리는 비어 있을 거라고.'],
			['In virtue and standing nobody here weighs what Lord Chunchu weighs. He’s the one who can save the age.', '덕망으로 치면 여기 누구도 춘추공만 못하오. 세상을 건질 사람은 그 사람이오.']
		])
	);
	t.remove('Your servant is old, and has no virtuous conduct worth naming.');
	t.edit('Come now~ is there anyone', (b) => delete b.speaker);
	t.before(
		'A True Bone on the throne. First since there was a throne.',
		D(null, [['A True Bone king. The bone has never once—', '진골이 임금이라니. 골품이 한 번도—']], { speaker: 'Councillor', chip: '#8a8a8a' })
	);
	t.edit('A True Bone on the throne. First since there was a throne.', (b) => delete b.speaker);
	t.after(
		'A True Bone on the throne. First since there was a throne.',
		P(
			'Alchun laughs the last hand up. Then everyone looks at the one man in the room who has spent his life sitting anywhere but that chair.',
			'알천이 웃어서 마지막 손을 들게 한다. 그러고는 모두가 한 사람을 본다. 평생 그 의자만 빼고 아무 데나 앉아 온 사람.'
		),
		D('chunchu', [['My lords. I have never once wanted to sit there.', '여러분. 나는 저기 앉고 싶었던 적이 한 번도 없소.']], { look: 'prince' }),
		D('alchun', [['Then sit in it, and stop making the rest of us stand.', '그럼 앉으시오. 그리고 우리 좀 그만 세워 두시오.']])
	);
	t.edit('This servant can find no reason to object.', (b) => {
		delete b.speaker;
		b.person = 'chunchu';
		b.look = 'prince';
		b.chip = '#D8258C';
	});
	t.edit('The age of <b>Kim Chunchu</b> begins.', (b) => delete b.speaker);
	t.edit('To lead the country down a road of ruin for a private grudge', (b) => {
		delete b.speaker;
		b.person = 'alchun';
		b.chip = '#8fb3e0';
	});
	t.edit('Is that truly how you have all seen me?', (b) => delete b.speaker);
	t.edit('I do not know whether to fear him or admire him', (b) => delete b.speaker);
	t.remove('國人謂始祖赫居世至眞德二十八王', 'I did not write what I had seen in that woman’s eyes.');
	t.card(
		SCENE('The Crown Prince’s Rooms', '태자의 처소'),
		P(
			'Late that night the new crown prince is still at his table, with the levy rolls for his father’s war. His wife reads them over his shoulder. She has been doing it for ten years.',
			'그날 밤 늦게, 새 태자는 아버지의 전쟁에 쓸 징발 장부를 붙들고 아직 탁자 앞에 있다. 아내가 어깨 너머로 그것을 읽는다. 십 년째 해 온 일이다.'
		),
		D('jayi', [
			['Your sums are wrong.', '셈이 틀렸어.'],
			['The rice for the western forts. You carried a one.', '서쪽 성들 쌀. 하나를 잘못 올렸잖아.']
		]),
		D('munmu', [['…Ten years, and you still say it the same way.', '……십 년인데, 아직도 똑같이 말하네.']]),
		D('jayi', [['Ten years, and you still carry the one.', '십 년인데, 아직도 하나를 잘못 올리잖아.']]),
		BOLD(
			'The first time she said it, he was eighteen, the quay was wet, and the brush in her hand was stolen…!',
			'그녀가 처음 그 말을 했을 때, 그는 열여덟이었고, 부두는 젖어 있었고, 그녀 손의 붓은 훔친 것이었다…!'
		)
	);
	t.retarget([
		['jinduk-passing', 'Sacred Bone ends on your breath.'],
		['muyeol-chunma-crowned', 'The Harmony Council meets to choose a king.'],
		['palace-roof-moonlight-vigil', 'That night a letter leaves Surabol'],
		['chunchu_growing_shadow', 'The age of'],
		['chunchu_empty_throne_shadow', 'I have never once wanted to sit there.'],
		['chunchu_command_hand', 'Is that truly how you have all seen me?'],
		['chunchu_elevated_position', 'This servant can find no reason to object.'],
		['chunchu_ring_of_ministers', 'The room asks you first.'],
		['chunchu_closed_fist', 'A private grudge?'],
		['chunchu_subordinate_silhouettes', 'I do not know whether to fear him or admire him']
	]);
});

// ───────────────────────── #52 Jahee ─────────────────────────
episode(52, 'Only if you’re watching', (t) => {
	t.replace(
		'Yushin sends Bupmin to the coast to work under Kim Seonpum.',
		P(
			'Ten years earlier, at Silla’s only western harbour, the prince is eighteen and losing an argument with a tide book.',
			'십 년 전, 신라의 하나뿐인 서쪽 항구. 왕자는 열여덟이고, 조수 장부와의 싸움에서 지는 중이다.'
		),
		P(
			'Yushin sent him here for the season, to work under Kim Seonpum, who runs the quay. No yard. No horses. Grain ships, tide marks, and sums that will not close.',
			'유신이 그를 이 한 철 동안 이곳에 보냈다. 부두를 맡은 김선품 밑에서 일하라고. 연무장도 없다. 말도 없다. 곡식 배와 물때 표시와, 맞아떨어지지 않는 셈뿐이다.'
		)
	);
	t.replace(
		'Her name is Jahee. Tonight she is the daughter',
		P(
			'Seonpum has a daughter who keeps his inkstones. Her name is Jahee. She has watched the prince for three days, and she has already decided his arithmetic is sloppy.',
			'선품에게는 그의 벼루를 지키는 딸이 있다. 이름은 자희. 사흘 동안 왕자를 지켜보았고, 그의 셈이 헐겁다고 이미 결론을 내렸다.'
		)
	);
	t.replace(
		'She corrects the sum with a brush he was not supposed to steal.',
		P(
			'She corrects the sum with her father’s good brush. She is not supposed to touch it. She took it off his desk an hour ago, because it is the only one that writes small enough. He watches her mouth instead of the numbers, and she lets him, once.',
			'그녀는 아버지의 좋은 붓으로 셈을 고친다. 손대면 안 되는 붓이다. 한 시진 전에 아버지 책상에서 슬쩍 가져왔다. 글씨를 그만큼 작게 쓰는 붓은 그것뿐이라서. 그는 숫자 대신 그녀의 입을 보고, 그녀는 한 번 허락한다.'
		),
		P(
			'Then a rider comes down the coast road with a letter from Yushin. The army is marching west, against seven Baekje forts. The grain sails on the morning tide. Bupmin is to sail with it.',
			'그때 해안 길로 말 탄 전령이 유신의 글월을 들고 내려온다. 군대가 서쪽으로, 백제의 일곱 성을 향해 나선다. 곡식은 아침 물때에 배에 실려 떠난다. 법민도 그 배로 오라는 것이다.'
		),
		D('munmu', [
			['The morning tide.', '아침 물때라.'],
			['…Then the book has to close tonight.', '……그럼 장부는 오늘 밤 닫혀야 합니다.']
		]),
		D('jayi', [
			['It won’t. You’re forty sacks short, somewhere between the third ship and the fifth.', '안 닫혀요. 마흔 섬이 비어요. 셋째 배와 다섯째 배 사이 어딘가에서.'],
			['Forty sacks is a company that doesn’t eat for a week.', '마흔 섬이면 한 부대가 이레를 굶어요.']
		]),
		D('munmu', [['Then show me where.', '그럼 어딘지 보여 주세요.']]),
		P(
			'They count until the lamp needs oil, and then by the light from the warehouse door. Somewhere around the fourth ship she stops correcting him, because he has stopped making mistakes. Neither of them knows what to do with their hands.',
			'등잔에 기름이 떨어질 때까지 센다. 그다음엔 창고 문간의 불빛으로 센다. 넷째 배쯤에서 그녀는 그를 고쳐 주기를 멈춘다. 그가 더는 틀리지 않기 때문이다. 둘 다 손을 어디 둬야 할지 모른다.'
		)
	);
	t.edit('Father is coughing.', (b) => {
		b.en = ['…That’s my father coughing.', 'He only coughs like that when he’s pretending not to be there.', '…Which is why it has to be now.', 'Before the tide comes in.'];
		b.lines = ['……우리 아버지 기침이에요.', '없는 척할 때만 저렇게 기침하세요.', '……그러니까 지금이 아니면 안 돼요.', '물이 들어오기 전에.'];
	});
	t.edit('Seonpum coughs once from the dark', (b) => {
		b.html = R(b.html, ' Years later the court will name her Jayi. The quay already had the true name.', '');
		b.ko = R(b.ko, ' 여러 해 뒤 조정은 그녀를 자의라 부를 것이다. 항구는 이미 진짜 이름을 가지고 있었다.', '');
	});
	t.replace(
		'His queen, Queen Jayi, was the daughter of the pajinchan Seonpum.',
		P(
			'They find it at the fifth ship, an hour before dawn. Forty sacks written down by somebody who never loaded them. The grain can sail on time and short, or a day late and whole.',
			'새벽 한 시진 전, 다섯째 배에서 찾아낸다. 싣지도 않은 마흔 섬을 누군가 실었다고 적어 두었다. 곡식은 제때 모자란 채로 떠날 수도 있고, 하루 늦게 온전히 떠날 수도 있다.'
		),
		D('munmu', [
			['Load them. All forty.', '실으세요. 마흔 섬 전부.'],
			['I’ll take the next tide.', '저는 다음 물때에 가겠습니다.']
		]),
		D('jayi', [['Yushin said the morning tide.', '유신 장군은 아침 물때라고 했잖아요.']]),
		D('munmu', [
			['Then he can hit me for it.', '그럼 저를 때리시겠지요.'],
			['At least the company that eats will be his.', '그래도 밥을 먹는 부대는 그분 부대일 테니까요.']
		]),
		D('jayi', [['…And you’ll come back and fix your sums?', '……그리고 돌아와서 셈 고칠 거예요?']]),
		D('munmu', [['Only if you’re watching.', '당신이 보고 있으면요.']]),
		P(
			'Years later the court will call her Jayi. The quay already had the true name.',
			'여러 해 뒤 조정은 그녀를 자의라 부를 것이다. 항구는 이미 진짜 이름을 가지고 있었다.'
		)
	);
	t.edit('"label":"The Next King"', (b) => {
		b.label = 'The Western Forts';
		b.ko = '서쪽 성들';
	});
	t.replace(
		'Two queens come and go. Bupmin rides with the Hwarang through both.',
		P(
			'He reaches the army a day late, with forty sacks of rice nobody else knew were missing. Yushin is waiting at the edge of the camp.',
			'그는 하루 늦게 군에 닿는다. 아무도 비는 줄 몰랐던 쌀 마흔 섬과 함께. 유신이 진영 끝에서 기다리고 있다.'
		),
		D('yushin', [['You missed the tide.', '물때를 놓쳤군.']]),
		D('munmu', [['Yes, Marshal. The fifth ship was forty sacks short. I stayed and loaded them.', '예, 대장군. 다섯째 배가 마흔 섬이 비었습니다. 남아서 실었습니다.']]),
		P(
			'Yushin hits him once, open-handed, because the order was the morning tide. Then he sends the forty sacks to the company that was going to go without.',
			'유신은 손바닥으로 그를 한 대 친다. 명은 아침 물때였으니까. 그러고는 마흔 섬을 굶을 뻔한 부대로 보낸다.'
		)
	);
	t.card(
		SCENE('The Coronation Year', '즉위하던 해'),
		P(
			'Ten years later the bruise is long gone. The girl from the quay is the crown prince’s wife. The whole court stands in the palace yard in Tang silk to watch his father crowned.',
			'십 년 뒤, 멍은 진작 사라졌다. 부두의 그 아가씨는 태자비가 되었다. 온 조정이 당의 비단을 입고 궁 마당에 서서 그의 아버지가 왕관 쓰는 것을 지켜본다.'
		),
		P(
			'This king has a Secretariat, an emperor for a friend, and an army that answers to one brush. He means to make three kingdoms one. Everybody in the yard can feel a new age starting.',
			'이 임금에게는 집사부가 있고, 벗이라 부르는 황제가 있고, 붓 한 자루에 움직이는 군대가 있다. 그는 세 나라를 하나로 만들 작정이다. 마당의 누구나 새 시대가 시작되는 것을 느낀다.'
		),
		P(
			'Along the back row stand the oldest houses in Surabol, the six families who were here before there was a king. They wear the new robes because the Secretariat says so. They wear them like borrowed skin.',
			'뒷줄에는 서라벌에서 가장 오래된 집안들이 서 있다. 임금이 있기 전부터 여기 있던 여섯 가문이다. 집사부가 입으라니 새 관복을 입었다. 빌린 살가죽처럼 입었다.'
		),
		D(
			null,
			[
				['In my grandfather’s day a king wore what his grandfather wore.', '우리 할아버지 때는 임금이 제 할아버지 옷을 입었소.'],
				['In the first king’s day he came out of an egg.', '첫 임금 때는 알에서 나왔고.'],
				['Now he comes out of a Secretariat.', '이제는 집사부에서 나오는구려.']
			],
			{ speaker: 'The old houses', chip: '#8a8a8a' }
		),
		D('munmu', [
			['Uncle. Why do they mind so much?', '숙부님. 저분들은 왜 저리 못마땅해하십니까?'],
			['It’s only a robe.', '옷일 뿐인데요.']
		]),
		D('alchun', [
			['Nothing in this country is only a robe, lad.', '이 나라에 옷일 뿐인 건 없다, 얘야.'],
			['Their grandfathers chose the first king. So did mine.', '저 양반들 할아버지가 첫 임금을 골랐다. 내 할아버지도.'],
			['Ask how the first one got here. Then you’ll know what they’re muttering about.', '첫 임금이 어디서 왔는지 물어봐라. 그럼 저 양반들이 뭘 투덜대는지 알 게다.']
		]),
		BOLD(
			'Silla’s newest king wears Tang silk. To see why the old houses mind, go back to a white horse kneeling in the grass…!',
			'신라의 새 임금은 당의 비단을 입는다. 늙은 가문들이 왜 그걸 못마땅해하는지 알려면, 풀밭에 무릎 꿇은 흰 말에게로 거슬러 올라가야 한다…!'
		)
	);
	t.retarget([['scene-bupmin-jahee-nagging-2', 'That’s my father coughing.']]);
});

// ───────────────────────── #53 Hyukgose ─────────────────────────
episode(53, 'six old men creep up on a horse', (t) => {
	t.replace(
		'After the fall of Old Joseon',
		P(
			'Seven hundred years before anyone in Surabol wore Tang silk, six old men creep up on a horse.',
			'서라벌의 누구도 당의 비단을 입기 칠백 년 전, 늙은이 여섯이 말 한 마리에게 살금살금 다가간다.'
		)
	);
	t.replace(
		'At a well in the hills, the horse knelt and cried.',
		P(
			'They are village chiefs, from six valleys in the hills. Their people came south over the mountains, from a kingdom in the north that stopped being a kingdom. That is another story, and an older one. This morning the six valleys have no king, and they keep arguing about it.',
			'그들은 산골 여섯 골짜기의 촌장이다. 그들의 백성은 북쪽, 더는 나라가 아니게 된 어느 나라에서 산을 넘어 내려왔다. 그건 다른 이야기, 더 오래된 이야기다. 오늘 아침 여섯 골짜기에는 임금이 없고, 그 일로 늘 다툰다.'
		)
	);
	const card = t.e.blocks.find((b) => b.kind === 'card' && b.person === 'hyukgose');
	t.remove('A young boy is born from the egg', '"person":"hyukgose","caption"', 'A white horse knelt and cried aloud; they dug the ground', 'Below Mount Yang, beside Najeong well');
	t.after(
		'Dig. What are you all doing? Dig.',
		P(
			'They dig with their hands, then with somebody’s hoe. Under the grass is an egg the size of a gourd, and the same shape. When it cracks there is a boy inside, already looking at them as if they were late.',
			'처음엔 손으로, 다음엔 누군가의 괭이로 판다. 풀 밑에 박만 한 알이 있다. 생김새도 박이다. 알이 갈라지자 사내아이가 있다. 벌써, 늦게 온 사람들을 보듯 그들을 쳐다본다.'
		),
		D('sobuldori', [['It’s a gourd. We dug up a gourd with a baby in it.', '박이네. 아기 든 박을 파냈어.']]),
		D('alpyung', [['Then that’s his name. Park. Gourd.', '그럼 그게 성이다. 박.']]),
		P(
			'They call him Park, for the gourd, and Hyukgose, to rule with brightness. Then six practical men look at each other and crown him king while he is still a boy. A boy, they reason, cannot have taken sides yet.',
			'박에서 나왔으니 박, 세상을 밝게 다스리라고 혁거세. 그러고는 실속 있는 사내 여섯이 서로를 보고, 아직 어린아이인 그를 임금으로 세운다. 아이라면 아직 어느 편도 들지 않았을 테니까.'
		),
		card
	);
	t.replace(
		'matched omen to matched omen',
		P(
			'A few years later, at Alyeongjeong well, a dragon with a chicken’s head leaves a girl behind. She has a beak where her lips should be, until they wash her in the north stream and it falls off. They name her Alyoung, after the well.',
			'몇 해 뒤, 알영정 우물가에서 닭 머리를 한 용이 여자아이 하나를 두고 간다. 입술 자리에 부리가 달려 있었는데, 북쪽 시내에 씻기자 떨어져 나간다. 우물 이름을 따 알영이라 부른다.'
		)
	);
	t.edit('"person":"alyoung","caption"', (b) => {
		b.caption = R(b.caption, 'Seorabeol', 'Surabol');
	});
	t.remove('Why did Old Joseon fall?');
	t.replace(
		'We’re going to create a brand new country',
		D('alpyung', [
			['We’re going to make a brand new country.', '우리는 아주 새로운 나라를 만들 것이오.'],
			['Every family cares for the others like one great house. Nobody left outside the gate.', '가문들이 한집안처럼 서로 돌보고, 누구도 문밖에 버려지지 않는 나라.'],
			['The royals watch over the people like their own children. The nobles are wise and righteous, and decide for the good of the nation.', '왕족은 백성을 제 자식처럼 보살피고, 귀족은 지혜롭고 의롭게 나라를 위해 판단하오.'],
			['And everyone else we divide into six ranks, according to their virtues.', '그리고 백성은 그 덕에 따라 여섯 등급으로 나누겠소.'],
			['A new unity…! Silla!', '새로운 하나 됨…! 신라요!']
		])
	);
	t.remove('The Royals will watch over all the people', 'The Nobles will be wise and righteous', 'We will divide the common people into 6 ranks');
	t.after(
		'A new unity…! Silla!',
		D('alyoung', [
			['According to their virtues.', '덕에 따라.'],
			['Who measures the virtue?', '그 덕은 누가 재오?']
		]),
		D('alpyung', [['Well— we do. The six of us.', '그야— 우리지. 우리 여섯이.']]),
		D('alyoung', [
			['Then say “by whoever is sitting at this table.”', '그럼 “이 상에 앉은 사람 마음대로”라고 하시오.'],
			['It’s shorter. And in three generations you’ll mean it.', '더 짧소. 그리고 세 대만 지나면 정말 그 뜻이 될 테니.']
		]),
		P(
			'The chiefs laugh, because it is a wedding. The boy king does not laugh. He looks at his bride as if somebody had finally said something interesting.',
			'촌장들은 웃는다. 혼인 잔치니까. 소년 임금은 웃지 않는다. 마침내 누군가 재미있는 말을 했다는 듯 신부를 바라본다.'
		)
	);
	t.remove('They say the first king learned love before law', '"kind":"table"');
	t.after(
		'and that is enough.',
		P(
			'They write the ranks down their way anyway. Alyoung is right, the way queens usually are, a few generations early. Ranks by virtue become ranks by birth. Ranks by birth become ranks by bone.',
			'그래도 그들은 등급을 자기들 식대로 적는다. 알영이 옳다. 왕비들이 대개 그렇듯, 몇 세대 일찍. 덕에 따른 등급은 태생에 따른 등급이 된다. 태생에 따른 등급은 뼈에 따른 등급이 된다.'
		),
		P(
			'Here is how bones work in Surabol. The egg’s line marries the rib’s line, and marries it again, until a child is royal on every side. That child is Sacred Bone. Royal on one side only is True Bone. Below that, the ranks go down like steps, and every step knows exactly who is above it.',
			'서라벌에서 뼈가 어떻게 돌아가는지 말해 주지. 알의 핏줄이 갈비뼈의 핏줄과 혼인하고, 또 혼인한다. 그러다 사방 어디로 보나 왕족인 아이가 난다. 그 아이가 성골이다. 한쪽만 왕족이면 진골이다. 그 아래로 등급이 계단처럼 내려가고, 계단마다 제 위에 누가 있는지 정확히 안다.'
		),
		P(
			'And the six who dug up the egg? Their grandchildren keep the oldest names in the country and, a few kings later, not the highest chairs. Kings arrive in eggs, chests and boxes. The six just came up out of the ground, like rice.',
			'그럼 알을 파낸 여섯은? 그 손자들은 이 나라에서 가장 오래된 성씨를 지킨다. 그리고 몇 임금 뒤에는, 가장 높은 자리는 지키지 못한다. 임금들은 알에서, 궤짝에서, 상자에서 온다. 여섯은 그냥 땅에서 올라왔다. 벼처럼.'
		)
	);
	t.edit('Sixty-one years later, the chronicle says', (b) => {
		b.html = R(b.html, 'Seorabeol', 'Surabol');
		b.ko = R(b.ko, '서라벌 사람들은', '서라벌 사람들은');
	});
	t.remove('He ruled the country sixty-one years, and the king rose up to heaven.');
	t.card(
		SCENE('The Coronation Year', '즉위하던 해'),
		P(
			'Back in the coronation yard, Alchun finishes the story the way the old houses always do, a little too pleased with the ending.',
			'다시 즉위식 마당. 알천은 늙은 가문들이 늘 하듯 이야기를 끝맺는다. 결말이 조금 지나치게 흐뭇한 얼굴로.'
		),
		D('alchun', [
			['So that’s the Six Elders, lad. My grandfather’s grandfather was one of them. So was Bidam’s.', '그게 육촌이다, 얘야. 내 윗대 할아버지가 그중 하나였다. 비담네도 그랬고.'],
			['When Bidam said he was Six-Elder blood, he meant he was here before the egg. Before any of you.', '비담이 육촌 피라 한 건, 알보다 먼저 여기 있었다는 소리다. 너희 누구보다도 먼저.']
		]),
		D('munmu', [['He also said there was no Kim.', '김씨는 없었다고도 했습니다.']]),
		D('alchun', [
			['There wasn’t. Not that morning.', '없었지. 그날 아침엔.'],
			['Ask your father about that one. He likes a story.', '그건 네 아버지한테 물어라. 이야기 좋아하잖냐.']
		]),
		D(
			'chunchu',
			[
				['The egg is the polite one, Bupmin.', '알 이야기는 점잖은 쪽이다, 법민아.'],
				['The next house to wear this crown came in on the tide, and stole the house we’re standing in.', '이 왕관을 쓴 다음 집안은 밀물을 타고 왔다. 그리고 우리가 지금 서 있는 이 집을 훔쳤지.']
			],
			{ look: 'king' }
		),
		BOLD('A chest rides the tide in, a magpie screaming over it. Whatever is inside needs a house. Preferably someone else’s…!', '밀물을 타고 궤짝 하나가 들어온다. 까치 한 마리가 그 위에서 울어 댄다. 안에 든 놈은 집이 필요하다. 되도록이면 남의 집이…!')
	);
	t.retarget([
		['white-horse', 'a white horse folded onto its knees'],
		['hyukgose-eggshell-arc', 'to rule with brightness'],
		['hyukgose-six-chiefs-crown', 'crown him king while he is still a boy'],
		['hyukgose-alyoung-love', 'one person to cherish'],
		['hyuk-ink-egg-open', 'When it cracks there is a boy inside'],
		['chunma-rises', 'Then it looks up and sees six grown men']
	]);
});

// ───────────────────────── #54 Talhae ─────────────────────────
episode(54, 'including the one who has just moved in', (t) => {
	t.edit('A thousand li north-east of Wa', (b) => {
		b.html = R(b.html, 'A thousand li north-east of Wa,', 'A thousand li north-east of Wa, the islands across the sea,');
		b.ko = R(b.ko, '왜에서 동북쪽으로 천 리,', '바다 건너 섬나라 왜에서 동북쪽으로 천 리,');
	});
	t.remove('Talhae was born in the land of Dapana', 'Nobody knows this child’s surname.', 'He looked at Hogong’s house below Mount Yang');
	t.edit('every king of Silla lives in a stolen house', (b) => {
		b.html = R(b.html, 'every king of Silla lives in a stolen house.', 'every king of Silla lives in a stolen house, including the one who has just moved in.');
		b.ko = R(b.ko, '신라의 모든 왕은 훔친 집에 산다.', '신라의 모든 왕은 훔친 집에 산다. 방금 이사 들어온 임금까지.');
	});
	t.before(
		'“Hogong. There’s a rooster in the woods.”',
		SCENE('The Moon Palace', '월성'),
		P(
			'Seven hundred years later, King Muyeol spends his first night in the stolen house awake. He keeps listening for someone digging by the gate.',
			'칠백 년 뒤, 무열왕은 훔친 집에서의 첫날 밤을 뜬눈으로 보낸다. 누가 대문 옆을 파는 소리가 나지 않나 자꾸 귀를 기울인다.'
		),
		D('munhee', [
			['Nobody is digging, Your Majesty. Go to sleep.', '아무도 안 팝니다, 전하. 주무세요.'],
			['And if a rooster crows, it’s a rooster.', '닭이 울면 그냥 닭입니다.']
		])
	);
});

// ───────────────────────── #55 Alji ─────────────────────────
episode(55, 'Bidam said there was no Kim', (t) => {
	t.replace(
		'In the ninth year of his reign King Talhae wakes in the night',
		P(
			'Bidam said there was no Kim. He was right for about a hundred and twenty years. Then, one spring night, King Talhae wakes to a rooster crowing in the woods west of the city.',
			'비담은 김씨가 없었다고 했다. 백이십 년쯤은 그 말이 맞았다. 그러다 어느 봄밤, 탈해왕이 도성 서쪽 숲에서 닭이 우는 소리에 잠을 깬다.'
		)
	);
	t.remove('Ninth year, spring, third month: in the night the king heard a cock crowing', 'When he grew up he was bright and full of wise plans');
	t.edit('It takes his line seven generations to reach the crown.', (b) => {
		b.html += ' Many generations after that, one of them is a man named Chunchu.';
		b.ko += ' 그로부터 또 여러 대 뒤, 그 가운데 하나가 춘추라는 사내다.';
	});
	t.edit('the steam says the same word every time it leaves the water', (b) => {
		b.html = 'Under a certain hill beyond the city, the steam says the same word every time it leaves the water. Kim. It will be a long time before anybody answers it.';
		b.ko = '도성 너머 어느 언덕 아래에서는, 김이 물을 떠날 때마다 같은 말을 한다. 김. 누군가 그 말에 대답하기까지는 아직 오래 걸릴 것이다.';
	});
	t.card(
		SCENE('Gyerim', '계림'),
		P(
			'In the coronation year the wood is still there, beside the Moon Palace. After dark the new king walks his son through it.',
			'즉위하던 해에도 그 숲은 월성 곁에 그대로 있다. 해가 지면 새 임금이 아들과 함께 그 숲을 걷는다.'
		),
		D(
			'chunchu',
			[
				['Park came out of an egg. Seok came out of a chest and stole a house. We came out of a box and waited seven generations for a chair.', '박씨는 알에서 나왔다. 석씨는 궤짝에서 나와 집을 훔쳤고. 우리는 상자에서 나와 의자 하나를 일곱 대나 기다렸다.'],
				['Every house that ever wore this crown arrived in something. That’s why they count bones here, Bupmin.', '이 왕관을 쓴 집안은 모두 무언가를 타고 왔다. 그래서 여기서는 뼈를 세는 거다, 법민아.'],
				['The people who were here first need something to count.', '먼저 와 있던 사람들한테는 셀 것이 있어야 하거든.']
			],
			{ look: 'king' }
		),
		D('munmu', [['And you, Father? You didn’t come out of anything.', '그럼 아버님은요? 아무것도 타고 오지 않으셨잖습니까.']]),
		D(
			'chunchu',
			[
				['No. Tired men in Tang silk voted me in.', '그래. 나는 당나라 비단 입은 지친 사내들이 뽑았지.'],
				['So I’ll have to earn it the vulgar way. Three kingdoms, one crown.', '그러니 천한 방식으로 벌어야지. 세 나라, 왕관 하나.'],
				['Starting with the one that keeps knocking.', '늘 문을 두드리는 나라부터.']
			],
			{ look: 'king' }
		),
		BOLD(
			'Across the border in Sabi, a funeral bell. For three years the king can’t sign a thing. The clans already have a list…!',
			'국경 너머 사비에 상종이 울린다. 삼 년 동안 임금은 도장 하나 찍지 못한다. 가문들 손에는 이미 명단이 있다…!'
		)
	);
	t.retarget([['alji-ink-night-rooster', 'wakes to a rooster crowing in the woods west of the city']]);
});

// ───────────────────────── second pass: #48 length, #55 middle ─────────────────────────
trim(48, 'Greater China Co-Prosperity Sphere', (t) => {
	const inmunCard = t.e.blocks.find((b) => b.kind === 'card' && b.person === 'inmun');
	t.remove(
		'The banner over the lodging gate once read',
		'That one over the lodging gate. Read it for me.',
		'"person":"inmun","caption"',
		'Greater China Co-Prosperity Sphere',
		'Co-prosperity. Prospering together.',
		'I think it’s there for us to read.',
		'When the big house offers to share the harvest',
		'"diagram":"tang-imperial"',
		'seeing that Chunchu’s bearing was outstanding'
	);
	t.before('Inmun reads the register over the man’s shoulder.', inmunCard);
	t.edit('Inside each, five households make a <i>bao</i>', (b) => {
		b.html = R(b.html, ' Inside each, five households make a <i>bao</i>, and every one of them answers for the other four.', '');
		b.ko = R(b.ko, ' 방 안에서는 다섯 집이 한 보(保)를 이루고, 다섯 집 모두가 나머지 넷을 책임진다.', '');
	});
	t.edit('Half of it is not even allowed on a banner.', (b) => {
		b.html = R(b.html, ' Half of it is not even allowed on a banner.', '');
		b.ko = R(b.ko, ' 그 반쪽은 현수막에도 못 오른다.', '');
	});
	t.remove('Chunchu files the name the way he files everything in this city.');
	t.remove('A man does not agree to stop being emperor.');
	t.edit('An old minister of Ours said it every morning', (b) => {
		const i = b.en.findIndex((x) => x.startsWith('An old minister of Ours'));
		b.en.splice(i, 1);
		b.lines.splice(i, 1);
	});
	t.remove('You Samhan people have the strangest notions of government.', 'Chunchu laughs because the insult is also a compliment');
	t.remove(
		'If my father keeps you in that hall any longer',
		'If I fall and die, your father will declare war',
		'I am told you are good at not dying',
		'Southern bamboo. Steamed three times.',
		'A good club is not the forest',
		'Then one more round with your marriage.',
		'some alliances are written in edicts'
	);
	t.edit('They play gyuku until the dust makes them the same colour.', (b) => {
		b.html =
			'They play gyuku until the dust makes them the same colour. Li Zhi talks like a man who has waited his whole life to be ordinary with somebody dangerous. Chunchu lets him.';
		b.ko = '그들은 먼지가 같은 색깔이 될 때까지 격구를 한다. 이치는 평생 위험한 누군가와 평범해지기를 기다린 사람처럼 말한다. 춘추는 그걸 허락한다.';
	});
	t.remove('The doors close behind them on a corridor so long');
	t.edit('A warlord held the whole of the west', (b) => {
		const i = b.en.findIndex((x) => x.includes('A warlord held the whole of the west'));
		b.en.splice(i, 1);
		b.lines.splice(i, 1);
	});
	t.remove('LUXURY IS THE ENEMY');
	t.edit('It is a farewell banquet, so every official', (b) => {
		b.html = R(b.html, 'It is a farewell banquet, so every official of the third rank and above must attend and look pleased. ', '');
		b.ko = R(b.ko, '전별연이라, 삼품 이상 관원은 모두 나와 즐거운 얼굴을 해야 한다. ', '');
	});
	t.edit('Chunchu makes the joke because he can feel', (b) => {
		b.html =
			'Chunchu makes the joke because he can feel the man needs to be laughed with, now, or the moment will curdle into something neither of them can carry out of the room.';
		b.ko = '춘추가 농담을 하는 것은, 이 사람이 바로 지금 함께 웃어 줄 상대를 필요로 한다는 것이 느껴지기 때문이다. 그러지 않으면 이 순간은 둘 중 누구도 방 밖으로 들고 나갈 수 없는 무엇으로 상해 버린다.';
	});
	t.retarget([
		['go-game', 'After the hall, a smaller room. A go board.'],
		['six-steeds-gallery', 'dismisses the lamp-bearers'],
		['scene-taizong-1', 'dismisses the lamp-bearers']
	]);
});

episode(55, 'Gold doesn’t rust', (t) => {
	t.before(
		'It takes his line seven generations to reach the crown.',
		P(
			'The boy grows up in the palace, quick and easy to like. The court notices. Talhae has sons of his own. He also has ministers who can count.',
			'아이는 궁에서 자란다. 영리하고, 미워하기 어렵다. 조정이 눈여겨본다. 탈해에게는 제 아들들이 있다. 셈할 줄 아는 대신들도 있다.'
		),
		D('talhae', [
			['Alji. The ministers say Heaven sent you to me as an heir.', '알지. 대신들이 하늘이 그대를 내 후사로 보냈다 하오.'],
			['Heaven sends a great many things. It sent me a magpie.', '하늘은 이것저것 많이도 보내지. 나한텐 까치를 보냈어.'],
			['So. Do you want the chair?', '그래서. 그 의자, 원하시오?']
		]),
		D('alji', [
			['…No, Majesty.', '……아니옵니다, 폐하.'],
			['Your sons were here first.', '폐하의 아드님들이 먼저 와 계셨습니다.']
		]),
		D('talhae', [
			['Ha! First. I came in a chest. You came in a box.', '하! 먼저라. 나는 궤짝 타고 왔고, 그대는 상자 타고 왔소.'],
			['Nobody in this palace was here first except six old men, and they don’t want the chair either.', '이 궁에서 먼저 와 있던 건 늙은이 여섯뿐인데, 그 양반들도 이 의자는 마다하오.']
		]),
		D('alji', [['Then I’ll wait.', '그럼 기다리겠습니다.']]),
		D('talhae', [['How long?', '얼마나?']]),
		D('alji', [['As long as it takes. Gold doesn’t rust, Majesty.', '걸리는 만큼요. 금은 녹슬지 않으니까요, 폐하.']])
	);
	t.edit('It takes his line seven generations to reach the crown.', (b) => {
		b.html = R(b.html, 'Talhae has sons of his own and does not give Alji the throne, and Alji, by every account, does not ask for it.', 'So Alji does not get the throne, and by every account he never asks again.');
		b.ko = R(b.ko, '탈해에게는 제 아들들이 있어 알지에게 왕위를 주지 않고, 어느 기록을 보아도 알지는 그것을 청하지 않는다.', '그래서 알지는 왕위를 받지 않고, 어느 기록을 보아도 다시는 청하지 않는다.');
	});
});
