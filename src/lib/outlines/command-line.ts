import type { Outline } from './types';

export const commandLine: Outline = {
	slug: 'command-line',
	title: 'Command Line',
	ko: '커맨드 라인',
	shelf: 'America',
	tagline: 'The PC wars · Jobs, Gates, and the people they left behind',
	era: 'Silicon Valley and Seattle',
	years: '1975–2011',
	accent: '#5ab0e0',
	logline:
		'Two college dropouts sell software they haven’t written yet. Two Steves build a computer in a garage. For twenty years they steal from each other, from Xerox and from their friends, until one of them is fired from his own company and the other one has to save it.',
	opening: '“In the winter of 1975 a magazine cover sold a computer that didn’t really work, to people who didn’t really need one, and everyone who mattered bought a copy.”',
	altTitles: [
		{ title: 'The Rich Neighbour', ko: '부자 이웃', note: 'Gates’s line about Xerox. The thesis of the whole war.' },
		{ title: 'Hello', ko: '헬로', note: 'The first word the Macintosh says on stage. Warm and ironic.' },
		{ title: 'Real Artists Ship', ko: '진짜 예술가는 출시한다', note: 'Jobs’s Mac-team slogan. Cult-movie energy.' },
		{ title: 'Two Steves and a Bill', ko: '두 스티브와 빌', note: 'Lighter, a buddy comedy title.' },
		{ title: 'Memory Size?', ko: '메모리 사이즈?', note: 'The first prompt Altair BASIC prints in Albuquerque. Very nerdy.' }
	],
	images: [
		{
			src: '/stories/command-line/poster.jpg',
			alt: 'Two young men, one in a black turtleneck and one in a sweater and glasses, nose to nose over a glowing blank CRT',
			caption: 'The screen between them. The two men who decided what a computer is for.',
			kind: 'poster'
		},
		{
			src: '/stories/command-line/rain.jpg',
			alt: 'A man in a black turtleneck runs back across a rainy parking lot toward a blonde woman under a streetlight',
			caption: 'Palo Alto. He skips the meeting and runs back to ask her to dinner.',
			year: '1989',
			kind: 'romance'
		},
		{
			src: '/stories/command-line/plane.jpg',
			alt: 'A bearded young programmer writes machine code on a yellow legal pad on an airliner tray at night, punched tape beside him',
			caption: 'Somewhere over New Mexico. Paul Allen realises he has no loader program, and writes one by hand before landing.',
			year: '1975'
		},
		{
			src: '/stories/command-line/garage.jpg',
			alt: 'Two young men in a garage at night under a hanging lamp, one holding up a circuit board, the other soldering beside a wooden computer case',
			caption: 'Los Altos. Steve Jobs holds up an Apple I board while Steve Wozniak solders the next one.',
			year: '1976'
		},
		{
			src: '/stories/command-line/parc.jpg',
			alt: 'A young founder stares, amazed, at a screen showing overlapping windows and icons, as a researcher behind him folds her arms',
			caption: 'Xerox PARC. Jobs sees windows, icons and a mouse. Adele Goldberg had argued against showing him.',
			year: '1979',
			episode: 'PARC',
		},
		{
			src: '/stories/command-line/giant-face.jpg',
			alt: 'A lone figure in a black sweater stands on a dark stage beneath a giant screen showing a smiling bespectacled face, the audience booing',
			caption: 'Macworld Boston. Jobs announces Microsoft is saving Apple, and Gates appears on the screen behind him.',
			year: '1997'
		}
	],
	synopsis: [
		'January 1975. A magazine cover shows the Altair 8800, a box of switches and lights with no keyboard and no screen. In Harvard Square, Paul Allen buys it and runs to his friend Bill Gates. They call the manufacturer in Albuquerque and claim to have a BASIC for it. They don’t. Eight weeks later Allen flies down to demonstrate it, writes the loader by hand on the plane, and it works the first time. Microsoft is born on a tray table.',
		'In California, Steve Wozniak builds a better computer for fun and shows it at the Homebrew Computer Club. His friend Steve Jobs thinks they should sell it. Jobs sells his van and Woz sells his calculator. Apple ships from a garage, then the Apple II makes them rich. In 1979 Jobs visits Xerox’s research lab and sees the future: windows, icons and a mouse. He takes it home.',
		'IBM comes to Seattle looking for an operating system. Gates doesn’t have one, so he buys one for fifty thousand dollars and licenses it to IBM without exclusivity, which is the smartest clause in business history. Apple launches the Macintosh with a famous Super Bowl ad about Big Brother. Microsoft ships Windows. Jobs screams that he’s been robbed, and Gates says they both broke into Xerox’s house and Jobs got there first. The next year Apple’s board fires Jobs.',
		'Twelve years later, Apple is dying and buys Jobs’s failed company to get him back. He calls Gates. At Macworld 1997 he announces a $150 million investment from Microsoft, and Gates’s face fills the giant screen behind him while the audience boos. “We have to let go of the notion that for Apple to win, Microsoft has to lose.” In the epilogue, the two of them sit side by side on a stage in 2007. Jobs quotes the Beatles: you and I have memories longer than the road that stretches out ahead.'
	],
	quotes: [
		{
			text: 'As the majority of hobbyists must be aware, most of you steal your software.',
			who: 'Bill Gates, “An Open Letter to Hobbyists”',
			source: 'Homebrew Computer Club Newsletter, February 1976'
		},
		{
			text: 'Do you want to sell sugar water for the rest of your life, or do you want to come with me and change the world?',
			who: 'Steve Jobs, recruiting John Sculley',
			source: 'Sculley, Odyssey (1987)'
		},
		{
			text: 'Well, Steve, I think there’s more than one way of looking at it. I think it’s more like we both had this rich neighbour named Xerox and I broke into his house to steal the TV set and found out that you had already stolen it.',
			who: 'Bill Gates, 1983',
			source: 'Andy Hertzfeld, Revolution in the Valley'
		},
		{
			text: 'Real artists ship.',
			who: 'Steve Jobs, to the Macintosh team',
			source: '1983'
		},
		{
			text: 'We have to let go of this notion that for Apple to win, Microsoft has to lose.',
			who: 'Steve Jobs, Macworld Boston',
			source: 'August 1997'
		},
		{
			text: 'You and I have memories longer than the road that stretches out ahead.',
			who: 'Steve Jobs to Bill Gates, quoting the Beatles',
			source: 'D5 conference, 2007'
		}
	],
	cast: [
		{
			name: 'Steve Jobs',
			lead: true,
			ko: '스티브 잡스',
			epithet: 'The Reality Distortion Field',
			life: '1955–2011',
			side: 'Apple, NeXT, Pixar',
			hex: '#e8e8e8',
			want: 'To make something insanely great, and to be loved by the people he is cruel to.',
			voice: 'Binary: things are insanely great or they are shit. Charismatic, cruel, theatrical, sometimes in tears. Barefoot.',
			line: '“It’s better to be a pirate than to join the navy.” (1982)',
			arc: 'Adopted kid, garage salesman, the man at PARC, the pirate captain, fired, wilderness, the return, the elder on stage.'
		},
		{
			name: 'Bill Gates',
			lead: true,
			ko: '빌 게이츠',
			epithet: 'The Boy from Seattle',
			life: 'b. 1955',
			side: 'Microsoft',
			hex: '#3a8ad0',
			want: 'A computer on every desk, running his software. To win every negotiation, including with friends.',
			voice: 'Fast, rocking in his chair, “that’s the stupidest thing I’ve ever heard.” Funny, competitive, precise about money.',
			line: '“Most of you steal your software.” (1976)',
			arc: 'Rich kid hacker, Harvard dropout, the license deal, Windows, the antitrust years, the philanthropist on stage.'
		},
		{
			name: 'Steve Wozniak',
			lead: true,
			ko: '스티브 워즈니악',
			epithet: 'The Woz',
			life: 'b. 1950',
			side: 'Apple',
			hex: '#f0a030',
			want: 'To build beautiful circuits and play pranks. Not to be a manager.',
			voice: 'Gentle, giggly, endlessly technical, jokes on the phone.',
			line: '“Never trust a computer you can’t throw out a window.”',
			arc: 'HP engineer, Homebrew hero, Apple I and II, crash survivor, gives away his stock, leaves and stays a friend.'
		},
		{
			name: 'Paul Allen',
			ko: '폴 앨런',
			epithet: 'The Idea Man',
			life: '1953–2018',
			side: 'Microsoft',
			hex: '#4a7a5a',
			want: 'To be the one who saw it first. Credit.',
			voice: 'Quiet, bearded, warm, a guitarist, gets the idea and not the deal.',
			line: '(Paraphrased from his memoir) “Bill, it’s happening without us.”',
			arc: 'Sees the magazine, writes the loader on the plane, gets sick, overhears his partners, leaves.'
		},
		{
			name: 'Steve Ballmer',
			ko: '스티브 발머',
			epithet: 'Employee Thirty',
			life: 'b. 1956',
			side: 'Microsoft',
			hex: '#2a5a9a',
			want: 'To win, at volume.',
			voice: 'Loud, sweaty, loyal, hilarious, terrifying.',
			line: '“Developers, developers, developers.” (2000)',
			arc: 'Gates’s Harvard poker friend who becomes his enforcer.'
		},
		{
			name: 'John Sculley',
			ko: '존 스컬리',
			epithet: 'The Sugar Water Man',
			life: 'b. 1939',
			side: 'Pepsi, Apple',
			hex: '#c43a3a',
			want: 'To matter beyond soda, and to be Steve’s partner.',
			voice: 'Corporate, polished, eager, out of his depth and slowly realising it.',
			line: '(Invented) “He told me I’d change the world. He didn’t say I’d have to fire him.”',
			arc: 'Recruited with the most famous pitch in tech, becomes Jobs’s friend, sides with the board, signs the license to Microsoft.'
		},
		{
			name: 'Gary Kildall',
			ko: '게리 킬달',
			epithet: 'The Man Who Went Flying',
			life: '1942–1994',
			side: 'Digital Research',
			hex: '#8a7a5a',
			want: 'To write good software and be left alone.',
			voice: 'Professorial, easygoing, a pilot. No killer instinct.',
			line: '(Invented) “IBM can wait an afternoon.”',
			arc: 'Writes CP/M, the standard operating system, and misses the IBM deal.'
		},
		{
			name: 'Ed Roberts',
			ko: '에드 로버츠',
			epithet: 'Father of the Altair',
			life: '1941–2010',
			side: 'MITS',
			hex: '#c47a3a',
			want: 'To save his failing calculator company.',
			voice: 'Gruff ex-air-force engineer.',
			line: '(Invented) “Everybody calls saying they’ve got a BASIC. Bring it here and run it.”',
			arc: 'Makes the first personal computer; later a country doctor.'
		},
		{
			name: 'Mike Markkula',
			ko: '마이크 마큘라',
			epithet: 'The Adult in the Room',
			life: 'b. 1942',
			side: 'Apple',
			hex: '#7a8a9a',
			want: 'One more great company.',
			voice: 'Calm, paternal, numbers.',
			line: '(Paraphrase of his Apple marketing philosophy) “Empathy. Focus. Impute.”',
			arc: 'Retired Intel millionaire who invests in Apple and later votes Jobs out.'
		},
		{
			name: 'Adele Goldberg',
			ko: '아델 골드버그',
			epithet: 'The One Who Said No',
			life: 'b. 1945',
			side: 'Xerox PARC',
			hex: '#b07aa0',
			want: 'For PARC’s work not to be given away.',
			voice: 'Direct, furious, right.',
			line: '(Paraphrased from her account) “You are giving away the kitchen sink.”',
			arc: 'Objects to the Apple demo and is overruled.'
		},
		{
			name: 'Andy Hertzfeld',
			ko: '앤디 허츠펠드',
			epithet: 'The Software Wizard',
			life: 'b. 1953',
			side: 'Apple',
			hex: '#9aca6a',
			want: 'To make the Mac delightful.',
			voice: 'Enthusiastic, chronicler, kind.',
			line: '(Invented) “He called it shit on Monday and his idea on Friday.”',
			arc: 'Writes the Mac’s system software and its oral history.'
		},
		{
			name: 'Laurene Powell',
			ko: '로렌 파월',
			epithet: 'The One Who Stayed',
			life: 'b. 1963',
			side: 'Palo Alto',
			hex: '#d4b090',
			want: 'A family, and a quieter Steve.',
			voice: 'Clever, dry, unimpressed by him in the best way.',
			line: '(Invented) “Eat something. Then save Apple.”',
			arc: 'Meets him at a Stanford lecture in 1989; the second half’s anchor.'
		}
	],
	bonds: [
		{
			a: 'Steve Jobs',
			b: 'Bill Gates',
			kind: 'Rivals who needed each other',
			body: 'Microsoft writes software for the Mac before Windows exists. Jobs needs Gates’s programmers; Gates needs Jobs’s ideas. Every meeting is a negotiation dressed as a fight or a fight dressed as a negotiation. They insult each other in public for twenty years and end up on the same stage, laughing.'
		},
		{
			a: 'Steve Jobs',
			b: 'Steve Wozniak',
			kind: 'The two Steves',
			body: 'Woz builds; Jobs sells. Early on, Jobs pays him half of $700 for a job that earned $5,000. Woz finds out years later and just says it hurt. Woz gives stock to early employees Jobs had left out. They never fully fall out and are never fully close again.'
		},
		{
			a: 'Bill Gates',
			b: 'Paul Allen',
			kind: 'The founders who split',
			body: 'Allen had the idea; Gates had the deal. Allen gets cancer at twenty-nine and overhears Gates and Ballmer planning to dilute his shares. He leaves. They reconcile in old age, more or less. The first and last scenes between them should both happen in a car.'
		},
		{
			a: 'Steve Jobs',
			b: 'John Sculley',
			kind: 'Courtship and betrayal',
			body: 'Jobs courts him for months: walks in Central Park, the sugar-water line. They finish each other’s sentences for a year. Then sales drop, Jobs plots against him, and Sculley goes to the board first.'
		},
		{
			a: 'Steve Jobs',
			b: 'Adele Goldberg',
			kind: 'The demo',
			body: 'One scene, the hinge of the first half. She knows exactly what he’s going to do with what he sees. Her bosses tell her to show him anyway.'
		}
	],
	parts: [
		{
			id: 'kit',
			title: 'Kit',
			ko: '키트',
			years: '1975–1976',
			summary: 'A magazine cover, a bluff, a loader written on a plane, and a letter that tells the hobbyists to pay up.',
			episodes: [
				{
					title: 'The Cover',
					ko: '표지',
					year: 'January 1975',
					hook: 'Paul Allen saw the cover in Harvard Square and ran the whole way to Bill’s dorm.',
					beats: [
						'Popular Electronics, January 1975: the Altair 8800, a kit of switches and lights for $397.',
						'Allen: “It’s happening without us.” Gates, nineteen, agrees.',
						'They call MITS in Albuquerque and claim to have a BASIC for the Altair. They have nothing, and no Altair.',
						'Eight weeks in the Harvard computer lab, writing for a machine they simulate on a PDP-10. Gates bums lab time he isn’t really allowed.'
					],
					next: 'Somebody has to fly to Albuquerque…!'
				},
				{
					title: 'The Loader',
					ko: '로더',
					year: 'March 1975',
					hook: 'Halfway to New Mexico, Paul Allen remembered they hadn’t written a way to load the program.',
					beats: [
						'On the plane he writes a bootstrap loader by hand on a notepad, in machine code.',
						'Ed Roberts picks him up in a pickup truck and takes him to a strip-mall office.',
						'Allen toggles the loader in by switches and feeds the paper tape. The teletype prints: MEMORY SIZE?',
						'It works the first time. Roberts is stunned. So is Allen.'
					],
					next: 'In Menlo Park, some hobbyists meet in a garage…!'
				},
				{
					title: 'Homebrew',
					ko: '홈브루',
					year: '1975',
					hook: 'Steve Wozniak went to the club to show people his circuits, and gave the designs away for free.',
					beats: [
						'The Homebrew Computer Club meets in a garage and then an auditorium at Stanford.',
						'Woz builds a computer with a keyboard and a TV for a screen, using fewer chips than anyone thought possible.',
						'He hands out schematics. His friend Steve Jobs, twenty, back from India and working nights at Atari, watches people want it.',
						'Hobbyists copy Altair BASIC on paper tape and pass it round the room.'
					],
					next: 'In Albuquerque, Bill Gates has found out about the paper tape…!'
				},
				{
					title: 'The Open Letter',
					ko: '공개 서한',
					year: 'February 1976',
					hook: 'Bill Gates wrote to the hobbyists to tell them they were thieves, and they never forgave him.',
					beats: [
						'“Most of you steal your software.” Hardware must be paid for; why not software?',
						'The club is furious. Information wants to be free.',
						'Gates, twenty, doesn’t blink.',
						'Plant: the argument over who owns an idea will run for the next twenty years.'
					],
					next: 'Jobs wants to sell Woz’s board…!'
				}
			]
		},
		{
			id: 'garage',
			title: 'Garage',
			ko: '차고',
			years: '1976–1980',
			summary: 'A van and a calculator, fifty boards, a grown-up investor, the Apple II and an IPO that makes enemies.',
			episodes: [
				{
					title: 'Van and Calculator',
					ko: '밴과 계산기',
					year: 'April 1976',
					hook: 'Jobs sold his van and Woz sold his calculator, and that was Apple’s capital.',
					beats: [
						'Woz, at HP, offers the design to his employer first. HP says no.',
						'Apple Computer is founded on April Fools’ Day with Ronald Wayne, who draws a logo of Newton under a tree.',
						'Eleven days later Wayne sells his ten percent back for $800.',
						'Plant: the Atari Breakout job, where Jobs told Woz they’d made $700, not $5,000.'
					],
					next: 'A store wants fifty computers…!'
				},
				{
					title: 'Fifty Boards',
					ko: '오십 장',
					year: '1976',
					hook: 'The Byte Shop ordered fifty assembled computers, and Apple had no money for parts.',
					beats: [
						'Paul Terrell wants finished machines, not kits. $500 each.',
						'Jobs talks a supplier into thirty days’ credit on the strength of the order.',
						'The Jobs family garage: Patty, Jobs’s sister, inserts chips; friends solder; Woz debugs.',
						'They deliver. Terrell is a little alarmed by the wooden cases.'
					],
					next: 'Woz is designing the second one. It has colour…!'
				},
				{
					title: 'Apple II',
					ko: '애플 II',
					year: '1977',
					hook: 'Mike Markkula retired at thirty-three, met two scruffy kids, and un-retired.',
					beats: [
						'The Apple II: colour, sound, a plastic case, expansion slots. Woz’s masterpiece.',
						'Markkula invests $250,000 and writes a business plan: Apple will be a Fortune 500 company in ten years.',
						'West Coast Computer Faire: Apple’s booth looks like a company.',
						'In 1979 two programmers write VisiCalc, a spreadsheet, for the Apple II. Accountants start buying computers.'
					],
					next: 'Xerox wants to invest. Jobs has a condition…!'
				},
				{
					title: 'PARC',
					ko: '파크',
					year: 'December 1979',
					hook: 'Xerox invested in Apple and let Jobs look around the lab, which was the most expensive tour in history.',
					beats: [
						'In exchange for buying pre-IPO shares, Xerox lets Apple see the Palo Alto Research Center.',
						'Adele Goldberg refuses. Her bosses order her to show it.',
						'The Alto: a mouse, overlapping windows, icons, a bitmapped screen. Larry Tesler demonstrates.',
						'Jobs jumps around the room. “Why aren’t you doing anything with this? This is the greatest thing!” In the car home: “That’s it.”'
					],
					next: 'Apple goes public. Not everyone gets shares…!'
				},
				{
					title: 'IPO',
					ko: '상장',
					year: 'December 1980',
					hook: 'Apple went public and made three hundred millionaires, and not Daniel Kottke.',
					beats: [
						'The largest IPO since Ford. Jobs is worth $256 million at twenty-five.',
						'His college friend Kottke, employee number twelve, gets no stock options. Jobs won’t give him any.',
						'Woz sells his own shares cheap to early employees: the “Woz Plan.”',
						'Jobs is denying paternity of a baby girl named Lisa while Apple builds a computer called the Lisa.'
					],
					next: 'In Boca Raton, IBM wants a personal computer in a year…!'
				}
			]
		},
		{
			id: 'neighbour',
			title: 'The Neighbour',
			ko: '이웃',
			years: '1980–1983',
			summary: 'IBM chooses an operating system, Gates buys one, and the Mac is born as a pirate ship.',
			episodes: [
				{
					title: 'Boca Raton',
					ko: '보카 레이턴',
					year: '1980',
					hook: 'IBM came to Gary Kildall for an operating system, and Gary Kildall was flying his plane.',
					beats: [
						'IBM’s secret team needs a language and an OS. Microsoft has BASIC; for the OS, Gates sends them to Digital Research.',
						'Kildall is out flying (legend; he says he came back that afternoon). His wife won’t sign IBM’s non-disclosure agreement.',
						'IBM comes back to Gates. Allen finds QDOS, the “Quick and Dirty Operating System,” at Seattle Computer Products, and buys it for $50,000.',
						'Gates’s clause: IBM gets a license, not ownership. Microsoft can sell it to anyone.'
					],
					next: 'IBM ships the PC. Apple takes out a full-page ad…!'
				},
				{
					title: 'Welcome, IBM',
					ko: '환영합니다, IBM',
					year: 'August 1981',
					hook: 'Apple took out a full-page ad welcoming IBM, which was very confident and very wrong.',
					beats: [
						'“Welcome, IBM. Seriously.” Apple thinks it’s already won.',
						'Every company in the world wants an IBM-compatible computer. Every one needs MS-DOS.',
						'Gates works through nights, sleeps under his desk, memorises employees’ licence plates to see who’s in.',
						'Allen is diagnosed with Hodgkin’s lymphoma.'
					],
					next: 'Jobs has been kicked off the Lisa. He finds a smaller project…!'
				},
				{
					title: 'The Pirate Flag',
					ko: '해적 깃발',
					year: '1981–1983',
					hook: 'Jobs hijacked Jef Raskin’s little computer project and raised a pirate flag over the building.',
					beats: [
						'Raskin started the Macintosh as a cheap appliance. Jobs takes it over and pushes Raskin out.',
						'Andy Hertzfeld, Burrell Smith, Susan Kare, Bud Tribble. Tribble coins the “reality distortion field.”',
						'“It’s better to be a pirate than to join the navy.” A skull and crossbones flies over Bandley 3.',
						'Microsoft is writing applications for the Mac. Gates sees all of it.'
					],
					next: 'Overheard in an office in Seattle…!'
				},
				{
					title: 'Overheard',
					ko: '엿들은 대화',
					year: '1982',
					hook: 'Paul Allen, back from radiation, heard his partners talking about him through a door.',
					beats: [
						'Gates and Ballmer discuss diluting Allen’s share. Allen is in remission and walking down the hall.',
						'He walks in. They apologise.',
						'He leaves the company the next year, keeping his shares, which will make him one of the richest men alive.',
						'Nobody shouts. The narrator says some endings are just doors.'
					],
					next: 'Jobs needs a CEO. He wants the president of Pepsi…!'
				},
				{
					title: 'Sugar Water',
					ko: '설탕물',
					year: '1983',
					hook: 'Jobs asked John Sculley if he wanted to sell sugar water for the rest of his life.',
					beats: [
						'Months of courtship. Walks in Central Park. A view from the San Remo.',
						'The line. Sculley says later he felt he’d been punched in the stomach.',
						'He comes to Apple. For a year the two of them are inseparable.',
						'November 1983: Microsoft announces Windows.'
					],
					next: 'Jobs summons Gates to Cupertino…!'
				},
				{
					title: 'The TV Set',
					ko: '텔레비전',
					year: 'November 1983',
					hook: 'Jobs screamed at Gates in front of ten Apple employees, and Gates told him about the neighbour.',
					beats: [
						'Jobs: “You’re ripping us off! I trusted you!”',
						'Gates, calm: “More like we both had this rich neighbour named Xerox, and I broke in to steal the TV and found you’d already stolen it.”',
						'The room goes quiet.',
						'Jobs asks to see Windows. Gates shows him. Jobs says it’s shit. Gates: “Yes, it’s a nice piece of shit.”'
					],
					next: 'January 1984. Big Brother on the Super Bowl…!'
				}
			]
		},
		{
			id: 'hello',
			title: 'Hello',
			ko: '헬로',
			years: '1984–1985',
			summary: 'The Mac is launched, sales disappoint, and the board chooses Sculley.',
			episodes: [
				{
					title: '1984',
					ko: '1984',
					year: 'January 1984',
					hook: 'A woman threw a hammer at Big Brother during the Super Bowl, and the board had wanted to cancel it.',
					beats: [
						'Ridley Scott’s ad, shown once nationally. The board hated it; Woz offered to pay half.',
						'Two days later, Flint Center. Jobs pulls the Mac from a bag. It speaks: “Hello, I’m Macintosh. Never trust a computer you can’t lift.”',
						'Five minutes of standing ovation. Jobs cries.',
						'Plant: Big Brother was IBM. Thirteen years later the giant face on the screen will be Gates’s.'
					],
					next: 'Sales are slow…!'
				},
				{
					title: 'The Board',
					ko: '이사회',
					year: 'May 1985',
					hook: 'Jobs planned a coup against Sculley while Sculley was in China, and Sculley didn’t go to China.',
					beats: [
						'The Mac is slow and has too little memory. Sales fall. Jobs blames Sculley; Sculley blames Jobs.',
						'Jobs plots to remove him during a trip. Jean-Louis Gassée tells Sculley.',
						'Sculley confronts him in the executive meeting. Everyone around the table picks Sculley.',
						'Jobs is stripped of all duties. He goes to sit in an empty office the staff call Siberia.'
					],
					next: 'Thirty, worth a fortune, and fired…!'
				}
			]
		},
		{
			id: 'wilderness',
			title: 'Wilderness',
			ko: '광야',
			years: '1985–1996',
			summary: 'One man wanders; the other conquers. A black cube, a cartoon cowboy and the Rolling Stones.',
			episodes: [
				{
					title: 'NeXT',
					ko: '넥스트',
					year: '1985–1990',
					hook: 'Jobs started a company to make a perfect black cube, and nobody bought it.',
					beats: [
						'He quits Apple and takes five people. Apple sues.',
						'The NeXT Computer: a magnesium cube, an optical drive, a beautiful operating system. Too expensive.',
						'A British scientist at CERN uses one to write the first web server.',
						'He buys a little graphics company from George Lucas for $10 million. It makes short cartoons.'
					],
					next: 'Apple sues Microsoft over the look and feel…!'
				},
				{
					title: 'Look and Feel',
					ko: '룩 앤 필',
					year: '1985–1994',
					hook: 'Sculley signed a license letting Microsoft use the Mac’s ideas, and then sued them for using the Mac’s ideas.',
					beats: [
						'1985: to keep Microsoft writing Mac software, Apple licenses visual elements to Windows 1.0.',
						'1988: Apple sues over Windows 2.0. The license covers almost everything.',
						'1994: Apple loses.',
						'Windows 3.0 sells ten million copies. Gates is the richest man in America.'
					],
					next: 'Start me up…!'
				},
				{
					title: 'Start Me Up',
					ko: '스타트 미 업',
					year: '1995',
					hook: 'Microsoft paid the Rolling Stones for a song about starting things, and people queued at midnight for software.',
					beats: [
						'Windows 95. The Start button. The Empire State Building lit in Windows colours.',
						'Apple is losing a billion dollars a year. CEOs come and go.',
						'In November, Toy Story opens. Pixar’s IPO makes Jobs a billionaire.',
						'He meets Laurene Powell at a lecture and skips a business dinner to take her out.'
					],
					next: 'Apple needs an operating system, and it’s run out of ideas…!'
				}
			]
		},
		{
			id: 'return',
			title: 'The Return',
			ko: '귀환',
			years: '1996–1997',
			summary: 'Apple buys NeXT, Jobs takes over, and makes the phone call nobody expected.',
			episodes: [
				{
					title: 'The Purchase',
					ko: '인수',
					year: 'December 1996',
					hook: 'Apple bought NeXT for $429 million to get its software, and got its founder back free.',
					beats: [
						'Gil Amelio picks NeXT over Be.',
						'Jobs comes back as an “adviser.” Within months the board has a new favourite.',
						'Amelio is out in July 1997. Jobs is interim CEO. iCEO, he says.',
						'Apple has ninety days of cash.'
					],
					next: 'Jobs picks up the phone and calls Seattle…!'
				},
				{
					title: 'Macworld',
					ko: '맥월드',
					year: 'August 1997',
					hook: 'Jobs announced that Microsoft was saving Apple, and then Bill Gates’s face appeared ten metres high behind him.',
					beats: [
						'The deal: $150 million in non-voting stock, Office for Mac for five years, the lawsuits settled.',
						'Boston. The audience boos at the name.',
						'Gates appears live on the giant screen. Jobs looks tiny under him. He later says it was his worst staging ever.',
						'“We have to let go of this notion that for Apple to win, Microsoft has to lose.”'
					],
					next: 'Here’s to the crazy ones…!'
				},
				{
					title: 'Think Different',
					ko: '다르게 생각하라',
					year: '1997–1998',
					hook: 'Apple had nothing new to sell, so it sold a list of dead geniuses.',
					beats: [
						'The ad: Einstein, Gandhi, Picasso, “Here’s to the crazy ones.”',
						'Jobs cuts the product line from dozens to four.',
						'The iMac: translucent blue, no floppy drive. The company lives.',
						'In Washington, the US government sues Microsoft.'
					],
					next: 'Ten years later, the two of them share a stage…!'
				}
			]
		},
		{
			id: 'road',
			title: 'Epilogue: The Road Ahead',
			ko: '에필로그: 앞으로의 길',
			years: '2007–2011',
			summary: 'Two old rivals on a stage, then in a garden.',
			episodes: [
				{
					title: 'D5',
					ko: 'D5',
					year: 'May 2007',
					hook: 'They sat in two red chairs, and the interviewer asked what they’d learned from each other.',
					beats: [
						'Gates: “I’d give a lot to have Steve’s taste.” Jobs laughs.',
						'They joke about the old days. The audience loves it.',
						'Jobs, at the end: “You and I have memories longer than the road that stretches out ahead.”',
						'The iPhone is five months old.'
					],
					next: 'One last meeting…!'
				},
				{
					title: 'The Garden',
					ko: '정원',
					year: '2011',
					hook: 'Bill Gates came to Palo Alto, and they sat in the garden for three hours.',
					beats: [
						'Jobs is very ill. Gates visits.',
						'They talk about their families, the old days, being wrong.',
						'Jobs: the integrated way worked; Gates: so did ours.',
						'October. The narrator closes on a blinking cursor.'
					],
					death: 'Steve Jobs',
					next: 'THE END. Paul Allen kept a guitar Jimi Hendrix played. That’s another story…!'
				}
			]
		}
	],
	themes: [
		{
			title: 'Who owns an idea',
			body: [
				'Altair BASIC is copied by hobbyists. Xerox’s windows are copied by Apple. Apple’s windows are copied by Microsoft. Everyone is a thief and everyone is outraged. The neighbour line is the whole book.'
			]
		},
		{
			title: 'Integration versus licence',
			body: [
				'Jobs controls everything, the hardware and the software, and makes beautiful machines few people can afford. Gates licenses to everyone and wins the world. The book argues both, and the epilogue says both worked.'
			]
		},
		{
			title: 'The friend you leave behind',
			body: [
				'Woz, Allen, Kottke, Raskin, Wayne, Kildall. Every winner steps on a friend. The book keeps cutting back to them.'
			]
		},
		{
			title: 'Big Brother',
			body: [
				'The 1984 ad casts IBM as Big Brother. By 1997 the face on the giant screen is Gates. Every rebel becomes the establishment the next rebel attacks.'
			]
		}
	],
	arcs: [
		{
			who: 'Steve Jobs',
			steps: ['The garage', 'PARC', 'The pirate flag', '“Hello”', 'Fired', 'NeXT and Pixar', 'The call', 'Think Different', 'The garden'],
			mirror: 'Cyrus in Shahanshah: the exposed child (adopted) who returns to take everything.'
		},
		{
			who: 'Bill Gates',
			steps: ['The bluff', 'The open letter', 'The license clause', 'The neighbour', 'Start me up', 'The face on the screen', 'D5'],
			mirror: 'Wang Geon in Reignmaker: wins with contracts and patience, not genius.'
		},
		{
			who: 'Paul Allen',
			steps: ['Sees the cover', 'The loader', 'QDOS', 'Cancer', 'Overheard', 'Leaves rich'],
			mirror: 'Bao Shuya in Five Hegemons, inverted: the friend who saw it first and wasn’t known.'
		}
	],
	plants: [
		{ plant: 'Allen writes the loader on the plane.', payoff: 'He buys QDOS, the OS that makes Microsoft.' },
		{ plant: 'Jobs underpays Woz on the Breakout job.', payoff: 'Woz gives his own stock away.' },
		{ plant: 'Adele Goldberg says don’t show him.', payoff: 'The rich neighbour named Xerox.' },
		{ plant: 'The license clause in the IBM deal.', payoff: 'Windows 95.' },
		{ plant: 'The 1984 ad casts Big Brother on a giant screen.', payoff: 'Gates’s face at Macworld 1997.' },
		{ plant: 'Sculley signs the 1985 licence to Microsoft.', payoff: 'Apple loses the look-and-feel lawsuit.' },
		{ plant: 'Jobs buys a little cartoon studio.', payoff: 'Toy Story makes him a billionaire before Apple takes him back.' }
	],
	timeline: [
		{ year: '1975', text: 'Altair 8800 on the cover; Altair BASIC demonstrated; Microsoft founded; Homebrew Computer Club.' },
		{ year: '1976', text: 'Open Letter to Hobbyists; Apple founded; Apple I.' },
		{ year: '1977', text: 'Apple II; Markkula invests.' },
		{ year: '1979', text: 'VisiCalc; the Xerox PARC visit.' },
		{ year: '1980', text: 'IBM deal; QDOS purchased; Apple IPO.' },
		{ year: '1981', text: 'IBM PC launched; Jobs takes over the Mac project.' },
		{ year: '1983', text: 'Allen leaves Microsoft; Lisa launched; Sculley joins Apple; Windows announced.' },
		{ year: '1984', text: 'The 1984 ad; the Macintosh.' },
		{ year: '1985', text: 'Jobs ousted; NeXT founded; Windows 1.0; Apple–Microsoft licence.' },
		{ year: '1986', text: 'Jobs buys Pixar.' },
		{ year: '1988', text: 'Apple sues Microsoft.' },
		{ year: '1990', text: 'Windows 3.0.' },
		{ year: '1995', text: 'Windows 95; Toy Story; Pixar IPO.' },
		{ year: '1996', text: 'Apple buys NeXT.' },
		{ year: '1997', text: 'Jobs interim CEO; Microsoft investment at Macworld; Think Different.' },
		{ year: '1998', text: 'iMac; United States v. Microsoft.' },
		{ year: '2007', text: 'D5 joint interview; iPhone.' },
		{ year: '2011', text: 'Jobs dies.' },
		{ year: '2018', text: 'Paul Allen dies.' }
	],
	sources: [
		{ title: 'Walter Isaacson, Steve Jobs (2011)', body: ['The authorised biography: Jobs’s voice, the Sculley courtship, the board fight, the return.'] },
		{ title: 'Paul Allen, Idea Man (2011)', body: ['The plane, the loader, QDOS, the overheard conversation.'] },
		{ title: 'Andy Hertzfeld, Revolution in the Valley (2004)', body: ['The Mac team, the pirate flag, the Gates confrontation.'] },
		{ title: 'Steve Wozniak, iWoz (2006)', body: ['Homebrew, the Apple I and II, Breakout.'] },
		{ title: 'Stephen Manes and Paul Andrews, Gates (1993)', body: ['Early Microsoft and the IBM deal.'] },
		{ title: 'Pirates of Silicon Valley (1999)', body: ['The TNT film. Tone reference, not a source; avoid its framing.'] }
	],
	research: [
		{
			title: 'Hardware and software',
			body: [
				'1975 machines have no screen or keyboard; programs are loaded by toggling switches or feeding paper tape. By 1984 the Mac has a mouse and a graphical interface in 128 KB of memory. Keep the tech true: readers who know will notice.'
			]
		},
		{
			title: 'Real people',
			body: [
				'Most of the cast are alive or recently dead. Recorded quotes are sourced. Everything else marked “invented” or “paraphrase” must stay clearly dramatised, and nothing should be invented that damages a real person’s reputation beyond the record.'
			]
		},
		{
			title: 'Dress and look (production)',
			body: [
				'1970s: long hair, beards, jeans, bare feet, wood-panelled garages, brown and orange. 1980s: suits at Apple’s board, Mac team in T-shirts. 1990s: Jobs in black turtleneck, Gates in sweaters and big glasses. Screens glow: green phosphor, white Mac, blue Windows.'
			]
		}
	],
	places: [
		{ name: 'Harvard Square', now: 'Cambridge, Massachusetts', note: 'The magazine cover.' },
		{ name: 'MITS', now: 'Albuquerque, New Mexico', note: 'The Altair and the first Microsoft.' },
		{ name: 'The Jobs garage', now: 'Los Altos, California', note: 'The Apple I.' },
		{ name: 'Xerox PARC', now: 'Palo Alto, California', note: 'The demo.' },
		{ name: 'Bandley 3', now: 'Cupertino, California', note: 'The Mac team and its pirate flag.' },
		{ name: 'Flint Center', now: 'Cupertino', note: 'The Mac’s launch.' },
		{ name: 'Bellevue and Redmond', now: 'Washington', note: 'Microsoft.' },
		{ name: 'Boston Park Plaza', now: 'Boston', note: 'Macworld 1997.' }
	],
	contested: [
		'Whether Kildall was really out flying when IBM came. He said he met them that afternoon.',
		'How much the Mac team actually took from PARC versus invented. Much of the Mac interface was new.',
		'Whether the PARC visit was one or two visits, and who was there.',
		'Allen and Gates disagreed in print about the overheard conversation and about credit.',
		'Gates’s “640K” line is apocryphal and does not appear.'
	],
	invented: [
		'Signature lines marked “invented” or “paraphrase.”',
		'Private dialogue in scenes nobody recorded (the garden, the car).',
		'The narrator’s blinking-cursor close.'
	],
	production: [
		{
			title: 'Images',
			body: [
				'The image model may refuse named real people. Describe them by look, age and clothes, never by name, as in the four stills above.'
			]
		},
		{
			title: 'Look',
			body: [
				'Palette by era: 70s amber and brown, 80s beige plastic and rainbow Apple stripes, 90s black and Windows blue. Signature objects: the yellow legal pad, the paper tape, the wooden Apple I case, the mouse, the pirate flag, the giant screen.'
			]
		}
	]
};
