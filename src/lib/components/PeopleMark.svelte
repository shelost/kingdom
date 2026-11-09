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
	{:else if id === 'dragon'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path
				fill="#c30000"
				d="M14 40c2-10 8-14 14-12 4 1 6 5 5 8-1 4-6 5-8 2 6-1 12 2 14 8 2 6-2 12-8 13-8 1-14-6-12-13 1-4 5-6 8-5-3 0-6-2-6-5s3-5 6-4c8 2 10-6 8-12-2-4-1-8 2-10 2-1 4 0 5 2 1 3-1 6-4 7 6 0 12 6 12 13 0 8-7 14-16 14-6 0-11-3-14-7-2 6-8 10-14 8-4-1-6-5-4-8z"
			/>
			<circle cx="46" cy="18" r="1.6" fill="#f6e7a2" />
		</svg>
	{:else if id === 'om'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<text x="32" y="46" text-anchor="middle" fill="#c45c12">ॐ</text>
		</svg>
	{:else if id === 'eagle'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path fill="#6e4a28" d="M32 10c2 6 2 10 0 14-6-2-14 0-20 6 8 1 14 5 16 10-2 8-2 16-1 22h6c1-8 1-16 0-22 4-2 10-2 16 0-1 6-1 14 0 22h6c1-8 0-16-2-22 2-5 8-9 16-10-6-6-14-8-20-6-2-4-2-8 0-14-2 1-4 2-6 2s-4-1-6-2z" />
			<path fill="#c9a15b" d="M30 22h4l2 6h-8z" />
		</svg>
	{:else if id === 'horse'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path
				fill="#2a2118"
				d="M8 40c2-2 6-2 8 0l2 6h6l2-10 4 2 2-8c4-6 10-8 16-6l6 2-2 4-4-1c-2 0-4 2-4 4l2 8h6l3 8H41l-2-6h-8l-2 6H17l-2-6H9z"
			/>
			<path fill="#2a2118" d="M44 16c4 0 8 3 8 7 0 2-2 3-3 2l-6-2 1-7z" />
		</svg>
	{:else if id === 'lion'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<circle cx="44" cy="24" r="10" fill="#e2b123" />
			<path fill="#c9841a" d="M18 40c0-6 6-10 14-10h8c2 6 2 12-2 16H22c-4-1-4-4-4-6z" />
			<path fill="#8a5a12" d="M16 36c2 6 4 14 2 18h6c0-6-2-10-2-14-4 0-6-2-6-4zM48 34c2 0 6 2 6 6s-4 8-8 10c2-4 2-8 0-12 1-2 1-4 2-4z" />
			<circle cx="47" cy="23" r="1.3" fill="#2a2118" />
		</svg>
	{:else if id === 'crescent'}
		<svg viewBox="0 0 64 64" aria-hidden="true">
			<path fill="#e6c15a" d="M36 10a22 22 0 1 0 0 44 18 18 0 1 1 0-44z" />
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

	text {
		font-family: 'Noto Serif Devanagari', 'Kohinoor Devanagari', serif;
		font-size: 40px;
		font-weight: 700;
	}
</style>
