/**
 * Reignmaker shelf. One row, five books — the five phases of Taejong's life:
 * 이방원 Yi Bang-Won → 유덕 Yudeok → 정안군 Prince → 주상 Majesty → 태상왕 Emeritus.
 * From the house in Hamhung to the tomb at Heonreung. Sejong is the son he
 * crowns. The story ends when Bang-won dies.
 */
import { buildStoryShelf, type StoryPartSrc } from './storyShelf';

const KNOWN = new Set([
	'Hamhung',
	'The Books',
	'The Examination',
	'Wihwa',
	'Nanjing',
	'The Horse',
	'Sonjuk Bridge',
	'Prince Jeongan',
	'The Envoy',
	'The First Night',
	'The Refusal',
	'The Second Night',
	'The Armies',
	'The Drum',
	'Her Brothers',
	'The Third Son',
	'The Father-in-law',
	'Wongyeong',
	'Heonreung'
]);

const PARTS_SRC: StoryPartSrc[] = [
	{
		id: 'bangwon',
		title: 'Yi Bang-Won',
		ko: '이방원',
		years: '1367–1422',
		arcs: [
			{
				id: 'son',
				title: 'The son',
				ko: '아들',
				volumes: [
					{
						id: 'rn-fifth',
						title: 'Yi Bang-Won',
						ko: '이방원',
						spine: '#6a3a2a',
						blurb: {
							en: 'A military house sends one boy to the books.',
							ko: '무인의 집이 아들 하나를 글로 보낸다.'
						},
						episodes: [
							{ title: 'Hamhung', ko: '함흥', year: '1367', hook: 'Born in Gwiju, the fifth son of Yi Seong-gye and Lady Han.' },
							{ title: 'The Books', ko: '글', year: '1377', hook: 'His father puts him under Won Cheon-seok. Gil Jae lives in the same village.' },
							{ title: 'The Examination', ko: '문과', year: '1383', hook: 'He passes the civil exam. No other son in the house can.' },
							{ title: 'Wihwa', ko: '위화도', year: '1388', hook: 'He is twenty-one. His father turns the army on the Yalu, and the son already knows.' }
						]
					},
					{
						id: 'rn-bridge',
						title: 'Yudeok',
						ko: '유덕',
						spine: '#3d4f3a',
						blurb: {
							en: 'He saves his father, and then he kills the man his father would not.',
							ko: '아버지를 살리고, 아버지가 죽이지 못한 사람을 죽인다.'
						},
						episodes: [
							{ title: 'Nanjing', ko: '남경', year: '1388', hook: 'Secretary to Yi Saek. He goes to ask Ming to keep the Goryeo throne, and he sees a court that works.' },
							{ title: 'The Horse', ko: '낙마', year: '1392', hook: 'Hunting at Haeju, his father falls. Jeong Mong-ju moves while the general cannot stand.' },
							{ title: 'Sonjuk Bridge', ko: '선죽교', year: '1392', hook: 'He sends Jo Yeong-gyu. The poem is finished. The head is on the bridge.' },
							{ title: 'Prince Jeongan', ko: '정안군', year: '1392', hook: 'He puts his father on the throne and is left off the merit list. The heir is Bang-seok, a child.' }
						]
					},
					{
						id: 'rn-nights',
						title: 'Prince',
						ko: '정안군',
						spine: '#8f2d2d',
						blurb: {
							en: 'He takes the power twice, and refuses the crown the first time.',
							ko: '권력을 두 번 가져가고, 왕관은 한 번 거절한다.'
						},
						episodes: [
							{ title: 'The Envoy', ko: '사신', year: '1394', hook: 'Hongwu wants a prince. He goes, settles the quarrel, and comes home still not the heir.' },
							{ title: 'The First Night', ko: '무인', year: '1398', hook: 'Jeong Do-jeon is about to take the princes’ armies. Wongyeong hides the weapons. By morning Jeong Do-jeon and Bang-seok are dead.' },
							{ title: 'The Refusal', ko: '사양', year: '1398', hook: 'He will not take the crown he just cleared. His older brother Bang-gwa becomes Jeongjong.' },
							{ title: 'The Second Night', ko: '박포', year: '1400', hook: 'Bang-gan and Bak Po come for him. He wins, is named heir, and in the eleventh month Jeongjong steps down.' }
						]
					}
				]
			},
			{
				id: 'king',
				title: 'The king',
				ko: '임금',
				volumes: [
					{
						id: 'rn-king',
						title: 'Majesty',
						ko: '주상',
						spine: '#c4a35a',
						blurb: {
							en: 'The first Joseon king Ming actually invests.',
							ko: '명이 실제로 책봉한 첫 조선 임금.'
						},
						episodes: [
							{ title: 'The Armies', ko: '사병', year: '1400', hook: 'The private troops that made him are abolished. One army, under the throne.' },
							{ title: 'The Drum', ko: '신문고', year: '1401', hook: 'A drum any subject may strike. The same year Ming sends the seal.' },
							{ title: 'Her Brothers', ko: '민씨', year: '1406', hook: 'Wongyeong armed the house in 1398. He cuts her brothers down so her clan cannot be a second court.' },
							{ title: 'The Third Son', ko: '충녕', year: '1418', hook: 'Yangnyeong is set aside. He names Chungnyeong, abdicates, and keeps the army.' }
						]
					},
					{
						id: 'rn-sangwang',
						title: 'Emeritus',
						ko: '태상왕',
						spine: '#1c1a17',
						blurb: {
							en: 'He rules through his son, and then he stops.',
							ko: '아들을 통해 다스리다가, 손을 놓는다.'
						},
						episodes: [
							{ title: 'The Father-in-law', ko: '심온', year: '1418', hook: 'Officials who fought the choice, and Sejong’s father-in-law, do not survive the year.' },
							{ title: 'Wongyeong', ko: '원경', year: '1420', hook: 'The queen who hid the weapons dies. He has the reign. He does not have her.' },
							{ title: 'Heonreung', ko: '헌릉', year: '1422', hook: 'The last year he loosens his grip. He dies on the thirtieth of May and is buried with her.' }
						]
					}
				]
			}
		]
	}
];

export const { parts: REIGNMAKER_PARTS, volumes: REIGNMAKER_VOLUMES, rows: REIGNMAKER_ROWS } = buildStoryShelf({
	shelf: 'reignmaker',
	story: '/stories/reignmaker',
	known: KNOWN,
	parts: PARTS_SRC
});
