<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SillaRoyal from '$lib/components/diagrams/SillaRoyal.svelte';
	import WikiPeek from '$lib/components/WikiPeek.svelte';
	import { reading } from '$lib/reading.svelte';
	import { SPINES, type Arrange } from '$lib/treeLayout';

	const ko = $derived(reading.lang === 'ko');

	let timeline = $state(false);
	let arrange = $state<Arrange>('packed');

	const PLACE_MODES: { id: Arrange; en: string; ko: string }[] = [
		{ id: 'hand', en: 'Place', ko: '자리' },
		{ id: 'packed', en: 'Packed', ko: '밀집' },
		{ id: 'blood', en: 'Columns', ko: '열' }
	];
	const SPINE_MODES = (Object.keys(SPINES) as (keyof typeof SPINES)[]).map((id) => ({
		id,
		en: SPINES[id].en,
		ko: SPINES[id].ko
	}));
	let selectedId = $state<string | null>(page.url.searchParams.get('id'));
	let expanded = $state(page.url.searchParams.get('full') === '1' && !!page.url.searchParams.get('id'));

	function syncUrl(id: string | null, full: boolean) {
		if (!browser) return;
		try {
			const params = new URLSearchParams();
			if (id) params.set('id', id);
			if (id && full) params.set('full', '1');
			const q = params.toString();
			if (q) pushState(resolve(`/tree?${q}`), {});
			else pushState(resolve('/tree'), {});
		} catch {
			/* overlay still works from local state */
		}
	}

	function openEntry(id: string) {
		if (!id) return;
		if (!selectedId) expanded = false;
		selectedId = id;
		syncUrl(id, expanded);
	}

	function clearEntry() {
		expanded = false;
		selectedId = null;
		syncUrl(null, false);
	}

	function expandEntry() {
		expanded = true;
		syncUrl(selectedId, true);
	}

	function collapseEntry() {
		expanded = false;
		syncUrl(selectedId, false);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key !== 'Escape' || !selectedId) return;
		if (expanded) collapseEntry();
		else clearEntry();
	}

	function onPopState() {
		if (!browser) return;
		const path = location.pathname;
		if (path !== '/tree' && path !== resolve('/tree')) return;
		const next = new URL(location.href).searchParams;
		selectedId = next.get('id');
		expanded = next.get('full') === '1' && !!selectedId;
	}
</script>

<svelte:window onkeydown={onKey} onpopstate={onPopState} />

<svelte:head>
	<title>The royal house · King for All</title>
	<meta
		name="description"
		content="Silla’s royal house from King Jijeung down to King Sinmun, with the Gaya Kim line: Sacred Bone gold, True Bone blue, Gaya purple."
	/>
</svelte:head>

<main class="tree" class:dimmed={!!selectedId}>
	<div class="toolbar">
		<div class="toggles">
			<div class="modes" role="group" aria-label={ko ? '보기' : 'View'}>
				<button type="button" class:active={!timeline} aria-pressed={!timeline} onclick={() => (timeline = false)}>
					{ko ? '왕실' : 'House'}
				</button>
				<button type="button" class:active={timeline} aria-pressed={timeline} onclick={() => (timeline = true)}>
					{ko ? '수명' : 'Lifespan'}
				</button>
			</div>
			<div class="modes" role="group" aria-label={ko ? '배치' : 'Layout'}>
				{#each PLACE_MODES as m (m.id)}
					<button type="button" class:active={arrange === m.id} aria-pressed={arrange === m.id} onclick={() => (arrange = m.id)}>
						{ko ? m.ko : m.en}
					</button>
				{/each}
			</div>
			<div class="modes" role="group" aria-label={ko ? '중심 혈통' : 'Spine'}>
				{#each SPINE_MODES as m (m.id)}
					<button type="button" class:active={arrange === m.id} aria-pressed={arrange === m.id} onclick={() => (arrange = m.id)}>
						{ko ? m.ko : m.en}
					</button>
				{/each}
			</div>
		</div>
	</div>
	<figure class="board" class:life={timeline}>
		<SillaRoyal step="house" active {timeline} {arrange} onPerson={openEntry} />
	</figure>
</main>

<WikiPeek
	{selectedId}
	{expanded}
	onBack={clearEntry}
	onOpen={openEntry}
	onExpand={expandEntry}
	onCollapse={collapseEntry}
/>

<style>
	.tree {
		position: fixed;
		inset: 0;
		z-index: 1;
		max-width: none;
		margin: 0;
		padding: 0;
	}

	.tree.dimmed {
		filter: saturate(0.92);
	}

	.toolbar {
		position: absolute;
		top: 3.55rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 4;
		pointer-events: none;
		padding: 0.35rem 0.5rem;
	}

	.toggles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.35rem;
		pointer-events: auto;
	}

	.modes {
		display: inline-flex;
		align-items: center;
		gap: 0.05rem;
		padding: 0.14rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--bg) 82%, transparent);
		backdrop-filter: blur(10px);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 10%, transparent);
	}

	.modes button {
		font: inherit;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1;
		color: var(--fg-dim);
		padding: 0.42rem 0.64rem;
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.modes button.active {
		color: var(--fg-strong);
		background: var(--bg);
	}

	.modes button:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	.board {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 0;
		border: none;
		border-radius: 0;
		overflow: hidden;
		background:
			radial-gradient(ellipse 90% 70% at 50% 0%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 65%),
			color-mix(in srgb, var(--gold) 5%, rgba(255, 255, 255, 0.015));
	}

	.board :global(svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	@media (max-width: 720px) {
		.toolbar {
			top: 0.4rem;
			left: 0.4rem;
			right: 0.4rem;
			transform: none;
		}

		.board {
			padding-bottom: 4.6rem;
		}
	}
</style>
