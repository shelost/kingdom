import type { Episode, Outline, Person } from './types';

function ep(title: string, ko: string, year: string, hook: string, beats: string[], next: string): Episode {
	return { title, ko, year, hook, beats, next };
}

function who(p: Omit<Person, 'want' | 'voice' | 'line' | 'arc'> & Partial<Pick<Person, 'want' | 'voice' | 'line' | 'arc'>>): Person {
	return {
		want: p.want ?? '',
		voice: p.voice ?? '',
		line: p.line ?? '',
		arc: p.arc ?? '',
		...p
	};
}

export const smallSeed: Outline = {
	slug: 'small-seed',
	title: 'Seed',
	ko: '씨알소리',
	shelf: 'Samhan',
	badge: 'Ham Seok-heon',
	tagline: 'Ham Seok-heon, from a village school in Yongcheon to the hall at Osan',
	era: 'The empire’s last years, the colony, and the republic',
	years: '1901–1989',
	accent: '#4a5c3e',
	logline:
		'A boy in Yongcheon joins March 1 and will not write the apology that would put him back in school. He learns a teacher, a Bible read without a church, and a history he prints until they close the magazine. He comes south, says a people lives by thinking, and names a magazine for the seed. He dies in 1989. The hundredth issue still has his name on it.',
	opening: '“He was eighteen, and the school would have him back if he would only say he was sorry.”',
	altTitles: [
		{ title: 'Ssial', ko: '씨알', note: 'His word. The seed, the small people. The magazine is 씨알의 소리, the seed’s voice. The series is 씨알소리.' },
		{ title: 'The Refusal', ko: '퇴학', note: '1919, seen from a third-year student, not from the committee in Shanghai.' }
	],
	images: [
		{
			src: '/cover_ssial.png',
			alt: 'Ham Seok-heon seated in white, the title 씨알소리 brushed above him',
			caption: 'Seed.',
			kind: 'poster'
		}
	],
	synopsis: [
		'Ham Seok-heon is born on March 13, 1901, in Yongcheon, North Pyongan, to Ham Hyeong-taek and Kim Hyeong-do. He starts in a village Chinese school, finishes the public primary course, and enters the higher common school in Pyongyang. In March 1919, in his third year, he joins the independence demonstrations. The Japanese principal offers reinstatement if he will write a repentance. He will not. He is out of school for two years, a clerk, a primary teacher. The declaration in the park and the government declared in Shanghai that April are the country around him. They are not his plot. He is eighteen and unemployed.',
		'In 1921 he enters Osan School in Jeongju, in the third year, on a pastor’s introduction. Ryu Yeong-mo becomes the teacher he keeps for life. He also meets the memory of Ahn Chang-ho and the living Lee Seung-hun and Jo Man-sik. He graduates in 1923. In 1924 he enters Tokyo Higher Normal School, in the literature course, and sits in Uchimura Kanzo’s Bible studies. With Kim Gyo-sin, Song Du-yong, and the others he keeps a non-church faith: no building required. In 1927 they start the magazine Seongseo Joseon. He graduates in 1928, first in history, and in April comes home to teach history and morals at Osan.',
		'In 1934 and 1935 he serializes, in that magazine, a history of Korea read from the Bible’s side. The book of it waits until 1948, and the later title, a history seen by its meaning, waits until the 1960s. In March 1938 he leaves Osan rather than take a Japanese name. One account calls the resignation forced. The national encyclopedia records only that he resigned. The book takes the refusal. In 1940 he is implicated in the Gyeuhoe case and held for a year at the Daedong police station in Pyongyang. In March 1942 the last issue of Seongseo Joseon carries Kim Gyo-sin’s elegy for a frog. The magazine is shut. Ham spends another year in Seodaemun and comes out in the spring of 1943.',
		'In September 1945 the northern committee gives him the education seat. On March 17, 1947, he comes south and lectures at the YMCA. The war takes him through Daejeon to Busan, where Jang Gi-ryeo asks him to speak to wounded soldiers in a tent. From 1956 he writes in Sasanggye. In 1958 the sentence is: a thinking people is the one that lives. It is aimed at the Liberal Party. In 1961, just after May 16, he publishes how one ought to look at the coup. In 1962 a State Department invitation takes him to America, and he meets the Friends. He will later call himself a Quaker.',
		'On April 19, 1970, he founds the monthly Ssial ui sori, the seed’s voice. Ssial is his word for the small people, the kernel a country actually is. The ministry closes the magazine. A court says the closing exceeded its discretion, and it returns. In July 1980 the new junta closes it again, after ninety-five issues, with no warning. The American Friends Service Committee puts his name forward for the Nobel Peace Prize in 1979 and again in 1985. That is a nomination by a former laureate, not a shortlist. He dies on February 4, 1989, at Seoul National University Hospital. The funeral is at Osan on February 8. The hundredth issue, that April, is still issued in his name.'
	],
	quotes: [
		{
			text: 'A thinking people is the one that lives.',
			who: 'Ham Seok-heon',
			source: 'Sasanggye, 1958',
			original: '생각하는 백성이라야 산다.'
		}
	],
	cast: [
		who({
			name: 'Ham Seok-heon',
			ko: '함석헌',
			hanja: '咸錫憲',
			epithet: 'the seed',
			life: '1901–1989',
			side: 'Ssial',
			hex: '#4a5c3e',
			lead: true,
			want: 'A people that thinks, and a magazine that can say so out loud.',
			voice: 'A teacher’s voice. Long, biblical, then suddenly plain. He will not take a name that is not his, and he will not write the apology.',
			line: 'A thinking people is the one that lives.',
			arc: 'From Yongcheon to the refusal, Osan, Tokyo, the two cells, the road south, and the magazine. He dies in hospital. The issue after his death still carries him.'
		}),
		who({
			name: 'Ryu Yeong-mo',
			ko: '유영모',
			hanja: '柳永模',
			epithet: 'the teacher he keeps',
			life: '1890–1981',
			side: 'Osan',
			hex: '#3d4a5c',
			want: 'A student who will think past the nation that is currently shouting.',
			voice: 'Spare. He teaches a boy who has already been expelled, and the boy never replaces him.',
			line: 'Read it until it is yours.',
			arc: 'He is the reason Osan is not just another school. The book does not follow him out of the classroom.'
		}),
		who({
			name: 'Kim Gyo-sin',
			ko: '김교신',
			hanja: '金敎臣',
			epithet: 'the frog',
			life: '1901–1945',
			side: 'Non-church',
			hex: '#5c4a3a',
			want: 'A faith with no building, and a magazine the censor has not killed yet.',
			voice: 'The friend from the Tokyo circle. The last thing he prints is an elegy for a frog.',
			line: 'Then we print it until they take the type.',
			arc: 'He starts Seongseo Joseon with Ham. The elegy closes it. The book does not stage his death. The magazine’s ending is the scene.'
		})
	],
	bonds: [
		{ a: 'Ham Seok-heon', b: 'Ryu Yeong-mo', kind: 'the teacher', body: 'Osan, 1921. A boy who has already refused an apology meets the teacher he will still be quoting when the magazine has his name on a closed issue.' },
		{ a: 'Ham Seok-heon', b: 'Kim Gyo-sin', kind: 'the magazine', body: 'Tokyo, the non-church circle, Seongseo Joseon. One of them writes the elegy that ends it. The other spends the year in Seodaemun.' }
	],
	parts: [
		{
			id: 'life',
			title: 'Seed',
			ko: '씨알소리',
			years: '1901–1989',
			summary: 'One life. The refusal, the history, the two cells, the magazine, the hall.',
			episodes: [
				ep('Yongcheon', '용천', '1901', 'March 13. A village in North Pyongan, and a Chinese school before any later name.', ['Ham Hyeong-taek and Kim Hyeong-do.', 'The village school his uncle keeps.', 'Nothing in the room knows what he will refuse.'], 'The higher school in Pyongyang will offer him a bargain…!'),
				ep('The Refusal', '퇴학', '1919', 'He joins March 1. The principal wants a repentance.', ['Third year.', 'Write it, and the desk is still his.', 'He does not write it. In April a government is declared in a city he is not in.'], 'A school in Jeongju will take a boy the other school threw out…!'),
				ep('Osan', '오산', '1921', 'Jeongju. He enters in the third year, and finds the teacher.', ['Ryu Yeong-mo.', 'Lee Seung-hun’s school, and the memory of Ahn Chang-ho.', 'He graduates in 1923.'], 'Tokyo is next, and a Bible read in a room that is not a church…!'),
				ep('The Non-Church', '무교회', '1924', 'Uchimura’s study. A magazine with Kim Gyo-sin.', ['Tokyo Higher Normal, literature.', 'No building required.', 'Seongseo Joseon, 1927. Home in April 1928, to teach history at Osan.'], 'He is about to write the country’s history from the wrong shelf…!'),
				ep('The History', '조선역사', '1934', 'The serial. Then the name he will not take.', ['1934 and 1935, in the magazine.', 'The book of it waits until after the liberation.', 'March 1938. He leaves Osan rather than take a Japanese name.'], 'They will want him for a different case…!'),
				ep('The Frog', '조와', '1942', 'Two cells, and a magazine that ends on an elegy.', ['1940. The Gyeuhoe case. A year at Daedong.', 'March 1942. Kim Gyo-sin’s elegy for a frog. The last issue.', 'A year in Seodaemun. Out in the spring of 1943.'], 'When the north sets up a committee, they will hand him the schools…!'),
				ep('South', '월남', '1947', 'He tries the north’s education seat, and then he leaves.', ['September 1945.', 'March 17, 1947, south. The YMCA lectures.', 'The war. A tent in Busan, because Jang Gi-ryeo asked.'], 'A magazine in Seoul is about to print one sentence…!'),
				ep('A Thinking People', '생각', '1958', 'The sentence, the coup, and the Friends.', ['Sasanggye, from 1956.', 'A thinking people is the one that lives.', '1961, how to look at May 16. 1962, America, and the Quakers.'], 'He is going to give the small people a name, and a magazine…!'),
				ep("The Seed's Voice", '씨알', '1970', 'April 19. Ssial ui sori.', ['The seed, his word for the people a country actually is.', 'Closed, restored by a court, closed again in July 1980.', 'The Friends put his name forward in 1979, and again in 1985.'], 'The hospital is the last room…!'),
				ep('The Hall', '강당', '1989', 'February 4. The funeral is at the school.', ['Seoul National University Hospital.', 'February 8, the hall at Osan.', 'The hundredth issue, in April, still has his name on it.'], 'The seed does not end because the man did…!')
			]
		}
	],
	themes: [
		{ title: 'One life, one volume', body: ['The series is the life. It does not split him into a student, a prisoner, and a dissident. The magazine is the late form of the refusal: he will not say the sentence they handed him.'] },
		{ title: 'The seed', body: ['씨알 is his word, not a party’s. The small people, the kernel. The series is 씨알소리, the shorter name of the magazine 씨알의 소리. The magazine is closed twice.'] }
	],
	arcs: [
		{ who: 'Ham Seok-heon', steps: ['The refusal', 'The history', 'The seed’s voice', 'The hall'], mirror: 'Kim Gyo-sin writes the elegy and the magazine ends. Ham lives long enough to start another one, and to see it closed.' }
	],
	plants: [
		{ plant: 'The school will take him back for a written apology.', payoff: 'Every later closing — the Japanese name, the two magazines — is the same offer, and he gives the same answer.' },
		{ plant: 'He serializes a history the censor can still reach.', payoff: 'The 1948 book and the later retitling are that serial, finally allowed to be a book. The magazine that carried it does not survive.' },
		{ plant: 'He names the magazine for the seed.', payoff: 'The hundredth issue, the spring after his death, still goes out with his name on it.' }
	],
	timeline: [
		{ year: '1901', text: 'March 13. Born in Yongcheon, North Pyongan.' },
		{ year: '1919', text: 'Joins March 1 in his third year at Pyongyang. Refuses the written apology. Expelled.' },
		{ year: '1921', text: 'Enters Osan School in Jeongju. Ryu Yeong-mo. Graduates in 1923.' },
		{ year: '1924', text: 'Tokyo Higher Normal. Uchimura Kanzo. The non-church circle.' },
		{ year: '1927', text: 'Seongseo Joseon is founded. He comes home to teach at Osan in April 1928.' },
		{ year: '1934', text: 'Serializes a biblical history of Korea. In March 1938 he leaves Osan rather than take a Japanese name.' },
		{ year: '1940', text: 'The Gyeuhoe case. A year at the Daedong police station.' },
		{ year: '1942', text: 'The elegy for a frog, in the March issue. The magazine closes. A year in Seodaemun.' },
		{ year: '1945', text: 'Education seat on the northern committee. He comes south on March 17, 1947.' },
		{ year: '1958', text: '“A thinking people is the one that lives,” in Sasanggye.' },
		{ year: '1961', text: 'Writes on May 16. In 1962 he meets the Friends in America.' },
		{ year: '1970', text: 'April 19. Founds Ssial ui sori. Closed, restored, and closed again in July 1980.' },
		{ year: '1979', text: 'The American Friends nominate him for the peace prize, and again in 1985.' },
		{ year: '1989', text: 'Dies on February 4. The funeral is at Osan on the 8th.' }
	],
	sources: [
		{
			title: 'The life',
			body: [
				'Encyclopedia of Korean Culture (함석헌): born 1901 in Yongcheon, parents Ham Hyeong-taek and Kim Hyeong-do, Pyongyang Higher Common, March 1 and the expulsion, Osan 1921–23, Tokyo Higher Normal 1924–28, Uchimura and the non-church circle with Kim Gyo-sin, Seongseo Joseon from 1927, teaching at Osan until March 1938, the Gyeuhoe case in 1940, the Seongseo Joseon case in 1942, south on March 17, 1947, Sasanggye from 1956, the 1958 sentence, the May 16 essay, the 1962 American trip and the Quakers, Ssial ui sori from April 1970. The magazine’s own chronology dates the first issue to April 19, 1970, the 1980 closing to July 31 after ninety-five issues, and his death to February 4, 1989, in room 108 on the twelfth floor of Seoul National University Hospital, with the funeral at Osan on February 8. The Busan encyclopedia gives March 13, 1901, as the birth date, and calls the 1938 leaving a forced resignation for refusing a Japanese name. The American Friends Service Committee recommended him for the Nobel Peace Prize in 1979 and 1985.'
			]
		}
	],
	research: [
		{
			title: 'What this book leaves out',
			body: [
				'The provisional government’s later years, the war in the north after he has come south, and the party politics of the republic are the world around the life. They enter when they reach him: a tent, a sentence, a coup he is asked to look at, a magazine closed. Kim Gyo-sin’s death is not staged. The elegy is the scene this book keeps.'
			]
		}
	],
	places: [
		{ name: 'Yongcheon', ko: '용천', now: 'Yongchon, North Pyongan', note: 'Where he is born, March 13, 1901.' },
		{ name: 'Osan', ko: '오산학교', now: 'Jeongju, then the school reopened in the south', note: 'He enters in 1921, teaches from 1928 to 1938, and the funeral is in its hall on February 8, 1989.' },
		{ name: 'Tokyo', ko: '도쿄', now: 'Tokyo', note: 'Higher Normal School, 1924–28. Uchimura’s Bible study.' },
		{ name: 'Seodaemun', ko: '서대문', now: 'Seoul', note: 'The second cell. The Seongseo Joseon case, about a year, out in the spring of 1943.' }
	],
	contested: [
		'Whether the March 1938 resignation was specifically the refusal of a Japanese name. The Busan encyclopedia says he was forced out for that refusal. The national encyclopedia records only that he resigned. The book takes the refusal.',
		'The Nobel line is a recommendation by the American Friends, twice. It is not a claim that he was a finalist.'
	],
	invented: [
		'What he says to the principal, and what Ryu Yeong-mo says in the classroom. The expulsion, the school, and the teacher are the record. The sentences are the book.',
		'The talk in the Tokyo circle and in the tent at Busan. The magazines, the cells, and the dates are the record.'
	],
	production: [
		{
			title: 'One volume',
			body: [
				'The series is one book, 1901–1989. It sits after Breaking. March First is in it as the year he is expelled, not as the enlightenment party’s epilogue. Ten episodes: the village, the refusal, Osan, the non-church, the history, the frog, the road south, the sentence, the magazine, the hall.'
			]
		}
	]
};
