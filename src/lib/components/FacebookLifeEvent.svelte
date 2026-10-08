<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { colorOf, koreanOf, type Person } from '$lib/people';
	import { speakerName } from '$lib/chat';
	import { hash } from '$lib/tweet';
	import SocialFace from './SocialFace.svelte';

	/**
	 * A wedding, the way Facebook would announce it: the life event, both faces
	 * under a heart, the reactions. Hybrid dialogue only; Blocks decides when.
	 */
	let { couple, year = null }: { couple: [Person, Person]; year?: number | null } = $props();

	let ko = $derived(reading.lang === 'ko');
	let names = $derived(
		couple.map((p) => (ko ? (koreanOf(p, year) ?? speakerName(p, year)) : speakerName(p, year)))
	);
	let seed = $derived(hash(couple.map((p) => p.id).join('|')));
	let reactions = $derived(240 + (seed % 2400));
	let comments = $derived(18 + ((seed >>> 5) % 180));
	let shares = $derived(2 + ((seed >>> 11) % 30));
	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

<article class="fb-post" style:--a={colorOf(couple[0])} style:--b={colorOf(couple[1])}>
	<header class="fb-head">
		<SocialFace person={couple[0]} {year} size="40px" />
		<div class="fb-who">
			<span class="fb-line">
				{#if ko}
					<span class="fb-name person" data-person={couple[0].id}>{names[0]}</span> 님이
					<span class="fb-name person" data-person={couple[1].id}>{names[1]}</span> 님과 결혼했습니다.
				{:else}
					<span class="fb-name person" data-person={couple[0].id}>{names[0]}</span> is married to
					<span class="fb-name person" data-person={couple[1].id}>{names[1]}</span>.
				{/if}
			</span>
			<span class="fb-time">
				{ko ? '방금' : 'Just now'} ·
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><path
						d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a2 2 0 110 4 2 2 0 010-4zm3.5 8.5h-7v-.75C4.5 9.23 6.06 8.5 8 8.5s3.5.73 3.5 2.25z"
					/></svg
				>
			</span>
		</div>
	</header>

	<div class="fb-event" aria-hidden="true">
		<div class="fb-pair">
			<SocialFace person={couple[0]} {year} size="5rem" class="fb-pair-face" />
			<span class="fb-heart">
				<svg viewBox="0 0 24 24"
					><path
						d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 3 5 6.6 5c2 0 3.6 1.1 5.4 3.1C13.8 6.1 15.4 5 17.4 5 21 5 23 8.6 21.6 11.8 19.5 16.4 12 21 12 21z"
					/></svg
				>
			</span>
			<SocialFace person={couple[1]} {year} size="5rem" class="fb-pair-face" />
		</div>
		<span class="fb-event-title">{ko ? `${names[1]} 님과 결혼` : `Married to ${names[1]}`}</span>
		<span class="fb-event-sub">{ko ? '인생 이벤트' : 'Life event'}</span>
	</div>

	<footer class="fb-foot">
		<div class="fb-counts">
			<span class="fb-reacts">
				<svg class="fb-like" viewBox="0 0 16 16" aria-hidden="true"
					><circle cx="8" cy="8" r="8" /><path
						fill="#fff"
						d="M12.2 7.4c0-.6-.5-1-1-1H8.9l.4-1.9v-.2c0-.3-.1-.5-.3-.7L8.5 3 5.6 5.9c-.2.2-.3.4-.3.7v4.2c0 .6.5 1 1 1h3.8c.4 0 .8-.3.9-.6l1.1-2.6c0-.1.1-.2.1-.4v-.8zM3.4 6.6h1.1v5.2H3.4z"
					/></svg
				>
				<svg class="fb-love" viewBox="0 0 16 16" aria-hidden="true"
					><circle cx="8" cy="8" r="8" /><path
						fill="#fff"
						d="M8 12.2s-3.6-2.2-4.6-4.4C2.7 6.3 3.7 4.6 5.4 4.6c1 0 1.7.5 2.6 1.5.9-1 1.6-1.5 2.6-1.5 1.7 0 2.7 1.7 2 3.2C11.6 10 8 12.2 8 12.2z"
					/></svg
				>
				<span>{fmt(reactions)}</span>
			</span>
			<span
				>{fmt(comments)}
				{ko ? '댓글' : 'comments'} · {fmt(shares)}
				{ko ? '공유' : 'shares'}</span
			>
		</div>
		<div class="fb-actions" aria-hidden="true">
			<span class="fb-act">
				<svg viewBox="0 0 20 20"
					><path
						d="M6.5 8.5 9.8 2.6c.9 0 1.7.8 1.7 1.7v3.2h4.2c1 0 1.7.9 1.5 1.9l-1.1 6.1c-.1.8-.8 1.4-1.6 1.4H6.5zM2.5 8.5h2.5v8.9H2.5z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linejoin="round"
					/></svg
				>
				{ko ? '좋아요' : 'Like'}
			</span>
			<span class="fb-act">
				<svg viewBox="0 0 20 20"
					><path
						d="M10 2.5c4.4 0 7.5 3 7.5 6.8S14.4 16 10 16c-.9 0-1.8-.1-2.6-.4L3.5 17.5l.9-3.4C3.2 12.9 2.5 11.2 2.5 9.3 2.5 5.5 5.6 2.5 10 2.5z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linejoin="round"
					/></svg
				>
				{ko ? '댓글 달기' : 'Comment'}
			</span>
			<span class="fb-act">
				<svg viewBox="0 0 20 20"
					><path
						d="M11.5 3.5 17.5 9l-6 5.5V11c-4 0-6.6 1.2-9 4.5.8-4.4 3.3-8 9-8.6z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linejoin="round"
					/></svg
				>
				{ko ? '공유하기' : 'Share'}
			</span>
		</div>
	</footer>
</article>

<style>
	.fb-post {
		--fb-bg: #ffffff;
		--fb-ink: #050505;
		--fb-dim: #65676b;
		--fb-rule: #ced0d4;
		--fb-event: #f0f2f5;
		margin: var(--widget-gap) 0;
		overflow: hidden;
		font-family: -apple-system, system-ui, 'Segoe UI Historic', 'Segoe UI', Helvetica, Arial, 'Noto Sans KR', sans-serif;
		color: var(--fb-ink);
		background: var(--fb-bg);
		border: 1px solid color-mix(in srgb, var(--fb-rule) 60%, transparent);
		border-radius: 0.5rem;
		letter-spacing: normal;
	}

	:global(html:not([data-theme='light'])) .fb-post {
		--fb-bg: #242526;
		--fb-ink: #e4e6eb;
		--fb-dim: #b0b3b8;
		--fb-rule: #3e4042;
		--fb-event: #3a3b3c;
	}

	.fb-head {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 12px 16px 10px;
	}

	.fb-who {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.fb-line {
		font-size: 15px;
		line-height: 20px;
	}

	.fb-post .fb-name.person {
		font: inherit;
		font-weight: 600;
		color: var(--fb-ink);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.fb-post .fb-name.person:hover {
		text-decoration: underline;
	}

	.fb-time {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 13px;
		line-height: 16px;
		color: var(--fb-dim);
	}

	.fb-time svg {
		width: 12px;
		height: 12px;
		fill: currentColor;
	}

	/* The life event: two faces under a heart on a wash of both house colours. */
	.fb-event {
		display: grid;
		justify-items: center;
		gap: 2px;
		padding: 1.6rem 1rem 1.3rem;
		text-align: center;
		background:
			radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--a) 22%, transparent), transparent 60%),
			radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--b) 22%, transparent), transparent 60%),
			var(--fb-event);
	}

	.fb-pair {
		display: flex;
		align-items: center;
		margin-bottom: 0.7rem;
	}

	.fb-pair :global(.fb-pair-face) {
		border: 3px solid var(--fb-bg);
		box-shadow: 0 2px 8px rgb(0 0 0 / 0.18);
	}

	.fb-heart {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		margin: 0 -0.7rem;
		border: 3px solid var(--fb-bg);
		border-radius: 50%;
		background: #f33e58;
	}

	.fb-heart svg {
		width: 1.1rem;
		height: 1.1rem;
		fill: #fff;
	}

	.fb-event-title {
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.fb-event-sub {
		font-size: 0.85rem;
		color: var(--fb-dim);
	}

	.fb-foot {
		padding: 0 16px;
	}

	.fb-counts {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 10px 0;
		font-size: 15px;
		color: var(--fb-dim);
		border-bottom: 1px solid var(--fb-rule);
	}

	.fb-reacts {
		display: inline-flex;
		align-items: center;
	}

	.fb-reacts svg {
		width: 18px;
		height: 18px;
		margin-right: -3px;
		border: 2px solid var(--fb-bg);
		border-radius: 50%;
		box-sizing: content-box;
	}

	.fb-like circle {
		fill: #0866ff;
	}

	.fb-love circle {
		fill: #f33e58;
	}

	.fb-reacts span {
		margin-left: 8px;
	}

	.fb-actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		padding: 4px 0;
	}

	.fb-act {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 8px 4px;
		font-size: 15px;
		font-weight: 600;
		color: var(--fb-dim);
		border-radius: 4px;
	}

	.fb-act svg {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 480px) {
		.fb-counts,
		.fb-act {
			font-size: 13px;
		}

		.fb-pair :global(.fb-pair-face) {
			width: 4rem;
			height: 4rem;
		}
	}
</style>
