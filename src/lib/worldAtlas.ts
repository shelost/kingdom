/**
 * A live census of the contained universe — one place that names every room
 * the app already has, with counts taken from the same files the rooms read.
 * No parallel CMS: if a number moves, this page moves.
 */
import { BATTLES } from '$lib/battles';
import { VOLUMES } from '$lib/books';
import { PARTS, EPISODE_TOTAL, STORY_RANGE } from '$lib/episodeDirectory';
import { FLAG_IDS } from '$lib/flags';
import { LEITMOTIFS } from '$lib/leitmotifs';
import { KINGDOMS, PROFILES, type Person } from '$lib/people';
import { PLACES } from '$lib/places';
import { CHART_NODES } from '$lib/relations';
import { IMAGES as RESEARCH_IMAGES, MUSEUMS } from '$lib/research';
import { SCENES } from '$lib/scenes';
import { QUOTE_TOTAL } from '$lib/quotes';
import { chapters } from '$lib/story';
import { SWORD_DEFS } from '$lib/swords';
import { kindOf, WIKI_KINDS, WIKI_KINGDOMS, WIKI_TOTAL } from '$lib/wiki';
import { WIKI_BOOKS, wikiBookCount, type WikiBookId } from '$lib/wikiBooks';

export type WorldCopy = { en: string; ko: string };

export type WorldDoor = {
	href: string;
	icon: string;
	title: WorldCopy;
	lede: WorldCopy;
	count?: number;
	unit?: WorldCopy;
};

export type WorldLayer = {
	id: string;
	title: WorldCopy;
	note: WorldCopy;
	doors: WorldDoor[];
};

export type WorldKingdom = {
	id: Person['kingdom'];
	label: string;
	korean?: string;
	color: string;
	flag?: string;
	people: number;
};

export type WorldKindRow = {
	id: WikiBookId;
	title: string;
	ko: string;
	count: number;
	href: string;
};

function copy(en: string, ko: string): WorldCopy {
	return { en, ko };
}

function stillsWithArt(): number {
	let n = 0;
	for (const ch of chapters) {
		for (const entry of ch.entries) {
			for (const im of entry.images ?? []) {
				if (im.hidden) continue;
				if (im.tempImage || im.src) n += 1;
			}
		}
	}
	return n;
}

function wordsInBook(): number {
	let n = 0;
	for (const part of PARTS) {
		for (const arc of part.arcs) {
			for (const ep of arc.episodes) n += ep.words;
		}
	}
	return n;
}

function peopleOfKingdom(id: Person['kingdom']): number {
	return PROFILES.filter((p) => {
		if (p.kingdom !== id) return false;
		const k = kindOf(p);
		return k === 'character' || k === 'god';
	}).length;
}

export const WORLD_RANGE = STORY_RANGE;
export const WORLD_EPISODES = EPISODE_TOTAL;
export const WORLD_WORDS = wordsInBook();
export const WORLD_PARTS = PARTS.length;
export const WORLD_VOLUMES = VOLUMES.length;
export const WORLD_WIKI = WIKI_TOTAL;
export const WORLD_STILLS = stillsWithArt();
export const WORLD_PLACES = Object.values(PLACES).filter((p) => p.kind !== 'room').length;
export const WORLD_ROOMS = Object.values(PLACES).filter((p) => p.kind === 'room').length;
export const WORLD_BATTLES = Object.keys(BATTLES).length;
export const WORLD_SWORDS = SWORD_DEFS.length;
export const WORLD_FLAGS = FLAG_IDS.length;
export const WORLD_SCENES = SCENES.length;
export const WORLD_MOTIFS = Object.keys(LEITMOTIFS).length;
export const WORLD_RESEARCH = RESEARCH_IMAGES.length;
export const WORLD_MUSEUMS = MUSEUMS.length;
export const WORLD_BONDS = CHART_NODES.length;

export const WORLD_CENSUS: { n: number; unit: WorldCopy }[] = [
	{ n: WORLD_EPISODES, unit: copy('episodes', '화') },
	{ n: WORLD_WORDS, unit: copy('words', '단어') },
	{ n: WORLD_WIKI, unit: copy('wiki entries', '위키 항목') },
	{ n: WORLD_STILLS, unit: copy('stills', '장면') },
	{ n: WORLD_PLACES, unit: copy('places', '땅') },
	{ n: WORLD_BATTLES, unit: copy('battles', '전투') }
];

export const WORLD_KINGDOMS: WorldKingdom[] = WIKI_KINGDOMS.map((id) => {
	const k = KINGDOMS[id];
	return {
		id,
		label: k.label,
		korean: k.korean,
		color: k.color,
		flag: k.flag,
		people: peopleOfKingdom(id)
	};
});

export const WORLD_SPINE = PARTS.map((part) => ({
	id: part.id,
	label: part.label,
	title: part.title,
	korean: part.korean,
	range: part.range,
	count: part.count
}));

export const WORLD_KINDS: WorldKindRow[] = WIKI_BOOKS.filter((b) => b.id !== 'all' && wikiBookCount(b.id) > 0).map((b) => ({
	id: b.id,
	title: b.title,
	ko: b.ko,
	count: wikiBookCount(b.id),
	href: `/wiki?type=${b.id}`
}));

/** Kind labels used in the census line under wiki doors. */
export const WORLD_KIND_TOTALS = Object.fromEntries(WIKI_KINDS.map((k) => [k.id, wikiBookCount(k.id)])) as Record<
	string,
	number
>;

export const WORLD_LAYERS: WorldLayer[] = [
	{
		id: 'chronicle',
		title: copy('The chronicle', '이야기'),
		note: copy('The book itself: scenes, volumes, the reading order.', '책 자체다. 장면, 권, 읽는 순서.'),
		doors: [
			{
				href: '/read',
				icon: 'auto_stories',
				title: copy('Read', '읽기'),
				lede: copy('The script, in the order it is told.', '적힌 대로, 이야기되는 순서로.'),
				count: WORLD_EPISODES,
				unit: copy('episodes', '화')
			},
			{
				href: '/episodes',
				icon: 'video_library',
				title: copy('Episodes', '에피소드'),
				lede: copy('Every part, arc and chapter, as a series page.', '부와 편과 장을 시리즈처럼.'),
				count: WORLD_PARTS,
				unit: copy('parts', '부')
			},
			{
				href: '/books',
				icon: 'library_books',
				title: copy('Books', '책'),
				lede: copy('The tankōbon shelf: one cloth volume per chapter.', '장마다 한 권. 책장에 세워 둔다.'),
				count: WORLD_VOLUMES,
				unit: copy('volumes', '권')
			}
		]
	},
	{
		id: 'land',
		title: copy('The land', '땅'),
		note: copy(
			'One map. Borders move year by year. Fortresses, rivers, caverns and the battles drawn on them.',
			'지도는 하나다. 국경은 해마다 움직인다. 성, 강, 동굴, 그 위에 그린 전투.'
		),
		doors: [
			{
				href: '/map',
				icon: 'map',
				title: copy('Map', '지도'),
				lede: copy('The peninsula as a year. Drag the era; the kingdoms swell and shrink.', '해를 굴리면 나라가 늘고 준다.'),
				count: WORLD_PLACES,
				unit: copy('places', '땅')
			},
			{
				href: '/wiki?type=city',
				icon: 'location_city',
				title: copy('Cities', '고을'),
				lede: copy('Capitals and fortresses, each with its painted board.', '도성과 산성. 저마다 그린 판이 있다.'),
				count: WORLD_KIND_TOTALS.city,
				unit: copy('cities', '고을')
			},
			{
				href: '/wiki?type=room',
				icon: 'meeting_room',
				title: copy('Rooms', '방'),
				lede: copy(
					'Recurring interiors: the study, the council, the hall of the massacre.',
					'되풀이되는 안채. 서재, 회의실, 학살의 대청.'
				),
				count: WORLD_ROOMS,
				unit: copy('rooms', '방')
			},
			{
				href: '/wiki?type=nation',
				icon: 'flag',
				title: copy('Nations', '나라'),
				lede: copy('The kingdoms and the banners they fly.', '나라와, 그 나라가 거는 깃발.'),
				count: WORLD_KIND_TOTALS.nation,
				unit: copy('nations', '나라')
			}
		]
	},
	{
		id: 'people',
		title: copy('The people', '사람'),
		note: copy(
			'Everyone who walks on: mortals, gods, clans, the chart of who owes whom.',
			'나오는 사람 전부. 사람, 신, 씨족, 누가 누구에게 빚진 자리.'
		),
		doors: [
			{
				href: '/wiki',
				icon: 'menu_book',
				title: copy('Wiki', '위키'),
				lede: copy('The encyclopedia: faces, places, swords, horses, phrases.', '백과. 얼굴, 땅, 칼, 말, 말.'),
				count: WORLD_WIKI,
				unit: copy('entries', '항목')
			},
			{
				href: '/characters',
				icon: 'hub',
				title: copy('Characters', '인물'),
				lede: copy('The relationship map. Drag a face; open a bond.', '인연의 지도. 얼굴을 잡고 연을 연다.'),
				count: WORLD_BONDS,
				unit: copy('on the chart', '도상의 얼굴')
			},
			{
				href: '/tree',
				icon: 'account_tree',
				title: copy('Tree', '가계'),
				lede: copy('Blood, marriage and foster roofs, drawn as a tree.', '피, 혼인, 길러 준 지붕.')
			}
		]
	},
	{
		id: 'time',
		title: copy('Time', '시간'),
		note: copy('The same years the map uses, laid as a score of lives.', '지도가 쓰는 그 해들. 삶들의 악보로 펼친다.'),
		doors: [
			{
				href: '/timeline',
				icon: 'view_timeline',
				title: copy('Timeline', '연표'),
				lede: copy('Lives as bars against the years. Hover a year; the room answers.', '해를 가로지르는 삶. 한 해에 손을 올리면 방이 답한다.'),
				count: WORLD_EPISODES,
				unit: copy('lives on the board', '연표 위 화')
			}
		]
	},
	{
		id: 'pictures',
		title: copy('Pictures', '그림'),
		note: copy(
			'Every still the chronicle holds, and the soundtrack scenes that play them.',
			'이야기가 가진 모든 장면, 그리고 그 장면을 틀어 주는 곡.'
		),
		doors: [
			{
				href: '/images',
				icon: 'photo_library',
				title: copy('Images', '장면'),
				lede: copy('The gallery of cue stills, in reading order.', '읽는 순서대로 늘어 둔 장면.'),
				count: WORLD_STILLS,
				unit: copy('stills', '장면')
			},
			{
				href: '/scenes',
				icon: 'album',
				title: copy('Scenes', '씬'),
				lede: copy('Still plus song: a feed of moments with their music.', '장면과 노래. 그 순간의 음악.'),
				count: WORLD_SCENES,
				unit: copy('scenes', '씬')
			}
		]
	},
	{
		id: 'sound',
		title: copy('Sound', '소리'),
		note: copy('Leitmotifs and the people they belong to.', '주제곡, 그리고 그 곡이 따라다니는 사람.'),
		doors: [
			{
				href: '/music',
				icon: 'music_note',
				title: copy('Music', '음악'),
				lede: copy('A theme for a person, a house, a death.', '사람, 집, 죽음에 붙는 가락.'),
				count: WORLD_MOTIFS,
				unit: copy('leitmotifs', '주제')
			}
		]
	},
	{
		id: 'cabinet',
		title: copy('The cabinet', '기물'),
		note: copy('Named blades, animals, the things a still has to get right.', '이름 있는 칼, 짐승, 장면이 틀리면 안 되는 것들.'),
		doors: [
			{
				href: '/wiki?type=sword',
				icon: 'swords',
				title: copy('Swords', '칼'),
				lede: copy('Ring-pommel blades, each tied to a hand.', '환두대도. 저마다 쥔 손이 있다.'),
				count: WORLD_SWORDS,
				unit: copy('blades', '칼')
			},
			{
				href: '/wiki?type=animal',
				icon: 'pets',
				title: copy('Animals', '짐승'),
				lede: copy('Horses, crows, the named beasts.', '말, 까마귀, 이름 있는 짐승.'),
				count: WORLD_KIND_TOTALS.animal,
				unit: copy('animals', '짐승')
			}
		]
	},
	{
		id: 'sources',
		title: copy('The record', '기록'),
		note: copy('Museum objects, murals and the books the story is arguing with.', '유물, 벽화, 이 이야기가 맞서 읽는 책.'),
		doors: [
			{
				href: '/research',
				icon: 'museum',
				title: copy('Research', '사료'),
				lede: copy('What they wore, from the objects that survive.', '남은 물건으로 본 옷.'),
				count: WORLD_RESEARCH,
				unit: copy('plates', '도판')
			},
			{
				href: '/quotes',
				icon: 'format_quote',
				title: copy('Quotes', '명대사'),
				lede: copy('Iconic lines, the record, and what you star while reading.', '명대사, 사료, 읽다 별표한 구절.'),
				count: QUOTE_TOTAL,
				unit: copy('quotes', '구절')
			}
		]
	},
	{
		id: 'workshop',
		title: copy('The workshop', '작업실'),
		note: copy('How the book is built. Not the world: the desk.', '책을 만드는 자리. 세계가 아니라 책상.'),
		doors: [
			{
				href: '/widgets',
				icon: 'widgets',
				title: copy('Widgets', '위젯'),
				lede: copy('The live pieces inside the script: cards, maps, records.', '스크립트 안의 산 조각. 카드, 지도, 기록.')
			},
			{
				href: '/about',
				icon: 'info',
				title: copy('About', '소개'),
				lede: copy('Why this story, and how the script, pictures and maps are made.', '왜 이 이야기인지, 글과 그림과 지도를 어떻게 만드는지.')
			},
			{
				href: '/dashboard',
				icon: 'monitoring',
				title: copy('Dashboard', '현황'),
				lede: copy('Pacing, stills, grip — the craft of each episode.', '호흡, 장면, 대화. 화마다의 손.')
			},
			{
				href: '/grade',
				icon: 'grading',
				title: copy('Grade', '채점'),
				lede: copy('Keep and cut notes on the stills.', '장면을 남길지 말지.')
			}
		]
	}
];
