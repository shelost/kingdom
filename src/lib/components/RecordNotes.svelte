<script module lang="ts">
	import type { RecordNote } from '$lib/story';

	const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	/**
	 * Raise each note's mark where it first appears in a translation ("Magniji*").
	 * Only text between tags is touched, so markup survives. Never used on the original.
	 */
	export function supMarks(html: string, notes: RecordNote[] | undefined): string {
		if (!notes?.length || !html) return html;
		let out = html;
		for (const n of notes) {
			if (!n.mark) continue;
			const re = new RegExp(escapeRe(n.mark));
			let done = false;
			out = out.replace(/(<[^>]*>)|([^<]+)/g, (m, tag: string | undefined, text: string | undefined) => {
				if (tag || done || !text || !re.test(text)) return m;
				done = true;
				return text.replace(re, `<sup class="note-mark">${n.mark}</sup>`);
			});
		}
		return out;
	}
</script>

<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { linkPeople } from '$lib/people';

	/** Footnotes under a record's translation: small, quiet, mark first. */
	let { notes, year = null }: { notes: RecordNote[] | undefined; year?: number | null } = $props();
</script>

{#if notes?.length}
	<ol class="record-notes">
		{#each notes as n, i (i)}
			{@const ko = reading.lang !== 'en' ? n.ko : undefined}
			{@const en = reading.lang === 'ko' && ko ? undefined : n.html}
			<li>
				<sup class="mark">{n.mark}</sup>
				<span class="text">
					{#if en}<span>{@html linkPeople(en, year)}</span>{/if}
					{#if ko}<span class="ko" lang="ko">{@html linkPeople(ko, year)}</span>{/if}
				</span>
			</li>
		{/each}
	</ol>
{/if}

<style>
	.record-notes {
		margin: 0.35rem 0 0;
		padding: 0.45rem 0 0;
		list-style: none;
		display: grid;
		gap: 0.25rem;
		border-top: 1px solid var(--rule, color-mix(in srgb, currentColor 14%, transparent));
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--text-faint, var(--fg-faint));
	}

	li {
		display: grid;
		grid-template-columns: 0.9rem minmax(0, 1fr);
		gap: 0.2rem;
	}

	.mark {
		font-size: 0.9em;
		font-weight: 700;
		line-height: 1.6;
		color: var(--text-cite, var(--gold));
	}

	.text {
		display: grid;
		gap: 0.1rem;
	}

	.ko {
		font-family: 'Noto Serif KR', var(--serif);
	}

	/* The marks raised inside the translations this list explains. */
	:global(sup.note-mark) {
		margin-left: 0.05em;
		font-size: 0.7em;
		font-style: normal;
		font-weight: 700;
		line-height: 0;
		color: var(--text-cite, var(--gold));
	}
</style>
