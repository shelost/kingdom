<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	/** Server load already 308s; this keeps a hash like `#ch-…` when the client lands here. */
	if (browser) {
		const hash = page.url.hash;
		goto(`${resolve('/books')}${page.url.search}${hash}`, { replaceState: true });
	}
</script>