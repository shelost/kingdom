<script lang="ts">
	/**
	 * A wiki org chart standing up: one cylinder per seat in the character's
	 * colour, higher ranks taller and further back, a face chip on each.
	 * People open their wiki entry on click; synthetic seats stay inert.
	 */
	import KitTree from '../KitTree.svelte';
	import KitLabel from '../KitLabel.svelte';
	import { box, getKit, type TreeLook, type TreeNode } from '../kit.svelte';
	import {
		ORG_TOP,
		ORG_VIEW,
		orgLayout,
		orgName,
		type OrgItem
	} from '../../OrgChart.svelte';
	import { byId, avatarOf, colorOf, isPlaceholderArt, type OrgChartNode } from '$lib/people';
	import { storyImg } from '$lib/img';
	import { reading } from '$lib/reading.svelte';

	let { nodes = [], onOpen }: { nodes?: OrgChartNode[]; onOpen?: (id: string) => void } = $props();

	const kit = getKit();
	const layout = $derived(orgLayout(nodes));
	$effect(() => {
		const w = layout.width / 2 + 0.8;
		const d = layout.depth / 2 + 0.6;
		kit.fit(box(-w, w, -d - 0.4, d, ORG_TOP + 1.6), ORG_VIEW);
	});

	const heightAt = (depth: number) => Math.max(0.35, ORG_TOP - depth * 0.38);

	const look = (n: TreeNode<OrgItem>): TreeLook => {
		const person = byId.get(n.id);
		return {
			shape: 'disc',
			size: [0.62],
			height: heightAt(n.depth),
			tone: person ? 'accent' : 'dim',
			color: person ? colorOf(person) : undefined
		};
	};

	const faceOf = (id: string) => {
		const person = byId.get(id);
		const art = person && avatarOf(person);
		return art && !isPlaceholderArt(art) ? storyImg(art, { kind: 'thumb' }).src : null;
	};

	/** One name per chip, in the reader's language; both live in the tooltip. */
	const chipName = (n: TreeNode<OrgItem>) => {
		const en = orgName(n.item.node);
		const ko = byId.get(n.id)?.korean;
		return reading.lang === 'en' || !ko ? { en } : { ko };
	};

	const tipOf = (n: TreeNode<OrgItem>) => {
		const ko = byId.get(n.id)?.korean;
		const role = n.item.node.role;
		return [ko ? `${orgName(n.item.node)} · ${ko}` : orgName(n.item.node), role]
			.filter(Boolean)
			.join(' — ');
	};
</script>

{#key layout.nodes.map((n) => n.id).join()}
	<KitTree {layout} {look} linkTone="dim">
		{#snippet label(n, h)}
			{@const person = byId.get(n.id)}
			{@const open = person && onOpen ? () => onOpen(n.id) : undefined}
			<KitLabel
				at={[n.x, h, n.z]}
				lift
				{...chipName(n)}
				img={faceOf(n.id)}
				accent={person ? colorOf(person) : undefined}
				size={n.depth ? 'xs' : 'sm'}
				tone={person ? 'accent' : 'muted'}
				title={tipOf(n)}
				onclick={open}
				delay={n.depth * 260 + n.order * 35 + 200}
			/>
		{/snippet}
	</KitTree>
{/key}
