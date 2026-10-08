<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { KINGDOMS, colorOf, type Person } from '$lib/people';
	import { hash } from '$lib/tweet';
	import SocialFace from './SocialFace.svelte';

	/**
	 * A promotion or a coronation, announced the way the court would if it had
	 * LinkedIn: the new headline, the “starting a new position” card, and the
	 * reactions. Hybrid dialogue only; PersonCard decides when.
	 */
	let {
		person,
		name,
		nameKo,
		headline,
		headlineKo,
		previous,
		art,
		square = false,
		crowned = false,
		caption,
		captionKo
	}: {
		person: Person;
		/** English name in the new stage (King Jumong). */
		name: string;
		nameKo?: string;
		/** The new title: the LinkedIn headline and the position. */
		headline?: string;
		headlineKo?: string;
		/** The title they leave behind (Exile from Buyeo). */
		previous?: string;
		art: string | null;
		/** The monarch's square frame. */
		square?: boolean;
		/** A crown, not a promotion: a humbler opening line. */
		crowned?: boolean;
		caption?: string;
		captionKo?: string;
	} = $props();

	let ko = $derived(reading.lang === 'ko');
	let org = $derived(KINGDOMS[person.kingdom]?.label ?? '');
	/** "First King of Goryeo" already names the house; anything else is "at Silla". */
	let position = $derived(
		headline && (/\bof\b/i.test(headline) || !org) ? headline : headline ? `${headline} at ${org}` : org
	);
	let seed = $derived(hash(`${person.id}|${headline ?? ''}`));
	let reactions = $derived(120 + (seed % 880) * (crowned ? 9 : 2));
	let comments = $derived(8 + (seed % 97));
	let reposts = $derived(3 + ((seed >>> 7) % 41));
	let tag = $derived(org.replace(/\W+/g, ''));

	const REACTIONS = ['thumb', 'heart', 'clap'] as const;
	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<article class="li-post" style:--accent={colorOf(person)} aria-label="{name} — {headline ?? ''}">
	<header class="li-head">
		<SocialFace {person} {art} {square} size="48px" />
		<div class="li-who">
			<span class="li-name-row">
				<span class="li-name person" data-person={person.id}>{ko && nameKo ? nameKo : name}</span>
				<svg class="li-verified" viewBox="0 0 32 32" aria-label="Verified" role="img">
					<path d="M14 17.1006L12 15.1006L9.5 17.6006L14.5 22.6006L23.5 11.1006H19L14 17.1006Z" />
					<path
						d="M29.5 5.83496V18.625L29.4355 18.8721C29.1926 19.8081 28.6254 20.8745 27.9355 21.8984C27.2212 22.9587 26.2837 24.1078 25.1758 25.2178C22.9829 27.4148 19.9727 29.6064 16.5176 30.5322L16 30.6709L15.4824 30.5322C12.2168 29.6572 9.20791 27.4572 6.9873 25.2715C5.86002 24.1619 4.88745 23.0079 4.1416 21.9434C3.4271 20.9235 2.81463 19.836 2.56445 18.8721L2.5 18.625V5.83496L16 1.5L29.5 5.83496ZM6.5 8.75098V18.0537C6.62567 18.3757 6.90768 18.9215 7.41699 19.6484C8.01258 20.4985 8.82491 21.468 9.79297 22.4209C11.6186 24.2179 13.8332 25.7936 16.0039 26.5127C18.3564 25.7518 20.5775 24.1631 22.3447 22.3926C23.2818 21.4537 24.0549 20.5005 24.6191 19.6631C25.1005 18.9486 25.3739 18.3983 25.5 18.0605V8.75098L16 5.7002L6.5 8.75098Z"
					/>
				</svg>
				<span class="li-degree">· 1st</span>
			</span>
			{#if headline}<span class="li-headline">{ko && headlineKo ? headlineKo : headline}</span>{/if}
			<span class="li-time">
				{ko ? '방금' : 'Just now'} •
				<svg class="li-globe" viewBox="0 0 16 16" aria-hidden="true">
					<path
						d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z"
					/>
				</svg>
			</span>
		</div>
	</header>

	<div class="li-body">
		{#if ko}
			<p>기쁜 소식을 전합니다. 새 직책을 맡게 되었습니다{headlineKo ? ` — ${headlineKo}` : ''}.</p>
			{#if captionKo}<p>{captionKo}</p>{/if}
		{:else}
			<p>
				{crowned ? 'Humbled to share' : 'I’m happy to share'} that I’m starting a new position as {headline ??
					'something new'}{crowned ? '.' : '!'}
			</p>
			{#if previous}<p>Grateful to everyone who stood with me as {previous}.</p>{/if}
			{#if caption}<p>{caption}</p>{/if}
			{#if tag}<p class="li-tags">#NewBeginnings #{tag}</p>{/if}
		{/if}
	</div>

	<div class="li-card" aria-hidden="true">
		<span class="li-confetti"></span>
		<SocialFace {person} {art} {square} size="4.5rem" class="li-card-face" />
		<span class="li-card-title">{ko ? '새 직책 시작' : 'Starting a New Position'}</span>
		<span class="li-card-sub">{ko ? (headlineKo ?? nameKo ?? name) : position}</span>
	</div>

	<footer class="li-foot">
		<div class="li-counts">
			<span class="li-reacts">
				{#each REACTIONS as r (r)}
					<img src={staticAsset(`/linkedin/reaction-${r}.svg`)} alt="" />
				{/each}
				<span>{fmt(reactions)}</span>
			</span>
			<span>{fmt(comments)} {ko ? '댓글' : 'comments'} · {fmt(reposts)} {ko ? '퍼감' : 'reposts'}</span>
		</div>
		<div class="li-actions" aria-hidden="true">
			<span class="li-act">
				<svg viewBox="0 0 24 24"><path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.86V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z" /></svg>
				{ko ? '좋아요' : 'Like'}
			</span>
			<span class="li-act">
				<svg viewBox="0 0 24 24"><path d="M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L19 15a4.79 4.79 0 002-4z" /></svg>
				{ko ? '댓글' : 'Comment'}
			</span>
			<span class="li-act">
				<svg viewBox="0 0 24 24"><path d="M13.96 5H6c-.55 0-1 .45-1 1v10H3V6c0-1.66 1.34-3 3-3h7.96L12 0h2.37L17 4l-2.63 4H12l1.96-3zm5.54 3H19v10c0 .55-.45 1-1 1h-7.96L12 16H9.63L7 20l2.63 4H12l-1.96-3H18c1.66 0 3-1.34 3-3V8h-1.5z" /></svg>
				{ko ? '퍼가기' : 'Repost'}
			</span>
			<span class="li-act">
				<svg viewBox="0 0 24 24"><path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z" /></svg>
				{ko ? '보내기' : 'Send'}
			</span>
		</div>
	</footer>
</article>

<style>
	.li-post {
		--li-bg: #ffffff;
		--li-ink: rgb(0 0 0 / 0.9);
		--li-dim: rgb(0 0 0 / 0.6);
		--li-rule: rgb(0 0 0 / 0.08);
		--li-card: #eef3f8;
		--li-blue: #0a66c2;
		margin: var(--widget-gap) 0;
		overflow: hidden;
		font-family: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans KR', sans-serif;
		color: var(--li-ink);
		background: var(--li-bg);
		border: 1px solid var(--li-rule);
		border-radius: 0.5rem;
		letter-spacing: normal;
	}

	:global(html:not([data-theme='light'])) .li-post {
		--li-bg: #1b1f23;
		--li-ink: rgb(255 255 255 / 0.9);
		--li-dim: rgb(255 255 255 / 0.6);
		--li-rule: rgb(255 255 255 / 0.12);
		--li-card: #263039;
		--li-blue: #71b7fb;
	}

	.li-head {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 18px 18px 12px;
	}

	.li-who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.li-name-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-width: 0;
	}

	/* Past the story's own `.person` styling: LinkedIn's name, not a wiki link. */
	.li-post .li-name.person {
		overflow: hidden;
		font: inherit;
		font-size: 16px;
		font-weight: 650;
		line-height: 18px;
		letter-spacing: -0.12px;
		color: var(--li-ink);
		white-space: nowrap;
		text-overflow: ellipsis;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.li-post .li-name.person:hover {
		color: var(--li-blue);
		text-decoration: underline;
	}

	.li-verified {
		flex: none;
		width: 16px;
		height: 16px;
		fill: var(--li-dim);
	}

	.li-degree,
	.li-headline,
	.li-time {
		font-size: 12px;
		font-weight: 450;
		line-height: 15px;
		letter-spacing: -0.08px;
		color: var(--li-dim);
	}

	.li-headline {
		margin-top: 1px;
	}

	.li-time {
		margin-top: 2px;
	}

	.li-headline {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.li-time {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.li-globe {
		width: 0.75rem;
		height: 0.75rem;
		fill: currentColor;
	}

	.li-body {
		padding: 0 18px 0.5rem;
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.25rem;
	}

	.li-body p {
		margin: 0 0 0.6rem;
		color: var(--li-ink);
	}

	.li-tags {
		color: var(--li-blue) !important;
		font-weight: 600;
	}

	/* LinkedIn's celebration card: confetti, the new face, the new seat. */
	.li-card {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		padding: 1.4rem 1rem 1.2rem;
		text-align: center;
		background: var(--li-card);
		border-block: 1px solid var(--li-rule);
	}

	.li-confetti {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.85;
		background:
			radial-gradient(circle at 12% 22%, #f5b342 0 3px, transparent 3.5px),
			radial-gradient(circle at 84% 18%, #0a66c2 0 3px, transparent 3.5px),
			radial-gradient(circle at 22% 78%, #df704d 0 2.5px, transparent 3px),
			radial-gradient(circle at 76% 72%, #6dae4f 0 3px, transparent 3.5px),
			radial-gradient(circle at 92% 48%, var(--accent) 0 2.5px, transparent 3px),
			radial-gradient(circle at 6% 52%, var(--accent) 0 2px, transparent 2.5px),
			linear-gradient(60deg, transparent 47%, #f5b342 47% 53%, transparent 53%) 30% 30% / 10px 10px no-repeat,
			linear-gradient(-30deg, transparent 47%, #378fe9 47% 53%, transparent 53%) 66% 82% / 10px 10px no-repeat;
	}

	.li-card :global(.li-card-face) {
		position: relative;
		margin-bottom: 0.45rem;
		border: 3px solid var(--li-bg);
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
	}

	.li-card-title {
		position: relative;
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--li-ink);
	}

	.li-card-sub {
		position: relative;
		font-size: 0.85rem;
		color: var(--li-dim);
	}

	.li-foot {
		padding: 0 18px;
	}

	.li-counts {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.5rem 0;
		font-size: 0.75rem;
		color: var(--li-dim);
		border-bottom: 1px solid var(--li-rule);
	}

	.li-reacts {
		display: inline-flex;
		align-items: center;
	}

	.li-reacts img {
		width: 1rem;
		height: 1rem;
		margin-right: -0.2rem;
		border-radius: 50%;
		box-shadow: 0 0 0 1.5px var(--li-bg);
		background: var(--li-bg);
	}

	.li-reacts span {
		margin-left: 0.5rem;
	}

	.li-actions {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		padding: 0.25rem 0;
	}

	.li-act {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.6rem 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--li-dim);
		border-radius: 0.25rem;
	}

	.li-act svg {
		width: 1.25rem;
		height: 1.25rem;
		fill: currentColor;
	}

	@media (max-width: 480px) {
		.li-act {
			flex-direction: column;
			gap: 0.1rem;
			font-size: 0.72rem;
		}
	}
</style>
