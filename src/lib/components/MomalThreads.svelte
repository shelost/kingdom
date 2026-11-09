<script lang="ts">
	/** Momal's past conversations: search, New chat, then Today / Yesterday / Past 7 days / Older. */
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { storyAsk, type AskThread } from '$lib/storyAsk.svelte';
	import { reading } from '$lib/reading.svelte';

	let { open, onclose, onpick }: { open: boolean; onclose: () => void; onpick: () => void } = $props();

	const ko = $derived(reading.lang === 'ko');
	const DAY = 86_400_000;
	const SECTIONS = [
		{ id: 'today', en: 'Today', ko: '오늘' },
		{ id: 'yesterday', en: 'Yesterday', ko: '어제' },
		{ id: 'week', en: 'Past 7 days', ko: '지난 7일' },
		{ id: 'older', en: 'Older', ko: '그 전' }
	] as const;

	let query = $state('');
	let searchEl = $state<HTMLInputElement | undefined>();
	let editing = $state<string | null>(null);
	let draft = $state('');

	function sectionOf(t: AskThread, midnight: number): (typeof SECTIONS)[number]['id'] {
		if (t.updated >= midnight) return 'today';
		if (t.updated >= midnight - DAY) return 'yesterday';
		if (t.updated >= midnight - 7 * DAY) return 'week';
		return 'older';
	}

	const groups = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const now = new Date();
		const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
		const hits = storyAsk.threads.filter(
			(t) =>
				!q ||
				t.title.toLowerCase().includes(q) ||
				t.messages.some((m) => m.content.toLowerCase().includes(q))
		);
		return SECTIONS.map((s) => ({ ...s, threads: hits.filter((t) => sectionOf(t, midnight) === s.id) })).filter(
			(s) => s.threads.length
		);
	});

	export async function focusSearch() {
		await tick();
		searchEl?.focus();
	}

	function pick(id: string) {
		storyAsk.select(id);
		onpick();
	}

	function fresh() {
		storyAsk.reset();
		onpick();
	}

	function startRename(t: AskThread) {
		editing = t.id;
		draft = t.title;
	}

	function commitRename() {
		if (editing) storyAsk.rename(editing, draft);
		editing = null;
	}

	function onRenameKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			commitRename();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			editing = null;
		}
	}

	function focusOnMount(el: HTMLInputElement) {
		el.focus();
		el.select();
	}
</script>

{#if open}
	<button type="button" class="scrim" aria-label={ko ? '닫기' : 'Close chats'} onclick={onclose}></button>
	<aside class="drawer" aria-label={ko ? '대화 목록' : 'Chats'} transition:fly={{ x: -14, duration: 250, easing: cubicOut }}>
		<label class="search">
			<span class="material-symbols-outlined" aria-hidden="true">search</span>
			<input
				bind:this={searchEl}
				bind:value={query}
				type="search"
				placeholder={ko ? '대화 검색' : 'Search chats'}
				aria-label={ko ? '대화 검색' : 'Search chats'}
			/>
			<kbd>⌘K</kbd>
		</label>

		<button type="button" class="new" onclick={fresh}>
			<span class="material-symbols-outlined" aria-hidden="true">edit_square</span>
			{ko ? '새 대화' : 'New chat'}
		</button>

		<div class="list">
			{#each groups as g (g.id)}
				<section>
					<h3>{ko ? g.ko : g.en}</h3>
					{#each g.threads as t (t.id)}
						<div class="item" class:current={t.id === storyAsk.currentId}>
							{#if editing === t.id}
								<input
									class="rename"
									bind:value={draft}
									onkeydown={onRenameKey}
									onblur={commitRename}
									aria-label={ko ? '대화 이름' : 'Chat name'}
									{@attach focusOnMount}
								/>
							{:else}
								<button type="button" class="pick" onclick={() => pick(t.id)} title={t.title}>
									{t.title || (ko ? '제목 없음' : 'Untitled')}
								</button>
								<div class="tools">
									<button type="button" class="mini" onclick={() => startRename(t)} aria-label={ko ? '이름 바꾸기' : 'Rename'}>
										<span class="material-symbols-outlined" aria-hidden="true">edit</span>
									</button>
									<button type="button" class="mini" onclick={() => storyAsk.remove(t.id)} aria-label={ko ? '지우기' : 'Delete'}>
										<span class="material-symbols-outlined" aria-hidden="true">delete</span>
									</button>
								</div>
							{/if}
						</div>
					{/each}
				</section>
			{:else}
				<p class="none">
					{query.trim() ? (ko ? '찾는 대화가 없다.' : 'No chats match.') : ko ? '아직 대화가 없다.' : 'No chats yet.'}
				</p>
			{/each}
		</div>
	</aside>
{/if}

<style lang="scss">
	$gold: #ffb900;

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 4;
		border: none;
		background: transparent;
		cursor: default;
	}

	.drawer {
		position: fixed;
		top: 0.6rem;
		left: 0.6rem;
		bottom: 0.6rem;
		z-index: 5;
		width: min(19rem, calc(100vw - 1.2rem));
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 3.4rem 0.6rem 0.6rem;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(16, 16, 21, 0.86);
		backdrop-filter: blur(24px) saturate(1.3);
		-webkit-backdrop-filter: blur(24px) saturate(1.3);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 24px 60px -20px rgba(0, 0, 0, 0.8);
	}

	.search {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		height: 2.4rem;
		padding: 0 0.7rem;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.5);
		& .material-symbols-outlined {
			font-size: 1rem;
		}
		&:focus-within {
			background: rgba(255, 255, 255, 0.11);
		}
	}

	.search input {
		flex: 1;
		min-width: 0;
		border: none;
		background: transparent;
		color: #fff;
		font: inherit;
		font-size: 0.84rem;
		font-weight: 500;
		outline: none;
		&::placeholder {
			color: rgba(255, 255, 255, 0.4);
		}
	}

	kbd {
		font: inherit;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.35);
	}

	.new {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.6rem;
		border: none;
		border-radius: 10px;
		background: transparent;
		color: $gold;
		font: inherit;
		font-size: 0.86rem;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
		& .material-symbols-outlined {
			font-size: 1.1rem;
		}
		&:hover {
			background: rgba($gold, 0.1);
		}
	}

	.list {
		flex: 1;
		min-height: 0;
		overflow: auto;
		margin: 0 -0.2rem;
		padding: 0 0.2rem 0.4rem;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.14) transparent;
	}

	section + section {
		margin-top: 0.8rem;
	}

	h3 {
		margin: 0.4rem 0.6rem 0.3rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0;
		color: rgba(255, 255, 255, 0.4);
	}

	.item {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 10px;
		&:hover,
		&.current {
			background: rgba(255, 255, 255, 0.07);
		}
		&.current .pick {
			color: #fff;
		}
		&:hover .tools,
		&:focus-within .tools {
			opacity: 1;
		}
	}

	.pick {
		flex: 1;
		min-width: 0;
		padding: 0.5rem 0.6rem;
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.72);
		font: inherit;
		font-size: 0.84rem;
		font-weight: 500;
		text-align: left;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.tools {
		display: flex;
		padding-right: 0.25rem;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.mini {
		width: 1.6rem;
		height: 1.6rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		& .material-symbols-outlined {
			font-size: 0.95rem;
		}
		&:hover {
			background: rgba(255, 255, 255, 0.1);
			color: #fff;
		}
	}

	.rename {
		flex: 1;
		min-width: 0;
		margin: 0.2rem;
		padding: 0.3rem 0.45rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.3);
		color: #fff;
		font: inherit;
		font-size: 0.84rem;
		outline: none;
	}

	.none {
		margin: 0.6rem;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.4);
	}

	@media (hover: none) {
		.tools {
			opacity: 1;
		}
	}
</style>
