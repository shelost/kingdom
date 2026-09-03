<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		findOrphanedImages,
		flattenStoryImages,
		type GalleryView,
		type StoryCueImage
	} from '$lib/storyImages';
	import { storyImg } from '$lib/img';

	const images = flattenStoryImages();
	const orphans = findOrphanedImages();
	const tempCount = images.filter((im) => im.isTemp).length;
	const refsCount = images.filter((im) => im.hasGenuineRefs).length;
	const stackCount = images.filter((im) => im.hasStack).length;
	const seedCopyCount = images.filter((im) => im.isSeedCopy).length;

	let view = $state<GalleryView>('grid');
	/** Hover / focus stack: which layer is on top per cue key (`temp` | `final`). */
	let stackFront = $state<Record<string, 'temp' | 'final'>>({});

	const VIEWS: { id: GalleryView; label: string; hint: string }[] = [
		{ id: 'grid', label: 'Grid', hint: 'Browsable gallery in story order' },
		{ id: 'cues', label: 'Cues', hint: 'Each image beside the script cue that triggers it' }
	];

	function frontOf(im: StoryCueImage): 'temp' | 'final' {
		return stackFront[im.key] ?? 'temp';
	}

	function cycleStack(im: StoryCueImage) {
		if (!im.hasStack) return;
		stackFront[im.key] = frontOf(im) === 'temp' ? 'final' : 'temp';
	}

	function showFinalOnHover(im: StoryCueImage) {
		if (!im.hasStack) return;
		stackFront[im.key] = 'final';
	}

	function showTempOnLeave(im: StoryCueImage) {
		if (!im.hasStack) return;
		stackFront[im.key] = 'temp';
	}

	function layerSrc(im: StoryCueImage, layer: 'temp' | 'final'): string | undefined {
		return layer === 'temp' ? im.tempArt : im.finalArt;
	}
</script>

{#snippet cueThumb(im: StoryCueImage)}
	{@const front = frontOf(im)}
	{#if im.hasStack && im.tempArt && im.finalArt}
		<button
			type="button"
			class="thumb stack"
			style:--tone={im.slot.tone ?? '#3a3a40'}
			aria-label={`${im.title}: alternate temp and final art`}
			onmouseenter={() => showFinalOnHover(im)}
			onmouseleave={() => showTempOnLeave(im)}
			onclick={() => cycleStack(im)}
		>
			<div class="stack-layers" class:final-front={front === 'final'}>
				<img
					class="layer temp-layer"
					{...storyImg(im.tempArt, { kind: 'cue', alt: '', sizes: '180px' })}
				/>
				<img
					class="layer final-layer"
					{...storyImg(im.finalArt, {
						kind: 'cue',
						alt: im.slot.alt ?? im.title,
						sizes: '180px'
					})}
				/>
			</div>
			<span class="layer-chip" data-kind={front}>{front === 'temp' ? 'temp' : 'final'}</span>
			<div class="badges">
				{#if im.isTemp}
					<span class="badge">temp</span>
				{/if}
				{#if im.hasGenuineRefs}
					<span class="badge refs" class:explicit={im.hasExplicitRefs}>refs</span>
				{/if}
			</div>
		</button>
	{:else}
		<figure class="thumb" style:--tone={im.slot.tone ?? '#3a3a40'}>
			{#if im.displayArt}
				<img
					{...storyImg(im.displayArt, {
						kind: 'cue',
						alt: im.slot.alt ?? im.title,
						sizes: '180px'
					})}
				/>
			{:else}
				<div class="ph">
					<span class="ph-id">{im.slot.id}</span>
				</div>
			{/if}
			<div class="badges">
				{#if im.isTemp}
					<span class="badge">temp</span>
				{/if}
				{#if im.hasGenuineRefs}
					<span class="badge refs" class:explicit={im.hasExplicitRefs}>refs</span>
				{/if}
				{#if im.isSeedCopy}
					<span class="badge seed">final copy</span>
				{/if}
			</div>
		</figure>
	{/if}
{/snippet}

<svelte:head>
	<title>Images — The Kingdom</title>
</svelte:head>

<main class="page">
	<header class="mast">
		<p class="eyebrow">
			<a href={resolve('/')}>← Chronicle</a>
			<span class="dot" aria-hidden="true">·</span>
			<a href={resolve('/wiki')}>Encyclopedia</a>
			<span class="dot" aria-hidden="true">·</span>
			<span>{images.length} cues</span>
			{#if tempCount}
				<span class="dot" aria-hidden="true">·</span>
				<span>{tempCount} temp</span>
			{/if}
			{#if refsCount}
				<span class="dot" aria-hidden="true">·</span>
				<span>{refsCount} temp + refs</span>
			{/if}
			{#if stackCount}
				<span class="dot" aria-hidden="true">·</span>
				<span>{stackCount} stacks</span>
			{/if}
			{#if seedCopyCount}
				<span class="dot" aria-hidden="true">·</span>
				<span>{seedCopyCount} final copies</span>
			{/if}
			{#if orphans.length}
				<span class="dot" aria-hidden="true">·</span>
				<span>{orphans.length} orphaned</span>
			{/if}
		</p>
		<div class="mast-row">
			<div class="titles">
				<h1>Images</h1>
				<p class="lede">
					Every cue in reading order — gallery prefers temp when present (hover to final).
					The chronicle itself shows finals first. “Refs” marks real temp regenerations, not
					jpeg copies of the final.
				</p>
			</div>
			<div class="view" role="group" aria-label="Gallery view">
				{#each VIEWS as v (v.id)}
					<button
						type="button"
						class:active={view === v.id}
						title={v.hint}
						aria-pressed={view === v.id}
						onclick={() => (view = v.id)}
					>
						{v.label}
					</button>
				{/each}
			</div>
		</div>
	</header>

	{#if view === 'grid'}
		<section class="grid" aria-label="Cue image grid">
			{#each images as im (im.key)}
				<article class="card" class:temp={im.isTemp} class:stackable={im.hasStack}>
					{@render cueThumb(im)}
					<div class="meta">
						<p class="year">{im.entryYear}</p>
						<p class="entry">{im.title}</p>
						<p class="cue">{im.slot.id}</p>
					</div>
				</article>
			{/each}
		</section>
	{:else}
		<section class="cues" aria-label="Cue image list">
			{#each images as im (im.key)}
				{@const front = frontOf(im)}
				<article class="row" class:temp={im.isTemp}>
					{@render cueThumb(im)}

					<div class="body">
						<p class="kicker">
							<span>{im.chapterTitle}</span>
							<span class="dot" aria-hidden="true">·</span>
							<span>{im.entryYear}</span>
							<span class="dot" aria-hidden="true">·</span>
							<span>beat {im.beatIndex + 1}</span>
						</p>
						<h2>{im.title}</h2>
						{#if im.entrySubtitle}
							<p class="sub">{im.entrySubtitle}</p>
						{/if}

						<dl class="facts">
							<div>
								<dt>Slot</dt>
								<dd>{im.slot.id}</dd>
							</div>
							{#if im.at}
								<div>
									<dt>At</dt>
									<dd>“{im.at}”</dd>
								</div>
							{/if}
							{#if im.slot.alt}
								<div>
									<dt>Alt</dt>
									<dd>{im.slot.alt}</dd>
								</div>
							{/if}
							{#if im.hasStack}
								<div>
									<dt>Layers</dt>
									<dd>
										<button type="button" class="layer-toggle" onclick={() => cycleStack(im)}>
											showing {front} — switch to {front === 'temp' ? 'final' : 'temp'}
										</button>
									</dd>
								</div>
							{/if}
						</dl>

						{#if im.cueContext}
							<p class="context">{im.cueContext}</p>
						{/if}

						{#if im.prompt || im.refs.length || im.hasStack || im.isSeedCopy}
							<div class="temp-panel">
								{#if im.hasStack}
									{@const tempSrc = layerSrc(im, 'temp')}
									{@const finalSrc = layerSrc(im, 'final')}
									<div class="stack-preview">
										<p class="panel-label">Temp / final stack</p>
										<ul class="stack-thumbs">
											<li class:active={front === 'temp'}>
												<button type="button" onclick={() => (stackFront[im.key] = 'temp')}>
													{#if tempSrc}
														<img
															{...storyImg(tempSrc, {
																kind: 'thumb',
																alt: '',
																sizes: '72px'
															})}
														/>
													{/if}
													<span>temp</span>
												</button>
											</li>
											<li class:active={front === 'final'}>
												<button type="button" onclick={() => (stackFront[im.key] = 'final')}>
													{#if finalSrc}
														<img
															{...storyImg(finalSrc, {
																kind: 'thumb',
																alt: '',
																sizes: '72px'
															})}
														/>
													{/if}
													<span>final</span>
												</button>
											</li>
										</ul>
									</div>
								{/if}
								{#if im.isSeedCopy}
									<p class="no-refs">
										Temp file is a jpeg copy of the final — not a ref-based regeneration yet.
									</p>
								{/if}
								{#if im.prompt}
									<div class="prompt-block">
										<p class="panel-label">Prompt</p>
										<pre class="prompt">{im.prompt}</pre>
									</div>
								{/if}
								{#if im.refs.length}
									<div class="refs-block">
										<p class="panel-label">
											Reference images{#if im.hasGenuineRefs}
												{#if im.hasExplicitRefs}
													<span class="ref-kind">explicit</span>
												{:else}
													<span class="ref-kind">inferred</span>
												{/if}
											{:else}
												<span class="ref-kind">planned</span>
											{/if}
										</p>
										<ul class="refs">
											{#each im.refs as ref (ref.src)}
												<li>
													<img
														{...storyImg(ref.src, { kind: 'thumb', alt: '', sizes: '48px' })}
													/>
													<span>{ref.label}</span>
												</li>
											{/each}
										</ul>
									</div>
								{:else if im.prompt}
									<p class="no-refs">No reference images on this slot.</p>
								{/if}
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</section>
	{/if}

	{#if orphans.length}
		<section class="orphans" aria-label="Orphaned images">
			<header class="orphan-head">
				<h2>Orphaned</h2>
				<p>
					{orphans.length} file{orphans.length === 1 ? '' : 's'} in <code>static/temp/</code> with no
					matching cue id in the chronicle.
				</p>
			</header>
			<div class="grid orphan-grid">
				{#each orphans as o (o.src)}
					<article class="card orphan">
						<figure class="thumb" style:--tone="#3a3a40">
							<img {...storyImg(o.src, { kind: 'cue', alt: '', sizes: '180px' })} />
							<div class="badges">
								<span class="badge orphan-badge">orphan</span>
							</div>
						</figure>
						<div class="meta">
							<p class="year">{o.kind}</p>
							<p class="entry">{o.id}</p>
							<p class="cue">{o.src}</p>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</main>

<style>
	.page {
		min-height: 100dvh;
		padding: max(1.75rem, env(safe-area-inset-top, 0px) + 1rem)
			max(1.5rem, env(safe-area-inset-right, 0px) + 1rem)
			max(3rem, env(safe-area-inset-bottom, 0px) + 2rem)
			max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1.85rem));
		background:
			radial-gradient(ellipse 70% 45% at 8% 0%, rgba(216, 178, 106, 0.08), transparent 55%),
			radial-gradient(ellipse 55% 40% at 92% 8%, rgba(62, 121, 228, 0.05), transparent 50%),
			var(--bg);
		color: var(--fg);
	}

	.mast {
		max-width: 72rem;
		margin: 0 auto 1.75rem;
	}

	.eyebrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
		margin: 0 0 0.85rem;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.eyebrow a {
		font: inherit;
		color: var(--fg-dim);
		text-decoration: none;
		transition: color 0.2s var(--ease);
	}

	.eyebrow a:hover {
		color: var(--gold);
	}

	.dot {
		opacity: 0.5;
	}

	.mast-row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.25rem 1.5rem;
	}

	.titles {
		flex: 1 1 18rem;
		min-width: 0;
	}

	.mast h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.85rem, 2.4vw, 2.45rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: #fffdf8;
	}

	.lede {
		margin: 0.7rem 0 0;
		max-width: 36rem;
		font-size: 0.95rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.view {
		display: flex;
		gap: 1px;
		padding: 2px;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: var(--glass);
		backdrop-filter: blur(14px);
		flex-shrink: 0;
	}

	.view button {
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
		background: transparent;
		border: none;
		border-radius: 999px;
		padding: 0.28rem 0.85rem;
		cursor: pointer;
		transition:
			background 0.25s var(--ease),
			color 0.25s var(--ease);
	}

	.view button:hover {
		color: var(--fg);
	}

	.view button.active {
		color: #14140f;
		background: var(--gold);
	}

	.grid {
		max-width: 72rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
		gap: 0.85rem 0.75rem;
	}

	.card {
		display: grid;
		gap: 0.45rem;
		min-width: 0;
	}

	.thumb {
		position: relative;
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		border-radius: 8px;
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--tone) 55%, #14141a);
		font: inherit;
		color: inherit;
		text-align: left;
	}

	button.thumb.stack {
		cursor: pointer;
		overflow: visible;
	}

	button.thumb.stack:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.thumb img,
	.layer {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.stack-layers {
		position: absolute;
		inset: 0;
	}

	.stack-layers .layer {
		position: absolute;
		inset: 0;
		border-radius: 8px;
		border: 1px solid var(--hairline);
		transition:
			transform 280ms var(--ease),
			opacity 280ms var(--ease),
			box-shadow 280ms var(--ease);
	}

	.stack-layers .temp-layer {
		z-index: 2;
		transform: translate(0, 0) rotate(0deg);
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
	}

	.stack-layers .final-layer {
		z-index: 1;
		transform: translate(10px, 8px) rotate(2.2deg);
		opacity: 0.92;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
	}

	.stack-layers.final-front .final-layer {
		z-index: 2;
		transform: translate(0, 0) rotate(0deg);
		opacity: 1;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
	}

	.stack-layers.final-front .temp-layer {
		z-index: 1;
		transform: translate(-10px, 8px) rotate(-2deg);
		opacity: 0.88;
	}

	.layer-chip {
		position: absolute;
		z-index: 4;
		right: 0.4rem;
		bottom: 0.4rem;
		padding: 0.08rem 0.4rem;
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		border-radius: 999px;
		color: #14140f;
		background: #fffdf8;
	}

	.layer-chip[data-kind='temp'] {
		background: var(--gold);
	}

	.ph {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		padding: 0.75rem;
	}

	.ph-id {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.65);
		text-align: center;
		word-break: break-word;
	}

	.badges {
		position: absolute;
		z-index: 4;
		top: 0.4rem;
		left: 0.4rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		max-width: calc(100% - 0.8rem);
	}

	.badge {
		padding: 0.08rem 0.4rem;
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #14140f;
		background: var(--gold);
		border-radius: 999px;
	}

	.badge.refs {
		background: color-mix(in srgb, #7eb6ff 70%, #fffdf8);
		color: #0f1720;
	}

	.badge.refs.explicit {
		background: #7eb6ff;
	}

	.badge.orphan-badge {
		background: color-mix(in srgb, var(--fg-faint) 55%, #14141a);
		color: #fffdf8;
	}

	.badge.seed {
		background: color-mix(in srgb, var(--fg-faint) 40%, #fffdf8);
		color: #2a2a28;
	}

	.meta {
		display: grid;
		gap: 0.12rem;
		padding: 0 0.1rem;
	}

	.year {
		margin: 0;
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.entry {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.88rem;
		letter-spacing: var(--tracking-display);
		color: #fffdf8;
		line-height: 1.25;
	}

	.cue {
		margin: 0;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--fg-dim);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.cues {
		max-width: 52rem;
		margin: 0 auto;
		display: grid;
		gap: 1.15rem;
	}

	.row {
		display: grid;
		grid-template-columns: minmax(9rem, 14rem) minmax(0, 1fr);
		gap: 1.1rem 1.25rem;
		padding: 1rem 0;
		border-top: 1px solid var(--hairline);
	}

	.row:first-child {
		border-top: none;
		padding-top: 0;
	}

	.row .thumb {
		width: 100%;
		aspect-ratio: 3 / 2;
	}

	.body {
		min-width: 0;
		display: grid;
		gap: 0.45rem;
		align-content: start;
	}

	.kicker {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.body h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.15;
		color: #fffdf8;
	}

	.sub {
		margin: 0;
		font-size: 0.85rem;
		color: var(--fg-dim);
	}

	.facts {
		margin: 0.15rem 0 0;
		display: grid;
		gap: 0.35rem;
	}

	.facts > div {
		display: grid;
		grid-template-columns: 3.2rem minmax(0, 1fr);
		gap: 0.55rem;
		align-items: baseline;
	}

	.facts dt {
		margin: 0;
		font-size: 0.66rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.facts dd {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.4;
		color: var(--fg-dim);
	}

	.layer-toggle {
		font: inherit;
		font-size: 0.86rem;
		color: var(--gold);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.context {
		margin: 0.2rem 0 0;
		padding: 0.65rem 0.75rem;
		font-family: var(--serif);
		font-size: 0.88rem;
		line-height: 1.45;
		letter-spacing: var(--tracking-body);
		color: rgba(255, 253, 248, 0.82);
		background: color-mix(in srgb, var(--panel) 70%, transparent);
		border: 1px solid var(--hairline);
		border-radius: 8px;
	}

	.temp-panel {
		margin-top: 0.35rem;
		display: grid;
		gap: 0.85rem;
		padding: 0.85rem 0.9rem;
		border: 1px solid rgba(216, 178, 106, 0.22);
		border-radius: 10px;
		background: color-mix(in srgb, var(--gold) 6%, var(--panel-sunken));
	}

	.panel-label {
		margin: 0 0 0.4rem;
		font-size: 0.66rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--gold);
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.ref-kind {
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		padding: 0.06rem 0.35rem;
		border-radius: 999px;
		color: #0f1720;
		background: color-mix(in srgb, #7eb6ff 70%, #fffdf8);
	}

	.prompt {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: var(--serif);
		font-size: 0.78rem;
		line-height: 1.45;
		color: rgba(255, 253, 248, 0.78);
	}

	.stack-thumbs {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		gap: 0.65rem;
	}

	.stack-thumbs li button {
		display: grid;
		gap: 0.25rem;
		width: 5.5rem;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		font: inherit;
		color: var(--fg-dim);
	}

	.stack-thumbs img {
		width: 5.5rem;
		height: 3.4rem;
		object-fit: cover;
		border-radius: 6px;
		border: 1px solid var(--hairline);
		opacity: 0.7;
		transition:
			opacity 200ms var(--ease),
			border-color 200ms var(--ease);
	}

	.stack-thumbs li.active img {
		opacity: 1;
		border-color: var(--gold);
	}

	.stack-thumbs span {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.refs {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.refs li {
		display: grid;
		gap: 0.25rem;
		width: 4.5rem;
	}

	.refs img {
		display: block;
		width: 4.5rem;
		height: 4.5rem;
		object-fit: cover;
		object-position: center top;
		border-radius: 6px;
		border: 1px solid var(--hairline);
		background: var(--panel-sunken);
	}

	.refs span {
		font-size: 0.62rem;
		line-height: 1.25;
		color: var(--fg-dim);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.no-refs {
		margin: 0;
		font-size: 0.78rem;
		color: var(--fg-faint);
	}

	.orphans {
		max-width: 72rem;
		margin: 3rem auto 0;
		padding-top: 2rem;
		border-top: 1px solid var(--hairline);
	}

	.orphan-head {
		margin-bottom: 1.1rem;
	}

	.orphan-head h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.45rem;
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		color: #fffdf8;
	}

	.orphan-head p {
		margin: 0.45rem 0 0;
		font-size: 0.88rem;
		color: var(--fg-dim);
	}

	.orphan-head code {
		font-size: 0.82em;
		color: var(--gold);
	}

	@media (max-width: 700px) {
		.row {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.row .thumb {
			max-width: 20rem;
		}

		.grid {
			grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stack-layers .layer {
			transition: none;
		}
	}
</style>
