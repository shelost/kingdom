<script lang="ts">
	let {
		frames,
		current = 0,
		onreorder,
		onmenu,
		onpick
	}: {
		frames: readonly string[];
		/** Frame the main still is showing. */
		current?: number;
		onreorder: (frames: string[]) => void;
		/** Right-click on a still — open the delete menu for that index. */
		onmenu: (event: MouseEvent, index: number) => void;
		/** Click a still — show that frame in the scene. */
		onpick: (index: number) => void;
	} = $props();

	let dragIndex = $state<number | null>(null);
	let skipClick = false;

	function pick(index: number) {
		if (skipClick) {
			skipClick = false;
			return;
		}
		onpick(index);
	}

	function drop(to: number, event: DragEvent) {
		event.preventDefault();
		const from = dragIndex;
		dragIndex = null;
		if (from == null || from === to) return;
		const next = [...frames];
		const [item] = next.splice(from, 1);
		if (!item) return;
		next.splice(to, 0, item);
		onreorder(next);
	}
</script>

<aside class="frame-edit" aria-label="Frames in this song">
	<p class="kicker">Sequence</p>
	<ol>
		{#each frames as src, i (src + ':' + i)}
			<li
				class:dragging={dragIndex === i}
				class:current={current === i}
				draggable="true"
				role="button"
				tabindex="0"
				aria-current={current === i ? 'true' : undefined}
				title="Click to show this still. Drag to reorder. Right-click for options."
				ondragstart={() => {
					dragIndex = i;
					skipClick = true;
				}}
				ondragend={() => {
					dragIndex = null;
					queueMicrotask(() => (skipClick = false));
				}}
				ondragover={(event) => event.preventDefault()}
				ondrop={(event) => drop(i, event)}
				onclick={() => pick(i)}
				onkeydown={(event) => {
					if (event.key !== 'Enter' && event.key !== ' ') return;
					event.preventDefault();
					onpick(i);
				}}
				oncontextmenu={(event) => {
					event.preventDefault();
					onmenu(event, i);
				}}
			>
				<img {src} alt="" />
				<span>{i + 1}</span>
			</li>
		{/each}
	</ol>
</aside>

<style>
	.frame-edit {
		min-height: 0;
		height: 100%;
		overflow: auto;
		padding: 0.35rem 0.15rem 0.8rem 0;
		scrollbar-width: thin;
	}

	.kicker {
		margin: 0 0 0.45rem;
		font-family: var(--ui);
		font-size: 0.68rem;
		letter-spacing: var(--tracking-ui);
		color: color-mix(in srgb, var(--fg) 62%, transparent);
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	li {
		position: relative;
		margin: 0;
		border-radius: 6px;
		overflow: hidden;
		cursor: grab;
		box-shadow: 0 0 0 1px color-mix(in srgb, #fff 14%, transparent);
	}

	li.dragging {
		opacity: 0.45;
	}

	li.current {
		box-shadow: 0 0 0 2px var(--gold);
	}

	img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		background: #050506;
	}

	span {
		position: absolute;
		left: 0.3rem;
		bottom: 0.25rem;
		font-family: var(--ui);
		font-size: 0.65rem;
		color: #fff;
		text-shadow: 0 1px 6px #000;
	}
</style>
