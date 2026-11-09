<script lang="ts">
	/** A person from Momal's briefing: portrait card, or a compact face + name for relations. */
	import { reading } from '$lib/reading.svelte';
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { momalRefs } from '$lib/momalRefs.svelte';
	import { momalWikiHref } from '$lib/momal';

	let { id, compact = false }: { id: string; compact?: boolean } = $props();

	const ko = $derived(reading.lang === 'ko');
	const p = $derived(momalRefs.person(id));

	$effect(() => momalRefs.want([id]));
</script>

{#if p}
	<a
		class="person"
		class:compact
		href={momalWikiHref(p.id)}
		style:--tone={p.color}
		onclick={() => storyAsk.show()}
	>
		<span class="face">
			{#if p.avatar}
				<img src={p.avatar} alt="" loading="lazy" decoding="async" />
			{:else}
				<span class="initial">{p.name.slice(0, 1)}</span>
			{/if}
		</span>
		<span class="text">
			<span class="name">{ko && p.korean ? p.korean : p.name}</span>
			{#if !compact}
				<span class="alt">
					{#if ko}{p.name}{:else if p.korean}{p.korean}{/if}{#if p.hanja}<span class="hanja">{p.hanja}</span>{/if}
				</span>
				<span class="meta">
					<span class="kingdom">{ko && p.kingdomKo ? p.kingdomKo : p.kingdom}</span>
					{#if p.life}<span class="life">{p.life}</span>{/if}
				</span>
				{#if p.tagline}<span class="tag">{p.tagline}</span>{/if}
				{#if p.invented}
					<span class="invented" title={ko ? '생몰년은 이 이야기가 정했다' : 'Birth or death year set by this chronicle'}>
						<span class="material-symbols-outlined" aria-hidden="true">auto_stories</span>
						{ko ? '이야기 연도' : 'Chronicle dates'}
					</span>
				{/if}
			{/if}
		</span>
	</a>
{:else}
	<span class="person ghost" class:compact aria-hidden="true">
		<span class="face"></span>
		<span class="text"><span class="bar"></span>{#if !compact}<span class="bar short"></span>{/if}</span>
	</span>
{/if}

<style lang="scss">
	.person {
		--tone: #888;
		display: flex;
		gap: 0.7rem;
		align-items: flex-start;
		min-width: 0;
		padding: 0.65rem 0.75rem 0.7rem 0.65rem;
		border-radius: 16px;
		background: linear-gradient(
			150deg,
			color-mix(in srgb, var(--tone) 22%, transparent),
			rgba(255, 255, 255, 0.035) 60%
		);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
		color: inherit;
		text-decoration: none;
		transition:
			transform 220ms cubic-bezier(0.32, 0.72, 0, 1),
			box-shadow 220ms ease;
		&:hover {
			transform: translateY(-2px);
			box-shadow:
				inset 0 0 0 1px color-mix(in srgb, var(--tone) 60%, transparent),
				0 10px 24px -14px var(--tone);
		}
		&.compact {
			flex-direction: column;
			align-items: center;
			gap: 0.4rem;
			padding: 0;
			background: none;
			box-shadow: none;
			text-align: center;
			&:hover {
				transform: translateY(-2px);
				box-shadow: none;
			}
		}
	}

	.face {
		flex: 0 0 auto;
		width: 3.1rem;
		height: 3.1rem;
		border-radius: 50%;
		overflow: hidden;
		display: grid;
		place-items: center;
		background: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 0 0 2px var(--tone),
			0 0 0 4px rgba(10, 10, 15, 0.9);
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: 50% 18%;
		}
		.compact & {
			width: 3.6rem;
			height: 3.6rem;
		}
	}

	.initial {
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 1.3rem;
		color: #fff;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 0;
	}

	.name {
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 1.02rem;
		font-weight: 600;
		line-height: 1.2;
		color: #fff;
		.compact & {
			font-size: 0.82rem;
		}
	}

	.alt {
		font-size: 0.74rem;
		color: rgba(255, 255, 255, 0.55);
	}

	.hanja {
		margin-left: 0.35em;
		font-family: 'Noto Serif KR', serif;
		color: rgba(255, 255, 255, 0.4);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.2rem;
		font-size: 0.66rem;
		font-weight: 600;
	}

	.kingdom {
		padding: 0.05rem 0.45rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--tone) 32%, transparent);
		color: #fff;
	}

	.life {
		padding: 0.05rem 0.1rem;
		color: rgba(255, 255, 255, 0.55);
		font-variant-numeric: tabular-nums;
	}

	.tag {
		margin-top: 0.25rem;
		font-size: 0.74rem;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.68);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.invented {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		align-self: flex-start;
		margin-top: 0.3rem;
		padding: 0.08rem 0.45rem 0.08rem 0.3rem;
		border-radius: 999px;
		font-size: 0.62rem;
		font-weight: 650;
		color: #fff;
		background: linear-gradient(90deg, rgba(#e94949, 0.4), rgba(#ffb900, 0.28), rgba(#3e79e4, 0.4));
		& .material-symbols-outlined {
			font-size: 0.8rem;
		}
	}

	.ghost {
		pointer-events: none;
		& .face {
			box-shadow: none;
		}
	}

	.bar {
		display: block;
		width: 7rem;
		height: 0.6rem;
		margin-top: 0.35rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.08);
		&.short {
			width: 4.5rem;
		}
		.compact & {
			width: 3.5rem;
		}
	}
</style>
