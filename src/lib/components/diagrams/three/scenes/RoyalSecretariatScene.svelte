<script lang="ts">
	/**
	 * Royal Secretariat in 3D: the King, the Premier, and fourteen ministry
	 * blocks in two rows of seven — Tang's six, and then some.
	 */
	import KitTree from '../KitTree.svelte';
	import KitLabel from '../KitLabel.svelte';
	import { HUE, box, getKit, treeLayout, type TreeItem, type TreeNode } from '../kit.svelte';
	import { MINISTRIES } from '../../RoyalSecretariat.svelte';

	const kit = getKit();

	type Seat = TreeItem & { ko: string; en: string; han?: string };

	const items: Seat[] = [
		{ id: 'king', parent: null, ko: '왕', en: 'King' },
		{ id: 'premier', parent: 'king', ko: '중시', en: 'Premier' },
		...MINISTRIES.map((m, i) => ({ id: `m${i}`, parent: 'premier', ...m }))
	];
	const layout = treeLayout(items, { dx: 1.2, dz: 1.9, wrap: 7 });
	const half = layout.width / 2 + 0.3;
	$effect(() => kit.fit(box(-half, half, -layout.depth / 2 - 0.8, layout.depth / 2 + 1.1, 2)));

	const look = (n: TreeNode<Seat>) =>
		n.depth === 0
			? { shape: 'disc' as const, size: [0.45] as [number], height: 1.4, tone: 'hot' as const, color: HUE.gold, glow: 0.3 }
			: n.depth === 1
				? { size: [1.5, 0.8] as [number, number], height: 0.85, tone: 'accent' as const, color: HUE.gold }
				: { size: [0.95, 0.7] as [number, number], height: 0.45, tone: 'accent' as const, color: HUE.silla };
	const front = Math.max(...layout.nodes.map((n) => n.z));
</script>

<KitTree {layout} {look} linkTone="accent" linkColor={HUE.gold}>
	{#snippet label(n, h)}
		<KitLabel
			at={[n.x, n.depth > 1 ? 0.22 : h + 0.35, n.depth > 1 ? n.z + 0.36 : n.z]}
			ko={n.item.ko}
			en={n.item.en}
			size={n.depth > 1 ? 'xs' : 'md'}
			tone={n.depth === 0 ? 'strong' : 'plain'}
			delay={n.depth * 260 + n.order * 35 + 150}
		/>
	{/snippet}
</KitTree>

<KitLabel
	at={[layout.nodes[1].x + 2.4, 0.4, layout.nodes[1].z]}
	ko="결코 충분하지 않다"
	en="Never Enough"
	size="xs"
	tone="note"
	accent={HUE.gold}
	minor
	delay={380}
/>
<KitLabel
	at={[0, 0.05, front + 0.95]}
	ko="14부"
	en="Tang's six was never enough"
	size="xs"
	tone="note"
	accent={HUE.gold}
	delay={1200}
/>
