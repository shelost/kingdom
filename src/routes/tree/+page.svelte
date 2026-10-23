<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import SillaRoyal from '$lib/components/diagrams/SillaRoyal.svelte';
	import WikiPeek from '$lib/components/WikiPeek.svelte';
	import { reading } from '$lib/reading.svelte';

	const ko = $derived(reading.lang === 'ko');

	let timeline = $state(false);
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
		content="Silla’s royal house from King Buphung down to King Sinmun, with the Gaya Kim line: Sacred Bone gold, True Bone blue, Gaya purple."
	/>
</svelte:head>

<main class="tree" class:dimmed={!!selectedId}>
	<SiteNavSpace />
	<header>
		<div class="title-row">
			<div>
				<p class="kicker">{ko ? '숙흘종' : 'The Sukhuljong house'}</p>
				<h1>{ko ? '신라 왕실' : 'The royal house'}</h1>
			</div>
			<div class="modes" role="group" aria-label={ko ? '보기' : 'View'}>
				<button type="button" class:active={!timeline} aria-pressed={!timeline} onclick={() => (timeline = false)}>
					{ko ? '왕실' : 'House'}
				</button>
				<button type="button" class:active={timeline} aria-pressed={timeline} onclick={() => (timeline = true)}>
					{ko ? '수명' : 'Lifespan'}
				</button>
			</div>
		</div>
		<p class="lede">
			{ko
				? '법흥왕에서 문무의 아이들까지, 금관가야 김씨가 만명·문희로 붙는다. 금빛은 성골, 푸른 테는 진골, 보랏빛은 가야. 동화된 가야는 보랏빛 안에 푸른 고리, 혼혈은 둘 다. 얼굴을 누르면 위키가 옆에서 열린다.'
				: 'From King Buphung down to Munmu’s children, with the Gaya Kim line joining at Manmyung and Munhee. Gold is Sacred Bone, blue True Bone, purple Gaya. Assimilated Gaya wears purple with a floating blue ring; mixed children wear both. Faces open the wiki peek.'}
		</p>
	</header>
	<figure class="board" class:life={timeline}>
		<SillaRoyal step="house" active {timeline} onPerson={openEntry} />
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
		max-width: 90rem;
		margin: 0 auto;
		padding: 1.5rem 1.25rem 4rem;
	}

	.tree.dimmed {
		filter: saturate(0.92);
	}

	header {
		margin: 0 0 1.4rem;
	}

	.title-row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin: 0 0 0.55rem;
	}

	.kicker {
		margin: 0 0 0.35rem;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.85rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.modes {
		display: inline-flex;
		align-items: center;
		gap: 0.05rem;
		padding: 0.18rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.modes button {
		font: inherit;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		line-height: 1;
		color: var(--fg-dim);
		padding: 0.48rem 0.72rem;
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

	.lede {
		margin: 0;
		max-width: 44rem;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--fg-dim);
	}

	.board {
		margin: 0;
		padding: 1.1rem 0.6rem 0.4rem;
		border: 1px solid color-mix(in srgb, var(--gold) 35%, var(--hairline));
		border-radius: var(--radius, 12px);
		background:
			radial-gradient(ellipse 90% 70% at 50% 0%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 65%),
			color-mix(in srgb, var(--gold) 8%, rgba(255, 255, 255, 0.02));
		overflow: visible;
	}

	.board :global(svg) {
		display: block;
		width: max(100%, 80rem);
		height: auto;
	}

	.board.life {
		overflow: visible;
	}

	@media (max-width: 720px) {
		h1 {
			font-size: 1.45rem;
		}
	}
</style>
