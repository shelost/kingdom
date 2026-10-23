<script module lang="ts">
	/**
	 * One person on the tree. `id` links a profile (portrait, sex, birth year); name-only nodes carry their own.
	 * `ko`/`en` are the birth name; `royal` is a temple or consort title under the name.
	 * `crown` is only for kings and queen *regnants* — consorts keep the title, not the glyph.
	 * `n` is the Silla regnal number (제N대). `line` overlays Gaya blood on the bone ring.
	 */
	type Line = 'gaya' | 'assimilated' | 'mixed';
	type Node = {
		key: string;
		id?: string;
		ko: string;
		en: string;
		royal?: { ko: string; en: string };
		/** Kings and queen regnants only. Consorts get `royal` without this. */
		crown?: boolean;
		/** Silla sovereign number, 23 = Buphung. */
		n?: number;
		born?: number;
		/** `born` is the story's best guess, not a recorded year. */
		guess?: boolean;
		x: number;
		g: number;
		bone: 'sacred' | 'true' | 'common';
		/** Gaya blood: purple, purple+floating blue, or both. */
		line?: Line;
		note?: string;
	};

	const GEN_Y = [46, 138, 230, 322, 414, 506];
	export const HOUSE_Y = [62, 210, 358, 506, 654, 802, 950, 1098, 1246];

	export const NODES: Node[] = [
		{ key: 'jinhung', id: 'jinheung', ko: '김심맥부', en: 'Sumekbu', royal: { ko: '진흥왕', en: 'King Jinhung' }, n: 24, crown: true, x: 330, g: 0, bone: 'sacred' },
		{ key: 'dongnyun', ko: '김동륜', en: 'Dongnyun', born: 550, guess: true, x: 180, g: 1, bone: 'sacred', note: 'died young' },
		{ key: 'jinji', id: 'jinji', ko: '김사륜', en: 'Saryun', royal: { ko: '진지왕', en: 'King Jinji' }, n: 25, crown: true, x: 470, g: 1, bone: 'sacred', note: 'deposed 579' },
		{ key: 'biryun', id: 'sukwon', ko: '김비륜', en: 'Biryun', x: 555, g: 1, bone: 'sacred' },
		{ key: 'gukban', id: 'gukban', ko: '김국반', en: 'Gukban', royal: { ko: '진안갈문왕', en: 'Galmunwang' }, x: 70, g: 2, bone: 'sacred' },
		{ key: 'jinpyung', id: 'jinpyung', ko: '김백정', en: 'Baekjung', royal: { ko: '진평왕', en: 'King Jinpyung' }, n: 26, crown: true, x: 250, g: 2, bone: 'sacred' },
		{ key: 'yongsu', id: 'yongsu', ko: '김용수', en: 'Yongsu', x: 455, g: 2, bone: 'true' },
		{ key: 'bidam', id: 'bidam', ko: '김비담', en: 'Bidam', x: 555, g: 2, bone: 'true' },
		{ key: 'jinduk', id: 'jinduk', ko: '김승만', en: 'Sungman', royal: { ko: '진덕여왕', en: 'Queen Jinduk' }, n: 28, crown: true, x: 70, g: 3, bone: 'sacred' },
		{ key: 'sunduk', id: 'sunduk', ko: '김덕만', en: 'Dukman', royal: { ko: '선덕여왕', en: 'Queen Sunduk' }, n: 27, crown: true, x: 190, g: 3, bone: 'sacred' },
		{ key: 'chunmyung', id: 'chunmyung', ko: '김천명', en: 'Chunmyung', x: 320, g: 3, bone: 'sacred' },
		{ key: 'chunchu', id: 'chunchu', ko: '김춘추', en: 'Chunchu', royal: { ko: '무열왕', en: 'King Muyeol' }, n: 29, crown: true, x: 400, g: 4, bone: 'true' },
		{ key: 'munhee', id: 'munhee', ko: '김문희', en: 'Munhee', royal: { ko: '문명왕후', en: 'Queen Munmyung' }, x: 530, g: 4, bone: 'true', line: 'mixed' },
		{ key: 'gotaso', id: 'gotaso', ko: '김고타소', en: 'Gotaso', x: 330, g: 5, bone: 'true', line: 'mixed' },
		{ key: 'munmu', id: 'munmu', ko: '김법민', en: 'Bupmin', royal: { ko: '문무왕', en: 'King Munmu' }, n: 30, crown: true, x: 470, g: 5, bone: 'true', line: 'mixed' }
	];

	/** parent → child (from one parent) */
	const DESCENT: [string, string][] = [
		['jinhung', 'dongnyun'],
		['jinhung', 'jinji'],
		['jinhung', 'biryun'],
		['dongnyun', 'gukban'],
		['dongnyun', 'jinpyung'],
		['jinji', 'yongsu'],
		['biryun', 'bidam'],
		['gukban', 'jinduk'],
		['jinpyung', 'sunduk'],
		['jinpyung', 'chunmyung'],
		['chunchu', 'gotaso']
	];
	/** marriages, each with the children drawn from its middle */
	const MARRIAGES: { a: string; b: string; children: string[] }[] = [
		{ a: 'chunmyung', b: 'yongsu', children: ['chunchu'] },
		{ a: 'chunchu', b: 'munhee', children: ['munmu'] }
	];
	/** The line the Bihyung story follows. */
	const BIHYUNG = new Set(['jinji', 'yongsu', 'chunmyung', 'sunduk', 'chunchu', 'jinpyung']);

	/** Full house for `/tree`: Buphung’s generation, Ipjong’s line, Gaya Kim, named consorts. */
	export const HOUSE_NODES: Node[] = [
		{ key: 'bodo', id: 'bodo', ko: '보도', en: 'Bodo', royal: { ko: '보도부인', en: 'Queen Bodo' }, x: 50, g: 0, bone: 'sacred', note: 'queen' },
		{ key: 'beopheung', id: 'beopheung', ko: '법흥', en: 'Buphung', royal: { ko: '법흥왕', en: 'King Buphung' }, n: 23, crown: true, x: 170, g: 0, bone: 'sacred' },
		{ key: 'guhae', id: 'guhae', ko: '김구해', en: 'Guhae', royal: { ko: '금관국왕', en: 'King of Golden Gaya' }, crown: true, x: 1030, g: 0, bone: 'true', line: 'gaya' },
		{ key: 'guhae_wife', ko: '미상', en: 'Unnamed', x: 1160, g: 0, bone: 'true', line: 'gaya', note: 'queen' },
		{ key: 'jiso', id: 'jiso', ko: '지소', en: 'Jiso', royal: { ko: '지소태후', en: 'Queen Jiso' }, x: 100, g: 1, bone: 'sacred' },
		{ key: 'ipjong', id: 'ipjong', ko: '김입종', en: 'Ipjong', royal: { ko: '입종갈문왕', en: 'Galmunwang Ipjong' }, x: 240, g: 1, bone: 'sacred' },
		{ key: 'muryuk', id: 'muryuk', ko: '김무력', en: 'Muryuk', x: 1030, g: 1, bone: 'true', line: 'assimilated' },
		{ key: 'muryuk_wife', ko: '미상', en: 'Unnamed', x: 1160, g: 1, bone: 'true', note: 'Silla' },
		{ key: 'sado', id: 'sado', ko: '사도', en: 'Sado', royal: { ko: '사도왕후', en: 'Queen Sado' }, x: 70, g: 2, bone: 'sacred' },
		{ key: 'jinhung', id: 'jinheung', ko: '김심맥부', en: 'Sumekbu', royal: { ko: '진흥왕', en: 'King Jinhung' }, n: 24, crown: true, x: 210, g: 2, bone: 'sacred' },
		{ key: 'sobi', id: 'sobi', ko: '부여씨', en: 'Buyeo', royal: { ko: '소비', en: 'Queen Buyeo' }, x: 340, g: 2, bone: 'true', note: 'Baekje' },
		{ key: 'suulbu', id: 'sukhuljong', ko: '김수을부', en: 'Suulbu', x: 700, g: 2, bone: 'true', note: '숙흘종' },
		{ key: 'suulbu_wife', ko: '미상', en: 'Unnamed', x: 840, g: 2, bone: 'true' },
		{ key: 'manho', id: 'manho', ko: '만호', en: 'Manho', royal: { ko: '만호부인', en: 'Lady Manho' }, x: 70, g: 3, bone: 'sacred' },
		{ key: 'dongnyun', ko: '김동륜', en: 'Dongnyun', born: 550, guess: true, x: 210, g: 3, bone: 'sacred', note: 'died young' },
		{ key: 'jinji', id: 'jinji', ko: '김사륜', en: 'Saryun', royal: { ko: '진지왕', en: 'King Jinji' }, n: 25, crown: true, x: 430, g: 3, bone: 'sacred', note: 'deposed 579' },
		{ key: 'dohwa', id: 'dohwa', ko: '도화', en: 'Dohwa', x: 560, g: 3, bone: 'common' },
		{ key: 'biryun', id: 'sukwon', ko: '김비륜', en: 'Biryun', x: 680, g: 3, bone: 'sacred' },
		{ key: 'mishil', id: 'mishil', ko: '미실', en: 'Mishil', x: 810, g: 3, bone: 'true' },
		{ key: 'manmyung', id: 'manmyung', ko: '만명', en: 'Manmyung', x: 900, g: 3, bone: 'true' },
		{ key: 'seohyeon', id: 'seohyeon', ko: '김서현', en: 'Seohyun', x: 1030, g: 3, bone: 'true', line: 'assimilated' },
		{ key: 'baekban', id: 'baekban', ko: '김백반', en: 'Baekban', royal: { ko: '진정갈문왕', en: 'Galmunwang' }, x: 50, g: 4, bone: 'sacred' },
		{ key: 'jinpyung', id: 'jinpyung', ko: '김백정', en: 'Baekjung', royal: { ko: '진평왕', en: 'King Jinpyung' }, n: 26, crown: true, x: 180, g: 4, bone: 'sacred' },
		{ key: 'maya', id: 'maya', ko: '마야', en: 'Maya', royal: { ko: '마야부인', en: 'Lady Maya' }, x: 310, g: 4, bone: 'sacred' },
		{ key: 'gukban', id: 'gukban', ko: '김국반', en: 'Gukban', royal: { ko: '진안갈문왕', en: 'Galmunwang' }, x: 500, g: 4, bone: 'sacred' },
		{ key: 'wolmyeong', id: 'wolmyeong', ko: '월명', en: 'Wolmyeong', royal: { ko: '월명부인', en: 'Lady Wolmyeong' }, x: 630, g: 4, bone: 'sacred' },
		{ key: 'yongsu', id: 'yongsu', ko: '김용수', en: 'Yongsu', x: 760, g: 4, bone: 'true' },
		{ key: 'bidam', id: 'bidam', ko: '김비담', en: 'Bidam', x: 870, g: 4, bone: 'true' },
		{ key: 'yushin', id: 'yushin', ko: '김유신', en: 'Yushin', x: 1030, g: 4, bone: 'true', line: 'mixed' },
		{ key: 'sunduk', id: 'sunduk', ko: '김덕만', en: 'Dukman', royal: { ko: '선덕여왕', en: 'Queen Sunduk' }, n: 27, crown: true, x: 140, g: 5, bone: 'sacred' },
		{ key: 'chunmyung', id: 'chunmyung', ko: '김천명', en: 'Chunmyung', x: 280, g: 5, bone: 'sacred' },
		{ key: 'sunhwa', id: 'sunhwa', ko: '김선화', en: 'Sunhwa', x: 410, g: 5, bone: 'sacred' },
		{ key: 'jinduk', id: 'jinduk', ko: '김승만', en: 'Sungman', royal: { ko: '진덕여왕', en: 'Queen Jinduk' }, n: 28, crown: true, x: 740, g: 5, bone: 'sacred' },
		{ key: 'chunchu', id: 'chunchu', ko: '김춘추', en: 'Chunchu', royal: { ko: '무열왕', en: 'King Muyeol' }, n: 29, crown: true, x: 430, g: 6, bone: 'true' },
		{ key: 'munhee', id: 'munhee', ko: '김문희', en: 'Munhee', royal: { ko: '문명왕후', en: 'Queen Munmyung' }, x: 580, g: 6, bone: 'true', line: 'mixed' },
		{ key: 'gotaso', id: 'gotaso', ko: '김고타소', en: 'Gotaso', x: 300, g: 7, bone: 'true', line: 'mixed' },
		{ key: 'munmu', id: 'munmu', ko: '김법민', en: 'Bupmin', royal: { ko: '문무왕', en: 'King Munmu' }, n: 30, crown: true, x: 450, g: 7, bone: 'true', line: 'mixed' },
		{ key: 'jayi', id: 'jayi', ko: '김자희', en: 'Jahee', royal: { ko: '자의왕후', en: 'Queen Jayi' }, x: 590, g: 7, bone: 'true' },
		{ key: 'inmun', id: 'inmun', ko: '김인문', en: 'Inmun', x: 750, g: 7, bone: 'true', line: 'mixed' },
		{ key: 'sinmun', id: 'sinmun', ko: '김정명', en: 'Jeongmyeong', royal: { ko: '신문왕', en: 'King Sinmun' }, n: 31, crown: true, x: 520, g: 8, bone: 'true', line: 'mixed' }
	];
	export const HOUSE_DESCENT: [string, string][] = [
		['beopheung', 'jiso'],
		['jinhung', 'biryun']
	];
	export const HOUSE_SIBLINGS: [string, string][] = [['beopheung', 'ipjong']];
	/** Share a stand-in year when a sibling’s birth is known and theirs is not. */
	const HOUSE_PEERS: string[][] = [
		['beopheung', 'ipjong'],
		['jinhung', 'suulbu', 'manho'],
		['dongnyun', 'jinji', 'biryun'],
		['baekban', 'jinpyung', 'gukban'],
		['sunduk', 'chunmyung', 'sunhwa'],
		['yushin', 'munhee'],
		['gotaso', 'munmu', 'inmun']
	];
	export const HOUSE_MARRIAGES: { a: string; b: string; children: string[] }[] = [
		{ a: 'bodo', b: 'beopheung', children: [] },
		{ a: 'jiso', b: 'ipjong', children: ['jinhung', 'suulbu', 'manho'] },
		{ a: 'sado', b: 'jinhung', children: ['dongnyun', 'jinji'] },
		{ a: 'jinhung', b: 'sobi', children: [] },
		{ a: 'suulbu', b: 'suulbu_wife', children: ['manmyung'] },
		{ a: 'guhae', b: 'guhae_wife', children: ['muryuk'] },
		{ a: 'muryuk', b: 'muryuk_wife', children: ['seohyeon'] },
		{ a: 'manho', b: 'dongnyun', children: ['baekban', 'jinpyung', 'gukban'] },
		{ a: 'jinji', b: 'dohwa', children: ['yongsu'] },
		{ a: 'biryun', b: 'mishil', children: ['bidam'] },
		{ a: 'jinpyung', b: 'maya', children: ['sunduk', 'chunmyung', 'sunhwa'] },
		{ a: 'gukban', b: 'wolmyeong', children: ['jinduk'] },
		{ a: 'manmyung', b: 'seohyeon', children: ['yushin', 'munhee'] },
		{ a: 'chunmyung', b: 'yongsu', children: ['chunchu'] },
		{ a: 'chunchu', b: 'munhee', children: ['gotaso', 'munmu', 'inmun'] },
		{ a: 'munmu', b: 'jayi', children: ['sinmun'] }
	];
</script>

<script lang="ts">
	/**
	 * The Silla royal family, as a plain 2D tree: generations in rows, Sacred Bone ringed in gold,
	 * True Bone in blue, Gaya in purple. Birth name, then a temple or consort title; a gold crown
	 * and a 제N대 only on kings and queen regnants. Step `bihyung` softens the links off that line;
	 * every face stays full opacity. Step `house` is `/tree`. `timeline` keeps that
	 * birth-year tree and draws a life bar from each face down to death.
	 */
	import type { DiagramProps } from './registry';
	import { byId, avatarOf } from '$lib/people';
	import { resolve } from '$app/paths';

	let {
		step = 'full',
		active = false,
		timeline = false,
		onPerson
	}: DiagramProps & { timeline?: boolean; onPerson?: (id: string) => void } = $props();

	const house = $derived(step === 'house');
	const nodes = $derived(house ? HOUSE_NODES : NODES);
	const genY = $derived(house ? HOUSE_Y : GEN_Y);
	const descent = $derived(house ? HOUSE_DESCENT : DESCENT);
	const marriages = $derived(house ? HOUSE_MARRIAGES : MARRIAGES);
	const siblings = $derived(house ? HOUSE_SIBLINGS : []);
	const peerGroups = $derived(house ? HOUSE_PEERS : []);
	const R = 20;
	const profile = (n: Node) => (n.id ? byId.get(n.id) : undefined);
	const face = (n: Node) => {
		const p = profile(n);
		return p ? avatarOf(p) : null;
	};

	type Pt = { x: number; y: number };

	function addKid(map: Map<string, string[]>, p: string, c: string) {
		const arr = map.get(p);
		if (arr) arr.push(c);
		else map.set(p, [c]);
	}

	/** Birth year, or a family-inferred stand-in so the vertical axis can be time. */
	function inferYears(list: Node[]): Map<string, number> {
		const y = new Map<string, number>();
		const recorded = new Set<string>();
		const spouse = new Map<string, string[]>();
		const peers = new Map<string, string[]>();
		const kids = new Map<string, string[]>();
		const parent = new Map<string, string>();
		for (const m of marriages) {
			addKid(spouse, m.a, m.b);
			addKid(spouse, m.b, m.a);
			for (const c of m.children) {
				addKid(kids, m.a, c);
				addKid(kids, m.b, c);
				if (!parent.has(c)) parent.set(c, m.a);
			}
		}
		for (const group of peerGroups) {
			for (const k of group) peers.set(k, group.filter((x) => x !== k));
		}
		for (const [p, c] of descent) {
			addKid(kids, p, c);
			if (!parent.has(c)) parent.set(c, p);
		}
		for (const n of list) {
			const born = profile(n)?.born ?? n.born;
			if (born != null) {
				y.set(n.key, born);
				recorded.add(n.key);
			}
		}
		const firstYear = (keys: string[] | undefined, onlyRecorded = false) => {
			for (const k of keys ?? []) {
				if (onlyRecorded && !recorded.has(k)) continue;
				const v = y.get(k);
				if (v != null) return v;
			}
			return null;
		};
		for (let pass = 0; pass < 10; pass++) {
			for (const n of list) {
				if (y.has(n.key)) continue;
				const person = profile(n);
				const withSpouse = firstYear(spouse.get(n.key), true);
				if (withSpouse != null) {
					y.set(n.key, withSpouse);
					continue;
				}
				if (!parent.has(n.key)) {
					const sitWith = firstYear(spouse.get(n.key));
					if (sitWith != null) {
						y.set(n.key, sitWith);
						continue;
					}
				}
				const withPeer = firstYear(peers.get(n.key));
				if (withPeer != null) {
					y.set(n.key, withPeer);
					continue;
				}
				const childYears = (kids.get(n.key) ?? [])
					.map((k) => y.get(k))
					.filter((v): v is number => v != null);
				if (childYears.length) {
					y.set(n.key, Math.min(...childYears) - 22);
					continue;
				}
				const par = parent.get(n.key);
				if (par && y.has(par)) {
					y.set(n.key, y.get(par)! + 22);
					continue;
				}
				if (n.n) {
					const from = person?.career?.find((c) => c.from != null)?.from;
					if (from != null) {
						y.set(n.key, from - 25);
						continue;
					}
				}
				const anySpouse = firstYear(spouse.get(n.key));
				if (anySpouse != null) {
					y.set(n.key, anySpouse);
					continue;
				}
				if (person?.died != null) y.set(n.key, person.died - 48);
			}
		}
		for (const n of list) {
			if (!y.has(n.key)) y.set(n.key, 500 + n.g * 22);
		}
		for (const m of marriages) {
			const ya = y.get(m.a);
			const yb = y.get(m.b);
			if (ya == null || yb == null || Math.abs(ya - yb) > 8) continue;
			const joint =
				recorded.has(m.a) && !recorded.has(m.b)
					? ya
					: recorded.has(m.b) && !recorded.has(m.a)
						? yb
						: Math.min(ya, yb);
			y.set(m.a, joint);
			y.set(m.b, joint);
		}
		return y;
	}

	function layoutByYear(
		list: Node[],
		born: Map<string, number>,
		padT: number,
		px: number,
		col: number,
		minGap: number
	): { at: Map<string, Pt>; h: number; yMin: number; yMax: number } {
		const vals = list.map((n) => born.get(n.key)!);
		const yMin = Math.min(...vals);
		const yMax = Math.max(...vals);
		const pts = list.map((n) => ({
			key: n.key,
			x: n.x,
			y: padT + (born.get(n.key)! - yMin) * px
		}));
		pts.sort((a, b) => a.y - b.y || a.x - b.x);
		for (let i = 0; i < pts.length; i++) {
			for (let j = 0; j < i; j++) {
				if (Math.abs(pts[i].x - pts[j].x) < col && pts[i].y < pts[j].y + minGap) {
					pts[i].y = pts[j].y + minGap;
				}
			}
		}
		const h = Math.max(...pts.map((p) => p.y));
		return { at: new Map(pts.map((p) => [p.key, { x: p.x, y: p.y }])), h, yMin, yMax };
	}

	const years = $derived(inferYears(nodes));
	const TREE_PAD_T = 48;
	const TREE_PAD_B = 56;
	const TREE_PX = 7;
	const LABEL_BELOW = 58;
	const LABEL_HALF = 44;
	const BAR_W = 10;
	const houseLayout = $derived(layoutByYear(nodes, years, TREE_PAD_T, TREE_PX, 118, 0));
	const at = $derived(
		house ? houseLayout.at : new Map(nodes.map((n) => [n.key, { x: n.x, y: genY[n.g] }]))
	);
	function deathOf(n: Node): number | null {
		return profile(n)?.died ?? (n.key === 'guhae' ? 532 : null);
	}
	const axisMax = $derived.by(() => {
		let max = houseLayout.yMax;
		if (timeline) {
			for (const n of nodes) {
				const d = deathOf(n);
				if (d != null && d > max) max = d;
			}
		}
		return max;
	});
	const houseH = $derived(TREE_PAD_T + (axisMax - houseLayout.yMin) * TREE_PX + TREE_PAD_B);
	const box = $derived(house ? `0 0 1280 ${houseH}` : '0 0 600 560');
	const keyY = $derived(house ? houseH - 24 : 546);
	const yearTicks = $derived.by(() => {
		const start = Math.floor(houseLayout.yMin / 25) * 25;
		const end = Math.floor(axisMax / 25) * 25;
		const out: number[] = [];
		for (let y = start; y <= end; y += 25) out.push(y);
		return out;
	});
	const yOfYear = (yr: number) => TREE_PAD_T + (yr - houseLayout.yMin) * TREE_PX;
	let hoverFam = $state<string | null>(null);

	/** Recorded years print bare; reconstructed ones get "c." */
	const birth = (n: Node) => {
		const p = profile(n);
		const year = p?.born ?? n.born;
		if (year == null) return null;
		return p?.bornInvented || p?.bornApprox || (!p && n.guess) ? `c. ${year}` : `b. ${year}`;
	};
	function sex(n: Node): 'm' | 'f' {
		const g = profile(n)?.gender;
		if (g === 'f' || g === 'm') return g;
		const title = n.royal?.ko ?? '';
		if (
			n.key.endsWith('_wife') ||
			n.note === 'queen' ||
			title.includes('부인') ||
			title.includes('왕후') ||
			title.includes('태후') ||
			title.includes('여왕')
		)
			return 'f';
		return 'm';
	}
	const female = (n: Node) => sex(n) === 'f';
	const kindOf = (n: Node) => n.line ?? n.bone;
	/** Soften links off the Bihyung path; faces never dim. */
	const dimLink = (key: string) => step === 'bihyung' && !BIHYUNG.has(key);
	function nodeBox(p: Pt) {
		return {
			x0: p.x - LABEL_HALF,
			x1: p.x + LABEL_HALF,
			y0: p.y - R - 12,
			y1: p.y + LABEL_BELOW
		};
	}
	function hitsH(y: number, x1: number, x2: number, skip: Set<string>) {
		const lo = Math.min(x1, x2);
		const hi = Math.max(x1, x2);
		for (const n of nodes) {
			if (skip.has(n.key)) continue;
			const p = at.get(n.key);
			if (!p) continue;
			const b = nodeBox(p);
			if (b.y0 - 8 <= y && y <= b.y1 + 12 && b.x1 >= lo && b.x0 <= hi) return true;
		}
		return false;
	}
	function hitsV(x: number, y1: number, y2: number, skip: Set<string>) {
		const lo = Math.min(y1, y2);
		const hi = Math.max(y1, y2);
		for (const n of nodes) {
			if (skip.has(n.key)) continue;
			const p = at.get(n.key);
			if (!p) continue;
			const b = nodeBox(p);
			if (b.x0 <= x && x <= b.x1 && b.y1 >= lo && b.y0 <= hi) return true;
		}
		return false;
	}
	/** First clear horizontal under the labels, so the bus never cuts a face or name. */
	function channel(y0: number, x1: number, x2: number, skip: Set<string>) {
		for (let y = y0; y <= y0 + 160; y += 6) {
			if (!hitsH(y, x1, x2, skip)) return y;
		}
		return y0 + 56;
	}
	function stemX(y1: number, y2: number, prefer: number, alts: number[], skip: Set<string>) {
		for (const x of [prefer, ...alts]) {
			if (!hitsV(x, y1, y2, skip)) return x;
		}
		return prefer;
	}
	function coupleClose(a: Pt, b: Pt, skip: Set<string>) {
		if (Math.abs(a.y - b.y) > 16 || Math.abs(a.x - b.x) >= 180) return false;
		const lo = Math.min(a.x, b.x) + R + 10;
		const hi = Math.max(a.x, b.x) - R - 10;
		for (const n of nodes) {
			if (skip.has(n.key)) continue;
			const p = at.get(n.key);
			if (!p) continue;
			if (p.x > lo && p.x < hi && Math.abs(p.y - (a.y + b.y) / 2) < R + 10) return false;
		}
		return true;
	}
	/** Drop under the labels, across a clear band, then down onto the child. */
	const elbow = (from: Pt, to: Pt, skip: Set<string>) => {
		const parentBottom = from.y + R + 8;
		const childTop = to.y - R - 8;
		if (childTop <= parentBottom) {
			const midY = (from.y + to.y) / 2;
			return `M ${from.x} ${from.y + R} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - R}`;
		}
		let bus = channel(from.y + LABEL_BELOW, from.x, to.x, skip);
		bus = Math.min(bus, childTop);
		bus = Math.max(bus, parentBottom);
		return `M ${from.x} ${from.y + R} V ${bus} H ${to.x} V ${to.y - R}`;
	};
	type Wed = {
		left: Pt;
		right: Pt;
		close: boolean;
		bus: number;
		mx: number;
		kidPts: Pt[];
		fallen: boolean;
		busLo: number;
		busHi: number;
		id: string;
	};
	function marriageDraw(m: { a: string; b: string; children: string[] }): Wed {
		const a = at.get(m.a)!;
		const b = at.get(m.b)!;
		const left = a.x <= b.x ? a : b;
		const right = a.x <= b.x ? b : a;
		const skip = new Set([m.a, m.b, ...m.children]);
		const close = coupleClose(a, b, skip);
		const kidPts = m.children.map((c) => at.get(c)!);
		const kidXs = kidPts.map((p) => p.x);
		const mx = (a.x + b.x) / 2;
		const xs = [left.x, right.x, mx, ...kidXs];
		const busLo = Math.min(...xs);
		const busHi = Math.max(...xs);
		const parentBottom = Math.max(a.y, b.y) + R + 8;
		const childTop = kidPts.length ? Math.min(...kidPts.map((p) => p.y)) - R - 8 : parentBottom + 24;
		let bus = channel(Math.max(a.y, b.y) + LABEL_BELOW, busLo, busHi, skip);
		if (kidPts.length) {
			if (childTop <= parentBottom) bus = (Math.max(a.y, b.y) + Math.min(...kidPts.map((p) => p.y))) / 2;
			else {
				bus = Math.min(bus, childTop);
				bus = Math.max(bus, parentBottom);
			}
		}
		const stem = stemX(Math.max(a.y, b.y), bus, mx, [left.x, right.x], skip);
		return {
			left,
			right,
			close,
			bus,
			mx: stem,
			kidPts,
			fallen: m.a === 'jinji' || m.b === 'jinji',
			busLo,
			busHi,
			id: `${m.a}+${m.b}`
		};
	}
	const hoverPeople = $derived.by(() => {
		const s = new Set<string>();
		if (!hoverFam) return s;
		for (const m of marriages) {
			const id = `${m.a}+${m.b}`;
			if (hoverFam === id || hoverFam === m.a || hoverFam === m.b || m.children.includes(hoverFam)) {
				s.add(m.a);
				s.add(m.b);
				for (const c of m.children) s.add(c);
			}
		}
		for (const [p, c] of descent) {
			if (hoverFam === `${p}>${c}` || hoverFam === p || hoverFam === c) {
				s.add(p);
				s.add(c);
			}
		}
		for (const [a, b] of siblings) {
			if (hoverFam === `${a}~${b}` || hoverFam === a || hoverFam === b) {
				s.add(a);
				s.add(b);
			}
		}
		return s;
	});
	const scanning = $derived(!!hoverFam);
	/** A small Silla gold crown sitting on top of the ring: band, three tree uprights, two antlers. */
	const CROWN = [
		`M -10 ${-R + 1} H 10 V ${-R - 3} H -10 Z`,
		`M -6 ${-R - 3} V ${-R - 11} M -8.5 ${-R - 7} H -3.5 M -8.5 ${-R - 9.5} H -3.5`,
		`M 0 ${-R - 3} V ${-R - 13} M -2.5 ${-R - 8} H 2.5 M -2.5 ${-R - 11} H 2.5`,
		`M 6 ${-R - 3} V ${-R - 11} M 3.5 ${-R - 7} H 8.5 M 3.5 ${-R - 9.5} H 8.5`,
		`M -10 ${-R - 3} Q -13 ${-R - 8} -11 ${-R - 11} M 10 ${-R - 3} Q 13 ${-R - 8} 11 ${-R - 11}`
	];

	function pick(n: Node) {
		if (!n.id || !onPerson) return;
		onPerson(n.id);
	}
	function onNodeKey(e: KeyboardEvent, n: Node) {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		pick(n);
	}

	type Span = { start: number; end: number };
	function reignOf(n: Node): Span | null {
		if (!n.n && n.key !== 'guhae') return null;
		const p = profile(n);
		const offices = p?.career ?? [];
		if (n.key === 'guhae') {
			const to = offices.find((c) => c.to != null)?.to;
			if (to == null) return null;
			return { start: years.get(n.key) ?? to, end: to };
		}
		const king = offices.find((c) => {
			const t = `${c.title} ${c.korean ?? ''}`;
			return (
				/(King|Queen|왕)/.test(t) &&
				!/(consort|왕후|공주|태자|Prince|princess|Galmun)/.test(t)
			);
		});
		if (king?.from == null) return null;
		const end = n.key === 'jinji' ? (king.to ?? 579) : (p?.died ?? king.to ?? king.from);
		return { start: king.from, end };
	}
</script>

{#snippet rings(n: Node, r: number)}
	{@const kind = kindOf(n)}
	{#if kind === 'mixed'}
		<path class="ring gaya" d="M 0 {-r} A {r} {r} 0 0 0 0 {r}" />
		<path class="ring true" d="M 0 {-r} A {r} {r} 0 0 1 0 {r}" />
	{:else if kind === 'assimilated'}
		<circle class="ring gaya" {r} />
		<circle class="float" r={r + 5} />
	{:else}
		<circle class="ring {kind}" {r} class:deposed={n.note === 'deposed 579'} />
	{/if}
{/snippet}

{#snippet personFace(n: Node)}
	{@const src = face(n)}
	<circle class="disc" r={R} />
	{#if src}
		<image
			href={src}
			x={-R}
			y={-R - 4}
			width={R * 2}
			height={R * 2.6}
			preserveAspectRatio="xMidYMin slice"
			clip-path="url(#silla-face)"
		/>
	{/if}
	{@render rings(n, R)}
	{#if n.crown}
		<g class="crown">
			{#each CROWN as d (d)}<path {d} />{/each}
		</g>
	{/if}
	{#if house}
		{@const s = sex(n)}
		<text class="sex {s}" x={R + 5} y="4">{s === 'f' ? '女' : '男'}</text>
	{/if}
{/snippet}

{#snippet personLabel(n: Node)}
	{@const year = birth(n)}
	<g class="node-label" class:monarch={!!n.n} class:tight={house} transform="translate(0 {R})">
		{#if house && n.n && n.royal}
			<text class="royal-name" y="13">{n.royal.ko}</text>
			<text class="regnal" y="24">제{n.n}대 · {n.en}</text>
			{#if year}
				<text class="born" class:f={female(n)} y="33">{year}</text>
			{/if}
			{#if n.note}
				<text class="note" y={year ? 42 : 33}>{n.note}</text>
			{/if}
		{:else if house}
			<text class="name" y="12">{n.royal?.ko ?? n.ko}</text>
			<text class="en" y="21">{n.en}</text>
			{#if year}
				<text class="born" class:f={female(n)} y="30">{year}</text>
			{/if}
			{#if n.note}
				<text class="note" y={year ? 39 : 30}>{n.note}</text>
			{/if}
		{:else if n.n && n.royal}
			<text class="regnal" y="12">제{n.n}대</text>
			<text class="royal-name" y="26">{n.royal.ko}</text>
			<text class="royal-en" y="36">{n.royal.en}</text>
			<text class="name birth-name" y="46">{n.ko}</text>
			<text class="en" y="53">{n.en}</text>
			{#if year}
				<text class="born" class:f={female(n)} y="61">{year}</text>
			{/if}
			{#if n.note}
				<text class="note" y={year ? 70 : 61}>{n.note}</text>
			{/if}
		{:else}
			<text class="name" y="12">{n.ko}</text>
			<text class="en" y="19.5">{n.en}</text>
			{#if n.royal}
				<text class="royal" y="28"><tspan class="royal-ko">{n.royal.ko}</tspan> {n.royal.en}</text>
			{/if}
			{#if year}
				<text class="born" class:f={female(n)} y={n.royal ? 36 : 28}>{year}</text>
			{/if}
			{#if n.note}
				<text class="note" y={year ? (n.royal ? 44 : 36) : n.royal ? 36 : 28}>{n.note}</text>
			{/if}
		{/if}
	</g>
{/snippet}

<svg
	viewBox={box}
	class="dg"
	class:play={active}
	class:scan={scanning}
	class:life={house && timeline}
	data-step={step}
	style:aspect-ratio={house ? `1280 / ${houseH}` : undefined}
	role="img"
	aria-label="Silla royal family tree from King Buphung down to King Sinmun, with the Gaya Kim line, birth names, royal names, and bone rings"
	onmouseleave={() => (hoverFam = null)}
>
	<defs>
		<clipPath id="silla-face"><circle r={R - 2} /></clipPath>
		<linearGradient id="mixed-bar" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#8b5cf6" />
			<stop offset="1" stop-color="#3d6fd4" />
		</linearGradient>
	</defs>

	{#if house}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<rect class="clear" width="1280" height={houseH} onmouseenter={() => (hoverFam = null)} />
	{/if}

	{#if house}
		{#each yearTicks as yr (yr)}
			<line class="year-rule" x1="44" y1={yOfYear(yr)} x2="1268" y2={yOfYear(yr)} />
			<text class="year-axis" x="8" y={yOfYear(yr) + 3}>{yr}</text>
		{/each}
	{/if}

	{#if house && timeline}
		{#each nodes as n (n.key)}
			{@const p = at.get(n.key)!}
			{@const died = deathOf(n)}
			{@const kind = kindOf(n)}
			{#if died != null && yOfYear(died) > p.y + R + 4}
				{@const y1 = p.y + R + 2}
				{@const y2 = yOfYear(died)}
				{@const reign = reignOf(n)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<rect
					class="life-bar {kind}"
					class:lit={scanning && hoverPeople.has(n.key)}
					x={p.x - BAR_W / 2}
					y={y1}
					width={BAR_W}
					height={y2 - y1}
					rx={BAR_W / 2}
					onmouseenter={() => (hoverFam = n.key)}
				/>
				{#if reign}
					{@const ry1 = Math.max(y1, yOfYear(reign.start))}
					{@const ry2 = yOfYear(reign.end)}
					{#if ry2 > ry1 + 2}
						<rect
							class="reign-bar"
							x={p.x - 3}
							y={ry1}
							width="6"
							height={ry2 - ry1}
							rx="3"
						/>
					{/if}
				{/if}
			{/if}
		{/each}
	{/if}

	{#each descent as [p, c], i (p + c)}
		{@const from = at.get(p)!}
		{@const to = at.get(c)!}
		{@const d = elbow(from, to, new Set([p, c]))}
		{@const id = `${p}>${c}`}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g
			class="link-g"
			class:lit={scanning && (hoverPeople.has(p) || hoverPeople.has(c))}
			style="--d: {150 + i * 60}"
			onmouseenter={() => (hoverFam = id)}
		>
			<path class="link" class:fallen={p === 'jinji'} class:dim={dimLink(p) || dimLink(c)} {d} />
			<path class="hit" {d} />
		</g>
	{/each}

	{#each siblings as [a, b], i (a + b)}
		{@const pa = at.get(a)!}
		{@const pb = at.get(b)!}
		{@const d = `M ${pa.x + R} ${pa.y} C ${(pa.x + pb.x) / 2} ${pa.y}, ${(pa.x + pb.x) / 2} ${pb.y}, ${pb.x - R} ${pb.y}`}
		{@const id = `${a}~${b}`}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g
			class="link-g"
			class:lit={scanning && (hoverPeople.has(a) || hoverPeople.has(b))}
			style="--d: {120 + i * 40}"
			onmouseenter={() => (hoverFam = id)}
		>
			<path class="link sib" {d} />
			<path class="hit" {d} />
		</g>
	{/each}

	{#each marriages as m, i (m.a + m.b)}
		{@const w = marriageDraw(m)}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g
			class="wed"
			class:dim={dimLink(m.a) || dimLink(m.b)}
			class:lit={scanning && hoverPeople.has(m.a) && hoverPeople.has(m.b)}
			style="--d: {600 + i * 120}"
			onmouseenter={() => (hoverFam = w.id)}
		>
			{#if w.close}
				<line x1={w.left.x + R} y1={w.left.y - 2} x2={w.right.x - R} y2={w.right.y - 2} />
				<line x1={w.left.x + R} y1={w.left.y + 2} x2={w.right.x - R} y2={w.right.y + 2} />
				<line
					class="hit"
					x1={w.left.x + R}
					y1={w.left.y}
					x2={w.right.x - R}
					y2={w.right.y}
				/>
			{:else}
				<path
					class="vow"
					d="M {w.left.x} {w.left.y + R} V {w.bus} H {w.right.x} V {w.right.y + R}"
				/>
				<path
					class="hit"
					d="M {w.left.x} {w.left.y + R} V {w.bus} H {w.right.x} V {w.right.y + R}"
				/>
			{/if}
			{#if w.kidPts.length}
				{#if w.close}
					<path class:fallen={w.fallen} d="M {w.mx} {w.left.y} V {w.bus}" />
					<path class="hit" d="M {w.mx} {w.left.y} V {w.bus}" />
				{/if}
				<path class:fallen={w.fallen} d="M {w.busLo} {w.bus} H {w.busHi}" />
				<path class="hit" d="M {w.busLo} {w.bus} H {w.busHi}" />
				{#each w.kidPts as p, k (`${m.a}-${m.b}-${k}`)}
					<path class:fallen={w.fallen} d="M {p.x} {w.bus} V {p.y - R}" />
					<path class="hit" d="M {p.x} {w.bus} V {p.y - R}" />
				{/each}
			{/if}
		</g>
	{/each}

	{#each nodes as n, i (n.key)}
		{@const p = at.get(n.key)!}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g
			class="node {kindOf(n)}"
			class:click={!!(n.id && (onPerson || house))}
			class:lit={scanning && hoverPeople.has(n.key)}
			style="--d: {80 + i * 55}"
			transform="translate({p.x} {p.y})"
			onmouseenter={() => (hoverFam = n.key)}
		>
			{#if n.id && onPerson}
				<g
					role="button"
					tabindex="0"
					aria-label={n.royal?.en ?? n.en}
					onclick={() => pick(n)}
					onkeydown={(e) => onNodeKey(e, n)}
				>
					{@render personFace(n)}
					{@render personLabel(n)}
				</g>
			{:else if house && n.id}
				<a href={resolve(`/wiki?id=${n.id}`)} aria-label={n.en}>
					{@render personFace(n)}
					{@render personLabel(n)}
				</a>
			{:else}
				{@render personFace(n)}
				{@render personLabel(n)}
			{/if}
		</g>
	{/each}

	{#if house}
		<text class="house-label" x="40" y="18">신라 · Sukhuljong</text>
		<text class="house-label" x="980" y="18">금관가야 김 · Gaya Kim</text>
	{/if}

	<g class="key">
		<circle class="ring sacred" cx="14" cy={keyY} r="6" /><text x="26" y={keyY + 4}>성골 Sacred</text>
		<circle class="ring true" cx="132" cy={keyY} r="6" /><text x="144" y={keyY + 4}>진골 True</text>
		{#if house}
			<circle class="ring gaya" cx="246" cy={keyY} r="6" /><text x="258" y={keyY + 4}>가야 Gaya</text>
			<circle class="ring gaya" cx="360" cy={keyY} r="6" />
			<circle class="float" cx="360" cy={keyY} r="9" />
			<text x="376" y={keyY + 4}>동화 Assimilated</text>
			<path class="ring gaya" transform="translate(518 {keyY})" d="M 0 -6 A 6 6 0 0 0 0 6" />
			<path class="ring true" transform="translate(518 {keyY})" d="M 0 -6 A 6 6 0 0 1 0 6" />
			<text x="530" y={keyY + 4}>혼혈 Mixed</text>
			<circle class="ring common" cx="628" cy={keyY} r="6" /><text x="640" y={keyY + 4}>평민</text>
			<g class="crown" transform="translate(710 {keyY + 7}) scale(0.55)">
				{#each CROWN as d (d)}<path {d} />{/each}
			</g>
			<text x="722" y={keyY + 4}>왕 · 여왕</text>
			<text class="sex m" x="792" y={keyY + 4}>男</text>
			<text class="sex f" x="808" y={keyY + 4}>女</text>
		{:else}
			<g class="crown" transform="translate(250 {keyY + 7}) scale(0.55)">
				{#each CROWN as d (d)}<path {d} />{/each}
			</g>
			<text x="262" y={keyY + 4}>왕 Crowned</text>
		{/if}
	</g>
</svg>

<style>
	.dg {
		--sacred: #e2b54f;
		--true: #3d6fd4;
		--gaya: #8b5cf6;
		--royal: #c8372d;
		--crown: #d4a02c;
		font-family: var(--serif);
	}

	.dg[data-step='house'] {
		aspect-ratio: unset;
	}

	.link,
	.wed line,
	.wed path:not(.hit) {
		fill: none;
		stroke: color-mix(in srgb, var(--fg) 45%, transparent);
		stroke-width: 1.4;
	}

	.hit {
		fill: none;
		stroke: transparent;
		stroke-width: 16;
		pointer-events: stroke;
	}

	.clear {
		fill: transparent;
	}

	.link.fallen,
	.wed path.fallen {
		stroke-dasharray: 4 3;
	}

	.link.sib {
		stroke-dasharray: 3 4;
		stroke: color-mix(in srgb, var(--sacred) 70%, var(--fg));
	}

	.wed line:not(.hit),
	.wed path.vow {
		stroke: var(--sacred);
	}

	.sex {
		font-size: 8px;
		font-weight: 800;
		font-family: var(--serif);
	}

	.sex.m {
		fill: #3f6fd1;
	}

	.sex.f {
		fill: #c2408e;
	}

	.key .sex {
		font-size: 10px;
		text-anchor: start;
	}

	.life-bar {
		opacity: 0.42;
	}

	.life-bar.sacred {
		fill: var(--sacred);
	}

	.life-bar.true {
		fill: var(--true);
	}

	.life-bar.gaya,
	.life-bar.assimilated {
		fill: var(--gaya);
	}

	.life-bar.mixed {
		fill: url(#mixed-bar);
	}

	.life-bar.common {
		fill: #8a8882;
	}

	.reign-bar {
		fill: var(--crown);
		opacity: 0.92;
	}

	.year-rule {
		stroke: color-mix(in srgb, var(--fg) 9%, transparent);
		stroke-width: 1;
	}

	.year-axis {
		font-size: 8px;
		fill: var(--fg-faint, #8a8882);
		font-variant-numeric: tabular-nums;
	}

	.disc {
		fill: var(--bg-raised, #28282e);
	}

	.ring {
		fill: none;
		stroke-width: 2.4;
	}

	.sacred .ring,
	.ring.sacred {
		stroke: var(--sacred);
	}

	.true .ring,
	.ring.true {
		stroke: var(--true);
	}

	.gaya .ring,
	.ring.gaya,
	.assimilated .ring {
		stroke: var(--gaya);
	}

	.float {
		fill: none;
		stroke: var(--true);
		stroke-width: 1.7;
	}

	.common .ring,
	.ring.common {
		stroke: #8a8882;
	}

	.house-label {
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		fill: var(--fg-faint, #8a8882);
	}

	.ring.deposed {
		stroke-dasharray: 5 3;
	}

	.crown path {
		fill: var(--crown);
		stroke: var(--crown);
		stroke-width: 1.3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.crown path:not(:first-child) {
		fill: none;
	}

	.note {
		font-size: 9px;
		text-anchor: middle;
		fill: var(--fg-faint, #8a8882);
		font-style: italic;
	}

	.node.click {
		cursor: pointer;
	}

	.node.click:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 3px;
	}

	.node-label text {
		text-anchor: middle;
		fill: var(--fg);
	}

	.name {
		font-size: 10px;
		font-weight: 800;
	}

	.birth-name {
		font-size: 7.2px;
		font-weight: 600;
		fill: var(--fg-dim, #b4b2ac);
	}

	.en {
		font-size: 5.6px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.node-label .royal {
		font-size: 6.4px;
		fill: var(--royal);
	}

	.royal-ko {
		font-weight: 700;
		font-size: 7.4px;
	}

	.regnal {
		font-size: 7.6px;
		font-weight: 800;
		letter-spacing: 0.08em;
		fill: var(--royal);
	}

	.royal-name {
		font-size: 12px;
		font-weight: 800;
		fill: var(--royal);
	}

	.tight .royal-name {
		font-size: 11px;
	}

	.royal-en {
		font-size: 7.2px;
		letter-spacing: 0.06em;
		fill: var(--royal);
		opacity: 0.88;
	}

	.node-label .born {
		font-size: 6px;
		fill: #3f6fd1;
		font-variant-numeric: tabular-nums;
	}

	.node-label .born.f {
		fill: #c2408e;
	}

	.key text {
		font-size: 9.5px;
		fill: var(--fg-dim, #b4b2ac);
	}

	.link.dim,
	.wed.dim {
		opacity: 0.22;
	}

	.node,
	.node-label,
	.link,
	.link-g,
	.wed {
		opacity: 0;
		transition: opacity 280ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .node,
	.play .node-label,
	.play .link,
	.play .link-g,
	.play .wed {
		opacity: 1;
	}

	.play .link.dim,
	.play .wed.dim {
		opacity: 0.22;
	}

	.play.scan .node:not(.lit),
	.play.scan .wed:not(.lit),
	.play.scan .link-g:not(.lit) {
		opacity: 0.16;
		transition-delay: 0ms;
	}

	.play.scan .node.lit,
	.play.scan .wed.lit,
	.play.scan .link-g.lit {
		opacity: 1;
		transition-delay: 0ms;
	}

	.play.scan .wed.lit line:not(.hit),
	.play.scan .wed.lit path:not(.hit) {
		stroke-width: 2.3;
	}

	.play.scan .life-bar:not(.lit) {
		opacity: 0.1;
	}

	.play.scan .life-bar.lit {
		opacity: 0.55;
	}
</style>
