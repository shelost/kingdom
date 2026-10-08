<script lang="ts">
	import { reading, leadLang } from '$lib/reading.svelte';
	import { KINGDOMS, koreanOf, type Person } from '$lib/people';
	import { speakerName, type Mail } from '$lib/chat';
	import { handleOf } from '$lib/tweet';
	import { recordBook } from '$lib/recordBooks';
	import SocialFace from './SocialFace.svelte';

	/**
	 * A letter as an email. The first of a thread carries the subject and the
	 * sender; the rest run on in the same card. A record of the same letter comes
	 * in forwarded from the book that keeps it. Hybrid dialogue only.
	 */
	let {
		mail,
		from,
		to,
		year = null,
		look,
		lines = [],
		record,
		above = false,
		below = false
	}: {
		mail: Mail;
		/** The same email sits right above / below this card, so the edges join. */
		above?: boolean;
		below?: boolean;
		from?: Person;
		to?: Person;
		year?: number | null;
		look?: string;
		/** The letter's own words: what the reader reads first, and the other tongue under it. */
		lines?: { lead: string; sub?: string }[];
		/** A record of the letter: the original and its translation. */
		record?: { source: string; hanja?: string; html: string; ko?: string };
	} = $props();

	let ko = $derived(reading.lang === 'ko');
	let koFirst = $derived(leadLang(reading.lang) === 'ko');
	let name = (p: Person) => (ko ? (koreanOf(p, year) ?? speakerName(p, year)) : speakerName(p, year));
	let address = $derived.by(() => {
		if (!from) return '';
		const domain = (KINGDOMS[from.kingdom]?.label ?? from.kingdom ?? 'samhan').toLowerCase().replace(/\W+/g, '');
		return `${handleOf(from, year, look).slice(1).toLowerCase()}@${domain}.gov`;
	});
	let book = $derived(record ? recordBook(record.source) : undefined);
	let trimmed = $state(true);
</script>

<article class="mail" class:cont={above} class:more={below} class:reopen={!mail.head && !above}>
	{#if mail.head}
		<header class="mail-subject">
			<h3>{ko && mail.subject.ko ? mail.subject.ko : mail.subject.en}</h3>
			<span class="mail-label">{ko ? '받은편지함' : 'Inbox'}</span>
		</header>
		<div class="mail-from">
			{#if from}
				<SocialFace person={from} {year} {look} size="40px" />
			{/if}
			<div class="mail-who">
				<span class="mail-sender">
					{#if from}
						<span class="mail-name person" data-person={from.id}>{name(from)}</span>
						<span class="mail-address">&lt;{address}&gt;</span>
					{:else if book}
						<span class="mail-name">{book.name}</span>
					{/if}
				</span>
				<span class="mail-to">
					{ko ? '받는 사람:' : 'to'}
					{#if to}<span class="person" data-person={to.id}>{name(to)}</span>{:else}{ko ? '나' : 'me'}{/if}
				</span>
			</div>
			<svg class="mail-star" viewBox="0 0 24 24" aria-hidden="true"
				><path
					d="M12 17.3 18.2 21l-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.5 14l-1.7 7z"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linejoin="round"
				/></svg
			>
		</div>
	{/if}

	<div class="mail-body">
		{#each lines as line, i (i)}
			<p>
				<span class="mail-lead">{@html line.lead}</span>
				{#if line.sub}<span class="mail-sub">{@html line.sub}</span>{/if}
			</p>
		{/each}

		{#if record}
			<div class="mail-forward">
				<span class="mail-forward-rule"
					>---------- {ko ? '전달된 메일' : 'Forwarded message'} ---------</span
				>
				<span class="mail-forward-meta"
					>{ko ? '보낸 사람:' : 'From:'} <b>{book?.name ?? record.source}</b>{book?.ko ? ` · ${book.ko}` : ''}</span
				>
				<p class="mail-lead">{@html koFirst && record.ko ? record.ko : record.html}</p>
				{#if record.hanja}
					<button
						type="button"
						class="mail-trim"
						aria-expanded={!trimmed}
						aria-label={ko ? '원문 보기' : 'Show the original'}
						onclick={() => (trimmed = !trimmed)}>•••</button
					>
					{#if !trimmed}<p class="mail-original" lang="zh-Hant">{record.hanja}</p>{/if}
				{/if}
			</div>
		{/if}
	</div>

	{#if !mail.more}
		<footer class="mail-actions" aria-hidden="true">
			<span class="mail-btn">
				<svg viewBox="0 0 24 24"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" /></svg>
				{ko ? '답장' : 'Reply'}
			</span>
			<span class="mail-btn">
				<svg viewBox="0 0 24 24"><path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" /></svg>
				{ko ? '전달' : 'Forward'}
			</span>
		</footer>
	{/if}
</article>

<style>
	.mail {
		--mail-bg: #ffffff;
		--mail-ink: #1f1f1f;
		--mail-dim: #5e5e5e;
		--mail-rule: #e3e3e3;
		--mail-chip: #e8eaed;
		margin: var(--widget-gap) 0;
		padding: 1rem 1.15rem;
		font-family: 'Google Sans', Roboto, -apple-system, system-ui, 'Noto Sans KR', sans-serif;
		color: var(--mail-ink);
		background: var(--mail-bg);
		border: 1px solid var(--mail-rule);
		border-radius: 0.75rem;
		letter-spacing: normal;
	}

	:global(html:not([data-theme='light'])) .mail {
		--mail-bg: #1f1f1f;
		--mail-ink: #e3e3e3;
		--mail-dim: #a8a8a8;
		--mail-rule: #3c3c3c;
		--mail-chip: #3c4043;
	}

	.mail.more {
		margin-bottom: 0;
		padding-bottom: 0.25rem;
		border-bottom: none;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.mail.cont {
		padding-top: 0.25rem;
		border-top: none;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.mail.cont {
		margin-top: 0;
	}

	/* The same email, picked up again after narration or a still. */
	.mail.reopen {
		border-top-style: dashed;
	}

	.mail-subject {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.9rem;
	}

	.mail-subject h3 {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 400;
		line-height: 1.3;
		color: var(--mail-ink);
	}

	.mail-label {
		padding: 0.05rem 0.4rem;
		font-size: 0.72rem;
		color: var(--mail-dim);
		background: var(--mail-chip);
		border-radius: 0.25rem;
	}

	.mail-from {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-bottom: 0.9rem;
	}

	.mail-who {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-width: 0;
		font-size: 0.8rem;
		line-height: 1.35;
	}

	.mail-sender {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.mail .mail-name {
		font: inherit;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--mail-ink);
		background: none;
		border: none;
		padding: 0;
	}

	.mail-address,
	.mail-to {
		color: var(--mail-dim);
	}

	.mail-to .person {
		font: inherit;
		color: var(--mail-dim);
		background: none;
		border: none;
		padding: 0;
	}

	.mail-star {
		flex: none;
		width: 1.2rem;
		height: 1.2rem;
		color: var(--mail-dim);
	}

	.mail-body {
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.mail-body p {
		margin: 0 0 0.75rem;
		color: var(--mail-ink);
	}

	.mail-lead,
	.mail-sub {
		display: block;
	}

	.mail-sub {
		margin-top: 0.15rem;
		font-size: 0.85em;
		color: var(--mail-dim);
	}

	.mail-forward {
		display: grid;
		gap: 0.3rem;
		font-size: 0.85rem;
		color: var(--mail-dim);
	}

	.mail-forward-meta b {
		font-weight: 600;
		color: var(--mail-ink);
	}

	.mail-forward .mail-lead {
		margin: 0.35rem 0 0;
	}

	.mail-trim {
		justify-self: start;
		padding: 0 0.45rem;
		font: inherit;
		font-size: 0.7rem;
		line-height: 1.1rem;
		letter-spacing: 0.1em;
		color: var(--mail-dim);
		background: var(--mail-chip);
		border: none;
		border-radius: 0.3rem;
		cursor: pointer;
	}

	.mail-forward .mail-original {
		margin: 0.2rem 0 0;
		padding-left: 0.7rem;
		font-family: 'Noto Serif TC', 'Noto Serif KR', serif;
		color: var(--mail-dim);
		border-left: 2px solid var(--mail-rule);
	}

	.mail-actions {
		display: flex;
		gap: 0.6rem;
		margin-top: 0.5rem;
	}

	.mail-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 1rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--mail-ink);
		border: 1px solid var(--mail-rule);
		border-radius: 999px;
	}

	.mail-btn svg {
		width: 1.05rem;
		height: 1.05rem;
		fill: currentColor;
	}

	@media (max-width: 480px) {
		.mail {
			padding: 0.85rem 0.9rem;
		}

		.mail-subject h3 {
			font-size: 1.1rem;
		}

		.mail-address {
			display: none;
		}
	}
</style>
