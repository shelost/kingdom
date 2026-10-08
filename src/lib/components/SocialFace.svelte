<script lang="ts">
	import { avatarOf, colorOf, godRingOf, isPlaceholderArt, wearsSquare, type Person } from '$lib/people';

	/**
	 * A profile picture on a social card (LinkedIn, Facebook, mail): the portrait
	 * cropped to the face, the monarch's square, a god's ring. A link to the wiki.
	 */
	let {
		person,
		year = null,
		look,
		art: given,
		size = '2.5rem',
		square: squareGiven,
		class: cls = ''
	}: {
		person?: Person;
		year?: number | null;
		look?: string;
		/** Overrides the portrait (a stage the caller already resolved). */
		art?: string | null;
		size?: string;
		square?: boolean;
		class?: string;
	} = $props();

	let art = $derived(given !== undefined ? given : person ? avatarOf(person, person.id, year, look) : null);
	let square = $derived(squareGiven ?? (person ? wearsSquare(person, year, look) : false));
	let ring = $derived(person ? godRingOf(person) : null);
	let stand = $derived(isPlaceholderArt(art));
</script>

<span
	class="social-face person {cls}"
	class:square
	class:stand
	class:god-ring={!!ring}
	style:--size={size}
	style:--god-ring={ring}
	style:--accent={person ? colorOf(person) : 'var(--fg-faint)'}
	data-person={person?.id}
>
	{#if art}<img src={art} alt="" loading="lazy" decoding="async" />{/if}
</span>

<style>
	.social-face {
		display: inline-block;
		flex: none;
		width: var(--size);
		height: var(--size);
		padding: 0;
		overflow: hidden;
		vertical-align: middle;
		border: none;
		border-radius: 50%;
		background: var(--accent);
		cursor: pointer;
	}

	.social-face.square {
		border-radius: var(--monarch-radius);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		transform: scale(1.9);
		transform-origin: 50% 10%;
	}

	.stand img {
		transform: none;
		object-position: center;
	}
</style>
