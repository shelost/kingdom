/**
 * Back When Tigers Smoked. The book's own sentences, staged: the lids open on
 * the smoking tiger, a chariot drops out of heaven onto the white mountain,
 * and the three kingdoms are reached by flying the stage. The gods stay a
 * hint — a palace above the clouds, a scent, a five-colour cloud — and are
 * not named. The man in the chariot is not named either.
 */
import type { StageSiteId } from '$lib/stage/sites';
import type { CutScene, FilmScript, Fx, PlateMove, ScriptBeat, StageShot, Visual } from '../types';
import type { PaperId } from '../paper/scenes';

const still = (id: string, move: PlateMove = 'push'): Visual => ({ kind: 'still', id, src: '', move });
const paper = (scene: PaperId): Visual => ({ kind: 'paper', scene });

function cam(site: StageSiteId, view: string, year: number, hour: number, shot: Partial<StageShot> = {}, people = false): Visual {
	return {
		kind: 'stage',
		site,
		year,
		hour,
		people,
		shot: { view, label: shot.label, dolly: shot.dolly ?? 0.16, orbit: shot.orbit ?? 12, rise: shot.rise, fov: shot.fov }
	};
}

/** Dark peninsula, no kingdom paint. The camera eases from the previous focus into this one. */
function land(focus: 'wide' | 'north' | 'southeast' | 'southwest', arrows?: 'draw' | 'hold', mark?: string): Visual {
	return { kind: 'peninsula', year: -108, focus, arrows, mark };
}

function card(en: string, ko: string, visual?: Visual, hold?: number, fx?: Fx[], enter?: ScriptBeat['enter']): ScriptBeat {
	return { kind: 'card', en, ko, visual, hold, fx, enter };
}

const SKY = { kind: 'stage' as const, site: 'skypalace' as const, year: 600, hour: 17, look: 'inkcolor' as const, people: false, shots: [{ view: 'highest', dolly: 0.12, orbit: 16, rise: 0.1 }] };
const PEAK = { kind: 'stage' as const, site: 'paektu' as const, year: 600, hour: 11, look: 'watercolor' as const, people: false, shots: [{ view: 'fall', dolly: 0.08, orbit: 0, fov: 34 }] };

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
			enter: 'travel',
			set: SKY,
			fx: [
				{ id: 'stars', amount: 1 },
				{ id: 'motes', amount: 0.65, color: '#ffe7a8' }
			],
			beats: [
				card('', '', cam('skypalace', 'highest', 600, 17, { dolly: 0.14, orbit: 16, rise: 0.1, fov: 46 }), 4.2),
				card('', '', cam('skypalace', 'isles', 600, 17, { dolly: 0.2, orbit: -16, fov: 50 }), 3.4, undefined, 'fly'),
				card('', '', paper('heaven'), 5.4, [{ id: 'motes', amount: 0.8, color: '#fff2cc' }], 'door')
			]
		},
		{
			label: 'The fall',
			ko: '하강',
			enter: 'flash',
			set: PEAK,
			fx: [{ id: 'wisps', amount: 0.4, color: '#e7eef6' }],
			beats: [
				card(
					'Heaven sent down a man to the earth.',
					'하늘이 사람 하나를 땅으로 내려보냈다.',
					cam('paektu', 'fall', 600, 11, { dolly: 0.08, orbit: 0, rise: 0, fov: 34 }),
					7.6,
					[
						{ id: 'speed', amount: 1.6, color: '#14181f', at: [0.5, 0.46] },
						{ id: 'cloud', amount: 0.65, color: '#f4f7fb' },
						{ id: 'motes', amount: 0.45, color: '#d4b86a' }
					]
				),
				card(
					'',
					'',
					cam('paektu', 'rim', 600, 11, { dolly: 0.16, orbit: 0, rise: 0, fov: 38 }),
					5.2,
					[
						{ id: 'snow', amount: 0.4 },
						{ id: 'motes', amount: 0.35, color: '#d4b86a' }
					],
					'fly'
				),
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
					6.4,
					[{ id: 'wisps', amount: 0.45, color: '#e7c56a' }],
					'iris'
				)
			]
		},
		{
			label: 'Invasion',
			ko: '침략',
			enter: 'flash',
			set: { kind: 'still' },
			fx: [{ id: 'rain', amount: 0.7 }],
			beats: [
				card(
					'Then... invasion! In 108 BC, A new Emperor arose in the west, sent an army, and destroyed the kingdom.',
					'그러다… 침략! 기원전 108년, 서쪽에서 새 황제가 일어나 군대를 보내 그 나라를 무너뜨렸다.',
					land('wide', undefined, '108'),
					5.6,
					[
						{ id: 'speed', amount: 0.85 },
						{ id: 'embers', amount: 1.1, color: '#ff8a3d' }
					]
				),
				card('', '', paper('invasion'), 4.4, [{ id: 'embers', amount: 1.2, color: '#ff8a3d' }], 'flash'),
				card(
					'The people fled in all directions as refugees, establishing dozens of small new kingdoms.',
					'백성은 사방으로 흩어져 피란길에 올랐고, 수십 개의 작은 나라를 새로 세웠다.',
					land('wide', 'draw', '108'),
					5.8,
					[{ id: 'snow', amount: 0.9 }],
					'cut'
				),
				card('', '', paper('refugees'), 5.2, [{ id: 'snow', amount: 0.5 }], 'fade')
			]
		},
		{
			label: 'Three kingdoms',
			ko: '세 나라',
			enter: 'travel',
			set: { kind: 'still' },
			fx: [],
			beats: [
				card(
					'Eventually, three great kingdoms arose among them.',
					'마침내 그 가운데 세 큰 나라가 일어섰다.',
					land('wide', 'hold'),
					4.4
				),
				card(
					'In the mountains of the north... Five Tribes came together to form the kingdom of Goguryeo.',
					'북쪽 산골에서는… 다섯 부족이 모여 고구려를 세웠다.',
					land('north'),
					5.4,
					[{ id: 'fog', amount: 0.35 }],
					'cut'
				),
				card('', '', cam('jolbon', 'mesa', -37, 17, { dolly: 0.22, orbit: 34, rise: 0.1, fov: 46 }, true), 5.6, [{ id: 'fog', amount: 0.45 }], 'travel'),
				card('', '', cam('jolbon', 'rim', -37, 17, { dolly: 0.16, orbit: -22, rise: 0.06, fov: 42 }, true), 4.6, undefined, 'fly'),
				card('', '', paper('tribes'), 5.2, undefined, 'fade'),
				card(
					'In the plains of the southeast... Six Elders elected a new leader to form the kingdom of Silla.',
					'동남쪽 들판에서는… 여섯 촌장이 새 지도자를 뽑아 신라를 세웠다.',
					land('southeast'),
					5.4,
					[{ id: 'motes', amount: 0.45, color: '#f4e2a8' }],
					'travel'
				),
				card('', '', cam('moon', 'board', 500, 21, { dolly: 0.2, orbit: 32, rise: 0.08, fov: 42 }, true), 5.4, [{ id: 'motes', amount: 0.4, color: '#f4e2a8' }], 'travel'),
				card('', '', cam('moon', 'board', 500, 21, { label: 'gyerim', dolly: 0.18, orbit: -26, fov: 38 }, true), 4.6, undefined, 'fly'),
				card('', '', paper('elders'), 5.4, undefined, 'fade'),
				card(
					'In the coasts of the southwest... Ten Attendants migrated down to form the kingdom of Baekje.',
					'서남쪽 바닷가에서는… 열 신하가 남쪽으로 내려와 백제를 세웠다.',
					land('southwest'),
					5.4,
					[{ id: 'fog', amount: 0.3, color: '#e7d7b0' }],
					'travel'
				),
				card('', '', cam('wirye', 'gate', 18, 6, { dolly: 0.26, orbit: 28, rise: 0.08, fov: 44 }, true), 5.4, undefined, 'travel'),
				card('', '', cam('wirye', 'city', 18, 6, { dolly: 0.18, orbit: -20, fov: 42 }, true), 4.4, undefined, 'fly'),
				card('', '', paper('attendants'), 5.2, undefined, 'fade'),
				card(
					'Together, they came to be known as Samhan (the Three Hans).',
					'이 세 나라를 함께 일러 삼한이라 했다.',
					{ kind: 'samhan', year: 400 },
					5.6,
					[{ id: 'cloud', amount: 0.4, at: [0.5, 0.34] }],
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
				{
					kind: 'title',
					en: '7th Century AD',
					ko: '7세기',
					visual: { kind: 'samhan', year: 632, mark: '632' },
					hold: 3.6
				},
				card(
					'Samhan has been split into Three Kingdoms for centuries. However, there remained a hope in the hearts of the common folk, that someday a new King for All would emerge and unite the people.',
					'삼한은 수백 년째 세 나라로 갈라져 있다. 그러나 백성의 마음속에는 희망 하나가 남아 있었다. 언젠가 새로운 모두의 왕이 나타나 사람들을 하나로 묶으리라는.',
					{ kind: 'samhan', year: 632, mark: '632' },
					7.2,
					undefined,
					'cut'
				),
				card(
					'And... perhaps by fate? A new generation arises to meet the age.',
					'그리고… 운명이었을까? 새로운 세대가 그 시대를 맞으러 일어선다.',
					paper('generation'),
					6,
					[{ id: 'stars', amount: 1.2 }]
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
				{ kind: 'title', en: 'Revenge.', ko: '복수.', visual: still('prologue-revenge', 'push'), hold: 2.5 },
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
				{ kind: 'title', en: 'Pride.', ko: '긍지.', visual: still('prologue-pride', 'rise'), hold: 2.5 },
				card('', '', cam('chek', 'board', 642, 17, { dolly: 0.08, orbit: 24, rise: 0.14, fov: 42 }), 4.6, [{ id: 'wisps', amount: 0.4, color: '#e8c8c8' }], 'travel'),
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
				{ kind: 'title', en: 'Rage.', ko: '분노.', visual: still('prologue-rage', 'push'), hold: 2.4 },
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
				{
					kind: 'title',
					en: 'The King for All!',
					ko: '삼한왕검!',
					visual: paper('wanggum'),
					hold: 4.4,
					fx: [{ id: 'stars', amount: 1.4 }]
				}
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
		beats: [
			{ kind: 'title', en: `${en}.`, ko: `${ko}.`, visual: still(a, 'push'), hold: 2.6 },
			card('', '', still(b, 'left'), 2.8)
		]
	};
}
