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

export const ourLand: Outline = {
	slug: 'our-land',
	title: 'Breaking',
	ko: '대한사람',
	shelf: 'Samhan',
	badge: 'Gaehwapa',
	tagline: 'Three volumes, from the treaty at Ganghwa to the seal on the annexation',
	era: 'Late Joseon and the Korean Empire',
	years: '1876–1910',
	accent: '#8a7040',
	logline:
		'The ports open, and a handful of readers call themselves a party. They take the palace for three days and spend the next decade as guests. The counties rise under an older teaching, the same spring their leader is shot. Other men pass the program under foreign guns. Then he calls it an empire, and the seal goes on the annexation.',
	opening: '“They called it our party before they had an office, a newspaper, or a single day in power.”',
	altTitles: [
		{ title: 'Reform', ko: '개화', note: 'The first book. The ports, the party, the weekend. 1876 to the boat at Incheon, December 1884.' },
		{ title: 'Revolution', ko: '혁명', note: 'The second. The exile is the prologue. The subject is the counties, from the petitions to the paper.' },
		{ title: 'Resistance', ko: '투쟁', note: 'The third. The crown, the club, the seal. October 1897 to August 1910. March First is the next series.' }
	],
	images: [],
	synopsis: [
		'The first book opens on the Treaty of Ganghwa in February 1876. The country is no longer closed. Park Gyu-su’s students already have the new geographies on a desk, and he dies the year after the treaty. Kim Ok-gyun later writes that “our party” existed by about 1874. The book uses his date and puts the episode on the Japan trips of 1881, when a sightseeing group goes to look at a country that has already opened. The men are Kim Ok-gyun, Park Yeong-hyo, Seo Gwang-beom, Hong Yeong-sik, Seo Jae-pil. After the Imo mutiny of 1882, Chinese troops sit in the palace and Yuan Shikai becomes the fact in the room. The gradualists — Kim Hong-jip, Kim Yun-sik, Eo Yun-jung — stay. The radicals decide China is the obstacle.',
		'In August 1884 half the Chinese garrison leaves for the Sino-French war. On December 4, solar, Hong Yeong-sik gives a banquet for the new post office. The radicals tell Gojong the Chinese are rioting, move him under Japanese legation guard, kill the senior sadae officials, and publish fourteen points: an end to the tributary relation, a king closer to a constitution, one treasury, the grain loans, a police. It lasts three days. Yuan returns. Hong Yeong-sik and Park Yeong-gyo are killed. Nine men get to a boat at Incheon, among them Kim Ok-gyun, Park Yeong-hyo, Seo Gwang-beom, and Seo Jae-pil. That is the end of the first book.',
		'Japan keeps them and does not send them home. In the counties the Donghak teaching has been a crime since Choe Je-u was executed in 1864. In 1893 his followers petition to clear his name. In 1894, the same spring, two things happen that never meet. Hong Jong-u shoots Kim Ok-gyun in Shanghai, and the body is brought back, quartered, and displayed. Jeon Bong-jun rises at Gobu. The first march takes Jeonju and accepts a truce. China comes for the peasants. Japan comes for China. The second rising breaks at Ugeumchi. Kim Hong-jip and Eo Yun-jung pass the Gabo reforms, the radicals’ program in the moderates’ hands. Jeon is executed in the spring of 1895. In October, Queen Min is killed. Japanese legation men are in the palace. Which desk in Tokyo ordered it stays contested. In February 1896 Gojong runs to the Russian legation. Kim Hong-jip is killed by a mob. In April, Seo Jae-pil prints The Independent in hangul. The second book ends there, with a paper and no empire yet.',
		'In October 1897 Gojong calls the country an empire. The Independence Club, already meeting, is dissolved at the end of 1898. In November 1905 five ministers sign the Eulsa protectorate. Min Yeong-hwan dies in protest. Ito arrives. In 1907 the Hague envoys fail, Gojong is forced off the throne in July, and the army is disbanded in August. On October 26, 1909, An Jung-geun shoots Ito at Harbin. In August 1910 the seal goes on the annexation. The series stops. A boy who will not write an apology, and the government declared in Shanghai, are the next book.'
	],
	quotes: [
		{
			text: 'I killed him for the peace of the East.',
			who: 'An Jung-geun',
			source: 'After Harbin, 1909',
			original: '나는 동양 평화를 위하여 이토를 쏘았다.'
		}
	],
	cast: [
		who({
			name: 'Kim Ok-gyun',
			ko: '김옥균',
			hanja: '金玉均',
			epithet: 'our party',
			life: '1851–1894',
			side: 'Gaehwapa',
			hex: '#2a3a4a',
			lead: true,
			want: 'A country that is not a tributary, in his own lifetime, by a weekend if that is all the garrison gives him.',
			voice: 'Fast, modern, sure the fourteen points will be understood if he can get them printed.',
			line: 'Our party. I am not inventing the word.',
			arc: 'From the reading circle to the three days to a hotel in Shanghai. He dies in the second book, the same spring Gobu rises. The body goes home. He does not.'
		}),
		who({
			name: 'Seo Jae-pil',
			ko: '서재필',
			hanja: '徐載弼',
			epithet: 'the one who grows old',
			life: '1864–1951',
			side: 'Gaehwapa',
			hex: '#3d5a4a',
			want: 'The same reform, said in a newspaper the country can buy.',
			voice: 'Hangul, short sentences, an American name he does not use when he is angry.',
			line: 'Print it where they can read it.',
			arc: 'He flees in 1884, comes home in 1896, and loses the club in 1898. The series ends at the seal. He outlives it, and he is not the hero of the next book.'
		}),
		who({
			name: 'Park Yeong-hyo',
			ko: '박영효',
			hanja: '朴泳孝',
			epithet: 'the other radical',
			life: '1861–1939',
			side: 'Gaehwapa',
			hex: '#4a3a2a',
			want: 'Japan as the lever, and a king who will use it.',
			voice: 'A courtier who has been to Tokyo. He still thinks a palace can be turned from inside.',
			line: 'Three days is a start if we are still in the building on the fourth.',
			arc: 'He is on the boat. He lives. The book does not follow him into the empire’s offices.'
		}),
		who({
			name: 'Hong Yeong-sik',
			ko: '홍영식',
			hanja: '洪英植',
			epithet: 'the banquet',
			life: '1855–1884',
			side: 'Gaehwapa',
			hex: '#8f3a2a',
			want: 'A post office, and a country that can send its own letters.',
			voice: 'Practical. The coup begins as his invitation list.',
			line: 'They will come for the building. Stay for the government.',
			arc: 'He gives the banquet and dies in the palace when Yuan comes back. He does not get the boat.'
		}),
		who({
			name: 'Kim Hong-jip',
			ko: '김홍집',
			hanja: '金弘集',
			epithet: 'the moderate',
			life: '1842–1896',
			side: 'gradualist',
			hex: '#6a3030',
			want: 'The same reforms, slower, and without losing the king to a faction.',
			voice: 'An official. He speaks in ordinances.',
			line: 'We can pass it. We do not have to take the palace to pass it.',
			arc: 'He gets the Gabo program the radicals died for, and a mob kills him when the king runs to the Russian legation.'
		}),
		who({
			name: 'Jeon Bong-jun',
			ko: '전봉준',
			hanja: '全琫準',
			epithet: 'Gobu',
			life: '1855–1895',
			side: 'Donghak',
			hex: '#5a4a2a',
			want: 'The magistrate, the grain, and a county that can bury its own dead.',
			voice: 'A farmer’s complaint that becomes an army. He does not quote the fourteen points.',
			line: 'Gobu first.',
			arc: 'He is the subject of the second book. The party is not in his ranks. He takes Jeonju, loses the second rising at Ugeumchi, and is executed in the spring of 1895.'
		}),
		who({
			name: 'Gojong',
			ko: '고종',
			hanja: '高宗',
			epithet: 'the king in the building',
			life: '1852–1919',
			side: 'Joseon',
			hex: '#8a7040',
			want: 'To still be king in the morning, whichever army is in the courtyard.',
			voice: 'Careful, late, and finally imperial. He says independence after he has been a guest of two legations.',
			line: 'Call it an empire. Say it where they can hear.',
			arc: 'He is the prize of the three days, the guest of the Russian legation, the Gwangmu emperor, and the king removed after The Hague. The series ends when the seal is used, in 1910. He is still alive. The next book does not make the declaration his.'
		})
	],
	bonds: [
		{ a: 'Kim Ok-gyun', b: 'Seo Jae-pil', kind: 'the boat', body: 'They flee together in 1884. One dies in Shanghai in 1894. The other comes home and prints the paper. The party’s two endings, and both of them fall inside the second book.' },
		{ a: 'Kim Ok-gyun', b: 'Kim Hong-jip', kind: 'the split', body: 'After Imo, one of them will take the palace and one of them will wait. The one who waits passes the program and dies in the street.' },
		{ a: 'Kim Ok-gyun', b: 'Jeon Bong-jun', kind: 'the same spring', body: 'They never meet. The murder and Gobu are one season, and the war starts because both happened.' }
	],
	parts: [
		{
			id: 'gapsin',
			title: 'Reform',
			ko: '개화',
			years: '1876–1884',
			summary: 'The treaty, the party’s name, the mutiny, and one weekend.',
			episodes: [
				ep('Ganghwa', '강화', '1876', 'A treaty at the island. The maps were already on the desk.', ['February.', 'Park Gyu-su’s students, and the new geographies.', 'He dies the next year. The readers do not.'], 'One of them already has a name for the circle…!'),
				ep('Our Party', '오당', '1881', 'Kim Ok-gyun’s word, and the trip that lets them see a country that opened.', ['He dates the party to about 1874.', 'The sightseeing group.', 'No office yet. A plan to stop being a tributary.'], 'Then the soldiers in Seoul decide they have had enough of the new drills…!'),
				ep('The Split', '임오', '1882', 'Imo fills the palace with Chinese troops. The circle breaks on purpose.', ['Yuan Shikai becomes the fact in the room.', 'Kim Hong-jip stays.', 'The radicals take a new name.'], 'They will need the garrison to be somewhere else…!'),
				ep('The Post Office', '우정국', '1884', 'Hong Yeong-sik invites the city. Half the Chinese troops are in Vietnam’s war.', ['December 4, solar.', 'A new building as a pretext.', 'Takezoe’s legation guards, already counted.'], 'They have a list of fourteen things…!'),
				ep('Fourteen Points', '십사조', '1884', 'End the tribute. One treasury. A king who shares the government.', ['Printed on the second day.', 'The senior sadae ministers are already dead.', 'Gojong is in a different palace, under a different guard.'], 'Yuan is not in Vietnam…!'),
				ep('Three Days', '삼일', '1884', 'The garrison comes back. Hong Yeong-sik and Park Yeong-gyo do not leave the palace.', ['Three days is the whole reign.', 'The Japanese minister cannot hold the courtyard.', 'The program dies with the men who stayed.'], 'Nine of them reach the water…!'),
				ep('Nine Names', '구명', '1884', 'Incheon. Kim Ok-gyun, Park Yeong-hyo, Seo Gwang-beom, Seo Jae-pil, and five others.', ['The boat is the party now.', 'Japan will keep them.', 'The first book ends on the water.'], 'The counties have had a teaching longer than this party has had a name…!')
			]
		},
		{
			id: 'donghak',
			title: 'Revolution',
			ko: '혁명',
			years: '1884–1897',
			summary: 'Nine guests, a petition, Gobu, and the war that answers both.',
			episodes: [
				ep('The Years', '일본', '1885', 'They are housed, watched, and not sent home.', ['A party of nine and a memory.', 'The teaching in the counties is still a crime.', 'Seoul is run with Chinese troops in it.'], 'The counties will ask for a dead man’s name back before they ask for a war…!'),
				ep('The Petitions', '신원', '1893', 'Clear Choe Je-u. They walk, and they are still asking.', ['Samnye.', 'Then the road to the palace.', 'A complaint with a hymn under it. Not an army yet.'], 'A magistrate in Gobu is about to go too far…!'),
				ep('Gobu', '고부', '1894', 'Jeon Bong-jun rises. The first march takes Jeonju.', ['A county complaint that becomes a column.', 'The truce after the fortress.', 'The radicals are not in the ranks.'], 'The same spring, in another city, the party’s leader is already dead…!'),
				ep('Shanghai', '상하이', '1894', 'Hong Jong-u shoots Kim Ok-gyun. The body is a message.', ['Returned, quartered, displayed.', 'The leader is a corpse and a warning.', 'The party as a conspiracy ends in a hotel.'], 'Two empires are already deciding whose war this is…!'),
				ep('Two Armies', '청일', '1894', 'The war is fought here. The second rising does not survive it.', ['China for the rebellion.', 'Japan for the right to stay.', 'Ugeumchi. Jeon is taken.'], 'The moderates are handed a pen…!'),
				ep('Gabo', '갑오', '1894', 'Kim Hong-jip and Eo Yun-jung pass what the radicals died printing.', ['Ordinances instead of a coup.', 'Japanese guns in the corridor.', 'In the spring of 1895, Jeon is executed.'], 'The queen is the next room they enter…!'),
				ep('Eulmi', '을미', '1895', 'Queen Min is killed in the palace.', ['October 8.', 'Japanese legation men are in it.', 'Who in Tokyo gave the order stays contested, and the book leaves it that way.'], 'The king looks for a building that is not his…!'),
				ep('The Mob', '김홍집', '1896', 'Gojong reaches the Russian legation. Kim Hong-jip does not.', ['February.', 'The moderate who stayed.', 'A reformer killed by the street the reforms did not feed.'], 'One of the nine is about to come home with a press…!'),
				ep('The Independent', '독립신문', '1896', 'Seo Jae-pil prints it in hangul.', ['April.', 'The party’s second life, legal.', 'A paper, and still no empire.'], 'He is about to come out of the legation and give the country a new name…!')
			]
		},
		{
			id: 'empire',
			title: 'Resistance',
			ko: '투쟁',
			years: '1897–1910',
			summary: 'A crown, a closed club, five signatures, and a seal.',
			episodes: [
				ep('Gwangmu', '광무', '1897', 'An empire, declared from a palace he has just moved back into.', ['October.', 'Daehan.', 'Independence with a crown, which is not what the fourteen points asked for.'], 'The public party is still meeting, and it is about to be told to stop…!'),
				ep('The Club', '독립협회', '1898', 'Independence Gate, then the dissolution.', ['Yun Chi-ho.', 'Public meetings, and the limit of them.', 'By the end of the year the club is gone. Seo Jae-pil is already out.'], 'Seven years later five men sign the other paper…!'),
				ep('Eulsa', '을사', '1905', 'The protectorate. Five ministers. Ito.', ['November.', 'Min Yeong-hwan dies in protest.', 'The foreign policy of the empire is no longer its own.'], 'The Hague is next, and it will not work…!'),
				ep('The Hague', '헤이그', '1907', 'The envoys fail. The throne and the army go in the same summer.', ['July, the forced abdication.', 'August, the army disbanded.', 'The righteous armies are what is left of the ranks.'], 'Two years later a man waits on a platform…!'),
				ep('Harbin', '하얼빈', '1909', 'An Jung-geun shoots Ito.', ['October 26.', 'He says it was for the peace of the East.', 'The empire does not get its foreign policy back.'], 'The seal is the only instrument left…!'),
				ep('The Seal', '옥새', '1910', 'August. The annexation.', ['The army is already gone.', 'The envoys already failed.', 'The series stops when the seal is used.'], 'A boy in Pyongyang will be asked to apologize for a declaration. Not in this book…!')
			]
		}
	],
	themes: [
		{ title: 'Three stretches', body: ['The first book is the party and its weekend. The second is the counties, with the exiles as prologue. The third is the empire, down to the seal. A book is whoever is moving, not a life from birth to death.'] },
		{ title: 'Three speeds', body: ['The radicals take a weekend. The peasants take a year and meet two empires. The moderates take ordinances and die in the street. Same want, three clocks, and the seal is what is left.'] }
	],
	arcs: [
		{ who: 'Kim Ok-gyun', steps: ['Our party', 'Three days', 'Shanghai'], mirror: 'Kim Hong-jip: the man who refused the weekend and was given the program anyway, and killed for staying.' },
		{ who: 'Jeon Bong-jun', steps: ['The petitions', 'Jeonju', 'Ugeumchi'], mirror: 'He never meets the party. The war starts because his year and Kim Ok-gyun’s death are the same spring.' },
		{ who: 'Seo Jae-pil', steps: ['The boat', 'The paper', 'The dissolution'], mirror: 'He is allowed to grow old. The book does not pretend that is the same as winning, and it does not follow him past the seal.' }
	],
	plants: [
		{ plant: 'Kim dates the party himself, before it has power.', payoff: 'The fourteen points are that party, printed, and the exile is that party, homeless.' },
		{ plant: 'Half the Chinese garrison leaves for another war.', payoff: 'Three days is possible only because of a war that is not about Korea, and it ends when the garrison returns.' },
		{ plant: 'The murder and Gobu are one spring.', payoff: 'The Sino-Japanese War is the answer to both, and Gabo is the radicals’ list in the moderates’ hands.' },
		{ plant: 'The paper is legal, and it is not a country.', payoff: 'The empire is a crown on the same want, and the seal is the end of both.' }
	],
	timeline: [
		{ group: 'Reform · 1876–1884', year: '1876', text: 'Treaty of Ganghwa. The ports open.' },
		{ group: 'Reform · 1876–1884', year: '1881', text: 'Kim Ok-gyun’s party, dated by him to about 1874, goes to look at Japan.' },
		{ group: 'Reform · 1876–1884', year: '1882', text: 'Imo. The radicals and the gradualists split.' },
		{ group: 'Reform · 1876–1884', year: '1884', text: 'December 4, Gapsin. Three days. Nine exiles. Hong Yeong-sik dies.' },
		{ group: 'Revolution · 1884–1897', year: '1885', text: 'The nine stay in Japan. The teaching in the counties is still a crime.' },
		{ group: 'Revolution · 1884–1897', year: '1893', text: 'The petitions to clear Choe Je-u’s name.' },
		{ group: 'Revolution · 1884–1897', year: '1894', text: 'Kim Ok-gyun is killed in Shanghai. Gobu. Jeonju. Ugeumchi. The Sino-Japanese War. Gabo.' },
		{ group: 'Revolution · 1884–1897', year: '1895', text: 'Jeon Bong-jun is executed. Eulmi. Queen Min is killed.' },
		{ group: 'Revolution · 1884–1897', year: '1896', text: 'The Russian legation. Kim Hong-jip is killed. The Independent.' },
		{ group: 'Resistance · 1897–1910', year: '1897', text: 'Gwangmu. The Korean Empire.' },
		{ group: 'Resistance · 1897–1910', year: '1898', text: 'The Independence Club is dissolved.' },
		{ group: 'Resistance · 1897–1910', year: '1905', text: 'Eulsa protectorate.' },
		{ group: 'Resistance · 1897–1910', year: '1907', text: 'The Hague. Abdication. The army is disbanded.' },
		{ group: 'Resistance · 1897–1910', year: '1909', text: 'An Jung-geun shoots Ito at Harbin.' },
		{ group: 'Resistance · 1897–1910', year: '1910', text: 'Annexation.' }
	],
	sources: [
		{
			title: 'The party, the rising, the empire',
			body: [
				'Encyclopedia of Korean Culture on the Enlightenment Party (개화당): the 1874 memory in Kim Ok-gyun’s own writing, the split after Imo, the fourteen points, Hong Yeong-sik and Park Yeong-gyo dead, nine exiles. Gapsin is December 4, 1884, solar. The Ganghwa treaty is February 1876. Gobu, Jeonju, and Ugeumchi are 1894. Eulmi is October 8, 1895. The Russian legation is February 1896. The Independent is April 1896. The empire is proclaimed in October 1897. Eulsa is November 1905. The abdication and the disbanding of the army are July and August 1907. Harbin is October 26, 1909. The annexation is August 1910.'
			]
		}
	],
	research: [
		{
			title: 'What this series leaves out',
			body: [
				'The Daewongun’s regency, the General Sherman, and Byeongin are the world before the ports. They are not the plot. Choe Je-u’s execution in 1864 is the reason the teaching is a crime. It is a memory in the second book, not an opening. March First and the Provisional Government are the next series, seen from a student who will not write the apology. They are not an epilogue here.'
			]
		}
	],
	places: [
		{ name: 'Ganghwa', ko: '강화', now: 'Ganghwa', note: 'The treaty, February 1876. Where the first book starts.' },
		{ name: 'The post office', ko: '우정총국', now: 'Seoul', note: 'Hong Yeong-sik’s banquet, December 4, 1884. The coup starts as an invitation.' },
		{ name: 'Incheon', ko: '인천', now: 'Incheon', note: 'The boat. Nine names. The end of the first book.' },
		{ name: 'Shanghai', ko: '상하이', now: 'Shanghai', note: 'Kim Ok-gyun dies here in 1894, inside the second book. A later government in the same city belongs to the next series.' },
		{ name: 'Gobu', ko: '고부', now: 'Jeongeup', note: 'Where the Donghak year begins, the spring the party’s leader is already dead.' },
		{ name: 'Harbin', ko: '하얼빈', now: 'Harbin', note: 'October 26, 1909. An Jung-geun and Ito.' }
	],
	contested: [
		'Whether “our party” begins in 1874, as Kim Ok-gyun remembered it, or in 1879, when the association is formal. The book takes his memory and lets the later trips be the moment they start traveling.',
		'Who in Tokyo ordered the killing of Queen Min. The legation men are in the room. The order above them stays contested.'
	],
	invented: [
		'Conversation at the banquet and on the boat. The fourteen points, the dead, and the nine names are the record.',
		'What Kim Hong-jip says to a radical who will not wait. The split after Imo is the record. The sentence is the book.'
	],
	production: [
		{
			title: 'Three volumes',
			body: [
				'Reform, 1876–1884, is the ports, the party, and the weekend. It ends on the boat. Revolution, 1884–1897, opens on the nine guests and then belongs to the counties: the petitions, Gobu, Shanghai in the same spring, the war, Gabo, Eulmi, the mob, and the paper. Resistance, 1897–1910, is the crown, the dissolved club, Eulsa, The Hague, Harbin, and the seal. One row.'
			]
		}
	]
};
