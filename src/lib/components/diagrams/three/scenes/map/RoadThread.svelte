<script lang="ts">
	/**
	 * Kangrim's cord on the relief: solid up to where he stands, faint ahead.
	 * Straight enough between stops that the steppe detour does not bow into the sea.
	 */
	import { T, useThrelte } from '@threlte/core';
	import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';
	import { heightAt, type ReliefField } from '$lib/worldRelief';
	import { toMapWorld } from '$lib/mapTerrain';
	import type { CosmosScope } from '$lib/cosmos';
	import type { RoadPoint } from '$lib/kangrimRoad';

	let {
		points,
		here,
		lift,
		field,
		scope
	}: {
		points: RoadPoint[];
		here: number;
		lift: number;
		field: ReliefField | null;
		scope: CosmosScope;
	} = $props();

	const { invalidate } = useThrelte();
	const RADIUS: Record<CosmosScope, number> = { samhan: 0.04, sphere: 0.055, world: 0.1, cosmos: 0.18 };
	const CORD = '#e23b3a';

	const radius = $derived(RADIUS[scope]);

	function vec(p: RoadPoint): Vector3 {
		const [wx, wz] = toMapWorld(p.x, p.y);
		const h = field ? Math.max(0, heightAt(field, p.x, p.y)) : 0;
		return new Vector3(wx, lift + h + radius * 1.4, wz);
	}

	function tube(pts: Vector3[]): TubeGeometry | null {
		if (pts.length < 2) return null;
		const curve = new CatmullRomCurve3(pts, false, 'chordal');
		return new TubeGeometry(curve, Math.max(6, pts.length * 10), radius, 6, false);
	}

	let solid = $state.raw<TubeGeometry | null>(null);
	let faint = $state.raw<TubeGeometry | null>(null);

	$effect(() => {
		const all = points.map(vec);
		const nextSolid = tube(all.slice(0, here + 1));
		const nextFaint = here < all.length - 1 ? tube(all.slice(here)) : null;
		solid = nextSolid;
		faint = nextFaint;
		invalidate();
		return () => {
			nextSolid?.dispose();
			nextFaint?.dispose();
		};
	});

	const marks = $derived(points.slice(0, here + 1).map(vec));
</script>

{#if solid}
	<T.Mesh geometry={solid} renderOrder={6}>
		<T.MeshBasicMaterial color={CORD} toneMapped={false} />
	</T.Mesh>
{/if}
{#if faint}
	<T.Mesh geometry={faint} renderOrder={5}>
		<T.MeshBasicMaterial color={CORD} transparent opacity={0.28} depthWrite={false} toneMapped={false} />
	</T.Mesh>
{/if}
{#each marks as at, i (i)}
	<T.Mesh position={[at.x, at.y, at.z]} renderOrder={7}>
		<T.SphereGeometry args={[i === here ? radius * 2.1 : radius * 1.15, 14, 10]} />
		<T.MeshBasicMaterial color={i === here ? '#f2c14e' : CORD} toneMapped={false} />
	</T.Mesh>
{/each}
