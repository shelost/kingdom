<script lang="ts">
	/**
	 * Plate cuirass against lamellar. Left: the Gaya / early Silla shell of
	 * vertical iron strips riveted to horizontal bands, with a helmet of
	 * vertical plates. Right: rows of small laced lames (one instanced mesh)
	 * flaring into a skirt, a lamellar neck guard, and a plumed helmet of
	 * long lames.
	 */
	import { T } from '@threlte/core';
	import { BoxGeometry, InstancedMesh, MeshStandardMaterial, Object3D } from 'three';
	import KitNode from '../../KitNode.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import Part, { MATS } from './Part.svelte';
	import { HUE, box, useReveal } from '../../kit.svelte';
	import { useOrbit } from './orbit.svelte';

	useOrbit(box(-2.7, 2.7, -1.1, 1.1, 3.25), [
		{ az: 0.35, el: 0.2 },
		{ az: -0.6, el: 0.26 }
	]);

	const P = -1.6;
	const L = 1.6;
	const UP = Math.PI / 2;
	const TAU = Math.PI * 2;

	/* —— plate cuirass —— */
	const plateR = (y: number) => 0.55 + ((y - 0.3) / 1.4) * 0.07;
	const BANDS = [0.55, 0.9, 1.25, 1.6];
	const RIVETS = Array.from({ length: 12 }, (_, i) => (i / 12) * TAU + 0.26);

	/* —— lamellar: rows of lames, every other row offset half a lame —— */
	const ROWS = Array.from({ length: 10 }, (_, i) => 0.38 + i * 0.14);
	const PER_ROW = 30;
	const lamR = (y: number) => 0.56 + Math.max(0, 0.95 - y) * 0.28;
	const HELM = Array.from({ length: 16 }, (_, i) => (i / 16) * TAU);

	const lames = new InstancedMesh(
		new BoxGeometry(0.12, 0.17, 0.018),
		new MeshStandardMaterial({ color: MATS.steel.color, metalness: MATS.steel.metalness, roughness: MATS.steel.roughness }),
		ROWS.length * PER_ROW + PER_ROW
	);
	lames.castShadow = true;
	lames.receiveShadow = true;
	{
		const o = new Object3D();
		let n = 0;
		const place = (y: number, r: number, a: number, tilt: number) => {
			o.position.set(L + Math.sin(a) * r, y, Math.cos(a) * r);
			o.rotation.set(0, a, 0);
			o.rotateX(tilt);
			o.updateMatrix();
			lames.setMatrixAt(n++, o.matrix);
		};
		ROWS.forEach((y, row) => {
			for (let i = 0; i < PER_ROW; i++) place(y, lamR(y), ((i + (row % 2) * 0.5) / PER_ROW) * TAU, y < 0.95 ? -0.18 : -0.06);
		});
		for (let i = 0; i < PER_ROW; i++) place(1.88, 0.42, (i / PER_ROW) * TAU, -0.35);
		lames.instanceMatrix.needsUpdate = true;
	}
	const grow = useReveal(() => ({ delay: 500 }), 900);
</script>

<!-- stands -->
{#each [P, L] as x (x)}
	<KitNode at={[x, 0, 0]} shape="disc" size={[0.55]} height={0.12} tone="base" delay={100} />
	<Part shape="cyl" args={[0.05, 0.05, 0.25]} at={[x, 0.24, 0]} mat="iron" delay={150} />
	<Part shape="cyl" args={[0.05, 0.05, 0.5]} at={[x, 2.05, 0]} mat="iron" delay={150} />
{/each}

<!-- plate cuirass: vertical strips (the facets), bands, rivets -->
<Part shape="cyl" args={[0.62, 0.55, 1.4]} at={[P, 1.0, 0]} mat="iron" facets={11} delay={250} />
{#each BANDS as y, k (y)}
	<Part shape="torus" args={[plateR(y) + 0.01, 0.028]} at={[P, y, 0]} rot={[UP, 0, 0]} mat="steel" delay={450 + k * 80} />
	{#each RIVETS as a (a)}
		<Part shape="ball" args={[0.026]} at={[P + Math.sin(a) * (plateR(y) + 0.035), y, Math.cos(a) * (plateR(y) + 0.035)]} mat="steel" delay={650 + k * 80} />
	{/each}
{/each}
<Part shape="cyl" args={[0.36, 0.6, 0.24]} at={[P, 1.82, 0]} mat="iron" facets={11} delay={500} />
<Part shape="cyl" args={[0.22, 0.38, 0.5]} at={[P, 2.45, 0]} mat="iron" facets={10} delay={700} />
<Part shape="ball" args={[0.22]} at={[P, 2.7, 0]} scale={[1, 0.6, 1]} mat="iron" delay={780} />
<Part shape="torus" args={[0.385, 0.03]} at={[P, 2.21, 0]} rot={[UP, 0, 0]} mat="steel" delay={820} />
<Part shape="cyl" args={[0.035, 0.045, 0.28]} at={[P, 2.92, 0]} mat="steel" delay={860} />

<!-- lamellar: laced rows, neck guard, helmet of long lames, plume -->
<T.Group scale={[1, Math.max(0.001, grow.current), 1]}>
	<T is={lames} />
</T.Group>
{#each ROWS as y, k (y)}
	<Part shape="torus" args={[lamR(y) + 0.012, 0.011]} at={[L, y + 0.04, 0]} rot={[UP, 0, 0]} mat="red" delay={900 + k * 50} />
{/each}
{#each HELM as a (a)}
	<T.Group position={[L, 2.42, 0]} rotation={[0, a, 0]}>
		<Part shape="box" args={[0.11, 0.48, 0.02]} at={[0, 0, 0.3]} rot={[-0.28, 0, 0]} mat="steel" delay={1100} />
	</T.Group>
{/each}
<Part shape="ball" args={[0.16]} at={[L, 2.7, 0]} scale={[1, 0.55, 1]} mat="steel" delay={1200} />
<Part shape="cone" args={[0.07, 0.45]} at={[L, 2.98, 0]} mat="red" delay={1300} />

<KitLabel at={[P, 0.06, 0.85]} ko="판갑 · 철판을 못으로 이음" en="plate cuirass · riveted strips" size="sm" tone="accent" accent={HUE.gaya} delay={900} />
<KitLabel at={[L, 0.06, 0.85]} ko="찰갑 · 작은 철편을 엮음" en="lamellar · laced lames" size="sm" tone="accent" accent={HUE.goguryeo} delay={1100} />
<KitLabel at={[P - 0.95, 2.45, 0]} ko="세로판 투구" en="helmet of vertical plates" size="xs" tone="note" minor delay={1200} />
<KitLabel at={[P + 0.9, 1.25, 0.3]} ko="못" en="rivets" size="xs" tone="note" minor delay={1250} />
<KitLabel at={[L + 1.0, 1.45, 0.2]} ko="끈으로 엮음" en="laced" size="xs" tone="note" minor delay={1400} />
<KitLabel at={[L + 1.05, 0.5, 0.2]} ko="미늘 치마" en="flared skirt" size="xs" tone="note" minor delay={1450} />
