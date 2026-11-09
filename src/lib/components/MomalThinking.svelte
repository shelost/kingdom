<script lang="ts">
	/**
	 * What Momal looked up, as a dropdown above the answer. Open with live steps while he
	 * thinks; folds into "Thought for 2.4s · 6 sources" once the first words arrive.
	 */
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { reading } from '$lib/reading.svelte';
	import { MOMAL_STATUS } from '$lib/momal';
	import type { MomalTrace } from '$lib/momalTypes';
	import MomalMark from '$lib/components/MomalMark.svelte';

	let {
		trace,
		thinking,
		thinkMs,
		large = false
	}: { trace?: MomalTrace; thinking: boolean; thinkMs?: number; large?: boolean } = $props();

	const ko = $derived(reading.lang === 'ko');
	let manual = $state<boolean | null>(null);
	const expanded = $derived(manual ?? thinking);
	let status = $state(0);
	let elapsed = $state(0);

	const steps = $derived(trace?.steps ?? []);
	const sourceCount = $derived(
		(trace?.sources.length ?? 0) + Object.keys(trace?.episodes ?? {}).length
	);
	const seconds = $derived(((thinkMs ?? elapsed) / 1000).toFixed(1));

	$effect(() => {
		if (!thinking) return;
		const t0 = Date.now();
		const tick = setInterval(() => (elapsed = Date.now() - t0), 100);
		const rotate = setInterval(() => (status = (status + 1) % MOMAL_STATUS.length), 3200);
		return () => {
			clearInterval(tick);
			clearInterval(rotate);
		};
	});

	function busy(en: string) {
		return thinking && en.endsWith('…');
	}
</script>

{#if thinking || steps.length}
	<div class="thinking" class:large class:open={expanded}>
		<button
			type="button"
			class="head"
			aria-expanded={expanded}
			onclick={() => (manual = !expanded)}
		>
			<MomalMark size={large ? 20 : 17} spinning={thinking} />
			{#if thinking}
				<span class="shine">{ko ? '생각하는 중' : 'Thinking'}</span>
				{#if !steps.length}
					{#key status}
						<span class="sub" in:fly={{ y: 4, duration: 500, easing: cubicOut }}>
							{ko ? MOMAL_STATUS[status].ko : MOMAL_STATUS[status].en}
						</span>
					{/key}
				{/if}
				<span class="secs">{seconds}s</span>
			{:else}
				<span class="done">
					{ko ? `${seconds}초 동안 생각함` : `Thought for ${seconds}s`}
					{#if sourceCount}<span class="sub">· {ko ? `출처 ${sourceCount}` : `${sourceCount} sources`}</span>{/if}
				</span>
			{/if}
			<span class="chev material-symbols-outlined" aria-hidden="true">expand_more</span>
		</button>

		{#if expanded && steps.length}
			<ol class="steps" transition:slide={{ duration: 320, easing: cubicOut }}>
				{#each steps as step, i (step.icon)}
					<li in:fly={{ y: 6, duration: 380, delay: thinking ? i * 120 : 0, easing: cubicOut }}>
						<span class="icon" class:busy={busy(step.en)}>
							<span class="material-symbols-outlined" aria-hidden="true">{step.icon}</span>
						</span>
						<span class="body">
							<span class="what">{ko ? step.ko : step.en}</span>
							{#if step.items.length}
								<span class="items">
									{#each step.items.slice(0, 6) as item (item)}<span class="item">{item}</span>{/each}
									{#if step.items.length > 6}<span class="item more">+{step.items.length - 6}</span>{/if}
								</span>
							{/if}
						</span>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
{/if}

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;

	.thinking {
		display: flex;
		flex-direction: column;
		align-self: stretch;
		max-width: 34rem;
	}

	.head {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: 0.5rem;
		padding: 0.3rem 0.6rem 0.3rem 0.35rem;
		margin-left: -0.35rem;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: rgba(255, 255, 255, 0.55);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 550;
		cursor: pointer;
		transition: background 160ms ease;
		&:hover {
			background: rgba(255, 255, 255, 0.06);
			color: rgba(255, 255, 255, 0.85);
		}
		.large & {
			font-size: 0.9rem;
		}
	}

	.shine {
		font-weight: 650;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, #fff 40%, $gold 50%, #fff 60%, rgba(255, 255, 255, 0.4) 100%)
			0 0 / 250% 100%;
		background-clip: text;
		color: transparent;
		animation: shine 2.2s linear infinite;
	}

	@keyframes shine {
		from {
			background-position: 125% 0;
		}
		to {
			background-position: -125% 0;
		}
	}

	.sub {
		color: rgba(255, 255, 255, 0.45);
		font-weight: 500;
	}

	.secs {
		font-variant-numeric: tabular-nums;
		font-size: 0.74em;
		color: rgba(255, 255, 255, 0.35);
	}

	.chev {
		font-size: 1.05rem;
		transition: transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
		.open & {
			transform: rotate(180deg);
		}
	}

	.steps {
		position: relative;
		margin: 0.25rem 0 0.35rem;
		padding: 0 0 0 0.05rem;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		&::before {
			content: '';
			position: absolute;
			top: 0.7rem;
			bottom: 0.7rem;
			left: 0.68rem;
			width: 1px;
			background: linear-gradient($red, $gold, $blue);
			opacity: 0.35;
		}
	}

	li {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
	}

	.icon {
		position: relative;
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		background: #101016;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
		color: rgba(255, 255, 255, 0.7);
		& .material-symbols-outlined {
			font-size: 0.85rem;
		}
		&.busy::after {
			content: '';
			position: absolute;
			inset: -2px;
			border-radius: 50%;
			border: 1.5px solid transparent;
			border-top-color: $gold;
			animation: spin 0.9s linear infinite;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
		padding-top: 0.12rem;
	}

	.what {
		font-size: 0.8rem;
		font-weight: 550;
		color: rgba(255, 255, 255, 0.78);
	}

	.items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
	}

	.item {
		max-width: 16rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0.08rem 0.45rem;
		border-radius: 6px;
		font-size: 0.66rem;
		color: rgba(255, 255, 255, 0.6);
		background: rgba(255, 255, 255, 0.06);
		&.more {
			color: rgba(255, 255, 255, 0.4);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.shine,
		.icon.busy::after {
			animation: none;
		}
	}
</style>
