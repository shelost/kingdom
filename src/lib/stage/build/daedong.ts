import { blob, type P2 } from './geo';

/*
 * The Daedong's north bank. Nakrang's earthen city and Goguryeo's Pyongyang are two eras of
 * one ground, so the slumped rampart in the fortress era lies exactly where the commandery wall stood.
 */

/** Blaze Creek (the Daedong), north-east to south-west past the city. */
export const DAEDONG: P2[] = [
	[2900, -3400],
	[1800, -2300],
	[1260, -1500],
	[1120, -700],
	[1060, 100],
	[800, 900],
	[120, 1750],
	[-900, 2500],
	[-2400, 3000],
	[-4600, 3300]
];
export const DAEDONG_HALF = 200;

/** The Botong, down the west side to meet the Daedong below the outer city. */
export const BOTONG: P2[] = [
	[-3000, -2300],
	[-2050, -1350],
	[-1700, -300],
	[-1640, 700],
	[-1780, 1700],
	[-2150, 2780]
];
export const BOTONG_HALF = 42;

/** Moranbong, the hill of Pyongyang's north citadel. */
export const MORAN = { x: 640, z: -1460 };

/** Nakrang's walled city on the flats, under what becomes Pyongyang's middle city. */
export const NAKRANG = { x: -150, z: 480, r: 380 };
export const NAKRANG_RING: P2[] = blob(NAKRANG.x, NAKRANG.z, NAKRANG.r, 32, 16, 0.1);
