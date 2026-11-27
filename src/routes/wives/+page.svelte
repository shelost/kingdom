<script lang="ts">
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import WivesTable from '$lib/components/WivesTable.svelte';
	import { reading } from '$lib/reading.svelte';

	let ko = $derived(reading.lang === 'ko');
</script>

<svelte:head>
	<title>{ko ? '왕후' : 'Wives'}</title>
</svelte:head>

<SiteNavSpace />
<PersonLayer />

<article class="column">
	<header>
		<p class="kicker">{ko ? '후삼제왕' : 'The God King'}</p>
		<h1>{ko ? '왕건의 왕후' : "Wang Geon's wives"}</h1>
		<p class="deck">
			{ko
				? '스물아홉. 숫자는 딸의 차례다. 이름은 그 집의 아비다.'
				: 'Twenty-nine. The number is the daughter’s place. The name is her father.'}
		</p>
		<p class="more">
			<a href={resolve('/later')}>{ko ? '후삼국으로' : 'Read it in Later'}</a>
		</p>
	</header>
	<WivesTable />
</article>

<style lang="scss">
	.column {
		width: min(100%, 40rem);
		margin: 0 auto;
		padding: 0 1.25rem 6rem;
	}

	header {
		padding: 1.5rem 0 1.25rem;
	}

	.kicker {
		margin: 0 0 0.4rem;
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-dim);
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(2rem, 5vw, 2.8rem);
		font-weight: 650;
		line-height: 1.1;
	}

	.deck {
		margin: 0.7rem 0 0;
		max-width: 34rem;
		color: var(--fg-dim);
		line-height: 1.5;
	}

	.more {
		margin: 0.8rem 0 0;
		a {
			color: var(--wiki-link);
			text-decoration: none;
			&:hover {
				text-decoration: underline;
				text-underline-offset: 0.16em;
			}
		}
	}
</style>
