<script lang="ts">
	/**
	 * Robe colour by rank as two rows of pillars: Silla's seventeen at the
	 * back, Baekje's sixteen in front, height falling with rank, one label per
	 * colour band. Behind the Silla row, a bar for each bone class runs from
	 * the highest rank it could reach to the bottom. Goguryeo's two cap
	 * colours stand apart.
	 */
	import KitNode from '../../KitNode.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import { HUE, box, getKit } from '../../kit.svelte';
	import { useOrbit } from './orbit.svelte';
	import { BAEKJE_RANKS, BONES, RANK_COLOR, SILLA_RANKS, baekjeColor, sillaColor } from '$lib/researchRanks';

	useOrbit(box(-5.4, 6, -3, 1.3, 2.3), [
		{ az: 0.14, el: 0.62 },
		{ az: -0.14, el: 0.58 }
	], 7000);

	const kit = getKit();
	const X0 = -4.2;
	const DX = 0.5;
	const SZ = -0.9;
	const BZ = 0.6;
	const x = (i: number) => X0 + i * DX;
	const tall = (i: number, n: number) => 0.3 + (n - 1 - i) * 0.12;

	/** Consecutive ranks of one colour: [first, last, colour]. */
	function bands(n: number, color: (i: number) => string) {
		const out: { a: number; b: number; c: string }[] = [];
		for (let i = 0; i < n; i++) {
			const c = color(i);
			if (out.at(-1)?.c === c) out.at(-1)!.b = i;
			else out.push({ a: i, b: i, c });
		}
		return out;
	}
	const NAME = {
		[RANK_COLOR.purple]: ['자색', 'purple'],
		[RANK_COLOR.crimson]: ['비색', 'crimson'],
		[RANK_COLOR.blue]: ['청색', 'blue'],
		[RANK_COLOR.yellow]: ['황색', 'yellow']
	};
	const ROWS = [
		{ z: SZ, n: SILLA_RANKS.length, color: sillaColor, delay: 150, ko: '신라 17관등', en: 'Silla · 17 ranks', hue: HUE.silla },
		{ z: BZ, n: BAEKJE_RANKS.length, color: baekjeColor, delay: 900, ko: '백제 16관등', en: 'Baekje · 16 ranks', hue: HUE.baekje }
	].map((r) => ({ ...r, bands: bands(r.n, r.color) }));
	const GOGURYEO = [
		{ z: -0.5, c: RANK_COLOR.blue, ko: '푸른 비단 관', en: 'blue gauze cap' },
		{ z: 0.6, c: RANK_COLOR.crimson, ko: '붉은 비단 관', en: 'crimson gauze cap' }
	];
</script>

{#each ROWS as row (row.z)}
	{#each { length: row.n } as _, i (i)}
		<KitNode at={[x(i), 0, row.z]} size={[0.4, 0.4]} height={tall(i, row.n)} tone="accent" color={row.color(i)} delay={row.delay + i * 50} />
	{/each}
	{#each row.bands as b (b.a)}
		<KitLabel
			at={[(x(b.a) + x(b.b)) / 2, tall(b.a, row.n) + 0.3, row.z]}
			ko="{NAME[b.c][0]} {b.a + 1}–{b.b + 1}"
			en="{NAME[b.c][1]} {b.a + 1}–{b.b + 1}"
			size="xs"
			tone="accent"
			accent={b.c}
			delay={row.delay + 600}
		/>
	{/each}
	<KitLabel at={[X0 - 0.9, 0.2, row.z]} ko={row.ko} en={row.en} size="sm" tone="accent" accent={row.hue} delay={row.delay + 150} />
{/each}

{#each BONES as [en, ko, top], k (en)}
	{@const z = SZ - 0.7 - k * 0.42}
	<KitNode
		at={[(x(top) + x(16)) / 2, 0, z]}
		size={[x(16) - x(top) + 0.4, 0.24]}
		height={0.07}
		tone="accent"
		color={kit.palette.line}
		delay={1700 + k * 120}
	/>
	<KitLabel at={[x(top) - 0.3, 0.1, z]} ko={ko} en={en} size="xs" tone="note" minor delay={1800 + k * 120} />
{/each}

{#each GOGURYEO as g, k (g.z)}
	<KitNode at={[5.3, 0, g.z]} shape="disc" size={[0.32]} height={0.5} tone="accent" color={g.c} delay={2000 + k * 150} />
	<KitLabel at={[5.3, 0.8, g.z]} ko={g.ko} en={g.en} size="xs" tone="plain" minor delay={2150 + k * 150} />
{/each}
<KitLabel at={[5.3, 0.1, 1.25]} ko="고구려 · 관의 색" en="Goguryeo · cap colour" size="sm" tone="accent" accent={HUE.goguryeo} delay={2000} />
