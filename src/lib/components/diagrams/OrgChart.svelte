<script lang="ts">
	/**
	 * Hierarchy chart for organization profiles — driven by `Person.orgChart`.
	 * Click a person node to open their wiki entry; synthetic seats stay inert.
	 */
	import {
		byId,
		avatarOf,
		nameOf,
		isPlaceholderArt,
		hangulInitial,
		colorOf,
		type OrgChartNode,
		type Person
	} from '$lib/people';
	import { storyImg } from '$lib/img';

	let {
		nodes = [],
		onOpen
	}: {
		nodes?: OrgChartNode[];
		onOpen?: (id: string) => void;
	} = $props();

	type TreeNode = {
		node: OrgChartNode;
		person: Person | undefined;
		children: TreeNode[];
	};

	let active = $state(false);

	let roots = $derived.by((): TreeNode[] => {
		if (!nodes.length) return [];
		const byParent = new Map<string | null, OrgChartNode[]>();
		const ids = new Set(nodes.map((n) => n.id));
		for (const n of nodes) {
			let parent = n.reportsTo ?? null;
			if (parent && !ids.has(parent)) parent = null;
			const list = byParent.get(parent);
			if (list) list.push(n);
			else byParent.set(parent, [n]);
		}
		function build(n: OrgChartNode): TreeNode {
			const kids = byParent.get(n.id) ?? [];
			return {
				node: n,
				person: byId.get(n.id),
				children: kids.map(build)
			};
		}
		return (byParent.get(null) ?? []).map(build);
	});

	function labelOf(t: TreeNode): string {
		if (t.person) return nameOf(t.person);
		return t.node.role?.split('·')[0]?.trim() || t.node.id.replace(/^_/, '');
	}

	function openable(t: TreeNode): boolean {
		return !!t.person && !!onOpen;
	}

	function play(node: HTMLElement) {
		const reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced || typeof IntersectionObserver === 'undefined') {
			active = true;
			return;
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					active = true;
					io.disconnect();
				}
			},
			{ rootMargin: '0px 0px -12% 0px', threshold: 0.2 }
		);
		io.observe(node);
		return () => io.disconnect();
	}
</script>

{#snippet branch(list: TreeNode[], depth: number)}
	<ul class="tier" style:--depth={depth}>
		{#each list as t, i (t.node.id)}
			<li class="seat" style:--i={i} style:--nk={t.person ? colorOf(t.person) : '#e8c36a'}>
				{#if openable(t)}
					<button
						type="button"
						class="node person"
						onclick={() => onOpen?.(t.node.id)}
					>
						{@render face(t)}
					</button>
				{:else}
					<div class="node synthetic">
						{@render face(t)}
					</div>
				{/if}
				{#if t.children.length}
					{@render branch(t.children, depth + 1)}
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet face(t: TreeNode)}
	{@const art = t.person ? avatarOf(t.person) : null}
	<span class="avatar" class:silhouette={!!art && isPlaceholderArt(art)} aria-hidden="true">
		{#if art}
			<img {...storyImg(art, { kind: 'thumb', alt: '', sizes: '48px' })} />
		{:else if t.person}
			{hangulInitial(t.person)}
		{:else}
			·
		{/if}
	</span>
	<span class="meta">
		<span class="name">{labelOf(t)}</span>
		{#if t.node.role}
			<span class="role">{t.node.role}</span>
		{/if}
	</span>
{/snippet}

{#if roots.length}
	<div class="org-chart" class:play={active} {@attach play} role="img" aria-label="Organization chart">
		{@render branch(roots, 0)}
	</div>
{/if}

<style>
	.org-chart {
		overflow-x: auto;
		padding: 0.35rem 0.15rem 0.6rem;
		-webkit-overflow-scrolling: touch;
	}

	.tier {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.65rem 0.85rem;
	}

	.seat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.55rem;
		position: relative;
		min-width: min(9.5rem, 42vw);
		opacity: 0;
		transform: translateY(0.55rem);
		transition:
			opacity 520ms var(--ease, ease),
			transform 560ms var(--ease, ease);
		transition-delay: calc(var(--i, 0) * 55ms + var(--depth, 0) * 90ms);
	}

	.org-chart.play .seat {
		opacity: 1;
		transform: none;
	}

	.seat > .tier {
		padding-top: 0.55rem;
		width: 100%;
		border-top: 2px solid color-mix(in oklab, var(--nk, #111) 85%, #000);
		position: relative;
	}

	.seat > .tier::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 2px;
		height: 0.55rem;
		background: color-mix(in oklab, var(--nk, #111) 85%, #000);
		transform: translateX(-50%);
	}

	.node {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		width: 100%;
		max-width: 11.5rem;
		padding: 0.4rem 0.45rem;
		border: 2.5px solid color-mix(in oklab, var(--nk, #e8c36a) 28%, #0c0a08);
		border-radius: 8px;
		background: var(--nk, #e8c36a);
		text-align: left;
		font: inherit;
		color: inherit;
	}

	button.node {
		cursor: pointer;
		transition:
			border-color 220ms var(--ease, ease),
			background 220ms var(--ease, ease);
	}

	button.node:hover {
		border-color: color-mix(in oklab, var(--nk, #e8c36a) 18%, #0c0a08);
		background: color-mix(in oklab, var(--nk, #e8c36a) 88%, #fff);
	}

	.synthetic {
		opacity: 0.85;
	}

	.avatar {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		overflow: hidden;
		display: grid;
		place-items: center;
		font-size: 0.78rem;
		background: color-mix(in oklab, var(--nk, #e8c36a) 90%, #fff);
		border: 2px solid color-mix(in oklab, var(--nk, #e8c36a) 28%, #0c0a08);
		color: #0c0c10;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar.silhouette img {
		object-fit: contain;
		padding: 0.15rem;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
		flex: 1;
		background: #0c0c10;
		border-radius: 5px;
		padding: 0.22rem 0.4rem;
	}

	.name {
		font-size: 0.78rem;
		font-weight: 600;
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #ffffff;
	}

	.role {
		font-size: 0.62rem;
		letter-spacing: 0.02em;
		color: #f4efe6;
		line-height: 1.25;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@media (max-width: 640px) {
		.tier {
			gap: 0.5rem 0.45rem;
		}

		.seat {
			min-width: min(8.2rem, 46vw);
		}

		.node {
			max-width: 9.8rem;
			padding: 0.35rem 0.45rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.seat {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
