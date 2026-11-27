<script lang="ts">
	import { resolve } from '$app/paths';
	import { byId, nameOf, koreanOf } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { WIVES } from '$lib/wives';

	let ko = $derived(reading.lang === 'ko');

	function leaderName(id: string): string {
		const p = byId.get(id);
		if (!p) return id;
		return ko ? (koreanOf(p) ?? nameOf(p)) : nameOf(p);
	}
</script>

<ol class="wives">
	{#each WIVES as wife (wife.n + wife.ko)}
		<li>
			<span class={['n', { wide: wife.n >= 10 }]}>{wife.n}</span>
			<div class="who">
				<p class="queen">
					{ko ? wife.ko : wife.en}
					{#if reading.lang === 'both'}<span class="alt">{ko ? wife.en : wife.ko}</span>{/if}
				</p>
				<p class="clan">
					{#if wife.seal}<span class={['seal', { long: wife.seal.length > 1 }]}>{wife.seal}</span>{/if}
					<span>{ko ? wife.clanKo : wife.clanEn}</span>
				</p>
			</div>
			{#if wife.leader}
				{@const id = wife.leader}
				<a
					class="person leader"
					data-person={id}
					href={resolve(`/wiki?id=${encodeURIComponent(id)}`)}
				>
					{leaderName(id)}
				</a>
			{:else}
				<span class="missing">{ko ? '아비 미상' : 'Father unrecorded'}</span>
			{/if}
		</li>
	{/each}
</ol>

<style lang="scss">
	.wives {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	li {
		display: grid;
		grid-template-columns: 2.1rem 1fr auto;
		gap: 0.75rem;
		align-items: center;
		padding: 0.7rem 0;
		border-top: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
		&:last-child {
			border-bottom: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
		}
	}

	.n {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 78%, #1a1208);
		color: #1a1208;
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		&.wide {
			font-size: 0.68rem;
		}
	}

	.queen {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.02rem;
		font-weight: 650;
		line-height: 1.25;
	}

	.alt {
		display: block;
		margin-top: 0.12rem;
		font-weight: 450;
		font-size: 0.78rem;
		color: var(--fg-dim);
	}

	.clan {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0.22rem 0 0;
		color: var(--fg-dim);
		font-size: 0.82rem;
	}

	.seal {
		display: inline-grid;
		place-items: center;
		min-width: 1.35rem;
		height: 1.35rem;
		padding: 0 0.2rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		font-family: 'LXGW WenKai TC', 'Nanum Brush Script', serif;
		font-weight: 700;
		font-size: 0.85rem;
		line-height: 1;
		color: var(--fg);
		&.long {
			border-radius: 999px;
			font-size: 0.72rem;
		}
	}

	.leader {
		color: var(--wiki-link);
		font-family: var(--serif);
		font-weight: 650;
		text-decoration: none;
		text-align: right;
		&:hover {
			text-decoration: underline;
			text-underline-offset: 0.16em;
		}
	}

	.missing {
		color: var(--fg-dim);
		font-size: 0.82rem;
		text-align: right;
	}
</style>
