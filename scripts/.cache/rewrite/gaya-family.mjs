/**
 * #14 / #45 / #52: the family line ("Pregnant with an unknown man's child… what a disgrace!"), word for word each time.
 * #45: Sukhuljong and Manmyung as a real family fight; one more beat on the ride north.
 * #43: Daegaya's last stand, and Muryuk with Sadaham among the cut ropes.
 * Idempotent: each step checks for its own marker first.
 */
import { editStory } from '../story-ops.mjs';

const LINE_EN = 'Pregnant with an unknown man’s child… what a disgrace!';
const LINE_KO = '누군지도 모를 사내의 아이를 배다니… 이 무슨 망신이냐!';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, ko) => ({ kind: 'dialogue', person, en, lines: ko });
const voice = (speaker, en, ko) => ({ kind: 'dialogue', speaker, en, lines: ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const english = (b) => [b.html, ...(b.en ?? []), b.label].filter(Boolean).join(' ');
const at = (blocks, text, from = 0) => blocks.findIndex((b, i) => i >= from && english(b).includes(text));
const has = (blocks, text) => at(blocks, text) >= 0;

editStory((story) => {
	const ep = (n) => story.flatMap((c) => c.entries)[n - 1];
	let changed = 0;

	/* —— #14 Munhee: Yushin at the pyre —— */
	{
		const b = ep(14).blocks;
		const i = b.findIndex((x) => x.kind === 'dialogue' && x.person === 'yushin' && /disgrace/.test((x.en ?? []).join(' ')));
		if (i >= 0 && b[i].en[0] !== LINE_EN) {
			b[i].en[0] = LINE_EN;
			b[i].lines[0] = LINE_KO;
			changed++;
		}
	}

	/* —— #45 Seohyun: the fight in Sukhuljong's hall —— */
	{
		const b = ep(45).blocks;
		const a = at(b, 'Muryuk’s boy.');
		const z = at(b, 'Take her to the back house.');
		if (a >= 0 && z >= a) {
			b.splice(
				a,
				z - a + 1,
				say('sukhuljong', ['Sit.'], ['앉아.']),
				say('manmyung', ['I’ll stand.'], ['서 있을게요.']),
				say('sukhuljong', ['The charcoal man has told the whole street.', 'Of all the people in this city. The charcoal man.'], ['숯장수가 온 동네에 다 떠들고 다닌다.', '이 서라벌에 사람이 그렇게 많은데. 하필 숯장수가.']),
				say('manmyung', ['He does sell good charcoal.'], ['그 집 숯은 좋아요.']),
				say('sukhuljong', [LINE_EN], [LINE_KO]),
				say('manmyung', ['Unknown? Father, you just told me who sold the charcoal.', 'Half of Surabol watched him ride past our gate. Three times in one morning.'], ['모를 사내요? 아버지, 숯장수 얘기까지 다 하셨잖아요.', '서라벌 절반이 그 사람 말 타고 우리 문 앞 지나가는 거 봤어요. 하루 아침에 세 번.']),
				say('sukhuljong', ['Muryuk’s boy. The cart family.'], ['무력의 아들. 수레 타고 올라온 집.']),
				say('manmyung', ['Grandfather came in a sedan chair. That’s a cart with a roof.'], ['할아버지는 가마 타고 오셨잖아요. 지붕 달린 수레요.']),
				say('sukhuljong', ['…He leaves for Manno.'], ['…그 녀석, 만노로 떠난다지.']),
				say('manmyung', ['I know. I’m going with him.'], ['알아요. 저도 가요.']),
				say('sukhuljong', ['You’re going to the back house.'], ['넌 뒷채로 간다.']),
				say('manmyung', ['Don’t blame him. It was me. He’d still be apologising to the horse.', 'I lifted the bar myself. Every night.'], ['그 사람 탓하지 마세요. 저예요. 그 사람은 아직도 말한테 사과하고 있을걸요.', '빗장도 제가 열었어요. 매일 밤.']),
				say('sukhuljong', ['…Every night?'], ['…매일 밤?']),
				say('manmyung', ['Every night.'], ['매일 밤.']),
				say('sukhuljong', ['Take her to the back house.', 'And somebody fix that bar.'], ['뒷채로 데려가라.', '그리고 누가 그 빗장 좀 고쳐 놔라.'])
			);
			changed++;
		}
		const k = at(b, 'Now we can go.');
		if (k >= 0 && !has(b, 'He’ll pretend to be furious for a year')) {
			b.splice(
				k + 1,
				0,
				say('seohyeon', ['Your father will send riders.'], ['아버님이 사람을 보내실 거예요.']),
				say('manmyung', ['Let him. He’ll pretend to be furious for a year.', 'Then he’ll write and ask what the baby’s called.'], ['보내라 그래. 일 년은 화난 척하실 거야.', '그다음엔 편지로 애 이름이 뭐냐고 물으시겠지.']),
				say('seohyeon', ['…What baby?'], ['…무슨 애요?']),
				say('manmyung', ['Ride, Seohyun.'], ['가, 서현.'])
			);
			changed++;
		}
	}

	/* —— #43 Muryuk: Daegaya's last stand, and the night after —— */
	{
		const b = ep(43).blocks;
		const g = at(b, 'He walks to the gate with his helm in his hand.');
		if (g >= 0 && !has(b, 'The wall answers first.')) {
			b.splice(
				g,
				1,
				p(
					'The wall answers first. Gaya arrows, from Gaya bows, with Gaya iron on the points. Daegaya has been forging Silla’s blades for a generation and is about to find out how good they were.',
					'성벽이 먼저 답한다. 가야의 활로 쏜 가야의 화살, 촉에는 가야의 쇠. 대가야는 한 세대 동안 신라의 칼을 벼려 왔고, 이제 그 칼이 얼마나 좋았는지 알게 될 참이다.'
				),
				p(
					'Sadaham does not wait for anyone to finish a sentence. He takes five thousand horse at the Jeondan gate while the men above it are still drawing, and goes through before the gate has decided whether it is open.',
					'사다함은 누가 말을 끝내기를 기다리지 않는다. 기병 오천을 이끌고 전단문으로 달려드는데, 성 위의 사내들은 아직 시위를 당기는 중이다. 문이 열렸는지 닫혔는지 정하기도 전에 그는 이미 안에 있다.'
				),
				voice('A Daegaya archer', ['That’s a child. They sent a child—', 'He’s inside. How is he inside?'], ['애잖아. 애를 보냈어—', '안에 들어왔어. 어떻게 벌써 안이야?']),
				p(
					'Inside the walls the fighting is short and mean, street by street, the way it is when everyone knows the end and nobody wants to be the one who says it. Muryuk walks up the main street with his helm in his hand. Nobody on the rooftops knows what to do with a Gaya face under a Silla banner.',
					'성안의 싸움은 짧고 독하다. 골목마다, 다들 끝을 알면서 그 말을 먼저 꺼내고 싶지 않을 때의 싸움이다. 무력은 투구를 손에 든 채 큰길을 걸어 올라간다. 지붕 위 누구도 신라 깃발 아래의 가야 얼굴을 어찌해야 할지 모른다.'
				),
				p('He finds the old lords of Daegaya in the hall, sitting very straight, the way men sit when they have decided to die well and have not yet been told the price of living.', '그는 대가야의 늙은 귀족들을 전각에서 찾는다. 다들 꼿꼿이 앉아 있다. 잘 죽기로 마음먹었는데, 살아남는 값은 아직 듣지 못한 사람들의 앉음새다.'),
				voice('An old lord of Daegaya', ['Geumgwan’s youngest.', 'So they sent you to say it.'], ['금관의 막내로구나.', '그 말 하라고 너를 보냈나.']),
				say('muryuk', ['Nobody sent me. I asked to come.'], ['보낸 사람 없습니다. 제가 오겠다고 했습니다.']),
				voice('An old lord of Daegaya', ['What is it like? Over there.'], ['어떠냐. 저쪽은.']),
				say('muryuk', ['Cold, for the first ten years.', 'Then you have grandchildren, and they don’t remember the cold.'], ['처음 십 년은 춥습니다.', '그러다 손주가 생기는데, 그 애들은 추웠던 걸 기억 못 합니다.']),
				p('The old man looks at him for a long time. Gaya has always listened to a good price.', '노인은 오래도록 그를 바라본다. 가야는 언제나 좋은 값에는 귀를 기울였다.')
			);
			changed++;
		}
		const c = at(b, 'It is the first Silla habit he has ever liked.');
		if (c >= 0 && !has(b, 'The Cut Rope')) {
			b.splice(
				c + 1,
				0,
				scene('The Cut Rope', '끊긴 밧줄'),
				p(
					'That night the freed captives sleep in the Silla camp, because they have nowhere else to sleep. Muryuk finds the boy-general sitting on a coil of the rope he cut, eating rice out of his helmet.',
					'그날 밤 풀려난 포로들은 신라 진영에서 잔다. 달리 잘 데가 없어서다. 무력은 소년 장수가 자기가 끊은 밧줄 더미 위에 앉아 투구에 담은 밥을 먹고 있는 것을 찾는다.'
				),
				say('sadaham', ['You’re the Gaya one.'], ['가야 분이시죠.']),
				say('muryuk', ['So they keep telling me.'], ['다들 그렇게 부르더군.']),
				say('sadaham', ['Were any of them yours? The ones on the rope.'], ['그중에 아는 사람 있었어요? 줄에 묶였던 사람들.']),
				say('muryuk', ['All of them. None of them.', 'My father sold the harbour before I was old enough to lift a sword for it.'], ['전부. 아무도 아니고.', '내가 칼 들 나이가 되기도 전에 아버지가 항구를 넘기셨으니.']),
				say('sadaham', ['You walked up to that gate with your helmet off.', 'I’d have been shot.'], ['아까 투구 벗고 성문으로 걸어 올라가셨잖아요.', '저였으면 맞았을 거예요.']),
				say('muryuk', ['You’d have charged it. They were waiting for that.', 'Why let them go?'], ['넌 돌격했겠지. 저들은 그걸 기다리고 있었다.', '왜 풀어 줬나?']),
				say('sadaham', ['Mugwan says I’m showing off.'], ['무관이는 제가 잘난 척한대요.']),
				say('muryuk', ['Are you?'], ['그런가?']),
				say('sadaham', ['…A little.', 'Somebody should get to go home. Today it might as well be them.'], ['…조금요.', '누군가는 집에 가야죠. 오늘은 저 사람들이면 되잖아요.']),
				p(
					'Muryuk sits down on the rope beside him. Across the river, Daegaya’s roofs are still smoking.',
					'무력은 그 옆 밧줄 위에 앉는다. 강 건너 대가야의 지붕들에서 아직 연기가 오른다.'
				),
				say('muryuk', ['When I was younger than you, they put me in a cart and told me to face front.', 'I looked back the whole way. I thought somebody should remember what it looked like.'], ['너보다 어렸을 때 나를 수레에 태우고 앞만 보라 하더군.', '나는 가는 내내 뒤를 봤다. 누군가는 어떤 모습이었는지 기억해야 한다고 생각했지.']),
				say('sadaham', ['Then look. Nobody’s stopping you tonight.', 'I’ll hold your horse.'], ['그럼 보세요. 오늘 밤엔 아무도 안 말려요.', '말은 제가 잡고 있을게요.']),
				p('So he looks. The boy holds the horse and, for once in his short life, does not say anything at all.', '그래서 그는 본다. 소년은 말을 잡고 서서, 그 짧은 생에 처음으로, 아무 말도 하지 않는다.'),
				say('muryuk', ['…There.', 'Now I can face front.'], ['…됐다.', '이제 앞을 볼 수 있겠다.']),
				say('muryuk', ['Live long enough to be embarrassed by tonight, Sadaham.'], ['오늘 밤이 부끄러워질 만큼 오래 살아라, 사다함.']),
				say('sadaham', ['Mugwan will be embarrassed for both of us.'], ['무관이가 둘 몫으로 부끄러워해 줄 거예요.']),
				p('Neither of them knows how short a year can be.', '한 해가 얼마나 짧을 수 있는지, 두 사람 다 아직 모른다.')
			);
			changed++;
		}
	}

	/* —— #52 Jahee: Seonpum's performance —— */
	{
		const b = ep(52).blocks;
		const s = b.findIndex((x) => x.kind === 'scene' && /Coronation Year/.test(x.label ?? ''));
		if (s >= 0 && !has(b, 'The Quay, Again')) {
			b.splice(
				s,
				0,
				scene('The Quay, Again', '다시, 포구'),
				p(
					'He comes back in the spring to fix his sums. The sums are fine. By midsummer Jahee is not fine, in the way that shows, and her father picks the busiest hour on the quay to notice.',
					'그는 봄에 셈을 고치러 돌아온다. 셈은 멀쩡하다. 한여름이 되자 자희가 멀쩡하지 않다. 눈에 띄는 쪽으로. 아버지는 포구가 가장 붐비는 시각을 골라 그걸 알아챈다.'
				),
				say('seonpum', [LINE_EN, 'In front of the whole harbour!'], [LINE_KO, '온 포구 사람들 앞에서!']),
				say('jayi', ['Father. Everyone on this quay can count.', 'You taught them.'], ['아버지. 이 포구 사람들 다 셈할 줄 알아요.', '아버지가 가르치셨잖아요.']),
				say('seonpum', ['Not a word from you. Whose is it? Name him!'], ['넌 입 다물어라. 누구냐? 이름을 대!']),
				say('munmu', ['…Mine. Sir. I’m the— it’s mine.', 'I’m the unknown man.'], ['…제 겁니다. 어르신. 제가— 제 아이입니다.', '제가 그 모를 사내입니다.']),
				say('seonpum', ['The prince. Well.', 'What a terrible shock.'], ['왕자님이시라. 허어.', '이거 참 끔찍하게 놀랍구먼.']),
				p(
					'He has had wedding silk folded in a chest since the night of the forty sacks. In the Marshal’s family this is practically a proposal. The prince’s mother managed hers with a bonfire. His grandmother did it through a drain.',
					'그는 마흔 섬이 빈 그 밤부터 혼례 비단을 궤짝에 접어 넣어 두었다. 대장군 집안에서는 이게 거의 청혼이다. 왕자의 어머니는 모닥불로 해냈고, 할머니는 하수구로 해냈다.'
				)
			);
			changed++;
		}
	}

	console.log('changed', changed);
	return changed ? undefined : false;
});
