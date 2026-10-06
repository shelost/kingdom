<script lang="ts">
	import { modal } from '$lib/attachments/modal';
	import type { Entry } from '$lib/story';
	import { storyImg } from '$lib/img';
	import { editUi } from '$lib/editUi.svelte';
	import { hiddenCuesOf, setCueHidden } from '$lib/hiddenCues.svelte';
	import { liveDisplayArt } from '$lib/stillEditUi.svelte';

	let { entry }: { entry: Entry } = $props();

	let open = $state(false);
	let hidden = $derived(editUi.enabled ? hiddenCuesOf(entry) : []);
	let label = $derived(`${hidden.length} hidden ${hidden.length === 1 ? 'still' : 'stills'}`);

	async function reinstate(slotId: string) {
		const done = await setCueHidden(slotId, false);
		if (done && !hidden.length) open = false;
	}

</script>

{#if hidden.length}
	<button type="button" class="hidden-link" onclick={() => (open = true)}>
		{label}
	</button>
	{#if open}
		<dialog
			class="hidden-stills"
			aria-label="Hidden stills"
			{@attach modal}
			onclose={() => (open = false)}
			onclick={(e) => {
				if (e.target === e.currentTarget) open = false;
			}}
		>
			<div class="sheet">
				<header>
					<h3>{label}</h3>
					<button type="button" class="close" aria-label="Close" onclick={() => (open = false)}>
						<span class="material-symbols-outlined" aria-hidden="true">close</span>
					</button>
				</header>
				<p class="note">Hidden stills stay in story.json and on disk. Reinstate puts one back where it was.</p>
				<ul>
					{#each hidden as slot (slot.id)}
						{@const art = liveDisplayArt(slot, 'reading')}
						<li>
							<span class="art">
								{#if art}
									<img {...storyImg(art, { kind: 'cue', sizes: '16rem', alt: slot.alt ?? '' })} />
								{/if}
							</span>
							<span class="row">
								<span class="id">{slot.id}</span>
								<button
									type="button"
									class="reinstate"
									disabled={!!editUi.busyId}
									onclick={() => reinstate(slot.id)}
								>
									Reinstate
								</button>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		</dialog>
	{/if}
{/if}

<style>
	.hidden-link {
		appearance: none;
		margin: 0.75rem 0 0;
		padding: 0;
		border: none;
		background: none;
		color: var(--fg-dim);
		font: inherit;
		font-family: var(--ui);
		font-size: 0.78rem;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}

	.hidden-link:hover {
		color: var(--fg);
	}

	.hidden-stills {
		width: min(52rem, calc(100vw - 2rem));
		max-height: min(80dvh, 46rem);
		padding: 0;
		border: 1px solid color-mix(in srgb, #fff 14%, transparent);
		border-radius: 10px;
		background: #0b0b0e;
		color: var(--fg);
		font-family: var(--ui);
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
	}

	.hidden-stills::backdrop {
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
	}

	.sheet {
		padding: 1rem 1.1rem 1.2rem;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	h3 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
	}

	.close {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.close:hover {
		background: color-mix(in srgb, #fff 10%, transparent);
		color: var(--fg);
	}

	.note {
		margin: 0.25rem 0 1rem;
		font-size: 0.75rem;
		color: var(--fg-faint);
	}

	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: 0.9rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		gap: 0.45rem;
	}

	.art {
		display: block;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: 6px;
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		min-width: 0;
	}

	.id {
		min-width: 0;
		overflow: hidden;
		font-size: 0.7rem;
		color: var(--fg-dim);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.reinstate {
		flex: 0 0 auto;
		padding: 0.3rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--fg) 25%, transparent);
		border-radius: 5px;
		background: transparent;
		color: var(--fg);
		font: inherit;
		font-size: 0.72rem;
		font-weight: 600;
		cursor: pointer;
	}

	.reinstate:hover:not([disabled]) {
		background: color-mix(in srgb, #fff 10%, transparent);
	}

	.reinstate[disabled] {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
