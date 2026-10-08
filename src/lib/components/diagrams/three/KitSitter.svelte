<script lang="ts">
	/**
	 * The person in a seat, when a chart shows a scene: their portrait and name standing
	 * on the seat's top. Charts that only introduce an institution label seats by title.
	 */
	import KitLabel from './KitLabel.svelte';
	import type { Sitter } from '../cast';
	import type { Vec3 } from './kit.svelte';

	let {
		at,
		who,
		accent,
		size = 'sm',
		delay = 0,
		moveDelay,
		show = true,
		struck = false
	}: {
		at: Vec3;
		who: Sitter;
		/** The ring round the face: the seat's kingdom, or red for a dissent. */
		accent?: string;
		size?: 'xs' | 'sm';
		delay?: number;
		moveDelay?: number;
		show?: boolean;
		struck?: boolean;
	} = $props();
</script>

<KitLabel
	{at}
	lift
	img={who.img}
	faceZoom={1.8}
	ko={who.ko}
	en={who.en}
	{size}
	tone="accent"
	{accent}
	{delay}
	{moveDelay}
	{show}
	{struck}
/>
