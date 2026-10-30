import type { ComicStory } from '$lib/comic';

/** Class 59 deer hunt — opens in the yard, adult marshal Alchun only. */
export const CHUNCHU_DEER: ComicStory = {
	id: 'chunchu-deer',
	title: { en: 'The Deer', ko: '사슴' },
	episodeId: 'five-principles-munhee',
	year: 618,
	logline: {
		en: 'A boy walks into the Hwarang yard. The marshal takes the ghost.',
		ko: '아이가 화랑 연무장으로 들어온다. 원수가 귀신을 데려간다.'
	},
	pages: [
		{
			id: 'cover',
			n: 1,
			kind: 'cover',
			logo: '사슴',
			title: { en: 'The Deer', ko: '사슴' },
			ground: '#3a0620',
			kicker: { en: 'THE TALE OF CHUNCHU', ko: '춘추 이야기' },
			panels: []
		},
		{
			id: 'p2',
			n: 2,
			kind: 'chapter',
			logo: '사슴',
			kicker: { en: 'CHAPTER 1  THE YARD', ko: '제1화  연무장' },
			title: { en: 'The yard', ko: '연무장' },
			footer: { en: 'SWIPE →', ko: '넘기기 →' },
			panels: [
				{
					id: 'p2a',
					slot: 'hunt-moon-palace',
					cols: 12,
					rows: 2,
					captions: [
						{
							en: 'A normal morning in Surabol…',
							ko: '서라벌의, 여느 아침…',
							at: 'top',
							corner: 'tl'
						},
						{
							en: 'A boy walks into the Hwarang yard.',
							ko: '아이가 화랑 연무장으로 들어온다.',
							at: 'bottom',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p3',
			n: 3,
			title: { en: 'First day', ko: '첫날' },
			panels: [
				{
					id: 'p3a',
					slot: 'hunt-yard-aerial',
					cols: 12,
					captions: [
						{
							en: 'The yard is bigger than he thought.',
							ko: '연무장이, 생각보다 크다.',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p3b',
					slot: 'hunt-chunchu-left',
					cols: 12,
					card: {
						hangul: '춘추',
						roman: 'CHUNCHU',
						role: { en: 'THE GHOST BOY', ko: '귀신 자식' }
					},
					balloons: [
						{
							person: 'chunchu',
							en: 'First day. What could go wrong.',
							ko: '첫날인데. 뭐가 문제겠어.',
							corner: 'tr'
						}
					]
				}
			]
		},
		{
			id: 'p4',
			n: 4,
			title: { en: 'The ghost', ko: '귀신' },
			panels: [
				{
					id: 'p4a',
					slot: 'hunt-empty-ring',
					cols: 12,
					captions: [
						{
							en: 'The space around him stays a space.',
							ko: '그 아이 주위만 빈다.',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p4b',
					slot: 'hunt-heum-ghost',
					cols: 12,
					balloons: [
						{
							speaker: 'Heum',
							en: 'Who’s taking the ghost?',
							ko: '귀신 누가 데려가?',
							corner: 'tl',
							kind: 'shout'
						},
						{
							speaker: 'Heum',
							en: 'He’ll talk it to death.',
							ko: '말로 죽여 버리겠지.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p5',
			n: 5,
			title: { en: 'I am', ko: '내가 간다' },
			panels: [
				{
					id: 'p5a',
					slot: 'hunt-marshal-volunteers',
					cols: 12,
					rows: 2,
					card: {
						hangul: '알천',
						roman: 'ALCHUN',
						role: { en: 'MARSHAL OF THE YARD', ko: '연무장의 원수' }
					},
					balloons: [
						{
							person: 'alchun',
							look: 'councillor',
							en: 'I am.',
							ko: '내가 간다.',
							corner: 'tr'
						},
						{
							person: 'alchun',
							look: 'councillor',
							en: 'You lot, move.',
							ko: '너희는 가라.',
							corner: 'br'
						}
					]
				},
				{
					id: 'p5b',
					slot: 'council-alchun-tiger',
					cols: 5,
					captions: [
						{
							en: 'The tiger-catcher. Grown. Still here.',
							ko: '호랑이 잡은 사람. 다 컸다. 아직 있다.',
							at: 'bottom',
							corner: 'bl'
						}
					]
				},
				{
					id: 'p5c',
					slot: 'hunt-heum-ghost',
					cols: 7,
					balloons: [
						{
							speaker: 'Heum',
							en: 'The marshal? For him??',
							ko: '원수가? 저거 때문에??',
							corner: 'tr',
							kind: 'shout'
						}
					]
				}
			]
		},
		{
			id: 'p6',
			n: 6,
			title: { en: 'The pines', ko: '소나무' },
			panels: [
				{
					id: 'p6a',
					slot: 'hunt-forest-overhead',
					cols: 12,
					captions: [
						{
							en: 'They leave by the north gate.',
							ko: '북문으로 나간다.',
							at: 'top',
							corner: 'tl'
						},
						{
							en: 'Pines. Afternoon. A path deer use, if you believe the droppings.',
							ko: '소나무. 오후. 배설물을 믿자면 사슴이 다니는 길.',
							at: 'bottom',
							corner: 'br'
						}
					]
				},
				{
					id: 'p6b',
					slot: 'hunt-chunchu-plan',
					cols: 12,
					balloons: [
						{
							person: 'alchun',
							look: 'councillor',
							en: 'You going to talk to it, or chase it.',
							ko: '말 걸 거냐, 쫓을 거냐.',
							corner: 'tl'
						},
						{
							person: 'chunchu',
							en: 'If I chase it I lose it.',
							ko: '쫓으면 잃습니다.',
							corner: 'tr'
						},
						{
							person: 'chunchu',
							en: 'I have an idea. It’s a bit— ugly.',
							ko: '생각이 있습니다. 좀— 지저분합니다.',
							corner: 'bl'
						},
						{
							person: 'alchun',
							look: 'councillor',
							en: 'Ugly I can live with. Stupid I send home.',
							ko: '지저분한 건 참는다. 바보 같은 건 보낸다.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p7',
			n: 7,
			title: { en: 'The doe', ko: '나무 암사슴' },
			panels: [
				{
					id: 'p7a',
					slot: 'hunt-wooden-doe',
					cols: 12,
					balloons: [
						{
							person: 'alchun',
							look: 'councillor',
							en: 'That’s not a deer.',
							ko: '그건 사슴이 아니다.',
							corner: 'tr'
						},
						{
							person: 'chunchu',
							en: 'They look at the ears first. I checked.',
							ko: '귀부터 보더라고요. 확인해 봤습니다.',
							corner: 'bl'
						}
					]
				},
				{
					id: 'p7b',
					slot: 'hunt-leaf-sleep',
					cols: 12,
					balloons: [
						{
							person: 'alchun',
							look: 'councillor',
							en: 'And that.',
							ko: '그건.',
							corner: 'tl'
						},
						{
							person: 'chunchu',
							en: 'These put a horse to sleep. A deer is smaller.',
							ko: '말 재우는 잎입니다. 사슴은 더 작고요.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p8',
			n: 8,
			title: { en: 'Until it comes', ko: '올 때까지' },
			panels: [
				{
					id: 'p8a',
					slot: 'hunt-chunchu-plan',
					cols: 12,
					balloons: [
						{
							person: 'alchun',
							look: 'councillor',
							en: 'How long.',
							ko: '얼마나.',
							corner: 'tl'
						},
						{
							person: 'chunchu',
							en: 'Until it comes.',
							ko: '올 때까지요.',
							corner: 'tr'
						}
					]
				},
				{
					id: 'p8b',
					slot: 'hunt-deer-comes',
					cols: 12,
					captions: [
						{
							en: 'The deer that comes is huge. It folds anyway.',
							ko: '오는 사슴이 크다. 그래도 접힌다.',
							at: 'bottom',
							corner: 'bc'
						}
					]
				}
			]
		},
		{
			id: 'p9',
			n: 9,
			title: { en: 'Just the hat', ko: '모자만' },
			panels: [
				{
					id: 'p9a',
					slot: 'hunt-knife',
					cols: 5,
					rows: 2,
					captions: [
						{
							en: 'The knife is in his hand before he has decided.',
							ko: '결정하기도 전에 칼이 손에 있다.',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p9b',
					slot: 'hunt-antlers',
					cols: 7,
					rows: 2,
					balloons: [
						{
							person: 'chunchu',
							en: 'Easy. Just the hat. You can keep the rest.',
							ko: '편히. 모자만이야. 나머지는 네 거야.',
							corner: 'tl',
							kind: 'whisper'
						},
						{
							person: 'alchun',
							look: 'councillor',
							en: 'You’re talking to it.',
							ko: '말 거네.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p10',
			n: 10,
			title: { en: 'Last through the gate', ko: '문으로 마지막' },
			footer: { en: 'TO BE CONTINUED', ko: '다음 이야기에 계속' },
			panels: [
				{
					id: 'p10a',
					slot: 'hunt-deer-gate',
					cols: 12,
					captions: [
						{
							en: 'Last through the trees: a magenta sleeve, and a deer still walking.',
							ko: '나무 사이로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴.',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p10b',
					slot: 'hunt-yushin-pear',
					cols: 5,
					balloons: [
						{
							person: 'yushin',
							en: 'The game said bring a deer. It did not say kill one.',
							ko: '놀이가 사슴을 내라 했지. 죽이라 하진 않았네.',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p10c',
					slot: 'hunt-yushin-name',
					cols: 7,
					balloons: [
						{
							person: 'yushin',
							en: 'Name.',
							ko: '이름.',
							corner: 'tl'
						},
						{
							person: 'chunchu',
							en: 'Kim Chunchu, sir.',
							ko: '김춘추입니다.',
							corner: 'bl'
						},
						{
							person: 'yushin',
							en: 'The deer is still walking. Don’t lose that.',
							ko: '사슴이 아직 걷고 있네. 그걸 잃지 말게.',
							corner: 'br'
						}
					]
				}
			]
		}
	]
};
