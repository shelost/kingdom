/**
 * Korean kinship (촌) from a parent/child + spouse graph.
 * 촌 = dist(A, ancestor) + dist(B, ancestor). Spouses are 무촌.
 */

export type Kinship = {
	chon: number | null;
	ko: string;
	en: string;
};

type Graph = {
	parents: Map<string, string[]>;
	children: Map<string, string[]>;
	spouse: Map<string, string>;
};

function add(map: Map<string, string[]>, k: string, v: string) {
	const arr = map.get(k);
	if (arr) {
		if (!arr.includes(v)) arr.push(v);
	} else map.set(k, [v]);
}

export function kinshipGraph(
	marriages: { a: string; b: string; children: string[] }[],
	descent: [string, string][],
	siblings: [string, string][]
): Graph {
	const parents = new Map<string, string[]>();
	const children = new Map<string, string[]>();
	const spouse = new Map<string, string>();
	for (const m of marriages) {
		spouse.set(m.a, m.b);
		spouse.set(m.b, m.a);
		for (const c of m.children) {
			add(parents, c, m.a);
			add(parents, c, m.b);
			add(children, m.a, c);
			add(children, m.b, c);
		}
	}
	for (const [p, c] of descent) {
		add(parents, c, p);
		add(children, p, c);
	}
	for (const [a, b] of siblings) {
		const pa = parents.get(a) ?? [];
		const pb = parents.get(b) ?? [];
		for (const p of pa) {
			add(parents, b, p);
			add(children, p, b);
		}
		for (const p of pb) {
			add(parents, a, p);
			add(children, p, a);
		}
	}
	return { parents, children, spouse };
}

function ancestors(g: Graph, start: string): Map<string, number> {
	const dist = new Map<string, number>([[start, 0]]);
	const q = [start];
	for (let i = 0; i < q.length; i++) {
		const cur = q[i];
		const d = dist.get(cur)!;
		for (const p of g.parents.get(cur) ?? []) {
			if (dist.has(p)) continue;
			dist.set(p, d + 1);
			q.push(p);
		}
	}
	return dist;
}

function nameKin(
	chon: number,
	dA: number,
	dB: number,
	sexB: 'm' | 'f',
	sameGen: boolean
): { ko: string; en: string } {
	if (chon === 1 && dA === 0) {
		return sexB === 'f'
			? { ko: '어머니', en: 'mother' }
			: { ko: '아버지', en: 'father' };
	}
	if (chon === 1 && dB === 0) {
		return sexB === 'f' ? { ko: '딸', en: 'daughter' } : { ko: '아들', en: 'son' };
	}
	if (chon === 2 && sameGen) {
		return sexB === 'f' ? { ko: '자매', en: 'sister' } : { ko: '형제', en: 'brother' };
	}
	if (chon === 2 && dA === 0) {
		return sexB === 'f'
			? { ko: '할머니', en: 'grandmother' }
			: { ko: '할아버지', en: 'grandfather' };
	}
	if (chon === 2 && dB === 0) {
		return sexB === 'f' ? { ko: '손녀', en: 'granddaughter' } : { ko: '손자', en: 'grandson' };
	}
	if (chon === 3 && dA + 1 === dB) {
		return sexB === 'f' ? { ko: '고모·이모', en: 'aunt' } : { ko: '백숙부·외숙', en: 'uncle' };
	}
	if (chon === 3 && dB + 1 === dA) {
		return { ko: '조카', en: 'niece/nephew' };
	}
	if (chon === 4 && sameGen) {
		return { ko: '사촌', en: 'first cousin' };
	}
	if (chon === 6 && sameGen) {
		return { ko: '육촌', en: 'second cousin' };
	}
	if (sameGen) {
		return { ko: `${chon}촌`, en: `${chon}-chon cousins` };
	}
	if (dA < dB) {
		return { ko: `${chon}촌 손윗사람`, en: `${chon}-chon elder` };
	}
	return { ko: `${chon}촌 손아랫사람`, en: `${chon}-chon junior` };
}

export function kinshipOf(
	a: string,
	b: string,
	g: Graph,
	sexOf: (key: string) => 'm' | 'f'
): Kinship {
	if (a === b) return { chon: 0, ko: '본인', en: 'the same person' };
	if (g.spouse.get(a) === b) return { chon: null, ko: '부부', en: 'married' };
	const upA = ancestors(g, a);
	const upB = ancestors(g, b);
	let best: { anc: string; chon: number; dA: number; dB: number } | null = null;
	for (const [anc, dA] of upA) {
		const dB = upB.get(anc);
		if (dB == null) continue;
		const chon = dA + dB;
		if (!best || chon < best.chon) best = { anc, chon, dA, dB };
	}
	if (!best) return { chon: null, ko: '혈연 없음', en: 'no blood tie on this tree' };
	const named = nameKin(best.chon, best.dA, best.dB, sexOf(b), best.dA === best.dB);
	return { chon: best.chon, ko: named.ko, en: named.en };
}
