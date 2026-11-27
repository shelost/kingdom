/**
 * Seed. One row, one book: the life of Ham Seok-heon, 1901–1989.
 * Korean title is 씨알소리, the shorter name of his magazine 씨알의 소리.
 * English is Seed.
 */
import { buildStoryShelf, type StoryPartSrc } from './storyShelf';

const KNOWN = new Set([
	'Yongcheon',
	'The Refusal',
	'Osan',
	'The Non-Church',
	'The History',
	'The Frog',
	'South',
	'A Thinking People',
	"The Seed's Voice",
	'The Hall'
]);

const PARTS_SRC: StoryPartSrc[] = [
	{
		id: 'seed',
		title: 'Seed',
		ko: '씨알소리',
		years: '1901–1989',
		arcs: [
			{
				id: 'life',
				title: 'Seed',
				ko: '씨알소리',
				volumes: [
					{
						id: 'ss-seed',
						title: 'Seed',
						ko: '씨알소리',
						spine: '#4a5c3e',
						years: '1901–1989',
						blurb: {
							en: 'A boy in Yongcheon who will not write the apology, and the magazine he names for the seed.',
							ko: '사과문을 쓰지 않은 용천의 아이, 그리고 그가 씨알이라 이름 붙인 잡지.'
						},
						episodes: [
							{ title: 'Yongcheon', ko: '용천', year: '1901', hook: 'March 13. Yongcheon, North Pyongan. Ham Hyeong-taek and Kim Hyeong-do. A village school before any of the later names.' },
							{ title: 'The Refusal', ko: '퇴학', year: '1919', hook: 'Third year at the higher school in Pyongyang. He joins March 1. The principal offers the desk back for a written apology. He does not write it.' },
							{ title: 'Osan', ko: '오산', year: '1921', hook: 'Jeongju. He enters in the third year. Ryu Yeong-mo becomes the teacher he keeps. He graduates in 1923.' },
							{ title: 'The Non-Church', ko: '무교회', year: '1924', hook: 'Tokyo Higher Normal. Uchimura Kanzo’s Bible study. With Kim Gyo-sin he starts Seongseo Joseon in 1927, and comes home to teach in 1928.' },
							{ title: 'The History', ko: '조선역사', year: '1934', hook: 'He serializes a history of this country from the Bible’s side. In March 1938 he leaves Osan rather than take a Japanese name.' },
							{ title: 'The Frog', ko: '조와', year: '1942', hook: 'A year at the Daedong station in 1940. In March, Kim Gyo-sin’s elegy for a frog closes the magazine. Another year in Seodaemun.' },
							{ title: 'South', ko: '월남', year: '1947', hook: 'September 1945 he sits the education seat in the north. March 17, 1947, he comes south. The war takes the lectures to a tent in Busan.' },
							{ title: 'A Thinking People', ko: '생각', year: '1958', hook: 'Sasanggye prints the sentence: a thinking people is the one that lives. In 1961 he writes how to look at May 16. In 1962 he meets the Friends.' },
							{ title: "The Seed's Voice", ko: '씨알', year: '1970', hook: 'April 19. The magazine is Ssial ui sori, the seed’s voice. They close it, a court gives it back, and in 1980 the new junta closes it again.' },
							{ title: 'The Hall', ko: '강당', year: '1989', hook: 'February 4, Seoul National University Hospital. The funeral is at Osan on the 8th. The hundredth issue, in April, still carries his name.' }
						]
					}
				]
			}
		]
	}
];

export const { parts: SEED_PARTS, volumes: SEED_VOLUMES, rows: SEED_ROWS } = buildStoryShelf({
	shelf: 'seed',
	story: '/stories/small-seed',
	known: KNOWN,
	parts: PARTS_SRC
});
