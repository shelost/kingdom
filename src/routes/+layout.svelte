<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import '$lib/components/diagrams/orgChartTheme.css';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import { applyNsfwFromUrl, NSFW_QUERY, nsfwQueryOn } from '$lib/nsfwUi.svelte';
	import { applyEditFromUrl, EDIT_QUERY, editQueryOn } from '$lib/editUi.svelte';
	import { applyReadingFromUrl, EP_QUERY, VIEW_QUERY } from '$lib/reading.svelte';

	let { children } = $props();

	$effect(() => {
		const url = page.url;
		applyNsfwFromUrl(url);
		applyEditFromUrl(url);
		applyReadingFromUrl(url);
	});

	/** Carry reader flags across same-origin in-app navigations. */
	beforeNavigate((nav) => {
		if (nav.willUnload || !nav.from || !nav.to) return;
		if (nav.type === 'popstate') return;
		if (nav.to.url.origin !== nav.from.url.origin) return;

		const from = nav.from.url;
		const next = new URL(nav.to.url);
		let dirty = false;

		if (nsfwQueryOn(from) && !nsfwQueryOn(next)) {
			next.searchParams.set(NSFW_QUERY, 'true');
			dirty = true;
		}
		if (editQueryOn(from) && !editQueryOn(next)) {
			next.searchParams.set(EDIT_QUERY, 'true');
			dirty = true;
		}

		/* Episode encoding only travels on the chronicle home (`?ep=jumong`).
		   Carry `ep` only when the destination omitted it — never clobber an
		   explicit new episode with the previous one. */
		const toStory = next.pathname === '/' || next.pathname === '';
		const fromStory = from.pathname === '/' || from.pathname === '';
		if (toStory && fromStory) {
			const ep = from.searchParams.get(EP_QUERY);
			const view = from.searchParams.get(VIEW_QUERY);
			if (ep && !next.searchParams.has(EP_QUERY)) {
				next.searchParams.set(EP_QUERY, ep);
				dirty = true;
			} else if (
				!ep &&
				view === 'episodes' &&
				!next.searchParams.has(EP_QUERY) &&
				next.searchParams.get(VIEW_QUERY) !== 'episodes'
			) {
				/* Legacy bookmarks that only carried view=episodes. */
				next.searchParams.set(VIEW_QUERY, 'episodes');
				dirty = true;
			}
		}

		if (!dirty) return;
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
