/**
 * The God King shelf. Two rows, five books each. English is "Name, the subtitle".
 * Korean is the name alone.
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
						blurb: {
							en: 'Silla’s last queen. The court she inherits is already eating itself, and the man who can write the memorial is the man the court will not hear.',
							ko: '신라의 마지막 왕. 물려받은 조정은 이미 스스로를 먹고 있고, 상소를 쓸 수 있는 사람은 조정이 듣지 않는 사람이다.'
						},
						episodes: [
							{ title: 'The Sea Tomb', ko: '바다의 무덤', year: '681', hook: 'A king is buried at sea. The bone-rank stays on the beach.', flashback: true },
							{ title: 'Manpasikjuk', ko: '만파식적', year: '661', hook: 'The flute that was supposed to quiet the country.', flashback: true },
							{ title: 'Three Shrines', ko: '세 사당', year: '681', hook: 'Three shrines, and none of them for the living.', flashback: true },
							{ title: "A Queen? Again?", ko: '또 여왕?', year: '887', hook: 'They put the crown on her because the men are out of brothers.' },
							{ title: 'The Dharani', ko: '다라니', year: '888', hook: 'A printed charm, and a poem from a cell.' },
							{ title: 'Sangju', ko: '상주', year: '889', hook: 'The horse turns at Sangju. The rebellion does not.' },
							{ title: 'Ten Years', ko: '십 년', year: '868', hook: 'Choe Chiwon goes to Tang at twelve.', flashback: true },
							{ title: 'The Proclamation', ko: '격문', year: '879', hook: 'Huang Chao writes a proclamation. Choe answers it.', outline: 'Ten Years' },
							{ title: 'Ten Points', ko: '십 조', year: '894', hook: 'He brings home ten points. The court keeps the bone-rank cap.' },
							{ title: 'She Lacks Virtue', ko: '덕이 없다', year: '897', hook: 'They take the crown back and call it her fault.', outline: 'Ten Points' }
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
						blurb: {
							en: 'A castle lord who notices a monk with a hundred men. He hands the boy the north, and then the north stops answering.',
							ko: '백 명을 거느린 승려를 알아본 성주. 북쪽을 맡겼더니, 북쪽이 대답을 멈춘다.'
						},
						episodes: [
							{ title: 'Kim Chang', ko: '김창', year: '869', hook: 'A boy is thrown from a tower. He lives.' },
							{ title: 'The Monastery', ko: '절', year: '870', hook: 'The boy who lived becomes a monk.', outline: 'Kim Chang' },
							{ title: "The Crow's Slip", ko: '까마귀의 실수', year: '891', hook: 'A crow slips. A man takes it as a sign.' },
							{ title: 'Gi Hwon', ko: '기훤', year: '892', hook: 'Another lord, another gate, the same hungry year.', outline: "The Crow's Slip" },
							{ title: 'A Hundred Men', ko: '백 명', year: '892', hook: 'He will not take more than the rice can feed.', outline: 'Equal Rice' },
							{ title: 'Equal Rice', ko: '고른 밥', year: '892', hook: 'The same bowl for the monk and the men.' },
							{ title: 'Thirty Forts', ko: '서른 성', year: '898', hook: 'Yang Gil loses the forts he lent.', outline: 'Songak' }
						]
					},
					{
						id: 'rm-kyun-hwon',
						title: 'Kyun Hwon, the Dragon',
						ko: '견훤',
						spine: '#d9b13a',
						blurb: {
							en: 'A soldier who will not say king, until Wansan. Gold under the floor, three dead names, and a speech Silla has heard before.',
							ko: '왕이라 말하지 않던 군인, 완산까지. 마루 밑의 금, 죽은 이름 셋, 신라가 전에 들어본 연설.'
						},
						episodes: [
							{ title: 'The Tigress', ko: '암호랑이', year: '885', hook: 'A tigress, an earthworm, a story his mother tells.', outline: 'The Spear Pillow' },
							{ title: "Ajagae's Gate", ko: '아자개의 문', year: '889', hook: 'His father keeps a gate. He does not stay.', outline: 'The Spear Pillow' },
							{ title: 'The Spear Pillow', ko: '창 베개', year: '892', hook: 'He sleeps with the spear where a pillow should be.' },
							{ title: 'Mujinju', ko: '무진주', year: '892', hook: 'He takes the town and still will not say king.', outline: 'The Spear Pillow' },
							{ title: 'The Word King', ko: '왕이라는 말', year: '899', hook: 'Years of holding the south without the word.', outline: 'The Spear Pillow' },
							{ title: 'Wansan', ko: '완산', year: '900', hook: 'He picks the town and calls it a capital.', outline: "Euija's Grievance" },
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
						blurb: {
							en: 'A monk who cuts a painted king’s face, takes a dead country’s name, and starts seeing treason.',
							ko: '그려진 왕의 얼굴을 베고, 죽은 나라의 이름을 가져가고, 역모를 보기 시작한다.'
						},
						episodes: [
							{ title: 'The Portrait', ko: '초상', year: '901', hook: 'Buseoksa. He cuts the painted face. Wang Geon watches.' },
							{ title: 'The Name', ko: '이름', year: '901', hook: 'He puts Goryeo on a kingdom that is not his.', outline: 'The Portrait' },
							{ title: 'Gayasan', ko: '가야산', year: '906', hook: 'A mountain, and Choe’s shoes still on the road.' },
							{ title: 'The Shoes', ko: '신발', year: '906', hook: 'Choe Chiwon leaves his shoes and does not come back.', outline: 'Gayasan' },
							{ title: 'The Otter', ko: '수달', year: '911', hook: 'An otter, and a man killed at court for a joke.' },
							{ title: 'Spit', ko: '침', year: '911', hook: 'He spits the sutra he says heaven wrote.', outline: 'The Otter' },
							{ title: 'Maitreya', ko: '미륵', year: '911', hook: 'He says he is the one they have been waiting for.', outline: 'The Otter' },
							{ title: 'Gwansim', ko: '관심', year: '911', hook: 'He says he has seen the treason. Wang Geon confesses to something he did not do.' },
							{ title: 'The Club', ko: '철퇴', year: '915', hook: 'The sutra gets a weapon.', outline: 'Gwansim' }
						]
					},
					{
						id: 'rm-hong-yu',
						title: 'Hong Yu, the Revolutionary',
						ko: '홍유',
						spine: '#c04040',
						blurb: {
							en: 'He comes at night with the other three and opens the gate the monk will not survive.',
							ko: '밤에 셋과 함께 와, 승려가 넘기지 못할 문을 연다.'
						},
						episodes: [
							{ title: 'The Iron Pestle', ko: '쇠 절굿공이', year: '918', hook: 'She is killed with the thing she cooks with.' },
							{ title: 'Behind the Curtain', ko: '휘장 뒤', year: '918', hook: 'Cheorwon. The gate is open. He is the one who can shut it.' },
							{ title: 'Lady Yu', ko: '유 부인', year: '918', hook: 'She puts the armor on him.', outline: 'Behind the Curtain' },
							{ title: 'Barley', ko: '보리', year: '918', hook: 'The north gate. He hears the drums and goes out in the dark.' }
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
		years: '918–943',
		arcs: [
			{
				id: 'rise-books',
				title: 'The Rise of Goryeo',
				ko: '고려의 일어남',
				volumes: [
					{
						id: 'rm-yu-gum-pil',
						title: 'Yu Gum-pil, the Iron Shield',
						ko: '유금필',
						spine: '#4f7a3a',
						blurb: {
							en: 'He charges before the other line has finished forming, and the town that was supposed to open stays shut.',
							ko: '상대가 진을 끝내기 전에 돌격하고, 열려야 할 읍은 닫힌 채다.'
						},
						episodes: [
							{ title: 'Unju', ko: '운주', year: '934', hook: 'The charge. He goes before the other line has finished forming.' },
							{ title: 'The Letters', ko: '편지', year: '929', hook: 'Two letters. One of them is a trap of a different kind.' },
							{ title: 'Gochang', ko: '고창', year: '930', hook: 'The town holds. The war does not end.' }
						]
					},
					{
						id: 'rm-sin-sung-gyum',
						title: 'Sin Sung-gyum, the Crimson Shadow',
						ko: '신숭겸',
						spine: '#7a2430',
						blurb: {
							en: 'Same height, same shoulders. He puts on the king’s armor and does not come back.',
							ko: '키도 어깨도 같다. 왕의 갑옷을 입고 돌아오지 않는다.'
						},
						episodes: [
							{ title: 'Poseokjeong', ko: '포석정', year: '927', hook: 'Silla’s king is at a party. Kyun Hwon is already on the road.' },
							{ title: 'Gongsan', ko: '공산', year: '927', hook: 'The trap closes. Someone has to wear the king’s armor.' },
							{ title: 'The Armor', ko: '갑옷', year: '927', hook: 'Sin Sung-gyeom puts it on.', outline: 'Gongsan' }
						]
					},
					{
						id: 'rm-dae-gwang-hyun',
						title: 'Dae Gwang-hyun, the Northern Prince',
						ko: '대광현',
						spine: '#2f4f6f',
						blurb: {
							en: 'Balhae falls. A prince comes south with the people who still say the old name.',
							ko: '발해가 무너진다. 옛 이름을 아직 말하는 사람들과 왕자가 남으로 온다.'
						},
						episodes: [
							{ title: 'Hostages', ko: '인질', year: '920', hook: 'He takes their sons and calls it peace.' },
							{ title: 'The Northern King', ko: '북방의 왕', year: '926', hook: 'Balhae falls. The king comes south.' },
							{ title: 'Jochamul', ko: '조참물', year: '926', hook: 'A cousin dies on a mission Wang Geon sent.', outline: 'The Northern King' },
							{ title: 'The Dead Nephew', ko: '죽은 조카', year: '926', hook: 'He keeps the grief and does not spend it yet.', outline: 'The Northern King' },
							{ title: 'Khitan Snow', ko: '거란의 눈', year: '926', hook: 'Snow, and the people walking out of a fallen country.' }
						]
					},
					{
						id: 'rm-kyun-sin-gum',
						title: 'Kyun Sin-gum, the Divine Sword',
						ko: '견신검',
						spine: '#a6842a',
						blurb: {
							en: 'The eldest. He watches the favorite take the cushion, bars the gate, and meets the river.',
							ko: '맏이. 총애가 방석을 받는 것을 보고, 문을 걸어 잠그고, 강을 만난다.'
						},
						episodes: [
							{ title: 'The Cushion', ko: '방석', year: '934', hook: 'Gumgang gets the seat. The eldest sees it.', outline: 'Unju' },
							{ title: 'The Eldest', ko: '맏이', year: '935', hook: 'He starts counting his brothers.', outline: 'Geumsansa' },
							{ title: 'The Bar', ko: '빗장', year: '935', hook: 'The temple door. He is the one holding it.', outline: 'Geumsansa' },
							{ title: 'The Walk', ko: '걸어 나감', year: '935', hook: 'Nungye and Aebok walk out. They do not come back.', outline: 'Geumsansa' },
							{ title: 'Five Brothers', ko: '오형제', year: '935', hook: 'Yanggum, Yonggum, Gumgang, the youngest, and the man at the gate.', outline: 'Geumsansa' },
							{ title: 'Geumsansa', ko: '금산사', year: '935', hook: 'The hand on the door. The youngest is already at his shoulder.' },
							{ title: 'The Sons', ko: '아들들', year: '935', hook: 'What is left of the five, after the door.', outline: 'Geumsansa' },
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
						blurb: {
							en: 'A merchant’s son who takes the name, calls his enemy father, and writes ten things down before he dies.',
							ko: '이름을 가져가고, 적을 상부라 부르고, 죽기 전에 열 가지를 적는 장사치의 아들.'
						},
						episodes: [
							{ title: 'The Sea God', ko: '해신', year: '828', hook: 'Jang Bogo’s island, before any of these men are born.', flashback: true },
							{ title: 'The Chair', ko: '의자', year: '846', hook: 'A chair, and a murder that teaches the house what a throne costs.', flashback: true, outline: 'The Sea God' },
							{ title: 'Doseon', ko: '도선', year: '896', hook: 'A monk looks at the ground and tells them where to build.', outline: 'Songak' },
							{ title: 'Songak', ko: '송악', year: '896', hook: 'The boy is nineteen. The mountain already has his name on it.' },
							{ title: 'The Willow Leaf', ko: '버들잎', year: '904', hook: 'A willow leaf, and the first time the admiral is sent south.' },
							{ title: 'Naju', ko: '나주', year: '903', hook: 'The admiral takes the port and keeps it.', outline: 'The Willow Leaf' },
							{ title: 'Goryeo', ko: '고려', year: '918', hook: 'He stops wearing a dead kingdom and starts one.' },
							{ title: 'Sangbu', ko: '상부', year: '935', hook: 'The shore. He calls the enemy father.', outline: 'Geumsansa' },
							{ title: 'Hemp', ko: '베옷', year: '935', hook: 'Silla’s prince walks in wearing hemp.' },
							{ title: 'The Camels', ko: '낙타', year: '942', hook: 'A gift from the north. He takes it badly.', outline: 'Manbu Bridge' },
							{ title: 'Manbu Bridge', ko: '만부교', year: '942', hook: 'The bridge, and the insult he will not swallow.' },
							{ title: 'Ten Injunctions', ko: '훈요십조', year: '943', hook: 'He writes ten things down and dies.' },
							{ title: 'Tamla', ko: '탐라', year: '938', hook: 'The island comes in. The map is finished.', outline: 'Ten Injunctions' }
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
