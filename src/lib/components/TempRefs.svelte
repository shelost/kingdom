<script lang="ts">
	/**
	 * TempRefs — user-started tone-reference player.
	 * Embeds YouTube only after a click (no autoplay). Links out for
	 * legal public sheets. Never hosts copyrighted audio or notation.
	 */
	import { browser } from '$app/environment';
	import { youtubeIdOf, type MotifTemp } from '$lib/leitmotifs';

	let { temps }: { temps: readonly MotifTemp[] } = $props();

	let openIndex = $state<number | null>(null);

	function toggle(i: number) {
		if (!browser) return;
		const ref = temps[i];
		const vid = youtubeIdOf(ref);
		if (!vid) {
			if (ref.url) window.open(ref.url, '_blank', 'noopener,noreferrer');
			return;
		}
		openIndex = openIndex === i ? null : i;
	}

	function openSheet(url: string) {
		if (!browser) return;
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

{#if temps.length}
	<div class="temps">
		{#each temps as ref, i (ref.title + (ref.youtubeId ?? ref.url ?? i))}
			{@const vid = youtubeIdOf(ref)}
			{@const open = openIndex === i}
			<div class="temp">
				<div class="temp-row">
					<span class="temp-label">Temp</span>
					<span class="temp-meta">
						{ref.title}
						<span class="sep">·</span>
						{ref.source}{ref.year ? ` (${ref.year})` : ''}
					</span>
					<span class="temp-actions">
						<button
							type="button"
							class={['temp-btn', open && 'on']}
							onclick={() => toggle(i)}
							aria-pressed={open}
							title={ref.note}
						>
							{vid ? (open ? 'Hide temp' : 'Play temp') : 'Open temp'}
						</button>
						{#if ref.sheetUrl}
							<button
								type="button"
								class="sheet-btn"
								onclick={() => openSheet(ref.sheetUrl ?? '')}
								title="Legal public or publisher page — not our motif"
							>
								Sheet
							</button>
						{/if}
					</span>
				</div>
				<p class="temp-note">{ref.note}</p>
				{#if !ref.sheetUrl}
					<p class="temp-sheet-omit">No public sheet — copyrighted; we do not embed notation.</p>
				{/if}
				{#if open && vid}
					<div class="temp-embed">
						<p class="temp-caption">TEMP — not the chronicle theme. Starts only if you press play.</p>
						<iframe
							src="https://www.youtube-nocookie.com/embed/{vid}?autoplay=0"
							title="Temp reference: {ref.title}"
							allow="encrypted-media; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	.temps {
		display: grid;
		gap: 0.55rem;
	}

	.temp {
		display: grid;
		gap: 0.28rem;
	}

	.temp-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem 0.5rem;
	}

	.temp-label {
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.temp-meta {
		flex: 1;
		min-width: 10rem;
		font-size: 0.7rem;
		line-height: 1.4;
		color: var(--fg-faint);
	}

	.sep {
		opacity: 0.45;
	}

	.temp-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
	}

	.temp-btn,
	.sheet-btn {
		font: inherit;
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 0.12rem 0.45rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.temp-btn {
		border: 1px dashed color-mix(in srgb, var(--gold) 45%, transparent);
		background: transparent;
		color: var(--fg-faint);
	}

	.temp-btn:hover,
	.temp-btn.on {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 70%, transparent);
	}

	.sheet-btn {
		border: 1px solid var(--hairline);
		background: var(--glass);
		color: var(--fg-dim);
	}

	.sheet-btn:hover {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 50%, transparent);
	}

	.temp-note,
	.temp-sheet-omit {
		margin: 0;
		font-size: 0.62rem;
		line-height: 1.4;
		color: var(--fg-faint);
	}

	.temp-sheet-omit {
		font-style: italic;
		opacity: 0.8;
	}

	.temp-embed {
		border: 1px dashed color-mix(in srgb, var(--gold) 35%, transparent);
		border-radius: 10px;
		overflow: hidden;
		background: var(--panel-sunken);
	}

	.temp-caption {
		margin: 0;
		padding: 0.4rem 0.65rem 0.2rem;
		font-size: 0.62rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.temp-embed iframe {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 0;
	}
</style>
