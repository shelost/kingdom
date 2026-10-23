<script lang="ts">
	import gsap from 'gsap';
	import { onDestroy, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Attachment } from 'svelte/attachments';
	import { arcNumber, chapters, entryId, partId } from '$lib/story';
	import {
		chapterEpisodes,
		chapterHeadedBy,
		partLabel,
		spineEntries,
		spineLabel,
		tocAnchor,
		tocEpisode,
		type TocEpisode
	} from '$lib/tocTree';
	import { EPISODE_KIND_META } from '$lib/episodeKinds';
	import { posterSrc } from '$lib/posters.svelte';
	import { reading, episodes, episodeNavLabel, goToEpisodeById, pageTurn, stepEpisode } from '$lib/reading.svelte';

	/** A soft arrival, close to a power3 ease-out. */
	const arrive = (t: number) => 1 - Math.pow(1 - t, 3);

	/** The chronicle's episode pill. Open, and the pill itself grows into the list. */
	let { live = true }: { live?: boolean } = $props();

	const HEART = /^[♡♥❤]\uFE0F?\s*/u;
	const OPEN_EASE = 'power4.out';
	const CLOSE_EASE = 'power3.inOut';

	type Opt = { id: string; label: string };

	let ko = $derived(reading.lang === 'ko');
	let index = $derived(reading.episodeIndex);
	let atFirst = $derived(index <= 0);
	let atLast = $derived(index >= episodes.length - 1);
	let label = $derived(episodeNavLabel(episodes[index] ?? episodes[0]).replace(HEART, ''));
	let liveEp = $derived(episodes[index]);
	let activeArc = $derived(liveEp?.chapterId ?? '');
	let activeEntry = $derived(liveEp?.id ?? '');
	let pillId = $derived(activeEntry || activeArc || '');

	/** Labels in sheet order, for type-ahead. */
	let options = $derived.by(() => {
		const out: Opt[] = [];
		for (const ch of chapters) {
			if (ch.part) out.push({ id: partId(ch.id), label: partLabel(ch.part, ko) });
			out.push({ id: ch.id, label: (ko && ch.korean) || ch.title });
			for (const en of spineEntries(ch)) {
				const group = chapterEpisodes(ch, en);
				if (group.length) {
					const head = chapterHeadedBy(ch.id, en.title);
					out.push({
						id: head ? tocAnchor(ch.id, head) : entryId(ch.id, en.title),
						label: spineLabel(ch, en, ko)
					});
					for (const ep of group) out.push({ id: ep.id, label: (ko && ep.ko) || ep.title });
				} else {
					const ep = tocEpisode(ch, en);
					out.push({ id: ep.id, label: (ko && ep.ko) || ep.title });
				}
			}
		}
		return out;
	});

	let root = $state<HTMLElement>();
	let sheet = $state<HTMLElement>();
	let scrim = $state<HTMLButtonElement>();
	let titleBtn = $state<HTMLButtonElement>();
	let open = $state(false);

	let ctx: gsap.Context | undefined;
	let tween: gsap.core.Timeline | undefined;
	let widthTween: gsap.core.Tween | undefined;
	let generation = 0;
	let closedW = 0;
	let closedH = 0;

	function reduced() {
		return matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function kill() {
		tween?.kill();
		tween = undefined;
	}

	function killWidth() {
		widthTween?.kill();
		widthTween = undefined;
	}

	/** The closed pill eases to the new title's width instead of snapping. */
	function fitWidth(from: number) {
		if (!root || open) return;
		killWidth();
		const incoming = root.querySelector('.title-slot .title-text:last-of-type');
		const slot = root.querySelector('.title-slot');
		if (slot instanceof HTMLElement && incoming instanceof HTMLElement) {
			slot.style.width = `${incoming.offsetWidth}px`;
		}
		gsap.set(root, { width: 'auto' });
		const to = root.offsetWidth;
		if (slot instanceof HTMLElement) slot.style.width = '';
		if (!from || Math.abs(to - from) < 1) {
			gsap.set(root, { clearProps: 'width' });
			return;
		}
		gsap.set(root, { width: from });
		widthTween = gsap.to(root, {
			width: to,
			duration: 0.62,
			ease: 'power3.inOut',
			overwrite: 'auto',
			onComplete: () => gsap.set(root!, { clearProps: 'width' })
		});
	}

	async function expand() {
		if (!root || open) return;
		const id = ++generation;
		kill();
		killWidth();
		gsap.set(root, { clearProps: 'width' });
		closedW = root.offsetWidth;
		closedH = root.offsetHeight;
		gsap.set(root, { width: closedW, height: closedH, overflow: 'hidden' });
		open = true;
		await tick();
		if (id !== generation || !root || !sheet) return;
		const top = root.getBoundingClientRect().top;
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
		const width = Math.min(19 * rem, innerWidth - 32);
		const height = Math.min(Math.round(innerHeight - top - 16), 680);
		const instant = reduced();
		ctx?.add(() => {
			const tl = gsap.timeline({
				onComplete: () => {
					const on = sheet.querySelector<HTMLElement>('[aria-selected="true"]');
					on?.scrollIntoView({ block: 'center' });
					on?.focus({ preventScroll: true });
				}
			});
			tl.to(
				root!,
				{ width, height, borderRadius: 18, duration: instant ? 0 : 0.5, ease: OPEN_EASE },
				0
			);
			tl.to(scrim!, { autoAlpha: 1, duration: instant ? 0 : 0.35, ease: 'power2.out' }, 0);
			tween = tl;
		});
	}

	function collapse(snap = false) {
		if (!root || !open) return;
		generation++;
		kill();
		const instant = snap || reduced();
		const finish = () => {
			open = false;
			gsap.set(root!, { clearProps: 'height,borderRadius,overflow' });
			titleBtn?.focus({ preventScroll: true });
		};
		if (instant) {
			gsap.set(scrim!, { autoAlpha: 0 });
			finish();
			return;
		}
		ctx?.add(() => {
			const tl = gsap.timeline({ onComplete: finish });
			tl.to(
				root!,
				{ width: closedW, height: closedH, borderRadius: 999, duration: 0.4, ease: CLOSE_EASE },
				0
			);
			tl.to(scrim!, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0);
			tween = tl;
		});
	}

	function toggle() {
		if (open) collapse();
		else expand();
	}

	function pick(id: string) {
		collapse();
		goToEpisodeById(id);
	}

	function onWindowKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			collapse();
		}
	}

	function onPointer(e: PointerEvent) {
		if (!open || !root) return;
		if (root.contains(e.target as Node)) return;
		collapse();
	}

	/** Arrows and type-ahead, same idea as the old menu, inside the grown pill. */
	let typed = '';
	let typedAt = 0;

	function onSheetKey(e: KeyboardEvent) {
		const items = [...(sheet?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [])];
		const i = items.indexOf(document.activeElement as HTMLButtonElement);
		const last = items.length - 1;
		const page = Math.max(1, Math.floor((sheet?.clientHeight ?? 0) / (items[0]?.offsetHeight || 36)) - 1);
		const steps: Record<string, number> = {
			ArrowDown: Math.min(i < 0 ? 0 : i + 1, last),
			ArrowUp: Math.max(i < 0 ? 0 : i - 1, 0),
			PageDown: Math.min((i < 0 ? 0 : i) + page, last),
			PageUp: Math.max((i < 0 ? 0 : i) - page, 0),
			Home: 0,
			End: last
		};
		let to = steps[e.key];
		const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
		if (to === undefined && printable && !(e.key === ' ' && !typed)) {
			const now = performance.now();
			typed = now - typedAt > 600 ? e.key : typed + e.key;
			typedAt = now;
			const q = typed.toLowerCase();
			const repeat = q.length > 1 && [...q].every((c) => c === q[0]);
			const needle = repeat ? q[0] : q;
			const start = needle.length === 1 ? i + 1 : Math.max(i, 0);
			for (let k = 0; k < options.length; k++) {
				const n = (start + k) % options.length;
				const text = options[n].label.replace(/^[\d.\s·:-]+/, '').toLowerCase();
				if (text.startsWith(needle) || options[n].label.toLowerCase().startsWith(needle)) {
					to = n;
					break;
				}
			}
			e.preventDefault();
		}
		if (to === undefined) return;
		e.preventDefault();
		items[to]?.focus({ preventScroll: true });
		items[to]?.scrollIntoView({ block: 'nearest' });
	}

	/**
	 * Fresh whenever the pill leaves or returns, so a hidden open panel snaps
	 * shut. Stable while `live` holds, so the open tween is not torn down.
	 */
	let stage = $derived.by(() => {
		const hidden = !live;
		const attach: Attachment<HTMLElement> = (node) => {
			root = node;
			ctx = gsap.context(() => {}, node);
			if (hidden) collapse(true);
			return () => {
				kill();
				ctx?.revert();
				ctx = undefined;
			};
		};
		return attach;
	});

	let fitGen = 0;
	let heldWidth = 0;
	/** Read the width before the new title is painted, so the tween has a start. */
	$effect.pre(() => {
		label;
		open;
		if (root && !open) heldWidth = root.getBoundingClientRect().width;
	});
	$effect(() => {
		label;
		if (open) return;
		const from = heldWidth;
		const n = ++fitGen;
		tick().then(() => {
			if (n === fitGen) fitWidth(from);
		});
	});

	onDestroy(() => {
		kill();
		killWidth();
		ctx?.revert();
	});
</script>

<svelte:window onkeydown={onWindowKey} onpointerdown={onPointer} />

<button class="scrim" bind:this={scrim} type="button" tabindex="-1" aria-label={ko ? '닫기' : 'Close'}></button>

<nav
	{@attach stage}
	class="title-pill switch liquid-glass"
	class:in={live}
	class:open
	aria-label={ko ? '회차' : 'Episode navigation'}
	aria-hidden={!live}
>
	<div class="bar">
		<button
			type="button"
			class="step"
			disabled={atFirst}
			aria-label={ko ? '이전 회차' : 'Previous episode'}
			tabindex={live && !atFirst ? 0 : -1}
			onclick={() => stepEpisode(-1)}
		>
			<span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
		</button>
		<button
			bind:this={titleBtn}
			type="button"
			class="title"
			aria-expanded={open}
			aria-controls="episode-switch-list"
			tabindex={live ? 0 : -1}
			onclick={toggle}
		>
			<span class="title-slot">
				{#key label}
					<span
						class="title-text"
						in:fly={{ x: (pageTurn.dir || 1) * 40, duration: 560, easing: arrive }}
						out:fly={{ x: (pageTurn.dir || 1) * -36, duration: 420, easing: arrive }}
					>{label}</span>
				{/key}
			</span>
			<span class="chev material-symbols-outlined" aria-hidden="true">expand_more</span>
		</button>
		<button
			type="button"
			class="step"
			disabled={atLast}
			aria-label={ko ? '다음 회차' : 'Next episode'}
			tabindex={live && !atLast ? 0 : -1}
			onclick={() => stepEpisode(1)}
		>
			<span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
		</button>
	</div>

	<div
		bind:this={sheet}
		id="episode-switch-list"
		class="sheet"
		role="listbox"
		aria-label={ko ? '회차' : 'Episode'}
		tabindex="-1"
		onkeydown={onSheetKey}
	>
		{#each chapters as ch, ci (ch.id)}
			{#if ch.part}
				<button
					type="button"
					class="panel-part"
					class:on-pill={pillId === partId(ch.id)}
					role="option"
					aria-selected={pillId === partId(ch.id)}
					onclick={() => pick(partId(ch.id))}
				>
					<span class="pp-kicker">{partLabel(ch.part, ko)}</span>
					{#if ch.partTitle || ch.partKorean}
						<span class="pp-title">{ko ? ch.partKorean || ch.partTitle : ch.partTitle || ch.partKorean}</span>
					{/if}
				</button>
			{/if}
			<button
				type="button"
				class="panel-item"
				class:active={activeArc === ch.id}
				class:on-pill={pillId === ch.id}
				role="option"
				aria-selected={pillId === ch.id}
				onclick={() => pick(ch.id)}
			>
				<span class="pi-title">
					{#if arcNumber(ci) !== null}
						<span class="pi-num">{arcNumber(ci)}</span>
						<span class="pi-dot" aria-hidden="true">·</span>
					{/if}
					{(ko && ch.korean) || ch.title}
				</span>
				{#if ch.korean && !ko}<span class="pi-ko">{ch.korean}</span>{/if}
			</button>
			<div class="sub">
				{#each spineEntries(ch) as en (ch.id + en.title)}
					{@const group = chapterEpisodes(ch, en)}
					{#if group.length}
						{@const head = chapterHeadedBy(ch.id, en.title)}
						{@const headId = head ? tocAnchor(ch.id, head) : entryId(ch.id, en.title)}
						{@const cover = head ? posterSrc(tocAnchor(ch.id, head)) : undefined}
						<div class="ep-block">
							<button
								type="button"
								class="sub-item group-head"
								class:branch={group.some((ep) => ep.id === activeEntry)}
								class:on-pill={pillId === headId}
								role="option"
								aria-selected={pillId === headId}
								onclick={() => pick(headId)}
							>
								{#if cover}
									<img
										class="cover-thumb"
										src={cover}
										alt=""
										onerror={(e) => ((e.currentTarget as HTMLImageElement).hidden = true)}
									/>
								{/if}
								<span class="si-title">{spineLabel(ch, en, ko)}</span>
							</button>
							<div class="ep-group">
								{#each group as ep (ep.id)}
									{@render episodeRow(ep)}
								{/each}
							</div>
						</div>
					{:else}
						{@render episodeRow(tocEpisode(ch, en))}
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</nav>

{#snippet episodeRow(ep: TocEpisode)}
	<button
		type="button"
		class="ep-item"
		class:active={activeEntry === ep.id}
		class:on-pill={pillId === ep.id}
		role="option"
		aria-selected={pillId === ep.id}
		onclick={() => pick(ep.id)}
	>
		{#if ep.num}<span class="ep-num">{ep.num}</span>{/if}
		<span class="si-title">{(ko && ep.ko) || ep.title || 'Untitled'}</span>
		{#if ep.kinds.length}
			<span class="ep-kinds" aria-hidden="true">
				{#each ep.kinds as k (k)}
					{@const kind = EPISODE_KIND_META[k]}
					<span class="ep-kind material-symbols-outlined" style:--kind={kind.color} title={kind.label}
						>{kind.icon}</span
					>
				{/each}
			</span>
		{/if}
	</button>
{/snippet}

<style>
	.scrim {
		position: fixed;
		z-index: 90;
		inset: 0;
		border: 0;
		padding: 0;
		background: rgb(0 0 0 / 0.32);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		opacity: 0;
		visibility: hidden;
		cursor: pointer;
	}

	.switch {
		--glass-tint: 34%;
		--glass-sheen: 14%;
		position: fixed;
		z-index: 102;
		top: max(0.75rem, env(safe-area-inset-top, 0px));
		left: 50%;
		display: flex;
		flex-direction: column;
		width: max-content;
		max-width: min(30rem, calc(100vw - 7rem));
		padding: 0.32rem;
		border-radius: var(--radius-pill);
		color: var(--fg-strong);
		font-family: var(--ui);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		opacity: 0;
		overflow: hidden;
		pointer-events: none;
		transform: translate3d(-50%, calc(-100% - 1.5rem), 0);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, white 55%, transparent),
			inset 0 -1px 0 color-mix(in srgb, white 12%, transparent);
		transition:
			transform 560ms cubic-bezier(0.32, 0.72, 0, 1),
			opacity 280ms var(--ease),
			--glass-tint 0.45s var(--ease);
	}

	.switch.in {
		opacity: 1;
		pointer-events: auto;
		transform: translate3d(-50%, 0, 0);
	}

	.switch.open {
		--glass-tint: 78%;
		--glass-sheen: 8%;
		max-width: 19rem;
	}

	.bar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.15rem;
		min-width: 0;
	}

	.step,
	.title {
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.step {
		display: grid;
		flex: none;
		place-items: center;
		width: 2.05rem;
		height: 2.05rem;
		padding: 0;
		border-radius: var(--radius-pill);
		color: var(--fg-dim);
		transition:
			background-color 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.step .material-symbols-outlined {
		font-size: 1.1rem;
		font-variation-settings: 'wght' 500;
	}

	.step:hover:not(:disabled),
	.title:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.step:disabled {
		opacity: 0.28;
		cursor: not-allowed;
	}

	.title {
		display: flex;
		flex: 1 1 auto;
		align-items: center;
		gap: 0.3rem;
		min-width: 0;
		height: 2.05rem;
		padding: 0 0.9rem;
		border-radius: var(--radius-pill);
		transition:
			background-color 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.title-slot {
		display: grid;
		min-width: 0;
		overflow: hidden;
	}

	.title-text {
		grid-area: 1 / 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chev {
		flex: none;
		font-size: 0.95rem;
		color: var(--fg-faint);
		transition: transform 0.45s cubic-bezier(0.32, 0.72, 0, 1);
	}

	.open .chev {
		transform: rotate(180deg);
	}

	.step:focus-visible,
	.title:focus-visible,
	.sheet [role='option']:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	.sheet {
		display: none;
		min-height: 0;
		margin: 0.28rem 0.12rem 0.08rem;
		padding: 0.12rem 0.2rem 0.35rem;
		overflow: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.3;
	}

	.open .sheet {
		display: block;
		flex: 1 1 auto;
	}

	.panel-part {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1rem;
		width: 100%;
		font: inherit;
		text-align: left;
		color: var(--gold);
		padding: 0.5rem 0.45rem 0.32rem;
		margin: 0.28rem 0 0.08rem;
		background: transparent;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		position: relative;
		z-index: 1;
	}

	.pp-kicker {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.pp-title {
		font-size: 14px;
		font-weight: 650;
		letter-spacing: 0.02em;
		line-height: 1.2;
	}

	.panel-part:hover {
		color: color-mix(in srgb, var(--gold) 88%, white);
	}

	.cover-thumb {
		flex: none;
		width: 1.7rem;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		object-position: center 18%;
		border-radius: 3px;
		align-self: center;
		background: #14140f;
	}

	.panel-item {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		width: 100%;
		font: inherit;
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 8px;
		padding: 0.42rem 0.45rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 90%, transparent);
		position: relative;
		z-index: 1;
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease);
	}

	.panel-item:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.pi-title {
		font: inherit;
		font-weight: 600;
		font-size: 13.5px;
		letter-spacing: var(--tracking-toc);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pi-num {
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.pi-dot {
		margin: 0 0.28em;
		opacity: 0.45;
	}

	.pi-ko {
		font-size: 11px;
		letter-spacing: 0;
		opacity: 0.5;
		flex-shrink: 0;
	}

	.sub {
		margin-left: 0.55rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
	}

	.ep-block {
		border-radius: var(--radius);
	}

	.sub-item {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		width: 100%;
		font: inherit;
		font-size: 12.5px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 8px;
		padding: 0.22rem 0.4rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 55%, transparent);
		position: relative;
		z-index: 1;
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease);
	}

	.sub-item:hover {
		color: color-mix(in srgb, var(--fg) 92%, transparent);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.sub-item.branch {
		color: color-mix(in srgb, var(--fg) 82%, transparent);
	}

	.si-title {
		flex: 0 1 auto;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: var(--tracking-toc);
	}

	.group-head {
		align-items: center;
		gap: 0.45rem;
		font-weight: 600;
		font-size: 13px;
		letter-spacing: var(--tracking-toc);
		text-transform: none;
		color: color-mix(in srgb, var(--fg) 82%, transparent);
		padding: 0.32rem 0.4rem;
	}

	.group-head .si-title {
		letter-spacing: var(--tracking-toc);
		font-style: normal;
	}

	.ep-kinds {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		margin-left: -0.2rem;
	}

	.ep-kind {
		font-size: 0.95rem;
		-webkit-text-stroke: 0.5px currentColor;
		color: var(--kind, transparent);
		opacity: 1;
		text-shadow: none;
	}

	.ep-num {
		flex-shrink: 0;
		min-width: 2.4em;
		font-variant-numeric: tabular-nums;
		font-size: 11px;
		opacity: 0.55;
		color: var(--gold);
	}

	.ep-group {
		margin: 0.08rem 0 0.34rem 0.2rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--gold) 26%, transparent);
	}

	.ep-item {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		width: 100%;
		font: inherit;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc-scene);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 8px;
		padding: 0.16rem 0.4rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 42%, transparent);
		position: relative;
		z-index: 1;
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease);
	}

	.ep-item:hover {
		color: color-mix(in srgb, var(--fg) 88%, transparent);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.panel-part.on-pill,
	.panel-item.on-pill,
	.sub-item.on-pill,
	.ep-item.on-pill,
	.panel-part.on-pill:hover,
	.panel-item.on-pill:hover,
	.sub-item.on-pill:hover,
	.ep-item.on-pill:hover {
		background: #fff;
		color: #14140f;
		text-shadow: none;
	}

	.panel-item.on-pill .pi-num,
	.on-pill .ep-num {
		color: #14140f;
		opacity: 0.72;
	}

	.on-pill .ep-kind {
		color: color-mix(in srgb, var(--kind, transparent) 45%, #14140f);
	}

	@media (max-width: 420px) {
		.switch {
			max-width: calc(100vw - 6.5rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.switch {
			transition: opacity 200ms ease;
			transform: translate3d(-50%, 0, 0);
		}

		.chev {
			transition: none;
		}
	}
</style>
