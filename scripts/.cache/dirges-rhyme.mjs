// Rewrites each death's bier song as a children's rhyme: a title with an epithet, the first line opening
// on the person's full name, three short couplets each answered by a sing-song refrain.
// Usage: node scripts/.cache/dirges-rhyme.mjs
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const REFRAIN_KO = '어허 어허, 잘 가거라';
const REFRAIN_EN = 'Eo-heo, eo-heo, off you go';

/** person → [title, titleKo, [ko1, ko2, en1, en2] × 3] */
const SONGS = {
	gotaso: ['Gotaso the Paper Bird', '종이새 고타소', [
		['김고타소, 작은 새야', '말도 없이 소매 따라 시집갔네', 'Kim Gotaso, little bird,', 'married a sleeve without a word.'],
		['새를 잃었니? 하나 더 접어 줄게', '날개는 아까보다 더 크게', 'Lost the bird? She’ll fold one more,', 'bigger wings than the one before.'],
		['성문엔 불, 대청엔 연기', '“날 봐요” 한마디, 그게 다였지', 'Fire at the gate and smoke in the hall —', '“Look at me,” and that was all.']
	]],
	pumsuk: ['Pumsuk Who Walked Behind', '뒤따라 걸은 품석', [
		['김품석, 보라 소매 입고', '상냥히 웃고 아무것도 몰랐네', 'Kim Pumsuk, in purple dressed,', 'smiled so kind and never guessed.'],
		['수레 곁에 나란히, 앞서지 않더니', '이제는 그 뒤를 따라가네', 'Rode by her wheel and not ahead;', 'walks behind her now instead.'],
		['첫날밤 손이 차가웠다고', '가진 게 그뿐이라 그 말만 했네', 'Her hands were cold the night they wed —', 'that’s all he had, so that’s what he said.']
	]],
	muryuk: ['Muryuk, the Last Prince', '마지막 왕자 무력', [
		['김무력, 바닷가 나라 왕자님', '나라 잃고 신라 손을 잡았네', 'Kim Muryuk, prince of the sea-land,', 'lost his kingdom, took Silla’s hand.'],
		['하얀 머리에 높은 고깔 쓰고', '사라진 나라 쪽만 돌아봤네', 'Tall cone hat on his old grey head,', 'looking back where his kingdom fled.'],
		['손자를 안은 건 숨 한 번 동안', '그 숨 한 번 안고 떠나가네', 'He held his grandson for one breath,', 'and kept that breath all the way to death.']
	]],
	seohyeon: ['Seohyun Who Rode in the Dark', '어둠 속을 달린 서현', [
		['김서현, 이랴 이랴 달려라', '깜깜한 밤엔 아무도 몰라', 'Kim Seohyun, giddy-up, go!', 'Riding in the dark where nobody knows.'],
		['아빠는 뒤를, 아들은 하늘을', '공주님 손잡고 달아났지', 'Father looked back; he looked at the sky,', 'ran with a princess and didn’t ask why.'],
		['짧게 말하는 법 끝내 몰라서', '우리도 길게 길게 불러 주네', 'He never could tell the short way through,', 'so we sing it long, the whole road too.']
	]],
	bidam: ['Bidam of the Hundred and Eight Beads', '백팔 염주 비담', [
		['손비담, 염주알 데굴데굴', '별 하나 떨어지자 버티고 섰네', 'Son Bidam, beads go round;', 'a star fell down and he stood his ground.'],
		['제 나라 사랑했지, 서툴게 사랑했지', '검은 띠 매고 너무 오래 섰네', 'Loved his country, loved it wrong,', 'tied the black band and stayed too long.'],
		['역적일까 임금일까 아무도 몰라', '말은 북쪽으로, 그도 가네', 'Traitor or king? Nobody knows;', 'his horse went north, and so he goes.']
	]],
	sunduk: ['Dukman, the Queen Who Read the Sky', '하늘 읽은 여왕 덕만', [
		['김덕만, 금관 쓴 여왕님', '“웃기지!” 늙은 대신들 투덜투덜', 'Kim Dukman, queen in gold,', '“Ridiculous!” the old men scold.'],
		['별이랑 이야기하려 탑을 쌓고', '겨울 개구리 울음에 적을 찾았네', 'Built a tower to talk to the stars,', 'heard winter frogs and found where they are.'],
		['낭산 양지에 무덤 정하고', '말한 그날 그대로 떠났네', 'Picked her grave on Mount Nang’s side,', 'and on the day she said, she died.']
	]],
	jinduk: ['Seungman, the Last of the Bone', '마지막 성골 승만', [
		['김승만, 마지막 성골', '금자리 혼자서 따뜻이 지켰네', 'Kim Seungman, last of the Bone,', 'kept the gold chair warm on her own.'],
		['서쪽 황제께 비단 노래 수놓아', '멀리 보내고 애썼다네', 'Stitched a song in silk for the West,', 'sent it away and did her best.'],
		['그 숨 꺼지자 거룩한 뼈도 꺼져', '마지막 등불, 그걸로 끝', 'When she went, the old bone went too —', 'the last bright lamp, and then it was through.']
	]],
	talhae: ['Talhae Out of the Box', '상자에서 나온 탈해', [
		['석탈해, 상자에서 나왔지', '바닷가 바위에서 까치가 울었지', 'Suk Talhae, out of a box;', 'a magpie cried on the seaside rocks.'],
		['숯을 묻고 “내 집이야!”', '대장장이 꾀로 집을 얻었지', 'Buried some charcoal — “That one’s mine!” —', 'and won a house with a smith’s design.'],
		['아주 먼 훗날 무덤 파 보니', '말하던 그 키 그대로 누웠네', 'Dig him up in a long, long while:', 'just as tall as he said, with a smile.']
	]],
	seongchung: ['Sunchung the Honest', '바른말 성충', [
		['성충아 성충아, 바른말 성충', '임금님께 또 바른말 했네', 'Sunchung, Sunchung, honest and plain,', 'told the king the truth again.'],
		['쌀 한 톨 없는 깜깜한 옥에서', '붓 들고 “고개를 막으소서” 적었네', 'Locked in the dark with a brush and no rice,', 'he wrote, “Hold the pass,” and he wrote it twice.'],
		['임금님은 한 줄 읽고 술독 올려놓고', '바른말 성충은 떠나갔네', 'The king read one line and set the wine jar on,', 'and honest old Sunchung was gone.']
	]],
	gyebek: ['Gyebek of the Five Thousand', '오천의 계백', [
		['계백아 계백아 어디 가니', '누런 바람 부는 벌판에 간다', 'Gyebek, Gyebek, where did you go?', 'Out to the field where the yellow winds blow.'],
		['오천 명이 줄지어 섰네', '네 번은 막고 다섯 번째엔 졌네', 'Five thousand men stood up in a row:', 'four times yes, and the fifth time no.'],
		['모든 걸 세다가 마지막을 세고', '한 번 한 약속 꼭 지켰네', 'He counted it all, then he counted his last;', 'he gave his word, and he held it fast.']
	]],
	euija: ['Euija, Zengzi of the East', '해동증자 의자', [
		['부여의자, 착한 아드님', '북처럼 웃고 신나게 다스렸네', 'Buyeo Euija, good little son,', 'laughed like a drum and ruled for fun.'],
		['강 위에 용 한 마리 걸어 놓고', '성 마흔 개 뺏고 꿈에서 깼네', 'Hung up a dragon over the stream,', 'took forty forts, and woke from the dream.'],
		['집에서 먼 춥고 잿빛 방에서', '화내다, 비우다, 다 놓았네', 'Far from home in a cold grey hall:', 'angry, then empty, then nothing at all.']
	]],
	chunchu: ['Chunchu Who Knelt', '무릎 꿇은 춘추', [
		['김춘추, 무릎을 꿇어라', '장군께, 황제께, 백제엔 안 꿇어', 'Kim Chunchu, bend the knee —', 'to tyrant, to emperor, never Baekje.'],
		['불타는 밤에 딸을 잃고', '영리한 머리 다 써서 갚았네', 'Lost his daughter one burning night,', 'spent all his clever to make it right.'],
		['백제는 없고 고구려는 남아', '반은 아들 손에 맡겼네', 'Baekje’s gone and Goguryeo stands —', 'half the job in his son’s two hands.']
	]],
	gesomun: ['Gesomun of the Five Swords', '칼 다섯 개소문', [
		['연개소문, 칼이 다섯', '잔치 한가운데 조정을 베었네', 'Yeon Gesomun, five swords long,', 'cut down a court in the middle of a song.'],
		['황제가 둘이나 와 아파서 돌아가니', '욕을 하며 더 오라 했네', 'Two emperors came and went home sore;', 'he called them names and asked for more.'],
		['의자에 앉은 채로 잠이 들고', '아들 셋, 인장 하나, 숙제 하나', 'Fell asleep sitting up in his chair:', 'three sons, one seal, and one dare.']
	]],
	yushin: ['Yushin of the Eastern Star', '동쪽 별 유신', [
		['김유신, 파란 옷 대장군', '가야 소년이 신라를 세웠네', 'Kim Yushin, marshal in blue,', 'a Gaya boy who made Silla true.'],
		['벗이랑 백여덟 번 비기고', '딱 한 번 이긴 날, 그게 끝이었네', 'A hundred and eight draws with his best friend;', 'he won only once, and that was the end.'],
		['임금처럼 묻고 신하로 적었네', '동쪽 하늘 저 별이 바로 그 사람', 'Buried like a king but written below —', 'that star in the east? That’s him, you know.']
	]],
	munmu: ['Bupmin, the Dragon in the Sea', '바다의 용 법민', [
		['김법민, 마당 소년 임금님', '십육 년 싸우고 다 이뤘네', 'Kim Bupmin, the yard-boy king:', 'sixteen years of war, and everything.'],
		['칼끝으로 서쪽 손님 문밖에 내보내고', '언덕 하나, 강 하나, 마지막 나루', 'Showed the West the door with his sword —', 'a hill, a river, and a final ford.'],
		['바닷가서 사르고 바다에 묻으니', '바라던 대로 물결 속 용이 됐네', 'Burned on the shore and laid in the sea,', 'a dragon in the tide, as he asked to be.']
	]]
};

const entries = story.flatMap((ch) => ch.entries ?? []);
const done = [];
for (const e of entries) {
	for (const b of e.blocks) {
		if (b.kind !== 'verse' || !b.person || !SONGS[b.person]) continue;
		const [title, titleKo, couplets] = SONGS[b.person];
		const oldFirst = b.en?.[0];
		b.title = title;
		b.titleKo = titleKo;
		b.lines = [];
		b.en = [];
		b.refrain = [];
		for (const [k1, k2, e1, e2] of couplets) {
			b.lines.push(k1, k2, REFRAIN_KO);
			b.en.push(e1, e2, REFRAIN_EN);
			b.refrain.push(b.lines.length - 1);
		}
		/** Stills anchored to the old song's lines follow it to the new first line. */
		for (const im of e.images ?? []) {
			if (!im.at) continue;
			const onSong = [...(b.lines ?? []), ...(b.en ?? [])].join(' ').toLowerCase().includes(im.at.toLowerCase());
			const onOld = oldFirst && oldFirst.toLowerCase().includes(im.at.toLowerCase());
			if (!onSong && (onOld || /made the second wing|tonight he walks behind|kept looking back at a door|ran with a king|stood there too long|frogs in the winter|old blood, though alone|smith’s little quiz|hold the pass, keep|fifth was in vain|forty-odd forts|cleverness setting|words we can’t sing|made silla true|in the tide, as he asked/i.test(im.at))) {
				im.at = couplets[1][2];
			}
		}
		done.push(b.person);
	}
}
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(done.length, 'songs:', done.join(', '));
