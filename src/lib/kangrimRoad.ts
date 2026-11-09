/**
 * Kangrim's walk in 「차사본풀이」, in the order the Grim Reaper episode tells it.
 * Living stops are lon/lat on the cosmos sheet. From the twelve passes on, the
 * stops are the myth stations `layoutSpots` already paints.
 * The caller sets the fish-eye (`setFishEye`) before `kangrimPoints`.
 */
import { cosmosProject, layoutSpots, meadow, type CosmosScope } from '$lib/cosmos';

export type RoadPoint = { x: number; y: number; en: string; ko: string };

export type RoadStop = {
	id: string;
	/** Which frame of the maps page holds this stop. */
	scope: CosmosScope;
	en: string;
	ko: string;
	caption: string;
	captionKo: string;
	at: () => [number, number];
};

const ll =
	(lon: number, lat: number) =>
	(): [number, number] =>
		cosmosProject(lon, lat);

const spot =
	(key: 'passes' | 'coloredRivers' | 'threefold' | 'yaksu' | 'seventyEight' | 'flowers' | 'court') =>
	(): [number, number] =>
		layoutSpots('circles')[key];

/** The spring on the middle road, between the fork and the flower meadow. */
function mujangAt(): [number, number] {
	const from = layoutSpots('circles').threefold;
	const to = meadow();
	return [from[0] + (to.x - from[0]) * 0.4, from[1] + (to.y - from[1]) * 0.4];
}

/** East Asia on the sphere frame; the living disc on the world frame; everything once the heavens open. */
const LEG: Record<CosmosScope, number> = { samhan: 0, sphere: 1, world: 2, cosmos: 3 };

/** The sphere frame is East Asia, so the first steps west and north stay on it. */
const SPHERE_LEG = new Set(['samhan', 'huaxia', 'bukjeok']);

export const KANGRIM_ROAD: RoadStop[] = [
	{
		id: 'samhan',
		scope: 'sphere',
		en: 'The Three Hans',
		ko: '삼한',
		caption: 'He leaves them still whole.',
		captionKo: '아직 온전한 채로 떠난다.',
		at: ll(127.4, 36.6)
	},
	{
		id: 'huaxia',
		scope: 'world',
		en: 'Huaxia',
		ko: '화하',
		caption: 'First the Western Empire.',
		captionKo: '먼저 서역.',
		at: ll(108, 32.5)
	},
	{
		id: 'bukjeok',
		scope: 'world',
		en: 'Bukjeok',
		ko: '북적',
		caption: 'North of the empire. Felt and horses.',
		captionKo: '제국 북쪽. 펠트와 말.',
		at: ll(112, 47.2)
	},
	{
		id: 'tobun',
		scope: 'world',
		en: 'Land of Air',
		ko: '토번',
		caption: 'He goes around. He does not climb.',
		captionKo: '돌아간다. 오르지 않는다.',
		at: ll(88, 31.5)
	},
	{
		id: 'chunchuk',
		scope: 'world',
		en: 'Land of Earth',
		ko: '천축',
		caption: 'Long plains. He keeps walking.',
		captionKo: '긴 평원. 그는 계속 걷는다.',
		at: ll(78, 22)
	},
	{
		id: 'pasa',
		scope: 'world',
		en: 'Land of Fire',
		ko: '파사',
		caption: 'Oil, horse, and a thinner word for home.',
		captionKo: '기름, 말, 그리고 얇아진 고향.',
		at: ll(57, 32)
	},
	{
		id: 'bulim',
		scope: 'world',
		en: 'Land of Water',
		ko: '불림',
		caption: 'A fisherman points west with his chin.',
		captionKo: '어부가 턱으로 서쪽을 가리킨다.',
		at: ll(12, 42)
	},
	{
		id: 'passes',
		scope: 'cosmos',
		en: 'Twelve Passes',
		ko: '열두고개',
		caption: 'Twelve mouths. He is not dead.',
		captionKo: '입이 열둘. 그는 죽지 않았다.',
		at: spot('passes')
	},
	{
		id: 'rivers',
		scope: 'cosmos',
		en: 'Three Rivers',
		ko: '삼색천',
		caption: 'White first.',
		captionKo: '하얀 것부터.',
		at: spot('coloredRivers')
	},
	{
		id: 'threefold',
		scope: 'cosmos',
		en: 'The Threefold Path',
		ko: '세갈래길',
		caption: 'Right, paradise. Left, hell. The middle is Seocheon.',
		captionKo: '오른쪽은 극락. 왼쪽은 지옥. 가운데가 서천.',
		at: spot('threefold')
	},
	{
		id: 'mujang',
		scope: 'cosmos',
		en: 'Mujangsung',
		ko: '무장승',
		caption: 'A spring, and the man with no face.',
		captionKo: '샘, 그리고 얼굴 없는 그 사람.',
		at: mujangAt
	},
	{
		id: 'ocean',
		scope: 'cosmos',
		en: 'Ocean of Life',
		ko: '약수',
		caption: 'Three thousand li, said in one breath.',
		captionKo: '삼천 리. 한 숨에 하는 말.',
		at: spot('yaksu')
	},
	{
		id: 'seventy',
		scope: 'cosmos',
		en: 'Seventy-Eight Paths',
		ko: '일흔여덟 갈래',
		caption: 'The map runs out.',
		captionKo: '지도가 끝난다.',
		at: spot('seventyEight')
	},
	{
		id: 'flowers',
		scope: 'cosmos',
		en: 'The Flower Field',
		ko: '서천꽃밭',
		caption: 'The fall ends in flowers.',
		captionKo: '떨어지니 꽃이다.',
		at: spot('flowers')
	},
	{
		id: 'gate',
		scope: 'cosmos',
		en: 'The Underworld Gate',
		ko: '저승문',
		caption: 'A gate with no sun.',
		captionKo: '해가 없는 문.',
		at: spot('court')
	}
];

export function kangrimStop(id: string): RoadStop | undefined {
	return KANGRIM_ROAD.find((s) => s.id === id);
}

/**
 * The cord as far as this stop, on the frame that can hold it.
 * Sphere shows the East Asian leg. World shows the living disc. Cosmos shows the heavens too.
 */
export function kangrimPoints(hereId: string): { scope: CosmosScope; here: number; points: RoadPoint[] } {
	const hereStop = kangrimStop(hereId) ?? KANGRIM_ROAD[0];
	const rank = LEG[hereStop.scope];
	const shown = KANGRIM_ROAD.filter((s) =>
		rank === LEG.sphere ? SPHERE_LEG.has(s.id) : LEG[s.scope] <= rank
	).map((s) => {
		const [x, y] = s.at();
		return { x, y, en: s.en, ko: s.ko, id: s.id };
	});
	const here = Math.max(0, shown.findIndex((s) => s.id === hereStop.id));
	return { scope: hereStop.scope, here, points: shown };
}
