#!/usr/bin/env node
/** Rewrite Park Jesang (traitor ruse, Wa fleet, Tsushima) and add Gwanggaeto's boot. */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entries = story.flatMap((ch) => ch.entries ?? []);
const jesang = entries.find((e) => e.title === 'Park Jesang');
const gwang = entries.find((e) => e.title === 'King Gwanggaeto');
if (!jesang || !gwang) throw new Error('missing entry');

const footFlashback = [
	{
		kind: 'scene',
		label: 'The Boot',
		ko: '발',
		jump: { year: 400, en: 'Eighteen Winters Earlier…', ko: '십팔 년 전…' }
	},
	{
		kind: 'p',
		html: 'Silla asked. That is the part the songs skip. The horsemen came down like weather, and then they did not leave.',
		ko: '신라가 청했다. 노래가 빼는 대목이다. 기병들이 날씨처럼 내려왔고, 그다음엔 안 떠났다.'
	},
	{
		kind: 'p',
		html: 'The Silla king comes down from his own wall. He has already written the word. Now he has to wear it.',
		ko: '신라 임금이 제 성벽에서 내려온다. 글자는 이미 썼다. 이제 그걸 입어야 한다.'
	},
	{
		kind: 'p',
		html: 'He kneels in the packed earth of his own yard. The Great King does not get off the horse at first. Then he does. He puts his boot on the head.',
		ko: '제 마당 다진 흙에 무릎을 꿇는다. 태왕은 처음에 말에서 안 내린다. 그다음에 내린다. 그 머리에 발을 올린다.'
	},
	{
		kind: 'dialogue',
		speaker: 'The Silla King',
		gender: 'm',
		en: ['Great King.'],
		lines: ['태왕이시여.']
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['You wrote it.'],
		lines: ['네가 썼지.']
	},
	{
		kind: 'dialogue',
		speaker: 'The Silla King',
		gender: 'm',
		en: ['…I wrote it.'],
		lines: ['……내가 썼소.']
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['Then stay there.', 'Fifty thousand. You’ll remember the number.', 'You’ll remember this more.'],
		lines: ['그럼 그대로 있어.', '오만. 숫자는 기억할 거다.', '이건 더 기억할 거다.']
	},
	{
		kind: 'p',
		html: 'The yard is very quiet. A thin country learns, in the dirt, what asking costs.',
		ko: '마당이 아주 조용하다. 얇은 나라가, 흙 위에서, 청하는 값을 배운다.'
	},
	{
		kind: 'scene',
		label: 'The Empty Hall',
		ko: '빈 대청',
		jump: { year: 418, en: 'Eighteen Winters Later…', ko: '십팔 년 뒤…' }
	}
];

const returnAndWa = [
	{
		kind: 'p',
		html: 'On the Silla side a royal rider is already waiting. He did not come to congratulate them. He came with the next sentence.',
		ko: '신라 쪽에 왕실 기병 하나가 이미 기다려 있다. 축하하러 온 사람이 아니다. 다음 문장을 들고 온 사람이다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A royal rider',
		gender: 'm',
		en: ['The king wants you in the hall.', 'Now.'],
		lines: ['임금께서 대청으로 오라 하셨습니다.', '지금입니다.']
	},
	{
		kind: 'p',
		html: 'Jesang looks at his own gate, which is close enough to smell. Bokho looks at Jesang. The rider looks at neither of them.',
		ko: '제상이 제 문을 본다. 냄새까지 나는 거리다. 복호가 제상을 본다. 기병은 둘 다 안 본다.'
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['The hall.', 'Then home.'],
		lines: ['대청.', '그다음 집.']
	},
	{
		kind: 'dialogue',
		person: 'bokho',
		en: ['Your face says the second one isn’t a promise.'],
		lines: ['얼굴이, 두 번째는 약속이 아니래요.']
	},
	{
		kind: 'section',
		label: 'The Return',
		ko: '돌아옴'
	},
	{
		kind: 'place',
		place: 'moon_palace'
	},
	{
		kind: 'scene',
		label: 'Moon Palace',
		ko: '월성'
	},
	{
		kind: 'p',
		html: 'The Moon Palace is a timber hall that thinks it is a country. One lamp. Two brothers back, if you count the one still on an island. Nulji has not slept.',
		ko: '월성은 나라인 척하는 나무 대청이다. 등불 하나. 아우가 둘, 섬에 남은 하나까지 세면. 눌지는 안 잤다.'
	},
	{
		kind: 'p',
		html: 'Bokho comes in first. The king stands up, which is the first honest thing he has done all week, and it is not enough. Jesang comes in behind with the river still on his sleeve.',
		ko: '복호가 먼저 들어온다. 눌지가 일어선다. 이번 주 그가 한 일 중에 제일 정직한 일이다. 그것으로는 안 된다. 제상이 소매에 강을 묻힌 채로 뒤에 들어온다.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Well.', 'The other one.'],
		lines: ['그래.', '다른 하나.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Tonight I go home.', 'Tomorrow the island.'],
		lines: ['오늘 밤 집에 간다.', '내일 섬.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['No.', 'Now.'],
		lines: ['안 돼.', '지금.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I have a gate.', 'I have a wife behind it.', 'I have not seen her face since you sent me north.'],
		lines: ['나 문 있어.', '그 안에 아내 있어.', '북으로 보낸 뒤로 얼굴도 못 봤어.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['And I have a brother on an island.', 'You knew that when you sat down.'],
		lines: ['난 섬에 아우가 있어.', '앉을 때부터 알았잖아.']
	},
	{
		kind: 'p',
		html: 'They do not lower their voices. The yard has ears. A maid stops with a bucket. An officer stops with a spear he is not using.',
		ko: '목소리를 낮추지 않는다. 마당에 귀가 있다. 계집종이 들통을 든 채로 선다. 장수가 안 쓰는 창을 든 채로 선다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A maid in the yard',
		gender: 'f',
		en: ['They’re shouting.', 'The king and the south-shore man.'],
		lines: ['싸우네.', '임금하고 남쪽 사람.']
	},
	{
		kind: 'dialogue',
		speaker: 'An officer',
		gender: 'm',
		en: ['Don’t look.', 'Look.'],
		lines: ['보지 마.', '봐.']
	},
	{
		kind: 'p',
		html: 'She is already at the door. She heard he was back. She came the way a person comes when one night is all she is asking for.',
		ko: '이미 문 앞에 있다. 돌아왔다는 소리를 들었다. 하룻밤만 달라는 사람이 오는 방식으로 왔다.'
	},
	{
		kind: 'dialogue',
		person: 'chisul',
		en: ['제상.', 'Just— just inside.', 'Today. Inside the door.'],
		lines: ['제상.', '그냥— 그냥 안으로.', '오늘. 문 안으로.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I know.', 'I asked.'],
		lines: ['알아.', '내가 말했어.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['If you go in, you stay.', 'You said that last time.', 'The other boy is still on an island.'],
		lines: ['들어가면 남아.', '지난번도 그렇게 말했잖아.', '다른 애는 아직 섬에 있어.']
	},
	{
		kind: 'dialogue',
		person: 'chisul',
		en: ['Then you go.', 'You said you would.', 'You said if he didn’t—'],
		lines: ['그럼 당신이 가요.', '간다고 했잖아요.', '안 가면 내가 간다고—']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['I can’t.'],
		lines: ['못 가.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['One night.', 'That’s all I’m spending.', 'I will not spend her.'],
		lines: ['하룻밤.', '내가 쓰는 건 그거뿐이야.', '그 사람은 안 써.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['If you will not go as my man,', 'you go as something else.'],
		lines: ['내 사람으로 안 가면,', '다른 걸로 가.']
	},
	{
		kind: 'p',
		html: 'The yard hears that. The maid puts the bucket down. The officer finds a use for the spear.',
		ko: '마당이 그 말을 듣는다. 계집종이 들통을 내려놓는다. 장수가 창을 쓸 곳을 찾는다.'
	},
	{
		kind: 'scene',
		label: '불지지',
		ko: '불지지'
	},
	{
		kind: 'p',
		html: 'The guards take her in the packed earth of the yard. The children are behind her. She stretches her legs and will not get up. Later they name that dirt. They call it 불지지 — the place she would not stand.',
		ko: '군사들이 마당 다진 흙에서 그녀를 잡는다. 아이들이 뒤에 있다. 그녀는 다리를 뻗고 일어서지 않는다. 나중에 그 흙에 이름을 붙인다. 불지지. 일어서지 않은 곳.'
	},
	{
		kind: 'dialogue',
		person: 'chisul',
		en: ['You didn’t even turn.', 'You didn’t even—', '제상!'],
		lines: ['안 돌아봤어.', '안 돌아봤잖아—', '제상!']
	},
	{
		kind: 'p',
		html: 'He looks at the king. Not at her. Looking at her would make the rest of it optional.',
		ko: '임금을 본다. 그녀는 안 본다. 보면 나머지가 선택이 되니까.'
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['The children first.', 'Stand up.', 'Please.'],
		lines: ['아이들 먼저.', '일어서.', '제발.']
	},
	{
		kind: 'dialogue',
		person: 'chisul',
		en: ['After.', 'When is after.', 'When is after the island.'],
		lines: ['그다음.', '그다음이 언제야.', '섬 다음이 언제야.']
	},
	{
		kind: 'scene',
		label: 'The Cell',
		ko: '방'
	},
	{
		kind: 'p',
		html: 'They put her in a room with no window that faces the sea. The girls sit on the floor and do not ask which king did this. They already know.',
		ko: '바다를 보는 창이 없는 방에 넣는다. 딸들이 바닥에 앉아, 어느 임금이 이러느냐고 묻지 않는다. 이미 안다.'
	},
	{
		kind: 'dialogue',
		person: 'chisul',
		en: ['He asked for a night.', 'I heard him.', 'I was at the door.'],
		lines: ['하룻밤 달랬어.', '들었어.', '문에 있었어.']
	},
	{
		kind: 'dialogue',
		speaker: 'The elder daughter',
		gender: 'f',
		chip: '#c9a070',
		en: ['Mother.', 'He didn’t turn.'],
		lines: ['엄마.', '안 돌아봤어요.']
	},
	{
		kind: 'dialogue',
		person: 'chisul',
		en: ['I know.', 'I know, I know—'],
		lines: ['알아.', '알아, 알아—']
	},
	{
		kind: 'scene',
		label: 'The Word',
		ko: '글자'
	},
	{
		kind: 'p',
		html: 'Nulji names him in the yard, loud, the way you name a man you want the water to hear.',
		ko: '눌지가 마당에서 그의 이름을 부른다. 크게. 물이 듣게 하려는 사람이 부르는 방식으로.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: [
			'Park Jesang of the south shore is a traitor to this country.',
			'His house is closed.',
			'His wife and his children sit until he brings the other boy home.',
			'That is the only door I will open.'
		],
		lines: [
			'남쪽 박제상은 이 나라의 반역이다.',
			'집을 닫는다.',
			'아내와 아이들은, 다른 애를 데려올 때까지 앉아 있다.',
			'내가 열 문은 그것뿐이다.'
		]
	},
	{
		kind: 'p',
		html: 'The maid picks the bucket up. The officer looks at the man in magenta silk as if the silk had changed colour. Jesang does not argue. Arguing would make it a play they were in together, and the yard is not allowed to know that yet.',
		ko: '계집종이 들통을 든다. 장수가 자줏빛 비단 사람을 본다. 비단 색이 변한 것처럼. 제상은 반박하지 않는다. 반박하면 둘이 같이 하는 극이 되니까. 마당은 아직 그걸 알면 안 된다.'
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Then I go.'],
		lines: ['그럼 간다.']
	},
	{
		kind: 'section',
		label: 'Wa',
		ko: '왜'
	},
	{
		kind: 'place',
		place: 'asuka'
	},
	{
		kind: 'scene',
		label: 'Asuka',
		ko: '아스카'
	},
	{
		kind: 'p',
		html: 'The East’s court sits on packed earth and raised floors. Cypress. A gravel yard that has never heard a Silla song. Jesang walks into it wearing the name the yard gave him.',
		ko: '동쪽 조정은 다진 흙과 마루 위에 앉아 있다. 잣나무. 신라 노래를 들어 본 적 없는 자갈 마당. 제상이, 마당이 준 이름을 입은 채로 들어간다.'
	},
	{
		kind: 'map',
		year: 418,
		places: ['surabol', 'tsushima', 'asuka'],
		routes: ['jesang418-wa-fleet'],
		caption: 'A traitor asks for a fleet. The East likes the story.',
		ko: '반역이 함대를 청한다. 동쪽이 그 이야기를 좋아한다.'
	},
	{
		kind: 'p',
		html: 'The Wa king does not get up. He likes a man who arrives already ruined.',
		ko: '왜왕은 일어나지 않는다. 이미 망하고 온 사람을 좋아한다.'
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		chip: '#6a7a8a',
		en: ['A Silla man, tired of his king.', 'Convenient.', 'Sit.'],
		lines: ['신라 사람이, 제 임금이 지겹다.', '편리하군.', '앉으시오.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: [
			'They sent me.',
			'Forcibly. In exchange for a room with my wife in it.',
			'I did not come to sit.'
		],
		lines: ['보냈소.', '억지로. 아내가 들어 있는 방과 바꿔.', '앉으러 온 게 아니오.']
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['Then what did you come to do.'],
		lines: ['그럼 뭘 하러 왔소.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: [
			'Give me a fleet.',
			'A small army. Enough to knock on Surabol.',
			'I will take my family back.',
			'You can keep whatever is left of the hall.'
		],
		lines: [
			'함대를 주시오.',
			'작은 군사. 서라벌 문을 두드릴 만큼.',
			'가족을 되찾겠소.',
			'대청에 남는 건 가져가시오.'
		]
	},
	{
		kind: 'p',
		html: 'The Wa king’s mouth moves. Not a smile. The start of one. The hall feels it the way Jangsu’s hall felt it, and Jesang sits in the same place in his spine.',
		ko: '왜왕의 입이 움직인다. 웃음은 아니다. 그 시작. 장수의 대청이 느꼈던 방식으로 이 대청도 느낀다. 제상은 등뼈의 같은 자리에 앉아 있다.'
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['You talk well.', 'Katsuragi.', 'Take him.', 'If he is lying, bring me the lie.'],
		lines: ['말 잘하오.', '가쓰라기.', '데려가시오.', '거짓이면, 그 거짓을 가져오시오.']
	},
	{
		kind: 'card',
		person: 'katsuragi',
		caption: 'The Wa captain. Counts distances. Does not enjoy being used.',
		ko: '왜의 장수. 거리를 센다. 이용당하는 걸 좋아하지 않는다.'
	},
	{
		kind: 'dialogue',
		person: 'katsuragi',
		en: ['How many hulls.', 'How many men.'],
		lines: ['배가 몇.', '사람이 몇.']
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['Enough to knock.', 'Not enough to stay.', 'I am not collecting a second roof.'],
		lines: ['두드릴 만큼.', '머물 만큼은 말고.', '지붕을 하나 더 모을 생각은 없소.']
	},
	{
		kind: 'place',
		place: 'tsushima'
	},
	{
		kind: 'scene',
		label: 'Mountain Island',
		ko: '대마도'
	},
	{
		kind: 'map',
		year: 418,
		places: ['asuka', 'tsushima', 'surabol', 'chisullyeong'],
		routes: ['jesang418-wa-fleet', 'jesang418-extract'],
		caption: 'The fleet stops at Mountain Island. A Silla hull is already in the lee.',
		ko: '함대가 대마도에서 선다. 그늘에 신라 배가 이미 있다.'
	},
	{
		kind: 'p',
		html: 'The island is a mountain in the water. Wa hulls fill the open side. In the lee, under the cliff, a smaller ship sits with cream sails and a blue pennant, as if the rock had grown a Silla roof.',
		ko: '섬은 물 위의 산이다. 왜의 배가 열린 쪽을 채운다. 그늘, 벼랑 아래, 작은 배가 앉는다. 크림 돛, 푸른 기. 바위가 신라 지붕을 키운 것처럼.'
	},
	{
		kind: 'p',
		html: 'The younger prince is on the Wa deck, because a hostage who guides an attack is still a hostage, just closer to home.',
		ko: '어린 왕자가 왜의 갑판에 있다. 길을 안내하는 인질도 인질이다. 다만 집에 더 가까울 뿐.'
	},
	{
		kind: 'card',
		person: 'miseheun',
		caption: 'The Wa hostage. Wants to stay with the man who came for him.',
		ko: '왜의 인질. 데리러 온 사람 곁에 있고 싶어 한다.'
	},
	{
		kind: 'flashback',
		year: '418',
		title: 'the loud lie',
		blocks: [
			{
				kind: 'p',
				html: 'Before the north. An empty hall. One lamp. Two men who decided this as boys, and are deciding it again.',
				ko: '북으로 가기 전. 빈 대청. 등불 하나. 소년일 때 이걸 정한 두 사람이, 다시 정한다.'
			},
			{
				kind: 'dialogue',
				person: 'jesang',
				en: ['If I ask as your man they will not believe me.', 'A tired traitor they will believe.'],
				lines: ['네 사람으로 가면 안 믿어.', '지친 반역은 믿어.']
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['Then I name you something else.'],
				lines: ['그럼 다른 걸로 불러.']
			},
			{
				kind: 'dialogue',
				person: 'jesang',
				en: ['Traitor.', 'Put them in a room.', 'Make it loud.', 'The water has to hear it before I get there.'],
				lines: ['반역.', '방에 넣어.', '크게 해.', '내가 닿기 전에 물이 들어야 해.']
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['I will not like the loud.'],
				lines: ['큰 소리는 안 좋아.']
			},
			{
				kind: 'dialogue',
				person: 'jesang',
				en: ['You don’t have to like it.', 'You have to do it.'],
				lines: ['좋아할 필요 없어.', '해야지.']
			},
			{
				kind: 'p',
				html: 'Nulji looks at the lamp as if it might refuse. It does not.',
				ko: '눌지가 등불을 본다. 등불이 거절할지도 모른다는 듯이. 안 한다.'
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['And the island.'],
				lines: ['섬은.']
			},
			{
				kind: 'dialogue',
				person: 'jesang',
				en: [
					'A ship of ours in the lee.',
					'I put the boy on it.',
					'I stay.',
					'If I come back they know we lied.'
				],
				lines: ['그늘에 우리 배.', '애를 태워.', '나는 남아.', '내가 돌아오면, 거짓말인 줄 알아.']
			},
			{
				kind: 'dialogue',
				person: 'nulji',
				en: ['…You stay.'],
				lines: ['……남아.']
			},
			{
				kind: 'dialogue',
				person: 'jesang',
				en: ['You knew that when we were boys.'],
				lines: ['어릴 때부터 알았잖아.']
			}
		]
	},
	{
		kind: 'p',
		html: 'On the Wa deck the prince has not heard any of that. He has heard a fleet. He has heard Surabol. He wants to stay with the man who came for him.',
		ko: '왜의 갑판에서 왕자는 그 말을 하나도 못 들었다. 함대는 들었다. 서라벌은 들었다. 데리러 온 사람 곁에 있고 싶어 한다.'
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['We take their ships.', 'We go back with an army.', 'We end it.'],
		lines: ['저들 배를 빼앗아요.', '군사를 모아 돌아가.', '끝내요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['No.', 'You take that one.', 'The one in the lee.'],
		lines: ['안 되오.', '공은 저걸 타오.', '그늘에 있는 거.']
	},
	{
		kind: 'p',
		html: 'Miseheun looks. The cream sail. The blue pennant. A Silla roof under a Wa cliff.',
		ko: '미사흔이 본다. 크림 돛. 푸른 기. 왜의 벼랑 아래 신라 지붕.'
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['Then we both go.', 'We both go. Now.'],
		lines: ['그럼 같이요.', '같이 가요. 지금.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['If two leave, neither gets home.', 'You take the ship.'],
		lines: ['둘 다 빠지면 둘 다 못 가요.', '공은 배를.']
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['They’ll burn you—', 'They burn people.'],
		lines: ['저들이 당신을—', '태울 거예요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Then they burn me. Not you.', 'Give me the coat.'],
		lines: ['그러면 나를 태우오. 공은 안 되오.', '옷을 주시오.']
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['That coat is heavy.'],
		lines: ['그 옷은 무거워요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Then I will wear it.'],
		lines: ['그래서 제가 입소.']
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['No, Jesang! You cannot…', 'You must not…'],
		lines: ['안 돼요, 제상! 당신은……', '그래선 안 돼요……']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: [
			'Lord Miseheun…',
			'You are a man with a great fate…! I am just a servant.',
			'If I can place the three letters of my name onto the stories as your loyal servant, that will be enough for me.'
		],
		lines: [
			'미사흔공……',
			'공께서는 큰 운명을 지닌 분이시오……! 저는 그저 종일 뿐이오.',
			'공의 충직한 신하로서 제 이름 석 자를 이야기에 올릴 수 있다면, 그것으로 족하오.'
		]
	},
	{
		kind: 'p',
		html: 'Miseheun has been a hostage since he was small enough to lift. He has nothing to say to this. His eyes go first.',
		ko: '미사흔은 안아 올릴 때부터 인질이었다. 그런 그가 이 말 앞에서는 할 말이 없다. 눈이 먼저 무너진다.'
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['Then I’m not going.'],
		lines: ['그럼 안 가요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['You are.', 'We’ll meet again, up there. I won’t be late.'],
		lines: ['가오.', '위에서 다시 만납시다. 늦지 않으리다.']
	},
	{
		kind: 'p',
		html: 'Jesang puts him on the Silla ship himself. A hand on the rail. A hand on the boy’s back. The cream sail takes the wind as if it had been waiting for exactly this hour.',
		ko: '제상이 직접 신라 배에 태운다. 한 손은 난간. 한 손은 아이의 등. 크림 돛이 바람을 받는다. 딱 이 시각을 기다린 것처럼.'
	},
	{
		kind: 'dialogue',
		person: 'katsuragi',
		en: ['The lee was never empty.', 'You. Stay.'],
		lines: ['그늘이 빈 적이 없었군.', '당신. 서시오.']
	},
	{
		kind: 'p',
		html: 'Jesang does not run. Running would make it a chase, and he is already where he meant to be.',
		ko: '제상은 안 뛴다. 뛰면 추격이 되니까. 이미 있으려던 자리에 있다.'
	},
	{
		kind: 'scene',
		label: 'The Fire',
		ko: '불'
	},
	{
		kind: 'p',
		html: 'They take him back to the hall. Katsuragi brings the man, not the capital. Late is still too soon for him.',
		ko: '대청으로 다시 데려간다. 가쓰라기가 가져오는 건 사람이지, 도성이 아니다. 늦어도 그에게는 아직 이르다.'
	}
];

// —— Gwanggaeto: boot after the horsemen stay ——
const gIdx = gwang.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('don’t leave for fifty years')
);
if (gIdx < 0) throw new Error('gwanggaeto stay line missing');
const gFoot = [
	{
		kind: 'scene',
		label: 'The Boot',
		ko: '발'
	},
	{
		kind: 'p',
		html: 'The Silla king comes down from his own wall. He has already written the word. Now he has to wear it.',
		ko: '신라 임금이 제 성벽에서 내려온다. 글자는 이미 썼다. 이제 그걸 입어야 한다.'
	},
	{
		kind: 'p',
		html: 'He kneels in the packed earth of his own yard. The Great King does not get off the horse at first. Then he does. He puts his boot on the head.',
		ko: '제 마당 다진 흙에 무릎을 꿇는다. 태왕은 처음에 말에서 안 내린다. 그다음에 내린다. 그 머리에 발을 올린다.'
	},
	{
		kind: 'dialogue',
		speaker: 'The Silla King',
		gender: 'm',
		en: ['Great King.'],
		lines: ['태왕이시여.']
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['You wrote it.'],
		lines: ['네가 썼지.']
	},
	{
		kind: 'dialogue',
		speaker: 'The Silla King',
		gender: 'm',
		en: ['…I wrote it.'],
		lines: ['……내가 썼소.']
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['Then stay there.', 'Fifty thousand. You’ll remember the number.', 'You’ll remember this more.'],
		lines: ['그럼 그대로 있어.', '오만. 숫자는 기억할 거다.', '이건 더 기억할 거다.']
	},
	{
		kind: 'p',
		html: 'The yard is very quiet. A thin country learns, in the dirt, what asking costs.',
		ko: '마당이 아주 조용하다. 얇은 나라가, 흙 위에서, 청하는 값을 배운다.'
	}
];
if (!JSON.stringify(gwang.blocks).includes('He puts his boot on the head')) {
	gwang.blocks.splice(gIdx + 1, 0, ...gFoot);
}

// —— Jesang rebuild ——
const emptyHall = jesang.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Empty Hall');
if (emptyHall < 0) throw new Error('empty hall missing');
const water = jesang.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('They hit the water so hard')
);
if (water < 0) throw new Error('water crossing missing');
const fire = jesang.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Fire');
if (fire < 0) throw new Error('fire missing');
const sit = jesang.blocks.findIndex(
	(b, i) =>
		i > fire &&
		b.person === 'nintoku' &&
		Array.isArray(b.en) &&
		b.en.includes('Sit.')
);
if (sit < 0) throw new Error('chair offer missing');

const afterFire = jesang.blocks.slice(sit);
jesang.blocks = [
	...jesang.blocks.slice(0, emptyHall),
	...footFlashback,
	...jesang.blocks.slice(emptyHall + 1, water + 1),
	...returnAndWa,
	...afterFire
];

// Thin Hour map: tsushima, routes
const thinMap = jesang.blocks.find((b) => b.kind === 'map' && b.year === 418 && (b.places ?? []).includes('gungnae'));
if (thinMap) {
	thinMap.places = ['surabol', 'gungnae', 'pyongyang', 'tsushima', 'asuka'];
	thinMap.routes = ['jesang418-north', 'jesang418-home'];
	thinMap.caption = 'One man north for the older brother. The younger one is still on an island.';
	thinMap.ko = '형 데리러 북으로 가는 사람 하나. 아우는 아직 섬에 있다.';
}

// Place card before Northern Hall
const north = jesang.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Northern Hall');
if (north >= 0 && !jesang.blocks.slice(0, north).some((b) => b.kind === 'place' && b.place === 'pyongyang')) {
	jesang.blocks.splice(north, 0, { kind: 'place', place: 'pyongyang' });
}

// Name: Silla ship, not small boat
for (const b of jesang.blocks) {
	if (b.kind === 'p' && typeof b.html === 'string' && b.html.includes('Miseheun comes home on the small boat')) {
		b.html = 'Miseheun comes home on the Silla ship. Nulji marries him to Jesang’s second daughter. He names the dead man Deachan, which is a tall chair for a man who would not sit.';
		b.ko = '미사흔이 신라 배로 온다. 눌지가 그를 제상의 둘째 딸과 혼인시킨다. 죽은 사람을 대아찬이라 부른다. 앉지 않은 사람에게는 높은 자리다.';
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('jesang blocks', jesang.blocks.length);
console.log('gwanggaeto blocks', gwang.blocks.length);
