<script lang="ts">
	import {
		BaseEdge,
		EdgeLabel,
		getStraightPath,
		useInternalNode,
		type EdgeProps
	} from '@xyflow/svelte';
	import { getFloatingEdgeParams } from '$lib/chart/floating';

	let {
		id,
		source,
		target,
		style,
		label,
		labelStyle,
		markerEnd,
		markerStart
	}: EdgeProps = $props();

	const sourceNode = $derived(useInternalNode(source));
	const targetNode = $derived(useInternalNode(target));

	let path = $derived.by(() => {
		const s = sourceNode.current;
		const t = targetNode.current;
		if (!s || !t) return { d: '', lx: 0, ly: 0 };
		const { sx, sy, tx, ty } = getFloatingEdgeParams(
			{
				positionAbsolute: s.internals.positionAbsolute,
				measured: s.measured,
				width: s.width,
				height: s.height
			},
			{
				positionAbsolute: t.internals.positionAbsolute,
				measured: t.measured,
				width: t.width,
				height: t.height
			}
		);
		const [d, lx, ly] = getStraightPath({
			sourceX: sx,
			sourceY: sy,
			targetX: tx,
			targetY: ty
		});
		return { d, lx, ly };
	});
</script>

{#if path.d}
	<BaseEdge {id} path={path.d} {style} {markerEnd} {markerStart} interactionWidth={20} />
	{#if label}
		<EdgeLabel x={path.lx} y={path.ly} style={labelStyle}>
			<span class="elabel">{label}</span>
		</EdgeLabel>
	{/if}
{/if}

<style>
	.elabel {
		display: inline-block;
		padding: 0.08rem 0.3rem;
		border-radius: 2px;
		font-size: 0.5rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(235, 235, 245, 0.55);
		background: #1e1e1e;
		border: 1px solid rgba(255, 255, 255, 0.08);
		pointer-events: none;
		white-space: nowrap;
	}
</style>
