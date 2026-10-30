<script lang="ts">
	import { storyImg } from '$lib/img';
	import type { CastMember } from '$lib/entryHead';

	/** Key art, not a scene: the cast billed by importance, on a ground that is only tone. */
	export type PosterMood = 'court' | 'war' | 'folk';

	let {
		people,
		mood = 'court',
		art
	}: {
		people: CastMember[];
		mood?: PosterMood;
		art?: string;
	} = $props();

	let failedArt = $state<string | undefined>(undefined);
	let showArt = $derived(!!art && failedArt !== art);

	let cast = $derived(people.filter((p) => p.avatar));
	let lead = $derived(cast[0]);
	let bill = $derived(cast.slice(1, 7));
	let accent = $derived(lead?.color ?? '#d8b26a');
</script>

<figure
	class="poster {mood}"
	class:painted={showArt}
	style:--accent={accent}
	aria-label="Cast"
>
	{#if showArt}
		<img class="painting" src={art} alt="" onerror={() => (failedArt = art)} />
	{/if}
	{#if lead?.avatar}
		<div class="lead" style:--c={lead.color}>
			<img {...storyImg(lead.avatar, { kind: 'portrait', alt: lead.name, sizes: '240px' })} />
		</div>
	{/if}
	{#if bill.length}
		<ul class="bill">
			{#each bill as person, i (person.id)}
				<li style:--c={person.color} style:--i={i}>
					{#if person.avatar}
						<img {...storyImg(person.avatar, { kind: 'portrait', alt: person.name, sizes: '120px' })} />
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</figure>

<style>
	.poster {
		position: relative;
		width: var(--poster, 16rem);
		flex: none;
		aspect-ratio: 3 / 4;
		margin: 0;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 22px 48px rgba(0, 0, 0, 0.38);
	}

	/* Early arcs: daylight paper, the three kingdoms as separate portraits. */
	.poster.court {
		background:
			radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent) 28%, white), transparent 58%),
			linear-gradient(180deg, #f7f1e4 0%, #efe4cf 100%);
		color: #1c1814;
	}

	/* War arcs: one ember grade, heads billed out of any battlefield. */
	.poster.war {
		background:
			radial-gradient(ellipse at 50% 18%, color-mix(in srgb, var(--accent) 55%, #3a120c), transparent 52%),
			linear-gradient(180deg, #140c0a 0%, #070605 78%);
	}

	.poster.war::before {
		content: '';
		position: absolute;
		left: 8%;
		right: 8%;
		top: 0;
		height: 46%;
		background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 35%, transparent), transparent);
		pointer-events: none;
	}

	/* Folk arcs: bare paper and one ink mass. */
	.poster.folk {
		background:
			radial-gradient(circle at 70% 22%, color-mix(in srgb, var(--accent) 40%, transparent) 0 18%, transparent 19%),
			radial-gradient(circle at 24% 70%, rgba(20, 16, 12, 0.14) 0 22%, transparent 23%),
			#f3ecdc;
	}

	.lead,
	.bill li {
		position: absolute;
		z-index: 1;
		overflow: hidden;
		background: var(--c, #1c1814);
	}

	.lead {
		left: 22%;
		top: 7%;
		width: 56%;
		height: 48%;
	}

	.lead img,
	.bill img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 12%;
	}

	.bill {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Separate plates. They share a grade, not a room. */
	.bill li:nth-child(1) { left: 4%; top: 16%; width: 24%; height: 22%; }
	.bill li:nth-child(2) { right: 4%; top: 20%; width: 24%; height: 22%; }
	.bill li:nth-child(3) { left: 6%; top: 52%; width: 28%; height: 26%; }
	.bill li:nth-child(4) { right: 6%; top: 54%; width: 26%; height: 24%; }
	.bill li:nth-child(5) { left: 28%; bottom: 5%; width: 22%; height: 18%; }
	.bill li:nth-child(6) { right: 22%; bottom: 6%; width: 20%; height: 16%; }

	.court .lead,
	.court .bill li {
		border-radius: 6px;
		box-shadow: 0 10px 22px rgba(60, 40, 20, 0.18);
		outline: 3px solid #f7f1e4;
	}

	.war .bill img {
		filter: grayscale(1) contrast(1.08);
	}

	.war .lead {
		left: 16%;
		top: 8%;
		width: 68%;
		height: 58%;
		border-radius: 2px;
		z-index: 3;
	}

	.war .bill li {
		border-radius: 50%;
		outline: 2px solid #140c0a;
		z-index: 4;
	}

	.folk .lead {
		transform: rotate(-2deg);
		border-radius: 2px 28px 4px 18px;
		outline: 4px solid #f3ecdc;
	}

	.folk .bill li {
		transform: rotate(calc((var(--i) - 2) * 3deg));
		border-radius: 46% 54% 42% 58%;
		outline: 3px solid #f3ecdc;
	}

	.poster.painted {
		aspect-ratio: 3 / 4;
		background: none;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
	}

	.poster.painted::before {
		display: none;
	}

	.poster.painted .lead,
	.poster.painted .bill {
		display: none;
	}

	.painting {
		position: absolute;
		inset: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
