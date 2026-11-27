/**
 * Guhanmal factions for Breaking (대한사람), 1876–1910.
 * The reform party is the radical wing. The Club is its legal second life.
 * Wijeong Cheoksa is a teaching, not the Daewongun, and not Donghak.
 */

export type FactionId =
	| 'throne'
	| 'gaehwa'
	| 'gradual'
	| 'club'
	| 'cheoksa'
	| 'donghak'
	| 'sadae'
	| 'uibyeong'
	| 'iljin';

export interface Faction {
	id: FactionId;
	en: string;
	ko: string;
	hanja: string;
	alsoEn: string;
	alsoKo: string;
	years: string;
	hex: string;
	wantEn: string;
	wantKo: string;
	people: { en: string; ko: string }[];
}

export interface Bond {
	a: FactionId;
	b: FactionId;
	en: string;
	ko: string;
}

export interface Mark {
	id: string;
	year: number;
	faction: FactionId;
	en: string;
	ko: string;
}

export const START = 1876;
export const END = 1910;

export const FACTIONS: Faction[] = [
	{
		id: 'throne',
		en: 'The throne',
		ko: '옥좌',
		hanja: '高宗',
		alsoEn: 'Gojong, the building',
		alsoKo: '고종',
		years: '1876–1910',
		hex: '#d8b26a',
		wantEn: 'To still be king in the morning, whichever army is in the courtyard.',
		wantKo: '마당에 어느 군대가 있든, 아침에도 왕이고 싶다.',
		people: [{ en: 'Gojong', ko: '고종' }]
	},
	{
		id: 'gaehwa',
		en: 'Gaehwadang',
		ko: '개화당',
		hanja: '開化黨',
		alsoEn: 'Reform party',
		alsoKo: '급진개화파',
		years: 'c. 1874–1884',
		hex: '#c45a3a',
		wantEn: 'End the tribute. A king who shares the government. In their lifetime, and in 1884 the lever is the Japanese legation.',
		wantKo: '조공을 끊고, 왕이 정사를 나눈다. 살아 있는 동안. 1884년의 지렛대는 일본 공사관이다.',
		people: [
			{ en: 'Kim Ok-gyun', ko: '김옥균' },
			{ en: 'Park Yeong-hyo', ko: '박영효' },
			{ en: 'Hong Yeong-sik', ko: '홍영식' },
			{ en: 'Seo Gwang-beom', ko: '서광범' },
			{ en: 'Seo Jae-pil', ko: '서재필' }
		]
	},
	{
		id: 'gradual',
		en: 'Gradualists',
		ko: '온건개화파',
		hanja: '穩健開化派',
		alsoEn: 'The wing that waits',
		alsoKo: '법령으로',
		years: '1882–1896',
		hex: '#c4a35a',
		wantEn: 'The same reforms, slower, without taking the palace. Gabo is that list, under Japanese guns. Kim Hong-jip dies in the street.',
		wantKo: '같은 개혁을, 궁을 빼앗지 않고, 법령으로. 갑오가 그 목록이다. 일본 총 아래에서. 김홍집은 거리에서 죽는다.',
		people: [
			{ en: 'Kim Hong-jip', ko: '김홍집' },
			{ en: 'Eo Yun-jung', ko: '어윤중' },
			{ en: 'Kim Yun-sik', ko: '김윤식' }
		]
	},
	{
		id: 'club',
		en: 'Independence Club',
		ko: '독립협회',
		hanja: '獨立協會',
		alsoEn: 'The paper, then the gate',
		alsoKo: '독립신문',
		years: '1896–1898',
		hex: '#3d6b8a',
		wantEn: 'The same reform, said in hangul, in a room the country can enter. Two years. Then the court closes it.',
		wantKo: '같은 개혁을 한글로, 나라가 들어올 수 있는 방에서. 두 해. 그리고 조정이 닫는다.',
		people: [
			{ en: 'Seo Jae-pil', ko: '서재필' },
			{ en: 'Yun Chi-ho', ko: '윤치호' }
		]
	},
	{
		id: 'cheoksa',
		en: 'Wijeong Cheoksa',
		ko: '위정척사',
		hanja: '衛正斥邪',
		alsoEn: 'Traditionalists',
		alsoKo: '정학을 지킨다',
		years: '1876–1906',
		hex: '#8a7040',
		wantEn: 'Defend the Confucian order. Reject Catholicism, then Western learning, then a reform that arrives with foreign guns. Donghak is heresy to them too.',
		wantKo: '유학의 질서를 지킨다. 가톨릭, 그 다음 서학, 그 다음 외국 총으로 들어오는 개혁을 배척한다. 동학도 그들에게는 사학이다.',
		people: [
			{ en: 'Choe Ik-hyeon', ko: '최익현' },
			{ en: 'Yu In-seok', ko: '유인석' },
			{ en: 'Yi Hang-no’s school', ko: '이항로의 화서' }
		]
	},
	{
		id: 'donghak',
		en: 'Donghak',
		ko: '동학',
		hanja: '東學',
		alsoEn: 'The counties',
		alsoKo: '고을',
		years: '1893–1895',
		hex: '#6a8a4a',
		wantEn: 'The magistrate, the grain, and a dead teacher’s name. Not the party’s fourteen points. The party is not in the ranks.',
		wantKo: '수령과 곡식, 그리고 죽은 스승의 이름. 십사조가 아니다. 당은 대열에 없다.',
		people: [
			{ en: 'Jeon Bong-jun', ko: '전봉준' },
			{ en: 'Choe Je-u, executed 1864', ko: '최제우, 1864년 처형' }
		]
	},
	{
		id: 'sadae',
		en: 'Sadae and the Mins',
		ko: '사대와 민씨',
		hanja: '事大',
		alsoEn: 'Qing as the balance',
		alsoKo: '청을 저울로',
		years: '1882–1895',
		hex: '#8a3a4a',
		wantEn: 'Hold the palace with Qing, against Japan and against the Daewongun. The radicals announce themselves by killing these ministers.',
		wantKo: '청으로 궁을 지킨다. 일본을 막고, 대원군을 막는다. 급진파는 이 대신들을 죽이며 스스로를 알린다.',
		people: [
			{ en: 'Queen Min', ko: '민비' },
			{ en: 'The ministers at the banquet', ko: '연회의 대신들' }
		]
	},
	{
		id: 'uibyeong',
		en: 'Righteous armies',
		ko: '의병',
		hanja: '義兵',
		alsoEn: 'The hills',
		alsoKo: '산',
		years: '1895–1910',
		hex: '#3a5a48',
		wantEn: 'First the scholars, after the queen is killed. After 1907, the disbanded soldiers too. The Club is already gone.',
		wantKo: '처음에는 유생이다. 왕비가 죽은 뒤. 1907년 이후에는 해산된 군인까지. 협회는 이미 없다.',
		people: [
			{ en: 'Yu In-seok', ko: '유인석' },
			{ en: 'Choe Ik-hyeon', ko: '최익현' }
		]
	},
	{
		id: 'iljin',
		en: 'Iljinhoe',
		ko: '일진회',
		hanja: '一進會',
		alsoEn: 'The other remnant',
		alsoKo: '동학의 다른 쪽',
		years: '1904–1910',
		hex: '#6a4038',
		wantEn: 'A piece of Donghak that sides with Japan. In 1909 they ask for the annexation the cabinet signs the next year.',
		wantKo: '동학의 한 조각이 일본 쪽으로 간다. 1909년 그들은 병합을 청하고, 내각이 이듬해 서명한다.',
		people: [
			{ en: 'Song Byeong-jun', ko: '송병준' },
			{ en: 'Yi Yong-gu', ko: '이용구' }
		]
	}
];

export const FAMILIES: { id: 'reform' | 'orthodoxy'; en: string; ko: string; ids: FactionId[] }[] = [
	{ id: 'reform', en: 'Reform', ko: '개화', ids: ['gaehwa', 'gradual', 'sadae', 'club'] },
	{ id: 'orthodoxy', en: 'Orthodoxy and the counties', ko: '척사와 고을', ids: ['cheoksa', 'uibyeong', 'donghak', 'iljin'] }
];

export const BONDS: Bond[] = [
	{
		a: 'gaehwa',
		b: 'gradual',
		en: '1882. Imo fills the palace with Chinese troops. One wing waits. One wing will not.',
		ko: '1882, 임오. 궁에 청군이 들어찬다. 한쪽은 기다리고, 한쪽은 기다리지 않는다.'
	},
	{
		a: 'gaehwa',
		b: 'sadae',
		en: '1884. The banquet kills the senior sadae ministers. That is the party announcing itself.',
		ko: '1884. 연회가 사대 대신들을 죽인다. 당은 그렇게 스스로를 알린다.'
	},
	{
		a: 'gaehwa',
		b: 'club',
		en: 'Seo Jae-pil is on the boat in 1884 and at the press in 1896. Most of the Club was never on the boat.',
		ko: '서재필은 1884년 배에 있고 1896년 인쇄기 앞에 있다. 협회의 대부분은 그 배에 탄 적이 없다.'
	},
	{
		a: 'cheoksa',
		b: 'gaehwa',
		en: 'The same treaty. One side calls it the disease. The other calls it the door.',
		ko: '같은 조약이다. 한쪽은 병이라 하고, 한쪽은 문이라 한다.'
	},
	{
		a: 'cheoksa',
		b: 'donghak',
		en: 'Both stand outside the new learning. The scholars still call the teaching heresy.',
		ko: '둘 다 새 학문 밖에 있다. 유생은 그 가르침을 그래도 사학이라 부른다.'
	},
	{
		a: 'cheoksa',
		b: 'uibyeong',
		en: '1895. The memorial becomes a camp. After Eulsa, Choe Ik-hyeon himself takes the hills and dies a prisoner at Tsushima.',
		ko: '1895. 상소가 진영이 된다. 을사 뒤 최익현이 직접 산에 올랐다가 대마도에서 죽는다.'
	},
	{
		a: 'gaehwa',
		b: 'donghak',
		en: '1894. They never meet. Kim Ok-gyun is shot in Shanghai. Gobu rises. One spring.',
		ko: '1894. 만나지 않는다. 김옥균은 상하이에서 총에 맞고, 고부가 일어난다. 한 봄이다.'
	},
	{
		a: 'gradual',
		b: 'gaehwa',
		en: 'Gabo is the fourteen points in the moderates’ hands.',
		ko: '갑오는 온건파의 손에 들린 십사조다.'
	},
	{
		a: 'donghak',
		b: 'iljin',
		en: 'After the war the teaching splits. One piece asks for the annexation. The other takes the name Cheondogyo in 1905. That half waits for the next book.',
		ko: '전쟁 뒤 가르침이 갈라진다. 한쪽은 병합을 청한다. 한쪽은 1905년 천도교가 된다. 그 절반은 다음 책을 기다린다.'
	},
	{
		a: 'club',
		b: 'throne',
		en: '1898. He lets the Imperial Association break the meetings. The Club is dissolved at the end of the year.',
		ko: '1898. 그는 황국협회가 집회를 부수게 둔다. 협회는 그해 끝에 해산된다.'
	},
	{
		a: 'throne',
		b: 'gaehwa',
		en: 'He is the prize of the three days. They move him under a different guard and call it a government.',
		ko: '그는 사흘의 전리품이다. 그들은 그를 다른 호위 아래로 옮기고 정부라 부른다.'
	},
	{
		a: 'throne',
		b: 'sadae',
		en: 'The Mins hold the palace with Qing until the queen is killed.',
		ko: '민씨는 왕비가 죽을 때까지 청과 함께 궁을 쥔다.'
	}
];

export const MARKS: Mark[] = [
	{ id: 'ganghwa', year: 1876, faction: 'gaehwa', en: 'Ganghwa. The ports open. The new maps are already on a desk.', ko: '강화. 항구가 열린다. 새 지도는 이미 책상 위에 있다.' },
	{ id: 'memorial', year: 1876, faction: 'cheoksa', en: 'Choe Ik-hyeon memorializes against the treaty, and is exiled for it.', ko: '최익현이 조약에 반대하는 상소를 올리고, 유배된다.' },
	{ id: 'party', year: 1881, faction: 'gaehwa', en: 'Kim Ok-gyun’s word, which he dates to about 1874. They go to look at Japan.', ko: '김옥균의 말. 그는 당을 1874년쯤으로 잡는다. 일본을 보러 간다.' },
	{ id: 'imo-split', year: 1882, faction: 'gradual', en: 'Imo. They stay. China is not yet the obstacle they are willing to shoot.', ko: '임오. 그들은 남는다. 청은 아직 총을 들 장애물이 아니다.' },
	{ id: 'imo-qing', year: 1882, faction: 'sadae', en: 'Chinese troops sit in the palace. The Daewongun is taken to China.', ko: '청군이 궁에 앉는다. 대원군은 청으로 끌려간다.' },
	{ id: 'gapsin', year: 1884, faction: 'gaehwa', en: 'December 4, solar. Three days. Hong Yeong-sik and Park Yeong-gyo are killed.', ko: '양력 12월 4일. 사흘. 홍영식과 박영교가 죽는다.' },
	{ id: 'banquet', year: 1884, faction: 'sadae', en: 'The senior ministers die at the banquet. The party has announced itself.', ko: '고위 대신들이 연회에서 죽는다. 당은 스스로를 알렸다.' },
	{ id: 'boat', year: 1884, faction: 'gaehwa', en: 'Nine reach the boat at Incheon. Seo Jae-pil is one of them. The Club is twelve years away.', ko: '아홉이 인천의 배에 닿는다. 서재필도 그 안이다. 협회까지는 열두 해다.' },
	{ id: 'petitions', year: 1893, faction: 'donghak', en: 'They walk to clear Choe Je-u’s name. It is not a war yet.', ko: '최제우의 이름을 벗기려 걸어간다. 아직 전쟁은 아니다.' },
	{ id: 'gobu', year: 1894, faction: 'donghak', en: 'Gobu, then Jeonju, then the second rising breaks at Ugeumchi.', ko: '고부, 그리고 전주, 그리고 두 번째 봉기는 우금치에서 깨진다.' },
	{ id: 'shanghai', year: 1894, faction: 'gaehwa', en: 'The same spring. Hong Jong-u shoots Kim Ok-gyun in Shanghai. The body is sent home and shown.', ko: '같은 봄. 홍종우가 상하이에서 김옥균을 쏜다. 시신은 돌아와 보여진다.' },
	{ id: 'gabo', year: 1894, faction: 'gradual', en: 'Kim Hong-jip and Eo Yun-jung pass the program the radicals died printing.', ko: '김홍집과 어윤중이, 급진파가 죽으며 인쇄한 강령을 통과시킨다.' },
	{ id: 'jeon', year: 1895, faction: 'donghak', en: 'In the spring, Jeon Bong-jun is executed.', ko: '봄에 전봉준이 처형된다.' },
	{ id: 'eulmi', year: 1895, faction: 'sadae', en: 'October 8. Queen Min is killed in the palace.', ko: '10월 8일. 민비가 궁에서 죽는다.' },
	{ id: 'eulmi-army', year: 1895, faction: 'uibyeong', en: 'Yu In-seok raises the Eulmi army. The teaching has gone to the hills.', ko: '유인석이 을미의병을 일으킨다. 가르침이 산으로 갔다.' },
	{ id: 'mob', year: 1896, faction: 'gradual', en: 'The same February. A mob kills Kim Hong-jip, the moderate who stayed.', ko: '같은 2월. 군중이 남은 온건파 김홍집을 죽인다.' },
	{ id: 'paper', year: 1896, faction: 'club', en: 'April, The Independent, in hangul. July, the Club. Yun Chi-ho chairs it after Seo is pushed out.', ko: '4월, 독립신문, 한글로. 7월, 협회. 서재필이 밀려난 뒤 윤치호가 맡는다.' },
	{ id: 'empire', year: 1897, faction: 'throne', en: 'October. Out of the legation, he calls it an empire. A crown on the word independence.', ko: '10월. 공사관을 나와 제국이라 부른다. 독립이라는 말 위의 왕관.' },
	{ id: 'russian', year: 1896, faction: 'throne', en: 'February. He runs to the Russian legation.', ko: '2월. 그는 러시아 공사관으로 간다.' },
	{ id: 'gate', year: 1897, faction: 'club', en: 'Independence Gate goes up. The Club is still meeting.', ko: '독립문이 선다. 협회는 아직 모인다.' },
	{ id: 'dissolved', year: 1898, faction: 'club', en: 'The end of the year. The Club is dissolved.', ko: '그해 끝. 협회가 해산된다.' },
	{ id: 'iljin-found', year: 1904, faction: 'iljin', en: 'Iljinhoe. The Donghak remnant that sides with Japan.', ko: '일진회. 일본 쪽으로 간 동학의 나머지.' },
	{ id: 'cheondogyo', year: 1905, faction: 'donghak', en: 'The other half takes the name Cheondogyo. March First is not this book.', ko: '다른 절반은 천도교가 된다. 삼일은 이 책이 아니다.' },
	{ id: 'eulsa', year: 1905, faction: 'uibyeong', en: 'November. The protectorate. The hills fill again. Choe Ik-hyeon rises, and dies a prisoner at Tsushima.', ko: '11월. 보호조약. 산이 다시 찬다. 최익현이 일어났다 대마도에서 죽는다.' },
	{ id: 'hague', year: 1907, faction: 'uibyeong', en: 'August. The army is disbanded, and the soldiers come up to the hills.', ko: '8월. 군대가 해산되고, 군인이 산으로 올라온다.' },
	{ id: 'ask', year: 1909, faction: 'iljin', en: 'They ask for the annexation.', ko: '그들이 병합을 청한다.' },
	{ id: 'abdicate', year: 1907, faction: 'throne', en: 'July. After The Hague, he is taken off the throne.', ko: '7월. 헤이그 뒤, 그가 자리에서 내려온다.' },
	{ id: 'seal', year: 1910, faction: 'throne', en: 'August. The seal goes on the annexation. Every lane on this page stops.', ko: '8월. 옥새가 병합에 찍힌다. 이 페이지의 모든 줄이 멈춘다.' }
];

export const CLASHES = [1876, 1882, 1884, 1894, 1895, 1896, 1898, 1905, 1907, 1910];

export const LANE_ORDER: FactionId[] = ['throne', 'sadae', 'gradual', 'gaehwa', 'club', 'cheoksa', 'uibyeong', 'donghak', 'iljin'];

export function factionById(id: FactionId): Faction {
	const found = FACTIONS.find((f) => f.id === id);
	if (!found) throw new Error(id);
	return found;
}

export function related(a: FactionId, b: FactionId): boolean {
	if (a === b) return true;
	return BONDS.some((bond) => (bond.a === a && bond.b === b) || (bond.a === b && bond.b === a));
}

/** Axis labels. The closer clash years stay as hairlines only. */
export const AXIS = [1876, 1884, 1894, 1905, 1910];

export function yearPct(year: number): number {
	const t = (year - START) / (END - START);
	return 4 + t * 92;
}
