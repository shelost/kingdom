<script lang="ts" generics="T extends TreeItem">
	/**
	 * A hierarchy on the ground: roots at the back and tallest, each
	 * generation one row nearer and lower, joined by elbow beams. Node looks
	 * and labels come from the caller, so pantheons, ministries and wiki
	 * org charts share one layout.
	 */
	import type { Snippet } from 'svelte';
	import KitNode from './KitNode.svelte';
	import KitLink from './KitLink.svelte';
	import type { Tone, TreeItem, TreeLayout, TreeLook, TreeNode } from './kit.svelte';

	let {
		layout,
		look,
		linkTone = 'base',
		linkColor,
		delay = 0,
		label
	}: {
		layout: TreeLayout<T>;
		look: (n: TreeNode<T>) => TreeLook;
		linkTone?: Tone;
		linkColor?: string;
		delay?: number;
		/** Renders a label for a node; receives the node and its top height. */
		label?: Snippet<[TreeNode<T>, number]>;
	} = $props();

	const looks = $derived(new Map(layout.nodes.map((n) => [n.id, look(n)])));
	const wait = (n: { depth: number; order: number }) => delay + n.depth * 260 + n.order * 35;
</script>

{#each layout.links as l (l.from + '>' + l.to)}
	<KitLink
		points={l.points}
		tone={linkTone}
		color={linkColor}
		delay={delay + l.depth * 260 - 120}
		show={looks.get(l.to)?.show ?? true}
		radius={0.03}
	/>
{/each}

{#each layout.nodes as n (n.id)}
	{@const s = looks.get(n.id) ?? {}}
	<KitNode
		at={[n.x, 0, n.z]}
		shape={s.shape ?? 'slab'}
		size={s.size ?? [1.1, 0.8]}
		height={s.height ?? 0.6}
		tone={s.tone ?? 'base'}
		color={s.color}
		glow={s.glow ?? 0}
		show={s.show ?? true}
		delay={wait(n)}
	/>
	{#if label}
		{@render label(n, s.height ?? 0.6)}
	{/if}
{/each}
