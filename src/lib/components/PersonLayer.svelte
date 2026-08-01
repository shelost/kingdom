<script lang="ts">
	import { onMount } from 'svelte';
	import { byId, ageAt, KINGDOMS, colorOf, type Person } from '$lib/people';

	// hover card
	let hovered = $state<Person | null>(null);
	let hoverYear = $state<number | null>(null);
	let x = $state(0);
	let y = $state(0);
	let below = $state(false);

	// side peek
	let peeked = $state<Person | null>(null);

	let hoverTimer: ReturnType<typeof setTimeout> | undefined;
	let card: HTMLElement | undefined = $state();

	function yearOf(el: HTMLElement): number | null {
		const art = el.closest<HTMLElement>('[data-year]');
		const v = art?.dataset.year;
		return v ? Number(v) : null;
	}

	function place(el: HTMLElement) {
		const r = el.getBoundingClientRect();
		const w = card?.offsetWidth ?? 300;
		const h = card?.offsetHeight ?? 150;
		below = r.top < h + 24; // not enough room above → flip under
		x = Math.min(Math.max(r.left + r.width / 2, w / 2 + 12), window.innerWidth - w / 2 - 12);
		y = below ? r.bottom + 10 : r.top - 10;
	}

	onMount(() => {
		const over = (e: Event) => {
			const el = (e.target as HTMLElement)?.closest?.('.person') as HTMLElement | null;
			if (!el) return;
			const p = byId.get(el.dataset.person ?? '');
			if (!p) return;
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => {
				hovered = p;
				hoverYear = yearOf(el);
				// place after the card has a size
				requestAnimationFrame(() => place(el));
			}, 90);
		};

		const out = (e: Event) => {
			const el = (e.target as HTMLElement)?.closest?.('.person');
			if (!el) return;
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => (hovered = null), 120);
		};

		const click = (e: Event) => {
			const el = (e.target as HTMLElement)?.closest?.('.person') as HTMLElement | null;
			if (!el) return;
			e.preventDefault();
			const p = byId.get(el.dataset.person ?? '');
			if (!p) return;
			hovered = null;
			peeked = p;
		};

		const key = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				peeked = null;
				hovered = null;
			}
		};

		document.addEventListener('mouseover', over);
		document.addEventListener('mouseout', out);
		document.addEventListener('click', click);
		document.addEventListener('keydown', key);
		window.addEventListener('scroll', () => (hovered = null), { passive: true });

		return () => {
			document.removeEventListener('mouseover', over);
			document.removeEventListener('mouseout', out);
			document.removeEventListener('click', click);
			document.removeEventListener('keydown', key);
		};
	});

	function lifespan(p: Person) {
		const f = (n?: number) => (n == null ? '?' : n < 0 ? `${-n} BCE` : `${n}`);
		if (p.born == null && p.died == null) return '';
		return `${p.bornApprox ? 'c. ' : ''}${f(p.born)} – ${f(p.died)}`;
	}
</script>

<!-- ————— floating preview ————— -->
{#if hovered}
	{@const k = { ...KINGDOMS[hovered.kingdom], color: colorOf(hovered) }}
	<div
		class="card"
		class:below
		bind:this={card}
		style:left="{x}px"
		style:top="{y}px"
		style:--k={k.color}
		role="tooltip"
	>
		<div class="card-top">
			<span class="avatar" aria-hidden="true">{hovered.name.slice(0, 1)}</span>
			<div class="card-id">
				<span class="card-name">{hovered.name}</span>
				<span class="card-sub">
					{#if hovered.korean}<span class="ko">{hovered.korean}</span>{/if}
					<span class="k-dot"></span>{k.label}
				</span>
			</div>
			{#if hovered.entity !== 'concept' && ageAt(hovered, hoverYear) != null}
				<span class="card-age">{ageAt(hovered, hoverYear)}</span>
			{/if}
		</div>
		{#if hovered.title}<p class="card-title">{hovered.title}</p>{/if}
		<p class="card-line">{hovered.tagline}</p>
		<p class="card-hint">{lifespan(hovered)} · click to open</p>
	</div>
{/if}

<!-- ————— notion-style side peek ————— -->
{#if peeked}
	{@const k = { ...KINGDOMS[peeked.kingdom], color: colorOf(peeked) }}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={() => (peeked = null)}></div>
	<aside class="peek" style:--k={k.color} aria-label="{peeked.name} profile">
		<header class="peek-head">
			<button class="close" onclick={() => (peeked = null)} aria-label="Close">✕</button>
			{#if peeked.main}<span class="lead">Lead</span>{/if}
			{#if peeked.entity === 'concept'}<span class="lead concept">Institution</span>{/if}
		</header>

		<div class="peek-body">
			<span class="peek-avatar" aria-hidden="true">{peeked.name.slice(0, 1)}</span>

			<h2 class="peek-name">{peeked.name}</h2>
			<p class="peek-native">
				{#if peeked.hanja}<span class="hanja">{peeked.hanja}</span>{/if}
				{#if peeked.korean}<span class="ko">{peeked.korean}</span>{/if}
			</p>

			<dl class="props">
				{#if peeked.title}
					<div><dt>Role</dt><dd>{peeked.title}</dd></div>
				{/if}
				<div><dt>Kingdom</dt><dd><span class="pill">{k.label}</span></dd></div>
				{#if lifespan(peeked)}
					<div>
						<dt>{peeked.entity === 'concept' ? 'Active' : 'Lived'}</dt>
						<dd>{lifespan(peeked)}</dd>
					</div>
				{/if}
				{#if peeked.entity !== 'concept' && peeked.born != null && peeked.died != null}
					<div><dt>Age at death</dt><dd>{peeked.died - peeked.born}</dd></div>
				{/if}
				<div><dt>Identifier</dt><dd><code class="hex">{colorOf(peeked)}</code></dd></div>
			</dl>

			<p class="tagline">{peeked.tagline}</p>

			{#if peeked.arc}
				<h3>Character arc</h3>
				<p class="arc">{peeked.arc}</p>
			{/if}

			{#if peeked.events?.length}
				<h3>Key events</h3>
				<ol class="timeline">
					{#each peeked.events as ev, i (i)}
						<li>
							<span class="tl-year">{ev.year < 0 ? `${-ev.year} BCE` : ev.year}</span>
							<span class="tl-dot" aria-hidden="true"></span>
							<span class="tl-text">
								{ev.label}
								{#if peeked.born != null && ev.year >= peeked.born}
									<span class="tl-age">age {ev.year - peeked.born}</span>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</aside>
{/if}

<style>
	/* ————— hover preview ————— */
	.card {
		position: fixed;
		z-index: 120;
		width: 19rem;
		transform: translate(-50%, -100%);
		background: rgba(22, 22, 25, 0.96);
		backdrop-filter: blur(18px) saturate(150%);
		border: 1px solid rgba(255, 255, 255, 0.11);
		border-top: 2px solid var(--k);
		border-radius: 12px;
		box-shadow: 0 20px 55px rgba(0, 0, 0, 0.6);
		padding: 0.8rem 0.9rem;
		pointer-events: none;
		animation: pop 0.24s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.card.below {
		transform: translate(-50%, 0);
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-100% + 6px)) scale(0.97);
		}
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.avatar,
	.peek-avatar {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 8px;
		font-family: var(--serif);
		font-weight: 700;
		color: #fff;
		background: linear-gradient(150deg, var(--k), color-mix(in srgb, var(--k) 45%, #000));
	}

	.card-id {
		min-width: 0;
		flex: 1;
	}

	.card-name {
		display: block;
		font-weight: 600;
		font-size: 0.92rem;
		color: #fffdf8;
		letter-spacing: var(--tracking-display);
	}

	.card-sub {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.k-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--k);
	}

	.card-age {
		font-family: var(--serif);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--k);
		line-height: 1;
	}

	.card-title {
		margin: 0.55rem 0 0;
		font-size: 0.75rem;
		color: var(--fg-dim);
	}

	.card-line {
		margin: 0.35rem 0 0;
		font-size: 0.8rem;
		line-height: 1.45;
		color: var(--fg);
	}

	.card-hint {
		margin: 0.55rem 0 0;
		font-size: 0.66rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	/* ————— side peek ————— */
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 110;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(2px);
		animation: fade 0.3s ease;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.peek {
		position: fixed;
		inset: 0 0 0 auto;
		z-index: 115;
		width: min(30rem, 92vw);
		display: flex;
		flex-direction: column;
		background: #121215;
		border-left: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: -30px 0 80px rgba(0, 0, 0, 0.6);
		animation: slide 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	@keyframes slide {
		from {
			transform: translateX(100%);
		}
	}

	.peek-head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.8rem 1rem;
		border-bottom: 1px solid var(--hairline);
	}

	.close {
		width: 1.8rem;
		height: 1.8rem;
		display: grid;
		place-items: center;
		font-size: 0.8rem;
		color: var(--fg-dim);
		background: transparent;
		border: 1px solid var(--hairline);
		border-radius: 7px;
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.close:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}

	.hex {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.72rem;
		color: var(--k);
		border: 1px solid color-mix(in srgb, var(--k) 35%, transparent);
		background: color-mix(in srgb, var(--k) 14%, transparent);
		border-radius: 4px;
		padding: 0.05rem 0.4rem;
	}

	.lead.concept {
		color: var(--fg-dim);
		border-color: var(--hairline);
	}

	.lead {
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
		border: 1px solid rgba(216, 178, 106, 0.4);
		border-radius: 999px;
		padding: 0.15rem 0.55rem;
	}

	.peek-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.6rem 1.8rem 4rem;
	}

	.peek-avatar {
		width: 3.4rem;
		height: 3.4rem;
		border-radius: 12px;
		font-size: 1.5rem;
		margin-bottom: 0.9rem;
	}

	.peek-name {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.9rem;
		font-weight: 700;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: #fffdf8;
	}

	.peek-native {
		margin: 0.3rem 0 1.3rem;
		display: flex;
		gap: 0.7rem;
		font-family: 'Noto Serif KR', serif;
	}

	.peek-native .hanja {
		color: var(--k);
		font-weight: 900;
	}

	.peek-native .ko {
		color: var(--fg-dim);
	}

	.props {
		margin: 0 0 1.4rem;
		display: grid;
		gap: 0.05rem;
	}

	.props > div {
		display: grid;
		grid-template-columns: 7.5rem 1fr;
		align-items: baseline;
		padding: 0.32rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.045);
	}

	dt {
		font-size: 0.74rem;
		color: var(--fg-faint);
	}

	dd {
		margin: 0;
		font-size: 0.85rem;
		color: var(--fg);
	}

	.pill {
		display: inline-block;
		font-size: 0.72rem;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		color: color-mix(in srgb, var(--k) 70%, #fff);
		background: color-mix(in srgb, var(--k) 22%, transparent);
		border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
	}

	.tagline {
		margin: 0 0 1.6rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.02rem;
		line-height: 1.5;
		color: color-mix(in srgb, var(--k) 45%, #fff);
	}

	h3 {
		margin: 1.5rem 0 0.6rem;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.arc {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.68;
		color: var(--fg-dim);
	}

	/* ————— timeline ————— */
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.timeline li {
		position: relative;
		display: grid;
		grid-template-columns: 3.6rem 1rem 1fr;
		align-items: start;
		padding-bottom: 0.85rem;
	}

	.tl-year {
		font-family: var(--serif);
		font-size: 0.88rem;
		font-weight: 700;
		color: #fffdf8;
		letter-spacing: 0;
	}

	.tl-dot {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.tl-dot::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0.42em;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--k);
		transform: translateX(-50%);
		box-shadow: 0 0 12px -1px var(--k);
	}

	/* connector line, hidden on the last item */
	.timeline li:not(:last-child) .tl-dot::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 1.1em;
		bottom: -0.85rem;
		width: 1px;
		background: rgba(255, 255, 255, 0.12);
		transform: translateX(-50%);
	}

	.tl-text {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.tl-age {
		display: inline-block;
		margin-left: 0.4rem;
		font-size: 0.68rem;
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0 0.4rem;
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.peek,
		.scrim {
			animation: none;
		}
	}
</style>
