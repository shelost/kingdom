<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import '$lib/components/diagrams/orgChartTheme.css';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import { applyNsfwFromUrl, NSFW_QUERY, nsfwQueryOn } from '$lib/nsfwUi.svelte';

	let { children } = $props();

	$effect(() => {
		applyNsfwFromUrl(page.url);
	});

	beforeNavigate((nav) => {
		if (nav.willUnload || !nav.from || !nav.to) return;
		if (nav.type === 'popstate') return;
		if (!nsfwQueryOn(nav.from.url)) return;
		if (nsfwQueryOn(nav.to.url)) return;
		if (nav.to.url.origin !== nav.from.url.origin) return;
		const next = new URL(nav.to.url);
		next.searchParams.set(NSFW_QUERY, 'true');
		nav.cancel();
		void goto(`${next.pathname}${next.search}${next.hash}`, {
			keepFocus: true,
			noScroll: nav.type === 'goto',
			invalidateAll: false
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="rail" aria-hidden="true"></div>

{@render children()}
<ImageLightbox />
