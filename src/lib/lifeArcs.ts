/**
 * Inner journeys for major characters.
 * Each beat is a short title + one sentence; a canon event (and episode)
 * moves them to the next beat. Applied in `withProfileMeta`.
 */

export type LifeArcStep = {
	/** Role-name, Title Case: "Responsible Father". */
	title: string;
	titleKo: string;
	/** One sentence under the title. */
	summary: string;
	summaryKo: string;
	/** Canon event that moves them to the next beat. */
	turn?: string;
	turnKo?: string;
	/** `story.json` entry title where that turn happens. */
	episode?: string;
	/** Optional chronicle slot id; otherwise the first still of that episode. */
	still?: string;
};

export type LifeArcDef = {
	blurb: string;
	blurbKo: string;
	steps: LifeArcStep[];
};

function arc(blurb: string, blurbKo: string, steps: LifeArcStep[]): LifeArcDef {
	return { blurb, blurbKo, steps };
}

function s(step: LifeArcStep): LifeArcStep {
	return step;
}

export function formatLifeArc(def: LifeArcDef): string {
	const chain = def.steps
		.map((step, i) => {
			const next = def.steps[i + 1];
			if (!next || !step.turn) return step.title;
			const where = step.episode ? ` · ${step.episode}` : '';
			return `${step.title} → (${step.turn}${where})`;
		})
		.join(' → ');
	return def.blurb ? `${def.blurb} ${chain}` : chain;
}

export const LIFE_ARCS: Record<string, LifeArcDef> = {
	muryuk: arc('He dies so his sons can be from here.', '아들들이 여기 사람이 되도록, 그가 먼저 죽는다.', [
		s({
			title: 'Hopeful Prince',
			titleKo: '희망의 왕자',
			summary: 'A Gaya boy who still believes the crown will hold.',
			summaryKo: '금관가야의 왕자가 아직 왕관이 버틸 거라 믿는다.',
			turn: 'Surrender of Golden Gaya',
			turnKo: '금관가야의 항복',
			episode: 'Muryuk'
		}),
		s({
			title: 'Assimilated General',
			titleKo: '동화된 장군',
			summary: 'Disillusioned, unemotional. He climbs someone else’s ladder.',
			summaryKo: '환멸한 채, 감정 없이, 남의 사다리를 오른다.',
			turn: 'Meeting Sadaham',
			turnKo: '사다함과의 만남',
			episode: 'Muryuk'
		}),
		s({
			title: 'Renewed Father',
			titleKo: '다시 선 아버지',
			summary: 'Hope returns. He marries. He wants a son from here.',
			summaryKo: '희망이 돌아온다. 결혼한다. 여기 사람을 아들로 낳고 싶어 한다.'
		})
	]),

	seohyeon: arc('Second generation: he does the living.', '이세. 살아내는 일은 그가 한다.', [
		s({
			title: 'Rebellious Son',
			titleKo: '반항하는 아들',
			summary: 'Bullied second generation. He will not sit quietly.',
			summaryKo: '왕따 당하는 이세. 가만히 앉아 있지 않는다.',
			turn: 'Romance with Manmyung',
			turnKo: '만명과의 연애',
			episode: 'Seohyun'
		}),
		s({
			title: 'Responsible Father',
			titleKo: '책임지는 아버지',
			summary: 'He learns the caste from the inside and grows into a partner.',
			summaryKo: '차별을 몸소 배우고, 반려이자 젊은 아버지가 된다.',
			turn: 'Chunchu–Munhee Wedding',
			turnKo: '춘추와 문희의 혼례',
			episode: 'Munhee'
		}),
		s({
			title: 'Relieved Veteran',
			titleKo: '한숨 돌린 노장',
			summary: 'The bloodline is finally from here.',
			summaryKo: '핏줄이 마침내 여기 사람이 된다.',
			turn: 'Siege of Daeya',
			turnKo: '대야성 함락',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Grieving Advisor',
			titleKo: '상중한 원로',
			summary: 'Grandfather of a dead girl. The house still asks him.',
			summaryKo: '죽은 손녀의 할아버지. 집은 여전히 그를 찾는다.'
		})
	]),

	yushin: arc('The grandson the line was for, still asking to be let in.', '그 핏줄을 위해 태어난 손자. 아직도 들여보내 달라 한다.', [
		s({
			title: 'Asking Grandson',
			titleKo: '들여보내 달라는 손자',
			summary: 'A Gaya grandson who still has to ask.',
			summaryKo: '가야의 손자가 아직도 허락을 구해야 한다.',
			turn: 'Class 51 Gate',
			turnKo: '오십일기의 문',
			episode: 'Seohyun'
		}),
		s({
			title: 'Dutiful Hwarang',
			titleKo: '성실한 화랑',
			summary: 'Even score with Bidam. He does the yard.',
			summaryKo: '비담과 동점. 마당의 일을 한다.',
			turn: 'Nangbi, Three Times',
			turnKo: '낭비, 세 번',
			episode: 'Nangbi'
		}),
		s({
			title: 'Sword of Silla',
			titleKo: '신라의 칼',
			summary: 'The name other rooms are already using.',
			summaryKo: '다른 방들이 이미 부르는 이름.',
			turn: 'The Forty and the Bucket',
			turnKo: '마흔과 들통',
			episode: 'Yushin'
		}),
		s({
			title: 'Fetching Marshal',
			titleKo: '수단을 가져오는 대장군',
			summary: 'He fetches the means. Radiance. Hangyul. The purge.',
			summaryKo: '수단을 가져온다. 명활성. 한결. 숙청.',
			turn: 'Radiance; the Purge',
			turnKo: '명활, 숙청',
			episode: 'Jeon (轉)'
		}),
		s({
			title: 'More Silla than Silla',
			titleKo: '신라보다 더한 신라',
			summary: 'Yellow Mountain. First chair. He wanted in.',
			summaryKo: '황산. 첫 자리. 들여보내 달라는 마음이 끝까지 남는다.',
			turn: 'Yellow Mountain, First Chair',
			turnKo: '황산, 첫 자리',
			episode: 'Yellow Mountain'
		}),
		s({
			title: 'Dying Marshal',
			titleKo: '죽어가는 대장군',
			summary: 'He wanted in. That is the last thing he wants.',
			summaryKo: '들여보내 달라는 마음. 그게 마지막이다.'
		})
	]),

	manmyung: arc('She crawls out in good silk.', '좋은 비단을 입고 기어 나온다.', [
		s({
			title: 'Royal Girl',
			titleKo: '왕실의 소녀',
			summary: 'She looks once. The horse keeps getting lost.',
			summaryKo: '한 번 본다. 말은 자꾸 길을 잃는다.',
			turn: 'The Horse that Keeps Getting Lost',
			turnKo: '길을 잃는 말',
			episode: 'Seohyun'
		}),
		s({
			title: 'Locked Daughter',
			titleKo: '잠긴 딸',
			summary: 'The door is for her own good. She does not agree.',
			summaryKo: '문은 그녀를 위해서라 한다. 그녀는 동의하지 않는다.',
			turn: 'Lightning Takes the Door',
			turnKo: '번개가 문을 가져간다',
			episode: 'Seohyun'
		}),
		s({
			title: 'Ruined Silk',
			titleKo: '망친 비단',
			summary: 'Wife who crawled out. Mother of the marshal.',
			summaryKo: '기어 나온 아내. 대장군의 어머니.',
			turn: 'Yushin Born at Manno',
			turnKo: '만노에서 유신이 태어나다',
			episode: 'Seohyun'
		}),
		s({
			title: 'Marshal’s Mother',
			titleKo: '대장군의 어머니',
			summary: 'The silk stayed ruined. The son did not.',
			summaryKo: '비단은 망친 채로 남았다. 아들은 아니다.'
		})
	]),

	yongsu: arc('A useful story for the street. A harder one for the house.', '거리엔 쓸모 있는 이야기. 집엔 더 어려운 이야기.', [
		s({
			title: 'Innocent Boy',
			titleKo: '순수한 아이',
			summary: 'Raised by a single mother who sold charcoal.',
			summaryKo: '숯을 팔던 홀어머니의 아들.',
			turn: 'Summons by Jinpyung',
			turnKo: '진평의 부름',
			episode: 'Bihyung'
		}),
		s({
			title: 'Palace Outsider',
			titleKo: '월성의 이방인',
			summary: 'Overwhelmed in the Moon Palace. Loyal. Competent.',
			summaryKo: '월성에서 압도된다. 충실하고, 유능하다.',
			turn: 'Ghost Children',
			turnKo: '귀동이들',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Dual Operative',
			titleKo: '이중 첩자',
			summary: 'Clerk by day. Something else by night.',
			summaryKo: '낮엔 서기. 밤엔 다른 사람.',
			turn: 'Death of Gildal',
			turnKo: '길달의 죽음',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Resigned Official',
			titleKo: '체념한 관리',
			summary: 'Quiet. Still acts the madman when it helps.',
			summaryKo: '조용하다. 필요할 땐 미친 척을 한다.',
			turn: 'Summons by Sunduk',
			turnKo: '선덕의 부름',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Rehabilitated Elder',
			titleKo: '복권된 원로',
			summary: 'Grateful. The name comes back.',
			summaryKo: '고맙다. 이름이 돌아온다.',
			turn: 'Cliff Conversation',
			turnKo: '절벽에서의 대화',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Man at Peace',
			titleKo: '편한 사람',
			summary: 'Nothing left to hide.',
			summaryKo: '숨길 것이 없다.'
		})
	]),

	chunchu: arc('Wit becomes patience. Then he takes the chair.', '재치가 인내가 된다. 그 다음엔 자리를 차지한다.', [
		s({
			title: 'Idealistic Youth',
			titleKo: '이상적인 청년',
			summary: 'He still believes rooms can be talked into kindness.',
			summaryKo: '말로 방을 착하게 만들 수 있다고 아직 믿는다.',
			turn: 'The Hwarang',
			turnKo: '화랑 입문',
			episode: 'Munhee'
		}),
		s({
			title: 'Calculating Climber',
			titleKo: '계산하는 출세가',
			summary: 'Smart, cynical, charismatic. He collects rooms.',
			summaryKo: '영리하고, 냉소적이고, 카리스마 있다. 방을 모은다.',
			turn: 'Romance with Munhee',
			turnKo: '문희와의 연애',
			episode: 'Munhee'
		}),
		s({
			title: 'Supportive Father',
			titleKo: '받쳐 주는 아버지',
			summary: 'Apolitical on purpose. The children are the work.',
			summaryKo: '일부러 정치를 안 한다. 자식이 일이다.',
			turn: 'Siege of Daeya',
			turnKo: '대야성 함락',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Political Mastermind',
			titleKo: '정치의 주인',
			summary: 'Hyper-ambitious. Intelligent. He will take the chair.',
			summaryKo: '야심이 커진다. 영리하다. 자리를 차지한다.'
		})
	]),

	munhee: arc('She packs the bags for every country he tries to save them with.', '그가 나라를 바꾸려 할 때마다, 보따리는 그녀가 싼다.', [
		s({
			title: 'Teasing Sister',
			titleKo: '놀리는 동생',
			summary: 'Younger sister. The dream-coat is a joke until it is not.',
			summaryKo: '동생. 꿈의 도포는 농담이다가, 농담이 아니게 된다.',
			turn: 'The Dream-Coat',
			turnKo: '꿈의 도포',
			episode: 'Munhee'
		}),
		s({
			title: 'Household Politician',
			titleKo: '집안의 정치가',
			summary: 'Hungry wife. She runs the rooms he will not.',
			summaryKo: '배고픈 아내. 그가 안 하는 방을 그녀가 돌린다.',
			turn: 'Siege of Daeya',
			turnKo: '대야성 함락',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Grieving Mother',
			titleKo: '상중한 어머니',
			summary: 'She keeps packing after the girl does not come home.',
			summaryKo: '딸이 안 돌아온 뒤에도 보따리를 싼다.',
			turn: "Chunchu's Deathbed",
			turnKo: '춘추의 임종',
			episode: 'Kim Chunchu†'
		}),
		s({
			title: 'Paying Queen',
			titleKo: '값을 치르는 왕비',
			summary: 'She pays the rest.',
			summaryKo: '남은 값을 그녀가 치른다.'
		})
	]),

	chunmyung: arc(
		'She found him odd. Then she kept his secret until the last look.',
		'처음엔 별난 남자였다. 마지막 눈빛까지 그 비밀을 지켰다.',
		[
			s({
				title: 'Odd Princess',
				titleKo: '별난 공주',
				summary: 'She finds the palace madman the most annoying man in Silla.',
				summaryKo: '궁의 미친 남자가 신라에서 제일 거슬린다.',
				turn: 'Ghost Children',
				turnKo: '귀동이들을 보다',
				episode: 'Kim Yongsu'
			}),
			s({
				title: 'Horrified Witness',
				titleKo: '겁에 질린 증인',
				summary: 'The culvert is real. She runs to tell — then she goes back down.',
				summaryKo: '하수구가 진짜다. 고하러 뛰다가, 다시 내려간다.',
				turn: 'Won Over by His Heart',
				turnKo: '용기와 마음에 넘어가다',
				episode: 'Kim Yongsu'
			}),
			s({
				title: 'Secret-Keeper',
				titleKo: '비밀을 지키는 아내',
				summary: 'His bravery and heart convert the horror. She will not tell.',
				summaryKo: '용기와 마음에 넘어간다. 고하지 않는다.',
				turn: 'Sunduk’s Decree',
				turnKo: '선덕의 어명',
				episode: 'Kim Yongsu'
			}),
			s({
				title: 'Loving Accomplice',
				titleKo: '사랑하는 공범',
				summary: 'A couple until the last look. She tells her son to stop counting.',
				summaryKo: '마지막 눈빛까지 부부다. 아들에게 그만 세라고 한다.',
				turn: 'The Night Daeya Falls',
				turnKo: '대야가 떨어지던 밤',
				episode: 'Siege of Daeya'
			}),
			s({
				title: 'Still Looking',
				titleKo: '아직 보는 사람',
				summary: 'They die looking at each other.',
				summaryKo: '서로를 보며 죽는다.'
			})
		]
	),

	dohwa: arc('A woman has one husband.', '여인에게 남편은 하나다.', [
		s({
			title: 'Woman in an Apron',
			titleKo: '앞치마의 여인',
			summary: 'A commoner who says no.',
			summaryKo: '아니라고 하는 평민.',
			turn: 'Jinji Does Not Let Her Go',
			turnKo: '진지왕이 놓아주지 않다',
			episode: 'Bihyung'
		}),
		s({
			title: 'Charcoal Mother',
			titleKo: '숯을 파는 어머니',
			summary: 'She sells charcoal. She tells the boy to be strange.',
			summaryKo: '숯을 판다. 아들에게 별나라고 한다.',
			turn: 'Be Strange',
			turnKo: '별나거라',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Dying Mother',
			titleKo: '죽어가는 어머니',
			summary: 'She saves the boy by making him strange.',
			summaryKo: '별나게 만들어 아들을 살린다.'
		})
	]),

	gildal: arc('I have never once been late.', '한 번도 늦은 적이 없다.', [
		s({
			title: 'Orphan in a Mask',
			titleKo: '가면을 쓴 고아',
			summary: 'He calls Yongsu Majesty.',
			summaryKo: '용수를 폐하라고 부른다.',
			turn: 'Calls Yongsu Majesty',
			turnKo: '용수를 폐하라 부르다',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Bridge Builder',
			titleKo: '다리를 놓는 사람',
			summary: 'He will not take coin.',
			summaryKo: '돈을 받지 않는다.',
			turn: 'Comes to Court as a Man',
			turnKo: '사람으로 조정에 오다',
			episode: 'Bihyung'
		}),
		s({
			title: 'Clerk on His Gate',
			titleKo: '제 문에서 자는 서기',
			summary: 'He sleeps on his own gate.',
			summaryKo: '제 문에서 잔다.',
			turn: 'He Sets the Knife',
			turnKo: '칼을 놓다',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'The Fox the Song Keeps',
			titleKo: '노래가 남긴 여우',
			summary: 'The song is allowed to keep him.',
			summaryKo: '노래가 그를 가져도 된다.'
		})
	]),

	jinji: arc('The Cloud King the room will not keep.', '방이 지키지 않는 구름임금.', [
		s({
			title: 'Dancing Second Son',
			titleKo: '춤추는 둘째',
			summary: 'He dances badly in a boat.',
			summaryKo: '배 위에서 춤을 못 춘다.',
			turn: 'The Council Takes the Crown',
			turnKo: '화백이 왕관을 가져가다',
			episode: 'Bihyung'
		}),
		s({
			title: 'Useful Ghost',
			titleKo: '쓸모 있는 귀신',
			summary: 'Deposed. Useful as a story.',
			summaryKo: '폐위. 이야기로는 쓸모가 있다.',
			turn: 'Dohwa’s Hut',
			turnKo: '도화의 오두막',
			episode: 'Bihyung'
		}),
		s({
			title: 'Unnameable Father',
			titleKo: '이름 못 하는 아버지',
			summary: 'The city may name him. The house may not.',
			summaryKo: '도시는 불러도 된다. 집은 안 된다.'
		})
	]),

	jinpyung: arc('A boy is easier to steer. A clerk is enough.', '아이는 다루기 쉽다. 서기면 충분하다.', [
		s({
			title: 'Boy on a Throne',
			titleKo: '왕좌의 아이',
			summary: 'Crowned at eleven because a boy is easier.',
			summaryKo: '열하나에 즉위한다. 아이가 다루기 쉬워서.',
			turn: 'Crowned at Eleven',
			turnKo: '열하나의 즉위',
			episode: 'Bihyung'
		}),
		s({
			title: 'Ledger-Keeper',
			titleKo: '장부를 지키는 왕',
			summary: 'He finds his cousin and puts him in the palace.',
			summaryKo: '사촌을 찾아 궁에 들인다.',
			turn: 'Bihyung into the Palace',
			turnKo: '비형을 궁에 들이다',
			episode: 'Bihyung'
		}),
		s({
			title: 'Quiet Rehabilitator',
			titleKo: '조용히 복권하는 왕',
			summary: 'He restores a line without a crown.',
			summaryKo: '왕관 없이 한 핏줄을 되돌린다.',
			turn: 'Gildal; Two Questions',
			turnKo: '길달, 질문 둘',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'King of Daughters',
			titleKo: '딸들의 왕',
			summary: 'He dies with a name. He leaves only daughters.',
			summaryKo: '이름을 가진 채 죽는다. 남는 것은 딸뿐이다.'
		})
	]),

	sunduk: arc('She answers the question mark by outlasting it.', '물음표보다 오래 가서, 물음표에 답한다.', [
		s({
			title: 'Questioned Princess',
			titleKo: '물음표의 공주',
			summary: 'The bone has run out of men. She is the question.',
			summaryKo: '남자 성골이 떨어졌다. 그녀가 물음표다.',
			turn: 'Harmony Council Names a Queen',
			turnKo: '화백이 여왕을 정하다',
			episode: 'Harmony Council'
		}),
		s({
			title: 'Woman King',
			titleKo: '여왕',
			summary: 'She spends decrees on stories somebody would rather keep.',
			summaryKo: '남이 숨기고 싶은 이야기에 어명을 쓴다.',
			turn: 'Restores Yongsu',
			turnKo: '용수를 복권하다',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Sleepless Queen',
			titleKo: '잠 못 드는 여왕',
			summary: 'After Daeya she cannot sleep. The bucket gives her the forty.',
			summaryKo: '대야 이후 잠이 안 온다. 들통이 마흔을 돌려준다.',
			turn: 'The Forty from the Bucket',
			turnKo: '들통의 마흔',
			episode: 'Yushin'
		}),
		s({
			title: 'Queen in a Rebellion',
			titleKo: '반란 속의 여왕',
			summary: 'She dies in the rebellion raised on that slogan.',
			summaryKo: '그 구호로 일어난 반란 한가운데서 죽는다.'
		})
	]),

	bidam: arc('The liberal who curdles in public.', '공개석상에서 상하는 진보.', [
		s({
			title: 'Late Son',
			titleKo: '늦은 아들',
			summary: 'Empty hall. He crowns Dukman.',
			summaryKo: '빈 대청. 덕만을 왕으로 세운다.',
			turn: 'Crowns Dukman',
			turnKo: '덕만을 세우다',
			episode: 'Queen Sunduk'
		}),
		s({
			title: 'Shielding Liberal',
			titleKo: '막아 주는 진보',
			summary: 'He shields Yushin at Jade Gate.',
			summaryKo: '옥문곡에서 유신을 막아 준다.',
			turn: 'Jade Gate Valley',
			turnKo: '옥문곡',
			episode: 'Jade Gate Valley'
		}),
		s({
			title: 'First Chair',
			titleKo: '첫 자리',
			summary: 'Radiance. Blood is inevitable.',
			summaryKo: '명활성. 피는 피할 수 없다.',
			turn: 'Radiance',
			turnKo: '명활성',
			episode: 'Gi (起)'
		}),
		s({
			title: 'Smiling Nativist',
			titleKo: '웃는 토착주의자',
			summary: 'He dies smiling at a name.',
			summaryKo: '이름을 보고 웃으며 죽는다.'
		})
	]),

	alchun: arc('Neutrality costs him a generation of standing.', '중립이 한 세대의 자리를 가져간다.', [
		s({
			title: 'Third of the Yard',
			titleKo: '마당의 셋째',
			summary: 'Good bone, wrong branch.',
			summaryKo: '뼈는 좋다. 가지는 틀렸다.',
			turn: 'Jade Gate with Bidam',
			turnKo: '비담과 옥문곡',
			episode: 'Jade Gate Valley'
		}),
		s({
			title: 'Tiger-Catcher',
			titleKo: '호랑이 잡는 사람',
			summary: 'He will not pick a camp.',
			summaryKo: '편을 고르지 않는다.',
			turn: 'Radiance; Neither',
			turnKo: '명활, 어느 편도 아님',
			episode: 'Gyul (結)'
		}),
		s({
			title: 'High Councillor',
			titleKo: '상대등',
			summary: 'He laughs the holdout down.',
			summaryKo: '버티는 자를 웃으며 내린다.',
			turn: 'Laughs the Holdout Down',
			turnKo: '버티는 자를 웃다',
			episode: 'King Muyeol'
		}),
		s({
			title: 'Man Who Refuses a Crown',
			titleKo: '왕관을 거절하는 사람',
			summary: 'He can refuse a crown.',
			summaryKo: '왕관을 거절할 수 있는 사람이다.'
		})
	]),

	gotaso: arc('She falls the way teenagers fall.', '십대가 빠지는 방식으로 빠진다.', [
		s({
			title: 'Forever Girl',
			titleKo: '영원한 소녀',
			summary: 'She believes in forever. They post her to the edge.',
			summaryKo: '영원함을 믿는다. 제일 위험한 변방에 보낸다.',
			turn: 'Posted to the Border',
			turnKo: '변방에 부임하다',
			episode: 'Gotaso'
		}),
		s({
			title: 'Bride at Daeya',
			titleKo: '대야의 신부',
			summary: 'The fortress falls.',
			summaryKo: '성이 떨어진다.',
			turn: 'The Fortress Falls',
			turnKo: '성이 떨어지다',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Paper Bird',
			titleKo: '종이새',
			summary: 'She does not come home.',
			summaryKo: '집에 오지 않는다.'
		})
	]),

	pumsuk: arc('Purple does not post itself to die.', '자색은 스스로 죽으러 가지 않는다.', [
		s({
			title: 'True Bone Husband',
			titleKo: '진골 남편',
			summary: 'Maehwa. He learns the caste in dye.',
			summaryKo: '매화. 물감으로 신분을 배운다.',
			turn: 'Maehwa',
			turnKo: '매화',
			episode: 'Pumsuk'
		}),
		s({
			title: 'Unprepared Lord',
			titleKo: '준비 안 된 낭군',
			summary: 'Surabol did not prepare him. He walks behind.',
			summaryKo: '서라벌이 그를 준비시키지 않았다. 뒤를 걷는다.',
			turn: 'Walks Behind',
			turnKo: '뒤를 걷다',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Name the Fortress Keeps',
			titleKo: '성이 남긴 이름',
			summary: 'The fortress keeps the name.',
			summaryKo: '성이 그 이름을 가진다.'
		})
	]),

	gumilwife: arc('A woman the system did not consider a person.', '제도가 사람으로 치지 않은 여자.', [
		s({
			title: 'Poorest Woman',
			titleKo: '가장 가난한 여자',
			summary: 'She pours Pumsuk’s wine.',
			summaryKo: '품석의 술을 따른다.',
			turn: 'Pours Pumsuk’s Wine',
			turnKo: '품석의 술을 따르다',
			episode: 'Maehwa'
		}),
		s({
			title: 'The Spark',
			titleKo: '불씨',
			summary: 'She burns three kingdoms and leaves with the gold butterfly.',
			summaryKo: '삼국을 태우고 금나비와 떠난다.',
			turn: 'Leaves with the Gold Butterfly',
			turnKo: '금나비와 떠나다',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Unnamed in the Histories',
			titleKo: '사서에 이름 없는 여자',
			summary: 'The histories do not keep her name.',
			summaryKo: '사서가 이름을 남기지 않는다.'
		})
	]),

	gumil: arc('Yellow posted to die.', '죽으러 보낸 황색.', [
		s({
			title: 'Lowest Head Rank',
			titleKo: '가장 낮은 두품',
			summary: 'Humiliated over his own wife.',
			summaryKo: '제 아내 일로 모욕당한다.',
			turn: 'Humiliated over His Wife',
			turnKo: '아내로 모욕당하다',
			episode: 'Maehwa'
		}),
		s({
			title: 'Man Who Sells the Gate',
			titleKo: '문을 파는 남자',
			summary: 'Private injury plus caste hate.',
			summaryKo: '사적인 상처에, 신분의 미움.',
			turn: 'Siege of Daeya',
			turnKo: '대야성 함락',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Private Injury',
			titleKo: '사적인 원한',
			summary: 'The gate was never only politics.',
			summaryKo: '문은 정치만의 일이 아니었다.'
		})
	]),

	gesomun: arc(
		'He was proved right against the West. He built nothing that could outlive him.',
		'서쪽에 대해선 맞았다. 자신보다 오래갈 것은 짓지 못했다.',
		[
			s({
				title: 'Boy Who Hates Talk',
				titleKo: '말 싫어하는 아이',
				summary: 'He hates Pyongyang talk.',
				summaryKo: '평양 말을 싫어한다.',
				turn: "Father's Summit Silence",
				turnKo: '아버지의 침묵',
				episode: 'Commander Yeon'
			}),
			s({
				title: 'Eastern Commander',
				titleKo: '동쪽의 장군',
				summary: 'He believes Jumong. Then he takes the room.',
				summaryKo: '주몽을 믿는다. 그 다음엔 방을 차지한다.',
				turn: 'Yeon’s Massacre',
				turnKo: '연의 학살',
				episode: 'Yeon’s Massacre'
			}),
			s({
				title: 'Supreme Commander',
				titleKo: '막리지',
				summary: 'A puppet king. Ansi holds.',
				summaryKo: '꼭두각시 왕. 안시가 버틴다.',
				turn: 'Ansi Holds',
				turnKo: '안시가 버티다',
				episode: 'Ansi'
			}),
			s({
				title: 'Proved Right',
				titleKo: '맞았던 사람',
				summary: 'Right against the West. Nothing left that can hold his sons.',
				summaryKo: '서쪽에 대해선 맞았다. 아들을 담을 것은 없다.',
				turn: 'Nothing Left for His Sons',
				turnKo: '아들에게 남은 것이 없다',
				episode: 'Yeon Gesomun†'
			}),
			s({
				title: 'House That Eats Itself',
				titleKo: '스스로를 먹는 집',
				summary: 'A man whose house eats itself.',
				summaryKo: '집이 스스로를 먹는다.'
			})
		]
	),

	euija: arc('A country is a story. He is the one who loses to it.', '나라는 이야기다. 그는 그 이야기에 지는 사람이다.', [
		s({
			title: 'Palace Cynic',
			titleKo: '궁의 냉소가',
			summary: 'He teaches Gyebek and Gesomun the room.',
			summaryKo: '계백과 개소문에게 방을 가르친다.',
			turn: 'Teaches the Room',
			turnKo: '방을 가르치다',
			episode: 'Prince Euija'
		}),
		s({
			title: 'Soft-Spot Prince',
			titleKo: '약한 구석이 있는 태자',
			summary: 'A soft spot for the unstained man. He takes Daeya.',
			summaryKo: '때 안 묻은 사내를 좋아한다. 대야를 취한다.',
			turn: 'Takes Daeya',
			turnKo: '대야를 취하다',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Sealed King',
			titleKo: '문을 잠근 왕',
			summary: 'Wine. The honest man jailed.',
			summaryKo: '술. 정직한 신하를 가둔다.',
			turn: 'Wine; the Honest Man Jailed',
			turnKo: '술, 정직한 신하를 가두다',
			episode: 'Sunchung'
		}),
		s({
			title: 'Eaten King',
			titleKo: '이야기에 먹힌 왕',
			summary: 'The story has already eaten him.',
			summaryKo: '이야기가 이미 그를 먹었다.',
			turn: 'Yellow Mountain; the River',
			turnKo: '황산, 강',
			episode: 'Buyeo Euija†'
		}),
		s({
			title: 'Prisoner Who Knew',
			titleKo: '알고 있던 포로',
			summary: 'He knew.',
			summaryKo: '알고 있었다.'
		})
	]),

	gyebek: arc('I gave my word.', '약속을 했다.', [
		s({
			title: 'Nameless Last Child',
			titleKo: '이름 없는 막내',
			summary: 'A purged house. The prince in a stable-boy coat.',
			summaryKo: '숙청된 집. 마부 옷을 입은 태자.',
			turn: 'The Prince in a Stable-Boy Coat',
			turnKo: '마부 옷의 태자',
			episode: 'Prince Euija'
		}),
		s({
			title: 'Loyal Sword',
			titleKo: '충성하는 칼',
			summary: 'He cannot read a face. They ship him to Tamla.',
			summaryKo: '얼굴을 읽지 못한다. 탐라로 보낸다.',
			turn: 'Passed Over, Shipped to Tamla',
			turnKo: '건너뛰고 탐라로',
			episode: 'King Euija'
		}),
		s({
			title: 'Recalled Sword',
			titleKo: '다시 불린 칼',
			summary: 'Five thousand. The family first.',
			summaryKo: '오천. 가족을 먼저.',
			turn: 'Five Thousand; the Family First',
			turnKo: '오천, 가족을 먼저',
			episode: 'Yellow Mountain'
		}),
		s({
			title: 'Man Who Kept the Word',
			titleKo: '약속을 지킨 사람',
			summary: 'He kept the word.',
			summaryKo: '약속을 지켰다.'
		})
	]),

	seongchung: arc('He names the pass. The king will not read it.', '고개를 가리킨다. 왕은 읽지 않는다.', [
		s({
			title: 'Honest Minister',
			titleKo: '정직한 신하',
			summary: 'He asks for open court.',
			summaryKo: '열린 조정을 청한다.',
			turn: 'The Wine Night',
			turnKo: '술 마시던 밤',
			episode: 'Sunchung'
		}),
		s({
			title: 'Prisoner in White',
			titleKo: '흰옷의 죄인',
			summary: 'Undyed white. Ink, then blood.',
			summaryKo: '물들이지 않은 흰옷. 먹, 그 다음엔 피.',
			turn: 'Ink, then Blood',
			turnKo: '먹, 그 다음엔 피',
			episode: 'Sunchung'
		}),
		s({
			title: 'Unread Map',
			titleKo: '읽히지 않은 지도',
			summary: 'Dead before anyone reads Tanhyun.',
			summaryKo: '탄현을 읽기 전에 죽는다.'
		})
	]),

	heungsu: arc('The same as Sunchung’s words.', '성충과 같은 말.', [
		s({
			title: 'Loyalist Who Says It Twice',
			titleKo: '두 번 말하는 충신',
			summary: 'Exile to Gomamiji.',
			summaryKo: '고마미지로 유배.',
			turn: 'Exile to Gomamiji',
			turnKo: '고마미지로 유배',
			episode: 'Hungsu'
		}),
		s({
			title: 'Man Who Scratches the Map',
			titleKo: '지도를 긁는 사람',
			summary: 'Every morning. The courier comes too late.',
			summaryKo: '매일 아침. 파발은 너무 늦다.',
			turn: 'The Courier Comes Too Late',
			turnKo: '파발이 너무 늦다',
			episode: 'Hungsu'
		}),
		s({
			title: 'Unrecorded Walk',
			titleKo: '기록 없는 걸음',
			summary: 'He walks north in the rain. Not recorded again.',
			summaryKo: '비 속에서 북으로 걷는다. 다시 기록되지 않는다.'
		})
	]),

	ungo: arc('The queen who outlasts the wine.', '술보다 오래 가는 왕비.', [
		s({
			title: 'Consort in a Sealed Palace',
			titleKo: '잠긴 궁의 왕비',
			summary: 'Fifty sons. Five who matter.',
			summaryKo: '아들 쉰. 중요한 건 다섯.',
			turn: 'Fifty Sons, Five Who Matter',
			turnKo: '쉰 중에 다섯',
			episode: 'King Euija'
		}),
		s({
			title: 'Watching Wife',
			titleKo: '보는 아내',
			summary: 'She watches the story eat him.',
			summaryKo: '이야기가 그를 먹는 것을 본다.',
			turn: 'The River',
			turnKo: '강',
			episode: 'Buyeo Euija†'
		}),
		s({
			title: 'Widow of a Story',
			titleKo: '이야기의 과부',
			summary: 'Widow of a country that was a story.',
			summaryKo: '이야기였던 나라의 과부.'
		})
	]),

	sadaham: arc('Everyone came out of a mother’s womb.', '누구나 어머니 뱃속에서 나왔다.', [
		s({
			title: 'First Class Boy',
			titleKo: '제일기의 소년',
			summary: 'A short future. Great Gaya. The cut ropes.',
			summaryKo: '짧은 앞날. 대가야. 잘린 밧줄.',
			turn: 'Great Gaya; the Cut Ropes',
			turnKo: '대가야, 잘린 밧줄',
			episode: 'Sadaham'
		}),
		s({
			title: 'The Hope',
			titleKo: '그 희망',
			summary: 'He makes Muryuk want a son. Then Mugwan dies.',
			summaryKo: '무력에게 아들을 갖고 싶게 한다. 무관이 죽는다.',
			turn: 'Mugwan Dies',
			turnKo: '무관의 죽음',
			episode: 'Sadaham'
		}),
		s({
			title: 'Dead of Grief',
			titleKo: '슬픔으로 죽은 소년',
			summary: 'Dead of grief at seventeen.',
			summaryKo: '열일곱, 슬픔으로 죽는다.'
		})
	]),

	munmu: arc('He finishes the sentence he stole as a child.', '아이 때 훔친 문장을 끝까지 쓴다.', [
		s({
			title: 'Boy Who Says King for All',
			titleKo: '왕검이라 하는 아이',
			summary: 'Gotaso does not come home.',
			summaryKo: '고타소가 집에 오지 않는다.',
			turn: 'Gotaso Does Not Come Home',
			turnKo: '고타소가 오지 않다',
			episode: 'Siege of Daeya'
		}),
		s({
			title: 'Hwarang under Yushin',
			titleKo: '유신 밑의 화랑',
			summary: 'Ocean-trade season. Jahee.',
			summaryKo: '바닷길의 철. 자희.',
			turn: 'Ocean-Trade Season; Jahee',
			turnKo: '바닷길, 자희',
			episode: 'Jahee'
		}),
		s({
			title: 'Heir of a Half-Won War',
			titleKo: '반만 이긴 전쟁의 후계',
			summary: 'He expels the West.',
			summaryKo: '서쪽을 내보낸다.',
			turn: 'Expels the West',
			turnKo: '서쪽을 내보내다',
			episode: 'Munmu'
		}),
		s({
			title: 'King for All',
			titleKo: '왕검',
			summary: 'He walks the road to the end of Samhan.',
			summaryKo: '삼한의 끝까지 그 길을 걷는다.'
		})
	]),

	jayi: arc('The realm is a tide table they keep together.', '나라는 둘이 같이 보는 물때표다.', [
		s({
			title: 'Harbour Girl',
			titleKo: '항구의 소녀',
			summary: 'Rain, wrong sums, almost-kisses.',
			summaryKo: '비, 틀린 셈, 거의 키스.',
			turn: 'Rain, Wrong Sums',
			turnKo: '비, 틀린 셈',
			episode: 'Jahee'
		}),
		s({
			title: 'Wife at the Margins',
			titleKo: '여백을 고치는 아내',
			summary: 'She corrects his margins.',
			summaryKo: '그의 여백을 고친다.',
			turn: 'Queen Jayi',
			turnKo: '자희 왕비',
			episode: 'Munmu'
		}),
		s({
			title: 'Partner',
			titleKo: '짝',
			summary: 'Partner, not ornament.',
			summaryKo: '장식이 아니라 짝.'
		})
	]),

	jinduk: arc('She kept the chair warm.', '자리를 따뜻하게 지켰다.', [
		s({
			title: 'Sister Who Was Never Meant to Last',
			titleKo: '오래갈 줄 몰랐던 누이',
			summary: 'Crowned after Bidam and Sunduk.',
			summaryKo: '비담과 선덕 다음에 왕관을 쓴다.',
			turn: 'Crowned after Bidam and Sunduk',
			turnKo: '비담과 선덕 다음',
			episode: 'Queen Jinduk'
		}),
		s({
			title: 'Last of the Sacred Bone',
			titleKo: '마지막 성골',
			summary: 'The nephew is already running it.',
			summaryKo: '조카가 이미 돌리고 있다.',
			turn: 'The Nephew Already Running It',
			turnKo: '조카가 이미 돌리다',
			episode: 'King Muyeol'
		}),
		s({
			title: 'The Country Continues',
			titleKo: '나라는 계속된다',
			summary: 'The country continues.',
			summaryKo: '나라는 계속된다.'
		})
	]),

	jumong: arc('He grins until the bow.', '활을 들 때까지 웃는다.', [
		s({
			title: 'Exile Archer',
			titleKo: '망명의 궁수',
			summary: 'The hall cannot bend him. Tabal. Sosuno’s ledger.',
			summaryKo: '대청이 그를 굽히지 못한다. 다발. 소서노의 장부.',
			turn: 'Tabal; Sosuno’s Ledger',
			turnKo: '다발, 소서노의 장부',
			episode: 'Buyeo'
		}),
		s({
			title: 'Unnamed Man',
			titleKo: '이름 못 하는 남자',
			summary: 'She will not name him. The five tribes vote him king.',
			summaryKo: '그녀는 이름을 안 부른다. 다섯 부족이 왕으로 뽑는다.',
			turn: 'The Five Tribes Vote Him King',
			turnKo: '다섯 부족이 왕으로 뽑다',
			episode: 'Jolbon'
		}),
		s({
			title: 'Founder',
			titleKo: '시조',
			summary: 'His sons walk south.',
			summaryKo: '아들들이 남으로 걷는다.',
			turn: 'Onjo Leaves',
			turnKo: '온조가 떠나다',
			episode: 'Onjo'
		}),
		s({
			title: 'Largest Roof',
			titleKo: '가장 큰 지붕',
			summary: 'His descendants make the largest roof.',
			summaryKo: '후손이 가장 큰 지붕을 만든다.'
		})
	]),

	sosuno: arc('She is furious and blushing.', '화나 있고, 얼굴이 붉다.', [
		s({
			title: 'Tsundere',
			titleKo: '화내는 여자',
			summary: 'She will not say it. The well yard. The ditch.',
			summaryKo: '그 말을 안 한다. 우물 마당. 도랑.',
			turn: 'The Well Yard',
			turnKo: '우물 마당',
			episode: 'Buyeo'
		}),
		s({
			title: 'Country-Building Wife',
			titleKo: '나라를 짓는 아내',
			summary: 'She builds a country. The vote at Jolbon.',
			summaryKo: '나라를 짓는다. 졸본의 투표.',
			turn: 'The Vote at Jolbon',
			turnKo: '졸본의 투표',
			episode: 'Jolbon'
		}),
		s({
			title: 'Mother on the Southern Road',
			titleKo: '남쪽 길의 어머니',
			summary: 'Onjo and Biryu leave.',
			summaryKo: '온조와 비류가 떠난다.',
			turn: 'Onjo and Biryu Leave',
			turnKo: '온조와 비류가 떠나다',
			episode: 'Onjo'
		}),
		s({
			title: 'The Country She Walks Into',
			titleKo: '걸어 들어간 나라',
			summary: 'The country she walks into.',
			summaryKo: '걸어 들어간 나라.'
		})
	]),

	yuhwa: arc('The river girl who looks up.', '올려다보는 강의 소녀.', [
		s({
			title: 'Daughter of the Current',
			titleKo: '물살의 딸',
			summary: 'Haemosu breaks the schedule.',
			summaryKo: '해모수가 시각을 깬다.',
			turn: 'Haemosu Breaks the Schedule',
			turnKo: '해모수가 시각을 깨다',
			episode: 'Haemosu'
		}),
		s({
			title: 'Exile Mother',
			titleKo: '망명의 어머니',
			summary: 'She bears a son. Jumong hatches.',
			summaryKo: '아들을 낳는다. 주몽이 태어난다.',
			turn: 'Jumong Hatches',
			turnKo: '주몽이 태어나다',
			episode: 'Buyeo'
		}),
		s({
			title: 'Moon',
			titleKo: '달',
			summary: 'Moon when he comes himself.',
			summaryKo: '그가 직접 올 때, 달이 된다.'
		})
	]),

	haemosu: arc('The day belongs where the chariot passes.', '수레가 지나는 곳이 낮이다.', [
		s({
			title: 'Sun on Schedule',
			titleKo: '시각의 해',
			summary: 'Yuhwa in the shallows.',
			summaryKo: '여울의 유화.',
			turn: 'Yuhwa in the Shallows',
			turnKo: '여울의 유화',
			episode: 'Haemosu'
		}),
		s({
			title: 'Father Who Comes Himself',
			titleKo: '직접 오는 아버지',
			summary: 'She takes the night as moon.',
			summaryKo: '그녀가 밤을 달로 가져간다.',
			turn: 'She Takes the Night as Moon',
			turnKo: '밤을 달로 가져가다',
			episode: 'Haemosu'
		}),
		s({
			title: 'Territorial God of the Day',
			titleKo: '낮의 신',
			summary: 'The day is his territory.',
			summaryKo: '낮은 그의 땅이다.'
		})
	]),

	suro: arc('Hunger is honest. Meet it yourself.', '배고픔은 정직하다. 직접 만나라.', [
		s({
			title: 'Egg-Born Hungry King',
			titleKo: '알에서 난 배고픈 왕',
			summary: 'He walks down to the beach himself.',
			summaryKo: '해변까지 직접 걷는다.',
			turn: 'Walks Down to the Beach Himself',
			turnKo: '해변까지 직접 걷다',
			episode: 'Suro'
		}),
		s({
			title: 'Husband Who Does Not Send a Servant',
			titleKo: '종을 보내지 않는 남편',
			summary: 'Two sons carry her name.',
			summaryKo: '두 아들이 그녀의 이름을 가진다.',
			turn: 'Two Sons Carry Her Name',
			turnKo: '두 아들이 그 이름을 가지다',
			episode: 'Suro'
		}),
		s({
			title: 'Ghost Who Asks Whose Iron',
			titleKo: '누구의 쇠냐고 묻는 귀신',
			summary: 'He asks whose iron.',
			summaryKo: '누구의 쇠냐고 묻는다.'
		})
	]),

	heohwangok: arc('Keep your own name across any sea.', '어떤 바다를 건너도 제 이름을 지켜라.', [
		s({
			title: 'Princess off a Red Sail',
			titleKo: '붉은 돛의 공주',
			summary: 'A country nobody had heard of.',
			summaryKo: '아무도 모르는 나라.',
			turn: 'A Country Nobody Had Heard Of',
			turnKo: '아무도 모르는 나라',
			episode: 'Suro'
		}),
		s({
			title: 'Queen Who Keeps Her Name',
			titleKo: '이름을 지키는 왕비',
			summary: 'Two sons are hers.',
			summaryKo: '두 아들은 그녀의 것이다.',
			turn: 'Two Sons Are Hers',
			turnKo: '두 아들이 그녀의 것',
			episode: 'Suro'
		}),
		s({
			title: 'The Blood Bidam Spends',
			titleKo: '비담이 쓰는 피',
			summary: 'The blood Bidam will later spend.',
			summaryKo: '나중에 비담이 쓰는 피.'
		})
	]),

	onjo: arc('The son who leaves Jumong’s roof.', '주몽의 지붕을 떠나는 아들.', [
		s({
			title: 'Boy of the Southern Road',
			titleKo: '남쪽 길의 아이',
			summary: 'A white stag.',
			summaryKo: '흰 사슴.',
			turn: 'White Stag',
			turnKo: '흰 사슴',
			episode: 'Onjo'
		}),
		s({
			title: 'Founder Who Will Not Say Jumong',
			titleKo: '주몽이라 안 하는 시조',
			summary: 'Sabi rises.',
			summaryKo: '사비가 선다.',
			turn: 'Sabi Rises',
			turnKo: '사비가 서다',
			episode: 'Onjo'
		}),
		s({
			title: 'The House Euija Inherits',
			titleKo: '의가 물려받는 집',
			summary: 'The house Euija inherits.',
			summaryKo: '의가 물려받는 집.'
		})
	]),

	taizong: arc('No one left to tell him no.', '안 된다고 할 사람이 없다.', [
		s({
			title: 'Emperor Who Wants to Finish the Sui',
			titleKo: '수를 끝내려는 황제',
			summary: 'The seventh invasion.',
			summaryKo: '일곱 번째 침공.',
			turn: 'The Seventh Invasion',
			turnKo: '일곱 번째 침공',
			episode: 'Emperor'
		}),
		s({
			title: 'Man Who Mispronounces a Name',
			titleKo: '이름을 잘못 읽는 사람',
			summary: 'Chunchu buys a war.',
			summaryKo: '춘추가 전쟁을 산다.',
			turn: 'Chunchu Buys a War',
			turnKo: '춘추가 전쟁을 사다',
			episode: 'Huangdi (皇帝)'
		}),
		s({
			title: 'Dying Promise',
			titleKo: '식지 않은 약속',
			summary: 'He dies with the promise still warm.',
			summaryKo: '약속이 식기 전에 죽는다.'
		})
	]),

	wuzetian: arc('Influence without the throne — then the throne.', '왕좌 없이 움직이다가, 왕좌.', [
		s({
			title: 'Consort Behind a Screen',
			titleKo: '병풍 뒤의 후궁',
			summary: 'The hallway. The dying emperor.',
			summaryKo: '복도. 죽어가는 황제.',
			turn: 'The Hallway; the Dying Emperor',
			turnKo: '복도, 죽어가는 황제',
			episode: 'Huangdi (皇帝)'
		}),
		s({
			title: 'Cast Out',
			titleKo: '쫓겨난 사람',
			summary: 'Head shaved. Anniversary incense.',
			summaryKo: '머리를 깎는다. 기일의 향.',
			turn: 'Anniversary Incense',
			turnKo: '기일의 향',
			episode: 'Jiabeng (駕崩)'
		}),
		s({
			title: 'The Room That Changes Owners',
			titleKo: '주인이 바뀌는 방',
			summary: 'The room changes owners.',
			summaryKo: '방의 주인이 바뀐다.'
		})
	]),

	namseng: arc('A son is born — syllables like thanks.', '아들이 태어난다. 감사와 비슷한 음절.', [
		s({
			title: 'Eldest under a Strict Roof',
			titleKo: '엄한 지붕의 맏이',
			summary: "Father's death.",
			summaryKo: '아버지의 죽음.',
			turn: "Father's Death",
			turnKo: '아버지의 죽음',
			episode: 'Yeon Gesomun†'
		}),
		s({
			title: 'Heir the House Cannot Hold',
			titleKo: '집이 못 담는 후계',
			summary: 'Brothers’ coup.',
			summaryKo: '아우들의 쿠데타.',
			turn: 'Brothers’ Coup',
			turnKo: '아우들의 쿠데타',
			episode: 'Brothers’ Coup'
		}),
		s({
			title: 'First to Lose the Roof',
			titleKo: '지붕을 먼저 잃은 사람',
			summary: 'The first to lose the roof.',
			summaryKo: '지붕을 먼저 잃는다.'
		})
	]),

	kangrim: arc('Were you X, or Y?', '너는 X였느냐, Y였느냐.', [
		s({
			title: 'Fetch of the Dead',
			titleKo: '죽은 자를 데리는 이',
			summary: 'The binary at every major death.',
			summaryKo: '큰 죽음마다 그 이분법.',
			turn: 'The Binary at Every Major Death',
			turnKo: '큰 죽음의 이분법',
			episode: 'Kangrim'
		}),
		s({
			title: 'Who Is Bihyung',
			titleKo: '비형은 누구냐',
			summary: 'A story, better than me.',
			summaryKo: '이야기다. 나보다 낫다.',
			turn: 'A Story, Better than Me',
			turnKo: '이야기다, 나보다 낫다',
			episode: 'Kim Yongsu'
		}),
		s({
			title: 'Unvarying Psychopomp',
			titleKo: '변하지 않는 저승사자',
			summary: 'He does not vary the rite.',
			summaryKo: '의식을 바꾸지 않는다.'
		})
	])
};
