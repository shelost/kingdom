<script lang="ts">
	/**
	 * The pantheon as tiers: Hwanin's tall plinth at the back, the three realm
	 * heads a step lower, their courts lower still and nearer. Each realm
	 * keeps its colour (Dead blue, Living red, West Field green). `realm`
	 * narrows it to one column, Hwanin's mandate line, or Tamla's shrine gods;
	 * 'realms' shows the heads only.
	 */
	import KitTree from '../KitTree.svelte';
	import KitLabel from '../KitLabel.svelte';
	import {
		HUE,
		box,
		getKit,
		treeLayout,
		type TreeItem,
		type TreeLook,
		type TreeNode
	} from '../kit.svelte';
	import { COLS, livingBase, normalizeRealm, tamlaIII, type RealmId } from '../../PantheonChart.svelte';

	let { step = 'courts', realm }: { step?: string; realm?: string } = $props();

	const kit = getKit();

	const COLOR: Record<RealmId | 'creator', string> = {
		creator: HUE.gold,
		heaven: '#f4f1e8',
		underworld: '#4d8eff',
		living: '#ff4d4d',
		flower: '#6fdb78',
		tamla: '#ff9a2e'
	};

	type God = TreeItem & { ko: string; en: string; realm: RealmId | 'creator' };

	const focus = $derived(normalizeRealm(realm));
	const full = $derived(focus ? true : step !== 'realms');

	const items = $derived.by((): God[] => {
		if (focus === 'heaven')
			return [
				{ id: 'hwanin', ko: '환인', en: 'Creator', realm: 'creator' },
				{ id: 'hwanung', parent: 'hwanin', ko: '환웅', en: 'Hwanung', realm: 'heaven' },
				{ id: 'dangun', parent: 'hwanung', ko: '단군', en: 'Dangun', realm: 'heaven' }
			];
		if (focus === 'tamla')
			return [
				{ id: 'sobyeol', ko: '소별왕', en: 'Little Star', realm: 'living' },
				...tamlaIII.map((t) => ({
					id: t.en,
					parent: 'sobyeol',
					ko: t.ko,
					en: t.en,
					realm: 'tamla' as const
				}))
			];
		const cols = focus ? COLS.filter((c) => c.realm === focus) : COLS;
		const out: God[] = focus ? [] : [{ id: 'hwanin', ko: '환인', en: 'Creator', realm: 'creator' }];
		for (const c of cols) {
			out.push({ id: c.id, parent: focus ? null : 'hwanin', ko: c.ko, en: c.en, realm: c.realm });
			if (!full) continue;
			if (c.realm === 'underworld') {
				out.push({ id: 'yumla', parent: c.id, ko: '염라', en: 'Yumla', realm: 'underworld' });
				out.push({ id: 'kangrim', parent: 'yumla', ko: '강림', en: 'Kangrim', realm: 'underworld' });
				out.push({ id: 'haewonmek', parent: 'yumla', ko: '해원맥', en: 'Haewonmek', realm: 'underworld' });
			}
			if (c.realm === 'living') {
				for (const L of livingBase)
					out.push({ id: L.en, parent: c.id, ko: L.ko, en: L.en, realm: 'living' });
			}
		}
		return out;
	});

	const layout = $derived(treeLayout(items, { dx: 1.55, dz: 2.0 }));
	const HEIGHTS = [2.0, 1.4, 0.9, 0.6];

	$effect(() => {
		const half = Math.max(2.6, layout.width / 2 + 0.2);
		const d = layout.depth / 2;
		kit.fit(box(-half, half, -d - 0.9, d + 1.3, 2.8));
	});

	const look = (n: TreeNode<God>): TreeLook => ({
		shape: n.depth === 0 && n.item.realm === 'creator' ? 'disc' : 'slab',
		size: n.depth === 0 && n.item.realm === 'creator' ? [0.6] : n.depth <= 1 ? [1.25, 0.9] : [1.05, 0.75],
		height: HEIGHTS[Math.min(n.depth + (focus && focus !== 'heaven' ? 1 : 0), 3)],
		tone: n.depth === 0 ? 'hot' : 'accent',
		color: COLOR[n.item.realm],
		glow: n.depth === 0 ? 0.3 : 0
	});

	const front = $derived(Math.max(...layout.nodes.map((n) => n.z)));
	const foot = $derived.by(() => {
		if (focus === 'heaven') return { ko: '하늘나라', en: 'Heaven · Creator' };
		if (focus === 'tamla') return { ko: '탐라', en: 'Tamla · Class III' };
		if (focus) {
			const c = COLS.find((col) => col.realm === focus)!;
			return { ko: c.realmKo, en: c.realmEn };
		}
		return { ko: '삼계', en: 'Three Realms under Hwanin' };
	});
</script>

{#key items.map((i) => i.id).join()}
	<KitTree {layout} {look} linkTone="base">
		{#snippet label(n, h)}
			<KitLabel
				at={[n.x, h + 0.36, n.z]}
				ko={n.item.ko}
				en={n.item.en}
				size={n.depth === 0 ? 'md' : n.depth === 1 ? 'sm' : 'xs'}
				tone={n.depth === 0 ? 'strong' : 'accent'}
				accent={COLOR[n.item.realm]}
				delay={n.depth * 260 + n.order * 35 + 200}
			/>
		{/snippet}
	</KitTree>
{/key}

<KitLabel
	at={[0, 0.05, front + 1.0]}
	ko={foot.ko}
	en={foot.en}
	size="xs"
	tone="note"
	accent={HUE.pantheon}
	delay={full ? 1100 : 500}
/>
