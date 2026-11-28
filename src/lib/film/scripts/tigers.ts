/**
 * Back When Tigers Smoked. The book's own sentences, staged: the lids open on
 * the smoking tiger, a chariot falls out of heaven onto the white mountain and
 * its rider wakes to a gardener holding out a flower, the old kingdom falls,
 * the small kingdoms ink themselves onto the peninsula one by one, and the
 * three great ones rise over them. The gods stay a hint and are not named; the
 * man in the chariot is not named either.
 */
import type { StageSiteId } from '$lib/stage/sites';
import type { CutScene, FilmScript, Fx, MapFocus, MapPaint, PlateMove, Realm, ScriptBeat, StageShot, Visual } from '../types';
import type { PaperId } from '../paper/scenes';

const still = (id: string, move: PlateMove = 'push'): Visual => ({ kind: 'still', id, src: '', move });
const paper = (scene: PaperId): Visual => ({ kind: 'paper', scene });
const BLACK: Visual = { kind: 'black' };

function cam(site: StageSiteId, view: string, year: number, hour: number, shot: Partial<StageShot> = {}, people = false): Visual {
	return {
		kind: 'stage',
		site,
		year,
		hour,
		people,
		shot: { view, label: shot.label, dolly: shot.dolly ?? 0.16, orbit: shot.orbit ?? 12, rise: shot.rise, fov: shot.fov, build: shot.build }
	};
}

/** The tilted relief. The camera eases on from wherever the last map shot left it. */
function land(focus: MapFocus, paint: MapPaint = 'none', o: { lit?: Realm; arrows?: 'draw' | 'hold'; year?: number } = {}): Visual {
	return { kind: 'peninsula', focus, paint, lit: o.lit, arrows: o.arrows, year: o.year };
}

function card(en: string, ko: string, visual?: Visual, hold?: number, fx?: Fx[], enter?: ScriptBeat['enter']): ScriptBeat {
	return { kind: 'card', en, ko, visual, hold, fx, enter };
}

function title(en: string, ko: string, visual?: Visual, hold = 2.6, fx?: Fx[]): ScriptBeat {
	return { kind: 'title', en, ko, visual, hold, fx };
}

/** The gardener's lines, in the field between the living and the dead. */
function gardener(en: string, ko: string, hold: number, visual?: Visual): ScriptBeat {
	return { kind: 'line', person: 'sara', look: 'field', en, ko, hold, visual };
}

/** One of the three: the line zooms in, the name stands over the map, the palace rises, then the shadow box. */
function founding(
	realm: Realm,
	focus: MapFocus,
	line: [string, string],
	name: [string, string],
	palace: Visual,
	box: PaperId,
	fx: Fx[] = []
): ScriptBeat[] {
	return [
		card(line[0], line[1], land(focus, 'realms', { lit: realm }), 5.8, fx, 'fade'),
		title(name[0], name[1]),
		card('', '', palace, 6, fx, 'fade'),
		card('', '', paper(box), 5.2, undefined, 'fade')
	];
}

const SKY = { kind: 'stage' as const, site: 'skypalace' as const, year: 600, hour: 17, look: 'inkcolor' as const, people: false, shots: [{ view: 'highest', dolly: 0.12, orbit: 16, rise: 0.1 }] };

export const TIGERS: FilmScript = {
	look: 'watercolor',
	scenes: [],
	cut: [
		{
			label: 'Back when tigers smoked',
			ko: '호랑이 담배 피우던 시절',
			enter: 'wake',
			set: { kind: 'still' },
			fx: [
				{ id: 'fog', amount: 0.85 },
				{ id: 'wisps', amount: 0.7, color: '#d9d3c7', at: [0.56, 0.58] }
			],
			beats: [
				card('Back when tigers used to smoke...', '호랑이 담배 피우던 시절…', paper('tigers'), 6.4, [
					{ id: 'embers', amount: 0.55, color: '#e7d7bf', at: [0.58, 0.62] }
				])
			]
		},
		{
			label: 'Heaven',
			ko: '하늘',
			enter: 'fade',
			set: SKY,
			fx: [{ id: 'motes', amount: 0.65, color: '#ffe7a8' }],
			beats: [
				card('', '', cam('skypalace', 'highest', 600, 17, { dolly: 0.14, orbit: 16, rise: 0.1, fov: 46 }), 3.6, [{ id: 'stars', amount: 1 }]),
				card('', '', cam('skypalace', 'isles', 600, 17, { dolly: 0.2, orbit: -16, fov: 50 }), 2.8, undefined, 'fly'),
				card(
					'Heaven sent down a man to the earth.',
					'하늘이 사람 하나를 땅으로 내려보냈다.',
					{ kind: 'descent' },
					10.5,
					[
						{ id: 'speed', amount: 1.5, color: '#2a1c2c', at: [0.5, 0.5] },
						{ id: 'motes', amount: 0.5, color: '#ffe2a0' }
					],
					'fade'
				)
			]
		},
		{
			label: 'The gardener',
			ko: '정원사',
			enter: 'wake',
			set: { kind: 'still' },
			fx: [{ id: 'scent', amount: 0.9, color: '#f0e2a8', at: [0.5, 0.42] }],
			beats: [
				gardener('There you are.', '왔구나.', 2.4, { kind: 'still', src: '/temp/sunduk-wake-screen.jpg', move: 'push' }),
				gardener('Smell. Soul-Whole. The last one.', '맡아. 혼살이꽃. 맨 마지막이야.', 3),
				gardener('Awake. Good.', '깨어났네. 됐다.', 2.2),
				card(
					'He fell in love with a woman and produced a son, who established the first kingdom.',
					'그는 한 여인과 사랑에 빠져 아들을 낳았고, 그 아들이 첫 나라를 세웠다.',
					paper('love'),
					6.2,
					[
						{ id: 'petals', amount: 0.85, color: '#f3e2b0' },
						{ id: 'scent', amount: 1.15, color: '#f0e2a8', at: [0.5, 0.36] }
					],
					'fade'
				),
				card(
					'He ruled as the Wanggum — the King for All, and established cordial relations with all peoples, north, south, east, west.',
					'그는 왕검, 곧 모두의 왕으로 다스리며 동서남북 모든 백성과 사이좋게 지냈다.',
					paper('wanggum'),
					6.6,
					[{ id: 'wisps', amount: 0.45, color: '#e7c56a' }],
					'iris'
				)
			]
		},
		{
			label: '108 BC',
			ko: '기원전 108년',
			enter: 'fade',
			set: { kind: 'still' },
			fx: [],
			beats: [
				title('108 BC', '기원전 108년', BLACK, 2.6, [{ id: 'embers', amount: 0.35, color: '#ff8a3d' }]),
				card(
					'Then... invasion! A new Emperor arose in the west, sent an army, and destroyed the kingdom.',
					'그러다… 침략! 서쪽에서 새 황제가 일어나 군대를 보내 그 나라를 무너뜨렸다.',
					paper('invasion'),
					6.4,
					[
						{ id: 'speed', amount: 0.9, color: '#1a0806' },
						{ id: 'embers', amount: 1.3, color: '#ff8a3d' },
						{ id: 'rain', amount: 0.6 }
					],
					'flash'
				),
				card('', '', paper('refugees'), 4.6, [{ id: 'snow', amount: 0.5 }], 'fade'),
				card(
					'The people fled in all directions as refugees, establishing dozens of small new kingdoms.',
					'백성은 사방으로 흩어져 피란길에 올랐고, 수십 개의 작은 나라를 새로 세웠다.',
					land('wide', 'found', { arrows: 'draw' }),
					8.6,
					[{ id: 'snow', amount: 0.35 }],
					'fade'
				)
			]
		},
		{
			label: 'Three kingdoms',
			ko: '세 나라',
			enter: 'cut',
			set: { kind: 'still' },
			fx: [],
			beats: [
				card('Eventually, three great kingdoms arose among them.', '마침내 그 가운데 세 큰 나라가 일어섰다.', land('wide', 'rise'), 7.2),
				...founding(
					'goguryeo',
					'north',
					['In the mountains of the north... Five Tribes came together to form the kingdom of Goguryeo.', '북쪽 산골에서는… 다섯 부족이 모여 고구려를 세웠다.'],
					['Goguryeo', '고구려'],
					cam('jolbon', 'mesa', -37, 17, { label: 'hall', dolly: -0.45, orbit: 34, rise: 0.12, fov: 44, build: true }, true),
					'tribes',
					[{ id: 'fog', amount: 0.4 }]
				),
				...founding(
					'silla',
					'southeast',
					['In the plains of the southeast... Six Elders elected a new leader to form the kingdom of Silla.', '동남쪽 들판에서는… 여섯 촌장이 새 지도자를 뽑아 신라를 세웠다.'],
					['Silla', '신라'],
					cam('moon', 'board', 500, 21, { label: 'namdang', dolly: -0.45, orbit: 30, rise: 0.12, fov: 42, build: true }, true),
					'elders',
					[{ id: 'motes', amount: 0.45, color: '#f4e2a8' }]
				),
				...founding(
					'baekje',
					'southwest',
					['In the coasts of the southwest... Ten Attendants migrated down to form the kingdom of Baekje.', '서남쪽 바닷가에서는… 열 신하가 남쪽으로 내려와 백제를 세웠다.'],
					['Baekje', '백제'],
					cam('wirye', 'gate', 18, 6, { label: 'royal', dolly: -0.45, orbit: 30, rise: 0.12, fov: 44, build: true }, true),
					'attendants',
					[{ id: 'fog', amount: 0.3, color: '#e7d7b0' }]
				),
				card(
					'Together, they came to be known as Samhan (the Three Hans).',
					'이 세 나라를 함께 일러 삼한이라 했다.',
					land('wide', 'realms'),
					6.2,
					[{ id: 'motes', amount: 0.35, color: '#f4e2a8' }],
					'fade'
				)
			]
		},
		{
			label: '7th Century AD',
			ko: '7세기',
			enter: 'fade',
			set: { kind: 'still' },
			fx: [],
			beats: [
				title('7th Century AD', '7세기', BLACK, 2.8, [{ id: 'stars', amount: 0.8 }]),
				card(
					'Samhan has been split into Three Kingdoms for centuries. However, there remained a hope in the hearts of the common folk, that someday a new King for All would emerge and unite the people.',
					'삼한은 수백 년째 세 나라로 갈라져 있다. 그러나 백성의 마음속에는 희망 하나가 남아 있었다. 언젠가 새로운 모두의 왕이 나타나 사람들을 하나로 묶으리라는.',
					land('wide', 'year', { year: 632 }),
					7.6,
					undefined,
					'fade'
				),
				card(
					'And... perhaps by fate? A new generation arises to meet the age.',
					'그리고… 운명이었을까? 새로운 세대가 그 시대를 맞으러 일어선다.',
					paper('generation'),
					6,
					[{ id: 'stars', amount: 1.2 }],
					'fade'
				)
			]
		},
		feeling('Love', '사랑', 'prologue-love', 'prologue-gal-love', [{ id: 'petals', amount: 1, color: '#e7a0b0' }, { id: 'scent', amount: 0.7, color: '#f0c0cc', at: [0.5, 0.4] }], 'fade'),
		{
			label: 'Revenge',
			ko: '복수',
			enter: 'flash',
			set: { kind: 'still' },
			fx: [{ id: 'embers', amount: 0.9, color: '#ff7a32' }],
			beats: [
				title('Revenge.', '복수.', still('prologue-revenge', 'push'), 2.5),
				card('', '', cam('daeya', 'board', 642, 21, { dolly: 0.3, orbit: 7, fov: 48 }), 4.2, [{ id: 'embers', amount: 1.3 }], 'flash'),
				card('', '', still('prologue-gal-revenge', 'pull'), 2.8)
			]
		},
		feeling('Betrayal', '배신', 'prologue-betrayal', 'prologue-gal-betrayal', [
			{ id: 'flicker', amount: 0.85 },
			{ id: 'foxfire', amount: 0.7, at: [0.72, 0.62] }
		]),
		feeling('Greed', '탐욕', 'prologue-greed', 'prologue-gal-greed', [{ id: 'flicker', amount: 0.55 }, { id: 'embers', amount: 0.45, color: '#e7b15a', at: [0.5, 0.8] }]),
		feeling('Loyalty', '충성', 'prologue-loyalty', 'prologue-gal-loyalty', [{ id: 'rain', amount: 0.55 }, { id: 'motes', amount: 0.35, color: '#e6c86a' }]),
		{
			label: 'Pride',
			ko: '긍지',
			enter: 'flash',
			set: { kind: 'still' },
			fx: [],
			beats: [
				title('Pride.', '긍지.', still('prologue-pride', 'rise'), 2.5),
				card('', '', cam('chek', 'board', 642, 17, { dolly: 0.08, orbit: 24, rise: 0.14, fov: 42 }), 4.6, [{ id: 'wisps', amount: 0.4, color: '#e8c8c8' }], 'fade'),
				card('', '', still('prologue-gal-pride', 'left'), 2.8)
			]
		},
		{
			label: 'Rage',
			ko: '분노',
			enter: 'flash',
			set: { kind: 'still' },
			fx: [
				{ id: 'heartbeat', amount: 0.9 },
				{ id: 'speed', amount: 0.55 }
			],
			beats: [
				title('Rage.', '분노.', still('prologue-rage', 'push'), 2.4),
				card('', '', still('prologue-gal-rage', 'left'), 2.6, undefined, 'flash'),
				card('', '', still('prologue-gal-rage-never', 'rise'), 2.8, [{ id: 'embers', amount: 0.6 }], 'flash')
			]
		},
		{
			label: 'The King for All',
			ko: '왕검',
			enter: 'iris',
			set: { kind: 'still' },
			fx: [
				{ id: 'stars', amount: 1 },
				{ id: 'wisps', amount: 0.4, color: '#e7c56a' }
			],
			beats: [
				card(
					'This is the story to crown the new leader to lead the people out from the darkness.',
					'어둠 속에서 백성을 이끌어 낼 새 지도자에게 왕관을 씌우는 이야기.',
					paper('generation'),
					5.6
				),
				title('The King for All!', '삼한왕검!', paper('wanggum'), 4.4, [{ id: 'stars', amount: 1.4 }])
			]
		}
	]
};

function feeling(en: string, ko: string, a: string, b: string, fx: Fx[], enter: CutScene['enter'] = 'flash'): CutScene {
	return {
		label: en,
		ko,
		enter,
		set: { kind: 'still' },
		fx,
		beats: [title(`${en}.`, `${ko}.`, still(a, 'push'), 2.6), card('', '', still(b, 'left'), 2.8)]
	};
}
