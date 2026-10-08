<script lang="ts" module>
	export type GlassOption<T extends string> = {
		value: T;
		label: string;
		count?: number;
		hint?: string;
		/** Heading the option sits under; a new heading starts wherever it changes. */
		group?: string;
		/** A section-level option (a Part's title page), set larger than its neighbours. */
		strong?: boolean;
	};
</script>

<script lang="ts" generics="T extends string">
	let {
		label,
		value = $bindable(),
		options,
		onchange,
		variant = 'glass',
		placement = 'below',
		align = 'start',
		sheet = false,
		menuWidth,
		tabindex
	}: {
		/** Field name, shown small inside the pill and read as the listbox name. */
		label: string;
		value: T;
		options: GlassOption<T>[];
		onchange?: (value: T) => void;
		/** `glass`: its own pill. `inline`: a bare trigger inside a pill that is already glass. */
		variant?: 'glass' | 'inline';
		/** Preferred side of the trigger; the menu flips when that side runs out of room. */
		placement?: 'below' | 'above';
		align?: 'start' | 'center';
		/** On phones, open as a bottom sheet instead of a menu pinned to the trigger. */
		sheet?: boolean;
		/** Menu width (any CSS length) when it should run wider than the trigger. */
		menuWidth?: string;
		tabindex?: number;
	} = $props();

	const uid = $props.id();
	/** Space between the pill and its menu, and the menu and the window edge. */
	const GAP = 8;
	/** Tallest the menu grows, as a share of the window. */
	const MAX_SHARE = 0.7;
	/** Below this much room the menu takes the other side if that side has more. */
	const MIN_ROOM = 160;
	/** Type-ahead keeps collecting letters for this long. */
	const TYPE_RESET_MS = 600;
	const SHEET_QUERY = '(max-width: 640px)';

	let trigger = $state<HTMLButtonElement>();
	let menu = $state<HTMLDivElement>();
	let open = $state(false);
	let asSheet = $state(false);
	let pos = $state({ top: 0, left: 0, width: 0, maxHeight: 0, above: false });
	let current = $derived(options.find((o) => o.value === value) ?? options[0]);

	/** Options in runs that share a heading, for `role="group"` sections. */
	let sections = $derived.by(() => {
		const out: { group?: string; options: GlassOption<T>[] }[] = [];
		for (const o of options) {
			const last = out[out.length - 1];
			if (last && last.group === o.group) last.options.push(o);
			else out.push({ group: o.group, options: [o] });
		}
		return out;
	});

	/* The menu lives in the top layer (it has to escape clipped, transformed
	   parents), so it is placed against the pill by hand: on the preferred
	   side, or the other one when the window runs out, and never past either
	   edge. Its height is capped to the room on that side so it scrolls. */
	function place() {
		if (!trigger || !menu) return;
		asSheet = sheet && matchMedia(SHEET_QUERY).matches;
		if (asSheet) return;
		const r = trigger.getBoundingClientRect();
		const want = Math.min(menu.scrollHeight + 2, innerHeight * MAX_SHARE);
		const roomBelow = innerHeight - r.bottom - GAP * 2;
		const roomAbove = r.top - GAP * 2;
		const [prefer, other] = placement === 'above' ? [roomAbove, roomBelow] : [roomBelow, roomAbove];
		const flip = prefer < Math.min(want, MIN_ROOM) && other > prefer;
		const above = (placement === 'above') !== flip;
		const maxHeight = Math.max(0, Math.min(want, above ? roomAbove : roomBelow));
		const w = Math.max(r.width, menu.offsetWidth);
		const start = align === 'center' ? r.left + r.width / 2 - w / 2 : r.left;
		pos = {
			top: above ? r.top - GAP - maxHeight : r.bottom + GAP,
			left: Math.min(Math.max(GAP, start), innerWidth - w - GAP),
			width: r.width,
			maxHeight,
			above
		};
	}

	function optionEls(): HTMLButtonElement[] {
		return [...(menu?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [])];
	}

	/** Scroll an option to the middle of the menu without moving the page. */
	function centre(el: HTMLElement) {
		if (!menu) return;
		menu.scrollTop = el.offsetTop - menu.clientHeight / 2 + el.offsetHeight / 2;
	}

	function ontoggle(e: ToggleEvent) {
		open = e.newState === 'open';
		if (!open) return;
		place();
		/* `place` sets the height through state; centre once it has landed. */
		requestAnimationFrame(() => {
			const items = optionEls();
			const sel = items.find((b) => b.getAttribute('aria-selected') === 'true') ?? items[0];
			if (!sel) return;
			centre(sel);
			sel.focus({ preventScroll: true });
		});
	}

	/* Closing with focus inside the menu (Esc, Tab) hands it back to the pill. */
	function onbeforetoggle(e: ToggleEvent) {
		if (e.newState === 'closed' && menu?.contains(document.activeElement)) {
			trigger?.focus({ preventScroll: true });
		}
	}

	function pick(v: T) {
		menu?.hidePopover();
		trigger?.focus({ preventScroll: true });
		if (v === value) return;
		value = v;
		onchange?.(v);
	}

	function onTriggerKey(e: KeyboardEvent) {
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();
		menu?.showPopover();
	}

	/* ————— type-ahead ————— */
	let typed = '';
	let typedAt = 0;

	/** What a typed letter matches: the label without a leading episode number. */
	function searchText(o: GlassOption<T>): string {
		return o.label.replace(/^[\d.\s·:-]+/, '').toLowerCase();
	}

	function typeAhead(key: string, from: number): number {
		const now = performance.now();
		typed = now - typedAt > TYPE_RESET_MS ? key : typed + key;
		typedAt = now;
		const q = typed.toLowerCase();
		/* One letter pressed again walks to the next match; a word refines in place. */
		const repeat = q.length > 1 && [...q].every((c) => c === q[0]);
		const needle = repeat ? q[0] : q;
		const start = needle.length === 1 ? from + 1 : Math.max(from, 0);
		const n = options.length;
		for (let k = 0; k < n; k++) {
			const i = (start + k) % n;
			const o = options[i];
			if (searchText(o).startsWith(needle) || o.label.toLowerCase().startsWith(needle)) return i;
		}
		return -1;
	}

	/** Arrows, Home/End, Page keys and type-ahead walk the options; Tab leaves (Esc and outside clicks close natively). */
	function onMenuKey(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			menu?.hidePopover();
			return;
		}
		const items = optionEls();
		const i = items.indexOf(document.activeElement as HTMLButtonElement);
		const last = items.length - 1;
		const page = Math.max(1, Math.floor((menu?.clientHeight ?? 0) / (items[0]?.offsetHeight || 34)) - 1);
		const steps: Record<string, number> = {
			ArrowDown: Math.min(i + 1, last),
			ArrowUp: Math.max(i - 1, 0),
			PageDown: Math.min(i + page, last),
			PageUp: Math.max(i - page, 0),
			Home: 0,
			End: last
		};
		let to: number | undefined = steps[e.key];
		const printable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
		if (to === undefined && printable && !(e.key === ' ' && !typed)) {
			const hit = typeAhead(e.key, i);
			if (hit >= 0) to = hit;
			e.preventDefault();
		}
		if (to === undefined) return;
		e.preventDefault();
		const el = items[to];
		if (!el) return;
		el.focus({ preventScroll: true });
		el.scrollIntoView({ block: 'nearest' });
	}
</script>

<svelte:window
	onresize={() => open && place()}
	onscrollcapture={(e) => open && e.target !== menu && place()}
/>

{#snippet option(o: GlassOption<T>)}
	<button
		type="button"
		role="option"
		class="option"
		class:strong={o.strong}
		aria-selected={o.value === value}
		title={o.hint}
		tabindex="-1"
		onclick={() => pick(o.value)}
	>
		<span class="check material-symbols-outlined" aria-hidden="true">check</span>
		<span class="option-label">{o.label}</span>
		{#if o.count != null}<span class="count">{o.count}</span>{/if}
	</button>
{/snippet}

<button
	bind:this={trigger}
	type="button"
	class="trigger"
	class:liquid-glass={variant === 'glass'}
	class:inline={variant === 'inline'}
	class:open
	popovertarget="{uid}-menu"
	aria-haspopup="listbox"
	aria-controls="{uid}-menu"
	aria-expanded={open}
	{tabindex}
	onkeydown={onTriggerKey}
>
	<span class="field">{label}</span>
	<span class="value">{current?.label}</span>
	<span class="chev material-symbols-outlined" aria-hidden="true">expand_more</span>
</button>

<div
	bind:this={menu}
	id="{uid}-menu"
	class="menu liquid-glass"
	class:above={pos.above}
	class:sheet={asSheet}
	class:grouped={sections.some((s) => s.group)}
	popover="auto"
	role="listbox"
	tabindex="-1"
	aria-label={label}
	style:top={asSheet ? null : `${pos.top}px`}
	style:left={asSheet ? null : `${pos.left}px`}
	style:min-width={asSheet ? null : `${pos.width}px`}
	style:max-height={asSheet || !pos.maxHeight ? null : `${pos.maxHeight}px`}
	style:width={asSheet ? null : menuWidth}
	{ontoggle}
	{onbeforetoggle}
	onkeydown={onMenuKey}
>
	{#each sections as s, si (si)}
		{#if s.group}
			<div class="group" role="group" aria-labelledby="{uid}-g{si}">
				<div class="group-label" id="{uid}-g{si}">{s.group}</div>
				{#each s.options as o (o.value)}
					{@render option(o)}
				{/each}
			</div>
		{:else}
			{#each s.options as o (o.value)}
				{@render option(o)}
			{/each}
		{/if}
	{/each}
</div>

<style>
	/* ————— the pill ————— */
	.trigger {
		--glass-tint: 30%;
		--glass-sheen: 12%;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.5rem;
		padding: 0 0.7rem 0 1.05rem;
		border-radius: var(--radius-pill);
		font: inherit;
		font-family: var(--ui);
		font-size: 13px;
		letter-spacing: var(--tracking-ui);
		line-height: 1;
		color: var(--fg);
		cursor: pointer;
		transition:
			--glass-tint 0.25s var(--ease),
			background 0.25s var(--ease),
			transform 0.25s var(--ease);
	}

	.trigger:hover,
	.trigger.open {
		--glass-tint: 48%;
	}

	.trigger:active {
		transform: scale(0.98);
	}

	.trigger:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--gold) 70%, transparent);
		outline-offset: 2px;
	}

	/* Inline: no glass of its own; the field name is read, not shown. */
	.trigger.inline {
		min-width: 0;
		max-width: 100%;
		height: 2.75rem;
		padding: 0 0.6rem 0 0.95rem;
		border: none;
		background: transparent;
	}

	.trigger.inline:hover,
	.trigger.inline.open {
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.trigger.inline .field {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.field {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.value {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 500;
		color: var(--fg-strong);
	}

	.chev {
		margin-left: auto;
		font-size: 1.15rem;
		color: var(--fg-faint);
		transition: transform 0.3s var(--ease);
	}

	.trigger.open .chev {
		transform: rotate(180deg);
	}

	/* ————— the menu ————— */
	.menu {
		--glass-tint: 72%;
		--glass-sheen: 10%;
		position: fixed;
		inset: auto;
		box-sizing: border-box;
		margin: 0;
		max-width: calc(100vw - 16px);
		max-height: min(22rem, 60vh);
		padding: 0.35rem;
		overflow-y: auto;
		overscroll-behavior: contain;
		border-radius: 16px;
		color: var(--fg);
		font-family: var(--ui);
		font-size: 13px;
		letter-spacing: var(--tracking-ui);
		scrollbar-width: thin;
		opacity: 1;
		transform: none;
		transform-origin: top center;
		transition:
			opacity 0.18s var(--ease),
			transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
			overlay 0.24s allow-discrete,
			display 0.24s allow-discrete;
	}

	.menu.above {
		transform-origin: bottom center;
	}

	.menu:not(:popover-open) {
		opacity: 0;
		transform: translateY(-6px) scale(0.97);
	}

	.menu.above:not(:popover-open) {
		transform: translateY(6px) scale(0.97);
	}

	@starting-style {
		.menu:popover-open {
			opacity: 0;
			transform: translateY(-6px) scale(0.97);
		}

		.menu.above:popover-open {
			transform: translateY(6px) scale(0.97);
		}
	}

	/* Phones: a bottom sheet over a dimmed page, thumb-high and tall. */
	.menu.sheet {
		--glass-tint: 86%;
		top: auto;
		left: max(0.5rem, env(safe-area-inset-left, 0px));
		right: max(0.5rem, env(safe-area-inset-right, 0px));
		bottom: max(0.5rem, env(safe-area-inset-bottom, 0px));
		width: auto;
		max-width: none;
		max-height: 72dvh;
		padding: 0.5rem;
		border-radius: 22px;
		transform-origin: bottom center;
	}

	.menu.sheet:not(:popover-open) {
		opacity: 0;
		transform: translateY(24px);
	}

	@starting-style {
		.menu.sheet:popover-open {
			opacity: 0;
			transform: translateY(24px);
		}
	}

	.menu.sheet::backdrop {
		background: rgb(0 0 0 / 0.38);
	}

	.group + .group,
	.option + .group,
	.group + .option {
		margin-top: 0.3rem;
	}

	/* Headings stay pinned while their run scrolls under them. */
	.group-label {
		position: sticky;
		top: -0.35rem;
		z-index: 1;
		margin: 0 -0.35rem;
		padding: 0.55rem 1.1rem 0.35rem;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.menu.sheet .group-label {
		top: -0.5rem;
		margin: 0 -0.5rem;
		padding-inline: 1.25rem;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		width: 100%;
		min-height: 2.15rem;
		padding: 0 0.75rem 0 0.5rem;
		border: 0;
		border-radius: 10px;
		background: transparent;
		font: inherit;
		color: var(--fg-dim);
		text-align: left;
		white-space: nowrap;
		cursor: pointer;
		outline: none;
		transition:
			background 0.15s var(--ease),
			color 0.15s var(--ease);
	}

	.menu.sheet .option {
		min-height: 2.75rem;
		white-space: normal;
	}

	.option:hover,
	.option:focus-visible {
		background: color-mix(in srgb, var(--fg) 9%, transparent);
		color: var(--fg-strong);
	}

	.option:focus-visible {
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--gold) 70%, transparent);
	}

	.option[aria-selected='true'] {
		color: var(--fg-strong);
		font-weight: 600;
		background: color-mix(in srgb, var(--gold) 16%, transparent);
	}

	.option.strong {
		font-family: var(--serif);
		font-size: 0.95rem;
		color: var(--fg-strong);
	}

	.check {
		flex: none;
		font-size: 1rem;
		color: var(--gold);
		visibility: hidden;
	}

	.option[aria-selected='true'] .check {
		visibility: visible;
	}

	.option-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.count {
		margin-left: 1.5rem;
		font-size: 0.72rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.trigger,
		.chev,
		.menu {
			transition: none;
		}
	}
</style>
