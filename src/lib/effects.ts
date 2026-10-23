/**
 * Every animation effect the reader can play, named and explained for the
 * widgets gallery: the full-screen weathers, the one-time moments, the
 * message-bubble tones and the way script lines arrive in each kind of scene.
 * The previews run the real code (`EffectPreview`), so this file only says
 * what each effect is and when it plays.
 */
import type { Moment, Weather } from '$lib/story';
import type { BubbleTone } from '$lib/floatIn';
import type { TextMood } from '$lib/sceneMood';

export type EffectKind = 'weather' | 'moment' | 'bubble' | 'entrance';

export const EFFECT_KINDS: { kind: EffectKind; label: string; ko: string }[] = [
	{ kind: 'weather', label: 'Weather', ko: '날씨' },
	{ kind: 'moment', label: 'Moment', ko: '순간' },
	{ kind: 'bubble', label: 'Message bubble', ko: '말풍선' },
	{ kind: 'entrance', label: 'Script entrance', ko: '대사 등장' }
];

type Text = { en: string; ko: string };

type About = {
	id: string;
	name: Text;
	/** What the reader sees. */
	describe: Text;
	/** When it plays. */
	when: Text;
};

export type Effect = About &
	(
		| { kind: 'weather'; weather: Weather }
		| { kind: 'moment'; moment: Moment }
		| { kind: 'bubble'; tone: BubbleTone; person: string; line: Text; weather?: Weather }
		| { kind: 'entrance'; mood: TextMood; sample: Text }
	);

const weather = (w: Weather, name: Text, describe: Text, when: Text): Effect => ({
	id: `weather-${w}`,
	kind: 'weather',
	weather: w,
	name,
	describe,
	when
});

export const EFFECTS: Effect[] = [
	weather(
		'embers',
		{ en: 'Embers', ko: '불티' },
		{
			en: 'Sparks lift off a burning field and drift up past the text, under a low orange glow.',
			ko: '불타는 들판에서 불티가 일어 글자 뒤로 떠오르고, 아래에 낮은 주홍빛이 깔린다.'
		},
		{
			en: 'Every battle: sieges, charges, sea fights, the night a city burns.',
			ko: '모든 전투. 공성, 돌격, 해전, 도성이 불타는 밤.'
		}
	),
	weather(
		'rain',
		{ en: 'Rain', ko: '비' },
		{
			en: 'Steady slanted rain with a wet haze, as if the page were a window.',
			ko: '비스듬히 내리는 비와 젖은 안개. 화면이 창문이 된다.'
		},
		{
			en: 'The last nights of Bidam’s rebellion, the queen’s death, a funeral, the palace steps in the rain.',
			ko: '비담의 난 마지막 밤들, 여왕의 죽음, 장례, 비 내리는 궁 계단.'
		}
	),
	weather(
		'storm',
		{ en: 'Storm', ko: '폭풍' },
		{
			en: 'Heavier rain, and every few seconds the whole screen goes white with lightning.',
			ko: '더 거센 비. 몇 초마다 번개가 화면 전체를 하얗게 친다.'
		},
		{
			en: 'Out on Gunhae, and the worst nights between the camps in the rebellion.',
			ko: '군해 위, 그리고 반란 중 두 진영 사이의 가장 험한 밤.'
		}
	),
	weather(
		'snow',
		{ en: 'Snow', ko: '눈' },
		{
			en: 'Slow snow falling through a cold haze.',
			ko: '찬 안개 사이로 천천히 내리는 눈.'
		},
		{
			en: 'Commander Yeon on the northern wall, Ansi in winter, the frozen rivers on the road to Pyongyang.',
			ko: '북쪽 장성의 연 장군, 겨울의 안시성, 평양 가는 길의 언 강.'
		}
	),
	weather(
		'blood',
		{ en: 'Blood', ko: '피' },
		{
			en: 'Red haze closes in from the edges, blood drips down from the top, and every new beat flashes the frame red and throws a splatter.',
			ko: '붉은 안개가 가장자리에서 조여 오고, 위에서 피가 흘러내리며, 장면이 넘어갈 때마다 화면이 붉게 번쩍이고 피가 튄다.'
		},
		{
			en: 'Yeon’s Massacre, from the moment every door in the hall closes.',
			ko: '연개소문의 정변. 연회장의 문이 모두 닫히는 순간부터.'
		}
	),
	weather(
		'love',
		{ en: 'Peach petals', ko: '복사꽃잎' },
		{
			en: 'Peach-blossom petals tumble down under a soft pink light.',
			ko: '부드러운 분홍빛 아래로 복사꽃잎이 흩날린다.'
		},
		{
			en: 'Flirting and courtship: a wedding, a coat mended, “Stop the chariot.”',
			ko: '밀고 당기는 장면과 구애. 혼례, 고쳐 준 겉옷, “수레를 멈춰.”'
		}
	),
	weather(
		'heat',
		{ en: 'Heat', ko: '열기' },
		{
			en: 'A pink haze breathes in and out at the edges while hearts and petals rise.',
			ko: '가장자리의 분홍 안개가 숨 쉬듯 일렁이고 하트와 꽃잎이 떠오른다.'
		},
		{
			en: 'Seduction scenes that stay clothed: the copper room, the room upstairs.',
			ko: '옷은 입은 채인 유혹의 장면. 구리 방, 위층 방.'
		}
	),
	weather(
		'ash',
		{ en: 'Ash', ko: '재' },
		{
			en: 'Grey ash drifting down through a pale haze after the fire is out.',
			ko: '불이 꺼진 뒤 옅은 안개 사이로 잿빛 재가 내려앉는다.'
		},
		{
			en: 'The morning after a fall: Daeya, Falling Flower Rock.',
			ko: '함락 다음 날 아침. 대야성, 낙화암.'
		}
	),
	weather(
		'mist',
		{ en: 'Mist', ko: '안개' },
		{
			en: 'A warm haze with a few slow lights in it.',
			ko: '느린 불빛 몇 점이 떠 있는 따뜻한 안개.'
		},
		{
			en: 'Tagged by hand for dreams and visions. No episode uses it yet.',
			ko: '꿈과 환상 장면에 직접 붙인다. 아직 쓰는 회차는 없다.'
		}
	),
	weather(
		'cavern',
		{ en: 'Cavern', ko: '동굴' },
		{
			en: 'Dark-blue steam with spirit motes floating up through it.',
			ko: '짙푸른 김 사이로 정령의 빛 알갱이가 떠오른다.'
		},
		{
			en: 'The steam caverns of the three goddesses.',
			ko: '세 여신의 김 서린 동굴.'
		}
	),
	weather(
		'beyond',
		{ en: 'The Beyond', ko: '저승' },
		{
			en: 'The colour drains out of everything on screen, text included, and pale motes rise.',
			ko: '글자까지 화면의 모든 색이 빠지고 창백한 빛 알갱이가 떠오른다.'
		},
		{
			en: 'Whenever a reaper is in the room: Kangrim, Haewonmek, Yumla.',
			ko: '저승사자가 곁에 있을 때. 강림, 해원맥, 염라.'
		}
	),
	{
		id: 'moment-first-sight',
		kind: 'moment',
		moment: 'first-sight',
		name: { en: 'Love at first sight', ko: '첫눈에 반하다' },
		describe: {
			en: 'Once only: the screen blooms pink, a heartbeat knocks twice from the centre, and petals burst outward.',
			ko: '단 한 번. 화면이 분홍으로 피어나고, 한가운데서 심장이 두 번 뛰고, 꽃잎이 터져 나간다.'
		},
		when: {
			en: 'The line where someone looks and falls: Haemosu over the Amnok, Suro’s “Who is that.”',
			ko: '누군가 보고 반하는 그 줄. 압록 위의 해모수, 수로의 “저건 누구요.”'
		}
	},
	{
		id: 'moment-death',
		kind: 'moment',
		moment: 'death',
		name: { en: 'Death', ko: '죽음' },
		describe: {
			en: 'Once only: something pale rises from the page and leaves.',
			ko: '단 한 번. 창백한 무언가가 화면에서 떠올라 떠난다.'
		},
		when: {
			en: 'The moment a reaper arrives for someone.',
			ko: '저승사자가 누군가를 데리러 오는 순간.'
		}
	},
	{
		id: 'bubble-pop',
		kind: 'bubble',
		tone: 'pop',
		person: 'chunchu',
		line: { en: 'You’re late.', ko: '늦었네.' },
		name: { en: 'Pop', ko: '톡' },
		describe: {
			en: 'The bubble springs up from its tail and settles, like a text arriving.',
			ko: '말풍선이 꼬리에서 튀어 올라 자리를 잡는다. 문자가 도착하듯.'
		},
		when: { en: 'Most lines.', ko: '대부분의 대사.' }
	},
	{
		id: 'bubble-loud',
		kind: 'bubble',
		tone: 'loud',
		person: 'euija',
		line: { en: 'Bring me more wine!', ko: '술 더 가져와라!' },
		name: { en: 'Shout', ko: '고함' },
		describe: {
			en: 'The bubble swells huge, then shrinks back to size.',
			ko: '말풍선이 크게 부풀었다가 제 크기로 돌아온다.'
		},
		when: {
			en: 'A short line with an exclamation mark, a double “!!”, or a word in capitals.',
			ko: '느낌표가 붙은 짧은 대사, “!!”, 대문자로 쓴 말.'
		}
	},
	{
		id: 'bubble-slam',
		kind: 'bubble',
		tone: 'slam',
		person: 'gesomun',
		weather: 'blood',
		line: { en: 'SHUT THE DOORS!', ko: '문 닫아라!' },
		name: { en: 'Slam', ko: '쾅' },
		describe: {
			en: 'The bubble drops from above, hits hard and sends a shockwave out.',
			ko: '말풍선이 위에서 떨어져 세게 박히고 충격파가 퍼진다.'
		},
		when: {
			en: 'A shout in a battle, a storm or a massacre.',
			ko: '전투, 폭풍, 학살 장면 속의 고함.'
		}
	},
	{
		id: 'bubble-gentle',
		kind: 'bubble',
		tone: 'gentle',
		person: 'munhee',
		line: { en: '…you could have just asked.', ko: '…그냥 물어봐도 됐잖아요.' },
		name: { en: 'Whisper', ko: '속삭임' },
		describe: {
			en: 'The bubble drifts in slowly and softly.',
			ko: '말풍선이 천천히, 부드럽게 흘러든다.'
		},
		when: {
			en: 'A short line that trails off into “…”.',
			ko: '“…”로 흐려지는 짧은 대사.'
		}
	},
	{
		id: 'bubble-ink',
		kind: 'bubble',
		tone: 'ink',
		person: 'bidam',
		line: { en: '(He’s lying.)', ko: '(거짓말이군.)' },
		name: { en: 'Invisible ink', ko: '투명 잉크' },
		describe: {
			en: 'The bubble arrives blurred, and the words clear out of the blur.',
			ko: '말풍선이 흐릿하게 오고, 그 안에서 글자가 서서히 드러난다.'
		},
		when: {
			en: 'A line wholly in parentheses: an aside, a thought.',
			ko: '통째로 괄호 안에 든 대사. 혼잣말, 속생각.'
		}
	},
	{
		id: 'entrance-battle',
		kind: 'entrance',
		mood: 'battle',
		sample: { en: 'The gate gives. They pour through the gap!', ko: '성문이 무너진다. 틈으로 밀려 들어온다!' },
		name: { en: 'Battle', ko: '전투' },
		describe: {
			en: 'Lines snap in fast; a line with “!” lands with a shake.',
			ko: '줄이 빠르게 튀어 들어오고, “!”가 있는 줄은 흔들리며 박힌다.'
		},
		when: { en: 'Battle scenes.', ko: '전투 장면.' }
	},
	{
		id: 'entrance-romance',
		kind: 'entrance',
		mood: 'romance',
		sample: { en: 'She does not run. He stops where a stranger should stop.', ko: '그녀는 도망가지 않는다. 그는 낯선 사람이 설 자리에서 선다.' },
		name: { en: 'Romance', ko: '사랑' },
		describe: {
			en: 'Lines bloom out of a soft blur.',
			ko: '줄이 부드러운 흐림 속에서 피어난다.'
		},
		when: { en: 'Love scenes.', ko: '사랑 장면.' }
	},
	{
		id: 'entrance-grief',
		kind: 'entrance',
		mood: 'grief',
		sample: { en: 'Nobody says his name at supper.', ko: '저녁상에서 아무도 그의 이름을 꺼내지 않는다.' },
		name: { en: 'Grief', ko: '슬픔' },
		describe: {
			en: 'Lines fade in slowly, the slowest entrance there is.',
			ko: '줄이 아주 천천히 떠오른다. 가장 느린 등장.'
		},
		when: { en: 'Mourning, funerals, deathbeds.', ko: '애도, 장례, 임종.' }
	},
	{
		id: 'entrance-impact',
		kind: 'entrance',
		mood: 'impact',
		sample: { en: 'Every door in the hall closes at once.', ko: '연회장의 문이 한꺼번에 닫힌다.' },
		name: { en: 'Impact', ko: '충격' },
		describe: {
			en: 'Lines slam in oversized with a red bleed, then shudder into place.',
			ko: '줄이 크게 박히며 붉게 번지고, 떨면서 제자리를 찾는다.'
		},
		when: { en: 'A massacre: wherever the blood weather is on.', ko: '학살. 피 날씨가 켜진 곳.' }
	},
	{
		id: 'entrance-calm',
		kind: 'entrance',
		mood: 'calm',
		sample: { en: 'Every day the sun crosses the sky on the same road.', ko: '해는 날마다 같은 길로 하늘을 건넌다.' },
		name: { en: 'Calm', ko: '잔잔함' },
		describe: {
			en: 'Lines rise gently into place.',
			ko: '줄이 부드럽게 올라와 자리를 잡는다.'
		},
		when: { en: 'Everything else.', ko: '그 밖의 모든 장면.' }
	}
];

/** Lower-cased words of each effect, for the widgets search. */
export function effectSearchText(e: Effect): string {
	const kind = EFFECT_KINDS.find((k) => k.kind === e.kind);
	return [e.name.en, e.name.ko, e.describe.en, e.describe.ko, e.when.en, e.when.ko, kind?.label ?? '', kind?.ko ?? '']
		.join('\n')
		.toLowerCase();
}
