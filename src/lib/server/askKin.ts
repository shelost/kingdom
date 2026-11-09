/**
 * Our wiki's family tree as a graph, built from every `family` row in people.ts,
 * so Momal can state (and draw) kinship that was computed, not remembered.
 */

import { PROFILES, byId } from '$lib/people';
import { kinshipGraph, kinshipLine } from '$lib/kinship';
import { kinKey, type MomalFamily, type MomalKin } from '$lib/momalTypes';

type Graph = ReturnType<typeof kinshipGraph>;

/* Whole-role matches ("Father’s cousin" is not a father); a trailing "(…)" note is allowed. */
const role = (words: string) => new RegExp(`^(${words})(\\s*\\(.*\\))?$`, 'i');
const PARENT = role('father|mother|parent|adoptive father|adoptive mother');
const CHILD = role('son|daughter|child|eldest son|second son|third son|eldest daughter');
const SIBLING = role('brother|sister|sibling|elder brother|younger brother|elder sister|younger sister');
const SPOUSE = role('husband|wife|spouse|consort|queen consort');

let graph: Graph | null = null;
const spouses = new Map<string, Set<string>>();

function addSpouse(a: string, b: string) {
	for (const [x, y] of [
		[a, b],
		[b, a]
	]) {
		const set = spouses.get(x) ?? new Set<string>();
		set.add(y);
		spouses.set(x, set);
	}
}

function kinGraph(): Graph {
	if (graph) return graph;
	const marriages: { a: string; b: string; children: string[] }[] = [];
	const descent: [string, string][] = [];
	const siblings: [string, string][] = [];
	for (const p of PROFILES) {
		for (const f of p.family ?? []) {
			if (!byId.has(f.id) || f.id === p.id) continue;
			const r = f.role.trim();
			if (PARENT.test(r)) descent.push([f.id, p.id]);
			else if (CHILD.test(r)) descent.push([p.id, f.id]);
			else if (SIBLING.test(r)) siblings.push([p.id, f.id]);
			else if (SPOUSE.test(r)) {
				marriages.push({ a: p.id, b: f.id, children: [] });
				addSpouse(p.id, f.id);
			}
		}
	}
	graph = kinshipGraph(marriages, descent, siblings);
	return graph;
}

function sexOf(id: string): 'm' | 'f' {
	return byId.get(id)?.gender === 'f' ? 'f' : 'm';
}

const ORDINAL = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
const TIMES = ['', 'once', 'twice', 'three times', 'four times'];
const CHON_KO: Record<number, string> = { 4: '사촌', 5: '오촌', 6: '육촌', 7: '칠촌', 8: '팔촌' };

/**
 * What b is to a, given generations from each up to the common ancestor:
 * "Bidam is Chunchu's first cousin once removed (오촌 당숙)".
 */
function kinName(dA: number, dB: number, f: boolean): { en: string; ko: string } {
	const pick = (m: string, w: string) => (f ? w : m);
	const greats = (n: number) => 'great-'.repeat(Math.max(0, n));
	if (dB === 0) {
		if (dA === 1) return { en: pick('father', 'mother'), ko: pick('아버지', '어머니') };
		return { en: `${greats(dA - 2)}${pick('grandfather', 'grandmother')}`, ko: dA === 2 ? pick('할아버지', '할머니') : `${dA}대조` };
	}
	if (dA === 0) {
		if (dB === 1) return { en: pick('son', 'daughter'), ko: pick('아들', '딸') };
		return { en: `${greats(dB - 2)}${pick('grandson', 'granddaughter')}`, ko: dB === 2 ? pick('손자', '손녀') : `${dB}대손` };
	}
	if (dA === 1 && dB === 1) return { en: pick('brother', 'sister'), ko: pick('형제', '자매') };
	if (dA === 1) return { en: `${greats(dB - 2)}${pick('nephew', 'niece')}`, ko: dB === 2 ? '조카' : `${dA + dB}촌 조카` };
	if (dB === 1) return { en: `${greats(dA - 2)}${pick('uncle', 'aunt')}`, ko: dA === 2 ? pick('삼촌', '고모') : `${dA + dB}촌 ${pick('종조부', '종조모')}` };
	const degree = Math.min(dA, dB) - 1;
	const removed = Math.abs(dA - dB);
	const en = `${ORDINAL[degree] ?? `${degree}th`} cousin${removed ? ` ${TIMES[removed] ?? `${removed} times`} removed` : ''}`;
	const chon = dA + dB;
	const elder = dB < dA;
	const role = chon === 5 ? (elder ? ' 당숙' : ' 당질') : chon === 7 ? (elder ? ' 재종숙' : ' 재종질') : '';
	return { en, ko: `${CHON_KO[chon] ?? `${chon}촌`}${role}` };
}

/** Kinship between two people (what b is to a), or null when the tree has no tie between them. */
export function kinOf(a: string, b: string): MomalKin | null {
	if (!byId.has(a) || !byId.has(b) || a === b) return null;
	const g = kinGraph();
	const married = spouses.get(a)?.has(b) ?? false;
	const line = kinshipLine(a, b, g);
	if (!married && !line) return null;
	const dA = (line?.toA.length ?? 1) - 1;
	const dB = (line?.toB.length ?? 1) - 1;
	const named = married ? { en: 'married', ko: '부부' } : kinName(dA, dB, sexOf(b) === 'f');
	return {
		a,
		b,
		chon: married ? null : dA + dB,
		en: named.en,
		ko: named.ko,
		married: married || undefined,
		ancestor: line?.ancestor,
		toA: line?.toA,
		toB: line?.toB
	};
}

/** Every tie among a handful of people, keyed by `kinKey`. */
export function kinAmong(ids: string[]): Record<string, MomalKin> {
	const out: Record<string, MomalKin> = {};
	const list = [...new Set(ids)].slice(0, 12);
	for (let i = 0; i < list.length; i++) {
		for (let j = i + 1; j < list.length; j++) {
			const k = kinOf(list[i], list[j]);
			if (k) out[kinKey(list[i], list[j])] = k;
		}
	}
	return out;
}

export function familyTree(id: string): MomalFamily | null {
	if (!byId.has(id)) return null;
	const g = kinGraph();
	const parents = g.parents.get(id) ?? [];
	const siblings = new Set<string>();
	for (const p of parents) for (const c of g.children.get(p) ?? []) if (c !== id) siblings.add(c);
	const out: MomalFamily = {
		person: id,
		parents: [...new Set(parents)],
		spouses: [...(spouses.get(id) ?? [])],
		siblings: [...siblings],
		children: [...new Set(g.children.get(id) ?? [])]
	};
	return out.parents.length + out.spouses.length + out.siblings.length + out.children.length ? out : null;
}

/** People named anywhere in these kin lines and families (so their cards ship too). */
export function kinPeople(kin: Record<string, MomalKin>, family: Record<string, MomalFamily>): string[] {
	const ids = new Set<string>();
	for (const k of Object.values(kin)) for (const id of [...(k.toA ?? []), ...(k.toB ?? [])]) ids.add(id);
	for (const f of Object.values(family))
		for (const id of [...f.parents, ...f.spouses, ...f.siblings, ...f.children]) ids.add(id);
	return [...ids];
}

/** The ties as plain lines for the system prompt. */
export function kinBriefing(kin: Record<string, MomalKin>): string {
	const name = (id: string) => byId.get(id)?.name ?? id;
	return Object.values(kin)
		.map((k) => {
			const head = k.married
				? `${name(k.a)} (${k.a}) and ${name(k.b)} (${k.b}) are married`
				: `${name(k.b)} (${k.b}) is ${name(k.a)}'s (${k.a}) ${k.en} — ${k.chon}-chon, ${k.ko}`;
			if (!k.ancestor || !k.toA || !k.toB) return head;
			return `${head}. Common ancestor ${name(k.ancestor)}: ${k.toA.map(name).join(' → ')} | ${k.toB.map(name).join(' → ')}`;
		})
		.join('\n');
}
