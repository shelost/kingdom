import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const entries = story.flatMap((c) => c.entries ?? []);
const onjo = entries.find((e) => e.title === 'Onjo');
const jumong = entries.find((e) => e.title === 'Jumong');
if (!onjo || !jumong) throw new Error('Onjo or Jumong missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, extra = {}) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...extra
});
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const quote = (html, ko, hanja, source) => ({ kind: 'quote', html, ko, hanja, source });

const J = '#e8563f';
const S = '#e8a04a';
const Y = '#e07a5f';
const YE = '#d98fa8';
const O = '#f0c04a';
const B = '#d8b276';

function slot(im) {
	return {
		ratio: 1.778,
		tone: im.tone,
		nsfw: !!im.nsfw,
		id: im.id,
		at: im.at,
		alt: im.alt,
		refs: im.refs,
		people: im.people,
		prompt: im.prompt
	};
}

const onjoSlots = [
	slot({
		id: 'onjo-seq-buyeo-bully',
		tone: '#e07a5f',
		at: 'Whose son are you',
		alt: 'Dutch: Buyeo packed-earth yard — Yuri shoved; timber storehouses, grey giwa',
		refs: ['/ch_yuri.png'],
		people: ['yuri'],
		prompt: 'Minimal iconic 16:9 DUTCH. REAL Buyeo packed-earth yard, timber storehouses, grey giwa, natural overcast. Young Yuri FACE from ch_yuri mid-shove, grimace not portrait clone. ONE device: a timber post as a hard vertical. Tiny anonymous boys lower-third. #e07a5f thin rim. Crushed blacks, one hard key. No army. No text.'
	}),
	slot({
		id: 'onjo-seq-pine-dig',
		tone: '#d98fa8',
		at: 'seven-sided stone',
		alt: 'Worm’s-eye: Yuri kneeling at a seven-sided stone under a pine; broken sword in dirt',
		refs: ['/ch_yuri.png', '/ch_lady_ye.png'],
		people: ['yuri', 'ladyye'],
		prompt: 'Minimal iconic 16:9 WORM’S-EYE. REAL Buyeo pine at packed earth, seven-sided granite stone, roots. Yuri kneeling, digging, FACE from ch_yuri. Broken ring-pommel sword half in dirt. Lady Ye tiny at frame edge FACE from ch_lady_ye. ONE device: the pine trunk as a hard vertical. #e07a5f accent on iron. Natural sky. No text.'
	}),
	slot({
		id: 'onjo-seq-retrace-wide',
		tone: '#e8563f',
		at: 'He walks Jumong’s road backwards',
		alt: 'Bird’s-eye: tiny figures on a real river road south — same pines Jumong fled',
		refs: ['/ch_yuri.png', '/pl_snake_river.png'],
		people: ['yuri'],
		prompt: 'Minimal iconic 16:9 BIRD’S-EYE. REAL Korean river road from attached place: water, stones, pines, packed track. Tiny Yuri plus three friends in lower third. ONE device: the river as a hard silver ribbon. Natural clouds. High contrast. No army catalog. No text.'
	}),
	slot({
		id: 'onjo-seq-court-match',
		tone: '#e8563f',
		at: 'the two halves click',
		alt: 'Dutch: Goguryeo timber hall — two broken sword halves meeting; Dongmyung and Yuri',
		refs: ['/ch_dongmyung.png', '/ch_yuri.png', '/pl_pyongyang_fortress.png'],
		people: ['jumong', 'yuri'],
		prompt: 'Minimal iconic 16:9 DUTCH. REAL Goguryeo court from attached fortress: stone, giwa munru, timber. King Dongmyung FACE AND GARMENTS from ch_dongmyung, Yuri FACE from ch_yuri. TWO sword halves clicking as ONE device: a hard iron seam across the frame. Dramatic lean poses not fashion plate. #e8563f key. Crushed blacks. No army. No abstract void. No text.'
	}),
	slot({
		id: 'onjo-seq-left-rail',
		tone: '#e8a04a',
		at: 'The rail already knows',
		alt: 'OTS: Queen Sosuno at Jolbon hall rail; Onjo and Biryu tiny in the yard below',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_onjo.png', '/ch_biryu.png'],
		people: ['sosuno', 'onjo', 'biryu'],
		prompt: 'Minimal iconic 16:9 OTS. REAL Jolbon timber hall rail, grey giwa, packed earth yard. Queen Sosuno FACE AND GARMENTS from ch_sosuno_queen + bn, chin up, not smiling. Onjo and Biryu tiny lower-third FACES from portraits. ONE device: the rail as a hard horizontal. #e8a04a rim. No text.'
	}),
	slot({
		id: 'onjo-seq-ten-pack',
		tone: '#f0c04a',
		at: 'ten men start packing',
		alt: 'Dutch: ten carts on packed earth; Onjo counting sacks, Biryu tying rope',
		refs: ['/ch_onjo.png', '/ch_biryu.png'],
		people: ['onjo', 'biryu'],
		prompt: 'Minimal iconic 16:9 DUTCH. REAL Jolbon packed-earth yard, timber storehouses, grey giwa, grain sacks, a few carts — not an army. Onjo mid-count FACE from ch_onjo. Biryu tying rope FACE from ch_biryu. ONE device: a cart-rail diagonal. #f0c04a / #d8b276 rims. Tiny ten men as stamps not a catalog. No text.'
	}),
	slot({
		id: 'onjo-seq-torn',
		tone: '#e8563f',
		at: 'I left iron under a pine',
		alt: 'Two-shot dutch: King Dongmyung with Onjo and Biryu in the empty hall',
		refs: ['/ch_dongmyung.png', '/ch_onjo.png', '/ch_biryu.png', '/pl_pyongyang_fortress.png'],
		people: ['jumong', 'onjo', 'biryu'],
		prompt: 'Minimal iconic 16:9 DUTCH two-shot. REAL Goguryeo timber/stone hall from attached fortress. King Dongmyung FACE from ch_dongmyung mid-gesture, not standing portrait. Onjo and Biryu listening FACES from portraits. ONE device: empty floor as a dark wedge. #e8563f key. Monumental emptiness. No court clutter. No text.'
	}),
	slot({
		id: 'onjo-seq-caravan-dawn',
		tone: '#e8a04a',
		at: 'Take the millet. Take the well-wish',
		alt: 'Wide dawn: caravan leaving Jolbon yard — king at the gate, queen and sons on the road',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_onjo.png', '/ch_biryu.png'],
		people: ['jumong', 'sosuno', 'onjo', 'biryu'],
		prompt: 'Minimal iconic 16:9 WIDE dawn. REAL Jolbon packed-earth road, grey giwa gate, timber doors, natural dawn sky. Tiny caravan lower-third. King Dongmyung at gate FACE from ch_dongmyung. Queen Sosuno walking FACE from ch_sosuno_queen. TWO sons. ONE device: the gate as a hard dark rectangle. Long shadows. No army catalog. No text.'
	}),
	slot({
		id: 'jumong-seq-crown-yard',
		tone: '#e8563f',
		at: 'Tabal sets a vermilion cord',
		alt: 'Wide: Jolbon packed-earth courtyard coronation — timber hall, five fire-pits, tiny figures',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_yeon_tabal.png'],
		people: ['jumong', 'sosuno', 'yeontabal'],
		prompt: 'Minimal iconic 16:9 WIDE EXPOSITION. REAL Jolbon packed-earth courtyard: grey giwa timber hall, five small fire-pits, no abstract void. Tabal tying a vermilion cord on Dongmyung’s brow — FACES from attached portraits, NEW bodies. Sosuno at rail dusty-rose then royal. Tiny five-tribe stamps. ONE device: the hall as a dark timber wedge. Natural dusk sky. High contrast. No army. No text.'
	}),
	slot({
		id: 'jumong-seq-crown-fires',
		tone: '#e8563f',
		at: 'The five fires take the same wind',
		alt: 'Dutch: five fire-pits in a Jolbon yard answering one wind; king a lower-third silhouette',
		refs: ['/ch_dongmyung.png'],
		people: ['jumong'],
		prompt: 'Minimal iconic 16:9 DUTCH. REAL Jolbon packed earth, five timber fire-pits, grey giwa bokeh. King Dongmyung lower-third FACE from ch_dongmyung, vermilion cord, not a fashion plate. ONE device: five smoke columns as hard verticals. #e8563f as fire-plane. Natural dusk. No abstract monolith. No text.'
	}),
	slot({
		id: 'jumong-seq-crown-rail',
		tone: '#e8a04a',
		at: 'first queen of a country that still smells like millet',
		alt: 'OTS: Queen Sosuno at the hall rail looking at the cord; millet-smell yard beyond',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Minimal iconic 16:9 OTS. REAL Jolbon timber rail, packed earth, grey giwa. Queen Sosuno FACE from ch_sosuno_queen + bn, chin up. Dongmyung small beyond FACE from ch_dongmyung. ONE device: the rail horizontal. #e8a04a rim. Millet sacks as one still-life stamp. No palace furniture dump. No text.'
	}),
	slot({
		id: 'nsfw-onjo-last-wide',
		tone: '#e8a04a',
		nsfw: true,
		at: 'grain lamp last night',
		alt: 'Wide intimate: same grain room, lamp, older king and queen undressing',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 WIDE. SAME Jolbon grain room: timber, sacks, one lamp. Older Queen Sosuno and King Dongmyung FACES from portraits. Naked and half-silk. ONE device: the lamp as a hard gold coin. Skin-forward, horny, not a catalog. No text.'
	}),
	slot({
		id: 'nsfw-onjo-queen-back-h',
		tone: '#e8a04a',
		nsfw: true,
		at: 'queen back last night',
		alt: '16:9 OTS: older queen naked back filling the frame, looking over her shoulder',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 OTS. Camera BEHIND older Queen Sosuno: naked back is the picture, silk at hips, gache, looking over shoulder filthy. FACE from ch_sosuno_queen + bn. King Dongmyung behind FACE from ch_dongmyung. Grain-room timber. Explicit nude back. #e8a04a lamp. No text.'
	}),
	slot({
		id: 'nsfw-onjo-king-back-h',
		tone: '#e8563f',
		nsfw: true,
		at: 'king back last night',
		alt: '16:9 reverse: older king naked back as the plane, her nails on him',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Intimate cinematic 16:9 OTS reverse. King Dongmyung naked muscular back fills the frame, vermilion cord off, FACE nape from ch_dongmyung. Queen Sosuno nails and mouth at his shoulder FACE from ch_sosuno_queen. Grain lamp. #e8563f skin-key. Explicit nude back. No text.'
	}),
	slot({
		id: 'nsfw-onjo-last-ots',
		tone: '#e8a04a',
		nsfw: true,
		at: 'as hungry as the loft',
		alt: 'OTS: he watches her ride; older Sosuno looking back wrecked',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 OTS sex. Older Sosuno astride, looking back over shoulder, milf hunger, screaming mouth. FACES from ch_sosuno_queen + bn and ch_dongmyung. SAME grain room. Explicit penetration implied, skin-forward, horny. ONE device: her spine curve. No text.'
	}),
	slot({
		id: 'nsfw-onjo-last-dutch',
		tone: '#e8a04a',
		nsfw: true,
		at: 'raw milf hunger',
		alt: 'Dutch: grain-room sex, her thighs, lamp smear, wanting faces',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 DUTCH. Older couple having sex on grain sacks, lamp smear. Sosuno wrecked pleasure face FACE from ch_sosuno_queen. Jumong grinning strain FACE from ch_dongmyung. Explicit, horny, sweat. ONE device: dutch floor line. No text.'
	}),
	slot({
		id: 'nsfw-onjo-last-ecu',
		tone: '#e8a04a',
		nsfw: true,
		at: 'Scream it like the first time',
		alt: 'ECU: older Sosuno screaming pleasure, heart-pupils, sweat',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png'],
		people: ['sosuno'],
		prompt: 'Intimate cinematic 16:9 ECU. Older Queen Sosuno face fills frame screaming orgasm, heavy blush, open mouth, milf hunger. FACE from ch_sosuno_queen + bn. Grain-room bokeh. Erotic manhwa grammar. No text.'
	}),
	slot({
		id: 'nsfw-onjo-last-worm',
		tone: '#e8563f',
		nsfw: true,
		at: 'desperate for his cum',
		alt: 'Worm’s-eye: her hips driving down on him, lamp above',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 WORM’S-EYE. Sosuno hips driving down, chima hiked, older body, explicit sex. FACES from portraits. Lamp as a coin above. Desperate, horny. No text.'
	}),
	slot({
		id: 'nsfw-onjo-last-fill',
		tone: '#e8a04a',
		nsfw: true,
		at: 'Fill Little Sosuno',
		alt: 'Profile: he finishes in her; she clings, wrecked, older',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 PROFILE. Creampie finish in grain room, older Sosuno clinging, wrecked pleasure. FACES from portraits. Skin-forward explicit. ONE device: the profile line of two bodies. No text.'
	}),
	slot({
		id: 'nsfw-royal-queen-back-h',
		tone: '#e8a04a',
		nsfw: true,
		at: 'her royal back is the picture',
		alt: '16:9: newly crowned queen naked back, looking over her shoulder',
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/ch_dongmyung.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate cinematic 16:9 OTS. Newly crowned Queen Sosuno naked back filling frame, gache, silk at waist, looking over shoulder. FACE from ch_sosuno_queen. King behind. SAME grain room as the marriage night. Explicit nude back. No text.'
	}),
	slot({
		id: 'nsfw-royal-king-back-h',
		tone: '#e8563f',
		nsfw: true,
		at: 'his royal back is the picture',
		alt: '16:9: newly crowned king naked back, cord, her mouth at his shoulder',
		refs: ['/ch_dongmyung.png', '/ch_sosuno_queen.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Intimate cinematic 16:9 reverse. Newly crowned King Dongmyung naked back as the plane, vermilion cord, her mouth at his shoulder. FACE nape from ch_dongmyung. Explicit. Grain lamp. No text.'
	})
];

function upsertSlots(entry, list) {
	const have = new Set((entry.images ?? []).map((i) => i.id));
	if (!entry.images) entry.images = [];
	for (const im of list) {
		if (have.has(im.id)) {
			const old = entry.images.find((i) => i.id === im.id);
			Object.assign(old, im);
		} else {
			entry.images.push(im);
		}
	}
}

upsertSlots(onjo, onjoSlots.filter((s) => !s.id.startsWith('jumong-seq-crown') && !s.id.startsWith('nsfw-royal')));
upsertSlots(jumong, onjoSlots.filter((s) => s.id.startsWith('jumong-seq-crown') || s.id.startsWith('nsfw-royal')));

const foundingQuote = onjo.blocks.find((b) => b.kind === 'quote' && b.source?.includes('King Onjo'));

onjo.blocks = [
	p(
		'<b>Onjo</b> and <b>Biryu</b> grow up under a roof their father built with a woman who is not from Buyeo. They learn the hunt, the ditch, the well. They do not yet know they are a later argument.',
		'<b>온조</b>와 <b>비류</b>는 아버지가 부여 사람이 아닌 여자와 지은 지붕 아래에서 자란다. 사냥, 도랑, 우물을 배운다. 아직은 자신들이 나중의 논쟁인 줄 모른다.'
	),
	scene('No Father', '아버지 없다'),
	p(
		'North, in Geumwa’s packed-earth yard, another boy is learning a shorter lesson. The storehouses have grey giwa. The boys have names to throw. <b>Whose son are you</b> is not a question. It is a shove.',
		'북쪽, 금와의 다진 흙 마당에서 다른 아이가 더 짧은 수업을 받는다. 곳간은 회색 기와. 아이들은 던질 이름이 있다. <b>누구 아들이냐</b>는 질문이 아니다. 밀치기다.'
	),
	d(
		undefined,
		'#8a8070',
		['Where’s your father, then.', 'Go on. Point.', 'Even the dogs know theirs.'],
		['아비는 어디 있냐.', '어디, 가리켜 봐.', '개도 아비는 알거든.'],
		{ speaker: '👦' }
	),
	d('yuri', Y, ['He’s working.', 'South.', 'That’s what she said.'], ['일하러 갔어.', '남쪽.', '엄마가 그랬어.']),
	d(
		undefined,
		'#8a8070',
		['South is where people go to not come back.', 'That’s not a father. That’s a rumor.'],
		['남쪽은 안 돌아오는 데거든.', '그건 아비가 아니야. 소문이지.'],
		{ speaker: '👦' }
	),
	p(
		'Lady Ye does not come into the yard. She waits until he is in the doorway with a split lip and a look that wants a better sentence than south.',
		'예씨부인은 마당에 안 나온다. 입술이 터지고, 남쪽보다 나은 문장을 바라는 눈으로 문간에 설 때까지 기다린다.'
	),
	d('ladyye', YE, ['Eat.', 'Don’t listen to dogs.', 'Stones don’t have fathers either. They still hold roofs.'], [
		'먹어.',
		'개 말은 듣지 마.',
		'돌도 아비 없어. 그래도 지붕은 받친다.'
	]),
	d('yuri', Y, ['Then whose am I.', 'If you know, say it.', 'I’m tired of pointing at weather.'], [
		'그럼 난 누구 거야.',
		'알면 말해.',
		'날씨 가리키기는 지쳤어.'
	]),
	d('ladyye', YE, ['Not tonight.', 'Eat.', 'If you keep asking I will tell you, and then you will go, and I will have a quieter house and a worse one.'], [
		'오늘은 아니야.',
		'먹어.',
		'자꾸 물으면 말해 줄게. 그럼 넌 가고, 집은 조용해지고, 더 나빠질 거야.'
	]),
	scene('The Pine', '소나무'),
	p(
		'She lasts until the next shove. Then she takes him past the storehouses to a pine that has been waiting like a closed ledger. Under it, a <b>seven-sided stone</b>. She does not make a speech. She points with her chin.',
		'다음 밀치기까지 참는다. 그다음 곳간 너머, 닫힌 장부처럼 기다리던 소나무로 데려간다. 그 아래 <b>일곱 모 돌</b>. 연설은 없다. 턱으로 가리킨다.'
	),
	d('ladyye', YE, ['He left something.', 'If you find it, you’re his.', 'If you don’t, we never had this walk.', 'Don’t come back telling me you looked in the wrong tree.'], [
		'뭘 남겨 뒀어.',
		'찾으면 그 아이야.',
		'못 찾으면 이 산책은 없던 거야.',
		'나무 잘못 봤다고 돌아오지 마.'
	]),
	d('yuri', Y, ['You knew.', 'The whole time.', 'You let them call me a rumor.'], ['알고 있었네.', '처음부터.', '소문이라 하게 내버려 뒀어.']),
	d('ladyye', YE, ['I let you eat.', 'Dig.', 'If it’s there, you go south. That’s the part I hated.'], [
		'먹게 했어.',
		'파.',
		'있으면 남쪽으로 가. 그게 내가 싫은 부분이야.'
	]),
	p(
		'He digs like a boy who has been waiting for permission to be angry. Iron. A broken ring-pommel. The missing half of a story he has been walking around. He does not thank her. She does not ask him to.',
		'화나도 된다는 허락을 기다리던 아이처럼 판다. 쇠. 부러진 환두. 그동안 피해 다니던 이야기의 나머지. 고맙다는 말은 없다. 바라지도 않는다.'
	),
	quote(
		'If you bear a son, tell him I left something hidden beneath the pine on the seven-sided stone. If he finds it, I will know him for my son.',
		'당신이 아들을 낳으면, 일곱 모 돌 위 소나무 아래에 물건을 감추어 두었다고 이르시오. 찾으면 곧 내 아들인 줄 알겠소.',
		'若生男子 言我有遺物 藏於七稜石上松下 得此則知吾子也',
		'Samguk Sagi (三國史記) bk. 13, Goguryeo Annals — King Yuri; the token Jumong left with Lady Ye'
	),
	scene('The Road', '길'),
	p(
		'He takes three friends — <b>Okji, Guehu, Dojo</b> — because a broken sword is not a map. <b>He walks Jumong’s road backwards</b>: same pines, same rumor of a man the river carried, same south that used to be an insult. They sleep on packed earth. They do not talk about fathers unless the fire is low.',
		'부러진 칼은 지도가 아니라서 벗 셋 — <b>옥지·구추·도조</b> — 을 데리고 간다. <b>주몽의 길을 거꾸로 걷는다</b>. 같은 소나무, 강이 실어 갔다는 같은 소문, 전에는 욕이던 같은 남쪽. 다진 흙에서 잔다. 불이 낮지 않으면 아버지 이야기는 안 한다.'
	),
	d('yuri', Y, ['If the hall laughs, we leave.', 'If it doesn’t, I still might.', 'I just want to put this against whatever he kept.'], [
		'대청이 웃으면 떠난다.',
		'안 웃어도 떠날지 몰라.',
		'그가 남겨 둔 거에 이거 대보면 돼.'
	]),
	d(undefined, '#8a8070', ['That’s a plan?', 'That’s a click.'], ['그게 계획이냐.', '그건 딱, 이거든.'], { speaker: '🗣' }),
	scene('The Match', '맞춤'),
	p(
		'Goguryeo’s court is not a void. Stone. Timber. Grey giwa. A packed-earth floor that has heard five tribes argue. King Dongmyung is older than the exile in the well stories. He grins anyway. Then Yuri sets iron on iron, and <b>the two halves click</b>.',
		'고구려 조정은 빈 화면이 아니다. 돌. 나무. 회색 기와. 다섯 부족이 싸우던 다진 흙. 동명왕은 우물 이야기 속 망명객보다 나이 들었다. 그래도 웃는다. 유리가 쇠를 쇠에 대자 <b>두 조각이 맞물린다</b>.'
	),
	d('jumong', J, ['Ha.', 'That’s mine.', 'That’s you.', 'Come here. You’re late. I’m still glad.'], [
		'하.',
		'내 거야.',
		'너야.',
		'이리 와. 늦었어. 그래도 좋다.'
	]),
	d('yuri', Y, ['They said I didn’t have a father.', 'I brought the part that says I did.', 'I walked your road. It was longer than the stories.'], [
		'아비 없다더라.',
		'있다는 쪽을 가져왔어.',
		'당신 길을 걸었어. 이야기보다 길었어.'
	]),
	d('jumong', J, ['Yeah.', 'I left in a hurry.', 'Sorry about the yard. I was busy not dying.'], [
		'응.',
		'급히 떠났거든.',
		'마당 일은 미안. 안 죽느라 바빴어.'
	]),
	p(
		'Sosuno watches from the rail in queen silk. Chin up. She does not greet a broken sword like a guest. Onjo and Biryu are in the yard where the well still is. They laugh once. It dies. <b>The rail already knows</b>.',
		'소서노는 왕비 비단으로 난간에서 본다. 턱. 부러진 칼을 손님처럼 안 맞는다. 온조와 비류는 우물 있는 마당에 있다. 한 번 웃는다. 죽는다. <b>난간은 이미 안다</b>.'
	),
	d('onjo', O, ['He’s… tall.', 'That’s our father’s other iron.', 'Do we clap, or do we disappear.'], [
		'키 크네.',
		'아버지 다른 쇠야.',
		'박수 쳐. 아니면 사라지든가.'
	]),
	d('biryu', B, ['I’m not clapping for a pine.', 'Count the old men. They’re already counting him.'], [
		'소나무에 박수 안 쳐.',
		'늙은이들 세 봐. 이미 저 애 세고 있어.'
	]),
	scene('The Chair', '의자'),
	p(
		'It does not happen in one hall. First the hunt takes Yuri’s name. Then the rites. Then the men who remember the five fires say the click is the succession, because a token is easier than a feeling. Sosuno does not fight the minutes. She fights the grain count, which is at least honest.',
		'한 대청에서 끝나지 않는다. 먼저 사냥이 유리 이름을 부른다. 그다음 제사. 그다음 불 다섯을 기억하는 자들이, 맞춤이 후계라고 한다. 토큰이 마음보다 쉽으니까. 소서노는 회의록과 안 싸운다. 곡식 셈과 싸운다. 그건 적어도 정직하다.'
	),
	d('sosuno', S, ['Don’t look at me in the yard.', 'I’m counting sacks.', 'If the hall wants a sword for a king, the hall can feed it.'], [
		'마당에서 그 눈으로 보지 마.',
		'가마니 세는 중이니까.',
		'조정이 칼로 왕을 삼겠으면, 조정이 먹여.'
	]),
	d('jumong', J, ['I told a pine.', 'I didn’t tell you the pine would walk in.', 'I know. That’s worse.'], [
		'소나무한테 말했어.',
		'소나무가 걸어 들어올 줄은 너한테 안 했어.',
		'알아. 그게 더 나빠.'
	]),
	d('sosuno', S, ['I’m not sitting in a footnote.', 'The boys aren’t either.', 'Say it when you’re ready. I’m packing either way.'], [
		'각주로 안 앉아.',
		'애들도.',
		'준비되면 말해. 난 어쨌든 쌀 거야.'
	]),
	p(
		'Onjo lasts longer than Biryu. Then he stops lasting. The well, the loft, the grain room — all still theirs, and somehow already someone else’s map. <b>ten men start packing</b> before anyone votes. Loyalty is faster than minutes.',
		'온조가 비류보다 오래 버틴다. 그러다 그만 버틴다. 우물, 다락, 곡식방 — 아직 그들 것인데 이미 다른 사람 지도다. 투표 전에 <b>열 사람이 짐을 싼다</b>. 충성이 회의록보다 빠르다.'
	),
	d('onjo', O, ['We’re going to be furniture.', 'Nice furniture. Still furniture.', 'South has room. North has a click.'], [
		'가구 되겠어.',
		'좋은 가구. 그래도 가구.',
		'남쪽은 자리 있어. 북쪽은 맞춤이 있어.'
	]),
	d('biryu', B, ['I packed.', 'Don’t make it a speech.', 'If he cries I will leave faster.'], [
		'쌌어.',
		'연설 하지 마.',
		'울면 더 빨리 나간다.'
	]),
	d(
		undefined,
		'#c4a574',
		['Ten of us.', 'Carts. Millet. The queen’s books.', 'We go where she goes.'],
		['열입니다.', '수레. 조. 왕비님 책.', '가시는 데 갑니다.'],
		{ speaker: '🙇' }
	),
	scene('Torn', '찢김'),
	p(
		'Jumong finds his younger sons in the empty hall when the fires are only smoke. He is still the man who grins at a well. The grin is late. <b>I left iron under a pine</b> is not a policy. It is the mess he made.',
		'불이 연기만 남았을 때 주몽이 빈 대청에서 작은 아들들을 찾는다. 아직 우물에서 웃던 사람이다. 웃음이 늦다. <b>소나무 아래 쇠를 남겼다</b>는 정책이 아니다. 그가 만든 난장판이다.'
	),
	d('jumong', J, ['I left iron under a pine.', 'I told a woman in the north if a boy found it I’d know him.', 'I didn’t tell her I’d already built a roof.', 'That’s on me. Not on you.'], [
		'소나무 아래 쇠를 남겼어.',
		'북쪽 여자한테, 아이가 찾으면 내 줄 안다고 했어.',
		'이미 지붕 지었다고는 안 했어.',
		'내 탓이야. 너희 탓 아니야.'
	]),
	d('onjo', O, ['We noticed the roof.', 'We like the roof.', 'We’re still going.', 'That’s not a punishment. That’s a door.'], [
		'지붕은 봤어.',
		'지붕 좋아.',
		'그래도 가.',
		'벌이 아니야. 문이야.'
	]),
	d('biryu', B, ['Keep the click.', 'Keep the well if she lets you.', 'We’re taking the grain that isn’t his.'], [
		'맞춤은 가져.',
		'우물은 그녀가 허락하면 가져.',
		'저 애 거 아닌 곡식은 우리가 가져가.'
	]),
	d('jumong', J, ['I wanted both.', 'That’s the stupid part.', 'A king is supposed to pick. I picked twice.', 'Go. I’ll load the carts. I’m good at leaving. I’m worse at staying behind.'], [
		'둘 다 원했어.',
		'그게 바보 같은 거야.',
		'왕은 고르라고 있거든. 난 두 번 골랐어.',
		'가. 수레는 내가 실을게. 떠나는 건 잘하거든. 남는 건 못해.'
	]),
	scene('The Well', '우물'),
	p(
		'When the hall has already chosen, Sosuno does not fight it. She packs the dusty-rose under the queen silk. She packs Little Sosuno’s silence, which is not silent. Jumong finds her at the old well — same stone rim, same timber beam, two buckets that have outlived the argument. Twenty winters in the same yard. He is still grinning. She is still pretending she came for water.',
		'대청이 이미 골랐을 때 소서노는 싸우지 않는다. 왕비 비단 아래 회분홍을 갠다. 작은 소서노의 침묵도 갠다. 침묵이 아니다. 주몽이 옛 우물에서 찾는다 — 같은 돌 테, 같은 들보, 싸움을 이긴 두레박 둘. 같은 마당에서 스무 겨울. 그는 아직 웃는다. 그녀는 아직 물 뜨러 온 척한다.'
	),
	d('jumong', J, ['Hey.', 'You’re packed.', 'That’s… a lot of buckets for one road.'], [
		'야.',
		'쌌네.',
		'길 하나치곤 두레박이 많아.'
	]),
	d('sosuno', S, ['Not buckets.', 'Grain. Boys. Me.', 'Don’t— don’t make a speech. I’ll hit you.'], [
		'두레박 아니야.',
		'곡식. 애들. 나.',
		'연설하지 마. 때릴 거야.'
	]),
	d('jumong', J, ['Wasn’t going to.', 'Well’s still here.', 'I kept it. For you. Stupid, I know.'], [
		'안 하려고 했어.',
		'우물 아직 있어.',
		'남겨 뒀어. 너 때문에. 바보인 거 알아.'
	]),
	d(
		'sosuno',
		S,
		[
			'Don’t be nice.',
			'I’ll get stupid.',
			'Yuri can have the chair. I’m not sitting in a footnote.',
			'And don’t you dare take a hall girl after I walk. I forbade it when you were crowned. Still forbidden.',
			'You know that. You always knew.'
		],
		[
			'착하게 굴지 마.',
			'바보 돼.',
			'의자는 유리가 가져. 난 각주로 안 앉아.',
			'내가 간 뒤에 곁방 들이지 마. 왕 됐을 때 금했어. 아직 금이야.',
			'알잖아. 처음부터 알았잖아.'
		]
	),
	d('jumong', J, ['Yeah.', 'South, then.', 'Take the glow. Leave me the well.', 'Take the millet. I’ll send more if the road eats it.', '…Come here. Please. One night. I’m still thirsty.'], [
		'응.',
		'그럼 남쪽.',
		'그 빛은 가져. 우물은 남겨.',
		'조는 가져. 길이 먹으면 더 보낼게.',
		'…이리 와. 제발. 하룻밤. 아직 목말라.'
	]),
	d('sosuno', S, ['Big idiot.', 'The boys are asleep.', 'If you compliment me I will scream.', '…That’s not a no.'], [
		'이 큰 바보.',
		'애들 잤어.',
		'칭찬하면 소리 지를 거야.',
		'…거절 아니야.'
	]),
	scene('The Last Night', '마지막 밤'),
	p(
		'They do not make it to a feast. They make it to the grain room that has been theirs since the first count. Same timber. Same lamp. Older. Hungrier. The hide has been off for years and she is worse now, not better. <b>grain lamp last night</b>',
		'잔치까지 안 간다. 첫 셈부터 둘이던 곡식방까지 간다. 같은 나무. 같은 등잔. 나이 들었고, 더 고프다. 껍질은 몇 년 전에 벗었고 지금은 더 심하다. 나아진 게 아니다. <b>마지막 밤 곡식 등잔</b>',
		true
	),
	p(
		'Queen’s robe at the hip, nothing on the back. She looks over her shoulder the way she did at the well, older, worse, as hungry as the loft the first time she counted his working meat. <b>queen back last night</b>',
		'왕비 곤이 허리에만 있다. 등은 없다. 우물에서처럼 넘겨본다. 나이 들었고, 더 심하다. 처음 다락에서 일하는 등을 세던 그때만큼 고프다. <b>마지막 밤 왕비의 등</b>',
		true
	),
	p(
		'His turn: king’s back to the lamp, muscle she has counted for twenty winters, her nails. <b>king back last night</b>',
		'그 차례. 등잔을 받은 왕의 등. 스무 겨울 세어 온 근육. 손톱. <b>마지막 밤 왕의 등</b>',
		true
	),
	d(
		'jumong',
		J,
		['Still you.', 'Still that mouth.', 'Look at you. Older. Sexier. Sorry. Not sorry.', 'Scream it like the first time.'],
		['아직 너야.', '그 입 아직.', '너 봐. 나이 들어. 더 섹시해. 미안. 안 미안.', '처음처럼 질러.'],
		{ nsfw: true }
	),
	d(
		'sosuno',
		S,
		[
			'Don’t— ha— don’t say sexy I’ll—',
			'Little Sosuno listen— that’s him— that’s the noise— wet— god the wet— twenty winters and still that slap—',
			'I wanted you the first morning. I still— ah— still—',
			'Look at you. Chest. Back. That ass. That man meat. Still. Still.',
			'raw milf hunger— don’t you dare laugh— I’m a queen and I’m dripping for the same idiot—'
		],
		[
			'말하지— 하— 섹시하다고 하면 나—',
			'작은 소서노 들어— 저거 그거야— 그 소리— 젖은— 아 그 젖은 소리— 스무 겨울인데 그 철썩 아직—',
			'첫날 아침부터 원했어. 아직— 아— 아직—',
			'봐봐. 가슴. 등. 그 엉덩이. 그 고기. 아직. 아직.',
			'이 다 큰 허기— 웃지 마— 왕빈데 같은 바보한테 흐르고 있잖아—'
		],
		{ nsfw: true }
	),
	p(
		'She rides him like the loft never ended. Older hips, same ruin. She is <b>as hungry as the loft</b>. She tells him so with her throat, not a speech.',
		'다락이 안 끝난 것처럼 올라탄다. 나이 든 허리, 같은 망가짐. <b>다락만큼 고프다</b>. 연설이 아니라 목으로 말한다.',
		true
	),
	d(
		'sosuno',
		S,
		[
			'Promise— only this pussy— only Little Sosuno— no concubine ever— daddy say it—',
			'I’m desperate for his cum— yours— in me— don’t you dare pull out—',
			'Take it and destroy my tight little ass. Beat her up. Beat up Little Sosuno till she’s dripping and there’s nothing left—',
			'Fill Little Sosuno—'
		],
		[
			'약속— 이 보지만— 작은 소서노만— 후궁은 영원히 없어— 아빠 말해—',
			'정액 원해— 네 거— 안에— 빼지 마—',
			'가져와서 내 꽉 끼는 엉덩이 박살내. 두들겨 패. 작은 소서노 패. 질질 흐르고 아무것도 안 남게—',
			'작은 소서노 채워—'
		],
		{ nsfw: true }
	),
	d(
		'jumong',
		J,
		['Yours.', 'Always was.', 'Scream it. Last time. Louder.'],
		['네 거야.', '처음부터.', '질러. 마지막이야. 더 크게.'],
		{ nsfw: true }
	),
	d(
		'sosuno',
		S,
		[
			'I hate you I love you don’t you dare stop—',
			'Fill her— ruin her— she’s been waiting—',
			'DUMB BIG IDIOT— LAST— FILL—',
			'AHH— LITTLE SOSUNO’S— CUMMING— DON’T YOU LEAVE THE ROOM—'
		],
		[
			'미워 사랑해 멈추지 마—',
			'채워— 망가뜨려— 기다렸거든—',
			'이 멍청한 큰 바보야— 마지막— 채워—',
			'아아— 작은 소서노가— 가— 방에서 나가지 마—'
		],
		{ nsfw: true }
	),
	p(
		'After, she is scarlet at what she heard herself say. Destroy. Beat her up. Desperate. The whole book, louder than the first loft. He kisses the place on her temple that used to hide in a sleeve.',
		'그 다음, 제 입이 한 말에 새빨개진다. 박살. 두들겨 패. 고파. 그 책 전부, 첫 다락보다 크다. 그는 예전에 소매로 숨기던 관자놀이에 입을 맞춘다.',
		true
	),
	d(
		'jumong',
		J,
		['I heard.', 'You can still talk like that.', 'I’m keeping both of you. Even from a chair away.'],
		['들었어.', '그렇게 말해도 돼. 아직.', '둘 다 둘게. 의자 멀리서도.'],
		{ nsfw: true }
	),
	d('sosuno', S, ['Don’t be nice.', 'I’ll get stupid.', '…I’m already stupid.', 'Keep the well. I’m taking the glow.'], [
		'착하게 굴지 마.',
		'바보 돼.',
		'…이미 바보야.',
		'우물은 가져. 빛은 내가 가져갈게.'
	]),
	d('jumong', J, ['Take it.', 'You’re beautiful.', 'Go found the other one. I’ll be here. Grinning. Like an idiot.'], [
		'가져.',
		'예쁘다.',
		'가서 다른 거 세워. 난 여기 있을게. 웃으면서. 바보처럼.'
	]),
	scene('The Caravan', '행렬'),
	p(
		'Dawn. He does what he promised. Carts. Millet. Rope. Ten men who already decided. He loads like a man who is good at leaving and is practicing the other job. <b>Take the millet. Take the well-wish</b>.',
		'새벽. 약속한 대로 한다. 수레. 조. 밧줄. 이미 정한 열 사람. 떠나기 잘하는 사람이 남는 일을 연습하듯 싣는다. <b>조를 가져. 덕담도 가져</b>.'
	),
	d('jumong', J, ['Eat on the road.', 'If a ditch looks at you wrong, send word.', 'I’m not taking a hall girl. You already forbade it.', 'Go. Before I get stupid in front of the ten.'], [
		'길에서 먹어.',
		'도랑이 이상하면 소식 보내.',
		'곁방 안 들여. 네가 이미 금했어.',
		'가. 열 앞에서 바보 되기 전에.'
	]),
	d('sosuno', S, ['Don’t watch the road until we’re a speck.', 'I’ll hit you.', '…Watch anyway.', 'You’re still pretty. Shut up. I said it.'], [
		'점 되기 전엔 길 보지 마.',
		'때릴 거야.',
		'…그래도 봐.',
		'아직 예뻐. 닥쳐. 내가 말했으니까.'
	]),
	d('onjo', O, ['Father.', 'We’ll put a roof on it.', 'A different one.'], ['아버지.', '지붕 올릴게.', '다른 거.']),
	d('biryu', B, ['Don’t visit the salt first.', 'That’s a joke.', 'It isn’t.'], ['소금부터 찾아오지 마.', '농담이야.', '아니야.']),
	p(
		'Dawn. Onjo and Biryu take their mother south. She walks like a woman who has been thoroughly answered and will not explain it to a deer, a son, or a chronicle. <b>She carries the glow all the way to Baekje.</b> After wandering for a while, they find a <b>Heavenly Deer</b> at what the older priests will call a heavenly door — a threshold between the yellow earth and the starred sky — and decide to settle there. Loyalty, they say later, is what you owe the door that let you in.',
		'새벽. 온조와 비류가 어머니를 모시고 남쪽으로 간다. 제대로 대답받은 여자처럼 걷는다. 사슴에게도, 아들에게도, 편년에도 설명하지 않는다. <b>그 빛을 백제까지 가져간다.</b> 헤매다 <b>천록</b>을 만나니 — 뒷날 늙은 제사장들이 천문(天門), 누런 땅과 별 사이 문이라 부를 자리에서 — 그곳에 자리를 잡는다. 충성이란, 훗날 말하건대, 들어와 살게 해 준 문에 빚진 것이다.'
	),
	d('onjo', O, ['The land of ten tribes… Sipje! Hey, c’mon… we can think bigger than that. The land of a HUNDRED tribes… Baekje! Now that’s more like it….'], [
		'열 부족의 땅이라… 십제라! 이봐, 더 크게 가자고. 백 부족의 땅… 백제! 그래, 그게 낫지….'
	]),
	d('onjo', O, ['<Baekje> — how does that sound?'], ['<백제> 어떠냐?']),
	foundingQuote ??
		quote(
			'With ten ministers as wings he named the country Sipje. Later, because the common people had gladly followed at the time of coming, the name was changed to Baekje.',
			'열 신하를 보필로 삼아 나라 이름을 십제라 하였다. 뒤에 올 때의 백성이 즐겨 따랐으므로, 고쳐 백제라 하였다.',
			'以十臣爲輔翼 國號十濟 後以來時百姓樂從 改號百濟',
			'Samguk Sagi (三國史記) bk. 23, Baekje Annals — King Onjo, founding; Lee Byong-do ed., vol. 1, p. 334'
		)
];

const crownP = jumong.blocks.find((b) => b.html?.includes('Tabal sets a vermilion cord'));
if (crownP) {
	crownP.html =
		'No feast. No drum line. <b>Tabal sets a vermilion cord</b> on his son-in-law’s brow the way a man sets a tool on a workbench — rough, final. <b>The five fires take the same wind</b>. Sosuno stands at the rail in dusty-rose, chin up, <b>first queen of a country that still smells like millet</b>. <b>the largest kingdom in Samhan</b> is a later map. Tonight the map is five roofs answering one name.';
	crownP.ko =
		'잔치 없다. 북줄도 없다. <b>연타발이 사위의 이마에 주홍 끈을 올린다</b> — 연장 올려두듯, 거칠고, 끝. <b>불 다섯이 같은 바람을 먹는다</b>. 소서노는 회분홍으로 난간에 선다. 턱. <b>아직 조 냄새 나는 나라의 첫 왕비</b>. <b>삼한에서 가장 큰 나라</b>는 나중의 지도다. 오늘 밤의 지도는 이름 하나에 대답하는 지붕 다섯.';
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Onjo blocks', onjo.blocks.length, 'Onjo images', onjo.images.length, 'Jumong images', jumong.images.length);
