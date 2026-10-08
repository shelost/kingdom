<script lang="ts">
	import { avatarOf, nameOf, colorOf, hangulInitial, wearsSquare, godRingOf, type Person } from '$lib/people';
	import { storyImg } from '$lib/img';

	/**
	 * A clickable face badge for anyone on a card: opens their profile through
	 * PersonLayer (`.person[data-person]`). Sovereigns wear a square frame with
	 * softened corners; everyone else a circle.
	 */
	let {
		person,
		year = null,
		look,
		size = '2.7rem',
		crop = 'head',
		label = false
	}: {
		person: Person;
		year?: number | null;
		look?: string;
		/** Edge of the badge (any CSS length). */
		size?: string;
		/** `head`: zoom onto the face of a standing portrait; `bust`: the whole figure. */
		crop?: 'head' | 'bust';
		/** Print the name beside the face. */
		label?: boolean;
	} = $props();

	let art = $derived(avatarOf(person, undefined, year, look));
	let who = $derived(nameOf(person, year, look));
	let monarch = $derived(wearsSquare(person, year, look));
	let ring = $derived(godRingOf(person));
</script>

<button
	type="button"
	class="avatar person"
	class:labelled={label}
	data-person={person.id}
	style:--c={colorOf(person)}
	style:--size={size}
	title={who}
	aria-label={label ? undefined : who}
>
	<span class="face {crop}" class:monarch class:god-ring={!!ring} style:--god-ring={ring}>
		{#if art}
			<img {...storyImg(art, { kind: 'thumb', alt: '', sizes: '56px' })} />
		{:else}
			<span class="initial">{hangulInitial(person)}</span>
		{/if}
	</span>
	{#if label}<span class="name">{who}</span>{/if}
</button>

<style>
	.avatar.person {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0;
		font: inherit;
		color: inherit;
		background: none;
		border: none;
		cursor: pointer;
	}

	.face {
		flex: none;
		width: var(--size);
		height: var(--size);
		display: grid;
		place-items: center;
		overflow: hidden;
		border: 2px solid var(--c);
		border-radius: 50%;
		background: var(--c);
		box-shadow: 0 6px 16px -6px rgb(0 0 0 / 0.55);
		transition: transform 0.25s var(--ease);
	}

	/* Government-badge frame for whoever holds the throne that year. */
	.face.monarch {
		border-radius: var(--monarch-radius);
	}

	.avatar.person:hover .face {
		transform: scale(1.08) rotate(-4deg);
	}

	.avatar.person:focus-visible {
		outline: none;
	}

	.avatar.person:focus-visible .face {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.face img {
		width: 100%;
		height: 100%;
	}

	/* Portraits are full standing figures; the head crop zooms onto the face. */
	.head img {
		object-fit: cover;
		object-position: center top;
		transform: scale(2.1);
		transform-origin: 50% 12%;
	}

	.bust img {
		object-fit: contain;
		object-position: center bottom;
	}

	.initial {
		font-family: var(--serif);
		font-size: calc(var(--size) * 0.36);
		font-weight: 700;
		color: #fff;
	}

	.name {
		font-family: var(--serif);
		font-size: 0.84rem;
		font-weight: 600;
		color: var(--name-ink, var(--fg-strong));
	}

	@media (prefers-reduced-motion: reduce) {
		.face {
			transition: none;
		}
	}
</style>
