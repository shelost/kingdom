/**
 * Our Land shelf. One row, five books, following the Gaehwapa: the secret
 * party, the three days of Gapsin, the exile and Kim Ok-gyun's murder, the
 * war that enacts their program without them, and the empire down to the
 * annexation. March First and the Provisional Government are the last two
 * episodes, not a sixth book.
 */
import { buildStoryShelf, type StoryPartSrc } from './storyShelf';

const KNOWN = new Set([
	'The New Books',
	'Our Party',
	'The Split',
	'The Post Office',
	'Fourteen Points',
	'Three Days',
	'Nine Names',
	'The Years',
	'Shanghai',
	'Gobu',
	'Two Armies',
	'Gabo',
	'Eulmi',
	'The Mob',
	'The Independent',
	'The Club',
	'Gwangmu',
	'Eulsa',
	'The Seal',
	'March First',
	'The Provisional Government'
]);

const PARTS_SRC: StoryPartSrc[] = [
	{
		id: 'land',
		title: 'Our Land',
		ko: '대한사람',
		years: '1874–1919',
		arcs: [
			{
				id: 'party',
				title: 'The party',
				ko: '개화당',
				volumes: [
					{
						id: 'ol-party',
						title: 'The Party',
						ko: '개화당',
						spine: '#2a3a4a',
						blurb: {
							en: 'Park Gyu-su’s students, and the word Kim Ok-gyun uses for them: our party.',
							ko: '박규수의 제자들. 김옥균이 그들을 부르는 말은 오당이다.'
						},
						episodes: [
							{ title: 'The New Books', ko: '신서', year: '1871', hook: 'Park Gyu-su, Oh Gyeong-seok, Yu Dae-chi. Haiguo tuzhi on a desk in Seoul.' },
							{ title: 'Our Party', ko: '오당', year: '1874', hook: 'Kim Ok-gyun’s own dating. A handful of men, no office, and a plan to stop being a tributary.' },
							{ title: 'The Split', ko: '임오', year: '1882', hook: 'Imo puts Chinese troops in the palace. The gradualists stay. The radicals decide China is the obstacle.' }
						]
					},
					{
						id: 'ol-days',
						title: 'Three Days',
						ko: '갑신',
						spine: '#8f3a2a',
						blurb: {
							en: 'December 4, 1884. A banquet, a program, and a weekend.',
							ko: '1884년 12월 4일. 연회와 강령, 그리고 주말 하나.'
						},
						episodes: [
							{ title: 'The Post Office', ko: '우정국', year: '1884', hook: 'Hong Yeong-sik’s banquet. Half the Chinese garrison is away at the Sino-French war.' },
							{ title: 'Fourteen Points', ko: '십사조', year: '1884', hook: 'End the tribute. One treasury. A king who shares the government. They publish it on the second day.' },
							{ title: 'Three Days', ko: '삼일', year: '1884', hook: 'Yuan Shikai comes back with the garrison. Hong Yeong-sik and Park Yeong-gyo are killed.' },
							{ title: 'Nine Names', ko: '구명', year: '1884', hook: 'Kim Ok-gyun, Park Yeong-hyo, Seo Gwang-beom, Seo Jae-pil, and five others make the boat at Incheon.' }
						]
					},
					{
						id: 'ol-exile',
						title: 'Shanghai',
						ko: '상하이',
						spine: '#4a3a2a',
						blurb: {
							en: 'Ten years as guests, and then the body comes home in pieces.',
							ko: '십 년을 객으로 살다, 시신이 토막으로 돌아온다.'
						},
						episodes: [
							{ title: 'The Years', ko: '일본', year: '1885', hook: 'Japan keeps them and does not bring them back. The party is nine people and a memory.' },
							{ title: 'Shanghai', ko: '상하이', year: '1894', hook: 'Hong Jong-u shoots Kim Ok-gyun. The corpse is returned, quartered, and shown.' },
							{ title: 'Gobu', ko: '고부', year: '1894', hook: 'The same spring, Jeon Bong-jun rises. The radicals are dead or abroad. The country moves without them.' }
						]
					}
				]
			},
			{
				id: 'empire',
				title: 'The empire',
				ko: '대한',
				volumes: [
					{
						id: 'ol-war',
						title: 'The War',
						ko: '청일',
						spine: '#6a3030',
						blurb: {
							en: 'Qing and Japan fight the war in Korea. The moderates get the reforms, and then the street.',
							ko: '청과 일이 조선 땅에서 싸운다. 온건파는 개혁을 얻고, 거리를 얻는다.'
						},
						episodes: [
							{ title: 'Two Armies', ko: '청일', year: '1894', hook: 'China comes for the peasants. Japan comes for China. The war is fought on this peninsula.' },
							{ title: 'Gabo', ko: '갑오', year: '1894', hook: 'Kim Hong-jip and Eo Yun-jung pass the program the radicals died for, under Japanese guns.' },
							{ title: 'Eulmi', ko: '을미', year: '1895', hook: 'Queen Min is killed in the palace. Japanese legation men are in the room. Who in Tokyo ordered it stays argued.' },
							{ title: 'The Mob', ko: '김홍집', year: '1896', hook: 'The king runs to the Russian legation. The moderate who stayed, Kim Hong-jip, is killed in the street.' }
						]
					},
					{
						id: 'ol-daehan',
						title: 'Daehan',
						ko: '대한',
						spine: '#8a7040',
						blurb: {
							en: 'A public party, an empire, a seal, and two short years that outlive the annexation.',
							ko: '공개된 당, 제국, 옥새, 그리고 병합을 넘기는 짧은 두 해.'
						},
						episodes: [
							{ title: 'The Independent', ko: '독립신문', year: '1896', hook: 'Seo Jae-pil comes home and prints a paper in hangul. The party’s second life is legal, and brief.' },
							{ title: 'Gwangmu', ko: '광무', year: '1897', hook: 'Gojong leaves the legation and calls it an empire. Independence, with a crown on it.' },
							{ title: 'The Club', ko: '독립협회', year: '1898', hook: 'Independence Gate, then the club is dissolved. Yun Chi-ho stays. The paper does not.' },
							{ title: 'Eulsa', ko: '을사', year: '1905', hook: 'Five ministers sign the protectorate. Min Yeong-hwan dies in protest. Ito arrives.' },
							{ title: 'The Seal', ko: '옥새', year: '1910', hook: 'The army is already gone. The Hague envoys already failed. The seal goes on the annexation.' },
							{ title: 'March First', ko: '삼일', year: '1919', hook: 'A declaration, read in a park. The country answers. This is the epilogue, not a new party.' },
							{ title: 'The Provisional Government', ko: '임시정부', year: '1919', hook: 'April, Shanghai. A government with no country yet. Syngman Rhee is its first head. The reformists’ heirs, not the same men.' }
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
