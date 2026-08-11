/**
 * Wiki encyclopedia → org-chart mapping.
 * Nation entries and cosmology get political / pantheon diagrams;
 * matching institution concepts reuse the same charts.
 */

export type WikiChartSpec = {
	diagram: string;
	step?: string;
	realm?: string;
	title: string;
	caption?: string;
	ko?: string;
};

const WIKI_CHARTS: Record<string, WikiChartSpec[]> = {
	'nation-silla': [
		{
			diagram: 'harmony-council',
			step: 'unanimous',
			title: 'The Harmony Council · 화백회의',
			caption:
				'Six Councillors around one motion. Only unanimity opens the gate — the political physics of Surabol.',
			ko: '소매 여섯이 한 안건을 둘러싼다. 만장일치만이 문을 연다 — 서라벌의 정치 물리.'
		},
		{
			diagram: 'bone-rank',
			step: 'ranks',
			title: 'Bone Rank · 골품제',
			caption: 'Six ranks of bone under one unreachable throne. The robe is the census.',
			ko: '닿을 수 없는 왕좌 아래 여섯 뼈의 등급. 관복이 호적이다.'
		}
	],
	'nation-baekje': [
		{
			diagram: 'ministers-assembly',
			step: 'court',
			title: 'Ministers’ Assembly · 정사암회의',
			caption:
				'Commons chamber: King at the helm, Premier on the aisle; 좌평 on front benches near the aisle, 달솔 on back benches outer — two facing sides.',
			ko: '왕이 의장석, 상좌평이 통로. 좌평은 통로 쪽 앞자리, 달솔은 벽쪽 뒷자리 — 양쪽이 마주 본다.'
		}
	],
	'nation-goguryeo': [
		{
			diagram: 'high-summit',
			step: 'council',
			title: 'The High Summit · 제가회의',
			caption:
				'Five Commanderies argue as Commanders; the High Commander is first sword; the king keeps the final vote.',
			ko: '오부가 대가로 다툰다. 막리지가 첫 칼이고, 임금이 최종 투표를 쥔다.'
		}
	],
	'nation-tang': [
		{
			diagram: 'tang-departments',
			step: 'machine',
			title: 'Three Departments & Six Ministries · 三省六部',
			caption:
				'Emperor above; Zhengshitang where ministers meet; Zhongshu drafts, Menxia reviews, Shangshu executes through six boards.',
			ko: '황제 아래 정사당. 중서가 기안하고 문하가 심사하며 상서가 육부로 집행한다.'
		},
		{
			diagram: 'four-dragons',
			title: 'Four Dragons · 사룡',
			caption: 'Taizong’s dragon generals — White, Red, Blue, and Black Dragons for the Liao roads.',
			ko: '태종의 사룡 — 백·적·청·흑룡, 요동길의 네 깃발.'
		},
		{
			diagram: 'four-beasts',
			title: 'Four Beasts · 사신',
			caption: 'Gaozong’s beast roster — only the Blue Dragon served under both emperors.',
			ko: '고종의 사신 — 청룡만이 두 황제 모두의 장수였다.'
		}
	],
	'nation-joseon': [
		{
			diagram: 'joseon-mandate',
			title: 'Old Joseon · 고조선',
			caption: 'Heaven’s mandate made into a capital: Hwanin → Hwanung → Dangun → Asadal.',
			ko: '하늘의 명을 수도로 만든 계보. 환인 → 환웅 → 단군 → 아사달.'
		}
	],
	'nation-gaya': [
		{
			diagram: 'gaya-league',
			title: 'Gaya Confederacy · 가야',
			caption:
				'Not one crown — a league of iron harbours. Six courts for the chronicle’s mnemonic; the ground is denser.',
			ko: '왕관 하나가 아니다 — 철과 항구의 연맹. 여섯은 기억법이고, 땅은 더 빽빽하다.'
		}
	],
	'nation-tamla': [
		{
			diagram: 'tamla-princes',
			title: 'Three Princes · 삼성혈',
			caption:
				'Three divine princes rise from Samseonghyeol and divide the orange island — myths that name the Three Realms.',
			ko: '삼성혈에서 세 신인이 나와 탐라를 나눈다 — 삼계를 이름 붙이는 섬의 신화.'
		}
	],
	'nation-underworld': [
		{
			diagram: 'pantheon',
			step: 'courts',
			realm: 'underworld',
			title: 'Underworld Court · 저승',
			caption:
				'Big Star keeps the orderly dark. Within: Yumla judges; Kangrim and Haewonmek fetch.',
			ko: '대별왕이 질서 있는 어둠을 지킨다. 안에서 염라가 판결하고, 강림과 해원맥이 데려온다.'
		}
	],
	four_divisions: [
		{
			diagram: 'pantheon',
			step: 'courts',
			title: 'The Three Realms · 삼계',
			caption:
				'Hwanin the Creator above; below — Living (Little Star), Dead (Big Star), Western Flower Field (Hallakgungi). Heaven is not a fourth peer realm.',
			ko: '창조주 환인이 위에 있고, 아래에 이승(소별왕)·저승(대별왕)·서천꽃밭(할락궁이)이 있다. 하늘나라는 네 번째 계가 아니다.'
		}
	],

	harmonycouncil: [
		{
			diagram: 'harmony-council',
			step: 'unanimous',
			title: 'The Harmony Council · 화백회의',
			caption: 'Six Councillors around one motion. Initial vote, deliberation, final vote — only unanimity opens the gate.',
			ko: '소매 여섯이 한 안건을 둘러싼다. 초투표, 숙고, 최종 투표 — 만장일치만이 문을 연다.'
		}
	],
	bonerank: [
		{
			diagram: 'bone-rank',
			step: 'ranks',
			title: 'Bone Rank · 골품제',
			caption: 'Six ranks of bone under one unreachable point. The robe is the census; the pyramid is the country.',
			ko: '닿을 수 없는 꼭짓점 하나 아래 여섯 뼈의 등급. 관복이 호적이고, 피라미드가 나라다.'
		}
	],
	royalsecretariat: [
		{
			diagram: 'royal-secretariat',
			title: 'The Royal Secretariat · 집사부',
			caption:
				'Never Enough — fourteen Silla ministries under one 시중. Tang’s 三省六部 copied and exceeded.',
			ko: '결코 충분하지 않다 — 시중 아래 열네 부. 당의 삼성육부를 본따 더했다.'
		}
	],
	eightclans: [
		{
			diagram: 'ministers-assembly',
			step: 'clans',
			title: 'Eight Great Clans · 대성팔족',
			caption:
				'The eight houses sit in the Ministers’ Assembly Commons — King at the helm; 좌평 front benches near the aisle, 달솔 back benches outer; two facing sides.',
			ko: '여덟 가문은 정사암 회의의 양쪽에 앉는다 — 왕이 의장석, 좌평은 통로 쪽, 달솔은 벽쪽.'
		}
	],
	ministersassembly: [
		{
			diagram: 'ministers-assembly',
			step: 'court',
			title: 'Ministers’ Assembly · 정사암회의',
			caption:
				'King at the helm, Premier on the aisle; Senior Ministers (좌평) on front benches near the aisle, Junior Ministers (달솔) on back benches outer — two facing sides.',
			ko: '왕이 의장석, 상좌평이 통로. 좌평은 통로 쪽 앞자리, 달솔은 벽쪽 뒷자리 — 양쪽이 마주 본다.'
		}
	],
	highsummit: [
		{
			diagram: 'high-summit',
			step: 'council',
			title: 'The High Summit · 제가회의',
			caption: 'Commanders (대가) under a High Commander (막리지) — the king keeps the final vote.',
			ko: '대가가 막리지 아래 모인다. 임금이 최종 투표를 쥔다.'
		}
	],
	hwarang: [
		{
			diagram: 'hwarang',
			title: 'The Hwarang · 화랑',
			caption: '국선 (Marshal) at the apex — six 화랑, four 낭도 beneath each (24 disciples).',
			ko: '국선 아래 여섯 화랑, 각 화랑 아래 낭도 넷 — 스물네 제자.'
		}
	],
	restorationarmy: [
		{
			diagram: 'restoration-army',
			title: 'Baekje Restoration Army · 백제부흥군',
			caption: 'A king at the apex and four generals beneath — the restoration command stack.',
			ko: '왕 아래 네 장군 — 부흥군의 지휘 줄.'
		}
	],
	tangcourt: [
		{
			diagram: 'tang-departments',
			step: 'machine',
			title: 'Three Departments & Six Ministries · 三省六部',
			caption:
				'Emperor above; Zhengshitang where ministers meet; Zhongshu drafts, Menxia reviews, Shangshu executes through six boards.',
			ko: '황제 아래 정사당. 중서가 기안하고 문하가 심사하며 상서가 육부로 집행한다.'
		}
	],
	fourdragons: [
		{
			diagram: 'four-dragons',
			title: 'Four Dragons · 사룡',
			caption: 'Second Emperor Taizong’s dragon generals — the Blue Dragon alone survives into the beast roster.',
			ko: '서토 황제의 사룡 — 청룡만이 사신으로도 남는다.'
		}
	],
	fourbeasts: [
		{
			diagram: 'four-beasts',
			title: 'Four Beasts · 사신',
			caption: 'Third Emperor Gaozong’s beast generals — Li Shiji’s Blue Dragon served both dragon and beast musters.',
			ko: '제3황제의 사신 — 이세적 청룡은 사룡과 사신 모두에 섰다.'
		}
	],
	tangexpedition: [
		{
			diagram: 'tang-departments',
			step: 'flow',
			title: 'Tang Eastern Expedition · 당 동정군',
			caption: 'Expeditionary command stack — draft, review, execute east.',
			ko: '동정군의 명령 줄 — 기안, 심사, 집행.'
		}
	]
};

/** Org charts to show on a wiki entry, if any. */
export function chartsForWikiEntry(id: string): WikiChartSpec[] {
	return WIKI_CHARTS[id] ?? [];
}

/** True when the rich SVG diagram replaces the flat org-chart tree in detail view. */
export function hasDiagramChart(id: string): boolean {
	return chartsForWikiEntry(id).length > 0;
}
