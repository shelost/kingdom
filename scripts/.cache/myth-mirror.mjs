import fs from 'node:fs';
const F = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(F, 'utf8'));
const E = story.flatMap((c) => c.entries);
const bh = E.find((e) => e.title === 'Bihyung');
const km = E.find((e) => e.title === 'King Muyeol');
const fb = km.blocks.find((b) => b.kind === 'flashback').blocks;
const txt = (b) => JSON.stringify(b);
const idx = (blocks, s) => {
	const i = blocks.findIndex((b) => txt(b).includes(s));
	if (i < 0) throw new Error('anchor missing: ' + s);
	return i;
};
const after = (blocks, anchor, guard, ...add) => {
	if (txt(blocks).includes(guard)) return;
	blocks.splice(idx(blocks, anchor) + 1, 0, ...add);
};
const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines, speaker) => ({ kind: 'dialogue', person, ...(speaker ? { speaker } : {}), en, lines });

// ——— The song (Bihyung) ———
after(bh.blocks, 'The court calls it the Ghost Bridge and walks the long way round.', 'taps each stone with his cane',
	p('Prince Suulbu does not walk the long way round. He walks across the Ghost Bridge once, slowly, and taps each stone with his cane. Then he goes home and asks his steward what forty goblins eat.',
		'수을부 공은 돌아가지 않는다. 귀교를 한 번, 천천히 건너며 지팡이로 돌을 하나하나 두드린다. 그러고는 집에 가서 집사에게 묻는다. 도깨비 마흔이면 뭘 먹느냐고.'));

after(bh.blocks, 'The next morning there is a new clerk in the palace.', 'throws a red cloth over it',
	p('The song is very exact about how. The madman carries a fox into the throne hall in his arms, a real fox with a goblin’s eyes, and sets it down before the dais. He throws a red cloth over it. He says three words nobody can repeat afterwards. When he whips the cloth away, a young man is kneeling there in an orange robe, blinking at the lamps, and the fox is gone.',
		'노래는 그 방법을 아주 정확하게 기억한다. 미치광이가 여우 한 마리를 품에 안고 정전에 들어온다. 진짜 여우인데 눈은 도깨비 눈이다. 옥좌 앞에 내려놓고 붉은 천을 덮는다. 아무도 따라 할 수 없는 말 세 마디. 천을 확 걷자 주황 도포를 입은 젊은이 하나가 꿇어앉아 등불에 눈을 깜박이고, 여우는 간 데가 없다.'),
	d('jinpyung', ['…Can he count?'], ['…셈은 하느냐?']),
	d('gildal', ['To any number Your Majesty likes.'], ['폐하께서 원하시는 데까지 하옵니다.']),
	p('At the back of the hall Suulbu watches the cloth, not the man. He watches it all the way out of the door.',
		'정전 맨 뒤에서 수을부는 사람이 아니라 천을 본다. 문밖으로 나갈 때까지 천만 본다.'));

after(bh.blocks, 'Bihyung explains to anyone who asks that he turned the goblin into a man overnight', 'Ghosts don’t get paid.',
	p('A month later Suulbu puts a servant behind the screen in the east corridor, where the madman talks to the rafters every evening. The servant comes back white.',
		'한 달 뒤 수을부는 동쪽 회랑 병풍 뒤에 하인 하나를 숨긴다. 미치광이가 저녁마다 서까래와 떠드는 곳이다. 하인은 하얗게 질려 돌아온다.'),
	d(null, ['He was talking to something, my lord. It answered. I couldn’t hear it, but he kept waiting for it to finish.', '…And it was about wages, my lord. Who’s owed for what.'], ['뭔가랑 말을 하고 있었습니다, 나리. 대답도 했고요. 저한텐 안 들렸는데, 그분이 자꾸 그게 말 끝나길 기다렸어요.', '…그런데 품삯 얘기였습니다, 나리. 누구한테 얼마 줘야 하는지.'], 'A servant'),
	d('sukhuljong', ['Ghosts don’t get paid.'], ['귀신은 품삯을 안 받는다.']),
	p('The next morning he asks the king, very politely, whether a palace is the right place for a man who argues with walls.',
		'이튿날 아침 그는 아주 공손하게 왕에게 묻는다. 벽과 말다툼하는 자가 궁에 있어도 되겠느냐고.'),
	d('sukhuljong', ['The provinces are quieter, Majesty. Fewer walls. He might get well.'], ['지방은 조용하옵니다, 폐하. 벽도 적고요. 나을지도 모르지요.']),
	d('jinpyung', ['He talks to walls, uncle. You talk to the Council.', 'I know which one of you I’d rather send away.'], ['저 아이는 벽이랑 말하지요, 숙부. 숙부는 화백이랑 하시고.', '둘 중 누굴 보내고 싶은지는 과인이 압니다.']));

const fox = idx(bh.blocks, 'One morning the gate is empty, and a fox is running down the road');
if (!txt(bh.blocks).includes('wept the whole way')) {
	bh.blocks.splice(fox + 1, 0,
		p('The song gives the hunt a whole verse. The goblins come out of every culvert in the city with their lanterns. The madman runs at the front of them, barefoot, calling the fox by its name, and the reeds bend flat to show which way it went.',
			'노래는 그 사냥에 한 소절을 통째로 바친다. 도깨비들이 성안 수로마다 등불을 들고 쏟아져 나온다. 미치광이는 맨발로 맨 앞에서 달리며 여우의 이름을 부르고, 갈대는 납작 엎드려 여우가 간 쪽을 가리킨다.'),
		p('And the song remembers the part the city does not. When it was done he carried the fox through every ward of Surabol on his own horse, and he wept the whole way, so hard the street could hear it over the hooves.',
			'그리고 노래는 도성이 잊은 대목을 기억한다. 일이 끝나자 그는 여우를 제 말에 싣고 서라벌 모든 동네를 돌았다. 가는 내내 울었다. 말발굽 소리 너머로 온 거리가 들을 만큼.'));
}

// ——— The truth (King Muyeol flashback) ———
after(fb, 'I’ll tell them I turned you into a man.', 'basket with a real fox in it',
	p('Here is how a goblin is turned into a man. A basket with a real fox in it, bought from a trapper for a week of wages. A red cloth with a slit sewn down the middle. A floorboard under the dais that Gildal loosened himself, because he is good with floors. The madman sets the fox down and throws the cloth. Under it, the fox goes into a sack in his sleeve, and Gildal comes up through the floor. It takes the time of three words.',
		'도깨비를 사람으로 바꾸는 법은 이렇다. 사냥꾼한테 일주일 품삯을 주고 산 진짜 여우가 든 바구니 하나. 가운데를 터서 꿰맨 붉은 천 하나. 길달이 손수 헐겁게 해 둔 옥좌 앞 마루청 하나. 마루는 그의 장기다. 미치광이가 여우를 내려놓고 천을 던진다. 천 밑에서 여우는 그의 소매 속 자루로 들어가고, 길달은 마루 밑에서 올라온다. 말 세 마디면 끝나는 시간이다.'),
	d('gildal', ['And if the fox bites?'], ['여우가 물면요?']),
	d('yongsu', ['Then I’ll be a madman with a bandage. Nobody will notice.'], ['그럼 붕대 감은 미치광이가 되는 거지. 아무도 눈치 못 채.']));

after(fb, 'So he does. The court is very impressed by the transformation.', 'Suulbu has been counting the madman',
	p('One man is not impressed. Suulbu has been counting the madman for years: who sells him rice cakes, why the stream talks loudest on nights the Council sits, how a servant with no office pays forty men. He doesn’t know the answer yet. He knows it adds up to something.',
		'감탄하지 않는 사람이 하나 있다. 수을부는 몇 해째 미치광이를 세고 있었다. 누가 떡을 대 주는지, 왜 화백이 열리는 밤에만 냇물이 제일 시끄러운지, 벼슬도 없는 하인이 어떻게 마흔 사람 품삯을 대는지. 답은 아직 모른다. 다만 셈이 뭔가로 맞아떨어진다는 건 안다.'));

after(fb, 'LONG LIVE KING JINPYUNG…!', 'nobody can see his face',
	p('From the palace wall he is very small: one horse, one rider, something orange across the saddle, going ward by ward. Nobody up there can see his face. They can see what the ride does to the streets. Doors close. A child is pulled indoors by the collar. On the Council’s balcony Suulbu stands up so fast his chair goes over, and for once in his life he looks old.',
		'궁성 담 위에서 보면 그는 아주 작다. 말 한 필, 사람 하나, 안장에 걸친 주황빛 무언가. 동네에서 동네로. 위에서는 아무도 그의 얼굴을 못 본다. 보이는 건 그 행렬이 거리에 하는 짓이다. 문이 닫힌다. 아이 하나가 멱살 잡혀 집 안으로 끌려 들어간다. 화백 누각에서 수을부가 너무 급히 일어나 의자가 넘어가고, 그는 평생 처음으로 늙어 보인다.'));

fs.writeFileSync(F, JSON.stringify(story, null, '\t') + '\n');
console.log('ok');
