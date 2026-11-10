<script lang="ts">
	/**
	 * One mark for each of the ten peoples, drawn so it stays crisp at label size.
	 * Samhan is Momal's samtaegeuk — the same three commas as the chat mark.
	 */
	import MomalMark from '$lib/components/MomalMark.svelte';
	import type { PeopleMarkId } from '$lib/peopleMarks';

	let { id, size = 26 }: { id: PeopleMarkId; size?: number } = $props();

	const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
</script>

<span class="disc" style:width="{size}px" style:height="{size}px">
	{#if id === 'taegeuk'}
		<MomalMark size={Math.round(size * 0.78)} />
	{:else if id === 'chrysanthemum'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			{#each petals as deg (deg)}
				<ellipse cx="32" cy="13" rx="3.1" ry="11" fill="#e2b123" transform="rotate({deg} 32 32)" />
			{/each}
			<circle cx="32" cy="32" r="6.5" fill="#f6e7a2" />
			<circle cx="32" cy="32" r="3.2" fill="#c9841a" />
		</svg>
	{:else if id === 'taiji'}
		<svg class="full" viewBox="0 0 64 64" aria-hidden="true">
			<circle cx="32" cy="32" r="32" fill="#f4f1e8" />
			<path fill="#161616" d="M32 0a32 32 0 0 1 0 64 16 16 0 0 1 0-32 16 16 0 0 0 0-32z" />
			<circle cx="32" cy="16" r="5" fill="#161616" />
			<circle cx="32" cy="48" r="5" fill="#f4f1e8" />
		</svg>
	{:else if id === 'om'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<text x="32" y="46" text-anchor="middle" fill="#c45c12">ॐ</text>
		</svg>
	{:else if id === 'eagle'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path fill="#6b3a1f" d="M32 6c1.4 0 2.4 1.6 2 3.2L30.6 16c6-1 12 1 16 5 5 4 9 4 14 2-1 3-4 5-8 5-2 4-2 8 0 12 3 1 5 4 4 7-6-1-10-4-12-8l-2 8c4 3 6 8 5 13h-7c0-5-1-8-3-10l-1.6 9h-8l-1.6-9c-2 2-3 5-3 10h-7c-1-5 1-10 5-13l-2-8c-2 4-6 7-12 8-1-3 1-6 4-7 2-4 2-8 0-12-4 0-7-2-8-5 5 2 9 2 14-2 4-4 10-6 16-5l-3.4-6.8C29.6 7.6 30.6 6 32 6z" />
			<path fill="#e6c15a" d="M32 18l3 7h-6z" />
			<circle cx="33.2" cy="12.5" r="1.1" fill="#f6e7a2" />
		</svg>
	{:else if id === 'wolf'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path fill="#2a2118" d="M10 30l8-16 6 8 8-10 8 10 6-8 8 16-6 4 2 16c-6 6-14 8-18 8s-12-2-18-8l2-16z" />
			<path fill="#2a2118" d="M22 18l4-12 6 8zM42 18l-4-12-6 8z" />
			<path fill="#f4f1e6" d="M24 36c2 6 6 10 8 10s6-4 8-10c-2 2-5 3-8 3s-6-1-8-3z" />
			<circle cx="26" cy="32" r="1.7" fill="#f6e7a2" />
			<circle cx="38" cy="32" r="1.7" fill="#f6e7a2" />
			<path fill="#161616" d="M30 40h4l-2 3z" />
		</svg>
	{:else if id === 'faravahar'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<circle cx="32" cy="28" r="8" fill="none" stroke="#c9a15b" stroke-width="2.4" />
			<circle cx="32" cy="28" r="2.4" fill="#c9a15b" />
			<path fill="#e2b123" d="M24 28c-2-7-8-11-16-12 2 4 6 7 11 8-3 2-5 5-6 8 5-1 9-3 11-6z" />
			<path fill="#e2b123" d="M40 28c2-7 8-11 16-12-2 4-6 7-11 8 3 2 5 5 6 8-5-1-9-3-11-6z" />
			<path fill="#8a6230" d="M29.5 35c.6 6 1.4 12 2.5 16 1.1-4 1.9-10 2.5-16-1.4 1-2.2 1-5 0z" />
			<path fill="#c9841a" d="M26 22c2-6 4-8 6-8s4 2 6 8c-2 1-4 1-6 1s-4 0-6-1z" />
		</svg>
	{:else if id === 'kufic'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<circle cx="32" cy="32" r="22" fill="none" stroke="#1c140c" stroke-width="2.2" />
			<circle cx="32" cy="32" r="17" fill="none" stroke="#1c140c" stroke-width="1" />
			<text class="arab" x="32" y="38" text-anchor="middle">الله</text>
		</svg>
	{:else if id === 'sail'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path fill="#9a2b2b" d="M30 10l16 34H30z" />
			<path fill="#6e8fbe" d="M28 10l2 34H16z" />
			<path fill="#2a2118" d="M12 46h40l-4 6H16z" />
		</svg>
	{:else}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path
				fill="none"
				stroke="#c45c12"
				stroke-width="5"
				stroke-linejoin="round"
				d="M18 24h16l6-8 6 8h0l-8 8 8 8h-10l-6 8-6-8H18l8-8z"
			/>
		</svg>
	{/if}
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
		width: 78%;
		height: 78%;
		display: block;
	}

	svg.full {
		width: 100%;
		height: 100%;
	}

	text {
		font-family: 'Noto Serif Devanagari', 'Kohinoor Devanagari', serif;
		font-size: 40px;
		font-weight: 700;
	}

	text.arab {
		font-family: 'Noto Naskh Arabic', 'Geeza Pro', serif;
		font-size: 18px;
		font-weight: 700;
		fill: #1c140c;
	}
</style>
