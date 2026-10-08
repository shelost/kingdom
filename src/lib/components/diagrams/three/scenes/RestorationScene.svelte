<script lang="ts">
	/**
	 * Baekje Restoration Army in 3D: a king's pillar and four generals' seats before it.
	 * In a scene, each seat carries its captain's face (seat ids: king, g0–g3).
	 */
	import KitTree from '../KitTree.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitSitter from '../KitSitter.svelte';
	import { HUE, box, getKit, treeLayout, type TreeItem, type TreeNode } from '../kit.svelte';
	import { sitter, type Cast } from '../../cast';
	import { GENERALS } from '../../RestorationArmy.svelte';

	let { cast, year = null }: { cast?: Cast; year?: number | null } = $props();

	const kit = getKit();

	const items: TreeItem[] = [
		{ id: 'king', parent: null },
		...GENERALS.map((_, i) => ({ id: `g${i}`, parent: 'king' }))
	];
	const layout = treeLayout(items, { dx: 2, dz: 2.6 });
	$effect(() => kit.fit(box(-4.4, 4.4, -2.4, 2.9, 2.4)));

	const look = (n: TreeNode<TreeItem>) =>
		n.depth === 0
			? { shape: 'disc' as const, size: [0.55] as [number], height: 1.7, tone: 'hot' as const, color: HUE.baekje, glow: 0.3 }
			: { size: [1.2, 0.9] as [number, number], height: 0.9, tone: 'accent' as const, color: HUE.baekje };
</script>

<KitTree {layout} {look} linkTone="accent" linkColor={HUE.baekje}>
	{#snippet label(n, h)}
		{@const who = sitter(cast, n.id, year)}
		{#if who}
			<KitSitter
				at={[n.x, h + 0.08, n.z]}
				{who}
				accent={HUE.baekje}
				size={n.depth ? 'xs' : 'sm'}
				delay={n.depth * 260 + n.order * 35 + 200}
			/>
		{:else}
			<KitLabel
				at={[n.x, h + 0.38, n.z]}
				ko={n.depth ? '장군' : '왕'}
				en={n.depth ? 'General' : 'King'}
				size={n.depth ? 'sm' : 'lg'}
				tone={n.depth ? 'plain' : 'strong'}
				delay={n.depth * 260 + n.order * 35 + 200}
			/>
		{/if}
	{/snippet}
</KitTree>

<KitLabel
	at={[0, 0.05, 2.5]}
	ko="백제부흥군"
	en="Restoration Army"
	size="xs"
	tone="note"
	accent={HUE.baekje}
	delay={900}
/>
