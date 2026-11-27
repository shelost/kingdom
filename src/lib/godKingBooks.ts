/**
 * The God King shelf. Two rows, five books each. English is "Name, the subtitle".
 * Korean is the name alone.
 *
 * A book is the stretch of years, named for whoever is most active in it.
 * It is not that person's biography. Dae's years run beside the southern war.
 */
import { buildStoryShelf, type StoryPartSrc } from '$lib/storyShelf';

/** Titles that already have an anchor on the Later Three Kingdoms outline. */
const KNOWN = new Set([
	'Kim Chang',
	'The Sea Tomb',
	'Manpasikjuk',
	'Three Shrines',
	"A Queen? Again?",
	'The Dharani',
	'Sangju',
	"The Crow's Slip",
	'The Spear Pillow',
	'Ten Years',
	'Ten Points',
	'Equal Rice',
	'Songak',
	'The Sea God',
	"Euija's Grievance",
	'The Portrait',
	'The Willow Leaf',
	'Gayasan',
	'The Otter',
	'Gwansim',
	'The Iron Pestle',
	'Behind the Curtain',
	'Barley',
	'Goryeo',
	'Hostages',
	'The Northern King',
	'Khitan Snow',
	'Poseokjeong',
	'Gongsan',
	'The Letters',
	'Gochang',
	'Unju',
	'Geumsansa',
	'Hemp',
	'Illicheon',
	'Yellow Mountain, Again',
	'Manbu Bridge',
	'Ten Injunctions'
]);

const PARTS_SRC: StoryPartSrc[] = [
	{
		id: 'fall',
		title: 'The Fall of Silla',
		ko: '신라의 몰락',
		years: '887–918',
		arcs: [
			{
				id: 'queen',
				title: 'The Fall of Silla',
				ko: '신라의 몰락',
				volumes: [
					{
						id: 'rm-kim-man',
						title: 'Kim Man, the Queen',
						ko: '김만',
						spine: '#3d3a6b',
						years: '887–892',
						blurb: {
							en: 'The years the crown is still hers. A coronation, a boy thrown away, and the rebellion that starts while she is on the throne.',
							ko: '아직 왕관이 그의 것인 해. 즉위, 버려진 아이, 그가 왕인 동안 시작되는 난.'
						},
						episodes: [
							{ title: "A Queen? Again?", ko: '또 여왕?', year: '887', hook: 'They put the crown on her because the men are out of brothers.' },
							{ title: 'Kim Chang', ko: '김창', year: '869', hook: 'The same year she is crowned, the story of the boy thrown from the tower.', flashback: true },
							{ title: 'The Monastery', ko: '절', year: '870', hook: 'The boy who lived is left at a monastery.', flashback: true, outline: 'Kim Chang' },
							{ title: 'The Dharani', ko: '다라니', year: '888', hook: 'A printed charm, and a poem from a cell.' },
							{ title: 'Sangju', ko: '상주', year: '889', hook: 'Wonjong and Aeno rise at Sangju. The provinces stop paying.' },
							{ title: "Ajagae's Gate", ko: '아자개의 문', year: '889', hook: 'Kyun Hwon leaves his father and takes the Silla army’s road.', outline: 'The Spear Pillow' },
							{ title: 'The Sea Tomb', ko: '바다의 무덤', year: '681', hook: 'A king is buried at sea. The bone-rank stays on the beach.', flashback: true },
							{ title: 'Manpasikjuk', ko: '만파식적', year: '661', hook: 'The flute that was supposed to quiet the country.', flashback: true },
							{ title: 'Three Shrines', ko: '세 사당', year: '681', hook: 'Three shrines, and none of them for the living.', flashback: true },
							{ title: 'Ten Years', ko: '십 년', year: '868', hook: 'Choe Chiwon goes to Tang at twelve.', flashback: true },
							{ title: 'The Proclamation', ko: '격문', year: '879', hook: 'Huang Chao writes a proclamation. Choe answers it.', outline: 'Ten Years' }
						]
					}
				]
			},
			{
				id: 'lords',
				title: 'The Fall of Silla',
				ko: '신라의 몰락',
				volumes: [
					{
						id: 'rm-yang-gil',
						title: 'Yang Kil, the Warlord',
						ko: '양길',
						spine: '#8B3A3A',
						years: '892–896',
						blurb: {
							en: 'The years a castle lord is the man the north answers. A monk comes to him with a hundred men. By the end, Songak has come too.',
							ko: '북쪽이 대답하는 사람이 성주인 해. 백 명을 거느린 승려가 오고, 끝에는 송악도 온다.'
						},
						episodes: [
							{ title: "The Crow's Slip", ko: '까마귀의 실수', year: '892', hook: 'Kung Ye comes under Yang Kil. A crow has already slipped him a name.' },
							{ title: 'Gi Hwon', ko: '기훤', year: '892', hook: 'Another lord, another gate, the same hungry year.', outline: "The Crow's Slip" },
							{ title: 'A Hundred Men', ko: '백 명', year: '892', hook: 'He will not take more than the rice can feed.', outline: 'Equal Rice' },
							{ title: 'Equal Rice', ko: '고른 밥', year: '892', hook: 'The same bowl for the monk and the men.' },
							{ title: 'Ten Points', ko: '십 조', year: '894', hook: 'Choe brings home ten points. The court keeps the bone-rank cap.' },
							{ title: 'Doseon', ko: '도선', year: '896', hook: 'A monk looks at the ground and tells them where to build.', outline: 'Songak' },
							{ title: 'Songak', ko: '송악', year: '896', hook: 'Wang Gun comes under Kung Ye. The mountain already has his name on it.' },
							{
								title: 'Red Trousers',
								ko: '적고적',
								year: '896',
								hook: 'Red trousers, close enough to the capital that the court can see them.',
								outline: 'Songak'
							}
						]
					},
					{
						id: 'rm-kyun-hwon',
						title: 'Kyun Hwon, the Dragon',
						ko: '견훤',
						spine: '#d9b13a',
						years: '895–900',
						blurb: {
							en: 'The years the southwest becomes a kingdom. He takes the title Lord of Baekje, the queen steps down, and Wansan gets a capital.',
							ko: '서남이 나라가 되는 해. 백제 왕을 자칭하고, 왕후가 물러나고, 완산이 도읍이 된다.'
						},
						episodes: [
							{ title: 'The Tigress', ko: '암호랑이', year: '885', hook: 'A tigress, an earthworm, a story his mother tells.', flashback: true, outline: 'The Spear Pillow' },
							{ title: 'The Spear Pillow', ko: '창 베개', year: '892', hook: 'He sleeps with the spear where a pillow should be.' },
							{ title: 'Mujinju', ko: '무진주', year: '892', hook: 'He takes the town and still will not say king.', outline: 'The Spear Pillow' },
							{ title: 'The Word King', ko: '왕이라는 말', year: '895', hook: 'He styles himself Lord of Baekje.', outline: 'The Spear Pillow' },
							{ title: 'She Lacks Virtue', ko: '덕이 없다', year: '897', hook: 'Jinseong resigns. Kung Ye breaks from Yang Kil.', outline: 'Ten Points' },
							{ title: 'Wansan', ko: '완산', year: '900', hook: 'He picks the town, calls it a capital, and founds a new Baekje.', outline: "Euija's Grievance" },
							{ title: 'Gold in the Floor', ko: '마루 밑의 금', year: '900', hook: 'They dig and the gold is there.', outline: "Euija's Grievance" },
							{ title: 'Three Names', ko: '세 이름', year: '900', hook: 'He spits on the three names Silla still uses.', outline: "Euija's Grievance" },
							{ title: "Euija's Grievance", ko: '의자의 숙분', year: '900', hook: 'The speech, and the ships from across the water.' }
						]
					}
				]
			},
			{
				id: 'monk',
				title: 'The Fall of Silla',
				ko: '신라의 몰락',
				volumes: [
					{
						id: 'rm-gung-ye',
						title: 'Kung Ye, the Monk',
						ko: '궁예',
						spine: '#1c1a17',
						years: '899–911',
						blurb: {
							en: 'The years the monk is the north. Yang Kil falls, a dead country gets a new name, and the name keeps changing.',
							ko: '승려가 북쪽인 해. 양길이 지고, 죽은 나라에 새 이름이 붙고, 그 이름이 또 바뀐다.'
						},
						episodes: [
							{ title: 'Thirty Forts', ko: '서른 성', year: '899', hook: 'Kung Ye defeats Yang Kil and takes the forts back.', outline: 'Songak' },
							{ title: 'The Portrait', ko: '초상', year: '901', hook: 'He founds a new Goguryeo. At Buseoksa he cuts a painted face.' },
							{ title: 'The Name', ko: '이름', year: '901', hook: 'He puts the old name on a kingdom that is not his yet.', outline: 'The Portrait' },
							{ title: 'Naju', ko: '나주', year: '903', hook: 'Wang Gun takes the port and keeps it.', outline: 'The Willow Leaf' },
							{ title: 'The Willow Leaf', ko: '버들잎', year: '904', hook: 'He renames the state Majin. A willow leaf, the first time the admiral is sent south.' },
							{ title: 'Maitreya', ko: '미륵', year: '905', hook: 'He proclaims himself Maitreya.', outline: 'The Otter' },
							{ title: 'Gayasan', ko: '가야산', year: '906', hook: 'A mountain, and Choe’s shoes still on the road.' },
							{ title: 'The Shoes', ko: '신발', year: '906', hook: 'Choe Chiwon leaves his shoes and does not come back.', outline: 'Gayasan' },
							{ title: 'The Otter', ko: '수달', year: '910', hook: 'Wang Gun defeats the Sea Otter.' },
							{ title: 'Spit', ko: '침', year: '911', hook: 'He renames the state Taebong, and spits the sutra he says heaven wrote.', outline: 'The Otter' },
							{ title: 'Gwansim', ko: '관심', year: '911', hook: 'He says he has seen the treason. Wang Gun confesses to something he did not do.' }
						]
					},
					{
						id: 'rm-hong-yu',
						title: 'Hong Yu, the Revolutionary',
						ko: '홍유',
						spine: '#c04040',
						years: '912–918',
						blurb: {
							en: 'The years the monk’s house comes apart. A sea fight, a family killed, and a night when four men open a gate.',
							ko: '승려의 집이 무너지는 해. 바다의 싸움, 죽임당한 가족, 네 사람이 문을 여는 밤.'
						},
						episodes: [
							{ title: 'Dukjinpo', ko: '덕진포', year: '912', hook: 'Wang Gun’s ships at Dukjinpo.', outline: 'The Willow Leaf' },
							{ title: 'The Club', ko: '철퇴', year: '915', hook: 'Kung Ye kills his wife and his sons.', outline: 'Gwansim' },
							{ title: 'The Iron Pestle', ko: '쇠 절굿공이', year: '918', hook: 'She is killed with the thing she cooks with.' },
							{ title: 'Behind the Curtain', ko: '휘장 뒤', year: '918', hook: 'Cheorwon. The gate is open. He is the one who can shut it.' },
							{ title: 'Lady Yu', ko: '유 부인', year: '918', hook: 'She puts the armor on him.', outline: 'Behind the Curtain' },
							{ title: 'Barley', ko: '보리', year: '918', hook: 'The north gate. He hears the drums and goes out in the dark.' },
							{ title: 'Goryeo', ko: '고려', year: '918', hook: 'The revolution. Wang Gun is crowned, and the name becomes Goryeo.' }
						]
					}
				]
			}
		]
	},
	{
		id: 'rise',
		title: 'The Rise of Goryeo',
		ko: '고려의 일어남',
		years: '916–943',
		arcs: [
			{
				id: 'rise-books',
				title: 'The Rise of Goryeo',
				ko: '고려의 일어남',
				volumes: [
					{
						id: 'rm-dae-gwang-hyun',
						title: 'Dae Gwang-hyun, the Northern Prince',
						ko: '대광현',
						spine: '#2f4f6f',
						years: '916–926',
						blurb: {
							en: 'The northern war, beside the southern one. The Khitan proclaim an empire, take Buyeo Fortress, and end Balhae. What is left walks south.',
							ko: '남쪽 전쟁 옆의 북쪽 전쟁. 거란이 제국을 선포하고, 부여성을 취하고, 발해를 끝낸다. 남은 것은 남으로 걷는다.'
						},
						episodes: [
							{
								title: 'The Khitan Empire',
								ko: '거란의 제국',
								year: '916',
								hook: 'Abaoji proclaims the Khitan Empire. The north has a new name.',
								outline: 'Khitan Snow'
							},
							{ title: 'Hostages', ko: '인질', year: '920', hook: 'He takes their sons and calls it peace.' },
							{
								title: 'Buyeo Fortress',
								ko: '부여성',
								year: '925',
								hook: 'The Khitan take Buyeo Fortress. Balhae starts to fall.',
								outline: 'The Northern King'
							},
							{ title: 'Jochamul', ko: '조참물', year: '925', hook: 'A cousin dies on a mission Wang Gun sent.', outline: 'The Northern King' },
							{ title: 'The Northern King', ko: '북방의 왕', year: '926', hook: 'Balhae falls. The king comes south.' },
							{ title: 'The Dead Nephew', ko: '죽은 조카', year: '926', hook: 'He keeps the grief and does not spend it yet.', outline: 'The Northern King' },
							{ title: 'Khitan Snow', ko: '거란의 눈', year: '926', hook: 'Balhae is gone. The people who are left walk south.' }
						]
					},
					{
						id: 'rm-sin-sung-gyum',
						title: 'Sin Sung-gyum, the Crimson Shadow',
						ko: '신숭겸',
						spine: '#7a2430',
						years: '918–927',
						blurb: {
							en: 'The years of the war with the southwest, up to the morning someone has to wear the king’s armor.',
							ko: '서남과의 전쟁이 이어지는 해, 누군가 왕의 갑옷을 입어야 하는 아침까지.'
						},
						episodes: [
							{ title: 'Poseokjeong', ko: '포석정', year: '927', hook: 'Silla’s king is at a party. Kyun Hwon is already on the road.' },
							{ title: 'Gongsan', ko: '공산', year: '927', hook: 'The trap closes. Someone has to wear the king’s armor.' },
							{ title: 'The Armor', ko: '갑옷', year: '927', hook: 'Sin Sung-gyeom puts it on.', outline: 'Gongsan' }
						]
					},
					{
						id: 'rm-yu-gum-pil',
						title: 'Yu Gum-pil, the Iron Shield',
						ko: '유금필',
						spine: '#4f7a3a',
						years: '930–934',
						blurb: {
							en: 'The years the war turns on one charge. Gochang holds. Unju does not wait for the other line to finish forming.',
							ko: '전쟁이 한 번의 돌격으로 기우는 해. 고창은 버티고, 운주는 상대의 진이 끝나기를 기다리지 않는다.'
						},
						episodes: [
							{ title: 'The Letters', ko: '편지', year: '929', hook: 'Two letters, in the year before the charge.' },
							{ title: 'Gochang', ko: '고창', year: '930', hook: 'The town holds. The war does not end.' },
							{ title: 'The Cushion', ko: '방석', year: '934', hook: 'Gumgang gets the seat. The eldest sees it.', outline: 'Unju' },
							{ title: 'Unju', ko: '운주', year: '934', hook: 'The charge. He goes before the other line has finished forming.' }
						]
					},
					{
						id: 'rm-kyun-sin-gum',
						title: 'Kyun Sin-gum, the Divine Sword',
						ko: '견신검',
						spine: '#a6842a',
						years: '935–936',
						blurb: {
							en: 'Two years. He bars the gate on his father, and the next year he meets the river.',
							ko: '두 해. 아버지에게 문을 걸어 잠그고, 이듬해 강을 만난다.'
						},
						episodes: [
							{ title: 'The Eldest', ko: '맏이', year: '935', hook: 'He starts counting his brothers.', outline: 'Geumsansa' },
							{ title: 'The Bar', ko: '빗장', year: '935', hook: 'The temple door. He is the one holding it.', outline: 'Geumsansa' },
							{ title: 'The Walk', ko: '걸어 나감', year: '935', hook: 'Nungye and Aebok walk out. They do not come back.', outline: 'Geumsansa' },
							{ title: 'Five Brothers', ko: '오형제', year: '935', hook: 'Yanggum, Yonggum, Gumgang, the youngest, and the man at the gate.', outline: 'Geumsansa' },
							{ title: 'Geumsansa', ko: '금산사', year: '935', hook: 'The hand on the door. The youngest is already at his shoulder.' },
							{ title: 'The Sons', ko: '아들들', year: '935', hook: 'What is left of the five, after the door.', outline: 'Geumsansa' },
							{ title: 'Sangbu', ko: '상부', year: '935', hook: 'The shore. Wang Gun calls the enemy father.', outline: 'Geumsansa' },
							{ title: 'Hemp', ko: '베옷', year: '935', hook: 'Silla’s prince walks in wearing hemp.' },
							{ title: 'Illicheon', ko: '일리천', year: '936', hook: 'The morning the two lines meet.' },
							{ title: 'Yellow Mountain, Again', ko: '다시, 황산', year: '936', hook: 'The same plain. A different king kneels.' },
							{ title: 'The Abscess', ko: '종기', year: '936', hook: 'Kyun Hwon does not live long past the field.', outline: 'Yellow Mountain, Again' },
							{ title: 'The Gate', ko: '문', year: '936', hook: 'Singum bars it. It is the last thing he does.', outline: 'Illicheon' }
						]
					},
					{
						id: 'rm-wang-geon',
						title: 'Wang Gun, the King of Goryeo',
						ko: '왕건',
						spine: '#8f2d2d',
						years: '936',
						blurb: {
							en: 'The year the field is his. The island, the camels, and the ten lines come after, and they stay in his book because the war is already over.',
							ko: '들이 그의 것이 되는 해. 섬과 낙타와 열 조는 그 다음이고, 전쟁이 이미 끝났으므로 그의 책에 남는다.'
						},
						episodes: [
							{ title: 'The Sea God', ko: '해신', year: '828', hook: 'Jang Bogo’s island, before any of these men are born.', flashback: true },
							{ title: 'The Chair', ko: '의자', year: '846', hook: 'A chair, and a murder that teaches the house what a throne costs.', flashback: true, outline: 'The Sea God' },
							{ title: 'The Field', ko: '들판', year: '936', hook: 'Illicheon. He meets the line, and the morning is his.', outline: 'Illicheon' },
							{ title: 'Tamla', ko: '탐라', year: '938', hook: 'The island comes in. The map is finished.', outline: 'Ten Injunctions' },
							{ title: 'The Camels', ko: '낙타', year: '942', hook: 'A gift from the north. He takes it badly.', outline: 'Manbu Bridge' },
							{ title: 'Manbu Bridge', ko: '만부교', year: '942', hook: 'The bridge, and the insult he will not swallow.' },
							{ title: 'Ten Injunctions', ko: '훈요십조', year: '943', hook: 'He writes ten things down and dies.' }
						]
					}
				]
			}
		]
	}
];

export const {
	parts: GODKING_PARTS,
	volumes: GODKING_VOLUMES,
	rows: GODKING_ROWS
} = buildStoryShelf({
	shelf: 'godking',
	story: '/stories/husam',
	known: KNOWN,
	parts: PARTS_SRC
});
