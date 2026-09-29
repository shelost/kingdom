/**
 * YEARS LATER (The First Kim): escalate Golhwa consummation into
 * simultaneous climax + foursome orgy night. Thin clean spine for Intimate OFF.
 */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const PEOPLE = 'src/lib/data/image-people.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

const entry = findEntry('The First Kim');
const dayIdx = entry.blocks.findIndex((b) => b.kind === 'day' && b.label === 'YEARS LATER');
if (dayIdx < 0) throw new Error('YEARS LATER day plate missing');

const golhwa = '/ch_golhwa.png';
const narim = '/ch_narim.png';
const hyulle = '/ch_hyullé.png';
const seo = '/ch_kim_seohyun.png';
const bnG = '/bn_golhwa.png';
const bnN = '/bn_narim.png';
const bnH = '/bn_hyulle.png';
const cave = '/pl_cave.png';

const olderBlocks = [
	{ kind: 'day', label: 'YEARS LATER', ko: '몇 해 뒤' },
	// —— CLEAN SPINE (Intimate OFF) ——
	{
		kind: 'p',
		html: 'Years later the hill still knows his walk. Grey at the temples. Lines the steam cannot steam out. Same face, older — he did not invent a new one. He comes back more eagerly than any son will. No border to cut. No queen to quote. Only the three and the water.',
		ko: '몇 해 뒤에도 언덕은 그의 걸음을 안다. 관자놀이에 회색. 김이 지워 내지 못하는 주름. 같은 얼굴, 더 늙은 — 새 얼굴을 만들지 않았다. 어떤 아들보다 더 빨리 돌아온다. 자를 국경도 없고, 인용할 여왕도 없다. 셋과 물뿐.'
	},
	{
		kind: 'p',
		html: 'He sits where he sat the first time. The stone is the same. Counsel is still counsel — one question, one name, three answers that do not ask for a victory. He leaves before the road remembers him, with the hill’s quiet folded into his sleeve.',
		ko: '처음 앉았던 자리에 앉는다. 돌은 같다. 조언은 여전히 조언이다 — 질문 하나, 이름 하나, 승리를 요구하지 않는 답 셋. 길이 그를 기억하기 전에 떠난다. 언덕의 고요를 소매에 접어 넣고.'
	},
	// —— HEAT: arrival / claim ——
	{
		kind: 'p',
		html: 'That is the clean ledger. The night the ledger does not keep starts the same way: he never could play it cool. The spring does not hide much. He is already rock-hard in the black bowl before he has finished looking — worse than the first visit — and he does not turn away. Older bare muscle. Wet loose hair. No headband. He lets the three see him, and he meets their looking.',
		ko: '그건 깨끗한 장부다. 장부가 안 적는 밤은 같은 길로 시작한다. 쿨한 척을 한 적이 없다. 샘이 감춰 주는 게 없다. 다 보기도 전에 검은 사발 안에서 이미 돌처럼 서 있다 — 첫 방문보다 더 — 외면하지 않는다. 늙은 맨몸. 젖은 헝클어진 머리. 머리띠 없음. 셋이 보는 것을 허락하고, 그 시선을 마주한다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Golhwa’s legs are already spread wide on the rock, chima hiked, as if the years had not happened. Hyullé’s knees stay pressed, eyes down, soaked through. Narim looks at him kindly and forgets how to be an eldest.',
		ko: '골화의 다리는 이미 바위에서 넓게 벌어져 있고 치마는 걷혀 있다. 해가 안 간 것처럼. 혈레의 무릎은 모아져 있고 눈은 아래, 다 젖었다. 나림은 그를 친절히 보고 언니이기를 잊는다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3E8EF0',
		person: 'seohyeon',
		en: [
			'You three are going to kill an old man.',
			'I came back anyway. The horse knows the way better than I do.'
		],
		lines: ['당신 셋이 늙은이를 죽이겠구려.', '그래도 왔소. 말이 나보다 길을 잘 아오.'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'They do not stay on their rock. Golhwa climbs into his lap first — legs wide, chima hiked, pleasure-face already loud — and for once he does not freeze. His hands find her wet hips. He lets her. He meets her.',
		ko: '바위 위에 머물지 않는다. 골화가 먼저 그의 무릎으로 올라온다 — 다리는 벌리고, 치마는 걷히고, 이미 큰 얼굴 — 이번엔 그가 얼어붙지 않는다. 손이 젖은 허리를 찾는다. 허락한다. 마주한다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'She kisses him like she has been waiting decades. Not a polite press — mouths open in the steam, ember flush, her tongue finding his while a sound tears out of her that the cavern has never owned before. He kisses back. Hard. An old man who never learned to play it cool answering volume with volume.',
		ko: '몇십 년을 기다린 것처럼 입을 맞춘다. 예의 바른 입술이 아니다 — 김 속에서 입이 열리고, 불씨 같은 홍조, 혀가 그의 혀를 찾는 동안 동굴이 처음 듣는 소리가 목에서 찢어진다. 그도 맞춘다. 세게. 쿨한 척을 끝내 못 배운 늙은이가 소리에 소리로 답한다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		en: ['Ah—!', 'Oppa— your mouth—', 'Haa— don’t stop—'],
		lines: ['아—!', '오빠— 입—', '하아— 그만두지 마—'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'She seats herself on him in the black bowl. Hiked coral silk. Bare thighs locking his waist. She guides him with her hand under the bunched chima — careful for half a breath, then greedy — and sinks until their hips meet. Putting him inside. Taking what the rock never gave.',
		ko: '검은 사발 안에서 그에게 앉는다. 걷힌 산호빛 비단. 맨 허벅지가 허리를 잠근다. 뭉친 치마 밑으로 손으로 그를 잡아 이끈다 — 반 숨만 조심하고, 바로 탐욕스럽게 — 엉덩이가 맞닿을 때까지 내려앉는다. 넣는다. 바위가 못 주던 것을 가져간다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		en: ['Put it in—!', 'Ah—! There—!', 'Fuck— yes—'],
		lines: ['넣어 줘—!', '아—! 거기—!', '씨발— 좋아—'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Then she rides — and the quiet of the spring dies. Up, down, grinding, each drop of her hips knocking a cry out of her that the rock throws back wet and doubled. Steam carries it. The black bowl rings. She cannot stay quiet; she does not try.',
		ko: '그리고 탄다 — 샘의 고요가 죽는다. 올렸다 내렸다, 갈았다, 허리가 떨어질 때마다 비명이 나오고 바위가 젖은 채로 두 배로 되던진다. 김이 실어 나른다. 검은 사발이 운다. 조용히 있을 수 없다. 하지도 않는다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Hips pressed together in the water. Climax face already — mouth open mid-cry, heart-pupil hunger, wet silk clinging, jeogori fallen open. He holds her and moves with her, grey temples against her throat, meeting every scream with his body, receptive, ruined, grateful.',
		ko: '물속에서 엉덩이가 맞붙는다. 이미 절정 얼굴 — 비명 중간에 벌어진 입, 하트 눈동자 같은 굶주림, 젖은 비단이 달라붙고 저고리가 벌어진다. 그는 붙들고 같이 움직인다. 회색 관자놀이가 목에 닿고, 비명마다 몸으로 답하고, 받아들이고, 망가지고, 고마워한다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		en: ['Haa—!', 'Ah— ah— oppa—!', 'Make me come—!', 'Please— fuck—'],
		lines: ['하아—!', '아— 아— 오빠—!', '싸게 해 줘—!', '제발— 씨발—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3E8EF0',
		person: 'seohyeon',
		en: ['Golhwa—', 'I hear you— take it—'],
		lines: ['골화—', '듣고 있소— 가져가—'],
		nsfw: true
	},
	// —— SIMULTANEOUS CLIMAX ——
	{
		kind: 'p',
		html: 'They finish together. Not polite. Not staged. Her scream breaks on the same breath his body gives out — he comes buckets inside her, spilling until the water around their hips goes warmer, and she comes on him at the same second, shaking so hard the bunched chima slips and her open mouth cannot close. Decades of wanting collapse into one wet, loud, shared ruin.',
		ko: '같이 싸. 예의도 연출도 없다. 비명이 갈라지는 숨과 그의 몸이 터지는 숨이 같다 — 안에 한 바가지처럼 싸 넣고, 엉덩이 주위 물이 더워질 때까지 쏟아지고, 같은 순간에 그녀도 그 위에서 싸며, 걷힌 치마가 미끄러질 만큼 떨리고 벌어진 입이 안 다물어진다. 몇십 년의 갈망이 축축하고 크고 공유된 파국 하나로 무너진다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		en: ['Ah— ah— I’m—', 'Coming—!', 'Oppa— inside—!', 'Don’t pull out—!'],
		lines: ['아— 아— 나—', '싸—!', '오빠— 안에—!', '빼지 마—!'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3E8EF0',
		person: 'seohyeon',
		en: ['Golhwa—', 'I’m— with you—'],
		lines: ['골화—', '같이— 가오—'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'The last scream leaves her shaking. Rock and steam keep answering for a second after her voice breaks. He holds her through it — still buried, still emptying — until the cry turns into breath and the breath into a ruined laugh against his wet shoulder.',
		ko: '마지막 비명이 그녀를 떨게 두고 간다. 목소리가 꺾인 뒤에도 바위와 김이 잠깐 더 대답한다. 그는 그 끝까지 안고 — 여전히 박혀 있고, 여전히 비워 내고 — 비명이 숨이 되고, 숨이 젖은 어깨에 망가진 웃음이 될 때까지.',
		nsfw: true
	},
	{
		kind: 'monologue',
		person: 'golhwa',
		html: 'Grey at the temples and he is still under me. I screamed. He stayed. Kiss. Inside. Ride. He filled me. Mine.',
		ko: '관자놀이에 회색인데도 밑에 있어. 소리쳤어. 그는 남았어. 키스. 안. 타기. 채워 줬어. 내 거.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'She collapses on his wet chest. Spent. Trembling. Messy hair. Hiked chima still open over his lap, him still inside, heat leaking between them into the black bowl. Possessive even wrecked — arms locked, thighs locked, as if the sisters could steal the night by breathing.',
		ko: '젖은 가슴에 쓰러진다. 다 씀. 떨림. 헝클어진 머리. 걷힌 치마가 아직 무릎 위에 열려 있고, 그는 아직 안에, 열이 둘 사이로 새어 검은 사발로 간다. 망가져도 소유욕 — 팔이 잠기고 허벅지가 잠긴다. 숨을 쉬는 것만으로도 자매가 이 밤을 훔칠 수 있을 것처럼.',
		nsfw: true
	},
	// —— JEALOUSY → SHARING ——
	{
		kind: 'p',
		html: 'Narim flinches at the loudest cry — a hand half-raised as if to scold — and does not finish the gesture. Narim’s breath goes late on his lined cheek. The eldest voice tries once, thin against the echo, and fails into hunger.',
		ko: '가장 큰 비명에 나림이 흠칫한다 — 꾸짖으려는 듯 손을 반쯤 들고 — 그 동작을 끝내지 못한다. 나림의 숨이 주름진 뺨에서 늦어진다. 언니 목소리가 한 번 얇게 메아리를 이기려다, 굶주림으로 무너진다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#5fad6e',
		person: 'narim',
		en: ['…Golhwa.', 'The cave will hear—', '…Don’t break him.', '…Lucky.'],
		lines: ['…골화.', '동굴이 듣겠어—', '…부러뜨리지 마.', '…부럽다.'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Hyullé watches with her knees still pressed, silent and wrecked — gaze down against his grey temple when she can reach, soaked silk clenched between her thighs, not one word while her sister screams the spring empty.',
		ko: '혈레는 무릎을 모은 채 본다. 말없이 망가져 — 닿을 수 있을 때 회색 관자놀이에 눈을 내리고, 허벅지 사이 비단을 움켜쥔 채, 동생이 샘을 비울 때까지 한마디도 없다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#2eb8c4',
		person: 'hyulle',
		en: ['…', 'Nn—'],
		lines: ['…', '응—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		en: ['He’s mine tonight—', 'You watched long enough—', '…Fine. Come.'],
		lines: ['오늘 밤은 내 거—', '오래도 봤네—', '…됐어. 와.'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Jealousy turns into sharing the way steam turns into weather — sudden, wet, irreversible. The sisters leave their rock. Hands find wet shoulders. Mouths find the places Golhwa left unmarked. Decades of sexual tension do not negotiate; they empty into one night.',
		ko: '질투가 나눔으로 바뀌는 법은 김이 날씨로 바뀌는 법과 같다 — 갑자기, 축축하게, 되돌릴 수 없이. 자매가 바위를 떠난다. 손이 젖은 어깨를 찾고, 입이 골화가 안 찍은 곳을 찾는다. 몇십 년의 성적 긴장은 협상하지 않는다. 하룻밤에 비운다.',
		nsfw: true
	},
	// —— FOURSOME ——
	{
		kind: 'p',
		html: 'Four bodies in the black bowl. Golhwa still astride him, loud even spent, pulling a sister’s mouth to hers while she keeps him buried. Narim’s jade silk slides open; the eldest fails into it — breath late, leaf-light shaking, posture abandoned for a bitten lip and a hand that will not stay polite. Hyullé says nothing. Hyullé’s knees finally part enough to climb; soaked, trembling, eyes down, wrecked without a sentence.',
		ko: '검은 사발에 몸 넷. 골화는 아직 타고, 다 쓰고도 크게, 그를 박아 둔 채로 동생의 입을 끌어당긴다. 나림의 옥빛 비단이 벌어진다. 언니가 무너져 들어간다 — 숨이 늦고, 잎빛이 떨리고, 자세는 버리고 입술만 깨물고, 예의 바른 손이 안 남는다. 혈레는 말이 없다. 혈레의 무릎이 겨우 벌어져 올라탄다. 흠뻑 젖고, 떨리고, 눈은 아래, 문장 없이 망가진다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#5fad6e',
		person: 'narim',
		en: ['I should— stop this—', '…Don’t look at me kindly—', 'Ah— Seohyeon—'],
		lines: ['멈춰야— 하는데—', '…친절히 보지 마—', '아— 서현—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#2eb8c4',
		person: 'hyulle',
		en: ['…', 'Nn— ah—', '…Please—'],
		lines: ['…', '응— 아—', '…부탁—'],
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#e0783a',
		person: 'golhwa',
		en: ['Share him—', 'Kiss me while he—', 'Louder— both of you—'],
		lines: ['나눠—', '그거 하는 동안 나랑 키스—', '더 크게— 둘 다—'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Two kissing while one rides. Overlapping limbs. Wet silk clinging to three colors of chima — coral, leaf, teal — open jeogoris, hiked hems, older bare muscle under a pile of goddesses. The spring that waited centuries learns a single night’s arithmetic: mouths, hips, hands, scream, silence, elder-failing moan, and a man who came back too eagerly to pretend he did not want all of it.',
		ko: '둘은 키스하고 하나는 탄다. 겹친 팔다리. 세 빛깔 치마에 젖은 비단이 달라붙는다 — 산호, 잎, 청록 — 벌어진 저고리, 걷힌 단, 그 아래 늙은 맨몸. 몇 백 년을 기다린 샘이 하룻밤의 셈을 배운다. 입, 허리, 손, 비명, 침묵, 언니가 무너지는 신음, 그리고 너무 빨리 돌아와 이 전부를 원하지 않았다고 거짓말할 수 없는 남자.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: '#3E8EF0',
		person: 'seohyeon',
		en: ['All three—', 'I can’t— hold—', 'Take it— take all of it—'],
		lines: ['셋 다—', '못— 참겠소—', '가져가— 다 가져가—'],
		nsfw: true
	},
	{
		kind: 'p',
		html: 'They finish again — not one climax, a chain. Golhwa loud on top. Narim gasping against his lined cheek, eldest voice gone. Hyullé’s wrecked silence breaking into a single high sound she will pretend tomorrow she never made. He empties into whoever has him; the night does not keep score. Steam turns the four into one silhouette pile, then into faces again — spent, trembling, messy hair, hiked silk, grey temples bright with wet.',
		ko: '또 같이 싸 — 한 번이 아니라 사슬. 위에서 골화는 크게. 나림은 주름진 뺨에 대고 헐떡이며 언니 목소리가 사라진다. 혈레의 망가진 침묵이 높은 소리 하나로 깨지고, 내일은 안 냈다고 할 소리. 누가 그를 가졌든 그는 비운다. 밤은 점수를 안 적는다. 김이 넷을 하나의 실루엣 더미로 만들었다가, 다시 얼굴로 푼다 — 다 쓰고, 떨리고, 머리 헝클어지고, 비단 걷히고, 회색 관자놀이가 젖어 빛난다.',
		nsfw: true
	},
	{
		kind: 'p',
		html: 'Afterwards they tremble in the steam — Hyullé’s knees tight against his side again, Narim’s mouth almost on his lined cheek, Golhwa still sitting where she won first, throat raw, arms loose enough now to share. Same heat. Decades on. One night. Consummated — loud — and shared.',
		ko: '끝나고 김 속에서 떤다 — 혈레의 무릎은 다시 옆구리에 모아져 있고, 나림의 입은 주름진 뺨에 거의 닿고, 골화는 처음 이긴 자리에 목이 쉰 채 앉아, 이제는 나눌 만큼 팔이 풀린다. 같은 열. 몇십 년 뒤에도. 하룻밤. 드디어 — 크게 — 그리고 나눠.',
		nsfw: true
	}
];

entry.blocks = [...entry.blocks.slice(0, dayIdx), ...olderBlocks];

const base = {
	ratio: 1.778,
	nsfw: true,
	refs: [golhwa, bnG, seo, cave],
	people: ['golhwa', 'seohyeon']
};

const triadRefs = [golhwa, narim, hyulle, bnG, bnN, bnH, seo, cave];
const triadPeople = ['golhwa', 'narim', 'hyulle', 'seohyeon'];

const newSlots = [
	{
		id: 'seohyeon-older-climax-duo',
		...base,
		tone: '#e86820',
		at: 'They finish together',
		alt: 'Simultaneous climax: Golhwa astride older Seohyeon — open mouths, climax faces, hiked chima, ember steam',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop, climax expression. Luminous adult goddess Golhwa straddling a painterly older East Asian man in black spring — both mid-climax, mouths open, heavy flush, sweat, ember fire aura #e86820. Coral-orange chima hiked high, thighs bare, silk bunched as cover, white jeogori open, wet silk clinging. Face matches attached Golhwa portrait; coral-flame binyeo. He: grey temples, lined, aged from attached Seohyeon portrait. FACE ONLY. No hanbok. No headband. Wet loose hair. Bare wet muscular chest. Dim attached cavern. Waist-up. Tasteful silk cover, no explicit anatomy. No text. No watermark.'
	},
	{
		id: 'seohyeon-older-possessive',
		...base,
		tone: '#e86820',
		at: 'Possessive even wrecked',
		alt: 'Golhwa spent locked on older Seohyeon — arms and thighs possessive, messy hair, hiked chima',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel framing, heavy blush, sweat drop. Aftermath possessive: luminous adult goddess Golhwa spent draped on painterly older East Asian man, arms locked around him, thighs locked, messy hair, hiked coral chima, soft ember glow. Spent pleasure face not polite. Face matches attached Golhwa portrait; coral-flame binyeo. He: grey temples, FACE ONLY from attached Seohyeon aged. No hanbok. No headband. Bare wet chest. Dim attached cavern. Waist-up. Tasteful. No text. No watermark.'
	},
	{
		id: 'seohyeon-older-sisters-join',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'The sisters leave their rock',
		alt: 'Three goddesses leaving the rock toward older bare Seohyeon — jealousy turning to sharing',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop. Three luminous goddesses rising from wet black rock toward a painterly older East Asian man in spring water — Golhwa still close ember #e86820, Narim leaf-light #3d9e52 breathless, Hyullé cyan #2eb8c4 knees starting to part, eyes down. Faces match attached portraits; matching binyeo. He: grey temples, FACE ONLY from attached Seohyeon aged. No hanbok. No headband. Bare wet muscular chest. Dim attached cavern. Waist-up. Tasteful silk, no explicit anatomy. No text. No watermark.',
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-orgy-kiss-ride',
		ratio: 1.778,
		tone: '#e86820',
		nsfw: true,
		at: 'Two kissing while one rides',
		alt: 'Foursome: Golhwa riding older Seohyeon while kissing a sister — overlapping silk and steam',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop, climax expression. Multi-body adult cavern heat: luminous goddess Golhwa straddling painterly older East Asian man, coral chima hiked, open jeogori, while kissing another luminous goddess mouth-to-mouth; third goddess pressed close in teal or leaf silk. Overlapping limbs, wet silk clinging, three accent auras ember #e86820 leaf #3d9e52 cyan #2eb8c4. Faces match attached portraits; matching binyeo. He: grey temples, FACE ONLY aged from attached Seohyeon. No hanbok. No headband. Bare wet muscular torso under silk pile. Dim attached cavern. Waist-up. Tasteful silk cover, no explicit anatomy. No text. No watermark.',
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-narim-fail',
		ratio: 1.778,
		tone: '#3d9e52',
		nsfw: true,
		at: 'the eldest fails into it',
		alt: 'Narim elder-failing into heat on older Seohyeon — open silk, bitten lip, leaf-light',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, sweat drop. Luminous adult eldest goddess Narim close against painterly older East Asian man — white silky jeogori open, leaf-green chima hiked, breath late, bitten lip, floating leaves #3d9e52, posture failing into hunger. Face matches attached Narim portrait; jade-branch binyeo. He: grey temples, lined, FACE ONLY from attached Seohyeon aged. No hanbok. No headband. Bare wet chest. Dim attached cavern. Waist-up. Tasteful. No text. No watermark.',
		refs: [narim, bnN, seo, cave],
		people: ['narim', 'seohyeon']
	},
	{
		id: 'seohyeon-older-hyulle-climb',
		ratio: 1.778,
		tone: '#2eb8c4',
		nsfw: true,
		at: 'Hyullé’s knees finally part enough to climb',
		alt: 'Hyullé climbing older Seohyeon — knees parting, eyes down, soaked teal silk, silent wrecked',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop. Luminous adult goddess Hyullé climbing a painterly older East Asian man in black spring — knees finally parting from tight press, shy gaze down, soaked teal silk clinging, water aura #2eb8c4, silent wrecked face. Face matches attached Hyullé portrait; teal-wave binyeo. He: grey temples, FACE ONLY from attached Seohyeon aged. No hanbok. No headband. Bare wet muscular chest. Dim attached cavern. Waist-up. Tasteful. No text. No watermark.',
		refs: [hyulle, bnH, seo, cave],
		people: ['hyulle', 'seohyeon']
	},
	{
		id: 'seohyeon-older-orgy-pile',
		ratio: 1.778,
		tone: '#3E8EF0',
		nsfw: true,
		at: 'Steam turns the four into one silhouette pile',
		alt: 'Soft steam silhouette pile: three goddesses and older Seohyeon overlapping in cavern haze',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. SHARED FRAME. Magical aura, anime-painterly cavern spirit, not photoreal. Softened multi-body composition: overlapping adult limbs and wet silk in heavy cavern steam — three luminous goddess silhouettes in coral, leaf, and teal accents with a painterly older East Asian man under them. Faces half-lost in steam when soft; when visible match attached portraits. He: grey temples if visible, FACE ONLY, no hanbok, no headband, bare wet shoulders. Monumental steam pile, not a catalog. Dim attached cavern. Waist-up. Tasteful silk and silhouette, no explicit anatomy. No text. No watermark.',
		refs: triadRefs,
		people: triadPeople
	},
	{
		id: 'seohyeon-older-orgy-faces',
		ratio: 0.75,
		tone: '#e86820',
		nsfw: true,
		at: 'a chain. Golhwa loud on top',
		alt: 'Worm’s-eye orgy close: climax faces stacked — Golhwa loud, Narim gasping, Hyullé wrecked',
		prompt:
			'Intimate cinematic CLOSE-UP still, 9:16. Magical aura, anime-painterly cavern spirit, not photoreal. manhwa panel, erotic comic framing, heavy blush, heart pupils, sweat drop, climax expression. Worm\'s-eye low angle: three luminous goddess climax faces stacked in steam — Golhwa loud open mouth ember #e86820, Narim gasping leaf #3d9e52, Hyullé wrecked eyes-down cyan #2eb8c4. Wet silk and hiked chima edges. Faces match attached portraits; matching binyeo. Painterly older man grey-temple sliver under them, FACE ONLY from attached Seohyeon. No hanbok. No headband. Dim cavern. Tasteful. No text. No watermark.',
		refs: triadRefs,
		people: triadPeople
	}
];

// Update `at` on existing older slots to match new copy
const atUpdates = {
	'seohyeon-older-wide': 'The spring does not hide much',
	'seohyeon-older-straddle': 'Golhwa climbs into his lap first',
	'seohyeon-older-kiss': 'She kisses him like she has been waiting decades',
	'seohyeon-older-ride': 'She seats herself on him in the black bowl',
	'seohyeon-older-hips': 'Hips pressed together in the water',
	'seohyeon-older-scream': 'Then she rides — and the quiet of the spring dies',
	'seohyeon-older-spent': 'She collapses on his wet chest',
	'seohyeon-older-hyulle-press': 'Hyullé watches with her knees still pressed',
	'seohyeon-older-close': 'Narim’s breath goes late on his lined cheek',
	'seohyeon-older-afterglow': 'Afterwards they tremble in the steam'
};

for (const im of entry.images) {
	if (atUpdates[im.id]) im.at = atUpdates[im.id];
}

function upsertAfter(afterId, slots) {
	for (const slot of slots) {
		const i = entry.images.findIndex((im) => im.id === slot.id);
		if (i >= 0) Object.assign(entry.images[i], slot);
		else {
			const at = entry.images.findIndex((im) => im.id === afterId);
			entry.images.splice(at >= 0 ? at + 1 : entry.images.length, 0, slot);
			afterId = slot.id;
		}
	}
}

upsertAfter('seohyeon-older-scream', [
	newSlots.find((s) => s.id === 'seohyeon-older-climax-duo'),
	newSlots.find((s) => s.id === 'seohyeon-older-possessive')
]);
upsertAfter('seohyeon-older-close', [
	newSlots.find((s) => s.id === 'seohyeon-older-sisters-join'),
	newSlots.find((s) => s.id === 'seohyeon-older-orgy-kiss-ride'),
	newSlots.find((s) => s.id === 'seohyeon-older-narim-fail'),
	newSlots.find((s) => s.id === 'seohyeon-older-hyulle-climb'),
	newSlots.find((s) => s.id === 'seohyeon-older-orgy-pile'),
	newSlots.find((s) => s.id === 'seohyeon-older-orgy-faces')
]);

for (const slot of newSlots) {
	imagePeople[slot.id] = slot.people;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');

// verify anchors
const missing = [];
for (const im of entry.images) {
	if (!im.id?.startsWith('seohyeon-older')) continue;
	if (!im.at) continue;
	const hit = entry.blocks.some((b) => {
		const t =
			(b.html ?? '') +
			' ' +
			(b.ko ?? '') +
			' ' +
			(b.lines ?? []).join(' ') +
			' ' +
			(b.en ?? []).join(' ') +
			' ' +
			(b.label ?? '');
		return t.includes(im.at);
	});
	if (!hit) missing.push(`${im.id} -> ${im.at}`);
}

console.log('YEARS LATER blocks:', entry.blocks.length - dayIdx);
console.log(
	'older slots:',
	entry.images.filter((i) => i.id?.startsWith('seohyeon-older')).map((i) => i.id)
);
if (missing.length) {
	console.error('ANCHOR MISS', missing);
	process.exit(1);
}
console.log('ok — all older anchors resolve');
