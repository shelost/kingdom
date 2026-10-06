<script lang="ts">
	import { modal } from '$lib/attachments/modal';

	let { open = $bindable(false), ko = false }: { open?: boolean; ko?: boolean } = $props();
</script>

{#if open}
	<dialog
		class="about liquid-glass"
		aria-labelledby="about-title"
		{@attach modal}
		onclose={() => (open = false)}
		onclick={(e) => {
			if (e.target === e.currentTarget) open = false;
		}}
	>
		<div class="sheet">
			<header>
				<h2 id="about-title">{ko ? '소개' : 'About'}</h2>
				<button type="button" class="close" aria-label="Close" onclick={() => (open = false)}>
					<span class="material-symbols-outlined" aria-hidden="true">close</span>
				</button>
			</header>
			<p>
				<em>King for All</em> is a story set in 7th-century Samhan, at the end of the Three Kingdoms
				Period.
			</p>
			<p>
				Inspired by the 2009 K-Drama series <em>The Great Queen Seondeok</em>, it was supposed to be a
				webcomic series originally, but I’m putting the text version on here first for now.
			</p>
			<p>
				One major theme of this story is political satire — highlighting the absurdities of the
				social systems of each of the Three Kingdoms, and how they ultimately led to tragic and
				avoidable events.
			</p>
			<p>
				When I was a child, I used to watch dramas and movies about this period, which naturally tend
				to romanticize the heroes and stories. However, as I grew older and did more research, it
				became increasingly clear how absurd many of the situations the people of the era found
				themselves in, actually were.
			</p>
			<p>
				It also speaks to many human flaws — every character is a unique product of their
				environment, and the course of the story makes it abundantly clear how each person’s life has
				shaped who they are.
			</p>
			<p class="sign">I hope you enjoy it!</p>
		</div>
	</dialog>
{/if}

<style>
	/* Liquid glass (app.css), tinted heavier so the prose reads over the still wall. */
	.about {
		--glass-tint: 82%;
		width: min(36rem, calc(100vw - 2rem));
		max-height: min(80dvh, 44rem);
		padding: 0;
		border-radius: 18px;
		color: var(--fg);
		overflow: auto;
		animation: about-in 420ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.about::backdrop {
		background: color-mix(in srgb, black 45%, transparent);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		animation: backdrop-in 320ms ease;
	}

	.sheet {
		padding: 1.4rem 1.6rem 1.6rem;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.5rem;
		font-weight: 400;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.close {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
		transition:
			color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.close:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.close:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	.close .material-symbols-outlined {
		font-size: 1.2rem;
	}

	p {
		margin: 0 0 1.05rem;
		font-size: 0.92rem;
		font-weight: var(--weight-body);
		line-height: 1.55;
		color: var(--fg-dim);
	}

	em {
		font-style: italic;
		font-weight: 500;
		color: var(--fg);
	}

	.sign {
		margin: 1.4rem 0 0;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.05rem;
		color: var(--gold);
	}

	@keyframes about-in {
		from {
			opacity: 0;
			transform: translateY(1rem) scale(0.98);
		}
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.about,
		.about::backdrop {
			animation: none;
		}
	}
</style>
