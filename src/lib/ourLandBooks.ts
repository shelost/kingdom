/**
 * Breaking. One row, three books. A book is the stretch, named for what
 * is moving in it, not for one biography.
 *
 * Reform, 1876–1884: the ports, the party, the weekend.
 * Revolution, 1884–1897: the counties, the same spring as Shanghai, the war.
 * Resistance, 1897–1910: the crown, the club, the seal.
 *
 * March First and the government in Shanghai are the next series.
 */
import { buildStoryShelf, type StoryPartSrc } from './storyShelf';

const KNOWN = new Set([
	'Ganghwa',
	'Our Party',
	'The Split',
	'The Post Office',
	'Fourteen Points',
	'Three Days',
	'Nine Names',
	'The Years',
	'The Petitions',
	'Gobu',
	'Shanghai',
	'Two Armies',
	'Gabo',
	'Eulmi',
	'The Mob',
	'The Independent',
	'Gwangmu',
	'The Club',
	'Eulsa',
	'The Hague',
	'Harbin',
	'The Seal'
]);

const PARTS_SRC: StoryPartSrc[] = [
	{
		id: 'land',
		title: 'Breaking',
		ko: '대한사람',
		years: '1876–1910',
		arcs: [
			{
				id: 'land',
				title: 'Breaking',
				ko: '대한사람',
				volumes: [
					{
						id: 'ol-gapsin',
						title: 'Reform',
						ko: '개화',
						spine: '#c1b2a2',
						years: '1876–1884',
						blurb: {
							en: 'The ports open. A handful of readers call themselves a party. They get one weekend.',
							ko: '항구가 열린다. 읽던 몇이 스스로를 당이라 부른다. 그들에게 주어진 것은 주말 하나다.'
						},
						episodes: [
							{ title: 'Ganghwa', ko: '강화', year: '1876', hook: 'February. A treaty at the island. The country is no longer closed, and a desk in Seoul already has the new maps on it.' },
							{ title: 'Our Party', ko: '오당', year: '1881', hook: 'Kim Ok-gyun’s word, which he dates to about 1874. The sightseeing group goes to see a country that already opened.' },
							{ title: 'The Split', ko: '임오', year: '1882', hook: 'Imo puts Chinese troops in the palace. The gradualists stay. The radicals decide China is the obstacle.' },
							{ title: 'The Post Office', ko: '우정국', year: '1884', hook: 'December 4, solar. Hong Yeong-sik’s banquet. Half the Chinese garrison is away at the Sino-French war.' },
							{ title: 'Fourteen Points', ko: '십사조', year: '1884', hook: 'End the tribute. One treasury. A king who shares the government. They publish it on the second day.' },
							{ title: 'Three Days', ko: '삼일', year: '1884', hook: 'Yuan Shikai comes back with the garrison. Hong Yeong-sik and Park Yeong-gyo are killed.' },
							{ title: 'Nine Names', ko: '구명', year: '1884', hook: 'Kim Ok-gyun, Park Yeong-hyo, Seo Gwang-beom, Seo Jae-pil, and five others make the boat at Incheon.' }
						]
					},
					{
						id: 'ol-donghak',
						title: 'Revolution',
						ko: '혁명',
						spine: '#c1b2a2',
						years: '1884–1897',
						blurb: {
							en: 'The party is nine guests. The counties already have a teaching. In one spring the leader is shot and Gobu rises.',
							ko: '당은 객 아홉이다. 고을에는 이미 가르침이 있다. 한 봄에 우두머리가 총에 맞고 고부가 일어난다.'
						},
						episodes: [
							{ title: 'The Years', ko: '일본', year: '1885', hook: 'Japan keeps the nine and does not bring them back. In the counties the teaching is still a crime.' },
							{ title: 'The Petitions', ko: '신원', year: '1893', hook: 'They walk to clear Choe Je-u’s name. Samnye, then the palace road. It is not a war yet.' },
							{ title: 'Gobu', ko: '고부', year: '1894', hook: 'Jeon Bong-jun rises at the county. The first march takes Jeonju, and then there is a truce.' },
							{ title: 'Shanghai', ko: '상하이', year: '1894', hook: 'The same spring, Hong Jong-u shoots Kim Ok-gyun. The corpse is returned, quartered, and shown.' },
							{ title: 'Two Armies', ko: '청일', year: '1894', hook: 'China comes for the peasants. Japan comes for China. The second rising breaks at Ugeumchi.' },
							{ title: 'Gabo', ko: '갑오', year: '1894', hook: 'Kim Hong-jip and Eo Yun-jung pass the program the radicals died for, under Japanese guns. In the spring Jeon is executed.' },
							{ title: 'Eulmi', ko: '을미', year: '1895', hook: 'October 8. Queen Min is killed in the palace. Japanese legation men are in the room.' },
							{ title: 'The Mob', ko: '김홍집', year: '1896', hook: 'February. The king runs to the Russian legation. Kim Hong-jip, the moderate who stayed, is killed in the street.' },
							{ title: 'The Independent', ko: '독립신문', year: '1896', hook: 'April. Seo Jae-pil comes home and prints a paper in hangul. The party’s second life is legal, and it is not an empire yet.' }
						]
					},
					{
						id: 'ol-empire',
						title: 'Resistance',
						ko: '투쟁',
						spine: '#c1b2a2',
						years: '1897–1910',
						blurb: {
							en: 'He leaves the legation and calls it an empire. The club is closed, five ministers sign, and the seal goes on the annexation.',
							ko: '공사관을 나와 제국이라 부른다. 협회는 닫히고, 대신 다섯이 서명하고, 옥새가 병합에 찍힌다.'
						},
						episodes: [
							{ title: 'Gwangmu', ko: '광무', year: '1897', hook: 'October. Out of the Russian legation, he calls the country an empire. Independence, with a crown on it.' },
							{ title: 'The Club', ko: '독립협회', year: '1898', hook: 'Independence Gate is already up. By the end of the year the club is dissolved. Yun Chi-ho stays. The paper does not.' },
							{ title: 'Eulsa', ko: '을사', year: '1905', hook: 'November. Five ministers sign the protectorate. Min Yeong-hwan dies in protest. Ito arrives.' },
							{ title: 'The Hague', ko: '헤이그', year: '1907', hook: 'The envoys fail. In July he is forced off the throne. In August the army is disbanded.' },
							{ title: 'Harbin', ko: '하얼빈', year: '1909', hook: 'October 26. An Jung-geun shoots Ito on the platform. He says it was for the peace of the East.' },
							{ title: 'The Seal', ko: '옥새', year: '1910', hook: 'August. The army is already gone. The Hague already failed. The seal goes on the annexation.' }
						]
					}
				]
			}
		]
	}
];

export const { parts: OURLAND_PARTS, volumes: OURLAND_VOLUMES, rows: OURLAND_ROWS } = buildStoryShelf({
	shelf: 'ourland',
	story: '/stories/our-land',
	known: KNOWN,
	parts: PARTS_SRC
});
