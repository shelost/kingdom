<script lang="ts">
	/**
	 * One simplified person for each of the ten peoples, drawn to stay readable
	 * inside the label disc. Each face uses that people's own picture-language:
	 * a relief profile, a mosaic bust, a painted miniature.
	 */
	import type { PeopleMarkId } from '$lib/peopleMarks';

	let { id, size = 26 }: { id: PeopleMarkId; size?: number } = $props();
</script>

<span class="disc" style:width="{size}px" style:height="{size}px">
	<svg viewBox="0 0 64 64" aria-hidden="true">
		{#if id === 'taegeuk'}
			<!-- Samhan: topknot, white collar, a red ribbon -->
			<circle cx="32" cy="26" r="11" fill="#e6b898" />
			<path fill="#1a120e" d="M22 24c1-10 6-16 10-16s9 6 10 16c-2 2-6 3-10 3s-8-1-10-3z" />
			<ellipse cx="32" cy="14" rx="4" ry="3.2" fill="#1a120e" />
			<path fill="#f4f1e8" d="M18 46c2-8 7-12 14-12s12 4 14 12v8H18z" />
			<path fill="#c30000" d="M29 36h6l-1 8h-4z" />
			<path fill="#1a120e" d="M27 24h2.2v1.6H27zM35 24h2.2v1.6H35z" />
		{:else if id === 'chrysanthemum'}
			<!-- Wa: long hair, a white robe, a small gold pin -->
			<circle cx="32" cy="27" r="10" fill="#f0c8a8" />
			<path fill="#1a120e" d="M20 30c0-14 5-20 12-20s12 6 12 20c-1 8-4 14-12 16-8-2-11-8-12-16z" />
			<ellipse cx="32" cy="26" rx="8" ry="9" fill="#f0c8a8" />
			<path fill="#e2b123" d="M30 16h4l-1 4h-2z" />
			<path fill="#f7f4ee" d="M18 48c3-9 8-13 14-13s11 4 14 13v6H18z" />
			<path fill="#1a120e" d="M27.5 25h2v1.4h-2zM34.5 25h2v1.4h-2z" />
		{:else if id === 'taiji'}
			<!-- The West: black cap, thin beard, amber robe -->
			<path fill="#161616" d="M20 28c1-8 5-12 12-12s11 4 12 12v4H20z" />
			<circle cx="32" cy="30" r="9" fill="#e2b48c" />
			<path fill="#161616" d="M28 36c1 3 2 5 4 5s3-2 4-5c-1 1-2.4 1.4-4 1.4s-3-.4-4-1.4z" />
			<path fill="#3a2414" d="M27 34h10v1.2H27z" />
			<path fill="#c9841a" d="M16 46c3-8 8-12 16-12s13 4 16 12v8H16z" />
			<path fill="#f4f1e8" d="M30 36h4l-0.6 6h-2.8z" />
			<path fill="#1a120e" d="M27 28h2v1.5h-2zM35 28h2v1.5h-2z" />
		{:else if id === 'om'}
			<!-- Cheonchuk: painted miniature, green turban, full beard -->
			<circle cx="30" cy="30" r="20" fill="none" stroke="#c9a15b" stroke-width="1.4" />
			<path fill="#2f6b45" d="M14 28c2-14 10-18 18-16 6 1 10 6 12 12 1 2-2 4-6 3-2-6-6-9-12-8-8 1-12 6-12 9z" />
			<path fill="#e2b123" d="M16 26c6-2 14-2 22 2-4 1-8 1-12 0-4 0-7-1-10-2z" />
			<path fill="#e8c4a4" d="M22 30c1-6 5-8 9-7 5 1 7 5 7 9 0 3-2 5-4 6-6 1-12-1-12-8z" />
			<path fill="#1a120e" d="M24 38c2 6 6 10 10 10 3 0 5-2 6-5-4 1-8 0-12-2-2-1-3-2-4-3z" />
			<path fill="#f6f1e4" d="M20 50c4-6 10-8 16-6 4 1 6 4 7 7v3H18z" />
			<path fill="#1a120e" d="M26 31h2.2v1.4H26z" />
		{:else if id === 'eagle'}
			<!-- Bulim: mosaic bust, jewel band, pearl drops -->
			<circle cx="32" cy="30" r="22" fill="none" stroke="#c9a15b" stroke-width="2" />
			<path fill="#3a4a78" d="M14 58c4-14 10-18 18-18s14 4 18 18z" />
			<circle cx="32" cy="30" r="11" fill="#e7cbb8" />
			<path fill="#2a3148" d="M21 28c1-9 5-13 11-13s10 4 11 13c-2 1-6 2-11 2s-9-1-11-2z" />
			<path fill="#c45c12" d="M20 22h24v3.2H20z" />
			<circle cx="24" cy="23.2" r="1.3" fill="#f4f1e8" />
			<circle cx="32" cy="23.2" r="1.3" fill="#7eb8c9" />
			<circle cx="40" cy="23.2" r="1.3" fill="#f4f1e8" />
			<path fill="#3a2414" d="M28 36c1 2 2 3 4 3s3-1 4-3" />
			<circle cx="18" cy="36" r="2.2" fill="#f4f1e8" />
			<circle cx="46" cy="36" r="2.2" fill="#f4f1e8" />
			<path fill="#1a120e" d="M26.5 29h2.4v1.8h-2.4zM35 29h2.4v1.8H35z" />
		{:else if id === 'wolf'}
			<!-- The northern nomads: fur cap, braid -->
			<path fill="#6b5344" d="M18 30c2-12 8-16 14-14 5 1 8 6 9 12 2 1 4 4 3 7H16c0-2 1-4 2-5z" />
			<circle cx="34" cy="32" r="9" fill="#c9956a" />
			<path d="M40 34c2 8 1 14-2 18" stroke="#1a120e" stroke-width="2.4" fill="none" />
			<path fill="#3a2414" d="M30 38c1 2 3 3 5 2" />
			<path fill="#5c4636" d="M16 48c4-8 10-12 18-11 6 1 10 5 12 11v6H16z" />
			<path fill="#1a120e" d="M31 31h2v1.4h-2z" />
		{:else if id === 'faravahar'}
			<!-- Pasa: stone relief, curled beard, rounded cap -->
			<path fill="#b7b1a6" d="M8 64V20c8-8 16-10 22-6 4 2 6 6 6 10v40z" />
			<path fill="#8e877c" d="M14 28c6-8 14-10 20-4v8c-6-2-12-1-16 2z" />
			<circle cx="30" cy="30" r="8" fill="#cfc8bb" />
			<path fill="#7a7368" d="M22 26c2-8 8-10 12-6 2 2 2 5 1 8-4-2-8-2-13-2z" />
			<path fill="#6e675c" d="M24 34c2 2 4 6 4 10 3-1 6-4 8-8 1 4 1 8-1 12-6 2-12 1-16-2 0-4 1-8 5-12z" />
			<circle cx="27" cy="29" r="1.3" fill="#3a342c" />
			<path fill="#8a6230" d="M36 48h10v6H34z" />
		{:else if id === 'kufic'}
			<!-- Daesik: white headcloth, dark beard -->
			<path fill="#f7f4ee" d="M16 32c2-14 8-18 16-16s14 6 16 16c2 2 2 6 0 8H16c-1-2-1-6 0-8z" />
			<path fill="#1a120e" d="M22 30h20v2.2H22z" />
			<circle cx="32" cy="34" r="8" fill="#c98460" />
			<path fill="#1a120e" d="M24 40c2 6 5 9 8 9s6-3 8-9c-2 1-5 2-8 2s-6-1-8-2z" />
			<path fill="#1c140c" d="M18 50c4-8 9-11 14-11s10 3 14 11v4H18z" />
			<path fill="#1a120e" d="M28 33h2v1.4h-2zM34 33h2v1.4h-2z" />
		{:else if id === 'sail'}
			<!-- The southern seas: bare head, a red shoulder, one earring -->
			<circle cx="32" cy="26" r="10" fill="#8a5a3a" />
			<path fill="#2a160e" d="M22 24c1-8 5-12 10-12s9 4 10 12c-2 1-6 2-10 2s-8-1-10-2z" />
			<circle cx="42" cy="32" r="1.6" fill="#e2b123" />
			<path fill="#9a2b2b" d="M18 46c3-8 8-12 14-12s11 4 14 12v8H18z" />
			<path fill="#f4f1e8" d="M28 36h8l-1 5h-6z" />
			<path fill="#1a120e" d="M27 25h2v1.4h-2zM34 25h2v1.4h-2z" />
		{:else}
			<!-- Tobun: wrapped hair, a red coat -->
			<path fill="#1a120e" d="M20 30c1-12 6-16 12-15 7 1 11 7 11 15 2 2 3 6 1 8-4-1-8-4-12-4s-8 2-12 4c-2-3-1-7 0-8z" />
			<circle cx="33" cy="31" r="8.5" fill="#d2a47a" />
			<path fill="#9a2b2b" d="M16 48c4-9 10-13 17-12 6 1 11 5 14 12v6H16z" />
			<path fill="#e2b123" d="M30 38h6v2.2h-6z" />
			<path fill="#1a120e" d="M30 30h2v1.4h-2z" />
		{/if}
	</svg>
</span>

<style>
	.disc {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		border-radius: 50%;
		background: #f7f1e6;
		border: 1px solid rgb(0 0 0 / 0.28);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.4);
		overflow: hidden;
	}

	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
