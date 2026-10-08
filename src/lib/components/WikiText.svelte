<script lang="ts">
	import { resolve } from '$app/paths';
	import { byId, nameOf } from '$lib/people';
	import { linkSegments } from '$lib/wiki';

	let {
		text,
		selfId,
		onOpen
	}: {
		text: string;
		/** The page being read — its own name never links. */
		selfId?: string;
		onOpen: (id: string) => void;
	} = $props();

	let segments = $derived(linkSegments(text, selfId));

	/** Plain click opens in place; modified clicks keep the real href (new tab, copy link). */
	function follow(e: MouseEvent, id: string) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault();
		onOpen(id);
	}

	function titleFor(id: string) {
		const p = byId.get(id);
		return p ? nameOf(p) : id;
	}
</script>

{#each segments as seg, i (i)}{#if seg.id}{@const id = seg.id}<a
			class="wlink"
			href={resolve(`/wiki?id=${encodeURIComponent(id)}`)}
			title={titleFor(id)}
			onclick={(e) => follow(e, id)}>{seg.text}</a
		>{:else}{seg.text}{/if}{/each}

<style>
	.wlink {
		color: var(--wiki-link);
		font-weight: var(--weight-link);
		letter-spacing: inherit;
		text-decoration: none;
		border-radius: 2px;
		transition: color 0.15s var(--ease);
	}

	.wlink:hover {
		text-decoration: underline;
		text-underline-offset: 0.16em;
		text-decoration-thickness: 1px;
	}

	.wlink:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--wiki-link) 60%, transparent);
		outline-offset: 1px;
	}
</style>
