/**
 * Court ranks and their robe colours, shared by the research page's flat
 * drawing and its 3D model. Kept apart from `research.ts` so the 3D chunk
 * does not pull in the image list or the people table.
 */

export const SILLA_RANKS: [ko: string, en: string][] = [
	['이벌찬', 'Ibeolchan'], ['이찬', 'Ichan'], ['잡찬', 'Japchan'], ['파진찬', 'Pajinchan'], ['대아찬', 'Daeachan'],
	['아찬', 'Achan'], ['일길찬', 'Ilgilchan'], ['사찬', 'Sachan'], ['급찬', 'Geupchan'],
	['대나마', 'Daenama'], ['나마', 'Nama'],
	['대사', 'Daesa'], ['사지', 'Saji'], ['길사', 'Gilsa'], ['대오', 'Daeo'], ['소오', 'Soo'], ['조위', 'Jowi']
];

export const BAEKJE_RANKS = ['좌평', '달솔', '은솔', '덕솔', '한솔', '나솔', '장덕', '시덕', '고덕', '계덕', '대덕', '문독', '무독', '좌군', '진무', '극우'];

export const RANK_COLOR = { purple: '#7046a8', crimson: '#b8303f', blue: '#2f62ad', yellow: '#cfa232' };

export const sillaColor = (i: number) =>
	i < 5 ? RANK_COLOR.purple : i < 9 ? RANK_COLOR.crimson : i < 11 ? RANK_COLOR.blue : RANK_COLOR.yellow;

export const baekjeColor = (i: number) => (i < 6 ? RANK_COLOR.purple : i < 11 ? RANK_COLOR.crimson : RANK_COLOR.blue);

/** Highest Silla rank (0-based index) each bone class could reach. */
export const BONES: [en: string, ko: string, top: number][] = [
	['True Bone', '진골', 0],
	['Head rank 6', '6두품', 5],
	['Head rank 5', '5두품', 9],
	['Head rank 4', '4두품', 11]
];
