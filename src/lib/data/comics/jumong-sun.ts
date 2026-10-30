import type { ComicStory } from '$lib/comic';

/** Haemosu meets Yuhwa at the Amnok — sitcom chapter from the chronicle stills. */
export const JUMONG_SUN: ComicStory = {
	id: 'jumong-sun',
	title: { en: 'The Tale of Jumong', ko: '주몽' },
	episodeId: 'goguryeo-tang-war-haemosu',
	year: -59,
	logline: {
		en: 'A normal day. The sun god looks down. Divine HR gets involved.',
		ko: '여느 날. 태양신이 내려다본다. 하늘 인사팀이 움직인다.'
	},
	pages: [
		{
			id: 'cover',
			n: 1,
			kind: 'cover',
			logo: '주몽',
			title: { en: 'The Tale of Jumong', ko: '주몽' },
			ground: '#3a0610',
			kicker: { en: 'THE TALE OF JUMONG', ko: '주몽 이야기' },
			panels: []
		},
		{
			id: 'p2',
			n: 2,
			kind: 'chapter',
			logo: '주몽',
			kicker: { en: 'CHAPTER 1  THE SUN GOD', ko: '제1화  태양신' },
			title: { en: 'The sun god', ko: '태양신' },
			footer: { en: 'SWIPE →', ko: '넘기기 →' },
			panels: [
				{
					id: 'p2a',
					slot: 'jumong-haemosu-sky-dawn-tiny',
					cols: 12,
					rows: 2,
					captions: [
						{
							en: 'A normal day, like any other…',
							ko: '여느 날과 다를 바 없는 하루…',
							at: 'top',
							corner: 'tl'
						},
						{
							en: 'The sun god rides his chariot across the sky.',
							ko: '태양신이 전차를 타고 하늘을 건넌다.',
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
			title: { en: 'Faster', ko: '더 빨리' },
			panels: [
				{
					id: 'p3a',
					slot: 'jumong-haemosu-five-dragons',
					cols: 12,
					captions: [
						{
							en: 'Carried by his chariot of five dragons…',
							ko: '다섯 마리 용이 끄는 전차…',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p3b',
					slot: 'jumong-haemosu-sky-dawn-drive',
					cols: 12,
					card: {
						hangul: '해모수',
						roman: 'HAEMOSU',
						role: { en: 'GOD OF THE SUN', ko: '태양신' }
					},
					balloons: [
						{
							person: 'haemosu',
							en: 'HA! FASTER!!',
							ko: '하! 더 빨리!!',
							corner: 'tr',
							kind: 'shout'
						}
					],
					captions: [
						{
							en: 'His name is Haemosu.',
							ko: '그의 이름은 해모수.',
							at: 'bottom',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p4',
			n: 4,
			title: { en: 'The river', ko: '강' },
			panels: [
				{
					id: 'p4a',
					slot: 'jumong-wide',
					cols: 12,
					captions: [
						{
							en: 'The river Amnok',
							ko: '압록강',
							at: 'top',
							corner: 'tl'
						},
						{
							en: '59 BC',
							ko: '기원전 59년',
							at: 'top',
							corner: 'tr'
						}
					]
				},
				{
					id: 'p4b',
					slot: 'jumong-amnok-wc-habek-pavilion',
					cols: 12,
					balloons: [
						{
							person: 'habek',
							en: 'Wait… what is…',
							ko: '잠깐… 저게…',
							corner: 'tl'
						}
					]
				}
			]
		},
		{
			id: 'p5',
			n: 5,
			title: { en: 'A flood?', ko: '홍수?' },
			panels: [
				{
					id: 'p5a',
					slot: 'jumong-yuhwa-amnok-dusk-expo',
					cols: 12,
					balloons: [
						{
							person: 'habek',
							en: 'STOP!!',
							ko: '멈춰!!',
							corner: 'tl',
							kind: 'shout'
						}
					]
				},
				{
					id: 'p5b',
					slot: 'jumong-cine-habek-shout',
					cols: 12,
					balloons: [
						{
							speaker: 'A dragon',
							en: 'What is it, sire?',
							ko: '무슨 일이십니까?',
							corner: 'bl'
						},
						{
							speaker: 'A dragon',
							en: 'A flood?',
							ko: '홍수인가요?',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p6',
			n: 6,
			title: { en: 'Three sisters', ko: '세 자매' },
			panels: [
				{
					id: 'p6a',
					slot: 'jumong-yuhwa-sisters-bath',
					cols: 12,
					captions: [
						{
							en: 'Not a flood.',
							ko: '홍수는 아니었다.',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p6b',
					slot: 'jumong-yuhwa-look-up-wet',
					cols: 12,
					shape: 'circle',
					captions: [
						{
							en: 'The youngest looks up.',
							ko: '막내가 올려다본다.',
							at: 'bottom',
							corner: 'bc'
						}
					]
				}
			]
		},
		{
			id: 'p7',
			n: 7,
			title: { en: 'God business', ko: '신의 볼일' },
			panels: [
				{
					id: 'p7a',
					slot: 'jumong-haemosu-heart-rail-ecu',
					cols: 12,
					rows: 2,
					balloons: [
						{
							person: 'haemosu',
							en: 'I need to get down to the river…',
							ko: '강으로 내려가야 하는데…',
							corner: 'tl',
							kind: 'shout'
						},
						{
							person: 'haemosu',
							en: '…for… some god business reasons.',
							ko: '그… 신으로서 볼일이 있어서.',
							corner: 'bl'
						}
					]
				},
				{
					id: 'p7b',
					slot: 'jumong-haemosu-jolly-haewonmek',
					cols: 12,
					balloons: [
						{
							person: 'haewonmek',
							en: 'Ah…',
							ko: '아…',
							corner: 'bl'
						},
						{
							speaker: 'A dragon',
							en: 'We should’ve guessed.',
							ko: '그럴 줄 알았지.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p8',
			n: 8,
			title: { en: 'Extras', ko: '엑스트라' },
			panels: [
				{
					id: 'p8a',
					slot: 'jumong-haemosu-five-dragons',
					cols: 12,
					rows: 2,
					balloons: [
						{
							speaker: 'A dragon',
							en: 'Sigh… y’know, sometimes I wonder why we even try with him.',
							ko: '하아… 가끔은 왜 저 양반이랑 같이 다니나 싶어.',
							corner: 'tl'
						},
						{
							person: 'haemosu',
							en: 'You jealous?',
							ko: '질투야?',
							corner: 'tr'
						},
						{
							speaker: 'A dragon',
							en: 'We’re just extras, at the end of the day.',
							ko: '우린 어차피 엑스트라야.',
							corner: 'bl'
						},
						{
							speaker: 'Another dragon',
							en: 'At least we got speaking roles.',
							ko: '대사라도 있으니 다행이지.',
							corner: 'bc'
						},
						{
							person: 'haewonmek',
							en: 'Shhh… let him cook.',
							ko: '쉿… 저거 하게 둬.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p9',
			n: 9,
			title: { en: 'Hey there', ko: '안녕' },
			panels: [
				{
					id: 'p9a',
					slot: 'jumong-haemosu-first-step-water',
					cols: 12,
					captions: [
						{
							en: 'He gets down. For god business reasons.',
							ko: '내려온다. 신의 볼일 때문에.',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p9b',
					slot: 'jumong-amnok-wc-wades-close',
					cols: 12,
					balloons: [
						{
							person: 'haemosu',
							en: 'Hey there… I was just flying by, and couldn’t help noticing your eyes…',
							ko: '안녕… 지나가다 눈이 예뻐서.',
							corner: 'tl'
						},
						{
							person: 'haemosu',
							en: 'I’m the sun… maybe you’ve heard of me?',
							ko: '난 태양인데… 들어 봤어?',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p10',
			n: 10,
			title: { en: 'Yuhwa', ko: '유화' },
			panels: [
				{
					id: 'p10a',
					slot: 'jumong-amnok-wc-wades-close',
					cols: 12,
					rows: 2,
					shape: 'circle',
					balloons: [
						{
							person: 'yuhwa',
							en: 'You must be Haemosu…',
							ko: '해모수 맞지…',
							corner: 'tl'
						},
						{
							person: 'haemosu',
							en: 'You know me?',
							ko: '날 알아?',
							corner: 'tr'
						},
						{
							person: 'yuhwa',
							en: 'My daddy told me about you… he kinda owns this river, you see.',
							ko: '아빠가 얘기해 줬거든… 이 강, 원래 우리 아빠 거야.',
							corner: 'bl'
						},
						{
							person: 'haemosu',
							en: 'Ah! You’re a river nymph… that explains the beauty…',
							ko: '아! 강의 선녀구나… 그래서 예쁘지…',
							corner: 'bc'
						},
						{
							person: 'haemosu',
							en: 'What’s your name?',
							ko: '이름이 뭐야?',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p11',
			n: 11,
			title: { en: 'The sun', ko: '태양' },
			panels: [
				{
					id: 'p11a',
					slot: 'jumong-poster_yuhwa',
					cols: 5,
					rows: 2,
					card: {
						hangul: '유화',
						roman: 'YUHWA',
						role: { en: 'DAUGHTER OF THE RIVER', ko: '강의 딸' }
					},
					balloons: [
						{
							person: 'yuhwa',
							en: 'Yuhwa.',
							ko: '유화.',
							corner: 'bl'
						}
					]
				},
				{
					id: 'p11b',
					slot: 'jumong-yuhwa-haemosu-two-grin',
					cols: 7,
					balloons: [
						{
							person: 'haemosu',
							en: 'Yuhwa… what a beautiful name…',
							ko: '유화… 예쁜 이름이네…',
							corner: 'tl'
						},
						{
							person: 'haemosu',
							en: 'Don’t you know you’re not supposed to look directly at the sun?',
							ko: '태양을 똑바로 보면 안 되는 거 몰라?',
							corner: 'tr'
						},
						{
							person: 'yuhwa',
							en: 'Oh? And why is that?',
							ko: '왜?',
							corner: 'bl'
						},
						{
							person: 'haemosu',
							en: 'They say you’ll burn your eyes out… well, not that I’d know.',
							ko: '눈 버린다잖아… 뭐, 내가 알 바는 아니고.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p12',
			n: 12,
			title: { en: 'Interpret that', ko: '알아서 해석해' },
			panels: [
				{
					id: 'p12a',
					slot: 'jumong-yuhwa-haemosu-two-grin',
					cols: 12,
					balloons: [
						{
							person: 'yuhwa',
							en: 'The sun…?',
							ko: '태양…?',
							corner: 'tl'
						},
						{
							person: 'haemosu',
							en: 'Yeah. Y’know that big yellow thing in the sky? That’s me.',
							ko: '응. 하늘에 노란 거 크지? 나야.',
							corner: 'br'
						}
					]
				},
				{
					id: 'p12b',
					slot: 'jumong-amnok-wc-wades-close',
					cols: 12,
					balloons: [
						{
							person: 'yuhwa',
							en: 'Well, Haemosu… I’m looking at the sun with my eyes right now…',
							ko: '해모수… 지금 이 눈으로 태양을 보고 있는데…',
							corner: 'tl'
						},
						{
							person: 'yuhwa',
							en: '…and I’m not sure I wouldn’t mind that.',
							ko: '타도… 상관없을 것 같아.',
							corner: 'bl'
						},
						{
							person: 'haemosu',
							en: 'Can I interpret that as a yes?',
							ko: '그건 예스로 알아도 돼?',
							corner: 'tr'
						},
						{
							person: 'yuhwa',
							en: 'You can interpret it however you like.',
							ko: '알아서 해석해.',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p13',
			n: 13,
			title: { en: 'As it was always to be', ko: '원래 그렇게' },
			panels: [
				{
					id: 'p13a',
					slot: 'jumong-amnok-wc-wades-close',
					cols: 12,
					captions: [
						{
							en: 'And so…',
							ko: '그래서…',
							at: 'top',
							corner: 'tl'
						},
						{
							en: 'as it was always to be…',
							ko: '원래 그렇게 될 일이었다…',
							at: 'bottom',
							corner: 'br'
						}
					]
				},
				{
					id: 'p13b',
					slot: 'jumong-amnok-wc-flirt-makeout',
					cols: 12,
					captions: [
						{
							en: 'A love blossomed…',
							ko: '사랑이 피었다…',
							at: 'top',
							corner: 'tl'
						},
						{
							en: '…between the sun and the water.',
							ko: '…해와 물 사이에.',
							at: 'bottom',
							corner: 'br'
						}
					]
				}
			]
		},
		{
			id: 'p14',
			n: 14,
			title: { en: 'Someone you forgot', ko: '빠뜨린 사람' },
			panels: [
				{
					id: 'p14a',
					slot: 'jumong-amnok-wc-flirt-makeout',
					cols: 12,
					captions: [
						{
							en: 'However…',
							ko: '그런데…',
							at: 'top',
							corner: 'tc'
						},
						{
							en: '…isn’t there someone you forgot to ask?',
							ko: '…물어볼 사람, 빠뜨린 거 아니야?',
							at: 'bottom',
							corner: 'bc'
						}
					]
				},
				{
					id: 'p14b',
					slot: 'jumong-amnok-wc-habek-pavilion',
					cols: 6,
					captions: [
						{
							en: 'Sometime later…',
							ko: '얼마 후…',
							at: 'top',
							corner: 'tl'
						}
					]
				},
				{
					id: 'p14c',
					slot: 'jumong-cine-habek-shout',
					cols: 6,
					balloons: [
						{
							person: 'habek',
							en: 'HAEMOSU!! YOU BASTARD!!',
							ko: '해모수!! 이 자식아!!',
							corner: 'tr',
							kind: 'shout'
						}
					]
				}
			]
		},
		{
			id: 'p15',
			n: 15,
			title: { en: 'Divine HR', ko: '하늘 인사팀' },
			footer: { en: 'TO BE CONTINUED', ko: '다음 이야기에 계속' },
			panels: [
				{
					id: 'p15a',
					slot: 'jumong-cine-habek-shout',
					cols: 12,
					card: {
						hangul: '하백',
						roman: 'HABEK',
						role: { en: 'GOD OF THE RIVER AMNOK', ko: '압록강의 신' }
					},
					balloons: [
						{
							person: 'habek',
							en: 'You think you can mess with my daughter just like that??',
							ko: '내 딸을 그렇게 갖고 놀아도 되는 줄 알아??',
							corner: 'tr',
							kind: 'shout'
						},
						{
							person: 'habek',
							en: 'I’ll report you to divine HR, goddammit!',
							ko: '하늘 인사팀에 고발이다, 진짜!',
							corner: 'br',
							kind: 'shout'
						}
					]
				},
				{
					id: 'p15b',
					slot: 'jumong-haemosu-five-dragons',
					cols: 12,
					balloons: [
						{
							speaker: 'A dragon',
							en: 'Sire… I think someone’s talking about you.',
							ko: '주인님… 누가 얘기하는 것 같은데요.',
							corner: 'tl'
						},
						{
							person: 'haemosu',
							en: 'So? The chapter’s over already.',
							ko: '그래서? 챕터 끝났는데.',
							corner: 'br'
						}
					]
				}
			]
		}
	]
};
